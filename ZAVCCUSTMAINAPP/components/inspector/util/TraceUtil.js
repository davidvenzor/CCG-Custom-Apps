/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
    "sap/i2d/lo/lib/zvchclfz/components/inspector/dao/DependencyTraceDAO",
    "sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel"
], function (DependencyTraceDAO, InspectorModel) {
	"use strict";

	/**
	 * Helper class for trace related functionalities
	 * @class
	 */
	var TraceUtil = function () {};

	/**
	 * Check whether the trace is supported and active
	 * @param {String} sContextId - The Configuration Context ID
	 * @returns {Object} promise object
	 * @public
	 */
	TraceUtil.prototype.checkTraceIsSupportedAndActive = function (sContextId) {
		return new Promise(function (fnResolve, fnReject) {
            if (InspectorModel.getIsTraceSupported()) {
                DependencyTraceDAO.checkTraceIsActive(sContextId)
                    .then(function (bIsTraceActive) {
                        if (bIsTraceActive) {
                            fnResolve();
                        } else {
                            fnReject();
                        }
                    })
                    .catch(function () {
                        fnReject();
                    });
            } else {
                fnReject();
            }
        });
	};

	return new TraceUtil();
});
