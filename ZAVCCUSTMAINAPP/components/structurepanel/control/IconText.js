/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/m/FormattedText",
	"sap/m/HBox",
	"sap/ui/core/Control",
	"sap/ui/core/Icon"
], function (FormattedText, HBox, Control, Icon) {
	"use strict";

	return Control.extend("sap.i2d.lo.lib.zvchclfz.components.structurepanel.control.IconText", {
		metadata: {
			properties: {
				/** Flag whether the color of the item shall be lightgrey */
				isGreyedOut: {
					type: "Boolean",
					defaultValue: false
				},
				/** Flag whether the text shall be bold */
				isTextBold: {
					type: "Boolean",
					defaultValue: false
				},
				/** Text of the Text element of the control */
				text: {
					type: "String",
					defaultValue: ""
				},
				/** Icon URI of the first Icon element of the control */
				firstIconURI: {
					type: "URI",
					defaultValue: ""
				},
				/** Tooltip of the first Icon element of the control */
				firstIconTooltip: {
					type: "String",
					defaultValue: ""
				},
				/** Icon URI of the second Icon element of the control */
				secondIconURI: {
					type: "URI",
					defaultValue: ""
				},
				/** Tooltip of the second element of the control */
				secondIconTooltip: {
					type: "String",
					defaultValue: ""
				}
			},
			aggregations: {
				/** The generated HBox of the control */
				_layout: {
					type: "sap.m.HBox",
					multiple: false,
					visibility: "hidden"
				}
			}
		},

		/**
		 * Renderer function of Control
		 * @param {Object} oRM - SAPUI5 render manager
		 * @param {Object} oControl - object of the control
		 * @public
		 */
		renderer: function (oRM, oControl) {
			oControl._renderControl(oRM);
		},

		/**
		 * Render the IconText control
		 * @param {Object} oRM - SAPUI5 render manager
		 * @private
		 */
		_renderControl: function (oRM) {
			if (oRM) {
				this._generateControlContent();

				oRM.write("<div");
				oRM.writeControlData(this);
				oRM.write(">");
				oRM.renderControl(this.getAggregation("_layout"));
				oRM.write("</div>");
			}
		},

		/**
		 * Generate the content of the control based on the properties
		 * @private
		 */
		_generateControlContent: function () {
			var sFirstIconURI = this.getFirstIconURI();
			var sSecondIconURI = this.getSecondIconURI();
			var sText = this.getText();
			var aItems = [];

			if (sFirstIconURI) {
				aItems.push(new Icon({
					src: sFirstIconURI,
					tooltip: this.getFirstIconTooltip(),
					color: this.getIsGreyedOut() ? "lightgrey" : sap.ui.core.IconColor.Default
				}).addStyleClass("sapUiTinyMarginEnd"));
			}

			if (sSecondIconURI) {
				aItems.push(new Icon({
					src: sSecondIconURI,
					tooltip: this.getSecondIconTooltip(),
					color: this.getIsGreyedOut() ? "lightgrey" : sap.ui.core.IconColor.Default
				}).addStyleClass("sapUiTinyMarginEnd"));
			}

			if (sText) {
				aItems.push(new FormattedText({
					htmlText: this._getHtmlText(sText),
					tooltip: sText
				}).addStyleClass("vchclfOverflowHiddenFormattedText"));
			}

			this.setAggregation("_layout",
				new HBox({
					items: aItems
				}));
		},

		/**
		 * Format the text properly based on the incoming indicators
		 * @param {String} sText - Text property which shall me formatted
		 * @return {String} Formatted HTML text
		 * @private
		 */
		_getHtmlText: function (sText) {
			if (this.getIsTextBold() && !this.getIsGreyedOut()) {
				return "<h6><strong>" + sText + "</strong></h6>";
			} else if (!this.getIsTextBold() && this.getIsGreyedOut()) {
				return "<h6><span style=\"color: lightgrey;\">" + sText + "</span></h6>";
			} else if (this.getIsTextBold() && this.getIsGreyedOut()) {
				return "<h6><strong><span style=\"color: lightgrey;\">" + sText + "</span></strong></h6>";
			} else {
				return "<h6>" + sText + "</h6>";
			}
		}
	});
});
