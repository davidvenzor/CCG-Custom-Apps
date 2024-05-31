/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/common/type/DescriptionMode",
	"sap/i2d/lo/lib/zvchclfz/common/type/InspectorMode",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/config/BOMColumnConfig",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/dao/BOMNodeSetDAO",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/dialog/SelectRouting",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/formatter/StructureTreeFormatter",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/EventProvider",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/StructurePanelModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/model/StructureTreeModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/i18n",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/ODataModelHelper",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/RoutingUtil",
	"sap/m/MessageBox",
	"sap/ui/core/mvc/Controller",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/StructureTreeETOHandler",
	"sap/i2d/lo/lib/zvchclfz/common/factory/FactoryBase"
	// eslint-disable-next-line max-params
], function (DescriptionMode, InspectorMode, BOMColumnConfig, BOMNodeSetDAO, SelectRouting, Formatters, Constants,
	EventProvider, StructurePanelModel, StructureTreeModel, i18n, ODataModelHelper, RoutingUtil,
	MessageBox, Controller, StructureTreeETOHandler, FactoryBase) {
	"use strict";
	
	/**
	 * Structure Tree view's controller
	 * @class
	 * @extends sap.ui.core.mvc.Controller
	 * @public
	 */
	return Controller.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.controller.StructureTree", {
		/**
		 * Mix-in the ETO specific functionality into StructureTree controller
		 *
		 * @public
		 * @constructor
		 */
		constructor: function () {
			Controller.prototype.constructor.apply(this, arguments);
			jQuery.extend(this, StructureTreeETOHandler);
		},

		/**
		 * Formatters for the view
		 * @type {sap.i2d.lo.lib.zvchclfz.components.structurepanel.formatter.StructureTreeFormatter}
		 * @private
		 */
		_formatters: Formatters,

		/**
		 * Initializer; attaches tree model and subscribe to events and opens the tree to level 2
		 * @public
		 */
		onInit: function () {
			var oStructureTree = this.getView().byId("idStructureTree");

			this.getView().setModel(StructureTreeModel.getModel(), "tree");

			EventProvider.attachContextChanged(this.onContextChanged, this);
			EventProvider.attachRefreshStructureTree(this.onRefreshStructureTree, this);
			EventProvider.attachExpandAllNodesInStructureTree(this.onExpandAllNodes, this);
			EventProvider.attachCollapseAllNodesInStructureTree(this.onCollapseAllNodes, this);
			EventProvider.attachBOMViewSelectionChanged(this._rebindStructureAfterBOMViewChange, this);
			EventProvider.attachResetStructurePanel(this.resetStructure, this);
			EventProvider.attachDescriptionModeChanged(this.onDescriptionModeChanged, this);
			EventProvider.attachUpdateStructureTreeColumnBinding(this.onUpdateStructureTreeColumnBinding, this);

			this._oFactoryBase = new FactoryBase({
				controller: this
			});
			this.attachETOEvents();

			oStructureTree.expandToLevel("1");
			oStructureTree.attachFilter(function (oEvent) {
				oEvent.preventDefault();
			});
		},

		/**
		 * Destructor - called by UI5
		 * @public
		 */
		onExit: function () {
			EventProvider.detachContextChanged(this.onContextChanged, this);
			EventProvider.detachRefreshStructureTree(this.onRefreshStructureTree, this);
			EventProvider.detachExpandAllNodesInStructureTree(this.onExpandAllNodes, this);
			EventProvider.detachCollapseAllNodesInStructureTree(this.onCollapseAllNodes, this);
			EventProvider.detachBOMViewSelectionChanged(this._rebindStructureAfterBOMViewChange, this);
			EventProvider.detachResetStructurePanel(this.resetStructure, this);
			EventProvider.detachDescriptionModeChanged(this.onDescriptionModeChanged, this);
			EventProvider.detachUpdateStructureTreeColumnBinding(this.onUpdateStructureTreeColumnBinding, this);

			this.detachETOEvents();
		},

		/**
		 * Handles the rowSelectionChange event of TreeTable control
		 * @param {Object} oEvent - UI5 event object
		 * @private
		 */
		onRowSelectionChange: function (oEvent) {
			var oTreeTable = oEvent.getSource();

			// TODO: workaround until the row selection related backlog is not solved by UI5
			// if a row has been deselected, select it again
			if (oTreeTable.getSelectedIndices().length === 0) { // deselection happened
				oTreeTable.setSelectedIndex(oEvent.getParameter("rowIndex"));
			} else {
				StructurePanelModel.setCurrentlyFocusedBOMItem(oEvent.getParameter("rowContext").getObject());
			}
		},

		/**
		 * Handles the columnMove event of TreeTable control
		 * @param {Object} oEvent - UI5 event object
		 * @private
		 */
		onColumnMove: function (oEvent) {
			EventProvider.fireStructureTreeColumnMoved({
				oldPos: oEvent.getParameter("column").getIndex(),
				newPos: oEvent.getParameter("newPos")
			});
		},

		/**
		 * Handles the columnFreeze event of TreeTable control
		 * @param {Object} oEvent - UI5 event object
		 * @private
		 */
		onColumnFreeze: function (oEvent) {
			var oTreeTable = oEvent.getSource();

			// At the moment of the columnFreeze event the fixedColumnCount property is not updated
			// Only the column passed as a parameter, but we cannot figure out whether freeze or unfreeze happened
			// => we need to use the setTimeout with 0 ms to wait for the updated fixedColumnCount property
			setTimeout(function () {
				EventProvider.fireStructureTreeColumnFrozen({
					fixedColumnCount: oTreeTable.getFixedColumnCount()
				});
			}, 0);
		},

		/**
		 * Handles the columnResize event of TreeTable control
		 * @param {Object} oEvent - UI5 event object
		 * @private
		 */
		onColumnResize: function (oEvent) {
			EventProvider.fireStructureTreeColumnResized({
				columnKey: oEvent.getParameter("column").getId(),
				width: oEvent.getParameter("width")
			});
		},

		/**
		 * Refresh the BOM with explosion
		 * @returns {Promise} - Promise object
		 * @public
		 */
		refreshAndExplodeBOMAsync: function () {
			return new Promise(function (fnResolve, fnReject) {
				this._onBOMExplosion();
				StructureTreeModel.explodeBOMWithoutUpdatingTheModel()
					.then(function (bRefreshModel) {
						if (bRefreshModel) {
							StructureTreeModel._refreshModelFromCache();

							fnResolve(bRefreshModel);
						} else {
							fnResolve(bRefreshModel);
						}
					})
					.catch(fnReject);
			}.bind(this));
		},

		/**
		 * Handles the event of the structure panel is reset - the context change should be called after reset
		 * @private
		 */
		resetStructure: function () {
			StructureTreeModel.resetModel();
			this._resetTreeTableColumns();
			StructurePanelModel.setCurrentlyFocusedBOMItem();
			StructurePanelModel.resetToBOMBaseView();
		},

		/**
		 * Clears all the filters and sorters from the TreeTable columns
		 * @private
		 */
		_resetTreeTableColumns: function () {
			//clearing all the filters and sorters from the TreeTable columns
			var oTreeTable = this.byId("idStructureTree");
			var oBinding = oTreeTable.getBinding();

			//TODO: is it needed? cannot be done via binding?
			$.each(oTreeTable.getColumns(), function (i, oColumn) {
				oColumn.setFiltered(false);
				oColumn.setFilterValue();
				oColumn.setSorted(false);
				oColumn.setSortOrder();
			});

			// They are manually clear because currently no such function in TreeTable
			oBinding.aAllFilters = null;
			oBinding.aSorters = null;
			oBinding.aFilters = null;

			StructureTreeModel.clearExtendedFilters();
		},

		/**
		 * Rebinds the whole tree according to the state of the ui model
		 * @param {Object} oEvent - UI5 event object
		 * @private
		 */
		_rebindStructure: function (oEvent) {
			// Setup UI
			this._resetTreeTableColumns();

			this._explodeBOM();

			if (!StructurePanelModel.getIsMultiLevelScenario()) {
				this.onCollapseAllNodes();
			}
		},

		/**
		 * Rebinds the whole tree after BOM view is changed
		 * @private
		 */
		_rebindStructureAfterBOMViewChange: function () {
			// setup ui
			this._resetTreeTableColumns();

			//in the Configurable View focused on instance selected in Valuation
			if (StructurePanelModel.isConfigurableItemViewSelected()) {
				this._selectRow(StructurePanelModel.getCurrentlyLoadedBOMItemInValuation());
			}

			this._loadAllEntriesForStructureTree()
				.then(this.onCollapseAllNodes.bind(this));
		},

		/** Event handler for the node collapse / expand event in the tree
		 * @param {object} oEvent - UI5 event object
		 * @private
		 */
		onBOMComponentNodeToggled: function (oEvent) {
			if (oEvent.getParameter("expanded")) {
				var oComponent = oEvent.getParameter("rowContext").getObject();

				this._loadAllEntriesForStructureTree(oComponent);
			}
		},

		/**
		 * Handles the event of the refresh BOM structure
		 * @param {object} oEvent - UI5 event object
		 * @private
		 */
		onRefreshStructureTree: function (oEvent) {
			//For the edit scenario, the BOM might be edited in a different session
			//So the BOM explosion is enforced for that scenario
			if (StructurePanelModel.isBOMChangeAllowed()) {
				StructurePanelModel.setForceBOMExplosion(true);
			}

			this._rebindStructure();
		},
		/**
		 * Handles the event of the context change
		 * @param {object} oEvent - UI5 event object
		 * @private
		 */
		onContextChanged: function (oEvent) {
			StructurePanelModel.resetToBOMBaseView();

			BOMNodeSetDAO.resetExplosionPossibleIndicator();

			this._rebindStructure();
		},

		/**
		 * Handles the collapse all event of the tree
		 * @private
		 */
		onCollapseAllNodes: function () {
			var oTreeTable = this.byId("idStructureTree");

			if (oTreeTable.isExpanded(0)) {
				oTreeTable.collapseAll();
				oTreeTable.expandToLevel("1");
			}
		},

		/**
		 * Handles the expand all event of the tree
		 * @private
		 */
		onExpandAllNodes: function () {
			this._loadAllForStructureTree();
		},

		/**
		 * Handles the DescriptionModeChanged event
		 * @private
		 */
		onDescriptionModeChanged: function () {
			var sProductFilterText = StructureTreeModel.getProductFilterText();

			if (sProductFilterText) {
				this._updateFilters(Constants.filterProperty.product, sProductFilterText);
			}
		},

		/**
		 * Handles the filter change event
		 * @param {Object} oEvent - UI5 event object
		 * @private
		 */
		onFilteringTriggered: function (oEvent) {
			var sFilterProperty = oEvent.getParameter("column").getFilterProperty();
			var sValue = oEvent.getParameter("value");

			// The filter value has to be stored because of the dynamic columns
			if (sFilterProperty === Constants.filterProperty.product) {
				StructurePanelModel.setProductColumnFilterValue(sValue);
			}

			this._updateFilters(sFilterProperty, sValue);
		},

		/**
		 * Handles the dependency icon's click event
		 * @param {Object} oEvent - UI5 event object
		 * @private
		 */
		onDependencyPressed: function (oEvent) {
			var oBoundObject = oEvent.getSource().getBindingContext("tree").getObject();

			this._handleDependencyColumnPress(oBoundObject);
		},

		/**
		 * Handles the reference char icon's click event
		 * @param {Object} oEvent - UI5 event object
		 * @private
		 */
		onReferenceCharacteristicPressed: function (oEvent) {
			var oBoundObject = oEvent.getSource().getBindingContext("tree").getObject();

			this._handleReferenceCharacteristicColumnPress(oBoundObject);
		},

		/**
		 * Handles the routing icon's click event
		 * @param {Object} oEvent - UI5 event object
		 * @private
		 */
		onRoutingPressed: function (oEvent) {
			var oBoundObject = oEvent.getSource().getBindingContext("tree").getObject();

			this._handleRoutingColumnPress(oBoundObject);
		},

		/**
		 * Handles the updateStructureTreeColumnBinding event
		 * update the tree column binding based on the selected columns
		 * @private
		 */
		onUpdateStructureTreeColumnBinding: function () {
			this.getView()
				.byId("idStructureTree")
				.bindColumns("ui>/selectedColumns", function (sId, oContext) {
					var oColumn = BOMColumnConfig.getColumn(oContext.getObject().columnKey, this);

					oColumn.bindProperty("width", "ui>width");

					return oColumn;
				}.bind(this));
		},

		/**
		 * Handles the reference characteristic column press
		 * @param {Object} oBoundObject - Object refers to the tree click
		 * @private
		 */
		_handleReferenceCharacteristicColumnPress: function (oBoundObject) {
			var oExtendedConfigurationInstance = this._getConfigurationInstanceForBOMItem(oBoundObject) || {};

			this.getOwnerComponent().fireReferenceCharacteristicSelected({
				path: ODataModelHelper.generateConfigurationInstancePath(oExtendedConfigurationInstance) || "",
				oConfigurationInstance: oExtendedConfigurationInstance
			});
		},

		/**
		 * Handles the product column press
		 * @param {Object} oBoundObject - Object refers to the tree click
		 * @private
		 */
		_handleProductColumnPress: function (oBoundObject) {
			this._inspectBOMComponent(oBoundObject);

			if (oBoundObject.IsConfigurableItem &&
				StructurePanelModel.getIsMultiLevelScenario() &&
				oBoundObject.ComponentId !== StructurePanelModel.getCurrentlyLoadedBOMItemInValuation().ComponentId) {
				//Only for Configurable Items trigger the BOM update
				//Excluded Items will trigger BOM update as the Tree might have change during valuation
				if (this._isBOMExplodable()) {
					this.getOwnerComponent().fireConfigurableItemSelectionChanged();
					this._asyncUpdateBOMAndFocusInstance(oBoundObject);
				} else {
					this._selectInstanceInValuation(oBoundObject);
				}
			}
		},

		/**
		 * Triggers the BOM explosion and updates the Model async
		 * and focuses the instance in the valuation
		 * @param {Object} oFocusedInstance - Configurable Item which should be loaded in valuation
		 * @private
		 */
		_asyncUpdateBOMAndFocusInstance: function (oFocusedInstance) {
			if (this._isBOMExplodable()) {
				StructurePanelModel.setStructurePanelLoading(true);

				this.refreshAndExplodeBOMAsync()
					.then(function (bModelRefreshed) {
						// If the model is refreshed then we get the oInitiallySelectedBOMItem from the model to
						// ensure that the properties are updated
						var oInitiallyFocusedInstance = oFocusedInstance ||
							StructurePanelModel.getCurrentlyLoadedBOMItemInValuation();
						var oCurrentlyFocusedInstance = bModelRefreshed ?
							StructureTreeModel.getBOMComponent(oInitiallyFocusedInstance) :
							oInitiallyFocusedInstance;

						if (!oCurrentlyFocusedInstance ||
							!this._isConfigurableItem(oCurrentlyFocusedInstance) ||
							this._isConfigurableAndExcludedItem(oCurrentlyFocusedInstance) ||
							!this._isItemValidForValuation(oCurrentlyFocusedInstance)) {

							// Warning Messages
							if (oInitiallyFocusedInstance) {
								this._showWarningMessageForInvalidItemForValuation(
									oCurrentlyFocusedInstance, oInitiallyFocusedInstance);
							}

							oCurrentlyFocusedInstance = StructureTreeModel.getRootComponent();
						}

						// When the model is refreshed ensure that all downloading nodes are collapsed
						if (bModelRefreshed) {
							this._collapseAllDownloadingNodes();
						}

						this._selectInstanceInValuation(oCurrentlyFocusedInstance);

						//TODO: when should we update the selected row?
						//=> opt1: only when the initially focused BOM item is removed from the BOM
						//   (what should be selected in that case? the currently loaded item in the valuation?)
						//=> opt2: after an explosion always set to the currently loaded item in the valuation
						this._selectRow(oCurrentlyFocusedInstance);

						this._onAfterBOMExplosion();
						StructurePanelModel.setStructurePanelLoading(false);

						EventProvider.fireStructureTreeRefreshed();
					}.bind(this))
					.catch(this._bomExplosionRequestErrorHandling.bind(this));
			}
		},

		/**
		 * Raise Warning message that item not valid for valuation
		 * @param {Object} oBOMItem - BOM item
		 * @param {Object} oBOMItemFromPreviousTree - BOM item
		 * @private
		 */
		_showWarningMessageForInvalidItemForValuation: function (oBOMItem, oBOMItemFromPreviousTree) {
			if (!oBOMItem && oBOMItemFromPreviousTree) {
				this._showWarningMessage(
					i18n.getText("vchclf_structpnl_config_item_not_available_title"),
					i18n.getTextWithParameters(
						"vchclf_structpnl_config_item_not_available_info", [oBOMItemFromPreviousTree.BOMComponentName])
				);

			} else if (this._isConfigurableAndExcludedItem(oBOMItem)) {
				if (!this._isConfigurableAndExcludedItem(oBOMItemFromPreviousTree)) {
					this._showWarningMessage(
						i18n.getText("vchclf_structpnl_config_item_excluded_title"),
						i18n.getTextWithParameters(
							"vchclf_structpnl_config_item_excluded_info", [oBOMItem.BOMComponentName])
					);
				}

			} else if (this._isConfigurableItem(oBOMItem) && !this._isItemValidForValuation(oBOMItem)) {
				this._showWarningMessage(
					i18n.getText("vchclf_structpnl_config_item_not_validated_title"),
					i18n.getTextWithParameters(
						"vchclf_structpnl_config_item_not_validated_info", [oBOMItem.BOMComponentName])
				);
			}
		},

		/**
		 * Raise Warning message
		 * @param {String} sTitle - message title
		 * @param {String} sInformation - message information
		 * @private
		 */
		_showWarningMessage: function (sTitle, sInformation) {
			sap.m.MessageBox
				.show(sInformation, {
					icon: sap.m.MessageBox.Icon.WARNING,
					title: sTitle
				});
		},

		/**
		 * To be triggered after BOM explosion
		 * @private
		 */
		_onAfterBOMExplosion: function () {
			if (this.getOwnerComponent()) {
				this.getOwnerComponent()
					.fireBOMExplosionFinished();
			}
		},

		/**
		 * Called BOM explosion is triggered
		 * @private
		 */
		_onBOMExplosion: function () {
			if (this.getOwnerComponent()) {
				this.getOwnerComponent()
					.fireBOMExplosionTriggered({
						isMultiLevel: StructurePanelModel.getIsMultiLevelScenario()
					});
			}
		},

		/**
		 * Checks whether an item is configurable
		 * @param {Object} oBOMItem - BOM item
		 * @returns {Boolean} - indicator
		 * @private
		 */
		_isConfigurableItem: function (oBOMItem) {
			return oBOMItem.IsConfigurableItem;
		},

		/**
		 * Checks whether an item is configurable and excluded
		 * @param {Object} oBOMItem - BOM item
		 * @returns {Boolean} - indicator
		 * @private
		 */
		_isConfigurableAndExcludedItem: function (oBOMItem) {
			return oBOMItem.IsConfigurableItem && oBOMItem.IsExcludedItem;
		},

		/**
		 * Checks whether an item is valid for valuation
		 * @param {Object} oBOMItem - BOM item
		 * @returns {Boolean} - indicator
		 * @private
		 */
		_isItemValidForValuation: function (oBOMItem) {
			var oConfigurationInstance = this._getConfigurationInstanceForBOMItem(oBOMItem);

			if (oConfigurationInstance &&
				oConfigurationInstance.ConfigurationValidationStatus) {
				switch (oConfigurationInstance.ConfigurationValidationStatus) {
					case Constants.configurationInstance.validationStatus.ValidatedAndReleased:
					case Constants.configurationInstance.validationStatus.ValidatedAndIncomplete:
					case Constants.configurationInstance.validationStatus.InconsistencyDetected:
					case Constants.configurationInstance.validationStatus.ProcessedButUnknown:
						return true;
					case Constants.configurationInstance.validationStatus.NotValidate:
						return false;
					default:
						return false;
				}
			} else {
				return false;
			}
		},

		/**
		 * Checks whether an item is valid for valuation
		 * @param {Object} oBOMItem - BOM item
		 * @returns {Object} - Configuration Instance
		 * @private
		 */
		_getConfigurationInstanceForBOMItem: function (oBOMItem) {
			if (oBOMItem &&
				oBOMItem[Constants.navigationProperty.ConfigurationInstance.name]) {
				return oBOMItem[Constants.navigationProperty.ConfigurationInstance.name];
			} else {
				return null;
			}
		},

		/**
		 * Updates the valuation component with the configuration instance of the selected BOM item
		 * @param {Object} oCurrentlyFocusedBOMItem - the selected BOM item
		 * @private
		 */
		_selectInstanceInValuation: function (oCurrentlyFocusedBOMItem) {
			var oConfigurationInstance = this._getConfigurationInstanceForBOMItem(oCurrentlyFocusedBOMItem);
			var oOwnerComponent = this.getOwnerComponent();

			if (oConfigurationInstance && oOwnerComponent) {
				oOwnerComponent.fireConfigurableItemSelected({
					path: ODataModelHelper.generateConfigurationInstancePath(oConfigurationInstance),
					oConfigurationInstance: oConfigurationInstance
				});

				StructurePanelModel.setCurrentlyLoadedBOMItemInValuation(oCurrentlyFocusedBOMItem);
			}
		},

		/**
		 * Select the currently focused BOM item
		 * @private
		 */
		_selectFocusedBOMItem: function () {
			if (StructurePanelModel.getCurrentlyFocusedBOMItem()) {
				this._selectRow(StructurePanelModel.getCurrentlyFocusedBOMItem());
			}
		},

		/**
		 * Select Row in Tree Table
		 * @param {Int|Object} oRowBoundObject - Row index or Row bound object
		 * @private
		 */
		_selectRow: function (oRowBoundObject) {
			// The possible binding update should be finished before the selection change
			setTimeout(function () {
				var oTreeTable = this.getView().byId("idStructureTree");

				if (oTreeTable) {
					//Selecting the Root item in the Tree
					oTreeTable.clearSelection();

					if ($.isNumeric(oRowBoundObject)) {
						oTreeTable.setSelectedIndex(oRowBoundObject);
					} else if (!$.isEmptyObject(oRowBoundObject)) {
						//get the selected row context and reselect due to tree change
						$.each(oTreeTable.getRows(), function (iIndex, oRow) {
							var oRowObject = oRow.getBindingContext("tree") && oRow.getBindingContext("tree").getObject();

							if (
								oRowObject &&
								oRowObject.ComponentId === oRowBoundObject.ComponentId
							) {
								oTreeTable.setSelectedIndex(oRow.getIndex());

								//exit from the loop
								return false;
							}

							//for the loop to continue
							return true;
						});
					}
				}
			}.bind(this), 0);
		},

		/**
		 * Handles the routing column press
		 * @param {Object} oBOMNode - the selected BOMNode
		 * @private
		 */
		_handleRoutingColumnPress: function (oBOMNode) {
			var sBOMNodePath = ODataModelHelper.generateBOMNodePath(
				StructurePanelModel.getConfigurationContextId(), oBOMNode.ComponentId);

			StructurePanelModel.resetAvailableRoutings();

			if (oBOMNode.NumberOfRoutings === 1) {
				this._getRoutingKey(sBOMNodePath);
				RoutingUtil.explodeRouting(sBOMNodePath, oBOMNode, {});
			} else {
				SelectRouting.open(sBOMNodePath)
					.then(function (oRoutingKey) {
						if (oRoutingKey) {
							var sRoutingPath = ODataModelHelper.extendTheBOMNodePathWithRoutingKey(
								sBOMNodePath, oRoutingKey);

							StructurePanelModel.setSelectedRouting(
								oRoutingKey.BillOfOperationsGroup, oRoutingKey.BillOfOperationsVariant);
							RoutingUtil.explodeRouting(sRoutingPath, oBOMNode, oRoutingKey);
						}
					})
					.catch(function () {
						MessageBox.error(i18n.getText("vchclf_structpnl_expl_routing_error"));
					});
			}
		},

		/**
		 * Get routing key when the model has only one routing
		 * @param {String} sBOMNodePath - path of the selected BOM component
		 * @private
		 */
		_getRoutingKey: function (sBOMNodePath) {
			BOMNodeSetDAO.getRoutings(sBOMNodePath)
				.then(function (aResults) {
					StructurePanelModel.setRoutings(aResults);
				});
		},

		/**
		 * Handles the dependency column press
		 * @param {object} oBoundObject - Object refers to the tree click
		 * @private
		 */
		_handleDependencyColumnPress: function (oBoundObject) {
			this.getOwnerComponent().fireInspectObject({
				objectPath: ODataModelHelper.generateBOMNodePath(
					StructurePanelModel.getConfigurationContextId(), oBoundObject.ComponentId),
				objectType: InspectorMode.objectType.BOMComponent,
				inspectorTab: InspectorMode.inspectorTab.dependencies
			});
		},

		/**
		 * Handles the rows' cell's click event
		 * @param {Object} oEvent - UI5 event object
		 * @private
		 */
		onCellClicked: function (oEvent) {
			var oRowBindingContext = oEvent.getParameter("rowBindingContext");

			if (oRowBindingContext) {
				var oBoundObject = oRowBindingContext.getObject();

				// Downloading node should not have any triggers
				if (!StructureTreeModel.isDownloadingNode(oBoundObject)) {
					if (oEvent.getParameter("columnId").indexOf(Constants.treeTable.columns.id.product) >= 0) {
						this._handleProductColumnPress(oBoundObject);
					}
				}
			}
		},

		/**
		 * Loads all entries for the Structure tree
		 * @param {Object} oComponent - BOM Component data which needs to be expanded
		 * @return {Object} Promise object which returns the data
		 * @private
		 */
		_loadAllEntriesForStructureTree: function (oComponent) {
			StructurePanelModel.setStructurePanelLoading(true);

			return StructureTreeModel.loadEntries(oComponent)
				.then(function () {
					StructurePanelModel.setStructurePanelLoading(false);
					this._selectFocusedBOMItem();

					this._collapseAllDownloadingNodes();
				}.bind(this))
				.catch(this._requestGenericErrorHandling.bind(this));
		},

		/**
		 * Trigger the BOM explosion
		 * @protected
		 */
		_explodeBOM: function () {
			if (this._isBOMExplodable()) {
				if (StructurePanelModel.getIsMultiLevelScenario()) {
					//In multi-level we update the Tree and select the Focused Configurable item
					this._asyncUpdateBOMAndFocusInstance();
				} else {
					StructurePanelModel.setStructurePanelLoading(true);

					this._onBOMExplosion();
					StructureTreeModel.explodeBOM()
						.then(function () {
							StructurePanelModel.setStructurePanelLoading(false);

							this._onAfterBOMExplosion();

							this._collapseAllDownloadingNodes();

							StructurePanelModel.setCurrentlyLoadedBOMItemInValuation(StructureTreeModel.getRootComponent());

							this._selectRow(0);

							EventProvider.fireStructureTreeRefreshed();
						}.bind(this))
						.catch(this._bomExplosionRequestErrorHandling.bind(this));
				}
			} else {
				// Only Retrieve the data explosion should not be triggered
				this._loadAllEntriesForStructureTree()
					.then(function () {
						StructurePanelModel.setCurrentlyLoadedBOMItemInValuation(StructureTreeModel.getRootComponent());

						this._selectRow(0);

						EventProvider.fireStructureTreeRefreshed();
					}.bind(this));
			}

		},

		/**
		 * Loads all for the Structure tree
		 * @private
		 */
		_loadAllForStructureTree: function () {
			StructurePanelModel.setStructurePanelLoading(true);

			StructureTreeModel.loadAll()
				.then(function () {
					this.byId("idStructureTree").expandToLevel(StructureTreeModel.getModel().getProperty("/treeDepth"));
					StructurePanelModel.setStructurePanelLoading(false);
					this._selectFocusedBOMItem();

					this._collapseAllDownloadingNodes();
				}.bind(this))
				.catch(this._requestGenericErrorHandling.bind(this));
		},

		/**
		 * Handles the error message coming from the service
		 * @param {Object} oError -  Error Object
		 * @private
		 */
		_requestGenericErrorHandling: function (oError) {
			if (oError && oError.message) {
				MessageBox.error(oError.message);
			}

			StructurePanelModel.setStructurePanelLoading(false);
		},

		/**
		 * Handles the error message coming from bom explosion
		 * @param {Object} oError -  Error Object
		 * @private
		 */
		_bomExplosionRequestErrorHandling: function (oError) {
			if (oError && oError.explosionPossible === Constants.BOMExplosionNotAssigned) {
				this.getOwnerComponent()
					.fireNavigationToBOMCanNotBeFound();
				StructurePanelModel.setStructurePanelLoading(false);
			} else {
				this._requestGenericErrorHandling(oError);
			}
		},

		/**
		 * Collapse All downloading nodes
		 * @returns {Promise} Promise object
		 * @private
		 */
		_collapseAllDownloadingNodes: function () {
			return new Promise(function (resolve) {
				var oTreeTable = this.getView().byId("idStructureTree");

				if (oTreeTable) {
					var aDownloadingNodesParentIndex = [],
						aTreeRows = oTreeTable.getRows(),
						oTreeRowBOMItemIndexLookup = {};

					$.each(aTreeRows, function (iIndex, oRow) {
						var oRowBindingContext = oRow.getBindingContext("tree") &&
							oRow.getBindingContext("tree").getObject();

						if (oRowBindingContext) {
							oTreeRowBOMItemIndexLookup[oRowBindingContext.ComponentId] = oRow.getIndex();

							if (StructureTreeModel.isDownloadingNode(oRowBindingContext)) {
								var iParentNodeIndex = oTreeRowBOMItemIndexLookup[
									oRowBindingContext.parentComponent.ComponentId];

								aDownloadingNodesParentIndex.push(iParentNodeIndex);
							}
						}
					});

					if (aDownloadingNodesParentIndex.length > 0) {
						oTreeTable.collapse(aDownloadingNodesParentIndex);
					}
				}

				resolve();
			}.bind(this));
		},

		/**
		 * Update the filters of the Structure Tree
		 * @param {String} sProperty - Property of the filter
		 * @param {String} sValue - Value of the filter
		 * @private
		 */
		_updateFilters: function (sProperty, sValue) {
			//Clearing of the filter is needed a currently we only support Product filtering of one value at a time
			StructureTreeModel.clearExtendedFilters();

			if (sProperty === Constants.filterProperty.product) {
				StructureTreeModel.setProductFilterText(sValue);
			}

			if (sProperty && sValue) {
				var aFilters;

				switch (sProperty) {
					case Constants.filterProperty.product:
						aFilters = this._getProductFilter(sValue);
						break;
					default:
						aFilters = [
							new sap.ui.model.Filter({
								path: sProperty,
								operator: sap.ui.model.FilterOperator.Contains,
								value1: sValue
							})
						];
						break;
				}

				StructureTreeModel.addFilters(aFilters);
				this._loadAllForStructureTree();
			} else {
				this._loadAllEntriesForStructureTree()
					.then(this.onCollapseAllNodes.bind(this));
			}
		},

		/**
		 * Returns the filter for the Product
		 * @param {String} sValue - Value of the filter
		 * @returns {sap.ui.model.Filter[]} Array of filters
		 */
		_getProductFilter: function (sValue) {
			switch (StructurePanelModel.getDescriptionMode()) {
				case DescriptionMode.Description:
					return [
						new sap.ui.model.Filter({
							path: "ProductName",
							operator: sap.ui.model.FilterOperator.Contains,
							value1: sValue
						})
					];
				case DescriptionMode.TechnicalName:
					return [
						new sap.ui.model.Filter({
							path: "BOMComponentName",
							operator: sap.ui.model.FilterOperator.Contains,
							value1: sValue
						})
					];
				case DescriptionMode.Both:
					return [
						new sap.ui.model.Filter({
							path: "ProductName",
							operator: sap.ui.model.FilterOperator.Contains,
							value1: sValue
						}),
						new sap.ui.model.Filter({
							path: "BOMComponentName",
							operator: sap.ui.model.FilterOperator.Contains,
							value1: sValue
						})
					];
				default:
					return [];
			}
		},

		/**
		 * Returns whether the BOM is explodable
		 * @returns {boolean} - indicator whether the bom is explodable
		 */
		_isBOMExplodable: function () {
			return StructurePanelModel.isStructurePanelEditable();
		},

		/**
		 * valuate and focus on root component
		 * @protected
		 */
		_valuateAndFocusOnRootComponent: function () {
			this._selectInstanceInValuation(
				StructureTreeModel.getRootComponent());

			StructurePanelModel.setCurrentlyFocusedBOMItem(
				StructureTreeModel.getRootComponent());
			// Select the Root Row
			this._selectRow(0);
		},

		/**
		 * Inspect BOM component
		 * @param {Object} oBOMComponent - BOM Component
		 * @private
		 */
		_inspectBOMComponent: function (oBOMComponent) {
			this.getOwnerComponent().fireInspectObject({
				objectPath: ODataModelHelper.generateBOMNodePath(
					StructurePanelModel.getConfigurationContextId(),
					oBOMComponent.ComponentId),
				objectType: InspectorMode.objectType.BOMComponent
			});
		}
	});
});
