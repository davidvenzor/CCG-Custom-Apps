/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/dao/BOMNodeSetDAO",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/formatter/RoutingFrameFormatter",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/StructurePanelModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/i18n",
	"sap/ui/base/ManagedObject",
	"sap/ui/model/json/JSONModel"
], function (BOMNodeSetDAO, RoutingFrameFormatter, StructurePanelModel, i18n, ManagedObject, JSONModel) {
	"use strict";

	var SelectRouting = ManagedObject.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.SelectRouting", {

		/**
		 * Instance of the Dialog
		 * @type {sap.ui.xmlfragment}
		 * @private
		 */
		_dialog: null,

		/**
		 * Formatter functions for Select Routing Dialog
		 * @type {Object}
		 * @private
		 */
		_formatter: RoutingFrameFormatter,

		/**
		 * Resolver function for the dialog's Promise object returned by the open function
		 * @type {Function}
		 * @private
		 */
		_resolve: null,

		/**
		 * Rejecter function for the dialog's Promise object returned by the open function
		 * @type {Function}
		 * @private
		 */
		_reject: null,

		/**
		 * UI Model for the dialog
		 * @type {sap.ui.model.json.JSONModel}
		 * @private
		 */
		_uiModel: null,

		/**
		 * Open a new dialog - initialise it if not exist and open
		 * @param {String} sBOMNodePath - path of the selected BOM component
		 * @returns {Object} Promise object
		 * @public
		 */
		open: function (sBOMNodePath) {
			this._bindRoutings(sBOMNodePath);

			return new Promise(function (resolve, reject) {
				this._resolve = resolve;
				this._reject = reject;
			}.bind(this));
		},

		/**
		 * Destroy the dialog after close
		 * @private
		 */
		onAfterDialogClose: function () {
			this._dialog.destroy();
			this._dialog = null;
		},

		/**
		 * Event handler for the cancel button press
		 * @private
		 */
		onCancelButtonPressed: function () {
			this._dialog.close();
			this._resolve();
		},

		/**
		 * Event handler for the routing selection of the list
		 * @param {Object} oEvent - UI5 event object
		 * @private
		 */
		onRoutingSelected: function (oEvent) {
			var oContext = oEvent.getSource().getBindingContext("ui");

			this._dialog.close();
			this._resolve({
				BillOfOperationsType: oContext.getProperty("BillOfOperationsType"),
				BillOfOperationsGroup: oContext.getProperty("BillOfOperationsGroup"),
				BillOfOperationsVariant: oContext.getProperty("BillOfOperationsVariant")
			});
		},

		/**
		 * Bind the possible routings of BOM component to the list
		 * @param {String} sBOMNodePath - path of the selected BOM component
		 * @private
		 */
		_bindRoutings: function (sBOMNodePath) {
			StructurePanelModel.setStructurePanelLoading(true);

			BOMNodeSetDAO.getRoutings(sBOMNodePath)
				.then(function (aResults) {
					if (!this._dialog) {
						this._dialog = sap.ui.xmlfragment(
							"sap.i2d.lo.lib.zvchclfz.components.structurepanel.fragment.SelectRouting", this);
					}

					this._initModel(aResults);

					StructurePanelModel.setRoutings(aResults);
					StructurePanelModel.setStructurePanelLoading(false);

					this._dialog.open();
				}.bind(this))
				.catch(function () {
					StructurePanelModel.setStructurePanelLoading(false);

					this._reject();
				}.bind(this));
		},

		/**
		 * Instantiate the model for the dialog
		 * @param {Object[]} aRoutings - the possible routings for the selected BOM item
		 * @private
		 */
		_initModel: function (aRoutings) {
			this._uiModel = new JSONModel({
				routings: aRoutings
			});

			this._dialog.setModel(i18n.getModel(), "i18n");
			this._dialog.setModel(this._uiModel, "ui");
		}

	});

	return new SelectRouting();
});
