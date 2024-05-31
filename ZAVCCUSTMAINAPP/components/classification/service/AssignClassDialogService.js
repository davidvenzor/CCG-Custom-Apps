/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"sap/ui/table/Table",
	"sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/classification/service/ClassificationService",
	"sap/i2d/lo/lib/zvchclfz/components/classification/utils/Formatter"
], function(Fragment, Filter, FilterOperator, JSONModel, Table, Constants, ClassificationService, Formatter) {
	"use strict";

	/**
	 * A service to handle the assign class value help dialog.
	 * 
	 * @class AssignClassDialogService
	 */
	return {
		ASSIGN_CLASS_DIALOG_FRAGMENT_ID: "sap.i2d.lo.lib.zvchclfz.components.classification.view.fragments.AssignClassDialog",
		DIALOG_VIEW_MODEL_NAME: "assignClassDialogViewModel",
		TABLE_COLUMNS: [{
			label: "CLASS_TYPE",
			template: {
				parts: [
					"ClassType",
					"ClassTypeDescription"
				],
				formatter: Formatter.formatClassType
			}
		}, {
			label: "CLASS_NAME",
			template: "{ClassName}"
		}, {
			label: "CLASS_DESCRIPTION",
			template: "{Description}"
		}, {
			label: "CLASS_STATUS_DESCRIPTION",
			template: "{Status/Description}"
		}],

		formatter: Formatter,

		oBasicSearchField: undefined,
		oAssignClassDialog: undefined,

		/** 
		 * Initializes, sets up then opens the class assignment dialog.
		 * 
		 * @public
		 * @param {object} oView The classification view.
		 * @param {boolean} bClassType Indicates if .
		 * @memberof AssignClassDialogService
		 * @instance
		 */
		open: function(oView, bClassType) {
			this.oAssignClassDialog = sap.ui.xmlfragment(
				this.ASSIGN_CLASS_DIALOG_FRAGMENT_ID,
				this.ASSIGN_CLASS_DIALOG_FRAGMENT_ID,
				this);
			oView.addDependent(this.oAssignClassDialog);

			var oBindingContext = oView.getBindingContext(Constants.LOCAL_CLASSIFICATION_MODEL_NAME);
			var sClassType = oBindingContext && bClassType ? oBindingContext.getProperty("ClassType") : "";
			var oResourceBundle =  oView.getModel("i18n").getResourceBundle();
			var sBindingPath = oView.getModel().createKey("/ClassificationContextSet", {
				ContextId: ClassificationService.getService().getContextId()
			});
			var oViewModel = new JSONModel({
				SelectedClassType: sClassType
			});
			
			this.oAssignClassDialog.setModel(oViewModel, this.DIALOG_VIEW_MODEL_NAME);

			this.oAssignClassDialog.getFilterBar().setFilterBarExpanded(!!sClassType);

			this._constructTable(this.oAssignClassDialog, oResourceBundle, sClassType, sBindingPath);
			this._setBasicSearch();

			this.oAssignClassDialog.open();
		},

		/** 
		 * Event handler for the table's cancel button click.
		 * 
		 * @public
		 * @param {object} oEvent The event fired.
		 * @memberof AssignClassDialogService
		 * @instance
		 */
		onAssignClassDialogCancel: function(oEvent) {
			oEvent.getSource().close();
		},

		/** 
		 * Called every time the dialog is closed. It destroys the dialog. 
		 * 
		 * @public
		 * @param {object} oEvent The event fired when the dialog is closed.
		 * @memberof AssignClassDialogService
		 * @instance
		 */
		onAssignClassDialogAfterClose: function(oEvent) {
			oEvent.getSource().destroy();
		},
		
		/** 
		 * Event handling when an item is selected in the results table. 
		 * 
		 * @public
		 * @param {object} oEvent The event fired.
		 * @memberof AssignClassDialogService
		 * @instance
		 */
		onAssignClassDialogOk: function(oEvent) {
			var aTokens = oEvent.getParameter("tokens");
			var sSelectedInstanceId = aTokens[0].getProperty("key");
			
			// transfer the selected row data into the facade model
			this._transferSelectedContextData(oEvent.getSource());

			ClassificationService.getService().assignClass(sSelectedInstanceId);

			oEvent.getSource().close();
		},

		/** 
		 * Event handling when a new search is initiated on the filterbar. Assembles filter objects based on input.
		 * 
		 * @public
		 * @param {object} oEvent The event fired.
		 * @memberof AssignClassDialogService
		 * @instance
		 */
		onAssignClassDialogSearch: function(oEvent) {
			var aFilters = [];
			var oParams = {};
			var oTable = this.oAssignClassDialog.getTable();
			var aFilterItems = oEvent.getSource().getFilterItems();
			var aSelectionSet = oEvent.getParameter("selectionSet");
			var sSearchText = this.oBasicSearchField.getValue();
			var sLeadingTrailingAsteriskRegEx = /^\*+|\*+$/g;
			var oFilterOperator = FilterOperator.EQ;
			var sFilterValue;

			if (aFilterItems && aSelectionSet) {
				aSelectionSet.forEach(function(oSelection, iIndex) {
					var sValue;

					if (oSelection.getValue) {
						sValue = oSelection.getValue().trim();
					} else if (oSelection.getSelectedKey) {
						sValue = oSelection.getSelectedKey().trim();
					}

					if (sValue) {
						// startsWith and endsWith not supported in all IE versions.
						var bStartsWithAsterisk = sValue[0] === "*";
						var bEndsWithAsterisk = sValue[sValue.length - 1] === "*";

						if (bStartsWithAsterisk && bEndsWithAsterisk) {
							oFilterOperator = FilterOperator.Contains;
						} else if (bStartsWithAsterisk && !bEndsWithAsterisk) {
							oFilterOperator = FilterOperator.EndsWith;
						} else if (!bStartsWithAsterisk && bEndsWithAsterisk) {
							oFilterOperator = FilterOperator.StartsWith;
						}

						sFilterValue = sValue.replace(sLeadingTrailingAsteriskRegEx, "");
						aFilters.push(new Filter(aFilterItems[iIndex].getName(), oFilterOperator, sFilterValue));
					}
				});
			}
			
			if (sSearchText) {
				oParams.custom = {
					search: sSearchText
				};
			}

			// In case the current result set is long and at the time of the search the table is scrolled down to the bottom,
			// the previous $top and $limit querystrings stay in the new request, which produces faulty results. 
			oTable.setFirstVisibleRow(0);

			oTable.bindRows({
				path: oTable.getBinding().getPath(), 
				filters: aFilters, 
				parameters: oParams
			});
		},

		/** 
		 * Builds the table columns based on the config.
		 * 
		 * @param {object} oDialog The dialog where the table needs to be built.
		 * @param {object} oResourceBundle The i18n model.
		 * @param {string} sClassType Class type to filter for by default.
		 * @param {string} sBindingPath The current binding path.
		 * @private
		 * @memberof AssignClassDialogService
		 * @instance
		 */
		_constructTable: function(oDialog, oResourceBundle, sClassType, sBindingPath) {
			var oTable = new Table();

			var oBindingData = {
				path: sBindingPath + "/Assignable"
			};
			oTable.setModel(oDialog.getModel().getOriginModel());
			
			oDialog.setTable(oTable);

			oTable.setNoData(oResourceBundle.getText("ASSIGNMENT_DIALOG_NODATA"));
			oTable.setEnableBusyIndicator(true);
			oTable.setBusyIndicatorDelay(500);
			oTable.setSelectionBehavior("Row");
			
			this.TABLE_COLUMNS.forEach(function(oItem) {
				oTable.addColumn(new sap.ui.table.Column({
					label: new sap.m.Label({
						text: oResourceBundle.getText(oItem.label)
					}),
					template: new sap.m.Text({
						text: oItem.template
					})
				}));
			});

			if (sClassType) {
				oBindingData.filters = new Filter("ClassType", FilterOperator.Contains, sClassType);
			}

			oTable.bindRows(oBindingData);
		},

		/** 
		 * Sets up the basic search control for the class assignent dialog's table.
		 * 
		 * @private
		 * @memberof AssignClassDialogService
		 * @instance
		 */
		_setBasicSearch: function() {
			var oFilterBar = this.oAssignClassDialog.getFilterBar();

			this.oBasicSearchField = new sap.m.SearchField(Fragment.createId(this.ASSIGN_CLASS_DIALOG_FRAGMENT_ID, "basicSearchField"), {
				search: function() {
					oFilterBar.search();
				}
			});

			oFilterBar.setBasicSearch(this.oBasicSearchField);
		},
		
		/**
		 * Transfers the selected row data of the given select dialog to the facade model.
		 * 
		 * @param {sap.m.SelectDialog} oDialog The select dialog.
		 * @private
		 * @memberof AssignClassDialogService
		 * @instance
		 */
		_transferSelectedContextData: function(oDialog) {
			var oTable = oDialog.getTable();
			var iSelIndex = oTable.getSelectedIndex();
			var oContext = oTable.getContextByIndex(iSelIndex);
			var sPath = oContext.getPath();
			var oData = oContext.getModel().getProperty(sPath);
			
			// Transfer the selected row data into the facade model.
			oDialog.getParent().getModel().storePreloadedData(oData, sPath); 
		}
	};
});
