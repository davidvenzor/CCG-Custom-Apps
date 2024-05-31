/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([], function() {
	"use strict";

	/**
	 * Collection of formatters of DependencyDetails views
	 */
	return {

		/** Provides formatting for the title property of the ListItem
		 * @param {String} sStatus	- Status property from the ODataModel
		 * @returns {String} The formatted value
		 */
		status: function(sStatus) {
			switch (sStatus) {
				case "1":
					return "Success";
				case "2":
					return "Warning";
				case "3":
					return "Error";
				default:
					return sStatus;
			}
		},

		/** Provides formatting for the title property of dependency
		 * @param {String} sObjectDependencyId	- ObjectDependencyId property from the ODataModel
		 * @param {String} sName				- Name property from the ODataModel
		 * @param {String} sText				- Text property from the ODataModel
		 * @returns {String} The formatted value
		 */
		dependencyTitleFormatter: function(sObjectDependencyId, sName, sText) {
			return sText || sName || sObjectDependencyId;
		},

		/** Provides formatting for the subtitle property of dependency
		 * @param {String} sObjectDependencyId	- ObjectDependencyId property from the ODataModel
		 * @param {String} sName				- Name property from the ODataModel
		 * @param {String} sText				- Text property from the ODataModel
		 * @returns {String} The formatted value
		 */
		dependencySubtitleFormatter: function(sObjectDependencyId, sName, sText) {
			if (sText) {
				return sName || sObjectDependencyId;
			} else if (sName && sName !== sObjectDependencyId) {
				return sObjectDependencyId;
			} else {
				return "";
			}
		},

		/** Provides formatting for the subtitle property of dependency
		 * @param {String} sProcMode - Processing mode from the ODataModel
		 * @returns {String} The formatted value
		 */
		dependencyProcessingModeFormatter: function(sProcMode) {
			var i18n = this.getView().getModel("i18n");
			if (i18n) {
				if (sProcMode === "A") {
					return i18n.getResourceBundle().getText("vchclf_insp_dependencydtl_processing_mode_advanced");
				} else if (sProcMode === "C") {
					return i18n.getResourceBundle().getText("vchclf_insp_dependencydtl_processing_mode_classic");
				} else {
					return "";
				}
			}
			else {
				return undefined; 
			}
		},

		/**
		 * Provides formatting for the dependency source code
		 * @param {Object[]} aDependencySourceCodes - List of the ObjectDependencyCode entities
		 * @returns {String} The formatted source code
		 * @public
		 */
		formatDependencySourceCode: function (aDependencySourceCodes) {
			var sSourceCode = "";

			if ($.isArray(aDependencySourceCodes)) {
				$.each(aDependencySourceCodes, function (iIndex, oDependencySourceCode) {
					sSourceCode += sSourceCode ? "\n" + oDependencySourceCode.CodeLine : oDependencySourceCode.CodeLine;
				});
			}

			return sSourceCode;
		}
	};
});
