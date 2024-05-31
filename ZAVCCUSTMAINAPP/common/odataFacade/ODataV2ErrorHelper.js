/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([
],
	function () {
		"use strict";

		/**
		 * Factory for ODataFacadeModel
		 */
		var ODataV2ErrorHelper = {

			/**
			 * Helper method to check of a batch main response and individual request responses contain errors or not.
			 * If the batch main response has an error, the individual responses are ignored. Having an error is defined
			 * by having a HTTP status code of 400 or higher.
			 *
			 * The input is directly taken from the event parameters of the "batchRequestCompleted"
			 * event of the ODataModel.
			 * The main batch response is in event parameter "response" and goes into argument "oBatchResponse"
			 * and the request  responses are taken from event parameter "requests" and go into argument "aRequests".
			 *
			 * @param {array} aRequests array of request responses taken "as-is"
			 * 								from batchRequestCompleted event parameters
			 * @param {object} oBatchResponse main batch response taken "as-is"
			 * 									from batchRequestCompleted event parameters
             * @param {function} fnFilter request filter function
			 * @return {Boolean} Indicator if errors are present within the provided inputs
			 */
			batchHasErrorMessages: function (aRequests, oBatchResponse, fnFilter) {
				return this.getBatchErrorMessages(aRequests, oBatchResponse, fnFilter).length > 0;
			},

			/**
			 * Helper method to extract error information from main batch response and individual request responses.
			 * The input format of the batch result is identical to the two methods above
			 * for "aRequests" and "oBatchResponse" arguments.
			 * In fact the check above reuses this method and just converts "have errors been extracted" to bool.
			 *
			 * Errors extracted by this method can be used with the method "createErrorDialog"
			 *  to create a dialog that is directly populated with messages instead of creating it empty
			 * and adding them by "addHTTPErrorMessagesToErrorDialog"
			 *
			 * Error information is extracted into a custom object containing the most important key info only.
			 * - statusCode: HTTP status code
			 * - message:    HTTP status message
			 * - internalMessage:     internal error message from ABAP side or Gateway
			 * - internalMessageCode: internal error code from ABAP side (message class code)
			 * - serviceId:           OData service id
			 *
			 * In some cases, only the first two fields will be provided, i.e. in case of connection timeouts or other
			 * cases in which no execution happened on server side.
			 *
			 * @param {array} aRequests array of request responses taken "as-is"
			 * 								from batchRequestCompleted event parameters
			 * @param {object} oBatchResponse main batch response taken "as-is" 
			 * 									from batchRequestCompleted event parameters
             * @param {function} fnFilter request filter function
			 * @return {Array} array of custom objects as described above containing error information.
			 * 					Empty if no errors present
			 */
			getBatchErrorMessages: function (aRequests, oBatchResponse, fnFilter) {

				// Check if entire batch failed, then no need to check the individual requests
				if (oBatchResponse && this._batchHasRelevantMessage(oBatchResponse)) {
					return [this._getErrorMessageFromResponse(oBatchResponse)];
				}
				var aMessages = [];

				if (aRequests) {
					var aFilteredRequests = aRequests.filter(fnFilter);
					aFilteredRequests.forEach(function (oRequest) {
						// Check HTTP status code and if URL is from VCH context
						if (this._requestHasRelevantMessage(oRequest)) {
							// Extract internal error information like ABAP message code if available		
							aMessages.push(this._getErrorMessageFromResponse(oRequest.response));
						}
					}.bind(this));
				}
				return aMessages;
			},
			
			/**
			 * Returns technical details for business exception with code 'vchclf_business'
			 *
			 * @public 
			 * @param {array} aMessages - an array of messages
			 * @return {object} technical details which contain code, propertyref,...
			 */
			getBusinessExceptionDetails: function(aMessages) {
				var oTechnicalDetail;
				aMessages.find(function(oMessage) {
					if (oMessage.technicalDetail) {
						for (var i=0; i < oMessage.technicalDetail.length; i++) {
							if (oMessage.technicalDetail[i].code === "vchclf_business"){
								oTechnicalDetail = oMessage.technicalDetail[i];
								return true;
							}
						}
					}
					return false;
				});
				return oTechnicalDetail;
			},

			/**
			 * Private helper to check http status code of the batch main response.
			 * Error if HTTP status code is 400 or higher or 0
			 *
			 * @private
			 * @param {object} oBatchResponse main batch response taken "as-is"
			 * 									 from batchRequestCompleted event parameters
			 * @return {Boolean} Indicator if error code is present within the provided input
			 */
			_batchHasRelevantMessage: function (oBatchResponse) {
				return oBatchResponse && oBatchResponse.statusCode >= 400;
			},

			/**
			 * Private helper to check http status code of an individual request response from a batch.
			 * Error if HTTP status code is 400 or higher or 0
			 * 
			 * @private
			 * @param {object} oRequest individual request from array of request responses taken "as-is"
			 * 							 from batchRequestCompleted event parameters
			 * @return {Boolean} Indicator if error code is present within the provided input
			 */
			_requestHasRelevantMessage: function (oRequest) {
				return oRequest &&
					oRequest.response &&
					oRequest.response.statusCode >= 400;
			},

			/**
			 * Private helper to extract error information from batch main response or individual request reponse from
			 * the array of request responses from a batch
			 * 
			 * Error information is extracted into a custom object containing the most important key info only.
			 * - statusCode: HTTP status code
			 * - message:    HTTP status message
			 * - internalMessage:     internal error message from ABAP side or Gateway
			 * - internalMessageCode: internal error code from ABAP side (message class code)
			 * - serviceId:           OData service id
             * - isBusinessException 
			 *
			 * @private
			 * @param {object} oResponse main batch response or response from an individual request response from a batch
			 * @return {object} custom object as described above containing error information
			 */
			_getErrorMessageFromResponse: function (oResponse) {
				
				var errorMessage = {
					statusCode: oResponse.statusCode,
					message: oResponse.message ? oResponse.message : oResponse.statusText
				};
				
				var sDetailText = null;
				if (oResponse.responseText) {
					sDetailText = oResponse.responseText;
				} else if (oResponse.body) {
					sDetailText = oResponse.body;
				}

				// The internal error information must be parsed into an object and should always be JSON, but on
				// hard errors, the server ignores the setting and sends XML. Internal error info can also be missing
				if (sDetailText) {
					if (sDetailText.substring(0, 1) === "{") {

						// JSON format here - Internal error information is not always filled
						var responseObject = JSON.parse(sDetailText);

						if (responseObject.error && responseObject.error.innererror) {
							var oInnerError = responseObject.error.innererror;
							errorMessage.internalMessage = responseObject.error.message.value;
							errorMessage.internalMessageCode = responseObject.error.code;

							if (oInnerError.application) {
								errorMessage.serviceId = oInnerError.application.service_id;
							}
							
							if (oInnerError.errordetails) {
								errorMessage.technicalDetail = oInnerError.errordetails;
							}
						}

					} else if (sDetailText.substring(0, 5) === "<?xml") {

						// XML format here - Internal error information is not always filled
						var oXmlParser = new DOMParser();
						var xmlDoc = oXmlParser.parseFromString(sDetailText, "text/xml");
						var messageTags = xmlDoc.getElementsByTagName("message");
						var serviceIdTags = xmlDoc.getElementsByTagName("service_id");
						var codeTags = xmlDoc.getElementsByTagName("code");

						// Internal error information is not always filled (require that all these entries exist together)
						if (messageTags.length > 0 && codeTags.length > 0 && serviceIdTags.length > 0) {
							errorMessage.internalMessage = messageTags[0].childNodes[0].textContent;
							errorMessage.internalMessageCode = codeTags[0].childNodes[0].textContent;
							errorMessage.serviceId = serviceIdTags[0].childNodes[0].textContent;
						}
					}
				}

				return errorMessage;
			}

		};

		return ODataV2ErrorHelper;

	});
