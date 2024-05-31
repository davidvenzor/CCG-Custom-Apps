/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/configuration/controller/fragment/Base",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/formatter/CharacteristicFormatter",
	"sap/m/GroupHeaderListItem"
], function(Base, CharacteristicFormatter, GroupHeaderListItem) {
	"use strict";

	/**
	 * Pricing Records Dialog fragment controller
	 * 
	 * @class
	 * @abstract
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.vchclf.components.configuration.controller.fragment.ChangeDocuments
	 * @extends  sap.i2d.lo.lib.vchclf.components.configuration.controller.fragment.Base
	 */
	return Base.extend("sap.i2d.lo.lib.zvchclfz.components.configuration.controller.fragment.ChangeDocuments", { /** @lends sap.i2d.lo.lib.vchclf.components.configuration.controller.fragment.PricingRecords.prototype */

		metadata: {
			properties: {
				personalizationDAO : {
					type : "sap.i2d.lo.lib.zvchclfz.components.configuration.dao.PersonalizationDAO"
				}
				
			}
		},
		
		formatter: CharacteristicFormatter,
		
		getGroupHeader: function(oGroup) {
			return new GroupHeaderListItem({
				title: this.getText("CHANGE_DOCUMENT_PRODUCT_ID") + ": " + oGroup.key,
				upperCase: false
			});
		},

		closeChangeDocumentsDialog: function () {
			this.getControl().close();
		}

	});

}, /* bExport= */ true);
