/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/common/type/InspectorMode",
	"sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/ODataModelHelper",
	"sap/base/Log",
	"sap/ui/model/json/JSONModel"
	// eslint-disable-next-line max-statements
], function (InspectorMode, ConfigConstants, Constants, ODataModelHelper, Log, JSONModel) {
	"use strict";

	/**
	 * Properties of the inspector Model
	 * @private
	 * @type {Object}
	 */
	var _properties = {
		/**
		 * indicator whether comparison to another config state is allowed
		 * @private
		 * @type {Boolean}
		 */
		isConfigComparisonAllowed: false,
		/**
		 * indicator whether the Trace enabled for the configuration
		 * @private
		 * @type {Boolean}
		 */
		isTraceSupported: false,

		/**
		 * indicator whether the tracking is connected plug/unplug inspector
		 * @private
		 * @type {Boolean}
		 */
		isTrackEventConnected: true,

		/**
		 * indicator whether the Trace is On/Off
		 * @private
		 * @type {Boolean}
		 */
		isTraceOn: false,

		/**
		 * Indicator whether the Super inspector is available or not
		 * @private
		 * @type {Boolean}
		 */
		isSuperInspectorAvailable: false,

		/**
		 * indicator whether the Trace is activated at least once it is used to restrict the BE requests
		 * @private
		 * @type {Boolean}
		 */
		isTraceActivatedOnce: null,

		/**
		 * indicator for the Trace Switch to state busy state
		 * @private
		 * @type {Boolean}
		 */
		traceSwitchBusyState: false,

		/**
		 * Inspector Selected View
		 * @private
		 * @type {String}
		 */
		selectedView: Constants.inspectorView.Inspector,

		/**
		 * Inspector Selected Tab
		 * @private
		 * @type {String}
		 */
		selectedTab: InspectorMode.inspectorTab.properties,

		/**
		 * Indicator whether the back behaviour is enabled
		 * @private
		 * @type {Boolean}
		 */
		isBackEnabled: false,

		/**
		 * Indicator whether the comparison view is restricted when a certain BOM component is selected
		 */
		isComparisonRestrictionActive: true,

		/**
		 * Configuration Context Path
		 * @private
		 * @type {String}
		 */
		ConfigurationContextPath: "",

		/**
		 * Configuration Context Id
		 * @private
		 * @type {String}
		 */
		ConfigurationContextId: "",

		/**
		 * Configuration Context Current instance Id
		 * @private
		 * @type {String}
		 */
		InstanceId: "",

		/**
		 * Configuration Context Current group
		 * @private
		 * @type {String}
		 */
		GroupId: "0", //Default group to be used in the inspection from the trace

		/**
		 * Configuration Context semantic object
		 * @private
		 * @type {String}
		 */
		semanticObject: "",

		/**
		 * Indicator whether Inspector is update when the Last Access object is changed
		 * @private
		 * @type {Boolean}
		 */
		inspectorComponentUpdated: false,

		/**
		 * Indicator whether the content of the inspector component is invalidated
		 * @private
		 * @type {Boolean}
		 */
		inspectorContentInvalidated: false,

		/**
		 * Stores the last object which was navigated to used for inspector refresh
		 * @private
		 * @type {Object}
		 * @property {String} path - path of the accessed object
		 * @property {String} type - type of the accessed object
		 */
		lastObjectNavigatedTo: {
			path: null,
			type: null
		},

		/**
		 * Stores the last object which was accessed
		 * @private
		 * @type {Object}
		 * @property {String} path - path of the accessed object
		 * @property {String} type - type of the accessed object
		 */
		lastAccessedObject: {
			path: null,
			type: null
		},

		/**
		 * Indicator whether the inspector is editable whether valuation calculation before fetch
		 * @type {Boolean}
		 * @private
		 */
		isInspectorEditable: false,

		/**
		 * Indicator whether the trace should show precise numbers for values or not
		 * @type {Boolean}
		 * @private
		 */
		showPreciseNumbers: false,

		/**
		 * Indicator whether external navigation are enabled to other applications
		 * @type {Boolean}
		 * @private
		 */
		isExternalNavigationEnabled: true
	};

	/**
	 * JSON model which contains the inspector Model
	 * @type {sap.ui.model.json.JSONModel}
	 * @private
	 */
	var _model = null;

	/**
	 * Callback function which check if inspector is visible set in setInspectorVisibilityChecker
	 * @function
	 * @private
	 */
	var _fnCheckInspectorVisibility = null;

	/**
	 * Access class for Inspector Model
	 * @constructor
	 * @class
	 * @public
	 */
	var InspectorModel = function () {
		_model = new JSONModel($.extend(true, {}, _properties));
	};

	/**
	 * Reset the Inspector Model
	 * @public
	 */

	InspectorModel.prototype.resetModel = function () {
		_model.setData($.extend(true, {}, _properties));
	};

	/**
	 * Setup the Inspector Model
	 * @param {String} sContextId - Context ID
	 * @param {String} sInstanceId - Instance ID
	 * @param {Object} oPersonalizationData - personalization data
	 * @param {Boolean} oPersonalizationData.IsTraceAvailable - Trace availability according to Configuration Settings
	 * @param {Boolean} oPersonalizationData.IsBomAvailable - BOM views availability according to Configuration Settings
	 * @param {Boolean} bShowPreciseNumbers - show precise number flag
	 * @param {Boolean} bInspectorEditable - inspector editable flag
	 * @param {Boolean} bIsExternalNavigationEnabled - inspector external navigation support
	 * @public
	 */
	InspectorModel.prototype.setupModel =
		function (sContextId, sInstanceId, oPersonalizationData, bShowPreciseNumbers, bInspectorEditable,
			bIsExternalNavigationEnabled) {
			this.resetModel();

			this.updateConfigurationContextId(sContextId);
			this.setProperty("/InstanceId", sInstanceId);
			var bConfigComparisonAllowed = oPersonalizationData.UISettings &&
				oPersonalizationData.UISettings.IsConfigCompAllowed &&
				this.getSupportedEtoStatusesForComparison()[oPersonalizationData.EtoStatus] !== undefined;

			this.setProperty("/isConfigComparisonAllowed", bConfigComparisonAllowed);
			this.setIsTraceSupported(oPersonalizationData.IsTraceAvailable);
			this.setIsSuperInspectorAvailable(oPersonalizationData.IsBomAvailable && oPersonalizationData.IsSuperBOMAvailable);
			this.setShowPreciseNumbers(bShowPreciseNumbers);
			this.setIsInspectorEditable(bInspectorEditable);
			this.setIsExternalNavigationEnabled(bIsExternalNavigationEnabled);
		};


	/**
	 * Returns a map with the supported ETO Statuses as keys and their corresponding source diff ref type
	 * @public
	 * @returns {Map} - a map with the supported statuses
	 */
	InspectorModel.prototype.getSupportedEtoStatusesForComparison = function () {
		var mEtoStatusToSourceRef = {};
		mEtoStatusToSourceRef[ConfigConstants.ETO_STATUS.ENGINEERING_FINISHED] = ConfigConstants.DIFF_REF_TYPE.BEFORE_HANDOVER_TO_ENGINEERING;
		//mEtoStatusToSourceRef[Constants.ETO_STATUS.REENGINEERING_NEEDED] = Constants.DIFF_REF_TYPE.BEFORE_REVIEW_BY_SALES;
		//mEtoStatusToSourceRef[Constants.ETO_STATUS.REVIEW_FINISHED_BY_SALES] = Constants.DIFF_REF_TYPE.BEFORE_HANDOVER_TO_ENGINEERING;
		return mEtoStatusToSourceRef;
	};

	/**
	 * Getter for the Inspector Model
	 * @public
	 * @returns {sap.ui.model.json.JSONModel} - The message model for binding
	 */
	InspectorModel.prototype.getModel = function () {
		return _model;
	};

	/**
	 * Generic Setter for the Inspector Model Properties
	 * @param {String} sProperty		 - Property Name
	 * @param {String|Object} oValue	 - Property Value
	 * @public
	 */
	InspectorModel.prototype.setProperty = function (sProperty, oValue) {
		this.getModel().setProperty(sProperty, oValue);
	};

	/**
	 * Generic Getter for the Inspector Model Properties
	 * @param {String} sProperty		 - Property Name
	 * @public
	 * @returns {String|Object} 	    - Property Value
	 */
	InspectorModel.prototype.getProperty = function (sProperty) {
		return this.getModel().getProperty(sProperty);
	};

	/**
	 * Selects the Inspector View
	 * @public
	 */
	InspectorModel.prototype.selectInspectorView = function () {
		this.setProperty("/selectedView", Constants.inspectorView.Inspector);
	};

	/**
	 * Selects the Trace View
	 * @public
	 */
	InspectorModel.prototype.selectTraceView = function () {
		this.setProperty("/selectedView", Constants.inspectorView.Trace);
	};


	/**
	 * Selects the Comparison View
	 * @public
	 */
	InspectorModel.prototype.selectComparisonView = function () {
		this.setProperty("/selectedView", Constants.inspectorView.Comparison);
	};

	/**
	 * returns  Whether the Inspector is Selected
	 * @public
	 * @returns {Boolean} 	    - is inspector selected
	 */
	InspectorModel.prototype.isInspectorViewSelected = function () {
		return this.getProperty("/selectedView") === Constants.inspectorView.Inspector;
	};

	/**
	 * Returns whether the Trace view is Selected
	 * @public
	 * @returns {Boolean} is trace view selected
	 */
	InspectorModel.prototype.isTraceViewSelected = function () {
		return this.getProperty("/selectedView") === Constants.inspectorView.Trace;
	};

	/**
	 * Returns whether the Comparison view is Selected
	 * @public
	 * @returns {Boolean} is Comparison view selected
	 */
	InspectorModel.prototype.isComparisonViewSelected = function () {
		return this.getProperty("/selectedView") === Constants.inspectorView.Comparison;
	};

	/**
	 * Sets whether the inspector was updated after Last Access Object
	 * @param {Boolean} bFlag		 - Property Value
	 * @public
	 */
	InspectorModel.prototype.setInspectorComponentUpdated = function (bFlag) {
		this.setProperty("/inspectorComponentUpdated", bFlag);
		// a new object will be loaded which content is default valid
		this.setProperty("/inspectorContentInvalidated", false);
	};

	/**
	 * Gets whether the inspector was updated after Last Access Object
	 * @public
	 * @returns {Boolean} 		 - Property Value
	 */
	InspectorModel.prototype.getInspectorComponentUpdated = function () {
		return this.getProperty("/inspectorComponentUpdated");
	};

	/**
	 * Sets whether the content of the inspector component is invalidated
	 * @param {Boolean} bFlag - Property Value
	 * @public
	 */
	InspectorModel.prototype.setInspectorContentInvalidated = function (bFlag) {
		this.setProperty("/inspectorContentInvalidated", bFlag);
	};

	/**
	 * Gets whether the content of the inspector component is invalidated
	 * @public
	 * @returns {Boolean} - Property Value
	 */
	InspectorModel.prototype.getInspectorContentInvalidated = function () {
		return this.getProperty("/inspectorContentInvalidated");
	};

	/**
	 * sets Last Access Object
	 * @param {String} sPath - property path
	 * @param {String} sType - property type
	 * @public
	 */
	InspectorModel.prototype.setLastAccessObject = function (sPath, sType) {
		this.setProperty("/lastAccessedObject/path", sPath);
		this.setProperty("/lastAccessedObject/type", sType);
	};

	/**
	 * Gets Last Access Object path
	 * @public
	 * @returns {String} 		 - Property Value
	 */
	InspectorModel.prototype.getLastAccessObjectPath = function () {
		return this.getProperty("/lastAccessedObject/path");
	};

	/**
	 * Gets Last Access Object type
	 * @public
	 * @returns {String} 		 - Property Value
	 */
	InspectorModel.prototype.getLastAccessObjectType = function () {
		return this.getProperty("/lastAccessedObject/type");
	};

	/**
	 * sets last navigated to object
	 * @param {String} sPath - property path
	 * @param {String} sType - property type
	 * @public
	 */
	InspectorModel.prototype.setLastObjectNavigatedTo = function (sPath, sType) {
		this.setProperty("/lastObjectNavigatedTo/path", sPath);
		this.setProperty("/lastObjectNavigatedTo/type", sType);
	};

	/**
	 * Gets last navigated to object path
	 * @public
	 * @returns {String} 		 - Property Value
	 */
	InspectorModel.prototype.getLastObjectNavigatedToPath = function () {
		return this.getProperty("/lastObjectNavigatedTo/path");
	};

	/**
	 * Gets last navigated to object type
	 * @public
	 * @returns {String} 		 - Property Value
	 */
	InspectorModel.prototype.getLastObjectNavigatedToType = function () {
		return this.getProperty("/lastObjectNavigatedTo/type");
	};

	/**
	 * Compares last navigated to object path with input value
	 * @param {String} sPath	 - context path to be compared
	 * @public
	 * @returns {Boolean} 		 - indicator whether the two paths are identical
	 */
	InspectorModel.prototype.compareLastObjectNavigatedToPath = function (sPath) {
		return this.getProperty("/lastObjectNavigatedTo/path") === sPath;
	};

	/**
	 * Compares last access object path with input value
	 * @param {String} sPath	 - context path to be compared
	 * @public
	 * @returns {Boolean} 		 - indicator whether the two paths are identical
	 */
	InspectorModel.prototype.compareWithLastAccessObjectPath = function (sPath) {
		return this.getProperty("/lastAccessedObject/path") === sPath;
	};

	/**
	 * Compares last navigated to object path and type with input values
	 * @param {String} sPath	 - context path to be compared
	 * @param {String} sType	 - context type to be compared
	 * @public
	 * @returns {Boolean} 		 - indicator whether the two  are identical
	 */
	InspectorModel.prototype.compareWithLastAccessObject = function (sPath, sType) {
		return this.getLastAccessObjectType() === sType &&
			this.compareWithLastAccessObjectPath(sPath);
	};

	/**
	 * Compares the current last navigated to and accessed object
	 * @public
	 * @returns {Boolean} 		 - indicator whether the two objects are identical
	 */
	InspectorModel.prototype.compareLastAccessedAndNavigatedTo = function () {
		return this.compareWithLastAccessObject(
			this.getLastObjectNavigatedToPath(), this.getLastObjectNavigatedToType());
	};

	/**
	 * Sets inspector visibility checker
	 * @param {Callback} fnCallBack - function used to check inspector visibility
	 * @public
	 */
	InspectorModel.prototype.setInspectorVisibilityChecker = function (fnCallBack) {
		if (fnCallBack &&
			$.isFunction(fnCallBack)) {
			_fnCheckInspectorVisibility = fnCallBack;
		} else {
			Log.error(
				"No Callback function is defined",
				"CallBack function to check inspector visibility",
				"sap.i2d.lo.lib.zvchclfz.components.inspector.logic.InspectorModel");
		}
	};

	/**
	 * Fetches whether the inspector is visible
	 * @returns {Boolean} 		 - indicator whether inspector is visible
	 * @public
	 */
	InspectorModel.prototype.getInspectorVisibility = function () {
		if (_fnCheckInspectorVisibility &&
			$.isFunction(_fnCheckInspectorVisibility)) {
			return _fnCheckInspectorVisibility();
		} else {
			Log.error(
				"No Callback function is defined",
				"CallBack function to check inspector visibility",
				"sap.i2d.lo.lib.zvchclfz.components.inspector.logic.InspectorModel");

			return false;
		}
	};

	/**
	 * Sets the Configuration Context Id
	 * @param {String} sConfigurationContextId	 - Configuration Context Id
	 * @public
	 */
	InspectorModel.prototype.updateConfigurationContextId = function (sConfigurationContextId) {
		var sConfigurationContextPath = "/" + ODataModelHelper.getModel().createKey(
			Constants.entitySets.ConfigurationContext, {
				ContextId: sConfigurationContextId
			});

		this.setProperty("/ConfigurationContextPath", sConfigurationContextPath);

		this.setProperty("/ConfigurationContextId", sConfigurationContextId);
	};

	/**
	 * Returns Configuration Context path
	 * @returns {String} 		 - Configuration Context Entity path
	 * @public
	 */
	InspectorModel.prototype.getConfigurationContextPath = function () {
		return this.getProperty("/ConfigurationContextPath");
	};

	/**
	 * Returns Configuration Context Id
	 * @returns {String} 		 - Configuration Context Entity Id
	 * @public
	 */
	InspectorModel.prototype.getConfigurationContextId = function () {
		return this.getProperty("/ConfigurationContextId");
	};

	/**
	 * Returns whether the trace is supported
	 * @returns {Boolean} 		 - whether the trace is enabled for this scenario
	 * @public
	 */
	InspectorModel.prototype.getIsTraceSupported = function () {
		return this.getProperty("/isTraceSupported");
	};

	/**
	 * Sets trace is supported
	 * @param {Boolean} bIsTraceSupported - indicator whether Trace is supported
	 * @public
	 */
	InspectorModel.prototype.setIsTraceSupported = function (bIsTraceSupported) {
		this.setProperty("/isTraceSupported", bIsTraceSupported);
	};

	/**
	 * Returns whether the super inspector is available
	 * @returns {Boolean} flag of the isSuperInspectorAvailable
	 * @public
	 */
	InspectorModel.prototype.getIsSuperInspectorAvailable = function () {
		return this.getProperty("/isSuperInspectorAvailable");
	};

	/**
	 * Sets whether the super inspector is available
	 * @param {Boolean} bIsSuperInspectorAvailable - indicator whether the super inspector is available
	 * @public
	 */
	InspectorModel.prototype.setIsSuperInspectorAvailable = function (bIsSuperInspectorAvailable) {
		this.setProperty("/isSuperInspectorAvailable", bIsSuperInspectorAvailable);
	};

	/**
	 * Returns whether the super inspector is editable
	 * @returns {Boolean} flag of the isInspectorEditable
	 * @public
	 */
	InspectorModel.prototype.isInspectorEditable = function () {
		return this.getProperty("/isInspectorEditable");
	};

	/**
	 * Sets whether the super inspector is editable
	 * @param {Boolean} bEditable - editable flag
	 * @public
	 */
	InspectorModel.prototype.setIsInspectorEditable = function (bEditable) {
		this.setProperty("/isInspectorEditable", bEditable);
	};

	/**
	 * Sets whether the trace should show precise numbers for values or not
	 * @param {Boolean} bShowPreciseNumbers - show precise number flag
	 * @public
	 */
	InspectorModel.prototype.setShowPreciseNumbers = function (bShowPreciseNumbers) {
		this.setProperty("/showPreciseNumbers", bShowPreciseNumbers);
	};

	/**
	 * Sets whether external navigation is supported
	 * @param {Boolean} bIsExternalNavigationEnabled - indicator flag
	 * @public
	 */
	InspectorModel.prototype.setIsExternalNavigationEnabled = function (bIsExternalNavigationEnabled) {
		this.setProperty("/isExternalNavigationEnabled", bIsExternalNavigationEnabled);
	};

	/**
	 * Gets whether external navigation is supported
	 * @returns {Boolean} flag of the isExternalNavigationEnabled
	 * @public
	 */
	InspectorModel.prototype.getIsExternalNavigationEnabled = function () {
		return this.getProperty("/isExternalNavigationEnabled");
	};

	return new InspectorModel();
});
