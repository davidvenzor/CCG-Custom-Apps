/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

// sap.ui.define([
// 	"sap/i2d/lo/lib/zvchclfz/components/valuation/controller/fragment/group/CharacteristicGroupsBase"
// ], function (CharacteristicGroupsBase) {
// 	"use strict";

// 	/**
// 	 * Base controller for full screen groups fragments
// 	 * 
// 	 * @class
// 	 * @abstract
// 	 * @author SAP SE
// 	 * @version 9.0.1
// 	 * @public
// 	 * @alias sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.group.CharacteristicGroupsFullScreen
// 	 * @extends sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.group.CharacteristicGroupsBase
// 	 */
// 	return CharacteristicGroupsBase.extend(
// 		"sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.group.CharacteristicGroupsFullScreen", { /** @lends sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.group.CharacteristicGroupsFullScreen.prototype */

// 			onSelect: function (oEvent) {
// 				var oTab = oEvent.getParameter("selectedItem");
// 				var oScrollContainer = oTab.getContent()[0];
// 				var oVBox = oScrollContainer.getContent()[0];
// 				var oGrid = oVBox.getItems()[0];
// 				var oBinding = oGrid.getBinding("items");
// 				var oBindingObject = oBinding.getContext().getObject();
// 				this.setBusy(true, oScrollContainer.getId());

// 				var oViewBinding = oTab.getBindingContext("view").getObject();
// 				var oAppStateModel = this.getModel("appStateModel");
// 				var bLoaded = false;
// 				if (oViewBinding.GroupId) {
// 					bLoaded = oAppStateModel.getGroupLoaded(oViewBinding.InstanceId, oViewBinding.GroupId);
// 				}

// 				if (!bLoaded) {
// 					this.getViewModel().syncCharacteristics(oBindingObject).then(function () {
// 						oBinding.resume();
// 						if (oViewBinding.GroupId) {
// 							oAppStateModel.setSelectedGroup(oViewBinding.InstanceId, oViewBinding.GroupId);
// 						}
// 					}.bind(this)).finally(function () {
// 						oBinding.refresh(true);
// 						this.setBusy(false, oScrollContainer.getId());
// 					}.bind(this));
// 				} else {
// 					this.setBusy(false, oScrollContainer.getId());
// 					if (oViewBinding.GroupId) {
// 						oAppStateModel.setSelectedGroup(oViewBinding.InstanceId, oViewBinding.GroupId);
// 					}
// 					oBinding.refresh(true);
// 				}
				
// 			},

// 			/**
// 			 * @private
// 			 */
// 			characteristicGroupFactoryFullScreen: function (sId, oContext) {
// 				var sFragment = "sap.i2d.lo.lib.zvchclfz.components.valuation.view.fragment.group.CharacteristicGroupFullScreen";
// 				var oFragment = this.characteristicGroupFactory(sId, oContext, sFragment);
// 				var oScrollContainer = oFragment.getContent()[0];
// 				var oVBox = oScrollContainer.getContent()[0];
// 				var oGrid = oVBox.getItems()[0];
// 				// Grid does not support AriaLabelledBy
// 				//oGrid.addAriaLabelledBy(oFragment.getId());
				
// 				//consider the show hidden characteristics filter in the initialization of this fragment
// 				//this is a binding filter, the other filters are server side filters
// 				var bShowHiddenCsticsSetting = oFragment.getController().getOwnerComponent().getShowHiddenCharacteristics();
// 				var aFilters = oGrid.getBindingInfo("items").filters;
				
// 				oGrid.getBindingInfo("items").filters = aFilters.filter(function(oFilter) {
// 					if(oFilter.sPath === "IsHidden") {
// 						if(bShowHiddenCsticsSetting) {
// 							//remove filter 'IsHidden' in case this view is initialited with show hidden cstics set to true
// 							return false;
// 						} else {
// 							return true;
// 						}
// 					} else {
// 						return true;
// 					}
// 				});

// 				return oFragment;
// 			}
// 		});

// }, /* bExport= */ true);


sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/valuation/controller/fragment/group/CharacteristicGroupsBase"
], function(CharacteristicGroupsBase) {
	"use strict";

	/**
	 * Base controller for embedded groups fragments
	 * 
	 * @class
	 * @abstract
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.group.CharacteristicGroupsEmbedded
	 * @extends sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.group.CharacteristicGroupsBase
	 */
	return CharacteristicGroupsBase.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.group.CharacteristicGroupsEmbedded", { /** @lends sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.group.CharacteristicGroupsEmbedded.prototype */
		
		/**
		 * @private
		 */
		characteristicGroupFactoryEmbedded: function(sId, oContext) {
			var sFragment = "sap.i2d.lo.lib.zvchclfz.components.valuation.view.fragment.group.CharacteristicGroupEmbedded";
			return this.characteristicGroupFactory(sId, oContext, sFragment);
		}
	});

}, /* bExport= */ true);

