/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([], function() {
	"use strict";

	/**
	 * Collection of formatters of Configuration Profile Based views
	 */
	return {

		/** Provides formatting for the status text property
		 * @param {String} sStatus - ConfigurationProfileStatus property from the ODataModel ( entitySet: C_ProductConfigurationProfile )
		 * @returns {String} The formatted value
		 */
		statusTextForConfProfileFormatter: function(sStatus) {
			var i18n = this.getView().getModel("i18n");
			if (i18n) {
				switch (sStatus) {
					case "0":
						return i18n.getResourceBundle().getText("vchclf_insp_properties_conf_profile_status_preparation");
					case "1":
						return i18n.getResourceBundle().getText("vchclf_insp_properties_conf_profile_status_released");
					case "2":
						return i18n.getResourceBundle().getText("vchclf_insp_properties_conf_profile_status_lock");
					default:
						return sStatus;
				}
			}
			return undefined;

		},

		/** Provides formatting for the process text property
		 * @param {String} sProcess - ConfigurationProfileProcess property from the ODataModel ( entitySet: C_ProductConfigurationProfile )
		 * @returns {String} The formatted value
		 */
		processTextFormatter: function(sProcess) {
			var i18n = this.getView().getModel("i18n");
			if (i18n) {
				switch (sProcess) {
					case "PORD":
						return i18n.getResourceBundle().getText("vchclf_insp_properties_conf_profile_process_planned_order");
					case "SORD":
						return i18n.getResourceBundle().getText("vchclf_insp_properties_conf_profile_process_sales");
					case "KBOB":
						return i18n.getResourceBundle().getText("vchclf_insp_properties_conf_profile_process_bom_know");
					case "ROOB":
						return i18n.getResourceBundle().getText("vchclf_insp_properties_conf_profile_process_bom_result");
					default:
						return sProcess;
				}
			}
			return undefined;

		},

		/** Provides formatting for the sLevel text property
		 * @param {String} sLevel - BOMExplosionLevel property from the ODataModel ( entitySet: C_ProductConfigurationProfile )
		 * @returns {String} The formatted value
		 */
		bomExplosionLevelFormatter: function(sLevel) {
			var i18n = this.getView().getModel("i18n");
			if (i18n) {
				switch (sLevel) {
					case "N":
						return i18n.getResourceBundle().getText("vchclf_insp_properties_conf_profile_bom_exp_level_none");
					case "S":
						return i18n.getResourceBundle().getText("vchclf_insp_properties_conf_profile_bom_exp_level_single");
					case "M":
						return i18n.getResourceBundle().getText("vchclf_insp_properties_conf_profile_bom_exp_level_multi");
					default:
						return sLevel;
				}
			}
			return undefined;
		}
	};
});
