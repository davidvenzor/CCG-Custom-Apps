/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([
	"sap/m/FlexBox",
	"sap/m/FlexBoxRenderer",
	"sap/m/FlexItemData",
	"sap/m/Label",
	"sap/m/Button",
	"sap/m/Text",
	"sap/ui/model/json/JSONModel",
	"sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/formatter/CharacteristicFormatter",
	"sap/i2d/lo/lib/zvchclfz/common/util/Logger",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/control/characteristic/CharacteristicValueProcessorManager"
], function (FlexBox, FlexBoxRenderer, FlexItemData, Label, Button, Text, JSONModel, Constants, formatter, Logger, CharacteristicValueProcessorManager) {
	"use strict";

	/**
	 * Input base class.
	 * 
	 * @class
	 * @abstract
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.type.Base
	 * @extends sap.m.FlexBox
	 */
	return FlexBox.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.type.Base", { /** @lends sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.type.Base.prototype */
		metadata: {
			abstract: true,
			properties: {
				embedderName: {
					type: "string"
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
						},
						binding: {
							type: "object"
						}
					}
				},
				"acceptDefaultValues": {
					parameters: {}
				},
				"valueHelpRequest": {
					parameters: {}
				},
				/**
				 * This event is fired when the characteristic UI control is focused and calculate alternative values is reuqired
				 * the following actions:
				 * <ul>
				 * 	<li>Items binding: Binding</li>
				 * 	<li>Callback function: Open</li>
				 * 	<li>Callback function: Error</li>
				 * </ul>
				 */
				"alternativeValueRequest": {
					parameters: {
						/**
						 * Binding of any items which needs to be refreshed 
						 */
						binding: {
							type: "object" // optional
						},
						/**
						 * Callback function to open any list 
						 */
						open: {
							type: "function" // optional
						},
						/**
						 * Callback function in case of error during alternative values request 
						 */
						error: {
							type: "function" // optional
						}
					}
				},
				"select": {
					parameters: {}
				},
				"deselect": {
					parameters: {}
				}
			}
		},

		constructor: function (sId, mSettings, oScope) {
			mSettings.alignItems = "Center";
			mSettings.fitContainer = true;
			mSettings.justifyContent = "Start";
			mSettings.width = "100%";
			FlexBox.prototype.constructor.apply(this, [sId, mSettings, oScope]);
		},

		renderer: function (oRm, oControl) {
			FlexBoxRenderer.render(oRm, oControl);
		},

		init: function () {

			var sId = this._createId("input");
			var oCsticUiControl = this.oCsticUiControl = this.create(sId, this.getDefaultSettings(), this.getFreeInputDefaultSettings());
			this.addItem(oCsticUiControl);

			this._initUiStateModel();

			if (this.isUserInputType()) {
				if (this.showUnitOfMeasure()) {
					var oUnitControl = this._createUnitOfMeasure();
					this.addItem(oUnitControl);
				}

				var oStyleClass = new sap.ui.core.CustomData({
					key: "styleClass",
					value: {
						parts: [
							"view>HasDefaultValues"
						],
						formatter: this.setStyleClass.bind(this)
					}
				});
				oCsticUiControl.addCustomData(oStyleClass);

				this.oCsticUiControl.setLayoutData(this._createInputLayoutData());
				var oDefaultButton = this._oDefaultButton = this._createDefaultButton();
				this.addItem(oDefaultButton);
			}

			this.onKeyPressCallWhenEnabled = this.callWhenEnabled(this.onKeyPress.bind(this));
			this.attachEvents();
		},

		oCsticUiControl: null,
		_oDefaultButton: null,

		formatter: formatter,

		exit: function () {
			this.detachEvents();
		},

		createLabel: function () {
			return new Label({
				id: this._createId("label"),
				required: "{= ${view>IsRequired} && ${valuationSettings>/editable} }",
				tooltip: {
					parts: [{
						path: "view>"
					}, {
						path: "valuationSettings>/descriptionModeCharacteristics"
					}, {
						path: "i18n>CSTIC_LABEL_BOTH"
					}],
					formatter: formatter.getCharacteristicDescriptionWithNameAndColon
				},
				text: {
					parts: [{
						path: "view>"
					}, {
						path: "valuationSettings>/descriptionModeCharacteristics"
					}, {
						path: "i18n>CSTIC_LABEL_BOTH"
					}],
					formatter: formatter.getCharacteristicDescriptionWithNameAndColon
				},
				wrapping: true,
				labelFor: this._createId("input")
			});
		},

		getLabel: function () {
			return sap.ui.getCore().byId(this._createId("label"));
		},

		_createDefaultButton: function () {
			var sId = this._createId("acceptDefault");
			var oButton = new Button(sId, {
				type: "Transparent",
				visible: "{= ( !${view>IsHidden} && !${view>IsReadOnly} && ${view>HasDefaultValues} ) }",
				press: this._onAcceptDefaultValues.bind(this),
				icon: "sap-icon://accept",
				tooltip: "{i18n>ACCEPT_DEFAULT_VALUE}"
			});
			oButton.setLayoutData(this._createDefaultButtonLayoutData());
			return oButton;
		},

		_createUnitOfMeasure: function () {
			var sId = this._createId("unit");
			var oUnitOfMeasure = new Text(sId, {
				visible: "{= (${view>Unit} || ${view>Currency}) ? true : false }",
				text: "{= ${view>Currency} ? ${view>Currency} : ${view>Unit} }",
				wrapping: false
			});
			oUnitOfMeasure.setLayoutData(this._createUnitOfMeasureLayoutData());
			return oUnitOfMeasure;
		},

		/**
		 * @private
		 */
		_createInputLayoutData: function () {
			return new FlexItemData({
				baseSize: "100%",
				growFactor: 1,
				styleClass: "sapVchclfFlexItemInput"
			});
		},

		/**
		 * @private
		 */
		_createUnitOfMeasureLayoutData: function () {
			return new FlexItemData({
				styleClass: "sapUiSmallMarginBegin"
			});
		},

		/**
		 * @private
		 */
		_createDefaultButtonLayoutData: function () {
			return new FlexItemData({
				styleClass: "sapUiSmallMarginBegin"
			});
		},

		/**
		 * @private
		 */
		_onAcceptDefaultValues: function (oEvent) {
			this.fireAcceptDefaultValues();
		},

		/**
		 * @public
		 */
		focus: function () {
			this.getCsticUiControl().focus();
			// var oCsticUiControl = this.getCsticUiControl();
			// var oEventDelegate = {};
			// var setFocusOnAfterRendering = function () {
			// 	this.focus();
			// 	this.removeEventDelegate(oEventDelegate);
			// }.bind(oCsticUiControl);

			// oEventDelegate = {
			// 	onAfterRendering: setFocusOnAfterRendering
			// };

			// oCsticUiControl.addEventDelegate(oEventDelegate);
		},

		/**
		 * @private
		 */
		_createId: function (sIdPostfix) {
			return this.getId() + "--" + sIdPostfix;
		},

		/**
		 * @protected
		 * @abstract
		 */
		create: function (sId, mDefaultSettings, mFreeInputDefaultSettings) {
			throw new Error(" Abstract method. Not implemented yet.");
		},

		/**
		 * @protected
		 */
		getDefaultSettings: function () {
			return {
				name: "{view>CsticId}",
				width: "100%",
				enabled: "{= !${view>IsHidden} }",
				change: this.onChange.bind(this),
				tooltip: {
					parts: [
						"view>",
						"i18n>HAS_DEFAULT_VALUES",
						"i18n>VALUE_RANGE_PREFIX",
						"i18n>TEMPLATE_PREFIX",
						"i18n>ROUNDED_VALUE_PREFIX",
						"i18n>INTERVAL_REPRESENTATION",
						"i18n>UNIT_PREFIX",
						"i18n>CURRENCY_PREFIX",
						"view>ChangeTimestamp"
					],
					formatter: this.formatter.getTooltip
				},
				// value state refers to valueStates context which is also part of the view model
				valueState: "{valueStates>valueState}",
				valueStateText: "{valueStates>valueStateText}",
				// the busy indicator is bound to prevent that its state is lost when characteristic is re-created
				busy: "{view>/" + this.getId() + "/busy}",
				busyIndicatorDelay: 0
			};
		},

		/**
		 * @protected
		 */
		getFreeInputDefaultSettings: function () {
			return {
				editable: "{= !${view>IsReadOnly} }",
				liveChange: this.onLiveChange.bind(this),
				placeholder: {
					parts: [
						"view>",
						"i18n>HAS_DEFAULT_VALUES",
						"i18n>VALUE_RANGE_PREFIX",
						"i18n>TEMPLATE_PREFIX",
						"i18n>ROUNDED_VALUE_PREFIX",
						"i18n>INTERVAL_REPRESENTATION",
						"view>ChangeTimestamp"
					],
					formatter: this.formatter.getPlaceholder
				},
				showValueHelp: "{= ${view>ValueCount} > 0 }",
				valueHelpOnly: "{= !(${view>AdditionalValuesAllowed} || ${view>DomainHasIntervalValues}) }",
				valueHelpRequest: this.onValueHelpRequest.bind(this)
			};
		},

		/**
		 * @protected
		 */
		setStyleClass: function (bHasDefaultValue) {
			if (bHasDefaultValue) {
				this.getCsticUiControl().addStyleClass("sapVchclfContainsDefaults");
			} else {
				this.getCsticUiControl().removeStyleClass("sapVchclfContainsDefaults");
			}
		},

		/**
		 * @protected
		 */
		isUserInputType: function () {
			return true;
		},

		/**
		 * @protected
		 */
		showUnitOfMeasure: function () {
			return true;
		},

		/**
		 * @public
		 */
		getValue: function () {
			return this.getCsticUiControl().getValue();
		},

		/**
		 * @public
		 * @abstract
		 */
		getTechnicalValues: function () {
			throw new Error(" Abstract method. Not implemented yet.");
		},

		/**
		 * Checks if the value of one characteristic has changed
		 * @return {boolean} if the value has changed or not
		 * @public
		 * @abstract
		 */
		hasValueChanged: function () {
			throw new Error(" Abstract method. Not implemented yet.");
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
		 * Gets the value for one characteristic from data model
		 *
		 * @param {sap.ui.core.Control} oControl: instance of an UI5 control
		 * @return {string} getOldValue value
		 * @public
		 * @function
		 */
		getOldValue: function (oControl) {
			var oCstic = this.getCharacteristicData();
			var aAssignedValues = oCstic.AssignedValues;
			var sValue = "";
			if (aAssignedValues.length > 0) {
				var oValue = aAssignedValues[0];
				var sDescriptionMode = this.getModel("valuationSettings").getProperty("/descriptionModeValues");
				var sI18nDescriptionText = this.getResourceBundle().getText("VALUE_LABEL_BOTH");
				var sI18nTextForEmptyValue = this.getResourceBundle().getText("VALUE_LABEL_NO_VALUE");
				var sI18nRoundedValue = this.getResourceBundle().getText("ROUNDED_VALUE_PREFIX");
				var sI18nIntervalText = this.getResourceBundle().getText("INTERVAL_REPRESENTATION");
				var bFocused = true;
				var bNoUnitOfMeasure = false;
				sValue = this.formatter.getFormattedValueTextWithDescription(oValue, sDescriptionMode, sI18nDescriptionText,
					sI18nTextForEmptyValue, sI18nRoundedValue, sI18nIntervalText, bFocused, bNoUnitOfMeasure);
			}
			return sValue;
		},

		/**
		 * @protected
		 */
		getCsticUiControl: function () {
			return this.oCsticUiControl;
		},

		/**
		 * @private
		 */
		_initUiStateModel: function () {
			var uiStateModel = new JSONModel({
				focused: false
			});
			this.setModel(uiStateModel, Constants.UI_STATE_MODEL_NAME);
		},

		getUiStateFocused: function (oCsticControl) {
			return this.getUiStateModel().getProperty("/focused");
		},

		getUiStateModel: function () {
			return this.getModel(Constants.UI_STATE_MODEL_NAME);
		},

		/**
		 * Event handler. Called when a value in an input is changed.
		 * 
		 * @param  {sap.ui.base.Event} oEvent The causing event
		 * @protected
		 */
		onChange: function (oEvent) {
			Logger.logDebug("onChange cstic '{0}'", [this.getCharacteristicData().CsticId], this);
			// when the value is submitted, the default button must no longer be blocked
			this._oDefaultButton.setEnabled(true);
			this.fireChange({
				value: this.getValue(),
				technicalValues: this.getTechnicalValues(),
				binding: this.getBinding("value")
			});
		},

		/**
		 * Event handler. Called when a value in an input is changed live.
		 * 
		 * @param  {sap.ui.base.Event} oEvent The causing event
		 * @protected
		 */
		onLiveChange: function (oEvent) {

			var sValue = this.getValue();

			var oDefaultButton = this._oDefaultButton;

			if (sValue) {
				// as long as any value is entered it is not possible to confirm the default value
				oDefaultButton.setEnabled(false);
			} else {
				// if no value is entered the button to confirm the default value should be restored
				var oCsticData = this.getCharacteristicData();
				var aValues = oCsticData.AssignedValues;
				for (var i = 0; aValues.length > i; i++) {
					var oValue = aValues[i];
					if (oValue.IsDefaultValue === true) {
						oDefaultButton.setEnabled(true);
					}
				}
			}
		},

		/**
		 * @protected
		 */
		getCharacteristicData: function () {
			return this.getBindingContext(Constants.VIEW_MODEL_NAME).getObject();
		},

		/**
		 * Event handler. Called when then value help ist requested by the user.
		 * 
		 * @param  {sap.ui.base.Event} oEvent The causing event
		 * @protected
		 */
		onValueHelpRequest: function () {
			this.fireValueHelpRequest();
		},

		/**
		 * @protected
		 */
		getBindingNames: function () {
			throw new Error(" Abstract method. Not implemented yet.");
		},

		getBinding: function (sBindingName) {
			return this.getCsticUiControl().getBinding(sBindingName);
		},

		_isBusy: function () {
			return this.getCsticUiControl().getBusy();
		},

		_isValuationEditable: function () {
			return this.getModel("valuationSettings").getProperty("/editable");
		},
		
		_getAllBindings: function () {
			if (!this.bIsDestroyed) {
				var aBindingNames = this.getBindingNames();
				var aBindings = [];
				aBindingNames.forEach(function (sBindingName) {
					aBindings.push(this.getBinding(sBindingName));
				}.bind(this));
				return aBindings;
			} else {
				return [];	
			}
		},

		suspendBindings: function () {
			Logger.logDebug("Suspend bindings on cstic '{0}'", [this.getCharacteristicData().CsticId], this);
			this._getAllBindings().forEach(function (oBinding) {
				if (!oBinding.isSuspended() && !this._isBusy()) {
					// Suspend shall not be executed immediately but at the end
					// because the update of the displayed value due to the change of the "focused" property 
					// which is also bound to the control shall be updated before. (Display of precision value)
					jQuery.sap.delayedCall(0, this, function () {
						oBinding.suspend();
					});
				}
			}.bind(this));
		},

		/**
		 * Resumes binding of a given ui control
		 * @public
		 * @function
		 */
		resumeBindings: function () {
			Logger.logDebug("Resume bindings on cstic '{0}'", [this.getCharacteristicData().CsticId], this);
			this._getAllBindings().forEach(function (oBinding) {
				oBinding.resume();
			});
		},

		/**
		 * @protected
		 */
		callWhenEnabled: function (fnCallback) {
			return function () {
				if (this.isEditable()) {
					fnCallback.apply(this, arguments);
				}
			};
		},

		/**
		 * @protected
		 */
		callWhenDisabled: function (fnCallback) {
			return function () {
				if (!this.isEditable()) {
					fnCallback.apply(this, arguments);
				}
			};
		},

		onSelectWhenDisabled: function () {
			this.setUiStateFocused(true);
			this.fireSelect();
		},

		onSelect: function (qEvent) {
			var sTargetId = qEvent.target ? qEvent.target.id : "target undefined";
			Logger.logDebug("onSelect cstic '{0}' triggered by '{1}' on '{2}'", [this.getCharacteristicData().CsticId, qEvent.type, sTargetId],	this);

			// for an editable control the bindings are suspended as long as it has focus and a potential outstanding value assignment is finished
			if (this._isValuationEditable() && this.isEditable()) {
				var oSuspendPromise = $.Deferred();
				oSuspendPromise.then(function() {
					this.resumeBindings();
				}.bind(this));
				CharacteristicValueProcessorManager.getProcessorById(this.getId()).setSuspendPromise(oSuspendPromise);
				this.suspendBindings();
			}
			this.setUiStateFocused(true);
			this.fireSelect();
		},

		onDeselect: function (qEvent) {
			var sTargetId = qEvent.target ? qEvent.target.id : "target undefined";
			Logger.logDebug("onDeselect cstic '{0}' triggered by '{1}' on '{2}'", [this.getCharacteristicData().CsticId, qEvent.type, sTargetId],
				this);
			// BCP: 1980346105
			// de-select must not happen when the valueHelpIcon is clicked
			// TODO: rework the code based on 'focus-in' / 'focus-out' towards 'livechange' event
			var bSourceControlOfFocusoutIsInput = !(qEvent.relatedTarget !== null && qEvent.relatedTarget.classList.contains("sapMInputBaseIconContainer")) && !(qEvent.target !== null && qEvent.target.classList.contains("sapMInputBaseIconContainer"));
			if (bSourceControlOfFocusoutIsInput) {
				this.setUiStateFocused(false);
				CharacteristicValueProcessorManager.getProcessorById(this.getId()).ensureSuspendPromiseIsResolved();
				this.fireDeselect();
			}
		},

		isEditable: function () {
			var oCsticData = this.getCharacteristicData();
			return !oCsticData.IsReadOnly && !oCsticData.IsHidden;
		},

		/**
		 *Set the UI state 'focused' to active or inactive
		 *
		 * @param {Object} oSourceControl - Focused Control
		 * @param {Boolean} bFocused - Focus state (active or inactive)
		 * @protected
		 */
		setUiStateFocused: function (bFocused) {
			switch (bFocused) {
			case true:
				this._bDeselectedRegistered = false;
				if (!this.getUiStateFocused()) {
					this._setUiStateFocused(bFocused);
				}
				break;
			case false:
				if (this.getUiStateFocused()) {
					this._bDeselectedRegistered = true;

					jQuery.sap.delayedCall(0, this, function () {
						// The delayed call inside delayed call is needed 
						// because otherwise the function onblurEvent (in FocusHandler.js) 
						// is called AFTER onCharacteristicDeselected (which is the 'onfocusout' handler).
						// If onCharacteristicDeselected is called first the current user input will be removed 
						// (unwanted behavior: no change => no roundtrip). 
						// This is caused by binding refresh which is triggered by property "focused" (function _setUiStateFocused).
						// (Hint: property "focused" is bound to the attribute "value" of input field)
						jQuery.sap.delayedCall(0, this, function () {
							if (this._bDeselectedRegistered) {
								this._setUiStateFocused(bFocused);
								this._bDeselectedRegistered = false;
							}
						});
					});
				}
				break;
			}
		},

		_setUiStateFocused: function (bFocused) {
			this.getUiStateModel().setProperty("/focused", bFocused);
		},

		onKeyPress: function (oEvent) {
			if (oEvent.key === "Enter") {
				var oCstic = this.getCharacteristicData();

				if (oCstic.HasDefaultValues) {
					var sEnteredValue = this.getValue();

					var aValues = oCstic.AssignedValues;
					for (var i = 0; aValues.length > i; i++) {
						var oValue = aValues[i];
						if (oValue.IsDefaultValue === true) {
							var sDefaultValue = oValue.TechnicalValueDisplay;
							break;
						}
					}

					if (oCstic.IsSingleValued && (sEnteredValue = sDefaultValue) || !oCstic.IsSingleValued && sEnteredValue === "") {
						this.fireAcceptDefaultValues();
					}
				}
			}
		},

		setEmbedderName: function (sEmbedderName) {
			this.detachEvents();
			this.setProperty("embedderName", sEmbedderName);
			this.attachEvents();
		},

		/**
		 * @protected
		 */
		attachEvents: function () {
			this.getCsticUiControl().attachBrowserEvent("focusin", this.onSelect, this);
			this.getCsticUiControl().attachBrowserEvent("focusout", this.onDeselect, this);
			this.getCsticUiControl().attachBrowserEvent("keypress", this.onKeyPressCallWhenEnabled, this);
		},

		/**
		 * @protected
		 */
		detachEvents: function () {
			this.getCsticUiControl().detachBrowserEvent("focusin", this.onSelect, this);
			this.getCsticUiControl().detachBrowserEvent("focusout", this.onDeselect, this);
			this.getCsticUiControl().detachBrowserEvent("keypress", this.onKeyPressCallWhenEnabled, this);
		}
	});
}, /* bExport= */ true);
