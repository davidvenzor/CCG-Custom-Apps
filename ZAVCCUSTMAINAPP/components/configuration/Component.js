/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/configuration/BaseConfigurationComponent",
	"sap/i2d/lo/lib/zvchclfz/components/configuration/type/LegacyScenario",
	"sap/i2d/lo/lib/zvchclfz/common/Constants"
], function (BaseConfigurationComponent, LegacyScenario, Constants) {
	"use strict";

	/**
	 * The configuration component is used to display the variant configuration.
	 * 
	 * @class
	 * Creates and initializes a new Configuration Component with the given <code>sId</code> and
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
	 * @alias sap.i2d.lo.lib.vchclf.components.configuration.Component
	 * @extends sap.ui.core.UIComponent
	 */

	return BaseConfigurationComponent.extend("sap.i2d.lo.lib.zvchclfz.components.configuration.Component", { /** @lends sap.i2d.lo.lib.vchclf.components.configuration.Component.prototype */

		metadata: {
			manifest: "json",
			properties: {
				/** The name of the model which should be used */
				modelName: {
					type: "string"
				},
				rootBindingPath: {
					type: "string"
				},
				legacyScenario: {
					type: "sap.i2d.lo.lib.zvchclfz.components.configuration.type.LegacyScenario",
					defaultValue: LegacyScenario.NonLegacy
				}
			},
			publicMethods: [
				"openDoneDialog",
				"openCancelDialog"
			]
		},
		
		/**
		 * @override
		 */
		onBeforeRendering: function () {
			if (!this.getModel(Constants.VCHCLF_MODEL_NAME)) {
				// If modelName empty (undefined) => unnamed Model ("" is a model name!)
				var oModel = this.getModel(this.getModelName());
				if (!oModel) {
					jQuery.sap.log.error("No VCHCLF model available - not found under given model name");
				}
				this.setModel(oModel, Constants.VCHCLF_MODEL_NAME);
			}
			
			this.initConfigurationDAO();
			this.createComponents();
			this.createConfigurationContextAndBindingContext();
		},

		/**
		 * Redirect to openDoneDialog of configuration controller
		 * @param {function} fnCallback: event handler for done dialog.
		 * @private
		 */
		openDoneDialog: function (fnCallback) {
			this.getAggregation("rootControl").getController().openDoneDialog(fnCallback);
		},

		/**
		 * Redirect to openCancelDialog of configuration controller
		 * @param {function} fnCallback: event handler for cancel dialog.
		 * @private
		 */
		openCancelDialog: function (fnCallback) {
			this.getAggregation("rootControl").getController().openCancelDialog(fnCallback);
		}

	});
});
