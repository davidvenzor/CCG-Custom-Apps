/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/i2d/lo/lib/zvchclfz/common/type/InspectorMode",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/formatter/RoutingTreeFormatter",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/StructurePanelModel",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/ODataModelHelper",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/util/i18n",
	"sap/i2d/lo/lib/zvchclfz/components/structurepanel/logic/NavigationManager",
	"sap/m/MessageBox"
], function (Controller, InspectorMode, RoutingTreeFormatter, // eslint-disable-line max-params
	Constants, StructurePanelModel, ODataModelHelper, i18n, NavigationManager, MessageBox) {
	"use strict";

	return Controller.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.controller.RoutingTree", {

		/**
		 * Formatter for the view
		 * @type {sap.i2d.lo.lib.zvchclfz.components.structurepanel.formatter.RoutingTreeFormatter}
		 * @private
		 */
		_formatter: RoutingTreeFormatter,

		/**
		 * Routing Model bound to the TreeTable
		 * @type {sap.i2d.lo.lib.zvchclfz.components.structurepanel.model.RoutingTreeModel}
		 * @private
		 */
		_routingModel: null,

		/**
		 * Called by UI5 runtime. Constructor.
		 * @public
		 */
		onInit: function () {
			this.getView().setModel(ODataModelHelper.getModel());
		},

		/**
		 * Sets Routing Model
		 * @param {sap.i2d.lo.lib.zvchclfz.components.structurepanel.model.RoutingTreeModel} oRoutingModel - Routing Model
		 * @public
		 */
		setRoutingModel: function (oRoutingModel) {
			// Used to set the Routing Model from the Navigation Manager when the page is added.
			if (oRoutingModel) {
				this._routingModel = oRoutingModel;
				this.getView().setModel(this._routingModel.getModel(), "routingTree");
				this._expandRoutingTreeToModelDepth();
			}
		},

		/**
		 * Handles the rowSelectionChange event of TreeTable control
		 * @param {Object} oEvent - UI5 event object
		 * @private
		 */
		onRowSelectionChange: function (oEvent) {
			var oTreeTable = oEvent.getSource();

			// TODO: workaround until the row selection related backlog is not solved by UI5
			// If a row has been deselected, select it again
			if (oTreeTable.getSelectedIndices().length === 0) { // deselection happened
				oTreeTable.setSelectedIndex(oEvent.getParameter("rowIndex"));
			}
		},

		/**
		 * Expand Routing Tree to a given Tree Depth.
		 * @public
		 */
		_expandRoutingTreeToModelDepth: function () {
			if (this._routingModel && $.isFunction(this._routingModel.getTreeDepth)) {
				var iTreeDepth = this._routingModel.getTreeDepth();

				if (iTreeDepth > 0) {
					this.getView()
						.byId("idRoutingTree")
						.expandToLevel(iTreeDepth);
				}
			}
		},

		/**
		 * Destructor - called by UI5
		 * @public
		 */
		onExit: function () {
			if (this._routingModel && $.isFunction(this._routingModel.destroy)) {
				this._routingModel.destroy();
			}
		},

		/**
		 * Triggered after navigation of Navigation Manager
		 * @public
		 */
		onAfterNavigationTo: function () {
			if (this._routingModel && this._routingModel.isInvalidated()) {
				this.reloadRouting();
			}
		},

		/**
		 * Clear the routing tree
		 * @public
		 */
		clearRoutingTree: function () {
			if (this._routingModel) {
				this._routingModel.clearRoutingTree();
			}
		},

		/**
		 * Returns Routing Model Type whether is a SubPage or Base Routing
		 * @returns {String} - Routing Model Type
		 * @public
		 */
		getRoutingModelType: function () {
			if (this._routingModel && $.isFunction(this._routingModel.getType)) {
				return this._routingModel.getType();
			}

			return undefined;
		},

		/**
		 * Set the IsTreeRefreshable flag to true so the Routing Tree invalidated
		 * @public
		 */
		invalidateRoutingTree: function () {
			if (this._routingModel) {
				this._routingModel.invalidate();
			}
		},

		/**
		 * Explodes the Routing Model
		 * @public
		 */
		explodeRouting: function () {
			if (this._routingModel && $.isFunction(this._routingModel.explodeRouting)) {
				StructurePanelModel.setStructurePanelLoading(true);

				this._routingModel.explodeRouting(
						StructurePanelModel.getRoutingFrameCallerBindingPath(),
						StructurePanelModel.getConfigurationContextId(),
						StructurePanelModel.getRoutingFrameCallerRoutingKey(),
						StructurePanelModel.getRoutingFrameCallerBOMNode())
					.then(function (iLength) {
						this._routingReceivedGenericSuccessHandling(iLength);
					}.bind(this))
					.catch(function () {
						this._requestGenericErrorHandling();
					}.bind(this))
					.then(function () {
						this.getOwnerComponent()
							.fireRoutingExplosionFinished();
					}.bind(this));
			}
		},

		/**
		 * Reloads the Routing Model
		 * @public
		 */
		reloadRouting: function () {
			if (this._routingModel && $.isFunction(this._routingModel.read)) {
				StructurePanelModel.setStructurePanelLoading(true);

				this._routingModel.read(StructurePanelModel.getRoutingFrameCallerBindingPath())
					.then(function (iLength) {
						this._routingReceivedGenericSuccessHandling(iLength);
					}.bind(this))
					.catch(function () {
						this._requestGenericErrorHandling();
					}.bind(this));
			}
		},

		/**
		 * Handles the rows' first cell's click event
		 * @param {Object} oEvent - UI5 event object
		 * @private
		 */
		onCellClicked: function (oEvent) {
			var oRowBindingContext = oEvent.getParameter("rowBindingContext");

			if (oRowBindingContext) {
				var oBoundObject = oRowBindingContext.getObject();

				if (oEvent.getParameter("columnId").indexOf(Constants.treeTable.columns.id.routing) >= 0) {
					this._inspectItem(oBoundObject, false);
					this._handleNavigation(oBoundObject);
				}
			}
		},

		/**
		 * Handles the dependency icon's click event
		 * @param {Object} oEvent - UI5 event object
		 * @private
		 */
		onDependencyPressed: function (oEvent) {
			var oBoundObject = oEvent.getSource().getBindingContext("routingTree").getObject();

			this._inspectItem(oBoundObject, true);
		},

		/**
		 * Handles the Routing and Dependency column press inspection
		 * @param {Object} oBoundObject - Object referes to the tree click
		 * @param {Boolean} bIsDependency - Flag if the Dependency column was pressed
		 * @private
		 */
		_inspectItem: function (oBoundObject, bIsDependency) {
			var sObjectType;

			switch (oBoundObject.NodeType) {
			case Constants.routing.nodeType.operation:
				sObjectType = InspectorMode.objectType.Operation;
				break;
			case Constants.routing.nodeType.subOperation:
				sObjectType = InspectorMode.objectType.SubOperation;
				break;
			case Constants.routing.nodeType.refOperation:
				sObjectType = InspectorMode.objectType.RefOperation;
				break;
			case Constants.routing.nodeType.refSubOperation:
				sObjectType = InspectorMode.objectType.RefSubOperation;
				break;
			case Constants.routing.nodeType.parallelSequence:
				sObjectType = InspectorMode.objectType.ParallelSequence;
				break;
			case Constants.routing.nodeType.alternativeSequence:
				sObjectType = InspectorMode.objectType.AlternativeSequence;
				break;
			case Constants.routing.nodeType.standardSequence:
				sObjectType = InspectorMode.objectType.RoutingHeader;
				break;
			default:
				break;
			}

			if (sObjectType) {
				var sRoutingNodePath = ODataModelHelper.generateRoutingNodePath(
					StructurePanelModel.getRoutingFrameCallerBindingPath(),
					oBoundObject.TreeId, oBoundObject.NodeId);
				var sInspectorTab = bIsDependency ? InspectorMode.inspectorTab.dependencies : null;

				this.getOwnerComponent().fireInspectObject({
					objectPath: sRoutingNodePath,
					objectType: sObjectType,
					inspectorTab: sInspectorTab
				});
			}
		},

		/**
		 * Handles Navigation Button Press event
		 * @param {Object} oEvent - UI5 event object
		 * @public
		 */
		onNavigationPressed: function (oEvent) {
			var oBoundObject = oEvent.getSource()
				.getBindingContext("routingTree")
				.getObject();

			this._handleNavigation(oBoundObject);
		},

		/**
		 * Handles Navigation from Routing
		 * @param {Object} oRoutingObject - RoutingObject
		 * @private
		 */
		_handleNavigation: function (oRoutingObject) {
			if (oRoutingObject &&
				(oRoutingObject.BOOSequenceBranchOperation || oRoutingObject.BOOSequenceReturnOperation)) {
				switch (oRoutingObject.NodeType) {
				case Constants.routing.nodeType.parallelSequence:
				case Constants.routing.nodeType.alternativeSequence:
					NavigationManager.addRoutingTreeSubPage(oRoutingObject);
					break;

				case Constants.routing.nodeType.operation:
				case Constants.routing.nodeType.subOperation:
					NavigationManager.navigateBack();
					break;

				default:
					break;
				}
			}
		},

		/**
		 * Handles the error message coming from the service
		 * @private
		 */
		_requestGenericErrorHandling: function () {
			MessageBox.error(i18n.getText("vchclf_structpnl_expl_routing_error"));

			StructurePanelModel.setStructurePanelLoading(false);

			// If an error occurred during the explosion, all routing pages will be invalid
			NavigationManager.navigateToBOMFrame();
		},

		/**
		 * Handles the success branch of explode and read routing
		 * @param {Int} iLength - length of the received routing nodes
		 * @private
		 */
		_routingReceivedGenericSuccessHandling: function (iLength) {
			StructurePanelModel.setStructurePanelLoading(false);

			if (iLength === 0 && !NavigationManager.isCurrentRoutingPageBase()) {
				MessageBox.warning(i18n.getText("vchclf_structpnl_expl_routing_sequence_not_part_of_exploded_routing"));
				NavigationManager.backToTopOfRouting();
			} else if (iLength !== 0) {
				this._expandRoutingTreeToModelDepth();
			} else {
				// If the current sequence is the standard, however the length is 0, something went wrong.
				this._requestGenericErrorHandling();
			}
		}

	});
});
