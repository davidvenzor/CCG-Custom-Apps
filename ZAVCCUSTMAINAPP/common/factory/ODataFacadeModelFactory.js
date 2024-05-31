/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([
		"sap/i2d/lo/lib/zvchclfz/common/odataFacade/ODataV2FacadeModel",
		"sap/i2d/lo/lib/zvchclfz/common/odataFacade/ODataV4FacadeModel",
		"sap/ui/model/odata/v2/ODataModel",
		"sap/ui/model/odata/v4/ODataModel"
	],
	function (ODataV2FacadeModel, ODataV4FacadeModel, ODataModelV2, ODataModelV4) {
		"use strict";

		/**
		 * Factory for ODataFacadeModel
		 */
		var ODataFacadeModelFactory = {

			/**
			 * Creates a Facade Model for the given OData model and metadata paths by considering the OData version.
			 * The facade model should be created immediately after the OData model has been created,
			 * before any other application code touches it to ensure that within the application all access happens via the ODataFacadeModel.
			 * Direct access to the version specific OData model must be prevented.<br>
			 * <br>
			 * @param {sap.ui.model.Model} oModel - the OData model for which a facade is to be created
			 * @param {string} aPaths - array of meta data paths
			 * 			(Note: the array must contain all entries for which the method <code>createKey</code>,
			 * 			  or <code>getKey</code> is invoked)
			 * @param {function} fnViewProvider - a callback function which returns a view to add view dependencies
			 * @returns {sap.i2d.lo.lib.vchclf.common.odataFacade.ODataFacadeModel} - OData Facade model V2/V4
			 */
			createFacadeModel: function (oModel, aPaths, fnViewProvider) {
				var oFacadeModel;

				if (oModel instanceof ODataModelV2) {
					oFacadeModel = new ODataV2FacadeModel(oModel, aPaths, fnViewProvider);
				} else if (oModel instanceof ODataModelV4) {
					oFacadeModel = new ODataV4FacadeModel(oModel, aPaths, fnViewProvider);
				} else {
					throw Error("No FacadeModel defined for '" + oModel.getMetadata().getName() + "'.");
				}

				return oFacadeModel;
			}
		};

		return ODataFacadeModelFactory;

	});
