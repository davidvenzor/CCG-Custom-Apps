/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/UiConfig",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/dao/InspectorDAO",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/EventProvider",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/SuperInspector",
	"sap/base/Log",
	"sap/m/IconTabFilter",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
	// eslint-disable-next-line max-params
], function (UiConfig, InspectorDAO, Constants, EventProvider, InspectorModel, SuperInspector, Log, IconTabFilter,
	Controller, JSONModel) {
	"use strict";

	return Controller.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.controller.Base", {

		/**
		 * Local JSON Model for the view data
		 * @type {sap.ui.model.json.JSONModel}
		 * @private
		 */
		_viewData: null,

		/**
		 * Local JSON Model for the properties of object
		 * @type {sap.ui.model.json.JSONModel}
		 * @private
		 */
		_properties: null,

		/**
		 * Object for store the inspector tabs for the opened object
		 * @type {Object}
		 * @private
		 */
		_tabContents: null,

		/**
		 * Life-cycle event of Controller: initialization
		 * @private
		 */
		onInit: function () {
			var oView = this.getView();

			this._viewData = new JSONModel(oView.getViewData());
			this._properties = new JSONModel();

			oView.setModel(this._viewData, "__viewData");
			oView.setModel(this._properties, "properties");

			EventProvider.attachChangeTheSelectedTabOfInspector(this._changeTheSelectedTabOfInspector, this);
		},

		/**
		 * Life-cycle event of Controller: exit
		 * @private
		 */
		onExit: function () {
			EventProvider.detachChangeTheSelectedTabOfInspector(this._changeTheSelectedTabOfInspector, this);
		},

		/**
		 * Called by NavigationManager when navigation is completed
		 * @public
		 */
		onNavigatedTo: function () {
			if (!$.isEmptyObject(this._viewData.getProperty("/"))) {
				var sObjectPath = this._viewData.getProperty("/objectPath");
				var sObjectType = this._viewData.getProperty("/objectType");

				this.getView().setBusy(true);

				// Setting the last object navigated to
				InspectorModel.setLastObjectNavigatedTo(sObjectPath, sObjectType);

				// Set the possible initial properties in the oViewData
				if ($.isFunction(UiConfig.objectTypeConfig[sObjectType].extendViewDataWithInitialParams)) {
					UiConfig.objectTypeConfig[sObjectType].extendViewDataWithInitialParams(this._viewData);
				}

				// Set the initial Super Inspector related properties
				var bIsSuperInspectorRelated = this._viewData.getProperty("/superInspectorRelated") &&
					InspectorModel.getIsSuperInspectorAvailable();

				if (bIsSuperInspectorRelated) {
					this._viewData.setProperty("/isSuperInspectorEnabled", false);
					this._viewData.setProperty("/isSuperInspectorShown", false);
				}

				this._setupIconTabBar();

				this.updateSelectedTab();

				if (!InspectorModel.isTraceViewSelected() &&
				    !InspectorModel.isComparisonViewSelected()) {
					InspectorModel.selectInspectorView();
				}

				this._readObject();
			}
		},

		/**
		 * Setup the IconTabBar for the opened object
		 * @private
		 */
		_setupIconTabBar: function () {
			var oIconTabBar = this.getView().byId("idInspectorTabs");

			this._tabContents = {};
			oIconTabBar.removeAllItems();

			$.each(this._viewData.getProperty("/inspectorTabs"), function (iIndex, oInspectorTab) {
				var oInspectorTabConfig = UiConfig.inspectorTabConfig[oInspectorTab];
				var oTabContent = oInspectorTabConfig.getContent(this._viewData);
				var oController = oTabContent.getController();

				if ($.isFunction(oInspectorTabConfig.extendViewDataWithCustomParam)) {
					oInspectorTabConfig.extendViewDataWithCustomParam(this._viewData);
				}

				oIconTabBar.addItem(new IconTabFilter(oInspectorTabConfig.getIconTabFilterSettings(oTabContent)));

				this._tabContents[oInspectorTab] = oTabContent;

				if (oController && $.isFunction(oController.onActivate)) {
					oController.onActivate();
				}
			}.bind(this));
		},

		/**
		 * Reloads the content of the current inspector view
		 * @public
		 */
		reloadContent: function () {
			this.getView().setBusy(true);
			this._readObject();

			$.each(this._tabContents, function (iIndex, oElement) {
				if ($.isFunction(oElement.reloadContent)) {
					oElement.reloadContent();
				}
			});
		},

		/**
		 * Update the selected tab of the current inspector view
		 * @public
		 */
		updateSelectedTab: function () {
			var sSelectedTab = InspectorModel.getProperty("/selectedTab");

			var bSelectedTabExists = $.grep(this._viewData.getProperty("/inspectorTabs"), function (oInspectorTab) {
				return oInspectorTab === sSelectedTab;
			}).length > 0;

			if (!bSelectedTabExists) {
				InspectorModel.setProperty("/selectedTab", UiConfig.inspectorMode.inspectorTab.properties);
			}
		},

		/**
		 * Called after navigation back to this page
		 * @public
		 */
		onAfterNavBack: function () {
			var sSelectedTab = this._viewData.getProperty("/selectedTab");

			// Reseting to the parent caller after back navigation
			InspectorModel.setLastObjectNavigatedTo(
				this._viewData.getProperty("/objectPath"),
				this._viewData.getProperty("/objectType")
			);

			// Set back the tab of the parent page
			if (sSelectedTab) {
				InspectorModel.setProperty("/selectedTab", sSelectedTab);
			}

			this.getView().setBusy(false);
		},

		/**
		 * Prepare the read request for the inspected object
		 * @private
		 */
		_readObject: function () {
			var sObjectPath = this._viewData.getProperty("/objectPath");
			var sObjectType = this._viewData.getProperty("/objectType");
			var sNavigationPropertyOfProperties = this._viewData.getProperty("/navigationPropertyOfProperties");

			if (sNavigationPropertyOfProperties) {
				sObjectPath += "/" + sNavigationPropertyOfProperties;
			}

			switch (sObjectType) {
				case UiConfig.inspectorMode.objectType.Operation:
				case UiConfig.inspectorMode.objectType.SubOperation:
				case UiConfig.inspectorMode.objectType.RefOperation:
				case UiConfig.inspectorMode.objectType.RefSubOperation:
					// Trigger a read for the Standard Values in addition to the generic read
					this._readOperationInspectorData(sObjectPath);
					break;
				case UiConfig.inspectorMode.objectType.BOMComponent:
					// Trigger a read for the BOM header details in addition to the generic read
					this._readGenericInspectorData(sObjectPath, Constants.navigationProperties.BOMNode.Header);
					break;
				default:
					this._readGenericInspectorData(sObjectPath);
					break;
			}
		},

		/**
		 * Triggers the read for the operations extended with Standard values
		 * @param {String} sOperationPath - OperationSet path
		 * @private
		 */
		_readOperationInspectorData: function (sOperationPath) {
			var bIsSuperInspectorAvailable = InspectorModel.getIsSuperInspectorAvailable();
			var sConfStandardValuesPath = sOperationPath + "/" +
				Constants.navigationProperties.Operation.StandardValues;

			var aRequests = [
				InspectorDAO.read(sOperationPath, bIsSuperInspectorAvailable),
				InspectorDAO.read(sConfStandardValuesPath, false)
			];

			if (bIsSuperInspectorAvailable) {
				var sSuperStandardValuesPath = sOperationPath + "/" +
					Constants.navigationProperties.Common.Super + "/" +
					Constants.navigationProperties.Operation.StandardValues;

				aRequests.push(InspectorDAO.read(sSuperStandardValuesPath, false));
			}

			Promise.all(aRequests)
				.then(function (aData) {
					var oExtendedOperation;
					var oOperationDetails = aData[0];
					var aConfStandardValues = aData[1] && aData[1].results;

					if (bIsSuperInspectorAvailable) {
						var aSuperStandardValues = aData[2] && aData[2].results;

						oExtendedOperation = SuperInspector.attachStandardValuesToOperation(
							oOperationDetails,
							aConfStandardValues,
							aSuperStandardValues
						);
					} else {
						oExtendedOperation = oOperationDetails;
						oExtendedOperation[Constants.navigationProperties.Operation.StandardValues] =
							aConfStandardValues;
					}

					this._handleReadResponse(oExtendedOperation);
					this.getView().setBusy(false);
				}.bind(this))
				.catch(this._handleObjectNotFound.bind(this));
		},

		/**
		 * Triggers the read for Inspector entries
		 * @param {String} sPath - Object path
		 * @param {String} sExpand - Expand parameter for the request
		 * @private
		 */
		_readGenericInspectorData: function (sPath, sExpand) {
			var bIsSuperInspectorRelated = this._viewData.getProperty("/superInspectorRelated") &&
				InspectorModel.getIsSuperInspectorAvailable();

			InspectorDAO.read(sPath, bIsSuperInspectorRelated, sExpand)
				.then(function (oData) {
					this._handleReadResponse(oData);
					this.getView().setBusy(false);
				}.bind(this))
				.catch(function (oMessage) {
					if (!oMessage.isAborted) {
						this._handleObjectNotFound();
					}
				}.bind(this));
		},

		/**
		 * Triggers the corresponding event after the read data is successful
		 * @param {Object} oData - response data
		 * @private
		 */
		_handleReadResponse: function (oData) {
			var fnChangeTheViewDataBasedOnBEResponse =
				this._viewData.getProperty("/changeTheViewDataBasedOnBEResponse");

			// Set the enabled flag for the inspector tabs
			$.each(this._viewData.getProperty("/inspectorTabs"), function (iIndex, oInspectorTab) {
				var oInspectorTabConfig = UiConfig.inspectorTabConfig[oInspectorTab];

				if ($.isFunction(oInspectorTabConfig.setCustomParamBasedOnBEResponse)) {
					oInspectorTabConfig.setCustomParamBasedOnBEResponse(oData, this._viewData);
				}
			}.bind(this));

			// Set the object related properties
			if ($.isFunction(fnChangeTheViewDataBasedOnBEResponse)) {
				fnChangeTheViewDataBasedOnBEResponse(oData, this._viewData);
			}

			// Store the BE response in the _properties model
			this._properties.setData(oData);

			// Set the title and subtitle for the inspector
			var fnGetTitle = this._viewData.getProperty("/getTitle");
			var fnGetSubTitle = this._viewData.getProperty("/getSubTitle");

			if ($.isFunction(fnGetTitle) && $.isFunction(fnGetSubTitle)) {
				this._setTitleAndSubTitle(fnGetTitle(oData), fnGetSubTitle(oData));
			}

			// Call the onAfterDataReceived function of the properties tab
			if (this._tabContents[UiConfig.inspectorMode.inspectorTab.properties]) {
				var oPropertiesViewController =
					this._tabContents[UiConfig.inspectorMode.inspectorTab.properties].getController();

				if (oPropertiesViewController && $.isFunction(oPropertiesViewController.onAfterDataReceived)) {
					oPropertiesViewController.onAfterDataReceived();
				}
			}
		},

		/**
		 * Set the View data title and subtitle
		 * @param {String} sTitle - Title
		 * @param {String} sSubTitle - Subtitle
		 * @private
		 */
		_setTitleAndSubTitle: function (sTitle, sSubTitle) {
			this._viewData.setProperty("/title", sTitle);
			this._viewData.setProperty("/subTitle", sSubTitle);
		},

		/**
		 * Switch the tab of inspector to a specific one
		 * @param {Object} oEvent - Event object of UI5
		 * @private
		 */
		_changeTheSelectedTabOfInspector: function (oEvent) {
			var sInspectorTab = oEvent.getParameter("tabKey");

			switch (sInspectorTab) {
				case UiConfig.inspectorMode.inspectorTab.dependencies:
					if (this._viewData.getProperty("/isDependenciesTabEnabled")) {
						InspectorModel.setProperty("/selectedTab", sInspectorTab);
					}

					break;
				case UiConfig.inspectorMode.inspectorTab.properties:
					InspectorModel.setProperty("/selectedTab", sInspectorTab);
					break;
				default:
					Log.error(
						"The direct navigation to the " + sInspectorTab + " is not supported.",
						"You can only navigate directly to the dependencies tab.",
						"sap.i2d.lo.lib.zvchclfz.components.inspector.controller.Base");
					break;
			}
		},

		/**
		 * Handles the object not found event.
		 * If a previous page exists, navigate back. In other cases, display the object not found page.
		 * @private
		 */
		_handleObjectNotFound: function () {
			if (InspectorModel.getProperty("/isBackEnabled")) {
				EventProvider.fireNavigateBack();
			} else {
				var oView = this.getView();
				var oObjectTypeConfig = UiConfig.objectTypeConfig[UiConfig.objectNotFoundPage.objectType];

				oObjectTypeConfig.objectType = UiConfig.objectNotFoundPage.objectType;

				// Change the viewData
				this._viewData.setData(oObjectTypeConfig);

				// Setup the new IconTabBar
				this._setupIconTabBar();

				// Select the Object Not Found tab
				InspectorModel.setProperty("/selectedTab", UiConfig.objectNotFoundPage.inspectorTab);

				// Setting the last object navigated to to null so navigating again will retry
				InspectorModel.setLastObjectNavigatedTo(null, null);

				// Set the title and subtitle for the inspector
				this._setTitleAndSubTitle(oObjectTypeConfig.getTitle(), oObjectTypeConfig.getSubTitle());

				oView.setBusy(false);
			}
		}
	});
});
