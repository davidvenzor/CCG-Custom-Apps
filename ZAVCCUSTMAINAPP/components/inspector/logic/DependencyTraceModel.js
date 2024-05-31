/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/components/inspector/dao/DependencyTraceDAO",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/Constants",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/DependencyTraceFilterManager",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/logic/InspectorModel",
	"sap/i2d/lo/lib/zvchclfz/components/inspector/util/ODataModelHelper",
	"sap/ui/model/json/JSONModel"
	// eslint-disable-next-line max-statements
], function (DependencyTraceDAO, Constants, DependencyTraceFilterManager, InspectorModel, ODataModelHelper, JSONModel) {
	"use strict";

	var DEFAULT_MODEL_SIZE_LIMIT = 100;
	var GROWING_THRESHOLD = 50;
	var INITIAL_COUNT_OF_DEP_CODE_LINES = 3;
	var TRACE_BEFORE_CHARACTERISTICS = Constants.navigationProperties.TraceEntry.TraceBeforeCharacteristics;
	var TRACE_RESULT_CHARACTERISTICS = Constants.navigationProperties.TraceEntry.TraceResultCharacteristics;
	var VARIANT_TABLES = Constants.navigationProperties.TraceEntry.VariantTables;
	var INPUT_OBJECT_DEPENDENCIES = Constants.navigationProperties.TraceEntry.InputTraceObjectDependencies;
	var OBJECT_DEPENDENCY_CODES = Constants.navigationProperties.TraceEntry.ObjectDependencyCodes;
	var PRICING_VALUE = Constants.navigationProperties.TraceEntry.TracePricingFactor;
	var RESULT_CHARACTERISTIC_RESULTS = Constants.navigationProperties.TraceEntry.ResultCharacteristicResults;
	var BEFORE_CHARACTERISTIC_RESULTS = Constants.navigationProperties.TraceEntry.BeforeCharacteristicResults;
	var RESULT_DEPENDENCY_RESULTS = Constants.navigationProperties.TraceEntry.ResultDependencyResults;
	var BEFORE_DEPENDENCY_RESULTS = Constants.navigationProperties.TraceEntry.BeforeDependencyResults;
	var TRACE_BADI = Constants.navigationProperties.TraceEntry.TraceBAdI;

	/**
	 * Constructor of the Dependency Trace Model
	 * @constructor
	 */
	var DependencyTraceModel = function () {
		/**
		 * Stores the current size limit of the _model
		 * @type {int}
		 * @private
		 */
		this._currentModelSizeLimit = null;

		/**
		 * Stores internal key of the currently highlighted Trace Entry text
		 * @type {String}
		 * @private
		 */
		this._highlightedTraceEntryText = null;

		/**
		 * Buffer for store the Trace Entry texts
		 * The keys of the object should be the internal keys, the value is the Trace Entry texts
		 * @type {Object}
		 * @private
		 */
		this._traceEntryTextBuffer = null;

		/**
		 * JSON model which contains the already downloaded entries with the current filter text
		 * @type {sap.ui.model.json.JSONModel}
		 * @private
		 */
		this._model = null;

		this.initialize();
	};

	/**
	 * Initialize the Dependency Trace Model
	 * @public
	 */
	DependencyTraceModel.prototype.initialize = function () {
		this._model = new JSONModel({
			entries: [],
			filterText: ""
		});

		this._currentModelSizeLimit = DEFAULT_MODEL_SIZE_LIMIT;
		this._highlightedTraceEntryText = null;
		this._traceEntryTextBuffer = {};

		DependencyTraceFilterManager.clearAllFilters();
	};

	/**
	 * Update the filter text in the internal model
	 * @public
	 */
	DependencyTraceModel.prototype.updateFilterText = function () {
		this._model.setProperty("/filterText", DependencyTraceFilterManager.getConcatenatedFilterText());
	};

	/**
	 * Sets the root path of the trace in the internal model
	 * @param {String} sPath - Root path which should be used
	 * @param {String} sPathFilterText - Filter text for the root path
	 * @public
	 */
	DependencyTraceModel.prototype.setRootPath = function (sPath, sPathFilterText) {
		DependencyTraceFilterManager.setRootPath(sPath, sPathFilterText);
	};

	/**
	 * Getter for the internal model of the class
	 * @returns {sap.ui.model.json.JSONModel} The internal model
	 * @public
	 */
	DependencyTraceModel.prototype.getModel = function () {
		return this._model;
	};

	/**
	 * Clears the buffer of trace entry texts and highlightion
	 * @public
	 */
	DependencyTraceModel.prototype.clearBuffer = function () {
		this._highlightedTraceEntryText = null;
		this._traceEntryTextBuffer = {};
	};

	/**
	 * Clears and loads the beginning section of the Trace Model
	 * @returns {Promise} Promise object which will provide the details
	 * @public
	 */
	DependencyTraceModel.prototype.reload = function () {
		return new Promise(function (fnResolve, fnReject) {
			// At the first load x + 1 items should be requested to show the more items option in the list
			this._loadEntries(0, GROWING_THRESHOLD + 1)
				.then(function (oData) {
					if (oData) {
						// Clean up the model to initiate the growing of the list
						this._model.setProperty("/entries", []);

						this._model.setProperty("/entries", this._postProcessTraceEntries(oData.results));
					}

					fnResolve();
				}.bind(this))
				.catch(fnReject);
		}.bind(this));
	};

	/**
	 * Fetches the next section of the Trace Model
	 * @returns {Promise} Promise object which will provide the details
	 * @public
	 */
	DependencyTraceModel.prototype.fetch = function () {
		return new Promise(function (fnResolve, fnReject) {
			var aEntries = this._model.getProperty("/entries");

			this._loadEntries(aEntries.length, GROWING_THRESHOLD)
				.then(function (oData) {
					if (oData) {
						this._model.setProperty(
							"/entries",
							aEntries.concat(this._postProcessTraceEntries(oData.results))
						);
					}

					fnResolve();
				}.bind(this))
				.catch(fnReject);
		}.bind(this));
	};

	/**
	 * Clears the Trace entries
	 * @returns {Promise} Promise object which will provide the details
	 * @public
	 */
	DependencyTraceModel.prototype.clear = function () {
		return new Promise(function (fnResolve, fnReject) {
			DependencyTraceDAO.clearTrace(
					InspectorModel.getConfigurationContextId())
				.then(function () {
					// Delete the entries and clean up the buffer
					this._model.setProperty("/entries", []);
					this.clearBuffer();

					fnResolve();
				}.bind(this))
				.catch(fnReject);
		}.bind(this));
	};

	/**
	 * Expands the selected Trace entry
	 * @param {String} sTraceGuid - Trace Guid property of the entry
	 * @param {int} iRoundtripNumber - Roundtrip No. property of the entry
	 * @param {int} iEntryNumber - Entry No. property of the entry
	 * @returns {Promise} Promise object which will provide the details
	 * @public
	 */
	DependencyTraceModel.prototype.expandEntry = function (sTraceGuid, iRoundtripNumber, iEntryNumber) {
		return new Promise(function (fnResolve, fnReject) {
			// One trace entry can contain multiple messages with different text numbers, so if the details of a trace
			// entry is downloaded, they should be assigned to every entry related messages (because the same details
			// should not be downloaded multiple times from the backend)
			var aTraceEntries = this._getTraceEntriesForEntryNumber(sTraceGuid, iRoundtripNumber, iEntryNumber);

			if (this._checkDetailsExistForEntries(aTraceEntries)) {
				fnResolve();
			} else {
				var sTraceEntryPath = ODataModelHelper.generateTraceEntryPath(
					InspectorModel.getConfigurationContextPath(),
					sTraceGuid,
					iRoundtripNumber,
					iEntryNumber
				);

				DependencyTraceDAO.loadTraceEntryDetails(sTraceEntryPath)
					.then(function (oData) {
						this._assignDetailsToEntries(oData, aTraceEntries);

						fnResolve();
					}.bind(this))
					.catch(fnReject);
			}
		}.bind(this));
	};

	/**
	 * Sets the search text of the trace
	 * @param {String} sSearchText - Search text
	 * @public
	 */
	DependencyTraceModel.prototype.setSearchText = function (sSearchText) {
		DependencyTraceFilterManager.setSearchText(sSearchText);
	};

	/**
	 * Sets filters for a filter type
	 * @param {String} sFilterType - Type of the filter
	 * @param {Object[]} aFilterObjects - Objects of filters which contain the information
	 * @public
	 */
	DependencyTraceModel.prototype.setFiltersForFilterType = function (sFilterType, aFilterObjects) {
		DependencyTraceFilterManager.setFiltersForFilterType(sFilterType, aFilterObjects);
	};

	/**
	 * Clears all the filters
	 * @public
	 */
	DependencyTraceModel.prototype.clearAllFilters = function () {
		DependencyTraceFilterManager.clearAllFilters();
	};

	/**
	 * Opens the Trace Filter Dialog
	 * @returns {Promise} Promise object which will provide the details
	 * @public
	 */
	DependencyTraceModel.prototype.openTraceFilterDialog = function () {
		return DependencyTraceFilterManager.openTraceFilterDialog();
	};

	/**
	 * Saves the current state of the filter manager
	 * @public
	 */
	DependencyTraceModel.prototype.saveState = function () {
		DependencyTraceFilterManager.saveState();
	};

	/**
	 * Restores the saved state of the filter manager
	 * @public
	 */
	DependencyTraceModel.prototype.restoreState = function () {
		DependencyTraceFilterManager.restoreState();

		this.updateFilterText();
	};

	/**
	 * Highlights a Trace Entry text
	 * @param {String} sTraceEntryTextPath - Path of the Trace Entry text (or a navigation property of it)
	 * @public
	 */
	DependencyTraceModel.prototype.highlightTraceEntryText = function (sTraceEntryTextPath) {
		// The function can be triggered with a context of a characteristic / BOM component of the detail of the trace
		// entry text, so the path should be post processed with the regexp to get the path of the TraceEntry and not
		// of the Trace Before/Result Characteristic.
		var rRegExp = /\/entries\/\d+/i;
		var oTraceEntryText = this._model.getProperty(rRegExp.exec(sTraceEntryTextPath)[0]);
		var sTraceEntryTextInternalKey = this._generateTraceEntryTextInternalKey(oTraceEntryText);

		if (this._highlightedTraceEntryText !== sTraceEntryTextInternalKey) {
			if (this._highlightedTraceEntryText) {
				this._setTraceEntryTextHighlighted(this._highlightedTraceEntryText, false);
			}

			this._setTraceEntryTextHighlighted(sTraceEntryTextInternalKey, true);
		}
	};

	/**
	 * Activates the Trace and Reload the Trace Messages
	 * @returns {Promise} Promise object
	 * @public
	 */
	DependencyTraceModel.prototype.activateTraceAndReloadMessages = function () {
		//When trace is activated a new trace session is created
		this.clearBuffer();

		return Promise.all([
			DependencyTraceDAO.activateTrace(
				InspectorModel.getConfigurationContextId()),
			this.reload()
		]);
	};

	/**
	 * Deactivates the Trace and Reload the Trace Messages
	 * @returns {Promise} Promise object
	 * @public
	 */
	DependencyTraceModel.prototype.deactivateTraceAndReloadMessages = function () {
		return Promise.all([
			DependencyTraceDAO.deactivateTrace(
				InspectorModel.getConfigurationContextId()),
			this.reload()
		]);
	};

	/**
	 * Toggles the Dependency Source Code for a Trace Entry according to the current state
	 * @param {String} sTraceGuid - Trace Guid property of the entry
	 * @param {int} iRoundtripNumber  - Roundtrip No. property of the entry
	 * @param {int} iEntryNumber      - Entry No. property of the entry
	 * @returns {Promise} Promise object with dependency source code
	 * @public
	 */
	DependencyTraceModel.prototype.toggleDependencyCodesForEntry = function (sTraceGuid, iRoundtripNumber, iEntryNumber) {
		return new Promise(function (fnResolve, fnReject) {
			var aTraceEntries = this._getTraceEntriesForEntryNumber(sTraceGuid, iRoundtripNumber, iEntryNumber);

			if (!aTraceEntries[0]._isAllDependencySourceCodeLoaded) {

				var sTraceEntryPath = ODataModelHelper.generateTraceEntryPath(
					InspectorModel.getConfigurationContextPath(),
					sTraceGuid,
					iRoundtripNumber,
					iEntryNumber
				);

				DependencyTraceDAO.loadAllDependencyCodesForEntry(sTraceEntryPath)
					.then(function (oData) {
						this._assignAllDependencyCodesToEntries(aTraceEntries, oData.results);
						fnResolve();
					}.bind(this))
					.catch(fnReject);
			} else {
				this._toggleAllDependencyCodesForEntryFromCache(aTraceEntries);
				fnResolve();
			}

		}.bind(this));
	};

	/**
	 * Triggers the loadEntries function of the DependencyTraceDAO
	 * @param {int} [iSkip] - Skip parameter of the OData request
	 * @param {int} [iTop] - Top parameter of the OData request
	 * @returns {Promise} Promise object which will provide the details
	 * @private
	 */
	DependencyTraceModel.prototype._loadEntries = function (iSkip, iTop) {
		return DependencyTraceDAO.loadEntries(
			DependencyTraceFilterManager.getRootPath(),
			DependencyTraceFilterManager.getSearchText(),
			DependencyTraceFilterManager.getFilters(),
			iSkip,
			iTop);
	};

	/**
	 * Returns the trace entries from the model which are related to the given keys
	 * The function returns an array, because multiple messages (with different Text No.-s) can exist for a trace entry
	 * @param {String} sTraceGuid - Trace Guid property of the entry
	 * @param {int} iRoundtripNo - Roundtrip No. property of the entry
	 * @param {int} iEntryNo - Entry No. property of the entry
	 * @returns {Object[]} Filtered trace entries
	 * @private
	 */
	DependencyTraceModel.prototype._getTraceEntriesForEntryNumber = function (sTraceGuid, iRoundtripNo, iEntryNo) {
		return $.grep(this._model.getProperty("/entries"), function (oEntry) {
			return oEntry.TraceGuid === sTraceGuid &&
				oEntry.RoundtripNo === iRoundtripNo &&
				oEntry.EntryNo === iEntryNo;
		});
	};

	/**
	 * Sets the _isHighlighted property of a Trace Entry text
	 * @param {String} sTraceEntryTextInternalKey - Internal key of Trace Entry text which should be modified
	 * @param {Boolean} bIsHighlighted - Value of the _isHighlighted property
	 * @private
	 */
	DependencyTraceModel.prototype._setTraceEntryTextHighlighted = function (sTraceEntryTextInternalKey, bIsHighlighted) {
		// eslint-disable-next-line consistent-return
		$.each(this._model.getProperty("/entries"), function (iIndex, oModelEntry) {
			if (this._generateTraceEntryTextInternalKey(oModelEntry) === sTraceEntryTextInternalKey) {

				this._model.setProperty("/entries/" + iIndex + "/_isHighlighted", bIsHighlighted);

				this._highlightedTraceEntryText = bIsHighlighted ? sTraceEntryTextInternalKey : null;

				return false;
			}
		}.bind(this));
	};

	/**
	 * Checks whether the details are already downloaded to the given trace entries
	 * @param {Object[]} aTraceEntries - Array of trace entries
	 * @returns {Boolean} Flag whether all details are exist
	 * @private
	 */
	DependencyTraceModel.prototype._checkDetailsExistForEntries = function (aTraceEntries) {
		return $.grep(aTraceEntries, function (oEntry) {
			return !oEntry._isDetailDownloaded;
		}).length === 0;
	};

	/**
	 * Assigns the details to the given trace entries
	 * @param {Object} oDetail - Detail object which is returned by the backend
	 * @param {Object[]} aTraceEntries - Array of trace entries
	 * @private
	 */
	DependencyTraceModel.prototype._assignDetailsToEntries = function (oDetail, aTraceEntries) {
		// The Trace Before / Result characteristics and the Input Trace Object Dependencies are bound to HBox controls.
		// Because of this, if there are more, than 100 items (this is the default size limit), only the first 100 items
		// will be shown, the others not. So the size limit of the JSON model should be increased to the maximum count
		// of Before / Result characteristics and Input Object Dependencies.
		this._increaseModelSizeLimit(Math.max(
			oDetail[TRACE_BEFORE_CHARACTERISTICS].results.length,
			oDetail[TRACE_RESULT_CHARACTERISTICS].results.length,
			oDetail[INPUT_OBJECT_DEPENDENCIES].results.length,
			oDetail[OBJECT_DEPENDENCY_CODES].results.length,
			oDetail[BEFORE_DEPENDENCY_RESULTS].results.length,
			oDetail[RESULT_DEPENDENCY_RESULTS].results.length,
			oDetail[BEFORE_CHARACTERISTIC_RESULTS].results.length,
			oDetail[RESULT_CHARACTERISTIC_RESULTS].results.length
		));

		$.each(aTraceEntries, function (iIndex, oEntry) {
			// We should create an _isDetailDownloaded flag for check whether the detail is already downloaded
			// for the trace entry later
			oEntry._isDetailDownloaded = true;
			oEntry[TRACE_BEFORE_CHARACTERISTICS] = oDetail[TRACE_BEFORE_CHARACTERISTICS].results;
			oEntry[TRACE_RESULT_CHARACTERISTICS] = oDetail[TRACE_RESULT_CHARACTERISTICS].results;
			oEntry[VARIANT_TABLES] = oDetail[VARIANT_TABLES].results;
			oEntry[INPUT_OBJECT_DEPENDENCIES] = oDetail[INPUT_OBJECT_DEPENDENCIES].results;
			oEntry[PRICING_VALUE] = oDetail[PRICING_VALUE];
			oEntry[BEFORE_DEPENDENCY_RESULTS] = oDetail[BEFORE_DEPENDENCY_RESULTS].results;
			oEntry[RESULT_DEPENDENCY_RESULTS] = oDetail[RESULT_DEPENDENCY_RESULTS].results;
			oEntry[BEFORE_CHARACTERISTIC_RESULTS] = oDetail[BEFORE_CHARACTERISTIC_RESULTS].results;
			oEntry[RESULT_CHARACTERISTIC_RESULTS] = oDetail[RESULT_CHARACTERISTIC_RESULTS].results;
			oEntry[TRACE_BADI] = oDetail[TRACE_BADI];

			this.setDepSrcCodePropertiesAfterExpand(
				oEntry,
				oDetail[OBJECT_DEPENDENCY_CODES].results,
				oDetail[INPUT_OBJECT_DEPENDENCIES].results
			);
		}.bind(this));
	};

	/**
	 * Post processes the incoming trace entries
	 * @param {Object[]} aTraceEntries - Trace entries which came from the backend
	 * @returns {Object[]} Post processed array of trace entries
	 * @private
	 */
	DependencyTraceModel.prototype._postProcessTraceEntries = function (aTraceEntries) {
		$.each(aTraceEntries, function (iIndex, oTraceEntry) {
			var sInternalKey = this._generateTraceEntryTextInternalKey(oTraceEntry);
			var oBufferedTraceEntryText = this._traceEntryTextBuffer[sInternalKey];

			if (oBufferedTraceEntryText) {
				// Load from the buffer as reference object
				// oTraceEntry = oBufferedTraceEntryText is not allowed
				aTraceEntries[iIndex] = oBufferedTraceEntryText;
			} else {
				// A unique key should be set to all the list items, because if a property of an entry changes,
				// the Trace Entry panel is automatically collapsed without a unique key (growing list limitation)
				oTraceEntry._id = sInternalKey;

				this._resetTraceEntryDetails(oTraceEntry);

				// Store in the buffer as reference object
				this._traceEntryTextBuffer[sInternalKey] = oTraceEntry;
			}

			// Highlightion should be updated for every trace entries after a reload
			oTraceEntry._isHighlighted = this._highlightedTraceEntryText === sInternalKey;
		}.bind(this));

		return aTraceEntries;
	};

	/**
	 * Increases the size limit of the JSON model if it is lower than iLimit
	 * @param {int} iLimit - Expected number of size limit
	 * @public
	 */
	DependencyTraceModel.prototype._increaseModelSizeLimit = function (iLimit) {
		if (this._currentModelSizeLimit < iLimit) {
			this._model.setSizeLimit(iLimit);
			this._currentModelSizeLimit = iLimit;
		}
	};

	/**
	 * Generates a unique internal key for a trace entry text based on its keys
	 * @param {Object} oTraceEntryText - Object of Trace Entry text
	 * @returns {String} Internal key
	 * @private
	 */
	DependencyTraceModel.prototype._generateTraceEntryTextInternalKey = function (oTraceEntryText) {
		var aTraceEntryTextKeyElements = [
			oTraceEntryText.TraceGuid,
			oTraceEntryText.RoundtripNo,
			oTraceEntryText.EntryNo,
			oTraceEntryText.TextNo
		];

		return aTraceEntryTextKeyElements.join("_");
	};

	/**
	 * Sets the Dependencies Source Code related properties for a Trace Entry
	 * To be used after the $expand request is triggered as it is used to display only the top max lines
	 * When codes > max then the show more lines is enabled
	 * @param {Object} oTraceEntry           - Object of Trace Entry text
	 * @param {Array} aDependencySourceCode      - Array of Dependency Source Codes
	 * @param {Array} aInputTraceObjDependencies - Array of Input Dependencies
	 * @private
	 */
	DependencyTraceModel.prototype.setDepSrcCodePropertiesAfterExpand = function (oTraceEntry, aDependencySourceCode,
		aInputTraceObjDependencies) {
		// The Source could should only be visible when there is 1 input dependency
		if (aDependencySourceCode &&
			aDependencySourceCode.length > 0 &&
			aInputTraceObjDependencies.length === 1) {

			oTraceEntry._isDependencySourceCodeVisible = true;

			if (aDependencySourceCode.length > INITIAL_COUNT_OF_DEP_CODE_LINES) {
				//Get only the top items
				oTraceEntry[OBJECT_DEPENDENCY_CODES] = aDependencySourceCode.slice(0, INITIAL_COUNT_OF_DEP_CODE_LINES);
				oTraceEntry._isToggleDepSourceCodeLinkVisible = true;
			} else {
				oTraceEntry[OBJECT_DEPENDENCY_CODES] = aDependencySourceCode;
				oTraceEntry._isToggleDepSourceCodeLinkVisible = false;
			}

		} else {
			oTraceEntry._isToggleDepSourceCodeLinkVisible = false;
			oTraceEntry._isDependencySourceCodeVisible = false;
		}
	};

	/**
	 * Reset the Trace Entry Details' related properties
	 * @param {Object} oTraceEntry - Object of Trace Entry text
	 * @private
	 */
	DependencyTraceModel.prototype._resetTraceEntryDetails = function (oTraceEntry) {
		oTraceEntry._isExpanded = false;
		oTraceEntry._isDetailDownloaded = false;
		oTraceEntry._isDependencySourceCodeVisible = false;
		oTraceEntry._isToggleDepSourceCodeLinkVisible = false;
		oTraceEntry._isAllDependencySourceCodeLoaded = false;
		oTraceEntry._cachedDependencySource = [];

		oTraceEntry[TRACE_BEFORE_CHARACTERISTICS] = [];
		oTraceEntry[TRACE_RESULT_CHARACTERISTICS] = [];
		oTraceEntry[VARIANT_TABLES] = [];
		oTraceEntry[INPUT_OBJECT_DEPENDENCIES] = [];
		oTraceEntry[OBJECT_DEPENDENCY_CODES] = [];
		oTraceEntry[PRICING_VALUE] = null;
		oTraceEntry[BEFORE_DEPENDENCY_RESULTS] = [];
		oTraceEntry[RESULT_DEPENDENCY_RESULTS] = [];
		oTraceEntry[BEFORE_CHARACTERISTIC_RESULTS] = [];
		oTraceEntry[RESULT_CHARACTERISTIC_RESULTS] = [];
		oTraceEntry[TRACE_BADI] = null;
	};

	/**
	 * Assigns all Dependencies Source Code for a Trace Entry
	 * @param {Array} aTraceEntries         - Array of Trace Entry text
	 * @param {Array} aDependencySourceCode - Array of Dependency Source Codes
	 * @private
	 */
	DependencyTraceModel.prototype._assignAllDependencyCodesToEntries = function (aTraceEntries, aDependencySourceCode) {

		this._increaseModelSizeLimit(aDependencySourceCode.length);

		$.each(aTraceEntries, function (iIndex, oTraceEntry) {
			oTraceEntry._isAllDependencySourceCodeLoaded = true;
			oTraceEntry._cachedDependencySource = aDependencySourceCode;
			oTraceEntry[OBJECT_DEPENDENCY_CODES] = aDependencySourceCode;
		});

		// The model should be refreshed after the property changes, because there is not any activity which
		// would trigger it automatically
		this._model.refresh();

	};

	/**
	 * Toggles the Dependency Source Code from the Cache
	 * @param {Array} aTraceEntries - Array of Trace Entry text
	 * @private
	 */
	DependencyTraceModel.prototype._toggleAllDependencyCodesForEntryFromCache = function (aTraceEntries) {
		$.each(aTraceEntries, function (iIndex, oTraceEntry) {
			oTraceEntry[OBJECT_DEPENDENCY_CODES] = oTraceEntry._cachedDependencySource.length === oTraceEntry[OBJECT_DEPENDENCY_CODES].length ?
				oTraceEntry[OBJECT_DEPENDENCY_CODES].slice(0, INITIAL_COUNT_OF_DEP_CODE_LINES) :
				oTraceEntry._cachedDependencySource;
		});

		// The model should be refreshed after the property changes, because there is not any activity which
		// would trigger it automatically
		this._model.refresh();
	};

	return new DependencyTraceModel();
});
