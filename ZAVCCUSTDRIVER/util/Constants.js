/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(
	function() {
		var Constants = {
			SEMANTIC_OBJECT: {
				SALES_ORDER: "SalesOrder"
			},
			ETO_STATUS : {
				PROCESSING_STARTED : "IETST",
				READY_FOR_ENGINEERING : "IETRE",
				IN_PROCESS_BY_ENGINEERING : "IETPE",
				ENGINEERING_FINISHED : "IETFE",
				PROCESSING_FINISHED : "IETCO",
				REVIEW_FINISHED_BY_SALES: "IETRD",
				REVISED_BY_SALES: "IETRS",
				REENGINEERING_NEEDED: "IETHB"
			}
		};
		return Constants;
	}
);