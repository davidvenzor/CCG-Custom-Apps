/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/i2d/lo/lib/zvchclfz/common/util/RequestQueue"
], function(ManagedObject, Filter, FilterOperator, Constants, RequestQueue) {
	"use strict";

	/**
	 * Service for classification OData calls. Used as singleton class.
	 * 
	 * @class ClassificationService
	 */
	var ClassificationService = ManagedObject.extend("sap.i2d.lo.lib.zvchclfz.components.classification.service.ClassificationService", {
		metadata: {
			events: {
				classificationContextChanged: {
					parameters: {
						contextId: "string"
					}
				},
				assignedClassesChanged: {
					parameters: {
						classType: "string",
						isAssigned: "boolean"
					}
				},
				characteristicValueChanged: {
					parameters: {
						instanceId: "string"
					}
				}
			}
		},
		
		oResourceBundle: undefined,
		oODataModel: undefined,
		oClassificationModel: undefined,
		oComponentModel: undefined,

		bFeatureTogglesLoaded: false,
		bInitialized: false,

		sContextId: "",
		sDraftKey: "",

		/**
		 * Initializes the values required by the service functions.
		 * 
		 * @param {object} oView The view of the classification component.
		 * @public
		 * @memberof ClassificationService
		 * @instance
		 */
		initialize: function(oView) {
			if (this.bInitialized) {
				return;
			}
			
			this.oODataModel = oView.getModel();
			this.oResourceBundle = oView.getModel("i18n").getResourceBundle();
			this.oClassificationModel = oView.getModel(Constants.LOCAL_CLASSIFICATION_MODEL_NAME);
			this.oComponentModel = oView.getModel(Constants.CLASSIFICATION_COMPONENT_MODEL_NAME);

			// Set batch group as deferred.
			if (this.oODataModel) {
				this.oODataModel.setDeferredGroup(Constants.VCHCLF_BATCH_GROUP);
			}
			
			this.bInitialized = true;
		},
		
		/**
		 * Clear stored data.
		 * 
		 * @public
		 * @memberof ClassificationService
		 * @instance
		 */
		clear: function() {
			this.oODataModel = undefined;
			this.oResourceBundle = undefined;
			this.oClassificationModel = undefined;
			this.oComponentModel = undefined;
			
			this.bFeatureTogglesLoaded = false;
			this.bInitialized = false;
			
			this.sContextId = null;
			this.sDraftKey = null;
		},

		/**
		 * Returns the id of the current context.
		 * 
		 * @public
		 * @memberof ClassificationService
		 * @instance
		 * @returns {string} Id of the current classification context.
		 */
		getContextId: function() {
			return this.sContextId;
		},

		/**
		 * Returns the corresponding class type from a classification instance.
		 * 
		 * @param {string} sInstanceId The classification instance id.
		 * @public
		 * @memberof ClassificationService
		 * @instance
		 * @returns {string} The class type.
		 */
		getClassTypeByInstanceId: function(sInstanceId) {
			var sPath = this.oODataModel.createKey("/ClassificationInstanceSet", {
				ContextId: this.getContextId(),
				InstanceId: sInstanceId
			});
			
			var oInstance = this.oODataModel.getProperty(sPath);

			return oInstance.ClassType;
		},

		/**
		 * Assembles the classification context id.
		 * 
		 * @param {object} oContextData An object that contains information necessary to create the context.
		 * @public
		 * @memberof ClassificationService
		 * @instance
		 */
		createClassificationContextId: function() {
			var sContextId = this.getClassificationContextId(this.oComponentModel.getData());
			
			this.sContextId = sContextId;
			this.sDraftKey = this.oComponentModel.getData().draftKey;

			this.fireClassificationContextChanged({
				contextId: sContextId
			});
		},
		
		/**
		 * Assembles the classification context id.
		 * 
		 * @param {object} oContextData Data of the current context.
		 * @public
		 * @memberof ClassificationService
		 * @instance
		 * @returns {string} The generated context id.
		 */
		getClassificationContextId: function(oContextData) {
			var bEditMode = oContextData.uiMode !== "Display";
			var sContextId = "CLF";

			if (oContextData.semanticObject) {
				sContextId += this._getTextWithLength("SEMANTIC_OBJ") + this._getTextWithLength(oContextData.semanticObject);
			}

			if (oContextData.objectKey) {
				sContextId += this._getTextWithLength("OBJECT_KEY") + this._getTextWithLength(oContextData.objectKey);
			}

			if (oContextData.technicalObject) {
				sContextId += this._getTextWithLength("TECHNICAL_OBJ") + this._getTextWithLength(oContextData.technicalObject);
			}

			if (bEditMode && oContextData.draftKey) {
				sContextId += this._getTextWithLength("DRAFT_KEY") + this._getTextWithLength(oContextData.draftKey);
			}
			
			if (bEditMode && oContextData.draftKeyIsString) {
				sContextId += this._getTextWithLength("DRAFT_KEY_IS_STR") + this._getTextWithLength("X");
			}

			return sContextId;
		},

		/**
		 * Changes activation status and creates event handlers for activation change events.
		 * It is required to know if it is changed so we can decide if execution of certain calls
		 * is still necessary or not (like status update).
		 * 
		 * @private
		 * @memberof ClassificationService
		 * @instance
		 */
		handleActivationStatusChange: function() {
			var oExtensionAPI = this.oComponentModel.getProperty("/extensionAPI");
			var oTransactionController = oExtensionAPI.getTransactionController();
			
			if (!this.bSaveListenerRegistered) {
				var fnAttachMethod;
				if (oTransactionController.hasOwnProperty("attachAfterActivate")) {
					fnAttachMethod = oTransactionController.attachAfterActivate;
				} else if (oTransactionController.hasOwnProperty("attachAfterSave")) {
					fnAttachMethod = oTransactionController.attachAfterSave;
				}

				fnAttachMethod(function(oEvent) {
					this.oClassificationModel.setProperty("/IsActivationStatusChanged", true);
					
					// @TODO: Check if it is also 'activationPromise' in non-draft apps.
					oEvent.activationPromise.then(null, function() {
						this.oClassificationModel.setProperty("/IsActivationStatusChanged", false);

						this.fireAssignedClassesChanged();
					}.bind(this));
				}.bind(this));

				this.bSaveListenerRegistered = true;
			}

			if (!this.bDiscardListenerRegistered) {
				oTransactionController.attachAfterCancel(function(oEvent) {
					this.oClassificationModel.setProperty("/IsActivationStatusChanged", true);

					// @TODO: Check if it is also 'discardPromise' in non-draft apps.
					oEvent.discardPromise.then(null, function() {
						this.oClassificationModel.setProperty("/IsActivationStatusChanged", false);

						this.fireAssignedClassesChanged();
					}.bind(this));
				}.bind(this));

				this.bDiscardListenerRegistered = true;
			}
		},

		/**
		 * Calls the GetClassificationSettings function import and determines if classification is allowed.
		 * 
		 * @public
		 * @memberof ClassificationService
		 * @instance
		 * @returns {object} A new promise.
		 */
		getClassificationSettings: function() {
			return new Promise(function(fnResolve, fnReject) {
				this.oODataModel.facadeCallFunction("/GetClassificationSettings", undefined, undefined, Constants.VCHCLF_BATCH_GROUP, "GET").
					then(function(oODataContext) {
						var sResult = oODataContext.GetClassificationSettings.IsClassificationAllowed;
						fnResolve(sResult === "CLF=Allowed");
					})
					.catch(fnReject);
			}.bind(this));
		},
		
		/**
		 * Gets the assigned classes for the current context. This function also calls submitChanges.
		 * 
		 * @param {string} sClassType If defined the request will be filtered for the selected class type.
		 * @param {boolean} [bSecuredExecution=false] Determines if secured execution is required for the read request.
		 * @public
		 * @memberof ClassificationService
		 * @instance
		 * @returns {object} A new promise.
		 */
		getAssignedClasses: function(sClassType, bSecuredExecution) {
			var aFilters = [];
			var oExtensionAPI = this.oComponentModel.getProperty("/extensionAPI");
			
			var fnOuterCallback = function() {
				if (sClassType) {
					aFilters.push(new Filter("ClassType", FilterOperator.EQ, sClassType));
				}
				
				return new Promise(function(fnResolve, fnReject) {
					var sPath = this.oODataModel.createKey("/ClassificationContextSet", {
						ContextId: this.getContextId()
					});
					
					//facadeRead: function(sKey, mUrlParameters, oContext, aFilters, fnSuccess, fnError, sGroupId)
					this.oODataModel.facadeRead(sPath + "/Assigned", {
							$expand: 
								"CharacteristicsGroups,CharacteristicsGroups/Characteristics,CharacteristicsGroups/Characteristics/DomainValues,CharacteristicsGroups/Characteristics/AssignedValues",
							search: "SkipCharacteristics=0,TopCharacteristics=30"
						}, null, aFilters, function(oODataContext) {
							var aAssignedClasses = oODataContext.results;
							var aAssignedClassesGrouped = this._groupAssignedClassesByClassTypes(aAssignedClasses);
							var aAssignedClassesGroupedSorted = this._sortClassTypes(aAssignedClassesGrouped);
	
							fnResolve(aAssignedClassesGroupedSorted);
						}.bind(this), fnReject, Constants.VCHCLF_BATCH_GROUP);
	
					this._submitChanges();
				}.bind(this));
			}.bind(this);
			
			if (oExtensionAPI && oExtensionAPI.securedExecution && bSecuredExecution) {
				return oExtensionAPI.securedExecution(fnOuterCallback);
			} else {
				return fnOuterCallback();
			}
		},

		/**
		 * Gets the list of available class types in the current context extended with an empty value.
		 * 
		 * @public
		 * @memberof ClassificationService
		 * @instance
		 * @returns {object} A new promise. Resolve contains the list of available class types as argument.
		 */
		getAvailableClassTypes: function() {
			return new Promise(function(fnResolve, fnReject) {
				var sPath = this.oODataModel.createKey("/ClassificationContextSet", { 
					ContextId: this.getContextId()
				});
				
				this.oODataModel.facadeRead(sPath + "/ClassTypes", undefined, undefined, undefined, function(oODataContext) {
						var aClassTypes = oODataContext.results;
						aClassTypes.unshift({
							ClassType: "",
							ClassTypeDescription: ""
						});

						fnResolve(aClassTypes);
					}, fnReject, Constants.VCHCLF_BATCH_GROUP);
			}.bind(this));
		},
		
		/**
		 * Assigns the selected class in the current context and refreshes the data.
		 * 
		 * @param {string} sInstanceId The id of the selected class.
		 * @public
		 * @memberof ClassificationService
		 * @instance
		 * @returns {object} A new promise.
		 */
		assignClass: function(sInstanceId) {
			var oParameters = {
				ContextId: this.sContextId,
				InstanceId: sInstanceId,
				DraftKey: this.sDraftKey
			};

			return this._callFunctionImport("/ClassificationInstanceAssign", oParameters, true);
		},

		/**
		 * Unassigns the selected class in the current context and refreshes the data.
		 * 
		 * @param {string} sInstanceId The id of the selected class.
		 * @public
		 * @memberof ClassificationService
		 * @instance
		 * @returns {object} A new promise.
		 */
		unassignClass: function(sInstanceId) {
			var oParameters = {
				ContextId: this.sContextId,
				InstanceId: sInstanceId,
				DraftKey: this.sDraftKey
			};

			return this._callFunctionImport("/ClassificationInstanceUnassign", oParameters);
		},
		
		/**
		 * Read feature toggles for later use.
		 * 
		 * @public
		 * @memberof ClassificationService
		 * @instance
		 * @returns {object} A new promise.
		 */
		readFeatureToggles: function() {
			if (!this.bFeatureTogglesLoaded) {
				return new Promise(function(fnResolve, fnReject) {
					this.oODataModel.facadeRead("/ToggleSet", undefined, undefined, undefined, function() {
							this.bFeatureTogglesLoaded = true;
							fnResolve();
						}.bind(this), fnReject, Constants.VCHCLF_BATCH_GROUP);
				}.bind(this));
			} else {
				return Promise.resolve();
			}
		},
		
		/**
		 * Loads the classification proposed by machine learning.
		 * 
		 * @param {string} sClassType The class type to which a machine learning proposal is made.
		 * @private
		 * @memberof ClassificationService
		 * @instance
		 * @returns {object} Returns a new Promise.
		 */
		loadClassificationProposal: function(sClassType) {
			var oParameters = {
				ContextId: this.sContextId,
				ClassType: sClassType
			};
			
			return RequestQueue.add(this._callFunctionImport.bind(this, "/LoadClassificationProposal", oParameters, false), this);                         
		},
		
		/**
		 * Submits the currently pending changes in the deferred group.
		 * 
		 * @public
		 * @memberof ClassificationService
		 * @instance
		 */
		_submitChanges: function() {
			this.oODataModel.submitBatch(Constants.VCHCLF_BATCH_GROUP);
		},
		
		_callFunctionImport: function(sFunctionImportName, oParameters, bIsAssigned) {
			var oExtensionAPI = this.oComponentModel.getProperty("/extensionAPI");
			var oTransactionController;
			var sClassType;
			
			// securedExecution needs a promise as an argument
			var fnOuterCallback = function() {
				return new Promise(function(fnOuterResolve, fnOuterReject) {
					// This function is necessary if saveDraft is used, as it needs a promise as an argument.
					var fnCallback = function() {
						    
						if (typeof oParameters.ClassType !== "undefined") {
						    sClassType = oParameters.ClassType;
						} else {
						    sClassType = this.getClassTypeByInstanceId(oParameters.InstanceId);
						}
							
						//facadeCallFunction: function(sFunction, mUrlParameters, changeSetId, sGroupId, sMethod) 
						var oPromise = this.oODataModel.facadeCallFunction(sFunctionImportName, oParameters, undefined, Constants.VCHCLF_BATCH_GROUP);
						oPromise.then(function() {
							fnOuterResolve();
						}).catch(function() {
							fnOuterReject();
						});

						this.fireAssignedClassesChanged({
							classType: sClassType,
							isAssigned: bIsAssigned
						});
						
						return oPromise;
						
					}.bind(this);

					if (oTransactionController && oTransactionController.saveDraft) {
						oTransactionController.saveDraft(fnCallback);
					} else {
						fnCallback();
					}
				}.bind(this));
			}.bind(this);

			if (oExtensionAPI && oExtensionAPI.securedExecution) {
				oTransactionController = oExtensionAPI.getTransactionController();
				return oExtensionAPI.securedExecution(fnOuterCallback);
			} else {
				return fnOuterCallback();
			}
		},

		/**
		 * Groups the classes returned by the OData service by class type.
		 * 
		 * @param {object[]} aAssignedClasses The array of classes returned by the OData service.
		 * @private
		 * @memberof ClassificationService
		 * @instance
		 * @returns {object[]} The array of classes grouped by class type.
		 */
		_groupAssignedClassesByClassTypes: function(aAssignedClasses) {
			var oGroupedClasses = {};
			var aGroupedClasses = [];

			aAssignedClasses.forEach(function(oClass) {
				var sClassType = oClass.ClassType;

				if (!oGroupedClasses[sClassType]) {
					oGroupedClasses[sClassType] = {
						ClassType: sClassType,
						Status: oClass.Status,
						Description: oClass.ClassTypeDescription,
						ContextId: oClass.ContextId,
						InstanceId: sClassType,
						IsVisible: false,
						FirstVisible: false,
						IsRefreshRequired: "",
						EnableProposals: oClass.EnableProposals,
						DisableAddAssignment: oClass.DisableAddAssignment,
						DisableRemoveAssignment: oClass.DisableRemoveAssignment,
						SelectedInstanceKey: undefined,
						AssignedClasses: []
					};
				}

				if (oClass.ClassName) {
					if (oGroupedClasses[sClassType].AssignedClasses.length === 1) {
						oGroupedClasses[sClassType].AssignedClasses.splice(0, 0, {
							ClassName: this.oResourceBundle.getText("ALL_ASSIGNED_CLASSES"),
							InstanceId: sClassType,
							ClassType: "",
							ContextId: oClass.ContextId
						});
					}

					oGroupedClasses[sClassType].IsVisible = true;
					oGroupedClasses[sClassType].AssignedClasses.push(oClass);
				}
			}.bind(this));

			for (var sClassType in oGroupedClasses) {
				if (oGroupedClasses.hasOwnProperty(sClassType)) {
					aGroupedClasses.push(oGroupedClasses[sClassType]);
				}
			}

			return aGroupedClasses;
		},

		/**
		 * Sorts the assigned class types into ascending order.
		 * 
		 * @param {array} aClassTypes The class types to be sorted.
		 * @private
		 * @memberof ClassificationService
		 * @instance
		 * @returns {array} Grouped class types, sorted.
		 */
		_sortClassTypes: function(aClassTypes) {
			aClassTypes.sort(function(oFirstValue, oSecondValue) {
				if (oFirstValue.ClassType < oSecondValue.ClassType) {
					return -1;
				} else if (oFirstValue.ClassType > oSecondValue.ClassType) {
					return 1;
				}

				return 0;
			});

			return aClassTypes;
		},

		/**
		 * Returns a text with its character length before it in brackets.
		 * 
		 * @param {string} sText The text to be returned.
		 * @private
		 * @memberof ClassificationService
		 * @instance
		 * @returns {string} The text with its length.
		 */
		_getTextWithLength: function(sText) {
			return "(" + sText.length + ")" + sText;
		}
	});
	var oService;

	return {

		/**
		 * Makes ClassificationService singleton. Creates and returns the service if it still not exists or returns the already existing one. 
		 * 
		 * @public
		 * @memberof ClassificationService
		 * @static
		 * @return {object} A ClassificationService instance.
		 */
		getService: function() {
			if (!oService) {
				oService = new ClassificationService();
			}

			return oService;
		}
	};
});
