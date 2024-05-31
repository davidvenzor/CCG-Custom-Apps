/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/UiConfig",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/dao/InspectorDAO",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/DependencyFormatter",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/NavigationManager",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (UiConfig, InspectorDAO, DependencyFormatter, Constants, InspectorModel, NavigationManager, Controller, JSONModel) {
	"use strict";

	return Controller.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.controller.Dependencies", {

		/**
		 * Formatter functions for the dependencies list
		 * @private
		 */
		_dependencyFormatter: DependencyFormatter,

		/**
		 * Local JSON Model for store the dependencies
		 * @private
		 */
		_dependencies: null,

		/**
		 * Contains the last read values path
		 * @type {String}
		 * @private
		 */
		_lastReadDependencies: null,

		/**
		 * Initializer
		 * @private
		 */
		onInit: function () {
			this._dependencies = new JSONModel({});

			this.getView().setModel(this._dependencies, "dependencies");
		},

		/**
		 * Read the objects if changed
		 * @public
		 */
		onActivate: function () {
			var oView = this.getView();
			if (!this._lastReadDependencies ||
				!InspectorModel.compareLastObjectNavigatedToPath(this._lastReadDependencies)) {
				oView.setBusy(true);
				var sPath = InspectorModel.getLastObjectNavigatedToPath();
				InspectorDAO.read(sPath + "/" + Constants.navigationProperties.Common.ObjectDependencyHeaders)
					.then(function (oData) {
						this._dependencies.setData(oData);
						oView.setBusy(false);
						this._lastReadDependencies = sPath;
					}.bind(this))
					.catch(function (oData) {
						oView.setBusy(false);
					});
			}
		},

		/**
		 * Handles press event of Dependencies list items
		 * @param {Object} oEvent - UI5 eventing object
		 * @public
		 */
		onDependencyItemPress: function (oEvent) {
			var oObject = oEvent.getSource().getBindingContext("dependencies").getObject();
			var sPath = this.getView().getModel().createKey("/" + Constants.entitySets.ObjectDependencyDetails, {
				ContextId: oObject.ContextId,
				ObjectDependency: oObject.ObjectDependency
			});

			// store the selectedTab of the view for the back navigation
			this.getView()
				.getModel("__viewData")
				.setProperty("/selectedTab", InspectorModel.getProperty("/selectedTab"));

			NavigationManager.getContainer().getCurrentPage().setBusy(true);

			NavigationManager.navigateTo(sPath, UiConfig.inspectorMode.objectType.ObjectDependency);
		}

	});
});
