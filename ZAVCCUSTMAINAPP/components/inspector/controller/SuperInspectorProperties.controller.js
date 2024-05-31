/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/SuperInspectorFormatter",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/SuperInspector",
	"sap/ui/core/mvc/Controller"
], function (SuperInspectorFormatter, Constants, InspectorModel, SuperInspector, Controller) {
	"use strict";

	return Controller.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.controller.SuperInspectorProperties", {

		/**
		 * Super Inspector related formatter functions
		 * @private
		 */
		_superInspectorFormatter: SuperInspectorFormatter,

		/**
		 * Setup the super inspector related property pages after the data is received
		 * @public
		 */
		onAfterDataReceived: function () {
			if (InspectorModel.getIsSuperInspectorAvailable()) {
				var oView = this.getView();
				var oProperties = oView.getModel("properties").getProperty("/");
				var oViewData = oView.getModel("__viewData");

				if (oProperties[Constants.navigationProperties.Common.Super].IsExcludedItem) {
					oViewData.setProperty("/isSuperInspectorShown", true);
					oViewData.setProperty("/isSuperInspectorEnabled", false);
				} else if (!this.isDifferentConfiguredAndSuperData(oProperties)) {
					oViewData.setProperty("/isSuperInspectorShown", false);
					oViewData.setProperty("/isSuperInspectorEnabled", false);
				} else {
					// If there was a reload only, the isSuperInspectorShown should be remain the same flag
					oViewData.setProperty("/isSuperInspectorShown", !!oViewData.getProperty("/isSuperInspectorShown"));
					oViewData.setProperty("/isSuperInspectorEnabled", true);
				}
			}
		},

		/**
		 * Returns whether there are any differences between values of configured and super properties
		 * @param {Object} oProperties - response of the BE request (with $expand=to_Super)
		 * @returns {Boolean} flag whether there are any differences
		 * @protected
		 */
		isDifferentConfiguredAndSuperData: function (oProperties) {
			return SuperInspector.isDifferentConfiguredAndSuperData(oProperties);
		}

	});
});
