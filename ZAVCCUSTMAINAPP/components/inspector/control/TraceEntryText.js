/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/inspector/config/TraceEntryTextTypes",
	"sap/m/FormattedText",
	"sap/m/Link",
	"sap/m/Text",
	"sap/m/Title",
	"sap/ui/core/Icon",
	"sap/ui/core/IconColor",
	"sap/ui/model/json/JSONModel"
], function (TraceEntryTextTypes, FormattedText, Link, Text, Title, Icon, IconColor, JSONModel) {
	"use strict";

	var ICON_SIZE = "0.75em";

	var ACTION_SHEET_ACTIONS = ["headerText",
		"filterText",
		"inspectText",
		"whereWasValueSetText",
		"whereWasCsticUsedText",
		"whereWasDepUsedText",
		"whereWasDepSetText"
	];

	/**
	 * This control is used for proper display of Trace Entry Texts. As an input property it will get a metatext
	 * and based on that it should render the text with the proper Icon / Link / Text controls.
	 */
	return Title.extend("sap.i2d.lo.lib.zvchclfz.components.inspector.control.TraceEntryText", {
		metadata: {
			properties: {
				/** MetaText which is used to build the control's text upon */
				metaText: {
					type: "string"
				},
				/** CSS classes which should be assigned to the control */
				styleClass: {
					type: "string"
				},
				/** Indicator whether precise numbers should be shown */
				showPreciseNumbers: {
					type: "boolean"
				}
			},
			events: {
				/** Object && Value Filter event */
				filter: {
					parameters: {
						/** Type from which the event was triggered. Supported types are under
						 *  sap.i2d.lo.lib.vchclf.components.inspector.config.TraceEntryTextTypes.FilterTypes */
						type: {
							type: "string"
						},
						/** Description of the filter object */
						text: {
							type: "string"
						},
						/** OPTIONAL (single key filter): Property of the filter in Trace Entry entity */
						property: {
							type: "string"
						},
						/** OPTIONAL (single key filter): Value of the filter in Trace Entry entity */
						key: {
							type: "string"
						},
						/** OPTIONAL (multi key filter): Property - value pairs of the filter */
						parameters: {
							type: "object"
						}
					}
				},

				/** Inspect event */
				inspect: {
					parameters: {
						/** Type from which the event was triggered. Supported types are under
						 *  sap.i2d.lo.lib.vchclf.components.inspector.config.TraceEntryTextTypes.InspectTypes */
						type: {
							type: "string"
						},
						/** Object type of the inspection. Supported types are under
						 *  sap.i2d.lo.lib.vchclf.components.inspector.config.UiConfig.inspectorMode.objectType */
						navigationObjectType: {
							type: "string"
						},
						/** Type specific inspect parameters */
						inspectParameters: {
							type: "object"
						}
					}
				},

				/** Search where was value set event */
				whereWasValueSet: {
					parameters: {
						/** Id of the related characteristic */
						CsticId: {
							type: "string"
						},
						/** Id of the related BOM component */
						BOMComponentId: {
							type: "string"
						}
					}
				},

				/** Search where was characteristic used event */
				whereWasCsticUsed: {
					parameters: {
						/** Id of the related characteristic */
						CsticId: {
							type: "string"
						},
						/** Name of the related characteristic */
						CsticName: {
							type: "string"
						},
						/** Id of the related BOM component of characteristic */
						BOMComponentId: {
							type: "string"
						}
					}
				},

				/** Search where was dependency set event */
				whereWasDepSet: {
					parameters: {
						/** Id of the related dependency */
						DependencyId: {
							type: "string"
						},
						/** The sub-procedure index of the dependency */
						SubprocedureIndex: {
							type: "integer"
						},
						/** Name of the related dependency */
						DependecyName: {
							type: "string"
						}
					}
				},

				/** Search where was dependency used event */
				whereWasDepUsed: {
					parameters: {
						/** Id of the related dependency */
						DependencyId: {
							type: "string"
						},
						/** The sub-procedure index of the dependency */
						SubprocedureIndex: {
							type: "integer"
						},
						/** Name of the related dependency */
						DependencyName: {
							type: "string"
						}
					}
				}
			},
			aggregations: {
				/** Links, icons and texts inside trace message */
				textControls: {
					type: "sap.ui.core.Control",
					multiple: true,
					visibility: "hidden"
				}
			}
		},

		/**
		 * Object which used to reference the actionSheet fragment
		 * @type {Object}
		 * @private
		 */
		_actionSheet: null,

		/**
		 * String variable used to reference the actionSheet's callerId
		 * @type {String}
		 * @private
		 */
		_actionSheetCallerType: null,

		/**
		 * Initiate the control instance before rendering
		 * @protected
		 * @override
		 */
		init: function () {
			var otraceEntryTextParameterModel = new JSONModel({
				headerText: null,
				filterText: null,
				inspectText: null,
				whereWasValueSetText: null,
				whereWasCsticUsedText: null,
				whereWasDepSetText: null,
				whereWasDepUsedText: null
			});

			this.setModel(otraceEntryTextParameterModel, "traceEntryTextParameter");
		},

		/**
		 * Render Manager of the control
		 * @param {Object} oRM - Rendering Manager
		 * @param {Object} oControl - Instance of the TraceEntryText
		 * @protected
		 * @override
		 */
		renderer: function (oRM, oControl) {
			if (oRM) {
				var sMetatext = oControl.getMetaText();
				var aTextParts = sMetatext.split(/\{\w+\}/g);
				var sStyleClasses = "sapMBarChild sapMText sapMTextMaxWidth sapUiSelectable sapMTBShrinkItem";

				sStyleClasses += oControl.getStyleClass() ? " " + oControl.getStyleClass() : "";

				oControl._generateTextControlsAggregation(sMetatext);

				oRM.write("<span");
				oRM.writeControlData(oControl);
				oRM.writeAttributeEscaped("id", oControl.getId() + "_span");
				oRM.writeAttributeEscaped("class", sStyleClasses);
				oRM.write(">");

				$.each(aTextParts, function (iIndex, sTextPart) {
					oRM.renderControl(new FormattedText({
						htmlText: sTextPart
					}).addStyleClass("vchclfTraceEntryTextItem"));

					if (oControl.getAggregation("textControls") && oControl.getAggregation("textControls")[iIndex]) {
						oRM.renderControl(oControl.getAggregation("textControls")[iIndex]);
					}
				});

				oRM.write("</span>");
			}
		},

		/**
		 * Event handler for the Filter action
		 * @public
		 */
		onFilter: function () {
			var oTraceEntry = this.getBindingContext("trace")
				.getObject();

			if (this._actionSheetCallerType) {
				this.fireFilter(TraceEntryTextTypes.LinkTypes[this._actionSheetCallerType]
					.getFilterObject(oTraceEntry));
			}
		},

		/**
		 * Event handler for the Inspect action
		 * @public
		 */
		onInspect: function () {
			var oTraceEntry = this.getBindingContext("trace")
				.getObject();

			if (this._actionSheetCallerType) {
				this.fireInspect(TraceEntryTextTypes.LinkTypes[this._actionSheetCallerType]
					.getInspectObject(oTraceEntry));
			}
		},

		/**
		 * Event handler for the Where Was Value Set action
		 * @public
		 */
		onWhereWasValueSet: function () {
			this.fireWhereWasValueSet(this.getBindingContext("trace").getObject());
		},

		/**
		 * Event handler for the Where Was Characteristic Used action
		 * @public
		 */
		onWhereWasCsticUsed: function () {
			this.fireWhereWasCsticUsed(this.getBindingContext("trace").getObject());
		},

		/**
		 * Event handler for the Where Was Dep Set action
		 * @public
		 */
		onWhereWasDepSet: function () {
			this.fireWhereWasDepSet(this.getBindingContext("trace").getObject());
		},

		/**
		 * Event handler for the Where Was Dependency Used action
		 * @public
		 */
		onWhereWasDepUsed: function () {
			this.fireWhereWasDepUsed(this.getBindingContext("trace").getObject());
		},

		/**
		 * Populates aggregations of TraceEntryText
		 * @param {String} sMetaText - Meta text of trace message
		 * @private
		 */
		_generateTextControlsAggregation: function (sMetaText) {
			// Getting meta text tokens: ["{ObjectDependency}", "{", "ObjectDependency", "}"]
			var rTokenizer = /(\{)(\w+)(\})/g;
			var aToken;

			// Clear the already existing aggregations to support rerender
			this.destroyAggregation("textControls", true);

			while ((aToken = rTokenizer.exec(sMetaText)) !== null) {
				var sObjectType = aToken[2];

				if (TraceEntryTextTypes.IconTypes[sObjectType]) {
					this._addIconAggregation(sObjectType);
				} else if (TraceEntryTextTypes.LinkTypes[sObjectType]) {
					this._addLinkAggregation(sObjectType);
				} else if (TraceEntryTextTypes.TextTypes[sObjectType]) {
					this._addTextAggregation(sObjectType);
				}
			}
		},

		/**
		 * Creates an icon object and adds it to the textIcons aggregation
		 * @param {String} sObjectType - Object type name from ../config/TraceEntryTextTypes.IconTypes
		 * @private
		 */
		_addIconAggregation: function (sObjectType) {
			var oIconType = TraceEntryTextTypes.IconTypes[sObjectType];

			this.addAggregation("textControls", new Icon({
				src: oIconType.src,
				color: IconColor.Default,
				size: ICON_SIZE,
				tooltip: oIconType.getTooltip(),
				decorative: false
			}));
		},

		/**
		 * Creates a link object (if not exists already) and adds it to the textControls aggregation
		 * @param {String} sObjectType - Object type name from ../config/TraceEntryTextTypes.LinkTypes
		 * @private
		 */
		_addLinkAggregation: function (sObjectType) {
			var sAggregationId = this.getId() + "_" + sObjectType;

			if (TraceEntryTextTypes.LinkTypes[sObjectType] &&
				TraceEntryTextTypes.LinkTypes[sObjectType].getLinkText &&
				!this._isLinkAggregationAlreadyExists(sAggregationId, this.getAggregation("textControls"))) {

				var oTraceEntry = this.getBindingContext("trace")
					.getObject();
				var sLinkText = TraceEntryTextTypes.LinkTypes[sObjectType]
					.getLinkText(oTraceEntry);

				this.addAggregation("textControls", new Link({
						id: sAggregationId,
						text: sLinkText,
						tooltip: sLinkText,
						wrapping: true,
						press: this._handlePress.bind(this)
					})
					.addStyleClass("sapUiNoMargin")
					.addStyleClass("vchclfTraceEntryTextItem"));
			}
		},

		/**
		 * Creates a text object and adds it to the textControls aggregation
		 * @param {String} sObjectType - Object type name from ../config/TraceEntryTextTypes.TextTypes
		 * @private
		 */
		_addTextAggregation: function (sObjectType) {
			var oTextType = TraceEntryTextTypes.TextTypes[sObjectType];

			if (oTextType && $.isFunction(oTextType.getText)) {

				var oTraceEntry = this.getBindingContext("trace")
					.getObject();

				var oFormattedText = new FormattedText({
						htmlText: oTextType.getText(oTraceEntry, this.getShowPreciseNumbers())
					})
					.addStyleClass("vchclfTraceEntryTextItem");

				if ($.isFunction(oTextType.getTooltip)) {
					oFormattedText.setTooltip(oTextType.getTooltip());
				}

				this.addAggregation("textControls", oFormattedText);
			}
		},

		/**
		 * Populates links of textControls aggregations of TraceEntryText
		 * @param {String} sAggregationId - Id of linkText aggregation
		 * @param {sap.m.Link[]} aAggregations - Array of linkText aggregations
		 * @returns {Boolean} True if the aggregation is already in the array
		 * @private
		 */
		_isLinkAggregationAlreadyExists: function (sAggregationId, aAggregations) {
			var bAggregationAlreadyExists = false;

			if (aAggregations) {
				$.each(aAggregations, function (iIndex, oAggregation) {
					bAggregationAlreadyExists = bAggregationAlreadyExists || oAggregation.getId() === sAggregationId;
				});
			}

			return bAggregationAlreadyExists;
		},

		/**
		 * Adds Event handler for press event to the Caller's element
		 * @param {Object} oEvent - UI5 eventing object
		 * @private
		 */
		_handlePress: function (oEvent) {
			var oSource = oEvent.getSource();
			var sObjectType = /[^_]+$/.exec(oSource.getId())[0]; // Get the substring after the last _ character

			this._openActionSheet(oSource, TraceEntryTextTypes.LinkTypes[sObjectType]);
		},

		/**
		 * Opens action sheet for selected link
		 * @param {Object} oSource - Event source object
		 * @param {Object} oLinkType - Link object type
		 * @private
		 */
		_openActionSheet: function (oSource, oLinkType) {
			if (oSource && oLinkType && oLinkType.getLinkText) {
				var oTraceEntryTextParameterModel = this.getModel("traceEntryTextParameter");

				if (!this._actionSheet) {
					this._actionSheet = sap.ui.xmlfragment(
						"sap/i2d/lo/lib/zvchclfz/components/inspector/fragment/TraceEntryTextActionSheet",
						this
					);
					this.addDependent(this._actionSheet);
				}

				this._setActionSheetTexts(oTraceEntryTextParameterModel, oLinkType);

				this._actionSheet.openBy(oSource);
				this._actionSheetCallerType = oLinkType.Name;
			}
		},

		/**
		 * Sets the text properties for the action sheet text model
		 * @param {Object} oActionSheetModel - Model of the Action Sheet pop-up
		 * @param {Object} oLinkType - Link object type
		 * @private
		 */
		_setActionSheetTexts: function (oActionSheetModel, oLinkType) {
			$.each(ACTION_SHEET_ACTIONS, function (iIndex, sAction) {
				var sPropertyName = "/" + sAction;

				if (oLinkType.ActionSheetTexts[sAction]) {
					oActionSheetModel.setProperty(sPropertyName,
						oLinkType.ActionSheetTexts[sAction].call(oLinkType));
				} else {
					oActionSheetModel.setProperty(sPropertyName, "");
				}
			});
		}
	});
});
