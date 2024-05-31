/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/TraceFilterDialogConfig",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/TraceFilterTypes",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/dialog/DependencyTraceFilterDialog",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/DependencyTraceMapper",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/i18n",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
	// eslint-disable-next-line max-params
], function (TraceFilterDialogConfig, TraceFilterTypes, DependencyTraceFilterDialog, Constants, InspectorModel,
	DependencyTraceMapper, i18n, Filter, FilterOperator) {
	"use strict";

	var FILTER_OBJECT_SEPARATOR = " + ";
	var SUPPORTED_FILTERS_BY_DIALOG = TraceFilterDialogConfig.SupportedTraceFilterTypes;

	/**
	 * Constructor of the Dependency Trace Filter Manager
	 * THIS CLASS SHOULD BE ACCESSED ONLY FROM DEPENDENCY TRACE MODEL
	 * @constructor
	 */
	var DependencyTraceFilterManager = function () {
		/**
		 * Object for store the currently set filters
		 * The content should be a key (from inspector.config.TraceFilterTypes.SupportedTraceFilterTypes) - filter pairs
		 * @type {Object}
		 * @private
		 */
		this._filters = {};

		/**
		 * Stores the currently set search text
		 * @type {String}
		 * @private
		 */
		this._searchText = "";

		/**
		 * Object for save the filter state before clear
		 * @type {Object}
		 * @private
		 */
		this._savedState = {
			filters: {},
			rootPath: {},
			searchText: ""
		};

		/**
		 * Object for store the path to the trace entries
		 * @type {Object}
		 * @private
		 */
		this._rootPath = {
			path: null,
			filterText: null
		};
	};

	/**
	 * Sets the root path of the trace in the internal model
	 * @param {String} sPath - Root path which should be used
	 * @param {String} sPathFilterText - Filter text for the root path
	 * @public
	 */
	DependencyTraceFilterManager.prototype.setRootPath = function (sPath, sPathFilterText) {
		// If the root path of the trace entries is changed, the filters should be cleared
		this.clearAllFilters();

		this._rootPath = {
			path: sPath,
			filterText: sPathFilterText
		};
	};

	/**
	 * Returns the path to the trace entries
	 * @returns {String} Path to the trace entries
	 * @public
	 */
	DependencyTraceFilterManager.prototype.getRootPath = function () {
		return this._rootPath.path;
	};

	/**
	 * Sets the search text of the trace
	 * @param {String} sSearchText - Search text
	 * @public
	 */
	DependencyTraceFilterManager.prototype.setSearchText = function (sSearchText) {
		this._searchText = sSearchText;
	};

	/**
	 * Returns the search text of the trace
	 * @returns {String} Search text of the trace
	 * @public
	 */
	DependencyTraceFilterManager.prototype.getSearchText = function () {
		return this._searchText;
	};

	/**
	 * Sets filters for a filter type
	 * @param {String} sFilterType - Type of the filter
	 * @param {Object[]} aFilterObjects - Objects of filters which contain the information
	 * @public
	 */
	DependencyTraceFilterManager.prototype.setFiltersForFilterType = function (sFilterType, aFilterObjects) {
		this._filters[sFilterType] = aFilterObjects;
	};

	/**
	 * Clears all the filters
	 * @public
	 */
	DependencyTraceFilterManager.prototype.clearAllFilters = function () {
		this._filters = {};
		this._searchText = "";

		this._rootPath = {
			path: InspectorModel.getConfigurationContextPath() + "/" +
				Constants.navigationProperties.ConfigurationContext.TraceEntry,
			text: null
		};
	};

	/**
	 * Returns the filter for the backend request
	 * @returns {sap.ui.model.Filter[]} Array of filter objects
	 * @public
	 */
	DependencyTraceFilterManager.prototype.getFilters = function () {
		var aMergedFilters = [];
		var oMessageTypeIdRelevantFilters = {};

		$.each(this._filters, function (sType, aFilterObjects) {
			// WORKAROUND: temporary, while the new Trace Filter dialog is not implemented
			// In the new trace the Message Type and Value Assignment By filters cannot be use,
			// so these filter shall be post process => map them to MessageTypeId
			if (sType === TraceFilterTypes.SupportedTraceFilterTypes.MessageType ||
				sType === TraceFilterTypes.SupportedTraceFilterTypes.ValueAssignmentBy) {

				oMessageTypeIdRelevantFilters[sType] = aFilterObjects;
			} else {
				var aFiltersForType = [];

				$.each(aFilterObjects, function (iIndex, oFilterObject) {
					if ($.isPlainObject(oFilterObject.parameters)) {
						var aFilterProperties = [];

						$.each(oFilterObject.parameters, function (sProperty, sValue) {
							aFilterProperties.push(new Filter(sProperty, FilterOperator.EQ, sValue));
						});

						if (aFilterProperties.length > 0) {
							aFiltersForType.push(new Filter({
								filters: aFilterProperties,
								and: true
							}));
						}
					}
				});

				if (aFiltersForType.length > 0) {
					aMergedFilters.push(new Filter({
						filters: aFiltersForType,
						and: false
					}));
				}
			}
		});

		var oMsgTypeIdFilters = DependencyTraceMapper.createMsgTypeIdFilters(oMessageTypeIdRelevantFilters);

		if (oMsgTypeIdFilters) {
			aMergedFilters.push(oMsgTypeIdFilters);
		}

		return aMergedFilters;
	};

	/**
	 * Returns the concatenated filter text for the OverflowToolbar
	 * @returns {String} Concatenated filter text
	 * @public
	 */
	DependencyTraceFilterManager.prototype.getConcatenatedFilterText = function () {
		var aFilterText = [];

		if (this._searchText) {
			aFilterText.push(i18n.getTextWithParameters("vchclf_trace_filter_status_text", [this._searchText]));
		}

		if (this._rootPath.filterText) {
			aFilterText.push(this._rootPath.filterText);
		}

		$.each(this._filters, function (sType, aFilterObjects) {
			var oPropertyI18n = TraceFilterTypes.FilterPropertyI18ns[sType];

			if (oPropertyI18n) {
				if (aFilterObjects.length > 1 && oPropertyI18n.multi) {
					aFilterText.push(i18n.getTextWithParameters(oPropertyI18n.multi, [aFilterObjects.length]));
				} else if (oPropertyI18n.single) {
					aFilterText.push(i18n.getTextWithParameters(oPropertyI18n.single, [aFilterObjects[0].text]));
				}
			} else {
				$.each(aFilterObjects, function (iIndex, oFilterObject) {
					if (oFilterObject.text) {
						aFilterText.push(oFilterObject.text);
					}
				});
			}
		});

		return aFilterText.length > 0 ?
			i18n.getTextWithParameters("vchclf_trace_filter_status", aFilterText.join(FILTER_OBJECT_SEPARATOR)) : "";
	};

	/**
	 * Opens the Trace Filter Dialog
	 * @returns {Promise} Promise object which will provide the details
	 * @public
	 */
	DependencyTraceFilterManager.prototype.openTraceFilterDialog = function () {
		return new Promise(function (fnResolve) {
			DependencyTraceFilterDialog.open(this._getFiltersForDialog())
				.then(function (oResult) {
					if (oResult.wasApplied) {
						this._setTraceFilterDialogResult(oResult.filters);
					}

					fnResolve({
						wasApplied: oResult.wasApplied
					});
				}.bind(this));
		}.bind(this));
	};

	/**
	 * Saves the current state of the filter manager
	 * @public
	 */
	DependencyTraceFilterManager.prototype.saveState = function () {
		this._savedState = {
			filters: this._filters,
			rootPath: this._rootPath,
			searchText: this._searchText
		};
	};

	/**
	 * Restores the saved state of the filter manager
	 * @public
	 */
	DependencyTraceFilterManager.prototype.restoreState = function () {
		this._filters = this._savedState.filters;
		this._rootPath = this._savedState.rootPath;
		this._searchText = this._savedState.searchText;
	};

	/**
	 * Returns the required filters for open the Trace Filter dialog
	 * @returns {Object} Filter object which contains the supported filters by the dialog
	 * @private
	 */
	DependencyTraceFilterManager.prototype._getFiltersForDialog = function () {
		var oFilters = {};

		$.each(this._filters, function (sType, aPropertyFilters) {
			if (SUPPORTED_FILTERS_BY_DIALOG[sType]) {
				oFilters[sType] = aPropertyFilters;
			}
		});

		// Filters should be returned as values and not as references
		return $.extend(true, {}, oFilters);
	};

	/**
	 * Sets the filter which came from the Trace Filter dialog
	 * @param {Object} oFilters - Result filters of the Trace Filter dialog
	 * @private
	 */
	DependencyTraceFilterManager.prototype._setTraceFilterDialogResult = function (oFilters) {
		$.each(oFilters, function (sType, aPropertyFilters) {
			if (aPropertyFilters.length > 0) {
				this._filters[sType] = aPropertyFilters;
			} else {
				delete this._filters[sType];
			}
		}.bind(this));
	};

	return new DependencyTraceFilterManager();
});
