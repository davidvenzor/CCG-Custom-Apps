/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/StructurePanelModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/NavigationManager",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/formatter/RoutingFrameFormatter",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/RoutingUtil",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/ODataModelHelper"
], function (Controller, StructurePanelModel, NavigationManager, Formatters, RoutingUtil, ODataModelHelper) {
	"use strict";

	return Controller.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.controller.RoutingFrame", {

		/**
		 * Formatters for the view
		 * @type {sap.i2d.lo.lib.vchclf.components.structurepanel.formatter.RoutingFrameFormatter}
		 * @private
		 */
		_formatters: Formatters,

		/**
		 * Called by UI5 runtime. Constructor.
		 * @public
		 */
		onInit: function () {
			this.getView().setModel(StructurePanelModel.getModel(), "ui");
			NavigationManager.setRoutingTreeContainer(this.byId("idRoutingTreeNavContainer"));
		},
		/**
		 * Called by UI5 runtime. Destructor.
		 * @private
		 */
		onExit: function () {
			NavigationManager.resetRoutingFrame();
		},

		/**
		 * Called by Navigation Manager
		 * @param {String} sCallerBindingPath - Binding Path
		 * @param {Object} oRoutingKey - Object of Routing Key
		 * @param {Object} oBOMNode - Object of the BOMNode entity
		 * @param {sap.i2d.lo.lib.vchclf.components.structurepanel.model.RoutingTreeModel} oRoutingTreeModel
		 * 		- Created instance of RoutingTreeModel
		 * @public
		 */
		onAfterNavigationTo: function (sCallerBindingPath, oRoutingKey, oBOMNode, oRoutingTreeModel) {
			StructurePanelModel.setRoutingFrameCaller(sCallerBindingPath, oRoutingKey, oBOMNode);
			NavigationManager.resetRoutingFrame();
			NavigationManager.addBaseRoutingTreePage(oRoutingTreeModel);
		},

		/**
		 * Event handler for navigate back to the previous page
		 * @public
		 */
		onBackPressed: function () {
			NavigationManager.navigateBack();
		},

		/**
		 * Triggers an event to update the Routing Tree
		 * @private
		 */
		onRoutingTreeRefresh: function () {
			NavigationManager.reexplodeRouting();
		},

		/**
		 * Event handler for the X button at the top-right corner of the panel
		 * @private
		 */
		onClosePanelPressed: function () {
			this.getOwnerComponent().fireClosePanelPressed();
		},

		/**
		 * Event handler for the Show Super Routing button
		 * @private
		 */
		onShowSuperRoutingChanged: function () {
			NavigationManager.reloadRouting();
		},

		/**
		 * Event handler for routing selection
		 * @param {Object} oEvent - UI5 event object
		 * @public
		 */
		onRoutingSelectionChanged: function (oEvent) {
			var oRouting = oEvent.getParameter("selectedItem").getBindingContext("ui").getObject();
			var oBOMNode = StructurePanelModel.getRoutingFrameCallerBOMNode();
			var sBOMNodePath = ODataModelHelper.generateBOMNodePath(
				StructurePanelModel.getConfigurationContextId(), oBOMNode.ComponentId);
			var sRoutingPath = ODataModelHelper.extendTheBOMNodePathWithRoutingKey(sBOMNodePath, oRouting);

			RoutingUtil.explodeRouting(sRoutingPath, oBOMNode, oRouting);
		}
	});
});
