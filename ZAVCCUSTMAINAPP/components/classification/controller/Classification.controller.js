/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/classification/utils/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/classification/utils/Formatter",
	"sap/i2d/lo/lib/zvchclfz/components/classification/service/ClassificationService",
	"sap/i2d/lo/lib/zvchclfz/components/classification/service/EnhancementService",
	"sap/i2d/lo/lib/zvchclfz/components/classification/service/AssignClassDialogService"
], function(Controller, JSONModel, Constants, ClassificationConstants, Formatter, ClassificationService, EnhancementService,
	AssignClassDialogService) {
	"use strict";

	/**
	 * Controller for the classification component.
	 * 
	 * @class ClassificationController
	 * @extends sap.ui.core.mvc.Controller 
	 */
	return Controller.extend("sap.i2d.lo.lib.zvchclfz.components.classification.controller.Classification", {

		formatter: Formatter,
		oClassificationService: ClassificationService.getService(),
		oEnhancementService: EnhancementService.getService(),

		/**
		 * Sets initial model and subscribes to events when the controller is initialized.
		 * 
		 * @public
		 * @memberof ClassificationController
		 * @instance
		 */
		onInit: function() {
			var oView = this.getView();

			var oLocalModel = new JSONModel(this._getDefaultModelData());
			oView.setModel(oLocalModel, Constants.LOCAL_CLASSIFICATION_MODEL_NAME);
			
			var oFeatureToggleModel = new JSONModel(this._getDefaultFeatureToggleModelData());
			oView.setModel(oFeatureToggleModel, Constants.FEATURE_TOGGLE_MODEL_NAME);
		},

		/**
		 * Detach event listeners.
		 * 
		 * @public
		 * @memberof ClassificationController
		 * @instance
		 */
		onExit: function() {
			this.oClassificationService.clear();
			this.oClassificationService.detachAssignedClassesChanged(this._callRefreshAssignedClasses, this);
			this.oClassificationService.detachCharacteristicValueChanged(this._characteristicValueChanged, this);
		},

		/**
		 * Receives the classification context id, then reads the classes and available class types.
		 * Also reads if classification is possible or not using a function import.
		 * 
		 * @public
		 * @memberof ClassificationController
		 * @instance
		 */
		loadClassification: function() {
			var oOwnerComponent = this.getOwnerComponent();
			var oView = this.getView();
			// var bBindingContext = this.getView().getBindingContext();
			// var bHasSideEffect = bBindingContext ? bBindingContext.getObject().hasOwnProperty("ClassificationSideEffect") : false;
			var bHasSideEffect = false;
			var sUiMode = this.getOwnerComponent().getUiMode();
			var bEditMode = sUiMode !== "Display";
			var oLocalModel = oView.getModel(Constants.LOCAL_CLASSIFICATION_MODEL_NAME);
			var oComponentModel = oView.getModel(Constants.CLASSIFICATION_COMPONENT_MODEL_NAME);
			var oExtensionApi = oComponentModel.getProperty("/extensionAPI");
			var oContextData = {
				SemanticObj: oOwnerComponent.getSemanticObject(),
				TechnicalObj: oOwnerComponent.getTechnicalObject(),
				ObjectKey: oOwnerComponent.getObjectKey(),
				DraftKey: oOwnerComponent.getDraftKey(),
				DraftKeyIsString: oOwnerComponent.getDraftKeyIsString(),
				ECN: oOwnerComponent.getChangeNumber(),
				ValidFrom: oOwnerComponent.getValidityDate()
			};

			if (oContextData.ObjectKey || oContextData.DraftKey) {
				this._initServices();
				
				// Restoring properties to default values.
				oLocalModel.setData(this._getDefaultModelData());
				oComponentModel.setProperty("/classificationBusy", true);
				oComponentModel.setProperty("/isInitialLoad", true);

				this.oClassificationService.createClassificationContextId(oContextData);

				if (oExtensionApi) {
					this.oClassificationService.handleActivationStatusChange();
				}
				
				this._setAvailableClassTypes();
				this._refreshAssignedClasses();
				this._registerRefreshListener();

				if (bHasSideEffect && bEditMode) {
					this._setClassificationSettings();
				}
			}
		},

		/**
		 * Called when the 'Assign a class' link is clicked. Calls the open function of the AssignClassDialogService.
		 * 
		 * @public
		 * @memberof ClassificationController
		 * @instance
		 */
		onAssignClassLinkPress: function() {
			AssignClassDialogService.open(this.getView());
		},
		
		/**
		 * Calls the loadClassificationProposal method in the EnhancementService, 
		 * that can be optionally overwritten by the embedding application.
		 * If it's not overwritten, the default implementation is called in the ClassificationService.  
		 * The overwritten method can still call the default implementation if required.
		 * Passes an empty string as class type, so the service fetches the default ML enabled class type.
		 * 
		 * @param {object} oEvent The press event.
		 * @public
		 * @memberof ClassTypeController
		 * @instance
		 */
		onProposeClassificationLinkPress: function(oEvent) {
			var oPromise = this.oEnhancementService.loadClassificationProposal(oEvent);

			oPromise.then(function(oData) {
				if (oData && oData.callDefaultImplementation) {
					this.oClassificationService.loadClassificationProposal("");
				}
			}.bind(this));
		},
		
		/**
		 * Initializes classification service and registers event listeners.
		 * 
		 * @private
		 * @memberof ClassificationController
		 * @instance
		 */
		_initServices: function() {
			// Detach event listeners
			this.onExit(); 
			
			// Initialize Classification service
			this.oClassificationService.initialize(this.getView());
			this.oClassificationService.attachAssignedClassesChanged(this._callRefreshAssignedClasses, this);
			this.oClassificationService.attachCharacteristicValueChanged(this._characteristicValueChanged, this);

			// Initialize Enhancement service
			this.oEnhancementService.initialize(this.getView());
		},

		/**
		 * Refreshes assigned classes based on the event data when class assignemnt has changed.
		 * 
		 * @param {object} oData The object provided by the event.
		 * @private
		 * @memberof ClassificationController
		 * @instance
		 */
		_callRefreshAssignedClasses: function(oData) {
			this._refreshAssignedClasses(oData.getParameter("classType"));
		},

		/**
		 * Refreshes classification status based on the event data when a characteristic value changed.
		 * 
		 * @param {object} oData The object provided by the event.
		 * @private
		 * @memberof ClassificationController
		 * @instance
		 */
		_characteristicValueChanged: function(oData) {
			if (!this.getView().getModel(Constants.LOCAL_CLASSIFICATION_MODEL_NAME).getProperty("/IsActivationStatusChanged")) {
				var sClassType = this.oClassificationService.getClassTypeByInstanceId(oData.getParameter("instanceId"));
				this._refreshClassificationStatus(sClassType);
			}
		},

		/**
		 * Called on context creation if needed. Sets values for the editable and IsRemoveOnly properties of respective models.
		 * 
		 * @private
		 * @memberof ClassificationController
		 * @instance
		 */
		_setClassificationSettings: function() {
			var oView = this.getView();

			this.oClassificationService.getClassificationSettings().then(
				function(bAllowed) {
					oView.getModel(Constants.CLASSIFICATION_COMPONENT_MODEL_NAME).setProperty("/editable", bAllowed);
					oView.getModel(Constants.LOCAL_CLASSIFICATION_MODEL_NAME).setProperty("/IsRemoveOnly", !bAllowed);
				});
		},

		/**
		 * Refreshes the status of a class type based on a change in a class.
		 * 
		 * @param {string} sChangedClassType The class type that has been changed.
		 * @private
		 * @memberof ClassificationController
		 * @instance
		 */
		_refreshClassificationStatus: function(sChangedClassType) {
			this.oClassificationService.getAssignedClasses(sChangedClassType)
				.then(function(aClassesGrouped) {
					var oLocalModel = this.getView().getModel(Constants.LOCAL_CLASSIFICATION_MODEL_NAME);
					var aCurrentClassTypes = oLocalModel.getProperty("/ClassTypes");

					// Search for the class type in the local model and only update the status of the relevant one.
					aCurrentClassTypes.some(function(oClassType, iIndex) {
						if (oClassType.ClassType === sChangedClassType) {
							var oPreviousStatus = oClassType.Status;
							var oNewStatus = aClassesGrouped[0].Status;

							if (oNewStatus.Description !== oPreviousStatus.Description) {
								oLocalModel.setProperty("/ClassTypes/" + iIndex + "/Status", oNewStatus);
							}

							return true;
						}
						
						return false;
					});
				}.bind(this));
		},

		/**
		 * Reads the assigned classes for the current context.
		 * 
		 * @param {string} sClassType If specified, the read request will be filtered for this class type.
		 * @param {boolean} [bForceRefresh=false] Determines if characteristic values should be refreshed even if classes did not change.
		 * @param {boolean} [bSecuredExecution=false] Determines if secured execution is required for the read request.
		 * @private
		 * @memberof ClassificationController
		 * @instance
		 */
		_refreshAssignedClasses: function(sClassType, bForceRefresh, bSecuredExecution) {
			var oView = this.getView();
			var oModel = oView.getModel(Constants.LOCAL_CLASSIFICATION_MODEL_NAME);
			var oComponentModel = oView.getModel(Constants.CLASSIFICATION_COMPONENT_MODEL_NAME);
			
			this.oClassificationService.readFeatureToggles()
				.then(function() {
					var oFeatureToggleStatus = {
					};
					
					oView.getModel(Constants.FEATURE_TOGGLE_MODEL_NAME).setData(oFeatureToggleStatus);
				});

			this.oClassificationService.getAssignedClasses(sClassType, bSecuredExecution)
				.then(function(aClassTypes) {
						if (!aClassTypes || aClassTypes.length === 0) {
							return;
						}
					
						var aCurrentClassTypes = oModel.getProperty("/ClassTypes");

						if (sClassType) {
							aCurrentClassTypes.some(function(oItem, iIndex) {
								if (oItem.ClassType === sClassType) {
									oModel.setProperty("/ClassTypes/" + iIndex, aClassTypes[0]);

									if (bForceRefresh) {
										oModel.setProperty("/ClassTypes/" + iIndex + "/IsRefreshRequired", ClassificationConstants.FULL_REFRESH);
									}

									return true;
								}
								
								return false;
							});
						} else {
							oModel.setProperty("/ClassTypes", aClassTypes);

							if (bForceRefresh) {
								aClassTypes.forEach(function(oItem, iIndex) {
									oModel.setProperty("/ClassTypes/" + iIndex + "/IsRefreshRequired", ClassificationConstants.FULL_REFRESH);
								});
							}
						}

						this._setFirstVisibleItem();
						this._setDisableAddAssignment();
						
						oModel.setProperty("/HasLoadError", false);
						oComponentModel.setProperty("/classificationBusy", false);
						oComponentModel.setProperty("/isInitialLoad", false);
					}.bind(this),
					function() {
						oModel.setProperty("/HasLoadError", true);
						oComponentModel.setProperty("/classificationBusy", false);
						oComponentModel.setProperty("/isInitialLoad", false);
					});
		},

		/**
		 * Reads the list of available class types in the current context.
		 * 
		 * @private
		 * @memberof ClassificationController
		 * @instance
		 */
		_setAvailableClassTypes: function() {
			this.oClassificationService.getAvailableClassTypes()
				.then(function(aClassTypes) {
					this.getView().getModel(Constants.LOCAL_CLASSIFICATION_MODEL_NAME).setProperty("/AvailableClassTypes", aClassTypes);
				}.bind(this));
		},

		/**
		 * Registers a refresh listener for the classification sideeffect property of the embedding application.
		 * Based on the value of this field it can change editable state and refresh classes or characteristics.
		 * This way handling reference characteristics and default classification is possible, and can be disabled when not supported.
		 * 
		 * @private
		 * @memberof ClassificationController
		 * @instance
		 */
		_registerRefreshListener: function() {
			if (this.getOwnerComponent().getUiMode() !== "Display") {
				var oView = this.getView();

				// Destroy change listener if already exists. If the same item is opened twice it could cause duplicate calls otherwise.
				if (this.oODataBinding) {
					this.oODataBinding.detachChange(this._refreshHandler, this);
					this.oODataBinding.destroy();
				}

				// Register a new change listener for classification sideeffect.
				var oOriginBindingCtx;
				if (oView.getBindingContext()) {
					oOriginBindingCtx = oView.getModel().createBindingContextForOriginModel(oView.getBindingContext());
				}
				this.oODataBinding = oView.getModel().getOriginModel().bindProperty("ClassificationSideEffect", oOriginBindingCtx);

				this.oODataBinding.attachChange(this._refreshHandler, this);
			}
		},

		/**
		 * A handler method to be attached to the ClassificationSideEffect ODataBinding's change event.
		 * 
		 * @param {object} oEvent The change event object.
		 * @private
		 * @memberof ClassificationController
		 * @instance
		 */
		_refreshHandler: function(oEvent) {
			var oModel = this.getView().getModel(Constants.LOCAL_CLASSIFICATION_MODEL_NAME);

			// Example value: 0000000|REF_CLS=001|CLF=Allowed. 
			var sValue = oEvent.getSource().getValue();
			var bActivationStatusChanged = this.getView().getModel(Constants.LOCAL_CLASSIFICATION_MODEL_NAME).getProperty("/IsActivationStatusChanged");

			// Sometimes the value can be undefined. For example after discard.
			if (sValue && sValue !== this.sValue && !bActivationStatusChanged) {
				this.sValue = sValue;
				
				var aCommands = sValue.split("|").splice(1);

				if (aCommands.length === 0) {
					jQuery.sap.assert(false, "No command for timestamp value on refresh.");
				} else {
					var aClassTypes = oModel.getProperty("/ClassTypes");

					aCommands.forEach(function(sCommand) {
						var aKeyValuePair = sCommand.split("=");

						if (aKeyValuePair[0] === "REF_CLS") {
							if (aKeyValuePair[1].split("#").length === 1) {
								// Refresh classes of selected class type. Only single class type can be selected.
								this._refreshAssignedClasses(aKeyValuePair[1], true, true);
							} else {
								jQuery.sap.assert(false, "More class type selected on class refresh.");
							}
						} else if (aKeyValuePair[0] === "REF_CHR") {
							var aSelectedClassTypes = aKeyValuePair[1].split("#");
							this._refreshCharacteristics(aSelectedClassTypes, aClassTypes);
						} else {
							// Disabling UI currently not supported.

							// var bEditable = aKeyValuePair[1] === "Allowed";
							// this._changeEditableState(bEditable, aClassTypes);
						}
					}.bind(this));
				}
			}
		},

		/**
		 * Refreshes only the characteristics of the selected class types.
		 * 
		 * @param {array} aSelectedClassTypes An array of the selected class types. 
		 * @param {array} aClassTypes  An array of all the available class types of the object.
		 * @private
		 * @memberof ClassificationController
		 * @instance
		 */
		_refreshCharacteristics: function(aSelectedClassTypes, aClassTypes) {
			var oModel = this.getView().getModel(Constants.LOCAL_CLASSIFICATION_MODEL_NAME);

			aClassTypes.forEach(function(oClassType, iIndex) {
				if (aSelectedClassTypes.indexOf(oClassType.ClassType) !== -1 && oClassType.IsVisible) {
					oModel.setProperty("/ClassTypes/" + iIndex + "/IsRefreshRequired", ClassificationConstants.FULL_REFRESH);
				}
			});
		},

		/**
		 * Changes only the editable and IsRemoveOnly properties of the respective models.
		 * 
		 * @param {boolean} bEditable The value to change the editable property to.  
		 * @param {array} aClassTypes  An array of all the available class types of the object.
		 * @private
		 * @memberof ClassificationController
		 * @instance
		 */
		_changeEditableState: function(bEditable, aClassTypes) {
			var oView = this.getView();
			var oComponentModel = oView.getModel(Constants.CLASSIFICATION_COMPONENT_MODEL_NAME);
			var oModel = oView.getModel(Constants.LOCAL_CLASSIFICATION_MODEL_NAME); // Change editable state.

			if (bEditable) {
				oComponentModel.setProperty("/editable", true);
				oModel.setProperty("/IsRemoveOnly", false);
			} else {
				oComponentModel.setProperty("/editable", false);
				oModel.setProperty("/IsRemoveOnly", true);
			}

			aClassTypes.forEach(function(oClassType, iIndex) {
				if (oClassType.IsVisible) {
					oModel.setProperty("/ClassTypes/" + iIndex + "/IsRefreshRequired", ClassificationConstants.REFRESH_RENDERING);
				}
			});
		},

		/**
		 * Determines the first visible class type and sets a property to indicate this fact.
		 * This is needed because in the view, every class type section has a top margin, except the first one.
		 * This property makes sure the margin is not applied. This method is called after every assign and assignment removal.
		 * 
		 * @param {array} aClassTypes An array of all the available class types of the object.
		 * @private
		 * @memberof ClassificationController
		 * @instance
		 */
		_setFirstVisibleItem: function() {
			var bHasAssignedClasses;
			var bFirstVisibleFound;
			var oModel = this.getView().getModel(Constants.LOCAL_CLASSIFICATION_MODEL_NAME);
			var aClassTypes = oModel.getProperty("/ClassTypes");

			aClassTypes.forEach(function(oItem, iIndex) {
				if (oItem.IsVisible && !bFirstVisibleFound) {
					oModel.setProperty("/ClassTypes/" + iIndex + "/FirstVisible", true);
					bFirstVisibleFound = true;
					bHasAssignedClasses = true;
				} else {
					oModel.setProperty("/ClassTypes/" + iIndex + "/FirstVisible", false);
				}
			});

			oModel.setProperty("/HasAssignedClasses", bHasAssignedClasses);
		},
		
		_setDisableAddAssignment: function() {
			var oView = this.getView();
			var oModel = oView.getModel(Constants.LOCAL_CLASSIFICATION_MODEL_NAME);
			var aClassTypes = oModel.getProperty("/ClassTypes");
			var bDisableAddAssignment = true;
			
			aClassTypes.some(function(oClassType) {
				if (!oClassType.DisableAddAssignment) {
					bDisableAddAssignment = false;
					
					return true;
				}
				
				return false;
			});
			
			oModel.setProperty("/DisableAddAssignment", bDisableAddAssignment);	
		},

		_getDefaultModelData: function() {
			return {
				ClassTypes: [],
				AvailableClassTypes: [],
				HasLoadError: false,
				HasAssignedClasses: false,
				IsRemoveOnly: false,
				IsActivationStatusChanged: false,
				DisableAddAssignment: true
			};
		},
		
		_getDefaultFeatureToggleModelData: function() {
			return {
			};
		}
	});
});
