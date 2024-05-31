/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/valuation/controller/fragment/Base",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/control/characteristic/CharacteristicValueProcessorManager",
	"sap/i2d/lo/lib/zvchclfz/common/util/AppEvents"
], function(Base, CharacteristicValueProcessorManager, AppEvents) {
	"use strict";

	/**
	 * Base controller for group fragments
	 * 
	 * @class
	 * @abstract
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.group.CharacteristicGroupBase
	 * @extends sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.Base
	 */
	return Base.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.group.CharacteristicGroupBase", { /** @lends sap.ui.base.ManagedObject.prototype */
		metadata: {
			"abstract": true
		},
		
		exit: function() {
			CharacteristicValueProcessorManager.detachEventFromAllProcessors("select", this._onCharacteristicSelected, this);
			CharacteristicValueProcessorManager.detachEventFromAllProcessors("undoRedo", this._onUndoRedo, this);
			CharacteristicValueProcessorManager.detachEventFromAllProcessors("change", this._onChange, this);
			CharacteristicValueProcessorManager.detachEventFromAllProcessors("afterChange", this._onAfterChange, this);
			Base.prototype.exit.apply(this);
		},
		
		/**
		 * Factory for the characteristics. Called by the aggregation binding to create a characteristic.
		 * 
		 * @param {string} sId: the id of the control
		 * @param {object} oContext: the cstic context to resolve the fragment for.
		 * @return {sap.m.FlexBox} the created FlexBox object
		 * @public
		 */
		characteristicFactory: function(sIdPrefix, oContext) {
			var oComponent = this.getOwnerComponent();
			// To reduce complexity of the IDs we just use the ComponentID as a prefix.
			// This has the advanatage that we can refactore the internal view structure, without affecting the stable IDs
			var oCharacteristic = this.getViewController().getCharacteristicFactory().create(oComponent.getId(), oContext);
			var oProcessor;
			if (!CharacteristicValueProcessorManager.hasProcessor(oCharacteristic)) {
				oProcessor = CharacteristicValueProcessorManager.createProcessor(oCharacteristic, this.getView());
			} else {
				oProcessor = CharacteristicValueProcessorManager.getProcessor(oCharacteristic, true);
			}
			// in case the group has been destroyed, it must be newly attached to the processor events
			if (!oProcessor.isAttachedToEvent("select", this._onCharacteristicSelected, this)) {
				oProcessor.attachSelect(this._onCharacteristicSelected, this);
				oProcessor.attachUndoRedo(this._onUndoRedo, this);
				oProcessor.attachChange(this._onChange, this);
				oProcessor.attachAfterChange(this._onAfterChange, this);
			}
			
			return oCharacteristic;
		},
		
		
		/**
		 * @private
		 */
		_onCharacteristicSelected : function(oEvent) {
			if (this.bIsDestroyed){
				return;
			}
			this.getOwnerComponent().fireCharacteristicSelected({
				path: oEvent.getParameter("path")
			});
		},

		/**
		 * @private
		 */
		_onUndoRedo : function() {
			this.getOwnerComponent().fireCharacteristicAssignmentTriggered();	
		},

		/**
		 * @private
		 */
		_onChange : function(oEvent) {
			this.getOwnerComponent().fireCharacteristicValueChanged({
				characteristicPath: oEvent.getParameter("path")
			});
				
		},

		/**
		 * @private
		 */
		_onAfterChange : function(oEvent) {
			
			var bAssignSuccess = oEvent.getParameter("assignSuccess");
			
			if (bAssignSuccess) {
				// always refresh the form to allow hidden characteristics to be displayed
				// if not refreshed the model does not detect changes on the same amount of items
				// with different content => force refresh
				// this is not necessary in case of a new filter where the parent is not yet available
				// => check for parent existance
				// 
				// 10-09-2020 add geometry change flag to prevent general re-creation of characteristics
				var iGroupId = this.getModel("vchclf").getProperty(oEvent.getParameter("path")).GroupId;
				AppEvents.EVALUATE_CSTICS_GEOMETRY.publish({ groupId: iGroupId });
				
				this.getOwnerComponent().fireCharacteristicChanged({
					characteristicPath: oEvent.getParameter("path")
				});
			}
		}
	});

}, /* bExport= */ true);
