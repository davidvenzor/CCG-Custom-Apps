/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/TraceEntryTextTypes",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/i18n"
], function (TraceEntryTextTypes, i18n) {
	"use strict";

	var CSTIC_VALUE_ENTRY_TYPE = TraceEntryTextTypes.TextTypes.CharacteristicValue;

	/**
	 * Collection of formatters of Dependency Trace
	 */
	return {

		/**
		 * Format the value of the Variant Table detail
		 * @param {Object[]} aVariantTables - List of the variant tables
		 * @returns {String} Formatted text
		 * @public
		 */
		formatVariantTables: function (aVariantTables) {
			var sVariantTables = "";

			$.each(aVariantTables, function (iIndex, oVariantTable) {
				if (sVariantTables === "") {
					sVariantTables = oVariantTable.VariantTableName;
				} else {
					sVariantTables = i18n.getTextWithParameters("vchclf_insp_common_comma_separated_items",
						[sVariantTables, oVariantTable.VariantTableName]);
				}
			});

			return sVariantTables;
		},

		/**
		 * Returns the metatext about the detail of Object Dependency
		 * @returns {String} Formatted metatext
		 * @public
		 */
		formatMetatextOfObjectDependencyDetail: function () {
			return TraceEntryTextTypes.SupportedObject.ObjectDependency;
		},

		/**
		 * Returns the metatext about the detail of Characteristic
		 * @param {Object} oTraceCharacteristicValues - Value of the to_TraceCharacteristicValues navigation property
		 * @param {Object[]} oTraceCharacteristicValues.results - List of the Characteristic Value entities
		 * @param {Boolean} bShowPreciseNumbers - Indicator whether the precise numbers should be shown
		 * @returns {String} Formatted metatext
		 * @public
		 */
		formatMetatextOfCharacteristicDetail: function (oTraceCharacteristicValues, bShowPreciseNumbers) {
			if (!oTraceCharacteristicValues) {
				return "";
			}

			// {BOMComponent} . {Characteristic}: Value1 <icon>, Value2 <icon>...
			var sCharacteristic = i18n.getTextWithParameters("vchclf_trace_dot_separated_items", [
				TraceEntryTextTypes.SupportedObject.BOMComponent, TraceEntryTextTypes.SupportedObject.Characteristic
			]);
			var sCharacteristicValues = "";

			$.each(oTraceCharacteristicValues.results, function (iIndex, oCharacteristicValue) {
				var oCsticValueClassifier =
					TraceEntryTextTypes.ValueClassifiers[oCharacteristicValue.CsticValueClassifier] ||
					TraceEntryTextTypes.ValueClassifiers.Default;

				var sCharacteristicValue = CSTIC_VALUE_ENTRY_TYPE.getText(oCharacteristicValue, bShowPreciseNumbers);

				var sCharacteristicValueWithIcon = oCsticValueClassifier
					.getDecoratedText(sCharacteristicValue);

				sCharacteristicValues = sCharacteristicValues === "" ? sCharacteristicValueWithIcon :
					i18n.getTextWithParameters("vchclf_insp_common_comma_separated_items", [
						sCharacteristicValues, sCharacteristicValueWithIcon
					]);
			});

			return i18n.getTextWithParameters("vchclf_insp_common_value_with_label", [
				sCharacteristic, sCharacteristicValues
			]);
		},

		/**
		 * Formatter for display Pricing Factors' Details
		 * @param {Object} oTraceEntry - Object of the TraceEntry entity
		 * @param {Boolean} bShowPreciseNumbers - Indicator whether the precise numbers should be shown
		 * @returns {String} The formatted value
		 * @public
		 */
		formatPricingFactorDetails: function (oTraceEntry, bShowPreciseNumbers) {
			if (!oTraceEntry.VariantConditionValue) {
				return "";
			}

			var sFactorValue = CSTIC_VALUE_ENTRY_TYPE.getText(oTraceEntry, bShowPreciseNumbers);

			return i18n.getTextWithParameters("vchclf_insp_common_value_with_label", [
				oTraceEntry.VariantConditionValue, sFactorValue
			]);
		},

		/**
		 * Formatter for display Dependency Result's Detail
		 * @param {Object} oDependencyResult - TraceDependency Entity type
		 * @returns {String} The formatted value
		 * @public
		 */
		formatMetatextOfDependencyResultDetail: function (oDependencyResult) {
			if (!oDependencyResult) {
				return "";
			}

			var sFormattedResult = i18n.getTextWithParameters("vchclf_insp_common_comma_separated_items", [
				oDependencyResult.ResultValueText, oDependencyResult.ResultTypeText
			]);

			return i18n.getTextWithParameters("vchclf_insp_common_value_with_label", [
				TraceEntryTextTypes.SupportedObject.ObjectDependencyResult,
				sFormattedResult
			]);
		},

		/**
		 * Formatter for display Characteristic Result's Detail
		 * @param {Object} oCharacteristicResult - TraceCharacteristicResult Entity type
		 * @returns {String} The formatted value
		 * @public
		 */
		formatMetatextOfCharacteristicResultsDetail: function (oCharacteristicResult) {
			if (!oCharacteristicResult) {
				return "";
			}

			// {BOMComponent} . {Characteristic}: ResultTypeText.
			var sCharacteristicMetatext = i18n.getTextWithParameters("vchclf_trace_dot_separated_items", [
				TraceEntryTextTypes.SupportedObject.BOMComponent,
				TraceEntryTextTypes.SupportedObject.Characteristic
			]);

			return i18n.getTextWithParameters("vchclf_insp_common_value_with_label", [
				sCharacteristicMetatext,
				oCharacteristicResult.ResultTypeText
			]);
		}
	};
});
