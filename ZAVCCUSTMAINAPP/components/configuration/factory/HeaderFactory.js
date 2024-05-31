/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/Label"
], function (ManagedObject, Label) {
	"use strict";

	/**
	 * 
	 */
	var HeaderFactory = ManagedObject.extend("sap.i2d.lo.lib.zvchclfz.components.configuration.factory.HeaderFactory", {

		metadata: {
			properties: {
				controller: {
					type: "sap.ui.core.mvc.Controller"
				}
			}
		},

		/**
		 * @public
		 * @param
		 * @returns
		 */
		createField: function (sIdPrefix, oHeaderField) {
			var oControl = this._createControl(sIdPrefix, oHeaderField);

			var oLabel = new Label({
				id: this._createId(sIdPrefix, oHeaderField, "title"),
				text: oHeaderField.description,
				labelFor: oControl.getId()
			});

			if (oControl.addAriaLabelledBy) {
				oControl.addAriaLabelledBy(oLabel);
			}

			var oVBox = new sap.m.VBox(sIdPrefix, {
				visible: oHeaderField.properties.visible
			});
			oVBox.addItem(oLabel);
			oVBox.addItem(oControl);
			if (oHeaderField.controlType === "ObjectStatus") {
				oControl.addStyleClass("sapMObjectStatusLarge");
				// workaround for status field because we are using custom css
				// otherwise the status field is not rendered horizontally aligned with other fields
				oVBox.addItem(new sap.m.Text({
					text: ""
				}));
			}
			oVBox.addStyleClass("sapNoMarginBegin");
			oVBox.addStyleClass("sapUiNoMarginEnd");
			oVBox.addStyleClass("sapSmallMarginBottom");

			return oVBox;
		},

		/**
		 * @public
		 * @param
		 * @returns
		 */
		createAction: function (sIdPrefix, oHeaderAction) {
			return this._createControl(sIdPrefix, oHeaderAction);
		},

		/**
		 * @private
		 */
		_createControl: function (sIdPrefix, oHeaderField) {
			this._updateEventHandler(oHeaderField);
			var sId = this._createId(sIdPrefix, oHeaderField);
			return sap.m[oHeaderField.controlType] && new sap.m[oHeaderField.controlType](sId, oHeaderField.properties) || jQuery.sap.getObject(
				oHeaderField.controlType) && new(jQuery.sap.getObject(oHeaderField.controlType))(sId, oHeaderField.properties);
		},

		/**
		 * @private
		 */
		_createId: function (sIdPrefix, oHeaderField, sIdPostfix) {
			return oHeaderField.properties.id ? (sIdPrefix + "--" + oHeaderField.properties.id + (sIdPostfix ? "--" + sIdPostfix : "")) : (
				sIdPrefix + "--undefined" + (sIdPostfix ? "--" + sIdPostfix : ""));
		},

		/**
		 * @private
		 */
		_updateEventHandler: function (oHeaderField) {
			if (oHeaderField.properties) {
				if (oHeaderField.properties.press) {
					oHeaderField.properties.press = this._resolveEventHandler(oHeaderField.properties.press);
				} else if (oHeaderField.properties.defaultAction) {
					oHeaderField.properties.defaultAction = this._resolveEventHandler(oHeaderField.properties.defaultAction);
					oHeaderField.properties.menu.itemSelected = this._resolveEventHandler(oHeaderField.properties.menu.itemSelected);
				}
			}
		},

		/**
		 * @private
		 */
		_resolveEventHandler: function (vHandler) {
			var oController = this.getController();
			var fnHandler = vHandler;

			if (typeof vHandler === "string") {
				if (vHandler.indexOf(".") === 0) {
					vHandler = vHandler.slice(1);
				}
				if (oController && oController[vHandler]) {
					fnHandler = oController[vHandler];
				} else {
					fnHandler = jQuery.sap.getObject(vHandler);
				}

				if (!fnHandler) {
					throw new Error("HeaderFactory: Could not find handler function '" + vHandler + "'");
				}

				fnHandler = [fnHandler, oController];
			}

			return fnHandler;
		}
	});

	HeaderFactory.getHeaderFieldFromContext = function (oContext) {
		var sPath = oContext.getPath();
		return oContext.getModel().getProperty(sPath);
	};

	return HeaderFactory;
});
