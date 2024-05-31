/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/base/Log"
], function(Log) {
	"use strict";
	
	/**
	 * Implements a logger that is capable of resolving message parameters only when a certain log entry is really written. An object as message parameter is either resolved by a custom <code>toString</code> function if present, or
	 * generically via JSON.stringify
	 * 
	 * e.g. "This is a {0} sample", ["nice"] => This is a nice sample 
	 */
	var Logger = {
			
		/**
		 * Logs a debug message
		 * @param {String} sMessage - the message with placeholders for the parameters to inject
		 * @param {Array} aParams - an array containing the message parameters
		 * @param {sap.ui.base.ManagedObject} oManagedObject - the owner of the log entry from which the class name is obtained
		 * @return undefined
		 */
		logDebug: function(sMessage, aParams, oManagedObject) {
			if (Log.isLoggable(Log.Level.DEBUG)) {
				Log.debug(this._replaceMessageParameters(sMessage, aParams), null, this._getClassName(oManagedObject));
			}
		},

		/**
		 * Logs an information message
		 * @param {String} sMessage - the message with placeholders for the parameters to inject
		 * @param {Array} aParams - an array containing the message parameters
		 * @param {sap.ui.base.ManagedObject} oManagedObject - the owner of the log entry from which the class name is obtained
		 * @return undefined
		 */
		logInfo: function(sMessage, aParams, oManagedObject) {		
			if (Log.isLoggable(Log.Level.INFO)) {
				Log.info(this._replaceMessageParameters(sMessage, aParams), null, this._getClassName(oManagedObject));
			}
		},
		
		/**
		 * Logs an warning message
		 * @param {String} sMessage - the message with placeholders for the parameters to inject
		 * @param {Array} aParams - an array containing the message parameters
		 * @param {sap.ui.base.ManagedObject} oManagedObject - the owner of the log entry from which the class name is obtained
		 * @return undefined
		 */
		logWarning: function(sMessage, aParams, oManagedObject) {
			if (Log.isLoggable(Log.Level.WARNING)) {
				Log.warning(this._replaceMessageParameters(sMessage, aParams), null, this._getClassName(oManagedObject));
			}
		},
		
		/**
		 * Logs an error message
		 * @param {String} sMessage - the message with placeholders for the parameters to inject
		 * @param {Array} aParams - an array containing the message parameters
		 * @param {sap.ui.base.ManagedObject} oManagedObject - the owner of the log entry from which the class name is obtained
		 * @return undefined
		 */
		logError: function(sMessage, aParams, oManagedObject) {
			if (Log.isLoggable(Log.Level.ERROR)) {
				Log.error(this._replaceMessageParameters(sMessage, aParams), null, this._getClassName(oManagedObject));
			}
		},
		
		/**
		 * Logs the error stack of the given error
		 * @param {Error} oError - the error object
		 * @param {sap.ui.base.ManagedObject} oManagedObject - the owner of the log entry from which the class name is obtained
		 * @return undefined
		 */
		logErrorStack: function(oError, oManagedObject) {
			Log.error(oError.stack, null, this._getClassName(oManagedObject));
		},
		
		/**
		 * Returns the class name of the given Object
		 * @param {sap.ui.base.ManagedObject} oManagedObject - the object
		 * @return {string} - the class name
		 */
		_getClassName: function(oManagedObject) {
			if (oManagedObject && oManagedObject.getMetadata && oManagedObject.getMetadata().getName) {
				return oManagedObject.getMetadata().getName();
			} else {
				// default to root
				return "sap.i2d.lo.lib.zvchclfz";
			}
		},
		
		/**
		 * Replaces the placeholders within the given message with the provided parameters
		 * 
		 * @param {String} sMessage - a message string with placeholders
		 * @param {Array} aParams - an array containing the message parameters
		 * @return {string} - the message with all injected parameters
		 */
		_replaceMessageParameters: function(sMessage, aParams) {
			var pos = 0;
			var s;
			var sBefore, sAfter;
			if (aParams) {
				for (var i=0; i < aParams.length; i++) {
					// consider position when replacing
					pos = sMessage.indexOf("{" + i + "}", pos);
					if (typeof aParams[i] === "object") {
						if (aParams[i].toString !== Object.prototype.toString) {
							// only use a 'custom' toString function as the native one does not expose the object internal structure
							s = aParams[i].toString();
						} else {
							s = JSON.stringify(aParams[i]);
						}
					} else {
						s = aParams[i];
					}
					sBefore = sMessage.substring(0, pos);
					sAfter = sMessage.substr(pos+3);
					sMessage = sBefore + s + sAfter;
					pos += s.length;	  
				}
			}
			return sMessage;
		}
		
	};
	return Logger;
});
