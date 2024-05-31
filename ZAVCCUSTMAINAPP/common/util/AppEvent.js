/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/base/ManagedObject"
], function (UI5Object) {
	"use strict";
	
	var oHandlerBuffer = {};

	/**
	 * Represents an application wide event class
	 * 
	 * @class
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.zvchclfz.common.util.AppEvent
	 * @extends sap.ui.base.ManagedObject
	 */
	return UI5Object.extend("sap.i2d.lo.lib.zvchclfz.common.util.AppEvent", {

		metadata: {
			properties: {
				name: {
					type: "string"
				},
				channelId: {
					type: "string"
				}
			}
		},

		/**
		 * Add given handler to buffer
		 * @param {Function} fnHandler: event handler
		 * @return {object} handler buffer object
		 * @private
		 */
		_addHandlerToBuffer: function (aKeys, fnHandler, oBuffer) {
			 oBuffer = oBuffer || oHandlerBuffer;
			 if (aKeys.length === 1) {
				 if (!!oBuffer[aKeys[0]]){
					 oBuffer[aKeys[0]].push(fnHandler);
				 } else {
					 oBuffer[aKeys[0]] = [fnHandler];
				 }
			 } else {
				 var sKey = aKeys.shift();
				 oBuffer[sKey] = this._addHandlerToBuffer(aKeys, fnHandler, oBuffer[sKey] || {});
			 }

			 return oBuffer;
		},
		
		/**
		 * Removes given handler from buffer
		 * @param {Function} fnHandler: event handler
		 * @private
		 */
		_removeHandler: function(fnHandler) {
			var aHandler = [];
			var sEventName = this.getName();
			var sChanelId = this.getChannelId();
			if (sChanelId && sEventName) {
				aHandler =  oHandlerBuffer[sChanelId][sEventName];
			}
			else if (sEventName) {
				aHandler = oHandlerBuffer[sEventName];
			} 
			aHandler.splice(aHandler.indexOf(fnHandler), 1);
		},
		
		/**
		 * Check if any handler for the event is existing
		 * @param {Function} fnFunction - function to be called when the event is raised
		 * @return {boolean} true or false
		 * @public
		 */
		hasHandler: function () {
			var sEventName = this.getName();
			var sChanelId = this.getChannelId();
			if (sChanelId) {
				return oHandlerBuffer[sChanelId] && oHandlerBuffer[sChanelId][sEventName] && oHandlerBuffer[sChanelId][sEventName].length > 0;
			} else {				
				return oHandlerBuffer[sEventName] && oHandlerBuffer[sEventName].length > 0;
			}
		},		
		
		/**
		 * Subscribe to the given event - Note that the event handler function is called with the following parameters: {string} sChannelId, {string} sEventId, {object} mData
		 * @param {Function} fnFunction - function to be called when the event is raised
		 * @param {Object} oListener - scope in which the function is called
		 */
		subscribe: function (fnFunction, oListener) {
			var sEventName = this.getName();
			var sChanelId = this.getChannelId();
			sap.ui.getCore().getEventBus().subscribe(sChanelId, sEventName, fnFunction, oListener); 
			
			var aKeys = [sEventName];
			if (sChanelId) {
				aKeys.splice(0, 0, sChanelId);
			}
			this._addHandlerToBuffer(aKeys, fnFunction);
		},
		
		/**
		 * Unsubscribes from the given event
		 * @param {Function} fnFunction - function to be called when the event is raised
		 * @param {Object} oListener - scope in which the function is called
		 */
		unsubscribe: function (fnFunction, oListener) {
			sap.ui.getCore().getEventBus().unsubscribe(this.getChannelId(), this.getName(), fnFunction, oListener);
			this._removeHandler(fnFunction);
		},
		
		/**
		 * Publishes the given event to all subscribers
		 * @param {Object} oData - an optional data object that is carried with the event
		 */
		publish: function (oData) {
			var sEventName = this.getName();
			var sChanelId = this.getChannelId();
			if (!this.hasHandler()) {
				throw Error("The event with id: '" + sEventName + "' and Channel: '" + sChanelId + "' has no handler!");
			}
			sap.ui.getCore().getEventBus().publish(sChanelId, sEventName, oData); 
		}
		
	});
		
});
