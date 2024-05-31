/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

// sap.ui.define([
// 	"sap/i2d/lo/lib/zvchclfz/components/valuation/controller/fragment/group/CharacteristicGroupBase",
// 	"sap/ui/core/IconColor"
// ], function (CharacteristicGroupBase, IconColor) {
// 	"use strict";

// 	var SEE_LESS_THRESHOLD = 30;
// 	var PAGING_ACTION = {
// 		SHOW_MORE: "ShowMore",
// 		SHOW_ALL: "ShowAll"
// 	};

// 	/**
// 	 * Base controller for full screen group fragments
// 	 * 
// 	 * @class
// 	 * @abstract
// 	 * @author SAP SE
// 	 * @version 9.0.1
// 	 * @public
// 	 * @alias sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.group.CharacteristicGroupFullScreen
// 	 * @extends sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.group.CharacteristicGroupBase
// 	 */
// 	return CharacteristicGroupBase.extend(
// 		"sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.group.CharacteristicGroupFullScreen", { /** @lends sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.group.CharacteristicGroupBase.prototype */

// 			/**
// 			 * @param  {sap.ui.base.Event} oEvent The causing event
// 			 * @private
// 			 */
// 			onPagingDefaultAction: function (oEvent) {
// 				var sButtonId = oEvent.getSource().getId();
// 				var oGrid = this._getGridControlForGroupPaging(sButtonId);
// 				var sBaseIdStringButtons = this._getContextBaseIdString(sButtonId);

// 				this._executeSeeLessMore(PAGING_ACTION.SHOW_MORE, oGrid, sBaseIdStringButtons);
// 			},

// 			/**
// 			 * @param  {sap.ui.base.Event} oEvent The causing event
// 			 * @private
// 			 */
// 			onPagingTriggered: function (oEvent) {
// 				var sButtonId = oEvent.getSource().getId();
// 				var oGrid = this._getGridControlForGroupPaging(sButtonId);
// 				var sBaseIdStringButtons = this._getContextBaseIdString(sButtonId);
// 				var aCustomData = oEvent.getParameter("item").getCustomData();
// 				var sPagingKey = aCustomData[0].getValue();

// 				this._executeSeeLessMore(sPagingKey, oGrid, sBaseIdStringButtons);
// 			},

// 			/**
// 			 * Pollyfill for Number.isInteger
// 			 * 
// 			 * @param {var} vValue the value to check
// 			 * @return {boolean} whether the number is an integer value or not.
// 			 * @private
// 			 */
// 			_isInteger: Number.isInteger || function (vValue) {
// 				return typeof vValue === "number" && isFinite(vValue) && Math.floor(vValue) === vValue;
// 			},

// 			/**
// 			 * Handles see more/ see less button pressed
// 			 * 
// 			 * @param {sap.ui.base.Event} oEvent: An Event object consisting of an id, a source and a map of parameters
// 			 * @private
// 			 * @function
// 			 */
// 			_executeSeeLessMore: function (sPagingType, oGrid, sButtonBaseId) {
// 				//get current paging status => length and threshold of form
// 				var oBindingInfo = oGrid.getBindingInfo("items");
// 				oGrid.setBusyIndicatorDelay(0);
// 				oGrid.setBusy(true);

// 				var oBinding = oGrid.getBinding("items");
// 				var oBindingObject = oBinding.getContext().getObject();
// 				var iMaxLength = oBindingObject.CsticCount;
// 				var oAppStateModel = this.getModel("appStateModel");

// 				var iNextPagingLength;

// 				var bShowAll = sPagingType === PAGING_ACTION.SHOW_ALL;

// 				var iCurrentLength = oAppStateModel.getProperty("/instances/" + oBindingObject.InstanceId + "/groups/" + oBindingObject.GroupId +
// 					"/top");

// 				if (!this._isInteger(iCurrentLength)) {
// 					iCurrentLength = parseInt(iCurrentLength, 10);
// 				}
// 				if (sPagingType === PAGING_ACTION.SHOW_MORE) {
// 					iNextPagingLength = iCurrentLength + SEE_LESS_THRESHOLD;
// 				} else if (bShowAll) {
// 					iNextPagingLength = iMaxLength;
// 				}

// 				oBindingInfo.length = iNextPagingLength;

// 				//decide which buttons should be enabled
// 				if (iNextPagingLength >= iMaxLength) {
// 					//disable menu buttons
// 					sap.ui.getCore().byId(sButtonBaseId + "--more_less_flexbox").setVisible(false);
// 				}

// 				//keep filters and sorters alive
// 				oBindingInfo.filters = oBindingInfo.binding.aFilters;
// 				oBindingInfo.sorters = oBindingInfo.binding.aSorters;

// 				oAppStateModel.setGroup(oBindingObject.InstanceId, oBindingObject.GroupId, {
// 					top: iNextPagingLength,
// 					skip: 0,
// 					loaded: false
// 				});

// 				this.getValuationDAO().readCharacteristicsOfGroup(oBindingObject, bShowAll, true).then(function () {
// 					oBinding.resume();
// 					oBinding.refresh(true);
// 					oGrid.setBusy(false);
// 				});

// 			},

// 			/**
// 			 * @private
// 			 */
// 			_getGridControlForGroupPaging: function (sButtonId) {
// 				var sGridId = this._getContextBaseIdString(sButtonId) + "--valuationForm";
// 				var oGrid = sap.ui.getCore().byId(sGridId);

// 				if (!oGrid && oGrid.getMetadata().getName() !== "sap.ui.layout.cssgrid.CSSGrid") {
// 					throw Error("Implementation expects CSSGrid but found "+oGrid.getMetadata().getName()+" .");
// 				} else {
// 					return oGrid;
// 				}
// 			},

// 			/**
// 			 * @private
// 			 */
// 			_getContextBaseIdString: function (sId) {
// 				return sId.substr(0, sId.lastIndexOf("--"));
// 			},

// 			getSeeMoreVisibility: function (aCharacteristics, iCsticCount, oAppStateModel) {

// 				if (!aCharacteristics || aCharacteristics.length === 0) {
// 					return false;
// 				}
// 				return (aCharacteristics.length >= SEE_LESS_THRESHOLD && iCsticCount > SEE_LESS_THRESHOLD && oAppStateModel.top < iCsticCount);
// 			},
			
// 			/**
// 			 * Formatter. Provides the cstic count in a way so that it is returned empty
// 			 * when no filter is set, which hides it on the UI
// 			 */ 
// 			getGroupCsticCount: function(iCsticCount, oFilters){
				
// 				if(oFilters && oFilters.length > 0 && Number.isInteger(iCsticCount)){
// 					return iCsticCount;
// 				}
// 				return "";
// 			},
			
// 			/**
// 			 * Formatter. Is used to display the right icon color for one group in the icon tab bar
// 			 * 
// 			 * @param {string} sValidationStatus: validation status for the current group
// 			 * @return {sap.ui.core.IconColor} Icon color
// 			 * @public
// 			 * @function
// 			 */
// 			getGroupIconColor: function (sValidationStatus, bEditable) {
// 				if (!bEditable){
// 					return IconColor.Default;
// 				}
// 				switch (sValidationStatus) {
// 				case "2":
// 					return IconColor.Critical;
// //				case "4":
// //					return IconColor.Negative;
// 				default:
// 					return IconColor.Default;
// 				}
// 			}
// 		});

// }, /* bExport= */ true);

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

