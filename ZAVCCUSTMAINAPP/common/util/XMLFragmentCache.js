/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([
	"sap/ui/core/XMLTemplateProcessor"
], function(XMLTemplateProcessor) {
	"use strict";

	return {
		
		_mCache: {},

		/**
		 * Load and creates a fragment. If already loaded, the fragment XML is returned from a cache and used for the fragment instance.
		 * 
		 * @param {string} sId The ID prefix for the controls in the fragment
		 * @param {string} sPath path to the fragment
		 * @param {object} oController the controller of the fragment
		 * @return {sap.ui.core.Control} an instance of a certain UI5 control
		 * @public
		 * @static
		 */
		createFragment: function(sId, sPath, oController) {
			var xXmlFragment = this._mCache[sPath];
			if (!xXmlFragment) {
				xXmlFragment = this._mCache[sPath] = XMLTemplateProcessor.loadTemplate(sPath, "fragment");
			}
			return new sap.ui.xmlfragment({
				id: sId,
				fragmentContent: xXmlFragment
			}, oController);
		}
	};
});
