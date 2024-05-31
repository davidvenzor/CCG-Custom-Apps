/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/Element",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/HeaderField",
	"sap/ui/model/json/JSONModel"
], function(jQuery, Element, HeaderField, JSONModel) {
	"use strict";

	/**
	 * 
	 */
	return Element.extend("sap.i2d.lo.lib.zvchclfz.components.configuration.BaseHeaderConfiguration", {
		"abstract" : true,
		metadata: {
			manifest: "json",
			properties: {
				title: {
					type: "sap.ui.model.type.String"
				},
				
				subtitle: {
					type: "sap.ui.model.type.String"
				}
			},
			aggregations: {
				headerFields: {
					type: "sap.i2d.lo.lib.zvchclfz.components.configuration.HeaderField",
					multiple: true,
					singularName: "headerField"
				},
				headerActions: {
					type: "sap.i2d.lo.lib.zvchclfz.components.configuration.HeaderField",
					multiple: true,
					singularName: "headerAction"
				},
				_defaultHeaderFields: {
					type: "sap.i2d.lo.lib.zvchclfz.components.configuration.HeaderField",
					hidden : true,
					multiple: true
				},
				_defaultHeaderActions: {
					type: "sap.i2d.lo.lib.zvchclfz.components.configuration.HeaderField",
					hidden : true,
					multiple: true
				}
			}
		},
		
		_mDefaultFields : null,
		_oModel : null,
		
		/**
		 * @override
		 */
		init : function() {
			this._oModel = new JSONModel(this.getDataJSON());
			this._mDefaultFields = {};

			this.updateDefaultActions();
			
			this.updateDefaultFields();
		},
		
		/**
		 * Updates the internal default header fields aggregation in case there are updates
		 * @private
		 */
		updateDefaultFields: function() {
			this.removeAll_defaultHeaderFields();
			
			var aDefaultFields = this.getDefaultHeaderFields();
			aDefaultFields.forEach(function(oHeaderField) {
				this._mDefaultFields[this._getIdOfField(oHeaderField)] = oHeaderField;
				this.addAggregation("_defaultHeaderFields", oHeaderField);
			}.bind(this));
		},
		
		
		/**
		 * Updates the internal default header actions aggregation in case there are updates
		 * @private
		 */
		updateDefaultActions: function() {
			this.removeAll_defaultHeaderActions();
			
			var aDefaultActions = this.getDefaultHeaderActions();
			aDefaultActions.forEach(function(oHeaderAction) {
				this._mDefaultFields[this._getIdOfField(oHeaderAction)] = oHeaderAction;
				this.addAggregation("_defaultHeaderActions", oHeaderAction);
			}.bind(this));
		},
		
		exit : function() {
			this._mDefaultFields = null;
			this._oModel.destroy();
			delete this._oModel; 
		},


		/**
		 * Returns the header configuration model
		 * @return {sap.ui.model.json.JSONModel}
		 * @public
		 */
		getHeaderConfigurationModel : function() {
			return this._oModel;	
		},


		/**
		 * Setter for header fields array
		 * 
		 * @param {[sap.i2d.lo.lib.vchclf.components.configuration.HeaderField]} Array of header fields
		 * @public
		 */
		setHeaderFields: function(aHeaderFields) {
			this.removeAllHeaderFields();

			aHeaderFields.forEach(function(oHeaderField) {
				this.addHeaderField(oHeaderField);
			}.bind(this));
		},
		
		
		/**
		 * Setter for header actions array
		 * 
		 * @param {[sap.i2d.lo.lib.vchclf.components.configuration.HeaderActions]} Array of header actions
		 * @public
		 */
		setHeaderActions: function(aHeaderActions) {
			this.removeAllHeaderActions();

			aHeaderActions.forEach(function(oHeaderAction) {
				this.addHeaderAction(oHeaderAction);
			}.bind(this));
		},

		
		/**
		 * @override
		 */
		setProperty : function(sPropertyName, oValue, bSuppressInvalidate) {
			var oResult = Element.prototype.setProperty.apply(this, arguments);
			this.syncModel();
			return oResult;
		},

		/**
		 * @override
		 */
		addAggregation : function(sAggregationName, oValue, bSuppressInvalidate) {
			var oResult = Element.prototype.addAggregation.apply(this, arguments);
			this.syncModel();
			return oResult;
		},


		/**
		 * Syncs the model with the internal scructure
		 * @public
		 */
		syncModel : function() {
			this._oModel.setData(this.getDataJSON());
		},
		

		/**
		 * Returns all properties and also object from the headerFields aggregation as JSON
		 * @protected
		 * @returns {Map} deep JSON of all properties and header fields
		 */
		getDataJSON: function() {
			// add title and subtitle
			var oHeaderJSON = {
				"title": this.getTitle(),
				"subtitle": this.getSubtitle(),
				"headerFields": [],
				"headerActions": []
			};
			//add headerFields
			var aDefaultHeaderFields = this._getDefaultHeaderFields();
			var aHeaderFields = this.getHeaderFields();
			oHeaderJSON.headerFields = this._merge(aDefaultHeaderFields, aHeaderFields, true);

			// add headerActions
			var aDefaultActions = this._getDefaultHeaderActions();
			var aHeaderActions = this.getHeaderActions();
			oHeaderJSON.headerActions = this._merge(aDefaultActions, aHeaderActions, false);
			
			return oHeaderJSON;
		},
		
		
		/**
		 * @private
		 */
		_merge : function(aDefaultFields, aFields, bDefaultsFirst) {
			var mFieldsToMerge = {};
			var aDefaultFieldsJSON = [];
			var aFieldsJSON = [];
			
			
			aFields.forEach(function(oField) {
				var mHeaderFieldJSON = oField.getDataJSON();
				if (!this._needsMerge(oField)) {
					aFieldsJSON.push(mHeaderFieldJSON);	
				} else {
					var sFieldId = this._getIdOfField(oField);
					if (!mFieldsToMerge[sFieldId]) {
						mFieldsToMerge[sFieldId] = [];
					}
					mFieldsToMerge[sFieldId].push(mHeaderFieldJSON);
				}
			}.bind(this));

			aDefaultFields.forEach(function(oDefaultField) {
				var mDefaultFieldJSON = oDefaultField.getDataJSON();
				var sID = this._getIdOfField(oDefaultField);
				if (mFieldsToMerge[sID]) {
					 mFieldsToMerge[sID].forEach(function(mFieldToMergeJSON) {
					 	mDefaultFieldJSON = jQuery.extend(true, mDefaultFieldJSON, mFieldToMergeJSON);
					 });
				}
				aDefaultFieldsJSON.push(oDefaultField.getDataJSON());	
			}.bind(this));
			
			return bDefaultsFirst ? aDefaultFieldsJSON.concat(aFieldsJSON) : aFieldsJSON.concat(aDefaultFieldsJSON);
		},


		/**
		 * @private
		 */
		_needsMerge : function(oField) {
			var oDefaultField = this._getDefaultFieldById(this._getIdOfField(oField));
			return oDefaultField && oDefaultField !== oField;
		},


		/**
		 * @rivate
		 */
		_getDefaultFieldById : function(sFieldId) {
			return this._mDefaultFields[sFieldId];
		},

		/**
		 * @rivate
		 */
		_getDefaultHeaderActions : function() {
			return this.getAggregation("_defaultHeaderActions") || [];
		},
		
		
		/**
		 * @rivate
		 */
		_getDefaultHeaderFields : function() {
			return this.getAggregation("_defaultHeaderFields") || [];
		},
		
		
		/**
		 * @rivate
		 */
		_getIdOfField : function(oField) {
			var oProperties = oField.getProperties();
			return oProperties ? oProperties.id : null;
		},

		/**
		 * @protected
		 * @returns {Array}[sap.i2d.lo.lib.vchclf.components.configuration.HeaderField]
		 */
		getDefaultHeaderActions: function() {
			return [];
		},
		
		
		/**
		 * @protected
		 * @returns {Array}[sap.i2d.lo.lib.vchclf.components.configuration.HeaderField]
		 */
		getDefaultHeaderFields :  function() {
			return [];	
		}
	});
});
