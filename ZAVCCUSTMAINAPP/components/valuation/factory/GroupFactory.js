/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/valuation/factory/FactoryBase"
], function(FactoryBase) {
	"use strict";

	var ABSOLUTE_PATH_GROUP_VBOX = "sap.i2d.lo.lib.zvchclfz.components.valuation.view.fragment.group.CharacteristicGroupEmbedded";
	var ABSOLUTE_PATH_GROUP_ICONTABBAR = "sap.i2d.lo.lib.zvchclfz.components.valuation.view.fragment.group.CharacteristicGroupFullScreen";

	var FRAGMENT_CONTROLLER = {};
	FRAGMENT_CONTROLLER[ABSOLUTE_PATH_GROUP_ICONTABBAR] = "sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.group.CharacteristicGroupFullScreen";
	FRAGMENT_CONTROLLER[ABSOLUTE_PATH_GROUP_VBOX] = "sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.group.CharacteristicGroupEmbedded";

	/**
	 * 
	 */
	return FactoryBase.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.factory.GroupFactory", {

		/**
		 * Creates a characteristic group ui control
		 * @param {string} sIdPrefix: Prefix for stable control id
		 * @param {string} sFragment: Name of Fragment that represents characteristic group ui control
		 * @return {sap.m.VBox} || {sap.m.IconTabBar} Characteristic group UI control instance 
		 * @private
		 * @function
		 */
		create: function(sIdPrefix, sFragment) {
			return this.createFragment(sIdPrefix, sFragment, FRAGMENT_CONTROLLER[sFragment]);
		}
	});
});
