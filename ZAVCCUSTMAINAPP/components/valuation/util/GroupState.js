/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/ui/model/json/JSONModel"
], function(ManagedObject, JSONModel) {
	"use strict";

	/**
	 * The group state stores all relevant information for a group to restore the UI state after a UI refresh
	 *
	 * @param {string}
	 *            [sId] Optional ID for the new control; generated automatically if
	 *            no non-empty ID is given Note: this can be omitted, no matter
	 *            whether <code>mSettings</code> will be given or not!
	 * @param {object}
	 *            [mSettings] optional map/JSO
	 
	 * @author SAP SE
	 * @version 9.0.1
	 * @private
	 * @alias sap.i2d.lo.lib.zvchclfz.components.valuation.util.GroupState
	 * @extends sap.ui.base.ManagedObject
	 */
	var GroupState = ManagedObject.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.util.GroupState", { /** @lends sap.i2d.lo.lib.zvchclfz.components.valuation.util.GroupState.prototype */

		_oModel: null,

		/**
		 * @override
		 */
		init: function() {
			this._oModel = new JSONModel({});
		},

		/**
		 * @override
		 */
		exit: function() {
			if (this._oModel) {
				this._oModel.destroy();
				delete this._oModel;
			}
		},

		/**
		 * Returns the state model. The state model can be used to bind the state information against a view.
		 * @return {sap.ui.model.json.JSONModel} the state model instance
		 * @public
		 */
		getStateModel: function() {
			return this._oModel;
		},

		initStateModel: function() {
			this._getStateModel().setData({});
		},

		iterateStates: function(fnCallback, oScope) {
			var mStates = this.getStateModel().getData();
			for (var sKey in mStates) {
				var mState = mStates[sKey];
				fnCallback.call(oScope, mState, sKey);
			}
		},

		/**
		 * Sets the state for a certain group.
		 * 
		 * @param {map} mKey The key object, which is defined by the following properties
		 * @param {string} mKey.ContextId The context ID
		 * @param {string} mKey.InstanceId The instance ID
		 * @param {string} mKey.GroupId The group ID
		 * @param {map} mState The state object, which is defined by the following properties
		 * @param {object} mState.bindingInfo The binding object to store
		 * @public
		 */
		setState: function(mKey, mState) {
			var sKey = this.getKey(mKey);
			var mCurrentState = this.getState(mKey);
			this._getStateModel().setProperty("/" + sKey, jQuery.extend(mCurrentState, mState));
		},

		/**
		 * Returns the state of a certain group
		 * 
		 * @param {map} mKey The key object, which is defined by the following properties
		 * @param {string} mKey.ContextId The context ID
		 * @param {string} mKey.InstanceId The instance ID
		 * @param {string} mKey.GroupId The group ID
		 * @param {map} mState The state object, which is defined by the following properties
		 * @param {object} mState.bindingInfo The binding object to store
		 * @public
		 */
		getState: function(mKey) {
			var sKey = this.getKey(mKey);
			return this._getStateModel().getProperty("/" + sKey) || {};
		},

		/**
		 * Returns the stringified key for the given object key 
		 * 
		 * @param {map} mKey The key object, which is defined by the following properties
		 * @param {string} mKey.ContextId The context ID
		 * @param {string} mKey.InstanceId The instance ID
		 * @param {string} mKey.GroupId The group ID
		 * @return {string} The stringified key
		 * @public
		 */
		getKey: function(mKey) {
			var sContextId = mKey.ContextId;
			sContextId = encodeURIComponent(sContextId);
			var sInstanceId = mKey.InstanceId;
			var sGroupId = mKey.GroupId;

			return sContextId + "-" + sInstanceId + "-" + sGroupId;
		},

		_getStateModel: function() {
			return this._oModel;
		}
	});

	return GroupState;
});
