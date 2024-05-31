/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([
	"sap/ui/core/Element"
], function(Element) {
	"use strict";

	/**
	 * 
	 */
	return Element.extend("sap.i2d.lo.lib.zvchclfz.components.configuration.HeaderField", {
		metadata: {
			manifest: "json",
			properties: {
				controlType: {
					type: "string"
				},
				description: {
					type: "string"	
				},
				properties: {
					type: "object" // {"propertyName": "propertyValue" ,...}
				}
			}
		},
		
		
		setProperty : function(sPropertyName, oValue, bSuppressInvalidate) {
			var oResult = Element.prototype.setProperty.apply(this, arguments);
			if (this.getParent()) {
				this.getParent().syncModel();
			}
			return oResult;
		},


		/**
		 * Returns all properties as JSON
		 * @returns {Map} JSON of all properties
		 * @public
		 * @function
		 */
		getDataJSON: function() {
			var oHeaderField = {
				properties: {}
			};
			
			oHeaderField.description = this.getDescription();
			oHeaderField.controlType = this.getControlType();
			oHeaderField.properties = this.getProperties();
			
			return oHeaderField;
		}
	});
});
