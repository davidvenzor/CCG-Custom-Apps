/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/m/Panel"
], function (Panel) {
	"use strict";

	/**
	 * This control is used for the Trace Entries. It extends the Panel control with a new property: hasContent.
	 * If this property is false, the expand icon should not be visible (but it should be rendered because of the
	 * layout).
	 */
	return Panel.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.control.TraceEntry", {
		metadata: {
			properties: {
				/** Flag to indicate the Trace Entry panel has content */
				hasContent: "boolean"
			},
			events: {
				/** Trace Entry clicked event */
				clicked: {
					parameters: {}
				}
			}
		},
		renderer: {}, // Renderer functionality is inherited from the Panel

		/**
		 * Life-cycle event of control: onBeforeRendering
		 * @protected
		 * @override
		 */
		onBeforeRendering: function () {
			if (Panel.prototype.onBeforeRendering) {
				Panel.prototype.onBeforeRendering.apply(this, arguments);
			}

			// If the hasContent property is false, the expand icon should be hidden. If in these cases, we would set
			// the expandable property to false, the icon would not be rendered and it would crash the layout.
			if (!this.getHasContent()) {
				this.addStyleClass("vchclfTraceEntryHideExpandIcon");
			}
		},

		/**
		 * Life-cycle event of control: onAfterRendering
		 * @protected
		 * @override
		 */
		onAfterRendering: function () {
			if (Panel.prototype.onAfterRendering) {
				Panel.prototype.onAfterRendering.apply(this, arguments);
			}

			// eslint-disable-next-line sap-no-dom-access
			$(document.getElementById(this.getId())).bind("click", this._handleClick.bind(this));
		},

		/**
		 * Handles the click event on the control
		 * @private
		 */
		_handleClick: function () {
			this.fireClicked();
		}
	});
});
