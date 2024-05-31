/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/config/BOMColumnConfig",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/EventProvider",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/NavigationManager",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/StructurePanelModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/model/StructureTreeModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/i18n",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/StructureFrameETOHandler",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/TablePersonalization"
	// eslint-disable-next-line max-params
], function (Controller, BOMColumnConfig, EventProvider, NavigationManager, StructurePanelModel, StructureTreeModel, i18n,
	StructureFrameETOHandler, TablePersonalization) {
	"use strict";

	return Controller.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.controller.StructureFrame", {

		/**
		 * Popover instance for changing BOM view
		 * @private
		 * @type {sap.m.Popover}
		 */
		_BOMViewSelectionPopover: null,

		/**
		 * Instance of Table Personalization utility class
		 * @private
		 * @type {sap.i2d.lo.lib.zvchclfz.components.structurepanel.util.TablePersonalization}
		 */
		_tablePersonalization: null,

		/**
		 * Mix-in the ETO specific functionality into StructureFrame controller
		 *
		 * @public
		 * @constructor
		 */
		constructor: function () {
			Controller.prototype.constructor.apply(this, arguments);
			jQuery.extend(this, StructureFrameETOHandler);
		},

		/**
		 * Called by UI5 runtime. Handles model assignment.
		 * @private
		 */
		onInit: function () {
			this.getView().setModel(StructurePanelModel.getModel(), "ui");
			EventProvider.attachResetStructurePanel(NavigationManager.resetFrame, NavigationManager);
			EventProvider.attachStructureTreeColumnMoved(this.onStructureTreeColumnMoved, this);
			EventProvider.attachStructureTreeColumnFrozen(this.onStructureTreeColumnFrozen, this);
			EventProvider.attachStructureTreeColumnResized(this.onStructureTreeColumnResized, this);
			EventProvider.attachContextChanged(this.onContextChanged, this);
			EventProvider.attachRedetermineStructureTreeColumnLayout(this.onRedetermineTreeColumnLayout, this);

			// Backward compatibility should be set for variant management => in case of empty list of
			// variant items the "Standard" text should be displayed instead of "Default"
			this.getView().byId("idVariantManagement").setBackwardCompatibility();
		},

		/**
		 * Called by UI5 runtime. Lifecycle exit method.
		 * @private
		 */
		onExit: function () {
			StructureTreeModel.resetModel();
			EventProvider.detachResetStructurePanel(NavigationManager.resetFrame, NavigationManager);
			EventProvider.detachStructureTreeColumnMoved(this.onStructureTreeColumnMoved, this);
			EventProvider.detachStructureTreeColumnFrozen(this.onStructureTreeColumnFrozen, this);
			EventProvider.detachStructureTreeColumnResized(this.onStructureTreeColumnResized, this);
			EventProvider.detachContextChanged(this.onContextChanged, this);
			EventProvider.detachRedetermineStructureTreeColumnLayout(this.onRedetermineTreeColumnLayout, this);

			if (this._tablePersonalization) {
				this._tablePersonalization.destroy();
			}
		},

		/**
		 * Triggers an event to update the Structure Tree
		 * @private
		 */
		onStructureTreeRefresh: function () {
			EventProvider.fireRefreshStructureTree();
		},

		/**
		 * Triggers an event to collapse all nodes in the Structure Tree
		 * @private
		 */
		onStructureTreeCollapseAllNodes: function () {
			EventProvider.fireCollapseAllNodesInStructureTree();
		},

		/**
		 * Triggers an event to expand all nodes in the Structure Tree
		 * @private
		 */
		onStructureTreeExpandAllNodes: function () {
			EventProvider.fireExpandAllNodesInStructureTree();
		},

		/**
		 * Handles the move column event of the Structure Tree
		 * @param {Object} oEvent - UI5 event object
		 * @private
		 */
		onStructureTreeColumnMoved: function (oEvent) {
			var iMandatoryColumnsCount = BOMColumnConfig.getMandatoryColumns().length;

			// The indexes should be decreased by the count of the mandatory columns since they
			// are not handled by the Table Personalization
			this._tablePersonalization.moveColumn(
				oEvent.getParameter("oldPos") - iMandatoryColumnsCount,
				oEvent.getParameter("newPos") - iMandatoryColumnsCount);

			this._updateCurrentVariantSetModified();

			//TODO: find a better solution
			// When the order of the columns is changed by drag & drop the binding is broken
			// => the first modification by the personalization does not effect the table
			// => this _updateColumnSettings function can solve the issue
			// => without setTimeout UI5 issue happens about destroyed columns
			setTimeout(function () {
				this._updateColumnSettings();
			}.bind(this), 0);
		},

		/**
		 * Handles the freeze column event of the Structure Tree
		 * @param {Object} oEvent - UI5 event object
		 * @private
		 */
		onStructureTreeColumnFrozen: function (oEvent) {
			this._tablePersonalization.setFixedColumnCount(
				oEvent.getParameter("fixedColumnCount")
			);

			this._updateCurrentVariantSetModified();
		},

		/**
		 * Handles the resize column event of the Structure Tree
		 * @param {Object} oEvent - UI5 event object
		 * @private
		 */
		onStructureTreeColumnResized: function (oEvent) {
			this._tablePersonalization.setColumnWidth(
				oEvent.getParameter("columnKey"),
				oEvent.getParameter("width")
			);

			this._updateCurrentVariantSetModified();
		},

		/**
		 * Handles the open Table Personalization dialog event
		 * @private
		 */
		onOpenTablePersonalizationDialog: function () {
			this._tablePersonalization.openSettingsDialog()
				.then(function (oResponse) {
					if (oResponse.wasApplied) {
						this._updateColumnSettings();
						this._updateCurrentVariantSetModified();
					}
				}.bind(this));
		},

		/**
		 * Event handler for manage of variants
		 * @param {Object} oEvent - UI5 eventing object
		 * @private
		 */
		onVariantManaged: function (oEvent) {
			var oParameters = oEvent.getParameters();
			var oBOMColumnsVariant = StructurePanelModel.getBOMColumnsVariant();

			oBOMColumnsVariant.defaultKey = oParameters.def;

			$.each(oParameters.renamed, function (iIndex, oAttribute) {
				oBOMColumnsVariant.variantItems[oAttribute.key].name = oAttribute.name;
			});

			$.each(oParameters.deleted, function (iIndex, sKey) {
				delete oBOMColumnsVariant.variantItems[sKey];
			});

			StructurePanelModel.setBOMColumnsVariant(oBOMColumnsVariant);

			this._updateBOMColumnsVariantPersonalization();
		},

		/**
		 * Event handler for save of variant
		 * @param {Object} oEvent - UI5 eventing object
		 * @private
		 */
		onVariantSaved: function (oEvent) {
			var oParameters = oEvent.getParameters();
			var oBOMColumnsVariant = StructurePanelModel.getBOMColumnsVariant();
			var oCurrentState = this._tablePersonalization.getCurrentState();
			var sAuthor = sap.ushell && new sap.ushell.services.UserInfo().getId();

			if (oParameters.def) {
				oBOMColumnsVariant.defaultKey = oParameters.key;
			}

			oBOMColumnsVariant.variantItems[oParameters.key] = {
				key: oParameters.key,
				name: oParameters.name,
				author: sAuthor,
				fixedColumnCount: oCurrentState.fixedColumnCount,
				columnsItems: oCurrentState.columnsItems
			};

			// In case of newly created items the author shall be set for the variant item as well
			if (!oParameters.overwrite && sAuthor) {
				oEvent.getSource().getItemByKey(oParameters.key).setAuthor(sAuthor);
			}

			StructurePanelModel.setBOMColumnsVariant(oBOMColumnsVariant);

			this._tablePersonalization.updateInitialState(oCurrentState);

			this._updateBOMColumnsVariantPersonalization();
		},

		/**
		 * Event handler for selection of variant
		 * @param {Object} oEvent - UI5 eventing object
		 * @private
		 */
		onVariantSelected: function (oEvent) {
			var oVariantItem = StructurePanelModel.getItemOfBOMColumnsVariant(oEvent.getParameter("key"));

			this._tablePersonalization.updateInitialState(
				oVariantItem ? {
					fixedColumnCount: oVariantItem.fixedColumnCount,
					columnsItems: oVariantItem.columnsItems
				} : {
					columnsItems: BOMColumnConfig.getPersonalizationStateDefault()
				}
			);

			this._updateColumnSettings();
		},

		/**
		 * Handles the BOM view change in the Select
		 * @param {Object} oEvent - UI5 event object
		 * @private
		 */
		onBOMViewSelectionChange: function (oEvent) {
			var sViewKey = oEvent.getSource().getBindingContext("ui").getObject().key;

			if (this._BOMViewSelectionPopover) {
				this._BOMViewSelectionPopover.close();
			}

			if (StructurePanelModel.getSelectedBOMView() !== sViewKey) {
				StructurePanelModel.setSelectedBOMView(sViewKey);
				EventProvider.fireBOMViewSelectionChanged();
			}
		},

		/**
		 * Triggered when the BOM view selection button is pressed
		 * @param {Object} oEvent - UI5 event object
		 * @private
		 */
		onBOMViewSelectionTriggered: function (oEvent) {
			if (!this._BOMViewSelectionPopover) {
				this._BOMViewSelectionPopover = new sap.m.Popover({
					title: i18n.getText("vchclf_structpnl_viewselector_title"),
					content: sap.ui.xmlfragment(
						"sap.i2d.lo.lib.zvchclfz.components.structurepanel.fragment.BOMSelectorPopoverContent", this),
					placement: sap.m.PlacementType.Bottom
				});
				this.getView().addDependent(this._BOMViewSelectionPopover);
			}

			this._BOMViewSelectionPopover.openBy(oEvent.getSource());
		},

		/**
		 * Event handler for the X button at the top-right corner of the panel
		 * @private
		 */
		onClosePanelPressed: function () {
			this.getOwnerComponent().fireClosePanelPressed();
		},

		/**
		 * Event handler for the Show Super BOM button
		 * @private
		 */
		onShowSuperBOMChanged: function () {
			EventProvider.fireBOMViewSelectionChanged();
		},

		/**
		 * Event handler for context change
		 * @private
		 */
		onContextChanged: function () {
			if (!this._tablePersonalization) {
				// We need the PersonalizationDAO property of the Owner Component
				// Since it is not available in the onInit function yet, we should initialize the
				// Table Personalization here
				this._initTablePersonalization();
			} else {
				this.onRedetermineTreeColumnLayout();
			}
		},

		/**
		 * Event handler for redetermineStructureTreeColumnLayout
		 * @private
		 */
		onRedetermineTreeColumnLayout: function () {
			if (this._tablePersonalization) {
				this._tablePersonalization.init(
					BOMColumnConfig.getCustomizableColumns(),
					this._tablePersonalization.getCurrentState()
				);

				this._updateColumnSettings();
				EventProvider.fireUpdateStructureTreeColumnBinding();
			}
		},

		/**
		 * Initialize the Table Personalization utility
		 * @private
		 */
		_initTablePersonalization: function () {
			this._getBOMColumnsVariantPersonalization()
				.then(function (oBOMColumnsVariant) {
					var oInitialState = {};

					if (oBOMColumnsVariant && oBOMColumnsVariant.variantItems[oBOMColumnsVariant.defaultKey]) {
						var oVariantItem = oBOMColumnsVariant.variantItems[oBOMColumnsVariant.defaultKey];

						oInitialState = {
							fixedColumnCount: oVariantItem.fixedColumnCount,
							columnsItems: oVariantItem.columnsItems
						};

						oBOMColumnsVariant.initialSelectionKey = oBOMColumnsVariant.defaultKey;
					} else {
						oInitialState = {
							columnsItems: BOMColumnConfig.getPersonalizationStateDefault()
						};
					}

					this._tablePersonalization = new TablePersonalization();

					this._tablePersonalization.init(
						BOMColumnConfig.getCustomizableColumns(),
						oInitialState
					);

					StructurePanelModel.setBOMColumnsVariant(oBOMColumnsVariant);

					this._updateColumnSettings();

					EventProvider.fireUpdateStructureTreeColumnBinding();
				}.bind(this));
		},

		/**
		 * Returns the BOMColumnsVariant from the Personalization DAO
		 * @returns {Promise} Promise object which provides the data
		 * @private
		 */
		_getBOMColumnsVariantPersonalization: function () {
			return new Promise(function (fnResolve) {
				var oPersonalizationDAO = this.getOwnerComponent().getPersonalizationDAO();

				if (oPersonalizationDAO) {
					oPersonalizationDAO.getData()
						.then(function (oPersonalizationData) {
							fnResolve(oPersonalizationData.BOMColumnsVariant);
						});
				} else {
					fnResolve();
				}
			}.bind(this));
		},

		/**
		 * Updates the BOMColumnsVariant in the Personalization DAO
		 * @private
		 */
		_updateBOMColumnsVariantPersonalization: function () {
			var oPersonalizationDAO = this.getOwnerComponent().getPersonalizationDAO();

			if (oPersonalizationDAO) {
				var oBOMColumnsVariant = StructurePanelModel.getBOMColumnsVariant();

				oPersonalizationDAO.setDataWithoutChangeEvent({
					BOMColumnsVariant: {
						defaultKey: oBOMColumnsVariant.defaultKey,
						variantItems: oBOMColumnsVariant.variantItems
					}
				});
			}
		},

		/**
		 * Updates the settings of the columns of the Structure Panel
		 * @private
		 */
		_updateColumnSettings: function () {
			StructurePanelModel.setSelectedColumns(
				BOMColumnConfig.getMandatoryColumns().concat(this._tablePersonalization.getSelectedColumns())
			);
			StructurePanelModel.setFixedColumnCount(this._tablePersonalization.getCurrentState().fixedColumnCount);
		},

		/**
		 * Update the flag of current variant set modified of the Variant Management
		 * @private
		 */
		_updateCurrentVariantSetModified: function () {
			var oVariantManagement = this.getView().byId("idVariantManagement");

			if (!this._tablePersonalization.isColumnsItemsStateInitial()) {
				oVariantManagement.currentVariantSetModified(true);
			} else {
				oVariantManagement.currentVariantSetModified(false);
			}
		}
	});
});
