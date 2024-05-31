/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/i2d/lo/lib/zvchclfz/common/util/CommandManager",
	"sap/i2d/lo/lib/zvchclfz/common/util/Toggle",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/dao/ValuationDAO",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/util/GroupState",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/model/ViewModel",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/model/AppStateModel",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/factory/FactoryBase",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/type/GroupRepresentation",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/control/characteristic/CharacteristicValueProcessorManager",
	"sap/ui/model/Filter",
	"sap/i2d/lo/lib/zvchclfz/common/type/DescriptionMode"
], function (UIComponent, Constants, CommandManager, Toggle, ValuationDAO, GroupState, ViewModel, AppStateModel,
	FactoryBase, GroupRepresentation, CharacteristicValueProcessorManager, Filter) {
	"use strict";

	var UI_MODE = {
		CREATE: "Create",
		EDIT: "Edit",
		DISPLAY: "Display"
	};

	/**
	 * The valuation component is used to display and edit the characteristics
	 * 
	 * @class
	 * Creates and initializes a new Valuation Component with the given <code>sId</code> and
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
	 * @alias sap.i2d.lo.lib.zvchclfz.components.valuation.Component
	 * @extends sap.ui.core.UIComponent
	 */
	return UIComponent.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.Component", { /** @lends sap.i2d.lo.lib.zvchclfz.components.valuation.Component.prototype */
		metadata: {
			manifest: "json",
			properties: {
				/** The draft transaction controller is only used in smart templates. 
					When it is available the valuation component will use it to save drafts */
				draftTransactionController: {
					type: "object"
				},
				modelName: {
					type: "string"
				},

				/** The semantic object for which the valuation should be created */
				semanticObject: {
					type: "string"
				},

				/** The key of the object which should be used to create the valuation */
				objectKey: {
					type: "string"
				},

				uiMode: {
					type: "string",
					defaultValue: "Display"
				},

				/** How the characteristic groups are to be displayed */
				/** If valuation is embedded a vertical box has to be used */
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

				/** Is fired on characteristic assignment||unassignment */
				characteristicAssignmentTriggered: {},
				characteristicValueChanged: {
					parameters: {
						characteristicPath: {
							type: "String"
						}
					}
				},
				/** Is fired on successful backend response from value assignment request */
				/** Example for usage: Update the inspector component */
				characteristicChanged: {
					parameters: {
						characteristicPath: {
							type: "string"
						}
					}
				},

				/** Returns a list of all changed characteristics after a value assignment is performed */
				characteristicsChanged: {
					parameters: {
						changedCharacteristics: {
							type: "object[]"
						}
					}
				},
				
				/** 
				 * Is fired to collect from the surrounding component potentially preloaded characteristic groups
				 * 
				 * The object contains the following fields:
				 * 
				 *   iGroupId - id of the group
				 *   sInstanceId - id of the instance
				 *   sContextId - contextId
				 *   aCharacteristics - field in which already loaded characteristics must be placed
				 */
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

		/**
		 * @override
		 */
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
			CommandManager.reset();
			CharacteristicValueProcessorManager.reset();
			
			if (this.oFilterDialog) {
				this.oFilterDialog.destroy();
			}
		},

		getEmbedderName: function () {
			var sPath = this.getBindingContext(Constants.VIEW_MODEL_NAME).getPath();
			if (sPath.indexOf("ContextId='VCH") >= 0) {
				return Constants.CONFIGURATION;
			}
			if (sPath.indexOf("ContextId='CLF") >= 0) {
				return Constants.CLASSIFICATION;
			}
			return undefined;
		},

		/**
		 * @override
		 */
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
			var oBindingContext = this.getBindingContext(Constants.VIEW_MODEL_NAME);
			this.updateRootBindingContext(oBindingContext, null, true);
		},

		getUrlParameters: function () {
			var sGroupRepresentation = this.getGroupRepresentation();
			var sExpand;
			var sCustom;
			var mUrlParameters = {};

			if (sGroupRepresentation === GroupRepresentation.Embedded) {
				sExpand =
					"CharacteristicsGroups,CharacteristicsGroups/Characteristics,CharacteristicsGroups/Characteristics/DomainValues,CharacteristicsGroups/Characteristics/AssignedValues";
				sCustom = {
					search: "SkipCharacteristics=0,TopCharacteristics=30"
				};
			} else if (sGroupRepresentation === GroupRepresentation.FullScreen) {
				sExpand = "CharacteristicsGroups";
			}

			if (sExpand) {
				mUrlParameters.$expand = sExpand;
			}
			if (sCustom) {
				mUrlParameters.custom = sCustom;
			}
			return mUrlParameters;
		},

		/**
		 * sets empty data to the group state model
		 * 
		 * @function
		 * @public
		 */
		initGroupStateModel: function () {
			this._getGroupState().initStateModel();
		},

		/**
		 * sets empty data to the AppStateModel
		 * 
		 * @function
		 * @public
		 */
		initAppStateModel: function () {
			this._getAppStateModel().initModel();
		},

		preloadGroup: function (sContextId) {
			/** 
			 * Predefine group 1 in App State Model bevor the group is created via Factory, Group State is 'not loaded'
			 */
			this._getAppStateModel().setGroup(1, 1);

			var oValuationDAO = this._getValuationDAO();
			return oValuationDAO.readCharacteristicsOfGroup({
				ContextId: sContextId,
				InstanceId: 1,
				GroupId: 1
			});
		},

		/**
		 * @private
		 */
		_getValuationDAO: function () {
			if (!this._oValuationDAO) {
				this._oValuationDAO = new ValuationDAO({
					dataModel: this._getDataModel(),
					appStateModel: this._getAppStateModel(),
					groupState: this._getGroupState(),
					draftTransactionController: this.getDraftTransactionController(),
					editable: "{valuationSettings>/editable}",
					showHiddenCharacteristics: "{valuationSettings>/showHiddenCharacteristics}",
					valuationComponent: this
				});
				this._oValuationDAO.setModel(this._getValuationSettingsModel(), Constants.VALUATION_SETTINGS_MODEL_NAME);
				this._oValuationDAO.attachCharacteristicsChanged(function (oEvt) {
					
					
					this.fireCharacteristicsChanged(oEvt.getParameters());
				}.bind(this));
				
				this._oValuationDAO.attachGroupsChanged(function () {
					if (this.oFilterDialog && this.getGroupRepresentation() === GroupRepresentation.Embedded) {
						this.oFilterDialog.getController().applyBindingFilterForEmbeddedMode();
					}
				}.bind(this));
			}
			return this._oValuationDAO;
		},

		/**
		 * called from binding filter object to determine the binding object for RefreshHelper model 
		 * @public
		 */
		getGroupElementsBinding: function () {
			var aBindings = [];
			this._getGroupState().iterateStates(function (mState) {
				aBindings.push(mState.bindingInfo.binding);
			}, this);
			return aBindings;
		},

		/**
		 * Returns instance of GroupState 
		 * @return {sap.i2d.lo.lib.zvchclfz.components.valuation.util.GroupState} instance of GroupState class
		 * @private
		 * @function
		 */
		_getGroupState: function () {
			if (!this._oGroupState) {
				this._oGroupState = new GroupState();
			}
			return this._oGroupState;
		},

		/**
		 * Returns instance of the view model 
		 * @return {sap.i2d.lo.lib.zvchclfz.components.valuation.model.ViewModel} instance of ViewModel class
		 * @public
		 */
		getViewModel: function () {
			if (!this._oViewModel) {
				this._oViewModel = new ViewModel(this._getValuationDAO(), this.getModel("i18n"));
				this.setModel(this._oViewModel, Constants.VIEW_MODEL_NAME);
				this.setModel(this._oViewModel, "valueStates");
				
				// Allow to retrieve (in its own batch) and store updated group cstic count
				this.setModel(this._oViewModel, "groupCsticCounts");
				if(this._getDataModel()){
					this._getDataModel().setDeferredGroup(Constants.GROUP_CSTIC_COUNT_BATCH_GROUP);
				}
			}
			return this._oViewModel;
		},

		/**
		 * Returns instance of AppStateModel 
		 * @return {sap.i2d.lo.lib.zvchclfz.components.valuation.model.AppStateModel} instance of AppStateModel class
		 * @private
		 * @function
		 */
		_getAppStateModel: function () {
			if (!this._oAppStateModel) {
				this._oAppStateModel = new AppStateModel();
				this._oAppStateModel.initModel();
				this.setModel(this._oAppStateModel, "appStateModel");
			}
			return this._oAppStateModel;
		},

		/* Returns the VCHCF model instance which is set on the view.
		 * 
		 * @return {sap.ui.model.odata.v2.ODataModel} the model instance
		 * @private
		 */
		_getDataModel: function () {
			return this.getModel(Constants.VCHCLF_MODEL_NAME);
		},

		/**
		 * @override
		 */
		onBeforeRendering: function () {
			this._getView().getController().setViewModel(this.getViewModel());
			this._getView().getController().setGroupState(this._getGroupState());
			this._getView().getController().setValuationDAO(this._getValuationDAO());

			var sGroupRepresentation = this.getGroupRepresentation();
			this._getValuationSettingsModel().setProperty("/groupRepresentation", [sGroupRepresentation]);
			if (this.getModelName() && this.getModelName() !== Constants.VCHCLF_MODEL_NAME && !this.getModel(Constants.VCHCLF_MODEL_NAME)) {
				var oOuterModel = this.getModel(this.getModelName());
				this.setModel(oOuterModel, Constants.VCHCLF_MODEL_NAME);
				this.updateRootBindingContext(null, this.getRootBindingPath(), false);
			}

			this._getValuationSettingsModel().setProperty("/descriptionModeCharacteristics", this.getDescriptionMode());
			this._getValuationSettingsModel().setProperty("/descriptionModeValues", this.getDescriptionMode());
			this._getValuationSettingsModel().setProperty("/showPreciseDecimalNumbers", this.getShowPreciseDecimalNumbers());
			this._getValuationSettingsModel().setProperty("/valuationStepsCount", 0);
		},

		_createFilterDialog: function () {
			var oFactoryBase = this._getFactoryBase();
			var sFragmentName = "sap.i2d.lo.lib.zvchclfz.components.valuation.view.fragment.filter.FilterDialog";
			var sFragmentControllerName = "sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.filter.Filter";
			return oFactoryBase.createFragment(this._getView().getId(), sFragmentName, sFragmentControllerName);
		},

		updateGroupsProperties: function(aGroups) {
			this.getRootControl().getModel(Constants.VIEW_MODEL_NAME).updateGroupsProperties(aGroups);	
		},
		
		openFilterDialog: function (oFilterButton) {
			if (!this.oFilterDialog) {
				this.oFilterDialog = this._createFilterDialog();
				var oFilterModel = this.oFilterDialog.getController().getFilterModel();
				this.oFilterDialog.setModel(oFilterModel, "filterModel");
				this.oFilterDialog.getSource = function () {
					return oFilterButton;
				};
				this._getView().addDependent(this.oFilterDialog);
			}
			this.oFilterDialog.open();
		},

		/**
		 * Remove the backend filter
		 * @public
		 */
		removeCharacteristicFilter: function () {
			if (this.oFilterDialog) {
				this.oFilterDialog.getController().onRemoveFilter();
			}
		},

		_getFactoryBase: function () {
			if (!this._oFactoryBase) {
				this._oFactoryBase = new FactoryBase({
					controller: this,
					view: this._getView()
				});
			}
			return this._oFactoryBase;
		},

		/**
		 * Set the focus to characteristic which contains binding with the given path 
		 * @param {string} sPath: Path to a certain characteristic entity
		 * @public
		 * @function
		 */
		highlightCharacteristic: function (sPath) {
			var oControl = this._getCharacteristicFactory().getCharacteristicControlByPath(sPath);
			if (oControl && oControl.focus) {
				oControl.focus();
			}
		},

		/**
		 * Resets the view model
		 * 
		 * @function
		 * @public
		 */
		resetViewModel: function () {
			this.getViewModel().reset();
		},

		/**
		 * Update UiMode and the editable property.
		 * @param {string} sUiMode The new Ui mode.
		 * @public
		 */
		setUiMode: function (sUiMode) {
			this.setProperty("uiMode", sUiMode);

			var bEditable = sUiMode === UI_MODE.CREATE || sUiMode === UI_MODE.EDIT;
			this._getValuationSettingsModel().setProperty("/editable", bEditable);
		},

		/**
		 * Update the root binding path and refresh the context of the valuation component.
		 * @param {string} sRootBindingPath The new binding path.
		 * @public
		 */
		setRootBindingPath: function (sRootBindingPath, bForceRefresh) {
			this.setProperty("rootBindingPath", sRootBindingPath);
			if (this._getDataModel()) {
				return this.updateRootBindingContext(null, sRootBindingPath, bForceRefresh);
			} else {
				return Promise.resolve();
			}
		},

		/**
		 * @public
		 */
		setShowHiddenCharacteristics: function (bShowHiddenCharacteristics) {
			var bCurrentShowHiddenCharacteristics = this.getShowHiddenCharacteristics();
			if (bCurrentShowHiddenCharacteristics !== bShowHiddenCharacteristics) {
				this.setProperty("showHiddenCharacteristics", bShowHiddenCharacteristics);
				this._getValuationSettingsModel().setProperty("/showHiddenCharacteristics", bShowHiddenCharacteristics);
				var oBindingContext = this.getBindingContext(Constants.VIEW_MODEL_NAME);
				this.getModel("appStateModel").resetSkipTop();
				this._getValuationDAO().readCharacteristics(oBindingContext, false, true, true);
				
				this._updateFilterOnForms(bShowHiddenCharacteristics);
			}
		},

		/**
		 * Updates the binding context of the valuation component. Either oBindingContext or oBindingInfo has to be filled. If both are filled the oBindingContext is taken
		 * @public
		 * @param {sap.ui.model.Context} oBindingContext The new binding context.
		 * @param {string} sBindingPath The new binding path which is used to create a binding context.
		 * @param {boolean} bForceRefresh if the binding context has not changed, this parameter controls if a refresh is forced anyways.
		 */
		updateRootBindingContext: function (oBindingContext, sBindingPath, bForceRefresh) {
			var oAppStateModel = this._getAppStateModel();
			var oViewModel = this.getViewModel();
			var sNewRootBindingPath = oBindingContext ? oBindingContext.getPath() : sBindingPath;

			var fnAfterGroupBindingContextCreated = function(oContext){
				this.setBindingContext(oContext, Constants.VIEW_MODEL_NAME);
				this._setSelectedGroup(oContext);
				this.setValuationBusy(false);
				
				// Updated group cstic counts no longer valid if the context changes
				var oFilters = oAppStateModel.getProperty("/filters"); 
				if(oFilters && oFilters.length > 0){
					this.getModel(Constants.VIEW_MODEL_NAME).resetGroupCounts();                         
					this._getValuationDAO().readCharacteristicCountOfAllGroups(oContext);
				}
			};

			/**
			 * Retrieve Group State (loaded/not loaded) for Selected Group of new Instance from App State Model
			 * If no Group has been selected, Group 1 is default
			 */
			if (!sNewRootBindingPath) {
				return Promise.resolve();
			}
			var oNewInstance = this._getDataModel().getObject(sNewRootBindingPath);
			if (oNewInstance) {
				var sNewInstanceId = oNewInstance.InstanceId;
				var sNewSelectedGroupId = oAppStateModel.getSelectedGroup(sNewInstanceId) || 1;
				var bGroupLoaded = oAppStateModel.getGroupLoaded(sNewInstanceId, sNewSelectedGroupId) || false;
			}

			if (typeof sNewRootBindingPath === "string") {
				var oCurrentBindingContext = this.getBindingContext(Constants.VIEW_MODEL_NAME);
				if (oCurrentBindingContext) {
					var sOldRootBindingPath = oCurrentBindingContext.getPath();
				}

				var bRootBindingPathChanged = sOldRootBindingPath !== sNewRootBindingPath;
				
				this.setValuationBusy(true);
				//when the RootBindingPath has changed, the force refresh parameter can be ignored 
				//because either way a refresh has to be done
				if (bRootBindingPathChanged) {
					CommandManager.reset();
					oViewModel.setBindingPath(sNewRootBindingPath);
					if (!bGroupLoaded || !sOldRootBindingPath) {
						return oViewModel.sync(sNewSelectedGroupId).then(fnAfterGroupBindingContextCreated.bind(this));
					} else {
						return new Promise(function (fnResolve, fnReject) {
							oViewModel.createBindingContext(sNewRootBindingPath, function (oContext) {
								fnAfterGroupBindingContextCreated.call(this, oContext);
								fnResolve();
							}.bind(this));
						}.bind(this));
					}
				} else if (bForceRefresh) {
					return oViewModel.sync(null, true).then(this.setValuationBusy.bind(this, false));
				}
			} else {
				this.setValuationBusy(false);
				jQuery.sap.log.error("Valuation component: Update root binding path called wrongly");
				return Promise.resolve();
			}
		},

		setValuationBusy: function (bBusy) {
			var oValuationView = this.getRootControl();
			oValuationView.setBusyIndicatorDelay(0);
			oValuationView.setBusy(bBusy);
		},

		removeRootBindingContext: function () {
			this.setBindingContext(null, Constants.VIEW_MODEL_NAME);
			this.initGroupStateModel();
			this.initAppStateModel();
			this._getValuationDAO().init();
		},

		_setSelectedGroup: function (oContext) {
			var iInstanceId = this._getDataModel().getProperty("InstanceId", oContext);
			var iSelectedGroupId = this._getAppStateModel().getSelectedGroup(iInstanceId);
			var oGroupTabBar = this._getView().byId("groupVBox").getItems()[0];
			if (oGroupTabBar && oGroupTabBar.getMetadata().getName() === "sap.m.IconTabBar") {
				var aGroups = oGroupTabBar.getItems();
				if (aGroups.length > 0) {
					if (iSelectedGroupId) {
						aGroups.forEach(function (oGroup) {
							if (oGroup.getBindingContext("view").getObject().GroupId === iSelectedGroupId) {
								oGroupTabBar.setSelectedKey(oGroup.getId());
							}
						});
					} else {
						oGroupTabBar.setSelectedKey(aGroups[0].getId());
					}
				}
			}
		},

		/**
		 * @param {String} sSemanticObject - Override Setter for metadata "semanticObject"
		 * @public
		 */
		setSemanticObject: function (sSemanticObject) {
			this.setProperty("semanticObject", sSemanticObject);
			this._getValuationSettingsModel().setProperty("/semanticObject", sSemanticObject);
		},

		/**
		 * @param {String} sObjectKey - Override Setter for metadata "objectKey"
		 * @public
		 */
		setObjectKey: function (sObjectKey) {
			this.setProperty("objectKey", sObjectKey);
			this._getValuationSettingsModel().setProperty("/objectKey", sObjectKey);
		},

		/**
		 * Update the type of characteristic label text.
		 * @param {string} sType The new description type for a characteristic.
		 * @public
		 * @function
		 */
		setDescriptionMode: function (sType) {
			this.setProperty("descriptionMode", sType);
			this._getValuationSettingsModel().setProperty("/descriptionModeCharacteristics", sType);
			this._getValuationSettingsModel().setProperty("/descriptionModeValues", sType);
		},

		/**
		 * Update the setting for precise decimal numbers
		 * @param {boolean} bShowPreciseDecimalNumbers The new setting for showing precise decimal numbers or not
		 * @public
		 * @function
		 */
		setShowPreciseDecimalNumbers: function (bShowPreciseDecimalNumbers) {
			this.setProperty("showPreciseDecimalNumbers", bShowPreciseDecimalNumbers);
			this._getValuationSettingsModel().setProperty("/showPreciseDecimalNumbers", bShowPreciseDecimalNumbers);
		},

		/**
		 * Sets number of configuration groups to valuation settings model
		 * @param {integer} iGroupCount: represents number of characteristic groups
		 * @public
		 * @function
		 */
		setGroupCount: function (iGroupCount) {
			this._getValuationSettingsModel().setProperty("/groupCount", iGroupCount);
			this._getValuationSettingsModel().setProperty("/showGroupTitle", iGroupCount > 1);
			this._getValuationSettingsModel().setProperty("/showNoCharacteristicText", !iGroupCount);
		},

		_getValuationSettingsModel: function () {
			return this.getModel(Constants.VALUATION_SETTINGS_MODEL_NAME);
		},

		/**
		 * Returns instance of Control Selection Factory
		 * @return {sap.i2d.lo.lib.zvchclfz.components.valuation.util.CharacteristicFactory} instance of Control Selection Factory
		 * @private
		 * @function
		 */
		_getCharacteristicFactory: function () {
			var oController = this.getAggregation("rootControl").getController();
			return oController.getCharacteristicFactory();
		},

		/**
		 * Returns instance of Control Valuation XML View
		 * @return {sap.i2d.lo.lib.zvchclfz.components.valuation.view.Valuation} instance of Valuation XML View
		 * @private
		 * @function
		 */
		_getView: function () {
			return this._oView;
		},
		
		/**
		 * Sets updated filter on Form Bindings on all groups
		 * @private
		 * @function
		 */
		 _updateFilterOnForms: function (bSetIsHiddenFilter) {
		 	// refresh the filter for hidden characteristics for all groups which have been loaded (in the group state)
				// this is necessary for dynamic hiding of characteristics, because
				// they are transported to the UI and need to be hidden in the UI
				// statically hidden characteristics will be filtered in the backend
				//var bShowHiddenCharacteristics = this.getModel(Constants.VALUATION_SETTINGS_MODEL_NAME).getProperty("/showHiddenCharacteristics");
				var oGroupBindings = this.getGroupElementsBinding();
				var aFilters = [];

				if(!bSetIsHiddenFilter) {
					aFilters.push(new Filter({
				      path: "IsHidden",
				      operator: 'EQ',
				      value1: bSetIsHiddenFilter
				    }));
				}
				
				for(var i = 0; i < oGroupBindings.length; i++) {
					oGroupBindings[i].filter(aFilters);
				}
		 }

	});
});
