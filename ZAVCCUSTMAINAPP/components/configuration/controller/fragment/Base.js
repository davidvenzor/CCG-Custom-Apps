/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/common/controller/fragment/Base"
], function(Base) {
	"use strict";

	/**
	 * Base fragment controller
	 * 
	 * @class
	 * @abstract
	 * @author SAP SE
	 * @version 9.0.1
	 * @public	
	 * @alias sap.i2d.lo.lib.vchclf.components.configuration.controller.fragment.Base
	 * @extends sap.i2d.lo.lib.vchclf.common.controller.fragment.Base
	 */
	return Base.extend("sap.i2d.lo.lib.zvchclfz.components.configuration.controller.fragment.Base", { /** @lends sap.i2d.lo.lib.vchclf.components.configuration.controller.fragment.Base.prototype */

		metadata: {
			properties: {
				configurationDAO: {
					type: "sap.i2d.lo.lib.zvchclfz.components.configuration.dao.ConfigurationDAO"
				},
				i18nModelName : {
					type : "string",
					defaultValue: "vchI18n"
				}
			}
		}

	});

}, /* bExport= */ true);
