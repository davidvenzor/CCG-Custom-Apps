/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([], function () {
	"use strict";

	/** EventProvider class for unifining events inside the component
	 * @public
	 * @class
	 */
	var EventProvider = sap.ui.base.ManagedObject.extend(
		"sap.i2d.lo.lib.zvchclfz.components.inspector.logic.EventProvider", {
			metadata: {
				events: {
					/** Event to trigger the back navigation in the inspector */
					navigateBack: {
						parameters: {}
					},

					/** Event fired when the trace is starting to activate */
					activateTrace: {
						parameters: {}
					},

					/** Event fired when the trace is starting to deactivate */
					deactivateTrace: {
						parameters: {}
					},

					/** Event fired when the trace is reset */
					resetTrace: {
						parameters: {}
					},

					/** Event fired when the trace state is to be saved */
					saveTraceState: {
						parameters: {}
					},

					/** Event fired when the trace state is to be restored */
					restoreTraceState: {
						parameters: {}
					},

					/** Event used for notifying the trace to fetch latest entries  */
					fetchTrace: {
						parameters: {}
					},

					/** Event used for rebind values to the list on values tab with specify csticPath  */
					rebindValueList: {
						parameters: {
							csticPath: {
								type: "string"
							}
						}
					},

					/** Event to set the focus on the Inspector frame header, when working in the Inspecotr or Trace */
					setFocusOnHeader: {
						parameters: {}
					},
					
					/** Event fired when the comparison is reset */
					resetComparison: {
						parameters: {}
					},
					
					/** Event fired to initialize the comparison */
					initComparison: {
						parameters: {
							configurationContextId: {
								type: "string"
							},
							sampleDataPath: {
								type: "string"
							}
						}
					},
					
					/** Event fired when the comparison data has been converted */
					comparisonDataConverted: {
						parameters: {
							items: {
								type: "array"
							},
							contextId: {
								type: "string"
							}
						}
					},
					
					/** Event fired when a configurable Item is selected and the Comparison view should be restricted to the selected instance **/
					restrictComparison: {
						parameters: {
							oConfigurationInstance: {
								type: "object"
							}
						}
					},

					/** Event to switch the tab of inspector to a specific one */
					changeTheSelectedTabOfInspector: {
						parameters: {
							tabKey: {
								type: "string"
							}
						}
					}
				}
			}
		}
	);

	return new EventProvider();
});
