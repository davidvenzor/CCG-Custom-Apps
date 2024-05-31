/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/i18n"
], function (Constants, i18n) {
	"use strict";

	return {
		/**
		 * Gives back the proper icon based on the type of the RoutingNode
		 * @param {String} sNodeType - type of the RoutingNode
		 * @returns {String} Icon URI property
		 */
		getNodeTypeIcon: function (sNodeType) {
			switch (sNodeType) {
				case Constants.routing.nodeType.routingHeader:
					return "sap-icon://begin";
				case Constants.routing.nodeType.standardSequence:
					return "sap-icon://BusinessSuiteInAppSymbols/icon-main-sequence";
				case Constants.routing.nodeType.parallelSequence:
					return "sap-icon://BusinessSuiteInAppSymbols/icon-parallel-sequence";
				case Constants.routing.nodeType.alternativeSequence:
					return "sap-icon://BusinessSuiteInAppSymbols/icon-alternative-sequence";
				case Constants.routing.nodeType.operation:
					return "sap-icon://circle-task-2";
				case Constants.routing.nodeType.subOperation:
					return "sap-icon://circle-task";
				case Constants.routing.nodeType.refOperation:
					return "sap-icon://mirrored-task-circle-2";
				case Constants.routing.nodeType.refSubOperation:
					return "sap-icon://mirrored-task-circle";
				default:
					return "";
			}
		},

		/**
		 * Gives back the proper tooltip for the icon of RoutingNode based on the type
		 * @param {String} sNodeType - type of the RoutingNode
		 * @returns {String} Tooltip for the icon
		 */
		getNodeTypeTooltip: function (sNodeType) {
			switch (sNodeType) {
				case Constants.routing.nodeType.routingHeader:
					return i18n.getText("vchclf_structpnl_routing_tree_routing_header_tt");
				case Constants.routing.nodeType.standardSequence:
					return i18n.getText("vchclf_structpnl_routing_tree_standard_sequence_tt");
				case Constants.routing.nodeType.parallelSequence:
					return i18n.getText("vchclf_structpnl_routing_tree_parallel_sequence_tt");
				case Constants.routing.nodeType.alternativeSequence:
					return i18n.getText("vchclf_structpnl_routing_tree_alternative_sequence_tt");
				case Constants.routing.nodeType.operation:
					return i18n.getText("vchclf_structpnl_routing_tree_operation_tt");
				case Constants.routing.nodeType.subOperation:
					return i18n.getText("vchclf_structpnl_routing_tree_suboperation_tt");
				case Constants.routing.nodeType.refOperation:
					return i18n.getText("vchclf_structpnl_routing_tree_refoperation_tt");
				case Constants.routing.nodeType.refSubOperation:
					return i18n.getText("vchclf_structpnl_routing_tree_refsuboperation_tt");
				default:
					return "";
			}
		},

		/**
		 * Gives back the proper icon based on the branch and return property of the RoutingNode
		 * @param {String} sBranch - BOOSequenceBranchOperation property of RoutingNode
		 * @param {String} sReturn - BOOSequenceReturnOperation property of RoutingNode
		 * @returns {String} Icon URI property
		 */
		getNodeBranchReturnIcon: function (sBranch, sReturn) {
			if (sBranch) {
				return "sap-icon://arrow-right";
			} else if (sReturn) {
				return "sap-icon://arrow-left";
			} else {
				return "";
			}
		},

		/**
		 * Gives back the proper tooltip for the icon of RoutingNode based on the branch and return property
		 * @param {String} sBranch - BOOSequenceBranchOperation property of RoutingNode
		 * @param {String} sReturn - BOOSequenceReturnOperation property of RoutingNode
		 * @returns {String} Tooltip for the icon
		 */
		getNodeBranchReturnTooltip: function (sBranch, sReturn) {
			if (sBranch) {
				return i18n.getText("vchclf_structpnl_routing_tree_branch_operation_tt");
			} else if (sReturn) {
				return i18n.getText("vchclf_structpnl_routing_tree_return_operation_tt");
			} else {
				return "";
			}
		},

		/**
		 * Returns back the visibility of the Object Dependency Assignment Icon based on the Object
		 * Dependency Assingment Number
		 * @param {String} sObjectDependencyAssgmtNumber - Object Dependency Assingment Number
		 * @returns {Boolean} Visibility of the icon
		 */
		returnObjDepIconVisibility: function (sObjectDependencyAssgmtNumber) {
			return sObjectDependencyAssgmtNumber !== Constants.intialObjectDependencyAssgmtNumber;
		},

		/**
		 * Gives back the proper description for the RoutingNode
		 * @param {String} sNodeType - type of the RoutingNode
		 * @param {String} sBillOfOperationsGroup - BillOfOperationsGroup property of RoutingNode
		 * @param {String} sBillOfOperationsSequence - BillOfOperationsSequence property of RoutingNode
		 * @param {String} sBillOfOperationsNode - BillOfOperationsNode property of RoutingNode
		 * @param {String} sBillOfOperationsOperation - Operation number (VORNR) for Operations/SubOperations
		 * @param {String} sDescription - Description property of RoutingNode
		 * @returns {String} Description of RoutingNode
		 */
		getDescription: function (sNodeType, sBillOfOperationsGroup, sBillOfOperationsSequence, sBillOfOperationsNode,
			sBillOfOperationsOperation, sDescription) {

			if (sDescription) {
				switch (sNodeType) {
					case Constants.routing.nodeType.operation:
					case Constants.routing.nodeType.subOperation:
					case Constants.routing.nodeType.refOperation:
					case Constants.routing.nodeType.refSubOperation:
						return i18n.getTextWithParameters("vchclf_structpnl_routing_tree_operation_with_number",
							[sBillOfOperationsOperation, sDescription]);
					case Constants.routing.nodeType.standardSequence:
					case Constants.routing.nodeType.parallelSequence:
					case Constants.routing.nodeType.alternativeSequence:
						return i18n.getTextWithParameters("vchclf_structpnl_format_text_id_description",
							[sDescription, sBillOfOperationsSequence]);
					default:
						return sDescription;
				}
			}

			switch (sNodeType) {
				case Constants.routing.nodeType.routingHeader:
					return i18n.getTextWithParameters("vchclf_structpnl_routing_tree_routing_header_desc",
						[sBillOfOperationsGroup]);
				case Constants.routing.nodeType.standardSequence:
					return i18n.getTextWithParameters("vchclf_structpnl_routing_tree_std_sequence_desc",
						[sBillOfOperationsSequence]);
				case Constants.routing.nodeType.parallelSequence:
					return i18n.getTextWithParameters("vchclf_structpnl_routing_tree_par_sequence_desc",
						[sBillOfOperationsSequence]);
				case Constants.routing.nodeType.alternativeSequence:
					return i18n.getTextWithParameters("vchclf_structpnl_routing_tree_alt_sequence_desc",
						[sBillOfOperationsSequence]);
				case Constants.routing.nodeType.operation:
				case Constants.routing.nodeType.subOperation:
				case Constants.routing.nodeType.refOperation:
				case Constants.routing.nodeType.refSubOperation:
					return i18n.getTextWithParameters("vchclf_structpnl_routing_tree_operation_with_number", [
						sBillOfOperationsOperation, sBillOfOperationsNode
					]);
				default:
					return "";
			}
		},

		/**
		 * Returns the Visiblity of the Navigation Button
		 * @param {String} sBOOSequenceBranchOperation - Forward navigation indicator
		 * @param {String} sBOOSequenceReturnOperation - Backward navigation indicator
		 * @returns {Boolean} visibility of the Navigation button
		 */
		checkRoutingNavigationVisibility: function (sBOOSequenceBranchOperation, sBOOSequenceReturnOperation) {
			if (sBOOSequenceBranchOperation || sBOOSequenceReturnOperation) {
				return true;
			} else {
				return false;
			}
		}
	};
});
