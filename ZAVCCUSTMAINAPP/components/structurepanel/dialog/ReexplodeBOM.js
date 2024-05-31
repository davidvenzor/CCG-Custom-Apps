/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/base/ManagedObject"
], function (ManagedObject) {
	"use strict";
	/**
	 * Reexplode BOM dialog.
	 * @class
	 * @abstract
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.ReexplodeBOM
	 * @extends sap.ui.core.Control
	 */
	
	return ManagedObject.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.ReexplodeBOM", {
		/** @lends sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.ReexplodeBOM.prototype */
		metadata: {
			properties: {
				controller: {
					type: "sap.ui.core.mvc.Controller"
				},
				control: {
					type: "object"
				}
			}
		},
		
		/**
		 * Event Handler is fired when Re-explode button is triggered
		 * Triggers forced BOM explosion and closes the dialog
		 * 
		 * @public
		 */
		onReexplodeBOM: function () {
			this.getController().reexplodeBOM(true);
			this.getControl().close();
		},
		
		/**
		 * The function allows you to define custom behavior which will be executed when the Escape key is pressed.
		 * In our case the Escape command is rejected to prevent the Explosion Error dialog from closing.
		 * @param {Promise} oPromise - you should call either resolve() or reject()
		 * @public
		 */
		onEscape: function(oPromise) {
			oPromise.reject();
		}
		
	});
}, /* bExport= */ true);
