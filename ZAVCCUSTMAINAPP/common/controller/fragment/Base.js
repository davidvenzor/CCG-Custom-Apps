/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/base/ManagedObject"
], function (ManagedObject) {
	"use strict";

	/**
	 * Base fragment controller
	 * 
	 * @class
	 * @abstract
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.vchclf.components.configuration.controller.fragment.Base
	 * @extends sap.ui.base.ManagedObject
	 */
	return ManagedObject.extend("sap.i2d.lo.lib.zvchclfz.common.controller.fragment.Base", { /** @lends sap.i2d.lo.lib.vchclf.common.controller.Base.prototype */

		metadata: {
			"abstract": true,
			properties: {
				controller: {
					type: "sap.ui.core.mvc.Controller"
				},
				view: {
					type: "sap.ui.core.mvc.View"
				},
				control: {
					type: "sap.ui.core.Control"
				},
				i18nModelName: {
					type: "string",
					defaultValue: "i18n"
				}
			}
		},
		
		/**
		 * @override
		 */
		init: function () {
		},

		/**
		 * @override
		 */
		exit: function () {
			this.setController(null);
			this.setView(null);
			this.setControl(null);
		},

		/**
		 * Returns the controller associated to the view.
		 * @return {sap.ui.core.mvc.Controller} the controller of the given view.
		 * @protected
		 */
		getViewController: function () {
			return this.getView().getController();
		},

		/**
		 * Returns the owner component of the view.
		 * 
		 * @return {sap.ui.core.Component} the owner component of the view
		 * @protected
		 */
		getOwnerComponent: function () {
			return this.getViewController().getOwnerComponent();
		},

		/**
		 * Returns the control for a certain ID which is inside the view
		 * @return {sap.ui.core.Control}
		 * @protected
		 */
		byId: function (sId) {
			return this.getViewController().byId(sId);
		},

		/**
		 * Returns a named model.
		 * @return {sap.ui.model.Model} the model for the given model name
		 * @protected
		 */
		getModel: function (sModelName) {
			return this.getView().getModel(sModelName);
		},

		/**
		 * Returns the resource bundle of the vchI18n model
		 * @return {sap.ui.model.resource.ResourceModel} the resource model
		 * @protected
		 */
		getResourceBundle: function () {
			if (!this.vchI18nResourceBundle) {
				this.vchI18nResourceBundle = this.getView().getModel(this.getI18nModelName()).getResourceBundle();
			}
			return this.vchI18nResourceBundle;
		},

		/**
		 * Returns a translated text for a given key.
		 * @param {string} sKey the key of the translated text
		 * @return {string} The translated string
		 * @protected
		 */
		getText: function (sKey, aPlaceholder) {
			return this.getResourceBundle().getText(sKey, aPlaceholder);
		},

		/**
		 * Returns the control for a certain ID 
		 * @param {string} sId: id of searched control
		 * @return {sap.ui.core.Control} ui control instance
		 * @function
		 * @protected
		 */
		getControlById: function (sId) {
			var oControl = null;
			if (sId) {
				oControl = this.byId(sId);
				if (!oControl) {
					oControl = sap.ui.getCore().byId(sId);
				}
			}
			return oControl;
		},

		/**
		 * Sets a control or the view busy
		 * @param {boolean} bBusy wheather the the control should be set to busy or not
		 * @param {string} [sId] Optional. The control ID to set busy. When no ID is given, the view is taken.
		 * @void
		 * @protected
		 */
		setBusy: function (bBusy, sId) {
			var oControl = this.getView();
			if (sId) {
				oControl = this.byId(sId);
				if (!oControl) {
					oControl = sap.ui.getCore().byId(sId);
				}
			}
			if (oControl) { // It may happen that the cstic was filtered so the control is not available
				oControl.setBusyIndicatorDelay(0);
				oControl.setBusy(bBusy);
			}
		}
	});

}, /* bExport= */ true);
