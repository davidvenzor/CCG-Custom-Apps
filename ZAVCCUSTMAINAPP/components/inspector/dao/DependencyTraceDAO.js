/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/common/util/RequestQueue",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/ODataModelHelper",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel",
	"sap/ui/base/ManagedObject",
	"sap/base/Log"
], function (RequestQueue, Constants, ODataModelHelper, InspectorModel, ManagedObject, Log) {
	"use strict";

	var TRACE_ENTRY_NAV_PROP = Constants.navigationProperties.TraceEntry;
	var TRACE_CSTIC_NAV_PROP = Constants.navigationProperties.TraceCharacteristic;

	var DependencyTraceDAO = ManagedObject.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.dao.DependencyTraceDAO", {
		/**
		 * Stores the currently pending trace entry reading request
		 * @type {String}
		 * @private
		 */
		_pendingEntryReadRequestUuid: null,

		/**
		 * Stores the currently pending trace characteristic and dependency VH reading request
		 * @type {String}
		 * @private
		 */
		_pendingValueHelpReadRequestUuid: null,

		/**
		 * Activate the trace
		 * @param {String} sConfigurationContextId - Configuration Context ID
		 * @returns {Promise} Promise object which will provide the details
		 * @public
		 */
		activateTrace: function (sConfigurationContextId) {
			return RequestQueue.add(this._activateTrace.bind(this, sConfigurationContextId), this);
		},

		/**
		 * Activate the trace
		 * @param {String} sConfigurationContextId - Configuration Context ID
		 * @returns {Promise} Promise object which will provide the details
		 * @private
		 */
		_activateTrace: function (sConfigurationContextId) {
			return new Promise(function (fnResolve, fnReject) {
				this._executeCallFunction({
					name: Constants.functionImports.activateTrace.name,
					urlParameters: {
						ContextId: sConfigurationContextId
					},
					success: fnResolve,
					error: this._rejectWithErrorMessageValue.bind(this, fnReject)
				});
			}.bind(this));
		},

		/**
		 * Deactivate the trace
		 * @param {String} sConfigurationContextId - Configuration Context ID
		 * @returns {Promise} Promise object which will provide the details
		 * @public
		 */
		deactivateTrace: function (sConfigurationContextId) {
			return RequestQueue.add(this._deactivateTrace.bind(this, sConfigurationContextId), this);
		},

		/**
		 * Deactivate the trace
		 * @param {String} sConfigurationContextId - Configuration Context ID
		 * @returns {Promise} Promise object which will provide the details
		 * @private
		 */
		_deactivateTrace: function (sConfigurationContextId) {
			return new Promise(function (fnResolve, fnReject) {
				this._executeCallFunction({
					name: Constants.functionImports.deactivateTrace.name,
					urlParameters: {
						ContextId: sConfigurationContextId
					},
					success: fnResolve,
					error: this._rejectWithErrorMessageValue.bind(this, fnReject)
				});
			}.bind(this));
		},

		/**
		 * Check whether the trace is active or not
		 * @param {String} sConfigurationContextId - Configuration Context ID
		 * @returns {Promise} Promise object which will provide the details
		 * @public
		 */
		checkTraceIsActive: function (sConfigurationContextId) {
			return RequestQueue.add(this._checkTraceIsActive.bind(this, sConfigurationContextId), this);
		},

		/**
		 * Check whether the trace is active or not
		 * @param {String} sConfigurationContextId - Configuration Context ID
		 * @returns {Promise} Promise object which will provide the details
		 * @private
		 */
		_checkTraceIsActive: function (sConfigurationContextId) {
			return new Promise(function (fnResolve, fnReject) {
				this._executeCallFunction({
					name: Constants.functionImports.isTraceActive.name,
					urlParameters: {
						ContextId: sConfigurationContextId
					},
					success: function (oResponse) {
						var bIsActive = oResponse[Constants.functionImports.isTraceActive.name] ?
							oResponse[Constants.functionImports.isTraceActive.name].Success : false;

						fnResolve(bIsActive);
					},
					error: this._rejectWithErrorMessageValue.bind(this, fnReject)
				});
			}.bind(this));
		},

		/**
		 * Clear the trace
		 * @param {String} sConfigurationContextId - Configuration Context ID
		 * @returns {Promise} Promise object which will provide the details
		 * @public
		 */
		clearTrace: function (sConfigurationContextId) {
			return RequestQueue.add(this._clearTrace.bind(this, sConfigurationContextId), this);
		},

		/**
		 * Clear the trace
		 * @param {String} sConfigurationContextId - Configuration Context ID
		 * @returns {Promise} Promise object which will provide the details
		 * @private
		 */
		_clearTrace: function (sConfigurationContextId) {
			return new Promise(function (fnResolve, fnReject) {
				this._executeCallFunction({
					name: Constants.functionImports.clearTrace.name,
					urlParameters: {
						ContextId: sConfigurationContextId
					},
					success: fnResolve,
					error: this._rejectWithErrorMessageValue.bind(this, fnReject)
				});
			}.bind(this));
		},

		/**
		 * Loads the new trace entries
		 * @param {String} sPath - Path to the Trace Entries
		 * @param {String} sSearchText - Search text
		 * @param {sap.ui.model.Filter[]} aFilters - Array of filter properties
		 * @param {int} [iSkip] - Skip parameter of the OData request
		 * @param {int} [iTop] - Top parameter of the OData request
		 * @returns {Promise} Promise object which will provide the details
		 * @public
		 */
		loadEntries: function (sPath, sSearchText, aFilters, iSkip, iTop) {
			// Abort previous pending entry reading request
			// Here we use it for those cases if there is already an executed pending request in the queue
			if (this._pendingEntryReadRequestUuid) {
				RequestQueue.remove(this._pendingEntryReadRequestUuid);
				this._pendingEntryReadRequestUuid = null;
			}

			var oPromise = RequestQueue.add(
				this._loadEntries.bind(this, sPath, sSearchText, aFilters, iSkip, iTop), this);

			this._pendingEntryReadRequestUuid = oPromise.requestUuid;

			return oPromise;
		},

		/**
		 * Loads the new trace entries
		 * @param {String} sPath - Path to the Trace Entries
		 * @param {String} sSearchText - Search text
		 * @param {sap.ui.model.Filter[]} [aFilters] - Array of filter properties
		 * @param {int} [iSkip] - Skip parameter of the OData request
		 * @param {int} [iTop] - Top parameter of the OData request
		 * @returns {Promise} Promise object which will provide the details
		 * @private
		 */
		_loadEntries: function (sPath, sSearchText, aFilters, iSkip, iTop) {
			return new Promise(function (fnResolve, fnReject) {
				var oUrlParameters = {};

				if (iSkip > 0) {
					oUrlParameters.$skip = iSkip;
				}

				if (iTop > 0) {
					oUrlParameters.$top = iTop;
				}

				if (sSearchText) {
					oUrlParameters.search = sSearchText;
				}

				ODataModelHelper.getModel()
					.facadeRead(sPath, oUrlParameters, undefined, aFilters)
					.then(fnResolve)
					.catch(this._rejectWithErrorMessageValue.bind(this, fnReject))
					.then(function () {
						this._pendingEntryReadRequestUuid = null;
					}.bind(this));

			}.bind(this));
		},

		/**
		 * Loads the details of a trace entry
		 * @param {String} sTraceEntryPath - Trace Entry Path
		 * @returns {Promise} Promise object which will provide the details
		 * @public
		 */
		loadTraceEntryDetails: function (sTraceEntryPath) {
			return RequestQueue.add(this._loadTraceEntryDetails.bind(this, sTraceEntryPath), this);
		},

		/**
		 * Loads the details of a trace entry
		 * @param {String} sTraceEntryPath - Trace Entry Path
		 * @returns {Promise} Promise object which will provide the details
		 * @private
		 */
		_loadTraceEntryDetails: function (sTraceEntryPath) {
			return new Promise(function (fnResolve, fnReject) {
				ODataModelHelper.getModel()
					.facadeRead(sTraceEntryPath, {
						"$expand": TRACE_ENTRY_NAV_PROP.TraceBeforeCharacteristics + "," +
							TRACE_ENTRY_NAV_PROP.TraceBeforeCharacteristics + "/" +
							TRACE_CSTIC_NAV_PROP.TraceCharacteristicValues + "," +
							TRACE_ENTRY_NAV_PROP.TraceResultCharacteristics + "," +
							TRACE_ENTRY_NAV_PROP.TraceResultCharacteristics + "/" +
							TRACE_CSTIC_NAV_PROP.TraceCharacteristicValues + "," +
							TRACE_ENTRY_NAV_PROP.VariantTables + "," +
							TRACE_ENTRY_NAV_PROP.InputTraceObjectDependencies + "," +
							TRACE_ENTRY_NAV_PROP.ObjectDependencyCodes + "," +
							TRACE_ENTRY_NAV_PROP.TracePricingFactor + "," +
							TRACE_ENTRY_NAV_PROP.ResultCharacteristicResults + "," +
							TRACE_ENTRY_NAV_PROP.BeforeCharacteristicResults + "," +
							TRACE_ENTRY_NAV_PROP.ResultDependencyResults + "," +
							TRACE_ENTRY_NAV_PROP.BeforeDependencyResults + "," +
							TRACE_ENTRY_NAV_PROP.TraceBAdI
					})
					.then(fnResolve)
					.catch(this._rejectWithErrorMessageValue.bind(this, fnReject));
			}.bind(this));
		},

		/**
		 * Loads all the dependency source codes of a trace entry
		 * @param {String} sTraceEntryPath - Trace Entry Path
		 * @returns {Promise} Promise object which will provide the details
		 * @public
		 */
		loadAllDependencyCodesForEntry: function (sTraceEntryPath) {
			return RequestQueue.add(this._loadAllDependencyCodesForEntry.bind(this, sTraceEntryPath), this);
		},

		/**
		 * Loads the details of a trace entry
		 * @param {String} sTraceEntryPath - Trace Entry Path
		 * @returns {Promise} Promise object with all the dependency source codes
		 * @private
		 */
		_loadAllDependencyCodesForEntry: function (sTraceEntryPath) {
			return new Promise(function (fnResolve, fnReject) {
				ODataModelHelper.getModel()
					.facadeRead(
						sTraceEntryPath + "/" + TRACE_ENTRY_NAV_PROP.ObjectDependencyCodes)
					.then(fnResolve)
					.catch(this._rejectWithErrorMessageValue.bind(this, fnReject));
			}.bind(this));
		},

		/**
		 * Load TraceCharacteristicVH or TraceObjectDependencyVH Entries
		 * @param {String} sPath - Path
		 * @param {String} [sSearchText] - Search Text
		 * @param {int} [iTop] - Top parameter of the OData request
		 * @param {sap.ui.model.Filter[]} [aFilters] - Array of filter properties
		 * @returns {Promise} Promise object which will provide the value help entries
		 * @public
		 */
		loadTraceValueHelpEntries: function (sPath, sSearchText, iTop, aFilters) {
			// Abort previous pending entry reading request
			// Here we use it for those cases if there is already an executed pending request in the queue
			if (this._pendingValueHelpReadRequestUuid) {
				RequestQueue.remove(this._pendingValueHelpReadRequestUuid);
				this._pendingValueHelpReadRequestUuid = null;
			}

			var oPromise = RequestQueue.add(
				this._loadTraceValueHelpEntries.bind(this, sPath, sSearchText, iTop, aFilters), this);

			this._pendingValueHelpReadRequestUuid = oPromise.requestUuid;

			return oPromise;
		},

		/**
		 * Load TraceCharacteristicVH or TraceObjectDependencyVH Entries
		 * @param {String} sPath - Path
		 * @param {String} [sSearchText] - Search Text
		 * @param {int} [iTop] - Top parameter of the OData request
		 * @param {sap.ui.model.Filter[]} [aFilters] - Array of filter properties
		 * @returns {Promise} Promise object which will provide the value help entries
		 * @private
		 */
		_loadTraceValueHelpEntries: function (sPath, sSearchText, iTop, aFilters) {
			return new Promise(function (fnResolve, fnReject) {
				var oUrlParameters = {};

				if (iTop > 0) {
					oUrlParameters.$top = iTop;
				}

				if (sSearchText) {
					oUrlParameters.search = sSearchText;
				}

				ODataModelHelper.getModel()
					.facadeRead(sPath, oUrlParameters, null, aFilters)
					.then(function (oData) {
						this._pendingValueHelpReadRequestUuid = null;
						fnResolve(oData.results);
					}.bind(this))
					.catch(function (oError) {
						this._rejectWithErrorMessageValue(fnReject, oError);
						this._pendingValueHelpReadRequestUuid = null;
					}.bind(this));

			}.bind(this));
		},

		/**
		 * Executes a request of function import to the backend
		 * @param {Object} oSettings - Settings of the request
		 * @param {String} oSettings.name - Name of the function import
		 * @param {Object} oSettings.urlParameters - URL parameters for the function import
		 * @param {Function} oSettings.success - Function of success handling
		 * @param {Function} oSettings.error - Function of error handling
		 * @private
		 */
		_executeCallFunction: function (oSettings) {
			ODataModelHelper.getModel()
				.facadeCallFunction(
					"/" + oSettings.name,
					oSettings.urlParameters ? oSettings.urlParameters : {})
				.then(function (oData) {
					if (oSettings.success &&
						$.isFunction(oSettings.success)) {
						oSettings.success(oData);
					}
				})
				.catch(function (oError) {
					if (oSettings.error &&
						$.isFunction(oSettings.error)) {
						oSettings.error(oError);
					}
				});
		},

		/**
		 * Calls the reject function of a Promise with the converted error message of backend
		 * @param {Function} fnReject - Reject function of Promise
		 * @param {Object} oError - Error object which came in a backend response
		 * @private
		 */
		_rejectWithErrorMessageValue: function (fnReject, oError) {
			Log.error(oError ? oError.stack : "An unknown error occurred.");
			var oMessage = {};

			if (oError.statusCode === 0 || oError.statusText === "abort") {
				oMessage.isAborted = true;
			} else {
				var oErrorDetails = JSON.parse(oError.responseText).error;

				if (oErrorDetails.innererror && $.isArray(oErrorDetails.innererror.errordetails)) {
					$.each(oErrorDetails.innererror.errordetails, function (iIndex, oElement) {
						if (oElement.code === Constants.errorCode.TraceSwitchedOff) {
							InspectorModel.setProperty("/isTraceOn", false);

							return false;
						}

						return true;
					});
				}

				oMessage.message = oErrorDetails.message.value;
			}

			fnReject(oMessage);
		}
	});

	return new DependencyTraceDAO();
});
