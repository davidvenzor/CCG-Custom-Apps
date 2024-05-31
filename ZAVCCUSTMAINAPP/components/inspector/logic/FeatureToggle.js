/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/ODataModelHelper"
], function (Constants, ODataModelHelper) {
	"use strict";

	/**
	 * Access class for Feature Toggles
	 * @class
	 */
	var FeatureToggle = function () {
		/**
		 * Internal structure for storing toggles
		 * @type {Object}
		 * @private
		 */
		this._toggles = {
			features: {
			},
			values: {
			}
		};
	};

	/**
	 * Returns the toggle from the server or from cache
	 * @param {String} sToggleId - ID of the toggle
	 * @returns {Boolean} - State of the toggle
	 * @private
	 */
	FeatureToggle.prototype._getToggleById = function (sToggleId) {
		if (this._toggles.values.hasOwnProperty(sToggleId)) {
			var oModel = ODataModelHelper.getModel();

			if (this._toggles.values[sToggleId] === undefined && oModel) {
				var sPath = oModel.createKey(Constants.entitySets.ToggleSet, {
					"ToggleId": sToggleId
				});
				var oContext = oModel.getContext("/" + sPath);

				if (oContext && oContext.getObject()) {
					this._toggles.values[sToggleId] = !!oContext.getObject().ToggleStatus;
				} else {
					this._toggles.values[sToggleId] = false;
				}
			}

			return this._toggles.values[sToggleId];
		}

		return undefined;
	};

	return new FeatureToggle();
});
