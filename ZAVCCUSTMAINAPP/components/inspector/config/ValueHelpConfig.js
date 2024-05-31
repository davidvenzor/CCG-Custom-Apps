/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel"
], function (Constants, InspectorModel) {
	"use strict";

	var oCsticValueHelpConfig = {
		XMLFragmentId: "idCsticsValueHelpDialog",
		XMLFragmentPath: "sap/i2d/lo/lib/zvchclfz/components/inspector/fragment/CsticsValueHelpDialog",
		EntitySet: Constants.entitySets.TraceCharacteristicVH,
		KeyProperty: "CsticId",
		NameProperty: "CsticName",
		DescriptionProperty: "Description",
		IsContainedInConfignModelProperty: "CharcIsContainedInConfignModel",
		NameColumnLabel: "vchclf_trace_cstics_value_help_result_col_cstics",
		DescriptionColumnLabel: "vchclf_trace_cstics_value_help_result_col_csticsdesc",
		WarningMessage: "vchclf_trace_cstics_suggested_item_not_found",

		/**
		 * Returns the binding path of the TraceCharacteristicVH
		 * @returns {String} Binding Path
		 * @public
		 */
		getBindingPath: function () {
			return InspectorModel.getConfigurationContextPath() + "/" +
				Constants.navigationProperties.ConfigurationContext.TraceCharacteristicVH;
		}
	};

	var oDependencyValueHelpConfig = {
		XMLFragmentId: "idObjectDependencyValueHelpDialog",
		XMLFragmentPath: "sap/i2d/lo/lib/zvchclfz/components/inspector/fragment/DependencyValueHelpDialog",
		EntitySet: Constants.entitySets.DependencyValueHelp,
		KeyProperty: "ObjectDependency",
		NameProperty: "ObjectDependencyName",
		DescriptionProperty: "Description",
		IsContainedInConfignModelProperty: "DepIsContainedInConfignModel",
		NameColumnLabel: "vchclf_trace_objdep_value_help_result_col_objdep",
		DescriptionColumnLabel: "vchclf_trace_objdep_value_help_result_col_objdepdesc",
		WarningMessage: "vchclf_trace_objdep_suggested_item_not_found",

		/**
		 * Returns the binding path of the DependencyValueHelp
		 * @returns {String} Binding Path
		 * @public
		 */
		getBindingPath: function () {
			return InspectorModel.getConfigurationContextPath() + "/" +
				Constants.navigationProperties.ConfigurationContext.TraceObjectDependencyVH;
		}
	};

	/**
	 * Configurations for Value Help dialogs
	 * @protected
	 */
	return {
		CsticValueHelpConfig: oCsticValueHelpConfig,
		DependencyValueHelpConfig: oDependencyValueHelpConfig
	};
});
