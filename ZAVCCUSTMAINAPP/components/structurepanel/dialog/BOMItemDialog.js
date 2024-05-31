/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/BOMItemActions",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/StructurePanelModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/model/StructureTreeModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/common/factory/FactoryBase",
	"sap/ui/core/ValueState",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/i18n",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/base/Event",
	"sap/ui/model/Sorter"
], function (ManagedObject, BOMItemActions, StructurePanelModel, StructureTreeModel, Constants, FactoryBase, ValueState, i18n, Filter, FilterOperator, Event, Sorter) {
	"use strict";
	/**
	 * BOM Item Dialog. Enables BOM item maintenance.
	 * @class
	 * @abstract
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.vchclf.components.structurepanel.dialog.BOMItemDialog
	 * @extends sap.ui.core.Control
	 */

	var BOM_ITEM_DIALOG_CONFIG_PATH = "sap/i2d/lo/lib/zvchclfz/components/structurepanel/config/BOMItemDialogConfig.json";
	var BOM_ITEM_BASE_VH_DIALOG = "sap.i2d.lo.lib.zvchclfz.components.structurepanel.fragment.BOMItemBaseVHDialog";
	var BOM_ITEM_PRODUCT_VH_CONTROLLER = "sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.BOMItemProductVH";
	var BOM_ITEM_UOM_VH_CONTROLLER = "sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.BOMItemUoMVH";
	var BOM_ITEM_DOCUMENT_VH_CONTROLLER = "sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.BOMItemDocumentBaseVH";
	var BOM_ITEM_FORMULA_VH_CONTROLLER = "sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.BOMItemFormulaVH";
	var BOM_ITEM_VAR_UOM_VH_CONTROLLER = "sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.BOMItemVariableUoMVH";
	
	return ManagedObject.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.BOMItemDialog", {
		/** @lends sap.i2d.lo.lib.vchclf.components.structurepanel.dialog.BOMItemDialog.prototype */
		metadata: {
			properties: {
				controller: {
					type: "sap.ui.core.mvc.Controller"
				},
				control: {
					type: "object"
				}
			}
		},
		/**
		 * Gets BOM item ui control by id.
		 * @param {string} sId: BOM item ui control id
		 * @returns {sap.ui.core.Control} returns BOM item ui control
		 * @private
		 * @function
		 */
		_getBOMItemUiControl: function (sId) {
			return this.getController().byId(sId);
		},
		/**
		 * Gets selected fixed item category
		 * @returns {string} returns selected fixed item category
		 * @private
		 * @function
		 */
		_getSelectedFixedItemCategory: function () {
			return this._getBOMItemUiControl("BOMItemCategory")
			.getSelectedItem()
			.getBindingContext(Constants.BOMItemDialogModel)
			.getObject().FixedItemCategory;
		},
		/**
		 * Gets selected BOM item category
		 * @returns {string} returns selected BOM item category
		 * @private
		 * @function
		 */
		_getSelectedBOMItemCategory: function () {
			return this._getBOMItemUiControl("BOMItemCategory")
			.getSelectedItem()
			.getBindingContext(Constants.BOMItemDialogModel)
			.getObject().BillOfMaterialItemCategory;
		},
		/**
		 * Filter entity
		 * @param {string} sFieldName: to filterEntityConfig object in the BOMItemDialogConfig which contains entity information
		 * @param {array} aValues: filter value(s) in the same sequence as defined filter in the BOMItemDialogConfig
		 * @param {string} sFilterFor: shall filter be created for suggestion list or field validation 
		 * @param {map} mURLParams - A map containing the parameters that will be passed as query strings
		 * @return {Object} Promise
		 * @private
		 */
		_filterEntity: function (sFieldName, aValues, sFilterFor, mURLParams) {
			var sEntityName = this._aBOMItemDialogConfig.filterEntityConfig[sFieldName].entity;
			return this.getController().getView().getModel().facadeRead(
					sEntityName, mURLParams, null, [this._createFilter(sFieldName, aValues, sFilterFor)]);
		},
		/**
		 * Validates a certain field
		 * @param {sap.ui.base.Event} oEvent: An Event object consisting of an ID, a source and a map of parameters.
		 * @private
		 */
		_validateField: function (oEvent) {
			var oField = oEvent.getSource();
			var sNewValue = oField.getValue();
			var oParams = oEvent.getParameters();

			this._bChangeTriggered = true;

			if (!sNewValue || sNewValue === " "){
				oField.setValueState(ValueState.None);
			} else {
				oField.setBusyIndicatorDelay(0);
				oField.setBusy(true);
				if (!oParams.fieldName){
					oField.setValueState(ValueState.None);
					oField.setBusy(false);
					return;
				}
				this._filterEntity(oParams.fieldName, [sNewValue], this._aBOMItemDialogConfig.filterPurpose.VALIDATION)
				.then(function (oData) {
					oField.setBusy(false);
					if (oData.results.length > 0) {
						var sPath = this._aBOMItemDialogConfig.filterEntityConfig[oParams.fieldName].filters[0].path;
						if (oData.results[0][sPath] === sNewValue){
							oField.setValueState(ValueState.None);
						} else {
							oField.setValueState(ValueState.Error);
						}
					} else {
						oField.setValueState(ValueState.Error);
					}
				}.bind(this))
				.catch(function (oError) {
					oField.setBusy(false);
					oField.setValueState(ValueState.Error);
					oField.focus();
				});
			}
		},
		/**
		 * Check that all mandatory fields are valid.
		 * @param {string} sFixedItemCategory: BOM item fixed category
		 * @returns {boolean} bValid
		 * @private
		 * @function
		 */
		_isFormValid: function (sFixedItemCategory) {
			var bValid = true;
			var aMandatoryFields = [];

			this._aBOMItemDialogConfig.fieldsConfig.forEach(function(oConfig){
				if (oConfig.fixedItemCagetory === sFixedItemCategory){
					aMandatoryFields = oConfig.mandatoryFields;
				}
			});

			for (var i = 0; i < aMandatoryFields.length; i++) {
				var oControl = this._getBOMItemUiControl(aMandatoryFields[i]);

				if (oControl.getValueState() === ValueState.Error ){
					bValid = false;
					oControl.focus();
					break;
				}
				if (!oControl.getValue()){
					bValid = false;
					oControl.focus();
					oControl.setValueState(ValueState.Error);
					break;
				}
			}

			return bValid;
		},
		/**
		 * Set value states for mandatory fields of all categories to none
		 * @private
		 * @function
		 */
		_resetValidationForAllFields: function (){
			this._oBOMItemDialogConfigPromise.then(function(){
				this._aBOMItemDialogConfig.fieldsConfig.forEach(function(oConfig){
					if (oConfig.mandatoryFields){
						oConfig.mandatoryFields.forEach(function(sFieldId){
							this._getBOMItemUiControl(sFieldId).setValueState(ValueState.None);
						}.bind(this));
					}
				}.bind(this));
			}.bind(this));
		},
		/**
		 * @param {object} oFilterTemplate: property in the filterEntityConfig from the BOMItemDialogConfig
		 * @param {string} sFilterFor: shall filter be created for suggestion list or field validation 
		 * @return {string} filter operator (possible values are equal to sap/ui/model/FilterOperator)
		 * @private
		 * @function
		 */
		_getFilterOperator: function (oFilterTemplate, sFilterFor) {
			switch (sFilterFor) {
				case this._aBOMItemDialogConfig.filterPurpose.SUGGESTION:
					return oFilterTemplate.operator;
				case this._aBOMItemDialogConfig.filterPurpose.VALIDATION:
					return oFilterTemplate.operatorForFieldValidation;
				default: 
					throw Error("Value for parameter sFilterFor is invalid! Please provide a valid value from filterPurpose in BOMItemDialogConfig.");
			}
		},
		/**
		 * Create Filter object by field name
		 * @param {string} sFieldName: property in the filterEntityConfig from the BOMItemDialogConfig
		 * @param {array} aValues: filter value(s) in the same sequence as defined filter in the BOMItemDialogConfig
		 * @param {string} sFilterFor: shall filter be created for suggestion list or field validation 
		 * @return {sap.ui.model.Filter}
		 * @private
		 * @function
		 */
		_createFilter: function (sFieldName, aValues, sFilterFor){
			var oFilter = {};
			var aFilterTemplate = this._aBOMItemDialogConfig.filterEntityConfig[sFieldName].filters;

			if (aFilterTemplate.length > 1){
				var aFilters = [];
				aFilterTemplate.forEach(function(oFilterTemplate, iIndex){
					aFilters.push(new Filter({
						path: oFilterTemplate.path,
						operator: this._getFilterOperator(oFilterTemplate, sFilterFor),
						value1: aValues[iIndex]
					}));
				}.bind(this));
				oFilter = new Filter({
					filters: aFilters, 
					and: true
				});
			} else {
				oFilter = new Filter({
					path: aFilterTemplate[0].path,
					operator: this._getFilterOperator(aFilterTemplate[0], sFilterFor),
					value1: aValues[0].toUpperCase()
					});
			}
			return oFilter;
		},
		/**
		 * Filter for a value in entity 
		 * @param {string} sFieldName: to filterEntityConfig object in the BOMItemDialogConfig which contains entity information
		 * @param {array} aValues: filter value(s) in the same sequence as defined filter in the BOMItemDialogConfig
		 * @private
		 * @function
		 */
		_suggest: function (sFieldName, aValues) {
			var oBOMItemDialog = this.getControl();
			var sEntityName = this._aBOMItemDialogConfig.filterEntityConfig[sFieldName].entity;
			this._filterEntity(sFieldName, aValues, this._aBOMItemDialogConfig.filterPurpose.SUGGESTION, {"$skip": 0, "$top": 30}).then(function (oData){
						if (this._bChangeTriggered){
							this._bChangeTriggered = false;
							return;
						}
						oBOMItemDialog.getModel(Constants.BOMItemDialogVHModel).setProperty(
								sEntityName, 
								oData.results
							);
					}.bind(this));
		},
		/**
		 * Reset model with new data by given name
		 * @param {string} sModelName: model name
		 * @param {object} oData: new data
		 * @private
		 * @function
		 */
		_resetModel: function (sModelName, oData) {
			if (!sModelName){
				throw Error("Please provide a valid model name");
			}

			this.getControl().getModel(sModelName).setData(oData || {});
		},
		/**
		 * Opens Value Help with given name for BOM item.
		 * @param {string} sControllerName: controller name
		 * @param {sap.ui.base.Event} oEvent: An Event object consisting of an ID, a source and a map of parameters.
		 * @private
		 * @function
		 */
		_openBOMItemVHDialog: function (sControllerName, oEvent){
			if (this._oBOMItemVHDialog) {
				this._oBOMItemVHDialog.destroy();
				this._oBOMItemVHDialog.getController().destroy();
				delete this._oBOMItemVHDialog;
			}
			var oView = this.getController().getView();
			var oBOMItemDialog = this.getControl();
			var bForceCreateController = true;

			this._oBOMItemVHDialog = this._oFactoryBase.createFragment(
				oView.getId(), BOM_ITEM_BASE_VH_DIALOG, sControllerName, bForceCreateController);
			oView.addDependent(this._oBOMItemVHDialog);
			this.getControl().addDependent(this._oBOMItemVHDialog);
			this._oBOMItemVHDialog.setModel(oBOMItemDialog.getModel(Constants.ODataModelName));
			this._oBOMItemVHDialog.getController().setSource(oEvent.getSource());
			this._oBOMItemVHDialog.setModel(oBOMItemDialog.getModel(Constants.BOMItemDialogModel), Constants.BOMItemDialogModel);
			this._oBOMItemVHDialog.open();
		},
		/**
		 * Initialize the Factory Base
		 * @private
		 * @function
		 */
		init: function () {
			this._oFactoryBase = new FactoryBase({
				controller: this
			});
			this._oBOMItemDialogConfigPromise = new Promise(function(fnResolve, fnReject){
				if (!this._aBOMItemDialogConfig) {
					var sRelUrl = sap.ui.require.toUrl(BOM_ITEM_DIALOG_CONFIG_PATH);

				    $.ajax({
				       url: sRelUrl
				    }).done(function (oConfig) {
				      this._aBOMItemDialogConfig = oConfig;
				      fnResolve();
				    }.bind(this));
				} else {
				     fnResolve();
				}
			}.bind(this));
		},
		/**
		 * Triggers insert/change BOM item backend request and closes the dialog.
		 * @public
		 * @function
		 */
		onOk: function () {
			var oControl = this.getControl();
			var oData = oControl.getModel("SelectedBOMItem").getData();
			var oDialogModel = oControl.getModel("BOMItemDialog");

			oData.ItemCategory = oDialogModel.getData().SelectedItemKey;

			this._oBOMItemDialogConfigPromise.then(function(){
				if (!this._isFormValid(oData.ItemCategory || oData.FixedItemCategory)){
					return;
				}

				if (oDialogModel.getProperty("/IsBOMItemInsert")) {
					this.getController().insertBOMItem(oData);
					oControl.close();
				} else {
					this.getController().updateBOMItem(oData);
					oControl.close();
				}
			}.bind(this));

		},
		/**
		 * Closes the insert/change BOM item dialog.
		 * @public
		 * @function
		 */
		onCancel: function () {
			if (this.getControl()) {
				this.getControl().close();
			}
		},
		/**
		 * Formatter: gets specific dialog title in cases of insert and change BOM item.
		 * @param {string} sBOMItemActionName: triggered BOM item action in the Structure Panel
		 * @param {string} sInsertBOMItemText: i18n text
		 * @param {string} sChangeBOMItemText: i18n text
		 * @returns {string} dialog title
		 * @public
		 * @function
		 */
		getDialogTitle: function (sBOMItemActionName, sInsertBOMItemText, sChangeBOMItemText) {
			if (BOMItemActions.Insert === sBOMItemActionName) {
				return sInsertBOMItemText;
			} else if (BOMItemActions.Change === sBOMItemActionName) {
				return sChangeBOMItemText;
			} else {
				return "";
			}
		},
		/**
		 * Formatter: gets BOM item category description of current selection.
		 * @returns {string} description of currently selected BOM item
		 * @public
		 * @function
		 */
		getBOMItemCategoryOfCurrentSelection: function () {
			return StructurePanelModel.getCurrentlyFocusedBOMItem().ItemCategoryDescription;
		},
		/**
		 * Updates selected BOM item category in the dialog model.
		 * @param {sap.ui.base.Event} oEvent: dialog event fired on button press
		 * @public
		 * @function
		 */
		onItemCategoryChange: function (oEvent) {
			var oDialog = this.getControl();
			var oBOMItemDialogModel = oDialog.getModel(Constants.BOMItemDialogModel);
			var sSelectedFixedItemCategory =
				oEvent.getParameter("selectedItem")
				.getBindingContext(Constants.BOMItemDialogModel)
				.getProperty("FixedItemCategory");
			var oBOMItemCategory = oBOMItemDialogModel.getProperty("/SelectedBOMItemCategory");
			var oData = {
					ContextId: StructurePanelModel.getConfigurationContextId(),
					InstanceId: StructurePanelModel.getCurrentlyFocusedBOMItem().InstanceId.trim()
				};

			for (var sBOMItemCategory in oBOMItemCategory) {
				if (sBOMItemCategory === sSelectedFixedItemCategory) {
					oBOMItemCategory[sBOMItemCategory] = true;
					if (sSelectedFixedItemCategory === Constants.FixedBOMItemCategory.TEXT_ITEM ||
							sSelectedFixedItemCategory === Constants.FixedBOMItemCategory.DOCUMENT_ITEM){
						oData.Quantity = "1";
						oData.Unit = "PC";
					}
					if (sSelectedFixedItemCategory === Constants.FixedBOMItemCategory.VARIABLE_SIZE_ITEM) {
						oData.Unit = StructureTreeModel.getRootComponent().Unit;
					}
				} else {
					oBOMItemCategory[sBOMItemCategory] = false;
				}
			}

			this._resetModel(Constants.SelectedBOMItem, oData);
			this._resetValidationForAllFields();
		},
		/**
		 * Opens Value Help for BOM Document.
		 * @param {sap.ui.base.Event} oEvent: An Event object consisting of an ID, a source and a map of parameters.
		 * @public
		 * @function
		 */
		onDocumentValueHelpPressed: function (oEvent) {
			this._openBOMItemVHDialog(BOM_ITEM_DOCUMENT_VH_CONTROLLER, oEvent);
		},
		/**
		 * Opens Value Help for BOM Material.
		 * @param {sap.ui.base.Event} oEvent: An Event object consisting of an ID, a source and a map of parameters.
		 * @public
		 * @function
		 */
		onBOMMaterialVHPressed: function (oEvent) {
			this._openBOMItemVHDialog(BOM_ITEM_PRODUCT_VH_CONTROLLER, oEvent);
		},
		/**
		 * Opens Value Help for BOM Formula.
		 * @param {sap.ui.base.Event} oEvent: An Event object consisting of an ID, a source and a map of parameters.
		 * @public
		 * @function
		 */
		onBOMFormulaVHPressed: function (oEvent) {
			this._openBOMItemVHDialog(BOM_ITEM_FORMULA_VH_CONTROLLER, oEvent);
		},
		/**
		 * Opens Value Help for BOM Unit of Measure.
		 * @param {sap.ui.base.Event} oEvent: An Event object consisting of an ID, a source and a map of parameters.
		 * @public
		 * @function
		 */
		onUoMValueHelpPressed: function (oEvent) {
			this._openBOMItemVHDialog(BOM_ITEM_UOM_VH_CONTROLLER, oEvent);
		},
		/**
		 * Opens Value Help for BOM Variable Unit of Measure.
		 * @param {sap.ui.base.Event} oEvent: An Event object consisting of an ID, a source and a map of parameters.
		 * @public
		 * @function
		 */
		onVarUoMValueHelpPressed: function (oEvent) {
			this._openBOMItemVHDialog(BOM_ITEM_VAR_UOM_VH_CONTROLLER, oEvent);
		},

		/**
		 * Event handler: called when user types in the input and showSuggestion is set to true.
		 * @param {sap.ui.base.Event} oEvent: An Event object consisting of an ID, a source and a map of parameters.
		 * @public
		 * @function
		 */
		onProductSuggest: function (oEvent){
			this._suggest("productWithPlant", [
				oEvent.getParameter("suggestValue").toUpperCase(), 
				StructurePanelModel.getCurrentlyFocusedBOMItem().Plant
			]);
		},
		/**
		 * Event handler: called when user types in the input and showSuggestion is set to true.
		 * @param {sap.ui.base.Event} oEvent: An Event object consisting of an ID, a source and a map of parameters.
		 * @public
		 * @function
		 */
		onDocumentSuggest: function (oEvent){
			this._suggest("documentNumber", [oEvent.getParameter("suggestValue")]);
		},
		/**
		 * Event handler: called when user types in the input and showSuggestion is set to true.
		 * @param {sap.ui.base.Event} oEvent: An Event object consisting of an ID, a source and a map of parameters.
		 * @public
		 * @function
		 */
		onFormulaSuggest: function (oEvent){
			this._suggest("formula", [oEvent.getParameter("suggestValue")]);
		},
		/**
		 * Event handler: called when user types in the input and showSuggestion is set to true.
		 * @param {sap.ui.base.Event} oEvent: An Event object consisting of an ID, a source and a map of parameters.
		 * @public
		 * @function
		 */
		onUoMSuggest: function (oEvent){
			this._suggest("uom", [oEvent.getParameter("suggestValue")]);
		},
		/**
		 * Event handler: called when the text in an field of VH dialog has changed
		 * 					and the focus leaves the input field or the enter key is pressed.
		 * @param {Object} oEvent - UI5 eventing object
		 * @public
		 * @function
		 */
		onChange: function (oEvent) {
			var oNewEvent = new Event("valueChange", this, {});
			jQuery.extend(true, oNewEvent, oEvent);
			this._oBOMItemDialogConfigPromise.then(function(){
				this._validateField(oNewEvent);
			}.bind(this));
		},
		/**
		 * Event handler: called when the text in the product field has changed
		 * 					and the focus leaves the input field or the enter key is pressed.
		 * @param {Object} oEvent - UI5 eventing object
		 * @public
		 * @function
		 */
		onProductChange: function (oEvent) {
			var oNewEvent = new Event("productChange", this, {
				fieldName: "product"
			});
			jQuery.extend(true, oNewEvent, oEvent);
			var sNewValue = oNewEvent.getParameter("newValue").toUpperCase();
			oNewEvent.getSource().setValue(sNewValue);
			this._oBOMItemDialogConfigPromise.then(function(){
				this._validateField(oNewEvent);
			}.bind(this));
		},
		/**
		 * Event handler: called when the text in the UoM field has changed
		 * 					and the focus leaves the input field or the enter key is pressed.
		 * @param {sap.ui.base.Event} oEvent: An Event object consisting of an ID, a source and a map of parameters.
		 * @public
		 * @function
		 */
		onUoMChange: function (oEvent){
			var oNewEvent = new Event("uomChange", this, {
				fieldName: "uom"
			});
			jQuery.extend(true, oNewEvent, oEvent);
			this._oBOMItemDialogConfigPromise.then(function(){
				this._validateField(oNewEvent);
			}.bind(this));
		},
		/**
		 * Event handler: called when the text in the Document field has changed
		 * 					and the focus leaves the input field or the enter key is pressed.
		 * @param {sap.ui.base.Event} oEvent: An Event object consisting of an ID, a source and a map of parameters.
		 * @public
		 * @function
		 */
		onDocumentChange: function (oEvent){
			var oNewEvent = new Event("documentChange", this, {
				fieldName: "documentNumber"
			});
			jQuery.extend(true, oNewEvent, oEvent);
			this._oBOMItemDialogConfigPromise.then(function(){
				this._validateField(oNewEvent);
			}.bind(this));
		},
		/**
		 * Event handler: called when the text in the Document type field has changed
		 * 					and the focus leaves the input field or the enter key is pressed.
		 * @param {sap.ui.base.Event} oEvent: An Event object consisting of an ID, a source and a map of parameters.
		 * @public
		 * @function
		 */
		onDocumentTypeChange: function (oEvent){
			var oNewEvent = new Event("documentChange", this, {
				fieldName: "documentType"
			});
			jQuery.extend(true, oNewEvent, oEvent);
			this._oBOMItemDialogConfigPromise.then(function(){
				this._validateField(oNewEvent);
			}.bind(this));
		},
		/**
		 * Event handler: called when the text in the Document version field has changed
		 * 					and the focus leaves the input field or the enter key is pressed.
		 * @param {sap.ui.base.Event} oEvent: An Event object consisting of an ID, a source and a map of parameters.
		 * @public
		 * @function
		 */
		onDocumentVersionChange: function (oEvent){
			var oNewEvent = new Event("documentChange", this, {
				fieldName: "documentVersion"
			});
			jQuery.extend(true, oNewEvent, oEvent);
			this._oBOMItemDialogConfigPromise.then(function(){
				this._validateField(oNewEvent);
			}.bind(this));
		},
		/**
		 * Event handler: called when the text in the Document part field has changed
		 * 					and the focus leaves the input field or the enter key is pressed.
		 * @param {sap.ui.base.Event} oEvent: An Event object consisting of an ID, a source and a map of parameters.
		 * @public
		 * @function
		 */
		onDocumentPartChange: function (oEvent){
			var oNewEvent = new Event("documentChange", this, {
				fieldName: "documentPart"
			});
			jQuery.extend(true, oNewEvent, oEvent);
			this._oBOMItemDialogConfigPromise.then(function(){
				this._validateField(oNewEvent);
			}.bind(this));
		},
		/**
		 * Event handler: called when the text in the formula key field has changed
		 * 					and the focus leaves the input field or the enter key is pressed.
		 * @param {sap.ui.base.Event} oEvent: An Event object consisting of an ID, a source and a map of parameters.
		 * @public
		 * @function
		 */
		onFormulaChange: function (oEvent) {
			var oNewEvent = new Event("formulaKeyChange", this, {
				fieldName: "formula"
			});
			jQuery.extend(true, oNewEvent, oEvent);
			var sNewValue = oNewEvent.getParameter("newValue").toUpperCase();
			oNewEvent.getSource().setValue(sNewValue);
			this._oBOMItemDialogConfigPromise.then(function(){
				this._validateField(oNewEvent);
			}.bind(this));
		}
	});
}, /* bExport= */ true);
