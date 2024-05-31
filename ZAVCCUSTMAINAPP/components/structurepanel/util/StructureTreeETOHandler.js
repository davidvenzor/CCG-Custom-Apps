/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/EventProvider",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/StructurePanelModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/NavigationManager",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/common/util/Logger",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/model/StructureTreeModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/ODataModelHelper",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/i18n",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/FeatureToggle",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/dao/BOMNodeSetDAO",
	"sap/i2d/lo/lib/zvchclfz/common/util/AppEvents"
	// eslint-disable-next-line max-params
], function (JSONModel, Filter, FilterOperator, EventProvider, StructurePanelModel,
	NavigationManager, Constants, Logger, StructureTreeModel, ODataModelHelper, i18n, FeatureToggle, BOMNodeSetDAO, AppEvents) {
	"use strict";
	
	var REEXPLODE_BOM_DIALOG = "sap.i2d.lo.lib.zvchclfz.components.structurepanel.fragment.ReexplodeBOMDialog";
	var REEXPLODE_BOM_DIALOG_CONTROLLER = "sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.ReexplodeBOM";
	var EXPLOSION_ERROR_DIALOG = "sap.i2d.lo.lib.zvchclfz.components.structurepanel.fragment.ExplosionErrorDialog";
	var EXPLOSION_ERROR_DIALOG_CONTROLLER = "sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.ExplosionError";
	var BOM_ITEM_DIALOG = "sap.i2d.lo.lib.zvchclfz.components.structurepanel.fragment.BOMItemDialog";
	var BOM_ITEM_DIALOG_CONTROLLER = "sap.i2d.lo.lib.zvchclfz.components.structurepanel.dialog.BOMItemDialog";
	var INSERT_BOM_ITEM = "insertBOMItem";
	var UPDATE_BOM_ITEM = "updateBOMItem";
	var DELETE_BOM_ITEM = "deleteBOMItem";

	return {
		/**
		 * Creates Order BOM for give BOM item if no one exist and triggers navigation to Order BOM App
		 * @param {object} oBOMItemData: data of BOM item
		 * @private
		 * @function
		 */
		_navigateToBOMApp: function (oBOMItemData) {
			var oView = this.getView();
			var aPromise = [];
			var fnCreateOrderBOM = function () {
				aPromise.push(BOMNodeSetDAO.createOrderBOM(oBOMItemData.InstanceId.trim()));
			};
			var fnExplodeBOMWithoutModelUpdate = function () {
				aPromise.push(StructureTreeModel.explodeBOMWithoutRead());
			};
			var fnReadBOMHeader = function (){
				aPromise.push(BOMNodeSetDAO.readBOMNodeWithHeader(StructurePanelModel.getConfigurationContextId(), oBOMItemData.ComponentId));
			};
			
			oView.setBusy(true);
			
			if (oBOMItemData.FixateState === Constants.FixateState.FIXATE_ALLOWED &&
					FeatureToggle.getETOImplicitOBOMCreateEnabled()) {
				fnCreateOrderBOM();
				StructurePanelModel.setForceBOMExplosion(true);
				fnExplodeBOMWithoutModelUpdate();
			}
			fnReadBOMHeader();
			
			Promise.all(aPromise).then(function(aOData) {
				oView.setBusy(false);
				var oBOMNodeWithHeaderData = aOData[2] || aOData[0];
				NavigationManager.navigateToBOMApp(oBOMNodeWithHeaderData);
			}).catch(function () {
					oView.setBusy(false);
				});
		},
		/**
		 * Gets the dialog model.
		 * @returns {sap.ui.model.JSONModel} dialog model
		 * @protected
		 * @function
		 */
		_getBOMItemDialogModel: function () {
			return this._oBOMItemDialogModel;
		},
		/**
		 * Updates dialog model with backend results.
		 * @param {object} oBOMItemCategory: OData result from the backend
		 * @private
		 * @function
		 */
		_updateBOMItemDialogModel: function (oBOMItemCategory) {
			var oModel = this._oBOMItemDialog.getModel(Constants.BOMItemDialogModel);
			var aResults = oBOMItemCategory.results;
			var iDefaultBOMItemCategorySelection = 0;

			// sets default selection of BOM item category to Stock Item if available
			aResults.forEach(function (oResult, iIndex) {
				if (oResult.BillOfMaterialItemCategory === Constants.FixedBOMItemCategory.STOCK_ITEM) {
					iDefaultBOMItemCategorySelection = iIndex;
				}
			});

			oModel.setProperty(
				"/SelectedItemKey",
				oBOMItemCategory.results[iDefaultBOMItemCategorySelection].BillOfMaterialItemCategory);
			oModel.setProperty(
				"/BOMItemCategory",
				oBOMItemCategory.results);
			oModel.setProperty(
				"/SelectedBOMItemCategory/" + oBOMItemCategory.results[iDefaultBOMItemCategorySelection].FixedItemCategory,
				true);
		},
		/**
		 * Gets the default data for BOM item dialog model.
		 * @returns {object} dialog model data
		 * @protected
		 * @function
		 */
		_getDefaultDataForBOMItemDialog: function () {
			var oData = {
				"SelectedBOMItemName": StructurePanelModel.getCurrentlyFocusedBOMItem().BOMComponentName,
				"SelectedBOMItemCategory": {},
				"SelectedItemKey": "",
				"SaveAndCloseButtonEnabled": false,
				"BOMItemCategory": []
			};

			oData.SelectedBOMItemCategory[Constants.FixedBOMItemCategory.NON_STOCK_ITEM] = false;
			oData.SelectedBOMItemCategory[Constants.FixedBOMItemCategory.STOCK_ITEM] = false;
			oData.SelectedBOMItemCategory[Constants.FixedBOMItemCategory.TEXT_ITEM] = false;
			oData.SelectedBOMItemCategory[Constants.FixedBOMItemCategory.DOCUMENT_ITEM] = false;
			oData.SelectedBOMItemCategory[Constants.FixedBOMItemCategory.VARIABLE_SIZE_ITEM] = false;

			return oData;
		},
		/**
		 * Gets the data for insert BOM item dialog model.
		 * @returns {object} dialog model data
		 * @protected
		 * @function
		 */
		_getDataForInsertBOMItemDialog: function () {
			var oData = this._getDefaultDataForBOMItemDialog();
			oData.IsBOMItemInsert = true;
			return oData;
		},
		/**
		 * Gets the data for update BOM item dialog model.
		 * @returns {object} dialog model data
		 * @protected
		 * @function
		 */
		_getDataForUpdateBOMItemDialog: function () {
			var oData = this._getDefaultDataForBOMItemDialog();

			oData.IsBOMItemInsert = false;
			oData.SelectedBOMItemCategory[StructurePanelModel.getCurrentlyFocusedBOMItem().FixedItemCategory] = true;

			return oData;
		},
		/**
		 * Destroys the old dialog instance and creates a new dialog instance.
		 * Sets the dialog model.
		 * @param {object} oData: data for dialog model
		 * @private
		 * @function
		 */
		_createBOMItemDialog: function (oData) {
			var oDialogController;
			if (this._oBOMItemDialog) {
				oDialogController = this._oBOMItemDialog.getController();
				this._oBOMItemDialog.destroy();
				delete this._oBOMItemDialog;
			}

			this._oBOMItemDialogVHModel = new JSONModel();
			this._oBOMItemDialogModel = new JSONModel(oData);
			this._oBOMItemDialog = this._oFactoryBase.createFragment(
				this.getView().getId(), BOM_ITEM_DIALOG, BOM_ITEM_DIALOG_CONTROLLER);
			this._oBOMItemDialog.setModel(this._oBOMItemDialogVHModel, Constants.BOMItemDialogVHModel);
			this._oBOMItemDialog.setModel(this._oBOMItemDialogModel, Constants.BOMItemDialogModel);
			oDialogController = this._oBOMItemDialog.getController();
			this._oBOMItemDialog.setModel(this.getView().getModel().getOriginModel(), Constants.ODataModelName);
			
			// ensure that the 'ResetStructurePanel' event is detached whenever the dialog is destroyed
			var fnOriginDestroy = this._oBOMItemDialog.destroy;
			this._oBOMItemDialog.destroy = function() {
				EventProvider.detachResetStructurePanel(oDialogController.onCancel, oDialogController);
				fnOriginDestroy.apply(this);
			}.bind(this._oBOMItemDialog);
			
			EventProvider.attachResetStructurePanel(oDialogController.onCancel, oDialogController);
			this.getView().addDependent(this._oBOMItemDialog);
		},
		/**
		 * Gets the instance of BOM item dialog.
		 * @returns {sap.m.Dialog} dialog instance
		 * @private
		 * @function
		 */
		_getBOMItemDialog: function () {
			return this._oBOMItemDialog;
		},
		/**
		 * Triggers BOM action by given name and creates OBOM implicitelly if needed
		 * @param {string} sBOMItemAction: BOM item action name
		 * @param {object} oSelectedComponent: either current selected or parent BOM component
		 * @param {map} oBOMItemData: BOM item parameters for new item to insert
		 * @param {function} fnCallbackAfterBOMAction: action to trigger after BOM action
		 * @returns {Promise} - Promise object
		 * @private
		 * @function
		 */
		_executeGivenBOMAction: function (sBOMItemAction, oSelectedComponent, oBOMItemData, fnCallbackAfterBOMAction) {
			var oView = this.getView();
			var aPromise = [];
			var fnCreateOrderBOM = function () {
				aPromise.push(BOMNodeSetDAO.createOrderBOM(oSelectedComponent.InstanceId.trim()));
			};
			var fnExplodeBOMWithoutModelUpdate = function () {
				aPromise.push(StructureTreeModel.explodeBOMWithoutRead());
			};
			var fnGivenBOMItemAction = function () {
				aPromise.push(BOMNodeSetDAO[sBOMItemAction](oBOMItemData)
					.then(fnCallbackAfterBOMAction || function () {}));
			};
			var fnReexplodeBOM = function () {
				aPromise.push(StructureTreeModel.explodeBOM(Constants.orderBomExplodeChangeSetId));
			};

			oView.setBusy(true);

			if (oSelectedComponent.FixateState === Constants.FixateState.FIXATE_ALLOWED &&
				FeatureToggle.getETOImplicitOBOMCreateEnabled()) {
				fnCreateOrderBOM();
				StructurePanelModel.setForceBOMExplosion(true);
				fnExplodeBOMWithoutModelUpdate();
			}

			fnGivenBOMItemAction();
			StructurePanelModel.setForceBOMExplosion(true);
			fnReexplodeBOM();

			return Promise.all(aPromise)
				.then(function () {
					oView.setBusy(false);
				})
				.catch(function () {
					oView.setBusy(false);
				});

		},
		/**
		 * Event handler for business exception of type 'bom_explosion_err'
		 * 
		 * @param {string} sChannelId: channel for the event
		 * @param {string} sEvent: event name
		 * @param {obejct} mEvent: event data
		 * @private
		 * @function
		 */
		_handleBOMExplosionError: function (sChannelId, sEvent, mEvent) {
			if (mEvent.propertyRef === Constants.BusinessExceptions.BOM_EXPLOSION_ERROR) {
				if (this._oBOMExplosionErrorDialog) {
					this._oBOMExplosionErrorDialog.destroy();
					delete this._oBOMExplosionErrorDialog;
				}

				this._oBOMExplosionErrorDialog = this._oFactoryBase.createFragment(
						this.getView().getId(), EXPLOSION_ERROR_DIALOG, EXPLOSION_ERROR_DIALOG_CONTROLLER);
				if (mEvent.message){
					this._oBOMExplosionErrorDialog.getController().setDetails(JSON.parse(decodeURIComponent(mEvent.message)));
				}
				this.getView().addDependent(this._oBOMExplosionErrorDialog);
				this._oBOMExplosionErrorDialog.open();
			}
		},
		/**
		 * Triggers BOM explosion
		 * @param {boolean} bForceExplode: forces bom explosion
		 * @public
		 * @function
		 */
		reexplodeBOM: function (bForceExplode) {
			var oView = this.getView();
			oView.setBusy(true);
			StructurePanelModel.setForceBOMExplosion(bForceExplode);
			StructureTreeModel.explodeBOM(Constants.orderBomExplodeChangeSetId).then(function () {
				oView.setBusy(false);
			}).catch(function () {
				oView.setBusy(false);
			});
		},
		/**
		 * Triggers navigation to Order BOM App without creating OBOM and exploding BOM and reading BOM Header
		 * @param {object} oBOMItemData: data of BOM item
		 * @param {boolean} bOpenInNewTab: opens the navigation target in new tab
		 * @public
		 * @function
		 */
		navigateToBOMAppWithoutReadingHeader: function(oBOMItemData, bOpenInNewTab){
			NavigationManager.navigateToBOMApp(oBOMItemData, bOpenInNewTab);
		},
		/**
		 * Attaches ETO specific events to the Structure Panel EventProvider
		 * @public
		 * @function
		 */
		attachETOEvents: function () {
			EventProvider.attachOpenBOMItemDialogForChangeItem(this.openBOMItemChangeDialog, this);
			EventProvider.attachOpenBOMItemDialogForInsertItem(this.openBOMItemInsertDialog, this);
			EventProvider.attachDeleteBOMItem(this.deleteBOMItem, this);
			EventProvider.attachFixateBOMItem(this.fixateBOMItem, this);
			EventProvider.attachNavigateToBOMAppForInsertItem(this.navigateToBOMAppForInsertItem, this);
			EventProvider.attachNavigateToBOMAppForChangeItem(this.navigateToBOMAppForChangeItem, this);
			AppEvents.VCHCLF_BUSINESS_EXCEPTION.subscribe(this._handleBOMExplosionError.bind(this), this);
		},
		/**
		 * Detaches ETO specific events from the Structure Panel EventProvider
		 * @public
		 * @function
		 */
		detachETOEvents: function () {
			EventProvider.detachOpenBOMItemDialogForChangeItem(this.openBOMItemChangeDialog, this);
			EventProvider.detachOpenBOMItemDialogForInsertItem(this.openBOMItemInsertDialog, this);
			EventProvider.detachDeleteBOMItem(this.deleteBOMItem, this);
			EventProvider.detachFixateBOMItem(this.fixateBOMItem, this);
			EventProvider.detachNavigateToBOMAppForInsertItem(this.navigateToBOMAppForInsertItem, this);
			EventProvider.detachNavigateToBOMAppForChangeItem(this.navigateToBOMAppForChangeItem, this);
			AppEvents.VCHCLF_BUSINESS_EXCEPTION.unsubscribe(this._handleBOMExplosionError.bind(this), this);
		},
		/**
		 * Request the BOM item categories.
		 * Opens the BOM item insert dialog on success.
		 * Opens the error dialog on fail.
		 * @param {sap.ui.base.Event} oEvent: dialog event fired on button press
		 * @public
		 * @function
		 */
		openBOMItemInsertDialog: function (oEvent) {
			var oOuterFilter = new Filter({
				and: true,
				filters: [
					new Filter("FixedItemCategory", FilterOperator.NE,
						Constants.FixedBOMItemCategory.CLASS_ITEM),
					new Filter("FixedItemCategory", FilterOperator.NE,
						Constants.FixedBOMItemCategory.COMPATIBLE_UNIT),
					new Filter("FixedItemCategory", FilterOperator.NE,
						Constants.FixedBOMItemCategory.INTRA_MATERIAL),
					new Filter("FixedItemCategory", FilterOperator.NE,
						Constants.FixedBOMItemCategory.PM_STRUCTURE_ELEMENT)
				]
			});

			var oData = {
				ContextId: StructurePanelModel.getConfigurationContextId(),
				InstanceId: StructurePanelModel.getCurrentlyFocusedBOMItem().InstanceId.trim()
			};
			var oJsonModel = new JSONModel();

			oJsonModel.setData(oData);

			this._createBOMItemDialog(this._getDataForInsertBOMItemDialog());
			this._getBOMItemDialog().setModel(oJsonModel, Constants.SelectedBOMItem);
			this._getBOMItemDialog().open();
			this._getBOMItemDialog().setBusy(true);
			this.getView().getModel().facadeRead(
					"/I_BillOfMaterialItemCategory", null, null, [oOuterFilter])
				.then(function (oBOMItemCategory) {
					if (oBOMItemCategory.results.length > 0) {
						this._updateBOMItemDialogModel(oBOMItemCategory);
					} else {
						Logger.logError("Results for I_BillOfMaterialItemCategory request are empty. Please check!", [], this);
					}
					this._getBOMItemDialog().setBusy(false);
				}.bind(this))
				.catch(function (oError) {
					this._getBOMItemDialog().close();
					this._getBOMItemDialog().setBusy(false);
					this.getView().getModel(Constants.VCHCLF_MODEL_NAME).displayErrorMessages([oError]);
				}.bind(this));
		},
		/**
		 * Opens the BOM item change dialog.
		 * @param {sap.ui.base.Event} oEvent: dialog event fired on button press
		 * @public
		 * @function
		 */
		openBOMItemChangeDialog: function (oEvent) {
			var sPath = this.getView().getModel().createKey("/BOMNodeSet", {
				ComponentId: StructurePanelModel.getCurrentlyFocusedBOMItem().ComponentId
			});
			var oBomNode = this.getView().getModel().getProperty(sPath);

			if (!oBomNode.ContextId) {
				oBomNode.ContextId = StructurePanelModel.getConfigurationContextId();
			}
			if (!oBomNode.InstanceId) {
				oBomNode.InstanceId = StructurePanelModel.getCurrentlyFocusedBOMItem().InstanceId.trim();
			}
			var oJsonModel = new JSONModel();
			var oCurrentlyFocusedBOMItem = StructurePanelModel.getCurrentlyFocusedBOMItem();

			oBomNode.Quantity = oCurrentlyFocusedBOMItem.ItemQuantity;

			oJsonModel.setData(oBomNode);
			this._createBOMItemDialog(this._getDataForUpdateBOMItemDialog());
			this._getBOMItemDialog().setModel(oJsonModel, Constants.SelectedBOMItem);
			this._getBOMItemDialog().open();

		},
		/**
		 * Creates a new OBOM and inserts given BOM item into OBOM.
		 * Triggers backend request for BOMNodeSet create.
		 * @param {map} oBOMItemData: BOM item parameters for new item to insert
		 * @returns {Promise} - Promise object
		 * @public
		 * @function
		 */
		insertBOMItem: function (oBOMItemData) {
			var oCurrentlyFocusedBOMItem = StructurePanelModel.getCurrentlyFocusedBOMItem();

			return this._executeGivenBOMAction(INSERT_BOM_ITEM, oCurrentlyFocusedBOMItem, oBOMItemData);
		},
		/**
		 * Updates the selected BOM item.
		 * Triggers backend request for BOMNodeSet create.
		 * @param {map} oBOMItemData: BOM item parameters for new item to insert
		 * @returns {Promise} - Promise object
		 * @public
		 * @function
		 */
		updateBOMItem: function (oBOMItemData) {
			var oCurrentlyFocusedBOMItem = StructurePanelModel.getCurrentlyFocusedBOMItem();
			var oParentComponent = StructureTreeModel.getBOMComponentById(oCurrentlyFocusedBOMItem.ParentComponentId);
			var oView = this.getView();
			var oNavProperties = oView.getModel().getNavigationProperties(oBOMItemData);

			Object.keys(oNavProperties).forEach(function (prop) {
				delete oBOMItemData[prop];
			});
			delete oBOMItemData.__metadata;

			return this._executeGivenBOMAction(UPDATE_BOM_ITEM, oParentComponent, oBOMItemData);
		},
		/**
		 * Deletes selected BOM item from OBOM
		 * @returns {Promise} - Promise object
		 * @public
		 * @function
		 */
		deleteBOMItem: function () {
			var oCurrentlyFocusedBOMItem = StructurePanelModel.getCurrentlyFocusedBOMItem();
			var oParentComponent = StructureTreeModel.getBOMComponentById(oCurrentlyFocusedBOMItem.ParentComponentId);
			var oParams = {
				ContextId: StructurePanelModel.getConfigurationContextId(),
				InstanceId: StructurePanelModel.getCurrentlyFocusedBOMItem()
					.InstanceId.trim()
			};
			var fnAfterDeleteBOMItem = function (oData) {
				var oView = this.getView();
				var oController = oView.getController();
				var oOwnerComponent = oController.getOwnerComponent();

				oOwnerComponent.fireBOMComponentDeleted({
					objectPath: ODataModelHelper.generateBOMNodePath(
						StructurePanelModel.getConfigurationContextId(),
						StructurePanelModel.getCurrentlyFocusedBOMItem().ComponentId)
				});

				oController._valuateAndFocusOnRootComponent();

				return oData;
			};

			return this._executeGivenBOMAction(DELETE_BOM_ITEM, oParentComponent, oParams, fnAfterDeleteBOMItem.bind(this));
		},
		/**
		 * Creates Order BOM
		 * @param {Object} oEvent - UI5 eventing object
		 * @returns {Promise} - Promise object
		 * @public
		 * @function
		 */
		fixateBOMItem: function (oEvent) {
			var oView = this.getView();
			var oCurrentlyFocusedBOMItem = StructurePanelModel.getCurrentlyFocusedBOMItem();
			var aPromise = [];
			var fnCreateOrderBOM = function () {
				aPromise.push(BOMNodeSetDAO.createOrderBOM(
						oCurrentlyFocusedBOMItem.InstanceId.trim(),
						oEvent.getParameter("fixOrderBOMMode")
						));
			};
			var fnReexplodeBOM = function () {
				aPromise.push(StructureTreeModel.explodeBOM());
			};

			oView.setBusy(true);
			fnCreateOrderBOM();
			StructurePanelModel.setForceBOMExplosion(true);
			fnReexplodeBOM();

		return Promise.all(aPromise)
			.then(function () {
					oView.setBusy(false);
				})
			.catch(function () {
					oView.setBusy(false);
				});
		},
		/**
		 * Event handler: triggers navigation to Manage Order BOM app for currently focused BOM item
		 * @public
		 * @function
		 */
		navigateToBOMAppForInsertItem: function () {
			var oCurrentlyFocusedBOMItem = StructurePanelModel.getCurrentlyFocusedBOMItem();

			this._navigateToBOMApp(oCurrentlyFocusedBOMItem);
		},
		/**
		 * Event handler: triggers navigation to Manage Order BOM app for parent BOM item
		 * @public
		 * @function
		 */
		navigateToBOMAppForChangeItem: function () {
			var oCurrentlyFocusedBOMItem = StructurePanelModel.getCurrentlyFocusedBOMItem();
			var oParentComponent = StructureTreeModel.getBOMComponentById(oCurrentlyFocusedBOMItem.ParentComponentId);

			this._navigateToBOMApp(oParentComponent);
		},
		/**
		 * Opens the reexplode BOM dialog
		 * @public
		 * @function
		 */
		openReexplodeBOMDialog: function(){
			if (this._oReexplodeBOMDialog) {
				this._oReexplodeBOMDialog.destroy();
				delete this._oReexplodeBOMDialog;
			}
			this._oReexplodeBOMDialog = this._oFactoryBase.createFragment(
					this.getView().getId(), REEXPLODE_BOM_DIALOG, REEXPLODE_BOM_DIALOG_CONTROLLER);
			this.getView().addDependent(this._oReexplodeBOMDialog);
			this._oReexplodeBOMDialog.open();
		}
	};
});
