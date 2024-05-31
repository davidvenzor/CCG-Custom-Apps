/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
/* eslint-disable max-statements */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/config/UiConfig",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/i18n",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/RoutingSelectionUtil",
	"sap/base/Log",
	"sap/ui/model/json/JSONModel"
], function (UiConfig, i18n, RoutingSelectionUtil, Log, JSONModel) {
	"use strict";

	/**
	 * Access class for Structure Model
	 * @constructor
	 * @class
	 * @public
	 */
	var StructurePanelModel = function () {
		/**
		 * JSON model which contains the Structure Model
		 * @type {sap.ui.model.json.JSONModel}
		 * @private
		 */
		this._model = null;

		/**
		 * Properties of the Structure Model
		 * @private
		 * @type {Object}
		 */
		this._properties = {

			/**
			 * Indicator whether a request is current triggered for trees of Structure Panel
			 * @type {Boolean}
			 * @private
			 */
			isStructurePanelLoading: false,

			/**
			 * Indicator whether the super or the configured BOM/Routing should be shown in the Structure Tree
			 * @type {Boolean}
			 * @private
			 */
			isSuperTreeShown: false,

			/**
			 * Indicator whether a configuration scenario is multi level
			 * @type {Boolean}
			 * @private
			 */
			isMultiLevelScenario: false,

			/**
			 * Currently Selected BOM View in the Structure Panel
			 * @type {String}
			 * @private
			 */
			selectedBOMView: "",

			/**
			 * Currently Selected BOM View Title in the Structure Panel
			 * @type {String}
			 * @private
			 */
			selectedBOMViewTitle: "",

			/**
			 * Available BOM views
			 * @type {Array}
			 * @private
			 */
			bomViews: [],

			/**
			 * Configuration Context Id
			 * @type {String}
			 * @private
			 */
			ConfigurationContextId: "",

			/**
			 * Base View for BOM used when reset is triggered
			 * @type {String}
			 * @private
			 */
			baseViewForBOM: "",

			/**
			 * Indicator whether the BOM select button is visible
			 * @type {Boolean}
			 * @private
			 */
			selectBOMViewVisibility: false,

			/**
			 * Header product which belongs to the selected routing
			 * @type {String}
			 * @private
			 */
			routingHeaderProduct: "",

			/**
			 * Indicator whether Routing is available for a BOM item
			 * @type {Boolean}
			 * @private
			 */
			isRoutingAvailable: false,

			/**
			 * Indicator whether Super BOM is available
			 * @type {Boolean}
			 * @private
			 */
			isSuperBOMAvailable: false,

			/**
			 * Configuraiton Context semantic object
			 * @private
			 * @type {String}
			 */
			semanticObject: "",

			/**
			 * The Binding path of the Caller of the Routing Frame
			 * @type {Object}
			 * @private
			 */
			routingFrameCaller: {
				bindingPath: null,
				bomNode: null,
				routingKey: null
			},

			/**
			 * indicator whether the BOM was exploded
			 * @type {Boolean}
			 * @private
			 */
			isBOMInitialLoad: true,

			/**
			 * indicator whether the BOM has to be forced refresh
			 * @type {Boolean}
			 * @private
			 */
			forceBOMExplosion: false,

			/**
			 * Currently focused BOM item
			 * @type {Object}
			 * @private
			 */
			currentlyFocusedBOMItem: null,

			/**
			 * Currently loaded BOM item in the valuation
			 * @type {Object}
			 * @private
			 */
			currentlyLoadedBOMItemInValuation: null,

			/**
			 * Indicator whether a the Product column is filtered in the tree
			 * @type {Boolean}
			 * @private
			 */
			isProductColumnFiltered: false,

			/**
			 * Filter value for product column
			 * @type {String}
			 * @private
			 */
			productColumnFilterValue: null,

			/**
			 * Indicator whether the Structure panel is editable whether BOM Explosion could be triggered
			 * @type {Boolean}
			 * @private
			 */
			isStructurePanelEditable: false,

			/**
			 * Naming whether technical, description or both
			 * @type {sap.i2d.lo.lib.zvchclfz.common.type.DescriptionMode}
			 * @private
			 */
			descriptionMode: null,

			/**
			 * Available routings of selected product
			 * @type {Object}
			 * @private
			 */
			availableRoutings: {
				numberOfRoutings: 0,
				selectedRouting: "",
				routings: []
			},

			/**
			 * indicator whether there BOM explosion is possible
			 * @type {Boolean}
			 * @private
			 */
			isBOMExplosionPossible: true,

			/**
			 * Enables actions for BOM changes and shows OBOM specific columns
			 * @type {Boolean}
			 * @private
			 */
			isBOMChangeAllowed: false,

			/**
			 * Indicator whether the ETO column set is available
			 * @type {Boolean}
			 * @private
			 */
			isETOColumnSetAvailable: false,

			/**
			 * Object to store the Configuration UI settings
			 * @type {Object} - UISettingsSet
			 * @private
			 */
			ConfigurationUISettings: null,

			/**
			 * Variant Configuration of the BOM Columns
			 * @type {Object}
			 * @private
			 */
			BOMColumnsVariant: null,

			/**
			 * Array of currently selected columns
			 * @type {Object[]}
			 * @private
			 */
			selectedColumns: [],

			/**
			 * Value of FixedColumnCount
			 * @type {int}
			 * @private
			 */
			fixedColumnCount: null
		};

		this.resetModel();

	};

	/**
	 * Reset the Structure Model
	 * @public
	 */
	StructurePanelModel.prototype.resetModel = function () {
		this._model = new JSONModel($.extend(true, {}, this._properties));
	};

	/**
	 * Getter for the Structure Model
	 * @public
	 * @returns {sap.ui.model.json.JSONModel} - The message model for binding
	 */
	StructurePanelModel.prototype.getModel = function () {
		return this._model;
	};

	/**
	 * Generic Setter for the Structure Model Properties
	 * @param {String} sProperty		 - Property Name
	 * @param {String|Object} oValue	 - Property Value
	 * @public
	 */
	StructurePanelModel.prototype.setProperty = function (sProperty, oValue) {
		this.getModel().setProperty(sProperty, oValue);
	};

	/**
	 * Setter for the BOMColumnsVariant
	 * @param {Object} oBOMColumnsVariant - Object of BOMColumnsVariant
	 * @param {Object} oBOMColumnsVariant.variantItems - Object of available variants
	 * @param {String} oBOMColumnsVariant.defaultKey - Key of the default variant item
	 * @param {String} oBOMColumnsVariant.initialSelectionKey - Initial selection key of variants
	 * @public
	 */
	StructurePanelModel.prototype.setBOMColumnsVariant = function (oBOMColumnsVariant) {
		this.setProperty("/BOMColumnsVariant", oBOMColumnsVariant ? oBOMColumnsVariant : {
			defaultKey: null,
			initialSelectionKey: null,
			variantItems: {}
		});
	};

	/**
	 * Getter for the BOMColumnsVariant
	 * @returns {Object} Object of BOMColumnsVariant
	 * @public
	 */
	StructurePanelModel.prototype.getBOMColumnsVariant = function () {
		return this.getProperty("/BOMColumnsVariant");
	};

	/**
	 * Getter for Variant item of BOMColumnsVariant
	 * @param {String} sVariantKey - Key of the Variant
	 * @returns {Object} Variant item of BOMColumnsVariant
	 * @public
	 */
	StructurePanelModel.prototype.getItemOfBOMColumnsVariant = function (sVariantKey) {
		return this.getProperty("/BOMColumnsVariant/variantItems/" + sVariantKey);
	};

	/**
	 * Sets the selected columns (columnKey property is mandatory)
	 * @param {Object[]} aSelectedColumns - Array of the currently selected columns
	 * @public
	 */
	StructurePanelModel.prototype.setSelectedColumns = function (aSelectedColumns) {
		this.setProperty("/selectedColumns", aSelectedColumns);
	};

	/**
	 * Sets the fixedColumnCount property
	 * @param {int} iFixedColumnCount - Value of fixedColumnCount
	 * @public
	 */
	StructurePanelModel.prototype.setFixedColumnCount = function (iFixedColumnCount) {
		this.setProperty("/fixedColumnCount", iFixedColumnCount);
	};

	/**
	 * Returns the selected column by columnKey
	 * @param {String} sColumnKey - Key of the column
	 * @returns {Object} Requested column
	 * @public
	 */
	StructurePanelModel.prototype.getSelectedColumn = function (sColumnKey) {
		var oColumn;

		// eslint-disable-next-line consistent-return
		$.each(this.getProperty("/selectedColumns"), function (iIndex, oSelectedColumn) {
			if (oSelectedColumn.columnKey === sColumnKey) {
				oColumn = oSelectedColumn;

				return false;
			}
		});

		return oColumn;
	};

	/**
	 * Setter for the Structure Model Property IsBOMChangeAllowed
	 * Enables ETO specific columns in case BOM changes are allowed
	 *
	 * @param {boolean} bValue: are BOM changes allowed or not
	 * @public
	 */
	StructurePanelModel.prototype.setIsBOMChangeAllowed = function (bValue) {
		this.setProperty("/isBOMChangeAllowed", bValue);
	};

	/**
	 * Returns whether the BOM change is allowed
	 * @returns {Boolean} Flag of allowance
	 * @public
	 */
	StructurePanelModel.prototype.isBOMChangeAllowed = function () {
		return this.getProperty("/isBOMChangeAllowed");
	};

	/**
	 * Returns whether the ETO column set is available
	 * @returns {Boolean} Flag of availability
	 * @public
	 */
	StructurePanelModel.prototype.isETOColumnSetAvailable = function () {
		return this.getProperty("/isETOColumnSetAvailable");
	};

	/**
	 * Setter for the product filter value
	 * @param {String} sValue - Value of the filter property
	 * @public
	 */
	StructurePanelModel.prototype.setProductColumnFilterValue = function (sValue) {
		this.setProperty("/productColumnFilterValue", sValue);
	};

	/**
	 * Generic Getter for the Structure Model Properties
	 * @param {String} sProperty		 - Property Name
	 * @public
	 * @returns {String|Object} 	    - Property Value
	 */
	StructurePanelModel.prototype.getProperty = function (sProperty) {
		return this.getModel().getProperty(sProperty);
	};

	/**
	 * Personalizer for the Structure Panel according to the Configuration Settings
	 * @param {Object} oPersonalizationData									 - personalization data
	 * @param {Boolean} oPersonalizationData.IsBomAvailable					 - BOM views availability according
	 * 																		   to Configuration Settings
	 * @param {Boolean} oPersonalizationData.IsStrucConfigblItemAvailable	 - Configurable items view availability
	 * 																		   according to Configuration Settings
	 * @public
	 */
	StructurePanelModel.prototype.personalize = function (oPersonalizationData) {
		var aBOMAvailableViews = [];
		var bIsMultiLevelScenario = false;

		if (!oPersonalizationData || $.isEmptyObject(oPersonalizationData)) {
			Log.error(
				"No Personalization data available",
				"Please pass Configuration Settings Data",
				"sap.i2d.lo.lib.zvchclfz.components.structurepanel.logic.StructurePanelModel");

			return;
		}

		if (oPersonalizationData.IsStrucConfigblItemAvailable) {
			aBOMAvailableViews.push({
				text: i18n.getText(UiConfig.viewConfig[UiConfig.views.ConfigurableItems].title),
				key: UiConfig.views.ConfigurableItems
			});

			bIsMultiLevelScenario = true;
		}

		if (oPersonalizationData.IsBomAvailable) {
			aBOMAvailableViews.push({
				text: i18n.getText(UiConfig.viewConfig[UiConfig.views.BillOfMaterial].title),
				key: UiConfig.views.BillOfMaterial
			});
		}

		this.setProperty("/isRoutingAvailable", oPersonalizationData.IsRoutingAvailable);
		this.setProperty("/isSuperBOMAvailable", oPersonalizationData.IsSuperBOMAvailable);
		this.setProperty("/isETOColumnSetAvailable", oPersonalizationData.IsStrucETOColumnSetAvailable);
		//Used in the ETO actions determinations
		this.setProperty("/ConfigurationUISettings", oPersonalizationData.UISettings);
		//When Routing is separated we should also modify this logic
		if (aBOMAvailableViews.length === 0) {
			Log.error(
				"No Valid Personalization data available",
				"Please pass Configuration Settings Data",
				"sap.i2d.lo.lib.zvchclfz.components.structurepanel.logic.StructurePanelModel");

			return;
		}

		this.setProperty("/isMultiLevelScenario", bIsMultiLevelScenario);
		this.setProperty("/bomViews", aBOMAvailableViews);
		//Setting the Visibility of the BOM select button according to the Number of views available
		this._determineVisibilityOfSelectBOM();
		this._determineBOMBaseView(oPersonalizationData);
	};

	/**
	 * Determine the base view to be triggered after reset events according to the Configuration settings
	 * @private
	 */
	StructurePanelModel.prototype._determineVisibilityOfSelectBOM = function () {
		if (this.getProperty("/bomViews").length > 1) {
			this.setProperty("/selectBOMViewVisibility", true);
		} else {
			this.setProperty("/selectBOMViewVisibility", false);
		}
	};

	/**
	 * Determine the base view to be triggered after reset events according to the Configuration settings
	 * @param {Object} oPersonalizationData									 - personalization data
	 * @param {Boolean} oPersonalizationData.IsBomAvailable					 - BOM views availability according to
	 * 																		   Configuration Settings
	 * @param {Boolean} oPersonalizationData.IsStrucConfigblItemAvailable	 - Configurable items view availability
	 * 																		   according to Configuration Settings
	 * @private
	 */
	StructurePanelModel.prototype._determineBOMBaseView = function (oPersonalizationData) {
		var sBOMBaseView = null;

		if (oPersonalizationData.IsStrucConfigblItemAvailable) {
			sBOMBaseView = UiConfig.views.ConfigurableItems;
		} else if (oPersonalizationData.IsBomAvailable) {
			sBOMBaseView = UiConfig.views.BillOfMaterial;
		} else {
			Log.error(
				"No Valid Personalization data available",
				"Please pass Configuration Settings Data",
				"sap.i2d.lo.lib.zvchclfz.components.structurepanel.logic.StructurePanelModel");

			return;
		}

		this.setProperty("/baseViewForBOM", sBOMBaseView);
	};

	/**
	 * Resets the BOM Selected View To the Base View
	 * @public
	 */
	StructurePanelModel.prototype.resetToBOMBaseView = function () {
		this.setSelectedBOMView(this.getProperty("/baseViewForBOM"));
	};

	/**
	 * Returns the UI Configuration for the currently selected BOM view
	 * @public
	 * @returns {Object}	- UI configuration Object used to customize the view
	 */
	StructurePanelModel.prototype.getUIConfigForSelectedBOMView = function () {
		return UiConfig.viewConfig[this.getProperty("/selectedBOMView")];
	};

	/**
	 * Select BOM view according to the passed key
	 * @param {String} sKey	- to be Selected BOM View key
	 * @public
	 */
	StructurePanelModel.prototype.setSelectedBOMView = function (sKey) {
		if (UiConfig.viewConfig.hasOwnProperty(sKey)) {
			this.setProperty("/selectedBOMView", sKey);
			this.setProperty("/selectedBOMViewTitle", i18n.getText(UiConfig.viewConfig[sKey].title));
		} else {
			Log.error(
				"Could not find View Configuration for " + sKey,
				"Please Configure the View",
				"sap.i2d.lo.lib.zvchclfz.components.structurepanel.logic.StructurePanelModel");
		}
	};

	/**
	 * Setter for the Structure Panel Loading
	 * @param {Boolean} bFlag	- true/false
	 * @public
	 */
	StructurePanelModel.prototype.setStructurePanelLoading = function (bFlag) {
		this.setProperty("/isStructurePanelLoading", bFlag);
	};

	/**
	 * Setter for the isSuperTreeShown property
	 * @param {Boolean} isSuperTreeShown - the value for isSuperTreeShown
	 * @public
	 */
	StructurePanelModel.prototype.setSuperTreeShown = function (isSuperTreeShown) {
		this.setProperty("/isSuperTreeShown", isSuperTreeShown);
	};

	/**
	 * Getter for the isSuperTreeShown property
	 * @returns {Boolean} flag of isSuperTreeShown
	 * @public
	 */
	StructurePanelModel.prototype.isSuperTreeShown = function () {
		return this.getProperty("/isSuperTreeShown");
	};

	/**
	 * Returns the currently Selected BOM view
	 * @public
	 * @returns {String} 	- Selected BOM view
	 */
	StructurePanelModel.prototype.getSelectedBOMView = function () {
		return this.getProperty("/selectedBOMView");
	};

	/**
	 * Returns whether the configurable items view is selected
	 * @public
	 * @returns {String} 	- Selected BOM view
	 */
	StructurePanelModel.prototype.isConfigurableItemViewSelected = function () {
		return this.getSelectedBOMView() === UiConfig.views.ConfigurableItems;
	};

	/**
	 * Sets the Configuration Context Id
	 * @param {String} sConfigurationContextId	 - Configuration Context Id
	 * @public
	 */
	StructurePanelModel.prototype.updateConfigurationContextId = function (sConfigurationContextId) {
		this.setProperty("/ConfigurationContextId", sConfigurationContextId);
	};

	/**
	 * Returns Configuration Context Id
	 * @returns {String} 		 - Configuration Context Entity Id
	 * @public
	 */
	StructurePanelModel.prototype.getConfigurationContextId = function () {
		return this.getProperty("/ConfigurationContextId");
	};

	/**
	 * Returns the Binding Path of the caller of Routing Frame
	 * @public
	 * @returns {String} 	- Binding Path with / in the start
	 */
	StructurePanelModel.prototype.getRoutingFrameCallerBindingPath = function () {
		return this.getProperty("/routingFrameCaller/bindingPath");
	};

	/**
	 * Returns the routing key of the caller of Routing Frame
	 * @public
	 * @returns {Object} - Object of the Routing Key
	 */
	StructurePanelModel.prototype.getRoutingFrameCallerRoutingKey = function () {
		return this.getProperty("/routingFrameCaller/routingKey");
	};

	/**
	 * Returns the BOM Node of the caller of Routing Frame
	 * @public
	 * @returns {Object} - Object of the BOMNode entity
	 */
	StructurePanelModel.prototype.getRoutingFrameCallerBOMNode = function () {
		return this.getProperty("/routingFrameCaller/bomNode");
	};

	/**
	 * Returns the assigned Available Routings of Product
	 * @public
	 * @return {Object} - Object of the Routing entities
	 */
	StructurePanelModel.prototype.getAvailableRoutings = function () {
		return this.getProperty("/availableRoutings/routings");
	};

	/**
	 * Reset availableRoutings property
	 */
	StructurePanelModel.prototype.resetAvailableRoutings = function () {
		this.setProperty("/availableRoutings", {
			numberOfRoutings: 0,
			selectedRouting: "",
			routings: []
		});
	};

	/**
	 * Setter for the Caller of the Routing Frame Path
	 * @param {String} sPath		- Binding Path
	 * @param {Object} oRoutingKey	- Object of the Routing Key
	 * @param {Object} oBOMNode	- Object of the BOMNode entity
	 * @public
	 */
	StructurePanelModel.prototype.setRoutingFrameCaller = function (sPath, oRoutingKey, oBOMNode) {
		if (sPath) {
			this.setProperty("/routingFrameCaller/bindingPath", sPath);
			this.setProperty("/routingFrameCaller/routingKey", oRoutingKey);
			this.setProperty("/routingFrameCaller/bomNode", oBOMNode);
			this.setProperty("/routingHeaderProduct", oBOMNode.Product);
		} else {
			Log.error(
				"Missing Caller Path",
				"Please the Routing Caller properly",
				"sap.i2d.lo.lib.zvchclfz.components.structurepanel.logic.StructurePanelModel");
		}
	};

	/**
	 * Return Filters filter for currently selected BOM view
	 * @returns {Array} 	- filters
	 * @public
	 */
	StructurePanelModel.prototype.getFiltersForCurrentlySelectedBOMview = function () {
		var oViewConfig = this.getUIConfigForSelectedBOMView();

		if (!oViewConfig) {
			Log.error(
				"Invalid BOM view ID",
				"Provide a valid BOM view ID to be able to bind data to Structure Tree.",
				"sap.i2d.lo.lib.zvchclfz.components.structurepanel.controller.StructureTree");

			return undefined;
		}

		return oViewConfig.getFilters(this.isSuperTreeShown());
	};

	/**
	 * Returns whether the structure panel can be enabled
	 * @param {Object} oPersonalizationData									 - personalization data
	 * @param {Boolean} oPersonalizationData.IsBomAvailable					 - BOM views availabilty according
	 * 																		   to Configuration Settings
	 * @param {Boolean} oPersonalizationData.IsStrucConfigblItemAvailable	 - Configurable items view availabilty
	 * 																		   according to Configuration Settings
	 * @param {Boolean} oPersonalizationData.IsRoutingAvailable			     - Routingview availabilty according
	 * 																		   to Configuration Settings
	 * @returns {Boolean} 	- StructPanel can be enabled
	 * @public
	 */
	StructurePanelModel.prototype.isStructurePanelEnabled = function (oPersonalizationData) {
		if (oPersonalizationData && !$.isEmptyObject(oPersonalizationData) &&
			(
				oPersonalizationData.IsBomAvailable ||
				oPersonalizationData.IsStrucConfigblItemAvailable ||
				oPersonalizationData.IsRoutingAvailable
			)) {
			return true;
		} else {
			return false;
		}
	};

	/**
	 * Returns whether the routing is available
	 * @returns {Boolean} Flag of availability
	 * @public
	 */
	StructurePanelModel.prototype.isRoutingAvailable = function () {
		return this.getProperty("/isRoutingAvailable");
	};

	/**
	 * Gets whether we are in the multi level scenario
	 * @public
	 * @returns {String}	- is multi-level
	 */
	StructurePanelModel.prototype.getIsMultiLevelScenario = function () {
		return this.getProperty("/isMultiLevelScenario");
	};

	/**
	 * Setter for BOM explosion indicator
	 * @param {Boolean} bFlag	- whether the BOM explosion was triggered
	 * @public
	 */
	StructurePanelModel.prototype.setIsBOMInitialLoad = function (bFlag) {
		this.setProperty("/isBOMInitialLoad", bFlag);
	};

	/**
	 * Gets whether BOM explosion indicator
	 * @returns {Boolean} 	- whether the BOM explosion was triggered
	 * @public
	 */
	StructurePanelModel.prototype.getIsBOMInitialLoad = function () {
		return this.getProperty("/isBOMInitialLoad");
	};

	/**
	 * Setter for BOM force explosion indicator
	 * @param {Boolean} bFlag	- whether the BOM explosion is forced refresh
	 * @public
	 */
	StructurePanelModel.prototype.setForceBOMExplosion  = function (bFlag) {
		this.setProperty("/forceBOMExplosion ", bFlag);
	};

	/**
	 * Gets whether BOM force explosion indicator
	 * @returns {Boolean} 	- whether the BOM explosion is forced refresh
	 * @public
	 */
	StructurePanelModel.prototype.getForceBOMExplosion  = function () {
		return this.getProperty("/forceBOMExplosion ");
	};

	/**
	 * Setter the currently focused BOM Item
	 * @param {Object} oBOMItem - BOM item
	 * @public
	 */
	StructurePanelModel.prototype.setCurrentlyFocusedBOMItem = function (oBOMItem) {
		this.setProperty("/currentlyFocusedBOMItem", oBOMItem);
	};

	/**
	 * Gets the currently focused BOM Item
	 * @returns {Object} BOM item
	 * @public
	 */
	StructurePanelModel.prototype.getCurrentlyFocusedBOMItem = function () {
		return this.getProperty("/currentlyFocusedBOMItem");
	};

	/**
	 * Setter the currently loaded BOM Item in the valuation
	 * @param {Object} oBOMItem - BOM item
	 * @public
	 */
	StructurePanelModel.prototype.setCurrentlyLoadedBOMItemInValuation = function (oBOMItem) {
		this.setProperty("/currentlyLoadedBOMItemInValuation", oBOMItem);
	};

	/**
	 * Gets the currently loaded BOM Item in the valuation
	 * @returns {Object} BOM item
	 * @public
	 */
	StructurePanelModel.prototype.getCurrentlyLoadedBOMItemInValuation = function () {
		return this.getProperty("/currentlyLoadedBOMItemInValuation");
	};

	/**
	 * Sets the product column is filtered property
	 * @param {Boolean}	bProductFiltered - whether the product is filtered
	 * @public
	 */
	StructurePanelModel.prototype.setProductColumnFiltered = function (bProductFiltered) {
		this.setProperty("/isProductColumnFiltered", bProductFiltered);
	};

	/**
	 * Setter for Structure Panel Editable Flag
	 * @param {Boolean} bEditable - editable flag
	 * @public
	 */
	StructurePanelModel.prototype.setStructurePanelEditable = function (bEditable) {
		this.setProperty("/isStructurePanelEditable", bEditable);
	};

	/**
	 * Setter for number of routings and routings property
	 * @param {Array} aRoutings - routings of Product
	 * @public
	 */
	StructurePanelModel.prototype.setRoutings = function (aRoutings) {
		this.setProperty("/availableRoutings/numberOfRoutings", aRoutings.length);
		this.setProperty("/availableRoutings/routings", aRoutings);

		if (aRoutings.length === 1) {
			this.setProperty("/availableRoutings/selectedRouting", RoutingSelectionUtil.getConcatenatedRoutingKey(
				aRoutings[0].BillOfOperationsGroup, aRoutings[0].BillOfOperationsVariant));
		}
	};

	/**
	 * Setter for selectedRouting property of routings property
	 * @param {String} sBillOfOperationsGroup - BillOfOperationsGroup property of RoutingNode entity
	 * @param {String} sBillOfOperationsVariant - BillOfOperationsVariant property of RoutingNode entity
	 * @public
	 */
	StructurePanelModel.prototype.setSelectedRouting = function (sBillOfOperationsGroup, sBillOfOperationsVariant) {
		this.setProperty("/availableRoutings/selectedRouting", RoutingSelectionUtil.getConcatenatedRoutingKey(
			sBillOfOperationsGroup, sBillOfOperationsVariant));
	};

	/**
	 * Getter for Structure Panel Editable Flag
	 * @returns {Boolean} 	- editable flag
	 * @public
	 */
	StructurePanelModel.prototype.isStructurePanelEditable = function () {
		return this.getProperty("/isStructurePanelEditable");
	};

	/**
	 * Setter for Description Mode
	 * @param {sap.i2d.lo.lib.zvchclfz.common.type.DescriptionMode} sDescriptionMode - Description Mode
	 * @public
	 */
	StructurePanelModel.prototype.setDescriptionMode = function (sDescriptionMode) {
		this.setProperty("/descriptionMode", sDescriptionMode);
	};

	/**
	 * Getter for Description Mode
	 * @returns {sap.i2d.lo.lib.zvchclfz.common.type.DescriptionMode} Description Mode
	 * @public
	 */
	StructurePanelModel.prototype.getDescriptionMode = function () {
		return this.getProperty("/descriptionMode");
	};

	/**
	 * Setter for Semantic Object
	 * @param {String} sSemanticObject - Semantic Object
	 * @public
	 */
	StructurePanelModel.prototype.setSemanticObject = function (sSemanticObject) {
		this.setProperty("/semanticObject", sSemanticObject);
	};

	/**
	 * Getter for Semantic Object
	 * @returns {String} Semantic Object
	 * @public
	 */
	StructurePanelModel.prototype.getSemanticObject = function () {
		return this.getProperty("/semanticObject");
	};

	/**
	 * Setter for whether a BOM explosion indicator
	 * @param {Boolean} bFlag	- whether the BOM is assigned to Configuration
	 * @public
	 */
	StructurePanelModel.prototype.setIsBOMExplosionPossible = function (bFlag) {
		this.setProperty("/isBOMExplosionPossible", bFlag);
	};

	/**
	 * Gets whether a BOM explosion indicator
	 * @returns {Boolean} 	- whether the BOM is assigned to Configuration
	 * @public
	 */
	StructurePanelModel.prototype.getIsBOMExplosionPossible = function () {
		return this.getProperty("/isBOMExplosionPossible");
	};

	return new StructurePanelModel();

});
