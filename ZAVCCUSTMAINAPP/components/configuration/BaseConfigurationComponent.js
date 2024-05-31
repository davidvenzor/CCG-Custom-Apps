/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([
	"jquery.sap.global",
	"sap/i2d/lo/lib/zvchclfz/common/util/XMLFragmentCache",
	"sap/i2d/lo/lib/zvchclfz/common/type/InspectorMode",
	"sap/ui/core/UIComponent",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/dao/ConfigurationDAO",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/dao/PersonalizationDAO",
	"sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/ui/model/json/JSONModel",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/type/EmbeddingMode",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/type/VariantMatchingMode",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/type/GroupRepresentation",
	"sap/i2d/lo/lib/zvchclfz/common/util/CommandManager",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/HeaderField",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/HeaderConfiguration",
	"sap/i2d/lo/lib/zvchclfz/common/util/Toggle",
	"sap/i2d/lo/lib/zvchclfz/common/factory/ODataFacadeModelFactory",
	"sap/i2d/lo/lib/zvchclfz/common/odataFacade/ODataFacadeModel",
	"sap/ui/model/odata/v4/ODataModel",
	"sap/ui/base/ManagedObject",
	"sap/m/Button"
	// eslint-disable-next-line max-params
], function (jQuery, XMLFragmentCache, InspectorMode, UIComponent, ConfigurationDAO, PersonalizationDAO, Constants, JSONModel,
	EmbeddingMode, VariantMatchingMode, GroupRepresentation, CommandManager, HeaderField, HeaderConfiguration, Toggle,
	ODataFacadeModelFactory, ODataFacadeModel, ODataModelV4, ManagedObject, Button) {
	"use strict";

	/**
	 * The configuration component is used to display the variant configuration.
	 * 
	 * @class
	 * Creates and initializes a new Configuration Component with the given <code>sId</code> and
	 * settings.
	 * 
	 * The set of allowed entries in the <code>mSettings</code> object depends on
	 * the concrete subclass and is described there. See {@link sap.ui.core.UIComponent}
	 * for a general description of this argument.
	 *
	 * @param {string}
	 *            [sId] Optional ID for the new control; generated automatically if
	 *            no non-empty ID is given Note: this can be omitted, no matter
	 *            whether <code>mSettings</code> will be given or not!
	 * @param {object}
	 *            [mSettings] optional map/JSO
	 
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.vchclf.components.configuration.Component
	 * @extends sap.ui.core.UIComponent
	 */

	var UI_MODE = {
		CREATE: "Create",
		EDIT: "Edit",
		DISPLAY: "Display"
	};

	var VCH_CONTEXT_ELEMENTS = {
		SEMANTIC_OBJ: "semanticObject",
		OBJECT_KEY: "objectKey",
		TECHNICAL_OBJ: "technicalObject",
		DRAFT_KEY: "draftKey",
		DRAFT_KEY_IS_STR: "draftKeyIsString",
		EMBEDDING_MODE: "embeddingMode",
		LEGACY_SCENARIO: "legacyScenario",
		UI_MODE: "embeddingUiMode"
			// ECN: "ECN",
			// VALID_FROM: "VALID_FROM"
	};

	var VCH_CONTEXT_TYPE = "VCH";

	return UIComponent.extend("sap.i2d.lo.lib.zvchclfz.components.configuration.BaseConfigurationComponent", {
		/** @lends sap.i2d.lo.lib.vchclf.components.configuration.Component.prototype */
		metadata: {
			manifest: "json",
			properties: {
				/** The UI Mode: Create, Edit or Display */
				uiMode: {
					type: "string",
					group: "standard",
					defaultValue: UI_MODE.DISPLAY
				},
				embeddingUiMode: {
					type: "string",
					group: "standard",
					hidden: true
				},
				/** The semantic object for which the configuration should be created */
				semanticObject: {
					type: "string"
				},
				/** The key of the object which should be used to create the configuration */
				objectKey: {
					type: "string"
				},
				/** The draft key to use */
				draftKey: {
					type: "string"
				},
				/** Whether the draft key is a string or not */
				draftKeyIsString: {
					type: "boolean",
					defaultValue: true
				},
				embeddingMode: {
					type: "sap.i2d.lo.lib.zvchclfz.components.configuration.type.EmbeddingMode",
					defaultValue: EmbeddingMode.Configuration
				},
				enableChangeDocumentsButton: {
					type: "boolean",
					defaultValue: true
				},
				showPricingInfo: {
					type: "boolean",
					defaultValue: true
				},
				internalNavSettings: {
					type: "object",
					defaultValue: {}
				}
			},
			events: {
				/** Event fired when BOM Navigation should happen, but there is no BOM Application. */
				noBOMApplicationForBOMNavigation: {},
				/** Event fired when BOM Navigation should happen, but BOM can not be found. */
				bomCannotBeFoundForBOMNavigation: {},
				/** product variant selected by user in matching variants dialog */
				preferredVariantSelected: {},
				/** Event is fired when 'Handover to Eng.' button was pressed */
				handedoverToEngineering: {},
				/** Event is fired when 'Accept Review' button was pressed */
				reviewAccepted: {},
				/** When the context is changed **/
				configurationContextReloaded: {}
			},
			aggregations: {
				headerConfiguration: {
					type: "sap.i2d.lo.lib.zvchclfz.components.configuration.HeaderConfiguration",
					altTypes: ["sap.i2d.lo.lib.zvchclfz.components.configuration.HeaderConfiguration"],
					multiple: false
				},
				valuationComponent: {
					type: "sap.i2d.lo.lib.zvchclfz.components.valuation.Component",
					multiple: false,
					hidden: true
				},
				structurePanelComponent: {
					type: "sap.i2d.lo.lib.zvchclfz.components.structurepanel.Component",
					multiple: false,
					hidden: true
				},
				inspectorComponent: {
					type: "sap.i2d.lo.lib.zvchclfz.components.inspector.Component",
					multiple: false,

					hidden: true
				},
				footer: {
					type: "sap.m.IBar",
					altTypes: ["sap.m.IBar"],
					multiple: false
				}
			},
			publicMethods: [
				"reload",
				"resetConfiguration",
				"lockConfiguration",
				"unlockConfiguration",
				"resetInspector",
				"resetTrace",
				"saveTraceState",
				"restoreTraceState",
				"resetStructurePanel",
				"validateConfiguration",
				"updateConfigObjectBindingContext"
			]
		},

		_oConfigurationDAO: null,
		_oFooter: null,
		_oConfigurationView: null,
		_oValuationComponent: null,
		_bIsMultiLevel: false,
		_oInstanceArea: null,
		_oContextLoadedDeferred: null,
		_oPreloadedGroup: null,

		/**
		 * @override
		 */
		init: function () {
			UIComponent.prototype.init.apply(this);
			this._oContextLoadedDeferred = $.Deferred();
		},

		/**
		 * @override
		 */
		applySettings: function (mSettings, oScope) {
			UIComponent.prototype.applySettings.apply(this, [mSettings, oScope]);
			var aComponentProps = ["embeddingMode", "enableChangeDocumentsButton", "showPricingInfo"];
			for (var i = 0; i < aComponentProps.length; i++) {
				this.getConfigurationSettingsModel().setProperty("/" + aComponentProps[i], this.getProperty(aComponentProps[i]));
			}
		},

		/**
		 * Initializes the config settings with defaults that are not derived from the component properties
		 * @private
		 * @return undefined
		 */
		_applyNonParameterDefaults: function () {
			this.getConfigurationSettingsModel().setProperty("/triggerForDependencyLinkFactory", [0]); // property is needed for triggering factory function which creates dependecy form in inconsistency popover
			this.getConfigurationSettingsModel().setProperty("/showHiddenCharacteristics", false);
			this.getConfigurationSettingsModel().setProperty("/hasSettings", this._oPersonalizationDAO !== null);
			this.getConfigurationSettingsModel().setProperty("/StructurePanelIsVisible", false);
			this.getConfigurationSettingsModel().setProperty("/variantMatchingMode", 0);
			this.getConfigurationSettingsModel().setProperty("/inconsistencyPopupActive", false);
			//obsolete in case only one variant of variant matching button is used instead of two (with/without menu for create variant)
			this.getConfigurationSettingsModel().setProperty("/variantMatchingMenuButton", true);
		},

		/**
		 * Indicates when the configuration context has been loaded
		 * @return {Promise} returns a promise which is resolved when the context has been loaded
		 * @public
		 */
		contextLoaded: function () {
			return this._oContextLoadedDeferred;

		},

		/**
		 * @override
		 */
		setModel: function (oModel, sId) {
			// SKIP_FOR_ODATA_V4_TEST
			/*var modelV4 = new ODataModelV4({
				serviceUrl: "/sap/opu/odata4/sap/z_dg_group/default/sap/z_dg_odata4/0001/",
				synchronizationMode: "None"
			});*/
			if (sId === Constants.VCHCLF_MODEL_NAME) {
				// sanity check - don't invoke the factory if we already have a facade model -> happens when this method is invoked a 2nd time
				if (!(this.getModel(Constants.VCHCLF_MODEL_NAME) instanceof ODataFacadeModel)) {
					if (!(oModel instanceof ODataFacadeModel)) {
						oModel = ODataFacadeModelFactory.createFacadeModel(oModel, [
							"/ConfigurationInstanceSet",
							"/ConfigurationMaterialVariantSet",
							"/ConfigurationContextSet",
							"/CharacteristicSet",
							"/CharacteristicsGroupSet",
							"/CalculateAlternativeValues"
						], this._getView.bind(this));
					}
					UIComponent.prototype.setModel.apply(this, [oModel, sId]);
					UIComponent.prototype.setModel.apply(this, [oModel.getOriginModel(), "vchclf_bind_only"]);
				}
			} else {
				UIComponent.prototype.setModel.apply(this, [oModel, sId]);
			}
			return oModel;
		},

		/**
		 * Returns Inspector Visibility
		 * @return {Boolean} indicator for inspector visibility
		 * @private
		 */
		_getInspectorVisibility: function () {
			return this._getLayout() && this._getLayout().getShowRightContent();
		},

		updateInstance: function (oConfigurationInstance) {
			var oPromise = new Promise(function (fnResolve, fnReject) {
				var oHeaderConfigModel = this.getModel(Constants.HEADER_CONFIGURATION_MODEL_NAME);
				var oDataModel = this.getModel(Constants.VCHCLF_MODEL_NAME);
				var bAsync;

				//check for configurable instance is done here
				if (oConfigurationInstance && !jQuery.isEmptyObject(oConfigurationInstance)) {
					// Important: always show the valuation view first, as otherwise the vchclf model is not availabe
					// in the valuationComponent.setRootBindingPath method
					this._showNotConfigurableItemView(false);

					var sInstanceKey = oDataModel.createKey("ConfigurationInstanceSet", oConfigurationInstance);
					var sNewConfigurationInstancePath = "/" + sInstanceKey;

					//update valuation component with new configuration instance path

					if (this._sConfigurationInstancePath !== sNewConfigurationInstancePath || this._bCharacteristicValueChanged) {
						bAsync = true;
						this._oValuationComponent.setRootBindingPath(sNewConfigurationInstancePath, true).then(function () {
							fnResolve();
						});
						this._bCharacteristicValueChanged = false;
					} else {
						bAsync = false;
						this.setValuationBusy(false);
					}
					this._sConfigurationInstancePath = sNewConfigurationInstancePath;

					var oInstanceHeader = this.getAggregation("rootControl").byId("singleInstanceHeader");

					var oBindingInfo = {
						path: sNewConfigurationInstancePath,
						model: Constants.VCHCLF_MODEL_NAME
					};

					if (this.isMultiLevel()) {
						oInstanceHeader.bindElement(oBindingInfo);
					} else {
						oInstanceHeader.unbindElement(Constants.VCHCLF_MODEL_NAME);
					}
				} else {
					this._showNotConfigurableItemView(true);
				}

				//update instance header
				var oInstHdrFlds = oHeaderConfigModel.getProperty("/config/instance");

				if (oInstHdrFlds) {
					oInstHdrFlds.instanceId = oConfigurationInstance.Material;
					oInstHdrFlds.instanceDescr = oConfigurationInstance.MaterialDescription;

					if (!this.oInstanceStatus) {
						this.oInstanceStatus = {
							properties: {
								id: "InstanceHeaderConfigStatus",
								text: "{vchclf>StatusDescription}",
								state: sap.ui.core.ValueState.Success
							},
							controlType: "ObjectStatus"
						};
						oInstHdrFlds.instanceHeaderFields.push(this.oInstanceStatus);
					}

					oHeaderConfigModel.setProperty("/config/instance", oInstHdrFlds);
				}

				if (!bAsync) {
					fnResolve();
				}
			}.bind(this));
			return oPromise;
		},

		/**
		 * @private
		 */
		_onShowLayoutContent: function (sProperty, oEvent) {
			var bShow = oEvent.getParameter("show");
			var oModel = this.getConfigurationSettingsModel();
			if (oModel) {
				oModel.setProperty(sProperty, bShow);
			}
			this._savePersonalizationDAO();
		},

		/**
		 * @private
		 */
		_savePersonalizationDAO: function () {
			var oModel = this.getConfigurationSettingsModel();
			var mData = oModel.getData();
			var oPersonalizationDAO = this.getPersonalizationDAO();
			if (oPersonalizationDAO) {
				return oPersonalizationDAO.setDataWithoutChangeEvent(mData);
			} else {
				return null;
			}
		},

		/**
		 * @private
		 */
		_getLayout: function () {
			return this._oConfigurationView && this._oConfigurationView.byId("layout");
		},

		_getView: function () {
			return this._oConfigurationView;
		},

		/**
		 * Set the focus to characteristic which contains binding with the given path 
		 * 
		 * @param {sap.ui.base.Event} oEvent: An Event object consisting of an id, a source and a map of parameters
		 * @private
		 * @function
		 */
		_highlightCharacteristic: function (oEvent) {
			var sPath = "/" + oEvent.getParameter("csticPath");
			var oValuationComponent = this.getValuationComponent();
			oValuationComponent.highlightCharacteristic(sPath);
		},

		/**
		 * Sets the busy indicator to configuration view
		 * @param {boolean} bBusy: true or false
		 * @public
		 */
		setBusy: function (bBusy) {
			if (this._oConfigurationView && this._oConfigurationView.getBusy() !== bBusy) {
				if (bBusy === true) {
					this._oConfigurationView.setBusyIndicatorDelay(0);
				}
				this._oConfigurationView.setBusy(bBusy);
			}
		},

		/**
		 * Check if the key properties objectKey or draftKey are available
		 * It is sufficient to have at least either an object key (for display mode)
		 * or draft key (create mode with internal number assignment)
		 */
		_checkMandatoryProperties: function () {
			return (!!this.getObjectKey() || !!this.getDraftKey());
		},

		_getResourceBundle: function () {
			if (!this.vchI18nResourceBundle) {
				this.vchI18nResourceBundle = this.getModel("vchI18n").getResourceBundle();
			}
			return this.vchI18nResourceBundle;
		},

		_setFullMatchingVariantHeaderField: function () {
			if (this._variantMatchingIndicator === VariantMatchingMode.MatchingWithoutSelection ||
				this._variantMatchingIndicator === VariantMatchingMode.MatchingWithSelection) {
				var oHeaderConfigModel = this.getModel(Constants.HEADER_CONFIGURATION_MODEL_NAME);

				this._oConfigurationDAO.readFullMatchingVariants(this._aConfigurationInstances[0].ContextId, this._aConfigurationInstances[0].InstanceId)
					.then(function (oVariants) {
						var sVariantFieldText = "";
						var oText = this._getResourceBundle().getText("FULL_MATCHES");
						switch (oVariants.results.length) {
						case 0:
							sVariantFieldText = "\u2013";
							break;
						case 1:
							sVariantFieldText = oVariants.results[0].Product;
							break;
						default:
							sVariantFieldText = oVariants.results.length + " " + oText;
						}
						oHeaderConfigModel.setProperty("/headerFieldVariantBusy", false);
						oHeaderConfigModel.setProperty("/fullMatchingVariants", sVariantFieldText);
					}.bind(this));
			}
		},

		/**
		 * @private
		 */
		_openStructurePanelInitiallyIfNoUserPersAvailable: function (oPersonalizationDAO) {
			oPersonalizationDAO.getData().then(function (mData) {
				if (mData.StructurePanelButtonPressed === null) {
					this._getLayout().setShowLeftContent(true);
				}
			}.bind(this));
		},

		/**
		 * @private
		 */
		_registerStructurePanelEvents: function () {
			this._oStructurePanelComponent.attachInspectObject(function (oEvent) {
				var oParameters = oEvent.getParameters();

				this._oInspectorComponent.inspectObject(oParameters.objectPath, oParameters.objectType, oParameters.inspectorTab);
			}.bind(this));

			this._oStructurePanelComponent.attachReferenceCharacteristicSelected(function (oEvent) {
				// TODO: Missing implementation.
			});

			this._oStructurePanelComponent.attachClosePanelPressed(function () {
				this.getAggregation("rootControl").getController().onToggleLeftPanel();
			}.bind(this));

			this._oStructurePanelComponent.attachBOMExplosionFinished(function () {
				if (this._oInspectorComponent) {
					this._oInspectorComponent.triggerTraceFetch();
					this._oInspectorComponent.refreshBOMItem();
				}
			}.bind(this));

			this._oStructurePanelComponent.attachBOMExplosionTriggered(function (oEvent) {
				var bIsMultiLevel = oEvent.getParameter("isMultiLevel");

				if (bIsMultiLevel) {
					this.setValuationBusy(true);
					this.getConfigurationDAO().readConfigurationContext(this.buildContextId());
				}
			}.bind(this));

			this._oStructurePanelComponent.attachRoutingExplosionFinished(function () {
				if (this._oInspectorComponent) {
					this._oInspectorComponent.triggerTraceFetch();
					this._oInspectorComponent.refreshRoutingItem();
					// The Routing explosion triggers a BOM explosion too, so the BOM items should be refreshed too
					this._oInspectorComponent.refreshBOMItem();
				}
			}.bind(this));

			this._oStructurePanelComponent.attachNavigationToBOMCanNotBeFound(function () {
				this.fireBomCannotBeFoundForBOMNavigation(arguments);
				var oValuationView = this.getValuationComponent().getRootControl();

				oValuationView.setBusy(false);
			}.bind(this));

			this._oStructurePanelComponent.attachConfigurableItemSelectionChanged(function (oEvent) {
				this.setValuationBusy(true);
			}.bind(this));

			this._oStructurePanelComponent.attachConfigurableItemSelected(function (oEvent) {
				var oConfigurationInstance = oEvent.getParameter("oConfigurationInstance");

				this._oConfigurationDAO.addToRequestQueue(function () {
					return new Promise(function (fnResolve, fnReject) {
						fnResolve();
						this.updateInstance(oConfigurationInstance);
					}.bind(this));
				}, this);

				this._oInspectorComponent.restrictComparisonView(oConfigurationInstance);
			}.bind(this));

			this._oStructurePanelComponent.attachBOMComponentDeleted(function (oEvent) {
				var sObjectPath = oEvent.getParameter("objectPath");

				if (this._oInspectorComponent.isObjectInspected(sObjectPath, InspectorMode.objectType.BOMComponent)) {
					this._oInspectorComponent.inspectObject(
						this._oStructurePanelComponent.getRootBOMComponentPath(),
						InspectorMode.objectType.BOMComponent,
						null,
						null,
						true
					);
				}
			}.bind(this));
		},

		setValuationBusy: function (bBusy) {
			var oValuationView = this.getValuationComponent().getRootControl();
			oValuationView.setBusyIndicatorDelay(0);
			oValuationView.setBusy(bBusy);
		},

		/**
		 * @private
		 */
		_registerInspectorEvents: function () {
			this._oInspectorComponent.attachClosePanelPressed(function () {
				this.getAggregation("rootControl").getController().onToggleSidePanel();
			}.bind(this));

			this._oInspectorComponent.attachTraceInitiallyActive(function () {
				this._getLayout().setShowRightContent(true);
			}.bind(this));

			this._oInspectorComponent.attachNavigationToBOMwithoutBOMApp(function () {
				this.fireNoBOMApplicationForBOMNavigation(arguments);
			}.bind(this));

			this._oInspectorComponent.attachNavigationToBOMCanNotBeFound(function () {
				this.fireBomCannotBeFoundForBOMNavigation(arguments);
			}.bind(this));

			this._oInspectorComponent.attachOpenPanel(function () {
				this._getLayout().setShowRightContent(true);
			}.bind(this));

			//  Not valid yet
			//	this._oInspectorComponent.attachShowCharacteristicInConfiguration(this._highlightCharacteristic.bind(this));
		},

		_isCalculatePricingRequired: function () {
			return this._isPriceVisible() && this.getUiMode() !== UI_MODE.DISPLAY;
		},

		/**
		 * @public
		 * Show the characteristic details in the inspector component
		 * @param {String} sPath - Binding Path
		 * @param {Boolean} bOpenInspector - Indicator whether the inspector should be opened
		 * @param {Object} [oKeyParameters]  - Optional Key Values pairs
		 */
		inspectCharacteristic: function (sPath, bOpenInspector, oKeyParameters) {
			if (this._oInspectorComponent) {
				this._oInspectorComponent.inspectObject(
					sPath,
					InspectorMode.objectType.Characteristic,
					bOpenInspector ? InspectorMode.inspectorTab.properties : null,
					oKeyParameters);
			}
		},

		/**
		 * @public
		 * Show the object dependency in the inspector component
		 * @param {String} sObjectDependency - Key of Object Dependency
		 */
		inspectObjectDependency: function (sObjectDependency) {
			if (this._oInspectorComponent) {
				this._oInspectorComponent.openDependencyDetails(sObjectDependency);
			}
		},

		/**
		 * @private
		 */
		_registerValuationEvents: function () {
			this._oValuationComponent.attachCharacteristicSelected(function (oEvent) {
				//forward information about selected characteristic to inspector component
				this.inspectCharacteristic(oEvent.getParameter("path"));
			}.bind(this));

			this._oValuationComponent.attachCharacteristicValueChanged(function (oEvent) {
				this._bCharacteristicValueChanged = true; // is used for updating valuation ui when any characteristic value is changed and the instance stays the same! e.g explode BOM
				var sPath = oEvent.getParameter("characteristicPath");
				var oDataModel = this.getModel(Constants.VCHCLF_MODEL_NAME);
				var sContextId = oDataModel.getProperty(sPath).ContextId;

				if (this._isCalculatePricingRequired()) {
					this.getConfigurationDAO().calculatePricing(sContextId);
				}

				this.getConfigurationDAO().readConfigurationContext(sContextId).then(function (oResult) {
					oResult.Instances.results.forEach(function (oInstance, iIndex) {
						var sInstancePath = "/" + oDataModel.createKey("ConfigurationInstanceSet", oInstance);
						if (this._sConfigurationInstancePath === sInstancePath) {
							this._oValuationComponent.updateGroupsProperties(oResult.Instances.results[iIndex].CharacteristicsGroups.results);
						}
					}.bind(this));
					this._handleInconsistencyInformation(oResult);
				}.bind(this));

				this.getModel(Constants.HEADER_CONFIGURATION_MODEL_NAME).setProperty("/headerFieldVariantBusy", true);

			}.bind(this));

			this._oValuationComponent.attachCharacteristicsChanged(function (oEvent) {
				this._oInspectorComponent.refreshCharacteristicValues(oEvent.getParameter("changedCharacteristics"));
			}.bind(this));

			this._oValuationComponent.attachCharacteristicChanged(function () {
				this._oInspectorComponent.triggerTraceFetch();
				this._setFullMatchingVariantHeaderField();
			}.bind(this));

			this._oValuationComponent.attachCollectPreloadedCharacteristicGroup(function (oEvent) {
				if (!this._oPreloadedGroup) {
					return;
				}

				var aPreloadedCstics = this._oPreloadedGroup.results;

				if (aPreloadedCstics.length === 0) {
					return;
				}

				var oFirstPreloadedCstic = aPreloadedCstics[0];
				var sPreloadedGroupPath = oFirstPreloadedCstic.ContextId + "," + oFirstPreloadedCstic.InstanceId + "," + oFirstPreloadedCstic.GroupId;
				var oParams = oEvent.getParameters().preloadedCharacteristicGroup;
				var sExpectedGroupPath = oParams.sContextId + "," + oParams.sInstanceId + "," + oParams.iGroupId;

				if (sPreloadedGroupPath === sExpectedGroupPath) {
					oParams.aCharacteristics = aPreloadedCstics;
					this._oPreloadedGroup = null;
				}
			}.bind(this));
		},

		_getDynamicPage: function () {
			return this._oConfigurationView.byId("dynamicPage");
		},

		/**
		 * @private
		 */
		_syncPersonalizationWithSettingsModel: function () {
			var oPersonalizationDAO = this.getPersonalizationDAO();
			if (oPersonalizationDAO) {
				oPersonalizationDAO.setItemKey(this.getSemanticObject());
				oPersonalizationDAO.getData().then(function (mData) {
					this.getConfigurationSettingsModel().setData(mData, true);
					this._updatePanelsVisibility(mData);
				}.bind(this));
			}
		},

		/**
		 * @private
		 */
		_syncPersonalizationWithSplitter: function () {
			var oPersonalizationDAO = this.getPersonalizationDAO();
			if (oPersonalizationDAO) {
				oPersonalizationDAO.getData().then(function (mData) {
					this._updatePanelsVisibility(mData);
				}.bind(this));
			}
		},

		/**
		 * @private
		 */
		_updatePanelsVisibility: function (mData) {
			var oSplitter = this._getLayout();
			if (!oSplitter) {
				return;
			}
			var bUpdateRightPanelVisibility = oSplitter.getShowRightContent() !== mData.InspectorButtonPressed;
			if (bUpdateRightPanelVisibility) {
				oSplitter.setShowRightContent(mData.InspectorButtonPressed);
			}
			var oConfigurationContext = this.getBindingContext(Constants.VCHCLF_MODEL_NAME);
			if (!oConfigurationContext) {
				return;
			}

			var bUpdateLeftPanelVisibility = this._isStructurePanelEnabled(oConfigurationContext.getObject()) &&
				(oSplitter.getShowLeftContent() !== mData.StructurePanelButtonPressed);

			if (bUpdateLeftPanelVisibility) {
				var bIsInitialPersonalizationData = mData.StructurePanelButtonPressed === null;
				var bShowLeftContent = bIsInitialPersonalizationData ? (this.isMultiLevel() && bIsInitialPersonalizationData) : mData.StructurePanelButtonPressed;
				oSplitter.setShowLeftContent(bShowLeftContent);
			}
		},

		isMultiLevel: function () {
			return this._bIsMultiLevel;
		},

		setIsMultiLevel: function (bIsMultiLevel) {
			this._bIsMultiLevel = bIsMultiLevel;
		},

		/**
		 * @private
		 */
		_onPersonalizationChanged: function () {
			this._syncPersonalizationWithSettingsModel();

		},

		_decodeString: function (sEncodedString) {
			var sDecodedString = decodeURIComponent(sEncodedString);
			if (sDecodedString === sEncodedString) {
				//string is decoded completely
				return sDecodedString;
			} else {
				return this._decodeString(sDecodedString);
			}
		},

		/**
		 * @return {sap.i2d.lo.lib.vchclf.components.configuration.dao.ConfigurationDAO} Returns an instance of the ConfigurationDAO
		 * @private 
		 */
		_createConfigurationDAO: function () {
			return new ConfigurationDAO({
				dataModel: this.getModel(Constants.VCHCLF_MODEL_NAME)
			});
		},

		/**
		 * @return {Map} An object which contains all necessary information to create a configuration context data
		 * @private 
		 */
		_getConfigurationContextData: function () {
			return {
				SemanticObj: this.getSemanticObject(),
				ObjectKey: this.getObjectKey(),
				DraftKey: this.getDraftKey(),
				TechnicalObj: "",
				DraftKeyIsString: this.getDraftKeyIsString(),
				ECN: "",
				ContextId: this.buildContextId()
			};
		},

		/**
		 * @param {Map} mConfigurationContextData An object which contains all necessary information to create a configuration context data 
		 * @private
		 */
		_createConfigurationContextAndBindingContext: function (mConfigurationContextData) {
			this.setBusy(true);
			if (!this._checkMandatoryProperties()) {
				return;
			}
			this.setIsMultiLevel(false);
			this._showErrorPage(false);

			return this._oConfigurationDAO.addToRequestQueue(function () {
				return new Promise(function (fnResolve, fnReject) {
					fnResolve();
					this.getModel(Constants.VCHCLF_MODEL_NAME).metadataLoaded().then(function () {

						var aPromise = [];

						var oPromiseConfigurationContext = this._oConfigurationDAO.readConfigurationContext(mConfigurationContextData.ContextId,
							true).then(
							function (oConfigurationContext) {
								this._evaluateEtoState(oConfigurationContext);

								this._setVariantMatchingIndicator(oConfigurationContext.VariantMatchingIndicator);

								this._setPricingIndicator(oConfigurationContext.PricingActive);
								if (this._isCalculatePricingRequired()) {
									this._oConfigurationDAO.calculatePricing(mConfigurationContextData.ContextId);
								}

								//set inconsistency states
								this._handleInconsistencyInformation(oConfigurationContext);

								var oConfigurationInstancesData = oConfigurationContext.Instances;
								var oConfigurationInstance;
								this._oValuationComponentContainer.setComponent(this._oValuationComponent);

								if (oConfigurationInstancesData && oConfigurationInstancesData.results && oConfigurationInstancesData.results.length) {
									var aConfigurationInstances = oConfigurationInstancesData.results;
									this._oValuationComponent.setGroupCount(aConfigurationInstances[0].CharacteristicsGroups.results.length);
									this._aConfigurationInstances = aConfigurationInstances;
									oConfigurationInstance = aConfigurationInstances[0];
									this.setIsMultiLevel(oConfigurationContext.IsStrucConfigblItemAvailable);
								} else {
									jQuery.sap.log.error("No configuration instance found for context ID: " + mConfigurationContextData.ContextId);
								}
								this._setFullMatchingVariantHeaderField();

								return [oConfigurationContext, oConfigurationInstance];
							}.bind(this));
						aPromise.push(oPromiseConfigurationContext);

						// SKIP_FOR_ODATA_V4_TEST
						this._oConfigurationDAO.readFeatureToggles();

						var oPromiseFirstGroup = this._oValuationComponent.preloadGroup(mConfigurationContextData.ContextId);
						aPromise.push(oPromiseFirstGroup);

						Promise.all(aPromise).then(function (results) {
							var oConfigurationContext = results[0][0];
							var oFirstConfigurationInstance = results[0][1];
							var oPreloadedGroup = results[1];

							if (oPreloadedGroup && oPreloadedGroup.results) {
								this._oPreloadedGroup = oPreloadedGroup;
							}

							if (oConfigurationContext && oFirstConfigurationInstance) {
								// Please do not change the order between updateInstance and _setBindingContextForConfigurationContext
								// otherwise wrong request(s) will be sent because of incorrect binding context
								this.updateInstance(oFirstConfigurationInstance).then(this.setBusy.bind(this, false));
								this._setBindingContextForConfigurationContext(oConfigurationContext);

								var sConfigurationContextId = this.buildContextId();
								var bIsStructurePanelEnabled = this._isStructurePanelEnabled(oConfigurationContext);

								if (bIsStructurePanelEnabled) {
									this._oStructurePanelComponent.setIsBOMChangeAllowed(oConfigurationContext.UISettings.IsBOMChangeAllowed);
									this._oStructurePanelComponent.updateConfigurationContextId(sConfigurationContextId, oConfigurationContext);
									//Enabling the Structure Panel button	
									this.getConfigurationSettingsModel().setProperty("/StructurePanelIsVisible", true);
									this._syncPersonalizationWithSplitter();
								} else {
									this.getConfigurationSettingsModel().setProperty("/StructurePanelIsVisible", false);
								}

								// SKIP_FOR_ODATA_V4_TEST
								this._oInspectorComponent.updateConfigurationContextId(sConfigurationContextId, oFirstConfigurationInstance.InstanceId,
									oConfigurationContext, bIsStructurePanelEnabled);

							}
						}.bind(this)).catch(function (oError) {
							// Handling of displaying error message is in a centralized handler for all batch responses
							this._showErrorPage(true);
						}.bind(this));
					}.bind(this));
				}.bind(this));
			}, this);
		},

		_isStructurePanelEnabled: function (oConfigurationContext) {
			// SKIP_FOR_ODATA_V4_TEST
			//return false;
			return this._oStructurePanelComponent && this._oStructurePanelComponent.isStructurePanelEnabled(oConfigurationContext);
		},

		_setVariantMatchingIndicator: function (oContextVariantMatchingIndicator) {
			if (oContextVariantMatchingIndicator === VariantMatchingMode.MatchingWithSelection && this.getUiMode() === UI_MODE.DISPLAY) {
				this.getConfigurationSettingsModel().setProperty("/variantMatchingMode", VariantMatchingMode.MatchingWithoutSelection);
				this._variantMatchingIndicator = VariantMatchingMode.MatchingWithoutSelection;
			} else {
				this.getConfigurationSettingsModel().setProperty("/variantMatchingMode", oContextVariantMatchingIndicator);
				this._variantMatchingIndicator = oContextVariantMatchingIndicator;
			}
		},

		_setPricingIndicator: function (oContextPricingIndicator) {
			this._pricingIndicator = oContextPricingIndicator;
			var bIsPricingActive = oContextPricingIndicator === "X";
			this.getConfigurationSettingsModel().setProperty("/pricingActive", bIsPricingActive);
		},

		_handleInconsistencyInformation: function (oConfigurationContext) {
			if (oConfigurationContext.InconsistencyInformation && oConfigurationContext.InconsistencyInformation.results) {

				var aInconsistencyData = oConfigurationContext.InconsistencyInformation.results;
				if (aInconsistencyData.length === 0) {
					//no inconsistencies available => popup invisible
					this.getConfigurationSettingsModel().setProperty("/inconsistencyPopupActive", false);
				} else {

					this._readInconsistencyInformationDetails(aInconsistencyData).then(function () {
						var oFacadeModel = this.getModel("vchclf");
						var sPath;
						var aResults = [];
						var oInconsistencyInfoExpanded;
						for (var i = 0; i < aInconsistencyData.length; i++) {
							sPath = oFacadeModel.getKey(aInconsistencyData[i]);
							oInconsistencyInfoExpanded = oFacadeModel.getProperty("/" + sPath, null, true);
							aResults.push(oInconsistencyInfoExpanded);
						}

						this.getValuationComponent().getViewModel().setInconsistencyInformation(oConfigurationContext.ContextId, aResults);
					}.bind(this));

					for (var i = 0; i < aInconsistencyData.length; i++) {
						var oInconsistencyData = aInconsistencyData[i];

						if (oInconsistencyData.DependencyId) {
							//only one dependency id is enough to make popover active
							this.getConfigurationSettingsModel().setProperty("/inconsistencyPopupActive", true);
							break;
						} else {
							this.getConfigurationSettingsModel().setProperty("/inconsistencyPopupActive", false);
						}
					}
				}
			} else {
				this.getValuationComponent().getViewModel().resetInconsistencyData();
			}
		},

		_readInconsistencyInformationDetails: function (aInconsistencyInformation) {
			var aPromises = [];
			var oFacadeModel = this.getModel("vchclf");
			var sPath;

			for (var i = 0; i < aInconsistencyInformation.length; i++) {
				sPath = oFacadeModel.getKey(aInconsistencyInformation[i]);
				if (aInconsistencyInformation[i].DependencyId !== "") {
					aPromises.push(oFacadeModel.facadeRead("/" + sPath + "/Documentation"));
				}
				aPromises.push(oFacadeModel.facadeRead("/" + sPath + "/Details", {
					$expand: "AssignedCsticValues"
				}));
			}

			return Promise.all(aPromises);
		},

		_isPriceVisible: function () {
			return !!this._pricingIndicator;
		},

		/**
		 * shows error page
		 * 
		 * @param {boolean} bShowErrorPage: visibility of Error page
		 * @private
		 * @function
		 */
		_showErrorPage: function (bShowErrorPage) {
			var oConfigView = this.getAggregation("rootControl");
			if (oConfigView) {
				oConfigView.byId("errorPage").setVisible(bShowErrorPage);
				oConfigView.byId("dynamicPage").setVisible(!bShowErrorPage);
			}
		},

		/**
		 * shows not configurable item view
		 * 
		 * @param {boolean} bShowNotConfigurableItemView: visibility of Not Configurable Item View
		 * @private
		 * @function
		 */
		_showNotConfigurableItemView: function (bShowNotConfigurableItemView) {
			var oConfigView = this.getAggregation("rootControl");
			var oLayout = oConfigView.byId("layout");

			if (!this._oNotConfigurableItemView) {
				this._oNotConfigurableItemView = sap.ui.xmlview({
					viewName: "sap.i2d.lo.lib.zvchclfz.components.configuration.view.NotConfigurableItem"
				});
			}

			var oNewMiddleContent = bShowNotConfigurableItemView ? this._oNotConfigurableItemView : this._oInstanceArea;

			oLayout.setMiddleContent(oNewMiddleContent);
		},

		/**
		 * Creates and sets the context for the configuration instance.
		 * @param {object} oConfigurationContext the configuration instance to create the context for.
		 * @private
		 */
		_setBindingContextForConfigurationContext: function (oConfigurationContext) {
			var oModel = this.getModel(Constants.VCHCLF_MODEL_NAME);
			var sPath = "/" + oModel.getKey(oConfigurationContext);
			oModel.createBindingContext(sPath, null, null, function (oBindingContext) {
				this.setBindingContext(oBindingContext, Constants.VCHCLF_MODEL_NAME);
				this._oContextLoadedDeferred.resolve(oBindingContext.getObject());
			}.bind(this));
		},

		_updateObjectKey: function () {
			var sObjectKey = "";
			if (!this.getInternalNavSettings()) {
				return;
			}
			var aKeyFields = this.getInternalNavSettings().keyFields;
			var oBindingContext = this.getBindingContext().getObject();
			var iKeyFieldsLastIndex = aKeyFields.length - 1;
			aKeyFields.forEach(function (sKeyField, iIndex) {
				var sKeyFieldSeparator = this.getInternalNavSettings().multipleKeyFieldsSeparator;
				if ((iIndex === 0 && iKeyFieldsLastIndex === 0) || iIndex === iKeyFieldsLastIndex) {
					sKeyFieldSeparator = "";
				}
				if (sKeyField && oBindingContext[sKeyField]) {
					sObjectKey = sObjectKey + oBindingContext[sKeyField] + sKeyFieldSeparator;
				}
			}.bind(this));
			if (!sObjectKey) {
				jQuery.sap.log.error("No Object Key available - object key was not provided by caller");
			}
			if (sObjectKey !== this.getObjectKey()) {
				this.setObjectKey(sObjectKey);
			}
		},

		_setETOStatus: function (sETOStatus) {
			var oConfigurationView = this.getRootControl();
			var oBindingContextData = this.getBindingContext(Constants.VCHCLF_MODEL_NAME).getObject();
			var sConfigurationStatus = oBindingContextData.StatusType;
			if (sConfigurationStatus === Constants.CONFIGURATION_STATUS_TYPE.INCOMPLETE || sConfigurationStatus === Constants.CONFIGURATION_STATUS_TYPE
				.INCONSISTENT) {
				this.lockConfiguration();
			}
			oConfigurationView.setBusyIndicatorDelay(0);
			oConfigurationView.setBusy(true);
			var sContextId = oBindingContextData.ContextId;
			var oConfigurationDAO = this.getConfigurationDAO();
			return oConfigurationDAO.setETOStatus(sContextId, sETOStatus);
		},

		_openDialog: function (sDialogName, fnOk, fnCancel) {
			if (this.oDialog) {
				this.oDialog.destroy();
				delete this.oDialog;
			}
			var _fnWrapCallback = function (fnCallback) {
				return function () {
					this.oDialog.close();
					if (fnCallback) {
						fnCallback.call(this, arguments);
					}
				}.bind(this);
			}.bind(this);
			var _fnOk = _fnWrapCallback(fnOk);
			var _fnCancel = _fnWrapCallback(fnCancel);

			var oConfigurationView = this.getRootControl();
			var oFactoryBase = oConfigurationView.getController().getFactoryBase();
			this.oDialog = oFactoryBase.createFragment(oConfigurationView.getId(), sDialogName, this);

			var oOKButton = this.oDialog.getAggregation("beginButton");
			oOKButton.attachPress(_fnOk);

			var oCancelButton = this.oDialog.getAggregation("endButton");
			oCancelButton.attachPress(_fnCancel);
			oConfigurationView.addDependent(this.oDialog);
			this.oDialog.open();
		},

		_openReviseEngineeringChangesDialog: function () {
			var sFragmentName = "sap.i2d.lo.lib.zvchclfz.components.configuration.view.fragment.ReviseEngineeringChangesDialog";
			var onOKButtonPress = function () {
				var oConfigurationView = this.getRootControl();
				oConfigurationView.setBusyIndicatorDelay(0);
				oConfigurationView.setBusy(true);
				var oBindingContext = this.getBindingContext(Constants.VCHCLF_MODEL_NAME);
				var sContextId = oBindingContext.getObject().ContextId;
				var oConfigurationDAO = this.getConfigurationDAO();

				oConfigurationDAO.setETOStatus(sContextId, Constants.ETO_STATUS.REVISED_BY_SALES).then(function () {
					this._setUiMode("Edit");
					this.reload();
				}.bind(this));
			};

			this._openDialog(sFragmentName, onOKButtonPress);
		},

		_openSetETOStatusDialog: function (sETOStatus) {
			var sFragmentName = "sap.i2d.lo.lib.zvchclfz.components.configuration.view.fragment.SetETOStatusDialog";
			var fnAfterETOStatusChange = function () {
				if (sETOStatus === Constants.ETO_STATUS.READY_FOR_ENGINEERING || sETOStatus === Constants.ETO_STATUS.REENGINEERING_NEEDED) {
					var oConfigurationView = this.getRootControl();
					oConfigurationView.setBusy(false);
					this.fireHandedoverToEngineering();
				} else {
					this.reload();
				}
			}.bind(this);

			var fnSetETOStatus = function () {
				this._setETOStatus(sETOStatus).then(fnAfterETOStatusChange);
			}.bind(this);

			var onOKButtonPress = function () {
				var oBindingContext = this.getBindingContext(Constants.VCHCLF_MODEL_NAME);
				var sContextId = oBindingContext.getObject().ContextId;
				this.getConfigurationDAO().validateConfiguration(sContextId).then(fnSetETOStatus);
			}.bind(this);

			this._openDialog(sFragmentName, onOKButtonPress);
		},

		_openAcceptReviewDialog: function () {
			var sFragmentName = "sap.i2d.lo.lib.zvchclfz.components.configuration.view.fragment.AcceptReviewDialog";
			var onOKButtonPress = function () {
				var oConfigurationView = this.getRootControl();
				oConfigurationView.setBusyIndicatorDelay(0);
				oConfigurationView.setBusy(true);
				var oBindingContext = this.getBindingContext(Constants.VCHCLF_MODEL_NAME);
				var sContextId = oBindingContext.getObject().ContextId;
				var oConfigurationDAO = this.getConfigurationDAO();
				oConfigurationDAO.setETOStatus(sContextId, Constants.ETO_STATUS.REVIEW_FINISHED_BY_SALES).then(this.fireReviewAccepted.bind(this));
			};
			this._openDialog(sFragmentName, onOKButtonPress);
		},

		_addHandoverToEngBtnToFooter: function (oFooter) {
			var oHandoverToEngineeringBtn = new Button({
				id: oFooter.getId() + "--handoverToEngineeringButton",
				text: "{vchI18n>HANDOVER_TO_ENGINEERING_BUTTON}",
				type: sap.m.ButtonType.Emphasized,
				visible: "{parts: [{path: 'vchclf>EtoStatus'}, {path: 'configurationSettings>/editable'}], formatter: 'sap.i2d.lo.lib.zvchclfz.components.configuration.formatter.HeaderFieldFormatter.getHandoverToEngineeringButtonVisible'}",
				press: this._openSetETOStatusDialog.bind(this, Constants.ETO_STATUS.READY_FOR_ENGINEERING)
			});
			this._appendFooterContentAfterToolbarSpacerAtPosition(oFooter, 1, oHandoverToEngineeringBtn);
		},

		_addHandBackToEngBtnToFooter: function (oFooter) {
			var oHandBackToEngineeringBtn = new Button({
				id: oFooter.getId() + "--handBackToEngineeringButton",
				text: "{vchI18n>HAND_BACK_TO_ENGINEERING}",
				type: sap.m.ButtonType.Emphasized,
				visible: "{parts: [{path: 'vchclf>EtoStatus'}, {path: 'configurationSettings>/editable'}], formatter: 'sap.i2d.lo.lib.zvchclfz.components.configuration.formatter.HeaderFieldFormatter.getHandBackToEngineeringButtonVisible'}",
				press: this._openSetETOStatusDialog.bind(this, Constants.ETO_STATUS.REENGINEERING_NEEDED)
			});
			this._appendFooterContentAfterToolbarSpacerAtPosition(oFooter, 1, oHandBackToEngineeringBtn);
		},

		_addAcceptReviewBtnToFooter: function (oFooter) {
			var oAcceptReviewBtn = new Button({
				id: oFooter.getId() + "--acceptReviewButton",
				text: "{vchI18n>ACCEPT_REVIEW_BUTTON}",
				type: sap.m.ButtonType.Accept,
				visible: "{parts: [{path: 'vchclf>EtoStatus'}, {path: 'configurationSettings>/embeddingUiMode'}], formatter: 'sap.i2d.lo.lib.zvchclfz.components.configuration.formatter.HeaderFieldFormatter.getAcceptReviewButtonVisible'}",
				press: this._openAcceptReviewDialog.bind(this)
			});
			this._appendFooterContentAfterToolbarSpacerAtPosition(oFooter, 1, oAcceptReviewBtn);
		},

		_addReviseChangesBtnToFooter: function (oFooter) {
			var oReviseChangesBtn = new Button({
				id: oFooter.getId() + "--reviseChangesButton",
				text: "{vchI18n>REVISE_CHANGES_BUTTON}",
				type: sap.m.ButtonType.Reject,
				visible: "{parts: [{path: 'vchclf>EtoStatus'}, {path: 'configurationSettings>/embeddingUiMode'}], formatter: 'sap.i2d.lo.lib.zvchclfz.components.configuration.formatter.HeaderFieldFormatter.getReviseChangesButtonVisible'}",
				press: this._openReviseEngineeringChangesDialog.bind(this)
			});
			this._appendFooterContentAfterToolbarSpacerAtPosition(oFooter, 2, oReviseChangesBtn);
		},

		_appendFooterContentAfterToolbarSpacerAtPosition: function (oFooter, iPosition, oContent) {
			var aContent = oFooter.getAggregation("content");
			var iToolbarPosition = 0;
			aContent.forEach(function (oContent, iIndex) {
				if (oContent.getMetadata().getName() === "sap.m.ToolbarSpacer") {
					iToolbarPosition = iIndex;
				}
			});
			aContent.splice(iToolbarPosition + iPosition, 0, oContent);
			oFooter.removeAllContent();
			aContent.forEach(function (oContent) {
				oFooter.addContent(oContent);
			});
		},

		buildContextIdForInternalNavigation: function () {
			this._updateObjectKey();
			return this.buildContextId();
		},

		/**
		 * Cleans up the Component instance before destruction.
		 * 
		 * @override
		 * @function
		 * @public
		 */
		exit: function () {
			if (this._oNotConfigurableItemView) {
				this._oNotConfigurableItemView.destroy();
				this._oNotConfigurableItemView = null;
			}
			this._oContextLoadedDeferred = null;
			this._oInstanceArea = null;
			this._oConfigurationView = null;
			this._oFooter = null;
			this._oValuationComponent = null;
			this._oConfigurationDAO = null;
			CommandManager.reset();
		},

		/**
		 * event handler for lock button 
		 * 
		 * @function
		 * @public
		 */
		lockConfiguration: function () {
			return this._oConfigurationDAO.lockConfiguration(this.buildContextId());
		},

		/**
		 * event handler for unlock button 
		 * 
		 * @function
		 * @public
		 */
		unlockConfiguration: function () {
			return this._oConfigurationDAO.unlockConfiguration(this.buildContextId());
		},

		/**
		 * Returns the configuration settings model
		 * 
		 * @protected
		 */
		getConfigurationSettingsModel: function () {
			return this.getModel(Constants.CONFIGURATION_SETTINGS_MODEL_NAME);
		},

		/**
		 * @override 
		 * @returns {sap.ui.view} Configuration XML view
		 */
		createContent: function () {
			this._oConfigurationView = sap.ui.view({
				id: this.createId("configurationView"),
				viewName: "sap.i2d.lo.lib.zvchclfz.components.configuration.view.Configuration",
				type: sap.ui.core.mvc.ViewType.XML
			});

			this._oPersonalizationDAO = this.getPersonalizationDAO();
			if (this._oPersonalizationDAO) {
				var oController = this._oConfigurationView.getController();
				this._oPersonalizationDAO.attachChanged(this._onPersonalizationChanged, this);
				oController.setPersonalizationDAO(this._oPersonalizationDAO);
			}

			this._oValuationComponentContainer = this._oConfigurationView.byId("valuationComponentContainer");

			var oLayout = this._getLayout();
			oLayout.attachShowLeftContent(this._onShowLayoutContent.bind(this, "/StructurePanelButtonPressed"));
			oLayout.attachShowRightContent(this._onShowLayoutContent.bind(this, "/InspectorButtonPressed"));

			this._oInstanceArea = this._oConfigurationView.byId("instanceArea");

			/*
			 * IMPORTANT NOTE:
			 * At this point in time the component properties values (coming from the outside) are not yet applied - only above specified defaults are available!
			 * For each new component property there must be a new specific set<PropertyName> function which sets the incoming value to the settings model (see below).
			 * The set<PropertyName> function is invoked automatically during the applySettings function when the object is initialized - but this is after createContent!
			 * Therefore at this moment ONLY non parameter values can be applied.
			 */
			this._applyNonParameterDefaults();

			return this._oConfigurationView;
		},

		/**
		 * Gets the instance of the personalization DAO if supported
		 * 
		 * @returns {sap.i2d.lo.lib.vchclf.components.configuration.dao.PersonalizationDAO} Instance of the configuration DAO.
		 * @protected
		 */
		getPersonalizationDAO: function () {
			if (!this._oPersonalizationDAO) {
				return this.createPersonalizationDAO();
			} else {
				return this._oPersonalizationDAO;
			}
		},

		/**
		 * Creates and returns the instance of the personalization DAO. 
		 * 
		 * @returns {sap.i2d.lo.lib.vchclf.components.configuration.dao.PersonalizationDAO} Instance of the configuration DAO.
		 * @protected
		 */
		createPersonalizationDAO: function () {
			if (PersonalizationDAO.isSupported()) {
				return new PersonalizationDAO();
			} else {
				return null;
			}
		},

		/**
		 * Updates the binding context of the configuration component. 
		 * This triggers a backend call and rerenders the UI. 
		 * @public
		 */
		resetConfiguration: function () {
			this.getValuationComponent().initGroupStateModel();
			this.reload();
		},

		/**
		 * Validates the Configuration and returns the status desc. with a flag whether the status is changed
		 * @returns {Promise} Promise object which will be resolved with the information
		 * @public
		 */
		validateConfiguration: function () {
			return new Promise(function (fnResolve) {
				var oContext = this.getBindingContext(Constants.VCHCLF_MODEL_NAME);
				var sPrevStatusId = oContext.getProperty("StatusId");

				// Status can be changed after BOM explosion only in Multi level scenario
				if (this._oStructurePanelComponent && this.isMultiLevel()) {
					this._oStructurePanelComponent.reexplodeBOM()
						.then(function () {
							fnResolve({
								isStatusChanged: sPrevStatusId !== oContext.getProperty("StatusId"),
								statusDescription: oContext.getProperty("StatusDescription")
							});
						});
				} else {
					fnResolve({
						isStatusChanged: false,
						statusDescription: oContext.getProperty("StatusDescription")
					});
				}
			}.bind(this));
		},

		/**
		 * Resets the Inspector component
		 * This triggers a backend call if trace is active.
		 * @public
		 */
		resetInspector: function () {
			if (this._oInspectorComponent) {
				this._oInspectorComponent.resetInspector();
			}
		},

		/**
		 * Resets the Trace
		 * This triggers a backend call if trace is active.
		 * @public
		 */
		resetTrace: function () {
			if (this._oInspectorComponent) {
				this._oInspectorComponent.resetTrace();
			}
		},

		/**
		 * Saves the Trace state
		 * @public
		 */
		saveTraceState: function () {
			if (this._oInspectorComponent) {
				this._oInspectorComponent.saveTraceState();
			}
		},

		/**
		 * Restores a previously saved Trace state
		 * @public
		 */
		restoreTraceState: function () {
			if (this._oInspectorComponent) {
				this._oInspectorComponent.restoreTraceState();
			}
		},

		/**
		 * Resets the StructurePanel component
		 * @public
		 */
		resetStructurePanel: function () {
			if (this._oStructurePanelComponent) {
				this._oStructurePanelComponent.resetComponent();
			}
		},

		/**
		 * Reloads the configuration 
		 * 
		 * @public
		 */
		reload: function () {
			this._oContextLoadedDeferred = $.Deferred();

			var oCtx = this.getBindingContext(Constants.VCHCLF_MODEL_NAME);
			this.setBindingContext(undefined, Constants.VCHCLF_MODEL_NAME);

			// Close the dialogs
			this.fireConfigurationContextReloaded();

			this._sConfigurationInstancePath = null;

			CommandManager.reset();
			if (oCtx) {
				this.getModel(Constants.VCHCLF_MODEL_NAME).removeContextAndRelatedData(oCtx);
			}

			if (this._oValuationComponent) {
				this._oValuationComponent.removeRootBindingContext();
			}

			return this._createConfigurationContextAndBindingContext(this._getConfigurationContextData());
		},

		/**
		 * @override
		 */
		onBeforeRendering: function () {
			this.createComponents();
		},

		createComponents: function () {
			// Valuation
			if (!this._oValuationComponent) {
				this._oValuationComponent = this.createComponent({
					id: this.createId("valuationComponent"),
					usage: "valuationComponent",
					settings: {
						modelName: Constants.VCHCLF_MODEL_NAME,
						uiMode: "{configurationSettings>/uiMode}",
						draftTransactionController: "{configurationSettings>/transactionController}",
						semanticObject: "{configurationSettings>/semanticObject}",
						objectKey: "{configurationSettings>/objectKey}",
						descriptionMode: "{configurationSettings>/descriptionMode}",
						groupRepresentation: GroupRepresentation.FullScreen,
						showHiddenCharacteristics: "{configurationSettings>/showHiddenCharacteristics}",
						showPreciseDecimalNumbers: "{configurationSettings>/showPreciseNumbers}"
					},
					async: false
				});
				this.setAggregation("valuationComponent", this._oValuationComponent);
				this._registerValuationEvents();
			}

			// structure panel activation is determined from the Configuration Context Settings
			if (!this._oStructurePanelComponent) {
				this._oStructurePanelComponent = this.createComponent({
					usage: "structurePanelComponent",
					id: this.createId("structurePanelComponent"),
					settings: {
						modelName: Constants.VCHCLF_MODEL_NAME,
						semanticObject: "{configurationSettings>/semanticObject}",
						uiMode: "{configurationSettings>/uiMode}",
						descriptionMode: "{configurationSettings>/descriptionMode}",
						personalizationDAO: this.getPersonalizationDAO()
					},
					async: false
				});
				this.setAggregation("structurePanelComponent", this._oStructurePanelComponent);
				this._registerStructurePanelEvents();
			}

			//In case of the Simulation structure panel is initially opened
			if (this.getProperty("embeddingMode") === EmbeddingMode.Simulation) {
				var oPersonalizationDAO = this.getPersonalizationDAO();
				if (oPersonalizationDAO) {
					this._openStructurePanelInitiallyIfNoUserPersAvailable(oPersonalizationDAO);
				} else {
					this._getLayout().setShowLeftContent(true);
				}
			}

			// Inspector
			if (!this._oInspectorComponent) {
				this._oInspectorComponent = this.createComponent({
					usage: "inspectorComponent",
					id: this.createId("inspectorComponent"),
					settings: {
						modelName: Constants.VCHCLF_MODEL_NAME,
						semanticObject: "{configurationSettings>/semanticObject}",
						uiMode: "{configurationSettings>/uiMode}",
						showPreciseNumbers: "{configurationSettings>/showPreciseNumbers}",
						personalizationDAO: this.getPersonalizationDAO()
					},
					async: false
				});
				this.setAggregation("inspectorComponent", this._oInspectorComponent);
				this._oInspectorComponent.setVisibilityCheckCallBack(
					this._getInspectorVisibility.bind(this));
				this._registerInspectorEvents();
			}
		},

		/**
		 * @protected
		 */
		initConfigurationDAO: function () {
			if (!this._oConfigurationDAO) {
				this._oConfigurationDAO = this._createConfigurationDAO();
			}
		},

		/**
		 * @protected
		 */
		createConfigurationContextAndBindingContext: function () {
			this._createConfigurationContextAndBindingContext(this._getConfigurationContextData());
		},

		/**
		 * @return {sap.i2d.lo.lib.vchclf.components.valuation.component} Returns an instance of the Valuation Component
		 * @protected
		 */
		getValuationComponent: function () {
			return this._oValuationComponent;
		},

		/**
		 * @return {sap.i2d.lo.lib.vchclf.components.configuration.dao.ConfiguartionDAO} Returns an instance of the Configuration DAO
		 * @protected
		 */
		getConfigurationDAO: function () {
			return this._oConfigurationDAO;
		},

		/**
		 * Updates header information (title, actions & fields) of the dynamic page
		 * 
		 * @param {sap.i2d.lo.lib.vchclf.components.configuration.HeaderConfiguration} oHeaderConfiguration: contains actions, fields and title for the dynamic page 
		 * @public
		 */
		setHeaderConfiguration: function (oHeaderConfiguration) {
			this.setAggregation("headerConfiguration", oHeaderConfiguration);
			var oHeaderModel = oHeaderConfiguration ? oHeaderConfiguration.getHeaderConfigurationModel() : null;
			this.setModel(oHeaderModel, Constants.HEADER_CONFIGURATION_MODEL_NAME);
		},

		/**
		 * The (optional) footer of this page. It is always located at the bottom of the page
		 * @param {sap.m.IBar} oFooter the footer instance
		 * @public
		 */
		setFooter: function (oFooter) {
			this._addAcceptReviewBtnToFooter(oFooter);
			this._addReviseChangesBtnToFooter(oFooter);
			this._addHandoverToEngBtnToFooter(oFooter);
			this._addHandBackToEngBtnToFooter(oFooter);
			this._oFooter = oFooter;

			this._setFooterVisibility();

			// Binding of single aggregations is not possible, that is why we have to set the footer directly
			this._getDynamicPage().setFooter(oFooter);
			return this;
		},

		getFooter: function () {
			return this._oFooter;
		},

		/**
		 * @param {String} sSemanticObject Override Setter for metadata "semanticObject"
		 * @public
		 */
		setSemanticObject: function (sSemanticObject) {
			this.setProperty("semanticObject", sSemanticObject);
			this.getConfigurationSettingsModel().setProperty("/semanticObject", sSemanticObject);
			this._syncPersonalizationWithSettingsModel();
		},

		/**
		 * @param {String} sObjectKey Override Setter for metadata "objectKey"
		 * @public
		 */
		setObjectKey: function (sObjectKey) {
			var sDecodedObjectKey = "";

			if (sObjectKey) {
				sDecodedObjectKey = this._decodeString(sObjectKey);
			}

			this.setProperty("objectKey", sDecodedObjectKey);
			this.getConfigurationSettingsModel().setProperty("/objectKey", sDecodedObjectKey);
		},

		/**
		 * @return {string} returns the context ID
		 * @protected
		 */
		buildContextId: function () {
			var sCntxtId = VCH_CONTEXT_TYPE;
			for (var sKey in VCH_CONTEXT_ELEMENTS) {
				try {
					var Value = this.getProperty(VCH_CONTEXT_ELEMENTS[sKey]);
				} catch (e) {
					Value = null;
				}
				if (Value) {
					switch (typeof Value) {
					case "string":

						var iLength = decodeURIComponent(Value).length;
						break;
					case "boolean":
						iLength = 1;
						if (Value === true) {
							Value = "X";
						} else {
							Value = " ";
						}
						break;
					default:
						continue;
					}
					sCntxtId = sCntxtId + "(" + sKey.length + ")" + sKey + "(" + iLength + ")" + Value;
				}
			}
			return sCntxtId;
		},

		/**
		 * opens error dialog with given error information
		 * 
		 * @param {object} oError: contains error caused information
		 * @protected
		 * @function
		 */
		openErrorDialog: function (oError, fnCallback) {
			this.getModel(Constants.VCHCLF_MODEL_NAME).displayErrorMessages([oError], fnCallback);
		},

		/**
		 * Returns configuration instance path
		 * @return {string} Path to current configuration instance
		 * @protected
		 */
		getConfigurationInstancePath: function () {
			return this._sConfigurationInstancePath;
		},

		setEnableChangeDocumentsButton: function (bEnabled) {
			this.setProperty("enableChangeDocumentsButton", bEnabled);
			this.getConfigurationSettingsModel().setProperty("/enableChangeDocumentsButton", bEnabled);
		},

		setShowPricingInfo: function (bShowPricingInfo) {
			this.setProperty("showPricingInfo", bShowPricingInfo);
			this.getConfigurationSettingsModel().setProperty("/showPricingInfo", bShowPricingInfo);
		},

		setUiMode: function (sUiMode) {
			this.setProperty("embeddingUiMode", null);
			this._setUiMode(sUiMode);
		},

		_setUiMode: function (sUiMode) {
			var sNewUiMode = sUiMode;
			if (!this.getProperty("embeddingUiMode")) {
				this.setProperty("embeddingUiMode", sNewUiMode);
			}

			if (this.getProperty("embeddingUiMode") === UI_MODE.DISPLAY &&
				sNewUiMode === UI_MODE.EDIT) {
				//not allowed
				//when embedder defines read-only mode it can not be overwritten internally
				sNewUiMode = UI_MODE.DISPLAY;
			}

			this.setProperty("uiMode", sNewUiMode);

			var bEditable = sNewUiMode === UI_MODE.CREATE || sNewUiMode === UI_MODE.EDIT;
			this.getConfigurationSettingsModel().setProperty("/editable", bEditable);
			this.getConfigurationSettingsModel().setProperty("/uiMode", sNewUiMode);

			if (!this.getConfigurationSettingsModel().getProperty("/embeddingUiMode")) {
				//set it in initial setup to remember the embedder's uiMode setting
				this.getConfigurationSettingsModel().setProperty("/embeddingUiMode", sNewUiMode);
			}

			this._setFooterVisibility();
		},

		setEmbeddingMode: function (sEmbeddingMode) {
			this.setProperty("embeddingMode", sEmbeddingMode);
			this.getConfigurationSettingsModel().setProperty("/embeddingMode", sEmbeddingMode);
		},

		/**
		 * Updates the default binding context of the configuration component. Important for Configuration Header information (e.g Header Fields)
		 * 
		 * @param {string} sBindingPath The new binding path which is used to create a binding context.
		 * @return {Promise} A promise which will return the loaded design time metadata
		 * 
		 * @protected
		 * @function
		 */
		updateConfigObjectBindingContext: function (sBindingPath) {
			return new Promise(function (fnResolve, fnReject) {
				if (typeof sBindingPath === "string") {
					CommandManager.reset();
					var oODataModel = this.getModel(Constants.VCHCLF_MODEL_NAME);
					oODataModel.createBindingContext(sBindingPath, null, null, function (oNewBindingContext) {
						// ensure that the 'default' model matches our oODataModel - otherwise the propagatedContext instead of the newly created context is set!
						// ManagedObject -> _getBindingContext(..)
						if (this.getModel() !== oODataModel) {
							this.setModel(oODataModel);
						}
						this.setBindingContext(oNewBindingContext);
						fnResolve(oNewBindingContext);
					}.bind(this), true, true);
				} else {
					fnReject("Binding path has to be type of 'String'");
				}
			}.bind(this));
		},

		_evaluateEtoState: function (oConfigurationContext) {
			if (oConfigurationContext.UISettings.IsBOMChangeAllowed) {
				//in case BOM changes are allowed the status for the
				//order BOM engineer should make the configuration changeabl
				//the following status should switch to display mode:
				//ETO Process Started (IETST)
				//Engineering Done (IETFE)
				//ETO Completed (IETCO)
				//Review Done by Sales (IETRD)
				//Revised by Sales (IETRS)
				if (oConfigurationContext.EtoStatus === Constants.ETO_STATUS.PROCESSING_STARTED ||
					oConfigurationContext.EtoStatus === Constants.ETO_STATUS.ENGINEERING_FINISHED ||
					oConfigurationContext.EtoStatus === Constants.ETO_STATUS.PROCESSING_FINISHED ||
					oConfigurationContext.EtoStatus === Constants.ETO_STATUS.REVIEW_FINISHED_BY_SALES ||
					oConfigurationContext.EtoStatus === Constants.ETO_STATUS.REVISED_BY_SALES) {

					this._setUiMode("Display");
				}
			} else {
				//the following status should switch to display mode:
				//Engineering in process (IETPE)
				//Ready for Engineering (IETRE)
				//Engineering Done (IETFE) until review was done
				//Review Done by Sales (IETRD)
				//Reengineering needed / hand back to engineering (IETHB)
				if (oConfigurationContext.EtoStatus === Constants.ETO_STATUS.READY_FOR_ENGINEERING ||
					oConfigurationContext.EtoStatus === Constants.ETO_STATUS.IN_PROCESS_BY_ENGINEERING ||
					oConfigurationContext.EtoStatus === Constants.ETO_STATUS.ENGINEERING_FINISHED ||
					oConfigurationContext.EtoStatus === Constants.ETO_STATUS.REVIEW_FINISHED_BY_SALES ||
					oConfigurationContext.EtoStatus === Constants.ETO_STATUS.REENGINEERING_NEEDED) {

					this._setUiMode("Display");
				}
			}
		},

		_setFooterVisibility: function () {

			var bFooterIsVisible = !!this._oFooter;
			if (this._bIsSmartTemplate && this.getUiMode() === UI_MODE.DISPLAY) {
				bFooterIsVisible = false;
			}

			this.getConfigurationSettingsModel().setProperty("/showFooter", bFooterIsVisible);
		}
	});
});