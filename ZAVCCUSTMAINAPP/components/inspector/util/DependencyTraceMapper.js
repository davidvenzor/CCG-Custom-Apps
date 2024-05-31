/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
    "sap/i2d/lo/lib/zvchclfz/components/inspector/config/TraceFilterDialogConfig",
    "sap/i2d/lo/lib/zvchclfz/components/inspector/config/TraceFilterTypes",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (TraceFilterDialogConfig, TraceFilterTypes, Filter, FilterOperator) {
    "use strict";

    var MESSAGE_TYPE = TraceFilterTypes.SupportedTraceFilterTypes.MessageType;
    var MESSAGE_TYPE_PARAMETERS = TraceFilterDialogConfig.MessageTypeParameters;
    var MESSAGE_TYPE_PROPERTY = TraceFilterDialogConfig.SupportedTraceFilterTypes[MESSAGE_TYPE].property;

    var VALUE_ASSIGNMENT_BY = TraceFilterTypes.SupportedTraceFilterTypes.ValueAssignmentBy;
    var VALUE_ASSINGMENT_BY_PARAMETERS = TraceFilterDialogConfig.ValueAssignmentByParameters;
    var VALUE_ASSIGNMENT_BY_PROPERTY = TraceFilterDialogConfig.SupportedTraceFilterTypes[VALUE_ASSIGNMENT_BY].property;

    var MESSAGE_TYPE_ID_PROPERTY = "MessageTypeId";

    var MAP_MSG_TYPE_TO_MSG_TYPE_ID = {};

    MAP_MSG_TYPE_TO_MSG_TYPE_ID[MESSAGE_TYPE_PARAMETERS.ValueAssignment] = [
        "ASS_PATTERN",
        "BADI_VAL_ASSIGNMENT",
        "CALC_PENDING",
        "CALC_PENDING_H",
        "COND_ASS",
        "CONSTR_ASS",
        "EXT_ASS",
        "MACOND_SET",
        "PRECON_ASS",
        "PROC_APPLY_HARD_ASS",
        "PROC_APPLY_PNDG_HARD",
        "PROC_APPLY_PNDG_SOFT",
        "PROC_APPLY_SOFT_ASS",
        "RE_INSERT_RETRCTD",
        "REF_C_ASS",
        "STATIC_DEF_APPL",
        "USER_ASS"
    ];
    MAP_MSG_TYPE_TO_MSG_TYPE_ID[MESSAGE_TYPE_PARAMETERS.ValueRestriction] = [
        "BADI_VAL_RETRACTION",
        "COND_RESTR",
        "CONSTR_RESTR",
        "PRECON_RESTR",
        "RESTR_PATTERN",
        "PROC_APPLY_PNDG_EXCL",
        "PROC_RESTR"
    ];
    MAP_MSG_TYPE_TO_MSG_TYPE_ID[MESSAGE_TYPE_PARAMETERS.ValueSkipped] = [
        "ASS_SKIP_COND_FALSE",
        "ASS_SKIP_NOT_APPLCBL",
        "ASS_SKIP_RHS_NOT_ASS",
        "ASS_SKIP_SAME_VAL",
        "DEF_SKIP_RHS_NOT_ASS",
        "DEL_DEF_RHS_NOT_ASS",
        "DEL_DEF_VAL_NOT_ASS",
        "SKIP_DYN_DEF",
        "SKIP_STAT_DEF",
        "DEL_USR_VAL_NOT_ASS",
        "DEL_USR_RHS_NOT_ASS",
        "DEL_USR_NOT_NEEDED",
        "CONSTR_SKIP_NOMATCH",
        "DEL_VAL_VAL_NOT_ASS",
        "DEL_VAL_RHS_NOT_ASS",
        "DEL_VAL_NOT_NEEDED",
        "PRECON_VAL_SKIP_TRUE",
        "PRECON_VAL_SKIP_EXCL"
    ];
    MAP_MSG_TYPE_TO_MSG_TYPE_ID[MESSAGE_TYPE_PARAMETERS.ValueRetraction] = [
        "CST_RETR_DEF_CORRECT",
        "CST_RETR_DEL_DEF",
        "CST_RETR_INCONS",
        "CST_RETR_OVERWRITING",
        "CST_RETR_RECALC_PROC",
        "CST_RETR_DEL_USER",
        "VAL_RETR_DOM_WID",
        "CST_RETR_DEL_PROC",
        "CST_RETR_EXL_INCONS"
    ];
    MAP_MSG_TYPE_TO_MSG_TYPE_ID[MESSAGE_TYPE_PARAMETERS.BAdI] = [
        "BADI_CANNOT_BE_EXEC",
        "BADI_ERROR",
        "BADI_VAL_ASSIGNMENT",
        "BADI_VAL_RETRACTION"
    ];
    MAP_MSG_TYPE_TO_MSG_TYPE_ID[MESSAGE_TYPE_PARAMETERS.InconsistencyDetected] = [
        "ASS_TEMP_INCONS",
        "DEF_CORRECT_FAIL",
        "DEP_INCONS",
        "DEP_TEMP_INCONS",
        "INCONS_EXCL_ASS",
        "INCONS_EXCL_MAND",
        "INCONS_PATTERN",
        "INCONS_TMP_PATTERN",
        "PRECON_VAL_INCONS",
        "ROLL_BACK",
        "TRY_RESOLVE_INCON",
        "UNKNOWN_DEP_INCONS",
        "UNKWN_DEP_TMP_INCONS"
    ];
    MAP_MSG_TYPE_TO_MSG_TYPE_ID[MESSAGE_TYPE_PARAMETERS.ProcessingStarted] = [
        "CSFLAGS_PRCESS_INST",
        "IMMUT_ASS_EXEC_INST",
        "INST_PROC_START",
        "PROC_PRCESS_INST",
        "BOM_EXPLOSION_START",
        "RTG_EXPLSN_STARTED"
    ];
    MAP_MSG_TYPE_TO_MSG_TYPE_ID[MESSAGE_TYPE_PARAMETERS.ProcessingSkipped] = [
        "BOM_EXPLOSION_SKIPPD",
        "BOM_EXPL_SKIPPD_ETO",
        "BOM_DESELECTED",
        "ASS_SKIP_SAME_VAL",
        "ASS_SKIP_NOT_APPLCBL",
        "ASS_SKIP_COND_FALSE",
        "DEF_SKIP_RHS_NOT_ASS",
        "ASS_SKIP_RHS_NOT_ASS",
        "PROC_SKIPPED",
        "SKIP_STAT_DEF",
        "SKIP_DYN_DEF",
        "PRCNG_NO_SUCCESS_IA",
        "VAL_RETR_DOM_WID",
        "DEP_SKIP_UNKNWN_CST"
    ];
    MAP_MSG_TYPE_TO_MSG_TYPE_ID[MESSAGE_TYPE_PARAMETERS.PricingFactor] = [
        "CALC_PRICING_SUCCESS",
        "CLEARED_PRICING",
        "PRCNG_NO_SUCCESS_IA",
        "PRCNG_NO_SUCCESS_VC"
    ];
    MAP_MSG_TYPE_TO_MSG_TYPE_ID[MESSAGE_TYPE_PARAMETERS.CharacteristicFacet] = [
        "EXCLUDED_CSTIC",
        "MANDATORY_CSTIC",
        "NOT_EXCLUDED_CSTIC",
        "NOT_MANDATORY_CSTIC",
        "PRECON_VAL_HIDE",
        "STAT_MANDATORY_CST"
    ];
    MAP_MSG_TYPE_TO_MSG_TYPE_ID[MESSAGE_TYPE_PARAMETERS.HighLevelCondition] = [
        "CSTRCOND_FALSE",
        "CSTRCOND_TRUE",
        "DP_ANCH_EVAL_CST_A",
        "DP_ANCH_EVAL_CST_I",
        "DP_ANCH_EVAL_CSV_A",
        "DP_ANCH_EVAL_CSV_I",
        "PRECON_EVAL_FALSE",
        "PRECON_EVAL_TRUE",
        "PRECON_VAL_EVL_TRUE",
        "PRECON_VAL_EVL_FALSE",
        "SELCON_EVAL_FALSE",
        "SELCON_EVAL_TRUE",
        "SUBPROC_COND_FALSE",
        "SUBPROC_COND_TRUE"
    ];
    MAP_MSG_TYPE_TO_MSG_TYPE_ID[MESSAGE_TYPE_PARAMETERS.LowLevelSelectionCondition] = [
        "BOM_SC_FULFILLED",
        "BOM_SC_NOT_FULFILLED",
        "CNODE_SC_FULFILLED",
        "CNODE_SC_N_FULFILLED",
        "OP_SC_FULFILLED",
        "OP_SC_NOT_FULFILLED",
        "PRT_SC_FULFILLED",
        "PRT_SC_NOT_FULFILLED",
        "SEQ_SC_FULFILLED",
        "SEQ_SC_NOT_FULFILLED",
        "SUBOP_SC_FULFILLED",
        "SUBOP_SC_NO_FULFILLD"
    ];
    MAP_MSG_TYPE_TO_MSG_TYPE_ID[MESSAGE_TYPE_PARAMETERS.LowLevelProcedureExecution] = [
        "BOM_PROC_EXECUTED",
        "BOM_PROC_NO_EXECUTED",
        "CNODE_PROC_EXECUTED",
        "CNODE_PROC_N_EXCUTED",
        "OP_PROC_EXECUTED",
        "OP_PROC_NO_EXECUTED",
        "PRT_PROC_EXECUTED",
        "PRT_PROC_NO_EXECUTED",
        "SEQ_PROC_EXECUTED",
        "SEQ_PROC_NO_EXECUTED",
        "SUBOP_PROC_EXECUTED",
        "SUBOP_PROC_NO_EXCUTD"
    ];
    MAP_MSG_TYPE_TO_MSG_TYPE_ID[MESSAGE_TYPE_PARAMETERS.ClassItemSubstitution] = [
        "CNODE_SPECIALIZED",
        "CNODE_N_SPECIALIZED"
    ];

    var MAP_VAL_ASS_BY_TO_MSG_TYPE_ID = {};

    MAP_VAL_ASS_BY_TO_MSG_TYPE_ID[VALUE_ASSINGMENT_BY_PARAMETERS.Default] = [
        "STATIC_DEF_APPL"
    ];
    MAP_VAL_ASS_BY_TO_MSG_TYPE_ID[VALUE_ASSINGMENT_BY_PARAMETERS.Procedure] = [
        "CALC_PENDING",
        "CALC_PENDING_H",
        "PROC_APPLY_HARD_ASS",
        "PROC_APPLY_PNDG_HARD",
        "PROC_APPLY_PNDG_SOFT",
        "PROC_APPLY_SOFT_ASS",
        "RE_INSERT_RETRCTD"
    ];
    MAP_VAL_ASS_BY_TO_MSG_TYPE_ID[VALUE_ASSINGMENT_BY_PARAMETERS.Constraint] = [
        "COND_ASS",
        "CONSTR_ASS"
    ];
    MAP_VAL_ASS_BY_TO_MSG_TYPE_ID[VALUE_ASSINGMENT_BY_PARAMETERS.User] = [
        "USER_ASS"
    ];
    MAP_VAL_ASS_BY_TO_MSG_TYPE_ID[VALUE_ASSINGMENT_BY_PARAMETERS.Precondition] = [
        "PRECON_ASS"
    ];
    MAP_VAL_ASS_BY_TO_MSG_TYPE_ID[VALUE_ASSINGMENT_BY_PARAMETERS.ExtComponent] = [
        "EXT_ASS",
        "REF_C_ASS"
    ];
    MAP_VAL_ASS_BY_TO_MSG_TYPE_ID[VALUE_ASSINGMENT_BY_PARAMETERS.TemplatePattern] = [
        "ASS_PATTERN"
    ];

    /**
     * Mapper class for trace related functionalities
     * @constructor
     */
    var DependencyTraceMapper = function () {};

    /**
     * WORKAROUND: Maps the Message Type and Value Assignment By filter parameters to filter of MessageTypeId
     * The keys of the filters should be the keys of TraceFilterTypes.SupportedTraceFilterTypes
     * @param {Object} oFilters - Object of post process reletad filters
     * @returns {sap.ui.model.Filter} Array of filter objects
     * @public
     */
    DependencyTraceMapper.prototype.createMsgTypeIdFilters = function (oFilters) {
        var aMappedFilters = [];

        if (!oFilters[MESSAGE_TYPE]) {
            return null;
        }

        $.each(oFilters[MESSAGE_TYPE], function (iMsgTypeIndex, oMsgTypeFilter) {
            var sMessageType = oMsgTypeFilter.parameters[MESSAGE_TYPE_PROPERTY];

            if (TraceFilterDialogConfig.ValueAssignmentByRelatedMessageTypes.indexOf(sMessageType) === -1 ||
                !oFilters[VALUE_ASSIGNMENT_BY]) {

                $.each(MAP_MSG_TYPE_TO_MSG_TYPE_ID[sMessageType], function (iMsgTypeIdIndex, sMsgTypeId) {
                    aMappedFilters.push(new Filter(MESSAGE_TYPE_ID_PROPERTY, FilterOperator.EQ, sMsgTypeId));
                });
            } else {
                $.each(oFilters[VALUE_ASSIGNMENT_BY], function (iValAssByIndex, oValAssByFilter) {
                    var sValueAssignmentBy = oValAssByFilter.parameters[VALUE_ASSIGNMENT_BY_PROPERTY];

                    $.each(MAP_VAL_ASS_BY_TO_MSG_TYPE_ID[sValueAssignmentBy], function (iMsgTypeIdIndex, sMsgTypeId) {
                        if (MAP_MSG_TYPE_TO_MSG_TYPE_ID[sMessageType].indexOf(sMsgTypeId) !== -1) {
                            aMappedFilters.push(new Filter(MESSAGE_TYPE_ID_PROPERTY, FilterOperator.EQ, sMsgTypeId));
                        }
                    });
                });
            }
        });

        return new Filter({
            filters: aMappedFilters,
            and: false
        });
    };

    return new DependencyTraceMapper();
});
