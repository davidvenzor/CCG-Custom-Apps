/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/common/Constants",
	"sap/base/strings/formatMessage"
], function (Constants, formatMessage) {

	"use strict";
	var oFormatter = {

		_formatMessage: function (sI18nText, sLastStatusTypeDescription, sNewStatusTypeDescription) {
			return formatMessage(sI18nText, [sLastStatusTypeDescription, sNewStatusTypeDescription]);
		},

		/**
		 * @private
		 */
		_getInconsistencyInformationControlData: function (aInconsistencyInformation) {
			var bHasObjectDependencyInformation = false;
			var bHasSingleLongTextInformation = false;
			var bHasMultipleLongTextInformation = false;
			var bHasCsticInformation = false;

			if (aInconsistencyInformation) {
				for (var i = 0; i < aInconsistencyInformation.length; i++) {
					var oInconsistencyInformation = this.getView().getModel("vchclf").getProperty("/" + aInconsistencyInformation[i]);
					if (oInconsistencyInformation.DependencyId) {
						//there is at least one failing object dependency => no cstic information can be available
						bHasObjectDependencyInformation = true;
						bHasCsticInformation = false;

						var aFilteredInconsistencyInformation = aInconsistencyInformation.filter(function (sInconsistencyInformationPath) {
							var oInconsistencyInformationData = this.getView().getModel("vchclf").getProperty("/" + sInconsistencyInformationPath);
							return oInconsistencyInformationData.HasDocumentation;
						}.bind(this));

						if (aFilteredInconsistencyInformation.length > 1) {
							bHasMultipleLongTextInformation = true;
						} else if (aFilteredInconsistencyInformation.length === 1) {
							bHasSingleLongTextInformation = true;
						}
						break;
					} else {
						bHasObjectDependencyInformation = false;

						if (oInconsistencyInformation.CsticId) {
							bHasCsticInformation = true;
						}
					}
				}
			}

			return {
				hasObjectDependencyInformation: bHasObjectDependencyInformation,
				hasMultipleLongTextInformation: bHasMultipleLongTextInformation,
				hasSingleLongTextInformation: bHasSingleLongTextInformation,
				hasCsticInformation: bHasCsticInformation,
				hasInconsistency: bHasCsticInformation 
									|| bHasSingleLongTextInformation 
									|| bHasMultipleLongTextInformation 
									|| bHasObjectDependencyInformation
			};

		},
		
		isInconsistentMessageStripVisible: function (sStatusType, aInconsistencyInformation) {
			if (sStatusType === '4') { 
				return true;
			} else if (sStatusType === '2') {
				var oInconsistencyInformationFormatter = this.getFormatter("InconsistencyInformationFormatter");
				return oInconsistencyInformationFormatter._getInconsistencyInformationControlData.call(this, aInconsistencyInformation).hasInconsistency;
			} else {
				return false;
			}
		},

		formatCsticValue: function (sI18nText, sValueFrom, sValueTo, sDescription, sI18nIntervalRepresentationText, sDescriptionMode) {
			var sName = sValueFrom;
			if (sValueTo) {
				sName = formatMessage(sI18nIntervalRepresentationText, [sValueFrom, sValueTo]);
			}
			return this.getFormatter("InconsistencyInformationFormatter").combineDescriptionAndValue(sI18nText, sName, sDescription,
				sDescriptionMode);
		},

		combineDescriptionAndValue: function (sI18nText, sName, sDescription, sDescriptionMode) {
			switch (sDescriptionMode) {
			case sap.i2d.lo.lib.zvchclfz.common.type.DescriptionMode.TechnicalName:
				return sName;
			case sap.i2d.lo.lib.zvchclfz.common.type.DescriptionMode.Description:
				return sDescription || sName;
			case sap.i2d.lo.lib.zvchclfz.common.type.DescriptionMode.Both:
				if ((!!sDescription && !!sName) &&
					(sDescription !== sName)) {
					return formatMessage(sI18nText, [sDescription, sName]);
				} else {
					return sDescription || sName;
				}
			default:
				return sDescription || sName;
			}
		},

		/**
		 * Formatter. Is used to display the right text in a message strip when the configuration is inconsistent 
		 * 
		 * @param {Array} aInstances: configuration instances to use for the formatter
		 * @param {string} sI18nText: i18n text
		 * @returns {string} text for inconstistent instance
		 * @public
		 * @function
		 */
		getTextForInconsistentInstance: function (aInstancePath, sI18nMultilevelInstanceText, sI18nSinglelevelInstanceText,
			sI18nMultilevelInstanceTextWithCsticInfo, sI18nSinglelevelInstanceTextWithCsticInfo, sStatusType, aInconsistencyInformation,
			sDescriptionMode, sI18nDescriptionModeBoth) {
			var bIsMultiLevel = false;

			var oInconsistencyInformationFormatter = this.getFormatter("InconsistencyInformationFormatter");

			var sInstanceName = "";
			var sI18nText = sI18nSinglelevelInstanceText;
			if (!aInstancePath) {
				return;
			}

			//i18n decision on input data
			if (aInstancePath.length > 1) {
				bIsMultiLevel = true;
			}

			var oInconsistencyInfoControlData = oInconsistencyInformationFormatter._getInconsistencyInformationControlData.call(this,
				aInconsistencyInformation);
			if (bIsMultiLevel) {
				if (oInconsistencyInfoControlData.hasCsticInformation) {
					sI18nText = sI18nMultilevelInstanceTextWithCsticInfo;
				} else {
					sI18nText = sI18nMultilevelInstanceText;
				}

				aInstancePath.forEach(function (sInstancePath) {
					var oInstance = this.getView().getModel("vchclf").getProperty("/" + sInstancePath);
					if (oInstance.ConfigurationValidationStatus === "4") {
						sInstanceName = oInconsistencyInformationFormatter.combineDescriptionAndValue(sI18nDescriptionModeBoth, oInstance.Material,
							oInstance.MaterialDescription,
							sDescriptionMode);
						return false;
					}
				}.bind(this));
			} else {
				if (oInconsistencyInfoControlData.hasCsticInformation) {
					sI18nText = sI18nSinglelevelInstanceTextWithCsticInfo;
				} else {
					sI18nText = sI18nSinglelevelInstanceText;
				}
				var oInstance = this.getView().getModel("vchclf").getProperty("/" + aInstancePath[0]);
				sInstanceName = oInconsistencyInformationFormatter.combineDescriptionAndValue(sI18nDescriptionModeBoth, oInstance.Material,
					oInstance.MaterialDescription,
					sDescriptionMode);
			}

			var sCsticText = "";

			if (oInconsistencyInfoControlData.hasCsticInformation) {
				aInconsistencyInformation.forEach(function (sInconsistencyInformationPath) {
					var oInconsistencyInformationData = this.getView().getModel("vchclf").getProperty("/" + sInconsistencyInformationPath);
					var oCsticDescription = oInconsistencyInformationData.CsticDescription;
					var oCsticName = oInconsistencyInformationData.CsticName;
					sCsticText = oInconsistencyInformationFormatter.combineDescriptionAndValue(sI18nDescriptionModeBoth, oCsticName,
						oCsticDescription, sDescriptionMode);
					return false;
				}.bind(this));
			}

			return formatMessage(sI18nText, [sInstanceName, sCsticText]);
		},

		getTextForInconsistencyLink: function (sI18nInconsistencyWithDocumentationText, aInconsistencyInformation) {
			var oInconsistencyInfoControlData = {};
			if (this._getInconsistencyInformationControlData) {
				oInconsistencyInfoControlData = this._getInconsistencyInformationControlData(
					aInconsistencyInformation);
			} else {
				oInconsistencyInfoControlData = this.getFormatter("InconsistencyInformationFormatter")._getInconsistencyInformationControlData.call(
					this,
					aInconsistencyInformation);
			}

			if (oInconsistencyInfoControlData.hasMultipleLongTextInformation || oInconsistencyInfoControlData.hasSingleLongTextInformation ||
				oInconsistencyInfoControlData.hasObjectDependencyInformation) {
				return sI18nInconsistencyWithDocumentationText;
			} else {
				return "";
			}
		},

		getVisibilityOfInconsistencyLink: function (sI18nInconsistencyWithDocumentationText, aInconsistencyInformation) {
			var sLinkText = this.getFormatter("InconsistencyInformationFormatter").getTextForInconsistencyLink.call(this,
				sI18nInconsistencyWithDocumentationText, aInconsistencyInformation);

			if (sLinkText) {
				return true;
			} else {
				return false;
			}
		},

		getDocumentationVisibility: function (sType, aInconsistencyInformation) {
			if(!aInconsistencyInformation || aInconsistencyInformation.length === 0){
				return false;
			}
			var oInconsistencyInfoControlData = this.getFormatter("InconsistencyInformationFormatter")._getInconsistencyInformationControlData.call(
				this,
				aInconsistencyInformation);
			var bVisible = false;
			switch (sType) {
			case Constants.INCONSISTENCY_INFORMATION.MULTI_DOCU:
				if ((oInconsistencyInfoControlData.hasMultipleLongTextInformation ||
						aInconsistencyInformation.length > 1)) {
					bVisible = true;
				}
				break;
			case Constants.INCONSISTENCY_INFORMATION.SINGLE_DOCU:
				if (oInconsistencyInfoControlData.hasSingleLongTextInformation &&
					aInconsistencyInformation.length === 1) {
					bVisible = true;
				} else if (oInconsistencyInfoControlData.hasObjectDependencyInformation &&
					(!oInconsistencyInfoControlData.hasMultipleLongTextInformation &&
						!oInconsistencyInfoControlData.hasSingleLongTextInformation) && aInconsistencyInformation.length === 1) {
					bVisible = true;
				}
				break;
			}
			return bVisible;
		},

		getDependencyTypeDesc: function (sI18nText, sDependencyTypeDescr, sDependencyID) {
			return formatMessage(sI18nText, [sDependencyTypeDescr, sDependencyID]);
		},

		formatDependencyFormTitle: function (sI18nTextPlural, sI18nTextSingular) {
			return this.getFormatter("InconsistencyInformationFormatter").formatPopoverTitle.apply(this, [sI18nTextPlural, sI18nTextSingular]);
		}
	};

	return oFormatter;

}, true);
