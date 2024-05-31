/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([
	"sap/ui/core/XMLComposite",
	"sap/ui/model/json/JSONModel",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/type/EmbeddingMode"
], function (XMLComposite, JSONModel, EmbeddingMode) {
	"use strict";

	/**
	 * Configuration Settings Dialog. Loads and displays the personalization data from the FLP personalization service.
	 * 
	 * @class
	 * @abstract
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.vchclf.components.configuration.control.SettingsDialog
	 * @extends sap.ui.core.Control
	 */
	return XMLComposite.extend("sap.i2d.lo.lib.zvchclfz.components.configuration.control.SettingsDialog", { /** @lends sap.i2d.lo.lib.vchclf.components.configuration.control.SettingsDialog.prototype */
		metadata: {
			properties: {
				personalizationDAO: {
					type: "sap.i2d.lo.lib.zvchclfz.components.configuration.dao.PersonalizationDAO"
				},
				//temporary property => do not use
				embeddingMode: {
					type: "string"
				}
			}
		},

		/**
		 * @override
		 */
		init: function () {
			this._oModel = new JSONModel();
			this.setModel(this._oModel, "vchSettings");
		},

		/**
		 * @override
		 */
		exit: function () {
			this._oModel.destroy();
		},

		/**
		 * Opens the dialog with currently saved personalization data.
		 * @return {Promise<Object>} returns a promise which will be resolved with the current data.
		 * @public
		 */
		open: function () {
			return this.getPersonalizationDAO().getData().then(function (oSettingsData) {
				this._oModel.setData(oSettingsData);
				this.getDialog().open();
				return oSettingsData;
			}.bind(this));
		},

		/**
		 * Returns the internal settings dialog control
		 * @return {sap.m.Dialog} the settings dialog
		 * @protected
		 */
		getDialog: function () {
			return this.byId("configurationSettingsDialog");
		},

		/**
		 * Closes the dialog without saving the data.
		 * 
		 * @public
		 */
		close: function () {
			this.getDialog().close();
		},

		/**
		 * Saves currently configured settings.
		 * @return {Promise<Object>} returns a promise which will be resolved with the stored data.
		 * @public
		 */
		save: function () {
			var mData = this._oModel.getData();
			return this.getPersonalizationDAO().setData(mData);
		},

		/**
		 * Saves currently configured settings and closes the dialog.
		 * @return {Promise<Object>} returns a promise which will be resolved with the stored data.
		 * @public
		 */
		saveAndClose: function () {
			return this.save().then(function (mData) {
				this.close();
				return mData;
			}.bind(this));
		}
	});
}, /* bExport= */ true);
