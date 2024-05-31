/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/EventProvider",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/FeatureToggle",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/StructurePanelModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/model/StructureTreeModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/i18n",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/ODataModelHelper",
	"sap/base/Log",
	"sap/ui/core/UIComponent",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/config/UiConfig"
	// eslint-disable-next-line max-params
], function (Constants, EventProvider, FeatureToggle, StructurePanelModel, StructureTreeModel, i18n, ODataModelHelper,
	Log, UIComponent, UiConfig) {
	"use strict";

	return UIComponent.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.Component", {
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
				/** Personalization DAO contains personal settings e.g. description mode */
				personalizationDAO: {
					type: "sap.i2d.lo.lib.zvchclfz.components.configuration.dao.PersonalizationDAO"
				},
				/** Description Mode: Naming whether technical, description or both */
				descriptionMode: {
					type: "sap.i2d.lo.lib.zvchclfz.common.type.DescriptionMode"
				},
				/**
				 * Enables actions for BOM changes and shows OBOM specific columns
				 * @type {Boolean}
				 */
				isBOMChangeAllowed: {
					type: "boolean",
					defaultValue: false
				}
			},
			events: {
				inspectObject: {
					parameters: {
						objectPath: {
							type: "string"
						},
						objectType: {
							type: "string"
						},
						inspectorTab: {
							type: "string"
						}
					}
				},
				ReferenceCharacteristicSelected: {
					parameters: {
						path: {
							type: "string"
						},
						oConfigurationInstance: {
							type: "object"
						}
					}
				},

				closePanelPressed: {},

				/** Event for the finish of the BOM expolsion */
				BOMExplosionFinished: {},

				/** Event for when the BOM expolsion is triggered */
				BOMExplosionTriggered: {
					parameters: {
						isMultiLevel: {
							type: "boolean"
						}
					}
				},

				/** Event for the finish of the Routing expolsion */
				RoutingExplosionFinished: {},

				/** Event fired when BOM Navigation should happen, but BOM can not be found. */
				navigationToBOMCanNotBeFound: {},

				ConfigurableItemSelected: {
					parameters: {
						path: {
							type: "string"
						},
						oConfigurationInstance: {
							type: "object"
						}
					}
				},

				/** Event fired when a BOM component is deleted */
				BOMComponentDeleted: {
					parameters: {
						objectPath: {
							type: "string"
						}
					}
				},

				ConfigurableItemSelectionChanged: {}
			}
		},

		init: function () {
			// Call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			i18n.initModel(this.getModel("i18n"));
			StructureTreeModel.setOwnerComponent(this);
		},

		/**
		 * Initialize Component's model according to the modelName
		 * @private
		 */
		_initializeModel: function () {
			if (!this.__initializedModel) {
				if (typeof this.getModelName() !== "string") {
					this.__initializedModel = false;
					Log.error(
						"Missing model name",
						"Please set the modelName property for the component",
						"sap.i2d.lo.lib.zvchclfz.components.structurepanel.Component");
				} else {
					var oModel = this.getModel(this.getModelName());

					if (oModel) {
						ODataModelHelper.init(oModel);

						this.__initializedModel = true;
						this.setModel(oModel);

						if (!this.getModel("global")) {
							this.setModel(StructurePanelModel.getModel(), "global");
						}
					} else {
						this.__initializedModel = false;
						Log.error(
							"Invalid model name",
							"There is no model with this name",
							"sap.i2d.lo.lib.zvchclfz.components.structurepanel.Component");
					}
				}
			}
		},
		/**
		 * Sets IsBomChangeAllowed to the Component and to the Structure Panel model
		 *
		 * @param {boolean} bIsBOMChangeAllowed: are the BOM changes allowed or not.
		 * @public
		 */
		setIsBOMChangeAllowed: function (bIsBOMChangeAllowed) {
			this.setProperty("isBOMChangeAllowed", bIsBOMChangeAllowed);
			StructurePanelModel.setIsBOMChangeAllowed(bIsBOMChangeAllowed);
		},

		/**
		 * Updates the Configuration Context of the Structure Panel component
		 * @param {String} sContextId - The Configuration Context ID
		 * @param {Object} oPersonalizationData - personalization data from the Configuration Settings
		 * @public
		 */
		updateConfigurationContextId: function (sContextId, oPersonalizationData) {
			this._initializeModel();

			if (sContextId && typeof sContextId === "string") {
				//has to be fired before the Event , please to relocate it
				StructurePanelModel.personalize(oPersonalizationData);
				StructurePanelModel.updateConfigurationContextId(sContextId);
				StructurePanelModel.setSemanticObject(this.getSemanticObject());
				StructurePanelModel.setIsBOMInitialLoad(true);
				StructurePanelModel.setIsBOMExplosionPossible(true);

				EventProvider.fireContextChanged({
					contextId: sContextId
				});
			} else {
				Log.error(
					"Invalid parameter.",
					"Context ID is mandatory in string format.",
					"sap.i2d.lo.lib.zvchclfz.components.structurepanel");
			}
		},

		/**
		 * Returns whether the structure panel can be enabled
		 * @param {Object} oPersonalizationData - personalization data from the Configuration Settings
		 * @returns {Boolean} 	- can be enabled
		 * @public
		 */
		isStructurePanelEnabled: function (oPersonalizationData) {
			return StructurePanelModel.isStructurePanelEnabled(oPersonalizationData);
		},

		/**
		 * Resets the Structure Panel component
		 * @public
		 */
		resetComponent: function () {
			EventProvider.fireResetStructurePanel();
		},

		/**
		 * Update UiMode and the editable property.
		 * @param {String} sUiMode The new Ui mode.
		 * @public
		 */
		setUiMode: function (sUiMode) {
			var bEditable = sUiMode === Constants.uiMode.Create || sUiMode === Constants.uiMode.Edit;

			if (this.getUiMode() !== sUiMode){
				this.setProperty("uiMode", sUiMode);
				StructurePanelModel.setStructurePanelEditable(bEditable);

				EventProvider.fireRedetermineStructureTreeColumnLayout();
			}
		},

		/**
		 * Triggers the BOM explosion
		 * @returns {Promise} Promise object which will be resolved after the explosion
		 * @public
		 */
		reexplodeBOM: function () {
			return new Promise(function (fnResolve) {
				if (StructurePanelModel.getIsBOMExplosionPossible() ||
				    StructurePanelModel.getIsMultiLevelScenario()) {
					var fnCallback = function () {
						fnResolve();

						EventProvider.detachStructureTreeRefreshed(fnCallback);
					};

					EventProvider.attachStructureTreeRefreshed(fnCallback);

					EventProvider.fireRefreshStructureTree();
				} else {
					fnResolve();
				}
			});
		},

		/**
		 * Returns the path of the root BOM component
		 * @returns {String} Root BOM component path
		 * @public
		*/
		getRootBOMComponentPath: function () {
			return ODataModelHelper.generateBOMNodePath(
				StructurePanelModel.getConfigurationContextId(),
				StructureTreeModel.getRootComponent().ComponentId);
		},

		/**
		 * Update DescriptionMode property
		 * @param {sap.i2d.lo.lib.zvchclfz.common.type.DescriptionMode} sDescriptionMode - The new DescriptionMode
		 * @public
		 */
		setDescriptionMode: function (sDescriptionMode) {
			var sPrevDescriptionMode = this.getProperty("descriptionMode");

			this.setProperty("descriptionMode", sDescriptionMode);
			StructurePanelModel.setDescriptionMode(sDescriptionMode);

			if (sPrevDescriptionMode && sPrevDescriptionMode !== sDescriptionMode) {
				EventProvider.fireDescriptionModeChanged();
			}
		},

		/**
		 * Called by UI5 runtime. Lifecycle exit method.
		 * @private
		 */
		exit: function () {
			FeatureToggle.resetValues();
			ODataModelHelper.destroy();
		}
	});
});
