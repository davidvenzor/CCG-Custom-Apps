/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/i2d/lo/lib/zvchclfz/common/util/RequestQueue",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/ODataModelHelper"
], function (ManagedObject, RequestQueue, Constants, ODataModelHelper) {
	"use strict";

	/**
	 * InspectorDAO constructor
	 * @constructor
	 */
	var InspectorDAO = ManagedObject.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.dao.InspectorDAO", {

		/**
		 * Stores the currently pending reading request
		 * @type {Object}
		 * @private
		 */
		_pendingReadRequest: {},

		/**
		 * Returns the properties of the entity
		 * @param {String} sPath - Path of the entity
		 * @param {Boolean} bIsSuperInspectorRelated - Indicator whether the inspected object is super inspector related
		 * @param {String} sExpand - Expand parameter for the request
		 * @public
		 * @returns {Promise} - Promise object which will provide the details
		 */
		read: function (sPath, bIsSuperInspectorRelated, sExpand) {
			var oURLParameters = bIsSuperInspectorRelated ? {
				"$expand": Constants.navigationProperties.Common.Super
			} : {};

			if (sExpand) {
				oURLParameters.$expand = oURLParameters.$expand ? oURLParameters.$expand + "," + sExpand : sExpand;
			}

			this._abortPendingReadRequest(sPath);

			return RequestQueue.add(this._read.bind(this, sPath, oURLParameters), this);
		},

		/**
		 * Returns the properties of the entity
		 * @param {String} sPath - Path of the entity
		 * @param {Object} oURLParameters - URL parameters
		 * @private
		 * @returns {Promise} - Promise object which will provide the details
		 */
		_read: function (sPath, oURLParameters) {
			return new Promise(function (fnResolve, fnReject) {
				ODataModelHelper.getModel()
					.facadeRead(sPath, oURLParameters ? oURLParameters : {})
					.then(function (oData) {
						delete this._pendingReadRequest[sPath];
						fnResolve(oData);
					}.bind(this))
					.catch(function (oError) {
						var oMessage = {
							isAborted: false
						};

						if (oError.statusCode === 0 ||
							oError.statusText === "abort") {
							oMessage.isAborted = true;
						} else {
							delete this._pendingReadRequest[sPath];
						}

						fnReject(oMessage);
					}.bind(this));
			}.bind(this));
		},

		/**
		 * Calculate the Alt Values and fetches the values
		 * @public
		 * @param {String} sPath - Path of the entity
		 * @param {Object} oURLParameters - URL parameters
		 * @returns {Promise} - Promise object which will provide the details
		 */
		calculateAndFetchAlternativeValues: function (sPath, oURLParameters) {
			return RequestQueue.add(
				this._calculateAndFetchAlternativeValues.bind(this, sPath, oURLParameters), this);
		},

		/**
		 * Calculate the Alt Values and fetches the values
		 * @private
		 * @param {String} sPath - Path of the entity
		 * @param {Object} oURLParameters - URL parameters
		 * @returns {Promise} - Promise object which will provide the details
		 */
		_calculateAndFetchAlternativeValues: function (sPath, oURLParameters) {
			return new Promise(function (fnResolve, fnReject) {
				ODataModelHelper.getModel()
					.facadeCallFunction(
						"/" + Constants.functionImports.calculateAlternativeValues.name,
						oURLParameters ? oURLParameters : {}
					);
				// read explosion results
				this._read(sPath)
					.then(fnResolve)
					.catch(function (oError) {
						fnReject({
							message: JSON.parse(oError.responseText).error.message.value
						});
					});
			}.bind(this));
		},

		/**
		 * Returns the Dependency Details Expanded with Source Code
		 * @param {String} sDependencyDetailsPath - Path of the Dependency details
		 * @returns {Promise} - Promise object which will provide the details
		 * @public
		 */
		getDependencyDetailsWithExpandedSourceCode: function (sDependencyDetailsPath) {
			var oURLParameters = {
				"$expand": Constants.navigationProperties.ObjectDependencyDetails.ObjectDependencyCodes
			};

			return RequestQueue.add(this._read.bind(this, sDependencyDetailsPath, oURLParameters), this);
		},

		/**
		 * Returns all the Dependency Source Code
		 * @param {String} sDependencyDetailsPath - Path of the Dependency details
		 * @returns {Promise} - Promise object which will provide the details
		 * @public
		 */
		getAllDependencySourceCode: function (sDependencyDetailsPath) {
			var sExtendedPath = sDependencyDetailsPath + "/" +
				Constants.navigationProperties.ObjectDependencyDetails.ObjectDependencyCodes;

			return RequestQueue.add(this._read.bind(this, sExtendedPath), this);
		},

		/**
		 * Aborts Pending Read Request
		 * @param {String} sPath - Binding Path
		 * @private
		 */
		_abortPendingReadRequest: function (sPath) {
			// Abort previous pending reading request
			// This is required due to errors when triggering the refresh of cstics multiple times
			// As on failure we trigger a back navigation
			// If it is not abort , multiple back navigation invalidates the inspector root

			if (this._pendingReadRequest &&
				this._pendingReadRequest[sPath]) {
				
				RequestQueue.remove(this._pendingReadRequest[sPath]);

				delete this._pendingReadRequest[sPath];
			}
		}
	});

	return new InspectorDAO();
});
