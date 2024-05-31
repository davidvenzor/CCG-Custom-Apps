/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/common/util/RequestQueue",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/StructurePanelModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/i18n",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/ODataModelHelper",
	"sap/base/Log",
	"sap/ui/base/ManagedObject"
], function (RequestQueue, Constants, StructurePanelModel, i18n, ODataModelHelper, Log, ManagedObject) {
	"use strict";

	/**
	 * Class for accessing BOMNodeSet entity set
	 * @class
	 */
	var BOMNodeSetDAO = ManagedObject.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.dao.BOMNodeSetDAO", {
		/**
		 * Explosion possible indicator
		 * @type {String}
		 * @private
		 */
		_explosionPossible: undefined,

		/**
		 * Translates error code to UI text
		 * @param {String} sErrorCode - Error code
		 * @returns {String} Translated text
		 * @private
		 */
		_getErrorMessage: function (sErrorCode) {
			var sI18nId = Constants.explosion.error[sErrorCode];

			if (sI18nId) {
				return i18n.getText(sI18nId);
			} else {
				Log.error(
					"Unable to find error code.",
					"Error code was not recognized as a valid entry.",
					"sap.i2d.lo.lib.zvchclfz.components.structurepanel.dao.BOMNodeSetDAO");

				return null;
			}
		},

		/**
		 * Returns error message in Promise object
		 * @returns {Promise} Promise object
		 * @private
		 */
		_returnErrorMessageInPromise: function () {
			return Promise.reject({
				message: this._getErrorMessage(this._explosionPossible),
				explosionPossible: this._explosionPossible
			});
		},

		/**
		 * Returns whether explosion is possible
		 * @returns {boolean} explosion possible
		 * @private
		 */
		_isExplosionPossible: function () {
			return this._explosionPossible === undefined ||
				this._explosionPossible === Constants.explosion.possible ||
				StructurePanelModel.getIsMultiLevelScenario();
		},

		/**
		 * Resets the explosion possible indicator
		 * @public
		 */
		resetExplosionPossibleIndicator: function () {
			this._explosionPossible = undefined;
		},

		/**
		 * Explodes the BOM and read it immediately
		 * @param {String} sContextId - The ID of the context
		 * @param {Array} aFilters - Array of filters
		 * @param {Boolean} bConfigurationInstanceExpanded - Indicator whether we should also trigger the Expand
		 * 													 For ConfigurationInstance
		 * @param {Boolean} bIsInitialLoad - Indicator whether it is an initial load
		 * @param {Boolean} bForceBOMExplosion - Indicator whether it is a forced explode
		 * @param {String} sChangeSetId - an optional id of a changeSet this request should belong to
		 * @return {Promise} Promise object
		 * @public
		 */
		explodeAndReadBOM: function (sContextId, aFilters, bConfigurationInstanceExpanded, bIsInitialLoad, bForceBOMExplosion, sChangeSetId) {
			if (this._isExplosionPossible()) {
				this.resetExplosionPossibleIndicator();

				return RequestQueue.add(
					this._explodeAndReadBOM.bind(this,
						sContextId,
						aFilters,
						bConfigurationInstanceExpanded,
						bIsInitialLoad,
						bForceBOMExplosion,
						sChangeSetId),
					this
				);
			} else {
				return this._returnErrorMessageInPromise();
			}
		},

		/**
		 * Explodes the BOM and read it immediately
		 * @param {String} sContextId - The ID of the context
		 * @param {Array} aFilters - Array of filters
		 * @param {Boolean} bConfigurationInstanceExpanded - Indicator whether we should also trigger the Expand
		 * 													 For ConfigurationInstance
		 * @param {Boolean} bIsInitialLoad - Indicator whether it is an initial load
		 * @param {Boolean} bForceBOMExplosion - Indicator whether it is a forced explode
		 * @param {String} sChangeSetId - an optional id of a changeSet this request should belong to
		 * @return {Promise} Promise object
		 * @private
		 */
		_explodeAndReadBOM: function (sContextId, aFilters, bConfigurationInstanceExpanded, bIsInitialLoad, bForceBOMExplosion, sChangeSetId) {
			return new Promise(function (fnResolve, fnReject) {
				this._explodeBOM(sContextId, bIsInitialLoad, bForceBOMExplosion, sChangeSetId)
					.catch(fnReject);

				this._readBOMNodes(sContextId, aFilters, bConfigurationInstanceExpanded)
					.then(function (aResults) {
						fnResolve(aResults);
					})
					.catch(fnReject);
			}.bind(this));
		},

		/**
		 * Explodes the BOM
		 * @param {String} sContextId - The ID of the context
		 * @param {Boolean} bIsInitialLoad - Indicator whether it is an initial load
		 * @param {Boolean} bForceBOMExplosion - Indicator whether it is a forced explode
		 * @param {String} sChangeSetId - an optional id of a changeSet this request should belong to
		 * @return {Promise} Promise object
		 * @public
		 */
		explodeBOM: function (sContextId, bIsInitialLoad, bForceBOMExplosion, sChangeSetId) {
			if (this._isExplosionPossible()) {
				this.resetExplosionPossibleIndicator();

				return RequestQueue.add(
					this._explodeBOM.bind(this,
						sContextId,
						bIsInitialLoad,
						bForceBOMExplosion,
						sChangeSetId),
					this
				);
			} else {
				return this._returnErrorMessageInPromise();
			}
		},

		/**
		 * Explodes the BOM
		 * @param {String} sContextId - The ID of the context
		 * @param {Boolean} bIsInitialLoad - Indicator whether it is an initial load
		 * @param {Boolean} bForceBOMExplosion - Indicator whether it is a forced explode
		 * @param {String} sChangeSetId - an optional id of a changeSet this request should belong to
		 * @return {Promise} Promise object
		 * @private
		 */
		_explodeBOM: function (sContextId, bIsInitialLoad, bForceBOMExplosion, sChangeSetId) {
			return ODataModelHelper.getModel()
				.facadeCallFunction(
					"/" + Constants.functionImport.ExplodeBOM, {
						ContextId: sContextId,
						IsInitialLoad: !!bIsInitialLoad,
						ForceBOMExplosion: !!bForceBOMExplosion
					}, sChangeSetId || Constants.bomChangeSetId);
		},
		
		/**
		 * Reads single BOM node including header data from BE
		 * @param {String} sContextId - The ID of the context
		 * @param {String} sComponentId - The ID of the BOM node
		 * @returns {Promise} Promise object
		 * @public
		 */
		readBOMNodeWithHeader: function(sContextId, sComponentId) {
			var sPath = ODataModelHelper.generateBOMNodePath(sContextId, sComponentId);
			var	oURLParameters = {
					$expand: Constants.navigationProperty.BOMNodeHeader
				};
			var fnReadBOMNodeWithHeader = function () {
				return ODataModelHelper.getModel().facadeRead(sPath, oURLParameters);
			};

			return RequestQueue.add(
					fnReadBOMNodeWithHeader,
					this
			);
		},

		/**
		 * Reads the exploded BOM from BE
		 * @param {String} sContextId - The ID of the context
		 * @param {Array} aFilters - Array of filters
		 * @param {Boolean} bConfigurationInstanceExpanded - Indicator whether we should also trigger the Expand
		 * 													 For ConfigurationInstance
		 * @returns {Promise} Promise object
		 * @public
		 */
		readBOMNodes: function (sContextId, aFilters, bConfigurationInstanceExpanded) {
			if (this._isExplosionPossible()) {
				return RequestQueue.add(
					this._readBOMNodes.bind(this, sContextId, aFilters, bConfigurationInstanceExpanded),
					this
				);
			} else {
				return this._returnErrorMessageInPromise();
			}
		},

		/**
		 * Reads the exploded BOM from BE
		 * @param {String} sContextId - The ID of the context
		 * @param {Array} aFilters - Array of filters
		 * @param {Boolean} bConfigurationInstanceExpanded - Indicator whether we should also trigger the Expand
		 * 													 For ConfigurationInstance
		 * @returns {Promise} Promise object
		 * @private
		 */
		_readBOMNodes: function (sContextId, aFilters, bConfigurationInstanceExpanded) {
			return new Promise(function (fnResolve, fnReject) {
				var oModel = ODataModelHelper.getModel();
				var sConfigurationContextKey = oModel
					.createKey(
						Constants.entitySet.ConfigurationContextSet, {
							ContextId: sContextId
						});

				var oUrlParameters = bConfigurationInstanceExpanded ? {
					"$expand": Constants.navigationProperty.ConfigurationInstance.name
				} : {};

				oModel.facadeRead(
						"/" + sConfigurationContextKey + "/" + Constants.navigationProperty.BOMNodes,
						oUrlParameters,
						undefined,
						aFilters)
					.then(function (oData) {
						if ($.isArray(oData.results) && oData.results.length > 0) {
							if (this._explosionPossible === undefined) {
								this._explosionPossible = oData.results[0].IsBOMExplosionPossible;

								StructurePanelModel.setIsBOMExplosionPossible(
									this._explosionPossible === Constants.explosion.possible);
							}

							fnResolve(oData.results);
						} else {
							Log.error(
								"Cannot find any BOM node.",
								"At least one node should be returned in every cases.",
								"sap.i2d.lo.lib.zvchclfz.components.structurepanel.dao.BOMNodeSetDAO");

							fnReject();
						}
					}.bind(this))
					.catch(function () {
						fnReject(); //TODO there is an error in the Filter OPA tests invalid HTTP
						//TEST in actual scenario with ProductName filter this is causing the failure
					});
			}.bind(this));
		},

		/**
		 * Get the possible routings for a BOM component
		 * @param {String} sBOMNodePath - The path of the selected BOM component
		 * @returns {Promise} Promise object
		 * @public
		 */
		getRoutings: function (sBOMNodePath) {
			return RequestQueue.add(this._getRoutings.bind(this, sBOMNodePath), this);
		},

		/**
		 * Get the possible routings for a BOM component
		 * @param {String} sBOMNodePath - The path of the selected BOM component
		 * @returns {Promise} Promise object
		 * @private
		 */
		_getRoutings: function (sBOMNodePath) {
			return new Promise(function (fnResolve, fnReject) {
				ODataModelHelper.getModel()
					.facadeRead(
						sBOMNodePath + "/" + Constants.navigationProperty.Routings)
					.then(function (oData) {
						fnResolve(oData.results);
					})
					.catch(fnReject);
			});
		},


		/**
		 * Creates Order BOM for the given instance id
		 * @param {string} sInstanceId - instance id for OBOM creation
 		 * @param {string} [sFixOrderBOMMode] - mode for creating OBOM
		 * @returns {Promise} Promise object
		 * @public
		 * @function
		 */
		createOrderBOM: function (sInstanceId, sFixOrderBOMMode) {
			var fnCreateOrderBOM = function () {
				return ODataModelHelper.getModel().facadeCallFunction("/" +
						Constants.BOMItemActionFunctionCall.createOrderBOM, {
					ContextId: StructurePanelModel.getConfigurationContextId(),
					InstanceId: sInstanceId,
					FixOrderBOMMode: sFixOrderBOMMode || Constants.FixOrderBOMMode.FIXATE
				}, Constants.orderBomChangeSetId);
			};

			return RequestQueue.add(
				fnCreateOrderBOM,
				this
			);
		},

		/**
		 * Inserts given BOM item into OBOM.
		 * @param {map} oBOMItemData: BOM item parameters for new item to insert
		 * @returns {Promise} - Promise object
		 * @public
		 * @function
		 */
		insertBOMItem: function (oBOMItemData) {
			var fnInsertBOMItem = function () {
				return ODataModelHelper.getModel().facadeCreate(
					"/" + Constants.entitySet.BOMNodeSet,
					oBOMItemData,
					Constants.bomChangeSetId
				);
			};

			return RequestQueue.add(
				fnInsertBOMItem,
				this
			);
		},

		/**
		 * Updates given BOM item in the OBOM.
		 * @param {map} oBOMItemData: BOM item parameters for item to update
		 * @returns {Promise} - Promise object
		 * @public
		 * @function
		 */
		updateBOMItem: function (oBOMItemData) {
			var sPath = ODataModelHelper.getModel().createKey("/" + Constants.entitySet.BOMNodeSet, {
				ComponentId: StructurePanelModel.getCurrentlyFocusedBOMItem().ComponentId
			});
			var fnUpdateBOMItem = function () {
				return ODataModelHelper.getModel().facadeUpdate(
					sPath,
					oBOMItemData,
					Constants.bomChangeSetId
				);
			};

			return RequestQueue.add(
				fnUpdateBOMItem,
				this
			);
		},

		/**
		 * Deletes given BOM item from the OBOM.
		 * @param {map} oBOMItemData: BOM item parameters for item to delete
		 * @returns {Promise} - Promise object
		 * @public
		 * @function
		 */
		deleteBOMItem: function (oBOMItemData) {
			var fnDeleteBOMItem = function () {
				return ODataModelHelper.getModel().facadeCallFunction(
					"/" + Constants.BOMItemActionFunctionCall.deleteBOMItem,
					oBOMItemData,
					Constants.bomChangeSetId
				);
			};

			return RequestQueue.add(
					fnDeleteBOMItem,
				this
			);
		}
	});

	/**
	 * Export singleton instance of BOMNodeSetDAO
	 */
	return new BOMNodeSetDAO();
});
