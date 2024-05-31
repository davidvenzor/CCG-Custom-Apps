/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([
], function() {
	"use strict";

	return {
		/**
		 * Drop all messages that have a target pointing to a characteristic.
		 * The benefit is: When the characteristic is not updated from the backend
		 * (for example filtered) the message disappears. 
		 * So the assumption is: All relevant messages are sent again from the backend 
		 * after a valuation step. 
		 * 
		 * @private
		 */
		dropCharacteristicMessages: function() {
			var oMessageManager = sap.ui.getCore().getMessageManager();
			var aMessage = oMessageManager.getMessageModel().getData();
			aMessage.forEach(function(oMessage) {
				if (!oMessage.target) {
					return;
				}
				if (oMessage.target.startsWith("/CharacteristicSet(ContextId=") && oMessage.target.endsWith(")/CsticId")) {
					oMessageManager.removeMessages(oMessage);
				}
			});
		}
	};
});
