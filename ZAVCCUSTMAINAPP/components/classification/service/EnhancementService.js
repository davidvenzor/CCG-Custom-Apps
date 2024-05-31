/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/i2d/lo/lib/zvchclfz/common/Constants"
], function(ManagedObject, Constants) {
	"use strict";

	/**
	 * Service for enhancements by various embedding applications. Used as singleton class.
	 * 
	 * @class EnhancementService
	 */
	var EnhancementService = ManagedObject.extend("sap.i2d.lo.lib.zvchclfz.components.classification.service.EnhancementService", {
		oComponentModel: undefined,
		
		bInitialized: false,
		
		/**
		 * Initializes the values required by the service functions.
		 * 
		 * @param {object} oView The view of the classification component.
		 * @public
		 * @memberof EnhancementService
		 * @instance
		 */
		initialize: function(oView) {
			if (this.bInitialized) {
				return;
			}
			
			this.oComponentModel = oView.getModel(Constants.CLASSIFICATION_COMPONENT_MODEL_NAME);
			
			this.bInitialized = true;
		},
		
		/**
		 * Method to be overwritten by embedding application to define the machine learning proposal button's behavior.
		 * 
		 * @public
		 * @memberof EnhancementService
		 * @instance
		 * @return {object} A new Promise.
		 */
		loadClassificationProposal: function() {
			return new Promise(function(fnResolve, fnReject) {
				fnResolve({ callDefaultImplementation: true });
			});
		},
		
		/**
		 * Enables or disables the busy indicator on the classification component.
		 * 
		 * @param {boolean} [bBusy=true] Determines whether to enable or disable the busy state.
		 * @public
		 * @memberof EnhancementService
		 * @instance
		 */
		setBusy: function(bBusy) {
			var bState = bBusy || true;
			
		    this.oComponentModel.setProperty("/classificationBusy", bState);
		}
	});
	var oService;

	return {
		/**
		 * Makes EnhancementService singleton. Creates and returns the service if it does not exist yet or returns the already existing one. 
		 * 
		 * @public
		 * @memberof EnhancementService
		 * @static
		 * @return {object} A EnhancementService instance.
		 */
		getService: function() {
			if (!oService) {
				oService = new EnhancementService();
			}
			
			return oService;
		}
	};
});
