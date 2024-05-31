/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(
	function() {
		return {
			aPropertyBindings: [],

			addPropertyBinding: function(oPropertyBinding) {
				this.aPropertyBindings.push(oPropertyBinding);
			},

			clearPropertyBindings: function() {
				this.aPropertyBindings.forEach(function(oPropertyBinding) {
					oPropertyBinding.destroy();
				});

				this.aPropertyBindings = [];
			}
		};
	}
);
