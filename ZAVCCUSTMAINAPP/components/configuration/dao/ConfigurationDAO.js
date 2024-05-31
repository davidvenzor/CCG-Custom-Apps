/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/common/dao/BaseDAO",
	"sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/i2d/lo/lib/zvchclfz/common/util/Toggle"
], function (BaseDAO, Constants, Toggle) {
	"use strict";

	/**
	 * The configuration DAO wraps the OData Model and requests
	 * 
	 * @class
	 *
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.vchclf.components.configuration.dao.ConfigurationDAO
	 * @extends sap.i2d.lo.lib.vchclf.common.dao.BaseDAO
	 */
	return BaseDAO.extend("sap.i2d.lo.lib.zvchclfz.components.configuration.dao.ConfigurationDAO", { /** @lends sap.i2d.lo.lib.vchclf.components.configuration.dao.ConfigurationDAO.prototype */

		/**
		 * Creates a configuration context.
		 * 
		 * @param {map} mContextData The data for which the context should be created for with the following properties:
		 * @param {String} mContextData.semanticObj
		 * @param {String} mContextData.objectKey
		 * @param {String} mContextData.draftKey
		 * @return {Promise<Object>} A promise to the context.
		 * @public
		 */
		createContext: function (mContextData) {
			return this.create("/ConfigurationContextSet", mContextData);
		},

		validateConfiguration: function (sContextId) {
			var oValidatePromise = this.callFunction("/ValidateConfiguration", {
				ContextId: sContextId
			});
			var oReadConfigurationPromise = this.readConfigurationContext(sContextId);
			return Promise.all([oValidatePromise, oReadConfigurationPromise]);
		},

		lockConfiguration: function (sContextId) {
			this.callFunction("/ConfigurationLock", {
				ContextId: sContextId
			});
			this.calculatePricing(sContextId);
			return this.readConfigurationContext(sContextId);
		},

		unlockConfiguration: function (sContextId) {
			this.callFunction("/ConfigurationUnlock", {
				ContextId: sContextId
			});
			this.calculatePricing(sContextId);
			return this.readConfigurationContext(sContextId);
		},

		discardConfigurationDraft: function (oUrlParameters) {
			return this.callFunction("/DiscardConfigurationDraft", oUrlParameters);
		},

		calculatePricing: function (sContextId) {
			return this.callFunction("/CalculatePricing", {
				ContextId: sContextId
			});
		},

		readFeatureToggles: function () {
			return this.read("/ToggleSet");
		},

		readConfigurationContext: function (sContextId, bLoadUISettings) {
			var sRootKey = this.getDataModel().createKey("/ConfigurationContextSet", {
				ContextId: sContextId
			});
			var sExpand = "Instances/CharacteristicsGroups,InconsistencyInformation";
			if (bLoadUISettings) {
				sExpand = "Instances/CharacteristicsGroups,InconsistencyInformation,UISettings";
			}
			return this.read(sRootKey, {
				"$expand": sExpand
			});
		},

		readFullMatchingVariants: function (sContextId, sInstanceId, mUrlParameters) {
			var sRootKey = this.getDataModel().createKey("/ConfigurationInstanceSet", {
				ContextId: sContextId,
				InstanceId: sInstanceId
			}) + "/FullMatchingVariants";

			return this.read(sRootKey, mUrlParameters);
		},

		readAllMaterialVariants: function (sContextId, sInstanceId, mUrlParameters, aFilters) {
			var sPath = this.getDataModel().createKey("/ConfigurationInstanceSet", {
				ContextId: sContextId,
				InstanceId: sInstanceId
			}) + "/MaterialVariants";

			return this.read(sPath, mUrlParameters, null, aFilters);
		},

		setPreferredVariant: function (oVariant) {
			return this.callFunction("/SetPreferredVariant", {
				ContextId: oVariant.ContextId,
				InstanceId: oVariant.InstanceId,
				Product: oVariant.Product,
				Plant: oVariant.Plant,
				Cuobj: oVariant.Cuobj
			});
		},

		createFullyMatchingProductVariant: function (sContextId) {
			return this.callFunction("/CreateFullyMatchingProductVariant", {
				ContextId: sContextId
			});
		},

		switchToETO: function (sContextId) {
			return this.callFunction("/SwitchToETO", {
				ContextId: sContextId
			});
		},
		
		setETOStatus: function (sContextId, sStatus) {
			return this.callFunction("/SetETOStatus", {
				ContextId: sContextId,
				Status: sStatus
			});
		}

	});
});
