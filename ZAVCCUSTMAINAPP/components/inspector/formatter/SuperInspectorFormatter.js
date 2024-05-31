/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/i18n",
	"sap/ui/core/format/DateFormat",
	"sap/ui/core/format/NumberFormat"
], function (InspectorModel, i18n, DateFormat, NumberFormat) {
	"use strict";

	/**
	 * Mixes the properties of configured and super objects in case of showing mixed view
	 * @param {String} sConfValue - property of configured object
	 * @param {String} sSuperValue - property of super object
	 * @returns {String} - the mixed property
	 */
	var fnMixConfAndSuperValues = function (sConfValue, sSuperValue) {
		if (sConfValue === sSuperValue || !sSuperValue) {
			return sConfValue;
		} else {
			var sSuperInBrackets = "<span style=\"font-style: italic;\">" +
				i18n.getTextWithParameters("vchclf_insp_common_text_in_brackets", sSuperValue) + "</span>";

			return i18n.getTextWithParameters("vchclf_insp_conf_super_mix_value", [sConfValue, sSuperInBrackets]);
		}
	};

	/**
	 * Returns the Super Inspector related value based on the state of the Show Super Inspector button and the
	 * IsExcludedItem flag
	 * @param {String} sConfValue - property of configured object
	 * @param {String} sSuperValue - property of super object
	 * @param {Boolean} bIsExcludedItem - flag whether the object is excluded or not
	 * @param {Boolean} bIsSuperInspectorShown - flag whether the show super inspector button is turned ON
	 * @returns {String} the formatted value
	 * @private
	 */
	var fnReturnValueBasedOnInspectorState = function (sConfValue, sSuperValue, bIsExcludedItem, bIsSuperInspectorShown) {
		if (!InspectorModel.getIsSuperInspectorAvailable()) {
			return sConfValue;
		} else if (bIsExcludedItem) {
			return sSuperValue;
		} else if (!bIsSuperInspectorShown) {
			return sConfValue;
		} else {
			return fnMixConfAndSuperValues(sConfValue, sSuperValue);
		}
	};

	/**
	 * Creates mixed value for Super Inspector related properties which contains concatenation of ID and Description
	 * @param {String} sConfId - ID of property of configured object
	 * @param {String} sConfDesc - description of property of configured object
	 * @param {String} sSuperId - ID of property of super object
	 * @param {String} sSuperDesc - description of property of super object
	 * @param {Boolean} bIsExcludedItem - flag whether the object is excluded or not
	 * @param {Boolean} bIsSuperInspectorShown - flag whether the show super inspector button is turned ON
	 * @returns {String} the formatted value
	 */
	var fnConcatenateIdAndDescription = function (sConfId, sConfDesc, sSuperId, sSuperDesc, bIsExcludedItem, bIsSuperInspectorShown) {
		if (sSuperId === undefined && sConfId === undefined) {
			return "";
		}

		var sConfValue = sConfDesc ? i18n.getTextWithParameters(
			"vchclf_insp_properties_concatenated_id_and_descr", [sConfDesc, sConfId]) : sConfId;
		var sSuperValue = sSuperDesc ? i18n.getTextWithParameters(
			"vchclf_insp_properties_concatenated_id_and_descr", [sSuperDesc, sSuperId]) : sSuperId;

		return fnReturnValueBasedOnInspectorState(sConfValue, sSuperValue, bIsExcludedItem, bIsSuperInspectorShown);
	};

	/**
	 * Returns the value without mix of them. In case of the Super Inspector is available returns the value of the
	 * Super property, in other cases returns the Configured one
	 * @param {String} sConfValue - property of configured object
	 * @param {String} sSuperValue - property of super object
	 * @returns {String} the formatted value
	 */
	var fnFormatValueWithoutMix = function (sConfValue, sSuperValue) {
		if (sSuperValue === undefined && sConfValue === undefined) {
			return "";
		}

		return InspectorModel.getIsSuperInspectorAvailable() ? sSuperValue : sConfValue;
	};

	/**
	 * Collection of formatters of Super Inspector
	 */
	return {
		/**
		 * Creates mixed value for Super Inspector related properties which contains concatenation of ID and Description
		 * @param {String} sConfId - ID of property of configured object
		 * @param {String} sConfDesc - description of property of configured object
		 * @param {String} sSuperId - ID of property of super object
		 * @param {String} sSuperDesc - description of property of super object
		 * @param {Boolean} bIsExcludedItem - flag whether the object is excluded or not
		 * @param {Boolean} bIsSuperInspectorShown - flag whether the show super inspector button is turned ON
		 * @returns {String} the formatted value
		 */
		concatenateIdAndDescription: function (sConfId, sConfDesc, sSuperId, sSuperDesc, bIsExcludedItem, bIsSuperInspectorShown) {
			return fnConcatenateIdAndDescription(sConfId, sConfDesc, sSuperId, sSuperDesc, bIsExcludedItem, bIsSuperInspectorShown);
		},

		/**
		 * Returns whether the value of property which has been formatted by concatenateIdAndDescription function is not empty
		 * @param {String} sConfId - ID of property of configured object
		 * @param {String} sConfDesc - description of property of configured object
		 * @param {String} sSuperId - ID of property of super object
		 * @param {String} sSuperDesc - description of property of super object
		 * @param {Boolean} bIsExcludedItem - flag whether the object is excluded or not
		 * @param {Boolean} bIsSuperInspectorShown - flag whether the show super inspector button is turned ON
		 * @returns {Boolean} flag whether the value is not empty
		 */
		isConcatenatedValueNotEmpty: function (sConfId, sConfDesc, sSuperId, sSuperDesc, bIsExcludedItem, bIsSuperInspectorShown) {
			return !!fnConcatenateIdAndDescription(sConfId, sConfDesc, sSuperId, sSuperDesc, bIsExcludedItem, bIsSuperInspectorShown);
		},

		/**
		 * Creates mixed value for Super Inspector related properties which contains quantity with unit of measure
		 * @param {String} sConfQuantity - quantity of property of configured object
		 * @param {String} sConfUom - unit of measure of property of configured object
		 * @param {String} sSuperQuantity - quantity of property of super object
		 * @param {String} sSuperUom - unit of measure of property of super object
		 * @param {Boolean} bIsExcludedItem - flag whether the object is excluded or not
		 * @param {Boolean} bIsSuperInspectorShown - flag whether the show super inspector button is turned ON
		 * @returns {String} the formatted value
		 */
		formatQtyWithUom: function (sConfQuantity, sConfUom, sSuperQuantity, sSuperUom, bIsExcludedItem, bIsSuperInspectorShown) {
			if (sSuperQuantity === undefined && sConfQuantity === undefined) {
				return "";
			}

			var oQuantityFormat = NumberFormat.getFloatInstance();
			var fConfQuantity = oQuantityFormat.format(parseFloat(sConfQuantity));
			var fSuperQuantity = oQuantityFormat.format(parseFloat(sSuperQuantity));

			var sConfValue = fConfQuantity ? i18n.getTextWithParameters(
				"vchclf_insp_quantity_content_qtyuom", [fConfQuantity, sConfUom]) : "";
			var sSuperValue = fSuperQuantity ? i18n.getTextWithParameters(
				"vchclf_insp_quantity_content_qtyuom", [fSuperQuantity, sSuperUom]) : "";

			return fnReturnValueBasedOnInspectorState(sConfValue.trim(), sSuperValue.trim(), bIsExcludedItem, bIsSuperInspectorShown);
		},

		/**
		 * Creates mixed value for Super Inspector related properties which contains value range with unit of measure
		 * @param {String} sConfValueFrom - value from of property of configured object
		 * @param {String} sConfValueTo - value to of property of configured object
		 * @param {String} sConfValueUom - unit of measure of property of configured object
		 * @param {String} sSuperValueFrom - value from of property of super object
		 * @param {String} sSuperValueTo - value to of property of super object
		 * @param {String} sSuperValueUom - unit of measure of property of super object
		 * @param {Boolean} bIsExcludedItem - flag whether the object is excluded or not
		 * @param {Boolean} bIsSuperInspectorShown - flag whether the show super inspector button is turned ON
		 * @returns {String} the formatted value
		 */
		formatQtyFromTo: function (sConfValueFrom, sConfValueTo, sConfValueUom, sSuperValueFrom, sSuperValueTo, sSuperValueUom, bIsExcludedItem,
			bIsSuperInspectorShown) {
			if (sSuperValueFrom === undefined && sConfValueFrom === undefined) {
				return "";
			}

			var oQuantityFormat = NumberFormat.getFloatInstance();
			var fConfValueFrom = oQuantityFormat.format(parseFloat(sConfValueFrom));
			var fConfValueTo = oQuantityFormat.format(parseFloat(sConfValueTo));
			var fSuperValueFrom = oQuantityFormat.format(parseFloat(sSuperValueFrom));
			var fSuperValueTo = oQuantityFormat.format(parseFloat(sSuperValueTo));

			var sConfRange = i18n.getTextWithParameters("vchclf_insp_values_template_value_range", [fConfValueFrom, fConfValueTo]);
			var sSuperRange = i18n.getTextWithParameters("vchclf_insp_values_template_value_range", [fSuperValueFrom, fSuperValueTo]);

			var sConfValue = i18n.getTextWithParameters("vchclf_insp_quantity_content_qtyuom", [sConfRange, sConfValueUom]);
			var sSuperValue = i18n.getTextWithParameters("vchclf_insp_quantity_content_qtyuom", [sSuperRange, sSuperValueUom]);

			return fnReturnValueBasedOnInspectorState(sConfValue, sSuperValue, bIsExcludedItem, bIsSuperInspectorShown);
		},

		/**
		 * Creates mixed value for Super Inspector related properties which contains date
		 * @param {String} sConfDate - date property of configured object
		 * @param {String} sSuperDate - date property of super object
		 * @param {Boolean} bIsExcludedItem - flag whether the object is excluded or not
		 * @param {Boolean} bIsSuperInspectorShown - flag whether the show super inspector button is turned ON
		 * @returns {String} the formatted value
		 */
		formatDate: function (sConfDate, sSuperDate, bIsExcludedItem, bIsSuperInspectorShown) {
			if (sSuperDate === undefined && sConfDate === undefined) {
				return "";
			}

			var oDateFormat = DateFormat.getDateInstance({
				style: "medium"
			});
			var sConfValue = sConfDate ? oDateFormat.format(sConfDate) : "";
			var sSuperValue = sSuperDate ? oDateFormat.format(sSuperDate) : "";

			return fnReturnValueBasedOnInspectorState(sConfValue, sSuperValue, bIsExcludedItem, bIsSuperInspectorShown);
		},

		/**
		 * Creates mixed value for simple Super Inspector related properties
		 * @param {String} sConfValue - property of configured object
		 * @param {String} sSuperValue - property of super object
		 * @param {Boolean} bIsExcludedItem - flag whether the object is excluded or not
		 * @param {Boolean} bIsSuperInspectorShown - flag whether the show super inspector button is turned ON
		 * @returns {String} the formatted value
		 */
		formatValue: function (sConfValue, sSuperValue, bIsExcludedItem, bIsSuperInspectorShown) {
			if (sSuperValue === undefined && sConfValue === undefined) {
				return "";
			}

			return fnReturnValueBasedOnInspectorState(sConfValue, sSuperValue, bIsExcludedItem, bIsSuperInspectorShown);
		},

		/**
		 * Returns the value without mix of them. In case of the Super Inspector is available returns the value of the
		 * Super property, in other cases returns the Configured one
		 * @param {String} sConfValue - property of configured object
		 * @param {String} sSuperValue - property of super object
		 * @returns {String} the formatted value
		 */
		formatValueWithoutMix: function (sConfValue, sSuperValue) {
			return fnFormatValueWithoutMix(sConfValue, sSuperValue);
		},

		/**
		 * Returns whether the value of property which has been formatted by formatValueWithoutMix function is not empty
		 * Super property, in other cases returns the Configured one
		 * @param {String} sConfValue - property of configured object
		 * @param {String} sSuperValue - property of super object
		 * @returns {Boolean} flag whether the value is not empty
		 */
		isNotMixedValueNotEmpty: function (sConfValue, sSuperValue) {
			return !!fnFormatValueWithoutMix(sConfValue, sSuperValue);
		},

		/**
		 * Returns the proper value of flag property. If the Super Inspector is not available, returns the value of the
		 * Super property. In other cases returns the value of the Configured property.
		 * @param {Boolean} bConfFlag - flag property of configured object
		 * @param {Boolean} bSuperFlag - flag property of super object
		 * @returns {Boolean} the formatted flag value
		 */
		getValueForFlagProperty: function (bConfFlag, bSuperFlag) {
			return InspectorModel.getIsSuperInspectorAvailable() ? !!bSuperFlag : !!bConfFlag;
		},

		/**
		 * Creates mixed value for Super Inspector related properties which value should be 'None' in case of no text
		 * @param {String} sConfText - text property of configured object
		 * @param {String} sSuperText - text property of super object
		 * @param {Boolean} bIsExcludedItem - flag whether the object is excluded or not
		 * @param {Boolean} bIsSuperInspectorShown - flag whether the show super inspector button is turned ON
		 * @returns {String} the formatted value
		 */
		setNoneIfNoTextIsPassed: function (sConfText, sSuperText, bIsExcludedItem, bIsSuperInspectorShown) {
			if (sSuperText === undefined && sConfText === undefined) {
				return "";
			}

			var sConfValue = sConfText ? sConfText : i18n.getText("vchclf_insp_properties_none");
			var sSuperValue = sSuperText ? sSuperText : i18n.getText("vchclf_insp_properties_none");

			return fnReturnValueBasedOnInspectorState(sConfValue, sSuperValue, bIsExcludedItem, bIsSuperInspectorShown);
		}
	};
});
