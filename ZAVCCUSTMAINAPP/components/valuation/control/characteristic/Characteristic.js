/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([
	"sap/m/FlexBox",
	"sap/m/FlexBoxRenderer",
	"sap/m/Label",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/control/characteristic/type/Text",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/control/characteristic/type/Input",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/control/characteristic/type/Select",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/control/characteristic/type/MultiInput",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/control/characteristic/CharacteristicValueProcessorManager",
	"sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/type/Characteristic",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/type/GroupRepresentation",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/formatter/CharacteristicFormatter",
	"sap/i2d/lo/lib/zvchclfz/common/util/Logger"
], function (FlexBox, FlexBoxRenderer, Label, Text, Input, Select, MultiInput, CharacteristicValueProcessorManager, Constants,
	CharacteristicType, GroupRepresentation, formatter, Logger) {
	"use strict";

	var TYPES = {
		"INPUT": Input,
		"MULTI_INPUT": MultiInput,
		"SELECT": Select,
		"TEXT": Text
	};

	//limit to switch from e.g. dropdown to input field
	var DOM_VALUES_LIMIT = 20;

	var CONTROL_SELECTION_TYPE = {
		MULTI_INPUT_LESS_DOM_VAL: 0,
		MULTI_INPUT_MANY_DOM_VAL: 1,
		SINGLE_VALUE_NO_ADDITIONAL_VALUES: 2,
		SINGLE_INPUT_ADDITIONAL_VALUES: 3,
		SINGLE_INPUT_MANY_DOM_VAL: 4,
		SINGLE_INPUT_LESS_DOM_VAL: 5
	};

	/**
	 * Characteristic composite control. The class is responsible for creating the right input control based on the bound 
	 * characteristic entity.
	 * 
	 * @class
	 * @abstract
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.Characteristic
	 * @extends sap.m.FlexBox
	 */
	return FlexBox.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.Characteristic", { /** @lends sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.Characteristic.prototype */
		metadata: {
			properties: {
				editable: {
					type: "boolean"
				},
				valuationDAO: {
					type: "sap.i2d.lo.lib.zvchclfz.components.valuation.dao.ValuationDAO"
				},
				groupBindingContext: {
					type: "sap.ui.model.Context"
				},
				groupRepresentation: {
					type: "sap.i2d.lo.lib.zvchclfz.components.valuation.type.GroupRepresentation"
				},
				embedderName: {
					type: "string"
				},
				settingsModel: {
					type: "sap.ui.model.Model"
				}
			},
			events: {
				"select": {
					parameters: {
						path: {
							type: "string"
						}
					}
				},
				"undoRedo": {},
				"change": {
					path: {
						type: "string"
					}
				},
				"afterChange": {
					path: {
						type: "string"
					}
				}
			}
		},
		
		_oCharacteristicType: null,
		
		/*
		 * ------------------------------------------------------ overrides ------------------------------------------------------------------------------
		 */

		constructor: function (sId, mSettings, oScope) {
			mSettings.direction = "Column";
			mSettings.fitContainer = true;
			mSettings.justifyContent = "End";
			FlexBox.prototype.constructor.apply(this, [sId, mSettings, oScope]);
			this.addStyleClass("sapVchclfCsticFlexBox");
			this.bIsSettingParent = false;
		},

		/**
		 * @override
		 */
		renderer: function (oRm, oCharacteristic) {
			FlexBoxRenderer.render(oRm, oCharacteristic);
		},
		
		/**
		 * @override
		 */
		setBindingContext: function(oContext, sModelName) {
			FlexBox.prototype.setBindingContext.apply(this, [ oContext, sModelName ] );
			if (sModelName === "view") {
				// derive the valueStates context from the view context
				var oCharacteristic = oContext.getObject();
				var sPath = "/ValueStates/" + oCharacteristic.ContextId + "/" + oCharacteristic.GroupId + "/" + oCharacteristic.CsticId;
				var oValueStatesCtx = oContext.getModel().createBindingContext(sPath);
				FlexBox.prototype.setBindingContext.apply(this, [ oValueStatesCtx, "valueStates" ] );
			}
		},

		/**
		 * @override
		 */
		setEditable: function (bEditable) {
			var bCurrentEditable = this.getEditable();
			this.setProperty("editable", bEditable);
			if (bEditable !== bCurrentEditable) {
				this._updateCharacteristicType();
			}
		},
		
		/**
		 * @override
		 */
		setEmbedderName: function (sEmbedderName) {
			this.setProperty("embedderName", sEmbedderName);
			if (this._oCharacteristicType) {
				this._oCharacteristicType.setEmbedderName(sEmbedderName);
			}
		},
		
		/**
		 * @override
		 */
		setParent: function (oParent) {
			this.bIsSettingParent = true;
			FlexBox.prototype.setParent.apply(this, arguments);
			this.bIsSettingParent = false;
			if (oParent) {
				this._updateCharacteristicType();
			}
			return this;
		},
		
		/*
		 * ------------------------------------------------------ public ------------------------------------------------------------------------------
		 */

		/**
		 * Puts the focus on the used input control
		 * @public
		 */
		focus: function () {
			this._oCharacteristicType.focus();
		},

		
		/**
		 * Returns the id of the used inner input control
		 * @return {string} - the id
		 */
		getCharacteristicTypeId: function () {
			return this.getId() + "--characteristic";
		},

		/*
		 * ------------------------------------------------------ private ------------------------------------------------------------------------------
		 */
		
		/**
		 * Updates the input control representation according to the retrieved characteristic data
		 * @private
		 */
		_updateCharacteristicType: function () {
			if (!this.bIsSettingParent) {			
				var oCharacteristicData = this._getCharacteristicData();
	
				if (!oCharacteristicData) {
					return;
				}
				
	
				if (this._oCharacteristicType) {
					this._oCharacteristicType.destroy();
				}
				if (this._oCharacteristicLabel) {
					this._oCharacteristicLabel.destroy();
				}
	
				this._oCharacteristicType = this._createCharacteristicType();
				this._oCharacteristicLabel = this._oCharacteristicType.createLabel.apply(this._oCharacteristicType);
	
				this.addItem(this._oCharacteristicLabel);
				this.addItem(this._oCharacteristicType);
				
				Logger.logDebug("Characteristic _updateCharacteristicType '{0}'", [oCharacteristicData.CsticId], this);
			}
		},

		/**
		 * Creates the input control depending on the type of characteristic
		 * @return {sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.type.Base} - the created input control
		 * @private
		 */
		_createCharacteristicType: function () {
			var iCountDomValues = this._getCountOfAvailableDomValues();
			var bSingleValued = this._isSingleValued();
			var bUserInputNecessary = this._isUserInputNecessary();
			var bIntervalAllowed = this._isIntervalAllowed();
			var bDomainHasIntervalValues = this._domainHasIntervalValues();
			var sType = this._determineCharacteristicType(iCountDomValues,
				bSingleValued,
				bUserInputNecessary,
				bIntervalAllowed,
				bDomainHasIntervalValues,
				this.getEditable());

			var sId = this.getCharacteristicTypeId();
			var oType = null;

			var Control = TYPES[sType];
			if (Control) {
				oType = new Control(sId, {
					embedderName: this.getEmbedderName()
				});
			} else {
				throw new Error("Unknown control type: " + sType);
			}

			this._registerBasicEvents(oType);

			return oType;
		},

		/**
		 * Attaches listeners to input control events
		 * @param {sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.type.Base} oType - the input control
		 * @private
		 */
		_registerBasicEvents: function (oType) {
			oType.attachChange(this._onValueChange, this);
			oType.attachAcceptDefaultValues(this._onAcceptDefaultValues, this);
			oType.attachAlternativeValueRequest(this._onAlternativeValueRequest, this);
			oType.attachValueHelpRequest(this._onValueHelpRequest, this);
			oType.attachSelect(this._onSelect, this);
		},	

		/**
		 * Event handler for valueChange
		 * @param {sap.ui.base.Event} oEvent - the event object
		 * @private
		 */
		_onValueChange: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var aTechnicalValues = oEvent.getParameter("technicalValues");
			var oBinding = oEvent.getParameter("binding");
			CharacteristicValueProcessorManager.getProcessor(this).applyValue(sValue, aTechnicalValues, oBinding);
		},
		
		/**
		 * Event handler for accepting default values
		 * @param {sap.ui.base.Event} oEvent - the event object
		 * @private
		 */
		_onAcceptDefaultValues: function (oEvent) {
			CharacteristicValueProcessorManager.getProcessor(this).applyDefaultValues().then(function () {
				this.focus();
			}.bind(this));
		},
		
		/**
		 * Event handler for alternative values request
		 * @param {sap.ui.base.Event} oEvent - the event object
		 * @private
		 */
		_onAlternativeValueRequest: function (oEvent) {
			var oBinding = oEvent.binding;
			var fnOpen = oEvent.open;
			var fnError = oEvent.error;

			if (oEvent.getParameter) {
				oBinding = oEvent.getParameter("binding");
				fnOpen = oEvent.getParameter("open");
				fnError = oEvent.getParameter("error");
			}
			Logger.logDebug("Characteristic _onAlternativeValueRequest", null, this);
			
			CharacteristicValueProcessorManager.getProcessor(this).requestAlternativeValues(fnOpen, fnError, oBinding);
		},
		
		/**
		 * Event handler for value help request
		 * @param {sap.ui.base.Event} oEvent - the event object
		 * @private
		 */
		_onValueHelpRequest: function () {
			// compare old with current value -> if different (in case user just entered sth.), first process value
			if (this._oCharacteristicType.hasValueChanged()) {

				var sValue = this._oCharacteristicType.getValue();
				var aTechnicalValues = this._oCharacteristicType.getTechnicalValues();
				var oBinding = this._oCharacteristicType.getBinding("value");

				CharacteristicValueProcessorManager.getProcessor(this).applyValue(sValue, aTechnicalValues, oBinding, true);
			}
			CharacteristicValueProcessorManager.getProcessor(this).openValueHelpDialog();
		},

		/**
		 * Event handler for select event
		 * @param {sap.ui.base.Event} oEvent - the event object
		 * @private
		 */
		_onSelect: function () {
			CharacteristicValueProcessorManager.getProcessor(this).fireSelect({
				path: this.getValuationDAO().createCharacteristicKey(this._getCharacteristicData())
			});
		},


		/**
		 * Returns the corresponding data object from the view model
		 * @return {object} - the data object
		 * @private
		 */
		_getCharacteristicData: function () {
			var oContext = this.getBindingContext(Constants.VIEW_MODEL_NAME);
			return oContext ? oContext.getObject() : null;
		},
		

		/**
		 * Returns the count of available domain values
		 * @return {int} - the count
		 * @private
		 */
		_getCountOfAvailableDomValues: function () {
			return this._getCharacteristicData().ValueCount;
		},

		/**
		 * Returns whether the characteristic is restricted to a single value
		 * @return {boolean} - <code>true</code> if is single valued - <code>false</code> otherwise 
		 * @private
		 */
		_isSingleValued: function () {
			return this._getCharacteristicData().IsSingleValued;
		},

		/**
		 * For the UI there is no difference between additional values allowed and interval allowed
		 * In both cases the user needs the option to type freely
		 * @return {boolean} - <code>true</code> if user input must be possible - otherwise <code>false</code>
		 * @private
		 */
		_isUserInputNecessary: function () {
			return this._getCharacteristicData().AdditionalValuesAllowed || this._getCharacteristicData().IsIntervalAllowed;
		},

		/**
		 * Returns values can be expressed as intervals
		 * @return {boolean} - <code>true</code> if an interval is allowed - otherwise <code>false</code>
		 * @private
		 */
		_isIntervalAllowed: function () {
			return this._getCharacteristicData().IsIntervalAllowed;
		},

		/**
		 * Returns if the domain contains interval values
		 * @return {boolean} - <code>true> if domain consists of at least one interval value - otherwise <code>false</code>
		 * @private
		 */
		_domainHasIntervalValues: function () {
			return this._getCharacteristicData().DomainHasIntervalValues;
		},

		/**
		 * Determines the characteristic type (input control) according to the provided value settings
		 * @param {integer} iAvailableDomValues - domain values count
		 * @param {boolean} bSingleValued  - if cstic is restricted to single value
		 * @param {boolean} bUserInputNecessary - if user input must be provided
		 * @param {boolean} bIntervalAllowed - if intervals are allowed
		 * @param {boolean} bDomainHasIntervalValues - if domain has at least one interval value
		 * @param {boolean} bEditable - if cstic is editable
		 * @private
		 * Problem case
		 *		bUserInputNecessary = true
		 *		DomainHasIntervalValues = true
		 *		IsSingleValued = true  
		 *        CONTROL_SELECTION_TYPE.SINGLE_INPUT_ADDITIONAL_VALUES
		 */
		_determineCharacteristicType: function (iAvailableDomValues, bSingleValued, bUserInputNecessary, bIntervalAllowed,
			bDomainHasIntervalValues, bEditable) {

			var sType = CharacteristicType.TEXT;

			//initial value is always single input with a lot of dom values => input field
			var sControlSelectionType = CONTROL_SELECTION_TYPE.SINGLE_INPUT_MANY_DOM_VAL;
			if (bSingleValued) {
				if (bDomainHasIntervalValues) {
					if (bIntervalAllowed) {
						sControlSelectionType = CONTROL_SELECTION_TYPE.SINGLE_INPUT_LESS_DOM_VAL;
					} else {
						sControlSelectionType = CONTROL_SELECTION_TYPE.SINGLE_INPUT_ADDITIONAL_VALUES;
					}
				} else if (iAvailableDomValues >= DOM_VALUES_LIMIT) {
					sControlSelectionType = CONTROL_SELECTION_TYPE.SINGLE_INPUT_MANY_DOM_VAL;
				} else {
					if (iAvailableDomValues > 0) {
						if (bUserInputNecessary) {
							sControlSelectionType = CONTROL_SELECTION_TYPE.SINGLE_INPUT_LESS_DOM_VAL;
						} else {
							sControlSelectionType = CONTROL_SELECTION_TYPE.SINGLE_VALUE_NO_ADDITIONAL_VALUES;
						}
					} else {
						sControlSelectionType = CONTROL_SELECTION_TYPE.SINGLE_INPUT_ADDITIONAL_VALUES;
					}
				}
			} else {
				if (iAvailableDomValues >= DOM_VALUES_LIMIT) {
					sControlSelectionType = CONTROL_SELECTION_TYPE.MULTI_INPUT_MANY_DOM_VAL;
				} else {
					sControlSelectionType = CONTROL_SELECTION_TYPE.MULTI_INPUT_LESS_DOM_VAL;
				}
			}

			if (bEditable) {
				switch (sControlSelectionType) {
				case CONTROL_SELECTION_TYPE.MULTI_INPUT_LESS_DOM_VAL:
					sType = CharacteristicType.MULTI_INPUT;
					break;
				case CONTROL_SELECTION_TYPE.MULTI_INPUT_MANY_DOM_VAL:
					sType = CharacteristicType.MULTI_INPUT;
					break;
				case CONTROL_SELECTION_TYPE.SINGLE_VALUE_NO_ADDITIONAL_VALUES:
					sType = CharacteristicType.SELECT;
					break;
				case CONTROL_SELECTION_TYPE.SINGLE_INPUT_ADDITIONAL_VALUES:
					sType = CharacteristicType.INPUT;
					break;
				case CONTROL_SELECTION_TYPE.SINGLE_INPUT_MANY_DOM_VAL:
					sType = CharacteristicType.INPUT;
					break;
				case CONTROL_SELECTION_TYPE.SINGLE_INPUT_LESS_DOM_VAL:
					sType = CharacteristicType.INPUT;
					break;
				}
			}

			return sType;
		}

	});
}, /* bExport= */ true);
