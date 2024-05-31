/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
 
sap.ui.define([
	"jquery.sap.global",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/control/characteristic/type/Base",
	"sap/m/Text",
	"sap/i2d/lo/lib/zvchclfz/common/Constants"
],function(jQuery, Base, Text, Constants) {
	"use strict";

	/**
	 * Text control.
	 * 
	 * @class
	 * @abstract
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.Text
	 * @extends sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.type.Base
	 */
	return Base.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.type.Text", { /** @lends sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.Text.prototype */
	
		/**
		 * @overridden
		 */
		create : function(sId) {
			return new Text(sId, {
				text : {
					parts:[
						"view>", 
						"valuationSettings>/descriptionModeValues",
						"i18n>VALUE_LABEL_BOTH",
						"i18n>ROUNDED_VALUE_PREFIX",
						"i18n>INTERVAL_REPRESENTATION",
						"valuationSettings>/showPreciseDecimalNumbers",
	                    "view>ChangeTimestamp"
					], 
					formatter : this.formatter.getConcatenatedDescriptionValues
				}
			});
		},
		
		renderer: function(oRm, oControl) {
			Base.prototype.getRenderer().render(oRm, oControl);
        },

		/**
		 * @overridden
		 */
		getValue : function() {
			return this.getCsticUiControl().getText();
		},

		/**
		 * @overridden
		 */
		getBindingNames : function() {
			return [
				"text"	
			];
		},
		
		createLabel: function () {
			var oLabel = Base.prototype.createLabel.apply(this);
			oLabel.attachBrowserEvent("click", this.onSelect, this);
			return oLabel;
		},

		/**
		 * @overridden
		 */
		attachEvents : function() {
			this.getCsticUiControl().attachBrowserEvent("click", this.onSelect, this);
		},

		/**
		 * @overridden
		 */
		isUserInputType : function() {
			return false;
		},
	});
}, /* bExport= */ true);
