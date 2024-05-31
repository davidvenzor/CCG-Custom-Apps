/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([], function() { 
	"use strict"; 
	
	/**
	 * Contains formatter functions for the classification UI.
	 * 
	 * @class Formatter
	 */
	return {
		
		/**
		 * Formats the class type and class description.
		 * 
		 * @example
		 * // returns "Material type (001)"
		 * Formatter.formatClassType("001", "Material type");
		 * @param {string} sClassType The class type.
		 * @param {string} sClassTypeDescription The description of the class type.
		 * @public
		 * @memberof Formatter
		 * @instance
		 * @return {string} The formatted version of the class type and its description.
		 */
		formatClassType: function(sClassType, sClassTypeDescription) {
			if (!sClassType && sClassTypeDescription) {
				return sClassTypeDescription;
			} else if (sClassType && !sClassTypeDescription) {
				return sClassType;
			} else if (!sClassType || !sClassTypeDescription) {
				return "";
			}
			
			return sClassTypeDescription + " (" + sClassType + ")";
		},

		/**
		 * Formats the classification status to be usable in the ObjectStatus state property.
		 * 
		 * @example
		 * // returns "Warning"
		 * Formatter.formatStatus("W");
		 * @param {string} sStatusSeverity Severity indication provided by the backend {W/E}.
		 * @public
		 * @memberof Formatter
		 * @instance
		 * @return {string} The valid 'state' property value for the ObjectStatus control.
		 */
		formatStatusState: function(sStatusSeverity) {
			switch (sStatusSeverity) {
				case "W":
					return "Warning";
				case "E":
					return "Error";
				default:
					return "None";
			}
		},
		
		/**
		 * Returns empty string if the status is released, so it is not displayed even by accident.
		 * 
		 * @param {object} oStatus Status object provided by the backend.
		 * @public
		 * @memberof Formatter
		 * @instance
		 * @return {string} Long description of status or empty string.
		 */
		formatStatusText: function(oStatus) {
			if (!oStatus || oStatus.IsReleased || !oStatus.LongDescription) {
				return "";
			}
			
			return oStatus.LongDescription;
		}
	}; 
});
