/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([
	"jquery.sap.global",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/control/characteristic/type/Base",
	"sap/m/Input",
	"sap/i2d/lo/lib/zvchclfz/common/Constants"
], function (jQuery, Base, Input, Constants) {
	"use strict";

	/**
	 * Input control.
	 * 
	 * @class
	 * @abstract
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.type.Input
	 * @extends sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.type.Base
	 */
	return Base.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.type.Input", { /** @lends sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.type.Input.prototype */

		/**
		 * @overridden
		 */
		create: function (sId, mDefaultSettings, mFreeInputDefaultSettings) {
			return new Input(sId, jQuery.extend(mDefaultSettings, mFreeInputDefaultSettings, {
				value: {
					parts: [
						"view>AssignedValues",
						"valuationSettings>/descriptionModeValues",
						"i18n>VALUE_LABEL_BOTH",
						"i18n>VALUE_LABEL_NO_VALUE",
						"i18n>ROUNDED_VALUE_PREFIX",
						"i18n>INTERVAL_REPRESENTATION",
						"uiState>/focused",
						"valuationSettings>/showPreciseDecimalNumbers",
						"view>ChangeTimestamp"
					],
					formatter: this.formatter.getFirstValue
				}
			}));
		},
		
		renderer: function(oRm, oControl) {
			Base.prototype.getRenderer().render(oRm, oControl);
        },

		attachEvents: function () {
			Base.prototype.attachEvents.apply(this, arguments);
			if (this.getEmbedderName() === Constants.CONFIGURATION) {
				this.getCsticUiControl().attachBrowserEvent("focusin", this.onAlternativeValuesRequested, this);
			}
		},

		/**
		 * @overridden
		 */
		detachEvents: function () {
			Base.prototype.detachEvents.apply(this, arguments);
			this.getCsticUiControl().detachBrowserEvent("focusin", this.onAlternativeValuesRequested, this);
		},

		onAlternativeValuesRequested: function () {
			this.fireAlternativeValueRequest();
		},

		/**
		 * @overridden
		 */
		getTechnicalValues: function () {
			return [];
		},

		/**
		 * @overridden
		 */
		hasValueChanged: function () {
			return this.getOldValue() !== this.getValue();
		},

		/**
		 * @overridden
		 */
		getBindingNames: function () {
			return [
				"value",
				"editable",
				"placeholder",
				"tooltip",
				"enabled"
			];
		}
	});
}, /* bExport= */ true);
