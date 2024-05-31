/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"CCGSDGRADINGAPP/ZSD_GRADINGAPP/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});