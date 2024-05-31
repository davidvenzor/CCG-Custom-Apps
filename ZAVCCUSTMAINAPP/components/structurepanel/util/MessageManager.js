/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([], function () {
	"use strict";

	return {
		/**
		 * Drop all messages that have a target pointing to a BOMNode or RoutingNode.
		 * @public
		 */
		dropStructurePanelMessages: function () {
			var oMessageManager = sap.ui.getCore().getMessageManager();
			var aMessage = oMessageManager.getMessageModel().getData();

			$.each(aMessage, function (iKey, oMessage) {
				if (!oMessage.target) {
					return;
				}

				if (oMessage.target.indexOf("/RoutingNodeSet") >= 0 ||
					oMessage.target.indexOf("/BOMNodeSet") >= 0 ||
					oMessage.target.indexOf("/to_RoutingNodes") >= 0 ||
					oMessage.target.indexOf("/BOMNodes") >= 0) {
					oMessageManager.removeMessages(oMessage);
				}
			});
		}
	};
});
