/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([], function () {
	"use strict";

	return {
		initialObjectDependencyAssgmgNumber: "000000000000000000",
		initialBillOfOperationsNode: "00000000",
		initialObjectDependency: "0000000000",
		standardSequenceTreeId: "000000",
		defaultRoutingRootNodeId: "0_0",
		semanticObject: {
			variantConfiguration: "CCGVariantConfiguration"
		},
		BOMExplosionStates: {
			possible: "0",
			missingBOMApplication: "1",
			BOMNotFound: "2"
		},
		entitySets: {
			ConfigurationContext: "ConfigurationContextSet",
			BOMNode: "BOMNodeSet",
			Characteristic: "CharacteristicSet",
			CharacteristicValue: "CharacteristicValueSet",
			ObjectDependencyHeader: "ObjectDependencyHeaderSet",
			ObjectDependencyDetails: "ObjectDependencyDetailsSet",
			CharacteristicValueHelp: "C_VarConfignTraceCharcVH",
			DependencyValueHelp: "C_ConfignTraceObjectDpndcyVH",
			TraceCharacteristicVH: "TraceCharacteristicVH",
			ToggleSet: "ToggleSet",
			ConfigurationProfile: "ConfigurationProfileSet"
		},
		propertyNames: {
			ContextId: "ContextId",
			InstanceId: "InstanceId",
			GroupId: "GroupId",
			TraceGuid: "TraceGuid",
			RoundtripNo: "RoundtripNo",
			EntryNo: "EntryNo",
			ComponentId: "ComponentId",
			BOMComponentId: "BOMComponentId",
			BillOfOperationsType: "BillOfOperationsType",
			BillOfOperationsGroup: "BillOfOperationsGroup",
			BillOfOperationsVariant: "BillOfOperationsVariant",
			TreeId: "TreeId",
			NodeId: "NodeId",
			BOOOperationPRTInternalId: "BOOOperationPRTInternalId",
			BOOOperationPRTIntVersCounter: "BOOOperationPRTIntVersCounter",
			CsticId: "CsticId",
			ValueId: "ValueId",
			ObjectDependency: "ObjectDependency",
			ObjectDependencyId: "ObjectDependencyId",
			SubprocedureIndex: "SubprocedureIndex"
		},
		navigationProperties: {
			Common: {
				ObjectDependencyHeaders: "to_ObjectDependencyHeaders",
				Super: "to_Super"
			},
			ConfigurationContext: {
				BOMNode: "BOMNodes",
				TraceEntry: "to_TraceEntry",
				TraceCharacteristic: "to_TraceCharacteristic",
				TraceObjectDependency: "to_TraceObjectDependency",
				ConfigurationProfile: "to_ConfigurationProfile(Product='{product}',ConfigurationProfileNumber='{counter}')",
				TraceCharacteristicVH: "to_TraceCharacteristicVH",
				TraceObjectDependencyVH: "to_TraceObjectDependencyVH"
			},
			BOMNode: {
				Routings: "to_Routings",
				Header: "to_BOMHeader"
			},
			Characteristic: {
				CharacteristicDetail: "to_CharacteristicDetail"
			},
			CharacteristicValue: {
				CharacteristicValueDetail: "to_CharacteristicValueDetail"
			},
			ObjectDependencyHeader: {
				ObjectDependencyDetails: "to_ObjectDependencyDetails"
			},
			Routing: {
				RoutingNodes: "to_RoutingNodes"
			},
			RoutingNode: {
				OperationDetail: "to_OperationDetail",
				RoutingHeader: "to_RoutingHeader",
				Sequence: "to_Sequence",
				Components: "to_BOMNode",
				PRTs: "to_OperationPRT"
			},
			Operation: {
				StandardValues: "to_StandardValues"
			},
			TraceEntry: {
				InputTraceObjectDependencies: "to_InputTraceObjectDependencies",
				TraceBeforeCharacteristics: "to_TraceBeforeCharacteristics",
				TraceResultCharacteristics: "to_TraceResultCharacteristics",
				VariantTables: "to_VariantTables",
				ObjectDependencyCodes: "to_ObjectDependencyCodes",
				TracePricingFactor: "to_TracePricingFactor",
				ResultCharacteristicResults: "to_ResultCharacteristicResults",
				BeforeCharacteristicResults: "to_BeforeCharacteristicResults",
				ResultDependencyResults: "to_ResultDependencyResults",
				BeforeDependencyResults: "to_BeforeDependencyResults",
				TraceBAdI: "to_TraceBAdI"
			},
			TraceCharacteristic: {
				TraceCharacteristicValues: "to_TraceCharacteristicValues",
				WhereWasUsed: "to_WhereWasUsed",
				WhereWasValueSet: "to_WhereWasValueSet"
			},
			TraceObjectDependency: {
				WhereWasDepUsed: "to_WhereWasDepResUsed",
				WhereWasDepSet: "to_WhereWasDepResSet"
			},
			ObjectDependencyDetails: {
				ObjectDependencyCodes: "to_ObjectDependencyCodes"
			}
		},
		BOMItemProperties: {
			ItemCategory: {
				ClassItem: "K"
			},
			rootParentComponentId: "0"
		},
		functionImportMethod: {
			post: "POST"
		},
		functionImports: {
			activateTrace: {
				name: "ActivateTrace",
				method: "POST"
			},
			deactivateTrace: {
				name: "DeactivateTrace",
				method: "POST"
			},
			isTraceActive: {
				name: "IsTraceActive",
				method: "POST"
			},
			clearTrace: {
				name: "ClearTrace",
				method: "POST"
			},
			calculateAlternativeValues: {
				name: "CalculateAlternativeValues",
				method: "POST"
			}
		},
		traceFilterParameters: {
			ValueAssignmentBy: {
				Procedure: "2",
				Constraint: "3",
				User: "4",
				ExtComponent: "5",
				Default: "1"
			}
		},
		characteristicValue: {
			exclusionType: {
				Selectable: 0,
				Excluded: 1,
				PartiallyExcluded: 2
			},
			intervalType: {
				ExactValue: "1",
				RightExcludedInterval: "2",
				ClosedInterval: "3",
				ExcludedInterval: "4",
				LeftExcludedInterval: "5",
				AssignableExcludedInterval: "11"
			},
			valueDataType: {
				Integer: 1,
				Float: 2,
				String: 3
			}
		},
		inspectorView: {
			Inspector: "inspector",
			Comparison: "comparison",
			Trace: "trace"
		},
		inspectorTab: {
			Properties: "properties",
			Values: "values",
			Dependencies: "dependencies",
			Components: "components",
			PRTs: "prts",
			ObjectNotFound: "ObjectNotFound",
			Images: "images",
			Gradinghistory: "gradinghistory",
			Status: "status"
		},
		uiMode: {
			Create: "Create",
			Edit: "Edit",
			Display: "Display"
		},
		errorCode: {
			TraceSwitchedOff: "MC_LO_VCHCLF_VCH/035"
		}
	};
});
