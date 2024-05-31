/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/EventProvider",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/NavigationHandler",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/NavigationManager",
	"sap/i2d/lo/lib/zvchclfz/common/util/XMLFragmentCache",
	"sap/ui/core/mvc/Controller"
], function (EventProvider, InspectorModel, NavigationHandler, NavigationManager, XMLFragmentCache, Controller) {
	"use strict";

	return Controller.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.controller.InspectorFrame", {
		/**
		 * Variable for store the status of navigation of NavContainer
		 * @type {Boolean}
		 * @private
		 */
		_isNavigationInProgress: false,

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time
		 * initialization.
		 * @public
		 */
		onInit: function () {
			// setup navigation manager
			NavigationManager.setContainer(this.byId("idInspectorNavContainer"));
			NavigationManager.setNavigationHandler(new NavigationHandler(this));
			EventProvider.attachSetFocusOnHeader(this.onSetFocusOnHeader, this);
			EventProvider.attachNavigateBack(this.onBackPressed, this);
		},
		/**
		 * Event handler to detach assigned events
		 * @public
		 */
		onExit: function () {
			EventProvider.detachSetFocusOnHeader(this.onSetFocusOnHeader, this);
			EventProvider.detachNavigateBack(this.onBackPressed, this);
		},

		/**
		 * Event handler for close the component
		 * @public
		 */
		onClosePressed: function () {
			this.getOwnerComponent().fireClosePanelPressed();
		},

		/**
		 * Event handler for navigate back to the previous page
		 * @public
		 */
		onBackPressed: function () {
			NavigationManager.navigateBack();
			this._refreshBackButtonStatus();
			EventProvider.fireSetFocusOnHeader();
		},

		/**
		 * Event handler for the change between inspector and trace view
		 * @public
		 */
		onSelectedViewChanged: function () {
			this._refreshBackButtonStatus();

			if (InspectorModel.isInspectorViewSelected() && !InspectorModel.compareLastAccessedAndNavigatedTo()) {
				this.getOwnerComponent().updateNavigationManager();
			}

			if (InspectorModel.isComparisonViewSelected()) {
				EventProvider.fireInitComparison({
					configurationContextId: InspectorModel.getProperty("/ConfigurationContextId")
				});
			}
		},

		/**
		 * Event handler for the navigation of the NavContainer
		 * @public
		 */
		onNavigate: function () {
			this._isNavigationInProgress = true;
			this._refreshBackButtonStatus();
		},

		/**
		 * Event handler for the end of navigation of the NavContainer
		 * @public
		 */
		onAfterNavigate: function () {
			this._isNavigationInProgress = false;
			this._refreshBackButtonStatus();
		},

		/**
		 * Event handler for the change of the trace switch
		 * @public
		 */
		onTraceSwitchChange: function () {
			if (InspectorModel.getProperty("/isTraceOn")) {
				EventProvider.fireActivateTrace();
			} else {
				EventProvider.fireDeactivateTrace();
			}
		},
		
		/**
		 * Event handler for the comparison settings button
		 * @param {sap.ui.base.Event} oEvent - event
		 * @public
		 */
		onComparisonSettingsPressed: function (oEvent) {
			var oPopover = XMLFragmentCache.createFragment("vchclf_diff_settings_popover", "sap/i2d/lo/lib/zvchclfz/components/inspector/fragment/ComparisonSettingsPopover", this);
			this.getView().addDependent(oPopover);
			oPopover.openBy(oEvent.getSource());
		},
		
		/**
		 * Event handler for the comparison restriction active switch
		 * @public
		 */
		onChangeComparisonRestrictionActive: function() {
			EventProvider.fireResetComparison();
		},

		/**
		 * Enable/disable the navigate back button
		 * @private
		 */
		_refreshBackButtonStatus: function () {
			var oCurrentPage = NavigationManager.getContainer().getCurrentPage();

			if (!this._isNavigationInProgress && oCurrentPage && InspectorModel.isInspectorViewSelected() &&
				!oCurrentPage.getModel("__viewData").getProperty("/isInitialPage")) {
				InspectorModel.setProperty("/isBackEnabled", true);
			} else {
				InspectorModel.setProperty("/isBackEnabled", false);
			}
		},

		/**
		 * Event handler to set the focus onto the segmented button in the Inspector header
		 * @public
		 */
		onSetFocusOnHeader: function () {
			var oSegmentedButton = this.getView().byId("idInspectorSegmentedButton");

			setTimeout(function () {
				oSegmentedButton.focus();
			}, 0);
		}
	});
});
