//@ui5-bundle sap/i2d/lo/lib/zvchclfz/library-preload.js
/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/common/Constants', function () {
	var C = {
		VCHCLF_BATCH_GROUP: "i2d_lo_lib_vchclf_batchgroup",
		VCHCLF_CHANGE_SET: "Changes",
		SIM_BATCH_GROUP: "trace-explode-bom",
		CLASSIFICATION_COMPONENT_MODEL_NAME: "component",
		CONFIGURATION_COMPONENT_MODEL_NAME: "component",
		LOCAL_CLASSIFICATION_MODEL_NAME: "localClassificationModel",
		FEATURE_TOGGLE_MODEL_NAME: "featureToggleModel",
		VCHCLF_MODEL_NAME: "vchclf",
		VIEW_MODEL_NAME: "view",
		HEADER_CONFIGURATION_MODEL_NAME: "headerConfiguration",
		CONFIGURATION_SETTINGS_MODEL_NAME: "configurationSettings",
		VALUATION_SETTINGS_MODEL_NAME: "valuationSettings",
		UI_STATE_MODEL_NAME: "uiState",
		VARIANTS_MODEL_NAME: "variants",
		VARIANTS_SETTINGS_MODEL_NAME: "variantsSettings",
		STATUS_CHANGED_DIALOG_MODEL_NAME: "statusChangedDialog",
		CLASSIFICATION: "Classification",
		CONFIGURATION: "Configuration",
		INCONSISTENCY_INFORMATION: {
			"MULTI_DOCU": "MULTI",
			"SINGLE_DOCU": "SINGLE",
			"NO_DOCU": "NO_DOCU"
		},
		CONFIGURATION_STATUS_TYPE: {
			"RELEASED": "1",
			"LOCKED": "2",
			"INCOMPLETE": "3",
			"INCONSISTENT": "4"
		},
		SEM_OBJ_SALES_ORDER: "SalesOrder",
		SEM_OBJ_MATERIAL: "Material",
		ERR_DIALOG_ID: "configurationErrorDialog",
		ERR_DIALOG_CLOSE_BUTTON_ID: "configurationErrorDialog--closeButton",
		ETO_STATUS: {
			PROCESSING_STARTED: "IETST",
			READY_FOR_ENGINEERING: "IETRE",
			IN_PROCESS_BY_ENGINEERING: "IETPE",
			ENGINEERING_FINISHED: "IETFE",
			PROCESSING_FINISHED: "IETCO",
			REVIEW_FINISHED_BY_SALES: "IETRD",
			REVISED_BY_SALES: "IETRS",
			REENGINEERING_NEEDED: "IETHB"
		},
		DIFF_REF_TYPE: {
			CURRENT: "CURR",
			BEFORE_SWITCH_TO_ETO: "STE",
			BEFORE_HANDOVER_TO_ENGINEERING: "HTE",
			BEFORE_REVIEW_BY_SALES: "RBS",
			BEFORE_HANDOVER_BACK_TO_ENGINEERING: "HBE"
		},
		COMPARISON_DIFF_TYPE: {
			UNCHANGED: 0,
			ADDED: 1,
			REMOVED: 2,
			CHANGED: 3
		},
		COMPARISON_ITEM_DIFF_TYPE: {
			INSTANCE: 1,
			GROUP: 2,
			CSTIC: 3,
			VALUE: 4
		}
	};
	return C;
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/common/control/Splitter', ["sap/ui/core/Control", "sap/ui/layout/ResponsiveSplitter",
	"sap/ui/layout/PaneContainer", "sap/ui/layout/SplitPane", "sap/ui/layout/SplitterLayoutData"
], function (C, R, P, S, a) {
	"use strict";
	return C.extend("sap.i2d.lo.lib.zvchclfz.common.control.Splitter", {
		metadata: {
			properties: {
				showLeftContent: {
					type: "boolean",
					defaultValue: false
				},
				leftContentIsAvailable: {
					type: "boolean",
					defaultValue: true
				},
				showRightContent: {
					type: "boolean",
					defaultValue: false
				}
			},
			aggregations: {
				leftContent: {
					type: "sap.ui.core.Control",
					multiple: false,
					bindable: true,
					forwarding: {
						idSuffix: "--leftPane",
						aggregation: "content"
					}
				},
				middleContent: {
					type: "sap.ui.core.Control",
					multiple: false,
					bindable: true,
					forwarding: {
						idSuffix: "--middlePane",
						aggregation: "content"
					}
				},
				rightContent: {
					type: "sap.ui.core.Control",
					multiple: false,
					bindable: true,
					forwarding: {
						idSuffix: "--rightPane",
						aggregation: "content"
					}
				},
				splitter: {
					type: "sap.ui.layout.ResponsiveSplitter",
					multiple: false,
					hidden: true
				}
			},
			events: {
				showRightContent: {
					parameters: {
						show: {
							type: "boolean"
						}
					}
				},
				showLeftContent: {
					parameters: {
						show: {
							type: "boolean"
						}
					}
				}
			},
			defaultAggregation: "middleContent"
		},
		init: function () {
			this._oLeftSplitPane = new S({
				id: this.getId() + "--leftPane",
				requiredParentWidth: 960
			});
			this._oMiddleSplitPane = new S({
				id: this.getId() + "--middlePane",
				requiredParentWidth: 960
			});
			this._oRightSplitPane = new S({
				id: this.getId() + "--rightPane",
				requiredParentWidth: 960
			});
			this._oRootPaneContainer = new P({
				id: this.getId() + "--rootPaneCont",
				panes: [this._oMiddleSplitPane]
			});
			this._oResponsiveSplitter = new R({
				id: this.getId() + "--respSplitter",
				rootPaneContainer: this._oRootPaneContainer,
				defaultPane: this._oMiddleSplitPane
			});
			this.setAggregation("splitter", this._oResponsiveSplitter);
		},
		exit: function () {
			delete this._oLeftSplitPane;
			delete this._oMiddleSplitPane;
			delete this._oRightSplitPane;
			delete this._oRootPaneContainer;
			delete this._oResponsiveSplitter;
		},
		setShowLeftContent: function (s) {
			var i = this.getShowLeftContent();
			if (i === s) {
				return;
			}
			this.setProperty("showLeftContent", s);
			this._showLeftContent(s);
		},
		setShowRightContent: function (s) {
			var i = this.getShowRightContent();
			if (i === s) {
				return;
			}
			this.setProperty("showRightContent", s);
			this._showRightContent(s);
		},
		setLeftContent: function (c) {
			this._showLeftContent(c && this.getShowLeftContent());
			this.setAggregation("leftContent", c);
			this._oLeftSplitPane.setLayoutData(new a({
				size: "35%",
				minSize: 420
			}));
		},
		setLeftContentIsAvailable: function (i) {
			if (!i) {
				this.setShowLeftContent(false);
			}
			this.setProperty("leftContentIsAvailable", i);
		},
		setMiddleContent: function (c) {
			this.setAggregation("middleContent", c);
			this._oMiddleSplitPane.setLayoutData(new a({
				size: "auto",
				minSize: 320
			}));
		},
		setRightContent: function (c) {
			this._showRightContent(c && this.getShowRightContent());
			this.setAggregation("rightContent", c);
			this._oRightSplitPane.setLayoutData(new a({
				size: "20%",
				minSize: 320
			}));
		},
		_showLeftContent: function (s) {
			if (s) {
				this._oRootPaneContainer.insertPane(this._oLeftSplitPane);
				this._oRightSplitPane.setLayoutData(new a({
					size: "20%",
					minSize: 320
				}));
			} else {
				this._oRootPaneContainer.removePane(this._oLeftSplitPane);
			}
			this.fireShowLeftContent({
				"show": s
			});
		},
		_showRightContent: function (s) {
			if (s) {
				this._oRootPaneContainer.addPane(this._oRightSplitPane);
				this._oLeftSplitPane.setLayoutData(new a({
					size: "35%",
					minSize: 420
				}));
			} else {
				this._oRootPaneContainer.removePane(this._oRightSplitPane);
			}
			this.fireShowRightContent({
				show: s
			});
		},
		destroy: function () {
			this._oLeftSplitPane.destroy();
			this._oMiddleSplitPane.destroy();
			this._oRightSplitPane.destroy();
			this._oRootPaneContainer.destroy();
			this._oResponsiveSplitter.destroy();
			C.prototype.destroy.call(this, arguments);
		},
		renderer: function (r, c) {
			r.write("<div");
			r.writeControlData(c);
			r.addStyle("height", "100%");
			r.writeClasses(c);
			r.writeStyles();
			r.write(">");
			r.renderControl(c._oResponsiveSplitter);
			r.write("</div>");
		}
	});
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/common/controller/fragment/Base', ["sap/ui/base/ManagedObject"], function (M) {
	"use strict";
	return M.extend("sap.i2d.lo.lib.zvchclfz.common.controller.fragment.Base", {
		metadata: {
			"abstract": true,
			properties: {
				controller: {
					type: "sap.ui.core.mvc.Controller"
				},
				view: {
					type: "sap.ui.core.mvc.View"
				},
				control: {
					type: "sap.ui.core.Control"
				},
				i18nModelName: {
					type: "string",
					defaultValue: "i18n"
				}
			}
		},
		init: function () {},
		exit: function () {
			this.setController(null);
			this.setView(null);
			this.setControl(null);
		},
		getViewController: function () {
			return this.getView().getController();
		},
		getOwnerComponent: function () {
			return this.getViewController().getOwnerComponent();
		},
		byId: function (i) {
			return this.getViewController().byId(i);
		},
		getModel: function (m) {
			return this.getView().getModel(m);
		},
		getResourceBundle: function () {
			if (!this.vchI18nResourceBundle) {
				this.vchI18nResourceBundle = this.getView().getModel(this.getI18nModelName()).getResourceBundle();
			}
			return this.vchI18nResourceBundle;
		},
		getText: function (k, p) {
			return this.getResourceBundle().getText(k, p);
		},
		getControlById: function (i) {
			var c = null;
			if (i) {
				c = this.byId(i);
				if (!c) {
					c = sap.ui.getCore().byId(i);
				}
			}
			return c;
		},
		setBusy: function (b, i) {
			var c = this.getView();
			if (i) {
				c = this.byId(i);
				if (!c) {
					c = sap.ui.getCore().byId(i);
				}
			}
			if (c) {
				c.setBusyIndicatorDelay(0);
				c.setBusy(b);
			}
		}
	});
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/common/dao/BaseDAO', ["sap/ui/base/ManagedObject",
	"sap/i2d/lo/lib/zvchclfz/common/util/RequestQueue"
], function (M, R) {
	"use strict";
	var s = null;
	return M.extend("sap.i2d.lo.lib.zvchclfz.common.dao.BaseDAO", {
		metadata: {
			"abstract": true,
			manifest: "json",
			properties: {
				dataModel: {
					type: "sap.ui.model.Model"
				},
				draftTransactionController: {
					type: "object"
				}
			},
			events: {
				messagesChanged: {
					parameters: {
						messages: {
							type: "object[]"
						}
					}
				}
			}
		},
		setDataModel: function (d) {
			var o = this.getDataModel();
			if (o) {
				d.detachMessageChange(this._onDataModelMessageChange, this);
			}
			this.setProperty("dataModel", d);
			if (d) {
				d.attachMessageChange(this._onDataModelMessageChange, this);
			}
		},
		_onDataModelMessageChange: function (e) {
			var m = sap.ui.getCore().getMessageManager().getMessageModel();
			var a = m.getData();
			var c = this.getDataModel().getMessagesByEntity("Characteristic");
			var b = a.filter(function (o, i) {
				var d = a.some(function (f, I) {
					var g = (i < I && c.indexOf(o) > -1 && c.indexOf(f) > -1 && o.code === f.code && o.message === f.message);
					return g;
				});
				return !d;
			});
			m.setData(b);
			this.fireEvent("messagesChanged", {
				messages: e.getParameter("newMessages")
			});
		},
		_refreshBinding: function (b, f) {
			return new Promise(function (r, a) {
				if (f) {
					b.filter(f);
				} else {
					b.refresh(true);
				}
				b.attachEventOnce("dataReceived", function (e) {
					var d = e.getParameter("data");
					if (d && d.results) {
						r(d.results);
					} else {
						a();
					}
				});
			});
		},
		createKey: function (S, k) {
			return this.getDataModel().createKey(S, k);
		},
		_saveDraftIsAvailable: function () {
			var d = this.getDraftTransactionController();
			return d && typeof d.saveDraft === "function";
		},
		callFunction: function (f, v) {
			return new Promise(function (r, a) {
				var A = function () {
					this.addToRequestQueue(this.getDataModel().facadeCallFunction.bind(this.getDataModel(), f, v), this).then(r).catch(a);
				}.bind(this);
				if (this._saveDraftIsAvailable()) {
					var d = this.getDraftTransactionController();
					d.saveDraft(A);
				} else {
					A();
				}
			}.bind(this));
		},
		read: function (k, u, c, f, S, e) {
			return this.addToRequestQueue(this.getDataModel().facadeRead.bind(this.getDataModel(), k, u, c, f, S, e), this);
		},
		create: function (k, c) {
			return this.addToRequestQueue(this.getDataModel().facadeCreate.bind(this.getDataModel(), k, c), this);
		},
		refreshBinding: function (b, f) {
			return this.addToRequestQueue(this._refreshBinding.bind(this, b, f), this);
		},
		addToRequestQueue: function (f, c) {
			if (s) {
				return s.then(function () {
					return R.add(f, c);
				}.bind(this));
			} else {
				return R.add(f, c);
			}
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/common/factory/FactoryBase', ["sap/ui/base/ManagedObject",
	"sap/i2d/lo/lib/zvchclfz/common/util/XMLFragmentCache", "sap/i2d/lo/lib/zvchclfz/common/util/XMLFragmentControllerCache"
], function (M, X, a) {
	"use strict";
	return M.extend("sap.i2d.lo.lib.zvchclfz.common.factory.FactoryBase", {
		metadata: {
			"abstract": true,
			properties: {
				dataModel: {
					type: "sap.ui.model.Model"
				},
				settingsModel: {
					type: "sap.ui.model.Model"
				},
				view: {
					type: "sap.ui.core.mvc.View"
				},
				controller: {
					type: "sap.ui.core.mvc.Controller"
				}
			}
		},
		init: function () {
			this._oXMLFragmentControllerCache = new a();
			this._mPropertyBag = {};
		},
		exit: function () {
			this._oXMLFragmentControllerCache.destroy();
			delete this._mPropertyBag;
		},
		setProperty: function (p, v) {
			this._mPropertyBag[p] = v;
			return M.prototype.setProperty.apply(this, arguments);
		},
		createController: function (f, c, F) {
			return this._getXMLFragmentControllerCache().createController(f, c, this._mPropertyBag, F);
		},
		createFragment: function (i, f, c, F) {
			if (typeof c === "string") {
				c = this.createController(f, c, F);
			}
			var C = X.createFragment(i, f, c);
			if (c.setControl) {
				c.setControl(C);
				C.getController = function () {
					return c;
				};
			}
			return C;
		},
		_getXMLFragmentControllerCache: function () {
			return this._oXMLFragmentControllerCache;
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/common/factory/ODataFacadeModelFactory', [
	"sap/i2d/lo/lib/zvchclfz/common/odataFacade/ODataV2FacadeModel", "sap/i2d/lo/lib/zvchclfz/common/odataFacade/ODataV4FacadeModel",
	"sap/ui/model/odata/v2/ODataModel", "sap/ui/model/odata/v4/ODataModel"
], function (O, a, b, c) {
	"use strict";
	var d = {
		createFacadeModel: function (m, p, v) {
			var f;
			if (m instanceof b) {
				f = new O(m, p, v);
			} else if (m instanceof c) {
				f = new a(m, p, v);
			} else {
				throw Error("No FacadeModel defined for '" + m.getMetadata().getName() + "'.");
			}
			return f;
		}
	};
	return d;
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/common/localService/Mockdata', ["sap/ui/base/ManagedObject", "jquery.sap.global",
	"sap/ui/model/json/JSONModel"
], function (M, q, J) {
	"use strict";
	var m = M.extend("sap.i2d.lo.lib.zvchclfz.common.localService.Mockdata", {
		metadata: {
			properties: {
				filteredData: {
					type: "Object",
					defaultValue: {
						results: []
					}
				}
			}
		},
		_oFilteredDataModel: null,
		init: function () {
			var d = {
				CharacteristicGroups: []
			};
			this._oFilteredDataModel = new J(d);
		},
		exit: function () {
			this._oFilteredDataModel.destroy();
			delete this._oFilteredDataModel;
		},
		getCharacteristicGroupSet: function () {
			return this._getFilteredDataModel().getProperty("/CharacteristicGroups");
		},
		setCharacteristicGroupSet: function (g) {
			this._getFilteredDataModel().setProperty("/CharacteristicGroups", g);
		},
		setProperty: function (p, v) {
			this._getFilteredDataModel().setProperty(p, v);
		},
		getProperty: function (p) {
			return this._getFilteredDataModel().getProperty(p);
		},
		getFilteredData: function () {
			return q.extend({}, this.getProperty("filteredData"));
		},
		_getFilteredDataModel: function () {
			return this._oFilteredDataModel;
		}
	});
	return m;
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/common/localService/Mockserver', ["sap/ui/base/ManagedObject", "jquery.sap.global",
	"sap/ui/core/util/MockServer", "sap/i2d/lo/lib/zvchclfz/common/localService/MockserverHelper"
], function (M, q, a, b) {
	"use strict";
	var o = a.prototype._orderQueryOptions;
	a.prototype.setEntitySetData = function (e, d) {
		if (this._oMockdata && this._oMockdata.hasOwnProperty(e)) {
			this._oMockdata[e] = d;
		} else {
			q.sap.log.error("Unrecognized EntitySet name: " + e);
		}
	};
	var m = M.extend("sap.i2d.lo.lib.zvchclfz.common.localService.Mockserver", {
		metadata: {
			properties: {
				config: {
					type: "object"
				},
				useFilter: {
					type: "boolean",
					defaultValue: false
				},
				variantMatchingIndicator: {
					type: "float",
					defaultValue: 0
				},
				pricingActive: {
					type: "boolean",
					defaultValue: true
				},
				characteristicCount: {
					type: "float"
				},
				groupCount: {
					type: "float"
				},
				useSkipTop: {
					type: "boolean",
					defaultValue: false
				},
				createProductVariantWithPricingError: {
					type: "boolean",
					defaultValue: false
				},
				etoStatus: {
					type: "string"
				},
				etoStatusDescription: {
					type: "string"
				},
				activeToggles: {
					type: "array"
				}
			}
		},
		init: function (i) {
			var A = "sap/i2d/lo/lib/zvchclfz/common/",
				c = "/sap/opu/odata/SAP/LO_VCHCLF",
				l = "localService/metadata.xml",
				L = "localService/mockdata/data.json",
				s = q.sap.getModulePath(A + l.replace(".xml", ""), ".xml"),
				d = q.sap.getModulePath(A + L.replace(".json", ""), ".json"),
				r = /.*\/$/.test(c) ? c : c + "/";
			var C = q.extend({
				serverDelay: 50,
				rootUri: r
			}, i || {});
			this._oMockServer = new a({
				rootUri: C.rootUri
			});
			this._orderQueryOptions();
			this._oMockServerHelper = new b("mockserverHelper", {
				mockserver: this._oMockServer,
				mockserverConfig: C,
				localMockserver: this
			});
			this._oMockServer.simulate(s, d);
			var u = q.sap.getUriParameters();
			a.config({
				autoRespond: true,
				autoRespondAfter: (u.get("serverDelay") || C.serverDelay)
			});
			this._addRequiredFunctionCalls();
			this._attachRequestListeners();
		},
		start: function () {
			this._oMockServer.start();
		},
		stop: function () {
			this._oMockServer.stop();
		},
		setConfig: function (c) {
			this.setProperty("config", c);
			this.restart(c);
		},
		restart: function (c) {
			this._oMockServer.destroy();
			this._oMockServerHelper.destroy();
			this.init(c || {});
			this.start();
		},
		getMockServer: function () {
			return this._oMockServer;
		},
		exit: function () {
			this._oMockServer.destroy();
			this._oMockServerHelper.destroy();
			delete this._oMockServer;
			delete this._oMockServerHelper;
		},
		_orderQueryOptions: function () {
			this._oMockServer._orderQueryOptions = function (u) {
				var l = u.length;
				for (var i = l - 1; i > 0; i--) {
					var U = u[i];
					if (U.indexOf("search") === 0) {
						u.splice(i, 1);
					}
					if (!this.getUseSkipTop()) {
						if (U.indexOf("$top=30") === 0) {
							u.splice(i, 1);
						}
						if (U.indexOf("$skip=0") === 0) {
							u.splice(i, 1);
						}
					}
					if (this._shallFilterBeIgnored(U)) {
						u.splice(i, 1);
					}
				}
				return o.call(this, u);
			}.bind(this);
		},
		_attachRequestListeners: function () {
			var c = this._oMockServerHelper;
			var h = sap.ui.core.util.MockServer.HTTPMETHOD;
			this._oMockServer.attachAfter(h.GET, c.afterGetClassificationContext.bind(c), "ClassificationContextSet");
			this._oMockServer.attachBefore(h.POST, c.beforeCreateContextSet.bind(c), "ConfigurationContextSet");
			this._oMockServer.attachBefore(h.GET, c.beforeGetContextSet.bind(c), "ConfigurationContextSet");
			this._oMockServer.attachAfter(h.GET, c.afterGetContextSet.bind(c), "ConfigurationContextSet");
			this._oMockServer.attachBefore(h.GET, c.beforeGetInstanceSet.bind(c), "ConfigurationInstanceSet");
			this._oMockServer.attachAfter(h.GET, c.afterGetInstanceSet.bind(c), "ConfigurationInstanceSet");
			this._oMockServer.attachBefore(h.GET, c.beforeGetCharacteristicGroups.bind(c), "CharacteristicsGroupSet");
			this._oMockServer.attachAfter(h.GET, c.afterGetCharacteristicGroups.bind(c), "CharacteristicsGroupSet");
			this._oMockServer.attachAfter(h.GET, c.afterGetVariantValuationDifference.bind(c), "ConfigurationMaterialVariantSet");
			this._oMockServer.attachAfter(h.GET, c.afterGetRoutingSet.bind(c), "RoutingSet");
			this._oMockServer.attachAfter(h.GET, c.afterGetTraceEntrySet.bind(c), "TraceEntrySet");
			this._oMockServer.attachBefore(h.GET, c.beforeGetInconsistencyInformationSet.bind(c), "InconsistencyInformationSet");
			this._oMockServer.attachAfter(h.GET, c.afterGetInconsistencyInformationSet.bind(c), "InconsistencyInformationSet");
			this._oMockServer.attachAfter(h.POST, c.afterCreateBOMNodeSet.bind(c), "BOMNodeSet");
			this._oMockServer.attachAfter(h.GET, c.afterGetToggleSet.bind(c), "ToggleSet");
		},
		_addRequiredFunctionCalls: function () {
			var r = this._oMockServer.getRequests();
			var c = this._oMockServerHelper;
			r.push({
				method: "POST",
				path: new RegExp("CharacteristicValueAssign(.*)"),
				response: c.updateCsticValue.bind(c, c.unassignValue, c.assignValue)
			});
			r.push({
				method: "POST",
				path: new RegExp("ClearCharacteristic(.*)"),
				response: c.updateCsticValue.bind(c, c.unassignAllValues, null)
			});
			r.push({
				method: "POST",
				path: new RegExp("ValidateConfiguration(.*)"),
				response: c.validateConfiguration.bind(c)
			});
			r.push({
				method: "POST",
				path: new RegExp("DiscardConfigurationDraft(.*)"),
				response: c.discardConfigurationDraft.bind(c)
			});
			r.push({
				method: "POST",
				path: new RegExp("ConfigurationLock(.*)"),
				response: c.lockConfiguration.bind(c)
			});
			r.push({
				method: "POST",
				path: new RegExp("ConfigurationUnlock(.*)"),
				response: c.unlockConfiguration.bind(c)
			});
			r.push({
				method: "POST",
				path: new RegExp("CalculatePricing(.*)"),
				response: c.calculatePricing.bind(c)
			});
			r.push({
				method: "POST",
				path: new RegExp("ExplodeBOM(.*)"),
				response: c.explodeBOM.bind(c)
			});
			r.push({
				method: "POST",
				path: new RegExp("ExplodeRouting(.*)"),
				response: c.explodeRouting.bind(c)
			});
			r.push({
				method: "POST",
				path: new RegExp("ActivateTrace(.*)"),
				response: c.activateTrace.bind(c)
			});
			r.push({
				method: "POST",
				path: new RegExp("DeactivateTrace(.*)"),
				response: c.deactivateTrace.bind(c)
			});
			r.push({
				method: "POST",
				path: new RegExp("IsTraceActive(.*)"),
				response: c.isTraceActive.bind(c)
			});
			r.push({
				method: "POST",
				path: new RegExp("ClearTrace(.*)"),
				response: c.clearTrace.bind(c)
			});
			r.push({
				method: "GET",
				path: new RegExp("(.*)to_TraceEntry\\((.*)\\)(.*)"),
				response: c.getTraceEntryDetail.bind(c)
			});
			r.push({
				method: "GET",
				path: new RegExp("(.*)to_WhereWasValueSet(.*)"),
				response: c.getTraceEntriesForCharacteristic.bind(c)
			});
			r.push({
				method: "GET",
				path: new RegExp("(.*)to_WhereWasUsed(.*)"),
				response: c.getTraceEntriesForCharacteristic.bind(c)
			});
			r.push({
				method: "GET",
				path: new RegExp("(.*)to_TraceCharacteristicVH(.*)"),
				response: c.getTraceCharacteristicVH.bind(c)
			});
			r.push({
				method: "GET",
				path: new RegExp("(.*)to_TraceObjectDependencyVH(.*)"),
				response: c.getTraceDependencyVH.bind(c)
			});
			r.push({
				method: "GET",
				path: new RegExp("(.*)BOMNodes\\?(.*)"),
				response: c.getBOMNodesStructureTree.bind(c)
			});
			r.push({
				method: "GET",
				path: new RegExp("(.*)BOMNodes\\([^\\)]*\\)(.*)"),
				response: c.getBOMNodes.bind(c)
			});
			r.push({
				method: "GET",
				path: new RegExp("(.*)to_OperationPRT\\((.*)\\)(.*)"),
				response: c.getOperationPRT.bind(c)
			});
			r.push({
				method: "POST",
				path: new RegExp("ClassificationInstanceUnassign(.*)"),
				response: c.unassignClass.bind(c)
			});
			r.push({
				method: "POST",
				path: new RegExp("ClassificationInstanceAssign(.*)"),
				response: c.handleClassificationInstanceChange.bind(c)
			});
			r.push({
				method: "POST",
				path: new RegExp("CalculateAlternativeValues(.*)"),
				response: c.calculateAlternativeValues.bind(c)
			});
			r.push({
				method: "GET",
				path: new RegExp("(.*)/to_StandardValues"),
				response: c.getOperationStandardValues.bind(c)
			});
			r.push({
				method: "POST",
				path: new RegExp("CreateFullyMatchingProductVariant(.*)"),
				response: c.createFullyMatchingProductVariant.bind(c)
			});
			r.push({
				method: "POST",
				path: new RegExp("SetPreferredVariant(.*)"),
				response: c.setPreferredVariant.bind(c)
			});
			r.push({
				method: "POST",
				path: new RegExp("SwitchToETO(.*)"),
				response: c.switchToETO.bind(c)
			});
			r.push({
				method: "POST",
				path: new RegExp("SetETOStatus(.*)"),
				response: c.setETOStatus.bind(c)
			});
			r.push({
				method: "POST",
				path: new RegExp("CreateOrderBOM(.*)"),
				response: c.createOrderBOM.bind(c)
			});
			r.push({
				method: "POST",
				path: new RegExp("DeleteBOMItem(.*)"),
				response: c.deleteBOMItem.bind(c)
			});
			this._oMockServer.setRequests(r);
		},
		_shallFilterBeIgnored: function (u) {
			var i = u.indexOf("$filter") !== 0;
			if (i) {
				return false;
			}
			if (this.getUseFilter()) {
				return false;
			}
			var I = u.indexOf("$filter=IsHidden eq false") === 0 && u.indexOf("$filter=IsHidden eq false and ChangeTimestamp gt") !== 0;
			if (I) {
				return false;
			}
			var c = u.indexOf("$filter=VariantCondition") === 0 || u.indexOf("$filter=CondTypeId") === 0;
			if (c) {
				return false;
			}
			var d = u.indexOf("IsFullMatch") > 0 || u.indexOf("substringof(") > 0 && u.indexOf(",ProductDescription)") > 0 || u.indexOf(
				"substringof(") > 0 && u.indexOf(",Product)") > 0;
			if (d) {
				return false;
			}
			return true;
		}
	});
	return m;
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/common/localService/MockserverHelper', ["sap/ui/base/ManagedObject", "jquery.sap.global",
	"sap/i2d/lo/lib/zvchclfz/common/localService/Mockdata", "sap/i2d/lo/lib/zvchclfz/common/Constants"
], function (M, q, a, C) {
	"use strict";
	var c =
		"/ConfigurationContextSet('VCH(12)SEMANTIC_OBJ(12)SemanticObj1(10)OBJECT_KEY(10)ObjectKey1(9)DRAFT_KEY(9)DraftKey1(16)DRAFT_KEY_IS_STR(1)X(14)EMBEDDING_MODE(13)Configuration(15)LEGACY_SCENARIO(1)X(7)UI_MODE(4)Edit')?$expand=Instances%2FCharacteristicsGroups%2CInconsistencyInformation%2CUISettings";
	var m = M.extend("sap.i2d.lo.lib.zvchclfz.common.localService.MockserverHelper", {
		metadata: {
			properties: {
				mockserver: {
					type: "sap.ui.core.util.MockServer"
				},
				mockserverConfig: {
					type: "object"
				},
				localMockserver: {
					type: "sap.i2d.lo.lib.zvchclfz.common.localService.Mockserver"
				}
			}
		},
		init: function () {
			this._oMockdata = new a();
		},
		exit: function () {
			this._oMockdata.destroy();
			delete this._oMockdata;
		},
		_emptyResponse: JSON.stringify({
			d: {
				results: []
			}
		}),
		_bCharacteristicValueChanged: false,
		_bInitialCall: true,
		_assignableClasses: [],
		_resetDefaultValues: function (d) {
			d.forEach(function (D) {
				if (D.IsDefaultValueRemember) {
					D.IsDefaultValue = false;
				}
			});
		},
		_hasAssginedValue: function (d) {
			var h = false;
			d.forEach(function (D) {
				if (D.Assigned) {
					h = true;
				}
			});
			return h;
		},
		_restoreDefaultValues: function (d, i) {
			if (i) {
				var h = this._hasAssginedValue(d);
				d.forEach(function (D) {
					if (D.IsDefaultValueRemember && !h) {
						D.IsDefaultValue = true;
					}
				});
			} else {
				d.forEach(function (D) {
					if (D.IsDefaultValueRemember && !D.Assigned) {
						D.IsDefaultValue = true;
					}
				});
			}
		},
		_updateCsticData: function (s) {
			var A = false,
				b = "",
				h = false,
				v = s.Characteristic.DomainValues.results.length,
				i = s.Characteristic.IsSingleValued;
			s.Characteristic.DomainValues.results.forEach(function (d) {
				if (!d.Assigned && d.IsDefaultValue) {
					A = true;
				}
				if (i && (d.Assigned || d.IsDefaultValue)) {
					b = d.ValueId;
				}
				if (d.Assigned) {
					h = true;
				}
			});
			s.Characteristic.AssignedValueId = b;
			s.Characteristic.HasAssignedValue = h;
			s.Characteristic.ChangeTimestamp = new Date();
			s.Characteristic.ValueCount = v;
			s.Characteristic.HasDefaultValues = (A && s.Characteristic.HasDefaultValuesRemember);
		},
		_splitStringBySeparator: function (s, S) {
			if (s.search(S) >= 0) {
				var b = s,
					n = 0,
					v = [],
					i = 0,
					d = true;
				while (d) {
					if (b.search(S) >= 0) {
						n = n + b.search(S) + 1;
						b = b.slice(b.search(S) + 1, b.length);
						v.push(s.slice(i, n - 1));
						i = n;
					} else {
						v.push(s.slice(i, s.length));
						d = false;
					}
				}
				return v;
			}
			return [s];
		},
		_moveArrayIntoObject: function (A) {
			var k = {};
			A.forEach(function (e) {
				var p = e.search("=");
				var P = e.slice(0, p);
				var s = e.slice(p + 1, e.length);
				if (s.search("'") >= 0) {
					s = s.slice(1, s.length - 1);
					s = unescape(s);
				}
				k[P] = [s];
			});
			return k;
		},
		_getKeyMap: function (u) {
			if (u.search("/?") >= 0) {
				u = u.slice(1, u.length);
			}
			var k = this._splitStringBySeparator(u, "&");
			var K = this._moveArrayIntoObject(k);
			if (K.StringValue && K.StringValue[0]) {
				var s = this._splitStringBySeparator(K.StringValue[0], ";");
				K.StringValue = s;
			} else {
				K.StringValue = [];
			}
			if (K.TechnicalValue) {
				var t = this._splitStringBySeparator(K.TechnicalValue[0], ";");
				K.TechnicalValue = t;
			}
			return K;
		},
		_getSelectedCharacteristic: function (o) {
			var s = {};
			var g = this._oMockdata.getCharacteristicGroupSet();
			g.forEach(function (G) {
				var b = G.Characteristics.results;
				if (b) {
					for (var n = 0; n < b.length; n++) {
						if (b[n].CsticId === o.CsticId[0] && b[n].GroupId == o.GroupId[0]) {
							s.Characteristic = b[n];
							break;
						}
					}
				}
			});
			return s;
		},
		_hasSelectionAdditionalValues: function (d, o) {
			for (var n = 0; n < o.ValueId.length; n++) {
				if (d === o.ValueId[n]) {
					return true;
				}
			}
			return false;
		},
		_unassignAllValuesConsideringAdditional: function (s, o) {
			var d = s.Characteristic.DomainValues.results;
			var n = 0;
			for (var i = 0; i < d.length; i++) {
				if (d[i].IsAdditionalValue) {
					if (this._hasSelectionAdditionalValues(d[i].ValueId, o)) {
						d[i].Assigned = false;
						n++;
					} else {
						d.splice(i, 1);
						n++;
					}
				} else if (d[i].Assigned && !d[i].IsReadonly) {
					d[i].Assigned = false;
					n++;
				}
			}
			return n;
		},
		unassignAllValues: function (o, s) {
			var n = 0;
			var d = s.Characteristic.DomainValues.results;
			for (var i = 0; i < d.length; i++) {
				if (d[i].Assigned && !d[i].IsReadonly) {
					d[i].Assigned = false;
					if (d[i].IsAdditionalValue) {
						d.splice(i, 1);
					}
					n++;
				}
			}
			return n;
		},
		_unassignSingleValuedCstic: function (s) {
			var d = s.Characteristic.DomainValues.results;
			for (var i = 0; i < d.length; i++) {
				if (d[i].Assigned) {
					d[i].Assigned = false;
					if (d[i].IsAdditionalValue) {
						d.splice(i, 1);
					}
					break;
				}
			}
		},
		_isDuplicateAssignment: function (n, d) {
			for (var i = 0; d.length > i; i++) {
				if (n === d[i].ValueId) {
					d[i].Assigned = true;
					return true;
				}
			}
			return false;
		},
		_createAdditionalValue: function (o, s) {
			if (!o.StringValue) {
				return;
			}
			var n = this._getSampleCsticValueData();
			n.ValueId = o.StringValue[s] + "-";
			n.Description = o.StringValue[s];
			n.FormattedValueFrom = o.StringValue[s];
			n.TechnicalValueFrom = o.StringValue[s];
			n.TechnicalValue = o.StringValue[s];
			n.CsticId = o.CsticId[0];
			n.InstanceId = o.InstanceId[0];
			n.ContextId = o.ContextId[0];
			n.GroupId = parseInt(o.GroupId[0], 10);
			n.__metadata = {
				id: "/sap/opu/odata/SAP/LO_VCHCLF/CharacteristicValueSet(ContextId='" + n.ContextId + "',InstanceId='" + n.InstanceId +
					"',GroupId=" + n.GroupId + ",CsticId='" + n.CsticId + "',ValueId='" + n.ValueId + "')",
				type: "LO_VCHCLF.CharacteristicValue",
				uri: "/sap/opu/odata/SAP/LO_VCHCLF/CharacteristicValueSet(ContextId='" + n.ContextId + "',InstanceId='" + n.InstanceId +
					"',GroupId=" + n.GroupId + ",CsticId='" + n.CsticId + "',ValueId='" + n.ValueId + "')"
			};
			return n;
		},
		_createAdditionalValueFromTechValue: function (o, t) {
			var n = this._getSampleCsticValueData();
			n.ValueId = o.TechnicalValue[t] + "-";
			n.Description = o.TechnicalValue[t];
			n.FormattedValueFrom = o.TechnicalValue[t];
			n.TechnicalValueFrom = o.TechnicalValue[t];
			n.TechnicalValue = o.TechnicalValue[t];
			n.CsticId = o.CsticId[0];
			n.InstanceId = o.InstanceId[0];
			n.ContextId = o.ContextId[0];
			n.GroupId = parseInt(o.GroupId[0], 10);
			n.__metadata = {
				id: "/sap/opu/odata/SAP/LO_VCHCLF/CharacteristicValueSet(ContextId='" + n.ContextId + "',InstanceId='" + n.InstanceId +
					"',GroupId=" + n.GroupId + ",CsticId='" + n.CsticId + "',ValueId='" + n.ValueId + "')",
				type: "LO_VCHCLF.CharacteristicValue",
				uri: "/sap/opu/odata/SAP/LO_VCHCLF/CharacteristicValueSet(ContextId='" + n.ContextId + "',InstanceId='" + n.InstanceId +
					"',GroupId=" + n.GroupId + ",CsticId='" + n.CsticId + "',ValueId='" + n.ValueId + "')"
			};
			return n;
		},
		_setDomainValue: function (d, I) {
			for (var i = 0; i < d.length; i++) {
				if (d[i].Description === I || d[i].TechnicalValue === I) {
					d[i].Assigned = true;
					return true;
				}
			}
			return false;
		},
		_getSpecificCstic: function (b, s) {
			var S = {};
			b.forEach(function (o) {
				if (o.CsticId === s) {
					S = o;
				}
			});
			return S;
		},
		_oChangeMap: {
			sCsticIdToRemoveValues: "Vendor1",
			csticPropertychanges: [{
				csticId: "MType1",
				property: "IsRequired",
				newValue: true
			}, {
				csticId: "MType1",
				property: "IsInconsistent",
				newValue: true
			}, {
				csticId: "Sector1",
				property: "IsHidden",
				newValue: true
			}, {
				csticId: "Sector1",
				property: "HasValueContradiction",
				newValue: true
			}]
		},
		_adjustDataToCurrentState: function (b, s) {
			var S = s.AssignedValueId;
			var o = this._getSpecificCstic(b, this._oChangeMap.sCsticIdToRemoveValues);
			if (o.DomainValues && o.DomainValues.results) {
				switch (S) {
				case "State_Trigger_Dependency":
					this._applyChanges(this._oChangeMap, b);
					this._stashValues(o);
					this._handleDIEN(b, true);
					break;
				default:
					this._restoreValues(o);
					this._handleDIEN(b, false);
				}
			}
		},
		_oContext: {},
		_applyChanges: function (o, b) {
			o.csticPropertychanges.forEach(function (d) {
				var e = this._getSpecificCstic(b, d.csticId);
				e[d.property] = d.newValue;
			}, this);
		},
		_stashValues: function (o) {
			this._oContext.oldDomainValues = JSON.parse(JSON.stringify(o.DomainValues));
			this._oContext.oldAssignedValues = JSON.parse(JSON.stringify(o.AssignedValues));
			o.DomainValues.results = [];
			o.AssignedValues.results = [];
		},
		_restoreValues: function (o) {
			if (this._oContext.oldDomainValues) {
				o.DomainValues.results = this._oContext.oldDomainValues.results;
				o.AssignedValues.results = this._oContext.oldAssignedValues.results;
			}
		},
		_removeDIENValue: function (v) {
			v.forEach(function (V, i) {
				if (V.ValueId === "DIEN") {
					v.splice(i, 1);
				}
			});
		},
		_getSampleCsticValueData: function () {
			return {
				"IsAdditionalValue": true,
				"UnitFrom": "",
				"UnitTo": "",
				"Currency": "",
				"IntervalType": "1",
				"HasLongText": false,
				"Description": "Additional Value",
				"IsInconsistent": false,
				"Assigned": true,
				"DepObjNumber": "000000000",
				"IsDefaultValue": false,
				"IsDefaultValueRemember": false,
				"IsSetByObjectDependency": false,
				"IsExcluded": false,
				"IsReadonly": false,
				"FormattedValueFrom": "",
				"FormattedValueTo": "",
				"TechnicalValueFrom": "",
				"TechnicalValueTo": "",
				"TechnicalValue": ""
			};
		},
		_buildDIENValue: function (t) {
			var d = this._getSampleCsticValueData();
			var s =
				"VCH(12)SEMANTIC_OBJ(12)SemanticObj1(10)OBJECT_KEY(10)ObjectKey1(9)DRAFT_KEY(9)DraftKey1(16)DRAFT_KEY_IS_STR(1)X(14)EMBEDDING_MODE(13)Configuration(15)LEGACY_SCENARIO(1)X(7)UI_MODE(4)Edit";
			var e = "CharacteristicValueSet(ContextId='" + s + "',InstanceId='1',GroupId=1,CsticId='MType1',ValueId='DIEN')";
			var u = "/sap/opu/odata/SAP/LO_VCHCLF/" + e;
			q.extend(d, {
				"ContextId": s,
				"InstanceId": "1",
				"GroupId": 1,
				"CsticId": "MType1",
				"ValueId": "DIEN",
				"__metadata": {
					"id": u,
					"uri": u,
					"type": "LO_VCHCLF.CharacteristicValue"
				},
				"to_CharacteristicValueDetail": {
					__deferred: {
						uri: "/sap/opu/odata/SAP/LO_VCHCLF/CharacteristicValueSet(ContextId='VCH(12)SEMANTIC_OBJ(12)SemanticObj1(10)OBJECT_KEY(10)ObjectKey1(9)DRAFT_KEY(9)DraftKey1(16)DRAFT_KEY_IS_STR(1)X(14)EMBEDDING_MODE(13)Configuration(15)LEGACY_SCENARIO(1)X(7)UI_MODE(4)Edit',InstanceId='1',GroupId=1,CsticId='MType1',ValueId='1')/to_CharacteristicValueDetail"
					}
				},
				"to_ObjectDependencyHeaders": {
					__deferred: {
						uri: "/sap/opu/odata/SAP/LO_VCHCLF/CharacteristicValueSet(ContextId='VCH(12)SEMANTIC_OBJ(12)SemanticObj1(10)OBJECT_KEY(10)ObjectKey1(9)DRAFT_KEY(9)DraftKey1(16)DRAFT_KEY_IS_STR(1)X(14)EMBEDDING_MODE(13)Configuration(15)LEGACY_SCENARIO(1)X(7)UI_MODE(4)Edit',InstanceId='1',GroupId=1,CsticId='MType1',ValueId='1')/to_ObjectDependencyHeaders"
					}
				}
			});
			return d;
		},
		_handleDIEN: function (b, d) {
			var D = [],
				A = [];
			var o = this._getSpecificCstic(b, "MType1");
			D = o.DomainValues.results;
			A = o.AssignedValues.results;
			var e = false;
			D.forEach(function (v) {
				if (v.ValueId === "DIEN") {
					e = true;
				}
			});
			if (!d && e) {
				this._removeDIENValue(D);
				this._removeDIENValue(A);
			} else if (d && !e) {
				var f = this._buildDIENValue(D[0]);
				D.push(f);
				A.length = 0;
				A.push(f);
			}
		},
		_configurationStatusHandling: function (k) {
			if (k.CsticId[0] === "CONF_STATUS") {
				var s = k.TechnicalValue[0] || k.ValueId[0].substring(0, 1) + k.ValueId[0].substring(1).toLowerCase();
				this._oMockdata.setProperty("/NewStatusDescription", s);
				switch (s) {
				case "Released":
					this._oMockdata.setProperty("/NewStatusType", "1");
					break;
				case "Locked":
					this._oMockdata.setProperty("/NewStatusType", "2");
					break;
				case "Incomplete":
					this._oMockdata.setProperty("/NewStatusType", "3");
					break;
				case "Inconsistent":
					this._oMockdata.setProperty("/NewStatusType", "4");
					break;
				}
			}
		},
		_inconsistencyInformationHandling: function (k) {
			if (k.CsticId[0] === "INCONSISTENCY_INFO_CONTROL") {
				var i = k.TechnicalValue[0] || k.ValueId[0].substring(0, 1) + k.ValueId[0].substring(1).toLowerCase();
				this._oMockdata.setProperty("/InconsistencyState", i);
			}
		},
		_handlePricing: function (k) {
			if (k.CsticId[0] === "PRICING_TEST_COLOR" && k.ValueId[0] === "RED") {
				this._oMockdata.setProperty("/NewPrice", 200);
			}
		},
		_handleStatus: function (k, s) {
			if (k.CsticId[0] === "StatusCstic") {
				var b = this._oMockdata.getProperty("/CharacteristicGroups/0/Characteristics/results");
				this._adjustDataToCurrentState(b, s.Characteristic);
				this._oMockdata.setProperty("/CharacteristicGroups/0/Characteristics/results", b);
			}
		},
		_changeGroupsBeforeDisplay: function (g, e) {
			var I = false;
			var d;
			var A;
			var s;
			if (this.getLocalMockserver().getGroupCount()) {
				g.splice(this.getLocalMockserver().getGroupCount());
			}
			var b = function (D) {
				if (D.ValueId === s && (D.Assigned || D.IsDefaultValue)) {
					A.push(D);
				}
			};
			var f = function (D) {
				if (D.Assigned || D.IsDefaultValue) {
					A.push(D);
				}
			};
			var h = function () {
				if (!d || !A) {
					return;
				}
				A.splice(0, A.length);
				d.forEach(function (D) {
					if (I) {
						b(D);
					} else {
						f(D);
					}
				});
			};
			g.forEach(function (G) {
				var j = G.Characteristics.results;
				if (j) {
					var k = this.getLocalMockserver().getCharacteristicCount();
					if (k !== null && G.CsticCount > k) {
						j.splice(k);
						e.getParameter("oFilteredData").results[0].CsticCount = k;
						G.CsticCount = k;
					}
					for (var i = 0; i < j.length; i++) {
						d = j[i].DomainValues.results;
						A = j[i].AssignedValues.results;
						I = j[i].IsSingleValued;
						s = j[i].AssignedValueId;
						h();
					}
				}
			}.bind(this));
		},
		_lockHandling: function (x, s, S) {
			if (x.readyState === 4) {
				return;
			}
			this._oMockdata.setProperty("/NewStatusDescription", s);
			this._oMockdata.setProperty("/NewStatusType", S);
			x.respondJSON(200, {}, this._emptyResponse);
		},
		_moveInstance: function (u, b, d) {
			var I = u.indexOf("InstanceId") + 12;
			var e = u.substring(I, I + 12);
			for (var i = 0; i < b.length; i++) {
				var o = b[i];
				if (o.InstanceId.toString() === e) {
					d.push(o);
					b.splice(i, 1);
					break;
				}
			}
		},
		_assignDefaultValue: function (d) {
			d.forEach(function (D) {
				if (D.IsDefaultValue) {
					D.Assigned = true;
					D.IsDefaultValue = false;
				}
			});
		},
		_hasResponseCsticGroups: function (d) {
			if (!d) {
				return false;
			}
			if (!!this._getCsticGroupsFromResponse(d).length) {
				return true;
			} else {
				return false;
			}
		},
		_getCsticGroupsFromResponse: function (d) {
			if (d.Instances && d.Instances.results && d.Instances.results[0].CharacteristicsGroups) {
				return d.Instances.results[0].CharacteristicsGroups.results;
			} else if (d.results && d.results[0].CharacteristicsGroups) {
				return d.results[0].CharacteristicsGroups.results;
			} else {
				return [];
			}
		},
		beforeCreateContextSet: function (e) {
			var x = e.getParameter("oXhr");
			var b = JSON.parse(x.requestBody);
			b.ContextId =
				"VCH(12)SEMANTIC_OBJ(12)SemanticObj1(10)OBJECT_KEY(10)ObjectKey1(9)DRAFT_KEY(9)DraftKey1(16)DRAFT_KEY_IS_STR(1)X(14)EMBEDDING_MODE(13)Configuration(15)LEGACY_SCENARIO(1)X(7)UI_MODE(4)Edit";
			x.requestBody = JSON.stringify(b);
		},
		beforeGetContextSet: function (e) {
			if (e.getParameter("sNavProp") === "InconsistencyInformation") {
				return;
			}
			var o = this.getMockserver();
			var b = o.getEntitySetData("ConfigurationContextSet");
			if (this._oMockdata.getCharacteristicGroupSet() && this._oMockdata.getProperty("/NewStatusDescription")) {
				b[0].StatusDescription = this._oMockdata.getProperty("/NewStatusDescription");
				b[0].StatusType = this._oMockdata.getProperty("/NewStatusType");
				b[5].StatusDescription = this._oMockdata.getProperty("/NewStatusDescription");
				b[5].StatusType = this._oMockdata.getProperty("/NewStatusType");
				o.setEntitySetData("ConfigurationContextSet", b);
			}
			if (this._oMockdata.getCharacteristicGroupSet() && this._oMockdata.getProperty("/NewPrice")) {
				b[0].NetValue = this._oMockdata.getProperty("/NewPrice");
				b[5].NetValue = this._oMockdata.getProperty("/NewPrice");
				o.setEntitySetData("ConfigurationContextSet", b);
			}
			if (this._oMockdata.getCharacteristicGroupSet() && (this.getLocalMockserver().getEtoStatus() || this._oMockdata.getProperty(
					"/NewETOStatus"))) {
				b[0].EtoStatus = this._oMockdata.getProperty("/NewETOStatus") || this.getLocalMockserver().getEtoStatus();
				b[0].EtoStatusDescription = this._oMockdata.getProperty("/NewETOStatusDescription") || this.getLocalMockserver().getEtoStatusDescription();
				b[5].EtoStatusDescription = this._oMockdata.getProperty("/NewETOStatusDescription") || this.getLocalMockserver().getEtoStatusDescription();
				b[5].EtoStatus = this._oMockdata.getProperty("/NewETOStatus") || this.getLocalMockserver().getEtoStatus();
				this.getMockserver().setEntitySetData("ConfigurationContextSet", b);
			}
			if (this._oMockdata.getProperty("/CreateOrderBOM")) {
				var B = o.getEntitySetData("BOMNodeSet");
				B[9].BOMCategory = "K";
				B[9].FixateState = "C";
				B[9].Quantity = 0;
				B[11].BOMCategory = "K";
				B[11].FixateState = "A";
				B[11].Quantity = 0;
				if (this._oMockdata.getProperty("/FixOrderBOMMode") === "2") {
					B[10].BOMCategory = "K";
					B[10].FixateState = "C";
					B[10].Quantity = 1;
				}
				this._oMockdata.setProperty("/CreateOrderBOM", false);
				this.getMockserver().setEntitySetData("BOMNodeSet", B);
			}
			if (this.getMockserver().getEntitySetData("BOMNodeSet")) {
				var d = this.getMockserver().getEntitySetData("BOMNodeSet");
				d.forEach(function (f) {
					if (f.BOMComponentName === "BOM_COMPONENT_2_IN_EDIT_MODE" || f.BOMComponentName === "BOM_COMPONENT_1_IN_EDIT_MODE") {
						f.to_ConfigurationInstance = {
							"ContextId": "VCH(12)SEMANTIC_OBJ(12)SemanticObj1(10)OBJECT_KEY(10)ObjectKey1(9)DRAFT_KEY(9)DraftKey1(16)DRAFT_KEY_IS_STR(1)X(14)EMBEDDING_MODE(10)Simulation(15)LEGACY_SCENARIO(1)X(7)UI_MODE(4)Edit",
							"InstanceId": "INSTANCE_ID_1",
							"ParentInstanceId": "PARENT_INSTANCE_ID_1",
							"Material": "MAT_01",
							"MaterialDescription": "Test Instance for BOM Node",
							"StatusId": "1",
							"StatusType": "1",
							"StatusDescription": "Released",
							"ConfigurationValidationStatus": "1",
							"ConfigurationValidationStatusDescription": "Validated",
							"deferred": {
								"uri": "/sap/opu/odata/SAP/LO_VCHCLF/BOMNodeSet('00000001-00000012-00000013')/to_ConfigurationInstance"
							}
						};
					}
				});
				this.getMockserver().setEntitySetData("BOMNodeSet", d);
			}
			if (this._oMockdata.getProperty("/DeleteBOMItem")) {
				var B = o.getEntitySetData("BOMNodeSet");
				this._oMockdata.setProperty("/DeleteBOMItem", false);
				B.splice(10, 1);
				this.getMockserver().setEntitySetData("BOMNodeSet", B);
			}
			if (this._oMockdata.getProperty("/InsertBOMItem")) {
				var d = this.getMockserver().getEntitySetData("BOMNodeSet");
				var n = this._oMockdata.getProperty("/InsertBOMItem");
				var N = q.extend({}, d[10]);
				N = q.extend(N, n);
				N.Product = n.BOMComponentName || "NEW_BOM_ITEM";
				N.BOMComponentName = n.BOMComponentName || "NEW_BOM_ITEM";
				N.ProductName = "New BOM item";
				N.BOMCategory = "K";
				N.ComponentId = "NEW_COMPONENT_" + Math.floor(Math.random() * Math.floor(100));
				d.push(N);
				this.getMockserver().setEntitySetData("BOMNodeSet", d);
			}
		},
		afterGetContextSet: function (e) {
			var g = [];
			var u = e.getParameter("oXhr").url;
			var i = u.indexOf("/ConfigurationContext");
			var s = u.slice(i);
			var d = e.getParameter("oFilteredData") || e.getParameter("oEntry");
			if (u.includes("BOMNode") && e.getParameter("oFilteredData") && e.getParameter("oFilteredData").results.length === 1 && e.getParameter(
					"oFilteredData").results[0].BOMComponentName) {
				e.getParameter("oFilteredData").results[0].DrilldownState = "leaf";
				return;
			}
			if (s === c) {
				d.VariantMatchingIndicator = this.getLocalMockserver().getVariantMatchingIndicator();
				if (this.getLocalMockserver().getPricingActive()) {
					d.PricingActive = 'X';
				} else {
					d.PricingActive = ' ';
				}
			}
			if (this._hasResponseCsticGroups(d)) {
				g = this._getCsticGroupsFromResponse(d);
			}
			if (this._oMockdata.getCharacteristicGroupSet().length > 0) {
				g = this._oMockdata.getCharacteristicGroupSet();
			}
			if (!g) {
				return;
			}
			if (g.length === 0) {
				return;
			}
			if (g[0].Characteristics && g[0].Characteristics.results) {
				this._changeGroupsBeforeDisplay(g, e);
			}
			this._oMockdata.setCharacteristicGroupSet(g);
			if (d.InconsistencyInformation && d.InconsistencyInformation.results) {
				switch (this._oMockdata.getProperty("/InconsistencyState")) {
				case "1":
					d.InconsistencyInformation.results = d.InconsistencyInformation.results.slice(0, 1);
					d.Instances.results[0].ConfigurationValidationStatus = "4";
					break;
				case "2":
					d.InconsistencyInformation.results = d.InconsistencyInformation.results.slice(0, 2);
					d.Instances.results[0].ConfigurationValidationStatus = "4";
					break;
				case "3":
					d.InconsistencyInformation.results = d.InconsistencyInformation.results.slice(2, 3);
					d.Instances.results[0].ConfigurationValidationStatus = "4";
					break;
				case "4":
					d.InconsistencyInformation.results = d.InconsistencyInformation.results.slice(3);
					d.Instances.results[0].ConfigurationValidationStatus = "4";
					break;
				case "5":
					d.InconsistencyInformation.results = d.InconsistencyInformation.results.slice(1, 3);
					d.Instances.results[0].ConfigurationValidationStatus = "4";
					break;
				case "6":
					d.InconsistencyInformation.results = [];
					d.Instances.results[0].ConfigurationValidationStatus = "1";
					break;
				default:
					if (d.InconsistencyInformation && d.InconsistencyInformation.results) {
						d.InconsistencyInformation.results = d.InconsistencyInformation.results.slice(0, 1);
					}
				}
			} else if (d.results && d.results[0].Details) {}
		},
		beforeGetInstanceSet: function (e) {
			if (e.getParameter("sNavProp") === "FullMatchingVariants") {
				return;
			}
			if (this._oMockdata.getCharacteristicGroupSet().length > 0) {
				var g = this._oMockdata.getCharacteristicGroupSet(),
					A = [],
					b = [];
				g.forEach(function (G) {
					var d = G.Characteristics.results;
					if (d) {
						for (var i = 0; i < d.length; i++) {
							b.push(d[i]);
							for (var n = 0; n < d[i].DomainValues.results.length; n++) {
								A.push(d[i].DomainValues.results[n]);
							}
						}
					}
				});
				if (b.length > 1) {
					this.getMockserver().setEntitySetData("CharacteristicSet", b);
				}
				if (A.length > 1) {
					this.getMockserver().setEntitySetData("CharacteristicValueSet", A);
				}
			}
		},
		afterGetInstanceSet: function (e) {
			var d = e.getParameter("oFilteredData") || e.getParameter("oEntry");
			var g = d.results;
			if (g && g.length > 0 && g[0].Characteristics && g[0].Characteristics.results) {
				this._changeGroupsBeforeDisplay.call(this, g, e);
				this._oMockdata.setCharacteristicGroupSet(g);
			}
		},
		beforeGetCharacteristicGroups: function (e) {
			if (!e.getParameter("sUrlParams")) {
				var x = e.getParameter("oXhr");
				var r = JSON.stringify({
					d: {
						results: 100
					}
				});
				x.responseText = r;
			}
			if (this._bCharacteristicValueChanged) {
				var g = this._oMockdata.getCharacteristicGroupSet(),
					A = [],
					b = [];
				g.forEach(function (G) {
					var d = G.Characteristics.results;
					if (!d) {
						return;
					}
					if (!d[0].DomainValues.results) {
						return;
					}
					for (var i = 0; i < d.length; i++) {
						b.push(d[i]);
						for (var n = 0; n < d[i].DomainValues.results.length; n++) {
							A.push(d[i].DomainValues.results[n]);
						}
					}
				});
				if (b.length > 1) {
					this.getMockserver().setEntitySetData("CharacteristicSet", b);
				}
				if (A.length > 1) {
					this.getMockserver().setEntitySetData("CharacteristicValueSet", A);
				}
			}
		},
		afterGetCharacteristicGroups: function (e) {
			var f = e.getParameter("oFilteredData");
			var g, G = {};
			G = {
				Characteristics: {
					results: f.results
				},
				CsticCount: f.results.length
			};
			g = [G];
			if (!g[0].Characteristics.results) {
				return;
			}
			if (g[0].Characteristics.results.length === 0) {
				return;
			}
			this._changeGroupsBeforeDisplay.call(this, g, e);
			var i = G.Characteristics.results[0].GroupId - 1;
			this._oMockdata.setProperty("/CharacteristicGroups/" + i + "/Characteristics", G.Characteristics);
		},
		afterGetClassificationContext: function (e) {
			if (e.getParameter("oXhr").url.indexOf("Assignable") !== -1) {
				var v = e.getParameter("oFilteredData").results;
				var r = [];
				v.forEach(function (o) {
					if (o.ClassType !== o.InstanceId) {
						r.push(o);
					}
				});
				e.getParameter("oFilteredData").results = r;
			}
		},
		afterGetRoutingSet: function (e) {
			var f = e.getParameter("oFilteredData");
			var r = $.grep(f.results, function (E) {
				return E.NodeId === "0_0";
			}).length;
			if (r !== 1) {
				f.results = [];
			}
		},
		afterGetTraceEntrySet: function (e) {
			var t = e.getParameter("oEntry");
			var i, j, o;
			if (!t) {
				return;
			}
			if (!t.to_VariantTables.results) {
				t.to_VariantTables.results = [];
			}
			if ($.isEmptyObject(t.to_TracePricingFactor)) {
				t.to_TracePricingFactor = null;
			}
			if ($.isEmptyObject(t.to_TraceBAdI)) {
				t.to_TraceBAdI = null;
			}
			for (i = t.to_TraceBeforeCharacteristics.results.length - 1; i >= 0; i--) {
				o = t.to_TraceBeforeCharacteristics.results[i];
				if (t.to_TraceBeforeCharacteristics.results[i].IOType.indexOf("B") === -1) {
					t.to_TraceBeforeCharacteristics.results.splice(i, 1);
				} else {
					for (j = o.to_TraceCharacteristicValues.results.length - 1; j >= 0; j--) {
						if (o.to_TraceCharacteristicValues.results[j].IOType.indexOf("B") === -1) {
							o.to_TraceCharacteristicValues.results.splice(j, 1);
						}
					}
				}
			}
			for (i = t.to_TraceResultCharacteristics.results.length - 1; i >= 0; i--) {
				o = t.to_TraceResultCharacteristics.results[i];
				if (t.to_TraceResultCharacteristics.results[i].IOType.indexOf("R") === -1) {
					t.to_TraceResultCharacteristics.results.splice(i, 1);
				} else {
					for (j = o.to_TraceCharacteristicValues.results.length - 1; j >= 0; j--) {
						if (o.to_TraceCharacteristicValues.results[j].IOType.indexOf("R") === -1) {
							o.to_TraceCharacteristicValues.results.splice(j, 1);
						}
					}
				}
			}
			for (i = t.to_InputTraceObjectDependencies.results.length - 1; i >= 0; i--) {
				if (t.to_InputTraceObjectDependencies.results[i].IOType.indexOf("I") === -1) {
					t.to_InputTraceObjectDependencies.results.splice(i, 1);
				}
			}
			for (i = t.to_ResultDependencyResults.results.length - 1; i >= 0; i--) {
				if (t.to_ResultDependencyResults.results[i].IOType.indexOf("R") === -1) {
					t.to_ResultDependencyResults.results.splice(i, 1);
				}
			}
			for (i = t.to_BeforeDependencyResults.results.length - 1; i >= 0; i--) {
				if (t.to_BeforeDependencyResults.results[i].IOType.indexOf("B") === -1) {
					t.to_BeforeDependencyResults.results.splice(i, 1);
				}
			}
			for (i = t.to_ResultCharacteristicResults.results.length - 1; i >= 0; i--) {
				if (t.to_ResultCharacteristicResults.results[i].IOType.indexOf("R") === -1) {
					t.to_ResultCharacteristicResults.results.splice(i, 1);
				}
			}
			for (i = t.to_BeforeCharacteristicResults.results.length - 1; i >= 0; i--) {
				if (t.to_BeforeCharacteristicResults.results[i].IOType.indexOf("B") === -1) {
					t.to_BeforeCharacteristicResults.results.splice(i, 1);
				}
			}
		},
		beforeGetInconsistencyInformationSet: function (e) {},
		afterGetInconsistencyInformationSet: function (e) {},
		assignValue: function (o, s) {
			var d = s.Characteristic.DomainValues.results;
			var n = {};
			if (o.StringValue && o.StringValue[0]) {
				for (var i = 0; i < o.StringValue.length; i++) {
					if (this._setDomainValue(d, o.StringValue[i])) {
						continue;
					}
					if (!!s.Characteristic.AdditionalValuesAllowed || (!s.Characteristic.AdditionalValuesAllowed || s.Characteristic.ValueCount === 0)) {
						n = this._createAdditionalValue(o, i);
						d.push(n);
					}
				}
			}
			if (o.TechnicalValue && o.TechnicalValue !== "") {
				for (var x = 0; x < o.TechnicalValue.length; x++) {
					if (o.TechnicalValue[x] !== "") {
						if (this._setDomainValue(d, o.TechnicalValue[x])) {
							continue;
						}
						if (!!s.Characteristic.AdditionalValuesAllowed || (!s.Characteristic.AdditionalValuesAllowed || s.Characteristic.ValueCount ===
								0)) {
							n = this._createAdditionalValueFromTechValue(o, x);
							d.push(n);
						}
					}
				}
			}
			if (!o.TechnicalValue[0]) {
				this._assignDefaultValue(d);
			}
		},
		updateCsticValue: function (f, b, x, u) {
			if (x.readyState === 4) {
				return;
			}
			var k = this._getKeyMap(u);
			var s = this._getSelectedCharacteristic(k);
			if (!s.hasOwnProperty("Characteristic")) {
				x.respondJSON(200, {}, this._emptyResponse);
				return;
			}
			var d = s.Characteristic.DomainValues.results;
			var i = s.Characteristic.IsSingleValued;
			f.call(this, k, s);
			this._resetDefaultValues(d);
			if (b) {
				s.Characteristic.HasDefaultValues = false;
				b.call(this, k, s);
			}
			this._restoreDefaultValues(d, i);
			this._configurationStatusHandling(k);
			this._inconsistencyInformationHandling(k);
			this._updateCsticData(s);
			this._handlePricing(k);
			this._handleStatus(k, s);
			this._bCharacteristicValueChanged = true;
			x.respondJSON(200, {}, this._emptyResponse);
		},
		unassignValue: function (o, s) {
			if (s.Characteristic.IsSingleValued) {
				this._unassignSingleValuedCstic(s);
			} else {
				if (o.TechnicalValue.length >= 1 && o.TechnicalValue[0]) {
					if (s.Characteristic.AdditionalValuesAllowed) {
						this._unassignAllValuesConsideringAdditional(s, o);
						return;
					}
					this.unassignAllValues(o, s);
				} else if (!o.TechnicalValue[0] && !o.ValueId[0]) {
					this.unassignAllValues(o, s);
				}
			}
		},
		discardConfigurationDraft: function (x) {
			if (x.readyState === 4) {
				return;
			}
			this.getLocalMockserver().restart();
			x.respondJSON(200, {}, this._emptyResponse);
		},
		lockConfiguration: function (x) {
			this._lockHandling(x, "Locked", "2");
		},
		unlockConfiguration: function (x) {
			this._lockHandling(x, "Released", "1");
		},
		calculatePricing: function (x) {
			if (x.readyState === 4) {
				return;
			}
			if (!this._bInitialCall) {
				this._oMockdata.setProperty("/NetValue", "200");
			}
			this._bInitialCall = false;
			x.respondJSON(200, {}, this._emptyResponse);
		},
		switchToETO: function (x) {
			if (x.readyState === 4) {
				return;
			}
			if (!this._bInitialCall) {
				this._oMockdata.setProperty("/NewETOStatus", C.ETO_STATUS.PROCESSING_STARTED);
				this._oMockdata.setProperty("/NewETOStatusDescription", "ETO Started");
			}
			this._bInitialCall = false;
			x.respondJSON(200, {}, this._emptyResponse);
		},
		setETOStatus: function (x) {
			if (x.readyState === 4) {
				return;
			}
			var s = x.url.substring(x.url.indexOf("&Status="));
			var S = s.substring(s.length - 6, s.length - 1);
			this._oMockdata.setProperty("/NewETOStatus", S);
			switch (S) {
			case C.ETO_STATUS.READY_FOR_ENGINEERING:
				this._oMockdata.setProperty("/NewETOStatusDescription", "Ready for Engineering");
				break;
			case C.ETO_STATUS.REENGINEERING_NEEDED:
				this._oMockdata.setProperty("/NewETOStatusDescription", "Reengineering needed");
				break;
			case C.ETO_STATUS.REVISED_BY_SALES:
				this._oMockdata.setProperty("/NewETOStatusDescription", "Revised by Sales");
				break;
			case C.ETO_STATUS.PROCESSING_FINISHED:
				this._oMockdata.setProperty("/NewETOStatusDescription", "ETO finished");
				break;
			case C.ETO_STATUS.REVIEW_FINISHED_BY_SALES:
				this._oMockdata.setProperty("/NewETOStatusDescription", "Review done by Sales");
				break;
			default:
				this._oMockdata.setProperty("/NewETOStatusDescription", "Ready for Engineering");
				break;
			}
			sap.m.MessageToast.show("New ETO Status Set Successfully");
			x.respondJSON(200, {}, this._emptyResponse);
		},
		getTraceEntryDetail: function (x) {
			var u = decodeURI(x.url);
			var n = "to_TraceEntry";
			var e = "TraceEntrySet";
			var s = u.slice(0, u.indexOf("ConfigurationContextSet"));
			var U = u.slice(u.indexOf(n) + n.length);
			x.url = s + e + U;
			this.getMockserver().fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.GET + e, {
				oXhr: x
			});
		},
		getTraceEntriesForCharacteristic: function (x) {
			var u = decodeURI(x.url);
			var n = "to_TraceCharacteristic";
			var N = "to_TraceEntry";
			var e = "TraceEntrySet";
			var s = u.slice(0, u.indexOf(n));
			x.url = s + N;
			this.getMockserver().fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.GET + e, {
				oXhr: x
			});
		},
		getTraceCharacteristicVH: function (x) {
			this._handleGenericTraceVH(x, "TraceCharacteristicVHSet", "CsticName", "Description");
		},
		getTraceDependencyVH: function (x) {
			this._handleGenericTraceVH(x, "TraceObjectDependencyVH", "ObjectDependencyName", "Description");
		},
		_handleGenericTraceVH: function (x, e, n, d) {
			var u = decodeURI(x.url);
			var r = /search\=[a-zA-Z0-9]+/g;
			var s = r.exec(u);
			if ($.isArray(s) && s.length > 0) {
				var S = s[0].split("=")[1];
				var b = /\$filter\=/g;
				var f = "$filter=(substringof('" + S + "'," + n + ")' " + "or substringof('" + S + "'," + d + ")')";
				if (b.test(u)) {
					u = u.replace("$filter=", f + " and ");
				} else {
					u += "&" + f;
				}
				x.url = u;
			}
			this.getMockserver().fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.GET + e, {
				oXhr: x
			});
		},
		getBOMNodesStructureTree: function (x) {
			var u = decodeURI(x.url);
			var n = "BOMNodes";
			var e = u.slice(0, u.indexOf(n) + n.length);
			var U = u.slice(u.indexOf(n) + n.length);
			U = U.replace(" and ParentComponentId eq '0'", "");
			U = U.replace("ParentComponentId eq '0' and ", "");
			U = U.replace("ParentComponentId eq '0'", "");
			U += " and ConfiguredComponentId eq ''";
			x.url = e + U;
			this.getMockserver().fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.GET + e, {
				oXhr: x,
				sUrlParameters: U
			});
		},
		getBOMNodes: function (x) {
			var u = x.url;
			if ((u.includes("/to_Routings") && u.includes("/to_RoutingNodes")) || u.includes("/to_RoutingNodes")) {
				this.getRoutingNodes(x, "RoutingNodeSet", "to_RoutingNodes");
			} else {
				var e = "BOMNodeSet";
				var n = "BOMNodes";
				var s = u.slice(0, u.indexOf("ConfigurationContextSet"));
				var U = u.slice(u.indexOf(n) + n.length);
				x.url = s + e + U;
				this.getMockserver().fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.GET + e, {
					oXhr: x,
					sUrlParameters: U
				});
			}
		},
		getRoutingNodes: function (x, e, n) {
			var u = x.url;
			var s = u.slice(0, u.indexOf("ConfigurationContextSet"));
			var U = u.slice(u.indexOf(n) + n.length);
			var r = /BOMNodes\('\d+-\d+-\d+'\)\/to_RoutingNodes/;
			var b = /to_RoutingNodes\(.*\)*/;
			var d = /to_Routings(.*)\/to_RoutingNodes/;
			var E;
			if (r.test(u)) {
				E = r.exec(u)[0].replace("BOMNodes", "BOMNodeSet");
			} else if (b.test(u)) {
				E = b.exec(u)[0].replace(b, "RoutingNodeSet");
			} else if (d.test(u)) {
				E = d.exec(u)[0].replace("to_Routings", "RoutingSet");
			} else {
				E = e;
			}
			var f = "";
			var g = /\?\$filter\=/;
			var h = /BillOfOperationsSequence\%20eq/;
			var i = /\((.*)\)/;
			if (h.test(U)) {
				U = U.replace(h, "TreeId%20eq");
			} else if (g.test(U)) {
				f = " and TreeId eq '0'";
			} else if (!i.test(U)) {
				f = "?$filter=TreeId eq '0'";
			}
			x.url = s + E + U + f;
			this.getMockserver().fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.GET + e, {
				oXhr: x,
				sUrlParameters: U
			});
		},
		getOperationStandardValues: function (x) {
			var r = /TreeId='(\d+)'/;
			var b = /NodeId='(\d+_\d+)'/;
			var t = "";
			var n = "";
			var u = x.url;
			var s;
			if (u.includes("ConfigurationContextSet") && u.includes("/to_Routings") && u.includes("/to_RoutingNodes")) {
				s = u.slice(0, u.indexOf("ConfigurationContextSet"));
			} else {
				s = u.slice(0, u.indexOf("RoutingNodeSet"));
			}
			var e = "StandardValueSet";
			var R = this.getMockserver().getEntitySetData("RoutingNodeSet");
			if (r.test(u)) {
				t = r.exec(u)[1];
			}
			if (b.test(u)) {
				n = b.exec(u)[1];
			}
			var o = R.find(function (E) {
				return E.NodeId === n && E.TreeId === t;
			});
			var f = "";
			if (o) {
				f = "?$filter=BillOfOperationsNode eq '" + o.BillOfOperationsNode + "'&" + "BillOfOperationsGroup eq '" + o.BillOfOperationsGroup +
					"'&" + "BillOfOperationsOperation eq '" + o.BillOfOperationsOperation + "'&" + "BillOfOperationsSequence eq '" + o.BillOfOperationsSequence +
					"'&" + "BillOfOperationsType eq '" + o.BillOfOperationsType + "'&" + "BillOfOperationsVariant eq '" + o.BillOfOperationsVariant +
					"'";
			}
			x.url = s + e + f;
			this.getMockserver().fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.GET + e, {
				oXhr: x
			});
		},
		getOperationPRT: function (x) {
			var u = x.url;
			var s;
			if (u.includes("ConfigurationContextSet") && u.includes("/to_Routings") && u.includes("/to_RoutingNodes")) {
				s = u.slice(0, u.indexOf("ConfigurationContextSet"));
			} else {
				s = u.slice(0, u.indexOf("RoutingNodeSet"));
			}
			var e = "OperationPRTSet";
			var U = u.slice(u.indexOf("to_OperationPRT") + 15);
			x.url = s + e + U;
			this.getMockserver().fireEvent(sap.ui.core.util.MockServer.HTTPMETHOD.GET + e, {
				oXhr: x,
				sUrlParameters: U
			});
		},
		handleClassificationInstanceChange: function (x, u) {
			var A = this.getMockserver().getEntitySetData("ClassificationInstanceSet");
			this._moveInstance(u, A, this._assignableClasses);
			this._oMockServer.setEntitySetData("ClassificationInstanceSet", A);
			x.respondJSON(200, {}, this._emptyResponse);
		},
		unassignClass: function (x, u) {
			var A = this.getMockserver().getEntitySetData("ClassificationInstanceSet");
			var I = u.indexOf("InstanceId") + 12;
			var b = u.substring(I, I + 4);
			var s = "";
			for (var i = 0; i < A.length; i++) {
				var o = A[i];
				if (o.InstanceId.toString() === b) {
					s = o.ClassType;
					A.splice(i, 1);
					break;
				}
			}
			var d = 0;
			for (i = 0; i < A.length; i++) {
				o = A[i];
				if (o.ClassType === s) {
					d++;
				}
			}
			if (!d) {
				A.push({
					ClassType: s,
					IsVisible: false
				});
			}
			this.getMockserver().setEntitySetData("ClassificationInstanceSet", A);
			var D = {
				d: {
					results: []
				}
			};
			x.respondJSON(200, {}, JSON.stringify(D));
		},
		explodeBOM: function (x) {
			if (x.readyState === 4) {
				return;
			}
			x.respondJSON(200, {}, this._emptyResponse);
		},
		explodeRouting: function (x) {
			if (x.readyState === 4) {
				return;
			}
			x.respondJSON(200, {}, this._emptyResponse);
		},
		activateTrace: function (x) {
			if (x.readyState === 4) {
				return;
			}
			x.respondJSON(200, {}, this._emptyResponse);
		},
		deactivateTrace: function (x) {
			if (x.readyState === 4) {
				return;
			}
			x.respondJSON(200, {}, this._emptyResponse);
		},
		isTraceActive: function (x) {
			if (x.readyState === 4) {
				return;
			}
			x.respondJSON(200, {}, this._emptyResponse);
		},
		clearTrace: function (x) {
			if (x.readyState === 4) {
				return;
			}
			x.respondJSON(200, {}, this._emptyResponse);
		},
		createOrderBOM: function (x) {
			if (x.readyState === 4) {
				return;
			}
			var f = x.url.substr(x.url.indexOf("FixOrderBOMMode"));
			f = f.substr(f.length - 1);
			this._oMockdata.setProperty("/CreateOrderBOM", true);
			this._oMockdata.setProperty("/FixOrderBOMMode", f);
			x.respondJSON(200, {}, this._emptyResponse);
		},
		deleteBOMItem: function (x) {
			if (x.readyState === 4) {
				return;
			}
			this._oMockdata.setProperty("/DeleteBOMItem", true);
			x.respondJSON(200, {}, this._emptyResponse);
		},
		calculateAlternativeValues: function (x) {
			if (x.readyState === 4) {
				return;
			}
			x.respondJSON(200, {}, this._emptyResponse);
		},
		setPreferredVariant: function (x) {
			if (x.readyState === 4) {
				return;
			}
			x.respondJSON(200, {}, this._emptyResponse);
		},
		createFullyMatchingProductVariant: function (x) {
			if (x.readyState === 4) {
				return;
			}
			var p = this.getLocalMockserver().getCreateProductVariantWithPricingError();
			var v = JSON.stringify({
				d: {
					CreateFullyMatchingProductVariant: {
						ProductKey: "DUMMY_PRODUCT",
						DraftKey: "DUMMY_DRAFT",
						Cuobj: "12345",
						PricingError: p
					}
				}
			});
			x.respondJSON(200, {}, v);
		},
		validateConfiguration: function (x) {
			if (x.readyState === 4) {
				return;
			}
			x.respondJSON(200, {}, JSON.stringify({
				d: {
					results: {
						ValidateConfiguration: {
							Success: true
						}
					}
				}
			}));
		},
		afterGetVariantValuationDifference: function (e) {
			var r = [];
			var v = [];
			var R = e.getParameter("oFilteredData").results;
			for (var i = 0; i < R.length; i++) {
				r = R[i].VariantValuatDiffCsticRefValues.results;
				for (var j = 0; j < r.length; j++) {
					if (r[j].ValType && r[j].ValType !== "Ref") {
						r.splice(j, 1);
					}
				}
				v = R[i].VariantValuatDiffCsticVarValues.results;
				for (var k = 0; k < v.length; k++) {
					if (v[k].ValType && v[k].ValType !== "Var") {
						v.splice(k, 1);
					}
				}
			}
		},
		afterCreateBOMNodeSet: function (x) {
			this._oMockdata.setProperty("/InsertBOMItem", x.getParameter("oEntity"));
		},
		afterGetToggleSet: function (x) {
			var A = this.getLocalMockserver().getActiveToggles();
			if (A) {
				$.each(x.getParameter("oFilteredData").results, function (i, r) {
					r.ToggleStatus = A.indexOf(r.ToggleId) === -1 ? "" : "X";
				});
			}
		}
	});
	return m;
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/common/odataFacade/ODataFacadeModel', ["sap/ui/model/Model", "sap/ui/model/Context",
	"sap/ui/base/EventProvider", "sap/ui/model/json/JSONModel", "sap/ui/model/json/JSONPropertyBinding", "sap/ui/model/ClientModel",
	"sap/ui/model/odata/v2/ODataModel", "sap/i2d/lo/lib/zvchclfz/common/util/ErrorDialog"
], function (M, C, E, J, a, b, O, c) {
	"use strict";
	return J.extend("sap.i2d.lo.lib.zvchclfz.common.odataFacade.ODataFacadeModel", {
		constructor: function (m, p, v) {
			this._oOriginModel = m;
			if (m) {
				this._oOriginModel.attachMessageChange(null, this._onMessageChangeInOriginModel, this);
			}
			this._oErrorDialog = new c();
			this._fnViewProvider = v;
			M.prototype.constructor.apply(this);
			this._oInitMetadataPromise = this._initMetaModel(p);
			this._generateEventMethods();
			this._setupEvents();
		},
		_getPropagatedEventIds: function () {
			return [];
		},
		_setupEvents: function () {},
		_initMetaModel: function (p) {
			return Promise.resolve();
		},
		_getVersion: function () {
			throw Error("This abstract method has not yet been implemented in the child object.");
		},
		_getNavigationPropertyValue: function (d, n, m) {
			throw Error("This abstract method has not yet been implemented in the child object.");
		},
		_determineSetNameOfNavigationProperty: function (s, n) {
			throw Error("This abstract method has not yet been implemented in the child object.");
		},
		_determineMultiplicityOfNavigationProperty: function (s, n) {
			throw Error("This abstract method has not yet been implemented in the child object.");
		},
		_determineNavPropsMap: function (d) {
			throw Error("This abstract method has not yet been implemented in the child object.");
		},
		facadeRemove: function (k, u, o, s, e, g, r, S) {
			throw Error("This abstract method has not yet been implemented in the child object.");
		},
		facadeRead: function (k, u, o, f, s, e, g, S) {
			throw Error("This abstract method has not yet been implemented in the child object.");
		},
		facadeUpdate: function (k, d, u, o, s, e, g, f, h, i, r, S) {
			throw Error("This abstract method has not yet been implemented in the child object.");
		},
		facadeCallFunction: function (f, u, d, g, h) {
			throw Error("This abstract method has not yet been implemented in the child object.");
		},
		facadeCreate: function (k, m) {
			throw Error("This abstract method has not yet been implemented in the child object.");
		},
		createKey: function (s, k) {
			throw Error("This abstract method has not yet been implemented in the child object.");
		},
		getKey: function (v) {
			throw Error("This abstract method has not yet been implemented in the child object.");
		},
		setDeferredGroup: function (g) {
			throw Error("This abstract method has not yet been implemented in the child object.");
		},
		submitBatch: function (g) {
			throw Error("This abstract method has not yet been implemented in the child object.");
		},
		getMessagesByEntity: function (e, d) {
			return O.prototype.getMessagesByEntity.apply(this, [e, d]);
		},
		getNavigationProperties: function (d) {
			return this._determineNavPropsMap(d);
		},
		metadataLoaded: function () {
			return this._oInitMetadataPromise;
		},
		removeContextAndRelatedData: function (o) {
			var s = o.getPath();
			if (this.mContexts[s]) {
				delete this.mContexts[s];
				this._removeData(s);
			}
		},
		createBindingContextForOriginModel: function (o) {
			return new C(this.getOriginModel(), o.getPath());
		},
		facadeReadSpecific: function (r) {
			return this._executeForSpecificVersion(this.facadeRead, "facadeRead", r);
		},
		facadeCallFunctionSpecific: function (m) {
			return this._executeForSpecificVersion(this.facadeCallFunction, "facadeCallFunction", m);
		},
		facadeCreateSpecific: function (m) {
			return this._executeForSpecificVersion(this.facadeCreate, "facadeCreate", m);
		},
		storePreloadedData: function (d, p, o) {
			var P = this._determinePathInfo(p, o);
			this._store({
				root: d
			}, P);
		},
		displayErrorMessages: function (m, f) {
			this._oErrorDialog.displayErrorMessages(this._fnViewProvider.apply(this), m, f);
		},
		createBindingContext: function (p, o, P, f, r, F) {
			var d = function (n) {
				var e = this.getProperty(n.getPath());
				if (e === undefined && F) {
					this.facadeRead(n.getPath(), undefined, undefined, undefined, undefined, undefined, undefined, true).then(function (D) {
						if (f) {
							f(n);
						}
					});
				} else if (f && $.isFunction(f)) {
					f(n);
				}
			}.bind(this);
			return b.prototype.createBindingContext.apply(this, [p, o, P, d]);
		},
		_getObject: function (p, o, e, A) {
			if (p !== undefined && p.charAt(0) !== "/" && o === undefined) {
				return undefined;
			} else {
				var P = this._resolveToModelPath(p, o);
				var r;
				if (P.mustExpand || e) {
					r = this._expandData(P.contextPath, e === "*" ? undefined : e);
					r = this._getFromExpandedData(r, P);
					if (e === undefined) {
						if (r && r.results) {
							var d = [];
							for (var i = 0; i < r.results.length; i++) {
								d.push(this.getKey(r.results[i]));
							}
							r = d;
						}
					}
				} else {
					var D = J.prototype._getObject.apply(this, [P.fullPath]);
					if (typeof D === "object") {
						if (A) {
							if (D instanceof Date) {
								var t = D.valueOf();
								r = new Date(t);
							} else {
								r = $.extend(true, {}, D);
							}
						} else {
							r = D;
						}
					} else {
						r = D;
					}
				}
				if (r !== undefined) {
					if (r.__list !== undefined) {
						r = r.__list;
					} else if (r.__ref !== undefined) {
						r = r.__ref;
					} else if (r.__deferred !== undefined) {
						r = undefined;
					}
				}
				return r;
			}
		},
		getObject: function (p, o, P) {
			if (P && P.select) {
				throw Error("getObject with mParameters.select is not supported.");
			}
			return this._getObject(p, o, P !== undefined ? P.expand : undefined, true);
		},
		getProperty: function (p, o, i) {
			return this._getObject(p, o, i ? "*" : undefined, true);
		},
		setProperty: function (p, v, o, A) {
			throw Error("The ODataFacadeModel does not support to set a property.");
		},
		attachEvent: function (e, d, f, l) {
			var p = this._getPropagatedEventIds();
			if (p.indexOf(e) > -1) {
				var m = this._getEventMethodName("attach", e);
				this.getOriginModel()[m].apply(this.getOriginModel(), [d, f, l]);
			} else {
				E.prototype.attachEvent.apply(this, [e, d, f, l]);
			}
		},
		detachEvent: function (e, f, l) {
			var p = this._getPropagatedEventIds();
			if (p.indexOf(e) > -1) {
				var m = this._getEventMethodName("detach", e);
				this.getOriginModel()[m].apply(this.getOriginModel(), [f, l]);
			} else {
				E.prototype.detachEvent.apply(this, [e, f, l]);
			}
		},
		_determinePathInfo: function (k, o) {
			var r = this._resolveRoot(k, o);
			if (r.key) {
				if (r.relParts.length > 0) {
					r.navProperty = r.relParts[0];
					r.fullPath += "/" + r.relParts[0];
					r.multiplicity = this._determineMultiplicityOfNavigationProperty(r.setName, r.relParts[0]);
				} else {
					r.multiplicity = "1";
				}
			} else {
				r.multiplicity = "*";
			}
			return r;
		},
		_store: function (d, p, s) {
			var o = $.extend(true, {}, d);
			var e = {};
			var k;
			this._determineExpandLists(e, o, "root", p.multiplicity);
			this._setBindingsActive(false);
			var D = J.prototype.getData.apply(this);
			var n;
			var f;
			var N;
			for (k in e) {
				n = this._determineNavPropsMap(e[k]);
				for (var g in n) {
					if (D[k]) {
						f = D[k][g];
						if (f && !f.__deferred) {
							N = e[k][g];
							if (N && N.__deferred) {
								e[k][g] = f;
							}
						}
					}
				}
				if (!s) {
					J.prototype.setProperty.apply(this, ["/" + k, e[k]]);
				} else {
					D[k] = e[k];
				}
			}
			this._replaceDeferred(p, e);
			this._setBindingsActive(true);
			return e;
		},
		_onMessageChangeInOriginModel: function (e) {
			this.mMessages = this._oOriginModel.mMessages;
			this.fireMessageChange(e);
		},
		_determineExpandLists: function (l, d, n, m) {
			var r;
			var e;
			var p;
			var N;
			var P = function (D) {
				var A = this.getKey(D);
				if (A) {
					l[A] = D;
				}
				return A;
			}.bind(this);
			var v = this._getNavigationPropertyValue(d, n, m);
			if (v) {
				if (v instanceof Array) {
					if (v.length > 0) {
						N = this._determineNavPropsMap(v[0]);
					}
					r = [];
					d[n] = {
						__list: r
					};
					for (var i = 0; i < v.length; i++) {
						e = P.apply(this, [v[i]]);
						r.push(e);
						for (p in N) {
							this._determineExpandLists(l, v[i], p, N[p]);
						}
					}
				} else {
					e = P.apply(this, [v]);
					if (e) {
						d[n] = {
							__ref: e
						};
						N = this._determineNavPropsMap(v);
						for (p in N) {
							this._determineExpandLists(l, v, p, N[p]);
						}
					}
				}
			}
		},
		_replaceDeferred: function (p, e) {
			if (p.navProperty !== undefined) {
				var f = this._filterEntitySetEntries(e, p.setName, p.navProperty);
				var o = J.prototype.getProperty.apply(this, [p.contextPath]);
				var r;
				if (o === undefined) {
					var B = {};
					B[p.navProperty] = {
						__deferred: "unknown"
					};
					J.prototype.setProperty.apply(this, [p.contextPath, B]);
				}
				if (p.multiplicity === "1") {
					r = {
						__ref: f[0]
					};
				} else {
					r = {
						__list: f
					};
				}
				J.prototype.setProperty.apply(this, [p.fullPath, r]);
			}
		},
		_createPath: function (k, o) {
			var p;
			if (o !== undefined && o !== null) {
				p = typeof o === "string" ? o : o.getPath();
				if (p.charAt(0) !== "/") {
					p = "/" + p;
				}
				if (k) {
					p += "/" + k;
				}
			} else {
				p = k;
			}
			return p.split("/");
		},
		_resolveRoot: function (k, o) {
			var s;
			var K;
			var f;
			var p;
			var P = this._createPath(k, o);
			if (P.length === 1) {
				p = P[0];
				P.splice(0, 1);
			} else if (P[1].charAt(P[1].length - 1) === ")") {
				K = P[1].substring(P[1].indexOf("(") + 1, P[1].length - 1);
				s = P[1].substring(0, P[1].indexOf("("));
				f = "/" + s + (K !== undefined ? "(" + K + ")" : "");
				P.splice(0, 2);
			} else {
				K = undefined;
				s = P[1];
				f = "/" + s;
				P.splice(0, 2);
			}
			return {
				setName: s,
				key: K,
				contextPath: s !== undefined ? "/" + s + (K !== undefined ? "(" + K + ")" : "") : undefined,
				fullPath: f,
				property: p,
				relParts: P
			};
		},
		_resolveNavigationPath: function (p, f, S) {
			var P = p[0];
			var d = 0;
			var m;
			var o;
			var e = [];
			var g = function (j, k, l) {
				return {
					prop: j,
					isNavigation: k !== undefined,
					multiplicity: k,
					elementIndex: l,
					toString: function () {
						var s = "/" + this.prop;
						if (this.multiplicity === "*" && this.elementIndex) {
							s += "/results";
						}
						if (this.elementIndex) {
							s += "/" + this.elementIndex;
						}
						return s;
					}
				};
			};
			var h = S;
			while (P !== undefined) {
				m = this._determineMultiplicityOfNavigationProperty(h, P);
				if (m !== undefined) {
					if (m === "1") {
						o = g.apply(this, [P, m]);
					} else {
						d++;
						o = g.apply(this, [P, m, p[d]]);
					}
					h = this._determineSetNameOfNavigationProperty(h, P);
				} else {
					o = g.apply(this, [P]);
				}
				e.push(o);
				d++;
				P = p[d];
			}
			var r = {
				pathElements: e,
				mustExpand: false,
				fullPath: f
			};
			for (var i = 0; i < e.length; i++) {
				r.fullPath += e[i].toString();
				if (e[i].elementIndex) {
					r.mustExpand = true;
				}
			}
			if (e.length > 0) {
				if (e[e.length - 1].multiplicity === "1") {
					r.mustExpand = true;
				}
			}
			return r;
		},
		_resolveToModelPath: function (k, o) {
			var p, r = this._resolveRoot(k, o);
			if (r.property) {
				return {
					pathElements: [],
					mustExpand: false,
					fullPath: r.property
				};
			} else if (r.key) {
				p = this._resolveNavigationPath(r.relParts, r.fullPath, r.setName);
				p.contextPath = r.contextPath;
				return p;
			} else if (r.relParts.length === 0) {
				return {
					pathElements: [],
					mustExpand: false,
					fullPath: r.fullPath,
					contextPath: r.contextPath
				};
			} else {
				throw Error("Unsupported model path '" + r.fullPath + "/" + r.relParts.join("/"));
			}
		},
		getOriginModel: function () {
			return this._oOriginModel;
		},
		_setBindingsActive: function (A) {
			var B = this.getBindings();
			var o = a.prototype.checkUpdate;
			a.prototype.checkUpdate = function () {
				o.apply(this);
			};
			for (var i = 0; i < B.length; i++) {
				if (A) {
					B[i].resume();
				} else {
					B[i].suspend();
				}
			}
			a.prototype.checkUpdate = o;
		},
		_expandData: function (p, n) {
			var l = n ? n.split(",") : [];
			var o = J.prototype._getObject.apply(this, [p]);
			var d = $.extend(true, {}, o);
			var e, f;
			for (var P in d) {
				if (d[P] !== undefined && d[P] !== null && (n === undefined || $.inArray(P, l))) {
					if (d[P].__list !== undefined) {
						e = [];
						for (var i = 0; i < d[P].__list.length; i++) {
							e.push(this._expandData("/" + d[P].__list[i], n));
						}
						d[P] = {
							results: e
						};
					} else if (d[P].__ref !== undefined) {
						f = this._expandData("/" + d[P].__ref, n);
						d[P] = f;
					}
				}
			}
			return d;
		},
		_removeData: function (p) {
			var o = J.prototype._getObject.apply(this, [p]);
			for (var P in o) {
				if (o[P] !== undefined && o[P] !== null) {
					if (o[P].__list !== undefined) {
						for (var i = 0; i < o[P].__list.length; i++) {
							this._removeData("/" + o[P].__list[i]);
						}
					} else if (o[P].__ref !== undefined) {
						this._removeData("/" + o[P].__ref);
					}
				}
			}
			delete this.oData[p.substr(1)];
		},
		_getFromExpandedData: function (d, p) {
			if (p.contextPath === p.fullPath) {
				return d;
			} else {
				var n = p.fullPath.substr(p.contextPath.length + 1);
				var P = n.split("/");
				var N = d;
				for (var i = 0; i < P.length; i++) {
					N = N[P[i]];
					if (N === undefined) {
						break;
					}
				}
				return N;
			}
		},
		_filterEntitySetEntries: function (e, s, n) {
			var r = [];
			var N = this._determineSetNameOfNavigationProperty(s, n);
			for (var d in e) {
				if (d.indexOf(N) > -1) {
					r.push(d);
				}
			}
			return r;
		},
		_generateEventMethods: function () {
			var p = this._getPropagatedEventIds();
			var P;
			for (var i = 0; i < p.length; i++) {
				P = p[i];
				this._generateEventMethod(P);
			}
		},
		_generateEventMethod: function (e) {
			var A = function (e, D, F, l) {
				this.attachEvent(e, D, F, l);
			};
			var d = function (e, F, l) {
				this.detachEvent(e, F, l);
			};
			var f = function (e, p) {
				this.fireEvent(e, p);
			};
			var m;
			m = this._getEventMethodName("attach", e);
			if (this[m] === undefined) {
				this[m] = A.bind(this, e);
			}
			m = this._getEventMethodName("detach", e);
			if (this[m] === undefined) {
				this[m] = d.bind(this, e);
			}
			m = this._getEventMethodName("fire", e);
			if (this[m] === undefined) {
				this[m] = f.bind(this);
			}
		},
		_getEventMethodName: function (A, e) {
			return A + e.charAt(0).toUpperCase() + e.substr(1);
		},
		_executeForSpecificVersion: function (e, s, p) {
			var v = this._getVersion();
			var P = p[v];
			var o;
			if (P instanceof Array) {
				o = e.apply(this, P);
			} else {
				throw Error("Parameters for '" + s + "' version '" + v + "' must be provided as array.");
			}
			var r = {
				version: v,
				promise: o,
				caseV2: function (t) {
					if (r.version === "2") {
						r.promise.then(t);
					}
					return r;
				},
				caseV4: function (t) {
					if (r.version === "4") {
						r.oPromise.then(t);
					}
					return r;
				},
				caseCatch: function (f) {
					r.oPromise.catch(f);
					return r;
				}
			};
			return r;
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/common/odataFacade/ODataV2ErrorHelper', [], function () {
	"use strict";
	var O = {
		_requestIsFromConfiguration: function (r) {
			var u = r.url;
			return !!u && u.indexOf("VCH(12)SEMANTIC_OBJ") >= 0 && u.indexOf("(14)EMBEDDING_MODE") > 0;
		},
		batchHasErrorMessages: function (r, b) {
			return this.getBatchErrorMessages(r, b).length > 0;
		},
		getBatchErrorMessages: function (r, b) {
			if (b && this._batchHasRelevantMessage(b)) {
				return [this._getErrorMessageFromResponse(b)];
			}
			var m = [];
			if (r) {
				var f = r.filter(this._requestIsFromConfiguration);
				f.forEach(function (R) {
					if (this._requestHasRelevantMessage(R)) {
						m.push(this._getErrorMessageFromResponse(R.response));
					}
				}.bind(this));
			}
			return m;
		},
		_batchHasRelevantMessage: function (b) {
			return b && b.statusCode >= 400;
		},
		_requestHasRelevantMessage: function (r) {
			return r && r.response && r.response.statusCode >= 400;
		},
		_getErrorMessageFromResponse: function (r) {
			var e = {
				statusCode: r.statusCode,
				message: r.message
			};
			if (r.responseText) {
				if (r.responseText.substring(0, 1) === "{") {
					var a = JSON.parse(r.responseText);
					if (a.error && a.error.innererror) {
						e.internalMessage = a.error.message.value;
						e.internalMessageCode = a.error.code;
						if (a.error.innererror.application) {
							e.serviceId = a.error.innererror.application.service_id;
						}
					}
				} else if (r.responseText.substring(0, 5) === "<?xml") {
					var x = new DOMParser();
					var b = x.parseFromString(r.responseText, "text/xml");
					var m = b.getElementsByTagName("message");
					var s = b.getElementsByTagName("service_id");
					var c = b.getElementsByTagName("code");
					if (m.length > 0 && c.length > 0 && s.length > 0) {
						e.internalMessage = m[0].childNodes[0].textContent;
						e.internalMessageCode = c[0].childNodes[0].textContent;
						e.serviceId = s[0].childNodes[0].textContent;
					}
				}
			}
			return e;
		}
	};
	return O;
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/common/odataFacade/ODataV2FacadeModel', [
	"sap/i2d/lo/lib/zvchclfz/common/odataFacade/ODataFacadeModel", "sap/i2d/lo/lib/zvchclfz/common/odataFacade/ODataV2ErrorHelper"
], function (O, a) {
	"use strict";
	return O.extend("sap.i2d.lo.lib.zvchclfz.common.odataFacade.ODataV2FacadeModel", {
		_getVersion: function () {
			return "2";
		},
		_getPropagatedEventIds: function () {
			return ["requestCompleted", "requestSent", "batchRequestSent", "batchRequestCompleted", "metadataLoaded"];
		},
		_setupEvents: function () {
			this.attachBatchRequestCompleted(function (e) {
				var r = e.getParameters().requests;
				var b = e.getParameters().response;
				if (a.batchHasErrorMessages(r, b)) {
					var n = a.getBatchErrorMessages(r, b);
					this.displayErrorMessages(n);
				}
			}.bind(this));
		},
		_initMetaModel: function () {
			var p = [];
			p.push(this.getOriginModel().metadataLoaded());
			p.push(this.getOriginModel().getMetaModel().loaded());
			return Promise.all(p);
		},
		_determineSetNameOfNavigationProperty: function (s, n) {
			var e = this._getEntityTypeDefinition(s);
			var N = this.getOriginModel().getMetaModel().getODataAssociationSetEnd(e, n);
			return N && N.entitySet;
		},
		_determineMultiplicityOfNavigationProperty: function (s, n) {
			var e = this._getEntityTypeDefinition(s);
			var A = this.getOriginModel().getMetaModel().getODataAssociationEnd(e, n);
			return A && this._convertMultiplicity(A.multiplicity);
		},
		_determineNavPropsMap: function (d) {
			var r = {};
			var e = d.__metadata.type;
			var m = this.getOriginModel().getMetaModel();
			var t = m.getODataEntityType(e);
			var n = t.navigationProperty;
			var A;
			if (n) {
				for (var i = 0; i < n.length; i++) {
					A = m.getODataAssociationEnd(t, n[i].name);
					if (A) {
						r[n[i].name] = this._convertMultiplicity(A.multiplicity);
					}
				}
			}
			return r;
		},
		_getNavigationPropertyValue: function (d, n, m) {
			if (d[n]) {
				if (d[n].__deferred !== undefined) {
					return undefined;
				} else if (m === "1") {
					return d[n];
				} else {
					return d[n].results;
				}
			}
			return undefined;
		},
		facadeRead: function (k, u, c, f, s, e, g, S) {
			return new Promise(function (r, R) {
				this.getOriginModel().read(k, {
					urlParameters: u,
					context: c,
					filters: f,
					groupId: g,
					success: function (d) {
						var p = this._determinePathInfo(k, c);
						this._store({
							root: d
						}, p, S);
						if (s) {
							s(d);
						}
						r(d);
					}.bind(this),
					error: function (E) {
						if (e) {
							e(E);
						}
						R(E);
					}
				});
			}.bind(this));
		},
		facadeUpdate: function (k, d, u, c, s, e, g, r, S) {
			return new Promise(function (R, f) {
				this.getOriginModel().update(k, d, {
					urlParameters: u,
					context: c,
					refreshAfterChange: !!r,
					groupId: g,
					success: function (d) {
						var p = this._determinePathInfo(k, c);
						this._store({
							root: d
						}, p, S);
						if (s) {
							s(d);
						}
						R(d);
					}.bind(this),
					error: function (E) {
						if (e) {
							e(E);
						}
						f(E);
					}
				});
			}.bind(this));
		},
		facadeCallFunction: function (f, u, c, g, h) {
			return new Promise(function (r, R) {
				this.getOriginModel().callFunction(f, {
					method: h ? h : "POST",
					urlParameters: u,
					success: r,
					error: R,
					changeSetId: c,
					groupId: g
				});
			}.bind(this));
		},
		facadeCreate: function (k, c) {
			return new Promise(function (r, R) {
				this.getOriginModel().create(k, c, {
					success: r,
					error: R
				});
			}.bind(this));
		},
		createKey: function (s, k) {
			return this.getOriginModel().createKey(s, k);
		},
		getKey: function (v) {
			return this.getOriginModel().getKey(v);
		},
		setDeferredGroup: function (g) {
			var d = this.getOriginModel().getDeferredGroups();
			if (!d) {
				d = [];
			}
			d.push(g);
			this.getOriginModel().setDeferredGroups(d);
		},
		submitBatch: function (g) {
			return new Promise(function (r, e) {
				this.getOriginModel().submitChanges({
					groupId: g,
					success: function (d) {
						r(d);
					},
					error: function (E) {
						e(E);
					}
				});
			}.bind(this));
		},
		_getEntityTypeDefinition: function (s) {
			var m = this.getOriginModel().getMetaModel();
			var t = m.getODataEntitySet(s).entityType;
			var e = m.getODataEntityType(t);
			return e;
		},
		_convertMultiplicity: function (m) {
			return m === "0..1" ? "1" : m;
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/common/odataFacade/ODataV4FacadeModel', [
	"sap/i2d/lo/lib/zvchclfz/common/odataFacade/ODataFacadeModel"
], function (O) {
	"use strict";
	return O.extend("sap.i2d.lo.lib.zvchclfz.common.odataFacade.ODataV4FacadeModel", {
		_getVersion: function () {
			return "4";
		},
		_getPropagatedEventIds: function () {
			return [];
		},
		_initMetaModel: function (p) {
			var m = this.getOriginModel().getMetaModel();
			var P = [];
			for (var i = 0; i < p.length; i++) {
				P.push(m.requestObject(p[i]));
			}
			m.requestObject(p[i]);
			return Promise.all(P).then(function () {
				this.fireEvent("metadataLoaded");
			}.bind(this));
		},
		_determineSetNameOfNavigationProperty: function (s, n) {
			var S = this.getOriginModel().getMetaModel().getObject("/" + s + "/");
			if (S[n]) {
				var t = S[n].$Type;
				var a = this._findSetNameOfEntityInContainerMetadata(t);
				if (a !== undefined) {
					return a;
				}
			}
			return undefined;
		},
		_determineMultiplicityOfNavigationProperty: function (s, n) {
			var S = this.getOriginModel().getMetaModel().getObject("/" + s + "/");
			if (S[n]) {
				var N = S[n];
				return N.$isCollection ? "*" : "1";
			}
			return undefined;
		},
		_determineNavPropsMap: function (d) {
			var e = this._getEntitySetName(d);
			var m = this.getOriginModel().getMetaModel();
			var s = m.getObject("/" + e + "/");
			var r = {};
			for (var p in s) {
				if (p.charAt(0) !== "$" && s[p].$kind === "NavigationProperty") {
					r[p] = s[p].$isCollection ? "*" : "1";
				}
			}
			return r;
		},
		_getNavigationPropertyValue: function (o, n, m) {
			return o[n];
		},
		facadeRead: function (k, u, c, f, s, e, g, S) {
			if (!u) {
				u = {};
			}
			if (g) {
				u.$$groupId = "$auto." + g;
			}
			this._adjustExpandParameter(u);
			this._adjustTimestampInFilter(f);
			var p = this._determinePathInfo(k, c);
			if (p.multiplicity === "1") {
				return this._readEntity(p, k, c, u, s, e, S);
			} else {
				return this._readEntitySet(p, k, c, u, f, s, e, S);
			}
		},
		facadeCallFunction: function (f, u, c, g) {
			return new Promise(function (r, R) {
				var C = this.getOriginModel().bindContext(f + "(...)");
				if (g) {
					g = "$auto." + g;
				}
				if (!u) {
					u = {};
				}
				for (var p in u) {
					C.setParameter(p, u[p]);
				}
				C.attachDataRequested(this.fireRequestSent.bind(this));
				C.attachDataReceived(this.fireRequestCompleted.bind(this));
				C.execute(g).then(function () {
					var a = C.getBoundContext().getObject();
					r(a);
					C.destroy();
				}).catch(function (e) {
					this.displayErrorMessages([this._createErrorMessage(e)]);
					R(e);
				}.bind(this));
			}.bind(this));
		},
		facadeCreate: function (k, c) {
			throw Error("Not yet implemented.");
		},
		getKey: function (v) {
			return this.createKey(this._getEntitySetName(v), v);
		},
		createKey: function (s, k) {
			var h = true;
			if (s.substr(0, 1) !== "/") {
				h = false;
				s = "/" + s;
			}
			var m = this.getOriginModel().getMetaModel();
			var M = m.getObject(s + "/");
			if (M === null) {
				throw Error("Metadata for '" + s + "' has not been initialized.");
			} else {
				var K = M.$Key;
				var r = s + "(";
				var t;
				for (var i = 0; i < K.length; i++) {
					t = M[K[i]];
					if (t.$Type === "Edm.String") {
						if (typeof k[K[i]] === "string" || typeof k[K[i]] === "number") {
							r += K[i] + "='" + k[K[i]] + "'";
						} else {
							throw Error("Key '" + k[K[i]] + "' for entity set '" + s + "' is missing or of wrong type. Expected type: string");
						}
					} else if (t.$Type === "Edm.Int16" || t.$Type === "Edm.Int32") {
						if (typeof k[K[i]] === "number") {
							r += K[i] + "=" + k[K[i]];
						} else {
							throw Error("Key '" + k[K[i]] + "' for entity set '" + s + "' is missing or of wrong type. Expected type: number");
						}
					} else if (t.$Type === "Edm.Boolean") {
						if (typeof k[K[i]] === "boolean") {
							r += K[i] + "=" + k[K[i]];
						} else {
							throw Error("Key '" + k[K[i]] + "' for entity set '" + s + "' is missing or of wrong type. Expected type: boolean");
						}
					}
					if (i < (K.length - 1)) {
						r += ",";
					}
				}
				r += ")";
				if (!h) {
					r = r.substr(1);
				}
				return r;
			}
		},
		setDeferredGroup: function (g) {
			var G = this.getOriginModel().mGroupProperties;
			G["$auto." + g] = {
				sumbit: "API"
			};
		},
		submitBatch: function (g) {
			return this.getOriginModel().submitBatch("$auto." + g);
		},
		_readEntity: function (p, k, c, u, s, e, S) {
			return new Promise(function (r, R) {
				var C = this.getOriginModel().bindContext(k, c, u);
				C.attachDataRequested(function (E) {
					this.fireRequestSent(E);
				}.bind(this));
				C.attachDataReceived(function (E) {
					this.fireRequestCompleted(E);
				}.bind(this));
				C.requestObject().then(function (d) {
					this._enrichWithMetadata(d, p);
					this._store({
						root: d
					}, p, S);
					this._adjustResponse(d);
					if (s) {
						s(d);
					}
					r(d);
					C.destroy();
				}.bind(this)).catch(function (E) {
					this.displayErrorMessages([this._createErrorMessage(E)]);
					if (e) {
						e(E);
					}
					R(E);
				}.bind(this));
			}.bind(this));
		},
		_readEntitySet: function (p, k, c, u, f, s, e, S) {
			return new Promise(function (r, R) {
				u.$$operationMode = "Server";
				var t, a;
				if (u.$skip !== undefined) {
					a = u.$skip;
					delete u.$skip;
				}
				if (u.$top !== undefined) {
					t = u.$top;
					delete u.$top;
				}
				if (u.$inlinecount === "allpages") {
					u.$count = true;
					delete u.$inlinecount;
				}
				var l = this.getOriginModel().bindList(k, c, undefined, f, u);
				l.attachDataReceived(function (E) {
					if (E.getParameter("error") === undefined) {
						var C = E.getSource().getLength();
						var b = E.getSource().getCurrentContexts();
						var d = [];
						var o;
						for (var i = 0; i < b.length; i++) {
							o = b[i].getObject();
							d.push(o);
						}
						this._enrichWithMetadata(d, p);
						this._store({
							root: d
						}, p, S);
						var D = this._adjustResponse(d);
						D.__count = C + "";
						if (s) {
							s(D);
						}
						r(D);
					} else {
						var g = E.getParameter("error");
						this.displayErrorMessages([this._createErrorMessage(g)]);
						if (e) {
							e(g);
						}
						R(g);
					}
					this.fireRequestCompleted(E);
					l.destroy();
				}.bind(this));
				l.attachDataRequested(function (E) {
					this.fireRequestSent(E);
				}.bind(this));
				l.getContexts(a, t);
			}.bind(this));
		},
		_getEntitySetName: function (d) {
			var m = d["@odata.context"];
			var e = m.split("#")[1];
			var E = e.split("/")[0];
			return E;
		},
		_createErrorMessage: function (e) {
			var E = {};
			if (e.cause) {
				E.statusCode = 0;
				E.message = e.message;
				E.internalMessageCode = "";
				E.internalMessage = "";
				E.serviceId = this._getServiceIdFromUrl(e.cause.requestUrl);
			} else {
				E.statusCode = e.status;
				E.message = e.statusText;
				if (e.error) {
					E.internalMessageCode = e.error.code;
					E.internalMessage = e.error.message;
					if (e.error["@SAP__common.Application"]) {
						E.serviceId = e.error["@SAP__common.Application"].ServiceId;
					}
				}
			}
			return E;
		},
		_getServiceIdFromUrl: function (u) {
			var p = u.split("/");
			return p.length > 3 ? p[p.length - 3] : "";
		},
		_adjustTimestampInFilter: function (f) {
			if (f !== undefined) {
				for (var i = 0; i < f.length; i++) {
					if (f[i].sPath === "ChangeTimestamp") {
						if (f[i].oValue1 !== undefined) {
							f[i].oValue1 = f[i].oValue1.substring(0, f[i].oValue1.length - 8) + "Z";
						}
						if (f[i].oValue2 !== undefined) {
							f[i].oValue2 = f[i].oValue2.substring(0, f[i].oValue2.length - 8) + "Z";
						}
					}
				}
			}
		},
		_getContainerFromMetadata: function () {
			var m = this.getOriginModel().getMetaModel().getData();
			return m[m["$EntityContainer"]];
		},
		_findSetNameOfEntityInContainerMetadata: function (t) {
			var p;
			var c = this._getContainerFromMetadata();
			for (p in c) {
				if (c[p].$Type === t) {
					return p;
				}
			}
			return undefined;
		},
		_enrichWithMetadata: function (d, p) {
			var s;
			if (p.navProperty !== undefined) {
				s = this._determineSetNameOfNavigationProperty(p.setName, p.navProperty);
			} else {
				s = p.setName;
			}
			var m = this.getOriginModel().getMetaModel();
			var S = m.getObject("/" + s + "/");
			var P = function (o) {
				for (var a in S) {
					if (a.charAt(0) !== "$" && S[a].$kind === "NavigationProperty" && o[a] !== undefined) {
						this._enrichWithMetadata(o[a], {
							setName: s,
							navProperty: a
						});
					}
				}
			}.bind(this);
			if (d instanceof Array) {
				for (var i = 0; i < d.length; i++) {
					d[i]["@odata.context"] = "$metadata#" + s + "/$entity";
					P.apply(this, [d[i]]);
				}
			} else {
				d["@odata.context"] = "$metadata#" + s + "/$entity";
				P.apply(this, [d]);
			}
		},
		_adjustExpandParameter: function (u) {
			var i, j;
			var p;
			var r = {};
			var c;
			var I = function (o) {
				return $.isEmptyObject(o);
			};
			var g = function (o) {
				return Object.keys(o).length;
			};
			var t = function (c, R) {
				var C = g(c);
				var i = 0;
				for (var s in c) {
					R += s;
					if (!I.apply(this, [c[s]])) {
						R += "($expand=";
						R = t.apply(this, [c[s], R]);
						R += ")";
					}
					if (i < C - 1) {
						R += ",";
					}
					i++;
				}
				return R;
			};
			if (u && u.$expand) {
				var e = u.$expand.split(",");
				for (i = 0; i < e.length; i++) {
					var d = e[i].split("/");
					c = r;
					for (j = 0; j < d.length; j++) {
						if (!c[d[j]]) {
							p = {};
							c[d[j]] = p;
						}
						c = c[d[j]];
					}
				}
				var E = t(r, "");
				u.$expand = E;
				if (u.$expand === "") {
					delete u.$expand;
				}
			}
		},
		_adjustResponse: function (d) {
			var c = function (a) {
				var r = {
					results: a
				};
				for (var i = 0; i < r.results.length; i++) {
					this._adjustResponse(r.results[i]);
				}
				return r;
			}.bind(this);
			if (d instanceof Array) {
				d = c(d);
			} else {
				for (var p in d) {
					if (d[p] instanceof Array) {
						d[p] = c(d[p]);
					} else if (typeof d[p] === "object") {
						this._adjustResponse(d[p]);
					}
				}
			}
			return d;
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/common/type/DescriptionMode', [], function () {
	"use strict";
	return {
		Description: "description",
		TechnicalName: "technicalName",
		Both: "both"
	};
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/common/type/InspectorMode', [], function () {
	"use strict";
	return {
		objectType: {
			Characteristic: "CHARACTERISTIC",
			CharacteristicValue: "CHARACTERISTICVALUE",
			BOMComponent: "BOMCOMPONENT",
			ClassNode: "CLASSNODE",
			ConfigurationProfile: "CONFIGURATIONPROFILE",
			ObjectDependency: "OBJECTDEPENDENCY",
			RoutingHeader: "ROUTINGHEADER",
			ParallelSequence: "PARALLELSEQUENCE",
			AlternativeSequence: "ALTERNATIVESEQUENCE",
			Operation: "OPERATION",
			SubOperation: "SUBOPERATION",
			RefOperation: "REFOPERATION",
			RefSubOperation: "REFSUBOPERATION",
			PRT: "PRT"
		},
		inspectorTab: {
			properties: "PROPERTIES",
			dependencies: "DEPENDENCIES",
			values: "VALUES",
			operationComponents: "OPERATIONCOMPONENTS",
			prts: "PRTS"
		}
	};
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/common/util/Command', ["sap/ui/base/Object"], function (O) {
	"use strict";
	return O.extend("sap.i2d.lo.lib.zvchclfz.common.util.Command", {
		metadata: {
			publicMethods: ["execute", "undo", "getSourceControlId"]
		},
		constructor: function (c, r, u) {
			this._sControlId = c;
			this.oUndo = u;
			this.oRedo = r;
		},
		execute: function () {
			return this.oRedo.execute();
		},
		undo: function () {
			return this.oUndo.execute();
		},
		toString: function () {
			return "Command for cstic '" + this.oRedo.oCsticData.CsticId + "'" + " / undo-direction = " + this.oUndo.oValue.Direction +
				" / undo-value = " + JSON.stringify(this.oUndo.oValue.ValueObject) + " / redo-direction = " + this.oRedo.oValue.Direction +
				" / redo-value = " + JSON.stringify(this.oRedo.oValue.ValueObject);
		},
		getSourceControlId: function () {
			return this._sControlId;
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/common/util/CommandManager', ["sap/i2d/lo/lib/zvchclfz/common/util/Command",
	"sap/ui/model/json/JSONModel", "sap/i2d/lo/lib/zvchclfz/common/util/Logger"
], function (C, J, L) {
	"use strict";
	var c = Object.create(null);
	c._aCommands = [];
	c._iPosition = -1;
	c._bUndoWasTriggered = false;
	c._oModel = new J({
		enableUndoButton: false,
		enableRedoButton: false
	});
	c.execute = function (o) {
		this._oModel.setProperty("/enableRedoButton", false);
		this._oModel.setProperty("/enableUndoButton", false);
		if (c._bUndoWasTriggered) {
			c._aCommands.splice(c._iPosition + 1);
			c._bUndoWasTriggered = false;
		}
		this._aCommands.push(o);
		L.logDebug("Adding command: {0}", [o]);
		c._iPosition++;
		var p = o.execute();
		p.then(function () {
			this._oModel.setProperty("/enableRedoButton", false);
			this._oModel.setProperty("/enableUndoButton", true);
		}.bind(this));
		return p;
	};
	var f = function (o) {
		var s = sap.ui.getCore().byId(o.getSourceControlId());
		if (s) {
			s.focus();
		}
	};
	c.undo = function () {
		var o = this._aCommands[this._iPosition];
		this._oModel.setProperty("/enableRedoButton", false);
		this._oModel.setProperty("/enableUndoButton", false);
		var p = o.undo();
		p.then(function () {
			f(o);
			this._oModel.setProperty("/enableUndoButton", c._iPosition > -1);
			this._oModel.setProperty("/enableRedoButton", true);
		}.bind(this));
		this._iPosition--;
		c._bUndoWasTriggered = true;
		return p;
	};
	c.redo = function () {
		this._iPosition++;
		var o = this._aCommands[this._iPosition];
		this._oModel.setProperty("/enableRedoButton", false);
		this._oModel.setProperty("/enableUndoButton", false);
		var r = c._iPosition + 1 < c._aCommands.length;
		var p = o.execute();
		p.then(function () {
			f(o);
			this._oModel.setProperty("/enableUndoButton", true);
			this._oModel.setProperty("/enableRedoButton", r);
		}.bind(this));
		return p;
	};
	c.getModel = function () {
		return this._oModel;
	};
	c.reset = function () {
		this._aCommands = [];
		this._iPosition = -1;
		this._oModel.setProperty("/enableRedoButton", false);
		this._oModel.setProperty("/enableUndoButton", false);
		this._bUndoWasTriggered = false;
	};
	return c;
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/common/util/ErrorDialog', ["sap/ui/base/ManagedObject", "sap/ui/model/resource/ResourceModel",
	"sap/ui/model/json/JSONModel", "sap/m/Dialog", "sap/m/Button", "sap/m/Text", "sap/m/MessageItem", "sap/m/MessageView", "sap/m/Bar",
	"sap/ui/core/Icon", "sap/i2d/lo/lib/zvchclfz/common/Constants"
], function (M, R, J, D, B, T, a, b, c, I, C) {
	"use strict";
	return M.extend("sap.i2d.lo.lib.zvchclfz.common.util.ErrorDialog", {
		_dialog: null,
		aAfterCloseCallBacks: [],
		displayErrorMessages: function (v, m, f) {
			if (v && !v.bIsDestroyed) {
				if (f) {
					this.aAfterCloseCallBacks.push(f);
				}
				this._initDialog(v);
				this._addErrorMessagesToDialog(m);
				if (!this._dialog.isOpen()) {
					this._dialog.open();
				}
			}
		},
		_onAfterDialogClosed: function () {
			this.aAfterCloseCallBacks.forEach(function (f) {
				f();
			});
			this._dialog.destroy();
			this._dialog = null;
		},
		_initDialog: function (v) {
			if (!this._dialog || this._dialog.bIsDestroyed) {
				var m = new J();
				var r = new R({
					bundleName: "sap.i2d.lo.lib.zvchclfz.components.configuration.i18n.messagebundle"
				});
				var o = r.getResourceBundle();
				var e = o.getText("ERROR");
				var s = o.getText("ERROR_SERVICE_ID");
				var i = o.getText("ERROR_INTERNAL_MESSAGE");
				var d = o.getText("ERROR_INTERNAL_MESSAGE_CODE");
				var f = new a({
					type: "Error",
					title: "{= ${statusCode} ? ( ${statusCode} + ' - ' + ${message} ) : ${message} }",
					subtitle: "{internalMessage}",
					description: "{= ${internalMessage} ? '" + i + ": ' + ${internalMessage} + '\n' : '' }" + "{= ${internalMessageCode}  ? '" + d +
						": ' + ${internalMessageCode} + '\n' : '' }" + "{= ${serviceId} ? '" + s + ": ' + ${serviceId} : '' }"
				});
				var g;
				var h = new b({
					showDetailsPageHeader: false,
					itemSelect: function () {
						g.setVisible(true);
					},
					items: {
						path: "/",
						template: f
					}
				});
				h.setModel(m);
				g = new B({
					icon: sap.ui.core.IconPool.getIconURI("nav-back"),
					visible: false,
					press: function () {
						h.navigateBack();
						this.setVisible(false);
					}
				});
				this._dialog = new D({
					id: C.ERR_DIALOG_ID,
					resizable: false,
					content: h,
					state: "Error",
					title: e,
					customHeader: new c({
						contentMiddle: [new I({
							src: sap.ui.core.IconPool.getIconURI("message-error"),
							color: sap.ui.core.IconColor.Negative
						}), new T({
							text: e
						})],
						contentLeft: [g]
					}),
					endButton: new B({
						id: C.ERR_DIALOG_CLOSE_BUTTON_ID,
						press: function (E) {
							var j = E.getSource().getParent();
							v.removeDependent(j);
							j.close();
						},
						text: "Close"
					}),
					afterClose: [this._onAfterDialogClosed, this],
					contentHeight: "300px",
					contentWidth: "500px",
					verticalScrolling: false,
					visible: true
				});
				v.addDependent(this._dialog);
			}
			return this._dialog;
		},
		_addErrorMessagesToDialog: function (n) {
			if (n.length > 0) {
				var m = this._dialog.getAggregation("content")[0];
				var d = m.getModel().getData();
				var e = [];
				if (Array.isArray(d)) {
					e = this._combineMessagesWithoutDuplicates(d, n);
				} else {
					e = this._combineMessagesWithoutDuplicates([], n);
				}
				m.getModel().setData(e);
				this._dialog.getCustomHeader().getContentLeft()[0].firePress();
				return true;
			}
			return false;
		},
		_combineMessagesWithoutDuplicates: function (e, n) {
			var r = e.slice();
			n.forEach(function (o) {
				var i = r.some(function (E) {
					if (E.internalMessage && o.internalMessage) {
						if (E.internalMessage === o.internalMessage) {
							return true;
						}
						return false;
					} else if (E.message === o.message) {
						return true;
					}
					return false;
				});
				if (!i) {
					r.push(o);
				}
			});
			return r;
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/common/util/Helper', ["sap/ui/core/mvc/View"], function (V) {
	var H = {
		createCharacteristicKey: function (c, C) {
			var m = c.getModel("vchclf");
			var k = m.createKey("CharacteristicSet", {
				ContextId: C.ContextId,
				InstanceId: C.InstanceId,
				GroupId: C.GroupId,
				CsticId: C.CsticId
			});
			return "/" + k;
		},
		isContentOfArrayEqual: function (a, A) {
			if (!a || !A) {
				return false;
			}
			if (a.length !== A.length) {
				return false;
			}
			var c = 0;
			a.forEach(function (v) {
				A.forEach(function (o) {
					if (v === o) {
						c++;
					}
				});
			});
			return a.length === c;
		},
	};
	return H;
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/common/util/Logger', ["sap/base/Log"], function (L) {
	"use strict";
	var a = {
		logDebug: function (m, p, M) {
			if (L.isLoggable(L.Level.DEBUG)) {
				L.debug(this._replaceMessageParameters(m, p), null, this._getClassName(M));
			}
		},
		logInfo: function (m, p, M) {
			if (L.isLoggable(L.Level.INFO)) {
				L.info(this._replaceMessageParameters(m, p), null, this._getClassName(M));
			}
		},
		logWarning: function (m, p, M) {
			if (L.isLoggable(L.Level.WARNING)) {
				L.warning(this._replaceMessageParameters(m, p), null, this._getClassName(M));
			}
		},
		logError: function (m, p, M) {
			if (L.isLoggable(L.Level.ERROR)) {
				L.error(this._replaceMessageParameters(m, p), null, this._getClassName(M));
			}
		},
		logErrorStack: function (e, m) {
			L.error(e.stack, null, this._getClassName(m));
		},
		_getClassName: function (m) {
			if (m && m.getMetadata && m.getMetadata().getName) {
				return m.getMetadata().getName();
			} else {
				return "sap.i2d.lo.lib.zvchclf";
			}
		},
		_replaceMessageParameters: function (m, p) {
			var b = 0;
			var s;
			var B, A;
			if (p) {
				for (var i = 0; i < p.length; i++) {
					b = m.indexOf("{" + i + "}", b);
					if (typeof p[i] === "object") {
						if (p[i].toString !== Object.prototype.toString) {
							s = p[i].toString();
						} else {
							s = JSON.stringify(p[i]);
						}
					} else {
						s = p[i];
					}
					B = m.substring(0, b);
					A = m.substr(b + 3);
					m = B + s + A;
					b += s.length;
				}
			}
			return m;
		}
	};
	return a;
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/common/util/RequestQueue', ["jquery.sap.global", "sap/ui/base/ManagedObject"], function (q, M) {
	"use strict";
	var Q = 0;
	return {
		_aQueue: [],
		_iObserverTimeout: null,
		add: function (r, c) {
			var u = this._createRequestUuid();
			var p = new Promise(function (R, f) {
				this._aQueue.push({
					resolve: R,
					reject: f,
					request: r,
					context: c,
					uuid: u
				});
			}.bind(this));
			p.requestUuid = u;
			this._observe();
			return p;
		},
		remove: function (r) {
			for (var i = 0; i < this._aQueue.length; i++) {
				if (this._aQueue[i].uuid === r) {
					this._aQueue.splice(i, 1);
					return true;
				}
			}
			return false;
		},
		getLength: function () {
			return this._aQueue.length;
		},
		isEmpty: function () {
			return !this.getLength();
		},
		clear: function () {
			this._aQueue = [];
			this._clearObserverTimeout();
		},
		_observe: function () {
			if (!this._iObserverTimeout) {
				var f = function () {
					this._clearObserverTimeout();
					if (!this.isEmpty()) {
						this._observe();
					}
				};
				this._iObserverTimeout = q.sap.delayedCall(Q, this, function () {
					this._flush().then(f.bind(this)).catch(f.bind(this));
				});
			}
		},
		_flush: function () {
			var r = [];
			var f = function (p, c) {
				return function () {
					if (!this._isObjectDestroyed(c)) {
						p.apply(c, arguments);
					}
				}.bind(this);
			}.bind(this);
			var R = this._aQueue.shift();
			while (R) {
				var c = R.context;
				if (!this._isObjectDestroyed(c)) {
					r.push(R.request.apply(c).then(f(R.resolve, c)).catch(f(R.reject, c)));
				}
				R = this._aQueue.shift();
			}
			return Promise.all(r);
		},
		_isObjectDestroyed: function (o) {
			return (o && o instanceof M && o.bIsDestroyed);
		},
		_clearObserverTimeout: function () {
			q.sap.clearDelayedCall(this._iObserverTimeout);
			this._iObserverTimeout = null;
		},
		_createRequestUuid: function () {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
				var r = Math.random() * 16 | 0,
					v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
		}
	};
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/common/util/Toggle', ["sap/i2d/lo/lib/zvchclfz/common/Constants"], function (C) {
	"use strict";
	return {
		isActive: function (i, f) {
			var t = true;
			if (!this._isToggleEntityLoaded(f || this.getModel(C.VCHCLF_MODEL_NAME))) {
				return false;
			}
			var m = f || this.getModel(C.VCHCLF_MODEL_NAME);
			var F = m.getProperty("/ToggleSet('" + i + "')");
			if (F) {
				t = !!F.ToggleStatus;
			}
			return t;
		},
		_isToggleEntityLoaded: function (m) {
			var d = m.getData("/");
			var i = false;
			for (var p in d) {
				if (p.indexOf("ToggleSet") >= 0) {
					i = true;
				}
			}
			return i;
		}
	};
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/common/util/XMLFragmentCache', ["sap/ui/core/XMLTemplateProcessor"], function (X) {
	"use strict";
	return {
		_mCache: {},
		createFragment: function (i, p, c) {
			var x = this._mCache[p];
			if (!x) {
				x = this._mCache[p] = X.loadTemplate(p, "fragment");
			}
			return new sap.ui.xmlfragment({
				id: i,
				fragmentContent: x
			}, c);
		}
	};
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/common/util/XMLFragmentControllerCache', ["sap/ui/base/ManagedObject"], function (M) {
	"use strict";
	return M.extend("sap.i2d.lo.lib.zvchclfz.common.util.XMLFragmentControllerCache", {
		init: function () {
			this._mCache = {};
		},
		exit: function () {
			for (var c in this._mCache) {
				var C = this._mCache[c];
				C.destroy();
			}
		},
		createController: function (f, c, p, F) {
			if (F || !this._mCache[f]) {
				jQuery.sap.require(c);
				var a = jQuery.sap.getObject(c);
				this._mCache[f] = new a(p);
			}
			return this._mCache[f];
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/classification/Component', ["sap/ui/core/UIComponent",
	"sap/suite/ui/generic/template/extensionAPI/ReuseComponentSupport", "sap/suite/ui/generic/template/extensionAPI/UIMode",
	"sap/i2d/lo/lib/zvchclfz/common/Constants", "sap/i2d/lo/lib/zvchclfz/components/classification/service/ClassificationService",
	"sap/i2d/lo/lib/zvchclfz/common/factory/ODataFacadeModelFactory", "sap/i2d/lo/lib/zvchclfz/common/odataFacade/ODataFacadeModel"
], function (U, R, a, C, b, O, c) {
	"use strict";
	return U.extend("sap.i2d.lo.lib.zvchclfz.components.classification.Component", {
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
		createContent: function () {
			this.oView = sap.ui.view({
				viewName: "sap.i2d.lo.lib.zvchclfz.components.classification.view.Classification",
				type: sap.ui.core.mvc.ViewType.XML
			});
			R.mixInto(this, C.CLASSIFICATION_COMPONENT_MODEL_NAME);
			this.getModel(C.CLASSIFICATION_COMPONENT_MODEL_NAME).setProperty("/editable", false);
			return this.oView;
		},
		stStart: function (m, B, e) {
			this.getModel(C.CLASSIFICATION_COMPONENT_MODEL_NAME).setProperty("/extensionAPI", e);
			e.registerMessageFilterProvider(this._setMessageFilterPromise.bind(this));
			this.stRefresh();
		},
		stRefresh: function (m, B, e) {
			this._clearLastVisibleContext();
			this._registerMessageFilter();
			this._checkChangeNumber();
			this._stRefresh();
		},
		refreshContext: function () {
			this.oView.getController().loadClassification();
		},
		setUiMode: function (u) {
			this.setProperty("uiMode", u);
			var e = u === a.Create || u === a.Edit;
			this.getModel(C.CLASSIFICATION_COMPONENT_MODEL_NAME).setProperty("/editable", e);
		},
		setStIsAreaVisible: function (A) {
			this.setProperty("stIsAreaVisible", A);
			this._stRefresh();
		},
		_stRefresh: function () {
			if (this._lastVisibleContextChanged() && this.getStIsAreaVisible()) {
				this._updateLastVisibleContext();
				var m = this.oView.getModel();
				if (!(m instanceof c)) {
					var v = function () {
						return this.oView;
					}.bind(this);
					m = O.createFacadeModel(m, [], v);
					this.oView.setModel(m);
				}
				var o = this.getBindingContext();
				if (o) {
					var d = m.getOriginModel().getProperty(o.getPath());
					m.storePreloadedData(d, o.getPath());
					var B = m.createBindingContext(o.getPath(), undefined, undefined, undefined, false, false);
					this.oView.setBindingContext(B);
				}
				m.metadataLoaded().then(function () {
					this.oView.getController().loadClassification();
				}.bind(this));
			}
		},
		_registerMessageFilter: function () {
			var d = encodeURIComponent(this.getDraftKey());
			if (this._fnResolveMessageFilter) {
				this._fnResolveMessageFilter(d);
			}
		},
		_checkChangeNumber: function () {
			var s = b.getService().getClassificationContextId(this.getModel(C.CLASSIFICATION_COMPONENT_MODEL_NAME).getData());
			var d = encodeURIComponent(s);
			var m = sap.ui.getCore().getMessageManager();
			m.removeMessages(this.oMessage);
			if (this.getProperty("changeNumber")) {
				this.oMessage = new sap.ui.core.message.Message({
					message: this.getModel("i18n").getResourceBundle().getText("CLF_ECN_IGNORED"),
					type: sap.ui.core.MessageType.Warning,
					processor: this.getModel(),
					target: d
				});
				m.addMessages(this.oMessage);
			}
		},
		_setMessageFilterPromise: function () {
			return new Promise(function (r) {
				this._fnResolveMessageFilter = function (d) {
					if (!d || this.sResolvedForDraftKeyId === d) {
						return;
					}
					this.sResolvedForDraftKeyId = d;
					r(new sap.ui.model.Filter({
						filters: [new sap.ui.model.Filter({
							path: "target",
							operator: sap.ui.model.FilterOperator.Contains,
							value1: "CLF"
						}), new sap.ui.model.Filter({
							path: "target",
							operator: sap.ui.model.FilterOperator.Contains,
							value1: d
						})],
						and: true
					}));
				}.bind(this);
			}.bind(this));
		},
		_updateLastVisibleContext: function () {
			this._lastVisibleContext.objectKey = this.getObjectKey();
			this._lastVisibleContext.draftKey = this.getDraftKey();
		},
		_clearLastVisibleContext: function () {
			this._lastVisibleContext = {
				objectKey: "",
				draftKey: ""
			};
		},
		_lastVisibleContextChanged: function () {
			if (this._lastVisibleContext.objectKey === this.getObjectKey() && this._lastVisibleContext.draftKey === this.getDraftKey()) {
				return false;
			}
			return true;
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/classification/controller/ClassType.controller', ["jquery.sap.global",
	"sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "sap/m/Button", "sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/classification/service/ClassificationService",
	"sap/i2d/lo/lib/zvchclfz/components/classification/service/EnhancementService",
	"sap/i2d/lo/lib/zvchclfz/components/classification/service/AssignClassDialogService",
	"sap/i2d/lo/lib/zvchclfz/components/classification/utils/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/classification/utils/PropertyBindingHandler",
	"sap/i2d/lo/lib/zvchclfz/components/classification/utils/Formatter", "sap/i2d/lo/lib/zvchclfz/components/valuation/Component"
], function (q, C, J, B, a, b, E, A, c, P, F, V) {
	"use strict";
	return C.extend("sap.i2d.lo.lib.zvchclfz.components.classification.controller.ClassType", {
		UNASSIGN_CLASS_FRAGMENT_NAME: "sap.i2d.lo.lib.zvchclfz.components.classification.view.fragments.UnassignClassPopover",
		ASSIGN_CLASS_FRAGMENT_NAME: "sap.i2d.lo.lib.zvchclfz.components.classification.view.fragments.AssignClassActionSheet",
		VIEW_MODEL_NAME: "classTypeViewModel",
		oUnassignClassPopover: undefined,
		oODataBinding: undefined,
		oFilterObject: undefined,
		oValuationComponent: undefined,
		bClassAssignmentListenerEnabled: true,
		oClassificationService: b.getService(),
		oEnhancementService: E.getService(),
		formatter: F,
		onInit: function () {
			var v = this.getView();
			var o = new J({
				unassignClassSelectedContext: undefined
			});
			v.setModel(o, this.VIEW_MODEL_NAME);
			v.attachEvent("afterRendering", this._setFocus, this);
			v.attachEventOnce("afterRendering", this.afterRendering, this);
		},
		afterRendering: function (e) {
			var v = e.getSource();
			var m = v.getModel(a.LOCAL_CLASSIFICATION_MODEL_NAME);
			var o = m.bindProperty("IsRefreshRequired", v.getBindingContext(a.LOCAL_CLASSIFICATION_MODEL_NAME));
			o.attachChange(this._refreshValuationBinding, v.getController());
			P.addPropertyBinding(o);
			this.oClassificationService.attachAssignedClassesChanged(this._assignedClassesChanged, v.getController());
		},
		onExit: function () {
			q.sap.clearDelayedCall(this.iOnProposClassificationDelayedClassId);
			P.clearPropertyBindings();
			if (this.oValuationComponent) {
				this.oValuationComponent.detachCharacteristicChanged(this._characteristicChanged, this);
				this.oValuationComponent.detachCollectPreloadedCharacteristicGroup(this._collectPreloadedCharacteristicGroup, this);
			}
			this.oClassificationService.detachAssignedClassesChanged(this._assignedClassesChanged, this);
		},
		onClassSelectionChange: function (e) {
			var i = e.getSource().getSelectedKey();
			this._updateValuationBinding(i);
		},
		onUnassignClassButtonPress: function (e) {
			this.oUnassignClassPopover = sap.ui.xmlfragment(this.UNASSIGN_CLASS_FRAGMENT_NAME, this.UNASSIGN_CLASS_FRAGMENT_NAME, this);
			this.getView().addDependent(this.oUnassignClassPopover);
			this.oUnassignClassPopover.openBy(e.getSource());
		},
		onUnassignClassPopoverUnassignButtonPress: function () {
			var v = this.getView().getModel(this.VIEW_MODEL_NAME);
			var u = v.getProperty("/unassignClassSelectedContext");
			if (u) {
				var i = u.getProperty("InstanceId");
				this.oClassificationService.unassignClass(i);
				this.oUnassignClassPopover.close();
				v.setProperty("/unassignClassSelectedContext", undefined);
			}
		},
		onUnassignClassListSelectionChange: function (e) {
			var s = e.getSource().getSelectedContexts();
			this.getView().getModel(this.VIEW_MODEL_NAME).setProperty("/unassignClassSelectedContext", s[0]);
		},
		onUnassignClassPopoverAfterClose: function (e) {
			this.getView().getModel(this.VIEW_MODEL_NAME).setProperty("/unassignClassSelectedContext", undefined);
			e.getSource().destroy();
		},
		onAssignClassButtonPress: function (e) {
			var v = this.getView();
			var d = v.getModel(a.LOCAL_CLASSIFICATION_MODEL_NAME).getProperty("/ClassTypes");
			if (d.length <= 1) {
				A.open(v);
			} else {
				var o = sap.ui.xmlfragment(this.ASSIGN_CLASS_FRAGMENT_NAME, this.ASSIGN_CLASS_FRAGMENT_NAME, this);
				v.addDependent(o);
				o.openBy(e.getSource());
			}
		},
		onAssignClassActionSheetButtonPress: function (e) {
			var v = this.getView();
			var f = e.getSource().data("fromThisClassType");
			A.open(v, f);
		},
		onActionSheetAfterClose: function (e) {
			e.getSource().destroy();
		},
		onFilterButtonPress: function (e) {
			var s = e.getSource();
			if (this.oValuationComponent) {
				this.oValuationComponent.openFilterDialog(s);
			}
		},
		onProposeClassificationButtonPress: function (e) {
			var s = e.getSource().getBindingContext(a.LOCAL_CLASSIFICATION_MODEL_NAME).getProperty("ClassType");
			this.bClassAssignmentListenerEnabled = false;
			this.iOnProposClassificationDelayedClassId = q.sap.delayedCall(0, this, function () {
				this.oEnhancementService.loadClassificationProposal(e).then(function (d) {
					if (d && d.callDefaultImplementation) {
						this.oClassificationService.loadClassificationProposal(s).then(function () {
							this._selectInstance(s);
							this.bClassAssignmentListenerEnabled = true;
						}.bind(this));
					} else {
						this._selectInstance(s);
						this.bClassAssignmentListenerEnabled = true;
					}
				}.bind(this));
			}.bind(this));
		},
		callUpdateBinding: function () {
			var v = this.getView();
			var o = v.getBindingContext(a.LOCAL_CLASSIFICATION_MODEL_NAME);
			var m = v.getModel(a.LOCAL_CLASSIFICATION_MODEL_NAME);
			if (o) {
				var s = o.getProperty("SelectedInstanceKey");
				var i = o.getProperty("InstanceId");
				if (s !== i) {
					m.setProperty("SelectedInstanceKey", i, o);
					this._updateValuationBinding(i);
				}
			}
		},
		_assignedClassesChanged: function (e) {
			var v = this.getView();
			var s = e.getParameter("classType");
			var d = v.getBindingContext(a.LOCAL_CLASSIFICATION_MODEL_NAME).getProperty("ClassType");
			var o = v.byId("valuationComponentContainer");
			var f = o.getComponent();
			var g = sap.ui.getCore().getComponent(f);
			if (g && s === d) {
				g.initAppStateModel();
				g.removeCharacteristicFilter();
			}
		},
		_setFocus: function (e) {
			var v = e.getSource();
			v.byId("assignClassButton").focus();
		},
		_selectInstance: function (i) {
			var v = this.getView();
			var o = v.getBindingContext(a.LOCAL_CLASSIFICATION_MODEL_NAME);
			v.getModel(a.LOCAL_CLASSIFICATION_MODEL_NAME).setProperty("SelectedInstanceKey", i, o);
			this._updateValuationBinding(i);
		},
		_refreshValuationBinding: function (o) {
			var v = o.getSource().getValue();
			if (v && this.bClassAssignmentListenerEnabled) {
				var d = this.getView();
				var e = d.getBindingContext(a.LOCAL_CLASSIFICATION_MODEL_NAME);
				var p = e.getPath();
				var f = d.byId("valuationComponentContainer");
				var s = f.getComponent();
				var g = sap.ui.getCore().getComponent(s);
				if (v === c.FULL_REFRESH) {
					g.updateRootBindingContext(null, g.getBindingContext(a.VIEW_MODEL_NAME).getPath(), true);
				} else if (v === c.REFRESH_RENDERING) {
					g.refreshRendering();
				}
				d.getModel(a.LOCAL_CLASSIFICATION_MODEL_NAME).setProperty(p + "/IsRefreshRequired", "");
			}
		},
		_updateValuationBinding: function (i) {
			var v = this.getView();
			var o = v.getModel(a.CLASSIFICATION_COMPONENT_MODEL_NAME);
			var I = v.getBindingContext(a.LOCAL_CLASSIFICATION_MODEL_NAME).getProperty("IsVisible");
			if (I && i) {
				var d = v.byId("valuationComponentContainer");
				var s = v.getModel().createKey("/ClassificationInstanceSet", {
					ContextId: this.oClassificationService.getContextId(),
					InstanceId: i
				});
				if (!d.getModel(a.VCHCLF_MODEL_NAME)) {
					d.setModel(v.getModel(), a.VCHCLF_MODEL_NAME);
				}
				if (this.oValuationComponent) {
					var p;
					var e = this.oValuationComponent.getBindingContext(a.VIEW_MODEL_NAME);
					if (e && e.getPath() === s) {
						p = this.oValuationComponent.updateRootBindingContext(null, s, true);
					} else {
						p = this.oValuationComponent.updateRootBindingContext(null, s, false);
					}
					p.then(function () {
						this.oValuationComponent.removeCharacteristicFilter(true);
					}.bind(this));
				} else {
					var f = o.getProperty("/extensionAPI");
					this.oValuationComponent = new V(v.createId("valuationComponent"), {
						draftTransactionController: f ? f.getTransactionController() : undefined,
						semanticObject: o.getProperty("/semanticObject"),
						objectKey: o.getProperty("/objectKey"),
						uiMode: "{" + a.CLASSIFICATION_COMPONENT_MODEL_NAME + ">/uiMode}"
					});
					d.setComponent(this.oValuationComponent);
					this.oValuationComponent.attachCollectPreloadedCharacteristicGroup(this._collectPreloadedCharacteristicGroup.bind(this));
					this.oValuationComponent.updateRootBindingContext(null, s, false);
					this.oValuationComponent.attachCharacteristicChanged(this._characteristicChanged.bind(this));
				}
			}
		},
		_collectPreloadedCharacteristicGroup: function (e) {
			var v = this.getView();
			var o = v.getModel(a.CLASSIFICATION_COMPONENT_MODEL_NAME);
			if (o.getProperty("/isInitialLoad")) {
				var p = e.getParameter("preloadedCharacteristicGroup");
				var d = v.getModel();
				var s = d.createKey("/CharacteristicsGroupSet", {
					ContextId: p.sContextId,
					InstanceId: p.sInstanceId,
					GroupId: p.iGroupId
				});
				var f = d.getProperty(s, null, true);
				var g = f.Characteristics.results;
				p.aCharacteristics = g;
			}
		},
		_characteristicChanged: function (o) {
			var s = o.getParameter("characteristicPath");
			var i = s.indexOf("ContextId=") + "ContextId=".length;
			var v = s.substring(i).slice(1, 4);
			if (v === "CLF") {
				var I = s.indexOf("InstanceId=") + "InstanceId=".length;
				var d = s.substring(I).split("'")[1];
				this.oClassificationService.fireCharacteristicValueChanged({
					instanceId: d
				});
			}
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/classification/controller/Classification.controller', ["sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel", "sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/classification/utils/Constants", "sap/i2d/lo/lib/zvchclfz/components/classification/utils/Formatter",
	"sap/i2d/lo/lib/zvchclfz/components/classification/service/ClassificationService",
	"sap/i2d/lo/lib/zvchclfz/components/classification/service/EnhancementService",
	"sap/i2d/lo/lib/zvchclfz/components/classification/service/AssignClassDialogService"
], function (C, J, a, b, F, c, E, A) {
	"use strict";
	return C.extend("sap.i2d.lo.lib.zvchclfz.components.classification.controller.Classification", {
		formatter: F,
		oClassificationService: c.getService(),
		oEnhancementService: E.getService(),
		onInit: function () {
			var v = this.getView();
			var l = new J(this._getDefaultModelData());
			v.setModel(l, a.LOCAL_CLASSIFICATION_MODEL_NAME);
			var f = new J(this._getDefaultFeatureToggleModelData());
			v.setModel(f, a.FEATURE_TOGGLE_MODEL_NAME);
		},
		onExit: function () {
			this.oClassificationService.clear();
			this.oClassificationService.detachAssignedClassesChanged(this._callRefreshAssignedClasses, this);
			this.oClassificationService.detachCharacteristicValueChanged(this._characteristicValueChanged, this);
		},
		loadClassification: function () {
			var o = this.getOwnerComponent();
			var v = this.getView();
			var h = false;
			var u = this.getOwnerComponent().getUiMode();
			var e = u !== "Display";
			var l = v.getModel(a.LOCAL_CLASSIFICATION_MODEL_NAME);
			var d = v.getModel(a.CLASSIFICATION_COMPONENT_MODEL_NAME);
			var f = d.getProperty("/extensionAPI");
			var g = {
				SemanticObj: o.getSemanticObject(),
				TechnicalObj: o.getTechnicalObject(),
				ObjectKey: o.getObjectKey(),
				DraftKey: o.getDraftKey(),
				DraftKeyIsString: o.getDraftKeyIsString(),
				ECN: o.getChangeNumber(),
				ValidFrom: o.getValidityDate()
			};
			if (g.ObjectKey || g.DraftKey) {
				this._initServices();
				l.setData(this._getDefaultModelData());
				d.setProperty("/classificationBusy", true);
				d.setProperty("/isInitialLoad", true);
				this.oClassificationService.createClassificationContextId(g);
				if (f) {
					this.oClassificationService.handleActivationStatusChange();
				}
				this._setAvailableClassTypes();
				this._refreshAssignedClasses();
				this._registerRefreshListener();
				if (h && e) {
					this._setClassificationSettings();
				}
			}
		},
		onAssignClassLinkPress: function () {
			A.open(this.getView());
		},
		onProposeClassificationLinkPress: function (e) {
			var p = this.oEnhancementService.loadClassificationProposal(e);
			p.then(function (d) {
				if (d && d.callDefaultImplementation) {
					this.oClassificationService.loadClassificationProposal("");
				}
			}.bind(this));
		},
		_initServices: function () {
			this.onExit();
			this.oClassificationService.initialize(this.getView());
			this.oClassificationService.attachAssignedClassesChanged(this._callRefreshAssignedClasses, this);
			this.oClassificationService.attachCharacteristicValueChanged(this._characteristicValueChanged, this);
			this.oEnhancementService.initialize(this.getView());
		},
		_callRefreshAssignedClasses: function (d) {
			this._refreshAssignedClasses(d.getParameter("classType"));
		},
		_characteristicValueChanged: function (d) {
			if (!this.getView().getModel(a.LOCAL_CLASSIFICATION_MODEL_NAME).getProperty("/IsActivationStatusChanged")) {
				var s = this.oClassificationService.getClassTypeByInstanceId(d.getParameter("instanceId"));
				this._refreshClassificationStatus(s);
			}
		},
		_setClassificationSettings: function () {
			var v = this.getView();
			this.oClassificationService.getClassificationSettings().then(function (d) {
				v.getModel(a.CLASSIFICATION_COMPONENT_MODEL_NAME).setProperty("/editable", d);
				v.getModel(a.LOCAL_CLASSIFICATION_MODEL_NAME).setProperty("/IsRemoveOnly", !d);
			});
		},
		_refreshClassificationStatus: function (s) {
			this.oClassificationService.getAssignedClasses(s).then(function (d) {
				var l = this.getView().getModel(a.LOCAL_CLASSIFICATION_MODEL_NAME);
				var e = l.getProperty("/ClassTypes");
				e.some(function (o, i) {
					if (o.ClassType === s) {
						var p = o.Status;
						var n = d[0].Status;
						if (n.Description !== p.Description) {
							l.setProperty("/ClassTypes/" + i + "/Status", n);
						}
						return true;
					}
					return false;
				});
			}.bind(this));
		},
		_refreshAssignedClasses: function (s, f) {
			var v = this.getView();
			var m = v.getModel(a.LOCAL_CLASSIFICATION_MODEL_NAME);
			var o = v.getModel(a.CLASSIFICATION_COMPONENT_MODEL_NAME);
			this.oClassificationService.readFeatureToggles().then(function () {
				var d = {};
				v.getModel(a.FEATURE_TOGGLE_MODEL_NAME).setData(d);
			});
			this.oClassificationService.getAssignedClasses(s).then(function (d) {
				if (!d || d.length === 0) {
					return;
				}
				var e = m.getProperty("/ClassTypes");
				if (s) {
					e.some(function (i, I) {
						if (i.ClassType === s) {
							m.setProperty("/ClassTypes/" + I, d[0]);
							if (f) {
								m.setProperty("/ClassTypes/" + I + "/IsRefreshRequired", b.FULL_REFRESH);
							}
							return true;
						}
						return false;
					});
				} else {
					m.setProperty("/ClassTypes", d);
					if (f) {
						d.forEach(function (i, I) {
							m.setProperty("/ClassTypes/" + I + "/IsRefreshRequired", b.FULL_REFRESH);
						});
					}
				}
				this._setFirstVisibleItem();
				this._setDisableAddAssignment();
				m.setProperty("/HasLoadError", false);
				o.setProperty("/classificationBusy", false);
				o.setProperty("/isInitialLoad", false);
			}.bind(this), function () {
				m.setProperty("/HasLoadError", true);
				o.setProperty("/classificationBusy", false);
				o.setProperty("/isInitialLoad", false);
			});
		},
		_setAvailableClassTypes: function () {
			this.oClassificationService.getAvailableClassTypes().then(function (d) {
				this.getView().getModel(a.LOCAL_CLASSIFICATION_MODEL_NAME).setProperty("/AvailableClassTypes", d);
			}.bind(this));
		},
		_registerRefreshListener: function () {
			if (this.getOwnerComponent().getUiMode() !== "Display") {
				var v = this.getView();
				if (this.oODataBinding) {
					this.oODataBinding.detachChange(this._refreshHandler, this);
					this.oODataBinding.destroy();
				}
				var o;
				if (v.getBindingContext()) {
					o = v.getModel().createBindingContextForOriginModel(v.getBindingContext());
				}
				this.oODataBinding = v.getModel().getOriginModel().bindProperty("ClassificationSideEffect", o);
				this.oODataBinding.attachChange(this._refreshHandler, this);
			}
		},
		_refreshHandler: function (e) {
			var m = this.getView().getModel(a.LOCAL_CLASSIFICATION_MODEL_NAME);
			var v = e.getSource().getValue();
			if (v && v !== this.sValue) {
				this.sValue = v;
				var d = v.split("|").splice(1);
				if (d.length === 0) {} else {
					var f = m.getProperty("/ClassTypes");
					d.forEach(function (s) {
						var k = s.split("=");
						if (k[0] === "REF_CLS") {
							if (k[1].split("#").length === 1) {
								this._refreshAssignedClasses(k[1], true);
							} else {}
						} else if (k[0] === "REF_CHR") {
							var S = k[1].split("#");
							this._refreshCharacteristics(S, f);
						} else {}
					}.bind(this));
				}
			}
		},
		_refreshCharacteristics: function (s, d) {
			var m = this.getView().getModel(a.LOCAL_CLASSIFICATION_MODEL_NAME);
			d.forEach(function (o, i) {
				if (s.indexOf(o.ClassType) !== -1 && o.IsVisible) {
					m.setProperty("/ClassTypes/" + i + "/IsRefreshRequired", b.FULL_REFRESH);
				}
			});
		},
		_changeEditableState: function (e, d) {
			var v = this.getView();
			var o = v.getModel(a.CLASSIFICATION_COMPONENT_MODEL_NAME);
			var m = v.getModel(a.LOCAL_CLASSIFICATION_MODEL_NAME);
			if (e) {
				o.setProperty("/editable", true);
				m.setProperty("/IsRemoveOnly", false);
			} else {
				o.setProperty("/editable", false);
				m.setProperty("/IsRemoveOnly", true);
			}
			d.forEach(function (f, i) {
				if (f.IsVisible) {
					m.setProperty("/ClassTypes/" + i + "/IsRefreshRequired", b.REFRESH_RENDERING);
				}
			});
		},
		_setFirstVisibleItem: function () {
			var h;
			var f;
			var m = this.getView().getModel(a.LOCAL_CLASSIFICATION_MODEL_NAME);
			var d = m.getProperty("/ClassTypes");
			d.forEach(function (i, I) {
				if (i.IsVisible && !f) {
					m.setProperty("/ClassTypes/" + I + "/FirstVisible", true);
					f = true;
					h = true;
				} else {
					m.setProperty("/ClassTypes/" + I + "/FirstVisible", false);
				}
			});
			m.setProperty("/HasAssignedClasses", h);
		},
		_setDisableAddAssignment: function () {
			var v = this.getView();
			var m = v.getModel(a.LOCAL_CLASSIFICATION_MODEL_NAME);
			var d = m.getProperty("/ClassTypes");
			var D = true;
			d.some(function (o) {
				if (!o.DisableAddAssignment) {
					D = false;
					return true;
				}
				return false;
			});
			m.setProperty("/DisableAddAssignment", D);
		},
		_getDefaultModelData: function () {
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
		_getDefaultFeatureToggleModelData: function () {
			return {};
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/classification/localService/mockserver', ["sap/ui/core/util/MockServer"], function (M) {
	"use strict";
	var m, _ = "sap/i2d/lo/lib/zvchclfz/components/classification/",
		a = _ + "localService/mockdata";
	return {
		init: function (c) {
			var b = jQuery.extend({
				serverDelay: 100
			}, c || {});
			var u = jQuery.sap.getUriParameters(),
				j = jQuery.sap.getModulePath(a),
				s = jQuery.sap.getModulePath(_ + "manifestOPA", ".json"),
				e = "ClassTypeType",
				E = u.get("errorType"),
				d = E === "badRequest" ? 400 : 500,
				o = jQuery.sap.syncGetJSON(s).data;
			var f = o["sap.app"].dataSources.mainService,
				g = jQuery.sap.getModulePath(_ + f.settings.localUri.replace(".xml", ""), ".xml"),
				h = /.*\/$/.test(f.uri) ? f.uri : f.uri + "/";
			m = new M({
				rootUri: h
			});
			M.config({
				autoRespond: true,
				autoRespondAfter: (u.get("serverDelay") || b.serverDelay)
			});
			m.simulate(g, {
				sMockdataBaseUrl: j,
				bGenerateMissingMockData: true
			});
			var r = m.getRequests(),
				R = function (i, k, l) {
					l.response = function (x) {
						x.respond(i, {
							"Content-Type": "text/plain;charset=utf-8"
						}, k);
					};
				};
			if (u.get("metadataError")) {
				r.forEach(function (i) {
					if (i.path.toString().indexOf("$metadata") > -1) {
						R(500, "metadata Error", i);
					}
				});
			}
			if (E) {
				r.forEach(function (i) {
					if (i.path.toString().indexOf(e) > -1) {
						R(d, E, i);
					}
				});
			}
			r.push({
				method: "POST",
				path: new RegExp("ClassificationInstanceUnassign(.*)"),
				response: function (x, U) {
					var A = m.getEntitySetData("ClassificationInstanceSet");
					var I = U.indexOf("InstanceId") + 12;
					var k = U.substring(I, I + 4);
					var C = "";
					for (var i = 0; i < A.length; i++) {
						var l = A[i];
						if (l.InstanceId.toString() === k) {
							C = l.ClassType;
							A.splice(i, 1);
							break;
						}
					}
					var n = 0;
					for (i = 0; i < A.length; i++) {
						l = A[i];
						if (l.ClassType === C) {
							n++;
						}
					}
					if (!n) {
						A.push({
							ClassType: C,
							IsVisible: false
						});
					}
					m.setEntitySetData("ClassificationInstanceSet", A);
					var D = {
						d: {
							results: []
						}
					};
					x.respondJSON(200, {}, JSON.stringify(D));
				}
			});
			m.setRequests(r);
			m.start();
			jQuery.sap.log.info("Running the app with mock data");
		},
		getMockServer: function () {
			return m;
		}
	};
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/classification/service/AssignClassDialogService', ["sap/ui/core/Fragment",
	"sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/model/json/JSONModel", "sap/ui/table/Table",
	"sap/i2d/lo/lib/zvchclfz/common/Constants", "sap/i2d/lo/lib/zvchclfz/components/classification/service/ClassificationService",
	"sap/i2d/lo/lib/zvchclfz/components/classification/utils/Formatter"
], function (F, a, b, J, T, C, c, d) {
	"use strict";
	return {
		ASSIGN_CLASS_DIALOG_FRAGMENT_ID: "sap.i2d.lo.lib.zvchclfz.components.classification.view.fragments.AssignClassDialog",
		DIALOG_VIEW_MODEL_NAME: "assignClassDialogViewModel",
		TABLE_COLUMNS: [{
			label: "CLASS_TYPE",
			template: {
				parts: ["ClassType", "ClassTypeDescription"],
				formatter: d.formatClassType
			}
		}, {
			label: "CLASS_NAME",
			template: "{ClassName}"
		}, {
			label: "CLASS_DESCRIPTION",
			template: "{Description}"
		}, {
			label: "CLASS_STATUS_DESCRIPTION",
			template: "{Status/Description}"
		}],
		formatter: d,
		oBasicSearchField: undefined,
		oAssignClassDialog: undefined,
		open: function (v, e) {
			this.oAssignClassDialog = sap.ui.xmlfragment(this.ASSIGN_CLASS_DIALOG_FRAGMENT_ID, this.ASSIGN_CLASS_DIALOG_FRAGMENT_ID, this);
			v.addDependent(this.oAssignClassDialog);
			var B = v.getBindingContext(C.LOCAL_CLASSIFICATION_MODEL_NAME);
			var s = B && e ? B.getProperty("ClassType") : "";
			var r = v.getModel("i18n").getResourceBundle();
			var f = v.getModel().createKey("/ClassificationContextSet", {
				ContextId: c.getService().getContextId()
			});
			var V = new J({
				SelectedClassType: s
			});
			this.oAssignClassDialog.setModel(V, this.DIALOG_VIEW_MODEL_NAME);
			this.oAssignClassDialog.getFilterBar().setFilterBarExpanded(!!s);
			this._constructTable(this.oAssignClassDialog, r, s, f);
			this._setBasicSearch();
			this.oAssignClassDialog.open();
		},
		onAssignClassDialogCancel: function (e) {
			e.getSource().close();
		},
		onAssignClassDialogAfterClose: function (e) {
			e.getSource().destroy();
		},
		onAssignClassDialogOk: function (e) {
			var t = e.getParameter("tokens");
			var s = t[0].getProperty("key");
			this._transferSelectedContextData(e.getSource());
			c.getService().assignClass(s);
			e.getSource().close();
		},
		onAssignClassDialogSearch: function (e) {
			var f = [];
			var p = {};
			var t = this.oAssignClassDialog.getTable();
			var g = e.getSource().getFilterItems();
			var s = e.getParameter("selectionSet");
			var S = this.oBasicSearchField.getValue();
			var l = /^\*+|\*+$/g;
			var o = b.EQ;
			var h;
			if (g && s) {
				s.forEach(function (i, I) {
					var v;
					if (i.getValue) {
						v = i.getValue().trim();
					} else if (i.getSelectedKey) {
						v = i.getSelectedKey().trim();
					}
					if (v) {
						var j = v[0] === "*";
						var E = v[v.length - 1] === "*";
						if (j && E) {
							o = b.Contains;
						} else if (j && !E) {
							o = b.EndsWith;
						} else if (!j && E) {
							o = b.StartsWith;
						}
						h = v.replace(l, "");
						f.push(new a(g[I].getName(), o, h));
					}
				});
			}
			if (S) {
				p.custom = {
					search: S
				};
			}
			t.setFirstVisibleRow(0);
			t.bindRows({
				path: t.getBinding().getPath(),
				filters: f,
				parameters: p
			});
		},
		_constructTable: function (D, r, s, B) {
			var t = new T();
			var o = {
				path: B + "/Assignable"
			};
			t.setModel(D.getModel().getOriginModel());
			D.setTable(t);
			t.setNoData(r.getText("ASSIGNMENT_DIALOG_NODATA"));
			t.setEnableBusyIndicator(true);
			t.setBusyIndicatorDelay(500);
			t.setSelectionBehavior("Row");
			this.TABLE_COLUMNS.forEach(function (i) {
				t.addColumn(new sap.ui.table.Column({
					label: new sap.m.Label({
						text: r.getText(i.label)
					}),
					template: new sap.m.Text({
						text: i.template
					})
				}));
			});
			if (s) {
				o.filters = new a("ClassType", b.Contains, s);
			}
			t.bindRows(o);
		},
		_setBasicSearch: function () {
			var f = this.oAssignClassDialog.getFilterBar();
			this.oBasicSearchField = new sap.m.SearchField(F.createId(this.ASSIGN_CLASS_DIALOG_FRAGMENT_ID, "basicSearchField"), {
				search: function () {
					f.search();
				}
			});
			f.setBasicSearch(this.oBasicSearchField);
		},
		_transferSelectedContextData: function (D) {
			var t = D.getTable();
			var s = t.getSelectedIndex();
			var o = t.getBinding("rows").getContexts()[s];
			var p = o.getPath();
			var e = o.getModel().getProperty(p);
			D.getParent().getModel().storePreloadedData(e, p);
		}
	};
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/classification/service/ClassificationService', ["sap/ui/base/ManagedObject",
	"sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/i2d/lo/lib/zvchclfz/common/util/RequestQueue"
], function (M, F, a, C, R) {
	"use strict";
	var b = M.extend("sap.i2d.lo.lib.zvchclfz.components.classification.service.ClassificationService", {
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
		initialize: function (v) {
			if (this.bInitialized) {
				return;
			}
			this.oODataModel = v.getModel();
			this.oResourceBundle = v.getModel("i18n").getResourceBundle();
			this.oClassificationModel = v.getModel(C.LOCAL_CLASSIFICATION_MODEL_NAME);
			this.oComponentModel = v.getModel(C.CLASSIFICATION_COMPONENT_MODEL_NAME);
			if (this.oODataModel) {
				this.oODataModel.setDeferredGroup(C.VCHCLF_BATCH_GROUP);
			}
			this.bInitialized = true;
		},
		clear: function () {
			this.oODataModel = undefined;
			this.oResourceBundle = undefined;
			this.oClassificationModel = undefined;
			this.oComponentModel = undefined;
			this.bFeatureTogglesLoaded = false;
			this.bInitialized = false;
			this.sContextId = null;
			this.sDraftKey = null;
		},
		getContextId: function () {
			return this.sContextId;
		},
		getClassTypeByInstanceId: function (i) {
			var p = this.oODataModel.createKey("/ClassificationInstanceSet", {
				ContextId: this.getContextId(),
				InstanceId: i
			});
			var I = this.oODataModel.getProperty(p);
			return I.ClassType;
		},
		createClassificationContextId: function () {
			var c = this.getClassificationContextId(this.oComponentModel.getData());
			this.sContextId = c;
			this.sDraftKey = this.oComponentModel.getData().draftKey;
			this.fireClassificationContextChanged({
				contextId: c
			});
		},
		getClassificationContextId: function (c) {
			var e = c.uiMode !== "Display";
			var d = "CLF";
			if (c.semanticObject) {
				d += this._getTextWithLength("SEMANTIC_OBJ") + this._getTextWithLength(c.semanticObject);
			}
			if (c.objectKey) {
				d += this._getTextWithLength("OBJECT_KEY") + this._getTextWithLength(c.objectKey);
			}
			if (c.technicalObject) {
				d += this._getTextWithLength("TECHNICAL_OBJ") + this._getTextWithLength(c.technicalObject);
			}
			if (e && c.draftKey) {
				d += this._getTextWithLength("DRAFT_KEY") + this._getTextWithLength(c.draftKey);
			}
			if (e && c.draftKeyIsString) {
				d += this._getTextWithLength("DRAFT_KEY_IS_STR") + this._getTextWithLength("X");
			}
			return d;
		},
		handleActivationStatusChange: function () {
			var e = this.oComponentModel.getProperty("/extensionAPI");
			var t = e.getTransactionController();
			if (!this.bSaveListenerRegistered) {
				var A;
				if (t.hasOwnProperty("attachAfterActivate")) {
					A = t.attachAfterActivate;
				} else if (t.hasOwnProperty("attachAfterSave")) {
					A = t.attachAfterSave;
				}
				A(function (E) {
					this.oClassificationModel.setProperty("/IsActivationStatusChanged", true);
					E.activationPromise.then(null, function () {
						this.oClassificationModel.setProperty("/IsActivationStatusChanged", false);
						this.fireAssignedClassesChanged();
					}.bind(this));
				}.bind(this));
				this.bSaveListenerRegistered = true;
			}
			if (!this.bDiscardListenerRegistered) {
				t.attachAfterCancel(function (E) {
					this.oClassificationModel.setProperty("/IsActivationStatusChanged", true);
					E.discardPromise.then(null, function () {
						this.oClassificationModel.setProperty("/IsActivationStatusChanged", false);
						this.fireAssignedClassesChanged();
					}.bind(this));
				}.bind(this));
				this.bDiscardListenerRegistered = true;
			}
		},
		getClassificationSettings: function () {
			return new Promise(function (r, f) {
				this.oODataModel.facadeCallFunction("/GetClassificationSettings", undefined, undefined, C.VCHCLF_BATCH_GROUP, "GET").then(
					function (o) {
						var c = o.GetClassificationSettings.IsClassificationAllowed;
						r(c === "CLF=Allowed");
					}).catch(f);
			}.bind(this));
		},
		getAssignedClasses: function (c) {
			var f = [];
			if (c) {
				f.push(new F("ClassType", a.EQ, c));
			}
			return new Promise(function (r, d) {
				var p = this.oODataModel.createKey("/ClassificationContextSet", {
					ContextId: this.getContextId()
				});
				this.oODataModel.facadeRead(p + "/Assigned", {
					$expand: "CharacteristicsGroups,CharacteristicsGroups/Characteristics,CharacteristicsGroups/Characteristics/DomainValues,CharacteristicsGroups/Characteristics/AssignedValues",
					search: "SkipCharacteristics=0,TopCharacteristics=30"
				}, null, f, function (o) {
					var A = o.results;
					var e = this._groupAssignedClassesByClassTypes(A);
					var g = this._sortClassTypes(e);
					r(g);
				}.bind(this), d, C.VCHCLF_BATCH_GROUP);
				this._submitChanges();
			}.bind(this));
		},
		getAvailableClassTypes: function () {
			return new Promise(function (r, f) {
				var p = this.oODataModel.createKey("/ClassificationContextSet", {
					ContextId: this.getContextId()
				});
				this.oODataModel.facadeRead(p + "/ClassTypes", undefined, undefined, undefined, function (o) {
					var c = o.results;
					c.unshift({
						ClassType: "",
						ClassTypeDescription: ""
					});
					r(c);
				}, f, C.VCHCLF_BATCH_GROUP);
			}.bind(this));
		},
		assignClass: function (i) {
			var p = {
				ContextId: this.sContextId,
				InstanceId: i,
				DraftKey: this.sDraftKey
			};
			return this._callFunctionImport("/ClassificationInstanceAssign", p, true);
		},
		unassignClass: function (i) {
			var p = {
				ContextId: this.sContextId,
				InstanceId: i,
				DraftKey: this.sDraftKey
			};
			return this._callFunctionImport("/ClassificationInstanceUnassign", p);
		},
		readFeatureToggles: function () {
			if (!this.bFeatureTogglesLoaded) {
				return new Promise(function (r, f) {
					this.oODataModel.facadeRead("/ToggleSet", undefined, undefined, undefined, function () {
						this.bFeatureTogglesLoaded = true;
						r();
					}.bind(this), f, C.VCHCLF_BATCH_GROUP);
				}.bind(this));
			} else {
				return Promise.resolve();
			}
		},
		loadClassificationProposal: function (c) {
			var p = {
				ContextId: this.sContextId,
				ClassType: c
			};
			return R.add(this._callFunctionImport.bind(this, "/LoadClassificationProposal", p, false), this);
		},
		_submitChanges: function () {
			this.oODataModel.submitBatch(C.VCHCLF_BATCH_GROUP);
		},
		_callFunctionImport: function (f, p, i) {
			var e = this.oComponentModel.getProperty("/extensionAPI");
			var t;
			var c;
			var o = function () {
				return new Promise(function (O, d) {
					var g = function () {
						if (typeof p.ClassType !== "undefined") {
							c = p.ClassType;
						} else {
							c = this.getClassTypeByInstanceId(p.InstanceId);
						}
						var P = this.oODataModel.facadeCallFunction(f, p, undefined, C.VCHCLF_BATCH_GROUP);
						P.then(function () {
							O();
						}).catch(function () {
							d();
						});
						this.fireAssignedClassesChanged({
							classType: c,
							isAssigned: i
						});
						return P;
					}.bind(this);
					if (t && t.saveDraft) {
						t.saveDraft(g);
					} else {
						g();
					}
				}.bind(this));
			}.bind(this);
			if (e && e.securedExecution) {
				t = e.getTransactionController();
				return e.securedExecution(o);
			} else {
				return o();
			}
		},
		_groupAssignedClassesByClassTypes: function (A) {
			var g = {};
			var G = [];
			A.forEach(function (o) {
				var c = o.ClassType;
				if (!g[c]) {
					g[c] = {
						ClassType: c,
						Status: o.Status,
						Description: o.ClassTypeDescription,
						ContextId: o.ContextId,
						InstanceId: c,
						IsVisible: false,
						FirstVisible: false,
						IsRefreshRequired: "",
						EnableProposals: o.EnableProposals,
						DisableAddAssignment: o.DisableAddAssignment,
						DisableRemoveAssignment: o.DisableRemoveAssignment,
						SelectedInstanceKey: undefined,
						AssignedClasses: []
					};
				}
				if (o.ClassName) {
					if (g[c].AssignedClasses.length === 1) {
						g[c].AssignedClasses.splice(0, 0, {
							ClassName: this.oResourceBundle.getText("ALL_ASSIGNED_CLASSES"),
							InstanceId: c,
							ClassType: "",
							ContextId: o.ContextId
						});
					}
					g[c].IsVisible = true;
					g[c].AssignedClasses.push(o);
				}
			}.bind(this));
			for (var c in g) {
				if (g.hasOwnProperty(c)) {
					G.push(g[c]);
				}
			}
			return G;
		},
		_sortClassTypes: function (c) {
			c.sort(function (f, S) {
				if (f.ClassType < S.ClassType) {
					return -1;
				} else if (f.ClassType > S.ClassType) {
					return 1;
				}
				return 0;
			});
			return c;
		},
		_getTextWithLength: function (t) {
			return "(" + t.length + ")" + t;
		}
	});
	var s;
	return {
		getService: function () {
			if (!s) {
				s = new b();
			}
			return s;
		}
	};
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/classification/service/EnhancementService', ["sap/ui/base/ManagedObject",
	"sap/i2d/lo/lib/zvchclfz/common/Constants"
], function (M, C) {
	"use strict";
	var E = M.extend("sap.i2d.lo.lib.zvchclfz.components.classification.service.EnhancementService", {
		oComponentModel: undefined,
		bInitialized: false,
		initialize: function (v) {
			if (this.bInitialized) {
				return;
			}
			this.oComponentModel = v.getModel(C.CLASSIFICATION_COMPONENT_MODEL_NAME);
			this.bInitialized = true;
		},
		loadClassificationProposal: function () {
			return new Promise(function (r, R) {
				r({
					callDefaultImplementation: true
				});
			});
		},
		setBusy: function (b) {
			var S = b || true;
			this.oComponentModel.setProperty("/classificationBusy", S);
		}
	});
	var s;
	return {
		getService: function () {
			if (!s) {
				s = new E();
			}
			return s;
		}
	};
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/classification/utils/Constants', function () {
	return {
		FULL_REFRESH: "FullRefresh",
		REFRESH_RENDERING: "RefreshRendering"
	};
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/classification/utils/Formatter', [], function () {
	"use strict";
	return {
		formatClassType: function (c, C) {
			if (!c && C) {
				return C;
			} else if (c && !C) {
				return c;
			} else if (!c || !C) {
				return "";
			}
			return C + " (" + c + ")";
		},
		formatStatusState: function (s) {
			switch (s) {
			case "W":
				return "Warning";
			case "E":
				return "Error";
			default:
				return "None";
			}
		},
		formatStatusText: function (s) {
			if (!s || s.IsReleased || !s.LongDescription) {
				return "";
			}
			return s.LongDescription;
		}
	};
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/classification/utils/PropertyBindingHandler', function () {
	return {
		aPropertyBindings: [],
		addPropertyBinding: function (p) {
			this.aPropertyBindings.push(p);
		},
		clearPropertyBindings: function () {
			this.aPropertyBindings.forEach(function (p) {
				p.destroy();
			});
			this.aPropertyBindings = [];
		}
	};
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/configuration/BaseConfigurationComponent', ["jquery.sap.global",
	"sap/i2d/lo/lib/zvchclfz/common/util/XMLFragmentCache", "sap/i2d/lo/lib/zvchclfz/common/type/InspectorMode", "sap/ui/core/UIComponent",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/dao/ConfigurationDAO",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/dao/PersonalizationDAO", "sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/ui/model/json/JSONModel", "sap/i2d/lo/lib/zvchclfz/components/configuration/type/EmbeddingMode",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/type/VariantMatchingMode",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/type/GroupRepresentation", "sap/i2d/lo/lib/zvchclfz/common/util/CommandManager",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/HeaderField", "sap/i2d/lo/lib/zvchclfz/components/configuration/HeaderConfiguration",
	"sap/i2d/lo/lib/zvchclfz/common/util/Toggle", "sap/i2d/lo/lib/zvchclfz/common/factory/ODataFacadeModelFactory",
	"sap/i2d/lo/lib/zvchclfz/common/odataFacade/ODataFacadeModel", "sap/ui/model/odata/v4/ODataModel", "sap/ui/base/ManagedObject",
	"sap/m/Button"
], function (q, X, I, U, C, P, a, J, E, V, G, b, H, c, T, O, d, f, M, B) {
	"use strict";
	var g = {
		CREATE: "Create",
		EDIT: "Edit",
		DISPLAY: "Display"
	};
	var h = {
		SEMANTIC_OBJ: "semanticObject",
		OBJECT_KEY: "objectKey",
		TECHNICAL_OBJ: "technicalObject",
		DRAFT_KEY: "draftKey",
		DRAFT_KEY_IS_STR: "draftKeyIsString",
		EMBEDDING_MODE: "embeddingMode",
		LEGACY_SCENARIO: "legacyScenario",
		UI_MODE: "embeddingUiMode"
	};
	var j = "VCH";
	return U.extend("sap.i2d.lo.lib.zvchclfz.components.configuration.BaseConfigurationComponent", {
		metadata: {
			manifest: "json",
			properties: {
				uiMode: {
					type: "string",
					group: "standard",
					defaultValue: g.DISPLAY
				},
				embeddingUiMode: {
					type: "string",
					group: "standard",
					hidden: true
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
				embeddingMode: {
					type: "sap.i2d.lo.lib.zvchclfz.components.configuration.type.EmbeddingMode",
					defaultValue: E.Configuration
				},
				enableChangeDocumentsButton: {
					type: "boolean",
					defaultValue: true
				},
				showPricingInfo: {
					type: "boolean",
					defaultValue: true
				},
				internalNavSettings: {
					type: "object",
					defaultValue: {}
				}
			},
			events: {
				noBOMApplicationForBOMNavigation: {},
				bomCannotBeFoundForBOMNavigation: {},
				preferredVariantSelected: {},
				handedoverToEngineering: {},
				reviewAccepted: {},
				configurationContextReloaded: {}
			},
			aggregations: {
				headerConfiguration: {
					type: "sap.i2d.lo.lib.zvchclfz.components.configuration.HeaderConfiguration",
					altTypes: ["sap.i2d.lo.lib.zvchclfz.components.configuration.HeaderConfiguration"],
					multiple: false
				},
				valuationComponent: {
					type: "sap.i2d.lo.lib.zvchclfz.components.valuation.Component",
					multiple: false,
					hidden: true
				},
				structurePanelComponent: {
					type: "sap.i2d.lo.lib.zvchclfz.components.structurepanel.Component",
					multiple: false,
					hidden: true
				},
				inspectorComponent: {
					type: "sap.i2d.lo.lib.zvchclfz.components.inspector.Component",
					multiple: false,
					hidden: true
				},
				footer: {
					type: "sap.m.IBar",
					altTypes: ["sap.m.IBar"],
					multiple: false
				}
			},
			publicMethods: ["reload", "resetConfiguration", "lockConfiguration", "unlockConfiguration", "resetInspector", "resetTrace",
				"saveTraceState", "restoreTraceState", "resetStructurePanel", "validateConfiguration", "updateConfigObjectBindingContext"
			]
		},
		_oConfigurationDAO: null,
		_oFooter: null,
		_oConfigurationView: null,
		_oValuationComponent: null,
		_bRequestAttachedForSetBusy: false,
		_iRequestCount: 0,
		_bIsMultiLevel: false,
		_oInstanceArea: null,
		_oContextLoadedDeferred: null,
		_oPreloadedGroup: null,
		init: function () {
			U.prototype.init.apply(this);
			this._oContextLoadedDeferred = $.Deferred();
		},
		applySettings: function (s, S) {
			U.prototype.applySettings.apply(this, [s, S]);
			var e = ["embeddingMode", "enableChangeDocumentsButton", "showPricingInfo"];
			for (var i = 0; i < e.length; i++) {
				this.getConfigurationSettingsModel().setProperty("/" + e[i], this.getProperty(e[i]));
			}
		},
		_applyNonParameterDefaults: function () {
			this.getConfigurationSettingsModel().setProperty("/triggerForDependencyLinkFactory", [0]);
			this.getConfigurationSettingsModel().setProperty("/showHiddenCharacteristics", false);
			this.getConfigurationSettingsModel().setProperty("/hasSettings", this._oPersonalizationDAO !== null);
			this.getConfigurationSettingsModel().setProperty("/StructurePanelIsVisible", false);
			this.getConfigurationSettingsModel().setProperty("/variantMatchingMode", 0);
			this.getConfigurationSettingsModel().setProperty("/inconsistencyPopupActive", false);
			this.getConfigurationSettingsModel().setProperty("/variantMatchingMenuButton", true);
		},
		contextLoaded: function () {
			return this._oContextLoadedDeferred;
		},
		setModel: function (m, i) {
			if (i === a.VCHCLF_MODEL_NAME) {
				if (!(this.getModel(a.VCHCLF_MODEL_NAME) instanceof d)) {
					if (!(m instanceof d)) {
						m = O.createFacadeModel(m, ["/ConfigurationInstanceSet", "/ConfigurationMaterialVariantSet", "/ConfigurationContextSet",
							"/CharacteristicSet", "/CharacteristicsGroupSet", "/CalculateAlternativeValues"
						], this._getView.bind(this));
					}
					U.prototype.setModel.apply(this, [m, i]);
					U.prototype.setModel.apply(this, [m.getOriginModel(), "vchclf_bind_only"]);
				}
			} else {
				U.prototype.setModel.apply(this, [m, i]);
			}
			return m;
		},
		_getInspectorVisibility: function () {
			return this._getLayout() && this._getLayout().getShowRightContent();
		},
		updateInstance: function (o) {
			var p = new Promise(function (r, R) {
				var e = this.getModel(a.HEADER_CONFIGURATION_MODEL_NAME);
				var D = this.getModel(a.VCHCLF_MODEL_NAME);
				var A;
				if (o && !q.isEmptyObject(o)) {
					this._showNotConfigurableItemView(false);
					var i = D.createKey("ConfigurationInstanceSet", o);
					var n = "/" + i;
					if (this._sConfigurationInstancePath !== n || this._bCharacteristicValueChanged) {
						A = true;
						this._oValuationComponent.setRootBindingPath(n, true).then(function () {
							r();
						});
						this._bCharacteristicValueChanged = false;
					} else {
						A = false;
						this.setValuationBusy(false);
					}
					this._sConfigurationInstancePath = n;
					var k = this.getAggregation("rootControl").byId("singleInstanceHeader");
					var l = {
						path: n,
						model: a.VCHCLF_MODEL_NAME
					};
					if (this.isMultiLevel()) {
						k.bindElement(l);
					} else {
						k.unbindElement(a.VCHCLF_MODEL_NAME);
					}
				} else {
					this._showNotConfigurableItemView(true);
				}
				var m = e.getProperty("/config/instance");
				if (m) {
					m.instanceId = o.Material;
					m.instanceDescr = o.MaterialDescription;
					if (!this.oInstanceStatus) {
						this.oInstanceStatus = {
							properties: {
								id: "InstanceHeaderConfigStatus",
								text: "{vchclf>StatusDescription}",
								state: sap.ui.core.ValueState.Success
							},
							controlType: "ObjectStatus"
						};
						m.instanceHeaderFields.push(this.oInstanceStatus);
					}
					e.setProperty("/config/instance", m);
				}
				if (!A) {
					r();
				}
			}.bind(this));
			return p;
		},
		_onShowLayoutContent: function (p, e) {
			var s = e.getParameter("show");
			var m = this.getConfigurationSettingsModel();
			if (m) {
				m.setProperty(p, s);
			}
			this._savePersonalizationDAO();
		},
		_savePersonalizationDAO: function () {
			var m = this.getConfigurationSettingsModel();
			var D = m.getData();
			var p = this.getPersonalizationDAO();
			if (p) {
				return p.setDataWithoutChangeEvent(D);
			} else {
				return null;
			}
		},
		_getLayout: function () {
			return this._oConfigurationView && this._oConfigurationView.byId("layout");
		},
		_getView: function () {
			return this._oConfigurationView;
		},
		_highlightCharacteristic: function (e) {
			var p = "/" + e.getParameter("csticPath");
			var v = this.getValuationComponent();
			v.highlightCharacteristic(p);
		},
		_setBusy: function (e) {
			if (this._oConfigurationView && this._oConfigurationView.getBusy() !== e) {
				if (e === true) {
					this._oConfigurationView.setBusyIndicatorDelay(0);
				}
				this._oConfigurationView.setBusy(e);
			}
		},
		_checkMandatoryProperties: function () {
			return (!!this.getObjectKey() || !!this.getDraftKey());
		},
		_getResourceBundle: function () {
			if (!this.vchI18nResourceBundle) {
				this.vchI18nResourceBundle = this.getModel("vchI18n").getResourceBundle();
			}
			return this.vchI18nResourceBundle;
		},
		_setFullMatchingVariantHeaderField: function () {
			if (this._variantMatchingIndicator === V.MatchingWithoutSelection || this._variantMatchingIndicator === V.MatchingWithSelection) {
				var o = this.getModel(a.HEADER_CONFIGURATION_MODEL_NAME);
				this._oConfigurationDAO.readFullMatchingVariants(this._aConfigurationInstances[0].ContextId, this._aConfigurationInstances[0].InstanceId)
					.then(function (v) {
						var s = "";
						var t = this._getResourceBundle().getText("FULL_MATCHES");
						switch (v.results.length) {
						case 0:
							s = "\u2013";
							break;
						case 1:
							s = v.results[0].Product;
							break;
						default:
							s = v.results.length + " " + t;
						}
						o.setProperty("/headerFieldVariantBusy", false);
						o.setProperty("/fullMatchingVariants", s);
					}.bind(this));
			}
		},
		_openStructurePanelInitiallyIfNoUserPersAvailable: function (p) {
			p.getData().then(function (D) {
				if (D.StructurePanelButtonPressed === null) {
					this._getLayout().setShowLeftContent(true);
				}
			}.bind(this));
		},
		_registerStructurePanelEvents: function () {
			this._oStructurePanelComponent.attachInspectObject(function (e) {
				var p = e.getParameters();
				this._oInspectorComponent.inspectObject(p.objectPath, p.objectType, p.inspectorTab);
			}.bind(this));
			this._oStructurePanelComponent.attachReferenceCharacteristicSelected(function (e) {});
			this._oStructurePanelComponent.attachClosePanelPressed(function () {
				this.getAggregation("rootControl").getController().onToggleLeftPanel();
			}.bind(this));
			this._oStructurePanelComponent.attachBOMExplosionFinished(function () {
				if (this._oInspectorComponent) {
					this._oInspectorComponent.triggerTraceFetch();
					this._oInspectorComponent.refreshBOMItem();
				}
			}.bind(this));
			this._oStructurePanelComponent.attachBOMExplosionTriggered(function (e) {
				var i = e.getParameter("isMultiLevel");
				if (i) {
					this.setValuationBusy(true);
					this.getConfigurationDAO().readConfigurationContext(this.buildContextId());
				}
			}.bind(this));
			this._oStructurePanelComponent.attachRoutingExplosionFinished(function () {
				if (this._oInspectorComponent) {
					this._oInspectorComponent.triggerTraceFetch();
					this._oInspectorComponent.refreshRoutingItem();
					this._oInspectorComponent.refreshBOMItem();
				}
			}.bind(this));
			this._oStructurePanelComponent.attachNavigationToBOMCanNotBeFound(function () {
				this.fireBomCannotBeFoundForBOMNavigation(arguments);
				var v = this.getValuationComponent().getRootControl();
				v.setBusy(false);
			}.bind(this));
			this._oStructurePanelComponent.attachConfigurableItemSelectionChanged(function (e) {
				this.setValuationBusy(true);
			}.bind(this));
			this._oStructurePanelComponent.attachConfigurableItemSelected(function (e) {
				var o = e.getParameter("oConfigurationInstance");
				this._oConfigurationDAO.addToRequestQueue(function () {
					return new Promise(function (r, R) {
						r();
						this.updateInstance(o);
					}.bind(this));
				}, this);
				this._oInspectorComponent.restrictComparisonView(o);
			}.bind(this));
			this._oStructurePanelComponent.attachBOMComponentDeleted(function (e) {
				var o = e.getParameter("objectPath");
				if (this._oInspectorComponent.isObjectInspected(o, I.objectType.BOMComponent)) {
					this._oInspectorComponent.inspectObject(this._oStructurePanelComponent.getRootBOMComponentPath(), I.objectType.BOMComponent,
						null, null, true);
				}
			}.bind(this));
		},
		setValuationBusy: function (e) {
			var v = this.getValuationComponent().getRootControl();
			v.setBusyIndicatorDelay(0);
			v.setBusy(e);
		},
		_registerInspectorEvents: function () {
			this._oInspectorComponent.attachClosePanelPressed(function () {
				this.getAggregation("rootControl").getController().onToggleSidePanel();
			}.bind(this));
			this._oInspectorComponent.attachTraceInitiallyActive(function () {
				this._getLayout().setShowRightContent(true);
			}.bind(this));
			this._oInspectorComponent.attachNavigationToBOMwithoutBOMApp(function () {
				this.fireNoBOMApplicationForBOMNavigation(arguments);
			}.bind(this));
			this._oInspectorComponent.attachNavigationToBOMCanNotBeFound(function () {
				this.fireBomCannotBeFoundForBOMNavigation(arguments);
			}.bind(this));
			this._oInspectorComponent.attachOpenPanel(function () {
				this._getLayout().setShowRightContent(true);
			}.bind(this));
		},
		_isCalculatePricingRequired: function () {
			return this._isPriceVisible() && this.getUiMode() !== g.DISPLAY;
		},
		inspectCharacteristic: function (p, o, k) {
			if (this._oInspectorComponent) {
				this._oInspectorComponent.inspectObject(p, I.objectType.Characteristic, o ? I.inspectorTab.properties : null, k);
			}
		},
		inspectObjectDependency: function (o) {
			if (this._oInspectorComponent) {
				this._oInspectorComponent.openDependencyDetails(o);
			}
		},
		_registerValuationEvents: function () {
			this._oValuationComponent.attachCharacteristicSelected(function (e) {
				this.inspectCharacteristic(e.getParameter("path"));
			}.bind(this));
			this._oValuationComponent.attachCharacteristicValueChanged(function (e) {
				this._bCharacteristicValueChanged = true;
				var p = e.getParameter("characteristicPath");
				var s = this.getModel(a.VCHCLF_MODEL_NAME).getProperty(p).ContextId;
				if (this._isCalculatePricingRequired()) {
					this.getConfigurationDAO().calculatePricing(s);
				}
				this.getConfigurationDAO().readConfigurationContext(s).then(function (r) {
					if (r.InconsistencyInformation && r.InconsistencyInformation.results) {
						this._handleInconsistencyInformation(r.InconsistencyInformation.results);
					}
				}.bind(this));
				this.getModel(a.HEADER_CONFIGURATION_MODEL_NAME).setProperty("/headerFieldVariantBusy", true);
			}.bind(this));
			this._oValuationComponent.attachCharacteristicsChanged(function (e) {
				this._oInspectorComponent.refreshCharacteristicValues(e.getParameter("changedCharacteristics"));
			}.bind(this));
			this._oValuationComponent.attachCharacteristicChanged(function () {
				this._oInspectorComponent.triggerTraceFetch();
				this._setFullMatchingVariantHeaderField();
			}.bind(this));
			this._oValuationComponent.attachCollectPreloadedCharacteristicGroup(function (e) {
				if (!this._oPreloadedGroup) {
					return;
				}
				var p = this._oPreloadedGroup.results;
				if (p.length === 0) {
					return;
				}
				var F = p[0];
				var s = F.ContextId + "," + F.InstanceId + "," + F.GroupId;
				var o = e.getParameters().preloadedCharacteristicGroup;
				var i = o.sContextId + "," + o.sInstanceId + "," + o.iGroupId;
				if (s === i) {
					o.aCharacteristics = p;
					this._oPreloadedGroup = null;
				}
			}.bind(this));
		},
		_getDynamicPage: function () {
			return this._oConfigurationView.byId("dynamicPage");
		},
		_isRequestRelevantForBusy: function (e) {
			var u = e.getParameter("url");
			return u.indexOf("CharacteristicsGroupSet") === 0 && u.indexOf("/Characteristics") > 0;
		},
		_onRequestSent: function (e) {
			if (e.getParameters().method !== 'GET' || this._isRequestRelevantForBusy(e)) {
				this._iRequestCount++;
				this._setBusy(true);
			}
		},
		_onRequestCompleted: function (e) {
			if (e.getParameters().method !== 'GET' || this._isRequestRelevantForBusy(e)) {
				this._iRequestCount--;
				if (this._iRequestCount === 0) {
					this._setBusy(false);
					this.detachBusyIndicatorEvents();
				}
			}
		},
		_syncPersonalizationWithSettingsModel: function () {
			var p = this.getPersonalizationDAO();
			if (p) {
				p.setItemKey(this.getSemanticObject());
				p.getData().then(function (D) {
					this.getConfigurationSettingsModel().setData(D, true);
					this._updatePanelsVisibility(D);
				}.bind(this));
			}
		},
		_syncPersonalizationWithSplitter: function () {
			var p = this.getPersonalizationDAO();
			if (p) {
				p.getData().then(function (D) {
					this._updatePanelsVisibility(D);
				}.bind(this));
			}
		},
		_updatePanelsVisibility: function (D) {
			var s = this._getLayout();
			if (!s) {
				return;
			}
			var u = s.getShowRightContent() !== D.InspectorButtonPressed;
			if (u) {
				s.setShowRightContent(D.InspectorButtonPressed);
			}
			var o = this.getBindingContext(a.VCHCLF_MODEL_NAME);
			if (!o) {
				return;
			}
			var e = this._isStructurePanelEnabled(o.getObject()) && (s.getShowLeftContent() !== D.StructurePanelButtonPressed);
			if (e) {
				var i = D.StructurePanelButtonPressed === null;
				var S = i ? (this.isMultiLevel() && i) : D.StructurePanelButtonPressed;
				s.setShowLeftContent(S);
			}
		},
		isMultiLevel: function () {
			return this._bIsMultiLevel;
		},
		setIsMultiLevel: function (i) {
			this._bIsMultiLevel = i;
		},
		_onPersonalizationChanged: function () {
			this._syncPersonalizationWithSettingsModel();
		},
		_decodeString: function (e) {
			var D = decodeURIComponent(e);
			if (D === e) {
				return D;
			} else {
				return this._decodeString(D);
			}
		},
		_createConfigurationDAO: function () {
			return new C({
				dataModel: this.getModel(a.VCHCLF_MODEL_NAME)
			});
		},
		_getConfigurationContextData: function () {
			return {
				SemanticObj: this.getSemanticObject(),
				ObjectKey: this.getObjectKey(),
				DraftKey: this.getDraftKey(),
				TechnicalObj: "",
				DraftKeyIsString: this.getDraftKeyIsString(),
				ECN: "",
				ContextId: this.buildContextId()
			};
		},
		_createConfigurationContextAndBindingContext: function (m) {
			this.attachBusyIndicatorEvents();
			if (!this._checkMandatoryProperties()) {
				return;
			}
			this.setIsMultiLevel(false);
			this._showErrorPage(false);
			return this._oConfigurationDAO.addToRequestQueue(function () {
				return new Promise(function (r, R) {
					r();
					this.getModel(a.VCHCLF_MODEL_NAME).metadataLoaded().then(function () {
						var p = [];
						var o = this._oConfigurationDAO.readConfigurationContext(m.ContextId, true).then(function (i) {
							this._evaluateEtoState(i);
							this._setVariantMatchingIndicator(i.VariantMatchingIndicator);
							this._setPricingIndicator(i.PricingActive);
							if (this._isCalculatePricingRequired()) {
								this._oConfigurationDAO.calculatePricing(m.ContextId);
							}
							if (i.InconsistencyInformation && i.InconsistencyInformation.results) {
								this._handleInconsistencyInformation(i.InconsistencyInformation.results);
							}
							var k = i.Instances;
							var l;
							this._oValuationComponentContainer.setComponent(this._oValuationComponent);
							if (k && k.results && k.results.length) {
								var n = k.results;
								this._oValuationComponent.setGroupCount(n[0].CharacteristicsGroups.results.length);
								this._aConfigurationInstances = n;
								l = n[0];
								this.setIsMultiLevel(i.IsStrucConfigblItemAvailable);
							} else {
								q.sap.log.error("No configuration instance found for context ID: " + m.ContextId);
							}
							this._setFullMatchingVariantHeaderField();
							return [i, l];
						}.bind(this));
						p.push(o);
						this._oConfigurationDAO.readFeatureToggles();
						var e = this._oValuationComponent.preloadGroup(m.ContextId);
						p.push(e);
						Promise.all(p).then(function (i) {
							var k = i[0][0];
							var F = i[0][1];
							var l = i[1];
							if (l && l.results) {
								this._oPreloadedGroup = l;
							}
							this.attachBusyIndicatorEvents();
							if (k && F) {
								this.updateInstance(F);
								this._setBindingContextForConfigurationContext(k);
								var s = this.buildContextId();
								var n = this._isStructurePanelEnabled(k);
								if (n) {
									this._oStructurePanelComponent.setIsBOMChangeAllowed(k.UISettings.IsBOMChangeAllowed);
									this._oStructurePanelComponent.updateConfigurationContextId(s, k);
									this.getConfigurationSettingsModel().setProperty("/StructurePanelIsVisible", true);
									this._syncPersonalizationWithSplitter();
								} else {
									this.getConfigurationSettingsModel().setProperty("/StructurePanelIsVisible", false);
								}
								this._oInspectorComponent.updateConfigurationContextId(s, F.InstanceId, k, n);
							}
						}.bind(this)).catch(function (i) {
							this._showErrorPage(true);
						}.bind(this));
					}.bind(this));
				}.bind(this));
			}, this);
		},
		_isStructurePanelEnabled: function (o) {
			return this._oStructurePanelComponent && this._oStructurePanelComponent.isStructurePanelEnabled(o);
		},
		_setVariantMatchingIndicator: function (o) {
			if (o === V.MatchingWithSelection && this.getUiMode() === g.DISPLAY) {
				this.getConfigurationSettingsModel().setProperty("/variantMatchingMode", V.MatchingWithoutSelection);
				this._variantMatchingIndicator = V.MatchingWithoutSelection;
			} else {
				this.getConfigurationSettingsModel().setProperty("/variantMatchingMode", o);
				this._variantMatchingIndicator = o;
			}
		},
		_setPricingIndicator: function (o) {
			this._pricingIndicator = o;
			var i = o === "X";
			this.getConfigurationSettingsModel().setProperty("/pricingActive", i);
		},
		_handleInconsistencyInformation: function (e) {
			if (e.length === 0) {
				this.getConfigurationSettingsModel().setProperty("/inconsistencyPopupActive", false);
				return;
			}
			for (var i = 0; i < e.length; i++) {
				var o = e[i];
				if (o.DependencyId) {
					this.getConfigurationSettingsModel().setProperty("/inconsistencyPopupActive", true);
					break;
				} else {
					this.getConfigurationSettingsModel().setProperty("/inconsistencyPopupActive", false);
				}
			}
		},
		_isPriceVisible: function () {
			return !!this._pricingIndicator;
		},
		_showErrorPage: function (s) {
			var o = this.getAggregation("rootControl");
			if (o) {
				o.byId("errorPage").setVisible(s);
				o.byId("dynamicPage").setVisible(!s);
			}
		},
		_showNotConfigurableItemView: function (s) {
			var o = this.getAggregation("rootControl");
			var l = o.byId("layout");
			if (!this._oNotConfigurableItemView) {
				this._oNotConfigurableItemView = sap.ui.xmlview({
					viewName: "sap.i2d.lo.lib.zvchclfz.components.configuration.view.NotConfigurableItem"
				});
			}
			var n = s ? this._oNotConfigurableItemView : this._oInstanceArea;
			l.setMiddleContent(n);
		},
		_setBindingContextForConfigurationContext: function (o) {
			var m = this.getModel(a.VCHCLF_MODEL_NAME);
			var p = "/" + m.getKey(o);
			m.createBindingContext(p, null, null, function (e) {
				this.setBindingContext(e, a.VCHCLF_MODEL_NAME);
				this._oContextLoadedDeferred.resolve(e.getObject());
			}.bind(this));
		},
		_updateObjectKey: function () {
			var o = "";
			if (!this.getInternalNavSettings()) {
				return;
			}
			var k = this.getInternalNavSettings().keyFields;
			var e = this.getBindingContext().getObject();
			var K = k.length - 1;
			k.forEach(function (s, i) {
				var l = this.getInternalNavSettings().multipleKeyFieldsSeparator;
				if ((i === 0 && K === 0) || i === K) {
					l = "";
				}
				if (s && e[s]) {
					o = o + e[s] + l;
				}
			}.bind(this));
			if (!o) {
				q.sap.log.error("No Object Key available - object key was not provided by caller");
			}
			if (o !== this.getObjectKey()) {
				this.setObjectKey(o);
			}
		},
		_setETOStatus: function (e) {
			var o = this.getRootControl();
			var i = this.getBindingContext(a.VCHCLF_MODEL_NAME).getObject();
			var s = i.StatusType;
			if (s === a.CONFIGURATION_STATUS_TYPE.INCOMPLETE || s === a.CONFIGURATION_STATUS_TYPE.INCONSISTENT) {
				this.lockConfiguration();
			}
			o.setBusyIndicatorDelay(0);
			o.setBusy(true);
			var k = i.ContextId;
			var l = this.getConfigurationDAO();
			return l.setETOStatus(k, e);
		},
		_openDialog: function (D, o, e) {
			if (this.oDialog) {
				this.oDialog.destroy();
				delete this.oDialog;
			}
			var _ = function (p) {
				if (p) {
					return function () {
						p.call(this, arguments);
						this.oDialog.close();
					}.bind(this);
				} else {
					return function () {
						this.oDialog.close();
					}.bind(this);
				}
			}.bind(this);
			var i = _(o);
			var k = _(e);
			var l = this.getRootControl();
			var F = l.getController().getFactoryBase();
			this.oDialog = F.createFragment(l.getId(), D, this);
			var m = this.oDialog.getAggregation("beginButton");
			m.attachPress(i);
			var n = this.oDialog.getAggregation("endButton");
			n.attachPress(k);
			l.addDependent(this.oDialog);
			this.oDialog.open();
		},
		_openReviseEngineeringChangesDialog: function () {
			var F = "sap.i2d.lo.lib.zvchclfz.components.configuration.view.fragment.ReviseEngineeringChangesDialog";
			var o = function () {
				var e = this.getRootControl();
				e.setBusyIndicatorDelay(0);
				e.setBusy(true);
				var i = this.getBindingContext(a.VCHCLF_MODEL_NAME);
				var s = i.getObject().ContextId;
				var k = this.getConfigurationDAO();
				k.setETOStatus(s, a.ETO_STATUS.REVISED_BY_SALES).then(function () {
					this._setUiMode("Edit");
					this.reload();
				}.bind(this));
			};
			this._openDialog(F, o);
		},
		_openSetETOStatusDialog: function (e) {
			var F = "sap.i2d.lo.lib.zvchclfz.components.configuration.view.fragment.SetETOStatusDialog";
			var o = function () {
				this._setETOStatus(e).then(function () {
					if (e === a.ETO_STATUS.READY_FOR_ENGINEERING || e === a.ETO_STATUS.REENGINEERING_NEEDED) {
						var i = this.getRootControl();
						i.setBusy(false);
						this.fireHandedoverToEngineering();
					} else {
						this.reload();
					}
				}.bind(this));
			};
			this._openDialog(F, o);
		},
		_openAcceptReviewDialog: function () {
			var F = "sap.i2d.lo.lib.zvchclfz.components.configuration.view.fragment.AcceptReviewDialog";
			var o = function () {
				var e = this.getRootControl();
				e.setBusyIndicatorDelay(0);
				e.setBusy(true);
				var i = this.getBindingContext(a.VCHCLF_MODEL_NAME);
				var s = i.getObject().ContextId;
				var k = this.getConfigurationDAO();
				k.setETOStatus(s, a.ETO_STATUS.REVIEW_FINISHED_BY_SALES).then(this.fireReviewAccepted.bind(this));
			};
			this._openDialog(F, o);
		},
		_addHandoverToEngBtnToFooter: function (F) {
			var o = new B({
				id: F.getId() + "--handoverToEngineeringButton",
				text: "{vchI18n>HANDOVER_TO_ENGINEERING_BUTTON}",
				type: sap.m.ButtonType.Emphasized,
				visible: "{parts: [{path: 'vchclf>EtoStatus'}, {path: 'configurationSettings>/editable'}], formatter: 'sap.i2d.lo.lib.zvchclfz.components.configuration.formatter.HeaderFieldFormatter.getHandoverToEngineeringButtonVisible'}",
				press: this._openSetETOStatusDialog.bind(this, a.ETO_STATUS.READY_FOR_ENGINEERING)
			});
			this._appendFooterContentAfterToolbarSpacerAtPosition(F, 1, o);
		},
		_addHandBackToEngBtnToFooter: function (F) {
			var o = new B({
				id: F.getId() + "--handBackToEngineeringButton",
				text: "{vchI18n>HAND_BACK_TO_ENGINEERING}",
				type: sap.m.ButtonType.Emphasized,
				visible: "{parts: [{path: 'vchclf>EtoStatus'}, {path: 'configurationSettings>/editable'}], formatter: 'sap.i2d.lo.lib.zvchclfz.components.configuration.formatter.HeaderFieldFormatter.getHandBackToEngineeringButtonVisible'}",
				press: this._openSetETOStatusDialog.bind(this, a.ETO_STATUS.REENGINEERING_NEEDED)
			});
			this._appendFooterContentAfterToolbarSpacerAtPosition(F, 1, o);
		},
		_addAcceptReviewBtnToFooter: function (F) {
			var A = new B({
				id: F.getId() + "--acceptReviewButton",
				text: "{vchI18n>ACCEPT_REVIEW_BUTTON}",
				type: sap.m.ButtonType.Accept,
				visible: "{parts: [{path: 'vchclf>EtoStatus'}, {path: 'configurationSettings>/embeddingUiMode'}], formatter: 'sap.i2d.lo.lib.zvchclfz.components.configuration.formatter.HeaderFieldFormatter.getAcceptReviewButtonVisible'}",
				press: this._openAcceptReviewDialog.bind(this)
			});
			this._appendFooterContentAfterToolbarSpacerAtPosition(F, 1, A);
		},
		_addReviseChangesBtnToFooter: function (F) {
			var r = new B({
				id: F.getId() + "--reviseChangesButton",
				text: "{vchI18n>REVISE_CHANGES_BUTTON}",
				type: sap.m.ButtonType.Reject,
				visible: "{parts: [{path: 'vchclf>EtoStatus'}, {path: 'configurationSettings>/embeddingUiMode'}], formatter: 'sap.i2d.lo.lib.zvchclfz.components.configuration.formatter.HeaderFieldFormatter.getReviseChangesButtonVisible'}",
				press: this._openReviseEngineeringChangesDialog.bind(this)
			});
			this._appendFooterContentAfterToolbarSpacerAtPosition(F, 2, r);
		},
		_appendFooterContentAfterToolbarSpacerAtPosition: function (F, p, o) {
			var e = F.getAggregation("content");
			var t = 0;
			e.forEach(function (o, i) {
				if (o.getMetadata().getName() === "sap.m.ToolbarSpacer") {
					t = i;
				}
			});
			e.splice(t + p, 0, o);
			F.removeAllContent();
			e.forEach(function (o) {
				F.addContent(o);
			});
		},
		buildContextIdForInternalNavigation: function () {
			this._updateObjectKey();
			return this.buildContextId();
		},
		exit: function () {
			if (this._oNotConfigurableItemView) {
				this._oNotConfigurableItemView.destroy();
				this._oNotConfigurableItemView = null;
			}
			this._oContextLoadedDeferred = null;
			this._oInstanceArea = null;
			this._oConfigurationView = null;
			this._oFooter = null;
			this._oValuationComponent = null;
			this._oConfigurationDAO = null;
			b.reset();
		},
		lockConfiguration: function () {
			return this._oConfigurationDAO.lockConfiguration(this.buildContextId());
		},
		unlockConfiguration: function () {
			return this._oConfigurationDAO.unlockConfiguration(this.buildContextId());
		},
		getConfigurationSettingsModel: function () {
			return this.getModel(a.CONFIGURATION_SETTINGS_MODEL_NAME);
		},
		createContent: function () {
			this._oConfigurationView = sap.ui.view({
				id: this.createId("configurationView"),
				viewName: "sap.i2d.lo.lib.zvchclfz.components.configuration.view.Configuration",
				type: sap.ui.core.mvc.ViewType.XML
			});
			this._oPersonalizationDAO = this.getPersonalizationDAO();
			if (this._oPersonalizationDAO) {
				var o = this._oConfigurationView.getController();
				this._oPersonalizationDAO.attachChanged(this._onPersonalizationChanged, this);
				o.setPersonalizationDAO(this._oPersonalizationDAO);
			}
			this._oValuationComponentContainer = this._oConfigurationView.byId("valuationComponentContainer");
			var l = this._getLayout();
			l.attachShowLeftContent(this._onShowLayoutContent.bind(this, "/StructurePanelButtonPressed"));
			l.attachShowRightContent(this._onShowLayoutContent.bind(this, "/InspectorButtonPressed"));
			this._oInstanceArea = this._oConfigurationView.byId("instanceArea");
			this._applyNonParameterDefaults();
			return this._oConfigurationView;
		},
		getPersonalizationDAO: function () {
			if (!this._oPersonalizationDAO) {
				return this.createPersonalizationDAO();
			} else {
				return this._oPersonalizationDAO;
			}
		},
		createPersonalizationDAO: function () {
			if (P.isSupported()) {
				return new P();
			} else {
				return null;
			}
		},
		resetConfiguration: function () {
			this.getValuationComponent().initGroupStateModel();
			this.reload();
		},
		validateConfiguration: function () {
			return new Promise(function (r) {
				var o = this.getBindingContext(a.VCHCLF_MODEL_NAME);
				var p = o.getProperty("StatusId");
				if (this._oStructurePanelComponent && this.isMultiLevel()) {
					this._oStructurePanelComponent.reexplodeBOM().then(function () {
						r({
							isStatusChanged: p !== o.getProperty("StatusId"),
							statusDescription: o.getProperty("StatusDescription")
						});
					});
				} else {
					r({
						isStatusChanged: false,
						statusDescription: o.getProperty("StatusDescription")
					});
				}
			}.bind(this));
		},
		resetInspector: function () {
			if (this._oInspectorComponent) {
				this._oInspectorComponent.resetInspector();
			}
		},
		resetTrace: function () {
			if (this._oInspectorComponent) {
				this._oInspectorComponent.resetTrace();
			}
		},
		saveTraceState: function () {
			if (this._oInspectorComponent) {
				this._oInspectorComponent.saveTraceState();
			}
		},
		restoreTraceState: function () {
			if (this._oInspectorComponent) {
				this._oInspectorComponent.restoreTraceState();
			}
		},
		resetStructurePanel: function () {
			if (this._oStructurePanelComponent) {
				this._oStructurePanelComponent.resetComponent();
			}
		},
		reload: function () {
			this._oContextLoadedDeferred = $.Deferred();
			var o = this.getBindingContext(a.VCHCLF_MODEL_NAME);
			this.setBindingContext(undefined, a.VCHCLF_MODEL_NAME);
			this.fireConfigurationContextReloaded();
			this._sConfigurationInstancePath = null;
			b.reset();
			if (o) {
				this.getModel(a.VCHCLF_MODEL_NAME).removeContextAndRelatedData(o);
			}
			if (this._oValuationComponent) {
				this._oValuationComponent.removeRootBindingContext();
			}
			return this._createConfigurationContextAndBindingContext(this._getConfigurationContextData());
		},
		onBeforeRendering: function () {
			this.createComponents();
		},
		createComponents: function () {
			if (!this._oValuationComponent) {
				this._oValuationComponent = this.createComponent({
					id: this.createId("valuationComponent"),
					usage: "valuationComponent",
					settings: {
						modelName: a.VCHCLF_MODEL_NAME,
						uiMode: "{configurationSettings>/uiMode}",
						draftTransactionController: "{configurationSettings>/transactionController}",
						semanticObject: "{configurationSettings>/semanticObject}",
						objectKey: "{configurationSettings>/objectKey}",
						descriptionMode: "{configurationSettings>/descriptionMode}",
						groupRepresentation: G.FullScreen,
						showHiddenCharacteristics: "{configurationSettings>/showHiddenCharacteristics}",
						showPreciseDecimalNumbers: "{configurationSettings>/showPreciseNumbers}"
					},
					async: false
				});
				this.setAggregation("valuationComponent", this._oValuationComponent);
				this._registerValuationEvents();
			}
			if (!this._oStructurePanelComponent) {
				this._oStructurePanelComponent = this.createComponent({
					usage: "structurePanelComponent",
					id: this.createId("structurePanelComponent"),
					settings: {
						modelName: a.VCHCLF_MODEL_NAME,
						semanticObject: "{configurationSettings>/semanticObject}",
						uiMode: "{configurationSettings>/uiMode}",
						descriptionMode: "{configurationSettings>/descriptionMode}",
						personalizationDAO: this.getPersonalizationDAO()
					},
					async: false
				});
				this.setAggregation("structurePanelComponent", this._oStructurePanelComponent);
				this._registerStructurePanelEvents();
			}
			if (this.getProperty("embeddingMode") === E.Simulation) {
				var p = this.getPersonalizationDAO();
				if (p) {
					this._openStructurePanelInitiallyIfNoUserPersAvailable(p);
				} else {
					this._getLayout().setShowLeftContent(true);
				}
			}
			if (!this._oInspectorComponent) {
				this._oInspectorComponent = this.createComponent({
					usage: "inspectorComponent",
					id: this.createId("inspectorComponent"),
					settings: {
						modelName: a.VCHCLF_MODEL_NAME,
						semanticObject: "{configurationSettings>/semanticObject}",
						uiMode: "{configurationSettings>/uiMode}",
						showPreciseNumbers: "{configurationSettings>/showPreciseNumbers}",
						personalizationDAO: this.getPersonalizationDAO()
					},
					async: false
				});
				this.setAggregation("inspectorComponent", this._oInspectorComponent);
				this._oInspectorComponent.setVisibilityCheckCallBack(this._getInspectorVisibility.bind(this));
				this._registerInspectorEvents();
			}
		},
		initConfigurationDAO: function () {
			if (!this._oConfigurationDAO) {
				this._oConfigurationDAO = this._createConfigurationDAO();
			}
		},
		createConfigurationContextAndBindingContext: function () {
			this._createConfigurationContextAndBindingContext(this._getConfigurationContextData());
		},
		getValuationComponent: function () {
			return this._oValuationComponent;
		},
		getConfigurationDAO: function () {
			return this._oConfigurationDAO;
		},
		setHeaderConfiguration: function (o) {
			this.setAggregation("headerConfiguration", o);
			var e = o ? o.getHeaderConfigurationModel() : null;
			this.setModel(e, a.HEADER_CONFIGURATION_MODEL_NAME);
		},
		setFooter: function (F) {
			this._addAcceptReviewBtnToFooter(F);
			this._addReviseChangesBtnToFooter(F);
			this._addHandoverToEngBtnToFooter(F);
			this._addHandBackToEngBtnToFooter(F);
			this._oFooter = F;
			this._setFooterVisibility();
			this._getDynamicPage().setFooter(F);
			return this;
		},
		getFooter: function () {
			return this._oFooter;
		},
		setSemanticObject: function (s) {
			this.setProperty("semanticObject", s);
			this.getConfigurationSettingsModel().setProperty("/semanticObject", s);
			this._syncPersonalizationWithSettingsModel();
		},
		attachBusyIndicatorEvents: function () {
			var m = this.getModel(a.VCHCLF_MODEL_NAME);
			if (!this._bRequestAttachedForSetBusy) {
				m.attachRequestSent(this._onRequestSent, this);
				m.attachRequestCompleted(this._onRequestCompleted, this);
				this._bRequestAttachedForSetBusy = true;
			}
		},
		detachBusyIndicatorEvents: function () {
			var m = this.getModel(a.VCHCLF_MODEL_NAME);
			m.detachRequestSent(this._onRequestSent, this);
			m.detachRequestCompleted(this._onRequestCompleted, this);
			this._bRequestAttachedForSetBusy = false;
		},
		setObjectKey: function (o) {
			var D = "";
			if (o) {
				D = this._decodeString(o);
			}
			this.setProperty("objectKey", D);
			this.getConfigurationSettingsModel().setProperty("/objectKey", D);
		},
		buildContextId: function () {
			var s = j;
			for (var k in h) {
				try {
					var i = this.getProperty(h[k]);
				} catch (e) {
					i = null;
				}
				if (i) {
					switch (typeof i) {
					case "string":
						var l = decodeURIComponent(i).length;
						break;
					case "boolean":
						l = 1;
						if (i === true) {
							i = "X";
						} else {
							i = " ";
						}
						break;
					default:
						continue;
					}
					s = s + "(" + k.length + ")" + k + "(" + l + ")" + i;
				}
			}
			return s;
		},
		openErrorDialog: function (e, i) {
			this.getModel(a.VCHCLF_MODEL_NAME).displayErrorMessages([e], i);
		},
		getConfigurationInstancePath: function () {
			return this._sConfigurationInstancePath;
		},
		setEnableChangeDocumentsButton: function (e) {
			this.setProperty("enableChangeDocumentsButton", e);
			this.getConfigurationSettingsModel().setProperty("/enableChangeDocumentsButton", e);
		},
		setShowPricingInfo: function (s) {
			this.setProperty("showPricingInfo", s);
			this.getConfigurationSettingsModel().setProperty("/showPricingInfo", s);
		},
		setUiMode: function (u) {
			this.setProperty("embeddingUiMode", null);
			this._setUiMode(u);
		},
		_setUiMode: function (u) {
			var n = u;
			if (!this.getProperty("embeddingUiMode")) {
				this.setProperty("embeddingUiMode", n);
			}
			if (this.getProperty("embeddingUiMode") === g.DISPLAY && n === g.EDIT) {
				n = g.DISPLAY;
			}
			this.setProperty("uiMode", n);
			var e = n === g.CREATE || n === g.EDIT;
			this.getConfigurationSettingsModel().setProperty("/editable", e);
			this.getConfigurationSettingsModel().setProperty("/uiMode", n);
			if (!this.getConfigurationSettingsModel().getProperty("/embeddingUiMode")) {
				this.getConfigurationSettingsModel().setProperty("/embeddingUiMode", n);
			}
			this._setFooterVisibility();
		},
		setEmbeddingMode: function (e) {
			this.setProperty("embeddingMode", e);
			this.getConfigurationSettingsModel().setProperty("/embeddingMode", e);
		},
		updateConfigObjectBindingContext: function (s) {
			return new Promise(function (r, R) {
				if (typeof s === "string") {
					b.reset();
					var o = this.getModel(a.VCHCLF_MODEL_NAME);
					o.createBindingContext(s, null, null, function (n) {
						if (this.getModel() !== o) {
							this.setModel(o);
						}
						this.setBindingContext(n);
						r(n);
					}.bind(this), true, true);
				} else {
					R("Binding path has to be type of 'String'");
				}
			}.bind(this));
		},
		_evaluateEtoState: function (o) {
			if (o.UISettings.IsBOMChangeAllowed) {
				if (o.EtoStatus === a.ETO_STATUS.PROCESSING_STARTED || o.EtoStatus === a.ETO_STATUS.ENGINEERING_FINISHED || o.EtoStatus === a.ETO_STATUS
					.PROCESSING_FINISHED || o.EtoStatus === a.ETO_STATUS.REVIEW_FINISHED_BY_SALES || o.EtoStatus === a.ETO_STATUS.REVISED_BY_SALES) {
					this._setUiMode("Display");
				}
			} else {
				if (o.EtoStatus === a.ETO_STATUS.READY_FOR_ENGINEERING || o.EtoStatus === a.ETO_STATUS.IN_PROCESS_BY_ENGINEERING || o.EtoStatus ===
					a.ETO_STATUS.ENGINEERING_FINISHED || o.EtoStatus === a.ETO_STATUS.REVIEW_FINISHED_BY_SALES || o.EtoStatus === a.ETO_STATUS.REENGINEERING_NEEDED
				) {
					this._setUiMode("Display");
				}
			}
		},
		_setFooterVisibility: function () {
			var F = !!this._oFooter;
			if (this._bIsSmartTemplate && this.getUiMode() === g.DISPLAY) {
				F = false;
			}
			this.getConfigurationSettingsModel().setProperty("/showFooter", F);
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/configuration/BaseHeaderConfiguration', ["jquery.sap.global", "sap/ui/core/Element",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/HeaderField", "sap/ui/model/json/JSONModel"
], function (q, E, H, J) {
	"use strict";
	return E.extend("sap.i2d.lo.lib.zvchclfz.components.configuration.BaseHeaderConfiguration", {
		"abstract": true,
		metadata: {
			manifest: "json",
			properties: {
				title: {
					type: "sap.ui.model.type.String"
				},
				subtitle: {
					type: "sap.ui.model.type.String"
				}
			},
			aggregations: {
				headerFields: {
					type: "sap.i2d.lo.lib.zvchclfz.components.configuration.HeaderField",
					multiple: true,
					singularName: "headerField"
				},
				headerActions: {
					type: "sap.i2d.lo.lib.zvchclfz.components.configuration.HeaderField",
					multiple: true,
					singularName: "headerAction"
				},
				_defaultHeaderFields: {
					type: "sap.i2d.lo.lib.zvchclfz.components.configuration.HeaderField",
					hidden: true,
					multiple: true
				},
				_defaultHeaderActions: {
					type: "sap.i2d.lo.lib.zvchclfz.components.configuration.HeaderField",
					hidden: true,
					multiple: true
				}
			}
		},
		_mDefaultFields: null,
		_oModel: null,
		init: function () {
			this._oModel = new J(this.getDataJSON());
			this._mDefaultFields = {};
			this.updateDefaultActions();
			this.updateDefaultFields();
		},
		updateDefaultFields: function () {
			this.removeAll_defaultHeaderFields();
			var d = this.getDefaultHeaderFields();
			d.forEach(function (h) {
				this._mDefaultFields[this._getIdOfField(h)] = h;
				this.addAggregation("_defaultHeaderFields", h);
			}.bind(this));
		},
		updateDefaultActions: function () {
			this.removeAll_defaultHeaderActions();
			var d = this.getDefaultHeaderActions();
			d.forEach(function (h) {
				this._mDefaultFields[this._getIdOfField(h)] = h;
				this.addAggregation("_defaultHeaderActions", h);
			}.bind(this));
		},
		exit: function () {
			this._mDefaultFields = null;
			this._oModel.destroy();
			delete this._oModel;
		},
		getHeaderConfigurationModel: function () {
			return this._oModel;
		},
		setHeaderFields: function (h) {
			this.removeAllHeaderFields();
			h.forEach(function (o) {
				this.addHeaderField(o);
			}.bind(this));
		},
		setHeaderActions: function (h) {
			this.removeAllHeaderActions();
			h.forEach(function (o) {
				this.addHeaderAction(o);
			}.bind(this));
		},
		setProperty: function (p, v, s) {
			var r = E.prototype.setProperty.apply(this, arguments);
			this.syncModel();
			return r;
		},
		addAggregation: function (a, v, s) {
			var r = E.prototype.addAggregation.apply(this, arguments);
			this.syncModel();
			return r;
		},
		syncModel: function () {
			this._oModel.setData(this.getDataJSON());
		},
		getDataJSON: function () {
			var h = {
				"title": this.getTitle(),
				"subtitle": this.getSubtitle(),
				"headerFields": [],
				"headerActions": []
			};
			var d = this._getDefaultHeaderFields();
			var a = this.getHeaderFields();
			h.headerFields = this._merge(d, a, true);
			var D = this._getDefaultHeaderActions();
			var b = this.getHeaderActions();
			h.headerActions = this._merge(D, b, false);
			return h;
		},
		_merge: function (d, f, D) {
			var F = {};
			var a = [];
			var b = [];
			f.forEach(function (o) {
				var h = o.getDataJSON();
				if (!this._needsMerge(o)) {
					b.push(h);
				} else {
					var s = this._getIdOfField(o);
					if (!F[s]) {
						F[s] = [];
					}
					F[s].push(h);
				}
			}.bind(this));
			d.forEach(function (o) {
				var m = o.getDataJSON();
				var i = this._getIdOfField(o);
				if (F[i]) {
					F[i].forEach(function (c) {
						m = q.extend(true, m, c);
					});
				}
				a.push(o.getDataJSON());
			}.bind(this));
			return D ? a.concat(b) : b.concat(a);
		},
		_needsMerge: function (f) {
			var d = this._getDefaultFieldById(this._getIdOfField(f));
			return d && d !== f;
		},
		_getDefaultFieldById: function (f) {
			return this._mDefaultFields[f];
		},
		_getDefaultHeaderActions: function () {
			return this.getAggregation("_defaultHeaderActions") || [];
		},
		_getDefaultHeaderFields: function () {
			return this.getAggregation("_defaultHeaderFields") || [];
		},
		_getIdOfField: function (f) {
			var p = f.getProperties();
			return p ? p.id : null;
		},
		getDefaultHeaderActions: function () {
			return [];
		},
		getDefaultHeaderFields: function () {
			return [];
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/configuration/Component', [
	"sap/i2d/lo/lib/zvchclfz/components/configuration/BaseConfigurationComponent",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/type/LegacyScenario", "sap/i2d/lo/lib/zvchclfz/common/Constants"
], function (B, L, C) {
	"use strict";
	return B.extend("sap.i2d.lo.lib.zvchclfz.components.configuration.Component", {
		metadata: {
			manifest: "json",
			properties: {
				modelName: {
					type: "string"
				},
				rootBindingPath: {
					type: "string"
				},
				legacyScenario: {
					type: "sap.i2d.lo.lib.zvchclfz.components.configuration.type.LegacyScenario",
					defaultValue: L.NonLegacy
				}
			},
			publicMethods: ["openDoneDialog", "openCancelDialog"]
		},
		onBeforeRendering: function () {
			if (!this.getModel(C.VCHCLF_MODEL_NAME)) {
				var m = this.getModel(this.getModelName());
				if (!m) {
					jQuery.sap.log.error("No VCHCLF model available - not found under given model name");
				}
				this.setModel(m, C.VCHCLF_MODEL_NAME);
			}
			this.initConfigurationDAO();
			this.createComponents();
			this.createConfigurationContextAndBindingContext();
		},
		openDoneDialog: function (c) {
			this.getAggregation("rootControl").getController().openDoneDialog(c);
		},
		openCancelDialog: function (c) {
			this.getAggregation("rootControl").getController().openCancelDialog(c);
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/configuration/HeaderConfiguration', [
	"sap/i2d/lo/lib/zvchclfz/components/configuration/BaseHeaderConfiguration", "sap/i2d/lo/lib/zvchclfz/components/configuration/HeaderField",
	"sap/ui/model/json/JSONModel", "sap/i2d/lo/lib/zvchclfz/components/configuration/type/VariantMatchingMode",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/formatter/HeaderFieldFormatter"
], function (B, H, J, V, a) {
	"use strict";
	var b = B.extend("sap.i2d.lo.lib.zvchclfz.components.configuration.HeaderConfiguration", {
		metadata: {
			manifest: "json"
		},
		getDefaultHeaderActions: function () {
			var c = [];

			var x = new H({
				controlType: "Button",
				properties: {
					"id": b.DEFAULT_HEADER_ACTION.PRINT,
					"text": "Print Preview"
					// "visible": "{= ${configurationSettings>/editable} && ${configurationSettings>/embeddingMode} === 'Configuration'}",
					"type": "Transparent",
					// "tooltip": "{= ${vchclf>StatusType} === '2' ? ${vchI18n>UNLOCK_CONFIGURATION} : ${vchI18n>LOCK_CONFIGURATION}}",
					"press": "onPrintPreview"
				}
			});
			
			var w = new H({
				controlType: "Button",
				properties: {
					"id": b.DEFAULT_HEADER_ACTION.GRADINFO,
					"text": "Grader Info",
					// "visible": "{= ${configurationSettings>/editable} && ${configurationSettings>/embeddingMode} === 'Configuration'}",
					"type": "Transparent",
					// "tooltip": "{= ${vchclf>StatusType} === '2' ? ${vchI18n>UNLOCK_CONFIGURATION} : ${vchI18n>LOCK_CONFIGURATION}}",
					"press": "onGraderInfo"
				}
			});			
			var A = new H({
				controlType: "ToggleButton",
				properties: {
					"id": b.DEFAULT_HEADER_ACTION.LOCK,
					"text": "{= ${vchclf>StatusType} === '2' ?  ${vchI18n>BTN_TEXT_UNLOCK_CONFIGURATION} : ${vchI18n>BTN_TEXT_LOCK_CONFIGURATION}}",
					"pressed": "{= ${vchclf>StatusType} === '2'}",
					"visible": "{= ${configurationSettings>/editable} && ${configurationSettings>/embeddingMode} === 'Configuration'}",
					"type": "Transparent",
					"tooltip": "{= ${vchclf>StatusType} === '2' ? ${vchI18n>UNLOCK_CONFIGURATION} : ${vchI18n>LOCK_CONFIGURATION}}",
					"press": ".onLockConfiguration"
				}
			});
			var o = new H({
				controlType: "Button",
				properties: {
					"id": b.DEFAULT_HEADER_ACTION.SETTINGS,
					"icon": "sap-icon://action-settings",
					"visible": "{configurationSettings>/hasSettings}",
					"type": "Transparent",
					"tooltip": "{vchI18n>SHOW_SETTINGS}",
					"press": ".onSettings"
				}
			});
			var C = new H({
				controlType: "Button",
				properties: {
					"id": b.DEFAULT_HEADER_ACTION.CHANGE_DOCUMENTS,
					"text": "{vchI18n>CHANGE_DOCUMENTS_BUTTON}",
					"type": "Transparent",
					"tooltip": "{vchI18n>CHANGE_DOCUMENTS_BUTTON}",
					"press": ".onOpenChangeDocumentsDialog",
					"visible": "{= ${configurationSettings>/enableChangeDocumentsButton} && ${configurationSettings>/uiMode} !== 'Create'}"
				}
			});
			var d = new H({
				controlType: "ToggleButton",
				properties: {
					"id": b.DEFAULT_HEADER_ACTION.TOGGLE_STUCTURE_PANEL,
					"icon": "sap-icon://BusinessSuiteInAppSymbols/icon-side-panel-left-layout",
					"pressed": "{configurationSettings>/StructurePanelButtonPressed}",
					"type": "Transparent",
					"tooltip": "{vchI18n>TOGGLE_STRUCTURE_PANEL}",
					"press": ".onToggleLeftPanel",
					"visible": "{configurationSettings>/StructurePanelIsVisible}"
				}
			});
			var e = new H({
				controlType: "ToggleButton",
				properties: {
					"id": b.DEFAULT_HEADER_ACTION.TOGGLE_INSPECTOR,
					"icon": "sap-icon://BusinessSuiteInAppSymbols/icon-sidepanel",
					"pressed": "{configurationSettings>/InspectorButtonPressed}",
					"type": "Transparent",
					"tooltip": "{vchI18n>TOGGLE_INSPECTOR}",
					"press": ".onToggleSidePanel"
				}
			});
			var f = new H({
				controlType: "Button",
				properties: {
					"id": b.DEFAULT_HEADER_ACTION.VARIANT_MATCHING,
					"text": "{vchI18n>BTN_TEXT_VARIANT_MATCHING}",
					"tooltip": "{vchI18n>TOOLTIP_VARIANT_MATCHING}",
					"type": "Transparent",
					"press": ".onVariantMatching",
					"visible": {
						parts: [{
							path: 'configurationSettings>/variantMatchingMode'
						}, {
							path: 'vchclf>UISettings'
						}],
						formatter: a.getVariantMatchingVisibility
					}
				}
			});

			var g = new H({
				controlType: "MenuButton",
				properties: {
					"id": b.DEFAULT_HEADER_ACTION.VARIANT_MATCHING,
					"text": "{vchI18n>BTN_TEXT_VARIANT_MATCHING}",
					"tooltip": "{vchI18n>TOOLTIP_VARIANT_MATCHING}",
					"type": "Transparent",
					"buttonMode": sap.m.MenuButtonMode.Split,
					"defaultAction": ".onVariantMatching",
					"useDefaultActionOnly": true,
					"menu": {
						items: {
							text: "{vchI18n>CREATE_VARIANT}",
							enabled: {
								parts: [{
									path: 'vchclf>StatusType'
								}, {
									path: 'headerConfiguration>/fullMatchingVariants'
								}, {
									path: 'vchclf>UISettings'
								}],
								formatter: a.isCreateVariantItemEnabled
							}
						},
						itemSelected: ".onCreateVariant"
					},
					"visible": {
						parts: [{
							path: 'configurationSettings>/variantMatchingMode'
						}, {
							path: 'vchclf>UISettings'
						}, {
							path: 'configurationSettings>/variantMatchingMenuButton'
						}],
						formatter: a.getVariantMatchingVisibility
					}
				}
			});
			var h = new H({
				controlType: "Button",
				properties: {
					"id": b.DEFAULT_HEADER_ACTION.SWITCH_TO_ETO,
					"text": "{vchI18n>BTN_SWITCH_TO_ETO_PROFILE}",
					"tooltip": "{vchI18n>TOOLTIP_ETO_SWITCH}",
					"type": "Transparent",
					"press": ".onSwitchToETO",
					"visible": {
						parts: [{
							path: 'vchclf>EtoStatus'
						}, {
							path: 'vchclf>UISettings'
						}, {
							path: 'configurationSettings>/editable'
						}],
						formatter: a.getETOSwitchVisible
					}
				}
			});

			c.push(x);
			c.push(w);			
			c.push(h);
			c.push(f);
			c.push(g);
			c.push(C);
			c.push(A);
			c.push(o);
			c.push(d);
			c.push(e);
			return c;
		},
		getDefaultHeaderFields: function () {
			var h = [];
			var o = new H({
				description: "{vchI18n>CONFIGURATION_STATUS_HEADER}",
				properties: {
					"id": b.DEFAULT_HEADER_FIELD.STATUS,
					"text": "{vchclf>StatusDescription}",
					"state": "{= ${vchclf>StatusType} === '1' ? 'Success' : ${vchclf>StatusType} === '3' ? 'Warning' : 'Error' }",
					"tooltip": "{vchI18n>CONF_STATUS_TOOLTIP}",
					"press": ".onInconsistencyInformationRequested",
					"active": "{= ${configurationSettings>/inconsistencyPopupActive} === undefined ? false : ${configurationSettings>/inconsistencyPopupActive}}"
				},
				controlType: "ObjectStatus"
			});
			h.push(o);
			var c = new H({
				description: "{vchI18n>CONFIGURATION_ETO_STATUS_HEADER}",
				properties: {
					"id": b.DEFAULT_HEADER_FIELD.ETO_STATUS,
					"text": "{vchclf>EtoStatusDescription}",
					"tooltip": "{vchI18n>CONF_ETO_STATUS_TOOLTIP}",
					"visible": "{=  ${vchclf>EtoStatus} !== '' && ${vchclf>EtoStatus} !== null && ${vchclf>EtoStatus} !== undefined }"
				},
				controlType: "Text"
			});
			h.push(c);
			var d = new H({
				description: "{vchI18n>CONFIGURATION_PRICE_HEADER}",
				properties: {
					"id": b.DEFAULT_HEADER_FIELD.PRICE,
					"text": "{ parts: [{path: 'vchI18n>PRICE_REPRESENTATION'}, {path:'vchclf>NetValue'}, {path:'vchclf>Currency'}], formatter: 'sap.i2d.lo.lib.zvchclfz.components.configuration.formatter.HeaderFieldFormatter.formatPrice' }",
					"press": ".onPricingRecords",
					"visible": "{= ${configurationSettings>/pricingActive} === true && ${configurationSettings>/showPricingInfo} === true }"
				},
				controlType: "Link"
			});
			h.push(d);
			var e = new H({
				description: "{vchI18n>FULL_MATCHING_VARIANT}",
				properties: {
					"id": b.DEFAULT_HEADER_FIELD.VARIANT,
					"text": "{headerConfiguration>/fullMatchingVariants}",
					"busyIndicatorDelay": 0,
					"busy": "{headerConfiguration>/headerFieldVariantBusy}",
					"width": "auto",
					"wrapping": false,
					"tooltip": "{vchI18n>FULL_MATCHING_VARIANT}",
					"visible": "{=  ${configurationSettings>/variantMatchingMode} !== 0 && ${configurationSettings>/variantMatchingMode} !== 1 }"
				},
				controlType: "Text"
			});
			h.push(e);
			return h;
		},
		_getVisible: function (i, A) {
			var h = this.getHeaderConfigurationModel().getProperty("/" + A);
			var v = false;
			if (!h) {
				return v;
			}
			if (h.length === 0) {
				return v;
			}
			h.forEach(function (o) {
				if (o.properties.id === i && o.properties.visible) {
					v = true;
				}
			});
			return v;
		}
	});
	b.DEFAULT_HEADER_ACTION = {
		PRINT: "headerActionPrintConfiguration",
		GRADINFO: "headerActionGradInfoConfiguration",	
		LOCK: "headerActionLockConfiguration",
		EXPAND_HEADER: "headerActionExpandHeader",
		SETTINGS: "headerActionSettings",
		CHANGE_DOCUMENTS: "headerActionChangeDocuments",
		TOGGLE_STUCTURE_PANEL: "headerActionToggleStructurePanel",
		TOGGLE_INSPECTOR: "headerActionToggleInspector",
		VARIANT_MATCHING: "headerActionVariantMatching",
		SWITCH_TO_ETO: "ETOSwitch"
	};
	b.DEFAULT_HEADER_FIELD = {
		STATUS: "headerFieldStatus",
		ETO_STATUS: "headerFieldEtoStatus",
		PRICE: "headerFieldPrice",
		VARIANT: "headerFieldVariant"
	};
	return b;
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/configuration/HeaderField', ["sap/ui/core/Element"], function (E) {
	"use strict";
	return E.extend("sap.i2d.lo.lib.zvchclfz.components.configuration.HeaderField", {
		metadata: {
			manifest: "json",
			properties: {
				controlType: {
					type: "string"
				},
				description: {
					type: "string"
				},
				properties: {
					type: "object"
				}
			}
		},
		setProperty: function (p, v, s) {
			var r = E.prototype.setProperty.apply(this, arguments);
			if (this.getParent()) {
				this.getParent().syncModel();
			}
			return r;
		},
		getDataJSON: function () {
			var h = {
				properties: {}
			};
			h.description = this.getDescription();
			h.controlType = this.getControlType();
			h.properties = this.getProperties();
			return h;
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/configuration/control/SettingsDialog', ["sap/ui/core/XMLComposite",
	"sap/ui/model/json/JSONModel", "sap/i2d/lo/lib/zvchclfz/components/configuration/type/EmbeddingMode"
], function (X, J, E) {
	"use strict";
	return X.extend("sap.i2d.lo.lib.zvchclfz.components.configuration.control.SettingsDialog", {
		metadata: {
			properties: {
				personalizationDAO: {
					type: "sap.i2d.lo.lib.zvchclfz.components.configuration.dao.PersonalizationDAO"
				},
				embeddingMode: {
					type: "string"
				}
			}
		},
		init: function () {
			this._oModel = new J();
			this.setModel(this._oModel, "vchSettings");
		},
		exit: function () {
			this._oModel.destroy();
		},
		open: function () {
			return this.getPersonalizationDAO().getData().then(function (s) {
				this._oModel.setData(s);
				this.getDialog().open();
				return s;
			}.bind(this));
		},
		getDialog: function () {
			return this.byId("configurationSettingsDialog");
		},
		close: function () {
			this.getDialog().close();
		},
		save: function () {
			var d = this._oModel.getData();
			return this.getPersonalizationDAO().setData(d);
		},
		saveAndClose: function () {
			return this.save().then(function (d) {
				this.close();
				return d;
			}.bind(this));
		}
	});
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/configuration/controller/Configuration.controller', ["sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel", "sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/factory/HeaderFactory",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/dao/ConfigurationDAO",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/controller/fragment/PricingRecords",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/controller/fragment/VariantMatching",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/controller/fragment/ChangeDocuments",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/factory/FactoryBase", "sap/i2d/lo/lib/zvchclfz/common/util/CommandManager",
	"sap/base/strings/formatMessage", "sap/i2d/lo/lib/zvchclfz/components/configuration/formatter/InconsistencyInformationFormatter",
	"sap/m/GroupHeaderListItem", "sap/base/Log"
], function (C, J, a, H, b, P, V, c, F, d, f, I, G, L) {
	"use strict";
	return C.extend("sap.i2d.lo.lib.zvchclfz.components.configuration.controller.Configuration", {
		_oHeaderFactory: null,
		_oSettingsDialog: null,
		oInconsistencyInformationFormatter: I,
		getFormatter: function (s) {
			return this["o" + s];
		},
		getGroupHeader: function (g) {
			var i = this._getResourceBundle().getText("INCON_DETAILED_INFO_CSTIC_LIST_LABEL");
			var o = new G({
				title: f(i, [g.key])
			});
			o.addStyleClass("sapVchclfGroupHeaderListItem");
			return o;
		},
		_getResourceBundle: function () {
			if (!this.vchI18nResourceBundle) {
				this.vchI18nResourceBundle = this.getView().getModel("vchI18n").getResourceBundle();
			}
			return this.vchI18nResourceBundle;
		},
		_getConfigurationDAO: function () {
			if (!this._oConfigurationDAO) {
				this._oConfigurationDAO = new b({
					dataModel: this.getView().getModel(a.VCHCLF_MODEL_NAME)
				});
			}
			return this._oConfigurationDAO;
		},
		getFactoryBase: function () {
			if (!this._oFactoryBase) {
				this._oFactoryBase = new F({
					controller: this,
					view: this.getView()
				});
			}
			return this._oFactoryBase;
		},
		_getConfigurationInstancePath: function () {
			return this.getOwnerComponent().getConfigurationInstancePath();
		},
		_createExitConfigurationDialog: function (s, e, o) {
			var v = this.getView();
			var D = sap.ui.xmlfragment(s, e, this);
			v.addDependent(D);
			var O = D.getAggregation("beginButton");
			O.attachPress(o);
			return D;
		},
		_getDataModel: function () {
			return this._getModel(a.VCHCLF_MODEL_NAME);
		},
		_getModel: function (m) {
			return this.getView().getModel(m);
		},
		_getLayout: function () {
			return this.getView().byId("layout");
		},
		_openInconsistencyPopover: function (o) {
			if (this._oPopover) {
				this._oPopover.destroy();
			}
			var e = this.getFactoryBase();
			var s = "sap.i2d.lo.lib.zvchclfz.components.configuration.view.fragment.InconsistencyPopover";
			this._oPopover = e.createFragment(this.getView().getId(), s, this);
			this._oPersonalizationDAO.getData().then(function (S) {
				this._oPopover.setModel(new J(S), "vchSettings");
			}.bind(this));
			this.getView().addDependent(this._oPopover);
			var B = this.getOwnerComponent().getBindingContext("vchclf");
			this._oPopover.setBindingContext(B, "vchclf");
			this._oPopover.setBusyIndicatorDelay(0);
			this._oPopover.setBusy(true);
			this._oPopover.openBy(o);
			var g = this.getOwnerComponent().getModel("vchclf");
			var h = g.getProperty("InconsistencyInformation", B, true);
			var p;
			var j = [];
			for (var i = 0; i < h.results.length; i++) {
				p = g.getKey(h.results[i]);
				j.push(g.facadeRead("/" + p + "/Documentation"));
				j.push(g.facadeRead("/" + p + "/Details", {
					$expand: "AssignedCsticValues"
				}));
			}
			Promise.all(j).then(function () {
				this._oPopover.setBusy(false);
			}.bind(this)).catch(function (E) {
				L.error(E ? E.stack : "Failed to retrieve inconsistency information.");
				this._oPopover.setBusy(false);
			}.bind(this));
		},
		onInconsistencyRequested: function () {
			this._oPopover.setBusy(true);
		},
		onInconsistencyReceived: function () {
			this._oPopover.setBusy(false);
		},
		_createChangeDocumentsDialog: function () {
			var o = this.getFactoryBase();
			var s = "sap.i2d.lo.lib.zvchclfz.components.configuration.view.fragment.ChangeDocumentsDialog";
			var e = "sap.i2d.lo.lib.zvchclfz.components.configuration.controller.fragment.ChangeDocuments";
			return o.createFragment(this.getView().getId(), s, e);
		},
		onInit: function () {
			var v = new J({});
			this.getView().setModel(v, "viewModel");
			var o = new J({
				"INCONSISTENCY_INFORMATION": {
					"MULTI_DOCU": a.INCONSISTENCY_INFORMATION.MULTI_DOCU,
					"SINGLE_DOCU": a.INCONSISTENCY_INFORMATION.SINGLE_DOCU,
					"NO_DOCU": a.INCONSISTENCY_INFORMATION.NO_DOCU
				}
			});
			this.getView().setModel(o, "constants");
			this._oHeaderFactory = new H({
				controller: this
			});
			this.getView().setModel(d.getModel(), "commandState");
		},
		onExit: function () {
			if (this._oSettingsDialog) {
				this._oSettingsDialog.destroy();
			}
			if (this._oPricingRecordsController) {
				this._oPricingRecordsController.destroy();
			}
			if (this._oPopover) {
				this._oPopover.destroy();
			}
			if (this._oChangeDocumentsDialog) {
				this._oChangeDocumentsDialog.destroy();
			}
			if (this._oVariantMatchingController) {
				var s = this.getView().byId("MatchingVariantsTableTemplate");
				s.destroy();
				this._oVariantMatchingController.destroy();
			}
			if (this._oFactoryBase) {
				this._oFactoryBase.destroy();
			}
			this._oHeaderFactory.destroy();
		},
		onAfterRendering: function () {
			this.getView().byId("structurePanelComponentContainer").setComponent(this.getOwnerComponent().getStructurePanelComponent());
			this.getView().byId("inspectorComponentContainer").setComponent(this.getOwnerComponent().getInspectorComponent());
		},
		onSettings: function (e) {
			if (this._oPersonalizationDAO) {
				if (!this._oSettingsDialog) {
					jQuery.sap.require("sap.i2d.lo.lib.zvchclfz.components.configuration.control.SettingsDialog");
					this._oSettingsDialog = new sap.i2d.lo.lib.zvchclfz.components.configuration.control.SettingsDialog(this.getView().getId() +
						"--settingsDialog", {
							personalizationDAO: this._oPersonalizationDAO,
							embeddingMode: this.getOwnerComponent().getEmbeddingMode()
						});
					this.getOwnerComponent().attachConfigurationContextReloaded(this._oSettingsDialog.close.bind(this._oSettingsDialog));
					this.getView().addDependent(this._oSettingsDialog);
				}
				this._oSettingsDialog.open();
			}
		},
		setPersonalizationDAO: function (p) {
			this._oPersonalizationDAO = p;
		},
		onToggleSidePanel: function (e) {
			var l = this._getLayout();
			l.setShowRightContent(!l.getShowRightContent());
		},
		onToggleLeftPanel: function (e) {
			var l = this._getLayout();
			l.setShowLeftContent(!l.getShowLeftContent());
		},
		createAction: function (i, o) {
			return this._oHeaderFactory.createAction(i, H.getHeaderFieldFromContext(o));
		},
		createField: function (i, o) {
			return this._oHeaderFactory.createField(i, H.getHeaderFieldFromContext(o));
		},
		onPricingRecords: function () {
			if (!this._oPricingRecordsController) {
				this._oPricingRecordsController = new P({
					view: this.getView()
				});
			}
			this._oPricingRecordsController.openDialog();
		},
		onOpenChangeDocumentsDialog: function () {
			var B = this.getView().getBindingContext(a.VCHCLF_MODEL_NAME);
			if (this._oChangeDocumentsDialog) {
				this._oChangeDocumentsDialog.destroy();
			}
			this._oChangeDocumentsDialog = this._createChangeDocumentsDialog();
			this._oChangeDocumentsDialog.setBusyIndicatorDelay(0);
			var o = this.getView().getModel("vchclf").createBindingContextForOriginModel(B);
			this._oChangeDocumentsDialog.setBindingContext(o, "vchclf_bind_only");
			this.getView().addDependent(this._oChangeDocumentsDialog);
			this._oChangeDocumentsDialog.setModel(new J(), "vchSettings");
			this._oPersonalizationDAO.getData().then(function (s) {
				this._oChangeDocumentsDialog.getModel("vchSettings").setData(s);
				this._oChangeDocumentsDialog.open();
			}.bind(this));
		},
		onInconsistencyInformationRequested: function (e) {
			this._openInconsistencyPopover(e.getSource());
		},
		onStatusClicked: function (e) {
			this._openInconsistencyPopover(e.getSource());
		},
		onLockConfiguration: function (e) {
			var B = e.getSource();
			var t = this._getResourceBundle().getText("BTN_TEXT_LOCK_CONFIGURATION");
			if (B.getText() === t) {
				this.getOwnerComponent().lockConfiguration();
			} else {
				this.getOwnerComponent().unlockConfiguration();
			}
		},
		getDoneConfigurationDialog: function () {
			return this.oDoneConfigurationDialog;
		},
		setDoneConfigurationDialog: function (D) {
			this.oDoneConfigurationDialog = D;
		},
		getStatusChangedConfigurationDialog: function () {
			return this.oStatusChangedConfigurationDialog;
		},
		setStatusChangedConfigurationDialog: function (D) {
			this.oStatusChangedConfigurationDialog = D;
		},
		getCancelConfigurationDialog: function () {
			return this.oCancelConfigurationDialog;
		},
		setCancelConfigurationDialog: function (D) {
			this.oCancelConfigurationDialog = D;
		},
		openDoneDialog: function (e) {
			var v = this.getView();
			var B = v.getBindingContext("vchclf");
			var s = B.getObject().ContextId;
			var o = this._getConfigurationDAO();
			v.setBusyIndicatorDelay(0);
			v.setBusy(true);
			var l = B.getObject().StatusType;
			var g = B.getObject().StatusDescription;
			o.validateConfiguration(s).then(function (r) {
				var h = r[0];
				v.setBusy(false);
				var i = "sap.i2d.lo.lib.zvchclfz.components.configuration.view.fragment.DoneConfigurationDialog";
				var j = function () {
					var n = this.getOwnerComponent();
					var p = n.lockConfiguration();
					p.then(function () {
						this.getDoneConfigurationDialog().close();
						if (e) {
							e();
						}
					}.bind(this));
					p.catch(function (E) {
						this.getDoneConfigurationDialog().close();
						n.openErrorDialog(E);
					}.bind(this));
				}.bind(this);
				var k = function () {
					this.getStatusChangedConfigurationDialog().close();
					if (e) {
						e();
					}
				}.bind(this);
				if (!this.getDoneConfigurationDialog()) {
					this.setDoneConfigurationDialog(this._createExitConfigurationDialog("doneDialog", i, j));
				}
				if (h.ValidateConfiguration && h.ValidateConfiguration.Success) {
					if (B && B.getProperty) {
						var m = B.getProperty("StatusType");
						switch (m) {
						case a.CONFIGURATION_STATUS_TYPE.LOCKED:
							if (l !== m) {
								var S = new J({
									"lastStatusTypeDescription": g,
									"newStatusTypeDescription": B.getProperty("StatusDescription")
								});
								this.getView().setModel(S, a.STATUS_CHANGED_DIALOG_MODEL_NAME);
								if (!this.getStatusChangedConfigurationDialog()) {
									this.setStatusChangedConfigurationDialog(this._createExitConfigurationDialog("statusChangedDialog",
										"sap.i2d.lo.lib.zvchclfz.components.configuration.view.fragment.StatusChangedDialog", k));
								}
								this.getStatusChangedConfigurationDialog().open();
							} else if (e) {
								e();
							}
							break;
						case a.CONFIGURATION_STATUS_TYPE.INCOMPLETE:
						case a.CONFIGURATION_STATUS_TYPE.INCONSISTENT:
							this.getDoneConfigurationDialog().open();
							break;
						default:
							if (e) {
								e();
							}
							break;
						}
					}
				} else {
					this.getDoneConfigurationDialog().open();
				}
			}.bind(this));
		},
		openCancelDialog: function (e) {
			var u = this.getOwnerComponent().getUiMode();
			if (u === "Edit" || u === "Create") {
				var s = "sap.i2d.lo.lib.zvchclfz.components.configuration.view.fragment.CancelConfigurationDialog";
				var o = function () {
					this.getCancelConfigurationDialog().close();
					if (e) {
						e();
					}
				}.bind(this);
				if (!this.getCancelConfigurationDialog()) {
					this.setCancelConfigurationDialog(this._createExitConfigurationDialog("cancelDialog", s, o));
				}
				this.getCancelConfigurationDialog().open();
			} else if (u === "Display" && e instanceof Function) {
				e();
			}
		},
		onCancelExitDialog: function (e) {
			var D = e.getSource().getParent();
			D.close();
		},
		onUnlockStatusChangedDialog: function (e) {
			var o = this.getOwnerComponent();
			var p = o.unlockConfiguration();
			p.then(function () {
				this.getStatusChangedConfigurationDialog().close();
			}.bind(this));
			p.catch(function (E) {
				this.getStatusChangedConfigurationDialog().close();
				o.openErrorDialog(E);
			}.bind(this));
		},
		onVariantMatching: function () {
			if (!this._oVariantMatchingController) {
				this._oVariantMatchingController = new V({
					configurationDAO: this._getConfigurationDAO(),
					view: this.getView()
				});
			}
			this._oVariantMatchingController.openDialog();
		},
		onSwitchToETO: function () {
			if (this._oSwitchToETODialog) {
				this._oSwitchToETODialog.destroy();
				delete this._oSwitchToETODialog;
			}
			var o = this.getFactoryBase();
			var s = "sap.i2d.lo.lib.zvchclfz.components.configuration.view.fragment.SwitchToETODialog";
			var e = function () {
				var v = this.getView();
				v.setBusyIndicatorDelay(0);
				v.setBusy(true);
				var B = v.getBindingContext("vchclf");
				var i = B.getObject().ContextId;
				var j = this._getConfigurationDAO();
				j.switchToETO(i).then(function () {
					v.setBusy(false);
					this.getOwnerComponent().reload();
				}.bind(this));
				this._oSwitchToETODialog.close();
			};
			var g = function () {
				this._oSwitchToETODialog.close();
			};
			this._oSwitchToETODialog = o.createFragment(this.getView().getId(), s, this);
			var O = this._oSwitchToETODialog.getAggregation("beginButton");
			O.attachPress(e.bind(this));
			var h = this._oSwitchToETODialog.getAggregation("endButton");
			h.attachPress(g.bind(this));
			this.getView().addDependent(this._oSwitchToETODialog);
			this._oSwitchToETODialog.open();
		},
		onCreateVariant: function () {
			var v = this.getView();
			var B = v.getBindingContext("vchclf");
			var s = B.getObject().ContextId;
			var r = function () {
				v.setBusy(false);
			};
			var e = function () {
				r();
				var E = this._getResourceBundle().getText("FAILED_TO_CREATE_VARIANT");
				this.getOwnerComponent().openErrorDialog({
					message: E
				});
			}.bind(this);
			var u = function (h) {
				var E = this._getResourceBundle().getText("VARIANT_CREATED_WITHOUT_PRICING");
				this.getOwnerComponent().openErrorDialog({
					message: E
				}, h);
			}.bind(this);
			var g = this._getConfigurationDAO();
			v.setBusy(true);
			g.createFullyMatchingProductVariant(s).then(function (R) {
				var n = R.CreateFullyMatchingProductVariant.ProductKey.trim();
				if (n) {
					var o = {
						ContextId: s,
						InstanceId: "",
						Product: n,
						Plant: "",
						Cuobj: R.CreateFullyMatchingProductVariant.Cuobj
					};
					var S = function () {
						g.setPreferredVariant(o).then(function (h) {
							r();
							this.getView().getController().getOwnerComponent().firePreferredVariantSelected();
						}.bind(this), r);
					}.bind(this);
					if (R.CreateFullyMatchingProductVariant.PricingError) {
						u(S);
					} else {
						S();
					}
				} else {
					e();
				}
			}.bind(this), e);
		},
		_navigateToMaterialMaster: function (p) {
			var n = sap.ushell.Container.getService('CrossApplicationNavigation');
			var h = n.hrefForExternal({
				target: {
					semanticObject: a.SEM_OBJ_MATERIAL,
					action: 'manage'
				},
				params: {
					Material: p,
					preferredMode: "edit"
				}
			});
			var u = sap.ushell.Container.getFLPUrl() + "#" + h;
			sap.m.URLHelper.redirect(u, true);
		},
		onUndo: function (e) {
			d.undo();
		},
		onRedo: function (e) {
			d.redo();
		},
		onSearch: function (e) {},
		onOpenFilterDialog: function (e) {
			var o = e.getSource();
			this.getOwnerComponent().getValuationComponent().openFilterDialog(o);
		},
		factoryForInconsistencyInfoDetails: function (i, D) {
			var t = new sap.m.Text({
				id: i,
				text: "InstanceId: " + D.getProperty("InstanceId") + ", CsticId: " + D.getProperty("CsticName") + ", ObjectDepId: " + D.getProperty(
					"DependencyId")
			});
			t.addStyleClass("sapUiSmallMarginEnd");
			t.addStyleClass("sapUiTinyMarginBottom");
			return t;
		},
		onInconsistencyInfoDetailTextForCsticPress: function (e) {
			var s = e.getSource();
			var D = s.getBindingContext(a.VCHCLF_MODEL_NAME).getObject();
			var o = {
				ContextId: D.ContextId,
				InstanceId: D.InstanceId.trim(),
				GroupId: 0,
				CsticId: D.CsticId
			};
			var g = this._getConfigurationDAO().createKey("/CharacteristicSet", o);
			this.getOwnerComponent().inspectCharacteristic(g, true, o);
		},
		onDependencyClicked: function (e) {
			var D = e.getSource().getBindingContext(a.VCHCLF_MODEL_NAME).getObject();
			this.getOwnerComponent().inspectObjectDependency(D.ObjectDependency);
		},

		onPreviousItem: function (oEvent) {
		},
				
		onNextItem: function (oEvent) {
		},
				
		onPrintPreview: function (oEvent) {
		},
				
		onGraderInfo: function (oEvent) {
		}	
	});
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/configuration/controller/fragment/Base', [
	"sap/i2d/lo/lib/zvchclfz/common/controller/fragment/Base"
], function (B) {
	"use strict";
	return B.extend("sap.i2d.lo.lib.zvchclfz.components.configuration.controller.fragment.Base", {
		metadata: {
			properties: {
				configurationDAO: {
					type: "sap.i2d.lo.lib.zvchclfz.components.configuration.dao.ConfigurationDAO"
				},
				i18nModelName: {
					type: "string",
					defaultValue: "vchI18n"
				}
			}
		}
	});
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/configuration/controller/fragment/ChangeDocuments', [
	"sap/i2d/lo/lib/zvchclfz/components/configuration/controller/fragment/Base",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/formatter/CharacteristicFormatter", "sap/m/GroupHeaderListItem"
], function (B, C, G) {
	"use strict";
	return B.extend("sap.i2d.lo.lib.zvchclfz.components.configuration.controller.fragment.ChangeDocuments", {
		metadata: {
			properties: {
				personalizationDAO: {
					type: "sap.i2d.lo.lib.zvchclfz.components.configuration.dao.PersonalizationDAO"
				}
			}
		},
		formatter: C,
		getGroupHeader: function (g) {
			return new G({
				title: this.getText("CHANGE_DOCUMENT_PRODUCT_ID") + ": " + g.key,
				upperCase: false
			});
		},
		closeChangeDocumentsDialog: function () {
			this.getControl().close();
		}
	});
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/configuration/controller/fragment/PricingRecords', [
	"sap/i2d/lo/lib/zvchclfz/components/configuration/controller/fragment/Base", "sap/i2d/lo/lib/zvchclfz/common/util/XMLFragmentCache",
	"sap/i2d/lo/lib/zvchclfz/common/Constants", "sap/ui/model/json/JSONModel", "sap/ui/model/Filter", "sap/ui/core/format/NumberFormat"
], function (B, X, C, J, F, N) {
	"use strict";
	return B.extend("sap.i2d.lo.lib.zvchclfz.components.configuration.controller.fragment.PricingRecords", {
		_createDialog: function () {
			var f = "sap.i2d.lo.lib.zvchclfz.components.configuration.view.fragment.PricingRecords";
			this._oDialog = X.createFragment("pricingDialog", f, this);
			var b = this.getView().getBindingContext(C.VCHCLF_MODEL_NAME);
			var o = this.getView().getModel("vchclf").createBindingContextForOriginModel(b);
			this._oDialog.setBusyIndicatorDelay(0);
			this._oDialog.setBindingContext(o, "vchclf_bind_only");
			this.getView().addDependent(this._oDialog);
			this._initFilterModel();
		},
		_updateDialog: function () {
			var b = this.getView().getBindingContext(C.VCHCLF_MODEL_NAME);
			var o = this.getView().getModel("vchclf").createBindingContextForOriginModel(b);
			this._oDialog.setBindingContext(null, "vchclf_bind_only");
			this._oDialog.setBindingContext(o, "vchclf_bind_only");
		},
		_initFilterModel: function () {
			this._oFilterModel = new J({
				selectedFilterKey: "F2",
				selectedFilterText: this.getText("PRICING_RECORDS_VARIANT"),
				filters: [],
				recordsNumberTitle: null
			});
			this._oFilterModel.setProperty("/filters", [{
				text: this.getText("PRICING_RECORDS_ALL"),
				key: "F1"
			}, {
				text: this.getText("PRICING_RECORDS_VARIANT"),
				key: "F2"
			}, {
				text: this.getText("PRICING_RECORDS_WO_SUBTOTALS"),
				key: "F3"
			}]);
			this._oDialog.setModel(this._oFilterModel, "pricingRecordsFilterModel");
			this._setFilterForRecordsTable("F2");
		},
		_createRecordsFilter: function (f) {
			var a = [];
			switch (f) {
			case "F1":
				break;
			case "F2":
				var v = new F("VariantCondition", sap.ui.model.FilterOperator.EQ, "*");
				a.push(v);
				break;
			case "F3":
				var e = new F("CondTypeId", sap.ui.model.FilterOperator.NE, "*");
				a.push(e);
			}
			return a;
		},
		_setFilterForRecordsTable: function (f) {
			var t = this._oDialog.getAggregation("content")[0].getAggregation("flexContent");
			if (t.getId() === "pricingDialog--PricingRecordsTable") {
				var T = t.getBinding("items");
				var a = this._createRecordsFilter(f);
				T.filter(a);
			}
		},
		closeDialog: function (e) {
			this._oDialog.close();
		},
		exit: function () {
			if (this._oDialog) {
				this._oDialog.destroy();
			}
		},
		openDialog: function () {
			if (!this._oDialog) {
				this._createDialog();
			} else {
				this._updateDialog();
			}
			this._oDialog.open();
		},
		getCondRefFactor: function (c, s) {
			if (c !== "0" && s) {
				var n = N.getIntegerInstance();
				return n.format(c);
			} else {
				return "";
			}
		},
		getCalcCondFactor: function (c, v) {
			if (v) {
				return N.getCurrencyInstance().format(c);
			} else {
				return "";
			}
		},
		onSelectionChange: function (e) {
			var f = e.getSource().getSelectedItem().getKey();
			this._oFilterModel.setProperty("/selectedFilterKey", f);
			this._setFilterForRecordsTable(f);
		},
		onPricingRecordsReceived: function (e) {
			var f = this._oFilterModel.getProperty("/selectedFilterKey");
			var a = this._oFilterModel.getProperty("/filters");
			var s = {};
			for (var k = 0; k < a.length; k++) {
				var o = a[k];
				if (o.key === f) {
					s = o;
					break;
				}
			}
			this._oFilterModel.setProperty("/selectedFilterText", s.text);
			var c = e.getParameter("data").results.length;
			var r = this.getText("CONDITION_RECORDS") + " (" + c + ")";
			this._oFilterModel.setProperty("/recordsNumberTitle", r);
		},
		getConditionRecordTooltip: function (c, s) {
			if (s === true) {
				return this.getText("STATISTICAL_CONDITION");
			}
			if (c === "X") {
				return this.getText("INACTIVE_CONDITION");
			}
		}
	});
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/configuration/controller/fragment/VariantMatching', [
	"sap/i2d/lo/lib/zvchclfz/components/configuration/controller/fragment/Base", "sap/ui/model/json/JSONModel", "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator", "sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/dao/ConfigurationDAO", "sap/i2d/lo/lib/zvchclfz/common/type/DescriptionMode",
	"sap/base/strings/formatMessage"
], function (B, J, F, a, C, b, D, f) {
	"use strict";
	var A = "sap.i2d.lo.lib.zvchclfz.components.configuration.view.fragment.VariantMatching";
	var c = {};
	c[A] = "sap.i2d.lo.lib.zvchclfz.components.configuration.controller.fragment.VariantMatching";
	return B.extend("sap.i2d.lo.lib.zvchclfz.components.configuration.controller.fragment.VariantMatching", {
		openDialog: function () {
			if (!this._oDialog) {
				this._createDialog();
			} else {
				this._updateDialog();
			}
			this._oDialog.open();
		},
		_createDialog: function () {
			this._oDialog = this.getViewController().getFactoryBase().createFragment(this.getView().getId(), A, this);
			this.getView().addDependent(this._oDialog);
			var v = new J();
			this.getView().setModel(v, C.VARIANTS_MODEL_NAME);
			var V = new J({
				"partMatchExist": false
			});
			this.getView().setModel(V, C.VARIANTS_SETTINGS_MODEL_NAME);
			this._getVariants();
		},
		_updateDialog: function () {
			this._getVariantDataModel().setData();
			this.sUrlParams = "";
			this.aFilters = [];
			this._getVariants();
		},
		closeDialog: function (e) {
			this.sUrlParams = "";
			this.aFilters = [];
			this._oDialog.close();
		},
		_getVariants: function () {
			this.setBusy(true, "MatchingVariantsTable");
			var i = this._getConfigDataModel().getProperty(this._getConfigurationInstancePath());
			this.getConfigurationDAO().readAllMaterialVariants(i.ContextId, i.InstanceId, this.sUrlParams, this.aFilters).then(function (r) {
				this._getVariantDataModel().setData(r.results);
				var p = r.results.every(function (v, d) {
					return v.IsFullMatch;
				});
				if (!p) {
					this._getVariantSettingsModel().setProperty("/partMatchExist", true);
				} else {
					this._getVariantSettingsModel().setProperty("/partMatchExist", false);
				}
				var t = this.getView().byId("TableHeader");
				var T = this.getResourceBundle().getText("PRODUCT_VARIANTS") + " (" + r.results.length + ")";
				t.setText(T);
				this.setBusy(false, "MatchingVariantsTable");
			}.bind(this));
		},
		_getVariantDataModel: function () {
			return this.getView().getModel(C.VARIANTS_MODEL_NAME);
		},
		_getConfigDataModel: function () {
			return this.getView().getModel(C.VCHCLF_MODEL_NAME).getOriginModel();
		},
		_getVariantSettingsModel: function () {
			return this.getView().getModel(C.VARIANTS_SETTINGS_MODEL_NAME);
		},
		_getConfigurationInstancePath: function () {
			return this.getOwnerComponent().getConfigurationInstancePath();
		},
		init: function () {
			this.variantIdFilter = new F("Product", a.Contains, "");
			this.variantDescrFilter = new F("ProductDescription", a.Contains, "");
		},
		exit: function () {
			B.prototype.exit.apply(this, arguments);
			if (this._oDialog) {
				this._oDialog.destroy();
			}
			if (this._oPopover) {
				this._oPopover.destroy();
			}
			if (this._oVariantSelectionDialog) {
				this._oVariantSelectionDialog.destroy();
			}
		},
		onVariantMatchingDialogClose: function () {
			this.byId("SearchString").setValue("");
			this.getControl().close();
			if (this._oPopover) {
				this._oPopover.destroy();
				delete this._oPopover;
			}
		},
		onSearch: function (e) {
			if (e.getParameter("clearButtonPressed")) {
				this._resetSearch();
			} else {
				var q = e.getSource().getValue();
				if (q) {
					this._executeSearch(q);
				} else {
					this._resetSearch();
				}
			}
		},
		_executeSearch: function (q) {
			var i = [];
			this.variantIdFilter.oValue1 = q;
			i.push(this.variantIdFilter);
			this.variantDescrFilter.oValue1 = q;
			i.push(this.variantDescrFilter);
			var o = new F({
				filters: i,
				and: true
			});
			this.aFilters = [];
			this.aFilters.push(o);
			this._getVariants();
		},
		_resetSearch: function () {
			this.byId("SearchString").setValue("");
			this.aFilters = [];
			this._getVariants();
		},
		fnGroupVariants: function (o) {
			if (o.getObject().IsFullMatch) {
				return this.getText("VARIANT_MATCHING_GROUP_FULL_MATCH");
			} else {
				return this.getText("VARIANT_MATCHING_GROUP_PARTIAL_MATCH");
			}
		},
		_getVariantTable: function () {
			return this.byId("MatchingVariantsTable");
		},
		_getValuationTable: function () {
			return this.byId("VariantValuationTable");
		},
		onLoadValDiff: function (e) {
			var s = e.getSource();
			var i = s.getId();
			var l = sap.ui.getCore().byId(i);
			var v = l.getBindingContext(C.VARIANTS_MODEL_NAME);
			var V = v.getPath();
			var d = this._getConfigDataModel();
			var o = this._getVariantDataModel().getProperty(V);
			var g = "/" + d.createKey("ConfigurationMaterialVariantSet", o);
			d.createBindingContext(g, null, null, function (n) {
				var h = o.Product;
				if (!this._oPopover) {
					this._oPopover = sap.ui.xmlfragment(this.getView().getId(),
						"sap.i2d.lo.lib.zvchclfz.components.configuration.view.fragment.VariantValuationDifferencePopover", this);
					this._oPopover.setBindingContext(n, "vchclf_bind_only");
					this.getView().addDependent(this._oPopover);
					this._initVariantValuationModel();
				} else {
					var p = this._oPopover.getBindingContext("vchclf_bind_only").getObject().Product;
					if (p !== h) {
						this._oPopover.setBindingContext(n, "vchclf_bind_only");
					}
				}
				if (this._bRefreshVariantValuationDifferencePopover) {
					this._oPopover.getContent()[0].getBinding("items").refresh(true);
					this._bRefreshVariantValuationDifferencePopover = false;
				}
				var t = this.getText("VARIANT_VALUATION_DIFFERENCE") + " '" + h + "'";
				this._oPopover.setTitle(t);
				this._oPopover.openBy(s);
			}.bind(this));
		},
		_initVariantValuationModel: function () {
			this._oVariantValuationModel = new J();
			this._oPopover.setModel(this._oVariantValuationModel, "variantValuationModel");
		},
		onVariantValuationRequested: function () {
			this.setBusy(true, "VariantValuationTable");
		},
		onVariantValuationReceived: function (e) {
			var p = e.getSource().getContext().getPath();
			var m = sap.ui.getCore().getMessageManager().getMessageModel();
			var M = m.getData();
			for (var i = 0; i < M.length; i++) {
				var t = M[i].getTarget();
				if (t.indexOf(p) !== -1 && M[i].type === "Error") {
					this._oVariantValuationModel.setProperty("/noDataText", this.getText("ERROR_OCCURRED") + M[i].message);
					break;
				}
			}
			this.setBusy(false, "VariantValuationTable");
		},
		csticDiffCountFactory: function (n) {
			switch (n) {
			case 0:
				break;
			case 1:
				return n + " " + this.getText("VALUATION_CSTIC");
			default:
				return n + " " + this.getText("VALUATION_CSTICS");
			}
		},
		determineValueDiff: function (e) {
			this.sUrlParams = "$select=ContextId,InstanceId,Product,Plant,Cuobj,ProductDescription,IsFullMatch,CsticDiffCount";
			this._getVariants();
			this._bRefreshVariantValuationDifferencePopover = true;
		},
		onSelectionChange: function (e) {
			var s = e.getSource();
			var p = s.getSelectedContextPaths()[0];
			var m = e.getSource().getModel(C.VARIANTS_MODEL_NAME);
			var v = m.getProperty(p);
			this._openVariantSelectionDialog(v);
		},
		_openVariantSelectionDialog: function (v) {
			this._getVariantSelectionDialog(v).open();
		},
		_getVariantSelectionDialog: function (v) {
			if (!this._oVariantSelectionDialog) {
				this._oVariantSelectionDialog = this._createVariantSelectionDialog(v);
			} else {
				this._refreshVariantSelectionDialog(v);
			}
			return this._oVariantSelectionDialog;
		},
		_createVariantSelectionDialog: function (v) {
			var d = function () {
				var V = this._getVariantTable();
				V.removeSelections(true);
				this._oVariantSelectionDialog.close();
			}.bind(this);
			var p = [];
			p.push(v.Product);
			var t = new sap.m.Text({
				text: this.getText("SELECTION_CONFIRMATION_TEXT1", p)
			});
			var T = new sap.m.Text({
				text: this.getText("SELECTION_CONFIRMATION_TEXT2", p)
			});
			var l = new sap.ui.layout.VerticalLayout({
				id: "VarConfLayout",
				content: [t, T]
			});
			var o = new sap.m.Dialog({
				id: "preferredVariantConfirmation",
				title: this.getText("SELECTION_CONFIRMATION_TITLE"),
				content: l,
				type: sap.m.DialogType.Message,
				state: sap.ui.core.ValueState.Warning,
				buttons: [new sap.m.Button({
					id: "ConfirmVariant",
					text: this.getText("REPLACE"),
					press: function () {
						this._oVariantSelectionDialog.close();
						this.getConfigurationDAO().setPreferredVariant(v).then(function () {
							this.onVariantMatchingDialogClose();
							this.getView().getController().getOwnerComponent().firePreferredVariantSelected();
						}.bind(this));
					}.bind(this)
				}), new sap.m.Button({
					id: "CancelVariantConfirmation",
					text: this.getText("CANCEL"),
					press: d
				})],
				escapeHandler: d
			});
			return o;
		},
		_refreshVariantSelectionDialog: function (v) {
			var p = [];
			p.push(v.Product);
			var t = this.getText("SELECTION_CONFIRMATION_TEXT1", p);
			this._oVariantSelectionDialog.getContent()[0].getContent()[0].setProperty("text", t);
		},
		getVariantText: function (n, d, m, i) {
			switch (m) {
			case D.Description:
				return d || n;
			case D.TechnicalName:
				return n;
			case D.Both:
				if ((!!d && !!n) && (d !== n)) {
					return f(i, [d, n]);
				} else {
					return d || n;
				}
				break;
			}
			return d;
		},
		getCharacteristicValueDescriptionWithName: function (V, d, M, i) {
			return this.getVariantText(V, d, M, i);
		}
	});
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/configuration/dao/ConfigurationDAO', ["sap/i2d/lo/lib/zvchclfz/common/dao/BaseDAO",
	"sap/i2d/lo/lib/zvchclfz/common/Constants", "sap/i2d/lo/lib/zvchclfz/common/util/Toggle"
], function (B, C, T) {
	"use strict";
	return B.extend("sap.i2d.lo.lib.zvchclfz.components.configuration.dao.ConfigurationDAO", {
		createContext: function (c) {
			return this.create("/ConfigurationContextSet", c);
		},
		validateConfiguration: function (c) {
			var v = this.callFunction("/ValidateConfiguration", {
				ContextId: c
			});
			var r = this.readConfigurationContext(c);
			return Promise.all([v, r]);
		},
		lockConfiguration: function (c) {
			this.callFunction("/ConfigurationLock", {
				ContextId: c
			});
			this.calculatePricing(c);
			return this.readConfigurationContext(c);
		},
		unlockConfiguration: function (c) {
			this.callFunction("/ConfigurationUnlock", {
				ContextId: c
			});
			this.calculatePricing(c);
			return this.readConfigurationContext(c);
		},
		discardConfigurationDraft: function (u) {
			return this.callFunction("/DiscardConfigurationDraft", u);
		},
		calculatePricing: function (c) {
			return this.callFunction("/CalculatePricing", {
				ContextId: c
			});
		},
		readFeatureToggles: function () {
			return this.read("/ToggleSet");
		},
		readConfigurationContext: function (c, l) {
			var r = this.getDataModel().createKey("/ConfigurationContextSet", {
				ContextId: c
			});
			var e = "Instances/CharacteristicsGroups,InconsistencyInformation";
			if (l) {
				e = "Instances/CharacteristicsGroups,InconsistencyInformation,UISettings";
			}
			return this.read(r, {
				"$expand": e
			});
		},
		readFullMatchingVariants: function (c, i, u) {
			var r = this.getDataModel().createKey("/ConfigurationInstanceSet", {
				ContextId: c,
				InstanceId: i
			}) + "/FullMatchingVariants";
			return this.read(r, u);
		},
		readAllMaterialVariants: function (c, i, u, f) {
			var p = this.getDataModel().createKey("/ConfigurationInstanceSet", {
				ContextId: c,
				InstanceId: i
			}) + "/MaterialVariants";
			return this.read(p, u, null, f);
		},
		setPreferredVariant: function (v) {
			return this.callFunction("/SetPreferredVariant", {
				ContextId: v.ContextId,
				InstanceId: v.InstanceId,
				Product: v.Product,
				Plant: v.Plant,
				Cuobj: v.Cuobj
			});
		},
		createFullyMatchingProductVariant: function (c) {
			return this.callFunction("/CreateFullyMatchingProductVariant", {
				ContextId: c
			});
		},
		switchToETO: function (c) {
			return this.callFunction("/SwitchToETO", {
				ContextId: c
			});
		},
		setETOStatus: function (c, s) {
			return this.callFunction("/SetETOStatus", {
				ContextId: c,
				Status: s
			});
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/configuration/dao/PersonalizationDAO', ["jquery.sap.global",
	"sap/ui/base/ManagedObject", "sap/i2d/lo/lib/zvchclfz/common/Constants", "sap/i2d/lo/lib/zvchclfz/common/type/DescriptionMode"
], function (q, M, C, D) {
	"use strict";
	var I = "#COMMON";
	var a = {
		descriptionMode: D.Description,
		StructurePanelButtonPressed: null,
		InspectorButtonPressed: false,
		showHiddenCharacteristics: false,
		showPreciseNumbers: false
	};
	var b = {
		BOMColumnsVariant: {
			defaultKey: "",
			variantItems: {}
		}
	};
	var g = function () {
		if (sap.ushell && sap.ushell.Container) {
			return sap.ushell.Container.getService("Personalization");
		}
		return null;
	};
	var P = M.extend("sap.i2d.lo.lib.zvchclfz.components.configuration.dao.PersonalizationDAO", {
		metadata: {
			manifest: "json",
			properties: {
				itemKey: {
					type: "string"
				}
			},
			events: {
				changed: {
					parameters: {
						data: "object"
					}
				}
			}
		},
		_getId: function () {
			return {
				container: "vchSettings",
				item: this.getItemKey()
			};
		},
		_getPersonalizer: function () {
			var p = g();
			return p.getPersonalizer(this._getId());
		},
		_getCommonPersonalizer: function () {
			var p = g();
			return p.getPersonalizer({
				container: "vchSettings",
				item: I
			});
		},
		_getValidBoolean: function (n, p, d) {
			if (typeof (n) === "boolean") {
				return n;
			} else if (typeof (p) === "boolean") {
				return p;
			} else {
				return d;
			}
		},
		_getValidObject: function (n, p, d) {
			if (typeof (n) === "object") {
				return n;
			} else if (typeof (p) === "object") {
				return p;
			} else {
				return d;
			}
		},
		_buildUserSettingsObject: function (n, s) {
			var d = P.getDefaultUserSettings();
			var c = n.descriptionMode || s.descriptionMode || d.descriptionMode;
			var S = this._getValidBoolean(n.showHiddenCharacteristics, s.showHiddenCharacteristics, d.showHiddenCharacteristics);
			var e = this._getValidBoolean(n.showPreciseNumbers, s.showPreciseNumbers, d.showPreciseNumbers);
			var f = this._getValidBoolean(n.StructurePanelButtonPressed, s.StructurePanelButtonPressed, !!d.StructurePanelButtonPressed);
			var i = this._getValidBoolean(n.InspectorButtonPressed, s.InspectorButtonPressed, d.InspectorButtonPressed);
			var B = this._getValidObject(n.BOMColumnsVariant, s.BOMColumnsVariant, d.BOMColumnsVariant);
			return {
				descriptionMode: c,
				StructurePanelButtonPressed: f,
				InspectorButtonPressed: i,
				showHiddenCharacteristics: S,
				showPreciseNumbers: e,
				BOMColumnsVariant: B
			};
		},
		showHiddenCharacteristics: false,
		getData: function () {
			return new Promise(function (r) {
				Promise.all([this._getPersonalizer().getPersData(), this._getCommonPersonalizer().getPersData()]).then(function (R) {
					var d = $.extend({}, $.extend({}, a, R[0]), $.extend({}, b, R[1]));
					d.showHiddenCharacteristics = this.showHiddenCharacteristics;
					r(d);
				}.bind(this));
			}.bind(this));
		},
		setData: function (d) {
			this.showHiddenCharacteristics = d.showHiddenCharacteristics;
			return this.getData().then(this._buildUserSettingsObject.bind(this, d)).then(function (n) {
				var s = {};
				var c = {};
				$.each(n, function (k, v) {
					if (a[k] !== undefined) {
						s[k] = v;
					} else if (b[k] !== undefined) {
						c[k] = v;
					}
				});
				return Promise.all([this._getPersonalizer().setPersData(s), this._getCommonPersonalizer().setPersData(c)]).then(function (r) {
					var S = $.extend({}, $.extend({}, a, r[0]), $.extend({}, b, r[1]));
					this.fireChanged({
						data: S
					});
					return S;
				}.bind(this));
			}.bind(this));
		},
		setDataWithoutChangeEvent: function (d) {
			return this.getData().then(this._buildUserSettingsObject.bind(this, d)).then(function (n) {
				var s = {};
				var c = {};
				$.each(n, function (k, v) {
					if (a[k] !== undefined) {
						s[k] = v;
					} else if (b[k] !== undefined) {
						c[k] = v;
					}
				});
				Promise.all([this._getPersonalizer().setPersData(s), this._getCommonPersonalizer().setPersData(c)]).then(function (r) {
					return $.extend({}, $.extend({}, a, r[0]), $.extend({}, b, r[1]));
				});
			}.bind(this));
		}
	});
	P.isSupported = function () {
		return !!g();
	};
	P.getDefaultUserSettings = function () {
		return $.extend({}, a, b);
	};
	P.getDefaultCommonUserSettings = function () {
		return b;
	};
	return P;
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/configuration/factory/FactoryBase', [
	"sap/i2d/lo/lib/zvchclfz/common/factory/FactoryBase"
], function (F) {
	"use strict";
	return F.extend("sap.i2d.lo.lib.zvchclfz.components.configuration.factory.FactoryBase", {
		metadata: {
			properties: {
				configurationDAO: {
					type: "sap.i2d.lo.lib.zvchclfz.components.configuration.dao.ConfigurationDAO"
				}
			}
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/configuration/factory/HeaderFactory', ["sap/ui/base/ManagedObject", "sap/m/Label"],
	function (M, L) {
		"use strict";
		var H = M.extend("sap.i2d.lo.lib.zvchclfz.components.configuration.factory.HeaderFactory", {
			metadata: {
				properties: {
					controller: {
						type: "sap.ui.core.mvc.Controller"
					}
				}
			},
			createField: function (i, h) {
				var c = this._createControl(i, h);
				var l = new L({
					id: this._createId(i, h, "title"),
					text: h.description,
					labelFor: c.getId()
				});
				if (c.addAriaLabelledBy) {
					c.addAriaLabelledBy(l);
				}
				var v = new sap.m.VBox(i, {
					visible: h.properties.visible
				});
				v.addItem(l);
				v.addItem(c);
				if (h.controlType === "ObjectStatus") {
					c.addStyleClass("sapMObjectStatusLarge");
					v.addItem(new sap.m.Text({
						text: ""
					}));
				}
				v.addStyleClass("sapNoMarginBegin");
				v.addStyleClass("sapUiNoMarginEnd");
				v.addStyleClass("sapSmallMarginBottom");
				return v;
			},
			createAction: function (i, h) {
				return this._createControl(i, h);
			},
			_createControl: function (i, h) {
				this._updateEventHandler(h);
				var I = this._createId(i, h);
				return sap.m[h.controlType] && new sap.m[h.controlType](I, h.properties) || jQuery.sap.getObject(h.controlType) && new(jQuery.sap.getObject(
					h.controlType))(I, h.properties);
			},
			_createId: function (i, h, I) {
				return h.properties.id ? (i + "--" + h.properties.id + (I ? "--" + I : "")) : (i + "--undefined" + (I ? "--" + I : ""));
			},
			_updateEventHandler: function (h) {
				if (h.properties) {
					if (h.properties.press) {
						h.properties.press = this._resolveEventHandler(h.properties.press);
					} else if (h.properties.defaultAction) {
						h.properties.defaultAction = this._resolveEventHandler(h.properties.defaultAction);
						h.properties.menu.itemSelected = this._resolveEventHandler(h.properties.menu.itemSelected);
					}
				}
			},
			_resolveEventHandler: function (h) {
				var c = this.getController();
				var f = h;
				if (typeof h === "string") {
					if (h.indexOf(".") === 0) {
						h = h.slice(1);
					}
					if (c && c[h]) {
						f = c[h];
					} else {
						f = jQuery.sap.getObject(h);
					}
					if (!f) {
						throw new Error("HeaderFactory: Could not find handler function '" + h + "'");
					}
					f = [f, c];
				}
				return f;
			}
		});
		H.getHeaderFieldFromContext = function (c) {
			var p = c.getPath();
			return c.getModel().getProperty(p);
		};
		return H;
	});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/configuration/formatter/HeaderFieldFormatter', ["sap/ui/model/type/Currency",
	"sap/i2d/lo/lib/zvchclfz/common/util/Toggle", "sap/i2d/lo/lib/zvchclfz/common/Constants", "sap/base/strings/formatMessage"
], function (C, T, a, f) {
	"use strict";
	var F = {
		getText: function (d, t, i) {
			if (!!d && !!t) {
				return f(i, [d, t]);
			} else {
				return d || t;
			}
		},
		getConcatenatedObjectKey: function (A, s) {
			if (!!A && !!s) {
				return f("{0}{1}{2}", [A, '&', s]);
			} else if (A) {
				return f("{0}", [A]);
			} else if (s) {
				return f("{0}{1}", ['&', s]);
			} else {
				return "";
			}
		},
		formatPrice: function (p, P, u) {
			var s = new C().formatValue([P], "string");
			return f(p, s, u);
		},
		formatDateTime: function (d) {
			if (d instanceof Date) {
				var D = sap.ui.core.format.DateFormat.getDateTimeInstance();
				return D.format(d);
			}
		},
		formatDate: function (d) {
			if (d instanceof Date) {
				var D = sap.ui.core.format.DateFormat.getDateInstance();
				return D.format(d);
			}
		},
		getVariantMatchingVisibility: function (v, u, V) {
			var m = this.getModel(a.VCHCLF_MODEL_NAME);
			if (!m || !u) {
				return false;
			}
			if (v !== 0 && v !== 1) {
				if (u.ProductVariantCreationAllowed && V) {
					return true;
				} else if (!u.ProductVariantCreationAllowed && !V) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		},
		getETOSwitchVisible: function (e, u, E) {
			if (!E || !u || e !== "") {
				return false;
			}
			if (u.EtoProcessType !== "3") {
				return false;
			}
			if (e === "") {
				return true;
			} else {
				return false;
			}
		},
		isCreateVariantItemEnabled: function (c, s, u) {
			if (c !== "1") {
				return false;
			}
			if (!u) {
				return false;
			}
			if (s === "\u2013") {
				return true;
			} else {
				return false;
			}
		},
		getReviseChangesButtonVisible: function (e, u) {
			if (u === "Display") {
				return false;
			}
			if (e === a.ETO_STATUS.ENGINEERING_FINISHED || e === a.ETO_STATUS.REVIEW_FINISHED_BY_SALES) {
				return true;
			} else {
				return false;
			}
		},
		getHandoverToEngineeringButtonVisible: function (e, E) {
			if (!E) {
				return false;
			}
			if (e === a.ETO_STATUS.PROCESSING_STARTED) {
				return true;
			} else {
				return false;
			}
		},
		getHandBackToEngineeringButtonVisible: function (e, E) {
			if (!E) {
				return false;
			}
			if (e === a.ETO_STATUS.REVISED_BY_SALES) {
				return true;
			} else {
				return false;
			}
		},
		getAcceptReviewButtonVisible: function (e, u) {
			if (u === "Display") {
				return false;
			}
			if (e === a.ETO_STATUS.ENGINEERING_FINISHED) {
				return true;
			} else {
				return false;
			}
		}
	};
	return F;
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/configuration/formatter/InconsistencyInformationFormatter', [
	"sap/i2d/lo/lib/zvchclfz/common/Constants", "sap/base/strings/formatMessage"
], function (C, f) {
	"use strict";
	var F = {
		_formatMessage: function (i, l, n) {
			return f(i, [l, n]);
		},
		_getInconsistencyInformationControlData: function (I) {
			var h = false;
			var H = false;
			var b = false;
			var a = false;
			if (I) {
				for (var i = 0; i < I.length; i++) {
					var o = this.getView().getModel("vchclf").getProperty("/" + I[i]);
					if (o.DependencyId) {
						h = true;
						a = false;
						var c = I.filter(function (s) {
							var d = this.getView().getModel("vchclf").getProperty("/" + s);
							return d.HasDocumentation;
						}.bind(this));
						if (c.length > 1) {
							b = true;
						} else if (c.length === 1) {
							H = true;
						}
						break;
					} else {
						h = false;
						if (o.CsticId) {
							a = true;
						}
					}
				}
			}
			return {
				hasObjectDependencyInformation: h,
				hasMultipleLongTextInformation: b,
				hasSingleLongTextInformation: H,
				hasCsticInformation: a
			};
		},
		formatCsticValue: function (i, v, V, d, I, D) {
			var n = v;
			if (V) {
				n = f(I, [v, V]);
			}
			return this.getFormatter("InconsistencyInformationFormatter").combineDescriptionAndValue(i, n, d, D);
		},
		combineDescriptionAndValue: function (i, n, d, D) {
			switch (D) {
			case sap.i2d.lo.lib.zvchclfz.common.type.DescriptionMode.TechnicalName:
				return n;
			case sap.i2d.lo.lib.zvchclfz.common.type.DescriptionMode.Description:
				return d || n;
			case sap.i2d.lo.lib.zvchclfz.common.type.DescriptionMode.Both:
				if ((!!d && !!n) && (d !== n)) {
					return f(i, [d, n]);
				} else {
					return d || n;
				}
			default:
				return d || n;
			}
		},
		getTextForInconsistentInstance: function (i, I, s, a, b, S, c, d, e) {
			var g = false;
			var o = this.getFormatter("InconsistencyInformationFormatter");
			var h = "";
			var j = s;
			if (!i) {
				return;
			}
			if (i.length > 1) {
				g = true;
			}
			var k = o._getInconsistencyInformationControlData.call(this, c);
			if (g) {
				if (k.hasCsticInformation) {
					j = a;
				} else {
					j = I;
				}
				i.forEach(function (n) {
					var l = this.getView().getModel("vchclf").getProperty("/" + n);
					if (l.ConfigurationValidationStatus === "4") {
						h = o.combineDescriptionAndValue(e, l.Material, l.MaterialDescription, d);
						return false;
					}
				}.bind(this));
			} else {
				if (k.hasCsticInformation) {
					j = b;
				} else {
					j = s;
				}
				var l = this.getView().getModel("vchclf").getProperty("/" + i[0]);
				h = o.combineDescriptionAndValue(e, l.Material, l.MaterialDescription, d);
			}
			var m = "";
			if (k.hasCsticInformation) {
				c.forEach(function (n) {
					var p = this.getView().getModel("vchclf").getProperty("/" + n);
					var q = p.CsticDescription;
					var r = p.CsticName;
					m = o.combineDescriptionAndValue(e, r, q, d);
					return false;
				}.bind(this));
			}
			return f(j, [h, m]);
		},
		getTextForInconsistencyLink: function (i, I) {
			var o = {};
			if (this._getInconsistencyInformationControlData) {
				o = this._getInconsistencyInformationControlData(I);
			} else {
				o = this.getFormatter("InconsistencyInformationFormatter")._getInconsistencyInformationControlData.call(this, I);
			}
			if (o.hasMultipleLongTextInformation || o.hasSingleLongTextInformation || o.hasObjectDependencyInformation) {
				return i;
			} else {
				return "";
			}
		},
		getVisibilityOfInconsistencyLink: function (i, I) {
			var l = this.getFormatter("InconsistencyInformationFormatter").getTextForInconsistencyLink.call(this, i, I);
			if (l) {
				return true;
			} else {
				return false;
			}
		},
		getDocumentationVisibility: function (t, i) {
			if (!i || i.length === 0) {
				return false;
			}
			var I = this.getFormatter("InconsistencyInformationFormatter")._getInconsistencyInformationControlData.call(this, i);
			var v = false;
			switch (t) {
			case C.INCONSISTENCY_INFORMATION.MULTI_DOCU:
				if ((I.hasMultipleLongTextInformation || i.length > 1)) {
					v = true;
				}
				break;
			case C.INCONSISTENCY_INFORMATION.SINGLE_DOCU:
				if (I.hasSingleLongTextInformation && i.length === 1) {
					v = true;
				} else if (I.hasObjectDependencyInformation && (!I.hasMultipleLongTextInformation && !I.hasSingleLongTextInformation) && i.length ===
					1) {
					v = true;
				}
				break;
			}
			return v;
		},
		getDependencyTypeDesc: function (i, d, D) {
			return f(i, [d, D]);
		},
		formatDependencyFormTitle: function (i, I) {
			return this.getFormatter("InconsistencyInformationFormatter").formatPopoverTitle.apply(this, [i, I]);
		}
	};
	return F;
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/configuration/type/EmbeddingMode', [], function () {
	"use strict";
	return {
		Configuration: "Configuration",
		Simulation: "Simulation"
	};
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/configuration/type/LegacyScenario', [], function () {
	"use strict";
	return {
		NonLegacy: "",
		Legacy: "X"
	};
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/configuration/type/VariantMatchingMode', [], function () {
	"use strict";
	return {
		NoMatching: 1,
		MatchingWithoutSelection: 2,
		MatchingWithSelection: 3
	};
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/Component', ["sap/i2d/lo/lib/zvchclfz/components/inspector/config/UiConfig",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants", "sap/i2d/lo/lib/zvchclfz/components/inspector/logic/EventProvider",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/NavigationManager", "sap/i2d/lo/lib/zvchclfz/components/inspector/util/i18n",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/ODataModelHelper", "sap/i2d/lo/lib/zvchclfz/components/inspector/util/TraceUtil",
	"sap/base/Log", "sap/ui/core/UIComponent"
], function (U, C, E, I, N, i, O, T, L, a) {
	"use strict";
	return a.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.Component", {
		metadata: {
			manifest: "json",
			properties: {
				modelName: {
					type: "string"
				},
				semanticObject: {
					type: "string"
				},
				uiMode: {
					type: "string",
					defaultValue: "Display"
				},
				personalizationDAO: {
					type: "sap.i2d.lo.lib.zvchclfz.components.configuration.dao.PersonalizationDAO"
				},
				showPreciseNumbers: {
					type: "boolean"
				}
			},
			events: {
				closePanelPressed: {},
				traceInitiallyActive: {},
				navigationToBOMwithoutBOMApp: {},
				navigationToBOMCanNotBeFound: {},
				openPanel: {}
			}
		},
		exit: function () {
			N.teardown();
			O.destroy();
		},
		_initializeModel: function () {
			if (typeof this.getModelName() !== "string") {
				L.error("Missing model name", "Please set the modelName property for the component",
					"sap.i2d.lo.lib.zvchclfz.components.inspector.Component");
			} else {
				var m = this.getModel(this.getModelName());
				if (m) {
					O.init(m);
					i.initModel(this.getModel("i18n"));
					this.setModel(m);
					if (!this.getModel("global")) {
						this.setModel(I.getModel(), "global");
					}
				} else {
					L.error("Invalid model name", "There is no model with this name", "sap.i2d.lo.lib.zvchclfz.components.inspector.Component");
				}
			}
		},
		restrictComparisonView: function (c) {
			E.fireRestrictComparison({
				oConfigurationInstance: c
			});
		},
		_processNavigation: function (o, s, b, k) {
			if (b) {
				I.selectInspectorView();
				this.fireOpenPanel();
			}
			if (!I.compareWithLastAccessObject(o, s)) {
				I.setLastAccessObject(o, s);
				if (I.getInspectorVisibility()) {
					N.setOwnerComponent(this);
					N.setRoot(o, s, k);
					I.setInspectorComponentUpdated(true);
				} else {
					I.setInspectorComponentUpdated(false);
				}
			}
		},
		onBeforeRendering: function () {
			this.updateNavigationManager();
		},
		updateNavigationManager: function () {
			if (I.getInspectorVisibility() && I.getLastAccessObjectPath() && I.getLastAccessObjectType()) {
				if (!I.getInspectorComponentUpdated()) {
					N.setOwnerComponent(this);
					N.setRoot(I.getLastAccessObjectPath(), I.getLastAccessObjectType());
					I.setInspectorComponentUpdated(true);
				} else if (I.getInspectorContentInvalidated()) {
					N.reloadContentOfPages();
				}
			}
		},
		_processIfEventConnected: function (o, s, k) {
			if (I.getProperty("/isTrackEventConnected")) {
				this._processNavigation(o, s, false, k);
			}
		},
		inspectObject: function (o, s, b, k, f) {
			if (b) {
				this._processNavigation(o, s, true, k);
				E.fireChangeTheSelectedTabOfInspector({
					tabKey: b
				});
			} else if (f) {
				this._processNavigation(o, s, false, k);
			} else {
				this._processIfEventConnected(o, s, k);
			}
		},
		isObjectInspected: function (o, s) {
			return I.compareWithLastAccessObject(o, s);
		},
		openConfigurationProfileProperties: function (p, b) {
			var c = this.getModel().createKey(C.entitySets.ConfigurationProfile, {
				ContextId: I.getConfigurationContextId(),
				ConfigurationProfileNumber: p.counter,
				Product: p.product
			});
			this._processNavigation("/" + c, U.inspectorMode.objectType.ConfigurationProfile, !b);
		},
		openDependencyDetails: function (d) {
			if (d) {
				var p = this.getModel().createKey("/" + C.entitySets.ObjectDependencyDetails, {
					ContextId: I.getConfigurationContextId(),
					ObjectDependency: d
				});
				this._processNavigation(p, U.inspectorMode.objectType.ObjectDependency, true);
			}
		},
		updateConfigurationContextId: function (c, s, p, b) {
			this._initializeModel();
			if (c && typeof c === "string") {
				var P = I.getConfigurationContextId();
				var u = this.getProperty("uiMode");
				var d = u === C.uiMode.Create || u === C.uiMode.Edit;
				var e = this.getSemanticObject() === C.semanticObject.variantConfiguration;
				I.setupModel(c, s, p, this.getProperty("showPreciseNumbers"), d, e);
				if (c !== P) {
					this.resetTrace();
				}
				if (this.getSemanticObject() !== C.semanticObject.variantConfiguration || !b) {
					this.openConfigurationProfileProperties({
						product: "",
						counter: ""
					}, true);
				}
				if (I.getProperty("/isConfigComparisonAllowed")) {
					I.selectComparisonView();
					E.fireInitComparison({
						configurationContextId: I.getConfigurationContextId()
					});
				} else {
					T.checkTraceIsSupportedAndActive(c).then(function () {
						I.setProperty("/isTraceOn", true);
						I.setProperty("/isTraceActivatedOnce", true);
						I.selectTraceView();
						this.triggerTraceFetch();
						this.fireTraceInitiallyActive();
					}.bind(this)).catch(function () {
						I.setProperty("/isTraceOn", false);
						I.setProperty("/isTraceActivatedOnce", false);
						I.selectInspectorView();
						this.updateNavigationManager();
					}.bind(this));
				}
			} else {
				L.error("Invalid parameter.", "Context ID is mandatory in string format.", "sap.i2d.lo.lib.zvchclfz.components.inspector");
			}
		},
		resetInspector: function () {
			N.resetRoot();
			I.setInspectorComponentUpdated(false);
		},
		resetTrace: function () {
			E.fireResetTrace();
		},
		saveTraceState: function () {
			E.fireSaveTraceState();
		},
		restoreTraceState: function () {
			E.fireRestoreTraceState();
		},
		refreshCharacteristicValues: function (c) {
			var m = this.getModel(this.getModelName());
			var s = I.getLastAccessObjectPath();
			$.each(c, function (b, v) {
				var d = "/" + m.createKey(C.entitySets.Characteristic, {
					GroupId: v.GroupId,
					InstanceId: v.InstanceId,
					CsticId: v.CsticId,
					ContextId: v.ContextId
				});
				if (d === s) {
					E.fireRebindValueList({
						csticPath: d
					});
					N.removeValuePages();
					return false;
				}
				return undefined;
			});
		},
		refreshRoutingItem: function () {
			var r = [U.inspectorMode.objectType.RoutingHeader, U.inspectorMode.objectType.ParallelSequence, U.inspectorMode.objectType.AlternativeSequence,
				U.inspectorMode.objectType.Operation, U.inspectorMode.objectType.SubOperation, U.inspectorMode.objectType.PRT
			];
			if (r.indexOf(I.getLastAccessObjectType()) >= 0) {
				this._reloadContentOfPages();
			}
		},
		refreshBOMItem: function () {
			var b = [U.inspectorMode.objectType.BOMComponent, U.inspectorMode.objectType.ClassNode];
			if (b.indexOf(I.getLastAccessObjectType()) >= 0) {
				this._reloadContentOfPages();
			}
		},
		_reloadContentOfPages: function () {
			if (I.getInspectorVisibility()) {
				N.reloadContentOfPages();
			} else {
				I.setInspectorContentInvalidated();
			}
		},
		triggerTraceFetch: function () {
			if (I.getProperty("/isTraceOn")) {
				E.fireFetchTrace();
			}
		},
		setVisibilityCheckCallBack: function (c) {
			I.setInspectorVisibilityChecker(c);
		},
		setUiMode: function (u) {
			var e = u === C.uiMode.Create || u === C.uiMode.Edit;
			this.setProperty("uiMode", u);
			I.setIsInspectorEditable(e);
		},
		setShowPreciseNumbers: function (s) {
			this.setProperty("showPreciseNumbers", s);
			I.setShowPreciseNumbers(s);
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/config/TraceEntryTextTypes', [
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/TraceFilterTypes", "sap/i2d/lo/lib/zvchclfz/components/inspector/config/UiConfig",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/ValuesFormatter", "sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/i18n", "sap/i2d/lo/lib/zvchclfz/components/inspector/util/ODataModelHelper"
], function (T, U, V, C, i, O) {
	"use strict";
	var I = {
		OpenDomain: "{CVC_OPEN}",
		ValueAssigned: "{CVC_ASSIGNED}",
		ValuePending: "{CVC_PENDING}"
	};
	var t = {
		CharacteristicValue: "{CharacteristicValue}",
		EnDash: "{EN_DASH}",
		FactorValue: "{FactorValue}",
		VariantCondValue: "{VariantCondValue}"
	};
	var s = {
		BOMComponent: "{BOMComponent}",
		Characteristic: "{Characteristic}",
		CharacteristicValue: "{CharacteristicValue}",
		ObjectDependency: "{ObjectDependency}",
		ObjectDependencyResult: "{ObjectDependencyResult}",
		FactorValue: "{FactorValue}",
		VariantCondValue: "{VariantCondValue}"
	};
	var f = function () {
		return i.getText("vchclf_trace_actionsheet_filter_trace");
	};
	var a = function () {
		return i.getText("vchclf_trace_actionsheet_inspect_trace");
	};
	var w = function () {
		return i.getText("vchclf_trace_actionsheet_where_was_set");
	};
	var W = function () {
		return i.getText("vchclf_trace_actionsheet_where_was_used");
	};
	var r = function () {
		return {};
	};
	return {
		SupportedObject: s,
		ValueClassifiers: {
			A: {
				Indicator: I.ValueAssigned,
				getDecoratedText: function (c) {
					return i.getTextWithParameters("vchclf_insp_common_space_separated_items", [c, this.Indicator]);
				}
			},
			P: {
				Indicator: I.ValuePending,
				getDecoratedText: function (c) {
					return i.getTextWithParameters("vchclf_insp_common_space_separated_items", [c, this.Indicator]);
				}
			},
			E: {
				Indicator: t.EnDash,
				getDecoratedText: function (c) {
					return this.Indicator;
				}
			},
			O: {
				Indicator: I.OpenDomain,
				getDecoratedText: function (c) {
					return this.Indicator;
				}
			},
			Default: {
				Indicator: "",
				getDecoratedText: function (c) {
					return c;
				}
			}
		},
		IconTypes: {
			CVC_OPEN: {
				src: "sap-icon://overflow",
				getTooltip: function () {
					return i.getText("vchclf_trace_cstic_val_classifier_open_domain");
				}
			},
			CVC_ASSIGNED: {
				src: "sap-icon://accept",
				getTooltip: function () {
					return i.getText("vchclf_trace_cstic_val_classifier_value_assigned");
				}
			},
			CVC_PENDING: {
				src: "sap-icon://BusinessSuiteInAppSymbols/icon-hourglass",
				getTooltip: function () {
					return i.getText("vchclf_trace_cstic_val_classifier_value_pending");
				}
			}
		},
		TextTypes: {
			CharacteristicValue: {
				getText: function (o, S) {
					return V.formatCharacteristicValue(o, S) || this._getEmptyValuePlaceHolder();
				},
				_getEmptyValuePlaceHolder: function () {
					return "<span style=\"font-style: italic;\">" + i.getText("vchclf_trace_cstic_val_empty_placeholder") + "</span>";
				}
			},
			ValueSetBy: {
				getText: function (o) {
					var v = C.traceFilterParameters.ValueAssignmentBy;
					switch (o.ValueSetBy.toString()) {
					case v.Default:
						return i.getText("vchclf_trace_entry_header_value_assignment_by_default");
					case v.Procedure:
						return i.getText("vchclf_trace_entry_header_value_assignment_by_procedure");
					case v.Constraint:
						return i.getText("vchclf_trace_entry_header_value_assignment_by_constraint");
					case v.User:
						return i.getText("vchclf_trace_entry_header_value_assignment_by_user");
					case v.ExtComponent:
						return i.getText("vchclf_trace_entry_header_value_assignment_by_ext_assignment");
					default:
						return "";
					}
				}
			},
			EN_DASH: {
				getText: function () {
					return "&ndash;";
				},
				getTooltip: function () {
					return i.getText("vchclf_trace_cstic_val_classifier_empty_domain");
				}
			},
			FactorValue: {
				getText: function (o, S) {
					return V.formatCharacteristicValue(o, S);
				}
			},
			VariantCondValue: {
				getText: function (o) {
					return o.VariantConditionValue;
				}
			}
		},
		LinkTypes: {
			BOMComponent: {
				Name: "BOMComponent",
				FilterType: T.SupportedTraceFilterTypes.BOMComponent,
				InspectType: "BOMComponent",
				ActionSheetTexts: {
					headerText: function () {
						return i.getText("vchclf_trace_actionsheet_header_bomcomponent");
					},
					filterText: f,
					inspectText: a
				},
				getLinkText: function (o) {
					return o.BOMComponentName;
				},
				getFilterObject: function (o) {
					return {
						type: this.FilterType,
						text: this.getLinkText(o),
						parameters: {
							BOMComponentName: o.BOMComponentName
						}
					};
				},
				getInspectObject: function (o) {
					return {
						type: this.InspectType,
						navigationObjectType: U.inspectorMode.objectType.BOMComponent,
						inspectParameters: {
							BOMComponentId: o.BOMComponentId
						}
					};
				}
			},
			ClassItem: {
				Name: "ClassItem",
				FilterType: T.SupportedTraceFilterTypes.ClassItem,
				InspectType: "BOMComponent",
				ActionSheetTexts: {
					headerText: function () {
						return i.getText("vchclf_trace_actionsheet_header_bomcomponent");
					},
					filterText: f,
					inspectText: a
				},
				getLinkText: function (o) {
					return o.Class;
				},
				getFilterObject: function (o) {
					return {
						type: this.FilterType,
						text: this.getLinkText(o),
						parameters: {
							Class: o.Class
						}
					};
				},
				getInspectObject: function (o) {
					return {
						type: this.InspectType,
						navigationObjectType: U.inspectorMode.objectType.BOMComponent,
						inspectParameters: {
							BOMComponentId: o.BOMComponentId
						}
					};
				}
			},
			Characteristic: {
				Name: "Characteristic",
				FilterType: T.SupportedTraceFilterTypes.Characteristic,
				InspectType: "Characteristic",
				ActionSheetTexts: {
					headerText: function () {
						return i.getText("vchclf_trace_actionsheet_header_cstic");
					},
					filterText: f,
					inspectText: a,
					whereWasValueSetText: w,
					whereWasCsticUsedText: W
				},
				getLinkText: function (o) {
					return o.CsticName;
				},
				getFilterObject: function (o) {
					return {
						type: this.FilterType,
						text: this.getLinkText(o),
						parameters: {
							CsticId: o.CsticId
						}
					};
				},
				getInspectObject: function (o) {
					return {
						type: this.InspectType,
						navigationObjectType: U.inspectorMode.objectType.Characteristic,
						inspectParameters: {
							CsticId: o.CsticId
						}
					};
				}
			},
			ObjectDependency: {
				Name: "ObjectDependency",
				FilterType: T.SupportedTraceFilterTypes.ObjectDependency,
				InspectType: "ObjectDependency",
				ActionSheetTexts: {
					headerText: function () {
						return i.getText("vchclf_trace_actionsheet_header_dependency");
					},
					filterText: f,
					inspectText: a
				},
				getLinkText: function (o) {
					if (!o.SubprocedureIndex) {
						return o.ObjectDependencyName;
					} else {
						return i.getTextWithParameters("vchclf_trace_msg_link_parentheses_separator", [o.ObjectDependencyName, o.SubprocedureIndex]);
					}
				},
				getFilterObject: function (o) {
					return {
						type: this.FilterType,
						text: o.ObjectDependencyName,
						parameters: {
							ObjectDependency: o.ObjectDependency
						}
					};
				},
				getInspectObject: function (o) {
					return {
						type: this.InspectType,
						navigationObjectType: U.inspectorMode.objectType.ObjectDependency,
						inspectParameters: {
							ObjectDependency: o.ObjectDependency
						}
					};
				}
			},
			ObjectDependencyResult: {
				Name: "ObjectDependencyResult",
				FilterType: T.SupportedTraceFilterTypes.ObjectDependency,
				InspectType: "ObjectDependency",
				ActionSheetTexts: {
					headerText: function () {
						return i.getText("vchclf_trace_actionsheet_header_dependency");
					},
					filterText: f,
					inspectText: a,
					whereWasDepSetText: w,
					whereWasDepUsedText: W
				},
				getLinkText: function (o) {
					if (!o.SubprocedureIndex) {
						return o.ObjectDependencyName;
					} else {
						return i.getTextWithParameters("vchclf_trace_msg_link_parentheses_separator", [o.ObjectDependencyName, o.SubprocedureIndex]);
					}
				},
				getFilterObject: function (o) {
					return {
						type: this.FilterType,
						text: o.ObjectDependencyName,
						parameters: {
							ObjectDependency: o.ObjectDependency
						}
					};
				},
				getInspectObject: function (o) {
					return {
						type: this.InspectType,
						navigationObjectType: U.inspectorMode.objectType.ObjectDependency,
						inspectParameters: {
							ObjectDependency: o.ObjectDependency
						}
					};
				}
			},
			Routing: {
				Name: "Routing",
				InspectType: "Routing",
				ActionSheetTexts: {
					headerText: function () {
						return i.getText("vchclf_trace_actionsheet_header_routing");
					},
					inspectText: a
				},
				getLinkText: function (o) {
					return i.getTextWithParameters("vchclf_trace_entry_header_routing", [o.RoutingText, o.BillOfOperationsGroup, o.BillOfOperationsVariant]);
				},
				getInspectObject: function (o) {
					return {
						type: this.InspectType,
						navigationObjectType: U.inspectorMode.objectType.RoutingHeader,
						inspectParameters: {
							BOMComponentId: o.BOMComponentId,
							BillOfOperationsType: o.BillOfOperationsType,
							BillOfOperationsGroup: o.BillOfOperationsGroup,
							BillOfOperationsVariant: o.BillOfOperationsVariant
						}
					};
				}
			},
			Operation: {
				Name: "Operation",
				FilterType: T.SupportedTraceFilterTypes.Operation,
				InspectType: "Operation",
				ActionSheetTexts: {
					headerText: function () {
						return i.getText("vchclf_trace_actionsheet_header_operation");
					},
					filterText: f,
					inspectText: a
				},
				getLinkText: function (o) {
					return i.getTextWithParameters("vchclf_trace_msg_link_space_separator", [o.BillOfOperationsOperation, o.OperationText]);
				},
				getFilterObject: function (o) {
					return {
						type: this.FilterType,
						text: this.getLinkText(o),
						parameters: {
							BillOfOperationsType: o.BillOfOperationsType,
							BillOfOperationsGroup: o.BillOfOperationsGroup,
							BillOfOperationsNode: o.BillOfOperationsNode
						}
					};
				},
				getInspectObject: function (o) {
					var n;
					if (o.NodeType === "O") {
						n = U.inspectorMode.objectType.Operation;
					} else if (o.NodeType === "S") {
						n = U.inspectorMode.objectType.SubOperation;
					}
					return {
						type: this.InspectType,
						navigationObjectType: n,
						inspectParameters: {
							TreeId: o.TreeId,
							NodeId: o.NodeId,
							BOMComponentId: o.BOMComponentId,
							BillOfOperationsType: o.BillOfOperationsType,
							BillOfOperationsGroup: o.BillOfOperationsGroup,
							BillOfOperationsVariant: o.BillOfOperationsVariant
						}
					};
				}
			},
			Sequence: {
				Name: "Sequence",
				FilterType: T.SupportedTraceFilterTypes.Sequence,
				InspectType: "Sequence",
				ActionSheetTexts: {
					headerText: function () {
						return i.getText("vchclf_trace_actionsheet_header_sequence");
					},
					filterText: f,
					inspectText: a
				},
				getLinkText: function (o) {
					return i.getTextWithParameters("vchclf_trace_msg_link_parentheses_separator", [o.SequenceText, o.BillOfOperationsSequence]);
				},
				getFilterObject: function (o) {
					return {
						type: this.FilterType,
						text: this.getLinkText(o),
						parameters: {
							BillOfOperationsType: o.BillOfOperationsType,
							BillOfOperationsGroup: o.BillOfOperationsGroup,
							BillOfOperationsVariant: o.BillOfOperationsVariant,
							BillOfOperationsSequence: o.BillOfOperationsSequence
						}
					};
				},
				getInspectObject: function (o) {
					var n;
					if (o.NodeType === "Q") {
						n = U.inspectorMode.objectType.RoutingHeader;
					} else if (o.NodeType === "A") {
						n = U.inspectorMode.objectType.AlternativeSequence;
					} else if (o.NodeType === "P") {
						n = U.inspectorMode.objectType.ParallelSequence;
					}
					return {
						type: this.InspectType,
						navigationObjectType: n,
						inspectParameters: {
							TreeId: o.TreeId,
							NodeId: o.NodeId,
							BOMComponentId: o.BOMComponentId,
							BillOfOperationsType: o.BillOfOperationsType,
							BillOfOperationsGroup: o.BillOfOperationsGroup,
							BillOfOperationsVariant: o.BillOfOperationsVariant
						}
					};
				}
			},
			PRT: {
				Name: "PRT",
				FilterType: T.SupportedTraceFilterTypes.PRT,
				InspectType: "PRT",
				ActionSheetTexts: {
					headerText: function () {
						return i.getText("vchclf_trace_actionsheet_header_prt");
					},
					filterText: f,
					inspectText: a
				},
				getLinkText: function (o) {
					return o.ProductionResourceTool ? o.ProductionResourceTool : o.BOOOperationPRTInternalId;
				},
				getFilterObject: function (o) {
					return {
						type: this.FilterType,
						text: this.getLinkText(o),
						parameters: {
							BillOfOperationsType: o.BillOfOperationsType,
							BillOfOperationsGroup: o.BillOfOperationsGroup,
							BOOOperationPRTInternalId: o.BOOOperationPRTInternalId
						}
					};
				},
				getInspectObject: function (o) {
					return {
						type: this.InspectType,
						navigationObjectType: U.inspectorMode.objectType.PRT,
						inspectParameters: {
							TreeId: o.TreeId,
							NodeId: o.NodeId,
							BOMComponentId: o.BOMComponentId,
							BillOfOperationsType: o.BillOfOperationsType,
							BillOfOperationsGroup: o.BillOfOperationsGroup,
							BillOfOperationsVariant: o.BillOfOperationsVariant,
							BOOOperationPRTInternalId: o.BOOOperationPRTInternalId,
							BOOInternalVersionCounter: o.BOOInternalVersionCounter
						}
					};
				}
			}
		},
		InspectTypes: {
			Characteristic: {
				ObjectType: U.inspectorMode.objectType.Characteristic,
				getBinding: function (o, c, b, g) {
					return {
						getPath: function () {
							return O.generateCharacteristicPath(c, b, g, o.CsticId);
						},
						getKeyValuePairs: function () {
							return O.getCharacteristicKeyValuePairs(c, b, g, o.CsticId);
						}
					};
				}
			},
			BOMComponent: {
				ObjectType: U.inspectorMode.objectType.BOMComponent,
				getBinding: function (o, c, b, g) {
					return {
						getPath: function () {
							return O.generateBOMComponentPath(c, o.BOMComponentId);
						},
						getKeyValuePairs: r
					};
				}
			},
			ObjectDependency: {
				ObjectType: U.inspectorMode.objectType.ObjectDependency,
				getBinding: function (o, c, b, g) {
					return {
						getPath: function () {
							return O.generateObjectDependencyPath(c, o.ObjectDependency);
						},
						getKeyValuePairs: r
					};
				}
			},
			Routing: {
				ObjectType: U.inspectorMode.objectType.RoutingHeader,
				getBinding: function (o, c, b, g) {
					return {
						getPath: function () {
							return O.generateRoutingNodePath(c, o.BOMComponentId, {
								BillOfOperationsType: o.BillOfOperationsType,
								BillOfOperationsGroup: o.BillOfOperationsGroup,
								BillOfOperationsVariant: o.BillOfOperationsVariant
							}, C.standardSequenceTreeId, C.defaultRoutingRootNodeId);
						},
						getKeyValuePairs: r
					};
				}
			},
			Operation: {
				ObjectType: U.inspectorMode.objectType.Operation,
				getBinding: function (o, c, b, g) {
					return {
						getPath: function () {
							return O.generateRoutingNodePath(c, o.BOMComponentId, {
								BillOfOperationsType: o.BillOfOperationsType,
								BillOfOperationsGroup: o.BillOfOperationsGroup,
								BillOfOperationsVariant: o.BillOfOperationsVariant
							}, o.TreeId, o.NodeId);
						},
						getKeyValuePairs: r
					};
				}
			},
			Sequence: {
				ObjectType: U.inspectorMode.objectType.RoutingHeader,
				getBinding: function (o, c, b, g) {
					return {
						getPath: function () {
							return O.generateRoutingNodePath(c, o.BOMComponentId, {
								BillOfOperationsType: o.BillOfOperationsType,
								BillOfOperationsGroup: o.BillOfOperationsGroup,
								BillOfOperationsVariant: o.BillOfOperationsVariant
							}, o.TreeId, o.NodeId);
						},
						getKeyValuePairs: r
					};
				}
			},
			PRT: {
				ObjectType: U.inspectorMode.objectType.PRT,
				getBinding: function (o, c, b, g) {
					return {
						getPath: function () {
							return O.generateRoutingPRTPath(c, o.BOMComponentId, {
								BillOfOperationsType: o.BillOfOperationsType,
								BillOfOperationsGroup: o.BillOfOperationsGroup,
								BillOfOperationsVariant: o.BillOfOperationsVariant
							}, o.TreeId, o.NodeId, {
								BOOOperationPRTInternalId: o.BOOOperationPRTInternalId,
								BOOOperationPRTIntVersCounter: o.BOOOperationPRTIntVersCounter
							});
						},
						getKeyValuePairs: r
					};
				}
			}
		}
	};
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/config/TraceFilterDialogConfig', [
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/TraceFilterDialogConfigHelper",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/TraceFilterTypes", "sap/i2d/lo/lib/zvchclfz/components/inspector/util/i18n"
], function (H, T, i) {
	"use strict";
	var a = "TraceEntryLevel";
	var M = "MessageType";
	var V = "ValueAssignmentBy";
	var C = "CsticId";
	var O = "ObjectDependency";
	var t = {
		All: "",
		Low: "L",
		High: "H"
	};
	var m = {
		ValueAssignment: "VAL_ASSIGN",
		ValueRestriction: "VAL_RESTR",
		ValueSkipped: "VAL_SKIP",
		ValueRetraction: "VAL_RETRACT",
		BAdI: "BADI",
		InconsistencyDetected: "INCONS_DETECTED",
		ProcessingStarted: "PROC_STARTED",
		ProcessingSkipped: "PROC_SKIPPED",
		PricingFactor: "PRICING_FACTOR",
		CharacteristicFacet: "CSTIC_FACET",
		HighLevelCondition: "HL_CONDITION",
		LowLevelSelectionCondition: "LL_SEL_COND",
		LowLevelProcedureExecution: "LL_PROC_EXEC",
		ClassItemSubstitution: "CLASS_SUBSTIT"
	};
	var v = {
		Default: "DEFAULT",
		Procedure: "PROC",
		Constraint: "CONSTR",
		User: "USER",
		Precondition: "PRECOND",
		ExtComponent: "EXT",
		TemplatePattern: "TEMPLATE"
	};
	var f = {
		Single: "single",
		Multi: "multi"
	};
	var o = {};
	o[t.All] = {
		key: t.All,
		text: ""
	};
	o[t.Low] = {
		key: t.Low,
		text: function () {
			return i.getText("vchclf_trace_filter_dialog_trace_level_low");
		}
	};
	o[t.High] = {
		key: t.High,
		text: function () {
			return i.getText("vchclf_trace_filter_dialog_trace_level_high");
		}
	};
	var b = {};
	b[m.ValueAssignment] = {
		key: m.ValueAssignment,
		text: function () {
			return i.getText("vchclf_trace_filter_dialog_message_types_value_assignment");
		},
		traceLevel: t.High
	};
	b[m.ValueRestriction] = {
		key: m.ValueRestriction,
		text: function () {
			return i.getText("vchclf_trace_filter_dialog_message_types_value_restriction");
		},
		traceLevel: t.High
	};
	b[m.ValueSkipped] = {
		key: m.ValueSkipped,
		text: function () {
			return i.getText("vchclf_trace_filter_dialog_message_types_value_skipped");
		},
		traceLevel: t.High
	};
	b[m.ValueRetraction] = {
		key: m.ValueRetraction,
		text: function () {
			return i.getText("vchclf_trace_filter_dialog_message_types_value_retraction");
		},
		traceLevel: t.High
	};
	b[m.BAdI] = {
		key: m.BAdI,
		text: function () {
			return i.getText("vchclf_trace_filter_dialog_message_types_badi");
		},
		traceLevel: t.High
	};
	b[m.InconsistencyDetected] = {
		key: m.InconsistencyDetected,
		text: function () {
			return i.getText("vchclf_trace_filter_dialog_message_types_inconsistency_detected");
		},
		traceLevel: t.High
	};
	b[m.ProcessingStarted] = {
		key: m.ProcessingStarted,
		text: function () {
			return i.getText("vchclf_trace_filter_dialog_message_types_processing_started");
		},
		traceLevel: t.All
	};
	b[m.ProcessingSkipped] = {
		key: m.ProcessingSkipped,
		text: function () {
			return i.getText("vchclf_trace_filter_dialog_message_types_processing_skipped");
		},
		traceLevel: t.All
	};
	b[m.PricingFactor] = {
		key: m.PricingFactor,
		text: function () {
			return i.getText("vchclf_trace_filter_dialog_message_types_pricing_factor");
		},
		traceLevel: t.High
	};
	b[m.CharacteristicFacet] = {
		key: m.CharacteristicFacet,
		text: function () {
			return i.getText("vchclf_trace_filter_dialog_message_types_characteristic_facet");
		},
		traceLevel: t.High
	};
	b[m.HighLevelCondition] = {
		key: m.HighLevelCondition,
		text: function () {
			return i.getText("vchclf_trace_filter_dialog_message_types_high_level_condition");
		},
		traceLevel: t.High
	};
	b[m.LowLevelSelectionCondition] = {
		key: m.LowLevelSelectionCondition,
		text: function () {
			return i.getText("vchclf_trace_filter_dialog_message_types_low_level_selection_cond");
		},
		traceLevel: t.Low
	};
	b[m.LowLevelProcedureExecution] = {
		key: m.LowLevelProcedureExecution,
		text: function () {
			return i.getText("vchclf_trace_filter_dialog_message_types_low_level_procedure_exec");
		},
		traceLevel: t.Low
	};
	b[m.ClassItemSubstitution] = {
		key: m.ClassItemSubstitution,
		text: function () {
			return i.getText("vchclf_trace_filter_dialog_message_types_class_item_substitution");
		},
		traceLevel: t.Low
	};
	var c = {};
	c[v.User] = {
		key: v.User,
		text: function () {
			return i.getText("vchclf_trace_filter_dialog_value_assignment_by_user");
		}
	};
	c[v.Constraint] = {
		key: v.Constraint,
		text: function () {
			return i.getText("vchclf_trace_filter_dialog_value_assignment_by_constraint");
		}
	};
	c[v.Procedure] = {
		key: v.Procedure,
		text: function () {
			return i.getText("vchclf_trace_filter_dialog_value_assignment_by_procedure");
		}
	};
	c[v.Precondition] = {
		key: v.Precondition,
		text: function () {
			return i.getText("vchclf_trace_filter_dialog_value_assignment_by_precondition");
		}
	};
	c[v.Default] = {
		key: v.Default,
		text: function () {
			return i.getText("vchclf_trace_filter_dialog_value_assignment_by_default");
		}
	};
	c[v.ExtComponent] = {
		key: v.ExtComponent,
		text: function () {
			return i.getText("vchclf_trace_filter_dialog_value_assignment_by_ext_component");
		}
	};
	c[v.TemplatePattern] = {
		key: v.TemplatePattern,
		text: function () {
			return i.getText("vchclf_trace_filter_dialog_value_assignment_by_template_pattern");
		}
	};
	var s = {};
	s[T.SupportedTraceFilterTypes.TraceLevel] = {
		property: a,
		convertFiltersToInternal: function (e) {
			return H.convertSingleFilterToInternal(e, this.property);
		},
		convertFiltersToExternal: function (I) {
			return H.convertSingleFilterToExternal(I, o, this.property);
		}
	};
	s[T.SupportedTraceFilterTypes.MessageType] = {
		property: M,
		convertFiltersToInternal: function (e) {
			return H.convertMultiFilterToInternal(e, this.property);
		},
		convertFiltersToExternal: function (I) {
			return H.convertMultiFilterToExternal(I, b, this.property);
		}
	};
	s[T.SupportedTraceFilterTypes.ValueAssignmentBy] = {
		property: V,
		convertFiltersToInternal: function (e) {
			return H.convertMultiFilterToInternal(e, this.property);
		},
		convertFiltersToExternal: function (I) {
			return H.convertMultiFilterToExternal(I, c, this.property);
		}
	};
	s[T.SupportedTraceFilterTypes.Characteristic] = {
		property: C,
		convertFiltersToInternal: function (e) {
			return H.convertVHFilterToInternal(e, this.property);
		},
		convertFiltersToExternal: function (I) {
			return H.convertVHFilterToExternal(I, this.property);
		}
	};
	s[T.SupportedTraceFilterTypes.ObjectDependency] = {
		property: O,
		convertFiltersToInternal: function (e) {
			return H.convertVHFilterToInternal(e, this.property);
		},
		convertFiltersToExternal: function (I) {
			return H.convertVHFilterToExternal(I, this.property);
		}
	};
	return {
		FilterTypes: f,
		SupportedTraceFilterTypes: s,
		TraceLevelParameters: t,
		TraceLevelItems: o,
		MessageTypeParameters: m,
		MessageTypeItems: b,
		ValueAssignmentByParameters: v,
		ValueAssignmentByItems: c,
		ValueAssignmentByRelatedMessageTypes: [m.ValueAssignment]
	};
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/config/TraceFilterDialogConfigHelper', [], function () {
	"use strict";
	return {
		convertSingleFilterToInternal: function (e, f) {
			return e.length > 0 ? e[0].parameters[f] : null;
		},
		convertSingleFilterToExternal: function (i, I, f) {
			return i ? [this._getExtFilter(I[i].text, f, i)] : [];
		},
		convertMultiFilterToInternal: function (e, f) {
			var i = [];
			$.each(e, function (I, F) {
				i.push(F.parameters[f]);
			});
			return i;
		},
		convertMultiFilterToExternal: function (i, I, f) {
			var e = [];
			$.each(i, function (a, F) {
				e.push(this._getExtFilter(I[F].text, f, F));
			}.bind(this));
			return e;
		},
		convertVHFilterToInternal: function (e, f) {
			var i = [];
			$.each(e, function (I, F) {
				i.push({
					text: F.text,
					key: F.parameters[f]
				});
			});
			return i;
		},
		convertVHFilterToExternal: function (i, f) {
			var e = [];
			$.each(i, function (I, F) {
				e.push(this._getExtFilter(F.text, f, F.key));
			}.bind(this));
			return e;
		},
		_getExtFilter: function (t, f, k) {
			var p = {};
			p[f] = k;
			return {
				text: t,
				parameters: p
			};
		}
	};
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/config/TraceFilterTypes', [], function () {
	"use strict";
	var s = {
		TraceLevel: "TraceLevel",
		MessageType: "MessageType",
		ValueAssignmentBy: "ValueAssignmentBy",
		BOMComponent: "BOMComponent",
		ClassItem: "ClassItem",
		Characteristic: "Characteristic",
		ObjectDependency: "ObjectDependency",
		Operation: "Operation",
		Sequence: "Sequence",
		PRT: "PRT",
		ViewRelevance: "ViewRelevance"
	};
	var f = {};
	f[s.BOMComponent] = {
		single: "vchclf_trace_filter_bomcomponent"
	};
	f[s.ClassItem] = {
		single: "vchclf_trace_filter_classitem"
	};
	f[s.Characteristic] = {
		single: "vchclf_trace_filter_cstic",
		multi: "vchclf_trace_filter_cstic_multi"
	};
	f[s.ObjectDependency] = {
		single: "vchclf_trace_filter_dependency",
		multi: "vchclf_trace_filter_dependency_multi"
	};
	f[s.Operation] = {
		single: "vchclf_trace_filter_operation"
	};
	f[s.Sequence] = {
		single: "vchclf_trace_filter_sequence"
	};
	f[s.PRT] = {
		single: "vchclf_trace_filter_prt"
	};
	return {
		SupportedTraceFilterTypes: s,
		FilterPropertyI18ns: f
	};
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/config/UiConfig', ["sap/i2d/lo/lib/zvchclfz/common/type/InspectorMode",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/GeneralFormatter", "sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel", "sap/i2d/lo/lib/zvchclfz/components/inspector/util/i18n"
], function (I, G, C, a, i) {
	"use strict";
	var b = {
		Base: "sap.i2d.lo.lib.zvchclfz.components.inspector.view.Base",
		DependencyDetails: "sap.i2d.lo.lib.zvchclfz.components.inspector.view.DependencyDetails"
	};
	var p = {
		BOMItem: "sap.i2d.lo.lib.zvchclfz.components.inspector.view.BOMItemProperties",
		Value: "sap.i2d.lo.lib.zvchclfz.components.inspector.view.ValueProperties",
		Characteristic: "sap.i2d.lo.lib.zvchclfz.components.inspector.view.CharacteristicsProperties",
		ConfigurationProfile: "sap.i2d.lo.lib.zvchclfz.components.inspector.view.ConfProfileProperties",
		Operation: "sap.i2d.lo.lib.zvchclfz.components.inspector.view.OperationProperties",
		RoutingHeader: "sap.i2d.lo.lib.zvchclfz.components.inspector.view.RoutingHeaderProperties",
		RoutingSequence: "sap.i2d.lo.lib.zvchclfz.components.inspector.view.RoutingSequenceProperties",
		PRT: "sap.i2d.lo.lib.zvchclfz.components.inspector.view.PRTProperties",
		Error: "sap.i2d.lo.lib.zvchclfz.components.inspector.view.Error"
	};
	var l = {
		Values: "sap.i2d.lo.lib.zvchclfz.components.inspector.view.Values",
		PRTs: "sap.i2d.lo.lib.zvchclfz.components.inspector.view.PRTs",
		OperationComponents: "sap.i2d.lo.lib.zvchclfz.components.inspector.view.OperationComponents",
		Dependencies: "sap.i2d.lo.lib.zvchclfz.components.inspector.view.Dependencies"
	};
	var o = {
		objectType: "OBJECTNOTFOUND",
		inspectorTab: "OBJECTNOTFOUND"
	};
	var g = function (d, P) {
		return a.getIsSuperInspectorAvailable() ? d[C.navigationProperties.Common.Super][P] : d[P];
	};
	return {
		objectNotFoundPage: o,
		inspectorMode: I,
		propertiesView: p,
		objectTypeConfig: {
			"OBJECTNOTFOUND": {
				baseView: b.Base,
				propertiesView: p.Error,
				inspectorTabs: [o.inspectorTab],
				getTitle: function () {
					return i.getText("vchclf_objectheader_title_object_not_found");
				},
				getSubTitle: function () {
					return i.getText("vchclf_objectheader_subtitle_object_not_found");
				}
			},
			"CHARACTERISTIC": {
				baseView: b.Base,
				propertiesView: p.Characteristic,
				inspectorTabs: [I.inspectorTab.properties, I.inspectorTab.values, I.inspectorTab.dependencies],
				superInspectorRelated: false,
				navigationPropertyOfProperties: C.navigationProperties.Characteristic.CharacteristicDetail,
				getTitle: function (d) {
					return d.Description || d.Name;
				},
				getSubTitle: function () {
					return i.getText("vchclf_objectheader_subtitle_char");
				},
				getObjectDependencyAssgmtNumber: function (d) {
					return d.ObjectDependencyAssgmtNumber;
				}
			},
			"CHARACTERISTICVALUE": {
				baseView: b.Base,
				propertiesView: p.Value,
				inspectorTabs: [I.inspectorTab.properties, I.inspectorTab.dependencies],
				superInspectorRelated: false,
				getTitle: function (d) {
					if (d.Description) {
						return d.Description;
					} else if (d.HasHighPrecision) {
						return i.getTextWithParameters("vchclf_insp_values_template_precise_value", d.FormattedValueFrom);
					} else if (d.FormattedValueTo) {
						return i.getTextWithParameters("vchclf_insp_values_template_value_range", [d.FormattedValueFrom, d.FormattedValueTo]);
					} else {
						return d.FormattedValueFrom;
					}
				},
				getSubTitle: function (d) {
					switch (d.IntervalType) {
					case C.characteristicValue.intervalType.ExactValue:
						return i.getText("vchclf_objectheader_subtitle_value");
					default:
						return i.getText("vchclf_objectheader_subtitle_value_range");
					}
				},
				getObjectDependencyAssgmtNumber: function (d) {
					return d.DepObjNumber;
				}
			},
			"BOMCOMPONENT": {
				baseView: b.Base,
				propertiesView: p.BOMItem,
				inspectorTabs: [I.inspectorTab.properties, I.inspectorTab.dependencies],
				superInspectorRelated: true,
				getTitle: function (d) {
					return d.ProductName || d.BOMComponentName || d[C.navigationProperties.Common.Super] && (d[C.navigationProperties.Common.Super].ProductName ||
						d[C.navigationProperties.Common.Super].BOMComponentName);
				},
				getSubTitle: function (d) {
					if (!d[C.navigationProperties.Common.Super] || d[C.navigationProperties.Common.Super].ItemCategory !== C.BOMItemProperties.ItemCategory
						.ClassItem) {
						if (d[C.navigationProperties.BOMNode.Header] && d[C.navigationProperties.BOMNode.Header].ComponentId) {
							return i.getText("vchclf_objectheader_subtitle_bomheader");
						} else {
							return i.getText("vchclf_objectheader_subtitle_bomitem");
						}
					} else if (!d.IsExcludedItem) {
						return i.getText("vchclf_objectheader_subtitle_specialized_classitem");
					} else {
						return i.getText("vchclf_objectheader_subtitle_classitem");
					}
				},
				getObjectDependencyAssgmtNumber: function (d) {
					return g(d, "ObjectDependencyAssgmtNumber");
				},
				extendViewDataWithInitialParams: function (v) {
					v.setProperty("/isRoot", true);
				},
				changeTheViewDataBasedOnBEResponse: function (d, v) {
					var P = g(d, "ParentComponentId");
					if (P !== C.BOMItemProperties.rootParentComponentId) {
						v.setProperty("/isRoot", false);
					}
				}
			},
			"CONFIGURATIONPROFILE": {
				baseView: b.Base,
				propertiesView: p.ConfigurationProfile,
				inspectorTabs: [I.inspectorTab.properties, I.inspectorTab.dependencies],
				superInspectorRelated: false,
				getTitle: function (d) {
					return d.ConfigurationProfileName;
				},
				getSubTitle: function () {
					return i.getText("vchclf_objectheader_subtitle_conf_profile");
				},
				getObjectDependencyAssgmtNumber: function (d) {
					return d.ObjectDependencyAssgmtNumber;
				}
			},
			"OBJECTDEPENDENCY": {
				baseView: b.DependencyDetails,
				getTitle: function (d) {
					return d.Description || d.Name || d.ObjectDependency;
				},
				getSubTitle: function (d) {
					return d.TypeDescription;
				}
			},
			"ROUTINGHEADER": {
				baseView: b.Base,
				propertiesView: p.RoutingHeader,
				inspectorTabs: [I.inspectorTab.properties, I.inspectorTab.dependencies],
				superInspectorRelated: true,
				navigationPropertyOfProperties: C.navigationProperties.RoutingNode.RoutingHeader,
				getTitle: function (d) {
					return d.Description || d[C.navigationProperties.Common.Super] && d[C.navigationProperties.Common.Super].Description;
				},
				getSubTitle: function () {
					return i.getText("vchclf_objectheader_subtitle_routing_header");
				},
				getObjectDependencyAssgmtNumber: function (d) {
					return g(d, "ObjectDependencyAssgmtNumber");
				}
			},
			"PARALLELSEQUENCE": {
				baseView: b.Base,
				propertiesView: p.RoutingSequence,
				inspectorTabs: [I.inspectorTab.properties, I.inspectorTab.dependencies],
				superInspectorRelated: true,
				navigationPropertyOfProperties: C.navigationProperties.RoutingNode.Sequence,
				getTitle: function (d) {
					return d.Description || d[C.navigationProperties.Common.Super] && d[C.navigationProperties.Common.Super].Description;
				},
				getSubTitle: function () {
					return i.getText("vchclf_objectheader_subtitle_parallel_sequence");
				},
				getObjectDependencyAssgmtNumber: function (d) {
					return g(d, "ObjectDependencyAssgmtNumber");
				},
				extendViewDataWithInitialParams: function (v) {
					v.setProperty("/isParallelSequence", true);
				}
			},
			"ALTERNATIVESEQUENCE": {
				baseView: b.Base,
				propertiesView: p.RoutingSequence,
				inspectorTabs: [I.inspectorTab.properties, I.inspectorTab.dependencies],
				superInspectorRelated: true,
				navigationPropertyOfProperties: C.navigationProperties.RoutingNode.Sequence,
				getTitle: function (d) {
					return d.Description || d[C.navigationProperties.Common.Super] && d[C.navigationProperties.Common.Super].Description;
				},
				getSubTitle: function () {
					return i.getText("vchclf_objectheader_subtitle_alternative_sequence");
				},
				getObjectDependencyAssgmtNumber: function (d) {
					return g(d, "ObjectDependencyAssgmtNumber");
				},
				extendViewDataWithInitialParams: function (v) {
					v.setProperty("/isParallelSequence", false);
				}
			},
			"OPERATION": {
				baseView: b.Base,
				propertiesView: p.Operation,
				inspectorTabs: [I.inspectorTab.properties, I.inspectorTab.operationComponents, I.inspectorTab.prts, I.inspectorTab.dependencies],
				superInspectorRelated: true,
				navigationPropertyOfProperties: C.navigationProperties.RoutingNode.OperationDetail,
				getTitle: function (d) {
					return d.Description || d.BillOfOperationsNode !== C.initialBillOfOperationsNode && d.BillOfOperationsNode || d[C.navigationProperties
						.Common.Super] && (d[C.navigationProperties.Common.Super].Description || d[C.navigationProperties.Common.Super].BillOfOperationsNode);
				},
				getSubTitle: function () {
					return i.getText("vchclf_objectheader_subtitle_operation");
				},
				getObjectDependencyAssgmtNumber: function (d) {
					return g(d, "ObjectDependencyAssgmtNumber");
				},
				extendViewDataWithInitialParams: function (v) {
					v.setProperty("/hasStandardValues", false);
				},
				changeTheViewDataBasedOnBEResponse: function (d, v) {
					if (d[C.navigationProperties.Operation.StandardValues].length > 0) {
						v.setProperty("/hasStandardValues", true);
					}
				}
			},
			"SUBOPERATION": {
				baseView: b.Base,
				propertiesView: p.Operation,
				inspectorTabs: [I.inspectorTab.properties, I.inspectorTab.operationComponents, I.inspectorTab.prts, I.inspectorTab.dependencies],
				superInspectorRelated: true,
				navigationPropertyOfProperties: C.navigationProperties.RoutingNode.OperationDetail,
				getTitle: function (d) {
					return d.Description || d.BillOfOperationsNode !== C.initialBillOfOperationsNode && d.BillOfOperationsNode || d[C.navigationProperties
						.Common.Super] && (d[C.navigationProperties.Common.Super].Description || d[C.navigationProperties.Common.Super].BillOfOperationsNode);
				},
				getSubTitle: function () {
					return i.getText("vchclf_objectheader_subtitle_suboperation");
				},
				getObjectDependencyAssgmtNumber: function (d) {
					return g(d, "ObjectDependencyAssgmtNumber");
				},
				extendViewDataWithInitialParams: function (v) {
					v.setProperty("/hasStandardValues", false);
				},
				changeTheViewDataBasedOnBEResponse: function (d, v) {
					if (d[C.navigationProperties.Operation.StandardValues].length > 0) {
						v.setProperty("/hasStandardValues", true);
					}
				}
			},
			"REFOPERATION": {
				baseView: b.Base,
				propertiesView: p.Operation,
				inspectorTabs: [I.inspectorTab.properties, I.inspectorTab.operationComponents, I.inspectorTab.prts, I.inspectorTab.dependencies],
				superInspectorRelated: true,
				navigationPropertyOfProperties: C.navigationProperties.RoutingNode.OperationDetail,
				getTitle: function (d) {
					return d.Description || d.BillOfOperationsNode !== C.initialBillOfOperationsNode && d.BillOfOperationsNode || d[C.navigationProperties
						.Common.Super] && (d[C.navigationProperties.Common.Super].Description || d[C.navigationProperties.Common.Super].BillOfOperationsNode);
				},
				getSubTitle: function () {
					return i.getText("vchclf_objectheader_subtitle_ref_operation");
				},
				getObjectDependencyAssgmtNumber: function (d) {
					return g(d, "ObjectDependencyAssgmtNumber");
				},
				extendViewDataWithInitialParams: function (v) {
					v.setProperty("/hasStandardValues", false);
				},
				changeTheViewDataBasedOnBEResponse: function (d, v) {
					if (d[C.navigationProperties.Operation.StandardValues].length > 0) {
						v.setProperty("/hasStandardValues", true);
					}
				}
			},
			"REFSUBOPERATION": {
				baseView: b.Base,
				propertiesView: p.Operation,
				inspectorTabs: [I.inspectorTab.properties, I.inspectorTab.operationComponents, I.inspectorTab.prts, I.inspectorTab.dependencies],
				superInspectorRelated: true,
				navigationPropertyOfProperties: C.navigationProperties.RoutingNode.OperationDetail,
				getTitle: function (d) {
					return d.Description || d.BillOfOperationsNode !== C.initialBillOfOperationsNode && d.BillOfOperationsNode || d[C.navigationProperties
						.Common.Super] && (d[C.navigationProperties.Common.Super].Description || d[C.navigationProperties.Common.Super].BillOfOperationsNode);
				},
				getSubTitle: function () {
					return i.getText("vchclf_objectheader_subtitle_ref_suboperation");
				},
				getObjectDependencyAssgmtNumber: function (d) {
					return g(d, "ObjectDependencyAssgmtNumber");
				},
				extendViewDataWithInitialParams: function (v) {
					v.setProperty("/hasStandardValues", false);
				},
				changeTheViewDataBasedOnBEResponse: function (d, v) {
					if (d[C.navigationProperties.Operation.StandardValues].length > 0) {
						v.setProperty("/hasStandardValues", true);
					}
				}
			},
			"PRT": {
				baseView: b.Base,
				propertiesView: p.PRT,
				inspectorTabs: [I.inspectorTab.properties, I.inspectorTab.dependencies],
				superInspectorRelated: true,
				getTitle: function (d) {
					return d.Description || d.ProductionResourceTool || d[C.navigationProperties.Common.Super] && (d[C.navigationProperties.Common.Super]
						.Description || d[C.navigationProperties.Common.Super].ProductionResourceTool);
				},
				getSubTitle: function () {
					return i.getText("vchclf_objectheader_subtitle_prt");
				},
				getObjectDependencyAssgmtNumber: function (d) {
					return g(d, "ObjectDependencyAssgmtNumber");
				}
			}
		},
		inspectorTabConfig: {
			"OBJECTNOTFOUND": {
				getContent: function () {
					return sap.ui.xmlview({
						viewName: p.Error,
						height: "100%"
					});
				},
				getIconTabFilterSettings: function (c) {
					return {
						icon: "sap-icon://message-warning",
						key: o.inspectorTab,
						tooltip: i.getText("vchclf_objectheader_title_object_not_found"),
						content: [c]
					};
				}
			},
			"PROPERTIES": {
				getContent: function (v) {
					return sap.ui.xmlview({
						viewName: v.getProperty("/propertiesView")
					});
				},
				getIconTabFilterSettings: function (c) {
					return {
						icon: "sap-icon://hint",
						key: I.inspectorTab.properties,
						tooltip: i.getText("vchclf_objectheader_tab_properties"),
						content: new sap.m.ScrollContainer({
							height: "100%",
							width: "100%",
							horizontal: false,
							vertical: true,
							content: c,
							focusable: true
						})
					};
				}
			},
			"DEPENDENCIES": {
				getContent: function () {
					return sap.ui.xmlview({
						viewName: l.Dependencies
					});
				},
				getIconTabFilterSettings: function (c) {
					return {
						icon: "sap-icon://share-2",
						tooltip: {
							path: "__viewData>/isDependenciesTabEnabled",
							formatter: G.getTooltipOfDependenciesTab
						},
						enabled: "{__viewData>/isDependenciesTabEnabled}",
						key: I.inspectorTab.dependencies,
						content: new sap.m.ScrollContainer({
							height: "100%",
							width: "100%",
							horizontal: false,
							vertical: true,
							content: [c]
						})
					};
				},
				extendViewDataWithCustomParam: function (v) {
					v.setProperty("/isDependenciesTabEnabled", true);
				},
				setCustomParamBasedOnBEResponse: function (d, v) {
					var f = v.getProperty("/getObjectDependencyAssgmtNumber");
					if ($.isFunction(f)) {
						var O = f(d);
						var s = a.getProperty("/selectedTab");
						if (O === C.initialObjectDependencyAssgmgNumber) {
							v.setProperty("/isDependenciesTabEnabled", false);
							if (s === I.inspectorTab.dependencies) {
								a.setProperty("/selectedTab", I.inspectorTab.properties);
							}
						}
					}
				}
			},
			"VALUES": {
				getContent: function () {
					return sap.ui.xmlview({
						viewName: l.Values
					});
				},
				getIconTabFilterSettings: function (c) {
					return {
						icon: "sap-icon://multi-select",
						tooltip: {
							path: "__viewData>/isObjectPartOfModel",
							formatter: G.getTooltipOfValuesTab
						},
						enabled: "{__viewData>/isObjectPartOfModel}",
						key: I.inspectorTab.values,
						content: new sap.m.ScrollContainer({
							height: "100%",
							width: "100%",
							horizontal: false,
							vertical: true,
							content: [c]
						})
					};
				},
				extendViewDataWithCustomParam: function (v) {
					v.setProperty("/isObjectPartOfModel", true);
				},
				setCustomParamBasedOnBEResponse: function (d, v) {
					var s = a.getProperty("/selectedTab");
					if (d.IsNotPartOfModel) {
						v.setProperty("/isObjectPartOfModel", false);
						if (s === I.inspectorTab.values) {
							a.setProperty("/selectedTab", I.inspectorTab.properties);
						}
					}
				}
			},
			"OPERATIONCOMPONENTS": {
				getContent: function () {
					return sap.ui.xmlview({
						viewName: l.OperationComponents
					});
				},
				getIconTabFilterSettings: function (c) {
					return {
						icon: "sap-icon://BusinessSuiteInAppSymbols/icon-material",
						tooltip: {
							path: "__viewData>/isComponentsTabEnabled",
							formatter: G.getTooltipOfComponentsTab
						},
						enabled: "{__viewData>/isComponentsTabEnabled}",
						key: I.inspectorTab.operationComponents,
						content: new sap.m.ScrollContainer({
							height: "100%",
							width: "100%",
							horizontal: false,
							vertical: true,
							content: [c]
						})
					};
				},
				extendViewDataWithCustomParam: function (v) {
					v.setProperty("/isComponentsTabEnabled", true);
				},
				setCustomParamBasedOnBEResponse: function (d, v) {
					var s = a.getProperty("/selectedTab");
					if (!d.HasComponent) {
						v.setProperty("/isComponentsTabEnabled", false);
						if (s === I.inspectorTab.operationComponents) {
							a.setProperty("/selectedTab", I.inspectorTab.properties);
						}
					}
				}
			},
			"PRTS": {
				getContent: function () {
					return sap.ui.xmlview({
						viewName: l.PRTs
					});
				},
				getIconTabFilterSettings: function (c) {
					return {
						icon: "sap-icon://wrench",
						tooltip: {
							path: "__viewData>/isPRTsTabEnabled",
							formatter: G.getTooltipOfPRTsTab
						},
						enabled: "{__viewData>/isPRTsTabEnabled}",
						key: I.inspectorTab.prts,
						content: new sap.m.ScrollContainer({
							height: "100%",
							width: "100%",
							horizontal: false,
							vertical: true,
							content: [c]
						})
					};
				},
				extendViewDataWithCustomParam: function (v) {
					v.setProperty("/isPRTsTabEnabled", true);
				},
				setCustomParamBasedOnBEResponse: function (d, v) {
					var s = a.getProperty("/selectedTab");
					if (!d.HasPRT) {
						v.setProperty("/isPRTsTabEnabled", false);
						if (s === I.inspectorTab.prts) {
							a.setProperty("/selectedTab", I.inspectorTab.properties);
						}
					}
				}
			}
		}
	};
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/config/ValueHelpConfig', [
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants", "sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel"
], function (C, I) {
	"use strict";
	var c = {
		XMLFragmentId: "idCsticsValueHelpDialog",
		XMLFragmentPath: "sap/i2d/lo/lib/zvchclfz/components/inspector/fragment/CsticsValueHelpDialog",
		EntitySet: C.entitySets.TraceCharacteristicVH,
		KeyProperty: "CsticId",
		NameProperty: "CsticName",
		DescriptionProperty: "Description",
		IsContainedInConfignModelProperty: "CharcIsContainedInConfignModel",
		NameColumnLabel: "vchclf_trace_cstics_value_help_result_col_cstics",
		DescriptionColumnLabel: "vchclf_trace_cstics_value_help_result_col_csticsdesc",
		WarningMessage: "vchclf_trace_cstics_suggested_item_not_found",
		getBindingPath: function () {
			return I.getConfigurationContextPath() + "/" + C.navigationProperties.ConfigurationContext.TraceCharacteristicVH;
		}
	};
	var d = {
		XMLFragmentId: "idObjectDependencyValueHelpDialog",
		XMLFragmentPath: "sap/i2d/lo/lib/zvchclfz/components/inspector/fragment/DependencyValueHelpDialog",
		EntitySet: C.entitySets.DependencyValueHelp,
		KeyProperty: "ObjectDependency",
		NameProperty: "ObjectDependencyName",
		DescriptionProperty: "Description",
		IsContainedInConfignModelProperty: "DepIsContainedInConfignModel",
		NameColumnLabel: "vchclf_trace_objdep_value_help_result_col_objdep",
		DescriptionColumnLabel: "vchclf_trace_objdep_value_help_result_col_objdepdesc",
		WarningMessage: "vchclf_trace_objdep_suggested_item_not_found",
		getBindingPath: function () {
			return I.getConfigurationContextPath() + "/" + C.navigationProperties.ConfigurationContext.TraceObjectDependencyVH;
		}
	};
	return {
		CsticValueHelpConfig: c,
		DependencyValueHelpConfig: d
	};
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/control/TraceEntry', ["sap/m/Panel"], function (P) {
	"use strict";
	return P.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.control.TraceEntry", {
		metadata: {
			properties: {
				hasContent: "boolean"
			},
			events: {
				clicked: {
					parameters: {}
				}
			}
		},
		renderer: {},
		onBeforeRendering: function () {
			if (P.prototype.onBeforeRendering) {
				P.prototype.onBeforeRendering.apply(this, arguments);
			}
			if (!this.getHasContent()) {
				this.addStyleClass("vchclfTraceEntryHideExpandIcon");
			}
		},
		onAfterRendering: function () {
			if (P.prototype.onAfterRendering) {
				P.prototype.onAfterRendering.apply(this, arguments);
			}
			$(document.getElementById(this.getId())).bind("click", this._handleClick.bind(this));
		},
		_handleClick: function () {
			this.fireClicked();
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/control/TraceEntryText', [
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/TraceEntryTextTypes", "sap/m/FormattedText", "sap/m/Link", "sap/m/Text",
	"sap/m/Title", "sap/ui/core/Icon", "sap/ui/core/IconColor", "sap/ui/model/json/JSONModel"
], function (T, F, L, a, b, I, c, J) {
	"use strict";
	var d = "0.75em";
	var A = ["headerText", "filterText", "inspectText", "whereWasValueSetText", "whereWasCsticUsedText", "whereWasDepUsedText",
		"whereWasDepSetText"
	];
	return b.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.control.TraceEntryText", {
		metadata: {
			properties: {
				metaText: {
					type: "string"
				},
				styleClass: {
					type: "string"
				},
				showPreciseNumbers: {
					type: "boolean"
				}
			},
			events: {
				filter: {
					parameters: {
						type: {
							type: "string"
						},
						text: {
							type: "string"
						},
						property: {
							type: "string"
						},
						key: {
							type: "string"
						},
						parameters: {
							type: "object"
						}
					}
				},
				inspect: {
					parameters: {
						type: {
							type: "string"
						},
						navigationObjectType: {
							type: "string"
						},
						inspectParameters: {
							type: "object"
						}
					}
				},
				whereWasValueSet: {
					parameters: {
						CsticId: {
							type: "string"
						},
						BOMComponentId: {
							type: "string"
						}
					}
				},
				whereWasCsticUsed: {
					parameters: {
						CsticId: {
							type: "string"
						},
						CsticName: {
							type: "string"
						},
						BOMComponentId: {
							type: "string"
						}
					}
				},
				whereWasDepSet: {
					parameters: {
						DependencyId: {
							type: "string"
						},
						SubprocedureIndex: {
							type: "integer"
						},
						DependecyName: {
							type: "string"
						}
					}
				},
				whereWasDepUsed: {
					parameters: {
						DependencyId: {
							type: "string"
						},
						SubprocedureIndex: {
							type: "integer"
						},
						DependencyName: {
							type: "string"
						}
					}
				}
			},
			aggregations: {
				textControls: {
					type: "sap.ui.core.Control",
					multiple: true,
					visibility: "hidden"
				}
			}
		},
		_actionSheet: null,
		_actionSheetCallerType: null,
		init: function () {
			var o = new J({
				headerText: null,
				filterText: null,
				inspectText: null,
				whereWasValueSetText: null,
				whereWasCsticUsedText: null,
				whereWasDepSetText: null,
				whereWasDepUsedText: null
			});
			this.setModel(o, "traceEntryTextParameter");
		},
		renderer: function (r, C) {
			if (r) {
				var m = C.getMetaText();
				var t = m.split(/\{\w+\}/g);
				var s = "sapMBarChild sapMText sapMTextMaxWidth sapUiSelectable sapMTBShrinkItem";
				s += C.getStyleClass() ? " " + C.getStyleClass() : "";
				C._generateTextControlsAggregation(m);
				r.write("<span");
				r.writeControlData(C);
				r.writeAttributeEscaped("id", C.getId() + "_span");
				r.writeAttributeEscaped("class", s);
				r.write(">");
				$.each(t, function (i, e) {
					r.renderControl(new F({
						htmlText: e
					}).addStyleClass("vchclfTraceEntryTextItem"));
					if (C.getAggregation("textControls") && C.getAggregation("textControls")[i]) {
						r.renderControl(C.getAggregation("textControls")[i]);
					}
				});
				r.write("</span>");
			}
		},
		onFilter: function () {
			var t = this.getBindingContext("trace").getObject();
			if (this._actionSheetCallerType) {
				this.fireFilter(T.LinkTypes[this._actionSheetCallerType].getFilterObject(t));
			}
		},
		onInspect: function () {
			var t = this.getBindingContext("trace").getObject();
			if (this._actionSheetCallerType) {
				this.fireInspect(T.LinkTypes[this._actionSheetCallerType].getInspectObject(t));
			}
		},
		onWhereWasValueSet: function () {
			this.fireWhereWasValueSet(this.getBindingContext("trace").getObject());
		},
		onWhereWasCsticUsed: function () {
			this.fireWhereWasCsticUsed(this.getBindingContext("trace").getObject());
		},
		onWhereWasDepSet: function () {
			this.fireWhereWasDepSet(this.getBindingContext("trace").getObject());
		},
		onWhereWasDepUsed: function () {
			this.fireWhereWasDepUsed(this.getBindingContext("trace").getObject());
		},
		_generateTextControlsAggregation: function (m) {
			var r = /(\{)(\w+)(\})/g;
			var t;
			this.destroyAggregation("textControls", true);
			while ((t = r.exec(m)) !== null) {
				var o = t[2];
				if (T.IconTypes[o]) {
					this._addIconAggregation(o);
				} else if (T.LinkTypes[o]) {
					this._addLinkAggregation(o);
				} else if (T.TextTypes[o]) {
					this._addTextAggregation(o);
				}
			}
		},
		_addIconAggregation: function (o) {
			var i = T.IconTypes[o];
			this.addAggregation("textControls", new I({
				src: i.src,
				color: c.Default,
				size: d,
				tooltip: i.getTooltip(),
				decorative: false
			}));
		},
		_addLinkAggregation: function (o) {
			var s = this.getId() + "_" + o;
			if (T.LinkTypes[o] && T.LinkTypes[o].getLinkText && !this._isLinkAggregationAlreadyExists(s, this.getAggregation("textControls"))) {
				var t = this.getBindingContext("trace").getObject();
				var l = T.LinkTypes[o].getLinkText(t);
				this.addAggregation("textControls", new L({
					id: s,
					text: l,
					tooltip: l,
					wrapping: true,
					press: this._handlePress.bind(this)
				}).addStyleClass("sapUiNoMargin").addStyleClass("vchclfTraceEntryTextItem"));
			}
		},
		_addTextAggregation: function (o) {
			var t = T.TextTypes[o];
			if (t && $.isFunction(t.getText)) {
				var e = this.getBindingContext("trace").getObject();
				var f = new F({
					htmlText: t.getText(e, this.getShowPreciseNumbers())
				}).addStyleClass("vchclfTraceEntryTextItem");
				if ($.isFunction(t.getTooltip)) {
					f.setTooltip(t.getTooltip());
				}
				this.addAggregation("textControls", f);
			}
		},
		_isLinkAggregationAlreadyExists: function (s, e) {
			var f = false;
			if (e) {
				$.each(e, function (i, o) {
					f = f || o.getId() === s;
				});
			}
			return f;
		},
		_handlePress: function (e) {
			var s = e.getSource();
			var o = /[^_]+$/.exec(s.getId())[0];
			this._openActionSheet(s, T.LinkTypes[o]);
		},
		_openActionSheet: function (s, l) {
			if (s && l && l.getLinkText) {
				var t = this.getModel("traceEntryTextParameter");
				if (!this._actionSheet) {
					this._actionSheet = sap.ui.xmlfragment("sap/i2d/lo/lib/zvchclfz/components/inspector/fragment/TraceEntryTextActionSheet", this);
					this.addDependent(this._actionSheet);
				}
				this._setActionSheetTexts(t, l);
				this._actionSheet.openBy(s);
				this._actionSheetCallerType = l.Name;
			}
		},
		_setActionSheetTexts: function (o, l) {
			$.each(A, function (i, s) {
				var p = "/" + s;
				if (l.ActionSheetTexts[s]) {
					o.setProperty(p, l.ActionSheetTexts[s].call(l));
				} else {
					o.setProperty(p, "");
				}
			});
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/controller/BOMItemProperties.controller', [
	"sap/i2d/lo/lib/zvchclfz/components/inspector/controller/SuperInspectorProperties.controller",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/GeneralFormatter", "sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/NavigationManager", "sap/ui/model/json/JSONModel"
], function (S, G, C, I, N, J) {
	"use strict";
	return S.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.controller.BOMItemProperties", {
		_generalFormatter: G,
		onInit: function () {
			var n = N.getNavigationHandler().getIsNavigationToBOMSupported();
			this.getView().setModel(new J({
				navToBOMVisibility: n
			}), "__visibility");
		},
		onConfigurationProfilePressed: function (e) {
			var m = e.getSource().getModel("properties");
			var p, c;
			if (I.getIsSuperInspectorAvailable()) {
				p = m.getProperty("/to_Super/BOMComponentName");
				c = m.getProperty("/to_Super/ConfigurationProfileNumber");
			} else {
				p = m.getProperty("/BOMComponentName");
				c = m.getProperty("/ConfigurationProfileNumber");
			}
			this.getOwnerComponent().openConfigurationProfileProperties({
				product: p,
				counter: c
			});
		},
		onNavigateToBOM: function (e) {
			var n = e.getSource().getModel("properties").getData();
			switch (n.IsBOMExplosionPossible) {
			case C.BOMExplosionStates.possible:
				N.getNavigationHandler().navigateToBOM(n);
				break;
			case C.BOMExplosionStates.missingBOMApplication:
				this.getOwnerComponent().fireNavigationToBOMwithoutBOMApp();
				break;
			case C.BOMExplosionStates.BOMNotFound:
				if (n.ParentComponentId === C.BOMItemProperties.rootParentComponentId) {
					this.getOwnerComponent().fireNavigationToBOMCanNotBeFound();
				} else {
					N.getNavigationHandler().navigateToBOM(n);
				}
				break;
			default:
				break;
			}
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/controller/Base.controller', [
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/UiConfig", "sap/i2d/lo/lib/zvchclfz/components/inspector/dao/InspectorDAO",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants", "sap/i2d/lo/lib/zvchclfz/components/inspector/logic/EventProvider",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel", "sap/i2d/lo/lib/zvchclfz/components/inspector/util/SuperInspector",
	"sap/base/Log", "sap/m/IconTabFilter", "sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"
], function (U, I, C, E, a, S, L, b, c, J) {
	"use strict";
	return c.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.controller.Base", {
		_viewData: null,
		_properties: null,
		_tabContents: null,
		onInit: function () {
			var v = this.getView();
			this._viewData = new J(v.getViewData());
			this._properties = new J();
			v.setModel(this._viewData, "__viewData");
			v.setModel(this._properties, "properties");
			E.attachChangeTheSelectedTabOfInspector(this._changeTheSelectedTabOfInspector, this);
		},
		onExit: function () {
			E.detachChangeTheSelectedTabOfInspector(this._changeTheSelectedTabOfInspector, this);
		},
		onNavigatedTo: function () {
			if (!$.isEmptyObject(this._viewData.getProperty("/"))) {
				var o = this._viewData.getProperty("/objectPath");
				var O = this._viewData.getProperty("/objectType");
				this.getView().setBusy(true);
				a.setLastObjectNavigatedTo(o, O);
				if ($.isFunction(U.objectTypeConfig[O].extendViewDataWithInitialParams)) {
					U.objectTypeConfig[O].extendViewDataWithInitialParams(this._viewData);
				}
				var i = this._viewData.getProperty("/superInspectorRelated") && a.getIsSuperInspectorAvailable();
				if (i) {
					this._viewData.setProperty("/isSuperInspectorEnabled", false);
					this._viewData.setProperty("/isSuperInspectorShown", false);
				}
				this._setupIconTabBar();
				this.updateSelectedTab();
				if (!a.isTraceViewSelected() && !a.isComparisonViewSelected()) {
					a.selectInspectorView();
				}
				this._readObject();
			}
		},
		_setupIconTabBar: function () {
			var i = this.getView().byId("idInspectorTabs");
			this._tabContents = {};
			i.removeAllItems();
			$.each(this._viewData.getProperty("/inspectorTabs"), function (d, o) {
				var e = U.inspectorTabConfig[o];
				var t = e.getContent(this._viewData);
				var f = t.getController();
				if ($.isFunction(e.extendViewDataWithCustomParam)) {
					e.extendViewDataWithCustomParam(this._viewData);
				}
				i.addItem(new b(e.getIconTabFilterSettings(t)));
				this._tabContents[o] = t;
				if (f && $.isFunction(f.onActivate)) {
					f.onActivate();
				}
			}.bind(this));
		},
		reloadContent: function () {
			this.getView().setBusy(true);
			this._readObject();
			$.each(this._tabContents, function (i, e) {
				if ($.isFunction(e.reloadContent)) {
					e.reloadContent();
				}
			});
		},
		updateSelectedTab: function () {
			var s = a.getProperty("/selectedTab");
			var d = $.grep(this._viewData.getProperty("/inspectorTabs"), function (i) {
				return i === s;
			}).length > 0;
			if (!d) {
				a.setProperty("/selectedTab", U.inspectorMode.inspectorTab.properties);
			}
		},
		onAfterNavBack: function () {
			var s = this._viewData.getProperty("/selectedTab");
			a.setLastObjectNavigatedTo(this._viewData.getProperty("/objectPath"), this._viewData.getProperty("/objectType"));
			if (s) {
				a.setProperty("/selectedTab", s);
			}
			this.getView().setBusy(false);
		},
		_readObject: function () {
			var o = this._viewData.getProperty("/objectPath");
			var O = this._viewData.getProperty("/objectType");
			var n = this._viewData.getProperty("/navigationPropertyOfProperties");
			if (n) {
				o += "/" + n;
			}
			switch (O) {
			case U.inspectorMode.objectType.Operation:
			case U.inspectorMode.objectType.SubOperation:
			case U.inspectorMode.objectType.RefOperation:
			case U.inspectorMode.objectType.RefSubOperation:
				this._readOperationInspectorData(o);
				break;
			case U.inspectorMode.objectType.BOMComponent:
				this._readGenericInspectorData(o, C.navigationProperties.BOMNode.Header);
				break;
			default:
				this._readGenericInspectorData(o);
				break;
			}
		},
		_readOperationInspectorData: function (o) {
			var i = a.getIsSuperInspectorAvailable();
			var s = o + "/" + C.navigationProperties.Operation.StandardValues;
			var r = [I.read(o, i), I.read(s, false)];
			if (i) {
				var d = o + "/" + C.navigationProperties.Common.Super + "/" + C.navigationProperties.Operation.StandardValues;
				r.push(I.read(d, false));
			}
			Promise.all(r).then(function (D) {
				var e;
				var O = D[0];
				var f = D[1] && D[1].results;
				if (i) {
					var g = D[2] && D[2].results;
					e = S.attachStandardValuesToOperation(O, f, g);
				} else {
					e = O;
					e[C.navigationProperties.Operation.StandardValues] = f;
				}
				this._handleReadResponse(e);
				this.getView().setBusy(false);
			}.bind(this)).catch(this._handleObjectNotFound.bind(this));
		},
		_readGenericInspectorData: function (p, e) {
			var i = this._viewData.getProperty("/superInspectorRelated") && a.getIsSuperInspectorAvailable();
			I.read(p, i, e).then(function (d) {
				this._handleReadResponse(d);
				this.getView().setBusy(false);
			}.bind(this)).catch(function (m) {
				if (!m.isAborted) {
					this._handleObjectNotFound();
				}
			}.bind(this));
		},
		_handleReadResponse: function (d) {
			var f = this._viewData.getProperty("/changeTheViewDataBasedOnBEResponse");
			$.each(this._viewData.getProperty("/inspectorTabs"), function (i, o) {
				var e = U.inspectorTabConfig[o];
				if ($.isFunction(e.setCustomParamBasedOnBEResponse)) {
					e.setCustomParamBasedOnBEResponse(d, this._viewData);
				}
			}.bind(this));
			if ($.isFunction(f)) {
				f(d, this._viewData);
			}
			this._properties.setData(d);
			var g = this._viewData.getProperty("/getTitle");
			var G = this._viewData.getProperty("/getSubTitle");
			if ($.isFunction(g) && $.isFunction(G)) {
				this._setTitleAndSubTitle(g(d), G(d));
			}
			if (this._tabContents[U.inspectorMode.inspectorTab.properties]) {
				var p = this._tabContents[U.inspectorMode.inspectorTab.properties].getController();
				if (p && $.isFunction(p.onAfterDataReceived)) {
					p.onAfterDataReceived();
				}
			}
		},
		_setTitleAndSubTitle: function (t, s) {
			this._viewData.setProperty("/title", t);
			this._viewData.setProperty("/subTitle", s);
		},
		_changeTheSelectedTabOfInspector: function (e) {
			var i = e.getParameter("tabKey");
			switch (i) {
			case U.inspectorMode.inspectorTab.dependencies:
				if (this._viewData.getProperty("/isDependenciesTabEnabled")) {
					a.setProperty("/selectedTab", i);
				}
				break;
			case U.inspectorMode.inspectorTab.properties:
				a.setProperty("/selectedTab", i);
				break;
			default:
				L.error("The direct navigation to the " + i + " is not supported.", "You can only navigate directly to the dependencies tab.",
					"sap.i2d.lo.lib.zvchclfz.components.inspector.controller.Base");
				break;
			}
		},
		_handleObjectNotFound: function () {
			if (a.getProperty("/isBackEnabled")) {
				E.fireNavigateBack();
			} else {
				var v = this.getView();
				var o = U.objectTypeConfig[U.objectNotFoundPage.objectType];
				o.objectType = U.objectNotFoundPage.objectType;
				this._viewData.setData(o);
				this._setupIconTabBar();
				a.setProperty("/selectedTab", U.objectNotFoundPage.inspectorTab);
				a.setLastObjectNavigatedTo(null, null);
				this._setTitleAndSubTitle(o.getTitle(), o.getSubTitle());
				v.setBusy(false);
			}
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/controller/CharacteristicsProperties.controller', [
	"sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/GeneralFormatter", "sap/ui/core/mvc/Controller"
], function (G, C) {
	"use strict";
	return C.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.controller.CharacteristicsProperties", {
		_generalFormatter: G
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/controller/Comparison.controller', ["sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/v2/ODataModel", "sap/ui/model/json/JSONModel", "sap/ui/core/ValueState", "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator", "sap/m/MessageBox", "sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/EventProvider", "sap/i2d/lo/lib/zvchclfz/common/util/XMLFragmentCache",
	"sap/i2d/lo/lib/zvchclfz/common/util/Logger", "sap/i2d/lo/lib/zvchclfz/common/Constants", "sap/ui/core/CustomData",
	"sap/i2d/lo/lib/zvchclfz/common/type/InspectorMode", "sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/ComparisonFormatter"
], function (C, O, J, V, F, a, M, I, E, X, L, b, c, d, e) {
	"use strict";
	return C.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.controller.Comparison", {
		_formatter: e,
		onInit: function () {
			E.attachResetComparison(this.onResetComparison, this);
			E.attachInitComparison(this.onInitComparison, this);
			E.attachRestrictComparison(this.onRestrictComparison, this);
			var j = new J();
			j.setProperty("/hasError", false);
			this.getView().setBusyIndicatorDelay(0);
			this.getView().setModel(j);
		},
		onExit: function () {
			E.detachResetComparison(this.onResetComparison, this);
			E.detachInitComparison(this.onInitComparison, this);
			E.detachRestrictComparison(this.onRestrictComparison, this);
		},
		onRestrictComparison: function (o) {
			if (I.getProperty("/isComparisonRestrictionActive")) {
				var f = o.getParameter("oConfigurationInstance");
				var i = null;
				if (f.ParentInstanceId !== f.InstanceId) {
					i = new F({
						path: "InstanceId",
						operator: a.EQ,
						value1: parseInt(f.InstanceId, 10)
					});
				}
				this.getView().byId("diffTreeTable").getBinding("rows").filter(i);
			}
		},
		onInitComparison: function (o) {
			var s = o.getParameter("configurationContextId");
			var S = o.getParameter("sampleDataPath");
			if (!this.sContextId || this.sContextId !== s) {
				this.sContextId = s;
				this._refresh(S, s);
			}
		},
		onResetComparison: function (o) {
			this.getView().byId("diffTreeTable").getBinding("rows").filter(null);
		},
		onItemDescriptionPressed: function (o) {
			var D = o.getSource().getBindingContext().getObject();
			var p;
			if (D.DiffItemType === 1) {
				p = new Promise(function (r, R) {
					var P = this._createInstancePath(D);
					r(P);
				}.bind(this));
			} else {
				p = this._createCsticPath(D);
			}
			p.then(function (P) {
				if (P) {
					this._inspect(D.DiffItemType, P);
				} else {
					var r = this.getOwnerComponent().getModel("i18n").getResourceBundle();
					M.error(r.getText("vchclf_cstic_does_not_exist", [D.CsticId]));
				}
			}.bind(this));
		},
		_resolveToBOMNodePath: function (i) {
			var o = this.getOwnerComponent().getParent();
			var D = o.getModel("vchclf");
			var f = D.getProperty(i);
			var g = D.getData();
			var B;
			for (var p in g) {
				if (p.indexOf("BOMNodeSet") > -1) {
					B = D.getProperty("/" + p + "/to_ConfigurationInstance");
					if (B && B.ContextId && B.ContextId === f.ContextId && B.InstanceId === f.InstanceId) {
						return "/ConfigurationContextSet('" + f.ContextId + "')/BOMNodes" + p.replace("BOMNodeSet", "");
					}
				}
			}
			return null;
		},
		_createCsticPath: function (D) {
			return new Promise(function (r, R) {
				var o = this.getOwnerComponent().getParent();
				var f = o.getModel("vchclf");
				var i = f.getProperty(this._createInstancePath(D), null, true);
				var g = i.CharacteristicsGroups.results;
				if (g && g.length > 0) {
					this._ensureCsticLoaded(g, D.CsticId).then(function (h) {
						r(h ? "/" + f.getKey(h) : undefined);
					}.bind(this));
				} else {
					r();
				}
			}.bind(this));
		},
		_ensureCsticLoaded: function (g, s) {
			var o = this.getOwnerComponent().getParent();
			var f = o.getModel("vchclf");
			var k;
			var G;
			return new Promise(function (r, R) {
				var h;
				var l = [];
				for (var i = 0; i < g.length; i++) {
					if (g[i].Characteristics.results) {
						h = g[i].Characteristics.results.filter(function (m) {
							return m.CsticId == s;
						});
						if (h.length > 0) {
							r(h[0]);
						}
					} else {
						l.push(g[i]);
					}
				}
				G = l.length;
				if (G > 0) {
					for (var j = 0; j < l.length; j++) {
						k = f.getKey(l[j]);
						f.facadeRead("/" + k + "/Characteristics", null, null, [new F({
							path: "CsticId",
							operator: a.EQ,
							value1: s
						})]).then(function (D) {
							G--;
							h = D.results.filter(function (m) {
								return m.CsticId == s;
							});
							if (h.length > 0) {
								r(h[0]);
							} else if (G === 0) {
								r();
							}
						}.bind(this));
					}
				} else {
					r();
				}
			}.bind(this));
		},
		_createInstancePath: function (D) {
			var o = this.getOwnerComponent().getParent();
			var i = o.getModel("vchclf").createKey("ConfigurationInstanceSet", {
				ContextId: this.sContextId,
				InstanceId: D.InstanceId + ""
			});
			return "/" + i;
		},
		_showConfigInstance: function (p) {
			var o = this.getOwnerComponent().getParent();
			var r = o.getValuationComponent().getRootBindingPath();
			var D = o.getModel("vchclf");
			var f = D.getProperty(p);
			var g = D.getProperty(r);
			if (g.InstanceId !== f.InstanceId) {
				return o.updateInstance(f);
			} else {
				return Promise.resolve();
			}
		},
		onActionSheetInspectPressed: function (o) {
			var s = o.getSource();
			var S = s.getModel("comparisonActionSheet");
			var D = S.getProperty("/diffItemType");
			var p = S.getProperty("/path");
			this._inspect(D, p);
		},
		_inspect: function (D, p) {
			this._showConfigInstance(p).then(function () {
				if (D !== 1) {
					this.getOwnerComponent().inspectObject(p, d.objectType.Characteristic);
				} else {
					p = this._resolveToBOMNodePath(p);
					this.getOwnerComponent().inspectObject(p, d.objectType.BOMComponent);
				}
			}.bind(this));
		},
		onActionSheetShowInConfigPressed: function (o) {
			var s = o.getSource();
			var S = s.getModel("comparisonActionSheet");
			var D = S.getProperty("/diffItemType");
			var p = S.getProperty("/path");
			this._showConfigInstance(p).then(function () {
				if (D !== 1) {
					var f = this.getOwnerComponent().getParent();
					f.getValuationComponent().highlightCharacteristic(p);
				}
			}.bind(this));
		},
		onSearchPressed: function (o) {
			var q = o.getParameter("query");
			var f = null;
			if (q !== "") {
				var g = [];
				g.push(new F({
					path: "ComputedItemDescription",
					operator: "Contains",
					value1: q
				}));
				g.push(new F({
					path: "ComputedDiffTypeText",
					operator: "Contains",
					value1: q
				}));
				g.push(new F({
					path: "ComputedValueFromText",
					operator: "Contains",
					value1: q
				}));
				g.push(new F({
					path: "ComputedValueToText",
					operator: "Contains",
					value1: q
				}));
				f = new F({
					filters: g,
					and: false
				});
			}
			this.getView().byId("diffTreeTable").getBinding("rows").filter(f);
		},
		_getEtoStatus: function () {
			return this.getOwnerComponent().getParent().getBindingContext("vchclf").getObject().EtoStatus;
		},
		_refresh: function (s, f) {
			try {
				if (s) {
					var u = sap.ui.require.toUrl(s);
					var j = this.getView().getModel();
					j.loadData(u);
					j.dataLoaded().then(function () {
						this.getView().getModel().setProperty("/hasError", false);
						var h = this.getView().getModel().getProperty("/diffItems");
						this._convertData(h, f);
					}.bind(this));
				} else {
					var g = this._getEtoStatus();
					var S = I.getSupportedEtoStatusesForComparison()[g];
					if (!S) {
						throw Error("No SourceRef defined for ETO status '" + g + "'");
					}
					var D = this.getOwnerComponent().getModel("vchclf");
					var U = {
						ContextId: this.sContextId,
						SourceRef: S,
						TargetRef: b.DIFF_REF_TYPE.CURRENT
					};
					this.getView().getModel().setProperty("/hasError", false);
					this.getView().setBusy(true);
					D.facadeCallFunction("/CalculateDifferences", U, null, null, "GET").then(function (h) {
						this._convertData(h.results, f);
						this.getView().setBusy(false);
					}.bind(this)).catch(function (h) {
						this.getView().getModel().setProperty("/hasError", true);
						L.logErrorStack(h, this);
						this.getView().setBusy(false);
					}.bind(this));
				}
			} catch (o) {
				this.getView().getModel().setProperty("/hasError", true);
				L.logErrorStack(o, this);
			}
		},
		_convertData: function (D, s) {
			var S = this._sortDiffItemsAndComputeDescription(D);
			var m = this._aggregateCsticValues(S.aDiffItemsValue);
			this._recomputeDiffTypeAndDescriptionForMultiValueChanges(m);
			var r = this._buildInstancesTree(S, m);
			this.getView().getModel().getData().items = [];
			this.getView().getModel().setProperty("/items", r);
			E.fireComparisonDataConverted({
				items: r,
				contextId: s
			});
		},
		_sortDiffItemsAndComputeDescription: function (D) {
			var r = {
				mDiffItemsInstance: {},
				aDiffItemsGroup: [],
				aDiffItemsCstic: [],
				aDiffItemsValue: []
			};
			if (!$.isArray(D)) {
				return r;
			}
			for (var i = 0; i < D.length; i++) {
				switch (D[i].DiffItemType) {
				case 1:
					{
						D[i].items = [];r.mDiffItemsInstance[D[i].InstanceId] = D[i];
						break;
					}
				case 2:
					{
						r.aDiffItemsGroup.push(D[i]);
						break;
					}
				case 3:
					{
						r.aDiffItemsCstic.push(D[i]);
						break;
					}
				case 4:
					{
						r.aDiffItemsValue.push(D[i]);
						break;
					}
				default:
					{
						throw Error("Unhandled DiffItemType '" + D[i].DiffItemType + "'.");
					}
				}
				D[i].ComputedItemDescription = this._formatter.getItemDescription(D[i]);
				D[i].ComputedDiffTypeText = this._formatter.getTextForDiffType(this, D[i].DiffType);
			}
			return r;
		},
		_createCsticKey: function (o) {
			return o.InstanceId + "_" + o.CsticId;
		},
		_aggregateCsticValues: function (D) {
			var m = {};
			var v;
			var s, f, g, h, k;
			for (var i = 0; i < D.length; i++) {
				k = this._createCsticKey(D[i]);
				if (!m[k]) {
					v = {
						Source: [],
						Target: []
					};
					D[i].Values = v;
					m[k] = D[i];
				} else {
					v = m[k].Values;
				}
				s = D[i].ValueFrom;
				g = D[i].ValueIdFrom;
				f = D[i].ValueTo;
				h = D[i].ValueIdTo;
				delete D[i].ValueFrom;
				delete D[i].ValueIdFrom;
				delete D[i].ValueTo;
				delete D[i].ValueIdTo;
				if (s !== "" && g !== "") {
					v.Source.push({
						Value: s,
						ValueId: g
					});
				}
				if (f !== "" && h !== "") {
					v.Target.push({
						Value: f,
						ValueId: h
					});
				}
			}
			return m;
		},
		_recomputeDiffTypeAndDescriptionForMultiValueChanges: function (m) {
			var v = function (h, j, k) {
				return h.Value === this;
			};
			for (var s in m) {
				if (m[s].Values.Source.length === 0 && m[s].Values.Target.length > 0) {
					m[s].DiffType = 1;
				} else if (m[s].Values.Target.length === 0 && m[s].Values.Source.length > 0) {
					m[s].DiffType = 2;
				} else {
					var f = false;
					var g;
					for (var i = 0; i < m[s].Values.Source.length; i++) {
						g = m[s].Values.Source[i].Value;
						if (!m[s].Values.Target.some(v.bind(g))) {
							f = true;
							break;
						}
					}
					m[s].DiffType = f ? 3 : 0;
					m[s].ComputedDiffTypeText = this._formatter.getTextForDiffType(this, m[s].DiffType);
				}
			}
			return m;
		},
		_buildInstancesTree: function (s, m) {
			var r = [];
			var i;
			for (i = 0; i < s.aDiffItemsGroup.length; i++) {
				s.mDiffItemsInstance[s.aDiffItemsGroup[i].InstanceId].items.push(s.aDiffItemsGroup[i]);
			}
			for (i = 0; i < s.aDiffItemsCstic.length; i++) {
				s.mDiffItemsInstance[s.aDiffItemsCstic[i].InstanceId].items.push(s.aDiffItemsCstic[i]);
			}
			for (var f in m) {
				if (m.hasOwnProperty(f)) {
					m[f].ComputedValueFromText = this._formatter.getValuesFromText(m[f].Values);
					m[f].ComputedValueToText = this._formatter.getValuesToText(m[f].Values);
					if (s.mDiffItemsInstance[m[f].InstanceId]) {
						s.mDiffItemsInstance[m[f].InstanceId].items.push(m[f]);
					}
				}
			}
			for (var g in s.mDiffItemsInstance) {
				if (s.mDiffItemsInstance.hasOwnProperty(g)) {
					r.push(s.mDiffItemsInstance[g]);
				}
			}
			return r;
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/controller/ConfProfileProperties.controller', [
	"sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/ConfProfileFormatter",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/GeneralFormatter", "sap/ui/core/mvc/Controller"
], function (C, G, a) {
	"use strict";
	return a.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.controller.ConfProfileProperties", {
		_formatter: C,
		_generalFormatter: G
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/controller/Dependencies.controller', [
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/UiConfig", "sap/i2d/lo/lib/zvchclfz/components/inspector/dao/InspectorDAO",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/DependencyFormatter",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants", "sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/NavigationManager", "sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"
], function (U, I, D, C, a, N, b, J) {
	"use strict";
	return b.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.controller.Dependencies", {
		_dependencyFormatter: D,
		_dependencies: null,
		_lastReadDependencies: null,
		onInit: function () {
			this._dependencies = new J({});
			this.getView().setModel(this._dependencies, "dependencies");
		},
		onActivate: function () {
			var v = this.getView();
			if (!this._lastReadDependencies || !a.compareLastObjectNavigatedToPath(this._lastReadDependencies)) {
				v.setBusy(true);
				var p = a.getLastObjectNavigatedToPath();
				I.read(p + "/" + C.navigationProperties.Common.ObjectDependencyHeaders).then(function (d) {
					this._dependencies.setData(d);
					v.setBusy(false);
					this._lastReadDependencies = p;
				}.bind(this)).catch(function (d) {
					v.setBusy(false);
				});
			}
		},
		onDependencyItemPress: function (e) {
			var o = e.getSource().getBindingContext("dependencies").getObject();
			var p = this.getView().getModel().createKey("/" + C.entitySets.ObjectDependencyDetails, {
				ContextId: o.ContextId,
				ObjectDependency: o.ObjectDependency
			});
			this.getView().getModel("__viewData").setProperty("/selectedTab", a.getProperty("/selectedTab"));
			N.getContainer().getCurrentPage().setBusy(true);
			N.navigateTo(p, U.inspectorMode.objectType.ObjectDependency);
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/controller/DependencyDetails.controller', [
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/UiConfig", "sap/i2d/lo/lib/zvchclfz/components/inspector/dao/InspectorDAO",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/DependencyFormatter",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/GeneralFormatter", "sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants",
	"sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"
], function (U, I, D, G, C, a, J) {
	"use strict";
	var O = C.navigationProperties.ObjectDependencyDetails.ObjectDependencyCodes;
	var b = 3;
	var B = 100;
	return a.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.controller.DependencyDetails", {
		_formatter: D,
		_generalFormatter: G,
		_details: null,
		_viewData: null,
		_isAllDependencySourceCodeLoaded: null,
		_cachedDependencySource: null,
		onInit: function () {
			var v = this.getView();
			this._details = new J();
			this._viewData = new J(v.getViewData());
			v.setModel(this._details, "details");
			v.setModel(this._viewData, "__viewData");
		},
		onNavigatedTo: function () {
			var v = this.getView();
			var p = this._viewData.getProperty("/objectPath");
			v.setBusy(true);
			I.getDependencyDetailsWithExpandedSourceCode(p).then(function (d) {
				var o = this._viewData.getProperty("/objectType");
				d[O] = d[O].results;
				this._isAllDependencySourceCodeLoaded = false;
				this._cachedDependencySource = [];
				if (d[O].length > b) {
					d[O] = d[O].slice(0, b);
					this._viewData.setProperty("/_isToggleDepSourceCodeLinkVisible", true);
				} else {
					this._viewData.setProperty("/_isToggleDepSourceCodeLinkVisible", false);
				}
				this._details.setData(d);
				this._viewData.setProperty("/title", U.objectTypeConfig[o].getTitle(d));
				this._viewData.setProperty("/subTitle", U.objectTypeConfig[o].getSubTitle(d));
			}.bind(this)).catch(function () {}).then(function () {
				v.setBusy(false);
			});
		},
		onToggleDependencyCodeLinesPressed: function (e) {
			var s = e.getSource();
			if (!this._isAllDependencySourceCodeLoaded) {
				this.loadAllDependencySourceCodeFromService(s);
			} else {
				this.toggleDependencySourceCodeFromCache();
			}
		},
		toggleDependencySourceCodeFromCache: function () {
			var c = this._details.getProperty("/" + O);
			var d = this._cachedDependencySource.length === c.length ? c.slice(0, b) : this._cachedDependencySource;
			this._details.setProperty("/" + O, d);
			this._focusOnSourceCode();
		},
		loadAllDependencySourceCodeFromService: function (l) {
			var p = this._viewData.getProperty("/objectPath");
			l.setBusy(true);
			I.getAllDependencySourceCode(p).then(function (d) {
				this._details.setProperty("/" + O, d.results);
				if (d.results.length > B) {
					this._details.setSizeLimit(d.results.length);
				}
				this._isAllDependencySourceCodeLoaded = true;
				this._cachedDependencySource = d.results;
				this._focusOnSourceCode();
			}.bind(this)).catch(function () {}).then(function () {
				l.setBusy(false);
			});
		},
		_focusOnSourceCode: function () {
			this.byId("idDependencySourceCode").focus();
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/controller/DependencyTrace.controller', [
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/TraceEntryTextTypes",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/DependencyFormatter",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/DependencyTraceFormatter",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/dialog/DependencyTraceFilterDialog",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/DependencyTraceModel",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/EventProvider", "sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/i18n", "sap/i2d/lo/lib/zvchclfz/components/inspector/util/ODataModelHelper",
	"sap/m/MessageBox", "sap/ui/core/Fragment", "sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"
], function (T, D, a, b, c, E, I, i, O, M, F, C, J) {
	"use strict";
	var L = "reason";
	var d = "Growing";
	var A = true;
	return C.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.controller.DependencyTrace", {
		_isTraceInvalidated: false,
		_uiModel: null,
		_formatter: a,
		_dependencyFormatter: D,
		onInit: function () {
			E.attachFetchTrace(this._fetchTraceTriggered, this);
			E.attachResetTrace(this._resetTraceTriggered, this);
			E.attachSaveTraceState(this._saveTraceStateTriggered, this);
			E.attachRestoreTraceState(this._restoreTraceStateTriggered, this);
			E.attachActivateTrace(this._activateTraceTriggered, this);
			E.attachDeactivateTrace(this._deactivateTraceTriggered, this);
			this._uiModel = new J({
				searchText: ""
			});
			this.getView().setModel(this._uiModel, "ui");
			this._initializeTraceModel();
		},
		onExit: function () {
			E.detachFetchTrace(this._fetchTraceTriggered, this);
			E.detachResetTrace(this._resetTraceTriggered, this);
			E.detachSaveTraceState(this._saveTraceStateTriggered, this);
			E.detachRestoreTraceState(this._restoreTraceStateTriggered, this);
			E.detachActivateTrace(this._activateTraceTriggered, this);
			E.detachDeactivateTrace(this._deactivateTraceTriggered, this);
			b.destroy();
		},
		onBeforeRendering: function () {
			if (I.getProperty("/isTraceOn") && this._isTraceInvalidated) {
				c.clearBuffer();
				this._reloadTraceMessages();
			}
		},
		onFilterPressed: function () {
			this._openTraceFilterDialog();
		},
		onOverflowToolbarPressed: function () {
			this._openTraceFilterDialog();
		},
		onResetFilterPressed: function () {
			c.clearAllFilters();
			this._uiModel.setProperty("/searchText", "");
			this._reloadTraceMessages();
			this.getView().byId("idTraceFilterButton").focus();
		},
		onSearchLiveChanged: function (e) {
			c.setSearchText(e.getParameter("newValue"));
		},
		onSearchTriggered: function () {
			this._reloadTraceMessages();
		},
		onFilterTraceEntryItem: function (e) {
			var p = e.getParameters();
			c.setFiltersForFilterType(p.type, [p]);
			this._reloadTraceMessages();
			this._setFocusOnTraceSearchField();
		},
		onInspectTraceEntryItem: function (e) {
			var p = e.getParameters();
			if (p.type) {
				var s = e.getSource();
				var o = s && s.getBindingContext("trace");
				var f = T.InspectTypes[p.type];
				var B = f.getBinding(p.inspectParameters, I.getConfigurationContextId(), o && $.trim(o.getProperty("InstanceId")) || I.getProperty(
					"/InstanceId"), I.getProperty("/GroupId"));
				this.getOwnerComponent()._processNavigation(B.getPath(), p.navigationObjectType, true, B.getKeyValuePairs());
				E.fireSetFocusOnHeader();
			}
		},
		onWhereWasValueSet: function (e) {
			var p = O.generateWhereWasValueSetPath(I.getConfigurationContextPath(), e.getParameter("BOMComponentId"), e.getParameter("CsticId"));
			var s = i.getTextWithParameters("vchclf_trace_dot_separated_items", [e.getParameter("BOMComponentName"), e.getParameter("CsticName")]);
			var P = i.getTextWithParameters("vchclf_trace_filter_status_where_was_value_set", [s]);
			c.setRootPath(p, P);
			this._uiModel.setProperty("/searchText", "");
			this._reloadTraceMessages();
			this._setFocusOnTraceSearchField();
		},
		onWhereWasCsticUsed: function (e) {
			var p = O.generateWhereWasCsticUsedPath(I.getConfigurationContextPath(), e.getParameter("BOMComponentId"), e.getParameter("CsticId"));
			var s = i.getTextWithParameters("vchclf_trace_dot_separated_items", [e.getParameter("BOMComponentName"), e.getParameter("CsticName")]);
			var P = i.getTextWithParameters("vchclf_trace_filter_status_where_was_cstic_used", [s]);
			c.setRootPath(p, P);
			this._uiModel.setProperty("/searchText", "");
			this._reloadTraceMessages();
			this._setFocusOnTraceSearchField();
		},
		onWhereWasDepSet: function (e) {
			this._triggerDepResultFilter(O.generateWhereWasDepSetPath.bind(O), "vchclf_trace_filter_status_where_was_dep_set", e.getParameters());
		},
		onWhereWasDepUsed: function (e) {
			this._triggerDepResultFilter(O.generateWhereWasDepUsedPath.bind(O), "vchclf_trace_filter_status_where_was_dep_used", e.getParameters());
		},
		onExpandTraceEntryPressed: function (e) {
			var s = e.getSource();
			var B = s.getBindingContext("trace");
			if (B) {
				var o = B.getObject();
				if (e.getParameter("expand") && s.getContent().length === 0 && o.HasDetail) {
					s.setBusy(true);
					c.expandEntry(o.TraceGuid, o.RoundtripNo, o.EntryNo).then(function () {
						this._setTraceEntryDetails(s);
					}.bind(this)).catch(function (f) {
						this._showErrorMessageInMessageBox(f);
					}.bind(this)).then(function () {
						s.setBusy(false);
					});
				}
			}
		},
		onTraceEntryClicked: function (e) {
			var o = e.getSource().getBindingContext("trace");
			if (o) {
				c.highlightTraceEntryText(o.getPath());
			}
		},
		toggleDependencySourceCodeFromCache: function (e) {
			var s = e.getSource();
			var B = s.getBindingContext("trace");
			if (B) {
				var o = B.getObject();
				s.setBusy(true);
				c.toggleDependencyCodesForEntry(o.TraceGuid, o.RoundtripNo, o.EntryNo).then(function () {
					var f = s.getParent().getContent().filter(function (g) {
						return g instanceof sap.m.TextArea;
					})[0];
					f.focus();
				}).catch(function (f) {
					this._showErrorMessageInMessageBox(f);
				}.bind(this)).then(function () {
					s.setBusy(false);
				});
			}
		},
		onListUpdateStarted: function (e) {
			if (e.getParameter(L) === d) {
				var v = this.getView();
				v.setBusy(true);
				c.fetch().catch(function (o) {
					this._showErrorMessageInMessageBox(o);
				}.bind(this)).then(function () {
					v.setBusy(false);
				});
			}
		},
		_fetchTraceTriggered: function () {
			if (I.getProperty("/isTraceOn") && I.getInspectorVisibility() && I.isTraceViewSelected()) {
				c.clearBuffer();
				this._reloadTraceMessages();
			} else {
				this._isTraceInvalidated = true;
			}
		},
		_resetTraceTriggered: function () {
			this._initializeTraceModel();
		},
		_saveTraceStateTriggered: function () {
			c.saveState();
		},
		_restoreTraceStateTriggered: function () {
			c.restoreState();
		},
		_activateTraceTriggered: function () {
			this._handleTraceActivation(c.activateTraceAndReloadMessages.bind(c), A);
		},
		_deactivateTraceTriggered: function () {
			this._handleTraceActivation(c.deactivateTraceAndReloadMessages.bind(c), !A);
		},
		_handleTraceActivation: function (f, p) {
			var v = this.getView();
			v.setBusy(true);
			I.setProperty("/traceSwitchBusyState", true);
			f().then(function () {
				if (p) {
					I.setProperty("/isTraceActivatedOnce", true);
				}
				I.setProperty("/isTraceOn", p);
				this._isTraceInvalidated = false;
			}.bind(this)).catch(function (e) {
				I.setProperty("/isTraceOn", !p);
				this._showErrorMessageInMessageBox(e);
			}.bind(this)).then(function () {
				I.setProperty("/traceSwitchBusyState", false);
				c.updateFilterText();
				v.setBusy(false);
			});
		},
		_initializeTraceModel: function () {
			c.initialize();
			this._uiModel.setProperty("/searchText", "");
			this._isTraceInvalidated = false;
			this.getView().setModel(c.getModel(), "trace");
		},
		_reloadTraceMessages: function () {
			if (I.getProperty("/isTraceActivatedOnce")) {
				var v = this.getView();
				v.setBusy(true);
				this._isTraceInvalidated = false;
				c.reload().then(function () {
					this._scrollTraceToTop();
					c.updateFilterText();
					v.setBusy(false);
				}.bind(this)).catch(function (e) {
					if (!e.isAborted) {
						this._showErrorMessageInMessageBox(e);
						c.updateFilterText();
						v.setBusy(false);
					}
				}.bind(this));
			} else {
				c.updateFilterText();
			}
		},
		_scrollTraceToTop: function () {
			var t = this.getView().byId("idTraceContainer");
			if (t) {
				t.scrollTo(0, 0);
			}
		},
		_openTraceFilterDialog: function () {
			c.openTraceFilterDialog().then(function (r) {
				if (r.wasApplied) {
					this._reloadTraceMessages();
				}
			}.bind(this));
		},
		_showErrorMessageInMessageBox: function (e) {
			if (e && e.message) {
				M.error(e.message);
			}
		},
		_setTraceEntryDetails: function (t) {
			return F.load({
				name: "sap.i2d.lo.lib.zvchclfz.components.inspector.fragment.TraceEntryDetails",
				controller: this
			}).then(function (o) {
				t.addContent(o);
			});
		},
		_setFocusOnTraceSearchField: function () {
			setTimeout(function () {
				this.getView().byId("idQuickSearch").focus();
			}.bind(this), 0);
		},
		_triggerDepResultFilter: function (p, P, o) {
			var s = o.ObjectDependency,
				S = o.SubprocedureIndex,
				e = o.ObjectDependencyName,
				f = o.ObjectDependencyId;
			var g = p.apply(this, [I.getConfigurationContextPath(), s, S, f]);
			var h = !S ? e : i.getTextWithParameters("vchclf_trace_msg_link_parentheses_separator", [e, S]);
			var j = i.getTextWithParameters(P, [h]);
			c.setRootPath(g, j);
			this._uiModel.setProperty("/searchText", "");
			this._reloadTraceMessages();
			this._setFocusOnTraceSearchField();
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/controller/InspectorFrame.controller', [
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/EventProvider", "sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/NavigationHandler",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/NavigationManager", "sap/i2d/lo/lib/zvchclfz/common/util/XMLFragmentCache",
	"sap/ui/core/mvc/Controller"
], function (E, I, N, a, X, C) {
	"use strict";
	return C.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.controller.InspectorFrame", {
		_isNavigationInProgress: false,
		onInit: function () {
			a.setContainer(this.byId("idInspectorNavContainer"));
			a.setNavigationHandler(new N(this));
			E.attachSetFocusOnHeader(this.onSetFocusOnHeader, this);
			E.attachNavigateBack(this.onBackPressed, this);
		},
		onExit: function () {
			E.detachSetFocusOnHeader(this.onSetFocusOnHeader, this);
			E.detachNavigateBack(this.onBackPressed, this);
		},
		onClosePressed: function () {
			this.getOwnerComponent().fireClosePanelPressed();
		},
		onBackPressed: function () {
			a.navigateBack();
			this._refreshBackButtonStatus();
			E.fireSetFocusOnHeader();
		},
		onSelectedViewChanged: function () {
			this._refreshBackButtonStatus();
			if (I.isInspectorViewSelected() && !I.compareLastAccessedAndNavigatedTo()) {
				this.getOwnerComponent().updateNavigationManager();
			}
			if (I.isComparisonViewSelected()) {
				E.fireInitComparison({
					configurationContextId: I.getProperty("/ConfigurationContextId")
				});
			}
		},
		onNavigate: function () {
			this._isNavigationInProgress = true;
			this._refreshBackButtonStatus();
		},
		onAfterNavigate: function () {
			this._isNavigationInProgress = false;
			this._refreshBackButtonStatus();
		},
		onTraceSwitchChange: function () {
			if (I.getProperty("/isTraceOn")) {
				E.fireActivateTrace();
			} else {
				E.fireDeactivateTrace();
			}
		},
		onComparisonSettingsPressed: function (e) {
			var p = X.createFragment("vchclf_diff_settings_popover",
				"sap/i2d/lo/lib/zvchclfz/components/inspector/fragment/ComparisonSettingsPopover", this);
			this.getView().addDependent(p);
			p.openBy(e.getSource());
		},
		onChangeComparisonRestrictionActive: function () {
			E.fireResetComparison();
		},
		_refreshBackButtonStatus: function () {
			var c = a.getContainer().getCurrentPage();
			if (!this._isNavigationInProgress && c && I.isInspectorViewSelected() && !c.getModel("__viewData").getProperty("/isInitialPage")) {
				I.setProperty("/isBackEnabled", true);
			} else {
				I.setProperty("/isBackEnabled", false);
			}
		},
		onSetFocusOnHeader: function () {
			var s = this.getView().byId("idInspectorSegmentedButton");
			setTimeout(function () {
				s.focus();
			}, 0);
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/controller/OperationComponents.controller', ["sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel", "sap/i2d/lo/lib/zvchclfz/components/inspector/config/UiConfig",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel", "sap/i2d/lo/lib/zvchclfz/components/inspector/dao/InspectorDAO",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants", "sap/i2d/lo/lib/zvchclfz/components/inspector/logic/NavigationManager",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/ODataModelHelper"
], function (C, J, U, I, a, b, N, O) {
	"use strict";
	return C.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.controller.OperationComponents", {
		_operationComponents: null,
		_lastReadRoutingPath: null,
		onInit: function () {
			this._operationComponents = new J();
			this.getView().setModel(this._operationComponents, "components");
		},
		onActivate: function () {
			if (!this._lastReadRoutingPath || !I.compareLastObjectNavigatedToPath(this._lastReadRoutingPath)) {
				this._bindComponentsToList(I.getLastObjectNavigatedToPath());
			}
		},
		reloadContent: function () {
			if (this._lastReadRoutingPath) {
				this._bindComponentsToList(this._lastReadRoutingPath);
			}
		},
		_bindComponentsToList: function (r) {
			var v = this.getView();
			v.setBusy(true);
			a.read(r + "/" + b.navigationProperties.RoutingNode.Components, false).then(function (d) {
				this._operationComponents.setData(d);
				v.setBusy(false);
				this._lastReadRoutingPath = r;
			}.bind(this)).catch(function () {
				this._lastReadRoutingPath = null;
				this._operationComponents.setData({});
				v.setBusy(false);
			}.bind(this));
		},
		onComponentItemPress: function (e) {
			var c = e.getSource().getBindingContext("components").getObject();
			var s = I.getConfigurationContextId();
			var d = "/" + O.getModel().createKey(b.entitySets.ConfigurationContext, {
				ContextId: s
			}) + "/" + b.navigationProperties.ConfigurationContext.BOMNode + "('" + c.ComponentId + "')";
			this.getView().getModel("__viewData").setProperty("/selectedTab", I.getProperty("/selectedTab"));
			N.getContainer().getCurrentPage().setBusy(true);
			N.navigateTo(d, U.inspectorMode.objectType.BOMComponent);
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/controller/OperationProperties.controller', [
	"sap/i2d/lo/lib/zvchclfz/components/inspector/controller/SuperInspectorProperties.controller",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/RoutingFormatter", "sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/SuperInspector"
], function (S, R, C, a) {
	"use strict";
	return S.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.controller.OperationProperties", {
		_routingFormatter: R,
		isDifferentConfiguredAndSuperData: function (p) {
			return a.isDifferentConfiguredAndSuperData(p) || a.isDifferentConfiguredAndSuperStandardValues(p[C.navigationProperties.Operation.StandardValues]);
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/controller/PRTProperties.controller', [
	"sap/i2d/lo/lib/zvchclfz/components/inspector/controller/SuperInspectorProperties.controller"
], function (S) {
	"use strict";
	return S.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.controller.PRTProperties", {});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/controller/PRTs.controller', ["sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel", "sap/i2d/lo/lib/zvchclfz/components/inspector/config/UiConfig",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel", "sap/i2d/lo/lib/zvchclfz/components/inspector/dao/InspectorDAO",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/PRTFormatter", "sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/NavigationManager"
], function (C, J, U, I, a, P, b, N) {
	"use strict";
	return C.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.controller.PRTs", {
		_prts: null,
		_lastReadRoutingPath: null,
		_prtFormatter: P,
		onInit: function () {
			this._prts = new J({});
			this.getView().setModel(this._prts, "prts");
		},
		onActivate: function () {
			if (!this._lastReadRoutingPath || !I.compareLastObjectNavigatedToPath(this._lastReadRoutingPath)) {
				this._bindPRTsToList(I.getLastObjectNavigatedToPath());
			}
		},
		reloadContent: function () {
			if (this._lastReadRoutingPath) {
				this._bindPRTsToList(this._lastReadRoutingPath);
			}
		},
		_bindPRTsToList: function (r) {
			var v = this.getView();
			v.setBusy(true);
			a.read(r + "/" + b.navigationProperties.RoutingNode.PRTs, false).then(function (d) {
				this._prts.setData(d);
				v.setBusy(false);
				this._lastReadRoutingPath = r;
			}.bind(this)).catch(function () {
				this._lastReadRoutingPath = null;
				this._prts.setData({});
				v.setBusy(false);
			}.bind(this));
		},
		onPRTItemPress: function (e) {
			var p = e.getSource().getBindingContext("prts").getObject();
			var s = this._lastReadRoutingPath + "/" + b.navigationProperties.RoutingNode.PRTs + "(BillOfOperationsType='" + p.BillOfOperationsType +
				"',BillOfOperationsGroup='" + p.BillOfOperationsGroup + "',BOOOperationPRTInternalId='" + p.BOOOperationPRTInternalId +
				"',BOOOperationPRTIntVersCounter='" + p.BOOOperationPRTIntVersCounter + "')";
			this.getView().getModel("__viewData").setProperty("/selectedTab", I.getProperty("/selectedTab"));
			N.getContainer().getCurrentPage().setBusy(true);
			N.navigateTo(s, U.inspectorMode.objectType.PRT);
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/controller/RoutingHeaderProperties.controller', [
	"sap/i2d/lo/lib/zvchclfz/components/inspector/controller/SuperInspectorProperties.controller"
], function (S) {
	"use strict";
	return S.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.controller.RoutingHeaderProperties", {});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/controller/RoutingSequenceProperties.controller', [
	"sap/i2d/lo/lib/zvchclfz/components/inspector/controller/SuperInspectorProperties.controller"
], function (S) {
	"use strict";
	return S.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.controller.RoutingSequenceProperties", {});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/controller/SuperInspectorProperties.controller', [
	"sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/SuperInspectorFormatter",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants", "sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/SuperInspector", "sap/ui/core/mvc/Controller"
], function (S, C, I, a, b) {
	"use strict";
	return b.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.controller.SuperInspectorProperties", {
		_superInspectorFormatter: S,
		onAfterDataReceived: function () {
			if (I.getIsSuperInspectorAvailable()) {
				var v = this.getView();
				var p = v.getModel("properties").getProperty("/");
				var V = v.getModel("__viewData");
				if (p[C.navigationProperties.Common.Super].IsExcludedItem) {
					V.setProperty("/isSuperInspectorShown", true);
					V.setProperty("/isSuperInspectorEnabled", false);
				} else if (!this.isDifferentConfiguredAndSuperData(p)) {
					V.setProperty("/isSuperInspectorShown", false);
					V.setProperty("/isSuperInspectorEnabled", false);
				} else {
					V.setProperty("/isSuperInspectorShown", !!V.getProperty("/isSuperInspectorShown"));
					V.setProperty("/isSuperInspectorEnabled", true);
				}
			}
		},
		isDifferentConfiguredAndSuperData: function (p) {
			return a.isDifferentConfiguredAndSuperData(p);
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/controller/ValueProperties.controller', [
	"sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/ValuesFormatter", "sap/ui/core/mvc/Controller"
], function (V, C) {
	"use strict";
	return C.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.controller.ValueProperties", {
		_formatter: V
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/controller/Values.controller', [
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/UiConfig", "sap/i2d/lo/lib/zvchclfz/components/inspector/util/i18n",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/dao/InspectorDAO", "sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/EventProvider", "sap/i2d/lo/lib/zvchclfz/components/inspector/logic/NavigationManager",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/ValuesFormatter", "sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel"
], function (U, i, I, C, E, N, V, a, J, b) {
	"use strict";
	return a.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.controller.Values", {
		_values: null,
		_valuesFormatter: V,
		_lastReadValues: null,
		_valuesSorter: null,
		onInit: function () {
			this._values = new J({});
			this.getView().setModel(this._values, "values");
			this.getView().byId("idValuesList").getBinding("items").sort(this._getValuesSorter());
			E.attachRebindValueList(this._rebindValueList, this);
		},
		onExit: function () {
			E.detachRebindValueList(this._rebindValueList, this);
		},
		onBeforeRendering: function () {
			if (b.getLastObjectNavigatedToPath() && (!this._lastReadValues || !b.compareLastObjectNavigatedToPath(this._lastReadValues))) {
				this._bindValuesToList(b.getLastObjectNavigatedToPath());
			}
		},
		_rebindValueList: function (e) {
			var c = e.getParameter("csticPath");
			if (b.getProperty("/selectedTab") === U.inspectorMode.inspectorTab.values && b.getInspectorVisibility()) {
				this._bindValuesToList(c);
			} else {
				this._lastReadValues = null;
			}
		},
		_bindValuesToList: function (c) {
			var v = this.getView(),
				p, u, A = c + "/AllValues";
			v.setBusy(true);
			if (b.isInspectorEditable()) {
				var o = v.getModel().getContext(c);
				var B = o && o.getObject();
				var k = B ? B : v.getModel("__viewData").getProperty("/objectKeyParameters");
				u = !$.isEmptyObject(k) ? {
					ContextId: k.ContextId,
					InstanceId: k.InstanceId,
					GroupId: k.GroupId,
					CsticId: k.CsticId
				} : {};
			}
			if (!$.isEmptyObject(u)) {
				p = I.calculateAndFetchAlternativeValues(A, u);
			} else {
				p = I.read(A);
			}
			p.then(function (d) {
				this._values.setData(d);
				v.setBusy(false);
				this._lastReadValues = c;
			}.bind(this)).catch(function () {
				v.setBusy(false);
			});
		},
		onValueItemPress: function (e) {
			var o = e.getSource().getBindingContext("values").getObject();
			var p = this.getView().getModel().createKey("/" + C.entitySets.CharacteristicValue, {
				ContextId: o.ContextId,
				InstanceId: o.InstanceId,
				GroupId: o.GroupId,
				CsticId: o.CsticId,
				ValueId: o.ValueId
			});
			this.getView().getModel("__viewData").setProperty("/selectedTab", b.getProperty("/selectedTab"));
			N.getContainer().getCurrentPage().setBusy(true);
			N.navigateTo(p, U.inspectorMode.objectType.CharacteristicValue);
		},
		valuesComparator: function (v, o) {
			if (v.IsMasterDataValue && !o.IsMasterDataValue) {
				return -1;
			} else if (!v.IsMasterDataValue && o.IsMasterDataValue) {
				return 1;
			} else {
				return 0;
			}
		},
		getValueGroup: function (e) {
			var c = e.getModel().getProperty(e.getPath()).IsMasterDataValue;
			if (c) {
				return i.getText("vchclf_insp_values_properties_predefined");
			} else {
				return i.getText("vchclf_insp_values_properties_additional");
			}
		},
		_getValuesSorter: function () {
			if (!this._valuesSorter) {
				this._valuesSorter = new sap.ui.model.Sorter({
					path: "",
					descending: false,
					group: this.getValueGroup,
					comparator: this.valuesComparator
				});
			}
			return this._valuesSorter;
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/dao/DependencyTraceDAO', ["sap/i2d/lo/lib/zvchclfz/common/util/RequestQueue",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants", "sap/i2d/lo/lib/zvchclfz/components/inspector/util/ODataModelHelper",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel", "sap/ui/base/ManagedObject", "sap/base/Log"
], function (R, C, O, I, M, L) {
	"use strict";
	var T = C.navigationProperties.TraceEntry;
	var a = C.navigationProperties.TraceCharacteristic;
	var D = M.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.dao.DependencyTraceDAO", {
		_pendingEntryReadRequestUuid: null,
		_pendingValueHelpReadRequestUuid: null,
		activateTrace: function (c) {
			return R.add(this._activateTrace.bind(this, c), this);
		},
		_activateTrace: function (c) {
			return new Promise(function (r, f) {
				this._executeCallFunction({
					name: C.functionImports.activateTrace.name,
					urlParameters: {
						ContextId: c
					},
					success: r,
					error: this._rejectWithErrorMessageValue.bind(this, f)
				});
			}.bind(this));
		},
		deactivateTrace: function (c) {
			return R.add(this._deactivateTrace.bind(this, c), this);
		},
		_deactivateTrace: function (c) {
			return new Promise(function (r, f) {
				this._executeCallFunction({
					name: C.functionImports.deactivateTrace.name,
					urlParameters: {
						ContextId: c
					},
					success: r,
					error: this._rejectWithErrorMessageValue.bind(this, f)
				});
			}.bind(this));
		},
		checkTraceIsActive: function (c) {
			return R.add(this._checkTraceIsActive.bind(this, c), this);
		},
		_checkTraceIsActive: function (c) {
			return new Promise(function (r, f) {
				this._executeCallFunction({
					name: C.functionImports.isTraceActive.name,
					urlParameters: {
						ContextId: c
					},
					success: function (o) {
						var i = o[C.functionImports.isTraceActive.name] ? o[C.functionImports.isTraceActive.name].Success : false;
						r(i);
					},
					error: this._rejectWithErrorMessageValue.bind(this, f)
				});
			}.bind(this));
		},
		clearTrace: function (c) {
			return R.add(this._clearTrace.bind(this, c), this);
		},
		_clearTrace: function (c) {
			return new Promise(function (r, f) {
				this._executeCallFunction({
					name: C.functionImports.clearTrace.name,
					urlParameters: {
						ContextId: c
					},
					success: r,
					error: this._rejectWithErrorMessageValue.bind(this, f)
				});
			}.bind(this));
		},
		loadEntries: function (p, s, f, S, t) {
			if (this._pendingEntryReadRequestUuid) {
				R.remove(this._pendingEntryReadRequestUuid);
				this._pendingEntryReadRequestUuid = null;
			}
			var P = R.add(this._loadEntries.bind(this, p, s, f, S, t), this);
			this._pendingEntryReadRequestUuid = P.requestUuid;
			return P;
		},
		_loadEntries: function (p, s, f, S, t) {
			return new Promise(function (r, b) {
				var u = {};
				if (S > 0) {
					u.$skip = S;
				}
				if (t > 0) {
					u.$top = t;
				}
				if (s) {
					u.search = s;
				}
				O.getModel().facadeRead(p, u, undefined, f).then(r).catch(this._rejectWithErrorMessageValue.bind(this, b)).then(function () {
					this._pendingEntryReadRequestUuid = null;
				}.bind(this));
			}.bind(this));
		},
		loadTraceEntryDetails: function (t) {
			return R.add(this._loadTraceEntryDetails.bind(this, t), this);
		},
		_loadTraceEntryDetails: function (t) {
			return new Promise(function (r, f) {
				O.getModel().facadeRead(t, {
					"$expand": T.TraceBeforeCharacteristics + "," + T.TraceBeforeCharacteristics + "/" + a.TraceCharacteristicValues + "," + T.TraceResultCharacteristics +
						"," + T.TraceResultCharacteristics + "/" + a.TraceCharacteristicValues + "," + T.VariantTables + "," + T.InputTraceObjectDependencies +
						"," + T.ObjectDependencyCodes + "," + T.TracePricingFactor + "," + T.ResultCharacteristicResults + "," + T.BeforeCharacteristicResults +
						"," + T.ResultDependencyResults + "," + T.BeforeDependencyResults + "," + T.TraceBAdI
				}).then(r).catch(this._rejectWithErrorMessageValue.bind(this, f));
			}.bind(this));
		},
		loadAllDependencyCodesForEntry: function (t) {
			return R.add(this._loadAllDependencyCodesForEntry.bind(this, t), this);
		},
		_loadAllDependencyCodesForEntry: function (t) {
			return new Promise(function (r, f) {
				O.getModel().facadeRead(t + "/" + T.ObjectDependencyCodes).then(r).catch(this._rejectWithErrorMessageValue.bind(this, f));
			}.bind(this));
		},
		loadTraceValueHelpEntries: function (p, s, t, f) {
			if (this._pendingValueHelpReadRequestUuid) {
				R.remove(this._pendingValueHelpReadRequestUuid);
				this._pendingValueHelpReadRequestUuid = null;
			}
			var P = R.add(this._loadTraceValueHelpEntries.bind(this, p, s, t, f), this);
			this._pendingValueHelpReadRequestUuid = P.requestUuid;
			return P;
		},
		_loadTraceValueHelpEntries: function (p, s, t, f) {
			return new Promise(function (r, b) {
				var u = {};
				if (t > 0) {
					u.$top = t;
				}
				if (s) {
					u.search = s;
				}
				O.getModel().facadeRead(p, u, null, f).then(function (d) {
					this._pendingValueHelpReadRequestUuid = null;
					r(d.results);
				}.bind(this)).catch(function (e) {
					this._rejectWithErrorMessageValue(b, e);
					this._pendingValueHelpReadRequestUuid = null;
				}.bind(this));
			}.bind(this));
		},
		_executeCallFunction: function (s) {
			O.getModel().facadeCallFunction("/" + s.name, s.urlParameters ? s.urlParameters : {}).then(function (d) {
				if (s.success && $.isFunction(s.success)) {
					s.success(d);
				}
			}).catch(function (e) {
				if (s.error && $.isFunction(s.error)) {
					s.error(e);
				}
			});
		},
		_rejectWithErrorMessageValue: function (r, e) {
			L.error(e ? e.stack : "An unknown error occurred.");
			var m = {};
			if (e.statusCode === 0 || e.statusText === "abort") {
				m.isAborted = true;
			} else {
				var E = JSON.parse(e.responseText).error;
				if (E.innererror && $.isArray(E.innererror.errordetails)) {
					$.each(E.innererror.errordetails, function (i, o) {
						if (o.code === C.errorCode.TraceSwitchedOff) {
							I.setProperty("/isTraceOn", false);
							return false;
						}
						return true;
					});
				}
				m.message = E.message.value;
			}
			r(m);
		}
	});
	return new D();
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/dao/InspectorDAO', ["sap/ui/base/ManagedObject",
	"sap/i2d/lo/lib/zvchclfz/common/util/RequestQueue", "sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/ODataModelHelper"
], function (M, R, C, O) {
	"use strict";
	var I = M.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.dao.InspectorDAO", {
		_pendingReadRequest: {},
		read: function (p, i, e) {
			var u = i ? {
				"$expand": C.navigationProperties.Common.Super
			} : {};
			if (e) {
				u.$expand = u.$expand ? u.$expand + "," + e : e;
			}
			this._abortPendingReadRequest(p);
			return R.add(this._read.bind(this, p, u), this);
		},
		_read: function (p, u) {
			return new Promise(function (r, f) {
				O.getModel().facadeRead(p, u ? u : {}).then(function (d) {
					delete this._pendingReadRequest[p];
					r(d);
				}.bind(this)).catch(function (e) {
					var m = {
						isAborted: false
					};
					if (e.statusCode === 0 || e.statusText === "abort") {
						m.isAborted = true;
					} else {
						delete this._pendingReadRequest[p];
					}
					f(m);
				}.bind(this));
			}.bind(this));
		},
		calculateAndFetchAlternativeValues: function (p, u) {
			return R.add(this._calculateAndFetchAlternativeValues.bind(this, p, u), this);
		},
		_calculateAndFetchAlternativeValues: function (p, u) {
			return new Promise(function (r, f) {
				O.getModel().facadeCallFunction("/" + C.functionImports.calculateAlternativeValues.name, u ? u : {});
				this._read(p).then(r).catch(function (e) {
					f({
						message: JSON.parse(e.responseText).error.message.value
					});
				});
			}.bind(this));
		},
		getDependencyDetailsWithExpandedSourceCode: function (d) {
			var u = {
				"$expand": C.navigationProperties.ObjectDependencyDetails.ObjectDependencyCodes
			};
			return R.add(this._read.bind(this, d, u), this);
		},
		getAllDependencySourceCode: function (d) {
			var e = d + "/" + C.navigationProperties.ObjectDependencyDetails.ObjectDependencyCodes;
			return R.add(this._read.bind(this, e), this);
		},
		_abortPendingReadRequest: function (p) {
			if (this._pendingReadRequest && this._pendingReadRequest[p]) {
				R.remove(this._pendingReadRequest[p]);
				delete this._pendingReadRequest[p];
			}
		}
	});
	return new I();
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/dialog/CsticsValueHelpDialog', [
	"sap/i2d/lo/lib/zvchclfz/components/inspector/dialog/GenericValueHelpDialog",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/ValueHelpConfig"
], function (G, V) {
	"use strict";
	var C = function () {
		return new G(V.CsticValueHelpConfig);
	};
	return C;
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/dialog/DependencyTraceFilterDialog', [
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/TraceFilterDialogConfig",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/TraceFilterTypes",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/dialog/CsticsValueHelpDialog",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/dialog/ObjectDependencyValueHelpDialog",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/SuggestionListHandler", "sap/i2d/lo/lib/zvchclfz/components/inspector/util/i18n",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/ODataModelHelper", "sap/m/Button", "sap/m/Dialog", "sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel", "sap/ui/base/ManagedObject"
], function (T, a, C, O, S, i, b, B, D, F, J, M) {
	"use strict";
	var c = "510px";
	var d = "removed";
	var e = T.SupportedTraceFilterTypes;
	var f = a.SupportedTraceFilterTypes.TraceLevel;
	var g = a.SupportedTraceFilterTypes.MessageType;
	var V = a.SupportedTraceFilterTypes.ValueAssignmentBy;
	var h = a.SupportedTraceFilterTypes.Characteristic;
	var j = a.SupportedTraceFilterTypes.ObjectDependency;
	var k = "characteristicAttributes";
	var l = "dependencyAttributes";
	var m = M.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.dialog.DependencyTraceFilterDialog", {
		_dialog: null,
		_resolvePromise: null,
		_uiModel: null,
		_valueHelpOpenedFor: null,
		_openValueHelpDialog: null
	});
	m.prototype.open = function (o) {
		return new Promise(function (r) {
			var n = function () {
				this._resolvePromise = r;
				this._updateModel(o);
				this._dialog.open();
			}.bind(this);
			if (!this._dialog) {
				this._initTraceFilterDialog().then(n.bind(this)).catch(r.bind(this, {
					wasApplied: false
				}));
			} else {
				n();
			}
		}.bind(this));
	};
	m.prototype.onTraceLevelSelectionChanged = function () {
		this._updateMessageTypeItems();
		this._updateValueAssignmentEnabled();
	};
	m.prototype.onMessageTypesSelectionChanged = function () {
		this._updateValueAssignmentEnabled();
	};
	m.prototype.onCsticsValueHelpRequest = function (E) {
		this._handleValueHelpRequest(new C(), h, E, this._resetCsticValueStates.bind(this), S.getCsticSuggestionListHandler());
	};
	m.prototype.onDependencyValueHelpRequest = function (E) {
		this._handleValueHelpRequest(new O(), j, E, this._resetDependencyValueStates.bind(this), S.getDepSuggestionListHandler());
	};
	m.prototype.onCsticsSuggest = function (E) {
		this._onSuggest(E, S.getCsticSuggestionListHandler(), k);
	};
	m.prototype.onDepsSuggest = function (E) {
		this._onSuggest(E, S.getDepSuggestionListHandler(), l);
	};
	m.prototype.onCsticsValueChange = function (E) {
		if (this._valueHelpOpenedFor !== h) {
			this._validateCstics(E);
		}
	};
	m.prototype.onDepsValueChange = function (E) {
		if (this._valueHelpOpenedFor !== j) {
			this._validateDependencies(E);
		}
	};
	m.prototype.onCsticsValueSubmit = function (E) {
		this._validateCstics(E);
	};
	m.prototype.onDepsValueSubmit = function (E) {
		this._validateDependencies(E);
	};
	m.prototype.onCsticsTokenUpdate = function (E) {
		this._handleTokenUpdate(E, h);
	};
	m.prototype.onDependencyTokenUpdate = function (E) {
		this._handleTokenUpdate(E, j);
	};
	m.prototype._initTraceFilterDialog = function () {
		return new Promise(function (r, R) {
			F.load({
				name: "sap.i2d.lo.lib.zvchclfz.components.inspector.fragment.DependencyTraceFilter",
				controller: this
			}).then(function (o) {
				this._dialog = new D({
					title: i.getText("vchclf_trace_filter_dialog_title"),
					resizable: true,
					draggable: true,
					contentWidth: c,
					escapeHandler: function (E) {
						this._onCancelPressed();
						E.resolve();
					}.bind(this),
					content: o,
					buttons: [new B({
						text: i.getText("vchclf_trace_filter_dialog_footer_btn_go"),
						type: sap.m.ButtonType.Emphasized,
						press: this._onGoPressed.bind(this)
					}), new B({
						text: i.getText("vchclf_trace_filter_dialog_footer_btn_reset"),
						press: this._onResetPressed.bind(this)
					}), new B({
						text: i.getText("vchclf_trace_filter_dialog_footer_btn_cancel"),
						press: this._onCancelPressed.bind(this)
					})]
				});
				this._initModel();
				this._dialog.setModel(i.getModel(), "i18n");
				this._dialog.setModel(this._uiModel, "ui");
				this._dialog.setModel(b.getModel());
				r();
			}.bind(this)).catch(R);
		}.bind(this));
	};
	m.prototype._onCancelPressed = function () {
		this._resolvePromise({
			wasApplied: false
		});
		this._dialog.close();
	};
	m.prototype._onGoPressed = function () {
		var o = {};
		$.each(this._uiModel.getProperty("/filters"), function (t, n) {
			o[t] = e[t].convertFiltersToExternal(n);
		});
		this._resolvePromise({
			wasApplied: true,
			filters: o
		});
		this._dialog.close();
	};
	m.prototype._onResetPressed = function () {
		this._updateModel();
	};
	m.prototype._updateMessageTypeItems = function () {
		var t = this._uiModel.getProperty("/filters/" + f);
		var n = this._uiModel.getProperty("/filters/" + g);
		var o = [];
		$.each(this._mapJSONToArray(T.MessageTypeItems), function (K, p) {
			if (t === T.TraceLevelParameters.All || p.traceLevel === T.TraceLevelParameters.All || t === p.traceLevel) {
				o.push(p);
			} else if (n.indexOf(p.key) !== -1) {
				n.splice(n.indexOf(p.key), 1);
			}
		});
		this._uiModel.setProperty("/messageTypeAttributes/items", o);
		this._uiModel.setProperty("/filters/" + g, n);
	};
	m.prototype._updateValueAssignmentEnabled = function () {
		var E = false;
		$.each(this._uiModel.getProperty("/filters/" + g), function (I, o) {
			if (T.ValueAssignmentByRelatedMessageTypes.indexOf(o) !== -1) {
				E = true;
				return false;
			}
		});
		if (!E) {
			this._uiModel.setProperty("/filters/" + V, []);
		}
		this._uiModel.setProperty("/valueAssignmentByAttributes/enabled", E);
	};
	m.prototype._initModel = function () {
		var o = {
			filters: this._getDefaultFilters(),
			traceLevelAttributes: {
				items: this._mapJSONToArray(T.TraceLevelItems)
			},
			messageTypeAttributes: {
				items: []
			},
			valueAssignmentByAttributes: {
				items: this._mapJSONToArray(T.ValueAssignmentByItems),
				enabled: false
			}
		};
		var E = {
			value: "",
			valueState: sap.ui.core.ValueState.None,
			valueStateText: "",
			suggestedRows: []
		};
		o[k] = $.extend(true, {}, E);
		o[l] = $.extend(true, {}, E);
		this._uiModel = new J(o);
	};
	m.prototype._updateModel = function (o) {
		this._uiModel.setProperty("/filters", this._getDefaultFilters());
		$.each(o, function (t, n) {
			this._uiModel.setProperty("/filters/" + t, e[t].convertFiltersToInternal(n));
		}.bind(this));
		this._resetMultiInputAttributes();
		this._updateMessageTypeItems();
		this._updateValueAssignmentEnabled();
	};
	m.prototype._getDefaultFilters = function () {
		var o = {};
		o[f] = T.TraceLevelParameters.All;
		o[g] = [];
		o[V] = [];
		o[h] = [];
		o[j] = [];
		return o;
	};
	m.prototype._handleValueHelpRequest = function (v, s, E, r, o) {
		var n = "";
		if (E.getParameter("fromSuggestions")) {
			n = o.getLastSearchText();
		}
		this._valueHelpOpenedFor = s;
		this._openValueHelpDialog = v;
		v.setTokens(this._uiModel.getProperty("/filters/" + s));
		v.open(n).then(function (R) {
			if (R.wasApplied) {
				this._uiModel.setProperty("/filters/" + s, []);
				this._uiModel.setProperty("/filters/" + s, R.tokens);
				r();
			}
			this._valueHelpOpenedFor = null;
			this._openValueHelpDialog = null;
		}.bind(this));
	};
	m.prototype._handleTokenUpdate = function (E, s) {
		if (E.getParameter("type") === d) {
			var n = this._uiModel.getProperty("/filters/" + s);
			$.each(E.getParameter("removedTokens"), function (t, o) {
				$.each(n, function (p, q) {
					if (q.key === o.getKey()) {
						n.splice(p, 1);
						return false;
					}
				});
			});
		}
	};
	m.prototype._mapJSONToArray = function (o) {
		return $.map(o, function (E) {
			$.each(E, function (K, v) {
				if ($.isFunction(v)) {
					E[K] = v();
				}
			});
			return E;
		});
	};
	m.prototype._addFilterItemToFilters = function (o, s) {
		var n = this._uiModel.getProperty("/filters/" + s);
		if (!this._checkFilterAlreadyExist(n, o)) {
			n.push(o);
			this._uiModel.setProperty("/filters/" + s, []);
			this._uiModel.setProperty("/filters/" + s, n);
		}
	};
	m.prototype._checkFilterAlreadyExist = function (n, o) {
		return $.grep(n, function (E) {
			return E.key === o.key;
		}).length > 0;
	};
	m.prototype._resetCsticValueStates = function () {
		var s = "/" + k;
		this._uiModel.setProperty(s + "/value");
		this._uiModel.setProperty(s + "/valueState", sap.ui.core.ValueState.None);
		this._uiModel.setProperty(s + "/valueStateText");
	};
	m.prototype._resetDependencyValueStates = function () {
		var s = "/" + l;
		this._uiModel.setProperty(s + "/value");
		this._uiModel.setProperty(s + "/valueState", sap.ui.core.ValueState.None);
		this._uiModel.setProperty(s + "/valueStateText");
	};
	m.prototype._resetMultiInputAttributes = function () {
		this._resetDependencyValueStates();
		this._resetCsticValueStates();
		this._uiModel.setProperty("/" + l + "/suggestedRows", []);
		this._uiModel.setProperty("/" + k + "/suggestedRows", []);
	};
	m.prototype._validateMultiInput = function (E, s, o, r) {
		var n = E.getSource(),
			p = n.getValue().toUpperCase();
		if (!p) {
			r();
		} else {
			n.setBusy(true);
			o.getFilterItemFromSuggestedRows(p).then(function (q) {
				n.setValue(p);
				if (q) {
					r();
					this._addFilterItemToFilters(q, s);
				} else {
					n.setValueState(sap.ui.core.ValueState.Warning);
					n.setValueStateText(o.getWarningMessage(p));
				}
				n.setBusy(false);
			}.bind(this));
		}
	};
	m.prototype._validateCstics = function (E) {
		this._validateMultiInput(E, h, S.getCsticSuggestionListHandler(), this._resetCsticValueStates.bind(this));
	};
	m.prototype._validateDependencies = function (E) {
		this._validateMultiInput(E, j, S.getDepSuggestionListHandler(), this._resetDependencyValueStates.bind(this));
	};
	m.prototype._onSuggest = function (E, s, A) {
		var o = E.getSource();
		if (E.getParameter("suggestValue")) {
			var n = "/" + A + "/suggestedRows";
			this._uiModel.setProperty(n, []);
			s.requestSuggestionRows(E.getParameter("suggestValue")).then(function (p) {
				this._uiModel.setProperty(n, p);
			}.bind(this)).catch(function (p) {
				if (!p.isAborted) {
					o.setValueState(sap.ui.core.ValueState.Error);
					o.setValueStateText(p.message);
				}
			});
		}
	};
	m.prototype.destroy = function () {
		if (this._dialog) {
			this._dialog.close();
			this._dialog.destroy();
			this._dialog = null;
		}
		if (this._openValueHelpDialog) {
			this._openValueHelpDialog.destroy();
			this._openValueHelpDialog = null;
		}
		this._resolvePromise = null;
		this._valueHelpOpenedFor = null;
		M.prototype.destroy.call(this);
	};
	return new m();
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/dialog/GenericValueHelpDialog', [
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/i18n", "sap/i2d/lo/lib/zvchclfz/components/inspector/util/ODataModelHelper",
	"sap/ui/base/ManagedObject", "sap/ui/model/json/JSONModel", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/m/Token",
	"sap/m/SearchField"
], function (i, O, M, J, F, a, T, S) {
	"use strict";
	var G = M.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.dialog.GenericValueHelpDialog", {
		_config: null,
		_resolve: null,
		_dialog: null,
		constructor: function (e) {
			this._config = e;
			this._resolve = null;
			this._dialog = sap.ui.xmlfragment(this._config.XMLFragmentId, this._config.XMLFragmentPath, this);
			var c = new J({
				filters: {
					name: "",
					description: "",
					isContainedInConfignModel: true
				},
				cols: [{
					label: "{i18n>" + this._config.NameColumnLabel + "}",
					template: "odata>" + this._config.NameProperty,
					tooltip: i.getText(this._config.NameColumnLabel)
				}, {
					label: "{i18n>" + this._config.DescriptionColumnLabel + "}",
					template: "odata>" + this._config.DescriptionProperty,
					tooltip: i.getText(this._config.DescriptionColumnLabel)
				}]
			});
			this._dialog.setEscapeHandler(this.onCancelPressed.bind(this));
			this._dialog.getFilterBar().setBasicSearch(new S({
				search: this.onSearchPressed.bind(this)
			}));
			this._dialog.setModel(c, "columns").setModel(i.getModel(), "i18n").setModel(O.getModelForODataBinding(), "odata");
		}
	});
	G.prototype.open = function (s) {
		return new Promise(function (r) {
			this._resolve = r;
			this._dialog.open();
			if (s) {
				this._dialog.setBasicSearchText(s);
				this._dialog.getFilterBar().search();
			}
		}.bind(this));
	};
	G.prototype.setTokens = function (s) {
		var t = [];
		if (s && s.length > 0) {
			s.forEach(function (v) {
				t.push(new T({
					key: v.key,
					text: v.text
				}));
			});
		}
		this._dialog.setTokens(t);
	};
	G.prototype.onOkPressed = function (e) {
		var t = e.getParameter("tokens");
		this._resolve({
			wasApplied: true,
			tokens: t.map(function (o) {
				return {
					key: o.getKey(),
					text: o.getText()
				};
			})
		});
		this._dialog.close();
		this._dialog.destroy();
	};
	G.prototype.onCancelPressed = function () {
		this._resolve({
			wasApplied: false
		});
		this._dialog.close();
		this._dialog.destroy();
	};
	G.prototype.onSearchPressed = function () {
		this._dialog.getTableAsync().then(function (t) {
			t.setBusy(true);
			t.bindRows({
				path: "odata>" + this._config.getBindingPath(),
				filters: this._getFilters(),
				parameters: this._getBindingParameters(),
				events: {
					change: function () {
						this._dialog.update();
						t.setBusy(false);
					}.bind(this)
				}
			});
		}.bind(this));
	};
	G.prototype._getFilters = function () {
		var f = [];
		var o = this._dialog.getModel("columns").getProperty("/filters");
		if (o.name) {
			f.push(new F({
				path: this._config.NameProperty,
				operator: a.Contains,
				value1: o.name
			}));
		}
		if (o.description) {
			f.push(new F({
				path: this._config.DescriptionProperty,
				operator: a.Contains,
				value1: o.description
			}));
		}
		if (o.isContainedInConfignModel && this._config.IsContainedInConfignModelProperty) {
			f.push(new F({
				path: this._config.IsContainedInConfignModelProperty,
				operator: a.EQ,
				value1: true
			}));
		}
		return f;
	};
	G.prototype._getBindingParameters = function () {
		var s = this._dialog.getFilterBar().getBasicSearchValue();
		var b = {};
		if (s) {
			b.custom = {
				search: s
			};
		}
		return b;
	};
	G.prototype.destroy = function () {
		if (this._dialog) {
			this._dialog.close();
			this._dialog.destroy();
			this._dialog = null;
		}
		M.prototype.destroy.call(this);
	};
	return G;
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/dialog/ObjectDependencyValueHelpDialog', [
	"sap/i2d/lo/lib/zvchclfz/components/inspector/dialog/GenericValueHelpDialog",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/ValueHelpConfig"
], function (G, V) {
	"use strict";
	var O = function () {
		return new G(V.DependencyValueHelpConfig);
	};
	return O;
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/ComparisonFormatter', ["sap/ui/core/ValueState"], function (V) {
	"use strict";
	return {
		getIconForDiffItemType: function (d) {
			switch (d) {
			case 1:
				{
					return "sap-icon://product";
				}
			case 2:
				{
					return "sap-icon://group-2";
				}
			case 3:
				{
					return "sap-icon://tag";
				}
			case 4:
				{
					return "sap-icon://multi-select";
				}
			default:
				{
					return null;
				}
			}
		},
		getStateForDiffType: function (d) {
			switch (d) {
			case 1:
				{
					return V.Success;
				}
			case 2:
				{
					return V.Error;
				}
			case 3:
				{
					return V.Warning;
				}
			default:
				{
					return V.None;
				}
			}
		},
		getTextForDiffType: function (c, d) {
			var r = c.getView().getModel("i18n").getResourceBundle();
			switch (d) {
			case 1:
				{
					return r.getText("vchclf_comparison_added");
				}
			case 2:
				{
					return r.getText("vchclf_comparison_removed");
				}
			case 3:
				{
					return r.getText("vchclf_comparison_changed");
				}
			default:
				{
					return null;
				}
			}
		},
		getItemDescription: function (i) {
			switch (i.DiffItemType) {
			case 1:
				{
					return i.ComponentDescription;
				}
			case 2:
				{
					return i.GroupDescription;
				}
			case 3:
				{
					return i.CsticDescription;
				}
			case 4:
				{
					return i.CsticDescription;
				}
			default:
				{
					throw Error("Unhandled DiffItemType '" + i.DiffItemType + "'.");
				}
			}
		},
		getValuesFromVisible: function (v) {
			return v ? v.Source.length > 0 : false;
		},
		getValuesToVisible: function (v) {
			return v ? v.Target.length > 0 : false;
		},
		getValuesArrowVisible: function (d, v) {
			return v ? (d === 3 && (v.Source.length > 0 || v.Target.length > 0)) : false;
		},
		getValuesFromText: function (v) {
			if (v && v.Source) {
				return this.getValuesText(v.Source);
			} else {
				return null;
			}
		},
		getValuesToText: function (v) {
			if (v && v.Target) {
				return this.getValuesText(v.Target);
			} else {
				return null;
			}
		},
		getValuesText: function (v) {
			var t = "";
			for (var i = 0; i < v.length; i++) {
				t += v[i].Value;
				if (i < v.length - 1) {
					t += ", ";
				}
			}
			return t;
		}
	};
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/ConfProfileFormatter', [], function () {
	"use strict";
	return {
		statusTextForConfProfileFormatter: function (s) {
			var i = this.getView().getModel("i18n");
			if (i) {
				switch (s) {
				case "0":
					return i.getResourceBundle().getText("vchclf_insp_properties_conf_profile_status_preparation");
				case "1":
					return i.getResourceBundle().getText("vchclf_insp_properties_conf_profile_status_released");
				case "2":
					return i.getResourceBundle().getText("vchclf_insp_properties_conf_profile_status_lock");
				default:
					return s;
				}
			}
			return undefined;
		},
		processTextFormatter: function (p) {
			var i = this.getView().getModel("i18n");
			if (i) {
				switch (p) {
				case "PORD":
					return i.getResourceBundle().getText("vchclf_insp_properties_conf_profile_process_planned_order");
				case "SORD":
					return i.getResourceBundle().getText("vchclf_insp_properties_conf_profile_process_sales");
				case "KBOB":
					return i.getResourceBundle().getText("vchclf_insp_properties_conf_profile_process_bom_know");
				case "ROOB":
					return i.getResourceBundle().getText("vchclf_insp_properties_conf_profile_process_bom_result");
				default:
					return p;
				}
			}
			return undefined;
		},
		bomExplosionLevelFormatter: function (l) {
			var i = this.getView().getModel("i18n");
			if (i) {
				switch (l) {
				case "N":
					return i.getResourceBundle().getText("vchclf_insp_properties_conf_profile_bom_exp_level_none");
				case "S":
					return i.getResourceBundle().getText("vchclf_insp_properties_conf_profile_bom_exp_level_single");
				case "M":
					return i.getResourceBundle().getText("vchclf_insp_properties_conf_profile_bom_exp_level_multi");
				default:
					return l;
				}
			}
			return undefined;
		}
	};
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/DependencyFormatter', [], function () {
	"use strict";
	return {
		status: function (s) {
			switch (s) {
			case "1":
				return "Success";
			case "2":
				return "Warning";
			case "3":
				return "Error";
			default:
				return s;
			}
		},
		dependencyTitleFormatter: function (o, n, t) {
			return t || n || o;
		},
		dependencySubtitleFormatter: function (o, n, t) {
			if (t) {
				return n || o;
			} else if (n && n !== o) {
				return o;
			} else {
				return "";
			}
		},
		dependencyProcessingModeFormatter: function (p) {
			var i = this.getView().getModel("i18n");
			if (i) {
				if (p === "A") {
					return i.getResourceBundle().getText("vchclf_insp_dependencydtl_processing_mode_advanced");
				} else if (p === "C") {
					return i.getResourceBundle().getText("vchclf_insp_dependencydtl_processing_mode_classic");
				} else {
					return "";
				}
			} else {
				return undefined;
			}
		},
		formatDependencySourceCode: function (d) {
			var s = "";
			if ($.isArray(d)) {
				$.each(d, function (i, D) {
					s += s ? "\n" + D.CodeLine : D.CodeLine;
				});
			}
			return s;
		}
	};
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/DependencyTraceFormatter', [
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/TraceEntryTextTypes", "sap/i2d/lo/lib/zvchclfz/components/inspector/util/i18n"
], function (T, i) {
	"use strict";
	var C = T.TextTypes.CharacteristicValue;
	return {
		formatVariantTables: function (v) {
			var V = "";
			$.each(v, function (I, o) {
				if (V === "") {
					V = o.VariantTableName;
				} else {
					V = i.getTextWithParameters("vchclf_insp_common_comma_separated_items", [V, o.VariantTableName]);
				}
			});
			return V;
		},
		formatMetatextOfObjectDependencyDetail: function () {
			return T.SupportedObject.ObjectDependency;
		},
		formatMetatextOfCharacteristicDetail: function (t, s) {
			if (!t) {
				return "";
			}
			var c = i.getTextWithParameters("vchclf_trace_dot_separated_items", [T.SupportedObject.BOMComponent, T.SupportedObject.Characteristic]);
			var a = "";
			$.each(t.results, function (I, o) {
				var b = T.ValueClassifiers[o.CsticValueClassifier] || T.ValueClassifiers.Default;
				var d = C.getText(o, s);
				var e = b.getDecoratedText(d);
				a = a === "" ? e : i.getTextWithParameters("vchclf_insp_common_comma_separated_items", [a, e]);
			});
			return i.getTextWithParameters("vchclf_insp_common_value_with_label", [c, a]);
		},
		formatPricingFactorDetails: function (t, s) {
			if (!t.VariantConditionValue) {
				return "";
			}
			var f = C.getText(t, s);
			return i.getTextWithParameters("vchclf_insp_common_value_with_label", [t.VariantConditionValue, f]);
		},
		formatMetatextOfDependencyResultDetail: function (d) {
			if (!d) {
				return "";
			}
			var f = i.getTextWithParameters("vchclf_insp_common_comma_separated_items", [d.ResultValueText, d.ResultTypeText]);
			return i.getTextWithParameters("vchclf_insp_common_value_with_label", [T.SupportedObject.ObjectDependencyResult, f]);
		},
		formatMetatextOfCharacteristicResultsDetail: function (c) {
			if (!c) {
				return "";
			}
			var s = i.getTextWithParameters("vchclf_trace_dot_separated_items", [T.SupportedObject.BOMComponent, T.SupportedObject.Characteristic]);
			return i.getTextWithParameters("vchclf_insp_common_value_with_label", [s, c.ResultTypeText]);
		}
	};
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/GeneralFormatter', [
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/i18n", "sap/ui/core/format/NumberFormat"
], function (i, N) {
	"use strict";
	return {
		changedByFormatter: function (c, C) {
			return c && C ? i.getTextWithParameters("vchclf_sim_changed_by_bracket", [c, C]) : C;
		},
		convertBoolToYesorNoFormatter: function (f) {
			return f ? i.getText("vchclf_insp_properties_yes") : i.getText("vchclf_insp_properties_no");
		},
		statusFormatter: function (s) {
			switch (s) {
			case "0":
				return sap.ui.core.ValueState.Warning;
			case "1":
				return sap.ui.core.ValueState.Success;
			case "2":
				return sap.ui.core.ValueState.Error;
			default:
				return sap.ui.core.ValueState.None;
			}
		},
		stringToBooleanFormatter: function (v) {
			return typeof v === "string" && !!v;
		},
		formatQtyWithUom: function (q, u) {
			var Q = N.getFloatInstance();
			var f = Q.format(parseFloat(q));
			return f ? i.getTextWithParameters("vchclf_insp_quantity_content_qtyuom", [f, u]) : "";
		},
		formatQtyFromTo: function (v, V, u) {
			if (v === undefined || V === undefined) {
				return "";
			}
			var f = N.getFloatInstance();
			var F = f.format(parseFloat(v));
			var t = f.format(parseFloat(V));
			var r = i.getTextWithParameters("vchclf_insp_values_template_value_range", [F, t]);
			return i.getTextWithParameters("vchclf_insp_quantity_content_qtyuom", [r, u]);
		},
		getTooltipOfDependenciesTab: function (e) {
			return e ? i.getText("vchclf_objectheader_tab_dependencies") : i.getText("vchclf_objectheader_tab_dependencies_empty_list");
		},
		isBOMHeaderVisible: function (c) {
			return !!c;
		},
		getSubtitleOfBOMItem: function (c) {
			return c ? i.getText("vchclf_objectheader_subtitle_bomheader") : i.getText("vchclf_objectheader_subtitle_bomitem");
		},
		getTooltipOfValuesTab: function (I) {
			return I ? i.getText("vchclf_objectheader_tab_values") : i.getText("vchclf_objectheader_tab_values_cstic_not_part_of_model");
		},
		getTooltipOfComponentsTab: function (e) {
			return e ? i.getText("vchclf_objectheader_tab_component") : i.getText("vchclf_objectheader_tab_component_empty_list");
		},
		getTooltipOfPRTsTab: function (e) {
			return e ? i.getText("vchclf_objectheader_tab_prt") : i.getText("vchclf_objectheader_tab_prt_empty_list");
		},
		concatenateIdAndDescription: function (I, d) {
			return d ? i.getTextWithParameters("vchclf_insp_properties_concatenated_id_and_descr", [d, I]) : I;
		},
		setNoneIfNoTextIsPassed: function (t) {
			return t ? t : i.getText("vchclf_insp_properties_none");
		}
	};
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/PRTFormatter', [], function () {
	"use strict";
	return {
		prtTitleFormatter: function (d, p) {
			return d || p;
		},
		prtSubtitleFormatter: function (d, p) {
			return d ? p : "";
		}
	};
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/RoutingFormatter', [
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/UiConfig", "sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel"
], function (U, I) {
	"use strict";
	return {
		visibilityOfLotSizeQuantity: function (p, m, M) {
			var b = parseFloat(m) !== 0;
			var a = parseFloat(M) !== 0;
			return !p && (b || a);
		},
		getVisibilityOfStandardValue: function (c, i) {
			if (!I.getIsSuperInspectorAvailable()) {
				return true;
			} else {
				return !i && !!c || i;
			}
		},
		getLabelOfStandardValue: function (c, s) {
			return c || s;
		},
		visibilityOfReferenceOperationSet: function (o) {
			return o === U.inspectorMode.objectType.RefOperation || o === U.inspectorMode.objectType.RefSubOperation;
		}
	};
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/SuperInspectorFormatter', [
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel", "sap/i2d/lo/lib/zvchclfz/components/inspector/util/i18n",
	"sap/ui/core/format/DateFormat", "sap/ui/core/format/NumberFormat"
], function (I, i, D, N) {
	"use strict";
	var m = function (C, s) {
		if (C === s || !s) {
			return C;
		} else {
			var S = "<span style=\"font-style: italic;\">" + i.getTextWithParameters("vchclf_insp_common_text_in_brackets", s) + "</span>";
			return i.getTextWithParameters("vchclf_insp_conf_super_mix_value", [C, S]);
		}
	};
	var r = function (C, s, b, a) {
		if (!I.getIsSuperInspectorAvailable()) {
			return C;
		} else if (b) {
			return s;
		} else if (!a) {
			return C;
		} else {
			return m(C, s);
		}
	};
	var c = function (C, s, S, a, b, d) {
		if (S === undefined && C === undefined) {
			return "";
		}
		var e = s ? i.getTextWithParameters("vchclf_insp_properties_concatenated_id_and_descr", [s, C]) : C;
		var g = a ? i.getTextWithParameters("vchclf_insp_properties_concatenated_id_and_descr", [a, S]) : S;
		return r(e, g, b, d);
	};
	var f = function (C, s) {
		if (s === undefined && C === undefined) {
			return "";
		}
		return I.getIsSuperInspectorAvailable() ? s : C;
	};
	return {
		concatenateIdAndDescription: function (C, s, S, a, b, d) {
			return c(C, s, S, a, b, d);
		},
		isConcatenatedValueNotEmpty: function (C, s, S, a, b, d) {
			return !!c(C, s, S, a, b, d);
		},
		formatQtyWithUom: function (C, s, S, a, b, d) {
			if (S === undefined && C === undefined) {
				return "";
			}
			var q = N.getFloatInstance();
			var e = q.format(parseFloat(C));
			var g = q.format(parseFloat(S));
			var h = e ? i.getTextWithParameters("vchclf_insp_quantity_content_qtyuom", [e, s]) : "";
			var j = g ? i.getTextWithParameters("vchclf_insp_quantity_content_qtyuom", [g, a]) : "";
			return r(h.trim(), j.trim(), b, d);
		},
		formatQtyFromTo: function (C, s, a, S, b, d, e, g) {
			if (S === undefined && C === undefined) {
				return "";
			}
			var q = N.getFloatInstance();
			var h = q.format(parseFloat(C));
			var j = q.format(parseFloat(s));
			var k = q.format(parseFloat(S));
			var l = q.format(parseFloat(b));
			var n = i.getTextWithParameters("vchclf_insp_values_template_value_range", [h, j]);
			var o = i.getTextWithParameters("vchclf_insp_values_template_value_range", [k, l]);
			var p = i.getTextWithParameters("vchclf_insp_quantity_content_qtyuom", [n, a]);
			var t = i.getTextWithParameters("vchclf_insp_quantity_content_qtyuom", [o, d]);
			return r(p, t, e, g);
		},
		formatDate: function (C, s, b, a) {
			if (s === undefined && C === undefined) {
				return "";
			}
			var d = D.getDateInstance({
				style: "medium"
			});
			var e = C ? d.format(C) : "";
			var S = s ? d.format(s) : "";
			return r(e, S, b, a);
		},
		formatValue: function (C, s, b, a) {
			if (s === undefined && C === undefined) {
				return "";
			}
			return r(C, s, b, a);
		},
		formatValueWithoutMix: function (C, s) {
			return f(C, s);
		},
		isNotMixedValueNotEmpty: function (C, s) {
			return !!f(C, s);
		},
		getValueForFlagProperty: function (C, s) {
			return I.getIsSuperInspectorAvailable() ? !!s : !!C;
		},
		setNoneIfNoTextIsPassed: function (C, s, b, a) {
			if (s === undefined && C === undefined) {
				return "";
			}
			var d = C ? C : i.getText("vchclf_insp_properties_none");
			var S = s ? s : i.getText("vchclf_insp_properties_none");
			return r(d, S, b, a);
		}
	};
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/ValuesFormatter', ["sap/base/security/encodeXML",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/i18n", "sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants"
], function (e, i, C) {
	"use strict";
	var V = C.characteristicValue.valueDataType;
	var I = C.characteristicValue.intervalType;
	var f = function (s, v, a, S) {
		var b = v,
			t = a,
			c;
		if (S) {
			switch (s) {
			case I.RightExcludedInterval:
				c = "vchclf_insp_values_template_right_excluded_intervals";
				break;
			case I.ExcludedInterval:
				c = "vchclf_insp_values_template_excluded_intervals";
				break;
			case I.LeftExcludedInterval:
				c = "vchclf_insp_values_template_left_excluded_intervals";
				break;
			default:
				c = "vchclf_insp_values_template_closed_intervals";
				break;
			}
		} else {
			if (!a) {
				b = t = i.getTextWithParameters("vchclf_insp_values_template_precise_value", [v]);
			}
			c = "vchclf_insp_values_template_value_range";
		}
		return i.getTextWithParameters(c, [b, t]);
	};
	var F = function (s, h, v, a, S) {
		switch (s) {
		case I.RightExcludedInterval:
		case I.ClosedInterval:
		case I.ExcludedInterval:
		case I.LeftExcludedInterval:
			return f(s, v, a, S);
		case I.AssignableExcludedInterval:
			return S ? i.getTextWithParameters("vchclf_insp_values_template_closed_intervals", [v, a]) : i.getTextWithParameters(
				"vchclf_insp_values_template_precise_value", [v]);
		default:
			return h && !S ? i.getTextWithParameters("vchclf_insp_values_template_precise_value", [v]) : v;
		}
	};
	return {
		getTitleOfValueItem: function (s, a, h, d) {
			if (d) {
				return d;
			} else if (h) {
				return i.getTextWithParameters("vchclf_insp_values_template_precise_value", s);
			} else if (a) {
				return i.getTextWithParameters("vchclf_insp_values_template_value_range", [s, a]);
			} else {
				return s;
			}
		},
		getAttributeOfValueItem: function (h, s, d) {
			if (d) {
				return s;
			} else if (h) {
				return i.getText("vchclf_insp_values_precise_value_available");
			} else {
				return "";
			}
		},
		getLabelForValueName: function (h) {
			if (h) {
				return i.getText("vchclf_insp_values_properties_precise_value");
			} else {
				return i.getText("vchclf_insp_values_properties_value");
			}
		},
		getTextForValueName: function (h, s, a, t) {
			if (h) {
				return t;
			} else if (a) {
				return i.getTextWithParameters("vchclf_insp_values_template_value_range", [s, a]);
			} else {
				return s;
			}
		},
		statusTextForValues: function (E, b) {
			if (b) {
				return i.getText("vchclf_insp_values_status_selected");
			}
			switch (E) {
			case C.characteristicValue.exclusionType.Excluded:
				return i.getText("vchclf_insp_values_status_excluded");
			case C.characteristicValue.exclusionType.PartiallyExcluded:
				return i.getText("vchclf_insp_values_status_partially_excluded");
			case C.characteristicValue.exclusionType.Selectable:
			default:
				return "";
			}
		},
		statusStateForValues: function (E, s) {
			switch (E) {
			case C.characteristicValue.exclusionType.Excluded:
			case C.characteristicValue.exclusionType.PartiallyExcluded:
				return s ? sap.ui.core.ValueState.Error : sap.ui.core.ValueState.Warning;
			case C.characteristicValue.exclusionType.Selectable:
			default:
				return sap.ui.core.ValueState.Success;
			}
		},
		selectedLabelForValue: function (s) {
			if (s === I.ExactValue) {
				return i.getText("vchclf_insp_values_status_selected");
			} else {
				return i.getText("vchclf_insp_values_status_value_in_range_selected");
			}
		},
		selectedTextForValue: function (s) {
			if (s) {
				return i.getText("vchclf_insp_properties_yes");
			} else {
				return i.getText("vchclf_insp_properties_no");
			}
		},
		selectableLabelForValue: function (s) {
			if (s === I.ExactValue) {
				return i.getText("vchclf_insp_values_status_value_selectability");
			} else {
				return i.getText("vchclf_insp_values_status_value_in_range_selectability");
			}
		},
		selectableTextForValue: function (E) {
			switch (E) {
			case C.characteristicValue.exclusionType.Excluded:
				return i.getText("vchclf_insp_values_status_excluded");
			case C.characteristicValue.exclusionType.PartiallyExcluded:
				return i.getText("vchclf_insp_values_status_partially_excluded");
			case C.characteristicValue.exclusionType.Selectable:
				return i.getText("vchclf_insp_values_status_selectable");
			default:
				return "";
			}
		},
		formatCharacteristicValue: function (E, s) {
			var a = E.IntervalType.toString();
			var v = s ? E.TechnicalValueFrom : E.FormattedValueFrom;
			var b = s ? E.TechnicalValueTo : E.FormattedValueTo;
			switch (E.ValueDataType) {
			case V.Integer:
				return a === I.ClosedInterval ? i.getTextWithParameters("vchclf_insp_values_template_value_range", [v, b]) : v;
			case V.Float:
				return F(a, E.HasHighPrecision, v, b, s);
			default:
				return e(E.TechnicalValueFrom);
			}
		}
	};
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants', [], function () {
	"use strict";
	return {
		initialObjectDependencyAssgmgNumber: "000000000000000000",
		initialBillOfOperationsNode: "00000000",
		initialObjectDependency: "0000000000",
		standardSequenceTreeId: "000000",
		defaultRoutingRootNodeId: "0_0",
		semanticObject: {
			variantConfiguration: "VariantConfiguration"
		},
		BOMExplosionStates: {
			possible: "0",
			missingBOMApplication: "1",
			BOMNotFound: "2"
		},
		entitySets: {
			ConfigurationContext: "ConfigurationContextSet",
			BOMNode: "BOMNodeSet",
			Characteristic: "CharacteristicSet",
			CharacteristicValue: "CharacteristicValueSet",
			ObjectDependencyHeader: "ObjectDependencyHeaderSet",
			ObjectDependencyDetails: "ObjectDependencyDetailsSet",
			CharacteristicValueHelp: "C_VarConfignTraceCharcVH",
			DependencyValueHelp: "C_ConfignTraceObjectDpndcyVH",
			TraceCharacteristicVH: "TraceCharacteristicVH",
			ToggleSet: "ToggleSet",
			ConfigurationProfile: "ConfigurationProfileSet"
		},
		propertyNames: {
			ContextId: "ContextId",
			InstanceId: "InstanceId",
			GroupId: "GroupId",
			TraceGuid: "TraceGuid",
			RoundtripNo: "RoundtripNo",
			EntryNo: "EntryNo",
			ComponentId: "ComponentId",
			BOMComponentId: "BOMComponentId",
			BillOfOperationsType: "BillOfOperationsType",
			BillOfOperationsGroup: "BillOfOperationsGroup",
			BillOfOperationsVariant: "BillOfOperationsVariant",
			TreeId: "TreeId",
			NodeId: "NodeId",
			BOOOperationPRTInternalId: "BOOOperationPRTInternalId",
			BOOOperationPRTIntVersCounter: "BOOOperationPRTIntVersCounter",
			CsticId: "CsticId",
			ValueId: "ValueId",
			ObjectDependency: "ObjectDependency",
			ObjectDependencyId: "ObjectDependencyId",
			SubprocedureIndex: "SubprocedureIndex"
		},
		navigationProperties: {
			Common: {
				ObjectDependencyHeaders: "to_ObjectDependencyHeaders",
				Super: "to_Super"
			},
			ConfigurationContext: {
				BOMNode: "BOMNodes",
				TraceEntry: "to_TraceEntry",
				TraceCharacteristic: "to_TraceCharacteristic",
				TraceObjectDependency: "to_TraceObjectDependency",
				ConfigurationProfile: "to_ConfigurationProfile(Product='{product}',ConfigurationProfileNumber='{counter}')",
				TraceCharacteristicVH: "to_TraceCharacteristicVH",
				TraceObjectDependencyVH: "to_TraceObjectDependencyVH"
			},
			BOMNode: {
				Routings: "to_Routings",
				Header: "to_BOMHeader"
			},
			Characteristic: {
				CharacteristicDetail: "to_CharacteristicDetail"
			},
			CharacteristicValue: {
				CharacteristicValueDetail: "to_CharacteristicValueDetail"
			},
			ObjectDependencyHeader: {
				ObjectDependencyDetails: "to_ObjectDependencyDetails"
			},
			Routing: {
				RoutingNodes: "to_RoutingNodes"
			},
			RoutingNode: {
				OperationDetail: "to_OperationDetail",
				RoutingHeader: "to_RoutingHeader",
				Sequence: "to_Sequence",
				Components: "to_BOMNode",
				PRTs: "to_OperationPRT"
			},
			Operation: {
				StandardValues: "to_StandardValues"
			},
			TraceEntry: {
				InputTraceObjectDependencies: "to_InputTraceObjectDependencies",
				TraceBeforeCharacteristics: "to_TraceBeforeCharacteristics",
				TraceResultCharacteristics: "to_TraceResultCharacteristics",
				VariantTables: "to_VariantTables",
				ObjectDependencyCodes: "to_ObjectDependencyCodes",
				TracePricingFactor: "to_TracePricingFactor",
				ResultCharacteristicResults: "to_ResultCharacteristicResults",
				BeforeCharacteristicResults: "to_BeforeCharacteristicResults",
				ResultDependencyResults: "to_ResultDependencyResults",
				BeforeDependencyResults: "to_BeforeDependencyResults",
				TraceBAdI: "to_TraceBAdI"
			},
			TraceCharacteristic: {
				TraceCharacteristicValues: "to_TraceCharacteristicValues",
				WhereWasUsed: "to_WhereWasUsed",
				WhereWasValueSet: "to_WhereWasValueSet"
			},
			TraceObjectDependency: {
				WhereWasDepUsed: "to_WhereWasDepResUsed",
				WhereWasDepSet: "to_WhereWasDepResSet"
			},
			ObjectDependencyDetails: {
				ObjectDependencyCodes: "to_ObjectDependencyCodes"
			}
		},
		BOMItemProperties: {
			ItemCategory: {
				ClassItem: "K"
			},
			rootParentComponentId: "0"
		},
		functionImportMethod: {
			post: "POST"
		},
		functionImports: {
			activateTrace: {
				name: "ActivateTrace",
				method: "POST"
			},
			deactivateTrace: {
				name: "DeactivateTrace",
				method: "POST"
			},
			isTraceActive: {
				name: "IsTraceActive",
				method: "POST"
			},
			clearTrace: {
				name: "ClearTrace",
				method: "POST"
			},
			calculateAlternativeValues: {
				name: "CalculateAlternativeValues",
				method: "POST"
			}
		},
		traceFilterParameters: {
			ValueAssignmentBy: {
				Procedure: "2",
				Constraint: "3",
				User: "4",
				ExtComponent: "5",
				Default: "1"
			}
		},
		characteristicValue: {
			exclusionType: {
				Selectable: 0,
				Excluded: 1,
				PartiallyExcluded: 2
			},
			intervalType: {
				ExactValue: "1",
				RightExcludedInterval: "2",
				ClosedInterval: "3",
				ExcludedInterval: "4",
				LeftExcludedInterval: "5",
				AssignableExcludedInterval: "11"
			},
			valueDataType: {
				Integer: 1,
				Float: 2,
				String: 3
			}
		},
		inspectorView: {
			Inspector: "inspector",
			Comparison: "comparison",
			Trace: "trace"
		},
		inspectorTab: {
			Properties: "properties",
			Values: "values",
			Dependencies: "dependencies",
			Components: "components",
			PRTs: "prts",
			ObjectNotFound: "ObjectNotFound"
		},
		uiMode: {
			Create: "Create",
			Edit: "Edit",
			Display: "Display"
		},
		errorCode: {
			TraceSwitchedOff: "MC_LO_VCHCLF_VCH/035"
		}
	};
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/logic/DependencyTraceFilterManager', [
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/TraceFilterDialogConfig",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/TraceFilterTypes",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/dialog/DependencyTraceFilterDialog",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants", "sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/DependencyTraceMapper", "sap/i2d/lo/lib/zvchclfz/components/inspector/util/i18n",
	"sap/ui/model/Filter", "sap/ui/model/FilterOperator"
], function (T, a, D, C, I, b, i, F, c) {
	"use strict";
	var d = " + ";
	var S = T.SupportedTraceFilterTypes;
	var e = function () {
		this._filters = {};
		this._searchText = "";
		this._savedState = {
			filters: {},
			rootPath: {},
			searchText: ""
		};
		this._rootPath = {
			path: null,
			filterText: null
		};
	};
	e.prototype.setRootPath = function (p, P) {
		this.clearAllFilters();
		this._rootPath = {
			path: p,
			filterText: P
		};
	};
	e.prototype.getRootPath = function () {
		return this._rootPath.path;
	};
	e.prototype.setSearchText = function (s) {
		this._searchText = s;
	};
	e.prototype.getSearchText = function () {
		return this._searchText;
	};
	e.prototype.setFiltersForFilterType = function (f, g) {
		this._filters[f] = g;
	};
	e.prototype.clearAllFilters = function () {
		this._filters = {};
		this._searchText = "";
		this._rootPath = {
			path: I.getConfigurationContextPath() + "/" + C.navigationProperties.ConfigurationContext.TraceEntry,
			text: null
		};
	};
	e.prototype.getFilters = function () {
		var m = [];
		var M = {};
		$.each(this._filters, function (t, f) {
			if (t === a.SupportedTraceFilterTypes.MessageType || t === a.SupportedTraceFilterTypes.ValueAssignmentBy) {
				M[t] = f;
			} else {
				var g = [];
				$.each(f, function (h, j) {
					if ($.isPlainObject(j.parameters)) {
						var k = [];
						$.each(j.parameters, function (p, v) {
							k.push(new F(p, c.EQ, v));
						});
						if (k.length > 0) {
							g.push(new F({
								filters: k,
								and: true
							}));
						}
					}
				});
				if (g.length > 0) {
					m.push(new F({
						filters: g,
						and: false
					}));
				}
			}
		});
		var o = b.createMsgTypeIdFilters(M);
		if (o) {
			m.push(o);
		}
		return m;
	};
	e.prototype.getConcatenatedFilterText = function () {
		var f = [];
		if (this._searchText) {
			f.push(i.getTextWithParameters("vchclf_trace_filter_status_text", [this._searchText]));
		}
		if (this._rootPath.filterText) {
			f.push(this._rootPath.filterText);
		}
		$.each(this._filters, function (t, g) {
			var p = a.FilterPropertyI18ns[t];
			if (p) {
				if (g.length > 1 && p.multi) {
					f.push(i.getTextWithParameters(p.multi, [g.length]));
				} else if (p.single) {
					f.push(i.getTextWithParameters(p.single, [g[0].text]));
				}
			} else {
				$.each(g, function (h, o) {
					if (o.text) {
						f.push(o.text);
					}
				});
			}
		});
		return f.length > 0 ? i.getTextWithParameters("vchclf_trace_filter_status", f.join(d)) : "";
	};
	e.prototype.openTraceFilterDialog = function () {
		return new Promise(function (r) {
			D.open(this._getFiltersForDialog()).then(function (R) {
				if (R.wasApplied) {
					this._setTraceFilterDialogResult(R.filters);
				}
				r({
					wasApplied: R.wasApplied
				});
			}.bind(this));
		}.bind(this));
	};
	e.prototype.saveState = function () {
		this._savedState = {
			filters: this._filters,
			rootPath: this._rootPath,
			searchText: this._searchText
		};
	};
	e.prototype.restoreState = function () {
		this._filters = this._savedState.filters;
		this._rootPath = this._savedState.rootPath;
		this._searchText = this._savedState.searchText;
	};
	e.prototype._getFiltersForDialog = function () {
		var f = {};
		$.each(this._filters, function (t, p) {
			if (S[t]) {
				f[t] = p;
			}
		});
		return $.extend(true, {}, f);
	};
	e.prototype._setTraceFilterDialogResult = function (f) {
		$.each(f, function (t, p) {
			if (p.length > 0) {
				this._filters[t] = p;
			} else {
				delete this._filters[t];
			}
		}.bind(this));
	};
	return new e();
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/logic/DependencyTraceModel', [
	"sap/i2d/lo/lib/zvchclfz/components/inspector/dao/DependencyTraceDAO", "sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/DependencyTraceFilterManager",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel", "sap/i2d/lo/lib/zvchclfz/components/inspector/util/ODataModelHelper",
	"sap/ui/model/json/JSONModel"
], function (D, C, a, I, O, J) {
	"use strict";
	var b = 100;
	var G = 50;
	var c = 3;
	var T = C.navigationProperties.TraceEntry.TraceBeforeCharacteristics;
	var d = C.navigationProperties.TraceEntry.TraceResultCharacteristics;
	var V = C.navigationProperties.TraceEntry.VariantTables;
	var e = C.navigationProperties.TraceEntry.InputTraceObjectDependencies;
	var f = C.navigationProperties.TraceEntry.ObjectDependencyCodes;
	var P = C.navigationProperties.TraceEntry.TracePricingFactor;
	var R = C.navigationProperties.TraceEntry.ResultCharacteristicResults;
	var B = C.navigationProperties.TraceEntry.BeforeCharacteristicResults;
	var g = C.navigationProperties.TraceEntry.ResultDependencyResults;
	var h = C.navigationProperties.TraceEntry.BeforeDependencyResults;
	var i = C.navigationProperties.TraceEntry.TraceBAdI;
	var j = function () {
		this._currentModelSizeLimit = null;
		this._highlightedTraceEntryText = null;
		this._traceEntryTextBuffer = null;
		this._model = null;
		this.initialize();
	};
	j.prototype.initialize = function () {
		this._model = new J({
			entries: [],
			filterText: ""
		});
		this._currentModelSizeLimit = b;
		this._highlightedTraceEntryText = null;
		this._traceEntryTextBuffer = {};
		a.clearAllFilters();
	};
	j.prototype.updateFilterText = function () {
		this._model.setProperty("/filterText", a.getConcatenatedFilterText());
	};
	j.prototype.setRootPath = function (p, s) {
		a.setRootPath(p, s);
	};
	j.prototype.getModel = function () {
		return this._model;
	};
	j.prototype.clearBuffer = function () {
		this._highlightedTraceEntryText = null;
		this._traceEntryTextBuffer = {};
	};
	j.prototype.reload = function () {
		return new Promise(function (r, k) {
			this._loadEntries(0, G + 1).then(function (o) {
				if (o) {
					this._model.setProperty("/entries", []);
					this._model.setProperty("/entries", this._postProcessTraceEntries(o.results));
				}
				r();
			}.bind(this)).catch(k);
		}.bind(this));
	};
	j.prototype.fetch = function () {
		return new Promise(function (r, k) {
			var E = this._model.getProperty("/entries");
			this._loadEntries(E.length, G).then(function (o) {
				if (o) {
					this._model.setProperty("/entries", E.concat(this._postProcessTraceEntries(o.results)));
				}
				r();
			}.bind(this)).catch(k);
		}.bind(this));
	};
	j.prototype.clear = function () {
		return new Promise(function (r, k) {
			D.clearTrace(I.getConfigurationContextId()).then(function () {
				this._model.setProperty("/entries", []);
				this.clearBuffer();
				r();
			}.bind(this)).catch(k);
		}.bind(this));
	};
	j.prototype.expandEntry = function (t, r, E) {
		return new Promise(function (k, l) {
			var m = this._getTraceEntriesForEntryNumber(t, r, E);
			if (this._checkDetailsExistForEntries(m)) {
				k();
			} else {
				var s = O.generateTraceEntryPath(I.getConfigurationContextPath(), t, r, E);
				D.loadTraceEntryDetails(s).then(function (o) {
					this._assignDetailsToEntries(o, m);
					k();
				}.bind(this)).catch(l);
			}
		}.bind(this));
	};
	j.prototype.setSearchText = function (s) {
		a.setSearchText(s);
	};
	j.prototype.setFiltersForFilterType = function (F, k) {
		a.setFiltersForFilterType(F, k);
	};
	j.prototype.clearAllFilters = function () {
		a.clearAllFilters();
	};
	j.prototype.openTraceFilterDialog = function () {
		return a.openTraceFilterDialog();
	};
	j.prototype.saveState = function () {
		a.saveState();
	};
	j.prototype.restoreState = function () {
		a.restoreState();
		this.updateFilterText();
	};
	j.prototype.highlightTraceEntryText = function (t) {
		var r = /\/entries\/\d+/i;
		var o = this._model.getProperty(r.exec(t)[0]);
		var s = this._generateTraceEntryTextInternalKey(o);
		if (this._highlightedTraceEntryText !== s) {
			if (this._highlightedTraceEntryText) {
				this._setTraceEntryTextHighlighted(this._highlightedTraceEntryText, false);
			}
			this._setTraceEntryTextHighlighted(s, true);
		}
	};
	j.prototype.activateTraceAndReloadMessages = function () {
		this.clearBuffer();
		return Promise.all([D.activateTrace(I.getConfigurationContextId()), this.reload()]);
	};
	j.prototype.deactivateTraceAndReloadMessages = function () {
		return Promise.all([D.deactivateTrace(I.getConfigurationContextId()), this.reload()]);
	};
	j.prototype.toggleDependencyCodesForEntry = function (t, r, E) {
		return new Promise(function (k, l) {
			var m = this._getTraceEntriesForEntryNumber(t, r, E);
			if (!m[0]._isAllDependencySourceCodeLoaded) {
				var s = O.generateTraceEntryPath(I.getConfigurationContextPath(), t, r, E);
				D.loadAllDependencyCodesForEntry(s).then(function (o) {
					this._assignAllDependencyCodesToEntries(m, o.results);
					k();
				}.bind(this)).catch(l);
			} else {
				this._toggleAllDependencyCodesForEntryFromCache(m);
				k();
			}
		}.bind(this));
	};
	j.prototype._loadEntries = function (s, t) {
		return D.loadEntries(a.getRootPath(), a.getSearchText(), a.getFilters(), s, t);
	};
	j.prototype._getTraceEntriesForEntryNumber = function (t, r, E) {
		return $.grep(this._model.getProperty("/entries"), function (o) {
			return o.TraceGuid === t && o.RoundtripNo === r && o.EntryNo === E;
		});
	};
	j.prototype._setTraceEntryTextHighlighted = function (t, k) {
		$.each(this._model.getProperty("/entries"), function (l, m) {
			if (this._generateTraceEntryTextInternalKey(m) === t) {
				this._model.setProperty("/entries/" + l + "/_isHighlighted", k);
				this._highlightedTraceEntryText = k ? t : null;
				return false;
			}
		}.bind(this));
	};
	j.prototype._checkDetailsExistForEntries = function (t) {
		return $.grep(t, function (E) {
			return !E._isDetailDownloaded;
		}).length === 0;
	};
	j.prototype._assignDetailsToEntries = function (o, t) {
		this._increaseModelSizeLimit(Math.max(o[T].results.length, o[d].results.length, o[e].results.length, o[f].results.length, o[h].results
			.length, o[g].results.length, o[B].results.length, o[R].results.length));
		$.each(t, function (k, E) {
			E._isDetailDownloaded = true;
			E[T] = o[T].results;
			E[d] = o[d].results;
			E[V] = o[V].results;
			E[e] = o[e].results;
			E[P] = o[P];
			E[h] = o[h].results;
			E[g] = o[g].results;
			E[B] = o[B].results;
			E[R] = o[R].results;
			E[i] = o[i];
			this.setDepSrcCodePropertiesAfterExpand(E, o[f].results, o[e].results);
		}.bind(this));
	};
	j.prototype._postProcessTraceEntries = function (t) {
		$.each(t, function (k, o) {
			var s = this._generateTraceEntryTextInternalKey(o);
			var l = this._traceEntryTextBuffer[s];
			if (l) {
				t[k] = l;
			} else {
				o._id = s;
				this._resetTraceEntryDetails(o);
				this._traceEntryTextBuffer[s] = o;
			}
			o._isHighlighted = this._highlightedTraceEntryText === s;
		}.bind(this));
		return t;
	};
	j.prototype._increaseModelSizeLimit = function (l) {
		if (this._currentModelSizeLimit < l) {
			this._model.setSizeLimit(l);
			this._currentModelSizeLimit = l;
		}
	};
	j.prototype._generateTraceEntryTextInternalKey = function (t) {
		var k = [t.TraceGuid, t.RoundtripNo, t.EntryNo, t.TextNo];
		return k.join("_");
	};
	j.prototype.setDepSrcCodePropertiesAfterExpand = function (t, k, l) {
		if (k && k.length > 0 && l.length === 1) {
			t._isDependencySourceCodeVisible = true;
			if (k.length > c) {
				t[f] = k.slice(0, c);
				t._isToggleDepSourceCodeLinkVisible = true;
			} else {
				t[f] = k;
				t._isToggleDepSourceCodeLinkVisible = false;
			}
		} else {
			t._isToggleDepSourceCodeLinkVisible = false;
			t._isDependencySourceCodeVisible = false;
		}
	};
	j.prototype._resetTraceEntryDetails = function (t) {
		t._isExpanded = false;
		t._isDetailDownloaded = false;
		t._isDependencySourceCodeVisible = false;
		t._isToggleDepSourceCodeLinkVisible = false;
		t._isAllDependencySourceCodeLoaded = false;
		t._cachedDependencySource = [];
		t[T] = [];
		t[d] = [];
		t[V] = [];
		t[e] = [];
		t[f] = [];
		t[P] = null;
		t[h] = [];
		t[g] = [];
		t[B] = [];
		t[R] = [];
		t[i] = null;
	};
	j.prototype._assignAllDependencyCodesToEntries = function (t, k) {
		this._increaseModelSizeLimit(k.length);
		$.each(t, function (l, o) {
			o._isAllDependencySourceCodeLoaded = true;
			o._cachedDependencySource = k;
			o[f] = k;
		});
		this._model.refresh();
	};
	j.prototype._toggleAllDependencyCodesForEntryFromCache = function (t) {
		$.each(t, function (k, o) {
			o[f] = o._cachedDependencySource.length === o[f].length ? o[f].slice(0, c) : o._cachedDependencySource;
		});
		this._model.refresh();
	};
	return new j();
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/logic/EventProvider', [], function () {
	"use strict";
	var E = sap.ui.base.ManagedObject.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.logic.EventProvider", {
		metadata: {
			events: {
				navigateBack: {
					parameters: {}
				},
				activateTrace: {
					parameters: {}
				},
				deactivateTrace: {
					parameters: {}
				},
				resetTrace: {
					parameters: {}
				},
				saveTraceState: {
					parameters: {}
				},
				restoreTraceState: {
					parameters: {}
				},
				fetchTrace: {
					parameters: {}
				},
				rebindValueList: {
					parameters: {
						csticPath: {
							type: "string"
						}
					}
				},
				setFocusOnHeader: {
					parameters: {}
				},
				resetComparison: {
					parameters: {}
				},
				initComparison: {
					parameters: {
						configurationContextId: {
							type: "string"
						},
						sampleDataPath: {
							type: "string"
						}
					}
				},
				comparisonDataConverted: {
					parameters: {
						items: {
							type: "array"
						},
						contextId: {
							type: "string"
						}
					}
				},
				restrictComparison: {
					parameters: {
						oConfigurationInstance: {
							type: "object"
						}
					}
				},
				changeTheSelectedTabOfInspector: {
					parameters: {
						tabKey: {
							type: "string"
						}
					}
				}
			}
		}
	});
	return new E();
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/logic/FeatureToggle', [
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants", "sap/i2d/lo/lib/zvchclfz/components/inspector/util/ODataModelHelper"
], function (C, O) {
	"use strict";
	var F = function () {
		this._toggles = {
			features: {},
			values: {}
		};
	};
	F.prototype._getToggleById = function (t) {
		if (this._toggles.values.hasOwnProperty(t)) {
			var m = O.getModel();
			if (this._toggles.values[t] === undefined && m) {
				var p = m.createKey(C.entitySets.ToggleSet, {
					"ToggleId": t
				});
				var c = m.getContext("/" + p);
				if (c && c.getObject()) {
					this._toggles.values[t] = !!c.getObject().ToggleStatus;
				} else {
					this._toggles.values[t] = false;
				}
			}
			return this._toggles.values[t];
		}
		return undefined;
	};
	return new F();
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel', ["sap/i2d/lo/lib/zvchclfz/common/type/InspectorMode",
	"sap/i2d/lo/lib/zvchclfz/common/Constants", "sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/ODataModelHelper", "sap/base/Log", "sap/ui/model/json/JSONModel"
], function (I, C, a, O, L, J) {
	"use strict";
	var _ = {
		isConfigComparisonAllowed: false,
		isTraceSupported: false,
		isTrackEventConnected: true,
		isTraceOn: false,
		isSuperInspectorAvailable: false,
		isTraceActivatedOnce: null,
		traceSwitchBusyState: false,
		selectedView: a.inspectorView.Inspector,
		selectedTab: I.inspectorTab.properties,
		isBackEnabled: false,
		isComparisonRestrictionActive: true,
		ConfigurationContextPath: "",
		ConfigurationContextId: "",
		InstanceId: "",
		GroupId: "0",
		semanticObject: "",
		inspectorComponentUpdated: false,
		inspectorContentInvalidated: false,
		lastObjectNavigatedTo: {
			path: null,
			type: null
		},
		lastAccessedObject: {
			path: null,
			type: null
		},
		isInspectorEditable: false,
		showPreciseNumbers: false,
		isExternalNavigationEnabled: true
	};
	var b = null;
	var c = null;
	var d = function () {
		b = new J($.extend(true, {}, _));
	};
	d.prototype.resetModel = function () {
		b.setData($.extend(true, {}, _));
	};
	d.prototype.setupModel = function (s, i, p, S, e, f) {
		this.resetModel();
		this.updateConfigurationContextId(s);
		this.setProperty("/InstanceId", i);
		var g = p.UISettings && p.UISettings.IsConfigCompAllowed && this.getSupportedEtoStatusesForComparison()[p.EtoStatus] !== undefined;
		this.setProperty("/isConfigComparisonAllowed", g);
		this.setIsTraceSupported(p.IsTraceAvailable);
		this.setIsSuperInspectorAvailable(p.IsBomAvailable && p.IsSuperBOMAvailable);
		this.setShowPreciseNumbers(S);
		this.setIsInspectorEditable(e);
		this.setIsExternalNavigationEnabled(f);
	};
	d.prototype.getSupportedEtoStatusesForComparison = function () {
		var e = {};
		e[C.ETO_STATUS.ENGINEERING_FINISHED] = C.DIFF_REF_TYPE.BEFORE_HANDOVER_TO_ENGINEERING;
		return e;
	};
	d.prototype.getModel = function () {
		return b;
	};
	d.prototype.setProperty = function (p, v) {
		this.getModel().setProperty(p, v);
	};
	d.prototype.getProperty = function (p) {
		return this.getModel().getProperty(p);
	};
	d.prototype.selectInspectorView = function () {
		this.setProperty("/selectedView", a.inspectorView.Inspector);
	};
	d.prototype.selectTraceView = function () {
		this.setProperty("/selectedView", a.inspectorView.Trace);
	};
	d.prototype.selectComparisonView = function () {
		this.setProperty("/selectedView", a.inspectorView.Comparison);
	};
	d.prototype.isInspectorViewSelected = function () {
		return this.getProperty("/selectedView") === a.inspectorView.Inspector;
	};
	d.prototype.isTraceViewSelected = function () {
		return this.getProperty("/selectedView") === a.inspectorView.Trace;
	};
	d.prototype.isComparisonViewSelected = function () {
		return this.getProperty("/selectedView") === a.inspectorView.Comparison;
	};
	d.prototype.setInspectorComponentUpdated = function (f) {
		this.setProperty("/inspectorComponentUpdated", f);
		this.setProperty("/inspectorContentInvalidated", false);
	};
	d.prototype.getInspectorComponentUpdated = function () {
		return this.getProperty("/inspectorComponentUpdated");
	};
	d.prototype.setInspectorContentInvalidated = function (f) {
		this.setProperty("/inspectorContentInvalidated", f);
	};
	d.prototype.getInspectorContentInvalidated = function () {
		return this.getProperty("/inspectorContentInvalidated");
	};
	d.prototype.setLastAccessObject = function (p, t) {
		this.setProperty("/lastAccessedObject/path", p);
		this.setProperty("/lastAccessedObject/type", t);
	};
	d.prototype.getLastAccessObjectPath = function () {
		return this.getProperty("/lastAccessedObject/path");
	};
	d.prototype.getLastAccessObjectType = function () {
		return this.getProperty("/lastAccessedObject/type");
	};
	d.prototype.setLastObjectNavigatedTo = function (p, t) {
		this.setProperty("/lastObjectNavigatedTo/path", p);
		this.setProperty("/lastObjectNavigatedTo/type", t);
	};
	d.prototype.getLastObjectNavigatedToPath = function () {
		return this.getProperty("/lastObjectNavigatedTo/path");
	};
	d.prototype.getLastObjectNavigatedToType = function () {
		return this.getProperty("/lastObjectNavigatedTo/type");
	};
	d.prototype.compareLastObjectNavigatedToPath = function (p) {
		return this.getProperty("/lastObjectNavigatedTo/path") === p;
	};
	d.prototype.compareWithLastAccessObjectPath = function (p) {
		return this.getProperty("/lastAccessedObject/path") === p;
	};
	d.prototype.compareWithLastAccessObject = function (p, t) {
		return this.getLastAccessObjectType() === t && this.compareWithLastAccessObjectPath(p);
	};
	d.prototype.compareLastAccessedAndNavigatedTo = function () {
		return this.compareWithLastAccessObject(this.getLastObjectNavigatedToPath(), this.getLastObjectNavigatedToType());
	};
	d.prototype.setInspectorVisibilityChecker = function (f) {
		if (f && $.isFunction(f)) {
			c = f;
		} else {
			L.error("No Callback function is defined", "CallBack function to check inspector visibility",
				"sap.i2d.lo.lib.zvchclfz.components.inspector.logic.InspectorModel");
		}
	};
	d.prototype.getInspectorVisibility = function () {
		if (c && $.isFunction(c)) {
			return c();
		} else {
			L.error("No Callback function is defined", "CallBack function to check inspector visibility",
				"sap.i2d.lo.lib.zvchclfz.components.inspector.logic.InspectorModel");
			return false;
		}
	};
	d.prototype.updateConfigurationContextId = function (s) {
		var e = "/" + O.getModel().createKey(a.entitySets.ConfigurationContext, {
			ContextId: s
		});
		this.setProperty("/ConfigurationContextPath", e);
		this.setProperty("/ConfigurationContextId", s);
	};
	d.prototype.getConfigurationContextPath = function () {
		return this.getProperty("/ConfigurationContextPath");
	};
	d.prototype.getConfigurationContextId = function () {
		return this.getProperty("/ConfigurationContextId");
	};
	d.prototype.getIsTraceSupported = function () {
		return this.getProperty("/isTraceSupported");
	};
	d.prototype.setIsTraceSupported = function (i) {
		this.setProperty("/isTraceSupported", i);
	};
	d.prototype.getIsSuperInspectorAvailable = function () {
		return this.getProperty("/isSuperInspectorAvailable");
	};
	d.prototype.setIsSuperInspectorAvailable = function (i) {
		this.setProperty("/isSuperInspectorAvailable", i);
	};
	d.prototype.isInspectorEditable = function () {
		return this.getProperty("/isInspectorEditable");
	};
	d.prototype.setIsInspectorEditable = function (e) {
		this.setProperty("/isInspectorEditable", e);
	};
	d.prototype.setShowPreciseNumbers = function (s) {
		this.setProperty("/showPreciseNumbers", s);
	};
	d.prototype.setIsExternalNavigationEnabled = function (i) {
		this.setProperty("/isExternalNavigationEnabled", i);
	};
	d.prototype.getIsExternalNavigationEnabled = function () {
		return this.getProperty("/isExternalNavigationEnabled");
	};
	return new d();
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/logic/NavigationHandler', ["sap/base/Log",
	"sap/ui/generic/app/navigation/service/NavigationHandler", "sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel"
], function (L, N, I) {
	"use strict";
	return N.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.logic.NavigationHandler", {
		_supportedNavigation: {
			NavigateToBOM: null
		},
		_internalNavigatorService: null,
		constructor: function (c) {
			N.prototype.constructor.call(this, c);
			var n = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService && sap.ushell.Container.getService(
				"CrossApplicationNavigation");
			if (n) {
				this._internalNavigatorService = n;
				this.isNavigationToBOMSupported();
			}
		},
		isNavigationSupported: function (s, a, n) {
			return new Promise(function (r, b) {
				if (this._internalNavigatorService) {
					var i = {
						target: {
							semanticObject: s,
							action: a
						},
						params: n || {}
					};
					this._internalNavigatorService.isNavigationSupported([i]).done(function (R) {
						r(R[0].supported);
					}).fail(function () {
						b();
					});
				} else {
					b();
				}
			}.bind(this));
		},
		navigateToBOM: function (p) {
			this.navigate("MaterialBOM", "displayBOM", {
				Material: p.BillOfMaterial,
				Plant: p.Plant,
				BillOfMaterialVariantUsage: p.BOMVariantUsage,
				BillOfMaterialCategory: p.BOMCategory,
				BillOfMaterialVariant: p.BOMVariant
			});
		},
		isNavigationToBOMSupported: function () {
			this.isNavigationSupported("MaterialBOM", "displayBOM", {
				Material: "",
				Plant: "",
				BillOfMaterialVariantUsage: "",
				BillOfMaterialCategory: "",
				BillOfMaterialVariant: ""
			}).then(function (s) {
				this._supportedNavigation.NavigateToBOM = s;
			}.bind(this)).catch(function () {
				this._supportedNavigation.NavigateToBOM = false;
				L.error("The Navigation to BOM is not supported.", "You need to add a role to your launchpad in order to allow BOM Navigation.",
					"sap.i2d.lo.lib.zvchclfz.components.inspector.logic.NavigationHandler");
			}.bind(this));
		},
		getIsNavigationToBOMSupported: function () {
			return this._supportedNavigation.NavigateToBOM && I.getIsExternalNavigationEnabled();
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/logic/NavigationManager', [
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/UiConfig", "sap/i2d/lo/lib/zvchclfz/components/inspector/util/ODataModelHelper",
	"sap/base/Log", "sap/base/util/uid", "sap/ui/base/ManagedObject"
], function (U, O, L, u, M) {
	"use strict";
	var N = M.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.logic.NavigationManager", {
		metadata: {
			properties: {
				container: {
					type: "object"
				}
			}
		},
		_ownerComponent: null,
		_navigationHandler: null,
		setOwnerComponent: function (c) {
			if (c) {
				this._ownerComponent = c;
			} else {
				L.error("Missing Owner Component of the Navigation Manager", "Please set it as an instance of sap.ui.core.UIComponent",
					"sap.i2d.lo.lib.zvchclfz.components.inspector.logic.NavigationManager");
			}
		},
		setNavigationHandler: function (n) {
			if (n) {
				this._navigationHandler = n;
			} else {
				L.error("Missing the Navigation Handler", "Please set it as an instance of sap.ui.base.ManagedObject",
					"sap.i2d.lo.lib.zvchclfz.components.inspector.logic.NavigationManager");
			}
		},
		getNavigationHandler: function () {
			return this._navigationHandler;
		},
		removeValuePages: function () {
			var c = this.getContainer();
			var C = c.getCurrentPage();
			if (!C) {
				return;
			}
			var s = C.getId();
			$.each(c.getPages(), function (i, e) {
				if (e.getViewData().objectType === U.inspectorMode.objectType.CharacteristicValue) {
					if (e.getId() === s) {
						e.getController().reloadContent();
					} else {
						e.destroy();
						c.removePage(e);
					}
				}
			});
		},
		reloadContentOfPages: function () {
			$.each(this.getContainer().getPages(), function (i, e) {
				var c = e.getController();
				if ($.isFunction(c.reloadContent)) {
					c.reloadContent();
				}
			});
		},
		setRoot: function (o, s, k) {
			var c = this.getContainer();
			$.each(c.getPages(), function (i, v) {
				if ($.isFunction(v.destroy)) {
					v.destroy();
				}
			});
			c.fireNavigate();
			c.removeAllPages();
			this.navigateTo(o, s, k);
			c.fireAfterNavigate();
		},
		resetRoot: function () {
			var c = this.getContainer();
			$.each(c.getPages(), function (i, v) {
				if ($.isFunction(v.destroy)) {
					v.destroy();
				}
			});
			this.getContainer().removeAllPages();
		},
		getCurrentPageContent: function () {
			var c = this.getContainer().getCurrentPage();
			if (c) {
				return c.getContent()[0];
			} else {
				return null;
			}
		},
		navigateBack: function () {
			var c = this.getContainer();
			var C;
			c.back();
			C = c.getCurrentPage().getController();
			if ($.isFunction(C.onAfterNavBack)) {
				C.onAfterNavBack();
			}
		},
		navigateTo: function (o, s, k) {
			if (!o || !s) {
				L.error("Invalid parameters", "Object type and Object path are mandatory parameters",
					"sap.i2d.lo.lib.zvchclfz.components.inspector.logic.NavigationManager");
				return;
			}
			var n = $.extend(true, {}, U.objectTypeConfig[s]);
			if (!n) {
				L.error("Invalid object type", "Use the constants defined in sap.i2d.lo.lib.zvchclfz.common.type.InspectorMode",
					"sap.i2d.lo.lib.zvchclfz.components.inspector.logic.NavigationManager");
				return;
			} else {
				n.objectType = s;
				n.objectPath = o;
				if (!$.isEmptyObject(k)) {
					n.objectKeyParameters = k;
				}
			}
			var p = $.grep(this.getContainer().getPages(), function (e) {
				return e.getViewData().objectPath === o;
			});
			if (p.length > 0) {
				var c = p[0].getController();
				if ($.isFunction(c.updateSelectedTab)) {
					c.updateSelectedTab();
				}
				this.getContainer().to(p[0]);
			} else {
				n.isInitialPage = this.getContainer().getPages().length === 0;
				if (this._ownerComponent) {
					this._ownerComponent.runAsOwner(function () {
						var v = sap.ui.xmlview(n.baseView + "-" + u(), {
							viewName: n.baseView,
							viewData: n,
							height: "100%"
						});
						var V = v.getController();
						v.setModel(O.getModel());
						this.getContainer().addPage(v).to(v);
						if ($.isFunction(V.onNavigatedTo)) {
							V.onNavigatedTo();
						}
					}.bind(this));
				}
			}
		},
		teardown: function () {
			this.setContainer(null);
		}
	});
	return new N();
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/logic/SuggestionListHandler', [
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/ValueHelpConfig",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/dao/DependencyTraceDAO", "sap/i2d/lo/lib/zvchclfz/components/inspector/util/i18n",
	"sap/ui/model/Filter", "sap/ui/model/FilterOperator"
], function (V, D, i, F, a) {
	"use strict";
	var S = 10;
	var G = function (e) {
		this._config = e;
		this._suggestedRows = {};
		this._lastSearchText = "";
		this._requestSuggestionRowsPromise = null;
		this._filterForValueHelpRequest = e.IsContainedInConfignModelProperty ? [new F({
			path: e.IsContainedInConfignModelProperty,
			operator: a.EQ,
			value1: true
		})] : [];
	};
	G.prototype.getLastSearchText = function () {
		return this._lastSearchText;
	};
	G.prototype.requestSuggestionRows = function (s) {
		if (this._lastSearchText !== s || !this._requestSuggestionRowsPromise) {
			this._requestSuggestionRowsPromise = new Promise(function (r, R) {
				this._lastSearchText = s;
				this._suggestedRows = {};
				D.loadTraceValueHelpEntries(this._config.getBindingPath(), s, S, this._filterForValueHelpRequest).then(function (d) {
					this._suggestedRows[this._config.EntitySet] = d;
					this._requestSuggestionRowsPromise = null;
					r(this._suggestedRows[this._config.EntitySet]);
				}.bind(this)).catch(function (e) {
					this._requestSuggestionRowsPromise = null;
					R(e);
				}.bind(this));
			}.bind(this));
		}
		return this._requestSuggestionRowsPromise;
	};
	G.prototype.getFilterItemFromSuggestedRows = function (n) {
		return new Promise(function (r) {
			var f = this._getFilterItemFromSuggestedRows(n);
			if (f) {
				r(f);
			} else if (this._lastSearchText === n && !this._requestSuggestionRowsPromise) {
				r(null);
			} else {
				this.requestSuggestionRows(n).then(function () {
					r(this._getFilterItemFromSuggestedRows(n));
				}.bind(this)).catch(function () {
					r(null);
				});
			}
		}.bind(this));
	};
	G.prototype.createFilterItemFromSelectedItem = function (b) {
		return {
			key: b[this._config.KeyProperty],
			text: b[this._config.NameProperty]
		};
	};
	G.prototype.getWarningMessage = function (n) {
		return i.getTextWithParameters(this._config.WarningMessage, [n]);
	};
	G.prototype._getFilterItemFromSuggestedRows = function (n) {
		if (this._suggestedRows[this._config.EntitySet]) {
			var f = this._suggestedRows[this._config.EntitySet].filter(function (I) {
				return I[this._config.NameProperty] === n.toUpperCase();
			}.bind(this));
			return f.length > 0 ? this.createFilterItemFromSelectedItem(f[0]) : null;
		} else {
			return null;
		}
	};
	return {
		_csticSuggestionListHandler: null,
		_depSuggestionListHandler: null,
		getCsticSuggestionListHandler: function () {
			if (!this._csticSuggestionListHandler) {
				this._csticSuggestionListHandler = new G(V.CsticValueHelpConfig);
			}
			return this._csticSuggestionListHandler;
		},
		getDepSuggestionListHandler: function () {
			if (!this._depSuggestionListHandler) {
				this._depSuggestionListHandler = new G(V.DependencyValueHelpConfig);
			}
			return this._depSuggestionListHandler;
		}
	};
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/util/DependencyTraceMapper', [
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/TraceFilterDialogConfig",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/TraceFilterTypes", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"
], function (T, a, F, b) {
	"use strict";
	var M = a.SupportedTraceFilterTypes.MessageType;
	var c = T.MessageTypeParameters;
	var d = T.SupportedTraceFilterTypes[M].property;
	var V = a.SupportedTraceFilterTypes.ValueAssignmentBy;
	var e = T.ValueAssignmentByParameters;
	var f = T.SupportedTraceFilterTypes[V].property;
	var g = "MessageTypeId";
	var h = {};
	h[c.ValueAssignment] = ["ASS_PATTERN", "BADI_VAL_ASSIGNMENT", "CALC_PENDING", "CALC_PENDING_H", "COND_ASS", "CONSTR_ASS", "EXT_ASS",
		"MACOND_SET", "PRECON_ASS", "PROC_APPLY_HARD_ASS", "PROC_APPLY_PNDG_HARD", "PROC_APPLY_PNDG_SOFT", "PROC_APPLY_SOFT_ASS",
		"RE_INSERT_RETRCTD", "REF_C_ASS", "STATIC_DEF_APPL", "USER_ASS"
	];
	h[c.ValueRestriction] = ["BADI_VAL_RETRACTION", "COND_RESTR", "CONSTR_RESTR", "PRECON_RESTR", "RESTR_PATTERN"];
	h[c.ValueSkipped] = ["ASS_SKIP_COND_FALSE", "ASS_SKIP_NOT_APPLCBL", "ASS_SKIP_RHS_NOT_ASS", "ASS_SKIP_SAME_VAL", "DEF_SKIP_RHS_NOT_ASS",
		"DEL_DEF_RHS_NOT_ASS", "DEL_DEF_VAL_NOT_ASS", "SKIP_DYN_DEF", "SKIP_STAT_DEF", "DEL_USR_VAL_NOT_ASS", "DEL_USR_RHS_NOT_ASS",
		"DEL_USR_NOT_NEEDED", "CONSTR_SKIP_NOMATCH"
	];
	h[c.ValueRetraction] = ["CST_RETR_DEF_CORRECT", "CST_RETR_DEL_DEF", "CST_RETR_INCONS", "CST_RETR_OVERWRITING", "CST_RETR_RECALC_PROC",
		"CST_RETR_DEL_USER", "VAL_RETR_DOM_WID"
	];
	h[c.BAdI] = ["BADI_CANNOT_BE_EXEC", "BADI_ERROR", "BADI_VAL_ASSIGNMENT", "BADI_VAL_RETRACTION"];
	h[c.InconsistencyDetected] = ["ASS_TEMP_INCONS", "DEF_CORRECT_FAIL", "DEP_INCONS", "DEP_TEMP_INCONS", "INCONS_EXCL_ASS",
		"INCONS_EXCL_MAND", "INCONS_PATTERN", "INCONS_TMP_PATTERN", "ROLL_BACK", "TRY_RESOLVE_INCON", "UNKNOWN_DEP_INCONS",
		"UNKWN_DEP_TMP_INCONS"
	];
	h[c.ProcessingStarted] = ["CSFLAGS_PRCESS_INST", "IMMUT_ASS_EXEC_INST", "INST_PROC_START", "PROC_PRCESS_INST", "BOM_EXPLOSION_START",
		"RTG_EXPLSN_STARTED"
	];
	h[c.ProcessingSkipped] = ["BOM_EXPLOSION_SKIPPD", "BOM_EXPL_SKIPPD_ETO", "BOM_DESELECTED", "ASS_SKIP_SAME_VAL", "ASS_SKIP_NOT_APPLCBL",
		"ASS_SKIP_COND_FALSE", "DEF_SKIP_RHS_NOT_ASS", "ASS_SKIP_RHS_NOT_ASS", "PROC_SKIPPED", "SKIP_STAT_DEF", "SKIP_DYN_DEF",
		"PRCNG_NO_SUCCESS_IA", "VAL_RETR_DOM_WID", "DEP_SKIP_UNKNWN_CST"
	];
	h[c.PricingFactor] = ["CALC_PRICING_SUCCESS", "CLEARED_PRICING", "PRCNG_NO_SUCCESS_IA", "PRCNG_NO_SUCCESS_VC"];
	h[c.CharacteristicFacet] = ["EXCLUDED_CSTIC", "MANDATORY_CSTIC", "NOT_EXCLUDED_CSTIC", "NOT_MANDATORY_CSTIC", "STAT_MANDATORY_CST"];
	h[c.HighLevelCondition] = ["CSTRCOND_FALSE", "CSTRCOND_TRUE", "DP_ANCH_EVAL_CST_A", "DP_ANCH_EVAL_CST_I", "DP_ANCH_EVAL_CSV_A",
		"DP_ANCH_EVAL_CSV_I", "PRECON_EVAL_FALSE", "PRECON_EVAL_TRUE", "SELCON_EVAL_FALSE", "SELCON_EVAL_TRUE", "SUBPROC_COND_FALSE",
		"SUBPROC_COND_TRUE"
	];
	h[c.LowLevelSelectionCondition] = ["BOM_SC_FULFILLED", "BOM_SC_NOT_FULFILLED", "CNODE_SC_FULFILLED", "CNODE_SC_N_FULFILLED",
		"OP_SC_FULFILLED", "OP_SC_NOT_FULFILLED", "PRT_SC_FULFILLED", "PRT_SC_NOT_FULFILLED", "SEQ_SC_FULFILLED", "SEQ_SC_NOT_FULFILLED",
		"SUBOP_SC_FULFILLED", "SUBOP_SC_NO_FULFILLD"
	];
	h[c.LowLevelProcedureExecution] = ["BOM_PROC_EXECUTED", "BOM_PROC_NO_EXECUTED", "CNODE_PROC_EXECUTED", "CNODE_PROC_N_EXCUTED",
		"OP_PROC_EXECUTED", "OP_PROC_NO_EXECUTED", "PRT_PROC_EXECUTED", "PRT_PROC_NO_EXECUTED", "SEQ_PROC_EXECUTED", "SEQ_PROC_NO_EXECUTED",
		"SUBOP_PROC_EXECUTED", "SUBOP_PROC_NO_EXCUTD"
	];
	h[c.ClassItemSubstitution] = ["CNODE_SPECIALIZED", "CNODE_N_SPECIALIZED"];
	var i = {};
	i[e.Default] = ["STATIC_DEF_APPL"];
	i[e.Procedure] = ["CALC_PENDING", "CALC_PENDING_H", "PROC_APPLY_HARD_ASS", "PROC_APPLY_PNDG_HARD", "PROC_APPLY_PNDG_SOFT",
		"PROC_APPLY_SOFT_ASS", "RE_INSERT_RETRCTD"
	];
	i[e.Constraint] = ["COND_ASS", "CONSTR_ASS"];
	i[e.User] = ["USER_ASS"];
	i[e.Precondition] = ["PRECON_ASS"];
	i[e.ExtComponent] = ["EXT_ASS", "REF_C_ASS"];
	i[e.TemplatePattern] = ["ASS_PATTERN"];
	var D = function () {};
	D.prototype.createMsgTypeIdFilters = function (o) {
		var m = [];
		if (!o[M]) {
			return null;
		}
		$.each(o[M], function (j, k) {
			var s = k.parameters[d];
			if (T.ValueAssignmentByRelatedMessageTypes.indexOf(s) === -1 || !o[V]) {
				$.each(h[s], function (l, n) {
					m.push(new F(g, b.EQ, n));
				});
			} else {
				$.each(o[V], function (v, l) {
					var n = l.parameters[f];
					$.each(i[n], function (p, q) {
						if (h[s].indexOf(q) !== -1) {
							m.push(new F(g, b.EQ, q));
						}
					});
				});
			}
		});
		return new F({
			filters: m,
			and: false
		});
	};
	return new D();
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/util/ODataModelHelper', [
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants"
], function (C) {
	"use strict";
	var a = C.navigationProperties.ConfigurationContext;
	var T = C.navigationProperties.TraceCharacteristic;
	var b = C.navigationProperties.TraceObjectDependency;
	var P = C.propertyNames;
	var O = function () {
		this._model = null;
	};
	O.prototype.init = function (m) {
		this._model = m;
	};
	O.prototype.getModel = function () {
		return this._model;
	};
	O.prototype.getModelForODataBinding = function () {
		return this.getModel().getOriginModel();
	};
	O.prototype.generateConfigurationContextPath = function (c) {
		return this._generatePath("", C.entitySets.ConfigurationContext, [{
			key: P.ContextId,
			value: c
		}]);
	};
	O.prototype.generateCharacteristicPath = function (c, i, g, s) {
		return this._generatePath("", C.entitySets.Characteristic, [{
			key: P.ContextId,
			value: c
		}, {
			key: P.InstanceId,
			value: i
		}, {
			key: P.GroupId,
			value: g,
			isNumeric: true
		}, {
			key: P.CsticId,
			value: s
		}]);
	};
	O.prototype.getCharacteristicKeyValuePairs = function (c, i, g, s) {
		var k = {};
		k[P.ContextId] = c;
		k[P.InstanceId] = i;
		k[P.GroupId] = g;
		k[P.CsticId] = s;
		return k;
	};
	O.prototype.generateBOMComponentPath = function (c, B) {
		return this._generatePath(this.generateConfigurationContextPath(c), C.navigationProperties.ConfigurationContext.BOMNode, [{
			key: P.ComponentId,
			value: B
		}]);
	};
	O.prototype.generateRoutingPath = function (c, B, r) {
		return this._generatePath(this.generateBOMComponentPath(c, B), C.navigationProperties.BOMNode.Routings, [{
			key: P.BillOfOperationsType,
			value: r.BillOfOperationsType
		}, {
			key: P.BillOfOperationsGroup,
			value: r.BillOfOperationsGroup
		}, {
			key: P.BillOfOperationsVariant,
			value: r.BillOfOperationsVariant
		}]);
	};
	O.prototype.generateRoutingNodePath = function (c, B, r, t, n) {
		return this._generatePath(this.generateRoutingPath(c, B, r), C.navigationProperties.Routing.RoutingNodes, [{
			key: P.TreeId,
			value: t
		}, {
			key: P.NodeId,
			value: n
		}]);
	};
	O.prototype.generateRoutingPRTPath = function (c, B, r, t, n, p) {
		return this._generatePath(this.generateRoutingNodePath(c, B, r, t, n), C.navigationProperties.RoutingNode.PRTs, [{
			key: P.BillOfOperationsType,
			value: r.BillOfOperationsType
		}, {
			key: P.BillOfOperationsGroup,
			value: r.BillOfOperationsGroup
		}, {
			key: P.BOOOperationPRTInternalId,
			value: p.BOOOperationPRTInternalId
		}, {
			key: P.BOOOperationPRTIntVersCounter,
			value: p.BOOOperationPRTIntVersCounter
		}]);
	};
	O.prototype.generateObjectDependencyPath = function (c, o) {
		return this._generatePath("", C.entitySets.ObjectDependencyDetails, [{
			key: P.ContextId,
			value: c
		}, {
			key: P.ObjectDependency,
			value: o
		}]);
	};
	O.prototype.generateTraceEntryPath = function (c, t, r, e) {
		return this._generatePath(c, a.TraceEntry, [{
			key: P.TraceGuid,
			value: t
		}, {
			key: P.RoundtripNo,
			value: r,
			isNumeric: true
		}, {
			key: P.EntryNo,
			value: e,
			isNumeric: true
		}]);
	};
	O.prototype.generateWhereWasValueSetPath = function (c, B, s) {
		return this._generatePath(c, a.TraceCharacteristic, [{
			key: P.BOMComponentId,
			value: B
		}, {
			key: P.CsticId,
			value: s
		}], T.WhereWasValueSet);
	};
	O.prototype.generateWhereWasCsticUsedPath = function (c, B, s) {
		return this._generatePath(c, a.TraceCharacteristic, [{
			key: P.BOMComponentId,
			value: B
		}, {
			key: P.CsticId,
			value: s
		}], T.WhereWasUsed);
	};
	O.prototype.generateWhereWasDepSetPath = function (c, o, s, d) {
		return this._generatePath(c, a.TraceObjectDependency, [{
			key: P.ObjectDependency,
			value: o
		}, {
			key: P.SubprocedureIndex,
			value: s,
			isNumeric: true
		}, {
			key: P.ObjectDependencyId,
			value: d,
			isNumeric: true
		}], b.WhereWasDepSet);
	};
	O.prototype.generateWhereWasDepUsedPath = function (c, o, s, d) {
		return this._generatePath(c, a.TraceObjectDependency, [{
			key: P.ObjectDependency,
			value: o
		}, {
			key: P.SubprocedureIndex,
			value: s,
			isNumeric: true
		}, {
			key: P.ObjectDependencyId,
			value: d,
			isNumeric: true
		}], b.WhereWasDepUsed);
	};
	O.prototype._generatePath = function (r, n, k, N) {
		var K = this._generateKeyValuePairs(k);
		var p = N ? "/" + N : "";
		return r + "/" + n + K + p;
	};
	O.prototype._generateKeyValuePairs = function (k) {
		var n = k.length;
		if (n === 0) {
			return "";
		}
		var K = "(";
		var o;
		var v;
		for (var i = 0; i < n - 1; i++) {
			o = k[i];
			v = o.isNumeric || false ? o.value : "'" + o.value + "'";
			K += o.key + "=" + v + ",";
		}
		o = k[n - 1];
		v = o.isNumeric || false ? o.value : "'" + o.value + "'";
		K += o.key + "=" + v + ")";
		return K;
	};
	O.prototype.destroy = function () {
		if (this._model) {
			this._model.destroy();
			delete this._model;
		}
	};
	return new O();
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/util/SuperInspector', [
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants"
], function (C) {
	"use strict";
	var S = function () {};
	S.prototype.attachStandardValuesToOperation = function (o, c, s) {
		var e = o;
		var a = [];
		$.each(c, function (i, b) {
			var d = this._findObjectInArrayByValueOfProperty(s, "Label", b.Label);
			b[C.navigationProperties.Common.Super] = d.length > 0 ? d[0] : {};
			a.push(b);
		}.bind(this));
		$.each(s, function (i, b) {
			var d = this._findObjectInArrayByValueOfProperty(c, "Label", b.Label);
			if (d.length === 0) {
				var f = {};
				f[C.navigationProperties.Common.Super] = b;
				a.push(f);
			}
		}.bind(this));
		e[C.navigationProperties.Operation.StandardValues] = a;
		return e;
	};
	S.prototype.isDifferentConfiguredAndSuperData = function (e) {
		var d = false;
		$.each(e, function (k, v) {
			if (typeof v !== "object" && v !== e[C.navigationProperties.Common.Super][k]) {
				d = true;
				return false;
			}
		});
		return d;
	};
	S.prototype.isDifferentConfiguredAndSuperStandardValues = function (s) {
		return $.grep(s, function (o) {
			return o.Value !== o[C.navigationProperties.Common.Super].Value;
		}).length > 0;
	};
	S.prototype._findObjectInArrayByValueOfProperty = function (a, p, v) {
		return $.grep(a, function (e) {
			return e[p] && e[p] === v;
		});
	};
	return new S();
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/util/TraceUtil', [
	"sap/i2d/lo/lib/zvchclfz/components/inspector/dao/DependencyTraceDAO", "sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel"
], function (D, I) {
	"use strict";
	var T = function () {};
	T.prototype.checkTraceIsSupportedAndActive = function (c) {
		return new Promise(function (r, R) {
			if (I.getIsTraceSupported()) {
				D.checkTraceIsActive(c).then(function (i) {
					if (i) {
						r();
					} else {
						R();
					}
				}).catch(function () {
					R();
				});
			} else {
				R();
			}
		});
	};
	return new T();
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/inspector/util/i18n', [], function () {
	"use strict";
	var I = function () {
		this._model = null;
	};
	I.prototype.initModel = function (m) {
		if (!this._model) {
			this._model = m;
		}
	};
	I.prototype.getText = function (i) {
		if (this._model && i) {
			return this._model.getProperty(i);
		}
		return undefined;
	};
	I.prototype.getModel = function () {
		return this._model;
	};
	I.prototype.getTextWithParameters = function (i, p) {
		if (this._model && i) {
			return this._model.getResourceBundle().getText(i, p);
		}
		return undefined;
	};
	return new I();
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/smarttemplate/configuration/Component', [
	"sap/i2d/lo/lib/zvchclfz/components/configuration/BaseConfigurationComponent",
	"sap/suite/ui/generic/template/extensionAPI/ReuseComponentSupport",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/HeaderConfiguration", "sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/i2d/lo/lib/zvchclfz/common/util/Toggle", "sap/ui/base/ManagedObject", "sap/ui/model/Context", "sap/ui/model/json/JSONModel",
	"sap/i2d/lo/lib/zvchclfz/common/odataFacade/ODataFacadeModel"
], function (B, R, H, C, T, M, a, J, O) {
	"use strict";
	return B.extend("sap.i2d.lo.lib.zvchclfz.components.smarttemplate.configuration.Component", {
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
		_registerRefreshListener: function () {
			this._unregisterRefreshListener();
			var o = this.getModel(C.VCHCLF_MODEL_NAME).getOriginModel();
			this._oRefreshListenerDataBinding = o.bindProperty("ConfigurationSideEffect", this.getBindingContext());
			this._oRefreshListenerDataBinding.attachChange(this.reload, this);
		},
		_unregisterRefreshListener: function () {
			if (this._oRefreshListenerDataBinding) {
				this._oRefreshListenerDataBinding.detachChange(this.reload, this);
				this._oRefreshListenerDataBinding.destroy();
				delete this._oRefreshListenerDataBinding;
			}
		},
		_setMessageFilterPromise: function () {
			return new Promise(function (r) {
				this._fnResolveMessageFilter = function (c) {
					r(new sap.ui.model.Filter({
						path: "target",
						operator: sap.ui.model.FilterOperator.Contains,
						value1: c
					}));
					this._fnResolveMessageFilter = undefined;
				};
			}.bind(this));
		},
		init: function () {
			B.prototype.init.apply(this, arguments);
			R.mixInto(this);
		},
		exit: function () {
			this._unregisterRefreshListener();
		},
		setHeaderConfigurationJSON: function (h) {
			this.setProperty("headerConfigurationJSON", h);
			var c = this.getHeaderConfiguration();
			if (c) {
				c.destroy();
			}
			this.setHeaderConfiguration(new H(h));
		},
		stStart: function (m, b, e) {
			e.registerMessageFilterProvider(this._setMessageFilterPromise.bind(this));
			this._bIsSmartTemplate = true;
			e.addFooterBarToPage(this);
			this.stRefresh(m, b, e);
		},
		setBindingContext: function (c, m) {
			if (c) {
				var o = c.getModel("vchclf");
				if (!(o instanceof O)) {
					var b = c.getObject();
					var f = this.setModel(o, C.VCHCLF_MODEL_NAME);
					c = new a(f, c.getPath());
					f.metadataLoaded().then(function () {
						f.storePreloadedData(b, null, c);
					}.bind(this));
				}
			}
			M.prototype.setBindingContext.apply(this, [c, m]);
		},
		stRefresh: function (m, b, e) {
			this.setExtensionAPI(e);
			var r = true;
			var g = function (c) {
				var k = e.getNavigationController().getCurrentKeys();
				var K = "";
				jQuery.each(k, function (i, v) {
					if (v && typeof v === "string" && v.indexOf(c) === 0) {
						K = v;
						return false;
					}
				}.bind(this));
				return K;
			};
			if (!m) {
				jQuery.sap.log.error("No VCHCLF model available - model was not provided by caller");
			}
			this.setModel(m, C.VCHCLF_MODEL_NAME);
			this.initConfigurationDAO();
			this.attachBusyIndicatorEvents();
			var A = function (f, c) {
				var s;
				var d = this.getInternalNavSettings().configObjectEntitySetName;
				var n = "/" + g(d);
				this._registerRefreshListener();
				this.createComponents();
				if (d && n.length > 1) {
					this.updateConfigObjectBindingContext(n).then(function () {
						var o = this.getObjectKey();
						s = decodeURIComponent(this.buildContextIdForInternalNavigation());
						var N = this.getObjectKey();
						if (this._fnResolveMessageFilter) {
							this._fnResolveMessageFilter(s);
						}
						r = o !== N || this._bInitialLoad;
						if (r) {
							this.reload();
							this._bInitialLoad = false;
						}
						f();
					}.bind(this));
				} else {
					s = decodeURIComponent(this.buildContextId());
					if (this._fnResolveMessageFilter) {
						this._fnResolveMessageFilter(s);
					}
					this.reload();
					f();
				}
			};
			return new Promise(function (f, c) {
				this.getModel(C.VCHCLF_MODEL_NAME).metadataLoaded().then(A.bind(this, f, c));
			}.bind(this));
		},
		setExtensionAPI: function (e) {
			this.setProperty("extensionAPI", e);
			this.getConfigurationSettingsModel().setProperty("/extensionAPI", e);
			var t = null;
			if (e) {
				t = e.getTransactionController();
			}
			this.getConfigurationSettingsModel().setProperty("/transactionController", t);
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/Component', [
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/EventProvider",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/FeatureToggle",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/StructurePanelModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/model/StructureTreeModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/i18n", "sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/ODataModelHelper",
	"sap/base/Log", "sap/ui/core/UIComponent", "sap/i2d/lo/lib/zvchclfz/components/structurepanel/config/UiConfig"
], function (C, E, F, S, a, i, O, L, U, b) {
	"use strict";
	return U.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.Component", {
		metadata: {
			manifest: "json",
			properties: {
				modelName: {
					type: "string"
				},
				semanticObject: {
					type: "string"
				},
				uiMode: {
					type: "string",
					defaultValue: "Display"
				},
				personalizationDAO: {
					type: "sap.i2d.lo.lib.zvchclfz.components.configuration.dao.PersonalizationDAO"
				},
				descriptionMode: {
					type: "sap.i2d.lo.lib.zvchclfz.common.type.DescriptionMode"
				},
				isBOMChangeAllowed: {
					type: "boolean",
					defaultValue: false
				}
			},
			events: {
				inspectObject: {
					parameters: {
						objectPath: {
							type: "string"
						},
						objectType: {
							type: "string"
						},
						inspectorTab: {
							type: "string"
						}
					}
				},
				ReferenceCharacteristicSelected: {
					parameters: {
						path: {
							type: "string"
						},
						oConfigurationInstance: {
							type: "object"
						}
					}
				},
				closePanelPressed: {},
				BOMExplosionFinished: {},
				BOMExplosionTriggered: {
					parameters: {
						isMultiLevel: {
							type: "boolean"
						}
					}
				},
				RoutingExplosionFinished: {},
				navigationToBOMCanNotBeFound: {},
				ConfigurableItemSelected: {
					parameters: {
						path: {
							type: "string"
						},
						oConfigurationInstance: {
							type: "object"
						}
					}
				},
				BOMComponentDeleted: {
					parameters: {
						objectPath: {
							type: "string"
						}
					}
				},
				ConfigurableItemSelectionChanged: {}
			}
		},
		init: function () {
			U.prototype.init.apply(this, arguments);
			i.initModel(this.getModel("i18n"));
			a.setOwnerComponent(this);
		},
		_initializeModel: function () {
			if (!this.__initializedModel) {
				if (typeof this.getModelName() !== "string") {
					this.__initializedModel = false;
					L.error("Missing model name", "Please set the modelName property for the component",
						"sap.i2d.lo.lib.zvchclfz.components.structurepanel.Component");
				} else {
					var m = this.getModel(this.getModelName());
					if (m) {
						O.init(m);
						this.__initializedModel = true;
						this.setModel(m);
						if (!this.getModel("global")) {
							this.setModel(S.getModel(), "global");
						}
					} else {
						this.__initializedModel = false;
						L.error("Invalid model name", "There is no model with this name", "sap.i2d.lo.lib.zvchclfz.components.structurepanel.Component");
					}
				}
			}
		},
		setIsBOMChangeAllowed: function (I) {
			this.setProperty("isBOMChangeAllowed", I);
			S.setIsBOMChangeAllowed(I);
		},
		updateConfigurationContextId: function (c, p) {
			this._initializeModel();
			if (c && typeof c === "string") {
				S.personalize(p);
				S.updateConfigurationContextId(c);
				S.setSemanticObject(this.getSemanticObject());
				S.setIsBOMInitialLoad(true);
				S.setIsBOMExplosionPossible(true);
				E.fireContextChanged({
					contextId: c
				});
			} else {
				L.error("Invalid parameter.", "Context ID is mandatory in string format.", "sap.i2d.lo.lib.zvchclfz.components.structurepanel");
			}
		},
		isStructurePanelEnabled: function (p) {
			return S.isStructurePanelEnabled(p);
		},
		resetComponent: function () {
			E.fireResetStructurePanel();
		},
		setUiMode: function (u) {
			var e = u === C.uiMode.Create || u === C.uiMode.Edit;
			if (this.getUiMode() !== u) {
				this.setProperty("uiMode", u);
				S.setStructurePanelEditable(e);
				E.fireRedetermineStructureTreeColumnLayout();
			}
		},
		reexplodeBOM: function () {
			return new Promise(function (r) {
				if (S.getIsBOMExplosionPossible() || S.getIsMultiLevelScenario()) {
					var c = function () {
						r();
						E.detachStructureTreeRefreshed(c);
					};
					E.attachStructureTreeRefreshed(c);
					E.fireRefreshStructureTree();
				} else {
					r();
				}
			});
		},
		getRootBOMComponentPath: function () {
			return O.generateBOMNodePath(S.getConfigurationContextId(), a.getRootComponent().ComponentId);
		},
		setDescriptionMode: function (d) {
			var p = this.getProperty("descriptionMode");
			this.setProperty("descriptionMode", d);
			S.setDescriptionMode(d);
			if (p && p !== d) {
				E.fireDescriptionModeChanged();
			}
		},
		exit: function () {
			F.resetValues();
			O.destroy();
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/config/BOMColumnConfig', [
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/control/IconText",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/formatter/StructureTreeFormatter",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/StructurePanelModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/i18n", "sap/m/FormattedText", "sap/m/Label", "sap/m/Text", "sap/ui/core/Icon",
	"sap/ui/table/Column"
], function (I, S, C, a, i, F, L, T, b, c) {
	"use strict";
	var o = {
		idProductColumn: {
			columnKey: "idProductColumn",
			mandatory: true,
			getText: function () {
				return i.getText("vchclf_structpnl_tree_component_column_tt");
			},
			getColumn: function () {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Left,
					flexible: false,
					minWidth: 150,
					tooltip: "{i18n>vchclf_structpnl_tree_component_column_tt}",
					filterProperty: "Product",
					filterValue: "{ui>/productColumnFilterValue}",
					filtered: "{ui>/isProductColumnFiltered}",
					label: new L({
						text: "{i18n>vchclf_structpnl_tree_component_column_title}"
					}),
					template: new I({
						isGreyedOut: "{tree>IsExcludedItem}",
						isTextBold: "{tree>IsConfigurableItem}",
						text: {
							parts: [{
								path: "tree>BOMComponentName"
							}, {
								path: "tree>ProductName"
							}, {
								path: "ui>/descriptionMode"
							}],
							formatter: S.formatComponentName
						},
						firstIconURI: {
							path: "tree>Class",
							formatter: S.getBOMNodeIcon
						},
						firstIconTooltip: {
							path: "tree>Class",
							formatter: S.getBOMNodeIconTooltip
						}
					})
				});
			}
		},
		idConfigStatusColumn: {
			columnKey: "idConfigStatusColumn",
			defaultVisibility: true,
			defaultIndex: 0,
			defaultWidth: "2.5rem",
			_isAvailable: function () {
				return a.isStructurePanelEditable();
			},
			getText: function () {
				var t = i.getText("vchclf_structpnl_tree_status_column_tt");
				if (!this._isAvailable()) {
					t = i.getTextWithParameters("vchclf_structpnl_tree_column_unavailable_in_disp_mode", [t]);
				}
				return t;
			},
			getColumn: function () {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Center,
					resizable: false,
					visible: this._isAvailable(),
					tooltip: "{i18n>vchclf_structpnl_tree_status_column_tt}",
					label: new b({
						src: "sap-icon://accept",
						decorative: false,
						alt: "{i18n>vchclf_structpnl_tree_status_column_tt}"
					}),
					template: new b({
						alt: "{tree>to_ConfigurationInstance/ConfigurationValidationStatusDescription}",
						tooltip: "{tree>to_ConfigurationInstance/ConfigurationValidationStatusDescription}",
						decorative: false,
						src: {
							path: "tree>to_ConfigurationInstance/ConfigurationValidationStatus",
							formatter: S.formatConfigurationStatusSrc
						},
						color: {
							path: "tree>to_ConfigurationInstance/ConfigurationValidationStatus",
							formatter: S.formatConfigurationStatusColor
						}
					})
				});
			}
		},
		idFixedColumn: {
			columnKey: "idFixedColumn",
			defaultVisibility: true,
			defaultIndex: 1,
			defaultWidth: "2.5rem",
			_isAvailable: function () {
				return a.isETOColumnSetAvailable();
			},
			getText: function () {
				var t = i.getText("vchclf_structpnl_tree_fixed_column_tt");
				if (!this._isAvailable()) {
					if (a.getSemanticObject() === C.semanticObject.variantConfiguration) {
						t = i.getTextWithParameters("vchclf_structpnl_tree_column_unavailable_with_current_sim_context", [t]);
					} else {
						t = i.getTextWithParameters("vchclf_structpnl_tree_column_unavailable_in_current_app", [t]);
					}
				}
				return t;
			},
			getColumn: function () {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Center,
					resizable: false,
					visible: this._isAvailable(),
					tooltip: "{i18n>vchclf_structpnl_tree_fixed_column_tt}",
					label: new b({
						src: "sap-icon://pushpin-off",
						decorative: false,
						alt: "{i18n>vchclf_structpnl_tree_fixed_column_tt}"
					}),
					template: new b({
						alt: "{i18n>vchclf_structpnl_tree_fixed_column_tt}",
						tooltip: "{i18n>vchclf_structpnl_tree_fixed_column_tt}",
						src: "sap-icon://pushpin-off",
						visible: "{= ${tree>FixateState} === 'C'}"
					})
				});
			}
		},
		idPositionColumn: {
			columnKey: "idPositionColumn",
			defaultVisibility: true,
			defaultIndex: 2,
			defaultWidth: "3.5rem",
			getText: function () {
				return i.getText("vchclf_structpnl_tree_position_column_tt");
			},
			getColumn: function () {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Left,
					tooltip: "{i18n>vchclf_structpnl_tree_position_column_tt}",
					label: new L({
						text: "{i18n>vchclf_structpnl_tree_position_column_title}"
					}),
					template: new T({
						text: "{tree>ItemNumber}"
					})
				});
			}
		},
		idCategoryColumn: {
			columnKey: "idCategoryColumn",
			defaultVisibility: true,
			defaultIndex: 3,
			defaultWidth: "3rem",
			getText: function () {
				return i.getText("vchclf_structpnl_tree_category_column_tt");
			},
			getColumn: function () {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Left,
					resizable: false,
					tooltip: "{i18n>vchclf_structpnl_tree_category_column_tt}",
					label: new L({
						text: "{i18n>vchclf_structpnl_tree_category_column_title}"
					}),
					template: new T({
						text: "{tree>ItemCategory}"
					})
				});
			}
		},
		idQuantityColumn: {
			columnKey: "idQuantityColumn",
			defaultVisibility: true,
			defaultIndex: 4,
			defaultWidth: "6rem",
			getText: function () {
				return i.getText("vchclf_structpnl_tree_quantity_column_tt");
			},
			getColumn: function () {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Right,
					tooltip: "{i18n>vchclf_structpnl_tree_quantity_column_tt}",
					label: new L({
						text: "{i18n>vchclf_structpnl_tree_quantity_column_title}"
					}),
					template: new F({
						htmlText: {
							parts: [{
								path: "i18n>vchclf_structpnl_tree_quantity_content_qtyuom"
							}, {
								path: "tree>Quantity"
							}, {
								path: "tree>Unit"
							}],
							formatter: S.formatQtyWithUom
						}
					})
				});
			}
		},
		idRoutingColumn: {
			columnKey: "idRoutingColumn",
			defaultVisibility: true,
			defaultIndex: 5,
			defaultWidth: "2.5rem",
			_isAvailable: function () {
				return a.isRoutingAvailable() && !a.isBOMChangeAllowed();
			},
			getText: function () {
				var t = i.getText("vchclf_structpnl_tree_routing_column_tt");
				if (!this._isAvailable()) {
					if (a.getSemanticObject() === C.semanticObject.variantConfiguration) {
						t = i.getTextWithParameters("vchclf_structpnl_tree_column_unavailable_with_current_sim_context", [t]);
					} else {
						t = i.getTextWithParameters("vchclf_structpnl_tree_column_unavailable_in_current_app", [t]);
					}
				}
				return t;
			},
			getColumn: function (d) {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Center,
					resizable: false,
					visible: this._isAvailable(),
					tooltip: "{i18n>vchclf_structpnl_tree_routing_column_tt}",
					label: new b({
						src: "sap-icon://sys-first-page",
						decorative: false,
						alt: "{i18n>vchclf_structpnl_tree_routing_column_tt}"
					}),
					template: new b({
						alt: "{i18n>vchclf_structpnl_tree_routing_column_tt}",
						tooltip: "{i18n>vchclf_structpnl_tree_routing_column_tt}",
						src: "sap-icon://sys-first-page",
						press: d.onRoutingPressed.bind(d),
						visible: "{tree>HasRouting}"
					})
				});
			}
		},
		idDependenciesColumn: {
			columnKey: "idDependenciesColumn",
			defaultVisibility: true,
			defaultIndex: 6,
			defaultWidth: "2.5rem",
			getText: function () {
				return i.getText("vchclf_structpnl_tree_dependencies_column_tt");
			},
			getColumn: function (d) {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Center,
					resizable: false,
					tooltip: "{i18n>vchclf_structpnl_tree_dependencies_column_tt}",
					label: new b({
						src: "sap-icon://share-2",
						decorative: false,
						alt: "{i18n>vchclf_structpnl_tree_dependencies_column_tt}"
					}),
					template: new b({
						src: "sap-icon://share-2",
						tooltip: "{i18n>vchclf_structpnl_tree_dependencies_column_tt}",
						alt: "{i18n>vchclf_structpnl_tree_dependencies_column_tt}",
						press: d.onDependencyPressed.bind(d),
						visible: "{= ${tree>ObjectDependencyAssgmtNumber} !== '000000000000000000'}"
					})
				});
			}
		},
		idItemExternalIDColumn: {
			columnKey: "idItemExternalIDColumn",
			defaultVisibility: false,
			defaultWidth: "auto",
			getText: function () {
				return i.getText("vchclf_structpnl_tree_item_ext_id_column_tt");
			},
			getColumn: function () {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Left,
					tooltip: "{i18n>vchclf_structpnl_tree_item_ext_id_column_tt}",
					label: new L({
						text: "{i18n>vchclf_structpnl_tree_item_ext_id_column_title}"
					}),
					template: new T({
						text: "{tree>ItemExternalID}"
					})
				});
			}
		},
		idSortString: {
			columnKey: "idSortString",
			defaultVisibility: false,
			defaultWidth: "auto",
			getText: function () {
				return i.getText("vchclf_structpnl_tree_sort_string_column_tt");
			},
			getColumn: function () {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Left,
					tooltip: "{i18n>vchclf_structpnl_tree_sort_string_column_tt}",
					label: new L({
						text: "{i18n>vchclf_structpnl_tree_sort_string_column_title}"
					}),
					template: new T({
						text: "{tree>SortString}"
					})
				});
			}
		},
		idValidFromDate: {
			columnKey: "idValidFromDate",
			defaultVisibility: false,
			defaultWidth: "auto",
			getText: function () {
				return i.getText("vchclf_structpnl_tree_valid_from_column_tt");
			},
			getColumn: function () {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Right,
					tooltip: "{i18n>vchclf_structpnl_tree_valid_from_column_tt}",
					label: new L({
						text: "{i18n>vchclf_structpnl_tree_valid_from_column_title}"
					}),
					template: new T({
						text: {
							path: "tree>ValidFromDate",
							type: "sap.ui.model.type.Date",
							formatOptions: {
								style: "short"
							}
						}
					})
				});
			}
		},
		idChangeNumber: {
			columnKey: "idChangeNumber",
			defaultVisibility: false,
			defaultWidth: "auto",
			getText: function () {
				return i.getText("vchclf_structpnl_tree_change_number_column_tt");
			},
			getColumn: function () {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Left,
					tooltip: "{i18n>vchclf_structpnl_tree_change_number_column_tt}",
					label: new L({
						text: "{i18n>vchclf_structpnl_tree_change_num_column_title}"
					}),
					template: new T({
						text: "{tree>ChangeNumber}"
					})
				});
			}
		},
		idReferencePoint: {
			columnKey: "idReferencePoint",
			defaultVisibility: false,
			defaultWidth: "auto",
			getText: function () {
				return i.getText("vchclf_structpnl_tree_ref_point_column_tt");
			},
			getColumn: function () {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Left,
					tooltip: "{i18n>vchclf_structpnl_tree_ref_point_column_tt}",
					label: new L({
						text: "{i18n>vchclf_structpnl_tree_ref_point_column_title}"
					}),
					template: new T({
						text: "{tree>ReferencePoint}"
					})
				});
			}
		},
		idIsEngineeringRelevant: {
			columnKey: "idIsEngineeringRelevant",
			defaultVisibility: false,
			defaultWidth: "auto",
			getText: function () {
				return i.getText("vchclf_structpnl_tree_is_eng_relevant_column_tt");
			},
			getColumn: function () {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Left,
					tooltip: "{i18n>vchclf_structpnl_tree_is_eng_relevant_column_tt}",
					label: new L({
						text: "{i18n>vchclf_structpnl_tree_is_eng_relevant_column_title}"
					}),
					template: new T({
						text: "{tree>IsEngineeringRelevant}"
					})
				});
			}
		},
		idIsProductionRelevant: {
			columnKey: "idIsProductionRelevant",
			defaultVisibility: false,
			defaultWidth: "auto",
			getText: function () {
				return i.getText("vchclf_structpnl_tree_is_prod_relevant_column_tt");
			},
			getColumn: function () {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Left,
					tooltip: "{i18n>vchclf_structpnl_tree_is_prod_relevant_column_tt}",
					label: new L({
						text: "{i18n>vchclf_structpnl_tree_is_prod_relevant_column_title}"
					}),
					template: new T({
						text: "{tree>IsProductionRelevant}"
					})
				});
			}
		},
		idIsSparePart: {
			columnKey: "idIsSparePart",
			defaultVisibility: false,
			defaultWidth: "auto",
			getText: function () {
				return i.getText("vchclf_structpnl_tree_spare_part_column_tt");
			},
			getColumn: function () {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Left,
					tooltip: "{i18n>vchclf_structpnl_tree_spare_part_column_tt}",
					label: new L({
						text: "{i18n>vchclf_structpnl_tree_spare_part_column_title}"
					}),
					template: new T({
						text: "{tree>IsSparePart}"
					})
				});
			}
		},
		idIsSalesRelevant: {
			columnKey: "idIsSalesRelevant",
			defaultVisibility: false,
			defaultWidth: "auto",
			getText: function () {
				return i.getText("vchclf_structpnl_tree_sales_relevant_column_tt");
			},
			getColumn: function () {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Left,
					tooltip: "{i18n>vchclf_structpnl_tree_sales_relevant_column_tt}",
					label: new L({
						text: "{i18n>vchclf_structpnl_tree_sales_relevant_column_title}"
					}),
					template: new T({
						text: "{tree>IsSalesRelevant}"
					})
				});
			}
		},
		idIsCostingRelevant: {
			columnKey: "idIsCostingRelevant",
			defaultVisibility: false,
			defaultWidth: "auto",
			getText: function () {
				return i.getText("vchclf_structpnl_tree_cost_relevant_column_tt");
			},
			getColumn: function () {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Left,
					tooltip: "{i18n>vchclf_structpnl_tree_cost_relevant_column_tt}",
					label: new L({
						text: "{i18n>vchclf_structpnl_tree_cost_relevant_column_title}"
					}),
					template: new T({
						text: "{tree>IsCostingRelevant}"
					})
				});
			}
		},
		idBillOfMaterialComponent: {
			columnKey: "idBillOfMaterialComponent",
			defaultVisibility: false,
			defaultWidth: "auto",
			getText: function () {
				return i.getText("vchclf_structpnl_tree_component_column_tt");
			},
			getColumn: function () {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Left,
					tooltip: "{i18n>vchclf_structpnl_tree_component_column_tt}",
					label: new L({
						text: "{i18n>vchclf_structpnl_tree_component_column_title}"
					}),
					template: new T({
						text: "{tree>BillOfMaterialComponent}"
					})
				});
			}
		},
		idClassType: {
			columnKey: "idClassType",
			defaultVisibility: false,
			defaultWidth: "auto",
			getText: function () {
				return i.getText("vchclf_structpnl_tree_class_type_column_tt");
			},
			getColumn: function () {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Left,
					tooltip: "{i18n>vchclf_structpnl_tree_class_type_column_tt}",
					label: new L({
						text: "{i18n>vchclf_structpnl_tree_class_type_column_title}"
					}),
					template: new T({
						text: "{tree>ClassType}"
					})
				});
			}
		},
		idIsBulkMaterial: {
			columnKey: "idIsBulkMaterial",
			defaultVisibility: false,
			defaultWidth: "auto",
			getText: function () {
				return i.getText("vchclf_structpnl_tree_bulk_material_column_tt");
			},
			getColumn: function () {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Left,
					tooltip: "{i18n>vchclf_structpnl_tree_bulk_material_column_tt}",
					label: new L({
						text: "{i18n>vchclf_structpnl_tree_bulk_material_column_title}"
					}),
					template: new T({
						text: "{tree>IsBulkMaterial}"
					})
				});
			}
		},
		idIsPhantomItem: {
			columnKey: "idIsPhantomItem",
			defaultVisibility: false,
			defaultWidth: "auto",
			getText: function () {
				return i.getText("vchclf_structpnl_tree_phantom_column_tt");
			},
			getColumn: function () {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Left,
					tooltip: "{i18n>vchclf_structpnl_tree_phantom_column_tt}",
					label: new L({
						text: "{i18n>vchclf_structpnl_tree_phantom_column_title}"
					}),
					template: new T({
						text: "{tree>IsPhantomItem}"
					})
				});
			}
		},
		idExplosionType: {
			columnKey: "idExplosionType",
			defaultVisibility: false,
			defaultWidth: "auto",
			getText: function () {
				return i.getText("vchclf_structpnl_tree_explosion_type_column_tt");
			},
			getColumn: function () {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Left,
					tooltip: "{i18n>vchclf_structpnl_tree_explosion_type_column_tt}",
					label: new L({
						text: "{i18n>vchclf_structpnl_tree_explosion_type_column_title}"
					}),
					template: new T({
						text: "{tree>ExplosionType}"
					})
				});
			}
		},
		idItemSpecialProcurementType: {
			columnKey: "idItemSpecialProcurementType",
			defaultVisibility: false,
			defaultWidth: "auto",
			getText: function () {
				return i.getText("vchclf_structpnl_tree_proc_type_column_tt");
			},
			getColumn: function () {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Left,
					tooltip: "{i18n>vchclf_structpnl_tree_proc_type_column_tt}",
					label: new L({
						text: "{i18n>vchclf_structpnl_tree_proc_type_column_title}"
					}),
					template: new T({
						text: "{tree>ItemSpecialProcurementType}"
					})
				});
			}
		},
		idClass: {
			columnKey: "idClass",
			defaultVisibility: false,
			defaultWidth: "auto",
			getText: function () {
				return i.getText("vchclf_structpnl_tree_class_column_tt");
			},
			getColumn: function () {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Left,
					tooltip: "{i18n>vchclf_structpnl_tree_class_column_tt}",
					label: new L({
						text: "{i18n>vchclf_structpnl_tree_class_column_title}"
					}),
					template: new T({
						text: "{tree>Class}"
					})
				});
			}
		},
		idPurchasingOrganization: {
			columnKey: "idPurchasingOrganization",
			defaultVisibility: false,
			defaultWidth: "auto",
			getText: function () {
				return i.getText("vchclf_structpnl_tree_purchase_org_column_tt");
			},
			getColumn: function () {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Left,
					tooltip: "{i18n>vchclf_structpnl_tree_purchase_org_column_tt}",
					label: new L({
						text: "{i18n>vchclf_structpnl_tree_purchase_org_column_title}"
					}),
					template: new T({
						text: "{tree>PurchasingOrganization}"
					})
				});
			}
		},
		idPurchasingGroup: {
			columnKey: "idPurchasingGroup",
			defaultVisibility: false,
			defaultWidth: "auto",
			getText: function () {
				return i.getText("vchclf_structpnl_tree_purchase_group_column_tt");
			},
			getColumn: function () {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Left,
					tooltip: "{i18n>vchclf_structpnl_tree_purchase_group_column_tt}",
					label: new L({
						text: "{i18n>vchclf_structpnl_tree_purchase_group_column_title}"
					}),
					template: new T({
						text: "{tree>PurchasingGroup}"
					})
				});
			}
		},
		idSupplier: {
			columnKey: "idSupplier",
			defaultVisibility: false,
			defaultWidth: "auto",
			getText: function () {
				return i.getText("vchclf_structpnl_tree_supplier_column_tt");
			},
			getColumn: function () {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Left,
					tooltip: "{i18n>vchclf_structpnl_tree_supplier_column_tt}",
					label: new L({
						text: "{i18n>vchclf_structpnl_tree_supplier_column_title}"
					}),
					template: new T({
						text: "{tree>Supplier}"
					})
				});
			}
		},
		idProductGroup: {
			columnKey: "idProductGroup",
			defaultVisibility: false,
			defaultWidth: "auto",
			getText: function () {
				return i.getText("vchclf_structpnl_tree_product_group_column_tt");
			},
			getColumn: function () {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Left,
					tooltip: "{i18n>vchclf_structpnl_tree_product_group_column_tt}",
					label: new L({
						text: "{i18n>vchclf_structpnl_tree_product_group_column_title}"
					}),
					template: new T({
						text: "{tree>ProductGroup}"
					})
				});
			}
		},
		idDeliveryTimeInDays: {
			columnKey: "idDeliveryTimeInDays",
			defaultVisibility: false,
			defaultWidth: "auto",
			getText: function () {
				return i.getText("vchclf_structpnl_tree_delivery_in_days_column_tt");
			},
			getColumn: function () {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Right,
					tooltip: "{i18n>vchclf_structpnl_tree_delivery_in_days_column_tt}",
					label: new L({
						text: "{i18n>vchclf_structpnl_tree_delivery_in_days_column_title}"
					}),
					template: new T({
						text: "{tree>DeliveryTimeInDays}"
					})
				});
			}
		},
		idVarItemSize1: {
			columnKey: "idVarItemSize1",
			defaultVisibility: false,
			defaultWidth: "auto",
			getText: function () {
				return i.getText("vchclf_structpnl_tree_size_1_column_tt");
			},
			getColumn: function () {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Right,
					tooltip: "{i18n>vchclf_structpnl_tree_size_1_column_tt}",
					label: new L({
						text: "{i18n>vchclf_structpnl_tree_size_1_column_title}"
					}),
					template: new T({
						text: "{tree>VarItemSize1}"
					})
				});
			}
		},
		idVarItemSize2: {
			columnKey: "idVarItemSize2",
			defaultVisibility: false,
			defaultWidth: "auto",
			getText: function () {
				return i.getText("vchclf_structpnl_tree_size_2_column_tt");
			},
			getColumn: function () {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Right,
					tooltip: "{i18n>vchclf_structpnl_tree_size_2_column_tt}",
					label: new L({
						text: "{i18n>vchclf_structpnl_tree_size_2_column_title}"
					}),
					template: new T({
						text: "{tree>VarItemSize2}"
					})
				});
			}
		},
		idVarItemSize3: {
			columnKey: "idVarItemSize3",
			defaultVisibility: false,
			defaultWidth: "auto",
			getText: function () {
				return i.getText("vchclf_structpnl_tree_size_3_column_tt");
			},
			getColumn: function () {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Right,
					tooltip: "{i18n>vchclf_structpnl_tree_size_3_column_tt}",
					label: new L({
						text: "{i18n>vchclf_structpnl_tree_size_3_column_title}"
					}),
					template: new T({
						text: "{tree>VarItemSize3}"
					})
				});
			}
		},
		idVarItemFormula: {
			columnKey: "idVarItemFormula",
			defaultVisibility: false,
			defaultWidth: "auto",
			getText: function () {
				return i.getText("vchclf_structpnl_tree_formula_column_tt");
			},
			getColumn: function () {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Left,
					tooltip: "{i18n>vchclf_structpnl_tree_formula_column_tt}",
					label: new L({
						text: "{i18n>vchclf_structpnl_tree_formula_column_title}"
					}),
					template: new T({
						text: "{tree>VarItemFormula}"
					})
				});
			}
		},
		idVarItemQuantity: {
			columnKey: "idVarItemQuantity",
			defaultVisibility: false,
			defaultWidth: "auto",
			getText: function () {
				return i.getText("vchclf_structpnl_tree_var_quantity_column_tt");
			},
			getColumn: function () {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Right,
					tooltip: "{i18n>vchclf_structpnl_tree_var_quantity_column_tt}",
					label: new L({
						text: "{i18n>vchclf_structpnl_tree_var_quantity_column_title}"
					}),
					template: new F({
						htmlText: {
							parts: [{
								path: "i18n>vchclf_structpnl_tree_quantity_content_qtyuom"
							}, {
								path: "tree>VarItemQuantity"
							}, {
								path: "tree>VarItemUnit"
							}],
							formatter: S.formatQtyWithUom
						}
					})
				});
			}
		},
		idDocItemName: {
			columnKey: "idDocItemName",
			defaultVisibility: false,
			defaultWidth: "auto",
			getText: function () {
				return i.getText("vchclf_structpnl_tree_doc_name_column_tt");
			},
			getColumn: function () {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Left,
					tooltip: "{i18n>vchclf_structpnl_tree_doc_name_column_tt}",
					label: new L({
						text: "{i18n>vchclf_structpnl_tree_doc_name_column_title}"
					}),
					template: new T({
						text: "{tree>DocItemName}"
					})
				});
			}
		},
		idDocItemType: {
			columnKey: "idDocItemType",
			defaultVisibility: false,
			defaultWidth: "auto",
			getText: function () {
				return i.getText("vchclf_structpnl_tree_doc_type_column_tt");
			},
			getColumn: function () {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Left,
					tooltip: "{i18n>vchclf_structpnl_tree_doc_type_column_tt}",
					label: new L({
						text: "{i18n>vchclf_structpnl_tree_doc_type_column_title}"
					}),
					template: new T({
						text: "{tree>DocItemType}"
					})
				});
			}
		},
		idDocItemPart: {
			columnKey: "idDocItemPart",
			defaultVisibility: false,
			defaultWidth: "auto",
			getText: function () {
				return i.getText("vchclf_structpnl_tree_doc_part_column_tt");
			},
			getColumn: function () {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Left,
					tooltip: "{i18n>vchclf_structpnl_tree_doc_part_column_tt}",
					label: new L({
						text: "{i18n>vchclf_structpnl_tree_doc_part_column_title}"
					}),
					template: new T({
						text: "{tree>DocItemPart}"
					})
				});
			}
		},
		idDocItemVersion: {
			columnKey: "idDocItemVersion",
			defaultVisibility: false,
			defaultWidth: "auto",
			getText: function () {
				return i.getText("vchclf_structpnl_tree_doc_version_column_tt");
			},
			getColumn: function () {
				return new c({
					id: this.columnKey,
					hAlign: sap.ui.core.HorizontalAlign.Left,
					tooltip: "{i18n>vchclf_structpnl_tree_doc_version_column_tt}",
					label: new L({
						text: "{i18n>vchclf_structpnl_tree_doc_version_column_title}"
					}),
					template: new T({
						text: "{tree>DocItemVersion}"
					})
				});
			}
		}
	};
	return {
		getColumn: function (s, d) {
			return o[s].getColumn(d);
		},
		getMandatoryColumns: function () {
			var m = [];
			$.each(o, function (k, d) {
				if (d.mandatory) {
					m.push({
						columnKey: d.columnKey
					});
				}
			});
			return m;
		},
		getCustomizableColumns: function () {
			var d = [];
			$.each(o, function (k, e) {
				if (!e.mandatory) {
					d.push({
						columnKey: e.columnKey,
						text: e.getText()
					});
				}
			});
			return d;
		},
		getPersonalizationStateDefault: function () {
			return $.map(o, function (d) {
				return {
					columnKey: d.columnKey,
					visible: d.defaultVisibility,
					index: d.defaultIndex,
					width: d.defaultWidth
				};
			});
		}
	};
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/config/UiConfig', ["sap/ui/model/Filter"], function (F) {
	"use strict";
	var c = {
		views: {
			BillOfMaterial: "BOM",
			ConfigurableItems: "CONF"
		},
		viewConfig: {
			CONF: {
				title: "vchclf_structpnl_bomviewselector_configuration",
				getFilters: function () {
					return [new F({
						path: "IsConfigurableItem",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: true
					}), new F({
						path: "IsExcludedItem",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: false
					})];
				}
			},
			BOM: {
				title: "vchclf_structpnl_bomviewselector_bom",
				getFilters: function (i) {
					var f = [];
					if (!i) {
						f.push(new F({
							path: "IsExcludedItem",
							operator: sap.ui.model.FilterOperator.EQ,
							value1: false
						}));
					}
					return f;
				}
			}
		}
	};
	return c;
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/control/IconText', ["sap/m/FormattedText", "sap/m/HBox",
	"sap/ui/core/Control", "sap/ui/core/Icon"
], function (F, H, C, I) {
	"use strict";
	return C.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.control.IconText", {
		metadata: {
			properties: {
				isGreyedOut: {
					type: "Boolean",
					defaultValue: false
				},
				isTextBold: {
					type: "Boolean",
					defaultValue: false
				},
				text: {
					type: "String",
					defaultValue: ""
				},
				firstIconURI: {
					type: "URI",
					defaultValue: ""
				},
				firstIconTooltip: {
					type: "String",
					defaultValue: ""
				},
				secondIconURI: {
					type: "URI",
					defaultValue: ""
				},
				secondIconTooltip: {
					type: "String",
					defaultValue: ""
				}
			},
			aggregations: {
				_layout: {
					type: "sap.m.HBox",
					multiple: false,
					visibility: "hidden"
				}
			}
		},
		renderer: function (r, c) {
			c._renderControl(r);
		},
		_renderControl: function (r) {
			if (r) {
				this._generateControlContent();
				r.write("<div");
				r.writeControlData(this);
				r.write(">");
				r.renderControl(this.getAggregation("_layout"));
				r.write("</div>");
			}
		},
		_generateControlContent: function () {
			var f = this.getFirstIconURI();
			var s = this.getSecondIconURI();
			var t = this.getText();
			var i = [];
			if (f) {
				i.push(new I({
					src: f,
					tooltip: this.getFirstIconTooltip(),
					color: this.getIsGreyedOut() ? "lightgrey" : sap.ui.core.IconColor.Default
				}).addStyleClass("sapUiTinyMarginEnd"));
			}
			if (s) {
				i.push(new I({
					src: s,
					tooltip: this.getSecondIconTooltip(),
					color: this.getIsGreyedOut() ? "lightgrey" : sap.ui.core.IconColor.Default
				}).addStyleClass("sapUiTinyMarginEnd"));
			}
			if (t) {
				i.push(new F({
					htmlText: this._getHtmlText(t),
					tooltip: t
				}).addStyleClass("vchclfOverflowHiddenFormattedText"));
			}
			this.setAggregation("_layout", new H({
				items: i
			}));
		},
		_getHtmlText: function (t) {
			if (this.getIsTextBold() && !this.getIsGreyedOut()) {
				return "<h6><strong>" + t + "</strong></h6>";
			} else if (!this.getIsTextBold() && this.getIsGreyedOut()) {
				return "<h6><span style=\"color: lightgrey;\">" + t + "</span></h6>";
			} else if (this.getIsTextBold() && this.getIsGreyedOut()) {
				return "<h6><strong><span style=\"color: lightgrey;\">" + t + "</span></strong></h6>";
			} else {
				return "<h6>" + t + "</h6>";
			}
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/controller/MainFrame.controller', ["sap/ui/core/mvc/Controller",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/NavigationManager",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/StructurePanelModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/RoutingUtil"
], function (C, N, S, R) {
	"use strict";
	return C.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.controller.MainFrame", {
		onInit: function () {
			this.getView().setModel(S.getModel(), "ui");
			N.setMainContainer(this.byId("idStructurePanelNavContainer"));
			N.setOwnerComponent(this.getOwnerComponent());
			R.setOwnerComponent(this.getOwnerComponent());
		},
		onExit: function () {
			N.teardown();
			R.teardown();
			S.resetModel();
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/controller/RoutingFrame.controller', ["sap/ui/core/mvc/Controller",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/StructurePanelModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/NavigationManager",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/formatter/RoutingFrameFormatter",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/RoutingUtil",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/ODataModelHelper"
], function (C, S, N, F, R, O) {
	"use strict";
	return C.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.controller.RoutingFrame", {
		_formatters: F,
		onInit: function () {
			this.getView().setModel(S.getModel(), "ui");
			N.setRoutingTreeContainer(this.byId("idRoutingTreeNavContainer"));
		},
		onExit: function () {
			N.resetRoutingFrame();
		},
		onAfterNavigationTo: function (c, r, b, o) {
			S.setRoutingFrameCaller(c, r, b);
			N.resetRoutingFrame();
			N.addBaseRoutingTreePage(o);
		},
		onBackPressed: function () {
			N.navigateBack();
		},
		onRoutingTreeRefresh: function () {
			N.reexplodeRouting();
		},
		onClosePanelPressed: function () {
			this.getOwnerComponent().fireClosePanelPressed();
		},
		onShowSuperRoutingChanged: function () {
			N.reloadRouting();
		},
		onRoutingSelectionChanged: function (e) {
			var r = e.getParameter("selectedItem").getBindingContext("ui").getObject();
			var b = S.getRoutingFrameCallerBOMNode();
			var B = O.generateBOMNodePath(S.getConfigurationContextId(), b.ComponentId);
			var s = O.extendTheBOMNodePathWithRoutingKey(B, r);
			R.explodeRouting(s, b, r);
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/controller/RoutingTree.controller', ["sap/ui/core/mvc/Controller",
	"sap/i2d/lo/lib/zvchclfz/common/type/InspectorMode", "sap/i2d/lo/lib/zvchclfz/components/structurepanel/formatter/RoutingTreeFormatter",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/StructurePanelModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/ODataModelHelper", "sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/i18n",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/NavigationManager", "sap/m/MessageBox"
], function (C, I, R, a, S, O, i, N, M) {
	"use strict";
	return C.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.controller.RoutingTree", {
		_formatter: R,
		_routingModel: null,
		onInit: function () {
			this.getView().setModel(O.getModel());
		},
		setRoutingModel: function (r) {
			if (r) {
				this._routingModel = r;
				this.getView().setModel(this._routingModel.getModel(), "routingTree");
				this._expandRoutingTreeToModelDepth();
			}
		},
		onRowSelectionChange: function (e) {
			var t = e.getSource();
			if (t.getSelectedIndices().length === 0) {
				t.setSelectedIndex(e.getParameter("rowIndex"));
			}
		},
		_expandRoutingTreeToModelDepth: function () {
			if (this._routingModel && $.isFunction(this._routingModel.getTreeDepth)) {
				var t = this._routingModel.getTreeDepth();
				if (t > 0) {
					this.getView().byId("idRoutingTree").expandToLevel(t);
				}
			}
		},
		onExit: function () {
			if (this._routingModel && $.isFunction(this._routingModel.destroy)) {
				this._routingModel.destroy();
			}
		},
		onAfterNavigationTo: function () {
			if (this._routingModel && this._routingModel.isInvalidated()) {
				this.reloadRouting();
			}
		},
		clearRoutingTree: function () {
			if (this._routingModel) {
				this._routingModel.clearRoutingTree();
			}
		},
		getRoutingModelType: function () {
			if (this._routingModel && $.isFunction(this._routingModel.getType)) {
				return this._routingModel.getType();
			}
			return undefined;
		},
		invalidateRoutingTree: function () {
			if (this._routingModel) {
				this._routingModel.invalidate();
			}
		},
		explodeRouting: function () {
			if (this._routingModel && $.isFunction(this._routingModel.explodeRouting)) {
				S.setStructurePanelLoading(true);
				this._routingModel.explodeRouting(S.getRoutingFrameCallerBindingPath(), S.getConfigurationContextId(), S.getRoutingFrameCallerRoutingKey(),
					S.getRoutingFrameCallerBOMNode()).then(function (l) {
					this._routingReceivedGenericSuccessHandling(l);
				}.bind(this)).catch(function () {
					this._requestGenericErrorHandling();
				}.bind(this)).then(function () {
					this.getOwnerComponent().fireRoutingExplosionFinished();
				}.bind(this));
			}
		},
		reloadRouting: function () {
			if (this._routingModel && $.isFunction(this._routingModel.read)) {
				S.setStructurePanelLoading(true);
				this._routingModel.read(S.getRoutingFrameCallerBindingPath()).then(function (l) {
					this._routingReceivedGenericSuccessHandling(l);
				}.bind(this)).catch(function () {
					this._requestGenericErrorHandling();
				}.bind(this));
			}
		},
		onCellClicked: function (e) {
			var r = e.getParameter("rowBindingContext");
			if (r) {
				var b = r.getObject();
				if (e.getParameter("columnId").indexOf(a.treeTable.columns.id.routing) >= 0) {
					this._inspectItem(b, false);
					this._handleNavigation(b);
				}
			}
		},
		onDependencyPressed: function (e) {
			var b = e.getSource().getBindingContext("routingTree").getObject();
			this._inspectItem(b, true);
		},
		_inspectItem: function (b, c) {
			var o;
			switch (b.NodeType) {
			case a.routing.nodeType.operation:
				o = I.objectType.Operation;
				break;
			case a.routing.nodeType.subOperation:
				o = I.objectType.SubOperation;
				break;
			case a.routing.nodeType.refOperation:
				o = I.objectType.RefOperation;
				break;
			case a.routing.nodeType.refSubOperation:
				o = I.objectType.RefSubOperation;
				break;
			case a.routing.nodeType.parallelSequence:
				o = I.objectType.ParallelSequence;
				break;
			case a.routing.nodeType.alternativeSequence:
				o = I.objectType.AlternativeSequence;
				break;
			case a.routing.nodeType.standardSequence:
				o = I.objectType.RoutingHeader;
				break;
			default:
				break;
			}
			if (o) {
				var r = O.generateRoutingNodePath(S.getRoutingFrameCallerBindingPath(), b.TreeId, b.NodeId);
				var s = c ? I.inspectorTab.dependencies : null;
				this.getOwnerComponent().fireInspectObject({
					objectPath: r,
					objectType: o,
					inspectorTab: s
				});
			}
		},
		onNavigationPressed: function (e) {
			var b = e.getSource().getBindingContext("routingTree").getObject();
			this._handleNavigation(b);
		},
		_handleNavigation: function (r) {
			if (r && (r.BOOSequenceBranchOperation || r.BOOSequenceReturnOperation)) {
				switch (r.NodeType) {
				case a.routing.nodeType.parallelSequence:
				case a.routing.nodeType.alternativeSequence:
					N.addRoutingTreeSubPage(r);
					break;
				case a.routing.nodeType.operation:
				case a.routing.nodeType.subOperation:
					N.navigateBack();
					break;
				default:
					break;
				}
			}
		},
		_requestGenericErrorHandling: function () {
			M.error(i.getText("vchclf_structpnl_expl_routing_error"));
			S.setStructurePanelLoading(false);
			N.navigateToBOMFrame();
		},
		_routingReceivedGenericSuccessHandling: function (l) {
			S.setStructurePanelLoading(false);
			if (l === 0 && !N.isCurrentRoutingPageBase()) {
				M.warning(i.getText("vchclf_structpnl_expl_routing_sequence_not_part_of_exploded_routing"));
				N.backToTopOfRouting();
			} else if (l !== 0) {
				this._expandRoutingTreeToModelDepth();
			} else {
				this._requestGenericErrorHandling();
			}
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/controller/StructureFrame.controller', ["sap/ui/core/mvc/Controller",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/config/BOMColumnConfig",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/EventProvider",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/NavigationManager",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/StructurePanelModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/model/StructureTreeModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/i18n",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/StructureFrameETOHandler",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/TablePersonalization"
], function (C, B, E, N, S, a, i, b, T) {
	"use strict";
	return C.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.controller.StructureFrame", {
		_BOMViewSelectionPopover: null,
		_tablePersonalization: null,
		constructor: function () {
			C.prototype.constructor.apply(this, arguments);
			jQuery.extend(this, b);
		},
		onInit: function () {
			this.getView().setModel(S.getModel(), "ui");
			E.attachResetStructurePanel(N.resetFrame, N);
			E.attachStructureTreeColumnMoved(this.onStructureTreeColumnMoved, this);
			E.attachStructureTreeColumnFrozen(this.onStructureTreeColumnFrozen, this);
			E.attachStructureTreeColumnResized(this.onStructureTreeColumnResized, this);
			E.attachContextChanged(this.onContextChanged, this);
			E.attachRedetermineStructureTreeColumnLayout(this.onRedetermineTreeColumnLayout, this);
			this.getView().byId("idVariantManagement").setBackwardCompatibility();
		},
		onExit: function () {
			a.resetModel();
			E.detachResetStructurePanel(N.resetFrame, N);
			E.detachStructureTreeColumnMoved(this.onStructureTreeColumnMoved, this);
			E.detachStructureTreeColumnFrozen(this.onStructureTreeColumnFrozen, this);
			E.detachStructureTreeColumnResized(this.onStructureTreeColumnResized, this);
			E.detachContextChanged(this.onContextChanged, this);
			E.detachRedetermineStructureTreeColumnLayout(this.onRedetermineTreeColumnLayout, this);
			if (this._tablePersonalization) {
				this._tablePersonalization.destroy();
			}
		},
		onStructureTreeRefresh: function () {
			E.fireRefreshStructureTree();
		},
		onStructureTreeCollapseAllNodes: function () {
			E.fireCollapseAllNodesInStructureTree();
		},
		onStructureTreeExpandAllNodes: function () {
			E.fireExpandAllNodesInStructureTree();
		},
		onStructureTreeColumnMoved: function (e) {
			var m = B.getMandatoryColumns().length;
			this._tablePersonalization.moveColumn(e.getParameter("oldPos") - m, e.getParameter("newPos") - m);
			this._updateCurrentVariantSetModified();
			setTimeout(function () {
				this._updateColumnSettings();
			}.bind(this), 0);
		},
		onStructureTreeColumnFrozen: function (e) {
			this._tablePersonalization.setFixedColumnCount(e.getParameter("fixedColumnCount"));
			this._updateCurrentVariantSetModified();
		},
		onStructureTreeColumnResized: function (e) {
			this._tablePersonalization.setColumnWidth(e.getParameter("columnKey"), e.getParameter("width"));
			this._updateCurrentVariantSetModified();
		},
		onOpenTablePersonalizationDialog: function () {
			this._tablePersonalization.openSettingsDialog().then(function (r) {
				if (r.wasApplied) {
					this._updateColumnSettings();
					this._updateCurrentVariantSetModified();
				}
			}.bind(this));
		},
		onVariantManaged: function (e) {
			var p = e.getParameters();
			var o = S.getBOMColumnsVariant();
			o.defaultKey = p.def;
			$.each(p.renamed, function (I, A) {
				o.variantItems[A.key].name = A.name;
			});
			$.each(p.deleted, function (I, k) {
				delete o.variantItems[k];
			});
			S.setBOMColumnsVariant(o);
			this._updateBOMColumnsVariantPersonalization();
		},
		onVariantSaved: function (e) {
			var p = e.getParameters();
			var o = S.getBOMColumnsVariant();
			var c = this._tablePersonalization.getCurrentState();
			var A = sap.ushell && new sap.ushell.services.UserInfo().getId();
			if (p.def) {
				o.defaultKey = p.key;
			}
			o.variantItems[p.key] = {
				key: p.key,
				name: p.name,
				author: A,
				fixedColumnCount: c.fixedColumnCount,
				columnsItems: c.columnsItems
			};
			if (!p.overwrite && A) {
				e.getSource().getItemByKey(p.key).setAuthor(A);
			}
			S.setBOMColumnsVariant(o);
			this._tablePersonalization.updateInitialState(c);
			this._updateBOMColumnsVariantPersonalization();
		},
		onVariantSelected: function (e) {
			var v = S.getItemOfBOMColumnsVariant(e.getParameter("key"));
			this._tablePersonalization.updateInitialState(v ? {
				fixedColumnCount: v.fixedColumnCount,
				columnsItems: v.columnsItems
			} : {
				columnsItems: B.getPersonalizationStateDefault()
			});
			this._updateColumnSettings();
		},
		onBOMViewSelectionChange: function (e) {
			var v = e.getSource().getBindingContext("ui").getObject().key;
			if (this._BOMViewSelectionPopover) {
				this._BOMViewSelectionPopover.close();
			}
			if (S.getSelectedBOMView() !== v) {
				S.setSelectedBOMView(v);
				E.fireBOMViewSelectionChanged();
			}
		},
		onBOMViewSelectionTriggered: function (e) {
			if (!this._BOMViewSelectionPopover) {
				this._BOMViewSelectionPopover = new sap.m.Popover({
					title: i.getText("vchclf_structpnl_viewselector_title"),
					content: sap.ui.xmlfragment("sap.i2d.lo.lib.zvchclfz.components.structurepanel.fragment.BOMSelectorPopoverContent", this),
					placement: sap.m.PlacementType.Bottom
				});
				this.getView().addDependent(this._BOMViewSelectionPopover);
			}
			this._BOMViewSelectionPopover.openBy(e.getSource());
		},
		onClosePanelPressed: function () {
			this.getOwnerComponent().fireClosePanelPressed();
		},
		onShowSuperBOMChanged: function () {
			E.fireBOMViewSelectionChanged();
		},
		onContextChanged: function () {
			if (!this._tablePersonalization) {
				this._initTablePersonalization();
			} else {
				this.onRedetermineTreeColumnLayout();
			}
		},
		onRedetermineTreeColumnLayout: function () {
			if (this._tablePersonalization) {
				this._tablePersonalization.init(B.getCustomizableColumns(), this._tablePersonalization.getCurrentState());
				this._updateColumnSettings();
				E.fireUpdateStructureTreeColumnBinding();
			}
		},
		_initTablePersonalization: function () {
			this._getBOMColumnsVariantPersonalization().then(function (o) {
				var I = {};
				if (o && o.variantItems[o.defaultKey]) {
					var v = o.variantItems[o.defaultKey];
					I = {
						fixedColumnCount: v.fixedColumnCount,
						columnsItems: v.columnsItems
					};
					o.initialSelectionKey = o.defaultKey;
				} else {
					I = {
						columnsItems: B.getPersonalizationStateDefault()
					};
				}
				this._tablePersonalization = new T();
				this._tablePersonalization.init(B.getCustomizableColumns(), I);
				S.setBOMColumnsVariant(o);
				this._updateColumnSettings();
				E.fireUpdateStructureTreeColumnBinding();
			}.bind(this));
		},
		_getBOMColumnsVariantPersonalization: function () {
			return new Promise(function (r) {
				var p = this.getOwnerComponent().getPersonalizationDAO();
				if (p) {
					p.getData().then(function (P) {
						r(P.BOMColumnsVariant);
					});
				} else {
					r();
				}
			}.bind(this));
		},
		_updateBOMColumnsVariantPersonalization: function () {
			var p = this.getOwnerComponent().getPersonalizationDAO();
			if (p) {
				var o = S.getBOMColumnsVariant();
				p.setDataWithoutChangeEvent({
					BOMColumnsVariant: {
						defaultKey: o.defaultKey,
						variantItems: o.variantItems
					}
				});
			}
		},
		_updateColumnSettings: function () {
			S.setSelectedColumns(B.getMandatoryColumns().concat(this._tablePersonalization.getSelectedColumns()));
			S.setFixedColumnCount(this._tablePersonalization.getCurrentState().fixedColumnCount);
		},
		_updateCurrentVariantSetModified: function () {
			var v = this.getView().byId("idVariantManagement");
			if (!this._tablePersonalization.isColumnsItemsStateInitial()) {
				v.currentVariantSetModified(true);
			} else {
				v.currentVariantSetModified(false);
			}
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/controller/StructureTree.controller', [
	"sap/i2d/lo/lib/zvchclfz/common/type/DescriptionMode", "sap/i2d/lo/lib/zvchclfz/common/type/InspectorMode",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/config/BOMColumnConfig",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/dao/BOMNodeSetDAO",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/dialog/SelectRouting",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/formatter/StructureTreeFormatter",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/EventProvider",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/StructurePanelModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/model/StructureTreeModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/i18n", "sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/ODataModelHelper",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/RoutingUtil", "sap/m/MessageBox", "sap/ui/core/mvc/Controller",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/StructureTreeETOHandler", "sap/i2d/lo/lib/zvchclfz/common/factory/FactoryBase"
], function (D, I, B, a, S, F, C, E, b, c, d, O, R, M, e, f, g) {
	"use strict";
	return e.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.controller.StructureTree", {
		constructor: function () {
			e.prototype.constructor.apply(this, arguments);
			jQuery.extend(this, f);
		},
		_formatters: F,
		onInit: function () {
			var s = this.getView().byId("idStructureTree");
			this.getView().setModel(c.getModel(), "tree");
			E.attachContextChanged(this.onContextChanged, this);
			E.attachRefreshStructureTree(this._rebindStructure, this);
			E.attachExpandAllNodesInStructureTree(this.onExpandAllNodes, this);
			E.attachCollapseAllNodesInStructureTree(this.onCollapseAllNodes, this);
			E.attachBOMViewSelectionChanged(this._rebindStructureAfterBOMViewChange, this);
			E.attachResetStructurePanel(this.resetStructure, this);
			E.attachDescriptionModeChanged(this.onDescriptionModeChanged, this);
			E.attachUpdateStructureTreeColumnBinding(this.onUpdateStructureTreeColumnBinding, this);
			this._oFactoryBase = new g({
				controller: this
			});
			this.attachETOEvents();
			s.expandToLevel("1");
			s.attachFilter(function (o) {
				o.preventDefault();
			});
		},
		onExit: function () {
			E.detachContextChanged(this.onContextChanged, this);
			E.detachRefreshStructureTree(this._rebindStructure, this);
			E.detachExpandAllNodesInStructureTree(this.onExpandAllNodes, this);
			E.detachCollapseAllNodesInStructureTree(this.onCollapseAllNodes, this);
			E.detachBOMViewSelectionChanged(this._rebindStructureAfterBOMViewChange, this);
			E.detachResetStructurePanel(this.resetStructure, this);
			E.detachDescriptionModeChanged(this.onDescriptionModeChanged, this);
			E.detachUpdateStructureTreeColumnBinding(this.onUpdateStructureTreeColumnBinding, this);
			this.detachETOEvents();
		},
		onRowSelectionChange: function (o) {
			var t = o.getSource();
			if (t.getSelectedIndices().length === 0) {
				t.setSelectedIndex(o.getParameter("rowIndex"));
			} else {
				b.setCurrentlyFocusedBOMItem(o.getParameter("rowContext").getObject());
			}
		},
		onColumnMove: function (o) {
			E.fireStructureTreeColumnMoved({
				oldPos: o.getParameter("column").getIndex(),
				newPos: o.getParameter("newPos")
			});
		},
		onColumnFreeze: function (o) {
			var t = o.getSource();
			setTimeout(function () {
				E.fireStructureTreeColumnFrozen({
					fixedColumnCount: t.getFixedColumnCount()
				});
			}, 0);
		},
		onColumnResize: function (o) {
			E.fireStructureTreeColumnResized({
				columnKey: o.getParameter("column").getId(),
				width: o.getParameter("width")
			});
		},
		refreshAndExplodeBOMAsync: function () {
			return new Promise(function (r, h) {
				this._onBOMExplosion();
				c.explodeBOMWithoutUpdatingTheModel().then(function (i) {
					if (i) {
						c._refreshModelFromCache();
						r(i);
					} else {
						r(i);
					}
				}).catch(h);
			}.bind(this));
		},
		resetStructure: function () {
			c.resetModel();
			this._resetTreeTableColumns();
			b.setCurrentlyFocusedBOMItem();
			b.resetToBOMBaseView();
		},
		_resetTreeTableColumns: function () {
			var t = this.byId("idStructureTree");
			var o = t.getBinding();
			$.each(t.getColumns(), function (i, h) {
				h.setFiltered(false);
				h.setFilterValue();
				h.setSorted(false);
				h.setSortOrder();
			});
			o.aAllFilters = null;
			o.aSorters = null;
			o.aFilters = null;
			c.clearExtendedFilters();
		},
		_rebindStructure: function (o) {
			this._resetTreeTableColumns();
			this._explodeBOM();
			if (!b.getIsMultiLevelScenario()) {
				this.onCollapseAllNodes();
			}
		},
		_rebindStructureAfterBOMViewChange: function () {
			this._resetTreeTableColumns();
			if (b.isConfigurableItemViewSelected()) {
				this._selectRow(b.getCurrentlyLoadedBOMItemInValuation());
			}
			this._loadAllEntriesForStructureTree().then(this.onCollapseAllNodes.bind(this));
		},
		onBOMComponentNodeToggled: function (o) {
			if (o.getParameter("expanded")) {
				var h = o.getParameter("rowContext").getObject();
				this._loadAllEntriesForStructureTree(h);
			}
		},
		onContextChanged: function (o) {
			b.resetToBOMBaseView();
			a.resetExplosionPossibleIndicator();
			this._rebindStructure();
		},
		onCollapseAllNodes: function () {
			var t = this.byId("idStructureTree");
			if (t.isExpanded(0)) {
				t.collapseAll();
				t.expandToLevel("1");
			}
		},
		onExpandAllNodes: function () {
			this._loadAllForStructureTree();
		},
		onDescriptionModeChanged: function () {
			var p = c.getProductFilterText();
			if (p) {
				this._updateFilters(C.filterProperty.product, p);
			}
		},
		onFilteringTriggered: function (o) {
			var s = o.getParameter("column").getFilterProperty();
			var v = o.getParameter("value");
			if (s === C.filterProperty.product) {
				b.setProductColumnFilterValue(v);
			}
			this._updateFilters(s, v);
		},
		onDependencyPressed: function (o) {
			var h = o.getSource().getBindingContext("tree").getObject();
			this._handleDependencyColumnPress(h);
		},
		onReferenceCharacteristicPressed: function (o) {
			var h = o.getSource().getBindingContext("tree").getObject();
			this._handleReferenceCharacteristicColumnPress(h);
		},
		onRoutingPressed: function (o) {
			var h = o.getSource().getBindingContext("tree").getObject();
			this._handleRoutingColumnPress(h);
		},
		onUpdateStructureTreeColumnBinding: function () {
			this.getView().byId("idStructureTree").bindColumns("ui>/selectedColumns", function (i, o) {
				var h = B.getColumn(o.getObject().columnKey, this);
				h.bindProperty("width", "ui>width");
				return h;
			}.bind(this));
		},
		_handleReferenceCharacteristicColumnPress: function (o) {
			var h = this._getConfigurationInstanceForBOMItem(o) || {};
			this.getOwnerComponent().fireReferenceCharacteristicSelected({
				path: O.generateConfigurationInstancePath(h) || "",
				oConfigurationInstance: h
			});
		},
		_handleProductColumnPress: function (o) {
			this._inspectBOMComponent(o);
			if (o.IsConfigurableItem && b.getIsMultiLevelScenario() && o.ComponentId !== b.getCurrentlyLoadedBOMItemInValuation().ComponentId) {
				if (this._isBOMExplodable()) {
					this.getOwnerComponent().fireConfigurableItemSelectionChanged();
					this._asyncUpdateBOMAndFocusInstance();
				} else {
					this._selectInstanceInValuation(o);
				}
			}
		},
		_asyncUpdateBOMAndFocusInstance: function () {
			if (this._isBOMExplodable()) {
				b.setStructurePanelLoading(true);
				this.refreshAndExplodeBOMAsync().then(function (m) {
					var i = b.getCurrentlyFocusedBOMItem();
					var o = m ? c.getBOMComponent(i) : i;
					if (!o || !this._isConfigurableItem(o) || this._isConfigurableAndExcludedItem(o) || !this._isItemValidForValuation(o)) {
						if (i) {
							this._showWarningMessageForInvalidItemForValuation(o, i);
						}
						o = c.getRootComponent();
						this._selectRow(0);
					} else if (m) {
						this._selectRow(o);
					}
					if (m) {
						this._collapseAllDownloadingNodes();
					}
					this._selectInstanceInValuation(o);
					this._onAfterBOMExplosion();
					b.setStructurePanelLoading(false);
					E.fireStructureTreeRefreshed();
				}.bind(this)).catch(this._bomExplosionRequestErrorHandling.bind(this));
			}
		},
		_showWarningMessageForInvalidItemForValuation: function (o, h) {
			if (!o && h) {
				this._showWarningMessage(d.getText("vchclf_structpnl_config_item_not_available_title"), d.getTextWithParameters(
					"vchclf_structpnl_config_item_not_available_info", [h.BOMComponentName]));
			} else if (this._isConfigurableAndExcludedItem(o)) {
				if (!this._isConfigurableAndExcludedItem(h)) {
					this._showWarningMessage(d.getText("vchclf_structpnl_config_item_excluded_title"), d.getTextWithParameters(
						"vchclf_structpnl_config_item_excluded_info", [o.BOMComponentName]));
				}
			} else if (this._isConfigurableItem(o) && !this._isItemValidForValuation(o)) {
				this._showWarningMessage(d.getText("vchclf_structpnl_config_item_not_validated_title"), d.getTextWithParameters(
					"vchclf_structpnl_config_item_not_validated_info", [o.BOMComponentName]));
			}
		},
		_showWarningMessage: function (t, i) {
			sap.m.MessageBox.show(i, {
				icon: sap.m.MessageBox.Icon.WARNING,
				title: t
			});
		},
		_onAfterBOMExplosion: function () {
			if (this.getOwnerComponent()) {
				this.getOwnerComponent().fireBOMExplosionFinished();
			}
		},
		_onBOMExplosion: function () {
			if (this.getOwnerComponent()) {
				this.getOwnerComponent().fireBOMExplosionTriggered({
					isMultiLevel: b.getIsMultiLevelScenario()
				});
			}
		},
		_isConfigurableItem: function (o) {
			return o.IsConfigurableItem;
		},
		_isConfigurableAndExcludedItem: function (o) {
			return o.IsConfigurableItem && o.IsExcludedItem;
		},
		_isItemValidForValuation: function (o) {
			var h = this._getConfigurationInstanceForBOMItem(o);
			if (h && h.ConfigurationValidationStatus) {
				switch (h.ConfigurationValidationStatus) {
				case C.configurationInstance.validationStatus.ValidatedAndReleased:
				case C.configurationInstance.validationStatus.ValidatedAndIncomplete:
				case C.configurationInstance.validationStatus.InconsistencyDetected:
				case C.configurationInstance.validationStatus.ProcessedButUnknown:
					return true;
				case C.configurationInstance.validationStatus.NotValidate:
					return false;
				default:
					return false;
				}
			} else {
				return false;
			}
		},
		_getConfigurationInstanceForBOMItem: function (o) {
			if (o && o[C.navigationProperty.ConfigurationInstance.name]) {
				return o[C.navigationProperty.ConfigurationInstance.name];
			} else {
				return null;
			}
		},
		_selectInstanceInValuation: function (o) {
			var h = this._getConfigurationInstanceForBOMItem(o);
			var i = this.getOwnerComponent();
			if (h && i) {
				i.fireConfigurableItemSelected({
					path: O.generateConfigurationInstancePath(h),
					oConfigurationInstance: h
				});
				b.setCurrentlyLoadedBOMItemInValuation(o);
			}
		},
		_selectFocusedBOMItem: function () {
			if (b.getCurrentlyFocusedBOMItem()) {
				this._selectRow(b.getCurrentlyFocusedBOMItem());
			}
		},
		_selectRow: function (r) {
			var t = this.getView().byId("idStructureTree");
			if (t) {
				t.clearSelection();
				if ($.isNumeric(r)) {
					t.setSelectedIndex(r);
				} else if (!$.isEmptyObject(r)) {
					$.each(t.getRows(), function (i, o) {
						var h = o.getBindingContext("tree") && o.getBindingContext("tree").getObject();
						if (h && h.ComponentId === r.ComponentId) {
							t.setSelectedIndex(o.getIndex());
							return false;
						}
						return true;
					});
				}
			}
		},
		_handleRoutingColumnPress: function (o) {
			var s = O.generateBOMNodePath(b.getConfigurationContextId(), o.ComponentId);
			b.resetAvailableRoutings();
			if (o.NumberOfRoutings === 1) {
				this._getRoutingKey(s);
				R.explodeRouting(s, o, {});
			} else {
				S.open(s).then(function (r) {
					if (r) {
						var h = O.extendTheBOMNodePathWithRoutingKey(s, r);
						b.setSelectedRouting(r.BillOfOperationsGroup, r.BillOfOperationsVariant);
						R.explodeRouting(h, o, r);
					}
				}).catch(function () {
					M.error(d.getText("vchclf_structpnl_expl_routing_error"));
				});
			}
		},
		_getRoutingKey: function (s) {
			a.getRoutings(s).then(function (r) {
				b.setRoutings(r);
			});
		},
		_handleDependencyColumnPress: function (o) {
			this.getOwnerComponent().fireInspectObject({
				objectPath: O.generateBOMNodePath(b.getConfigurationContextId(), o.ComponentId),
				objectType: I.objectType.BOMComponent,
				inspectorTab: I.inspectorTab.dependencies
			});
		},
		onCellClicked: function (o) {
			var r = o.getParameter("rowBindingContext");
			if (r) {
				var h = r.getObject();
				if (!c.isDownloadingNode(h)) {
					if (o.getParameter("columnId").indexOf(C.treeTable.columns.id.product) >= 0) {
						this._handleProductColumnPress(h);
					}
				}
			}
		},
		_loadAllEntriesForStructureTree: function (o) {
			b.setStructurePanelLoading(true);
			return c.loadEntries(o).then(function () {
				b.setStructurePanelLoading(false);
				this._selectFocusedBOMItem();
				this._collapseAllDownloadingNodes();
			}.bind(this)).catch(this._requestGenericErrorHandling.bind(this));
		},
		_explodeBOM: function () {
			if (this._isBOMExplodable()) {
				if (b.getIsMultiLevelScenario()) {
					this._asyncUpdateBOMAndFocusInstance();
				} else {
					b.setStructurePanelLoading(true);
					this._onBOMExplosion();
					c.explodeBOM().then(function () {
						b.setStructurePanelLoading(false);
						this._onAfterBOMExplosion();
						this._collapseAllDownloadingNodes();
						b.setCurrentlyLoadedBOMItemInValuation(c.getRootComponent());
						this._selectRow(0);
						E.fireStructureTreeRefreshed();
					}.bind(this)).catch(this._bomExplosionRequestErrorHandling.bind(this));
				}
			} else {
				this._loadAllEntriesForStructureTree().then(function () {
					b.setCurrentlyLoadedBOMItemInValuation(c.getRootComponent());
					this._selectRow(0);
					E.fireStructureTreeRefreshed();
				}.bind(this));
			}
		},
		_loadAllForStructureTree: function () {
			b.setStructurePanelLoading(true);
			c.loadAll().then(function () {
				this.byId("idStructureTree").expandToLevel(c.getModel().getProperty("/treeDepth"));
				b.setStructurePanelLoading(false);
				this._selectFocusedBOMItem();
				this._collapseAllDownloadingNodes();
			}.bind(this)).catch(this._requestGenericErrorHandling.bind(this));
		},
		_requestGenericErrorHandling: function (o) {
			if (o && o.message) {
				M.error(o.message);
			}
			b.setStructurePanelLoading(false);
		},
		_bomExplosionRequestErrorHandling: function (o) {
			if (o && o.explosionPossible === C.BOMExplosionNotAssigned) {
				this.getOwnerComponent().fireNavigationToBOMCanNotBeFound();
				b.setStructurePanelLoading(false);
			} else {
				this._requestGenericErrorHandling(o);
			}
		},
		_collapseAllDownloadingNodes: function () {
			return new Promise(function (r) {
				var t = this.getView().byId("idStructureTree");
				if (t) {
					var h = [],
						T = t.getRows(),
						o = {};
					$.each(T, function (i, j) {
						var k = j.getBindingContext("tree") && j.getBindingContext("tree").getObject();
						if (k) {
							o[k.ComponentId] = j.getIndex();
							if (c.isDownloadingNode(k)) {
								var p = o[k.parentComponent.ComponentId];
								h.push(p);
							}
						}
					});
					if (h.length > 0) {
						t.collapse(h);
					}
				}
				r();
			}.bind(this));
		},
		_updateFilters: function (p, v) {
			c.clearExtendedFilters();
			if (p === C.filterProperty.product) {
				c.setProductFilterText(v);
			}
			if (p && v) {
				var h;
				switch (p) {
				case C.filterProperty.product:
					h = this._getProductFilter(v);
					break;
				default:
					h = [new sap.ui.model.Filter({
						path: p,
						operator: sap.ui.model.FilterOperator.Contains,
						value1: v
					})];
					break;
				}
				c.addFilters(h);
				this._loadAllForStructureTree();
			} else {
				this._loadAllEntriesForStructureTree().then(this.onCollapseAllNodes.bind(this));
			}
		},
		_getProductFilter: function (v) {
			switch (b.getDescriptionMode()) {
			case D.Description:
				return [new sap.ui.model.Filter({
					path: "ProductName",
					operator: sap.ui.model.FilterOperator.Contains,
					value1: v
				})];
			case D.TechnicalName:
				return [new sap.ui.model.Filter({
					path: "BOMComponentName",
					operator: sap.ui.model.FilterOperator.Contains,
					value1: v
				})];
			case D.Both:
				return [new sap.ui.model.Filter({
					path: "ProductName",
					operator: sap.ui.model.FilterOperator.Contains,
					value1: v
				}), new sap.ui.model.Filter({
					path: "BOMComponentName",
					operator: sap.ui.model.FilterOperator.Contains,
					value1: v
				})];
			default:
				return [];
			}
		},
		_isBOMExplodable: function () {
			return b.isStructurePanelEditable();
		},
		_valuateAndFocusOnRootComponent: function () {
			this._selectInstanceInValuation(c.getRootComponent());
			b.setCurrentlyFocusedBOMItem(c.getRootComponent());
			this._selectRow(0);
		},
		_inspectBOMComponent: function (o) {
			this.getOwnerComponent().fireInspectObject({
				objectPath: O.generateBOMNodePath(b.getConfigurationContextId(), o.ComponentId),
				objectType: I.objectType.BOMComponent
			});
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/dao/BOMNodeSetDAO', ["sap/i2d/lo/lib/zvchclfz/common/util/RequestQueue",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/StructurePanelModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/i18n", "sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/ODataModelHelper",
	"sap/base/Log", "sap/ui/base/ManagedObject"
], function (R, C, S, i, O, L, M) {
	"use strict";
	var B = M.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.dao.BOMNodeSetDAO", {
		_explosionPossible: undefined,
		_getErrorMessage: function (e) {
			var I = C.explosion.error[e];
			if (I) {
				return i.getText(I);
			} else {
				L.error("Unable to find error code.", "Error code was not recognized as a valid entry.",
					"sap.i2d.lo.lib.zvchclfz.components.structurepanel.dao.BOMNodeSetDAO");
				return null;
			}
		},
		_returnErrorMessageInPromise: function () {
			return Promise.reject({
				message: this._getErrorMessage(this._explosionPossible),
				explosionPossible: this._explosionPossible
			});
		},
		resetExplosionPossibleIndicator: function () {
			this._explosionPossible = undefined;
		},
		explodeBOM: function (c, f, b, I) {
			if (this._explosionPossible === undefined || this._explosionPossible === C.explosion.possible || S.getIsMultiLevelScenario()) {
				this.resetExplosionPossibleIndicator();
				return R.add(this._explodeBOM.bind(this, c, f, b, I), this);
			} else {
				return this._returnErrorMessageInPromise();
			}
		},
		_explodeBOM: function (c, f, b, I) {
			return new Promise(function (r, a) {
				O.getModel().facadeCallFunction("/" + C.functionImport.ExplodeBOM, {
					ContextId: c,
					IsInitialLoad: !!I
				}, C.bomChangeSetId).catch(a);
				this._readBOMNodes(c, f, b).then(function (d) {
					r(d);
				}).catch(a);
			}.bind(this));
		},
		readBOMNodes: function (c, f, b) {
			if (this._explosionPossible === undefined || this._explosionPossible === C.explosion.possible) {
				return R.add(this._readBOMNodes.bind(this, c, f, b), this);
			} else {
				return this._returnErrorMessageInPromise();
			}
		},
		_readBOMNodes: function (c, f, b) {
			return new Promise(function (r, a) {
				var m = O.getModel();
				var s = m.createKey(C.entitySet.ConfigurationContextSet, {
					ContextId: c
				});
				var u = b ? {
					"$expand": C.navigationProperty.ConfigurationInstance.name
				} : {};
				m.facadeRead("/" + s + "/" + C.navigationProperty.BOMNodes, u, undefined, f).then(function (d) {
					if ($.isArray(d.results) && d.results.length > 0) {
						if (this._explosionPossible === undefined) {
							this._explosionPossible = d.results[0].IsBOMExplosionPossible;
							S.setIsBOMExplosionPossible(this._explosionPossible === C.explosion.possible);
						}
						r(d.results);
					} else {
						L.error("Cannot find any BOM node.", "At least one node should be returned in every cases.",
							"sap.i2d.lo.lib.zvchclfz.components.structurepanel.dao.BOMNodeSetDAO");
						a();
					}
				}.bind(this)).catch(function () {
					a();
				});
			}.bind(this));
		},
		getRoutings: function (b) {
			return R.add(this._getRoutings.bind(this, b), this);
		},
		_getRoutings: function (b) {
			return new Promise(function (r, f) {
				O.getModel().facadeRead(b + "/" + C.navigationProperty.Routings).then(function (d) {
					r(d.results);
				}).catch(f);
			});
		}
	});
	return new B();
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/dao/RoutingNodeSetDAO', [
	"sap/i2d/lo/lib/zvchclfz/common/util/RequestQueue", "sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/ODataModelHelper", "sap/ui/base/ManagedObject"
], function (R, C, O, M) {
	"use strict";
	var a = M.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.dao.RoutingNodeSetDAO", {
		read: function (p, f) {
			return R.add(this._read.bind(this, p, f), this);
		},
		_read: function (p, f) {
			return new Promise(function (r, b) {
				O.getModel().facadeRead(p + "/" + C.navigationProperty.RoutingNodes, undefined, undefined, f).then(function (d) {
					r(d.results);
				}).catch(b);
			});
		},
		explodeRouting: function (p, c, r, b, f) {
			return R.add(this._explodeRouting.bind(this, p, c, r, b, f), this);
		},
		_explodeRouting: function (p, c, r, b, f) {
			return new Promise(function (d, e) {
				O.getModel().facadeCallFunction("/" + C.functionImport.ExplodeRouting, {
					ContextId: c,
					ReferenceInstanceId: b.ReferenceInstanceId,
					Product: b.Product,
					BOMComponentId: b.ComponentId,
					BillOfOperationsType: r.BillOfOperationsType || "",
					BillOfOperationsGroup: r.BillOfOperationsGroup || "",
					BillOfOperationsVariant: r.BillOfOperationsVariant || ""
				}, C.routingChangeSetId).catch(e);
				this._read(p, f).then(d).catch(e);
			}.bind(this));
		}
	});
	return new a();
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/dialog/BOMItemBaseVH', ["sap/ui/base/ManagedObject",
	"sap/ui/model/json/JSONModel", "sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants", "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator", "sap/ui/comp/filterbar/FilterGroupItem", "sap/m/Input", "sap/m/ColumnListItem", "sap/m/Label",
	"sap/m/SearchField", "sap/ui/base/Event"
], function (M, J, C, F, a, b, I, c, L, S, E) {
	"use strict";
	return M.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.BOMItemBaseVH", {
		metadata: {
			properties: {
				controller: {
					type: "sap.ui.core.mvc.Controller"
				},
				control: {
					type: "object"
				},
				source: {
					type: "sap.ui.core.Control",
					defaultValue: {}
				}
			}
		},
		_filterTable: function (f) {
			var v = this.getControl();
			v.getTable().setBusy(true);
			v.getTableAsync().then(function (t) {
				if (t.bindRows) {
					t.getBinding("rows").filter(f);
				}
				if (t.bindItems) {
					t.getBinding("items").filter(f);
				}
				v.update();
			});
		},
		setSource: function (s) {
			this.setProperty("source", s);
			if (s && s.getValue) {
				this.getControl().setBasicSearchText(s.getValue());
			}
		},
		close: function (e) {
			this.getControl().close();
		},
		onOk: function (e) {
			throw Error("This abstract method has not yet been implemented in the child object.");
		},
		onSubmit: function (e) {
			var f = this.getControl().getFilterBar().getFilterGroupItems();
			var s = [];
			f.forEach(function (o) {
				s.push(o.getControl());
			});
			var n = new E("submit", this, {
				selectionSet: s
			});
			jQuery.extend(true, n, e);
			this.onSearch(n);
		},
		onCancel: function (e) {
			this.close();
		},
		onAfterClose: function (e) {
			this.getControl().destroy();
		},
		createFilterGroupItems: function (i, o) {
			var f = o.getObject();
			var d = new I({
				id: i + "-" + f.template + "--filter",
				showValueHelp: false,
				submit: this.onSubmit.bind(this),
				name: f.template
			});
			this._oFilterGroupItem = new b({
				groupName: "BOMItemFilterGroup",
				name: f.template,
				label: f.label,
				visibleInFilterBar: true
			});
			this._oFilterGroupItem.setControl(d);
			return this._oFilterGroupItem;
		},
		onSearch: function (e) {
			var s = e.getParameter("selectionSet");
			var f = s.reduce(function (r, o) {
				if (o.getValue()) {
					r.push(new F({
						path: o.getName(),
						operator: a.EQ,
						value1: o.getValue()
					}));
				}
				return r;
			}, []);
			if (f.length > 0) {
				f = [new F({
					filters: f,
					and: true
				})];
			}
			var d = this.getControl().getFilterBar().getBasicSearchValue();
			if (d || f.length === 0) {
				var g = [];
				var h = a.Contains;
				var A = d.indexOf("*");
				var i = d.lastIndexOf("*") + 1;
				var j = A === 0;
				var k = i === d.length;
				if (j || k) {
					if (j) {
						h = a.EndsWith;
					} else if (k) {
						h = a.StartsWith;
					} else if (j && k) {
						h = a.Contains;
					}
					d = d.split('*').join("");
				}
				s.forEach(function (o) {
					g.push(new F({
						path: o.getName(),
						operator: h,
						value1: d
					}));
				});
				f.push(new F({
					filters: g
				}));
			}
			this._filterTable(new F({
				filters: f,
				and: true
			}));
		},
		setControl: function (o) {
			o._oBasicSearchField = new S("BOMItemBaseSearch", {
				search: this.onSubmit.bind(this)
			});
			o.getFilterBar().setBasicSearch(o._oBasicSearchField);
			this._oBOMItemVHDialogConfigModel = new J();
			this._oColumnModel = new J();
			o.setModel(this._oBOMItemVHDialogConfigModel, C.BOMItemVHDialogModelName);
			this.setProperty("control", o);
		},
		bindTable: function (p) {
			var d = this.getControl();
			d.getTableAsync().then(function (t) {
				t.setModel(this._oColumnModel, "columns");
				if (t.bindRows) {
					t.bindAggregation("rows", {
						path: p,
						events: {
							dataReceived: function () {
								d.setBusy(false);
							},
							change: function () {
								t.setBusy(false);
							}
						}
					});
				}
				if (t.bindItems) {
					t.bindAggregation("items", p, function () {
						return new c({
							cells: this._oColumnModel.getProperty("/filters").map(function (e) {
								return new L({
									text: "{" + e.template + "}"
								});
							})
						});
					});
				}
				d.update();
			}.bind(this));
		}
	});
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/dialog/BOMItemDialog', ["sap/ui/base/ManagedObject",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/BOMItemActions",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/StructurePanelModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/model/StructureTreeModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants", "sap/i2d/lo/lib/zvchclfz/common/factory/FactoryBase",
	"sap/ui/core/ValueState", "sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/i18n", "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator", "sap/ui/base/Event", "sap/ui/model/Sorter"
], function (M, B, S, a, C, F, V, b, c, d, E, e) {
	"use strict";
	var f = "sap/i2d/lo/lib/zvchclfz/components/structurepanel/config/BOMItemDialogConfig.json";
	var g = "sap.i2d.lo.lib.zvchclfz.components.structurepanel.fragment.BOMItemBaseVHDialog";
	var h = "sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.BOMItemProductVH";
	var j = "sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.BOMItemUoMVH";
	var k = "sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.BOMItemDocumentBaseVH";
	var l = "sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.BOMItemFormulaVH";
	var m = "sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.BOMItemVariableUoMVH";
	return M.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.BOMItemDialog", {
		metadata: {
			properties: {
				controller: {
					type: "sap.ui.core.mvc.Controller"
				},
				control: {
					type: "object"
				}
			}
		},
		_getBOMItemUiControl: function (i) {
			return this.getController().byId(i);
		},
		_getSelectedFixedItemCategory: function () {
			return this._getBOMItemUiControl("BOMItemCategory").getSelectedItem().getBindingContext(C.BOMItemDialogModel).getObject().FixedItemCategory;
		},
		_getSelectedBOMItemCategory: function () {
			return this._getBOMItemUiControl("BOMItemCategory").getSelectedItem().getBindingContext(C.BOMItemDialogModel).getObject().BillOfMaterialItemCategory;
		},
		_filterEntityByPath: function (v, p, s) {
			var o = new c({
				path: p,
				operator: d.EQ,
				value1: v
			});
			return this.getController().getView().getModel().facadeRead(s, null, null, [o]);
		},
		_validateField: function (o) {
			var i = o.getSource();
			var n = i.getValue();
			var p = o.getParameters();
			this._bChangeTriggered = true;
			if (!n || n === " ") {
				i.setValueState(V.None);
			} else {
				i.setBusyIndicatorDelay(0);
				i.setBusy(true);
				if (!p.entity || !p.path) {
					i.setValueState(V.None);
					i.setBusy(false);
					return;
				}
				this._filterEntityByPath(n, p.path, p.entity).then(function (D) {
					i.setBusy(false);
					if (D.results.length > 0) {
						if (D.results[0][p.path] === n) {
							i.setValueState(V.None);
						} else {
							i.setValueState(V.Error);
						}
					} else {
						i.setValueState(V.Error);
					}
				}).catch(function (q) {
					i.setBusy(false);
					i.setValueState(V.Error);
					i.focus();
				});
			}
		},
		_isFormValid: function (s) {
			var v = true;
			var n = [];
			this._aBOMItemDialogConfig.forEach(function (p) {
				if (p.fixedItemCagetory === s) {
					n = p.mandatoryFields;
				}
			});
			for (var i = 0; i < n.length; i++) {
				var o = this._getBOMItemUiControl(n[i]);
				if (o.getValueState() === V.Error) {
					v = false;
					o.focus();
					break;
				}
				if (!o.getValue()) {
					v = false;
					o.focus();
					o.setValueState(V.Error);
					break;
				}
			}
			return v;
		},
		_resetValidationForAllFields: function () {
			this._oBOMItemDialogConfigPromise.then(function () {
				this._aBOMItemDialogConfig.forEach(function (o) {
					if (o.mandatoryFields) {
						o.mandatoryFields.forEach(function (s) {
							this._getBOMItemUiControl(s).setValueState(V.None);
						}.bind(this));
					}
				}.bind(this));
			}.bind(this));
		},
		_suggest: function (p, s, i) {
			var o = new c({
				path: p,
				operator: d.Contains,
				value1: i.toUpperCase()
			});
			var n = this.getControl();
			this.getController().getView().getModel().facadeRead(s, {
				"$skip": 0,
				"$top": 30
			}, null, [o]).then(function (D) {
				if (this._bChangeTriggered) {
					this._bChangeTriggered = false;
					return;
				}
				n.getModel(C.BOMItemDialogVHModel).setProperty(s, D.results);
			}.bind(this));
		},
		_resetModel: function (s, D) {
			if (!s) {
				throw Error("Please provide a valid model name");
			}
			D = D || {};
			this.getControl().getModel(s).setData(D);
		},
		_openBOMItemVHDialog: function (s, o) {
			if (this._oBOMItemVHDialog) {
				this._oBOMItemVHDialog.destroy();
				this._oBOMItemVHDialog.getController().destroy();
				delete this._oBOMItemVHDialog;
			}
			var v = this.getController().getView();
			var i = this.getControl();
			var n = true;
			this._oBOMItemVHDialog = this._oFactoryBase.createFragment(v.getId(), g, s, n);
			v.addDependent(this._oBOMItemVHDialog);
			this.getControl().addDependent(this._oBOMItemVHDialog);
			this._oBOMItemVHDialog.setModel(i.getModel(C.ODataModelName));
			this._oBOMItemVHDialog.getController().setSource(o.getSource());
			this._oBOMItemVHDialog.setModel(i.getModel(C.BOMItemDialogModel), C.BOMItemDialogModel);
			this._oBOMItemVHDialog.open();
		},
		init: function () {
			this._oFactoryBase = new F({
				controller: this
			});
			this._oBOMItemDialogConfigPromise = new Promise(function (r, R) {
				if (!this._aBOMItemDialogConfig) {
					var s = sap.ui.require.toUrl(f);
					$.ajax({
						url: s
					}).done(function (o) {
						this._aBOMItemDialogConfig = o;
						r();
					}.bind(this));
				} else {
					r();
				}
			}.bind(this));
		},
		onOk: function () {
			var o = this.getControl();
			var D = o.getModel("SelectedBOMItem").getData();
			var i = o.getModel("BOMItemDialog");
			D.ItemCategory = i.getData().SelectedItemKey;
			this._oBOMItemDialogConfigPromise.then(function () {
				if (!this._isFormValid(D.ItemCategory || D.FixedItemCategory)) {
					return;
				}
				if (i.getProperty("/IsBOMItemInsert")) {
					this.getController().insertBOMItem(D);
					o.close();
				} else {
					this.getController().updateBOMItem(D);
					o.close();
				}
			}.bind(this));
		},
		onCancel: function () {
			if (this.getControl()) {
				this.getControl().close();
			}
		},
		getDialogTitle: function (s, i, n) {
			if (B.Insert === s) {
				return i;
			} else if (B.Change === s) {
				return n;
			} else {
				return "";
			}
		},
		getBOMItemCategoryOfCurrentSelection: function () {
			return S.getCurrentlyFocusedBOMItem().ItemCategoryDescription;
		},
		onItemCategoryChange: function (o) {
			var D = this.getControl();
			var i = D.getModel(C.BOMItemDialogModel);
			var s = o.getParameter("selectedItem").getBindingContext(C.BOMItemDialogModel).getProperty("FixedItemCategory");
			var n = i.getProperty("/SelectedBOMItemCategory");
			var p = {
				ContextId: S.getConfigurationContextId(),
				InstanceId: S.getCurrentlyFocusedBOMItem().InstanceId.trim()
			};
			for (var q in n) {
				if (q === s) {
					n[q] = true;
					if (s === C.FixedBOMItemCategory.TEXT_ITEM || s === C.FixedBOMItemCategory.DOCUMENT_ITEM) {
						p.Quantity = "1";
						p.Unit = "PC";
					}
					if (s === C.FixedBOMItemCategory.VARIABLE_SIZE_ITEM) {
						p.Unit = a.getRootComponent().Unit;
					}
				} else {
					n[q] = false;
				}
			}
			this._resetModel(C.SelectedBOMItem, p);
			this._resetValidationForAllFields();
		},
		onDocumentValueHelpPressed: function (o) {
			this._openBOMItemVHDialog(k, o);
		},
		onBOMMaterialVHPressed: function (o) {
			this._openBOMItemVHDialog(h, o);
		},
		onBOMFormulaVHPressed: function (o) {
			this._openBOMItemVHDialog(l, o);
		},
		onUoMValueHelpPressed: function (o) {
			this._openBOMItemVHDialog(j, o);
		},
		onVarUoMValueHelpPressed: function (o) {
			this._openBOMItemVHDialog(m, o);
		},
		onProductSuggest: function (o) {
			this._suggest("Material", "/C_VarConfignProductPlantVH", o.getParameter("suggestValue"));
		},
		onDocumentSuggest: function (o) {
			this._suggest("DocumentInfoRecordDocNumber", "/I_DocumentInfoRecordDocPrtVH", o.getParameter("suggestValue"));
		},
		onFormulaSuggest: function (o) {
			this._suggest("VariableSizeCompFormulaKey", "/I_BillOfMaterialFormulaVH", o.getParameter("suggestValue"));
		},
		onUoMSuggest: function (o) {
			this._suggest("UnitOfMeasure", "/I_UnitOfMeasureStdVH", o.getParameter("suggestValue"));
		},
		onChange: function (o) {
			var n = new E("valueChange", this, {});
			jQuery.extend(true, n, o);
			this._oBOMItemDialogConfigPromise.then(function () {
				this._validateField(n);
			}.bind(this));
		},
		onProductChange: function (o) {
			var n = new E("productChange", this, {
				path: "Material",
				entity: "/C_VarConfignProductPlantVH"
			});
			jQuery.extend(true, n, o);
			var N = n.getParameter("newValue").toUpperCase();
			n.getSource().setValue(N);
			this._oBOMItemDialogConfigPromise.then(function () {
				this._validateField(n);
			}.bind(this));
		},
		onUoMChange: function (o) {
			var n = new E("uomChange", this, {
				path: "UnitOfMeasure",
				entity: "/I_UnitOfMeasureStdVH"
			});
			jQuery.extend(true, n, o);
			this._oBOMItemDialogConfigPromise.then(function () {
				this._validateField(n);
			}.bind(this));
		},
		onDocumentChange: function (o) {
			var n = new E("documentChange", this, {
				path: "DocumentInfoRecordDocNumber",
				entity: "/I_DocumentInfoRecordDocPrtVH"
			});
			jQuery.extend(true, n, o);
			this._oBOMItemDialogConfigPromise.then(function () {
				this._validateField(n);
			}.bind(this));
		},
		onDocumentTypeChange: function (o) {
			var n = new E("documentChange", this, {
				path: "DocumentInfoRecordDocType",
				entity: "/I_DocumentInfoRecordDocPrtVH"
			});
			jQuery.extend(true, n, o);
			this._oBOMItemDialogConfigPromise.then(function () {
				this._validateField(n);
			}.bind(this));
		},
		onDocumentVersionChange: function (o) {
			var n = new E("documentChange", this, {
				path: "DocumentInfoRecordDocVersion",
				entity: "/I_DocumentInfoRecordDocPrtVH"
			});
			jQuery.extend(true, n, o);
			this._oBOMItemDialogConfigPromise.then(function () {
				this._validateField(n);
			}.bind(this));
		},
		onDocumentPartChange: function (o) {
			var n = new E("documentChange", this, {
				path: "DocumentInfoRecordDocPart",
				entity: "/I_DocumentInfoRecordDocPrtVH"
			});
			jQuery.extend(true, n, o);
			this._oBOMItemDialogConfigPromise.then(function () {
				this._validateField(n);
			}.bind(this));
		},
		onFormulaChange: function (o) {
			var n = new E("formulaKeyChange", this, {
				path: "VariableSizeCompFormulaKey",
				entity: "/I_BillOfMaterialFormulaVH"
			});
			jQuery.extend(true, n, o);
			var N = n.getParameter("newValue").toUpperCase();
			n.getSource().setValue(N);
			this._oBOMItemDialogConfigPromise.then(function () {
				this._validateField(n);
			}.bind(this));
		}
	});
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/dialog/BOMItemDocumentBaseVH', [
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/dialog/BOMItemBaseVH",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants", "sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/i18n",
	"sap/ui/core/ValueState"
], function (B, C, i, V) {
	"use strict";
	var d = {
		"name": "DocumentInfoRecordDocNumber",
		"version": "DocumentInfoRecordDocVersion",
		"part": "DocumentInfoRecordDocPart",
		"type": "DocumentInfoRecordDocType"
	};
	var c = [{
		"label": i.getText("vchclf_structpnl_bom_item_document"),
		"template": d.name
	}, {
		"label": i.getText("vchclf_structpnl_bom_item_document_version"),
		"template": d.version
	}, {
		"label": i.getText("vchclf_structpnl_bom_item_document_type"),
		"template": d.type
	}, {
		"label": i.getText("vchclf_structpnl_bom_item_document_part"),
		"template": d.part
	}];
	return B.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.BOMItemDocumentBaseVH", {
		metadata: {
			properties: {}
		},
		setControl: function () {
			B.prototype.setControl.apply(this, arguments);
			this._oBOMItemVHDialogConfigModel.setData({
				key: "DocumentInfoRecordDocNumber",
				descriptionKey: "DocumentDescription",
				title: i.getText("vchclf_structpnl_bom_document_vh_title"),
				filters: c
			});
			this._oColumnModel.setData({
				"cols": c
			});
			this.bindTable("/I_DocumentInfoRecordDocPrtVH");
		},
		onOk: function (e) {
			var b = this.getControl().getModel(C.SelectedBOMItem);
			var t = e.getSource().getTable();
			var s = t.getSelectedIndex();
			var r = t.getRows();
			var S = {};
			r.forEach(function (R) {
				if (R.getIndex() === s) {
					S = R;
				}
			});
			var a = S.getCells();
			a.forEach(function (o) {
				var p = o.getBinding("text").getPath();
				switch (p) {
				case d.name:
					b.setProperty("/DocItemName", o.getText());
					break;
				case d.part:
					b.setProperty("/DocItemPart", o.getText());
					break;
				case d.version:
					b.setProperty("/DocItemVersion", o.getText());
					break;
				case d.type:
					b.setProperty("/DocItemType", o.getText());
					break;
				}
			});
			this.getSource().setValueState(V.None);
			this.close();
		}
	});
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/dialog/BOMItemFormulaVH', [
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/dialog/BOMItemBaseVH",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants", "sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/i18n",
	"sap/ui/core/ValueState"
], function (B, C, i, V) {
	"use strict";
	var c = [{
		"label": i.getText("vchclf_structpnl_bom_formula_key_vh_label"),
		"template": "VariableSizeCompFormulaKey"
	}, {
		"label": i.getText("vchclf_structpnl_bom_formula_vh_label"),
		"template": "VariableSizeCompFormula"
	}, {
		"label": i.getText("vchclf_structpnl_bom_formula_description_vh_label"),
		"template": "VariableSizeCompFormulaText"
	}];
	return B.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.BOMItemFormulaVH", {
		metadata: {
			properties: {}
		},
		setControl: function (o) {
			B.prototype.setControl.apply(this, arguments);
			this._oBOMItemVHDialogConfigModel.setData({
				key: "VariableSizeCompFormulaKey",
				descriptionKey: "VariableSizeCompFormulaText",
				title: i.getText("vchclf_structpnl_bom_formula_vh_title"),
				filters: c
			});
			this._oColumnModel.setData({
				"cols": c
			});
			this.bindTable("/I_BillOfMaterialFormulaVH");
		},
		onOk: function (e) {
			var b = this.getControl().getModel(C.SelectedBOMItem);
			b.setProperty("/VarItemFormula", e.getParameter("tokens")[0].getKey().toUpperCase());
			this.getSource().setValueState(V.None);
			this.close();
		}
	});
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/dialog/BOMItemProductVH', [
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/dialog/BOMItemBaseVH",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants", "sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/i18n",
	"sap/ui/core/ValueState"
], function (B, C, i, V) {
	"use strict";
	var c = [{
		"label": i.getText("vchclf_structpnl_bom_product_vh_label"),
		"template": "Material"
	}, {
		"label": i.getText("vchclf_structpnl_bom_product_description_vh_label"),
		"template": "MaterialDescription"
	}, {
		"label": i.getText("vchclf_structpnl_bom_plant_vh_label"),
		"template": "Plant"
	}];
	return B.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.BOMItemProductVH", {
		metadata: {
			properties: {}
		},
		setControl: function (o) {
			B.prototype.setControl.apply(this, arguments);
			this._oBOMItemVHDialogConfigModel.setData({
				key: "Material",
				descriptionKey: "MaterialDescription",
				title: i.getText("vchclf_structpnl_bom_product_vh_title"),
				filters: c
			});
			this._oColumnModel.setData({
				"cols": c
			});
			this.bindTable("/C_VarConfignProductPlantVH");
		},
		onOk: function (e) {
			var b = this.getControl().getModel(C.SelectedBOMItem);
			b.setProperty("/BOMComponentName", e.getParameter("tokens")[0].getKey().toUpperCase());
			this.getSource().setValueState(V.None);
			this.close();
		}
	});
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/dialog/BOMItemUoMVH', [
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/dialog/BOMItemBaseVH",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants", "sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/i18n",
	"sap/ui/core/ValueState"
], function (B, C, i, V) {
	"use strict";
	var c = [{
		"label": i.getText("vchclf_structpnl_bom_uom_vh_label"),
		"template": "UnitOfMeasure"
	}, {
		"label": i.getText("vchclf_structpnl_bom_uom_description_vh_label"),
		"template": "UnitOfMeasureLongName"
	}];
	return B.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.BOMItemUoMVH", {
		metadata: {
			properties: {}
		},
		setControl: function (o) {
			B.prototype.setControl.apply(this, arguments);
			this._oBOMItemVHDialogConfigModel.setData({
				key: "UnitOfMeasure",
				descriptionKey: "UnitOfMeasureLongName",
				title: i.getText("vchclf_structpnl_bom_uom_vh_title"),
				filters: c
			});
			this._oColumnModel.setData({
				"cols": c
			});
			this.bindTable("/I_UnitOfMeasureStdVH");
		},
		onOk: function (e) {
			var b = this.getControl().getModel(C.SelectedBOMItem);
			b.setProperty("/Unit", e.getParameter("tokens")[0].getKey().toUpperCase());
			this.getSource().setValueState(V.None);
			this.close();
		}
	});
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/dialog/BOMItemVariableUoMVH', [
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/dialog/BOMItemUoMVH",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants", "sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/i18n",
	"sap/ui/core/ValueState"
], function (B, C, i, V) {
	"use strict";
	return B.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.BOMItemVariableUoMVH", {
		metadata: {
			properties: {}
		},
		onOk: function (e) {
			var b = this.getControl().getModel(C.SelectedBOMItem);
			b.setProperty("/VarItemUnit", e.getParameter("tokens")[0].getKey().toUpperCase());
			this.getSource().setValueState(V.None);
			this.close();
		}
	});
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/dialog/SelectRouting', [
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/dao/BOMNodeSetDAO",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/formatter/RoutingFrameFormatter",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/StructurePanelModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/i18n", "sap/ui/base/ManagedObject", "sap/ui/model/json/JSONModel"
], function (B, R, S, i, M, J) {
	"use strict";
	var a = M.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.SelectRouting", {
		_dialog: null,
		_formatter: R,
		_resolve: null,
		_reject: null,
		_uiModel: null,
		open: function (b) {
			this._bindRoutings(b);
			return new Promise(function (r, c) {
				this._resolve = r;
				this._reject = c;
			}.bind(this));
		},
		onAfterDialogClose: function () {
			this._dialog.destroy();
			this._dialog = null;
		},
		onCancelButtonPressed: function () {
			this._dialog.close();
			this._resolve();
		},
		onRoutingSelected: function (e) {
			var c = e.getSource().getBindingContext("ui");
			this._dialog.close();
			this._resolve({
				BillOfOperationsType: c.getProperty("BillOfOperationsType"),
				BillOfOperationsGroup: c.getProperty("BillOfOperationsGroup"),
				BillOfOperationsVariant: c.getProperty("BillOfOperationsVariant")
			});
		},
		_bindRoutings: function (b) {
			S.setStructurePanelLoading(true);
			B.getRoutings(b).then(function (r) {
				if (!this._dialog) {
					this._dialog = sap.ui.xmlfragment("sap.i2d.lo.lib.zvchclfz.components.structurepanel.fragment.SelectRouting", this);
				}
				this._initModel(r);
				S.setRoutings(r);
				S.setStructurePanelLoading(false);
				this._dialog.open();
			}.bind(this)).catch(function () {
				S.setStructurePanelLoading(false);
				this._reject();
			}.bind(this));
		},
		_initModel: function (r) {
			this._uiModel = new J({
				routings: r
			});
			this._dialog.setModel(i.getModel(), "i18n");
			this._dialog.setModel(this._uiModel, "ui");
		}
	});
	return new a();
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/formatter/RoutingFrameFormatter', [
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/i18n",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/StructurePanelModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/RoutingSelectionUtil"
], function (i, S, R) {
	"use strict";
	return {
		formatRoutingHeaderProduct: function (r) {
			return i.getTextWithParameters("vchclf_structpnl_routing_header_desc", [r]);
		},
		formatRoutingKey: function (b, B) {
			return b + " / " + B;
		},
		formatRoutingSelection: function (r, b, B) {
			return i.getTextWithParameters("vchclf_structpnl_multiple_routing_select", [r, b, B]);
		},
		formatSelectedRoutingTooltip: function (s) {
			if (s !== "") {
				var r = $.grep(S.getAvailableRoutings(), function (e) {
					return R.getConcatenatedRoutingKey(e.BillOfOperationsGroup, e.BillOfOperationsVariant) === s;
				});
				if (r.length >= 1) {
					return i.getTextWithParameters("vchclf_structpnl_multiple_routing_select", [r[0].Description, r[0].BillOfOperationsGroup, r[0].BillOfOperationsVariant]);
				} else {
					return "";
				}
			} else {
				return "";
			}
		},
		formatRoutingSelectionKey: function (b, B) {
			return R.getConcatenatedRoutingKey(b, B);
		}
	};
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/formatter/RoutingTreeFormatter', [
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants", "sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/i18n"
], function (C, i) {
	"use strict";
	return {
		getNodeTypeIcon: function (n) {
			switch (n) {
			case C.routing.nodeType.routingHeader:
				return "sap-icon://begin";
			case C.routing.nodeType.standardSequence:
				return "sap-icon://BusinessSuiteInAppSymbols/icon-main-sequence";
			case C.routing.nodeType.parallelSequence:
				return "sap-icon://BusinessSuiteInAppSymbols/icon-parallel-sequence";
			case C.routing.nodeType.alternativeSequence:
				return "sap-icon://BusinessSuiteInAppSymbols/icon-alternative-sequence";
			case C.routing.nodeType.operation:
				return "sap-icon://circle-task-2";
			case C.routing.nodeType.subOperation:
				return "sap-icon://circle-task";
			case C.routing.nodeType.refOperation:
				return "sap-icon://mirrored-task-circle-2";
			case C.routing.nodeType.refSubOperation:
				return "sap-icon://mirrored-task-circle";
			default:
				return "";
			}
		},
		getNodeTypeTooltip: function (n) {
			switch (n) {
			case C.routing.nodeType.routingHeader:
				return i.getText("vchclf_structpnl_routing_tree_routing_header_tt");
			case C.routing.nodeType.standardSequence:
				return i.getText("vchclf_structpnl_routing_tree_standard_sequence_tt");
			case C.routing.nodeType.parallelSequence:
				return i.getText("vchclf_structpnl_routing_tree_parallel_sequence_tt");
			case C.routing.nodeType.alternativeSequence:
				return i.getText("vchclf_structpnl_routing_tree_alternative_sequence_tt");
			case C.routing.nodeType.operation:
				return i.getText("vchclf_structpnl_routing_tree_operation_tt");
			case C.routing.nodeType.subOperation:
				return i.getText("vchclf_structpnl_routing_tree_suboperation_tt");
			case C.routing.nodeType.refOperation:
				return i.getText("vchclf_structpnl_routing_tree_refoperation_tt");
			case C.routing.nodeType.refSubOperation:
				return i.getText("vchclf_structpnl_routing_tree_refsuboperation_tt");
			default:
				return "";
			}
		},
		getNodeBranchReturnIcon: function (b, r) {
			if (b) {
				return "sap-icon://arrow-right";
			} else if (r) {
				return "sap-icon://arrow-left";
			} else {
				return "";
			}
		},
		getNodeBranchReturnTooltip: function (b, r) {
			if (b) {
				return i.getText("vchclf_structpnl_routing_tree_branch_operation_tt");
			} else if (r) {
				return i.getText("vchclf_structpnl_routing_tree_return_operation_tt");
			} else {
				return "";
			}
		},
		returnObjDepIconVisibility: function (o) {
			return o !== C.intialObjectDependencyAssgmtNumber;
		},
		getDescription: function (n, b, B, s, a, d) {
			if (d) {
				switch (n) {
				case C.routing.nodeType.operation:
				case C.routing.nodeType.subOperation:
				case C.routing.nodeType.refOperation:
				case C.routing.nodeType.refSubOperation:
					return i.getTextWithParameters("vchclf_structpnl_routing_tree_operation_with_number", [a, d]);
				case C.routing.nodeType.standardSequence:
				case C.routing.nodeType.parallelSequence:
				case C.routing.nodeType.alternativeSequence:
					return i.getTextWithParameters("vchclf_structpnl_format_text_id_description", [d, B]);
				default:
					return d;
				}
			}
			switch (n) {
			case C.routing.nodeType.routingHeader:
				return i.getTextWithParameters("vchclf_structpnl_routing_tree_routing_header_desc", [b]);
			case C.routing.nodeType.standardSequence:
				return i.getTextWithParameters("vchclf_structpnl_routing_tree_std_sequence_desc", [B]);
			case C.routing.nodeType.parallelSequence:
				return i.getTextWithParameters("vchclf_structpnl_routing_tree_par_sequence_desc", [B]);
			case C.routing.nodeType.alternativeSequence:
				return i.getTextWithParameters("vchclf_structpnl_routing_tree_alt_sequence_desc", [B]);
			case C.routing.nodeType.operation:
			case C.routing.nodeType.subOperation:
			case C.routing.nodeType.refOperation:
			case C.routing.nodeType.refSubOperation:
				return i.getTextWithParameters("vchclf_structpnl_routing_tree_operation_with_number", [a, s]);
			default:
				return "";
			}
		},
		checkRoutingNavigationVisibility: function (b, B) {
			if (b || B) {
				return true;
			} else {
				return false;
			}
		}
	};
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/formatter/StructureTreeFormatter', [
	"sap/i2d/lo/lib/zvchclfz/common/type/DescriptionMode", "sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/i18n", "sap/base/strings/formatMessage", "sap/ui/core/format/NumberFormat"
], function (D, C, i, f, N) {
	"use strict";
	return {
		formatQtyWithUom: function (I, q, u) {
			var Q = N.getFloatInstance();
			return "<h6>" + f(I, [Q.format(parseFloat(q)), u]) + "</h6>";
		},
		formatComponentName: function (t, d, s) {
			if (!t) {
				return d;
			}
			switch (s) {
			case D.Description:
				return d ? d : t;
			case D.TechnicalName:
				return t;
			case D.Both:
				return d ? i.getTextWithParameters("vchclf_structpnl_format_text_id_description", [d, t]) : t;
			default:
				return t;
			}
		},
		formatConfigurationStatusSrc: function (c) {
			switch (c) {
			case C.configurationInstance.validationStatus.ValidatedAndReleased:
				return "sap-icon://accept";
			case C.configurationInstance.validationStatus.ValidatedAndIncomplete:
				return "sap-icon://alert";
			case C.configurationInstance.validationStatus.NotValidate:
				return undefined;
			case C.configurationInstance.validationStatus.ProcessedButUnknown:
				return "sap-icon://incident";
			case C.configurationInstance.validationStatus.InconsistencyDetected:
				return "sap-icon://error";
			default:
				return undefined;
			}
		},
		formatConfigurationStatusColor: function (c) {
			switch (c) {
			case C.configurationInstance.validationStatus.ValidatedAndReleased:
				return sap.ui.core.IconColor.Positive;
			case C.configurationInstance.validationStatus.ValidatedAndIncomplete:
				return sap.ui.core.IconColor.Critical;
			case C.configurationInstance.validationStatus.NotValidate:
				return sap.ui.core.IconColor.Default;
			case C.configurationInstance.validationStatus.InconsistencyDetected:
				return sap.ui.core.IconColor.Negative;
			case C.configurationInstance.validationStatus.ProcessedButUnknown:
				return sap.ui.core.IconColor.Default;
			default:
				return sap.ui.core.IconColor.Default;
			}
		},
		getBOMNodeIcon: function (c) {
			return c ? "sap-icon://BusinessSuiteInAppSymbols/icon-distribute-segments" : "";
		},
		getBOMNodeIconTooltip: function (c) {
			return c ? i.getText("vchclf_structpnl_tree_class_node_tt") : "";
		}
	};
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants', [], function () {
	"use strict";
	return {
		semanticObject: {
			variantConfiguration: "VariantConfiguration"
		},
		standardSequenceTreeId: "000000",
		defaultRoutingRootNodeId: "0_0",
		bomChangeSetId: "vch-bom-changeset",
		routingChangeSetId: "vch-routing-changeset",
		intialObjectDependencyAssgmtNumber: "000000000000000000",
		filterProperty: {
			product: "Product"
		},
		itemCategory: {
			classNode: "K"
		},
		drillDownState: {
			leaf: "leaf",
			expanded: "expanded"
		},
		httpMethod: {
			post: "POST"
		},
		functionImport: {
			ExplodeBOM: "ExplodeBOM",
			ExplodeRouting: "ExplodeRouting"
		},
		entitySet: {
			BOMNodeSet: "BOMNodeSet",
			ConfigurationContextSet: "ConfigurationContextSet",
			ConfigurationInstanceSet: "ConfigurationInstanceSet",
			OperationSet: "OperationSet",
			ToggleSet: "ToggleSet"
		},
		navigationProperty: {
			BOMNodes: "BOMNodes",
			Routings: "to_Routings",
			RoutingNodes: "to_RoutingNodes",
			ConfigurationInstance: {
				name: "to_ConfigurationInstance",
				keys: {
					contextId: "ContextId",
					instanceId: "InstanceId"
				}
			},
			BOMNodeHeader: "to_BOMHeader"
		},
		BOMExplosionNotAssigned: "2",
		explosion: {
			possible: "0",
			error: {
				"1": "vchclf_structpnl_expl_appl_missing",
				"2": "vchclf_structpnl_expl_bom_not_assgnd"
			}
		},
		routing: {
			nodeType: {
				routingHeader: "H",
				standardSequence: "Q",
				parallelSequence: "P",
				alternativeSequence: "A",
				operation: "O",
				subOperation: "S",
				refOperation: "R",
				refSubOperation: "T"
			}
		},
		controller: {
			routingFrame: "sap.i2d.lo.lib.zvchclfz.components.structurepanel.controller.RoutingFrame",
			structureFrame: "sap.i2d.lo.lib.zvchclfz.components.structurepanel.controller.StructureFrame"
		},
		view: {
			routingTree: "sap.i2d.lo.lib.zvchclfz.components.structurepanel.view.RoutingTree"
		},
		treeTable: {
			columns: {
				id: {
					routing: "idRoutingColumn",
					objectDependency: "idDependenciesColumn",
					referenceCharacteristic: "idReferenceCharsColumn",
					product: "idProductColumn"
				}
			}
		},
		routingPageType: {
			base: "RoutingBasePage",
			subPage: "RoutingSubPage"
		},
		routingTree: {
			nullDepth: 0
		},
		configurationInstance: {
			validationStatus: {
				ValidatedAndReleased: "1",
				ValidatedAndIncomplete: "2",
				NotValidate: "3",
				InconsistencyDetected: "4",
				Excluded: "5",
				ProcessedButUnknown: "6"
			}
		},
		uiMode: {
			Create: "Create",
			Edit: "Edit",
			Display: "Display"
		},
		BOMItemProperties: {
			rootParentComponentId: "0"
		},
		FixateState: {
			FIXATE_NOT_ALLOWED: "A",
			FIXATE_ALLOWED: "B",
			ITEM_FIXED: "C"
		},
		FixedBOMItemCategory: {
			MPE_STOCK_ITEM: "K",
			PM_STRUCTURE_ELEMENT: "I",
			TEXT_ITEM: "T",
			DOCUMENT_ITEM: "D",
			CLASS_ITEM: "K",
			INTRA_MATERIAL: "M",
			VARIABLE_SIZE_ITEM: "R",
			STOCK_ITEM: "L",
			NON_STOCK_ITEM: "N",
			COMPATIBLE_UNIT: "V"
		},
		FixOrderBOMMode: {
			FIXATE: "1",
			FIXATE_TOPDOWN: "2"
		},
		BOMItemDialogModel: "BOMItemDialog",
		BOMItemDialogVHModel: "BOMItemDialogVH",
		SelectedBOMItem: "SelectedBOMItem",
		ODataModelName: "vchclf",
		BOMItemVHDialogModelName: "BOMItemVHDialogConfig"
	};
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/EventProvider', ["sap/ui/base/ManagedObject"], function (M) {
	"use strict";
	var E = M.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.logic.EventProvider", {
		metadata: {
			events: {
				contextChanged: {
					parameters: {
						contextId: {
							type: "string"
						}
					}
				},
				refreshStructureTree: {},
				structureTreeRefreshed: {},
				expandAllNodesInStructureTree: {},
				collapseAllNodesInStructureTree: {},
				BOMViewSelectionChanged: {
					parameters: {
						selectedVariant: {
							type: "string"
						}
					}
				},
				routingViewSelectionChanged: {
					parameters: {
						selectedVariant: {
							type: "string"
						}
					}
				},
				resetStructurePanel: {},
				descriptionModeChanged: {},
				structureTreeColumnMoved: {
					parameters: {
						oldPos: {
							type: "object"
						},
						newPos: {
							type: "number"
						}
					}
				},
				structureTreeColumnFrozen: {
					parameters: {
						fixedColumnCount: {
							type: "string"
						}
					}
				},
				structureTreeColumnResized: {
					parameters: {
						columnKey: {
							type: "string"
						},
						width: {
							type: "string"
						}
					}
				},
				updateStructureTreeColumnBinding: {},
				redetermineStructureTreeColumnLayout: {},
				openBOMItemDialogForInsertItem: {},
				openBOMItemDialogForChangeItem: {},
				deleteBOMItem: {},
				fixateBOMItem: {},
				navigateToBOMAppForInsertItem: {},
				navigateToBOMAppForChangeItem: {}
			}
		}
	});
	return new E();
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/FeatureToggle', [
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/ODataModelHelper"
], function (C, O) {
	"use strict";
	var F = function () {
		this._toggles = {
			features: {
				ETOTopDownFixate: "IDEA_CONFIGURE_ETO_TOPDOWN_FIXATE"
			},
			values: {
				"IDEA_CONFIGURE_ETO_TOPDOWN_FIXATE": undefined
			}
		};
	};
	F.prototype.getETOTopDownFixateEnabled = function () {
		return !!this._getToggleById(this._toggles.features.ETOTopDownFixate);
	};
	F.prototype.resetValues = function () {
		$.each(this._toggles.values, function (k) {
			this._toggles.values[k] = undefined;
		}.bind(this));
	};
	F.prototype._getToggleById = function (t) {
		var m = O.getModel();
		if (this._toggles.values.hasOwnProperty(t) && m) {
			if (this._toggles.values[t] === undefined) {
				var p = m.createKey(C.entitySet.ToggleSet, {
					"ToggleId": t
				});
				var c = m.getContext("/" + p);
				if (c && c.getObject()) {
					this._toggles.values[t] = !!c.getObject().ToggleStatus;
				} else {
					this._toggles.values[t] = false;
				}
			}
			return this._toggles.values[t];
		}
		return undefined;
	};
	return new F();
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/NavigationManager', [
	"sap/i2d/lo/lib/zvchclfz/common/type/InspectorMode", "sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/EventProvider",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/StructurePanelModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/model/RoutingTreeModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/model/StructureTreeModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/ODataModelHelper", "sap/base/util/uid", "sap/ui/base/ManagedObject"
], function (I, C, E, S, R, a, O, u, M) {
	"use strict";
	var N = M.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.logic.NavigationManager", {
		metadata: {
			properties: {
				mainContainer: {
					type: "object"
				},
				routingTreeContainer: {
					type: "object"
				},
				ownerComponent: {
					type: "object"
				}
			}
		},
		backToTopOfRouting: function () {
			this._backToTopOfRouting();
			this._onAfterNavigationTo(this._getCurrentRoutingPageController());
		},
		backToTopOfRoutingWithError: function () {
			this._backToTopOfRouting();
			var c = this._getCurrentRoutingPageController();
			if (c && $.isFunction(c.clearRoutingTree)) {
				c.clearRoutingTree();
			}
		},
		navigateToBOMFrame: function () {
			var f = this.resetFrame();
			if (f) {
				var c = S.getCurrentlyLoadedBOMItemInValuation();
				var r = a.getRootComponent();
				if (c || r) {
					this.getOwnerComponent().fireInspectObject({
						objectPath: O.generateBOMNodePath(S.getConfigurationContextId(), c && c.ComponentId || r.ComponentId),
						objectType: I.objectType.BOMComponent
					});
				}
			}
		},
		resetFrame: function () {
			var f = false,
				m = this.getMainContainer();
			if (!this.isCurrentPageStructureFrame() && m) {
				this.resetRoutingFrame();
				E.fireBOMViewSelectionChanged();
				m.backToTop();
				f = true;
			}
			return f;
		},
		reexplodeRouting: function () {
			$.each(this.getRoutingTreeContainer().getPages(), function (i, r) {
				var c = r.getController();
				if ($.isFunction(c.invalidateRoutingTree)) {
					c.invalidateRoutingTree();
				}
			});
			this._reexplodeCurrentRoutingPage();
		},
		reloadRouting: function () {
			var c = this._getCurrentRoutingPageController();
			if (c && $.isFunction(c.reloadRouting)) {
				c.reloadRouting();
			}
		},
		navigateBack: function () {
			if (!this.isCurrentRoutingPageBase()) {
				this.getRoutingTreeContainer().back();
				this._onAfterNavigationTo(this._getCurrentRoutingPageController());
			} else {
				this.navigateToBOMFrame();
			}
		},
		navigateToRoutingFrame: function (c, r, b, o) {
			var m = this.getMainContainer();
			$.each(m.getPages(), function (i, v) {
				if (v.getControllerName() === C.controller.routingFrame) {
					var V = v.getController();
					m.to(v);
					this.getOwnerComponent().fireInspectObject({
						objectPath: O.generateRoutingNodePath(c, C.standardSequenceTreeId, C.defaultRoutingRootNodeId),
						objectType: I.objectType.RoutingHeader
					});
					if ($.isFunction(V.onAfterNavigationTo)) {
						V.onAfterNavigationTo(c, r, b, o);
					}
					return false;
				}
			}.bind(this));
		},
		resetRoutingFrame: function () {
			var r = this.getRoutingTreeContainer();
			if (r) {
				$.each(r.getPages(), function (i, v) {
					if ($.isFunction(v.destroy)) {
						v.destroy();
					}
				});
				r.removeAllPages();
			}
		},
		addBaseRoutingTreePage: function (r) {
			this._addRoutingTreePage(C.routingPageType.base, {}, r);
		},
		addRoutingTreeSubPage: function (r) {
			var o = this._getRoutingPageByBOOSequence(r.BillOfOperationsSequence);
			if (o) {
				this.getRoutingTreeContainer().to(o);
				this._onAfterNavigationTo(o.getController());
			} else {
				this._addRoutingTreePage(C.routingPageType.subPage, r);
			}
		},
		isCurrentRoutingPageBase: function () {
			var c = this._getCurrentRoutingPageController();
			return !!c && c.getRoutingModelType() === C.routingPageType.base;
		},
		isCurrentMainPageRoutingFrame: function () {
			return this.getMainContainer().getCurrentPage().getControllerName() === C.controller.routingFrame;
		},
		isCurrentPageStructureFrame: function () {
			return this.getMainContainer().getCurrentPage().getControllerName() === C.controller.structureFrame;
		},
		teardown: function () {
			this.setMainContainer(null);
			this.setRoutingTreeContainer(null);
			this.setOwnerComponent(null);
		},
		navigateToBOMApp: function (b) {
			var s = !!(sap.ushell && sap.ushell.Container && sap.ushell.Container.getService && sap.ushell.Container.getService(
				"CrossApplicationNavigation"));
			if (s) {
				var c = sap.ushell.Container.getService("CrossApplicationNavigation");
				var h = (c && c.hrefForExternal({
					target: {
						semanticObject: "SalesOrderBOM",
						action: "maintenance"
					},
					params: this._getParamsForBOMAppNavigation(b)
				})) || "";
				sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({
					target: {
						shellHash: h
					}
				});
			}
		},
		_getParamsForBOMAppNavigation: function (b) {
			var B = b[C.navigationProperty.BOMNodeHeader] && b[C.navigationProperty.BOMNodeHeader].BillOfMaterialInternalID ? b[C.navigationProperty
				.BOMNodeHeader].BillOfMaterialInternalID : b.BillOfMaterialInternalID;
			var p = {
				"IsActiveEntity": true,
				"EngineeringChangeDocument": "",
				"Material": b.BOMComponentName,
				"Plant": b.Plant,
				"BillOfMaterialCategory": "K",
				"BillOfMaterialVersion": "",
				"BillOfMaterial": B,
				"BillOfMaterialVariant": b.BOMVariant,
				"DraftUUID": "00000000-0000-0000-0000-000000000000",
				"preferredMode": "edit"
			};
			return p;
		},
		_backToTopOfRouting: function () {
			var r = this.getRoutingTreeContainer();
			var b = r.getPages();
			r.backToTop();
			$.each(b, function (i, p) {
				if (i !== 0) {
					r.removePage(p);
					if ($.isFunction(p.destroy)) {
						p.destroy();
					}
				}
			});
		},
		_addRoutingTreePage: function (r, o, b) {
			var c = this.getOwnerComponent();
			if (c) {
				c.runAsOwner(function () {
					var v = sap.ui.xmlview(C.view.routingTree + "-" + u(), {
						viewName: C.view.routingTree,
						height: "100%",
						viewData: o
					});
					var V = v.getController();
					if ($.isFunction(V.setRoutingModel)) {
						V.setRoutingModel(b ? b : new R(r, o));
					}
					this.getRoutingTreeContainer().addPage(v).to(v);
					this._onAfterNavigationTo(V);
				}.bind(this));
			}
		},
		_onAfterNavigationTo: function (c) {
			if (c && $.isFunction(c.onAfterNavigationTo)) {
				c.onAfterNavigationTo();
			}
		},
		_getRoutingPageByBOOSequence: function (b) {
			var r = $.grep(this.getRoutingTreeContainer().getPages(), function (e) {
				return e.getViewData().BillOfOperationsSequence === b;
			});
			return r.length > 0 ? r[0] : undefined;
		},
		_getCurrentRoutingPageController: function () {
			var c = this.getRoutingTreeContainer().getCurrentPage();
			return c ? c.getController() : undefined;
		},
		_reexplodeCurrentRoutingPage: function () {
			var c = this._getCurrentRoutingPageController();
			if ($.isFunction(c.explodeRouting)) {
				c.explodeRouting();
			}
		}
	});
	return new N();
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/StructurePanelModel', [
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/config/UiConfig", "sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/i18n",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/RoutingSelectionUtil", "sap/base/Log", "sap/ui/model/json/JSONModel"
], function (U, i, R, L, J) {
	"use strict";
	var S = function () {
		this._model = null;
		this._properties = {
			isStructurePanelLoading: false,
			isSuperTreeShown: false,
			isMultiLevelScenario: false,
			selectedBOMView: "",
			selectedBOMViewTitle: "",
			bomViews: [],
			ConfigurationContextId: "",
			baseViewForBOM: "",
			selectBOMViewVisibility: false,
			routingHeaderProduct: "",
			isRoutingAvailable: false,
			isSuperBOMAvailable: false,
			semanticObject: "",
			routingFrameCaller: {
				bindingPath: null,
				bomNode: null,
				routingKey: null
			},
			isBOMInitialLoad: true,
			currentlyFocusedBOMItem: null,
			currentlyLoadedBOMItemInValuation: null,
			isProductColumnFiltered: false,
			productColumnFilterValue: null,
			isStructurePanelEditable: false,
			descriptionMode: null,
			availableRoutings: {
				numberOfRoutings: 0,
				selectedRouting: "",
				routings: []
			},
			isBOMExplosionPossible: true,
			isBOMChangeAllowed: false,
			isETOColumnSetAvailable: false,
			ConfigurationUISettings: null,
			BOMColumnsVariant: null,
			selectedColumns: [],
			fixedColumnCount: null
		};
		this.resetModel();
	};
	S.prototype.resetModel = function () {
		this._model = new J($.extend(true, {}, this._properties));
	};
	S.prototype.getModel = function () {
		return this._model;
	};
	S.prototype.setProperty = function (p, v) {
		this.getModel().setProperty(p, v);
	};
	S.prototype.setBOMColumnsVariant = function (b) {
		this.setProperty("/BOMColumnsVariant", b ? b : {
			defaultKey: null,
			initialSelectionKey: null,
			variantItems: {}
		});
	};
	S.prototype.getBOMColumnsVariant = function () {
		return this.getProperty("/BOMColumnsVariant");
	};
	S.prototype.getItemOfBOMColumnsVariant = function (v) {
		return this.getProperty("/BOMColumnsVariant/variantItems/" + v);
	};
	S.prototype.setSelectedColumns = function (s) {
		this.setProperty("/selectedColumns", s);
	};
	S.prototype.setFixedColumnCount = function (f) {
		this.setProperty("/fixedColumnCount", f);
	};
	S.prototype.getSelectedColumn = function (c) {
		var C;
		$.each(this.getProperty("/selectedColumns"), function (I, s) {
			if (s.columnKey === c) {
				C = s;
				return false;
			}
		});
		return C;
	};
	S.prototype.setIsBOMChangeAllowed = function (v) {
		this.setProperty("/isBOMChangeAllowed", v);
	};
	S.prototype.isBOMChangeAllowed = function () {
		return this.getProperty("/isBOMChangeAllowed");
	};
	S.prototype.isETOColumnSetAvailable = function () {
		return this.getProperty("/isETOColumnSetAvailable");
	};
	S.prototype.setProductColumnFilterValue = function (v) {
		this.setProperty("/productColumnFilterValue", v);
	};
	S.prototype.getProperty = function (p) {
		return this.getModel().getProperty(p);
	};
	S.prototype.personalize = function (p) {
		var b = [];
		var I = false;
		if (!p || $.isEmptyObject(p)) {
			L.error("No Personalization data available", "Please pass Configuration Settings Data",
				"sap.i2d.lo.lib.zvchclfz.components.structurepanel.logic.StructurePanelModel");
			return;
		}
		if (p.IsStrucConfigblItemAvailable) {
			b.push({
				text: i.getText(U.viewConfig[U.views.ConfigurableItems].title),
				key: U.views.ConfigurableItems
			});
			I = true;
		}
		if (p.IsBomAvailable) {
			b.push({
				text: i.getText(U.viewConfig[U.views.BillOfMaterial].title),
				key: U.views.BillOfMaterial
			});
		}
		this.setProperty("/isRoutingAvailable", p.IsRoutingAvailable);
		this.setProperty("/isSuperBOMAvailable", p.IsSuperBOMAvailable);
		this.setProperty("/isETOColumnSetAvailable", p.IsStrucETOColumnSetAvailable);
		this.setProperty("/ConfigurationUISettings", p.UISettings);
		if (b.length === 0) {
			L.error("No Valid Personalization data available", "Please pass Configuration Settings Data",
				"sap.i2d.lo.lib.zvchclfz.components.structurepanel.logic.StructurePanelModel");
			return;
		}
		this.setProperty("/isMultiLevelScenario", I);
		this.setProperty("/bomViews", b);
		this._determineVisibilityOfSelectBOM();
		this._determineBOMBaseView(p);
	};
	S.prototype._determineVisibilityOfSelectBOM = function () {
		if (this.getProperty("/bomViews").length > 1) {
			this.setProperty("/selectBOMViewVisibility", true);
		} else {
			this.setProperty("/selectBOMViewVisibility", false);
		}
	};
	S.prototype._determineBOMBaseView = function (p) {
		var b = null;
		if (p.IsStrucConfigblItemAvailable) {
			b = U.views.ConfigurableItems;
		} else if (p.IsBomAvailable) {
			b = U.views.BillOfMaterial;
		} else {
			L.error("No Valid Personalization data available", "Please pass Configuration Settings Data",
				"sap.i2d.lo.lib.zvchclfz.components.structurepanel.logic.StructurePanelModel");
			return;
		}
		this.setProperty("/baseViewForBOM", b);
	};
	S.prototype.resetToBOMBaseView = function () {
		this.setSelectedBOMView(this.getProperty("/baseViewForBOM"));
	};
	S.prototype.getUIConfigForSelectedBOMView = function () {
		return U.viewConfig[this.getProperty("/selectedBOMView")];
	};
	S.prototype.setSelectedBOMView = function (k) {
		if (U.viewConfig.hasOwnProperty(k)) {
			this.setProperty("/selectedBOMView", k);
			this.setProperty("/selectedBOMViewTitle", i.getText(U.viewConfig[k].title));
		} else {
			L.error("Could not find View Configuration for " + k, "Please Configure the View",
				"sap.i2d.lo.lib.zvchclfz.components.structurepanel.logic.StructurePanelModel");
		}
	};
	S.prototype.setStructurePanelLoading = function (f) {
		this.setProperty("/isStructurePanelLoading", f);
	};
	S.prototype.setSuperTreeShown = function (a) {
		this.setProperty("/isSuperTreeShown", a);
	};
	S.prototype.isSuperTreeShown = function () {
		return this.getProperty("/isSuperTreeShown");
	};
	S.prototype.getSelectedBOMView = function () {
		return this.getProperty("/selectedBOMView");
	};
	S.prototype.isConfigurableItemViewSelected = function () {
		return this.getSelectedBOMView() === U.views.ConfigurableItems;
	};
	S.prototype.updateConfigurationContextId = function (c) {
		this.setProperty("/ConfigurationContextId", c);
	};
	S.prototype.getConfigurationContextId = function () {
		return this.getProperty("/ConfigurationContextId");
	};
	S.prototype.getRoutingFrameCallerBindingPath = function () {
		return this.getProperty("/routingFrameCaller/bindingPath");
	};
	S.prototype.getRoutingFrameCallerRoutingKey = function () {
		return this.getProperty("/routingFrameCaller/routingKey");
	};
	S.prototype.getRoutingFrameCallerBOMNode = function () {
		return this.getProperty("/routingFrameCaller/bomNode");
	};
	S.prototype.getAvailableRoutings = function () {
		return this.getProperty("/availableRoutings/routings");
	};
	S.prototype.resetAvailableRoutings = function () {
		this.setProperty("/availableRoutings", {
			numberOfRoutings: 0,
			selectedRouting: "",
			routings: []
		});
	};
	S.prototype.setRoutingFrameCaller = function (p, r, b) {
		if (p) {
			this.setProperty("/routingFrameCaller/bindingPath", p);
			this.setProperty("/routingFrameCaller/routingKey", r);
			this.setProperty("/routingFrameCaller/bomNode", b);
			this.setProperty("/routingHeaderProduct", b.Product);
		} else {
			L.error("Missing Caller Path", "Please the Routing Caller properly",
				"sap.i2d.lo.lib.zvchclfz.components.structurepanel.logic.StructurePanelModel");
		}
	};
	S.prototype.getFiltersForCurrentlySelectedBOMview = function () {
		var v = this.getUIConfigForSelectedBOMView();
		if (!v) {
			L.error("Invalid BOM view ID", "Provide a valid BOM view ID to be able to bind data to Structure Tree.",
				"sap.i2d.lo.lib.zvchclfz.components.structurepanel.controller.StructureTree");
			return undefined;
		}
		return v.getFilters(this.isSuperTreeShown());
	};
	S.prototype.isStructurePanelEnabled = function (p) {
		if (p && !$.isEmptyObject(p) && (p.IsBomAvailable || p.IsStrucConfigblItemAvailable || p.IsRoutingAvailable)) {
			return true;
		} else {
			return false;
		}
	};
	S.prototype.isRoutingAvailable = function () {
		return this.getProperty("/isRoutingAvailable");
	};
	S.prototype.getIsMultiLevelScenario = function () {
		return this.getProperty("/isMultiLevelScenario");
	};
	S.prototype.setIsBOMInitialLoad = function (f) {
		this.setProperty("/isBOMInitialLoad", f);
	};
	S.prototype.getIsBOMInitialLoad = function () {
		return this.getProperty("/isBOMInitialLoad");
	};
	S.prototype.setCurrentlyFocusedBOMItem = function (b) {
		this.setProperty("/currentlyFocusedBOMItem", b);
	};
	S.prototype.getCurrentlyFocusedBOMItem = function () {
		return this.getProperty("/currentlyFocusedBOMItem");
	};
	S.prototype.setCurrentlyLoadedBOMItemInValuation = function (b) {
		this.setProperty("/currentlyLoadedBOMItemInValuation", b);
	};
	S.prototype.getCurrentlyLoadedBOMItemInValuation = function () {
		return this.getProperty("/currentlyLoadedBOMItemInValuation");
	};
	S.prototype.setProductColumnFiltered = function (p) {
		this.setProperty("/isProductColumnFiltered", p);
	};
	S.prototype.setStructurePanelEditable = function (e) {
		this.setProperty("/isStructurePanelEditable", e);
	};
	S.prototype.setRoutings = function (r) {
		this.setProperty("/availableRoutings/numberOfRoutings", r.length);
		this.setProperty("/availableRoutings/routings", r);
		if (r.length === 1) {
			this.setProperty("/availableRoutings/selectedRouting", R.getConcatenatedRoutingKey(r[0].BillOfOperationsGroup, r[0].BillOfOperationsVariant));
		}
	};
	S.prototype.setSelectedRouting = function (b, B) {
		this.setProperty("/availableRoutings/selectedRouting", R.getConcatenatedRoutingKey(b, B));
	};
	S.prototype.isStructurePanelEditable = function () {
		return this.getProperty("/isStructurePanelEditable");
	};
	S.prototype.setDescriptionMode = function (d) {
		this.setProperty("/descriptionMode", d);
	};
	S.prototype.getDescriptionMode = function () {
		return this.getProperty("/descriptionMode");
	};
	S.prototype.setSemanticObject = function (s) {
		this.setProperty("/semanticObject", s);
	};
	S.prototype.getSemanticObject = function () {
		return this.getProperty("/semanticObject");
	};
	S.prototype.setIsBOMExplosionPossible = function (f) {
		this.setProperty("/isBOMExplosionPossible", f);
	};
	S.prototype.getIsBOMExplosionPossible = function () {
		return this.getProperty("/isBOMExplosionPossible");
	};
	return new S();
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/model/RoutingTreeModel', [
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/dao/RoutingNodeSetDAO",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/StructurePanelModel", "sap/ui/model/json/JSONModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/MessageManager"
], function (C, R, S, J, M) {
	"use strict";
	var a = function (t, r) {
		var b = [];
		if (r && r.BillOfOperationsSequence) {
			b.push(new sap.ui.model.Filter({
				path: "BillOfOperationsSequence",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: r.BillOfOperationsSequence
			}));
		}
		this._treeModel = new J({
			baseFilters: b,
			parentBaseRoutingObject: r,
			treeType: t,
			routingNodes: null,
			treeDepth: 0,
			isRefreshable: true,
			isSuperRoutingShown: false
		});
	};
	a.prototype.getRoutingKey = function () {
		var r = this._treeModel.getProperty("/routingNodes/items");
		if ($.isArray(r) && r.length > 0) {
			var f = r[0];
			return {
				BillOfOperationsType: f.BillOfOperationsType,
				BillOfOperationsGroup: f.BillOfOperationsGroup,
				BillOfOperationsVariant: f.BillOfOperationsVariant
			};
		} else {
			return undefined;
		}
	};
	a.prototype.getModel = function () {
		return this._treeModel;
	};
	a.prototype.invalidate = function () {
		this._treeModel.setProperty("/isRefreshable", true);
	};
	a.prototype.isInvalidated = function () {
		return this._treeModel.getProperty("/isRefreshable") || S.isSuperTreeShown() !== this._treeModel.getProperty("/isSuperRoutingShown");
	};
	a.prototype.getTreeDepth = function () {
		return this._treeModel.getProperty("/treeDepth");
	};
	a.prototype.getType = function () {
		return this._treeModel.getProperty("/treeType");
	};
	a.prototype.read = function (p) {
		return new Promise(function (r, b) {
			var i = S.isSuperTreeShown();
			M.dropStructurePanelMessages();
			this._treeModel.setProperty("/isRefreshable", false);
			R.read(p, this._setupFilter()).then(function (c) {
				var t = this._genericSuccessHandling(c, i);
				r(t.length);
			}.bind(this)).catch(function () {
				this._genericErrorHandling();
				b();
			}.bind(this));
		}.bind(this));
	};
	a.prototype.resetRoutingTree = function () {
		this._treeModel.setProperty("/routingNodes", null);
	};
	a.prototype.explodeRouting = function (p, c, r, b) {
		return new Promise(function (d, e) {
			var i = S.isSuperTreeShown();
			M.dropStructurePanelMessages();
			this._treeModel.setProperty("/isRefreshable", false);
			R.explodeRouting(p, c, r, b, this._setupFilter()).then(function (f) {
				var t = this._genericSuccessHandling(f, i);
				d(t.length);
			}.bind(this)).catch(function () {
				this._genericErrorHandling();
				e();
			}.bind(this));
		}.bind(this));
	};
	a.prototype._genericErrorHandling = function () {
		this.resetRoutingTree();
		this.invalidate();
	};
	a.prototype._genericSuccessHandling = function (r, i) {
		var t = this._treeify(r);
		this._treeModel.setProperty("/routingNodes", {
			items: t
		});
		this._treeModel.setProperty("/isSuperRoutingShown", i);
		return t;
	};
	a.prototype._setupFilter = function () {
		var c = [];
		c = c.concat(this._treeModel.getProperty("/baseFilters"));
		if (!S.isSuperTreeShown()) {
			c.push(new sap.ui.model.Filter({
				path: "IsExcludedItem",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: false
			}));
		}
		return c;
	};
	a.prototype._treeify = function (r) {
		var t = [];
		var l = {};
		var T = C.routingTree.nullDepth;
		r.forEach(function (o) {
			var n = null;
			o.items = o.items || [];
			l[o.NodeId] = o;
			n = parseInt(o.NodeLevel, 10);
			T = n > T ? n : T;
		});
		this._treeModel.setProperty("/treeDepth", T);
		r.forEach(function (o) {
			if (o.NodeId !== C.defaultRoutingRootNodeId) {
				var n = l[o.ParentNodeId].items;
				var N = $.grep(n, function (e) {
					return e.NodeId === o.NodeId;
				})[0];
				if (!N) {
					n.push(o);
				}
			} else {
				t.push(o);
			}
		});
		return t;
	};
	return a;
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/model/StructureTreeModel', [
	"sap/i2d/lo/lib/zvchclfz/common/type/InspectorMode", "sap/i2d/lo/lib/zvchclfz/components/structurepanel/dao/BOMNodeSetDAO",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/StructurePanelModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/HashGenerator", "sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/i18n",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/MessageManager",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/ODataModelHelper", "sap/ui/model/json/JSONModel"
], function (I, B, C, S, H, i, M, O, J) {
	"use strict";
	var a = function () {
		this.EXPAND_LEVEL_COUNT = 2;
		this._ownerComponent = null;
		this._model = new J({
			BOMComponents: null,
			treeDepth: 0,
			isReexplodable: false
		});
		this._flatStructure = [];
		this._externalBOMBindings = [];
		this._extendedFilters = [];
		this._productFilterText = "";
	};
	a.prototype.setOwnerComponent = function (c) {
		this._ownerComponent = c;
	};
	a.prototype.setProductFilterText = function (v) {
		this._productFilterText = v;
	};
	a.prototype.getProductFilterText = function () {
		return this._productFilterText;
	};
	a.prototype.getRootComponent = function () {
		var b = this._model.getProperty("/BOMComponents");
		try {
			if (b.items[0].ParentComponentId === C.BOMItemProperties.rootParentComponentId) {
				return b.items[0];
			} else {
				return null;
			}
		} catch (e) {
			return null;
		}
	};
	a.prototype.getBOMComponentById = function (b) {
		if (b) {
			var c = $.grep(this._flatStructure, function (f) {
				return f.ComponentId === b;
			});
			return c.length > 0 ? c[0] : null;
		} else {
			return null;
		}
	};
	a.prototype.getBOMComponent = function (b) {
		if (b) {
			var c = $.grep(this._flatStructure, function (f) {
				return f.ComponentId === b.ComponentId && f.BOMComponentName === b.BOMComponentName;
			});
			return c.length > 0 ? c[0] : null;
		} else {
			return null;
		}
	};
	a.prototype.resetModel = function () {
		this._resetTreeModelData();
		this.clearExtendedFilters();
	};
	a.prototype._resetTreeModelData = function () {
		this._model.setProperty("/BOMComponents", null);
		this._model.setProperty("/treeDepth", 0);
		this._flatStructure = [];
		this._oCachedBOMTreeifiedResults = null;
		this._oCurrentBOMTreeifiedResults = null;
	};
	a.prototype._updateFlatStructure = function (r) {
		var b = false;
		if ($.isArray(r) && r.length > 0) {
			if (this._flatStructure.length > 0) {
				$.each(r, function (c, o) {
					if (!this.getBOMComponent(o)) {
						this._flatStructure.push(o);
						b = true;
					}
				}.bind(this));
			} else {
				this._flatStructure = r;
				b = true;
			}
		}
		return b;
	};
	a.prototype._treeify = function (f) {
		var t = [];
		var l = {};
		var T = 0;
		var b = [];
		$.each(f, function (c, o) {
			var d = null;
			b.push({
				ComponentId: o.ComponentId,
				State: H.generateHashForEntity(o, [C.navigationProperty.ConfigurationInstance.name])
			});
			o.items = o.items || [];
			l[o.ComponentId] = o;
			d = parseInt(o.ComponentLevel, 10);
			T = d > T ? d : T;
		});
		$.each(f, function (c, o) {
			if (o.ParentComponentId !== C.BOMItemProperties.rootParentComponentId) {
				var d = l[o.ParentComponentId] && l[o.ParentComponentId].items;
				if ($.isArray(d)) {
					var e = $.grep(d, function (E) {
						return E.ComponentId === o.ComponentId;
					})[0];
					if (!e) {
						d.push(o);
					}
				}
			} else {
				t.push(o);
			}
		});
		$.each(f, function (c, o) {
			if (o.DrilldownState === C.drillDownState.expanded && o.items.length === 0) {
				o.items.push({
					Quantity: "",
					Unit: "",
					BOMComponentName: i.getText("vchclf_structpnl_tree_download_placeholder"),
					dataDownloadNeeded: true,
					ObjectDependencyAssgmtNumber: C.intialObjectDependencyAssgmtNumber,
					HasRouting: false,
					parentComponent: o
				});
			}
		});
		return {
			aTree: t,
			iTreeDepth: T,
			aFlatStructure: f,
			sBOMState: JSON.stringify(b.sort(function (F, s) {
				return F.ComponentId.localeCompare(s.ComponentId);
			}))
		};
	};
	a.prototype._bindTreeToModel = function (d, r) {
		if (r) {
			this._resetTreeModelData();
		}
		if (this._updateFlatStructure(d)) {
			var t = this._treeify(this._flatStructure);
			this._oCurrentBOMTreeifiedResults = t;
			this._model.setProperty("/treeDepth", t.iTreeDepth);
			this._model.setProperty("/BOMComponents", {
				items: t.aTree
			});
			if (S.getIsMultiLevelScenario()) {
				this._addConfigurationInstanceBindings();
			}
			S.setCurrentlyFocusedBOMItem(this.getBOMComponent(S.getCurrentlyFocusedBOMItem()));
		}
	};
	a.prototype.getModel = function () {
		return this._model;
	};
	a.prototype.explodeBOM = function () {
		return new Promise(function (r, R) {
			var b = S.getIsBOMInitialLoad();
			M.dropStructurePanelMessages();
			B.explodeBOM(S.getConfigurationContextId(), this._getCurrentlyAppliedFilters(), S.getIsMultiLevelScenario(), b).then(function (c) {
				this._fireInspectObject(b, c);
				this._bindTreeToModel(c, true);
				S.setIsBOMInitialLoad(false);
				this._model.setProperty("/isReexplodable", false);
				r();
			}.bind(this)).catch(function (e) {
				R(e);
			});
		}.bind(this));
	};
	a.prototype.explodeBOMWithoutUpdatingTheModel = function () {
		return new Promise(function (r, R) {
			var f = this._getCurrentlyAppliedFilters();
			var t = this._model.getProperty("/treeDepth");
			var b = S.getIsBOMInitialLoad();
			if (t !== 0) {
				f.push(new sap.ui.model.Filter({
					path: "ComponentLevel",
					operator: sap.ui.model.FilterOperator.BT,
					value1: 0,
					value2: t + 1
				}));
			}
			M.dropStructurePanelMessages();
			B.explodeBOM(S.getConfigurationContextId(), f, S.getIsMultiLevelScenario(), b).then(function (c) {
				this._fireInspectObject(b, c);
				S.setIsBOMInitialLoad(false);
				if ($.isArray(c)) {
					this._oCachedBOMTreeifiedResults = this._treeify(c);
					if (!this._oCurrentBOMTreeifiedResults || !this._oCurrentBOMTreeifiedResults.sBOMState) {
						r(true);
					} else {
						r(this._oCachedBOMTreeifiedResults.sBOMState !== this._oCurrentBOMTreeifiedResults.sBOMState);
					}
				} else {
					r(false);
				}
			}.bind(this)).catch(function (e) {
				R(e);
			});
		}.bind(this));
	};
	a.prototype._fireInspectObject = function (b, r) {
		if (this._ownerComponent && S.getSemanticObject() === C.semanticObject.variantConfiguration && b && $.isArray(r) && r.length > 0) {
			this._ownerComponent.fireInspectObject({
				objectPath: O.generateBOMNodePath(S.getConfigurationContextId(), r[0].ComponentId),
				objectType: I.objectType.BOMComponent
			});
		}
	};
	a.prototype._refreshModelFromCache = function () {
		this._bindTreeToModel(this._oCachedBOMTreeifiedResults.aFlatStructure, true);
	};
	a.prototype.loadEntries = function (c) {
		return new Promise(function (r, R) {
			var f = this._getCurrentlyAppliedFilters();
			var b = c ? parseInt(c.ComponentLevel, 10) : 0;
			if (c && (c.items.length >= 1 && !c.items[0].dataDownloadNeeded || c.DrilldownState === C.drillDownState.leaf)) {
				r();
				return;
			}
			f.push(new sap.ui.model.Filter({
				path: "ParentComponentId",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: c ? c.ComponentId : C.BOMItemProperties.rootParentComponentId
			}));
			f.push(new sap.ui.model.Filter({
				path: "ComponentLevel",
				operator: sap.ui.model.FilterOperator.BT,
				value1: b === 0 ? 0 : b + 1,
				value2: b === 0 ? this.EXPAND_LEVEL_COUNT : b + 1 + this.EXPAND_LEVEL_COUNT
			}));
			M.dropStructurePanelMessages();
			B.readBOMNodes(S.getConfigurationContextId(), f, S.getIsMultiLevelScenario()).then(function (d) {
				if (c && $.isArray(c.items)) {
					c.items = [];
				}
				this._fireInspectObject(S.getIsBOMInitialLoad(), d);
				this._bindTreeToModel(d, !c);
				r();
			}.bind(this)).catch(function (e) {
				R(e);
			});
		}.bind(this));
	};
	a.prototype.loadAll = function () {
		return this._genericBOMNodeRead();
	};
	a.prototype._genericBOMNodeRead = function () {
		return new Promise(function (r, R) {
			M.dropStructurePanelMessages();
			B.readBOMNodes(S.getConfigurationContextId(), this._getCurrentlyAppliedFilters(), S.getIsMultiLevelScenario()).then(function (b) {
				this._bindTreeToModel(b, true);
				r();
			}.bind(this)).catch(function (e) {
				R(e);
			});
		}.bind(this));
	};
	a.prototype._addConfigurationInstanceBindings = function () {
		$.each(this._externalBOMBindings, function (b, o) {
			o.detachChange(this._handleBindingEvent, this);
			o.destroy();
		}.bind(this));
		this._externalBOMBindings = [];
		this._addBindingEvent("/BOMComponents");
	};
	a.prototype._addBindingEvent = function (c) {
		var s = c + "/items";
		$.each(this._model.getProperty(s), function (k, b) {
			if (b.to_ConfigurationInstance && b.to_ConfigurationInstance.ContextId && b.to_ConfigurationInstance.InstanceId) {
				var o = O.getModel();
				var d = o.getContext(O.generateConfigurationInstancePath(b.to_ConfigurationInstance));
				var e = s + "/" + k;
				var v = o.bindProperty("ConfigurationValidationStatus", d);
				this._externalBOMBindings.push(v);
				v.attachChange(this._handleBindingEvent.bind(this, e), this);
				if ($.isArray(b.items) && b.items.length > 0) {
					this._addBindingEvent(e);
				}
			}
		}.bind(this));
	};
	a.prototype._handleBindingEvent = function (b, e) {
		var c = e.getSource().getContext();
		if (c && $.type(b) === "string" && this._model && this._model.getProperty(b)) {
			this._model.setProperty(b + "/to_ConfigurationInstance/ConfigurationValidationStatus", c.getProperty("ConfigurationValidationStatus"));
			this._model.setProperty(b + "/to_ConfigurationInstance/ConfigurationValidationStatusDescription", c.getProperty(
				"ConfigurationValidationStatusDescription"));
		}
	};
	a.prototype._getCurrentlyAppliedFilters = function () {
		var f = $.extend([], S.getFiltersForCurrentlySelectedBOMview());
		if ($.isArray(this._extendedFilters) && this._extendedFilters.length > 0) {
			f = f.concat(this._extendedFilters);
		}
		return f;
	};
	a.prototype.addFilters = function (f) {
		if ($.isArray(f) && f.length > 0) {
			this._extendedFilters = this._extendedFilters.concat(f);
			S.setProductColumnFiltered(true);
		}
	};
	a.prototype.clearExtendedFilters = function () {
		this._extendedFilters = [];
		this._productFilterText = "";
		S.setProductColumnFiltered(false);
	};
	a.prototype.isDownloadingNode = function (b) {
		return b.Quantity === "" && b.Unit === "" && b.BOMComponentName === i.getText("vchclf_structpnl_tree_download_placeholder") && b.dataDownloadNeeded ===
			true && b.ObjectDependencyAssgmtNumber === C.intialObjectDependencyAssgmtNumber && b.HasRouting === false;
	};
	return new a();
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/BOMItemActions', function () {
	"use strict";
	return {
		Insert: "Insert",
		Change: "Change",
		Delete: "Delete",
		Fix: "Fix"
	};
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/HashGenerator', [], function () {
	"use strict";
	var H = function () {};
	H.prototype.generateHashForEntity = function (e, r) {
		var h, c = $.extend({}, e);
		this._deleteNotStateRelevantProperties(c, r);
		var b = JSON.stringify(c);
		for (var i = 0; i < b.length; i++) {
			h = (h << 5) - h + b.charCodeAt(i);
			h = h & h;
		}
		return h;
	};
	H.prototype._deleteNotStateRelevantProperties = function (e, r) {
		if ($.isEmptyObject(e)) {
			return;
		}
		delete e.__metadata;
		delete e.__deferred;
		for (var p in e) {
			if (typeof e[p] === "object" && !(e[p] instanceof Date)) {
				if ($.isArray(r) && r.indexOf(p) !== -1 && !$.isEmptyObject(e[p])) {
					this._deleteNotStateRelevantProperties(e[p], r);
					if ($.isEmptyObject(e[p])) {
						delete e[p];
					}
				} else {
					delete e[p];
				}
			} else if (typeof e[p] === "string") {
				e[p] = e[p].trim();
				if (!e[p]) {
					delete e[p];
				}
			}
		}
	};
	return new H();
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/MessageManager', [], function () {
	"use strict";
	return {
		dropStructurePanelMessages: function () {
			var m = sap.ui.getCore().getMessageManager();
			var M = m.getMessageModel().getData();
			$.each(M, function (k, o) {
				if (!o.target) {
					return;
				}
				if (o.target.indexOf("/RoutingNodeSet") >= 0 || o.target.indexOf("/BOMNodeSet") >= 0 || o.target.indexOf("/to_RoutingNodes") >= 0 ||
					o.target.indexOf("/BOMNodes") >= 0) {
					m.removeMessages(o);
				}
			});
		}
	};
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/ODataModelHelper', [
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants"
], function (C) {
	"use strict";
	var O = function () {
		this._model = null;
	};
	O.prototype.init = function (m) {
		this._model = m;
	};
	O.prototype.getModel = function () {
		return this._model;
	};
	O.prototype.generateBOMNodePath = function (c, s) {
		var a = this._model.createKey("/" + C.entitySet.ConfigurationContextSet, {
			ContextId: c
		});
		var b = "/" + C.navigationProperty.BOMNodes + "('" + s + "')";
		return a + b;
	};
	O.prototype.generateConfigurationInstancePath = function (c) {
		if (c.ContextId && c.InstanceId) {
			return this._model.createKey("/" + C.entitySet.ConfigurationInstanceSet, {
				ContextId: c.ContextId,
				InstanceId: c.InstanceId
			});
		}
		return undefined;
	};
	O.prototype.generateRoutingNodePath = function (p, t, n) {
		return p + "/" + C.navigationProperty.RoutingNodes + "(TreeId='" + t + "',NodeId='" + n + "')";
	};
	O.prototype.extendTheBOMNodePathWithRoutingKey = function (b, r) {
		return b + "/" + C.navigationProperty.Routings + "(BillOfOperationsType='" + r.BillOfOperationsType + "',BillOfOperationsGroup='" + r.BillOfOperationsGroup +
			"',BillOfOperationsVariant='" + r.BillOfOperationsVariant + "')";
	};
	O.prototype.destroy = function () {
		if (this._model) {
			this._model.destroy();
			delete this._model;
		}
	};
	return new O();
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/RoutingSelectionUtil', [], function () {
	"use strict";
	var R = function () {};
	R.prototype.getConcatenatedRoutingKey = function (b, B) {
		return b + "/" + B;
	};
	return new R();
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/RoutingUtil', ["sap/ui/base/ManagedObject",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/model/RoutingTreeModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/StructurePanelModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/ODataModelHelper", "sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/i18n",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/NavigationManager", "sap/m/MessageBox"
], function (M, R, C, S, O, i, N, a) {
	"use strict";
	var b = M.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.util.RoutingUtil", {
		metadata: {
			properties: {
				ownerComponent: {
					type: "object"
				}
			}
		},
		explodeRouting: function (p, B, r) {
			var o = new R(C.routingPageType.base);
			var I = S.isSuperTreeShown();
			S.setStructurePanelLoading(true);
			if (S.isConfigurableItemViewSelected()) {
				S.setSuperTreeShown(false);
			}
			o.explodeRouting(p, S.getConfigurationContextId(), r, B).then(function () {
				var s = r;
				var e = p;
				if ($.isEmptyObject(s)) {
					s = o.getRoutingKey();
					if (!s) {
						throw new Error();
					}
					e = O.extendTheBOMNodePathWithRoutingKey(e, s);
				}
				N.navigateToRoutingFrame(e, s, B, o);
			}).catch(function () {
				a.error(i.getText("vchclf_structpnl_expl_routing_error"));
				S.setSuperTreeShown(I);
			}).then(function () {
				S.setStructurePanelLoading(false);
				this.getOwnerComponent().fireRoutingExplosionFinished();
			}.bind(this));
		},
		teardown: function () {
			this.setOwnerComponent(null);
		}
	});
	return new b();
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/StructureFrameETOHandler', [
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/EventProvider",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/FeatureToggle",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/model/StructureTreeModel"
], function (C, E, F, S) {
	"use strict";
	return {
		onOpenBOMItemDialogForInsertItem: function () {
			E.fireOpenBOMItemDialogForInsertItem();
		},
		onOpenBOMItemDialogForChangeItem: function () {
			E.fireOpenBOMItemDialogForChangeItem();
		},
		onBOMItemDelete: function () {
			E.fireDeleteBOMItem();
		},
		onBOMItemFixate: function () {
			E.fireFixateBOMItem({
				fixOrderBOMMode: C.FixOrderBOMMode.FIXATE
			});
		},
		onBOMItemFixateTopdown: function () {
			E.fireFixateBOMItem({
				fixOrderBOMMode: C.FixOrderBOMMode.FIXATE_TOPDOWN
			});
		},
		onNavigateToBOMAppForInsertItem: function () {
			E.fireNavigateToBOMAppForInsertItem();
		},
		onNavigateToBOMAppForChangeItem: function () {
			E.fireNavigateToBOMAppForChangeItem();
		},
		isFixateButtonEnabled: function (c) {
			if (!c || !C) {
				return false;
			}
			return c.FixateState === C.FixateState.FIXATE_ALLOWED;
		},
		isFixateButtonVisible: function (u, i, I) {
			return !F.getETOTopDownFixateEnabled() && i && I;
		},
		isFixateMenuButtonVisible: function (u, i, I) {
			return F.getETOTopDownFixateEnabled() && u && u.FixOrderBOMMode === C.FixOrderBOMMode.FIXATE && i && I;
		},
		isFixateTopDownMenuButtonVisible: function (u, i, I) {
			return F.getETOTopDownFixateEnabled() && u && u.FixOrderBOMMode === C.FixOrderBOMMode.FIXATE_TOPDOWN && i && I;
		},
		isInsertBOMItemButtonEnabled: function (c) {
			if (!c || !C) {
				return false;
			}
			return c.FixateState === C.FixateState.ITEM_FIXED && c.IsConfigurableItem;
		},
		isUpdateBOMItemButtonEnabled: function (c) {
			if (!c || !C) {
				return false;
			}
			var p = S.getBOMComponentById(c.ParentComponentId);
			if (!p) {
				return false;
			} else {
				return p.FixateState === C.FixateState.ITEM_FIXED;
			}
		},
		isDeleteBOMItemButtonEnabled: function (c) {
			if (!c || !C) {
				return false;
			}
			var p = S.getBOMComponentById(c.ParentComponentId);
			if (!p) {
				return false;
			} else {
				return p.FixateState === C.FixateState.ITEM_FIXED;
			}
		}
	};
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/StructureTreeETOHandler', ["sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/EventProvider",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/StructurePanelModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/NavigationManager",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants", "sap/i2d/lo/lib/zvchclfz/common/util/Logger",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/model/StructureTreeModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/ODataModelHelper", "sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/i18n",
	"sap/m/MessageBox"
], function (J, F, a, E, S, N, C, L, b, O, i, M) {
	"use strict";
	var B = "sap.i2d.lo.lib.zvchclfz.components.structurepanel.fragment.BOMItemDialog";
	var c = "sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.BOMItemDialog";
	return {
		_navigateToBOMApp: function (o) {
			var p = O.generateBOMNodePath(S.getConfigurationContextId(), o.ComponentId),
				u = {
					$expand: C.navigationProperty.BOMNodeHeader
				};
			this.getView().getModel().facadeRead(p, u).then(function (d) {
				if (d.BillOfMaterialInternalID === "00000000" || (d[C.navigationProperty.BOMNodeHeader] && d[C.navigationProperty.BOMNodeHeader].BillOfMaterialInternalID ===
						"00000000")) {
					M.warning(i.getText("vchclf_structpnl_navigate_to_bom_app_warning"));
				} else {
					N.navigateToBOMApp(d);
				}
			});
		},
		_getBOMItemDialogModel: function () {
			return this._oBOMItemDialogModel;
		},
		_updateBOMItemDialogModel: function (o) {
			var m = this._oBOMItemDialog.getModel(C.BOMItemDialogModel);
			var r = o.results;
			var d = 0;
			r.forEach(function (R, I) {
				if (R.BillOfMaterialItemCategory === C.FixedBOMItemCategory.STOCK_ITEM) {
					d = I;
				}
			});
			m.setProperty("/SelectedItemKey", o.results[d].BillOfMaterialItemCategory);
			m.setProperty("/BOMItemCategory", o.results);
			m.setProperty("/SelectedBOMItemCategory/" + o.results[d].FixedItemCategory, true);
		},
		_getDefaultDataForBOMItemDialog: function () {
			var d = {
				"SelectedBOMItemName": S.getCurrentlyFocusedBOMItem().BOMComponentName,
				"SelectedBOMItemCategory": {},
				"SelectedItemKey": "",
				"SaveAndCloseButtonEnabled": false,
				"BOMItemCategory": []
			};
			d.SelectedBOMItemCategory[C.FixedBOMItemCategory.NON_STOCK_ITEM] = false;
			d.SelectedBOMItemCategory[C.FixedBOMItemCategory.STOCK_ITEM] = false;
			d.SelectedBOMItemCategory[C.FixedBOMItemCategory.TEXT_ITEM] = false;
			d.SelectedBOMItemCategory[C.FixedBOMItemCategory.DOCUMENT_ITEM] = false;
			d.SelectedBOMItemCategory[C.FixedBOMItemCategory.VARIABLE_SIZE_ITEM] = false;
			return d;
		},
		_getDataForInsertBOMItemDialog: function () {
			var d = this._getDefaultDataForBOMItemDialog();
			d.IsBOMItemInsert = true;
			return d;
		},
		_getDataForUpdateBOMItemDialog: function () {
			var d = this._getDefaultDataForBOMItemDialog();
			d.IsBOMItemInsert = false;
			d.SelectedBOMItemCategory[S.getCurrentlyFocusedBOMItem().FixedItemCategory] = true;
			return d;
		},
		_createBOMItemDialog: function (d) {
			var D;
			if (this._oBOMItemDialog) {
				D = this._oBOMItemDialog.getController();
				E.detachResetStructurePanel(D.onCancel, D);
				this._oBOMItemDialog.destroy();
				delete this._oBOMItemDialog;
			}
			this._oBOMItemDialogVHModel = new J();
			this._oBOMItemDialogModel = new J(d);
			this._oBOMItemDialog = this._oFactoryBase.createFragment(this.getView().getId(), B, c);
			this._oBOMItemDialog.setModel(this._oBOMItemDialogVHModel, C.BOMItemDialogVHModel);
			this._oBOMItemDialog.setModel(this._oBOMItemDialogModel, C.BOMItemDialogModel);
			D = this._oBOMItemDialog.getController();
			this._oBOMItemDialog.setModel(this.getView().getModel().getOriginModel(), C.ODataModelName);
			E.attachResetStructurePanel(D.onCancel, D);
			this.getView().addDependent(this._oBOMItemDialog);
		},
		_getBOMItemDialog: function () {
			return this._oBOMItemDialog;
		},
		attachETOEvents: function () {
			E.attachOpenBOMItemDialogForChangeItem(this.openBOMItemChangeDialog, this);
			E.attachOpenBOMItemDialogForInsertItem(this.openBOMItemInsertDialog, this);
			E.attachDeleteBOMItem(this.deleteBOMItem, this);
			E.attachFixateBOMItem(this.fixateBOMItem, this);
			E.attachNavigateToBOMAppForInsertItem(this.navigateToBOMAppForInsertItem, this);
			E.attachNavigateToBOMAppForChangeItem(this.navigateToBOMAppForChangeItem, this);
		},
		detachETOEvents: function () {
			E.detachOpenBOMItemDialogForChangeItem(this.openBOMItemChangeDialog, this);
			E.detachOpenBOMItemDialogForInsertItem(this.openBOMItemInsertDialog, this);
			E.detachDeleteBOMItem(this.deleteBOMItem, this);
			E.detachFixateBOMItem(this.fixateBOMItem, this);
			E.detachNavigateToBOMAppForInsertItem(this.navigateToBOMAppForInsertItem, this);
			E.detachNavigateToBOMAppForChangeItem(this.navigateToBOMAppForChangeItem, this);
		},
		openBOMItemInsertDialog: function (e) {
			var o = new F({
				and: true,
				filters: [new F("FixedItemCategory", a.NE, C.FixedBOMItemCategory.CLASS_ITEM), new F("FixedItemCategory", a.NE, C.FixedBOMItemCategory
					.COMPATIBLE_UNIT), new F("FixedItemCategory", a.NE, C.FixedBOMItemCategory.INTRA_MATERIAL), new F("FixedItemCategory", a.NE, C.FixedBOMItemCategory
					.PM_STRUCTURE_ELEMENT)]
			});
			var d = {
				ContextId: S.getConfigurationContextId(),
				InstanceId: S.getCurrentlyFocusedBOMItem().InstanceId.trim()
			};
			var j = new J();
			j.setData(d);
			this._createBOMItemDialog(this._getDataForInsertBOMItemDialog());
			this._getBOMItemDialog().setModel(j, C.SelectedBOMItem);
			this._getBOMItemDialog().open();
			this._getBOMItemDialog().setBusy(true);
			this.getView().getModel().facadeRead("/I_BillOfMaterialItemCategory", null, null, [o]).then(function (f) {
				if (f.results.length > 0) {
					this._updateBOMItemDialogModel(f);
				} else {
					L.logError("Results for I_BillOfMaterialItemCategory request are empty. Please check!", [], this);
				}
				this._getBOMItemDialog().setBusy(false);
			}.bind(this)).catch(function (f) {
				this._getBOMItemDialog().close();
				this._getBOMItemDialog().setBusy(false);
				this.getView().getModel(C.VCHCLF_MODEL_NAME).displayErrorMessages([f]);
			}.bind(this));
		},
		openBOMItemChangeDialog: function (e) {
			var p = this.getView().getModel().createKey("/BOMNodeSet", {
				ComponentId: S.getCurrentlyFocusedBOMItem().ComponentId
			});
			var o = this.getView().getModel().getProperty(p);
			if (!o.ContextId) {
				o.ContextId = S.getConfigurationContextId();
			}
			if (!o.InstanceId) {
				o.InstanceId = S.getCurrentlyFocusedBOMItem().InstanceId.trim();
			}
			var j = new J();
			var d = S.getCurrentlyFocusedBOMItem();
			o.Quantity = d.ItemQuantity;
			j.setData(o);
			this._createBOMItemDialog(this._getDataForUpdateBOMItemDialog());
			this._getBOMItemDialog().setModel(j, C.SelectedBOMItem);
			this._getBOMItemDialog().open();
		},
		insertBOMItem: function (o) {
			var v = this.getView();
			v.setBusyIndicatorDelay(0);
			v.setBusy(true);
			var I = function () {
				return v.getModel().facadeCreate("/BOMNodeSet", o).then(function (d) {
					v.setBusy(false);
					v.getController().getOwnerComponent().reexplodeBOM();
					return d;
				}).catch(function (e) {
					v.setBusy(false);
					v.getModel(C.VCHCLF_MODEL_NAME).displayErrorMessages([e]);
				});
			};
			return I();
		},
		updateBOMItem: function (o) {
			var v = this.getView();
			var p = v.getModel().createKey("/BOMNodeSet", {
				ComponentId: S.getCurrentlyFocusedBOMItem().ComponentId
			});
			var n = v.getModel().getNavigationProperties(o);
			Object.keys(n).forEach(function (d) {
				delete o[d];
			});
			delete o.__metadata;
			v.setBusyIndicatorDelay(0);
			v.setBusy(true);
			v.getModel().facadeUpdate(p, o).then(function (d) {
				v.setBusy(false);
				v.getController().getOwnerComponent().reexplodeBOM();
				return d;
			}).catch(function (e) {
				v.setBusy(false);
				this.getView().getModel(C.VCHCLF_MODEL_NAME).displayErrorMessages([e]);
			}.bind(this));
		},
		deleteBOMItem: function () {
			var v = this.getView();
			var p = {
				ContextId: S.getConfigurationContextId(),
				InstanceId: S.getCurrentlyFocusedBOMItem().InstanceId.trim()
			};
			v.setBusyIndicatorDelay(0);
			v.setBusy(true);
			v.getModel().facadeCallFunction("/DeleteBOMItem", p).then(function (d) {
				var o = v.getController();
				var e = o.getOwnerComponent();
				v.setBusy(false);
				e.fireBOMComponentDeleted({
					objectPath: O.generateBOMNodePath(S.getConfigurationContextId(), S.getCurrentlyFocusedBOMItem().ComponentId)
				});
				o._valuateAndFocusOnRootComponent();
				o._explodeBOM();
				return d;
			}).catch(function (e) {
				v.setBusy(false);
				this.getView().getModel(C.VCHCLF_MODEL_NAME).displayErrorMessages([e]);
			}.bind(this));
		},
		fixateBOMItem: function (e) {
			var v = this.getView();
			v.setBusyIndicatorDelay(0);
			v.setBusy(true);
			v.getModel().facadeCallFunction("/CreateOrderBOM", {
				ContextId: S.getConfigurationContextId(),
				InstanceId: S.getCurrentlyFocusedBOMItem().InstanceId.trim(),
				FixOrderBOMMode: e.getParameter("fixOrderBOMMode")
			}).then(function (d) {
				v.setBusy(false);
				v.getController().getOwnerComponent().reexplodeBOM();
				return d;
			}).catch(function (o) {
				this.getView().setBusy(false);
				v.getModel(C.VCHCLF_MODEL_NAME).displayErrorMessages([o]);
			});
		},
		navigateToBOMAppForInsertItem: function () {
			var o = S.getCurrentlyFocusedBOMItem();
			this._navigateToBOMApp(o);
		},
		navigateToBOMAppForChangeItem: function () {
			var o = S.getCurrentlyFocusedBOMItem();
			var p = b.getBOMComponentById(o.ParentComponentId);
			this._navigateToBOMApp(p);
		}
	};
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/TablePersonalization', ["sap/base/util/deepExtend",
	"sap/ui/core/Fragment", "sap/ui/model/json/JSONModel"
], function (d, F, J) {
	"use strict";
	var T = function () {
		this._initialState = null;
		this._model = null;
		this._resolvePromise = null;
		this._stateBeforeOpen = null;
		this._personalizationDialog = null;
	};
	T.prototype.init = function (a, i) {
		this._initialState = {
			fixedColumnCount: i.fixedColumnCount,
			columnsItems: this._mapColumnsItemsArrayToObject(i.columnsItems)
		};
		var I = {
			isShowResetEnabled: false,
			items: a,
			fixedColumnCount: i.fixedColumnCount,
			columnsItems: i.columnsItems
		};
		if (!this._model) {
			this._model = new J(I);
		} else {
			this._model.setData(I);
		}
		if (this._personalizationDialog) {
			this._personalizationDialog.destroy();
			this._personalizationDialog = null;
		}
	};
	T.prototype.destroy = function () {
		if (this._personalizationDialog) {
			this._personalizationDialog.destroy();
			this._personalizationDialog = null;
		}
	};
	T.prototype.updateInitialState = function (i) {
		this._initialState = {
			fixedColumnCount: i.fixedColumnCount,
			columnsItems: this._mapColumnsItemsArrayToObject(i.columnsItems)
		};
		this._model.setProperty("/columnsItems", d([], i.columnsItems));
		this._model.setProperty("/fixedColumnCount", i.fixedColumnCount);
	};
	T.prototype.openSettingsDialog = function () {
		return new Promise(function (r) {
			this._resolvePromise = r;
			this._stateBeforeOpen = d([], this._model.getProperty("/columnsItems"));
			this._updateIsShowResetEnabled();
			this._getPersonalizationDialog().then(function (D) {
				D.open();
			});
		}.bind(this));
	};
	T.prototype.isColumnsItemsStateInitial = function () {
		if (this._initialState.fixedColumnCount !== this._model.getProperty("/fixedColumnCount")) {
			return false;
		}
		var c = this._model.getProperty("/columnsItems");
		if (c.length !== Object.values(this._initialState.columnsItems).length) {
			return false;
		}
		var i = true;
		$.each(c, function (I, C) {
			var o = this._initialState.columnsItems[C.columnKey];
			if (!o || o.visible !== C.visible || o.index !== C.index || o.width !== C.width) {
				i = false;
				return false;
			}
		}.bind(this));
		return i;
	};
	T.prototype.getSelectedColumns = function () {
		var s = [];
		$.each(this._model.getProperty("/columnsItems"), function (i, c) {
			if (c.visible) {
				s.push([c.index, c]);
			}
		});
		return $.map(s.sort(function (i, I) {
			return i[0] - I[0];
		}), function (S) {
			return S[1];
		});
	};
	T.prototype.getCurrentState = function () {
		return {
			fixedColumnCount: this._model.getProperty("/fixedColumnCount"),
			columnsItems: this._model.getProperty("/columnsItems")
		};
	};
	T.prototype.moveColumn = function (o, n) {
		var i = o < n;
		var c = d([], this._model.getProperty("/columnsItems"));
		$.each(c, function (I, C) {
			if (C.index === o) {
				C.index = n;
			} else if (i && C.index > o && C.index <= n) {
				C.index--;
			} else if (!i && C.index < o && C.index >= n) {
				C.index++;
			}
		});
		this._model.setProperty("/columnsItems", c);
	};
	T.prototype.setColumnWidth = function (c, w) {
		var C = d([], this._model.getProperty("/columnsItems"));
		$.each(C, function (i, o) {
			if (o.columnKey === c) {
				o.width = w;
				return false;
			}
		});
		this._model.setProperty("/columnsItems", C);
	};
	T.prototype.setFixedColumnCount = function (f) {
		this._model.setProperty("/fixedColumnCount", f);
	};
	T.prototype._onOKPressed = function () {
		this._resolvePromise({
			wasApplied: true
		});
		this._closeDialog();
	};
	T.prototype._onCancelPressed = function () {
		this._model.setProperty("/columnsItems", d([], this._stateBeforeOpen));
		this._resolvePromise({
			wasApplied: false
		});
		this._closeDialog();
	};
	T.prototype._onResetPressed = function () {
		this._model.setProperty("/columnsItems", d([], Object.values(this._initialState.columnsItems)));
		this._model.setProperty("/fixedColumnCount", this._initialState.fixedColumnCount);
	};
	T.prototype._onColumnsItemsChanged = function () {
		this._updateIsShowResetEnabled();
	};
	T.prototype._mapColumnsItemsArrayToObject = function (c) {
		var C = {};
		$.each(d([], c), function (i, o) {
			C[o.columnKey] = o;
		});
		return C;
	};
	T.prototype._updateIsShowResetEnabled = function () {
		this._model.setProperty("/isShowResetEnabled", !this.isColumnsItemsStateInitial());
	};
	T.prototype._getPersonalizationDialog = function () {
		return new Promise(function (r) {
			if (!this._personalizationDialog) {
				F.load({
					name: "sap.i2d.lo.lib.zvchclfz.components.structurepanel.fragment.TablePersonalizationDialog",
					controller: this
				}).then(function (p) {
					this._personalizationDialog = p;
					this._personalizationDialog.setModel(this._model);
					this._personalizationDialog.setEscapeHandler(function (P) {
						this._onCancelPressed();
						P.resolve();
					}.bind(this));
					r(this._personalizationDialog);
				}.bind(this));
			} else {
				r(this._personalizationDialog);
			}
		}.bind(this));
	};
	T.prototype._closeDialog = function () {
		this._stateBeforeOpen = null;
		this._getPersonalizationDialog().then(function (D) {
			D.close();
		});
	};
	return T;
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/i18n', [], function () {
	"use strict";
	var I = function () {
		this._model = null;
	};
	I.prototype.initModel = function (m) {
		if (!this._model) {
			this._model = m;
		}
	};
	I.prototype.getModel = function () {
		return this._model;
	};
	I.prototype.getText = function (i) {
		return this._model.getProperty(i);
	};
	I.prototype.getTextWithParameters = function (i, p) {
		if (this._model) {
			return this._model.getResourceBundle().getText(i, p);
		}
		return undefined;
	};
	return new I();
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/valuation/Component', ["sap/ui/core/UIComponent",
	"sap/i2d/lo/lib/zvchclfz/common/Constants", "sap/i2d/lo/lib/zvchclfz/common/util/CommandManager",
	"sap/i2d/lo/lib/zvchclfz/common/util/Toggle", "sap/i2d/lo/lib/zvchclfz/components/valuation/dao/ValuationDAO",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/util/GroupState", "sap/i2d/lo/lib/zvchclfz/components/valuation/model/ViewModel",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/model/AppStateModel", "sap/i2d/lo/lib/zvchclfz/components/configuration/factory/FactoryBase",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/type/GroupRepresentation", "sap/ui/model/Filter",
	"sap/i2d/lo/lib/zvchclfz/common/type/DescriptionMode"
], function (U, C, a, T, V, G, b, A, F, c, d) {
	"use strict";
	var e = {
		CREATE: "Create",
		EDIT: "Edit",
		DISPLAY: "Display"
	};
	return U.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.Component", {
		metadata: {
			manifest: "json",
			properties: {
				draftTransactionController: {
					type: "object"
				},
				modelName: {
					type: "string"
				},
				semanticObject: {
					type: "string"
				},
				objectKey: {
					type: "string"
				},
				uiMode: {
					type: "string",
					defaultValue: "Display"
				},
				groupRepresentation: {
					type: "sap.i2d.lo.lib.zvchclfz.components.valuation.type.GroupRepresentation",
					defaultValue: sap.i2d.lo.lib.zvchclfz.components.valuation.type.GroupRepresentation.Embedded
				},
				rootBindingPath: {
					type: "string"
				},
				descriptionMode: {
					type: "sap.i2d.lo.lib.zvchclfz.common.type.DescriptionMode",
					defaultValue: sap.i2d.lo.lib.zvchclfz.common.type.DescriptionMode.Description
				},
				showHiddenCharacteristics: {
					type: "boolean",
					defaultValue: false
				},
				showPreciseDecimalNumbers: {
					type: "boolean",
					defaultValue: false
				}
			},
			events: {
				characteristicSelected: {
					parameters: {
						path: {
							type: "string"
						}
					}
				},
				characteristicAssignmentTriggered: {},
				characteristicValueChanged: {
					parameters: {
						characteristicPath: {
							type: "String"
						}
					}
				},
				characteristicChanged: {
					parameters: {
						characteristicPath: {
							type: "string"
						}
					}
				},
				characteristicsChanged: {
					parameters: {
						changedCharacteristics: {
							type: "object[]"
						}
					}
				},
				collectPreloadedCharacteristicGroup: {
					parameters: {
						preloadedCharacteristicGroup: {
							type: "object"
						}
					}
				}
			},
			publicMethods: ["refreshRendering", "getUrlParameters"]
		},
		_oValuationDAO: null,
		_oGroupState: null,
		_oViewModel: null,
		_oAppStateModel: null,
		exit: function () {
			this._oView.destroy();
			this._oView = null;
			if (this._oGroupState) {
				this._getGroupState().destroy();
				delete this._getGroupState;
			}
			if (this._oViewModel) {
				this._oViewModel.destroy();
				delete this._oViewModel;
			}
			if (this._oAppStateModel) {
				this._oAppStateModel.destroy();
				delete this._oAppStateModel;
			}
			a.reset();
			if (this.oFilterDialog) {
				this.oFilterDialog.destroy();
			}
		},
		getEmbedderName: function () {
			var p = this.getBindingContext(C.VIEW_MODEL_NAME).getPath();
			if (p.indexOf("ContextId='VCH") >= 0) {
				return C.CONFIGURATION;
			}
			if (p.indexOf("ContextId='CLF") >= 0) {
				return C.CLASSIFICATION;
			}
			return undefined;
		},
		createContent: function () {
			this._getValuationSettingsModel().setProperty("/showGroupTitle", false);
			this._getValuationSettingsModel().setProperty("/showHiddenCharacteristics", false);
			this._getValuationSettingsModel().setProperty("/showPreciseDecimalNumbers", false);
			this._oView = sap.ui.view({
				id: this.createId("valuationView"),
				viewName: "sap.i2d.lo.lib.zvchclfz.components.valuation.view.Valuation",
				type: sap.ui.core.mvc.ViewType.XML
			});
			return this._oView;
		},
		refreshRendering: function () {
			var B = this.getBindingContext(C.VIEW_MODEL_NAME);
			this.updateRootBindingContext(B, null, true);
		},
		getUrlParameters: function () {
			var g = this.getGroupRepresentation();
			var E;
			var s;
			var u = {};
			if (g === c.Embedded) {
				E =
					"CharacteristicsGroups,CharacteristicsGroups/Characteristics,CharacteristicsGroups/Characteristics/DomainValues,CharacteristicsGroups/Characteristics/AssignedValues";
				s = {
					search: "SkipCharacteristics=0,TopCharacteristics=30"
				};
			} else if (g === c.FullScreen) {
				E = "CharacteristicsGroups";
			}
			if (E) {
				u.$expand = E;
			}
			if (s) {
				u.custom = s;
			}
			return u;
		},
		initGroupStateModel: function () {
			this._getGroupState().initStateModel();
		},
		initAppStateModel: function () {
			this._getAppStateModel().initModel();
		},
		preloadGroup: function (s) {
			this._getAppStateModel().setGroup(1, 1);
			var v = this._getValuationDAO();
			return v.readCharacteristicsOfGroup({
				ContextId: s,
				InstanceId: 1,
				GroupId: 1
			});
		},
		_getValuationDAO: function () {
			if (!this._oValuationDAO) {
				this._oValuationDAO = new V({
					dataModel: this._getDataModel(),
					appStateModel: this._getAppStateModel(),
					groupState: this._getGroupState(),
					draftTransactionController: this.getDraftTransactionController(),
					editable: "{valuationSettings>/editable}",
					showHiddenCharacteristics: "{valuationSettings>/showHiddenCharacteristics}",
					valuationComponent: this
				});
				this._oValuationDAO.setModel(this._getValuationSettingsModel(), C.VALUATION_SETTINGS_MODEL_NAME);
				this._oValuationDAO.attachCharacteristicsChanged(function (E) {
					this.fireCharacteristicsChanged(E.getParameters());
				}.bind(this));
				this._oValuationDAO.attachGroupsChanged(function () {
					if (this.oFilterDialog && this.getGroupRepresentation() === c.Embedded) {
						this.oFilterDialog.getController().applyBindingFilterForEmbeddedMode();
					}
				}.bind(this));
			}
			return this._oValuationDAO;
		},
		getGroupElementsBinding: function () {
			var B = [];
			this._getGroupState().iterateStates(function (s) {
				B.push(s.bindingInfo.binding);
			}, this);
			return B;
		},
		_getGroupState: function () {
			if (!this._oGroupState) {
				this._oGroupState = new G();
			}
			return this._oGroupState;
		},
		_getViewModel: function () {
			if (!this._oViewModel) {
				this._oViewModel = new b(this._getValuationDAO());
				this.setModel(this._oViewModel, C.VIEW_MODEL_NAME);
			}
			return this._oViewModel;
		},
		_getAppStateModel: function () {
			if (!this._oAppStateModel) {
				this._oAppStateModel = new A();
				this._oAppStateModel.initModel();
				this.setModel(this._oAppStateModel, "appStateModel");
			}
			return this._oAppStateModel;
		},
		_getDataModel: function () {
			return this.getModel(C.VCHCLF_MODEL_NAME);
		},
		onBeforeRendering: function () {
			this._getView().getController().setViewModel(this._getViewModel());
			this._getView().getController().setGroupState(this._getGroupState());
			this._getView().getController().setValuationDAO(this._getValuationDAO());
			var g = this.getGroupRepresentation();
			this._getValuationSettingsModel().setProperty("/groupRepresentation", [g]);
			if (this.getModelName() && this.getModelName() !== C.VCHCLF_MODEL_NAME && !this.getModel(C.VCHCLF_MODEL_NAME)) {
				var o = this.getModel(this.getModelName());
				this.setModel(o, C.VCHCLF_MODEL_NAME);
				this.updateRootBindingContext(null, this.getRootBindingPath(), false);
			}
			this._getValuationSettingsModel().setProperty("/descriptionModeCharacteristics", this.getDescriptionMode());
			this._getValuationSettingsModel().setProperty("/descriptionModeValues", this.getDescriptionMode());
			this._getValuationSettingsModel().setProperty("/showPreciseDecimalNumbers", this.getShowPreciseDecimalNumbers());
			this._getValuationSettingsModel().setProperty("/valuationStepsCount", 0);
		},
		_createFilterDialog: function () {
			var f = this._getFactoryBase();
			var s = "sap.i2d.lo.lib.zvchclfz.components.valuation.view.fragment.filter.FilterDialog";
			var g = "sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.filter.Filter";
			return f.createFragment(this._getView().getId(), s, g);
		},
		openFilterDialog: function (f) {
			if (!this.oFilterDialog) {
				this.oFilterDialog = this._createFilterDialog();
				var o = this.oFilterDialog.getController().getFilterModel();
				this.oFilterDialog.setModel(o, "filterModel");
				this.oFilterDialog.getSource = function () {
					return f;
				};
				this._getView().addDependent(this.oFilterDialog);
			}
			this.oFilterDialog.open();
		},
		removeCharacteristicFilter: function () {
			if (this.oFilterDialog) {
				this.oFilterDialog.getController().onRemoveFilter();
			}
		},
		_getFactoryBase: function () {
			if (!this._oFactoryBase) {
				this._oFactoryBase = new F({
					controller: this,
					view: this._getView()
				});
			}
			return this._oFactoryBase;
		},
		highlightCharacteristic: function (p) {
			var o = this._getCharacteristicFactory().getCharacteristicControlByPath(p);
			if (o && o.focus) {
				o.focus();
			}
		},
		resetViewModel: function () {
			this._getViewModel().reset();
		},
		setUiMode: function (u) {
			this.setProperty("uiMode", u);
			var E = u === e.CREATE || u === e.EDIT;
			this._getValuationSettingsModel().setProperty("/editable", E);
		},
		setRootBindingPath: function (r, f) {
			this.setProperty("rootBindingPath", r);
			if (this._getDataModel()) {
				return this.updateRootBindingContext(null, r, f);
			} else {
				return Promise.resolve();
			}
		},
		setShowHiddenCharacteristics: function (s) {
			var f = this.getShowHiddenCharacteristics();
			if (f !== s) {
				this.setProperty("showHiddenCharacteristics", s);
				this._getValuationSettingsModel().setProperty("/showHiddenCharacteristics", s);
				var B = this.getBindingContext(C.VIEW_MODEL_NAME);
				this.getModel("appStateModel").resetSkipTop();
				this._getValuationDAO().readCharacteristics(B, false, true, true);
				this._updateFilterOnForms(s);
			}
		},
		updateRootBindingContext: function (B, s, f) {
			var o = this._getAppStateModel();
			var n = B ? B.getPath() : s;
			if (!n) {
				return Promise.resolve();
			}
			var N = this._getDataModel().getObject(n);
			if (N) {
				var g = N.InstanceId;
				var h = o.getSelectedGroup(g) || 1;
				var i = o.getGroupLoaded(g, h) || false;
			}
			if (typeof n === "string") {
				var j = this.getBindingContext(C.VIEW_MODEL_NAME);
				if (j) {
					var O = j.getPath();
				}
				var r = O !== n;
				var v = this._getViewModel();
				this.setValuationBusy(true);
				if (r) {
					a.reset();
					v.setBindingPath(n);
					if (!i || !O) {
						return v.sync(h).then(function (k) {
							this.setBindingContext(k, C.VIEW_MODEL_NAME);
							this._setSelectedGroup(k);
							this.setValuationBusy(false);
						}.bind(this));
					} else {
						return new Promise(function (R, k) {
							v.createBindingContext(n, function (l) {
								this.setBindingContext(l, C.VIEW_MODEL_NAME);
								this._setSelectedGroup(l);
								this.setValuationBusy(false);
								R();
							}.bind(this));
						}.bind(this));
					}
				} else if (f) {
					return v.sync(null, true).then(this.setValuationBusy.bind(this, false));
				}
			} else {
				this.setValuationBusy(false);
				jQuery.sap.log.error("Valuation component: Update root binding path called wrongly");
				return Promise.resolve();
			}
		},
		setValuationBusy: function (B) {
			var v = this.getRootControl();
			v.setBusyIndicatorDelay(0);
			v.setBusy(B);
		},
		removeRootBindingContext: function () {
			this.setBindingContext(null, C.VIEW_MODEL_NAME);
			this.initGroupStateModel();
			this.initAppStateModel();
			this._getValuationDAO().init();
		},
		_setSelectedGroup: function (o) {
			var i = this._getDataModel().getProperty("InstanceId", o);
			var s = this._getAppStateModel().getSelectedGroup(i);
			var g = this._getView().byId("groupVBox").getItems()[0];
			if (g && g.getMetadata().getName() === "sap.m.IconTabBar") {
				var f = g.getItems();
				if (f.length > 0) {
					if (s) {
						f.forEach(function (h) {
							if (h.getBindingContext("view").getObject().GroupId === s) {
								g.setSelectedKey(h.getId());
							}
						});
					} else {
						g.setSelectedKey(f[0].getId());
					}
				}
			}
		},
		setSemanticObject: function (s) {
			this.setProperty("semanticObject", s);
			this._getValuationSettingsModel().setProperty("/semanticObject", s);
		},
		setObjectKey: function (o) {
			this.setProperty("objectKey", o);
			this._getValuationSettingsModel().setProperty("/objectKey", o);
		},
		setDescriptionMode: function (t) {
			this.setProperty("descriptionMode", t);
			this._getValuationSettingsModel().setProperty("/descriptionModeCharacteristics", t);
			this._getValuationSettingsModel().setProperty("/descriptionModeValues", t);
		},
		setShowPreciseDecimalNumbers: function (s) {
			this.setProperty("showPreciseDecimalNumbers", s);
			this._getValuationSettingsModel().setProperty("/showPreciseDecimalNumbers", s);
		},
		setGroupCount: function (g) {
			this._getValuationSettingsModel().setProperty("/groupCount", g);
			this._getValuationSettingsModel().setProperty("/showGroupTitle", g > 1);
			this._getValuationSettingsModel().setProperty("/showNoCharacteristicText", !g);
		},
		_getValuationSettingsModel: function () {
			return this.getModel(C.VALUATION_SETTINGS_MODEL_NAME);
		},
		_getCharacteristicFactory: function () {
			var o = this.getAggregation("rootControl").getController();
			return o.getCharacteristicFactory();
		},
		_getView: function () {
			return this._oView;
		},
		_updateFilterOnForms: function (s) {
			var g = this.getGroupElementsBinding();
			var f = [];
			if (!s) {
				f.push(new d({
					path: "IsHidden",
					operator: 'EQ',
					value1: s
				}));
			}
			for (var i = 0; i < g.length; i++) {
				g[i].filter(f);
			}
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/valuation/control/SelectDialogListItem', ["sap/m/CustomListItem",
	"sap/m/CustomListItemRenderer", "sap/m/Input", "sap/m/Button", "sap/ui/layout/HorizontalLayout",
	"sap/i2d/lo/lib/zvchclfz/common/Constants", "sap/ui/core/Icon",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/formatter/CharacteristicFormatter"
], function (C, a, I, B, H, b, c, d) {
	"use strict";
	var L = {
		singleMode: "SingleSelectMaster"
	};
	return C.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.control.SelectDialogListItem", {
		metadata: {
			properties: {
				readonly: {
					type: "boolean",
					defaultValue: false
				},
				intervalDomainValue: {
					type: "boolean",
					defaultValue: false
				},
				assigned: {
					type: "boolean",
					defaultValue: false
				}
			}
		},
		_bSubmitAttached: false,
		init: function () {
			C.prototype.init.apply(this, arguments);
		},
		getValue: function () {
			var l = this.getBindingContext(b.VIEW_MODEL_NAME).getObject();
			var v = {};
			if (this.getIntervalDomainValue()) {
				v.UserInput = this._getUserInput();
				if (v.UserInput === "") {
					v.TechnicalValue = l.TechnicalValue;
				}
			} else {
				v.TechnicalValue = l.TechnicalValue;
			}
			return v;
		},
		_getUserInput: function () {
			if (this.getAggregation("content") && this._getIntervalInput() && this._getIntervalInput().getValue()) {
				return this._getIntervalInput().getValue();
			} else {
				return this.getParent().aUserInput[this.getBindingContext(b.VIEW_MODEL_NAME).getPath()];
			}
		},
		_getIntervalInput: function () {
			return this.getAggregation("content")[0].getAggregation("items")[1].getAggregation("items")[0];
		},
		_getAssignButton: function () {
			return this.getAggregation("content")[0].getAggregation("items")[1].getAggregation("items")[1];
		},
		_getText: function () {
			return this.getAggregation("content")[0].getAggregation("items")[0].getAggregation("items")[0].getAggregation("items")[1];
		},
		_getArrowIcon: function () {
			return this.getAggregation("content")[1];
		},
		_isSingleMode: function () {
			return this.getMode() === L.singleMode;
		},
		_onSubmit: function (e) {
			this.informList("InputSelect", true);
		},
		_handleVisibilityOfInputFieldAndButton: function () {
			var i = this.getSelected() && this.getIntervalDomainValue();
			var A = i && this._isSingleMode();
			this._getIntervalInput().setVisible(i);
			this._getAssignButton().setVisible(A);
		},
		_toggleRequiredStyleClasses: function (t) {
			if (!this._isSingleMode() && this.getIntervalDomainValue()) {
				this.toggleStyleClass("sapVchlclfSDLICheckboxTop", t);
			}
			var T = !this._getText().getVisible() && t;
			this._getArrowIcon().toggleStyleClass("sapVchclfIntervalArrowTinyTop", T);
		},
		setSelected: function (s) {
			C.prototype.setSelected.apply(this, arguments);
			this._handleVisibilityOfInputFieldAndButton();
			this._toggleRequiredStyleClasses(s);
			var i = this._getIntervalInput();
			if (this.getIntervalDomainValue() && s === false) {
				i.setValue("");
			}
			if (s) {
				var A = {
					onAfterRendering: function () {
						i.removeEventDelegate(A);
						i.focus();
					}
				};
				i.addEventDelegate(A);
			}
		},
		informList: function (e, p, P) {
			if (this.getIntervalDomainValue()) {
				if (this._isSingleMode() && e === "Select") {
					return;
				}
				if (e === "InputSelect") {
					e = "Select";
				}
			}
			C.prototype.informList.call(this, e, p, P);
		},
		onBeforeRendering: function () {
			this._handleVisibilityOfInputFieldAndButton();
			var o = this._getAssignButton();
			var s = this.getParent();
			if (!s.aUserInput) {
				s.aUserInput = [];
			}
			var p = this.getBindingContext(b.VIEW_MODEL_NAME).getPath();
			if (!s.aUserInput[p]) {
				s.aUserInput[p] = "";
			}
			var i = this._getIntervalInput();
			var v = this.getBindingContext("view").getObject();
			var e = this.getModel("i18n").getResourceBundle();
			var n = e.getText("VALUE_LABEL_NO_VALUE");
			var r = e.getText("ROUNDED_VALUE_PREFIX");
			var f = e.getText("INTERVAL_REPRESENTATION");
			if (s.aUserInput[p]) {
				i.setValue(s.aUserInput[p]);
			} else if (this.getSelected() && this.getAssigned()) {
				i.setValue(d.getFormattedValueText(v, n, r, f, true));
			}
			i.attachLiveChange(function (E) {
				s.aUserInput[p] = E.getParameter("newValue");
			});
			if (!this._bSubmitAttached) {
				i.attachSubmit(this._onSubmit, this);
				o.attachPress(this._onSubmit, this);
				this._bSubmitAttached = true;
			}
			if (this.getIntervalDomainValue() && !this._isSingleMode()) {
				this._getAssignButton().setVisible(false);
				i.setWidth("250px");
			}
		},
		getMultiSelectControl: function () {
			var m = C.prototype.getMultiSelectControl.apply(this, arguments);
			if (m) {
				m.setEnabled(!this.getReadonly());
			}
			return m;
		},
		renderer: function (r, o) {
			a.render(r, o);
		},
		ontap: function (e) {
			if (this.getReadonly()) {
				return;
			}
			e.setMarked("preventSelectionChange");
			C.prototype.ontap.call(this, e);
		},
		onsapselect: function (e) {
			if (this.getReadonly()) {
				return;
			}
			e.setMarked("preventSelectionChange");
			if (C.prototype.onsapselect) {
				C.prototype.onsapselect.call(this, e);
			}
		}
	});
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/valuation/control/ValueHelpDialog', ["sap/ui/core/XMLComposite",
	"sap/i2d/lo/lib/zvchclfz/common/Constants", "sap/m/GroupHeaderListItem",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/formatter/CharacteristicFormatter"
], function (X, C, G, f) {
	"use strict";
	return X.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.control.ValueHelpDialog", {
		metadata: {
			properties: {
				undoValues: {
					type: "object"
				}
			},
			events: {
				"change": {
					parameters: {
						value: {
							type: "string"
						},
						technicalValues: {
							type: "string[]"
						}
					}
				}
			}
		},
		formatter: f,
		open: function () {
			this.getDialog().open();
		},
		setBusy: function (b) {
			this.getDialog().setBusyIndicatorDelay(100);
			this.getDialog().setBusy(b);
		},
		getDialog: function () {
			return this.byId("valueHelpDialog");
		},
		onSelectDialogConfirm: function (e) {
			var s = e.getParameter("selectedContexts");
			var S = e.getSource();
			var I = S.getBinding("items");
			if (I.aApplicationFilters.length > 0 || I.aFilters.length > 0) {
				I.filter([]);
			}
			var a = S.getItems();
			var b = function (o) {
				for (var i = 0; i < s.length; i++) {
					if (o.getBindingContext(C.VIEW_MODEL_NAME).getPath() === s[i].getPath()) {
						return true;
					}
				}
				return false;
			};
			var c = a.filter(b);
			var t = this._getTechValuesIgnoringReadonly(c);
			var v = this._getConcatenatedUserInputs(c);
			if (this._shallTriggerUnassignAll(c)) {
				this.fireChange({
					value: v,
					technicalValues: t
				});
			} else if (this._shallTriggerAssignValue(c, this.getUndoValues())) {
				this.fireChange({
					value: v,
					technicalValues: t
				});
			}
		},
		_shallTriggerAssignValue: function (s, u) {
			var h = !this._hasOnlyObjectDependencyValues(s);
			var i = u.ValueObject.StringValue || u.ValueObject.TechnicalValue;
			var S = h || i;
			return S;
		},
		includeValueIntoAssign: function (i) {
			return !i.getBindingContext(C.VIEW_MODEL_NAME).getObject().IsSetByObjectDependency;
		},
		filterUndefinedValues: function (i) {
			return (i !== undefined);
		},
		_hasOnlyObjectDependencyValues: function (s) {
			var S = false;
			var h = false;
			s.forEach(function (i) {
				var v = i.getBindingContext(C.VIEW_MODEL_NAME).getObject();
				if (v.IsSetByObjectDependency) {
					S = true;
				} else {
					h = true;
				}
			});
			return !h && S;
		},
		_shallTriggerUnassignAll: function (s) {
			if (!s | s.length === 0) {
				return true;
			} else if (s.length === 1) {
				var v = s[0].getBindingContext(C.VIEW_MODEL_NAME).getObject();
				if (v.ValueId === "0" && v.TechnicalValue === "") {
					return true;
				}
			}
			return false;
		},
		isIntervalDomain: function (v) {
			return !this._isValueAssigned(v, false) && !!v.FormattedValueTo;
		},
		isListItemAssigned: function (v) {
			return this._isValueAssigned(v, false);
		},
		isListItemSelected: function (v) {
			return this._isValueAssigned(v, true);
		},
		_isValueAssigned: function (v, s) {
			if (s) {
				var S = this._getSelectedState();
			}
			if (!s) {
				return v.Assigned || v.IsSelected;
			} else {
				var V = v.ValueId;
				if (!S[V] && (v.Assigned || v.IsSelected)) {
					S[V] = true;
					return true;
				}
			}
			return false;
		},
		_getTechValuesIgnoringReadonly: function (s) {
			var g = function (S) {
				return S.getValue().TechnicalValue;
			};
			return s.filter(this.includeValueIntoAssign).map(g).filter(this.filterUndefinedValues);
		},
		_getConcatenatedUserInputs: function (s) {
			var g = function (S) {
				return S.getValue().UserInput;
			};
			return s.filter(this.includeValueIntoAssign).map(g).filter(this.filterUndefinedValues).join(";");
		},
		_getSelectedState: function () {
			if (!this._selectedState) {
				this._selectedState = {};
			}
			return this._selectedState;
		},
		getGroupHeader: function (g) {
			var t = this.getText("PREDEFINED_VALUES");
			if (g && !g.key) {
				t = this.getText("ADDITIONAL_VALUES");
			}
			return new G({
				title: t,
				upperCase: false
			});
		},
		getResourceBundle: function () {
			if (!this._vchI18nResourceBundle) {
				this._vchI18nResourceBundle = this.getModel("i18n").getResourceBundle();
			}
			return this._vchI18nResourceBundle;
		},
		getText: function (k, p) {
			return this.getResourceBundle().getText(k, p);
		},
		onSearchInSelectDialog: function (e) {
			var v = e.getParameter("value");
			var F = new sap.ui.model.Filter("Description", sap.ui.model.FilterOperator.Contains, v);
			var o = new sap.ui.model.Filter("FormattedValueFrom", sap.ui.model.FilterOperator.Contains, v);
			var a = new sap.ui.model.Filter({
				filters: [F, o],
				and: false
			});
			var b = e.getSource().getBinding("items");
			b.filter([a]);
		}
	});
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/valuation/control/characteristic/Characteristic', ["sap/m/FlexBox",
	"sap/m/FlexBoxRenderer", "sap/m/Label", "sap/i2d/lo/lib/zvchclfz/components/valuation/control/characteristic/type/Text",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/control/characteristic/type/Input",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/control/characteristic/type/Select",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/control/characteristic/type/MultiInput",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/control/ValueHelpDialog", "sap/i2d/lo/lib/zvchclfz/common/util/CommandManager",
	"sap/i2d/lo/lib/zvchclfz/common/util/Command", "sap/i2d/lo/lib/zvchclfz/common/util/Helper",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/util/MessageManager", "sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/type/Characteristic",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/type/GroupRepresentation",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/formatter/CharacteristicFormatter", "sap/i2d/lo/lib/zvchclfz/common/util/Logger"
], function (F, a, L, T, I, S, M, V, C, b, H, c, d, e, G, f, g) {
	"use strict";
	var h = function () {
		if (this.bIsDestroyed) {
			return sap.ui.getCore().byId(this.getId()) || this;
		}
		return this;
	};
	var k = {
		"INPUT": I,
		"MULTI_INPUT": M,
		"SELECT": S,
		"TEXT": T
	};
	var D = 20;
	var l = {
		MULTI_INPUT_LESS_DOM_VAL: 0,
		MULTI_INPUT_MANY_DOM_VAL: 1,
		SINGLE_VALUE_NO_ADDITIONAL_VALUES: 2,
		SINGLE_INPUT_ADDITIONAL_VALUES: 3,
		SINGLE_INPUT_MANY_DOM_VAL: 4,
		SINGLE_INPUT_LESS_DOM_VAL: 5
	};
	return F.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.Characteristic", {
		metadata: {
			properties: {
				editable: {
					type: "boolean"
				},
				valuationDAO: {
					type: "sap.i2d.lo.lib.zvchclfz.components.valuation.dao.ValuationDAO"
				},
				groupBindingContext: {
					type: "sap.ui.model.Context"
				},
				groupRepresentation: {
					type: "sap.i2d.lo.lib.zvchclfz.components.valuation.type.GroupRepresentation"
				},
				embedderName: {
					type: "string"
				},
				settingsModel: {
					type: "sap.ui.model.Model"
				}
			},
			events: {
				"select": {
					parameters: {
						path: {
							type: "string"
						}
					}
				},
				"undoRedo": {},
				"change": {
					path: {
						type: "string"
					}
				},
				"afterChange": {
					path: {
						type: "string"
					}
				}
			}
		},
		constructor: function (i, s, o) {
			s.direction = "Column";
			s.fitContainer = true;
			s.justifyContent = "End";
			F.prototype.constructor.apply(this, [i, s, o]);
			this.bValueHelpOpen = false;
			this.oAlternativeValuesLoadPromise = Promise.resolve();
			this.oValueAssignPromise = Promise.resolve();
			this.addStyleClass("sapVchclfCsticFlexBox");
			this.bIsSettingParent = false;
		},
		renderer: function (r, o) {
			a.render(r, o);
		},
		_oCharacteristicType: null,
		_createId: function (i) {
			return this.getId() + "--" + i;
		},
		setEditable: function (E) {
			var i = this.getEditable();
			this.setProperty("editable", E);
			if (E !== i) {
				this._updateCharacteristicType();
			}
		},
		_updateCharacteristicType: function () {
			if (!this.bIsSettingParent) {
				var o = this._getCharacteristicData();
				if (!o) {
					return;
				}
				if (this._oCharacteristicType) {
					this._oCharacteristicType.destroy();
				}
				if (this._oCharacteristicLabel) {
					this._oCharacteristicLabel.destroy();
				}
				this._oCharacteristicType = this._createCharacteristicType();
				this._oCharacteristicLabel = this._oCharacteristicType.createLabel.apply(this._oCharacteristicType);
				this.addItem(this._oCharacteristicLabel);
				this.addItem(this._oCharacteristicType);
				g.logDebug("Characteristic _updateCharacteristicType '{0}'", [o.CsticId], this);
			}
		},
		setParent: function (p) {
			this.bIsSettingParent = true;
			F.prototype.setParent.apply(this, arguments);
			this.bIsSettingParent = false;
			if (p) {
				this._updateCharacteristicType();
			}
			return this;
		},
		_createCharacteristicType: function () {
			var i = this._getCountOfAvailableDomValues();
			var s = this._isSingleValued();
			var u = this._isUserInputNecessary();
			var j = this._isIntervalAllowed();
			var m = this._domainHasIntervalValues();
			var t = this._determineCharacteristicType(i, s, u, j, m, this.getEditable());
			var n = this._createId("characteristic");
			var o = null;
			var p = k[t];
			if (p) {
				o = new p(n, {
					embedderName: this.getEmbedderName()
				});
			} else {
				throw new Error("Unknown control type: " + t);
			}
			this._registerBasicEvents(o);
			return o;
		},
		_registerBasicEvents: function (t) {
			t.attachChange(this._onValueChange, this);
			t.attachAcceptDefaultValues(this._onAcceptDefaultValues, this);
			t.attachAlternativeValueRequest(this._onAlternativeValueRequest, this);
			t.attachValueHelpRequest(this._onValueHelpRequest, this);
			t.attachSelect(this._onSelect, this);
		},
		setEmbedderName: function (E) {
			this.setProperty("embedderName", E);
			if (this._oCharacteristicType) {
				this._oCharacteristicType.setEmbedderName(E);
			}
		},
		_onValueChange: function (E) {
			var v = E.getParameter("value");
			var t = E.getParameter("technicalValues");
			var B = E.getParameter("binding");
			this.applyValue(v, t, B);
		},
		applyValue: function (v, t, B, i) {
			var s = t.join(";");
			var o = this._getCharacteristicData();
			this.oValueAssignPromise = new Promise(function (r, j) {
				if (s || v) {
					this.assignEnteredValue(v, s, o, i).then(function () {
						if (B) {
							B.refresh(true);
						}
						r();
					});
				} else {
					this.unassignAllValuesAndVisualizeDefault().then(function () {
						r();
					});
				}
			}.bind(this));
			return this.oValueAssignPromise;
		},
		_onSelect: function () {
			this.fireSelect({
				path: this.getValuationDAO().createCharacteristicKey(this._getCharacteristicData())
			});
		},
		_onValueHelpRequest: function () {
			if (this._oCharacteristicType.hasValueChanged()) {
				var v = this._oCharacteristicType.getValue();
				var t = this._oCharacteristicType.getTechnicalValues();
				var B = this._oCharacteristicType.getBinding("value");
				this.applyValue(v, t, B, true).then(function () {
					this._openValueHelpDialog();
				}.bind(this));
			} else {
				this._openValueHelpDialog();
			}
		},
		_openValueHelpDialog: function () {
			var t = h.apply(this);
			var v = new V();
			v.attachChange(t._onValueChange, t);
			t.addDependent(v);
			v.setUndoValues(t.getUndoValues());
			v.open();
			var j = function () {
				t.bValueHelpOpen = false;
			}.bind(t);
			v.getDialog().attachCancel(null, j);
			v.getDialog().attachConfirm(null, j);
			t.bValueHelpOpen = true;
			v.setBusy(true);
			var s = [];
			var m;
			var i, o;
			var n = v.getDialog().getItems();
			if (n.length > 0) {
				var p = n[0].getParent().getSelectedContexts();
				for (i = 0; i < p.length; i++) {
					o = p[i].getObject();
					m = t.getModel("vchclf").getKey(o);
					s.push(m);
				}
			}
			g.logDebug("Characteristic _openValueHelpDialog - selection stored", null, t);
			Promise.all([t.oAlternativeValuesLoadPromise, t.oValueAssignPromise]).then(function () {
				g.logDebug("Characteristic _openValueHelpDialog - re-apply selection", null, t);
				var K;
				var B;
				if (s.length > 0) {
					var n = v.getDialog().getItems();
					for (i = 0; i < n.length; i++) {
						B = n[i].getBindingInfo("selected");
						if (B) {
							K = t.getModel("vchclf").getKey(B.binding.getValue());
							if ($.inArray(K, s) > -1) {
								n[i].setSelected(true);
							}
						}
					}
				}
				v.setBusy(false);
			}.bind(t));
		},
		_getCharacteristicData: function () {
			var o = this.getBindingContext(d.VIEW_MODEL_NAME);
			return o ? o.getObject() : null;
		},
		focus: function () {
			this._oCharacteristicType.focus();
		},
		_onAcceptDefaultValues: function (E) {
			this.assignDefaultValues().then(function () {
				this.focus();
			}.bind(this));
		},
		_onAlternativeValueRequest: function (E) {
			var o = this._getCharacteristicData();
			var B = E.binding;
			var O = E.open;
			var i = E.error;
			if (E.getParameter) {
				B = E.getParameter("binding");
				O = E.getParameter("open");
				i = E.getParameter("error");
			}
			g.logDebug("Characteristic _onAlternativeValueRequest", null, this);
			if (!this.bValueHelpOpen) {
				if (this.getValuationDAO().isLoadNeeded(o)) {
					g.logDebug("Characteristic loadAlternativeValues - requested", null, this);
					this.oAlternativeValuesLoadPromise = this.getValuationDAO().loadAlternativeValues(o, B, E, true);
					this.oAlternativeValuesLoadPromise.then(function () {
						if (O) {
							O();
						}
						g.logDebug("Characteristic loadAlternativeValues - resolved", null, this);
					}.bind(this));
				} else {
					if (i) {
						i();
					}
					g.logDebug("Characteristic loadAlternativeValues - not needed", null, this);
				}
			}
		},
		assignDefaultValues: function () {
			var o = this._getCharacteristicData();
			var s = "";
			var v = o.AssignedValues;
			for (var j = 0; v.length > j; j++) {
				var i = v[j];
				if (!i.IsSetByObjectDependency) {
					if (i.IsDefaultValue || i.IsSelected) {
						if (s.length > 0) {
							s = s.concat(";");
						}
						s = s.concat(i.TechnicalValue);
					}
				}
			}
			var r = this._createValuesObject(o, "", "", s, 1);
			var u = this.getUndoValues();
			return this.characteristicValueAssign(r, u, o);
		},
		assignEnteredValue: function (E, s, o, i) {
			var r = this._createValuesObject(o, "", E, s, 1);
			var u = this.getUndoValues();
			return this.characteristicValueAssign(r, u, o, i);
		},
		_createValuesObject: function (o, v, E, s, i) {
			return {
				Direction: i,
				ValueObject: {
					ContextId: o.ContextId,
					InstanceId: o.InstanceId,
					GroupId: o.GroupId,
					CsticId: o.CsticId,
					ValueId: v,
					StringValue: E,
					TechnicalValue: s
				}
			};
		},
		getUndoValues: function (m) {
			var o = this._getCharacteristicData();
			var p = this._getConcatenatedValues();
			var v = "0";
			var i = -1;
			if (m || p) {
				i = 1;
				v = "";
			}
			return this._createValuesObject(o, v, "", p, i);
		},
		_getConcatenatedValues: function () {
			var s = "";
			var o = this._getCharacteristicData();
			var v = o.AssignedValues;
			for (var j = 0; v.length > j; j++) {
				var i = v[j];
				if (!i.IsDefaultValue && !i.IsReadonly) {
					if (s.length > 0) {
						s = s.concat(";");
					}
					s = s.concat(i.TechnicalValue);
				}
			}
			return s;
		},
		characteristicValueAssign: function (r, u, o, i) {
			try {
				var j = this._getCommandforUnAssign(r, u, o);
				var p;
				if (i) {
					p = j.execute();
				} else {
					p = this._executeCommandAndStoreInUndoRedoChain(j);
				}
				return p;
			} catch (E) {
				this._handleValuationError(E);
			}
		},
		_executeCommandAndStoreInUndoRedoChain: function (o) {
			return C.execute(o);
		},
		_getCommandforUnAssign: function (r, u, o) {
			return new b(this.getId(), {
				oValue: r,
				oCsticData: o,
				oCstic: this,
				execute: function () {
					return this.oCstic._fnUndoRedo.apply(this.oCstic, [this.oValue.Direction, this.oValue.ValueObject, this.oCsticData]);
				}
			}, {
				oValue: u,
				oCsticData: o,
				oCstic: this,
				execute: function () {
					return this.oCstic._fnUndoRedo.apply(this.oCstic, [this.oValue.Direction, this.oValue.ValueObject, this.oCsticData]);
				}
			});
		},
		_fnUndoRedo: function (i, v, o) {
			var t = h.apply(this);
			var p = [];
			t._setBusy(true);
			var j = t.getEmbedderName() === d.CONFIGURATION;
			var m = t.getValuationDAO();
			c.dropCharacteristicMessages();
			var A = m.assignCharacteristicValue(v, i, o, j);
			var n = t._onCsticValueChanged(v).then(function (r) {
				t._onCsticValueChangedSuccess.apply(t, [r, o]);
			});
			p.push(A);
			p.push(n);
			t.fireUndoRedo();
			return Promise.all(p);
		},
		unassignAllValuesAndVisualizeDefault: function () {
			return this._unassignAllValues();
		},
		_unassignAllValues: function () {
			var o = this.getBindingContext(d.VIEW_MODEL_NAME);
			var i = o.getObject();
			var s = "",
				m = "";
			var v = i.AssignedValues;
			for (var j = 0; v.length > j; j++) {
				var n = v[j];
				if (!n.IsSetByObjectDependency) {
					if (s.length > 0) {
						s = s.concat(";");
					}
					s = s.concat(n.ValueId);
					if (m.length > 0) {
						m = m.concat(";");
					}
					m = m.concat(n.TechnicalValue);
				}
			}
			var r = this._createValuesObject(i, "", "", "", -1);
			var u = this._createValuesObject(i, "", "", m, 1);
			return this.characteristicValueUnassign(r, u, i);
		},
		characteristicValueUnassign: function (r, u, o) {
			try {
				var i = this._getCommandforUnAssign(r, u, o);
				return this._executeCommandAndStoreInUndoRedoChain(i);
			} catch (E) {
				this._handleValuationError(E);
			}
		},
		_handleValuationError: function (E) {
			if (E) {
				g.logErrorStack(E, this);
			} else {
				g.logError("An unknown error occurred.", null, this);
			}
			this._setBusy(false);
		},
		_setBusy: function (B) {
			this.getModel("view").setProperty("/" + this._oCharacteristicType.getId(), {
				busy: B
			});
		},
		_onCsticValueChangedSuccess: function (r, o) {
			var t = h.apply(this);
			var v = t.getSettingsModel();
			var j = v.getProperty("/valuationStepsCount");
			v.setProperty("/valuationStepsCount", j + 1);
			t._setBusy(false);
			t._oCharacteristicType.resumeBindings();
			if (r) {
				var m = false;
				if (r.results) {
					if (r && r.results) {
						m = true;
					}
				} else {
					for (var i = 0; i < r.length; i++) {
						var R = r[i];
						if (R && R.results) {
							m = true;
							break;
						}
					}
				}
				if (m) {
					t.fireAfterChange({
						path: H.createCharacteristicKey(t, o)
					});
				}
			}
		},
		_onCsticValueChanged: function (v) {
			var t = h.apply(this);
			var o = t.getValuationDAO();
			var p;
			var B = t.getGroupBindingContext();
			t.fireChange({
				path: B.getPath()
			});
			var A = t.getModel("appStateModel");
			A.resetLoadedGroups();
			if (t.getGroupRepresentation() === G.FullScreen) {
				p = o.readCharacteristicsOfGroup({
					ContextId: v.ContextId,
					InstanceId: v.InstanceId,
					GroupId: v.GroupId
				}, true);
			} else {
				p = o.readCharacteristics(B, true);
			}
			return p;
		},
		_getCountOfAvailableDomValues: function () {
			return this._getCharacteristicData().ValueCount;
		},
		_isSingleValued: function () {
			return this._getCharacteristicData().IsSingleValued;
		},
		_isUserInputNecessary: function () {
			return this._getCharacteristicData().AdditionalValuesAllowed || this._getCharacteristicData().IsIntervalAllowed;
		},
		_isIntervalAllowed: function () {
			return this._getCharacteristicData().IsIntervalAllowed;
		},
		_domainHasIntervalValues: function () {
			return this._getCharacteristicData().DomainHasIntervalValues;
		},
		_determineCharacteristicType: function (A, s, u, i, j, E) {
			var t = e.TEXT;
			var m = l.SINGLE_INPUT_MANY_DOM_VAL;
			if (s) {
				if (j) {
					if (i) {
						m = l.SINGLE_INPUT_LESS_DOM_VAL;
					} else {
						m = l.SINGLE_INPUT_ADDITIONAL_VALUES;
					}
				} else if (A >= D) {
					m = l.SINGLE_INPUT_MANY_DOM_VAL;
				} else {
					if (A > 0) {
						if (u) {
							m = l.SINGLE_INPUT_LESS_DOM_VAL;
						} else {
							m = l.SINGLE_VALUE_NO_ADDITIONAL_VALUES;
						}
					} else {
						m = l.SINGLE_INPUT_ADDITIONAL_VALUES;
					}
				}
			} else {
				if (A >= D) {
					m = l.MULTI_INPUT_MANY_DOM_VAL;
				} else {
					m = l.MULTI_INPUT_LESS_DOM_VAL;
				}
			}
			if (E) {
				switch (m) {
				case l.MULTI_INPUT_LESS_DOM_VAL:
					t = e.MULTI_INPUT;
					break;
				case l.MULTI_INPUT_MANY_DOM_VAL:
					t = e.MULTI_INPUT;
					break;
				case l.SINGLE_VALUE_NO_ADDITIONAL_VALUES:
					t = e.SELECT;
					break;
				case l.SINGLE_INPUT_ADDITIONAL_VALUES:
					t = e.INPUT;
					break;
				case l.SINGLE_INPUT_MANY_DOM_VAL:
					t = e.INPUT;
					break;
				case l.SINGLE_INPUT_LESS_DOM_VAL:
					t = e.INPUT;
					break;
				}
			}
			return t;
		}
	});
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/valuation/control/characteristic/type/Base', ["sap/m/FlexBox", "sap/m/FlexBoxRenderer",
	"sap/m/FlexItemData", "sap/m/Label", "sap/m/Button", "sap/m/Text", "sap/ui/model/json/JSONModel",
	"sap/i2d/lo/lib/zvchclfz/common/Constants", "sap/i2d/lo/lib/zvchclfz/components/valuation/formatter/CharacteristicFormatter",
	"sap/i2d/lo/lib/zvchclfz/common/util/Logger"
], function (F, a, b, L, B, T, J, C, f, c) {
	"use strict";
	return F.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.type.Base", {
		metadata: {
			abstract: true,
			properties: {
				embedderName: {
					type: "string"
				}
			},
			events: {
				"change": {
					parameters: {
						value: {
							type: "string"
						},
						technicalValues: {
							type: "string[]"
						},
						binding: {
							type: "object"
						}
					}
				},
				"acceptDefaultValues": {
					parameters: {}
				},
				"valueHelpRequest": {
					parameters: {}
				},
				"alternativeValueRequest": {
					parameters: {
						binding: {
							type: "object"
						},
						open: {
							type: "function"
						},
						error: {
							type: "function"
						}
					}
				},
				"select": {
					parameters: {}
				},
				"deselect": {
					parameters: {}
				}
			}
		},
		constructor: function (i, s, S) {
			s.alignItems = "Center";
			s.fitContainer = true;
			s.justifyContent = "Start";
			s.width = "100%";
			F.prototype.constructor.apply(this, [i, s, S]);
		},
		renderer: function (r, o) {
			a.render(r, o);
		},
		init: function () {
			var i = this._createId("input");
			var o = this.oCsticUiControl = this.create(i, this.getDefaultSettings(), this.getFreeInputDefaultSettings());
			this.addItem(o);
			this._initUiStateModel();
			if (this.isUserInputType()) {
				if (this.showUnitOfMeasure()) {
					var u = this._createUnitOfMeasure();
					this.addItem(u);
				}
				var s = new sap.ui.core.CustomData({
					key: "styleClass",
					value: {
						parts: ["view>HasDefaultValues"],
						formatter: this.setStyleClass.bind(this)
					}
				});
				o.addCustomData(s);
				this.oCsticUiControl.setLayoutData(this._createInputLayoutData());
				var d = this._oDefaultButton = this._createDefaultButton();
				this.addItem(d);
			}
			this.onKeyPressCallWhenEnabled = this.callWhenEnabled(this.onKeyPress.bind(this));
			this.attachEvents();
		},
		oCsticUiControl: null,
		_oDefaultButton: null,
		formatter: f,
		exit: function () {
			this.detachEvents();
		},
		createLabel: function () {
			return new L({
				id: this._createId("label"),
				required: "{= ${view>IsRequired} && ${valuationSettings>/editable} }",
				tooltip: {
					parts: [{
						path: "view>"
					}, {
						path: "valuationSettings>/descriptionModeCharacteristics"
					}, {
						path: "i18n>CSTIC_LABEL_BOTH"
					}],
					formatter: f.getCharacteristicDescriptionWithNameAndColon
				},
				text: {
					parts: [{
						path: "view>"
					}, {
						path: "valuationSettings>/descriptionModeCharacteristics"
					}, {
						path: "i18n>CSTIC_LABEL_BOTH"
					}],
					formatter: f.getCharacteristicDescriptionWithNameAndColon
				},
				wrapping: true,
				labelFor: this._createId("input")
			});
		},
		getLabel: function () {
			return sap.ui.getCore().byId(this._createId("label"));
		},
		_createDefaultButton: function () {
			var i = this._createId("acceptDefault");
			var o = new B(i, {
				type: "Transparent",
				visible: "{= ( !${view>IsHidden} && !${view>IsReadOnly} && ${view>HasDefaultValues} ) }",
				press: this._onAcceptDefaultValues.bind(this),
				icon: "sap-icon://accept",
				tooltip: "{i18n>ACCEPT_DEFAULT_VALUE}"
			});
			o.setLayoutData(this._createDefaultButtonLayoutData());
			return o;
		},
		_createUnitOfMeasure: function () {
			var i = this._createId("unit");
			var u = new T(i, {
				visible: "{= (${view>Unit} || ${view>Currency}) ? true : false }",
				text: "{= ${view>Currency} ? ${view>Currency} : ${view>Unit} }",
				wrapping: false
			});
			u.setLayoutData(this._createUnitOfMeasureLayoutData());
			return u;
		},
		_createInputLayoutData: function () {
			return new b({
				baseSize: "100%",
				growFactor: 1,
				styleClass: "sapVchclfFlexItemInput"
			});
		},
		_createUnitOfMeasureLayoutData: function () {
			return new b({
				styleClass: "sapUiSmallMarginBegin"
			});
		},
		_createDefaultButtonLayoutData: function () {
			return new b({
				styleClass: "sapUiSmallMarginBegin"
			});
		},
		_onAcceptDefaultValues: function (e) {
			this.fireAcceptDefaultValues();
		},
		focus: function () {
			this.getCsticUiControl().focus();
		},
		_createId: function (i) {
			return this.getId() + "--" + i;
		},
		create: function (i, d, m) {
			throw new Error(" Abstract method. Not implemented yet.");
		},
		getDefaultSettings: function () {
			return {
				name: "{view>CsticId}",
				width: "100%",
				enabled: "{= !${view>IsHidden} }",
				change: this.onChange.bind(this),
				tooltip: {
					parts: ["view>", "i18n>HAS_DEFAULT_VALUES", "i18n>VALUE_RANGE_PREFIX", "i18n>TEMPLATE_PREFIX", "i18n>ROUNDED_VALUE_PREFIX",
						"i18n>INTERVAL_REPRESENTATION", "i18n>UNIT_PREFIX", "i18n>CURRENCY_PREFIX", "view>ChangeTimestamp"
					],
					formatter: this.formatter.getTooltip
				},
				valueState: "{= (${view>HasValueContradiction} || ${view>IsInconsistent}) ? 'Error' : (${view>HasValueProposal} ? 'Warning' : 'None') }",
				valueStateText: {
					parts: ["view>", "i18n>inconsistent", "i18n>value_contradiction", "i18n>VALUE_STATE_PROPOSAL"],
					formatter: this.formatter.getFormattedStateValueText
				},
				busy: "{view>/" + this.getId() + "/busy}",
				busyIndicatorDelay: 0
			};
		},
		getFreeInputDefaultSettings: function () {
			return {
				editable: "{= !${view>IsReadOnly} }",
				liveChange: this.onLiveChange.bind(this),
				placeholder: {
					parts: ["view>", "i18n>HAS_DEFAULT_VALUES", "i18n>VALUE_RANGE_PREFIX", "i18n>TEMPLATE_PREFIX", "i18n>ROUNDED_VALUE_PREFIX",
						"i18n>INTERVAL_REPRESENTATION", "view>ChangeTimestamp"
					],
					formatter: this.formatter.getPlaceholder
				},
				showValueHelp: "{= ${view>ValueCount} > 0 }",
				valueHelpOnly: "{= !(${view>AdditionalValuesAllowed} || ${view>DomainHasIntervalValues}) }",
				valueHelpRequest: this.onValueHelpRequest.bind(this)
			};
		},
		setStyleClass: function (h) {
			if (h) {
				this.getCsticUiControl().addStyleClass("sapVchclfContainsDefaults");
			} else {
				this.getCsticUiControl().removeStyleClass("sapVchclfContainsDefaults");
			}
		},
		isUserInputType: function () {
			return true;
		},
		showUnitOfMeasure: function () {
			return true;
		},
		getValue: function () {
			return this.getCsticUiControl().getValue();
		},
		getTechnicalValues: function () {
			throw new Error(" Abstract method. Not implemented yet.");
		},
		hasValueChanged: function () {
			throw new Error(" Abstract method. Not implemented yet.");
		},
		getResourceBundle: function () {
			if (!this._vchI18nResourceBundle) {
				this._vchI18nResourceBundle = this.getModel("i18n").getResourceBundle();
			}
			return this._vchI18nResourceBundle;
		},
		getOldValue: function (o) {
			var d = this.getCharacteristicData();
			var A = d.AssignedValues;
			var v = "";
			if (A.length > 0) {
				var V = A[0];
				var D = this.getModel("valuationSettings").getProperty("/descriptionModeValues");
				var i = this.getResourceBundle().getText("VALUE_LABEL_BOTH");
				var I = this.getResourceBundle().getText("VALUE_LABEL_NO_VALUE");
				var s = this.getResourceBundle().getText("ROUNDED_VALUE_PREFIX");
				var e = this.getResourceBundle().getText("INTERVAL_REPRESENTATION");
				var g = true;
				var n = false;
				v = this.formatter.getFormattedValueTextWithDescription(V, D, i, I, s, e, g, n);
			}
			return v;
		},
		getCsticUiControl: function () {
			return this.oCsticUiControl;
		},
		_initUiStateModel: function () {
			var u = new J({
				focused: false
			});
			this.setModel(u, C.UI_STATE_MODEL_NAME);
		},
		getUiStateFocused: function (o) {
			return this.getUiStateModel().getProperty("/focused");
		},
		getUiStateModel: function () {
			return this.getModel(C.UI_STATE_MODEL_NAME);
		},
		onChange: function (e) {
			c.logDebug("onChange cstic '{0}'", [this.getCharacteristicData().CsticId], this);
			this.fireChange({
				value: this.getValue(),
				technicalValues: this.getTechnicalValues(),
				binding: this.getBinding("value")
			});
		},
		onLiveChange: function (e) {
			var v = this.getValue();
			var d = this._oDefaultButton;
			if (v) {
				d.setEnabled(false);
			} else {
				var o = this.getCharacteristicData();
				var V = o.AssignedValues;
				for (var i = 0; V.length > i; i++) {
					var g = V[i];
					if (g.IsDefaultValue === true) {
						d.setEnabled(true);
					}
				}
			}
		},
		getCharacteristicData: function () {
			return this.getBindingContext(C.VIEW_MODEL_NAME).getObject();
		},
		onValueHelpRequest: function () {
			this.fireValueHelpRequest();
		},
		getBindingNames: function () {
			throw new Error(" Abstract method. Not implemented yet.");
		},
		getBinding: function (s) {
			return this.getCsticUiControl().getBinding(s);
		},
		_isSuspended: function (s) {
			return this.getBinding(s).isSuspended();
		},
		_isBusy: function () {
			return this.getCsticUiControl().getBusy();
		},
		_isValuationEditable: function () {
			return this.getModel("valuationSettings").getProperty("/editable");
		},
		suspendBindings: function () {
			c.logDebug("Suspend bindings on cstic '{0}'", [this.getCharacteristicData().CsticId], this);
			var d = this.getBindingNames();
			d.forEach(function (s) {
				if (!this._isSuspended(s) && !this._isBusy()) {
					jQuery.sap.delayedCall(0, this, function () {
						if (this.bIsDestroyed) {
							return;
						}
						this.getBinding(s).suspend();
					});
				}
			}.bind(this));
		},
		resumeBindings: function () {
			c.logDebug("Resume bindings on cstic '{0}'", [this.getCharacteristicData().CsticId], this);
			var d = this.getBindingNames();
			d.forEach(function (s) {
				if (this.getBinding(s)) {
					this.getBinding(s).resume();
				}
			}.bind(this));
		},
		callWhenEnabled: function (d) {
			return function () {
				if (this.isEditable()) {
					d.apply(this, arguments);
				}
			};
		},
		callWhenDisabled: function (d) {
			return function () {
				if (!this.isEditable()) {
					d.apply(this, arguments);
				}
			};
		},
		onSelectWhenDisabled: function () {
			this.setUiStateFocused(true);
			this.fireSelect();
		},
		onSelect: function (q) {
			var t = q.target ? q.target.id : "target undefined";
			c.logDebug("onSelect cstic '{0}' triggered by '{1}' on '{2}'", [this.getCharacteristicData().CsticId, q.type, t], this);
			if (this._isValuationEditable() && this.isEditable()) {
				this.suspendBindings();
			}
			this.setUiStateFocused(true);
			this.fireSelect();
		},
		onDeselect: function (q) {
			var t = q.target ? q.target.id : "target undefined";
			c.logDebug("onDeselect cstic '{0}' triggered by '{1}' on '{2}'", [this.getCharacteristicData().CsticId, q.type, t], this);
			if (!(q.relatedTarget !== null && q.relatedTarget.classList.contains("sapMInputBaseIconContainer"))) {
				this.setUiStateFocused(false);
				if (this._isValuationEditable() && this.isEditable() && !this.hasValueChanged()) {
					this.resumeBindings();
				}
				this.fireDeselect();
			}
		},
		isEditable: function () {
			var o = this.getCharacteristicData();
			return !o.IsReadOnly && !o.IsHidden;
		},
		setUiStateFocused: function (d) {
			switch (d) {
			case true:
				this._bDeselectedRegistered = false;
				if (!this.getUiStateFocused()) {
					this._setUiStateFocused(d);
				}
				break;
			case false:
				if (this.getUiStateFocused()) {
					this._bDeselectedRegistered = true;
					jQuery.sap.delayedCall(0, this, function () {
						jQuery.sap.delayedCall(0, this, function () {
							if (this._bDeselectedRegistered) {
								this._setUiStateFocused(d);
								this._bDeselectedRegistered = false;
							}
						});
					});
				}
				break;
			}
		},
		_setUiStateFocused: function (d) {
			this.getUiStateModel().setProperty("/focused", d);
		},
		onKeyPress: function (e) {
			if (e.key === "Enter") {
				var o = this.getCharacteristicData();
				if (o.HasDefaultValues) {
					var E = this.getValue();
					var v = o.AssignedValues;
					for (var i = 0; v.length > i; i++) {
						var V = v[i];
						if (V.IsDefaultValue === true) {
							var d = V.TechnicalValueDisplay;
							break;
						}
					}
					if (o.IsSingleValued && (E = d) || !o.IsSingleValued && E === "") {
						this.fireAcceptDefaultValues();
					}
				}
			}
		},
		setEmbedderName: function (e) {
			this.detachEvents();
			this.setProperty("embedderName", e);
			this.attachEvents();
		},
		attachEvents: function () {
			this.getCsticUiControl().attachBrowserEvent("focusin", this.onSelect, this);
			this.getCsticUiControl().attachBrowserEvent("focusout", this.onDeselect, this);
			this.getCsticUiControl().attachBrowserEvent("keypress", this.onKeyPressCallWhenEnabled, this);
		},
		detachEvents: function () {
			this.getCsticUiControl().detachBrowserEvent("focusin", this.onSelect, this);
			this.getCsticUiControl().detachBrowserEvent("focusout", this.onDeselect, this);
			this.getCsticUiControl().detachBrowserEvent("keypress", this.onKeyPressCallWhenEnabled, this);
		}
	});
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/valuation/control/characteristic/type/Input', ["jquery.sap.global",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/control/characteristic/type/Base", "sap/m/Input", "sap/i2d/lo/lib/zvchclfz/common/Constants"
], function (q, B, I, C) {
	"use strict";
	return B.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.type.Input", {
		create: function (i, d, f) {
			return new I(i, q.extend(d, f, {
				value: {
					parts: ["view>AssignedValues", "valuationSettings>/descriptionModeValues", "i18n>VALUE_LABEL_BOTH",
						"i18n>VALUE_LABEL_NO_VALUE", "i18n>ROUNDED_VALUE_PREFIX", "i18n>INTERVAL_REPRESENTATION", "uiState>/focused",
						"valuationSettings>/showPreciseDecimalNumbers", "view>ChangeTimestamp"
					],
					formatter: this.formatter.getFirstValue
				}
			}));
		},
		renderer: function (r, c) {
			B.prototype.getRenderer().render(r, c);
		},
		attachEvents: function () {
			B.prototype.attachEvents.apply(this, arguments);
			if (this.getEmbedderName() === C.CONFIGURATION) {
				this.getCsticUiControl().attachBrowserEvent("focusin", this.onAlternativeValuesRequested, this);
			}
		},
		detachEvents: function () {
			B.prototype.detachEvents.apply(this, arguments);
			this.getCsticUiControl().detachBrowserEvent("focusin", this.onAlternativeValuesRequested, this);
		},
		onAlternativeValuesRequested: function () {
			this.fireAlternativeValueRequest();
		},
		getTechnicalValues: function () {
			return [];
		},
		hasValueChanged: function () {
			return this.getOldValue() !== this.getValue();
		},
		getBindingNames: function () {
			return ["value", "editable", "placeholder", "tooltip", "enabled"];
		}
	});
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/valuation/control/characteristic/type/MultiInput', ["jquery.sap.global",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/control/characteristic/type/Base", "sap/m/MultiInput", "sap/m/Token", "sap/ui/model/Filter",
	"sap/ui/model/Sorter", "sap/ui/model/FilterOperator", "sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/i2d/lo/lib/zvchclfz/common/util/Helper"
], function (q, B, M, T, F, S, a, C, H) {
	"use strict";
	return B.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.MultiInput", {
		_createToken: function (i, c) {
			return new T(i + "--selectItemForValuation", {
				editable: "{= ( !${view>IsReadonly} && !${view>IsSetByObjectDependency} ) }",
				text: {
					parts: ["view>", "valuationSettings>/descriptionModeValues", "i18n>VALUE_LABEL_BOTH", "i18n>VALUE_LABEL_NO_VALUE",
						"i18n>ROUNDED_VALUE_PREFIX", "i18n>INTERVAL_REPRESENTATION"
					],
					formatter: this.formatter.getFormattedValueTextWithDescription
				},
				tooltip: {
					parts: ["view>", "valuationSettings>/descriptionModeValues", "i18n>VALUE_LABEL_BOTH", "i18n>VALUE_LABEL_NO_VALUE",
						"i18n>ROUNDED_VALUE_PREFIX", "i18n>INTERVAL_REPRESENTATION"
					],
					formatter: this.formatter.getFormattedValueTextWithDescription
				}
			});
		},
		_includeValue: function (i) {
			return !i.getBindingContext(C.VIEW_MODEL_NAME).getObject().IsSetByObjectDependency;
		},
		_onMultiInputTokenUpdate: function (e) {
			var r = e.getParameter("removedTokens");
			var t = e.getParameter("type");
			if (r.length > 1) {
				return;
			}
			var R = r[0];
			var v = R.getBindingContext(C.VIEW_MODEL_NAME).getObject().IsReadonly;
			if (v) {
				return;
			}
			if (t === "removed") {
				e.preventDefault();
				var b = this.getCsticUiControl().getTokens();
				var i = b.indexOf(R);
				b.splice(i, 1);
				var g = function (I) {
					return I.getBindingContext(C.VIEW_MODEL_NAME).getObject();
				};
				var c = b.map(g);
				var d = c.filter(function (V) {
					return !V.IsSetByObjectDependency;
				});
				var f = d.map(function (V) {
					return V.TechnicalValue;
				});
				this.fireChange({
					value: this.getValue(),
					technicalValues: f
				});
				this.focus();
			}
		},
		create: function (i, d, f) {
			return new M(i, q.extend(d, f, {
				enableMultiLineMode: false,
				value: {
					parts: ["view>AssignedValues", "view>AssignedValueId", "valuationSettings>/valuationStepsCount", "view>ChangeTimestamp"],
					formatter: this.formatter.getUnprocessedValue
				},
				tokens: {
					path: "view>AssignedValues",
					sorter: new S({
						path: 'ValueId'
					}),
					filters: new F({
						filters: [new F({
							path: 'ValueId',
							operator: a.NE,
							value1: ''
						}), new F({
							path: 'Description',
							operator: a.NE,
							value1: ''
						})],
						and: false
					}),
					factory: this._createToken.bind(this)
				},
				tokenUpdate: this._onMultiInputTokenUpdate.bind(this)
			})).addStyleClass("sapVchclfMultiInput");
		},
		renderer: function (r, c) {
			B.prototype.getRenderer().render(r, c);
		},
		getTechnicalValues: function (i) {
			var g = function (t) {
				var V = t.getBindingContext(C.VIEW_MODEL_NAME).getObject();
				return V.TechnicalValue;
			};
			var c = this.getCsticUiControl();
			var v = c.getTokens();
			if (!i) {
				v = v.filter(this._includeValue.bind(this));
			}
			v = v.map(g);
			return v;
		},
		getBindingNames: function () {
			return ["tokens", "value", "editable", "placeholder", "tooltip", "enabled"];
		},
		hasValueChanged: function () {
			if (this.getValue() !== "") {
				return true;
			} else {
				var l = this.getCharacteristicData().AssignedValues;
				var g = function (v) {
					return v.TechnicalValue;
				};
				l = l.map(g);
				var t = this.getCsticUiControl().getBinding("tokens").getContexts().map(function (c) {
					return c.getObject();
				});
				t = t.map(g);
				var i = H.isContentOfArrayEqual(l, t);
				return !i;
			}
		}
	});
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/valuation/control/characteristic/type/Select', ["jquery.sap.global",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/control/characteristic/type/Base", "sap/m/Select", "sap/ui/core/Item",
	"sap/i2d/lo/lib/zvchclfz/common/Constants"
], function (q, B, S, I, C) {
	"use strict";
	return B.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.type.Select", {
		init: function () {
			B.prototype.init.apply(this, arguments);
			this.onSelectCallWhenDisabled = this.callWhenDisabled(this.onSelectWhenDisabled.bind(this));
			this.onAlternativeValuesRequestedCalledWhenEnabled = this.callWhenEnabled(this.onAlternativeValuesRequested.bind(this));
			this.onMouseDownCallWhenEnabled = this.callWhenEnabled(this.onMouseDown.bind(this));
		},
		create: function (i, d) {
			return new S(i, q.extend(d, {
				editable: "{= !${view>IsHidden} && !${view>IsReadOnly} }",
				selectedKey: {
					parts: ["view>AssignedValues", "view>ChangeTimestamp"],
					formatter: this.formatter.getFirstValueId.bind(this)
				},
				items: {
					path: "view>DomainValues",
					factory: this._createItem.bind(this)
				}
			}));
		},
		renderer: function (r, c) {
			B.prototype.getRenderer().render(r, c);
		},
		_createItem: function (i, c) {
			return new I(i + "--selectItemForValuation", {
				key: "{view>ValueId}",
				text: {
					parts: ["view>", "valuationSettings>/descriptionModeValues", "i18n>VALUE_LABEL_BOTH", "i18n>VALUE_LABEL_NO_VALUE",
						"i18n>ROUNDED_VALUE_PREFIX", "i18n>INTERVAL_REPRESENTATION", "uiState>/focused"
					],
					formatter: this.formatter.getFormattedValueTextWithDescription
				}
			});
		},
		getValue: function () {
			return "";
		},
		getTechnicalValues: function () {
			var s = this.getCsticUiControl().getSelectedItem();
			var i = s.getBindingContext(C.VIEW_MODEL_NAME).getObject();
			if (i.ValueId === "0" && i.TechnicalValue === "") {
				return [];
			} else {
				return [i.TechnicalValue];
			}
		},
		getBindingNames: function () {
			return ["items"];
		},
		attachEvents: function () {
			B.prototype.attachEvents.apply(this, arguments);
			if (this.getEmbedderName() === C.CONFIGURATION) {
				this.getCsticUiControl().attachBrowserEvent("click", this.onSelectCallWhenDisabled, this);
				this.getCsticUiControl().attachBrowserEvent("focusin", this.onAlternativeValuesRequestedCalledWhenEnabled, this);
			}
		},
		detachEvents: function () {
			B.prototype.detachEvents.apply(this, arguments);
			this.getCsticUiControl().detachBrowserEvent("click", this.onSelectCallWhenDisabled, this);
			this.getCsticUiControl().detachBrowserEvent("focusin", this.onAlternativeValuesRequestedCalledWhenEnabled, this);
		},
		onChange: function (e) {
			if (this.hasValueChanged()) {
				B.prototype.onChange.apply(this, [e]);
			}
		},
		onMouseDown: function (e) {
			var s = q(e.currentTarget).control()[0];
			s.hasMouseDown = true;
		},
		onAlternativeValuesRequested: function (e) {
			var s = q(e.currentTarget).control()[0];
			var d = s.getList();
			d.setBusyIndicatorDelay(0);
			d.setBusy(true);
			this.fireAlternativeValueRequest({
				binding: s.getBinding("items"),
				open: function () {
					d.setBusy(false);
					if (!s.isOpen() && s.hasMouseDown) {
						s.open();
					}
					s.hasMouseDown = false;
				},
				error: function () {
					s.hasMouseDown = false;
					d.setBusy(false);
				}
			});
		},
		hasValueChanged: function () {
			return this.getOldAssignedValueId() !== this.getCsticUiControl().getSelectedItem().getBindingContext(C.VIEW_MODEL_NAME).getObject()
				.ValueId;
		},
		getOldAssignedValueId: function () {
			var c = this.getCharacteristicData();
			var a = c.AssignedValues;
			var v = "";
			if (a.length) {
				var V = a[0];
				v = V.ValueId;
			}
			return v;
		},
		onKeyPress: function (e) {
			if (e.key === "Enter") {
				var c = this.getCharacteristicData();
				if (!this.hasValueChanged()) {
					if (c.HasDefaultValues && c.AssignedValues[0].IsDefaultValue === true) {
						this.fireAcceptDefaultValues();
					}
				}
			}
		},
		showUnitOfMeasure: function () {
			return false;
		}
	});
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/valuation/control/characteristic/type/Text', ["jquery.sap.global",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/control/characteristic/type/Base", "sap/m/Text", "sap/i2d/lo/lib/zvchclfz/common/Constants"
], function (q, B, T, C) {
	"use strict";
	return B.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.type.Text", {
		create: function (i) {
			return new T(i, {
				text: {
					parts: ["view>", "valuationSettings>/descriptionModeValues", "i18n>VALUE_LABEL_BOTH", "i18n>ROUNDED_VALUE_PREFIX",
						"i18n>INTERVAL_REPRESENTATION", "valuationSettings>/showPreciseDecimalNumbers", "view>ChangeTimestamp"
					],
					formatter: this.formatter.getConcatenatedDescriptionValues
				}
			});
		},
		renderer: function (r, c) {
			B.prototype.getRenderer().render(r, c);
		},
		getValue: function () {
			return this.getCsticUiControl().getText();
		},
		getBindingNames: function () {
			return ["text"];
		},
		createLabel: function () {
			var l = B.prototype.createLabel.apply(this);
			l.attachBrowserEvent("click", this.onSelect, this);
			return l;
		},
		attachEvents: function () {
			this.getCsticUiControl().attachBrowserEvent("click", this.onSelect, this);
		},
		isUserInputType: function () {
			return false;
		},
	});
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/valuation/controller/Valuation.controller', ["sap/ui/core/mvc/Controller",
	"sap/i2d/lo/lib/zvchclfz/common/Constants", "sap/i2d/lo/lib/zvchclfz/components/valuation/factory/CharacteristicFactory",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/factory/GroupsFactory"
], function (C, a, b, G, V, c) {
	"use strict";
	return C.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.controller.Valuation", {
		_oCharacteristicFactory: null,
		_oGroupsFactory: null,
		_oViewModel: null,
		onExit: function () {
			if (this._oCharacteristicFactory) {
				this._oCharacteristicFactory.destroy();
			}
			if (this._oGroupsFactory) {
				this._oGroupsFactory.destroy();
			}
			delete this._oViewModel;
			delete this._oValuationDAO;
			delete this._oGroupState;
		},
		groupsFactory: function (i, o) {
			if (!this._oGroupsFactory) {
				this._oGroupsFactory = new G({
					dataModel: this._getDataModel(),
					viewModel: this._getViewModel(),
					valuationDAO: this.getValuationDAO(),
					view: this.getView(),
					settingsModel: this._getSettingsModel(),
					groupState: this._getGroupState()
				});
			}
			return this._oGroupsFactory.create(i, o);
		},
		getCharacteristicFactory: function () {
			if (!this._oCharacteristicFactory) {
				this._oCharacteristicFactory = new b({
					dataModel: this._getDataModel(),
					viewModel: this._getViewModel(),
					valuationDAO: this.getValuationDAO(),
					view: this.getView(),
					settingsModel: this._getSettingsModel(),
					groupState: this._getGroupState()
				});
			}
			return this._oCharacteristicFactory;
		},
		getValuationDAO: function () {
			return this._oValuationDAO;
		},
		setValuationDAO: function (v) {
			this._oValuationDAO = v;
		},
		setGroupState: function (g) {
			this._oGroupState = g;
			this.getView().setModel(g.getStateModel(), "characteristicGroupState");
		},
		_getGroupState: function () {
			return this._oGroupState;
		},
		setViewModel: function (v) {
			this._oViewModel = v;
		},
		_getViewModel: function () {
			return this._oViewModel;
		},
		openFilterDialog: function (e) {
			var f = e.getSource();
			f.getFilterDialog().open();
		},
		removeFilter: function (e) {
			e.cancelBubble();
			var o = e.getSource().getParent();
			var f = o.getFilterDialog().getSource();
			f.focus();
			this.getOwnerComponent().removeCharacteristicFilter();
		},
		_getDataModel: function () {
			return this._getModel(a.VCHCLF_MODEL_NAME);
		},
		_getSettingsModel: function () {
			return this._getModel(a.VALUATION_SETTINGS_MODEL_NAME);
		},
		_getModel: function (m) {
			return this.getView().getModel(m);
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/valuation/controller/fragment/Base', [
	"sap/i2d/lo/lib/zvchclfz/common/controller/fragment/Base", "sap/i2d/lo/lib/zvchclfz/common/Constants"
], function (B, C) {
	"use strict";
	return B.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.Base", {
		metadata: {
			"abstract": true,
			properties: {
				dataModel: {
					type: "sap.ui.model.Model"
				},
				viewModel: {
					type: "sap.i2d.lo.lib.zvchclfz.components.valuation.model.ViewModel"
				},
				valuationDAO: {
					type: "sap.i2d.lo.lib.zvchclfz.components.valuation.dao.ValuationDAO"
				},
				groupState: {
					type: "sap.i2d.lo.lib.zvchclfz.components.valuation.util.GroupState"
				},
				settingsModel: {
					type: "sap.ui.model.Model"
				}
			}
		},
		exit: function () {
			B.prototype.exit.apply(this, arguments);
			this.setDataModel(null);
			this.setViewModel(null);
			this.setValuationDAO(null);
			this.setGroupState(null);
			this.setSettingsModel(null);
		},
		_getCharacteristicGroups: function () {
			return this.byId("groupVBox-0--groups");
		},
		getCharacteristicGroupsBinding: function () {
			var g = this._getCharacteristicGroups();
			if (g) {
				return g.getBinding("items");
			}
		},
		getCharacteristicGroupBindingContext: function () {
			return this.getCharacteristicGroupsBinding().getContext();
		}
	});
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/valuation/controller/fragment/filter/Filter', [
	"sap/i2d/lo/lib/zvchclfz/common/controller/fragment/Base", "sap/ui/model/json/JSONModel", "sap/ui/model/Filter", "sap/m/Dialog",
	"sap/m/Button", "sap/ui/core/message/Message", "sap/ui/core/message/ControlMessageProcessor", "sap/m/MessageToast",
	"sap/i2d/lo/lib/zvchclfz/common/util/XMLFragmentCache", "sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/type/GroupRepresentation", "sap/i2d/lo/lib/zvchclfz/common/util/CommandManager"
], function (B, J, F, D, a, M, C, b, X, c, G, d) {
	"use strict";
	var p = function (E) {
		var g = false;
		var o = this.filterModel.getData("/");
		var v = Object.values(o);
		v = v.slice(0, v.length - 1);
		jQuery.each(v, function (i, V) {
			if (V) {
				if (V === "notValuated" || V === "noFormat") {
					g = false;
				} else {
					g = true;
					return false;
				}
			}
		});
		this.filterModel.setProperty("/resetButtonEnabled", g);
	};
	var e = {
		"isRequired": ["IsRequired", true],
		"changeable": ["IsReadOnly", false],
		"addValues": ["AdditionalValuesAllowed", true],
		"SingleValued": ["IsSingleValued", true],
		"MultiValued": ["IsSingleValued", false],
		"CharacterFormat": ["Format", "CHAR"],
		"NumericFormat": ["Format", "NUM"],
		"DateFormat": ["Format", "DATE"],
		"TimeFormat": ["Format", "TIME"],
		"ValueAssigned": ["HasAssignedValue", true],
		"NoValueAssigned": ["HasAssignedValue", false]
	};
	var I = {
		isRequired: false,
		changeable: false,
		addValues: false,
		valueAssignedSelectedKey: "notValuated",
		formatSelectedKey: "noFormat",
		singleMultiValuedSelectedKey: "notValuated",
		resetButtonEnabled: false
	};
	var f = {
		"isRequired": "FPS_MANDATORY",
		"changeable": "FPS_CHANGEABLE",
		"addValues": "FPS_ADDITIONAL_VALUES",
		"SingleValued": "FPS_SINGLE_VALUED",
		"MultiValued": "FPS_MULTI_VALUED",
		"CharacterFormat": "FPS_CHAR_FORMAT",
		"NumericFormat": "FPS_NUM_FORMAT",
		"DateFormat": "FPS_DATE_FORMAT",
		"TimeFormat": "FPS_TIME_FORMAT",
		"ValueAssigned": "FPS_VALUE_ASSIGNED",
		"NoValueAssigned": "FPS_NO_VALUE_ASSIGNED"
	};
	return B.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.filter.Filter", {
		__aFilterTextForMessageBar: [],
		_filters: {},
		_getFilters: function () {
			return this.getModel("appStateModel").getProperty("/filters");
		},
		_filter: function () {
			if (this.getControl()) {
				this.getControl().close();
			}
			if (!this._hasFiltersChanged()) {
				return;
			}
			this._previousFilterState = jQuery.extend(true, {}, this.filterModel.getData());
			this._syncAppStateModel();
			this._resetSkipTop();
			this._toggleFilterStatus(this._hasUiFilter(this._getFilters()));
			this._resumeBinding();
			var v = this.getOwnerComponent();
			var V = v._getValuationDAO();
			var o = v.getBindingContext(c.VIEW_MODEL_NAME);
			var g = v.getGroupRepresentation();
			if (o) {
				var r = this._getFilters().length === 0;
				var h = true;
				var i = v.getRootControl();
				i.setBusyIndicatorDelay(0);
				var s = function (j) {
					i.setBusy(j);
				};
				s(true);
				if (g === G.Embedded) {
					V.readCharacteristics(o, false, h, r).then(s.bind(this, false));
				} else if (g === G.FullScreen) {
					d.reset();
					V.readCharacteristicsOfSelectedGroup(o, false, h, r).then(s.bind(this, false));
				}
			}
		},
		_resetSkipTop: function () {
			this.getModel("appStateModel").resetSkipTop();
		},
		_resumeBinding: function () {
			var g = this._getBindingsFromComponent();
			if (g.length > 0) {
				jQuery.each(g, function (i, o) {
					o.resume();
				});
			}
		},
		_getFilterPropertiesString: function () {
			var s = this._getResourceBundle().getText("FPS_INTRO") + "\: ";
			var n = 0;
			this._aFilterTextForMessageBar.forEach(function (g) {
				s = this._addFilterPropertiesSubString(s, g, n);
				n = n + 1;
			}.bind(this));
			return s;
		},
		_addFilterPropertiesSubString: function (_, g, h, i) {
			var P = this._getResourceBundle().getText(g);
			var o = " " + this._getResourceBundle().getText("FPS_OPERATOR") + " ";
			if (h === 0) {
				if (i) {
					return _ + P + " \(" + i + "\)";
				} else {
					return _ + P;
				}
			} else {
				if (i) {
					return _ + o + P + " \(" + i + "\)";
				} else {
					return _ + o + P;
				}
			}
		},
		_getResourceBundle: function () {
			if (!this.i18nResourceBundle) {
				this.i18nResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			}
			return this.i18nResourceBundle;
		},
		_hasUiFilter: function (g) {
			var i = function (o) {
				return (o.sPath !== "IsHidden");
			};
			return g.filter(i).length > 0;
		},
		_toggleFilterStatus: function (_) {
			var o = this.getView().byId("filterStatus");
			o.getFilterDialog = function () {
				return this.getControl();
			}.bind(this);
			o.setVisible(_);
			var g = o.getContent()[0];
			if (_ === true) {
				g.setText(this._getFilterPropertiesString());
			} else {
				g.setText();
			}
		},
		_getBindingsFromComponent: function () {
			var o = this.getOwnerComponent();
			switch (o.getMetadata()._sClassName) {
			case "sap.i2d.lo.lib.zvchclfz.components.valuation.Component":
				return o.getGroupElementsBinding();
			}
			return null;
		},
		_hasFiltersChanged: function () {
			return JSON.stringify(this._previousFilterState) !== JSON.stringify(this._getCurrentState());
		},
		_getCurrentState: function () {
			return this.filterModel.getData();
		},
		_initFilterModel: function () {
			this.filterModel = new J();
			this.filterModel.attachPropertyChange(p.bind(this));
			this._previousFilterState = jQuery.extend(true, {}, I);
			this.filterModel.setData(jQuery.extend(true, {}, I));
			return this.filterModel;
		},
		_resetFilterModel: function () {
			this.filterModel.setData(jQuery.extend(true, {}, I));
		},
		_syncAppStateModel: function () {
			var g = [];
			var A = this.getModel("appStateModel");
			this._aFilterTextForMessageBar = [];
			var o = this.filterModel.getData("/");
			var s = function (V) {
				g.push(this._filters[V]);
				this._aFilterTextForMessageBar.push(f[V]);
			}.bind(this);
			var h = function (k) {
				var v = Object.values(o);
				v.forEach(function (V) {
					if (k === V) {
						s(V);
					}
				});
			};
			var v = Object.keys(e);
			v.forEach(function (V) {
				var m = o[V];
				if (m !== undefined && !!m) {
					s(V);
				} else if (m === undefined) {
					h(V);
				}
			});
			if (g.length !== 0) {
				g = [new sap.ui.model.Filter({
					filters: g,
					and: true
				})];
			}
			A.setProperty("/filters", g);
			A.resetLoadedGroups();
		},
		getFilterModel: function () {
			if (!this.filterModel) {
				this._initFilterModel();
			}
			return this.filterModel;
		},
		exit: function () {
			B.prototype.exit.apply(this, arguments);
			if (this.filterModel) {
				this.filterModel.detachPropertyChange(p.bind(this));
			}
		},
		applyBindingFilterForEmbeddedMode: function () {
			var g = this._getBindingsFromComponent();
			if (g.length > 0) {
				d.reset();
				var o = this.getModel("appStateModel").getProperty("/filters")[0];
				jQuery.each(g, function (i, h) {
					h.filter(o);
				});
			}
		},
		init: function () {
			for (var k in e) {
				this._filters[k] = new F(e[k][0], sap.ui.model.FilterOperator.EQ, e[k][1]);
			}
		},
		onRemoveFilter: function () {
			this._resetFilterModel();
			this._filter();
		},
		onResetFilter: function () {
			this._resetFilterModel();
			this._syncAppStateModel();
		},
		onFilter: function () {
			this._filter();
		},
		onCancel: function () {
			this.getControl().close();
			this.filterModel.setData(jQuery.extend(true, {}, this._previousFilterState));
		}
	});
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/valuation/controller/fragment/group/CharacteristicGroupBase', [
	"sap/i2d/lo/lib/zvchclfz/components/valuation/controller/fragment/Base"
], function (B) {
	"use strict";
	return B.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.group.CharacteristicGroupBase", {
		metadata: {
			"abstract": true
		},
		characteristicFactory: function (i, c) {
			var C = this.getOwnerComponent();
			var o = this.getViewController().getCharacteristicFactory().create(C.getId(), c);
			o.attachSelect(this._onCharacteristicSelected, this);
			o.attachUndoRedo(this._onUndoRedo, this);
			o.attachChange(this._onChange, this);
			o.attachAfterChange(this._onAfterChange, this);
			return o;
		},
		_onCharacteristicSelected: function (e) {
			if (this.bIsDestroyed) {
				return;
			}
			this.getOwnerComponent().fireCharacteristicSelected({
				path: e.getParameter("path")
			});
		},
		_onUndoRedo: function () {
			this.getOwnerComponent().fireCharacteristicAssignmentTriggered();
		},
		_onChange: function (e) {
			this.getOwnerComponent().fireCharacteristicValueChanged({
				characteristicPath: e.getParameter("path")
			});
		},
		_onAfterChange: function (e) {
			var s = e.getSource();
			var v = s.getParent();
			if (v) {
				var g = this.getModel("vchclf").getProperty(e.getParameter("path")).GroupId;
				if (this.getModel("view").hasCharacteristicsGeometryChanged(g)) {
					v.getBinding("items").refresh(true);
				}
			}
			this.getOwnerComponent().fireCharacteristicChanged({
				characteristicPath: e.getParameter("path")
			});
		}
	});
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/valuation/controller/fragment/group/CharacteristicGroupEmbedded', [
	"sap/i2d/lo/lib/zvchclfz/components/valuation/controller/fragment/group/CharacteristicGroupBase",
	"sap/i2d/lo/lib/zvchclfz/common/Constants"
], function (C, a) {
	"use strict";
	var S = 30;
	return C.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.group.CharacteristicGroupEmbedded", {
		_bShowMore: false,
		_buildPagingSearchString: function (s, t) {
			if (s === 0 && t === 0) {
				return "";
			}
			var p = "SkipCharacteristics=" + s + ",TopCharacteristics=" + t;
			return p;
		},
		handleSeeLessMore: function (e) {
			var b = e.getParameter("id");
			var g = b.substr(0, b.lastIndexOf("--")) + "--valuationForm";
			var G = sap.ui.getCore().byId(g);
			if (!G && G.getMetadata().getName() !== "sap.ui.layout.cssgrid.CSSGrid") {
				throw Error("Implementation expects CSSGrid but found " + G.getMetadata().getName() + " .");
			}
			G.setBusyIndicatorDelay(0);
			G.setBusy(true);
			var B = G.getBindingInfo("items");
			var i = parseInt(B.length, 10);
			var o = G.getBinding("items");
			var c = o.getContext().getObject();
			var m = c.CsticCount;
			var l = S;
			var M = false;
			B.filters = B.binding.aFilters;
			B.sorters = B.binding.aSorters;
			if (i === l) {
				B.length = m;
				M = true;
			} else if (i > l) {
				B.length = l;
			}
			this.getModel("appStateModel").setGroup(c.InstanceId, c.GroupId, {
				top: B.length,
				skip: 0,
				loaded: false
			});
			if (M) {
				this.getValuationDAO().readCharacteristicsOfGroup(c, true).then(function () {
					o.resume();
					o.refresh(true);
					G.setBusy(false);
				});
			} else {
				o.resume();
				o.refresh(true);
				G.setBusy(false);
			}
		},
		_getCharacteristicGroups: function () {
			return this.byId("groupVBox-0--groups");
		}
	});
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/valuation/controller/fragment/group/CharacteristicGroupFullScreen', [
	"sap/i2d/lo/lib/zvchclfz/components/valuation/controller/fragment/group/CharacteristicGroupBase",
	"sap/i2d/lo/lib/zvchclfz/common/Constants"
], function (C, a) {
	"use strict";
	var S = 30;
	var P = {
		SHOW_MORE: "ShowMore",
		SHOW_ALL: "ShowAll"
	};
	return C.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.group.CharacteristicGroupFullScreen", {
		onPagingDefaultAction: function (e) {
			var b = e.getSource().getId();
			var g = this._getGridControlForGroupPaging(b);
			var B = this._getContextBaseIdString(b);
			this._executeSeeLessMore(P.SHOW_MORE, g, B);
		},
		onPagingTriggered: function (e) {
			var b = e.getSource().getId();
			var g = this._getGridControlForGroupPaging(b);
			var B = this._getContextBaseIdString(b);
			var c = e.getParameter("item").getCustomData();
			var p = c[0].getValue();
			this._executeSeeLessMore(p, g, B);
		},
		_isInteger: Number.isInteger || function (v) {
			return typeof v === "number" && isFinite(v) && Math.floor(v) === v;
		},
		_executeSeeLessMore: function (p, g, b) {
			var B = g.getBindingInfo("items");
			g.setBusyIndicatorDelay(0);
			g.setBusy(true);
			var o = g.getBinding("items");
			var c = o.getContext().getObject();
			var m = c.CsticCount;
			var A = this.getModel("appStateModel");
			var n;
			var s = p === P.SHOW_ALL;
			var i = A.getProperty("/instances/" + c.InstanceId + "/groups/" + c.GroupId + "/top");
			if (!this._isInteger(i)) {
				i = parseInt(i, 10);
			}
			if (p === P.SHOW_MORE) {
				n = i + S;
			} else if (s) {
				n = m;
			}
			B.length = n;
			if (n >= m) {
				sap.ui.getCore().byId(b + "--more_less_flexbox").setVisible(false);
			}
			B.filters = B.binding.aFilters;
			B.sorters = B.binding.aSorters;
			A.setGroup(c.InstanceId, c.GroupId, {
				top: n,
				skip: 0,
				loaded: false
			});
			this.getValuationDAO().readCharacteristicsOfGroup(c, s, true).then(function () {
				o.resume();
				o.refresh(true);
				g.setBusy(false);
			});
		},
		_getGridControlForGroupPaging: function (b) {
			var g = this._getContextBaseIdString(b) + "--valuationForm";
			var G = sap.ui.getCore().byId(g);
			if (!G && G.getMetadata().getName() !== "sap.ui.layout.cssgrid.CSSGrid") {
				throw Error("Implementation expects CSSGrid but found " + G.getMetadata().getName() + " .");
			} else {
				return G;
			}
		},
		_getContextBaseIdString: function (i) {
			return i.substr(0, i.lastIndexOf("--"));
		},
		getSeeMoreVisibility: function (c, i, A) {
			if (!c || c.length === 0) {
				return false;
			}
			return (c.length >= S && i > S && A.top < i);
		}
	});
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/valuation/controller/fragment/group/CharacteristicGroupsBase', [
	"sap/i2d/lo/lib/zvchclfz/components/valuation/controller/fragment/Base",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/factory/GroupFactory", "sap/i2d/lo/lib/zvchclfz/common/Constants", "sap/m/VBox",
	"sap/m/IconTabFilter"
], function (B, G, C, V, I) {
	"use strict";
	return B.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.group.CharacteristicGroupsBase", {
		metadata: {
			"abstract": true
		},
		_aGrids: null,
		_oGroupFactory: null,
		init: function () {
			this._aGrids = [];
			B.prototype.init.apply(this, arguments);
		},
		exit: function () {
			this.setView(null);
			if (this._oGroupFactory) {
				this._oGroupFactory.destroy();
			}
			delete this._oGroupFactory;
			delete this._aGrids;
			B.prototype.exit.apply(this, arguments);
		},
		_getGroupFactory: function () {
			if (!this._oGroupFactory) {
				this._oGroupFactory = new G({
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
		onGroupDataChangedWithoutSuspend: function (e) {
			var n = e.getSource().getContexts().length;
			this._setGroupTitleVisibility(n);
			this._setNoCharacteristicTextVisibility(n);
		},
		onCsticsReceived: function (e) {
			var s = e.getSource();
			var g = s.getContext().getPath();
			var o = this.getDataModel().getProperty(g);
			var c = this.getGroupState().getState(o);
			var i = c.bindingInfo.length;
			var a = s.getLength();
			var d;
			var O;
			for (var x = 0; this._aGrids.length > x; x++) {
				var f = this._aGrids[x].getBinding("items");
				if (f) {
					var h = f.getContext().getPath();
					if (h === g) {
						O = this._aGrids[x];
						var j = this._aGrids[x].getCustomData();
						for (var b = 0; j.length > b; b++) {
							switch (j[b].getKey()) {
							case "formId":
								d = j[b].getValue();
								break;
							}
						}
						break;
					}
				}
			}
			if (O) {
				var k = O.getId();
				var p = k.length - d.length;
				var P = k.substring(0, p);
				var l = sap.ui.getCore().byId(P + "PagingSeeMore");
				if (!l) {
					return;
				}
				if (i < a) {
					l.setVisible(true);
				} else {
					l.setVisible(false);
				}
			}
		},
		characteristicGroupFactory: function (i, c, f) {
			this._updateFormsCacheIfNeeded(c);
			var F = this._getGroupFactory().create(i, f);
			var g;
			var s = c.getProperty("InstanceId");
			var a = c.getProperty("GroupId");
			var A = "/instances/" + s + "/groups/" + a;
			var m = this.getModel("appStateModel").getGroup(s, a);
			if (!m) {
				this.getModel("appStateModel").setGroup(s, a);
			}
			F.bindObject({
				path: "appStateModel>" + A
			});
			if (F instanceof V) {
				g = F.getItems()[1];
			} else if (F instanceof I) {
				g = F.getContent()[0].getContent()[0].getItems()[0];
			} else {
				throw Error("Unhandled fragment control type '" + F.getMetadata().getName()) + "'.";
			}
			this._aGrids.push(g);
			var o = c.getObject();
			var b = g.getBindingInfo("items");
			var d = this.getGroupState().getState(o);
			if (d.bindingInfo) {
				b = d.bindingInfo;
			}
			b.events = {
				dataReceived: this.onCsticsReceived.bind(this)
			};
			F.bindObject({
				path: "characteristicGroupState>/" + this.getGroupState().getKey(o)
			});
			g.bindAggregation("items", b);
			this.getGroupState().setState(o, {
				bindingInfo: b
			});
			return F;
		},
		_setNoCharacteristicTextVisibility: function (g) {
			this.getSettingsModel().setProperty("/showNoCharacteristicText", !g);
		},
		_setGroupTitleVisibility: function (g) {
			this.getSettingsModel().setProperty("/showGroupTitle", g > 1);
		},
		_getCompModel: function () {
			return this.getView().getModel("component");
		},
		_updateFormsCacheIfNeeded: function (c) {
			var g = function (o) {
				var a = o.getObject();
				if (!a) {
					return null;
				}
				return a.ContextId + "/" + a.InstanceId + "/" + a.GroupId;
			};
			var s = g(c);
			this._aGrids.forEach(function (f, i) {
				var o = g(f.getBindingContext(C.VIEW_MODEL_NAME));
				if (!o || s === o) {
					this._aGrids.splice(i, 1);
				}
			}.bind(this));
		}
	});
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/valuation/controller/fragment/group/CharacteristicGroupsEmbedded', [
	"sap/i2d/lo/lib/zvchclfz/components/valuation/controller/fragment/group/CharacteristicGroupsBase"
], function (C) {
	"use strict";
	return C.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.group.CharacteristicGroupsEmbedded", {
		characteristicGroupFactoryEmbedded: function (i, c) {
			var f = "sap.i2d.lo.lib.zvchclfz.components.valuation.view.fragment.group.CharacteristicGroupEmbedded";
			return this.characteristicGroupFactory(i, c, f);
		}
	});
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/valuation/controller/fragment/group/CharacteristicGroupsFullScreen', [
	"sap/i2d/lo/lib/zvchclfz/components/valuation/controller/fragment/group/CharacteristicGroupsBase"
], function (C) {
	"use strict";
	return C.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.group.CharacteristicGroupsFullScreen", {
		onSelect: function (e) {
			var t = e.getParameter("selectedItem");
			var s = t.getContent()[0];
			var v = s.getContent()[0];
			var g = v.getItems()[0];
			var b = g.getBinding("items");
			var B = b.getContext().getObject();
			this.setBusy(true, s.getId());
			var V = t.getBindingContext("view").getObject();
			var a = this.getModel("appStateModel");
			var l = false;
			if (V.GroupId) {
				l = a.getGroupLoaded(V.InstanceId, V.GroupId);
			}
			if (!l) {
				this.getViewModel().syncCharacteristics(B).then(function () {
					b.resume();
					if (V.GroupId) {
						a.setSelectedGroup(V.InstanceId, V.GroupId);
					}
				}.bind(this)).finally(function () {
					b.refresh(true);
					this.setBusy(false, s.getId());
				}.bind(this));
			} else {
				this.setBusy(false, s.getId());
				if (V.GroupId) {
					a.setSelectedGroup(V.InstanceId, V.GroupId);
				}
				b.refresh(true);
			}
		},
		characteristicGroupFactoryFullScreen: function (i, c) {
			var f = "sap.i2d.lo.lib.zvchclfz.components.valuation.view.fragment.group.CharacteristicGroupFullScreen";
			var F = this.characteristicGroupFactory(i, c, f);
			var s = F.getContent()[0];
			var v = s.getContent()[0];
			var g = v.getItems()[0];
			var S = F.getController().getOwnerComponent().getShowHiddenCharacteristics();
			var a = g.getBindingInfo("items").filters;
			g.getBindingInfo("items").filters = a.filter(function (o) {
				if (o.sPath === "IsHidden") {
					if (S) {
						return false;
					} else {
						return true;
					}
				} else {
					return true;
				}
			});
			return F;
		}
	});
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/valuation/dao/ValuationDAO', ["jquery.sap.global",
	"sap/i2d/lo/lib/zvchclfz/common/dao/BaseDAO", "sap/i2d/lo/lib/zvchclfz/common/Constants", "sap/i2d/lo/lib/zvchclfz/common/util/Logger",
	"sap/ui/model/Filter",
], function (q, B, C, L, F) {
	"use strict";
	var P = 30;
	var a = function (d) {
		return d && d.__deferred;
	};
	var V = B.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.dao.ValuationDAO", {
		metadata: {
			manifest: "json",
			properties: {
				groupState: {
					type: "sap.i2d.lo.lib.zvchclfz.components.valuation.util.GroupState"
				},
				appStateModel: {
					type: "sap.i2d.lo.lib.zvchclfz.components.valuation.model.AppStateModel"
				},
				editable: {
					type: "boolean",
					defaultValue: true
				},
				showHiddenCharacteristics: {
					type: "boolean",
					defaultValue: false
				},
				valuationComponent: {
					type: "object"
				}
			},
			events: {
				groupsRequested: {
					parameters: {}
				},
				groupsChanged: {
					parameters: {
						groups: {
							type: "object[]"
						}
					}
				},
				characteristicsChanged: {
					parameters: {
						merge: {
							type: "boolean"
						},
						groupId: {
							type: "number"
						},
						changedCharacteristics: {
							type: "object[]"
						}
					}
				},
				characteristicChanged: {
					parameters: {
						changedCharacteristic: {
							type: "object"
						}
					}
				}
			}
		},
		init: function () {
			this._mCharacteristics = {};
		},
		setAltValuesStateForCstic: function (c, l, i) {
			var s = this._createCsticMapId(c);
			this._getCharacteristicsMap()[s] = {
				loaded: l,
				isLoading: i
			};
		},
		getAltValuesStateForCstic: function (c) {
			var s = this._createCsticMapId(c);
			return this._getCharacteristicsMap()[s];
		},
		loadAlternativeValuesIfNeeded: function (c, b, e) {
			if (this.isLoadNeeded(c)) {
				return this.loadAlternativeValues(c, b, e, true);
			} else {
				return Promise.reject();
			}
		},
		loadAlternativeValues: function (c, b, e, u) {
			this.setAltValuesStateForCstic(c, false, true);
			var p = this._calculateAlternativeValues(c);
			if (u) {
				p = this.readDomainValuesForCstic(c);
				p.then(function () {
					if (b) {
						b.refresh(true);
					}
					this.setAltValuesStateForCstic(c, true, false);
				}.bind(this)).catch(function (E) {});
			} else {
				this.setAltValuesStateForCstic(c, true, false);
			}
			return p;
		},
		assignCharacteristicValue: function (v, d, c, b) {
			this._resetCharacteristicsMap();
			var p = null;
			L.logDebug("assignCharacteristicValue cstic '{0}' - direction={1} - value={2}", [c.CsticId, d, v], this);
			if (d === -1) {
				p = this.callFunction("/ClearCharacteristic", v);
			} else {
				if (!v.TechnicalValue && !v.StringValue && v.ValueId === "") {
					p = this.callFunction("/ClearCharacteristic", v);
				} else {
					p = this.callFunction("/CharacteristicValueAssign", v);
				}
			}
			if (c.IsSingleValued && b) {
				this.loadAlternativeValues(v, null, null, false);
			}
			return p;
		},
		getCharacteristicMessages: function () {
			var m = this.getDataModel().getMessagesByEntity("Characteristic");
			if (m) {
				return m.filter(function (M) {
					return !M.fullTarget.startsWith("/CharacteristicValueSet(");
				});
			} else {
				return m;
			}
		},
		getCharacteristicIdFromMessage: function (m) {
			var p = m.getTarget();
			return this.getDataModel().getProperty(p);
		},
		createCharacteristicKey: function (c) {
			return this.createKey("/CharacteristicSet", V.createKeyObject(c));
		},
		createCharacteristicGroupKey: function (g) {
			return this.createKey("CharacteristicsGroupSet", V.createKeyObject(g));
		},
		readDomainValuesForCstic: function (c) {
			var k = this.createCharacteristicKey(c) + "/DomainValues";
			return this.read(k).then(function (r) {
				c.DomainValues = r.results;
				this.fireCharacteristicChanged({
					changedCharacteristic: c
				});
				return r;
			}.bind(this));
		},
		readCharacteristicsGroups: function (c, e) {
			var u = {
				"$expand": e ? "Characteristics,Characteristics/DomainValues,Characteristics/AssignedValues" : ""
			};
			this.fireGroupsRequested();
			return this.read("CharacteristicsGroups", u, c).then(function (r) {
				this.fireGroupsChanged({
					groups: r.results
				});
				return r;
			}.bind(this));
		},
		getUIFilters: function () {
			return this.getAppStateModel().getProperty("/filters");
		},
		containsFilterForChangeableProperty: function (f) {
			var u = false;
			var p = function (s) {
				return (!!s && s !== "ChangeTimestamp" && s !== "IsHidden" && s !== "Format" && s !== "IsSingleValued" && s !==
					"AdditionalValuesAllowed");
			};
			if (f) {
				f.forEach(function (o) {
					if (p(o.sPath)) {
						u = true;
					} else if (o.aFilters) {
						o.aFilters.forEach(function (i) {
							if (p(i.sPath)) {
								u = true;
							}
						});
					}
				});
			}
			return u;
		},
		getCharacteristicGroups: function (b) {
			var i = this.getDataModel().getProperty(b, null, true);
			var g = null;
			if (i && i.CharacteristicsGroups && i.CharacteristicsGroups.results) {
				g = i.CharacteristicsGroups.results;
			}
			return g;
		},
		readCharacteristics: function (c, l, f, r) {
			var I = c.getPath();
			var g = this.getCharacteristicGroups(I) || [];
			var R = [];
			for (var i = 0; i < g.length; i++) {
				R.push(this.readCharacteristicsOfGroup(g[i], l, f, r));
			}
			return Promise.all(R);
		},
		readCharacteristicsOfSelectedGroup: function (c, l, f, r) {
			var g = c.getObject().CharacteristicsGroups;
			var s = g[0].InstanceId;
			var S = this.getAppStateModel().getSelectedGroup(s);
			var o = {};
			q.each(g, function (i, G) {
				if (G.GroupId === S) {
					o = G;
					return false;
				}
			});
			return this.readCharacteristicsOfGroup(o, l, f, r);
		},
		readCharacteristicsOfGroup: function (g, l, f, r) {
			f = !!f;
			var G = this.createCharacteristicGroupKey(g);
			var i = g.GroupId;
			var I = g.InstanceId;
			var t = P;
			var v = false;
			var m = false;
			var c;
			var A = this.getAppStateModel();
			var b = A.getGroup(I, i);
			var d = P;
			if (b && b.top) {
				d = b.top;
			}
			var e = function (k) {
				return k.sPath !== "ChangeTimestamp";
			};
			var p = {
				iGroupId: g.GroupId,
				sInstanceId: g.InstanceId,
				sContextId: g.ContextId,
				aCharacteristics: null
			};
			this.getValuationComponent().fireCollectPreloadedCharacteristicGroup({
				preloadedCharacteristicGroup: p
			});
			if (p.aCharacteristics === null) {
				var u = this.getUIFilters();
				v = this.containsFilterForChangeableProperty(u) || !this.getEditable();
				var h = u.filter(e);
				if (!this.getShowHiddenCharacteristics()) {
					var o = new F("IsHidden", sap.ui.model.FilterOperator.EQ, false);
					h.push(o);
				}
				if (l) {
					t = d;
				}
				var U = {
					"$expand": "DomainValues,AssignedValues",
					"$top": t,
					"$inlinecount": "allpages"
				};
				if (!l) {
					U["$skip"] = d - P;
					m = (U.$skip > 0 || u.length === 0) && !r;
				}
				if (v) {
					this._setChangeTimestampForGroup(I, i, "");
					c = this._characteristicsReceivedWithoutChangeTimestamp.bind(this, I, i, m);
				} else {
					var T = this._getChangeTimestampForGroup(I, i);
					if (T && !f) {
						var j = new F("ChangeTimestamp", sap.ui.model.FilterOperator.GT, T);
						h.push(j);
						m = true;
					}
					c = this._characteristicsReceived.bind(this, I, i, m);
				}
				var s = "/" + G + "/Characteristics";
				return this.read(s, U, null, h, c);
			} else {
				this._characteristicsReceivedWithoutChangeTimestamp.apply(this, [I, i, m, {
					results: p.aCharacteristics
				}]);
				return new Promise(function (k, n) {
					k();
				}.bind(this));
			}
		},
		_characteristicsReceivedWithoutChangeTimestamp: function (i, g, m, r) {
			var A = this.getAppStateModel();
			if (!A.getGroup(i, g)) {
				A.setGroup(i, g);
			}
			A.setGroupLoaded(i, g, true);
			if (r && r.results) {
				this.fireCharacteristicsChanged({
					merge: m,
					groupId: g,
					changedCharacteristics: r.results
				});
			}
		},
		setLatestChangeTimestamps: function (c) {
			var s = this._getLatestChangeTimestamp(c);
			if (c.length && s) {
				var i = c[0].InstanceId;
				var g = c[0].GroupId;
				this._setChangeTimestampForGroup(i, g, s);
			}
		},
		_characteristicsReceived: function (i, g, m, r) {
			if (r && r.results) {
				this.setLatestChangeTimestamps(r.results);
				this._characteristicsReceivedWithoutChangeTimestamp(i, g, m, r);
			}
		},
		_setChangeTimestampForGroup: function (i, g, t) {
			this.getAppStateModel().setChangeTimestampForGroup(i, g, t);
		},
		_getChangeTimestampForGroup: function (i, g) {
			return this.getAppStateModel().getChangeTimestampForGroup(i, g);
		},
		_getLatestChangeTimestamp: function (c) {
			var s = null;
			var o = null;
			c.forEach(function (b) {
				if (b.ChangeTimestamp) {
					var d = new Date(b.ChangeTimestamp);
					if (!o || (d.getTime() > o.getTime())) {
						s = b.ChangeTimestamp;
						o = d;
					}
				}
			});
			return s;
		},
		_calculateAlternativeValues: function (c) {
			var v = V.createKeyObject(c);
			return this.callFunction("/CalculateAlternativeValues", v);
		},
		_getCharacteristicsMap: function () {
			return this._mCharacteristics;
		},
		_resetCharacteristicsMap: function () {
			this._mCharacteristics = {};
		},
		normalize: function (d) {
			if (!d || (d && !q.isArray(d) && !d.results)) {
				if (a(d)) {
					return null;
				} else {
					return d;
				}
			}
			var D = d;
			if (d && d.results) {
				D = d.results;
			}
			q.each(D, function (i, e) {
				q.each(e, function (k, o) {
					e[k] = this.normalize(o);
				}.bind(this));
			}.bind(this));
			return D;
		},
		isLoadNeeded: function (c) {
			if (!c.IsSingleValued) {
				return false;
			}
			if (!c.HasAssignedValue) {
				return false;
			}
			if (!this.getAltValuesStateForCstic(c)) {
				return true;
			}
			if (this.getAltValuesStateForCstic(c).loaded) {
				return false;
			}
			if (this.getAltValuesStateForCstic(c).isLoading) {
				return false;
			}
			return false;
		},
		_createCsticMapId: function (c) {
			return c.ContextId + "/" + c.InstanceId + "/" + c.GroupId + "/" + c.CsticId;
		}
	});
	V.createKeyObject = function (c) {
		var k = {
			ContextId: c.ContextId,
			InstanceId: c.InstanceId,
			GroupId: c.GroupId,
		};
		if (c.CsticId) {
			k["CsticId"] = c.CsticId;
		}
		return k;
	};
	return V;
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/valuation/factory/CharacteristicFactory', [
	"sap/i2d/lo/lib/zvchclfz/components/valuation/factory/FactoryBase",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/control/characteristic/Characteristic", "sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/ui/core/CustomData", "sap/ui/model/json/JSONModel"
], function (F, C, a, b, J) {
	"use strict";
	return F.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.factory.CharacteristicFactory", {
		init: function () {
			F.prototype.init.apply(this, arguments);
			this._mCharacteristicsMap = {};
		},
		exit: function () {
			F.prototype.exit.apply(this, arguments);
			delete this._mCharacteristicsMap;
		},
		create: function (i, c, e) {
			if (!c) {
				return null;
			}
			this._oContext = c;
			var s = this._createControlId(i, c);
			var o = new C(s, {
				editable: typeof e !== "undefined" ? e : "{valuationSettings>/editable}",
				valuationDAO: this.getValuationDAO(),
				groupBindingContext: this._getCharacteristicGroupBindingContext(),
				settingsModel: this.getSettingsModel(),
				groupRepresentation: this._getValuationComponent().getGroupRepresentation(),
				embedderName: this._getValuationComponent().getEmbedderName()
			});
			if (o && c) {
				this._addControlToCharacteristicsMap(o, this.getValuationDAO().createCharacteristicKey(c.getObject()));
			}
			return o;
		},
		getCharacteristicControlByPath: function (p) {
			return this._getCharacteristicsMap()[p];
		},
		_getCharacteristicGroups: function () {
			return this.getView().byId("groupVBox-0--groups");
		},
		_getCharacteristicGroupsBinding: function () {
			var g = this._getCharacteristicGroups();
			if (g) {
				return g.getBinding("items");
			}
		},
		_getCharacteristicGroupBindingContext: function () {
			return this._getCharacteristicGroupsBinding().getContext();
		},
		_addControlToCharacteristicsMap: function (c, p) {
			this._getCharacteristicsMap()[p] = c;
		},
		_getCharacteristicsMap: function () {
			return this._mCharacteristicsMap;
		},
		_createControlId: function (I, c) {
			var d = [];
			var D = this._getCharacteristicData(c);
			var s = this.getSettingsModel();
			var o = "objectKey";
			var S = "semanticObject";
			if (s) {
				o = s.getProperty("/objectKey");
				S = s.getProperty("/semanticObject");
			}
			var e = D.InstanceId;
			var g = D.GroupId;
			var f = D.CsticId;
			d.push(S);
			d.push(o);
			d.push(e);
			d.push(g);
			d.push(f);
			for (var i = 0; i < d.length; i++) {
				var h = "" + d[i];
				d[i] = jQuery.sap.encodeURL(h).replace(/\%/g, "perc");
			}
			var j = d.join("::");
			return I + "---" + j;
		},
		_getCharacteristicData: function (c) {
			return c.getObject();
		},
		_getValuationComponent: function () {
			return this.getView().getController().getOwnerComponent();
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/valuation/factory/FactoryBase', ["sap/i2d/lo/lib/zvchclfz/common/factory/FactoryBase"],
	function (F) {
		"use strict";
		return F.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.factory.FactoryBase", {
			metadata: {
				properties: {
					valuationDAO: {
						type: "sap.i2d.lo.lib.zvchclfz.components.valuation.dao.ValuationDAO"
					},
					groupState: {
						type: "sap.i2d.lo.lib.zvchclfz.components.valuation.util.GroupState"
					},
					viewModel: {
						type: "sap.i2d.lo.lib.zvchclfz.components.valuation.model.ViewModel"
					}
				}
			},
			exit: function () {
				var v = this.getValuationDAO();
				if (v) {
					v.destroy();
				}
				var g = this.getGroupState();
				if (g) {
					g.destroy();
				}
				F.prototype.exit.apply(this, arguments);
			}
		});
	});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/valuation/factory/GroupFactory', [
	"sap/i2d/lo/lib/zvchclfz/components/valuation/factory/FactoryBase"
], function (F) {
	"use strict";
	var A = "sap.i2d.lo.lib.zvchclfz.components.valuation.view.fragment.group.CharacteristicGroupEmbedded";
	var a = "sap.i2d.lo.lib.zvchclfz.components.valuation.view.fragment.group.CharacteristicGroupFullScreen";
	var b = {};
	b[a] = "sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.group.CharacteristicGroupFullScreen";
	b[A] = "sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.group.CharacteristicGroupEmbedded";
	return F.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.factory.GroupFactory", {
		create: function (i, f) {
			return this.createFragment(i, f, b[f]);
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/valuation/factory/GroupsFactory', [
	"sap/i2d/lo/lib/zvchclfz/components/valuation/factory/FactoryBase"
], function (F) {
	"use strict";
	var A = "sap.i2d.lo.lib.zvchclfz.components.valuation.view.fragment.group.CharacteristicGroupsEmbedded";
	var a = "sap.i2d.lo.lib.zvchclfz.components.valuation.view.fragment.group.CharacteristicGroupsFullScreen";
	var b = {};
	b[A] = "sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.group.CharacteristicGroupsEmbedded";
	b[a] = "sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.group.CharacteristicGroupsFullScreen";
	return F.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.factory.GroupsFactory", {
		create: function (i, c) {
			var s = this.getSettingsModel();
			var g = s.getProperty("/groupRepresentation")[0];
			var f = A;
			if (g === "fullScreen") {
				f = a;
			}
			return this.createFragment(i, f, b[f]);
		}
	});
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/valuation/formatter/CharacteristicFormatter', [
	"sap/i2d/lo/lib/zvchclfz/common/type/DescriptionMode", "sap/i2d/lo/lib/zvchclfz/common/Constants", "sap/base/strings/formatMessage"
], function (D, C, f) {
	"use strict";
	var Z = "\u202F";
	var E = "\u2013";
	var F = {
		getChangeDocumentValueTextDescriptionWithName: function (c, d, i) {
			return F._combineDescriptionAndValue(d, c.CsticValueDescription, c.CsticValue, i);
		},
		getCharacteristicDescriptionWithName: function (c, d, i) {
			return F._combineDescriptionAndValue(d, c.Description, c.Name, i);
		},
		getCharacteristicDescriptionWithNameAndColon: function (c, d, i) {
			return F.getCharacteristicDescriptionWithName(c, d, i) + ":";
		},
		getFormattedValueTextWithDescription: function (v, d, i, I, s, a, b, n) {
			if (!v) {
				return "";
			}
			if (b && v.HasHighPrecision) {
				return v.TechnicalValueDisplay;
			}
			var c = F.getFormattedValueText(v, I, s, a, n);
			return F._combineDescriptionAndValue(d, v.Description, c, i);
		},
		getFormattedValueText: function (v, i, I, s, n) {
			var b = v.ValueId && (v.ValueId.indexOf("-") === v.ValueId.length - 1);
			if (!v.Description && !v.FormattedValueFrom && !b) {
				return i;
			} else if (v.FormattedValueFrom) {
				return F._formatValue(v, I, s, n);
			} else if (b && !v.Description) {
				return " ";
			} else {
				return "";
			}
		},
		getFormattedStateValueText: function (c, i, I, s) {
			var t = "";
			if (c.IsInconsistent) {
				t = i;
			} else if (c.HasValueContradiction) {
				t = I;
			} else if (c.HasValueProposal) {
				t = f(s, [c.ProposalConfidence]);
			}
			return t;
		},
		getSelectDialogListItemLabel: function (d, v, i, I, s, a) {
			var l = "";
			if (v.FormattedValueFrom && d === D.TechnicalName) {
				l = F.getFormattedValueText(v, i, I, s);
			} else {
				if (!v.Description) {
					l = F.getFormattedValueText(v, i, I, s);
				} else {
					l = v.Description;
				}
				if (v.IsProposal) {
					l += " (" + f(a, [v.ProposalConfidence]) + ")";
				}
			}
			return l;
		},
		isSelectDialogListItemTextVisible: function (d, v) {
			return !!(d === D.Both && v.Description && v.FormattedValueFrom && v.Description !== v.FormattedValueFrom);
		},
		getSelectDialogListItemText: function (v, i, I) {
			return F._formatValue(v, i, I);
		},
		_combineDescriptionAndValue: function (d, s, n, i) {
			switch (d) {
			case D.Description:
				return s || n;
			case D.TechnicalName:
				return n || s;
			case D.Both:
				if ((!!s && !!n) && (s !== n)) {
					return f(i, [s, n]);
				} else {
					return s || n;
				}
			default:
				return s || n;
			}
		},
		_formatValue: function (v, i, I, n) {
			var V = "";
			var s = "";
			var a = "";
			var u = v.UnitFrom ? v.UnitFrom : v.Currency;
			var U = v.UnitTo ? v.UnitTo : v.Currency;
			if (v.FormattedValueFrom && v.FormattedValueTo && !n) {
				if (u && u === U) {
					s = v.FormattedValueFrom;
					a = v.FormattedValueTo + " " + u;
				} else if (u && u !== U) {
					s = v.FormattedValueFrom + " " + u;
					a = v.FormattedValueTo + " " + U;
				} else {
					s = v.FormattedValueFrom;
					a = v.FormattedValueTo;
				}
				V = f(I, [s, a]);
			} else if (v.FormattedValueFrom && v.FormattedValueTo && n) {
				s = v.FormattedValueFrom;
				a = v.FormattedValueTo;
				V = f(I, [s, a]);
			} else {
				V = v.FormattedValueFrom;
				if (u && !n) {
					V = V + " " + u;
				}
			}
			if (v.HasHighPrecision && v.FormattedValueFrom) {
				return i + " " + V;
			} else {
				return V;
			}
		},
		getFirstValue: function (a, d, i, I, s, b, c, S) {
			var v = F.getRelevantValue(a);
			if (v) {
				if ((c === true || S) && v.HasHighPrecision === true) {
					return F.getSingleHighPrecisionValue(a);
				} else {
					return F.getFormattedValueTextByValuePath(v, d, i, I, s, b, true);
				}
			}
			return "";
		},
		getFirstValueId: function (a, s) {
			var v = F.getRelevantValue(a);
			if (v) {
				var k = v.ValueId;
				if (k === "") {
					return NaN;
				}
				return k;
			}
			return " ";
		},
		getSingleHighPrecisionValue: function (a) {
			if (a.length === 1) {
				var v = a[0];
				if (v.HasHighPrecision === true) {
					return v.TechnicalValueDisplay;
				} else {
					return "";
				}
			} else if (a.length > 1) {
				return "";
			}
		},
		getFormattedValueTextByValuePath: function (v, d, i, I, s, a, n) {
			return F.getFormattedValueTextWithDescription(v, d, i, I, s, a, false, n);
		},
		getRelevantValue: function (a) {
			var r;
			if (a.length === 1) {
				r = a[0];
			} else if (a.length > 1) {
				for (var i = 0; i < a.length; i++) {
					var v = a[i].ValueId;
					if (!v) {
						return a[i];
					}
				}
			}
			return r;
		},
		getPlaceholder: function (c, i, I, s, a, b) {
			return F.getTooltip(c, i, I, s, a, b);
		},
		getTooltip: function (c, i, I, s, a, b, d, e) {
			var t = "";
			if (c.DomainHasIntervalValues) {
				var g = F._getConcatenatedDomainValues(c, a, b);
				t = f(I, [g]);
			} else {
				if (c.UseTemplate && c.Template.trim().length) {
					t = f(s, [c.Template]);
				}
			}
			if (c.HasDefaultValues && t) {
				t = i + "; " + t;
			} else if (c.HasDefaultValues) {
				t = i;
			}
			if (d || e) {
				var h = F._getUnitOrCurrencyText(d, e, c.Unit, c.Currency);
				if (t && h) {
					t = t + "; " + h;
				} else if (h) {
					t = h;
				}
			}
			return t;
		},
		getConcatenatedDescriptionValues: function (c, d, I, s, a, S) {
			var b = [];
			for (var i = 0; i < c.AssignedValues.length; i++) {
				var v = c.AssignedValues[i];
				b.push(F.getFormattedValueTextWithDescription(v, d, I, "", s, a, S));
			}
			var o = b.join("; ");
			if (!o) {
				o = E;
			}
			return o;
		},
		_getConcatenatedDomainValues: function (c, i, I) {
			var g = function (v) {
				return F.getFormattedValueTextByValuePath(v, D.TechnicalName, "", "", i, I);
			};
			var a = function (v) {
				return !v.IsMasterDataValue;
			};
			var b = function (v) {
				return v.IsMasterDataValue;
			};
			var d = c.DomainValues.filter(a);
			if (d.length > 0) {
				var A = c.AssignedValues.filter(a);
				A.forEach(function (o) {
					d = d.filter(function (v) {
						return v.ValueId !== o.ValueId;
					});
				});
			}
			if (d.length === 0) {
				d = c.DomainValues.filter(b);
			}
			return d.filter(F._fnCheckRealValue.bind(this)).map(g).join("; ");
		},
		_getUnitOrCurrencyText: function (i, I, u, c) {
			if (u) {
				var U = u.split("").join(Z);
				return f(i, [U]);
			} else if (c) {
				var s = c.split("").join(Z);
				return f(I, [s]);
			} else {
				return "";
			}
		},
		getUnprocessedValue: function (a) {
			var v = "";
			a.forEach(function (A) {
				if (A.ValueId === "") {
					v += A.FormattedValueFrom;
				}
			});
			return v;
		},
		_fnCheckRealValue: function (v) {
			var V = F._getValueIdFromValue(v);
			return V !== "";
		},
		_getValueIdFromValue: function (v) {
			return v.ValueId;
		}
	};
	return F;
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/valuation/model/AppStateModel', ["jquery.sap.global", "sap/ui/model/json/JSONModel",
	"sap/ui/core/message/Message"
], function (q, J, M) {
	"use strict";
	var S = 30;
	var A = J.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.model.AppStateModel", {
		_sInstanceId: null,
		initModel: function () {
			this.resetSkipTop();
			this._resetSelectedGroups();
			this.resetLoadedGroups();
			this._resetTimestamps();
			if (this.getData().filters && this.getData().filters.length > 0) {
				return;
			}
			this.resetFilters();
		},
		setChangeTimestampForGroup: function (i, g, t) {
			var G = this.getGroup(i, g);
			if (!G) {
				G = this.setGroup(i, g);
			}
			G.changeTimestamp = t;
			this.setProperty(this._getGroupPath(g), G);
		},
		getChangeTimestampForGroup: function (i, g) {
			var G = this.getGroup(i, g);
			if (G) {
				return G.changeTimestamp;
			}
			return undefined;
		},
		_setInstanceId: function (i) {
			this._sInstanceId = i;
			var d = this.getData();
			if (!d.instances) {
				d.instances = [];
				this.setData(d, true);
			}
			if (!d.instances[i]) {
				d.instances[i] = {
					groups: [],
					selectedGroup: null
				};
				this.setData(d, true);
			}
		},
		resetSkipTop: function () {
			var i = this.getInstances();
			for (var I in i) {
				var g = i[I].groups;
				for (var G in g) {
					var o = g[G];
					o.skip = 0;
					o.top = S;
				}
			}
		},
		_resetSelectedGroups: function () {
			var i = this.getProperty("/instances");
			for (var I in i) {
				i[I].selectedGroup = null;
			}
		},
		_resetTimestamps: function () {
			var i = this.getInstances();
			for (var I in i) {
				var g = i[I].groups;
				for (var G in g) {
					var o = g[G];
					o.changeTimestamp = undefined;
				}
			}
		},
		resetFilters: function () {
			var d = this.getData();
			d.filters = [];
			this.setData(d);
		},
		getGroup: function (i, g) {
			this._setInstanceId(i);
			var G = this.getProperty(this._getGroupPath(g));
			return G;
		},
		getGroups: function (i) {
			this._setInstanceId(i);
			return this.getProperty(this._getGroupsPath());
		},
		getGroupLoaded: function (i, g) {
			this._setInstanceId(i);
			var G = this.getProperty(this._getGroupPath(g));
			if (G) {
				return G.loaded;
			} else {
				return false;
			}
		},
		setGroupLoaded: function (i, g, l) {
			var G = this.getGroup(i, g);
			G.loaded = l;
			this.setProperty(this._getGroupPath(g), G);
		},
		setGroup: function (i, g, G) {
			var o = this.getGroup(i, g);
			if (!o) {
				o = {
					top: S,
					skip: 0,
					loaded: false
				};
			}
			if (G) {
				o.top = G.top;
				o.skip = G.skip;
				o.loaded = G.loaded;
			}
			this.setProperty(this._getGroupPath(g), o);
			return o;
		},
		getSelectedGroup: function (i) {
			this._setInstanceId(i);
			return this.getProperty(this._getSelectedGroupPath()) || 1;
		},
		setSelectedGroup: function (i, g) {
			var G = this.getGroup(i, g);
			if (G) {
				this.setProperty(this._getSelectedGroupPath(), g);
			}
		},
		resetLoadedGroups: function () {
			var i = this.getInstances();
			for (var I in i) {
				var g = this.getGroups(I);
				for (var G in g) {
					this.setGroupLoaded(I, G, false);
				}
			}
		},
		_getInstanceId: function () {
			return "/instances/" + this._sInstanceId;
		},
		_getSelectedGroupPath: function () {
			return this._getInstanceId() + "/selectedGroup";
		},
		_getGroupsPath: function () {
			return this._getInstanceId() + "/groups";
		},
		_getGroupPath: function (g) {
			return this._getGroupsPath() + "/" + g;
		},
		getInstances: function () {
			return this.getProperty("/instances");
		}
	});
	return A;
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/valuation/model/ViewModel', ["jquery.sap.global", "sap/ui/model/json/JSONModel",
	"sap/ui/core/message/Message", "sap/i2d/lo/lib/zvchclfz/common/util/Logger"
], function (q, J, M, L) {
	"use strict";
	var G = "groups";
	var V = J.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.model.ViewModel", {
		_oDAO: null,
		_sBindingPath: null,
		_mPreloadedCharacteristics: null,
		_mCsticGroupGeometryChange: {},
		constructor: function (d, D) {
			this._mPreloadedCharacteristics = {};
			this._oDAO = d;
			this._oDAO.attachGroupsChanged(this._onGroupsChanged, this);
			this._oDAO.attachCharacteristicsChanged(this._onCharacteristicsChanged, this);
			this._oDAO.attachCharacteristicChanged(this._onCharacteristicChanged, this);
			this._oDAO.attachMessagesChanged(this._onMessagesChanged, this);
			J.call(this, D || {});
		},
		_getDAO: function () {
			return this._oDAO;
		},
		_onGroupsChanged: function (e) {
			this.setGroups(e.getParameter(G), true);
		},
		_onCharacteristicsChanged: function (e) {
			var g = e.getParameter("groupId");
			var i = this.getGroupIndexById(g);
			var c = e.getParameter("changedCharacteristics");
			this._computeCharacteristicsGeometryChangeFlag(c);
			if (q.isNumeric(i)) {
				this.setCharacteristics(i, e.getParameter("changedCharacteristics"), e.getParameter("merge"));
			} else {
				this._mPreloadedCharacteristics[g] = c;
			}
		},
		_onCharacteristicChanged: function (e) {
			var c = e.getParameter("changedCharacteristic");
			var g = c.GroupId;
			var C = c.CsticId;
			var i = this.getGroupIndexById(g);
			var a = this.getCharacteristicIndexById(i, C);
			this.setCharacteristic(i, a, c);
		},
		_computeCharacteristicsGeometryChangeFlag: function (c) {
			if (c.length > 1) {
				var g = this.getGroupIndexById(c[0].GroupId);
				this._mCsticGroupGeometryChange[c[0].GroupId] = false;
				var p = this._getCharacteristicsGroupCharacteristicsPath(g);
				var C = this.getProperty(p);
				var I;
				if (!C) {
					this._mCsticGroupGeometryChange[c[0].GroupId] = true;
				} else if (C.length < c.length) {
					this._mCsticGroupGeometryChange[c[0].GroupId] = true;
				} else {
					for (var i = 1; i < c.length; i++) {
						I = this.getCharacteristicIndexById(g, c[i].CsticId);
						if (!I) {
							this._mCsticGroupGeometryChange[c[i].GroupId] = true;
							break;
						} else {
							if (C[I].IsHidden !== c[i].IsHidden) {
								this._mCsticGroupGeometryChange[c[i].GroupId] = true;
								break;
							}
						}
					}
				}
				L.logDebug("Characteristic geometry change flag for group '" + c[0].GroupId + "' - " + this._mCsticGroupGeometryChange[c[0].GroupId],
					null, this);
			}
		},
		hasCharacteristicsGeometryChanged: function (g) {
			if (this._mCsticGroupGeometryChange[g] === undefined) {
				return true;
			} else {
				return this._mCsticGroupGeometryChange[g];
			}
		},
		_getCharacteristicsGroupsPath: function () {
			return this.getBindingPath() + "/CharacteristicsGroups";
		},
		_getCharacteristicsGroupPath: function (g) {
			return this.getBindingPath() + "/CharacteristicsGroups/" + g;
		},
		_getCharacteristicsGroupCharacteristicsPath: function (g) {
			return this.getBindingPath() + "/CharacteristicsGroups/" + g + "/Characteristics";
		},
		_getCharacteristicsGroupCharacteristicPath: function (g, c) {
			return this.getBindingPath() + "/CharacteristicsGroups/" + g + "/Characteristics/" + c;
		},
		setBindingPath: function (b) {
			this._sBindingPath = b;
			var d = this.getData();
			if (!d[this._getKey()]) {
				d[this._getKey()] = {
					CharacteristicsGroups: null
				};
			}
			this.setData(d, true);
		},
		setData: function (d, m) {
			var n = this._getDAO().normalize(d);
			return J.prototype.setData.call(this, n, m);
		},
		setProperty: function (p, d, c, a) {
			var n = this._getDAO().normalize(d);
			return J.prototype.setProperty.call(this, p, n, c, a);
		},
		_getKey: function () {
			return this.getBindingPath().substring(1, this._sBindingPath.length);
		},
		getBindingPath: function () {
			return this._sBindingPath;
		},
		_syncCachedGroups: function () {
			var g = this._getDAO().getCharacteristicGroups(this.getBindingPath());
			this.setGroups(g, false);
		},
		sync: function (g, f) {
			return new Promise(function (r, a) {
				var R = function (c) {
					var d = this.getGroups();
					if (g) {
						for (var i = 0; i < d.length; i++) {
							if (d[i].GroupId === g) {
								this._getDAO().readCharacteristicsOfGroup({
									ContextId: d[i].ContextId,
									InstanceId: d[i].InstanceId,
									GroupId: g
								}, false, true).then(function () {
									this._syncMessages();
									r(c);
								}.bind(this));
							}
						}
					} else {
						this._getDAO().readCharacteristics(c, false, true).then(function () {
							this._syncMessages();
							r(c);
						}.bind(this));
					}
				}.bind(this);
				var b = function (c) {
					if (!this.hasGroups()) {
						this._getDAO().readCharacteristicsGroups(c).then(function () {
							R(c);
						});
					} else {
						R(c);
					}
				}.bind(this);
				if (f) {
					this.setGroups([], false);
				} else {
					this._syncCachedGroups();
				}
				this.createBindingContext(this.getBindingPath(), function (c) {
					b(c);
				}.bind(this));
			}.bind(this));
		},
		_onMessagesChanged: function (e) {
			this._syncMessages();
		},
		_syncMessages: function () {
			var m = this._getDAO().getCharacteristicMessages() || [];
			var a = {};
			for (var i = 0; i < m.length; i++) {
				var o = m[i];
				var s = o.getTarget().replace("/CsticId", "");
				var c = this._getDAO().getDataModel().getObject(s);
				var g = this.getGroups();
				if (c && g) {
					q.each(g, function (b, d) {
						if (d.ContextId === c.ContextId && d.InstanceId === c.InstanceId && d.GroupId === c.GroupId) {
							var t = this._getCharacteristicPathById(c.CsticId, b);
							var n = this._createMessage(o, t);
							a[n.getTarget()] = n;
						}
						return true;
					}.bind(this));
				}
			}
			this.setMessages(a);
		},
		_createMessage: function (m, n) {
			var N = new M({
				target: n,
				description: m.getDescription(),
				processor: this,
				message: m.getMessage(),
				type: m.getType(),
				descriptionUrl: m.getDescriptionUrl(),
				additionalText: m.getAdditionalText(),
				code: m.getCode(),
				technical: m.getTechnical(),
				persistent: m.getPersistent()
			});
			return N;
		},
		syncCharacteristics: function (g) {
			return this._oDAO.readCharacteristicsOfGroup(g, true).then(function () {
				this._syncMessages();
			}.bind(this));
		},
		getGroup: function (g) {
			return this.getProperty(this._getCharacteristicsGroupPath(g));
		},
		getGroupIndexById: function (g) {
			var a = this.getGroups();
			var i = null;
			q.each(a, function (I, o) {
				if (o.GroupId === g) {
					i = I;
					return false;
				} else {
					return true;
				}
			});
			return i;
		},
		_getCharacteristicPathById: function (c, g) {
			var C = this.getCharacteristics(g);
			var i = null;
			q.each(C, function (a, o) {
				if (o.CsticId === c) {
					i = a;
					return false;
				} else {
					return true;
				}
			});
			var s = this._getCharacteristicsGroupCharacteristicPath(g, i);
			return s;
		},
		getCharacteristicIndexById: function (g, c) {
			var C = this.getCharacteristics(g);
			var i = null;
			q.each(C, function (I, o) {
				if (o.CsticId === c) {
					i = I;
					return false;
				} else {
					return true;
				}
			});
			return i;
		},
		setGroups: function (g, m) {
			var c = this.getGroups();
			if (c && c.length && m) {
				q.each(g, function (i, o) {
					var C = this.getGroup(i);
					if (C) {
						this.setCharacteristics(i, o.Characteristics, true);
					} else {
						c.push(o);
					}
				}.bind(this));
				this.setProperty(this._getCharacteristicsGroupsPath(), c);
			} else {
				this.setProperty(this._getCharacteristicsGroupsPath(), g);
				if (!q.isEmptyObject(this._mPreloadedCharacteristics)) {
					q.each(this._mPreloadedCharacteristics, function (i, C) {
						var a = this.getGroupIndexById(i);
						this.setCharacteristics(a, C, false);
					}.bind(this));
					this._mPreloadedCharacteristics = {};
				}
			}
		},
		getGroups: function () {
			return this.getProperty(this._getCharacteristicsGroupsPath());
		},
		hasGroups: function () {
			var g = this.getGroups();
			return g && g.length > 0;
		},
		hasCharacteristics: function (g) {
			var a = this.getGroups() || [];
			var h = false;
			q.each(a, function (i, o) {
				if (g && g === o.GroupId && o.Characteristics) {
					h = true;
					return false;
				} else if (!g && o.Characteristics) {
					h = true;
				} else if (!g) {
					h = false;
					return false;
				}
				return true;
			});
			return h;
		},
		setCharacteristic: function (g, c, C) {
			this.setProperty(this._getCharacteristicsGroupCharacteristicPath(g, c), C);
		},
		getCharacteristic: function (g, c) {
			return this.getProperty(this._getCharacteristicsGroupCharacteristicPath(g, c));
		},
		getCharacteristics: function (g) {
			return this.getProperty(this._getCharacteristicsGroupCharacteristicsPath(g));
		},
		setCharacteristics: function (g, c, m) {
			if (m) {
				var C = this.getCharacteristics(g) || [];
				q.each(c, function (i, a) {
					var f = false;
					q.each(C, function (b, d) {
						if (d.CsticId === a.CsticId) {
							C[b] = q.extend(d, a);
							f = true;
							return false;
						} else {
							return true;
						}
					});
					if (!f) {
						C.push(a);
					}
				});
				this.setProperty(this._getCharacteristicsGroupCharacteristicsPath(g), C);
			} else {
				var o = this.getGroup(g);
				if (o) {
					this.setProperty(this._getCharacteristicsGroupCharacteristicsPath(g), c);
				}
			}
		},
		reset: function () {
			this.setData({});
			this._mCsticGroupGeometryChange = {};
		}
	});
	return V;
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/valuation/type/Characteristic', [], function () {
	"use strict";
	return {
		"INPUT": "INPUT",
		"MULTI_INPUT": "MULTI_INPUT",
		"SELECT": "SELECT",
		"TEXT": "TEXT"
	};
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/valuation/type/GroupRepresentation', [], function () {
	"use strict";
	return {
		Embedded: "embedded",
		FullScreen: "fullScreen"
	};
}, true);
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/valuation/util/GroupState', ["sap/ui/base/ManagedObject", "sap/ui/model/json/JSONModel"],
	function (M, J) {
		"use strict";
		var G = M.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.util.GroupState", {
			_oModel: null,
			init: function () {
				this._oModel = new J({});
			},
			exit: function () {
				if (this._oModel) {
					this._oModel.destroy();
					delete this._oModel;
				}
			},
			getStateModel: function () {
				return this._oModel;
			},
			initStateModel: function () {
				this._getStateModel().setData({});
			},
			iterateStates: function (c, s) {
				var S = this.getStateModel().getData();
				for (var k in S) {
					var m = S[k];
					c.call(s, m, k);
				}
			},
			setState: function (k, s) {
				var K = this.getKey(k);
				var c = this.getState(k);
				this._getStateModel().setProperty("/" + K, jQuery.extend(c, s));
			},
			getState: function (k) {
				var K = this.getKey(k);
				return this._getStateModel().getProperty("/" + K) || {};
			},
			getKey: function (k) {
				var c = k.ContextId;
				c = encodeURIComponent(c);
				var i = k.InstanceId;
				var g = k.GroupId;
				return c + "-" + i + "-" + g;
			},
			_getStateModel: function () {
				return this._oModel;
			}
		});
		return G;
	});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/components/valuation/util/MessageManager', [], function () {
	"use strict";
	return {
		dropCharacteristicMessages: function () {
			var m = sap.ui.getCore().getMessageManager();
			var M = m.getMessageModel().getData();
			M.forEach(function (o) {
				if (!o.target) {
					return;
				}
				if (o.target.startsWith("/CharacteristicSet(ContextId=") && o.target.endsWith(")/CsticId")) {
					m.removeMessages(o);
				}
			});
		}
	};
});
sap.ui.predefine('sap/i2d/lo/lib/zvchclfz/library', ["jquery.sap.global", "sap/ui/core/library"], function (q) {
	"use strict";
	sap.ui.getCore().initLibrary({
		name: "sap.i2d.lo.lib.zvchclf",
		version: "8.1.11",
		dependencies: ["sap.ui.core", "sap.ui.comp", "sap.uxap"],
		types: [],
		interfaces: [],
		controls: [],
		elements: []
	});
	return sap.i2d.lo.lib.zvchclf;
}, false);
sap.ui.require.preload({
	"sap/i2d/lo/lib/zvchclfz/components/classification/manifest.json": '{"_version":"1.1.0","sap.app":{"_version":"1.1.0","id":"sap.i2d.lo.lib.zvchclfz.components.classification","type":"component","resources":"resources.json","i18n":"i18n/messagebundle.properties","title":"{{FULLSCREEN_TITLE}}","ach":"CA-CL","embeddedBy":"../../","dataSources":{"mainService":{"uri":"/sap/opu/odata/SAP/LO_VCHCLF","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/metadata.xml"}}}},"sap.ui":{"_version":"1.1.0","technology":"UI5","deviceTypes":{"desktop":true,"tablet":true,"phone":true},"supportedThemes":["sap_hcb","sap_bluecrystal"]},"sap.ui5":{"_version":"1.1.0","dependencies":{"libs":{"sap.m":{"minUI5Version":"1.30.0"},"sap.ui.layout":{"minUI5Version":"1.30.0"},"sap.uxap":{},"sap.ui.core":{},"sap.i2d.lo.lib.zvchclf":{}}},"resources":{"js":[],"css":[{"uri":"css/style.css"}]},"contentDensities":{"compact":true,"cozy":false},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"sap.i2d.lo.lib.zvchclfz.components.classification.i18n.messagebundle"}},"i18nval":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"sap.i2d.lo.lib.zvchclfz.components.valuation.i18n.messagebundle"}}}},"sap.fiori":{"_version":"1.1.0","registrationIds":["F2189"],"archeType":"reusecomponent"}}',
	"sap/i2d/lo/lib/zvchclfz/components/classification/view/ClassType.view.xml": '<mvc:View id="classTypeView" controllerName="sap.i2d.lo.lib.zvchclfz.components.classification.controller.ClassType" xmlns:mvc="sap.ui.core.mvc" xmlns:core="sap.ui.core" xmlns="sap.m" visible="{localClassificationModel&gt;IsVisible}"><Panel class="sapUiMediumMarginBottom" backgroundDesign="Transparent" visible="{= !${localClassificationModel&gt;FirstVisible} }"/><OverflowToolbar class="classificationToolbar sapUiHideOnPhone"><Text id="classTypeDescription" class="sapUxAPObjectPageSubSectionHeaderTitle sapUiMediumMarginEnd" text="{parts:[{path:\'localClassificationModel&gt;ClassType\'},{path:\'localClassificationModel&gt;Description\'}],formatter:\'.formatter.formatClassType\'}"><layoutData><OverflowToolbarLayoutData priority="High"/></layoutData></Text><Label id="assignedClassesTextLabel" class="classFilterLabel sapUiHideOnPhone" visible="{= !${localClassificationModel&gt;AssignedClasses/1}}" text="{i18n&gt;ASSIGNED_CLASSES_SELECT_LABEL}" labelFor="assignedClassesText"><layoutData><OverflowToolbarLayoutData priority="Low" group="1"/></layoutData></Label><Text id="assignedClassesText" visible="{= !${localClassificationModel&gt;AssignedClasses/1}}" text="{localClassificationModel&gt;AssignedClasses/0/ClassName}" class="vchclfCommonheaderMargin sapUiMediumMarginEnd"><layoutData><OverflowToolbarLayoutData priority="Low" group="1"/></layoutData></Text><Label id="assignedClassesSelectLabel" class="classFilterLabel sapUiHideOnPhone" visible="{= ${localClassificationModel&gt;AssignedClasses}.length &gt; 1}" text="{i18n&gt;ASSIGNED_CLASSES_SELECT_LABEL}" labelFor="assignedClassesSelect"><layoutData><OverflowToolbarLayoutData priority="Low" group="1"/></layoutData></Label><Select id="assignedClassesSelect" visible="{= ${localClassificationModel&gt;AssignedClasses}.length &gt; 1}" class="vchclfCommonheaderMargin sapUiMediumMarginEnd" items="{path:\'localClassificationModel&gt;AssignedClasses\',events:{change:\'.callUpdateBinding\'}}" selectedKey="{localClassificationModel&gt;SelectedInstanceKey}" change="onClassSelectionChange"><layoutData><OverflowToolbarLayoutData priority="Low" shrinkable="false"/></layoutData><core:ListItem key="{localClassificationModel&gt;InstanceId}" text="{localClassificationModel&gt;ClassName}"/></Select><ObjectStatus id="classTypeStatus" class="sapUiMediumMarginBeginEnd" visible="{= !${localClassificationModel&gt;Status/IsReleased} }" state="{path:\'localClassificationModel&gt;Status/StatusSeverity\',formatter:\'.formatter.formatStatusState\'}" text="{path:\'localClassificationModel&gt;Status\',formatter:\'.formatter.formatStatusText\'}"><layoutData><OverflowToolbarLayoutData priority="Low" shrinkable="true"/></layoutData></ObjectStatus><ToolbarSpacer/><Button id="proposeClassificationButton" class="sapUiTinyMarginBegin" text="{i18n&gt;PROPOSE_CLASSIFICATION_BUTTON}" type="Transparent" visible="{= ${component&gt;/editable} &amp;&amp; ${component&gt;/enableProposals} &amp;&amp; ${localClassificationModel&gt;EnableProposals} }" press="onProposeClassificationButtonPress"/><Button id="unassignClassButton" class="vchclfCommonheaderMargin" text="{i18n&gt;UNASSIGN_CLASS}" enabled="{= !${localClassificationModel&gt;DisableRemoveAssignment} }" type="Transparent" press="onUnassignClassButtonPress" visible="{= ( ${component&gt;/editable} &amp;&amp; !${component&gt;/disableRemoveAssignment} ) || ${localClassificationModel&gt;/IsRemoveOnly} }"><layoutData><OverflowToolbarLayoutData closeOverflowOnInteraction="false" priority="Low" group="2"/></layoutData></Button><Button id="assignClassButton" class="vchclfCommonheaderMargin sapUiVisibleOnlyOnDesktop" tooltip="{i18n&gt;ASSIGN_CLASS}" icon="sap-icon://add" enabled="{= !${localClassificationModel&gt;/DisableAddAssignment} }" type="Transparent" press="onAssignClassButtonPress" visible="{= ${component&gt;/editable} &amp;&amp; !${component&gt;/disableAddAssignment} }"><layoutData><OverflowToolbarLayoutData closeOverflowOnInteraction="false" priority="Low" group="2"/></layoutData></Button><Button id="assignClassButtonTablet" class="vchclfCommonheaderMargin sapUiVisibleOnlyOnTablet" text="{i18n&gt;ASSIGN_CLASS}" type="Transparent" enabled="{= !${localClassificationModel&gt;/DisableAddAssignment} }" press="onAssignClassButtonPress" visible="{= ${component&gt;/editable} &amp;&amp; !${component&gt;/disableAddAssignment} }"><layoutData><OverflowToolbarLayoutData closeOverflowOnInteraction="false" priority="Low" group="2"/></layoutData></Button><Button id="filterButton" class="vchclfCommonheaderMargin" tooltip="{i18nval&gt;FILTER_DIALOG_TITLE}" icon="sap-icon://filter" type="Transparent" press="onFilterButtonPress"><layoutData><OverflowToolbarLayoutData closeOverflowOnInteraction="false" priority="Low" group="2"/></layoutData></Button></OverflowToolbar><Text id="classTypeDescriptionMobile" class="sapUxAPObjectPageSubSectionHeaderTitle sapUiVisibleOnlyOnPhone" text="{parts:[{path:\'localClassificationModel&gt;ClassType\'},{path:\'localClassificationModel&gt;Description\'}],formatter:\'.formatter.formatClassType\'}"/><VBox alignContent="Center"><ObjectStatus id="classTypeStatusMobile" class="sapUiVisibleOnlyOnPhone" visible="{= !${localClassificationModel&gt;Status/IsReleased} }" state="{path:\'localClassificationModel&gt;Status/StatusSeverity\',formatter:\'.formatter.formatStatusState\'}" text="{path:\'localClassificationModel&gt;Status\',formatter:\'.formatter.formatStatusText\'}"/></VBox><OverflowToolbar class="sapUiTinyMarginTop sapUiVisibleOnlyOnPhone"><Text id="assignedClassesTextMobile" visible="{= !${localClassificationModel&gt;AssignedClasses/1}}" text="{localClassificationModel&gt;AssignedClasses/0/ClassName}" class="vchclfCommonheaderMargin sapUiMediumMarginEnd"><layoutData><OverflowToolbarLayoutData priority="High" group="3"/></layoutData></Text><Select id="assignedClassesSelectMobile" visible="{= ${localClassificationModel&gt;AssignedClasses}.length &gt; 1}" class="vchclfCommonheaderMargin sapUiMediumMarginEnd" items="{path:\'localClassificationModel&gt;AssignedClasses\',events:{change:\'.callUpdateBinding\'}}" selectedKey="{localClassificationModel&gt;SelectedInstanceKey}" change="onClassSelectionChange"><core:ListItem key="{localClassificationModel&gt;InstanceId}" text="{localClassificationModel&gt;ClassName}"/><layoutData><OverflowToolbarLayoutData priority="High" group="3"/></layoutData></Select><ToolbarSpacer/><Button id="unassignClassButtonMobile" class="vchclfCommonheaderMargin" text="{i18n&gt;UNASSIGN_CLASS}" enabled="{= !${localClassificationModel&gt;DisableRemoveAssignment} }" type="Transparent" press="onUnassignClassButtonPress" visible="{= ${component&gt;/editable} &amp;&amp; !${component&gt;/disableRemoveAssignment} }"><layoutData><OverflowToolbarLayoutData closeOverflowOnInteraction="false" priority="Low" group="2"/></layoutData></Button><Button id="assignClassButtonMobile" class="vchclfCommonheaderMargin" text="{i18n&gt;ASSIGN_CLASS}" type="Transparent" enabled="{= !${localClassificationModel&gt;/DisableAddAssignment} }" press="onAssignClassButtonPress" visible="{= ${component&gt;/editable} &amp;&amp; !${component&gt;/disableAddAssignment} }"><layoutData><OverflowToolbarLayoutData priority="Low" group="2"/></layoutData></Button></OverflowToolbar><core:ComponentContainer id="valuationComponentContainer" name="sap.i2d.lo.lib.zvchclfz.components.valuation" propagateModel="true"/></mvc:View>',
	"sap/i2d/lo/lib/zvchclfz/components/classification/view/Classification.view.xml": '<mvc:View id="classificationView" controllerName="sap.i2d.lo.lib.zvchclfz.components.classification.controller.Classification" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" busy="{component&gt;/classificationBusy}" busyIndicatorDelay="0"><ObjectStatus id="classificationLoadErrorObjectStatus" class="sapUiMediumMarginBeginEnd" visible="{localClassificationModel&gt;/HasLoadError}" text="{i18n&gt;CLASSIFICATION_CANNOT_BE_DISPLAYED}" state="Error"/><VBox id="classificationVBox" items="{localClassificationModel&gt;/ClassTypes}"><mvc:XMLView viewName="sap.i2d.lo.lib.zvchclfz.components.classification.view.ClassType"/></VBox><FlexBox visible="{= !${localClassificationModel&gt;/HasAssignedClasses} &amp;&amp; !${localClassificationModel&gt;/HasLoadError} }" alignItems="Center" justifyContent="Center"><Label id="noClassAssignedLabel" text="{i18n&gt;NO_CLASS_ASSIGNED_LABEL_DISPLAY}"/><Link id="noClassAssignedLinkWithPeriod" class="sapUiTinyMarginBegin" visible="{= ${component&gt;/editable} &amp;&amp; !${component&gt;/enableProposals} &amp;&amp; !${component&gt;/disableAddAssignment} &amp;&amp; !${localClassificationModel&gt;/DisableAddAssignment} }" text="{i18n&gt;NO_CLASS_ASSIGNED_LINK_WITH_PERIOD}" press="onAssignClassLinkPress"/><Link id="noClassAssignedLink" class="sapUiTinyMarginBegin" visible="{= ${component&gt;/editable} &amp;&amp; ${component&gt;/enableProposals} &amp;&amp; !${component&gt;/disableAddAssignment} &amp;&amp; !${localClassificationModel&gt;/DisableAddAssignment} }" text="{i18n&gt;NO_CLASS_ASSIGNED_LINK}" press="onAssignClassLinkPress"/><Label id="noClassAssignedProposalOrLabel" class="sapUiTinyMarginBegin" visible="{= ${component&gt;/editable} &amp;&amp; ${component&gt;/enableProposals} &amp;&amp; !${component&gt;/disableAddAssignment} &amp;&amp; !${localClassificationModel&gt;/DisableAddAssignment} }" text="{i18n&gt;NO_CLASS_ASSIGNED_PROPOSAL_OR_LABEL}"/><Link id="noClassAssignedProposalLink" class="sapUiTinyMarginBegin" visible="{= ${component&gt;/editable} &amp;&amp; ${component&gt;/enableProposals} &amp;&amp; !${component&gt;/disableAddAssignment} &amp;&amp; !${localClassificationModel&gt;/DisableAddAssignment} }" text="{i18n&gt;NO_CLASS_ASSIGNED_PROPOSAL_LINK}" press="onProposeClassificationLinkPress"/></FlexBox></mvc:View>',
	"sap/i2d/lo/lib/zvchclfz/components/classification/view/fragments/AssignClassActionSheet.fragment.xml": '<core:FragmentDefinition xmlns:core="sap.ui.core" xmlns="sap.m" xmlns:app="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1"><ActionSheet id="assignClassActionSheet" afterClose="onActionSheetAfterClose"><buttons><Button id="fromThisClassTypeButton" enabled="{= !${localClassificationModel&gt;DisableAddAssignment} }" text="{i18n&gt;FROM_THIS_CLASS_TYPE}" app:fromThisClassType="true" press="onAssignClassActionSheetButtonPress"/><Button id="fromAnyClassTypeButton" text="{i18n&gt;FROM_ANY_CLASS_TYPE}" press="onAssignClassActionSheetButtonPress"/></buttons></ActionSheet></core:FragmentDefinition>',
	"sap/i2d/lo/lib/zvchclfz/components/classification/view/fragments/AssignClassDialog.fragment.xml": '<core:FragmentDefinition xmlns:core="sap.ui.core" xmlns:filterBar="sap.ui.comp.filterbar" xmlns:m="sap.m" xmlns="sap.ui.comp.valuehelpdialog"><ValueHelpDialog id="assignClassDialog" title="{i18n&gt;ADD_CLASS_TITLE}" supportMultiselect="false" resizable="true" key="InstanceId" descriptionKey="ClassName" ok="onAssignClassDialogOk" cancel="onAssignClassDialogCancel" afterClose="onAssignClassDialogAfterClose"><filterBar><filterBar:FilterBar advancedMode="true" search="onAssignClassDialogSearch"><filterBar:filterItems><filterBar:FilterItem name="ClassType" label="{i18n&gt;CLASS_TYPE}"><filterBar:control><m:Select id="classTypeSelectField" forceSelection="false" selectedKey="{assignClassDialogViewModel&gt;/SelectedClassType}" items="{localClassificationModel&gt;/AvailableClassTypes}"><core:Item key="{localClassificationModel&gt;ClassType}" text="{parts:[\'localClassificationModel&gt;ClassType\',\'localClassificationModel&gt;ClassTypeName\'],formatter:\'.formatter.formatClassType\'}"/></m:Select></filterBar:control></filterBar:FilterItem><filterBar:FilterItem name="ClassName" label="{i18n&gt;CLASS_NAME}"><filterBar:control><m:Input id="classNameSearchField"/></filterBar:control></filterBar:FilterItem><filterBar:FilterItem name="Description" label="{i18n&gt;CLASS_DESCRIPTION}"><filterBar:control><m:Input id="classDescriptionSearchField"/></filterBar:control></filterBar:FilterItem></filterBar:filterItems></filterBar:FilterBar></filterBar></ValueHelpDialog></core:FragmentDefinition>',
	"sap/i2d/lo/lib/zvchclfz/components/classification/view/fragments/UnassignClassPopover.fragment.xml": '<core:FragmentDefinition xmlns:core="sap.ui.core" xmlns="sap.m"><Popover id="unassignClassPopover" placement="Bottom" afterClose="onUnassignClassPopoverAfterClose"><List id="unassignClassList" items="{path:\'localClassificationModel&gt;AssignedClasses\',filters:{path:\'ClassType\',operator:\'NE\',value1:\'\'}}" mode="SingleSelectLeft" includeItemInSelection="true" selectionChange="onUnassignClassListSelectionChange"><StandardListItem title="{localClassificationModel&gt;ClassName}" description="{localClassificationModel&gt;Description}"/></List><footer><Toolbar><ToolbarSpacer/><Button id="unassignClassButton" text="{i18n&gt;UNASSIGN_CLASS}" press="onUnassignClassPopoverUnassignButtonPress" enabled="{= !!${classTypeViewModel&gt;/unassignClassSelectedContext}}"/></Toolbar></footer></Popover></core:FragmentDefinition>',
	"sap/i2d/lo/lib/zvchclfz/components/configuration/control/SettingsDialog.control.xml": '<core:FragmentDefinition xmlns:core="sap.ui.core" xmlns:l="sap.ui.layout" xmlns:f="sap.ui.layout.form" xmlns="sap.m"><Dialog id="configurationSettingsDialog" title="{vchI18n&gt;SETTINGS_DIALOG_TITLE}" draggable="true" resizable="true"><content><f:Form id="configurationSettingsForm" ariaLabelledBy="configurationSettings" editable="true"><f:layout><f:ResponsiveGridLayout labelSpanXL="4" labelSpanL="4" labelSpanM="12" labelSpanS="12" adjustLabelSpan="false" emptySpanXL="0" emptySpanL="0" emptySpanM="0" emptySpanS="0" columnsXL="1" columnsL="1" columnsM="1" singleContainerFullSize="false"/></f:layout><f:formContainers><f:FormContainer><f:formElements><f:FormElement label="{vchI18n&gt;SETTINGS_DIALOG_DESCRIPTION_MODE}"><f:fields><Select id="descriptionMode" forceSelection="false" selectedKey="{vchSettings&gt;/descriptionMode}"><core:Item key="both" text="{vchI18n&gt;SETTINGS_DIALOG_DESCRIPTION_MODE_BOTH}"/><core:Item key="technicalName" text="{vchI18n&gt;SETTINGS_DIALOG_DESCRIPTION_MODE_TECHNICAL_NAME}"/><core:Item key="description" text="{vchI18n&gt;SETTINGS_DIALOG_DESCRIPTION_MODE_DESCRIPTION}"/></Select></f:fields></f:FormElement><f:FormElement label="{vchI18n&gt;SETTINGS_DIALOG_SHOW_HIDDEN_CSTICS}"><f:fields><Switch id="showHiddenCharacteristicsSwitch" customTextOff="{vchI18n&gt;SETTINGS_DIALOG_SHOW_HIDDEN_CSTICS_NO}" customTextOn="{vchI18n&gt;SETTINGS_DIALOG_SHOW_HIDDEN_CSTICS_YES}" state="{vchSettings&gt;/showHiddenCharacteristics}"/></f:fields></f:FormElement><f:FormElement id="showPreciseNumbersFormElement" label="{vchI18n&gt;SETTINGS_DIALOG_SHOW_PRECISE_NUMBERS}"><f:fields><Switch id="showPreciseNumbersSwitch" customTextOff="{vchI18n&gt;SETTINGS_DIALOG_SHOW_PRECISE_NUMBERS_NO}" customTextOn="{vchI18n&gt;SETTINGS_DIALOG_SHOW_PRECISE_NUMBERS_YES}" state="{vchSettings&gt;/showPreciseNumbers}"/></f:fields></f:FormElement></f:formElements></f:FormContainer></f:formContainers></f:Form></content><beginButton><Button id="saveAndClose" text="{vchI18n&gt;SETTINGS_DIALOG_OK}" press="saveAndClose"/></beginButton><endButton><Button id="close" text="{vchI18n&gt;SETTINGS_DIALOG_CANCEL}" press="close"/></endButton></Dialog></core:FragmentDefinition>',
	"sap/i2d/lo/lib/zvchclfz/components/configuration/manifest.json": '{"_version":"1.7.0","sap.app":{"id":"sap.i2d.lo.lib.zvchclfz.components.configuration","type":"component","resources":"resources.json","i18n":"i18n/messagebundle.properties","title":"{{FULLSCREEN_TITLE}}","ach":"LO-VCH-FIO","embeddedBy":"../../","dataSources":{"mainService":{"uri":"/sap/opu/odata/SAP/LO_VCHCLF","type":"OData","settings":{"odataVersion":"2.0","localUri":"../../common/localService/metadata.xml"}}}},"sap.ui":{"technology":"UI5","deviceTypes":{"desktop":true,"tablet":true,"phone":true},"supportedThemes":["sap_hcb","sap_belize"]},"sap.ui5":{"dependencies":{"libs":{"sap.m":{"minUI5Version":"1.40.0"},"sap.ui.layout":{"minUI5Version":"1.40.0"},"sap.ui.core":{"minUI5Version":"1.40.0"},"sap.f":{"minUI5Version":"1.40.0"}}},"componentUsages":{"valuationComponent":{"name":"sap.i2d.lo.lib.zvchclfz.components.valuation","settings":{}},"structurePanelComponent":{"name":"sap.i2d.lo.lib.zvchclfz.components.structurepanel","settings":{}},"inspectorComponent":{"name":"sap.i2d.lo.lib.zvchclfz.components.inspector","settings":{}}},"resources":{"js":[],"css":[{"uri":"css/style.css"}]},"contentDensities":{"compact":true,"cozy":false},"models":{"vchI18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"sap.i2d.lo.lib.zvchclfz.components.configuration.i18n.messagebundle"}},"configurationSettings":{"preload":true,"type":"sap.ui.model.json.JSONModel"}}}}',
	"sap/i2d/lo/lib/zvchclfz/components/configuration/view/Configuration.view.xml": '<mvc:View controllerName="sap.i2d.lo.lib.zvchclfz.components.configuration.controller.Configuration" xmlns:mvc="sap.ui.core.mvc" xmlns:core="sap.ui.core" xmlns="sap.m" xmlns:f="sap.f" xmlns:config="sap.i2d.lo.lib.zvchclfz.components.configuration.control" xmlns:splitter="sap.i2d.lo.lib.zvchclfz.common.control" xmlns:l="sap.ui.layout" xmlns:uxap="sap.uxap" busyIndicatorDelay="0" height="100%"><f:DynamicPage id="dynamicPage" fitContent="true" showFooter="{configurationSettings&gt;/showFooter}" class="vchDynamicPageContentWithoutPadding"><f:title><f:DynamicPageTitle id="dynamicPageTitle" backgroundDesign="Solid" areaShrinkRatio="0.1:1:1" actions="{path:\'headerConfiguration&gt;/headerActions\',factory:\'.createAction\'}"><f:heading><Title text="{headerConfiguration&gt;/title}"/></f:heading><f:expandedContent><Text text="{headerConfiguration&gt;/subtitle}"/></f:expandedContent><f:snappedContent><HBox alignItems="Center" wrap="Wrap" renderType="Bare"><Text wrapping="false" text="{headerConfiguration&gt;/subtitle}" class="sapUiTinyMarginEnd"/><ObjectStatus text="{vchclf&gt;StatusDescription}" state="{= ${vchclf&gt;StatusType} === \'1\' ? \'Success\' : ${vchclf&gt;StatusType} === \'3\' ? \'Warning\' : \'Error\'}"/></HBox></f:snappedContent></f:DynamicPageTitle></f:title><f:header><f:DynamicPageHeader id="dynamicPageHeader" backgroundDesign="Solid" pinnable="false"><f:content><HeaderContainer id="headerContainer" showDividers="false" tooltip="{vchI18n&gt;CONFIGURATION_HEADER_TOOLTIP}" content="{path:\'headerConfiguration&gt;/headerFields\',factory:\'.createField\'}"/></f:content></f:DynamicPageHeader></f:header><f:content><l:FixFlex><l:fixContent><MessageStrip id="InconsistentInstanceMessageStrip" visible="{= ${vchclf&gt;StatusType} === \'4\' ? true : false }" text="{parts:[\'vchclf&gt;Instances\',\'vchI18n&gt;INCONSISTENT_INSTANCE_TEXT_MULTILEVEL_MESSAGESTRIP\',\'vchI18n&gt;INCONSISTENT_INSTANCE_TEXT_SINGLELEVEL_MESSAGESTRIP\',\'vchI18n&gt;INCONSISTENT_INSTANCE_TEXT_MULTILEVEL_MESSAGESTRIP_W_CSTIC_INFO\',\'vchI18n&gt;INCONSISTENT_INSTANCE_TEXT_SINGLELEVEL_MESSAGESTRIP_W_CSTIC_INFO\',\'vchclf&gt;StatusType\',\'vchclf&gt;InconsistencyInformation\',\'configurationSettings&gt;/descriptionMode\',\'vchI18n&gt;DESCRIPTION_MODE_TEXT_BOTH\'],formatter:\'.oInconsistencyInformationFormatter.getTextForInconsistentInstance\'}" type="Error" class="sapiconfont sapUiTinyMarginTop"><link><Link id="InconsistencyHelpLink" text="{parts:[\'vchI18n&gt;INCONSISTENCY_INFORMATION_LINK_TEXT_MESSAGESTRIP_W_LONGTEXT\',\'vchclf&gt;InconsistencyInformation\'],formatter:\'.oInconsistencyInformationFormatter.getTextForInconsistencyLink\'}" target="_blank" press="onInconsistencyInformationRequested" visible="{parts:[\'vchI18n&gt;INCONSISTENCY_INFORMATION_LINK_TEXT_MESSAGESTRIP_W_LONGTEXT\',\'vchclf&gt;InconsistencyInformation\'],formatter:\'.oInconsistencyInformationFormatter.getVisibilityOfInconsistencyLink\'}"/></link></MessageStrip></l:fixContent><l:flexContent><splitter:Splitter id="layout" leftContentIsAvailable="{configurationSettings&gt;/StructurePanelIsVisible}"><splitter:leftContent><core:ComponentContainer id="structurePanelComponentContainer" height="100%"/></splitter:leftContent><splitter:middleContent><l:FixFlex minFlexSize="50" id="instanceArea"><l:fixContent><Bar id="singleInstanceHeader" design="Header" class="sapContrastPlus sapVchlClfInstanceHeader"><contentLeft><HBox wrap="Wrap" class="sapUiSmallMarginTop"><Title titleStyle="H3" class="sapUiMediumMarginBegin" text="{= !!${vchclf&gt;MaterialDescription} ? ${vchclf&gt;MaterialDescription} : ${vchclf&gt;Material} }"/><Text text="{vchclf&gt;Material}" class="sapUiSmallMarginBegin" visible="{= !!${vchclf&gt;MaterialDescription}}"/><ToolbarSeparator class="sapUiSmallMarginBegin sapUiTinyMarginTop" visible="{= !!${vchclf&gt;MaterialDescription} &amp;&amp; !!${vchclf&gt;ConfigurationValidationStatusDescription} &amp;&amp; ${configurationSettings&gt;/uiMode} !== \'Display\' }"/><ObjectStatus text="{vchclf&gt;ConfigurationValidationStatusDescription}" state="{= ${vchclf&gt;ConfigurationValidationStatus} === \'1\' ? \'Success\' : ${vchclf&gt;ConfigurationValidationStatus} === \'4\' ? \'Error\' : \'Warning\'}" class="sapUiSmallMarginBegin" visible="{= !!${vchclf&gt;MaterialDescription} &amp;&amp; !!${vchclf&gt;ConfigurationValidationStatusDescription} &amp;&amp; ${configurationSettings&gt;/uiMode} !== \'Display\' }"/></HBox></contentLeft><contentRight><Button id="buttonFilter" icon="sap-icon://filter" tooltip="{vchI18n&gt;FILTER_BUTTON_TOOLTIP}" press="onOpenFilterDialog" ariaDescribedBy="singleInstanceHeader"/><Button id="buttonUndo" icon="sap-icon://undo" press="onUndo" visible="{configurationSettings&gt;/editable}" tooltip="{vchI18n&gt;UNDO_BUTTON_TOOLTIP}" enabled="{commandState&gt;/enableUndoButton}"/><Button id="buttonRedo" icon="sap-icon://redo" press="onRedo" visible="{configurationSettings&gt;/editable}" tooltip="{vchI18n&gt;REDO_BUTTON_TOOLTIP}" enabled="{commandState&gt;/enableRedoButton}"/></contentRight></Bar></l:fixContent><l:flexContent><core:ComponentContainer id="valuationComponentContainer" propagateModel="true" height="100%"/></l:flexContent></l:FixFlex></splitter:middleContent><splitter:rightContent><core:ComponentContainer id="inspectorComponentContainer" height="100%"/></splitter:rightContent></splitter:Splitter></l:flexContent></l:FixFlex></f:content></f:DynamicPage><mvc:XMLView id="errorPage" visible="false" viewName="sap.i2d.lo.lib.zvchclfz.components.configuration.view.ErrorPage"/></mvc:View>',
	"sap/i2d/lo/lib/zvchclfz/components/configuration/view/ErrorPage.view.xml": '<mvc:View height="100%" xmlns:mvc="sap.ui.core.mvc" xmlns:l="sap.ui.layout" xmlns="sap.m"><MessagePage showHeader="false" text="{vchI18n&gt;LOADING_ERROR}" description="" icon="sap-icon://alert"/></mvc:View>',
	"sap/i2d/lo/lib/zvchclfz/components/configuration/view/NotConfigurableItem.view.xml": '<mvc:View height="100%" xmlns:mvc="sap.ui.core.mvc" xmlns:l="sap.ui.layout" xmlns="sap.m"><MessagePage showHeader="false" text="{vchI18n&gt;NOT_CONFIGURABLE_ITEM_SELECTED}" description="" icon=""/></mvc:View>',
	"sap/i2d/lo/lib/zvchclfz/components/configuration/view/fragment/AcceptReviewDialog.fragment.xml": '<core:FragmentDefinition xmlns:core="sap.ui.core" xmlns="sap.m"><Dialog id="acceptReviewStatus" type="Message" state="Information" title="{vchI18n&gt;ACCEPT_REVIEW_STATUS}" resizable="true" draggable="true" contentWidth="432px" verticalScrolling="false"><beginButton><Button id="acceptReviewStatusDialogOkButton" type="Emphasized" text="{vchI18n&gt;ACCEPT_REVIEW_STATUS_OK_BUTTON}"/></beginButton><endButton><Button id="acceptReviewStatusDialogCancelButton" text="{vchI18n&gt;ACCEPT_REVIEW_STATUS_CANCEL_BUTTON}"/></endButton><content><Text text="{vchI18n&gt;ACCEPT_REVIEW_STATUS_DIALOG_CONTENT}"/></content></Dialog></core:FragmentDefinition>',
	"sap/i2d/lo/lib/zvchclfz/components/configuration/view/fragment/CancelConfigurationDialog.fragment.xml": '<core:FragmentDefinition xmlns:core="sap.ui.core" xmlns="sap.m"><Dialog id="cancelConfiguration" contentWidth="20%" contentHeight="auto" state="Warning" type="Message" title="{vchI18n&gt;CANCEL_CONFIGURATION}"><beginButton><Button id="okButton" text="{vchI18n&gt;YES}"/></beginButton><endButton><Button id="cancelButton" text="{vchI18n&gt;NO}" press="onCancelExitDialog"/></endButton><content><Text id="cancelDialogText" text="{vchI18n&gt;CANCEL_CONFIGURATION_TEXT}" class="sapUiResponsiveMargin"/></content></Dialog></core:FragmentDefinition>',
	"sap/i2d/lo/lib/zvchclfz/components/configuration/view/fragment/ChangeDocumentsDialog.fragment.xml": '<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:l="sap.ui.layout"><Dialog id="ChangeDocumentsDialog" title="{vchI18n&gt;CHANGE_DOCUMENTS_DIALOG_TITLE}" resizable="true" draggable="true" contentWidth="50%" contentHeight="50%" verticalScrolling="false"><l:FixFlex minFlexSize="5"><l:fixContent><OverflowToolbar><Title level="H3" text="{CHANGE_DOCUMENTS_TABLE_TITLE}"/></OverflowToolbar></l:fixContent><l:flexContent><Table id="ChangeDocumentsTable" inset="false" fixedLayout="false" noDataText="{vchI18n&gt;NO_CHANGE_DOCUMENTS}" items="{path:\'vchclf_bind_only&gt;ChangeDocuments\',sorter:[{path:\'ProductId\',group:true,descending:false},{path:\'ChangedOn\',descending:true},{path:\'CsticName\',descending:false}],groupHeaderFactory:\'.getGroupHeader\',templateShareable:false}"><columns><Column id="CsticNameColumn"><Text text="{vchI18n&gt;CHANGE_DOCUMENT_CSTIC_NAME}"/></Column><Column id="CsticNewValueColumn"><Text text="{vchI18n&gt;CHANGE_DOCUMENT_CSTIC_VALUE}"/></Column><Column id="ChangeTextColumn"><Text text="{vchI18n&gt;CHANGE_DOCUMENT_CHANGE_TEXT}"/></Column><Column id="ChangedByColumn"><Text text="{vchI18n&gt;CHANGE_DOCUMENT_CHANGED_BY}"/></Column><Column id="ChangedOnColumn"><Text text="{vchI18n&gt;CHANGE_DOCUMENT_CHANGED_ON}"/></Column></columns><items><ColumnListItem><cells><Text id="CsticNameCell" text="{vchclf_bind_only&gt;CsticName}"/><Text id="CsticValueCell" text="{parts:[\'vchclf_bind_only&gt;\',\'vchSettings&gt;/descriptionMode\',\'vchI18n&gt;VALUE_LABEL_BOTH\'],formatter:\'.formatter.getChangeDocumentValueTextDescriptionWithName\'}          "/><Text id="ChangeTextCell" text="{vchclf_bind_only&gt;ChangeText}"/><Text id="ChangedByCell" text="{vchclf_bind_only&gt;ChangedBy}"/><ObjectNumber id="ChangedOnCell" number="{path:\'vchclf_bind_only&gt;ChangedOn\',type:\'sap.ui.model.type.DateTime\'}"/></cells></ColumnListItem></items></Table></l:flexContent></l:FixFlex><buttons><Button id="closeChangeDocumentsDialog" text="{vchI18n&gt;CLOSE_PRP}" press="closeChangeDocumentsDialog"/></buttons></Dialog></core:FragmentDefinition>',
	"sap/i2d/lo/lib/zvchclfz/components/configuration/view/fragment/DoneConfigurationDialog.fragment.xml": '<core:FragmentDefinition xmlns:core="sap.ui.core" xmlns="sap.m"><Dialog id="doneConfiguration" contentWidth="20%" contentHeight="auto" type="Message" state="Warning" title="{= ${vchclf&gt;StatusType} === \'3\' ? ${vchI18n&gt;CONFIGURATION_INCOMPLETE} :  ${vchI18n&gt;CONFIGURATION_INCONSISTENT} }"><beginButton><Button id="okButton" text="{vchI18n&gt;OK}"/></beginButton><endButton><Button id="cancelButton" text="{vchI18n&gt;CANCEL}" press="onCancelExitDialog"/></endButton><content><Text id="doneDialogText" text="{= ${vchclf&gt;StatusType} === \'3\' ? ${vchI18n&gt;INCOMPLETE_TEXT} :  ${vchI18n&gt;INCONSISTENT_TEXT} }" class="sapUiResponsiveMargin"/></content></Dialog></core:FragmentDefinition>',
	"sap/i2d/lo/lib/zvchclfz/components/configuration/view/fragment/ErrorDialog.fragment.xml": '<core:FragmentDefinition xmlns:core="sap.ui.core" xmlns="sap.m"><Dialog id="errorConfiguration" contentWidth="500px" contentHeight="300px" type="Message" state="Error" title="{vchI18n&gt;ERROR}" resizable="false" verticalScrolling="false"><endButton><Button id="closeButton" text="{vchI18n&gt;CLOSE_ERROR_DIALOG_TXT}"/></endButton><content/></Dialog></core:FragmentDefinition>',
	"sap/i2d/lo/lib/zvchclfz/components/configuration/view/fragment/InconsistencyInformationDetails.fragment.xml": '<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:l="sap.ui.layout" xmlns:f="sap.ui.layout.form"><l:VerticalLayout width="100%"><Title text="{vchI18n&gt;INCONSISTENCY_INFORMATION_DETAILS_TITLE}" class="sapUiTinyMarginTop sapUiSmallMarginBottom sapVchclfBold"/><Table inset="false" items="{path:\'vchclf&gt;Details\',templateShareable:\'false\',sorter:{path:\'Material\',descending:false,group:true},groupHeaderFactory:\'.getGroupHeader\'}"><columns><Column width="16rem"><Text text="{vchI18n&gt;CHARACTERISTIC}"/></Column><Column width="16rem" demandPopin="true"><Text text="{vchI18n&gt;VALUES}"/></Column><Column width="4rem" demandPopin="true"><Text text="{vchI18n&gt;INSPECT}"/></Column></columns><items><ColumnListItem><cells><Text text="{parts:[{path:\'vchI18n&gt;DESCRIPTION_MODE_TEXT_BOTH\'},{path:\'vchclf&gt;CsticName\'},{path:\'vchclf&gt;CsticDescription\'},{path:\'vchSettings&gt;/descriptionMode\'}],formatter:\'.oInconsistencyInformationFormatter.combineDescriptionAndValue\'}"/><VBox items="{path:\'vchclf&gt;AssignedCsticValues\',templateShareable:\'false\'}"><Text text="{parts:[{path:\'vchI18n&gt;DESCRIPTION_MODE_TEXT_BOTH\'},{path:\'vchclf&gt;FormattedValueFrom\'},{path:\'vchclf&gt;FormattedValueTo\'},{path:\'vchclf&gt;Description\'},{path:\'vchI18n&gt;INTERVAL_REPRESENTATION\'},{path:\'vchSettings&gt;/descriptionMode\'}],formatter:\'.oInconsistencyInformationFormatter.formatCsticValue\'}"/></VBox><core:Icon src="sap-icon://inspection" tooltip="{vchI18n&gt;SHOW_IN_INSPECTOR}" class="sapUiTinyMarginBegin" press="onInconsistencyInfoDetailTextForCsticPress"/></cells></ColumnListItem></items></Table><Title text="{vchI18n&gt;DEPENDENCY}" class="sapUiMediumMarginTop sapUiSmallMarginBottom sapVchclfBold"/><Table inset="false" items="{path:\'configurationSettings&gt;/triggerForDependencyLinkFactory\',templateShareable:\'false\'}"><columns><Column width="16rem"><Text text="{vchI18n&gt;DEPENDENCY_DESCRIPTION}"/></Column><Column width="12rem" demandPopin="true"><Text text="{vchI18n&gt;DEPENDENCY_ID}"/></Column><Column width="8rem" demandPopin="true"><Text text="{vchI18n&gt;DEPENDENCY_TYPE_DESCRIPTION}"/></Column></columns><items><ColumnListItem><cells><Text text="{= ${vchclf&gt;DependencyDescription} ? ${vchclf&gt;DependencyDescription} : \'\\u2013\' }"/><Link text="{vchclf&gt;DependencyId}" press="onDependencyClicked"/><Text text="{vchclf&gt;DependencyTypeDescr}"/></cells></ColumnListItem></items></Table></l:VerticalLayout></core:FragmentDefinition>',
	"sap/i2d/lo/lib/zvchclfz/components/configuration/view/fragment/InconsistencyPopover.fragment.xml": '<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:f="sap.ui.layout.form" xmlns:layout="sap.ui.layout"><Popover id="InconsistencyInformationPopover" class="sapVchclfPopoverMaxWidth" contentMinWidth="300px" placement="Auto"><content><layout:VerticalLayout id="MultiDocumentationLayout" width="100%" visible="{parts:[{path:\'constants&gt;/INCONSISTENCY_INFORMATION/MULTI_DOCU\'},{path:\'vchclf&gt;InconsistencyInformation\'}],formatter:\'.oInconsistencyInformationFormatter.getDocumentationVisibility\'}" content="{path:\'vchclf&gt;InconsistencyInformation\',filters:[{path:\'DependencyId\',operator:\'NE\',value1:\'\'}]}"><layout:content><Panel width="auto" expandable="true" expanded="false" headerText="{vchclf&gt;DependencyDescription}"><content><layout:VerticalLayout width="100%"><Title text="{vchI18n&gt;INCONSISTENCY_INFORMATION_DOCUMENTATION_TITLE}" visible="{vchclf&gt;HasDocumentation}" class="sapVchclfBold"/><VBox visible="{vchclf&gt;HasDocumentation}" class="sapUiTinyMargin sapVchclfPopoverVBoxWordBreak sapUiSmallMarginBottom"><core:HTML binding="{path:\'vchclf&gt;Documentation\'}" content="{path:\'vchclf&gt;Html\'}"/></VBox><core:Fragment fragmentName="sap.i2d.lo.lib.zvchclfz.components.configuration.view.fragment.InconsistencyInformationDetails" type="XML"/></layout:VerticalLayout></content></Panel></layout:content></layout:VerticalLayout><layout:VerticalLayout id="SingleDocumentationLayout" visible="{parts:[{path:\'constants&gt;/INCONSISTENCY_INFORMATION/SINGLE_DOCU\'},{path:\'vchclf&gt;InconsistencyInformation\'}],formatter:\'.oInconsistencyInformationFormatter.getDocumentationVisibility\'}" class="sapUiContentPadding" width="100%" content="{path:\'vchclf&gt;InconsistencyInformation\',filters:[{path:\'DependencyId\',operator:\'NE\',value1:\'\'}]}"><layout:content><layout:VerticalLayout width="100%"><Title text="{vchI18n&gt;INCONSISTENCY_INFORMATION_DOCUMENTATION_TITLE}" visible="{vchclf&gt;HasDocumentation}" class="sapVchclfBold"/><VBox visible="{vchclf&gt;HasDocumentation}" class="sapUiTinyMargin sapVchclfPopoverVBoxWordBreak sapUiSmallMarginBottom"><core:HTML binding="{path:\'vchclf&gt;Documentation\'}" content="{path:\'vchclf&gt;Html\'}"/></VBox><core:Fragment fragmentName="sap.i2d.lo.lib.zvchclfz.components.configuration.view.fragment.InconsistencyInformationDetails" type="XML"/></layout:VerticalLayout></layout:content></layout:VerticalLayout></content></Popover></core:FragmentDefinition>',
	"sap/i2d/lo/lib/zvchclfz/components/configuration/view/fragment/PricingRecords.fragment.xml": '<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:v="sap.ui.comp.variants" xmlns:l="sap.ui.layout"><Dialog id="PricingRecordDialog" title="{vchI18n&gt;PRICING_RECORDS_DIALOG_TITLE}" resizable="true" draggable="true" contentWidth="50%" contentHeight="50%" verticalScrolling="false"><l:FixFlex minFlexSize="5"><l:fixContent><OverflowToolbar><Title level="H3" text="{pricingRecordsFilterModel&gt;/recordsNumberTitle}"/><ToolbarSpacer/><Select id="PricingRecordsFilter" items="{pricingRecordsFilterModel&gt;/filters}" selectedKey="{pricingRecordsFilterModel&gt;/selectedFilterKey}" change="onSelectionChange"><core:Item id="PricingFilterItem" key="{pricingRecordsFilterModel&gt;key}" text="{pricingRecordsFilterModel&gt;text}"/></Select></OverflowToolbar></l:fixContent><l:flexContent><Table id="PricingRecordsTable" inset="false" noDataText="{vchI18n&gt;NO_CONDITION_RECORDS_TEXT}" items="{path:\'vchclf_bind_only&gt;PricingRecords\',templateShareable:false,events:{dataReceived:\'.onPricingRecordsReceived\'},parameters:{countMode:\'sap.ui.model.odata.CountMode.None\'}}"><columns><Column id="CondTypeIdHdr"><Text text="{vchI18n&gt;CONDITION_TYPE_ID}"/></Column><Column id="CondTypeDescr"><Text text="{vchI18n&gt;CONDITION_TYPE_DESCR}"/></Column><Column id="CondAmount" hAlign="Right"><Text text="{vchI18n&gt;CONDITION_AMOUNT}" width="100%" textAlign="Right"/></Column><Column id="CondRefFactor" hAlign="Right"><Text text="{vchI18n&gt;CONDITION_REF_FACTOR}"/></Column><Column id="CalcCondFactor" hAlign="Right"><Text text="{vchI18n&gt;CALC_CONDITION_FACTOR}"/></Column><Column id="CondValue" hAlign="Right" width="auto"><Text text="{vchI18n&gt;COLUMN_TITLE_CONDITION_VALUE}"/></Column></columns><items><ColumnListItem><cells><ObjectNumber id="CondTypeIdCell" number="{vchclf_bind_only&gt;CondTypeId}" tooltip="{parts:[{path:\'vchclf_bind_only&gt;CondInactive\'},{path:\'vchclf_bind_only&gt;CondStatistical\'}],formatter:\'.getConditionRecordTooltip\'}"/><Text id="CondTypeDescrCell" text="{vchclf_bind_only&gt;CondTypeDescr}"/><ObjectNumber id="CondAmountCell" number="{parts:[{path:\'vchclf_bind_only&gt;ConditionAmount\'},{path:\'vchclf_bind_only&gt;ConditionUnit\'}],type:\'sap.ui.model.type.Currency\',formatOptions:{showMeasure:false}}" unit="{vchclf_bind_only&gt;ConditionUnit}"/><ObjectNumber id="CondRefFactorCell" number="{parts:[{path:\'vchclf_bind_only&gt;CondRefFactor\'},{path:\'vchclf_bind_only&gt;CondRefUOM\'}],formatOptions:{showMeasure:false},formatter:\'.getCondRefFactor\'}" unit="{vchclf_bind_only&gt;CondRefUOM}"/><ObjectNumber id="CalcCondFactorCell" number="{parts:[{path:\'vchclf_bind_only&gt;FactorDisp\'},{path:\'vchclf_bind_only&gt;VariantCondition\'}],formatter:\'.getCalcCondFactor\'}"/><ObjectNumber id="CondValueCell" number="{parts:[{path:\'vchclf_bind_only&gt;ConditionValue\'},{path:\'vchclf_bind_only&gt;Currency\'}],type:\'sap.ui.model.type.Currency\',formatOptions:{showMeasure:false}}" unit="{vchclf_bind_only&gt;Currency}"/></cells></ColumnListItem></items></Table></l:flexContent></l:FixFlex><buttons><Button id="closeDialog" text="{vchI18n&gt;CLOSE_PRP}" press="closeDialog"/></buttons></Dialog></core:FragmentDefinition>',
	"sap/i2d/lo/lib/zvchclfz/components/configuration/view/fragment/ReviseEngineeringChangesDialog.fragment.xml": '<core:FragmentDefinition xmlns:core="sap.ui.core" xmlns="sap.m"><Dialog id="reviseEngineeringChanges" type="Message" state="Information" title="{vchI18n&gt;REVISE_ENGINEERING_CHANGES_DIALOG}" resizable="false" contentWidth="432px" draggable="true" verticalScrolling="false"><beginButton><Button id="okButton" type="Emphasized" text="{vchI18n&gt;REVISE_ENGINEERING_CHANGES_OK_BUTTON}" press=".onReviseEngineeringChanges"/></beginButton><endButton><Button id="cancelButton" text="{vchI18n&gt;REVISE_ENGINEERING_CHANGES_CANCEL_BUTTON}"/></endButton><content><Text text="{vchI18n&gt;REVISE_ENGINEERING_CHANGES_DIALOG_CONTENT}"/></content></Dialog></core:FragmentDefinition>',
	"sap/i2d/lo/lib/zvchclfz/components/configuration/view/fragment/SetETOStatusDialog.fragment.xml": '<core:FragmentDefinition xmlns:core="sap.ui.core" xmlns="sap.m"><Dialog id="setETOStatus" type="Message" state="Information" title="{vchI18n&gt;SET_ETO_STATUS}" resizable="true" draggable="true" contentWidth="432px" verticalScrolling="false"><beginButton><Button id="setETOStatusDialogOkButton" type="Emphasized" text="{vchI18n&gt;SET_ETO_STATUS_OK_BUTTON}" press=".onConfirmSetETOStatus"/></beginButton><endButton><Button id="setETOStatusDialogCancelButton" text="{vchI18n&gt;SET_ETO_STATUS_CANCEL_BUTTON}"/></endButton><content><Text text="{vchI18n&gt;SET_ETO_STATUS_DIALOG_CONTENT}"/></content></Dialog></core:FragmentDefinition>',
	"sap/i2d/lo/lib/zvchclfz/components/configuration/view/fragment/StatusChangedDialog.fragment.xml": '<core:FragmentDefinition xmlns:core="sap.ui.core" xmlns="sap.m"><Dialog id="statusChangedConfiguration" contentWidth="20%" contentHeight="auto" type="Message" state="Warning" title="{vchI18n&gt;STATUS_CHANGED_TITLE}"><beginButton><Button id="leaveButton" text="{vchI18n&gt;BTN_TEXT_LEAVE_CONFIGURATION_LOCKED}"/></beginButton><endButton><Button id="unlockButton" text="{vchI18n&gt;BTN_TEXT_UNLOCK_AND_CONTINUE_CONFIGURATION}" press="onUnlockStatusChangedDialog"/></endButton><content><Text id="doneDialogText" text="{parts:[\'vchI18n&gt;STATUS_CHANGED_TEXT\',\'statusChangedDialog&gt;/lastStatusTypeDescription\',\'statusChangedDialog&gt;/newStatusTypeDescription\'],formatter:\'.oInconsistencyInformationFormatter.formatMessage\'}" class="sapUiResponsiveMargin"/></content></Dialog></core:FragmentDefinition>',
	"sap/i2d/lo/lib/zvchclfz/components/configuration/view/fragment/SwitchToETODialog.fragment.xml": '<core:FragmentDefinition xmlns:core="sap.ui.core" xmlns="sap.m"><Dialog id="switchToETO" type="Message" state="Warning" title="{vchI18n&gt;SWITCH_TO_ETO_DIALOG}" resizable="false" draggable="true" verticalScrolling="false"><beginButton><Button id="okButton" type="Emphasized" text="{vchI18n&gt;SWTICH_TO_ETO_OK_BUTTON}" press=".onConfirmSwitchToETO"/></beginButton><endButton><Button id="cancelButton" text="{vchI18n&gt;SWITCH_TO_ETO_CANCEL_BUTTON}"/></endButton><content><Text text="{vchI18n&gt;SWITCH_TO_ETO_DIALOG_CONTENT}"/></content></Dialog></core:FragmentDefinition>',
	"sap/i2d/lo/lib/zvchclfz/components/configuration/view/fragment/VariantMatching.fragment.xml": '<core:FragmentDefinition xmlns:core="sap.ui.core" xmlns="sap.m" xmlns:l="sap.ui.layout" xmlns:app="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1">xmlns:fb="sap.ui.comp.filterbar"&gt;<Dialog id="variantMatchingDialog" title="{vchI18n&gt;VARIANT_MATCHING_DIALOG_TITLE_DISPLAY}" resizable="true" draggable="true" contentWidth="40%" contentHeight="50%" verticalScrolling="false"><l:FixFlex minFlexSize="5"><l:fixContent><OverflowToolbar id="OverflowToolBar" class="sapUiSmallMarginBeginEnd"><Title id="TableHeader" level="H3" text="{vchI18n&gt;VARIANT_MATCHING_TABLE_TITLE}"/><ToolbarSpacer/><SearchField id="SearchString" search="onSearch" placeholder="{vchI18n&gt;VARIANT_SEARCH_TEXT}" width="15rem"/><Button id="ValueDiffBtn" text="{vchI18n&gt;LOAD_VAL_DIFF}" press="determineValueDiff" enabled="{variantsSettings&gt;/partMatchExist}"/></OverflowToolbar></l:fixContent><l:flexContent><Table id="MatchingVariantsTable" ariaLabelledBy="TableHeader" noDataText="{vchI18n&gt;NO_MATCHING_VARIANTS_FOUND}" width="auto" busyIndicatorDelay="0" class="sapUiSmallMarginBeginEnd" items="{path:\'variants&gt;/\',templateShareable:true,sorter:[{path:\'IsFullMatch\',descending:true,group:\'.fnGroupVariants\'},{path:\'CsticDiffCount\',descending:false}],parameters:{countMode:\'sap.ui.model.odata.CountMode.InlineRepeat\'}}" growing="true" growingScrollToLoad="true" growingThreshold="30" mode="{= ${configurationSettings&gt;/variantMatchingMode} === 3 ? \'SingleSelectMaster\' : \'None\'}" selectionChange="onSelectionChange"><ColumnListItem id="MatchingVariantsTableTemplate"><cells><ObjectIdentifier title="{variants&gt;ProductDescription}" text="{variants&gt;Product}"/><Link id="ValDiffCell" text="{path:\'variants&gt;CsticDiffCount\',formatter:\'.csticDiffCountFactory\'}" press="onLoadValDiff" visible="{= !${variants&gt;IsFullMatch} }"/></cells></ColumnListItem><columns><Column id="Product" hAlign="Left" width="60%"><Text text="{vchI18n&gt;VARIANT_MATCHING_PRODUCT} " textAlign="Left"/></Column><Column id="ValDiff" hAlign="Left" width="auto" minScreenWidth="Tablet" demandPopin="true"><Text text="{vchI18n&gt;VALUATION_DIFFERENCE}" textAlign="Left"/></Column></columns></Table></l:flexContent></l:FixFlex><beginButton><Button id="closeDialog" text="{vchI18n&gt;CLOSE_VARIANT_MATCHING_DIALOG}" press="onVariantMatchingDialogClose"/></beginButton></Dialog></core:FragmentDefinition>',
	"sap/i2d/lo/lib/zvchclfz/components/configuration/view/fragment/VariantValuationDifferencePopover.fragment.xml": '<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><ResponsivePopover id="valuationDifferencePopover" title="{vchI18n&gt;VARIANT_VALUATION_DIFFERENCE}" placement="Auto" contentWidth="50%" resizable="true"><content><Table id="VariantValuationTable" noDataText="{vchI18n&gt;VARIANT_MATCHING_TABLE_TITLE}" width="auto" class="sapUiTinyMarginTopBottom sapUiSmallMarginBeginEnd" items="{path:\'vchclf_bind_only&gt;VariantValuationDifference\',templateShareable:false,events:{dataRequested:\'.onVariantValuationRequested\',dataReceived:\'.onVariantValuationReceived\'},parameters:{countMode:\'sap.ui.model.odata.CountMode.None\',expand:\'VariantValuatDiffCsticRefValues,VariantValuatDiffCsticVarValues\'}}"><items><ColumnListItem><cells><ObjectIdentifier title="{vchclf_bind_only&gt;CsticDescr}" text="{vchclf_bind_only&gt;CsticName}"/><VBox items="{path:\'vchclf_bind_only&gt;VariantValuatDiffCsticRefValues\',templateShareable:false}" wrap="Wrap"><Text text="{parts:[\'vchclf_bind_only&gt;ValueName\',\'vchclf_bind_only&gt;ValueDescription\',\'configurationSettings&gt;/descriptionMode\',\'vchI18n&gt;HEADER_FIELD_VALUE\'],formatter:\'.getCharacteristicValueDescriptionWithName\'}" class="sapUiTinyMarginEnd sapUiTinyMarginTop sapUiTinyMarginBottom"/></VBox><VBox items="{path:\'vchclf_bind_only&gt;VariantValuatDiffCsticVarValues\',templateShareable:false}" wrap="Wrap"><Text text="{parts:[\'vchclf_bind_only&gt;ValueName\',\'vchclf_bind_only&gt;ValueDescription\',\'configurationSettings&gt;/descriptionMode\',\'vchI18n&gt;HEADER_FIELD_VALUE\'],formatter:\'.getCharacteristicValueDescriptionWithName\'}" class="sapUiTinyMarginEnd sapUiTinyMarginTop sapUiTinyMarginBottom"/></VBox></cells></ColumnListItem></items><columns><Column id="Cstic" hAlign="Left" width="auto"><Text text="{vchI18n&gt;VARIANT_VALUATION_CSTIC} " textAlign="Left"/></Column><Column id="RefValues" hAlign="Left"><Text text="{vchI18n&gt;REF_VALUATION_VALUES}" textAlign="Left"/></Column><Column id="VarValues" hAlign="Left"><Text text="{vchI18n&gt;VARIANT_VALUATION_VALUES}" textAlign="Left"/></Column></columns></Table></content></ResponsivePopover></core:FragmentDefinition>',
	"sap/i2d/lo/lib/zvchclfz/components/inspector/fragment/ComparisonCsticActionSheet.fragment.xml": '<core:FragmentDefinition xmlns="sap.m" xmlns:f="sap.f" xmlns:core="sap.ui.core" xmlns:l="sap.ui.layout" xmlns:mvc="sap.ui.core.mvc"><ActionSheet placement="VerticalPreferredBottom" title="{i18n&gt;vchclf_comparison_action_sheet_title}"><buttons><Button text="{i18n&gt;vchclf_comparison_inspect}" visible="{= ${comparisonActionSheet&gt;/diffItemType} !== 1}" press="onActionSheetInspectPressed"/><Button text="{i18n&gt;vchclf_comparison_show_in_config}" press="onActionSheetShowInConfigPressed"/></buttons></ActionSheet></core:FragmentDefinition>',
	"sap/i2d/lo/lib/zvchclfz/components/inspector/fragment/ComparisonSettingsPopover.fragment.xml": '<core:FragmentDefinition xmlns="sap.m" xmlns:f="sap.f" xmlns:core="sap.ui.core" xmlns:l="sap.ui.layout" xmlns:mvc="sap.ui.core.mvc"><Popover showHeader="false" placement="VerticalPreferredBottom" class="sapUiContentPadding"><content><l:HorizontalLayout class="vchclf_hlayout_valign_middle"><Switch class="sapUiTinyMarginEnd" state="{global&gt;/isDiffRestrictionActive}" change="onChangeComparisonRestrictionActive"/><Text text="{i18n&gt;vchclf_comparison_filter_on_sel}"/></l:HorizontalLayout></content></Popover></core:FragmentDefinition>',
	"sap/i2d/lo/lib/zvchclfz/components/inspector/fragment/CsticsValueHelpDialog.fragment.xml": '<vh:ValueHelpDialog xmlns="sap.m" xmlns:vh="sap.ui.comp.valuehelpdialog" xmlns:fb="sap.ui.comp.filterbar" xmlns:core="sap.ui.core" title="{i18n&gt;vchclf_trace_cstics_value_help_title}" descriptionKey="CsticName" key="CsticId" tokenDisplayBehaviour="descriptionOnly" ok="onOkPressed" cancel="onCancelPressed"><vh:filterBar><fb:FilterBar search="onSearchPressed" advancedMode="true"><fb:filterGroupItems><fb:FilterGroupItem name="characteristicFilter" label="{i18n&gt;vchclf_trace_cstics_value_help_filter_cstics}" groupName="csticsValueHelpFilterGroup"><fb:control><Input id="idCharacteristicFilter" submit="onSearchPressed" name="csticsValueHelpFilterChar" value="{columns&gt;/filters/name}"/></fb:control></fb:FilterGroupItem><fb:FilterGroupItem name="characteristicDescFilter" label="{i18n&gt;vchclf_trace_cstics_value_help_filter_csticsdesc}" groupName="csticsValueHelpFilterGroup"><fb:control><Input id="idCharacteristicDescFilter" submit="onSearchPressed" name="csticsValueHelpFilterDesc" value="{columns&gt;/filters/description}"/></fb:control></fb:FilterGroupItem><fb:FilterGroupItem name="isContainedInConfignModel" label="{i18n&gt;vchclf_trace_generic_value_help_in_conf_model_label}" groupName="csticsValueHelpFilterGroup"><fb:control><CheckBox id="idIsContainedInConfignModel" selected="{columns&gt;/filters/isContainedInConfignModel}" select="onSearchPressed"/></fb:control></fb:FilterGroupItem></fb:filterGroupItems></fb:FilterBar></vh:filterBar></vh:ValueHelpDialog>',
	"sap/i2d/lo/lib/zvchclfz/components/inspector/fragment/DependencyListItem.fragment.xml": '<ObjectListItem xmlns="sap.m" title="{parts:[{path:\'ObjectDependency\'},{path:\'Name\'},{path:\'Description\'}],formatter:\'._dependencyFormatter.dependencyTitleFormatter\'}" type="Navigation" press=".onDependencyItemPress"><attributes><ObjectAttribute text="{parts:[{path:\'ObjectDependency\'},{path:\'Name\'},{path:\'Description\'}],formatter:\'._dependencyFormatter.dependencySubtitleFormatter\'}"/></attributes></ObjectListItem>',
	"sap/i2d/lo/lib/zvchclfz/components/inspector/fragment/DependencyTraceFilter.fragment.xml": '<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:form="sap.ui.layout.form" xmlns:smartfield="sap.ui.comp.smartfield"><form:SimpleForm editable="true" layout="ResponsiveGridLayout" labelSpanS="12" labelSpanM="12" labelSpanL="12" labelSpanXL="12"><form:content><Label text="{i18n&gt;vchclf_trace_filter_dialog_trace_level}" tooltip="{i18n&gt;vchclf_trace_filter_dialog_trace_level}" labelFor="idTraceLevel"/><Select id="idTraceLevel" items="{ui&gt;/traceLevelAttributes/items}" selectedKey="{ui&gt;/filters/TraceLevel}" change="onTraceLevelSelectionChanged"><items><core:Item key="{ui&gt;key}" text="{ui&gt;text}"/></items></Select><Label text="{i18n&gt;vchclf_trace_filter_dialog_message_types}" tooltip="{i18n&gt;vchclf_trace_filter_dialog_message_types}" labelFor="idMessageTypes"/><MultiComboBox id="idMessageTypes" items="{ui&gt;/messageTypeAttributes/items}" selectedKeys="{ui&gt;/filters/MessageType}" selectionChange="onMessageTypesSelectionChanged"><core:Item key="{ui&gt;key}" text="{ui&gt;text}"/></MultiComboBox><Label text="{i18n&gt;vchclf_trace_filter_dialog_value_assignment_by}" tooltip="{i18n&gt;vchclf_trace_filter_dialog_value_assignment_by}" labelFor="idValueAssignmentBy"/><MultiComboBox id="idValueAssignmentBy" items="{ui&gt;/valueAssignmentByAttributes/items}" selectedKeys="{ui&gt;/filters/ValueAssignmentBy}" enabled="{ui&gt;/valueAssignmentByAttributes/enabled}"><core:Item key="{ui&gt;key}" text="{ui&gt;text}"/></MultiComboBox><Label text="{i18n&gt;vchclf_trace_filter_dialog_characterisitc}" tooltip="{i18n&gt;vchclf_trace_filter_dialog_characterisitc}" labelFor="idCharacteristic"/><MultiInput id="idCharacteristic" tokens="{ui&gt;/filters/Characteristic}" tokenUpdate="onCsticsTokenUpdate" showSuggestion="true" filterSuggests="false" suggest="onCsticsSuggest" valueHelpRequest="onCsticsValueHelpRequest" change="onCsticsValueChange" submit="onCsticsValueSubmit" value="{ui&gt;/characteristicAttributes/value}" valueState="{ui&gt;/characteristicAttributes/valueState}" valueStateText="{ui&gt;/characteristicAttributes/valueStateText}" suggestionRows="{ui&gt;/characteristicAttributes/suggestedRows}" autocomplete="false" busyIndicatorDelay="0"><suggestionColumns><Column hAlign="Begin" popinDisplay="Inline" demandPopin="true"><Label text="{i18n&gt;vchclf_trace_cstics_value_help_result_col_cstics}" tooltip="{i18n&gt;vchclf_trace_cstics_value_help_result_col_cstics}"/></Column><Column hAlign="Center" popinDisplay="Inline" demandPopin="true"><Label text="{i18n&gt;vchclf_trace_cstics_value_help_result_col_csticsdesc}" tooltip="{i18n&gt;vchclf_trace_cstics_value_help_result_col_csticsdesc}"/></Column></suggestionColumns><suggestionRows><ColumnListItem><cells><Label text="{ui&gt;CsticName}" tooltip="{ui&gt;CsticName}"/><Label text="{ui&gt;Description}" tooltip="{ui&gt;Description}"/></cells></ColumnListItem></suggestionRows><tokens><Token key="{ui&gt;key}" text="{ui&gt;text}" tooltip="{ui&gt;text}"/></tokens></MultiInput><Label text="{i18n&gt;vchclf_trace_filter_dialog_objdep}" tooltip="{i18n&gt;vchclf_trace_filter_dialog_objdep}" labelFor="idDependency"/><MultiInput id="idDependency" tokens="{ui&gt;/filters/ObjectDependency}" tokenUpdate="onDependencyTokenUpdate" showSuggestion="true" filterSuggests="false" suggest="onDepsSuggest" valueHelpRequest="onDependencyValueHelpRequest" change="onDepsValueChange" submit="onDepsValueSubmit" value="{ui&gt;/dependencyAttributes/value}" valueState="{ui&gt;/dependencyAttributes/valueState}" valueStateText="{ui&gt;/dependencyAttributes/valueStateText}" suggestionRows="{ui&gt;/dependencyAttributes/suggestedRows}" autocomplete="false" busyIndicatorDelay="0"><suggestionColumns><Column hAlign="Begin" popinDisplay="Inline" demandPopin="true"><Label text="{i18n&gt;vchclf_trace_objdep_value_help_result_col_objdep}" tooltip="{i18n&gt;vchclf_trace_objdep_value_help_result_col_objdep}"/></Column><Column hAlign="Center" popinDisplay="Inline" demandPopin="true"><Label text="{i18n&gt;vchclf_trace_objdep_value_help_result_col_objdepdesc}" tooltip="{i18n&gt;vchclf_trace_objdep_value_help_result_col_objdepdesc}"/></Column></suggestionColumns><suggestionRows><ColumnListItem><cells><Label text="{ui&gt;ObjectDependencyName}" tooltip="{ui&gt;ObjectDependencyName}"/><Label text="{ui&gt;Description}" tooltip="{ui&gt;Description}"/></cells></ColumnListItem></suggestionRows><tokens><Token key="{ui&gt;key}" text="{ui&gt;text}" tooltip="{ui&gt;text}"/></tokens></MultiInput></form:content></form:SimpleForm></core:FragmentDefinition>',
	"sap/i2d/lo/lib/zvchclfz/components/inspector/fragment/DependencyValueHelpDialog.fragment.xml": '<vh:ValueHelpDialog xmlns="sap.m" xmlns:vh="sap.ui.comp.valuehelpdialog" xmlns:fb="sap.ui.comp.filterbar" xmlns:core="sap.ui.core" title="{i18n&gt;vchclf_trace_objdep_value_help_title}" descriptionKey="ObjectDependencyName" key="ObjectDependency" tokenDisplayBehaviour="descriptionOnly" ok="onOkPressed" cancel="onCancelPressed"><vh:filterBar><fb:FilterBar search="onSearchPressed" advancedMode="true"><fb:filterGroupItems><fb:FilterGroupItem name="objectdependencyFilter" label="{i18n&gt;vchclf_trace_objdep_value_help_filter_objdep}" groupName="objectdependencyValueHelpFilterGroup"><fb:control><Input id="idDependencyNameFilter" submit="onSearchPressed" name="objectdependencyValueHelpFilterChar" value="{columns&gt;/filters/name}"/></fb:control></fb:FilterGroupItem><fb:FilterGroupItem name="objectdependencyDescFilter" label="{i18n&gt;vchclf_trace_objdep_value_help_filter_objdepdesc}" groupName="objectdependencyValueHelpFilterGroup"><fb:control><Input id="idDependencyDescFilter" submit="onSearchPressed" name="objectdependencyValueHelpFilterDesc" value="{columns&gt;/filters/description}"/></fb:control></fb:FilterGroupItem><fb:FilterGroupItem name="isContainedInConfignModel" label="{i18n&gt;vchclf_trace_generic_value_help_in_conf_model_label}" groupName="objectdependencyValueHelpFilterGroup"><fb:control><CheckBox id="idIsContainedInConfignModel" selected="{columns&gt;/filters/isContainedInConfignModel}" select="onSearchPressed"/></fb:control></fb:FilterGroupItem></fb:filterGroupItems></fb:FilterBar></vh:filterBar></vh:ValueHelpDialog>',
	"sap/i2d/lo/lib/zvchclfz/components/inspector/fragment/Header.fragment.xml": '<core:FragmentDefinition xmlns="sap.m" xmlns:f="sap.f" xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc"><f:DynamicPageHeader pinnable="false" backgroundDesign="Solid" class="vchclfinspectorHeaderNoBoxShadow vchclfinspectorHeaderTitleWithPadding"><f:content><VBox><Title text="{__viewData&gt;/title}" level="H3" titleStyle="H3" tooltip="{__viewData&gt;/title}"/><Text text="{__viewData&gt;/subTitle}"/></VBox></f:content></f:DynamicPageHeader></core:FragmentDefinition>',
	"sap/i2d/lo/lib/zvchclfz/components/inspector/fragment/ShowMasterData.fragment.xml": '<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><Toolbar style="Clear" visible="{global&gt;/isSuperInspectorAvailable}"><ToolbarSpacer/><ToggleButton type="Transparent" enabled="{__viewData&gt;/isSuperInspectorEnabled}" text="{i18n&gt;vchclf_insp_show_super}" tooltip="{i18n&gt;vchclf_insp_show_super}" pressed="{__viewData&gt;/isSuperInspectorShown}"/></Toolbar></core:FragmentDefinition>',
	"sap/i2d/lo/lib/zvchclfz/components/inspector/fragment/TraceEntryDetails.fragment.xml": '<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:ictr="sap.i2d.lo.lib.zvchclfz.components.inspector.control"><ScrollContainer height="100%" width="100%" horizontal="false" vertical="false" focusable="true" class="sapUiTinyMarginBegin"><HBox class="sapUiTinyMarginBottom" visible="{= ${trace&gt;to_TraceBAdI} !== null &amp;&amp; ${trace&gt;to_TraceBAdI/ErrorMessage} !== \'\'}"><core:Icon color="Default" src="sap-icon://message-error" class="sapUiTinyMarginEnd" tooltip="{i18n&gt;vchclf_trace_detail_error_message}" decorative="false"/><Text text="{trace&gt;to_TraceBAdI/ErrorMessage}"/></HBox><HBox class="sapUiTinyMarginBottom" visible="{= ${trace&gt;to_TraceBAdI} !== null &amp;&amp; ${trace&gt;to_TraceBAdI/Solution} !== \'\'}"><core:Icon color="Default" src="sap-icon://message-information" class="sapUiTinyMarginEnd" tooltip="{i18n&gt;vchclf_trace_detail_solution}" decorative="false"/><Text text="{trace&gt;to_TraceBAdI/Solution}"/></HBox><HBox class="sapUiTinyMarginBottom" visible="{= ${trace&gt;to_TraceBAdI} !== null &amp;&amp; ${trace&gt;to_TraceBAdI/BAdIName} !== \'\' }"><core:Icon color="Default" src="sap-icon://project-definition-triangle" class="sapUiTinyMarginEnd" tooltip="{i18n&gt;vchclf_trace_detail_badi_definition}" decorative="false"/><Text text="{trace&gt;to_TraceBAdI/BAdIName}"/></HBox><HBox class="sapUiTinyMarginBottom" visible="{= ${trace&gt;to_TraceBAdI} !== null &amp;&amp; ${trace&gt;to_TraceBAdI/BAdIImplementation} !== \'\' }"><core:Icon color="Default" src="sap-icon://project-definition-triangle-2" class="sapUiTinyMarginEnd" tooltip="{i18n&gt;vchclf_trace_detail_badi_implementation}" decorative="false"/><Text text="{trace&gt;to_TraceBAdI/BAdIImplementation}"/></HBox><HBox visible="{= ${trace&gt;to_InputTraceObjectDependencies}.length &gt; 0}"><core:Icon color="Default" src="sap-icon://share-2" class="sapUiTinyMarginEnd" tooltip="{i18n&gt;vchclf_trace_detail_dependency}" decorative="false"/><VBox items="{trace&gt;to_InputTraceObjectDependencies}" width="100%"><ictr:TraceEntryText metaText="{path:\'\',formatter:\'._formatter.formatMetatextOfObjectDependencyDetail\'}" styleClass="sapUiTinyMarginBottom" filter="onFilterTraceEntryItem" inspect="onInspectTraceEntryItem"/></VBox></HBox><HBox class="sapUiTinyMarginBottom" visible="{= ${trace&gt;to_VariantTables}.length &gt; 0}"><core:Icon color="Default" src="sap-icon://table-view" class="sapUiTinyMarginEnd" tooltip="{i18n&gt;vchclf_trace_detail_variant_tables}" decorative="false"/><Text text="{path:\'trace&gt;to_VariantTables\',formatter:\'._formatter.formatVariantTables\'}"/></HBox><HBox visible="{= ${trace&gt;to_TraceBeforeCharacteristics}.length &gt; 0}"><core:Icon color="Default" src="sap-icon://BusinessSuiteInAppSymbols/icon-effects" class="sapUiTinyMarginEnd" tooltip="{i18n&gt;vchclf_trace_detail_before_characteristics}" decorative="false"/><VBox items="{trace&gt;to_TraceBeforeCharacteristics}" width="100%"><ictr:TraceEntryText metaText="{parts:[{path:\'trace&gt;to_TraceCharacteristicValues\'},{path:\'global&gt;/showPreciseNumbers\'}],formatter:\'._formatter.formatMetatextOfCharacteristicDetail\'}" styleClass="sapUiTinyMarginBottom" showPreciseNumbers="{global&gt;/showPreciseNumbers}" filter="onFilterTraceEntryItem" inspect="onInspectTraceEntryItem" whereWasValueSet="onWhereWasValueSet" whereWasCsticUsed="onWhereWasCsticUsed"/></VBox></HBox><HBox visible="{= ${trace&gt;to_BeforeCharacteristicResults}.length &gt; 0}"><core:Icon color="Default" src="sap-icon://BusinessSuiteInAppSymbols/icon-effects" class="sapUiTinyMarginEnd" tooltip="{i18n&gt;vchclf_trace_detail_before_cstic_results}" decorative="false"/><VBox items="{trace&gt;to_BeforeCharacteristicResults}" width="100%"><ictr:TraceEntryText metaText="{path:\'trace&gt;\',formatter:\'._formatter.formatMetatextOfCharacteristicResultsDetail\'}" styleClass="sapUiTinyMarginBottom" filter="onFilterTraceEntryItem" inspect="onInspectTraceEntryItem" whereWasValueSet="onWhereWasValueSet" whereWasCsticUsed="onWhereWasCsticUsed"/></VBox></HBox><HBox visible="{= ${trace&gt;to_BeforeDependencyResults}.length &gt; 0}"><core:Icon color="Default" src="sap-icon://BusinessSuiteInAppSymbols/icon-effects" class="sapUiTinyMarginEnd" tooltip="{i18n&gt;vchclf_trace_detail_before_dependency_results}" decorative="false"/><VBox items="{trace&gt;to_BeforeDependencyResults}" width="100%"><ictr:TraceEntryText metaText="{path:\'trace&gt;\',formatter:\'._formatter.formatMetatextOfDependencyResultDetail\'}" styleClass="sapUiTinyMarginBottom" filter="onFilterTraceEntryItem" inspect="onInspectTraceEntryItem" whereWasDepSet="onWhereWasDepSet" whereWasDepUsed="onWhereWasDepUsed"/></VBox></HBox><HBox visible="{= ${trace&gt;to_TraceResultCharacteristics}.length &gt; 0}"><core:Icon color="Default" src="sap-icon://BusinessSuiteInAppSymbols/icon-causes" class="sapUiTinyMarginEnd" tooltip="{i18n&gt;vchclf_trace_detail_result_characteristics}" decorative="false"/><VBox items="{trace&gt;to_TraceResultCharacteristics}" width="100%"><ictr:TraceEntryText metaText="{parts:[{path:\'trace&gt;to_TraceCharacteristicValues\'},{path:\'global&gt;/showPreciseNumbers\'}],formatter:\'._formatter.formatMetatextOfCharacteristicDetail\'}" styleClass="sapUiTinyMarginBottom" showPreciseNumbers="{global&gt;/showPreciseNumbers}" filter="onFilterTraceEntryItem" inspect="onInspectTraceEntryItem" whereWasValueSet="onWhereWasValueSet" whereWasCsticUsed="onWhereWasCsticUsed"/></VBox></HBox><HBox visible="{= ${trace&gt;to_ResultCharacteristicResults}.length &gt; 0}"><core:Icon color="Default" src="sap-icon://BusinessSuiteInAppSymbols/icon-causes" class="sapUiTinyMarginEnd" tooltip="{i18n&gt;vchclf_trace_detail_result_cstic_results}" decorative="false"/><VBox items="{trace&gt;to_ResultCharacteristicResults}" width="100%"><ictr:TraceEntryText metaText="{path:\'trace&gt;\',formatter:\'._formatter.formatMetatextOfCharacteristicResultsDetail\'}" styleClass="sapUiTinyMarginBottom" filter="onFilterTraceEntryItem" inspect="onInspectTraceEntryItem" whereWasValueSet="onWhereWasValueSet" whereWasCsticUsed="onWhereWasCsticUsed"/></VBox></HBox><HBox visible="{= ${trace&gt;to_ResultDependencyResults}.length &gt; 0}"><core:Icon color="Default" src="sap-icon://BusinessSuiteInAppSymbols/icon-causes" class="sapUiTinyMarginEnd" tooltip="{i18n&gt;vchclf_trace_detail_result_dependency_results}" decorative="false"/><VBox items="{trace&gt;to_ResultDependencyResults}" width="100%"><ictr:TraceEntryText metaText="{path:\'trace&gt;\',formatter:\'._formatter.formatMetatextOfDependencyResultDetail\'}" styleClass="sapUiTinyMarginBottom" filter="onFilterTraceEntryItem" inspect="onInspectTraceEntryItem" whereWasDepSet="onWhereWasDepSet" whereWasDepUsed="onWhereWasDepUsed"/></VBox></HBox><HBox class="sapUiTinyMarginBottom" visible="{=     ${trace&gt;to_TracePricingFactor} !== null &amp;&amp;     ${trace&gt;to_TracePricingFactor/VariantConditionValue} !== \'\' &amp;&amp;     ${trace&gt;to_TracePricingFactor/ViewRelevance} !== \'2\' }"><core:Icon color="Default" src="sap-icon://payment-approval" class="sapUiTinyMarginEnd" tooltip="{i18n&gt;vchclf_trace_detail_pricing_factor_result}" decorative="false"/><Text text="{parts:[{path:\'trace&gt;\'},{path:\'global&gt;/showPreciseNumbers\'}],formatter:\'._formatter.formatPricingFactorDetails\'}"/></HBox><TextArea visible="{trace&gt;_isDependencySourceCodeVisible}" value="{path:\'trace&gt;to_ObjectDependencyCodes\',formatter:\'._dependencyFormatter.formatDependencySourceCode\'}" tooltip="{i18n&gt;vchclf_trace_detail_dependency_source_code}" width="100%" wrapping="Soft" growing="true" growingMaxLines="13" editable="false"/><Link visible="{trace&gt;_isToggleDepSourceCodeLinkVisible}" busyIndicatorDelay="0" text="{= ${trace&gt;to_ObjectDependencyCodes}.length &gt; 3 ?       ${i18n&gt;vchclf_trace_detail_show_less_lines} :       ${i18n&gt;vchclf_trace_detail_show_more_lines} }" press="toggleDependencySourceCodeFromCache" class="sapUiTinyMarginTop"/></ScrollContainer></core:FragmentDefinition>',
	"sap/i2d/lo/lib/zvchclfz/components/inspector/fragment/TraceEntryTextActionSheet.fragment.xml": '<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><ResponsivePopover modal="false" placement="VerticalPreferredBottom" title="{traceEntryTextParameter&gt;/headerText}"><content class="sapUiNoMargin"><ActionSheet title="{i18n&gt;vchclf_trace_actionsheet_title}" showCancelButton="false" placement="Bottom"><buttons><Button text="{traceEntryTextParameter&gt;/filterText}" tooltip="{traceEntryTextParameter&gt;/filterText}" visible="{= !!${traceEntryTextParameter&gt;/filterText}}" press="onFilter" class="sapMFlexBox"/><Button text="{traceEntryTextParameter&gt;/whereWasValueSetText}" tooltip="{traceEntryTextParameter&gt;/whereWasValueSetText}" visible="{= !!${traceEntryTextParameter&gt;/whereWasValueSetText}}" press="onWhereWasValueSet" class="sapMFlexBox"/><Button text="{traceEntryTextParameter&gt;/whereWasCsticUsedText}" tooltip="{traceEntryTextParameter&gt;/whereWasCsticUsedText}" visible="{= !!${traceEntryTextParameter&gt;/whereWasCsticUsedText}}" press="onWhereWasCsticUsed" class="sapMFlexBox"/><Button text="{traceEntryTextParameter&gt;/whereWasDepSetText}" tooltip="{traceEntryTextParameter&gt;/whereWasDepSetText}" visible="{= !!${traceEntryTextParameter&gt;/whereWasDepSetText}}" press="onWhereWasDepSet" class="sapMFlexBox"/><Button text="{traceEntryTextParameter&gt;/whereWasDepUsedText}" tooltip="{traceEntryTextParameter&gt;/whereWasDepUsedText}" visible="{= !!${traceEntryTextParameter&gt;/whereWasDepUsedText}}" press="onWhereWasDepUsed" class="sapMFlexBox"/><Button text="{traceEntryTextParameter&gt;/inspectText}" tooltip="{traceEntryTextParameter&gt;/inspectText}" visible="{= !!${traceEntryTextParameter&gt;/inspectText}}" press="onInspect" class="sapMFlexBox"/></buttons></ActionSheet></content></ResponsivePopover></core:FragmentDefinition>',
	"sap/i2d/lo/lib/zvchclfz/components/inspector/manifest.json": '{"_version":"1.5.0","sap.app":{"id":"sap.i2d.lo.lib.zvchclfz.components.inspector","type":"component","i18n":"i18n/i18n.properties","title":"{{title}}","embeddedBy":"../../","description":"{{description}}","resources":"resources.json","ach":"LO-VCH-FIO-SIM","dataSources":{}},"sap.ui":{"_version":"1.1.0","technology":"UI5","icons":{"icon":"sap-icon://task"},"deviceTypes":{"desktop":true,"tablet":true,"phone":true},"supportedThemes":["sap_hcb","sap_bluecrystal"]},"sap.ui5":{"_version":"1.1.0","rootView":"sap.i2d.lo.lib.zvchclfz.components.inspector.view.InspectorFrame","handleValidation":true,"dependencies":{"libs":{"sap.ui.core":{},"sap.m":{},"sap.ui.layout":{}}},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"sap.i2d.lo.lib.zvchclfz.components.inspector.i18n.i18n"}}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{},"routes":[],"targets":{}},"contentDensities":{"compact":true,"cozy":true}}}',
	"sap/i2d/lo/lib/zvchclfz/components/inspector/view/BOMItemProperties.view.xml": '<mvc:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns:f="sap.ui.layout.form" xmlns="sap.m" controllerName="sap.i2d.lo.lib.zvchclfz.components.inspector.controller.BOMItemProperties"><f:SimpleForm maxContainerCols="1" minWidth="300" editable="false" layout="ResponsiveGridLayout" labelSpanXL="4" labelSpanL="4" labelSpanM="5" labelSpanS="12" breakpointL="800" breakpointM="400" columnsL="2" columnsM="1"><f:toolbar><core:Fragment fragmentName="sap.i2d.lo.lib.zvchclfz.components.inspector.fragment.ShowMasterData" type="XML"/></f:toolbar><f:content><core:Title text="{path:\'properties&gt;/to_BOMHeader/ComponentId\',formatter:\'._generalFormatter.getSubtitleOfBOMItem\'}"/><Label labelFor="idBOMCategory" visible="{path:\'properties&gt;/to_BOMHeader/ComponentId\',formatter:\'._generalFormatter.isBOMHeaderVisible\'}" text="{i18n&gt;vchclf_insp_bomitem_bom_category}"/><Text id="idBOMCategory" visible="{path:\'properties&gt;/to_BOMHeader/ComponentId\',formatter:\'._generalFormatter.isBOMHeaderVisible\'}" text="{parts:[{path:\'properties&gt;/to_BOMHeader/BOMCategory\'},{path:\'properties&gt;/to_BOMHeader/BOMCategoryDescription\'}],formatter:\'._generalFormatter.concatenateIdAndDescription\'}"/><Label labelFor="idBOMUsage" visible="{path:\'properties&gt;/to_BOMHeader/ComponentId\',formatter:\'._generalFormatter.isBOMHeaderVisible\'}" text="{i18n&gt;vchclf_insp_bomitem_bom_usage}"/><Text id="idBOMUsage" visible="{path:\'properties&gt;/to_BOMHeader/ComponentId\',formatter:\'._generalFormatter.isBOMHeaderVisible\'}" text="{parts:[{path:\'properties&gt;/to_BOMHeader/BOMVariantUsage\'},{path:\'properties&gt;/to_BOMHeader/BOMVariantUsageDescription\'}],formatter:\'._generalFormatter.concatenateIdAndDescription\'}"/><Label labelFor="idAlternativeBOM" visible="{path:\'properties&gt;/to_BOMHeader/ComponentId\',formatter:\'._generalFormatter.isBOMHeaderVisible\'}" text="{i18n&gt;vchclf_insp_bomitem_alternative_bom}"/><Text id="idAlternativeBOM" visible="{path:\'properties&gt;/to_BOMHeader/ComponentId\',formatter:\'._generalFormatter.isBOMHeaderVisible\'}" text="{properties&gt;/to_BOMHeader/BOMVariant}"/><Label labelFor="idBOMStatus" visible="{path:\'properties&gt;/to_BOMHeader/ComponentId\',formatter:\'._generalFormatter.isBOMHeaderVisible\'}" text="{i18n&gt;vchclf_insp_bomitem_bom_status}"/><Text id="idBOMStatus" visible="{path:\'properties&gt;/to_BOMHeader/ComponentId\',formatter:\'._generalFormatter.isBOMHeaderVisible\'}" text="{parts:[{path:\'properties&gt;/to_BOMHeader/BOMStatus\'},{path:\'properties&gt;/to_BOMHeader/BOMStatusDescription\'}],formatter:\'._generalFormatter.concatenateIdAndDescription\'}"/><Label labelFor="idBOMItemComponent" text="{i18n&gt;vchclf_insp_bomitem_component}" visible="{= ${properties&gt;/BOMComponentName} !== \'\'}"/><FormattedText id="idBOMItemComponent" visible="{= ${properties&gt;/BOMComponentName} !== \'\'}" htmlText="{parts:[{path:\'properties&gt;/BOMComponentName\'},{path:\'properties&gt;/to_Super/BOMComponentName\'},{path:\'properties&gt;/to_Super/IsExcludedItem\'},{path:\'__viewData&gt;/isSuperInspectorShown\'}],formatter:\'._superInspectorFormatter.formatValue\'}"/><Label labelFor="idBOMItemDescription" text="{i18n&gt;vchclf_insp_bomitem_description}"/><FormattedText id="idBOMItemDescription" htmlText="{parts:[{path:\'properties&gt;/ProductName\'},{path:\'properties&gt;/to_Super/ProductName\'},{path:\'properties&gt;/to_Super/IsExcludedItem\'},{path:\'__viewData&gt;/isSuperInspectorShown\'}],formatter:\'._superInspectorFormatter.formatValue\'}"/><Label labelFor="idBOMItemPlant" text="{i18n&gt;vchclf_insp_bomitem_plant}"/><FormattedText id="idBOMItemPlant" htmlText="{parts:[{path:\'properties&gt;/Plant\'},{path:\'properties&gt;/to_Super/Plant\'},{path:\'properties&gt;/to_Super/IsExcludedItem\'},{path:\'__viewData&gt;/isSuperInspectorShown\'}],formatter:\'._superInspectorFormatter.formatValue\'}"/><Label id="idBOMItemConfigurationProfileLabel" labelFor="idBOMItemConfigurationProfile" text="{i18n&gt;vchclf_insp_bomitem_configprofile}" visible="{parts:[{path:\'properties&gt;/IsConfigurableItem\'},{path:\'properties&gt;/to_Super/IsConfigurableItem\'}],formatter:\'._superInspectorFormatter.getValueForFlagProperty\'}"/><Link id="idBOMItemConfigurationProfile" text="{parts:[{path:\'properties&gt;/ConfigurationProfileName\'},{path:\'properties&gt;/to_Super/ConfigurationProfileName\'}],formatter:\'._superInspectorFormatter.formatValueWithoutMix\'}" enabled="{parts:[{path:\'properties&gt;/ConfigurationProfileName\'},{path:\'properties&gt;/to_Super/ConfigurationProfileName\'}],formatter:\'._superInspectorFormatter.isNotMixedValueNotEmpty\'}" press="onConfigurationProfilePressed" visible="{parts:[{path:\'properties&gt;/IsConfigurableItem\'},{path:\'properties&gt;/to_Super/IsConfigurableItem\'}],formatter:\'._superInspectorFormatter.getValueForFlagProperty\'}"/><Label labelFor="idBOMItemQuantity" text="{i18n&gt;vchclf_insp_bomitem_quantity}"/><FormattedText id="idBOMItemQuantity" htmlText="{parts:[{path:\'properties&gt;/Quantity\'},{path:\'properties&gt;/Unit\'},{path:\'properties&gt;/to_Super/Quantity\'},{path:\'properties&gt;/to_Super/Unit\'},{path:\'properties&gt;/to_Super/IsExcludedItem\'},{path:\'__viewData&gt;/isSuperInspectorShown\'}],formatter:\'._superInspectorFormatter.formatQtyWithUom\'}"/><Label labelFor="idBOMItemNumber" text="{i18n&gt;vchclf_insp_bomitem_itemnumber}" visible="{= !${__viewData&gt;/isRoot}}"/><FormattedText id="idBOMItemNumber" htmlText="{parts:[{path:\'properties&gt;/ItemNumber\'},{path:\'properties&gt;/to_Super/ItemNumber\'},{path:\'properties&gt;/to_Super/IsExcludedItem\'},{path:\'__viewData&gt;/isSuperInspectorShown\'}],formatter:\'._superInspectorFormatter.formatValue\'}" visible="{= !${__viewData&gt;/isRoot}}"/><Label labelFor="idBOMItemCategory" text="{i18n&gt;vchclf_insp_bomitem_item_category}" visible="{= !${__viewData&gt;/isRoot}}"/><FormattedText id="idBOMItemCategory" htmlText="{parts:[{path:\'properties&gt;/ItemCategoryDescription\'},{path:\'properties&gt;/to_Super/ItemCategoryDescription\'},{path:\'properties&gt;/to_Super/IsExcludedItem\'},{path:\'__viewData&gt;/isSuperInspectorShown\'}],formatter:\'._superInspectorFormatter.formatValue\'}" visible="{= !${__viewData&gt;/isRoot}}"/><Label labelFor="idBOMClassName" text="{i18n&gt;vchclf_insp_bomitem_class}" visible="{parts:[{path:\'properties&gt;/ClassType\'},{path:\'properties&gt;/Class\'},{path:\'properties&gt;/to_Super/ClassType\'},{path:\'properties&gt;/to_Super/Class\'},{path:\'properties&gt;/to_Super/IsExcludedItem\'},{path:\'__viewData&gt;/isSuperInspectorShown\'}],formatter:\'._superInspectorFormatter.isConcatenatedValueNotEmpty\'}"/><FormattedText id="idBOMClassName" visible="{parts:[{path:\'properties&gt;/ClassType\'},{path:\'properties&gt;/Class\'},{path:\'properties&gt;/to_Super/ClassType\'},{path:\'properties&gt;/to_Super/Class\'},{path:\'properties&gt;/to_Super/IsExcludedItem\'},{path:\'__viewData&gt;/isSuperInspectorShown\'}],formatter:\'._superInspectorFormatter.isConcatenatedValueNotEmpty\'}" htmlText="{parts:[{path:\'properties&gt;/ClassType\'},{path:\'properties&gt;/Class\'},{path:\'properties&gt;/to_Super/ClassType\'},{path:\'properties&gt;/to_Super/Class\'},{path:\'properties&gt;/to_Super/IsExcludedItem\'},{path:\'__viewData&gt;/isSuperInspectorShown\'}],formatter:\'._superInspectorFormatter.concatenateIdAndDescription\'}"/><Label labelFor="idBOMItemRelevance" text="{i18n&gt;vchclf_insp_bomitem_relevance}" visible="{= !${__viewData&gt;/isRoot}}"/><FormattedText id="idBOMItemRelevance" htmlText="{parts:[{path:\'properties&gt;/Relevance\'},{path:\'properties&gt;/to_Super/Relevance\'},{path:\'properties&gt;/to_Super/IsExcludedItem\'},{path:\'__viewData&gt;/isSuperInspectorShown\'}],formatter:\'._superInspectorFormatter.formatValue\'}" visible="{= !${__viewData&gt;/isRoot}}"/><Label labelFor="idBOMItemChangedBy" text="{i18n&gt;vchclf_insp_dependecydtl_changedby}"/><FormattedText id="idBOMItemChangedBy" htmlText="{parts:[{path:\'properties&gt;/LastChangedByUser\'},{path:\'properties&gt;/LastChangedByUserDescription\'},{path:\'properties&gt;/to_Super/LastChangedByUser\'},{path:\'properties&gt;/to_Super/LastChangedByUserDescription\'},{path:\'properties&gt;/to_Super/IsExcludedItem\'},{path:\'__viewData&gt;/isSuperInspectorShown\'}],formatter:\'._superInspectorFormatter.concatenateIdAndDescription\'}"/><Label labelFor="idBOMItemChangedOn" text="{i18n&gt;vchclf_insp_dependecydtl_changedon}"/><FormattedText id="idBOMItemChangedOn" htmlText="{parts:[{path:\'properties&gt;/LastChangeDate\'},{path:\'properties&gt;/to_Super/LastChangeDate\'},{path:\'properties&gt;/to_Super/IsExcludedItem\'},{path:\'__viewData&gt;/isSuperInspectorShown\'}],formatter:\'._superInspectorFormatter.formatDate\'}"/></f:content></f:SimpleForm><HBox alignItems="Start" justifyContent="End" visible="{__visibility&gt;/navToBOMVisibility}"><items><Link id="idBOMItemLink" text="{i18n&gt;vchclf_insp_bomitem_nav_to_bom}" class="sapUiTinyMargin" press="onNavigateToBOM"/></items></HBox></mvc:View>',
	"sap/i2d/lo/lib/zvchclfz/components/inspector/view/Base.view.xml": '<mvc:View xmlns="sap.m" xmlns:f="sap.f" xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" busyIndicatorDelay="0" controllerName="sap.i2d.lo.lib.zvchclfz.components.inspector.controller.Base"><f:DynamicPage toggleHeaderOnTitleClick="false"><f:header><core:Fragment fragmentName="sap.i2d.lo.lib.zvchclfz.components.inspector.fragment.Header" type="XML"/></f:header><f:content><IconTabBar id="idInspectorTabs" class="sapUiNoContentPadding" stretchContentHeight="true" expandable="false" selectedKey="{global&gt;/selectedTab}" select="onTabChanged" tabDensityMode="Compact"/></f:content></f:DynamicPage></mvc:View>',
	"sap/i2d/lo/lib/zvchclfz/components/inspector/view/CharacteristicsProperties.view.xml": '<mvc:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns:f="sap.ui.layout.form" xmlns="sap.m" busyIndicatorDelay="0" controllerName="sap.i2d.lo.lib.zvchclfz.components.inspector.controller.CharacteristicsProperties"><f:Form id="idCharacteristicsForm" editable="false"><f:layout><f:ResponsiveGridLayout labelSpanXL="4" labelSpanL="4" labelSpanM="5" labelSpanS="12" breakpointL="800" breakpointM="400" columnsL="2" columnsM="1"/></f:layout><f:formContainers><f:FormContainer title="{i18n&gt;vchclf_insp_common_basic_info_title}"><f:formElements><f:FormElement label="{i18n&gt;vchclf_insp_dependecydtl_name}"><f:fields><Text id="idCsticsName" text="{properties&gt;/Name}"/></f:fields></f:FormElement><f:FormElement label="{i18n&gt;vchclf_insp_dependecydtl_status}"><f:fields><ObjectStatus id="idCsticsStatus" text="{properties&gt;/StatusText}" class="sapUiNoMargin" state="{path:\'properties&gt;/Status\',formatter:\'._generalFormatter.statusFormatter\'}"/></f:fields></f:FormElement><f:FormElement label="{i18n&gt;vchclf_insp_dependecydtl_changedby}"><f:fields><Text id="idCsticsChangedBy" text="{parts:[{path:\'properties&gt;/LastChangedByUserDescription\'},{path:\'properties&gt;/LastChangedByUser\'}],formatter:\'._generalFormatter.changedByFormatter\'}"/></f:fields></f:FormElement><f:FormElement label="{i18n&gt;vchclf_insp_dependecydtl_changedon}"><f:fields><Text id="idCsticsChangedOn" text="{path:\'properties&gt;/LastChangeDate\',type:\'sap.ui.model.type.Date\',formatOptions:{style:\'medium\'}}"/></f:fields></f:FormElement></f:formElements></f:FormContainer><f:FormContainer title="{i18n&gt;vchclf_insp_cstics_format_title}"><f:formElements><f:FormElement label="{i18n&gt;vchclf_insp_cstics_properties_datatype}"><f:fields><Text id="idCsticsDataType" text="{properties&gt;/DataTypeText}"/></f:fields></f:FormElement><f:FormElement label="{i18n&gt;vchclf_insp_cstics_properties_length}"><f:fields><Text id="idCsticsLength" text="{properties&gt;/Length}"/></f:fields></f:FormElement><f:FormElement label="{i18n&gt;vchclf_insp_cstics_properties_casesensitive}"><f:fields><Text id="idCsticsCaseSensitive" text="{path:\'properties&gt;/CaseSensitive\',formatter:\'._generalFormatter.convertBoolToYesorNoFormatter\'}"/></f:fields></f:FormElement><f:FormElement label="{i18n&gt;vchclf_insp_cstics_properties_template}"><f:fields><Text id="idCsticsTemplate" text="{properties&gt;/Template}"/></f:fields></f:FormElement><f:FormElement label="{i18n&gt;vchclf_insp_cstics_properties_values}"><f:fields><Text id="idCsticsValues" text="{properties&gt;/ValueAssignmentType}"/></f:fields></f:FormElement><f:FormElement label="{i18n&gt;vchclf_insp_cstics_properties_required}"><f:fields><Text id="idCsticsRequired" text="{path:\'properties&gt;/IsRequired\',formatter:\'._generalFormatter.convertBoolToYesorNoFormatter\'}"/></f:fields></f:FormElement></f:formElements></f:FormContainer><f:FormContainer title="{i18n&gt;vchclf_insp_cstics_property_ref_table_title}" visible="{= ${properties&gt;/CharcReferenceTable} ? true : false }"><f:formElements><f:FormElement label="{i18n&gt;vchclf_insp_cstics_property_ref_table}"><f:fields><Text id="idCsticsRefTable" text="{properties&gt;/CharcReferenceTable}"/></f:fields></f:FormElement><f:FormElement label="{i18n&gt;vchclf_insp_cstics_property_ref_table_field}"><f:fields><Text id="idCsticsRefTableField" text="{properties&gt;/CharcReferenceTableField}"/></f:fields></f:FormElement></f:formElements></f:FormContainer></f:formContainers></f:Form></mvc:View>',
	"sap/i2d/lo/lib/zvchclfz/components/inspector/view/Comparison.view.xml": '<mvc:View controllerName="sap.i2d.lo.lib.zvchclfz.components.inspector.controller.Comparison" displayBlock="true" xmlns="sap.ui.table" xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns:u="sap.ui.unified" xmlns:l="sap.ui.layout" xmlns:core="sap.ui.core"><m:MessageStrip text="{i18n&gt;vchclf_comparison_config_change_info_msg}" type="Warning" visible="{= ${/hasError} ? false : true}"/><m:MessageStrip text="{i18n&gt;vchclf_comparison_model_change_calc_err}" type="Error" visible="{/hasError}"/><m:SearchField search=".onSearchPressed" visible="{= ${/hasError} ? false : true}"/><l:VerticalLayout class="vchclfComparisonTableVLayout"><l:content><TreeTable id="diffTreeTable" rows="{path:\'/items\',parameters:{arrayNames:[\'items\'],numberOfExpandedLevels:2}}" selectionMode="None" columnHeaderVisible="false" visibleRowCountMode="Auto" visible="{= ${/hasError} ? false : true}"><columns><Column width="100%"><template><m:HBox><m:items><core:Icon src="{parts:[\'DiffItemType\'],formatter:\'._formatter.getIconForDiffItemType\'}" class="sapUiTinyMarginEnd"/><m:Link text="{ComputedItemDescription}" class="sapUiTinyMarginEnd" press="onItemDescriptionPressed"/><m:ObjectStatus class="sapUiTinyMarginEnd vchclfDiffObjectState" text="{ComputedDiffTypeText}" state="{parts:[\'DiffType\'],formatter:\'._formatter.getStateForDiffType\'}"/><m:Text text="{ComputedValueFromText}" visible="{parts:[\'Values\'],formatter:\'._formatter.getValuesFromVisible\'}" class="sapUiTinyMarginEnd"/><core:Icon src="sap-icon://arrow-right" visible="{parts:[\'DiffType\',\'Values\'],formatter:\'._formatter.getValuesArrowVisible\'}" class="sapUiTinyMarginEnd"/><m:Text text="{ComputedValueToText}" visible="{parts:[\'Values\'],formatter:\'._formatter.getValuesToVisible\'}"/></m:items></m:HBox></template></Column></columns></TreeTable></l:content></l:VerticalLayout></mvc:View>',
	"sap/i2d/lo/lib/zvchclfz/components/inspector/view/ConfProfileProperties.view.xml": '<mvc:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" xmlns:f="sap.ui.layout.form" controllerName="sap.i2d.lo.lib.zvchclfz.components.inspector.controller.ConfProfileProperties"><f:SimpleForm maxContainerCols="1" minWidth="300" editable="false" layout="ResponsiveGridLayout" labelSpanXL="4" labelSpanL="4" labelSpanM="5" labelSpanS="12" breakpointL="800" breakpointM="400" columnsL="2" columnsM="1"><f:content><core:Title text="{i18n&gt;vchclf_insp_common_basic_info_title}"/><Label labelFor="idConfProfileName" text="{i18n&gt;vchclf_insp_dependecydtl_name}"/><Text id="idConfProfileName" text="{properties&gt;/ConfigurationProfileName}"/><Label labelFor="idMaterial" text="{i18n&gt;vchclf_insp_properties_conf_profile_material}"/><Text id="idMaterial" text="{properties&gt;/Product}"/><Label labelFor="idConfProfileStatus" text="{i18n&gt;vchclf_insp_dependecydtl_status}"/><ObjectStatus id="idConfProfileStatus" class="sapUiNoMargin" text="{path:\'properties&gt;/ConfigurationProfileStatus\',formatter:\'._formatter.statusTextForConfProfileFormatter\'}" state="{path:\'properties&gt;/ConfigurationProfileStatus\',formatter:\'._generalFormatter.statusFormatter\'}"/><Label labelFor="idProcess" text="{i18n&gt;vchclf_insp_properties_conf_profile_process}"/><Text id="idProcess" text="{path:\'properties&gt;/ConfigurationProfileProcess\',formatter:\'._formatter.processTextFormatter\'}"/><Label labelFor="idBOMExplosion" text="{i18n&gt;vchclf_insp_properties_conf_profile_bom_exp}"/><Text id="idBOMExplosion" text="{path:\'properties&gt;/BOMExplosionLevel\',formatter:\'._formatter.bomExplosionLevelFormatter\'}"/><Label labelFor="idConfProfileChangedBy" text="{i18n&gt;vchclf_insp_dependecydtl_changedby}"/><Text id="idConfProfileChangedBy" text="{parts:[{path:\'properties&gt;/UserDescription\'},{path:\'properties&gt;/LastChangedByUser\'}],formatter:\'._generalFormatter.changedByFormatter\'}"/><Label labelFor="idConfProfileChangedOn" text="{i18n&gt;vchclf_insp_dependecydtl_changedon}"/><Text id="idConfProfileChangedOn" text="{path:\'properties&gt;/LastChangeDate\',type:\'sap.ui.model.type.Date\',formatOptions:{style:\'medium\'}}"/></f:content></f:SimpleForm></mvc:View>',
	"sap/i2d/lo/lib/zvchclfz/components/inspector/view/Dependencies.view.xml": '<mvc:View controllerName="sap.i2d.lo.lib.zvchclfz.components.inspector.controller.Dependencies" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns="sap.m"><List id="idDependencyList" class="sapUiNoContentPadding" items="{path:\'dependencies&gt;/results\',sorter:{path:\'TypeDescription\',group:true}}"><ObjectListItem title="{parts:[{path:\'dependencies&gt;ObjectDependency\'},{path:\'dependencies&gt;Name\'},{path:\'dependencies&gt;Description\'}],formatter:\'._dependencyFormatter.dependencyTitleFormatter\'}" type="Navigation" press="onDependencyItemPress"><attributes><ObjectAttribute text="{parts:[{path:\'dependencies&gt;ObjectDependency\'},{path:\'dependencies&gt;Name\'},{path:\'dependencies&gt;Description\'}],formatter:\'._dependencyFormatter.dependencySubtitleFormatter\'}"/></attributes></ObjectListItem></List></mvc:View>',
	"sap/i2d/lo/lib/zvchclfz/components/inspector/view/DependencyDetails.view.xml": '<mvc:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" xmlns:f="sap.f" xmlns:form="sap.ui.layout.form" controllerName="sap.i2d.lo.lib.zvchclfz.components.inspector.controller.DependencyDetails" busyIndicatorDelay="0"><f:DynamicPage toggleHeaderOnTitleClick="false"><f:header><core:Fragment fragmentName="sap.i2d.lo.lib.zvchclfz.components.inspector.fragment.Header" type="XML"/></f:header><f:content><ScrollContainer height="100%" width="100%" horizontal="false" focusable="true" vertical="true"><form:SimpleForm maxContainerCols="1" minWidth="300" editable="false" layout="ResponsiveGridLayout" labelSpanXL="4" labelSpanL="4" labelSpanM="5" labelSpanS="12" breakpointL="800" breakpointM="400" columnsL="2" columnsM="1"><form:content><core:Title text="{i18n&gt;vchclf_insp_common_basic_info_title}"/><Label labelFor="idDetailsName" text="{i18n&gt;vchclf_insp_dependecydtl_name}"/><Text id="idDetailsName" text="{details&gt;/Name}"/><Label labelFor="idDetailsStatus" text="{i18n&gt;vchclf_insp_dependecydtl_status}"/><ObjectStatus id="idDetailsStatus" class="sapUiNoMargin" text="{details&gt;/StatusText}" state="{path:\'details&gt;/Status\',formatter:\'._formatter.status\'}"/><Label labelFor="idDetailsChangedBy" text="{i18n&gt;vchclf_insp_dependecydtl_changedby}"/><Text id="idDetailsChangedBy" text="{parts:[{path:\'details&gt;/LastChangedByUserDescription\'},{path:\'details&gt;/LastChangedByUser\'}],formatter:\'._generalFormatter.changedByFormatter\'}"/><Label labelFor="idDetailsChangedOn" text="{i18n&gt;vchclf_insp_dependecydtl_changedon}"/><Text id="idDetailsChangedOn" text="{path:\'details&gt;/LastChangeDate\',type:\'sap.ui.model.type.Date\',formatOptions:{style:\'medium\'}}"/><Label labelFor="idDetailsProcessingMode" text="{i18n&gt;vchclf_insp_dependencydtl_processing_mode}"/><Text id="idDetailsProcessingMode" text="{path:\'details&gt;/ProcessingMode\',formatter:\'._formatter.dependencyProcessingModeFormatter\'}"/><core:Title text="{i18n&gt;vchclf_insp_dependecydtl_code_title}"/><VBox><TextArea id="idDependencySourceCode" visible="true" value="{path:\'details&gt;/to_ObjectDependencyCodes\',formatter:\'._formatter.formatDependencySourceCode\'}" tooltip="{i18n&gt;vchclf_trace_detail_dependency_source_code}" width="100%" wrapping="Soft" growing="true" editable="false"/><Link visible="{__viewData&gt;/_isToggleDepSourceCodeLinkVisible}" busyIndicatorDelay="0" text="{= ${details&gt;/to_ObjectDependencyCodes}.length &gt; 3 ?             ${i18n&gt;vchclf_trace_detail_show_less_lines} :             ${i18n&gt;vchclf_trace_detail_show_more_lines} }" press="onToggleDependencyCodeLinesPressed" class="sapUiTinyMarginTop"/></VBox></form:content></form:SimpleForm></ScrollContainer></f:content></f:DynamicPage></mvc:View>',
	"sap/i2d/lo/lib/zvchclfz/components/inspector/view/DependencyTrace.view.xml": '<mvc:View xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns:ictr="sap.i2d.lo.lib.zvchclfz.components.inspector.control" busyIndicatorDelay="0" controllerName="sap.i2d.lo.lib.zvchclfz.components.inspector.controller.DependencyTrace"><Page id="idTraceContainer" enableScrolling="true" showSubHeader="{= ${trace&gt;/filterText} !== \'\' }" class="sapUiResponsivePadding"><headerContent><FlexBox height="100%" alignItems="Center" justifyContent="Center" renderType="Bare"><items><Button id="idTraceFilterButton" icon="sap-icon://filter" tooltip="{i18n&gt;vchclf_objectheader_trace_filter_tt}" press="onFilterPressed"><layoutData><FlexItemData growFactor="0"/></layoutData></Button><SearchField id="idQuickSearch" value="{ui&gt;/searchText}" tooltip="{i18n&gt;vchclf_objectheader_trace_quick_filter_tt}" placeholder="{i18n&gt;vchclf_objectheader_trace_filter_placeholder}" liveChange="onSearchLiveChanged" search="onSearchTriggered" width="auto"><layoutData><FlexItemData growFactor="1"/></layoutData></SearchField></items></FlexBox></headerContent><subHeader><OverflowToolbar active="true" design="Info" visible="{= ${trace&gt;/filterText} !== \'\' }" ariaLabelledBy="idOverflowToolbarText" press="onOverflowToolbarPressed"><Text id="idOverflowToolbarText" text="{trace&gt;/filterText}" tooltip="{trace&gt;/filterText}" wrapping="false"/><ToolbarSpacer/><core:Icon src="sap-icon://sys-cancel" press="onResetFilterPressed" decorative="false" tooltip="{i18n&gt;vchclf_trace_reset_filter_tt}"/></OverflowToolbar></subHeader><content><List id="idTraceList" items="{path:\'trace&gt;/entries\',key:\'_id\'}" growing="true" growingScrollToLoad="true" growingThreshold="50" updateStarted="onListUpdateStarted" class="sapUiNoContentPadding" noDataText="{= ${global&gt;/isTraceOn} ? ${i18n&gt;vchclf_nodata_trace_on} : ${i18n&gt;vchclf_nodata_trace_off} }"><CustomListItem highlight="{= ${trace&gt;_isHighlighted} ? \'Information\' : \'None\' }" highlightText="{= ${trace&gt;_isHighlighted} ? ${i18n&gt;vchclf_trace_entry_highlighted} : \'\'}"><ictr:TraceEntry expandable="true" expand="onExpandTraceEntryPressed" expanded="{trace&gt;_isExpanded}" busyIndicatorDelay="0" class="vchclfTraceEntryRemoveBorder" hasContent="{trace&gt;HasDetail}" clicked="onTraceEntryClicked" accessibleRole="Region"><ictr:headerToolbar><Toolbar height="auto" class="sapUiTinyMarginTopBottom"><ictr:TraceEntryText metaText="{trace&gt;MetaText}" showPreciseNumbers="{global&gt;/showPreciseNumbers}" filter="onFilterTraceEntryItem" inspect="onInspectTraceEntryItem" whereWasValueSet="onWhereWasValueSet" whereWasCsticUsed="onWhereWasCsticUsed" whereWasDepSet="onWhereWasDepSet" whereWasDepUsed="onWhereWasDepUsed"/><ToolbarSpacer/><Text textAlign="End" text="{trace&gt;EntryNo}" class="sapUiTinyMarginEnd"/></Toolbar></ictr:headerToolbar></ictr:TraceEntry></CustomListItem></List></content></Page></mvc:View>',
	"sap/i2d/lo/lib/zvchclfz/components/inspector/view/Error.view.xml": '<mvc:View xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns="sap.m"><MessagePage showHeader="false" text="{i18n&gt;vchclf_objectheader_title_object_not_found}" icon="sap-icon://message-warning" id="InspectErrorPage" description="{i18n&gt;vchclf_objectheader_subtitle_object_not_found}"/></mvc:View>',
	"sap/i2d/lo/lib/zvchclfz/components/inspector/view/InspectorFrame.view.xml": '<mvc:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" xmlns:uxap="sap.uxap" controllerName="sap.i2d.lo.lib.zvchclfz.components.inspector.controller.InspectorFrame" height="100%"><Page backgroundDesign="Solid" showFooter="false" showHeader="true" showSubHeader="false"><customHeader><OverflowToolbar style="Clear" class="vchclfinspectorHeaderTitleWithPadding"><SegmentedButton id="idInspectorSegmentedButton" selectedKey="{global&gt;/selectedView}" selectionChange="onSelectedViewChanged" visible="{= ${global&gt;/isTraceSupported} || ${global&gt;/isConfigComparisonAllowed}}" class="sapMSegmentedButtonNoAutoWidth"><items><SegmentedButtonItem text="{i18n&gt;vchclf_objectheader_inspector}" key="inspector" tooltip="{i18n&gt;vchclf_objectheader_inspector}"/><SegmentedButtonItem text="{i18n&gt;vchclf_objectheader_comparison}" key="comparison" tooltip="{i18n&gt;vchclf_objectheader_comparison}" visible="{global&gt;/isConfigComparisonAllowed}"/><SegmentedButtonItem text="{i18n&gt;vchclf_objectheader_trace}" key="trace" tooltip="{i18n&gt;vchclf_objectheader_trace}" visible="{global&gt;/isTraceSupported}"/></items><layoutData><OverflowToolbarLayoutData priority="NeverOverflow"/></layoutData></SegmentedButton><ToolbarSpacer/><Button icon="sap-icon://nav-back" tooltip="{i18n&gt;vchclf_objectheader_back_tt}" press="onBackPressed" visible="{= ${global&gt;/selectedView} === \'inspector\' ? true : false }" enabled="{global&gt;/isBackEnabled}"><layoutData><OverflowToolbarLayoutData priority="NeverOverflow"/></layoutData></Button><ToggleButton icon="{= ${global&gt;/isTrackEventConnected} ? \'sap-icon://connected\' : \'sap-icon://disconnected\'}" pressed="{global&gt;/isTrackEventConnected}" tooltip="{i18n&gt;vchclf_objectheader_inspector_track_tt}" visible="{= ${global&gt;/selectedView} === \'inspector\'}"><layoutData><OverflowToolbarLayoutData priority="Low"/></layoutData></ToggleButton><Button icon="sap-icon://action-settings" press="onComparisonSettingsPressed" tooltip="{i18n&gt;vchclf_objectheader_comparison_settings_tt}" visible="{= ${global&gt;/selectedView} === \'comparison\'}"><layoutData><OverflowToolbarLayoutData priority="Low"/></layoutData></Button><Switch id="idTraceSwitch" visible="{= ${global&gt;/selectedView} === \'trace\'}" state="{global&gt;/isTraceOn}" change="onTraceSwitchChange" busyIndicatorDelay="0" tooltip="{i18n&gt;vchclf_objectheader_trace_switch_on_off_tt}" busy="{global&gt;/traceSwitchBusyState}"/><Button icon="sap-icon://decline" tooltip="{i18n&gt;vchclf_objectheader_close_tt}" press="onClosePressed"><layoutData><OverflowToolbarLayoutData priority="Low"/></layoutData></Button></OverflowToolbar></customHeader><content><NavContainer id="idInspectorNavContainer" height="100%" navigate="onNavigate" afterNavigate="onAfterNavigate" autoFocus="false" visible="{= ${global&gt;/selectedView} === \'inspector\'}"/><NavContainer id="idComparisonNavContainer" height="100%" autoFocus="false" visible="{= ${global&gt;/selectedView} === \'comparison\'}"><mvc:XMLView visible="{= ${global&gt;/selectedView} === \'comparison\'}" viewName="sap.i2d.lo.lib.zvchclfz.components.inspector.view.Comparison"/></NavContainer><NavContainer id="idTraceNavContainer" height="100%" autoFocus="false" visible="{= ${global&gt;/selectedView} === \'trace\'}"><mvc:XMLView visible="{= ${global&gt;/selectedView} === \'trace\'}" viewName="sap.i2d.lo.lib.zvchclfz.components.inspector.view.DependencyTrace"/></NavContainer></content></Page></mvc:View>',
	"sap/i2d/lo/lib/zvchclfz/components/inspector/view/OperationComponents.view.xml": '<mvc:View controllerName="sap.i2d.lo.lib.zvchclfz.components.inspector.controller.OperationComponents" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns="sap.m"><List id="idOperationComponentsList" class="sapUiNoContentPadding" items="{components&gt;/results}"><ObjectListItem title="{components&gt;ProductName}" type="Active" press="onComponentItemPress"><attributes><ObjectAttribute text="{components&gt;BOMComponentName}"/></attributes><firstStatus><ObjectStatus text="{i18n&gt;vchclf_insp_component_automatically_assigned}" visible="{components&gt;IsAutoAssigned}" state="Warning"/></firstStatus></ObjectListItem></List></mvc:View>',
	"sap/i2d/lo/lib/zvchclfz/components/inspector/view/OperationProperties.view.xml": '<mvc:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns:f="sap.ui.layout.form" xmlns:l="sap.ui.layout" xmlns="sap.m" controllerName="sap.i2d.lo.lib.zvchclfz.components.inspector.controller.OperationProperties"><f:Form id="idOperationForm" editable="false"><f:layout><f:ResponsiveGridLayout labelSpanXL="4" labelSpanL="4" labelSpanM="5" labelSpanS="12" breakpointL="800" breakpointM="400" columnsL="2" columnsM="1"/></f:layout><f:toolbar><core:Fragment fragmentName="sap.i2d.lo.lib.zvchclfz.components.inspector.fragment.ShowMasterData" type="XML"/></f:toolbar><f:formContainers><f:FormContainer title="{i18n&gt;vchclf_insp_common_basic_info_title}"><f:formElements><f:FormElement label="{i18n&gt;vchclf_insp_operations_operation_number}"><f:fields><FormattedText id="idOperationsOperationNumber" htmlText="{parts:[{path:\'properties&gt;/BillOfOperationsOperation\'},{path:\'properties&gt;/to_Super/BillOfOperationsOperation\'},{path:\'properties&gt;/to_Super/IsExcludedItem\'},{path:\'__viewData&gt;/isSuperInspectorShown\'}],formatter:\'._superInspectorFormatter.formatValue\'}"/></f:fields></f:FormElement><f:FormElement label="{i18n&gt;vchclf_insp_operations_workcenter}"><f:fields><FormattedText id="idOperationsWorkcenter" htmlText="{parts:[{path:\'properties&gt;/WorkCenter\'},{path:\'properties&gt;/WorkCenterDescription\'},{path:\'properties&gt;/to_Super/WorkCenter\'},{path:\'properties&gt;/to_Super/WorkCenterDescription\'},{path:\'properties&gt;/to_Super/IsExcludedItem\'},{path:\'__viewData&gt;/isSuperInspectorShown\'}],formatter:\'._superInspectorFormatter.concatenateIdAndDescription\'}"/></f:fields></f:FormElement><f:FormElement label="{i18n&gt;vchclf_insp_operations_std_value_key}"><f:fields><FormattedText id="idOperationsStdValueKey" htmlText="{parts:[{path:\'properties&gt;/StandardValueKey\'},{path:\'properties&gt;/to_Super/StandardValueKey\'},{path:\'properties&gt;/to_Super/IsExcludedItem\'},{path:\'__viewData&gt;/isSuperInspectorShown\'}],formatter:\'._superInspectorFormatter.formatValue\'}"/></f:fields></f:FormElement><f:FormElement label="{i18n&gt;vchclf_insp_operations_control_key}"><f:fields><FormattedText id="idOperationsControlKey" htmlText="{parts:[{path:\'properties&gt;/ControlKey\'},{path:\'properties&gt;/to_Super/ControlKey\'},{path:\'properties&gt;/to_Super/IsExcludedItem\'},{path:\'__viewData&gt;/isSuperInspectorShown\'}],formatter:\'._superInspectorFormatter.formatValue\'}"/></f:fields></f:FormElement></f:formElements></f:FormContainer><f:FormContainer title="{i18n&gt;vchclf_insp_common_standard_values_title}" formElements="{properties&gt;/to_StandardValues}" visible="{__viewData&gt;/hasStandardValues}"><f:FormElement label="{parts:[{path:\'properties&gt;Label\'},{path:\'properties&gt;to_Super/Label\'}],formatter:\'._routingFormatter.getLabelOfStandardValue\'}" visible="{parts:[{path:\'properties&gt;Value\'},{path:\'__viewData&gt;/isSuperInspectorShown\'}],formatter:\'._routingFormatter.getVisibilityOfStandardValue\'}"><f:fields><FormattedText htmlText="{parts:[{path:\'properties&gt;Value\'},{path:\'properties&gt;UnitOfMeasure\'},{path:\'properties&gt;to_Super/Value\'},{path:\'properties&gt;to_Super/UnitOfMeasure\'},{path:\'properties&gt;/to_Super/IsExcludedItem\'},{path:\'__viewData&gt;/isSuperInspectorShown\'}],formatter:\'._superInspectorFormatter.formatQtyWithUom\'}"/></f:fields></f:FormElement></f:FormContainer><f:FormContainer title="{i18n&gt;vchclf_insp_common_ref_operation_set_title}" visible="{path:\'__viewData&gt;/objectType\',formatter:\'._routingFormatter.visibilityOfReferenceOperationSet\'}"><f:FormElement label="{i18n&gt;vchclf_insp_operations_ref_oper_set}"><f:fields><FormattedText htmlText="{parts:[{path:\'properties&gt;/BillOfOperationsRefGroup\'},{path:\'properties&gt;/BillOfOperationsRefDesc\'},{path:\'properties&gt;/to_Super/BillOfOperationsRefGroup\'},{path:\'properties&gt;/to_Super/BillOfOperationsRefDesc\'},{path:\'properties&gt;/to_Super/IsExcludedItem\'},{path:\'__viewData&gt;/isSuperInspectorShown\'}],formatter:\'._superInspectorFormatter.concatenateIdAndDescription\'}"/></f:fields></f:FormElement><f:FormElement label="{i18n&gt;vchclf_insp_operations_ref_oper_group_counter}"><f:fields><FormattedText htmlText="{parts:[{path:\'properties&gt;/BillOfOperationsRefVariant\'},{path:\'properties&gt;/to_Super/BillOfOperationsRefVariant\'},{path:\'properties&gt;/to_Super/IsExcludedItem\'},{path:\'__viewData&gt;/isSuperInspectorShown\'}],formatter:\'._superInspectorFormatter.formatValue\'}"/></f:fields></f:FormElement></f:FormContainer></f:formContainers></f:Form></mvc:View>',
	"sap/i2d/lo/lib/zvchclfz/components/inspector/view/PRTProperties.view.xml": '<mvc:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns:f="sap.ui.layout.form" xmlns="sap.m" controllerName="sap.i2d.lo.lib.zvchclfz.components.inspector.controller.PRTProperties"><f:SimpleForm maxContainerCols="1" minWidth="300" editable="false" layout="ResponsiveGridLayout" labelSpanXL="4" labelSpanL="4" labelSpanM="5" labelSpanS="12" breakpointL="800" breakpointM="400" columnsL="2" columnsM="1"><f:toolbar><core:Fragment fragmentName="sap.i2d.lo.lib.zvchclfz.components.inspector.fragment.ShowMasterData" type="XML"/></f:toolbar><f:content><core:Title text="{i18n&gt;vchclf_insp_common_basic_info_title}"/><Label labelFor="idPRTItemQuantity" text="{i18n&gt;vchclf_insp_prtitem_quantity}"/><FormattedText id="idPRTItemQuantity" htmlText="{parts:[{path:\'properties&gt;/Quantity\'},{path:\'properties&gt;/Unit\'},{path:\'properties&gt;/to_Super/Quantity\'},{path:\'properties&gt;/to_Super/Unit\'},{path:\'properties&gt;/to_Super/IsExcludedItem\'},{path:\'__viewData&gt;/isSuperInspectorShown\'}],formatter:\'._superInspectorFormatter.formatQtyWithUom\'}"/><Label labelFor="idPRTItemCategory" text="{i18n&gt;vchclf_insp_prtitem_categoryitem}"/><FormattedText id="idPRTItemCategory" htmlText="{parts:[{path:\'properties&gt;/ProdnRsceToolCategory\'},{path:\'properties&gt;/ProdnRsceToolCategoryName\'},{path:\'properties&gt;/to_Super/ProdnRsceToolCategory\'},{path:\'properties&gt;/to_Super/ProdnRsceToolCategoryName\'},{path:\'properties&gt;/to_Super/IsExcludedItem\'},{path:\'__viewData&gt;/isSuperInspectorShown\'}],formatter:\'._superInspectorFormatter.concatenateIdAndDescription\'}"/></f:content></f:SimpleForm></mvc:View>',
	"sap/i2d/lo/lib/zvchclfz/components/inspector/view/PRTs.view.xml": '<mvc:View controllerName="sap.i2d.lo.lib.zvchclfz.components.inspector.controller.PRTs" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns="sap.m"><List id="idPRTsList" class="sapUiNoContentPadding" items="{prts&gt;/results}"><ObjectListItem title="{parts:[{path:\'prts&gt;Description\'},{path:\'prts&gt;ProductionResourceTool\'}],formatter:\'._prtFormatter.prtTitleFormatter\'}" type="Active" press="onPRTItemPress"><attributes><ObjectAttribute text="{parts:[{path:\'prts&gt;Description\'},{path:\'prts&gt;ProductionResourceTool\'}],formatter:\'._prtFormatter.prtSubtitleFormatter\'}"/></attributes></ObjectListItem></List></mvc:View>',
	"sap/i2d/lo/lib/zvchclfz/components/inspector/view/RoutingHeaderProperties.view.xml": '<mvc:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns:f="sap.ui.layout.form" xmlns="sap.m" busyIndicatorDelay="0" controllerName="sap.i2d.lo.lib.zvchclfz.components.inspector.controller.RoutingHeaderProperties"><f:SimpleForm maxContainerCols="1" minWidth="300" editable="false" layout="ResponsiveGridLayout" labelSpanXL="4" labelSpanL="4" labelSpanM="5" labelSpanS="12" breakpointL="800" breakpointM="400" columnsL="2" columnsM="1"><f:toolbar><core:Fragment fragmentName="sap.i2d.lo.lib.zvchclfz.components.inspector.fragment.ShowMasterData" type="XML"/></f:toolbar><f:content><core:Title text="{i18n&gt;vchclf_insp_common_basic_info_title}"/><Label labelFor="idRoutingHeaderComponent" text="{i18n&gt;vchclf_insp_routing_header_component}"/><FormattedText id="idRoutingHeaderComponent" htmlText="{parts:[{path:\'properties&gt;/Product\'},{path:\'properties&gt;/ProductName\'},{path:\'properties&gt;/to_Super/Product\'},{path:\'properties&gt;/to_Super/ProductName\'},{path:\'properties&gt;/to_Super/IsExcludedItem\'},{path:\'__viewData&gt;/isSuperInspectorShown\'}],formatter:\'._superInspectorFormatter.concatenateIdAndDescription\'}"/><Label labelFor="idRoutingHeaderID" text="{i18n&gt;vchclf_insp_routing_header_id}"/><FormattedText id="idRoutingHeaderID" htmlText="{parts:[{path:\'properties&gt;/BillOfOperationsGroup\'},{path:\'properties&gt;/to_Super/BillOfOperationsGroup\'},{path:\'properties&gt;/to_Super/IsExcludedItem\'},{path:\'__viewData&gt;/isSuperInspectorShown\'}],formatter:\'._superInspectorFormatter.formatValue\'}"/><Label labelFor="idRoutingHeaderGroupCount" text="{i18n&gt;vchclf_insp_routing_header_group_counter}"/><FormattedText id="idRoutingHeaderGroupCount" htmlText="{parts:[{path:\'properties&gt;/BillOfOperationsVariant\'},{path:\'properties&gt;/to_Super/BillOfOperationsVariant\'},{path:\'properties&gt;/to_Super/IsExcludedItem\'},{path:\'__viewData&gt;/isSuperInspectorShown\'}],formatter:\'._superInspectorFormatter.formatValue\'}"/><Label labelFor="idRoutingHeaderUsage" text="{i18n&gt;vchclf_insp_routing_header_usage}"/><FormattedText id="idRoutingHeaderUsage" htmlText="{parts:[{path:\'properties&gt;/BillOfOperationsUsage\'},{path:\'properties&gt;/BillOfOperationsUsageDesc\'},{path:\'properties&gt;/to_Super/BillOfOperationsUsage\'},{path:\'properties&gt;/to_Super/BillOfOperationsUsageDesc\'},{path:\'properties&gt;/to_Super/IsExcludedItem\'},{path:\'__viewData&gt;/isSuperInspectorShown\'}],formatter:\'._superInspectorFormatter.concatenateIdAndDescription\'}"/></f:content></f:SimpleForm></mvc:View>',
	"sap/i2d/lo/lib/zvchclfz/components/inspector/view/RoutingSequenceProperties.view.xml": '<mvc:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns:f="sap.ui.layout.form" xmlns="sap.m" busyIndicatorDelay="0" controllerName="sap.i2d.lo.lib.zvchclfz.components.inspector.controller.RoutingSequenceProperties"><f:SimpleForm maxContainerCols="1" minWidth="300" editable="false" layout="ResponsiveGridLayout" labelSpanXL="4" labelSpanL="4" labelSpanM="5" labelSpanS="12" breakpointL="800" breakpointM="400" columnsL="2" columnsM="1"><f:toolbar><core:Fragment fragmentName="sap.i2d.lo.lib.zvchclfz.components.inspector.fragment.ShowMasterData" type="XML"/></f:toolbar><f:content><core:Title text="{i18n&gt;vchclf_insp_common_basic_info_title}"/><Label labelFor="idSequenceBranchOperation" text="{i18n&gt;vchclf_insp_sequence_branch_operation}"/><FormattedText id="idSequenceBranchOperation" htmlText="{parts:[{path:\'properties&gt;/BOOSequenceBranchOperation\'},{path:\'properties&gt;/to_Super/BOOSequenceBranchOperation\'},{path:\'properties&gt;/to_Super/IsExcludedItem\'},{path:\'__viewData&gt;/isSuperInspectorShown\'}],formatter:\'._superInspectorFormatter.setNoneIfNoTextIsPassed\'}"/><Label labelFor="idSequenceReturnOperation" text="{i18n&gt;vchclf_insp_sequence_return_operation}"/><FormattedText id="idSequenceReturnOperation" htmlText="{parts:[{path:\'properties&gt;/BOOSequenceReturnOperation\'},{path:\'properties&gt;/to_Super/BOOSequenceReturnOperation\'},{path:\'properties&gt;/to_Super/IsExcludedItem\'},{path:\'__viewData&gt;/isSuperInspectorShown\'}],formatter:\'._superInspectorFormatter.setNoneIfNoTextIsPassed\'}"/><Label labelFor="idSequenceLotSize" text="{i18n&gt;vchclf_insp_sequence_lot_size}" visible="{= !${__viewData&gt;/isParallelSequence}}"/><FormattedText id="idSequenceLotSize" htmlText="{parts:[{path:\'properties&gt;/MinimumLotSizeQuantity\'},{path:\'properties&gt;/MaximumLotSizeQuantity\'},{path:\'properties&gt;/BillOfOperationsUnit\'},{path:\'properties&gt;/to_Super/MinimumLotSizeQuantity\'},{path:\'properties&gt;/to_Super/MaximumLotSizeQuantity\'},{path:\'properties&gt;/to_Super/BillOfOperationsUnit\'},{path:\'properties&gt;/to_Super/IsExcludedItem\'},{path:\'__viewData&gt;/isSuperInspectorShown\'}],formatter:\'._superInspectorFormatter.formatQtyFromTo\'}" visible="{= !${__viewData&gt;/isParallelSequence}}"/><Label labelFor="idSequenceAlignmentKey" text="{i18n&gt;vchclf_insp_sequence_alignment_key}" visible="{__viewData&gt;/isParallelSequence}"/><FormattedText id="idSequenceAlignmentKey" htmlText="{parts:[{path:\'properties&gt;/SequenceSchedulingAlignment\'},{path:\'properties&gt;/SequenceSchedulingAlignmentDesc\'},{path:\'properties&gt;/to_Super/SequenceSchedulingAlignment\'},{path:\'properties&gt;/to_Super/SequenceSchedulingAlignmentDesc\'},{path:\'properties&gt;/to_Super/IsExcludedItem\'},{path:\'__viewData&gt;/isSuperInspectorShown\'}],formatter:\'._superInspectorFormatter.concatenateIdAndDescription\'}" visible="{__viewData&gt;/isParallelSequence}"/></f:content></f:SimpleForm></mvc:View>',
	"sap/i2d/lo/lib/zvchclfz/components/inspector/view/ValueProperties.view.xml": '<mvc:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns:f="sap.ui.layout.form" xmlns="sap.m" controllerName="sap.i2d.lo.lib.zvchclfz.components.inspector.controller.ValueProperties"><f:SimpleForm maxContainerCols="1" minWidth="300" editable="false" layout="ResponsiveGridLayout" labelSpanXL="4" labelSpanL="4" labelSpanM="5" labelSpanS="12" breakpointL="800" breakpointM="400" columnsL="2" columnsM="1"><f:content><core:Title text="{i18n&gt;vchclf_insp_common_basic_info_title}"/><Label labelFor="idValueName" text="{parts:[{path:\'properties&gt;/HasHighPrecision\'}],formatter:\'._formatter.getLabelForValueName\'}"/><Text id="idValueName" text="{parts:[{path:\'properties&gt;/HasHighPrecision\'},{path:\'properties&gt;/FormattedValueFrom\'},{path:\'properties&gt;/FormattedValueTo\'},{path:\'properties&gt;/TechnicalValueDisplay\'}],formatter:\'._formatter.getTextForValueName\'}"/><Label labelFor="idValueDescription" text="{i18n&gt;vchclf_insp_values_properties_description}" visible="{= ${properties&gt;/Description} ? true : false }"/><Text id="idValueDescription" text="{properties&gt;/Description}" visible="{= ${properties&gt;/Description} ? true : false }"/><Label labelFor="idValueSelected" text="{path:\'properties&gt;/IntervalType\',formatter:\'._formatter.selectedLabelForValue\'}"/><Text id="idValueSelected" text="{path:\'properties&gt;/IsSelected\',formatter:\'._formatter.selectedTextForValue\'}"/><Label labelFor="idValueSelectable" text="{path:\'properties&gt;/IntervalType\',formatter:\'._formatter.selectableLabelForValue\'}"/><Text id="idValueSelectable" text="{path:\'properties&gt;/ExclusionType\',formatter:\'._formatter.selectableTextForValue\'}"/></f:content></f:SimpleForm></mvc:View>',
	"sap/i2d/lo/lib/zvchclfz/components/inspector/view/Values.view.xml": '<mvc:View controllerName="sap.i2d.lo.lib.zvchclfz.components.inspector.controller.Values" xmlns:html="http://www.w3.org/1999/xhtml" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns="sap.m"><List id="idValuesList" class="sapUiNoContentPadding" items="{values&gt;/results}"><ObjectListItem title="{parts:[{path:\'values&gt;FormattedValueFrom\'},{path:\'values&gt;FormattedValueTo\'},{path:\'values&gt;HasHighPrecision\'},{path:\'values&gt;Description\'}],formatter:\'._valuesFormatter.getTitleOfValueItem\'}" type="Active" press="onValueItemPress"><attributes><ObjectAttribute text="{parts:[{path:\'values&gt;HasHighPrecision\'},{path:\'values&gt;FormattedValueFrom\'},{path:\'values&gt;Description\'}],formatter:\'._valuesFormatter.getAttributeOfValueItem\'}"/></attributes><firstStatus><ObjectStatus text="{parts:[{path:\'values&gt;ExclusionType\'},{path:\'values&gt;IsSelected\'}],formatter:\'._valuesFormatter.statusTextForValues\'}" state="{parts:[{path:\'values&gt;ExclusionType\'},{path:\'values&gt;IsSelected\'}],formatter:\'._valuesFormatter.statusStateForValues\'}"/></firstStatus></ObjectListItem></List></mvc:View>',
	"sap/i2d/lo/lib/zvchclfz/components/smarttemplate/configuration/manifest.json": '{"_version":"1.7.0","sap.app":{"id":"sap.i2d.lo.lib.zvchclfz.components.smarttemplate.configuration","type":"component","resources":"resources.json","i18n":"i18n/messagebundle.properties","title":"{{FULLSCREEN_TITLE}}","ach":"CA-CL","embeddedBy":"../../../"},"sap.ui":{"_version":"1.1.0","technology":"UI5","deviceTypes":{"desktop":true,"tablet":true,"phone":true},"supportedThemes":["sap_hcb","sap_bluecrystal"]},"sap.ui5":{"dependencies":{"libs":{"sap.m":{"minUI5Version":"1.40.0"},"sap.ui.layout":{"minUI5Version":"1.40.0"},"sap.ui.core":{"minUI5Version":"1.40.0"},"sap.f":{"minUI5Version":"1.40.0"}}},"componentUsages":{"valuationComponent":{"name":"sap.i2d.lo.lib.zvchclfz.components.valuation","settings":{}},"structurePanelComponent":{"name":"sap.i2d.lo.lib.zvchclfz.components.structurepanel","settings":{}},"inspectorComponent":{"name":"sap.i2d.lo.lib.zvchclfz.components.inspector","settings":{}}},"resources":{"js":[],"css":[{"uri":"css/style.css"}]},"contentDensities":{"compact":true,"cozy":false},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"sap.i2d.lo.lib.zvchclfz.components.configuration.i18n.messagebundle"}},"configurationSettings":{"type":"sap.ui.model.json.JSONModel"}}}}',
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/fragment/BOMItemBaseVHDialog.fragment.xml": '<core:FragmentDefinition xmlns="sap.ui.comp.valuehelpdialog" xmlns:m="sap.m" xmlns:fb="sap.ui.comp.filterbar" xmlns:core="sap.ui.core"><ValueHelpDialog id="BOMItemBaseVH" title="{BOMItemVHDialogConfig&gt;/title}" ok=".onOk" cancel=".onCancel" busyIndicatorDelay="0" busy="true" afterClose=".onAfterClose" supportMultiselect="false" key="{BOMItemVHDialogConfig&gt;/key}" descriptionKey="{BOMItemVHDialogConfig&gt;/descriptionKey}"><filterBar><fb:FilterBar id="BOMItemVHFilterBar" advancedMode="true" search=".onSearch" filterGroupItems="{path:\'BOMItemVHDialogConfig&gt;/filters\',factory:\'.createFilterGroupItems\'}"/></filterBar></ValueHelpDialog></core:FragmentDefinition>',
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/fragment/BOMItemDialog.fragment.xml": '<core:FragmentDefinition xmlns:core="sap.ui.core" xmlns:l="sap.ui.layout" xmlns:f="sap.ui.layout.form" xmlns="sap.m"><Dialog id="BOMItemDialog" title="{= ${BOMItemDialog&gt;/IsBOMItemInsert} ? ${i18n&gt;vchclf_structpnl_insert_bom_item} : ${i18n&gt;vchclf_structpnl_change_bom_item}}" draggable="true" contentWidth="36rem" resizable="true" busyIndicatorDelay="0"><content><VBox><MessageStrip class="sapUiSmallMarginTop sapUiMediumMarginEnd sapUiMediumMarginBegin sapUiSmallMarginBottom" showIcon="true" visible="{BOMItemDialog&gt;/IsBOMItemInsert}" text="{i18n&gt;vchclf_structpnl_bom_item_dialog_message_strip}"/><f:SimpleForm id="BOMItemDialogForm" ariaLabelledBy="BOMItemDialogForm" editable="true" layout="ResponsiveGridLayout" breakpointM="400" columnsM="9" columnsL="2" columnsXL="2" labelSpanS="12" labelSpanM="3" labelSpanL="2" labelSpanXL="2"><f:content><Label labelFor="BOMItemCategoryDisplay" text="{i18n&gt;vchclf_structpnl_bom_item_category_label}" visible="{= !${BOMItemDialog&gt;/IsBOMItemInsert}}"/><Input id="BOMItemCategoryDisplay" editable="false" tooltip="{i18n&gt;vchclf_structpnl_bom_item_category_label}" value="{SelectedBOMItem&gt;/ItemCategoryDescription}" visible="{= !${BOMItemDialog&gt;/IsBOMItemInsert}}"/><Label labelFor="BOMItemCategory" text="{i18n&gt;vchclf_structpnl_bom_item_category_label}" visible="{BOMItemDialog&gt;/IsBOMItemInsert}"/><Select id="BOMItemCategory" tooltip="{i18n&gt;vchclf_structpnl_bom_item_category_label}" forceSelection="false" selectedKey="{BOMItemDialog&gt;/SelectedItemKey}" items="{BOMItemDialog&gt;/BOMItemCategory}" busyIndicatorDelay="0" change="onItemCategoryChange" visible="{BOMItemDialog&gt;/IsBOMItemInsert}"><core:Item key="{BOMItemDialog&gt;BillOfMaterialItemCategory}" text="{BOMItemDialog&gt;BillOfMaterialItemCategoryDesc}"/></Select><Label labelFor="BOMItemNameForInsert" required="true" text="{i18n&gt;vchclf_structpnl_bom_item_label}" visible="{= !${BOMItemDialog&gt;/SelectedBOMItemCategory/D} &amp;&amp; !${BOMItemDialog&gt;/SelectedBOMItemCategory/T} &amp;&amp; ${BOMItemDialog&gt;/IsBOMItemInsert}}"/><Input id="BOMItemNameForInsert" tooltip="{i18n&gt;vchclf_structpnl_bom_item_label}" showValueHelp="true" autocomplete="false" busyIndicatorDelay="0" value="{SelectedBOMItem&gt;/BOMComponentName}" valueStateText="{i18n&gt;vchclf_structpnl_bom_item_validation_invalidproduct}" valueHelpRequest="onBOMMaterialVHPressed" visible="{= !${BOMItemDialog&gt;/SelectedBOMItemCategory/D} &amp;&amp; !${BOMItemDialog&gt;/SelectedBOMItemCategory/T} &amp;&amp; ${BOMItemDialog&gt;/IsBOMItemInsert}}" showSuggestion="true" change="onProductChange" maxLength="40" suggest="onProductSuggest" suggestionItems="{BOMItemDialogVH&gt;/C_VarConfignProductPlantVH}" maxSuggestionWidth="auto"><suggestionItems><core:ListItem text="{BOMItemDialogVH&gt;Material}" additionalText="{BOMItemDialogVH&gt;MaterialDescription}"/></suggestionItems></Input><Label labelFor="BOMItemNameForChange" required="true" text="{i18n&gt;vchclf_structpnl_bom_item_label}" visible="{= !${BOMItemDialog&gt;/SelectedBOMItemCategory/D} &amp;&amp; !${BOMItemDialog&gt;/SelectedBOMItemCategory/T} &amp;&amp; !${BOMItemDialog&gt;/IsBOMItemInsert}}"/><Input id="BOMItemNameForChange" tooltip="{i18n&gt;vchclf_structpnl_bom_item_label}" value="{SelectedBOMItem&gt;/BOMComponentName}" editable="false" visible="{= !${BOMItemDialog&gt;/SelectedBOMItemCategory/D} &amp;&amp; !${BOMItemDialog&gt;/SelectedBOMItemCategory/T} &amp;&amp; !${BOMItemDialog&gt;/IsBOMItemInsert}}"/><Label labelFor="BOMItemPosition" required="true" text="{i18n&gt;vchclf_structpnl_bom_item_position_label}"/><Input id="BOMItemPosition" maxLength="4" tooltip="{i18n&gt;vchclf_structpnl_bom_item_position_label}" valueStateText="{i18n&gt;vchclf_structpnl_bom_item_validation_invalidposition}" change="onChange" value="{SelectedBOMItem&gt;/ItemNumber}"/><Label required="true" labelFor="BOMItemSize1" visible="{BOMItemDialog&gt;/SelectedBOMItemCategory/R}" text="{i18n&gt;vchclf_structpnl_bom_item_size_1}"/><Input id="BOMItemSize1" change="onChange" valueStateText="{i18n&gt;vchclf_structpnl_bom_item_validation_invalidvarsize1}" tooltip="{i18n&gt;vchclf_structpnl_bom_item_size_1}" value="{SelectedBOMItem&gt;/VarItemSize1}" visible="{BOMItemDialog&gt;/SelectedBOMItemCategory/R}"/><Label labelFor="BOMItemSize2" visible="{BOMItemDialog&gt;/SelectedBOMItemCategory/R}" text="{i18n&gt;vchclf_structpnl_bom_item_size_2}"/><Input id="BOMItemSize2" tooltip="{i18n&gt;vchclf_structpnl_bom_item_size_2}" value="{SelectedBOMItem&gt;/VarItemSize2}" visible="{BOMItemDialog&gt;/SelectedBOMItemCategory/R}"/><Label labelFor="BOMItemSize3" visible="{BOMItemDialog&gt;/SelectedBOMItemCategory/R}" text="{i18n&gt;vchclf_structpnl_bom_item_size_3}"/><Input id="BOMItemSize3" tooltip="{i18n&gt;vchclf_structpnl_bom_item_size_3}" value="{SelectedBOMItem&gt;/VarItemSize3}" visible="{BOMItemDialog&gt;/SelectedBOMItemCategory/R}"/><Label labelFor="BOMItemFormula" visible="{BOMItemDialog&gt;/SelectedBOMItemCategory/R}" text="{i18n&gt;vchclf_structpnl_bom_item_formula}"/><Input id="BOMItemFormula" maxLength="2" change="onFormulaChange" autocomplete="false" valueHelpRequest="onBOMFormulaVHPressed" showValueHelp="true" busyIndicatorDelay="0" showSuggestion="true" suggest="onFormulaSuggest" tooltip="{i18n&gt;vchclf_structpnl_bom_item_formula}" valueStateText="{i18n&gt;vchclf_structpnl_bom_item_validation_invalidformulakey}" value="{SelectedBOMItem&gt;/VarItemFormula}" visible="{BOMItemDialog&gt;/SelectedBOMItemCategory/R}" suggestionItems="{BOMItemDialogVH&gt;/I_BillOfMaterialFormulaVH}" maxSuggestionWidth="auto"><suggestionItems><core:ListItem text="{BOMItemDialogVH&gt;VariableSizeCompFormulaKey}" additionalText="{BOMItemDialogVH&gt;VariableSizeCompFormulaText}"/></suggestionItems></Input><Label required="true" labelFor="BOMItemNumber" visible="{BOMItemDialog&gt;/SelectedBOMItemCategory/R}" text="{i18n&gt;vchclf_structpnl_bom_item_number}"/><Input id="BOMItemNumber" change="onChange" value="{SelectedBOMItem&gt;/VarItemNumber}" valueStateText="{i18n&gt;vchclf_structpnl_bom_item_validation_invalidvarnumber}" tooltip="{i18n&gt;vchclf_structpnl_bom_item_number}" visible="{BOMItemDialog&gt;/SelectedBOMItemCategory/R}"/><Label required="true" labelFor="BOMItemVarQuantityAndUnitOfMeasure" visible="{BOMItemDialog&gt;/SelectedBOMItemCategory/R}" text="{i18n&gt;vchclf_structpnl_bom_item_quantity_label}"/><HBox id="BOMItemVarQuantityAndUnitOfMeasure" visible="{BOMItemDialog&gt;/SelectedBOMItemCategory/R}"><Input id="BOMItemVarQuantity" tooltip="{i18n&gt;vchclf_structpnl_bom_item_quantity_label}" width="3rem" change="onChange" type="Number" valueStateText="{i18n&gt;vchclf_structpnl_bom_item_validation_invalidquantity}" value="{SelectedBOMItem&gt;/VarItemQuantity}"/><Input id="BOMItemVarUnitOfMeasure" class="sapUiTinyMarginBegin" maxLength="3" autocomplete="false" showSuggestion="true" showValueHelp="true" busyIndicatorDelay="0" change="onUoMChange" suggest="onUoMSuggest" valueHelpRequest="onVarUoMValueHelpPressed" valueStateText="{i18n&gt;vchclf_structpnl_bom_item_validation_invalidunit}" tooltip="{i18n&gt;vchclf_structpnl_bom_item_unit_tooltip}" value="{SelectedBOMItem&gt;/VarItemUnit}" width="40%" suggestionItems="{BOMItemDialogVH&gt;/I_UnitOfMeasureStdVH}" maxSuggestionWidth="auto"><suggestionItems><core:ListItem text="{BOMItemDialogVH&gt;UnitOfMeasure}" additionalText="{BOMItemDialogVH&gt;UnitOfMeasureLongName}"/></suggestionItems></Input></HBox><Label required="true" labelFor="BOMItemQuantityAndUnitOfMeasure" visible="{= ${BOMItemDialog&gt;/SelectedBOMItemCategory/L} || ${BOMItemDialog&gt;/SelectedBOMItemCategory/N}}" text="{i18n&gt;vchclf_structpnl_bom_item_quantity_label}"/><HBox id="BOMItemQuantityAndUnitOfMeasure" visible="{= ${BOMItemDialog&gt;/SelectedBOMItemCategory/L} || ${BOMItemDialog&gt;/SelectedBOMItemCategory/N}}"><Input id="BOMItemQuantity" tooltip="{i18n&gt;vchclf_structpnl_bom_item_quantity_label}" width="3rem" change="onChange" type="Number" valueStateText="{i18n&gt;vchclf_structpnl_bom_item_validation_invalidquantity}" value="{SelectedBOMItem&gt;/Quantity}"/><Input id="BOMItemUnitOfMeasure" class="sapUiTinyMarginBegin" showValueHelp="true" maxLength="3" change="onUoMChange" busyIndicatorDelay="0" valueStateText="{i18n&gt;vchclf_structpnl_bom_item_validation_invalidunit}" tooltip="{i18n&gt;vchclf_structpnl_bom_item_unit_tooltip}" valueHelpRequest="onUoMValueHelpPressed" value="{SelectedBOMItem&gt;/Unit}" width="40%" autocomplete="false" showSuggestion="true" suggest="onUoMSuggest" suggestionItems="{BOMItemDialogVH&gt;/I_UnitOfMeasureStdVH}" maxSuggestionWidth="auto"><suggestionItems><core:ListItem text="{BOMItemDialogVH&gt;UnitOfMeasure}" additionalText="{BOMItemDialogVH&gt;UnitOfMeasureLongName}"/></suggestionItems></Input></HBox><Label labelFor="BOMItemText" visible="{BOMItemDialog&gt;/SelectedBOMItemCategory/T}" text="{i18n&gt;vchclf_structpnl_bom_item_text}"/><VBox id="BOMItemText" visible="{BOMItemDialog&gt;/SelectedBOMItemCategory/T}"><Input id="BOMItemTextLine1" maxLength="40" tooltip="{i18n&gt;vchclf_structpnl_bom_item_line_1}" value="{SelectedBOMItem&gt;/TxtItemTextLine1}" visible="{BOMItemDialog&gt;/SelectedBOMItemCategory/T}" placeholder="{i18n&gt;vchclf_structpnl_bom_item_line_1}"/><Input id="BOMItemTextLine2" maxLength="40" value="{SelectedBOMItem&gt;/TxtItemTextLine2}" tooltip="{i18n&gt;vchclf_structpnl_bom_item_line_2}" placeholder="{i18n&gt;vchclf_structpnl_bom_item_line_2}" visible="{BOMItemDialog&gt;/SelectedBOMItemCategory/T}"/></VBox><Label required="true" labelFor="BOMItemDocument" visible="{BOMItemDialog&gt;/SelectedBOMItemCategory/D}" text="{i18n&gt;vchclf_structpnl_bom_item_document}"/><Input id="BOMItemDocument" showValueHelp="true" maxLength="25" valueStateText="{i18n&gt;vchclf_structpnl_bom_item_validation_invaliddocument}" change="onDocumentChange" autocomplete="false" busyIndicatorDelay="0" value="{SelectedBOMItem&gt;/DocItemName}" valueHelpRequest="onDocumentValueHelpPressed" tooltip="{i18n&gt;vchclf_structpnl_bom_item_document}" visible="{BOMItemDialog&gt;/SelectedBOMItemCategory/D}" showSuggestion="true" suggest="onDocumentSuggest" suggestionItems="{BOMItemDialogVH&gt;/I_DocumentInfoRecordDocPrtVH}" maxSuggestionWidth="auto"><suggestionItems><core:ListItem text="{BOMItemDialogVH&gt;DocumentInfoRecordDocNumber}" additionalText="{BOMItemDialogVH&gt;DocumentDescription}"/></suggestionItems></Input><Label required="true" labelFor="BOMItemDocumentType" visible="{BOMItemDialog&gt;/SelectedBOMItemCategory/D}" text="{i18n&gt;vchclf_structpnl_bom_item_document_type}"/><Input id="BOMItemDocumentType" tooltip="{i18n&gt;vchclf_structpnl_bom_item_document_type}" value="{SelectedBOMItem&gt;/DocItemType}" maxLength="3" change="onDocumentTypeChange" showValueHelp="true" autocomplete="false" busyIndicatorDelay="0" valueStateText="{i18n&gt;vchclf_structpnl_bom_item_validation_invaliddocumenttype}" visible="{BOMItemDialog&gt;/SelectedBOMItemCategory/D}" valueHelpRequest="onDocumentValueHelpPressed"/><Label required="true" labelFor="BOMItemDocumentPart" visible="{BOMItemDialog&gt;/SelectedBOMItemCategory/D}" text="{i18n&gt;vchclf_structpnl_bom_item_document_part}"/><Input id="BOMItemDocumentPart" showValueHelp="true" change="onDocumentPartChange" busyIndicatorDelay="0" maxLength="3" valueHelpRequest="onDocumentValueHelpPressed" valueStateText="{i18n&gt;vchclf_structpnl_bom_item_validation_invaliddocumentpart}" tooltip="{i18n&gt;vchclf_structpnl_bom_item_document_part}" value="{SelectedBOMItem&gt;/DocItemPart}" visible="{BOMItemDialog&gt;/SelectedBOMItemCategory/D}"/><Label required="true" labelFor="BOMItemDocumentVersion" visible="{BOMItemDialog&gt;/SelectedBOMItemCategory/D}" text="{i18n&gt;vchclf_structpnl_bom_item_document_version}"/><Input id="BOMItemDocumentVersion" maxLength="2" busyIndicatorDelay="0" change="onDocumentVersionChange" valueStateText="{i18n&gt;vchclf_structpnl_bom_item_validation_invaliddocumentversion}" tooltip="{i18n&gt;vchclf_structpnl_bom_item_document_version}" value="{SelectedBOMItem&gt;/DocItemVersion}" visible="{BOMItemDialog&gt;/SelectedBOMItemCategory/D}" showValueHelp="true" valueHelpRequest="onDocumentValueHelpPressed"/></f:content></f:SimpleForm></VBox></content><buttons><Button id="saveAndClose" text="{i18n&gt;vchclf_structpnl_bom_item_dialog_ok}" tooltip="{i18n&gt;vchclf_structpnl_bom_item_dialog_ok}" press="onOk"/><Button id="cancel" tooltip="{i18n&gt;vchclf_structpnl_bom_item_dialog_cancel}" text="{i18n&gt;vchclf_structpnl_bom_item_dialog_cancel}" press="onCancel"/></buttons></Dialog></core:FragmentDefinition>',
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/fragment/BOMSelectorPopoverContent.fragment.xml": '<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><List items="{ui&gt;/bomViews}" class="sapUiLargeMarginEnd"><items><StandardListItem type="Active" title="{ui&gt;text}" tooltip="{ui&gt;text}" press="onBOMViewSelectionChange"/></items></List></core:FragmentDefinition>',
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/fragment/SelectRouting.fragment.xml": '<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><Dialog resizable="true" draggable="true" title="{i18n&gt;vchclf_structpnl_select_routing_dialog_title}"><content><List items="{ui&gt;/routings}"><ObjectListItem title="{ui&gt;Description}" type="Active" press="onRoutingSelected"><attributes><ObjectAttribute text="{parts:[{path:\'ui&gt;BillOfOperationsGroup\'},{path:\'ui&gt;BillOfOperationsVariant\'}],formatter:\'._formatter.formatRoutingKey\'}"/></attributes></ObjectListItem></List></content><endButton><Button text="{i18n&gt;vchclf_structpnl_commons_cancel}" press="onCancelButtonPressed"/></endButton></Dialog></core:FragmentDefinition>',
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/fragment/StructureFrameETOActions.fragment.xml": '<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><MenuButton id="insertBOMItemButton" type="Transparent" class="sapUiTinyMarginEnd" icon="sap-icon://add" buttonMode="Split" defaultAction="onOpenBOMItemDialogForInsertItem" tooltip="{i18n&gt;vchclf_structpnl_insert_bom_item_tooltip}" enabled="{path:\'global&gt;/currentlyFocusedBOMItem\',formatter:\'.isInsertBOMItemButtonEnabled\'}" visible="{= ${ui&gt;/isBOMChangeAllowed} &amp;&amp; ${ui&gt;/isStructurePanelEditable} }" useDefaultActionOnly="true"><menu><Menu itemSelected="onNavigateToBOMAppForInsertItem"><MenuItem text="{i18n&gt;vchclf_structpnl_navigate_to_bom_app_for_insert}" tooltip="{i18n&gt;vchclf_structpnl_navigate_to_bom_app_for_insert}" icon="sap-icon://edit-outside"/></Menu></menu></MenuButton><MenuButton id="changeBOMItemButton" type="Transparent" class="sapUiTinyMarginEnd" icon="sap-icon://edit" buttonMode="Split" defaultAction="onOpenBOMItemDialogForChangeItem" tooltip="{i18n&gt;vchclf_structpnl_change_bom_item_tooltip}" enabled="{path:\'global&gt;/currentlyFocusedBOMItem\',formatter:\'.isUpdateBOMItemButtonEnabled\'}" visible="{= ${ui&gt;/isBOMChangeAllowed} &amp;&amp; ${ui&gt;/isStructurePanelEditable} }" useDefaultActionOnly="true"><menu><Menu itemSelected="onNavigateToBOMAppForChangeItem"><MenuItem text="{i18n&gt;vchclf_structpnl_navigate_to_bom_app_for_update}" tooltip="{i18n&gt;vchclf_structpnl_navigate_to_bom_app_for_update}" icon="sap-icon://edit-outside"/></Menu></menu></MenuButton><Button id="deleteBOMItemButton" icon="sap-icon://delete" press="onBOMItemDelete" type="Transparent" class="sapUiTinyMarginEnd" enabled="{path:\'global&gt;/currentlyFocusedBOMItem\',formatter:\'.isDeleteBOMItemButtonEnabled\'}" visible="{= ${ui&gt;/isBOMChangeAllowed} &amp;&amp; ${ui&gt;/isStructurePanelEditable} }" tooltip="{i18n&gt;vchclf_structpnl_delete_bom_item_tooltip}"/><Button id="fixateBOMItemButton" text="{i18n&gt;vchclf_structpnl_fix_bom_item}" press="onBOMItemFixate" type="Transparent" class="sapUiTinyMarginEnd" enabled="{path:\'global&gt;/currentlyFocusedBOMItem\',formatter:\'.isFixateButtonEnabled\'}" visible="{parts:[{path:\'ui&gt;/ConfigurationUISettings\'},{path:\'ui&gt;/isBOMChangeAllowed\'},{path:\'ui&gt;/isStructurePanelEditable\'}],formatter:\'.isFixateButtonVisible\'}" tooltip="{i18n&gt;vchclf_structpnl_fix_bom_item}"/><MenuButton id="fixateSelectedBOMItemButton" type="Transparent" class="sapUiTinyMarginEnd" text="{i18n&gt;vchclf_structpnl_fix_bom_item}" buttonMode="Split" defaultAction="onBOMItemFixate" tooltip="{i18n&gt;vchclf_structpnl_fix_bom_item_tooltip}" useDefaultActionOnly="true" enabled="{path:\'global&gt;/currentlyFocusedBOMItem\',formatter:\'.isFixateButtonEnabled\'}" visible="{parts:[{path:\'ui&gt;/ConfigurationUISettings\'},{path:\'ui&gt;/isBOMChangeAllowed\'},{path:\'ui&gt;/isStructurePanelEditable\'}],formatter:\'.isFixateMenuButtonVisible\'}"><menu><Menu itemSelected="onBOMItemFixateTopdown"><MenuItem text="{i18n&gt;vchclf_structpnl_fix_topdown_bom_item}" tooltip="{i18n&gt;vchclf_structpnl_fix_topdown_bom_item_tooltip}"/></Menu></menu></MenuButton><MenuButton id="fixateTopdownBOMItemButton" type="Transparent" class="sapUiTinyMarginEnd" text="{i18n&gt;vchclf_structpnl_fix_topdown_bom_item}" buttonMode="Split" defaultAction="onBOMItemFixateTopdown" tooltip="{i18n&gt;vchclf_structpnl_fix_topdown_bom_item_tooltip}" useDefaultActionOnly="true" enabled="{path:\'global&gt;/currentlyFocusedBOMItem\',formatter:\'.isFixateButtonEnabled\'}" visible="{parts:[{path:\'ui&gt;/ConfigurationUISettings\'},{path:\'ui&gt;/isBOMChangeAllowed\'},{path:\'ui&gt;/isStructurePanelEditable\'}],formatter:\'.isFixateTopDownMenuButtonVisible\'}"><menu><Menu itemSelected="onBOMItemFixate"><MenuItem text="{i18n&gt;vchclf_structpnl_fix_bom_item}" tooltip="{i18n&gt;vchclf_structpnl_fix_bom_item_tooltip}"/></Menu></menu></MenuButton><ToolbarSeparator class="sapUiTinyMarginEnd" visible="{= ${ui&gt;/isBOMChangeAllowed} &amp;&amp; ${ui&gt;/isStructurePanelEditable} }"/></core:FragmentDefinition>',
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/fragment/TablePersonalizationDialog.fragment.xml": '<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><P13nDialog showReset="true" showResetEnabled="{path:\'/isShowResetEnabled\'}" ok="_onOKPressed" cancel="_onCancelPressed" reset="_onResetPressed"><panels><P13nColumnsPanel changeColumnsItems="_onColumnsItemsChanged" items="{path:\'/items\'}" columnsItems="{path:\'/columnsItems\'}"><items><P13nItem columnKey="{columnKey}" text="{text}"/></items><columnsItems><P13nColumnsItem columnKey="{columnKey}" index="{index}" visible="{visible}" width="{width}"/></columnsItems></P13nColumnsPanel></panels></P13nDialog></core:FragmentDefinition>',
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/manifest.json": '{"_version":"1.5.0","sap.app":{"id":"sap.i2d.lo.lib.zvchclfz.components.structurepanel","type":"component","i18n":"i18n/i18n.properties","title":"{{title}}","embeddedBy":"../../","description":"{{description}}","resources":"resources.json","ach":"LO-VCH-FIO-SIM","dataSources":{}},"sap.ui":{"_version":"1.1.0","technology":"UI5","icons":{"icon":"sap-icon://task"},"deviceTypes":{"desktop":true,"tablet":true,"phone":true},"supportedThemes":["sap_hcb","sap_bluecrystal"]},"sap.ui5":{"_version":"1.1.0","rootView":"sap.i2d.lo.lib.zvchclfz.components.structurepanel.view.MainFrame","handleValidation":true,"dependencies":{"libs":{"sap.ui.core":{},"sap.m":{},"sap.ui.comp":{},"sap.ui.table":{}}},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"sap.i2d.lo.lib.zvchclfz.components.structurepanel.i18n.i18n"}}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{},"routes":[],"targets":{}},"contentDensities":{"compact":true,"cozy":true}}}',
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/view/MainFrame.view.xml": '<mvc:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" height="100%" busyIndicatorDelay="0" controllerName="sap.i2d.lo.lib.zvchclfz.components.structurepanel.controller.MainFrame"><NavContainer id="idStructurePanelNavContainer" width="100%" defaultTransitionName="{= ${ui&gt;/isMultiLevelScenario} ? \'slide\' : \'show\'}" autoFocus="false" height="100%"><mvc:XMLView height="100%" viewName="sap.i2d.lo.lib.zvchclfz.components.structurepanel.view.StructureFrame"/><mvc:XMLView height="100%" viewName="sap.i2d.lo.lib.zvchclfz.components.structurepanel.view.RoutingFrame"/></NavContainer></mvc:View>',
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/view/RoutingFrame.view.xml": '<mvc:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" height="100%" busy="{ui&gt;/isStructurePanelLoading}" busyIndicatorDelay="0" controllerName="sap.i2d.lo.lib.zvchclfz.components.structurepanel.controller.RoutingFrame"><Page id="idRoutingFramePage"><customHeader><Bar><contentLeft><HBox class="sapUiSmallMarginBegin"><Button icon="sap-icon://nav-back" tooltip="{i18n&gt;vchclf_structpnl_back_tt}" press="onBackPressed"/><Label class="sapMH3Style" labelFor="idSelectRoutingTypeButton" text="{path:\'ui&gt;/routingHeaderProduct\',formatter:\'._formatters.formatRoutingHeaderProduct\'}" tooltip="{path:\'ui&gt;/routingHeaderProduct\',formatter:\'._formatters.formatRoutingHeaderProduct\'}"/></HBox></contentLeft><contentRight><HBox alignItems="Center"><Button icon="sap-icon://decline" tooltip="{i18n&gt;vchclf_structpnl_close_tt}" press="onClosePanelPressed"/></HBox></contentRight></Bar></customHeader><subHeader><Bar><contentLeft><ScrollContainer height="100%" width="100%" horizontal="false" vertical="false" focusable="true"><Select forceSelection="false" enabled="{= ${ui&gt;/availableRoutings/numberOfRoutings} &gt; 1 ? true : false }" selectedKey="{ui&gt;/availableRoutings/selectedRouting}" tooltip="{path:\'ui&gt;/availableRoutings/selectedRouting\',formatter:\'._formatters.formatSelectedRoutingTooltip\'}" items="{path:\'ui&gt;/availableRoutings/routings\',sorter:{path:\'Description\'}}" change="onRoutingSelectionChanged"><core:Item key="{parts:[{path:\'ui&gt;BillOfOperationsGroup\'},{path:\'ui&gt;BillOfOperationsVariant\'}],formatter:\'._formatters.formatRoutingSelectionKey\'}" text="{parts:[{path:\'ui&gt;Description\'},{path:\'ui&gt;BillOfOperationsGroup\'},{path:\'ui&gt;BillOfOperationsVariant\'}],formatter:\'._formatters.formatRoutingSelection\'}"/></Select></ScrollContainer></contentLeft><contentRight><VBox fitContainer="true"><HBox justifyContent="End"><ToggleButton icon="sap-icon://example" press="onShowSuperRoutingChanged" pressed="{ui&gt;/isSuperTreeShown}" tooltip="{i18n&gt;vchclf_structpnl_treetoolbar_show_super_routing_tt}"/><Button icon="sap-icon://refresh" press="onRoutingTreeRefresh" tooltip="{i18n&gt;vchclf_structpnl_treetoolbar_refresh_routing_tt}"/></HBox></VBox></contentRight></Bar></subHeader><content><NavContainer id="idRoutingTreeNavContainer" width="100%" height="100%" autoFocus="false"/></content></Page></mvc:View>',
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/view/RoutingTree.view.xml": '<mvc:View controllerName="sap.i2d.lo.lib.zvchclfz.components.structurepanel.controller.RoutingTree" xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:table="sap.ui.table" xmlns:mvc="sap.ui.core.mvc" xmlns:customControl="sap.i2d.lo.lib.zvchclfz.components.structurepanel.control"><table:TreeTable id="idRoutingTree" selectionMode="Single" selectionBehavior="RowOnly" enableSelectAll="false" visibleRowCountMode="Auto" rows="{path:\'routingTree&gt;/routingNodes\',parameters:{arrayNames:[\'items\']}}" cellClick="onCellClicked" rowActionCount="1" rowSelectionChange="onRowSelectionChange"><table:columns><table:Column id="idRoutingColumn" hAlign="Left" resizable="false" tooltip="{i18n&gt;vchclf_structpnl_routing_tree_routing_column_tt}"><Label text="{i18n&gt;vchclf_structpnl_routing_tree_routing_column_title}"/><table:template><customControl:IconText isGreyedOut="{routingTree&gt;IsExcludedItem}" text="{parts:[{path:\'routingTree&gt;NodeType\'},{path:\'routingTree&gt;BillOfOperationsGroup\'},{path:\'routingTree&gt;BillOfOperationsSequence\'},{path:\'routingTree&gt;BillOfOperationsNode\'},{path:\'routingTree&gt;BillOfOperationsOperation\'},{path:\'routingTree&gt;Description\'}],formatter:\'._formatter.getDescription\'}" firstIconURI="{path:\'routingTree&gt;NodeType\',formatter:\'._formatter.getNodeTypeIcon\'}" firstIconTooltip="{path:\'routingTree&gt;NodeType\',formatter:\'._formatter.getNodeTypeTooltip\'}" secondIconURI="{parts:[{path:\'routingTree&gt;BOOSequenceBranchOperation\'},{path:\'routingTree&gt;BOOSequenceReturnOperation\'}],formatter:\'._formatter.getNodeBranchReturnIcon\'}" secondIconTooltip="{parts:[{path:\'routingTree&gt;BOOSequenceBranchOperation\'},{path:\'routingTree&gt;BOOSequenceReturnOperation\'}],formatter:\'._formatter.getNodeBranchReturnTooltip\'}"/></table:template></table:Column><table:Column id="idDependenciesColumn" width="2.5rem" hAlign="Center" resizable="false" tooltip="{i18n&gt;vchclf_structpnl_tree_dependencies_column_tt}"><core:Icon src="sap-icon://share-2" decorative="false" alt="{i18n&gt;vchclf_structpnl_tree_dependencies_column_tt}"/><table:template><core:Icon src="sap-icon://share-2" tooltip="{i18n&gt;vchclf_structpnl_tree_dependencies_column_tt}" alt="{i18n&gt;vchclf_structpnl_tree_dependencies_column_tt}" press="onDependencyPressed" visible="{path:\'routingTree&gt;ObjectDependencyAssgmtNumber\',formatter:\'._formatter.returnObjDepIconVisibility\'}"/></table:template></table:Column></table:columns><table:rowActionTemplate><table:RowAction><table:RowActionItem type="Navigation" press="onNavigationPressed" visible="{parts:[{path:\'routingTree&gt;BOOSequenceBranchOperation\'},{path:\'routingTree&gt;BOOSequenceReturnOperation\'}],formatter:\'._formatter.checkRoutingNavigationVisibility\'}"/></table:RowAction></table:rowActionTemplate></table:TreeTable></mvc:View>',
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/view/StructureFrame.view.xml": '<mvc:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" xmlns:variants="sap.ui.comp.variants" height="100%" busy="{ui&gt;/isStructurePanelLoading}" busyIndicatorDelay="0" controllerName="sap.i2d.lo.lib.zvchclfz.components.structurepanel.controller.StructureFrame"><Page id="idStructureFramePage"><customHeader><OverflowToolbar style="Clear"><HBox class="sapUiSmallMarginBegin" renderType="Bare" alignItems="Center"><Label class="sapMH3Style" labelFor="idSelectBOMTypeButton" text="{ui&gt;/selectedBOMViewTitle}"/><Button id="idSelectBOMTypeButton" type="Transparent" icon="sap-icon://arrow-down" visible="{ui&gt;/selectBOMViewVisibility}" tooltip="{i18n&gt;vchclf_structpnl_viewselector_title_tt}" press="onBOMViewSelectionTriggered"/></HBox><ToolbarSpacer/><Button class="sapUiTinyMarginEnd" icon="sap-icon://decline" tooltip="{i18n&gt;vchclf_structpnl_close_tt}" press="onClosePanelPressed"/></OverflowToolbar></customHeader><subHeader><OverflowToolbar><variants:VariantManagement id="idVariantManagement" class="sapUiSmallMarginBegin" variantItems="{ui&gt;/BOMColumnsVariant/variantItems}" manage="onVariantManaged" save="onVariantSaved" select="onVariantSelected" initialSelectionKey="{ui&gt;/BOMColumnsVariant/initialSelectionKey}" defaultVariantKey="{ui&gt;/BOMColumnsVariant/defaultKey}" standardItemText="{i18n&gt;vchclf_structpnl_variant_mangement_standard_title}"><variants:variantItems><variants:VariantItem text="{ui&gt;name}" key="{ui&gt;key}" author="{ui&gt;author}"/></variants:variantItems></variants:VariantManagement><ToolbarSpacer/><core:Fragment fragmentName="sap.i2d.lo.lib.zvchclfz.components.structurepanel.fragment.StructureFrameETOActions" type="XML"/><OverflowToolbarToggleButton icon="sap-icon://example" type="Transparent" press="onShowSuperBOMChanged" class="sapUiTinyMarginEnd" pressed="{ui&gt;/isSuperTreeShown}" visible="{= ${ui&gt;/selectedBOMView} === \'BOM\' &amp;&amp; ${ui&gt;/isSuperBOMAvailable} ? true : false}" text="{i18n&gt;vchclf_structpnl_treetoolbar_show_super_bom_tt}" tooltip="{i18n&gt;vchclf_structpnl_treetoolbar_show_super_bom_tt}"/><OverflowToolbarButton id="idReExplodeBOMButton" type="Transparent" icon="sap-icon://refresh" class="sapUiTinyMarginEnd" press="onStructureTreeRefresh" visible="{ui&gt;/isStructurePanelEditable}" text="{i18n&gt;vchclf_structpnl_treetoolbar_reexplode_tt}" tooltip="{i18n&gt;vchclf_structpnl_treetoolbar_reexplode_tt}"/><OverflowToolbarButton icon="sap-icon://expand-all" type="Transparent" press="onStructureTreeExpandAllNodes" class="sapUiTinyMarginEnd" text="{i18n&gt;vchclf_structpnl_treetoolbar_expand_tt}" tooltip="{i18n&gt;vchclf_structpnl_treetoolbar_expand_tt}"/><OverflowToolbarButton icon="sap-icon://collapse-all" type="Transparent" class="sapUiTinyMarginEnd" press="onStructureTreeCollapseAllNodes" text="{i18n&gt;vchclf_structpnl_treetoolbar_collapse_tt}" tooltip="{i18n&gt;vchclf_structpnl_treetoolbar_collapse_tt}"/><OverflowToolbarButton icon="sap-icon://action-settings" type="Transparent" class="sapUiTinyMarginEnd" press="onOpenTablePersonalizationDialog" text="{i18n&gt;vchclf_structpnl_treetoolbar_settings}" tooltip="{i18n&gt;vchclf_structpnl_treetoolbar_settings}"/></OverflowToolbar></subHeader><content><mvc:XMLView height="100%" viewName="sap.i2d.lo.lib.zvchclfz.components.structurepanel.view.StructureTree"/></content></Page></mvc:View>',
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/view/StructureTree.view.xml": '<mvc:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" xmlns:table="sap.ui.table" controllerName="sap.i2d.lo.lib.zvchclfz.components.structurepanel.controller.StructureTree" xmlns:customControl="sap.i2d.lo.lib.zvchclfz.components.structurepanel.control"><table:TreeTable id="idStructureTree" selectionMode="Single" selectionBehavior="RowOnly" enableSelectAll="false" visibleRowCountMode="Auto" toggleOpenState="onBOMComponentNodeToggled" rows="{path:\'tree&gt;/BOMComponents\',parameters:{arrayNames:[\'items\']}}" cellClick="onCellClicked" filter="onFilteringTriggered" rowSelectionChange="onRowSelectionChange" columnMove="onColumnMove" enableColumnFreeze="true" columnFreeze="onColumnFreeze" columnResize="onColumnResize" fixedColumnCount="{ui&gt;/fixedColumnCount}"/></mvc:View>',
	"sap/i2d/lo/lib/zvchclfz/components/valuation/control/ValueHelpDialog.control.xml": '<core:FragmentDefinition xmlns:core="sap.ui.core" xmlns:vchclf="sap.i2d.lo.lib.zvchclfz.components.valuation.control" xmlns="sap.m" xmlns:layout="sap.ui.layout"><SelectDialog id="valueHelpDialog" title="{parts:[\'view&gt;\',\'valuationSettings&gt;/descriptionModeCharacteristics\',\'i18n&gt;CSTIC_LABEL_BOTH\'],formatter:\'.formatter.getCharacteristicDescriptionWithName\'}" multiSelect="{= !${view&gt;IsSingleValued} }" search="onSearchInSelectDialog" confirm="onSelectDialogConfirm" growingThreshold="150" contentHeight="auto" items="{path:\'view&gt;DomainValues\',sorter:[{path:\'IsMasterDataValue\',group:true,descending:true},{path:\'SortKey\'}],groupHeaderFactory:\'.getGroupHeader\',templateShareable:false}" rememberSelections="true"><vchclf:SelectDialogListItem id="selectDialogItem" readonly="{= ( ${view&gt;IsReadonly} || ${view&gt;IsSetByObjectDependency} ) }" selected="{path:\'view&gt;\',formatter:\'.isListItemSelected\'}" assigned="{path:\'view&gt;\',formatter:\'.isListItemAssigned\'}" intervalDomainValue="{= ${view&gt;FormattedValueTo} === \'\' ? false : true}" class="sapVchclfCheckboxMarginLeft sapVchclfSDListItem"><vchclf:content><VBox class="sapVchclfSDOuterVBoxPadding sapUiSmallMarginBegin"><HBox><VBox class="sapVchclfSDLabelTop sapUiLargeMarginEnd"><Label text="{parts:[\'valuationSettings&gt;/descriptionModeCharacteristics\',\'view&gt;\',\'i18n&gt;VALUE_LABEL_NO_VALUE\',\'i18n&gt;ROUNDED_VALUE_PREFIX\',\'i18n&gt;INTERVAL_REPRESENTATION\',\'i18n&gt;PROPOSAL_LABEL\'],formatter:\'.formatter.getSelectDialogListItemLabel\'}" class="sapMSLITitle"/><Text visible="{parts:[\'valuationSettings&gt;/descriptionModeCharacteristics\',\'view&gt;\'],formatter:\'.formatter.isSelectDialogListItemTextVisible\'}" text="{parts:[\'view&gt;\',\'i18n&gt;ROUNDED_VALUE_PREFIX\',\'i18n&gt;INTERVAL_REPRESENTATION\'],formatter:\'.formatter.getSelectDialogListItemText\'}" class="sapMSLIDescription"/></VBox></HBox><HBox class="sapUiTinyMarginBottom"><Input id="intervalInput" width="200px" placeholder="{i18n&gt;SELECT_DIALOG_ASSIGN_INPUT_PLACEHOLDER}"/><Button id="assignmentButton" class="sapUiTinyMarginBegin" text="{i18n&gt;SELECT_DIALOG_ASSIGN_BUTTON_INTERVAL}"/></HBox></VBox><core:Icon visible="{path:\'view&gt;\',formatter:\'.isIntervalDomain\'}" class="sapVchclfIntervalArrowClosed" src="sap-icon://slim-arrow-down"/></vchclf:content></vchclf:SelectDialogListItem></SelectDialog></core:FragmentDefinition>',
	"sap/i2d/lo/lib/zvchclfz/components/valuation/manifest.json": '{"_version":"1.7.0","sap.app":{"id":"sap.i2d.lo.lib.zvchclfz.components.valuation","type":"component","resources":"resources.json","i18n":"i18n/messagebundle.properties","title":"{{FULLSCREEN_TITLE}}","ach":"LO-VCH-FIO-VAL","embeddedBy":"../../","dataSources":{"mainService":{"uri":"/sap/opu/odata/SAP/LO_VCHCLF","type":"OData","settings":{"odataVersion":"2.0","localUri":"../../common/localService/metadata.xml"}}}},"sap.ui":{"technology":"UI5","deviceTypes":{"desktop":true,"tablet":true,"phone":true},"supportedThemes":["sap_hcb","sap_belize"]},"sap.ui5":{"dependencies":{"libs":{"sap.m":{"minUI5Version":"1.48.0"},"sap.ui.layout":{"minUI5Version":"1.48.0"},"sap.ui.core":{"minUI5Version":"1.48.0"},"sap.uxap":{"minUI5Version":"1.48.0"}}},"resources":{"js":[],"css":[{"uri":"css/style.css"}]},"contentDensities":{"compact":true,"cozy":false},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"sap.i2d.lo.lib.zvchclfz.components.valuation.i18n.messagebundle"}},"valuationSettings":{"preload":true,"type":"sap.ui.model.json.JSONModel"}}},"sap.fiori":{"_version":"1.1.0","registrationIds":["F2189"],"archeType":"reusecomponent"}}',
	"sap/i2d/lo/lib/zvchclfz/components/valuation/view/Valuation.view.xml": '<mvc:View controllerName="sap.i2d.lo.lib.zvchclfz.components.valuation.controller.Valuation" xmlns:mvc="sap.ui.core.mvc" xmlns:core="sap.ui.core" xmlns:form="sap.ui.layout.form" xmlns:vchclf="sap.i2d.lo.lib.zvchclfz.controls" xmlns:valuation="sap.i2d.lo.lib.zvchclfz.components.valuation.control" xmlns="sap.m" busyIndicatorDelay="0" height="100%"><OverflowToolbar id="filterStatus" active="true" design="Info" visible="false" press="openFilterDialog" class="sapVchclfFilterStatusHeight"><Text id="filterStatusText" text=""/><ToolbarSpacer/><core:Icon id="resetFilterIcon" src="sap-icon://sys-cancel" width="2rem" press="removeFilter" tooltip="{i18n&gt;RESET_FILTER}"/></OverflowToolbar><VBox id="groupVBox" class="sapVchclfVBoxHeight sapVchclfVBoxItemHeight" items="{path:\'valuationSettings&gt;/groupRepresentation\',factory:\'.groupsFactory\'}"/><FlexBox visible="{valuationSettings&gt;/showNoCharacteristicText}" alignItems="Center" justifyContent="Center"><Text text="{= ${i18n&gt;NO_CHARACTERISTICS_TEXT}}"/></FlexBox></mvc:View>',
	"sap/i2d/lo/lib/zvchclfz/components/valuation/view/fragment/filter/FilterDialog.fragment.xml": '<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:f="sap.ui.layout.form" xmlns:l="sap.ui.layout"><Dialog id="filterDialog" title="{i18n&gt;FILTER_DIALOG_TITLE}" resizable="true" draggable="true" contentHeight="auto"><content><f:SimpleForm id="filterDialogSimpleForm" layout="ResponsiveGridLayout" labelSpanM="5" editable="true"><f:content><Label labelFor="switchMandatoryOnly" text="{i18n&gt;CHAR_FILTER_MAND_ONLY}" tooltip="{i18n&gt;CHAR_FILTER_MAND_ONLY}"/><Switch id="switchMandatoryOnly" state="{filterModel&gt;/isRequired}"/><Label labelFor="selectValueAssignment" text="{i18n&gt;CHAR_FILTER_VALUE_ASSIGNMENT}" tooltip="{i18n&gt;CHAR_FILTER_VALUE_ASSIGNMENT}"/><Select id="selectValueAssignment" change="onCsticValueAssignmentSelection" selectedKey="{filterModel&gt;/valueAssignedSelectedKey}"><core:Item key="notValuated"/><core:Item id="valueAssigned" key="ValueAssigned" text="{i18n&gt;VALUE_ASSIGNED}"/><core:Item id="noValueAssigned" key="NoValueAssigned" text="{i18n&gt;NO_VALUE_ASSIGNED}"/></Select><Label labelFor="switchHideReadOnly" text="{i18n&gt;CHAR_FILTER_HIDE_READONLY}" tooltip="{i18n&gt;CHAR_FILTER_HIDE_READONLY}"/><Switch id="switchHideReadOnly" state="{filterModel&gt;/changeable}"/><Label labelFor="switchAdditionalValuesOnly" text="{i18n&gt;CHAR_FILTER_ADD_VALUES_ONLY}" tooltip="{i18n&gt;CHAR_FILTER_ADD_VALUES_ONLY}"/><Switch id="switchAdditionalValuesOnly" state="{filterModel&gt;/addValues}"/><Label labelFor="selectIsSingleValued" text="{i18n&gt;CHAR_FILTER_IS_SINGLE_VALUED}" tooltip="{i18n&gt;CHAR_FILTER_IS_SINGLE_VALUED}"/><Select id="selectIsSingleValued" change="onIsSingleValuedSelection" selectedKey="{filterModel&gt;/singleMultiValuedSelectedKey}"><core:Item key="notValuated"/><core:Item id="singleValuedItem" key="SingleValued" text="{i18n&gt;CHAR_FILTER_SINGLE_VALUE_ASSIGNMENT}"/><core:Item id="multiValuedItem" key="MultiValued" text="{i18n&gt;CHAR_FILTER_MULTI_VALUE_ASSIGNMENT}"/></Select><Label labelFor="selectCsticFormat" text="{i18n&gt;CHAR_FILTER_CSTIC_FORMAT}" tooltip="{i18n&gt;CHAR_FILTER_CSTIC_FORMAT}"/><Select id="selectCsticFormat" change="onCsticFormatSelection" selectedKey="{filterModel&gt;/formatSelectedKey}"><core:Item key="noFormat"/><core:Item id="charFormatItem" key="CharacterFormat" text="{i18n&gt;VALUE_FORMAT_CHARACTER}"/><core:Item id="numFormatItem" key="NumericFormat" text="{i18n&gt;VALUE_FORMAT_NUMERIC}"/><core:Item id="dateFormatItem" key="DateFormat" text="{i18n&gt;VALUE_FORMAT_DATE}"/><core:Item id="timeFormatItem" key="TimeFormat" text="{i18n&gt;VALUE_FORMAT_TIME}"/></Select></f:content></f:SimpleForm></content><buttons><Button id="executeFilter" text="{i18n&gt;GO_FILTER}" type="Emphasized" press="onFilter"/><Button id="resetFilter" text="{i18n&gt;RESET_FILTER}" enabled="{filterModel&gt;/resetButtonEnabled}" press="onResetFilter"/><Button id="cancelFilter" text="{i18n&gt;CANCEL_FILTER}" press="onCancel"/></buttons></Dialog></core:FragmentDefinition>',
	"sap/i2d/lo/lib/zvchclfz/components/valuation/view/fragment/group/CharacteristicGroupEmbedded.fragment.xml": '<core:FragmentDefinition xmlns:core="sap.ui.core" xmlns:grid="sap.ui.layout.cssgrid" xmlns:layout="sap.ui.layout" xmlns="sap.m" xmlns:ext="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1"><VBox id="form"><Text id="groupTitle" visible="{valuationSettings&gt;/showGroupTitle}" text="{view&gt;Description}" class="sapUiFormTitleH5 sapUiSmallMarginBottom sapUiSmallMarginTop"/><grid:CSSGrid id="valuationForm" class="sapVchclfCSSGrid" items="{path:\'view&gt;Characteristics\',length:\'30\',factory:\'.characteristicFactory\',filters:{path:\'IsHidden\',operator:\'EQ\',value1:false}}" ext:formId="valuationForm" ext:flexBoxId="more_less_flexbox"><grid:customLayout><grid:GridBoxLayout boxesPerRowConfig="XL4 L3 M2 S1"/></grid:customLayout></grid:CSSGrid><FlexBox id="more_less_flexbox" class="sapVchclfMoreLessFlexBox" visible="{= ${view&gt;Characteristics}.length &gt; 29 &amp;&amp; ${view&gt;CsticCount} &gt; 30 &amp;&amp; ${view&gt;Characteristics}.length &gt; 0}" justifyContent="End" alignItems="Center"><Button id="more_less_button" type="Transparent" text="{= ${appStateModel&gt;top} &gt; 30 ? ${i18n&gt;SEE_LESS} : ${i18n&gt;SEE_MORE} }" press=".handleSeeLessMore"/></FlexBox><FlexBox visible="{= !${view&gt;CsticCount} &amp;&amp; !${view&gt;Characteristics}.length}" alignItems="Center" justifyContent="Center"><Text text="{= ${i18n&gt;NO_CHARACTERISTICS_TEXT}}"/></FlexBox></VBox></core:FragmentDefinition>',
	"sap/i2d/lo/lib/zvchclfz/components/valuation/view/fragment/group/CharacteristicGroupFullScreen.fragment.xml": '<core:FragmentDefinition xmlns:core="sap.ui.core" xmlns:layout="sap.ui.layout" xmlns:grid="sap.ui.layout.cssgrid" xmlns="sap.m" xmlns:ext="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1"><IconTabFilter id="form" text="{= ${view&gt;Description} ? ${view&gt;Description} : ${view&gt;Name}}"><content><ScrollContainer id="valuationScrollContainer" height="100%" width="100%" horizontal="false" class="sapUiResponsiveContentPadding" vertical="true"><VBox><grid:CSSGrid id="valuationForm" class="sapVchclfCSSGrid" items="{path:\'view&gt;Characteristics\',filters:[{path:\'IsHidden\',operator:\'EQ\',value1:false}],sorter:{path:\'SortKey\'},length:\'30\',factory:\'.characteristicFactory\'}" ext:formId="valuationForm" ext:flexBoxId="more_less_flexbox"><grid:customLayout><grid:GridBoxLayout boxesPerRowConfig="XL4 L3 M2 S1"/></grid:customLayout></grid:CSSGrid><FlexBox id="more_less_flexbox" class="sapVchclfMoreLessFlexBox" visible="{parts:[\'view&gt;Characteristics\',\'view&gt;CsticCount\',\'appStateModel&gt;\'],formatter:\'.getSeeMoreVisibility\'}" justifyContent="End" alignItems="Center"><MenuButton id="PagingSeeMore" buttonMode="Split" text="{i18n&gt;SEE_MORE}" defaultAction="onPagingDefaultAction" useDefaultActionOnly="true"><menu><Menu id="PagingMenu" itemSelected="onPagingTriggered"><items><MenuItem id="PagingSeeAll" text="{i18n&gt;SEE_ALL}" ext:pagingKey="ShowAll"/></items></Menu></menu></MenuButton></FlexBox><FlexBox visible="{= ${view&gt;CsticCount} === 0}" alignItems="Center" justifyContent="Center"><Text text="{= ${i18n&gt;NO_CHARACTERISTICS_TEXT}}"/></FlexBox></VBox></ScrollContainer></content></IconTabFilter></core:FragmentDefinition>',
	"sap/i2d/lo/lib/zvchclfz/components/valuation/view/fragment/group/CharacteristicGroupsEmbedded.fragment.xml": '<core:FragmentDefinition xmlns:core="sap.ui.core" xmlns:form="sap.ui.layout.form" xmlns:layout="sap.ui.layout" xmlns="sap.m"><VBox id="groups" items="{path:\'view&gt;CharacteristicsGroups\',factory:\'.characteristicGroupFactoryEmbedded\',events:{change:\'.onGroupDataChangedWithoutSuspend\'}}"/></core:FragmentDefinition>',
	"sap/i2d/lo/lib/zvchclfz/components/valuation/view/fragment/group/CharacteristicGroupsFullScreen.fragment.xml": '<core:FragmentDefinition xmlns:core="sap.ui.core" xmlns:form="sap.ui.layout.form" xmlns:layout="sap.ui.layout" xmlns="sap.m"><IconTabBar id="groups" expandable="false" class="sapUiNoContentPadding" stretchContentHeight="true" select="onSelect" items="{path:\'view&gt;CharacteristicsGroups\',factory:\'.characteristicGroupFactoryFullScreen\',events:{change:\'.onGroupDataChangedWithoutSuspend\'}}"/></core:FragmentDefinition>',
	"sap/i2d/lo/lib/zvchclfz/manifest.json": '{"_version":"1.7.0","sap.app":{"id":"sap.i2d.lo.lib.zvchclf","type":"library","embeds":["components/configuration","components/valuation","components/classification","components/smarttemplate/configuration","components/inspector","components/structurepanel"],"i18n":"i18n/messagebundle.properties","applicationVersion":{"version":"8.1.11"},"title":"{{title}}","description":"{{description}}","ach":"LO-VC","resources":"resources.json","offline":false,"dataSources":{"mainService":{"uri":"/sap/opu/odata/SAP/LO_VCHCLF","type":"OData","settings":{"odataVersion":"2.0","localUri":"common/localService/metadata.xml"}}}},"sap.ui":{"technology":"UI5","deviceTypes":{"desktop":true,"tablet":true,"phone":false},"supportedThemes":["sap_hcb","sap_belize"]},"sap.ui5":{"config":{"sapFiori2Adaptation":true},"dependencies":{"minUI5Version":"1.39.0","libs":{"sap.ui.core":{},"sap.ui.comp":{"lazy":true},"sap.ui.table":{"lazy":true},"sap.suite.ui.generic.template":{"lazy":true}}},"contentDensities":{"compact":true,"cozy":false}},"sap.platform.hcp":{"uri":""},"sap.fiori":{"registrationIds":["F2189"],"archeType":"reusecomponent"}}'
}, "sap/i2d/lo/lib/zvchclfz/library-preload");
//# sourceMappingURL=library-preload.js.map