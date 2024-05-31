/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/ui/base/EventProvider",
	"sap/i2d/lo/lib/zvchclfz/common/util/CommandManager",
	"sap/i2d/lo/lib/zvchclfz/common/util/Command",
	"sap/i2d/lo/lib/zvchclfz/common/util/Logger",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/util/MessageManager",
	"sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/i2d/lo/lib/zvchclfz/common/util/Helper",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/control/ValueHelpDialog",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/formatter/CharacteristicFormatter",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/type/GroupRepresentation"
], function(UI5Object, EventProvider, CommandManager,Command, Logger, MessageManager, Constants, Helper, ValueHelpDialog, CharacteristicFormatter, GroupRepresentation) {
	"use strict";
	
	/**
	 * Processor for characteristic values - The processor is decoupled from the actual characteristic control and its life cycle which can be rather short in case of
	 * dependencies where all cstics must be re-created as constraint evaluation in engine can result in less or more cstics. This means that the processor for one
	 * cstic (id) stays the same (instance) throughout all valuation steps.
	 * 
	 * @class
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.CharacteristicValueProcessor
	 * @extends sap.ui.base.ManagedObject
	 */
	return UI5Object.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.CharacteristicValueProcessor", {
		
		metadata: {
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
					},
					assignSuccess: {
						type: "boolean"
					}
				}
			}
		},
		
		oManager: null,
		oModel: null,
		sPath: null,
		oSuspendPromise: null,
		
		/*
		 * ------------------------------------------------------ overrides ------------------------------------------------------------------------------
		 */
		
		constructor: function () {
			UI5Object.prototype.constructor.apply(this);
			this.bInitialized = false;
		},
		
		/*
		 * ------------------------------------------------------ public ------------------------------------------------------------------------------
		 */
		
		/**
		 * Initializes the processor - before initialization the processor may only be used for attaching to events
		 * @param {sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.CharacteristicValueProcessorManager} oManager - the mangager of cstic procesors
		 * @param {sap.ui.model.Context} oGroupBindingContext - the group binding context
		 * @param {string} sPath - path to the cstic in view model
		 * @param {string} sCsticTypeId - id of the characteristic type
		 * @param {sap.i2d.lo.lib.zvchclfz.components.valuation.model.ViewModel} oModel - the valuation view model
		 * @param {sap.ui.model.Model} oSettingsModel - the valuation settings model
		 * @param {sap.i2d.lo.lib.zvchclfz.components.valuation.dao.ValuationDAO} oValuationDAO - the valuation DAO
		 * @param {string} sEmbedderName - name of embedding application
		 * @param {object} oGroupRepresentation - representation of the group
		 * @public
		 */
		init: function(oManager, oGroupBindingContext, sPath, sCsticTypeId, oModel, oSettingsModel, oValuationDAO, sEmbedderName, oGroupRepresentation) {
			this.oManager = oManager;
			this.oGroupBindingContext = oGroupBindingContext;
			this.sPath = sPath;
			this.sCsticTypeId = sCsticTypeId;
			this.oModel = oModel;
			this.oSettingsModel = oSettingsModel;
			this.oValuationDAO = oValuationDAO;
			this.sEmbedderName = sEmbedderName;
			this.oGroupRepresentation = oGroupRepresentation;
			this.bInitialized = true;
		},
		
		/**
		 * Returns whether the given event handler function has been already registered
		 * @param {string} sEventId - the event id
		 * @param {fnFunction} fnFunction - the event handler function
		 * @param {object} oListener - an object as this scope
		 * @return {boolean} <code>true</code> in case the event handler with the given scope object has been already registered - <code>false</code> otherwise
		 */
		isAttachedToEvent: function(sEventId, fnFunction, oListener) {
			var aEventList = EventProvider.getEventList(this)[sEventId];
			if (aEventList) {
				var oEventReg;
				for (var i=0; i < aEventList.length; i++) {
					oEventReg = aEventList[i];
					if (oEventReg.fFunction === fnFunction && oEventReg.oListener === oListener) {
						return true;
					} else {
						return false;
					}
				}
			} else {
				return false;
			}
		},
		
		/**
		 * Sets the given promise for suspend state
	     * @param {Promise} oPromise - the promise representing the suspend state which should be kept until resolve is called for resume
         * @public
		 */
		setSuspendPromise: function(oPromise) {
			this.oSuspendPromise = oPromise;
		},
	
		/**
		 * Resolves the stored suspend promise directly if no requests are outstanding - otherwise asynchronously when requests caused by this CharacteristicValueProcessor instance have been completed
	     * @param {Promise} oPromise - the promise representing the suspend state which should be kept until resolve is called for resume
         * @public
		 */	
		ensureSuspendPromiseIsResolved: function() {
			if (this.oSuspendPromise) {
				// this function must run async to ensure that event based code first finishes
				setTimeout(function () {
					this.oManager.doWhenBackendRequestsAreCompleted(this.sCsticTypeId).then(function() {
						this.oSuspendPromise.resolve();
						this.oSuspendPromise = null;
					}.bind(this));
				}.bind(this), 100);	
			}
		},
		
		/**
		 * Sets the valuation view
		 * @param {sap.ui.core.mvc.View} oView - the valuation view
		 * @public
		 */
		setView: function(oView) {
			this.oView = oView;
		},
		
		/**
		 * Returns whether this processor has been initialized
		 * @return {boolean} - <code>true</code> if initialized - <code>false</code> otherwise
		 */
		isInitialized: function() {
			return this.bInitialized;
		},
		
		/**
		 * Applies the value and returns a promise that indicates when server has processed it 
		 * 
		 * @param {string} sValue - the value
		 * @param {string} aTechnicalValues - array of technical values
		 * @param {sap.ui.model.Binding} oBinding - the value binding to refresh
		 * @param {boolean} bDoNotIncludeInUndoRedoChain - the request isn't put into command manager for undo/redo
		 * @return {Promise} - a promise that is fulfilled when server has applies the value
		 * @public
		 */
		applyValue: function (sValue, aTechnicalValues, oBinding, bDoNotIncludeInUndoRedoChain) {

			var sConcatenatedValues = aTechnicalValues.join(";");
			var oCsticData = this._getCharacteristicData();

			var oPromise = new Promise(function (resolve, reject) {
				if (sConcatenatedValues || sValue) {
					this._assignEnteredValue(sValue, sConcatenatedValues, oCsticData, bDoNotIncludeInUndoRedoChain).then(function () {
						if (oBinding) {
							oBinding.refresh(true);
						}
						resolve();
					});
				} else {
					this._unassignAllValues().then(function() {
						resolve();
					});	
				}
			}.bind(this));
			
			this.oManager.pushBackendRequestPromise(oPromise, this.sCsticTypeId);

			return oPromise;
		},
		
		/**
		 * Applies the default values
		 * @return {Promise} - a promise that is fulfilled when the default values have been applied on the server side
		 * @public
		 */
		applyDefaultValues: function () {
			var oCsticData = this._getCharacteristicData();
			var sConcTechValues = "";
			var aValues = oCsticData.AssignedValues;
			for (var j = 0; aValues.length > j; j++) {
				var oValue = aValues[j];
				if (!oValue.IsSetByObjectDependency) {
					if (oValue.IsDefaultValue || oValue.IsSelected) {
						if (sConcTechValues.length > 0) {
							sConcTechValues = sConcTechValues.concat(";");
						}
						sConcTechValues = sConcTechValues.concat(oValue.TechnicalValue);
					}
				}
			}

			var oRedoValues = this._createValuesObject(oCsticData, "", "", sConcTechValues, 1);
			var oUndoValues = this._getUndoValues();
			
			var oCommand = this._createUndoRedoCommand(oRedoValues, oUndoValues, oCsticData);
			var oPromise = CommandManager.execute(oCommand);
			oPromise.catch(this._handleValuationError.bind(this));
			this.oManager.pushBackendRequestPromise(oPromise, this.sCsticTypeId);
			return oPromise;
		},
		
		/**
		 * Requests alternative values
		 * @param {Function} fnOpen - the function to call when the values have been retrieved
		 * @param {Function} fnError - the function to call in case of an error
		 * @param {sap.ui.model.Binding} oBinding - an optional binding that should be refreshed after loading the alternative  values
		 * @public
		 */
		requestAlternativeValues: function (fnOpen, fnError, oBinding) {
			var oCsticData = this._getCharacteristicData();
			
			if (!this.bValueHelpOpen) {
				if (this.oValuationDAO.isLoadNeeded(oCsticData)) {
					Logger.logDebug("CharacteristicValueProcessor loadAlternativeValues - requested", null, this);
					var oPromise = this.oValuationDAO.loadAlternativeValues(oCsticData, oBinding, true);
					oPromise.then(function () {
						if (fnOpen) {
							fnOpen();
						}
						Logger.logDebug("CharacteristicValueProcessor loadAlternativeValues - resolved", null, this);
					}.bind(this));
					this.oManager.pushBackendRequestPromise(oPromise, this.sCsticTypeId);
				} else {
					if (fnError) {
						fnError();
					}
					Logger.logDebug("CharacteristicValueProcessor loadAlternativeValues - not needed", null, this);
				}
			} else {
				Logger.logDebug("CharacteristicValueProcessor loadAlternativeValues skipped since ValueHelp is open", null, this);
			}
		},

		/**
		 * Opens a value help dialog - Note: the value help dialog is busy until potentially outstanding backend requests are completed
		 * @public
		 */
		openValueHelpDialog: function () {
			var oDataModel = this.oValuationDAO.getDataModel();
			
			var oValueHelpDialog = new ValueHelpDialog();
			
			oValueHelpDialog.attachChange(function(oEvent) {	
				var sValue = oEvent.getParameter("value");
				var aTechnicalValues = oEvent.getParameter("technicalValues");
				var oBinding = oEvent.getParameter("binding");
				
				this.applyValue(sValue, aTechnicalValues, oBinding);
			}, this);
			
			var fnCloseValueHelpDlg = function () {
				// reset the flag
				this.bValueHelpOpen = false;
			}.bind(this);
			oValueHelpDialog.getDialog().attachCancel(null, fnCloseValueHelpDlg);
			oValueHelpDialog.getDialog().attachConfirm(null, fnCloseValueHelpDlg);
			
			this.oView.addDependent(oValueHelpDialog);
			
			var oCtx = this.oModel.createBindingContext(this.sPath);
			oValueHelpDialog.setBindingContext(oCtx, "view");
			oValueHelpDialog.setUndoValues(this._getUndoValues());
			oValueHelpDialog.open();

			// set the flag in order to prevent alternativeValuesRequest when focus goes back to inputfield although the value help is open!!
			this.bValueHelpOpen = true;

			// set the value help to busy until all requests have finished to ensure that potential 'valueAssigns' or 'calculateAlternativeValues' are through
			oValueHelpDialog.setBusy(true);

			// store the currently selected item as when queue has finished the selection is gone
			var aSelectedItemKeys = [];
			var sSelectedItemKey;
			var i, o;
			var aItems = oValueHelpDialog.getDialog().getItems();
			if (aItems.length > 0) {
				var aSelectedContexts = aItems[0].getParent().getSelectedContexts();
				for (i = 0; i < aSelectedContexts.length; i++) {
					o = aSelectedContexts[i].getObject();
					sSelectedItemKey = oDataModel.getKey(o);
					aSelectedItemKeys.push(sSelectedItemKey);
				}
			}
			Logger.logDebug("Characteristic _openValueHelpDialog - selection stored", null, this);

			this.oManager.doWhenBackendRequestsAreCompleted().then(function () {
				Logger.logDebug("Characteristic _openValueHelpDialog - re-apply selection", null, this);
				var sKey;
				var oBindingInfo;

				// perform the re-selection
				if (aSelectedItemKeys.length > 0) {
					var aItems = oValueHelpDialog.getDialog().getItems();
					for (i = 0; i < aItems.length; i++) {
						oBindingInfo = aItems[i].getBindingInfo("selected");
						if (oBindingInfo) {
							sKey = oDataModel.getKey(oBindingInfo.binding.getValue());
							if ($.inArray(sKey, aSelectedItemKeys) > -1) {
								aItems[i].setSelected(true);
							}
						}
					}
				}

				oValueHelpDialog.setBusy(false);
			}.bind(this));
		},
		
		/*
		 * ------------------------------------------------------ private ------------------------------------------------------------------------------
		 */
		
		/**
		 * Return the characteristic data object from the view model
		 * @return {object} - the characteristic data object
		 * @private
		 */
		_getCharacteristicData: function () {
			return this.oModel.getProperty(this.sPath);
		},


		/**
		 * Assigns the entered value
		 * @param {String} sEnteredValue - the entered value
		 * @param {String sConcatTechValues - concatenated technical values
		 * @param {Object} oCsticData - the cstic data object
		 * @param {boolean} bDoNotIncludeInUndoRedoChain - whether to include the assignment in the undo/redo chain
		 * @return {Promise} Returns a promise that is fulfilled when the value has been assigned
		 * @private
		 */
		_assignEnteredValue: function (sEnteredValue, sConcatTechValues, oCsticData, bDoNotIncludeInUndoRedoChain) {
			var oRedoValue = this._createValuesObject(oCsticData, "", sEnteredValue, sConcatTechValues, 1);
			var oUndoValue = this._getUndoValues();
			
			var oCommand = this._createUndoRedoCommand(oRedoValue, oUndoValue, oCsticData);
			var oPromise;
			if (bDoNotIncludeInUndoRedoChain) {
				oPromise = oCommand.execute();
			} else {
				oPromise = CommandManager.execute(oCommand);
			}
			oPromise.catch(this._handleValuationError.bind(this));
			this.oManager.pushBackendRequestPromise(oPromise, this.sCsticTypeId);
			return oPromise;
		},

		/**
		 * Unassigns all values
		 * @return {Promise} Returns a promise that is fulfilled when the un-assignment has been completed on the server side
		 * @private
		 */
		_unassignAllValues: function () {
			var oCsticData = this._getCharacteristicData();
			var sConcValueIDs = "",
				//sConcValueStrings = "",
				sConcTechValues = "";

			var aValues = oCsticData.AssignedValues;
			for (var j = 0; aValues.length > j; j++) {
				var oValue = aValues[j];

				if (!oValue.IsSetByObjectDependency) {
					if (sConcValueIDs.length > 0) {
						sConcValueIDs = sConcValueIDs.concat(";");
					}
					sConcValueIDs = sConcValueIDs.concat(oValue.ValueId);

					if (sConcTechValues.length > 0) {
						sConcTechValues = sConcTechValues.concat(";");
					}
					sConcTechValues = sConcTechValues.concat(oValue.TechnicalValue);
				}
			}

			var oRedoValue = this._createValuesObject(oCsticData, "", "", "", -1);
			var oUndoValue = this._createValuesObject(oCsticData, "", "", sConcTechValues, 1);

			var oCommand = this._createUndoRedoCommand(oRedoValue, oUndoValue, oCsticData);
			var oPromise = CommandManager.execute(oCommand);
			oPromise.catch(this._handleValuationError.bind(this));
			this.oManager.pushBackendRequestPromise(oPromise, this.sCsticTypeId);
			return oPromise;
		},
		
		/**
		 * Handles an value assignment error
		 * @param {Error} oError - the error object
		 * @private
		 */
		_handleValuationError: function (oError) {
			// The error can be something like "Cannot read property 'xyz' of undefined".
			// Log information about the call stack in the console: 
			if (oError) {
				Logger.logErrorStack(oError, this);
			} else {
				Logger.logError("An unknown error occurred.", null, this);
			}
			// Release the UI from busy:
			this._setBusy(false);
		},

		/**
		 * Sets the busy indicator
		 * @param {boolean} bBusy - <code>true</code> if busy indicator should be set - <code>false</code>otherwise
		 */
		_setBusy: function (bBusy) {
			this.oModel.setProperty("/" + this.sCsticTypeId, {busy: bBusy});
		},
		
		/**
		 * Refreshes the current cstic group
		 * @param {object} oValue the assigned value.
		 * @return {Promise} Returns a promise that is fulfilled when the refresh has been completed
		 * @private
		 */
		_refreshGroup: function (oValue) {
			this.fireChange({
				path: this.oGroupBindingContext.getPath()
			});
			var oAppStateModel = this.oValuationDAO.getAppStateModel("appStateModel");
			oAppStateModel.resetLoadedGroups();
			
			var oPromise;

			//switch until classification also moves to new concept with cstic timestamp
			if (this.oGroupRepresentation === GroupRepresentation.FullScreen) {
				oPromise = this.oValuationDAO.readCharacteristicsOfGroup({
					ContextId: oValue.ContextId,
					InstanceId: oValue.InstanceId,
					GroupId: oValue.GroupId
				}, true);
			} else {
				oPromise = this.oValuationDAO.readCharacteristics(this.oGroupBindingContext, true);
			}
			return oPromise;
		},
		
		/**
		 * Determines from the given response whether the value has been changed
		 * @param {array} aResponse - the response array
		 * @return {boolean} <code>true</code> if the value has been changed - <code>false</code> otherwise
		 * @private
		 */
		_hasValueChanged: function(aResponse) {
			var bChanged = false;
			if (aResponse) {
				if (aResponse.results) {
					//single result from OData calls
					if (aResponse && aResponse.results) {
						bChanged = true;
					}
				} else {
					for (var i = 0; i < aResponse.length; i++) {
						var oResponse = aResponse[i];
						if (oResponse && oResponse.results) {
							bChanged = true;
							break;
						}
					}
				}
			}
			return bChanged;
		},
		
		/**
		 * Creates the command for a value assignment which also consists of the appropriate undo information
		 * @param {Object} oRedoValue - value for assignment
		 * @param {Object} oUndoValue - value which revokes the assignment (previous assignment)
		 * @param {Object} oCsticData - the characteristic data object
		 * @return {sap.i2d.lo.lib.zvchclfz.common.util.Command} Returns a command which can be used to undo the operation using the CommandManager
		 * @private
		 */
		_createUndoRedoCommand: function (oRedoValue, oUndoValue, oCsticData) {
			
			var fnUndoRedo = function (iDirection, oValue, oCsticData) {
				var aPromises = [];
				this._setBusy(true);

				MessageManager.dropCharacteristicMessages();
				var oAssignCharacteristicsValuePromise = this.oValuationDAO.assignCharacteristicValue(oValue, iDirection, oCsticData, this.sEmbedderName === Constants.CONFIGURATION);
				
				this.oModel.resetInconsistencyData();
				var oRefreshGroupPromise = this._refreshGroup(oValue);
				
				oAssignCharacteristicsValuePromise.then(function(oResponse) {

					var bAssignSuccess;
					if (oResponse.CharacteristicValueAssign) {
						bAssignSuccess = oResponse.CharacteristicValueAssign.Success;
					} else if (oResponse.ClearCharacteristic) {
						bAssignSuccess = oResponse.ClearCharacteristic.Success;
					} else {
						throw Error("Unhandled assign response.");
					}
			
					oRefreshGroupPromise.then(function(aResponse) {
						var iValuationStepCount = this.oSettingsModel.getProperty("/valuationStepsCount");
						this.oSettingsModel.setProperty("/valuationStepsCount", iValuationStepCount + 1);
						this._setBusy(false);
						// Due to the merge of the received data into the view model,
						// the control might be removed, e.g. when a filter "no value assigned" is applied and the
						// cstic gets a value assigend
						if (this.oSuspendPromise) {
							this.oSuspendPromise.resolve();
						}
						if (this._hasValueChanged(aResponse)) {				
							var sKey = this.oValuationDAO.getDataModel().createKey("CharacteristicSet", this._getCharacteristicData());
							this.fireAfterChange({
								path: "/" + sKey,
								assignSuccess: bAssignSuccess
							});
						}
						
					}.bind(this));
				
				}.bind(this));
				
				aPromises.push(oAssignCharacteristicsValuePromise);
				aPromises.push(oRefreshGroupPromise);
				var oAssignRefreshPromise = Promise.all(aPromises);

				// Only need update of group count when filters are present
				var oAppStateModel = this.oValuationDAO.getAppStateModel();
				if(oAppStateModel.hasFilters()){
					// The count promise strictly needs to run after the assign because it is its own batch
					oAssignRefreshPromise.then(function(){
						this.oValuationDAO.readCharacteristicCountOfAllGroups(this.oGroupBindingContext);
					}.bind(this));
				}
				
				this.fireUndoRedo();
				return oAssignRefreshPromise;
			}.bind(this);
			
			return new Command(this.getId(), {
							oValue: oRedoValue,
							oCsticData: oCsticData,
							oCstic: this,
	
							execute: function () {
								return fnUndoRedo(this.oValue.Direction, this.oValue.ValueObject, this.oCsticData);
							}
					}, {
							oValue: oUndoValue,
							oCsticData: oCsticData,
							oCstic: this,
	
							execute: function () {
								return fnUndoRedo(this.oValue.Direction, this.oValue.ValueObject, this.oCsticData);
							}
					});
		},

		/**
		 * Creates a values object for value assignment
		 * @param {Object} oCsticData - the characteristic data object
		 * @param {String} sValueId - the value id
		 * @param {String} sEnteredValue - the entered value
		 * @param {String} sConcatTechValues - the concatenated technical valuesa
		 * @param {String} sDirection - the direction in undo/redo chain
		 * @return {Object} the values object used within a Command
		 * @private
		 */
		_createValuesObject: function (oCsticData, sValueId, sEnteredValue, sConcatTechValues, sDirection) {
			return {
				Direction: sDirection,
				ValueObject: {
					ContextId: oCsticData.ContextId,
					InstanceId: oCsticData.InstanceId,
					GroupId: oCsticData.GroupId,
					CsticId: oCsticData.CsticId,
					ValueId: sValueId,
					StringValue: sEnteredValue,
					TechnicalValue: sConcatTechValues
				}
			};
		},

		/**
		 * Creates an undo values object by obtaining the currently assigned value
		 * @return {object} - object containing the key fields for value assign/unassign
		 * @private
		 */
		_getUndoValues: function () {
			var oCsticData = this._getCharacteristicData();
			var sPreviousConcTechValues = this._getConcatenatedValues();
			var sValueId = "0";
			var iDirection = -1;
			if (sPreviousConcTechValues) {
				iDirection = 1;
				sValueId = "";
			}
			return this._createValuesObject(oCsticData, sValueId, "", sPreviousConcTechValues, iDirection);
		},

		/**
		 * Concatenates the values
		 * @return {String} returns the concatenated values
		 * @private
		 */
		_getConcatenatedValues: function () {
			var sConcValues = "";
			var oCsticData = this._getCharacteristicData();
			var aValues = oCsticData.AssignedValues;
			for (var j = 0; aValues.length > j; j++) {
				var oValue = aValues[j];
				if (!oValue.IsDefaultValue && !oValue.IsReadonly) {
					if (sConcValues.length > 0) {
						sConcValues = sConcValues.concat(";");
					}
					sConcValues = sConcValues.concat(oValue.TechnicalValue);
				}
			}
			return sConcValues;
		}		
		

	});
	
});
