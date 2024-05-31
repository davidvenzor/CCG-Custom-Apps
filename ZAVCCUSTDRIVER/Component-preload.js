//@ui5-bundle i2d/lo/app/zvchclfz/config/legacyintegration/Component-preload.js
/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.predefine('i2d/lo/app/zvchclfz/config/legacyintegration/Component', ["sap/ui/core/UIComponent", "sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/json/JSONModel", "sap/i2d/lo/lib/zvchclfz/common/Constants", "i2d/lo/app/zvchclfz/config/legacyintegration/util/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/HeaderConfiguration",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/type/LegacyScenario", "i2d/lo/app/zvchclfz/config/legacyintegration/types/ErrorState"
], function (U, O, J, V, C, H, L, E) {
	"use strict";
	return U.extend("i2d.lo.app.zvchclfz.config.legacyintegration.Component", {
		metadata: {
			manifest: "json",
			properties: {
				uiMode: {
					type: "string",
					defaultValue: "Display"
				},
				semanticObject: {
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
					defaultValue: true
				},
				embeddedInWebGUI: {
					type: "string",
					defaultValue: "false"
				},
				modelName: {
					type: "string"
				},
				isRunningWithMockserver: {
					type: "boolean",
					defaultValue: false
				},
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
		init: function () {
			U.prototype.init.apply(this, arguments);
			this.getRouter().initialize();
			this._handleStartupParameters();
			var m = sap.ui.getCore().getMessageManager().getMessageModel();
			this.setModel(m, "messageModel");
		},
		_handleStartupParameters: function () {
			if (this.getComponentData() && this.getComponentData().startupParameters) {
				var s = this.getComponentData().startupParameters;
				var c = this.getMetadata().getProperties();
				$.each(c, function (p, o) {
					var a = s[p] && typeof s[p][0] !== "undefined" ? o.getType().parseValue(s[p][0]) : o.getDefaultValue();
					if (typeof a === "undefined") {
						return true;
					}
					this.setProperty(p, a);
					var m = "/" + p;
					this._getAppModel().setProperty(m, a);
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
				this._getAppModel().setProperty("/errorState", E.SettingsError);
				this.getRouter().navTo("error");
			}
		},
		setUiMode: function (u) {
			this.setProperty("uiMode", u);
			this._getAppModel().setProperty("/uiMode", u);
		},
		setSemanticObject: function (s) {
			this.setProperty("semanticObject", s);
			this._getAppModel().setProperty("/semanticObject", s);
		},
		setObjectKey: function (o) {
			this.setProperty("objectKey", o);
			this._getAppModel().setProperty("/objectKey", o);
		},
		setDraftKey: function (d) {
			this.setProperty("draftKey", d);
			this._getAppModel().setProperty("/draftKey", d);
		},
		setDraftKeyIsString: function (d) {
			this.setProperty("draftKeyIsString", d);
			this._getAppModel().setProperty("/draftKeyIsString", d);
		},
		setModelName: function (m) {
			this.setProperty("modelName", m);
			this._getAppModel().setProperty("/modelName", m);
		},
		setEmbeddedInWebGUI: function (e) {
			this.setProperty("embeddedInWebGUI", e);
			this._getAppModel().setProperty("/embeddedInWebGUI", e);
		},
		setIsLegacyScenario: function (i) {
			this.setProperty("isLegacyScenario", i);
			this._getAppModel().setProperty("/isLegacyScenario", i);
		},
		setIsRunningWithMockserver: function (i) {
			this.setProperty("isRunningWithMockserver", i);
			this._getAppModel().setProperty("/isRunningWithMockserver", i);
		},
		_isSettingsValid: function () {
			return !(this.getUiMode() === "Edit" && this.getIsLegacyScenario() === "");
		},
		_getAppModel: function () {
			return this.getModel("appModel");
		}
	});
});
sap.ui.predefine('i2d/lo/app/zvchclfz/config/legacyintegration/controller/App.controller', ["sap/ui/core/mvc/Controller"], function (C) {
	"use strict";
	return C.extend("i2d.lo.app.zvchclfz.config.legacyintegration.controller.App", {
		onInit: function () {}
	});
});
sap.ui.predefine('i2d/lo/app/zvchclfz/config/legacyintegration/controller/Config.controller', ["sap/ui/core/mvc/Controller",
	"sap/m/MessagePopover", "sap/m/MessagePopoverItem", "sap/i2d/lo/lib/zvchclfz/components/configuration/type/LegacyScenario",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/HeaderConfiguration", "i2d/lo/app/zvchclfz/config/legacyintegration/util/Formatter",
	"sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/i2d/lo/lib/zvchclfz/components/configuration/HeaderField",
	"sap/m/OverflowToolbar", "sap/m/Button", "sap/m/ToolbarSpacer",
], function (C, M, a, L, H, F, b, c, d, O, B, T) {
	"use strict";
	return C.extend("i2d.lo.app.zvchclfz.config.legacyintegration.controller.Config", {
		_iRequestCount: 0,
		onInit: function () {
			this.oMessagePopover = new M({
				items: {
					id: "starterAppMessagePopover",
					path: "messageModel>/",
					template: new a({
						type: "{messageModel>type}",
						title: "{messageModel>message}",
						longtextUrl: "{messageModel>descriptionUrl}"
					})
				}
			});
			var m = sap.ui.getCore().getMessageManager().getMessageModel();
			this.oMessagePopover.setModel(m, "messageModel");
		},
		_getFooterForConfigUI: function () {
			if (this._oFooter) {
				return this._oFooter;
			} else {
				return this._oFooter = new O({
					id: "footerToolbar",
					visible: "{= !(${appModel>/isLegacyScenario} === '')}",
					content: [new B({
							id: "footerToolbar--messagePopoverButton",
							icon: "sap-icon://message-popup",
							text: "{= ${messageModel>/}.length}",
							type: sap.m.ButtonType.Emphasized,
							visible: "{= ${messageModel>/}.length > 0 }",
							press: this.handleMessagePopoverPress.bind(this)
						}), new T(),

						new B({
							id: "idPrevBtn",
							text: "Previous Item",
							visible: true,
							press: "OnPrevItem"
						}),
						new B({
							id: "idNextBtn",
							text: "Next Item",
							visible: true,
							press: this.OnNextItem.bind(this)
						}),
						new B({
							id: "footerToolbar--doneButton",
							text: "{configStartI18n>done}",
							type: {
								path: 'vchclf>EtoStatus',
								formatter: F.getDoneButtonType
							},
							visible: "{= ${appModel>/uiMode} === 'Edit' || ${appModel>/uiMode} === 'Create' }",
							press: this.handleDoneButtonPress.bind(this)
						}), new B({
							id: "footerToolbar--cancelButton",
							text: "{= (${appModel>/uiMode} === 'Edit' || ${appModel>/uiMode} === 'Create') ? ${configStartI18n>cancel} : ${configStartI18n>close} }",
							type: "{= (${appModel>/uiMode} === 'Edit' || ${appModel>/uiMode} === 'Create') ? 'Default' : 'Emphasized' }",
							press: this.handleCancelButtonPress.bind(this)
						})
					]
				});
			}
		},

// Begin of change 	
		OnNextItem: function(){
			this.onBeforeRendering1();
		},
		
			onBeforeRendering1: function () {
				this.getView().getModel("appModel").oData.draftKey = "12E6DBE71F5B1EDCB887D778209A0608";
				this.getView().getModel("appModel").oData.objectKey = "0000000001000020";
			if (this._oConfigurationComponent) {
				this._oConfigurationComponent.destroy();
				this._oConfigurationComponentContainer = this.getView().byId("configurationComponentContainer");
				this._oConfigurationComponent = this.getOwnerComponent().createComponent({
					usage: "configurationComponent",
					id: "configurationComponent1",
					settings: {
						uiMode: "{appModel>/uiMode}",
						legacyScenario: this._getIsLegacyScenario() ? L.Legacy : L.NonLegacy,
						semanticObject: "{appModel>/semanticObject}",
						objectKey: "{appModel>/objectKey}",
						draftKey: "{appModel>/draftKey}",
						headerConfiguration: new H(),
						footer: this._getFooterForConfigUI()
					},
					async: false
				});
				this._oConfigurationComponentContainer.setComponent(this._oConfigurationComponent);
				var m = this.getView().getModel();
				m.metadataLoaded().then(this._requestHeaderData.bind(this));
				if (m) {
					m.attachRequestCompleted(function () {
						this._iRequestCount--;
						var D = this.getView().byId("doneButton");
						var o = this.getView().byId("cancelButton");
						if (D && this._iRequestCount === 0) {
							D.setEnabled(true);
						}
						if (o && this._iRequestCount === 0) {
							o.setEnabled(true);
						}
					}.bind(this));
					m.attachRequestSent(function () {
						this._iRequestCount++;
						var D = this.getView().byId("doneButton");
						var o = this.getView().byId("cancelButton");
						if (D) {
							D.setEnabled(false);
						}
						if (o) {
							o.setEnabled(false);
						}
					}.bind(this));
				}
				var v = this.getView();
				this._oConfigurationComponent.attachHandedoverToEngineering(this._triggerGUIAction.bind(this, v, "APPLY", null));
				this._oConfigurationComponent.attachReviewAccepted(this._triggerGUIAction.bind(this, v, "APPLY", null));
				this._oConfigurationComponent.attachPreferredVariantSelected(this._triggerGUIAction.bind(this, v, "APPLY", null));
			}
		},
		
		// End of change
		
		onBeforeRendering: function () {
			if (!this._oConfigurationComponent) {
				this._oConfigurationComponentContainer = this.getView().byId("configurationComponentContainer");
				this._oConfigurationComponent = this.getOwnerComponent().createComponent({
					usage: "configurationComponent",
					id: "configurationComponent",
					settings: {
						uiMode: "{appModel>/uiMode}",
						legacyScenario: this._getIsLegacyScenario() ? L.Legacy : L.NonLegacy,
						semanticObject: "{appModel>/semanticObject}",
						objectKey: "{appModel>/objectKey}",
						draftKey: "{appModel>/draftKey}",
						headerConfiguration: new H(),
						footer: this._getFooterForConfigUI()
					},
					async: false
				});
				this._oConfigurationComponentContainer.setComponent(this._oConfigurationComponent);
				var m = this.getView().getModel();
				m.metadataLoaded().then(this._requestHeaderData.bind(this));
				if (m) {
					m.attachRequestCompleted(function () {
						this._iRequestCount--;
						var D = this.getView().byId("doneButton");
						var o = this.getView().byId("cancelButton");
						if (D && this._iRequestCount === 0) {
							D.setEnabled(true);
						}
						if (o && this._iRequestCount === 0) {
							o.setEnabled(true);
						}
					}.bind(this));
					m.attachRequestSent(function () {
						this._iRequestCount++;
						var D = this.getView().byId("doneButton");
						var o = this.getView().byId("cancelButton");
						if (D) {
							D.setEnabled(false);
						}
						if (o) {
							o.setEnabled(false);
						}
					}.bind(this));
				}
				var v = this.getView();
				this._oConfigurationComponent.attachHandedoverToEngineering(this._triggerGUIAction.bind(this, v, "APPLY", null));
				this._oConfigurationComponent.attachReviewAccepted(this._triggerGUIAction.bind(this, v, "APPLY", null));
				this._oConfigurationComponent.attachPreferredVariantSelected(this._triggerGUIAction.bind(this, v, "APPLY", null));
			}
		},
		handleMessagePopoverPress: function (e) {
			this.oMessagePopover.openBy(e.getSource());
		},
		handleDoneButtonPress: function (e) {
			this._oConfigurationComponent.openDoneDialog(this._triggerGUIAction.bind(this, e.getSource(), "APPLY"));
		},
		handleCancelButtonPress: function (e) {
			this._oConfigurationComponent.openCancelDialog(this._triggerGUIAction.bind(this, e.getSource(), "CANCEL"));
		},
		_getIsLegacyScenario: function () {
			return this._getAppModel().getProperty("/isLegacyScenario");
		},
		_getUiMode: function () {
			return this._getAppModel().getProperty("/uiMode");
		},
		_getEmbeddedInWebGUI: function () {
			return this._getAppModel().getProperty("/embeddedInWebGUI");
		},
		_requestHeaderData: function () {
			this.aHeaderFields = [];
			this.aHeaderActions = [];
			this._oHeaderConfiguration = new H({
				title: "",
				subtitle: ""
			});
			this._oConfigurationComponent.setHeaderConfiguration(this._oHeaderConfiguration);
			this._loadHeaderData();
		},
		_loadHeaderData: function () {
			this.getView().getModel().read("/ConfigurationHeaderFieldSet", {
				filters: [new b({
					filters: [new b({
						path: "SemanticObject",
						operator: c.EQ,
						value1: this._getAppModel().getProperty("/semanticObject")
					}), new b({
						path: "DraftKey",
						operator: c.EQ,
						value1: this._getAppModel().getProperty("/draftKey")
					}), new b({
						path: "ObjectKey",
						operator: c.EQ,
						value1: this._getAppModel().getProperty("/objectKey")
					})],
					and: true
				})],
				success: this._updateHeaderData.bind(this),
				error: function () {
					jQuery.sap.log.error("Sales Order Headers could not be read from the backend");
				}
			});
		},
		_updateHeaderData: function (D) {
			this.aHeaderFields = [];
			var t;
			var s;
			var h;
			for (var i = 0; i < D.results.length; i++) {
				var r = D.results[i];
				if (r.Type === 6) {
					s = r.Value;
				} else if (r.Type === 7) {
					t = r.Value;
				} else {
					h = this._createHeaderField(r);
					this.aHeaderFields.push(h);
				}
			}
			this._oHeaderConfiguration.setTitle(t);
			this._oHeaderConfiguration.setSubtitle(s);
			this._oHeaderConfiguration.setHeaderFields(this._getHeaderFields());
			this._oHeaderConfiguration.setHeaderActions(this._getHeaderActions());
			if (this._oConfigurationComponent) {
				this._oConfigurationComponent.setHeaderConfiguration(this._oHeaderConfiguration);
			}
		},
		_createHeaderField: function (o) {
			var h;
			var t;
			switch (o.Type) {
			case 1:
				t = o.Value;
				break;
			case 2:
				if (!o.Description) {
					t = o.Value;
				} else {
					t = this.getView().getModel("configStartI18n").getResourceBundle().getText("ID_AND_DESCR", [o.Description, o.Value]);
				}
				break;
			case 3:
				if (!o.Value) {
					o.Value = "\u2013";
				}
				t = this.getView().getModel("configStartI18n").getResourceBundle().getText("KEY_AND_SUBKEY", [o.Value, o.SubKey]);
				break;
			case 4:
				t = this.getView().getModel("configStartI18n").getResourceBundle().getText("VALUE_AND_UOM", [o.Value, o.UnitOfMeasure]);
				break;
			case 5:
				var D = sap.ui.core.format.DateFormat.getDateInstance({
					style: "medium"
				});
				t = D.format(o.DateField);
				break;
			}
			h = new d({
				description: o.FieldLabel,
				properties: {
					text: t
				},
				controlType: "Text"
			});
			return h;
		},
		_getHeaderFields: function () {
			return this.aHeaderFields;
		},
		_getHeaderActions: function () {
			return this.aHeaderActions;
		},
		_getAppModel: function () {
			return this.getView().getModel("appModel");
		},
		_triggerGUIAction: function (o, A, p) {
			var i = this._getEmbeddedInWebGUI() === 'true';
			var e = {
					"action": A
				},
				l, P, j;
			if (p && typeof p === 'object') {
				e.params = p;
				P = $.param(p);
			}
			if (i) {
				parent.postMessage(JSON.stringify({
					"type": "request",
					"service": "sap.gui.triggerSAPEvent",
					"body": {
						"args": e
					}
				}), "*");
			} else {
				l = o.getId() + "-" + "SapEventHelperLink";
				P = P ? "?" + P : "";
				j = $("<a id='" + l + "' href='SAPEVENT:" + A + P + "' style='display:none'></a>");
				j.appendTo(o.$()).get(0).click();
				j.remove();
			}
		}
	});
});
sap.ui.predefine('i2d/lo/app/zvchclfz/config/legacyintegration/controller/Error.controller', ["sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History", "i2d/lo/app/zvchclfz/config/legacyintegration/types/ErrorState"
], function (C, H, E) {
	"use strict";
	return C.extend("i2d.lo.app.zvchclfz.config.legacyintegration.controller.Error", {
		onInit: function () {},
		getErrorViewTitle: function (e) {
			var r = this.getView().getModel("configStartI18n").getResourceBundle();
			switch (e) {
			case E.HashError:
				return r.getText("ERROR_DIALOG_TITLE_NOTFOUND");
			case E.SettingsError:
				return r.getText("ERROR_DIALOG_TITLE_ERROR");
			}
			return r.getText("ERROR_DIALOG_TITLE_NOTFOUND");
		},
		getErrorViewText: function (e) {
			var r = this.getView().getModel("configStartI18n").getResourceBundle();
			switch (e) {
			case E.HashError:
				return r.getText("ERROR_DIALOG_TEXT_RESOURCE");
			case E.SettingsError:
				return r.getText("ERROR_DIALOG_TEXT_SETTINGS");
			}
			return r.getText("ERROR_DIALOG_TEXT_RESOURCE");
		},
		getErrorViewDescription: function (e) {
			var r = this.getView().getModel("configStartI18n").getResourceBundle();
			switch (e) {
			case E.HashError:
				return r.getText("ERROR_DIALOG_DESCR_RESOURCE");
			case E.SettingsError:
				return r.getText("ERROR_DIALOG_DESCR_SETTINGS");
			}
			return r.getText("ERROR_DIALOG_DESCR_RESOURCE");
		},
		onNavBack: function (e) {
			var h, p;
			h = H.getInstance();
			p = h.getPreviousHash();
			if (p !== undefined) {
				window.history.go(-1);
			}
		}
	});
});
sap.ui.predefine('i2d/lo/app/zvchclfz/config/legacyintegration/types/ErrorState', [], function () {
	"use strict";
	return {
		HashError: "HashError",
		SettingsError: "SettingsError"
	};
}, true);
sap.ui.predefine('i2d/lo/app/zvchclfz/config/legacyintegration/types/LegacyScenarioType', [], function () {
	"use strict";
	return {
		NonLegacy: "",
		Legacy: "X"
	};
}, true);
sap.ui.predefine('i2d/lo/app/zvchclfz/config/legacyintegration/util/Constants', function () {
	var C = {
		SEMANTIC_OBJECT: {
			SALES_ORDER: "SalesOrder"
		},
		ETO_STATUS: {
			PROCESSING_STARTED: "IETST",
			READY_FOR_ENGINEERING: "IETRE",
			IN_PROCESS_BY_ENGINEERING: "IETPE",
			ENGINEERING_FINISHED: "IETFE",
			PROCESSING_FINISHED: "IETCO",
			REVIEW_FINISHED_BY_SALES: "IETRD",
			REVISED_BY_SALES: "IETRS",
			REENGINEERING_NEEDED: "IETHB"
		}
	};
	return C;
});
sap.ui.predefine('i2d/lo/app/zvchclfz/config/legacyintegration/util/Formatter', ["sap/m/ButtonType",
	"i2d/lo/app/zvchclfz/config/legacyintegration/util/Constants"
], function (B, C) {
	"use strict";
	var f = {
		keyAndSubkey: function (i, k, s) {
			if (!k) {
				k = "-";
			}
			if (!s) {
				return k;
			}
			return jQuery.sap.formatMessage(i, [k, s]);
		},
		idAndDescription: function (i, I, d) {
			return jQuery.sap.formatMessage(i, [d, I]);
		},
		valueAndUnitOfMeasure: function (i, v, u) {
			return jQuery.sap.formatMessage(i, [v, u]);
		},
		getDoneButtonType: function (e) {
			if (!e) {
				return B.Emphasized;
			}
			if (e === C.ETO_STATUS.PROCESSING_STARTED || e === C.ETO_STATUS.ENGINEERING_FINISHED || e === C.ETO_STATUS.REVIEW_FINISHED_BY_SALES ||
				e === C.ETO_STATUS.REVISED_BY_SALES) {
				return B.Default;
			} else {
				return B.Emphasized;
			}
		}
	};
	return f;
}, true);
sap.ui.predefine('i2d/lo/app/zvchclfz/config/legacyintegration/util/Toggle', [], function () {
	"use strict";
	return {
		isActive: function (i) {
			var t = true;
			var m = this.getModel();
			var f = m.getProperty("/ToggleSet('" + i + "')");
			if (f) {
				t = !!f.ToggleStatus;
			}
			return t;
		}
	};
});
sap.ui.require.preload({
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=Close\nUnlock=Unlock Configuration\nERROR_DIALOG_DESCR_SETTINGS=Edit mode in combination with a non-legacy scenario is not supported.\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=The provided settings for the app are not supported.\nShipToParty=Ship-To-Party\\:\nLock=Lock Configuration\ncancel=Cancel\nVARIANT_MATCHING=Match Variant\nappTitle=Variant Configuration\nConfigurationStatus=Configuration Status\nERROR_DIALOG_DESCR_RESOURCE=Please check the URL and try again.\nConfigurationDate=Date\\:\nERROR_DIALOG_TEXT_RESOURCE=The requested resource is not available.\nOrderQuantity=Order Quantity\\:\nSalesDocument=Sales Document\\:\nKEY_AND_SUBKEY={0} / {1}\nMaterial=Material\nERROR_DIALOG_TITLE_NOTFOUND=Not Found\nclose=Close\ndone=Done\nERROR_DIALOG_TITLE_ERROR=Error\napply=Apply\nappDescription=Variant Configuration\nNO_TITLE=No Title available for SalesOrderTest and Product\ntitle=Variant Configuration\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_ar.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=\\u0625\\u063A\\u0644\\u0627\\u0642\nUnlock=\\u0625\\u0644\\u063A\\u0627\\u0621 \\u062A\\u0623\\u0645\\u064A\\u0646 \\u0627\\u0644\\u062A\\u0643\\u0648\\u064A\\u0646\nERROR_DIALOG_DESCR_SETTINGS=\\u0646\\u0645\\u0637 \\u0627\\u0644\\u062A\\u062D\\u0631\\u064A\\u0631 \\u0645\\u0639 \\u0633\\u064A\\u0646\\u0627\\u0631\\u064A\\u0648 \\u063A\\u064A\\u0631 \\u0642\\u062F\\u064A\\u0645 \\u063A\\u064A\\u0631 \\u0645\\u062F\\u0639\\u0648\\u0645.\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=\\u0627\\u0644\\u0625\\u0639\\u062F\\u0627\\u062F\\u0627\\u062A \\u0627\\u0644\\u0645\\u062A\\u0648\\u0641\\u0631\\u0629 \\u0644\\u0644\\u062A\\u0637\\u0628\\u064A\\u0642 \\u063A\\u064A\\u0631 \\u0645\\u062F\\u0639\\u0648\\u0645\\u0629.\nShipToParty=\\u0645\\u0633\\u062A\\u0644\\u0650\\u0645 \\u0627\\u0644\\u0634\\u062D\\u0646\\:\nLock=\\u062A\\u0623\\u0645\\u064A\\u0646 \\u0627\\u0644\\u062A\\u0643\\u0648\\u064A\\u0646\ncancel=\\u0625\\u0644\\u063A\\u0627\\u0621\nVARIANT_MATCHING=\\u0645\\u0637\\u0627\\u0628\\u0642\\u0629 \\u0627\\u0644\\u0645\\u062A\\u063A\\u064A\\u0631\nappTitle=\\u062A\\u0643\\u0648\\u064A\\u0646 \\u0627\\u0644\\u0645\\u062A\\u063A\\u064A\\u0631\\u0627\\u062A\nConfigurationStatus=\\u062D\\u0627\\u0644\\u0629 \\u0627\\u0644\\u062A\\u0643\\u0648\\u064A\\u0646\nERROR_DIALOG_DESCR_RESOURCE=\\u0627\\u0644\\u0631\\u062C\\u0627\\u0621 \\u0627\\u0644\\u062A\\u062D\\u0642\\u0642 \\u0645\\u0646 \\u0627\\u0644\\u0631\\u0627\\u0628\\u0637 \\u0648\\u0625\\u0639\\u0627\\u062F\\u0629 \\u0627\\u0644\\u0645\\u062D\\u0627\\u0648\\u0644\\u0629.\nConfigurationDate=\\u0627\\u0644\\u062A\\u0627\\u0631\\u064A\\u062E\\:\nERROR_DIALOG_TEXT_RESOURCE=\\u0627\\u0644\\u0645\\u0648\\u0631\\u062F \\u0627\\u0644\\u0645\\u0637\\u0644\\u0648\\u0628 \\u063A\\u064A\\u0631 \\u0645\\u062A\\u0648\\u0641\\u0631.\nOrderQuantity=\\u0643\\u0645\\u064A\\u0629 \\u0627\\u0644\\u0623\\u0645\\u0631\\:\nSalesDocument=\\u0645\\u0633\\u062A\\u0646\\u062F \\u0627\\u0644\\u0645\\u0628\\u064A\\u0639\\u0627\\u062A\\:\nKEY_AND_SUBKEY={0} / {1}\nMaterial=\\u0627\\u0644\\u0645\\u0627\\u062F\\u0629\nERROR_DIALOG_TITLE_NOTFOUND=\\u063A\\u064A\\u0631 \\u0645\\u0648\\u062C\\u0648\\u062F\\u0629\nclose=\\u0625\\u063A\\u0644\\u0627\\u0642\ndone=\\u062A\\u0645\nERROR_DIALOG_TITLE_ERROR=\\u062E\\u0637\\u0623\napply=\\u062A\\u0637\\u0628\\u064A\\u0642\nappDescription=\\u062A\\u0643\\u0648\\u064A\\u0646 \\u0627\\u0644\\u0645\\u062A\\u063A\\u064A\\u0631\\u0627\\u062A\nNO_TITLE=(\\u0644\\u064A\\u0633 \\u0630\\u0627 \\u0635\\u0644\\u0629 \\u0628\\u0627\\u0644\\u062A\\u0631\\u062C\\u0645\\u0629)\ntitle=\\u062A\\u0643\\u0648\\u064A\\u0646 \\u0627\\u0644\\u0645\\u062A\\u063A\\u064A\\u0631\\u0627\\u062A\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_bg.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=\\u0417\\u0430\\u0442\\u0432\\u0430\\u0440\\u044F\\u043D\\u0435\nUnlock=\\u041E\\u0442\\u043A\\u043B\\u044E\\u0447\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u043A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u044F\nERROR_DIALOG_DESCR_SETTINGS=\\u041D\\u0435 \\u0441\\u0435 \\u043F\\u043E\\u0434\\u0434\\u044A\\u0440\\u0436\\u0430 \\u0440\\u0435\\u0436\\u0438\\u043C \\u0437\\u0430 \\u0440\\u0435\\u0434\\u0430\\u043A\\u0442\\u0438\\u0440\\u0430\\u043D\\u0435 \\u0432 \\u043A\\u043E\\u043C\\u0431\\u0438\\u043D\\u0430\\u0446\\u0438\\u044F \\u0441 \\u043D\\u0435\\u043D\\u0430\\u0441\\u043B\\u0435\\u0434\\u0435\\u043D \\u0441\\u0446\\u0435\\u043D\\u0430\\u0440\\u0438\\u0439.\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=\\u0417\\u0430\\u0434\\u0430\\u0434\\u0435\\u043D\\u0438\\u0442\\u0435 \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438 \\u0437\\u0430 \\u043F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u0435\\u0442\\u043E \\u043D\\u0435 \\u0441\\u0435 \\u043F\\u043E\\u0434\\u0434\\u044A\\u0440\\u0436\\u0430\\u0442.\nShipToParty=\\u041F\\u043E\\u043B\\u0443\\u0447\\u0430\\u0442\\u0435\\u043B \\u043D\\u0430 \\u0435\\u043A\\u0441\\u043F\\u0435\\u0434\\u0438\\u0446\\u0438\\u044F\\:\nLock=\\u0417\\u0430\\u043A\\u043B\\u044E\\u0447\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u043A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u044F\ncancel=\\u041E\\u0442\\u043A\\u0430\\u0437\nVARIANT_MATCHING=\\u0421\\u044A\\u043F\\u043E\\u0441\\u0442\\u0430\\u0432\\u044F\\u043D\\u0435 \\u043D\\u0430 \\u0432\\u0430\\u0440\\u0438\\u0430\\u043D\\u0442\nappTitle=\\u041A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u044F \\u043D\\u0430 \\u0432\\u0430\\u0440\\u0438\\u0430\\u043D\\u0442\nConfigurationStatus=\\u0421\\u0442\\u0430\\u0442\\u0443\\u0441 \\u043D\\u0430 \\u043A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u044F\nERROR_DIALOG_DESCR_RESOURCE=\\u041C\\u043E\\u043B\\u044F, \\u043F\\u0440\\u043E\\u0432\\u0435\\u0440\\u0435\\u0442\\u0435 URL \\u0430\\u0434\\u0440\\u0435\\u0441\\u0430 \\u0438 \\u043E\\u043F\\u0438\\u0442\\u0430\\u0439\\u0442\\u0435 \\u043E\\u0442\\u043D\\u043E\\u0432\\u043E.\nConfigurationDate=\\u0414\\u0430\\u0442\\u0430\\:\nERROR_DIALOG_TEXT_RESOURCE=\\u0417\\u0430\\u044F\\u0432\\u0435\\u043D\\u0438\\u044F\\u0442 \\u0440\\u0435\\u0441\\u0443\\u0440\\u0441 \\u043D\\u0435 \\u0435 \\u043D\\u0430\\u043B\\u0438\\u0447\\u0435\\u043D.\nOrderQuantity=\\u041A\\u043E\\u043B\\u0438\\u0447.\\u043D\\u0430 \\u043F\\u043E\\u0440\\u044A\\u0447\\u043A\\u0430\nSalesDocument=\\u0414\\u043E\\u043A\\u0443\\u043C\\u0435\\u043D\\u0442 \\u0437\\u0430 \\u043F\\u0440\\u043E\\u0434\\u0430\\u0436\\u0431\\u0438\nKEY_AND_SUBKEY={0} / {1}\nMaterial=\\u041C\\u0430\\u0442\\u0435\\u0440\\u0438\\u0430\\u043B\nERROR_DIALOG_TITLE_NOTFOUND=\\u041D\\u0435 \\u0435 \\u043D\\u0430\\u043C\\u0435\\u0440\\u0435\\u043D\\u043E\nclose=\\u0417\\u0430\\u0442\\u0432\\u0430\\u0440\\u044F\\u043D\\u0435\ndone=\\u0418\\u0437\\u0432\\u044A\\u0440\\u0448\\u0435\\u043D\nERROR_DIALOG_TITLE_ERROR=\\u0413\\u0440\\u0435\\u0448\\u043A\\u0430\napply=\\u041F\\u0440\\u0438\\u043B\\u0430\\u0433\\u0430\\u043D\\u0435\nappDescription=\\u041A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u044F \\u043D\\u0430 \\u0432\\u0430\\u0440\\u0438\\u0430\\u043D\\u0442\nNO_TITLE=(\\u041D\\u0435\\u0440\\u0435\\u043B\\u0430\\u0432\\u0435\\u043D\\u0442\\u0435\\u043D \\u0437\\u0430 \\u043F\\u0440\\u0435\\u0438\\u0437\\u0447\\u0438\\u0441\\u043B\\u0435\\u043D\\u0438\\u0435)\ntitle=\\u041A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u044F \\u043D\\u0430 \\u0432\\u0430\\u0440\\u0438\\u0430\\u043D\\u0442\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_ca.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=Tancar\nUnlock=Desbloquejar configuraci\\u00F3\nERROR_DIALOG_DESCR_SETTINGS=El mode d\'edici\\u00F3 combinat amb un escenari no heretat no \\u00E9s compatible.\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=Els ajustos de l\'aplicaci\\u00F3 no s\\u00F3n compatibles.\nShipToParty=Destinatari de mercaderies\\:\nLock=Bloquejar configuraci\\u00F3\ncancel=Cancel\\u00B7lar\nVARIANT_MATCHING=Variant de coincid\\u00E8ncia\nappTitle=Configuraci\\u00F3 de variant\nConfigurationStatus=Estat de configuraci\\u00F3\nERROR_DIALOG_DESCR_RESOURCE=Verifiqueu l\'URL i torneu-ho a provar\nConfigurationDate=Data\\:\nERROR_DIALOG_TEXT_RESOURCE=El recurs sol\\u00B7licitat no est\\u00E0 disponible\nOrderQuantity=Quantitat de comanda\\:\nSalesDocument=Document de vendes\\:\nKEY_AND_SUBKEY={0} / {1}\nMaterial=Material\nERROR_DIALOG_TITLE_NOTFOUND=No existeix\nclose=Tancar\ndone=Fet\nERROR_DIALOG_TITLE_ERROR=Error\napply=Aplicar\nappDescription=Configuraci\\u00F3 de variant\nNO_TITLE=(No rellevant per a traducci\\u00F3)\ntitle=Configuraci\\u00F3 de variant\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_cs.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=Zav\\u0159\\u00EDt\nUnlock=Odblokovat konfiguraci\nERROR_DIALOG_DESCR_SETTINGS=Re\\u017Eim \\u00FAprav v kombinaci se sc\\u00E9n\\u00E1\\u0159em, kter\\u00FD nen\\u00ED zastaral\\u00FD, nen\\u00ED podporovan\\u00FD.\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=Nastaven\\u00ED zadan\\u00E1 pro aplikaci nejsou podporovan\\u00E1.\nShipToParty=P\\u0159\\u00EDjemce materi\\u00E1lu\\:\nLock=Blokovat konfiguraci\ncancel=Zru\\u0161it\nVARIANT_MATCHING=Porovnat variantu\nappTitle=Konfigurace varianty\nConfigurationStatus=Status konfigurace\nERROR_DIALOG_DESCR_RESOURCE=Zkontrolujte URL a zkuste to znovu.\nConfigurationDate=Datum\\:\nERROR_DIALOG_TEXT_RESOURCE=Po\\u017Eadovan\\u00FD zdroj nen\\u00ED k dispozici.\nOrderQuantity=Mno\\u017Estv\\u00ED zak\\u00E1zky\\:\nSalesDocument=Prodejn\\u00ED doklad\\:\nKEY_AND_SUBKEY={0} / {1}\nMaterial=Materi\\u00E1l\nERROR_DIALOG_TITLE_NOTFOUND=Nenalezeno\nclose=Zav\\u0159\\u00EDt\ndone=Hotovo\nERROR_DIALOG_TITLE_ERROR=Chyba\napply=Pou\\u017E\\u00EDt\nappDescription=Konfigurace varianty\nNO_TITLE=(nep\\u0159ekl\\u00E1d\\u00E1 se)\ntitle=Konfigurace varianty\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_da.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=Luk\nUnlock=Oph\\u00E6v sp\\u00E6rre for konfiguration\nERROR_DIALOG_DESCR_SETTINGS=Redigeringsmode i kombination med et ikke-legacy-scenario underst\\u00F8ttes ikke.\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=De definerede indstillinger for appen underst\\u00F8ttes ikke\nShipToParty=Varemodtager\\:\nLock=Sp\\u00E6r konfiguration\ncancel=Afbryd\nVARIANT_MATCHING=Afstemningsvariant\nappTitle=Variantkonfiguration\nConfigurationStatus=Konfigurationsstatus\\:\nERROR_DIALOG_DESCR_RESOURCE=Kontroller URL, og fors\\u00F8g igen\nConfigurationDate=Dato\\:\nERROR_DIALOG_TEXT_RESOURCE=Den \\u00F8nskede ressource er ikke tilg\\u00E6ngelig.\nOrderQuantity=Ordrem\\u00E6ngde\\:\nSalesDocument=Salgsbilag\\:\nKEY_AND_SUBKEY={0} / {1}\nMaterial=Materiale\nERROR_DIALOG_TITLE_NOTFOUND=Ikke fundet\nclose=Luk\ndone=F\\u00E6rdig\nERROR_DIALOG_TITLE_ERROR=Fejl\napply=Anvend\nappDescription=Variantkonfiguration\nNO_TITLE=(Irrelevant for overs\\u00E6ttelse)\ntitle=Variantkonfiguration\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_de.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=Schlie\\u00DFen\nUnlock=Konfiguration entsperren\nERROR_DIALOG_DESCR_SETTINGS=Der Editiermodus wird zusammen mit einem Nicht-Legacy-Szenario nicht unterst\\u00FCtzt.\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=Die vorgenommenen Einstellungen f\\u00FCr die App werden nicht unterst\\u00FCtzt.\nShipToParty=Warenempf\\u00E4nger\\:\nLock=Konfiguration sperren\ncancel=Abbrechen\nVARIANT_MATCHING=Variante abgleichen\nappTitle=Variantenkonfiguration\nConfigurationStatus=Konfigurationsstatus\nERROR_DIALOG_DESCR_RESOURCE=Pr\\u00FCfen Sie die URL, und versuchen Sie es erneut.\nConfigurationDate=Datum\\:\nERROR_DIALOG_TEXT_RESOURCE=Die angeforderte Ressource ist nicht verf\\u00FCgbar.\nOrderQuantity=Bestellmenge\\:\nSalesDocument=Verkaufsbeleg\\:\nKEY_AND_SUBKEY={0} / {1}\nMaterial=Material\nERROR_DIALOG_TITLE_NOTFOUND=Nicht gefunden\nclose=Schlie\\u00DFen\ndone=Fertig\nERROR_DIALOG_TITLE_ERROR=Fehler\napply=Anwenden\nappDescription=Variantenkonfiguration\nNO_TITLE=(F\\u00FCr \\u00DCbersetzung irrelevant)\ntitle=Variantenkonfiguration\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_el.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=\\u039A\\u03BB\\u03B5\\u03AF\\u03C3\\u03B9\\u03BC\\u03BF\nUnlock=\\u0394\\u03B9\\u03B1\\u03BC\\u03CC\\u03C1\\u03C6\\u03C9\\u03C3\\u03B7 \\u039E\\u03B5\\u03BA\\u03BB\\u03B5\\u03B9\\u03B4\\u03CE\\u03BC\\u03B1\\u03C4\\u03BF\\u03C2\nERROR_DIALOG_DESCR_SETTINGS=\\u039B\\u03B5\\u03B9\\u03C4\\u03BF\\u03C5\\u03C1\\u03B3\\u03AF\\u03B1 \\u03B5\\u03C0\\u03B5\\u03BE\\u03B5\\u03C1\\u03B3\\u03B1\\u03C3\\u03AF\\u03B1\\u03C2 \\u03C3\\u03B5 \\u03C3\\u03C5\\u03BD\\u03B4\\u03C5\\u03B1\\u03C3\\u03BC\\u03CC \\u03BC\\u03B5 \\u03BC\\u03B7 \\u03BC\\u03B5\\u03C4\\u03B1\\u03B2\\u03B9\\u03B2\\u03B1\\u03B6\\u03CC\\u03BC\\u03B5\\u03BD\\u03BF \\u03C3\\u03B5\\u03BD\\u03AC\\u03C1\\u03B9\\u03BF \\u03B4\\u03B5\\u03BD \\u03C5\\u03C0\\u03BF\\u03C3\\u03C4\\u03B7\\u03C1\\u03AF\\u03B6\\u03B5\\u03C4\\u03B1\\u03B9.\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=\\u039F\\u03B9 \\u03C0\\u03B1\\u03C1\\u03B5\\u03C7\\u03CC\\u03BC\\u03B5\\u03BD\\u03B5\\u03C2 \\u03C1\\u03C5\\u03B8\\u03BC\\u03AF\\u03C3\\u03B5\\u03B9\\u03C2 \\u03B3\\u03B9\\u03B1 \\u03C4\\u03B7\\u03BD \\u03B5\\u03C6\\u03B1\\u03C1\\u03BC\\u03BF\\u03B3\\u03AE \\u03B4\\u03B5\\u03BD \\u03C5\\u03C0\\u03BF\\u03C3\\u03C4\\u03B7\\u03C1\\u03AF\\u03B6\\u03BF\\u03BD\\u03C4\\u03B1\\u03B9.\nShipToParty=\\u03A0\\u03B1\\u03C1\\u03B1\\u03BB\\u03AE\\u03C0\\u03C4\\u03B7\\u03C2\\:\nLock=\\u0394\\u03B9\\u03B1\\u03BC\\u03CC\\u03C1\\u03C6\\u03C9\\u03C3\\u03B7 \\u039A\\u03BB\\u03B5\\u03B9\\u03B4\\u03CE\\u03BC\\u03B1\\u03C4\\u03BF\\u03C2\ncancel=\\u0391\\u03BA\\u03CD\\u03C1\\u03C9\\u03C3\\u03B7\nVARIANT_MATCHING=\\u03A3\\u03C5\\u03BC\\u03C6\\u03C9\\u03BD\\u03AF\\u03B1 \\u039C\\u03B5\\u03C4\\u03B1\\u03B2\\u03BB\\u03B7\\u03C4\\u03AE\\u03C2\nappTitle=\\u0394\\u03B9\\u03B1\\u03BC\\u03CC\\u03C1\\u03C6\\u03C9\\u03C3\\u03B7 \\u039C\\u03B5\\u03C4\\u03B1\\u03B2\\u03BB\\u03B7\\u03C4\\u03AE\\u03C2\nConfigurationStatus=\\u039A\\u03B1\\u03C4\\u03AC\\u03C3\\u03C4\\u03B1\\u03C3\\u03B7 \\u0394\\u03B9\\u03B1\\u03BC\\u03CC\\u03C1\\u03C6\\u03C9\\u03C3\\u03B7\\u03C2\nERROR_DIALOG_DESCR_RESOURCE=\\u0395\\u03BB\\u03AD\\u03B3\\u03BE\\u03C4\\u03B5 \\u03C4\\u03BF URL \\u03BA\\u03B1\\u03B9 \\u03C0\\u03C1\\u03BF\\u03C3\\u03C0\\u03B1\\u03B8\\u03AE\\u03C3\\u03C4\\u03B5 \\u03C0\\u03AC\\u03BB\\u03B9.\nConfigurationDate=\\u0397\\u03BC/\\u03BD\\u03AF\\u03B1\\:\nERROR_DIALOG_TEXT_RESOURCE=\\u039F \\u03B1\\u03C0\\u03B1\\u03B9\\u03C4\\u03BF\\u03CD\\u03BC\\u03B5\\u03BD\\u03BF\\u03C2 \\u03C0\\u03CC\\u03C1\\u03BF\\u03C2 \\u03B4\\u03B5\\u03BD \\u03B5\\u03AF\\u03BD\\u03B1\\u03B9 \\u03B4\\u03B9\\u03B1\\u03B8\\u03AD\\u03C3\\u03B9\\u03BC\\u03BF\\u03C2.\nOrderQuantity=\\u03A0\\u03BF\\u03C3\\u03CC\\u03C4\\u03B7\\u03C4\\u03B1 \\u03A0\\u03B1\\u03C1\\u03B1\\u03B3\\u03B3\\u03B5\\u03BB\\u03AF\\u03B1\\u03C2\\:\nSalesDocument=\\u03A0\\u03B1\\u03C1\\u03B1\\u03C3\\u03C4\\u03B1\\u03C4\\u03B9\\u03BA\\u03CC \\u03A0\\u03C9\\u03BB\\u03AE\\u03C3\\u03B5\\u03C9\\u03BD\\:\nKEY_AND_SUBKEY={0} / {1}\nMaterial=\\u03A5\\u03BB\\u03B9\\u03BA\\u03CC\nERROR_DIALOG_TITLE_NOTFOUND=\\u0394\\u03B5\\u03BD \\u0392\\u03C1\\u03AD\\u03B8\\u03B7\\u03BA\\u03B5\nclose=\\u039A\\u03BB\\u03B5\\u03AF\\u03C3\\u03B9\\u03BC\\u03BF\ndone=\\u03A4\\u03AD\\u03BB\\u03BF\\u03C2\nERROR_DIALOG_TITLE_ERROR=\\u03A3\\u03C6\\u03AC\\u03BB\\u03BC\\u03B1\napply=\\u0395\\u03C6\\u03B1\\u03C1\\u03BC\\u03BF\\u03B3\\u03AE\nappDescription=\\u0394\\u03B9\\u03B1\\u03BC\\u03CC\\u03C1\\u03C6\\u03C9\\u03C3\\u03B7 \\u039C\\u03B5\\u03C4\\u03B1\\u03B2\\u03BB\\u03B7\\u03C4\\u03AE\\u03C2\nNO_TITLE=(\\u039C\\u03B7 \\u03C3\\u03C7\\u03B5\\u03C4\\u03B9\\u03BA\\u03CC \\u03B3\\u03B9\\u03B1 \\u03BC\\u03B5\\u03C4\\u03AC\\u03C6\\u03C1\\u03B1\\u03C3\\u03B7)\ntitle=\\u0394\\u03B9\\u03B1\\u03BC\\u03CC\\u03C1\\u03C6\\u03C9\\u03C3\\u03B7 \\u039C\\u03B5\\u03C4\\u03B1\\u03B2\\u03BB\\u03B7\\u03C4\\u03AE\\u03C2\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_en.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=Close\nUnlock=Unlock Configuration\nERROR_DIALOG_DESCR_SETTINGS=Edit mode in combination with a non-legacy scenario is not supported.\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=The provided settings for the app are not supported.\nShipToParty=Ship-To-Party\\:\nLock=Lock Configuration\ncancel=Cancel\nVARIANT_MATCHING=Match Variant\nappTitle=Variant Configuration\nConfigurationStatus=Configuration Status\nERROR_DIALOG_DESCR_RESOURCE=Please check the URL and try again.\nConfigurationDate=Date\\:\nERROR_DIALOG_TEXT_RESOURCE=The requested resource is not available.\nOrderQuantity=Order Quantity\\:\nSalesDocument=Sales Document\\:\nKEY_AND_SUBKEY={0} / {1}\nMaterial=Material\nERROR_DIALOG_TITLE_NOTFOUND=Not Found\nclose=Close\ndone=Done\nERROR_DIALOG_TITLE_ERROR=Error\napply=Apply\nappDescription=Variant Configuration\nNO_TITLE=(Irrelavant for translation)\ntitle=Variant Configuration\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_en_US_sappsd.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM=[[[{0} {1}]]]\nCLOSE_ERROR_DIALOG_TXT=[[[\\u0108\\u013A\\u014F\\u015F\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nUnlock=[[[\\u016E\\u014B\\u013A\\u014F\\u010B\\u0137 \\u0108\\u014F\\u014B\\u0192\\u012F\\u011F\\u0171\\u0157\\u0105\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219]]]\nERROR_DIALOG_DESCR_SETTINGS=[[[\\u0114\\u018C\\u012F\\u0163 \\u0271\\u014F\\u018C\\u0113 \\u012F\\u014B \\u010B\\u014F\\u0271\\u0183\\u012F\\u014B\\u0105\\u0163\\u012F\\u014F\\u014B \\u0175\\u012F\\u0163\\u0125 \\u0105 \\u014B\\u014F\\u014B-\\u013A\\u0113\\u011F\\u0105\\u010B\\u0177 \\u015F\\u010B\\u0113\\u014B\\u0105\\u0157\\u012F\\u014F \\u012F\\u015F \\u014B\\u014F\\u0163 \\u015F\\u0171\\u03C1\\u03C1\\u014F\\u0157\\u0163\\u0113\\u018C.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nID_AND_DESCR=[[[{0} ({1})]]]\nERROR_DIALOG_TEXT_SETTINGS=[[[\\u0162\\u0125\\u0113 \\u03C1\\u0157\\u014F\\u028B\\u012F\\u018C\\u0113\\u018C \\u015F\\u0113\\u0163\\u0163\\u012F\\u014B\\u011F\\u015F \\u0192\\u014F\\u0157 \\u0163\\u0125\\u0113 \\u0105\\u03C1\\u03C1 \\u0105\\u0157\\u0113 \\u014B\\u014F\\u0163 \\u015F\\u0171\\u03C1\\u03C1\\u014F\\u0157\\u0163\\u0113\\u018C.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nShipToParty=[[[\\u015C\\u0125\\u012F\\u03C1-\\u0162\\u014F-\\u01A4\\u0105\\u0157\\u0163\\u0177\\:\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nLock=[[[\\u013B\\u014F\\u010B\\u0137 \\u0108\\u014F\\u014B\\u0192\\u012F\\u011F\\u0171\\u0157\\u0105\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\ncancel=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nVARIANT_MATCHING=[[[\\u039C\\u0105\\u0163\\u010B\\u0125 \\u01B2\\u0105\\u0157\\u012F\\u0105\\u014B\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nappTitle=[[[\\u01B2\\u0105\\u0157\\u012F\\u0105\\u014B\\u0163 \\u0108\\u014F\\u014B\\u0192\\u012F\\u011F\\u0171\\u0157\\u0105\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nConfigurationStatus=[[[\\u0108\\u014F\\u014B\\u0192\\u012F\\u011F\\u0171\\u0157\\u0105\\u0163\\u012F\\u014F\\u014B \\u015C\\u0163\\u0105\\u0163\\u0171\\u015F\\u2219\\u2219\\u2219\\u2219]]]\nERROR_DIALOG_DESCR_RESOURCE=[[[\\u01A4\\u013A\\u0113\\u0105\\u015F\\u0113 \\u010B\\u0125\\u0113\\u010B\\u0137 \\u0163\\u0125\\u0113 \\u016E\\u0158\\u013B \\u0105\\u014B\\u018C \\u0163\\u0157\\u0177 \\u0105\\u011F\\u0105\\u012F\\u014B.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nConfigurationDate=[[[\\u010E\\u0105\\u0163\\u0113\\:\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nERROR_DIALOG_TEXT_RESOURCE=[[[\\u0162\\u0125\\u0113 \\u0157\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u0113\\u018C \\u0157\\u0113\\u015F\\u014F\\u0171\\u0157\\u010B\\u0113 \\u012F\\u015F \\u014B\\u014F\\u0163 \\u0105\\u028B\\u0105\\u012F\\u013A\\u0105\\u0183\\u013A\\u0113.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nOrderQuantity=[[[\\u014E\\u0157\\u018C\\u0113\\u0157 \\u01EC\\u0171\\u0105\\u014B\\u0163\\u012F\\u0163\\u0177\\:\\u2219\\u2219\\u2219\\u2219]]]\nSalesDocument=[[[\\u015C\\u0105\\u013A\\u0113\\u015F \\u010E\\u014F\\u010B\\u0171\\u0271\\u0113\\u014B\\u0163\\:\\u2219\\u2219\\u2219\\u2219]]]\nKEY_AND_SUBKEY=[[[{0} / {1}]]]\nMaterial=[[[\\u039C\\u0105\\u0163\\u0113\\u0157\\u012F\\u0105\\u013A\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nERROR_DIALOG_TITLE_NOTFOUND=[[[\\u0143\\u014F\\u0163 \\u0191\\u014F\\u0171\\u014B\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nclose=[[[\\u0108\\u013A\\u014F\\u015F\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\ndone=[[[\\u010E\\u014F\\u014B\\u0113]]]\nERROR_DIALOG_TITLE_ERROR=[[[\\u0114\\u0157\\u0157\\u014F\\u0157\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\napply=[[[\\u0100\\u03C1\\u03C1\\u013A\\u0177\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nappDescription=[[[\\u01B2\\u0105\\u0157\\u012F\\u0105\\u014B\\u0163 \\u0108\\u014F\\u014B\\u0192\\u012F\\u011F\\u0171\\u0157\\u0105\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nNO_TITLE=[[[\\u0143\\u014F \\u0162\\u012F\\u0163\\u013A\\u0113 \\u0105\\u028B\\u0105\\u012F\\u013A\\u0105\\u0183\\u013A\\u0113 \\u0192\\u014F\\u0157 \\u015C\\u0105\\u013A\\u0113\\u015F\\u014E\\u0157\\u018C\\u0113\\u0157\\u0162\\u0113\\u015F\\u0163 \\u0105\\u014B\\u018C \\u01A4\\u0157\\u014F\\u018C\\u0171\\u010B\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\ntitle=[[[\\u01B2\\u0105\\u0157\\u012F\\u0105\\u014B\\u0163 \\u0108\\u014F\\u014B\\u0192\\u012F\\u011F\\u0171\\u0157\\u0105\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_en_US_saptrc.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM=VfSLzAO5LNJ+VMPgohWJTA_{0} {1}\nCLOSE_ERROR_DIALOG_TXT=Dud4hfQEUllUHYQlPI+8UQ_Close\nUnlock=ITwcm7NOQkmnl6bakpJLig_Unlock Configuration\nERROR_DIALOG_DESCR_SETTINGS=RiZczqsd6Dqal0zD/73Weg_Edit mode in combination with a non-legacy scenario is not supported.\nID_AND_DESCR=jHI73Pr+uDuW4OyIIMgatw_{0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=ia3KhyGBOfX5ReCi5V1Y8g_The provided settings for the app are not supported.\nShipToParty=rir171buajtuje9UZA3U2A_Ship-To-Party\\:\nLock=J+8ho+mW126qkvKgjyCRPg_Lock Configuration\ncancel=lgsp6zEeUimB2F43eB9Dfw_Cancel\nVARIANT_MATCHING=szN7qpY6xNULCFACuKl0eQ_Match Variant\nappTitle=GeCXpEnVbEDv9xC6vvv++A_Variant Configuration\nConfigurationStatus=ECg1Uj57gVcEQoZmvM1jvg_Configuration Status\nERROR_DIALOG_DESCR_RESOURCE=jaPWM1BmNdvGd/60JGlt8A_Please check the URL and try again.\nConfigurationDate=So9xDURGCC81S9/BAE1anQ_Date\\:\nERROR_DIALOG_TEXT_RESOURCE=FWTAnPEAQxCNlBp8TbGP1w_The requested resource is not available.\nOrderQuantity=O43hrzHcjX4RNbDPg1LJ7w_Order Quantity\\:\nSalesDocument=y7atPM73j5rAGogohonsCA_Sales Document\\:\nKEY_AND_SUBKEY=Kk3877wygUHb4rQngxUH2Q_{0} / {1}\nMaterial=JcCDlKQGKtZnbXfK35WlhQ_Material\nERROR_DIALOG_TITLE_NOTFOUND=bDVqpkJttb8f+Fga1A0Hcw_Not Found\nclose=C0FO8RqgaNCeIP1htndKKg_Close\ndone=EhwXO+T0VhvqRhkmGTrJVQ_Done\nERROR_DIALOG_TITLE_ERROR=DS5S+v4cIVkR+5y5lT4CJQ_Error\napply=kn0zBBjm2g3NnQ0h2VFVTg_Apply\nappDescription=SqgkS0WCV7Z58rvcOM3rLg_Variant Configuration\nNO_TITLE=imwJh4IPCema/QxtpL05FA_No Title available for SalesOrderTest and Product\ntitle=GcLxL9lb3gaWRqwz8BsyMw_Variant Configuration\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_es.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=Cerrar\nUnlock=Desbloquear configuraci\\u00F3n\nERROR_DIALOG_DESCR_SETTINGS=El modo de edici\\u00F3n en combinaci\\u00F3n con un escenario no heredado no es compatible.\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=La configuraci\\u00F3n proporcionada para la aplicaci\\u00F3n no es compatible.\nShipToParty=Destinatario de mercanc\\u00EDas\\:\nLock=Bloquear configuraci\\u00F3n\ncancel=Cancelar\nVARIANT_MATCHING=Variante coincidente\nappTitle=Configuraci\\u00F3n de variantes\nConfigurationStatus=Estado de configuraci\\u00F3n\nERROR_DIALOG_DESCR_RESOURCE=Verifique el URL e int\\u00E9ntelo de nuevo\nConfigurationDate=Fecha\\:\nERROR_DIALOG_TEXT_RESOURCE=El recurso solicitado no est\\u00E1 disponible\nOrderQuantity=Cantidad de pedido\\:\nSalesDocument=Documento de ventas\\:\nKEY_AND_SUBKEY={0} / {1}\nMaterial=Material\nERROR_DIALOG_TITLE_NOTFOUND=No existe\nclose=Cerrar\ndone=Listo\nERROR_DIALOG_TITLE_ERROR=Error\napply=Aplicar\nappDescription=Configuraci\\u00F3n de variantes\nNO_TITLE=(Irrelevante para traducci\\u00F3n)\ntitle=Configuraci\\u00F3n de variantes\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_et.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=Sule\nUnlock=Vabasta konfiguratsioon\nERROR_DIALOG_DESCR_SETTINGS=Redigeerimisre\\u017Eiimi koos mittep\\u00E4randstsenaariumiga ei toetata.\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=Rakenduse sisestatud s\\u00E4tteid ei toetata.\nShipToParty=Kauba saaja\\:\nLock=Lukusta konfiguratsioon\ncancel=T\\u00FChista\nVARIANT_MATCHING=Vastenda variant\nappTitle=Variandi konfiguratsioon\nConfigurationStatus=Konfiguratsiooni olek\nERROR_DIALOG_DESCR_RESOURCE=Kontrollige URL-i ja proovige uuesti.\nConfigurationDate=Kuup\\u00E4ev\\:\nERROR_DIALOG_TEXT_RESOURCE=Taotletud ressurss pole saadaval.\nOrderQuantity=Tellimuse kogus\\:\nSalesDocument=M\\u00FC\\u00FCgidokument\\:\nKEY_AND_SUBKEY={0} / {1}\nMaterial=Materjal\nERROR_DIALOG_TITLE_NOTFOUND=Ei leitud\nclose=Sule\ndone=Valmis\nERROR_DIALOG_TITLE_ERROR=T\\u00F5rge\napply=Rakenda\nappDescription=Variandi konfiguratsioon\nNO_TITLE=(T\\u00F5lkida pole vaja)\ntitle=Variandi konfiguratsioon\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_fi.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=Sulje\nUnlock=Avaa konfiguraation lukitus\nERROR_DIALOG_DESCR_SETTINGS=Muokkaustilaa yhdess\\u00E4 ei-aikaisemman skenaarion kanssa ei tueta.\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=Ilmoitettuja sovelluksen asetuksia ei tueta.\nShipToParty=Toimitusasiakas\\:\nLock=Lukitse konfiguraatio\ncancel=Peruuta\nVARIANT_MATCHING=T\\u00E4sm\\u00E4yt\\u00E4 variantti\nappTitle=Varianttikonfiguraatio\nConfigurationStatus=Konfiguraation tila\nERROR_DIALOG_DESCR_RESOURCE=Tarkista URL ja yrit\\u00E4 uudelleen.\nConfigurationDate=P\\u00E4iv\\u00E4m\\u00E4\\u00E4r\\u00E4\\:\nERROR_DIALOG_TEXT_RESOURCE=Pyydetty resurssi ei ole k\\u00E4ytett\\u00E4viss\\u00E4.\nOrderQuantity=Tilausm\\u00E4\\u00E4r\\u00E4\\:\nSalesDocument=Myyntitosite\\:\nKEY_AND_SUBKEY={0}/{1}\nMaterial=Nimike\nERROR_DIALOG_TITLE_NOTFOUND=Ei l\\u00F6ytynyt\nclose=Sulje\ndone=Valmis\nERROR_DIALOG_TITLE_ERROR=Virhe\napply=K\\u00E4yt\\u00E4\nappDescription=Varianttikonfiguraatio\nNO_TITLE=(Ei-k\\u00E4\\u00E4nn\\u00F6srelevantti)\ntitle=Varianttikonfiguraatio\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_fr.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=Fermer\nUnlock=D\\u00E9bloquer configuration\nERROR_DIALOG_DESCR_SETTINGS=Le mode de modification combin\\u00E9 \\u00E0 un sc\\u00E9nario non h\\u00E9rit\\u00E9 n\'est pas pris en charge.\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=Les options fournies pour l\'application ne sont pas prises en charge.\nShipToParty=R\\u00E9ceptionnaire\\u00A0\\:\nLock=Bloquer configuration\ncancel=Interrompre\nVARIANT_MATCHING=Associer variante\nappTitle=Configuration des produits \\u00E0 variantes\nConfigurationStatus=Statut de configuration\nERROR_DIALOG_DESCR_RESOURCE=V\\u00E9rifiez l\'URL et r\\u00E9essayez.\nConfigurationDate=Date\\u00A0\\:\nERROR_DIALOG_TEXT_RESOURCE=La ressource demand\\u00E9e n\'est pas disponible.\nOrderQuantity=Quantit\\u00E9 command\\u00E9e\\u00A0\\:\nSalesDocument=Document de vente\\u00A0\\:\nKEY_AND_SUBKEY={0} / {1}\nMaterial=Article\nERROR_DIALOG_TITLE_NOTFOUND=Introuvable\nclose=Fermer\ndone=Termin\\u00E9\nERROR_DIALOG_TITLE_ERROR=Erreur\napply=Appliquer\nappDescription=Configuration des produits \\u00E0 variantes\nNO_TITLE=(Non pertinent pour traduction)\ntitle=Configuration des produits \\u00E0 variantes\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_hi.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=\\u092C\\u0902\\u0926 \\u0915\\u0930\\u0947\\u0902\nUnlock=\\u0905\\u0928\\u0932\\u0949\\u0915 \\u0915\\u0949\\u0928\\u094D\\u092B\\u093C\\u093F\\u0917\\u0930\\u0947\\u0936\\u0928\nERROR_DIALOG_DESCR_SETTINGS=\\u0917\\u0948\\u0930-\\u092A\\u093E\\u0930\\u0902\\u092A\\u0930\\u093F\\u0915 \\u092A\\u0930\\u093F\\u0926\\u0943\\u0936\\u094D\\u092F \\u0915\\u0947 \\u0938\\u093E\\u0925 \\u0938\\u0902\\u092F\\u094B\\u091C\\u0928 \\u092E\\u0947\\u0902 \\u0938\\u0902\\u092A\\u093E\\u0926\\u0928 \\u092E\\u094B\\u0921 \\u0938\\u092E\\u0930\\u094D\\u0925\\u093F\\u0924 \\u0928\\u0939\\u0940\\u0902 \\u0939\\u0948.\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=\\u090F\\u092A\\u094D\\u0932\\u093F\\u0915\\u0947\\u0936\\u0928 \\u0915\\u0947 \\u0932\\u093F\\u090F \\u092A\\u094D\\u0930\\u0926\\u093E\\u0928 \\u0915\\u0940 \\u0917\\u0908 \\u0938\\u0947\\u091F\\u093F\\u0902\\u0917 \\u0938\\u092E\\u0930\\u094D\\u0925\\u093F\\u0924 \\u0928\\u0939\\u0940\\u0902 \\u0939\\u0948\\u0902.\nShipToParty=\\u092A\\u094D\\u0930\\u093E\\u092A\\u094D\\u0924\\u0915\\u0930\\u094D\\u0924\\u093E \\u092A\\u0915\\u094D\\u0937\\:\nLock=\\u0932\\u0949\\u0915 \\u0915\\u0949\\u0928\\u094D\\u092B\\u093C\\u093F\\u0917\\u0930\\u0947\\u0936\\u0928\ncancel=\\u0930\\u0926\\u094D\\u0926 \\u0915\\u0930\\u0947\\u0902\nVARIANT_MATCHING=\\u092E\\u093F\\u0932\\u093E\\u0928 \\u0938\\u0902\\u0938\\u094D\\u0915\\u0930\\u0923\nappTitle=\\u092D\\u093F\\u0928\\u094D\\u0928 \\u0930\\u0942\\u092A \\u0915\\u0949\\u0928\\u094D\\u092B\\u093C\\u093F\\u0917\\u0930\\u0947\\u0936\\u0928\nConfigurationStatus=\\u0915\\u0949\\u0928\\u094D\\u092B\\u093C\\u093F\\u0917\\u0930\\u0947\\u0936\\u0928 \\u0938\\u094D\\u0925\\u093F\\u0924\\u093F\nERROR_DIALOG_DESCR_RESOURCE=\\u0915\\u0943\\u092A\\u092F\\u093E URL \\u091C\\u093E\\u0902\\u091A \\u0915\\u0930\\u0947\\u0902 \\u0914\\u0930 \\u0926\\u094B\\u092C\\u093E\\u0930\\u093E \\u092A\\u094D\\u0930\\u092F\\u093E\\u0938 \\u0915\\u0930\\u0947\\u0902.\nConfigurationDate=\\u0926\\u093F\\u0928\\u093E\\u0902\\u0915\\u0903\nERROR_DIALOG_TEXT_RESOURCE=\\u0905\\u0928\\u0941\\u0930\\u094B\\u0927\\u093F\\u0924 \\u0938\\u0902\\u0938\\u093E\\u0927\\u0928 \\u0909\\u092A\\u0932\\u092C\\u094D\\u0927 \\u0928\\u0939\\u0940\\u0902 \\u0939\\u0948.\nOrderQuantity=\\u0911\\u0930\\u094D\\u0921\\u0930 \\u092E\\u093E\\u0924\\u094D\\u0930\\u093E\\:\nSalesDocument=\\u0935\\u093F\\u0915\\u094D\\u0930\\u092F \\u0926\\u0938\\u094D\\u0924\\u093E\\u0935\\u0947\\u095B\\:\nKEY_AND_SUBKEY={0} / {1}\nMaterial=\\u0938\\u093E\\u092E\\u0917\\u094D\\u0930\\u0940\nERROR_DIALOG_TITLE_NOTFOUND=\\u0928\\u0939\\u0940\\u0902 \\u092E\\u093F\\u0932\\u093E\nclose=\\u092C\\u0902\\u0926 \\u0915\\u0930\\u0947\\u0902\ndone=\\u0938\\u0902\\u092A\\u0928\\u094D\\u0928\nERROR_DIALOG_TITLE_ERROR=\\u0924\\u094D\\u0930\\u0941\\u091F\\u093F\napply=\\u0932\\u093E\\u0917\\u0942 \\u0915\\u0930\\u0947\\u0902\nappDescription=\\u092D\\u093F\\u0928\\u094D\\u0928 \\u0930\\u0942\\u092A \\u0915\\u0949\\u0928\\u094D\\u092B\\u093C\\u093F\\u0917\\u0930\\u0947\\u0936\\u0928\nNO_TITLE=(\\u0905\\u0928\\u0941\\u0935\\u093E\\u0926 \\u0915\\u0947 \\u0932\\u093F\\u090F \\u0905\\u092A\\u094D\\u0930\\u093E\\u0938\\u0902\\u0917\\u093F\\u0915)\ntitle=\\u092D\\u093F\\u0928\\u094D\\u0928 \\u0930\\u0942\\u092A \\u0915\\u0949\\u0928\\u094D\\u092B\\u093C\\u093F\\u0917\\u0930\\u0947\\u0936\\u0928\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_hr.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=Zatvori\nUnlock=Otklju\\u010Daj konfiguraciju\nERROR_DIALOG_DESCR_SETTINGS=Mod ure\\u0111ivanja u kombinaciji sa scenarijem koji nije naslije\\u0111en nije podr\\u017Eano.\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=Navedene postave za aplikaciju nisu podr\\u017Eane.\nShipToParty=Primatelj robe\\:\nLock=Zaklju\\u010Daj konfiguraciju\ncancel=Otka\\u017Ei\nVARIANT_MATCHING=Uskladi varijantu\nappTitle=Konfiguracija varijante\nConfigurationStatus=Status konfiguracije\nERROR_DIALOG_DESCR_RESOURCE=Provjerite URL i poku\\u0161ajte ponovo.\nConfigurationDate=Datum\\:\nERROR_DIALOG_TEXT_RESOURCE=Tra\\u017Eeni resurs nije raspolo\\u017Eiv.\nOrderQuantity=Koli\\u010Dina naloga\\:\nSalesDocument=Prodajni dokument\\:\nKEY_AND_SUBKEY={0} / {1}\nMaterial=Materijal\nERROR_DIALOG_TITLE_NOTFOUND=Nije na\\u0111eno\nclose=Zatvori\ndone=Izvr\\u0161eno\nERROR_DIALOG_TITLE_ERROR=Gre\\u0161ka\napply=Primijeni\nappDescription=Konfiguracija varijante\nNO_TITLE=(Nerelevantno za prijevod)\ntitle=Konfiguracija varijante\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_hu.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=Bez\\u00E1r\\u00E1s\nUnlock=Konfigur\\u00E1ci\\u00F3 z\\u00E1rol\\u00E1s\\u00E1nak felold\\u00E1sa\nERROR_DIALOG_DESCR_SETTINGS=\\ Szerkeszt\\u0151 m\\u00F3d nem \\u00F6r\\u00F6k\\u00F6lt forgat\\u00F3k\\u00F6nyvvel kombin\\u00E1lva nem t\\u00E1mogatott.\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=A megadott alkalmaz\\u00E1sbe\\u00E1ll\\u00EDt\\u00E1sokat nem t\\u00E1mogatja a rendszer.\nShipToParty=\\u00C1rufogad\\u00F3\\:\nLock=Konfigur\\u00E1ci\\u00F3 z\\u00E1rol\\u00E1sa\ncancel=M\\u00E9gse\nVARIANT_MATCHING=V\\u00E1ltozat egyeztet\\u00E9se\nappTitle=V\\u00E1ltozatkonfigur\\u00E1l\\u00E1s\nConfigurationStatus=Konfigur\\u00E1ci\\u00F3 st\\u00E1tusa\nERROR_DIALOG_DESCR_RESOURCE=Ellen\\u0151rizze az URL-t, \\u00E9s pr\\u00F3b\\u00E1lja \\u00FAjra.\nConfigurationDate=D\\u00E1tum\\:\nERROR_DIALOG_TEXT_RESOURCE=A k\\u00E9rt er\\u0151forr\\u00E1s nem el\\u00E9rhet\\u0151.\nOrderQuantity=Rendel\\u00E9smennyis\\u00E9g\\:\nSalesDocument=Elad\\u00E1si bizonylat\\:\nKEY_AND_SUBKEY={0} / {1}\nMaterial=Anyag\nERROR_DIALOG_TITLE_NOTFOUND=Nem tal\\u00E1lhat\\u00F3\nclose=Bez\\u00E1r\\u00E1s\ndone=K\\u00E9sz\nERROR_DIALOG_TITLE_ERROR=Hiba\napply=Alkalmaz\nappDescription=V\\u00E1ltozatkonfigur\\u00E1l\\u00E1s\nNO_TITLE=(Ford\\u00EDt\\u00E1shoz nem relev\\u00E1ns)\ntitle=V\\u00E1ltozatkonfigur\\u00E1l\\u00E1s\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_it.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=Chiudi\nUnlock=Sblocca configurazione\nERROR_DIALOG_DESCR_SETTINGS=La combinazione modalit\\u00E0 di elaborazione e scenario non preesistente non \\u00E8 supportata.\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=Le impostazioni fornite per l\\u2019app non sono supportate.\nShipToParty=Destinatario della consegna\\:\nLock=Blocca configurazione\ncancel=Annulla\nVARIANT_MATCHING=Confronta variante\nappTitle=Configurazione varianti\nConfigurationStatus=Stato di configurazione\nERROR_DIALOG_DESCR_RESOURCE=Controlla l\'URL e riprova.\nConfigurationDate=Data\\:\nERROR_DIALOG_TEXT_RESOURCE=La risorsa richiesta non \\u00E8 disponibile.\nOrderQuantity=Quantit\\u00E0 ordine\\:\nSalesDocument=Documento di vendita\\:\nKEY_AND_SUBKEY={0} / {1}\nMaterial=Materiale\nERROR_DIALOG_TITLE_NOTFOUND=Non trovato/a\nclose=Chiudi\ndone=Fatto\nERROR_DIALOG_TITLE_ERROR=Errore\napply=Applica\nappDescription=Configurazione varianti\nNO_TITLE=(Irrilevante per la traduzione)\ntitle=Configurazione varianti\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_iw.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=\\u05E1\\u05D2\\u05D5\\u05E8\nUnlock=\\u05EA\\u05E6\\u05D5\\u05E8\\u05EA \\u05D1\\u05D9\\u05D8\\u05D5\\u05DC \\u05E0\\u05E2\\u05D9\\u05DC\\u05D4\nERROR_DIALOG_DESCR_SETTINGS=\\u05D0\\u05D9\\u05DF \\u05EA\\u05DE\\u05D9\\u05DB\\u05D4 \\u05D1\\u05DE\\u05E6\\u05D1 \\u05E2\\u05E8\\u05D9\\u05DB\\u05D4 \\u05D1\\u05E9\\u05D9\\u05DC\\u05D5\\u05D1 \\u05E2\\u05DD \\u05EA\\u05E8\\u05D7\\u05D9\\u05E9 \\u05E9\\u05D0\\u05D9\\u05E0\\u05D5 \\u05DE\\u05D3\\u05D5\\u05E8 \\u05E7\\u05D5\\u05D3\\u05DD.\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=\\u05D4\\u05D4\\u05D2\\u05D3\\u05E8\\u05D5\\u05EA \\u05E9\\u05E1\\u05D5\\u05E4\\u05E7\\u05D5 \\u05E2\\u05D1\\u05D5\\u05E8 \\u05D4\\u05D9\\u05D9\\u05E9\\u05D5\\u05DD \\u05D0\\u05D9\\u05E0\\u05DF \\u05E0\\u05EA\\u05DE\\u05DB\\u05D5\\u05EA.\nShipToParty=\\u05D2\\u05D5\\u05E8\\u05DD \\u05DE\\u05E7\\u05D1\\u05DC\\:\nLock=\\u05EA\\u05E6\\u05D5\\u05E8\\u05EA \\u05E0\\u05E2\\u05D9\\u05DC\\u05D4\ncancel=\\u05D1\\u05D8\\u05DC\nVARIANT_MATCHING=\\u05D1\\u05E6\\u05E2 \\u05D4\\u05EA\\u05D0\\u05DE\\u05D4 \\u05DC\\u05D5\\u05D5\\u05E8\\u05D9\\u05D0\\u05E0\\u05D8\nappTitle=\\u05EA\\u05E6\\u05D5\\u05E8\\u05EA \\u05D5\\u05E8\\u05D9\\u05D0\\u05E0\\u05D8\nConfigurationStatus=\\u05E1\\u05D8\\u05D0\\u05D8\\u05D5\\u05E1 \\u05EA\\u05E6\\u05D5\\u05E8\\u05D4\nERROR_DIALOG_DESCR_RESOURCE=\\u05D1\\u05D3\\u05D5\\u05E7 \\u05D0\\u05EA \\u05DB\\u05EA\\u05D5\\u05D1\\u05EA \\u05D4-URL \\u05D5\\u05E0\\u05E1\\u05D4 \\u05E9\\u05D5\\u05D1.\nConfigurationDate=\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA\\:\nERROR_DIALOG_TEXT_RESOURCE=\\u05D4\\u05DE\\u05E9\\u05D0\\u05D1 \\u05D4\\u05DE\\u05D1\\u05D5\\u05E7\\u05E9 \\u05DC\\u05D0 \\u05D6\\u05DE\\u05D9\\u05DF.\nOrderQuantity=\\u05DB\\u05DE\\u05D5\\u05EA \\u05D1\\u05D4\\u05D6\\u05DE\\u05E0\\u05D4\\:\nSalesDocument=\\u05DE\\u05E1\\u05DE\\u05DA \\u05DE\\u05DB\\u05D9\\u05E8\\u05D5\\u05EA\nKEY_AND_SUBKEY={0} / {1}\nMaterial=\\u05D7\\u05D5\\u05DE\\u05E8\nERROR_DIALOG_TITLE_NOTFOUND=\\u05DC\\u05D0 \\u05E0\\u05DE\\u05E6\\u05D0\nclose=\\u05E1\\u05D2\\u05D5\\u05E8\ndone=\\u05D1\\u05D5\\u05E6\\u05E2\nERROR_DIALOG_TITLE_ERROR=\\u05E9\\u05D2\\u05D9\\u05D0\\u05D4\napply=\\u05D4\\u05D7\\u05DC\nappDescription=\\u05EA\\u05E6\\u05D5\\u05E8\\u05EA \\u05D5\\u05E8\\u05D9\\u05D0\\u05E0\\u05D8\nNO_TITLE=\\ \ntitle=\\u05EA\\u05E6\\u05D5\\u05E8\\u05EA \\u05D5\\u05E8\\u05D9\\u05D0\\u05E0\\u05D8\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_ja.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=\\u7D42\\u4E86\nUnlock=\\u9078\\u5B9A\\u30ED\\u30C3\\u30AF\\u89E3\\u9664\nERROR_DIALOG_DESCR_SETTINGS=\\u975E\\u30EC\\u30AC\\u30B7\\u30FC\\u30B7\\u30CA\\u30EA\\u30AA\\u3068\\u306E\\u7D44\\u5408\\u305B\\u306E\\u7DE8\\u96C6\\u30E2\\u30FC\\u30C9\\u306F\\u30B5\\u30DD\\u30FC\\u30C8\\u3055\\u308C\\u3066\\u3044\\u307E\\u305B\\u3093\\u3002\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=\\u30A2\\u30D7\\u30EA\\u306B\\u5165\\u529B\\u3055\\u308C\\u305F\\u8A2D\\u5B9A\\u306F\\u30B5\\u30DD\\u30FC\\u30C8\\u3055\\u308C\\u3066\\u3044\\u307E\\u305B\\u3093\\u3002\nShipToParty=\\u51FA\\u8377\\u5148\\:\nLock=\\u9078\\u5B9A\\u30ED\\u30C3\\u30AF\ncancel=\\u4E2D\\u6B62\nVARIANT_MATCHING=\\u30D0\\u30EA\\u30A2\\u30F3\\u30C8\\u30DE\\u30C3\\u30C1\\u30F3\\u30B0\nappTitle=\\u30D0\\u30EA\\u30A2\\u30F3\\u30C8\\u9078\\u5B9A\nConfigurationStatus=\\u9078\\u5B9A\\u30B9\\u30C6\\u30FC\\u30BF\\u30B9\nERROR_DIALOG_DESCR_RESOURCE=URL \\u3092\\u30C1\\u30A7\\u30C3\\u30AF\\u3057\\u3066\\u518D\\u8A66\\u884C\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\nConfigurationDate=\\u65E5\\u4ED8\\:\nERROR_DIALOG_TEXT_RESOURCE=\\u6307\\u5B9A\\u3055\\u308C\\u305F\\u30EA\\u30BD\\u30FC\\u30B9\\u306F\\u5229\\u7528\\u53EF\\u80FD\\u3067\\u306F\\u3042\\u308A\\u307E\\u305B\\u3093\\u3002\nOrderQuantity=\\u53D7\\u6CE8\\u6570\\u91CF\\:\nSalesDocument=\\u8CA9\\u58F2\\u4F1D\\u7968\\:\nKEY_AND_SUBKEY={0}/{1}\nMaterial=\\u54C1\\u76EE\nERROR_DIALOG_TITLE_NOTFOUND=\\u898B\\u3064\\u304B\\u308A\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\nclose=\\u9589\\u3058\\u308B\ndone=\\u5B8C\\u4E86\nERROR_DIALOG_TITLE_ERROR=\\u30A8\\u30E9\\u30FC\napply=\\u9069\\u7528\nappDescription=\\u30D0\\u30EA\\u30A2\\u30F3\\u30C8\\u9078\\u5B9A\nNO_TITLE=(\\u7FFB\\u8A33\\u5BFE\\u8C61\\u5916)\ntitle=\\u30D0\\u30EA\\u30A2\\u30F3\\u30C8\\u9078\\u5B9A\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_kk.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=\\u0416\\u0430\\u0431\\u0443\nUnlock=\\u041A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u044F\\u043D\\u044B \\u049B\\u04B1\\u043B\\u044B\\u043F\\u0442\\u0430\\u043D \\u0431\\u043E\\u0441\\u0430\\u0442\\u0443\nERROR_DIALOG_DESCR_SETTINGS=\\u0415\\u0441\\u043A\\u0456 \\u0435\\u043C\\u0435\\u0441 \\u0441\\u0446\\u0435\\u043D\\u0430\\u0440\\u0438\\u0439\\u043C\\u0435\\u043D \\u0431\\u0456\\u0440\\u0433\\u0435 \\u04E9\\u04A3\\u0434\\u0435\\u0443 \\u0440\\u0435\\u0436\\u0438\\u043C\\u0456\\u043D\\u0435 \\u049B\\u043E\\u043B\\u0434\\u0430\\u0443 \\u043A\\u04E9\\u0440\\u0441\\u0435\\u0442\\u0456\\u043B\\u043C\\u0435\\u0439\\u0434\\u0456.\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=\\u049A\\u043E\\u043B\\u0434\\u0430\\u043D\\u0431\\u0430 \\u04AF\\u0448\\u0456\\u043D \\u0431\\u0435\\u0440\\u0456\\u043B\\u0433\\u0435\\u043D \\u043F\\u0430\\u0440\\u0430\\u043C\\u0435\\u0442\\u0440\\u043B\\u0435\\u0440\\u0433\\u0435 \\u049B\\u043E\\u043B\\u0434\\u0430\\u0443 \\u043A\\u04E9\\u0440\\u0441\\u0435\\u0442\\u0456\\u043B\\u043C\\u0435\\u0439\\u0434\\u0456.\nShipToParty=\\u041C\\u0430\\u0442\\u0435\\u0440\\u0438\\u0430\\u043B\\u0434\\u044B \\u049B\\u0430\\u0431\\u044B\\u043B\\u0434\\u0430\\u0443\\u0448\\u044B\\:\nLock=\\u041A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u044F\\u043D\\u044B \\u049B\\u04B1\\u043B\\u044B\\u043F\\u0442\\u0430\\u0443\ncancel=\\u0411\\u043E\\u043B\\u0434\\u044B\\u0440\\u043C\\u0430\\u0443\nVARIANT_MATCHING=\\u0421\\u04D9\\u0439\\u043A\\u0435\\u0441\\u0442\\u0456\\u043A \\u043D\\u04B1\\u0441\\u049B\\u0430\\u0441\\u044B\nappTitle=\\u041D\\u04B1\\u0441\\u049B\\u0430 \\u043A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u044F\\u0441\\u044B\nConfigurationStatus=\\u041A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u044F \\u043A\\u04AF\\u0439\\u0456\nERROR_DIALOG_DESCR_RESOURCE=URL \\u043C\\u0435\\u043A\\u0435\\u043D\\u0436\\u0430\\u0439\\u044B\\u043D \\u0442\\u0435\\u043A\\u0441\\u0435\\u0440\\u0456\\u043F, \\u04D9\\u0440\\u0435\\u043A\\u0435\\u0442\\u0442\\u0456 \\u049B\\u0430\\u0439\\u0442\\u0430\\u043B\\u0430\\u04A3\\u044B\\u0437.\nConfigurationDate=\\u041A\\u04AF\\u043D\\u0456\\:\nERROR_DIALOG_TEXT_RESOURCE=\\u0421\\u04B1\\u0440\\u0430\\u043B\\u0493\\u0430\\u043D \\u0440\\u0435\\u0441\\u0443\\u0440\\u0441 \\u049B\\u043E\\u043B\\u0436\\u0435\\u0442\\u0456\\u043C\\u0441\\u0456\\u0437.\nOrderQuantity=\\u0422\\u0430\\u043F\\u0441\\u044B\\u0440\\u044B\\u0441 \\u043C\\u04E9\\u043B\\u0448\\u0435\\u0440\\u0456\\:\nSalesDocument=\\u0421\\u0430\\u0443\\u0434\\u0430 \\u049B\\u04B1\\u0436\\u0430\\u0442\\u044B\\:\nKEY_AND_SUBKEY={0} / {1}\nMaterial=\\u041C\\u0430\\u0442\\u0435\\u0440\\u0438\\u0430\\u043B\nERROR_DIALOG_TITLE_NOTFOUND=\\u0422\\u0430\\u0431\\u044B\\u043B\\u043C\\u0430\\u0434\\u044B\nclose=\\u0416\\u0430\\u0431\\u0443\ndone=\\u041E\\u0440\\u044B\\u043D\\u0434\\u0430\\u043B\\u0434\\u044B\nERROR_DIALOG_TITLE_ERROR=\\u049A\\u0430\\u0442\\u0435\napply=\\u049A\\u043E\\u043B\\u0434\\u0430\\u043D\\u0443\nappDescription=\\u041D\\u04B1\\u0441\\u049B\\u0430 \\u043A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u044F\\u0441\\u044B\nNO_TITLE=(\\u0410\\u0443\\u0434\\u0430\\u0440\\u0443 \\u049B\\u0430\\u0436\\u0435\\u0442 \\u0435\\u043C\\u0435\\u0441)\ntitle=\\u041D\\u04B1\\u0441\\u049B\\u0430 \\u043A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u044F\\u0441\\u044B\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_ko.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=\\uB2EB\\uAE30\nUnlock=\\uAD6C\\uC131 \\uC7A0\\uAE08 \\uD574\\uC81C\nERROR_DIALOG_DESCR_SETTINGS=\\uD3B8\\uC9D1 \\uBAA8\\uB4DC\\uB294 \\uAE30\\uC874 \\uC2DC\\uB098\\uB9AC\\uC624\\uAC00 \\uC544\\uB2CC \\uC2DC\\uB098\\uB9AC\\uC624\\uC640 \\uD568\\uAED8 \\uC0AC\\uC6A9\\uD560 \\uC218 \\uC5C6\\uC2B5\\uB2C8\\uB2E4.\nID_AND_DESCR={0}({1})\nERROR_DIALOG_TEXT_SETTINGS=\\uC571\\uC5D0 \\uC81C\\uACF5\\uB41C \\uC124\\uC815\\uC774 \\uC9C0\\uC6D0\\uB418\\uC9C0 \\uC54A\\uC2B5\\uB2C8\\uB2E4.\nShipToParty=\\uB0A9\\uD488\\uCC98\\:\nLock=\\uAD6C\\uC131 \\uC7A0\\uAE08\ncancel=\\uCDE8\\uC18C\nVARIANT_MATCHING=\\uBCC0\\uD615 \\uC77C\\uCE58\nappTitle=\\uBCC0\\uD615 \\uAD6C\\uC131\nConfigurationStatus=\\uAD6C\\uC131 \\uC0C1\\uD0DC\\:\nERROR_DIALOG_DESCR_RESOURCE=URL\\uC744 \\uD655\\uC778\\uD558\\uACE0 \\uB2E4\\uC2DC \\uC2DC\\uB3C4\\uD558\\uC2ED\\uC2DC\\uC624.\nConfigurationDate=\\uC77C\\uC790\\:\nERROR_DIALOG_TEXT_RESOURCE=\\uC694\\uCCAD\\uB41C \\uB9AC\\uC18C\\uC2A4\\uAC00 \\uC5C6\\uC2B5\\uB2C8\\uB2E4.\nOrderQuantity=\\uC624\\uB354 \\uC218\\uB7C9\\:\nSalesDocument=\\uD310\\uB9E4 \\uBB38\\uC11C\\:\nKEY_AND_SUBKEY={0} / {1}\nMaterial=\\uC790\\uC7AC\nERROR_DIALOG_TITLE_NOTFOUND=\\uC5C6\\uC74C\nclose=\\uB2EB\\uAE30\ndone=\\uC644\\uB8CC\nERROR_DIALOG_TITLE_ERROR=\\uC624\\uB958\napply=\\uC801\\uC6A9\nappDescription=\\uBCC0\\uD615 \\uAD6C\\uC131\nNO_TITLE=(\\uBC88\\uC5ED\\uACFC \\uBB34\\uAD00\\uD568)\ntitle=\\uBCC0\\uD615 \\uAD6C\\uC131\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_lt.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=U\\u017Edaryti\nUnlock=Atrakinti konfig\\u016Bracij\\u0105\nERROR_DIALOG_DESCR_SETTINGS=Redagavimo re\\u017Eimas kartu su nauju scenarijumi nepalaikomas.\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=Pateikti taikomosios programos parametrai nepalaikomi.\nShipToParty=U\\u017Esakovas\\:\nLock=U\\u017Erakinti konfig\\u016Bracij\\u0105\ncancel=At\\u0161aukti\nVARIANT_MATCHING=Atitik\\u0119s variantas\nappTitle=Varianto konfig\\u016Bracija\nConfigurationStatus=Konfig\\u016Bracijos b\\u016Bsena\nERROR_DIALOG_DESCR_RESOURCE=Patikrinkite URL ir pabandykite dar kart\\u0105.\nConfigurationDate=Data\\:\nERROR_DIALOG_TEXT_RESOURCE=Pageidautas i\\u0161teklius neprieinamas.\nOrderQuantity=U\\u017Esakymo kiekis\\:\nSalesDocument=Pardavimo dokumentas\\:\nKEY_AND_SUBKEY={0} / {1}\nMaterial=Med\\u017Eiaga\nERROR_DIALOG_TITLE_NOTFOUND=Nerasta\nclose=U\\u017Edaryti\ndone=Atlikta\nERROR_DIALOG_TITLE_ERROR=Klaida\napply=Taikyti\nappDescription=Varianto konfig\\u016Bracija\nNO_TITLE=(Neversti)\ntitle=Varianto konfig\\u016Bracija\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_lv.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=Aizv\\u0113rt\nUnlock=Atblo\\u0137\\u0113t konfigur\\u0101ciju\nERROR_DIALOG_DESCR_SETTINGS=Redi\\u0123\\u0113\\u0161anas re\\u017E\\u012Bms ar nemantoto scen\\u0101riju nav atbalst\\u012Bts.\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=Nodro\\u0161in\\u0101tie lietojumprogrammas iestat\\u012Bjumi nav atbalst\\u012Bti.\nShipToParty=P\\u0101rvad\\u0101juma sa\\u0146\\u0113m\\u0113js\nLock=Blo\\u0137\\u0113t konfigur\\u0101ciju\ncancel=Atcelt\nVARIANT_MATCHING=Sal\\u012Bdzin\\u0101t variantus\nappTitle=Variantu konfigur\\u0101cija\nConfigurationStatus=Konfigur\\u0101cijas statuss\nERROR_DIALOG_DESCR_RESOURCE=L\\u016Bdzu, p\\u0101rbaudiet URL un m\\u0113\\u0123iniet v\\u0113lreiz.\nConfigurationDate=Datums\\:\nERROR_DIALOG_TEXT_RESOURCE=Piepras\\u012Btais resurss nav pieejams.\nOrderQuantity=Pas\\u016Bt\\u012Bjuma daudzums\nSalesDocument=P\\u0101rdo\\u0161anas dokuments\nKEY_AND_SUBKEY={0} / {1}\nMaterial=Materi\\u0101ls\nERROR_DIALOG_TITLE_NOTFOUND=Nav atrasts\nclose=Aizv\\u0113rt\ndone=Pabeigts\nERROR_DIALOG_TITLE_ERROR=K\\u013C\\u016Bda\napply=Lietot\nappDescription=Variantu konfigur\\u0101cija\nNO_TITLE=(Neb\\u016Btisks p\\u0101rr\\u0113\\u0137inam)\ntitle=Variantu konfigur\\u0101cija\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_ms.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=Tutup\nUnlock=Buka Kunci Konfigurasi\nERROR_DIALOG_DESCR_SETTINGS=Mod edit dalam gabungan dengan senario bukan legasi tidak disokong.\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=Tetapan disediakan untuk aplikasi tidak disokong.\nShipToParty=Pihak Penerima\\:\nLock=Kunci Konfigurasi\ncancel=Batal\nVARIANT_MATCHING=Varian Sepadan\nappTitle=Konfigurasi Varian\nConfigurationStatus=Status Konfigurasi\nERROR_DIALOG_DESCR_RESOURCE=Sila semak URL dan cuba lagi.\nConfigurationDate=Tarikh\\:\nERROR_DIALOG_TEXT_RESOURCE=Sumber yang diminta tidak tersedia.\nOrderQuantity=Kuantiti Pesanan\\:\nSalesDocument=Dokumen Jualan\\:\nKEY_AND_SUBKEY={0} / {1}\nMaterial=Bahan\nERROR_DIALOG_TITLE_NOTFOUND=Tidak Ditemui\nclose=Tutup\ndone=Selesai\nERROR_DIALOG_TITLE_ERROR=Ralat\napply=Guna\nappDescription=Konfigurasi Varian\nNO_TITLE=(Tidak relavan untuk terjemahan)\ntitle=Konfigurasi Varian\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_nl.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=Sluiten\nUnlock=Configuratie deblokkeren\nERROR_DIALOG_DESCR_SETTINGS=Bewerkingsmodus in combinatie met een niet-legacyscenario wordt niet ondersteund.\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=De opgegeven instellingen voor de app worden niet ondersteund.\nShipToParty=Goederenontvanger\\:\nLock=Configuratie blokkeren\ncancel=Annuleren\nVARIANT_MATCHING=Matchvariant\nappTitle=Variantenconfiguratie\nConfigurationStatus=Configuratiestatus\nERROR_DIALOG_DESCR_RESOURCE=URL controleren en opnieuw proberen\nConfigurationDate=Datum\\:\nERROR_DIALOG_TEXT_RESOURCE=De aangevraagde resource is niet beschikbaar.\nOrderQuantity=Orderhoeveelheid\\:\nSalesDocument=Verkoopdocument\\:\nKEY_AND_SUBKEY={0} / {1}\nMaterial=Artikel\nERROR_DIALOG_TITLE_NOTFOUND=Niet gevonden\nclose=Sluiten\ndone=Voltooid\nERROR_DIALOG_TITLE_ERROR=Fout\napply=Toepassen\nappDescription=Variantenconfiguratie\nNO_TITLE=(niet relevant voor vertaling)\ntitle=Variantenconfiguratie\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_no.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=Lukk\nUnlock=Opphev sperring for konfigurasjon\nERROR_DIALOG_DESCR_SETTINGS=Redigeringsmodus i kombinasjon med nytt scenario st\\u00F8ttes ikke.\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=De oppgitte innstillingene for appen st\\u00F8ttes ikke.\nShipToParty=Varemottaker\\:\nLock=Sperr konfigurasjon\ncancel=Avbryt\nVARIANT_MATCHING=Sammenlign variant\nappTitle=Variantkonfigurasjon\nConfigurationStatus=Konfigurasjonsstatus\nERROR_DIALOG_DESCR_RESOURCE=Kontroller URL-en og pr\\u00F8v igjen.\nConfigurationDate=Dato\\:\nERROR_DIALOG_TEXT_RESOURCE=\\u00D8nsket ressurs er ikke tilgjengelig.\nOrderQuantity=Ordrekvantum\\:\nSalesDocument=Salgsdokument\\:\nKEY_AND_SUBKEY={0} / {1}\nMaterial=Material\nERROR_DIALOG_TITLE_NOTFOUND=Ikke funnet\nclose=Lukk\ndone=Utf\\u00F8rt\nERROR_DIALOG_TITLE_ERROR=Feil\napply=Bruk\nappDescription=Variantkonfigurasjon\nNO_TITLE=(Irrelevant for oversettelse)\ntitle=Variantkonfigurasjon\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_pl.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=Zamknij\nUnlock=Odblokuj konfiguracj\\u0119\nERROR_DIALOG_DESCR_SETTINGS=Tryb edycji w kombinacji z niepoprzednim scenariuszem nie jest obs\\u0142ugiwany.\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=Podane ustawienia dla aplikacji nie s\\u0105 obs\\u0142ugiwane.\nShipToParty=Odbiorca materia\\u0142\\u00F3w\\:\nLock=Zablokuj konfiguracj\\u0119\ncancel=Anuluj\nVARIANT_MATCHING=Dopasuj wariant\nappTitle=Konfiguracja wariant\\u00F3w\nConfigurationStatus=Status konfiguracji\nERROR_DIALOG_DESCR_RESOURCE=Sprawd\\u017A adres URL i spr\\u00F3buj ponownie.\nConfigurationDate=Data\\:\nERROR_DIALOG_TEXT_RESOURCE=Wymagany zas\\u00F3b nie jest dost\\u0119pny.\nOrderQuantity=\\:Ilo\\u015B\\u0107 zlecenia\nSalesDocument=Dokument sprzeda\\u017Cy\nKEY_AND_SUBKEY={0}/{1}\nMaterial=Materia\\u0142\nERROR_DIALOG_TITLE_NOTFOUND=Nie znaleziono\nclose=Zamknij\ndone=Gotowe\nERROR_DIALOG_TITLE_ERROR=B\\u0142\\u0105d\napply=Zastosuj\nappDescription=Konfiguracja wariant\\u00F3w\nNO_TITLE=(Nieistotne do cel\\u00F3w przeliczania)\ntitle=Konfiguracja wariant\\u00F3w\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_pt.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=Fechar\nUnlock=Desbloquear configura\\u00E7\\u00E3o\nERROR_DIALOG_DESCR_SETTINGS=N\\u00E3o \\u00E9 suportado o modo de modifica\\u00E7\\u00E3o em combina\\u00E7\\u00E3o com um cen\\u00E1rio n\\u00E3o legado.\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=As configura\\u00E7\\u00E3o disponibilizadas para o app n\\u00E3o s\\u00E3o suportadas.\nShipToParty=Recebedor da mercadoria\\:\nLock=Bloquear configura\\u00E7\\u00E3o\ncancel=Cancelar\nVARIANT_MATCHING=Corresponder variante\nappTitle=Configura\\u00E7\\u00E3o de variantes\nConfigurationStatus=Status de configura\\u00E7\\u00E3o\nERROR_DIALOG_DESCR_RESOURCE=Verificar o URL e tentar de novo.\nConfigurationDate=Data\\:\nERROR_DIALOG_TEXT_RESOURCE=O recurso solicitado n\\u00E3o est\\u00E1 dispon\\u00EDvel.\nOrderQuantity=Quantidade do pedido\\:\nSalesDocument=Documento de vendas\\:\nKEY_AND_SUBKEY={0} / {1}\nMaterial=Material\nERROR_DIALOG_TITLE_NOTFOUND=N\\u00E3o encontrado\nclose=Fechar\ndone=Conclu\\u00EDdo\nERROR_DIALOG_TITLE_ERROR=Erro\napply=Aplicar\nappDescription=Configura\\u00E7\\u00E3o de variantes\nNO_TITLE=(Irrelevante para tradu\\u00E7\\u00E3o)\ntitle=Configura\\u00E7\\u00E3o de variantes\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_ro.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=\\u00CEnchidere\nUnlock=Deblocare configurare\nERROR_DIALOG_DESCR_SETTINGS=Editare mod \\u00EEn combina\\u021Bie cu un scenariu nou nu este suportat\\u0103.\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=Set\\u0103rile furnizate pentru aplica\\u021Bie nu sunt suportate.\nShipToParty=Destinatar\\:\nLock=Blocare configurare\ncancel=Anulare\nVARIANT_MATCHING=Comparare variant\\u0103\nappTitle=Configurare variant\\u0103\nConfigurationStatus=Stare configurare\nERROR_DIALOG_DESCR_RESOURCE=Verifica\\u0163i URL \\u015Fi re\\u00EEncerca\\u0163i.\nConfigurationDate=Dat\\u0103\\:\nERROR_DIALOG_TEXT_RESOURCE=Resursa selectat\\u0103 nu este disponibil\\u0103.\nOrderQuantity=Cantitate comand\\u0103\\:\nSalesDocument=Document de v\\u00E2nz\\u0103ri\\:\nKEY_AND_SUBKEY={0} / {1}\nMaterial=Material\nERROR_DIALOG_TITLE_NOTFOUND=Neg\\u0103sit\nclose=\\u00CEnchidere\ndone=Efectuat\nERROR_DIALOG_TITLE_ERROR=Eroare\napply=Aplicare\nappDescription=Configurare variant\\u0103\nNO_TITLE=(Nerelevant pentru traducere)\ntitle=Configurare variant\\u0103\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_ru.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=\\u0417\\u0430\\u043A\\u0440\\u044B\\u0442\\u044C\nUnlock=\\u0420\\u0430\\u0437\\u0431\\u043B\\u043E\\u043A\\u0438\\u0440\\u043E\\u0432\\u0430\\u0442\\u044C \\u043A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u044E\nERROR_DIALOG_DESCR_SETTINGS=\\u0420\\u0435\\u0436\\u0438\\u043C \\u0440\\u0435\\u0434\\u0430\\u043A\\u0442\\u0438\\u0440\\u043E\\u0432\\u0430\\u043D\\u0438\\u044F \\u0432 \\u0441\\u043E\\u0447\\u0435\\u0442\\u0430\\u043D\\u0438\\u0438 \\u0441 \\u043D\\u0435 \\u0443\\u043D\\u0430\\u0441\\u043B\\u0435\\u0434\\u043E\\u0432\\u0430\\u043D\\u043D\\u044B\\u043C \\u0441\\u0446\\u0435\\u043D\\u0430\\u0440\\u0438\\u0435\\u043C \\u043D\\u0435 \\u043F\\u043E\\u0434\\u0434\\u0435\\u0440\\u0436\\u0438\\u0432\\u0430\\u0435\\u0442\\u0441\\u044F.\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=\\u0423\\u043A\\u0430\\u0437\\u0430\\u043D\\u043D\\u044B\\u0435 \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438 \\u043F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u044F \\u043D\\u0435 \\u043F\\u043E\\u0434\\u0434\\u0435\\u0440\\u0436\\u0438\\u0432\\u0430\\u044E\\u0442\\u0441\\u044F.\nShipToParty=\\u041F\\u043E\\u043B\\u0443\\u0447\\u0430\\u0442\\u0435\\u043B\\u044C\\:\nLock=\\u0411\\u043B\\u043E\\u043A\\u0438\\u0440\\u043E\\u0432\\u0430\\u0442\\u044C \\u043A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u044E\ncancel=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C\nVARIANT_MATCHING=\\u0421\\u043E\\u043F\\u043E\\u0441\\u0442\\u0430\\u0432\\u0438\\u0442\\u044C \\u0432\\u0430\\u0440\\u0438\\u0430\\u043D\\u0442\nappTitle=\\u041A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u044F \\u0432\\u0430\\u0440\\u0438\\u0430\\u043D\\u0442\\u043E\\u0432\nConfigurationStatus=\\u0421\\u0442\\u0430\\u0442\\u0443\\u0441 \\u043A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u0438\nERROR_DIALOG_DESCR_RESOURCE=\\u041F\\u0440\\u043E\\u0432\\u0435\\u0440\\u044C\\u0442\\u0435 URL \\u0438 \\u043F\\u043E\\u0432\\u0442\\u043E\\u0440\\u0438\\u0442\\u0435 \\u043F\\u043E\\u043F\\u044B\\u0442\\u043A\\u0443.\nConfigurationDate=\\u0414\\u0430\\u0442\\u0430\\:\nERROR_DIALOG_TEXT_RESOURCE=\\u0417\\u0430\\u043F\\u0440\\u043E\\u0448\\u0435\\u043D\\u043D\\u044B\\u0439 \\u0440\\u0435\\u0441\\u0443\\u0440\\u0441 \\u043D\\u0435\\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u0435\\u043D.\nOrderQuantity=\\u041A\\u043E\\u043B\\u0438\\u0447\\u0435\\u0441\\u0442\\u0432\\u043E \\u0437\\u0430\\u043A\\u0430\\u0437\\u0430\\:\nSalesDocument=\\u0422\\u043E\\u0440\\u0433\\u043E\\u0432\\u044B\\u0439 \\u0434\\u043E\\u043A\\u0443\\u043C\\u0435\\u043D\\u0442\\:\nKEY_AND_SUBKEY={0} / {1}\nMaterial=\\u041C\\u0430\\u0442\\u0435\\u0440\\u0438\\u0430\\u043B\nERROR_DIALOG_TITLE_NOTFOUND=\\u041D\\u0435 \\u043D\\u0430\\u0439\\u0434\\u0435\\u043D\\u043E\nclose=\\u0417\\u0430\\u043A\\u0440\\u044B\\u0442\\u044C\ndone=\\u0413\\u043E\\u0442\\u043E\\u0432\\u043E\nERROR_DIALOG_TITLE_ERROR=\\u041E\\u0448\\u0438\\u0431\\u043A\\u0430\napply=\\u041F\\u0440\\u0438\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C\nappDescription=\\u041A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u044F \\u0432\\u0430\\u0440\\u0438\\u0430\\u043D\\u0442\\u043E\\u0432\nNO_TITLE=(\\u041D\\u0435\\u0440\\u0435\\u043B\\u0435\\u0432\\u0430\\u043D\\u0442\\u043D\\u043E \\u0434\\u043B\\u044F \\u043F\\u0435\\u0440\\u0435\\u0432\\u043E\\u0434\\u0430)\ntitle=\\u041A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u044F \\u0432\\u0430\\u0440\\u0438\\u0430\\u043D\\u0442\\u043E\\u0432\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_sh.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=Zatvori\nUnlock=Otklju\\u010Daj konfiguraciju\nERROR_DIALOG_DESCR_SETTINGS=Na\\u010Din ure\\u0111ivanja u kombinaciji sa scenarijem koji nije zastareo nije podr\\u017Ean.\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=Obezbe\\u0111ena pode\\u0161avanja za aplikaciju nisu podr\\u017Eana.\nShipToParty=Primalac robe\\:\nLock=Zaklju\\u010Daj konfiguraciju\ncancel=Odustani\nVARIANT_MATCHING=Uporedi varijantu\nappTitle=Konfiguracija varijante\nConfigurationStatus=Status konfiguracije\nERROR_DIALOG_DESCR_RESOURCE=Proverite URL i poku\\u0161ajte ponovo.\nConfigurationDate=Datum\\:\nERROR_DIALOG_TEXT_RESOURCE=Zahtevani resurs nije dostupan.\nOrderQuantity=Koli\\u010Dina naloga\\:\nSalesDocument=Dokument prodaje\\:\nKEY_AND_SUBKEY={0} / {1}\nMaterial=Materijal\nERROR_DIALOG_TITLE_NOTFOUND=Nije na\\u0111eno\nclose=Zatvori\ndone=Izvr\\u0161eno\nERROR_DIALOG_TITLE_ERROR=Gre\\u0161ka\napply=Primeni\nappDescription=Konfiguracija varijante\nNO_TITLE=(nerelevantno za prevod)\ntitle=Konfiguracija varijante\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_sk.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=Zatvori\\u0165\nUnlock=Odblokova\\u0165 konfigur\\u00E1ciu\nERROR_DIALOG_DESCR_SETTINGS=Re\\u017Eim \\u00FAprav v kombin\\u00E1cii so scen\\u00E1rom non-legacy nie je podporovan\\u00FD.\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=Nastavenia zadan\\u00E9 pre aplik\\u00E1ciu nie s\\u00FA podporovan\\u00E9.\nShipToParty=Pr\\u00EDjemca materi\\u00E1lu\\:\nLock=Blokova\\u0165 konfigur\\u00E1ciu\ncancel=Zru\\u0161i\\u0165\nVARIANT_MATCHING=Variant zhody\nappTitle=Konfigur\\u00E1cia variantov\nConfigurationStatus=Status konfigur\\u00E1cie\nERROR_DIALOG_DESCR_RESOURCE=Skontrolujte URL a sk\\u00FAste to znovu.\nConfigurationDate=D\\u00E1tum\\:\nERROR_DIALOG_TEXT_RESOURCE=Po\\u017Eadovan\\u00FD zdroj nie je dostupn\\u00FD.\nOrderQuantity=Mno\\u017Estvo z\\u00E1kazky\\:\nSalesDocument=Predajn\\u00FD doklad\\:\nKEY_AND_SUBKEY={0} / {1}\nMaterial=Materi\\u00E1l\nERROR_DIALOG_TITLE_NOTFOUND=Nena\\u0161lo sa\nclose=Zatvori\\u0165\ndone=Hotovo\nERROR_DIALOG_TITLE_ERROR=Chyba\napply=Pou\\u017Ei\\u0165\nappDescription=Konfigur\\u00E1cia variantov\nNO_TITLE=(Nerelevantn\\u00E9 pre preklad)\ntitle=Konfigur\\u00E1cia variantov\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_sl.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=Zapiranje\nUnlock=Deblokada konfiguracije\nERROR_DIALOG_DESCR_SETTINGS=Modus urejanja v kombinaciji z novim scenarijem ni podprt.\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=Navedene nastavitve za aplikacijo niso podprte.\nShipToParty=Prejemnik blaga\\:\nLock=Blokada konfiguracije\ncancel=Preklic\nVARIANT_MATCHING=Varianta ujemanja\nappTitle=Konfiguracija variante\nConfigurationStatus=Status konfiguracije\nERROR_DIALOG_DESCR_RESOURCE=Preverite URL in poskusite znova.\nConfigurationDate=Datum\\:\nERROR_DIALOG_TEXT_RESOURCE=Zahtevani vir ni na voljo.\nOrderQuantity=Koli\\u010Dina naloga\\:\nSalesDocument=Prodajni dokument\\:\nKEY_AND_SUBKEY={0} / {1}\nMaterial=Material\nERROR_DIALOG_TITLE_NOTFOUND=Ni najdeno\nclose=Zapri\ndone=Kon\\u010Dano\nERROR_DIALOG_TITLE_ERROR=Napaka\napply=Uveljavi\nappDescription=Konfiguracija variante\nNO_TITLE=(Ni relevantno za prevod)\ntitle=Konfiguracija variante\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_sv.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=St\\u00E4ng\nUnlock=H\\u00E4v sp\\u00E4rr f\\u00F6r konfiguration\nERROR_DIALOG_DESCR_SETTINGS=Redigeringsl\\u00E4ge i kombination med icke-legacy-scenario medges ej.\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=Angivna inst\\u00E4llningar f\\u00F6r appen medges ej.\nShipToParty=Godsmottagare\\:\nLock=Sp\\u00E4rra konfiguration\ncancel=Avbryt\nVARIANT_MATCHING=Matcha variant\nappTitle=Variantkonfiguration\nConfigurationStatus=Konfigurationsstatus\nERROR_DIALOG_DESCR_RESOURCE=Kontrollera URL och f\\u00F6rs\\u00F6k igen.\nConfigurationDate=Datum\\:\nERROR_DIALOG_TEXT_RESOURCE=Beg\\u00E4rd resurs \\u00E4r inte tillg\\u00E4nglig.\nOrderQuantity=Orderkvantitet\\:\nSalesDocument=F\\u00F6rs\\u00E4ljningsdokument\\:\nKEY_AND_SUBKEY={0} / {1}\nMaterial=Material\nERROR_DIALOG_TITLE_NOTFOUND=Hittades ej\nclose=St\\u00E4ng\ndone=Klar\nERROR_DIALOG_TITLE_ERROR=Fel\napply=Till\\u00E4mpa\nappDescription=Variantkonfiguration\nNO_TITLE=(ej relevant f\\u00F6r \\u00F6vers\\u00E4ttning)\ntitle=Variantkonfiguration\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_th.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=\\u0E1B\\u0E34\\u0E14\nUnlock=\\u0E1B\\u0E25\\u0E14\\u0E25\\u0E47\\u0E2D\\u0E04\\u0E01\\u0E32\\u0E23\\u0E01\\u0E33\\u0E2B\\u0E19\\u0E14\\u0E23\\u0E39\\u0E1B\\u0E41\\u0E1A\\u0E1A\nERROR_DIALOG_DESCR_SETTINGS=\\u0E42\\u0E2B\\u0E21\\u0E14\\u0E41\\u0E01\\u0E49\\u0E44\\u0E02\\u0E23\\u0E48\\u0E27\\u0E21\\u0E01\\u0E31\\u0E1A\\u0E20\\u0E32\\u0E1E\\u0E08\\u0E33\\u0E25\\u0E2D\\u0E07\\u0E17\\u0E35\\u0E48\\u0E44\\u0E21\\u0E48\\u0E43\\u0E0A\\u0E48\\u0E41\\u0E1A\\u0E1A\\u0E14\\u0E31\\u0E49\\u0E07\\u0E40\\u0E14\\u0E34\\u0E21\\u0E44\\u0E21\\u0E48\\u0E44\\u0E14\\u0E49\\u0E23\\u0E31\\u0E1A\\u0E01\\u0E32\\u0E23\\u0E2A\\u0E19\\u0E31\\u0E1A\\u0E2A\\u0E19\\u0E38\\u0E19\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=\\u0E01\\u0E32\\u0E23\\u0E01\\u0E33\\u0E2B\\u0E19\\u0E14\\u0E04\\u0E48\\u0E32\\u0E17\\u0E35\\u0E48\\u0E23\\u0E30\\u0E1A\\u0E38\\u0E2A\\u0E33\\u0E2B\\u0E23\\u0E31\\u0E1A\\u0E41\\u0E2D\\u0E1E\\u0E44\\u0E21\\u0E48\\u0E44\\u0E14\\u0E49\\u0E23\\u0E31\\u0E1A\\u0E01\\u0E32\\u0E23\\u0E2A\\u0E19\\u0E31\\u0E1A\\u0E2A\\u0E19\\u0E38\\u0E19\nShipToParty=\\u0E1C\\u0E39\\u0E49\\u0E23\\u0E31\\u0E1A\\u0E2A\\u0E34\\u0E19\\u0E04\\u0E49\\u0E32\\:\nLock=\\u0E25\\u0E47\\u0E2D\\u0E04\\u0E01\\u0E32\\u0E23\\u0E01\\u0E33\\u0E2B\\u0E19\\u0E14\\u0E23\\u0E39\\u0E1B\\u0E41\\u0E1A\\u0E1A\ncancel=\\u0E22\\u0E01\\u0E40\\u0E25\\u0E34\\u0E01\nVARIANT_MATCHING=\\u0E0A\\u0E38\\u0E14\\u0E15\\u0E31\\u0E27\\u0E40\\u0E25\\u0E37\\u0E2D\\u0E01\\u0E17\\u0E35\\u0E48\\u0E15\\u0E23\\u0E07\\u0E01\\u0E31\\u0E19\nappTitle=\\u0E01\\u0E32\\u0E23\\u0E01\\u0E33\\u0E2B\\u0E19\\u0E14\\u0E23\\u0E39\\u0E1B\\u0E41\\u0E1A\\u0E1A\\u0E0A\\u0E38\\u0E14\\u0E15\\u0E31\\u0E27\\u0E40\\u0E25\\u0E37\\u0E2D\\u0E01\nConfigurationStatus=\\u0E2A\\u0E16\\u0E32\\u0E19\\u0E30\\u0E01\\u0E32\\u0E23\\u0E01\\u0E33\\u0E2B\\u0E19\\u0E14\\u0E23\\u0E39\\u0E1B\\u0E41\\u0E1A\\u0E1A\nERROR_DIALOG_DESCR_RESOURCE=\\u0E01\\u0E23\\u0E38\\u0E13\\u0E32\\u0E15\\u0E23\\u0E27\\u0E08\\u0E2A\\u0E2D\\u0E1A URL \\u0E41\\u0E25\\u0E30\\u0E25\\u0E2D\\u0E07\\u0E2D\\u0E35\\u0E01\\u0E04\\u0E23\\u0E31\\u0E49\\u0E07\nConfigurationDate=\\u0E27\\u0E31\\u0E19\\u0E17\\u0E35\\u0E48\\:\nERROR_DIALOG_TEXT_RESOURCE=\\u0E44\\u0E21\\u0E48\\u0E21\\u0E35\\u0E17\\u0E23\\u0E31\\u0E1E\\u0E22\\u0E32\\u0E01\\u0E23\\u0E17\\u0E35\\u0E48\\u0E02\\u0E2D\nOrderQuantity=\\u0E1B\\u0E23\\u0E34\\u0E21\\u0E32\\u0E13\\u0E17\\u0E35\\u0E48\\u0E2A\\u0E31\\u0E48\\u0E07\\:\nSalesDocument=\\u0E40\\u0E2D\\u0E01\\u0E2A\\u0E32\\u0E23\\u0E01\\u0E32\\u0E23\\u0E02\\u0E32\\u0E22\\:\nKEY_AND_SUBKEY={0} / {1}\nMaterial=\\u0E27\\u0E31\\u0E2A\\u0E14\\u0E38\nERROR_DIALOG_TITLE_NOTFOUND=\\u0E44\\u0E21\\u0E48\\u0E1E\\u0E1A\nclose=\\u0E1B\\u0E34\\u0E14\ndone=\\u0E40\\u0E2A\\u0E23\\u0E47\\u0E08\\u0E2A\\u0E34\\u0E49\\u0E19\nERROR_DIALOG_TITLE_ERROR=\\u0E02\\u0E49\\u0E2D\\u0E1C\\u0E34\\u0E14\\u0E1E\\u0E25\\u0E32\\u0E14\napply=\\u0E19\\u0E33\\u0E44\\u0E1B\\u0E43\\u0E0A\\u0E49\nappDescription=\\u0E01\\u0E32\\u0E23\\u0E01\\u0E33\\u0E2B\\u0E19\\u0E14\\u0E23\\u0E39\\u0E1B\\u0E41\\u0E1A\\u0E1A\\u0E0A\\u0E38\\u0E14\\u0E15\\u0E31\\u0E27\\u0E40\\u0E25\\u0E37\\u0E2D\\u0E01\nNO_TITLE=(\\u0E44\\u0E21\\u0E48\\u0E40\\u0E01\\u0E35\\u0E48\\u0E22\\u0E27\\u0E02\\u0E49\\u0E2D\\u0E07\\u0E01\\u0E31\\u0E1A\\u0E01\\u0E32\\u0E23\\u0E41\\u0E1B\\u0E25\\u0E07\\u0E04\\u0E48\\u0E32)\ntitle=\\u0E01\\u0E32\\u0E23\\u0E01\\u0E33\\u0E2B\\u0E19\\u0E14\\u0E23\\u0E39\\u0E1B\\u0E41\\u0E1A\\u0E1A\\u0E0A\\u0E38\\u0E14\\u0E15\\u0E31\\u0E27\\u0E40\\u0E25\\u0E37\\u0E2D\\u0E01\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_tr.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=Kapat\nUnlock=Konfig\\u00FCrasyonun blokaj\\u0131n\\u0131 kald\\u0131r\nERROR_DIALOG_DESCR_SETTINGS=Eski olmayan senaryo ile bile\\u015Fimde d\\u00FCzenleme modu desteklenmiyor.\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=Uygulama i\\u00E7in sa\\u011Flanan ayarlar desteklenmiyor.\nShipToParty=Mal\\u0131 teslim alan\\:\nLock=Konfig\\u00FCrasyonu bloke et\ncancel=\\u0130ptal et\nVARIANT_MATCHING=Varyant\\u0131 e\\u015Fle\\u015Ftir\nappTitle=Varyant konfig\\u00FCrasyonu\nConfigurationStatus=Konfig\\u00FCrasyon durumu\nERROR_DIALOG_DESCR_RESOURCE=URL\'yi kontrol edin ve yeniden deneyin.\nConfigurationDate=Tarih\\:\nERROR_DIALOG_TEXT_RESOURCE=Talep edilen kaynak kullan\\u0131lam\\u0131yor.\nOrderQuantity=Sipari\\u015F miktar\\u0131\\:\nSalesDocument=Sat\\u0131\\u015F belgesi\\:\nKEY_AND_SUBKEY={0} / {1}\nMaterial=Malzeme\nERROR_DIALOG_TITLE_NOTFOUND=Bulunamad\\u0131\nclose=Kapat\ndone=Bitti\nERROR_DIALOG_TITLE_ERROR=Hata\napply=Uygula\nappDescription=Varyant konfig\\u00FCrasyonu\nNO_TITLE=(\\u00C7eviri ili\\u015Fkili de\\u011Fil)\ntitle=Varyant konfig\\u00FCrasyonu\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_uk.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=\\u0417\\u0430\\u043A\\u0440\\u0438\\u0442\\u0438\nUnlock=\\u0420\\u043E\\u0437\\u0431\\u043B\\u043E\\u043A\\u0443\\u0432\\u0430\\u0442\\u0438 \\u043A\\u043E\\u043D\\u0444\\u0456\\u0433\\u0443\\u0440\\u0430\\u0446\\u0456\\u044E\nERROR_DIALOG_DESCR_SETTINGS=\\u0420\\u0435\\u0436\\u0438\\u043C \\u0440\\u0435\\u0434\\u0430\\u0433\\u0443\\u0432\\u0430\\u043D\\u043D\\u044F \\u0443 \\u043F\\u043E\\u0454\\u0434\\u043D\\u0430\\u043D\\u043D\\u0456 \\u0437 \\u043D\\u0435\\u043F\\u043E\\u043F\\u0435\\u0440\\u0435\\u0434\\u043D\\u0456\\u043C \\u0441\\u0446\\u0435\\u043D\\u0430\\u0440\\u0456\\u0454\\u043C \\u043D\\u0435 \\u043F\\u0456\\u0434\\u0442\\u0440\\u0438\\u043C\\u0443\\u0454\\u0442\\u044C\\u0441\\u044F.\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=\\u0412\\u043A\\u0430\\u0437\\u0430\\u043D\\u0456 \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438 \\u0434\\u043B\\u044F \\u0437\\u0430\\u0441\\u0442\\u043E\\u0441\\u0443\\u043D\\u043A\\u0443 \\u043D\\u0435 \\u043F\\u0456\\u0434\\u0442\\u0440\\u0438\\u043C\\u0443\\u044E\\u0442\\u044C\\u0441\\u044F.\nShipToParty=\\u041E\\u0434\\u0435\\u0440\\u0436\\u0443\\u0432\\u0430\\u0447 \\u0442\\u043E\\u0432\\u0430\\u0440\\u0443\\:\nLock=\\u0411\\u043B\\u043E\\u043A\\u0443\\u0432\\u0430\\u0442\\u0438 \\u043A\\u043E\\u043D\\u0444\\u0456\\u0433\\u0443\\u0440\\u0430\\u0446\\u0456\\u044E\ncancel=\\u0421\\u043A\\u0430\\u0441\\u0443\\u0432\\u0430\\u0442\\u0438\nVARIANT_MATCHING=\\u0417\\u0432\\u0456\\u0440\\u0438\\u0442\\u0438 \\u0432\\u0430\\u0440\\u0456\\u0430\\u043D\\u0442\nappTitle=\\u041A\\u043E\\u043D\\u0444\\u0456\\u0433\\u0443\\u0440\\u0430\\u0446\\u0456\\u044F \\u0432\\u0430\\u0440\\u0456\\u0430\\u043D\\u0442\\u0430\nConfigurationStatus=\\u0421\\u0442\\u0430\\u0442\\u0443\\u0441 \\u043A\\u043E\\u043D\\u0444\\u0456\\u0433\\u0443\\u0440\\u0430\\u0446\\u0456\\u0457\nERROR_DIALOG_DESCR_RESOURCE=\\u041F\\u0435\\u0440\\u0435\\u0432\\u0456\\u0440\\u0442\\u0435 URL \\u0456 \\u0441\\u043F\\u0440\\u043E\\u0431\\u0443\\u0439\\u0442\\u0435 \\u0437\\u043D\\u043E\\u0432\\u0443.\nConfigurationDate=\\u0414\\u0430\\u0442\\u0430\\:\nERROR_DIALOG_TEXT_RESOURCE=\\u0417\\u0430\\u043F\\u0438\\u0442\\u0430\\u043D\\u0438\\u0439 \\u0440\\u0435\\u0441\\u0443\\u0440\\u0441 \\u043D\\u0435\\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u0438\\u0439.\nOrderQuantity=\\u041A\\u0456\\u043B\\u044C\\u043A\\u0456\\u0441\\u0442\\u044C \\u0437\\u0430\\u043C\\u043E\\u0432\\u043B\\u0435\\u043D\\u043D\\u044F\\:\nSalesDocument=\\u0422\\u043E\\u0440\\u0433\\u043E\\u0432\\u0438\\u0439 \\u0434\\u043E\\u043A\\u0443\\u043C\\u0435\\u043D\\u0442\\:\nKEY_AND_SUBKEY={0} / {1}\nMaterial=\\u041C\\u0430\\u0442\\u0435\\u0440\\u0456\\u0430\\u043B\nERROR_DIALOG_TITLE_NOTFOUND=\\u041D\\u0435 \\u0437\\u043D\\u0430\\u0439\\u0434\\u0435\\u043D\\u043E\nclose=\\u0417\\u0430\\u043A\\u0440\\u0438\\u0442\\u0438\ndone=\\u0412\\u0438\\u043A\\u043E\\u043D\\u0430\\u043D\\u043E\nERROR_DIALOG_TITLE_ERROR=\\u041F\\u043E\\u043C\\u0438\\u043B\\u043A\\u0430\napply=\\u0417\\u0430\\u0441\\u0442\\u043E\\u0441\\u0443\\u0432\\u0430\\u0442\\u0438\nappDescription=\\u041A\\u043E\\u043D\\u0444\\u0456\\u0433\\u0443\\u0440\\u0430\\u0446\\u0456\\u044F \\u0432\\u0430\\u0440\\u0456\\u0430\\u043D\\u0442\\u0430\nNO_TITLE=(\\u041D\\u0435\\u0440\\u0435\\u043B\\u0435\\u0432\\u0430\\u043D\\u0442\\u043D\\u043E \\u0434\\u043B\\u044F \\u043F\\u0435\\u0440\\u0435\\u043A\\u043B\\u0430\\u0434\\u0443)\ntitle=\\u041A\\u043E\\u043D\\u0444\\u0456\\u0433\\u0443\\u0440\\u0430\\u0446\\u0456\\u044F \\u0432\\u0430\\u0440\\u0456\\u0430\\u043D\\u0442\\u0430\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_vi.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=\\u0110o\\u0301ng\nUnlock=M\\u01A1\\u0309 kho\\u0301a c\\u00E2\\u0301u hi\\u0300nh\nERROR_DIALOG_DESCR_SETTINGS=Ch\\u00EA\\u0301 \\u0111\\u00F4\\u0323 hi\\u00EA\\u0323u chi\\u0309nh k\\u00EA\\u0301t h\\u01A1\\u0323p v\\u01A1\\u0301i ki\\u0323ch ba\\u0309n kh\\u00F4ng k\\u00EA\\u0301 th\\u01B0\\u0300a kh\\u00F4ng \\u0111\\u01B0\\u01A1\\u0323c  h\\u00F4\\u0303 tr\\u01A1\\u0323.\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=Thi\\u00EA\\u0301t l\\u00E2\\u0323p \\u0111\\u01B0\\u01A1\\u0323c cung c\\u00E2\\u0301p cho \\u01B0\\u0301ng du\\u0323ng kh\\u00F4ng \\u0111\\u01B0\\u01A1\\u0323c h\\u00F4\\u0303 tr\\u01A1\\u0323.\nShipToParty=B\\u00EAn nh\\u00E2\\u0323n\\:\nLock=Kho\\u0301a c\\u00E2\\u0301u hi\\u0300nh\ncancel=Hu\\u0309y\nVARIANT_MATCHING=Bi\\u00EA\\u0301n th\\u00EA\\u0309 phu\\u0300 h\\u01A1\\u0323p\nappTitle=C\\u00E2\\u0301u hi\\u0300nh bi\\u00EA\\u0301n th\\u00EA\\u0309\nConfigurationStatus=Ti\\u0300nh tra\\u0323ng c\\u00E2\\u0301u hi\\u0300nh\nERROR_DIALOG_DESCR_RESOURCE=Vui lo\\u0300ng ki\\u00EA\\u0309m tra URL va\\u0300 th\\u01B0\\u0309 la\\u0323i.\nConfigurationDate=Nga\\u0300y\\:\nERROR_DIALOG_TEXT_RESOURCE=Ta\\u0300i nguy\\u00EAn \\u0111\\u01B0\\u01A1\\u0323c y\\u00EAu c\\u00E2\\u0300u kh\\u00F4ng co\\u0301 s\\u0103\\u0303n.\nOrderQuantity=S\\u00F4\\u0301 l\\u01B0\\u01A1\\u0323ng \\u0111\\u01A1n \\u0111\\u01A1n ha\\u0300ng\\:\nSalesDocument=Ch\\u01B0\\u0301ng t\\u01B0\\u0300 ba\\u0301n\nKEY_AND_SUBKEY={0} / {1}\nMaterial=V\\u00E2\\u0323t t\\u01B0\nERROR_DIALOG_TITLE_NOTFOUND=Kh\\u00F4ng ti\\u0300m th\\u00E2\\u0301y\nclose=\\u0110o\\u0301ng\ndone=\\u0110a\\u0303 hoa\\u0300n t\\u00E2\\u0301t\nERROR_DIALOG_TITLE_ERROR=L\\u00F4\\u0303i\napply=A\\u0301p du\\u0323ng\nappDescription=C\\u00E2\\u0301u hi\\u0300nh bi\\u00EA\\u0301n th\\u00EA\\u0309\nNO_TITLE=(Kh\\u00F4ng li\\u00EAn quan \\u0111\\u00EA\\u0301n chuy\\u00EA\\u0309n \\u0111\\u00F4\\u0309i)\ntitle=C\\u00E2\\u0301u hi\\u0300nh bi\\u00EA\\u0301n th\\u00EA\\u0309\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_zh_CN.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=\\u5173\\u95ED\nUnlock=\\u89E3\\u9501\\u914D\\u7F6E\nERROR_DIALOG_DESCR_SETTINGS=\\u4E0D\\u652F\\u6301\\u5C06\\u7F16\\u8F91\\u6A21\\u5F0F\\u4E0E\\u975E\\u5386\\u53F2\\u573A\\u666F\\u7EC4\\u5408\\u4F7F\\u7528\\u3002\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=\\u63D0\\u4F9B\\u7684\\u5E94\\u7528\\u8BBE\\u7F6E\\u4E0D\\u53D7\\u652F\\u6301\\u3002\nShipToParty=\\u6536\\u8D27\\u65B9\\uFF1A\nLock=\\u9501\\u5B9A\\u914D\\u7F6E\ncancel=\\u53D6\\u6D88\nVARIANT_MATCHING=\\u5339\\u914D\\u53D8\\u5F0F\nappTitle=\\u53D8\\u5F0F\\u914D\\u7F6E\nConfigurationStatus=\\u914D\\u7F6E\\u72B6\\u6001\nERROR_DIALOG_DESCR_RESOURCE=\\u8BF7\\u68C0\\u67E5 URL\\uFF0C\\u7136\\u540E\\u91CD\\u8BD5\\u3002\nConfigurationDate=\\u65E5\\u671F\\uFF1A\nERROR_DIALOG_TEXT_RESOURCE=\\u8BF7\\u6C42\\u7684\\u8D44\\u6E90\\u4E0D\\u53EF\\u7528\\u3002\nOrderQuantity=\\u8BA2\\u8D2D\\u6570\\u91CF\\uFF1A\nSalesDocument=\\u9500\\u552E\\u51ED\\u8BC1\\uFF1A\nKEY_AND_SUBKEY={0} / {1}\nMaterial=\\u7269\\u6599\nERROR_DIALOG_TITLE_NOTFOUND=\\u672A\\u627E\\u5230\nclose=\\u5173\\u95ED\ndone=\\u5B8C\\u6210\nERROR_DIALOG_TITLE_ERROR=\\u9519\\u8BEF\napply=\\u5E94\\u7528\nappDescription=\\u53D8\\u5F0F\\u914D\\u7F6E\nNO_TITLE=\\uFF08\\u65E0\\u9700\\u7FFB\\u8BD1\\uFF09\ntitle=\\u53D8\\u5F0F\\u914D\\u7F6E\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/i18n/i18n_zh_TW.properties": '#\n#Mon Dec 14 15:03:47 UTC 2020\nVALUE_AND_UOM={0} {1}\nCLOSE_ERROR_DIALOG_TXT=\\u95DC\\u9589\nUnlock=\\u89E3\\u9396\\u7D44\\u614B\nERROR_DIALOG_DESCR_SETTINGS=\\u4E0D\\u652F\\u63F4\\u7DE8\\u8F2F\\u6A21\\u5F0F\\u8207\\u975E\\u820A\\u7248\\u65B9\\u6848\\u7684\\u7D44\\u5408\\u3002\nID_AND_DESCR={0} ({1})\nERROR_DIALOG_TEXT_SETTINGS=\\u4E0D\\u652F\\u63F4\\u61C9\\u7528\\u7A0B\\u5F0F\\u63D0\\u4F9B\\u7684\\u8A2D\\u5B9A\\u3002\nShipToParty=\\u6536\\u8CA8\\u65B9\\uFF1A\nLock=\\u9396\\u4F4F\\u7D44\\u614B\ncancel=\\u53D6\\u6D88\nVARIANT_MATCHING=\\u6BD4\\u5C0D\\u8B8A\\u5F0F\nappTitle=\\u8B8A\\u5F0F\\u7D44\\u614B\nConfigurationStatus=\\u7D44\\u614B\\u72C0\\u614B\nERROR_DIALOG_DESCR_RESOURCE=\\u8ACB\\u6AA2\\u67E5 URL \\u4E26\\u518D\\u8A66\\u4E00\\u6B21\\u3002\nConfigurationDate=\\u65E5\\u671F\\uFF1A\nERROR_DIALOG_TEXT_RESOURCE=\\u6C92\\u6709\\u8ACB\\u6C42\\u7684\\u8CC7\\u6E90\\u3002\nOrderQuantity=\\u8A02\\u55AE\\u6578\\u91CF\\uFF1A\nSalesDocument=\\u92B7\\u552E\\u6587\\u4EF6\\uFF1A\nKEY_AND_SUBKEY={0} / {1}\nMaterial=\\u7269\\u6599\nERROR_DIALOG_TITLE_NOTFOUND=\\u627E\\u4E0D\\u5230\nclose=\\u95DC\\u9589\ndone=\\u5B8C\\u6210\nERROR_DIALOG_TITLE_ERROR=\\u932F\\u8AA4\napply=\\u5957\\u7528\nappDescription=\\u8B8A\\u5F0F\\u7D44\\u614B\nNO_TITLE=(\\u8207\\u7FFB\\u8B6F\\u7121\\u95DC)\ntitle=\\u8B8A\\u5F0F\\u7D44\\u614B\n',
	"i2d/lo/app/zvchclfz/config/legacyintegration/manifest.json": '{"_version":"1.9.0","sap.app":{"id":"i2d.lo.app.zvchclfz.config.legacyintegration","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"8.1.2"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","ach":"LO-VCH-FIO","sourceTemplate":{"id":"ui5template.basicSAPUI5ApplicationProject","version":"1.32.0"},"dataSources":{"mainService":{"uri":"/sap/opu/odata/SAP/LO_VCHCLF_INTEGRATION_LEGACY_SRV/","type":"OData","settings":{"localUri":"localService/metadata.xml"}}}},"sap.ui":{"fullWidth":true,"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true},"supportedThemes":["sap_hcb","sap_belize"]},"sap.ui5":{"rootView":{"viewName":"i2d.lo.app.zvchclfz.config.legacyintegration.view.App","type":"XML"},"dependencies":{"minUI5Version":"1.30.0","libs":{"sap.ui.core":{"lazy":false},"sap.m":{"lazy":false},"sap.ui.layout":{"lazy":false},"sap.i2d.lo.lib.zvchclfz":{"lazy":false}}},"contentDensities":{"compact":true,"cozy":false},"componentUsages":{"configurationComponent":{"name":"sap.i2d.lo.lib.zvchclfz.components.configuration","settings":{}}},"models":{"configStartI18n":{"preload":false,"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"i2d.lo.app.zvchclfz.config.legacyintegration.i18n.i18n"}},"appModel":{"preload":false,"type":"sap.ui.model.json.JSONModel"},"startAppHeaderConfiguration":{"preload":false,"type":"sap.ui.model.json.JSONModel"},"":{"preload":true,"dataSource":"mainService","settings":{"defaultBindingMode":"TwoWay","refreshAfterChange":false}}},"routing":{"config":{"async":true,"routerClass":"sap.m.routing.Router","viewType":"XML","viewPath":"i2d.lo.app.zvchclfz.config.legacyintegration.view","controlId":"app","controlAggregation":"pages","bypassed":{"target":"error"}},"routes":[{"pattern":"","name":"appHome","target":"config"},{"pattern":"error","name":"error","target":"error"}],"targets":{"config":{"viewName":"Config","viewId":"configView","viewLevel":1},"error":{"viewName":"Error","transition":"show","viewLevel":2}}},"resources":{"js":[],"css":[{"uri":"css/style.css"}]}},"sap.fiori":{"registrationIds":["F2819"],"archeType":"transactional"}}',
	"i2d/lo/app/zvchclfz/config/legacyintegration/view/App.view.xml": '<mvc:View controllerName="i2d.lo.app.zvchclfz.config.legacyintegration.controller.App" xmlns="sap.m" xmlns:mvc="sap.ui.core.mvc" displayBlock="true"><App id="app" backgroundColor="Transparent"/></mvc:View>',
	"i2d/lo/app/zvchclfz/config/legacyintegration/view/Config.view.xml": '<mvc:View controllerName="i2d.lo.app.zvchclfz.config.legacyintegration.controller.Config" xmlns:html="http://www.w3.org/1999/xhtml" xmlns:mvc="sap.ui.core.mvc" xmlns:core="sap.ui.core" xmlns="sap.m" height="100%"><App id="configApp"><pages><Page id="configPage" showHeader="false" backgroundDesign="Transparent"><content><core:ComponentContainer id="configurationComponentContainer" height="100%" propagateModel="true"/></content></Page></pages></App></mvc:View>',
	"i2d/lo/app/zvchclfz/config/legacyintegration/view/Error.view.xml": '<mvc:View controllerName="i2d.lo.app.zvchclfz.config.legacyintegration.controller.Error" xmlns="sap.m" xmlns:mvc="sap.ui.core.mvc"><MessagePage id="MessagePageId" title="{path:\'appModel&gt;/errorState\',formatter:\'.getErrorViewTitle\'}" text="{path:\'appModel&gt;/errorState\',formatter:\'.getErrorViewText\'}" description="{path:\'appModel&gt;/errorState\',formatter:\'.getErrorViewDescription\'}" showNavButton="true" navButtonPress=".onNavBack"/></mvc:View>',
	"i2d/lo/app/zvchclfz/config/legacyintegration/view/fragment/SettingsErrorDialog.fragment.xml": '<core:FragmentDefinition xmlns:core="sap.ui.core" xmlns="sap.m"><Dialog id="wrongSettingsDialog" contentWidth="20%" contentHeight="auto" type="Message" state="Error" title="{configStartI18n&gt;ERROR_DIALOG_TITLE}"><endButton><Button id="closeButton" text="{configStartI18n&gt;CLOSE_ERROR_DIALOG_TXT}" press="onErrorDialogClose"/></endButton><content><Text id="errorDialogText" class="sapUiResponsiveMargin" text="{configStartI18n&gt;ERROR_DIALOG_TEXT}"/></content></Dialog></core:FragmentDefinition>'
}, "i2d/lo/app/zvchclfz/config/legacyintegration/Component-preload");