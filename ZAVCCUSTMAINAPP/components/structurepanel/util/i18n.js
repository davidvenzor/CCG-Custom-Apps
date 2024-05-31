/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([

], function () {
	"use strict";

	/**
	 * Helper class for accessing the i18n model from modules
	 * @class
	 */
	var I18nResource = function () {
		/**
		 * Reference for the i18n model object
		 * @type {sap.ui.model.resource.ResourceModel}
		 * @private
		 */
		this._model = null;
	};

	/**
	 * Initializer
	 * @param {sap.ui.model.resource.ResourceModel} oModel - i18n model of the application
	 * @public
	 */
	I18nResource.prototype.initModel = function (oModel) {
		if (!this._model) {
			this._model = oModel;
		}
	};

	/**
	 * Getter for the model reference
	 * @returns {sap.ui.model.resource.ResourceModel} - i18n model of the application
	 * @public
	 */
	I18nResource.prototype.getModel = function () {
		return this._model;
	};

	/**
	 * Getter for a text property of the i18n model
	 * @param {String} sId - ID of the text in the i18n model
	 * @returns {String} i18n text
	 * @public
	 */
	I18nResource.prototype.getText = function (sId) {
		return this._model.getProperty(sId);
	};

	/**
	 * Getter for a parameterized text property of the i18n model
	 * @param {String} sId - ID of the text in the i18n model
	 * @param {Array} aParams - parameters for the parameterized text
	 * @returns {String} i18n text
	 * @public
	 */
	I18nResource.prototype.getTextWithParameters = function (sId, aParams) {
		if (this._model) {
			return this._model.getResourceBundle().getText(sId, aParams);
		}

		return undefined;
	};

	/**
	 * Export singleton instance of I18nResource
	 */
	return new I18nResource();
});
