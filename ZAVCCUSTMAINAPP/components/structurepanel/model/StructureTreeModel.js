/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/common/type/InspectorMode",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/dao/BOMNodeSetDAO",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/StructurePanelModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/HashGenerator",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/i18n",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/MessageManager",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/ODataModelHelper",
	"sap/ui/model/json/JSONModel"
	// eslint-disable-next-line max-params
], function (InspectorMode, BOMNodeSetDAO, Constants, StructurePanelModel, HashGenerator, i18n,
	MessageManager, ODataModelHelper, JSONModel) {
	"use strict";

	/**
	 * Model class for StructureTree controller
	 * @class
	 */
	var StructureTreeModel = function () {
		/**
		 * Constant for number of preloaded levels
		 * @type {int}
		 * @constant
		 * @private
		 */
		this.EXPAND_LEVEL_COUNT = 2;

		/**
		 * Store the reference to the Component
		 * @type {sap.i2d.lo.lib.zvchclfz.components.structurepanel.Component}
		 * @private
		 */
		this._ownerComponent = null;

		/**
		 * Model for storing BOM data for ui binding
		 * @type {sap.ui.model.json.JSONModel}
		 * @private
		 */
		this._model = new JSONModel({
			/**
			 * BOM Components
			 * @type {Object}
			 */
			BOMComponents: null,

			/**
			 * TreeDepth
			 * @type {int}
			 */
			treeDepth: 0,

			/**
			 * Flag whether the tree should be re-exploded
			 * @type {Boolean}
			 */
			isReexplodable: false
		});

		/**
		 * Cache for BE's flat structured response
		 * @type {Object[]}
		 * @private
		 */
		this._flatStructure = [];

		/**
		 * Cache for external BOM Bindings
		 * @type {sap.ui.model.PropertyBinding[]}
		 * @private
		 */
		this._externalBOMBindings = [];

		/**
		 * Cache currently applied filter
		 * @type {sap.ui.model.Filter[]}
		 * @private
		 */
		this._extendedFilters = [];

		/**
		 * Cache currently applied text for Product filter
		 * @type {String}
		 * @private
		 */
		this._productFilterText = "";
	};

	/**
	 * Sets the reference to the Component
	 * @param {sap.i2d.lo.lib.zvchclfz.components.structurepanel.Component} oComponent - Reference to the component
	 * @public
	 */
	StructureTreeModel.prototype.setOwnerComponent = function (oComponent) {
		this._ownerComponent = oComponent;
	};

	/**
	 * Stores the text of the Product filter
	 * @param {String} sValue - value of the filter
	 * @public
	 */
	StructureTreeModel.prototype.setProductFilterText = function (sValue) {
		this._productFilterText = sValue;
	};

	/**
	 * Returns the currently applied text of the Product filter
	 * @returns {String} value of the filter
	 * @public
	 */
	StructureTreeModel.prototype.getProductFilterText = function () {
		return this._productFilterText;
	};

	/**
	 * Get the root component of the BOM
	 * @returns {Object} The root component
	 * @public
	 */
	StructureTreeModel.prototype.getRootComponent = function () {
		var oBOMComponents = this._model.getProperty("/BOMComponents");

		try {
			if (oBOMComponents.items[0].ParentComponentId === Constants.BOMItemProperties.rootParentComponentId) {
				return oBOMComponents.items[0];
			} else {
				return null;
			}
		} catch (oError) {
			return null;
		}
	};

	/**
	 * Get BOM component from the Model by given ID to have the recent state
	 * @param {string} sBOMComponentId - BOM component ID
	 * @returns {Object} The BOM component
	 * @public
	 */
	StructureTreeModel.prototype.getBOMComponentById = function (sBOMComponentId) {
		if (sBOMComponentId) {
			// _flatStructure contains the list of BOM items cached as returned by the service not formated for the tree
			// We get a BOM Node using the properties which are structural relevant
			// State properties like IsExcludedItem and IsConfigurableItem are not considered
			// The main use of this function is to get the BOM component with currently properties
			var aBOMItem = $.grep(this._flatStructure, function (oFlatObject) {
				return oFlatObject.ComponentId === sBOMComponentId;
			});

			return aBOMItem.length > 0 ? aBOMItem[0] : null;
		} else {
			return null;
		}
	};

	/**
	 * Get BOM component from the Model to have the recent state
	 * @param {Object} oBOMItem - BOM component
	 * @returns {Object} The BOM component
	 * @public
	 */
	StructureTreeModel.prototype.getBOMComponent = function (oBOMItem) {
		if (oBOMItem) {
			// _flatStructure contains the list of BOM items cached as returned by the service not formated for the tree
			// We get a BOM Node using the properties which are structural relevant
			// State properties like IsExcludedItem and IsConfigurableItem are not considered
			// The main use of this function is to get the BOM component with currently properties
			var aBOMItem = $.grep(this._flatStructure, function (oFlatObject) {
				return oFlatObject.ComponentId === oBOMItem.ComponentId &&
					oFlatObject.BOMComponentName === oBOMItem.BOMComponentName;
			});

			return aBOMItem.length > 0 ? aBOMItem[0] : null;
		} else {
			return null;
		}
	};

	/**
	 * Resets the model class
	 * @public
	 */
	StructureTreeModel.prototype.resetModel = function () {
		this._resetTreeModelData();

		this.clearExtendedFilters();
	};

	/**
	 * Resets the Tree Data
	 * @private
	 */
	StructureTreeModel.prototype._resetTreeModelData = function () {
		this._model.setProperty("/BOMComponents", null);
		this._model.setProperty("/treeDepth", 0);

		this._flatStructure = [];
		this._oCachedBOMTreeifiedResults = null;
		this._oCurrentBOMTreeifiedResults = null;
	};

	/**
	 * Updates the flat structure from BE response
	 * @param {Object[]} aResults - BE service result in flat structure
	 * @returns {Boolean} Indicator whether the flat structure is updated
	 * @private
	 */
	StructureTreeModel.prototype._updateFlatStructure = function (aResults) {
		var bIsUpdated = false;

		if ($.isArray(aResults) && aResults.length > 0) {
			if (this._flatStructure.length > 0) {
				// Checking if the results exist in the Flat structure to avoid adding duplicated
				$.each(aResults, function (iIndex, oBOMItem) {
					if (!this.getBOMComponent(oBOMItem)) {
						this._flatStructure.push(oBOMItem);
						bIsUpdated = true;
					}
				}.bind(this));
			} else {
				// If _flatStructure is empty add all
				this._flatStructure = aResults;
				bIsUpdated = true;
			}
		}

		return bIsUpdated;
	};

	/**
	 * Builds hierarchical tree from flat structure
	 * @param {Object[]} aFlatStructure - BE service result in flat structure
	 * @returns {Object} Structure in hierarchical representation
	 * @private
	 */
	StructureTreeModel.prototype._treeify = function (aFlatStructure) {
		var aTreeHierarchy = [];
		var oLookup = {};
		var iTreeDepth = 0;
		var aBOMStates = [];

		// Build lookup object
		$.each(aFlatStructure, function (iIndex, oBOMComponent) {
			var iComponentLevel = null;

			// Used for comparison only structural change relevant changes should be considered
			aBOMStates.push({
				ComponentId: oBOMComponent.ComponentId,
				State: HashGenerator.generateHashForEntity(
					oBOMComponent,
					[Constants.navigationProperty.ConfigurationInstance.name])
			});

			oBOMComponent.items = oBOMComponent.items || [];
			oLookup[oBOMComponent.ComponentId] = oBOMComponent;

			// Calculate tree depth
			iComponentLevel = parseInt(oBOMComponent.ComponentLevel, 10);
			iTreeDepth = iComponentLevel > iTreeDepth ? iComponentLevel : iTreeDepth;
		});

		// Assign children to their parents
		$.each(aFlatStructure, function (iIndex, oBOMComponent) {
			if (oBOMComponent.ParentComponentId !== Constants.BOMItemProperties.rootParentComponentId) {
				// Push if it's not already there
				var aComponentItems = oLookup[oBOMComponent.ParentComponentId] &&
					oLookup[oBOMComponent.ParentComponentId].items;

				if ($.isArray(aComponentItems)) {
					var oComponentWithSameId = $.grep(aComponentItems, function (oElement) {
						return oElement.ComponentId === oBOMComponent.ComponentId;
					})[0];

					if (!oComponentWithSameId) {
						aComponentItems.push(oBOMComponent);
					}
				}
			} else {
				aTreeHierarchy.push(oBOMComponent);
			}
		});

		// Add dummy object to collection to enable lazy loading
		$.each(aFlatStructure, function (iIndex, oBOMComponent) {
			if (oBOMComponent.DrilldownState === Constants.drillDownState.expanded &&
				oBOMComponent.items.length === 0) {

				oBOMComponent.items.push({
					Quantity: "",
					Unit: "",
					BOMComponentName: i18n.getText("vchclf_structpnl_tree_download_placeholder"),
					dataDownloadNeeded: true,
					ObjectDependencyAssgmtNumber: Constants.intialObjectDependencyAssgmtNumber,
					HasRouting: false,
					// This property is added so we can collapse the parent node for the downloading node
					parentComponent: oBOMComponent
				});
			}
		});

		return {
			aTree: aTreeHierarchy,
			iTreeDepth: iTreeDepth,
			aFlatStructure: aFlatStructure,
			sBOMState: JSON.stringify(aBOMStates.sort(function (oFirstComponent, oSecondComponent) {
				return oFirstComponent.ComponentId.localeCompare(
					oSecondComponent.ComponentId);
			})) // Relevate for structural change sorted by ComponentId
		};
	};

	/**
	 * Binds the results to the tree model
	 * @param {Object[]} aData - Tree data
	 * @param {Boolean} bResetTreeModelData - Indicator on whether to reset the internal flat structure
	 * @private
	 */
	StructureTreeModel.prototype._bindTreeToModel = function (aData, bResetTreeModelData) {
		if (bResetTreeModelData) {
			this._resetTreeModelData();
		}

		// Update cached data with the new values
		if (this._updateFlatStructure(aData)) {
			// Create tree from updated flat structure
			var oTreeified = this._treeify(this._flatStructure);

			// This is to be used for comparison
			this._oCurrentBOMTreeifiedResults = oTreeified;
			// Save tree depth
			this._model.setProperty("/treeDepth", oTreeified.iTreeDepth);

			// Update model
			this._model.setProperty("/BOMComponents", {
				items: oTreeified.aTree
			});

			// Configuration Status Column is only available for Multi-level scenario
			if (StructurePanelModel.getIsMultiLevelScenario()) {
				// Adding Configuration instance binding so we update the Structure Panel's Status
				// column when the instance is updated
				this._addConfigurationInstanceBindings();
			}
			//Updated Currently Focused item with most recent data
			StructurePanelModel.setCurrentlyFocusedBOMItem(
				this.getBOMComponent(
					StructurePanelModel.getCurrentlyFocusedBOMItem()));
		}
	};

	/**
	 * Getter for the model object of the class
	 * @returns {sap.ui.model.json.JSONModel} Model with bindable data
	 * @public
	 */
	StructureTreeModel.prototype.getModel = function () {
		return this._model;
	};

	/**
	 * Reads the exploded BOM from the BE & maps to the model
	 * @param {String} [sChangeSetId] - an optional id of a changeSet this request should belong to
	 * @returns {Promise} Promise object
	 */
	StructureTreeModel.prototype.explodeBOM = function (sChangeSetId) {
		return new Promise(function (fnResolve, fnReject) {
			// Reset the messages belonging to the Structure Panel
			MessageManager.dropStructurePanelMessages();

			BOMNodeSetDAO.explodeAndReadBOM(
					StructurePanelModel.getConfigurationContextId(),
					this._getCurrentlyAppliedFilters(),
					StructurePanelModel.getIsMultiLevelScenario(),
					StructurePanelModel.getIsBOMInitialLoad(),
					StructurePanelModel.getForceBOMExplosion(),
					sChangeSetId)
				.then(function (aResults) {
					this._fireInspectObject(StructurePanelModel.getIsBOMInitialLoad(), aResults);

					// Update the binding to the Tree model
					// Resets model
					this._bindTreeToModel(aResults, true);

					this._resetBOMFlags();
					fnResolve();
				}.bind(this))
				.catch(function (oError) {
					fnReject(oError);
				});
		}.bind(this));
	};

	/**
	 * Explode BOM with the current tree depth without updating the model
	 * @returns {Promise} Promise object
	 * @public
	 */
	StructureTreeModel.prototype.explodeBOMWithoutUpdatingTheModel = function () {
		return new Promise(function (fnResolve, fnReject) {
			var aFilters = this._getCurrentlyAppliedFilters();
			var iTreeDepth = this._model.getProperty("/treeDepth");
			var bIsInitialLoad = StructurePanelModel.getIsBOMInitialLoad();

			// Adding the Component Level filter
			if (iTreeDepth !== 0) {
				// The ComponentLevel is only to be applied once not to be maintained
				aFilters.push(new sap.ui.model.Filter({
					path: "ComponentLevel",
					operator: sap.ui.model.FilterOperator.BT,
					value1: 0, // Load from the Root Node
					value2: iTreeDepth + 1
				}));
			}

			// Reset the messages belonging to the Structure Panel
			MessageManager.dropStructurePanelMessages();

			BOMNodeSetDAO.explodeAndReadBOM(
					StructurePanelModel.getConfigurationContextId(),
					aFilters,
					StructurePanelModel.getIsMultiLevelScenario(),
					bIsInitialLoad,
					StructurePanelModel.getForceBOMExplosion())
				.then(function (aResults) {
					this._fireInspectObject(bIsInitialLoad, aResults);

					StructurePanelModel.setIsBOMInitialLoad(false);
					StructurePanelModel.setForceBOMExplosion(false);

					if ($.isArray(aResults)) {
						this._oCachedBOMTreeifiedResults = this._treeify(aResults);

						if (!this._oCurrentBOMTreeifiedResults ||
							!this._oCurrentBOMTreeifiedResults.sBOMState) {
							// If no previous state exists enforce the refresh
							fnResolve(true);
						} else {
							// Comparing the two states
							fnResolve(this._oCachedBOMTreeifiedResults.sBOMState !==
								this._oCurrentBOMTreeifiedResults.sBOMState);
						}
					} else {
						// Don't refresh the model
						fnResolve(false);
					}
				}.bind(this))
				.catch(function (oError) {
					fnReject(oError);
				});
		}.bind(this));
	};
	/**
	 * Explodes the BOM
	 * @param {String} [sChangeSetId] - an optional id of a changeSet this request should belong to
	 * @returns {Promise} Promise object
	 */
	StructureTreeModel.prototype.explodeBOMWithoutRead = function (sChangeSetId) {
		return new Promise(function (fnResolve, fnReject) {
			BOMNodeSetDAO.explodeBOM(
					StructurePanelModel.getConfigurationContextId(),
					StructurePanelModel.getIsBOMInitialLoad(),
					StructurePanelModel.getForceBOMExplosion(),
					sChangeSetId)
				.then(function () {
					this._resetBOMFlags();

					fnResolve();
				}.bind(this))
				.catch(fnReject);
		}.bind(this));
	};

	/**
	 * Fires the Inspection
	 * @param {Boolean} bIsInitialLoad - Checks whether this is the initial loading of the BOM
	 * @param {Object[]} aResults - StructureTree results
	 * @private
	 */
	StructureTreeModel.prototype._fireInspectObject = function (bIsInitialLoad, aResults) {
		if (this._ownerComponent &&
			StructurePanelModel.getSemanticObject() === Constants.semanticObject.variantConfiguration &&
			bIsInitialLoad && $.isArray(aResults) && aResults.length > 0) {

			this._ownerComponent.fireInspectObject({
				objectPath: ODataModelHelper.generateBOMNodePath(
					StructurePanelModel.getConfigurationContextId(), aResults[0].ComponentId),
				objectType: InspectorMode.objectType.BOMComponent
			});
		}
	};

	/**
	 * Reloads the TreeModel from the Cached model
	 * @private
	 */
	StructureTreeModel.prototype._refreshModelFromCache = function () {
		this._bindTreeToModel(this._oCachedBOMTreeifiedResults.aFlatStructure, true);
	};

	/**
	 * Loads a specified level of BOM nodes for a given parent. If no parent is set, the default is the root
	 * @param {Object} oComponent - BOM Component data which needs to be expanded
	 * @returns {Promise} Promise object
	 * @public
	 */
	StructureTreeModel.prototype.loadEntries = function (oComponent) {
		return new Promise(function (fnResolve, fnReject) {
			var aFilters = this._getCurrentlyAppliedFilters();
			var iComponentLevel = oComponent ? parseInt(oComponent.ComponentLevel, 10) : 0;

			// If there's no placeholder, the data is already downloaded
			if (oComponent && (oComponent.items.length >= 1 && !oComponent.items[0].dataDownloadNeeded ||
					oComponent.DrilldownState === Constants.drillDownState.leaf)) {
				fnResolve();

				return;
			}

			// The ComponentLevel and ParentComponentId is only to be applied once not to be maintained
			// Adding Parent Component Id to the request
			aFilters.push(new sap.ui.model.Filter({
				path: "ParentComponentId",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: oComponent ? oComponent.ComponentId : Constants.BOMItemProperties.rootParentComponentId
			}));

			// Define filter
			aFilters.push(new sap.ui.model.Filter({
				path: "ComponentLevel",
				operator: sap.ui.model.FilterOperator.BT,
				value1: iComponentLevel === 0 ? 0 : iComponentLevel + 1,
				value2: iComponentLevel === 0 ? this.EXPAND_LEVEL_COUNT : iComponentLevel + 1 + this.EXPAND_LEVEL_COUNT
			}));

			// Reset the messages belonging to the Structure Panel
			MessageManager.dropStructurePanelMessages();

			// Read
			BOMNodeSetDAO.readBOMNodes(
					StructurePanelModel.getConfigurationContextId(),
					aFilters,
					StructurePanelModel.getIsMultiLevelScenario())
				.then(function (aResults) {
					// Remove placeholder
					if (oComponent && $.isArray(oComponent.items)) {
						oComponent.items = [];
					}

					this._fireInspectObject(StructurePanelModel.getIsBOMInitialLoad(), aResults);

					// Update the binding to the Tree model
					this._bindTreeToModel(aResults, !oComponent);

					fnResolve();
				}.bind(this))
				.catch(function (oError) {
					fnReject(oError);
				});
		}.bind(this));
	};

	/**
	 * Loads the whole BOM tree from the BE
	 * @returns {Promise} Promise object
	 * @public
	 */
	StructureTreeModel.prototype.loadAll = function () {
		return this._genericBOMNodeRead();
	};

	/**
	 * Triggers the Generic read to the BOM node
	 * @returns {Promise} Promise object
	 * @private
	 */
	StructureTreeModel.prototype._genericBOMNodeRead = function () {
		return new Promise(function (fnResolve, fnReject) {
			// Reset the messages belonging to the Structure Panel
			MessageManager.dropStructurePanelMessages();

			BOMNodeSetDAO.readBOMNodes(
					StructurePanelModel.getConfigurationContextId(),
					this._getCurrentlyAppliedFilters(),
					StructurePanelModel.getIsMultiLevelScenario())
				.then(function (aResults) {
					// Update the binding to the Tree model
					// Resets Tree Model
					this._bindTreeToModel(aResults, true);

					fnResolve();
				}.bind(this))
				.catch(function (oError) {
					fnReject(oError);
				});
		}.bind(this));
	};

	/**
	 * Add Configuration Instance's Status binding to update the structure panel when the instance is updated
	 * @private
	 */
	StructureTreeModel.prototype._addConfigurationInstanceBindings = function () {
		// Clearing the extenal binding
		$.each(this._externalBOMBindings, function (iIndex, oBinding) {
			oBinding.detachChange(this._handleBindingEvent, this);
			oBinding.destroy();
		}.bind(this));

		// Recreate
		this._externalBOMBindings = [];

		this._addBindingEvent("/BOMComponents");
	};

	/**
	 * Add binding handling accoring to the internal path given for the local tree model
	 * @param {String} sCallerPath - Caller path
	 * @private
	 */
	StructureTreeModel.prototype._addBindingEvent = function (sCallerPath) {
		// Adding the items as it stores the data
		var sItemsPath = sCallerPath + "/items";

		$.each(this._model.getProperty(sItemsPath), function (iKey, oBOMComponent) {
			// We only handle the configurable items as only they have configuration instance
			if (
				oBOMComponent.to_ConfigurationInstance &&
				oBOMComponent.to_ConfigurationInstance.ContextId &&
				oBOMComponent.to_ConfigurationInstance.InstanceId
			) {
				var oODataModel = ODataModelHelper.getModel();
				var oConfigurationInstanceContext = oODataModel.getContext(
					ODataModelHelper.generateConfigurationInstancePath(oBOMComponent.to_ConfigurationInstance));
				// Creating the internal path
				var sBOMItemPath = sItemsPath + "/" + iKey;
				// Binding the Validation Status property to the Configuration instance context
				var oValidationStatusPropertyBinding = oODataModel.bindProperty(
					"ConfigurationValidationStatus", oConfigurationInstanceContext);

				// Extending the bom binding with the property so later we can discard it
				this._externalBOMBindings.push(oValidationStatusPropertyBinding);
				// Attaching a handle even for when the property is changed
				oValidationStatusPropertyBinding.attachChange(this._handleBindingEvent.bind(this, sBOMItemPath), this);

				// Attach the binding handling to the sub children nodes of a Configurable item
				if ($.isArray(oBOMComponent.items) && oBOMComponent.items.length > 0) {
					this._addBindingEvent(sBOMItemPath);
				}
			}
		}.bind(this));
	};

	/**
	 * Handles when a Configuration instance is changed
	 * @param {String} sBOMItemPath - Caller BOM item path in the local model
	 * @param {Object} oEvent - UI5 event object
	 * @private
	 */
	StructureTreeModel.prototype._handleBindingEvent = function (sBOMItemPath, oEvent) {
		var oContext = oEvent.getSource().getContext();

		if (oContext && $.type(sBOMItemPath) === "string" &&
			this._model && this._model.getProperty(sBOMItemPath)) {
			this._model.setProperty(
				sBOMItemPath + "/to_ConfigurationInstance/ConfigurationValidationStatus",
				oContext.getProperty("ConfigurationValidationStatus"));
			this._model.setProperty(
				sBOMItemPath + "/to_ConfigurationInstance/ConfigurationValidationStatusDescription",
				oContext.getProperty("ConfigurationValidationStatusDescription"));
		}
	};

	/**
	 * Get currently applied filters
	 * @returns {sap.ui.model.Filter[]} Filters to be applied to the request
	 * @private
	 */
	StructureTreeModel.prototype._getCurrentlyAppliedFilters = function () {
		var aFilters = $.extend([], StructurePanelModel.getFiltersForCurrentlySelectedBOMview());

		if ($.isArray(this._extendedFilters) && this._extendedFilters.length > 0) {
			aFilters = aFilters.concat(this._extendedFilters);
		}

		return aFilters;
	};

	/**
	 * Adds filters to the Structure Tree model
	 * @param {sap.ui.model.Filter[]} aFilters - Filters to be added
	 * @public
	 */
	StructureTreeModel.prototype.addFilters = function (aFilters) {
		if ($.isArray(aFilters) && aFilters.length > 0) {
			this._extendedFilters = this._extendedFilters.concat(aFilters);
			StructurePanelModel.setProductColumnFiltered(true);
		}
	};

	/**
	 * Clear extended filters of the Structure Tree model
	 * @public
	 */
	StructureTreeModel.prototype.clearExtendedFilters = function () {
		this._extendedFilters = [];
		this._productFilterText = "";
		StructurePanelModel.setProductColumnFiltered(false);
	};

	/**
	 * Checks if the passed is the downloading node
	 * @param {Object} oBOMitem - Item to be checked
	 * @returns {Boolean} Whether the node is the downloading node
	 * @public
	 */
	StructureTreeModel.prototype.isDownloadingNode = function (oBOMitem) {
		return oBOMitem.Quantity === "" &&
			oBOMitem.Unit === "" &&
			oBOMitem.BOMComponentName === i18n.getText("vchclf_structpnl_tree_download_placeholder") &&
			oBOMitem.dataDownloadNeeded === true &&
			oBOMitem.ObjectDependencyAssgmtNumber === Constants.intialObjectDependencyAssgmtNumber &&
			oBOMitem.HasRouting === false;
	};

	/**
	 * resets BOM flags
	 * @private
	 */
	StructureTreeModel.prototype._resetBOMFlags = function () {
		StructurePanelModel.setIsBOMInitialLoad(false);
		StructurePanelModel.setForceBOMExplosion(false);

		this._model.setProperty("/isReexplodable", false);
	};

	/**
	 * Export singleton instance of StructureTreeModel
	 * This exist only once. This is main difference to the RoutingTreeModel.
	 */
	return new StructureTreeModel();
});
