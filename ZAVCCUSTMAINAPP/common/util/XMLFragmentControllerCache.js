/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/base/ManagedObject"
], function(ManagedObject) {
	"use strict";

	return ManagedObject.extend("sap.i2d.lo.lib.zvchclfz.common.util.XMLFragmentControllerCache", {

		init: function() {
			this._mCache = {};
		},
		
		exit: function() {
			for (var sController in this._mCache) {
				var oController = this._mCache[sController];
				oController.destroy();
			}
		},

		/**
		 * Load and creates a fragment controller. If already loaded, the fragment controller is returned from a cache.
		 * 
		 * @param {string} sFragment: name of the fragment
		 * @param {string} sController: name of the fragments controller
		 * @param {object} mPropertyBag: properties for controller constructor
		 * @praram {boolean} bForceCreateController: force controller creation
		 * @returns {sap.ui.base.ManagedObject} a controller instance
		 * @public
		 * @static
		 */
		createController: function(sFragment, sController, mPropertyBag, bForceCreateController) {
			if (bForceCreateController || !this._mCache[sFragment]) {
				jQuery.sap.require(sController);
				var FragmentController = jQuery.sap.getObject(sController);
				this._mCache[sFragment] = new FragmentController(mPropertyBag);
			}
			return this._mCache[sFragment];
		}
	});

});
