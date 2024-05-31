/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/GeneralFormatter",
	"sap/ui/core/mvc/Controller"
], function(GeneralFormatter, Controller) {
	"use strict";

	return Controller.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.controller.CharacteristicsProperties", {

		/**
		 * Formatter functions
		 * @private
		 */
		_generalFormatter: GeneralFormatter

	});
});
