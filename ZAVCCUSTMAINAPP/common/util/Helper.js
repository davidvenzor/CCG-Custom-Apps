/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/core/mvc/View"
], function(View) {
		var Helper = {
		
			createCharacteristicKey: function(oCharacteristic, oCsticData) {
				var oModel = oCharacteristic.getModel("vchclf");
				var sKey= oModel.createKey("CharacteristicSet", {
					ContextId: oCsticData.ContextId,
					InstanceId: oCsticData.InstanceId,
					GroupId: oCsticData.GroupId,
					CsticId: oCsticData.CsticId
				});
				return "/"+sKey;
			},
			
			isContentOfArrayEqual: function (aArray1, aArray2) {
				if (!aArray1 || !aArray2) {
					return false;
				}

				if (aArray1.length !== aArray2.length) {
					return false;
				}

				var iCount = 0;
				aArray1.forEach(function (oValue1) {
					aArray2.forEach(function (oValue2) {
						if (oValue1 === oValue2) {
							iCount++;
						}
					});
				});

				return aArray1.length === iCount;
			},
			
			uuidv4: function() {
				return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
					var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
					return v.toString(16);
				});
			},
			
			/**
			* Whether the given request has been issued by the configuration component
			* @param {object} oRequest - request object
			* @return {boolean} - true if issued by configuration, otherwise false
			*/
			requestIsFromConfiguration: function (oRequest) {
				var sUrl = oRequest.url;

				return !!sUrl &&
					sUrl.indexOf("VCH(12)SEMANTIC_OBJ") >= 0 &&
					sUrl.indexOf("(14)EMBEDDING_MODE") > 0;
			}

		
		};
		return Helper;
	}
);
