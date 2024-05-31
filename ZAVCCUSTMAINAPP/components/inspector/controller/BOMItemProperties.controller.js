/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/inspector/controller/SuperInspectorProperties.controller",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/GeneralFormatter",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/NavigationManager",
	"sap/ui/model/json/JSONModel"
], function (SuperInspectorProperties, GeneralFormatter, Constants, InspectorModel, NavigationManager, JSONModel) {
	"use strict";

	return SuperInspectorProperties.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.controller.BOMItemProperties", {

		/**
		 * Formatter functions
		 * @private
		 */
		_generalFormatter: GeneralFormatter,

		/**
		 * Life-cycle event of controller: initialization
		 * @public
		 */
		onInit: function () {
			var bNavigationToBOMState = NavigationManager.getNavigationHandler()
				.getIsNavigationToBOMSupported();

			this.getView().setModel(new JSONModel({
				navToBOMVisibility: bNavigationToBOMState
			}), "__visibility");
		},

		/**
		 * Event handler for Navigation to Configuration Profile view
		 * @param {Object} oEvent - UI5 eventing object
		 * @private
		 */
		onConfigurationProfilePressed: function (oEvent) {
			var oModel = oEvent.getSource()
				.getModel("properties");
			var sProduct, sCounter;

			if (InspectorModel.getIsSuperInspectorAvailable()) {
				sProduct = oModel.getProperty("/to_Super/BOMComponentName");
				sCounter = oModel.getProperty("/to_Super/ConfigurationProfileNumber");
			} else {
				sProduct = oModel.getProperty("/BOMComponentName");
				sCounter = oModel.getProperty("/ConfigurationProfileNumber");
			}

			this.getOwnerComponent().openConfigurationProfileProperties({
				product: sProduct,
				counter: sCounter
			});
		},

		/**
		 * Event handler for Navigation to BOM
		 * @param {Object} oEvent - UI5 eventing object
		 * @private
		 */
		onNavigateToBOM: function (oEvent) {
			var oNavObject = oEvent.getSource()
				.getModel("properties")
				.getData();

			// If the BOM Application is missing or the BOM is not found the navigation should not happen.
			switch (oNavObject.IsBOMExplosionPossible) {
			case Constants.BOMExplosionStates.possible:
				NavigationManager.getNavigationHandler()
					.navigateToBOM(oNavObject); // Actual navigation is called.
				break;
			case Constants.BOMExplosionStates.missingBOMApplication:
				this.getOwnerComponent()
					.fireNavigationToBOMwithoutBOMApp();
				break;
			case Constants.BOMExplosionStates.BOMNotFound:
				if (oNavObject.ParentComponentId === Constants.BOMItemProperties.rootParentComponentId) {
					this.getOwnerComponent()
						.fireNavigationToBOMCanNotBeFound();
				} else {
					NavigationManager.getNavigationHandler()
						.navigateToBOM(oNavObject); // Actual navigation is called.
				}

				break;
			default:
				break;
			}
		}

	});

});
