sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/ValidateException",
	"sap/ui/core/Core",
	"sap/ui/core/Fragment",
	"sap/m/MessageBox"
], function (Controller, JSONModel, ValidateException, Core, Fragment, MessageBox) {
	"use strict";

	return Controller.extend("sap.ops.productivityreport.ZOPSPRODUCTIVITYREPORT.controller.Report", {
		onInit: function () {
			var oView = this.getView(),
				oMM = Core.getMessageManager();

			oView.setModel(new JSONModel({
				Bunit: ""
			}));
			// attach handlers for validation errors
			oMM.registerObject(oView.byId("Bunit"), true);
			// var ReportModel = new sap.ui.model.json.JSONModel();
			// this.getView().setModel(ReportModel, "ReportModel");

			// var tableModel = new sap.ui.model.json.JSONModel();
			// var oModel = this.getOwnerComponent().getModel();
			// // OData Call to get year dropdown data
			// // oModel.read("/ZIB_PROD_SUM(p_date='20221124')/Set", {
			// oModel.read("/GradingCountsSet", {
			// 	// filters: filter,
			// 	success: function (oData, oResponse) {
			// 		tableModel.setData(oData);
			// 		this.getView().getModel("ReportModel").setData(oData.results);
			// 		this.getView().getModel("ReportModel").refresh();
			// 	}.bind(this),
			// 	error: function () {
			// 		// MessageToast.show("Failed");
			// 	}
			// });
			//var BUnit = this.getView().byId("Bunit").getValue();
			var curr = new Date();
			var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 1));
			var oModel = new JSONModel();
			var oModel1 = this.getOwnerComponent().getModel();
			oModel1.read("/HTspaSet(Spart='14')", {
				success: function (oData, oResponse) {
					oModel.setData({
						today: new Date(),
						fromdate: firstday,
						BUnit: 14,
						BTUnit: oData.Vtext
					});
				},
				error: function () {
					//	MessageToast.show("Failed");
				}
			});
			oModel.setData({
				today: new Date(),
				fromdate: firstday,
				BUnit: 14
			});
			this.getView().setModel(oModel);
		},
		_validateInput: function (oInput) {
			var sValueState = "None";
			var bValidationError = false;
			var oBinding = oInput.getBinding("value");
			try {
				oBinding.getType().validateValue(oInput.getValue());
			} catch (oException) {
				sValueState = "Error";
				bValidationError = true;
			}
			oInput.setValueState(sValueState);
			return bValidationError;
		},

		onNameChange: function (oEvent) {
			var oInput = oEvent.getSource();
			this._validateInput(oInput);
		},
		onPress: function (evt) {
			var BUnit = this.getView().byId("Bunit").getValue();
			if (BUnit === "") {
				MessageBox.error("Business Unit is Mandatory.");
			} else {
				if (BUnit !== "") {
					var oView = this.getView(),
						aInputs = [
							oView.byId("Bunit")
						],
						bValidationError = false;

					// Check that inputs are not empty.
					// Validation does not happen during data binding as this is only triggered by user actions.
					aInputs.forEach(function (oInput) {
						bValidationError = this._validateInput(oInput) || bValidationError;
					}, this);
					if (bValidationError) {
						MessageBox.error("Business Unit is Incorrect.");
					} else {
						var ProductivityModel = new sap.ui.model.json.JSONModel();
						this.getView().setModel(ProductivityModel, "ProductivityModel");

						var tableModel = new sap.ui.model.json.JSONModel();
						var oModel = this.getOwnerComponent().getModel();

						var User = this.getView().byId("FUser").getValue().toUpperCase();
						var fromdate = this.getView().byId("FDate").getValue();
						var Option = this.getView().byId("Option").getSelectedButton().getText();
						if (Option === "Daily") {
							this.byId("idReportTable").getColumns()[1].setVisible(true);
							this.byId("idReportTable").getColumns()[2].setVisible(false);
							this.byId("idReportTable").getColumns()[3].setVisible(true);
							this.byId("idReceiveTable").getColumns()[1].setVisible(true);
							this.byId("idReceiveTable").getColumns()[2].setVisible(false);
							this.byId("idReceiveTable").getColumns()[3].setVisible(true);
							this.byId("idVerifyTable").getColumns()[1].setVisible(true);
							this.byId("idVerifyTable").getColumns()[2].setVisible(false);
							this.byId("idVerifyTable").getColumns()[3].setVisible(true);
							this.byId("idSlabTable").getColumns()[1].setVisible(true);
							this.byId("idSlabTable").getColumns()[2].setVisible(false);
							this.byId("idSlabTable").getColumns()[3].setVisible(true);
							this.byId("idImageTable").getColumns()[1].setVisible(true);
							this.byId("idImageTable").getColumns()[2].setVisible(false);
							this.byId("idImageTable").getColumns()[3].setVisible(true);
							this.byId("idQCTable").getColumns()[1].setVisible(true);
							this.byId("idQCTable").getColumns()[2].setVisible(false);
							this.byId("idQCTable").getColumns()[3].setVisible(true);
							this.byId("idFinalTable").getColumns()[1].setVisible(true);
							this.byId("idFinalTable").getColumns()[2].setVisible(false);
							this.byId("idFinalTable").getColumns()[3].setVisible(true);
							this.byId("idShipTable").getColumns()[1].setVisible(true);
							this.byId("idShipTable").getColumns()[2].setVisible(false);
							this.byId("idShipTable").getColumns()[3].setVisible(true);
							this.byId("idWeekTable").getColumns()[1].setVisible(true);
							this.byId("idWeekTable").getColumns()[2].setVisible(true);
							this.byId("idWeekTable").getColumns()[3].setVisible(true);
						}
						if (Option === "Weekly") {
							this.byId("idReportTable").getColumns()[1].setVisible(false);
							this.byId("idReportTable").getColumns()[2].setVisible(true);
							this.byId("idReportTable").getColumns()[3].setVisible(false);
							this.byId("idReceiveTable").getColumns()[1].setVisible(false);
							this.byId("idReceiveTable").getColumns()[2].setVisible(true);
							this.byId("idReceiveTable").getColumns()[3].setVisible(false);
							this.byId("idVerifyTable").getColumns()[1].setVisible(false);
							this.byId("idVerifyTable").getColumns()[2].setVisible(true);
							this.byId("idVerifyTable").getColumns()[3].setVisible(false);
							this.byId("idSlabTable").getColumns()[1].setVisible(false);
							this.byId("idSlabTable").getColumns()[2].setVisible(true);
							this.byId("idSlabTable").getColumns()[3].setVisible(false);
							this.byId("idImageTable").getColumns()[1].setVisible(false);
							this.byId("idImageTable").getColumns()[2].setVisible(true);
							this.byId("idImageTable").getColumns()[3].setVisible(false);
							this.byId("idQCTable").getColumns()[1].setVisible(false);
							this.byId("idQCTable").getColumns()[2].setVisible(true);
							this.byId("idQCTable").getColumns()[3].setVisible(false);
							this.byId("idFinalTable").getColumns()[1].setVisible(false);
							this.byId("idFinalTable").getColumns()[2].setVisible(true);
							this.byId("idFinalTable").getColumns()[3].setVisible(false);
							this.byId("idShipTable").getColumns()[1].setVisible(false);
							this.byId("idShipTable").getColumns()[2].setVisible(true);
							this.byId("idShipTable").getColumns()[3].setVisible(false);
							this.byId("idWeekTable").getColumns()[1].setVisible(true);
							this.byId("idWeekTable").getColumns()[2].setVisible(true);
							this.byId("idWeekTable").getColumns()[3].setVisible(true);
							var weekly = "X";
						}
						//var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "YYYYMMDD"});
						//var date = new Date(fromdate);
						//var dateStr = dateFormat.format(date);

						var Todate = this.getView().byId("TDate").getValue();
						//dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "YYYYMMDD"});
						//date = new Date(Todate);
						//var dateStrto = dateFormat.format(date);
						var Nfilter1 = [
							new sap.ui.model.Filter("Guser", sap.ui.model.FilterOperator.EQ, User),
						];
						// var Nfilter = [
						// 	new sap.ui.model.Filter("Guser", sap.ui.model.FilterOperator.EQ, User),
						// 	new sap.ui.model.Filter("Gdatefrom", sap.ui.model.FilterOperator.EQ, fromdate),
						// 	new sap.ui.model.Filter("Gdateto", sap.ui.model.FilterOperator.EQ, Todate),
						// 	new sap.ui.model.Filter("Weekly", sap.ui.model.FilterOperator.EQ, weekly)
						// ];

						// oModel.read("/GradingCountsSet?$filter=Guser eq 'PALLAVIM' and Gdatefrom eq '20221101' and Gdateto eq '20221130'", {
						oModel.read("/WeeklyStatusSet", {
							filters: Nfilter1,
							success: function (oData, oResponse) {
								tableModel.setData(oData);
								// passing count value
								//this.getView().byID("idLblCnt1").setValue("30");
								this.getView().getModel("ProductivityModel").setData(oData.results);
								this.getView().getModel("ProductivityModel").refresh();
							}.bind(this),

							error: function () {
								// MessageToast.show("Failed");
							}
						});
					}
				}
			}
		},
		onRbutton: function (evt) {
			var Option1 = this.getView().byId("Option").getSelectedButton().getText();
			if (Option1 === "Daily") {
				this.byId("FDate").setEnabled(true); //Disables the control
				this.byId("TDate").setEnabled(true); //Disables the control
				this.byId("Button1").setEnabled(true); //Disables the execute button
			}
			if (Option1 === "Weekly") {
				this.byId("FDate").setEnabled(false); //Disables the control
				this.byId("TDate").setEnabled(false); //Disables the control
				this.byId("Button1").setEnabled(true); //Disables the execute button
			}

		},
		onFilterSelect: function (oEvent) {
			var oBinding = this.byId("idWeekTable").getBinding("items"),
				sKey = oEvent.getParameter("key");
			// Array to combine filters
			//aFilters = [];
			this.byId("Button1").setEnabled(false); //Disables the execute button
			var ProductivityModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(ProductivityModel, "ProductivityModel");

			var tableModel = new sap.ui.model.json.JSONModel();
			var oModel = this.getOwnerComponent().getModel();

			var User = this.getView().byId("FUser").getValue().toUpperCase();
			var fromdate = this.getView().byId("FDate").getValue();
			var Option = this.getView().byId("Option").getSelectedButton().getText();
			if (Option === "Daily") {
				//	this.byId("idReportTable").getColumns()[1].setVisible(true);
				// 	this.byId("idReportTable").getColumns()[2].setVisible(false);
				// 	this.byId("idReportTable").getColumns()[3].setVisible(true);
			}
			if (Option === "Weekly") {
				//	this.byId("idReportTable").getColumns()[1].setVisible(false);
				// 	this.byId("idReportTable").getColumns()[2].setVisible(true);
				// 	this.byId("idReportTable").getColumns()[3].setVisible(false);
				var weekly = "X";
			}
			//var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "YYYYMMDD"});
			//var date = new Date(fromdate);
			//var dateStr = dateFormat.format(date);

			var Todate = this.getView().byId("TDate").getValue();
			var Nfilter = [
				new sap.ui.model.Filter("Guser", sap.ui.model.FilterOperator.EQ, User),
				new sap.ui.model.Filter("Gdatefrom", sap.ui.model.FilterOperator.EQ, fromdate),
				new sap.ui.model.Filter("Gdateto", sap.ui.model.FilterOperator.EQ, Todate),
				new sap.ui.model.Filter("Weekly", sap.ui.model.FilterOperator.EQ, weekly)
			];
			var Nfilter1 = [
				new sap.ui.model.Filter("Guser", sap.ui.model.FilterOperator.EQ, User),
			];
			if (sKey === "Grading") {
				// oModel.read("/GradingCountsSet?$filter=Guser eq 'PALLAVIM' and Gdatefrom eq '20221101' and Gdateto eq '20221130'", {
				oModel.read("/GradingCountsSet", {
					filters: Nfilter,
					success: function (oData, oResponse) {
						tableModel.setData(oData);
						// passing count value
						//this.getView().byID("idLblCnt1").setValue("30");
						this.getView().getModel("ProductivityModel").setData(oData.results);
						this.getView().getModel("ProductivityModel").refresh();
					}.bind(this)
				});
			} else if (sKey === "Receive") {
				// oModel.read("/GradingCountsSet?$filter=Guser eq 'PALLAVIM' and Gdatefrom eq '20221101' and Gdateto eq '20221130'", {
				oModel.read("/RecieveCountsSet", {
					filters: Nfilter,
					success: function (oData, oResponse) {
						tableModel.setData(oData);
						// passing count value
						//this.getView().byID("idLblCnt1").setValue("30");
						this.getView().getModel("ProductivityModel").setData(oData.results);
						this.getView().getModel("ProductivityModel").refresh();
					}.bind(this)
				});

			} else if (sKey === "Verify") {
				// oModel.read("/GradingCountsSet?$filter=Guser eq 'PALLAVIM' and Gdatefrom eq '20221101' and Gdateto eq '20221130'", {
				oModel.read("/VerifyCountsSet", {
					filters: Nfilter,
					success: function (oData, oResponse) {
						tableModel.setData(oData);
						// passing count value
						//this.getView().byID("idLblCnt1").setValue("30");
						this.getView().getModel("ProductivityModel").setData(oData.results);
						this.getView().getModel("ProductivityModel").refresh();
					}.bind(this)
				});
			} else if (sKey === "Slab") {
				// oModel.read("/GradingCountsSet?$filter=Guser eq 'PALLAVIM' and Gdatefrom eq '20221101' and Gdateto eq '20221130'", {
				oModel.read("/SlabbedCountsSet", {
					filters: Nfilter,
					success: function (oData, oResponse) {
						tableModel.setData(oData);
						// passing count value
						//this.getView().byID("idLblCnt1").setValue("30");
						this.getView().getModel("ProductivityModel").setData(oData.results);
						this.getView().getModel("ProductivityModel").refresh();
					}.bind(this)
				});
			} else if (sKey === "Image") {
				// oModel.read("/GradingCountsSet?$filter=Guser eq 'PALLAVIM' and Gdatefrom eq '20221101' and Gdateto eq '20221130'", {
				oModel.read("/ImageCountsSet", {
					filters: Nfilter,
					success: function (oData, oResponse) {
						tableModel.setData(oData);
						// passing count value
						//this.getView().byID("idLblCnt1").setValue("30");
						this.getView().getModel("ProductivityModel").setData(oData.results);
						this.getView().getModel("ProductivityModel").refresh();
					}.bind(this)
				});
			} else if (sKey === "Qc") {
				// oModel.read("/GradingCountsSet?$filter=Guser eq 'PALLAVIM' and Gdatefrom eq '20221101' and Gdateto eq '20221130'", {
				oModel.read("/QCCountsSet", {
					filters: Nfilter,
					success: function (oData, oResponse) {
						tableModel.setData(oData);
						// passing count value
						//this.getView().byID("idLblCnt1").setValue("30");
						this.getView().getModel("ProductivityModel").setData(oData.results);
						this.getView().getModel("ProductivityModel").refresh();
					}.bind(this)
				});
			} else if (
				sKey === "Final") {
				// oModel.read("/GradingCountsSet?$filter=Guser eq 'PALLAVIM' and Gdatefrom eq '20221101' and Gdateto eq '20221130'", {
				oModel.read("/FinalCountsSet", {
					filters: Nfilter,
					success: function (oData, oResponse) {
						tableModel.setData(oData);
						// passing count value
						//this.getView().byID("idLblCnt1").setValue("30");
						this.getView().getModel("ProductivityModel").setData(oData.results);
						this.getView().getModel("ProductivityModel").refresh();
					}.bind(this)
				});
			} else if (sKey === "Ship") {
				// oModel.read("/GradingCountsSet?$filter=Guser eq 'PALLAVIM' and Gdatefrom eq '20221101' and Gdateto eq '20221130'", {
				oModel.read("/ShipCountsSet", {
					filters: Nfilter,
					success: function (oData, oResponse) {
						tableModel.setData(oData);
						// passing count value
						//this.getView().byID("idLblCnt1").setValue("30");
						this.getView().getModel("ProductivityModel").setData(oData.results);
						this.getView().getModel("ProductivityModel").refresh();
					}.bind(this)
				});
			} else if (sKey === "Week" || sKey === " ") {
				// oModel.read("/GradingCountsSet?$filter=Guser eq 'PALLAVIM' and Gdatefrom eq '20221101' and Gdateto eq '20221130'", {
				oModel.read("/WeeklyStatusSet", {
					filters: Nfilter1,
					success: function (oData, oResponse) {
						tableModel.setData(oData);
						// passing count value
						//this.getView().byID("idLblCnt1").setValue("30");
						this.getView().getModel("ProductivityModel").setData(oData.results);
						this.getView().getModel("ProductivityModel").refresh();
					}.bind(this)
				});
			}
			//	oBinding.filter(aFilters);
		},
		BUhelp: function () {
			var BUModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(BUModel, "BUModel");

			var tableModel = new sap.ui.model.json.JSONModel();
			var oModel = this.getOwnerComponent().getModel();
			oModel.read("/HTspaSet", {
				// filters: filter,
				success: function (oData, oResponse) {
					tableModel.setData(oData);
					this.getView().getModel("BUModel").setData(oData.results);
					this.getView().getModel("BUModel").refresh();
				}.bind(this),

				error: function () {
					// MessageToast.show("Failed");
				}
			});
			this.cDialog = Fragment.load({
				name: "sap.ops.productivityreport.ZOPSPRODUCTIVITYREPORT.view.fragment.BUsearch",
				controller: this
			}).then(
				function (oFrag) {
					this.getView().addDependent(oFrag);
					oFrag.open();
				}.bind(this)
			);
		},
		onValueHelpCancelPress: function () {
			this._oValueHelpDialog.close();
		},

		onValueHelpAfterClose: function () {
			this._oValueHelpDialog.destroy();
		},

		handleOkDlogPress: function (oEvent) {
			var tb = sap.ui.getCore().byId("idBUSearch");
			var rowid = tb.getSelectedIndices();

			if (rowid.length === 0) {
				MessageBox.error("No Business Unit Row is selected");
			} else {
				//var BU = tb.getRows()[0].getCells()[0].getText();
				this.getView().byId("Bunit").setValue(this.BU);
				this.getView().byId("BTunit").setValue(this.text);
				var that = this;
				that.onCloseDialog();
			}
		},
		Userhelp: function () {
			var UserModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(UserModel, "UserModel");

			var tableModel = new sap.ui.model.json.JSONModel();
			var oModel = this.getOwnerComponent().getModel();

			oModel.read("/UserHelpSet", {
				// filters: filter,
				success: function (oData, oResponse) {
					tableModel.setData(oData);
					this.getView().getModel("UserModel").setData(oData.results);
					this.getView().getModel("UserModel").refresh();
				}.bind(this),

				error: function () {
					// MessageToast.show("Failed");
				}
			});
			this.cDialog = Fragment.load({
				name: "sap.ops.productivityreport.ZOPSPRODUCTIVITYREPORT.view.fragment.UserSearch",
				controller: this
			}).then(
				function (oFrag) {
					this.getView().addDependent(oFrag);
					oFrag.open();
				}.bind(this)
			);
		},
		handleOkUserPress: function (oEvent) {
			var tb = sap.ui.getCore().byId("idUserSearch");
			var rowid = tb.getSelectedIndices();
			if (rowid.length === 0) {
				MessageBox.error("No User is selected");
			} else {
				//var sPath = oEvent.getParameters().rowContext.getPath();
				//var selectedData = oEvent.getParameters().rowContext.getModel("UserModel").getProperty(sPath);
				//var User = tb.getRows()[rowid].getCells()[0].getText();
				//this.getView().getModel().setProperty("FUser", User);
				//	sap.ui.getCore().byId("FUser").setValue(User);
				this.getView().byId("FUser").setValue(this.user);
				var that = this;
				that.onCloseDialog();
			}
		},
		// On Fragment Close
		onCloseDialog: function (oEvent) {
			//	sap.ui.getCore().byId("idSportsCardf").setSelectedKey(" ");
			//	sap.ui.getCore().byId("idUser").setSelectedKey(" ");
			sap.ui.getCore().byId("colDialog").destroy();
		},
		action: function (oEvent) {
			var sPath = oEvent.getParameters().rowContext.getPath();
			var selectedData = oEvent.getParameters().rowContext.getModel("UserModel").getProperty(sPath);
			var User = selectedData.Bname;
			this.user = User;
			//this.getView().byId("FUser").setValue(this.User);
		},
		actionBU: function (oEvent) {
			var sPath = oEvent.getParameters().rowContext.getPath();
			var selectedData = oEvent.getParameters().rowContext.getModel("BUModel").getProperty(sPath);
			var BU = selectedData.Spart;
			var text = selectedData.Vtext;
			this.BU = BU;
			this.text = text;
			//this.getView().byId("FUser").setValue(this.User);
		}

	});
});