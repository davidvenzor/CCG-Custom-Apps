/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/common/type/InspectorMode",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/EventProvider",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/StructurePanelModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/model/RoutingTreeModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/model/StructureTreeModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/ODataModelHelper",
	"sap/base/util/uid",
	"sap/ui/base/ManagedObject"
	// eslint-disable-next-line max-params
], function (InspectorMode, Constants, EventProvider, StructurePanelModel, RoutingTreeModel, StructureTreeModel,
	ODataModelHelper, uid, ManagedObject) {
	"use strict";

	/** Singleton module for handling navigations inside structurepanel component
	 * @class sap.i2d.lo.lib.zvchclfz.components.structurepanel.logic.NavigationManager
	 * @public
	 */
	var NavigationManager =
		ManagedObject.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.logic.NavigationManager", {

			metadata: {
				properties: {
					mainContainer: {
						type: "object"
					},
					routingTreeContainer: {
						type: "object"
					},
					ownerComponent: {
						type: "object"
					}
				}
			},

			/**
			 * Navigates to the Top Page of Routing Tree Container
			 * @public
			 */
			backToTopOfRouting: function () {
				this._backToTopOfRouting();

				this._onAfterNavigationTo(this._getCurrentRoutingPageController());
			},

			/**
			 * Navigates to the Top Page of Routing Tree Container because of an error in single lvl scenario
			 * @public
			 */
			backToTopOfRoutingWithError: function () {
				this._backToTopOfRouting();

				var oCurrentPageController = this._getCurrentRoutingPageController();

				if (oCurrentPageController &&
					$.isFunction(oCurrentPageController.clearRoutingTree)) {
					oCurrentPageController.clearRoutingTree();
				}
			},

			/**
			 * Navigates to the Top Page
			 * @public
			 */
			navigateToBOMFrame: function () {
				var bFrameIsReset = this.resetFrame();

				if (bFrameIsReset) {
					var oCurrentlyLoadedBOMItem = StructurePanelModel.getCurrentlyLoadedBOMItemInValuation();
					var oRootBOMComponent = StructureTreeModel.getRootComponent();

					if (oCurrentlyLoadedBOMItem || oRootBOMComponent) {
						this.getOwnerComponent().fireInspectObject({
							objectPath: ODataModelHelper.generateBOMNodePath(
								StructurePanelModel.getConfigurationContextId(),
								oCurrentlyLoadedBOMItem && oCurrentlyLoadedBOMItem.ComponentId ||
								oRootBOMComponent.ComponentId),
							objectType: InspectorMode.objectType.BOMComponent
						});
					}
				}
			},

			/**
			 * Navigates to the Top Page
			 * @returns {Boolean} - returns whether the frame was reset
			 * @public
			 */
			resetFrame: function () {
				var bFrameIsReset = false,
					oMainContainer = this.getMainContainer();

				if (!this.isCurrentPageStructureFrame() &&
					oMainContainer) {

					this.resetRoutingFrame();
					EventProvider.fireBOMViewSelectionChanged();
					oMainContainer.backToTop();

					bFrameIsReset = true;
				}

				return bFrameIsReset;
			},

			/**
			 * Re-explode the routing
			 * @public
			 */
			reexplodeRouting: function () {
				$.each(this.getRoutingTreeContainer().getPages(), function (iIndex, oRoutingTree) {
					var oController = oRoutingTree.getController();

					if ($.isFunction(oController.invalidateRoutingTree)) {
						oController.invalidateRoutingTree();
					}
				});

				this._reexplodeCurrentRoutingPage();
			},

			/**
			 * Triggers a read request for the routing
			 * @public
			 */
			reloadRouting: function () {
				var oCurrentController = this._getCurrentRoutingPageController();

				if (oCurrentController &&
					$.isFunction(oCurrentController.reloadRouting)) {
					oCurrentController.reloadRouting();
				}
			},

			/**
			 * Triggers a navigation to the previous page inside the component's NavContainer
			 * @public
			 */
			navigateBack: function () {
				if (!this.isCurrentRoutingPageBase()) {
					this.getRoutingTreeContainer().back();

					this._onAfterNavigationTo(this._getCurrentRoutingPageController());
				} else {
					this.navigateToBOMFrame();
				}
			},

			/**
			 * Triggers a navigation to the Routing Frame
			 * @param {String} sCallerPath - Caller Binding Path
			 * @param {Object} oRoutingKey - Object of the Routing Key
			 * @param {Object} oBOMNode - Object of the BOMNode entity
			 * @param {sap.i2d.lo.lib.zvchclfz.components.structurepanel.model.RoutingTreeModel} oRoutingTreeModel - Created instance of RoutingTreeModel
			 * @public
			 */
			navigateToRoutingFrame: function (sCallerPath, oRoutingKey, oBOMNode, oRoutingTreeModel) {
				var oMainContainer = this.getMainContainer();

				$.each(oMainContainer.getPages(), function (iIndex, oView) { // eslint-disable-line consistent-return
					if (oView.getControllerName() === Constants.controller.routingFrame) {
						var oViewController = oView.getController();

						oMainContainer.to(oView);

						this.getOwnerComponent().fireInspectObject({
							objectPath: ODataModelHelper.generateRoutingNodePath(
								sCallerPath,
								Constants.standardSequenceTreeId,
								Constants.defaultRoutingRootNodeId),
							objectType: InspectorMode.objectType.RoutingHeader
						});

						if ($.isFunction(oViewController.onAfterNavigationTo)) {
							oViewController.onAfterNavigationTo(sCallerPath, oRoutingKey, oBOMNode, oRoutingTreeModel);
						}

						return false;
					}
				}.bind(this));
			},

			/**
			 * Resets the Routing Frame
			 * @public
			 */
			resetRoutingFrame: function () {
				// need to destroy the views, otherwise event handlers are not unregistered
				// if you use the destroyPages method of the Nav Container instead of the
				// removeAllPages, there are rendering issues
				var oRoutingTreeContainer = this.getRoutingTreeContainer();

				if (oRoutingTreeContainer) {
					$.each(oRoutingTreeContainer.getPages(), function (iIndex, oView) {
						if ($.isFunction(oView.destroy)) {
							oView.destroy();
						}
					});

					oRoutingTreeContainer.removeAllPages();
				}
			},

			/**
			 * Adds Routing Tree Base Page
			 * @param {sap.i2d.lo.lib.zvchclfz.components.structurepanel.model.RoutingTreeModel} oRoutingTreeModel - Created instance of RoutingTreeModel
			 * @public
			 */
			addBaseRoutingTreePage: function (oRoutingTreeModel) {
				this._addRoutingTreePage(Constants.routingPageType.base, {}, oRoutingTreeModel);
			},

			/**
			 * Adds Routing Tree Sub Page
			 * @param {Object} oRoutingObject - caller RoutingObject
			 * @public
			 */
			addRoutingTreeSubPage: function (oRoutingObject) {
				var oRoutingPage = this._getRoutingPageByBOOSequence(oRoutingObject.BillOfOperationsSequence);

				if (oRoutingPage) {
					this.getRoutingTreeContainer().to(oRoutingPage);

					this._onAfterNavigationTo(oRoutingPage.getController());
				} else {
					this._addRoutingTreePage(Constants.routingPageType.subPage, oRoutingObject);
				}
			},

			/**
			 * Returns whether the currently selected Page is Base Routing Page
			 * @returns {Boolean} Is base Routing Tree Page
			 * @public
			 */
			isCurrentRoutingPageBase: function () {
				var oCurrentController = this._getCurrentRoutingPageController();

				return !!oCurrentController &&
					oCurrentController.getRoutingModelType() === Constants.routingPageType.base;
			},

			/**
			 * Returns whether the currently selected Main frame Page is Routing Page
			 * @returns {Boolean} Is Routing Tree Page
			 * @public
			 */
			isCurrentMainPageRoutingFrame: function () {
				return this.getMainContainer().getCurrentPage().getControllerName() ===
					Constants.controller.routingFrame;
			},

			/**
			 * Returns whether the currently selected Main frame Page is Structure Frame
			 * @returns {Boolean} Is Structure Frame Page
			 * @public
			 */
			isCurrentPageStructureFrame: function () {
				return this.getMainContainer().getCurrentPage().getControllerName() ===
					Constants.controller.structureFrame;
			},

			/**
			 * Clean up
			 * @public
			 */
			teardown: function () {
				this.setMainContainer(null);
				this.setRoutingTreeContainer(null);
				this.setOwnerComponent(null);
			},

			/**
			 * Triggers navigation to Order BOM App
			 * @param {object} oBOMItemData: BOM item data
			 * @param {boolean} bOpenInNewTab: opens the navigation target in new tab
			 * @public
			 * @function
			 */
			navigateToBOMApp: function (oBOMItemData, bOpenInNewTab) {
				var bServiceAvailable = !!(sap.ushell && sap.ushell.Container &&
					sap.ushell.Container.getService &&
					sap.ushell.Container.getService("CrossApplicationNavigation"));

				if (bServiceAvailable) {
					var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
					var sHash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
						target: {
							semanticObject: "SalesOrderBOM",
							action: "maintenance"
						},
						params: this._getParamsForBOMAppNavigation(oBOMItemData)
					})) || "";

					if (bOpenInNewTab) {
						sap.m.URLHelper.redirect(window.location.href.split("#")[0] + sHash, true);
					} else {
						// eslint-disable-next-line sap-cross-application-navigation
						sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({
							target: {
								shellHash: sHash
							}
						});
					}
				}
			},

			/**
			 * Get required parameters for navigation to Order BOM App to edit
			 * the BOM of the given item.
			 * @param {object} oBOMItemData: BOM item data
			 * @returns {object} required parameters
			 * @private
			 * @function
			 */
			_getParamsForBOMAppNavigation: function (oBOMItemData) {

				var oBOMNodeHader = oBOMItemData[Constants.navigationProperty.BOMNodeHeader];
				var oParams = {
					"EngineeringChangeDocument": "",
					"BillOfMaterialCategory": oBOMNodeHader.BOMCategory,
					"BillOfMaterialVersion": "",
					"BillOfMaterialVariant": oBOMNodeHader.BOMVariant,
					"BillOfMaterial": oBOMNodeHader.BillOfMaterialInternalID,
					"DraftUUID": oBOMNodeHader.BOMHeaderDraftUUID,
					"preferredMode": "edit",
					"IsActiveEntity": false
				};

				if (oBOMNodeHader.BOMHeaderDraftUUID !== Constants.BlankDraftUUID &&
					oBOMNodeHader.BillOfMaterialInternalID === Constants.BlankBillOfMaterialId) {

					// Order BOM not yet saved, only draft
					oParams.Material = "";
					oParams.Plant = "";

				} else if (oBOMNodeHader.BillOfMaterialInternalID !== Constants.BlankBillOfMaterialId) {

					// Order BOM saved, no draft (else Oder BOM saved with draft, IsActiveEntity stays false)
					if (oBOMNodeHader.BOMHeaderDraftUUID === Constants.BlankDraftUUID) {
						oParams.IsActiveEntity = true;
					}
					oParams.Material = oBOMItemData.BOMComponentName;
					oParams.Plant = oBOMItemData.Plant;
				}

				return oParams;
			},

			/**
			 * Process of navigation to the top page of Routing Tree Container
			 * @private
			 */
			_backToTopOfRouting: function () {
				var oRoutingTreeContainer = this.getRoutingTreeContainer();
				var aRoutingPages = oRoutingTreeContainer.getPages();

				oRoutingTreeContainer.backToTop();

				// Remove all routing pages instead of the first one
				$.each(aRoutingPages, function (iIndex, oPage) {
					// First Page should not be removed as we go back to it
					if (iIndex !== 0) {
						oRoutingTreeContainer.removePage(oPage);

						if ($.isFunction(oPage.destroy)) {
							oPage.destroy();
						}
					}
				});
			},

			/**
			 * Adds Routing Tree Page
			 * @param {String} sRoutingPageType - Routing Model Type SubPage/Base
			 * @param {Object} oRoutingObject - Caller RoutingObject
			 * @param {sap.i2d.lo.lib.zvchclfz.components.structurepanel.model.RoutingTreeModel} [oRoutingTreeModel] - Created instance of RoutingTreeModel
			 * @private
			 */
			_addRoutingTreePage: function (sRoutingPageType, oRoutingObject, oRoutingTreeModel) {
				var oOwnerComponent = this.getOwnerComponent();

				if (oOwnerComponent) {
					// This set the Component as the Owner for View
					// It is needed for the external navigation
					oOwnerComponent.runAsOwner(function () {
						var oView = sap.ui.xmlview(Constants.view.routingTree + "-" + uid(), {
							viewName: Constants.view.routingTree,
							height: "100%",
							viewData: oRoutingObject
						});
						var oViewCtrl = oView.getController();

						if ($.isFunction(oViewCtrl.setRoutingModel)) {
							oViewCtrl.setRoutingModel(oRoutingTreeModel ?
								oRoutingTreeModel : new RoutingTreeModel(sRoutingPageType, oRoutingObject));
						}

						this.getRoutingTreeContainer()
							.addPage(oView)
							.to(oView);

						this._onAfterNavigationTo(oViewCtrl);
					}.bind(this));
				}
			},

			/**
			 * To be triggered on After navigation to the Controller
			 * @param {sap.ui.core.mvc.Controller} oController - View Controller
			 * @private
			 */
			_onAfterNavigationTo: function (oController) {
				if (oController &&
					$.isFunction(oController.onAfterNavigationTo)) {
					oController.onAfterNavigationTo();
				}
			},

			/**
			 * Returns Routing Page using Bill of Operations Sequence
			 * @param {Object} sBillOfOperationsSequence - RoutingObject bill of operations sequence
			 * @returns {Object} RoutingPage
			 * @private
			 */
			_getRoutingPageByBOOSequence: function (sBillOfOperationsSequence) {
				var aRoutingPages = $.grep(this.getRoutingTreeContainer().getPages(), function (oElement) {
					return oElement.getViewData().BillOfOperationsSequence === sBillOfOperationsSequence;
				});

				return aRoutingPages.length > 0 ? aRoutingPages[0] : undefined;
			},

			/**
			 * Returns RoutingTree Controller of the currently selected Routing Tree Page
			 * @returns {sap.i2d.lo.lib.zvchclfz.components.structurepanel.controller.RoutingTree} Routing Tree controller
			 * @private
			 */
			_getCurrentRoutingPageController: function () {
				var oCurrentRoutingPage = this.getRoutingTreeContainer().getCurrentPage();

				return oCurrentRoutingPage ? oCurrentRoutingPage.getController() : undefined;
			},

			/**
			 * Re-explode the Routing of the current page
			 * @private
			 */
			_reexplodeCurrentRoutingPage: function () {
				var oCurrentController = this._getCurrentRoutingPageController();

				if ($.isFunction(oCurrentController.explodeRouting)) {
					oCurrentController.explodeRouting();
				}
			}
		});

	return new NavigationManager();
});
