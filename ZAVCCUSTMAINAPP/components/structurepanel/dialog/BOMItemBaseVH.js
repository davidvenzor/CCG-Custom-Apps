/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/ui/model/json/JSONModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/comp/filterbar/FilterGroupItem",
	"sap/m/Input",
	"sap/m/ColumnListItem",
	"sap/m/Label",
	"sap/m/SearchField",
	"sap/ui/base/Event"
	], function (ManagedObject, JSONModel, Constants, Filter, FilterOperator, FilterGroupItem, Input, ColumnListItem, Label, SearchField, Event) {
	"use strict";
	/**
	 * BOM item VH Dialog.
	 * @class
	 * @abstract
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.BOMItemBaseVH
	 * @extends sap.ui.core.Control
	 */

	return ManagedObject.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.BOMItemBaseVH", {
		/** @lends sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.BOMItemBaseVH.prototype */
		metadata: {
			properties: {
				controller: {
					type: "sap.ui.core.mvc.Controller"
				},
				control: {
					type: "object"
				},
				source: {
					type: "sap.ui.core.Control",
					defaultValue: {}
				}
			}
		},
		/**
		 * Sets filter to rows and items binding of VH table
		 * @param {sap.ui.model.Filter} oFilter: filter object
		 * @private
		 * @function
		 */
		_filterTable: function (oFilter) {
			var oValueHelpDialog = this.getControl();
			oValueHelpDialog.getTable().setBusy(true);

			oValueHelpDialog.getTableAsync().then(function (oTable) {
				if (oTable.bindRows) {
					oTable.getBinding("rows").filter(oFilter);
				}

				if (oTable.bindItems) {
					oTable.getBinding("items").filter(oFilter);
				}

				oValueHelpDialog.update();
			});
		},
		/**
		 * Sets source control (control that triggered Value Help)
		 * @param {sap.ui.core.Control} oSource: UI control instance
		 * @override
		 */
		setSource: function (oSource) {
			this.setProperty("source", oSource);
			if (oSource && oSource.getValue) {
				this.getControl().setBasicSearchText(oSource.getValue());
			}
		},
		/**
		 * Closes the Value Help dialog
		 * @param {sap.ui.base.Event} oEvent: an Event object consisting of an ID, a source and a map of parameters.
		 * @public
		 * @function
		 */
		close: function (oEvent) {
			this.getControl().close();
		},
		/**
		 * Event handler: called after the Value Help dialog OK button is pressed
		 * @param {sap.ui.base.Event} oEvent An Event object consisting of an ID, a source and a map of parameters.
		 * @public
		 * @function
		 */
		onOk: function (oEvent) {
			throw Error("This abstract method has not yet been implemented in the child object.");
		},
		/**
		 * Event handler: called after the enter was pressed in any input field
		 * @param {sap.ui.base.Event} oEvent: an Event object consisting of an ID, a source and a map of parameters.
		 * @public
		 * @function
		 */
		onSubmit: function (oEvent) {
			var aFilterGroupItems = this.getControl().getFilterBar().getFilterGroupItems();
			var aSelectionSet = [];

			aFilterGroupItems.forEach(function (oFilterGroupItem){
				aSelectionSet.push(oFilterGroupItem.getControl());
			});

			var oNewEvent = new Event("submit", this, {selectionSet: aSelectionSet});

			jQuery.extend(true, oNewEvent, oEvent);
			this.onSearch(oNewEvent);
		},
		/**
		 * Event handler: called after the Value Help dialog Cancel button is pressed.
		 * Close the Value Help dialog.
		 * @param {sap.ui.base.Event} oEvent: an Event object consisting of an ID, a source and a map of parameters.
		 * @public
		 * @function
		 */
		onCancel: function (oEvent) {
			this.close();
		},
		/**
		 * Event handler: called after the Value Help dialog is closed.
		 * Destroy Value Help dialog.
		 * @param {sap.ui.base.Event} oEvent: an Event object consisting of an ID, a source and a map of parameters.
		 * @public
		 * @function
		 */
		onAfterClose: function (oEvent) {
			this.getControl().destroy();
		},
		/**
		 * Factory function which creates and return Filter Group item
		 * @param {string} sId: id for Filter Group item
		 * @param {sap.ui.model.Context} oContext: the binding context of this object
		 * @returns {sap.ui.comp.filterbar.FilterGroupItem} returns Filter Group item
		 * @public
		 * @function
		 */
		createFilterGroupItems: function (sId, oContext){
			var oFilter = oContext.getObject();
			var oInput = new Input({
				id: sId + "-" + oFilter.template + "--filter",
				showValueHelp: false,
				submit: this.onSubmit.bind(this),
				name: oFilter.template
			});
			this._oFilterGroupItem = new FilterGroupItem({
				groupName: "BOMItemFilterGroup",
				name: oFilter.template,
				label: oFilter.label,
				visibleInFilterBar: true
			});
			this._oFilterGroupItem.setControl(oInput);

			return this._oFilterGroupItem;
		},
		/**
		 * Event handler: called after the Go button is pressed.
		 * Create filters with given strings and filter table
		 * @param {sap.ui.base.Event} oEvent: an Event object consisting of an ID, a source and a map of parameters.
		 * @public
		 * @function
		 */
		onSearch: function (oEvent) {
			var	aSelectionSet = oEvent.getParameter("selectionSet");
			var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
				if (oControl.getValue()) {
					aResult.push(new Filter({
						path: oControl.getName(),
						operator: FilterOperator.EQ,
						value1: oControl.getValue()
					}));
				}

				return aResult;
			}, []);

			if (aFilters.length > 0){
				aFilters = [new Filter({
					filters: aFilters,
					and: true
				})];
			}

			var sSearchQuery = this.getControl().getFilterBar().getBasicSearchValue();

			if (sSearchQuery || aFilters.length === 0){
				var aSearchFilters = [];
				var sFilterOperator = FilterOperator.Contains;
				var iAsteriskFirstMatch = sSearchQuery.indexOf("*");
				var iAsteriskLastMatch = sSearchQuery.lastIndexOf("*") + 1;
				var bStartsWithAsterisk = iAsteriskFirstMatch === 0;
				var bEndsWithAsterisk = iAsteriskLastMatch === sSearchQuery.length;

				if (bStartsWithAsterisk || bEndsWithAsterisk){
					if (bStartsWithAsterisk) {
						sFilterOperator = FilterOperator.EndsWith;
					} else if (bEndsWithAsterisk) {
						sFilterOperator = FilterOperator.StartsWith;
					} else if (bStartsWithAsterisk && bEndsWithAsterisk) {
						sFilterOperator = FilterOperator.Contains;
					}
					sSearchQuery = sSearchQuery.split("*").join("");
				}

				aSelectionSet.forEach(function(oControl){
					aSearchFilters.push(
						new Filter({ path: oControl.getName(), operator: sFilterOperator, value1: sSearchQuery })
					);
				});
				aFilters.push(new Filter({
					filters: aSearchFilters
				}));
			}

			this._filterTable(new Filter({
				filters: aFilters,
				and: true
			}));
		},
		/**
		 * Set control instance of given UI control
		 * Create Basic Search for Filter Bar.
		 * Init JSON models for Value Help dialog.
		 * @param {sap.ui.core.Control} oControl: an instance of an UI5 control.
		 * @public
		 * @function
		 */
		setControl: function (oControl) {
			oControl._oBasicSearchField = new SearchField("BOMItemBaseSearch",{
				search: this.onSubmit.bind(this)
			});
			oControl.getFilterBar().setBasicSearch(oControl._oBasicSearchField);
			this._oBOMItemVHDialogConfigModel = new JSONModel();
			this._oColumnModel = new JSONModel();
			oControl.setModel(this._oBOMItemVHDialogConfigModel, Constants.BOMItemVHDialogModelName);
			this.setProperty("control", oControl);
		},
		/**
		 * Bind table of Value Help dialog to a certain entity by path
		 * @param {string} sPath: entity path.
		 * @public
		 * @function
		 */
		bindTable: function (sPath) {
			var oDialog = this.getControl();

			oDialog.getTableAsync().then(function (oTable) {
				oTable.setModel(this._oColumnModel, "columns");
				if (oTable.bindRows) {
					oTable.bindAggregation("rows", {
						path: sPath,
						events: {
							dataReceived: function (){
								oDialog.setBusy(false);
							},
							change: function (){
								oTable.setBusy(false);
							}
						}
					});
				}

				if (oTable.bindItems) {
					oTable.bindAggregation("items", sPath, function () {
						return new ColumnListItem({
							cells: this._oColumnModel.getProperty("/filters").map(function (column) {
								return new Label({ text: "{" + column.template + "}" });
							})
						});
					});
				}

				oDialog.update();
			}.bind(this));
		}
	});
}, /* bExport= */ true);
