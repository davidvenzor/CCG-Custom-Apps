/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/UiConfig",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/i18n",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/dao/InspectorDAO",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/EventProvider",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/NavigationManager",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/ValuesFormatter",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel"
	// eslint-disable-next-line max-params
], function (UiConfig, i18n, InspectorDAO, Constants, EventProvider, NavigationManager,
	ValuesFormatter, Controller, JSONModel, InspectorModel) {
	"use strict";

	return Controller.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.controller.Values", {
		/**
		 * Local JSON Model for store the values
		 * @private
		 */
		_values: null,

		/**
		 * Formatter functions for the values
		 * @private
		 */
		_valuesFormatter: ValuesFormatter,

		/**
		 * Contains the last read values path
		 * @type {String}
		 * @private
		 */
		_lastReadValues: null,

		/**
		 * Contains the sorter for values list
		 * @type {sap.ui.model.Sorter}
		 * @private
		 */
		_valuesSorter: null,

		/**
		 * Initializer; subscribes to events
		 * @private
		 */
		onInit: function () {
			this._values = new JSONModel({});

			this.getView().setModel(this._values, "values");

			this.getView().byId("idValuesList").getBinding("items").sort(this._getValuesSorter());

			EventProvider.attachRebindValueList(this._rebindValueList, this);
		},

		/**
		 * Called by UI5 runtime. Destructor.
		 * @private
		 */
		onExit: function () {
			EventProvider.detachRebindValueList(this._rebindValueList, this);
		},

		/**
		 * Reads the Data from the BE if the context is changed
		 * @override
		 * @public
		 */
		onBeforeRendering: function () {
			//because the inspector is does not always have values
			if (InspectorModel.getLastObjectNavigatedToPath() &&
				(
					!this._lastReadValues ||
					!InspectorModel.compareLastObjectNavigatedToPath(this._lastReadValues)
				)
			) {
				this._bindValuesToList(InspectorModel.getLastObjectNavigatedToPath());
			}

		},
		/**
		 * Rebind the value list if RebindValueList event has been fired
		 * @param {Object} oEvent - UI5 eventing object
		 * @private
		 */
		_rebindValueList: function (oEvent) {
			var sCharacteristicPath = oEvent.getParameter("csticPath");

			if (InspectorModel.getProperty("/selectedTab") === UiConfig.inspectorMode.inspectorTab.values &&
				InspectorModel.getInspectorVisibility()) {
				this._bindValuesToList(sCharacteristicPath);
			} else {
				//enforce that the model is refreshed by nullifying the lastReadProperty
				//So onBeforeRendering Triggers a BE call
				this._lastReadValues = null;
			}
		},

		/**
		 * Bind the values of characteristic to the list
		 * @param {String} sCharacteristicPath - path of the selected Characteristic
		 * @private
		 */
		_bindValuesToList: function (sCharacteristicPath) {
			var oView = this.getView(),
				fnPromise,
				oURLParameters,
				sAllValuesPath = sCharacteristicPath + "/AllValues";

			oView.setBusy(true);

			if (InspectorModel.isInspectorEditable()) {
				var oContext = oView.getModel().getContext(sCharacteristicPath);
				var oBoundObject = oContext && oContext.getObject();
				var oKeyParameters = oBoundObject ? oBoundObject :
					oView.getModel("__viewData").getProperty("/objectKeyParameters");

				oURLParameters = !$.isEmptyObject(oKeyParameters) ? {
					ContextId: oKeyParameters.ContextId,
					InstanceId: oKeyParameters.InstanceId,
					GroupId: oKeyParameters.GroupId,
					CsticId: oKeyParameters.CsticId
				} : {};
			}

			if (!$.isEmptyObject(oURLParameters)) {
				fnPromise = InspectorDAO.calculateAndFetchAlternativeValues(
					sAllValuesPath, oURLParameters);
			} else {
				fnPromise = InspectorDAO.read(sAllValuesPath);
			}

			fnPromise
				.then(function (oData) {
					this._values.setData(oData);
					oView.setBusy(false);
					//Updating last read values path after the BE is successful
					this._lastReadValues = sCharacteristicPath;
				}.bind(this))
				.catch(function () {
					oView.setBusy(false);
				});
		},

		/**
		 * Handles press event of Values list items
		 * @param {Object} oEvent - UI5 eventing object
		 * @private
		 */
		onValueItemPress: function (oEvent) {
			var oObject = oEvent.getSource().getBindingContext("values").getObject();
			var sPath = this.getView().getModel().createKey("/" + Constants.entitySets.CharacteristicValue, {
				ContextId: oObject.ContextId,
				InstanceId: oObject.InstanceId,
				GroupId: oObject.GroupId,
				CsticId: oObject.CsticId,
				ValueId: oObject.ValueId
			});

			// store the selectedTab of the view for the back navigation
			this.getView()
				.getModel("__viewData")
				.setProperty("/selectedTab", InspectorModel.getProperty("/selectedTab"));

			NavigationManager
				.getContainer()
				.getCurrentPage()
				.setBusy(true);

			NavigationManager.navigateTo(sPath, UiConfig.inspectorMode.objectType.CharacteristicValue);
		},

		/**
		 * Comparator function for sorting values
		 * Where IsMasterDataValue property is "false" it should go last
		 * @param {Object} oValueA first Value object
		 * @param {Object} oValueB second Value object
		 * @returns {Number} sorting value
		 */
		valuesComparator: function (oValueA, oValueB) {
			if (oValueA.IsMasterDataValue && !oValueB.IsMasterDataValue) {
				return -1;
			} else if (!oValueA.IsMasterDataValue && oValueB.IsMasterDataValue) {
				return 1;
			} else {
				return 0;
			}
		},

		/**
		 * Returns value group i18n text of the element (predefined or additional value) based on IsMasterDataValue
		 * @param {Object} oElement value element
		 * @returns {String} "Predefined" or "Additional"
		 */
		getValueGroup: function (oElement) {
			var bIsMasterDataValue = oElement.getModel().getProperty(oElement.getPath()).IsMasterDataValue;

			if (bIsMasterDataValue) {
				return i18n.getText("vchclf_insp_values_properties_predefined");
			} else {
				return i18n.getText("vchclf_insp_values_properties_additional");
			}
		},

		/**
		 * Returns the values sorter object
		 * This will sort values by "IsMasterDataValue" and assigns group "Predefined" / "Additional"
		 * @private
		 * @returns {Object} values sorter object
		 */
		_getValuesSorter: function () {
			if (!this._valuesSorter) {
				this._valuesSorter = new sap.ui.model.Sorter({
					path: "",
					descending: false,
					group: this.getValueGroup,
					comparator: this.valuesComparator
				});
			}

			return this._valuesSorter;
		}

	});

});
