/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/ValueHelpConfig",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/dao/DependencyTraceDAO",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/i18n",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (ValueHelpConfig, DependencyTraceDAO, i18n, Filter, FilterOperator) {
	"use strict";

	var SUGGESTION_LIST_LENGTH = 10;

	/**
	 * SuggestionListHandler  class
	 * @class
	 * @param {Object} oEntityConfig - Object representing Value help configuration
	 * @private
	 */
	var GenericSuggestionListHandler = function (oEntityConfig) {
		/**
		 * Configuration object for the value help dialog
		 * @type {sap.i2d.lo.lib.zvchclfz.components.inspector.config.ValueHelpConfig}
		 * @private
		 */
		this._config = oEntityConfig;

		/**
		 * Suggestion object for the suggestion list
		 * Contains the Suggested Rows according to the configuration EntitySet
		 * @type {Object}
		 * @private
		 */
		this._suggestedRows = {};

		/**
		 * Search text for which the suggestion rows are requested at the last time
		 * @type {String}
		 * @private
		 */
		this._lastSearchText = "";

		/**
		 * Promise object of the requestSuggestionRows function
		 * @type {Promise}
		 * @private
		 */
		this._requestSuggestionRowsPromise = null;

		/**
		 * Filters for the value help backend request
		 * @type {sap.ui.model.Filter[]}
		 * @private
		 */
		this._filterForValueHelpRequest = oEntityConfig.IsContainedInConfignModelProperty ? [new Filter({
			path: oEntityConfig.IsContainedInConfignModelProperty,
			operator: FilterOperator.EQ,
			value1: true
		})] : [];
	};

	GenericSuggestionListHandler.prototype.getLastSearchText = function () {
		return this._lastSearchText;
	};

	/**
	 * Requests the suggestion list for the BE
	 * @param {String} sSearchText - Search Text
	 * @returns {Promise} Promise object which will provide the suggested rows
	 * @public
	 */
	GenericSuggestionListHandler.prototype.requestSuggestionRows = function (sSearchText) {
		// New request shall be created only if the last search text does not equal to the current one
		// or there is not any backend request in progress
		if (this._lastSearchText !== sSearchText || !this._requestSuggestionRowsPromise) {
			this._requestSuggestionRowsPromise = new Promise(function (fnResolve, fnReject) {
				this._lastSearchText = sSearchText;

				// Clear All the Suggestion Rows
				this._suggestedRows = {};

				DependencyTraceDAO.loadTraceValueHelpEntries(
						this._config.getBindingPath(),
						sSearchText,
						SUGGESTION_LIST_LENGTH,
						this._filterForValueHelpRequest)
					.then(function (oData) {
						this._suggestedRows[this._config.EntitySet] = oData;
						this._requestSuggestionRowsPromise = null;
						fnResolve(this._suggestedRows[this._config.EntitySet]);
					}.bind(this))
					.catch(function (oError) {
						this._requestSuggestionRowsPromise = null;
						fnReject(oError);
					}.bind(this));
			}.bind(this));
		}

		return this._requestSuggestionRowsPromise;
	};

	/**
	 * Searches using the Name Property Value in the suggested rows and returns the Filter Item
	 * @param {String} sNamePropertyValue - Name Property Value used to search for the object
	 * @returns {Promise} Promise object which will provide the suggested rows
	 * @public
	 */
	GenericSuggestionListHandler.prototype.getFilterItemFromSuggestedRows = function (sNamePropertyValue) {
		return new Promise(function (fnResolve) {
			var oFilterItem = this._getFilterItemFromSuggestedRows(sNamePropertyValue);

			if (oFilterItem) {
				// If the item already exists in the local model => return it
				fnResolve(oFilterItem);
			} else if (this._lastSearchText === sNamePropertyValue && !this._requestSuggestionRowsPromise) {
				// If the suggestion rows are up to date for the selected value => return null
				fnResolve(null);
			} else {
				// Else wait for the response of getting the suggestion rows for the selected value and
				// check its existence again
				this.requestSuggestionRows(sNamePropertyValue)
					.then(function () {
						fnResolve(this._getFilterItemFromSuggestedRows(sNamePropertyValue));
					}.bind(this))
					.catch(function () {
						fnResolve(null);
					});
			}
		}.bind(this));
	};

	/**
	 * Creates a Filter Item from the Selected Row
	 * @param {Object} oBindingObject 		  - Object Bound
	 * @returns {Object} oFilterItem          - Filter Item
	 * @returns {String} oFilterItem.key      - Key value
	 * @returns {String} oFilterItem.text     - Text to be displayed
	 * @public
	 */
	GenericSuggestionListHandler.prototype.createFilterItemFromSelectedItem = function (oBindingObject) {
		return {
			key: oBindingObject[this._config.KeyProperty],
			text: oBindingObject[this._config.NameProperty]
		};
	};

	/**
	 * Returns the Warning message of time not found
	 * @param {String} sNotFoundValue - value not found
	 * @returns {String} Warning Message
	 * @public
	 */
	GenericSuggestionListHandler.prototype.getWarningMessage = function (sNotFoundValue) {
		return i18n.getTextWithParameters(
			this._config.WarningMessage,
			[sNotFoundValue]);
	};

	/**
	 * Searches using the Name Property Value in the suggested rows and returns the Filter Item
	 * @param {String} sNamePropertyValue - Name Property Value used to search for the object
	 * @returns {Object} oFilterItem - Filter Item
	 * @returns {String} oFilterItem.key - Key value
	 * @returns {String} oFilterItem.text - Text to be displayed
	 * @private
	 */
	GenericSuggestionListHandler.prototype._getFilterItemFromSuggestedRows = function (sNamePropertyValue) {
		if (this._suggestedRows[this._config.EntitySet]) {
			var aFoundItems = this._suggestedRows[this._config.EntitySet].filter(function (oItem) {
				return oItem[this._config.NameProperty] === sNamePropertyValue.toUpperCase();
			}.bind(this));

			return aFoundItems.length > 0 ? this.createFilterItemFromSelectedItem(aFoundItems[0]) : null;
		} else {
			return null;
		}
	};

	return {

		/**
		 * Cstic Suggestion List Handler
		 * @type {GenericSuggestionListHandler}
		 * @private
		 */
		_csticSuggestionListHandler: null,
		/**
		 * Dependency Suggestion List Handler
		 * @type {GenericSuggestionListHandler}
		 * @private
		 */
		_depSuggestionListHandler: null,

		/**
		 * Returns Cstic Suggestion List Handler
		 * @returns {GenericSuggestionListHandler} oSuggestionListHandler - Suggestion List Handler
		 * @public
		 */
		getCsticSuggestionListHandler: function () {
			if (!this._csticSuggestionListHandler) {
				this._csticSuggestionListHandler = new GenericSuggestionListHandler(ValueHelpConfig
					.CsticValueHelpConfig);
			}

			return this._csticSuggestionListHandler;
		},

		/**
		 * Returns Dependency Suggestion List Handler
		 * @returns {GenericSuggestionListHandler} oSuggestionListHandler - Suggestion List Handler
		 * @public
		 */
		getDepSuggestionListHandler: function () {
			if (!this._depSuggestionListHandler) {
				this._depSuggestionListHandler = new GenericSuggestionListHandler(ValueHelpConfig
					.DependencyValueHelpConfig);
			}

			return this._depSuggestionListHandler;
		}
	};
});
