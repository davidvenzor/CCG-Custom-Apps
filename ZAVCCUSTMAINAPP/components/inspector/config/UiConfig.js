/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["sap/i2d/lo/lib/zvchclfz/common/type/InspectorMode",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/GeneralFormatter",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants", "sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/i18n"
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
		Dependencies: "sap.i2d.lo.lib.zvchclfz.components.inspector.view.Dependencies",
		Images: "sap.i2d.lo.lib.zvchclfz.components.inspector.view.Images"
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
				inspectorTabs: [I.inspectorTab.properties, I.inspectorTab.dependencies, I.inspectorTab.images, I.inspectorTab.gradinghistory, I.inspectorTab.status],
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
			//Adding custom tabs - start
			"IMAGES": {
				getContent: function (v) {
					return sap.ui.xmlview({
						viewName: l.Images
					});
				},
				getIconTabFilterSettings: function (c) {
					return {
						icon: "sap-icon://image-viewer",
						key: I.inspectorTab.images,
						tooltip: "Product Image",
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

			"GRADINGHISTORY": {
				getContent: function (v) {
					return sap.ui.xmlview({
						viewName: l.Dependencies
					});
				},
				getIconTabFilterSettings: function (c) {
					return {
						icon: "sap-icon://history",
						key: I.inspectorTab.gradinghistory,
						tooltip: "Grading History",
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

			"STATUS": {
				getContent: function (v) {
					return sap.ui.xmlview({
						viewName: l.Dependencies
					});
				},
				getIconTabFilterSettings: function (c) {
					return {
						icon: "sap-icon://status-in-process",
						key: I.inspectorTab.status,
						tooltip: "Status",
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
			//Adding Custom tabs - end
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