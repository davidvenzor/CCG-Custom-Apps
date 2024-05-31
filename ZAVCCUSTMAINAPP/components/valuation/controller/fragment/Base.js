/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/common/controller/fragment/Base",
	"sap/i2d/lo/lib/zvchclfz/common/Constants"
], function(Base, Constants) {
	"use strict";

	/**
	 * Base controller for the fragments
	 * 
	 * @class
	 * @abstract
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragments.Base
	 * @extends sap.i2d.lo.lib.zvchclfz.common.controller.fragment.Base
	 */
	return Base.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.Base", { /** @lends sap.ui.base.ManagedObject.prototype */
		metadata: {
			"abstract": true,
			properties: {
				dataModel: {
					type: "sap.ui.model.Model"
				},
				viewModel: {
					type: "sap.i2d.lo.lib.zvchclfz.components.valuation.model.ViewModel"
				},
				valuationDAO: {
					type: "sap.i2d.lo.lib.zvchclfz.components.valuation.dao.ValuationDAO"
				},
				groupState: {
					type: "sap.i2d.lo.lib.zvchclfz.components.valuation.util.GroupState"
				},
				settingsModel: {
					type: "sap.ui.model.Model"
				}
			}
		},

		/**
		 * @override
		 */
		exit : function() {
			Base.prototype.exit.apply(this, arguments);
			this.setDataModel(null);
			this.setViewModel(null);
			this.setValuationDAO(null);
			this.setGroupState(null);
			this.setSettingsModel(null);
		},

		/**
		 * @private
		 * Is used for CharacteristicGroupsBase and CharacteristicBase
		 */
		_getCharacteristicGroups: function() {
			return this.byId("groupVBox-0--groups");
		},

		/**
		 * @protected
		 * Is used for CharacteristicGroupsBase and CharacteristicBase
		 */
		getCharacteristicGroupsBinding: function() {
			var oGroups = this._getCharacteristicGroups();
			if (oGroups) {
				return oGroups.getBinding("items");
			}
		},

		/**
		 * @protected
		 */
		getCharacteristicGroupBindingContext: function() {
			return this.getCharacteristicGroupsBinding().getContext();
		}
	});

}, /* bExport= */ true);
