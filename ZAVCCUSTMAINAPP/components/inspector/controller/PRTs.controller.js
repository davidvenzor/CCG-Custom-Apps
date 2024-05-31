/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/UiConfig",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/dao/InspectorDAO",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/PRTFormatter",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/NavigationManager"
], function (Controller, JSONModel, UiConfig, InspectorModel, InspectorDAO, PRTFormatter, Constants, NavigationManager) {
	"use strict";

	return Controller.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.controller.PRTs", {
		/**
		 * Local JSON Model for store the PRTs
		 * @type {sap.ui.model.json.JSONMode}
		 * @private
		 */
		_prts: null,

		/**
		 * Contains the last read Routing path
		 * @type {String}
		 * @private
		 */
		_lastReadRoutingPath: null,

		/**
		 * Formatter functions for the PRT
		 * @private
		 */
		_prtFormatter: PRTFormatter,

		/**
		 * Initializer; subscribes to events
		 * @private
		 */
		onInit: function () {
			this._prts = new JSONModel({});
			this.getView().setModel(this._prts, "prts");
		},

		/**
		 * Reads the Data from the BE if the context is changed
		 * @public
		 */
		onActivate: function () {
			//checks the last read Routing's path
			if (!this._lastReadRoutingPath ||
				!InspectorModel.compareLastObjectNavigatedToPath(this._lastReadRoutingPath)) {
				this._bindPRTsToList(InspectorModel.getLastObjectNavigatedToPath());
			}
		},

		/**
		 * Reloads the content of the PRTs tab
		 * @public
		 */
		reloadContent: function () {
			if (this._lastReadRoutingPath) {
				this._bindPRTsToList(this._lastReadRoutingPath);
			}
		},

		/**
		 * Bind the PRTs to the list
		 * @param {String} sRoutingPath - path of the selected Routing
		 * @private
		 */
		_bindPRTsToList: function (sRoutingPath) {
			var oView = this.getView();
			oView.setBusy(true);

			InspectorDAO.read(sRoutingPath + "/" + Constants.navigationProperties.RoutingNode.PRTs, false)
				.then(function (oData) {
					this._prts.setData(oData);
					oView.setBusy(false);
					//Updating last read routing path after the BE is successfull
					this._lastReadRoutingPath = sRoutingPath;
				}.bind(this))
				.catch(function () {
					this._lastReadRoutingPath = null;
					this._prts.setData({});
					oView.setBusy(false);
				}.bind(this));
		},

		/**
		 * Handles press event of PRTs list items
		 * @param {Object} oEvent - UI5 eventing object
		 * @private
		 */
		onPRTItemPress: function (oEvent) {
			var oPRT = oEvent.getSource().getBindingContext("prts").getObject();
			var sPRTPath = this._lastReadRoutingPath + "/" + Constants.navigationProperties.RoutingNode.PRTs +
				"(BillOfOperationsType='" + oPRT.BillOfOperationsType +
				"',BillOfOperationsGroup='" + oPRT.BillOfOperationsGroup +
				"',BOOOperationPRTInternalId='" + oPRT.BOOOperationPRTInternalId +
				"',BOOOperationPRTIntVersCounter='" + oPRT.BOOOperationPRTIntVersCounter + "')";

			// store the selectedTab of the view for the back navigation
			this.getView()
				.getModel("__viewData")
				.setProperty("/selectedTab", InspectorModel.getProperty("/selectedTab"));

			NavigationManager
				.getContainer()
				.getCurrentPage()
				.setBusy(true);

			NavigationManager.navigateTo(sPRTPath, UiConfig.inspectorMode.objectType.PRT);
		}

	});
});
