/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/EventProvider",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/FeatureToggle",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/model/StructureTreeModel"
], function (Constants, EventProvider, FeatureToggle, StructureTreeModel) {
	"use strict";

	return {
		/**
		 * Fires OpenBOMItemDialogForInsertItem event when insert BOM item button was pressed
		 *
		 * @public
		 * @function
		 */
		onOpenBOMItemDialogForInsertItem: function () {
			EventProvider.fireOpenBOMItemDialogForInsertItem();
		},
		/**
		 * Fires OpenBOMItemDialogForChangeItem event when change BOM item button was pressed
		 *
		 * @public
		 * @function
		 */
		onOpenBOMItemDialogForChangeItem: function () {
			EventProvider.fireOpenBOMItemDialogForChangeItem();
		},
		/**
		 * Fires DeleteBOMItem event when delete BOM item button was pressed
		 *
		 * @public
		 * @function
		 */
		onBOMItemDelete: function () {
			EventProvider.fireDeleteBOMItem();
		},
		/**
		 * Fires FixateBOMItem event when fixate BOM item button was pressed
		 *
		 * @public
		 * @function
		 */
		onBOMItemFixate: function () {
			EventProvider.fireFixateBOMItem({fixOrderBOMMode: Constants.FixOrderBOMMode.FIXATE});
		},
		/**
		 * Fires FixateBOMItem event when fixate top-down BOM item button was pressed
		 *
		 * @public
		 * @function
		 */
		onBOMItemFixateTopdown: function() {
			EventProvider.fireFixateBOMItem({fixOrderBOMMode: Constants.FixOrderBOMMode.FIXATE_TOPDOWN});
		},
		/**
		 * Fires NavigateToBOMAppForInsertItem event when navigation to BOM App button was pressed
		 *
		 * @public
		 * @function
		 */
		onNavigateToBOMAppForInsertItem: function () {
			EventProvider.fireNavigateToBOMAppForInsertItem();
		},
		/**
		 * Fires NavigateToBOMAppForChangeItem event when navigation to BOM App button was pressed
		 *
		 * @public
		 * @function
		 */
		onNavigateToBOMAppForChangeItem: function () {
			EventProvider.fireNavigateToBOMAppForChangeItem();
		},
		/**
		 * Formatter: gets enablement of Fixate button.
		 * @param {object} oCurrentlyFocusedBOMItem: selected BOM item in the Structure Tree
		 * @returns {boolean} enablement of Fixate button
		 * @public
		 * @function
		 */
		isFixateButtonEnabled: function (oCurrentlyFocusedBOMItem){
			if (!oCurrentlyFocusedBOMItem || !Constants) {
				return false;
			}

			return oCurrentlyFocusedBOMItem.FixateState === Constants.FixateState.FIXATE_ALLOWED;
		},
		/**
		 * Formatter: gets visibility of Fixate button.
		 * @param {boolean} bIsBOMChangeAllowed: BOM changes availability indicator
		 * @param {boolean} bIsStructurePanelEditable: Structure Panel editable indicator
		 * @returns {boolean} visibility of Fixate button
		 * @public
		 * @function
		 */
		isFixateButtonVisible: function (bIsBOMChangeAllowed, bIsStructurePanelEditable){
			return  !FeatureToggle.getETOTopDownFixateEnabled() &&
					bIsBOMChangeAllowed &&
					bIsStructurePanelEditable;
		},
		/**
		 * Formatter: gets visibility of Fixate Menu button.
		 * @param {object} oUISettings: UISettingsSet for the current context
		 * @param {boolean} bIsBOMChangeAllowed: BOM changes availability indicator
		 * @param {boolean} bIsStructurePanelEditable: Structure Panel editable indicator
		 * @returns {boolean} visibility of Fixate Menu button
		 * @public
		 * @function
		 */
		isFixateMenuButtonVisible: function (oUISettings, bIsBOMChangeAllowed, bIsStructurePanelEditable){
			return	FeatureToggle.getETOTopDownFixateEnabled() &&
					oUISettings &&
					oUISettings.FixOrderBOMMode === Constants.FixOrderBOMMode.FIXATE &&
					bIsBOMChangeAllowed &&
					bIsStructurePanelEditable;
		},
		/**
		 * Formatter: gets visibility of Fixate top-down Menu button.
		 * @param {object} oUISettings: UISettingsSet for the current context
		 * @param {boolean} bIsBOMChangeAllowed: BOM changes availability indicator
		 * @param {boolean} bIsStructurePanelEditable: Structure Panel editable indicator
		 * @returns {boolean} visibility of Fixate top-down Menu button
		 * @public
		 * @function
		 */
		isFixateTopDownMenuButtonVisible: function (oUISettings, bIsBOMChangeAllowed, bIsStructurePanelEditable){
			return  FeatureToggle.getETOTopDownFixateEnabled() &&
					oUISettings &&
					oUISettings.FixOrderBOMMode === Constants.FixOrderBOMMode.FIXATE_TOPDOWN &&
					bIsBOMChangeAllowed &&
					bIsStructurePanelEditable;
		},
		/**
		 * Formatter: enables BOM item action button Insert.
		 * @param {object} oCurrentlyFocusedBOMItem: selected BOM item in the Structure Tree
		 * @returns {boolean} visibility of BOM item action button
		 * @public
		 * @function
		 */
		isInsertBOMItemButtonEnabled: function (oCurrentlyFocusedBOMItem){
			if (!oCurrentlyFocusedBOMItem || !Constants) {
				return false;
			}

			if (FeatureToggle.getETOImplicitOBOMCreateEnabled()) {
				return 	( oCurrentlyFocusedBOMItem.FixateState === Constants.FixateState.ITEM_FIXED ||
						  oCurrentlyFocusedBOMItem.FixateState === Constants.FixateState.FIXATE_ALLOWED ) &&
						 oCurrentlyFocusedBOMItem.IsConfigurableItem;
			} else {
				return 	 oCurrentlyFocusedBOMItem.FixateState === Constants.FixateState.ITEM_FIXED &&
						 oCurrentlyFocusedBOMItem.IsConfigurableItem;
			}
		},
		/**
		 * Formatter: enables BOM item action button Update.
		 * @param {object} oCurrentlyFocusedBOMItem: selected BOM item in the Structure Tree
		 * @returns {boolean} visibility of BOM item action button
		 * @public
		 * @function
		 */
		isUpdateBOMItemButtonEnabled: function (oCurrentlyFocusedBOMItem){
			if (!oCurrentlyFocusedBOMItem || !Constants) {
				return false;
			}

			var oParentComponent = StructureTreeModel.getBOMComponentById(oCurrentlyFocusedBOMItem.ParentComponentId);

			// only if selected bom item has a parent with an order bom the update button is visible
			if (!oParentComponent) {
				return false;
			} else {
				if (FeatureToggle.getETOImplicitOBOMCreateEnabled()) {
					return 	 oParentComponent.FixateState === Constants.FixateState.ITEM_FIXED ||
							 (oParentComponent.FixateState === Constants.FixateState.FIXATE_ALLOWED &&
							  oParentComponent.IsConfigurableItem);
				} else {
					return	oParentComponent.FixateState === Constants.FixateState.ITEM_FIXED;
				}
			}
		},
		/**
		 * Formatter: enables BOM item action button Delete.
		 * @param {object} oCurrentlyFocusedBOMItem: selected BOM item in the Structure Tree
		 * @returns {boolean} visibility of BOM item action button
		 * @public
		 * @function
		 */
		isDeleteBOMItemButtonEnabled: function (oCurrentlyFocusedBOMItem){
			if (!oCurrentlyFocusedBOMItem || !Constants) {
				return false;
			}

			var oParentComponent = StructureTreeModel.getBOMComponentById(oCurrentlyFocusedBOMItem.ParentComponentId);

			// only if selected bom item has a parent with an order bom the delete button is visible
			if (!oParentComponent) {
				return false;
			} else {
				if (FeatureToggle.getETOImplicitOBOMCreateEnabled()) {
					return 	 oParentComponent.FixateState === Constants.FixateState.ITEM_FIXED ||
							 (oParentComponent.FixateState === Constants.FixateState.FIXATE_ALLOWED &&
							  oParentComponent.IsConfigurableItem);
				} else {
					return	oParentComponent.FixateState === Constants.FixateState.ITEM_FIXED;
				}
			}
		},
		/**
		 * Formatter: enables navigate to BOM app menu item for insert
		 * @param {object} oCurrentlyFocusedBOMItem: selected BOM item in the Structure Tree
		 * @returns {boolean} visibility of BOM item action button
		 * @public
		 * @function
		 */
		isNavigateToBOMAppForInsertEnabled: function (oCurrentlyFocusedBOMItem) {
			if (FeatureToggle.getETONavigateToOBOMAppWithDraft()) {
				return true;
			}
			
			if (!oCurrentlyFocusedBOMItem) {
				return false;
			}

			return oCurrentlyFocusedBOMItem.FixateState === Constants.FixateState.ITEM_FIXED &&
			        oCurrentlyFocusedBOMItem.IsConfigurableItem;
		},
		/**
		 * Formatter: enables navigate to BOM app menu item for update
		 * @param {object} oCurrentlyFocusedBOMItem: selected BOM item in the Structure Tree
		 * @returns {boolean} visibility of BOM item action button
		 * @public
		 * @function
		 */
		isNavigateToBOMAppForUpdateEnabled: function (oCurrentlyFocusedBOMItem) {
			if (FeatureToggle.getETONavigateToOBOMAppWithDraft()) {
				return true;
			}
			
			if (!oCurrentlyFocusedBOMItem) {
				return false;
			}

			var oParentComponent = StructureTreeModel.getBOMComponentById(oCurrentlyFocusedBOMItem.ParentComponentId);

			if (!oParentComponent) {
				return false;
			}

			return oParentComponent.FixateState === Constants.FixateState.ITEM_FIXED &&
				oParentComponent.IsConfigurableItem;
		},
	};
});
