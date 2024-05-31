/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessagePopover",
	"sap/m/MessagePopoverItem",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/type/LegacyScenario",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/HeaderConfiguration",
	"i2d/lo/app/zvchclfz/config/legacyintegration/util/Formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/HeaderField",
	"sap/m/OverflowToolbar",
	"sap/m/Button",
	"sap/m/ToolbarSpacer",
], function (Controller, MessagePopover, MessagePopoverItem, LegacyScenario, HeaderConfiguration, Formatter, Filter, FilterOperator,
	HeaderField, OverflowToolbar, Button, ToolbarSpacer) {
	"use strict";

	return Controller.extend("i2d.lo.app.zvchclfz.config.legacyintegration.controller.Config", {

		_iRequestCount: 0,

		onInit: function () {
			this.oMessagePopover = new MessagePopover({
				items: {
					id: "starterAppMessagePopover",
					path: "messageModel>/",
					template: new MessagePopoverItem({
						type: "{messageModel>type}",
						title: "{messageModel>message}",
						longtextUrl: "{messageModel>descriptionUrl}"
					})
				}
			});

			var oMessageModel = sap.ui.getCore().getMessageManager().getMessageModel();
			this.oMessagePopover.setModel(oMessageModel, "messageModel");
		},

		_getFooterForConfigUI: function () {
			if (this._oFooter) {
				return this._oFooter;
			} else {
				return this._oFooter = new OverflowToolbar({
					id: "footerToolbar",
					visible: "{= !(${appModel>/isLegacyScenario} === '')}",
					content: [
						new Button({
							id: "footerToolbar--messagePopoverButton",
							icon: "sap-icon://message-popup",
							text: "{= ${messageModel>/}.length}",
							type: sap.m.ButtonType.Emphasized,
							visible: "{= ${messageModel>/}.length > 0 }",
							press: this.handleMessagePopoverPress.bind(this)
						}),
						new ToolbarSpacer(),
						new Button({
							id: "idPrevBtn",
							text: "Previous Item",
							visible: true,
							press: "OnPrevItem"
						}),
						new Button({
							id: "idNextBtn",
							text: "Next Item",
							visible: true,
							press: "OnNextItem"
						}),						
						new Button({
							id: "footerToolbar--doneButton",
							text: "{configStartI18n>done}",
							type: {
								path: 'vchclf>EtoStatus',
								formatter: Formatter.getDoneButtonType
							}, //sap.m.ButtonType.Emphasized,
							visible: "{= ${appModel>/uiMode} === 'Edit' || ${appModel>/uiMode} === 'Create' }",
							press: this.handleDoneButtonPress.bind(this)
						}),
						new Button({
							id: "footerToolbar--cancelButton",
							text: "{= (${appModel>/uiMode} === 'Edit' || ${appModel>/uiMode} === 'Create') ? ${configStartI18n>cancel} : ${configStartI18n>close} }",
							type: "{= (${appModel>/uiMode} === 'Edit' || ${appModel>/uiMode} === 'Create') ? 'Default' : 'Emphasized' }",
							press: this.handleCancelButtonPress.bind(this)
						})
					]
				});
			}
		},

		onBeforeRendering: function () {
			if (!this._oConfigurationComponent) {
				this._oConfigurationComponentContainer = this.getView().byId("configurationComponentContainer");

				this._oConfigurationComponent = this.getOwnerComponent().createComponent({
					usage: "configurationComponent",
					id: "configurationComponent",
					settings: {
						uiMode: "{appModel>/uiMode}",
						legacyScenario: this._getIsLegacyScenario() ? LegacyScenario.Legacy : LegacyScenario.NonLegacy,
						semanticObject: "{appModel>/semanticObject}",
						objectKey: "{appModel>/objectKey}",
						draftKey: "{appModel>/draftKey}",
						headerConfiguration: new HeaderConfiguration(),
						footer: this._getFooterForConfigUI()
					},
					async: false
				});
				this._oConfigurationComponentContainer.setComponent(this._oConfigurationComponent);

				var oModel = this.getView().getModel();
				oModel.metadataLoaded().then(this._requestHeaderData.bind(this));

				if (oModel) {
					oModel.attachRequestCompleted(function () {
						this._iRequestCount--;
						var oDoneButton = this.getView().byId("doneButton");
						var oCancelButton = this.getView().byId("cancelButton");
						var Prev = this.getView().byId("idPrevBtn");
						var Next = this.getView().byId("idNextBtn");
			
						if (oDoneButton && this._iRequestCount === 0) {
							oDoneButton.setEnabled(true);
						}
						if (oCancelButton && this._iRequestCount === 0) {
							oCancelButton.setEnabled(true);
						}
						Prev.setEnabled(true);
						Next.setEnabled(true);
						
					}.bind(this));

					oModel.attachRequestSent(function () {
						this._iRequestCount++;
						var oDoneButton = this.getView().byId("doneButton");
						var oCancelButton = this.getView().byId("cancelButton");
						if (oDoneButton) {
							oDoneButton.setEnabled(false);
						}
						if (oCancelButton) {
							oCancelButton.setEnabled(false);
						}
					}.bind(this));
				}
				var oView = this.getView();
				this._oConfigurationComponent.attachHandedoverToEngineering(this._triggerGUIAction.bind(this, oView, "APPLY", null));
				this._oConfigurationComponent.attachReviewAccepted(this._triggerGUIAction.bind(this, oView, "APPLY", null));
				this._oConfigurationComponent.attachPreferredVariantSelected(this._triggerGUIAction.bind(this, oView, "APPLY", null));
			}
		},

		handleMessagePopoverPress: function (oEvent) {
			this.oMessagePopover.openBy(oEvent.getSource());
		},

		handleDoneButtonPress: function (oEvent) {
			this._oConfigurationComponent.openDoneDialog(this._triggerGUIAction.bind(this, oEvent.getSource(), "APPLY"));
		},

		handleCancelButtonPress: function (oEvent) {
			this._oConfigurationComponent.openCancelDialog(this._triggerGUIAction.bind(this, oEvent.getSource(), "CANCEL"));
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

			this._oHeaderConfiguration = new HeaderConfiguration({
				title: "",
				subtitle: ""
			});

			this._oConfigurationComponent.setHeaderConfiguration(this._oHeaderConfiguration);
			this._loadHeaderData();
		},

		_loadHeaderData: function () {
			this.getView().getModel().read("/ConfigurationHeaderFieldSet", {
				filters: [new Filter({
					filters: [new Filter({
							path: "SemanticObject",
							operator: FilterOperator.EQ,
							value1: this._getAppModel().getProperty("/semanticObject")
						}),
						new Filter({
							path: "DraftKey",
							operator: FilterOperator.EQ,
							value1: this._getAppModel().getProperty("/draftKey")
						}),
						new Filter({
							path: "ObjectKey",
							operator: FilterOperator.EQ,
							value1: this._getAppModel().getProperty("/objectKey")
						})
					],
					and: true
				})],
				success: this._updateHeaderData.bind(this),
				error: function () {
					jQuery.sap.log.error("Sales Order Headers could not be read from the backend");
				}
			});
		},

		_updateHeaderData: function (oData) {
			this.aHeaderFields = [];
			var sTitle;
			var sSubTitle;
			var oHeaderField;

			for (var i = 0; i < oData.results.length; i++) {
				var oResult = oData.results[i];

				if (oResult.Type === 6) {
					//Subtitle found
					sSubTitle = oResult.Value;
				} else if (oResult.Type === 7) {
					//Title found
					sTitle = oResult.Value;
				} else {
					oHeaderField = this._createHeaderField(oResult);
					this.aHeaderFields.push(oHeaderField);
				}
			}

			this._oHeaderConfiguration.setTitle(sTitle);
			this._oHeaderConfiguration.setSubtitle(sSubTitle);
			this._oHeaderConfiguration.setHeaderFields(this._getHeaderFields());
			this._oHeaderConfiguration.setHeaderActions(this._getHeaderActions());

			if (this._oConfigurationComponent) {
				this._oConfigurationComponent.setHeaderConfiguration(this._oHeaderConfiguration);
			}
		},

		_createHeaderField: function (oBackendEntity) {
			var oHeaderField;
			var sText;

			switch (oBackendEntity.Type) {
			case 1:
				//standard text header field => no formatting needed
				sText = oBackendEntity.Value;
				break;
			case 2:
				//ID and Description
				if (!oBackendEntity.Description) {
					sText = oBackendEntity.Value;
				} else {
					sText = this.getView().getModel("configStartI18n").getResourceBundle().getText("ID_AND_DESCR", [oBackendEntity.Description,
						oBackendEntity
						.Value
					]);
				}
				break;
			case 3:
				//Key and Subkey
				if (!oBackendEntity.Value) {
					oBackendEntity.Value = "\u2013"; //empty key is represented by a "-"
				}
				sText = this.getView().getModel("configStartI18n").getResourceBundle().getText("KEY_AND_SUBKEY", [oBackendEntity.Value,
					oBackendEntity.SubKey
				]);
				break;
			case 4:
				//Quantity and Unit of Measure
				sText = this.getView().getModel("configStartI18n").getResourceBundle().getText("VALUE_AND_UOM", [oBackendEntity.Value,
					oBackendEntity.UnitOfMeasure
				]);
				break;
			case 5:
				//Date
				var oDateFormatter = sap.ui.core.format.DateFormat.getDateInstance({
					style: "medium"
				});
				sText = oDateFormatter.format(oBackendEntity.DateField);

				break;
			}

			//create Header Field always as Text control since there cannot be different controls from the backend
			oHeaderField = new HeaderField({
				description: oBackendEntity.FieldLabel,
				properties: {
					text: sText
				},
				controlType: "Text"
			});

			return oHeaderField;
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

		_triggerGUIAction: function (oControl, sAction, oParams) {
			// we do not trigger the event during OPA tests, as the surrounding GUI isn't available and causes KARMA test issues
			if (typeof QUnit !== "undefined") {
				return;
			}
			var bIsWebGUI = this._getEmbeddedInWebGUI() === 'true';
			var oBodyArgs = {
					"action": sAction
				},
				linkId, sParams, jqSapEventLink;

			if (oParams && typeof oParams === 'object') {
				oBodyArgs.params = oParams;
				sParams = $.param(oParams);
			}

			if (bIsWebGUI) {
				//use post message channel
				parent.postMessage(JSON.stringify({
					"type": "request",
					"service": "sap.gui.triggerSAPEvent",
					"body": {
						"args": oBodyArgs
					}
				}), "*");
			} else {
				//inject SAPEVENT link and click it
				linkId = oControl.getId() + "-" + "SapEventHelperLink";
				sParams = sParams ? "?" + sParams : "";

				jqSapEventLink = $("<a id='" + linkId + "' href='SAPEVENT:" + sAction + sParams + "' style='display:none'></a>");
				jqSapEventLink.appendTo(oControl.$()).get(0).click();
				jqSapEventLink.remove();
			}
		}

	});
});