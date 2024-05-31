/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/model/Filter"
], function (Filter) {
	"use strict";

	/**
	 * Configuration object for Structure panel
	 */
	var oConfig = {
		/**
		 * Views in Structure Panel
		 * @constant
		 * @property {Object} views
		 */
		views: {
			/**
			 * Bill of Material view
			 * @constant
			 * @property {String} BillOfMaterial
			 */
			BillOfMaterial: "BOM",

			/**
			 * Configurable Items view
			 * @constant
			 * @property {String} ConfigurableItems
			 */
			ConfigurableItems: "CONF"
		},
		/**
		 * View configurations
		 * @constant
		 * @property {Object} viewConfig
		 */
		viewConfig: {
			/**
			 * Configurable Items view
			 * @constant
			 * @property {String} CONF
			 */
			CONF: {
				/**
				 * i18n id of the title of the view
				 * @constant
				 * @property {String} title
				 */
				title: "vchclf_structpnl_bomviewselector_configuration",

				/**
				 * Get the filters for the view
				 * @returns {sap.ui.model.Filter} filters for the view
				 */
				getFilters: function () {
					return [
						new Filter({
							path: "IsConfigurableItem",
							operator: sap.ui.model.FilterOperator.EQ,
							value1: true
						}),
						new Filter({
							path: "IsExcludedItem",
							operator: sap.ui.model.FilterOperator.EQ,
							value1: false
						})
					];
				}
			},

			/**
			 * Bill of Material view
			 * @constant
			 * @property {String} BOM
			 */
			BOM: {
				/**
				 * i18n id of the title of the view
				 * @constant
				 * @property {String} title
				 */
				title: "vchclf_structpnl_bomviewselector_bom",

				/**
				 * Get the filters for the view
				 * @param {Boolean} bIsSuperTreeShown - flag whether the super or the configured BOM should be shown
				 * @returns {sap.ui.model.Filter} filters for the view
				 */
				getFilters: function (bIsSuperTreeShown) {
					var aFilters = [];

					if (!bIsSuperTreeShown) {
						aFilters.push(new Filter({
							path: "IsExcludedItem",
							operator: sap.ui.model.FilterOperator.EQ,
							value1: false
						}));
					}

					return aFilters;
				}
			}
		}
	};

	return oConfig;
});
