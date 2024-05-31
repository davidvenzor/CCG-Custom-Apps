/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([
	"sap/ui/model/Model",
	"sap/ui/model/Context",
	"sap/ui/base/EventProvider",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/json/JSONPropertyBinding",
	"sap/ui/model/ClientModel",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/i2d/lo/lib/zvchclfz/common/util/ErrorDialog"
], function (Model, Context, EventProvider, JSONModel, JSONPropertyBinding, ClientModel, ODataV2Model, ErrorDialog) {
	"use strict";

	/**
	 * OData Facade for different protocol versions - implements a neutral model
	 *
	 * @class
	 *
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.vchclf.common.odataFacade.ODataFacadeModel
	 * @extends sap.ui.model.json.JSONModel
	 */
	return JSONModel.extend("sap.i2d.lo.lib.zvchclfz.common.odataFacade.ODataFacadeModel", {
		/** @lends sap.ui.model.json.JSONModel.prototype */

		constructor: function (oModel, aPaths, fnViewProvider) {
			this._oOriginModel = oModel;
			if (oModel) {
				this._oOriginModel.attachMessageChange(null, this._onMessageChangeInOriginModel, this);
			}
			this._oErrorDialog = new ErrorDialog();
			this._fnViewProvider = fnViewProvider;
			Model.prototype.constructor.apply(this);
			this._oInitMetadataPromise = this._initMetaModel(aPaths);
			this._generateEventMethods();
			this._setupEvents();
		},
		
		destroy: function ()  {
			this._cleanupEvents();
			JSONModel.prototype.destroy.apply(this, arguments);
		},

		/* ------------------------------- to be implemented in sub-classes protected ------------------------------- */

		/**
		 * Defines which events are propagated to the origin model
		 * @return {array} - an string array of event ids
		 */
		_getPropagatedEventIds: function () {
			return [];
		},

		/**
		 * Hook method to setup events in the sub-class
		 * @return {undefined}
		 */
		_setupEvents: function () {

		},
		
		/**
		 * Hook method to clean-up events in the sub-class
		 * @return {undefined}
		 */
		_cleanupEvents: function () {

		},

		/**
		 * Initializes the meta model - to be implemented by subclasses
		 * @param {array} aPaths - an array of EntitySets each starting with a leading slash
		 * 							 for which metadata should be read (necessary for getKey and createKey)
		 * @return {Promise} - a promise which is resolved when meta model is initialized
		 */
		_initMetaModel: function (aPaths) {
			return Promise.resolve();
		},

		/**
		 * Returns the protocol version as string
		 * @return {string} - the version as string
		 */
		_getVersion: function () {
			throw Error("This abstract method has not yet been implemented in the child object.");
		},


		/**
		 * Returns the value for the given navigation property
		 *
		 * @param {object} oData - the expanded data as returned from the service
		 * @param {string} sNavPropName - name of the navigation property
		 * @param {string} sMultiplicity - cardinality of the navigation property (* or 1)
		 * @return {array|object} - in case of cardinality 1 an object is returned;
		 * 						    in case of cardinality N an array is returned
		 */
		_getNavigationPropertyValue: function (oData, sNavPropName, sMultiplicity) {
			throw Error("This abstract method has not yet been implemented in the child object.");
		},

		/**
		 * Determines the name of the set the navigation property is referring to
		 *
		 * @param {string} sSetName - name of the set to which the navigation property belongs
		 * @param {string} sNavPropName - name of the navigation property
		 * @return {string} - the entityset name as string
		 */
		_determineSetNameOfNavigationProperty: function (sSetName, sNavPropName) {
			throw Error("This abstract method has not yet been implemented in the child object.");
		},

		/**
		 * Determines the multiplicity (1 or N) of the navigation property
		 *
		 * @param {string} sSetName - name of the set to which the navigation property belongs
		 * @param {string} sNavPropName - name of the navigation property
		 * @return {string} - the multiplicity (1 or N) as string
		 */
		_determineMultiplicityOfNavigationProperty: function (sSetName, sNavPropName) {
			throw Error("This abstract method has not yet been implemented in the child object.");
		},

		/**
		 * Determines all navigation properties for the given data object
		 * @param {object} oData - the data object as returned from the service
		 * @return {map} - a map with the navigation property name as key and the multiplicity as value
		 */
		_determineNavPropsMap: function (oData) {
			throw Error("This abstract method has not yet been implemented in the child object.");
		},

		/* ------------------------------- to be implemented in sub-classes public ------------------------------- */

		/**
		 * Trigger a DELETE request to the OData service that was specified in the model constructor.
		 * The data will be stored in the model. Returns a promise that resolves with the returned data or
		 * is rejected in an error case containing an error object.
		 *
		 * @param {string} sKey - A string containing the path to the data which should be retrieved.
		 * 						  The path is concatenated to the service URL
		 * 						  which was specified in the model constructor.
		 * @param {map} mUrlParameters - A map containing the parameters that will be passed as query strings
		 * @param {sap.ui.model.Context} oContext - an optional context
		 * @param {sap.ui.model.Filter[]} aFilters - An array of filters to be included in the request URL
		 * @param {Function} fnSuccess - optional function to be called in success case
		 * @param {Function} fnError - optional function to be called in error case
		 * @param {string} sGroupId - optional id for batch group
		 * @param {boolean} bSuppressListeners - whether to inform the bindings or not
		 * @return {Promise} - a promise which is resolved after
		 * 					     the server has been invoked and the response is processed
		 * 						- in case of success
		 * 								the resolve function gets as parameter the returned data
		 * 						- in case of an error:
		 * 								 the error function gets as parameter the error object
		 */
		facadeRemove: function (sKey, mUrlParameters, oContext, fnSuccess, fnError,
			sGroupId, bRefreshAfterChange, bSuppressListeners) {
			//TODO move the input parameters to an object
			throw Error("This abstract method has not yet been implemented in the child object.");
		},
		
		/**
		 * Trigger a GET request to the OData service that was specified in the model constructor.
		 * The data will be stored in the model. Returns a promise that resolves with the returned data or
		 * is rejected in an error case containing an error object.
		 *
		 * @param {string} sKey - A string containing the path to the data which should be retrieved.
		 * 						  The path is concatenated to the service URL
		 * 						  which was specified in the model constructor.
		 * @param {map} mUrlParameters - A map containing the parameters that will be passed as query strings
		 * @param {sap.ui.model.Context} oContext - an optional context
		 * @param {sap.ui.model.Filter[]} aFilters - An array of filters to be included in the request URL
		 * @param {Function} fnSuccess - optional function to be called in success case
		 * @param {Function} fnError - optional function to be called in error case
		 * @param {string} sGroupId - optional id for batch group
		 * @param {string} bRefreshAfterChange - Since 1.46; defines whether to update all bindings after submitting this change operation. 
		 * 											See #setRefreshAfterChange If given, 
		 * 											this overrules the model-wide refreshAfterChange flag for this operation only.
		 * @param {boolean} bSuppressListeners - whether to inform the bindings or not
		 * @return {Promise} - a promise which is resolved after
		 * 					     the server has been invoked and the response is processed
		 * 						- in case of success
		 * 								the resolve function gets as parameter the returned data
		 * 						- in case of an error:
		 * 								 the error function gets as parameter the error object
		 */
		facadeRead: function (sKey, mUrlParameters, oContext, aFilters, fnSuccess, fnError,
			sGroupId, bSuppressListeners) {
			//TODO move the input parameters to an object
			throw Error("This abstract method has not yet been implemented in the child object.");
		},

		/**
		 * Trigger a UPDATE request to the OData service that was specified in the model constructor.
		 * The data will be stored in the model. Returns a promise that resolves with the returned data or
		 * is rejected in an error case containing an error object.
		 *
		 * @param {string} sKey - A string containing the path to the data which should be retrieved.
		 * 						  The path is concatenated to the service URL
		 * 						  which was specified in the model constructor.
		 * @param {object} oData - Data of the entry that should be updated.
		 * @param {string} changeSetId - an optional id of a changeSet this request should belong to
		 * @param {map} mUrlParameters - A map containing the parameters that will be passed as query strings
		 * @param {sap.ui.model.Context} oContext - an optional context
		 * @param {Function} fnSuccess - optional function to be called in success case
		 * @param {Function} fnError - optional function to be called in error case
		 * @param {string} sGroupId - optional id for batch group
		 * @param {string} bRefreshAfterChange - Since 1.46; defines whether to update all bindings after submitting this change operation. 
		 * 											See #setRefreshAfterChange If given, 
		 * 											this overrules the model-wide refreshAfterChange flag for this operation only.
		 * @param {boolean} bSuppressListeners - whether to inform the bindings or not
		 * @return {Promise} - a promise which is resolved after
		 * 					     the server has been invoked and the response is processed
		 * 						- in case of success
		 * 								the resolve function gets as parameter the returned data
		 * 						- in case of an error:
		 * 								 the error function gets as parameter the error object
		 */
		facadeUpdate: function (sKey, oData, sChangeSetId, mUrlParameters, oContext, fnSuccess, fnError, 
			sGroupId, sETag, oHeaders, bRefreshAfterChange, bSuppressListeners) {
			//TODO move the input parameters to an object
			throw Error("This abstract method has not yet been implemented in the child object.");
		},

		/**
		 * Trigger a POST request to the function import / action of the OData service
		 * that was specified in the model constructor.
		 *
		 * @param {string} sFunction - A string containing the name of the function to call.
		 * 							 	The name is concatenated to the service URL
		 * 								which was specified in the model constructor.
		 * @param {map} mUrlParameters - A map containing the parameters that will be passed
		 * 								note: these parameters are not necessarily passes as URL parameters
		 * @param {string} changeSetId - an optional id of a changeSet this request should belong to
		 * @param {string} sGroupId - optional id for batch group
		 * @param {string} sHTTPmethod - preferred HTTP method - default is POST
		 * @return {Promise} - a promise which is resolved after
		 * 					     the server has been invoked and the response is processed
		 * 						- in case of success
		 * 								the resolve function gets as parameter the returned data
		 * 						- in case of an error:
		 * 								 the error function gets as parameter the error object
		 */
		facadeCallFunction: function (sFunction, mUrlParameters, changeSetId, sGroupId, sHTTPmethod) {
			//TODO move the input parameters to an object
			throw Error("This abstract method has not yet been implemented in the child object.");
		},

		/**
		 * Trigger a POST request to the OData service that was specified in the model constructor.
		 * Please note that deep creates are not supported and may not work.
		 * Returns a promise that resolves with data of the created entity; in reject case an error object is provided.
		 *
		 * @param {string} sKey - A string containing the path to the collection where an entry should be created.
		 * 						  The path is concatenated to the service URL
		 * 						  which was specified in the model constructor.
		 * @param {map} mContextData - Data of the entry that should be created.
		 * @param {string} sChangeSetId - ID of the ChangeSet that this request should belong to
		 * @return {Promise} - a promise which is resolved after
		 * 					     the server has been invoked and the response is processed
		 * 						- in case of success
		 * 								the resolve function gets as parameter the returned data
		 * 						- in case of an error:
		 * 								 the error function gets as parameter the error object
		 */
		facadeCreate: function (sKey, mContextData, sChangeSetId) {
			throw Error("This abstract method has not yet been implemented in the child object.");
		},

		/**
		 * Creates the key from the given collection name and property map.
		 * Please make sure that the metadata document is loaded before using this function.
		 *
		 * @param {string} sSet - Name of the collection
		 * @param {object} oKey - Object containing at least all the key properties of the entity type
		 * @return {string} - the key of the entity as string
		 */
		createKey: function (sSet, oKey) {
			throw Error("This abstract method has not yet been implemented in the child object.");
		},

		/**
		 * Returns the key part of the given data object.
		 *
		 * @param {object} oValue - the data object
		 * @return {string} - the key of the entity as string
		 */
		getKey: function (oValue) {
			throw Error("This abstract method has not yet been implemented in the child object.");
		},

		/**
		 * Sets the given group to be deferred -
		 * means that all requests belonging to the group are stored for manual submit
		 * @param {string} sGroupId - the id for the deferred group
		 * @return {undefined}
		 */
		setDeferredGroup: function (sGroupId) {
			throw Error("This abstract method has not yet been implemented in the child object.");
		},

		/**
		 * Submits the given batch group
		 * @param {string} sGroupId - the id for the deferred group
		 * @return {undefined}
		 */
		submitBatch: function (sGroupId) {
			throw Error("This abstract method has not yet been implemented in the child object.");
		},

		/**
		 * Get all messages for an entity path.
		 *
		 * @param {string} sEntity - The entity path or key
		 * @param {boolean} bExcludePersistent - If set true persistent flagged messages are excluded.
		 * @return {array} - array of messages
		 */
		getMessagesByEntity: function (sEntity, bExcludePersistent) {
			return ODataV2Model.prototype.getMessagesByEntity
				.apply(this, [sEntity, bExcludePersistent]);
		},

		/* ------------------------------- public ------------------------------- */

		/**
		 * Determines all navigation properties for the given data object
		 * @param {object} oData - the data object as returned from the service
		 * @return {map} - a map with the navigation property name as key and the multiplicity as value
		 * @public
		 */
		getNavigationProperties: function (oData){
			return this._determineNavPropsMap(oData);
		},

		/**
		 * Returns a promise that is resolved when the requested metadata has been loaded
		 * @return {Promise} - a promise that is resolved after the metadata has been loaded
		 */
		metadataLoaded: function () {
			return this._oInitMetadataPromise;
		},
		
		/**
		 * Removes the given context including all related data from the model
		 * @param {sap.ui.model.Context} oContext - the context
		 */
		removeContextAndRelatedData: function(oContext) {
			var sContextPath = oContext.getPath();
			if (this.mContexts[sContextPath]) {
				delete this.mContexts[sContextPath];
				this._removeData(sContextPath);
			}
		},

		/**
		 * Creates a copy of the given context that refers to the origin model
		 * @param {sap.ui.model.Context} oContext - the source context
		 * @return {sap.ui.model.Context} - the newly created context
		 */
		createBindingContextForOriginModel: function (oContext) {
			return new Context(this.getOriginModel(), oContext.getPath());
		},

		/**
		 * Triggers the <code>facadeRead</code> functionality with parameters specific for the protocol version
		 *
		 * @param {map} mReadParams - map with version number as key and as value the array of parameters
		 * 							  for the <code>facadeRead</code> function
		 * @return {object} - an object that allows to append logic for
		 * 						 v2 (caseV2), v4 (caseV4) and the error case (caseCatch)
		 */
		facadeReadSpecific: function (mReadParams) {
			return this._executeForSpecificVersion(
				this.facadeRead, "facadeRead", mReadParams);
		},

		/**
		 * Triggers the <code>facadeCallFunction</code> functionality with parameters specific for the protocol version
		 *
		 * @param {map} mCallFunctionParams - map with version number as key and as value the array of parameters
		 * 							  for the <code>facadeCallFunction</code> function
		 * @return {object} - an object that allows to append logic for
		 * 					  v2 (caseV2), v4 (caseV4) and the error case (caseCatch)
		 */
		facadeCallFunctionSpecific: function (mCallFunctionParams) {
			return this._executeForSpecificVersion(
				this.facadeCallFunction, "facadeCallFunction", mCallFunctionParams);
		},

		/**
		 * Triggers the <code>facadeCreate</code> functionality with parameters specific for the protocol version
		 *
		 * @param {map} mCreateParams - map with version number as key and as value the array of parameters
		 * 								 for the <code>facadeCreate</code> function
		 * @return {object} - an object that allows to append logic
		 * 					  for v2 (caseV2), v4 (caseV4) and the error case (caseCatch)
		 */
		facadeCreateSpecific: function (mCreateParams) {
			return this._executeForSpecificVersion(
				this.facadeCreate, "facadeCreate", mCreateParams);
		},

		/**
		 * Fills the facade model with pre-loaded data of the origin model
		 * @param {object} oData - the data to store
		 * @param {string} sPath - path under which the data should be stored
		 * @param {object} oContext - an optional context
		 * @return {undefined}
		 */
		storePreloadedData: function (oData, sPath, oContext) {
			var oPathInfo = this._determinePathInfo(sPath, oContext);

			this._store({
				root: oData
			}, oPathInfo);
		},
		
		/**
		 * Opens an error dialog and displays the given messages -
		 * Note: this method can be called multiple times - in that case the messages are appended to
		 * the already opened dialog
		 * @param  {array} aMessages - an array of messages
		 * @param  {function} fnCallBack - to be called back after displaying the messages (when closing the dialog)
		 */
		displayErrorMessages: function (aMessages, fnCallBack) {
			this._oErrorDialog.displayErrorMessages(this._fnViewProvider.apply(this), aMessages, fnCallBack);
		},

		/* ------------------------------- override ------------------------------- */

		/**
		 * @override
		 */
		createBindingContext: function (sPath, oContext, mParameters, fnCallBack, bReload, bFetchFromServer) { //bReload
			var fnFetchCtxData = function (oNewCtx) {

				var oCtxData = this.getProperty(oNewCtx.getPath());

				if (oCtxData === undefined && bFetchFromServer) {

					this.facadeRead(
							oNewCtx.getPath(), //sKey
							undefined, //mUrlParameters
							undefined, //oContext
							undefined, //aFilters
							undefined, //fnSuccess
							undefined, //fnError
							undefined, //sGroupId
							true) //bSuppressListeners
						.then(function (oData) {
							if (fnCallBack) {
								fnCallBack(oNewCtx);
							}
						});
				} else if (fnCallBack && $.isFunction(fnCallBack)) {

					fnCallBack(oNewCtx);
				}
			}.bind(this);

			return ClientModel.prototype.createBindingContext
				.apply(
					this,
					[sPath, oContext, mParameters, fnFetchCtxData]);
		},

		/**
		 * @override - replace the protected method which is called by the Bindings and by this class
		 */
		_getObject: function (sPath, oContext, sExpand, bAsCopy) {
			// relative but no context provided!
			if (sPath !== undefined && sPath.charAt(0) !== "/" && oContext === undefined) {
				return undefined;
			} else {
				var oPathInfo = this._resolveToModelPath(sPath, oContext);
				var oResult;

				if (oPathInfo.mustExpand || sExpand) {
					oResult = this._expandData(
						oPathInfo.contextPath, sExpand === "*" ? undefined : sExpand);
					oResult = this._getFromExpandedData(oResult, oPathInfo);

					if (sExpand === undefined) {
						// if expand flag is not explicitly set from the outside,
						//the results of requested navigation property must be converted back to references
						if (oResult && oResult.results) {
							var aArray = [];

							for (var i = 0; i < oResult.results.length; i++) {
								aArray.push(
									this.getKey(
										oResult.results[i]));
							}

							oResult = aArray;
						}
					}
				} else {
					var oData = JSONModel.prototype._getObject.apply(this, [oPathInfo.fullPath]);

					if (typeof oData === "object") {
						if (bAsCopy) {
							if (oData instanceof Date) {
								var iTimeInMillis = oData.valueOf();
								oResult = new Date(iTimeInMillis);
							} else {
								// jQuery does not handle dates
								oResult = $.extend(true, {}, oData);
							}
						} else {
							oResult = oData;
						}
					} else {
						oResult = oData;
					}
				}

				if (oResult !== undefined) {
					if (oResult.__list !== undefined) {
						oResult = oResult.__list;
					} else if (oResult.__ref !== undefined) {
						oResult = oResult.__ref;
					} else if (oResult.__deferred !== undefined) {
						oResult = undefined;
					}
				}

				return oResult;
			}
		},

		/**
		 * @override
		 */
		getObject: function (sPath, oContext, mParameters) {
			if (mParameters && mParameters.select) {
				throw Error("getObject with mParameters.select is not supported.");
			}

			return this._getObject(sPath, oContext, mParameters !== undefined ? mParameters.expand : undefined, true);
		},

		/**
		 * @override
		 */
		getProperty: function (sPath, oContext, bIncludeExpandEntries) {
			return this._getObject(sPath, oContext, bIncludeExpandEntries ? "*" : undefined, true);
		},

		/**
		 * @override
		 */
		setProperty: function (sPath, oValue, oContext, bAsyncUpdate) {
			throw Error("The ODataFacadeModel does not support to set a property.");
		},

		/**
		 * @override
		 */
		attachEvent: function (sEventId, oData, fnFunction, oListener) {
			var aPropagatedEventIds = this._getPropagatedEventIds();

			if (aPropagatedEventIds.indexOf(sEventId) > -1) {
				var sMethodName = this._getEventMethodName("attach", sEventId);

				this.getOriginModel()[sMethodName].apply(
					this.getOriginModel(), [oData, fnFunction, oListener]);
			} else {
				EventProvider.prototype.attachEvent.apply(
					this, [sEventId, oData, fnFunction, oListener]);
			}
		},

		/**
		 * @override
		 */
		detachEvent: function (sEventId, fnFunction, oListener) {
			var aPropagatedEventIds = this._getPropagatedEventIds();

			if (aPropagatedEventIds.indexOf(sEventId) > -1) {
				var sMethodName = this._getEventMethodName("detach", sEventId);

				this.getOriginModel()[sMethodName].apply(
					this.getOriginModel(), [fnFunction, oListener]);
			} else {
				EventProvider.prototype.detachEvent.apply(
					this, [sEventId, fnFunction, oListener]);
			}
		},

		/* ------------------------------- protected ------------------------------- */

		/**
		 * Determines from a given key or context the path information
		 *
		 * @param {string} sKey - the full path key
		 * @param {object} oContext - the context object
		 * @returns {object} oRoot -  an object
		 * @returns {string} oRoot.setName - name of the set
		 * @returns {string} oRoot.key - key of the set
		 * @returns {string} oRoot.navProperty - navigation property
		 * @returns {string} oRoot.multiplicity - cardinality of the navigation property
		 * @returns {string} oRoot.contextPath - computed context path
		 * @returns {string} oRoot.fullPath - the absolute path
		 */
		_determinePathInfo: function (sKey, oContext) {
			var oRoot = this._resolveRoot(sKey, oContext);

			if (oRoot.key) {
				if (oRoot.relParts.length > 0) {
					oRoot.navProperty = oRoot.relParts[0];
					oRoot.fullPath += "/" + oRoot.relParts[0];
					oRoot.multiplicity = this._determineMultiplicityOfNavigationProperty(
						oRoot.setName, oRoot.relParts[0]);
				} else {
					oRoot.multiplicity = "1";
				}
			} else {
				oRoot.multiplicity = "*";
			}

			return oRoot;
		},

		/**
		 * Creates a deep copy of the given object and stores it to this model considering potential expands
		 *
		 * @param {object} oDataToBeStored - the data object to store
		 * @param {object} oPathInfo - the path info object as returned from <code>_determinePathInfo</code>
		 * @param {boolean} bSuppressListeners - whether to suppress to inform bindings about a potential change
		 * @returns {map} expanded list
		 */
		_store: function (oDataToBeStored, oPathInfo, bSuppressListeners) {
			var oCopy = $.extend(true, {}, oDataToBeStored);
			var mExpandLists = {};
			var sKey;

			this._determineExpandLists(mExpandLists, oCopy, "root", oPathInfo.multiplicity);

			// suspend all bindings to prevent triggering a binding until ALL data is set
			this._setBindingsActive(false);

			var oData = JSONModel.prototype.getData.apply(this);

			
			var mNavProps;
			var oOldNavPropValue;
			var oNewNavPropValue;
			
			for (sKey in mExpandLists) {
				
				// keep the values of already loaded navigation properties
				mNavProps = this._determineNavPropsMap(mExpandLists[sKey]);
				for (var navPropName in mNavProps) {
					if (oData[sKey]) {
						oOldNavPropValue = oData[sKey][navPropName];
						if (oOldNavPropValue && !oOldNavPropValue.__deferred) {
							oNewNavPropValue = mExpandLists[sKey][navPropName];
							if (oNewNavPropValue && oNewNavPropValue.__deferred) {
								mExpandLists[sKey][navPropName] = oOldNavPropValue;
							}
						}
					}
				}
				
				if (!bSuppressListeners) {
					JSONModel.prototype.setProperty.apply(this, ["/" + sKey, mExpandLists[sKey]]);
				} else {
					oData[sKey] = mExpandLists[sKey];
				}
			}

			this._replaceDeferred(oPathInfo, mExpandLists);

			this._setBindingsActive(true);

			return mExpandLists;
		},

		/* ------------------------------- private ------------------------------- */

		/**
		 * Sync the messages from the origin model into this facade model
		 * @param {sap.ui.base.Event} oEvent - the event
		 */
		_onMessageChangeInOriginModel: function(oEvent) {
			this.mMessages = this._oOriginModel.mMessages;
			this.fireMessageChange(oEvent);
		},
		
		/**
		 * Determines from a given data object the expands and performs the necessary transformation
		 * for storing them into the model - Note: the method invokes itself recursively until all expands are resolved
		 *
		 * @param {map} mLists - pass an empty object {} - this map contains
		 * 						 after invocation the computed expands as key/value pairs
		 * @param {object} oData - the data object
		 * @param {string} sNavProp - name of navigation property which should be expanded
		 * @param {string} sMultiplicity - cardinality of the navigation property (* or 1)
		 */
		_determineExpandLists: function (mLists, oData, sNavProp, sMultiplicity) {
			var aResultArray;
			var sEntityKey;
			var sProp;
			var mNavProps;

			var fnPutObjectToList = function (oDataToBeAdded) {
				var sAddedEntityKey = this.getKey(oDataToBeAdded);

				if (sAddedEntityKey) {
					mLists[sAddedEntityKey] = oDataToBeAdded;
				}
				return sAddedEntityKey;
			}.bind(this);

			var oValue = this._getNavigationPropertyValue(oData, sNavProp, sMultiplicity);

			if (oValue) {
				if (oValue instanceof Array) {
					if (oValue.length > 0) {
						mNavProps = this._determineNavPropsMap(oValue[0]);
					}

					aResultArray = [];
					oData[sNavProp] = {
						__list: aResultArray
					};

					for (var i = 0; i < oValue.length; i++) {
						sEntityKey = fnPutObjectToList.apply(this, [oValue[i]]);
						aResultArray.push(sEntityKey);

						for (sProp in mNavProps) {
							this._determineExpandLists(mLists, oValue[i], sProp, mNavProps[sProp]);
						}
					}
				} else {
					sEntityKey = fnPutObjectToList.apply(this, [oValue]);

					if (sEntityKey) {
						oData[sNavProp] = {
							__ref: sEntityKey
						};
						mNavProps = this._determineNavPropsMap(oValue);
						for (sProp in mNavProps) {
							this._determineExpandLists(mLists, oValue, sProp, mNavProps[sProp]);
						}
					}
				}
			}
		},

		/**
		 * Replaces the deferred entries in the model as received with given <code>mEntitySetEntries</code>
		 *
		 * @param {object} oPathInfo - the path object
		 * @param {map} mEntitySetEntries - the entity set entries as returned from <code>_store</code>
		 */
		_replaceDeferred: function (oPathInfo, mEntitySetEntries) {
			// replace '__deferred'
			if (oPathInfo.navProperty !== undefined) {
				var aFilteredEntries = this._filterEntitySetEntries(
					mEntitySetEntries, oPathInfo.setName, oPathInfo.navProperty);
				var oCtx = JSONModel.prototype.getProperty
					.apply(this, [oPathInfo.contextPath]);
				var oReplace;

				if (oCtx === undefined) {
					var oBase = {};

					oBase[oPathInfo.navProperty] = {
						__deferred: "unknown"
					};
					JSONModel.prototype.setProperty.apply(this, [oPathInfo.contextPath, oBase]);
				}

				if (oPathInfo.multiplicity === "1") {
					oReplace = {
						__ref: aFilteredEntries[0]
					};
				} else {
					oReplace = {
						__list: aFilteredEntries
					};
				}

				JSONModel.prototype.setProperty.apply(
					this, [oPathInfo.fullPath, oReplace]);
			}
		},

		/**
		 * Create the path parts for given path and/or context
		 * @param {string} sKey - the relative or absolute path
		 * @param {object} oContext - the context
		 * @return {string} - a string array of the path parts
		 */
		_createPath: function (sKey, oContext) {
			var sPath;

			if (oContext !== undefined && oContext !== null) {
				sPath = typeof oContext === "string" ? oContext : oContext.getPath();

				if (sPath.charAt(0) !== "/") {
					sPath = "/" + sPath;
				}

				if (sKey) {
					sPath += "/" + sKey;
				}
			} else {
				sPath = sKey;
			}

			return sPath.split("/");
		},

		/**
		 * Resolves the root node of the given path
		 * @param {string}sKey - the relative or absolute path
		 * @param {object }oContext - the context
		 * @returns {object} oRoot -  an object
		 * @returns {string} oRoot.setName - name of the set
		 * @returns {string} oRoot.key - key of the set
		 * @returns {string} oRoot.contextPath - computed context path
		 * @returns {string} oRoot.fullPath - the absolute path
		 * @returns {string} oRoot.property - this is only filled in case of no context but only a relative property
		 * @returns {array} oRoot.relParts - the relative path parts after the context
		 */
		_resolveRoot: function (sKey, oContext) {
			var sSetName;
			var sKeyOnly;
			var sFullPath;
			var sPropName;

			var aParts = this._createPath(sKey, oContext);

			// only relative prop
			if (aParts.length === 1) {
				sPropName = aParts[0];
				aParts.splice(0, 1);
			} else if (aParts[1].charAt(aParts[1].length - 1) === ")") {
				// there is key information
				// single entity
				// e.g. /SomeSet('SomeKey')/SomeAssoc/2/title
				sKeyOnly = aParts[1].substring(aParts[1].indexOf("(") + 1, aParts[1].length - 1);
				sSetName = aParts[1].substring(0, aParts[1].indexOf("("));
				sFullPath = "/" + sSetName + (sKeyOnly !== undefined ? "(" + sKeyOnly + ")" : "");

				aParts.splice(0, 2);
			} else {
				// entity set
				// e.g. /SomeSet/3/title
				sKeyOnly = undefined;
				sSetName = aParts[1];
				sFullPath = "/" + sSetName;

				aParts.splice(0, 2);
			}

			return {
				setName: sSetName,
				key: sKeyOnly,
				contextPath: sSetName !== undefined ?
					"/" + sSetName + (sKeyOnly !== undefined ? "(" + sKeyOnly + ")" : "") : undefined,
				fullPath: sFullPath,
				property: sPropName,
				relParts: aParts
			};
		},

		/**
		 * Resolves the navigation properties
		 * @param {array} aParts - array containing the path elements except the root node
		 * 						   (from where the navigation starts)
		 * @param {string} sFullPath - the full path of the root (the part before the navigation starts)
		 * @param {string} sSetName - the full path of the root (the part before the navigation starts)
		 * @returns {object} oPath -  an object
		 * @returns {array} oPath.pathElements -  the navigation path elements
		 * @returns {boolean} oPath.mustExpand - whether for resolving the navigation path the data must be expanded
		 * @returns {string} oPath.fullPath - the full path
		 */
		_resolveNavigationPath: function (aParts, sFullPath, sSetName) {
			var sProp = aParts[0];
			var iPointer = 0;
			var sMultiplicity;
			var oPathEl;
			var aPath = [];

			var fnCreatePathEl = function (sPathEl, sPathMultiplicity, iElementIndex) {
				return {
					prop: sPathEl,
					isNavigation: sPathMultiplicity !== undefined,
					multiplicity: sPathMultiplicity,
					elementIndex: iElementIndex,

					toString: function () {
						var s = "/" + this.prop;

						if (this.multiplicity === "*" && this.elementIndex) {
							s += "/results";
						}

						if (this.elementIndex) {
							s += "/" + this.elementIndex;
						}

						return s;
					}
				};
			};

			var sCurrentSetName = sSetName;

			while (sProp !== undefined) {
				sMultiplicity = this._determineMultiplicityOfNavigationProperty(sCurrentSetName, sProp);

				if (sMultiplicity !== undefined) {
					if (sMultiplicity === "1") {
						oPathEl = fnCreatePathEl.apply(this, [sProp, sMultiplicity]);
					} else {
						iPointer++;
						oPathEl = fnCreatePathEl.apply(this, [sProp, sMultiplicity, aParts[iPointer]]);
					}

					sCurrentSetName = this._determineSetNameOfNavigationProperty(sCurrentSetName, sProp);
				} else {
					oPathEl = fnCreatePathEl.apply(this, [sProp]);
				}

				aPath.push(oPathEl);
				iPointer++;
				sProp = aParts[iPointer];
			}

			var oResult = {
				pathElements: aPath,
				mustExpand: false,
				fullPath: sFullPath
			};

			for (var i = 0; i < aPath.length; i++) {
				oResult.fullPath += aPath[i].toString();

				if (aPath[i].elementIndex) {
					oResult.mustExpand = true;
				}
			}

			// check if last element is navigation prop with cardinality 1
			if (aPath.length > 0) {
				if (aPath[aPath.length - 1].multiplicity === "1") {
					oResult.mustExpand = true;
				}
			}

			return oResult;
		},

		/**
		 * Resolves the given path and/or context according to facade model specifics
		 * @param {string} sKey - the relative or absolute path
		 * @param {object} oContext - the context
		 * @returns {object} oPath -  an object
		 * @returns {array} oPath.pathElements -  the navigation path elements
		 * @returns {boolean} oPath.mustExpand - flag indicating whether for data retrieval expand must be executed
		 * @returns {string} oPath.fullPath - the full path
		 * @returns {string} oPath.contextPath - the context path
		 */
		_resolveToModelPath: function (sKey, oContext) {
			var oPath,
				oRoot = this._resolveRoot(sKey, oContext);

			if (oRoot.property) {
				return {
					pathElements: [],
					mustExpand: false,
					fullPath: oRoot.property
				};
			} else if (oRoot.key) {
				oPath = this._resolveNavigationPath(oRoot.relParts, oRoot.fullPath, oRoot.setName);
				oPath.contextPath = oRoot.contextPath;

				return oPath;
			} else if (oRoot.relParts.length === 0) {
				return {
					pathElements: [],
					mustExpand: false,
					fullPath: oRoot.fullPath,
					contextPath: oRoot.contextPath
				};
			} else {
				throw Error("Unsupported model path '" + oRoot.fullPath + "/" + oRoot.relParts.join("/"));
			}
		},

		/**
		 * Returns the origin model
		 * @return {sap.ui.model.Model} - the model
		 */
		getOriginModel: function () {
			return this._oOriginModel;
		},

		/**
		 * Sets all bindings of this model to active/inactive
		 *
		 * @param {boolean} bActive - <code>true</code> for active; <code>false</code> for inactive
		 */
		_setBindingsActive: function (bActive) {
			var aBindings = this.getBindings();

			// disable force update in resume case
			var fnOriginCheckUpdate = JSONPropertyBinding.prototype.checkUpdate;
			JSONPropertyBinding.prototype.checkUpdate = function() {
				fnOriginCheckUpdate.apply(this);
			};
			
			for (var i = 0; i < aBindings.length; i++) {
				if (bActive) {
					aBindings[i].resume();
				} else {
					aBindings[i].suspend();
				}
			}
			
			JSONPropertyBinding.prototype.checkUpdate = fnOriginCheckUpdate;
		},

		/**
		 * Reads data from the given path in the out model considering the comma separated lists
		 * of navigation properties which need to be expanded
		 * Note: if <code>sNavPropList</code> is undefined, all navigation properties are expanded
		 *
		 * @param {string} sPath - path from which the data in the out model should be read
		 * @param {string} sNavPropList - comma separated list of navigation properties that should be expanded
		 * 
		 * @return {object} - Returns an expanded copy of the data in the out model
		 */
		_expandData: function (sPath, sNavPropList) {
			var aList = sNavPropList ? sNavPropList.split(",") : [];
			var oObject = JSONModel.prototype._getObject.apply(this, [sPath]);
			var oCopy = $.extend(true, {}, oObject);
			var aExp, oExp;

			for (var oProp in oCopy) {
				// has expand data
				if (oCopy[oProp] !== undefined &&
					oCopy[oProp] !== null &&
					(sNavPropList === undefined || $.inArray(oProp, aList))) {
					if (oCopy[oProp].__list !== undefined) {
						aExp = [];
						for (var i = 0; i < oCopy[oProp].__list.length; i++) {
							aExp.push(this._expandData("/" + oCopy[oProp].__list[i], sNavPropList));
						}

						// replace with expanded data
						oCopy[oProp] = {
							results: aExp
						};
					} else if (oCopy[oProp].__ref !== undefined) {
						oExp = this._expandData("/" + oCopy[oProp].__ref, sNavPropList);
						// replace with expanded data
						oCopy[oProp] = oExp;
					}
				}
			}

			return oCopy;
		},
		
		/**
		 * Removes data under the given path from the model following all object relations for 'deep' object deletion
		 *
		 * @param {string} sPath - path referring to the object that should be removed including all related entities
		 */
		_removeData: function(sPath) {
			var oObject = JSONModel.prototype._getObject.apply(this, [sPath]);

			for (var oProp in oObject) {
				// has expand data
				if (oObject[oProp] !== undefined &&
					oObject[oProp] !== null) {
					if (oObject[oProp].__list !== undefined) {
						for (var i = 0; i < oObject[oProp].__list.length; i++) {
							this._removeData("/" + oObject[oProp].__list[i]);
						}
					} else if (oObject[oProp].__ref !== undefined) {
						this._removeData("/" + oObject[oProp].__ref);
					}
				}
			}

			delete this.oData[sPath.substr(1)];
		},

		/**
		 * Retrieves a property from the given expanded data
		 * @param {object} oData - the expanded data
		 * @param {object} oPathInfo - the path info object
		 * @return {object|string|number|boolean} - the property value
		 */
		_getFromExpandedData: function (oData, oPathInfo) {
			if (oPathInfo.contextPath === oPathInfo.fullPath) {
				return oData;
			} else {
				var sNav = oPathInfo.fullPath.substr(oPathInfo.contextPath.length + 1);
				var aPropNames = sNav.split("/");
				var oNav = oData;

				for (var i = 0; i < aPropNames.length; i++) {
					oNav = oNav[aPropNames[i]];

					if (oNav === undefined) {
						break;
					}
				}

				return oNav;
			}
		},

		/**
		 * Filters the given <code>mEntitySetEntries</code> to the ones belonging to the given navigation property
		 * @param {map} mEntitySetEntries - map of entity set entries as returned from <code>_store</code>
		 * @param {string} sSetName - name of the set the navigation property belongs to
		 * @param {string} sNavPropName - the navigation property
		 * @return {array} - an array containing the filtered entries
		 */
		_filterEntitySetEntries: function (mEntitySetEntries, sSetName, sNavPropName) {
			var aResult = [];
			var sNavPropSetName = this._determineSetNameOfNavigationProperty(sSetName, sNavPropName);

			for (var sEntryKey in mEntitySetEntries) {
				if (sEntryKey.indexOf(sNavPropSetName) > -1) {
					aResult.push(sEntryKey);
				}
			}

			return aResult;
		},

		/**
		 * Generates all non-existing attach/detach event methods for the facade model
		 */
		_generateEventMethods: function () {
			var aPropagatedEventIds = this._getPropagatedEventIds();
			var sPropEventId;

			for (var i = 0; i < aPropagatedEventIds.length; i++) {
				sPropEventId = aPropagatedEventIds[i];
				this._generateEventMethod(sPropEventId);
			}
		},

		/**
		 * Generates the event methods for the given event id
		 * @param {string} sEventId - the event id
		 */
		_generateEventMethod: function (sEventId) {

			var fnAttachEvent = function (sEventId, oData, fnFunction, oListener) {
				this.attachEvent(sEventId, oData, fnFunction, oListener);
			};

			var fnDetachEvent = function (sEventId, fnFunction, oListener) {
				this.detachEvent(sEventId, fnFunction, oListener);
			};

			var fnFireEvent = function (sEventId, oParameters) {
				this.fireEvent(sEventId, oParameters);
			};

			var sMethodName;
			sMethodName = this._getEventMethodName("attach", sEventId);
			if (this[sMethodName] === undefined) {
				this[sMethodName] = fnAttachEvent.bind(this, sEventId);
			}
			sMethodName = this._getEventMethodName("detach", sEventId);
			if (this[sMethodName] === undefined) {
				this[sMethodName] = fnDetachEvent.bind(this, sEventId);
			}
			sMethodName = this._getEventMethodName("fire", sEventId);
			if (this[sMethodName] === undefined) {
				this[sMethodName] = fnFireEvent.bind(this);
			}
		},

		/**
		 * Computes the specific accessor name for the given event id
		 * @param {string} sAccessorName - accessor name
		 * @param {string} sEventId - the event id
		 * @return {string} - the completed name of the event method
		 */
		_getEventMethodName: function (sAccessorName, sEventId) {
			return sAccessorName + sEventId.charAt(0).toUpperCase() + sEventId.substr(1);
		},

		/**
		 * Create the promise wrapper for version specific result handling
		 * @param {function} fnExecute - function to execute depending on the protocol version
		 * @param {string} sExecutionName - name of the execution function
		 * @param {map} mParams - map of function parameters; key is protocol version as string, 
		 * 						value is an array of parameters
		 * @return {object} - an object that allows to append logic
		 * 						for v2 (caseV2), v4 (caseV4) and the error case (caseCatch)
		 */
		_executeForSpecificVersion: function (fnExecute, sExecutionName, mParams) {
			var sVersion = this._getVersion();
			var aParams = mParams[sVersion];
			var oPromise;

			if (aParams instanceof Array) {
				oPromise = fnExecute.apply(this, aParams);
			} else {
				throw Error("Parameters for '" + sExecutionName +
					"' version '" + sVersion + "' must be provided as array.");
			}

			var oResult = {
				version: sVersion,
				promise: oPromise,
				caseV2: function (fnThen) {
					if (oResult.version === "2") {
						oResult.promise.then(fnThen);
					}
					return oResult;
				},
				caseV4: function (fnThen) {
					if (oResult.version === "4") {
						oResult.oPromise.then(fnThen);
					}
					return oResult;
				},
				caseCatch: function (fnCatch) {
					oResult.oPromise.catch(fnCatch);
					return oResult;
				}
			};

			return oResult;
		}
	});
});
