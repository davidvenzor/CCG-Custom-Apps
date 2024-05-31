/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/valuation/controller/fragment/Base",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/factory/GroupFactory",
	"sap/i2d/lo/lib/zvchclfz/common/util/AppEvents",
	"sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/m/VBox",
	"sap/m/IconTabFilter"
], function (Base, GroupFactory, AppEvents, Constants, VBox, IconTabFilter) {
	"use strict";

	/**
	 * Base controller for groups fragments
	 * 
	 * @class
	 * @abstract
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias ap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragments.CharacteristicGroupsBase
	 * @extends sap.i2d.lo.lib.zvchclfzz.components.valuation.controller.fragment.Base
	 */
	return Base.extend("sap.i2d.lo.lib.zvchclfzz.components.valuation.controller.fragment.group.CharacteristicGroupsBase", { /** @lends sap.ui.base.ManagedObject.prototype */
		metadata: {
			"abstract": true
		},

		_aGrids: null,
		_oGroupFactory: null,

		/**
		 * @override
		 */
		init: function () {
			this._aGrids = [];
			Base.prototype.init.apply(this, arguments);
			AppEvents.EVALUATE_CSTICS_GEOMETRY.subscribe(this.onEvaluateCsticsGeometry, this);
		},

		/**
		 * @override
		 */
		exit: function () {
			this.setView(null);
			if (this._oGroupFactory) {
				this._oGroupFactory.destroy();
			}
			delete this._oGroupFactory;
			delete this._aGrids;
			AppEvents.EVALUATE_CSTICS_GEOMETRY.unsubscribe(this.onEvaluateCsticsGeometry, this);
			Base.prototype.exit.apply(this, arguments);
		},

		/**
		 * @private
		 */
		_getGroupFactory: function () {
			if (!this._oGroupFactory) {
				this._oGroupFactory = new GroupFactory({
					dataModel: this.getDataModel(),
					viewModel: this.getViewModel(),
					valuationDAO: this.getValuationDAO(),
					view: this.getView(),
					settingsModel: this.getSettingsModel(),
					groupState: this.getGroupState()
				});
			}
			return this._oGroupFactory;
		},
		
		/**
		 * Handler is called when model changes for CharacteristicsGroups binding
		 * 
		 * @param {sap.ui.base.Event} oEvent The causing event
		 * @private
		 */
		onGroupDataChangedWithoutSuspend: function (oEvent) {
			var iNumberOfGroups = oEvent.getSource().getContexts().length;
			this._setGroupTitleVisibility(iNumberOfGroups);
			this._setNoCharacteristicTextVisibility(iNumberOfGroups);
		},
		
		/**
		 * Event handler for evaluation of cstics geometry after value assignment - decision whether all cstics must be re-created via binding refresh
		 * @param {String} sChannelId - id of the application event channel
		 * @param {String} sEventId - event id
		 * @param {Object} mData - event data object
		 * @private
		 */
		onEvaluateCsticsGeometry: function(sChannelId, sEventId, mData) {
			if (this._aGrids) {
				var oForm = this._getForm(mData.groupId);
				if (this.getModel("view").hasCharacteristicsGeometryChanged(mData.groupId)) {
					oForm.getBinding("items").refresh(true);
				}
			} else {
				throw Error("Cannot evaluate cstics geometry on a destroyed object.");
			}
		},
		
		/**
		 * Return the valuation form for the given group
		 * @param {integer} iGroupId - id of the group
		 * @return {sap.ui.core.Control} - the valuation form
		 * @private
		 */
		_getForm: function(iGroupId) {
			var oCtx;
			var oGroup;
			for (var i = 0; this._aGrids.length > i; i++) {
				oCtx = this._aGrids[i].getBindingContext("view");
				oGroup = this.getModel("view").getProperty(oCtx.getPath());
				if (oGroup.GroupId === iGroupId) {
					return this._aGrids[i];
				}
			}
		},

		/**
		 * @private
		 */
		onCsticsReceived: function (oEvent) {
			//handle group state
			var oSource = oEvent.getSource();
			var sGroupEntityPath = oSource.getContext().getPath();

			var oGroupData = this.getDataModel().getProperty(sGroupEntityPath);
			var oCurrentGroupState = this.getGroupState().getState(oGroupData);

			var iCurrentBindingLength = oCurrentGroupState.bindingInfo.length;

			var iCsticCount = oSource.getLength();
			
			var sGridId;

			var oOriginGrid;
			for (var x = 0; this._aGrids.length > x; x++) {
				var oFlexBoxBinding = this._aGrids[x].getBinding("items");
				if (oFlexBoxBinding) {
					var sGridGroupPath = oFlexBoxBinding.getContext().getPath();

					if (sGridGroupPath === sGroupEntityPath) {
						//form binding matches received data binding => issuing form found
						oOriginGrid = this._aGrids[x];
						var aCustomData = this._aGrids[x].getCustomData();
						

						for (var b = 0; aCustomData.length > b; b++) {
							switch (aCustomData[b].getKey()) {
							case "formId":
								sGridId = aCustomData[b].getValue();
								break;
							}
						}
						break;
					}
				}
			}

			if (oOriginGrid) {
				var sId = oOriginGrid.getId();
				var iPrefixLength = sId.length - sGridId.length;
				var sPrefix = sId.substring(0, iPrefixLength);
				var oButton = sap.ui.getCore().byId(sPrefix + "PagingSeeMore");

				if (!oButton) {
					return;
				}

				if (iCurrentBindingLength < iCsticCount) {
					oButton.setVisible(true);
				} else {
					oButton.setVisible(false);
				}
			}
		},

		/**
		 * Factory for the characteristic groups. Called by the aggregation binding to create a characteristic group.
		 * 
		 * @param {string} sId: the id of the control
		 * @param {object} oContext: the cstic context to resolve the fragment for.
		 * @return {sap.ui.layout.form.FormElement} the created form form element object
		 * @private
		 */
		characteristicGroupFactory: function (sId, oContext, sFragment) {
			this._updateFormsCacheIfNeeded(oContext);

			// We use a factory to get better IDs. When we embed the group directly in Valuation.view.xml all IDs get duplicated
			var oFragment = this._getGroupFactory().create(sId, sFragment);
			var oGrid;

			var sInstanceId = oContext.getProperty("InstanceId");
			var sGroupId = oContext.getProperty("GroupId");
			var sAppStateBindingPath = "/instances/" + sInstanceId + "/groups/" + sGroupId;

			/**
			 * If the app is initialized, Group 1 of the current Instance is already stored in App State Model
			 * and has Status 'loaded', do not reset its status to 'not loaded'
			 */
            var mGroup = this.getModel("appStateModel").getGroup(sInstanceId, sGroupId);
            if (!mGroup) {
            	this.getModel("appStateModel").setGroup(sInstanceId, sGroupId);	
            }

			oFragment.bindObject({
				path: "appStateModel>" + sAppStateBindingPath
			});
			oFragment.bindObject({
				path: "groupCsticCounts>" + "/GroupCsticCounts/" + sGroupId
			});

			if (oFragment instanceof VBox) {
				// referring to CharacteristicGroupEmbedded.fragment.xml
				oGrid = oFragment.getItems()[1];
			} else if (oFragment instanceof IconTabFilter){
				// referring to CharacteristicGroupFullScreen.fragment.xml
				// oGrid = oFragment.getContent()[0].getContent()[0].getItems()[0];
				
				oGrid = oFragment.getItems()[1];
			} else {
				throw Error("Unhandled fragment control type '" + oFragment.getMetadata().getName())+ "'.";
			}


			var fnOriginDestroy = oGrid.destroy;			
			var fnRemoveGrid = function(oGrid) {
				var iToRemove = -1;
				if (this._aGrids) {
					for (var i=0; i < this._aGrids.length; i++) {
						if (this._aGrids[i].getId() === oGrid.getId()) {
							iToRemove = i;
							break;
						}
					}
					if (iToRemove > -1) {
						this._aGrids.splice(iToRemove, 1);
					}
				}
			}.bind(this);
			
			// when the grid becomes destroyed, its reference in _aGrids array must be deleted
			oGrid.destroy = function() {
				fnRemoveGrid(this);
				fnOriginDestroy.apply(this);
			}.bind(oGrid);
			this._aGrids.push(oGrid);

			var oGroupData = oContext.getObject();

			var oBindingInfo = oGrid.getBindingInfo("items");

			var oGroupState = this.getGroupState().getState(oGroupData);
			if (oGroupState.bindingInfo) {
				oBindingInfo = oGroupState.bindingInfo;
			}

			oBindingInfo.events = {
				dataReceived: this.onCsticsReceived.bind(this)
			};

			oFragment.bindObject({
				path: "characteristicGroupState>/" + this.getGroupState().getKey(oGroupData)
			});

			oGrid.bindAggregation("items", oBindingInfo);

			this.getGroupState().setState(oGroupData, {
				bindingInfo: oBindingInfo
			});

			return oFragment;
		},

		/**
		 * @private
		 */
		_setNoCharacteristicTextVisibility: function (iGroups) {
			this.getSettingsModel().setProperty("/showNoCharacteristicText", !iGroups);
		},

		/**
		 * @private
		 */
		_setGroupTitleVisibility: function (iGroups) {
			this.getSettingsModel().setProperty("/showGroupTitle", iGroups > 1);
		},

		/**
		 * Returns the component model instance. The component model holds information for the configuration of the component.
		 * The component model is only available when a template is used.
		 * 
		 * @return {sap.ui.model.json.JSONModel} the model instance
		 * @private
		 */
		_getCompModel: function () {
			return this.getView().getModel("component");
		},

		/**
		 * if the given context has keys which match with context keys of an existing form the form will be dropped
		 * otherwise the form will be kept 
		 * 
		 * @param {sap.ui.model.Context} oContext: The Context is a pointer to an object in the model data, which is used to allow definition of relative bindings, which are resolved relative to the defined object. 
		 *							 Context elements are created either by the ListBinding for each list entry or by using createBindingContext.
		 * @function
		 * @private
		 */
		_updateFormsCacheIfNeeded: function (oContext) {
			var fnGetGroupKey = function (oGroupContext) {
				var oGroupData = oGroupContext.getObject();
				if (!oGroupData) {
					return null;
				}
				return oGroupData.ContextId + "/" + oGroupData.InstanceId + "/" + oGroupData.GroupId;
			};
			var sGroupKey = fnGetGroupKey(oContext);
			this._aGrids.forEach(function (oForm, index) {
				var sOldGroupKey = fnGetGroupKey(oForm.getBindingContext(Constants.VIEW_MODEL_NAME));
				if (!sOldGroupKey || sGroupKey === sOldGroupKey) {
					this._aGrids.splice(index, 1);
				}
			}.bind(this));
		}
	});

}, /* bExport= */ true);
