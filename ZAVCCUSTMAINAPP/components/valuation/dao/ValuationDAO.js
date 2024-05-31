/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([
	"jquery.sap.global",
	"sap/i2d/lo/lib/zvchclfz/common/dao/BaseDAO",
	"sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/i2d/lo/lib/zvchclfz/common/util/Logger",
	"sap/ui/model/Filter",
], function (jQuery, BaseDAO, Constants, Logger, Filter) {
	"use strict";

	var PAGING_AMOUNT = 30;

	var isDeferredLoaded = function (vData) {
		return vData && vData.__deferred;
	};

	/**
	 * The valuation DAO wraps the OData Model and requests
	 * 
	 * @class
	 *
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.zvchclfz.components.valuation.dao.ValuationDAO
	 * @extends sap.i2d.lo.lib.zvchclfz.common.dao.BaseDAO
	 */
	var ValuationDAO = BaseDAO.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.dao.ValuationDAO", { /** @lends sap.i2d.lo.lib.zvchclfz.components.valuation.dao.ValuationDAO.prototype */
		metadata: {
			manifest: "json",
			properties: {
				groupState: {
					type: "sap.i2d.lo.lib.zvchclfz.components.valuation.util.GroupState"
				},
				appStateModel: {
					type: "sap.i2d.lo.lib.zvchclfz.components.valuation.model.AppStateModel"
				},
				editable: {
					type: "boolean",
					defaultValue: true
				},
				showHiddenCharacteristics: {
					type: "boolean",
					defaultValue: false
				},
				valuationComponent: {
					type: "object"
				}
			},
			events: {
				groupsRequested: {
					parameters: {}
				},
				/** Returns a list of all changed characteristics after a value assignment is performed */
				groupsChanged: {
					parameters: {
						groups: {
							type: "object[]"
						}
					}
				},
				/** Returns a list of all changed characteristics after a value assignment is performed */
				characteristicsChanged: {
					parameters: {
						merge: {
							type: "boolean"
						},
						groupId: {
							type: "number"
						},
						changedCharacteristics: {
							type: "object[]"
						}
					}
				},
				/** Returns the changed characteristics */
				characteristicChanged: {
					parameters: {
						changedCharacteristic: {
							type: "object"
						}
					}
				},
				
				/** Only the characteristic count of a group has been reloaded */
				characteristicCountChanged: {
					parameters:  {
						groupId: {
							type: "number"
						},
						changedCharacteristicCount: {
							type: "number"
						}
					}
				}
			}
		},

		init: function () {
			// clean up of object in exit hook does not work
			// therefore clean up on init 
			// otherwise the old data is kept
			this._mCharacteristics = {};
		},

		setAltValuesStateForCstic: function (oCsticData, bLoaded, bIsLoading) {
			var sCsticMapId = this._createCsticMapId(oCsticData);
			this._getCharacteristicsMap()[sCsticMapId] = {
				loaded: bLoaded,
				isLoading: bIsLoading
			};
		},

		getAltValuesStateForCstic: function (oCsticData) {
			var sCsticMapId = this._createCsticMapId(oCsticData);
			return this._getCharacteristicsMap()[sCsticMapId];
		},

		loadAlternativeValuesIfNeeded: function (oCsticEntity, oBinding, oEvent) {
			if (this.isLoadNeeded(oCsticEntity)) {
				return this.loadAlternativeValues(oCsticEntity, oBinding, true);
			} else {
				return Promise.reject();
			}
		},

		loadAlternativeValues: function (oCsticEntity, oBinding, bUpdateBinding) {
			this.setAltValuesStateForCstic(oCsticEntity, false, true);
			var oPromise = this._calculateAlternativeValues(oCsticEntity);
			if (bUpdateBinding) {
				oPromise = this.readDomainValuesForCstic(oCsticEntity);
				oPromise.then(function () {
					if (oBinding) {
						oBinding.refresh(true);
					}
					this.setAltValuesStateForCstic(oCsticEntity, true, false);
				}.bind(this)).catch(function (oError) {});
			} else {
				this.setAltValuesStateForCstic(oCsticEntity, true, false);
			}
			return oPromise;
		},

		/**
		 * Assign a characteristc value.
		 * 
		 * @param {number} iDirection    optional    -1 means "unassign"
		 * @public
		 */
		assignCharacteristicValue: function (oValue, iDirection, oCsticData, bVCHContext) {
			this._resetCharacteristicsMap();
			var oPromise = null;
			Logger.logDebug("assignCharacteristicValue cstic '{0}' - direction={1} - value={2}", [oCsticData.CsticId, iDirection, oValue], this);
			if (iDirection === -1) {
				oPromise = this.callFunction("/ClearCharacteristic", oValue);
			} else {
				if (!oValue.TechnicalValue && !oValue.StringValue && oValue.ValueId === "") {
					// Assign without values is redirected to clear characteristic: 
					oPromise = this.callFunction("/ClearCharacteristic", oValue);
				} else {
					oPromise = this.callFunction("/CharacteristicValueAssign", oValue);
				}
			}
			if (oCsticData.IsSingleValued && bVCHContext) {
				this.loadAlternativeValues(oValue, null, false);
			}

			return oPromise;
		},

		getCharacteristicMessages: function () {
			var aMessages = this.getDataModel().getMessagesByEntity("Characteristic");
			// Unfortunately the getMessagesByEntity function returns the messages for all 
			// entities starting with "Characteristic", especially CharacteristicValue.
			if (aMessages) {
				return aMessages.filter(function (oMessage0) {
					// ignore messages referring to characteristic value
					return !oMessage0.fullTarget.startsWith("/CharacteristicValueSet(");
				});
			} else {
				return aMessages;
			}
		},

		getCharacteristicIdFromMessage: function (oMessage) {
			var sPath = oMessage.getTarget();
			return this.getDataModel().getProperty(sPath);
		},

		createCharacteristicKey: function (oCstic) {
			return this.createKey("/CharacteristicSet", ValuationDAO.createKeyObject(oCstic));
		},

		createCharacteristicGroupKey: function (oGroup) {
			return this.createKey("CharacteristicsGroupSet", ValuationDAO.createKeyObject(oGroup));
		},

		readDomainValuesForCstic: function (oCstic) {
			var sKey = this.createCharacteristicKey(oCstic) + "/DomainValues";
			return this.read(sKey).then(function (oResult) {
				oCstic.DomainValues = oResult.results;
				this.fireCharacteristicChanged({
					changedCharacteristic: oCstic
				});
				return oResult;
			}.bind(this));
		},

		/**
		 * Read the characteristic groups with the given context.
		 * 
		 * @param {object} oContext the context for which the characteristic groups should be loaded for
		 * @returns {Promise} promise instance
		 * @public
		 */
		readCharacteristicsGroups: function (oContext, bExpand) {
			var oUrlParameters = {
				"$expand": bExpand ? "Characteristics,Characteristics/DomainValues,Characteristics/AssignedValues" : ""
			};
			this.fireGroupsRequested();
			return this.read("CharacteristicsGroups", oUrlParameters, oContext).then(function (oResponse) {
				this.fireGroupsChanged({
					groups: oResponse.results
				});
				return oResponse;
			}.bind(this));
		},

		getUIFilters: function () {
			return this.getAppStateModel().getProperty("/filters");
		},

		/**
		 * Some characteristic properties can change after value assignments and other properties cannot. 
		 * This function checks if there is a filter for a property that can change. 
		 * 
		 * @public
		 */
		containsFilterForChangeableProperty: function (aFilters) {
			var bUiFilterFound = false;
			var fnPathIsForUiFilter = function (sPath) {
				return (!!sPath && sPath !== "ChangeTimestamp" && sPath !== "IsHidden" && sPath !== "Format" && sPath !== "IsSingleValued" &&
					sPath !== "AdditionalValuesAllowed");
			};
			if (aFilters) {
				aFilters.forEach(function (oFilter) {
					if (fnPathIsForUiFilter(oFilter.sPath)) {
						bUiFilterFound = true;
					} else if (oFilter.aFilters) {
						oFilter.aFilters.forEach(function (oInnerFilter) {
							if (fnPathIsForUiFilter(oInnerFilter.sPath)) {
								bUiFilterFound = true;
							}
						});
					}
				});
			}
			return bUiFilterFound;
		},

		getCharacteristicGroups: function (sBindingPath) {
			var oInstance = this.getDataModel().getProperty(sBindingPath, null, true);
			var aGroups = null;
			if (oInstance && oInstance.CharacteristicsGroups && oInstance.CharacteristicsGroups.results) {
				aGroups = oInstance.CharacteristicsGroups.results;
			}
			return aGroups;
		},

		/**
		 * Reads the changed characteristics of all groups in respect of the last change timestamp
		 * 
		 * @param {object} oContext: the context for which the characteristic entities should be loaded for
		 * @param {boolean} bLoadAllInRange: loads all characteristics which are in the current shown range
		 * @param {boolean} bForceRefresh: forces the UI to be refreshed
		 * @param {boolean} bResetFilter: shall be filter reset or not
		 * @returns {Promise<Array>} a promise resolving into an array with the response results, e.g. [{results:[]}]
		 * 
		 * @function
		 * @public
		 */
		readCharacteristics: function (oContext, bLoadAllInRange, bForceRefresh, bResetFilter) {
			var sInstanceRootPath = oContext.getPath();
			var aGroups = this.getCharacteristicGroups(sInstanceRootPath) || [];
			// The following loop at the groups must be enhanced in case of several groups!
			var aReadGroupsPromises = [];
			for (var i = 0; i < aGroups.length; i++) {
				aReadGroupsPromises.push(this.readCharacteristicsOfGroup(aGroups[i], bLoadAllInRange, bForceRefresh, bResetFilter));
			}
			return Promise.all(aReadGroupsPromises);
		},

		/**
		 * Reads the changed characteristic count of all groups in respect to the filters
		 * 
		 * @param {object} oContext: the context for which the characteristic entities should be loaded for
		 * @returns {Promise<Array>} a promise resolving into an array with the response results, e.g. [{results:[]}]
		 * 
		 * @public
		 * @function
		 */
		readCharacteristicCountOfAllGroups: function (oContext) {
			var aGroupsOfSelectedInstance = oContext.getObject().CharacteristicsGroups;
			jQuery.each(aGroupsOfSelectedInstance, function (iIndex, oGroup) {
				this.readCharacteristicCountOfGroup(oGroup);
			}.bind(this));
			return this.getDataModel().submitBatch(Constants.GROUP_CSTIC_COUNT_BATCH_GROUP);
		},

		/**
		 * Reads the changed characteristics count of the given group in respect to the filters
		 * 
		 * @param {object} oGroup: Group data which the characteristics shall be read for
		 * @returns {Promise<Array>} a promise resolving into an array with the response results, e.g. [{results:[]}]
		 * 
		 * @public
		 * @function
		 */
		readCharacteristicCountOfGroup: function (oGroup) {

			var sGroupKey = this.createCharacteristicGroupKey(oGroup);
			var iGroupId = oGroup.GroupId;

			// All filters without timestamp filter
			var aFilters = this.getUIFilters().filter(this._isNotTimestampFilter);

			if (!this.getShowHiddenCharacteristics()) {
				var oIsHiddenFilter = new Filter("IsHidden", sap.ui.model.FilterOperator.EQ, false);
				aFilters.push(oIsHiddenFilter);
			}

			var fnReadCountSuccess = this._characteristicCountReceived.bind(this, iGroupId);
			var sGroupCsticsCountPath = "/" + sGroupKey + "/Characteristics/$count" ;
			
			// Using facadeRead instead of BaseDao read because of batch group parameter
			return this.getDataModel().facadeRead(sGroupCsticsCountPath, null, null, aFilters, fnReadCountSuccess, Constants.GROUP_CSTIC_COUNT_BATCH_GROUP);

		},
		
		/**
		 * Reads the changed characteristics of selected group in respect of the last change timestamp
		 * 
		 * @param {object} oContext: the context for which the characteristic entities should be loaded for
		 * @param {boolean} bLoadAllInRange: loads all characteristics which are in the current shown range
		 * @param {boolean} bForceRefresh: forces the UI to be refreshed
		 * @param {boolean} bResetFilter: reset filter or not
		 * 
		 * @public
		 * @function
		 */
		readCharacteristicsOfSelectedGroup: function (oContext, bLoadAllInRange, bForceRefresh, bResetFilter) {
			var aGroupsOfSelectedInstance = oContext.getObject().CharacteristicsGroups;
			var iSelectedInstanceId = aGroupsOfSelectedInstance[0].InstanceId;
			var iSelectedGroup = this.getAppStateModel().getSelectedGroup(iSelectedInstanceId);
			var oSelectedGroup = {};
			jQuery.each(aGroupsOfSelectedInstance, function (iIndex, oGroup) {
				if (oGroup.GroupId === iSelectedGroup) {
					oSelectedGroup = oGroup;
					return false;
				}
			});
			return this.readCharacteristicsOfGroup(oSelectedGroup, bLoadAllInRange, bForceRefresh, bResetFilter);
		},


		/**
		 * Reads the changed characteristics of given group in respect of the last change timestamp
		 * 
		 * @param {object} oGroup: Group data which the characteristics shall be read for
		 * @param {boolean} bLoadAllInRange: loads all characteristics which are in the current shown range
		 * @param {boolean} bForceRefresh: forces the UI to be refreshed
		 * @param {boolean} bResetFilter: shall be filter reset or not
		 * @returns {Promise<Array>} a promise resolving into an array with the response results, e.g. [{results:[]}]
		 * 
		 * @public
		 * @function
		 */
		readCharacteristicsOfGroup: function (oGroup, bLoadAllInRange, bForceRefresh, bResetFilter) {

			bForceRefresh = !!bForceRefresh;
			var sGroupKey = this.createCharacteristicGroupKey(oGroup);
			var iGroupId = oGroup.GroupId;
			var iInstanceId = oGroup.InstanceId;

			var iTop = PAGING_AMOUNT;
			var bValuationUiShallBeRerendered = false;
			var bMerge = false;
			var fnCharacteristicsReadSuccess;

			var oAppStateModel = this.getAppStateModel();
			var mGroup = oAppStateModel.getGroup(iInstanceId, iGroupId);
			var iGroupTop = PAGING_AMOUNT;

			if (mGroup && mGroup.top) {
				iGroupTop = mGroup.top;
			}

			var oPreloadedCharacteristicGroup = {
				iGroupId: oGroup.GroupId,
				sInstanceId: oGroup.InstanceId,
				sContextId: oGroup.ContextId,
				aCharacteristics: null
			};

			this.getValuationComponent().fireCollectPreloadedCharacteristicGroup({
					preloadedCharacteristicGroup: oPreloadedCharacteristicGroup
			});

			if (oPreloadedCharacteristicGroup.aCharacteristics === null) {

				//set delta change timestamp from previous responses (via filter)
				var aUIFilters = this.getUIFilters();
				bValuationUiShallBeRerendered = this.containsFilterForChangeableProperty(aUIFilters) || !this.getEditable();

				// All filters without timestamp filter
				var aFilters = aUIFilters.filter(this._isNotTimestampFilter);

				if (!this.getShowHiddenCharacteristics()) {
					var oIsHiddenFilter = new Filter("IsHidden", sap.ui.model.FilterOperator.EQ, false);
					aFilters.push(oIsHiddenFilter);
				}
				
				if (bLoadAllInRange) {
					iTop = iGroupTop;
				}

				var mUrlParameters = {
					"$expand": "DomainValues,AssignedValues",
					"$top": iTop,
					"$inlinecount": "allpages"
				};

				if (!bLoadAllInRange) {
					mUrlParameters["$skip"] = iGroupTop - PAGING_AMOUNT;
					bMerge = (mUrlParameters.$skip > 0 || aUIFilters.length === 0) && !bResetFilter;
				}

				if (bValuationUiShallBeRerendered) {
					// In this case the valuation component will render all cstics anew. 
					// This "flickering" is needed because some cstics may have to appear or disappear.
					this._setChangeTimestampForGroup(iInstanceId, iGroupId, "");
					fnCharacteristicsReadSuccess = this._characteristicsReceivedWithoutChangeTimestamp.bind(this, iInstanceId, iGroupId, bMerge);
				} else {
					// If and only if we have no requirement to fully rerender we use the timestamp filter.
					// This is the "non-flickering" case
					var sTimestamp = this._getChangeTimestampForGroup(iInstanceId, iGroupId);
					if (sTimestamp && !bForceRefresh) {
						var oTimestampFilter = new Filter("ChangeTimestamp", sap.ui.model.FilterOperator.GT, sTimestamp);
						aFilters.push(oTimestampFilter);
						bMerge = true; // Always merge if filtered by timestamp
					}
					fnCharacteristicsReadSuccess = this._characteristicsReceived.bind(this, iInstanceId, iGroupId, bMerge);
				}
				var sGroupCsticsPath = "/" + sGroupKey + "/Characteristics";
				return this.read(sGroupCsticsPath, mUrlParameters, null, aFilters, fnCharacteristicsReadSuccess);

			} else {
				this._characteristicsReceivedWithoutChangeTimestamp.apply(this, [iInstanceId, iGroupId, bMerge, {
					results: oPreloadedCharacteristicGroup.aCharacteristics
				}]);
				// return a Promise that is directly resolved
				return new Promise(function (resolve, reject) {
					resolve();
				}.bind(this));
			}
		},
		
		_characteristicCountReceived: function(iGroupId, oResponse){
			this.fireCharacteristicCountChanged({
				groupId: iGroupId,
				changedCharacteristicCount: parseInt(oResponse, 10)
			});
			
		},

		_characteristicsReceivedWithoutChangeTimestamp: function (iInstanceId, iGroupId, bMerge, oResponse) {
			var oAppStateModel = this.getAppStateModel();
			if (!oAppStateModel.getGroup(iInstanceId, iGroupId)) {
				oAppStateModel.setGroup(iInstanceId, iGroupId);
			}
			oAppStateModel.setGroupLoaded(iInstanceId, iGroupId, true);
			if (oResponse && oResponse.results) {
				this.fireCharacteristicsChanged({
					merge: bMerge,
					groupId: iGroupId,
					changedCharacteristics: oResponse.results
				});
			}
		},

		/**
		 * @public
		 */
		setLatestChangeTimestamps: function (aCharacteristics) {
			var sChangeTimestamp = this._getLatestChangeTimestamp(aCharacteristics);
			if (aCharacteristics.length && sChangeTimestamp) {
				var iInstanceId = aCharacteristics[0].InstanceId;
				var iGroupId = aCharacteristics[0].GroupId;
				this._setChangeTimestampForGroup(iInstanceId, iGroupId, sChangeTimestamp);
			}
		},

		/**
		 * @private
		 */
		_characteristicsReceived: function (iInstanceId, iGroupId, bMerge, oResponse) {
			if (oResponse && oResponse.results) {
				this.setLatestChangeTimestamps(oResponse.results);
				this._characteristicsReceivedWithoutChangeTimestamp(iInstanceId, iGroupId, bMerge, oResponse);
			}
		},
		
		_isNotTimestampFilter: function (oFilter) {
				return oFilter.sPath !== "ChangeTimestamp";
		},

		_setChangeTimestampForGroup: function (iInstanceId, iGroupId, sTimestamp) {
			this.getAppStateModel().setChangeTimestampForGroup(iInstanceId, iGroupId, sTimestamp);
		},

		_getChangeTimestampForGroup: function (iInstanceId, iGroupId) {
			return this.getAppStateModel().getChangeTimestampForGroup(iInstanceId, iGroupId);
		},

		/**
		 * @private
		 */
		_getLatestChangeTimestamp: function (aCharacteristics) {
			var sChangeTimestamp = null;
			var oChangeTimestamp = null;
			aCharacteristics.forEach(function (oCharacteristic) {
				if (oCharacteristic.ChangeTimestamp) {
					var oCurrentChangeTimestamp = new Date(oCharacteristic.ChangeTimestamp);
					if (!oChangeTimestamp || (oCurrentChangeTimestamp.getTime() > oChangeTimestamp.getTime())) {
						sChangeTimestamp = oCharacteristic.ChangeTimestamp;
						oChangeTimestamp = oCurrentChangeTimestamp;
					}
				}
			});
			return sChangeTimestamp;
		},

		/**
		 * @private
		 */
		_calculateAlternativeValues: function (oCsticEntity) {
			var oValue = ValuationDAO.createKeyObject(oCsticEntity);
			return this.callFunction("/CalculateAlternativeValues", oValue);
		},

		/**
		 * @private
		 */
		_getCharacteristicsMap: function () {
			return this._mCharacteristics;
		},

		/**
		 * @private
		 */
		_resetCharacteristicsMap: function () {
			this._mCharacteristics = {};
		},

		/**
		 * @param {var} vData The OData Data to normalize
		 * @public
		 */
		normalize: function (vData) {
			if (!vData || (vData && !jQuery.isArray(vData) && !vData.results)) {
				if (isDeferredLoaded(vData)) {
					return null;
				} else {
					return vData;
				}
			}

			var aData = vData;
			if (vData && vData.results) {
				aData = vData.results;
			}
			jQuery.each(aData, function (iIndex, oEntry) {
				jQuery.each(oEntry, function (sKey, vObject) {
					oEntry[sKey] = this.normalize(vObject);
				}.bind(this));
			}.bind(this));
			return aData;
		},

		/**
		 * @private
		 */
		isLoadNeeded: function (oCsticEntity) {
			if (!oCsticEntity.IsSingleValued) {
				return false;
			}

			if (!oCsticEntity.HasAssignedValue) {
				return false;
			}

			if (!this.getAltValuesStateForCstic(oCsticEntity)) {
				return true;
			}

			if (this.getAltValuesStateForCstic(oCsticEntity).loaded) {
				return false;
			}

			if (this.getAltValuesStateForCstic(oCsticEntity).isLoading) {
				return false;
			}

			return false;
		},

		/**
		 * @private
		 */
		_createCsticMapId: function (oCsticData) {
			return oCsticData.ContextId + "/" + oCsticData.InstanceId + "/" + oCsticData.GroupId + "/" + oCsticData.CsticId;
		}

	});

	/**
	 * Maps given cstic into a key object
	 * 
	 * @param {Object} oCstic The Cstic instance to use
	 * @return {Object} contains of context, instance, group and cstic ids
	 * @function
	 * @static
	 * @public
	 */
	ValuationDAO.createKeyObject = function (oCstic) {
		var mKey = {
			ContextId: oCstic.ContextId,
			InstanceId: oCstic.InstanceId,
			GroupId: oCstic.GroupId,
		};
		if (oCstic.CsticId) {
			mKey["CsticId"] = oCstic.CsticId;
		}
		return mKey;
	};

	return ValuationDAO;
});
