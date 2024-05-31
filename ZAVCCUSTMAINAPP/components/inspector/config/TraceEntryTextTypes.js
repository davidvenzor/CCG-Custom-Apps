/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
/* eslint-disable require-jsdoc */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/TraceFilterTypes",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/UiConfig",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/ValuesFormatter",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/i18n",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/ODataModelHelper"
], function (TraceFilterTypes, UiConfig, ValuesFormatter, Constants, i18n, ODataModelHelper) {
	"use strict";

	var oIconType = {
		OpenDomain: "{CVC_OPEN}",
		ValueAssigned: "{CVC_ASSIGNED}",
		ValuePending: "{CVC_PENDING}",
		ValueRestricted: "{CVC_RESTRICTED}",
		ValueHidden: "{CVC_HIDDEN}"
	};

	var oTextType = {
		CharacteristicValue: "{CharacteristicValue}",
		EnDash: "{EN_DASH}",
		FactorValue: "{FactorValue}",
		VariantCondValue: "{VariantCondValue}"
	};

	var oSupportedObject = {
		BOMComponent: "{BOMComponent}",
		Characteristic: "{Characteristic}",
		CharacteristicValue: "{CharacteristicValue}",
		ObjectDependency: "{ObjectDependency}",
		ObjectDependencyResult: "{ObjectDependencyResult}",
		FactorValue: "{FactorValue}",
		VariantCondValue: "{VariantCondValue}"
	};

	var fnFilterText = function () {
		return i18n.getText("vchclf_trace_actionsheet_filter_trace");
	};

	var fnInspectText = function () {
		return i18n.getText("vchclf_trace_actionsheet_inspect_trace");
	};

	var fnWhereWasSetText = function () {
		return i18n.getText("vchclf_trace_actionsheet_where_was_set");
	};

	var fnWhereWasUsedText = function () {
		return i18n.getText("vchclf_trace_actionsheet_where_was_used");
	};

	var fnReturnEmptyObject = function () {
		return {};
	};


	/*
	 * How to add new TraceEntryTextTypes? -> See at the bottom
	 */
	return {
		SupportedObject: oSupportedObject,
		ValueClassifiers: {
			A: { // Value Assigned
				Indicator: oIconType.ValueAssigned,
				getDecoratedText: function (sCsticValueName) {
					return i18n.getTextWithParameters(
						"vchclf_insp_common_space_separated_items",
						[sCsticValueName, this.Indicator]
					);
				}
			},
			P: { // Value Pending
				Indicator: oIconType.ValuePending,
				getDecoratedText: function (sCsticValueName) {
					return i18n.getTextWithParameters(
						"vchclf_insp_common_space_separated_items",
						[sCsticValueName, this.Indicator]
					);
				}
			},
			R: { // Value Restricted
				Indicator: oIconType.ValueRestricted,
				getDecoratedText: function (sCsticValueName) {
					return i18n.getTextWithParameters(
						"vchclf_insp_common_space_separated_items",
						[sCsticValueName, this.Indicator]
					);
				}
			},
			E: { // Empty Domain
				Indicator: oTextType.EnDash,
				getDecoratedText: function (sCsticValueName) {
					return this.Indicator;
				}
			},
			O: { // Open Domain
				Indicator: oIconType.OpenDomain,
				getDecoratedText: function (sCsticValueName) {
					return this.Indicator;
				}
			},
		    H: { // Value Hidden
				Indicator: oIconType.ValueHidden,
				getDecoratedText: function (sCsticValueName) {
					return i18n.getTextWithParameters(
						"vchclf_insp_common_space_separated_items",
						[sCsticValueName, this.Indicator]
					);
				}
			},
			Default: { // Default behaviour
				Indicator: "",
				getDecoratedText: function (sCsticValueName) {
					return sCsticValueName;
				}
			}
		},
		IconTypes: {
			CVC_OPEN: {
				src: "sap-icon://overflow",
				getTooltip: function () {
					return i18n.getText("vchclf_trace_cstic_val_classifier_open_domain");
				}
			},
			CVC_ASSIGNED: {
				src: "sap-icon://accept",
				getTooltip: function () {
					return i18n.getText("vchclf_trace_cstic_val_classifier_value_assigned");
				}
			},
			CVC_PENDING: {
				src: "sap-icon://BusinessSuiteInAppSymbols/icon-hourglass",
				getTooltip: function () {
					return i18n.getText("vchclf_trace_cstic_val_classifier_value_pending");
				}
			},
			CVC_RESTRICTED: {
				src: "sap-icon://BusinessSuiteInAppSymbols/icon-marked-for-deletion",
				getTooltip: function () {
					return i18n.getText("vchclf_trace_cstic_val_classifier_value_restricted");
				}
			},
			CVC_HIDDEN: {
				src: "sap-icon://hide",
				getTooltip: function () {
					return i18n.getText("vchclf_trace_cstic_val_classifier_value_hidden");
				}
			}
		},
		TextTypes: {
			CharacteristicValue: {
				getText: function (oTraceEntry, bShowPreciseNumbers) {
					return ValuesFormatter.formatCharacteristicValue(oTraceEntry, bShowPreciseNumbers) ||
						this._getEmptyValuePlaceHolder();
				},
				_getEmptyValuePlaceHolder: function () {
					return "<span style=\"font-style: italic;\">" +
						i18n.getText("vchclf_trace_cstic_val_empty_placeholder") +
						"</span>";
				}
			},
			ValueSetBy: {
				getText: function (oTraceEntry) {
					var oValueSetBy = Constants.traceFilterParameters.ValueAssignmentBy;

					// Convert the ValueSetBy to string because of consistency w/ constants of TraceMessage entity
					switch (oTraceEntry.ValueSetBy.toString()) {
						case oValueSetBy.Default:
							return i18n.getText("vchclf_trace_entry_header_value_assignment_by_default");
						case oValueSetBy.Procedure:
							return i18n.getText("vchclf_trace_entry_header_value_assignment_by_procedure");
						case oValueSetBy.Constraint:
							return i18n.getText("vchclf_trace_entry_header_value_assignment_by_constraint");
						case oValueSetBy.User:
							return i18n.getText("vchclf_trace_entry_header_value_assignment_by_user");
						case oValueSetBy.ExtComponent:
							return i18n.getText("vchclf_trace_entry_header_value_assignment_by_ext_assignment");
						default:
							return "";
					}
				}
			},
			EN_DASH: {
				getText: function () {
					return "&ndash;";
				},
				getTooltip: function () {
					return i18n.getText("vchclf_trace_cstic_val_classifier_empty_domain");
				}
			},
			FactorValue: {
				getText: function (oTraceEntry, bShowPreciseNumbers) {
					return ValuesFormatter.formatCharacteristicValue(oTraceEntry, bShowPreciseNumbers);
				}
			},
			VariantCondValue: {
				getText: function (oTraceEntry) {
					return oTraceEntry.VariantConditionValue;
				}
			}
		},
		LinkTypes: {
			BOMComponent: {
				Name: "BOMComponent",
				FilterType: TraceFilterTypes.SupportedTraceFilterTypes.BOMComponent,
				InspectType: "BOMComponent",
				ActionSheetTexts: {
					headerText: function () {
						return i18n.getText("vchclf_trace_actionsheet_header_bomcomponent");
					},
					filterText: fnFilterText,
					inspectText: fnInspectText
				},
				getLinkText: function (oTraceEntry) {
					return oTraceEntry.BOMComponentName;
				},
				getFilterObject: function (oTraceEntry) {
					return {
						type: this.FilterType,
						text: this.getLinkText(oTraceEntry),
						parameters: {
							BOMComponentName: oTraceEntry.BOMComponentName
						}
					};
				},
				getInspectObject: function (oTraceEntry) {
					return {
						type: this.InspectType,
						navigationObjectType: UiConfig.inspectorMode.objectType.BOMComponent,
						inspectParameters: {
							BOMComponentId: oTraceEntry.BOMComponentId
						}
					};
				}
			},

			ClassItem: {
				Name: "ClassItem",
				FilterType: TraceFilterTypes.SupportedTraceFilterTypes.ClassItem,
				InspectType: "BOMComponent",
				ActionSheetTexts: {
					headerText: function () {
						return i18n.getText("vchclf_trace_actionsheet_header_bomcomponent");
					},
					filterText: fnFilterText,
					inspectText: fnInspectText
				},
				getLinkText: function (oTraceEntry) {
					return oTraceEntry.Class;
				},
				getFilterObject: function (oTraceEntry) {
					return {
						type: this.FilterType,
						text: this.getLinkText(oTraceEntry),
						parameters: {
							Class: oTraceEntry.Class
						}
					};
				},
				getInspectObject: function (oTraceEntry) {
					return {
						type: this.InspectType,
						navigationObjectType: UiConfig.inspectorMode.objectType.BOMComponent,
						inspectParameters: {
							BOMComponentId: oTraceEntry.BOMComponentId
						}
					};
				}
			},

			Characteristic: {
				Name: "Characteristic",
				FilterType: TraceFilterTypes.SupportedTraceFilterTypes.Characteristic,
				InspectType: "Characteristic",
				ActionSheetTexts: {
					headerText: function () {
						return i18n.getText("vchclf_trace_actionsheet_header_cstic");
					},
					filterText: fnFilterText,
					inspectText: fnInspectText,
					whereWasValueSetText: fnWhereWasSetText,
					whereWasCsticUsedText: fnWhereWasUsedText
				},
				getLinkText: function (oTraceEntry) {
					return oTraceEntry.CsticName;
				},
				getFilterObject: function (oTraceEntry) {
					return {
						type: this.FilterType,
						text: this.getLinkText(oTraceEntry),
						parameters: {
							CsticId: oTraceEntry.CsticId
						}
					};
				},
				getInspectObject: function (oTraceEntry) {
					return {
						type: this.InspectType,
						navigationObjectType: UiConfig.inspectorMode.objectType.Characteristic,
						inspectParameters: {
							CsticId: oTraceEntry.CsticId
						}
					};
				}
			},

			ObjectDependency: {
				Name: "ObjectDependency",
				FilterType: TraceFilterTypes.SupportedTraceFilterTypes.ObjectDependency,
				InspectType: "ObjectDependency",
				ActionSheetTexts: {
					headerText: function () {
						return i18n.getText("vchclf_trace_actionsheet_header_dependency");
					},
					filterText: fnFilterText,
					inspectText: fnInspectText
				},
				getLinkText: function (oTraceEntry) {
					if (!oTraceEntry.SubprocedureIndex) {
						return oTraceEntry.ObjectDependencyName;
					} else {
						return i18n.getTextWithParameters(
							"vchclf_trace_msg_link_parentheses_separator",
							[oTraceEntry.ObjectDependencyName, oTraceEntry.SubprocedureIndex]
						);
					}
				},
				getFilterObject: function (oTraceEntry) {
					return {
						type: this.FilterType,
						text: oTraceEntry.ObjectDependencyName,
						parameters: {
							ObjectDependency: oTraceEntry.ObjectDependency
						}
					};
				},
				getInspectObject: function (oTraceEntry) {
					return {
						type: this.InspectType,
						navigationObjectType: UiConfig.inspectorMode.objectType.ObjectDependency,
						inspectParameters: {
							ObjectDependency: oTraceEntry.ObjectDependency
						}
					};
				}
			},

			ObjectDependencyResult: {
				Name: "ObjectDependencyResult",
				FilterType: TraceFilterTypes.SupportedTraceFilterTypes.ObjectDependency,
				InspectType: "ObjectDependency",
				ActionSheetTexts: {
					headerText: function () {
						return i18n.getText("vchclf_trace_actionsheet_header_dependency");
					},
					filterText: fnFilterText,
					inspectText: fnInspectText,
					whereWasDepSetText: fnWhereWasSetText,
					whereWasDepUsedText: fnWhereWasUsedText
				},
				getLinkText: function (oTraceEntry) {
					if (!oTraceEntry.SubprocedureIndex) {
						return oTraceEntry.ObjectDependencyName;
					} else {
						return i18n.getTextWithParameters(
							"vchclf_trace_msg_link_parentheses_separator",
							[oTraceEntry.ObjectDependencyName, oTraceEntry.SubprocedureIndex]
						);
					}
				},
				getFilterObject: function (oTraceEntry) {
					return {
						type: this.FilterType,
						text: oTraceEntry.ObjectDependencyName,
						parameters: {
							ObjectDependency: oTraceEntry.ObjectDependency
						}
					};
				},
				getInspectObject: function (oTraceEntry) {
					return {
						type: this.InspectType,
						navigationObjectType: UiConfig.inspectorMode.objectType.ObjectDependency,
						inspectParameters: {
							ObjectDependency: oTraceEntry.ObjectDependency
						}
					};
				}
			},

			Routing: {
				Name: "Routing",
				InspectType: "Routing",
				ActionSheetTexts: {
					headerText: function () {
						return i18n.getText("vchclf_trace_actionsheet_header_routing");
					},
					inspectText: fnInspectText
				},
				getLinkText: function (oTraceEntry) {
					return i18n.getTextWithParameters(
						"vchclf_trace_entry_header_routing",
						[
							oTraceEntry.RoutingText,
							oTraceEntry.BillOfOperationsGroup,
							oTraceEntry.BillOfOperationsVariant
						]
					);
				},
				getInspectObject: function (oTraceEntry) {
					return {
						type: this.InspectType,
						navigationObjectType: UiConfig.inspectorMode.objectType.RoutingHeader,
						inspectParameters: {
							BOMComponentId: oTraceEntry.BOMComponentId,
							BillOfOperationsType: oTraceEntry.BillOfOperationsType,
							BillOfOperationsGroup: oTraceEntry.BillOfOperationsGroup,
							BillOfOperationsVariant: oTraceEntry.BillOfOperationsVariant
						}
					};
				}
			},

			Operation: {
				Name: "Operation",
				FilterType: TraceFilterTypes.SupportedTraceFilterTypes.Operation,
				InspectType: "Operation",
				ActionSheetTexts: {
					headerText: function () {
						return i18n.getText("vchclf_trace_actionsheet_header_operation");
					},
					filterText: fnFilterText,
					inspectText: fnInspectText
				},
				getLinkText: function (oTraceEntry) {
					return i18n.getTextWithParameters(
						"vchclf_trace_msg_link_space_separator",
						[oTraceEntry.BillOfOperationsOperation, oTraceEntry.OperationText]
					);
				},
				getFilterObject: function (oTraceEntry) {
					return {
						type: this.FilterType,
						text: this.getLinkText(oTraceEntry),
						parameters: {
							BillOfOperationsType: oTraceEntry.BillOfOperationsType,
							BillOfOperationsGroup: oTraceEntry.BillOfOperationsGroup,
							BillOfOperationsNode: oTraceEntry.BillOfOperationsNode
						}
					};
				},
				getInspectObject: function (oTraceEntry) {
					var sNavigationObjectType;

					if (oTraceEntry.NodeType === "O") {
						sNavigationObjectType = UiConfig.inspectorMode.objectType.Operation;
					} else if (oTraceEntry.NodeType === "S") {
						sNavigationObjectType = UiConfig.inspectorMode.objectType.SubOperation;
					}

					return {
						type: this.InspectType,
						navigationObjectType: sNavigationObjectType,
						inspectParameters: {
							TreeId: oTraceEntry.TreeId,
							NodeId: oTraceEntry.NodeId,
							BOMComponentId: oTraceEntry.BOMComponentId,
							BillOfOperationsType: oTraceEntry.BillOfOperationsType,
							BillOfOperationsGroup: oTraceEntry.BillOfOperationsGroup,
							BillOfOperationsVariant: oTraceEntry.BillOfOperationsVariant
						}
					};
				}
			},

			Sequence: {
				Name: "Sequence",
				FilterType: TraceFilterTypes.SupportedTraceFilterTypes.Sequence,
				InspectType: "Sequence",
				ActionSheetTexts: {
					headerText: function () {
						return i18n.getText("vchclf_trace_actionsheet_header_sequence");
					},
					filterText: fnFilterText,
					inspectText: fnInspectText
				},
				getLinkText: function (oTraceEntry) {
					return i18n.getTextWithParameters(
						"vchclf_trace_msg_link_parentheses_separator",
						[oTraceEntry.SequenceText, oTraceEntry.BillOfOperationsSequence]
					);
				},
				getFilterObject: function (oTraceEntry) {
					return {
						type: this.FilterType,
						text: this.getLinkText(oTraceEntry),
						parameters: {
							BillOfOperationsType: oTraceEntry.BillOfOperationsType,
							BillOfOperationsGroup: oTraceEntry.BillOfOperationsGroup,
							BillOfOperationsVariant: oTraceEntry.BillOfOperationsVariant,
							BillOfOperationsSequence: oTraceEntry.BillOfOperationsSequence
						}
					};
				},
				getInspectObject: function (oTraceEntry) {
					var sNavigationObjectType;

					if (oTraceEntry.NodeType === "Q") {
						sNavigationObjectType = UiConfig.inspectorMode.objectType.RoutingHeader;
					} else if (oTraceEntry.NodeType === "A") {
						sNavigationObjectType = UiConfig.inspectorMode.objectType.AlternativeSequence;
					} else if (oTraceEntry.NodeType === "P") {
						sNavigationObjectType = UiConfig.inspectorMode.objectType.ParallelSequence;
					}

					return {
						type: this.InspectType,
						navigationObjectType: sNavigationObjectType,
						inspectParameters: {
							TreeId: oTraceEntry.TreeId,
							NodeId: oTraceEntry.NodeId,
							BOMComponentId: oTraceEntry.BOMComponentId,
							BillOfOperationsType: oTraceEntry.BillOfOperationsType,
							BillOfOperationsGroup: oTraceEntry.BillOfOperationsGroup,
							BillOfOperationsVariant: oTraceEntry.BillOfOperationsVariant
						}
					};
				}
			},

			PRT: {
				Name: "PRT",
				FilterType: TraceFilterTypes.SupportedTraceFilterTypes.PRT,
				InspectType: "PRT",
				ActionSheetTexts: {
					headerText: function () {
						return i18n.getText("vchclf_trace_actionsheet_header_prt");
					},
					filterText: fnFilterText,
					inspectText: fnInspectText
				},
				getLinkText: function (oTraceEntry) {
					return oTraceEntry.ProductionResourceTool ?
						oTraceEntry.ProductionResourceTool :
						oTraceEntry.BOOOperationPRTInternalId;
				},
				getFilterObject: function (oTraceEntry) {
					return {
						type: this.FilterType,
						text: this.getLinkText(oTraceEntry),
						parameters: {
							BillOfOperationsType: oTraceEntry.BillOfOperationsType,
							BillOfOperationsGroup: oTraceEntry.BillOfOperationsGroup,
							BOOOperationPRTInternalId: oTraceEntry.BOOOperationPRTInternalId
						}
					};
				},
				getInspectObject: function (oTraceEntry) {
					return {
						type: this.InspectType,
						navigationObjectType: UiConfig.inspectorMode.objectType.PRT,
						inspectParameters: {
							TreeId: oTraceEntry.TreeId,
							NodeId: oTraceEntry.NodeId,
							BOMComponentId: oTraceEntry.BOMComponentId,
							BillOfOperationsType: oTraceEntry.BillOfOperationsType,
							BillOfOperationsGroup: oTraceEntry.BillOfOperationsGroup,
							BillOfOperationsVariant: oTraceEntry.BillOfOperationsVariant,
							BOOOperationPRTInternalId: oTraceEntry.BOOOperationPRTInternalId,
							BOOInternalVersionCounter: oTraceEntry.BOOInternalVersionCounter
						}
					};
				}
			}
		},

		InspectTypes: {
			Characteristic: {
				ObjectType: UiConfig.inspectorMode.objectType.Characteristic,
				getBinding: function (oInspectParameters, sContextId, sInstanceId, sGroupId) {
					return {
						getPath: function () {
							return ODataModelHelper.generateCharacteristicPath(
								sContextId,
								sInstanceId,
								sGroupId,
								oInspectParameters.CsticId
							);
						},
						getKeyValuePairs: function () {
							return ODataModelHelper.getCharacteristicKeyValuePairs(
								sContextId,
								sInstanceId,
								sGroupId,
								oInspectParameters.CsticId
							);
						}
					};
				}
			},
			BOMComponent: {
				ObjectType: UiConfig.inspectorMode.objectType.BOMComponent,
				getBinding: function (oInspectParameters, sContextId, sInstanceId, sGroupId) {
					return {
						getPath: function () {
							return ODataModelHelper.generateBOMComponentPath(
								sContextId,
								oInspectParameters.BOMComponentId
							);
						},
						getKeyValuePairs: fnReturnEmptyObject
					};
				}
			},
			ObjectDependency: {
				ObjectType: UiConfig.inspectorMode.objectType.ObjectDependency,
				getBinding: function (oInspectParameters, sContextId, sInstanceId, sGroupId) {
					return {
						getPath: function () {
							return ODataModelHelper.generateObjectDependencyPath(
								sContextId,
								oInspectParameters.ObjectDependency
							);
						},
						getKeyValuePairs: fnReturnEmptyObject
					};
				}
			},
			Routing: {
				ObjectType: UiConfig.inspectorMode.objectType.RoutingHeader,
				getBinding: function (oInspectParameters, sContextId, sInstanceId, sGroupId) {
					return {
						getPath: function () {
							return ODataModelHelper.generateRoutingNodePath(
								sContextId,
								oInspectParameters.BOMComponentId, {
									BillOfOperationsType: oInspectParameters.BillOfOperationsType,
									BillOfOperationsGroup: oInspectParameters.BillOfOperationsGroup,
									BillOfOperationsVariant: oInspectParameters.BillOfOperationsVariant
								},
								Constants.standardSequenceTreeId,
								Constants.defaultRoutingRootNodeId
							);
						},
						getKeyValuePairs: fnReturnEmptyObject
					};
				}
			},
			Operation: {
				ObjectType: UiConfig.inspectorMode.objectType.Operation,
				getBinding: function (oInspectParameters, sContextId, sInstanceId, sGroupId) {
					return {
						getPath: function () {
							return ODataModelHelper.generateRoutingNodePath(
								sContextId,
								oInspectParameters.BOMComponentId, {
									BillOfOperationsType: oInspectParameters.BillOfOperationsType,
									BillOfOperationsGroup: oInspectParameters.BillOfOperationsGroup,
									BillOfOperationsVariant: oInspectParameters.BillOfOperationsVariant
								},
								oInspectParameters.TreeId,
								oInspectParameters.NodeId
							);
						},
						getKeyValuePairs: fnReturnEmptyObject
					};

				}
			},
			Sequence: {
				ObjectType: UiConfig.inspectorMode.objectType.RoutingHeader,
				getBinding: function (oInspectParameters, sContextId, sInstanceId, sGroupId) {
					return {
						getPath: function () {
							return ODataModelHelper.generateRoutingNodePath(
								sContextId,
								oInspectParameters.BOMComponentId, {
									BillOfOperationsType: oInspectParameters.BillOfOperationsType,
									BillOfOperationsGroup: oInspectParameters.BillOfOperationsGroup,
									BillOfOperationsVariant: oInspectParameters.BillOfOperationsVariant
								},
								oInspectParameters.TreeId,
								oInspectParameters.NodeId
							);
						},
						getKeyValuePairs: fnReturnEmptyObject
					};
				}
			},
			PRT: {
				ObjectType: UiConfig.inspectorMode.objectType.PRT,
				getBinding: function (oInspectParameters, sContextId, sInstanceId, sGroupId) {
					return {
						getPath: function () {
							return ODataModelHelper.generateRoutingPRTPath(
								sContextId,
								oInspectParameters.BOMComponentId, {
									BillOfOperationsType: oInspectParameters.BillOfOperationsType,
									BillOfOperationsGroup: oInspectParameters.BillOfOperationsGroup,
									BillOfOperationsVariant: oInspectParameters.BillOfOperationsVariant
								},
								oInspectParameters.TreeId,
								oInspectParameters.NodeId, {
									BOOOperationPRTInternalId: oInspectParameters.BOOOperationPRTInternalId,
									BOOOperationPRTIntVersCounter: oInspectParameters.BOOOperationPRTIntVersCounter
								}
							);
						},
						getKeyValuePairs: fnReturnEmptyObject
					};
				}
			}
		}
	};
});

