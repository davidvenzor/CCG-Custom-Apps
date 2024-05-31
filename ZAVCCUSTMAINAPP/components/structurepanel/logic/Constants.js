/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([], function () {
	"use strict";

	return {
		semanticObject: {
			variantConfiguration: "CCGVariantConfiguration"
		},
		standardSequenceTreeId: "000000",
		defaultRoutingRootNodeId: "0_0",
		bomChangeSetId: "vch-bom-changeset",
		orderBomChangeSetId: "vch-obom-changeset",
		orderBomExplodeChangeSetId: "vch-obom-explode-changeset",
		routingChangeSetId: "vch-routing-changeset",
		intialObjectDependencyAssgmtNumber: "000000000000000000",
		filterProperty: {
			product: "Product"
		},
		itemCategory: {
			classNode: "K"
		},
		drillDownState: {
			leaf: "leaf",
			expanded: "expanded"
		},
		httpMethod: {
			post: "POST"
		},
		functionImport: {
			ExplodeBOM: "ExplodeBOM",
			ExplodeRouting: "ExplodeRouting"
		},
		entitySet: {
			BOMNodeSet: "BOMNodeSet",
			ConfigurationContextSet: "ConfigurationContextSet",
			ConfigurationInstanceSet: "ConfigurationInstanceSet",
			OperationSet: "OperationSet",
			ToggleSet: "ToggleSet"
		},
		navigationProperty: {
			BOMNodes: "BOMNodes",
			Routings: "to_Routings",
			RoutingNodes: "to_RoutingNodes",
			ConfigurationInstance: {
				name: "to_ConfigurationInstance",
				keys: {
					contextId: "ContextId",
					instanceId: "InstanceId"
				}
			},
			BOMNodeHeader: "to_BOMHeader"
		},
		BOMExplosionNotAssigned: "2",
		explosion: {
			possible: "0",
			error: {
				"1": "vchclf_structpnl_expl_appl_missing",
				"2": "vchclf_structpnl_expl_bom_not_assgnd"
			}
		},
		routing: {
			nodeType: {
				routingHeader: "H",
				standardSequence: "Q",
				parallelSequence: "P",
				alternativeSequence: "A",
				operation: "O",
				subOperation: "S",
				refOperation: "R",
				refSubOperation: "T"
			}
		},
		controller: {
			routingFrame: "sap.i2d.lo.lib.zvchclfz.components.structurepanel.controller.RoutingFrame",
			structureFrame: "sap.i2d.lo.lib.zvchclfz.components.structurepanel.controller.StructureFrame"
		},
		view: {
			routingTree: "sap.i2d.lo.lib.zvchclfz.components.structurepanel.view.RoutingTree"
		},
		treeTable: {
			columns: {
				id: {
					routing: "idRoutingColumn",
					objectDependency: "idDependenciesColumn",
					referenceCharacteristic: "idReferenceCharsColumn",
					product: "idProductColumn"
				}
			}
		},
		routingPageType: {
			base: "RoutingBasePage",
			subPage: "RoutingSubPage"
		},
		routingTree: {
			nullDepth: 0
		},
		configurationInstance : {
			validationStatus : {
				ValidatedAndReleased : "1",
				ValidatedAndIncomplete : "2",
				NotValidate: "3",
				InconsistencyDetected : "4",
				Excluded : "5",
				ProcessedButUnknown : "6"
			}
		},
		configurationStatus : {
			Released : "1",
			Locked : "2",
			Incomplete: "3",
			Inconsistent : "4"
		},
		uiMode : {
			Create: "Create",
			Edit: "Edit",
			Display: "Display"
		},
		BOMItemProperties: {
			rootParentComponentId : "0"
		},
		FixateState: {
			FIXATE_NOT_ALLOWED: "A",
			FIXATE_ALLOWED: "B",
			ITEM_FIXED: "C"
		},
		FixedBOMItemCategory: {
			MPE_STOCK_ITEM: "K",
			PM_STRUCTURE_ELEMENT: "I",
			TEXT_ITEM: "T",
			DOCUMENT_ITEM: "D",
			CLASS_ITEM: "K",
			INTRA_MATERIAL: "M",
			VARIABLE_SIZE_ITEM: "R",
			STOCK_ITEM: "L",
			NON_STOCK_ITEM: "N",
			COMPATIBLE_UNIT: "V"
		},
		FixOrderBOMMode: {
			FIXATE : "1",
			FIXATE_TOPDOWN: "2"
		},
		BOMItemDialogModel: "BOMItemDialog",
		BOMItemDialogVHModel: "BOMItemDialogVH",
		SelectedBOMItem: "SelectedBOMItem",
		ODataModelName: "vchclf",
		BOMItemVHDialogModelName: "BOMItemVHDialogConfig",
		BOMItemActionFunctionCall: {
			deleteBOMItem: "DeleteBOMItem",
			createOrderBOM: "CreateOrderBOM"
		},
		BlankDraftUUID: "00000000-0000-0000-0000-000000000000",
		BlankBillOfMaterialId: "00000000",
		BusinessExceptions: {
			BOM_EXPLOSION_ERROR: "bom_explosion_err"
		}
	};
});
