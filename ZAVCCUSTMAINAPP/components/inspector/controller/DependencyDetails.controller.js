/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/UiConfig",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/dao/InspectorDAO",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/DependencyFormatter",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/GeneralFormatter",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (UiConfig, InspectorDAO, DependencyFormatter, GeneralFormatter, Constants, Controller, JSONModel) {
	"use strict";

	var OBJECT_DEPENDENCY_CODES = Constants.navigationProperties.ObjectDependencyDetails.ObjectDependencyCodes;
	var INITIAL_COUNT_OF_DEP_CODE_LINES = 3;
	var BASE_MODEL_SIZE_LIMIT = 100;

	return Controller.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.controller.DependencyDetails", {

		/**
		 * Formatter functions for DependencyDetails view
		 * @private
		 */
		_formatter: DependencyFormatter,

		/**
		 * Formatter functions
		 * @private
		 */
		_generalFormatter: GeneralFormatter,

		/**
		 * Local JSON model for the details of dependency
		 * @private
		 */
		_details: null,

		/**
		 * Local JSON Model for the view data
		 * @type {sap.ui.model.json.JSONModel}
		 * @private
		 */
		_viewData: null,

		/**
		 * Local flag to indicate if the Source code is fully loaded
		 * @type {Boolean}
		 * @private
		 */
		_isAllDependencySourceCodeLoaded: null,

		/**
		 * Cached Dependency Source Code
		 * @type {Array}
		 * @private
		 */
		_cachedDependencySource: null,

		/**
		 * Life-cycle event of Controller: initialization
		 * @private
		 */
		onInit: function () {
			var oView = this.getView();

			this._details = new JSONModel();
			this._viewData = new JSONModel(oView.getViewData());

			oView.setModel(this._details, "details");
			oView.setModel(this._viewData, "__viewData");
		},

		/**
		 * Called by NavigationManager when navigation is completed
		 * @public
		 */
		onNavigatedTo: function () {
			var oView = this.getView();
			var sPath = this._viewData.getProperty("/objectPath");

			oView.setBusy(true);

			InspectorDAO.getDependencyDetailsWithExpandedSourceCode(sPath)
				.then(function (oData) {
					var sObjectType = this._viewData.getProperty("/objectType");

					oData[OBJECT_DEPENDENCY_CODES] = oData[OBJECT_DEPENDENCY_CODES].results;

					this._isAllDependencySourceCodeLoaded = false;
					this._cachedDependencySource = [];

					if (oData[OBJECT_DEPENDENCY_CODES].length > INITIAL_COUNT_OF_DEP_CODE_LINES) {
						oData[OBJECT_DEPENDENCY_CODES] =
							oData[OBJECT_DEPENDENCY_CODES].slice(0, INITIAL_COUNT_OF_DEP_CODE_LINES);
						this._viewData.setProperty("/_isToggleDepSourceCodeLinkVisible", true);
					} else {
						this._viewData.setProperty("/_isToggleDepSourceCodeLinkVisible", false);
					}

					this._details.setData(oData);

					this._viewData.setProperty("/title", UiConfig.objectTypeConfig[sObjectType].getTitle(oData));
					this._viewData.setProperty("/subTitle", UiConfig.objectTypeConfig[sObjectType].getSubTitle(oData));
				}.bind(this))
				.catch(function () {})
				.then(function () {
					oView.setBusy(false);
				});
		},

		/**
		 * Event handler for press of the link of toggle dependency source code
		 * @param {Object} oEvent - UI5 event object
		 * @public
		 */
		onToggleDependencyCodeLinesPressed: function (oEvent) {
			var oSource = oEvent.getSource();

			if (!this._isAllDependencySourceCodeLoaded) {
				this.loadAllDependencySourceCodeFromService(oSource);
			} else {
				this.toggleDependencySourceCodeFromCache();
			}
		},

		/**
		 * Toggles Dependency Source Code From cache
		 * @private
		 */
		toggleDependencySourceCodeFromCache: function () {
			var aCurrentlyVisibleSourceCode = this._details.getProperty("/" + OBJECT_DEPENDENCY_CODES);

			var aDepSourceCode = this._cachedDependencySource.length === aCurrentlyVisibleSourceCode.length ?
				aCurrentlyVisibleSourceCode.slice(0, INITIAL_COUNT_OF_DEP_CODE_LINES) :
				this._cachedDependencySource;

			this._details.setProperty("/" + OBJECT_DEPENDENCY_CODES, aDepSourceCode);

			this._focusOnSourceCode();
		},

		/**
		 * Loads All Dependency Source Code from BE
		 * And updates internal cache
		 * @param {sap.m.Link} oLink - link object
		 * @private
		 */
		loadAllDependencySourceCodeFromService: function (oLink) {
			var sPath = this._viewData.getProperty("/objectPath");

			oLink.setBusy(true);

			InspectorDAO.getAllDependencySourceCode(sPath)
				.then(function (oData) {

					this._details.setProperty("/" + OBJECT_DEPENDENCY_CODES, oData.results);

					if (oData.results.length > BASE_MODEL_SIZE_LIMIT) {
						this._details.setSizeLimit(oData.results.length);
					}

					this._isAllDependencySourceCodeLoaded = true;
					this._cachedDependencySource = oData.results;

					this._focusOnSourceCode();

				}.bind(this))
				.catch(function () {})
				.then(function () {
					oLink.setBusy(false);
				});
		},

		/**
		 * Focuses on the Dependency Source Code
		 * @private
		 */
		_focusOnSourceCode: function () {
			this.byId("idDependencySourceCode").focus();
		}

	});
});
