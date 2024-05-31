/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/core/Control",
	"sap/ui/layout/ResponsiveSplitter",
	"sap/ui/layout/PaneContainer",
	"sap/ui/layout/SplitPane",
	"sap/ui/layout/SplitterLayoutData"
], function(Control, ResponsiveSplitter, PaneContainer, SplitPane, SplitterLayoutData) {
	"use strict";

	/**
	 * @class
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.vchclf.common.control.Splitter
	 * @extends sap.ui.core.Control
	 */
	return Control.extend("sap.i2d.lo.lib.zvchclfz.common.control.Splitter", { /** @lends sap.i2d.lo.lib.vchclf.common.control.Splitter.prototype */
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
				/** Fired when the right content visibility has changed */
				showRightContent: {
					parameters: {
						show: {
							type: "boolean"
						}
					}
				},
				
				/** Fired when the left content visibility has changed */
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

		/**
		 * @override
		 */
		init: function() {
			this._oLeftSplitPane = new SplitPane({
				id: this.getId() + "--leftPane",
				requiredParentWidth: 756
			});
			this._oMiddleSplitPane = new SplitPane({
				id: this.getId() + "--middlePane",
				requiredParentWidth: 756
			});
			this._oRightSplitPane = new SplitPane({
				id: this.getId() + "--rightPane",
				requiredParentWidth: 1092
			});

			this._oRootPaneContainer = new PaneContainer({
				id: this.getId() + "--rootPaneCont",
				panes: [
					this._oMiddleSplitPane
				]
			});
			this._oResponsiveSplitter = new ResponsiveSplitter({
				id: this.getId() + "--respSplitter",
				rootPaneContainer: this._oRootPaneContainer,
				defaultPane: this._oMiddleSplitPane
			});

			this.setAggregation("splitter", this._oResponsiveSplitter);
		},

		exit: function() {
			delete this._oLeftSplitPane;
			delete this._oMiddleSplitPane;
			delete this._oRightSplitPane;
			delete this._oRootPaneContainer;
			delete this._oResponsiveSplitter;
		},

		setShowLeftContent: function(bShow) {
			var bIsShown = this.getShowLeftContent();

			if (bIsShown === bShow) {
				return;
			}
			
			this.setProperty("showLeftContent", bShow);
			this._showLeftContent(bShow);
		},

		setShowRightContent: function(bShow) {
			var bIsShown = this.getShowRightContent();

			if (bIsShown === bShow) {
				return;
			}

			this.setProperty("showRightContent", bShow);
			this._showRightContent(bShow);
		},

		setLeftContent: function(oControl) {
			this._showLeftContent(oControl && this.getShowLeftContent());
			this.setAggregation("leftContent", oControl);
			this._oLeftSplitPane.setLayoutData(new SplitterLayoutData({
				size: "35%",
				minSize: 420
			}));
		},
		
		setLeftContentIsAvailable: function(bIsAvailable) {
			if (!bIsAvailable) {
				this.setShowLeftContent(false);
			}
			this.setProperty("leftContentIsAvailable", bIsAvailable);
		},
		
		setMiddleContent: function(oControl) {
			this.setAggregation("middleContent", oControl);
			this._oMiddleSplitPane.setLayoutData(new SplitterLayoutData({
				size: "auto",
				minSize: 320
			}));
		},

		setRightContent: function(oControl) {
			this._showRightContent(oControl && this.getShowRightContent());
			this.setAggregation("rightContent", oControl);
			this._oRightSplitPane.setLayoutData(new SplitterLayoutData({
				size: "20%",
				minSize: 320
			}));
		},

		_showLeftContent: function(bShow) {
			if (bShow) {
				this._oRootPaneContainer.insertPane(this._oLeftSplitPane);
				this._oRightSplitPane.setLayoutData(new SplitterLayoutData({size: "20%", minSize: 320}));
			} else {
				this._oRootPaneContainer.removePane(this._oLeftSplitPane);
			}
			
			this.fireShowLeftContent({
				"show" : bShow
			});
		},

		_showRightContent: function(bShow) {
			if (bShow) {
				this._oRootPaneContainer.addPane(this._oRightSplitPane);
				this._oLeftSplitPane.setLayoutData(new SplitterLayoutData({size: "35%", minSize: 420}));
			} else {
				this._oRootPaneContainer.removePane(this._oRightSplitPane);
			}
			
			this.fireShowRightContent({
				show : bShow
			});
		},

		destroy: function() {
			this._oLeftSplitPane.destroy();
			this._oMiddleSplitPane.destroy();
			this._oRightSplitPane.destroy();
			this._oRootPaneContainer.destroy();
			this._oResponsiveSplitter.destroy();
			Control.prototype.destroy.call(this, arguments);
		},


		/**
		 * @override
		 */
		renderer: function(oRm, oControl) {
			oRm.write("<div");
			oRm.writeControlData(oControl);
			oRm.addStyle("height", "100%");
			oRm.writeClasses(oControl);
			oRm.writeStyles();
			oRm.write(">");
			oRm.renderControl(oControl._oResponsiveSplitter);
			oRm.write("</div>");
		}
	});

}, /* bExport= */ true);
