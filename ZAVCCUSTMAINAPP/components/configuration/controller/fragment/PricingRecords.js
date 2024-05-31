/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/configuration/controller/fragment/Base",
	"sap/i2d/lo/lib/zvchclfz/common/util/XMLFragmentCache",
	"sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/core/format/NumberFormat"
], function(Base, XMLFragmentCache, Constants, JSONModel, Filter, NumberFormat) {
	"use strict";

	/**
	 * Pricing Records Dialog fragment controller
	 * 
	 * @class
	 * @abstract
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.vchclf.components.configuration.controller.fragment.PricingRecords
	 * @extends  sap.i2d.lo.lib.vchclf.components.configuration.controller.fragment.Base
	 */
	return Base.extend("sap.i2d.lo.lib.zvchclfz.components.configuration.controller.fragment.PricingRecords", { /** @lends sap.i2d.lo.lib.vchclf.components.configuration.controller.fragment.PricingRecords.prototype */

		_createDialog: function () {
			var sFragmentName = "sap.i2d.lo.lib.zvchclfz.components.configuration.view.fragment.PricingRecords";
			this._oDialog = XMLFragmentCache.createFragment("pricingDialog", sFragmentName, this);

			var oBindingContext = this.getView().getBindingContext(Constants.VCHCLF_MODEL_NAME);
			var oBindingContextForOrigin = this.getView().getModel("vchclf").createBindingContextForOriginModel(oBindingContext);
			this._oDialog.setBusyIndicatorDelay(0);
			this._oDialog.setBindingContext(oBindingContextForOrigin, "vchclf_bind_only");
			this.getView().addDependent(this._oDialog);

			this._initFilterModel();
		},

		_updateDialog: function () {
			var oBindingContext = this.getView().getBindingContext(Constants.VCHCLF_MODEL_NAME);
			var oBindingContextForOrigin = this.getView().getModel("vchclf").createBindingContextForOriginModel(oBindingContext);
			this._oDialog.setBindingContext(null, "vchclf_bind_only");
			this._oDialog.setBindingContext(oBindingContextForOrigin, "vchclf_bind_only");
		},

		_initFilterModel: function () {
			this._oFilterModel = new JSONModel({
				selectedFilterKey: "F2",
				selectedFilterText: this.getText("PRICING_RECORDS_VARIANT"),
				filters: [],
				recordsNumberTitle: null
			});
			this._oFilterModel.setProperty("/filters", [{
				text: this.getText("PRICING_RECORDS_ALL"),
				key: "F1"
			}, {
				text: this.getText("PRICING_RECORDS_VARIANT"),
				key: "F2"
			}, {
				text: this.getText("PRICING_RECORDS_WO_SUBTOTALS"),
				key: "F3"
			}]);
			this._oDialog.setModel(this._oFilterModel, "pricingRecordsFilterModel");

			this._setFilterForRecordsTable("F2");
		},

		_createRecordsFilter: function (sFilterDefKey) {
			var aFilter = [];

			switch (sFilterDefKey) {
			case "F1": // show all conditions
				break;
			case "F2": // show only variant conditions
				var varCondFilter = new Filter("VariantCondition", sap.ui.model.FilterOperator.EQ, "*");
				aFilter.push(varCondFilter);
				break;
			case "F3": // exclude subtotals
				var exclSubtotalsFilter = new Filter("CondTypeId", sap.ui.model.FilterOperator.NE, "*");
				aFilter.push(exclSubtotalsFilter);
			}
			return aFilter;
		},

		_setFilterForRecordsTable: function (sFilterDefKey) {
			var oTable = this._oDialog.getAggregation("content")[0].getAggregation("flexContent");
			if (oTable.getId() === "pricingDialog--PricingRecordsTable") {
				var oTableItems = oTable.getBinding("items");
				var aFilter = this._createRecordsFilter(sFilterDefKey);
				oTableItems.filter(aFilter);
			}
		},

		closeDialog: function (oEvent) {
			this._oDialog.close();
		},

		exit: function () {
			if (this._oDialog) {
				this._oDialog.destroy();
			}
		},

		openDialog: function () {
			if (!this._oDialog) {
				this._createDialog();
			} else {
				this._updateDialog();
			}
			this._oDialog.open();
		},

		getCondRefFactor: function (iCondRefFactor, sCondRefUOM) {
			if (iCondRefFactor !== "0" && sCondRefUOM) {
				var numberFormatter = NumberFormat.getIntegerInstance();
				return numberFormatter.format(iCondRefFactor);
			} else {
				return "";
			}
		},

		getCalcCondFactor: function (iCalcCondFactor, sVariantCondition) {
			if (sVariantCondition) {
				return NumberFormat.getCurrencyInstance().format(iCalcCondFactor);
			} else {
				return "";
			}
		},

		onSelectionChange: function (oEvent) {
			var sFilterDefKey = oEvent.getSource().getSelectedItem().getKey();
			this._oFilterModel.setProperty("/selectedFilterKey", sFilterDefKey);

			this._setFilterForRecordsTable(sFilterDefKey);
		},

		onPricingRecordsReceived: function (oEvent) {
			var sFilterDefKey = this._oFilterModel.getProperty("/selectedFilterKey");

			var aFilters = this._oFilterModel.getProperty("/filters");
			var oSelectedFilterDef = {};
			for (var k = 0; k < aFilters.length; k++) {
				var oFilterDef = aFilters[k];
				if (oFilterDef.key === sFilterDefKey) {
					oSelectedFilterDef = oFilterDef;
					break;
				}
			}
			this._oFilterModel.setProperty("/selectedFilterText", oSelectedFilterDef.text);

			var count = oEvent.getParameter("data").results.length;
			var sRecordsNumberTitle = this.getText("CONDITION_RECORDS") + " (" + count + ")";
			this._oFilterModel.setProperty("/recordsNumberTitle", sRecordsNumberTitle);
		},

		getConditionRecordTooltip: function (sConditionInactive, sConditionStatistical) {
			if (sConditionStatistical === true) {
				return this.getText("STATISTICAL_CONDITION");
			}
			if (sConditionInactive === "X") {
				return this.getText("INACTIVE_CONDITION");
			}
		}
	});

}, /* bExport= */ true);
