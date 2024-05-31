/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/base/ManagedObject",
	"jquery.sap.global",
	"sap/ui/model/json/JSONModel"
], function(ManagedObject, jQuery, JSONModel) {
	"use strict";

	var oMockdata = ManagedObject.extend("sap.i2d.lo.lib.zvchclfz.common.localService.Mockdata", {
		metadata: {
			properties: {
				filteredData: {
					type: "Object",
					defaultValue: {
						results: []
					}
				}
			}
		},

		_oFilteredDataModel: null,

		init: function() {
			var oData = {
				CharacteristicGroups: []
			};
			this._oFilteredDataModel = new JSONModel(oData);
		},

		exit: function() {
			this._oFilteredDataModel.destroy();
			delete this._oFilteredDataModel;
		},

		getCharacteristicGroupSet: function() {
			return this._getFilteredDataModel().getProperty("/CharacteristicGroups");
		},

		setCharacteristicGroupSet: function(aGroups) {
			this._getFilteredDataModel().setProperty("/CharacteristicGroups", aGroups);
		},
		
		setProperty: function(sPath, mValue) {
			this._getFilteredDataModel().setProperty(sPath, mValue);
		},

		getProperty: function(sPath) {
			return this._getFilteredDataModel().getProperty(sPath);
		},

		getFilteredData: function() {
			return jQuery.extend({}, this.getProperty("filteredData"));
		},

		_getFilteredDataModel: function() {
			return this._oFilteredDataModel;
		}
	});

	return oMockdata;
	
}, true);
