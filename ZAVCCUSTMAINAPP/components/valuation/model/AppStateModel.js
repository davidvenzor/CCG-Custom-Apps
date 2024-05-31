/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([
	"jquery.sap.global",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/message/Message"
], function (jQuery, JSONModel, Message) {
	"use strict";

	/**
	 * The App state model is responsible for buffering the current state of the sapp, e.g. the current paging of a group, 
	 * the current selected group of an instance, filters, undo/redo chain
	 *
	 * @param {sap.i2d.lo.lib.zvchclfz.components.valuation.dao.ValuationDAO} oDAO The valuation Data Acces Object to retrieve and sync the data from
	 * @param {object} [oData] an object for custom data
	 * @author SAP SE
	 * @version 9.0.1
	 * @private
	 * @alias sap.i2d.lo.lib.zvchclfz.components.valuation.model.AppStateModel
	 * @extends sap.ui.model.json.JSONModel
	 */
	var SEE_LESS_THRESHOLD = 30;
	var AppStateModel = JSONModel.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.model.AppStateModel", {

		_sInstanceId: null,

		/**
		 * Set skip and top to default values
		 * Set empty array for ui filters once
		 * 
		 */
		initModel: function () {
			this.resetSkipTop();
			this._resetSelectedGroups();
			this.resetLoadedGroups();
			this._resetTimestamps();
			if (this.hasFilters()) {
				return;
			}
			this.resetFilters();
		},

		/**
		 * @param {String} iGroupId - Group identifier (must be unique within the app)
		 */
		setChangeTimestampForGroup: function (sInstanceId, sGroupId, sTimestamp) {
			var oGroup = this.getGroup(sInstanceId, sGroupId);
			if (!oGroup) {
				oGroup = this.setGroup(sInstanceId, sGroupId);
			}
			oGroup.changeTimestamp = sTimestamp;
			this.setProperty(this._getGroupPath(sGroupId), oGroup);
		},

		/**
		 * @param {String} iGroupId - Group identifier (must be unique within the app)
		 */
		getChangeTimestampForGroup: function (sInstanceId, sGroupId) {
			var oGroup = this.getGroup(sInstanceId, sGroupId);
			if (oGroup) {
				return oGroup.changeTimestamp;
			}
			return undefined;
		},

		/**
		 * Sets the binding path for the model
		 * @param {String} sInstanceId - the current instance id of the valuation component
		 */
		_setInstanceId: function (sInstanceId) {
			this._sInstanceId = sInstanceId;
			var oData = this.getData();
			if (!oData.instances) {
				oData.instances = [];
				this.setData(oData, true);
			}
			if (!oData.instances[sInstanceId]) {
				oData.instances[sInstanceId] = {
					groups: [],
					selectedGroup: null
				};
				this.setData(oData, true);
			}
		},

		resetSkipTop: function () {
			var aInstances = this.getInstances();

			for (var sInstanceId in aInstances) {
				var aGroups = aInstances[sInstanceId].groups;
				for (var sGroupId in aGroups) {
					var oGroup = aGroups[sGroupId];
					oGroup.skip = 0;
					oGroup.top = SEE_LESS_THRESHOLD;
				}
			}
		},

		/**
		 * @private
		 * Sets the selected group back to the initial state in all instances
		 */
		_resetSelectedGroups: function () {
			var aInstances = this.getProperty("/instances");
			for (var sInstanceId in aInstances) {
				aInstances[sInstanceId].selectedGroup = null;
			}
		},

		/**
		 * @private
		 * Sets the selected group back to the initial state in all instances
		 */
		_resetTimestamps: function () {
			var aInstances = this.getInstances();

			for (var sInstanceId in aInstances) {
				var aGroups = aInstances[sInstanceId].groups;
				for (var sGroupId in aGroups) {
					var oGroup = aGroups[sGroupId];
					oGroup.changeTimestamp = undefined;
				}
			}
		},

		resetFilters: function () {
			var oData = this.getData();
			oData.filters = [];
			this.setData(oData);
		},

		getGroup: function (sInstanceId, sGroupId) {
			this._setInstanceId(sInstanceId);
			var oGroup = this.getProperty(this._getGroupPath(sGroupId));
			return oGroup;
		},

		getGroups: function (sInstanceId) {
			this._setInstanceId(sInstanceId);
			return this.getProperty(this._getGroupsPath());
		},

		getGroupLoaded: function (sInstanceId, sGroupId) {
			this._setInstanceId(sInstanceId);
			var oGroup = this.getProperty(this._getGroupPath(sGroupId));
			if (oGroup) {
				return oGroup.loaded;
			} else {
				return false;
			}
		},

		setGroupLoaded: function (sInstanceId, sGroupId, bLoaded) {
			var oGroup = this.getGroup(sInstanceId, sGroupId);
			oGroup.loaded = bLoaded;
			this.setProperty(this._getGroupPath(sGroupId), oGroup);
		},

		/** Sets the group state for a given group Id
		 * @param {String} sGroupId - Group Id
		 * @param {Map} mGroupState - Map for Group State
		 * @param {Number} mGroupState.top - Paging Top
		 * @param {Number} mGroupState.skip - Paging Skip
		 */
		setGroup: function (sInstanceId, sGroupId, mGroupState) {
			var oGroup = this.getGroup(sInstanceId, sGroupId);
			if (!oGroup) {
				oGroup = {
					top: SEE_LESS_THRESHOLD,
					skip: 0,
					loaded: false
				};
			}
			if (mGroupState) {
				oGroup.top = mGroupState.top;
				oGroup.skip = mGroupState.skip;
				oGroup.loaded = mGroupState.loaded;
			}
			this.setProperty(this._getGroupPath(sGroupId), oGroup);
			return oGroup;
		},

		getSelectedGroup: function (sInstanceId) {
			this._setInstanceId(sInstanceId);
			return this.getProperty(this._getSelectedGroupPath()) || 1;
		},

		setSelectedGroup: function (sInstanceId, sGroupId) {
			var oGroup = this.getGroup(sInstanceId, sGroupId);
			if (oGroup) {
				this.setProperty(this._getSelectedGroupPath(), sGroupId);
			}
		},

		resetLoadedGroups: function () {
			var aInstances = this.getInstances();
			for (var iInstanceId in aInstances) {
				var aGroups = this.getGroups(iInstanceId);
				for (var iGroupId in aGroups) {
					this.setGroupLoaded(iInstanceId, iGroupId, false);
				}
			}
		},
		
		hasFilters: function () {
			return (this.getData().filters && this.getData().filters.length > 0);
		},

		/**
		 * @private
		 */
		_getInstanceId: function () {
			return "/instances/" + this._sInstanceId;
		},

		/**
		 * @private
		 */
		_getSelectedGroupPath: function () {
			return this._getInstanceId() + "/selectedGroup";
		},

		/**
		 * @private
		 */
		_getGroupsPath: function () {
			return this._getInstanceId() + "/groups";
		},

		/**
		 * @private
		 */
		_getGroupPath: function (sGroupId) {
			return this._getGroupsPath() + "/" + sGroupId;
		},

		getInstances: function () {
			return this.getProperty("/instances");
		}
	});

	return AppStateModel;
});
