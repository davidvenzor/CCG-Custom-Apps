/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants"
], function (Constants) {
	"use strict";

	/**
	 * Helper class for super inspector related functionalities
	 * @class
	 */
	var SuperInspector = function () {};

	/**
	 * Attach the Standard Values of Operation to the Operation Details object
	 * @param {Object} oOperationDetails - Operation Details object
	 * @param {Object[]} aConfStandardValues - Array of Standard Values of Configured Operation
	 * @param {Object[]} aSuperStandardValues - Array of Standard Values of Super Operation
	 * @returns {Object} the extended Operation Details object
	 * @private
	 */
	SuperInspector.prototype.attachStandardValuesToOperation = function (oOperationDetails, aConfStandardValues, aSuperStandardValues) {
		var oExtendedOperation = oOperationDetails;
		var aStandardValues = [];

		// Attach configured standard values
		$.each(aConfStandardValues, function (iIndex, oConfStandardValue) {
			var aSuperStandardValue = this._findObjectInArrayByValueOfProperty(aSuperStandardValues, "Label", oConfStandardValue.Label);

			oConfStandardValue[Constants.navigationProperties.Common.Super] = aSuperStandardValue.length > 0 ?
				aSuperStandardValue[0] : {};

			aStandardValues.push(oConfStandardValue);
		}.bind(this));

		// Attach super standard values which are not part of the configured ones
		$.each(aSuperStandardValues, function (iIndex, oSuperStandardValue) {
			var aConfStandardValue = this._findObjectInArrayByValueOfProperty(aConfStandardValues, "Label", oSuperStandardValue.Label);

			if (aConfStandardValue.length === 0) {
				var oStandardValue = {};

				oStandardValue[Constants.navigationProperties.Common.Super] = oSuperStandardValue;

				aStandardValues.push(oStandardValue);
			}
		}.bind(this));

		oExtendedOperation[Constants.navigationProperties.Operation.StandardValues] = aStandardValues;

		return oExtendedOperation;
	};

	/**
	 * Returns whether there are any differences between values of configured and super properties
	 * @param {Object} oExpandedProperties - response of the BE request (with $expand=to_Super)
	 * @returns {Boolean} flag whether there are any differences
	 * @public
	 */
	SuperInspector.prototype.isDifferentConfiguredAndSuperData = function (oExpandedProperties) {
		var bDifferent = false;

		$.each(oExpandedProperties, function (sKey, sValue) { // eslint-disable-line consistent-return
			// if the value of property is not an object (not a navigation property) and the value of
			// configured property is not the same as the super one, bDifferent will be true
			if (typeof sValue !== "object" &&
				sValue !== oExpandedProperties[Constants.navigationProperties.Common.Super][sKey]) {
				bDifferent = true;
				return false;
			}
		});

		return bDifferent;
	};

	/**
	 * Returns whether there are any differences between values of configured and super properties
	 * of standard values
	 * @param {Object[]} aStandardValues - array of standard values
	 * @returns {Boolean} flag whether there are any differences
	 * @public
	 */
	SuperInspector.prototype.isDifferentConfiguredAndSuperStandardValues = function (aStandardValues) {
		return $.grep(aStandardValues, function (oStandardValue) {
			return oStandardValue.Value !== oStandardValue[Constants.navigationProperties.Common.Super].Value;
		}).length > 0;
	};

	/**
	 * Find an object in an array by the value of a property
	 * @param {Object[]} aArray - array of objects
	 * @param {String} sProperty - name of the property
	 * @param {String} sValue - value of the property
	 * @returns {Object[]} array of the found objects
	 * @private
	 */
	SuperInspector.prototype._findObjectInArrayByValueOfProperty = function (aArray, sProperty, sValue) {
		return $.grep(aArray, function (oElement) {
			return oElement[sProperty] && oElement[sProperty] === sValue;
		});
	};

	return new SuperInspector();
});
