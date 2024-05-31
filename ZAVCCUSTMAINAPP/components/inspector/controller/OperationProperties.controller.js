/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/inspector/controller/SuperInspectorProperties.controller",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/RoutingFormatter",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/SuperInspector"
], function (SuperInspectorProperties, RoutingFormatter, Constants, SuperInspector) {
	"use strict";

	return SuperInspectorProperties.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.controller.OperationProperties", {

		/**
		 * Routing related formatter functions
		 * @private
		 */
		_routingFormatter: RoutingFormatter,

		/**
		 * Returns whether there are any differences between values of configured and super properties
		 * @param {Object} oProperties - response of the BE request (with $expand=to_Super)
		 * @returns {Boolean} flag whether there are any differences
		 * @protected
		 * @override
		 */
		isDifferentConfiguredAndSuperData: function (oProperties) {
			return SuperInspector.isDifferentConfiguredAndSuperData(oProperties) ||
				SuperInspector.isDifferentConfiguredAndSuperStandardValues(oProperties[Constants.navigationProperties.Operation.StandardValues]);
		}

	});
});
