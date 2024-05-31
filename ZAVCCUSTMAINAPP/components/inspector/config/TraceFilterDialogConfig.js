/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
    "sap/i2d/lo/lib/zvchclfz/components/inspector/config/TraceFilterDialogConfigHelper",
    "sap/i2d/lo/lib/zvchclfz/components/inspector/config/TraceFilterTypes",
    "sap/i2d/lo/lib/zvchclfz/components/inspector/util/i18n"
    // eslint-disable-next-line max-statements
], function (Helper, TraceFilterTypes, i18n) {
    "use strict";

    /*
     * How to extend the TraceFilterDialogConfig? -> See at the bottom
     */

    var TRACE_LEVEL_PROPERTY = "TraceEntryLevel";
    var MESSAGE_TYPE_PROPERTY = "MessageType";
    var VALUE_ASSIGNMENT_BY_PROPERTY = "ValueAssignmentBy";
    var CSTIC_ID_PROPERTY = "CsticId";
    var OBJECT_DEPENDENCY_PROPERTY = "ObjectDependency";

    var oTraceLevelParameters = {
        All: "",
        Low: "L",
        High: "H"
    };

    var oMessageTypeParameters = {
        ValueAssignment: "VAL_ASSIGN",
        ValueRestriction: "VAL_RESTR",
        ValueSkipped: "VAL_SKIP",
        ValueRetraction: "VAL_RETRACT",
        BAdI: "BADI",
        InconsistencyDetected: "INCONS_DETECTED",
        ProcessingStarted: "PROC_STARTED",
        ProcessingSkipped: "PROC_SKIPPED",
        PricingFactor: "PRICING_FACTOR",
        CharacteristicFacet: "CSTIC_FACET",
        HighLevelCondition: "HL_CONDITION",
        LowLevelSelectionCondition: "LL_SEL_COND",
        LowLevelProcedureExecution: "LL_PROC_EXEC",
        ClassItemSubstitution: "CLASS_SUBSTIT"
    };

    var oValueAssignmentByParameters = {
        Default: "DEFAULT",
        Procedure: "PROC",
        Constraint: "CONSTR",
        User: "USER",
        Precondition: "PRECOND",
        ExtComponent: "EXT",
        TemplatePattern: "TEMPLATE"
    };

    var oFilterTypes = {
        Single: "single",
        Multi: "multi"
    };

    var oTraceLevelItems = {};

    oTraceLevelItems[oTraceLevelParameters.All] = {
        key: oTraceLevelParameters.All,
        text: ""
    };
    oTraceLevelItems[oTraceLevelParameters.Low] = {
        key: oTraceLevelParameters.Low,
        text: function () {
            return i18n.getText("vchclf_trace_filter_dialog_trace_level_low");
        }
    };
    oTraceLevelItems[oTraceLevelParameters.High] = {
        key: oTraceLevelParameters.High,
        text: function () {
            return i18n.getText("vchclf_trace_filter_dialog_trace_level_high");
        }
    };

    var oMessageTypeItems = {};

    oMessageTypeItems[oMessageTypeParameters.ValueAssignment] = {
        key: oMessageTypeParameters.ValueAssignment,
        text: function () {
            return i18n.getText("vchclf_trace_filter_dialog_message_types_value_assignment");
        },
        traceLevel: oTraceLevelParameters.High
    };
    oMessageTypeItems[oMessageTypeParameters.ValueRestriction] = {
        key: oMessageTypeParameters.ValueRestriction,
        text: function () {
            return i18n.getText("vchclf_trace_filter_dialog_message_types_value_restriction");
        },
        traceLevel: oTraceLevelParameters.High
    };
    oMessageTypeItems[oMessageTypeParameters.ValueSkipped] = {
        key: oMessageTypeParameters.ValueSkipped,
        text: function () {
            return i18n.getText("vchclf_trace_filter_dialog_message_types_value_skipped");
        },
        traceLevel: oTraceLevelParameters.High
    };
    oMessageTypeItems[oMessageTypeParameters.ValueRetraction] = {
        key: oMessageTypeParameters.ValueRetraction,
        text: function () {
            return i18n.getText("vchclf_trace_filter_dialog_message_types_value_retraction");
        },
        traceLevel: oTraceLevelParameters.High
    };
    oMessageTypeItems[oMessageTypeParameters.BAdI] = {
        key: oMessageTypeParameters.BAdI,
        text: function () {
            return i18n.getText("vchclf_trace_filter_dialog_message_types_badi");
        },
        traceLevel: oTraceLevelParameters.High
    };
    oMessageTypeItems[oMessageTypeParameters.InconsistencyDetected] = {
        key: oMessageTypeParameters.InconsistencyDetected,
        text: function () {
            return i18n.getText("vchclf_trace_filter_dialog_message_types_inconsistency_detected");
        },
        traceLevel: oTraceLevelParameters.High
    };
    oMessageTypeItems[oMessageTypeParameters.ProcessingStarted] = {
        key: oMessageTypeParameters.ProcessingStarted,
        text: function () {
            return i18n.getText("vchclf_trace_filter_dialog_message_types_processing_started");
        },
        traceLevel: oTraceLevelParameters.All
    };
    oMessageTypeItems[oMessageTypeParameters.ProcessingSkipped] = {
        key: oMessageTypeParameters.ProcessingSkipped,
        text: function () {
            return i18n.getText("vchclf_trace_filter_dialog_message_types_processing_skipped");
        },
        traceLevel: oTraceLevelParameters.All
    };
    oMessageTypeItems[oMessageTypeParameters.PricingFactor] = {
        key: oMessageTypeParameters.PricingFactor,
        text: function () {
            return i18n.getText("vchclf_trace_filter_dialog_message_types_pricing_factor");
        },
        traceLevel: oTraceLevelParameters.High
    };
    oMessageTypeItems[oMessageTypeParameters.CharacteristicFacet] = {
        key: oMessageTypeParameters.CharacteristicFacet,
        text: function () {
            return i18n.getText("vchclf_trace_filter_dialog_message_types_characteristic_facet");
        },
        traceLevel: oTraceLevelParameters.High
    };
    oMessageTypeItems[oMessageTypeParameters.HighLevelCondition] = {
        key: oMessageTypeParameters.HighLevelCondition,
        text: function () {
            return i18n.getText("vchclf_trace_filter_dialog_message_types_high_level_condition");
        },
        traceLevel: oTraceLevelParameters.High
    };
    oMessageTypeItems[oMessageTypeParameters.LowLevelSelectionCondition] = {
        key: oMessageTypeParameters.LowLevelSelectionCondition,
        text: function () {
            return i18n.getText("vchclf_trace_filter_dialog_message_types_low_level_selection_cond");
        },
        traceLevel: oTraceLevelParameters.Low
    };
    oMessageTypeItems[oMessageTypeParameters.LowLevelProcedureExecution] = {
        key: oMessageTypeParameters.LowLevelProcedureExecution,
        text: function () {
            return i18n.getText("vchclf_trace_filter_dialog_message_types_low_level_procedure_exec");
        },
        traceLevel: oTraceLevelParameters.Low
    };
    oMessageTypeItems[oMessageTypeParameters.ClassItemSubstitution] = {
        key: oMessageTypeParameters.ClassItemSubstitution,
        text: function () {
            return i18n.getText("vchclf_trace_filter_dialog_message_types_class_item_substitution");
        },
        traceLevel: oTraceLevelParameters.Low
    };

    var oValueAssignmentByItems = {};

    oValueAssignmentByItems[oValueAssignmentByParameters.User] = {
        key: oValueAssignmentByParameters.User,
        text: function () {
            return i18n.getText("vchclf_trace_filter_dialog_value_assignment_by_user");
        }
    };
    oValueAssignmentByItems[oValueAssignmentByParameters.Constraint] = {
        key: oValueAssignmentByParameters.Constraint,
        text: function () {
            return i18n.getText("vchclf_trace_filter_dialog_value_assignment_by_constraint");
        }
    };
    oValueAssignmentByItems[oValueAssignmentByParameters.Procedure] = {
        key: oValueAssignmentByParameters.Procedure,
        text: function () {
            return i18n.getText("vchclf_trace_filter_dialog_value_assignment_by_procedure");
        }
    };
    oValueAssignmentByItems[oValueAssignmentByParameters.Precondition] = {
        key: oValueAssignmentByParameters.Precondition,
        text: function () {
            return i18n.getText("vchclf_trace_filter_dialog_value_assignment_by_precondition");
        }
    };
    oValueAssignmentByItems[oValueAssignmentByParameters.Default] = {
        key: oValueAssignmentByParameters.Default,
        text: function () {
            return i18n.getText("vchclf_trace_filter_dialog_value_assignment_by_default");
        }
    };
    oValueAssignmentByItems[oValueAssignmentByParameters.ExtComponent] = {
        key: oValueAssignmentByParameters.ExtComponent,
        text: function () {
            return i18n.getText("vchclf_trace_filter_dialog_value_assignment_by_ext_component");
        }
    };
    oValueAssignmentByItems[oValueAssignmentByParameters.TemplatePattern] = {
        key: oValueAssignmentByParameters.TemplatePattern,
        text: function () {
            return i18n.getText("vchclf_trace_filter_dialog_value_assignment_by_template_pattern");
        }
    };

    var oSupportedTraceFilterTypes = {};

    oSupportedTraceFilterTypes[TraceFilterTypes.SupportedTraceFilterTypes.TraceLevel] = {
        property: TRACE_LEVEL_PROPERTY,
        convertFiltersToInternal: function (aExtFilters) {
            return Helper.convertSingleFilterToInternal(aExtFilters, this.property);
        },
        convertFiltersToExternal: function (sIntFilter) {
            return Helper.convertSingleFilterToExternal(sIntFilter, oTraceLevelItems, this.property);
        }
    };
    oSupportedTraceFilterTypes[TraceFilterTypes.SupportedTraceFilterTypes.MessageType] = {
        property: MESSAGE_TYPE_PROPERTY,
        convertFiltersToInternal: function (aExtFilters) {
            return Helper.convertMultiFilterToInternal(aExtFilters, this.property);
        },
        convertFiltersToExternal: function (aIntFilters) {
            return Helper.convertMultiFilterToExternal(aIntFilters, oMessageTypeItems, this.property);
        }
    };
    oSupportedTraceFilterTypes[TraceFilterTypes.SupportedTraceFilterTypes.ValueAssignmentBy] = {
        property: VALUE_ASSIGNMENT_BY_PROPERTY,
        convertFiltersToInternal: function (aExtFilters) {
            return Helper.convertMultiFilterToInternal(aExtFilters, this.property);
        },
        convertFiltersToExternal: function (aIntFilters) {
            return Helper.convertMultiFilterToExternal(aIntFilters, oValueAssignmentByItems, this.property);
        }
    };
    oSupportedTraceFilterTypes[TraceFilterTypes.SupportedTraceFilterTypes.Characteristic] = {
        property: CSTIC_ID_PROPERTY,
        convertFiltersToInternal: function (aExtFilters) {
            return Helper.convertVHFilterToInternal(aExtFilters, this.property);
        },
        convertFiltersToExternal: function (aIntFilters) {
            return Helper.convertVHFilterToExternal(aIntFilters, this.property);
        }
    };
    oSupportedTraceFilterTypes[TraceFilterTypes.SupportedTraceFilterTypes.ObjectDependency] = {
        property: OBJECT_DEPENDENCY_PROPERTY,
        convertFiltersToInternal: function (aExtFilters) {
            return Helper.convertVHFilterToInternal(aExtFilters, this.property);
        },
        convertFiltersToExternal: function (aIntFilters) {
            return Helper.convertVHFilterToExternal(aIntFilters, this.property);
        }
    };

    return {
        /** Possible filter types: single and multi value */
        FilterTypes: oFilterTypes,
        /** Subset of SupportedTraceFilterTypes of TraceFilterTypes which are supported by the dialog too */
        SupportedTraceFilterTypes: oSupportedTraceFilterTypes,
        /** Possible values of Trace Level */
        TraceLevelParameters: oTraceLevelParameters,
        /** Config objects of the available Trace Level items */
        TraceLevelItems: oTraceLevelItems,
        /** Possible values of Message Type */
        MessageTypeParameters: oMessageTypeParameters,
        /** Config objects of the available Message Type items */
        MessageTypeItems: oMessageTypeItems,
        /** Possible values of Value Assignment By */
        ValueAssignmentByParameters: oValueAssignmentByParameters,
        /** Config objects of the available Value Assignment By items */
        ValueAssignmentByItems: oValueAssignmentByItems,
        /** List of Value Assignment By related message types */
        ValueAssignmentByRelatedMessageTypes: [
            oMessageTypeParameters.ValueAssignment
        ]
    };

    /*
        I18N MODEL SHALL NOT BE USED DURING THE TIME OF COMPILING, BECAUSE THE MODEL DOES NOT EXIST YET

        1 - Add new entry to SupportedTraceFilterTypes

        TRACE FILTER DIALOG ONLY SUPPORTS FILTERING FOR OBJECTS WITH SINGLE KEY

        If the type exists under SupportedTraceFilterTypes of TraceFilterTypes, you can add it to the supported
        types by Trace Filter dialog too. First define the new property in the oSupportedTraceFilterTypes
        object and provide these parameters for it:
            - property: property of TraceEntry entity which should be filtered
            - convertFiltersToInternal: function which would convert the filters of DependencyTraceFilterManager
                to filters of the dialog
            - convertFiltersToExternal: function which would convert the filters of the dialog to filters of
                DependencyTraceFilterManager

        What shall be created for new properties with static values?
            - new object should be created with the possible values of the filter type (e.g. TraceLevelParameters)
                - if there is a default value which should not be added to the filters (e.g. All option of Trace Level),
                    the key of it should be empty string
            - new object should be created with the available items of the filter type and it should be assigned to the
                returning object too as a new entry (e.g. TraceLevelItems). The objects of the items shall include
                minimum these properties:
                    - key: reference to the value of the property in the previously created object
                    - text: i18n text of the description of the value
    */
});
