/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/common/odataFacade/ODataFacadeModel",
	"sap/i2d/lo/lib/zvchclfz/common/odataFacade/ODataV2ErrorHelper",
    "sap/i2d/lo/lib/zvchclfz/common/util/AppEvents",
	"sap/i2d/lo/lib/zvchclfz/common/util/Helper",
	"sap/i2d/lo/lib/zvchclfz/common/util/Toggle"
], function (ODataFacadeModel, ODataV2ErrorHelper, AppEvents, Helper, Toggle) {
	"use strict";


	/**
	 * OData Facade for protocol version 2
	 * 
	 * @class
	 *
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.vchclf.common.odataFacade.ODataV2FacadeModel
	 * @extends sap.i2d.lo.lib.vchclf.common.odataFacade.ODataFacadeModel
	 */
	return ODataFacadeModel.extend("sap.i2d.lo.lib.zvchclfz.common.odataFacade.ODataV2FacadeModel", {
		/** @lends sap.i2d.lo.lib.vchclf.common.odataFacade.ODataFacadeModel.prototype */

		/* ------------------------------- protected ------------------------------- */

		/**
		 * @override
		 */
		_getVersion: function () {
			return "2";
		},

		/**
		 * @override
		 */
		_getPropagatedEventIds: function () {
			return ["requestCompleted",
				"requestSent",
				"batchRequestSent",
				"batchRequestCompleted",
				"metadataLoaded"
			];
		},

		/**
		 * @override
		 */
		_setupEvents: function () {
			this.attachBatchRequestCompleted(this._onBatchRequestCompleted.bind(this));
		},
		
		/**
		 * @override
		 */
		_cleanupEvents: function () {
			this.detachBatchRequestCompleted(this._onBatchRequestCompleted.bind(this));
		},

		/**
		 * @override
		 */
		_initMetaModel: function () {
			var aPromises = [];

			aPromises.push(this.getOriginModel().metadataLoaded());
			aPromises.push(this.getOriginModel().getMetaModel().loaded());

			return Promise.all(aPromises);
		},

		/**
		 * @override
		 */
		_determineSetNameOfNavigationProperty: function (sSetName, sNavPropName) {
			var oEntity = this._getEntityTypeDefinition(sSetName);
			var oNavPropSet = this.getOriginModel().getMetaModel()
				.getODataAssociationSetEnd(oEntity, sNavPropName);

			return oNavPropSet && oNavPropSet.entitySet;

		},

		/**
		 * @override
		 */
		_determineMultiplicityOfNavigationProperty: function (sSetName, sNavPropName) {
			var oEntity = this._getEntityTypeDefinition(sSetName);
			var oAssoc = this.getOriginModel().getMetaModel()
				.getODataAssociationEnd(oEntity, sNavPropName);

			return oAssoc && this._convertMultiplicity(oAssoc.multiplicity);
		},

		/**
		 * @override
		 */
		_determineNavPropsMap: function (oData) {
			var mResult = {};
			var sEntityType = oData.__metadata.type;
			var oMetaModel = this.getOriginModel().getMetaModel();
			var oType = oMetaModel.getODataEntityType(sEntityType);
			var aNavProps = oType.navigationProperty;
			var oAssoc;

			if (aNavProps) {
				for (var i = 0; i < aNavProps.length; i++) {
					oAssoc = oMetaModel.getODataAssociationEnd(oType, aNavProps[i].name);

					if (oAssoc) {
						mResult[aNavProps[i].name] = this._convertMultiplicity(oAssoc.multiplicity);
					}
				}
			}

			return mResult;
		},

		/**
		 * @override
		 */
		_getNavigationPropertyValue: function (oData, sNavPropName, sMultiplicity) {
			if (oData[sNavPropName]) {
				if (oData[sNavPropName].__deferred !== undefined) {
					return undefined;
				} else if (sMultiplicity === "1") {
					return oData[sNavPropName];
				} else {
					return oData[sNavPropName].results;
				}
			}

			return undefined;
		},

		/* ------------------------------- public ------------------------------- */

		/**
		 * @override
		 */
		facadeRead: function (sKey, mUrlParameters, oContext, aFilters, fnSuccess, fnError,
			sGroupId, bSuppressListeners) {
			return new Promise(function (fnResolve, fnReject) {
				this.getOriginModel().read(sKey, {
					urlParameters: mUrlParameters,
					context: oContext,
					filters: aFilters,
					groupId: sGroupId,
					success: function (oData) {
						var oPathInfo = this._determinePathInfo(sKey, oContext);

						this._store({
							root: oData
						}, oPathInfo, bSuppressListeners);

						if (fnSuccess) {
							fnSuccess(oData);
						}

						fnResolve(oData);
					}.bind(this),
					error: function (oError) {
						if (fnError) {
							fnError(oError);
						}

						fnReject(oError);
					}
				});
			}.bind(this));
		},

		/**
		 * @override
		 */
		facadeUpdate: function (sKey, oData, sChangeSetId, mUrlParameters, oContext, fnSuccess, fnError, 
				sGroupId, sETag, oHeaders, bRefreshAfterChange, bSuppressListeners) {
				return new Promise(function (fnResolve, fnReject) {
					this.getOriginModel().update(sKey, oData, {
						urlParameters: mUrlParameters,
						context: oContext,
						refreshAfterChange: !!bRefreshAfterChange,
						groupId: sGroupId,
						changeSetId: sChangeSetId,
						success: function (oData) {
							var oPathInfo = this._determinePathInfo(sKey, oContext);
	
							this._store({
								root: oData
							}, oPathInfo, bSuppressListeners);
	
							if (fnSuccess) {
								fnSuccess(oData);
							}
	
							fnResolve(oData);
						}.bind(this),
						error: function (oError) {
							if (fnError) {
								fnError(oError);
							}
	
							fnReject(oError);
						}
					});
				}.bind(this));
			},

		/**
		 * @override
		 */
		facadeCallFunction: function (sFunction, mUrlParameters, changeSetId, sGroupId, sHTTPMethod) {
			return new Promise(function (fnResolve, fnReject) {
				this.getOriginModel().callFunction(sFunction, {
					method: sHTTPMethod ? sHTTPMethod : "POST",
					urlParameters: mUrlParameters,
					success: fnResolve,
					error: fnReject,
					changeSetId: changeSetId,
					groupId: sGroupId
				});
			}.bind(this));
		},

		/**
		 * @override
		 */
		facadeCreate: function (sKey, mContextData, sChangeSetId) {
			return new Promise(function (fnResolve, fnReject) {
				this.getOriginModel().create(sKey, mContextData, {
					success: fnResolve,
					error: fnReject,
					changeSetId: sChangeSetId
				});
			}.bind(this));
		},

		/**
		 * @override
		 */
		createKey: function (sSet, oKey) {
			return this.getOriginModel().createKey(sSet, oKey);
		},

		/**
		 * @override
		 */
		getKey: function (vValue) {
			return this.getOriginModel().getKey(vValue);
		},

		/**
		 * @override
		 */
		setDeferredGroup: function (sGroupId) {
			var aDeferredGroups = this.getOriginModel().getDeferredGroups();

			if (!aDeferredGroups) {
				aDeferredGroups = [];
			}

			aDeferredGroups.push(sGroupId);
			this.getOriginModel().setDeferredGroups(aDeferredGroups);
		},

		/**
		 * @override
		 */
		submitBatch: function (sGroupId) {
			return new Promise(function (fnResolve, fnError) {
				this.getOriginModel().submitChanges({
					groupId: sGroupId,
					success: function (oData) {
						fnResolve(oData);
					},
					error: function (oError) {
						fnError(oError);
					}
				});
			}.bind(this));
		},

		/* ------------------------------- private ------------------------------- */
		/**
		 * Event handler called when batch request is completed.
		 * Handles error messages and exceptions
		 * 
		 * @param {sap.ui.base.Event} oEvent - batch response data
		 * @private
		 */
		_onBatchRequestCompleted: function (oEvent) {
			var aRequests = oEvent.getParameters().requests;
			var oBatchResponse = oEvent.getParameters().response;

			// Only display dialog if errors are actually there and if a dialog already exists,
			// add them (no new dialog then)
			if (ODataV2ErrorHelper.batchHasErrorMessages(aRequests, oBatchResponse, Helper.requestIsFromConfiguration)) {
				var aNewMessages = ODataV2ErrorHelper.getBatchErrorMessages(
					aRequests, oBatchResponse, Helper.requestIsFromConfiguration);

				var oBusinessMessageDetails = ODataV2ErrorHelper.getBusinessExceptionDetails(aNewMessages);
				if (oBusinessMessageDetails && Toggle.isActive("IDEA_CONFIGURE_BOM_EXPL_ERROR", this)) {
					var oAppEvent = AppEvents.VCHCLF_BUSINESS_EXCEPTION;
					oAppEvent.publish({
						propertyRef: oBusinessMessageDetails.propertyref,
						message: oBusinessMessageDetails.message
					});
				} else {
					this.displayErrorMessages(aNewMessages);
				}
			}
		},

		/**
		 * Retrieves the entity type definition for the given entity set from the meta-model
		 * @param {string} sSetName - EntitySet Name
		 * @return {object} - the entity type definition as existing in meta model
		 */
		_getEntityTypeDefinition: function (sSetName) {
			var oMetaModel = this.getOriginModel().getMetaModel();
			var sType = oMetaModel.getODataEntitySet(sSetName).entityType;
			var oEntity = oMetaModel.getODataEntityType(sType);

			return oEntity;
		},

		/**
		 * Converts the given multiplicity from meta model into (1 or N)
		 * @param {string} sMultiplicity - multiplicity
		 * @return {string} the multiplicity as string
		 */
		_convertMultiplicity: function (sMultiplicity) {
			return sMultiplicity === "0..1" ? "1" : sMultiplicity;
		}
	});
});
