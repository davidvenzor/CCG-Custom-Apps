/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/valuation/factory/FactoryBase",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/control/characteristic/Characteristic",
	"sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/ui/core/CustomData",
	"sap/ui/model/json/JSONModel"
], function (FactoryBase, Characteristic, Constants, CustomData, JSONModel) {
	"use strict";

	/**
	 * 
	 */
	return FactoryBase.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.factory.CharacteristicFactory", {

		init: function () {
			FactoryBase.prototype.init.apply(this, arguments);
			this._mCharacteristicsMap = {};
		},

		exit: function () {
			FactoryBase.prototype.exit.apply(this, arguments);
			delete this._mCharacteristicsMap;
		},

		/**
		 * Creates and adds a given characteristic ui control and its binding path to the internal map
		 * @param {string} sIdPrefix: Prefix for stable control id
		 * @param {sap.ui.model.Context} oContext: Binding context for creating control.
		 * @param {boolean} ?bEditable: sets control either into edit or display mode 
		 * @return {sap.m.FlexBox} FlexBox instance 
		 * @private
		 * @function
		 */
		create: function (sIdPrefix, oContext, bEditable) {
			if (!oContext) {
				//Context is required
				return null;
			}
			this._oContext = oContext;
			var sControlId = this._createControlId(sIdPrefix, oContext);
 
			var oControl = new Characteristic(sControlId, {
				editable : typeof bEditable !== "undefined" ? bEditable :  "{valuationSettings>/editable}",
				valuationDAO: this.getValuationDAO(),
				groupBindingContext: this._getCharacteristicGroupBindingContext(),
				settingsModel: this.getSettingsModel(),
			    groupRepresentation : this._getValuationComponent().getGroupRepresentation(),
			    embedderName : this._getValuationComponent().getEmbedderName()
			});

			if (oControl && oContext) {
				this._addControlToCharacteristicsMap(oControl, this.getValuationDAO().createCharacteristicKey(oContext.getObject()));
			}

			return oControl;
		},

		/**
		 * Determines a characteristic by path and returns its control instance 
		 * @param {string} sPath: Path to a certain characteristic entity 
		 * @return {sap.ui.core.Control} Instance of an ui control that represents a characteristic
		 * @public
		 * @function
		 */
		getCharacteristicControlByPath: function (sPath) {
			return this._getCharacteristicsMap()[sPath];
		},
		
		
		/**
		 * @private
		 * Is used for CharacteristicGroupsBase and CharacteristicBase
		 */
		_getCharacteristicGroups: function() {
			return this.getView().byId("groupVBox-0--groups");
		},

		/**
		 * @private
		 * Is used for CharacteristicGroupsBase and CharacteristicBase
		 */
		_getCharacteristicGroupsBinding: function() {
			var oGroups = this._getCharacteristicGroups();
			if (oGroups) {
				return oGroups.getBinding("items");
			}
		},

		/**
		 * @private
		 */
		_getCharacteristicGroupBindingContext: function() {
			return this._getCharacteristicGroupsBinding().getContext();
		},


		/**
		 * Adds a given characteristic ui control and its binding path to the internal map
		 * @param {sap.ui.core.Control} oControl: Instance of an ui control that represents a characteristic 
		 * @param {string} sBindingPath: Path to a certain characteristic entity 
		 * @private
		 * @function
		 */
		_addControlToCharacteristicsMap: function (oControl, sPath) {
			this._getCharacteristicsMap()[sPath] = oControl;
		},

		/**
		 * Gets internal map that contains characteristic ui controls and its binding path
		 * @return {array} contains objects with characteristic ui control and its binding path
		 * @private
		 * @function
		 */
		_getCharacteristicsMap: function () {
			return this._mCharacteristicsMap;
		},

		/**
		 * @private
		 */
		_createControlId: function (sIdPrefix, oContext) {
			var aIdentifier = [];
			var oData = this._getCharacteristicData(oContext);
			var oSettingsModel = this.getSettingsModel();
			var sObjectKey = "objectKey";
			var sSemanticObject = "semanticObject";
			if (oSettingsModel) {
				sObjectKey = oSettingsModel.getProperty("/objectKey");
				sSemanticObject = oSettingsModel.getProperty("/semanticObject");
			}

			var sInstanceId = oData.InstanceId;
			var sGroupId = oData.GroupId;
			var sCharacteristicId = oData.CsticId;

			aIdentifier.push(sSemanticObject);
			aIdentifier.push(sObjectKey);
			aIdentifier.push(sInstanceId);
			aIdentifier.push(sGroupId);
			aIdentifier.push(sCharacteristicId);

			for (var i = 0; i < aIdentifier.length; i++) {
				var sIdentfier = "" + aIdentifier[i];
				aIdentifier[i] = jQuery.sap.encodeURL(sIdentfier).replace(/\%/g, "perc");
			}

			var sId = aIdentifier.join("::");

			return sIdPrefix + "---" + sId;
		},

		/**
		 * @private
		 */
		_getCharacteristicData: function(oContext) {
			return oContext.getObject();
		},

		/**
		 * @private
		 */
		_getValuationComponent: function () {
			return this.getView().getController().getOwnerComponent();
		}

	});
});
