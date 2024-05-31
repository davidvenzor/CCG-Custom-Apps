/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/dialog/BOMItemUoMVH",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/i18n",
	"sap/ui/core/ValueState"
	], function (BOMItemUoMVH, Constants, i18n, ValueState) {
	"use strict";
	/**
	 * BOM item VH Dialog.
	 * @class
	 * @abstract
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.BOMItemVariableUoMVH
	 * @extends sap.ui.core.Control
	 */
	return BOMItemUoMVH.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.BOMItemVariableUoMVH", {
		/** @lends sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.BOMItemUoMVH.prototype */
		metadata: {
			properties: {}
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

			oBOMItemDialogModel.setProperty("/VarItemUnit", oEvent.getParameter("tokens")[0].getKey().toUpperCase());
			this.getSource().setValueState(ValueState.None);
			this.close();
		}
	});
}, /* bExport= */ true);
