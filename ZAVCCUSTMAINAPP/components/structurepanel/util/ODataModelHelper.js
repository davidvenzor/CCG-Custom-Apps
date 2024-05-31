/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants"
], function (Constants) {
	"use strict";

	/**
	 * Helper class for accessing the odata model from modules
	 * @class
	 */
	var ODataModelHelper = function () {
		/**
		 * Reference for the model object
		 * @type {sap.ui.model.odata.v2.ODataModel}
		 * @private
		 */
		this._model = null;
	};

	/**
	 * Initializer
	 * @public
	 * @param {sap.ui.model.odata.v2.ODataModel} oModel - OData model of the application
	 */
	ODataModelHelper.prototype.init = function (oModel) {
		this._model = oModel;
	};

	/**
	 * Getter for the model reference
	 * @public
	 * @returns {sap.ui.model.odata.v2.ODataModel} - OData model of the application
	 */
	ODataModelHelper.prototype.getModel = function () {
		return this._model;
	};

	/**
	 * Generate the path to the BOMNode
	 * @param {String} sContextId - Configuration Context ID
	 * @param {String} sComponentId - ComponentId of BOMNode
	 * @public
	 * @returns {String} BOMNode path
	 */
	ODataModelHelper.prototype.generateBOMNodePath = function (sContextId, sComponentId) {
		var sConfigPath = this._model.createKey("/" + Constants.entitySet.ConfigurationContextSet, {
			ContextId: sContextId
		});

		var sBOMPath = "/" + Constants.navigationProperty.BOMNodes + "('" + sComponentId + "')";

		return sConfigPath + sBOMPath;
	};

	/**
	 * Generate the path to the Configuration Instance
	 * @param {Object} oConfigurationInstance - context of the Configuration Instance
	 * @public
	 * @returns {String} ConfigurationInstance path
	 */
	ODataModelHelper.prototype.generateConfigurationInstancePath = function (oConfigurationInstance) {
		if (oConfigurationInstance.ContextId && oConfigurationInstance.InstanceId) {
			return this._model.createKey("/" + Constants.entitySet.ConfigurationInstanceSet, {
				ContextId: oConfigurationInstance.ContextId,
				InstanceId: oConfigurationInstance.InstanceId
			});
		}

		return undefined;
	};

	/**
	 * Generate the path to the Routing Node type
	 * @param {String} sPath - Path of the BOM or the Routing based on how many routings are attached to the BOM
	 * @param {String} sTreeId - Routing Tree ID
	 * @param {String} sNodeId - Routing Node ID
	 * @public
	 * @returns {String} Routing Node path
	 */
	ODataModelHelper.prototype.generateRoutingNodePath = function (sPath, sTreeId, sNodeId) {
		return sPath + "/" +
			Constants.navigationProperty.RoutingNodes +
			"(TreeId='" + sTreeId + "',NodeId='" + sNodeId + "')";
	};

	/**
	 * Extend BOM Node Path with Routing Key
	 * @param {String} sBOMNodePath - Path of the BOM Node
	 * @param {Object} oRoutingKey - Routing Key object
	 * @public
	 * @returns {String} BOM Node Path
	 */
	ODataModelHelper.prototype.extendTheBOMNodePathWithRoutingKey = function (sBOMNodePath, oRoutingKey) {
		return sBOMNodePath + "/" + Constants.navigationProperty.Routings +
			"(BillOfOperationsType='" + oRoutingKey.BillOfOperationsType +
			"',BillOfOperationsGroup='" + oRoutingKey.BillOfOperationsGroup +
			"',BillOfOperationsVariant='" + oRoutingKey.BillOfOperationsVariant + "')";
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

	/**
	 * Export singleton instance of ODataModelHelper
	 */
	return new ODataModelHelper();
});
