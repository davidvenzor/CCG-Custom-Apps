/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/ValuesFormatter",
	"sap/ui/core/mvc/Controller"
], function(ValuesFormatter, Controller) {
	"use strict";

	return Controller.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.controller.ValueProperties", {

		/**
		 * Formatter functions for the values
		 * @private
		 */
		_formatter: ValuesFormatter

	});
});
