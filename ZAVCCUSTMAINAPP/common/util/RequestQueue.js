/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([
	"jquery.sap.global",
	"sap/ui/base/ManagedObject"
], function(jQuery, ManagedObject) {
	"use strict";

	var QUEUE_TIMEOUT = 0;
	
	/**
	 * The request queue is responsible for serialization the OData batch requests  
	 * This prevents sending two parallel batch request which could lead to data inconsistency.
	 * 
	 * @return {Object} reference to the instance itself
	 * @static
	 * @public
	 */
	return {

		_aQueue: [],
		_iObserverTimeout: null,

		/**
		 * Adds the given request function to the queue and starts an observer with an delayed call of 0ms.
		 * 
		 * @param {function} fnRequest is a request function to be called. The request function must return a promise.
		 * @param {object} oContext the context in which the request function should be called. When the object is an instance of
		 *							ManagedObject, then everytime the request function is called, the destroy status of the object
		 *							is checked.
		 * @returns {Promise} returns a promise object of the added request function
		 * @function
		 * @public
		 */
		add: function(fnRequest, oContext) {
			var sUuid = this._createRequestUuid();
			var oPromise = new Promise(function(fnResolve, fnReject) {
				this._aQueue.push({
					resolve: fnResolve,
					reject: fnReject,
					request: fnRequest,
					context: oContext,
					uuid: sUuid
				});
			}.bind(this));
			oPromise.requestUuid = sUuid;
			this._observe();
			return oPromise;
		},
		
		/**
		 * Removes the request with given uuid from the queue
		 * @param {string} uuid of the request
		 * @returns {boolean} <code>true</code> if the request has been removed; <code>false</code> if the request has already been submitted
		 * and is no longer in the queue
		 */
		remove: function(sRequestUuid) {
			for (var i=0; i < this._aQueue.length; i++) {
				if (this._aQueue[i].uuid === sRequestUuid) {
					// removes the request
					this._aQueue.splice(i,1);
					return true;
				}
			}
			return false;
		},

		/**
		 * Gets the request queue length
		 * 
		 * @returns {number} the length of the request queue
		 * @function
		 * @public
		 */
		getLength: function() {
			return this._aQueue.length;
		},

		/**
		 * Checks if the request queue is empty 
		 * 
		 * @returns {boolean} true = the request queue is filled, false = the request queue is empty
		 * @function
		 * @public
		 */
		isEmpty: function() {
			return !this.getLength();
		},

		/**
		 * Clears the queue and the observer timeout
		 * 
		 * @function
		 * @public
		 */
		clear: function() {
			this._aQueue = [];
			this._clearObserverTimeout();
		},

		/**
		 * Observes adding request with an delayed call of 0ms.
		 * Once the delayed call is executed, the queue is going to be flushed and all sync added request functions are going to be called.
		 * If the request queue is not empty the observer is restarted.
		 *  
		 * @function
		 * @private
		 */
		_observe: function() {
			if (!this._iObserverTimeout) {
				var fnFinally = function() {
					this._clearObserverTimeout();
					if (!this.isEmpty()) {
						this._observe();
					}
				};
				this._iObserverTimeout = jQuery.sap.delayedCall(QUEUE_TIMEOUT, this, function() {
					this._flush()
						.then(fnFinally.bind(this))
						.catch(fnFinally.bind(this));
				});
			}
		},

		/**
		 * Executes request functions one by one.
		 * After a request function was called the request function is removed from the queue immediately without waiting for a repsonse
		 * 
		 * 
		 * @returns {Promise} returns a promise all instance once all request function promises are fulfilled
		 * @function
		 * @private
		 */
		_flush: function() {
			var aRequestPromises = [];
			var fnFinally = function(fnPromiseFunction, oContext) {
				return function() {
					if (!this._isObjectDestroyed(oContext)) {
						fnPromiseFunction.apply(oContext, arguments);
					}
				}.bind(this);
			}.bind(this);
			var mRequest = this._aQueue.shift();
			while (mRequest) {
				var oContext = mRequest.context;
				if (!this._isObjectDestroyed(oContext)) {
					aRequestPromises.push(mRequest.request.apply(oContext)
						.then(fnFinally(mRequest.resolve, oContext))
						.catch(fnFinally(mRequest.reject, oContext))
					);
				}
				mRequest = this._aQueue.shift();
			}
			return Promise.all(aRequestPromises);
		},
		
		/**
		 * Checks if the given object is destroyed
		 * 
		 * @function
		 * @private
		 */
		_isObjectDestroyed : function(oObject) {
			return (oObject && oObject instanceof ManagedObject && oObject.bIsDestroyed);
		},

		/**
		 * Clears delayed call set by function _observe
		 * 
		 * @function
		 * @private
		 */
		_clearObserverTimeout: function() {
			jQuery.sap.clearDelayedCall(this._iObserverTimeout);
			this._iObserverTimeout = null;
		},
		
		/**
		 * Creates an uuid
		 */
		_createRequestUuid: function() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
		}
	};
});
