/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/m/ButtonType",
	"i2d/lo/app/zvchclfz/config/legacyintegration/util/Constants"
	], function(ButtonType, Constants) {
	"use strict";
	var oFormatter = {
		keyAndSubkey: function(sI18N, sKey, sSubkey) {
			if(!sKey) {
				sKey = "-";
			}
			
			if(!sSubkey) {
				return sKey;
			}
			
			return jQuery.sap.formatMessage(sI18N, [sKey, sSubkey]);
		},
		
		idAndDescription: function(sI18NText, sId, sDescription) {
			return jQuery.sap.formatMessage(sI18NText, [sDescription, sId]);
		},
		
		valueAndUnitOfMeasure: function(sI18NText, sValue, sUnitOfMeasure) {
			return jQuery.sap.formatMessage(sI18NText, [sValue, sUnitOfMeasure]);
		},
		
		getDoneButtonType: function(sETOStatus){
			if (!sETOStatus){
				return ButtonType.Emphasized;
			} 
			if ( sETOStatus === Constants.ETO_STATUS.PROCESSING_STARTED ||
				 sETOStatus === Constants.ETO_STATUS.ENGINEERING_FINISHED ||
				 sETOStatus === Constants.ETO_STATUS.REVIEW_FINISHED_BY_SALES ||
				 sETOStatus === Constants.ETO_STATUS.REVISED_BY_SALES) {
				return ButtonType.Default;
			} else {
				return ButtonType.Emphasized;
			}
		}	
	};
	return oFormatter; 
}, true);