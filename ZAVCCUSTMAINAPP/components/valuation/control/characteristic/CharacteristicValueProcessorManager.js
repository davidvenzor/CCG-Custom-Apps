/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/valuation/control/characteristic/CharacteristicValueProcessor",
	"sap/i2d/lo/lib/zvchclfz/common/util/Helper"
], function(CharacteristicValueProcessor, Helper) {
	"use strict";
	
	/**
	 * The CharacteristicValueProcessorManager manages the CharacterValueProcessors and allows to syncronize operations overall processors as
	 * it knows all processors and each processor has a reference to the manager
	 * 
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.CharacteristicValueProcessorManager
	 */
	var ProcessorManager = {
			
			mCsticProcessors: {},
			mCurrentBackendRequestPromises: [],
			
			/**
			 * Returns whether for the given cstic a processor has already been created
			 * @param {sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.Characteristic} oCstic - characteristic
			 * @return {boolean} Returns <code>true</code> if a processor exists for the specific cstic - otherwise <code>false</code>
			 * @public
			 */
			hasProcessor: function(oCstic) {
				var sCsticTypeId = oCstic.getCharacteristicTypeId();
				return this.mCsticProcessors[sCsticTypeId] !== undefined;
			},
			
			/**
			 * Detaches the given event handler from all processors where it has been attached
			 * @param {string} sEventId
			 * @param {Function} fnEvent - the event handler
			 * @param {object} oListener - a this scope object
			 * @public
			 */
			detachEventFromAllProcessors: function(sEventId, fnEvent, oListener) {
				for (var sKey in this.mCsticProcessors) {
					this.mCsticProcessors[sKey].detachEvent(sEventId, fnEvent, oListener);
				}
			},
			
			/**
			 * Creates a processor and registers it
			 * @param {sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.Characteristic} oCstic - characteristic
			 * @param {sap.ui.core.mvc.View} oView - the valuation view
			 * @return {sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.CharacteristicValueProcessor} Returns the created and not yet initialized processor
			 * @public
			 */
			createProcessor: function(oCstic, oView) {
				var sCsticTypeId = oCstic.getCharacteristicTypeId();
				var oProcessor = new CharacteristicValueProcessor();
				oProcessor.setView(oView);
				this.mCsticProcessors[sCsticTypeId] = oProcessor;
				return oProcessor;
			},
			
			/**
			 * Returns the corresponding processor for the given cstic
			 * @param {sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.Characteristic} oCstic - characteristic
			 * @param {boolean} bDoNotInitialize - in case the processor should be returned uninitialized
			 * @return  {sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.CharacteristicValueProcessor} the CharacteristicValueProcessor
			 * @public
			 */
			getProcessor: function(oCstic, bDoNotInitialize) {
				var sCsticTypeId = oCstic.getCharacteristicTypeId();
				if (!bDoNotInitialize) {
					this.mCsticProcessors[sCsticTypeId].init(this, 
					oCstic.getGroupBindingContext(), 
					oCstic.getBindingContext("view").getPath(), 
					sCsticTypeId, 
					oCstic.getModel("view"), 
					oCstic.getSettingsModel(),
					oCstic.getValuationDAO(), 
					oCstic.getEmbedderName(),
					oCstic.getGroupRepresentation());
				}
				return this.mCsticProcessors[sCsticTypeId];
			},
			
			getProcessorById: function (sCsticTypeId) {
				return this.mCsticProcessors[sCsticTypeId];
			},
			
			/**
			 * Resets the manager - all processors are deleted and potentially existing backend request promises are removed
			 * @public
			 */
			reset: function() {
				this.mCsticProcessors = {};
				this.mCurrentBackendRequestPromises = [];
			},
			
			/**
			 * Informs the manager about a pending backend request via the corresponding Promise - Note: each registered promise is automatically cleaned up when it is fulfilled (in success as well as in error case)
			 * @param {Promise} oPromise - promise that is fulfilled when the backend request completes
		     * @param {String} sGuidPrefix - an optional prefix for the guid used to manage the promise
			 * @public
			 */
			pushBackendRequestPromise: function(oPromise, sGuidPrefix) {
				var sGuid = Helper.uuidv4();
				if (sGuidPrefix) {
					sGuid = sGuidPrefix + sGuid;
				}
				oPromise.then(function() {
					delete this.mCurrentBackendRequestPromises[sGuid];
				}.bind(this));
				oPromise.catch(function() {
					delete this.mCurrentBackendRequestPromises[sGuid];
				}.bind(this));
				this.mCurrentBackendRequestPromises[sGuid] = oPromise;
				return sGuid;
			},
			
			/**
			 * Indicates whether there are pending promises stored
		     * @param {String} sGuidPrefix - an optional prefix for the guid used as filter
		     * @return {boolean} returns <code>true</code> if there is at least one pending promise - <code>false</code> otherwise
			 */
			hasPendingPromises: function(sGuidPrefix) {
				for (var sGuid in this.mCurrentBackendRequestPromises) {
					if (sGuidPrefix === undefined || sGuid.indexOf(sGuidPrefix) === 0) {
						return true;
					}
				}
				return false;
			},
			
			/**
			 * Returns a promise over all currently pending backend request promises
		     * @param {String} sGuidPrefix - an optional prefix for the guid used as filter
			 * @return {Promise} a promise that is fulfilled when all outstanding backend requests have been completed
			 * @public
			 */
			doWhenBackendRequestsAreCompleted: function(sGuidPrefix) {
				var aPromises = [];
				for (var sGuid in this.mCurrentBackendRequestPromises) {
					if (sGuidPrefix === undefined || sGuid.indexOf(sGuidPrefix) === 0) {
						aPromises.push(this.mCurrentBackendRequestPromises[sGuid]);
					}
				}
				return Promise.all(aPromises);
			}
			
	};
	
	return ProcessorManager;
	
	
});
