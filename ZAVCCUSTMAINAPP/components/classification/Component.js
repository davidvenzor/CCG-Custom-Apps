/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/suite/ui/generic/template/extensionAPI/ReuseComponentSupport",
	"sap/suite/ui/generic/template/extensionAPI/UIMode",
	"sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/classification/service/ClassificationService",
	"sap/i2d/lo/lib/zvchclfz/common/factory/ODataFacadeModelFactory",
	"sap/i2d/lo/lib/zvchclfz/common/odataFacade/ODataFacadeModel"
], function(UIComponent, ReuseComponentSupport, UIMode, Constants, ClassificationService, ODataFacadeModelFactory, ODataFacadeModel) {
	"use strict";

	/**
	 * Classification Component.
	 * @class ClassificationComponent
	 * @extends sap.ui.core.UIComponent
	 */
	return UIComponent.extend("sap.i2d.lo.lib.zvchclfz.components.classification.Component", {
		metadata: {
			manifest: "json",
			properties: {
				uiMode: {
					type: "string",
					group: "standard",
					defaultValue: "Display"
				},
				semanticObject: {
					type: "string"
				},
				technicalObject: {
					type: "string"
				},
				objectKey: {
					type: "string"
				},
				draftKey: {
					type: "string"
				},
				draftKeyIsString: {
					type: "boolean",
					defaultValue: false
				},
				changeNumber: {
					type: "string"
				},
				validityDate: {
					type: "string"
				},
				disableAddAssignment: {
					type: "boolean",
					defaultValue: false
				},
				disableRemoveAssignment: {
					type: "boolean",
					defaultValue: false
				},
				enableProposals: {
					type: "boolean",
					defaultValue: false
				},
				stIsAreaVisible: {
					type: "boolean",
					group: "standard"
				}
			}
		},

		_fnResolveMessageFilter: undefined,
		_lastVisibleContext: {
			objectKey: "",
			draftKey: ""
		},

		/**
		 * Initializes the content of the page.
		 * @public
		 * @memberof ClassificationComponent
		 * @instance
		 * @returns {object} Returns the main view.
		 */
		createContent: function() {
			this.oView = sap.ui.view({
				viewName: "sap.i2d.lo.lib.vchclf.components.classification.view.Classification",
				type: sap.ui.core.mvc.ViewType.XML
			});

			// Transforms this component into a reuse component for smart templates.
			// @TODO: Check if this works with non-st apps.
			ReuseComponentSupport.mixInto(this, Constants.CLASSIFICATION_COMPONENT_MODEL_NAME);
			this.getModel(Constants.CLASSIFICATION_COMPONENT_MODEL_NAME).setProperty("/editable", false);

			return this.oView;
		},

		/**
		 * Sets the draftTransactionController property and registers the message filter provider.
		 * @param {object} oModel The model.
		 * @param {object} oBindingContext The BindingContext.
		 * @param {object} oExtensionAPI The ExtensionAPI.
		 * @public
		 * @memberof ClassificationComponent
		 * @instance
		 */
		stStart: function(oModel, oBindingContext, oExtensionAPI) {
			this.getModel(Constants.CLASSIFICATION_COMPONENT_MODEL_NAME).setProperty("/extensionAPI", oExtensionAPI);
			oExtensionAPI.registerMessageFilterProvider(this._setMessageFilterPromise.bind(this));
			
			this.stRefresh();
		},
		
		/**
		 * Triggers the load of classification data.
		 * @param {object} oModel The model.
		 * @param {object} oBindingContext The BindingContext.
		 * @param {object} oExtensionAPI The ExtensionAPI.
		 * @public
		 * @memberof ClassificationComponent
		 * @instance
		 */
		stRefresh: function(oModel, oBindingContext, oExtensionAPI) {
			this._clearLastVisibleContext();
			this._registerMessageFilter();
			this._checkChangeNumber();
			
			this._stRefresh();
		},

		/**
		 * Should be called when context is already created and the object is the same and 
		 * only some other properties are refreshed (like change number).
		 * @public
		 * @memberof ClassificationComponent
		 * @instance
		 */
		refreshContext: function() {
			this.oView.getController().loadClassification();
		},

		/**
		 * Update UiMode and the editable property.
		 * @param {object} sUiMode The new Ui mode.
		 * @public
		 * @memberof ClassificationComponent
		 * @instance
		 */
		setUiMode: function(sUiMode) {
			this.setProperty("uiMode", sUiMode);

			var bEditable = sUiMode === UIMode.Create || sUiMode === UIMode.Edit;
			this.getModel(Constants.CLASSIFICATION_COMPONENT_MODEL_NAME).setProperty("/editable", bEditable);
		},

		/**
		 * Update StIsAreaVisible. Currently here just to test new feature.
		 * @param {object} bAreaVisible Value showinf if component is visible or not.
		 * @public
		 * @memberof ClassificationComponent
		 * @instance
		 */
		setStIsAreaVisible: function(bAreaVisible) {
			this.setProperty("stIsAreaVisible", bAreaVisible);

			this._stRefresh();
		},

		/**
		 * Registers message filter and checks change number if the context changed. 
		 * Loads classification data if context changed and the facet is visible.
		 * @private
		 * @memberof ClassificationComponent
		 * @instance
		 */
		_stRefresh: function() {
			if (this._lastVisibleContextChanged() && this.getStIsAreaVisible()) {
				this._updateLastVisibleContext();
				
				var oModel = this.oView.getModel();
				
				// Replace the genuine odata model with the facade.
				if (!(oModel instanceof ODataFacadeModel)) {
					
					var fnViewProvider = function() {
						return this.oView;
					}.bind(this);
					
					// Set required metadata entities in array as soon as v4 becomes in use.
					oModel = ODataFacadeModelFactory.createFacadeModel(oModel, [ ], fnViewProvider);
					
					this.oView.setModel(oModel);
				}
				
				var oOriginCtx = this.getBindingContext();
				
				if (oOriginCtx) {
					// get data for context from origin model
					var oOriginCtxData = oModel.getOriginModel().getProperty(oOriginCtx.getPath());
					
					// transfer the context data to facade model
					oModel.storePreloadedData(oOriginCtxData, oOriginCtx.getPath());
					
					// create a binding context referring to facade model
					var oBindingCtx = oModel.createBindingContext(oOriginCtx.getPath(), 
							undefined, // oContext 
							undefined, // mParameters 
							undefined, // oContext 
							false,     // bReload 
							false);
					
					// set the new binding context to the view
					this.oView.setBindingContext(oBindingCtx);
				}
				
				oModel.metadataLoaded().then(function() {
					this.oView.getController().loadClassification();
				}.bind(this));	
			}
		},

		/**
		 * Register message filter provider for the current context.
		 * @private
		 * @memberof ClassificationComponent
		 * @instance
		 */
		_registerMessageFilter: function() {
			var sDraftKey = encodeURIComponent(this.getDraftKey());

			if (this._fnResolveMessageFilter) {
				this._fnResolveMessageFilter(sDraftKey);
			}
		},

		/**
		 * Check if change number is provided and add message in that case.
		 * @private
		 * @memberof ClassificationComponent
		 * @instance
		 */
		_checkChangeNumber: function() {
			var sContextId = ClassificationService.getService().getClassificationContextId(this.getModel(Constants.CLASSIFICATION_COMPONENT_MODEL_NAME).getData());
			var sContextIdEnc = encodeURIComponent(sContextId);
			var oMessageManager = sap.ui.getCore().getMessageManager();

			// Add message if change number is provided by embedding application
			// Only one instance of this message should exist at any given time, at most.
			oMessageManager.removeMessages(this.oMessage);

			if (this.getProperty("changeNumber")) {
				this.oMessage = new sap.ui.core.message.Message({
					message: this.getModel("i18n").getResourceBundle().getText("CLF_ECN_IGNORED"),
					type: sap.ui.core.MessageType.Warning,
					processor: this.getModel(),
					target: sContextIdEnc
				});

				oMessageManager.addMessages(this.oMessage);
			}
		},

		/**
		 * Define what messages should appear in the message box of the smart template application.
		 * Must only be called once!
		 * @private
		 * @memberof ClassificationComponent
		 * @instance
		 * @returns {object} Returns a promise later resolved to the desired message filters
		 */
		_setMessageFilterPromise: function() {
			return new Promise(function(fnResolve) {
				this._fnResolveMessageFilter = function(sDraftKey) {
					// Don't resolve for the same draft key again.
					if (!sDraftKey || this.sResolvedForDraftKeyId === sDraftKey) {
						return;
					}

					this.sResolvedForDraftKeyId = sDraftKey;
					fnResolve(
						new sap.ui.model.Filter({
							filters: [	
								new sap.ui.model.Filter({
									path: "target",
									operator: sap.ui.model.FilterOperator.Contains,
									value1: "CLF"
								}),
								new sap.ui.model.Filter({
									path: "target",
									operator: sap.ui.model.FilterOperator.Contains,
									value1: sDraftKey
								})
							],
							and: true
						})
					);
				}.bind(this);
			}.bind(this));
		},
		
		/**
		 * Updates the value of last loaded context.
		 * @private
		 * @memberof ClassificationComponent
		 * @instance
		 */
		_updateLastVisibleContext: function() {
			this._lastVisibleContext.objectKey = this.getObjectKey();
			this._lastVisibleContext.draftKey = this.getDraftKey();
		},
		
		/**
		 * Clears the last visible context.
		 * @private
		 * @memberof ClassificationComponent
		 * @instance
		 */
		_clearLastVisibleContext: function() {
			this._lastVisibleContext = {
				objectKey: "",
				draftKey: ""
			};
		},
		
		/**
		 * Checks wether the last loaded context differs from the current.
		 * @private
		 * @memberof ClassificationComponent
		 * @instance
		 * @returns {object} Returns a boolean
		 */
		_lastVisibleContextChanged: function() {
			if (this._lastVisibleContext.objectKey === this.getObjectKey() &&
				this._lastVisibleContext.draftKey === this.getDraftKey()) {
				return false;    	
			}
			
			return true;
		}
	});
});
