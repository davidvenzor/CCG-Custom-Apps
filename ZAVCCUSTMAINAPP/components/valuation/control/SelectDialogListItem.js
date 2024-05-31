/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/m/CustomListItem",
	"sap/m/CustomListItemRenderer",
	"sap/m/Input",
	"sap/m/Button",
	"sap/ui/layout/HorizontalLayout",
	"sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/ui/core/Icon",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/formatter/CharacteristicFormatter"
], function (CustomListItem, CustomListItemRenderer, Input, Button, HorizontalLayout, Constants, Icon, CharacteristicFormatter) {
	"use strict";

	var ListMode = {
		singleMode: "SingleSelectMaster"
	};

	/**
	 * @class
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.zvchclfz.components.valuation.control.SelectDialogListItem
	 * @extends sap.ui.core.Control
	 */
	return CustomListItem.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.control.SelectDialogListItem", { /** @lends sap.i2d.lo.lib.zvchclfz.components.valuation.control.SelectDialogListItem.prototype */
		metadata: {
			properties: {
				readonly: {
					type: "boolean",
					defaultValue: false
				},
				intervalDomainValue: {
					type: "boolean",
					defaultValue: false
				},
				assigned: {
					type: "boolean",
					defaultValue: false
				}
			}
		},

		_bSubmitAttached: false,

		/*
		 * @override
		 */
		init: function () {
			CustomListItem.prototype.init.apply(this, arguments);
		},

		/**
		 * Get the value from the list item.
		 * The value is supposed to be used for value assignment
		 * 
		 * @public
		 */
		getValue: function () {
			var oListItemData = this.getBindingContext(Constants.VIEW_MODEL_NAME).getObject();
			var oValue = {};

			if (this.getIntervalDomainValue()) {
				oValue.UserInput = this._getUserInput();
				if (oValue.UserInput === "") {
					oValue.TechnicalValue = oListItemData.TechnicalValue;
				}
			} else {
				oValue.TechnicalValue = oListItemData.TechnicalValue;
			}
			return oValue;
		},

		/**
		 * Returns a string
		 */
		_getUserInput: function () {
			// Get user input from the UI control or from the cache
			if (this.getAggregation("content") && this._getIntervalInput() && this._getIntervalInput().getValue()) {
				return this._getIntervalInput().getValue();
			} else {
				return this.getParent().aUserInput[this.getBindingContext(Constants.VIEW_MODEL_NAME).getPath()];
			}
		},

		/*
		 * Returns a UI control 
		 * @private
		 */
		_getIntervalInput: function () {
			return this.getAggregation("content")[0].getAggregation("items")[1].getAggregation("items")[0];
		},

		/*
		 * @private
		 */
		_getAssignButton: function () {
			return this.getAggregation("content")[0].getAggregation("items")[1].getAggregation("items")[1];
		},

		/*
		 * @private
		 */
		_getText: function () {
			return this.getAggregation("content")[0].getAggregation("items")[0].getAggregation("items")[0].getAggregation("items")[1];
		},

		/*
		 * @private
		 */
		_getArrowIcon: function () {
			return this.getAggregation("content")[1];
		},

		/*
		 * @private
		 */
		_isSingleMode: function () {
			return this.getMode() === ListMode.singleMode;
		},

		/*
		 * @private
		 */
		_onSubmit: function (oEvent) {
			this.informList("InputSelect", true);
		},

		/**
		 * @private
		 */
		_handleVisibilityOfInputFieldAndButton: function () {
			var bIntervalInputVisible = this.getSelected() && this.getIntervalDomainValue();
			var bAssignButtonVisible = bIntervalInputVisible && this._isSingleMode();
			this._getIntervalInput().setVisible(bIntervalInputVisible);
			this._getAssignButton().setVisible(bAssignButtonVisible);
		},

		/*
		 * @private
		 */
		_toggleRequiredStyleClasses: function (bToggle) {
			if (!this._isSingleMode() && this.getIntervalDomainValue()) {
				this.toggleStyleClass("sapVchlclfSDLICheckboxTop", bToggle);
			}
			var bToggleClassSapVchclfIntervalArrowTinyTop = !this._getText().getVisible() && bToggle;
			this._getArrowIcon().toggleStyleClass("sapVchclfIntervalArrowTinyTop", bToggleClassSapVchclfIntervalArrowTinyTop);
		},

		/*
		 * @override
		 */
		setSelected: function (bSelected) {
			CustomListItem.prototype.setSelected.apply(this, arguments);

			this._handleVisibilityOfInputFieldAndButton();
			this._toggleRequiredStyleClasses(bSelected);

			var oInput = this._getIntervalInput();
			if (this.getIntervalDomainValue() && bSelected === false) {
				oInput.setValue("");
			}

			if (bSelected) {
				var oAfterRenderingEventDelegate = {
					onAfterRendering: function () {
						oInput.removeEventDelegate(oAfterRenderingEventDelegate);
						oInput.focus();
					}
				};
				oInput.addEventDelegate(oAfterRenderingEventDelegate);
			}
		},

		/*
		 * @override
		 */
		informList: function (sEvent, vParam1, vParam2) {
			if (this.getIntervalDomainValue()) {
				if (this._isSingleMode() && sEvent === "Select") {
					return;
				}
				if (sEvent === "InputSelect") {
					sEvent = "Select";
				}
			}
			CustomListItem.prototype.informList.call(this, sEvent, vParam1, vParam2);
		},

		/*
		 * @override
		 */
		onBeforeRendering: function () {
			this._handleVisibilityOfInputFieldAndButton();
			var oButton = this._getAssignButton();

			// The parent object (= the item list) keeps the user input. 
			var oSelectDialogList = this.getParent();
			if (!oSelectDialogList.aUserInput) {
				oSelectDialogList.aUserInput = [];
			}
			// As key for the buffer management the path is used: 
			var sPath = this.getBindingContext(Constants.VIEW_MODEL_NAME).getPath();
			if (!oSelectDialogList.aUserInput[sPath]) {
				oSelectDialogList.aUserInput[sPath] = "";
			}

			// Restore the user input (in case anything was kept before)
			var oInput = this._getIntervalInput();
			var oValue = this.getBindingContext("view").getObject();
			var oI18nModel = this.getModel("i18n").getResourceBundle();
			var sNoValueText = oI18nModel.getText("VALUE_LABEL_NO_VALUE");
			var sRoundValuePrefix = oI18nModel.getText("ROUNDED_VALUE_PREFIX");
			var sIntervalText = oI18nModel.getText("INTERVAL_REPRESENTATION");
			if (oSelectDialogList.aUserInput[sPath]) {
				oInput.setValue(oSelectDialogList.aUserInput[sPath]);
			} else if (this.getSelected() && this.getAssigned()) {
				oInput.setValue(CharacteristicFormatter.getFormattedValueText(oValue, sNoValueText, sRoundValuePrefix, sIntervalText, true));
			}

			oInput.attachLiveChange(function (oEvent) {
				// At each key stroke in the interval input field the current user input value shall be kept in the buffer. 
				// This is needed to restore the user input after resetting the filter
				// (search field in SelectDialog)
				oSelectDialogList.aUserInput[sPath] = oEvent.getParameter("newValue");
			});

			if (!this._bSubmitAttached) {
				oInput.attachSubmit(this._onSubmit, this);
				oButton.attachPress(this._onSubmit, this);
				this._bSubmitAttached = true;
			}

			if (this.getIntervalDomainValue() && !this._isSingleMode()) {
				this._getAssignButton().setVisible(false);
				oInput.setWidth("250px");
			}
		},

		/*
		 * @override
		 */
		getMultiSelectControl: function () {
			var oMultiSelectControl = CustomListItem.prototype.getMultiSelectControl.apply(this, arguments);
			if (oMultiSelectControl) {
				oMultiSelectControl.setEnabled(!this.getReadonly());
			}
			return oMultiSelectControl;
		},

		/*
		 * @override
		 */
		renderer: function (oRm, oControl) {
			CustomListItemRenderer.render(oRm, oControl);
		},

		/*
		 * @override
		 */
		ontap: function (oEvent) {
			if (this.getReadonly()) {
				return;
			}
			oEvent.setMarked("preventSelectionChange");
			CustomListItem.prototype.ontap.call(this, oEvent);
		},

		onsapselect: function (oEvent) {
			if (this.getReadonly()) {
				return;
			}
			oEvent.setMarked("preventSelectionChange");
			if (CustomListItem.prototype.onsapselect) {
				CustomListItem.prototype.onsapselect.call(this, oEvent);
			}
		}
	});

}, /* bExport= */ true);
