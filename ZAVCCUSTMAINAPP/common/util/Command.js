/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/base/Object"
], function(Object) {
	"use strict";

	return Object.extend("sap.i2d.lo.lib.zvchclfz.common.util.Command", {
		
		metadata: {
			publicMethods: ["execute", "undo", "getSourceControlId"]
		},

		
		/**
		 * Command constructor
		 * @param {String} sControlId - control to which the command is bound
		 * @param {Object} oRedo - an object containing the data for redo with the following properties:<br>
		 *          oValue - the actual value<br>
		 *          oCsticData - the characteristic data from the model<br>
		 *          oCstic - the characteristic control<br>
	     *          execute - the execution function<br>
	     * @param {Object} oUndo - an object containing the data for undo with the following properties:<br>
	     *          oValue - the actual value<br>
		 *          oCsticData - the characteristic data from the model<br>
		 *          oCstic - the characteristic control<br>
	     *          execute - the execution function<br>
		 */
		constructor: function(sControlId, oRedo, oUndo) {
			this._sControlId = sControlId;
			this.oUndo = oUndo;
			this.oRedo = oRedo;
		},

		execute: function() {
			return this.oRedo.execute();
		},

		undo: function() {
			return this.oUndo.execute();
		},
		
		toString: function() {
			return "Command for cstic '" + this.oRedo.oCsticData.CsticId + "'" +
			       " / undo-direction = " + this.oUndo.oValue.Direction + 
			       " / undo-value = "+JSON.stringify(this.oUndo.oValue.ValueObject) +
			       " / redo-direction = "+ this.oRedo.oValue.Direction +
			       " / redo-value = "+JSON.stringify(this.oRedo.oValue.ValueObject);
		},
		
		getSourceControlId: function(){
			return this._sControlId;
		}

	});
});
