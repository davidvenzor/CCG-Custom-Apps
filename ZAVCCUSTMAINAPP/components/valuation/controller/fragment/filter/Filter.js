/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/common/controller/fragment/Base",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/ui/core/message/Message",
	"sap/ui/core/message/ControlMessageProcessor",
	"sap/m/MessageToast",
	"sap/i2d/lo/lib/zvchclfz/common/util/XMLFragmentCache",
	"sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/valuation/type/GroupRepresentation",
	"sap/i2d/lo/lib/zvchclfz/common/util/CommandManager"
], function (Base, JSONModel, Filter, Dialog, Button, Message, ControlMessageProcessor, MessageToast, XMLFragmentCache,
	Constants, GroupRepresentation, CommandManager) {
	"use strict";

	var fnPropertyChangeHandler = function (oEvent) {
		var bEnabled = false;
		var oData = this.filterModel.getData("/");
		var aValues = Object.values(oData);
		aValues = aValues.slice(0, aValues.length - 1);
		jQuery.each(aValues, function (iIndex, oValue) {
			if (oValue) {
				if (oValue === "notValuated" || oValue === "noFormat") {
					bEnabled = false;
				} else {
					bEnabled = true;
					return false;
				}
			}
		});
		this.filterModel.setProperty("/resetButtonEnabled", bEnabled);
	};

	var FILTER = {
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

	var INITIAL_FILTER_DATA = {
		isRequired: false,
		changeable: false,
		addValues: false,
		valueAssignedSelectedKey: "notValuated",
		formatSelectedKey: "noFormat",
		singleMultiValuedSelectedKey: "notValuated",
		resetButtonEnabled: false
	};

	var MESSAGE_BAR_FILTER_TEXT = {
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

	/**
	 * 
	 * @class
	 
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.zvchclfz.components.configuration.control.HeaderFilter
	 * @extends sap.ui.core.Control
	 */
	return Base.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.controller.fragment.filter.Filter", {
		__aFilterTextForMessageBar: [],

		_filters: {},

		_getFilters: function () {
			return this.getModel("appStateModel").getProperty("/filters");
		},

		/**
		 * Close the dialog
		 * Update appStateModel with required filters
		 * Reset skip and top in the appStateModel
		 * Toggle filter status
		 * Resume groups binding
		 * Read characterisitcs
		 * 
		 * @private
		 * @function
		 */
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
			var oValuationComponent = this.getOwnerComponent();
			var oValuationDAO = oValuationComponent._getValuationDAO();
			var oContext = oValuationComponent.getBindingContext(Constants.VIEW_MODEL_NAME);
			var sGroupRepresentationMode = oValuationComponent.getGroupRepresentation();
			if (oContext) {
				var bResetFilter = this._getFilters().length === 0;
				var bForceRefresh = true;
				var oValuationView = oValuationComponent.getRootControl();
				oValuationView.setBusyIndicatorDelay(0);
				var fnSetBusy = function (bBusy) {
					oValuationView.setBusy(bBusy);
				};
				fnSetBusy(true);
				if (sGroupRepresentationMode === GroupRepresentation.Embedded) {
					oValuationDAO.readCharacteristics(oContext, false, bForceRefresh, bResetFilter).then(fnSetBusy.bind(this, false));
				} else if (sGroupRepresentationMode === GroupRepresentation.FullScreen) {
					CommandManager.reset();
					if (bResetFilter){
						oValuationComponent.getModel(Constants.VIEW_MODEL_NAME).resetGroupCounts();                        
					} else {
						oValuationDAO.readCharacteristicCountOfAllGroups(oContext);
					}
					oValuationDAO.readCharacteristicsOfSelectedGroup(oContext, false, bForceRefresh, bResetFilter).then(fnSetBusy.bind(this, false));
				}
			}
		},

		/**
		 * Reset skip and top in the appStateModel
		 * 
		 * @private
		 * @function
		 */
		_resetSkipTop: function () {
			this.getModel("appStateModel").resetSkipTop();
		},

		/**
		 * Resume groups binding
		 * 
		 * @private
		 * @function
		 */
		_resumeBinding: function () {
			var aBindings = this._getBindingsFromComponent();
			if (aBindings.length > 0) {
				jQuery.each(aBindings, function (iIndex, oBinding) {
					oBinding.resume();
				});
			}
		},

		/**
		 * Concatenate the filter criteria to a string that is visualized in the message bar
		 * 
		 * @return {string} filter criteria as a string  
		 * @private
		 * @function
		 */
		_getFilterPropertiesString: function () {
			var sFilterProperties = this._getResourceBundle().getText("FPS_INTRO") + "\: ";
			var nCount = 0;
			this._aFilterTextForMessageBar.forEach(function (sFilterText) {
				sFilterProperties = this._addFilterPropertiesSubString(sFilterProperties, sFilterText, nCount);
				nCount = nCount + 1;
			}.bind(this));
			return sFilterProperties;
		},

		/**
		 * Add filter criteria to translatable i18n text
		 * 
		 * @param {string} _sFilterProperties: i18n text
		 * @param {string} _sText: i18n text
		 * @param {integer} _nCount: number of applied filters
		 * @return {string} returns text for message bar including filter criteria
		 * @private
		 * @function
		 */
		_addFilterPropertiesSubString: function (_sFilterProperties, _sText, _nCount, _sValue) {
			var sPart = this._getResourceBundle().getText(_sText);
			var sOperator = " " + this._getResourceBundle().getText("FPS_OPERATOR") + " ";
			if (_nCount === 0) {
				if (_sValue) {
					return _sFilterProperties + sPart + " \(" + _sValue + "\)";
				} else {
					return _sFilterProperties + sPart;
				}
			} else {
				if (_sValue) {
					return _sFilterProperties + sOperator + sPart + " \(" + _sValue + "\)";
				} else {
					return _sFilterProperties + sOperator + sPart;
				}
			}
		},

		/**
		 * Returns the resource bundle of resource model.
		 * 
		 * @return {sap.base.i18n.ResourceBundle} loaded resource bundle or a Promise on it in asynchronous case
		 * @private
		 * @function
		 */
		_getResourceBundle: function () {
			if (!this.i18nResourceBundle) {
				this.i18nResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			}
			return this.i18nResourceBundle;
		},

		/**
		 * Checks if the given arrray contains any UI characteristic filters. 
		 * The filter by the 'IsHidden' property is ignored because it is from the user settings. 
		 * 
		 * @param {array} aFilters: UI filter 
		 * @return {boolean} true or false
		 * @private
		 * @function
		 */
		_hasUiFilter: function (aFilters) {
			var fnIsDialogFilter = function (oFilter) {
				return (oFilter.sPath !== "IsHidden");
			};
			return aFilters.filter(fnIsDialogFilter).length > 0;
		},

		_toggleFilterStatus: function (_bVisible) {
			var oFilterStatus = this.getView().byId("filterStatus");
			oFilterStatus.getFilterDialog = function () {
				return this.getControl();
			}.bind(this);
			oFilterStatus.setVisible(_bVisible);
			var oFilterStatusText = oFilterStatus.getContent()[0];
			if (_bVisible === true) {
				oFilterStatusText.setText(this._getFilterPropertiesString());
			} else {
				oFilterStatusText.setText();
			}
		},

		_getBindingsFromComponent: function () {
			var oComponent = this.getOwnerComponent();
			switch (oComponent.getMetadata()._sClassName) {
			case "sap.i2d.lo.lib.zvchclfz.components.valuation.Component":
				return oComponent.getGroupElementsBinding();
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
			this.filterModel = new JSONModel();
			this.filterModel.attachPropertyChange(fnPropertyChangeHandler.bind(this));
			this._previousFilterState = jQuery.extend(true, {}, INITIAL_FILTER_DATA);
			this.filterModel.setData(jQuery.extend(true, {}, INITIAL_FILTER_DATA));
			return this.filterModel;
		},

		_resetFilterModel: function () {
			this.filterModel.setData(jQuery.extend(true, {}, INITIAL_FILTER_DATA));
		},

		/**
		 * sets an array to AppStateModel that contains one technical filter object for every non initial filter criteria   
		 * @private
		 * @function
		 */
		_syncAppStateModel: function () {
			var aFilter = [];
			var oAppStateModel = this.getModel("appStateModel");
			this._aFilterTextForMessageBar = [];
			var oData = this.filterModel.getData("/");

			var setFilterAndFilterText = function (sValue) {
				aFilter.push(this._filters[sValue]);
				this._aFilterTextForMessageBar.push(MESSAGE_BAR_FILTER_TEXT[sValue]);
			}.bind(this);

			var getFilterForSelect = function (sKey) {
				var aValues = Object.values(oData);
				aValues.forEach(function (sValue) {
					if (sKey === sValue) {
						setFilterAndFilterText(sValue);
					}
				});
			};

			var aValues = Object.keys(FILTER);
			aValues.forEach(function (sValue) {
				var sModelValue = oData[sValue];
				if (sModelValue !== undefined && !!sModelValue) {
					setFilterAndFilterText(sValue);
				} else if (sModelValue === undefined) {
					// This is for valueAssignedSelectedKey, formatSelectedKey and singleMultiValuedSelectedKey.
					// The filters have to be evaluated dependent on the value of these properties
					getFilterForSelect(sValue);
				}
			});

			if (aFilter.length !== 0) {
				aFilter = [new sap.ui.model.Filter({
					filters: aFilter,
					and: true
				})];
			}
			oAppStateModel.setProperty("/filters", aFilter);
			oAppStateModel.resetLoadedGroups();
		},

		/**
		 * get fitler model instance
		 * create a new one if initial
		 * 
		 * @return {sap.ui.model.json.JSONModel} instance of filter model
		 * @public
		 * @function
		 */
		getFilterModel: function () {
			if (!this.filterModel) {
				this._initFilterModel();
			}
			return this.filterModel;
		},

		exit: function () {
			Base.prototype.exit.apply(this, arguments);
			if (this.filterModel) {
				this.filterModel.detachPropertyChange(fnPropertyChangeHandler.bind(this));
			}
		},

		/**
		 * Classification needs a UI filter that does not trigger a request
		 * because the filter is on a level that is expanded
		 * @public
		 */
		applyBindingFilterForEmbeddedMode: function () {
			var aBindings = this._getBindingsFromComponent();
			if (aBindings.length > 0) {
				CommandManager.reset();
				// There is an array with 1 filter object containing all individual property filters
				var oFilter = this.getModel("appStateModel").getProperty("/filters")[0];
				jQuery.each(aBindings, function (iIndex, oBinding) {
					oBinding.filter(oFilter);
				});
			}
		},

		/**
		 * creates all available filter instances
		 * 
		 * @override
		 * @function
		 */
		init: function () {
			for (var key in FILTER) {
				this._filters[key] = new Filter(FILTER[key][0], sap.ui.model.FilterOperator.EQ, FILTER[key][1]);
			}
		},

		onRemoveFilter: function () {
			this._resetFilterModel();
			this._filter();
		},

		/**
		 * event handler for 'Reset' button
		 * 
		 * reset filter model
		 * closes the dialog
		 * updates appStateModel with required filters
		 * reset skip and top in the appStateModel
		 * toggle filter status
		 * resume groups binding
		 * read characterisitcs
		 * 
		 * @public
		 * @function
		 */
		onResetFilter: function () {
			this._resetFilterModel();
			this._syncAppStateModel();
		},

		/**
		 * event handler for 'Go' button
		 * 
		 * closes the dialog
		 * updates appStateModel with required filters
		 * reset skip and top in the appStateModel
		 * toggle filter status
		 * resume groups binding
		 * read characterisitcs
		 * 
		 * @public
		 * @function
		 */
		onFilter: function () {
			this._filter();
		},

		/**
		 * event handler for 'Cancel' button
		 * 
		 * reset filter model to a previous state
		 * closes the dialog
		 * 
		 * @public
		 * @function
		 */
		onCancel: function () {
			this.getControl().close();
			this.filterModel.setData(jQuery.extend(true, {}, this._previousFilterState));
		}

	});

}, /* bExport= */ true);
