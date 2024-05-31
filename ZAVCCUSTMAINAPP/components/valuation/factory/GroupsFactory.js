/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/valuation/factory/FactoryBase"
], function(FactoryBase) {
	"use strict";

	var ABSOLUTE_PATH_GROUPS_EMBEDDED = "sap.i2d.lo.lib.zvchclfz.components.valuation.view.fragment.group.CharacteristicGroupsEmbedded";
	var ABSOLUTE_PATH_GROUPS_FULL_SCREEN = "sap.i2d.lo.lib.zvchclfz.components.valuation.view.fragment.group.CharacteristicGroupsFullScreen";

	var FRAGMENT_CONTROLLER = {};
	FRAGMENT_CONTROLLER[ABSOLUTE_PATH_GROUPS_EMBEDDED] =
		"sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.group.CharacteristicGroupsEmbedded";
	FRAGMENT_CONTROLLER[ABSOLUTE_PATH_GROUPS_FULL_SCREEN] =
		"sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.group.CharacteristicGroupsFullScreen";

	/**
	 * 
	 */
	return FactoryBase.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.factory.GroupsFactory", {

		/**
		 * Creates a characteristic group representation ui control
		 * @param {string} sIdPrefix: Prefix for stable control id
		 * @param {sap.ui.model.Context} oContext: Binding context for creating control.
		 * @param {object} oController: Controller instance
		 * @return {sap.m.VBox} || {sap.m.IconTabBar} Characteristic group UI control instance 
		 * @private
		 * @function
		 */
		create: function(sIdPrefix, oContext) {
			var oSettingsModel = this.getSettingsModel();
			var sGroupRepresentation = oSettingsModel.getProperty("/groupRepresentation")[0];
			var sFragment = ABSOLUTE_PATH_GROUPS_EMBEDDED;

			if (sGroupRepresentation === "fullScreen") {
				sFragment = ABSOLUTE_PATH_GROUPS_FULL_SCREEN;
			}
			return this.createFragment(sIdPrefix, sFragment, FRAGMENT_CONTROLLER[sFragment]);
		}
	});
});
