/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([
	"jquery.sap.global",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/control/characteristic/type/Base",
	"sap/m/MultiInput",
	"sap/m/Token",
	"sap/ui/model/Filter",
	"sap/ui/model/Sorter",
	"sap/ui/model/FilterOperator",
	"sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/i2d/lo/lib/zvchclfz/common/util/Helper"
], function (jQuery, Base, MultiInput, Token, Filter, Sorter, FilterOperator, Constants, Helper) {
	"use strict";

	/**
	 * MultiInput control.
	 * 
	 * @class
	 * @abstract
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.MultiInput
	 * @extends sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.type.Base
	 */
	return Base.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.MultiInput", { /** @lends sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.MultiInput.prototype */

		_createToken: function (sIdPrefix, oContext) {
			return new Token(sIdPrefix + "--selectItemForValuation", {
				editable: "{= ( !${view>IsReadonly} && !${view>IsSetByObjectDependency} ) }",
				text: {
					parts: [
						"view>",
						"valuationSettings>/descriptionModeValues",
						"i18n>VALUE_LABEL_BOTH",
						"i18n>VALUE_LABEL_NO_VALUE",
						"i18n>ROUNDED_VALUE_PREFIX",
						"i18n>INTERVAL_REPRESENTATION"
					],
					formatter: this.formatter.getFormattedValueTextWithDescription
				},
				tooltip: {
					parts: [
						"view>",
						"valuationSettings>/descriptionModeValues",
						"i18n>VALUE_LABEL_BOTH",
						"i18n>VALUE_LABEL_NO_VALUE",
						"i18n>ROUNDED_VALUE_PREFIX",
						"i18n>INTERVAL_REPRESENTATION"
					],
					formatter: this.formatter.getFormattedValueTextWithDescription
				}
			});
		},

		/**
		 * @private
		 */
		_includeValue: function (oItem) {
			return !oItem.getBindingContext(Constants.VIEW_MODEL_NAME).getObject().IsSetByObjectDependency;
		},

		_onMultiInputTokenUpdate: function (oEvent) {
			var aRemovedTokens = oEvent.getParameter("removedTokens");
			var sType = oEvent.getParameter("type");

			// currently multiple token removal is not supported
			if (aRemovedTokens.length > 1) {
				return;
			}

			var oRemovedToken = aRemovedTokens[0];
			var bValueIsReadonly = oRemovedToken.getBindingContext(Constants.VIEW_MODEL_NAME).getObject().IsReadonly;

			if (bValueIsReadonly) {
				return;
			}

			if (sType === "removed") {
				oEvent.preventDefault();

				var aTokens = this.getCsticUiControl().getTokens();

				var iIndexOfRemovedToken = aTokens.indexOf(oRemovedToken);
				aTokens.splice(iIndexOfRemovedToken, 1);
				// Now aTokens contains the remaining tokens. 
				var fnGetValue = function (oItem) {
					return oItem.getBindingContext(Constants.VIEW_MODEL_NAME).getObject();
				};
				var aRemainingValues = aTokens.map(fnGetValue);
				var aRemainingValuesNotReadonly = aRemainingValues.filter(function (oValue) {
					return !oValue.IsSetByObjectDependency;
				});

				var aTechnicalValues = aRemainingValuesNotReadonly.map(function (oValue) {
					return oValue.TechnicalValue;
				});
				this.fireChange({
					value: this.getValue(),
					technicalValues: aTechnicalValues,
					binding: this.getBinding("tokens")
				});
				// The user may have come from a different characteristic and 
				// clicked on the delete icon of the token. 
				// Make sure that the focus is moved to the present characteristic:
				this.focus();
			}
		},

		/**
		 * @overridden
		 */
		create: function (sId, mDefaultSettings, mFreeInputDefaultSettings) {
			return new MultiInput(sId, jQuery.extend(mDefaultSettings, mFreeInputDefaultSettings, {
				enableMultiLineMode: false,
				value: {
					parts: [
						"view>AssignedValues",
						"view>AssignedValueId",
						"valuationSettings>/valuationStepsCount",
						"view>ChangeTimestamp"
					],
					formatter: this.formatter.getUnprocessedValue
				},
				tokens: {
					path: "view>AssignedValues",
					sorter: new Sorter({
						path: 'ValueId'
					}),
					filters: new Filter({
						filters: [
							new Filter({
								path: 'ValueId',
								operator: FilterOperator.NE,
								value1: ''
							}),
							new Filter({
								path: 'Description',
								operator: FilterOperator.NE,
								value1: ''
							})
						],
						and: false
					}),
					factory: this._createToken.bind(this)
				},
				tokenUpdate: this._onMultiInputTokenUpdate.bind(this)
			})).addStyleClass("sapVchclfMultiInput");
		},

		renderer: function (oRm, oControl) {
			Base.prototype.getRenderer().render(oRm, oControl);
		},

		/**
		 * @overridden
		 */
		getTechnicalValues: function (bIncludeValuesSetByObjDependency) {
			var fnGetValueFromToken = function (oToken) {
				var oValue = oToken.getBindingContext(Constants.VIEW_MODEL_NAME).getObject();
				return oValue.TechnicalValue;
			};
			var oCsticUiControl = this.getCsticUiControl();
			var aValues = oCsticUiControl.getTokens();
			if (!bIncludeValuesSetByObjDependency) {
				aValues = aValues.filter(this._includeValue.bind(this));
			}
			aValues = aValues.map(fnGetValueFromToken);
			return aValues;
		},

		/**
		 * @overridden
		 */
		getBindingNames: function () {
			return [
				"tokens",
				"value",
				"editable",
				"placeholder",
				"tooltip",
				"enabled"
			];
		},

		/**
		 * Checks if the entered value isn't assigned
		 *
		 * @param {sap.ui.core.Control} oControl: instance of an UI5 control
		 * @return {boolean} if the value has changed or not
		 * @public
		 * @function
		 */
		hasValueChanged: function () {
			// getValue represents the manual user input as long as it has not been assigned or the value could not be assigned since
			// it is invalid - in that case the value is kept after the assignment round-trip and not converted into a token
			if (this.getValue() !=="") {
				// we always try to re-assign
				return true;
			} else {
				// value can be empty in case no manual user input or the user has deleted a wrongly entered value - in that case the value
				// has changed and the assignment must done (this also releases the error value state)
				// to detected the deletion of wrongly entered value we compare the assigned values with the current token values
				
				// 1. retrieve the last assigned values
				var aLastAssignedValues = this.getCharacteristicData().AssignedValues;
				
				var fnGetTechnicalValue = function(oValue) {
					return oValue.TechnicalValue;
				};
				
				aLastAssignedValues = aLastAssignedValues.map(fnGetTechnicalValue);
				
				// 2. retrieve the token values
				var aTokenValues = this.getCsticUiControl().getBinding("tokens").getContexts().map(function(oContext) {
					return oContext.getObject();
				});
				
				aTokenValues = aTokenValues.map(fnGetTechnicalValue);
				
				// 3. compare the content of the arrays
				var isTechnicalValuesEqual = Helper.isContentOfArrayEqual(aLastAssignedValues, aTokenValues);
				
				return !isTechnicalValuesEqual;
			}
		}
	});
}, /* bExport= */ true);
