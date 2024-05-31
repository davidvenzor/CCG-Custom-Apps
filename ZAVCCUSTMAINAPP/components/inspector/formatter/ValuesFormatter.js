/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/base/security/encodeXML",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/i18n",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants"
], function (encodeXML, i18n, Constants) {
	"use strict";

	var VALUE_DATA_TYPE = Constants.characteristicValue.valueDataType;
	var INTERVAL_TYPE = Constants.characteristicValue.intervalType;

	/**
	 * Formatter for display float intervals
	 * @param {String} sIntervalType - Value of IntervalType property
	 * @param {String} sValueFrom - ValueFrom property
	 * @param {String} sValueTo - ValueTo property
	 * @param {Boolean} bShowPreciseNumbers - Indicator whether the precise value should be shown
	 * @returns {String} The formatted float interval
	 * @private
	 */
	var fnFormatFloatInterval = function (sIntervalType, sValueFrom, sValueTo, bShowPreciseNumbers) {
		var sFrom = sValueFrom,
			sTo = sValueTo,
			sI18nKey;

		if (bShowPreciseNumbers) {
			switch (sIntervalType) {
				case INTERVAL_TYPE.RightExcludedInterval:
					sI18nKey = "vchclf_insp_values_template_right_excluded_intervals";
					break;
				case INTERVAL_TYPE.ExcludedInterval:
					sI18nKey = "vchclf_insp_values_template_excluded_intervals";
					break;
				case INTERVAL_TYPE.LeftExcludedInterval:
					sI18nKey = "vchclf_insp_values_template_left_excluded_intervals";
					break;
				default:
					sI18nKey = "vchclf_insp_values_template_closed_intervals";
					break;
			}
		} else {
			// If both boundaries are rounded to the same value, the FormattedValueTo will be empty
			if (!sValueTo) {
				sFrom = sTo = i18n.getTextWithParameters("vchclf_insp_values_template_precise_value", [sValueFrom]);
			}

			sI18nKey = "vchclf_insp_values_template_value_range";
		}

		return i18n.getTextWithParameters(sI18nKey, [sFrom, sTo]);
	};

	/**
	 * Formatter for display float characteristic values
	 * @param {String} sIntervalType - Value of IntervalType property
	 * @param {Boolean} bHasHighPrecision - Value of HasHighPrecision property
	 * @param {String} sValueFrom - ValueFrom property
	 * @param {String} sValueTo - ValueTo property
	 * @param {Boolean} bShowPreciseNumbers - Indicator whether the precise value should be shown
	 * @returns {String} The formatted float characteristic value
	 * @private
	 */
	var fnFormatFloatCharacteristicValue = function (sIntervalType, bHasHighPrecision, sValueFrom, sValueTo, bShowPreciseNumbers) {
		switch (sIntervalType) {
			case INTERVAL_TYPE.RightExcludedInterval:
			case INTERVAL_TYPE.ClosedInterval:
			case INTERVAL_TYPE.ExcludedInterval:
			case INTERVAL_TYPE.LeftExcludedInterval:
				return fnFormatFloatInterval(
					sIntervalType, sValueFrom, sValueTo, bShowPreciseNumbers);
			case INTERVAL_TYPE.AssignableExcludedInterval:
				// This case should be handled separately from the other interval types, because in this
				// case numerical rounding error is happened: e.g. 1/3 + 1/3 + 1/3 => [0.9999 - 1.0001]
				return bShowPreciseNumbers ?
					i18n.getTextWithParameters("vchclf_insp_values_template_closed_intervals",
						[sValueFrom, sValueTo]) :
					i18n.getTextWithParameters("vchclf_insp_values_template_precise_value", [sValueFrom]);
			default:
				return bHasHighPrecision && !bShowPreciseNumbers ?
					i18n.getTextWithParameters("vchclf_insp_values_template_precise_value", [sValueFrom]) :
					sValueFrom;
		}
	};

	/**
	 * Collection of formatters of Values
	 */
	return {
		/**
		 * Provides the title for the value item
		 * @param {String} sFormattedValueFrom - FormattedValueFrom property of CharacteristicValueSet
		 * @param {String} sFormattedValueTo - FormattedValueTo property of CharacteristicValueSet
		 * @param {Boolean} bHasHighPrecision - HasHighPrecision property of CharacteristicValueSet
		 * @param {String} sDescription - Description property of CharacteristicValueSet
		 * @returns {String} The title of the value
		 */
		getTitleOfValueItem: function (sFormattedValueFrom, sFormattedValueTo, bHasHighPrecision, sDescription) {
			if (sDescription) {
				return sDescription;
			} else if (bHasHighPrecision) {
				return i18n.getTextWithParameters("vchclf_insp_values_template_precise_value", sFormattedValueFrom);
			} else if (sFormattedValueTo) {
				return i18n.getTextWithParameters("vchclf_insp_values_template_value_range",
					[sFormattedValueFrom, sFormattedValueTo]);
			} else {
				return sFormattedValueFrom;
			}
		},

		/**
		 * Provides attribute for the value list item
		 * @param {Boolean} bHasHighPrecision - HasHighPrecision property of CharacteristicValueSet
		 * @param {String} sFormattedValueFrom - FormattedValueFrom property of CharacteristicValueSet
		 * @param {String} sDescription - Description property of CharacteristicValueSet
		 * @returns {String} The attribute for the value list item
		 */
		getAttributeOfValueItem: function (bHasHighPrecision, sFormattedValueFrom, sDescription) {
			if (sDescription) {
				return sFormattedValueFrom;
			} else if (bHasHighPrecision) {
				return i18n.getText("vchclf_insp_values_precise_value_available");
			} else {
				return "";
			}
		},

		/**
		 * Provides label for the value name
		 * @param {Boolean} bHasHighPrecision - HasHighPrecision property of CharacteristicValueSet
		 * @returns {String} The label for the value name
		 */
		getLabelForValueName: function (bHasHighPrecision) {
			if (bHasHighPrecision) {
				return i18n.getText("vchclf_insp_values_properties_precise_value");
			} else {
				return i18n.getText("vchclf_insp_values_properties_value");
			}
		},

		/**
		 * Provides text for the value name property
		 * @param {Boolean} bHasHighPrecision - HasHighPrecision property of CharacteristicValueSet
		 * @param {String} sFormattedValueFrom - FormattedValueFrom property of CharacteristicValueSet
		 * @param {String} sFormattedValueTo - FormattedValueTo property of CharacteristicValueSet
		 * @param {String} sTechnicalValueDisplay - TechnicalValueDisplay property of CharacteristicValueSet
		 * @returns {String} The text for the value name property
		 */
		getTextForValueName: function (bHasHighPrecision, sFormattedValueFrom, sFormattedValueTo, sTechnicalValueDisplay) {
			if (bHasHighPrecision) {
				return sTechnicalValueDisplay;
			} else if (sFormattedValueTo) {
				return i18n.getTextWithParameters("vchclf_insp_values_template_value_range",
					[sFormattedValueFrom, sFormattedValueTo]);
			} else {
				return sFormattedValueFrom;
			}
		},

		/** Provides formatting for the status text property
		 * @param {Int} iExclusionType - ExclusionType property of CharacteristicValueSet
		 * @param {Boolean} bIsSelected - IsSelected property of CharacteristicValueSet
		 * @returns {String} The formatted value
		 */
		statusTextForValues: function (iExclusionType, bIsSelected) {
			if (bIsSelected) {
				return i18n.getText("vchclf_insp_values_status_selected");
			}

			switch (iExclusionType) {
				case Constants.characteristicValue.exclusionType.Excluded:
					return i18n.getText("vchclf_insp_values_status_excluded");
				case Constants.characteristicValue.exclusionType.PartiallyExcluded:
					return i18n.getText("vchclf_insp_values_status_partially_excluded");
				case Constants.characteristicValue.exclusionType.Selectable:
				default:
					return "";
			}
		},

		/** Provides formatting for the status state property
		 * @param {Int} iExclusionType - ExclusionType property of CharacteristicValueSet
		 * @param {Boolean} bSelected - IsSelected property of CharacteristicValueSet
		 * @returns {String} The state value
		 */
		statusStateForValues: function (iExclusionType, bSelected) {
			switch (iExclusionType) {
				case Constants.characteristicValue.exclusionType.Excluded:
				case Constants.characteristicValue.exclusionType.PartiallyExcluded:
					return bSelected ? sap.ui.core.ValueState.Error : sap.ui.core.ValueState.Warning;
				case Constants.characteristicValue.exclusionType.Selectable:
				default:
					return sap.ui.core.ValueState.Success;
			}
		},

		/** Provides value for selected Label
		 * @param {String} sIntervalType - IntervalType property of CharacteristicValueSet
		 * @returns {String} The selected label text
		 */
		selectedLabelForValue: function (sIntervalType) {
			if (sIntervalType === INTERVAL_TYPE.ExactValue) {
				return i18n.getText("vchclf_insp_values_status_selected");
			} else {
				return i18n.getText("vchclf_insp_values_status_value_in_range_selected");
			}
		},

		/** Provides value for selected Text
		 * @param {Boolean} bSelected - IsSelected property of CharacteristicValueSet
		 * @returns {String} Yes|No
		 */
		selectedTextForValue: function (bSelected) {
			if (bSelected) {
				return i18n.getText("vchclf_insp_properties_yes");
			} else {
				return i18n.getText("vchclf_insp_properties_no");
			}
		},

		/** Provides value for selectable
		 * @param {String} sIntervalType - IntervalType property of CharacteristicValueSet
		 * @returns {String} The selectable value
		 */
		selectableLabelForValue: function (sIntervalType) {
			if (sIntervalType === INTERVAL_TYPE.ExactValue) {
				return i18n.getText("vchclf_insp_values_status_value_selectability");
			} else {
				return i18n.getText("vchclf_insp_values_status_value_in_range_selectability");
			}
		},

		/** Provides value for selectable Text
		 * @param {Int} iExclusionType - ExclusionType property of CharacteristicValueSet
		 * @returns {String} The state value
		 */
		selectableTextForValue: function (iExclusionType) {
			switch (iExclusionType) {
				case Constants.characteristicValue.exclusionType.Excluded:
					return i18n.getText("vchclf_insp_values_status_excluded");
				case Constants.characteristicValue.exclusionType.PartiallyExcluded:
					return i18n.getText("vchclf_insp_values_status_partially_excluded");
				case Constants.characteristicValue.exclusionType.Selectable:
					return i18n.getText("vchclf_insp_values_status_selectable");
				default:
					return "";
			}
		},

		/**
		 * Formatter for display characteristic values on the UI
		 * @param {Object} oEntity - Entity which contains Characteristic Value related informations
		 * @param {Boolean} oEntity.HasHighPrecision - HasHighPrecision property of the entity
		 * @param {(String|int)} oEntity.IntervalType - IntervalType property of the entity
		 * @param {int} oEntity.ValueDataType - ValueDataType property of the entity
		 * @param {String} oEntity.FormattedValueFrom - FormattedValueFrom property of the entity
		 * @param {String} oEntity.FormattedValueTo - FormattedValueTo property of the entity
		 * @param {String} oEntity.TechnicalValueFrom - TechnicalValueFrom property of the entity
		 * @param {String} oEntity.TechnicalValueTo - TechnicalValueTo property of the entity
		 * @param {Boolean} bShowPreciseNumbers - Indicator whether the precise value should be shown
		 * @returns {String} The formatted characteristic value
		 * @public
		 */
		formatCharacteristicValue: function (oEntity, bShowPreciseNumbers) {
			// The Interval Type is converted to string to be consistent with constants for IntervalType
			// property of CharacteristicValue and trace related entities
			var sIntervalType = oEntity.IntervalType.toString();
			var sValueFrom = bShowPreciseNumbers ? oEntity.TechnicalValueFrom : oEntity.FormattedValueFrom;
			var sValueTo = bShowPreciseNumbers ? oEntity.TechnicalValueTo : oEntity.FormattedValueTo;

			switch (oEntity.ValueDataType) {
				case VALUE_DATA_TYPE.Integer:
					// In case of integers, the interval type can only be closed interval or exact value
					return sIntervalType === INTERVAL_TYPE.ClosedInterval ?
						i18n.getTextWithParameters("vchclf_insp_values_template_value_range", [sValueFrom, sValueTo]) :
						sValueFrom;
				case VALUE_DATA_TYPE.Float:
					return fnFormatFloatCharacteristicValue(
						sIntervalType, oEntity.HasHighPrecision, sValueFrom, sValueTo, bShowPreciseNumbers);
				default:
					return encodeXML(oEntity.TechnicalValueFrom);
			}
		}
	};
});
