/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/base/ManagedObject",
	"jquery.sap.global",
	"sap/i2d/lo/lib/zvchclfz/common/localService/Mockdata",
	"sap/i2d/lo/lib/zvchclfz/common/Constants"
], function (ManagedObject, jQuery, Mockdata, Constants) {
	"use strict";

	var sConfigurationContextURI =
		"/ConfigurationContextSet('VCH(12)SEMANTIC_OBJ(12)SemanticObj1(10)OBJECT_KEY(10)ObjectKey1(9)DRAFT_KEY(9)DraftKey1(16)DRAFT_KEY_IS_STR(1)X(14)EMBEDDING_MODE(13)Configuration(15)LEGACY_SCENARIO(1)X(7)UI_MODE(4)Edit')?$expand=Instances%2FCharacteristicsGroups%2CInconsistencyInformation%2CUISettings";
	var oMockserverHelper = ManagedObject.extend("sap.i2d.lo.lib.vchclf.common.localService.MockserverHelper", {

		metadata: {
			properties: {
				mockserver: {
					type: "sap.ui.core.util.MockServer"
				},
				mockserverConfig: {
					type: "object"
				},
				localMockserver: {
					type: "sap.i2d.lo.lib.vchclf.common.localService.Mockserver"
				}
			}
		},

		init: function () {
			this._oMockdata = new Mockdata();
		},

		exit: function () {
			this._oMockdata.destroy();
			delete this._oMockdata;
		},

		/****************************************************************PRIVATE METHODS*********************************************************************************/

		_emptyResponse: JSON.stringify({
			d: {
				results: []
			}
		}),

		_bCharacteristicValueChanged: false,
		_bInitialCall: true,

		_assignableClasses: [],

		/**
		 * Sets the value of default attribute for characteristic values to false
		 * @param {Array} aDomainValues contains all values of one characteristic
		 * @private
		 * @function
		 */
		_resetDefaultValues: function (aDomainValues) {
			aDomainValues.forEach(function (oDomValue) {
				if (oDomValue.IsDefaultValueRemember) {
					oDomValue.IsDefaultValue = false;
				}
			});
		},

		/**
		 * Checks for assigned characteristic values
		 * @param {Array} aDomainValues contains all values of one characteristic
		 * @return {Boolean} returns true if an assigned characteristic value was found
		 * @private
		 * @function
		 */
		_hasAssginedValue: function (aDomainValues) {
			var bHasAssigned = false;
			aDomainValues.forEach(function (oDomValue) {
				if (oDomValue.Assigned) {
					bHasAssigned = true;
				}
			});
			return bHasAssigned;
		},

		/**
		 * This function exchanges the validation status of the first two groups
		 */
		_toggleGroupStatus: function () {
			var oMockserver = this.getMockserver();
			var aGroups = oMockserver.getEntitySetData("CharacteristicsGroupSet");
			var sOldStatusFirstGroup = aGroups[0].ValidationStatus; 
			aGroups[0].ValidationStatus = aGroups[1].ValidationStatus;
			aGroups[2].ValidationStatus = aGroups[1].ValidationStatus;
			aGroups[1].ValidationStatus = sOldStatusFirstGroup;
			oMockserver.setEntitySetData("CharacteristicsGroupSet", aGroups);
		}, 

		/**
		 * Restores the value of default attribute for characteristic values
		 * @param {Array} aDomainValues contains all values of one characteristic
		 * @param {Boolean} bIsSingleValued indicator for single and multi valued characteristic
		 * @private
		 * @function
		 */
		_restoreDefaultValues: function (aDomainValues, bIsSingleValued) {
			if (bIsSingleValued) {
				var bHasAssignedValue = this._hasAssginedValue(aDomainValues);
				aDomainValues.forEach(function (oDomValue) {
					if (oDomValue.IsDefaultValueRemember && !bHasAssignedValue) {
						oDomValue.IsDefaultValue = true;
					}
				});
			} else {
				aDomainValues.forEach(function (oDomValue) {
					if (oDomValue.IsDefaultValueRemember && !oDomValue.Assigned) {
						oDomValue.IsDefaultValue = true;
					}
				});
			}
		},

		/**
		 * Updates several attributes for one characteristic
		 * @param {Object} [oSelectedCsticData] contains selected characteristic and values 
		 * @private
		 * @function
		 */
		_updateCsticData: function (oSelectedCsticData) {
			var bAssignedDefaultValueExist = false,
				sAssignedValueId = "",
				bHasAssignedValue = false,
				iValueCount = oSelectedCsticData.Characteristic.DomainValues.results.length,
				bIsSingleValued = oSelectedCsticData.Characteristic.IsSingleValued;

			oSelectedCsticData.Characteristic.DomainValues.results.forEach(function (oDomainValue) {
				if (!oDomainValue.Assigned && oDomainValue.IsDefaultValue) {
					bAssignedDefaultValueExist = true;
				}
				if (bIsSingleValued && (oDomainValue.Assigned || oDomainValue.IsDefaultValue)) {
					sAssignedValueId = oDomainValue.ValueId;
				}
				if (oDomainValue.Assigned) {
					bHasAssignedValue = true;
				}
			});

			oSelectedCsticData.Characteristic.AssignedValueId = sAssignedValueId;
			oSelectedCsticData.Characteristic.HasAssignedValue = bHasAssignedValue;
			oSelectedCsticData.Characteristic.ChangeTimestamp = new Date();
			oSelectedCsticData.Characteristic.ValueCount = iValueCount;
			oSelectedCsticData.Characteristic.HasDefaultValues = (bAssignedDefaultValueExist && oSelectedCsticData.Characteristic.HasDefaultValuesRemember);
		},

		/**
		 * Splits given string by separator
		 * @param {String} sString: String that should be splitted
		 * @param {String} sSeparator: Separator like "?" ";" "/" "=" and so on 
		 * @return {Array} If the given string can be splited by given separator an array will be returned
		 *                 If the given string cannot be splited by given separator the given string will be returned in an array
		 * @private
		 * @function
		 */
		_splitStringBySeparator: function (sString, sSeparator) {
			if (sString.search(sSeparator) >= 0) {
				var sStringCopy = sString,
					iNextPosition = 0,
					aValues = [],
					iStartPosition = 0,
					bSearch = true;

				// localize the separator position between properties in the given string
				// split the string by properties into an array
				while (bSearch) {
					if (sStringCopy.search(sSeparator) >= 0) {
						iNextPosition = iNextPosition + sStringCopy.search(sSeparator) + 1;
						sStringCopy = sStringCopy.slice(sStringCopy.search(sSeparator) + 1, sStringCopy.length);
						aValues.push(sString.slice(iStartPosition, iNextPosition - 1));
						iStartPosition = iNextPosition;
					} else {
						aValues.push(sString.slice(iStartPosition, sString.length));
						bSearch = false;
					}
				}

				return aValues;
			}
			return [sString];
		},

		/**
		 * Maps given array by key(s) and value(s) into a map
		 * @param {Array} aArray: Array with key(s) and values that should be moved into an object
		 * @return {Map} Key map
		 * @private
		 * @function
		 */
		_moveArrayIntoObject: function (aArray) {
			var oKeys = {};
			aArray.forEach(function (sEach) {
				var iPropertyPosition = sEach.search("=");
				var sPropertyName = sEach.slice(0, iPropertyPosition);
				var sPropertyValue = sEach.slice(iPropertyPosition + 1, sEach.length);

				if (sPropertyValue.search("'") >= 0) {
					sPropertyValue = sPropertyValue.slice(1, sPropertyValue.length - 1);
					sPropertyValue = unescape(sPropertyValue);
				}

				oKeys[sPropertyName] = [sPropertyValue];
			});

			return oKeys;
		},

		/**
		 * Splits given string by key(s) and value(s) into a map
		 * @param {String} sUrlParams: String that should be splitted
		 * @return {Map} Key map
		 * @private
		 * @function
		 */
		_getKeyMap: function (sUrlParams) {
			if (sUrlParams.search("/?") >= 0) {
				sUrlParams = sUrlParams.slice(1, sUrlParams.length);
			}
			// split the URI by key(s)/properties
			var aKeys = this._splitStringBySeparator(sUrlParams, "&");

			// map splited properties into an object
			var oKeys = this._moveArrayIntoObject(aKeys);

			// split the value of the property 'stringValue' if it has a concatenated value
			if (oKeys.StringValue && oKeys.StringValue[0]) {
				var aStringValue = this._splitStringBySeparator(oKeys.StringValue[0], ";");
				oKeys.StringValue = aStringValue;
			} else {
				oKeys.StringValue = [];
			}

			if (oKeys.TechnicalValue) {
				// split the value of the property 'technicalValue' if it has a concatenated value
				var aTechnicalValue = this._splitStringBySeparator(oKeys.TechnicalValue[0], ";");
				oKeys.TechnicalValue = aTechnicalValue;
			}

			return oKeys;
		},

		/**
		 * Determines selected characteristic and its domain values by given keys
		 * @param {Object} [oCsticData] contains keys to find the right characteristic value for update
		 * @param {Array} [oCsticData.ContextId] Id of configuration context
		 * @param {Array} [oCsticData.InstanceId] Id of configuration instance
		 * @param {Array} [oCsticData.GroupId] Id of characteristic group
		 * @param {Array} [oCsticData.CsticId] Id of characteristic 
		 * @param {Array} [oCsticData.ValueId] Id of characteristic value
		 * @return {Object} [oSelectedCsticData] contains selected characteristic and values 
		 * @private
		 * @function
		 */
		_getSelectedCharacteristic: function (oCsticData) {
			var oSelectedCsticData = {};
			var aGroups = this._oMockdata.getCharacteristicGroupSet();
			aGroups.forEach(function (oGroup) {
				var aCstics = oGroup.Characteristics.results;
				if (aCstics) {
					for (var n = 0; n < aCstics.length; n++) {
						if (aCstics[n].CsticId === oCsticData.CsticId[0] && aCstics[n].GroupId == oCsticData.GroupId[0]) {
							oSelectedCsticData.Characteristic = aCstics[n];
							break;
						}
					}
				}
			});
			return oSelectedCsticData;
		},

		/**
		 * Compares given id from old selection with ids from new selection
		 * @param {String} sDomainValueId: Id that should be compared with new selection
		 * @param {Object} oCsticData contains keys to find the right characteristic value for update
		 * @param {Array} [oCsticData.ContextId] Id of configuration context
		 * @param {Array} [oCsticData.InstanceId] Id of configuration instance
		 * @param {Array} [oCsticData.GroupId] Id of characteristic group
		 * @param {Array} [oCsticData.CsticId] Id of characteristic 
		 * @param {Array} [oCsticData.ValueId] Id of characteristic value
		 * @return {Boolean} If the given value id from old selection is contained in the new selection return true otherwise false
		 * @private
		 * @function
		 */
		_hasSelectionAdditionalValues: function (sDomainValueId, oCsticData) {
			for (var n = 0; n < oCsticData.ValueId.length; n++) {
				if (sDomainValueId === oCsticData.ValueId[n]) {
					return true;
				}
			}
			return false;
		},

		/**
		 * Unassigns all domain values and checks old selection with current before remove/unassign additional value
		 * @param {Object} [oSelectedCsticData] contains characteristic and its values
		 * @param {Object} [oSelectedCsticData.Characteristic] contains data of one characteristic except values
		 * @param {Array} [oSelectedCsticData.Characteristic.DomainValues.results] contains all values of one characteristic
		 * @param {Array} [oSelectedCsticData.Characteristic.AssignedValues.results] contains only assigned values of one characteristic
		 * @param {Object} oCsticData contains keys to find the right characteristic value for update
		 * @param {Array} [oCsticData.ContextId] Id of configuration context
		 * @param {Array} [oCsticData.InstanceId] Id of configuration instance
		 * @param {Array} [oCsticData.GroupId] Id of characteristic group
		 * @param {Array} [oCsticData.CsticId] Id of characteristic 
		 * @param {Array} [oCsticData.ValueId] Id of characteristic value
		 * @returns {Integer} Number of removed values
		 * @private
		 * @function
		 */
		_unassignAllValuesConsideringAdditional: function (oSelectedCsticData, oCsticData) {
			var aDomainValues = oSelectedCsticData.Characteristic.DomainValues.results;
			var iNumberOfRemovedValues = 0;
			for (var i = 0; i < aDomainValues.length; i++) {
				if (aDomainValues[i].IsAdditionalValue) {
					if (this._hasSelectionAdditionalValues(aDomainValues[i].ValueId, oCsticData)) {
						aDomainValues[i].Assigned = false;
						iNumberOfRemovedValues++;
					} else {
						aDomainValues.splice(i, 1);
						iNumberOfRemovedValues++;
					}
				} else if (aDomainValues[i].Assigned && !aDomainValues[i].IsReadonly) { // read-only values cannot be unassigned
					aDomainValues[i].Assigned = false;
					iNumberOfRemovedValues++;
				}
			}
			return iNumberOfRemovedValues;
		},

		/**
		 * Multiple value unassign
		 * Removes either additional value from domain values or marks domain value as unassigned
		 * Read-only values cannot be unassigned
		 * @param {Object} [oSelectedCsticData] contains characteristic and its values
		 * @param {Object} [oSelectedCsticData.Characteristic] contains data of one characteristic except values
		 * @param {Array} [oSelectedCsticData.Characteristic.DomainValues.results] contains all values of one characteristic
		 * @param {Array} [oSelectedCsticData.Characteristic.AssignedValues.results] contains only assigned values of one characteristic
		 * @param {Object} oCsticData contains keys and data of a characteristic value
		 * @param {Array} [oCsticData.ContextId] Id of configuration context
		 * @param {Array} [oCsticData.InstanceId] Id of configuration instance
		 * @param {Array} [oCsticData.GroupId] Id of characteristic group
		 * @param {Array} [oCsticData.CsticId] Id of characteristic 
		 * @param {Array} [oCsticData.ValueId] Id of characteristic value
		 * @returns {Integer} Number of removed values
		 * @public
		 * @function
		 */
		unassignAllValues: function (oCsticData, oSelectedCsticData) {
			var iNumberOfRemovedValues = 0;
			var aDomainValues = oSelectedCsticData.Characteristic.DomainValues.results;
			for (var i = 0; i < aDomainValues.length; i++) {
				if (aDomainValues[i].Assigned && !aDomainValues[i].IsReadonly) { // Read-only values cannot be unassigned
					aDomainValues[i].Assigned = false;
					if (aDomainValues[i].IsAdditionalValue) {
						aDomainValues.splice(i, 1);
					}
					iNumberOfRemovedValues++;
				}
			}
			return iNumberOfRemovedValues;
		},

		/**
		 * Single value unassign. Loops all values and unassigns the first assigned one (there should be only one on single-valued cstic).
		 * Removes either additional value from domain values or marks domain value as unassigned
		 * @param {Object} [oSelectedCsticData] contains characteristic and its values
		 * @param {Object} [oSelectedCsticData.Characteristic] contains data of one characteristic except values
		 * @param {Array} [oSelectedCsticData.Characteristic.DomainValues.results] contains all values of one characteristic
		 * @param {Array} [oSelectedCsticData.Characteristic.AssignedValues.results] contains only assigned values of one characteristic
		 * @private
		 * @function
		 */
		_unassignSingleValuedCstic: function (oSelectedCsticData) {
			var aDomainValues = oSelectedCsticData.Characteristic.DomainValues.results;
			for (var i = 0; i < aDomainValues.length; i++) {
				if (aDomainValues[i].Assigned) {
					aDomainValues[i].Assigned = false;
					if (aDomainValues[i].IsAdditionalValue) {
						aDomainValues.splice(i, 1);
					}
					break;
				}
			}
		},

		/**
		 * Checks if new assignment already exists
		 * @param {String} sNewValuedId of new assignment
		 * @param {Array} [aDomainValues] contains all domain values for a cstic
		 * @returns {Boolean} If one of domain values matchs with current assignment a true will be returned
		 * @private
		 * @function
		 */
		_isDuplicateAssignment: function (sNewValuedId, aDomainValues) {
			for (var i = 0; aDomainValues.length > i; i++) {
				if (sNewValuedId === aDomainValues[i].ValueId) {
					aDomainValues[i].Assigned = true;
					return true;
				}
			}
			return false;
		},
		/**
		 * Creates additional value data for Characteristic Value Set
		 * @param {Object} oCsticData contains keys and data of a characteristic value
		 * @param {Array} [oCsticData.ContextId] Id of configuration context
		 * @param {Array} [oCsticData.InstanceId] Id of configuration instancecreate
		 * @param {Array} [oCsticData.GroupId] Id of characteristic group
		 * @param {Array} [oCsticData.CsticId] Id of characteristic 
		 * @param {Array} [oCsticData.ValueId] Id of characteristic value
		 * @param {String} iStringValueIndex: index of string value array
		 * @returns {Object} oNewCsticData contains data of additional value
		 * @private
		 * @function
		 */
		_createAdditionalValue: function (oCsticData, iStringValueIndex) {
			if (!oCsticData.StringValue) {
				return;
			}

			var oNewCsticData = this._getSampleCsticValueData();

			oNewCsticData.ValueId = oCsticData.StringValue[iStringValueIndex] + "-";
			oNewCsticData.Description = oCsticData.StringValue[iStringValueIndex];
			oNewCsticData.FormattedValueFrom = oCsticData.StringValue[iStringValueIndex];
			oNewCsticData.TechnicalValueFrom = oCsticData.StringValue[iStringValueIndex];
			oNewCsticData.TechnicalValue = oCsticData.StringValue[iStringValueIndex];
			oNewCsticData.CsticId = oCsticData.CsticId[0];
			oNewCsticData.InstanceId = oCsticData.InstanceId[0];
			oNewCsticData.ContextId = oCsticData.ContextId[0];
			oNewCsticData.GroupId = parseInt(oCsticData.GroupId[0], 10);
			oNewCsticData.__metadata = {
				id: "/sap/opu/odata/SAP/LO_VCHCLF/CharacteristicValueSet(ContextId='" + oNewCsticData.ContextId +
					"',InstanceId='" + oNewCsticData.InstanceId +
					"',GroupId=" + oNewCsticData.GroupId + ",CsticId='" + oNewCsticData.CsticId +
					"',ValueId='" + oNewCsticData.ValueId + "')",
				type: "LO_VCHCLF.CharacteristicValue",
				uri: "/sap/opu/odata/SAP/LO_VCHCLF/CharacteristicValueSet(ContextId='" + oNewCsticData.ContextId +
					"',InstanceId='" + oNewCsticData.InstanceId +
					"',GroupId=" + oNewCsticData.GroupId + ",CsticId='" + oNewCsticData.CsticId +
					"',ValueId='" + oNewCsticData.ValueId + "')"
			};

			return oNewCsticData;
		},

		_createAdditionalValueFromTechValue: function (oCsticData, iTechValueIndex) {
			var oNewCsticData = this._getSampleCsticValueData();

			oNewCsticData.ValueId = oCsticData.TechnicalValue[iTechValueIndex] + "-";
			oNewCsticData.Description = oCsticData.TechnicalValue[iTechValueIndex];
			oNewCsticData.FormattedValueFrom = oCsticData.TechnicalValue[iTechValueIndex];
			oNewCsticData.TechnicalValueFrom = oCsticData.TechnicalValue[iTechValueIndex];
			oNewCsticData.TechnicalValue = oCsticData.TechnicalValue[iTechValueIndex];
			oNewCsticData.CsticId = oCsticData.CsticId[0];
			oNewCsticData.InstanceId = oCsticData.InstanceId[0];
			oNewCsticData.ContextId = oCsticData.ContextId[0];
			oNewCsticData.GroupId = parseInt(oCsticData.GroupId[0], 10);
			oNewCsticData.__metadata = {
				id: "/sap/opu/odata/SAP/LO_VCHCLF/CharacteristicValueSet(ContextId='" + oNewCsticData.ContextId +
					"',InstanceId='" + oNewCsticData.InstanceId +
					"',GroupId=" + oNewCsticData.GroupId + ",CsticId='" + oNewCsticData.CsticId +
					"',ValueId='" + oNewCsticData.ValueId + "')",
				type: "LO_VCHCLF.CharacteristicValue",
				uri: "/sap/opu/odata/SAP/LO_VCHCLF/CharacteristicValueSet(ContextId='" + oNewCsticData.ContextId +
					"',InstanceId='" + oNewCsticData.InstanceId +
					"',GroupId=" + oNewCsticData.GroupId + ",CsticId='" + oNewCsticData.CsticId +
					"',ValueId='" + oNewCsticData.ValueId + "')"
			};

			return oNewCsticData;
		},

		/**
		 * Marks domain value as assigned if the given sId (StringValue or ValueId) matchs with one of domain values
		 * @param {Array} aDomainValues contains all values of one characteristic
		 * @param {String} sId: An id of selected value 
		 * @returns {Boolean} If a domain value was assigned a true will be returned
		 * @private
		 * @function
		 */
		_setDomainValue: function (aDomainValues, sId) {
			for (var i = 0; i < aDomainValues.length; i++) {
				if (aDomainValues[i].Description === sId || aDomainValues[i].TechnicalValue === sId) {
					aDomainValues[i].Assigned = true;
					return true;
				}
			}
			return false;
		},

		_getSpecificCstic: function (aCstics, sCsticId) {
			var oSpecificCstic = {};
			aCstics.forEach(function (oCstic) {
				if (oCstic.CsticId === sCsticId) {
					oSpecificCstic = oCstic;
				}
			});
			return oSpecificCstic;
		},

		_oChangeMap: {
			sCsticIdToRemoveValues: "Vendor1",
			csticPropertychanges: [{
				csticId: "MType1",
				property: "IsRequired",
				newValue: true
			}, {
				csticId: "MType1",
				property: "IsInconsistent",
				newValue: true
			}, {
				csticId: "Sector1",
				property: "IsHidden",
				newValue: true
			}, {
				csticId: "Sector1",
				property: "HasValueContradiction",
				newValue: true
			}]
		},

		_adjustDataToCurrentState: function (aCstics, oStatusCstic) {
			var sState = oStatusCstic.AssignedValueId;
			var oCstic = this._getSpecificCstic(aCstics, this._oChangeMap.sCsticIdToRemoveValues);
			if (oCstic.DomainValues && oCstic.DomainValues.results) {
				switch (sState) {
				case "State_Trigger_Dependency":
					this._applyChanges(this._oChangeMap, aCstics);
					// Delete all values from a dropdown box
					this._stashValues(oCstic);
					this._handleDIEN(aCstics, true);
					break;
				default:
					// Get the values for "CsticId_3.1"
					this._restoreValues(oCstic);
					this._handleDIEN(aCstics, false);
				}
			}
		},

		_oContext: {},

		_applyChanges: function (oChangeMap, aCstics) {
			oChangeMap.csticPropertychanges.forEach(function (oChange) {
				var oCstic = this._getSpecificCstic(aCstics, oChange.csticId);
				oCstic[oChange.property] = oChange.newValue;
			}, this);
		},

		_stashValues: function (oCstic) {
			// Store values in context
			this._oContext.oldDomainValues = JSON.parse(JSON.stringify(oCstic.DomainValues));
			this._oContext.oldAssignedValues = JSON.parse(JSON.stringify(oCstic.AssignedValues));
			// Drop values
			oCstic.DomainValues.results = [];
			oCstic.AssignedValues.results = [];
		},

		_restoreValues: function (oCstic) {
			if (this._oContext.oldDomainValues) {
				// Get the values from the context 
				oCstic.DomainValues.results = this._oContext.oldDomainValues.results;
				oCstic.AssignedValues.results = this._oContext.oldAssignedValues.results;
			}
		},

		_removeDIENValue: function (aValues) {
			aValues.forEach(function (oValue, index) {
				if (oValue.ValueId === "DIEN") {
					aValues.splice(index, 1);
				}
			});
		},

		_getSampleCsticValueData: function () {
			return {
				"IsAdditionalValue": true,
				"UnitFrom": "",
				"UnitTo": "",
				"Currency": "",
				"IntervalType": "1",
				"HasLongText": false,
				"Description": "Additional Value",
				"IsInconsistent": false,
				"Assigned": true,
				"DepObjNumber": "000000000",
				"IsDefaultValue": false,
				"IsDefaultValueRemember": false,
				"IsSetByObjectDependency": false,
				"IsExcluded": false,
				"IsReadonly": false,
				"FormattedValueFrom": "",
				"FormattedValueTo": "",
				"TechnicalValueFrom": "",
				"TechnicalValueTo": "",
				"TechnicalValue": ""
			};
		},

		_buildDIENValue: function (oTemplateValue) {
			var oDIENValue = this._getSampleCsticValueData();
			var sContextId =
				"VCH(12)SEMANTIC_OBJ(12)SemanticObj1(10)OBJECT_KEY(10)ObjectKey1(9)DRAFT_KEY(9)DraftKey1(16)DRAFT_KEY_IS_STR(1)X(14)EMBEDDING_MODE(13)Configuration(15)LEGACY_SCENARIO(1)X(7)UI_MODE(4)Edit";
			var sEntityPath = "CharacteristicValueSet(ContextId='" + sContextId +
				"',InstanceId='1',GroupId=1,CsticId='MType1',ValueId='DIEN')";
			var sUri = "/sap/opu/odata/SAP/LO_VCHCLF/" + sEntityPath;

			jQuery.extend(oDIENValue, {
				"ContextId": sContextId,
				"InstanceId": "1",
				"GroupId": 1,
				"CsticId": "MType1",
				"ValueId": "DIEN",
				"__metadata": {
					"id": sUri,
					"uri": sUri,
					"type": "LO_VCHCLF.CharacteristicValue"
				},
				"to_CharacteristicValueDetail": {
					__deferred: {
						uri: "/sap/opu/odata/SAP/LO_VCHCLF/CharacteristicValueSet(ContextId='VCH(12)SEMANTIC_OBJ(12)SemanticObj1(10)OBJECT_KEY(10)ObjectKey1(9)DRAFT_KEY(9)DraftKey1(16)DRAFT_KEY_IS_STR(1)X(14)EMBEDDING_MODE(13)Configuration(15)LEGACY_SCENARIO(1)X(7)UI_MODE(4)Edit',InstanceId='1',GroupId=1,CsticId='MType1',ValueId='1')/to_CharacteristicValueDetail"
					}
				},
				"to_ObjectDependencyHeaders": {
					__deferred: {
						uri: "/sap/opu/odata/SAP/LO_VCHCLF/CharacteristicValueSet(ContextId='VCH(12)SEMANTIC_OBJ(12)SemanticObj1(10)OBJECT_KEY(10)ObjectKey1(9)DRAFT_KEY(9)DraftKey1(16)DRAFT_KEY_IS_STR(1)X(14)EMBEDDING_MODE(13)Configuration(15)LEGACY_SCENARIO(1)X(7)UI_MODE(4)Edit',InstanceId='1',GroupId=1,CsticId='MType1',ValueId='1')/to_ObjectDependencyHeaders"
					}
				}
			});
			return oDIENValue;
		},

		_handleDIEN: function (aChars, assigned) {
			var aDomValues = [],
				aAsgValues = [];

			var oCstic = this._getSpecificCstic(aChars, "MType1");
			aDomValues = oCstic.DomainValues.results;
			aAsgValues = oCstic.AssignedValues.results;

			var bDIENValueFound = false;
			aDomValues.forEach(function (oValue) {
				if (oValue.ValueId === "DIEN") {
					bDIENValueFound = true;
				}
			});

			if (!assigned && bDIENValueFound) {
				this._removeDIENValue(aDomValues);
				this._removeDIENValue(aAsgValues);
			} else if (assigned && !bDIENValueFound) {
				// assign new value 'DIEN' (as an examle for some dependency behavior)
				var oDIENValue = this._buildDIENValue(aDomValues[0]);
				aDomValues.push(oDIENValue);
				aAsgValues.length = 0;
				aAsgValues.push(oDIENValue);
			}
		},

		_configurationStatusHandling: function (oKeys) {
			if (oKeys.CsticId[0] === "CONF_STATUS") {
				var sStatusDescription = oKeys.TechnicalValue[0] || oKeys.ValueId[0].substring(0, 1) + oKeys.ValueId[0].substring(1).toLowerCase();
				this._oMockdata.setProperty("/NewStatusDescription", sStatusDescription);
				switch (sStatusDescription) {
				case "Released":
					this._oMockdata.setProperty("/NewStatusType", "1");
					break;
				case "Locked":
					this._oMockdata.setProperty("/NewStatusType", "2");
					break;
				case "Incomplete":
					this._oMockdata.setProperty("/NewStatusType", "3");
					break;
				case "Inconsistent":
					this._oMockdata.setProperty("/NewStatusType", "4");
					break;
				}
			}
		},

		_inconsistencyInformationHandling: function (oKeys) {
			if (oKeys.CsticId[0] === "INCONSISTENCY_INFO_CONTROL") {
				var sInconsistencyStateId = oKeys.TechnicalValue[0] || oKeys.ValueId[0].substring(0, 1) + oKeys.ValueId[0].substring(1).toLowerCase();

				this._oMockdata.setProperty("/InconsistencyState", sInconsistencyStateId);
			}
		},

		_handlePricing: function (oKeys) {
			if (oKeys.CsticId[0] === "PRICING_TEST_COLOR" && oKeys.ValueId[0] === "RED") {
				this._oMockdata.setProperty("/NewPrice", 200);
			}
		},

		_handleStatus: function (oKeys, oSelectedCsticData) {
			if (oKeys.CsticId[0] === "StatusCstic") {
				var aCstics = this._oMockdata.getProperty("/CharacteristicGroups/0/Characteristics/results");
				this._adjustDataToCurrentState(aCstics, oSelectedCsticData.Characteristic);
				this._oMockdata.setProperty("/CharacteristicGroups/0/Characteristics/results", aCstics);
			}
		},

		_changeGroupsBeforeDisplay: function (aGroups, oEvt) {
			var bIsSingleValued = false;
			var aDomainValues;
			var aAssignedValues;
			var sAssignedValueId;

			if (this.getLocalMockserver().getGroupCount()) {
				// restrict to the number of requested groups
				aGroups.splice(this.getLocalMockserver().getGroupCount());
			}

			var setAssignedValuesForSingleValuedCstic = function (oDomainValue) {
				if (oDomainValue.ValueId === sAssignedValueId && (oDomainValue.Assigned || oDomainValue.IsDefaultValue)) {
					aAssignedValues.push(oDomainValue);
				}
			};

			var setAssignedValuesForMultiValuedCstic = function (oDomainValue) {
				if (oDomainValue.Assigned || oDomainValue.IsDefaultValue) {
					aAssignedValues.push(oDomainValue);
				}
			};

			var setAssignedValuesForCstic = function () {
				// Check that domain values contain equel or more cstics than assigned values
				if (!aDomainValues || !aAssignedValues) {
					return;
				}

				aAssignedValues.splice(0, aAssignedValues.length);
				aDomainValues.forEach(function (oDomainValue) {
					if (bIsSingleValued) {
						setAssignedValuesForSingleValuedCstic(oDomainValue);
					} else {
						setAssignedValuesForMultiValuedCstic(oDomainValue);
					}
				});
			};

			aGroups.forEach(function (oGroup) {
				var aCstics = oGroup.Characteristics.results;
				if (aCstics) {
					var iCharacteristicCount = this.getLocalMockserver().getCharacteristicCount();
					if (iCharacteristicCount !== null && oGroup.CsticCount > iCharacteristicCount) {
						aCstics.splice(iCharacteristicCount);
						oEvt.getParameter("oFilteredData").results[0].CsticCount = iCharacteristicCount;
						oGroup.CsticCount = iCharacteristicCount;
					}

					for (var i = 0; i < aCstics.length; i++) {
						aDomainValues = aCstics[i].DomainValues.results;
						aAssignedValues = aCstics[i].AssignedValues.results;
						bIsSingleValued = aCstics[i].IsSingleValued;
						sAssignedValueId = aCstics[i].AssignedValueId;
						setAssignedValuesForCstic();
					}
				}
			}.bind(this));
		},

		_lockHandling: function (oXhr, sStatusDescription, sStatusType) {
			if (oXhr.readyState === 4) {
				return;
			}
			this._oMockdata.setProperty("/NewStatusDescription", sStatusDescription);
			this._oMockdata.setProperty("/NewStatusType", sStatusType);
			oXhr.respondJSON(200, {}, this._emptyResponse);
		},

		_moveInstance: function (sUrlParams, aMoveFrom, aMoveTo) {
			var iIndex = sUrlParams.indexOf("InstanceId") + 12;
			var iInstanceId = sUrlParams.substring(iIndex, iIndex + 12);
			for (var i = 0; i < aMoveFrom.length; i++) {
				var oClass = aMoveFrom[i];

				if (oClass.InstanceId.toString() === iInstanceId) {
					aMoveTo.push(oClass);
					aMoveFrom.splice(i, 1);
					break;
				}
			}
		},

		_assignDefaultValue: function (aDomainValues) {
			aDomainValues.forEach(function (oDomValue) {
				if (oDomValue.IsDefaultValue) {
					oDomValue.Assigned = true;
					oDomValue.IsDefaultValue = false;
				}
			});
		},

		_hasResponseCsticGroups: function (oData) {
			if (!oData) {
				return false;
			}

			if (!!this._getCsticGroupsFromResponse(oData).length) {
				return true;
			} else {
				return false;
			}
		},

		_getCsticGroupsFromResponse: function (oData) {
			if (oData.Instances && oData.Instances.results && oData.Instances.results[0].CharacteristicsGroups) {
				return oData.Instances.results[0].CharacteristicsGroups.results;
			} else if (oData.results && oData.results[0].CharacteristicsGroups) {
				return oData.results[0].CharacteristicsGroups.results;
			} else {
				return [];
			}
		},

		/****************************************************************PUBLIC METHODS*********************************************************************************/

		beforeCreateContextSet: function (oEvt) {
			var oXhr = oEvt.getParameter("oXhr");
			var mContextData = JSON.parse(oXhr.requestBody);
			mContextData.ContextId =
				"VCH(12)SEMANTIC_OBJ(12)SemanticObj1(10)OBJECT_KEY(10)ObjectKey1(9)DRAFT_KEY(9)DraftKey1(16)DRAFT_KEY_IS_STR(1)X(14)EMBEDDING_MODE(13)Configuration(15)LEGACY_SCENARIO(1)X(7)UI_MODE(4)Edit";
			oXhr.requestBody = JSON.stringify(mContextData);
		},

		beforeGetContextSet: function (oEvt) {
			if (oEvt.getParameter("sNavProp") === "InconsistencyInformation") {
				return;
			}
			var oMockserver = this.getMockserver();
			
			if (this._bAssignValueWasTriggered) {
				this._toggleGroupStatus();
			}
			var aConfContextSet = oMockserver.getEntitySetData("ConfigurationContextSet");
			if (this._oMockdata.getCharacteristicGroupSet() && this._oMockdata.getProperty("/NewStatusDescription")) {
				aConfContextSet[0].StatusDescription = this._oMockdata.getProperty("/NewStatusDescription"); // context for edit mode
				aConfContextSet[0].StatusType = this._oMockdata.getProperty("/NewStatusType");  // context for edit mode
				aConfContextSet[5].StatusDescription = this._oMockdata.getProperty("/NewStatusDescription"); //context for display mode
				aConfContextSet[5].StatusType = this._oMockdata.getProperty("/NewStatusType"); //context for display mode

				oMockserver.setEntitySetData("ConfigurationContextSet", aConfContextSet);
			}

			if (this._oMockdata.getCharacteristicGroupSet() && this._oMockdata.getProperty("/NewPrice")) {
				aConfContextSet[0].NetValue = this._oMockdata.getProperty("/NewPrice");  // context for edit mode
				aConfContextSet[5].NetValue = this._oMockdata.getProperty("/NewPrice"); //context for display mode 
				oMockserver.setEntitySetData("ConfigurationContextSet", aConfContextSet);
			}

			if (this._oMockdata.getCharacteristicGroupSet() && (this.getLocalMockserver().getEtoStatus() || this._oMockdata.getProperty("/NewETOStatus"))) {
				aConfContextSet[0].EtoStatus =  this._oMockdata.getProperty("/NewETOStatus") || this.getLocalMockserver().getEtoStatus();  // context for edit mode
				aConfContextSet[0].EtoStatusDescription = this._oMockdata.getProperty("/NewETOStatusDescription") || this.getLocalMockserver().getEtoStatusDescription();
				aConfContextSet[5].EtoStatusDescription = this._oMockdata.getProperty("/NewETOStatusDescription") || this.getLocalMockserver().getEtoStatusDescription();
				aConfContextSet[5].EtoStatus = this._oMockdata.getProperty("/NewETOStatus") || this.getLocalMockserver().getEtoStatus(); //context for display mode
				this.getMockserver().setEntitySetData("ConfigurationContextSet", aConfContextSet);
			}
			
			if (this._oMockdata.getProperty("/CreateOrderBOM")) {
				var aBOMNodeSet = oMockserver.getEntitySetData("BOMNodeSet");
				aBOMNodeSet[9].BOMCategory = "K";
				aBOMNodeSet[9].FixateState = "C";
				aBOMNodeSet[9].Quantity = 0;
				aBOMNodeSet[11].BOMCategory = "K";
				aBOMNodeSet[11].FixateState = "A";
				aBOMNodeSet[11].Quantity = 0;
				if (this._oMockdata.getProperty("/FixOrderBOMMode") === "2" ) {
					aBOMNodeSet[10].BOMCategory = "K";
					aBOMNodeSet[10].FixateState = "C";
					aBOMNodeSet[10].Quantity = 1;
				}
				this._oMockdata.setProperty("/CreateOrderBOM", false);
				this.getMockserver().setEntitySetData("BOMNodeSet", aBOMNodeSet);
			}

			if (this.getMockserver().getEntitySetData("BOMNodeSet")) {
				var aBOMNodes = this.getMockserver().getEntitySetData("BOMNodeSet");
				aBOMNodes.forEach(function (oBOMNode){
					if (oBOMNode.BOMComponentName === "BOM_COMPONENT_2_IN_EDIT_MODE" || oBOMNode.BOMComponentName === "BOM_COMPONENT_1_IN_EDIT_MODE"){
						oBOMNode.to_ConfigurationInstance =  {
								"ContextId": "VCH(12)SEMANTIC_OBJ(12)SemanticObj1(10)OBJECT_KEY(10)ObjectKey1(9)DRAFT_KEY(9)DraftKey1(16)DRAFT_KEY_IS_STR(1)X(14)EMBEDDING_MODE(10)Simulation(15)LEGACY_SCENARIO(1)X(7)UI_MODE(4)Edit",
								"InstanceId": "INSTANCE_ID_1",
								"ParentInstanceId": "PARENT_INSTANCE_ID_1",
								"Material": "MAT_01",
								"MaterialDescription": "Test Instance for BOM Node",
								"StatusId": "1",
								"StatusType": "1",
								"StatusDescription": "Released",
								"ConfigurationValidationStatus": "1",
								"ConfigurationValidationStatusDescription": "Validated",
								"deferred": {
									"uri" : "/sap/opu/odata/SAP/LO_VCHCLF/BOMNodeSet('00000001-00000012-00000013')/to_ConfigurationInstance"
								}
							};
					}
				});
				this.getMockserver().setEntitySetData("BOMNodeSet", aBOMNodes);
			}
			
			
			if (this._oMockdata.getProperty("/DeleteBOMItem")) {
				var aBOMNodeSet = oMockserver.getEntitySetData("BOMNodeSet");
				this._oMockdata.setProperty("/DeleteBOMItem", false);
				aBOMNodeSet.splice(10, 1);
				this.getMockserver().setEntitySetData("BOMNodeSet", aBOMNodeSet);
			}
			
			if (this._oMockdata.getProperty("/InsertBOMItem")) {
				var aBOMNodes = this.getMockserver().getEntitySetData("BOMNodeSet");
				var oNewBOMNodeData = this._oMockdata.getProperty("/InsertBOMItem");
				var oNewBOMNode = jQuery.extend({}, aBOMNodes[10]);
				oNewBOMNode = jQuery.extend(oNewBOMNode, oNewBOMNodeData); 
				oNewBOMNode.Product = oNewBOMNodeData.BOMComponentName || "NEW_BOM_ITEM";
				oNewBOMNode.BOMComponentName = oNewBOMNodeData.BOMComponentName || "NEW_BOM_ITEM";
				oNewBOMNode.ProductName = "New BOM item";
				oNewBOMNode.BOMCategory = "K";
				oNewBOMNode.ComponentId = "NEW_COMPONENT_" + Math.floor(Math.random() * Math.floor(100));
				aBOMNodes.push(oNewBOMNode);
				this.getMockserver().setEntitySetData("BOMNodeSet", aBOMNodes);
				this._oMockdata.setProperty("/InsertBOMItem", null);
			}
			
		},

		afterGetContextSet: function (oEvt) {
			var aGroups = [];

			var sUri = oEvt.getParameter("oXhr").url;
			var iIndex = sUri.indexOf("/ConfigurationContext");
			var sConfigurationContextUri = sUri.slice(iIndex);
			var oData = oEvt.getParameter("oFilteredData") || oEvt.getParameter("oEntry");

			if (sUri.includes("BOMNode") && oEvt.getParameter("oFilteredData") && oEvt.getParameter("oFilteredData").results.length === 1 &&
				oEvt.getParameter("oFilteredData").results[0].BOMComponentName) {
				oEvt.getParameter("oFilteredData").results[0].DrilldownState = "leaf";
				return;
			}

			if (sConfigurationContextUri === sConfigurationContextURI) {
				oData.VariantMatchingIndicator = this.getLocalMockserver().getVariantMatchingIndicator();

				if (this.getLocalMockserver().getPricingActive()) {
					oData.PricingActive = 'X';
				} else {
					oData.PricingActive = ' ';
				}
			}

			if (this._hasResponseCsticGroups(oData)) {
				aGroups = this._getCsticGroupsFromResponse(oData);
			}

			if (this._oMockdata.getCharacteristicGroupSet().length > 0) {
				aGroups = this._oMockdata.getCharacteristicGroupSet();
			}

			if (!aGroups) {
				return;
			}

			if (aGroups.length === 0) {
				return;
			}

			if (aGroups[0].Characteristics && aGroups[0].Characteristics.results) {
				this._changeGroupsBeforeDisplay(aGroups, oEvt);
			}

			this._oMockdata.setCharacteristicGroupSet(aGroups);

			if (oData.InconsistencyInformation && oData.InconsistencyInformation.results) {
				switch (this._oMockdata.getProperty("/InconsistencyState")) {
				case "1":
					//1 object dependency with long text
					oData.InconsistencyInformation.results = oData.InconsistencyInformation.results.slice(0, 1);
					oData.Instances.results[0].ConfigurationValidationStatus = "4";
					break;
				case "2":
					//2 object dependencies with long text
					oData.InconsistencyInformation.results = oData.InconsistencyInformation.results.slice(0, 2);
					oData.Instances.results[0].ConfigurationValidationStatus = "4";
					break;
				case "3":
					//object dependencies without long text
					oData.InconsistencyInformation.results = oData.InconsistencyInformation.results.slice(2, 3);
					oData.Instances.results[0].ConfigurationValidationStatus = "4";
					break;
				case "4":
					//only cstic information, no object dependencies
					oData.InconsistencyInformation.results = oData.InconsistencyInformation.results.slice(3);
					oData.Instances.results[0].ConfigurationValidationStatus = "4";
					break;

				case "5":
					//1 object dependency with and 1 object dependency without documentation
					oData.InconsistencyInformation.results = oData.InconsistencyInformation.results.slice(1, 3);
					oData.Instances.results[0].ConfigurationValidationStatus = "4";
					break;
				case "6":
					//No inconsistency 
					oData.InconsistencyInformation.results = [];
					oData.Instances.results[0].ConfigurationValidationStatus = "1";
					break;
				default:
					//1 object dependency with long text
					if (oData.InconsistencyInformation && oData.InconsistencyInformation.results) {
						oData.InconsistencyInformation.results = oData.InconsistencyInformation.results.slice(0, 1);
					}

				}
			} else if (oData.results && oData.results[0].Details) {
				//Details of inconsistency information requested

			}
		},

		beforeGetInstanceSet: function (oEvt) {
			if (oEvt.getParameter("sNavProp") === "FullMatchingVariants") {
				return;
			}

			if (this._oMockdata.getCharacteristicGroupSet().length > 0) {
				var aGroups = this._oMockdata.getCharacteristicGroupSet(),
					aAllValues = [],
					aAllCstics = [];

				aGroups.forEach(function (oGroup) {
					var aCstics = oGroup.Characteristics.results;
					if (aCstics) {
						for (var i = 0; i < aCstics.length; i++) {
							aAllCstics.push(aCstics[i]);
							for (var n = 0; n < aCstics[i].DomainValues.results.length; n++) {
								aAllValues.push(aCstics[i].DomainValues.results[n]);
							}
						}
					}
				});

				if (aAllCstics.length > 1) {
					this.getMockserver().setEntitySetData("CharacteristicSet", aAllCstics);
				}

				if (aAllValues.length > 1) {
					this.getMockserver().setEntitySetData("CharacteristicValueSet", aAllValues);
				}
			}
		},

		afterGetInstanceSet: function (oEvt) {
			var oData = oEvt.getParameter("oFilteredData") || oEvt.getParameter("oEntry");
			var aGroups = oData.results;
			if (aGroups && aGroups.length > 0 && aGroups[0].Characteristics && aGroups[0].Characteristics.results) {
				this._changeGroupsBeforeDisplay.call(this, aGroups, oEvt);
				this._oMockdata.setCharacteristicGroupSet(aGroups);
			}
		},

		beforeGetCharacteristicGroups: function (oEvt) {
			if (!oEvt.getParameter("sUrlParams")) {
				var oXhr = oEvt.getParameter("oXhr");
				var sReponse = JSON.stringify({
					d: {
						results: 100
					}
				});
				oXhr.responseText = sReponse;
			}

			if (this._bCharacteristicValueChanged) {
				var aGroups = this._oMockdata.getCharacteristicGroupSet(),
					aAllValues = [],
					aAllCstics = [];

				aGroups.forEach(function (oGroup) {
					var aCstics = oGroup.Characteristics.results;
					if (!aCstics) {
						return;
					}
					if (!aCstics[0].DomainValues.results) {
						return;
					}
					for (var i = 0; i < aCstics.length; i++) {
						aAllCstics.push(aCstics[i]);
						for (var n = 0; n < aCstics[i].DomainValues.results.length; n++) {
							aAllValues.push(aCstics[i].DomainValues.results[n]);
						}
					}
				});

				if (aAllCstics.length > 1) {
					this.getMockserver().setEntitySetData("CharacteristicSet", aAllCstics);
				}

				if (aAllValues.length > 1) {
					this.getMockserver().setEntitySetData("CharacteristicValueSet", aAllValues);
				}
			}
		},

		afterGetCharacteristicGroups: function (oEvt) {
			var oFilteredData = oEvt.getParameter("oFilteredData");
			var aGroups,
				oGroup = {};

			oGroup = {
				Characteristics: {
					results: oFilteredData.results
				},
				CsticCount: oFilteredData.results.length
			};
			aGroups = [oGroup];

			if (!aGroups[0].Characteristics.results) {
				return;
			}

			if (aGroups[0].Characteristics.results.length === 0) {
				return;
			}

			this._changeGroupsBeforeDisplay.call(this, aGroups, oEvt);

			var iGroup = oGroup.Characteristics.results[0].GroupId - 1;
			this._oMockdata.setProperty("/CharacteristicGroups/" + iGroup + "/Characteristics", oGroup.Characteristics);
		},

		afterGetClassificationContext: function (oEvt) {
			if (oEvt.getParameter("oXhr").url.indexOf("Assignable") !== -1) {
				var aValues = oEvt.getParameter("oFilteredData").results;
				var aResults = [];

				aValues.forEach(function (oClass) {
					if (oClass.ClassType !== oClass.InstanceId) {
						aResults.push(oClass);
					}
				});

				oEvt.getParameter("oFilteredData").results = aResults;
			}
		},

		afterGetRoutingSet: function (oEvt) {
			var oFilteredData = oEvt.getParameter("oFilteredData");

			var iRootNodeCount = $.grep(oFilteredData.results, function (oElement) {
				return oElement.NodeId === "0_0";
			}).length;

			// Remove all of the Routing Nodes if the count of the RootNode items is not 1
			if (iRootNodeCount !== 1) {
				oFilteredData.results = [];
			}
		},

		// eslint-disable-next-line complexity
		afterGetTraceEntrySet: function (oEvt) {
			var oTraceEntry = oEvt.getParameter("oEntry");
			var i, j, oCstic;

			if (!oTraceEntry) {
				return;
			}

			if (!oTraceEntry.to_VariantTables.results) {
				oTraceEntry.to_VariantTables.results = [];
			}

			if ($.isEmptyObject(oTraceEntry.to_TracePricingFactor)) {
				oTraceEntry.to_TracePricingFactor = null; // eslint-disable-line camelcase
			}

			if ($.isEmptyObject(oTraceEntry.to_TraceBAdI)) {
				oTraceEntry.to_TraceBAdI = null; // eslint-disable-line camelcase
			}

			// Remove the non before characteristics / cstic values from the to_TraceBeforeCharacteristics
			for (i = oTraceEntry.to_TraceBeforeCharacteristics.results.length - 1; i >= 0; i--) {
				oCstic = oTraceEntry.to_TraceBeforeCharacteristics.results[i];

				if (oTraceEntry.to_TraceBeforeCharacteristics.results[i].IOType.indexOf("B") === -1) {
					oTraceEntry.to_TraceBeforeCharacteristics.results.splice(i, 1);
				} else {
					for (j = oCstic.to_TraceCharacteristicValues.results.length - 1; j >= 0; j--) {
						if (oCstic.to_TraceCharacteristicValues.results[j].IOType.indexOf("B") === -1) {
							oCstic.to_TraceCharacteristicValues.results.splice(j, 1);
						}
					}
				}
			}

			// Remove the non result characteristics / cstic values from the to_TraceBeforeCharacteristics
			for (i = oTraceEntry.to_TraceResultCharacteristics.results.length - 1; i >= 0; i--) {
				oCstic = oTraceEntry.to_TraceResultCharacteristics.results[i];

				if (oTraceEntry.to_TraceResultCharacteristics.results[i].IOType.indexOf("R") === -1) {
					oTraceEntry.to_TraceResultCharacteristics.results.splice(i, 1);
				} else {
					for (j = oCstic.to_TraceCharacteristicValues.results.length - 1; j >= 0; j--) {
						if (oCstic.to_TraceCharacteristicValues.results[j].IOType.indexOf("R") === -1) {
							oCstic.to_TraceCharacteristicValues.results.splice(j, 1);
						}
					}
				}
			}

			// Remove the non input object dependencies from the to_InputTraceObjectDependencies
			for (i = oTraceEntry.to_InputTraceObjectDependencies.results.length - 1; i >= 0; i--) {
				if (oTraceEntry.to_InputTraceObjectDependencies.results[i].IOType.indexOf("I") === -1) {
					oTraceEntry.to_InputTraceObjectDependencies.results.splice(i, 1);
				}
			}

			// Remove the non result object dependency results from the to_ResultDependencyResults
			for (i = oTraceEntry.to_ResultDependencyResults.results.length - 1; i >= 0; i--) {
				if (oTraceEntry.to_ResultDependencyResults.results[i].IOType.indexOf("R") === -1) {
					oTraceEntry.to_ResultDependencyResults.results.splice(i, 1);
				}
			}

			// Remove the non before object dependency results from the to_BeforeDependencyResults
			for (i = oTraceEntry.to_BeforeDependencyResults.results.length - 1; i >= 0; i--) {
				if (oTraceEntry.to_BeforeDependencyResults.results[i].IOType.indexOf("B") === -1) {
					oTraceEntry.to_BeforeDependencyResults.results.splice(i, 1);
				}
			}

			// Remove the non result cstic results from the to_ResultCharacteristicResults
			for (i = oTraceEntry.to_ResultCharacteristicResults.results.length - 1; i >= 0; i--) {
				if (oTraceEntry.to_ResultCharacteristicResults.results[i].IOType.indexOf("R") === -1) {
					oTraceEntry.to_ResultCharacteristicResults.results.splice(i, 1);
				}
			}

			// Remove the non before cstic results from the to_BeforeCharacteristicResults
			for (i = oTraceEntry.to_BeforeCharacteristicResults.results.length - 1; i >= 0; i--) {
				if (oTraceEntry.to_BeforeCharacteristicResults.results[i].IOType.indexOf("B") === -1) {
					oTraceEntry.to_BeforeCharacteristicResults.results.splice(i, 1);
				}
			}
		},

		beforeGetInconsistencyInformationSet: function (oEvt) {},

		afterGetInconsistencyInformationSet: function (oEvt) {},

		/**
		 * Updates the Assigned property in the mapped filter data for Characteristic Value Set
		 * @param {Object} oCsticData contains keys to find the right characteristic value for update
		 * @param {Array} [oCsticData.ContextId] Id of configuration context
		 * @param {Array} [oCsticData.InstanceId] Id of configuration instance
		 * @param {Array} [oCsticData.GroupId] Id of characteristic group
		 * @param {Array} [oCsticData.CsticId] Id of characteristic 
		 * @param {Array} [oCsticData.ValueId] Id of characteristic value
		 * @param {Object} [oSelectedCsticData] contains selected characteristic and values 
		 * @public
		 * @function
		 */
		assignValue: function (oCsticData, oSelectedCsticData) {
			var aDomainValues = oSelectedCsticData.Characteristic.DomainValues.results;
			var oNewCsticData = {};

			this._bAssignValueWasTriggered = true; 
			
			// These cases can't be exclusive "elseif" as multi-val cstics can have string (manual) and tech assignments in one request
			if (oCsticData.StringValue && oCsticData.StringValue[0]) {
				for (var ii = 0; ii < oCsticData.StringValue.length; ii++) {
					if (this._setDomainValue(aDomainValues, oCsticData.StringValue[ii])) {
						continue;
					}

					if (!!oSelectedCsticData.Characteristic.AdditionalValuesAllowed || (!oSelectedCsticData.Characteristic.AdditionalValuesAllowed ||
							oSelectedCsticData.Characteristic.ValueCount === 0)) {
						oNewCsticData = this._createAdditionalValue(oCsticData, ii);
						aDomainValues.push(oNewCsticData);
					}
				}
			}

			if (oCsticData.TechnicalValue && oCsticData.TechnicalValue !== "") {
				for (var x = 0; x < oCsticData.TechnicalValue.length; x++) {
					if (oCsticData.TechnicalValue[x] !== "") {
						// Normally, tech values can't create additional values but when user values are created, they receive a tech value,
						// the mockserver doesn't remember domain additions after the batch of POST+GET, then next batch POST sends previous additional
						// value back in as tech value and has to be recreated from tech input. Only on mockserver
						if (this._setDomainValue(aDomainValues, oCsticData.TechnicalValue[x])) {
							continue;
						}

						if (!!oSelectedCsticData.Characteristic.AdditionalValuesAllowed || (!oSelectedCsticData.Characteristic.AdditionalValuesAllowed ||
								oSelectedCsticData.Characteristic.ValueCount === 0)) {
							oNewCsticData = this._createAdditionalValueFromTechValue(oCsticData, x);
							aDomainValues.push(oNewCsticData);
						}
					}
				}
			}

			if (!oCsticData.TechnicalValue[0]) {
				this._assignDefaultValue(aDomainValues);
			}
		},

		updateCsticValue: function (fnCallback1, fnCallback2, oXhr, sUrlParams) {
			// sometimes the ready state is already done=4 although the request is currently processing=1
			// this causes OPA test failures
			if (oXhr.readyState === 4) {
				return;
			}

			var oKeys = this._getKeyMap(sUrlParams);
			var oSelectedCsticData = this._getSelectedCharacteristic(oKeys);

			if (!oSelectedCsticData.hasOwnProperty("Characteristic")) {
				oXhr.respondJSON(200, {}, this._emptyResponse);
				return;
			}

			var aDomainValues = oSelectedCsticData.Characteristic.DomainValues.results;
			var bIsSigleValued = oSelectedCsticData.Characteristic.IsSingleValued;

			fnCallback1.call(this, oKeys, oSelectedCsticData);
			this._resetDefaultValues(aDomainValues);

			if (fnCallback2) {
				oSelectedCsticData.Characteristic.HasDefaultValues = false;
				fnCallback2.call(this, oKeys, oSelectedCsticData);
			}

			this._restoreDefaultValues(aDomainValues, bIsSigleValued);
			this._configurationStatusHandling(oKeys);
			this._inconsistencyInformationHandling(oKeys);
			this._updateCsticData(oSelectedCsticData);
			this._handlePricing(oKeys);
			this._handleStatus(oKeys, oSelectedCsticData);
			this._bCharacteristicValueChanged = true;

			oXhr.respondJSON(200, {}, { d: {
				CharacteristicValueAssign: {
					Success: true
				}
			}});
		},

		/**
		 * Calls single/ multi value unassign
		 * @param {Object} [oCsticData] contains keys to find the right characteristic value for update
		 * @param {Array} [oCsticData.ContextId] Id of configuration context
		 * @param {Array} [oCsticData.InstanceId] Id of configuration instance
		 * @param {Array} [oCsticData.GroupId] Id of characteristic group
		 * @param {Array} [oCsticData.CsticId] Id of characteristic 
		 * @param {Array} [oCsticData.ValueId] Id of characteristic value
		 * @param {Object} [oSelectedCsticData] contains selected characteristic and values 
		 * @public
		 * @function
		 */
		unassignValue: function (oCsticData, oSelectedCsticData) {
			if (oSelectedCsticData.Characteristic.IsSingleValued) {
				this._unassignSingleValuedCstic(oSelectedCsticData);
			} else {
				if (oCsticData.TechnicalValue.length >= 1 && oCsticData.TechnicalValue[0]) {
					if (oSelectedCsticData.Characteristic.AdditionalValuesAllowed) {
						this._unassignAllValuesConsideringAdditional(oSelectedCsticData, oCsticData);
						return;
					}
					this.unassignAllValues(oCsticData, oSelectedCsticData);
				} else if (!oCsticData.TechnicalValue[0] && !oCsticData.ValueId[0]) {
					this.unassignAllValues(oCsticData, oSelectedCsticData);
				}
			}
		},

		discardConfigurationDraft: function (oXhr) {
			if (oXhr.readyState === 4) {
				return;
			}
			this.getLocalMockserver().restart();
			oXhr.respondJSON(200, {}, this._emptyResponse);
		},

		lockConfiguration: function (oXhr) {
			this._lockHandling(oXhr, "Locked", "2");
		},

		unlockConfiguration: function (oXhr) {
			this._lockHandling(oXhr, "Released", "1");
		},

		calculatePricing: function (oXhr) {
			if (oXhr.readyState === 4) {
				return;
			}
			if (!this._bInitialCall) {
				this._oMockdata.setProperty("/NetValue", "200");
			}
			this._bInitialCall = false;
			oXhr.respondJSON(200, {}, this._emptyResponse);
		},

		switchToETO: function (oXhr) {
			if (oXhr.readyState === 4) {
				return;
			}
			if (!this._bInitialCall) {
				this._oMockdata.setProperty("/NewETOStatus", Constants.ETO_STATUS.PROCESSING_STARTED);
				this._oMockdata.setProperty("/NewETOStatusDescription", "ETO Started");
			}
			this._bInitialCall = false;
			oXhr.respondJSON(200, {}, this._emptyResponse);
		},

		setETOStatus: function (oXhr) {
			if (oXhr.readyState === 4) {
				return;
			}
			var sStatus = oXhr.url.substring(oXhr.url.indexOf("&Status="));
			var sStatusValue = sStatus.substring(sStatus.length - 6, sStatus.length - 1);
			this._oMockdata.setProperty("/NewETOStatus", sStatusValue);
			switch (sStatusValue) {
			case Constants.ETO_STATUS.READY_FOR_ENGINEERING: 
				this._oMockdata.setProperty("/NewETOStatusDescription", "Ready for Engineering");
				break;
			case Constants.ETO_STATUS.REENGINEERING_NEEDED: 
				this._oMockdata.setProperty("/NewETOStatusDescription", "Reengineering needed");
				break;
			case Constants.ETO_STATUS.REVISED_BY_SALES: 
				this._oMockdata.setProperty("/NewETOStatusDescription", "Revised by Sales");
				break;
			case Constants.ETO_STATUS.PROCESSING_FINISHED: 
				this._oMockdata.setProperty("/NewETOStatusDescription", "ETO finished");
				break;
			case Constants.ETO_STATUS.REVIEW_FINISHED_BY_SALES: 
				this._oMockdata.setProperty("/NewETOStatusDescription", "Review done by Sales");
				break;
			default:
				this._oMockdata.setProperty("/NewETOStatusDescription", "Ready for Engineering");
				break;
			}

			sap.m.MessageToast.show("New ETO Status Set Successfully");

			oXhr.respondJSON(200, {}, this._emptyResponse);
		},
		
		getTraceEntryDetail: function (oXhr) {
			var sUrl = decodeURI(oXhr.url);
			var sNavProperty = "to_TraceEntry";
			var sEntityName = "TraceEntrySet";
			var sService = sUrl.slice(0, sUrl.indexOf("ConfigurationContextSet"));
			var sUrlParameter = sUrl.slice(sUrl.indexOf(sNavProperty) + sNavProperty.length);

			oXhr.url = sService + sEntityName + sUrlParameter;

			this.getMockserver().fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.GET + sEntityName, {
				oXhr: oXhr
			});
		},

		getTraceEntriesForCharacteristic: function (oXhr) {
			var sUrl = decodeURI(oXhr.url);
			var sNavPropertyFrom = "to_TraceCharacteristic";
			var sNavPropertyTo = "to_TraceEntry";
			var sEntityName = "TraceEntrySet";

			var sConfigurationContext = sUrl.slice(0, sUrl.indexOf(sNavPropertyFrom));
			//TODO: add filter if restriction of trace feed is needed

			oXhr.url = sConfigurationContext + sNavPropertyTo;
			this.getMockserver().fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.GET + sEntityName, {
				oXhr: oXhr
			});
		},

		getTraceCharacteristicVH: function (oXhr) {
			this._handleGenericTraceVH(
				oXhr,
				"TraceCharacteristicVHSet", //EntityName
				"CsticName", //NameProperty
				"Description" //DescProperty
			);
		},

		getTraceDependencyVH: function (oXhr) {
			this._handleGenericTraceVH(
				oXhr,
				"TraceObjectDependencyVH", //EntityName
				"ObjectDependencyName", //NameProperty
				"Description" //DescProperty
			);
		},

		_handleGenericTraceVH: function (oXhr, sEntityName,
			sNameProperty, sDescProperty) {
			var sUrl = decodeURI(oXhr.url);
			var rSearchText = /search\=[a-zA-Z0-9]+/g;
			var aSearchTextResult = rSearchText.exec(sUrl);

			// Convert the search text to filter conditions in the URL
			if ($.isArray(aSearchTextResult) && aSearchTextResult.length > 0) {
				var sSearchText = aSearchTextResult[0].split("=")[1];
				var rFilter = /\$filter\=/g;
				var sSearchFilter = "$filter=(substringof('" + sSearchText + "'," + sNameProperty + ")' " +
					"or substringof('" + sSearchText + "'," + sDescProperty + ")')";

				if (rFilter.test(sUrl)) {
					sUrl = sUrl.replace("$filter=", sSearchFilter + " and ");
				} else {
					sUrl += "&" + sSearchFilter;
				}

				oXhr.url = sUrl;
			}

			this.getMockserver().fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.GET + sEntityName, {
				oXhr: oXhr
			});
		},

		getBOMNodesStructureTree: function (oXhr) {
			var sUrl = decodeURI(oXhr.url);

			var sNavProperty = "BOMNodes";
			var sEntity = sUrl.slice(0, sUrl.indexOf(sNavProperty) + sNavProperty.length);
			var sUrlParameter = sUrl.slice(sUrl.indexOf(sNavProperty) + sNavProperty.length);

			// remove the ParentComponentId filter in case of filter for the root component
			sUrlParameter = sUrlParameter.replace(" and ParentComponentId eq '0'", ""); //remove from the end or the middle
			sUrlParameter = sUrlParameter.replace("ParentComponentId eq '0' and ", ""); //remove from the beginning
			sUrlParameter = sUrlParameter.replace("ParentComponentId eq '0'", ""); //remove if only this is the filter

			// extend the filters with ConfiguredComponentId eq ''
			sUrlParameter += " and ConfiguredComponentId eq ''";

			oXhr.url = sEntity + sUrlParameter;

			this.getMockserver().fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.GET + sEntity, {
				oXhr: oXhr,
				sUrlParameters: sUrlParameter
			});
		},

		getBOMNodes: function (oXhr) {
			var sUrl = oXhr.url;

			if ((sUrl.includes("/to_Routings") && sUrl.includes("/to_RoutingNodes")) || sUrl.includes("/to_RoutingNodes")) {
				this.getRoutingNodes(oXhr, "RoutingNodeSet", "to_RoutingNodes");
			} else {
				var sEntityName = "BOMNodeSet";
				var sNavProperty = "BOMNodes";
				var sService = sUrl.slice(0, sUrl.indexOf("ConfigurationContextSet"));
				var sUrlParameter = sUrl.slice(sUrl.indexOf(sNavProperty) + sNavProperty.length);

				oXhr.url = sService + sEntityName + sUrlParameter;
				this.getMockserver().fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.GET + sEntityName, {
					oXhr: oXhr,
					sUrlParameters: sUrlParameter
				});
			}
		},

		getRoutingNodes: function (oXhr, sEntityName, sNavProperty) {
			var sUrl = oXhr.url;
			var sService = sUrl.slice(0, sUrl.indexOf("ConfigurationContextSet"));
			var sUrlParameter = sUrl.slice(sUrl.indexOf(sNavProperty) + sNavProperty.length);
			var rBOMNode = /BOMNodes\('\d+-\d+-\d+'\)\/to_RoutingNodes/;
			var rRoutingNodes = /to_RoutingNodes\(.*\)*/;
			var rRoutings = /to_Routings(.*)\/to_RoutingNodes/;

			var sEntityPath;

			if (rBOMNode.test(sUrl)) {
				sEntityPath = rBOMNode.exec(sUrl)[0].replace("BOMNodes", "BOMNodeSet");
			} else if (rRoutingNodes.test(sUrl)) {
				sEntityPath = rRoutingNodes.exec(sUrl)[0].replace(rRoutingNodes, "RoutingNodeSet");
			} else if (rRoutings.test(sUrl)) {
				sEntityPath = rRoutings.exec(sUrl)[0].replace("to_Routings", "RoutingSet");
			} else {
				sEntityPath = sEntityName;
			}

			var sFilter = "";
			var rFilter = /\?\$filter\=/;
			var rSequence = /BillOfOperationsSequence\%20eq/;
			var rEntity = /\((.*)\)/;

			if (rSequence.test(sUrlParameter)) {
				sUrlParameter = sUrlParameter.replace(rSequence, "TreeId%20eq");
			} else if (rFilter.test(sUrlParameter)) {
				sFilter = " and TreeId eq '0'";
			} else if (!rEntity.test(sUrlParameter)) {
				sFilter = "?$filter=TreeId eq '0'";
			}

			oXhr.url = sService + sEntityPath + sUrlParameter + sFilter;
			this.getMockserver().fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.GET + sEntityName, {
				oXhr: oXhr,
				sUrlParameters: sUrlParameter
			});
		},

		getOperationStandardValues: function (oXhr) {
			var rTreeId = /TreeId='(\d+)'/;
			var rNodeId = /NodeId='(\d+_\d+)'/;
			var sTreeId = "";
			var sNodeId = "";

			var sUrl = oXhr.url;
			var sService;

			if (sUrl.includes("ConfigurationContextSet") && sUrl.includes("/to_Routings") && sUrl.includes("/to_RoutingNodes")) {
				sService = sUrl.slice(0, sUrl.indexOf("ConfigurationContextSet"));
			} else {
				sService = sUrl.slice(0, sUrl.indexOf("RoutingNodeSet"));
			}

			var sEntityName = "StandardValueSet";
			//There is no direct connection between the RoutingNode and StandardValue
			//This is mocked by getting Routing Properties and filtering according to that in the Standard Values
			//Properties used are OperationSet Keys which are also added to the metadata properties of StandardValue entity
			var aRoutingNodes = this.getMockserver().getEntitySetData("RoutingNodeSet");
			if (rTreeId.test(sUrl)) {
				sTreeId = rTreeId.exec(sUrl)[1];
			}
			if (rNodeId.test(sUrl)) {
				sNodeId = rNodeId.exec(sUrl)[1];
			}

			var oRouteNode = aRoutingNodes.find(function (oElement) {
				return oElement.NodeId === sNodeId &&
					oElement.TreeId === sTreeId;
			});
			var sFilter = "";
			if (oRouteNode) {
				sFilter = "?$filter=BillOfOperationsNode eq '" + oRouteNode.BillOfOperationsNode + "'&" +
					"BillOfOperationsGroup eq '" + oRouteNode.BillOfOperationsGroup + "'&" +
					"BillOfOperationsOperation eq '" + oRouteNode.BillOfOperationsOperation + "'&" +
					"BillOfOperationsSequence eq '" + oRouteNode.BillOfOperationsSequence + "'&" +
					"BillOfOperationsType eq '" + oRouteNode.BillOfOperationsType + "'&" +
					"BillOfOperationsVariant eq '" + oRouteNode.BillOfOperationsVariant + "'";
			}

			oXhr.url = sService + sEntityName + sFilter;
			this.getMockserver().fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.GET + sEntityName, {
				oXhr: oXhr
			});
		},

		getOperationPRT: function (oXhr) {
			var sUrl = oXhr.url;
			var sService;

			if (sUrl.includes("ConfigurationContextSet") && sUrl.includes("/to_Routings") && sUrl.includes("/to_RoutingNodes")) {
				sService = sUrl.slice(0, sUrl.indexOf("ConfigurationContextSet"));
			} else {
				sService = sUrl.slice(0, sUrl.indexOf("RoutingNodeSet"));
			}
			var sEntityName = "OperationPRTSet";
			var sUrlParameter = sUrl.slice(sUrl.indexOf("to_OperationPRT") + 15);

			oXhr.url = sService + sEntityName + sUrlParameter;
			this.getMockserver().fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.GET + sEntityName, {
				oXhr: oXhr,
				sUrlParameters: sUrlParameter
			});
		},

		handleClassificationInstanceChange: function (oXhr, sUrlParams) {
			var aAssignedClasses = this.getMockserver().getEntitySetData("ClassificationInstanceSet");
			this._moveInstance(sUrlParams, aAssignedClasses, this._assignableClasses);
			this._oMockServer.setEntitySetData("ClassificationInstanceSet", aAssignedClasses);
			oXhr.respondJSON(200, {}, this._emptyResponse);
		},

		unassignClass: function (oXhr, sUrlParams) {
			var aAssignedClasses = this.getMockserver().getEntitySetData("ClassificationInstanceSet");
			var iIndex = sUrlParams.indexOf("InstanceId") + 12;
			var iInstanceId = sUrlParams.substring(iIndex, iIndex + 4);
			var sClassType = "";

			for (var i = 0; i < aAssignedClasses.length; i++) {
				var oClass = aAssignedClasses[i];

				if (oClass.InstanceId.toString() === iInstanceId) {
					sClassType = oClass.ClassType;
					aAssignedClasses.splice(i, 1);
					break;
				}
			}

			var iClassesInClassType = 0;

			for (i = 0; i < aAssignedClasses.length; i++) {
				oClass = aAssignedClasses[i];

				if (oClass.ClassType === sClassType) {
					iClassesInClassType++;
				}
			}

			if (!iClassesInClassType) {
				aAssignedClasses.push({
					ClassType: sClassType,
					IsVisible: false
				});
			}

			this.getMockserver().setEntitySetData("ClassificationInstanceSet", aAssignedClasses);

			var oData = {
				d: {
					results: []
				}
			};
			oXhr.respondJSON(200, {}, JSON.stringify(oData));
		},

		explodeBOM: function (oXhr) {
			if (oXhr.readyState === 4) {
				return;
			}
			oXhr.respondJSON(200, {}, this._emptyResponse);
		},

		explodeRouting: function (oXhr) {
			if (oXhr.readyState === 4) {
				return;
			}
			oXhr.respondJSON(200, {}, this._emptyResponse);
		},

		activateTrace: function (oXhr) {
			if (oXhr.readyState === 4) {
				return;
			}
			oXhr.respondJSON(200, {}, this._emptyResponse);
		},

		deactivateTrace: function (oXhr) {
			if (oXhr.readyState === 4) {
				return;
			}
			oXhr.respondJSON(200, {}, this._emptyResponse);
		},

		isTraceActive: function (oXhr) {
			if (oXhr.readyState === 4) {
				return;
			}
			oXhr.respondJSON(200, {}, this._emptyResponse);
		},

		clearTrace: function (oXhr) {
			if (oXhr.readyState === 4) {
				return;
			}
			oXhr.respondJSON(200, {}, this._emptyResponse);
		},

		createOrderBOM: function (oXhr) {
			if (oXhr.readyState === 4) {
				return;
			}
			var sFixOrderBOMMode = oXhr.url.substr(oXhr.url.indexOf("FixOrderBOMMode"));
			sFixOrderBOMMode = sFixOrderBOMMode.substr(sFixOrderBOMMode.length - 1);
			this._oMockdata.setProperty("/CreateOrderBOM", true);
			this._oMockdata.setProperty("/FixOrderBOMMode", sFixOrderBOMMode);
			oXhr.respondJSON(200, {}, this._emptyResponse);
		},
		
		deleteBOMItem: function (oXhr) {
			if (oXhr.readyState === 4) {
				return;
			}
			this._oMockdata.setProperty("/DeleteBOMItem", true);
			oXhr.respondJSON(200, {}, this._emptyResponse);
		},

		calculateAlternativeValues: function (oXhr) {
			if (oXhr.readyState === 4) {
				return;
			}
			oXhr.respondJSON(200, {}, this._emptyResponse);
		},

		setPreferredVariant: function (oXhr) {
			if (oXhr.readyState === 4) {
				return;
			}
			oXhr.respondJSON(200, {}, this._emptyResponse);
		},

		createFullyMatchingProductVariant: function (oXhr) {
			if (oXhr.readyState === 4) {
				return;
			}
			var bPricingError = this.getLocalMockserver().getCreateProductVariantWithPricingError();
			var variantResponse = JSON.stringify({
				d: {
					CreateFullyMatchingProductVariant: {
						ProductKey: "DUMMY_PRODUCT",
						DraftKey: "DUMMY_DRAFT",
						Cuobj: "12345",
						PricingError: bPricingError
					}
				}
			});

			oXhr.respondJSON(200, {}, variantResponse);
		},

		validateConfiguration: function (oXhr) {
			if (oXhr.readyState === 4) {
				return;
			}
			oXhr.respondJSON(200, {}, JSON.stringify({
				d: {
					results: {
						ValidateConfiguration: {
							Success: true
						}
					}
				}
			}));
		},

		afterGetVariantValuationDifference: function (oEvent) {
			var aRefValues = [];
			var aVarValues = [];
			var aResults = oEvent.getParameter("oFilteredData").results;
			for (var i = 0; i < aResults.length; i++) {
				aRefValues = aResults[i].VariantValuatDiffCsticRefValues.results;
				for (var j = 0; j < aRefValues.length; j++) {
					if (aRefValues[j].ValType && aRefValues[j].ValType !== "Ref") {
						aRefValues.splice(j, 1);
					}
				}
				aVarValues = aResults[i].VariantValuatDiffCsticVarValues.results;
				for (var k = 0; k < aVarValues.length; k++) {
					if (aVarValues[k].ValType && aVarValues[k].ValType !== "Var") {
						aVarValues.splice(k, 1);
					}
				}
			}

		},
				
		afterCreateBOMNodeSet: function(oXhr){
			this._oMockdata.setProperty("/InsertBOMItem", oXhr.getParameter("oEntity"));
		},

		afterGetToggleSet: function (oXhr) {
			var aActiveToggles = this.getLocalMockserver().getActiveToggles();

			if (aActiveToggles) {
				$.each(oXhr.getParameter("oFilteredData").results, function (iIndex, oResult) {
					oResult.ToggleStatus = aActiveToggles.indexOf(oResult.ToggleId) === -1 ? "" : "X";
				});
			}
		}
	});

	return oMockserverHelper;
}, true);
