/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/dao/RoutingNodeSetDAO",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/StructurePanelModel",
	"sap/ui/model/json/JSONModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/MessageManager"
], function (Constants, RoutingNodeSetDAO, StructurePanelModel, JSONModel, MessageManager) {
	"use strict";
	/**
	 * Model class for RoutingTree controller
	 * @param {String} sTreeType - Type of the Routing Tree
	 * @param {Object} oRoutingObject - Object of the Routing
	 * @class
	 */
	var RoutingTreeModel = function (sTreeType, oRoutingObject) {
		var aBaseFilter = [];

		if (oRoutingObject && oRoutingObject.BillOfOperationsSequence) {
			aBaseFilter.push(new sap.ui.model.Filter({
				path: "BillOfOperationsSequence",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: oRoutingObject.BillOfOperationsSequence}));
		}

		/**
		 * Model for storing Routing data for ui binding
		 * @type {sap.ui.model.json.JSONModel}
		 * @private
		 */
		this._treeModel = new JSONModel({
			/**
			 * Base Filters to be added in every backend request
			 * @type {Array}
			 * @private
			 */
			baseFilters: aBaseFilter,

			/**
			 * Parent Routing Object that the Model is called from
			 * @type {Object}
			 * @private
			 */
			parentBaseRoutingObject: oRoutingObject,

			/**
			 * Routing Tree type
			 * @type {String}
			 * @private
			 */
			treeType: sTreeType,

			/**
			 * Routing objects
			 * @type {Object}
			 * @private
			 */
			routingNodes: null,

			/**
			 * TreeDepth
			 * @type {Int}
			 * @private
			 */
			treeDepth: 0,

			/**
			 * Flag whether the tree should be refreshed
			 * @type {Boolean}
			 * @private
			 */
			isRefreshable: true,

			/**
			 * Flag whether the super routing is shown in the tree
			 * @type {Boolean}
			 * @private
			 */
			isSuperRoutingShown: false
		});
	};

	/**
	 * Returns the Routing Key of the routingNodes property of the Tree Model
	 * @returns {Object} Object of Routing Key
	 */
	RoutingTreeModel.prototype.getRoutingKey = function () {
		var aRoutingNodes = this._treeModel.getProperty("/routingNodes/items");

		if ($.isArray(aRoutingNodes) && aRoutingNodes.length > 0) {
			var oFirtsNode = aRoutingNodes[0]; // The routing key is the same for all items

			return {
				BillOfOperationsType: oFirtsNode.BillOfOperationsType,
				BillOfOperationsGroup: oFirtsNode.BillOfOperationsGroup,
				BillOfOperationsVariant: oFirtsNode.BillOfOperationsVariant
			};
		} else {
			return undefined;
		}
	};

	/**
	 * Getter for the class' model object
	 * @returns {sap.ui.model.json.JSONModel} - Model with bindable data
	 * @public
	 */
	RoutingTreeModel.prototype.getModel = function () {
		return this._treeModel;
	};

	/**
	 * Set the isRefreshable flag to true of the model
	 */
	RoutingTreeModel.prototype.invalidate = function () {
		this._treeModel.setProperty("/isRefreshable", true);
	};

	/**
	 * Get the isRefreshable flag of the model
	 * @returns {Boolean} isRefreshable flag of the model
	 */
	RoutingTreeModel.prototype.isInvalidated = function () {
		return this._treeModel.getProperty("/isRefreshable") ||
			StructurePanelModel.isSuperTreeShown() !== this._treeModel.getProperty("/isSuperRoutingShown");
	};

	/**
	 * Get the treeDepth value of the model
	 * @returns {Int} treeDepth vale of the model
	 */
	RoutingTreeModel.prototype.getTreeDepth = function () {
		return this._treeModel.getProperty("/treeDepth");
	};

	/**
	 * Routing Model's bound Page Type
	 * @returns {String} - Routing Tree Type
	 */
	RoutingTreeModel.prototype.getType = function () {
		return this._treeModel.getProperty("/treeType");
	};

	/**
	 * Reads the Routing from the BE & maps to the model
	 * @param {String} sPath - path of the object which has routing
	 * @returns {Promise} - Promise object
	 */
	RoutingTreeModel.prototype.read = function (sPath) {
		return new Promise(function (resolve, reject) {
			var bIsSuperRoutingRequest = StructurePanelModel.isSuperTreeShown();

			// Reset the messages belonging to the Structure Panel
			MessageManager.dropStructurePanelMessages();
			this._treeModel.setProperty("/isRefreshable", false);
			RoutingNodeSetDAO.read(sPath, this._setupFilter())
				.then(function (aResults) {
					var aTree = this._genericSuccessHandling(aResults, bIsSuperRoutingRequest);

					resolve(aTree.length);
				}.bind(this))
				.catch(function () {
					this._genericErrorHandling();

					reject();
				}.bind(this));
		}.bind(this));
	};

	/**
	 * Reset the Routing tree
	 * @public
	 */
	RoutingTreeModel.prototype.resetRoutingTree = function () {
		this._treeModel.setProperty("/routingNodes", null);
	};

	/**
	 * Reads the exploded Routing from the BE & maps to the model
	 * @param {String} sPath - path of the object which has routing
	 * @param {String} sContextId - Configuration Context id
	 * @param {Object} oRoutingKey - Object of the Routing Key
	 * @param {Object} oBOMNode - Object of the BOMNode entity
	 * @returns {Promise} - Promise object
	 */
	RoutingTreeModel.prototype.explodeRouting = function (sPath, sContextId, oRoutingKey, oBOMNode) {
		return new Promise(function (resolve, reject) {
			var bIsSuperRoutingRequest = StructurePanelModel.isSuperTreeShown();

			// Reset the messages belonging to the Structure Panel
			MessageManager.dropStructurePanelMessages();
			this._treeModel.setProperty("/isRefreshable", false);
			RoutingNodeSetDAO.explodeRouting(sPath, sContextId, oRoutingKey, oBOMNode, this._setupFilter())
				.then(function (aResults) {
					var aTree = this._genericSuccessHandling(aResults, bIsSuperRoutingRequest);

					resolve(aTree.length);
				}.bind(this))
				.catch(function () {
					this._genericErrorHandling();
					reject();
				}.bind(this));
		}.bind(this));
	};

	/**
	 * Generic Error Handling for read / explode routing
	 * @private
	 */
	RoutingTreeModel.prototype._genericErrorHandling = function () {
		this.resetRoutingTree();

		this.invalidate();
	};

	/**
	 * Generic Success Handling for read / explode routing
	 * @param {Array} aResults - Results of the read / explosion
	 * @param {Boolean} bIsSuperRoutingRequest - Flaw whether the request was Super Routing related
	 * @returns {Array} - Array of the generated tree
	 * @private
	 */
	RoutingTreeModel.prototype._genericSuccessHandling = function (aResults, bIsSuperRoutingRequest) {
		// Create tree from updated flat structure
		var aTree = this._treeify(aResults);

		// Update model
		this._treeModel.setProperty("/routingNodes", {
			items: aTree
		});

		this._treeModel.setProperty("/isSuperRoutingShown", bIsSuperRoutingRequest);

		return aTree;
	};

	/**
	 * Setup the filters for the request of read/explode routing
	 * @returns {Array} Array of combined filters
	 */
	RoutingTreeModel.prototype._setupFilter = function () {
		// Combining the incoming filters with the base filters
		var aCombinedFilters = [];

		aCombinedFilters = aCombinedFilters.concat(this._treeModel.getProperty("/baseFilters"));

		if (!StructurePanelModel.isSuperTreeShown()) {
			aCombinedFilters.push(new sap.ui.model.Filter({
				path: "IsExcludedItem",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: false
			}));
		}

		return aCombinedFilters;
	};

	/**
	 * Builds hierarchical tree from flat structure
	 * @param {Array} aResults - Routing Nodes from the backend
	 * @returns {Array} - Structure in hierarchical representation
	 * @private
	 */
	RoutingTreeModel.prototype._treeify = function (aResults) {
		var aTreeHierarchy = [];
		var oLookup = {};
		var iTreeDepth = Constants.routingTree.nullDepth;

		// build lookup object
		aResults.forEach(function (oRoutingNode) {
			var iNodeLevel = null;

			oRoutingNode.items = oRoutingNode.items || [];
			oLookup[oRoutingNode.NodeId] = oRoutingNode;

			// calculate tree depth
			iNodeLevel = parseInt(oRoutingNode.NodeLevel, 10);
			iTreeDepth = iNodeLevel > iTreeDepth ? iNodeLevel : iTreeDepth;
		});

		// save tree depth
		this._treeModel.setProperty("/treeDepth", iTreeDepth);

		// assign children to their parents
		aResults.forEach(function (oRoutingNode) {
			if (oRoutingNode.NodeId !== Constants.defaultRoutingRootNodeId) {
				// push if it's not already there
				var aNodeItems = oLookup[oRoutingNode.ParentNodeId].items;
				var oNodeWithSameId = $.grep(aNodeItems, function (oElement) {
					return oElement.NodeId === oRoutingNode.NodeId;
				})[0];

				if (!oNodeWithSameId) {
					aNodeItems.push(oRoutingNode);
				}
			} else {
				aTreeHierarchy.push(oRoutingNode);
			}
		});

		return aTreeHierarchy;
	};

	/**
	 * Export instance of RoutingTreeModel
	 * This is not a singleton. Exist as many time we have a RoutingTree.
	 */
	return RoutingTreeModel;
});
