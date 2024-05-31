/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
    "sap/base/util/deepExtend",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
], function (deepExtend, Fragment, JSONModel) {
    "use strict";

    /**
     * Class Table Personalization
     * @constructor
     */
    var TablePersonalization = function () {
        /**
         * Initial State of Personalization
         * It stores the fixedColumnCount and the columnsItems
         * The columnsItems is stored in an object (key is the columnKey) for faster search in it
         * @type {Object}
         * @private
         */
        this._initialState = null;

        /**
         * Model for the Table Personalization
         * @type {sap.ui.model.json.JSONModel}
         * @private
         */
        this._model = null;

        /**
         * Promise resolver function
         * @type {Function}
         * @private
         */
        this._resolvePromise = null;

        /**
         * State of ColumnsItems configuration before open the dialog
         * @type {Object[]}
         * @private
         */
        this._stateBeforeOpen = null;

        /**
         * Dialog of Table Personalization
         * @type {sap.m.P13nDialog}
         * @private
         */
        this._personalizationDialog = null;
    };

    /**
     * Initializes the Table Personalization class
     * @param {Object[]} aAvailableColumns -  Array of object of columnKey and text of the available columns
     * @param {Object} oInitialState - Object of initial state
     * @param {int} [oInitialState.fixedColumnCount] - Initial value of fixedColumnCount property
     * @param {Object[]} oInitialState.columnsItems - Array of the initial state of ColumnsItems configuration
     * @public
     */
    TablePersonalization.prototype.init = function (aAvailableColumns, oInitialState) {
        this._initialState = {
            fixedColumnCount: oInitialState.fixedColumnCount,
            columnsItems: this._mapColumnsItemsArrayToObject(oInitialState.columnsItems)
        };

        var oInitialData = {
            isShowResetEnabled: false,
            items: aAvailableColumns,
            fixedColumnCount: oInitialState.fixedColumnCount,
            columnsItems: oInitialState.columnsItems
        };

        if (!this._model) {
            this._model = new JSONModel(oInitialData);
        } else {
            this._model.setData(oInitialData);
        }


        if (this._personalizationDialog) {
            this._personalizationDialog.destroy();
            this._personalizationDialog = null;
        }
    };

    /**
     * Destroys the Table Personalization control
     * @public
     */
    TablePersonalization.prototype.destroy = function () {
        if (this._personalizationDialog) {
            this._personalizationDialog.destroy();
            this._personalizationDialog = null;
        }
    };

    /**
     * Updates the initial state of ColumnsItems configuration and fixedColumnCount
     * @param {Object} oInitialState - Object of initial state
     * @param {int} [oInitialState.fixedColumnCount] - Initial value of fixedColumnCount property
     * @param {Object[]} oInitialState.columnsItems - Array of the initial state of ColumnsItems configuration
     * @public
     */
    TablePersonalization.prototype.updateInitialState = function (oInitialState) {
        this._initialState = {
            fixedColumnCount: oInitialState.fixedColumnCount,
            columnsItems: this._mapColumnsItemsArrayToObject(oInitialState.columnsItems)
        };

        this._model.setProperty("/columnsItems", deepExtend([], oInitialState.columnsItems));
        this._model.setProperty("/fixedColumnCount", oInitialState.fixedColumnCount);
    };

    /**
     * Opens the Table Personalization dialog
     * @return {Promise} Promise object which provides the data
     * @public
     */
    TablePersonalization.prototype.openSettingsDialog = function () {
        return new Promise(function (fnResolve) {
            this._resolvePromise = fnResolve;

            this._stateBeforeOpen = deepExtend([], this._model.getProperty("/columnsItems"));
            this._updateIsShowResetEnabled();

            this._getPersonalizationDialog()
                .then(function (oDialog) {
                    oDialog.open();
                });
        }.bind(this));
    };

    /**
     * Returns whether the current state of the ColumnsItems is initial
     * @returns {boolean} Flag whether the current state is initial
     * @public
     */
    TablePersonalization.prototype.isColumnsItemsStateInitial = function () {
        if (this._initialState.fixedColumnCount !== this._model.getProperty("/fixedColumnCount")) {
            return false;
        }

        var aColumnsItems = this._model.getProperty("/columnsItems");

        if (aColumnsItems.length !== Object.values(this._initialState.columnsItems).length) {
            return false;
        }

        var bIsColumnsItemsStateInitial = true;

        // eslint-disable-next-line consistent-return
        $.each(aColumnsItems, function (iIndex, oColumnsItem) {
            var oColumnsItemInitial = this._initialState.columnsItems[oColumnsItem.columnKey];

            if (!oColumnsItemInitial ||
                oColumnsItemInitial.visible !== oColumnsItem.visible ||
                oColumnsItemInitial.index !== oColumnsItem.index ||
                oColumnsItemInitial.width !== oColumnsItem.width) {

                bIsColumnsItemsStateInitial = false;

                return false;
            }
        }.bind(this));

        return bIsColumnsItemsStateInitial;
    };

    /**
     * Returns the configuration of the selected columns
     * @return {Object[]} Configurations of the currently selected columns
     * @public
     */
    TablePersonalization.prototype.getSelectedColumns = function () {
        var aSelectedColumns = [];

        $.each(this._model.getProperty("/columnsItems"), function (iIndex, oColumnsItem) {
            if (oColumnsItem.visible) {
                aSelectedColumns.push([oColumnsItem.index, oColumnsItem]);
            }
        });

        return $.map(aSelectedColumns.sort(function (aItem1, aItem2) {
            return aItem1[0] - aItem2[0];
        }), function (aSelectedColumn) {
            return aSelectedColumn[1];
        });
    };

    /**
     * Returns the current state of the ColumnsItems configuration
     * @return {Object} Current state of the fixedColumnCount and the ColumnsItems configuration
     * @public
     */
    TablePersonalization.prototype.getCurrentState = function () {
        return {
            fixedColumnCount: this._model.getProperty("/fixedColumnCount"),
            columnsItems: this._model.getProperty("/columnsItems")
        };
    };

    /**
     * Moves a column from one position to another
     * @param {int} iOldPos - Old position of the column
     * @param {int} iNewPos - New position of the column
     * @public
     */
    TablePersonalization.prototype.moveColumn = function (iOldPos, iNewPos) {
        var bIsMoveForward = iOldPos < iNewPos;
        var aColumnsItems = deepExtend([], this._model.getProperty("/columnsItems"));

        $.each(aColumnsItems, function (iIndex, oColumnsItem) {
            if (oColumnsItem.index === iOldPos) {
                oColumnsItem.index = iNewPos;
            } else if (bIsMoveForward && oColumnsItem.index > iOldPos && oColumnsItem.index <= iNewPos) {
                oColumnsItem.index--;
            } else if (!bIsMoveForward && oColumnsItem.index < iOldPos && oColumnsItem.index >= iNewPos) {
                oColumnsItem.index++;
            }
        });

        this._model.setProperty("/columnsItems", aColumnsItems);
    };

    /**
     * Sets the width of the specified column
     * @param {String} sColumnKey - Key of the column
     * @param {String} sWidth - Width of the column
     * @public
     */
    TablePersonalization.prototype.setColumnWidth = function (sColumnKey, sWidth) {
        var aColumnsItems = deepExtend([], this._model.getProperty("/columnsItems"));

        // eslint-disable-next-line consistent-return
        $.each(aColumnsItems, function (iIndex, oColumnsItem) {
            if (oColumnsItem.columnKey === sColumnKey) {
                oColumnsItem.width = sWidth;

                return false;
            }
        });

        this._model.setProperty("/columnsItems", aColumnsItems);
    };

    /**
     * Sets the FixedColumnCount property
     * @param {int} iFixedColumnCount - Value of FixedColumnCount property
     * @public
     */
    TablePersonalization.prototype.setFixedColumnCount = function (iFixedColumnCount) {
        this._model.setProperty("/fixedColumnCount", iFixedColumnCount);
    };

    /**
     * Handles the OK pressed event
     * @private
     */
    TablePersonalization.prototype._onOKPressed = function () {
        this._resolvePromise({
            wasApplied: true
        });

        this._closeDialog();
    };

    /**
     * Handles the Cancel pressed event
     * @private
     */
    TablePersonalization.prototype._onCancelPressed = function () {
        this._model.setProperty("/columnsItems", deepExtend([], this._stateBeforeOpen));

        this._resolvePromise({
            wasApplied: false
        });

        this._closeDialog();
    };

    /**
     * Handles the Reset pressed event
     * @private
     */
    TablePersonalization.prototype._onResetPressed = function () {
        this._model.setProperty("/columnsItems", deepExtend([], Object.values(this._initialState.columnsItems)));
        this._model.setProperty("/fixedColumnCount", this._initialState.fixedColumnCount);
    };

    /**
     * Handles the Change ColumnsItems event
     * @private
     */
    TablePersonalization.prototype._onColumnsItemsChanged = function () {
        this._updateIsShowResetEnabled();
    };


    /**
     * Maps the array of ColumnsItems configuration to object (key is the columnKey)
     * @param {Object[]} aColumnsItems - Array of ColumnsItems configuration
     * @returns {Object} Object of ColumnsItems configuration
     * @private
     */
    TablePersonalization.prototype._mapColumnsItemsArrayToObject = function (aColumnsItems) {
        var oColumnsItems = {};

        $.each(deepExtend([], aColumnsItems), function (iIndex, oColumnsItem) {
            oColumnsItems[oColumnsItem.columnKey] = oColumnsItem;
        });

        return oColumnsItems;
    };

    /**
     * Updates the IsShowResetEnabled flag
     * @private
     */
    TablePersonalization.prototype._updateIsShowResetEnabled = function () {
        this._model.setProperty("/isShowResetEnabled", !this.isColumnsItemsStateInitial());
    };

    /**
     * Returns the Table Personalization dialog
     * @returns {sap.m.P13nDialog} Table Personalization dialog
     * @private
     */
    TablePersonalization.prototype._getPersonalizationDialog = function () {
        return new Promise(function (fnResolve) {
            if (!this._personalizationDialog) {
                Fragment.load({
                        name: "sap.i2d.lo.lib.zvchclfz.components.structurepanel.fragment.TablePersonalizationDialog",
                        controller: this
                    })
                    .then(function (oPersonalizationDialog) {
                        this._personalizationDialog = oPersonalizationDialog;

                        this._personalizationDialog.setModel(this._model);
                        this._personalizationDialog.setEscapeHandler(function (oPromise) {
                            this._onCancelPressed();
                            oPromise.resolve();
                        }.bind(this));

                        fnResolve(this._personalizationDialog);
                    }.bind(this));
            } else {
                fnResolve(this._personalizationDialog);
            }
        }.bind(this));
    };

    /**
     * Closes the Table Personalization dialog
     * @private
     */
    TablePersonalization.prototype._closeDialog = function () {
        this._stateBeforeOpen = null;
        this._getPersonalizationDialog()
            .then(function (oDialog) {
                oDialog.close();
            });
    };

    return TablePersonalization;
});
