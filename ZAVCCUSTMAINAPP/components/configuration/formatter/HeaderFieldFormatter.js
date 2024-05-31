/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/model/type/Currency",
	"sap/i2d/lo/lib/zvchclfz/common/util/Toggle",
	"sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/base/strings/formatMessage"
], function (Currency, Toggle, Constants, formatMessage) {

	"use strict";
	var oFormatter = {

		getText: function (sDescription, sTechnicalName, sI18NText) {
			if (!!sDescription && !!sTechnicalName) {
				return formatMessage(sI18NText, [sDescription, sTechnicalName]);
			} else {
				return sDescription || sTechnicalName;
			}
		},

		getConcatenatedObjectKey: function (sApplicationKey, sSubKey) {
			if (!!sApplicationKey && !!sSubKey) {
				return formatMessage("{0}{1}{2}", [sApplicationKey, '&', sSubKey]);
			} else if (sApplicationKey) {
				return formatMessage("{0}", [sApplicationKey]);
			} else if (sSubKey) {
				return formatMessage("{0}{1}", ['&', sSubKey]);
			} else {
				return "";
			}
		},

		formatPrice: function (sPattern, iPrice, sUnit) {
			var sFormattedPrice = new Currency().formatValue([iPrice], "string");
			return formatMessage(sPattern, sFormattedPrice, sUnit);
		},
		
		formatDateTime: function(oDate) {
			if (oDate instanceof Date) {
				var oDateTimeFormatter = sap.ui.core.format.DateFormat.getDateTimeInstance();
				return oDateTimeFormatter.format(oDate);
			}
		},
		
		formatDate: function(oDate) {
			if (oDate instanceof Date) {
				var oDateFormatter = sap.ui.core.format.DateFormat.getDateInstance();
				return oDateFormatter.format(oDate);
			}
		},

		getVariantMatchingVisibility: function (iVariantMatchingMode, oUISettings, bVariantMatchingMenuButton) {
			var oModel = this.getModel(Constants.VCHCLF_MODEL_NAME);
			if (!oModel || !oUISettings) {
				return false;
			}

			if (iVariantMatchingMode !== 0 && iVariantMatchingMode !== 1) {
				if (oUISettings.ProductVariantCreationAllowed && bVariantMatchingMenuButton) { //show menu button
					return true;
				} else if (!oUISettings.ProductVariantCreationAllowed && !bVariantMatchingMenuButton) { //show button without menu arrow:  has to be removed if decision to only use variant with menu
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		},

		getETOSwitchVisible: function (sETOStatus, oUISettings, bEditable) {
			if (!bEditable || !oUISettings || sETOStatus !== "") {
				return false;
			}

			if (oUISettings.EtoProcessType !== "3") {
				return false;
			}
			if (sETOStatus === "") {
				return true;
			} else {
				return false;
			}
		},

		isCreateVariantItemEnabled: function (sConfigurationStatusType, sFullMatchingVariants, oUISettings) {
			if (sConfigurationStatusType !== "1") {
				// Configuration must be released to allow creation of product variant. 
				return false;
			}
			if (!oUISettings) {
				return false;
			}
			if (sFullMatchingVariants === "\u2013") {
				return true;
			} else {
				return false;
			}
		},
		
		getReviseChangesButtonVisible: function(sETOStatus, sUiMode){
			if (sUiMode === "Display"){
				return false;
			}
			if (sETOStatus === Constants.ETO_STATUS.ENGINEERING_FINISHED || sETOStatus === Constants.ETO_STATUS.REVIEW_FINISHED_BY_SALES){
				return true;
			} else {
				return false;
			}
		},
		
		getHandoverToEngineeringButtonVisible: function(sETOStatus, bEditable){
			if (!bEditable){
				return false;
			}

			if (sETOStatus === Constants.ETO_STATUS.PROCESSING_STARTED){
				return true;
			} else {
				return false;
			}
		},
		
		getHandBackToEngineeringButtonVisible: function(sETOStatus, bEditable){
			if (!bEditable){
				return false;
			}

			if (sETOStatus === Constants.ETO_STATUS.REVISED_BY_SALES){
				return true;
			} else {
				return false;
			}
		},
		
		getAcceptReviewButtonVisible: function(sETOStatus, sUiMode) {
			if (sUiMode === "Display"){
				return false;
			}
			
			if (sETOStatus === Constants.ETO_STATUS.ENGINEERING_FINISHED){
				return true;
			} else {
				return false;
			}
		}

	};
	return oFormatter;
}, true);
