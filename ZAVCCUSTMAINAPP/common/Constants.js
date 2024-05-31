/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(function () {

	var Constants = {

		VCHCLF_BATCH_GROUP : "i2d_lo_lib_vchclf_batchgroup",
		VCHCLF_CHANGE_SET : "Changes",
		GROUP_CSTIC_COUNT_BATCH_GROUP : "groupCsticCountRequests",
		SIM_BATCH_GROUP : "trace-explode-bom",

		CLASSIFICATION_COMPONENT_MODEL_NAME : "component",
		CONFIGURATION_COMPONENT_MODEL_NAME : "component",
		LOCAL_CLASSIFICATION_MODEL_NAME : "localClassificationModel",
		FEATURE_TOGGLE_MODEL_NAME : "featureToggleModel",
		VCHCLF_MODEL_NAME : "vchclf",
		VIEW_MODEL_NAME : "view",
		HEADER_CONFIGURATION_MODEL_NAME : "headerConfiguration",
		CONFIGURATION_SETTINGS_MODEL_NAME : "configurationSettings",
		VALUATION_SETTINGS_MODEL_NAME : "valuationSettings",
		UI_STATE_MODEL_NAME : "uiState",
		VARIANTS_MODEL_NAME : "variants",
		VARIANTS_SETTINGS_MODEL_NAME : "variantsSettings",
		STATUS_CHANGED_DIALOG_MODEL_NAME : "statusChangedDialog",
		CLASSIFICATION : "Classification",
		CONFIGURATION : "Configuration",
		INCONSISTENCY_INFORMATION : {
			"MULTI_DOCU" : "MULTI",
			"SINGLE_DOCU" : "SINGLE",
			"NO_DOCU" : "NO_DOCU"
		},
		CONFIGURATION_STATUS_TYPE : {
			"RELEASED" : "1",
			"LOCKED" : "2",
			"INCOMPLETE" : "3",
			"INCONSISTENT" : "4"
		},
		SEM_OBJ_SALES_ORDER : "SalesOrder",
		SEM_OBJ_MATERIAL : "Material",

		ERR_DIALOG_ID : "configurationErrorDialog",
		ERR_DIALOG_CLOSE_BUTTON_ID : "configurationErrorDialog--closeButton",

		ETO_STATUS : {
			PROCESSING_STARTED : "IETST",
			READY_FOR_ENGINEERING : "IETRE",
			IN_PROCESS_BY_ENGINEERING : "IETPE",
			ENGINEERING_FINISHED : "IETFE",
			PROCESSING_FINISHED : "IETCO",
			REVIEW_FINISHED_BY_SALES: "IETRD",
			REVISED_BY_SALES: "IETRS",
			REENGINEERING_NEEDED: "IETHB"
		},
		
		DIFF_REF_TYPE: {
			CURRENT: "CURR",
			BEFORE_SWITCH_TO_ETO: "STE",
			BEFORE_HANDOVER_TO_ENGINEERING: "HTE",
			BEFORE_REVIEW_BY_SALES: "RBS",
			BEFORE_HANDOVER_BACK_TO_ENGINEERING: "HBE"
		},
		
		COMPARISON_DIFF_TYPE: {
			UNCHANGED: 0,
			ADDED: 1,
			REMOVED: 2,
			CHANGED: 3
		},
		
		COMPARISON_ITEM_DIFF_TYPE: {
			INSTANCE: 1,
			GROUP: 2,
			CSTIC: 3,
			VALUE: 4
		}

	};

	return Constants;
});
