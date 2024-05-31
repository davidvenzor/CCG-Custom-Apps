/*global QUnit*/

sap.ui.define([
	"CCGSDGRADINGAPP/ZSD_GRADINGAPP/controller/grading.controller"
], function (Controller) {
	"use strict";

	QUnit.module("grading Controller");

	QUnit.test("I should test the grading controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});