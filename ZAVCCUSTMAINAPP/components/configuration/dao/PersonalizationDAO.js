/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([
	"jquery.sap.global",
	"sap/ui/base/ManagedObject",
	"sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/i2d/lo/lib/zvchclfz/common/type/DescriptionMode"
], function (jQuery, ManagedObject, Constants, DescriptionMode) {
	"use strict";

	var ITEM_KEY_COMMON = "#COMMON";

	var DEFAULT_USER_SETTINGS = {
		descriptionMode: DescriptionMode.Description,
		StructurePanelButtonPressed: null,
		InspectorButtonPressed: false,
		showHiddenCharacteristics: false,
		showPreciseNumbers: false
	};

	var DEFAULT_COMMON_USER_SETTINGS = {
		BOMColumnsVariant: {
			defaultKey: "",
			variantItems: {}
		}
	};

	var getPersonalizationService = function () {
		if (sap.ushell && sap.ushell.Container) {
			return sap.ushell.Container.getService("Personalization");
		}
		return null;
	};

	/**
	 * The personalization DAO wraps the FLP personalization service
	 *
	 * @class
	 *
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.vchclf.components.configuration.dao.PersonalizationDAO
	 * @extends sap.ui.base.ManagedObject
	 */
	var PersonalizationDAO = ManagedObject.extend("sap.i2d.lo.lib.zvchclfz.components.configuration.dao.PersonalizationDAO", { /** @lends sap.i2d.lo.lib.vchclf.components.configuration.dao.PersonalizationDAO.prototype */
		metadata: {
			manifest: "json",
			properties: {
				itemKey: {
					type: "string"
				}
			},

			events: {
				changed: {
					parameters: {
						data: "object"
					}
				}
			}
		},

		/**
		 * @return {map} the personalization ID
		 * @private
		 */
		_getId: function () {
			return {
				container: "vchSettings",
				item: this.getItemKey()
			};
		},

		/**
		 * @return {sap.ushell.services.Personalizer} the personalizer instance
		 * @private
		 */
		_getPersonalizer: function () {
			// Get a personalization service provider from the shell (or create your own)
			var oPersonalizationService = getPersonalizationService();
			return oPersonalizationService.getPersonalizer(this._getId());
		},

		/**
		 * @return {sap.ushell.services.Personalizer} the common (not semantic object related) personalizer instance
		 * @private
		 */
		_getCommonPersonalizer: function () {
			// Get a personalization service provider from the shell (or create your own)
			var oPersonalizationService = getPersonalizationService();

			return oPersonalizationService.getPersonalizer({
				container: "vchSettings",
				item: ITEM_KEY_COMMON
			});
		},

		/**
		 * Gets a valid boolean by choosing the data in the following sequence:
		 * 1. the new data
		 * 2. the stored data
		 * 3. the default data
		 * @param {boolean} bNewValue: a new boolean
		 * @param {boolean} bPersDataValue: boolean from stored data
		 * @param {boolean} bDefaultValue: boolean from default data
		 * @return {boolean} a valid boolean.
		 * @private
		 * @function
		 */
		_getValidBoolean: function (bNewValue, bPersDataValue, bDefaultValue) {
			if (typeof (bNewValue) === "boolean") {
				return bNewValue;
			} else if (typeof (bPersDataValue) === "boolean") {
				return bPersDataValue;
			} else {
				return bDefaultValue;
			}
		},

		/**
		 * Gets a valid object by choosing the data in the following sequence:
		 * 1. the new data
		 * 2. the stored data
		 * 3. the default data
		 * @param {Object} oNewValue: a new object
		 * @param {Object} oPersDataValue: object from stored data
		 * @param {Object} oDefaultValue: object from default data
		 * @return {Object} a valid object.
		 * @private
		 * @function
		 */
		_getValidObject: function (oNewValue, oPersDataValue, oDefaultValue) {
			if (typeof (oNewValue) === "object") {
				return oNewValue;
			} else if (typeof (oPersDataValue) === "object") {
				return oPersDataValue;
			} else {
				return oDefaultValue;
			}
		},

		/**
		 * Builds a new user settings object by choosing the data in the following sequence:
		 * 1. the new data
		 * 2. the stored data
		 * 3. the default data
		 * @param {Object} oNewData: contains the new given data
		 * @param {Object} oStoredData: contains the already saved data to personalization service
		 * @return {Object} new user settings object.
		 * @private
		 * @function
		 */
		_buildUserSettingsObject: function (oNewData, oStoredData) {
			var mDefaultUserSettings = PersonalizationDAO.getDefaultUserSettings();
			var sDescriptionMode = oNewData.descriptionMode || oStoredData.descriptionMode || mDefaultUserSettings.descriptionMode;
			var bShowHiddenCharacteristics = this._getValidBoolean(oNewData.showHiddenCharacteristics, oStoredData.showHiddenCharacteristics,
				mDefaultUserSettings.showHiddenCharacteristics);
			var bShowPreciseNumbers = this._getValidBoolean(oNewData.showPreciseNumbers, oStoredData.showPreciseNumbers,
				mDefaultUserSettings.showPreciseNumbers);
			var bStructurePanelButtonPressed = this._getValidBoolean(oNewData.StructurePanelButtonPressed, oStoredData.StructurePanelButtonPressed,
				!!mDefaultUserSettings.StructurePanelButtonPressed);
			var bInspectorButtonPressed = this._getValidBoolean(oNewData.InspectorButtonPressed, oStoredData.InspectorButtonPressed,
				mDefaultUserSettings.InspectorButtonPressed);
			var oBOMColumnsVariant = this._getValidObject(oNewData.BOMColumnsVariant, oStoredData.BOMColumnsVariant,
				mDefaultUserSettings.BOMColumnsVariant);

			return {
				descriptionMode: sDescriptionMode,
				StructurePanelButtonPressed: bStructurePanelButtonPressed,
				InspectorButtonPressed: bInspectorButtonPressed,
				showHiddenCharacteristics: bShowHiddenCharacteristics,
				showPreciseNumbers: bShowPreciseNumbers,
				BOMColumnsVariant: oBOMColumnsVariant
			};
		},

		/**
		 * Use a global property on the personalizationDAO to keep the 'showHidden' state in the memory
		 * This is lost when you reload the app. This is wanted as long as the value from the personalization service
		 * cannot be retrieved before the binding is resolved
		 */
		showHiddenCharacteristics: false,

		/**
		 * Loads and returns currently configured settings.
		 * @return {Promise<Object>} returns a promise which will be resolved with the loaded data.
		 * @public
		 */
		getData: function () {
			return new Promise(function (fnResolve) {
				Promise.all([
						this._getPersonalizer().getPersData(),
						this._getCommonPersonalizer().getPersData()
					])
					.then(function (aResponses) {
						var mData = $.extend(
							{},
							$.extend({}, DEFAULT_USER_SETTINGS, aResponses[0]),
							$.extend({}, DEFAULT_COMMON_USER_SETTINGS, aResponses[1])
						);

						mData.showHiddenCharacteristics = this.showHiddenCharacteristics;

						fnResolve(mData);
					}.bind(this));
			}.bind(this));
		},

		/**
		 * Stores the given settings.
		 * @param {map} mData the data to store.
		 * @return {Promise<Object>} returns a promise which will be resolved with the stored data.
		 * @public
		 */
		setData: function (mData) {
			this.showHiddenCharacteristics = mData.showHiddenCharacteristics;

			return this.getData().then(this._buildUserSettingsObject.bind(this, mData)).then(function (mNewData) {
				var mSemanticObjectData = {};
				var mCommonData = {};

				$.each(mNewData, function (sKey, oValue) {
					if (DEFAULT_USER_SETTINGS[sKey] !== undefined) {
						mSemanticObjectData[sKey] = oValue;
					} else if (DEFAULT_COMMON_USER_SETTINGS[sKey] !== undefined) {
						mCommonData[sKey] = oValue;
					}
				});


				return Promise.all([
						this._getPersonalizer().setPersData(mSemanticObjectData),
						this._getCommonPersonalizer().setPersData(mCommonData)
					])
					.then(function (aResponses) {
						var mStoredData = $.extend(
							{},
							$.extend({}, DEFAULT_USER_SETTINGS, aResponses[0]),
							$.extend({}, DEFAULT_COMMON_USER_SETTINGS, aResponses[1])
						);

						this.fireChanged({
							data: mStoredData
						});

						return mStoredData;
					}.bind(this));
			}.bind(this));
		},

		/**
		 * Stores the given settings without firing the change event
		 * @param {map} mData the data to store.
		 * @return {Promise<Object>} returns a promise which will be resolved with the stored data.
		 * @public
		 */
		setDataWithoutChangeEvent: function (mData) {
			return this.getData().then(this._buildUserSettingsObject.bind(this, mData)).then(function (mNewData) {
				var mSemanticObjectData = {};
				var mCommonData = {};

				$.each(mNewData, function (sKey, oValue) {
					if (DEFAULT_USER_SETTINGS[sKey] !== undefined) {
						mSemanticObjectData[sKey] = oValue;
					} else if (DEFAULT_COMMON_USER_SETTINGS[sKey] !== undefined) {
						mCommonData[sKey] = oValue;
					}
				});

				Promise.all([
					this._getPersonalizer().setPersData(mSemanticObjectData),
					this._getCommonPersonalizer().setPersData(mCommonData)
				])
				.then(function (aResponses) {
					return $.extend(
						{},
						$.extend({}, DEFAULT_USER_SETTINGS, aResponses[0]),
						$.extend({}, DEFAULT_COMMON_USER_SETTINGS, aResponses[1])
					);
				});
			}.bind(this));
		}
	});

	/**
	 * @return {boolean} wheather the personalization dao is supported or not
	 * @public
	 * @static
	 */
	PersonalizationDAO.isSupported = function () {
		return !!getPersonalizationService();
	};

	/**
	 * Returns the default values of the DAO
	 * @return {map} the default values object
	 * @public
	 * @static
	 */
	PersonalizationDAO.getDefaultUserSettings = function () {
		return $.extend({}, DEFAULT_USER_SETTINGS, DEFAULT_COMMON_USER_SETTINGS);
	};

	/**
	 * Returns the default common (not semantic object related) values of the DAO
	 * @return {map} the default common values object
	 * @public
	 * @static
	 */
	PersonalizationDAO.getDefaultCommonUserSettings = function () {
		return DEFAULT_COMMON_USER_SETTINGS;
	};

	return PersonalizationDAO;
});
