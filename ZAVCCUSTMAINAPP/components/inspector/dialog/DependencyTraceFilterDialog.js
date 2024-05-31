/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
    "sap/i2d/lo/lib/zvchclfz/components/inspector/config/TraceFilterDialogConfig",
    "sap/i2d/lo/lib/zvchclfz/components/inspector/config/TraceFilterTypes",
    "sap/i2d/lo/lib/zvchclfz/components/inspector/dialog/CsticsValueHelpDialog",
    "sap/i2d/lo/lib/zvchclfz/components/inspector/dialog/ObjectDependencyValueHelpDialog",
    "sap/i2d/lo/lib/zvchclfz/components/inspector/logic/SuggestionListHandler",
    "sap/i2d/lo/lib/zvchclfz/components/inspector/util/i18n",
    "sap/i2d/lo/lib/zvchclfz/components/inspector/util/ODataModelHelper",
    "sap/m/Button",
    "sap/m/Dialog",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/ui/base/ManagedObject"
    // eslint-disable-next-line max-params, max-statements
], function (TraceFilterDialogConfig, TraceFilterTypes, CsticsValueHelpDialog, ObjectDependencyValueHelpDialog,
    SuggestionListHandler, i18n, ODataModelHelper, Button, Dialog, Fragment, JSONModel, ManagedObject) {
    "use strict";

    var DIALOG_CONTENT_WIDTH = "510px";
    var TOKEN_REMOVED = "removed";
    var TRACE_FILTER_DIALOG_FILTERS = TraceFilterDialogConfig.SupportedTraceFilterTypes;
    var TRACE_LEVEL = TraceFilterTypes.SupportedTraceFilterTypes.TraceLevel;
    var MESSAGE_TYPE = TraceFilterTypes.SupportedTraceFilterTypes.MessageType;
    var VALUE_ASSIGNMENT_BY = TraceFilterTypes.SupportedTraceFilterTypes.ValueAssignmentBy;
    var CHARACTERISTIC = TraceFilterTypes.SupportedTraceFilterTypes.Characteristic;
    var DEPENDENCY = TraceFilterTypes.SupportedTraceFilterTypes.ObjectDependency;
    var CHARACTERISTIC_ATTRIBUTES = "characteristicAttributes";
    var DEPENDENCY_ATTRIBUTES = "dependencyAttributes";

    /**
     * Constructor of the Dependency Trace Filter Dialog
     * THIS CLASS SHOULD BE ACCESSED ONLY FROM DEPENDENCY TRACE FILTER MANAGER
     * @constructor
     */
    var DependencyTraceFilterDialog = ManagedObject.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.dialog.DependencyTraceFilterDialog", {
        /**
         * Instance of the dialog control
         * @type {sap.m.Dialog}
         * @private
         */
        _dialog: null,

        /**
         * Resolve function of Promise
         * @type {Function}
         * @private
         */
        _resolvePromise: null,

        /**
         * Stores the UI Model of the dialog
         * @type {sap.ui.model.json.JSONModel}
         * @private
         */
        _uiModel: null,

        /**
         * Stores whether a value help dialog is opened for a filter type or not
         * @type {TraceFilterTypes.SupportedTraceFilterTypes}
         * @private
         */
        _valueHelpOpenedFor: null,

        /**
         * Instance of the value help dialog for the dependencies and cstics
         * @type {sap.m.Dialog}
         * @private
         */
        _openValueHelpDialog: null
    });

    /**
     * Opens the Trace Filter dialog with initially set filters
     * The keys of the filters should be the keys of TraceFilterDialogConfig.SupportedTraceFilterTypes
     * @param {Object} oFilters - Object of the initially set filters
     * @returns {Promise} Promise object which will provide the details
     * @public
     */
    DependencyTraceFilterDialog.prototype.open = function (oFilters) {
        return new Promise(function (fnResolve) {

            var fnOpenDialogAndUpdateModel = function () {
                this._resolvePromise = fnResolve;
                this._updateModel(oFilters);
                this._dialog.open();
            }.bind(this);

            if (!this._dialog) {
                this._initTraceFilterDialog()
                    .then(fnOpenDialogAndUpdateModel.bind(this))
                    .catch(fnResolve.bind(this, {
                        wasApplied: false
                    }));
            } else {
                fnOpenDialogAndUpdateModel();
            }
        }.bind(this));
    };

    /**
     * Event handler for change of Trace Level selection
     * @public
     */
    DependencyTraceFilterDialog.prototype.onTraceLevelSelectionChanged = function () {
        this._updateMessageTypeItems();
        this._updateValueAssignmentEnabled();
    };

    /**
     * Event handler for change of Message Type selection
     * @public
     */
    DependencyTraceFilterDialog.prototype.onMessageTypesSelectionChanged = function () {
        this._updateValueAssignmentEnabled();
    };

    /**
     * Event handler for value help request of Characteristics
     * @param {Object} oEvent - UI5 event object
     * @public
     */
    DependencyTraceFilterDialog.prototype.onCsticsValueHelpRequest = function (oEvent) {
        this._handleValueHelpRequest(
            new CsticsValueHelpDialog(),
            CHARACTERISTIC,
            oEvent,
            this._resetCsticValueStates.bind(this),
            SuggestionListHandler.getCsticSuggestionListHandler());
    };

    /**
     * Event handler for value help request of Object Dependency
     * @param {Object} oEvent - UI5 event object
     * @public
     */
    DependencyTraceFilterDialog.prototype.onDependencyValueHelpRequest = function (oEvent) {
        this._handleValueHelpRequest(
            new ObjectDependencyValueHelpDialog(),
            DEPENDENCY,
            oEvent,
            this._resetDependencyValueStates.bind(this),
            SuggestionListHandler.getDepSuggestionListHandler());
    };

    /**
     * Event handler for suggest of Trace Characteristics
     * @param {Object} oEvent - UI5 event object
     * @public
     */
    DependencyTraceFilterDialog.prototype.onCsticsSuggest = function (oEvent) {
        this._onSuggest(
            oEvent,
            SuggestionListHandler.getCsticSuggestionListHandler(),
            CHARACTERISTIC_ATTRIBUTES
        );
    };

    /**
     * Event handler for suggest of Trace Dependencies
     * @param {Object} oEvent - UI5 event object
     * @public
     */
    DependencyTraceFilterDialog.prototype.onDepsSuggest = function (oEvent) {
        this._onSuggest(
            oEvent,
            SuggestionListHandler.getDepSuggestionListHandler(),
            DEPENDENCY_ATTRIBUTES
        );
    };

    /**
     * Event handler for change of Trace Characteristics
     * @param {Object} oEvent - UI5 event object
     * @public
     */
    DependencyTraceFilterDialog.prototype.onCsticsValueChange = function (oEvent) {
        // If the user presses the Show All Items button, this function is triggered because the focus changed.
        // In this case we should not select the item.
        if (this._valueHelpOpenedFor !== CHARACTERISTIC) {
            this._validateCstics(oEvent);
        }
    };

    /**
     * Event handler for change of Trace Dependencies
     * @param {Object} oEvent - UI5 event object
     * @public
     */
    DependencyTraceFilterDialog.prototype.onDepsValueChange = function (oEvent) {
        // If the user presses the Show All Items button, this function is triggered because the focus changed.
        // In this case we should not select the item.
        if (this._valueHelpOpenedFor !== DEPENDENCY) {
            this._validateDependencies(oEvent);
        }
    };

    /**
     * Event handler for Submit of Trace Characteristics
     * @param {Object} oEvent - UI5 event object
     * @public
     */
    DependencyTraceFilterDialog.prototype.onCsticsValueSubmit = function (oEvent) {
        this._validateCstics(oEvent);
    };

    /**
     * Event handler for Submit of Trace Dependencies
     * @param {Object} oEvent - UI5 event object
     * @public
     */
    DependencyTraceFilterDialog.prototype.onDepsValueSubmit = function (oEvent) {
        this._validateDependencies(oEvent);
    };

    /**
     * Event handler for token update of Characteristics
     * @param {Object} oEvent - UI5 event object
     * @public
     */
    DependencyTraceFilterDialog.prototype.onCsticsTokenUpdate = function (oEvent) {
        this._handleTokenUpdate(oEvent, CHARACTERISTIC);
    };

    /**
     * Event handler for token update of Object Dependency
     * @param {Object} oEvent - UI5 event object
     * @private
     */
    DependencyTraceFilterDialog.prototype.onDependencyTokenUpdate = function (oEvent) {
        this._handleTokenUpdate(oEvent, DEPENDENCY);
    };

    /**
     * Instantiates a new dialog with the necessary fields
     * @returns {Promise} Promise object indicating that dialog is created
     * @private
     */
    DependencyTraceFilterDialog.prototype._initTraceFilterDialog = function () {
        return new Promise(function (fnResolve, fnReject) {
            Fragment.load({
                    name: "sap.i2d.lo.lib.zvchclfz.components.inspector.fragment.DependencyTraceFilter",
                    controller: this
                })
                .then(function (oDependencyTraceFilter) {
                    this._dialog = new Dialog({
                        title: i18n.getText("vchclf_trace_filter_dialog_title"),
                        resizable: true,
                        draggable: true,
                        contentWidth: DIALOG_CONTENT_WIDTH,
                        escapeHandler: function (oEscPromise) {
                            this._onCancelPressed();
                            oEscPromise.resolve();
                        }.bind(this),
                        content: oDependencyTraceFilter,
                        buttons: [
                            new Button({
                                text: i18n.getText("vchclf_trace_filter_dialog_footer_btn_go"),
                                type: sap.m.ButtonType.Emphasized,
                                press: this._onGoPressed.bind(this)
                            }),
                            new Button({
                                text: i18n.getText("vchclf_trace_filter_dialog_footer_btn_reset"),
                                press: this._onResetPressed.bind(this)
                            }),
                            new Button({
                                text: i18n.getText("vchclf_trace_filter_dialog_footer_btn_cancel"),
                                press: this._onCancelPressed.bind(this)
                            })
                        ]
                    });

                    this._initModel();
                    this._dialog.setModel(i18n.getModel(), "i18n");
                    this._dialog.setModel(this._uiModel, "ui");
                    this._dialog.setModel(ODataModelHelper.getModel());

                    fnResolve();
                }.bind(this))
                .catch(fnReject);
        }.bind(this));
    };

    /**
     * Event handler for press of Cancel button
     * @private
     */
    DependencyTraceFilterDialog.prototype._onCancelPressed = function () {
        this._resolvePromise({
            wasApplied: false
        });
        this._dialog.close();
    };

    /**
     * Event handler for press of Go button
     * @private
     */
    DependencyTraceFilterDialog.prototype._onGoPressed = function () {
        var oFilters = {};

        $.each(this._uiModel.getProperty("/filters"), function (sType, oFilter) {
            // The oFilter can be a string or an array too depends on single or multi value filter
            oFilters[sType] = TRACE_FILTER_DIALOG_FILTERS[sType].convertFiltersToExternal(oFilter);
        });

        this._resolvePromise({
            wasApplied: true,
            filters: oFilters
        });
        this._dialog.close();
    };

    /**
     * Event handler for press of Reset button
     * @private
     */
    DependencyTraceFilterDialog.prototype._onResetPressed = function () {
        this._updateModel();
    };

    /**
     * Updates the items of the Message Type based on the currently selected Trace Level
     * If a selected message type is removed from the control, it is removed from the filter too
     * @private
     */
    DependencyTraceFilterDialog.prototype._updateMessageTypeItems = function () {
        var sTraceLevelFilter = this._uiModel.getProperty("/filters/" + TRACE_LEVEL);
        var aMessageTypeFilters = this._uiModel.getProperty("/filters/" + MESSAGE_TYPE);
        var aMessageTypeItems = [];

        $.each(this._mapJSONToArray(TraceFilterDialogConfig.MessageTypeItems), function (sKey, oConfig) {
            if (sTraceLevelFilter === TraceFilterDialogConfig.TraceLevelParameters.All ||
                oConfig.traceLevel === TraceFilterDialogConfig.TraceLevelParameters.All ||
                sTraceLevelFilter === oConfig.traceLevel) {

                aMessageTypeItems.push(oConfig);
            } else if (aMessageTypeFilters.indexOf(oConfig.key) !== -1) {
                aMessageTypeFilters.splice(aMessageTypeFilters.indexOf(oConfig.key), 1);
            }
        });

        this._uiModel.setProperty("/messageTypeAttributes/items", aMessageTypeItems);
        this._uiModel.setProperty("/filters/" + MESSAGE_TYPE, aMessageTypeFilters);
    };

    /**
     * Updates the enablement of the Value Assignment By based on the currently selected Message Types
     * If the control is disabled, all the Value Assignment By filters are removed too
     * @private
     */
    DependencyTraceFilterDialog.prototype._updateValueAssignmentEnabled = function () {
        var bEnabled = false;

        // eslint-disable-next-line consistent-return
        $.each(this._uiModel.getProperty("/filters/" + MESSAGE_TYPE), function (iIndex, oMessageTypeId) {
            if (TraceFilterDialogConfig.ValueAssignmentByRelatedMessageTypes.indexOf(oMessageTypeId) !== -1) {
                bEnabled = true;

                return false;
            }
        });

        if (!bEnabled) {
            this._uiModel.setProperty("/filters/" + VALUE_ASSIGNMENT_BY, []);
        }

        this._uiModel.setProperty("/valueAssignmentByAttributes/enabled", bEnabled);
    };

    /**
     * Initiates the model of the dialog
     * This method shall only be used during the initialization of the class
     * Later the _updateModel function can be used instead of this
     * @private
     */
    DependencyTraceFilterDialog.prototype._initModel = function () {
        var oData = {
            filters: this._getDefaultFilters(),
            traceLevelAttributes: {
                items: this._mapJSONToArray(TraceFilterDialogConfig.TraceLevelItems)
            },
            messageTypeAttributes: {
                items: []
            },
            valueAssignmentByAttributes: {
                items: this._mapJSONToArray(TraceFilterDialogConfig.ValueAssignmentByItems),
                enabled: false
            }
        };
        var oEmptyMultiInput = {
            value: "",
            valueState: sap.ui.core.ValueState.None,
            valueStateText: "",
            suggestedRows: []
        };

        oData[CHARACTERISTIC_ATTRIBUTES] = $.extend(true, {}, oEmptyMultiInput);
        oData[DEPENDENCY_ATTRIBUTES] = $.extend(true, {}, oEmptyMultiInput);

        this._uiModel = new JSONModel(oData);
    };

    /**
     * Updates the model with the provided filters
     * The keys of the filters should be the keys of TraceFilterDialogConfig.SupportedTraceFilterTypes
     * If a property does not exist in the filter object, the default value of it will be set
     * @param {Object} oFilters - Object of the provided filters
     * @private
     */
    DependencyTraceFilterDialog.prototype._updateModel = function (oFilters) {
        this._uiModel.setProperty("/filters", this._getDefaultFilters());

        $.each(oFilters, function (sType, aFilters) {
            this._uiModel.setProperty("/filters/" + sType,
                TRACE_FILTER_DIALOG_FILTERS[sType].convertFiltersToInternal(aFilters));
        }.bind(this));

        this._resetMultiInputAttributes();

        this._updateMessageTypeItems();
        this._updateValueAssignmentEnabled();
    };

    /**
     * Returns the default filters for the properties
     * @returns {Object} oFilters - Object of the default filters
     * @private
     */
    DependencyTraceFilterDialog.prototype._getDefaultFilters = function () {
        var oFilters = {};

        oFilters[TRACE_LEVEL] = TraceFilterDialogConfig.TraceLevelParameters.All;
        oFilters[MESSAGE_TYPE] = [];
        oFilters[VALUE_ASSIGNMENT_BY] = [];
        oFilters[CHARACTERISTIC] = [];
        oFilters[DEPENDENCY] = [];

        return oFilters;
    };

    /**
     * Generic handle function for value help requests
     * @param {inspector.dialog.GenericValueHelpDialog} oValueHelp - Instance of Value Help dialog
     * @param {String} sFilterType - Filter type for the value help
     * @param {Object} oEvent - UI5 event object
     * @param {Function} fnResetValueState - reset functionality of MultiInput
     * @param {inspector.logic.SuggestionListHandler} oSuggestionListHandler - Suggestion List Handler
     * @private
     */
    DependencyTraceFilterDialog.prototype._handleValueHelpRequest = function (oValueHelp, sFilterType,
        oEvent, fnResetValueState, oSuggestionListHandler) {
        var sSearchText = "";

        if (oEvent.getParameter("fromSuggestions")) {
            sSearchText = oSuggestionListHandler.getLastSearchText();
        }

        this._valueHelpOpenedFor = sFilterType;
        this._openValueHelpDialog = oValueHelp;

        oValueHelp.setTokens(this._uiModel.getProperty("/filters/" + sFilterType));
        oValueHelp.open(sSearchText)
            .then(function (oResult) {
                if (oResult.wasApplied) {
                    this._uiModel.setProperty("/filters/" + sFilterType, []);
                    this._uiModel.setProperty("/filters/" + sFilterType, oResult.tokens);
                    fnResetValueState();
                }

                this._valueHelpOpenedFor = null;
                this._openValueHelpDialog = null;
            }.bind(this));
    };

    /**
     * Generic handle function for token update
     * @param {Object} oEvent - UI5 event object
     * @param {String} sFilterType - Filter type for the token update
     * @private
     */
    DependencyTraceFilterDialog.prototype._handleTokenUpdate = function (oEvent, sFilterType) {
        if (oEvent.getParameter("type") === TOKEN_REMOVED) {
            var aFilters = this._uiModel.getProperty("/filters/" + sFilterType);

            $.each(oEvent.getParameter("removedTokens"), function (iTokenIndex, oToken) {
                // eslint-disable-next-line consistent-return
                $.each(aFilters, function (iFilterIndex, oFilter) {
                    if (oFilter.key === oToken.getKey()) {
                        aFilters.splice(iFilterIndex, 1);

                        return false;
                    }
                });
            });
        }
    };

    /**
     * Maps a JSON Object to an array
     * @param {Object} oJSON - JSON object which should be mapped
     * @returns {Object[]} Converted array
     * @private
     */
    DependencyTraceFilterDialog.prototype._mapJSONToArray = function (oJSON) {
        // Converts { key1: "val1", key2: "val2" } type of JSON objects to an array: ["val1", "val2"]
        return $.map(oJSON, function (oElement) {
            $.each(oElement, function (sKey, oValue) {
                // If a property is a function, it should be converted to value by execute them
                // This is needed because of the i18n texts
                if ($.isFunction(oValue)) {
                    oElement[sKey] = oValue();
                }
            });

            return oElement;
        });
    };

    /**
     * Maps a JSON Object to an array
     * @param {Object} oFilterItem          - Filter Item
     * @param {String} oFilterItem.property - Key property name
     * @param {String} oFilterItem.key      - Key value
     * @param {String} oFilterItem.text     - Text to be displayed
     * @param {String} sFilterType          - Filter Type
     * @private
     */
    DependencyTraceFilterDialog.prototype._addFilterItemToFilters = function (oFilterItem, sFilterType) {
        var aFilters = this._uiModel.getProperty("/filters/" + sFilterType);

        if (!this._checkFilterAlreadyExist(aFilters, oFilterItem)) {
            aFilters.push(oFilterItem);

            this._uiModel.setProperty("/filters/" + sFilterType, []);
            this._uiModel.setProperty("/filters/" + sFilterType, aFilters);
        }
    };

    /**
     * Maps a JSON Object to an array
     * @param {Object[]} aFilters          - Filter Item
     * @param {Object} oFilterItem          - Filter Item
     * @param {String} oFilterItem.property - Key property name
     * @param {String} oFilterItem.key      - Key value
     * @param {String} oFilterItem.text     - Text to be displayed
     * @returns {Boolean} Indicator whether the item exists
     * @private
     */
    DependencyTraceFilterDialog.prototype._checkFilterAlreadyExist = function (aFilters, oFilterItem) {
        return $.grep(aFilters, function (oElement) {
            return oElement.key === oFilterItem.key;
        }).length > 0;
    };

    /**
     * Reset the Value States for the Cstic input
     * @private
     */
    DependencyTraceFilterDialog.prototype._resetCsticValueStates = function () {
        var sCsticsAttributesPath = "/" + CHARACTERISTIC_ATTRIBUTES;

        this._uiModel.setProperty(sCsticsAttributesPath + "/value");
        this._uiModel.setProperty(sCsticsAttributesPath + "/valueState", sap.ui.core.ValueState.None);
        this._uiModel.setProperty(sCsticsAttributesPath + "/valueStateText");
    };

    /**
     * Reset the Value States for the Dependency input
     * @private
     */
    DependencyTraceFilterDialog.prototype._resetDependencyValueStates = function () {
        var sDepAttributesPath = "/" + DEPENDENCY_ATTRIBUTES;

        this._uiModel.setProperty(sDepAttributesPath + "/value");
        this._uiModel.setProperty(sDepAttributesPath + "/valueState", sap.ui.core.ValueState.None);
        this._uiModel.setProperty(sDepAttributesPath + "/valueStateText");
    };

    /**
     * Reset the attributes for all MultiInput
     * @private
     */
    DependencyTraceFilterDialog.prototype._resetMultiInputAttributes = function () {
        this._resetDependencyValueStates();
        this._resetCsticValueStates();

        this._uiModel.setProperty("/" + DEPENDENCY_ATTRIBUTES + "/suggestedRows", []);
        this._uiModel.setProperty("/" + CHARACTERISTIC_ATTRIBUTES + "/suggestedRows", []);
    };

    /**
     * Validates the value of Trace MultiInput Value Helps
     * @param {Object} oEvent                   - UI5 event object
     * @param {String} sFilterType              - Filter Type
     * @param {inspector.logic.SuggestionListHandler} oSuggestionListHandler - Suggestion List Handler
     * @param {Function} fnResetValueState       - reset functionality of MultiInput
     * @private
     */
    DependencyTraceFilterDialog.prototype._validateMultiInput = function (oEvent, sFilterType,
        oSuggestionListHandler, fnResetValueState) {
        var oMultiInput = oEvent.getSource(),
            sMultiInputValue = oMultiInput.getValue()
            .toUpperCase();

        if (!sMultiInputValue) {
            fnResetValueState();
        } else {
            oMultiInput.setBusy(true);

            oSuggestionListHandler.getFilterItemFromSuggestedRows(sMultiInputValue)
                .then(function (oFilterItem) {
                    oMultiInput.setValue(sMultiInputValue);

                    if (oFilterItem) {
                        fnResetValueState();
                        this._addFilterItemToFilters(oFilterItem, sFilterType);
                    } else {
                        oMultiInput.setValueState(sap.ui.core.ValueState.Warning);
                        oMultiInput.setValueStateText(oSuggestionListHandler
                            .getWarningMessage(sMultiInputValue));
                    }

                    oMultiInput.setBusy(false);
                }.bind(this));
        }
    };

    /**
     * Validates the value of Trace Characteristics
     * @param {Object} oEvent - UI5 event object
     * @private
     */
    DependencyTraceFilterDialog.prototype._validateCstics = function (oEvent) {
        this._validateMultiInput(
            oEvent,
            CHARACTERISTIC,
            SuggestionListHandler.getCsticSuggestionListHandler(),
            this._resetCsticValueStates.bind(this)
        );
    };

    /**
     * Validates the value of Trace Dependencies
     * @param {Object} oEvent - UI5 event object
     * @private
     */
    DependencyTraceFilterDialog.prototype._validateDependencies = function (oEvent) {
        this._validateMultiInput(
            oEvent,
            DEPENDENCY,
            SuggestionListHandler.getDepSuggestionListHandler(),
            this._resetDependencyValueStates.bind(this)
        );
    };

    /**
     * Event handler for suggest of Trace Characteristics and Dependencies
     * @param {Object} oEvent                 - UI5 event object
     * @param {inspector.logic.SuggestionListHandler} oSuggestionListHandler - Suggestion List Handler
     * @param {String} sAttributePath         - Input Attribute Path
     * @private
     */
    DependencyTraceFilterDialog.prototype._onSuggest = function (oEvent, oSuggestionListHandler,
        sAttributePath) {
        var oMultiInput = oEvent.getSource();

        if (oEvent.getParameter("suggestValue")) {
            var sSuggestedRowsPath = "/" + sAttributePath + "/suggestedRows";

            this._uiModel.setProperty(sSuggestedRowsPath, []);

            oSuggestionListHandler
                .requestSuggestionRows(oEvent.getParameter("suggestValue"))
                .then(function (aSuggestedRows) {
                    this._uiModel.setProperty(
                        sSuggestedRowsPath,
                        aSuggestedRows);
                }.bind(this))
                .catch(function (oError) {
                    if (!oError.isAborted) {
                        oMultiInput.setValueState(sap.ui.core.ValueState.Error);
                        oMultiInput.setValueStateText(oError.message);
                    }
                });
        }
    };

    /**
     * Cleans up the resources
     * @public
     * @override
     */
    DependencyTraceFilterDialog.prototype.destroy = function () {
        if (this._dialog) {
            this._dialog.close();
            this._dialog.destroy();
            this._dialog = null;
        }

        if (this._openValueHelpDialog) {
            this._openValueHelpDialog.destroy();
            this._openValueHelpDialog = null;
        }

        this._resolvePromise = null;
        this._valueHelpOpenedFor = null;

        ManagedObject.prototype.destroy.call(this);
    };

    return new DependencyTraceFilterDialog();
});
