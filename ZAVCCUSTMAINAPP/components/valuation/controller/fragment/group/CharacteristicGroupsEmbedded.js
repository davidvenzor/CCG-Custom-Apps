/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/valuation/controller/fragment/group/CharacteristicGroupsBase"
], function(CharacteristicGroupsBase) {
	"use strict";

	/**
	 * Base controller for embedded groups fragments
	 * 
	 * @class
	 * @abstract
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.group.CharacteristicGroupsEmbedded
	 * @extends sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.group.CharacteristicGroupsBase
	 */
	return CharacteristicGroupsBase.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.group.CharacteristicGroupsEmbedded", { /** @lends sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.group.CharacteristicGroupsEmbedded.prototype */
		
		/**
		 * @private
		 */
		characteristicGroupFactoryEmbedded: function(sId, oContext) {
			var sFragment = "sap.i2d.lo.lib.zvchclfz.components.valuation.view.fragment.group.CharacteristicGroupEmbedded";
			return this.characteristicGroupFactory(sId, oContext, sFragment);
		}
	});

}, /* bExport= */ true);
