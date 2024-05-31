/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/factory/HeaderFactory",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/dao/ConfigurationDAO",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/controller/fragment/PricingRecords",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/controller/fragment/VariantMatching",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/controller/fragment/ChangeDocuments",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/factory/FactoryBase",
	"sap/i2d/lo/lib/zvchclfz/common/util/CommandManager",
	"sap/base/strings/formatMessage",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/formatter/InconsistencyInformationFormatter",
	"sap/m/GroupHeaderListItem",
	"sap/base/Log"
	/**
	 * The controller for the configuration view.
	 * 
	 * @class
	 
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.vchclf.components.configuration.controller.Configuration
	 * @extends sap.ui.core.mvc.Controller
	 */
], function (Controller, JSONModel, Constants, HeaderFactory, ConfigurationDAO,
	PricingRecords, VariantMatching, ChangeDocuments, FactoryBase, CommandManager, formatMessage, InconsistencyInformationFormatter,
	GroupHeaderListItem, Log, MessageToast) {
	"use strict";

	return Controller.extend("sap.i2d.lo.lib.zvchclfz.components.configuration.controller.Configuration", { /** @lends sap.i2d.lo.lib.vchclf.components.configuration.controller.Configuration.prototype */
			_oHeaderFactory: null,
			_oSettingsDialog: null,

			oInconsistencyInformationFormatter: InconsistencyInformationFormatter,

			getFormatter: function (sFormatterName) {
				return this["o" + sFormatterName];
			},

			getGroupHeader: function (oGroup) {
				var sI18nText = this._getResourceBundle().getText("INCON_DETAILED_INFO_CSTIC_LIST_LABEL");
				var oGroupHeaderListItem = new GroupHeaderListItem({
					title: formatMessage(sI18nText, [oGroup.key])
				});
				oGroupHeaderListItem.addStyleClass("sapVchclfGroupHeaderListItem");
				return oGroupHeaderListItem;
			},

			/**
			 * @private
			 */
			_getResourceBundle: function () {
				if (!this.vchI18nResourceBundle) {
					this.vchI18nResourceBundle = this.getView().getModel("vchI18n").getResourceBundle();
				}
				return this.vchI18nResourceBundle;
			},

			/**
			 * @private
			 */
			_getConfigurationDAO: function () {
				if (!this._oConfigurationDAO) {
					this._oConfigurationDAO = new ConfigurationDAO({
						dataModel: this.getView().getModel(Constants.VCHCLF_MODEL_NAME)
					});
				}
				return this._oConfigurationDAO;
			},

			/**
			 * @private
			 */
			getFactoryBase: function () {
				if (!this._oFactoryBase) {
					this._oFactoryBase = new FactoryBase({
						controller: this,
						view: this.getView()
					});
				}
				return this._oFactoryBase;
			},

			/**
			 * @private
			 */
			_getConfigurationInstancePath: function () {
				return this.getOwnerComponent().getConfigurationInstancePath();
			},

			/**
			 * creates dialog for leaving configuration and attaches event handler
			 * 
			 * @param {function} onOKButtonPress: event handler for exit dialog
			 * @param {string} sFragmentName: name of dialog fragment
			 * @return {sap.m.Dialog} returns an instance of exit dialog
			 * @private
			 * @function
			 */
			_createExitConfigurationDialog: function (sFragmentId, sFragmentName, onOKButtonPress) {
				var oView = this.getView();
				var oDialog = sap.ui.xmlfragment(sFragmentId, sFragmentName, this);
				oView.addDependent(oDialog);
				var oOKButton = oDialog.getAggregation("beginButton");
				oOKButton.attachPress(onOKButtonPress);

				return oDialog;
			},

			/* Returns the VCHCF model instance which is set on the view.
			 * 
			 * @return {sap.ui.model.odata.v2.ODataModel} the model instance
			 * @private
			 */
			_getDataModel: function () {
				return this._getModel(Constants.VCHCLF_MODEL_NAME);
			},

			/**
			 * @private
			 */
			_getModel: function (sModelName) {
				return this.getView().getModel(sModelName);
			},

			/**
			 * @private
			 */
			_getLayout: function () {
				return this.getView().byId("layout");
			},

			/**
			 * @private
			 */
			_openInconsistencyPopover: function (oOpenBySource) {
				if (this._oPopover) {
					this._oPopover.destroy();
				}

				var oFactoryBase = this.getFactoryBase();
				var sFragmentName = "sap.i2d.lo.lib.zvchclfz.components.configuration.view.fragment.InconsistencyPopover";

				this._oPopover = oFactoryBase.createFragment(this.getView().getId(), sFragmentName, this);

				this._oPersonalizationDAO.getData().then(function (oSettingsData) {
					this._oPopover.setModel(new JSONModel(oSettingsData), "vchSettings");
				}.bind(this));

				this.getView().addDependent(this._oPopover);
				var oBindingContext = this.getOwnerComponent().getBindingContext("vchclf");
				this._oPopover.setBindingContext(oBindingContext, "vchclf");

				this._oPopover.openBy(oOpenBySource);
			},

			_createChangeDocumentsDialog: function () {
				var oFactoryBase = this.getFactoryBase();
				var sFragmentName = "sap.i2d.lo.lib.zvchclfz.components.configuration.view.fragment.ChangeDocumentsDialog";
				var sFragmentControllerName = "sap.i2d.lo.lib.zvchclfz.components.configuration.controller.fragment.ChangeDocuments";
				return oFactoryBase.createFragment(this.getView().getId(), sFragmentName, sFragmentControllerName);
			},

			/** Lifecycle event. Called upon initialization of the View.
			 * @override
			 * @instance
			 * @private
			 */
			onInit: function () {
				var oViewModel = new JSONModel({});
				this.getView().setModel(oViewModel, "viewModel");

				var oConstantsModel = new JSONModel({
					"INCONSISTENCY_INFORMATION": {
						"MULTI_DOCU": Constants.INCONSISTENCY_INFORMATION.MULTI_DOCU,
						"SINGLE_DOCU": Constants.INCONSISTENCY_INFORMATION.SINGLE_DOCU,
						"NO_DOCU": Constants.INCONSISTENCY_INFORMATION.NO_DOCU
					}
				});
				this.getView().setModel(oConstantsModel, "constants");

				this._oHeaderFactory = new HeaderFactory({
					controller: this
				});
				this.getView().setModel(CommandManager.getModel(), "commandState");
			},

			/** Lifecycle event. Called upon desctuction of the View.
			 * @override
			 * @instance
			 * @private
			 */
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
					var oSharedMatchingVariantsTableTemplate = this.getView().byId("MatchingVariantsTableTemplate");
					oSharedMatchingVariantsTableTemplate.destroy();
					this._oVariantMatchingController.destroy();
				}
				if (this._oFactoryBase) {
					this._oFactoryBase.destroy();
				}
				this._oHeaderFactory.destroy();
			},

			/** Lifecycle event. Used for injecting structure panel and inspector components.
			 * @override
			 * @instance
			 * @private
			 */
			onAfterRendering: function () {
				// inject structure panelonInconsistencyInformationRequested
				this.getView()
					.byId("structurePanelComponentContainer")
					.setComponent(this.getOwnerComponent().getStructurePanelComponent());

				// inject inspector
				this.getView()
					.byId("inspectorComponentContainer")
					.setComponent(this.getOwnerComponent().getInspectorComponent());
			},

			/**
			 * event handler for settings button of header actions into dynamic page
			 * 
			 * @param {sap.ui.base.Event} oEvent: An Event object consisting of an id, a source and a map of parameters
			 * @public
			 * @function
			 */
			onSettings: function (oEvent) {
				if (this._oPersonalizationDAO) {
					if (!this._oSettingsDialog) {
						jQuery.sap.require("sap.i2d.lo.lib.zvchclfz.components.configuration.control.SettingsDialog");
						this._oSettingsDialog = new sap.i2d.lo.lib.zvchclfz.components.configuration.control.SettingsDialog(this.getView().getId() +
							"--settingsDialog", {
								personalizationDAO: this._oPersonalizationDAO,
								//temporary property => exceptional case to identify the embedding app for the settings
								embeddingMode: this.getOwnerComponent().getEmbeddingMode()
							});
						this.getOwnerComponent().attachConfigurationContextReloaded(this._oSettingsDialog.close.bind(this._oSettingsDialog));
						this.getView().addDependent(this._oSettingsDialog);
					}
					this._oSettingsDialog.open();
				}
			},

			setPersonalizationDAO: function (oPersonalizationDAO) {
				this._oPersonalizationDAO = oPersonalizationDAO;
			},

			/**
			 * event handler for toggle inspector button of header actions into dynamic page
			 * 
			 * @param {sap.ui.base.Event} oEvent: An Event object consisting of an id, a source and a map of parameters
			 * @public
			 * @function
			 */
			onToggleSidePanel: function (oEvent) {
				var oLayout = this._getLayout();
				oLayout.setShowRightContent(!oLayout.getShowRightContent());
			},

			/**
			 * event handler for toggle structure panel button of header actions into dynamic page
			 * 
			 * @param {sap.ui.base.Event} oEvent: An Event object consisting of an id, a source and a map of parameters
			 * @public
			 * @function
			 */
			onToggleLeftPanel: function (oEvent) {
				var oLayout = this._getLayout();
				oLayout.setShowLeftContent(!oLayout.getShowLeftContent());
			},

			/**
			 * factory for creating title actions for dynamic page title
			 * supported libraries: sap.m
			 * 
			 * @param {string} sIdPrefix: generated id
			 * @param {sap.ui.model.Context} oContext: is a pointer to an object in the model data
			 * @return {sap.ui.core.Control} returns a control instance 
			 * @public
			 * @function
			 */
			createAction: function (sIdPrefix, oContext) {
				return this._oHeaderFactory.createAction(sIdPrefix, HeaderFactory.getHeaderFieldFromContext(oContext));
			},

			/**
			 * factory for creating content for dynamic page header
			 * supported libraries: sap.m
			 * 
			 * @param {string} sIdPrefix: generated id
			 * @param {sap.ui.model.Context} oContext: is a pointer to an object in the model data
			 * @return {sap.ui.layout.VerticalLayout} returns a control instance
			 * @public
			 * @function
			 */
			createField: function (sIdPrefix, oContext) {
				return this._oHeaderFactory.createField(sIdPrefix, HeaderFactory.getHeaderFieldFromContext(oContext));
			},

			/**
			 * opens dialog control to visualize the pricing records
			 * 
			 */
			onPricingRecords: function () {
				if (!this._oPricingRecordsController) {
					this._oPricingRecordsController = new PricingRecords({
						view: this.getView()
					});
				}
				this._oPricingRecordsController.openDialog();
			},

			/**
			 * opens dialog control to list change documents
			 * 
			 */
			onOpenChangeDocumentsDialog: function () {
				var oBindingContext = this.getView().getBindingContext(Constants.VCHCLF_MODEL_NAME);
				if (this._oChangeDocumentsDialog) {
					this._oChangeDocumentsDialog.destroy();
				}
				this._oChangeDocumentsDialog = this._createChangeDocumentsDialog();
				this._oChangeDocumentsDialog.setBusyIndicatorDelay(0);
				var oBindingContextForOrigin = this.getView().getModel("vchclf").createBindingContextForOriginModel(oBindingContext);
				this._oChangeDocumentsDialog.setBindingContext(oBindingContextForOrigin, "vchclf_bind_only");
				this.getView().addDependent(this._oChangeDocumentsDialog);
				this._oChangeDocumentsDialog.setModel(new JSONModel(), "vchSettings");

				this._oPersonalizationDAO.getData().then(function (oSettingsData) {
					this._oChangeDocumentsDialog.getModel("vchSettings").setData(oSettingsData);
					this._oChangeDocumentsDialog.open();
				}.bind(this));
			},

			/**
			 * event handler for inconsistency information popover to be shown
			 */
			onInconsistencyInformationRequested: function (oEvent) {
				this._openInconsistencyPopover(oEvent.getSource());
			},

			onStatusClicked: function (oEvent) {
				this._openInconsistencyPopover(oEvent.getSource());
			},

			/**
			 * event handler for header button of header actions 
			 */
			onLockConfiguration: function (oEvent) {
				var oButton = oEvent.getSource();
				var oText = this._getResourceBundle().getText("BTN_TEXT_LOCK_CONFIGURATION");
				if (oButton.getText() === oText) {
					this.getOwnerComponent().lockConfiguration();
				} else {
					this.getOwnerComponent().unlockConfiguration();
				}
			},

			/**
			 * gets done dialog instance
			 * 
			 * @return {sap.m.Dialog} returns an instance of done dialog
			 * @public
			 * @function
			 */
			getDoneConfigurationDialog: function () {
				return this.oDoneConfigurationDialog;
			},

			/**
			 * sets new done dialog instance
			 * 
			 * @param {sap.m.Dialog} oDialog: an instance of done dialog
			 * @public
			 * @function
			 */
			setDoneConfigurationDialog: function (oDialog) {
				this.oDoneConfigurationDialog = oDialog;
			},

			/**
			 * gets status changed dialog instance
			 * 
			 * @return {sap.m.Dialog} returns an instance of status changed dialog
			 * @public
			 * @function
			 */
			getStatusChangedConfigurationDialog: function () {
				return this.oStatusChangedConfigurationDialog;
			},

			/**
			 * sets new status changed dialog instance
			 * 
			 * @param {sap.m.Dialog} oDialog: an instance of status changed dialog
			 * @public
			 * @function
			 */
			setStatusChangedConfigurationDialog: function (oDialog) {
				this.oStatusChangedConfigurationDialog = oDialog;
			},

			/**
			 * gets cancel dialog instance
			 * 
			 * @return {sap.m.Dialog} returns an instance of cancel dialog
			 * @public
			 * @function
			 */
			getCancelConfigurationDialog: function () {
				return this.oCancelConfigurationDialog;
			},

			/**
			 * sets new cancel dialog instance
			 * 
			 * @param {sap.m.Dialog} oDialog: an instance of cancel dialog
			 * @public
			 * @function
			 */
			setCancelConfigurationDialog: function (oDialog) {
				this.oCancelConfigurationDialog = oDialog;
			},

			/**
			 * opens done dialog depending on configuration status
			 * 
			 * @param {function} fnCallback: event handler for ok button of done dialog
			 * @public
			 * @function
			 */
			openDoneDialog: function (fnCallback) {
				//validate the complete model
				var oView = this.getView();
				var oBindingContext = oView.getBindingContext("vchclf");
				var sContextId = oBindingContext.getObject().ContextId;
				var oConfigurationDAO = this._getConfigurationDAO();

				oView.setBusyIndicatorDelay(0);
				oView.setBusy(true);

				//remember last status before validation to compare status changes by on save custom logic
				var sLastStatusType = oBindingContext.getObject().StatusType;
				var sLastStatusDescription = oBindingContext.getObject().StatusDescription;

				oConfigurationDAO.validateConfiguration(sContextId).then(function (aResult) {
					var oValidateResult = aResult[0];
					oView.setBusy(false);

					var sFragmentName = "sap.i2d.lo.lib.zvchclfz.components.configuration.view.fragment.DoneConfigurationDialog";
					var onOKButtonPress = function () {
						var oConfComponent = this.getOwnerComponent();
						var oPromise = oConfComponent.lockConfiguration();

						oPromise.then(function () {
							this.getDoneConfigurationDialog().close();
							if (fnCallback) {
								fnCallback();
							}
						}.bind(this));

						oPromise.catch(function (oError) {
							this.getDoneConfigurationDialog().close();
							oConfComponent.openErrorDialog(oError);
						}.bind(this));
					}.bind(this);

					var onLeaveLockedStatusChangedDialog = function () {
						this.getStatusChangedConfigurationDialog().close();
						if (fnCallback) {
							fnCallback();
						}
					}.bind(this);

					if (!this.getDoneConfigurationDialog()) {
						this.setDoneConfigurationDialog(this._createExitConfigurationDialog("doneDialog", sFragmentName, onOKButtonPress));
					}

					if (oValidateResult.ValidateConfiguration && oValidateResult.ValidateConfiguration.Success) {
						if (oBindingContext && oBindingContext.getProperty) {
							var sConfStatusType = oBindingContext.getProperty("StatusType");
							switch (sConfStatusType) {
							case Constants.CONFIGURATION_STATUS_TYPE.LOCKED:
								if (sLastStatusType !== sConfStatusType) {
									//status has changed during on save custom logic
									//=> inform user about change

									//create model for dialog to show old and new status type description
									//only create the model here because this is an exceptional case and does not happen often
									var oStatusChangedDialogModel = new JSONModel({
										"lastStatusTypeDescription": sLastStatusDescription,
										"newStatusTypeDescription": oBindingContext.getProperty("StatusDescription")
									});
									this.getView().setModel(oStatusChangedDialogModel, Constants.STATUS_CHANGED_DIALOG_MODEL_NAME);

									//create dialog and open it
									if (!this.getStatusChangedConfigurationDialog()) {
										this.setStatusChangedConfigurationDialog(this._createExitConfigurationDialog("statusChangedDialog",
											"sap.i2d.lo.lib.zvchclfz.components.configuration.view.fragment.StatusChangedDialog", onLeaveLockedStatusChangedDialog));
									}
									this.getStatusChangedConfigurationDialog().open();
								} else if (fnCallback) {
									// If the status was already locked, we execute
									// the callback similar to default case 
									fnCallback();
								}
								break;
							case Constants.CONFIGURATION_STATUS_TYPE.INCOMPLETE:
							case Constants.CONFIGURATION_STATUS_TYPE.INCONSISTENT:
								this.getDoneConfigurationDialog().open();
								break;
							default:
								if (fnCallback) {
									fnCallback();
								}
								break;
							}
						}
					} else {
						this.getDoneConfigurationDialog().open();
					}
				}.bind(this));
			},

			/**
			 * opens cancel dialog in edit mode
			 * 
			 * @param {function} fnCallback: event handler for ok button of cancel dialog
			 * @public
			 * @function
			 */
			openCancelDialog: function (fnCallback) {
				var sUiMode = this.getOwnerComponent().getUiMode();

				if (sUiMode === "Edit" || sUiMode === "Create") {
					var sFragmentName = "sap.i2d.lo.lib.zvchclfz.components.configuration.view.fragment.CancelConfigurationDialog";
					var onOKButtonPress = function () {
						this.getCancelConfigurationDialog().close();
						if (fnCallback) {
							fnCallback();
						}
					}.bind(this);

					if (!this.getCancelConfigurationDialog()) {
						this.setCancelConfigurationDialog(this._createExitConfigurationDialog("cancelDialog", sFragmentName, onOKButtonPress));
					}
					this.getCancelConfigurationDialog().open();
				} else if (sUiMode === "Display" && fnCallback instanceof Function) {
					fnCallback();
				}
			},

			/**
			 * event handler for cancel button of exit dialog
			 * 
			 * @param {sap.ui.base.Event} oEvent: An Event object consisting of an id, a source and a map of parameters
			 * @public
			 * @function
			 */
			onCancelExitDialog: function (oEvent) {
				var oDialog = oEvent.getSource().getParent();
				oDialog.close();
			},

			/**
			 * event handler for unlock and continue work in status changed dialog
			 * 
			 * @param {sap.ui.base.Event} oEvent: An Event object consisting of an id, a source and a map of parameters
			 * @public
			 * @function
			 */
			onUnlockStatusChangedDialog: function (oEvent) {
				var oConfComponent = this.getOwnerComponent();
				var oPromise = oConfComponent.unlockConfiguration();

				oPromise.then(function () {
					this.getStatusChangedConfigurationDialog().close();
				}.bind(this));

				oPromise.catch(function (oError) {
					this.getStatusChangedConfigurationDialog().close();

					oConfComponent.openErrorDialog(oError);
				}.bind(this));
			},

			onVariantMatching: function () {
				if (!this._oVariantMatchingController) {
					this._oVariantMatchingController = new VariantMatching({
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
				var oFactoryBase = this.getFactoryBase();
				var sFragmentName = "sap.i2d.lo.lib.zvchclfz.components.configuration.view.fragment.SwitchToETODialog";
				var onOKButtonPress = function () {
					var oView = this.getView();
					oView.setBusyIndicatorDelay(0);
					oView.setBusy(true);
					var oBindingContext = oView.getBindingContext("vchclf");
					var sContextId = oBindingContext.getObject().ContextId;
					var oConfigurationDAO = this._getConfigurationDAO();
					oConfigurationDAO.switchToETO(sContextId).then(function () {
						oView.setBusy(false);
						this.getOwnerComponent().reload();
					}.bind(this));
					this._oSwitchToETODialog.close();
				};
				var onCancelButtonPress = function () {
					this._oSwitchToETODialog.close();
				};

				this._oSwitchToETODialog = oFactoryBase.createFragment(this.getView().getId(), sFragmentName, this);
				var oOKButton = this._oSwitchToETODialog.getAggregation("beginButton");
				oOKButton.attachPress(onOKButtonPress.bind(this));
				var oCancelButton = this._oSwitchToETODialog.getAggregation("endButton");
				oCancelButton.attachPress(onCancelButtonPress.bind(this));
				this.getView().addDependent(this._oSwitchToETODialog);
				this._oSwitchToETODialog.open();
			},

			onCreateVariant: function () {

				var oView = this.getView();
				var oBindingContext = oView.getBindingContext("vchclf");
				var sContextId = oBindingContext.getObject().ContextId;

				var fnResetBusy = function () {
					oView.setBusy(false);
				};
				var fnCreationFailed = function () {
					fnResetBusy();
					var sErrorText = this._getResourceBundle().getText("FAILED_TO_CREATE_VARIANT");
					this.getOwnerComponent().openErrorDialog({
						message: sErrorText
					});
				}.bind(this);

				var fnUserDialogForCreatedWithoutPricing = function (fnCallback) {
					var sErrorText = this._getResourceBundle().getText("VARIANT_CREATED_WITHOUT_PRICING");
					this.getOwnerComponent().openErrorDialog({
						message: sErrorText
					}, fnCallback);
				}.bind(this);

				// Create Variant
				var configurationDAO = this._getConfigurationDAO();
				oView.setBusy(true);

				configurationDAO.createFullyMatchingProductVariant(sContextId).then(function (oResponse) {
					var sNewlyCreatedProductVariant = oResponse.CreateFullyMatchingProductVariant.ProductKey.trim();
					if (sNewlyCreatedProductVariant) {
						// Set Variant to Sales Order
						var oVariant = {
							ContextId: sContextId,
							InstanceId: "", // not used
							Product: sNewlyCreatedProductVariant,
							Plant: "", // not used
							Cuobj: oResponse.CreateFullyMatchingProductVariant.Cuobj
						};
						var fnSetVariantIntoSalesOrder = function () {
							configurationDAO.setPreferredVariant(oVariant).then(function (oResponseInner) {
								fnResetBusy();
								this.getView().getController().getOwnerComponent().firePreferredVariantSelected();
							}.bind(this), fnResetBusy);
						}.bind(this);
						if (oResponse.CreateFullyMatchingProductVariant.PricingError) {
							// Give message that variant has been reated with error and use it as selected variant:
							fnUserDialogForCreatedWithoutPricing(fnSetVariantIntoSalesOrder);
						} else {
							// Variant can directly be used (without separate user interaction)
							fnSetVariantIntoSalesOrder();
						}
					} else {
						fnCreationFailed();
					}
				}.bind(this), fnCreationFailed);
			},

			// currently not used --> to be clarified with PM colleagues, as navigation to ProductMaster via draftUUID is currently not possible
			_navigateToMaterialMaster: function (sProductKey) {
				var oNavigationService = sap.ushell.Container.getService('CrossApplicationNavigation');
				var sHash = oNavigationService.hrefForExternal({
					target: {
						semanticObject: Constants.SEM_OBJ_MATERIAL,
						action: 'manage'
					},
					params: {
						Material: sProductKey,
						preferredMode: "edit"
					}
				});
				var sUrl = sap.ushell.Container.getFLPUrl() + "#" + sHash;
				sap.m.URLHelper.redirect(sUrl, true);
			},

			/**
			 * event handler for undo button of header actions into object page
			 * 
			 * @param {sap.ui.base.Event} oEvent: An Event object consisting of an id, a source and a map of parameters
			 * @public
			 * @function
			 */
			onUndo: function (oEvent) {
				CommandManager.undo();
			},

			/**
			 * event handler for redo button of header actions into object page
			 * 
			 * @param {sap.ui.base.Event} oEvent: An Event object consisting of an id, a source and a map of parameters
			 * @public
			 * @function
			 */
			onRedo: function (oEvent) {
				CommandManager.redo();
			},

			/**
			 * execute the filter for the not initial filter criteria
			 * @public
			 */
			onSearch: function (oEvent) {
				// this._getFilterObject().executeBindingFilter();
			},

			/**
			 * opens the dialog popup in which the filter criteria can be selected and the filter can be executed
			 * @public
			 */
			onOpenFilterDialog: function (oEvent) {
				var oFilterButton = oEvent.getSource();
				this.getOwnerComponent().getValuationComponent().openFilterDialog(oFilterButton);
			},

			factoryForInconsistencyInfoDetails: function (sId, oDetail) {
				var oText = new sap.m.Text({
					id: sId,
					text: "InstanceId: " + oDetail.getProperty("InstanceId") + ", CsticId: " + oDetail.getProperty("CsticName") + ", ObjectDepId: " +
						oDetail.getProperty("DependencyId")
				});
				oText.addStyleClass("sapUiSmallMarginEnd");
				oText.addStyleClass("sapUiTinyMarginBottom");
				return oText;
			},

			onInconsistencyInfoDetailTextForCsticPress: function (oEvent) {
				var oSource = oEvent.getSource();
				var oData = oSource.getBindingContext(Constants.VCHCLF_MODEL_NAME).getObject();
				var oCsticKey = {
					ContextId: oData.ContextId,
					InstanceId: oData.InstanceId.trim(),
					GroupId: 0, //entity key field must not be null. Group Id is not relevant for characteristic details.
					CsticId: oData.CsticId
				};
				var sCsticPath = this._getConfigurationDAO()
					.createKey("/CharacteristicSet", oCsticKey);

				this.getOwnerComponent()
					.inspectCharacteristic(
						sCsticPath,
						true,
						oCsticKey);
			},

			onDependencyClicked: function (oEvent) {
				var oData = oEvent.getSource().getBindingContext(Constants.VCHCLF_MODEL_NAME).getObject();
				this.getOwnerComponent().inspectObjectDependency(oData.ObjectDependency);
			},

			// onPreviousItem: function (oEvent) {},

			// onNextItem: function (oEvent) {},

		onPrintPreview: function () {

			// if (!this._oDialog) {

				this._oDialog = sap.ui.xmlfragment("sap.i2d.lo.lib.zvchclfz.components.configuration.view.fragment.FileDisplay", this);

			// }

			this._oDialog.open();

		},

		onCloseDialog: function () {

			// this.byId("imgDialog").close();

			if (this._oDialog) {

				var oDialogS = this._oDialog;

				oDialogS.close();
			}
		},
		handleUploadComplete: function (oEvent) {
			var sResponse = oEvent.getParameter("response"),
				iHttpStatusCode = parseInt(/\d{3}/.exec(sResponse)[0]),
				sMessage;

			if (sResponse) {
				sMessage = iHttpStatusCode === 200 ? sResponse + " (Upload Success)" : sResponse + " (Upload Error)";
				MessageToast.show(sMessage);
			}
		},
		handleUploadPress: function () {
			var oFileUploader = this.byId("fileUploader");
			oFileUploader.checkFileReadable().then(function () {
				oFileUploader.upload();
			}, function (error) {
				MessageToast.show("The file cannot be read. It may have changed.");
			}).then(function () {
				oFileUploader.clear();
			});
		},

			onGraderInfo: function (oEvent) {}


	});
}, true);