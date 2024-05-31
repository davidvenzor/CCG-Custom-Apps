/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/common/odataFacade/ODataFacadeModel"
], function (ODataFacadeModel) {
	"use strict";


	/**
	 * OData Facade for protocol version 4
	 *
	 * @class
	 *
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.vchclf.common.odataFacade.ODataV4FacadeModel
	 * @extends sap.i2d.lo.lib.vchclf.common.odataFacade.ODataFacadeModel
	 */
	return ODataFacadeModel.extend("sap.i2d.lo.lib.zvchclfz.common.odataFacade.ODataV4FacadeModel", {
		/** @lends sap.i2d.lo.lib.vchclf.common.odataFacade.ODataFacadeModel.prototype */

		/* ------------------------------- protected ------------------------------- */

		/**
		 * @override
		 */
		_getVersion: function () {
			return "4";
		},

		/**
		 * @override
		 */
		_getPropagatedEventIds: function () {
			return [];
		},

		/**
		 * @override
		 */
		_initMetaModel: function (aPaths) {
			var oMetaModel = this.getOriginModel().getMetaModel();
			var aPromises = [];

			for (var i = 0; i < aPaths.length; i++) {
				aPromises.push(oMetaModel.requestObject(aPaths[i]));
			}

			oMetaModel.requestObject(aPaths[i]);

			return Promise.all(aPromises).then(function () {
				this.fireEvent("metadataLoaded");
			}.bind(this));
		},

		/**
		 * @override
		 */
		_determineSetNameOfNavigationProperty: function (sSetName, sNavPropName) {
			var oSetMetadata = this.getOriginModel().getMetaModel()
				.getObject("/" + sSetName + "/");

			if (oSetMetadata[sNavPropName]) {
				var sType = oSetMetadata[sNavPropName].$Type;
				var sSetNameOfEntity = this._findSetNameOfEntityInContainerMetadata(sType);

				if (sSetNameOfEntity !== undefined) {
					return sSetNameOfEntity;
				}
			}

			return undefined;
		},

		/**
		 * @override
		 */
		_determineMultiplicityOfNavigationProperty: function (sSetName, sNavPropName) {
			var oSetMetadata = this.getOriginModel().getMetaModel()
				.getObject("/" + sSetName + "/");

			if (oSetMetadata[sNavPropName]) {
				var oNavProp = oSetMetadata[sNavPropName];

				return oNavProp.$isCollection ? "*" : "1";
			}

			return undefined;
		},

		/**
		 * @override
		 */
		_determineNavPropsMap: function (oData) {
			var sEntitySet = this._getEntitySetName(oData);
			var oMetaModel = this.getOriginModel().getMetaModel();
			var oSetMetadata = oMetaModel.getObject("/" + sEntitySet + "/");

			var mResult = {};

			for (var sProp in oSetMetadata) {
				if (sProp.charAt(0) !== "$" && oSetMetadata[sProp].$kind === "NavigationProperty") {
					mResult[sProp] = oSetMetadata[sProp].$isCollection ? "*" : "1";
				}
			}

			return mResult;
		},

		/**
		 * @override
		 */
		_getNavigationPropertyValue: function (o, sNavPropName, sMultiplicity) {
			return o[sNavPropName];
		},


		/* ------------------------------- public ------------------------------- */

		/**
		 * @override
		 */
		facadeRead: function (sKey, mUrlParameters, oContext, aFilters, fnSuccess, fnError, sGroupId, bSuppressListeners) {
			if (!mUrlParameters) {
				mUrlParameters = {};
			}

			if (sGroupId) {
				mUrlParameters.$$groupId = "$auto." + sGroupId;
			}

			this._adjustExpandParameter(mUrlParameters);
			this._adjustTimestampInFilter(aFilters);
			var oPathInfo = this._determinePathInfo(sKey, oContext);

			// single entity
			if (oPathInfo.multiplicity === "1") {
				return this._readEntity(oPathInfo, sKey, oContext, mUrlParameters, fnSuccess, fnError, bSuppressListeners);
				// entity set
			} else {
				return this._readEntitySet(oPathInfo, sKey, oContext, mUrlParameters, aFilters, fnSuccess, fnError, bSuppressListeners);
			}
		},

		/**
		 * @override
		 */
		facadeCallFunction: function (sFunction, mUrlParameters, changeSetId, sGroupId) {
			return new Promise(function (fnResolve, fnReject) {

				var oContextBinding = this.getOriginModel().bindContext(sFunction + "(...)");

				if (sGroupId) {
					sGroupId = "$auto." + sGroupId;
				}

				if (!mUrlParameters) {
					mUrlParameters = {};
				}

				// set url parameters
				for (var sParamName in mUrlParameters) {
					oContextBinding.setParameter(sParamName, mUrlParameters[sParamName]);
				}

				oContextBinding.attachDataRequested(this.fireRequestSent.bind(this));
				oContextBinding.attachDataReceived(this.fireRequestCompleted.bind(this));

				oContextBinding.execute(sGroupId)
					.then(function () {

						// read response
						var oActionResult = oContextBinding.getBoundContext()
							.getObject();

						fnResolve(oActionResult);

						// destroy binding
						oContextBinding.destroy();
					})
					.catch(function (oError) {
						this.displayErrorMessages(
							[this._createErrorMessage(oError)]);
						fnReject(oError);
					}.bind(this));
			}.bind(this));
		},

		/**
		 * @override
		 */
		facadeCreate: function (sKey, mContextData) {
			throw Error("Not yet implemented.");
		},

		/**
		 * @override
		 */
		getKey: function (vValue) {
			return this.createKey(
				this._getEntitySetName(vValue),
				vValue);
		},

		/**
		 * @override
		 */
		createKey: function (sSet, oKey) {
			var bHasLeadingSlash = true;

			if (sSet.substr(0, 1) !== "/") {
				bHasLeadingSlash = false;
				sSet = "/" + sSet;
			}

			var oMetaModel = this.getOriginModel().getMetaModel();
			var oMetaData = oMetaModel.getObject(sSet + "/");

			if (oMetaData === null) {
				throw Error("Metadata for '" + sSet + "' has not been initialized.");
			} else {
				var aKeyEl = oMetaData.$Key;
				var sResult = sSet + "(";
				var oTypeInfo;

				for (var i = 0; i < aKeyEl.length; i++) {
					oTypeInfo = oMetaData[aKeyEl[i]];

					if (oTypeInfo.$Type === "Edm.String") {
						if (typeof oKey[aKeyEl[i]] === "string" || typeof oKey[aKeyEl[i]] === "number") {
							sResult += aKeyEl[i] + "='" + oKey[aKeyEl[i]] + "'";
						} else {
							throw Error("Key '" + oKey[aKeyEl[i]] + "' for entity set '" + sSet +
								"' is missing or of wrong type. Expected type: string");
						}
					} else if (oTypeInfo.$Type === "Edm.Int16" || oTypeInfo.$Type === "Edm.Int32") {
						if (typeof oKey[aKeyEl[i]] === "number") {
							sResult += aKeyEl[i] + "=" + oKey[aKeyEl[i]];
						} else {
							throw Error("Key '" + oKey[aKeyEl[i]] + "' for entity set '" + sSet +
								"' is missing or of wrong type. Expected type: number");
						}
					} else if (oTypeInfo.$Type === "Edm.Boolean") {
						if (typeof oKey[aKeyEl[i]] === "boolean") {
							sResult += aKeyEl[i] + "=" + oKey[aKeyEl[i]];
						} else {
							throw Error("Key '" + oKey[aKeyEl[i]] + "' for entity set '" + sSet +
								"' is missing or of wrong type. Expected type: boolean");
						}
					}

					if (i < (aKeyEl.length - 1)) {
						sResult += ",";
					}
				}

				sResult += ")";

				// need to remove temporarily added slash
				if (!bHasLeadingSlash) {
					sResult = sResult.substr(1);
				}

				return sResult;
			}
		},

		/**
		 * @override
		 */
		setDeferredGroup: function (sGroupId) {
			var mGroupProperties = this.getOriginModel().mGroupProperties;

			mGroupProperties["$auto." + sGroupId] = {
				sumbit: "API" //TODO check here there is a spelling error "submit"
			};
		},

		/**
		 * @override
		 */
		submitBatch: function (sGroupId) {
			return this.getOriginModel()
				.submitBatch("$auto." + sGroupId);
		},

		/* ------------------------------- private ------------------------------- */

		/**
		 * Reads a single entity
		 * @param {object} oPathInfo - the computed path info object
		 * @param {string} sKey - A string containing the path to the data which should be retrieved.
		 * 							 The path is concatenated to the service URL
		 * 							 which was specified in the model constructor.
		 * @param {sap.ui.model.Context} oContext - an optional context
		 * @param {map}mUrlParameters - A map containing the parameters that will be passed as query strings
		 * @param {Function} fnSuccess - optional function to be called in success case
		 * @param {Function} fnError - optional function to be called in error case
		 * @param {boolean} bSuppressListeners - whether to inform the bindings or not
		 * @return {Promise} - a promise which is resolved after the server has been invoked
		 * 						 and the response is processed
		 * 						- in case of success:
		 * 							 the resolve function gets as parameter the returned data
		 *  					- in case of an error:
		 * 							 the error function gets as parameter the error object
		 */
		_readEntity: function (oPathInfo, sKey, oContext, mUrlParameters, fnSuccess, fnError, bSuppressListeners) {
			return new Promise(function (fnResolve, fnReject) {
				var oContextBinding = this.getOriginModel()
					.bindContext(sKey, oContext, mUrlParameters);

				oContextBinding.attachDataRequested(function (oEvent) {
					this.fireRequestSent(oEvent);
				}.bind(this));
				oContextBinding.attachDataReceived(function (oEvent) {
					this.fireRequestCompleted(oEvent);
				}.bind(this));

				oContextBinding.requestObject().
				then(function (oData) {
					// enrich with metadata and store
					this._enrichWithMetadata(oData, oPathInfo);
					this._store({
						root: oData
					}, oPathInfo, bSuppressListeners);

					// adjust response
					this._adjustResponse(oData);

					// resolve
					if (fnSuccess) {
						fnSuccess(oData);
					}

					fnResolve(oData);

					// destroy binding
					oContextBinding.destroy();
				}.bind(this)).catch(function (oError) {
					this.displayErrorMessages([this._createErrorMessage(oError)]);

					if (fnError) {
						fnError(oError);
					}

					fnReject(oError);
				}.bind(this));
			}.bind(this));
		},

		/**
		 * Reads an entity set
		 * @param {object} oPathInfo - the computed path info object
		 * @param {string} sKey - A string containing the path to the data which should be retrieved.
		 * 						  The path is concatenated to the service URL
		 * 					      which was specified in the model constructor.
		 * @param {sap.ui.model.Context} oContext - an optional context
		 * @param {map} mUrlParameters - A map containing the parameters that will be passed as query strings
		 * @param {sap.ui.model.Filter[]} aFilters - An array of filters to be included in the request URL
		 * @param {Function} fnSuccess - optional function to be called in success case
		 * @param {Function} fnError - optional function to be called in error case
		 * @param {boolean} bSuppressListeners - whether to inform the bindings or not
		 * @return {Promise} - a promise which is resolved after the server has been invoked
		 * 						 and the response is processed
		 * 						- in case of success:
		 * 							 the resolve function gets as parameter the returned data
		 *  					- in case of an error:
		 * 							 the error function gets as parameter the error object
		 */
		_readEntitySet: function (oPathInfo, sKey, oContext, mUrlParameters,
			aFilters, fnSuccess, fnError, bSuppressListeners) {
			return new Promise(function (fnResolve, fnReject) {
				mUrlParameters.$$operationMode = "Server";
				var iTop, iSkip;

				if (mUrlParameters.$skip !== undefined) {
					iSkip = mUrlParameters.$skip;
					delete mUrlParameters.$skip;
				}

				if (mUrlParameters.$top !== undefined) {
					iTop = mUrlParameters.$top;
					delete mUrlParameters.$top;
				}

				if (mUrlParameters.$inlinecount === "allpages") {
					mUrlParameters.$count = true;
					delete mUrlParameters.$inlinecount;
				}

				// bindList(sPath, oContext?, vSorters?, vFilters?, mParameters?)
				var oListBinding = this.getOriginModel()
					.bindList(sKey, oContext, undefined, aFilters, mUrlParameters);

				oListBinding.attachDataReceived(function (oEvent) {

					if (oEvent.getParameter("error") === undefined) {

						// read response
						var iCount = oEvent.getSource().getLength();
						var aContexts = oEvent.getSource().getCurrentContexts();
						var aResult = [];
						var o;

						for (var i = 0; i < aContexts.length; i++) {
							o = aContexts[i].getObject();
							aResult.push(o);
						}

						// enrich with metadata and store
						this._enrichWithMetadata(aResult, oPathInfo);
						this._store({
							root: aResult
						}, oPathInfo, bSuppressListeners);

						// adjust response
						var oData = this._adjustResponse(aResult);

						oData.__count = iCount + "";

						// resolve
						if (fnSuccess) {
							fnSuccess(oData);
						}

						fnResolve(oData);

					} else {
						var oError = oEvent.getParameter("error");

						this.displayErrorMessages([this._createErrorMessage(oError)]);

						if (fnError) {
							fnError(oError);
						}

						fnReject(oError);
					}

					this.fireRequestCompleted(oEvent);

					// destroy binding
					oListBinding.destroy();

				}.bind(this));

				oListBinding.attachDataRequested(function (oEvent) {
					this.fireRequestSent(oEvent);
				}.bind(this));

				oListBinding.getContexts(iSkip, iTop);

			}.bind(this));
		},

		/**
		 * Returns the entity set name to which the given data object belongs -
		 * the information is parsed out from the contained metadata
		 * @param {object} oData - oData - the data object
		 * @return {string} - the entity set name as string
		 */
		_getEntitySetName: function (oData) {
			//"$metadata#ConfigurationContextSet/$entity"
			var sMetaContext = oData["@odata.context"];
			var sEntityPath = sMetaContext.split("#")[1];
			var sEntitySet = sEntityPath.split("/")[0];

			return sEntitySet;
		},

		/**
		 * Private helper to extract error information from an error object to be displayed in an error dialog
		 *
		 * Error information is extracted into a custom object containing the most important key info only.
		 * - statusCode: HTTP status code
		 * - message:    HTTP status message
		 * - internalMessage:     internal error message from ABAP side or Gateway
		 * - internalMessageCode: internal error code from ABAP side (message class code)
		 * - serviceId:           OData service id
		 *
		 * @private
		 * @param  {object} oError - error object as returned from the service
		 * @return {object} custom object as described above containing error information
		 */
		_createErrorMessage: function (oError) {

			var oErrorMessage = {};

			// general network issue - client stopped further processing of the request
			if (oError.cause) {
				oErrorMessage.statusCode = 0;
				oErrorMessage.message = oError.message;
				oErrorMessage.internalMessageCode = "";
				oErrorMessage.internalMessage = "";
				oErrorMessage.serviceId = this._getServiceIdFromUrl(oError.cause.requestUrl);
			} else {
				oErrorMessage.statusCode = oError.status;
				oErrorMessage.message = oError.statusText;

				if (oError.error) {
					oErrorMessage.internalMessageCode = oError.error.code;
					oErrorMessage.internalMessage = oError.error.message;

					if (oError.error["@SAP__common.Application"]) {
						oErrorMessage.serviceId = oError.error["@SAP__common.Application"].ServiceId;
					}

				}

			}

			return oErrorMessage;
		},

		/**
		 * Parses the service id out of the given service URL
		 * @param {string} sUrl - the relative service URL starting with /sap/...
		 * @return {string} - the id of the service or an empty string if parsing failed
		 */
		_getServiceIdFromUrl: function (sUrl) {
			//"/sap/opu/odata4/sap/z_dg_group/default/sap/z_dg_odata4/0001/$batch"
			var aParts = sUrl.split("/");

			return aParts.length > 3 ? aParts[aParts.length - 3] : "";
		},

		/**
		 * Removes the precision of 'ChangeTimestamp' fields that are present in the given filters array
		 * e.g. 2019-10-14T13:24:54.559229Z =>
		 *      2019-10-14T13:24:54Z<br>
		 * <br>
		 * TODO: this is a workaround as high precision is currently not working in v4!!!!
		 * @param {string} aFilters - filters
		 * @return {undefined}
		 */
		_adjustTimestampInFilter: function (aFilters) {
			if (aFilters !== undefined) {
				for (var i = 0; i < aFilters.length; i++) {
					if (aFilters[i].sPath === "ChangeTimestamp") {
						if (aFilters[i].oValue1 !== undefined) {
							aFilters[i].oValue1 = aFilters[i].oValue1
								.substring(0, aFilters[i].oValue1.length - 8) + "Z";
						}

						if (aFilters[i].oValue2 !== undefined) {
							aFilters[i].oValue2 = aFilters[i].oValue2
								.substring(0, aFilters[i].oValue2.length - 8) + "Z";
						}
					}
				}
			}
		},

		/**
		 * Returns the 'container' property from the meta model -
		 * the container property holds the definition of all entitySets
		 * @return {object} - the container object as found in meta model
		 */
		_getContainerFromMetadata: function () {
			var oMetadata = this.getOriginModel().getMetaModel().getData();

			return oMetadata[oMetadata["$EntityContainer"]];
		},

		/**
		 * Returns the entitySet name of a given entity type or undefined if not found<br>
		 * <br>
		 * @param {string} sType - entity type
		 * @return {string} - the name of the entity set as string
		 */
		_findSetNameOfEntityInContainerMetadata: function (sType) {
			var oProp;
			var oContainer = this._getContainerFromMetadata();

			// loop over all registered containers to find the right one
			for (oProp in oContainer) {
				if (oContainer[oProp].$Type === sType) {
					return oProp;
				}
			}

			return undefined;
		},

		/**
		 * Enriches the given data object with metadata from meta model
		 * Note: requires that meta data of all used entitysets has been loaded before
		 * @param {object} oData - the data object to enrich
		 * @param {object} oPathInfo - the path info object as obtained from <code>_determinePathInfo</code>
		 */
		_enrichWithMetadata: function (oData, oPathInfo) {
			var sSetName;

			// 1. determine the set name to which the data belongs
			if (oPathInfo.navProperty !== undefined) {
				sSetName = this._determineSetNameOfNavigationProperty(oPathInfo.setName, oPathInfo.navProperty);
			} else {
				sSetName = oPathInfo.setName;
			}

			// 2. Find navigation props
			var oMetaModel = this.getOriginModel().getMetaModel();
			var oSetMetadata = oMetaModel.getObject("/" + sSetName + "/");

			var fnProcessNavProps = function (obj) {
				for (var sProp in oSetMetadata) {
					if (sProp.charAt(0) !== "$" &&
						oSetMetadata[sProp].$kind === "NavigationProperty" &&
						obj[sProp] !== undefined) {
						this._enrichWithMetadata(obj[sProp], {
							setName: sSetName,
							navProperty: sProp
						});
					}
				}
			}.bind(this);

			// 3. Set the meta data for this object
			if (oData instanceof Array) {
				for (var i = 0; i < oData.length; i++) {
					oData[i]["@odata.context"] = "$metadata#" + sSetName + "/$entity";
					fnProcessNavProps.apply(this, [oData[i]]);
				}
			} else {
				oData["@odata.context"] = "$metadata#" + sSetName + "/$entity";
				fnProcessNavProps.apply(this, [oData]);
			}
		},

		/**
		 * Adjusts the expand parameter from the given urlParameters map according v4 specification
		 * e.g. <code>$expand=Instances/CharacteristicsGroups,InconsistencyInformation,UISettings => 
		 *            $expand=Instances($expand=CharacteristicsGroups),InconsistencyInformation,UISettings</code>
		 * @param {map} mUrlParameters - URL parameters
		 */
		_adjustExpandParameter: function (mUrlParameters) {
			//TODO fix multiple navigations on same root
			//e.g. <code>$expand=Instances/CharacteristicsGroups,Instances/Characteristics
			// => $expand=Instances($expand=CharacteristicsGroups,Characteristics)</code>
			var i, j;

			var oPart;
			var oRoot = {};
			var oCurrentRoot;

			var fnIsEmpty = function (o) {
				return $.isEmptyObject(o);
			};

			var fnGetCount = function (o) {
				return Object.keys(o).length;
			};

			var fnTraverseExpandTree = function (oCurrentRoot, sResult) {
				var iCount = fnGetCount(oCurrentRoot);
				var i = 0;

				for (var sExpandName in oCurrentRoot) {
					sResult += sExpandName;
					if (!fnIsEmpty.apply(this, [oCurrentRoot[sExpandName]])) {
						sResult += "($expand=";
						sResult = fnTraverseExpandTree.apply(this, [oCurrentRoot[sExpandName], sResult]);
						sResult += ")";
					}
					if (i < iCount - 1) {
						sResult += ",";
					}
					i++;
				}

				return sResult;
			};

			if (mUrlParameters && mUrlParameters.$expand) {

				// 1. create the hierarchical object structure

				var aExpandParts = mUrlParameters.$expand.split(",");

				for (i = 0; i < aExpandParts.length; i++) {
					var aDeepExpand = aExpandParts[i].split("/");

					oCurrentRoot = oRoot;
					for (j = 0; j < aDeepExpand.length; j++) {
						if (!oCurrentRoot[aDeepExpand[j]]) {
							oPart = {};
							oCurrentRoot[aDeepExpand[j]] = oPart;
						}

						oCurrentRoot = oCurrentRoot[aDeepExpand[j]];
					}
				}

				// 2. traverse the structure and transform in v4 compatible expand string

				var sExpand = fnTraverseExpandTree(oRoot, "");

				mUrlParameters.$expand = sExpand;

				if (mUrlParameters.$expand === "") {
					delete mUrlParameters.$expand;
				}
			}
		},

		/**
		 * Adjusts the data matching old response structure -
		 * each entitySet must be represented within an object as a <code>results</code> array
		 * @param {object} oData - the data as returned from the service
		 * @return {object} - the adjusted data object
		 */
		_adjustResponse: function (oData) {
			var fnConvArray = function (array) {
				var oResults = {
					results: array
				};

				for (var i = 0; i < oResults.results.length; i++) {
					this._adjustResponse(oResults.results[i]);
				}

				return oResults;
			}.bind(this);

			if (oData instanceof Array) {
				oData = fnConvArray(oData);
			} else {
				for (var oProp in oData) {
					if (oData[oProp] instanceof Array) {
						oData[oProp] = fnConvArray(oData[oProp]);
					} else if (typeof oData[oProp] === "object") {
						this._adjustResponse(oData[oProp]);
					}
				}
			}

			return oData;
		}
	});
});
