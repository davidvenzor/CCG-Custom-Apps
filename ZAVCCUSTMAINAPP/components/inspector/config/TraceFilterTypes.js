/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([], function () {
	"use strict";

	/*
	 * How to add new TraceFilterTypes? -> See at the bottom
	 */

	var oSupportedTraceFilterTypes = {
		TraceLevel: "TraceLevel",
		MessageType: "MessageType",
		ValueAssignmentBy: "ValueAssignmentBy",
		BOMComponent: "BOMComponent",
		ClassItem: "ClassItem",
		Characteristic: "Characteristic",
		ObjectDependency: "ObjectDependency",
		Operation: "Operation",
		Sequence: "Sequence",
		PRT: "PRT",
		ViewRelevance: "ViewRelevance"
	};

	var oFilterPropetyI18ns = {};

	oFilterPropetyI18ns[oSupportedTraceFilterTypes.BOMComponent] = {
		single: "vchclf_trace_filter_bomcomponent"
	};
	oFilterPropetyI18ns[oSupportedTraceFilterTypes.ClassItem] = {
		single: "vchclf_trace_filter_classitem"
	};
	oFilterPropetyI18ns[oSupportedTraceFilterTypes.Characteristic] = {
		single: "vchclf_trace_filter_cstic",
		multi: "vchclf_trace_filter_cstic_multi"
	};
	oFilterPropetyI18ns[oSupportedTraceFilterTypes.ObjectDependency] = {
		single: "vchclf_trace_filter_dependency",
		multi: "vchclf_trace_filter_dependency_multi"
	};
	oFilterPropetyI18ns[oSupportedTraceFilterTypes.Operation] = {
		single: "vchclf_trace_filter_operation"
	};
	oFilterPropetyI18ns[oSupportedTraceFilterTypes.Sequence] = {
		single: "vchclf_trace_filter_sequence"
	};
	oFilterPropetyI18ns[oSupportedTraceFilterTypes.PRT] = {
		single: "vchclf_trace_filter_prt"
	};

	return {
		/** Trace Filter Types which are supported by filtering */
		SupportedTraceFilterTypes: oSupportedTraceFilterTypes,
		/** i18n texts for the single and multi value format of properties */
		FilterPropertyI18ns: oFilterPropetyI18ns
	};

	/*
	    1 - Add new entry to SupportedTraceFilterTypes

	    Extend the oSupportedTraceFilterTypes variable with the new support filter type and assign an ID for it.
	    After this, extend the oFilterTypeI18ns object with the ID of the i18n text (if the text should not be only the
	    name of the object) for the single and multi (if multi is supported) value format of the new filter.
	*/
});
