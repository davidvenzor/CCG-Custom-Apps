/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/i2d/lo/lib/zvchclfz/common/util/XMLFragmentCache",
	"sap/i2d/lo/lib/zvchclfz/common/util/XMLFragmentControllerCache"
], function(ManagedObject, XMLFragmentCache, XMLFragmentControllerCache) {
	"use strict";

	/**
	 * 
	 * FactoryBase is used for creating XMLFragments and XMLFragmentsController
	 * The XMLFragmentsController are cached in the FactoryBase
	 * 
	 * @param {string}
	 *            [sId] Optional ID for the new control; generated automatically if
	 *            no non-empty ID is given Note: this can be omitted, no matter
	 *            whether <code>mSettings</code> will be given or not!
	 * @param {object}
	 *            [mSettings] optional map/JSO
	 
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.vchclf.common.factory.FactoryBase
	 * @extends sap.ui.base.ManagedObject
	 */
	return ManagedObject.extend("sap.i2d.lo.lib.zvchclfz.common.factory.FactoryBase", {

		metadata: {
			"abstract": true,
			properties: {
				dataModel: {
					type: "sap.ui.model.Model"
				},
				settingsModel: {
					type: "sap.ui.model.Model"
				},
				view: {
					type: "sap.ui.core.mvc.View"
				},
				controller: {
					type: "sap.ui.core.mvc.Controller"
				}
			}
		},

		/**
		 * @override
		 */
		init: function() {
			this._oXMLFragmentControllerCache = new XMLFragmentControllerCache();
			this._mPropertyBag = {};
		},

		/**
		 * @override
		 */
		exit: function() {
			this._oXMLFragmentControllerCache.destroy();
			delete this._mPropertyBag;
		},

		/**
		 * @override
		 */
		setProperty : function(sProperty, vValue) {
			this._mPropertyBag[sProperty] = vValue;
			return ManagedObject.prototype.setProperty.apply(this, arguments);
		},


		/**
		 * @protected
		 */
		createController: function(sFragment, sController, bForceCreateController) {
			return this._getXMLFragmentControllerCache().createController(sFragment, sController, this._mPropertyBag, bForceCreateController);
		},

		/**
		 * @protected
		 */
		createFragment: function(sIdPrefix, sFragment, vController, bForceCreateController) {
			if (typeof vController === "string") {
				vController = this.createController(sFragment, vController, bForceCreateController);
			}
			var oControl = XMLFragmentCache.createFragment(sIdPrefix, sFragment, vController);
			if (vController.setControl) {
				vController.setControl(oControl);
				oControl.getController = function(){
					return vController;
				};
			}
			return oControl;
		},
		
		/**
		 * @private
		 */
		_getXMLFragmentControllerCache: function() {
			return this._oXMLFragmentControllerCache;
		}
	});
});
