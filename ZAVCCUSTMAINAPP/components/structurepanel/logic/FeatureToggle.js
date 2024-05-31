/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/ODataModelHelper"
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
				ETOTopDownFixate: "IDEA_CONFIGURE_ETO_TOPDOWN_FIXATE",
				ETOImplicitOBOMCreate: "IDEA_CONFIGURE_IMPLICIT_OBOM_CREATE",
				ETONavigateToOBOMAppWithDraft: "IDEA_CONFIGURE_NAV_WITH_DRAFT",
				StructurePanelProcurementType: "IDEA_CONFIGURE_STRUC_PANEL_PROCMT_TYPE"
			},
			values: {
				"IDEA_CONFIGURE_ETO_TOPDOWN_FIXATE": undefined,
				"IDEA_CONFIGURE_IMPLICIT_OBOM_CREATE": undefined,
				"IDEA_CONFIGURE_NAV_WITH_DRAFT": undefined,
				"IDEA_CONFIGURE_STRUC_PANEL_PROCMT_TYPE": undefined
			}
		};
	};

	/**
	 * Returns the toggle status for ETO Top Down Fixate
	 * @returns {Boolean} State of the toggle
	 * @public
	 */
	FeatureToggle.prototype.getETOTopDownFixateEnabled = function () {
		return !!this._getToggleById(this._toggles.features.ETOTopDownFixate);
	};

	/**
	 * Returns the toggle status for implicit OBOM create on insert, update and delete BOM item
	 * @returns {Boolean} State of the toggle
	 * @public
	 */
	FeatureToggle.prototype.getETOImplicitOBOMCreateEnabled = function () {
		return !!this._getToggleById(this._toggles.features.ETOImplicitOBOMCreate);
	};

	/**
	 * Returns the toggle status for navigation to OBOM App with Draft UUID
	 * @returns {Boolean} State of the toggle
	 * @public
	 */
	FeatureToggle.prototype.getETONavigateToOBOMAppWithDraft = function () {
		return !!this._getToggleById(this._toggles.features.ETONavigateToOBOMAppWithDraft);
	};

	/**
	 * Returns the toggle status for Structure Panel Procurement Type
	 * @returns {Boolean} State of the toggle
	 * @public
	 */
	FeatureToggle.prototype.getStructurePanelProcurementType = function () {
		return !!this._getToggleById(this._toggles.features.StructurePanelProcurementType);
	};

	/**
	 * Clears the buffered feature toggle values
	 * @public
	 */
	FeatureToggle.prototype.resetValues = function () {
		$.each(this._toggles.values, function (sKey) {
			this._toggles.values[sKey] = undefined;
		}.bind(this));
	};

	/**
	 * Returns the toggle from the server or from cache
	 * @param {String} sToggleId - ID of the toggle
	 * @returns {Boolean} - State of the toggle
	 * @private
	 */
	FeatureToggle.prototype._getToggleById = function (sToggleId) {
		var oModel = ODataModelHelper.getModel();

		if (this._toggles.values.hasOwnProperty(sToggleId) && oModel) {
			if (this._toggles.values[sToggleId] === undefined) {
				var sPath = oModel.createKey(Constants.entitySet.ToggleSet, {
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

	/**
	 * Export singleton instance of FeatureToggle
	 */
	return new FeatureToggle();
});
