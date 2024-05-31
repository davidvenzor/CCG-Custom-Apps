/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/model/RoutingTreeModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/StructurePanelModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/ODataModelHelper",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/i18n",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/NavigationManager",
	"sap/m/MessageBox"
], function (ManagedObject, RoutingTreeModel, Constants, StructurePanelModel,
	ODataModelHelper, i18n, NavigationManager, MessageBox) {
	"use strict";

	/** Singleton module for handling the routing functionalities
	 * @class sap.i2d.lo.lib.zvchclfz.components.structurepanel.util.RoutingUtil
	 * @public
	 */
	var RoutingUtil = ManagedObject.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.util.RoutingUtil", {

		metadata: {
			properties: {
				ownerComponent: {
					type: "object"
				}
			}
		},

		/**
		 * Explode the routing before navigate to the Routing view
		 * @param {String} sPath - path of the BOMNode or the selected Routing entity
		 * @param {Object} oBOMNode - object of the BOMNode entity
		 * @param {Object} oRoutingKey - the keys of the selected routing
		 * @public
		 */
		explodeRouting: function (sPath, oBOMNode, oRoutingKey) {
			var oRoutingTreeModel = new RoutingTreeModel(Constants.routingPageType.base);
			var bIsSuperTreeShown = StructurePanelModel.isSuperTreeShown();

			StructurePanelModel.setStructurePanelLoading(true);

			// switch to configured view before navigation from Configurable Items view
			if (StructurePanelModel.isConfigurableItemViewSelected()) {
				StructurePanelModel.setSuperTreeShown(false);
			}

			oRoutingTreeModel.explodeRouting(
				sPath, StructurePanelModel.getConfigurationContextId(), oRoutingKey, oBOMNode)
				.then(function () {
					var oSelectedRoutingKey = oRoutingKey;
					var sEntityPath = sPath;

					// If the BOM has only one routing, the route should be extended with the keys of it
					if ($.isEmptyObject(oSelectedRoutingKey)) {
						oSelectedRoutingKey = oRoutingTreeModel.getRoutingKey();

						// Just safety, it should not be touched, because there should be an error during the explosion
						if (!oSelectedRoutingKey) {
							// This will be handled by the catch branch
							throw new Error();
						}

						sEntityPath = ODataModelHelper.extendTheBOMNodePathWithRoutingKey(
							sEntityPath, oSelectedRoutingKey);
					}

					NavigationManager.navigateToRoutingFrame(
						sEntityPath, oSelectedRoutingKey, oBOMNode, oRoutingTreeModel);
				})
				.catch(function () {
					MessageBox.error(i18n.getText("vchclf_structpnl_expl_routing_error"));
					StructurePanelModel.setSuperTreeShown(bIsSuperTreeShown);
				})
				.then(function () {
					StructurePanelModel.setStructurePanelLoading(false);
					this.getOwnerComponent()
						.fireRoutingExplosionFinished();
				}.bind(this));
		},

		/**
		 * Clean up
		 * @public
		 */
		teardown: function () {
			this.setOwnerComponent(null);
		}
	});

	return new RoutingUtil();
});
