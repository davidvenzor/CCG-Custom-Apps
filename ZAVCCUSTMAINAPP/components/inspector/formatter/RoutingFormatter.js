/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/UiConfig",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel"
], function (UiConfig, InspectorModel) {
	"use strict";

	/**
	 * Collection of formatters of Routing views
	 */
	return {
		/**
		 * Provides visibility for Routing sequence lot size
		 * @param {Boolean} bParallelSequence       - Paralel Sequeence flag, If it is false than It is alternative
		 * @param {String} sMinimumLotSizeQuantity - Minimum lot size
		 * @param {String} sMaximumLotSizeQuantity - Maximum lot size
		 * @returns {Boolean} The visibility of control
		 */
		visibilityOfLotSizeQuantity: function (bParallelSequence, sMinimumLotSizeQuantity, sMaximumLotSizeQuantity) {
			var bMinimumIsNotZero = parseFloat(sMinimumLotSizeQuantity) !== 0;
			var bMaximumIsNotZero = parseFloat(sMaximumLotSizeQuantity) !== 0;

			return !bParallelSequence && (bMinimumIsNotZero || bMaximumIsNotZero);
		},

		/**
		 * Provides visibility for Standard Value of Operation
		 * @param {String} sConfValue - value of the Standard Value of configured operation
		 * @param {Boolean} bIsSuperInspectorShown - flag whether the show super inspector button is turned ON
		 * @returns {Boolean} the visibility of Standard Value
		 */
		getVisibilityOfStandardValue: function (sConfValue, bIsSuperInspectorShown) {
			if (!InspectorModel.getIsSuperInspectorAvailable()) {
				return true;
			} else {
				return !bIsSuperInspectorShown && !!sConfValue || bIsSuperInspectorShown;
			}
		},

		/**
		 * Provides the label for Standard Value of Operation
		 * @param {String} sConfLabel - label of the Standard Value of configured operation
		 * @param {String} sSuperLabel - label of the Standard Value of super operation
		 * @returns {String} the label of Standard Value
		 */
		getLabelOfStandardValue: function (sConfLabel, sSuperLabel) {
			return sConfLabel || sSuperLabel;
		},

		/**
		 * Returns the visibility of the Reference Operation Set form container
		 * @param {String} sObjectType - type of the inspected object
		 * @returns {Boolean} visibility of the form container
		 */
		visibilityOfReferenceOperationSet: function (sObjectType) {
			return sObjectType === UiConfig.inspectorMode.objectType.RefOperation ||
				sObjectType === UiConfig.inspectorMode.objectType.RefSubOperation;
		}
	};
});
