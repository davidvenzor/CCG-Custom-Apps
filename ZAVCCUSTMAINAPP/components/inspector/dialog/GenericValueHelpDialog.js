/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/i18n",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/ODataModelHelper",
	"sap/ui/base/ManagedObject",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/Token",
	"sap/m/SearchField"
], function (i18n, ODataModelHelper, ManagedObject, JSONModel, Filter, FilterOperator, Token, SearchField) {
	"use strict";

	/**
	 * ValueHelp class
	 * @class
	 * @param {Object} oEntityConfig - Object representing Value help configuration
	 */
	var GenericValueHelp = ManagedObject.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.dialog.GenericValueHelpDialog", {

		/**
		 * Configuration object for the value help dialog
		 * See also sap/i2d/lo/lib/zvchclfz/components/inspector/config/ValueHelpConfig
		 * @private
		 */
		_config: null,

		/**
		 * Resolver function for the dialog's Promise object returned by the open function
		 * @type {Function}
		 * @private
		 */
		_resolve: null,

		/**
		 * ValueHelpDialog instance
		 * @type {sap.ui.comp.valuehelpdialog.ValueHelpDialog}
		 * @private
		 */
		_dialog: null,

		constructor: function (oEntityConfig) {

			this._config = oEntityConfig;

			this._resolve = null;

			this._dialog = sap.ui.xmlfragment(
				this._config.XMLFragmentId,
				this._config.XMLFragmentPath,
				this
			);

			var oColumnModel = new JSONModel({
				filters: {
					name: "",
					description: "",
					isContainedInConfignModel: true
				},
				cols: [{
					label: "{i18n>" + this._config.NameColumnLabel + "}",
					template: "odata>" + this._config.NameProperty,
					//need to get the text directly due to bug in the control
					tooltip: i18n.getText(this._config.NameColumnLabel)
				}, {
					label: "{i18n>" + this._config.DescriptionColumnLabel + "}",
					template: "odata>" + this._config.DescriptionProperty,
					//need to get the text directly due to bug in the control
					tooltip: i18n.getText(this._config.DescriptionColumnLabel)
				}]
			});

			this._dialog.setEscapeHandler(this.onCancelPressed.bind(this));
			this._dialog.getFilterBar()
				.setBasicSearch(new SearchField({
					search: this.onSearchPressed.bind(this)
				}));
			this._dialog.setModel(oColumnModel, "columns")
				.setModel(i18n.getModel(), "i18n")
				.setModel(ODataModelHelper.getModelForODataBinding(), "odata");
		}

	});

	/**
	 * Opens the value help dialog
	 * @param {String} [sSearchText] - Search Text
	 * @public
	 * @returns {Promise} - Promise which will be resolved if the popup is closed
	 */
	GenericValueHelp.prototype.open = function (sSearchText) {
		return new Promise(function (fnResolve) {
			this._resolve = fnResolve;

			this._dialog.open();

			if (sSearchText) {
				this._dialog
					.setBasicSearchText(sSearchText);
				this._dialog
					.getFilterBar()
					.search();
			}
		}.bind(this));
	};

	/**
	 * Sets the already selected tokens for the value help dialog
	 * @public
	 * @param {Any[]} aSelectedValues - Array of tokens to be set as selected
	 */
	GenericValueHelp.prototype.setTokens = function (aSelectedValues) {
		var aTokens = [];

		if (aSelectedValues && aSelectedValues.length > 0) {
			aSelectedValues.forEach(function (oValue) {
				aTokens.push(new Token({
					key: oValue.key,
					text: oValue.text
				}));
			});
		}

		this._dialog.setTokens(aTokens);
	};

	/**
	 * Handles the OK button press event
	 * @param {Object} oEvent - UI5 event object
	 * @public
	 */
	GenericValueHelp.prototype.onOkPressed = function (oEvent) {
		var aTokens = oEvent.getParameter("tokens");

		this._resolve({
			wasApplied: true,
			tokens: aTokens.map(function (oToken) {
				return {
					key: oToken.getKey(),
					text: oToken.getText()
				};
			})
		});

		this._dialog.close();
		this._dialog.destroy();
	};

	/**
	 * Handles the Cancel button press event
	 * @public
	 */
	GenericValueHelp.prototype.onCancelPressed = function () {
		this._resolve({
			wasApplied: false
		});

		this._dialog.close();
		this._dialog.destroy();
	};

	/**
	 * Handles the Search button press event
	 * @param {Object} oEvent - UI5 event object
	 * @public
	 */
	GenericValueHelp.prototype.onSearchPressed = function () {
		this._dialog
			.getTableAsync()
			.then(function (oTable) {
				oTable.setBusy(true);
				oTable.bindRows({
					path: "odata>" + this._config.getBindingPath(),
					filters: this._getFilters(),
					parameters: this._getBindingParameters(),
					events: {
						change: function () {
							// update the selection list of the table
							this._dialog.update();

							oTable.setBusy(false);
						}.bind(this)
					}
				});
			}.bind(this));
	};

	/**
	 * Returns the Filters set
	 * @returns {sap.ui.model.Filter[]} - filters
	 * @private
	 */
	GenericValueHelp.prototype._getFilters = function () {
		var aFilters = [];
		var oFilterValues = this._dialog.getModel("columns")
			.getProperty("/filters");

		if (oFilterValues.name) {
			aFilters.push(new Filter({
				path: this._config.NameProperty,
				operator: FilterOperator.Contains,
				value1: oFilterValues.name
			}));
		}

		if (oFilterValues.description) {
			aFilters.push(new Filter({
				path: this._config.DescriptionProperty,
				operator: FilterOperator.Contains,
				value1: oFilterValues.description
			}));
		}

		if (oFilterValues.isContainedInConfignModel &&
			this._config.IsContainedInConfignModelProperty) {
			aFilters.push(new Filter({
				path: this._config.IsContainedInConfignModelProperty,
				operator: FilterOperator.EQ,
				value1: true
			}));
		}

		return aFilters;
	};

	/**
	 * Returns the Binding Parameters
	 * @returns {Object} - Binding Parameters
	 * @private
	 */
	GenericValueHelp.prototype._getBindingParameters = function () {
		var sSearchText = this._dialog.getFilterBar()
			.getBasicSearchValue();
		var oBindingParameters = {};

		// adding the search parameter
		if (sSearchText) {
			oBindingParameters.custom = {
				search: sSearchText
			};
		}

		return oBindingParameters;
	};

	/**
	 * Cleans up the resources
	 * @public
	 * @override
	 */
	GenericValueHelp.prototype.destroy = function () {
		if (this._dialog) {
			this._dialog.close();
			this._dialog.destroy();
			this._dialog = null;
		}

		ManagedObject.prototype.destroy.call(this);
	};

	return GenericValueHelp;
});
