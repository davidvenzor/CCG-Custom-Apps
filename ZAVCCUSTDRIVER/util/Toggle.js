/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([], function() {
	"use strict";

	return {
		/**
		 * Get the status of a given toggle
 		 * For an unknown toogle the default is true
		 * (Same default behavior as in ABAP layer)
		 * 
		 * @param {string} sId The ID of the toggle
		 * @return {boolean} 
		 * @public
		 * @static
		 */
		isActive: function(sId) {
			var bToggleIsActive = true;
			var oModel = this.getModel();
			var oFeatureToggle = oModel.getProperty("/ToggleSet('" + sId + "')");
			if (oFeatureToggle) {
				bToggleIsActive = !!oFeatureToggle.ToggleStatus;
			}
			return bToggleIsActive;
		}
	};
});