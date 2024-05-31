/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/common/util/RequestQueue",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/ODataModelHelper",
	"sap/ui/base/ManagedObject"
], function (RequestQueue, Constants, ODataModelHelper, ManagedObject) {
	"use strict";

	/**
	 * Class for accessing RoutingNodeSet entity set
	 * @class
	 */
	var RoutingNodeSetDAO = ManagedObject.extend(
		"sap.i2d.lo.lib.zvchclfz.components.structurepanel.dao.RoutingNodeSetDAO", {

		/**
		 * Reads the Routing from BE
		 * @param {String} sPath - path of the object which has routing
		 * @param {Array} aFilters - array of filters
		 * @public
		 * @returns {Promise} - Promise object
		 */
		read: function (sPath, aFilters) {
			return RequestQueue.add(this._read.bind(this, sPath, aFilters), this);
		},

		/**
		 * Reads the Routing from BE
		 * @param {String} sPath - path of the object which has routing
		 * @param {Array} aFilters - array of filters
		 * @private
		 * @returns {Promise} - Promise object
		 */
		_read: function (sPath, aFilters) {
			return new Promise(function (fnResolve, fnReject) {
				ODataModelHelper.getModel()
					.facadeRead(
						sPath + "/" + Constants.navigationProperty.RoutingNodes,
						undefined, //URL parameters
						undefined, //Context
						aFilters)
					.then(function (oData) {
						fnResolve(oData.results);
					})
					.catch(fnReject);
			});
		},

		/**
		 * Triggers the Routing explosion and Read
		 * @param {String} sPath - path of the object which has routing
		 * @param {String} sContextId - Configuration Context id
		 * @param {Object} oRoutingKey - Object of Routing Key
		 * @param {Object} oBOMNode - Object of the BOMNode entity
		 * @param {Array} aFilters - array of filters
		 * @public
		 * @returns {Promise} - Promise object
		 */
		explodeRouting: function (sPath, sContextId, oRoutingKey, oBOMNode, aFilters) {
			return RequestQueue.add(
				this._explodeRouting.bind(this, sPath, sContextId, oRoutingKey, oBOMNode, aFilters), this);
		},

		/**
		 * Triggers the Routing explosion and Reads the results
		 * @param {String} sPath - path of the object which has routing
		 * @param {String} sContextId - Configuration Context id
		 * @param {Object} oRoutingKey - Object of Routing Key
		 * @param {Object} oBOMNode - Object of the BOMNode entity
		 * @param {Array} aFilters - array of filters
		 * @private
		 * @returns {Promise} - Promise object
		 */
		_explodeRouting: function (sPath, sContextId, oRoutingKey, oBOMNode, aFilters) {
			return new Promise(function (fnResolve, fnReject) {
				// explode Routing
				ODataModelHelper.getModel()
					.facadeCallFunction(
						"/" + Constants.functionImport.ExplodeRouting, {
							ContextId: sContextId,
							ReferenceInstanceId: oBOMNode.ReferenceInstanceId,
							Product: oBOMNode.Product,
							BOMComponentId: oBOMNode.ComponentId,
							BillOfOperationsType: oRoutingKey.BillOfOperationsType || "",
							BillOfOperationsGroup: oRoutingKey.BillOfOperationsGroup || "",
							BillOfOperationsVariant: oRoutingKey.BillOfOperationsVariant || ""
						},
						Constants.routingChangeSetId)
					.catch(fnReject);

				// read Routing explosion results
				this._read(sPath, aFilters)
					.then(fnResolve)
					.catch(fnReject);

			}.bind(this));
		}
	});

	/**
	 * Export singleton instance of RoutingNodeSetDAO
	 */
	return new RoutingNodeSetDAO();
});
