/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/configuration/BaseConfigurationComponent",
	"sap/suite/ui/generic/template/extensionAPI/ReuseComponentSupport",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/HeaderConfiguration",
	"sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/i2d/lo/lib/zvchclfz/common/util/Toggle",
	"sap/ui/base/ManagedObject",
	"sap/ui/model/Context",
	"sap/ui/model/json/JSONModel",
	"sap/i2d/lo/lib/zvchclfz/common/odataFacade/ODataFacadeModel"
], function (BaseConfigurationComponent, ReuseComponentSupport, HeaderConfiguration, Constants, Toggle, ManagedObject,
     Context, JSONModel, ODataFacadeModel) {

	"use strict";

	/**
	 * The configuration component is used to display the variant configuration.
	 * 
	 * @class
	 * Creates and initializes a new Configuration Component with the given <code>sId</code> and
	 * settings.
	 * 
	 * The set of allowed entries in the <code>mSettings</code> object depends on
	 * the concrete subclass and is described there. See {@link sap.ui.core.UIComponent}
	 * for a general description of this argument.
	 *
	 * @param {string}
	 *            [sId] Optional ID for the new control; generated automatically if
	 *            no non-empty ID is given Note: this can be omitted, no matter
	 *            whether <code>mSettings</code> will be given or not!
	 * @param {object}
	 *            [mSettings] optional map/JSO
	 
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.zvchclfz.components.smarttemplate.configuration.Component
	 * @extends sap.ui.core.UIComponent
	 */
	return BaseConfigurationComponent.extend("sap.i2d.lo.lib.zvchclfz.components.smarttemplate.configuration.Component", { /** @lends sap.i2d.lo.lib.vchclf.components.smarttemplate.configuration.Component.prototype */

		metadata: {
			manifest: "json",
			properties: {
				extensionAPI: {
					type: "object"
				},
				headerConfigurationJSON: {
					type: "object"
				}
			}
		},

		_bInitialLoad: true,
		_fnResolveMessageFilter: undefined,
		_oRefreshListenerDataBinding: undefined,

		/**
		 * @private
		 */
		_registerRefreshListener: function () {
			this._unregisterRefreshListener();
			// Register a new change listener for classification sideeffect.
			var oOriginModel = this.getModel(Constants.VCHCLF_MODEL_NAME).getOriginModel();
			this._oRefreshListenerDataBinding = oOriginModel.bindProperty("ConfigurationSideEffect", this.getBindingContext());
			this._oRefreshListenerDataBinding.attachChange(this.reload, this);
		},

		/**
		 * @private
		 */
		_unregisterRefreshListener: function () {
			// Destroy change listener if already exists. If the same item is opened twice it could cause duplicate calls otherwise.
			if (this._oRefreshListenerDataBinding) {
				this._oRefreshListenerDataBinding.detachChange(this.reload, this);
				this._oRefreshListenerDataBinding.destroy();
				delete this._oRefreshListenerDataBinding;
			}
		},

		/**
		 * @private
		 */
		_setMessageFilterPromise: function () {
			return new Promise(function (fnResolve) {
				this._fnResolveMessageFilter = function (sContextId) {
					fnResolve(
						new sap.ui.model.Filter({
							path: "target",
							operator: sap.ui.model.FilterOperator.Contains,
							value1: sContextId
						})
					);
					this._fnResolveMessageFilter = undefined;
				};
			}.bind(this));
		},

		/**
		 * @override
		 */
		init: function () {
			BaseConfigurationComponent.prototype.init.apply(this, arguments);
			// Transforms this component into a reuse component for smart templates.
			// @TODO: Check if this works with non-st apps.
			ReuseComponentSupport.mixInto(this);
		},

		/**
		 * @override
		 */
		exit: function () {
			this._unregisterRefreshListener();
		},

		setHeaderConfigurationJSON: function (mHeaderConfiguration) {
			this.setProperty("headerConfigurationJSON", mHeaderConfiguration);
			var oCurrentHeaderConfiguration = this.getHeaderConfiguration();
			if (oCurrentHeaderConfiguration) {
				oCurrentHeaderConfiguration.destroy();
			}
			this.setHeaderConfiguration(new HeaderConfiguration(mHeaderConfiguration));
		},

		/**
		 * Sets the draftTransactionController property and registers the message filter provider and then calls stRefresh.
		 * @param {object} oModel The model.
		 * @param {object} oBindingContext The BindingContext.
		 * @param {object} oExtensionAPI The ExtensionAPI.
		 * @public
		 */
		stStart: function (oModel, oBindingContext, oExtensionAPI) {
			oExtensionAPI.registerMessageFilterProvider(this._setMessageFilterPromise.bind(this));
			this._bIsSmartTemplate = true;
			oExtensionAPI.addFooterBarToPage(this);
			this.stRefresh(oModel, oBindingContext, oExtensionAPI);
		},
					
		setBindingContext: function(oContext, sModelName) {
			if (oContext) {
				var oModel = oContext.getModel("vchclf");
				if (!(oModel instanceof ODataFacadeModel)) {
					var oCtxData = oContext.getObject();
					var oFacadeModel = this.setModel(oModel, Constants.VCHCLF_MODEL_NAME);
					oContext = new Context(oFacadeModel, oContext.getPath());
					oFacadeModel.metadataLoaded().then(function() {
						oFacadeModel.storePreloadedData(oCtxData, null, oContext);
					}.bind(this));	
				}
			}
			
			ManagedObject.prototype.setBindingContext.apply(this, [oContext, sModelName]);
			
		},

		/**
		 * Creates a classification context.
		 * @param {object} oModel The model.
		 * @param {object} oBindingContext The BindingContext.
		 * @param {object} oExtensionAPI The ExtensionAPI.
		 * @public
		 */
		stRefresh: function (oModel, oBindingContext, oExtensionAPI) {
			this.setExtensionAPI(oExtensionAPI);
			var bReload = true;
			var fnGetConfigObjectEntitySetNameByName = function (sConfigObjectEntitySetName) {
				var aKeys = oExtensionAPI.getNavigationController().getCurrentKeys();
				var sKeyValue = "";
				jQuery.each(aKeys, function (iIndex, sValue) {
					if (sValue && typeof sValue === "string" && sValue.indexOf(sConfigObjectEntitySetName) === 0) {
						sKeyValue = sValue;
						return false;
					}
				}.bind(this));
				return sKeyValue;
			};
			if (!oModel) {
				//no model was provided
				jQuery.sap.log.error("No VCHCLF model available - model was not provided by caller");
			}
			this.setModel(oModel, Constants.VCHCLF_MODEL_NAME);
			this.initConfigurationDAO();
			this.setBusy(true);

			var fnAfterMetadataLoaded = function (fnResolve, fnReject) {
				var sContextIdEnc;
				var sConfigObjectEntitySetName = this.getInternalNavSettings().configObjectEntitySetName;
				var sNewDefaultBindingPath = "/" + fnGetConfigObjectEntitySetNameByName(sConfigObjectEntitySetName);
				this._registerRefreshListener();
				this.createComponents();
				if (sConfigObjectEntitySetName && sNewDefaultBindingPath.length > 1) {
					this.updateConfigObjectBindingContext(sNewDefaultBindingPath).then(function () {
						var sOldObjectKey = this.getObjectKey();
						sContextIdEnc = decodeURIComponent(this.buildContextIdForInternalNavigation());
						var sNewObjectKey = this.getObjectKey();
						//the default binding context has changed
						//the message filter has to be registered with the new context id
						if (this._fnResolveMessageFilter) {
							this._fnResolveMessageFilter(sContextIdEnc);
						}
						// stRefresh is triggered a second time after updating the default binding context.
						// Since the new default context is already changed and it is only important for the configuration header bindings 
						// there is no need to reload the configuration context.
						// We want to avoid the unnecessary batch request. 
						// A reload is only necessary for initial load and if the default binding context has changed
						bReload = sOldObjectKey !== sNewObjectKey || this._bInitialLoad;
						if (bReload) {
							this.reload();
							this._bInitialLoad = false;
						} else {
							this.setBusy(false);
						}
						fnResolve();
					}.bind(this));
				} else {
					sContextIdEnc = decodeURIComponent(this.buildContextId());
					if (this._fnResolveMessageFilter) {
						this._fnResolveMessageFilter(sContextIdEnc);
					}
					this.reload();
					fnResolve();
				}

			};

			return new Promise(function (fnResolve, fnReject) {
				this.getModel(Constants.VCHCLF_MODEL_NAME).metadataLoaded().then(fnAfterMetadataLoaded.bind(this, fnResolve, fnReject));
			}.bind(this));
		},

		/**
		 * When the parent componet runs in a smart template, then the extension API needs to be passed
		 * 
		 * @param {String} oExtensionAPI The extension API to set
		 * @public
		 */
		setExtensionAPI: function (oExtensionAPI) {
			this.setProperty("extensionAPI", oExtensionAPI);
			this.getConfigurationSettingsModel().setProperty("/extensionAPI", oExtensionAPI);
			var oTransactionController = null;
			if (oExtensionAPI) {
				oTransactionController = oExtensionAPI.getTransactionController();
			}
			this.getConfigurationSettingsModel().setProperty("/transactionController", oTransactionController);
		}

	});
});
