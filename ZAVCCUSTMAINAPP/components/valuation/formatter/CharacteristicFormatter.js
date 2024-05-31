/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/common/type/DescriptionMode",
	"sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/base/strings/formatMessage"
], function (DescriptionMode, Constants, formatMessage) {
	"use strict";

	// Invisible space for splitting up strings to be read char by char in screenreader
	var ZERO_WIDTH_NO_BREAK_SPACE = "\u202F";

	var EN_DASH = "\u2013";

	var oFormatter = {

		getChangeDocumentValueTextDescriptionWithName: function (sChangeDocument, sDescriptionMode, sI18nDescriptionText) {
			return oFormatter._combineDescriptionAndValue(sDescriptionMode, sChangeDocument.CsticValueDescription,
				sChangeDocument.CsticValue, sI18nDescriptionText);
		},

		/**
		 * Formatter. Is used to display the right label text for a characteristic 
		 * 
		 * @param {object} oCstic the cstic to use for the formatter
		 * @param {string} sDescriptionMode: description type that should be displayed 
		 * @param {string} sI18nDescriptionText: i18n description text
		 * @return {string} label text that is going to be displayed.
		 * @public
		 * @function
		 */
		getCharacteristicDescriptionWithName: function (oCstic, sDescriptionMode, sI18nDescriptionText) {
			if (!oCstic){
				return "";
			}
			return oFormatter._combineDescriptionAndValue(sDescriptionMode, oCstic.Description, oCstic.Name, sI18nDescriptionText);
		},
		
		/**
		 * Formatter. Is used to display the right label text for a characteristic outside of a form
		 * 
		 * @param {object} oCstic the cstic to use for the formatter
		 * @param {string} sDescriptionMode: description type that should be displayed 
		 * @param {string} sI18nDescriptionText: i18n description text
		 * @return {string} label text that is going to be displayed.
		 * @public
		 * @function
		 */
		getCharacteristicDescriptionWithNameAndColon: function (oCstic, sDescriptionMode, sI18nDescriptionText) {
			return oFormatter.getCharacteristicDescriptionWithName(oCstic, sDescriptionMode, sI18nDescriptionText) + ":";
		},

		/**
		 * Formatter. Is used to display the descriptive text for a characteristic value. For datatypes number/date/time it is the formatted value
		 * itself based on formattedValueFrom property (and ...To in case of intervals) (description property from service expected empty), and
		 * for CHAR it is a combination of the description property and formattedValueFrom (depending on description mode)
		 * 
		 * @param {object} oValue the cstic value to use for the formatter
		 * @param {string} sDescriptionMode: description type that should be displayed 
		 * @param {string} sI18nDescriptionText: i18n translatable pattern to combine description and value if enabled by description mode
		 * @param {string} sI18nTextForEmptyValue: i18n text for empty value
		 * @param {string} sI18nRoundedValue: non-interval formatted value or if interval, the formatted bottom boundary value
		 * @param {string} sI18nIntervalText: Translatable pattern to join the interval boundaries if it is one
		 * @param {string} sFocused: formatted top interval boundary (empty if no interval)
		 * @param {boolean} bNoUnitOfMeasure: identifies if it is unit of measure or not
		 * @return {string} formatted value text that is going to be displayed.
		 * @public
		 * @function
		 */
		getFormattedValueTextWithDescription: function (oValue, sDescriptionMode, sI18nDescriptionText, sI18nTextForEmptyValue,
			sI18nRoundedValue, sI18nIntervalText, sFocused, bNoUnitOfMeasure) {
			if (!oValue) {
				return "";
			}
			if (sFocused && oValue.HasHighPrecision) {
				return oValue.TechnicalValueDisplay;
			}

			// Builds the description part including interval formatting and empty value replacement text
			var sFormattedValueText = oFormatter.getFormattedValueText(oValue, sI18nTextForEmptyValue, sI18nRoundedValue, sI18nIntervalText,
				bNoUnitOfMeasure);

			// Combining description and value with i18n pattern. 
			return oFormatter._combineDescriptionAndValue(sDescriptionMode, oValue.Description, sFormattedValueText, sI18nDescriptionText);
		},

		/**
		 * This formatter return the display text for a characteristic value.
		 * When the given value does not have neither the description nor formatted value and it is a user input then the 'None' text is returned.
		 * When the given value does not have the description and it is a user input then the ' ' text is returned (user input with space).
		 * 
		 * @param {object} oValue the cstic value to use for the formatter
		 * @param {string} sI18nTextForEmptyValue: i18n text for empty value
		 * @param {string} sI18nRoundedValue: non-interval formatted value or if interval, the formatted bottom boundary value
		 * @param {string} sI18nIntervalText: Translatable pattern to join the interval boundaries if it is one
		 * @param {boolean} bNoUnitOfMeasure: identifies if it is unit of measure or not
		 * @return {string} formatted value text that is going to be displayed.
		 * @public
		 * @function
		 */
		getFormattedValueText: function (oValue, sI18nTextForEmptyValue, sI18nRoundedValue, sI18nIntervalText, bNoUnitOfMeasure) {
			var bIsAdditionalValue = oValue.ValueId && (oValue.ValueId.indexOf("-") === oValue.ValueId.length - 1);
			if (!oValue.Description && !oValue.FormattedValueFrom && !bIsAdditionalValue) {
				return sI18nTextForEmptyValue; // => 'None' 
			} else if (oValue.FormattedValueFrom) {
				return oFormatter._formatValue(oValue, sI18nRoundedValue, sI18nIntervalText, bNoUnitOfMeasure);
			} else if (bIsAdditionalValue && !oValue.Description) {
				return " ";
			} else {
				return "";
			}
		},

		/**
		 * This formatter function returns the value state text for a given cstic.
		 * 
		 * @param {object} oCstic the cstic to use for the formatter
		 * @param {string} sI18nTextInconsistent I18n text for inconsistency
		 * @param {string} sI18nValueContradiction I18n text for value contradiction
		 * @param {string} sI18nValueStateProposal I18n text for value state proposal
		 * @return {string} the formatted state value text
		 * @public
		 * @function
		 */
		getFormattedStateValueText: function (oCstic, sI18nTextInconsistent, sI18nValueContradiction, sI18nValueStateProposal) {
			var sText = "";
			if (oCstic.IsInconsistent) {
				sText = sI18nTextInconsistent;
			} else if (oCstic.HasValueContradiction) {
				sText = sI18nValueContradiction;
			} else if (oCstic.HasValueProposal) {
				sText = formatMessage(sI18nValueStateProposal, [oCstic.ProposalConfidence]);
			}
			return sText;
		},

		/**
		 * This formatter function returns the label for the select dialog list item of given value.
		 * 
		 * @param {object} oValue the cstic value to use for the formatter
		 * @param {string} sI18nTextForEmptyValue: i18n text for empty value
		 * @param {string} sI18nRoundedValue: non-interval formatted value or if interval, the formatted bottom boundary value
		 * @param {string} sI18nIntervalText: Translatable pattern to join the interval boundaries if it is one
		 * @param {string} sI18nProposalText: i18n proposal text
		 * @return {string} the formatted label
		 * @public
		 * @function
		 */
		getSelectDialogListItemLabel: function (sDescriptionMode, oValue, sI18nTextForEmptyValue, sI18nRoundedValue, sI18nIntervalText,
			sI18nProposalText) {
			var sLabel = "";

			// Value instead of description in the label only if explicitly requested or if there is no description
			if (oValue.FormattedValueFrom && sDescriptionMode === DescriptionMode.TechnicalName) {
				sLabel = oFormatter.getFormattedValueText(oValue, sI18nTextForEmptyValue, sI18nRoundedValue, sI18nIntervalText);
			} else {
				if (!oValue.Description) {
					sLabel = oFormatter.getFormattedValueText(oValue, sI18nTextForEmptyValue, sI18nRoundedValue, sI18nIntervalText);
				} else {
					sLabel = oValue.Description;
				}
				if (oValue.IsProposal) {
					sLabel += " (" + formatMessage(sI18nProposalText, [oValue.ProposalConfidence]) + ")";
				}
			}
			return sLabel;
		},

		/**
		 * This formatter function checks if the second line of the CustomListItem in our SelectDialog cstic control
		 * is supposed to be visible. It is only visible if the DescriptionMode is "both" AND if decription/value
		 * are different
		 * 
		 * @param {object} oValue the cstic value to use for the formatter
		 * @return {boolean} true=visible or false=hidden
		 * @public
		 * @function
		 */
		isSelectDialogListItemTextVisible: function (sDescriptionMode, oValue) {
			return !!(sDescriptionMode === DescriptionMode.Both &&
				      oValue.Description && oValue.FormattedValueFrom &&     // Both strings must be non-empty
				      oValue.Description !== oValue.FormattedValueFrom);     // Both strings must be different
		},

		/**
		 * This formatter function returns the text for the second line of the CustomListItem in our SelectDialog cstic control
		 * 
		 * @param {object} oValue the cstic value to use for the formatter
		 * @param {string} sI18nRoundedValue: non-interval formatted value or if interval, the formatted bottom boundary value
		 * @param {string} sI18nIntervalText: Translatable pattern to join the interval boundaries if it is one
		 * @return {boolean} true=visible or false=hidden
		 * @public
		 * @function
		 */
		getSelectDialogListItemText: function (oValue, sI18nRoundedValue, sI18nIntervalText) {
			return oFormatter._formatValue(oValue, sI18nRoundedValue, sI18nIntervalText);
		},

		/**
		 * Helper function for formatter. 
		 * 
		 * @param {string} sDescriptionMode: description type that should be displayed 
		 * @param {string} sDescription: description text
		 * @param {string} sName: technical description text
		 * @param {string} sI18NText: i18ntext to format the texts for translation 
		 * @return {string} text to be shown
		 * @private
		 * @function
		 */
		_combineDescriptionAndValue: function (sDescriptionMode, sDescription, sName, sI18NText) {
			switch (sDescriptionMode) {
			case DescriptionMode.Description:
				return sDescription || sName;
			case DescriptionMode.TechnicalName:
				return sName || sDescription;
			case DescriptionMode.Both:
				if ((!!sDescription && !!sName) &&
					(sDescription !== sName)) {
					return formatMessage(sI18NText, [sDescription, sName]);
				} else {
					return sDescription || sName;
				}
			default:
				return sDescription || sName;
			}
		},

		/**
		 * This formatter function returns a cstic value text for a given value
		 * 
		 * @param {object} oValue the cstic value to use for the formatter
		 * @param {string} sI18nRoundedValue: non-interval formatted value or if interval, the formatted bottom boundary value
		 * @param {string} sI18nIntervalText: Translatable pattern to join the interval boundaries if it is one
		 * @param {boolean} bNoUnitOfMeasure: identifies if it is unit of measure or not
		 * @return {string} formatted text that is going to be displayed.
		 * @private
		 * @function
		 */
		_formatValue: function (oValue, sI18nRoundedValue, sI18nIntervalText, bNoUnitOfMeasure) {
			// Format interval. 1 is the non-interval for any data type. The pattern mainly defines the interval order (i.e. for right-to-left languages)
			var sValueText = "";
			var sFormattedValueFrom = "";
			var sFormattedValueTo = "";
			var sUnitTextFrom = oValue.UnitFrom ? oValue.UnitFrom : oValue.Currency;
			var sUnitTextTo = oValue.UnitTo ? oValue.UnitTo : oValue.Currency;

			if (oValue.FormattedValueFrom && oValue.FormattedValueTo && !bNoUnitOfMeasure) {
				if (sUnitTextFrom && sUnitTextFrom === sUnitTextTo) {
					sFormattedValueFrom = oValue.FormattedValueFrom;
					sFormattedValueTo = oValue.FormattedValueTo + " " + sUnitTextFrom;
				} else if (sUnitTextFrom && sUnitTextFrom !== sUnitTextTo) {
					sFormattedValueFrom = oValue.FormattedValueFrom + " " + sUnitTextFrom;
					sFormattedValueTo = oValue.FormattedValueTo + " " + sUnitTextTo;
				} else {
					sFormattedValueFrom = oValue.FormattedValueFrom;
					sFormattedValueTo = oValue.FormattedValueTo;
				}
				sValueText = formatMessage(sI18nIntervalText, [sFormattedValueFrom, sFormattedValueTo]);
			} else if (oValue.FormattedValueFrom && oValue.FormattedValueTo && bNoUnitOfMeasure) {
				sFormattedValueFrom = oValue.FormattedValueFrom;
				sFormattedValueTo = oValue.FormattedValueTo;
				sValueText = formatMessage(sI18nIntervalText, [sFormattedValueFrom, sFormattedValueTo]);
			} else {
				sValueText = oValue.FormattedValueFrom;
				if (sUnitTextFrom && !bNoUnitOfMeasure) {
					sValueText = sValueText + " " + sUnitTextFrom;
				}
			}

			if (oValue.HasHighPrecision && oValue.FormattedValueFrom) {
				return sI18nRoundedValue + " " + sValueText;
			} else {
				return sValueText;
			}
		},

		/**
		 * Formatter. Returns the value of the first the assigned values.
		 * 
		 * @param {object[]} aAssignedValues All assigned values.
		 * @return {string} the description of string value of the first assigned value.
		 * @protected
		 */
		getFirstValue: function (aAssignedValues, sDescriptionMode, sI18nDescriptionText, sI8nTextForEmptyValue, sI18nRoundedValue,
			sI18nIntervalText, sFocused, bShowPreciseDecimalNumbers) {
			var oValueToDisplay = oFormatter.getRelevantValue(aAssignedValues);
			if (oValueToDisplay) {
				if ((sFocused === true || bShowPreciseDecimalNumbers) && oValueToDisplay.HasHighPrecision === true) {
					return oFormatter.getSingleHighPrecisionValue(aAssignedValues);
				} else {
					return oFormatter.getFormattedValueTextByValuePath(oValueToDisplay, sDescriptionMode, sI18nDescriptionText, sI8nTextForEmptyValue,
						sI18nRoundedValue, sI18nIntervalText, true);
				}
			}
			return "";
		},

		/**
		 * Formatter. Returns the value id of the first the assigned values.
		 * 
		 * @param {object[]} aAssignedValues All assigned values.
		 * @return {string} the id of the first assigned value.
		 * @protected
		 */
		getFirstValueId: function (aAssignedValues, sFocused) {
			var oValueToDisplay = oFormatter.getRelevantValue(aAssignedValues);
			if (oValueToDisplay) {
				var sKey = oValueToDisplay.ValueId;
				if (sKey === "") {
					return NaN;
				}
				return sKey;
			}
			return " ";
		},

		getSingleHighPrecisionValue: function (aAssignedValues) {
			if (aAssignedValues.length === 1) {
				var oValue = aAssignedValues[0];
				if (oValue.HasHighPrecision === true) {
					return oValue.TechnicalValueDisplay;
				} else {
					return "";
				}
			} else if (aAssignedValues.length > 1) {
				return "";
			}
		},

		getFormattedValueTextByValuePath: function (oValue, sDescriptionMode, sI18nDescriptionText, sI8nTextForEmptyValue,
			sI18nRoundedValue, sI18nIntervalText, bNoUnitOfMeasure) {
			return oFormatter.getFormattedValueTextWithDescription(oValue, sDescriptionMode, sI18nDescriptionText, sI8nTextForEmptyValue,
				sI18nRoundedValue, sI18nIntervalText, false, bNoUnitOfMeasure);
		},

		/**
		 * Usual case: Single valued characteristic. The first value is the value to be displayed. 
		 * 
		 * But for single-valued characteristics it may happen that the backend sends more than one value.
		 * This is the case if there is a non-processed (= invalid) value.
		 * The non-processed value can be identified by initial value id.
		 * It is regarded as "more relevant" because the user shall have the possibility 
		 * (or shall be forced) to correct his entry. 
		 * (And there will be a message telling him to do so.)
		 * 
		 */
		getRelevantValue: function (aAssignedValues) {
			var oRelevantValue;
			if (aAssignedValues.length === 1) {
				oRelevantValue = aAssignedValues[0];
			} else if (aAssignedValues.length > 1) {
				for (var i = 0; i < aAssignedValues.length; i++) {
					var sValueId = aAssignedValues[i].ValueId;
					if (!sValueId) {
						return aAssignedValues[i];
					}
				}
			}
			return oRelevantValue;
		},

		getPlaceholder: function (oCstic, sI18nDefaultValue, sI18nValueRangePrefix, sI18nTemplatePrefix, sI18nRoundedValue,
			sI18nIntervalText) {
			return oFormatter.getTooltip(oCstic, sI18nDefaultValue, sI18nValueRangePrefix, sI18nTemplatePrefix, sI18nRoundedValue,
				sI18nIntervalText);
		},

		getTooltip: function (oCstic, sI18nDefaultValue, sI18nValueRangePrefix, sI18nTemplatePrefix, sI18nRoundedValue,
			sI18nIntervalText, sI18nUnit, sI18nCurrency) {
			// First build the middle part, this displays value range with value range prefix or format template with format prefix
			var sText = "";
			if (oCstic.DomainHasIntervalValues) {
				var sConcatenatedDomainValues = oFormatter._getConcatenatedDomainValues(oCstic, sI18nRoundedValue, sI18nIntervalText);
				sText = formatMessage(sI18nValueRangePrefix, [sConcatenatedDomainValues]);
			} else {
				if (oCstic.UseTemplate && oCstic.Template.trim().length) {
					sText = formatMessage(sI18nTemplatePrefix, [oCstic.Template]);
				}
			}

			// Prefix the value range / format text with default i18n text if necessary
			if (oCstic.HasDefaultValues && sText) {
				sText = sI18nDefaultValue + "; " + sText;
			} else if (oCstic.HasDefaultValues) {
				sText = sI18nDefaultValue;
			}

			// Suffix the above result with currency/unit text + i18n currency/unit text
			if (sI18nUnit || sI18nCurrency) {
				var sCurrencyOrUnitText = oFormatter._getUnitOrCurrencyText(sI18nUnit, sI18nCurrency, oCstic.Unit, oCstic.Currency);
				if (sText && sCurrencyOrUnitText) {
					sText = sText + "; " + sCurrencyOrUnitText;
				} else if (sCurrencyOrUnitText) {
					sText = sCurrencyOrUnitText;
				}
			}

			return sText;
		},

		/**
		 * Formatter. Is used to create a string of all assigned values
		 * 
		 * @param {object[]} aAssignedValues All assigned values.
		 * @return {string} concatenated assigned values.
		 * @private
		 */
		getConcatenatedDescriptionValues: function (oCstic, sDescriptionMode, sI18nDescriptionText, sI18nRoundedValue, sI18nIntervalText,
			bShowPreciseDecimalNumbers) {
			var aFormattedValues = [];
			for (var i = 0; i < oCstic.AssignedValues.length; i++) {
				var oValue = oCstic.AssignedValues[i];
				aFormattedValues.push(oFormatter.getFormattedValueTextWithDescription(oValue, sDescriptionMode, sI18nDescriptionText, "",
					sI18nRoundedValue, sI18nIntervalText, bShowPreciseDecimalNumbers));
			}

			var sOutput = aFormattedValues.join("; ");
			if (!sOutput) {
				sOutput = EN_DASH;
			}
			return sOutput;
		},

		/**
		 * Concatenates the values into a string 
		 * (separated by semicolon)
		 * @private
		 * 
		 * Fitering drops the entry with value id '0' which is not a real value but only used as empty entry
		 * 
		 * The function this.getFormattedValueTextByValuePath used in the map function has useful defaults for second and third parameters.
		 */
		_getConcatenatedDomainValues: function (oCstic, sI18nRoundedValue, sI18nIntervalText) {
			var fnGetFormattedValueTextForConcat = function (oValue) {
				return oFormatter.getFormattedValueTextByValuePath(oValue, DescriptionMode.TechnicalName, "", "", sI18nRoundedValue,
					sI18nIntervalText);
			};
			var fnIsCalculatedValue = function (oValue) {
				return !oValue.IsMasterDataValue;
			};
			var fnIsMasterDataValue = function (oValue) {
				return oValue.IsMasterDataValue;
			};
			var aDomainValues = oCstic.DomainValues.filter(fnIsCalculatedValue);
			if (aDomainValues.length > 0) {
				var aAssignedValues = oCstic.AssignedValues.filter(fnIsCalculatedValue);
				aAssignedValues.forEach(function (oAssignedValue) {
					aDomainValues = aDomainValues.filter(function (oValue) {
						return oValue.ValueId !== oAssignedValue.ValueId;
					});
				});
			}
			if (aDomainValues.length === 0) {
				aDomainValues = oCstic.DomainValues.filter(fnIsMasterDataValue);
			}
			return aDomainValues.filter(oFormatter._fnCheckRealValue.bind(this)).map(fnGetFormattedValueTextForConcat).join("; ");
		},

		_getUnitOrCurrencyText: function (sI18nUnit, sI18nCurrency, sUnit, sCurrency) {
			// Also split up the currency for screen reader to read char by char
			if (sUnit) {

				var sUnitText = sUnit.split("").join(ZERO_WIDTH_NO_BREAK_SPACE);
				return formatMessage(sI18nUnit, [sUnitText]);

			} else if (sCurrency) {

				var sCurrencyText = sCurrency.split("").join(ZERO_WIDTH_NO_BREAK_SPACE);
				return formatMessage(sI18nCurrency, [sCurrencyText]);

			} else {
				return "";
			}

		},

		/**
		 * Formatter. Returns the unprocessed values for the assigned values.
		 * 
		 * @param {object[]} aAssignedValues All assigned values.
		 * @return {string} the unprocessd value.
		 * @private
		 */
		getUnprocessedValue: function (aAssignedValues) {
			var sValueToBeDisplayed = "";

			aAssignedValues.forEach(function (oAssignedValue) {
				if (oAssignedValue.ValueId === "") {
					sValueToBeDisplayed += oAssignedValue.FormattedValueFrom;
				}
			});
			return sValueToBeDisplayed;
		},

		/**
		 * Entry with value id '' is not a real value but only used as empty entry
		 */
		_fnCheckRealValue: function (oValue) {
			var sValueId = oFormatter._getValueIdFromValue(oValue);
			return sValueId !== ""; // see comment above 
		},

		_getValueIdFromValue: function (oValue) {
			return oValue.ValueId;
		}
	};
	return oFormatter;
}, true);
