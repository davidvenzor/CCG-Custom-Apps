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
	 * @alias sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.BOMItemFormulaVH
	 * @extends sap.ui.core.Control
	 */
	var aColumns = [
		{
			"label": i18n.getText("vchclf_structpnl_bom_formula_key_vh_label"),
			"template": "VariableSizeCompFormulaKey"
		},
		{
			"label": i18n.getText("vchclf_structpnl_bom_formula_vh_label"),
			"template": "VariableSizeCompFormula"
		},
		{
			"label": i18n.getText("vchclf_structpnl_bom_formula_description_vh_label"),
			"template": "VariableSizeCompFormulaText"
		}
	];

	return BOMItemBaseVH.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.BOMItemFormulaVH", {
		/** @lends sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.BOMItemBaseVH.prototype */
		metadata: {
			properties: {}
		},
		/**
		 * Set control instance of given UI control.
		 * Set data to Value Help configuration and column models.
		 * Bind table by given entity path.
		 * @param {sap.ui.core.Control} oControl: an instance of an UI5 control.
		 * @public
		 * @override
		 * @function
		 */
		setControl: function (oControl) {
			BOMItemBaseVH.prototype.setControl.apply(this, arguments);

			this._oBOMItemVHDialogConfigModel.setData({
				key: "VariableSizeCompFormulaKey",
				descriptionKey: "VariableSizeCompFormulaText",
				title: i18n.getText("vchclf_structpnl_bom_formula_vh_title"),
				filters: aColumns
			});
			this._oColumnModel.setData({
				"cols": aColumns
			});
			this.bindTable("/I_BillOfMaterialFormulaVH");
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

			oBOMItemDialogModel.setProperty("/VarItemFormula", oEvent.getParameter("tokens")[0].getKey().toUpperCase());
			this.getSource().setValueState(ValueState.None);
			this.close();
		}
	});
}, /* bExport= */ true);
