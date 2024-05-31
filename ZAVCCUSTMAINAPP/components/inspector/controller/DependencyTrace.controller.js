/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/TraceEntryTextTypes",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/DependencyFormatter",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/formatter/DependencyTraceFormatter",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/dialog/DependencyTraceFilterDialog",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/DependencyTraceModel",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/EventProvider",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/i18n",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/ODataModelHelper",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
	//eslint-disable-next-line max-params
], function (TraceEntryTextTypes, DependencyFormatter, DependencyTraceFormatter, DependencyTraceFilterDialog,
	DependencyTraceModel, EventProvider, InspectorModel, i18n, ODataModelHelper,
	MessageBox, Fragment, Controller, JSONModel) {
	"use strict";

	var LIST_UPDATE_REASON = "reason";
	var LIST_UPDATE_REASON_GROWING = "Growing";
	var ACTIVE_TRACE = true;

	return Controller.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.controller.DependencyTrace", {
		/**
		 * Dirty flag whether the trace is invalidated or not
		 * If yes, the trace should be updated when it is opened by the user
		 * @type {Boolean}
		 * @private
		 */
		_isTraceInvalidated: false,

		/**
		 * Local JSON Model for the UI of the DependencyTrace
		 * @type {sap.ui.model.json.JSONModel}
		 * @private
		 */
		_uiModel: null,

		/**
		 * Dependency Trace formatter
		 * @type {sap.i2d.lo.lib.vchclf.components.inspector.formatter.DependencyTraceFormatter}
		 * @private
		 */
		_formatter: DependencyTraceFormatter,

		/**
		 * Dependency formatter
		 * @type {sap.i2d.lo.lib.vchclf.components.inspector.formatter.DependencyFormatter}
		 * @private
		 */
		_dependencyFormatter: DependencyFormatter,

		/**
		 * Life-cycle event of controller: onInit
		 * @protected
		 */
		onInit: function () {
			EventProvider.attachFetchTrace(this._fetchTraceTriggered, this);
			EventProvider.attachResetTrace(this._resetTraceTriggered, this);
			EventProvider.attachSaveTraceState(this._saveTraceStateTriggered, this);
			EventProvider.attachRestoreTraceState(this._restoreTraceStateTriggered, this);
			EventProvider.attachActivateTrace(this._activateTraceTriggered, this);
			EventProvider.attachDeactivateTrace(this._deactivateTraceTriggered, this);

			this._uiModel = new JSONModel({
				searchText: ""
			});

			this.getView().setModel(this._uiModel, "ui");

			this._initializeTraceModel();
		},

		/**
		 * Life-cycle event of controller: onExit
		 * @protected
		 */
		onExit: function () {
			EventProvider.detachFetchTrace(this._fetchTraceTriggered, this);
			EventProvider.detachResetTrace(this._resetTraceTriggered, this);
			EventProvider.detachSaveTraceState(this._saveTraceStateTriggered, this);
			EventProvider.detachRestoreTraceState(this._restoreTraceStateTriggered, this);
			EventProvider.detachActivateTrace(this._activateTraceTriggered, this);
			EventProvider.detachDeactivateTrace(this._deactivateTraceTriggered, this);

			DependencyTraceFilterDialog.destroy();
		},

		/**
		 * Life-cycle event of controller: onBeforeRendering
		 * @protected
		 */
		onBeforeRendering: function () {
			if (InspectorModel.getProperty("/isTraceOn") && this._isTraceInvalidated) {
				// Buffer can be cleared, because the old messages will be removed from the trace
				DependencyTraceModel.clearBuffer();
				this._reloadTraceMessages();
			}
		},

		/**
		 * Event handler for press of filter button
		 * @public
		 */
		onFilterPressed: function () {
			this._openTraceFilterDialog();
		},

		/**
		 * Event handler for press of the overflow toolbar
		 * @public
		 */
		onOverflowToolbarPressed: function () {
			this._openTraceFilterDialog();
		},

		/**
		 * Event handler for press of reset filter button
		 * @public
		 */
		onResetFilterPressed: function () {
			DependencyTraceModel.clearAllFilters();

			// If the filters are cleared, the search text shall be cleared too
			this._uiModel.setProperty("/searchText", "");

			this._reloadTraceMessages();

			this.getView()
				.byId("idTraceFilterButton")
				.focus();
		},

		/**
		 * Event handler for live change of search
		 * @param {Object} oEvent - UI5 event object
		 * @public
		 */
		onSearchLiveChanged: function (oEvent) {
			// The current text of the search shall be stored in the model, because if the user does not press enter
			// at the end of the modification of the SearchField, but a trace reload is triggered, the new text
			// shall be used
			DependencyTraceModel.setSearchText(oEvent.getParameter("newValue"));
		},

		/**
		 * Event handler for trigger of search
		 * @public
		 */
		onSearchTriggered: function () {
			this._reloadTraceMessages();
		},

		/**
		 * Event handler for press of filter option of a trace entry item
		 * @param {Object} oEvent - UI5 event object
		 * @public
		 */
		onFilterTraceEntryItem: function (oEvent) {
			var oParameters = oEvent.getParameters();

			DependencyTraceModel.setFiltersForFilterType(oParameters.type, [oParameters]);

			this._reloadTraceMessages();
			this._setFocusOnTraceSearchField();
		},

		/**
		 * Event handler for press of inspect option of a trace entry item
		 * @param {Object} oEvent - UI5 event object
		 * @public
		 */
		onInspectTraceEntryItem: function (oEvent) {
			var oParams = oEvent.getParameters();

			if (oParams.type) {
				var oSource = oEvent.getSource();
				var oContext = oSource && oSource.getBindingContext("trace");
				var oInspectType = TraceEntryTextTypes.InspectTypes[oParams.type];
				var oBinding = oInspectType.getBinding(
					oParams.inspectParameters,
					InspectorModel.getConfigurationContextId(),
					oContext && $.trim(oContext.getProperty("InstanceId")) ||
					InspectorModel.getProperty("/InstanceId"),
					InspectorModel.getProperty("/GroupId")
				);

				this.getOwnerComponent()
					._processNavigation(
						oBinding.getPath(),
						oParams.navigationObjectType,
						true,
						oBinding.getKeyValuePairs()
					);

				EventProvider.fireSetFocusOnHeader();
			}
		},

		/**
		 * Event handler for press of where was value set option of a trace entry item
		 * @param {Object} oEvent - UI5 event object
		 * @public
		 */
		onWhereWasValueSet: function (oEvent) {
			var sPath = ODataModelHelper.generateWhereWasValueSetPath(
				InspectorModel.getConfigurationContextPath(),
				oEvent.getParameter("BOMComponentId"),
				oEvent.getParameter("CsticId")
			);
			var sCharacteristic = i18n.getTextWithParameters("vchclf_trace_dot_separated_items",
				[oEvent.getParameter("BOMComponentName"), oEvent.getParameter("CsticName")]);
			var sPathFilterText = i18n.getTextWithParameters("vchclf_trace_filter_status_where_was_value_set",
				[sCharacteristic]);

			DependencyTraceModel.setRootPath(sPath, sPathFilterText);

			// If the root path changed, the search text shall be cleared too
			this._uiModel.setProperty("/searchText", "");

			this._reloadTraceMessages();
			this._setFocusOnTraceSearchField();
		},

		/**
		 * Event handler for press of where was cstic used option of a trace entry item
		 * @param {Object} oEvent - UI5 event object
		 * @public
		 */
		onWhereWasCsticUsed: function (oEvent) {
			var sPath = ODataModelHelper.generateWhereWasCsticUsedPath(
				InspectorModel.getConfigurationContextPath(),
				oEvent.getParameter("BOMComponentId"),
				oEvent.getParameter("CsticId")
			);
			var sCharacteristic = i18n.getTextWithParameters("vchclf_trace_dot_separated_items",
				[oEvent.getParameter("BOMComponentName"), oEvent.getParameter("CsticName")]);
			var sPathFilterText = i18n.getTextWithParameters("vchclf_trace_filter_status_where_was_cstic_used",
				[sCharacteristic]);

			DependencyTraceModel.setRootPath(sPath, sPathFilterText);

			// If the root path changed, the search text shall be cleared too
			this._uiModel.setProperty("/searchText", "");

			this._reloadTraceMessages();
			this._setFocusOnTraceSearchField();
		},

		/**
		 * Event handler for press of where was dependency set option of a trace entry item
		 * @param {Object} oEvent - UI5 event object
		 * @public
		 */
		onWhereWasDepSet: function (oEvent) {
			this._triggerDepResultFilter(
				ODataModelHelper.generateWhereWasDepSetPath.bind(ODataModelHelper),
				"vchclf_trace_filter_status_where_was_dep_set",
				oEvent.getParameters()
			);
		},

		/**
		 * Event handler for press of where was dependency used option of a trace entry item
		 * @param {Object} oEvent - UI5 event object
		 * @public
		 */
		onWhereWasDepUsed: function (oEvent) {
			this._triggerDepResultFilter(
				ODataModelHelper.generateWhereWasDepUsedPath.bind(ODataModelHelper),
				"vchclf_trace_filter_status_where_was_dep_used",
				oEvent.getParameters()
			);
		},

		/**
		 * Event handler for press of expand button of a trace entry item
		 * @param {Object} oEvent - UI5 event object
		 * @public
		 */
		onExpandTraceEntryPressed: function (oEvent) {
			var oSource = oEvent.getSource();
			var oBindingContext = oSource.getBindingContext("trace");

			if (oBindingContext) {
				var oBindingObject = oBindingContext.getObject();

				if (oEvent.getParameter("expand") && // Expand is triggered
					oSource.getContent().length === 0 && // Trace Entry Details fragment has not been set yet
					oBindingObject.HasDetail) { // Object has detail

					oSource.setBusy(true);

					DependencyTraceModel.expandEntry(
							oBindingObject.TraceGuid,
							oBindingObject.RoundtripNo,
							oBindingObject.EntryNo)
						.then(function () {
							this._setTraceEntryDetails(oSource);
						}.bind(this))
						.catch(function (oError) {
							this._showErrorMessageInMessageBox(oError);
						}.bind(this))
						.then(function () {
							oSource.setBusy(false);
						});
				}
			}
		},

		/**
		 * Event handler for click on a Trace Entry
		 * @param {Object} oEvent - UI5 event object
		 * @public
		 */
		onTraceEntryClicked: function (oEvent) {
			var oContext = oEvent.getSource().getBindingContext("trace");

			if (oContext) {
				DependencyTraceModel.highlightTraceEntryText(oContext.getPath());
			}
		},

		/**
		 * Event handler for press of the link of toggle dependency source code
		 * @param {Object} oEvent - UI5 event object
		 * @public
		 */
		toggleDependencySourceCodeFromCache: function (oEvent) {
			var oSource = oEvent.getSource();
			var oBindingContext = oSource.getBindingContext("trace");

			if (oBindingContext) {
				var oBindingObject = oBindingContext.getObject();

				oSource.setBusy(true);

				DependencyTraceModel.toggleDependencyCodesForEntry(
						oBindingObject.TraceGuid,
						oBindingObject.RoundtripNo,
						oBindingObject.EntryNo)
					.then(function () {
						var oDependencyCodeControl = oSource
							.getParent()
							.getContent()
							.filter(function (oItem) {
								return oItem instanceof sap.m.TextArea;
							})[0];

						oDependencyCodeControl.focus();
					})
					.catch(function (oError) {
						this._showErrorMessageInMessageBox(oError);
					}.bind(this))
					.then(function () {
						oSource.setBusy(false);
					});
			}
		},

		/**
		 * Event handler for update started of Trace List
		 * @param {Object} oEvent - UI5 event object
		 */
		onListUpdateStarted: function (oEvent) {
			if (oEvent.getParameter(LIST_UPDATE_REASON) === LIST_UPDATE_REASON_GROWING) {
				var oView = this.getView();

				oView.setBusy(true);

				DependencyTraceModel.fetch()
					.catch(function (oError) {
						this._showErrorMessageInMessageBox(oError);
					}.bind(this))
					.then(function () {
						oView.setBusy(false);
					});
			}
		},

		/**
		 * Handles the FetchTrace event of EventProvider
		 * @private
		 */
		_fetchTraceTriggered: function () {
			// Only call trace update when it's turned on and the trace is opened
			// In other cases just invalidate the current state of it
			if (InspectorModel.getProperty("/isTraceOn") &&
				InspectorModel.getInspectorVisibility() &&
				InspectorModel.isTraceViewSelected()) {

				// Buffer can be cleared, because the old messages will be removed from the trace
				DependencyTraceModel.clearBuffer();
				this._reloadTraceMessages();
			} else {
				this._isTraceInvalidated = true;
			}
		},

		/**
		 * Handles the ResetTrace event of EventProvider
		 * @private
		 */
		_resetTraceTriggered: function () {
			this._initializeTraceModel();
		},

		/**
		 * Handles the SaveTraceState event of EventProvider
		 * @private
		 */
		_saveTraceStateTriggered: function () {
			DependencyTraceModel.saveState();
		},

		/**
		 * Handles the RestoreTraceState event of EventProvider
		 * @private
		 */
		_restoreTraceStateTriggered: function () {
			DependencyTraceModel.restoreState();
		},

		/**
		 * Handles the ActivateTrace event of EventProvider
		 * @private
		 */
		_activateTraceTriggered: function () {
			this._handleTraceActivation(
				DependencyTraceModel.activateTraceAndReloadMessages.bind(DependencyTraceModel),
				ACTIVE_TRACE
			);
		},

		/**
		 * Handles the DeactivateTrace event of EventProvider
		 * @private
		 */
		_deactivateTraceTriggered: function () {
			this._handleTraceActivation(
				DependencyTraceModel.deactivateTraceAndReloadMessages.bind(DependencyTraceModel),
				!ACTIVE_TRACE
			);
		},

		/**
		 * Handles the DeactivateTrace / ActivateTrace
		 * @param {Function} fnActivation - Activate/Deactivate Promise based functionality
		 * @param {Boolean} bPostTraceToggleState - Trace On/Off
		 * @private
		 */
		_handleTraceActivation: function (fnActivation, bPostTraceToggleState) {
			var oView = this.getView();

			oView.setBusy(true);
			InspectorModel.setProperty("/traceSwitchBusyState", true);

			fnActivation()
				.then(function () {
					if (bPostTraceToggleState) {
						// This is used to disable BE requested as long as the trace is not activated min once
						InspectorModel.setProperty("/isTraceActivatedOnce", true);
					}

					//The Trace State is reverted
					InspectorModel.setProperty(
						"/isTraceOn", bPostTraceToggleState);

					this._isTraceInvalidated = false;
				}.bind(this))
				.catch(function (oError) {
					InspectorModel.setProperty(
						"/isTraceOn", !bPostTraceToggleState);
					this._showErrorMessageInMessageBox(oError);
				}.bind(this))
				.then(function () {
					InspectorModel.setProperty("/traceSwitchBusyState", false);

					DependencyTraceModel.updateFilterText();
					oView.setBusy(false);
				});
		},

		/**
		 * Initialize the model of the trace
		 * @private
		 */
		_initializeTraceModel: function () {
			DependencyTraceModel.initialize();

			// If the trace model is initialized, the search text shall be cleared too
			this._uiModel.setProperty("/searchText", "");

			this._isTraceInvalidated = false;

			this.getView().setModel(DependencyTraceModel.getModel(), "trace");
		},

		/**
		 * Reloads the Trace messages
		 * @private
		 */
		_reloadTraceMessages: function () {
			// This is used to check whether the trace is not activated min once
			if (InspectorModel.getProperty("/isTraceActivatedOnce")) {
				var oView = this.getView();

				oView.setBusy(true);

				this._isTraceInvalidated = false;

				DependencyTraceModel.reload()
					.then(function () {
						this._scrollTraceToTop();

						DependencyTraceModel.updateFilterText();
						oView.setBusy(false);
					}.bind(this))
					.catch(function (oError) {
						if (!oError.isAborted) {
							this._showErrorMessageInMessageBox(oError);

							DependencyTraceModel.updateFilterText();
							oView.setBusy(false);
						}
					}.bind(this));
			} else {
				DependencyTraceModel.updateFilterText();
			}
		},

		/**
		 * Scroll Trace to Top
		 * @private
		 */
		_scrollTraceToTop: function () {
			var oTraceContainer = this.getView().byId("idTraceContainer");

			if (oTraceContainer) {
				oTraceContainer.scrollTo(0, 0);
			}
		},

		/**
		 * Opens the Trace Filter dialog
		 * @private
		 */
		_openTraceFilterDialog: function () {
			DependencyTraceModel.openTraceFilterDialog()
				.then(function (oResult) {
					if (oResult.wasApplied) {
						this._reloadTraceMessages();
					}
				}.bind(this));
		},

		/**
		 * Opens a message box with an error message
		 * @param {Object} oError - Object of error message from the backend
		 * @private
		 */
		_showErrorMessageInMessageBox: function (oError) {
			if (oError && oError.message) {
				MessageBox.error(oError.message);
			}
		},

		/**
		 * Loads the Trace Entry Details fragment and place it in the content of the specified Trace Entry control
		 * @param {sap.i2d.lo.lib.vchclf.components.inspector.control.TraceEntry} oTraceEntry - Trace Entry control
		 * @returns {Promise} Promise object
		 * @private
		 */
		_setTraceEntryDetails: function (oTraceEntry) {
			return Fragment.load({
					name: "sap.i2d.lo.lib.zvchclfz.components.inspector.fragment.TraceEntryDetails",
					controller: this
				})
				.then(function (oTraceEntryDetails) {
					oTraceEntry.addContent(oTraceEntryDetails);
				});
		},

		/**
		 * Sets the focus on the Trace Clear button
		 * @private
		 */
		_setFocusOnTraceSearchField: function () {
			// The focus should be delayed with 0 ms, because w/o this the TraceEntry text is selected again
			// when the action pop up is closed
			setTimeout(function () {
				this.getView()
					.byId("idQuickSearch")
					.focus();
			}.bind(this), 0);
		},

		/**
		 * Handler for the Dependency Results where was used/set filter
		 * @param {Function} fnPathGenerator - function that generate the path
		 * @param {String} sPreTextOfFilter - the pre-text of the filter text
		 * @param {Object} oParameters - Parameters object
		 * @private
		 */
		_triggerDepResultFilter: function (fnPathGenerator, sPreTextOfFilter, oParameters) {
			var sObjectDependency = oParameters.ObjectDependency,
				sSubprocedureIndex = oParameters.SubprocedureIndex,
				sObjectDependencyName = oParameters.ObjectDependencyName,
				sObjectDependencyId = oParameters.ObjectDependencyId;

			var sPath = fnPathGenerator.apply(this, [
				InspectorModel.getConfigurationContextPath(),
				sObjectDependency,
				sSubprocedureIndex,
				sObjectDependencyId
			]);

			var sDependencyFilterText = !sSubprocedureIndex ? sObjectDependencyName :
				i18n.getTextWithParameters(
					"vchclf_trace_msg_link_parentheses_separator",
					[sObjectDependencyName, sSubprocedureIndex]);

			var sPathFilterText = i18n.getTextWithParameters(sPreTextOfFilter,
				[sDependencyFilterText]);

			DependencyTraceModel.setRootPath(sPath, sPathFilterText);

			// If the root path changed, the search text shall be cleared too
			this._uiModel.setProperty("/searchText", "");

			this._reloadTraceMessages();
			this._setFocusOnTraceSearchField();
		}
	});
});
