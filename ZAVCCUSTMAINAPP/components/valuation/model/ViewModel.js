/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([
	"jquery.sap.global",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/message/Message",
	"sap/i2d/lo/lib/zvchclfz/common/util/Logger"
], function (jQuery, JSONModel, Message, Logger) {
	"use strict";

	var GROUPS_EVENT_PARAMETER = "groups";

	/**
	 * The view model is responsible for handling synchronization of the ODataModel to be more flexible in how to load data
	 *
	 * @param {sap.i2d.lo.lib.zvchclfz.components.valuation.dao.ValuationDAO} oDAO The valuation Data Acces Object to retrieve and sync the data from
	 * @param {object} [oData] an object for custom data
	 * @author SAP SE
	 * @version 9.0.1
	 * @private
	 * @alias sap.i2d.lo.lib.zvchclfz.components.valuation.model.ViewModel
	 * @extends sap.ui.model.json.JSONModel
	 */
	var ViewModel = JSONModel.extend("sap.i2d.lo.lib.zvchclfz.components.valuation.model.ViewModel", { /** @lends sap.i2d.lo.lib.zvchclfz.components.valuation.model.ViewModel.prototype */

		_oDAO: null,
		_sBindingPath: null,
		_mPreloadedCharacteristics: null,
		_mCsticGroupGeometryChange: {},
		_oI18nModel: null,

		constructor: function (oDAO, oI18nModel) {
			this._mPreloadedCharacteristics = {};
			this._oDAO = oDAO;
			this._oDAO.attachGroupsChanged(this._onGroupsChanged, this);
			this._oDAO.attachCharacteristicsChanged(this._onCharacteristicsChanged, this);
			this._oDAO.attachCharacteristicChanged(this._onCharacteristicChanged, this);
			this._oDAO.attachCharacteristicCountChanged(this._onCharacteristicCountChanged, this);
			this._oDAO.attachMessagesChanged(this._onMessagesChanged, this);
			this._oI18nModel = oI18nModel;

			JSONModel.call(this, {});
			this.resetInconsistencyData();
		},
		
		/**
         * Resets the stored inconsistency data
		 * @public
		 */
		resetInconsistencyData: function() {
			JSONModel.prototype.setProperty.apply(this, ["/InconsistencyData", {}]);
		},
		
		resetGroupCounts: function() {
			JSONModel.prototype.setProperty.apply(this, ["/GroupCsticCounts", {}]);
		},
		
		/**
         * Stores retrieved inconsistency information into the model
         * @param {string} sContextId - the context id
         * @param {array} aInconsistencyInfoExpanded - array of expanded InconsistencyInformation entity objects
         */
		setInconsistencyInformation: function(sContextId, aInconsistencyInfoExpanded) {
			if (sContextId && aInconsistencyInfoExpanded) {
				var oInconsistencyData = JSONModel.prototype.getProperty.apply(this, ["/InconsistencyData"]);
				oInconsistencyData[sContextId] = aInconsistencyInfoExpanded;
				var aInconsistentCsticIds = this._getInconsistentCsticIds(sContextId);
				for (var i=0; i < aInconsistentCsticIds.length; i++) {
					var aGroups = this._getGroupsForCstic(aInconsistentCsticIds[i]);
					aGroups.forEach(function(oGroup) {
						this._computeCharacteristicValueStateFromIds(oGroup.GroupId, aInconsistentCsticIds[i]);
					}.bind(this));
				}
			} else {
				this.resetInconsistencyData();
			}
		},
		
		/**
         * Returns whether a characteristic is found in stored inconsistency data
         * @param {string} sContextId - the context id
         * @param {string} sCsticId - characteristic id
         * @return {boolean} <code>true</code> if a characteristic with the specified id is found in inconsistency data - <code>false</code> otherwise
         */
		_isInconsistent: function(sContextId, sCsticId) {
			return $.inArray(sCsticId, this._getInconsistentCsticIds(sContextId)) > -1;
		},
		
		/**
         * Returns characteristics found in stored inconsistency data for the given context id
         * @param {string} sContextId - the context id
         * @return {array} an array of characteristic ids
         */
		_getInconsistentCsticIds: function(sContextId) {
			var aResult = [];
			var aInconsistencyInformation = this.getProperty("/InconsistencyData/" + sContextId);
			var aDetails;
			if (aInconsistencyInformation) {
				for (var i=0; i < aInconsistencyInformation.length; i++) {
					aDetails = aInconsistencyInformation[i].Details.results;
					for (var j=0; j < aDetails.length; j++) {
						aResult.push(aDetails[j].CsticId);
					}
				}
			}
			return aResult;
		},
		
		/**
         * Computes the value state for the given characteristic
         * @param {sap.i2d.lo.lib.zvchclfz.components.valuation.control.characteristic.Characteristic} oCstic - characteristic entity object
         */
		_computeCharacteristicValueState: function(oCstic) {	
			var oRb = this._oI18nModel.getResourceBundle();
			
			// disable for now that inconsistencies influence the value state until
            // it is rendered via the new concept as an additional marker on the upper right of the field
            // 
			var bInconsistent = false; //this._isInconsistent(oCstic.ContextId, oCstic.CsticId);

			var sValueState;
			var sValueStateText;
			
			if (oCstic.HasValueContradiction ||
			    oCstic.IsInconsistent ||
				bInconsistent) {
				sValueState = "Error";
				
				if (oCstic.HasValueContradiction) {
					sValueStateText = oRb.getText("value_contradiction");
				} else {
					sValueStateText = oRb.getText("inconsistent");
				}
			} else if (oCstic.HasValueProposal) {
				sValueState = "Warning";
				sValueStateText = oRb.getText("VALUE_STATE_PROPOSAL", [oCstic.ProposalConfidence]);
			} else {
				sValueState = "None";
				sValueStateText = undefined;
			}
			
			this._createProperty("/ValueStates/" + oCstic.ContextId + "/" + oCstic.GroupId + "/" + oCstic.CsticId, {
				valueState: sValueState,
				valueStateText: sValueStateText
			});
		},
		
		/**
         * Computes the value state for the given characteristic specified by group and characteristic id
         * @param {integer} iGroupId - characteristic group id
         * @param {string} sCsticId - id of the characteristic
         */
		_computeCharacteristicValueStateFromIds: function(iGroupId, sCsticId) {
			var iGroupIndex = this.getGroupIndexById(iGroupId);
			var sCsticPath = this._getCharacteristicPathById(sCsticId, iGroupIndex);
			var oCstic = this.getProperty(sCsticPath);
			
			return this._computeCharacteristicValueState(oCstic);
		},
		
		/**
         * Stores a property to the model - all objects which are part of the path navigation to the property are automatically created if they do no exist
         * @param {string} sPath - property path
         * @param {object} oValue - the object to store
         */
		_createProperty: function(sPath, oValue) {
			var aPathElements = sPath.split("/");
			var sLastPathEl = aPathElements[aPathElements.length - 1];
			var sTmpPath = "";
			var o;
			for (var i=1; i < aPathElements.length - 1; i++) {
				sTmpPath = sTmpPath + "/" + aPathElements[i];
				o = this.getProperty(sTmpPath);
				if (!o) {
					JSONModel.prototype.setProperty.apply(this, [sTmpPath, {}]);
				}
			}
			JSONModel.prototype.setProperty.apply(this, [sTmpPath + "/" + sLastPathEl, oValue]);
		},
		
		/**
         * Returns the groups to which a characteristic has been assigned
         * @param {string} sCsticId - the characteristic id
         * @return {array} an array of characteristic group entity objects
         */
		_getGroupsForCstic: function(sCsticId) {
			var aResult = [];
			var aGroups = this.getGroups();
			var aCstics;
			if (aGroups) {
				for (var i=0; i < aGroups.length; i++) {
					aCstics = aGroups[i].Characteristics;
					if (aCstics) {
						for (var j=0; j < aCstics.length; j++) {
							if (aCstics[j].CsticId === sCsticId) {
								aResult.push(aGroups[i]);
							}
						}
					}
				}
			}
			return aResult;
		},

		/**
		 * @private
		 */
		_getDAO: function () {
			return this._oDAO;
		},

		/**
		 * @private
		 */
		_onGroupsChanged: function (oEvt) {
			this.setGroups(oEvt.getParameter(GROUPS_EVENT_PARAMETER), true);
		},

		/**
		 * @private
		 */
		_onCharacteristicsChanged: function (oEvt) {
			var iGroupId = oEvt.getParameter("groupId");
			var iGroupIndex = this.getGroupIndexById(iGroupId);
			var aCharacteristics = oEvt.getParameter("changedCharacteristics");
			this._computeCharacteristicsGeometryChangeFlag(aCharacteristics);
			if (jQuery.isNumeric(iGroupIndex)) {
				this.setCharacteristics(iGroupIndex, oEvt.getParameter("changedCharacteristics"), oEvt.getParameter("merge"));
			} else {
				this._mPreloadedCharacteristics[iGroupId] = aCharacteristics;
			}
		},

		/**
		 * @private
		 */
		_onCharacteristicChanged: function (oEvt) {
			var oCharacteristic = oEvt.getParameter("changedCharacteristic");
			var iGroupId = oCharacteristic.GroupId;
			var sCharacteristicId = oCharacteristic.CsticId;
			var iGroupIndex = this.getGroupIndexById(iGroupId);
			var iCharacteristicIndex = this.getCharacteristicIndexById(iGroupIndex, sCharacteristicId);
			this.setCharacteristic(iGroupIndex, iCharacteristicIndex, oCharacteristic);
		},
		
		/**
		 * @private
		 */
		 _onCharacteristicCountChanged: function(oEvt) {
			var iGroupId = oEvt.getParameter("groupId");
			var iNewCsticCount = oEvt.getParameter("changedCharacteristicCount");
			var sGroupCsticCountsGroupPath = this._getGroupCsticCountsGroupPath(iGroupId);

			// The "place" to store may not yet be existing 
			this._createProperty(sGroupCsticCountsGroupPath, {
				csticCount: iNewCsticCount
			});
		 },
		
		/**
		 * Computes the characteristics geometry flag by comparing given characteristics with currently existing cstics in model
		 * @private
		 */
		_computeCharacteristicsGeometryChangeFlag: function(aCharacteristics) {
			if (aCharacteristics.length > 1) {
				var iGroupIndex = this.getGroupIndexById(aCharacteristics[0].GroupId);
				
				this._mCsticGroupGeometryChange[aCharacteristics[0].GroupId] = false;
				
				var sPath = this._getCharacteristicsGroupCharacteristicsPath(iGroupIndex);
				var aCurrentCharacteristics = this.getProperty(sPath);
				var iIndex;
				
				// no cstics present
				if (!aCurrentCharacteristics) {
					this._mCsticGroupGeometryChange[aCharacteristics[0].GroupId] = true;
				// more cstics than present
				} else if (aCurrentCharacteristics.length < aCharacteristics.length) {
					this._mCsticGroupGeometryChange[aCharacteristics[0].GroupId] = true;
				} else {
					for (var i = 1; i < aCharacteristics.length; i++) {
						iIndex = this.getCharacteristicIndexById(iGroupIndex, aCharacteristics[i].CsticId);
						// new cstic
						if (!iIndex) {
							this._mCsticGroupGeometryChange[aCharacteristics[i].GroupId] = true;
							break;
						} else {
							// check if hidden flag changed
							if (aCurrentCharacteristics[iIndex].IsHidden !== aCharacteristics[i].IsHidden) {
								this._mCsticGroupGeometryChange[aCharacteristics[i].GroupId] = true;
								break;
							}
						}
					}	
				}
				Logger.logDebug("Characteristic geometry change flag for group '" + aCharacteristics[0].GroupId + "' - " + this._mCsticGroupGeometryChange[aCharacteristics[0].GroupId], null, this);
			}
		},
		
		/**
		 * Returns the characteristics geometry flag which indicates whether since last value assignment the amount and/or position of cstics has changed in the specified group
		 * Important: the flag is re-evaluated every time the 'CharacteristicsChanged' event is fired - in special edge cases it may happen that the flag is returning <code>true</code> although
		 * the geometry stays the same (the algorithm assumes in case of uncertainties always a geometry change to not wrongly display an out-dated UI)   
		 * 
		 * @param {integer} iGroupId - the group id
		 * @return {boolean} the characteristics geometry flag - <code>true</code> if amount and/or position of cstics has changed - otherwise <code>false</code>
		 * @public
		 */
		hasCharacteristicsGeometryChanged: function(iGroupId) {
			if (this._mCsticGroupGeometryChange[iGroupId] === undefined) {
				return true;
			} else {
				return this._mCsticGroupGeometryChange[iGroupId];
			}
		},

		/**
		 * @private
		 */
		_getCharacteristicsGroupsPath: function () {
			return this.getBindingPath() + "/CharacteristicsGroups";
		},

		/**
		 * @private
		 */
		_getCharacteristicsGroupPath: function (iGroupIndex) {
			return this.getBindingPath() + "/CharacteristicsGroups/" + iGroupIndex;
		},
		
		_getGroupCsticCountsGroupPath: function(iGroupId) {
			return "/GroupCsticCounts/" + iGroupId; 
		},

		/**
		 * @private
		 */
		_getCharacteristicsGroupCharacteristicsPath: function (iGroupIndex) {
			return this.getBindingPath() + "/CharacteristicsGroups/" + iGroupIndex + "/Characteristics";
		},

		/**
		 * @private
		 */
		_getCharacteristicsGroupCharacteristicPath: function (iGroupIndex, iCharacteristicIndex) {
			return this.getBindingPath() + "/CharacteristicsGroups/" + iGroupIndex + "/Characteristics/" + iCharacteristicIndex;
		},

		/**
		 * @public
		 */
		setBindingPath: function (sBindingPath) {
			this._sBindingPath = sBindingPath;
			var oData = this.getData();
			if (!oData[this._getKey()]) {
				oData[this._getKey()] = {
					CharacteristicsGroups: null
				};
			}
			this.setData(oData, true);
		},

		/**
		 * @override
		 */
		setData: function (oData, bMerge) {
			var oNormalizedData = this._getDAO().normalize(oData);
			return JSONModel.prototype.setData.call(
				this,
				oNormalizedData,
				bMerge
			);
		},

		/**
		 * @override
		 */
		setProperty: function (sPath, vData, oContext, bAsyncUpdate) {
			var vNormalizedData = this._getDAO().normalize(vData);
			return JSONModel.prototype.setProperty.call(
				this,
				sPath,
				vNormalizedData,
				oContext,
				bAsyncUpdate
			);
		},

		/**
		 * @private
		 */
		_getKey: function () {
			return this.getBindingPath().substring(1, this._sBindingPath.length);
		},

		/**
		 * @public
		 */
		getBindingPath: function () {
			return this._sBindingPath;
		},

		/**
		 * @private
		 */
		_syncCachedGroups: function () {
			var aGroups = this._getDAO().getCharacteristicGroups(this.getBindingPath());
			this.setGroups(aGroups, false);
		},

		/**
		 * @public
		 */
		sync: function (iGroupId, bForceRefresh) {
			return new Promise(function (resolve, reject) {
				var fnReadCharacteristicsAndSetBindingContext = function (oContext) {
					var aGroups = this.getGroups();
					if (iGroupId) {
						for (var i = 0; i < aGroups.length; i++) {
							if (aGroups[i].GroupId === iGroupId) {
								this._getDAO().readCharacteristicsOfGroup({
									ContextId: aGroups[i].ContextId,
									InstanceId: aGroups[i].InstanceId,
									GroupId: iGroupId
								}, false, true).then(function () {
									this._syncMessages();
									resolve(oContext);
								}.bind(this));
							}
						}
					} else {
						this._getDAO().readCharacteristics(oContext, false, true).then(function () {
							this._syncMessages();
							resolve(oContext);
						}.bind(this));
					}
				}.bind(this);

				var fnReadGroups = function (oContext) {
					if (!this.hasGroups()) {
						this._getDAO().readCharacteristicsGroups(oContext).then(function () {
							fnReadCharacteristicsAndSetBindingContext(oContext);
						});
					} else {
						fnReadCharacteristicsAndSetBindingContext(oContext);
					}
				}.bind(this);

				if (bForceRefresh) {
					this.setGroups([], false);
				} else {
					this._syncCachedGroups();
				}
				this.createBindingContext(this.getBindingPath(), function (oContext) {
					fnReadGroups(oContext);
				}.bind(this));
			}.bind(this));
		},

		/**
		 * @private
		 */
		_onMessagesChanged: function (oEvent) {
			this._syncMessages();
		},

		/**
		 * @private
		 */
		_syncMessages: function () {
			var aMessages = this._getDAO().getCharacteristicMessages() || [];
			var mMessages = {};

			for (var i = 0; i < aMessages.length; i++) {
				var oMessage = aMessages[i];
				var sMessageTarget = oMessage.getTarget().replace("/CsticId", "");
				var oCharacteristic = this._getDAO().getDataModel().getObject(sMessageTarget);
				var aGroups = this.getGroups();

				if (oCharacteristic && aGroups) {
					jQuery.each(aGroups, function (iGroupIndex, oGroup) {
						if (oGroup.ContextId === oCharacteristic.ContextId && oGroup.InstanceId === oCharacteristic.InstanceId &&
							oGroup.GroupId === oCharacteristic.GroupId) {
							var sTargetPath = this._getCharacteristicPathById(oCharacteristic.CsticId, iGroupIndex);
							var oNewMessage = this._createMessage(oMessage, sTargetPath);
							mMessages[oNewMessage.getTarget()] = oNewMessage;
						}
						return true;
					}.bind(this));
				}
			}
			this.setMessages(mMessages);
		},

		/**
		 * @private
		 */
		_createMessage: function (oMessage, sNewTarget) {

			var oNewMessage = new Message({
				target: sNewTarget,
				description: oMessage.getDescription(),
				processor: this,
				message: oMessage.getMessage(),
				type: oMessage.getType(),
				descriptionUrl: oMessage.getDescriptionUrl(),
				additionalText: oMessage.getAdditionalText(),
				code: oMessage.getCode(),
				technical: oMessage.getTechnical(),
				persistent: oMessage.getPersistent()
			});

			return oNewMessage;
		},

		/**
		 * @public
		 */
		syncCharacteristics: function (oGroup) {
			return this._oDAO.readCharacteristicsOfGroup(oGroup, true).then(function () {
				this._syncMessages();
			}.bind(this));
		},

		/**
		 * @public
		 */
		getGroup: function (iGroupIndex) {
			return this.getProperty(this._getCharacteristicsGroupPath(iGroupIndex));
		},

		/**
		 * @public
		 */
		getGroupIndexById: function (iGroupId) {
			var aGroups = this.getGroups();
			var iGroupIndex = null;
			jQuery.each(aGroups, function (iIndex, oGroup) {
				if (oGroup.GroupId === iGroupId) {
					iGroupIndex = iIndex;
					return false;
				} else {
					return true;
				}
			});
			return iGroupIndex;
		},

		/**
		 * @public
		 */
		_getCharacteristicPathById: function (sCharacteristicId, iGroupIndex) {
			var aCharacteristics = this.getCharacteristics(iGroupIndex);
			var iCharacteristicIndex = null;
			jQuery.each(aCharacteristics, function (iCsticIndex, oCurrentCharacteristic) {
				if (oCurrentCharacteristic.CsticId === sCharacteristicId) {
					iCharacteristicIndex = iCsticIndex;
					return false;
				} else {
					return true;
				}
			});

			var sCharacteristicPath = this._getCharacteristicsGroupCharacteristicPath(iGroupIndex, iCharacteristicIndex);
			return sCharacteristicPath;
		},

		/**
		 * @public
		 */
		getCharacteristicIndexById: function (iGroupIndex, sCharacteristicId) {
			var aCharacteristics = this.getCharacteristics(iGroupIndex);
			var iCharacteristicIndex = null;
			jQuery.each(aCharacteristics, function (iIndex, oCharacteristic) {
				if (oCharacteristic.CsticId === sCharacteristicId) {
					iCharacteristicIndex = iIndex;
					return false;
				} else {
					return true;
				}
			});
			return iCharacteristicIndex;
		},
		
		
		/**
		 * This function updates the properties characteristic groups as received from the odata request.
		 * The characteristics are not update here. 
		 * @param {array} aGroups: Array of characterisic groups
		 * @public
		 * @function
		 */
		updateGroupsProperties: function (aGroups) {
			var aCurrentGroups = this.getGroups();
			if (aCurrentGroups) {
				jQuery.each(aGroups, function (iIndex, oGroup) {
					var oCurrentGroup = this.getGroup(iIndex);
					if (oCurrentGroup) {
						delete oGroup.Characteristics;
						jQuery.extend(oCurrentGroup, oGroup);
					}
				}.bind(this));
			}
		},
		
		/**
		 * This function processes the characteristic groups that have been received from the odata request:
		 * - Characteristics from existings groups are updated (merged)
		 *   and new groups are inserted
		 * - or replace all groups
		 * @param {array} aGroups: Array of characterisic groups
		 * @param {boolean} bMerge: Indicator for updating existing groups
		 * @public
		 * @function
		 */
		setGroups: function (aGroups, bMerge) {
			var aCurrentGroups = this.getGroups();
			var bNewGroup = false; 
			if (aCurrentGroups && aCurrentGroups.length && bMerge) {
				jQuery.each(aGroups, function (iIndex, oGroup) {
					var oCurrentGroup = this.getGroup(iIndex);
					if (oCurrentGroup) {
						this.setCharacteristics(iIndex, oGroup.Characteristics, true);
					} else {
						aCurrentGroups.push(oGroup);
						bNewGroup = true;
					}
				}.bind(this));
				if (bNewGroup) {
					this.setProperty(this._getCharacteristicsGroupsPath(), aCurrentGroups);
				}
			} else {
				this.setProperty(this._getCharacteristicsGroupsPath(), aGroups);
				if (!jQuery.isEmptyObject(this._mPreloadedCharacteristics)) {
					jQuery.each(this._mPreloadedCharacteristics, function (iGroupId, aCharacteristics) {
						var iGroupIndex = this.getGroupIndexById(iGroupId);
						this.setCharacteristics(iGroupIndex, aCharacteristics, false);
					}.bind(this));
					this._mPreloadedCharacteristics = {};
				}
			}
		},

		/**
		 * @public
		 */
		getGroups: function () {
			return this.getProperty(this._getCharacteristicsGroupsPath());
		},

		/**
		 * @public
		 */
		hasGroups: function () {
			var aGroups = this.getGroups();
			return aGroups && aGroups.length > 0;
		},

		/**
		 * @public
		 */
		hasCharacteristics: function (iGroupId) {
			var aGroups = this.getGroups() || [];
			var bHasCharacteristics = false;
			jQuery.each(aGroups, function (iIndex, oGroup) {
				if (iGroupId && iGroupId === oGroup.GroupId && oGroup.Characteristics) {
					bHasCharacteristics = true;
					return false;
				} else if (!iGroupId && oGroup.Characteristics) {
					bHasCharacteristics = true;
				} else if (!iGroupId) {
					bHasCharacteristics = false;
					return false;
				}
				return true;
			});
			return bHasCharacteristics;
		},

		/**
		 * @public
		 */
		setCharacteristic: function (iGroupIndex, iCharacteristicIndex, oCharacteristic) {
			this.setProperty(this._getCharacteristicsGroupCharacteristicPath(iGroupIndex, iCharacteristicIndex), oCharacteristic);
		},

		/**
		 * @public
		 */
		getCharacteristic: function (iGroupIndex, iCharacteristicIndex) {
			return this.getProperty(this._getCharacteristicsGroupCharacteristicPath(iGroupIndex, iCharacteristicIndex));
		},

		/**
		 * @public
		 */
		getCharacteristics: function (iGroupIndex) {
			return this.getProperty(this._getCharacteristicsGroupCharacteristicsPath(iGroupIndex));
		},

		/**
		 * @public
		 */
		setCharacteristics: function (iGroupIndex, aCharacteristics, bMerge) {
			if (bMerge) {
				var aCurrentCharacteristics = this.getCharacteristics(iGroupIndex) || [];
				jQuery.each(aCharacteristics, function (iIndex, oCharacteristic) {
					var bFound = false;
					jQuery.each(aCurrentCharacteristics, function (iCurrentIndex, oCurrentCharacteristic) {
						if (oCurrentCharacteristic.CsticId === oCharacteristic.CsticId) {
							aCurrentCharacteristics[iCurrentIndex] = jQuery.extend(oCurrentCharacteristic, oCharacteristic);
							bFound = true;
							return false;
						} else {
							return true;
						}
					});
					if (!bFound) {
						aCurrentCharacteristics.push(oCharacteristic);
					}
				});
				this.setProperty(this._getCharacteristicsGroupCharacteristicsPath(iGroupIndex), aCurrentCharacteristics);
				aCurrentCharacteristics.forEach(this._computeCharacteristicValueState.bind(this));
			} else {
				var oGroup = this.getGroup(iGroupIndex);
				if (oGroup) {
					this.setProperty(this._getCharacteristicsGroupCharacteristicsPath(iGroupIndex), aCharacteristics);
					aCharacteristics.forEach(this._computeCharacteristicValueState.bind(this));
				}
			}
		},

		/**
		 * @public
		 */
		reset: function () {
			this.setData({});
			
			this._mCsticGroupGeometryChange = {};
		}

	});

	return ViewModel;
});
