/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([
	"sap/ui/core/XMLComposite",
	"sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/m/GroupHeaderListItem",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/formatter/CharacteristicFormatter"
], function (XMLComposite, Constants, GroupHeaderListItem, formatter) {
	"use strict";

	/**
	 * Configuration Settings Dialog. Loads and displays the personalization data from the FLP personalization service.
	 * 
	 * @class
	 * @abstract
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.zvchclfz.components.valuation.control.ValueHelpDialog
	 * @extends sap.ui.core.Control
	 */
	return XMLComposite.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.control.ValueHelpDialog", { /** @lends sap.i2d.lo.lib.zvchclfz.components.valuation.control.ValueHelpDialog.prototype */
		metadata: {
			properties: {
				undoValues: {
					type: "object"
				}
			},
			events: {
				"change": {
					parameters: {
						value: {
							type: "string"
						},
						technicalValues: {
							type: "string[]"
						}
					}
				}
			}
		},

		formatter: formatter,

		/**
		 * Opens the dialog with currently saved personalization data.
		 * @return {Promise<Object>} returns a promise which will be resolved with the current data.
		 * @public
		 */
		open: function () {
			this.getDialog().open();
		},
		
		/**
		 * Sets the busy indicator of the dialog
		 */
		setBusy: function(bBusy) {
			this.getDialog().setBusyIndicatorDelay(0);
			this.getDialog().setBusy(bBusy);
		},

		/**
		 * Returns the internal settings dialog control
		 * @return {sap.m.Dialog} the settings dialog
		 * @protected
		 */
		getDialog: function () {
			return this.byId("valueHelpDialog");
		},

		/**
		 * Event handler. Called when the select dialog is closed via confirm button. Assigns the new characteristic value.
		 * 
		 * @param  {sap.ui.base.Event} oEvent The causing event
		 * @public
		 */
		onSelectDialogConfirm: function (oEvent) {
			// oEvent.getParameter("selectedItems") is not used because it does not return 
			// all selected items in case of filtering (search in the SelectDialog).
			var aSelectedContexts = oEvent.getParameter("selectedContexts");
			var oSourceControl = oEvent.getSource();

			var oItemsBinding = oSourceControl.getBinding("items");
			if (oItemsBinding.aApplicationFilters.length > 0 || oItemsBinding.aFilters.length > 0) {
				// Reset the filter so that all items are taken into account, even the ones 
				// that are currently hidden due to use of the search feature on the UI:
				oItemsBinding.filter([]);
			}

			var aSelectDialogItems = oSourceControl.getItems();

			var fnItemIsSelected = function (oItem) {
				for (var i = 0; i < aSelectedContexts.length; i++) {
					if (oItem.getBindingContext(Constants.VIEW_MODEL_NAME).getPath() === aSelectedContexts[i].getPath()) {
						// The item was found in the list of selected contexts
						return true;
					}
				}
				return false; // item not found
			};

			var aSelectedItems = aSelectDialogItems.filter(fnItemIsSelected);
			var aTechnicalValues = this._getTechValuesIgnoringReadonly(aSelectedItems);
			var sValue = this._getConcatenatedUserInputs(aSelectedItems);

			if (this._shallTriggerUnassignAll(aSelectedItems)) {
				this.fireChange({
					value: sValue,
					technicalValues: aTechnicalValues
				});
			} else if (this._shallTriggerAssignValue(aSelectedItems, this.getUndoValues())) {
				this.fireChange({
					value: sValue,
					technicalValues: aTechnicalValues
				});
			}
		},

		_shallTriggerAssignValue: function (aSelectedItems, oUndoValues) {
			var bHasNoObjectDependencyValues = !this._hasOnlyObjectDependencyValues(aSelectedItems);
			var bIsUnassignOfLastAssignedValue = oUndoValues.ValueObject.StringValue || oUndoValues.ValueObject.TechnicalValue;
			var bShallTriggerValueAssign = bHasNoObjectDependencyValues || bIsUnassignOfLastAssignedValue;
			return bShallTriggerValueAssign;
		},

		/**
		 * @protected
		 */
		includeValueIntoAssign: function (oItem) {
			return !oItem.getBindingContext(Constants.VIEW_MODEL_NAME).getObject().IsSetByObjectDependency;
		},

		filterUndefinedValues: function (oItem) {
			return (oItem !== undefined);
		},

		/**
		 * @private
		 */
		_hasOnlyObjectDependencyValues: function (aSelectedItems) {
			var bSelectionHasObjectDependencyValues = false;
			var bHasUserSelection = false;
			aSelectedItems.forEach(function (oItem) {
				var oValue = oItem.getBindingContext(Constants.VIEW_MODEL_NAME).getObject();
				if (oValue.IsSetByObjectDependency) {
					bSelectionHasObjectDependencyValues = true;
				} else {
					bHasUserSelection = true;
				}
			});

			return !bHasUserSelection && bSelectionHasObjectDependencyValues;
		},

		/**
		 * @private
		 */
		_shallTriggerUnassignAll: function (aSelectedItems) {
			if (!aSelectedItems || aSelectedItems.length === 0) {
				return true;
			} else if (aSelectedItems.length === 1) {
				var oValue = aSelectedItems[0].getBindingContext(Constants.VIEW_MODEL_NAME).getObject();
				if (oValue.ValueId === "0" && oValue.TechnicalValue === "") {
					return true;
				}
			}
			return false;
		},

		/**
		 * Formatter
		 * 
		 * @param {object} oValue The value to check.
		 * @return {boolean} Returns true if the value in question is a domain value (= not assigned)
		 * and it is not a single value
		 */
		isIntervalDomain: function (oValue) {
			return !this._isValueAssigned(oValue, false) && !!oValue.FormattedValueTo;
		},

		/**
		 * Formatter. Is used to check if a value is already assigned.
		 * 
		 * @param {object} oValue The value to check.
		 * @return {boolean} whether the value is assigned or not.
		 * @public
		 */
		isListItemAssigned: function (oValue) {
			return this._isValueAssigned(oValue, false);
		},

		/**
		 * Formatter. Is used to check if a value is already assigned.
		 * 
		 * @param {object} oValue The value to check.
		 * @return {boolean} whether the value is assigned or not.
		 * @public
		 */
		isListItemSelected: function (oValue) {
			return this._isValueAssigned(oValue, true);
		},

		/**
		 * Formatter. Is used to check if a value is already assigned.
		 * 
		 * @param {object} oValue The value to check.
		 * @param {boolean} bSideEffectTrick
		 *				The side effect trick with keeping the selected state
		 *				is used to make up for a weakness of the selected feature 
		 *				of items in the SelectDialog
		 *				in combination with filtering.
		 * @return {boolean} whether the value is assigned or not.
		 * @private
		 */
		_isValueAssigned: function (oValue, bSideEffectTrick) {
			if (!bSideEffectTrick) {
				return oValue.Assigned || oValue.IsSelected;
			} else {
				var oSelectedState = this._getSelectedState();
				var sValueId = oValue.ValueId;
				if (!oSelectedState[sValueId] && (oValue.Assigned || oValue.IsSelected)) {
					oSelectedState[sValueId] = true;
					return true;
				}
			}
			return false;
		},

		/**
		 * @private
		 */
		_getTechValuesIgnoringReadonly: function (aSelectedItems) {

			var fnGetValue = function (oSelectedItem) {
				return oSelectedItem.getValue().TechnicalValue;
			};

			return aSelectedItems.filter(this.includeValueIntoAssign).map(fnGetValue).filter(this.filterUndefinedValues);
		},

		_getConcatenatedUserInputs: function (aSelectedItems) {
			var fnGetValue = function (oSelectedItem) {
				return oSelectedItem.getValue().UserInput;
			};

			return aSelectedItems.filter(this.includeValueIntoAssign).map(fnGetValue).filter(this.filterUndefinedValues).join(";");
		},

		/**
		 * The following function is used for a workaround 
		 * because the list in the select dialog does not always keep its 
		 * selected state properly when used in combination with 
		 * the item search/filter. 
		 * The object returned is only used 
		 * in the formattter function _isValueAssigned to hold a map of 
		 * values that were assigned when the dialog is started.
		 * 
		 * @private
		 */
		_getSelectedState: function () {
			if (!this._selectedState) {
				this._selectedState = {};
			}
			return this._selectedState;
		},

		/**
		 * Factory function
		 * List items in value help dialog are grouped into two categories "Predefined Values" and "Additional Values"
		 * The header is technically also a ListItem
		 * 
		 * @param {object} oGroup: contains domainvalues 
		 * @return {sap.m.GroupHeaderListItem} returns instance of GroupHeaderListItem
		 * 
		 * @function
		 * @protected
		 */
		getGroupHeader: function (oGroup) {
			var sTitle = this.getText("PREDEFINED_VALUES");
			if (oGroup && !oGroup.key) {
				sTitle = this.getText("ADDITIONAL_VALUES");
			}
			return new GroupHeaderListItem({
				title: sTitle,
				upperCase: false
			});
		},

		/**
		 * Returns the resource bundle of the vchI18n model
		 * @return {sap.ui.model.resource.ResourceModel} the resource model
		 * @protected
		 */
		getResourceBundle: function () {
			if (!this._vchI18nResourceBundle) {
				this._vchI18nResourceBundle = this.getModel("i18n").getResourceBundle();
			}
			return this._vchI18nResourceBundle;
		},

		/**
		 * Returns a translated text for a given key.
		 * @param {string} sKey the key of the translated text
		 * @return {string} The translated string
		 * @protected
		 */
		getText: function (sKey, aPlaceholder) {
			return this.getResourceBundle().getText(sKey, aPlaceholder);
		},

		/**
		 * Event handler. Called when the search is executed. Sets the filter to search for.
		 * 
		 * @param {sap.ui.base.Event} oEvent The causing event
		 * @public
		 */
		onSearchInSelectDialog: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter1 = new sap.ui.model.Filter("Description", sap.ui.model.FilterOperator.Contains, sValue);
			var oFilter2 = new sap.ui.model.Filter("FormattedValueFrom", sap.ui.model.FilterOperator.Contains, sValue);
			var oFilter = new sap.ui.model.Filter({
				filters: [oFilter1, oFilter2],
				and: false
			});
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		}
	});
}, /* bExport= */ true);
