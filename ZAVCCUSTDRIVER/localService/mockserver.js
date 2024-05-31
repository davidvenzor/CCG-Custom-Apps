/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/util/MockServer",
	"sap/ui/core/message/Message",
	"sap/ui/core/message/ControlMessageProcessor"
], function(jQuery, MockServer, Message, ControlMessageProcessor) {
	"use strict";

	var oMockServer;

	return {
		
		/**
		 * Initializes the mock server.
		 * You can configure the delay with the URL parameter "serverDelay".
		 * The local mock data in this folder is returned instead of the real data for testing.
		 * @public
		 * @function
		 */
		init: function(mConfig) {
			// set up the mock server
			var sAppModulePath = "i2d/lo/app/zvchclfz/config/legacyintegration/",
				sJsonFilesModulePath = sAppModulePath + "localService/mockdata",
				sMockDataBaseUrl = jQuery.sap.getModulePath(sJsonFilesModulePath),
				mainServiceUri = "/sap/opu/odata/SAP/LO_VCHCLF_INTEGRATION_LEGACY_SRV",
				sLocalUri = "localService/metadata.xml",
				sMetadataUrl = jQuery.sap.getModulePath(sAppModulePath + sLocalUri.replace(".xml", ""), ".xml"),
				sRootUri = /.*\/$/.test(mainServiceUri) ? mainServiceUri : mainServiceUri + "/";

			mConfig = jQuery.extend({
				serverDelay: 50,
				metadataUrl: sMetadataUrl,
				rootUri: sRootUri,
				characteristicCount: null,
				mockDataBaseUrl: sMockDataBaseUrl
			}, mConfig || {});

			var oUriParameters = jQuery.sap.getUriParameters();

			var sEmptyResponse = JSON.stringify({
				d: {
					results: []
				}
			});

			oMockServer = new MockServer({
				rootUri: mConfig.rootUri
			});

			oMockServer.simulate(mConfig.metadataUrl, {
				sMockdataBaseUrl: mConfig.mockDataBaseUrl
			});
			
			oMockServer.attachBefore(sap.ui.core.util.MockServer.HTTPMETHOD.GET, function() {
				this._removeAllMessages();
				this._addMessage({
					message: "Error Message for OPA Test",
					description: "Message for testing",
					type: sap.ui.core.MessageType.Error
				});

			}.bind(this), "CharacteristicsGroupSet");

			var aRequests = oMockServer.getRequests();
			
			oMockServer.attachBefore(sap.ui.core.util.MockServer.HTTPMETHOD.GET, function(oXhr){
				if (oMockServer._sEtoStatus) {
					var aConfContextSet = oMockServer.getEntitySetData("ConfigurationContextSet");
					aConfContextSet[0].EtoStatus = oMockServer._sEtoStatus;
					aConfContextSet[2].EtoStatus = oMockServer._sEtoStatus;
					oMockServer.setEntitySetData("ConfigurationContextSet", aConfContextSet);
				}
				
				if (oMockServer._sNewConfigurationStatusDescription && oMockServer._sNewConfigurationStatusType) {
					var aConfContextSet = oMockServer.getEntitySetData("ConfigurationContextSet");
					aConfContextSet[0].StatusType = oMockServer._sNewConfigurationStatusType;
					aConfContextSet[2].StatusType = oMockServer._sNewConfigurationStatusType;
					aConfContextSet[0].StatusDescription = oMockServer._sNewConfigurationStatusDescription;
					aConfContextSet[2].StatusDescription = oMockServer._sNewConfigurationStatusDescription;
					oMockServer.setEntitySetData("ConfigurationContextSet", aConfContextSet);
					oMockServer._sNewConfigurationStatusDescription = "";
					oMockServer._sNewConfigurationStatusType = "";
				}
				
				if (oMockServer._bConfigurationLocked) {
					var aConfContextSet = oMockServer.getEntitySetData("ConfigurationContextSet");
					aConfContextSet[0].StatusType = "2";
					aConfContextSet[2].StatusType = "2";
					aConfContextSet[0].StatusDescription = "Locked";
					aConfContextSet[2].StatusDescription = "Locked";
					oMockServer.setEntitySetData("ConfigurationContextSet", aConfContextSet);
					oMockServer._bConfigurationLocked = false;
				}
			}.bind(this), "ConfigurationContextSet");

			aRequests.push({
				method: "GET",
				path: new RegExp("(.*)BOMNodes\\(\\'(.*)\\'\\)(.*)"),
				response: function(oXhr) {
					var sUrl = oXhr.url;
					var sService = sUrl.slice(0, sUrl.indexOf("ConfigurationContextSet"));
					var sEntityName = "BOMNodeSet";
					var sUrlParameter = sUrl.slice(sUrl.indexOf("BOMNodes") + 8);

					oXhr.url = sService + sEntityName + sUrlParameter;
					oMockServer.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.GET + sEntityName, {
						oXhr: oXhr,
						sUrlParameters: sUrlParameter
					});
				}
			});

			aRequests.push({
				method: "GET",
				path: new RegExp("(.*)to_ConfigurationProfile\\((.*)\\)(.*)"),
				response: function(oXhr) {
					var sUrl = oXhr.url;
					var sService = sUrl.slice(0, sUrl.indexOf("ConfigurationContextSet"));
					var sEntityName = "ConfigurationProfileSet";
					var sUrlParameter = sUrl.slice(sUrl.indexOf("to_ConfigurationProfile") + 23);

					oXhr.url = sService + sEntityName + sUrlParameter;
					oMockServer.fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.GET + sEntityName, {
						oXhr: oXhr,
						sUrlParameters: sUrlParameter
					});
				}
			});

			aRequests.push({
				method: "POST",
				path: new RegExp("CalculatePricing(.*)"),
				response: function(oXhr) {
					if (oXhr.readyState === 4) {
						return;
					}
					oXhr.respondJSON(200, {}, sEmptyResponse);
				}
			});

			aRequests.push({
				method: "POST",
				path: new RegExp("ConfigurationLock(.*)"),
				response: function(oXhr) {
					if (oXhr.readyState === 4) {
						return;
					}
					oMockServer._bConfigurationLocked = true;
					oXhr.respondJSON(200, {}, sEmptyResponse);
				}
			});

			aRequests.push({
				method: "POST",
				path: new RegExp("ConfigurationUnlock(.*)"),
				response: function(oXhr) {
					if (oXhr.readyState === 4) {
						return;
					}
					oXhr.respondJSON(200, {}, sEmptyResponse);
				}
			});
			
			aRequests.push({
				method: "POST",
				path: new RegExp("SetETOStatus(.*)"),
				response: function(oXhr) {
					if (oXhr.readyState === 4) {
						return;
					}
					this._bInitialCall = false;
					
					if (!this._bInitialCall) {
						var sStatus = oXhr.url.substring(oXhr.url.indexOf("&Status="));
						var sStatusValue = sStatus.substring(sStatus.length - 6, sStatus.length - 1);
						oMockServer._sEtoStatus = sStatusValue;
						sap.m.MessageToast.show("Handover to Engineering successfull");
					}
					this._bInitialCall = false;
					
					oXhr.respondJSON(200, {}, sEmptyResponse);
				}.bind(this)
			});
			
			aRequests.push({
				method: "POST",
				path: new RegExp("SwitchToETO(.*)"),
				response: function(oXhr) {
					if (oXhr.readyState === 4) {
						return;
					}
					if (!this._bInitialCall) {
						oMockServer._sEtoStatus = "IETST";
					}
					this._bInitialCall = false;
					oXhr.respondJSON(200, {}, sEmptyResponse);
				}.bind(this)
			});

			aRequests.push({
				method: "POST",
				path: new RegExp("TraceActivation(.*)"),
				response: function(oXhr) {
					if (oXhr.readyState === 4) {
						return;
					}
					oXhr.respondJSON(200, {}, sEmptyResponse);
				}
			});

			aRequests.push({
				method: "POST",
				path: new RegExp("ValidateConfiguration(.*)"),
				response:  function(oXhr) {
					if (oXhr.readyState === 4) {
						return;
					}
					oXhr.respondJSON(200, {}, JSON.stringify({
						d: {
							results: {
								ValidateConfiguration : {
									Success : true
								}
							}
						}
					}));
				}
			});

			oMockServer.setRequests(aRequests);

			MockServer.config({
				autoRespond: true,
				autoRespondAfter: (oUriParameters.get("serverDelay") || mConfig.serverDelay)
			});
			
			oMockServer.setETOStatus = function(sEtoStatus){
				oMockServer._sEtoStatus = sEtoStatus;
			};
			
			oMockServer.setConfigurationStatus = function(sStatusDescription, sStatusType){
				oMockServer._sNewConfigurationStatusDescription = sStatusDescription;
				oMockServer._sNewConfigurationStatusType = sStatusType;
			};

			oMockServer.start();
			jQuery.sap.log.info("Running the app with mock data");
			return oMockServer;
		},
		
		/**
		 * Removes all messages if any exist
		 * @return {boolean} returns true if any messages were removed 
		 * @private
		 * @function
		 */
		_removeAllMessages: function() {
			var oMessageManager = sap.ui.getCore().getMessageManager();
			var iMessageCounter = oMessageManager.getMessageModel().getProperty("/").length;
			if (iMessageCounter > 0) {
				oMessageManager.removeAllMessages();
				return true;
			}
			return false;
		},

		/**
		 * Adds a new massage to the massage manager
		 * @param {object} [oMessage] contains attributes that are needed for a message
		 * @param {string} [oMessage.message] Message text equals Short Text
		 * @param {string} [oMessage.description] Message description
		 * @param {sap.ui.core.MessageType} [oMessage.type] Message type 
		 * @private
		 * @function
		 */
		_addMessage: function(oMessage) {
			var oMessageProcessor = new ControlMessageProcessor();
			var oMessageManager = sap.ui.getCore().getMessageManager();
			oMessageManager.addMessages(
				new Message({
					description: oMessage.description,
					message: oMessage.message,
					type: oMessage.type,
					processor: oMessageProcessor
				})
			);
		},

		/**
		 * returns the mockserver of the app, should be used in integration tests
		 * @returns {sap.ui.core.util.MockServer} the mockserver instance
		 * @public
		 * @function
		 */
		getMockServer: function() {
			return oMockServer;
		}
	
	};

});