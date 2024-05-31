/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/UiConfig",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/ODataModelHelper",
	"sap/base/Log",
	"sap/base/util/uid",
	"sap/ui/base/ManagedObject"
], function (UiConfig, ODataModelHelper, Log, uid, ManagedObject) {
	"use strict";

	/**
	 * Singleton module for handling navigations inside Inspector component
	 * @public
	 */
	var NavManager = ManagedObject.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.logic.NavigationManager", {

		metadata: {
			properties: {
				container: {
					type: "object"
				}
			}
		},

		/**
		 * Instance of the owner component of the Navigation Manager
		 * @type {sap.ui.core.UIComponent}
		 */
		_ownerComponent: null,

		/**
		 * Instance of the Navigation Handler
		 * @type {sap.i2d.lo.lib.zvchclfz.components.inspector.logic.NavigationHandler}
		 */
		_navigationHandler: null,

		/**
		 * Sets the owner component of the Navigation Manager
		 * @param {sap.ui.core.UIComponent} oComponent - instance of owner component of the Navigation Manager
		 * @public
		 */
		setOwnerComponent: function (oComponent) {
			if (oComponent) {
				this._ownerComponent = oComponent;
			} else {
				Log.error(
					"Missing Owner Component of the Navigation Manager",
					"Please set it as an instance of sap.ui.core.UIComponent",
					"sap.i2d.lo.lib.zvchclfz.components.inspector.logic.NavigationManager");
			}
		},

		/**
		 * Sets the Navigation handler
		 * @param {sap.i2d.lo.lib.zvchclfz.components.inspector.logic.NavigationHandler} oNavigationHandler
		 * 			- instance of the Navigation Handler
		 * @public
		 */
		setNavigationHandler: function (oNavigationHandler) {
			if (oNavigationHandler) {
				this._navigationHandler = oNavigationHandler;
			} else {
				Log.error(
					"Missing the Navigation Handler",
					"Please set it as an instance of sap.ui.base.ManagedObject",
					"sap.i2d.lo.lib.zvchclfz.components.inspector.logic.NavigationManager");
			}
		},

		/**
		 * Returns the Navigation Handler
		 * @returns {sap.i2d.lo.lib.vchclf.components.inspector.logic.NavigationHandler} oNavigationHandler
		 * 			- instance of the Navigation Handler
		 * @public
		 */
		getNavigationHandler: function () {
			return this._navigationHandler;
		},

		/**
		 * Remove the Value Pages or update it if it is opened
		 * @public
		 */
		removeValuePages: function () {
			var oContainer = this.getContainer();
			var sCurrentPage = oContainer.getCurrentPage();

			if (!sCurrentPage) {
				// No page in stack => we can return
				return;
			}

			var sCurrentPageId = sCurrentPage.getId();

			$.each(oContainer.getPages(), function (iIndex, oElement) {
				if (oElement.getViewData().objectType === UiConfig.inspectorMode.objectType.CharacteristicValue) {
					if (oElement.getId() === sCurrentPageId) {
						oElement.getController().reloadContent();
					} else {
						oElement.destroy();
						oContainer.removePage(oElement);
					}
				}
			});
		},

		/**
		 * Reloads the content of pages of NavigationManager
		 * @public
		 */
		reloadContentOfPages: function () {
			$.each(this.getContainer().getPages(), function (iIndex, oElement) {
				var oController = oElement.getController();

				if ($.isFunction(oController.reloadContent)) {
					oController.reloadContent();
				}
			});
		},

		/**
		 * Triggers a navigation to a new page inside the component's NavContainer
		 * @param {String} sObjectPath - Path of the object where the navigation will happen
		 * @param {String} sObjectType - Type of the object where the navigation will happen
		 * @param {Object} [oKeyParameters] - key parameters
		 * @public
		 */
		setRoot: function (sObjectPath, sObjectType, oKeyParameters) {
			var oContainer = this.getContainer();

			// Need to destroy the views, otherwise event handlers are not unregistered
			// if you use the destroyPages method of the Nav Container instead of the
			// removeAllPages, there are rendering issues
			$.each(oContainer.getPages(), function (iIndex, oView) {
				if ($.isFunction(oView.destroy)) {
					oView.destroy();
				}
			});

			oContainer.fireNavigate();
			oContainer.removeAllPages();
			this.navigateTo(sObjectPath, sObjectType, oKeyParameters);
			oContainer.fireAfterNavigate();
		},

		/**
		 * Resets the navigation manager
		 * @public
		 */
		resetRoot: function () {
			var oContainer = this.getContainer();

			$.each(oContainer.getPages(), function (iIndex, oView) {
				if ($.isFunction(oView.destroy)) {
					oView.destroy();
				}
			});

			this.getContainer().removeAllPages();
		},

		/**
		 * Get the content of current page of the NavContainer
		 * @return {Object} content of the current page of the NavContainer
		 * @public
		 */
		getCurrentPageContent: function () {
			var oCurrentPage = this.getContainer().getCurrentPage();

			if (oCurrentPage) {
				return oCurrentPage.getContent()[0];
			} else {
				return null;
			}
		},

		/**
		 * Triggers a navigation to the previous page inside the component's NavContainer
		 * @public
		 */
		navigateBack: function () {
			var oContainer = this.getContainer();
			var oCurrentPageController;

			oContainer.back();

			oCurrentPageController = oContainer.getCurrentPage().getController();

			if ($.isFunction(oCurrentPageController.onAfterNavBack)) {
				oCurrentPageController.onAfterNavBack();
			}
		},

		/**
		 * Triggers a navigation to a new page inside the component's NavContainer
		 * @param {String} sObjectPath - Path of the object where the navigation will happen
		 * @param {String} sObjectType - Type of the object where the navigation will happen
		 * @param {Object} [oKeyParameters] - key parameters
		 * @public
		 */
		navigateTo: function (sObjectPath, sObjectType, oKeyParameters) {
			if (!sObjectPath || !sObjectType) {
				Log.error(
					"Invalid parameters",
					"Object type and Object path are mandatory parameters",
					"sap.i2d.lo.lib.zvchclfz.components.inspector.logic.NavigationManager");

				return;
			}

			var oNavCfg = $.extend(true, {}, UiConfig.objectTypeConfig[sObjectType]);

			if (!oNavCfg) {
				Log.error(
					"Invalid object type",
					"Use the constants defined in sap.i2d.lo.lib.zvchclfz.common.type.InspectorMode",
					"sap.i2d.lo.lib.zvchclfz.components.inspector.logic.NavigationManager");

				return;
			} else {
				oNavCfg.objectType = sObjectType;
				oNavCfg.objectPath = sObjectPath;

				if (!$.isEmptyObject(oKeyParameters)) {
					oNavCfg.objectKeyParameters = oKeyParameters;
				}
			}

			var aPages = $.grep(this.getContainer().getPages(), function (oElement) {
				return oElement.getViewData().objectPath === sObjectPath;
			});

			if (aPages.length > 0) {
				var oController = aPages[0].getController();

				if ($.isFunction(oController.updateSelectedTab)) {
					oController.updateSelectedTab();
				}

				this.getContainer().to(aPages[0]);
			} else {
				oNavCfg.isInitialPage = this.getContainer().getPages().length === 0;

				if (this._ownerComponent) {
					// This set the Component as the Owner for View
					// It is needed for the external navigation
					this._ownerComponent.runAsOwner(function () {
						var oView = sap.ui.xmlview(oNavCfg.baseView + "-" + uid(), {
							viewName: oNavCfg.baseView,
							viewData: oNavCfg,
							height: "100%"
						});
						var oViewCtrl = oView.getController();

						oView.setModel(ODataModelHelper.getModel());

						this.getContainer().addPage(oView).to(oView);

						if ($.isFunction(oViewCtrl.onNavigatedTo)) {
							oViewCtrl.onNavigatedTo();
						}
					}.bind(this));
				}
			}
		},

		/**
		 * Clean up
		 * @public
		 */
		teardown: function () {
			this.setContainer(null);
		}

	});

	return new NavManager();
});
