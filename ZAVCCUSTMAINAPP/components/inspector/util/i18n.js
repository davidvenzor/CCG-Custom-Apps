/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([

], function () {
	"use strict";

	var I18nResource = function () {
		this._model = null;
	};

	I18nResource.prototype.initModel = function (oModel) {
		if (!this._model) {
			this._model = oModel;
		}
	};

	I18nResource.prototype.getText = function (sId) {
		if (this._model && sId) {
			return this._model.getProperty(sId);
		}

		return undefined;
	};

	I18nResource.prototype.getModel = function () {
		return this._model;
	};

	I18nResource.prototype.getTextWithParameters = function (sId, aParams) {
		if (this._model && sId) {
			return this._model.getResourceBundle().getText(sId, aParams);
		}

		return undefined;
	};

	return new I18nResource();
});
