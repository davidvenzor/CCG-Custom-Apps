/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/NavigationManager",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/StructurePanelModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/RoutingUtil"
], function (Controller, NavigationManager, StructurePanelModel, RoutingUtil) {
	"use strict";

	return Controller.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.controller.MainFrame", {

		/**
		 * Called by UI5 runtime init
		 * @private
		 */
		onInit: function () {
			this.getView().setModel(StructurePanelModel.getModel(), "ui");

			NavigationManager.setMainContainer(this.byId("idStructurePanelNavContainer"));
			NavigationManager.setOwnerComponent(this.getOwnerComponent());
			RoutingUtil.setOwnerComponent(this.getOwnerComponent());
		},

		/**
		 * Called by UI5 runtime. Destructor.
		 * @private
		 */
		onExit: function () {
			NavigationManager.teardown();
			RoutingUtil.teardown();

			StructurePanelModel.resetModel();
		}
	});
});
