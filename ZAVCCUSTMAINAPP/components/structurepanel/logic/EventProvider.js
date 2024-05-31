/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/base/ManagedObject"
], function (ManagedObject) {
	"use strict";

	/**
	 * EventProvider class for unifining events inside the component
	 * @public
	 * @class
	 */
	var EventProvider = ManagedObject.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.logic.EventProvider", {
		metadata: {
			events: {
				contextChanged: {
					parameters: {
						contextId: {
							type: "string"
						}
					}
				},

				refreshStructureTree: {},

				structureTreeRefreshed: {},

				expandAllNodesInStructureTree: {},

				collapseAllNodesInStructureTree: {},

				BOMViewSelectionChanged: {
					parameters: {
						selectedVariant: {
							type: "string"
						}
					}
				},

				routingViewSelectionChanged: {
					parameters: {
						selectedVariant: {
							type: "string"
						}
					}
				},

				resetStructurePanel: {},

				descriptionModeChanged: {},

				structureTreeColumnMoved: {
					parameters: {
						oldPos: {
							type: "object"
						},
						newPos: {
							type: "number"
						}
					}
				},

				structureTreeColumnFrozen: {
					parameters: {
						fixedColumnCount: {
							type: "string"
						}
					}
				},

				structureTreeColumnResized: {
					parameters: {
						columnKey: {
							type: "string"
						},
						width: {
							type: "string"
						}
					}
				},

				updateStructureTreeColumnBinding: {},

				redetermineStructureTreeColumnLayout: {},

				//-----ETO specific events starts
				openBOMItemDialogForInsertItem: {},
				openBOMItemDialogForChangeItem: {},
				deleteBOMItem: {},
				fixateBOMItem: {},
				navigateToBOMAppForInsertItem: {},
				navigateToBOMAppForChangeItem: {}
				//-----ETO specific events ends
			}
		}
	});

	return new EventProvider();
});
