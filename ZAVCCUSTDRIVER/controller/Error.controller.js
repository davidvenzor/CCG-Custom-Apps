/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"i2d/lo/app/zvchclfz/config/legacyintegration/types/ErrorState"
], function (Controller, History, ErrorState) {
	"use strict";

	return Controller.extend("i2d.lo.app.zvchclfz.config.legacyintegration.controller.Error", {

		onInit: function () {

		},

		getErrorViewTitle: function (sErrorState) {
			var oResourceBundle = this.getView().getModel("configStartI18n").getResourceBundle();

			switch (sErrorState) {
			case ErrorState.HashError:
				return oResourceBundle.getText("ERROR_DIALOG_TITLE_NOTFOUND");
			case ErrorState.SettingsError:
				return oResourceBundle.getText("ERROR_DIALOG_TITLE_ERROR");
			}
			return oResourceBundle.getText("ERROR_DIALOG_TITLE_NOTFOUND");
		},

		getErrorViewText: function (sErrorState) {
			var oResourceBundle = this.getView().getModel("configStartI18n").getResourceBundle();

			switch (sErrorState) {
			case ErrorState.HashError:
				return oResourceBundle.getText("ERROR_DIALOG_TEXT_RESOURCE");
			case ErrorState.SettingsError:
				return oResourceBundle.getText("ERROR_DIALOG_TEXT_SETTINGS");
			}
			return oResourceBundle.getText("ERROR_DIALOG_TEXT_RESOURCE");
		},

		getErrorViewDescription: function (sErrorState) {
			var oResourceBundle = this.getView().getModel("configStartI18n").getResourceBundle();

			switch (sErrorState) {
			case ErrorState.HashError:
				return oResourceBundle.getText("ERROR_DIALOG_DESCR_RESOURCE");
			case ErrorState.SettingsError:
				return oResourceBundle.getText("ERROR_DIALOG_DESCR_SETTINGS");
			}
			return oResourceBundle.getText("ERROR_DIALOG_DESCR_RESOURCE");
		},

		onNavBack: function (oEvent) {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			}
		}
	});

});