/*
	1 - Add new entry to LinkTypes

	NewTypeName: {
		Name:							// Same as name of the Root
		FilterType: 					// See below for FilterTypes
		InspectType:					// See below for InspectTypes
		ActionSheetTexts: {
			filterText: function(oTraceEntry) {
				return ""; 				// Text used for action sheet Filter text
			},
			inspectText: function(oTraceEntry) {
				return ""; 				// Text used for action sheet Inspect text
			},
			whereWasValueSetText: function(oTraceEntry) {
				return ""; 				// Text used for action sheet whereWasValueSet text (where applicable)
			},
			whereWasCsticUsedText: function(oTraceEntry) {
				return ""; 				// Text used for action sheet whereWasCsticUsed text (where applicable)
			}
		},
		getLinkText: function (oTraceEntry) {
			return "";					// return the text to show in the generated link
		},
		getFilterObject: function (oTraceEntry) {
			return {
				type:					// FilterType
				text:					// Name of the object which should be displayed in the OverflowToolbar
				parameters:				// object of property - key pairs
			};
		},
		getInspectObject: function (oTraceEntry) {
			return {
				type:					// InspectType
				inspectParameters: { }	// Parameters for Inspecting
			};
		}
	}

	2 - Add new entry to FilterTypes (if needed)

	You can use the SupportedTraceFilterTypes of TraceFilterTypes. If you need a new one, first extend that config file.

	3 - Add new entry to InspectTypes (if needed)
	NewInspectType: {
		ObjectType: 					// Object Type from ./UiConfig.inspectorMode.objectType
		getBinding: function (oInspectParameters, sContextId, sInstanceId, sGroupId) {
			return {
				getPath: function() {
					return "";// Navigation path to the object
				},
				getKeyValuePairs: function(){
					return { };	// Optional Parameters for Inspection only used in the Values Tab
				}
			};
		}
	}
*/
