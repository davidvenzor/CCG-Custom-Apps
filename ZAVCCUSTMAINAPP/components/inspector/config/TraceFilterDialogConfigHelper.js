/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([], function () {
    "use strict";

    return {
        /**
         * Converts Single Filters to internal format which will be used by the dialog
         * @param {Object[]} aExtFilters - Array of incoming filter objects
         * @param {String} sFilterProperty - Property of TraceEntry entity which should be filtered
         * @returns {String} Internal filter key for the dialog
         * @public
         */
        convertSingleFilterToInternal: function (aExtFilters, sFilterProperty) {
            return aExtFilters.length > 0 ? aExtFilters[0].parameters[sFilterProperty] : null;
        },

        /**
         * Converts Single Filters to external format which will be returned to the DependencyTraceFilterManager
         * @param {String} sIntFilter - Internal filter key from the dialog
         * @param {Object} oItemsForType - Available items for filter type
         * @param {String} sFilterProperty - Property of TraceEntry entity which should be filtered
         * @returns {Object[]} External filter for DependencyTraceFilterManager
         * @public
         */
        convertSingleFilterToExternal: function (sIntFilter, oItemsForType, sFilterProperty) {
            return sIntFilter ? [this._getExtFilter(oItemsForType[sIntFilter].text, sFilterProperty, sIntFilter)] : [];
        },

        /**
         * Converts Multi Filters to internal format which will be used by the dialog
         * @param {Object[]} aExtFilters - Array of incoming filter objects
         * @param {String} sFilterProperty - Property of TraceEntry entity which should be filtered
         * @returns {String[]} Array of internal filter keys for the dialog
         * @public
         */
        convertMultiFilterToInternal: function (aExtFilters, sFilterProperty) {
            var aIntFilters = [];

            $.each(aExtFilters, function (iIndex, oFilter) {
                aIntFilters.push(oFilter.parameters[sFilterProperty]);
            });

            return aIntFilters;
        },

        /**
         * Converts Multi Filters to external format which will be returned to the DependencyTraceFilterManager
         * @param {String[]} aIntFilters - Array of internal filter keys from the dialog
         * @param {Object} oItemsForType - Available items for filter type
         * @param {String} sFilterProperty - Property of TraceEntry entity which should be filtered
         * @returns {Object[]} External filter for DependencyTraceFilterManager
         * @public
         */
        convertMultiFilterToExternal: function (aIntFilters, oItemsForType, sFilterProperty) {
            var aExtFilters = [];

            $.each(aIntFilters, function (iIndex, oFilter) {
                aExtFilters.push(this._getExtFilter(oItemsForType[oFilter].text, sFilterProperty, oFilter));
            }.bind(this));

            return aExtFilters;
        },

        /**
         * Converts Value Help related filters to internal format which will be used by the dialog
         * @param {Object[]} aExtFilters - Array of incoming filter objects
         * @param {String} sFilterProperty - Property of TraceEntry entity which should be filtered
         * @returns {Object[]} Array of internal filters for the dialog
         * @public
         */
        convertVHFilterToInternal: function (aExtFilters, sFilterProperty) {
            var aIntFilters = [];

            $.each(aExtFilters, function (iIndex, oFilter) {
                aIntFilters.push({
                    text: oFilter.text,
                    key: oFilter.parameters[sFilterProperty]
                });
            });

            return aIntFilters;
        },

        /**
         * Converts Value Help related filters to external format which will be returned to the
         * DependencyTraceFilterManager
         * @param {Object[]} aIntFilters - Array of internal filters from the dialog
         * @param {String} sFilterProperty - Property of TraceEntry entity which should be filtered
         * @returns {Object[]} External filter for DependencyTraceFilterManager
         * @public
         */
        convertVHFilterToExternal: function (aIntFilters, sFilterProperty) {
            var aExtFilters = [];

            $.each(aIntFilters, function (iIndex, oFilter) {
                aExtFilters.push(this._getExtFilter(oFilter.text, sFilterProperty, oFilter.key));
            }.bind(this));

            return aExtFilters;
        },

        /**
         * Returns an external filter object for DependencyTraceFilterManager
         * @param {String} sText - Text of the filter object which can be displayed on the UI
         * @param {String} sFilterProperty - Property of TraceEntry entity which should be filtered
         * @param {String} sKey - Value of the property which should be used for filtering
         * @returns {Object} External filter object for DependencyTraceFilterManager
         * @private
         */
        _getExtFilter: function (sText, sFilterProperty, sKey) {
            var oParameters = {};

            oParameters[sFilterProperty] = sKey;

            return {
                text: sText,
                parameters: oParameters
            };
        }
    };
});
