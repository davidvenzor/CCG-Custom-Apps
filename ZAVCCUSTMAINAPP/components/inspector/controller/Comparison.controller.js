/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/ValueState",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/EventProvider",
	"sap/i2d/lo/lib/zvchclfz/common/util/XMLFragmentCache",
	"sap/i2d/lo/lib/zvchclfz/common/util/Logger",
	"sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/ui/core/CustomData",
	"sap/i2d/lo/lib/zvchclfz/common/type/InspectorMode",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/ComparisonFormatter"
	// eslint-disable-next-line max-params
], function (Controller, ODataModel, JSONModel, ValueState, Filter, FilterOperator, MessageBox, InspectorModel,
	EventProvider, XMLFragmentCache, Logger, Constants, CustomData, InspectorMode, ComparisonFormatter) {
	"use strict";

	return Controller.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.controller.Comparison", {

		_formatter: ComparisonFormatter,

		/**
		 * Controller lifecycle method which is called when the controller becomes initialized
		 * @public
		 */
		onInit: function () {
			EventProvider.attachResetComparison(this.onResetComparison, this);
			EventProvider.attachInitComparison(this.onInitComparison, this);
			EventProvider.attachRestrictComparison(this.onRestrictComparison, this);

			var oJsonModel = new JSONModel();

			oJsonModel.setProperty("/hasError", false);

			this.getView().setBusyIndicatorDelay(0);
			this.getView().setModel(oJsonModel);
		},

		/**
		 * Controller lifecycle method which is called when the controller becomes destroyed
		 * @public
		 */
		onExit: function () {
			EventProvider.detachResetComparison(this.onResetComparison, this);
			EventProvider.detachInitComparison(this.onInitComparison, this);
			EventProvider.detachRestrictComparison(this.onRestrictComparison, this);
		},

		/**
		 * Handler for the component event 'RestrictComparison'
		 * @param {sap.ui.base.Event} oEvent - the event object
		 * @public
		 */
		onRestrictComparison: function (oEvent) {
			if (InspectorModel.getProperty("/isComparisonRestrictionActive")) {
				var oConfigurationInstance = oEvent.getParameter("oConfigurationInstance");

				var oInstanceIdFilter = null;

				// only in non-root case create an instanceId filter
				if (oConfigurationInstance.ParentInstanceId !== oConfigurationInstance.InstanceId) {
					oInstanceIdFilter = new Filter({
						path: "InstanceId",
						operator: FilterOperator.EQ,
						value1: parseInt(oConfigurationInstance.InstanceId, 10)
					});
				}

				this.getView().byId("diffTree").getBinding("items").filter(oInstanceIdFilter);
			}
		},

		/**
		 * Handler for the 'InitComparison' event of the EventProvider
		 * @param {sap.ui.base.Event} oEvent - the event object
		 * @public
		 */
		onInitComparison: function (oEvent) {
			var sContextId = oEvent.getParameter("configurationContextId");
			var sSampleDataPath = oEvent.getParameter("sampleDataPath");

			if (!this.sContextId || this.sContextId !== sContextId) {
				this.sContextId = sContextId;
				this._refresh(sSampleDataPath, sContextId);
			}
		},

		/**
		 * Handler for the 'ResetComparison' event of the EventProvider
		 * @param {sap.ui.base.Event} oEvent - the event object
		 * @public
		 */
		onResetComparison: function (oEvent) {
			this.getView().byId("diffTree").getBinding("items").filter(null);
		},

		/**
		 * Event handler which is invoked when the item description is pressed
		 * @param {sap.ui.base.Event} oEvent - the event object
		 * @public
		 */
		onItemDescriptionPressed: function (oEvent) {
			var oDiffItem = oEvent.getSource().getBindingContext().getObject();
			var oPromise;
			if (oDiffItem.DiffItemType === 1) {
				oPromise = new Promise(function(fnResolve, fnReject) {
					var sPath = this._createInstancePath(oDiffItem);
					fnResolve(sPath);
				}.bind(this));
			} else {
				oPromise = this._createCsticPath(oDiffItem);
			}

			/* enable action sheet when more actions are needed
			 * 
			var oActionSheet = XMLFragmentCache.createFragment(
				"vchclf_diff_settings_popover",
				"sap/i2d/lo/lib/zvchclfz/components/inspector/fragment/ComparisonCsticActionSheet",
				this);
			
			var oLocalSheetModel = new JSONModel({
				diffItemType: oDiffItem.DiffItemType,
				path: sPath
			});

			this.getView().addDependent(oActionSheet);
			oActionSheet.setModel(oLocalSheetModel, "comparisonActionSheet");
			oActionSheet.openBy(oEvent.getSource());
			*/
			
			oPromise.then(function(sPath) {
				if (sPath) {
					this._inspect(oDiffItem.DiffItemType, sPath);
				} else {
					var oRb = this.getOwnerComponent().getModel("i18n").getResourceBundle();
					MessageBox.error(oRb.getText("vchclf_cstic_does_not_exist", [oDiffItem.CsticId]));
				}
			}.bind(this));	
		},
		
		/**
		 * Resolves an instance path to a BOMNode path
		 * @param {string} sInstancePath - the path to instance entity in odata model
		 * @return {string} the path to the dedicated navigation property BOMNodes of the ConfigurationContextSet
		 * @private
		 */
		_resolveToBOMNodePath: function(sInstancePath) {
			var oConfigurationComponent = this.getOwnerComponent().getParent();
			var oDataModel = oConfigurationComponent.getModel("vchclf");
			var oInstance = oDataModel.getProperty(sInstancePath);
			
			var oData = oDataModel.getData();
			var oBomCfgInstance;
			for (var p in oData) {
				if (p.indexOf("BOMNodeSet") > -1) {
					oBomCfgInstance = oDataModel.getProperty("/" + p + "/to_ConfigurationInstance");
					if (oBomCfgInstance && oBomCfgInstance.ContextId && 
						oBomCfgInstance.ContextId === oInstance.ContextId && 
						oBomCfgInstance.InstanceId === oInstance.InstanceId) {
						
						return "/ConfigurationContextSet('" + oInstance.ContextId + "')/BOMNodes" + p.replace("BOMNodeSet","");
					}
				}
			}
			return null;
		},
		
		/**
		 * Creates the Cstic path in vchclf model for the given diff item
		 * @param {object} oDiffItem - the diff item as returned from service
		 * @private
		 * @return {Promise} a promise which is resolved with the path to cstic after it is ensured that it has been loaded into the ODataModel - no path is contained if cstic not found
		 */
		_createCsticPath: function(oDiffItem) {
			return new Promise(function(fnResolve, fnReject) {
				var oConfigurationComponent = this.getOwnerComponent().getParent();
				
				var oFacadeModel = oConfigurationComponent.getModel("vchclf");
	
				var oInstance = oFacadeModel.getProperty(this._createInstancePath(oDiffItem), null, true);
				var aGroups = oInstance.CharacteristicsGroups.results;

				if (aGroups && aGroups.length > 0) {
					// resolves with the first group where the cstic exists - deferred groups are re-loaded
					this._ensureCsticLoaded(aGroups, oDiffItem.CsticId).then(function(oCstic) {
						fnResolve(oCstic ? "/" + oFacadeModel.getKey(oCstic) : undefined);
					}.bind(this));
				} else {
					fnResolve();
				}
			}.bind(this));
		},
		
		/**
		 * Ensures that the given characteristic is loaded and exists in the ODataModel
		 * @param {array} aGroups - an array of cstic group entity objects
		 * @param {string} sCsticId - the characteristic id
		 * @private
		 * @return {Promise} a promise which is resolved when it is ensured that the specified characteristic has been loaded into the data model - the carried data 
         * object is the characteristic entity - if not found, it is resolved with undefined
		 */
		_ensureCsticLoaded: function(aGroups, sCsticId) {
			var oConfigurationComponent = this.getOwnerComponent().getParent();
			var oFacadeModel = oConfigurationComponent.getModel("vchclf");
			var sKey;
			var iGroupsToLoadCount;
			return new Promise(function(fnResolve, fnReject) {
				var aResult;
				var aGroupsToLoad = [];
				// Characteristics
				for (var i=0; i < aGroups.length; i++) {
					// cstics of group already loaded
					if (aGroups[i].Characteristics.results) {
						aResult = aGroups[i].Characteristics.results.filter(function(oCstic) {
							return oCstic.CsticId == sCsticId;
						});
						if (aResult.length > 0) {
							fnResolve(aResult[0]);
						}
					} else {
						aGroupsToLoad.push(aGroups[i]);
					}
				}
				iGroupsToLoadCount = aGroupsToLoad.length;
				if (iGroupsToLoadCount > 0) {
					// only load groups if cstic not yet found
					for (var j=0; j < aGroupsToLoad.length; j++) {
						sKey = oFacadeModel.getKey(aGroupsToLoad[j]);
						oFacadeModel.facadeRead("/" + sKey + "/Characteristics", null, null, [new Filter({
									path: "CsticId",
								    operator: FilterOperator.EQ,
								    value1: sCsticId
							})]
						).then(function(oData) {
							iGroupsToLoadCount--;
							aResult = oData.results.filter(function(oCstic) {
								return oCstic.CsticId == sCsticId;
							});
							if (aResult.length > 0) {
								fnResolve(aResult[0]);
							} else if (iGroupsToLoadCount === 0) {
								// cstic also not found in reloaded groups
								fnResolve();
							}
						}.bind(this));
					}	
				} else {
					// cstic not found
					fnResolve();
				}
			}.bind(this));
		},
		
		/**
		 * Creates the instance path in vchclf model for the given instance id
		 * @param {object} oDiffItem - the diff item as returned from service
		 * @private
		 * @return {string} the path to config instance
		 */
		_createInstancePath: function(oDiffItem) {
			var oConfigurationComponent = this.getOwnerComponent().getParent();

			// determine group of diff item
			var sInstanceKey = oConfigurationComponent.getModel("vchclf").createKey("ConfigurationInstanceSet", {
				ContextId: this.sContextId,
				InstanceId: oDiffItem.InstanceId + ""
			});		
			
			return "/" + sInstanceKey;
		},
		
		/**
		 * Shows the config instance as represented by the object resolved from the given path
		 * @param {string} sPath - path pointing to config object; instance or cstic
		 * @return {Promise} returns a Promise that is resolved when the configuration for the target instance is shown
		 */
		_showConfigInstance: function(sPath) {
			var oConfigurationComponent = this.getOwnerComponent().getParent();
			var sRootBindingPath = oConfigurationComponent.getValuationComponent().getRootBindingPath();
			var oDataModel = oConfigurationComponent.getModel("vchclf");
			var oExpectedInstance = oDataModel.getProperty(sPath);
			var oCurrentInstance = oDataModel.getProperty(sRootBindingPath);
			if (oCurrentInstance.InstanceId !== oExpectedInstance.InstanceId) {
				return oConfigurationComponent.updateInstance(oExpectedInstance);
			} else {
				return Promise.resolve();
			}
		},

		/**
		 * Event handler of the 'inspect' action located in the action sheet
		 * @param {sap.ui.base.Event} oEvent - the event object
		 * @public
		 */
		onActionSheetInspectPressed: function (oEvent) {
			var oSheet = oEvent.getSource();
			var oSheetModel = oSheet.getModel("comparisonActionSheet");
			
			var iDiffItemType = oSheetModel.getProperty("/diffItemType");
			var sPath = oSheetModel.getProperty("/path");
			
			this._inspect(iDiffItemType, sPath);
		},
		
		/**
		 * Opens the inspector for the given object described by the diffItemType and its path - the object is an instance or characteristic
		 * @param {int} iDiffItemType - type for kind of object determination
		 * @param {string} sPath - path to the object in odata model
		 * @private
		 */
		_inspect: function(iDiffItemType, sPath) {
			this._showConfigInstance(sPath).then(function() {
				if (iDiffItemType !== 1) {
					this.getOwnerComponent().inspectObject(sPath, InspectorMode.objectType.Characteristic);
				} else {
					this.getOwnerComponent().inspectObject(
						this._resolveToBOMNodePath(sPath),
						InspectorMode.objectType.BOMComponent);
				}
			}.bind(this));
		},

		/**
		 * Event handler of the 'Show in config' action located in the action sheet
		 * @param {sap.ui.base.Event} oEvent - the event object
		 * @public
		 */
		onActionSheetShowInConfigPressed: function (oEvent) {
			var oSheet = oEvent.getSource();
			var oSheetModel = oSheet.getModel("comparisonActionSheet");
			
			var iDiffItemType = oSheetModel.getProperty("/diffItemType");
			var sPath = oSheetModel.getProperty("/path");
			
			this._showConfigInstance(sPath).then(function() {
				if (iDiffItemType !== 1) {
					var oConfigurationComponent = this.getOwnerComponent().getParent();
					oConfigurationComponent.getValuationComponent().highlightCharacteristic(sPath);
				}
			}.bind(this));
		},

		/**
		 * Event handler of the search button
		 * @param {sap.ui.base.Event} oEvent - the event object
		 * @public
		 */
		onSearchPressed: function (oEvent) {
			var sQuery = oEvent.getParameter("query");

			var oCombinedFreeTextFilter = null;

			if (sQuery !== "") {
				var aFilters = [];

				aFilters.push(new Filter({
					path: "ComputedItemDescription",
					operator: "Contains",
					value1: sQuery
				}));
				aFilters.push(new Filter({
					path: "ComputedDiffTypeText",
					operator: "Contains",
					value1: sQuery
				}));
				aFilters.push(new Filter({
					path: "ComputedValueFromText",
					operator: "Contains",
					value1: sQuery
				}));
				aFilters.push(new Filter({
					path: "ComputedValueToText",
					operator: "Contains",
					value1: sQuery
				}));

				oCombinedFreeTextFilter = new Filter({
					filters: aFilters,
					and: false
				});
			}

			this.getView().byId("diffTree").getBinding("items").filter(oCombinedFreeTextFilter);
		},

		/**
		 * Retrieves the current ETO Status from the configuration component
		 * @return {string} the ETO Status
		 * @private
		 */
		_getEtoStatus: function () {
			return this.getOwnerComponent().getParent().getBindingContext("vchclf").getObject().EtoStatus;
		},

		/**
		 * Refreshes the differences data by invoking the <code>CalculateDifferences</code> function import
		 * @param {string} sSampleDataPath - path to a JSON file with sample data
		 * @param {string} sContextId - the context id
		 * @private
		 */
		_refresh: function (sSampleDataPath, sContextId) {
			try {
				if (sSampleDataPath) {
					// for testing purposes
					// "sap/i2d/lo/lib/zvchclfz/components/inspector/controller/DiffSampleData.json")
					var sUrl = sap.ui.require.toUrl(sSampleDataPath);
					var oJsonModel = this.getView().getModel();

					oJsonModel.loadData(sUrl);
					oJsonModel.dataLoaded().then(function () {
						this.getView().getModel().setProperty("/hasError", false);
						var aDiffItems = this.getView().getModel().getProperty("/diffItems");

						this._convertData(aDiffItems, sContextId);
					}.bind(this));
				} else {
					var sEtoStatus = this._getEtoStatus();
					var sSourceRef = InspectorModel.getSupportedEtoStatusesForComparison()[sEtoStatus];

					if (!sSourceRef) {
						throw Error("No SourceRef defined for ETO status '" + sEtoStatus + "'");
					}

					var oDataModel = this.getOwnerComponent().getModel("vchclf");

					var mUrlParameters = {
						ContextId: this.sContextId,
						SourceRef: sSourceRef,
						TargetRef: Constants.DIFF_REF_TYPE.CURRENT
					};

					this.getView().getModel().setProperty("/hasError", false);
					this.getView().setBusy(true);
					oDataModel.facadeCallFunction("/CalculateDifferences", mUrlParameters, null, null, "GET").
					then(function (oData) {
						this._convertData(oData.results, sContextId);
						this.getView().setBusy(false);
					}.bind(this)).
					catch(function (oError) {
						this.getView().getModel().setProperty("/hasError", true);
						Logger.logErrorStack(oError, this);
						this.getView().setBusy(false);
					}.bind(this));
				}
			} catch (oErr) {
				this.getView().getModel().setProperty("/hasError", true);
				Logger.logErrorStack(oErr, this);
			}
		},

		/**
		 * Converts the given array of diff items into a hierarchical data structure
		 * for the tree table and stores it to the local JSON model
		 * @param {array} aDiffItems array of diff items as returned from the VCHCLF odata service
		 * @param {string} sContextId the contextId for which the data has been converted
		 * @private
		 */
		_convertData: function (aDiffItems, sContextId) {

			// 1. sort diff items by DiffItemType
			var oSortedDiffs = this._sortDiffItemsAndComputeDescription(aDiffItems);

			// 2. a) aggregate values per cstic (multi values)
			var mCstic2Values = this._aggregateCsticValues(oSortedDiffs.aDiffItemsValue);

			// 2. b) re-compute diffType for multi values
			this._recomputeDiffTypeAndDescriptionForMultiValueChanges(mCstic2Values);

			// 3. create the instance diffs tree
			var aResultItems = this._buildInstancesTree(oSortedDiffs, mCstic2Values);

			this.getView().getModel().getData().items = [];
			this.getView().getModel().setProperty("/items", aResultItems);
			EventProvider.fireComparisonDataConverted({
				items: aResultItems,
				contextId: sContextId
			});
		},

		/**
		 * Sorts the given array of diff items according to their DiffItemType
		 * @param {array} aDiffItems - array of diff items as returned from the VCHCLF data service
		 * @return {object} - an object with the following properties:
		 * - mDiffItemsInstance: a map containing the instance diffs; key is the InstanceId
		 * - aDiffItemsGroup: an array containing the group diffs
		 * - aDiffItemsCstic: an array containing the cstic diffs
		 * - aDiffItemsValue:: an array containing the value diffs
		 * @private
		 */
		_sortDiffItemsAndComputeDescription: function (aDiffItems) {
			var oResult = {
				mDiffItemsInstance: {},
				aDiffItemsGroup: [],
				aDiffItemsCstic: [],
				aDiffItemsValue: []
			};

			if (!$.isArray(aDiffItems)) {
				return oResult;
			}

			for (var i = 0; i < aDiffItems.length; i++) {
				switch (aDiffItems[i].DiffItemType) {
					// instance
					case 1: {
						// initialize children array
						aDiffItems[i].items = [];
						oResult.mDiffItemsInstance[aDiffItems[i].InstanceId] = aDiffItems[i];
						break;
					}

					case 2: {
						oResult.aDiffItemsGroup.push(aDiffItems[i]);
						break;
					}

					case 3: {
						oResult.aDiffItemsCstic.push(aDiffItems[i]);
						break;
					}

					case 4: {
						oResult.aDiffItemsValue.push(aDiffItems[i]);
						break;
					}

					default: {
						throw Error("Unhandled DiffItemType '" + aDiffItems[i].DiffItemType + "'.");
					}
				}

				aDiffItems[i].ComputedItemDescription = this._formatter.getItemDescription(aDiffItems[i]);
				aDiffItems[i].ComputedDiffTypeText = this._formatter.getTextForDiffType(this, aDiffItems[i].DiffType);
			}

			return oResult;
		},
		
		/**
		 * Creates a unique cstic key inside a configuration context
		 * @param {object} o - an object containing the InstanceId and CsticId as properties for building an unique cstic key
		 * @return {string} the created key
		 * @private
		 */
		_createCsticKey: function(o) {
			return o.InstanceId + "_" + o.CsticId;
		},

		/**
		 * Aggregates the given value diff items to the cstic they belong
		 * @param {array} aDiffItemsValue - array of value diff items as returned
		 *                                  from _sortDiffItemsAndComputeDescription
		 * @return {object} - a map where InstanceId_CsticId is used as key and an object with a source
		 *  				  and target array of values as value
		 * @private
		 */
		_aggregateCsticValues: function (aDiffItemsValue) {
			var mCstic2Values = {};
			var oValue;
			var sValueFrom, sValueTo, sValueIdFrom, sValueIdTo, sKey;

			// aggregate values per cstic (multi values)
			for (var i = 0; i < aDiffItemsValue.length; i++) {
				sKey = this._createCsticKey(aDiffItemsValue[i]);
				if (!mCstic2Values[sKey]) {
					oValue = {
						Source: [],
						Target: []
					};
					aDiffItemsValue[i].Values = oValue;
					mCstic2Values[sKey] = aDiffItemsValue[i];
				} else {
					oValue = mCstic2Values[sKey].Values;
				}

				sValueFrom = aDiffItemsValue[i].ValueFrom;
				sValueIdFrom = aDiffItemsValue[i].ValueIdFrom;
				sValueTo = aDiffItemsValue[i].ValueTo;
				sValueIdTo = aDiffItemsValue[i].ValueIdTo;

				// delete the original props
				delete aDiffItemsValue[i].ValueFrom;
				delete aDiffItemsValue[i].ValueIdFrom;
				delete aDiffItemsValue[i].ValueTo;
				delete aDiffItemsValue[i].ValueIdTo;

				if (sValueFrom !== "" && sValueIdFrom !== "") {
					oValue.Source.push({
						Value: sValueFrom,
						ValueId: sValueIdFrom
					});
				}

				if (sValueTo !== "" && sValueIdTo !== "") {
					oValue.Target.push({
						Value: sValueTo,
						ValueId: sValueIdTo
					});
				}
			}

			return mCstic2Values;
		},

		/**
		 * Recomputes the DiffType for the value diffs after aggregation to cstic
		 * @param {object} mCstic2Values - a map where the InstanceId_CsticId is used as key and an object with a source
		 * 								 and target array of values as value (as returned from _aggregateCsticValues
		 * @return {object} - the incoming map is returned
		 * @private
		 */
		_recomputeDiffTypeAndDescriptionForMultiValueChanges: function (mCstic2Values) {
			var fnValueIdMatch = function (elt, index, array) {
				return elt.Value === this;
			};

			// re-compute diffType for multi values
			for (var sCsticKey in mCstic2Values) {
				// added
				if (mCstic2Values[sCsticKey].Values.Source.length === 0 &&
					mCstic2Values[sCsticKey].Values.Target.length > 0) {
					mCstic2Values[sCsticKey].DiffType = 1;
					// removed
				} else if (mCstic2Values[sCsticKey].Values.Target.length === 0 &&
					mCstic2Values[sCsticKey].Values.Source.length > 0) {
					mCstic2Values[sCsticKey].DiffType = 2;
					// changed or unchanged
				} else {
					var bIsNotFound = false;
					var sValue;

					for (var i = 0; i < mCstic2Values[sCsticKey].Values.Source.length; i++) {
						sValue = mCstic2Values[sCsticKey].Values.Source[i].Value;

						if (!mCstic2Values[sCsticKey].Values.Target.some(fnValueIdMatch.bind(sValue))) {
							bIsNotFound = true;
							break;
						}
					}

					//if value is not found in target - changed - otherwise unchanged
					mCstic2Values[sCsticKey].DiffType = bIsNotFound ? 3 : 0;
					mCstic2Values[sCsticKey].ComputedDiffTypeText = this._formatter.getTextForDiffType(this, mCstic2Values[sCsticKey].DiffType);
				}
			}

			return mCstic2Values;
		},

		/**
		 * Builds from the given sorted diffs and map of cstic with value changes the instances tree
		 * (the property 'items' is used for recursion)
		 * @param {object} oSortedDiffs - an object comprising the sorted diffs as returned
		 * 							      from _sortDiffItemsAndComputeDescription
		 * @param {object} mCstic2Values - a map where the CsticId is used as key and an object with a source
		 * 								   and target array of values as value (as returned from _aggregateCsticValues
		 * @return {array} - an array of the result instance diff items
		 * @private
		 */
		_buildInstancesTree: function (oSortedDiffs, mCstic2Values) {
			var aResultItems = [];
			var i;

			for (i = 0; i < oSortedDiffs.aDiffItemsGroup.length; i++) {
				oSortedDiffs.mDiffItemsInstance[
					oSortedDiffs.aDiffItemsGroup[i].InstanceId].items.push(oSortedDiffs.aDiffItemsGroup[i]);
			}

			for (i = 0; i < oSortedDiffs.aDiffItemsCstic.length; i++) {
				oSortedDiffs.mDiffItemsInstance[
					oSortedDiffs.aDiffItemsCstic[i].InstanceId].items.push(oSortedDiffs.aDiffItemsCstic[i]);
			}

			for (var sCsticKey in mCstic2Values) {
				if (mCstic2Values.hasOwnProperty(sCsticKey)) {
					mCstic2Values[sCsticKey].ComputedValueFromText = this._formatter.getValuesFromText(
						mCstic2Values[sCsticKey].Values);
					mCstic2Values[sCsticKey].ComputedValueToText = this._formatter.getValuesToText(
						mCstic2Values[sCsticKey].Values);
					
					//mismatch in backend data when instance id is 0 (then the entry does not exist in the collected mDiffItemsInstance map
					//for now ignore these entries until backend response is corrected
					if (oSortedDiffs.mDiffItemsInstance[mCstic2Values[sCsticKey].InstanceId]) {
						oSortedDiffs.mDiffItemsInstance[mCstic2Values[sCsticKey].InstanceId].items.push(
						mCstic2Values[sCsticKey]);
					}
				}
			}

			for (var sInstanceId in oSortedDiffs.mDiffItemsInstance) {
				if (oSortedDiffs.mDiffItemsInstance.hasOwnProperty(sInstanceId)) {
					aResultItems.push(oSortedDiffs.mDiffItemsInstance[sInstanceId]);
				}
			}

			return aResultItems;
		}


	});
});
