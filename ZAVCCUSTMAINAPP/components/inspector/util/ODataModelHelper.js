/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants"
], function (Constants) {
	"use strict";

	var CONFIGURATION_CONTEXT_NAV_PROP = Constants.navigationProperties.ConfigurationContext;
	var TRACE_CHARACTERISTIC_NAV_PROP = Constants.navigationProperties.TraceCharacteristic;
	var TRACE_DEPENDENCY_NAV_PROP = Constants.navigationProperties.TraceObjectDependency;

	var PROPERTY_NAME = Constants.propertyNames;

	/**
	 * Helper class for accessing the odata model from modules
	 * @class
	 */
	var ODataModelHelper = function () {
		/**
		 * Reference for the model object
		 * @type {sap.i2d.lo.lib.zvchclfz.common.odataFacade.ODataFacadeModel}
		 * @private
		 */
		this._model = null;
	};

	/**
	 * Initializer
	 * @public
	 * @param {sap.i2d.lo.lib.zvchclfz.common.odataFacade.ODataFacadeModel} oModel - OData facade model of the application
	 */
	ODataModelHelper.prototype.init = function (oModel) {
		this._model = oModel;
	};

	/**
	 * Getter for odata facade model
	 * Important: must not be used for odata binding under the assumption
	 * that requests are automatically issued -> any binding is clientside, data must be manually requested
	 * @public
	 * @returns {sap.i2d.lo.lib.zvchclfz.common.odataFacade.ODataFacadeModel} - OData facade model of the application
	 */
	ODataModelHelper.prototype.getModel = function () {
		return this._model;
	};

	/**
	 * Getter for origin odata model
	 * Important: can only be used for odata binding
	 * -> no direct access of data possible; any method invoked on that model must be present in v2 and v4!
	 * @public
	 * @returns {sap.ui.model.odata.v2.ODataModel} - returns a <code>sap.ui.model.odata.v2.ODataModel</code> or
	 * 														    <code>sap.ui.model.odata.v4.ODataModel</code>
	 */
	ODataModelHelper.prototype.getModelForODataBinding = function () {
		return this.getModel().getOriginModel();
	};

	/**
	 * Generates path for Configuration Context
	 * @param {String} sContextId - Configuration Context ID
	 * @returns {String} Configuration Context Path
	 * @public
	 */
	ODataModelHelper.prototype.generateConfigurationContextPath = function (sContextId) {
		return this._generatePath(
			"",
			Constants.entitySets.ConfigurationContext,
			[{
				key: PROPERTY_NAME.ContextId,
				value: sContextId
			}]
		);
	};

	/**
	 * Generates path for Characteristic
	 * @param {String} sContextId - Configuration Context ID
	 * @param {String} sInstanceId - Instance ID
	 * @param {String} sGroupId - Group ID
	 * @param {String} sCsticId - Cstic ID
	 * @returns {String} Characteristic Path
	 * @public
	 */
	ODataModelHelper.prototype.generateCharacteristicPath = function (sContextId, sInstanceId, sGroupId, sCsticId) {
		return this._generatePath(
			"",
			Constants.entitySets.Characteristic,
			[{
					key: PROPERTY_NAME.ContextId,
					value: sContextId
				},
				{
					key: PROPERTY_NAME.InstanceId,
					value: sInstanceId
				},
				{
					key: PROPERTY_NAME.GroupId,
					value: sGroupId,
					isNumeric: true
				},
				{
					key: PROPERTY_NAME.CsticId,
					value: sCsticId
				}
			]
		);
	};

	/**
	 * Gets the key values pair for Characteristic
	 * @param {String} sContextId - Configuration Context ID
	 * @param {String} sInstanceId - Instance ID
	 * @param {String} sGroupId - Group ID
	 * @param {String} sCsticId - Cstic ID
	 * @returns {Object} Characteristic Key Value Pairs
	 * @public
	 */
	ODataModelHelper.prototype.getCharacteristicKeyValuePairs = function (sContextId, sInstanceId, sGroupId, sCsticId) {
		var oKeyValuePairs = {};

		oKeyValuePairs[PROPERTY_NAME.ContextId] = sContextId;
		oKeyValuePairs[PROPERTY_NAME.InstanceId] = sInstanceId;
		oKeyValuePairs[PROPERTY_NAME.GroupId] = sGroupId;
		oKeyValuePairs[PROPERTY_NAME.CsticId] = sCsticId;

		return oKeyValuePairs;
	};

	/**
	 * Generates path for BOM Component
	 * @param {String} sContextId - Configuration Context ID
	 * @param {String} sBOMComponentId - BOM Component ID
	 * @returns {String} BOM Component Path
	 * @public
	 */
	ODataModelHelper.prototype.generateBOMComponentPath = function (sContextId, sBOMComponentId) {
		return this._generatePath(
			this.generateConfigurationContextPath(sContextId),
			Constants.navigationProperties.ConfigurationContext.BOMNode,
			[{
				key: PROPERTY_NAME.ComponentId,
				value: sBOMComponentId
			}]
		);
	};

	/**
	 * Generates path for Routing
	 * @param {String} sContextId - Configuration Context ID
	 * @param {String} sBOMComponentId - BOM Component ID
	 * @param {Object} oRoutingKey - Routing Key object
	 * @param {String} oRoutingKey.BillOfOperationsType - Bill of Operations Type
	 * @param {String} oRoutingKey.BillOfOperationsGroup - Bill of Operations Group
	 * @param {String} oRoutingKey.BillOfOperationsVariant - Bill of Operations Variant
	 * @returns {String} Routing Path
	 * @public
	 */
	ODataModelHelper.prototype.generateRoutingPath = function (sContextId, sBOMComponentId, oRoutingKey) {
		return this._generatePath(
			this.generateBOMComponentPath(sContextId, sBOMComponentId),
			Constants.navigationProperties.BOMNode.Routings,
			[{
					key: PROPERTY_NAME.BillOfOperationsType,
					value: oRoutingKey.BillOfOperationsType
				},
				{
					key: PROPERTY_NAME.BillOfOperationsGroup,
					value: oRoutingKey.BillOfOperationsGroup
				},
				{
					key: PROPERTY_NAME.BillOfOperationsVariant,
					value: oRoutingKey.BillOfOperationsVariant
				}
			]
		);
	};

	/**
	 * Generates path for Routing Node
	 * @param {String} sContextId - Configuration Context ID
	 * @param {String} sBOMComponentId - BOM Component ID
	 * @param {Object} oRoutingKey - Routing Key object
	 * @param {String} oRoutingKey.BillOfOperationsType - Bill of Operations Type
	 * @param {String} oRoutingKey.BillOfOperationsGroup - Bill of Operations Group
	 * @param {String} oRoutingKey.BillOfOperationsVariant - Bill of Operations Variant
	 * @param {String} sTreeId - Tree ID
	 * @param {String} sNodeId - Node ID
	 * @returns {String} Routing Node Path
	 * @public
	 */
	ODataModelHelper.prototype.generateRoutingNodePath =
		function (sContextId, sBOMComponentId, oRoutingKey, sTreeId, sNodeId) {
			return this._generatePath(
				this.generateRoutingPath(sContextId, sBOMComponentId, oRoutingKey),
				Constants.navigationProperties.Routing.RoutingNodes,
				[{
						key: PROPERTY_NAME.TreeId,
						value: sTreeId
					},
					{
						key: PROPERTY_NAME.NodeId,
						value: sNodeId
					}
				]
			);
		};

	/**
	 * Generates path for Routing PRT
	 * @param {String} sContextId - Configuration Context ID
	 * @param {String} sBOMComponentId - BOM Component ID
	 * @param {Object} oRoutingKey - Routing Key object
	 * @param {String} oRoutingKey.BillOfOperationsType - Bill of Operations Type
	 * @param {String} oRoutingKey.BillOfOperationsGroup - Bill of Operations Group
	 * @param {String} oRoutingKey.BillOfOperationsVariant - Bill of Operations Variant
	 * @param {String} sTreeId - Tree ID
	 * @param {String} sNodeId - Node ID
	 * @param {Object} oPRTKey - PRT Key object
	 * @param {String} oPRTKey.BOOOperationPRTInternalId - BOO Operation PRT Internal ID
	 * @param {String} oPRTKey.BOOOperationPRTIntVersCounter - BOO Operation PRT Internal Version Counter
	 * @returns {String} Routing PRT Path
	 * @public
	 */
	ODataModelHelper.prototype.generateRoutingPRTPath =
		function (sContextId, sBOMComponentId, oRoutingKey, sTreeId, sNodeId, oPRTKey) {
			return this._generatePath(
				this.generateRoutingNodePath(sContextId, sBOMComponentId, oRoutingKey, sTreeId, sNodeId),
				Constants.navigationProperties.RoutingNode.PRTs,
				[{
						key: PROPERTY_NAME.BillOfOperationsType,
						value: oRoutingKey.BillOfOperationsType
					},
					{
						key: PROPERTY_NAME.BillOfOperationsGroup,
						value: oRoutingKey.BillOfOperationsGroup
					},
					{
						key: PROPERTY_NAME.BOOOperationPRTInternalId,
						value: oPRTKey.BOOOperationPRTInternalId
					},
					{
						key: PROPERTY_NAME.BOOOperationPRTIntVersCounter,
						value: oPRTKey.BOOOperationPRTIntVersCounter
					}
				]
			);
		};

	/**
	 * Generates path for Object Dependency
	 * @param {String} sContextId - Configuration Context ID
	 * @param {String} sObjectDependency - Object Dependency
	 * @returns {String} Object Dependency Path
	 * @public
	 */
	ODataModelHelper.prototype.generateObjectDependencyPath = function (sContextId, sObjectDependency) {
		return this._generatePath(
			"",
			Constants.entitySets.ObjectDependencyDetails,
			[{
					key: PROPERTY_NAME.ContextId,
					value: sContextId
				},
				{
					key: PROPERTY_NAME.ObjectDependency,
					value: sObjectDependency
				}
			]
		);
	};

	/**
	 * Generates the Trace Entry path based on the Configuration Context Path and the Trace Entry keys
	 * @param {String} sConfigurationContextPath - Configuration Context Path
	 * @param {String} sTraceGuid - Trace Guid property of the entry
	 * @param {int} iRoundtripNumber - Roundtrip No. property of the entry
	 * @param {int} iEntryNumber - Entry No. property of the entry
	 * @returns {String} Trace Entry path
	 * @public
	 */
	ODataModelHelper.prototype.generateTraceEntryPath =
		function (sConfigurationContextPath, sTraceGuid, iRoundtripNumber, iEntryNumber) {
			return this._generatePath(
				sConfigurationContextPath,
				CONFIGURATION_CONTEXT_NAV_PROP.TraceEntry,
				[{
						key: PROPERTY_NAME.TraceGuid,
						value: sTraceGuid
					},
					{
						key: PROPERTY_NAME.RoundtripNo,
						value: iRoundtripNumber,
						isNumeric: true
					},
					{
						key: PROPERTY_NAME.EntryNo,
						value: iEntryNumber,
						isNumeric: true
					}
				]
			);
		};

	/**
	 * Generates the WhereWasValueSet path of Trace Characteristic based on the Configuration Context Path
	 * and the Trace Characteristic keys
	 * @param {String} sConfigurationContextPath - Configuration Context Path
	 * @param {String} sBOMComponentId - BOMComponentId property of the Trace Characteristic
	 * @param {String} sCsticId - CsticId property of the Trace Characteristic
	 * @returns {String} WhereWasValueSet path
	 * @public
	 */
	ODataModelHelper.prototype.generateWhereWasValueSetPath =
		function (sConfigurationContextPath, sBOMComponentId, sCsticId) {
			return this._generatePath(
				sConfigurationContextPath,
				CONFIGURATION_CONTEXT_NAV_PROP.TraceCharacteristic,
				[{
						key: PROPERTY_NAME.BOMComponentId,
						value: sBOMComponentId
					},
					{
						key: PROPERTY_NAME.CsticId,
						value: sCsticId
					}
				],
				TRACE_CHARACTERISTIC_NAV_PROP.WhereWasValueSet
			);
		};

	/**
	 * Generates the WhereWasUsed path of Trace Characteristic based on the Configuration Context Path
	 * and the Trace Characteristic keys
	 * @param {String} sConfigurationContextPath - Configuration Context Path
	 * @param {String} sBOMComponentId - BOMComponentId property of the Trace Characteristic
	 * @param {String} sCsticId - CsticId property of the Trace Characteristic
	 * @returns {String} WhereWasUsed path
	 * @public
	 */
	ODataModelHelper.prototype.generateWhereWasCsticUsedPath =
		function (sConfigurationContextPath, sBOMComponentId, sCsticId) {
			return this._generatePath(
				sConfigurationContextPath,
				CONFIGURATION_CONTEXT_NAV_PROP.TraceCharacteristic,
				[{
						key: PROPERTY_NAME.BOMComponentId,
						value: sBOMComponentId
					},
					{
						key: PROPERTY_NAME.CsticId,
						value: sCsticId
					}
				],
				TRACE_CHARACTERISTIC_NAV_PROP.WhereWasUsed
			);
		};

	/**
	 * Generates the WhereWasDepSet path of Trace Dependency based on the Configuration Context Path
	 * and the Trace Dependency keys
	 * @param {String} sConfigurationContextPath - Configuration Context Path
	 * @param {String} sObjectDependency   - ObjectDependency property of the Trace Dependency
	 * @param {String} sSubprocedureIndex  - The Sub-Procedure index property of the Trace Dependency
	 * @param {String} sObjectDependencyId - ObjectDependencyId property of the Trace Dependency
	 * @returns {String} WhereWasValueSet path
	 * @public
	 */
	ODataModelHelper.prototype.generateWhereWasDepSetPath =
		function (sConfigurationContextPath, sObjectDependency, sSubprocedureIndex, sObjectDependencyId) {
			return this._generatePath(
				sConfigurationContextPath,
				CONFIGURATION_CONTEXT_NAV_PROP.TraceObjectDependency,
				[{
						key: PROPERTY_NAME.ObjectDependency,
						value: sObjectDependency
					},
					{
						key: PROPERTY_NAME.SubprocedureIndex,
						value: sSubprocedureIndex,
						isNumeric: true
					},
					{
						key: PROPERTY_NAME.ObjectDependencyId,
						value: sObjectDependencyId,
						isNumeric: true
					}
				],
				TRACE_DEPENDENCY_NAV_PROP.WhereWasDepSet
			);
		};

	/**
	 * Generates the WhereWasUsed path of Trace Dependency based on the Configuration Context Path
	 * and the Trace Dependency keys
	 * @param {String} sConfigurationContextPath - Configuration Context Path
	 * @param {String} sObjectDependency - ObjectDependency property of the Trace Dependency
	 * @param {String} sSubprocedureIndex - The Sub-Procedure index property of the Trace Dependency
	 * @param {String} sObjectDependencyId - ObjectDependencyId property of the Trace Dependency
	 * @returns {String} WhereWasUsed path
	 * @public
	 */
	ODataModelHelper.prototype.generateWhereWasDepUsedPath =
		function (sConfigurationContextPath, sObjectDependency, sSubprocedureIndex, sObjectDependencyId) {
			return this._generatePath(
				sConfigurationContextPath,
				CONFIGURATION_CONTEXT_NAV_PROP.TraceObjectDependency,
				[{
						key: PROPERTY_NAME.ObjectDependency,
						value: sObjectDependency
					},
					{
						key: PROPERTY_NAME.SubprocedureIndex,
						value: sSubprocedureIndex,
						isNumeric: true
					},
					{
						key: PROPERTY_NAME.ObjectDependencyId,
						value: sObjectDependencyId,
						isNumeric: true
					}
				],
				TRACE_DEPENDENCY_NAV_PROP.WhereWasDepUsed
			);
		};

	/**
	 * A generic path generator that takes a root path, a navigation property (or entity set name)
	 * a set of key, value pairs (optional) and a navigation path postfix (optional)
	 * Assembles the navigation path as such:
	 * ROOT_PATH/NAVIGATION_PROPERTY(KEY1=VALUE1, ...)/NAVIGATION_POSTFIX
	 * @param {String} sRootPath - Root path
	 * @param {String} sNavigationProperty - Navigation property or entity set name (if the root is null)
	 * @param {Object[]} aKeyValuePairs - Array of key, value pairs for navigating
	 * @param {String} sNavigationPathPostfix - Navigation path postfix
	 * @returns {String} Navigation path
	 * @private
	 */
	ODataModelHelper.prototype._generatePath =
		function (sRootPath, sNavigationProperty, aKeyValuePairs, sNavigationPathPostfix) {

			var sKeyValuePairs = this._generateKeyValuePairs(aKeyValuePairs);
			var sPathPostfix = sNavigationPathPostfix ? "/" + sNavigationPathPostfix : "";

			return sRootPath + "/" + sNavigationProperty + sKeyValuePairs + sPathPostfix;
		};

	/**
	 * Generates a string of key, value pairs as such:
	 * (KEY1=VALUE1,KEY2=VALUE2)
	 * The key, value pair objects have the following properties:
	 * key - the property name
	 * value - the value of the property
	 * isNumeric - boolean value, true for numeric properties (these do not need to be surrounded by apostrophes)
	 * @param {Object[]} aKeyValuePairs - Array of key, value pairs for navigating
	 * @returns {String} WhereWasUsed path
	 * @private
	 */
	ODataModelHelper.prototype._generateKeyValuePairs =
		function (aKeyValuePairs) {
			var iNoOfKeyValuePairs = aKeyValuePairs.length;

			if (iNoOfKeyValuePairs === 0) {
				return "";
			}

			var sKeyValuePairs = "(";

			var oKeyValuePair;
			var sValueAsString;

			for (var i = 0; i < iNoOfKeyValuePairs - 1; i++) {
				oKeyValuePair = aKeyValuePairs[i];

				sValueAsString =
					oKeyValuePair.isNumeric || false ? oKeyValuePair.value : "'" + oKeyValuePair.value + "'";

				sKeyValuePairs +=
					oKeyValuePair.key + "=" +
					sValueAsString + ",";
			}

			oKeyValuePair = aKeyValuePairs[iNoOfKeyValuePairs - 1];
			sValueAsString =
				oKeyValuePair.isNumeric || false ? oKeyValuePair.value : "'" + oKeyValuePair.value + "'";

			sKeyValuePairs +=
				oKeyValuePair.key + "=" +
				sValueAsString + ")";

			return sKeyValuePairs;
		};

	/**
	 * Clear the local objects
	 * @public
	 */
	ODataModelHelper.prototype.destroy = function () {
		if (this._model) {
			this._model.destroy();
			delete this._model;
		}
	};

	return new ODataModelHelper();
});
