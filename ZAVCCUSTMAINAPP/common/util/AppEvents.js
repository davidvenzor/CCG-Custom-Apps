/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["sap/i2d/lo/lib/zvchclfz/common/util/AppEvent"
], function(AppEvent) {
	
	/**
	 * Contains the application events of the valuation component
	 */
	var AppEvents = {
	
		/**
		 * Event that is raised to evaluate whether for received characteristics the whole screen must be destroyed (e.g. amount and/or order of cstics has changed)
		 * 
		 * Parameters: 
		 *	     groupId: type: "integer"
		 *			
		 */
		EVALUATE_CSTICS_GEOMETRY: new AppEvent({
			channelId: "sap.i2d.lo.lib.vchclf.components.valuation",
			name: "EVALUATE_CSTICS_GEOMETRY"
		}),
		
		/**
		 * Event that is raised when the 'vchclf_business' was raised in the backend
		 * 
		 * Parameters: 
		 *	     propertyRef: "string"
		 *			
		 */
		VCHCLF_BUSINESS_EXCEPTION: new AppEvent({
			channelId: "sap.i2d.lo.lib.vchclf.common",
			name: "VCHCLF_BUSINESS_EXCEPTION"
		}),
		/**
		 * Event that is raised when the BOM explosion error dialog close is triggered.
		 * Triggers are: Navigation to Manage Order BOM app or Close buttons
		 * 
		 * Parameters: 
		 *	     action: "string" 
		 *			
		 */
		BOM_EXPLOSION_ERROR_DIALOG_CLOSE: new AppEvent({
			channelId: "sap.i2d.lo.lib.vchclf.components.structurepanel",
			name: "BOM_EXPLOSION_ERROR_DIALOG_CLOSE"
		})
	};
		
	return AppEvents;
});
			
