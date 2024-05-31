/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/base/Log",
	"sap/ui/generic/app/navigation/service/NavigationHandler",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel"
], function (Log, NavigationHandler, InspectorModel) {
	"use strict";

	return NavigationHandler.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.logic.NavigationHandler", {

		/**
		 * Internal object to set whether a navigation is supported
		 * @type {Object}
		 * @private
		 */
		_supportedNavigation: {
			NavigateToBOM: null
		},

		/**
		 * Internal object used to reference CrossApplicationNavigation service
		 * @type {Object}
		 * @private
		 */
		_internalNavigatorService: null,

		/**
		 * Constructor, which retrieves the shell navigation service.
		 * @constructor
		 * @param {Object} oController - Fulfill the inheritance of the controller
		 * @override
		 */
		constructor: function (oController) {
			NavigationHandler.prototype.constructor.call(this, oController);

			var fnNavService = sap.ushell &&
				sap.ushell.Container &&
				sap.ushell.Container.getService &&
				sap.ushell.Container.getService("CrossApplicationNavigation");

			if (fnNavService) {
				this._internalNavigatorService = fnNavService;
				// Checks whether the Navigation are supported.
				this.isNavigationToBOMSupported();
			}
		},

		/**
		 * Checks whether the navigation is possible for an Intent
		 * @param {String} sSemanticObject -		Name of the semantic object of the target app
		 * @param {String} sActionName -			Name of the action of the target app
		 * @param {Object} oNavigationParameters -	Navigation parameters as an object with key/value pairs or as a
		 * 											stringified JSON object
		 * @public
		 * @returns {Promise} - Whether the intent is supported
		 */
		isNavigationSupported: function (sSemanticObject, sActionName, oNavigationParameters) {
			return new Promise(function (resolve, reject) {
				if (this._internalNavigatorService) {
					var oIntent = {
						target: {
							semanticObject: sSemanticObject,
							action: sActionName
						},
						params: oNavigationParameters || {}
					};

					this._internalNavigatorService.isNavigationSupported([oIntent])
						.done(function (aResponse) {
							resolve(aResponse[0].supported);
						})
						.fail(function () {
							reject();
						});
				} else {
					reject();
				}
			}.bind(this));
		},

		/**
		 * Triggers navigation to BOMs object page					- This comes from the NavigationHandler itself.
		 * @param {Object} oParameters								- Parameters need for the navigation
		 * @param {String} oParameters.BillOfMaterial				- Material
		 * @param {String} oParameters.Plant 						- Plant
		 * @param {String} oParameters.BOMVariantUsage				- BillOfMaterialVariantUsage
		 * @param {String} oParameters.BOMCategory 	    			- BillOfMaterialCategory
		 * @param {String} oParameters.BOMVariant					- BillOfMaterialVariant
		 * @public
		 */
		navigateToBOM: function (oParameters) {
			this.navigate("MaterialBOM", "displayBOM", {
				Material: oParameters.BillOfMaterial,
				Plant: oParameters.Plant,
				BillOfMaterialVariantUsage: oParameters.BOMVariantUsage,
				BillOfMaterialCategory: oParameters.BOMCategory,
				BillOfMaterialVariant: oParameters.BOMVariant
			});
		},

		/**
		 * Checks whether navigation to BOM is possible
		 * @public
		 */
		isNavigationToBOMSupported: function () {
			this.isNavigationSupported("MaterialBOM", "displayBOM", {
					Material: "",
					Plant: "",
					BillOfMaterialVariantUsage: "",
					BillOfMaterialCategory: "",
					BillOfMaterialVariant: ""
				}).then(function (bSupported) {
					this._supportedNavigation.NavigateToBOM = bSupported;
				}.bind(this))
				.catch(function () {
					this._supportedNavigation.NavigateToBOM = false;
					Log.error(
						"The Navigation to BOM is not supported.",
						"You need to add a role to your launchpad in order to allow BOM Navigation.",
						"sap.i2d.lo.lib.zvchclfz.components.inspector.logic.NavigationHandler");
				}.bind(this));
		},

		/**
		 * Returns whether navigation to BOM is possible
		 * @public
		 * @returns {Boolean} - Whether the intent is supported
		 */
		getIsNavigationToBOMSupported: function () {
			return this._supportedNavigation.NavigateToBOM &&
				InspectorModel.getIsExternalNavigationEnabled();
		}
	});

});
