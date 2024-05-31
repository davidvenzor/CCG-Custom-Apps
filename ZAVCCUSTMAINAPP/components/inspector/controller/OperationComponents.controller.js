/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/UiConfig",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/dao/InspectorDAO",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/NavigationManager",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/ODataModelHelper"
], function (Controller, JSONModel, UiConfig, InspectorModel, InspectorDAO, Constants, NavigationManager, ODataModelHelper) {
	"use strict";

	return Controller.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.controller.OperationComponents", {
		/**
		 * Local JSON Model for store the Components
		 * @type {sap.ui.model.json.JSONMode}
		 * @private
		 */
		_operationComponents: null,

		/**
		 * Contains the last read Routing path
		 * @type {String}
		 * @private
		 */
		_lastReadRoutingPath: null,

		/**
		 * Initializer; subscribes to events
		 * @private
		 */
		onInit: function () {
			this._operationComponents = new JSONModel();
			this.getView().setModel(this._operationComponents, "components");
		},

		/**
		 * Reads the Data from the BE if the context is changed
		 * @public
		 */
		onActivate: function () {
			//checks the last read Routing's path
			if (!this._lastReadRoutingPath ||
				!InspectorModel.compareLastObjectNavigatedToPath(this._lastReadRoutingPath)) {
				this._bindComponentsToList(InspectorModel.getLastObjectNavigatedToPath());
			}
		},

		/**
		 * Reloads the content of the OperationComponents tab
		 * @public
		 */
		reloadContent: function () {
			if (this._lastReadRoutingPath) {
				this._bindComponentsToList(this._lastReadRoutingPath);
			}
		},

		/**
		 * Bind the Components to the list
		 * @param {String} sRoutingPath - path of the selected Routing
		 * @private
		 */
		_bindComponentsToList: function (sRoutingPath) {
			var oView = this.getView();
			oView.setBusy(true);

			InspectorDAO.read(sRoutingPath + "/" + Constants.navigationProperties.RoutingNode.Components, false)
				.then(function (oData) {
					this._operationComponents.setData(oData);
					oView.setBusy(false);
					//Updating last read routing path after the BE is successfull
					this._lastReadRoutingPath = sRoutingPath;
				}.bind(this))
				.catch(function () {
					this._lastReadRoutingPath = null;
					this._operationComponents.setData({});
					oView.setBusy(false);
				}.bind(this));
		},

		/**
		 * Handles press event of Components list items
		 * @param {Object} oEvent - UI5 eventing object
		 * @private
		 */
		onComponentItemPress: function (oEvent) {
			var oComponent = oEvent.getSource().getBindingContext("components").getObject();
			var sContextId = InspectorModel.getConfigurationContextId();

			var sComponentPath = "/" + ODataModelHelper.getModel().createKey(Constants.entitySets.ConfigurationContext, {
				ContextId: sContextId
			}) + "/" + Constants.navigationProperties.ConfigurationContext.BOMNode + "('" + oComponent.ComponentId + "')";

			// store the selectedTab of the view for the back navigation
			this.getView()
				.getModel("__viewData")
				.setProperty("/selectedTab", InspectorModel.getProperty("/selectedTab"));

			NavigationManager
				.getContainer()
				.getCurrentPage()
				.setBusy(true);

			NavigationManager.navigateTo(sComponentPath, UiConfig.inspectorMode.objectType.BOMComponent);
		}

	});
});
