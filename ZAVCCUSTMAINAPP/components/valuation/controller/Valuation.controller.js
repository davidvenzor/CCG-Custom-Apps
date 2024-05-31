/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/factory/CharacteristicFactory",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/factory/GroupsFactory"
], function(Controller, Constants, CharacteristicFactory, GroupsFactory, ValuationDAO, GroupState) {
	"use strict";

	/**
	 * The controller for the valuation view.
	 * 
	 * @class
	 
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.zvchclfz.components.valuation.controller.Valuation
	 * @extends sap.ui.core.mvc.Controller
	 */
	return Controller.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.controller.Valuation", { /** @lends sap.i2d.lo.lib.zvchclfz.components.valuation.controller.Valuation.prototype */

		_oCharacteristicFactory: null,
		_oGroupsFactory: null,
		_oViewModel : null,

		onExit: function() {
			if (this._oCharacteristicFactory) {
				this._oCharacteristicFactory.destroy();
			}
			if (this._oGroupsFactory) {
				this._oGroupsFactory.destroy();
			}
			delete this._oViewModel;
			delete this._oValuationDAO;
			delete this._oGroupState;
		},

		groupsFactory: function(sId, oContext) {
			if (!this._oGroupsFactory) {
				this._oGroupsFactory = new GroupsFactory({
					dataModel: this._getDataModel(),
					viewModel: this._getViewModel(),
					valuationDAO: this.getValuationDAO(),
					view: this.getView(),
					settingsModel: this._getSettingsModel(),
					groupState: this._getGroupState()
				});
			}
			return this._oGroupsFactory.create(sId, oContext);
		},

		/**
		 * Returns instance of Control Selection Factory
		 * @return {sap.i2d.lo.lib.zvchclfz.components.valuation.util.CharacteristicFactory} instance of Control Selection Factory
		 * @public
		 * @function
		 */
		getCharacteristicFactory: function() {
			if (!this._oCharacteristicFactory) {
				this._oCharacteristicFactory = new CharacteristicFactory({
					dataModel: this._getDataModel(),
					viewModel: this._getViewModel(),
					valuationDAO: this.getValuationDAO(),
					view: this.getView(),
					settingsModel: this._getSettingsModel(),
					groupState: this._getGroupState()
				});
			}
			return this._oCharacteristicFactory;
		},

		/** Returns Instance of Valuation DAO using internal function
		 *
		 * @return {sap.i2d.lo.lib.zvchclfz.components.valuation.dao.ValuationDAO} instance of Valuation DAO
		 * @function
		 * @protected
		 */
		getValuationDAO: function() {
			return this._oValuationDAO;
		},

		/**
		 * Sets the instance of valuation DAO for data access
		 * @param {sap.i2d.lo.lib.zvchclfz.components.valuation.dao.ValuationDAO} oValuationDAO instance of Valuation DAO
		 * @public
		 */
		setValuationDAO : function(oValuationDAO) {
			this._oValuationDAO = oValuationDAO;
		},

		/**
		 * Sets the instance of group state
		 * @param {sap.i2d.lo.lib.zvchclfz.components.valuation.util.GroupState} oGroupState instance of GroupState class
		 * @public
		 */
		setGroupState : function(oGroupState) {
			this._oGroupState = oGroupState;
			this.getView().setModel(oGroupState.getStateModel(), "characteristicGroupState");
		},

		/**
		 * Returns instance of GroupState 
		 * @return {sap.i2d.lo.lib.zvchclfz.components.valuation.util.GroupState} instance of GroupState class
		 * @private
		 * @function
		 */
		_getGroupState : function() {
			return this._oGroupState;
		},

		/**
		 * Sets the instance of the view model which should be used in the valuation controller
		 * @param {sap.i2d.lo.lib.zvchclfz.components.valuation.model.ViewModel} instance of ViewModel class
		 * @public
		 */
		setViewModel : function(oViewModel) {
			this._oViewModel = oViewModel;
		},
		
		/**
		 * Returns instance of the view model 
		 * @return {sap.i2d.lo.lib.zvchclfz.components.valuation.model.ViewModel} instance of ViewModel class
		 * @private
		 * @function
		 */
		_getViewModel : function() {
			return this._oViewModel;
		},


		/**
		 * called from the filter status toolbar 
		 * @public
		 */
		openFilterDialog: function(oEvent) {
			var oFilterStatus = oEvent.getSource();
			oFilterStatus.getFilterDialog().open();
		},

		/**
		 * called from filter status view to remove the backend filter
		 * @public
		 */
		removeFilter: function(oEvent) {
			oEvent.cancelBubble();
			var oOveflowToolBar = oEvent.getSource().getParent();
			var oFilterButton = oOveflowToolBar.getFilterDialog().getSource();
			oFilterButton.focus();
			this.getOwnerComponent().removeCharacteristicFilter();
		},

		/* Returns the VCHCF model instance which is set on the view.
		 * 
		 * @return {sap.ui.model.odata.v2.ODataModel} the model instance
		 * @private
		 */
		_getDataModel: function() {
			return this._getModel(Constants.VCHCLF_MODEL_NAME);
		},

		/**
		 * @private
		 */
		_getSettingsModel: function() {
			return this._getModel(Constants.VALUATION_SETTINGS_MODEL_NAME);
		},

		/**
		 * @private
		 */
		_getModel: function(sModelName) {
			return this.getView().getModel(sModelName);
		}
	});
});
