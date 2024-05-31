/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/ui/model/resource/ResourceModel",
	"sap/ui/model/json/JSONModel",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text",
	"sap/m/MessageItem",
	"sap/m/MessageView",
	"sap/m/Bar",
	"sap/ui/core/Icon",
	"sap/i2d/lo/lib/zvchclfz/common/Constants"
], function (ManagedObject, ResourceModel, JSONModel, Dialog,
	Button, Text, MessageItem, MessageView, Bar, Icon, Constants) {
	"use strict";

	/**
	 *
	 * @class
	 *
	 * @author SAP SE
	 * @version 9.0.1
	 * @public
	 * @alias sap.i2d.lo.lib.vchclf.common.util.ErrorDialog
	 * @extends sap.ui.base.ManagedObject
	 */
	return ManagedObject.extend("sap.i2d.lo.lib.zvchclfz.common.util.ErrorDialog", {
		/** @lends sap.ui.base.ManagedObject.prototype */

		_dialog: null,
		aAfterCloseCallBacks: [],

		/**
		 * Opens an error dialog and displays the given messages
		 * Note: this method can be called multiple times - in that case the messages are appended to
		 * the already opened dialog.
		 * The array of messages must comply to the following format:
		 * Flat objects with these properties each:
		 * - statusCode: HTTP status code
		 * - message:    HTTP status message
		 * - internalMessage:     internal error message from ABAP side or Gateway
		 * - internalMessageCode: internal error code from ABAP side (message class code)
		 * - serviceId:           OData service id
		 * @param {sap.ui.core.mvc.View} oView - the view to which the dialog should added as dependent
		 * @param {array} aMessages - an array of messages
		 * @param {function} fnCallBackAfterClose - a callback function that is invoked after closing the dialog
		 */
		displayErrorMessages: function (oView, aMessages, fnCallBackAfterClose) {
			if (oView && !oView.bIsDestroyed) {
				if (fnCallBackAfterClose) {
					this.aAfterCloseCallBacks.push(fnCallBackAfterClose);
				}

				this._initDialog(oView);
				this._addErrorMessagesToDialog(aMessages);

				if (!this._dialog.isOpen()) {
					this._dialog.open();
				}
			}
		},

		/**
		 * Callback handler when dialog is closed
		 * @return {undefined}
		 */
		_onAfterDialogClosed: function () {
			this.aAfterCloseCallBacks.forEach(function (fnCallback) {
				fnCallback();
			});
			this._dialog.destroy();
			this._dialog = null;
		},

		/**
		 * Initializes the dialog for the given view
		 * @param  {sap.ui.core.mvc.View} oView - the view to which the dialog should added as dependent (optional)
		 * @return {undefined}
		 */
		_initDialog: function (oView) {
			if (!this._dialog || this._dialog.bIsDestroyed) {

				var oModel = new JSONModel();

				// ResourceModel used to retrieve translatable dialog title
				var oResourceModel = new ResourceModel({
					bundleName: "sap.i2d.lo.lib.zvchclfz.components.configuration.i18n.messagebundle"
				});
				var oResourceBundle = oResourceModel.getResourceBundle();
				var sErrorDialogTitle = oResourceBundle.getText("ERROR");
				var sServiceIdLabel = oResourceBundle.getText("ERROR_SERVICE_ID");
				var sInternalMessageLabel = oResourceBundle.getText("ERROR_INTERNAL_MESSAGE");
				var sInternalMessageCodeLabel = oResourceBundle.getText("ERROR_INTERNAL_MESSAGE_CODE");

				var oMessageTemplate = new MessageItem({
					type: "Error",
					title: "{= ${statusCode} ? ( ${statusCode} + ' - ' + ${message} ) : ${message} }",
					subtitle: "{internalMessage}",
					description: "{= ${internalMessage} ? '" + sInternalMessageLabel + ": ' + ${internalMessage} + '\n' : '' }" +
						"{= ${internalMessageCode}  ? '" + sInternalMessageCodeLabel + ": ' + ${internalMessageCode} + '\n' : '' }" +
						"{= ${serviceId} ? '" + sServiceIdLabel + ": ' + ${serviceId} : '' }"
				});

				var oBackButton;
				var oMessageView = new MessageView({
					showDetailsPageHeader: false,
					itemSelect: function () {
						oBackButton.setVisible(true);
					},
					items: {
						path: "/",
						template: oMessageTemplate
					}
				});

				oMessageView.setModel(oModel);

				oBackButton = new Button({
					icon: sap.ui.core.IconPool.getIconURI("nav-back"),
					visible: false,
					press: function () {
						oMessageView.navigateBack();
						this.setVisible(false);
					}
				});

				this._dialog = new Dialog({
					id: Constants.ERR_DIALOG_ID,
					resizable: false,
					content: oMessageView,
					state: "Error",
					title: sErrorDialogTitle,
					customHeader: new Bar({
						contentMiddle: [
							new Icon({
								src: sap.ui.core.IconPool.getIconURI("message-error"),
								color: sap.ui.core.IconColor.Negative
							}),
							new Text({
								text: sErrorDialogTitle
							})
						],
						contentLeft: [oBackButton]
					}),
					endButton: new Button({
						id: Constants.ERR_DIALOG_CLOSE_BUTTON_ID,
						press: function (oEvent) {
							var oErrorDialog = oEvent.getSource().getParent();

							oView.removeDependent(oErrorDialog);
							oErrorDialog.close();
						},
						text: "Close"
					}),
					afterClose: [this._onAfterDialogClosed, this],
					contentHeight: "300px",
					contentWidth: "500px",
					verticalScrolling: false,
					visible: true
				});

				oView.addDependent(this._dialog);
			}

			return this._dialog;
		},

		/**
		 * Adds error messages in a custom format (see below) to a previously initialized error dialog from this class.
		 *
		 * Message format: An array of flat objects with these properties each:
		 * - statusCode: HTTP status code
		 * - message:    HTTP status message
		 * - internalMessage:     internal error message from ABAP side or Gateway
		 * - internalMessageCode: internal error code from ABAP side (message class code)
		 * - serviceId:           OData service id
		 *
		 * Error messages are filtered for duplicates against themselves and against existing messages from the dialog.
		 * If internal error information is present, the internalMessage is compared. If internal information is not
		 * present, the message is compared instead.
		 *
		 * @param {array} aNewMessages - the array of message
		 * @return {Boolean} Indicator if error messages are present within the provided response inputs
		 */
		_addErrorMessagesToDialog: function (aNewMessages) {

			if (aNewMessages.length > 0) {

				var oMessageView = this._dialog.getAggregation("content")[0];
				var aCurrentMessages = oMessageView.getModel().getData();
				var aCombinedMessages = [];

				// If empty, the current messages is returned as empty object instead of empty array
				if (Array.isArray(aCurrentMessages)) {
					aCombinedMessages = this._combineMessagesWithoutDuplicates(aCurrentMessages, aNewMessages);
				} else {
					aCombinedMessages = this._combineMessagesWithoutDuplicates([], aNewMessages);
				}

				oMessageView.getModel().setData(aCombinedMessages);
				this._dialog.getCustomHeader().getContentLeft()[0].firePress();

				return true;
			}

			return false;
		},

		/**
		 * Helper method to combine an array of new messages
		 * and an existing one into a new array while avoiding duplicates.
		 * This assumes that the array of existing messages is already properly filtered.
		 * Duplicates between existing and new
		 * messages are not added this way and duplicates only within the array of new messages are only added once.
		 *
		 * The result is returned as a new array.
		 *
		 * @param {array} aExistingMessages - array of "existing" messages that contains already filtered messages
		 * @param {array} aNewMessages - array of "new" messages which is not filtered for duplicates in any way
		 * @return {Array} array of messages filtered for duplicates containing all unique messages from both arrays
		 */
		_combineMessagesWithoutDuplicates: function (aExistingMessages, aNewMessages) {
			var aResult = aExistingMessages.slice();

			aNewMessages.forEach(function (oCurrentNewMessage) {

				// Checking new message not only against all existing but also the new ones that already were added in the loop
				var isDuplicate = aResult.some(function (oExistingMessage) {

					// The internal message data can be missing (in that case only http code exists)
					if (oExistingMessage.internalMessage && oCurrentNewMessage.internalMessage) {
						if (oExistingMessage.internalMessage === oCurrentNewMessage.internalMessage) {
							return true;
						}

						return false;
					} else if (oExistingMessage.message === oCurrentNewMessage.message) {
						return true;
					}

					return false;
				});

				if (!isDuplicate) {
					aResult.push(oCurrentNewMessage);
				}
			});

			return aResult;

		}
	});
});
