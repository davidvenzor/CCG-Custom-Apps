/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/i2d/lo/lib/zvchclfz/common/util/RequestQueue"
], function (ManagedObject, RequestQueue) {
	"use strict";

	var oSaveDraftPromise = null;

	/**
	 * The Base DAO wraps the OData Model and requests
	 * 
	 * @class
	 *
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.vchclf.common.dao.BaseDAO
	 * @extends sap.ui.base.ManagedObject
	 */
	return ManagedObject.extend("sap.i2d.lo.lib.zvchclfz.common.dao.BaseDAO", { /** @lends sap.i2d.lo.lib.vchclf.common.dao.BaseDAO.prototype */
		metadata: {
			"abstract": true,
			manifest: "json",
			properties: {
				dataModel: {
					type: "sap.ui.model.Model"
				},
				/**
				 * The draft transaction controller is only available for smart templates.
				 * It can be used to save drafts.
				 */
				draftTransactionController: {
					type: "object" // sap.suite.ui.generic.template.ObjectPage.extensionAPI.DraftTransactionController throws errors when set and not available
				}
			},
			events: {
				messagesChanged: {
					parameters: {
						messages: {
							type: "object[]"
						}
					}
				}
			}
		},

		/**
		 * Sets the data model to use
		 * 
		 * @param {sap.ui.model.Model} oDataModel the used data model
		 * @public
		 */
		setDataModel: function (oDataModel) {
			var oOldDataModel = this.getDataModel();
			if (oOldDataModel) {
				oDataModel.detachMessageChange(this._onDataModelMessageChange, this);
			}
			this.setProperty("dataModel", oDataModel);
			if (oDataModel) {
				oDataModel.attachMessageChange(this._onDataModelMessageChange, this);
			}
		},

		/**
		 * Event handler. Called when the data model has new messages.
		 * @param {sap.ui.base.Event} oEvent An Event object consisting of an id, a source and a map of parameters
		 * @private
		 */
		_onDataModelMessageChange: function (oEvent) {
			var oMessageModel = sap.ui.getCore().getMessageManager().getMessageModel();
			var aMessages = oMessageModel.getData();
			var aCharacteristicMessages = this.getDataModel().getMessagesByEntity("Characteristic");

			var aMessagesToDisplay = aMessages.filter(function (oMessage1, iIndex1) {
				var bDuplicateExists = aMessages.some(function (oMessage2, iIndex2) {
					var bIsDuplicate = (iIndex1 < iIndex2 &&
						aCharacteristicMessages.indexOf(oMessage1) > -1 &&
						aCharacteristicMessages.indexOf(oMessage2) > -1 &&
						oMessage1.code === oMessage2.code &&
						oMessage1.message === oMessage2.message);
					return bIsDuplicate;
				});
				return !bDuplicateExists;
			});

			oMessageModel.setData(aMessagesToDisplay);

			this.fireEvent("messagesChanged", {
				messages: oEvent.getParameter("newMessages")
			});

		},

		/**
		 * Forces binding refresh. For server side models this should refetch the data from the server.
		 * Waits until the data is received before resolving promise.
		 * 
		 * @param {sap.ui.model.Binding} oBinding The Binding is the object, 
		 *								 which holds the necessary information for a data binding, 
		 *								 like the binding path and the binding context, 
		 *								 and acts like an interface to the model for the control, 
		 *                               so it is the event provider for changes in the data model and provides getters for accessing properties or lists.
		 * @return {Promise<Object>} A promise to the instances.
		 * @function
		 * @private
		 */
		_refreshBinding: function (oBinding, aFilter) {
			return new Promise(function (fnResolve, fnReject) {
				if (aFilter) {
					oBinding.filter(aFilter);
				} else {
					oBinding.refresh(true);
				}
				oBinding.attachEventOnce("dataReceived", function (oEvent) {
					var oData = oEvent.getParameter("data");
					if (oData && oData.results) {
						fnResolve(oData.results);
					} else {
						fnReject();
					}
				});
			});
		},

	
		/**
		 * Creates an OData key path for a given key object
		 *
		 * @param {string} sSet The entity set
		 * @param {Object} oKey The key object
		 * @return {string} the created oData key path
		 * @protected
		 */
		createKey: function (sSet, oKey) {
			return this.getDataModel().createKey(sSet, oKey);
		},

		_saveDraftIsAvailable: function () {
			var oDraftTransactionController = this.getDraftTransactionController();
			return oDraftTransactionController && typeof oDraftTransactionController.saveDraft === "function";
		},

		/**
		 * Adds the internal function sap.i2d.lo.lib.vchclf.common.dao.BaseDAO#_callFunction to the sap.i2d.lo.lib.vchclf.common.util.RequestQueue.
		 * If the DraftTransactionController (FioriElements use case) is available the function saveDraft is called.
		 * 
		 * @param {string} sFunction: name of function import
		 * @param {map} oValue: A map containing the parameters that will be passed as query strings
		 * @return {Promise<Object>} A promise to the instances.
		 * @function
		 * @protected
		 */
		callFunction: function (sFunction, oValue) {
			return new Promise(function (fnResolve, fnReject) {
				var fnAddToRequestQueue = function () {
					this.addToRequestQueue(
							this.getDataModel().facadeCallFunction
								.bind(this.getDataModel(), sFunction, oValue),
							this)
						.then(fnResolve)
						.catch(fnReject);
				}.bind(this);

				if (this._saveDraftIsAvailable()) {
					var oDraftTransactionController = this.getDraftTransactionController();
					oDraftTransactionController.saveDraft(fnAddToRequestQueue);
				} else {
					fnAddToRequestQueue();
				}
			}.bind(this));
		},

		/**
		 * Adds the internal function sap.i2d.lo.lib.vchclf.common.dao.BaseDAO#_read to the sap.i2d.lo.lib.vchclf.common.util.RequestQueue.
		 * 
		 * @param {string} sKey: A string containing the path to the data which should be retrieved. The path is concatenated to the service URL which was specified in the model constructor.
		 * @param {string} mUrlParameters: A map containing the parameters that will be passed as query strings
		 * @param {string} oContext: If specified, sPath has to be relative to the path given with the context.
		 * @param {string} aFilters: An array of filters to be included in the request URL
		 * @param {function} fnSuccess: success handler
		 * @param {function} fnError: error handler
		 * @return {Promise<Object>} A promise to the instances.
		 * @function
		 * @protected
		 */
		read: function (sKey, mUrlParameters, oContext, aFilters, fnSuccess, fnError) {
			return this.addToRequestQueue(
					this.getDataModel()
						.facadeRead
						.bind(
							this.getDataModel(), sKey, mUrlParameters, oContext, aFilters, fnSuccess, fnError),
					this);
		},

		/**
		 * Adds the internal function sap.i2d.lo.lib.vchclf.common.dao.BaseDAO#_create to the sap.i2d.lo.lib.vchclf.common.util.RequestQueue.
		 *
		 * @param {string} sKey: A string containing the path to the collection where an entry should be created.
		 *						 The path is concatenated to the service URL which was specified in the model constructor.
		 * @param {Object} mContextData: Data of the entry that should be created.
		 * @return {Promise<Object>} A promise to the instances.
		 * @function
		 * @protected
		 */
		create: function (sKey, mContextData) {
			return this.addToRequestQueue(
					this.getDataModel().facadeCreate.bind(
							this.getDataModel(), sKey, mContextData),
					this);
		},

		/**
		 * Adds the internal function sap.i2d.lo.lib.vchclf.common.dao.BaseDAO#_refreshBinding to the sap.i2d.lo.lib.vchclf.common.util.RequestQueue.
		 * 
		 * @param {sap.ui.model.Binding} oBinding The Binding is the object, 
		 *								 which holds the necessary information for a data binding, 
		 *								 like the binding path and the binding context, 
		 *								 and acts like an interface to the model for the control, 
		 *                               so it is the event provider for changes in the data model and provides getters for accessing properties or lists.
		 * @return {Promise<Object>} A promise to the instances.
		 * @function
		 * @public
		 */
		refreshBinding: function (oBinding, aFilter) {
			return this.addToRequestQueue(
					this._refreshBinding.bind(this, oBinding, aFilter),
					this);
		},

		/**
		 * Adds the given request function to the queue and starts an observer with an delayed call of 0ms.
		 * 
		 * @param {function} fnRequest is a request function to be called. The request function must return a promise.
		 * @param {object} oContext the context in which the request function should be called. When the object is an instance of
		 *							ManagedObject, then every time the request function is called, the destroy status of the object
		 *							is checked.
		 * @returns {Promise} returns a promise object of the added request function
		 * @public
		 */
		addToRequestQueue: function (fnFunction, oContext) {
			// In case save draft was called, upcoming requests need to wait until save draft is finished.
			// This ensures that all requests are added to the same batch.
			if (oSaveDraftPromise) {
				return oSaveDraftPromise.then(function () {
					return RequestQueue.add(fnFunction, oContext);
				}.bind(this));
			} else {
				return RequestQueue.add(fnFunction, oContext);
			}
		}
	});
});
