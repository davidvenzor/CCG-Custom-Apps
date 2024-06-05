sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function (Controller, MessageToast, JSONModel, MessageBox) {
	"use strict";

	return Controller.extend("CCGSDGRADINGAPP.ZSD_GRADINGAPP.controller.initial", {

		onInit: function () {

			// Declaring all the models			
			// sap.ui.core.BusyIndicator.show();
			this.onLandingPage();

		},

		onLandingPage: function () {

			this.getView().byId("idSalesOrder").setSelectedKey("");
			this.getView().byId("idLineItem").setSelectedKey("");

			// var CornerModel = new sap.ui.model.json.JSONModel();
			// this.getView().setModel(CornerModel, "CornerModel");
			// var CenterModel = new sap.ui.model.json.JSONModel();
			// this.getView().setModel(CenterModel, "CenterModel");
			// var AutoGradeModel = new sap.ui.model.json.JSONModel();
			// this.getView().setModel(AutoGradeModel, "AutoGradeModel");
			// var BumpModel = new sap.ui.model.json.JSONModel();
			// this.getView().setModel(BumpModel, "BumpModel");
			// var EdgeModel = new sap.ui.model.json.JSONModel();
			// this.getView().setModel(EdgeModel, "EdgeModel");
			// var GradeModel = new sap.ui.model.json.JSONModel();
			// this.getView().setModel(GradeModel, "GradeModel");
			// var NoGradeModel = new sap.ui.model.json.JSONModel();
			// this.getView().setModel(NoGradeModel, "NoGradeModel");
			// var SurfaceModel = new sap.ui.model.json.JSONModel();
			// this.getView().setModel(SurfaceModel, "SurfaceModel");
			// var PlayerModel = new sap.ui.model.json.JSONModel();
			// this.getView().setModel(PlayerModel, "PlayerModel");
			// var SetCodeModel = new sap.ui.model.json.JSONModel();
			// this.getView().setModel(SetCodeModel, "SetCodeModel");
			// SetCodeModel.setSizeLimit(1000);
			// var SportsCardModel = new sap.ui.model.json.JSONModel();
			// this.getView().setModel(SportsCardModel, "SportsCardModel");
			// var SubsetModel = new sap.ui.model.json.JSONModel();
			// this.getView().setModel(SubsetModel, "SubsetModel");
			// SubsetModel.setSizeLimit(3000);
			// var MakerModel = new sap.ui.model.json.JSONModel();
			// this.getView().setModel(MakerModel, "MakerModel");
			// MakerModel.setSizeLimit(1000);
			var InitModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(InitModel, "InitModel");

			var tableModel = new sap.ui.model.json.JSONModel();
			var oModel = this.getOwnerComponent().getModel();

			// Reading Data through odata Services

			var filter = [
				new sap.ui.model.Filter("LvVbeln", sap.ui.model.FilterOperator.EQ, this.oSalesID),
				new sap.ui.model.Filter("LvPosnr", sap.ui.model.FilterOperator.EQ, this.oLineId)
			];

			// Fetching data for the landing page initial dropdown (for Sales Order & Lineitem)
			var ifilter = [
				new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, "I")
			];
			oModel.read("/getInitialLineItemsSet", {
				filters: ifilter,
				success: function (oData, oResponse) {
					tableModel.setData(oData);
					// oData.results.unshift(" ");
					this.getView().getModel("InitModel").setData(oData.results);
					this.getView().getModel("InitModel").refresh();
				}.bind(this),
				error: function () {
					// MessageToast.show("Failed");
				}
			});

			this.onRefreshSo();
		},

		//This event triggers after entering sales order & lineitem in landing page

		onFetchDetails: function (oEvent) {

			this.oSalesID = this.getView().byId("idSalesOrder").getValue();
			// this.oLineID = this.getView().byId("idLineItem").getSelectedKey();
			this.oLineID = this.getView().byId("idLineItem")._lastValue;

			//If no lineitem is entered, by default it should pick lineitem 1

			if (this.oLineID === "") {
				// this.getView().byId("idLineItem").setSelectedKey("1");
				// this.oLineID = "1";
				MessageBox.error("Please select Lineitem");
			}

			if (this.oLineID !== "") {

				var tableModel = new sap.ui.model.json.JSONModel();
				var oModel = this.getOwnerComponent().getModel();

				var filter = [
					new sap.ui.model.Filter("LvVbeln", sap.ui.model.FilterOperator.EQ, this.oSalesID),
					new sap.ui.model.Filter("LvPosnr", sap.ui.model.FilterOperator.EQ, this.oLineID),
					new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, "L")
				];

				// Validation 2: OData Call to check if char VC_SC_GRADING_TIER has values "MECHANICAL ERROR" or "REHOLDER", restrict the grading 

				var chkDel = " ";
				oModel.read("/Grade_MARADATASet", {
					filters: filter,
					success: function (oData, oResponse) {
						tableModel.setData(oData);
						//Validation 1 : If the Delivery Block is "50" or "60", restrict the sales order from grading
						if (oData.results.length !== 0) {

							if (oData.results[0].Exflag === "X") {
								MessageBox.error("Verification not yet completed");
							} else {
								if (oData.results[0].Lifsk === "50") {
									chkDel = "X";
									MessageBox.error("Delivery Block active for Payment");

								} else {
									if ((oData.results[0].Zterm !== "0001") && ((oData.results[0].Cmgst === "B") || (oData.results[0].Cmgst === "C"))) {
										chkDel = "X";
										MessageBox.error("Order have credit limit exceeded,please remove credit block ");

									} else {

										if (oData.results[0].Lifsk === "60") {
											chkDel = "X";
											MessageBox.error("Delivery Block active");

										} else {

											if (chkDel !== "X") {

												//Routing to next page
												var oRouter = this.getOwnerComponent().getRouter();
												oRouter.navTo("grading", {
													SalesId: this.oSalesID,
													LineId: this.oLineID
												});
											}
										}
									}
								}
							}
						}

						this.getView().getModel("initMaraData").setData(oData.results[0]);
						this.getView().getModel("initMaraData").refresh();
					}.bind(this),

					error: function () {
						// MessageToast.show("Failed");
						// MessageBox.information("No Characteristic Values configured for the given Sales Order");
					}
				});

			}
		},

		//Refresh the intial screen and load sales order data again

		onRefreshSo: function (oEvent) {

			this.getView().byId("idSalesOrder").setSelectedKey("");
			this.getView().byId("idLineItem").setSelectedKey("");

			// Fetching data for the landing page initial dropdown (for Sales Order & Lineitem)
			var initMaraData = new sap.ui.model.json.JSONModel();
			this.getView().setModel(initMaraData, "initMaraData");
			var tableModel = new sap.ui.model.json.JSONModel();
			var oModel = this.getOwnerComponent().getModel();

			var ifilter = [
				new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, "I")
			];
			oModel.read("/getInitialLineItemsSet", {
				filters: ifilter,
				success: function (oData, oResponse) {
					tableModel.setData(oData);
					// oData.results.unshift(" ");
					this.getView().getModel("InitModel").setData(oData.results);
					this.getView().getModel("InitModel").refresh();
				}.bind(this),
				error: function () {
					// MessageToast.show("Failed");
				}
			});
		},

		//This event triggers after entering only sales order, to get line items available for that SO num

		onLineitemFetch: function (oEvent) {

			this.oSalesID = this.getView().byId("idSalesOrder").getValue();

			var tableModel = new sap.ui.model.json.JSONModel();
			var oModel = this.getOwnerComponent().getModel();

			var filter = [
				new sap.ui.model.Filter("LvVbeln", sap.ui.model.FilterOperator.EQ, this.oSalesID),
				new sap.ui.model.Filter("LvPosnr", sap.ui.model.FilterOperator.EQ, this.oLineID)
				// new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, "L")
			];

			// Validation 2: OData Call to check if char VC_SC_GRADING_TIER has values "MECHANICAL ERROR" or "REHOLDER", restrict the grading 

			oModel.read("/Grade_MARADATASet", {
				filters: filter,
				success: function (oData, oResponse) {
					tableModel.setData(oData);
					this.getView().getModel("initMaraData").setData(oData.results[0]);
					this.getView().getModel("initMaraData").refresh();
				}.bind(this),

				error: function () {
					// MessageToast.show("Failed");
					// MessageBox.information("No Characteristic Values configured for the given Sales Order");
				}
			});

			// OData Call to get line item numbers against the sales order Num 

			var InitModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(InitModel, "InitModel");
			var tableModelg = new sap.ui.model.json.JSONModel();

			var oModelg = this.getOwnerComponent().getModel();

			var filterg = [
				new sap.ui.model.Filter("Vbeln", sap.ui.model.FilterOperator.EQ, this.oSalesID),
				new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, "P")
			];

			oModelg.read("/getInitialLineItemsSet", {
				filters: filterg,
				// sorters: [
				// 	new sap.ui.model.Sorter("Posnr",true)
				// ],
				success: function (oData, oResponse) {
					tableModelg.setData(oData);
					// If wrong salesorder selected					
					if (oData.results.length === 0) {
						MessageBox.error("Please select Valid Sales Order number");
					}
					// oData.results.unshift(" ");
					this.getView().getModel("InitModel").setData(oData.results);
					this.getView().getModel("InitModel").refresh();
				}.bind(this),
				error: function () {
					// MessageToast.show("Failed");
				}
			});
		}
	});
});