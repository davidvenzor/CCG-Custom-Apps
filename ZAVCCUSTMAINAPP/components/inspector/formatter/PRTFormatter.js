/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([], function() {
	"use strict";

	/**
	 * Collection of formatters of PRT views
	 */
	return {
		/** Provides formatting for the title property of prt
		 * @param {String} sDescription - Description property from the ODataModel
		 * @param {String} sProductionResourceTool - ProductionResourceTool property from the ODataModel
		 * @returns {String} The formatted value
		 */
		prtTitleFormatter: function(sDescription, sProductionResourceTool) {
			return sDescription || sProductionResourceTool;
		},

		/** Provides formatting for the subtitle property of prt
		 * @param {String} sDescription - Description property from the ODataModel
		 * @param {String} sProductionResourceTool - ProductionResourceTool property from the ODataModel
		 * @returns {String} The formatted value
		 */
		prtSubtitleFormatter: function(sDescription, sProductionResourceTool) {
			return sDescription ? sProductionResourceTool : "";
		}
	};
});
