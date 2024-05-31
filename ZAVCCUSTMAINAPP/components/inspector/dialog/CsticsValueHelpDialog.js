/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/inspector/dialog/GenericValueHelpDialog",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/ValueHelpConfig"
], function (GenericValueHelpDialog, ValueHelpConfig) {
	"use strict";

	/**
	 * CsticValueHelp class
	 * @class
	 */
	var CsticsValueHelp = function () {
		return new GenericValueHelpDialog(ValueHelpConfig.CsticValueHelpConfig);
	};

	return CsticsValueHelp;
});
