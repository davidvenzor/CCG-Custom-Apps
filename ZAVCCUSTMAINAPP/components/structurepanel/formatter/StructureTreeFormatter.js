/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/common/type/DescriptionMode",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/i18n",
	"sap/base/strings/formatMessage",
	"sap/ui/core/format/NumberFormat"
], function (DescriptionMode, Constants, i18n, formatMessage, NumberFormat) {
	"use strict";

	return {
		/**
		 * Formats quantity and unit of measure
		 * @param {String} sI18nText - i18n text
		 * @param {String} sQuantity - Quantity value
		 * @param {String} sUom - Unit of measure value
		 * @returns {String} The formatted value
		 * @public
		 */
		formatQtyWithUom: function (sI18nText, sQuantity, sUom) {
			var oQuantityFormat = NumberFormat.getFloatInstance();

			return "<h6>" +
				formatMessage(sI18nText, [oQuantityFormat.format(parseFloat(sQuantity)), sUom]) +
				"</h6>";
		},

		/**
		 * Formats the name of a BOM component
		 * @param {String} sTechnicalName - Technical name of the BOM component
		 * @param {String} sDescription - Description of the BOM component
		 * @param {sap.i2d.lo.lib.zvchclfz.common.type.DescriptionMode} sDescriptionMode - Description Mode
		 * @returns {String} The formatted name
		 * @public
		 */
		formatComponentName: function (sTechnicalName, sDescription, sDescriptionMode) {
			if (!sTechnicalName){
				return sDescription;
			}

			switch (sDescriptionMode) {
				case DescriptionMode.Description:
					return sDescription ? sDescription : sTechnicalName;
				case DescriptionMode.TechnicalName:
					return sTechnicalName;
				case DescriptionMode.Both:
					return sDescription ?
						i18n.getTextWithParameters("vchclf_structpnl_format_text_id_description",
							[sDescription, sTechnicalName]) :
						sTechnicalName;
				default:
					return sTechnicalName;
			}
		},

		/**
		 * Formats the configuration status icon
		 * @param {String} sConfigurationValidationStatus - Configuration Validation status
		 * @param {String} sConfigurationStatusCode - Configuration Status code
		 * @returns {String} src property of the icon
		 * @public
		 */
		formatConfigurationStatusSrc: function (sConfigurationValidationStatus, sConfigurationStatusCode) {
			switch (sConfigurationValidationStatus) {
				case Constants.configurationInstance.validationStatus.ValidatedAndReleased:
					return "sap-icon://accept";
				case Constants.configurationInstance.validationStatus.ValidatedAndIncomplete:
					return "sap-icon://alert";
				case Constants.configurationInstance.validationStatus.NotValidate:
					return undefined;
				case Constants.configurationInstance.validationStatus.ProcessedButUnknown:
					return "sap-icon://incident";
				case Constants.configurationInstance.validationStatus.InconsistencyDetected:
					return "sap-icon://error";
				default:
					switch (sConfigurationStatusCode) {
						case Constants.configurationStatus.Incomplete:
							return "sap-icon://alert";
						default:
							return undefined;
					}
			}
		},

		/**
		 * Formats the color of the configuration status icon
		 * @param {String} sConfigurationValidationStatus - Configuration Validation Status
		 * @param {String} sConfigurationStatusCode - Configuration Status code
		 * @returns {sap.ui.core.IconColor} Color of the icon
		 * @public
		 */
		formatConfigurationStatusColor: function (sConfigurationValidationStatus, sConfigurationStatusCode) {
			switch (sConfigurationValidationStatus) {
				case Constants.configurationInstance.validationStatus.ValidatedAndReleased:
					return sap.ui.core.IconColor.Positive;
				case Constants.configurationInstance.validationStatus.ValidatedAndIncomplete:
					return sap.ui.core.IconColor.Critical;
				case Constants.configurationInstance.validationStatus.NotValidate:
					return sap.ui.core.IconColor.Default;
				case Constants.configurationInstance.validationStatus.InconsistencyDetected:
					return sap.ui.core.IconColor.Negative;
				case Constants.configurationInstance.validationStatus.ProcessedButUnknown:
					return sap.ui.core.IconColor.Default;
				default:
					switch (sConfigurationStatusCode) {
						case Constants.configurationStatus.Incomplete:
							return sap.ui.core.IconColor.Critical;
						default:
							return sap.ui.core.IconColor.Default;
					}
			}
		},
		
		/**
		 * Formats the tooltip of the configuration status icon
		 * @param {String} sConfigurationValidationStatusDescription - Configuration Validation Status Description
		 * @param {String} sConfigurationStatusText - Configuration Status Text
		 * @returns {String} Tooltip of icon
		 * @public
		 */
		formatConfigurationStatusTooltip: function (sConfigurationValidationStatusDescription, sConfigurationStatusText) {
			return sConfigurationValidationStatusDescription || sConfigurationStatusText;
		},

		/**
		 * Gives back the proper icon based on the type of the RoutingNode
		 * @param {String} sClass - Class Name property of BOMNode
		 * @returns {String} Icon URI property
		 */
		getBOMNodeIcon: function (sClass) {
			return sClass ? "sap-icon://BusinessSuiteInAppSymbols/icon-distribute-segments" : "";
		},

		/**
		 * Gives back the proper tooltip for the icon of BOMNode
		 * @param {String} sClass - Class Name property of BOMNode
		 * @returns {String} Tooltip for the icon
		 */
		getBOMNodeIconTooltip: function (sClass) {
			return sClass ? i18n.getText("vchclf_structpnl_tree_class_node_tt") : "";
		}
	};
});
