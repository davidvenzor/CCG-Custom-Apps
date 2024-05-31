/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([], function () {
	"use strict";

	/**
	 * Helper class for generating hashes for entities
	 * @class
	 */
	var HashGenerator = function () {};

	/**
	 * Generates 32int hash for Entities
	 * @param {Object} oEntity - Entity Object
	 * @param {String[]} [aRelevantNavigationProperties] - Relevant Navigation Properties
	 * @return {Int} 32int hash
	 * @public
	 */
	HashGenerator.prototype.generateHashForEntity = function (oEntity, aRelevantNavigationProperties) {
		var iHash, oCompactEntity = $.extend({}, oEntity);

		this._deleteNotStateRelevantProperties(oCompactEntity, aRelevantNavigationProperties);
		var sBOMItemState = JSON.stringify(oCompactEntity);

		//Generate a 32int hash
		for (var i = 0; i < sBOMItemState.length; i++) {
			//Get the Char Code as it is an int
			iHash = (iHash << 5) - iHash + sBOMItemState.charCodeAt(i);
			iHash = iHash & iHash;
		}

		return iHash;
	};

	/**
	 * Delete the __metadata and __deferred properties as they are not required for the state
	 * Also deletes not required navigation properties
	 * @param {Object} oEntity - Entity Object
	 * @param {String[]} [aRelevantNavigationProperties] - Relevant Navigation Properties
	 * @private
	 */
	HashGenerator.prototype._deleteNotStateRelevantProperties = function (oEntity, aRelevantNavigationProperties) {
		if ($.isEmptyObject(oEntity)) {
			return;
		}

		delete oEntity.__metadata;
		delete oEntity.__deferred;

		for (var sProperty in oEntity) {
			if (typeof oEntity[sProperty] === "object" &&
				!(oEntity[sProperty] instanceof Date)) {
				//Only the relevant to the status is kept
				if ($.isArray(aRelevantNavigationProperties) &&
					aRelevantNavigationProperties.indexOf(sProperty) !== -1 &&
					!$.isEmptyObject(oEntity[sProperty])) {
					this._deleteNotStateRelevantProperties(
						oEntity[sProperty],
						aRelevantNavigationProperties);

					if ($.isEmptyObject(oEntity[sProperty])) {
						delete oEntity[sProperty];
					}
				} else {
					//Delete Empty Objects and not required navigation properties
					delete oEntity[sProperty];
				}

			} else if (typeof oEntity[sProperty] === "string") {
				oEntity[sProperty] = oEntity[sProperty].trim();

				//Delete Empty properties
				if (!oEntity[sProperty]) {
					delete oEntity[sProperty];
				}
			}
		}
	};

	/**
	 * Export singleton instance of HashGenerator
	 */
	return new HashGenerator();
});
