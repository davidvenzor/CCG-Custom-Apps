/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
		"jquery.sap.global",
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		"sap/i2d/lo/lib/zvchclfz/common/Constants",
		"sap/i2d/lo/lib/zvchclfz/components/classification/service/ClassificationService",
		"sap/i2d/lo/lib/zvchclfz/components/classification/service/EnhancementService",
		"sap/i2d/lo/lib/zvchclfz/components/classification/service/AssignClassDialogService",
		"sap/i2d/lo/lib/zvchclfz/components/classification/utils/Constants",
		"sap/i2d/lo/lib/zvchclfz/components/classification/utils/PropertyBindingHandler",
		"sap/i2d/lo/lib/zvchclfz/components/classification/utils/Formatter",
		"sap/i2d/lo/lib/zvchclfz/components/valuation/Component"
	],
	// eslint-disable-next-line max-params	
	function (jQuery, Controller, JSONModel, Constants, ClassificationService, EnhancementService, AssignClassDialogService,
		ClassificationConstants,
		PropertyBindingHandler, Formatter, ValuationComponent) {
		"use strict";

		/**
		 * Controller for a single class type.
		 * @class ClassTypeController
		 * @extends sap.ui.core.mvc.Controller
		 */
		return Controller.extend("sap.i2d.lo.lib.zvchclfz.components.classification.controller.ClassType", {

			UNASSIGN_CLASS_FRAGMENT_NAME: "sap.i2d.lo.lib.zvchclfz.components.classification.view.fragments.UnassignClassPopover",
			ASSIGN_CLASS_FRAGMENT_NAME: "sap.i2d.lo.lib.zvchclfz.components.classification.view.fragments.AssignClassActionSheet",
			VIEW_MODEL_NAME: "classTypeViewModel",

			oUnassignClassPopover: undefined,
			oODataBinding: undefined,
			oFilterObject: undefined,
			oValuationComponent: undefined,
			bClassAssignmentListenerEnabled: true,

			oClassificationService: ClassificationService.getService(),
			oEnhancementService: EnhancementService.getService(),

			formatter: Formatter,

			/**
			 * Called when the view is initialized. It attaches for after rendering event for a single execution.
			 * 
			 * @public
			 * @memberof ClassTypeController
			 * @instance
			 */
			onInit: function () {
				var oView = this.getView();
				var oViewModel = new JSONModel({
					unassignClassSelectedContext: undefined
				});

				oView.setModel(oViewModel, this.VIEW_MODEL_NAME);
				oView.attachEvent("afterRendering", this._setFocus, this);
				oView.attachEventOnce("afterRendering", this.afterRendering, this);
			},

			/**
			 * The afterRendering method that is attached to the view in the onInit method. Executed only once.
			 * 
			 * @param {object} oEvent The afterRendering event object.
			 * @public
			 * @memberof ClassTypeController
			 * @instance
			 */
			afterRendering: function (oEvent) {
				var oView = oEvent.getSource();
				var oModel = oView.getModel(Constants.LOCAL_CLASSIFICATION_MODEL_NAME);

				var oODataBinding = oModel.bindProperty("IsRefreshRequired", oView.getBindingContext(Constants.LOCAL_CLASSIFICATION_MODEL_NAME));
				oODataBinding.attachChange(this._refreshValuationBinding, oView.getController());

				PropertyBindingHandler.addPropertyBinding(oODataBinding);

				this.oClassificationService.attachAssignedClassesChanged(this._assignedClassesChanged, oView.getController());
			},

			/**
			 * Called when the view is destroyed. It destroyes the registered change listener so it won't be called incorrectly.
			 * 
			 * @public
			 * @memberof ClassTypeController
			 * @instance
			 */
			onExit: function () {
				jQuery.sap.clearDelayedCall(this.iOnProposClassificationDelayedClassId);

				PropertyBindingHandler.clearPropertyBindings();
				if (this.oValuationComponent) {
					this.oValuationComponent.detachCharacteristicChanged(this._characteristicChanged, this);
					this.oValuationComponent.detachCollectPreloadedCharacteristicGroup(this._collectPreloadedCharacteristicGroup, this);
				}

				this.oClassificationService.detachAssignedClassesChanged(this._assignedClassesChanged, this);
			},

			/**
			 * Called when the selected class changes in the class select control.
			 * 
			 * @param {object} oEvent The event fired when the selected class changes.
			 * @public
			 * @memberof ClassTypeController
			 * @instance
			 */
			onClassSelectionChange: function (oEvent) {
				var sInstanceId = oEvent.getSource().getSelectedKey();

				this._updateValuationBinding(sInstanceId);
			},

			/**
			 * Called when the unassign class button is pressed. It opens a popover over the button.
			 * 
			 * @param {object} oEvent The event fired when the button is pressed.
			 * @public
			 * @memberof ClassTypeController
			 * @instance
			 */
			onUnassignClassButtonPress: function (oEvent) {
				this.oUnassignClassPopover = sap.ui.xmlfragment(
					this.UNASSIGN_CLASS_FRAGMENT_NAME,
					this.UNASSIGN_CLASS_FRAGMENT_NAME,
					this);
				this.getView().addDependent(this.oUnassignClassPopover);

				this.oUnassignClassPopover.openBy(oEvent.getSource());
			},

			/**
			 * Called when the unassign button is pressed in the unassign popover. Unassigns the selected class.
			 * 
			 * @public
			 * @memberof ClassTypeController
			 * @instance
			 */
			onUnassignClassPopoverUnassignButtonPress: function () {
				var oViewModel = this.getView().getModel(this.VIEW_MODEL_NAME);
				var oUnassignClassSelectedContext = oViewModel.getProperty("/unassignClassSelectedContext");

				if (oUnassignClassSelectedContext) {
					var sInstanceId = oUnassignClassSelectedContext.getProperty("InstanceId");

					this.oClassificationService.unassignClass(sInstanceId);

					this.oUnassignClassPopover.close();
					oViewModel.setProperty("/unassignClassSelectedContext", undefined);
				}
			},

			/**
			 * Called when the selection changes in the unassign class popover. It stores the selected class in a global variabe.
			 * 
			 * @param {object} oEvent The event fired when the selection changes.
			 * @public
			 * @memberof ClassTypeController
			 * @instance
			 */
			onUnassignClassListSelectionChange: function (oEvent) {
				var aSelectedContexts = oEvent.getSource().getSelectedContexts();

				this.getView().getModel(this.VIEW_MODEL_NAME).setProperty("/unassignClassSelectedContext", aSelectedContexts[0]);
			},

			/**
			 * Called every time the unassign class popover is closed.
			 * 
			 * @param {object} oEvent The event fired when the popover is closed.
			 * @public
			 * @memberof ClassTypeController
			 * @instance
			 */
			onUnassignClassPopoverAfterClose: function (oEvent) {
				this.getView().getModel(this.VIEW_MODEL_NAME).setProperty("/unassignClassSelectedContext", undefined);
				oEvent.getSource().destroy();
			},

			/**
			 * Called when the assign button is pressed. Opens the assign class dialog.
			 * 
			 * @param {object} oEvent The event fired when the AssignClassButton is pressed.
			 * @public
			 * @memberof ClassTypeController
			 * @instance
			 */
			onAssignClassButtonPress: function (oEvent) {
				var oView = this.getView();
				var aClassTypes = oView.getModel(Constants.LOCAL_CLASSIFICATION_MODEL_NAME).getProperty("/ClassTypes");

				if (aClassTypes.length <= 1) {
					AssignClassDialogService.open(oView);
				} else {
					var oActionSheet = sap.ui.xmlfragment(
						this.ASSIGN_CLASS_FRAGMENT_NAME,
						this.ASSIGN_CLASS_FRAGMENT_NAME,
						this);

					oView.addDependent(oActionSheet);

					oActionSheet.openBy(oEvent.getSource());
				}
			},

			/**
			 * Called when a button is clicked in the action sheet.
			 *
			 * @param {object} oEvent The click event object.
			 * @public
			 * @memberof ClassTypeController
			 * @instance
			 */
			onAssignClassActionSheetButtonPress: function (oEvent) {
				var oView = this.getView();
				var bFromThisClassType = oEvent.getSource().data("fromThisClassType");

				AssignClassDialogService.open(oView, bFromThisClassType);
			},

			/**
			 * Destroys the action sheet after it's closed.
			 * 
			 * @param {object} oEvent The after close event object.
			 * @public
			 * @memberof ClassTypeController
			 * @instance
			 */
			onActionSheetAfterClose: function (oEvent) {
				oEvent.getSource().destroy();
			},

			/**
			 * Opens the characteristic filter dialog.
			 * 
			 * @param {object} oEvent The press event.
			 * @public
			 * @memberof ClassTypeController
			 * @instance
			 */
			onFilterButtonPress: function (oEvent) {
				var oSource = oEvent.getSource();

				if (this.oValuationComponent) {
					this.oValuationComponent.openFilterDialog(oSource);
				}
			},

			/**
			 * Calls the loadClassificationProposal method in the EnhancementService, 
			 * that can be optionally overwritten by the embedding application.
			 * If it's not overwritten, the default implementation is called in the ClassificationService.  
			 * The overwritten method can still call the default implementation if required.
			 * 
			 * @param {object} oEvent The press event.
			 * @public
			 * @memberof ClassTypeController
			 * @instance
			 */
			onProposeClassificationButtonPress: function (oEvent) {
				var sClassType = oEvent.getSource().getBindingContext(Constants.LOCAL_CLASSIFICATION_MODEL_NAME).getProperty("ClassType");

				// If there is also a class assignment with value proposals All assigned classes is selected
				// as a result of the binding change listener. In this case _selectInstance would mean a duplicate refresh.
				this.bClassAssignmentListenerEnabled = false;

				// Required workaround for RequestQueue. Enhancements there to force new batch will be available later.
				// Make sure that loading of classification proposal is not executed parallelly with value change.
				this.iOnProposClassificationDelayedClassId = jQuery.sap.delayedCall(0, this, function () {
					this.oEnhancementService.loadClassificationProposal(oEvent)
						.then(function (oData) {
							if (oData && oData.callDefaultImplementation) {
								this.oClassificationService.loadClassificationProposal(sClassType).then(function () {
									this._selectInstance(sClassType);
									this.bClassAssignmentListenerEnabled = true;
								}.bind(this));
							} else {
								this._selectInstance(sClassType);
								this.bClassAssignmentListenerEnabled = true;
							}
						}.bind(this));
				}.bind(this));
			},

			/**
			 * Updates the selected class and gets the instance id, then updates valuation binding.
			 * 
			 * @param {object} oSelect The select to use for the update.
			 * @public
			 * @memberof ClassTypeController
			 * @instance
			 */
			callUpdateBinding: function () {
				var oView = this.getView();
				var oContext = oView.getBindingContext(Constants.LOCAL_CLASSIFICATION_MODEL_NAME);
				var oModel = oView.getModel(Constants.LOCAL_CLASSIFICATION_MODEL_NAME);

				if (oContext) {
					var sCurrentInstanceId = oContext.getProperty("SelectedInstanceKey");
					var sInstanceId = oContext.getProperty("InstanceId");

					if (sCurrentInstanceId !== sInstanceId) {
						oModel.setProperty("SelectedInstanceKey", sInstanceId, oContext);
						this._updateValuationBinding(sInstanceId);
					}
				}
			},

			/**
			 * Initialize valuation component when assigned classes change.
			 * 
			 * @param {object} oEvent The event object.
			 * @private
			 * @memberof ClassTypeController
			 * @instance
			 */
			_assignedClassesChanged: function (oEvent) {
				var oView = this.getView();
				var sEventClassType = oEvent.getParameter("classType");
				var sClassType = oView.getBindingContext(Constants.LOCAL_CLASSIFICATION_MODEL_NAME).getProperty("ClassType");
				var oValuationComponentContainer = oView.byId("valuationComponentContainer");
				var sValuationComponentId = oValuationComponentContainer.getComponent();
				var oValuationComponent = sap.ui.getCore().getComponent(sValuationComponentId);

				if (oValuationComponent && sEventClassType === sClassType) {
					oValuationComponent.initAppStateModel();
					oValuationComponent.removeCharacteristicFilter();
				}
			},

			/**
			 * The afterRendering event handler that is attached to the view in the onInit method. 
			 * Sets the focus on the assign class button after a class assignment is made.
			 * 
			 * @param {object} oEvent The afterRendering event object.
			 * @private
			 * @memberof ClassTypeController
			 * @instance
			 */
			_setFocus: function (oEvent) {
				var oView = oEvent.getSource();
				oView.byId("assignClassButton").focus();
			},

			/**
			 * Updates the selected class corresponding to the provided instance id, then updates valuation binding.
			 * 
			 * @param {object} sInstanceId Id of the selected instance.
			 * @private
			 * @memberof ClassTypeController
			 * @instance
			 */
			_selectInstance: function (sInstanceId) {
				var oView = this.getView();
				var oContext = oView.getBindingContext(Constants.LOCAL_CLASSIFICATION_MODEL_NAME);

				oView.getModel(Constants.LOCAL_CLASSIFICATION_MODEL_NAME).setProperty("SelectedInstanceKey", sInstanceId, oContext);
				this._updateValuationBinding(sInstanceId);
			},

			/**
			 * Refreshes the valuation binding either fully or just the rendering of it. Does not update the binding's path.
			 * 
			 * @param {object} oChangeEvent The change event object.
			 * @private
			 * @memberof ClassTypeController
			 * @instance
			 */
			_refreshValuationBinding: function (oChangeEvent) {
				var sValue = oChangeEvent.getSource().getValue();

				if (sValue && this.bClassAssignmentListenerEnabled) {
					var oView = this.getView();
					var oBindingContext = oView.getBindingContext(Constants.LOCAL_CLASSIFICATION_MODEL_NAME);
					var sPath = oBindingContext.getPath();
						var oValuationComponentContainer = oView.byId("valuationComponentContainer");
					var sValuationComponentId = oValuationComponentContainer.getComponent();
					var oValuationComponent = sap.ui.getCore().getComponent(sValuationComponentId);

					if (sValue === ClassificationConstants.FULL_REFRESH) {
						oValuationComponent.updateRootBindingContext(null, oValuationComponent.getBindingContext(Constants.VIEW_MODEL_NAME).getPath(),
							true);
					} else if (sValue === ClassificationConstants.REFRESH_RENDERING) {
						oValuationComponent.refreshRendering();
					}

					oView.getModel(Constants.LOCAL_CLASSIFICATION_MODEL_NAME).setProperty(sPath + "/IsRefreshRequired", "");
				}
			},

			/**
			 * Updates the binding of the valuation component of the current view.
			 * 
			 * @param {string} sInstanceId The id of the currently selected class.
			 * @private
			 * @memberof ClassTypeController
			 * @instance
			 */
			_updateValuationBinding: function (sInstanceId) {
				var oView = this.getView();
				var oComponentModel = oView.getModel(Constants.CLASSIFICATION_COMPONENT_MODEL_NAME);
				var bIsVisible = oView.getBindingContext(Constants.LOCAL_CLASSIFICATION_MODEL_NAME).getProperty("IsVisible");

				if (bIsVisible && sInstanceId) {
					var oValuationComponentContainer = oView.byId("valuationComponentContainer");
					var sBindingPath = oView.getModel().createKey("/ClassificationInstanceSet", {
						ContextId: this.oClassificationService.getContextId(),
						InstanceId: sInstanceId
					});

					if (!oValuationComponentContainer.getModel(Constants.VCHCLF_MODEL_NAME)) {
						oValuationComponentContainer.setModel(oView.getModel(), Constants.VCHCLF_MODEL_NAME);
					}

					if (this.oValuationComponent) {
						var oPromise;
						var oCurrentBindingContext = this.oValuationComponent.getBindingContext(Constants.VIEW_MODEL_NAME);
						if (oCurrentBindingContext && oCurrentBindingContext.getPath() === sBindingPath) {
							// Force update the component if the path did not change.
							oPromise = this.oValuationComponent.updateRootBindingContext(null, sBindingPath, true);
						} else {
							// Bind the valuation component.
							oPromise = this.oValuationComponent.updateRootBindingContext(null, sBindingPath, false);
						}
						oPromise.then(function () {
							this.oValuationComponent.removeCharacteristicFilter(true);
						}.bind(this));
					} else {
						var oExtensionApi = oComponentModel.getProperty("/extensionAPI");

						this.oValuationComponent = new ValuationComponent(oView.createId("valuationComponent"), {
							draftTransactionController: oExtensionApi ? oExtensionApi.getTransactionController() : undefined,
							semanticObject: oComponentModel.getProperty("/semanticObject"),
							objectKey: oComponentModel.getProperty("/objectKey"),
							uiMode: "{" + Constants.CLASSIFICATION_COMPONENT_MODEL_NAME + ">/uiMode}"
						});

						oValuationComponentContainer.setComponent(this.oValuationComponent);

						// Should be attached before updateRootBinding since it is already in use there.
						this.oValuationComponent.attachCollectPreloadedCharacteristicGroup(this._collectPreloadedCharacteristicGroup.bind(this));

						this.oValuationComponent.updateRootBindingContext(null, sBindingPath, false);

						this.oValuationComponent.attachCharacteristicChanged(this._characteristicChanged.bind(this));
					}
				}

			},

			/**
			 * Called when the list of loaded characteristics in a group are requested by valuation component. 
			 * 
			 * @param {object} oEvent The event object. aCharacteristics property should be filled with the characteristics of the group.
			 * @private
			 * @memberof ClassTypeController
			 * @instance
			 */
			_collectPreloadedCharacteristicGroup: function (oEvent) {
				var oView = this.getView();
				var oComponentModel = oView.getModel(Constants.CLASSIFICATION_COMPONENT_MODEL_NAME);

				if (oComponentModel.getProperty("/isInitialLoad")) {
					var oPreloadedCharacteristicGroup = oEvent.getParameter("preloadedCharacteristicGroup");
					var oDataModel = oView.getModel();
					var sCsticGroupKey = oDataModel.createKey("/CharacteristicsGroupSet", {
						ContextId: oPreloadedCharacteristicGroup.sContextId,
						InstanceId: oPreloadedCharacteristicGroup.sInstanceId,
						GroupId: oPreloadedCharacteristicGroup.iGroupId
					});

					// Retrieve with bIncludeExpandEntries = true.
					var oCsticGroup = oDataModel.getProperty(sCsticGroupKey, null, true);
					var aCharacteristics = oCsticGroup.Characteristics.results;

					// Set characteristics in the event parameter.
					oPreloadedCharacteristicGroup.aCharacteristics = aCharacteristics;
				}
			},

			/**
			 * Called when a characteristic value is changed. 
			 * 
			 * @param {object} oCsticChangeEvent The event object.
			 * @private
			 * @memberof ClassTypeController
			 * @instance
			 */
			_characteristicChanged: function (oCsticChangeEvent) {
				var sCharacteristicPath = oCsticChangeEvent.getParameter("characteristicPath");

				var iContextIdStartIndex = sCharacteristicPath.indexOf("ContextId=") + "ContextId=".length;
				var sValuationType = sCharacteristicPath.substring(iContextIdStartIndex).slice(1, 4);

				if (sValuationType === "CLF") {
					var iInstanceIdStartIndex = sCharacteristicPath.indexOf("InstanceId=") + "InstanceId=".length;
					var sInstanceId = sCharacteristicPath.substring(iInstanceIdStartIndex).split("'")[1];

					this.oClassificationService.fireCharacteristicValueChanged({
						instanceId: sInstanceId
					});
				}
			}
		});
	});