/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/json/JSONModel",
	"sap/i2d/lo/lib/zvchclfz/common/Constants",
	"i2d/lo/app/zvchclfz/config/legacyintegration/util/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/HeaderConfiguration",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/type/LegacyScenario",
	"i2d/lo/app/zvchclfz/config/legacyintegration/types/ErrorState"
], function (UIComponent, ODataModel, JSONModel, VchClfConstants, Constants, HeaderConfiguration, LegacyScenario, ErrorState) {

	"use strict";

	return UIComponent.extend("i2d.lo.app.zvchclfz.config.legacyintegration.Component", {

		metadata: {
			manifest: "json",
			properties: {
				uiMode: {
					type: "string",
					defaultValue: "Display"
				},

				/** The semantic object for which the configuration should be created */
				semanticObject: {
					type: "string"
				},

				/** The key of the object which should be used to create the configuration */
				objectKey: {
					type: "string"
				},

				/** The draft key to use */
				draftKey: {
					type: "string"
				},

				/** Whether the draft key is a string or not  */
				draftKeyIsString: {
					type: "boolean",
					defaultValue: true
				},

				/** embedded in WebGUI frame - note: string type to support assignment by URL parameter */
				embeddedInWebGUI: {
					type: "string",
					defaultValue: "false"
				},

				/** The name of the model which should be used */
				modelName: {
					type: "string"
				},

				isRunningWithMockserver: {
					type: "boolean",
					defaultValue: false
				},

				/** Defines if the wrapper is run in a legacy scenario or not */
				isLegacyScenario: {
					type: "string",
					defaultValue: "X"
				}
			},
			aggregations: {
				headerConfiguration: {
					type: "sap.i2d.lo.lib.zvchclfz.components.configuration.HeaderConfiguration",
					multiple: false
				}
			}
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			UIComponent.prototype.init.apply(this, arguments);

			this.getRouter().initialize();
			this._handleStartupParameters();
			var oMessageModel = sap.ui.getCore().getMessageManager().getMessageModel();
			this.setModel(oMessageModel, "messageModel");
		},

		_handleStartupParameters: function () {
			if (this.getComponentData() && this.getComponentData().startupParameters) {
				var oStartupParams = this.getComponentData().startupParameters;
				var oCompParams = this.getMetadata().getProperties();

				$.each(oCompParams, function (sParamId, oCompParam) {
					var startupValue = oStartupParams[sParamId] && typeof oStartupParams[sParamId][0] !== "undefined" ?
						oCompParam.getType().parseValue(oStartupParams[sParamId][0]) : oCompParam.getDefaultValue();

					if (typeof startupValue === "undefined") {
						return true; //continue
					}
					this.setProperty(sParamId, startupValue);
					var sMapKey = "/" + sParamId;
					this._getAppModel().setProperty(sMapKey, startupValue);
				}.bind(this));
			}
		},

		createContent: function () {
			this._oConfigView = sap.ui.view({
				id: this.createId("configApp"),
				viewName: "i2d.lo.app.zvchclfz.config.legacyintegration.view.App",
				type: sap.ui.core.mvc.ViewType.XML
			});
			return this._oConfigView;
		},

		onBeforeRendering: function () {
			if (!this._isSettingsValid()) {
				this._getAppModel().setProperty("/errorState", ErrorState.SettingsError);
				this.getRouter().navTo("error");
			}
		},
		
		setUiMode: function (sUIMode) {
			this.setProperty("uiMode", sUIMode);
			this._getAppModel().setProperty("/uiMode", sUIMode);
		},

		setSemanticObject: function (sSemanticObject) {
			this.setProperty("semanticObject", sSemanticObject);
			this._getAppModel().setProperty("/semanticObject", sSemanticObject);
		},

		setObjectKey: function (sObjectKey) {
			this.setProperty("objectKey", sObjectKey);
			this._getAppModel().setProperty("/objectKey", sObjectKey);
		},

		setDraftKey: function (sDraftKey) {
			this.setProperty("draftKey", sDraftKey);
			this._getAppModel().setProperty("/draftKey", sDraftKey);
		},

		setDraftKeyIsString: function (sDraftKeyIsString) {
			this.setProperty("draftKeyIsString", sDraftKeyIsString);
			this._getAppModel().setProperty("/draftKeyIsString", sDraftKeyIsString);
		},

		setModelName: function (sModelName) {
			this.setProperty("modelName", sModelName);
			this._getAppModel().setProperty("/modelName", sModelName);
		},

		setEmbeddedInWebGUI: function (sEmbeddedInWebGUI) {
			this.setProperty("embeddedInWebGUI", sEmbeddedInWebGUI);
			this._getAppModel().setProperty("/embeddedInWebGUI", sEmbeddedInWebGUI);
		},

		setIsLegacyScenario: function (sIsLegacyScenario) {
			this.setProperty("isLegacyScenario", sIsLegacyScenario);
			this._getAppModel().setProperty("/isLegacyScenario", sIsLegacyScenario);
		},

		setIsRunningWithMockserver: function (sIsRunningWithMockserver) {
			this.setProperty("isRunningWithMockserver", sIsRunningWithMockserver);
			this._getAppModel().setProperty("/isRunningWithMockserver", sIsRunningWithMockserver);
		},

		_isSettingsValid: function () {
			return !(this.getUiMode() === "Edit" && this.getIsLegacyScenario() === "");
		},

		_getAppModel: function () {
			return this.getModel("appModel");
		}
	});
});