/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/configuration/controller/fragment/Base",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/dao/ConfigurationDAO",
	"sap/i2d/lo/lib/zvchclfz/common/type/DescriptionMode",
	"sap/base/strings/formatMessage"
], function (Base, JSONModel, Filter, FilterOperator, Constants, ConfigurationDAO, DescriptionMode, formatMessage) {
	"use strict";

	var ABSOLUTE_PATH_VARIANT_MATCHING_DIALOG = "sap.i2d.lo.lib.zvchclfz.components.configuration.view.fragment.VariantMatching";
	var FRAGMENT_CONTROLLER = {};
	FRAGMENT_CONTROLLER[ABSOLUTE_PATH_VARIANT_MATCHING_DIALOG] =
		"sap.i2d.lo.lib.zvchclfz.components.configuration.controller.fragment.VariantMatching";

	/**
	 * Variant Matching Dialog fragment controller
	 * 
	 * @class
	 * @abstract
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.vchclf.components.configuration.controller.fragment.VariantMatchingDialog
	 * @extends sap.i2d.lo.lib.vchclf.components.configuration.controller.fragment.Base
	 */
	return Base.extend("sap.i2d.lo.lib.zvchclfz.components.configuration.controller.fragment.VariantMatching", { /** @lends sap.i2d.lo.lib.vchclf.components.configuration.controller.fragment.VariantMatching.prototype */

		openDialog: function () {
			if (!this._oDialog) {
				this._createDialog();
			} else {
				this._updateDialog();
			}
			this._oDialog.open();
		},

		_createDialog: function () {
			this._oDialog = this.getViewController().getFactoryBase().createFragment(this.getView().getId(),
				ABSOLUTE_PATH_VARIANT_MATCHING_DIALOG,
				this);
			this.getView().addDependent(this._oDialog);

			var oVariantDataModel = new JSONModel();
			this.getView().setModel(oVariantDataModel, Constants.VARIANTS_MODEL_NAME);

			var oVariantSettingsModel = new JSONModel({
				"partMatchExist": false
			});
			this.getView().setModel(oVariantSettingsModel, Constants.VARIANTS_SETTINGS_MODEL_NAME);

			this._getVariants();
		},

		_updateDialog: function () {
			this._getVariantDataModel().setData();
			this.sUrlParams = "";
			this.aFilters = [];
			this._getVariants();
		},

		closeDialog: function (oEvent) {
			this.sUrlParams = "";
			this.aFilters = [];
			this._oDialog.close();
		},

		_getVariants: function () {
			this.setBusy(true, "MatchingVariantsTable");

			var oInstance = this._getConfigDataModel().getProperty(this._getConfigurationInstancePath());
			this.getConfigurationDAO().readAllMaterialVariants(oInstance.ContextId, oInstance.InstanceId, this.sUrlParams, this.aFilters).then(
				function (oResponse) {
					this._getVariantDataModel().setData(oResponse.results);

					var bPartialMatchExist = oResponse.results.every(function (variant, index) {
						return variant.IsFullMatch;
					});
					if (!bPartialMatchExist) {
						this._getVariantSettingsModel().setProperty("/partMatchExist", true);
					} else {
						this._getVariantSettingsModel().setProperty("/partMatchExist", false);
					}

					var oTableHeader = this.getView().byId("TableHeader");
					var sTitle = this.getResourceBundle().getText("PRODUCT_VARIANTS") + " (" + oResponse.results.length + ")";
					oTableHeader.setText(sTitle);

					this.setBusy(false, "MatchingVariantsTable");
				}.bind(this));
		},

		_getVariantDataModel: function () {
			return this.getView().getModel(Constants.VARIANTS_MODEL_NAME);
		},

		_getConfigDataModel: function () {
			return this.getView().getModel(Constants.VCHCLF_MODEL_NAME).getOriginModel();
		},

		_getVariantSettingsModel: function () {
			return this.getView().getModel(Constants.VARIANTS_SETTINGS_MODEL_NAME);
		},

		_getConfigurationInstancePath: function () {
			return this.getOwnerComponent().getConfigurationInstancePath();
		},

		init: function () {
			this.variantIdFilter = new Filter("Product", FilterOperator.Contains, "");
			this.variantDescrFilter = new Filter("ProductDescription", FilterOperator.Contains, "");
		},

		exit: function () {
			Base.prototype.exit.apply(this, arguments);
			if (this._oDialog) {
				this._oDialog.destroy();
			}
			if (this._oPopover) {
				this._oPopover.destroy();
			}
			if (this._oVariantSelectionDialog) {
				this._oVariantSelectionDialog.destroy();
			}
		},

		onVariantMatchingDialogClose: function () {
			this.byId("SearchString").setValue("");

			this.getControl().close();

			if (this._oPopover) {
				this._oPopover.destroy();
				delete this._oPopover;
			}
		},

		onSearch: function (oEvent) {
			if (oEvent.getParameter("clearButtonPressed")) {
				this._resetSearch();
			} else {
				var sQuery = oEvent.getSource().getValue();
				if (sQuery) {
					this._executeSearch(sQuery);
				} else {
					this._resetSearch();
				}
			}
		},

		_executeSearch: function (sQuery) {
			var aInnerFilter = [];
			this.variantIdFilter.oValue1 = sQuery;
			aInnerFilter.push(this.variantIdFilter);
			this.variantDescrFilter.oValue1 = sQuery;
			aInnerFilter.push(this.variantDescrFilter);
			var oFilter = new Filter({
				filters: aInnerFilter,
				and: true // The backend uses OR instead of AND. 
					// We use AND here because then the standard filter analysis works and 
					// the VCH implmementation does not need to do their own parsing of the filter string
			});
			this.aFilters = [];
			this.aFilters.push(oFilter);

			this._getVariants();
		},

		_resetSearch: function () {
			this.byId("SearchString").setValue("");
			this.aFilters = [];
			this._getVariants();
		},

		fnGroupVariants: function (oContext) {
			if (oContext.getObject().IsFullMatch) {
				return this.getText("VARIANT_MATCHING_GROUP_FULL_MATCH");
			} else {
				return this.getText("VARIANT_MATCHING_GROUP_PARTIAL_MATCH");
			}
		},

		_getVariantTable: function () {
			return this.byId("MatchingVariantsTable");
		},

		_getValuationTable: function () {
			return this.byId("VariantValuationTable");
		},

		onLoadValDiff: function (oEvent) {
			var oSource = oEvent.getSource();
			var sId = oSource.getId();
			var oLink = sap.ui.getCore().byId(sId);

			var oVariantBindingContext = oLink.getBindingContext(Constants.VARIANTS_MODEL_NAME);
			var sVariantPath = oVariantBindingContext.getPath();
			var oDataModel = this._getConfigDataModel();

			//VariantsDialog is bound to JSON model, but VariantValuationPopover is bound to data model => binding context for VariantValuationPopover
			//must be derived from binding context of VariantsDialog
			var oVariant = this._getVariantDataModel().getProperty(sVariantPath);
			var sVariantKey = "/" + oDataModel.createKey("ConfigurationMaterialVariantSet", oVariant);

			oDataModel.createBindingContext(sVariantKey, null, null, function (oNewBindingContext) {
				var sCurrVariant = oVariant.Product;

				if (!this._oPopover) {
					this._oPopover = sap.ui.xmlfragment(this.getView().getId(),
						"sap.i2d.lo.lib.zvchclfz.components.configuration.view.fragment.VariantValuationDifferencePopover", this);
					this._oPopover.setBindingContext(oNewBindingContext, "vchclf_bind_only");
					this.getView().addDependent(this._oPopover);

					this._initVariantValuationModel();

				} else {
					var sPrevVariant = this._oPopover.getBindingContext("vchclf_bind_only").getObject().Product;
					if (sPrevVariant !== sCurrVariant) {
						this._oPopover.setBindingContext(oNewBindingContext, "vchclf_bind_only");
					}
				}

				if (this._bRefreshVariantValuationDifferencePopover) {
					this._oPopover.getContent()[0].getBinding("items").refresh(true);
					this._bRefreshVariantValuationDifferencePopover = false;
				}

				var sTitle = this.getText("VARIANT_VALUATION_DIFFERENCE") + " '" + sCurrVariant + "'";
				this._oPopover.setTitle(sTitle);

				this._oPopover.openBy(oSource);
			}.bind(this));
		},

		_initVariantValuationModel: function () {
			this._oVariantValuationModel = new JSONModel();
			this._oPopover.setModel(this._oVariantValuationModel, "variantValuationModel");
		},

		onVariantValuationRequested: function () {
			this.setBusy(true, "VariantValuationTable");
		},

		onVariantValuationReceived: function (oEvent) {
			var sPath = oEvent.getSource().getContext().getPath();
			var oMsgModel = sap.ui.getCore().getMessageManager().getMessageModel();
			var aMsg = oMsgModel.getData();
			for (var i = 0; i < aMsg.length; i++) {
				var sTarget = aMsg[i].getTarget();
				if (sTarget.indexOf(sPath) !== -1 && aMsg[i].type === "Error") {
					this._oVariantValuationModel.setProperty("/noDataText", this.getText("ERROR_OCCURRED") + aMsg[i].message);
					break;
				}
			}

			this.setBusy(false, "VariantValuationTable");
		},

		csticDiffCountFactory: function (nValDiff) {
			switch (nValDiff) {
			case 0:
				break;
			case 1:
				return nValDiff + " " + this.getText("VALUATION_CSTIC");
			default:
				return nValDiff + " " + this.getText("VALUATION_CSTICS");
			}
		},

		determineValueDiff: function (oEvent) {
			this.sUrlParams = "$select=ContextId,InstanceId,Product,Plant,Cuobj,ProductDescription,IsFullMatch,CsticDiffCount";
			this._getVariants();
			this._bRefreshVariantValuationDifferencePopover = true;
		},

		onSelectionChange: function (oEvent) {
			var oSource = oEvent.getSource();
			var sPath = oSource.getSelectedContextPaths()[0];
			var oModel = oEvent.getSource().getModel(Constants.VARIANTS_MODEL_NAME);
			var oVariant = oModel.getProperty(sPath);

			this._openVariantSelectionDialog(oVariant);
		},

		_openVariantSelectionDialog: function (oVariant) {
			this._getVariantSelectionDialog(oVariant).open();
		},

		_getVariantSelectionDialog: function (oVariant) {
			if (!this._oVariantSelectionDialog) {
				this._oVariantSelectionDialog = this._createVariantSelectionDialog(oVariant);
			} else {
				this._refreshVariantSelectionDialog(oVariant);
			}
			return this._oVariantSelectionDialog;
		},

		_createVariantSelectionDialog: function (oVariant) {
			var fnCancelSelection = function () {
				var oVariantTable = this._getVariantTable();
				oVariantTable.removeSelections(true);
				this._oVariantSelectionDialog.close();
			}.bind(this);

			var aPlaceholder = [];
			aPlaceholder.push(oVariant.Product);
			var oText1 = new sap.m.Text({
				text: this.getText("SELECTION_CONFIRMATION_TEXT1", aPlaceholder)
			});
			var oText2 = new sap.m.Text({
				text: this.getText("SELECTION_CONFIRMATION_TEXT2", aPlaceholder)
			});
			var oLayout = new sap.ui.layout.VerticalLayout({
				id: "VarConfLayout",
				content: [oText1, oText2]
			});

			var oDialog = new sap.m.Dialog({
				id: "preferredVariantConfirmation",
				title: this.getText("SELECTION_CONFIRMATION_TITLE"),
				content: oLayout,
				type: sap.m.DialogType.Message,
				state: sap.ui.core.ValueState.Warning,
				buttons: [
					new sap.m.Button({
						id: "ConfirmVariant",
						text: this.getText("REPLACE"),
						press: function () {
							this._oVariantSelectionDialog.close();

							this.getConfigurationDAO().setPreferredVariant(oVariant).then(function () {
								this.onVariantMatchingDialogClose();
								this.getView().getController().getOwnerComponent().firePreferredVariantSelected();
							}.bind(this));
						}.bind(this)
					}),
					new sap.m.Button({
						id: "CancelVariantConfirmation",
						text: this.getText("CANCEL"),
						press: fnCancelSelection
					})
				],
				escapeHandler: fnCancelSelection
			});
			return oDialog;
		},

		_refreshVariantSelectionDialog: function (oVariant) {
			var aPlaceholder = [];
			aPlaceholder.push(oVariant.Product);
			var sText = this.getText("SELECTION_CONFIRMATION_TEXT1", aPlaceholder);
			this._oVariantSelectionDialog.getContent()[0].getContent()[0].setProperty("text", sText);
		},

		getVariantText: function (sName, sDescr, sMode, sI18NText) {
			switch (sMode) {
			case DescriptionMode.Description:
				return sDescr || sName;
			case DescriptionMode.TechnicalName:
				return sName;
			case DescriptionMode.Both:
				if ((!!sDescr && !!sName) && (sDescr !== sName)) {
					return formatMessage(sI18NText, [sDescr, sName]);
				} else {
					return sDescr || sName;
				}
				break;
			}
			return sDescr;
		},

		getCharacteristicValueDescriptionWithName: function (ValueName, ValueDescr, Mode, sI18NText) {
			return this.getVariantText(ValueName, ValueDescr, Mode, sI18NText);
		}
	});

}, /* bExport= */ true);
