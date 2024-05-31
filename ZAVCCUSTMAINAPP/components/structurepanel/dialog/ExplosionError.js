/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/i2d/lo/lib/zvchclfz/common/util/AppEvents",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/StructurePanelModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/model/StructureTreeModel"
], function (ManagedObject, AppEvents, StructurePanelModel, StructureTreeModel) {
	"use strict";
	/**
	 * BOM Explosion Error dialog.
	 * @class
	 * @abstract
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.ExplosionError
	 * @extends sap.ui.core.Control
	 */
	
	return ManagedObject.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.ExplosionError", {
		/** @lends sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.ExplosionError.prototype */
		metadata: {
			properties: {
				controller: {
					type: "sap.ui.core.mvc.Controller"
				},
				control: {
					type: "object"
				},
				details: {
					type: "object"
				}
			}
		},
		
		/**
		 * Maps BOM item details from business error message to BOMNode entity fields which are relevant for navigation to OBOM app
		 * @returns {object} BOMNode values for navigation
		 */
		_mapDetailsToBOMNodeEntity: function() {
			var oDetails = this.getDetails();
			var sDraftUUID = oDetails.DRAFT_UUID;
			if (sDraftUUID === "00000000000000000000000000000000") {
				sDraftUUID = "00000000-0000-0000-0000-000000000000";
			}
			var sBOMVariant = oDetails.VARIANT;
			if (sBOMVariant) {
				sBOMVariant = String(parseInt(oDetails.VARIANT, 10));  //remove leading zeros
			}
			return {
				"to_BOMHeader": {
					"BOMCategory": oDetails.CATEGORY,
					"BOMVariant":  sBOMVariant,
					"BillOfMaterialInternalID": oDetails.NUMBER,
					"BOMHeaderDraftUUID": sDraftUUID
				},
				"BOMComponentName": oDetails.MATERIAL,
			    "Plant": oDetails.PLANT
			};
		},
		
		/**
		 * Event Handler is fired when Manage Order BOM app button is triggered. 
		 * Triggers navigation to Manage Order BOM app in new tab. 
		 * 
		 * @public
		 */
		onNavigateToBOMApp: function () {
			this.getControl().close();
			this.getController().navigateToBOMAppWithoutReadingHeader(this._mapDetailsToBOMNodeEntity(), true);
			this.getController().openReexplodeBOMDialog();
		},
		
		/**
		 * Event Handler is fired when cancel button is triggered. 
		 * Publish the Dialog Close event with action "cancel" to trigger cancel draft.
		 * 
		 * @public
		 */
		onCancelDraft: function () {
			this.getControl().close();
			AppEvents.BOM_EXPLOSION_ERROR_DIALOG_CLOSE.publish({
				action: "cancel"
			});
		},
		
		/**
		 * The function allows you to define custom behavior which will be executed when the Escape key is pressed.
		 * In our case the Escape command is rejected to prevent the Explosion Error dialog from closing.
		 * @param {Promise} oPromise - you should call either resolve() or reject()
		 * @public
		 */
		onEscape: function(oPromise) {
			oPromise.reject();
		}
		
	});
}, /* bExport= */ true);
