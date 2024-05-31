/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([], function () {
	"use strict";

	/** Singleton module for handling the routing selection
	 * @class sap.i2d.lo.lib.zvchclfz.components.structurepanel.util.RoutingSelectionUtil
	 * @public
	 */
	var RoutingSelectionUtil = function () {};

	/**
	 * Return concatenated key for selection of the routing. This should be used only for technical key determination
	 * because the order of the keys is language dependent.
	 * @param {String} sBillOfOperationsGroup - BillOfOperationsGroup property of RoutingNode entity
	 * @param {String} sBillOfOperationsVariant - BillOfOperationsVariant property of RoutingNode entity
	 * @return {String} the formatted key
	 */
	RoutingSelectionUtil.prototype.getConcatenatedRoutingKey =
		function (sBillOfOperationsGroup, sBillOfOperationsVariant) {
			return sBillOfOperationsGroup + "/" + sBillOfOperationsVariant;
		};

	/**
	 * Export singleton instance of RoutingSelectionUtil
	 */
	return new RoutingSelectionUtil();
});
