/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([
	"jquery.sap.global",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/control/characteristic/type/Base",
	"sap/m/Select",
	"sap/ui/core/Item",
	"sap/i2d/lo/lib/zvchclfz/common/Constants"
], function (jQuery, Base, Select, Item, Constants) {
	"use strict";

	/**
	 * Select control.
	 * 
	 * @class
	 * @abstract
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.Select
	 * @extends sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.type.Base
	 */
	return Base.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.type.Select", { /** @lends sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.Select.prototype */

		init: function () {
			Base.prototype.init.apply(this, arguments);

			this.onSelectCallWhenDisabled = this.callWhenDisabled(this.onSelectWhenDisabled.bind(this));
			this.onAlternativeValuesRequestedCalledWhenEnabled = this.callWhenEnabled(this.onAlternativeValuesRequested.bind(this));
			this.onMouseDownCallWhenEnabled = this.callWhenEnabled(this.onMouseDown.bind(this));

		},

		/**
		 * @overridden
		 */
		create: function (sId, mDefaultSettings) {
			return new Select(sId, jQuery.extend(mDefaultSettings, {
				editable: "{= !${view>IsHidden} && !${view>IsReadOnly} }",
				selectedKey: {
					parts: [
						"view>AssignedValues",
						"view>ChangeTimestamp"
					],
					formatter: this.formatter.getFirstValueId.bind(this)
				},
				items: {
					path: "view>DomainValues",
					factory: this._createItem.bind(this)
				}
			}));
		},
		
		renderer: function(oRm, oControl) {
			Base.prototype.getRenderer().render(oRm, oControl);
        },

		_createItem: function (sIdPrefix, oContext) {
			return new Item(sIdPrefix + "--selectItemForValuation", {
				key: "{view>ValueId}",
				text: {
					parts: [
						"view>",
						"valuationSettings>/descriptionModeValues",
						"i18n>VALUE_LABEL_BOTH",
						"i18n>VALUE_LABEL_NO_VALUE",
						"i18n>ROUNDED_VALUE_PREFIX",
						"i18n>INTERVAL_REPRESENTATION",
						"uiState>/focused"
					],
					formatter: this.formatter.getFormattedValueTextWithDescription
				}
			});
		},

		/**
		 * @overridden
		 */
		getValue: function () {
			return "";
		},

		/**
		 * @overridden
		 */
		getTechnicalValues: function () {
			var oSelectedItem = this.getCsticUiControl().getSelectedItem();
			var oItemData = oSelectedItem.getBindingContext(Constants.VIEW_MODEL_NAME).getObject();

			if (oItemData.ValueId === "0" && oItemData.TechnicalValue === "") {
				return [];
			} else {
				return [oItemData.TechnicalValue];
			}
		},

		/**
		 * @overridden
		 */
		getBindingNames: function () {
			return [
				"items"
			];
		},

		/**
		 * @overridden
		 */
		attachEvents: function () {
			Base.prototype.attachEvents.apply(this, arguments);
			if (this.getEmbedderName() === Constants.CONFIGURATION) {
				this.getCsticUiControl().attachBrowserEvent("click", this.onSelectCallWhenDisabled, this);
				// Alternative values calculation is only relevant for configuration
				this.getCsticUiControl().attachBrowserEvent("focusin", this.onAlternativeValuesRequestedCalledWhenEnabled, this);
			}
		},

		/**
		 * @overridden
		 */
		detachEvents: function () {
			Base.prototype.detachEvents.apply(this, arguments);
			this.getCsticUiControl().detachBrowserEvent("click", this.onSelectCallWhenDisabled, this);
			this.getCsticUiControl().detachBrowserEvent("focusin", this.onAlternativeValuesRequestedCalledWhenEnabled, this);
		},
		
		onChange: function(oEvent) {
			// only process the change if the value has not yet been assigned (in case of undo/redo change may be wrongly detected due to focus-in / focus-out)
			if (this.hasValueChanged()) {
				Base.prototype.onChange.apply(this, [oEvent]);
			}
		},

		onMouseDown: function (oEvent) {
			var oSourceControl = jQuery(oEvent.currentTarget).control()[0];
			oSourceControl.hasMouseDown = true;
		},

		onAlternativeValuesRequested: function (oEvent) {
			var oSourceControl = jQuery(oEvent.currentTarget).control()[0];
			var oDropDownList = oSourceControl.getList();
			oDropDownList.setBusyIndicatorDelay(0);
			oDropDownList.setBusy(true);
			this.fireAlternativeValueRequest({
				binding: oSourceControl.getBinding("items"),
				open: function () {
					oDropDownList.setBusy(false);
					if (!oSourceControl.isOpen() && oSourceControl.hasMouseDown) {
						oSourceControl.open();
					}
					oSourceControl.hasMouseDown = false;
				},
				error: function () {
					oSourceControl.hasMouseDown = false;
					oDropDownList.setBusy(false);
				}
			});
		},

		/**
		 * Checks if the value of one characteristic has changed
		 *
		 * @param {sap.ui.core.Control} oControl: instance of an UI5 control
		 * @return {boolean} if the value has changed or not
		 * @public
		 * @function
		 */
		hasValueChanged: function () {
			return this.getOldAssignedValueId() !== this.getCsticUiControl().getSelectedItem().getBindingContext(Constants.VIEW_MODEL_NAME).getObject().ValueId;
		},

		/**
		 * Gets the value id for one characteristic from data model
		 *
		 * @return {string} characteristic value
		 * @public
		 * @function
		 */
		getOldAssignedValueId: function () {
			var oCstic = this.getCharacteristicData();
			var aAssignedValues = oCstic.AssignedValues;
			var sValueId = "";
			if (aAssignedValues.length) {
				var oValue = aAssignedValues[0];
				sValueId = oValue.ValueId;
			}
			return sValueId;
		},

		onKeyPress: function (oEvent) {
			if (oEvent.key === "Enter") {
				var oCstic = this.getCharacteristicData();

				if (!this.hasValueChanged()){
					if (oCstic.HasDefaultValues && oCstic.AssignedValues[0].IsDefaultValue === true) {
						this.fireAcceptDefaultValues();
					}
				}
			}
		},

		//Unit of measure is written into the item
		showUnitOfMeasure: function () {
			return false;
		}
	});
}, /* bExport= */ true);
