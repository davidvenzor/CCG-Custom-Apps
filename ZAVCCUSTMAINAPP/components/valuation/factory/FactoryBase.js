/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/common/factory/FactoryBase"
], function(FactoryBase) {
	"use strict";

	/**
	 * @param {string}
	 *            [sId] Optional ID for the new control; generated automatically if
	 *            no non-empty ID is given Note: this can be omitted, no matter
	 *            whether <code>mSettings</code> will be given or not!
	 * @param {object}
	 *            [mSettings] optional map/JSO
	 
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.zvchclfz.components.valuation.factory.FactoryBase
	 * @extends sap.i2d.lo.lib.zvchclfz.common.factory.FactoryBase
	 */
	return FactoryBase.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.factory.FactoryBase", {
		metadata: {
			properties: {
				valuationDAO: {
					type: "sap.i2d.lo.lib.zvchclfz.components.valuation.dao.ValuationDAO"
				},
				groupState: {
					type: "sap.i2d.lo.lib.zvchclfz.components.valuation.util.GroupState"
				},
				viewModel: {
					type: "sap.i2d.lo.lib.zvchclfz.components.valuation.model.ViewModel"
				}
			}
		},

		exit: function() {
			var oValuationDAO = this.getValuationDAO();
			if (oValuationDAO) {
				oValuationDAO.destroy();
			}

			var oGroupState = this.getGroupState();
			if (oGroupState) {
				oGroupState.destroy();
			}
			FactoryBase.prototype.exit.apply(this, arguments);
		}
	});
});
