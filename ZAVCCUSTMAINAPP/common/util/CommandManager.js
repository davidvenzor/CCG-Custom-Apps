/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/i2d/lo/lib/zvchclfz/common/util/Command",
	"sap/ui/model/json/JSONModel",
	"sap/i2d/lo/lib/zvchclfz/common/util/Logger"
], function (Command, JSONModel, Logger) {
	"use strict";

	var oCommandManager = Object.create(null);

	oCommandManager._aCommands = [];
	oCommandManager._iPosition = -1;
	oCommandManager._bUndoWasTriggered = false;

	oCommandManager._oModel = new JSONModel({
		enableUndoButton: false,
		enableRedoButton: false
	});

	oCommandManager.execute = function (oCommand) {
		this._oModel.setProperty("/enableRedoButton", false);
		this._oModel.setProperty("/enableUndoButton", false);

		if (oCommandManager._bUndoWasTriggered) {
			oCommandManager._aCommands.splice(oCommandManager._iPosition + 1);
			oCommandManager._bUndoWasTriggered = false;
		}

		this._aCommands.push(oCommand);
		Logger.logDebug("Adding command: {0}", [oCommand]);
		oCommandManager._iPosition++;

		var oPromise = oCommand.execute();
		oPromise.then(function () {
			this._oModel.setProperty("/enableRedoButton", false);
			this._oModel.setProperty("/enableUndoButton", true);
		}.bind(this));

		return oPromise;
	};

	var fnFocusUiControl = function (oCommand) {
		// Focus has to be set after the odata request
		// otherwise select detects changes between selected items and fires change event 
		// The change event would trigger a new roundtrip 
		var oSourceControl = sap.ui.getCore().byId(oCommand.getSourceControlId());
		if (oSourceControl) {
			oSourceControl.focus();
		}
	};

	oCommandManager.undo = function () {
		var oCommand = this._aCommands[this._iPosition];

		this._oModel.setProperty("/enableRedoButton", false);
		this._oModel.setProperty("/enableUndoButton", false);

		var oPromise = oCommand.undo();
		oPromise.then(function () {
			fnFocusUiControl(oCommand);
			this._oModel.setProperty("/enableUndoButton", oCommandManager._iPosition > -1);
			this._oModel.setProperty("/enableRedoButton", true);
		}.bind(this));

		this._iPosition--;
		oCommandManager._bUndoWasTriggered = true;

		return oPromise;
	};

	oCommandManager.redo = function () {
		this._iPosition++;
		var oCommand = this._aCommands[this._iPosition];

		this._oModel.setProperty("/enableRedoButton", false);
		this._oModel.setProperty("/enableUndoButton", false);

		var bRedoButtonEnabled = oCommandManager._iPosition + 1 < oCommandManager._aCommands.length;

		var oPromise = oCommand.execute();
		oPromise.then(function () {
			fnFocusUiControl(oCommand);
			this._oModel.setProperty("/enableUndoButton", true);
			this._oModel.setProperty("/enableRedoButton", bRedoButtonEnabled);
		}.bind(this));

		return oPromise;
	};

	oCommandManager.getModel = function () {
		return this._oModel;
	};

	oCommandManager.reset = function () {
		this._aCommands = [];
		this._iPosition = -1;
		this._oModel.setProperty("/enableRedoButton", false);
		this._oModel.setProperty("/enableUndoButton", false);
		this._bUndoWasTriggered = false;
	};

	return oCommandManager;
});
