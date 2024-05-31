/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/dialog/BOMItemBaseVH",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/i18n",
	"sap/ui/core/ValueState"
	], function (BOMItemBaseVH, Constants, i18n, ValueState) {
	"use strict";
	/**
	 * BOM item VH Dialog.
	 * @class
	 * @abstract
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.BOMItemDocumentBaseVH
	 * @extends sap.ui.core.Control
	 */
	var oDocumentTemplates = {
			"name": "DocumentInfoRecordDocNumber",
			"version": "DocumentInfoRecordDocVersion",
			"part": "DocumentInfoRecordDocPart",
			"type": "DocumentInfoRecordDocType"
	};
	var aColumns = [
		{
			"label": i18n.getText("vchclf_structpnl_bom_item_document"),
			"template": oDocumentTemplates.name
		},
		{
			"label": i18n.getText("vchclf_structpnl_bom_item_document_version"),
			"template": oDocumentTemplates.version
		},
		{
			"label": i18n.getText("vchclf_structpnl_bom_item_document_type"),
			"template": oDocumentTemplates.type
		},
		{
			"label": i18n.getText("vchclf_structpnl_bom_item_document_part"),
			"template": oDocumentTemplates.part
		}
	];

	return BOMItemBaseVH.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.BOMItemDocumentBaseVH", {
		/** @lends sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.BOMItemBaseVH.prototype */
		metadata: {
			properties: {}
		},
		/**
		 * Set control instance of given UI control.
		 * Set data to Value Help configuration and column models.
		 * Bind table by given entity path.
		 * @public
		 * @override
		 * @function
		 */
		setControl: function () {
			BOMItemBaseVH.prototype.setControl.apply(this, arguments);

			this._oBOMItemVHDialogConfigModel.setData({
				key: "DocumentInfoRecordDocNumber",
				descriptionKey: "DocumentDescription",
				title: i18n.getText("vchclf_structpnl_bom_document_vh_title"),
				filters: aColumns
			});
			this._oColumnModel.setData({
				"cols": aColumns
			});
			this.bindTable("/I_DocumentInfoRecordDocPrtVH");
		},
		/**
		 * Event handler: called after the Value Help dialog OK button is pressed.
		 * Update BOM item dialog model and closes the Value Help dialog.
		 * @param {sap.ui.base.Event} oEvent: An Event object consisting of an ID, a source and a map of parameters.
		 * @public
		 * @override
		 * @function
		 */
		onOk: function (oEvent) {
			var oBOMItemDialogModel = this.getControl().getModel(Constants.SelectedBOMItem);
			var oTable = oEvent.getSource().getTable();
			var sSelectedIndex = oTable.getSelectedIndex();
			var aRows = oTable.getRows();
			var oSelectedRow = {};

			aRows.forEach(function (oRow) {
				if (oRow.getIndex() === sSelectedIndex){
					oSelectedRow = oRow;
				}
			});

			var aCells = oSelectedRow.getCells();

			aCells.forEach(function(oCell){
				var sPath = oCell.getBinding("text").getPath();

				switch (sPath) {
					case oDocumentTemplates.name:
						oBOMItemDialogModel.setProperty("/DocItemName", oCell.getText());
						break;
					case oDocumentTemplates.part:
						oBOMItemDialogModel.setProperty("/DocItemPart", oCell.getText());
						break;
					case oDocumentTemplates.version:
						oBOMItemDialogModel.setProperty("/DocItemVersion", oCell.getText());
						break;
					case oDocumentTemplates.type:
						oBOMItemDialogModel.setProperty("/DocItemType", oCell.getText());
						break;
					}
			});
			this.getSource().setValueState(ValueState.None);
			this.close();
		}
	});
}, /* bExport= */ true);
