/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/i18n",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/StructurePanelModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/RoutingSelectionUtil"
], function (i18n, StructurePanelModel, RoutingSelectionUtil) {
	"use strict";

	return {
		/**
		 * Formatter for the routing header title
		 * @param {String} sRoutingHeaderProduct - The header product of the routing
		 * @returns {String} Routing header title
		 */
		formatRoutingHeaderProduct: function (sRoutingHeaderProduct) {
			return i18n.getTextWithParameters("vchclf_structpnl_routing_header_desc", [sRoutingHeaderProduct]);
		},

		/**
		 * Formatter for the routing key (e.g. for the Select Routing dialog)
		 * @param {String} sBillOfOperationsGroup - BillOfOperationsGroup property of RoutingNode entity
		 * @param {String} sBillOfOperationsVariant - BillOfOperationsVariant property of RoutingNode entity
		 * @returns {String} the concatenated routing key
		 */
		formatRoutingKey: function (sBillOfOperationsGroup, sBillOfOperationsVariant) {
			return sBillOfOperationsGroup + " / " + sBillOfOperationsVariant;
			// i18n is not necessary, because this is technical id
		},

		/**
		 * Formatter for the selected routing
		 * @param {String} sRoutingDescription - BillOfOperationsGroup property of RoutingNode entity
		 * @param {String} sBillOfOperationsGroup - BillOfOperationsGroup property of RoutingNode entity
		 * @param {String} sBillOfOperationsVariant - BillOfOperationsVariant property of RoutingNode entity
		 * @returns {String} the concatenated routing selection text
		 */
		formatRoutingSelection: function (sRoutingDescription, sBillOfOperationsGroup, sBillOfOperationsVariant) {
			return i18n.getTextWithParameters("vchclf_structpnl_multiple_routing_select", [
				sRoutingDescription, sBillOfOperationsGroup, sBillOfOperationsVariant
			]);
		},

		/**
		 * Formatter for tooltip of the selected routing
		 * @param {String} sSelectedRoutingKey - Key of selected routing
		 * @returns {String} the concatenated routing selection tooltip text
		 */
		formatSelectedRoutingTooltip: function (sSelectedRoutingKey) {
			if (sSelectedRoutingKey !== "") {
				var aRoutings = $.grep(StructurePanelModel.getAvailableRoutings(), function (oElement) {
					return RoutingSelectionUtil.getConcatenatedRoutingKey(
							oElement.BillOfOperationsGroup, oElement.BillOfOperationsVariant) ===
						sSelectedRoutingKey;
				});

				if (aRoutings.length >= 1) {
					return i18n.getTextWithParameters("vchclf_structpnl_multiple_routing_select", [
						aRoutings[0].Description,
						aRoutings[0].BillOfOperationsGroup, aRoutings[0].BillOfOperationsVariant
					]);
				} else {
					return "";
				}
			} else {
				return "";
			}
		},

		/**
		 * Formatter for key for routing selection
		 * @param {String} sBillOfOperationsGroup - BillOfOperationsGroup property of RoutingNode entity
		 * @param {String} sBillOfOperationsVariant - BillOfOperationsVariant property of RoutingNode entity
		 * @return {String} the formatted key
		 */
		formatRoutingSelectionKey: function (sBillOfOperationsGroup, sBillOfOperationsVariant) {
			return RoutingSelectionUtil.getConcatenatedRoutingKey(sBillOfOperationsGroup, sBillOfOperationsVariant);
		}
	};
});
