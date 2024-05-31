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

			// Dropdowns
			// oModel.read("/Grade_cornerSet", {
			// 	filters: filter,
			// 	success: function (oData, oResponse) {
			// 		tableModel.setData(oData);
			// 		oData.results.unshift(" ");
			// 		this.getView().getModel("CornerModel").setData(oData.results);
			// 		this.getView().getModel("CornerModel").refresh();
			// 	}.bind(this),
			// 	error: function () {
			// 		// MessageToast.show("Failed");
			// 	}
			// });

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

			// // Dropdowns
			// oModel.read("/Grade_CenteringSet", {
			// 	filters: filter,
			// 	success: function (oData, oResponse) {
			// 		tableModel.setData(oData);
			// 		oData.results.unshift(" ");
			// 		this.getView().getModel("CenterModel").setData(oData.results);
			// 		this.getView().getModel("CenterModel").refresh();
			// 	}.bind(this),

			// 	error: function () {
			// 		// MessageToast.show("Failed");
			// 	}
			// });

			// // Dropdowns
			// oModel.read("/Grade_autogradeSet", {
			// 	filters: filter,
			// 	success: function (oData, oResponse) {
			// 		tableModel.setData(oData);
			// 		oData.results.unshift(" ");
			// 		this.getView().getModel("AutoGradeModel").setData(oData.results);
			// 		this.getView().getModel("AutoGradeModel").refresh();
			// 	}.bind(this),

			// 	error: function () {
			// 		// MessageToast.show("Failed");
			// 	}
			// });

			// // Dropdowns
			// oModel.read("/Grade_bumpSet", {
			// 	filters: filter,
			// 	success: function (oData, oResponse) {
			// 		tableModel.setData(oData);
			// 		oData.results.unshift(" ");
			// 		this.getView().getModel("BumpModel").setData(oData.results);
			// 		this.getView().getModel("BumpModel").refresh();
			// 	}.bind(this),

			// 	error: function () {
			// 		// MessageToast.show("Failed");
			// 	}
			// });

			// // Dropdowns			
			// oModel.read("/Grade_edgeSet", {
			// 	filters: filter,
			// 	success: function (oData, oResponse) {
			// 		tableModel.setData(oData);
			// 		oData.results.unshift(" ");
			// 		this.getView().getModel("EdgeModel").setData(oData.results);
			// 		this.getView().getModel("EdgeModel").refresh();
			// 	}.bind(this),

			// 	error: function () {
			// 		// MessageToast.show("Failed");
			// 	}
			// });

			// // Dropdowns
			// oModel.read("/Grade_gradeSet", {
			// 	filters: filter,
			// 	success: function (oData, oResponse) {
			// 		tableModel.setData(oData);
			// 		oData.results.unshift(" ");
			// 		this.getView().getModel("GradeModel").setData(oData.results);
			// 		this.getView().getModel("GradeModel").refresh();
			// 	}.bind(this),

			// 	error: function () {
			// 		// MessageToast.show("Failed");
			// 	}
			// });

			// // Dropdowns
			// oModel.read("/Grade_nogradeSet", {
			// 	filters: filter,
			// 	success: function (oData, oResponse) {
			// 		tableModel.setData(oData);
			// 		oData.results.unshift(" ");
			// 		this.getView().getModel("NoGradeModel").setData(oData.results);
			// 		this.getView().getModel("NoGradeModel").refresh();
			// 	}.bind(this),

			// 	error: function () {
			// 		// MessageToast.show("Failed");
			// 	}
			// });

			// // Dropdowns
			// oModel.read("/Grade_surfaceSet", {
			// 	filters: filter,
			// 	success: function (oData, oResponse) {
			// 		tableModel.setData(oData);
			// 		oData.results.unshift(" ");
			// 		this.getView().getModel("SurfaceModel").setData(oData.results);
			// 		this.getView().getModel("SurfaceModel").refresh();
			// 	}.bind(this),

			// 	error: function () {
			// 		// MessageToast.show("Failed");
			// 	}
			// });

			// // Dropdowns
			// oModel.read("/ZmmPlayersrchSet", {
			// 	// filters: filter,
			// 	success: function (oData, oResponse) {
			// 		tableModel.setData(oData);
			// 		oData.results.unshift(" ");
			// 		this.getView().getModel("PlayerModel").setData(oData.results);
			// 		this.getView().getModel("PlayerModel").refresh();
			// 	}.bind(this),

			// 	error: function () {
			// 		// MessageToast.show("Failed");
			// 	}
			// });

			// // Dropdowns
			// oModel.read("/Grade_MakerSet", {
			// 	filters: filter,
			// 	success: function (oData, oResponse) {
			// 		tableModel.setData(oData);
			// 		oData.results.unshift(" ");
			// 		this.getView().getModel("MakerModel").setData(oData.results);
			// 		this.getView().getModel("MakerModel").refresh();
			// 	}.bind(this),
			// 	error: function () {
			// 		// MessageToast.show("Failed");
			// 	}
			// });
			// // Dropdowns
			// oModel.read("/ZmmSubsetsrchSet", {
			// 	// filters: filter,
			// 	success: function (oData, oResponse) {
			// 		tableModel.setData(oData);
			// 		oData.results.unshift(" ");
			// 		this.getView().getModel("SubsetModel").setData(oData.results);
			// 		this.getView().getModel("SubsetModel").refresh();
			// 	}.bind(this),

			// 	error: function () {
			// 		// MessageToast.show("Failed");
			// 	}
			// });

			// // Dropdowns
			// oModel.read("/Grade_SportscardSet", {
			// 	success: function (oData, oResponse) {
			// 		tableModel.setData(oData);
			// 		oData.results.unshift(" ");
			// 		this.getView().getModel("SportsCardModel").setData(oData.results);
			// 		this.getView().getModel("SportsCardModel").refresh();
			// 		sap.ui.core.BusyIndicator.hide();
			// 	}.bind(this),

			// 	error: function () {
			// 		// MessageToast.show("Failed");
			// 		sap.ui.core.BusyIndicator.hide();
			// 	}
			// });

			// var dataObject = {
			// 	SalesId: "",
			// 	LineId: ""
			// };
			// var oInputModel = new sap.ui.model.json.JSONModel();
			// var oForm = this.getView().byId("SimpleFormDisplay");
			// oForm.setModel(oInputModel, "formModel");

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
					new sap.ui.model.Filter("LvPosnr", sap.ui.model.FilterOperator.EQ, this.oLineID)
					// new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, "L")
				];

				// Validation 2: OData Call to check if char VC_SC_GRADING_TIER has values "MECHANICAL ERROR" or "REHOLDER", restrict the grading 

				var chkDel = " ";
				oModel.read("/Grade_MARADATASet", {
					filters: filter,
					success: function (oData, oResponse) {
						tableModel.setData(oData);
						//Validation 1 : If the Delivery Block is "50" or "60", restrict the sales order from grading
						if (oData.results.length !== 0) {

							if (oData.results[0].Notation === "X") {
								MessageBox.error("Verification not yet completed");
							} else {
								if (oData.results[0].Lifsk === "50") {
									chkDel = "X";
									MessageBox.error("Delivery Block active for Payment");

								} else {
									if ((oData.results[0].ZTERM !== "0001") && ((oData.results[0].CMGST === "B") || (oData.results[0].CMGST === "C"))) {
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

				// //Validation 1 : If the Delivery Block is "50" or "60", restrict the sales order from grading

				// if (MaraData.ZThickHolderFlag === "X") {
				// 	MessageBox.error("Please complete the verification to proceed with Grading");
				// } else {
				// 	if (MaraData.Lifsk === "50") {
				// 		chkDel = "X";
				// 		MessageBox.error("Delivery Block active for Payment");

				// 	} else {

				// 		if (MaraData.Lifsk === "60") {
				// 			chkDel = "X";
				// 			MessageBox.error("Delivery Block active");

				// 		} else {

				// 			if (chkDel !== "X") {

				// 				//Routing to next page
				// 				var oRouter = this.getOwnerComponent().getRouter();
				// 				oRouter.navTo("grading", {
				// 					SalesId: this.oSalesID,
				// 					LineId: this.oLineID
				// 				});
				// 			}
				// 		}
				// 	}
				// }

				// var tableModel = new sap.ui.model.json.JSONModel();
				// var oModel = this.getOwnerComponent().getModel();

				// // Dropdowns			
				// oModel.read("/Grade_setcodeSet", {
				// 	// filters: filter,
				// 	success: function (oData, oResponse) {
				// 		tableModel.setData(oData);
				// 		oData.results.unshift(" ");
				// 		this.getView().getModel("SetCodeModel").setData(oData.results);
				// 		this.getView().getModel("SetCodeModel").refresh();
				// 	}.bind(this),

				// 	error: function () {
				// 		// MessageToast.show("Failed");
				// 	}
				// });
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
				new sap.ui.model.Filter("LvPosnr", sap.ui.model.FilterOperator.EQ, this.oLineID),
				new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, "L")
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