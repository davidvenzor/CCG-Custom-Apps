/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/common/Constants"
], function (Constants) {
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
		isActive: function (sId, oFeatureModel) {
			var bToggleIsActive = true;
			if (!this._isToggleEntityLoaded(oFeatureModel || this.getModel(Constants.VCHCLF_MODEL_NAME))) {
				return false;
			}
			var oModel = oFeatureModel || this.getModel(Constants.VCHCLF_MODEL_NAME);
			var oFeatureToggle = oModel.getProperty("/ToggleSet('" + sId + "')");
			if (oFeatureToggle) {
				bToggleIsActive = !!oFeatureToggle.ToggleStatus;
			}
			return bToggleIsActive;
		},

		_isToggleEntityLoaded: function (oModel) {
			var oData = oModel.getData("/");
			var bIsLoaded = false;
			for (var property in oData) {
				if (property.indexOf("ToggleSet") >= 0) {
					bIsLoaded = true;
				}
			}
			return bIsLoaded;
		}
	};
});
