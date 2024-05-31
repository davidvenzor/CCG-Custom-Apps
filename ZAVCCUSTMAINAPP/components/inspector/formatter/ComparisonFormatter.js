/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/core/ValueState"
], function (ValueState) {
	"use strict";

	/**
	 * Formatter for the comparison view
	 */
	return {
		
		/**
		 * Returns the sap icon src string for the given DiffItemType
		 * @param {integer} iDiffItemType - type of item to which the diff belongs
		 * @return {string} the sap icon src string
		 * @public
		 */
		getIconForDiffItemType: function(iDiffItemType) {
			switch (iDiffItemType) {
				// instance
				case 1: {
					return "sap-icon://product";
				}
				// group
				case 2: {
					return "sap-icon://group-2";
				}
				// cstic
				case 3: {
					return "sap-icon://tag";
				}
				// value
				case 4: {
					return "sap-icon://multi-select";
				}
				default: {
					return null;
				}
			}
		},
		
		/**
		 * Returns a value state derived from the given DiffType
		 * @param {integer} iDiffType - type of diff
		 * @return {sap.ui.core.ValueState} the corresponding value state
		 * @public
		 */
		getStateForDiffType: function(iDiffType) {
			switch (iDiffType) {
				// added
				case 1: {
					return ValueState.Success;
				}
				// removed
				case 2: {
					return ValueState.Error;
				}
				// changed
				case 3: {
					return ValueState.Warning;
				}
				default: {
					return ValueState.None;
				}
			}
		},
		
		/**
		 * Returns the text for given DiffType
		 * @param {sap.ui.core.mvc.Controller} oController - the view controller
		 * @param {integer} iDiffType - type of diff
		 * @return {string} the localized text to show for the specific diff
		 * @public
		 */
		getTextForDiffType: function(oController, iDiffType) {
			var oRb = oController.getView().getModel("i18n").getResourceBundle();
			switch (iDiffType) {
				// added
				case 1: {
					return oRb.getText("vchclf_comparison_added");
				}
				// removed
				case 2: {
					return oRb.getText("vchclf_comparison_removed");
				}
				// changed
				case 3: {
					return oRb.getText("vchclf_comparison_changed");
				}
				default: {
					return null;
				}
			}
		},
		
		/**
		 * Returns the description for the given diff item
		 * @param {object} oItem - the difference item as retrieved from odata service
		 * @return {string} - the localized item description
		 * @public
		 */
		getItemDescription: function(oItem) {
			switch (oItem.DiffItemType) {
				// instance
				case 1: {
					return oItem.ComponentDescription;
				}
				// group
				case 2: {
					return oItem.GroupDescription;
				}
				// cstic
				case 3: {
					return oItem.CsticDescription;
				}
				// value
				case 4: {
					return oItem.CsticDescription;
				}
				default: {
					throw Error("Unhandled DiffItemType '" + oItem.DiffItemType + "'.");
				}
			}
		},
		
		/**
		 * Returns the visible flag for 'ValuesFrom'
		 * @param {object} oValues - the values object as retrieved from service
		 * @return {boolean} <code>true</code> if visible, <code>false</code> otherwise
		 * @public
		 */
		getValuesFromVisible: function(oValues) {
			return oValues ? oValues.Source.length > 0 : false;
		},
		
		/**
		 * Returns the visible flag for 'ValuesTo'
		 * @param {object} oValues - the values object as retrieved from service
		 * @return {boolean} <code>true</code> if visible, <code>false</code> otherwise
		 * @public
		 */
		getValuesToVisible: function(oValues) {
			return oValues ? oValues.Target.length > 0 : false;
		},
		
		/**
		 * Returns the visible flag for the arrow between the values
		 * @param {integer} iDiffType - the diff type
		 * @param {object} oValues - the values object as retrieved from service
		 * @return {boolean} <code>true</code> if visible, <code>false</code> otherwise
		 * @public
		 */
		getValuesArrowVisible: function(iDiffType, oValues) {
			// show the arrow if diff type is changed and values are provided
			return oValues ? (iDiffType === 3 && (oValues.Source.length > 0 || oValues.Target.length > 0)) : false;
		},
		
		/**
		 * Returns a textual representation of the ValuesFrom field
		 * @param {object} oValues - the values object as retrieved from service
		 * @return {string} the values text
		 * @public
		 */
		getValuesFromText: function(oValues) {
			if (oValues && oValues.Source) {
				return this.getValuesText(oValues.Source);
			} else {
				return null;
			}
		},
		
		/**
		 * Returns a textual representation of the ValuesTo field
		 * @param {object} oValues - the values object as retrieved from service
		 * @return {string} the values text
		 * @public
		 */
		getValuesToText: function(oValues) {
			if (oValues && oValues.Target) {
				return this.getValuesText(oValues.Target);
			} else {
				return null;
			}
		},
		
		/**
		 * Returns a textual representation for the given values array
		 * @param {array} aValues - array of values
		 * @return {string} the values text
		 * @public
		 */
		getValuesText: function(aValues) {
			var sText = "";
			for (var i = 0; i < aValues.length; i++) {
				sText += aValues[i].Value;
				if (i < aValues.length - 1) {
					sText += ", ";
				}
			}
			return sText;
		}
		
	};
	
});
