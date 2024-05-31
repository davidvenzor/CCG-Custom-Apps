/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/i18n",
	"sap/ui/core/format/NumberFormat"
], function (i18n, NumberFormat) {
	"use strict";

	/**
	 * Collection of formatters used by multiple views
	 */
	return {

		/**
		 * Provides formatting for ChangedBy and ChangedByText
		 * @param {String} sChangedByFullName - Full name
		 * @param {String} sChangedBy - Username
		 * @returns {String} The formatted value
		 * @public
		 */
		changedByFormatter: function (sChangedByFullName, sChangedBy) {
			return sChangedByFullName && sChangedBy ?
				i18n.getTextWithParameters("vchclf_sim_changed_by_bracket", [sChangedByFullName, sChangedBy]) :
				sChangedBy;
		},

		/**
		 * Provides formatting from boolean to yes/no
		 * @param {Boolean} bFlag - Boolean value
		 * @returns {String} The formatted value
		 * @public
		 */
		convertBoolToYesorNoFormatter: function (bFlag) {
			return bFlag ?
				i18n.getText("vchclf_insp_properties_yes") :
				i18n.getText("vchclf_insp_properties_no");
		},

		/**
		 * Provides formatting for status according to 0 1 2 status
		 * @param {String} sStatus - Status property from the ODataModel
		 * @returns {String} The formatted value
		 * @public
		 */
		statusFormatter: function (sStatus) {
			//TODO: provide constants for the statuses
			switch (sStatus) {
				case "0":
					return sap.ui.core.ValueState.Warning;
				case "1":
					return sap.ui.core.ValueState.Success;
				case "2":
					return sap.ui.core.ValueState.Error;
				default:
					return sap.ui.core.ValueState.None;
			}
		},

		/**
		 * Converts incoming string value to boolean. True if a non-empty string is passed, false otherwise.
		 * @param {String} sValue - Incoming string value
		 * @returns {Boolean} The formatted value
		 * @public
		 */
		stringToBooleanFormatter: function (sValue) {
			return typeof sValue === "string" && !!sValue;
		},

		/**
		 * Formats Quantity and Unit of Measure
		 * @param {String} sQuantity - Quantity value
		 * @param {String} sUom - Unit of Measure value
		 * @returns {String} - the formatted value
		 * @public
		 */
		formatQtyWithUom: function (sQuantity, sUom) {
			var oQuantityFormat = NumberFormat.getFloatInstance();
			var fQuantity = oQuantityFormat.format(parseFloat(sQuantity));

			return fQuantity ?
				i18n.getTextWithParameters("vchclf_insp_quantity_content_qtyuom", [fQuantity, sUom]) :
				"";
		},

		/**
		 * Format quantity from to
		 * @param {String} sValueFrom - ValueFrom property from the ODataModel
		 * @param {String} sValueTo - ValueTo property from the ODataModel
		 * @param {String} sUom - Unit of measure value
		 * @returns {String} The formatted value
		 * @public
		 */
		formatQtyFromTo: function (sValueFrom, sValueTo, sUom) {
			if (sValueFrom === undefined || sValueTo === undefined) {
				return "";
			}

			var oFloatFormat = NumberFormat.getFloatInstance();
			var fFrom = oFloatFormat.format(parseFloat(sValueFrom));
			var fTo = oFloatFormat.format(parseFloat(sValueTo));
			var sRange = i18n.getTextWithParameters("vchclf_insp_values_template_value_range", [fFrom, fTo]);

			return i18n.getTextWithParameters("vchclf_insp_quantity_content_qtyuom", [sRange, sUom]);
		},

		/**
		 * Get the tooltip for the dependencies tab based on it is enabled or disabled
		 * @param {Boolean} bEnabled - Flag whether the dependencies tab is enabled
		 * @returns {String} Text for the tooltip
		 * @public
		 */
		getTooltipOfDependenciesTab: function (bEnabled) {
			return bEnabled ?
				i18n.getText("vchclf_objectheader_tab_dependencies") :
				i18n.getText("vchclf_objectheader_tab_dependencies_empty_list");
		},

		//TODO: perhaps later we should define an own BOMFormatter
		/**
		 * BOM header visibility
		 * @param {String} sComponentId - BOM Component Id
		 * @returns {Boolean} visibility
		 * @public
		 */
		isBOMHeaderVisible: function (sComponentId) {
			return !!sComponentId;
		},

 		//TODO: perhaps later we should define an own BOMFormatter
		/**
		 * Get the subtitle of the BOM item group
		 * @param {String} sComponentId - BOM Component Id
		 * @returns {String} Formatted subtitle
		 * @public
		 */
		getSubtitleOfBOMItem: function (sComponentId) {
			return sComponentId ?
				i18n.getText("vchclf_objectheader_subtitle_bomheader") :
				i18n.getText("vchclf_objectheader_subtitle_bomitem");
		},

		/**
		 * Get the tooltip for the values tab based on the inspected object is part of the model or not
		 * @param {Boolean} bIsObjectPartOfModel - Flag whether the object is part of the model
		 * @returns {String} Text of the tooltip
		 * @public
		 */
		getTooltipOfValuesTab: function (bIsObjectPartOfModel) {
			return bIsObjectPartOfModel ? i18n.getText("vchclf_objectheader_tab_values") :
				i18n.getText("vchclf_objectheader_tab_values_cstic_not_part_of_model");
		},

		/**
		 * Get the tooltip for the components tab based on it is enabled or disabled
		 * @param {Boolean} bEnabled - Flag whether the components tab is enabled
		 * @returns {String} Text for the tooltip
		 * @public
		 */
		getTooltipOfComponentsTab: function (bEnabled) {
			return bEnabled ?
				i18n.getText("vchclf_objectheader_tab_component") :
				i18n.getText("vchclf_objectheader_tab_component_empty_list");
		},

		/**
		 * Get the tooltip for the PRTs tab based on it is enabled or disabled
		 * @param {Boolean} bEnabled - Flag whether the PRTs tab is enabled
		 * @returns {String} Text for the tooltip
		 * @public
		 */
		getTooltipOfPRTsTab: function (bEnabled) {
			return bEnabled ?
				i18n.getText("vchclf_objectheader_tab_prt") :
				i18n.getText("vchclf_objectheader_tab_prt_empty_list");
		},

		/**
		 * Concatenate ID and description of a property of entity
		 * @param {String} sId - ID of the property
		 * @param {String} sDescription - Description of the property
		 * @returns {String} The concatenated property
		 * @public
		 */
		concatenateIdAndDescription: function (sId, sDescription) {
			return sDescription ?
				i18n.getTextWithParameters("vchclf_insp_properties_concatenated_id_and_descr", [sDescription, sId]) :
				sId;
		},

		/**
		 * Returns "(none)" if text is not passed
		 * @param {String} sText - String Text passed
		 * @returns {String} The formatted property
		 * @public
		 */
		setNoneIfNoTextIsPassed: function (sText) {
			return sText ? sText : i18n.getText("vchclf_insp_properties_none");
		}
	};
});
