/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([], function () {
	"use strict";

	/**
	 * Possible properties for inspect object with the inspector panel
	 * @public
	 */
	return {
		/**
		 * Object types which can be inspected by the inspector
		 * @public
		 */
		objectType: {
			// Valuation related objects
			Characteristic: "CHARACTERISTIC",
			CharacteristicValue: "CHARACTERISTICVALUE",

			// BOM related objects
			BOMComponent: "BOMCOMPONENT",
			ClassNode: "CLASSNODE",

			// Configuration Profile
			ConfigurationProfile: "CONFIGURATIONPROFILE",

			// Object Dependency
			ObjectDependency: "OBJECTDEPENDENCY",

			// Routing Related objects
			RoutingHeader: "ROUTINGHEADER",
			ParallelSequence: "PARALLELSEQUENCE",
			AlternativeSequence: "ALTERNATIVESEQUENCE",
			Operation: "OPERATION",
			SubOperation: "SUBOPERATION",
			RefOperation: "REFOPERATION",
			RefSubOperation: "REFSUBOPERATION",
			PRT: "PRT"
		},

		/**
		 * Inspector Tabs for trigger direct navigation
		 * @public
		 */
		inspectorTab: {
			// General tabs
			properties: "PROPERTIES",
			dependencies: "DEPENDENCIES",
			images: "IMAGES",
			gradinghistory: "GRADINGHISTORY",
			status: "STATUS",

			// Characteristic related tabs
			values: "VALUES",

			// Operation related tabs
			operationComponents: "OPERATIONCOMPONENTS",
			prts: "PRTS"
		}
	};
});
