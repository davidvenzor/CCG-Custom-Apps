/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/ConfProfileFormatter",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/GeneralFormatter",
	"sap/ui/core/mvc/Controller"
], function (ConfProfileFormatter, GeneralFormatter, Controller) {
	"use strict";

	return Controller.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.controller.ConfProfileProperties", {

		/**
		 * Formatter functions for configuration profile properties
		 * @private
		 */
		_formatter: ConfProfileFormatter,

		/**
		 * Formatter functions
		 * @private
		 */
		_generalFormatter: GeneralFormatter

	});
});
