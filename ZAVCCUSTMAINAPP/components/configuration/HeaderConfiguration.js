/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/configuration/BaseHeaderConfiguration",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/HeaderField",
	"sap/ui/model/json/JSONModel",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/type/VariantMatchingMode",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/formatter/HeaderFieldFormatter"
], function (BaseHeaderConfiguration, HeaderField, JSONModel, VariantMatchingMode, HeaderFieldFormatter) {
	"use strict";

	/**
	 *
	 */
	var HeaderConfiguration = BaseHeaderConfiguration.extend("sap.i2d.lo.lib.zvchclfz.components.configuration.HeaderConfiguration", {
		metadata: {
			manifest: "json"
		},

		getDefaultHeaderActions: function () {
			var aCollectedActions = [];

			// var oActionPre = new HeaderField({
			// 	controlType: "Button",
			// 	properties: {
			// 		"id": HeaderConfiguration.DEFAULT_HEADER_ACTION.PREVIOUS,
			// 		"text": "Previous Item",
			// 		// "visible": "{= ${configurationSettings>/editable} && ${configurationSettings>/embeddingMode} === 'Configuration'}",
			// 		"type": "Transparent",
			// 		// "tooltip": "{= ${vchclf>StatusType} === '2' ? ${vchI18n>UNLOCK_CONFIGURATION} : ${vchI18n>LOCK_CONFIGURATION}}",
			// 		"press": "onPreviousItem"
			// 	}
			// });
			
			// var oActionNext = new HeaderField({
			// 	controlType: "Button",
			// 	properties: {
			// 		"id": HeaderConfiguration.DEFAULT_HEADER_ACTION.NEXT,
			// 		"text": "Next Item",
			// 		// "visible": "{= ${configurationSettings>/editable} && ${configurationSettings>/embeddingMode} === 'Configuration'}",
			// 		"type": "Transparent",
			// 		// "tooltip": "{= ${vchclf>StatusType} === '2' ? ${vchI18n>UNLOCK_CONFIGURATION} : ${vchI18n>LOCK_CONFIGURATION}}",
			// 		"press": "onNextItem"
			// 	}
			// });

			var oActionPrint = new HeaderField({
				controlType: "Button",
				properties: {
					"id": HeaderConfiguration.DEFAULT_HEADER_ACTION.PRINT,
					"text": "Print Preview",
					// "visible": "{= ${configurationSettings>/editable} && ${configurationSettings>/embeddingMode} === 'Configuration'}",
					"type": "Transparent",
					// "tooltip": "{= ${vchclf>StatusType} === '2' ? ${vchI18n>UNLOCK_CONFIGURATION} : ${vchI18n>LOCK_CONFIGURATION}}",
					"press": "onPrintPreview"
				}
			});

			var oActionGradInfo = new HeaderField({
				controlType: "Button",
				properties: {
					"id": HeaderConfiguration.DEFAULT_HEADER_ACTION.GRADINFO,
					"text": "Grader Info",
					// "visible": "{= ${configurationSettings>/editable} && ${configurationSettings>/embeddingMode} === 'Configuration'}",
					"type": "Transparent",
					// "tooltip": "{= ${vchclf>StatusType} === '2' ? ${vchI18n>UNLOCK_CONFIGURATION} : ${vchI18n>LOCK_CONFIGURATION}}",
					"press": "onGraderInfo"
				}
			});
			
			var oActionLock = new HeaderField({
				controlType: "ToggleButton",
				properties: {
					"id": HeaderConfiguration.DEFAULT_HEADER_ACTION.LOCK,
					"text": "{= ${vchclf>StatusType} === '2' ?  ${vchI18n>BTN_TEXT_UNLOCK_CONFIGURATION} : ${vchI18n>BTN_TEXT_LOCK_CONFIGURATION}}",
					"pressed": "{= ${vchclf>StatusType} === '2'}",
					"visible": "{= ${configurationSettings>/editable} && ${configurationSettings>/embeddingMode} === 'Configuration'}",
					"type": "Transparent",
					"tooltip": "{= ${vchclf>StatusType} === '2' ? ${vchI18n>UNLOCK_CONFIGURATION} : ${vchI18n>LOCK_CONFIGURATION}}",
					"press": ".onLockConfiguration"
				}
			});

			var oActionSettings = new HeaderField({
				controlType: "Button",
				properties: {
					"id": HeaderConfiguration.DEFAULT_HEADER_ACTION.SETTINGS,
					"icon": "sap-icon://action-settings",
					"visible": "{configurationSettings>/hasSettings}",
					"type": "Transparent",
					"tooltip": "{vchI18n>SHOW_SETTINGS}",
					"press": ".onSettings"
				}
			});

			var oChangeDocuments = new HeaderField({
				controlType: "Button",
				properties: {
					"id": HeaderConfiguration.DEFAULT_HEADER_ACTION.CHANGE_DOCUMENTS,
					"text": "{vchI18n>CHANGE_DOCUMENTS_BUTTON}",
					"type": "Transparent",
					"tooltip": "{vchI18n>CHANGE_DOCUMENTS_BUTTON}",
					"press": ".onOpenChangeDocumentsDialog",
					"visible": "{= ${configurationSettings>/enableChangeDocumentsButton} && ${configurationSettings>/uiMode} !== 'Create'}"
				}
			});

			var oActionToggleLeftPanel = new HeaderField({
				controlType: "ToggleButton",
				properties: { 
					"id": HeaderConfiguration.DEFAULT_HEADER_ACTION.TOGGLE_STUCTURE_PANEL,
					"icon": "sap-icon://BusinessSuiteInAppSymbols/icon-side-panel-left-layout",
					"pressed": "{configurationSettings>/StructurePanelButtonPressed}",
					"type": "Transparent",
					"tooltip": "{vchI18n>TOGGLE_STRUCTURE_PANEL}",
					"press": ".onToggleLeftPanel",
					"visible": "{configurationSettings>/StructurePanelIsVisible}"
				}
			});

			var oActionToggleSidePanel = new HeaderField({
				controlType: "ToggleButton",
				properties: {
					"id": HeaderConfiguration.DEFAULT_HEADER_ACTION.TOGGLE_INSPECTOR,
					"icon": "sap-icon://BusinessSuiteInAppSymbols/icon-sidepanel",
					"pressed": "{configurationSettings>/InspectorButtonPressed}",
					"type": "Transparent",
					"tooltip": "{vchI18n>TOGGLE_INSPECTOR}",
					"press": ".onToggleSidePanel"
				}
			});

			// Remove this button in case of using only one variant matching button instead of two (with/without menu for create variant)
			var oActionVariantMatching = new HeaderField({
				controlType: "Button",
				properties: {
					"id": HeaderConfiguration.DEFAULT_HEADER_ACTION.VARIANT_MATCHING,
					"text": "{vchI18n>BTN_TEXT_VARIANT_MATCHING}",
					"tooltip": "{vchI18n>TOOLTIP_VARIANT_MATCHING}",
					"type": "Transparent",
					"press": ".onVariantMatching",
					"visible": {
						parts: [
							{path: 'configurationSettings>/variantMatchingMode'},
							{path: 'vchclf>UISettings'}
						],
						formatter: HeaderFieldFormatter.getVariantMatchingVisibility
					}
				}
			});

			var oActionVariantMatchingWithCreate = new HeaderField({
				controlType: "MenuButton",
				properties: {
					"id": HeaderConfiguration.DEFAULT_HEADER_ACTION.VARIANT_MATCHING,
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
								parts: [
									{path: 'vchclf>StatusType'},
									{path: 'headerConfiguration>/fullMatchingVariants'},
									{path: 'vchclf>UISettings'}
								],
								formatter: HeaderFieldFormatter.isCreateVariantItemEnabled
							}
						},
						itemSelected: ".onCreateVariant"
					},
					"visible": {
						parts: [
							{path: 'configurationSettings>/variantMatchingMode'},
							{path: 'vchclf>UISettings'}, 
							{path: 'configurationSettings>/variantMatchingMenuButton'}
						],
						formatter: HeaderFieldFormatter.getVariantMatchingVisibility
					}
				}
			});
			
			var oActionSwitchToETO = new HeaderField({
				controlType: "Button",
				properties: {
					"id": HeaderConfiguration.DEFAULT_HEADER_ACTION.SWITCH_TO_ETO,
					"text": "{vchI18n>BTN_SWITCH_TO_ETO_PROFILE}",
					"tooltip": "{vchI18n>TOOLTIP_ETO_SWITCH}",
					"type": "Transparent",
					"press": ".onSwitchToETO",
					"visible": {
						parts: [
							{path: 'vchclf>EtoStatus'},
							{path: 'vchclf>UISettings'},
							{path: 'configurationSettings>/editable'}
						],
						formatter: HeaderFieldFormatter.getETOSwitchVisible
					}
				}
			});
			
			// aCollectedActions.push(oActionPre);
			// aCollectedActions.push(oActionNext);
			aCollectedActions.push(oActionPrint);
			aCollectedActions.push(oActionGradInfo);			
			aCollectedActions.push(oActionSwitchToETO);
			aCollectedActions.push(oActionVariantMatching);
			aCollectedActions.push(oActionVariantMatchingWithCreate);
			aCollectedActions.push(oChangeDocuments);
			aCollectedActions.push(oActionLock);
			aCollectedActions.push(oActionSettings);
			aCollectedActions.push(oActionToggleLeftPanel);
			aCollectedActions.push(oActionToggleSidePanel);

			return aCollectedActions;
		},

		/**
		 * @override
		 */
		getDefaultHeaderFields: function () {
			var aHeaderFields = [];

			// var oHeaderFieldStatus = new HeaderField({
			// 	description: "{vchI18n>CONFIGURATION_STATUS_HEADER}",
			// 	properties: {
			// 		"id": HeaderConfiguration.DEFAULT_HEADER_FIELD.STATUS,
			// 		"text": "{vchclf>StatusDescription}",
			// 		"state": "{= ${vchclf>StatusType} === '1' ? 'Success' : ${vchclf>StatusType} === '3' ? 'Warning' : 'Error' }",
			// 		"tooltip": "{vchI18n>CONF_STATUS_TOOLTIP}",
			// 		"press": ".onInconsistencyInformationRequested",
			// 		"active": "{= ${configurationSettings>/inconsistencyPopupActive} === undefined ||  ${vchclf>StatusType} === '2' ? false : ${configurationSettings>/inconsistencyPopupActive}}"
			// 	},
			// 	controlType: "ObjectStatus"
			// });
			// aHeaderFields.push(oHeaderFieldStatus);
			
			var oHeaderFieldEtoStatus = new HeaderField({
				description: "{vchI18n>CONFIGURATION_ETO_STATUS_HEADER}",
				properties: {
					"id": HeaderConfiguration.DEFAULT_HEADER_FIELD.ETO_STATUS,
					"text": "{vchclf>EtoStatusDescription}",
					"tooltip": "{vchI18n>CONF_ETO_STATUS_TOOLTIP}",
					"visible": "{=  ${vchclf>EtoStatus} !== '' && ${vchclf>EtoStatus} !== null && ${vchclf>EtoStatus} !== undefined }"
				},
				controlType: "Text"
			});
			aHeaderFields.push(oHeaderFieldEtoStatus);

			var oHeaderFieldPrice = new HeaderField({
				description: "{vchI18n>CONFIGURATION_PRICE_HEADER}",
				properties: {
					"id": HeaderConfiguration.DEFAULT_HEADER_FIELD.PRICE,
					"text": "{ parts: [{path: 'vchI18n>PRICE_REPRESENTATION'}, {path:'vchclf>NetValue'}, {path:'vchclf>Currency'}], formatter: 'sap.i2d.lo.lib.vchclf.components.configuration.formatter.HeaderFieldFormatter.formatPrice' }",
					"press": ".onPricingRecords",
					"visible": "{= ${configurationSettings>/pricingActive} === true && ${configurationSettings>/showPricingInfo} === true }"
				},
				controlType: "Link"
			});
			aHeaderFields.push(oHeaderFieldPrice);

			// var oHeaderFieldVariant = new HeaderField({
			// 	description: "{vchI18n>FULL_MATCHING_VARIANT}",
			// 	properties: {
			// 		"id": HeaderConfiguration.DEFAULT_HEADER_FIELD.VARIANT,
			// 		"text": "{headerConfiguration>/fullMatchingVariants}",
			// 		"busyIndicatorDelay": 0,
			// 		"busy": "{headerConfiguration>/headerFieldVariantBusy}",
			// 		"width": "auto",
			// 		"wrapping": false,
			// 		"tooltip": "{vchI18n>FULL_MATCHING_VARIANT}",
			// 		"visible": "{=  ${configurationSettings>/variantMatchingMode} !== 0 && ${configurationSettings>/variantMatchingMode} !== 1 }"
			// 	},
			// 	controlType: "Text"
			// });
			// aHeaderFields.push(oHeaderFieldVariant);
			return aHeaderFields;
		},

		_getVisible: function (sId, sAggregationName) {
			var aHeaderElements = this.getHeaderConfigurationModel().getProperty("/" + sAggregationName);
			var bVisible = false;

			if (!aHeaderElements) {
				return bVisible;
			}
			if (aHeaderElements.length === 0) {
				return bVisible;
			}

			aHeaderElements.forEach(function (oHeaderElement) {
				if (oHeaderElement.properties.id === sId && oHeaderElement.properties.visible) {
					bVisible = true;
				}
			});

			return bVisible;
		}
	});

	/**
	 * @static
	 */
	HeaderConfiguration.DEFAULT_HEADER_ACTION = {
		// PREVIOUS: "headerActionPreConfiguration",
		// NEXT: "headerActionNextConfiguration",
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

	/**
	 * @static
	 */
	HeaderConfiguration.DEFAULT_HEADER_FIELD = {
		// STATUS: "headerFieldStatus",
		ETO_STATUS: "headerFieldEtoStatus",
		PRICE: "headerFieldPrice"
		// VARIANT: "headerFieldVariant"
	};

	return HeaderConfiguration;
});
