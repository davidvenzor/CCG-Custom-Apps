/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/UiConfig",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/EventProvider",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/NavigationManager",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/i18n",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/ODataModelHelper",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/TraceUtil",
	"sap/base/Log",
	"sap/ui/core/UIComponent"
	// eslint-disable-next-line max-params
], function (UiConfig, Constants, EventProvider, InspectorModel, NavigationManager, i18n, ODataModelHelper,
	TraceUtil, Log, UIComponent) {
	"use strict";

	return UIComponent.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.Component", {

		metadata: {
			manifest: "json",
			properties: {
				/** Name of the model, provided from the embedder */
				modelName: {
					type: "string"
				},
				/** Semantic object - defines the environment where the component is embedded */
				semanticObject: {
					type: "string"
				},
				/**UI Mode: Display or Edit */
				uiMode: {
					type: "string",
					defaultValue: "Display"
				},
				/**Personalization DAO contains personal settings e.g. description mode*/
				personalizationDAO: {
					type: "sap.i2d.lo.lib.zvchclfz.components.configuration.dao.PersonalizationDAO"
				},
				/** Indicator whether the trace should show precise numbers for values or not */
				showPreciseNumbers: {
					type: "boolean"
				}
			},
			events: {
				/** Event is fired when panel needs to be closed (X button) */
				closePanelPressed: {},
				/** Event fired when the trace is activated */
				traceInitiallyActive: {},
				/** Event fired when BOM Navigation should happen, but there is no BOM Application. */
				navigationToBOMwithoutBOMApp: {},
				/** Event fired when BOM Navigation should happen, but BOM can not be found. */
				navigationToBOMCanNotBeFound: {},
				/** Event is fires when panel needs to be opened */
				openPanel: {}
				/** Event fired when "Show in Configuration" option is selected in the Trace */
				// showCharacteristicInConfiguration: { not valid until 1802
				// 	/** Path for the characteristic */
				// 	csticPath: "string"
				// }
			}
		},

		/**
		 * Cleans up the Component instance before destruction.
		 * @public
		 */
		exit: function () {
			NavigationManager.teardown();
			ODataModelHelper.destroy();
		},

		/**
		 * Initialize Component's model according to the modelName
		 * @private
		 */
		_initializeModel: function () {
			if (typeof this.getModelName() !== "string") {
				Log.error(
					"Missing model name",
					"Please set the modelName property for the component",
					"sap.i2d.lo.lib.zvchclfz.components.inspector.Component");
			} else {
				var oModel = this.getModel(this.getModelName());

				if (oModel) {
					ODataModelHelper.init(oModel);
					i18n.initModel(this.getModel("i18n"));

					this.setModel(oModel);

					if (!this.getModel("global")) {
						this.setModel(InspectorModel.getModel(), "global");
					}
				} else {
					Log.error(
						"Invalid model name",
						"There is no model with this name",
						"sap.i2d.lo.lib.zvchclfz.components.inspector.Component");
				}
			}
		},

		/**
		 * Restricts the comparison results to the given configuration instance
		 * @param {Object} oConfigurationInstance - the configuration instance from the configuration component
		 * @public
		 */
		restrictComparisonView: function (oConfigurationInstance) {
			EventProvider.fireRestrictComparison({
				oConfigurationInstance: oConfigurationInstance
			});
		},

		/**
		 * Process the navigation of the inspector
		 * @param {String} sObjectPath - Path of the object
		 * @param {String} sObjectType - Type of the object
		 * @param {Boolean} bIsDirectNavigation - Flag whether the navigation has been triggered as direct
		 * @param {Object} [oKeyParameters] - key parameters
		 * @private
		 */
		_processNavigation: function (sObjectPath, sObjectType, bIsDirectNavigation, oKeyParameters) {
			// If the navigation is direct, the inspector should be opened
			if (bIsDirectNavigation) {
				InspectorModel.selectInspectorView();
				this.fireOpenPanel();
			}

			// If the same item is triggered again, do nothing
			if (!InspectorModel.compareWithLastAccessObject(sObjectPath, sObjectType)) {
				// Store as last accessed object
				// This is used in setting of properties hence why it is set first before navigation
				InspectorModel.setLastAccessObject(sObjectPath, sObjectType);

				// When the inspector is hidden, it is not updated
				if (InspectorModel.getInspectorVisibility()) {

					NavigationManager.setOwnerComponent(this);

					// Navigate
					NavigationManager.setRoot(sObjectPath, sObjectType, oKeyParameters);

					// Indicator whether the navigation is triggered
					// Used so we don't trigger the navigation once the inspector is hidden
					InspectorModel.setInspectorComponentUpdated(true);
				} else {
					InspectorModel.setInspectorComponentUpdated(false);
				}
			}
		},

		/**
		 * Before rendering event handler
		 * @public
		 */
		onBeforeRendering: function () {
			this.updateNavigationManager();
		},

		/**
		 * Updates the navigation manager if the inspector is selected and context is changed
		 * @protected
		 */
		updateNavigationManager: function () {
			if (InspectorModel.getInspectorVisibility() &&
				InspectorModel.getLastAccessObjectPath() &&
				InspectorModel.getLastAccessObjectType()) {

				if (!InspectorModel.getInspectorComponentUpdated()) {
					NavigationManager.setOwnerComponent(this);

					// navigate
					NavigationManager.setRoot(
						InspectorModel.getLastAccessObjectPath(),
						InspectorModel.getLastAccessObjectType()
					);

					InspectorModel.setInspectorComponentUpdated(true);
				} else if (InspectorModel.getInspectorContentInvalidated()) {
					NavigationManager.reloadContentOfPages();
				}
			}
		},

		/**
		 * Sets the provided object as the root node of the inspector if the tracking is switched on
		 * @param {String} sObjectPath - Path of the object
		 * @param {String} sObjectType - Type of the object
		 * @param {Object} [oKeyParameters]  - Optional Key Values pairs
		 * @private
		 */
		_processIfEventConnected: function (sObjectPath, sObjectType, oKeyParameters) {
			// navigate to the object's details if the tracking is on
			if (InspectorModel.getProperty("/isTrackEventConnected")) {
				this._processNavigation(
					sObjectPath,
					sObjectType,
					false,
					oKeyParameters);
			}
		},

		/**
		 * Opens an object view in the Inspector
		 * @param {String} sObjectPath - path of the inspected object
		 * @param {sap.i2d.lo.lib.vchclf.common.type.InspectorMode.objectType}
		 * 	sObjectType - type of the inspected object
		 * @param {sap.i2d.lo.lib.vchclf.common.type.InspectorMode.inspectorTab}
		 * 	[sInspectorTab] - tab of the inspector in case of direct navigation
		 * @param {Object} [oKeyParameters] - Optional Key Values pairs
		 * @param {Boolean} [bForceInspect] - Force the inspection of the object
		 * @public
		 */
		inspectObject: function (sObjectPath, sObjectType, sInspectorTab, oKeyParameters, bForceInspect) {
			// TODO: sometimes we should force the inspection and switch to the defined tab of the inspector view
			// sometimes we should only force the inspection of the object without switch to the inspector view
			// this should be handled in a more clear way
			if (sInspectorTab) {
				this._processNavigation(
					sObjectPath,
					sObjectType,
					true,
					oKeyParameters);

				EventProvider.fireChangeTheSelectedTabOfInspector({
					tabKey: sInspectorTab
				});
			} else if (bForceInspect) {
				this._processNavigation(
					sObjectPath,
					sObjectType,
					false,
					oKeyParameters);
			} else {
				this._processIfEventConnected(
					sObjectPath,
					sObjectType,
					oKeyParameters);
			}
		},

		/**
		 * Checks whether the given object is currently inspected
		 * @param {String} sObjectPath - path of the object
		 * @param {sap.i2d.lo.lib.vchclf.common.type.InspectorMode.objectType}
		 * 	sObjectType - type of the object
		 * @returns {Boolean} Flag whether the object is inspected
		 */
		isObjectInspected: function (sObjectPath, sObjectType) {
			return InspectorModel.compareWithLastAccessObject(sObjectPath, sObjectType);
		},

		/**
		 * Entry point for showing the configuration profile
		 * @param {Object} oProfileParams - parameters of the configuration profile
		 * @param {Boolean}
		 * 	[bIsInitialObjectOpening] - flag whether the call came from the updateConfigurationContextId function
		 * @public
		 */
		openConfigurationProfileProperties: function (oProfileParams, bIsInitialObjectOpening) {
			var sConfigurationProfilePath = this.getModel().createKey(Constants.entitySets.ConfigurationProfile, {
				ContextId: InspectorModel.getConfigurationContextId(),
				ConfigurationProfileNumber: oProfileParams.counter,
				Product: oProfileParams.product
			});

			this._processNavigation(
				"/" + sConfigurationProfilePath,
				UiConfig.inspectorMode.objectType.ConfigurationProfile,
				!bIsInitialObjectOpening // initially we should not open the inspector, only if user clicks on link
			);
		},

		/**
		 * Opens Dependencies Details page
		 * @param {Object} sDependencyNumber - dependency number
		 * @public
		 */
		openDependencyDetails: function (sDependencyNumber) {
			if (sDependencyNumber) {
				var sPath = this.getModel().createKey("/" + Constants.entitySets.ObjectDependencyDetails, {
					ContextId: InspectorModel.getConfigurationContextId(),
					ObjectDependency: sDependencyNumber
				});

				this._processNavigation(
					sPath,
					UiConfig.inspectorMode.objectType.ObjectDependency,
					true);
			}
		},

		/**
		 * Updates the Configuration Context of the Inspector component
		 * @param {String} sContextId - The Configuration Context ID
		 * @param {String} sInstanceId - The ID of the instance
		 * @param {Object} oPersonalizationData - Personalization data from the Configuration Settings
		 * @param {Boolean} bIsStructurePanelEnabled - Flag whether the structure panel is enabled
		 * @public
		 */
		updateConfigurationContextId: function (sContextId, sInstanceId, oPersonalizationData,
			bIsStructurePanelEnabled) {

			this._initializeModel();

			if (sContextId && typeof sContextId === "string") {
				// If configuration context is change Trace Reset is also triggered
				// This should be before the setup the model with the new context
				var sPreviousConfigurationContextId = InspectorModel.getConfigurationContextId();
				var sUiMode = this.getProperty("uiMode");
				var bInspectorEditable = sUiMode === Constants.uiMode.Create || sUiMode === Constants.uiMode.Edit;
				var bIsExternalNavigationEnabled = this.getSemanticObject() ===
					Constants.semanticObject.variantConfiguration;

				InspectorModel.setupModel(
					sContextId,
					sInstanceId,
					oPersonalizationData,
					this.getProperty("showPreciseNumbers"),
					bInspectorEditable,
					bIsExternalNavigationEnabled
				);

				// The Trace shall be reset only after the setupModel
				if (sContextId !== sPreviousConfigurationContextId) {
					this.resetTrace();
				}

				if (this.getSemanticObject() !== Constants.semanticObject.variantConfiguration ||
					!bIsStructurePanelEnabled) {

					this.openConfigurationProfileProperties({
						product: "",
						counter: ""
					}, true);
				}


				// set comparison view as default if comparison is allowed
				if (InspectorModel.getProperty("/isConfigComparisonAllowed")) {
					InspectorModel.selectComparisonView();
					EventProvider.fireInitComparison({
						configurationContextId: InspectorModel.getConfigurationContextId()
					});
				} else {
					TraceUtil.checkTraceIsSupportedAndActive(sContextId)
						.then(function () {
							InspectorModel.setProperty("/isTraceOn", true);
							InspectorModel.setProperty("/isTraceActivatedOnce", true);
							InspectorModel.selectTraceView();
							this.triggerTraceFetch();
							this.fireTraceInitiallyActive();
						}.bind(this))
						.catch(function () {
							InspectorModel.setProperty("/isTraceOn", false);
							InspectorModel.setProperty("/isTraceActivatedOnce", false);
							InspectorModel.selectInspectorView();
							this.updateNavigationManager();
						}.bind(this));
				}
			} else {
				Log.error(
					"Invalid parameter.",
					"Context ID is mandatory in string format.",
					"sap.i2d.lo.lib.zvchclfz.components.inspector");
			}
		},

		/**
		 * Resets the Inspector component
		 * @public
		 */
		resetInspector: function () {
			// Reset the navigation manager
			NavigationManager.resetRoot();

			// Indicator whether the navigation is triggered
			// Used so we don't trigger the navigation once the inspector is hidden
			InspectorModel.setInspectorComponentUpdated(false);
		},

		/**
		 * Resets the Trace
		 * @public
		 */
		resetTrace: function () {
			EventProvider.fireResetTrace();
		},

		/**
		 * Saves the Trace state
		 * @public
		 */
		saveTraceState: function () {
			EventProvider.fireSaveTraceState();
		},

		/**
		 * Restores a previously saved Trace state
		 * @public
		 */
		restoreTraceState: function () {
			EventProvider.fireRestoreTraceState();
		},

		/**
		 * Refresh the properties of values of characteristic if it is opened
		 * @param {Object[]} aChangedCharacteristics - array of changed characteristics
		 * @public
		 */
		refreshCharacteristicValues: function (aChangedCharacteristics) {
			var oModel = this.getModel(this.getModelName());
			var sCurrentObjectPath = InspectorModel.getLastAccessObjectPath();

			$.each(aChangedCharacteristics, function (iIndex, oValue) {
				var sCsticPath = "/" + oModel.createKey(Constants.entitySets.Characteristic, {
					GroupId: oValue.GroupId,
					InstanceId: oValue.InstanceId,
					CsticId: oValue.CsticId,
					ContextId: oValue.ContextId
				});

				if (sCsticPath === sCurrentObjectPath) {
					// Fire event and exit the loop
					EventProvider.fireRebindValueList({
						csticPath: sCsticPath
					});

					NavigationManager.removeValuePages();

					return false;
				}

				return undefined;
			});
		},

		/**
		 * Refresh the Routing item if it is opened
		 * @public
		 */
		refreshRoutingItem: function () {
			var aRoutingRelatedObjects = [
				UiConfig.inspectorMode.objectType.RoutingHeader,
				UiConfig.inspectorMode.objectType.ParallelSequence,
				UiConfig.inspectorMode.objectType.AlternativeSequence,
				UiConfig.inspectorMode.objectType.Operation,
				UiConfig.inspectorMode.objectType.SubOperation,
				UiConfig.inspectorMode.objectType.PRT
			];

			if (aRoutingRelatedObjects.indexOf(InspectorModel.getLastAccessObjectType()) >= 0) {
				this._reloadContentOfPages();
			}
		},

		/**
		 * Refresh the BOM item if it is opened
		 * @public
		 */
		refreshBOMItem: function () {
			var aBOMRelatedObjects = [
				UiConfig.inspectorMode.objectType.BOMComponent,
				UiConfig.inspectorMode.objectType.ClassNode
			];

			if (aBOMRelatedObjects.indexOf(InspectorModel.getLastAccessObjectType()) >= 0) {
				this._reloadContentOfPages();
			}
		},

		/**
		 * Reload the content of pages of inspector component
		 * @private
		 */
		_reloadContentOfPages: function () {
			// When the inspector is hidden, it is not updated
			if (InspectorModel.getInspectorVisibility()) {
				NavigationManager.reloadContentOfPages();
			} else {
				InspectorModel.setInspectorContentInvalidated();
			}
		},

		/**
		 * Fetches the latest changes of the trace
		 * @public
		 */
		triggerTraceFetch: function () {
			if (InspectorModel.getProperty("/isTraceOn")) {
				EventProvider.fireFetchTrace();
			}
		},

		/**
		 * Callback whether the inspector is visible
		 * @param {Callback} fnCallBack - function used to check inspector visibility
		 * @public
		 */
		setVisibilityCheckCallBack: function (fnCallBack) {
			InspectorModel.setInspectorVisibilityChecker(fnCallBack);
		},

		/**
		 * Update UiMode and the editable property.
		 * @param {String} sUiMode The new Ui mode.
		 * @public
		 * @override
		 */
		setUiMode: function (sUiMode) {
			var bEditable = sUiMode === Constants.uiMode.Create || sUiMode === Constants.uiMode.Edit;

			this.setProperty("uiMode", sUiMode);
			InspectorModel.setIsInspectorEditable(bEditable);
		},

		/**
		 * Sets whether the trace should show precise numbers for values or not
		 * @param {Boolean} bShowPreciseNumbers - show precise number flag
		 * @public
		 * @override
		 */
		setShowPreciseNumbers: function (bShowPreciseNumbers) {
			this.setProperty("showPreciseNumbers", bShowPreciseNumbers);

			InspectorModel.setShowPreciseNumbers(bShowPreciseNumbers);
		}
	});
});
