/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"sap/ops/productivityreport/ZOPSPRODUCTIVITYREPORT/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});