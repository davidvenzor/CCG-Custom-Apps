/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/base/ManagedObject",
	"jquery.sap.global",
	"sap/ui/core/util/MockServer",
	"sap/i2d/lo/lib/zvchclfz/common/localService/MockserverHelper"
], function (ManagedObject, jQuery, MockServer, MockserverHelper) {
	"use strict";

	// since the mockserver supports "search" we need to remove our workaround search with "skip/top-Characteristics" otherwise the cstics are not loaded
	// TODO: must be removed once we have replaced the search with the OData supported values
	var fnOriginOrderQueryOptions = MockServer.prototype._orderQueryOptions;

	MockServer.prototype.setEntitySetData = function (sEntitySetName, aData) {
		if (this._oMockdata && this._oMockdata.hasOwnProperty(sEntitySetName)) {
			this._oMockdata[sEntitySetName] = aData;
		} else {
			jQuery.sap.log.error("Unrecognized EntitySet name: " + sEntitySetName);
		}
	};

	var oMockServer = ManagedObject.extend("sap.i2d.lo.lib.vchclf.common.localService.Mockserver", {
		metadata: {
			properties: {
				config: {
					type: "object"
				},
				useFilter: {
					type: "boolean",
					defaultValue: false
				},
				variantMatchingIndicator: {
					type: "float",
					defaultValue: 0
				},
				pricingActive: {
					type: "boolean",
					defaultValue: true
				},
				characteristicCount: {
					type: "float"
				},
				groupCount: {
					type: "float"
				},
				useSkipTop: {
					type: "boolean",
					defaultValue: false
				},
				createProductVariantWithPricingError: {
					type: "boolean",
					defaultValue: false
				},
				etoStatus: {
					type: "string"
				},
				etoStatusDescription: {
					type: "string"
				},
				activeToggles: {
					type: "array"
				}
			}
		},

		/**
		 * Initializes the mock server.
		 * You can configure the delay with the URL parameter "serverDelay".
		 * The local mock data in this folder is returned instead of the real data for testing.
		 * @public
		 * @function
		 */
		init: function (mInitialConfig) {

			// set up the mock server
			var sAppModulePath = "sap/i2d/lo/lib/zvchclfz/common/",
				mainServiceUri = "/sap/opu/odata/SAP/LO_VCHCLF",
				sLocalUri = "localService/metadata.xml",
				sLocalDataUri = "localService/mockdata/data.json",
				sMetadataUrl = jQuery.sap.getModulePath(sAppModulePath + sLocalUri.replace(".xml", ""), ".xml"),
				sDataUrl = jQuery.sap.getModulePath(sAppModulePath + sLocalDataUri.replace(".json", ""), ".json"),
				sRootUri = /.*\/$/.test(mainServiceUri) ? mainServiceUri : mainServiceUri + "/";

			var mConfig = jQuery.extend({
				serverDelay: 50,
				rootUri: sRootUri
			}, mInitialConfig || {});

			this._oMockServer = new MockServer({
				rootUri: mConfig.rootUri
			});
			this._orderQueryOptions();

			this._oMockServerHelper = new MockserverHelper("mockserverHelper", {
				mockserver: this._oMockServer,
				mockserverConfig: mConfig,
				localMockserver: this
			});

			this._oMockServer.simulate(sMetadataUrl, sDataUrl);

			// configure mock server with a delay of 1s
			var oUriParameters = jQuery.sap.getUriParameters();
			MockServer.config({
				autoRespond: true,
				autoRespondAfter: (oUriParameters.get("serverDelay") || mConfig.serverDelay)
			});

			this._addRequiredFunctionCalls();
			this._attachRequestListeners();
		},

		start: function () {
			this._oMockServer.start();
		},
		
		stop: function() {
			this._oMockServer.stop();
		},

		setConfig: function (oConfig) {
			this.setProperty("config", oConfig);
			this.restart(oConfig);
		},

		restart: function (oConfig) {
			this._oMockServer.destroy();
			this._oMockServerHelper.destroy();
			this.init(oConfig || {});
			this.start();
		},

		/**
		 * returns the mockserver of the app, should be used in integration tests
		 * @returns {sap.ui.core.util.MockServer} the mockserver instance
		 * @public
		 * @function
		 */
		getMockServer: function () {
			return this._oMockServer;
		},

		exit: function () {
			this._oMockServer.destroy();
			this._oMockServerHelper.destroy();
			delete this._oMockServer;
			delete this._oMockServerHelper;
		},

		_orderQueryOptions: function () {
			this._oMockServer._orderQueryOptions = function (aUrlParams) {
				var iLength = aUrlParams.length;
				for (var i = iLength - 1; i > 0; i--) {
					var sUrlParam = aUrlParams[i];
					if (sUrlParam.indexOf("search") === 0) {
						aUrlParams.splice(i, 1);
					}
					if (!this.getUseSkipTop()) {
						if (sUrlParam.indexOf("$top=30") === 0) {
							aUrlParams.splice(i, 1);
						}
						if (sUrlParam.indexOf("$skip=0") === 0) {
							aUrlParams.splice(i, 1);
						}
					}
					if (this._shallFilterBeIgnored(sUrlParam)) {
						aUrlParams.splice(i, 1);
					}
				}
				return fnOriginOrderQueryOptions.call(this, aUrlParams);
			}.bind(this);
		},

		_attachRequestListeners: function () {
			var oMockServerHelper = this._oMockServerHelper;
			var oHTTPMethods = sap.ui.core.util.MockServer.HTTPMETHOD;
			this._oMockServer.attachAfter(oHTTPMethods.GET,
				oMockServerHelper.afterGetClassificationContext.bind(oMockServerHelper), "ClassificationContextSet");
			this._oMockServer.attachBefore(oHTTPMethods.POST,
				oMockServerHelper.beforeCreateContextSet.bind(oMockServerHelper), "ConfigurationContextSet");
			this._oMockServer.attachBefore(oHTTPMethods.GET,
				oMockServerHelper.beforeGetContextSet.bind(oMockServerHelper), "ConfigurationContextSet");
			this._oMockServer.attachAfter(oHTTPMethods.GET,
				oMockServerHelper.afterGetContextSet.bind(oMockServerHelper), "ConfigurationContextSet");
			this._oMockServer.attachBefore(oHTTPMethods.GET,
				oMockServerHelper.beforeGetInstanceSet.bind(oMockServerHelper), "ConfigurationInstanceSet");
			this._oMockServer.attachAfter(oHTTPMethods.GET,
				oMockServerHelper.afterGetInstanceSet.bind(oMockServerHelper), "ConfigurationInstanceSet");
			this._oMockServer.attachBefore(oHTTPMethods.GET,
				oMockServerHelper.beforeGetCharacteristicGroups.bind(oMockServerHelper), "CharacteristicsGroupSet");
			this._oMockServer.attachAfter(oHTTPMethods.GET,
				oMockServerHelper.afterGetCharacteristicGroups.bind(oMockServerHelper), "CharacteristicsGroupSet");
			this._oMockServer.attachAfter(oHTTPMethods.GET,
				oMockServerHelper.afterGetVariantValuationDifference.bind(oMockServerHelper), "ConfigurationMaterialVariantSet");
			this._oMockServer.attachAfter(oHTTPMethods.GET,
				oMockServerHelper.afterGetRoutingSet.bind(oMockServerHelper), "RoutingSet");
			this._oMockServer.attachAfter(oHTTPMethods.GET,
				oMockServerHelper.afterGetTraceEntrySet.bind(oMockServerHelper), "TraceEntrySet");
			this._oMockServer.attachBefore(oHTTPMethods.GET,
				oMockServerHelper.beforeGetInconsistencyInformationSet.bind(oMockServerHelper), "InconsistencyInformationSet");
			this._oMockServer.attachAfter(oHTTPMethods.GET,
				oMockServerHelper.afterGetInconsistencyInformationSet.bind(oMockServerHelper), "InconsistencyInformationSet");
			this._oMockServer.attachAfter(oHTTPMethods.POST,
					oMockServerHelper.afterCreateBOMNodeSet.bind(oMockServerHelper), "BOMNodeSet");
			this._oMockServer.attachAfter(oHTTPMethods.GET,
				oMockServerHelper.afterGetToggleSet.bind(oMockServerHelper), "ToggleSet");
		},

		_addRequiredFunctionCalls: function () {
			var aRequests = this._oMockServer.getRequests();
			var oMockServerHelper = this._oMockServerHelper;

			aRequests.push({
				method: "POST",
				path: new RegExp("CharacteristicValueAssign(.*)"),
				response: oMockServerHelper.updateCsticValue.bind(oMockServerHelper, oMockServerHelper.unassignValue, oMockServerHelper.assignValue)
			});

			aRequests.push({
				method: "POST",
				path: new RegExp("ClearCharacteristic(.*)"),
				response: oMockServerHelper.updateCsticValue.bind(oMockServerHelper, oMockServerHelper.unassignAllValues, null)
			});

			aRequests.push({
				method: "POST",
				path: new RegExp("ValidateConfiguration(.*)"),
				response: oMockServerHelper.validateConfiguration.bind(oMockServerHelper)
			});

			aRequests.push({
				method: "POST",
				path: new RegExp("DiscardConfigurationDraft(.*)"),
				response: oMockServerHelper.discardConfigurationDraft.bind(oMockServerHelper)
			});

			aRequests.push({
				method: "POST",
				path: new RegExp("ConfigurationLock(.*)"),
				response: oMockServerHelper.lockConfiguration.bind(oMockServerHelper)
			});

			aRequests.push({
				method: "POST",
				path: new RegExp("ConfigurationUnlock(.*)"),
				response: oMockServerHelper.unlockConfiguration.bind(oMockServerHelper)
			});

			aRequests.push({
				method: "POST",
				path: new RegExp("CalculatePricing(.*)"),
				response: oMockServerHelper.calculatePricing.bind(oMockServerHelper)
			});

			aRequests.push({
				method: "POST",
				path: new RegExp("ExplodeBOM(.*)"),
				response: oMockServerHelper.explodeBOM.bind(oMockServerHelper)
			});

			aRequests.push({
				method: "POST",
				path: new RegExp("ExplodeRouting(.*)"),
				response: oMockServerHelper.explodeRouting.bind(oMockServerHelper)
			});

			aRequests.push({
				method: "POST",
				path: new RegExp("ActivateTrace(.*)"),
				response: oMockServerHelper.activateTrace.bind(oMockServerHelper)
			});

			aRequests.push({
				method: "POST",
				path: new RegExp("DeactivateTrace(.*)"),
				response: oMockServerHelper.deactivateTrace.bind(oMockServerHelper)
			});

			aRequests.push({
				method: "POST",
				path: new RegExp("IsTraceActive(.*)"),
				response: oMockServerHelper.isTraceActive.bind(oMockServerHelper)
			});

			aRequests.push({
				method: "POST",
				path: new RegExp("ClearTrace(.*)"),
				response: oMockServerHelper.clearTrace.bind(oMockServerHelper)
			});

			aRequests.push({
				method: "GET",
				path: new RegExp("(.*)to_TraceEntry\\((.*)\\)(.*)"),
				response: oMockServerHelper.getTraceEntryDetail.bind(oMockServerHelper)
			});

			aRequests.push({
				method: "GET",
				path: new RegExp("(.*)to_WhereWasValueSet(.*)"),
				response: oMockServerHelper.getTraceEntriesForCharacteristic.bind(oMockServerHelper)
			});

			aRequests.push({
				method: "GET",
				path: new RegExp("(.*)to_WhereWasUsed(.*)"),
				response: oMockServerHelper.getTraceEntriesForCharacteristic.bind(oMockServerHelper)
			});

			aRequests.push({
				method: "GET",
				path: new RegExp("(.*)to_TraceCharacteristicVH(.*)"),
				response: oMockServerHelper.getTraceCharacteristicVH.bind(oMockServerHelper)
			});

			aRequests.push({
				method: "GET",
				path: new RegExp("(.*)to_TraceObjectDependencyVH(.*)"),
				response: oMockServerHelper.getTraceDependencyVH.bind(oMockServerHelper)
			});

			aRequests.push({
				method: "GET",
				path: new RegExp("(.*)BOMNodes\\?(.*)"),
				response: oMockServerHelper.getBOMNodesStructureTree.bind(oMockServerHelper)
			});

			aRequests.push({
				method: "GET",
				path: new RegExp("(.*)BOMNodes\\([^\\)]*\\)(.*)"),
				response: oMockServerHelper.getBOMNodes.bind(oMockServerHelper)
			});

			aRequests.push({
				method: "GET",
				path: new RegExp("(.*)to_OperationPRT\\((.*)\\)(.*)"),
				response: oMockServerHelper.getOperationPRT.bind(oMockServerHelper)
			});

			aRequests.push({
				method: "POST",
				path: new RegExp("ClassificationInstanceUnassign(.*)"),
				response: oMockServerHelper.unassignClass.bind(oMockServerHelper)
			});

			aRequests.push({
				method: "POST",
				path: new RegExp("ClassificationInstanceAssign(.*)"),
				response: oMockServerHelper.handleClassificationInstanceChange.bind(oMockServerHelper)
			});

			aRequests.push({
				method: "POST",
				path: new RegExp("CalculateAlternativeValues(.*)"),
				response: oMockServerHelper.calculateAlternativeValues.bind(oMockServerHelper)
			});

			aRequests.push({
				method: "GET",
				path: new RegExp("(.*)/to_StandardValues"),
				response: oMockServerHelper.getOperationStandardValues.bind(oMockServerHelper)
			});

			aRequests.push({
				method: "POST",
				path: new RegExp("CreateFullyMatchingProductVariant(.*)"),
				response: oMockServerHelper.createFullyMatchingProductVariant.bind(oMockServerHelper)
			});

			aRequests.push({
				method: "POST",
				path: new RegExp("SetPreferredVariant(.*)"),
				response: oMockServerHelper.setPreferredVariant.bind(oMockServerHelper)
			});

			aRequests.push({
				method: "POST",
				path: new RegExp("SwitchToETO(.*)"),
				response: oMockServerHelper.switchToETO.bind(oMockServerHelper)
			});

			aRequests.push({
				method: "POST",
				path: new RegExp("SetETOStatus(.*)"),
				response: oMockServerHelper.setETOStatus.bind(oMockServerHelper)
			});

			aRequests.push({
				method: "POST",
				path: new RegExp("CreateOrderBOM(.*)"),
				response: oMockServerHelper.createOrderBOM.bind(oMockServerHelper)
			});

			aRequests.push({
				method: "POST",
				path: new RegExp("DeleteBOMItem(.*)"),
				response: oMockServerHelper.deleteBOMItem.bind(oMockServerHelper)
			});

			this._oMockServer.setRequests(aRequests);
		},

		_shallFilterBeIgnored: function (sUrlParam) {
			var bIsNotAFilterParam = sUrlParam.indexOf("$filter") !== 0;
			if (bIsNotAFilterParam) {
				return false;
			}
			if (this.getUseFilter()) {
				return false;
			}

			var bIsHiddenFilter = sUrlParam.indexOf("$filter=IsHidden eq false") === 0 && sUrlParam.indexOf(
				"$filter=IsHidden eq false and ChangeTimestamp gt") !== 0;
			if (bIsHiddenFilter) {
				return false;
			}

			var bIsAPricingFilter = sUrlParam.indexOf("$filter=VariantCondition") === 0 || sUrlParam.indexOf("$filter=CondTypeId") === 0;
			if (bIsAPricingFilter) {
				return false;
			}
			var bIsVariantMatchingFilter = sUrlParam.indexOf("IsFullMatch") > 0 ||
				sUrlParam.indexOf("substringof(") > 0 && sUrlParam.indexOf(",ProductDescription)") > 0 ||
				sUrlParam.indexOf("substringof(") > 0 && sUrlParam.indexOf(",Product)") > 0;
			if (bIsVariantMatchingFilter) {
				return false;
			}
			return true;
		}

	});

	return oMockServer;

});
