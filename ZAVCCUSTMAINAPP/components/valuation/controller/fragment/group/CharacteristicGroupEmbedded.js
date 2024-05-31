/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/valuation/controller/fragment/group/CharacteristicGroupBase",
	"sap/i2d/lo/lib/zvchclfz/common/Constants"
], function (CharacteristicGroupBase, Constants) {
	"use strict";

	var SEE_LESS_THRESHOLD = 30;

	/**
	 * Controller for embedded group fragments
	 * 
	 * @class
	 * @abstract
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.group.CharacteristicGroupEmbedded
	 * @extends sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.group.CharacteristicGroupBase
	 */
	return CharacteristicGroupBase.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.group.CharacteristicGroupEmbedded", { /** @lends sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.group.CharacteristicGroupBase.prototype */

		_bShowMore: false,

		/**
		 * Returns the OData search query option value
		 * @private
		 * @returns {string} paging search string
		 */
		_buildPagingSearchString: function (iSkipCharacteristics, iTopCharacteristics) {
			if (iSkipCharacteristics === 0 && iTopCharacteristics === 0) {
				return "";
			}

			var sPagingSearchString = "SkipCharacteristics=" + iSkipCharacteristics + ",TopCharacteristics=" + iTopCharacteristics;
			return sPagingSearchString;
		},

		/**
		 * Event handler to handle the see more button press.
		 * 
		 * @param  {sap.ui.base.Event} oEvent The causing event
		 * @private
		 */
		handleSeeLessMore: function (oEvent) {
			var sButtonId = oEvent.getParameter("id");
			var sGridId = sButtonId.substr(0, sButtonId.lastIndexOf("--")) + "--valuationForm";
			var oGrid = sap.ui.getCore().byId(sGridId);

			if (!oGrid && oGrid.getMetadata().getName() !== "sap.ui.layout.cssgrid.CSSGrid") {
				throw Error("Implementation expects CSSGrid but found "+oGrid.getMetadata().getName()+" .");
			}
			oGrid.setBusyIndicatorDelay(0);
			oGrid.setBusy(true);
			var oBindingInfo = oGrid.getBindingInfo("items");
			var iBindingLength = parseInt(oBindingInfo.length, 10);
			var oBinding = oGrid.getBinding("items");
			var oBindingObject = oBinding.getContext().getObject();
			var iMoreMode = oBindingObject.CsticCount;
			var iLessMode = SEE_LESS_THRESHOLD;
			var bMoreMode = false;

			// Workaround: mapping object structure from type JSONListBinding to ManagedObject (see ManagedObject.js _updateAggregation line 3151)
			oBindingInfo.filters = oBindingInfo.binding.aFilters;
			oBindingInfo.sorters = oBindingInfo.binding.aSorters;

			if (iBindingLength === iLessMode) {
				oBindingInfo.length = iMoreMode;
				bMoreMode = true;
			} else if (iBindingLength > iLessMode) {
				oBindingInfo.length = iLessMode;
			}

			this.getModel("appStateModel").setGroup(oBindingObject.InstanceId, oBindingObject.GroupId, {
				top: oBindingInfo.length,
				skip: 0,
				loaded: false
			});

			if (bMoreMode) {
				this.getValuationDAO().readCharacteristicsOfGroup(oBindingObject, true).then(function () {
					oBinding.resume();
					oBinding.refresh(true);
					oGrid.setBusy(false);
				});
			} else {
				oBinding.resume();
				oBinding.refresh(true);
				oGrid.setBusy(false);
			}
		},

		/**
		 * @private
		 */
		_getCharacteristicGroups: function () {
			return this.byId("groupVBox-0--groups");
		}
	});

}, /* bExport= */ true);
