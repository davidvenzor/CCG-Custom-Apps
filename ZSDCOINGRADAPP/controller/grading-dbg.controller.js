sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"sap/m/PDFViewer",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/library"
], function (Controller, JSONModel, Filter, FilterOperator, MessageToast, MessageBox, Fragment, PDFViewer, Dialog, Button, library) {
	"use strict";

	return Controller.extend("CCGSDGRADINGAPP.ZSD_GRADINGAPP.controller.grading", {

		//Put Focus on Grade Field
		onAfterRendering: function (oEvent) {
			var oInputGrade = this.getView().byId("idGrade");
			jQuery.sap.delayedCall(200, this, function () {
				oInputGrade.focus();
			});
		},

		onInit: function () {

			//Model to hold values in collectible Fragment which is the search help used for Collectible ID Search
			var oMaraTempModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oMaraTempModel, "oMaraTempModel");

			var maraObjectArr = {
				Matnr: " ",
				Maktx: " ",
				ZCsgSportsCode: " ",
				ZCsgMakerCode: " ",
				ZCsgSetCode: " ",
				ZCardYear: " ",
				ZPlayer: " ",
				ZPrntdAutographFlag: " ",
				ZCsgCardAttrib1Descr: " ",
				ZCsgCardAttrib2Descr: " "
			};

			this.getView().getModel("oMaraTempModel").setData(maraObjectArr);
			this.getView().getModel("oMaraTempModel").refresh();

			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("grading").attachMatched(this._onRouteMatched, this);

			// var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// oRouter.attachRoutePatternMatched(this.onRouteMatched, this);
		},

		_onRouteMatched: function (oEvent) {

			//Initializing all the dropdowns/ui elements

			this.getView().byId("idSportsCard").setValue(" ");
			this.getView().byId("idInputManuf").setValue(" ");
			this.getView().byId("idSetCode").setValue(" ");
			this.getView().byId("idPlayer").setValue(" ");
			this.getView().byId("idSubset").setValue(" ");
			this.getView().byId("idInputCardNo").setValue(" ");
			this.getView().byId("idInputNota").setValue(" ");
			this.getView().byId("idInputPedig").setValue(" ");
			this.getView().byId("idInputCollId").setValue(" ");
			// this.getView().byId("idInputAuto").setValue(" ");
			this.getView().byId("idBump").setSelectedKey("");
			this.getView().byId("idInputYear").setValue(" ");
			this.getView().byId("idInputAttr1").setValue(" ");
			this.getView().byId("idInputAttr2").setValue(" ");
			this.getView().byId("idPerChk").setSelected(false);
			this.getView().byId("idFinish").setSelected(false);
			// this.getView().byId("idTxtSports").setText(" ");
			// this.getView().byId("idTxtMake").setText(" ");
			// this.getView().byId("idTxtSet").setText(" ");
			// this.getView().byId("idTxtSubset").setText(" ");
			this.getView().byId("idCrossOver").setValue(" ");

			var gradeObject = {
				selected: ""
			};
			var oGradselModel = new sap.ui.model.json.JSONModel(gradeObject);
			this.getView().setModel(oGradselModel, "oGradselModel");

			this.SalesId = oEvent.getParameters().arguments.SalesId;
			this.LineId = oEvent.getParameters().arguments.LineId;

			this.getView().byId("idGradSales").setText(this.SalesId);
			this.getView().byId("idGradLine").setText(this.LineId);

			var MaraDataModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(MaraDataModel, "MaraDataModel");

			var GradHistModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(GradHistModel, "GradHistModel");

			var CollectibleModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(CollectibleModel, "CollectibleModel");

			var InitModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(InitModel, "InitModel");

			var tableModel = new sap.ui.model.json.JSONModel();
			var oModel = this.getOwnerComponent().getModel();

			var YearModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(YearModel, "YearModel");

			var ImageModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(ImageModel, "ImageModel");

			var pInitModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(pInitModel, "pInitModel");

			var SportsCardModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(SportsCardModel, "SportsCardModel");

			var CornerModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(CornerModel, "CornerModel");
			var CenterModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(CenterModel, "CenterModel");
			var AutoGradeModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(AutoGradeModel, "AutoGradeModel");
			var BumpModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(BumpModel, "BumpModel");
			var EdgeModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(EdgeModel, "EdgeModel");
			var GradeModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(GradeModel, "GradeModel");
			var NoGradeModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(NoGradeModel, "NoGradeModel");
			var SurfaceModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(SurfaceModel, "SurfaceModel");
			// var PlayerModel = new sap.ui.model.json.JSONModel();
			// this.getView().setModel(PlayerModel, "PlayerModel");
			var SetCodeModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(SetCodeModel, "SetCodeModel");
			SetCodeModel.setSizeLimit(1000);
			var SubsetModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(SubsetModel, "SubsetModel");
			SubsetModel.setSizeLimit(3000);
			var MakerModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(MakerModel, "MakerModel");
			MakerModel.setSizeLimit(1000);

			var filter = [
				new sap.ui.model.Filter("LvVbeln", sap.ui.model.FilterOperator.EQ, this.SalesId),
				new sap.ui.model.Filter("LvPosnr", sap.ui.model.FilterOperator.EQ, this.LineId)
			];

			sap.ui.core.BusyIndicator.show();

			// Dropdowns
			oModel.read("/Grade_SportscardSet", {
				success: function (oData, oResponse) {
					tableModel.setData(oData);
					oData.results.unshift(" ");
					this.getView().getModel("SportsCardModel").setData(oData.results);
					this.getView().getModel("SportsCardModel").refresh();

				}.bind(this),

				error: function () {
					// MessageToast.show("Failed");
				}
			});

			// Dropdowns
			oModel.read("/Grade_CenteringSet", {
				filters: filter,
				success: function (oData, oResponse) {
					tableModel.setData(oData);
					oData.results.unshift(" ");
					this.getView().getModel("CenterModel").setData(oData.results);
					this.getView().getModel("CenterModel").refresh();
				}.bind(this),

				error: function () {
					// MessageToast.show("Failed");
				}
			});

			// // Dropdowns			
			oModel.read("/Grade_setcodeSet", {
				// filters: filter,
				success: function (oData, oResponse) {
					tableModel.setData(oData);
					oData.results.unshift(" ");
					this.getView().getModel("SetCodeModel").setData(oData.results);
					this.getView().getModel("SetCodeModel").refresh();
				}.bind(this),

				error: function () {
					// MessageToast.show("Failed");
				}
			});

			// Dropdowns
			oModel.read("/Grade_autogradeSet", {
				filters: filter,
				success: function (oData, oResponse) {
					tableModel.setData(oData);
					oData.results.unshift(" ");
					this.getView().getModel("AutoGradeModel").setData(oData.results);
					this.getView().getModel("AutoGradeModel").refresh();
				}.bind(this),

				error: function () {
					// MessageToast.show("Failed");
				}
			});

			// Dropdowns
			oModel.read("/Grade_bumpSet", {
				filters: filter,
				success: function (oData, oResponse) {
					tableModel.setData(oData);
					oData.results.unshift(" ");
					this.getView().getModel("BumpModel").setData(oData.results);
					this.getView().getModel("BumpModel").refresh();
				}.bind(this),

				error: function () {
					// MessageToast.show("Failed");
				}
			});

			// Dropdowns			
			oModel.read("/Grade_edgeSet", {
				filters: filter,
				success: function (oData, oResponse) {
					tableModel.setData(oData);
					oData.results.unshift(" ");
					this.getView().getModel("EdgeModel").setData(oData.results);
					this.getView().getModel("EdgeModel").refresh();
				}.bind(this),

				error: function () {
					// MessageToast.show("Failed");
				}
			});

			// Dropdowns
			oModel.read("/Grade_gradeSet", {
				filters: filter,
				success: function (oData, oResponse) {
					tableModel.setData(oData);
					oData.results.unshift(" ");
					this.getView().getModel("GradeModel").setData(oData.results);
					this.getView().getModel("GradeModel").refresh();
				}.bind(this),

				error: function () {
					// MessageToast.show("Failed");
				}
			});

			// Dropdowns
			oModel.read("/Grade_nogradeSet", {
				filters: filter,
				success: function (oData, oResponse) {
					tableModel.setData(oData);
					oData.results.unshift(" ");
					this.getView().getModel("NoGradeModel").setData(oData.results);
					this.getView().getModel("NoGradeModel").refresh();
				}.bind(this),

				error: function () {
					// MessageToast.show("Failed");
				}
			});

			// Dropdowns
			oModel.read("/Grade_surfaceSet", {
				filters: filter,
				success: function (oData, oResponse) {
					tableModel.setData(oData);
					oData.results.unshift(" ");
					this.getView().getModel("SurfaceModel").setData(oData.results);
					this.getView().getModel("SurfaceModel").refresh();
				}.bind(this),

				error: function () {
					// MessageToast.show("Failed");
				}
			});

			// Dropdowns
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

			// Dropdowns
			oModel.read("/Grade_MakerSet", {
				filters: filter,
				success: function (oData, oResponse) {
					tableModel.setData(oData);
					oData.results.unshift(" ");
					this.getView().getModel("MakerModel").setData(oData.results);
					this.getView().getModel("MakerModel").refresh();
				}.bind(this),
				error: function () {
					// MessageToast.show("Failed");
				}
			});
			// Dropdowns
			oModel.read("/ZmmSubsetsrchSet", {
				// filters: filter,
				success: function (oData, oResponse) {
					tableModel.setData(oData);
					oData.results.unshift(" ");
					this.getView().getModel("SubsetModel").setData(oData.results);
					this.getView().getModel("SubsetModel").refresh();
				}.bind(this),

				error: function () {
					// MessageToast.show("Failed");
				}
			});

			// Dropdowns
			oModel.read("/Grade_cornerSet", {
				filters: filter,
				success: function (oData, oResponse) {
					tableModel.setData(oData);
					oData.results.unshift(" ");
					this.getView().getModel("CornerModel").setData(oData.results);
					this.getView().getModel("CornerModel").refresh();
				}.bind(this),
				error: function () {
					// MessageToast.show("Failed");
				}
			});

			// OData Call to get characteristic values of entire grading app 

			oModel.read("/Grade_MARADATASet", {
				filters: filter,
				success: function (oData, oResponse) {
					tableModel.setData(oData);
					if (oData.results.length !== 0) {
						this.Certid = oData.results[0].CertificateNo;
						this.Collid = oData.results[0].CollectibleId;
						if (oData.results[0].ZThickHolderFlag === "X") {
							this.getView().byId("idTH").setSelected(true);
						} else {
							this.getView().byId("idTH").setSelected(false);
						}
						if (oData.results[0].FactoryAutograph === "X") {
							this.getView().byId("idInputAuto").setSelected(true);
						} else {
							this.getView().byId("idInputAuto").setSelected(false);
						}
						this.VcScCrossover = " ";
						this.VcScCrossover = oData.results[0].VcScCrossover;
						if (oData.results[0].VcScCrossover === " ") {
							this.getView().byId("idCrossOver").setVisible(false);
							this.getView().byId("idCrossOverl").setVisible(false);
						} else {
							this.getView().byId("idCrossOver").setVisible(true);
							this.getView().byId("idCrossOverl").setVisible(true);
							this.getView().byId("idCrossOver").setEditable(false);
						}

					}
					this.getView().getModel("MaraDataModel").setData(oData.results[0]);
					this.getView().getModel("MaraDataModel").refresh();

					// OData Call to get Image URL
					var imgfilter = [
						new sap.ui.model.Filter("CertType", sap.ui.model.FilterOperator.EQ, "sportsCards"),
						new sap.ui.model.Filter("CertId", sap.ui.model.FilterOperator.EQ, this.Certid)
					];

					var that = this;
					oModel.read("/Image_displaySet", {
						filters: imgfilter,
						success: function (oData, oResponse) {
							tableModel.setData(oData);
							if (oData.results[0].FrontUrl !== "proxy not triggered") {
								this.getView().byId("idFrontUrl").setSrc(oData.results[0].FrontUrl);
								this.getView().byId("idBackUrl").setSrc(oData.results[0].BackUrl);
							} else {
								// imageflag = sap.ui.require.toUrl("CCGSDGRADINGAPP.ZSD_GRADINGAPP.controller.grading/Image/No_image.png");
								that.getView().byId("idFrontUrl").setSrc("/sap/bc/ui5_ui5/sap/ZSD_GRADINGAPP/Image/No_image.png");
								that.getView().byId("idBackUrl").setSrc("/sap/bc/ui5_ui5/sap/ZSD_GRADINGAPP/Image/No_image.png");
							}
							// this.getView().getModel("ImageModel").setData(oData.results);
							// this.getView().getModel("ImageModel").refresh();
						}.bind(this),

						error: function () {

							// imageflag = sap.ui.require.toUrl("CCGSDGRADINGAPP.ZSD_GRADINGAPP.controller.grading/Image/No_image.png");
							that.getView().byId("idFrontUrl").setSrc("/sap/bc/ui5_ui5/sap/ZSD_GRADINGAPP/Image/No_image.png");
							that.getView().byId("idBackUrl").setSrc("/sap/bc/ui5_ui5/sap/ZSD_GRADINGAPP/Image/No_image.png");
						}

					});

				}.bind(this),

				error: function () {
					// MessageToast.show("Failed");
					// MessageBox.information("No Characteristic Values configured for the given Sales Order");
				}
			});

			// OData Call to get Grading history data

			oModel.read("/Grade_gradehistorySet", {
				filters: filter,
				success: function (oData, oResponse) {
					tableModel.setData(oData);
					if (oData.results.length !== 0) {
						if (oData.results[0].Perfect10 === "X") {
							this.getView().byId("idPerChk").setSelected(true);

							this.perfectchk = "S";

						} else {
							this.getView().byId("idPerChk").setSelected(false);
						}
						if (oData.results[0].GradeComplete === "X") {
							this.getView().byId("idFinish").setSelected(true);
							// this.getView().byId("idFinish").setEnabled(false);
							this.getView().byId("idExit").setEnabled(false);
							this.getView().byId("idPrevious").setEnabled(false);
							this.getView().byId("idNext").setEnabled(false);
							this.getView().byId("idInputCollId").setEnabled(false);
							this.getView().byId("idGrade").setEnabled(false);
							this.getView().byId("idCenter").setEnabled(false);
							this.getView().byId("idCorner").setEnabled(false);
							this.getView().byId("idEdge").setEnabled(false);
							this.getView().byId("idSurface").setEnabled(false);
							this.getView().byId("idAutoGrade").setEnabled(false);
							this.getView().byId("idNoGrade").setEnabled(false);
							this.getView().byId("idBump").setEnabled(false);
							this.getView().byId("idPerChk").setEnabled(false);

							MessageBox.information("Grading is Completed for this Salesorder and No further changes can be done");
						} else {
							this.getView().byId("idFinish").setSelected(false);
							// this.getView().byId("idFinish").setEnabled(true);
							this.getView().byId("idExit").setEnabled(true);
							this.getView().byId("idPrevious").setEnabled(true);
							this.getView().byId("idNext").setEnabled(true);
							this.getView().byId("idInputCollId").setEnabled(true);
							this.getView().byId("idGrade").setEnabled(true);
							this.getView().byId("idCenter").setEnabled(true);
							this.getView().byId("idCorner").setEnabled(true);
							this.getView().byId("idEdge").setEnabled(true);
							this.getView().byId("idSurface").setEnabled(true);
							this.getView().byId("idAutoGrade").setEnabled(true);
							this.getView().byId("idNoGrade").setEnabled(true);
							this.getView().byId("idBump").setEnabled(true);
							this.getView().byId("idPerChk").setEnabled(true);
						}
						if (oData.results[0].Nograde !== "") {
							this.getView().byId("idPerChk").setSelected(false);
							this.getView().byId("idGrade").setEnabled(false);
							this.getView().byId("idCenter").setEnabled(false);
							this.getView().byId("idCorner").setEnabled(false);
							this.getView().byId("idEdge").setEnabled(false);
							this.getView().byId("idSurface").setEnabled(false);
							this.getView().byId("idAutoGrade").setEnabled(false);
							this.getView().byId("idPerChk").setEnabled(false);
						}
						if (oData.results[0].Nograde === "") {
							this.getView().byId("idGrade").setEnabled(true);
							this.getView().byId("idCenter").setEnabled(true);
							this.getView().byId("idCorner").setEnabled(true);
							this.getView().byId("idEdge").setEnabled(true);
							this.getView().byId("idSurface").setEnabled(true);
							this.getView().byId("idAutoGrade").setEnabled(true);
							this.getView().byId("idPerChk").setEnabled(true);
						}

					}
					this.getView().getModel("GradHistModel").setData(oData.results);
					this.getView().getModel("GradHistModel").refresh();
				}.bind(this),

				error: function () {
					// MessageToast.show("Failed");
				}
			});

			// OData Call to get year dropdown data

			oModel.read("/getYearDropdownSet", {
				// filters: filter,
				success: function (oData, oResponse) {
					tableModel.setData(oData);
					this.getView().getModel("YearModel").setData(oData.results);
					this.getView().getModel("YearModel").refresh();
				}.bind(this),

				error: function () {
					// MessageToast.show("Failed");
				}
			});

			// OData Call to get Collectible Search help fragment data

			oModel.read("/ZmmSearchHelpSet", {
				// filters: filter,
				success: function (oData, oResponse) {
					tableModel.setData(oData);
					this.getView().getModel("CollectibleModel").setData(oData.results);
					this.getView().getModel("CollectibleModel").refresh();
				}.bind(this),

				error: function () {
					// MessageToast.show("Failed");
				}
			});

			var lfilter = [
				new sap.ui.model.Filter("Vbeln", sap.ui.model.FilterOperator.EQ, this.SalesId),
				new sap.ui.model.Filter("Posnr", sap.ui.model.FilterOperator.EQ, this.LineId),
				new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, "M")
			];

			// OData Call to get Missed Grading Data

			oModel.read("/getInitialLineItemsSet", {
				filters: lfilter,
				success: function (oData, oResponse) {
					tableModel.setData(oData);
					if (oData.results.length !== 0) {
						var nCnt = oData.results[0].ExCount;
						var tCnt = oData.results.length;
						var Labl = "Missed Gradings";
						var result = Labl.concat("(", nCnt, "/", tCnt, ")");
						this.getView().byId("idMsdGradTab").setText(result);
					}
					this.getView().getModel("InitModel").setData(oData.results);
					this.getView().getModel("InitModel").refresh();
					sap.ui.core.BusyIndicator.hide();

				}.bind(this),
				error: function () {
					// MessageToast.show("Failed");
					sap.ui.core.BusyIndicator.hide();
				}
			});

			var filterg = [
				new sap.ui.model.Filter("Vbeln", sap.ui.model.FilterOperator.EQ, this.SalesId),
				new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, "P")
			];

			oModel.read("/getInitialLineItemsSet", {
				filters: filterg,
				success: function (oData, oResponse) {
					tableModel.setData(oData);
					this.getView().getModel("pInitModel").setData(oData.results);
					this.getView().getModel("pInitModel").refresh();
				}.bind(this),
				error: function () {
					// MessageToast.show("Failed");
				}
			});
			sap.ui.core.BusyIndicator.hide();

		},

		onExitCust: function (oEvent) {
			var that = this;
			that.onSave();

			this.getView().getModel("InitModel").refresh();
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("initial");
			// window.location.reload();
		},

		onInitrefresh: function (oEvent) {

			// this.getView().getModel("InitModel").refresh();
			// this.getView().getModel("MaraDataModel").refresh();
			// this.getView().getModel("GradHistModel").refresh();
			// this.getView().getModel("CollectibleModel").refresh();
			// this.getView().getModel("InitModel").refresh();
			// this.getView().getModel("YearModel").refresh();
			// this.getView().getModel("GraderInfoModel").refresh();
			// this.getView().getModel("pInitModel").refresh();
			// this.getView().getModel("ImageModel").refresh();

		},

		onCancel: function (oEvent) {
			// var that = this. 
			this.getView().getModel("MaraDataModel").refresh();
			this.getView().getModel("GradHistModel").refresh();
			this.getView().getModel("CollectibleModel").refresh();
			this.getView().getModel("ImageModel").refresh();
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("initial");
			// window.location.reload();
		},

		//This even triggers on View Label button click. 

		onPrintLabel: function (oEvent) {

			var l_coll = this.getView().byId("idInputCollId").getValue();

			if (l_coll === "") {
				MessageBox.error("Collectible ID is missing, cannot Print Preview");
			}

			if (l_coll !== "") {
				var dialog = new sap.m.BusyDialog({
					text: "Please wait.. PDF Preview is getting Generated"
				});

				dialog.open();

				this.LineId = this.getView().byId("idGradLine").getText();
				var sServiceURL = this.getView().getModel().sServiceUrl;
				var sSource = sServiceURL + "/FILE_PDFDISPLAYSet(Vbeln='" + this.SalesId + "',Posnr='" + this.LineId + "',Box='NO')/$value";
				dialog.close();
				window.open(sSource);

			}
		},

		onCloseDialogn: function () {

			this.byId("imgDialog").close();

			if (this._pDialog) {

				var oDialogS = this._pDialog;

				oDialogS.close();
			}
		},
		// handleUploadPress: function () {
		// 	var oFileUploader = this.byId("fileUploader");
		// 	oFileUploader.checkFileReadable().then(function () {
		// 		oFileUploader.upload();
		// 	}, function (error) {

		// 	}).then(function () {
		// 		oFileUploader.clear();
		// 	});
		// },

		handleUploadPress: function (event) {
			// var view = this.getView();
			// var viewer = view.byId("viewer");
			// var localFile = event.getParameter("files");
			// // if user selects a local file
			// if (localFile) {
			// 	var fileName = localFile.name;
			// 	var index = fileName.lastIndexOf(".");
			// 	if (index >= 0 && index < fileName.length - 1) {
			// 		var sourceType = fileName.substr(index + 1);
			// 		loadModelIntoViewer(viewer, null, sourceType, localFile);
			// 	}
			// }
		},

		// On click of Next/save button , grading app should be loaded with next Lineitem characteristic Values

		onNext: function (event) {

			// Save the screen values before navigating to next lineitem

			var that = this;
			//Validation: If factory autograph is checked then auto grade is mandatory before saving
			var lvauto = this.getView().byId("idAutoGrade").getSelectedKey();
			if (this.getView().byId("idInputAuto").getSelected() === true) {

				if (lvauto === "") {
					MessageBox.error("Autograph Grade is Mandatory");
				} else {
					that.onSave();
				}
			} else {
				that.onSave();
			}

		},

		// On click of Previous/save button , grading app should be loaded with Previous Lineitem characteristic Values
		onPrevious: function (event) {
			// Save the screen values before navigating to previous lineitem
			var that = this;
			//Validation: If factory autograph is checked then auto grade is mandatory before saving
			var lvauto = this.getView().byId("idAutoGrade").getSelectedKey();
			if (this.getView().byId("idInputAuto").getSelected() === true) {

				if (lvauto === "") {
					MessageBox.error("Autograph Grade is Mandatory");
				} else {
					that.onSavep();
				}
			} else {
				that.onSavep();
			}
		},

		// On click of Save button, save all the Characteristics Values & Grading Values
		onSave: function (oEvent) {

			var lgrade;
			var lcenter;
			var lcorner;
			var ledge;
			var lsurface;
			var lauto;
			var lnoGrade;
			var lperfect;

			var headerData = this.getView().getModel("MaraDataModel").getData();

			// Functionality: if Grading Complete is checked on screen, that should be the last grading option given against that sales order
			if (this.getView().byId("idFinish").getSelected() === true) {
				var Lfinish = "X";
			} else {
				Lfinish = "Y";
			}

			// Functionality: if Perfect-10 is checked on screen, all the grading values should be passed as '10' char value
			//                if Perfect-10 is not checked, whatever the grade values selected should be saved
			if (this.getView().byId("idPerChk").getSelected() === true) {
				lgrade = "P10";
				lcenter = "10";
				lcorner = "10";
				ledge = "10";
				lsurface = "10";
				lperfect = "X";
				lauto = this.getView().byId("idAutoGrade").getSelectedKey();
				lnoGrade = this.getView().byId("idNoGrade").getSelectedKey();
			} else {
				lperfect = " ";
				lgrade = this.getView().byId("idGrade").getSelectedKey();
				lcenter = this.getView().byId("idCenter").getSelectedKey();
				lcorner = this.getView().byId("idCorner").getSelectedKey();
				ledge = this.getView().byId("idEdge").getSelectedKey();
				lsurface = this.getView().byId("idSurface").getSelectedKey();
				lauto = this.getView().byId("idAutoGrade").getSelectedKey();
				lnoGrade = this.getView().byId("idNoGrade").getSelectedKey();
			}

			var lNoGrade1 = this.getView().byId("idNoGrade").getSelectedKey();
			if (lNoGrade1 !== "") {
				lgrade = "";
				lcenter = "";
				lcorner = "";
				ledge = "";
				lsurface = "";
				lperfect = "";
				lauto = "";
			}

			// Save the characteristic values in history table
			var histHeadArr = [];
			var histHead = {
				ImFlag: "S",
				Center: lcenter,
				LvPosnr: headerData.LvPosnr,
				Corner: lcorner,
				BizUnit: " ",
				LvVbeln: headerData.LvVbeln,
				Edge: ledge,
				ExPosnr: " ",
				Surface: lsurface,
				ExVbeln: " ",
				Auto: lauto,
				SeqNo: 1,
				Action: "Graded",
				Vbeln: headerData.LvVbeln,
				Posnr: headerData.LvPosnr,
				CollectibleId: headerData.CollectibleId,
				Grade: lgrade,
				Guser: "",
				Gdate: "2022-06-27T00:00:00",
				FinalGrade: Lfinish,
				Nograde: lnoGrade,
				Perfect10: lperfect,
				Pedigree: headerData.Pedigree,
				InternalNote: headerData.InternalNote
			};
			histHeadArr.push(histHead);

			sap.ui.core.BusyIndicator.show();

			var that = this;
			var oDataModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZODATA_CHARACTERISTCS_GRADEAPP_SRV/");
			oDataModel.create("/Grade_gradehistorySet", histHead, {
				method: "POST",
				success: function (message) {
					// that.onMaraCreatecall();
					that.onGetGradeHistcall();
					// var text = message.MESSAGE;
					MessageToast.show("Grading Data Saved Succesfully");

					var message = new sap.m.dialog({
						title: "Success",
						state: "Success",
						content: new sap.m.Text({
							text: "History Saved Successfully"
						}).addStyleClass("classMessageBox"),
						beginButton: new sap.m.Button({
							text: "OK",
							press: function () {
								message.close();
							}
						}),
						afterClose: function () {
							message.destroy();
							// controller.onClearData();
						}
					});
					message.open();
					// sap.ui.core.BusyIndicator.hide();
				},

				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
					// alert("Create Operation failed : " + oError);
				}
			});

			// Functionality: if Perfect-10 is checked on screen, all the grading values should be passed as '10' char value
			//                if Perfect-10 is not checked, whatever the grade values selected should be saved
			if (this.getView().byId("idPerChk").getSelected() === true) {
				lgrade = "P10";
				lcenter = "10";
				lcorner = "10";
				ledge = "10";
				lsurface = "10";
				lperfect = "X";
				lauto = this.getView().byId("idAutoGrade").getSelectedKey();
				lnoGrade = this.getView().byId("idNoGrade").getSelectedKey();
			} else {
				lperfect = " ";
				lgrade = this.getView().byId("idGrade").getSelectedKey();
				lcenter = this.getView().byId("idCenter").getSelectedKey();
				lcorner = this.getView().byId("idCorner").getSelectedKey();
				ledge = this.getView().byId("idEdge").getSelectedKey();
				lsurface = this.getView().byId("idSurface").getSelectedKey();
				lauto = this.getView().byId("idAutoGrade").getSelectedKey();
				lnoGrade = this.getView().byId("idNoGrade").getSelectedKey();
			}

			lNoGrade1 = this.getView().byId("idNoGrade").getSelectedKey();
			if (lNoGrade1 !== "") {
				lgrade = "";
				lcenter = "";
				lcorner = "";
				ledge = "";
				lsurface = "";
				lperfect = "";
				lauto = "";
			}

			// var lsports = this.getView().byId("idTxtSports").getText();
			// var lsetcode = this.getView().byId("idTxtSet").getText();
			// var lsubset = this.getView().byId("idTxtSubset").getText();
			// var lplayer = this.getView().byId("idPlayer").getText();
			var lbump = this.getView().byId("idBump").getSelectedKey();

			var maraHeadArr = [];
			var maraHead = {
				ImFlag: "S",
				Centering: lcenter,
				ZThickHolderFlag: " ",
				Perfect10: lperfect,
				LvPosnr: headerData.LvPosnr,
				Corner: lcorner,
				LvVbeln: headerData.LvVbeln,
				Edge: ledge,
				ExPosnr: headerData.LvPosnr,
				Surface: lsurface,
				ExVbeln: headerData.LvVbeln,
				AutoGrade: lauto,
				Matnr: "",
				Grade: lgrade,
				ZCardYear: headerData.ZCardYear,
				NoGrade: lnoGrade,
				ZCsgSportsCode: headerData.ZCsgSportsCode,
				ZCsgMakerCode: headerData.ZCsgMakerCode,
				ZCsgSetCode: headerData.ZCsgSetCode,
				ZCsgSubsetCode: headerData.ZCsgSubsetCode,
				ZCsgSportPlayerCode: " ",
				ZCardNumber: headerData.ZCardNumber,
				ZCsgCardAttribute1Code: headerData.ZCsgCardAttribute1Code,
				ZCsgCardAttribute2Code: headerData.ZCsgCardAttribute2Code,
				ZCsgCardAttrib1Descr: headerData.ZCsgCardAttrib1Descr,
				ZCsgCardAttrib2Descr: headerData.ZCsgCardAttrib2Descr,
				Notation: headerData.Notation,
				Pedigree: headerData.Pedigree,
				FactoryAutograph: headerData.FactoryAutograph,
				Bump: lbump,
				InternalNote: headerData.InternalNote,
				CollectibleId: headerData.CollectibleId,
				ZSubjectDescription: headerData.ZSubjectDescription,
				CertificateNo: headerData.CertificateNo,
				VcScCrossover: headerData.VcScCrossover,
				VcScServices: headerData.VcScServices,
				VcScAddOn: headerData.VcScAddOn,
				VcScCrossoverCo: headerData.VcScCrossoverCo,
				VcScCrossoverGr: headerData.VcScCrossoverGr,
				VcTradeshow: headerData.VcTradeshow,
				ScAiSubgradeCentre: headerData.ScAiSubgradeCentre,
				ScAiSubgradeCorner: headerData.ScAiSubgradeCorner,
				ScAiSubgradeEdge: headerData.ScAiSubgradeEdge,
				ScAiSubgradeSurface: headerData.ScAiSubgradeSurface,
				ScAiSubgradeAuto: headerData.ScAiSubgradeAuto
			};
			maraHeadArr.push(maraHead);

			var oDataModelS = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZODATA_CHARACTERISTCS_GRADEAPP_SRV/");
			var that = this;
			oDataModelS.create("/Grade_MARADATASet", maraHead, {
				method: "POST",
				success: function (message) {
					// sap.ui.core.BusyIndicator.show();
					that.onGetMaraDatacall();
					that.onMissedCall();
					sap.ui.core.BusyIndicator.hide();
					var text = message.MESSAGE;
					MessageToast.show("Characteristics Data Saved Succesfully");

					var message = new sap.m.dialog({
						title: "Success",
						state: "Success",
						content: new sap.m.Text({
							text: "History Saved Successfully"
						}).addStyleClass("classMessageBox"),
						beginButton: new sap.m.Button({
							text: "OK",
							press: function () {
								message.close();
							}
						}),
						afterClose: function () {
							message.destroy();
							// controller.onClearData();
						}
					});
					message.open();
					// sap.ui.core.BusyIndicator.hide();
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
					// alert("Create Operation failed : " + oError);
				}
			});

		},

		// onMaraCreatecall: function (oEvent) {
		// 	// Save the characteristic values against respective characteristics

		// 	var lgrade;
		// 	var lcenter;
		// 	var lcorner;
		// 	var ledge;
		// 	var lsurface;
		// 	var lauto;
		// 	var lnoGrade;
		// 	var lperfect;

		// 	var headerData = this.getView().getModel("MaraDataModel").getData();

		// 	// Functionality: if Grading Complete is checked on screen, that should be the last grading option given against that sales order
		// 	if (this.getView().byId("idFinish").getSelected() == true) {
		// 		var Lfinish = "X";
		// 	} else {
		// 		Lfinish = "Y";
		// 	}

		// 	// Functionality: if Perfect-10 is checked on screen, all the grading values should be passed as '10' char value
		// 	//                if Perfect-10 is not checked, whatever the grade values selected should be saved
		// 	if (this.getView().byId("idPerChk").getSelected() == true) {
		// 		lgrade = "P10";
		// 		lcenter = "10";
		// 		lcorner = "10";
		// 		ledge = "10";
		// 		lsurface = "10";
		// 		lperfect = "X";
		// 		lauto = this.getView().byId("idAutoGrade").getSelectedKey();
		// 		lnoGrade = this.getView().byId("idNoGrade").getSelectedKey();
		// 	} else {
		// 		lperfect = " ";
		// 		lgrade = this.getView().byId("idGrade").getSelectedKey();
		// 		lcenter = this.getView().byId("idCenter").getSelectedKey();
		// 		lcorner = this.getView().byId("idCorner").getSelectedKey();
		// 		ledge = this.getView().byId("idEdge").getSelectedKey();
		// 		lsurface = this.getView().byId("idSurface").getSelectedKey();
		// 		lauto = this.getView().byId("idAutoGrade").getSelectedKey();
		// 		lnoGrade = this.getView().byId("idNoGrade").getSelectedKey();
		// 	}

		// 	var lNoGrade1 = this.getView().byId("idNoGrade").getSelectedKey();
		// 	if (lNoGrade1 !== "") {
		// 		lgrade = "";
		// 		lcenter = "";
		// 		lcorner = "";
		// 		ledge = "";
		// 		lsurface = "";
		// 		lperfect = "";
		// 		lauto = "";
		// 	}

		// 	// var lsports = this.getView().byId("idTxtSports").getText();
		// 	// var lsetcode = this.getView().byId("idTxtSet").getText();
		// 	var lsubset = this.getView().byId("idTxtSubset").getText();
		// 	var lplayer = this.getView().byId("idPlayer").getSelectedKey();
		// 	var lbump = this.getView().byId("idBump").getSelectedKey();

		// 	var maraHeadArr = [];
		// 	var maraHead = {
		// 		ImFlag: "S",
		// 		Centering: lcenter,
		// 		ZThickHolderFlag: " ",
		// 		Perfect10: lperfect,
		// 		LvPosnr: headerData.LvPosnr,
		// 		Corner: lcorner,
		// 		LvVbeln: headerData.LvVbeln,
		// 		Edge: ledge,
		// 		ExPosnr: headerData.LvPosnr,
		// 		Surface: lsurface,
		// 		ExVbeln: headerData.LvVbeln,
		// 		AutoGrade: lauto,
		// 		Matnr: "",
		// 		Grade: lgrade,
		// 		ZCardYear: headerData.ZCardYear,
		// 		NoGrade: lnoGrade,
		// 		ZCsgSportsCode: headerData.ZCsgSportsCode,
		// 		ZCsgMakerCode: headerData.ZCsgMakerCode,
		// 		ZCsgSetCode: headerData.ZCsgSetCode,
		// 		ZCsgSubsetCode: lsubset,
		// 		ZCsgSportPlayerCode: " ",
		// 		ZCardNumber: headerData.ZCardNumber,
		// 		ZCsgCardAttribute1Code: headerData.ZCsgCardAttribute1Code,
		// 		ZCsgCardAttribute2Code: headerData.ZCsgCardAttribute2Code,
		// 		ZCsgCardAttrib1Descr: headerData.ZCsgCardAttrib1Descr,
		// 		ZCsgCardAttrib2Descr: headerData.ZCsgCardAttrib2Descr,
		// 		Notation: headerData.Notation,
		// 		Pedigree: headerData.Pedigree,
		// 		FactoryAutograph: headerData.FactoryAutograph,
		// 		Bump: lbump,
		// 		InternalNote: headerData.InternalNote,
		// 		CollectibleId: headerData.CollectibleId,
		// 		ZSubjectDescription: headerData.ZSubjectDescription,
		// 		CertificateNo: headerData.CertificateNo,
		// 		VcScCrossover: headerData.VcScCrossover,
		// 		VcScServices: headerData.VcScServices,
		// 		VcScAddOn: headerData.VcScAddOn,
		// 		VcScCrossoverCo: headerData.VcScCrossoverCo,
		// 		VcScCrossoverGr: headerData.VcScCrossoverGr,
		// 		VcTradeshow: headerData.VcTradeshow,
		// 		ScAiSubgradeCentre: headerData.ScAiSubgradeCentre,
		// 		ScAiSubgradeCorner: headerData.ScAiSubgradeCorner,
		// 		ScAiSubgradeEdge: headerData.ScAiSubgradeEdge,
		// 		ScAiSubgradeSurface: headerData.ScAiSubgradeSurface,
		// 		ScAiSubgradeAuto: headerData.ScAiSubgradeAuto
		// 	};
		// 	maraHeadArr.push(maraHead);

		// 	var oDataModelS = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZODATA_CHARACTERISTCS_GRADEAPP_SRV/");
		// 	var that = this;
		// 	oDataModelS.create("/Grade_MARADATASet", maraHead, {
		// 		method: "POST",
		// 		success: function (message) {
		// 			sap.ui.core.BusyIndicator.show();
		// 			that.onGetMaraDatacall();
		// 			that.onMissedCall();
		// 			var text = message.MESSAGE;
		// 			MessageToast.show("Characteristics Data Saved Succesfully");

		// 			var message = new sap.m.dialog({
		// 				title: "Success",
		// 				state: "Success",
		// 				content: new sap.m.Text({
		// 					text: "History Saved Successfully"
		// 				}).addStyleClass("classMessageBox"),
		// 				beginButton: new sap.m.Button({
		// 					text: "OK",
		// 					press: function () {
		// 						message.close();
		// 					}
		// 				}),
		// 				afterClose: function () {
		// 					message.destroy();
		// 					// controller.onClearData();
		// 				}
		// 			});
		// 			message.open();
		// 			// sap.ui.core.BusyIndicator.hide();
		// 		},
		// 		error: function (oError) {
		// 			// alert("Create Operation failed : " + oError);
		// 		}
		// 	});

		// 	// var tableModel = new sap.ui.model.json.JSONModel();
		// 	// var oModel = this.getOwnerComponent().getModel();

		// 	// // After saving the values, reload the missed grading table data with latest status

		// 	// var lfilter = [
		// 	// 	new sap.ui.model.Filter("Vbeln", sap.ui.model.FilterOperator.EQ, this.SalesId),
		// 	// 	new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, "M")
		// 	// ];

		// 	// oModel.read("/getInitialLineItemsSet", {
		// 	// 	filters: lfilter,
		// 	// 	success: function (oData, oResponse) {
		// 	// 		tableModel.setData(oData);
		// 	// 		if (oData.results.length !== 0) {
		// 	// 			var nCnt = oData.results[0].ExCount;
		// 	// 			var tCnt = oData.results.length;
		// 	// 			var Labl = "Missed Gradings";
		// 	// 			var result = Labl.concat("(", nCnt, "/", tCnt, ")");
		// 	// 			this.getView().byId("idMsdGradTab").setText(result);
		// 	// 		}
		// 	// 		this.getView().byId("idMsdGradTab").setText(result);
		// 	// 		this.getView().getModel("InitModel").setData(oData.results);
		// 	// 		this.getView().getModel("InitModel").refresh();

		// 	// 	}.bind(this),
		// 	// 	error: function () {
		// 	// 		// MessageToast.show("Failed");
		// 	// 	}
		// 	// });

		// },

		// On click of Save button, save all the Characteristics Values & Grading Values
		onSavep: function (oEvent) {

			var lgrade;
			var lcenter;
			var lcorner;
			var ledge;
			var lsurface;
			var lauto;
			var lnoGrade;
			var lperfect;

			var headerData = this.getView().getModel("MaraDataModel").getData();

			// Functionality: if Grading Complete is checked on screen, that should be the last grading option given against that sales order
			if (this.getView().byId("idFinish").getSelected() == true) {
				var Lfinish = "X";
			} else {
				Lfinish = "Y";
			}

			// Functionality: if Perfect-10 is checked on screen, all the grading values should be passed as '10' char value
			//                if Perfect-10 is not checked, whatever the grade values selected should be saved
			if (this.getView().byId("idPerChk").getSelected() == true) {
				lgrade = "P10";
				lcenter = "10";
				lcorner = "10";
				ledge = "10";
				lsurface = "10";
				lperfect = "X";
				lauto = this.getView().byId("idAutoGrade").getSelectedKey();
				lnoGrade = this.getView().byId("idNoGrade").getSelectedKey();
			} else {
				lperfect = " ";
				lgrade = this.getView().byId("idGrade").getSelectedKey();
				lcenter = this.getView().byId("idCenter").getSelectedKey();
				lcorner = this.getView().byId("idCorner").getSelectedKey();
				ledge = this.getView().byId("idEdge").getSelectedKey();
				lsurface = this.getView().byId("idSurface").getSelectedKey();
				lauto = this.getView().byId("idAutoGrade").getSelectedKey();
				lnoGrade = this.getView().byId("idNoGrade").getSelectedKey();
			}

			var lNoGrade1 = this.getView().byId("idNoGrade").getSelectedKey();
			if (lNoGrade1 !== "") {
				lgrade = "";
				lcenter = "";
				lcorner = "";
				ledge = "";
				lsurface = "";
				lperfect = "";
				lauto = "";
			}

			// Save the characteristic values in history table
			var histHeadArr = [];
			var histHead = {
				ImFlag: "S",
				Center: lcenter,
				LvPosnr: headerData.LvPosnr,
				Corner: lcorner,
				BizUnit: " ",
				LvVbeln: headerData.LvVbeln,
				Edge: ledge,
				ExPosnr: " ",
				Surface: lsurface,
				ExVbeln: " ",
				Auto: lauto,
				SeqNo: 1,
				Action: "Graded",
				Vbeln: headerData.LvVbeln,
				Posnr: headerData.LvPosnr,
				CollectibleId: headerData.CollectibleId,
				Grade: lgrade,
				Guser: "",
				Gdate: "2022-06-27T00:00:00",
				FinalGrade: Lfinish,
				Nograde: lnoGrade,
				Perfect10: lperfect
			};
			histHeadArr.push(histHead);

			sap.ui.core.BusyIndicator.show();

			var that = this;
			var oDataModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZODATA_CHARACTERISTCS_GRADEAPP_SRV/");
			oDataModel.create("/Grade_gradehistorySet", histHead, {
				method: "POST",
				success: function (message) {
					// that.onMaraCreatecallp();
					that.onGetGradeHistcallp();
					var text = message.MESSAGE;
					MessageToast.show("Grading Data Saved Succesfully");

					var message = new sap.m.dialog({
						title: "Success",
						state: "Success",
						content: new sap.m.Text({
							text: "History Saved Successfully"
						}).addStyleClass("classMessageBox"),
						beginButton: new sap.m.Button({
							text: "OK",
							press: function () {
								message.close();
							}
						}),
						afterClose: function () {
							message.destroy();
							// controller.onClearData();
						}
					});
					message.open();
					// sap.ui.core.BusyIndicator.hide();
				},

				error: function (oError) {
					// alert("Create Operation failed : " + oError);
				}
			});

			// Functionality: if Perfect-10 is checked on screen, all the grading values should be passed as '10' char value
			//                if Perfect-10 is not checked, whatever the grade values selected should be saved
			if (this.getView().byId("idPerChk").getSelected() == true) {
				lgrade = "P10";
				lcenter = "10";
				lcorner = "10";
				ledge = "10";
				lsurface = "10";
				lperfect = "X";
				lauto = this.getView().byId("idAutoGrade").getSelectedKey();
				lnoGrade = this.getView().byId("idNoGrade").getSelectedKey();
			} else {
				lperfect = " ";
				lgrade = this.getView().byId("idGrade").getSelectedKey();
				lcenter = this.getView().byId("idCenter").getSelectedKey();
				lcorner = this.getView().byId("idCorner").getSelectedKey();
				ledge = this.getView().byId("idEdge").getSelectedKey();
				lsurface = this.getView().byId("idSurface").getSelectedKey();
				lauto = this.getView().byId("idAutoGrade").getSelectedKey();
				lnoGrade = this.getView().byId("idNoGrade").getSelectedKey();
			}

			var lNoGrade1 = this.getView().byId("idNoGrade").getSelectedKey();
			if (lNoGrade1 !== "") {
				lgrade = "";
				lcenter = "";
				lcorner = "";
				ledge = "";
				lsurface = "";
				lperfect = "";
				lauto = "";
			}

			// var lsports = this.getView().byId("idTxtSports").getText();
			// var lsetcode = this.getView().byId("idTxtSet").getText();
			// var lsubset = this.getView().byId("idSubset").getValue();
			// var lplayer = this.getView().byId("idPlayer").getValue();
			var lbump = this.getView().byId("idBump").getSelectedKey();

			var maraHeadArr = [];
			var maraHead = {
				ImFlag: "S",
				Centering: lcenter,
				ZThickHolderFlag: " ",
				Perfect10: lperfect,
				LvPosnr: headerData.LvPosnr,
				Corner: lcorner,
				LvVbeln: headerData.LvVbeln,
				Edge: ledge,
				ExPosnr: headerData.LvPosnr,
				Surface: lsurface,
				ExVbeln: headerData.LvVbeln,
				AutoGrade: lauto,
				Matnr: "",
				Grade: lgrade,
				ZCardYear: headerData.ZCardYear,
				NoGrade: lnoGrade,
				ZCsgSportsCode: headerData.ZCsgSportsCode,
				ZCsgMakerCode: headerData.ZCsgMakerCode,
				ZCsgSetCode: headerData.ZCsgSetCode,
				ZCsgSubsetCode: " ",
				ZCsgSportPlayerCode: " ",
				ZCardNumber: headerData.ZCardNumber,
				ZCsgCardAttribute1Code: headerData.ZCsgCardAttribute1Code,
				ZCsgCardAttribute2Code: headerData.ZCsgCardAttribute2Code,
				ZCsgCardAttrib1Descr: headerData.ZCsgCardAttrib1Descr,
				ZCsgCardAttrib2Descr: headerData.ZCsgCardAttrib2Descr,
				Notation: headerData.Notation,
				Pedigree: headerData.Pedigree,
				FactoryAutograph: headerData.FactoryAutograph,
				Bump: lbump,
				InternalNote: headerData.InternalNote,
				CollectibleId: headerData.CollectibleId,
				ZSubjectDescription: headerData.ZSubjectDescription,
				CertificateNo: headerData.CertificateNo,
				VcScCrossover: headerData.VcScCrossover,
				VcScServices: headerData.VcScServices,
				VcScAddOn: headerData.VcScAddOn,
				VcScCrossoverCo: headerData.VcScCrossoverCo,
				VcScCrossoverGr: headerData.VcScCrossoverGr,
				VcTradeshow: headerData.VcTradeshow,
				ScAiSubgradeCentre: headerData.ScAiSubgradeCentre,
				ScAiSubgradeCorner: headerData.ScAiSubgradeCorner,
				ScAiSubgradeEdge: headerData.ScAiSubgradeEdge,
				ScAiSubgradeSurface: headerData.ScAiSubgradeSurface,
				ScAiSubgradeAuto: headerData.ScAiSubgradeAuto
			};
			maraHeadArr.push(maraHead);

			var oDataModelS = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZODATA_CHARACTERISTCS_GRADEAPP_SRV/");
			var that = this;
			oDataModelS.create("/Grade_MARADATASet", maraHead, {
				method: "POST",
				success: function (message) {
					sap.ui.core.BusyIndicator.show();
					that.onGetMaraDatacallp();
					that.onMissedCall();
					// sap.ui.core.BusyIndicator.hide();
					var text = message.MESSAGE;
					MessageToast.show("Characteristics Data Saved Succesfully");

					var message = new sap.m.dialog({
						title: "Success",
						state: "Success",
						content: new sap.m.Text({
							text: "History Saved Successfully"
						}).addStyleClass("classMessageBox"),
						beginButton: new sap.m.Button({
							text: "OK",
							press: function () {
								message.close();
							}
						}),
						afterClose: function () {
							message.destroy();
							// controller.onClearData();
						}
					});
					message.open();
					// sap.ui.core.BusyIndicator.hide();
				},
				error: function (oError) {
					// alert("Create Operation failed : " + oError);
				}
			});

		},

		// onMaraCreatecallp: function (oEvent) {
		// 	// Save the characteristic values against respective characteristics

		// 	var lgrade;
		// 	var lcenter;
		// 	var lcorner;
		// 	var ledge;
		// 	var lsurface;
		// 	var lauto;
		// 	var lnoGrade;
		// 	var lperfect;

		// 	var headerData = this.getView().getModel("MaraDataModel").getData();

		// 	// Functionality: if Grading Complete is checked on screen, that should be the last grading option given against that sales order
		// 	if (this.getView().byId("idFinish").getSelected() == true) {
		// 		var Lfinish = "X";
		// 	} else {
		// 		Lfinish = "Y";
		// 	}

		// 	// Functionality: if Perfect-10 is checked on screen, all the grading values should be passed as '10' char value
		// 	//                if Perfect-10 is not checked, whatever the grade values selected should be saved
		// 	if (this.getView().byId("idPerChk").getSelected() == true) {
		// 		lgrade = "P10";
		// 		lcenter = "10";
		// 		lcorner = "10";
		// 		ledge = "10";
		// 		lsurface = "10";
		// 		lperfect = "X";
		// 		lauto = this.getView().byId("idAutoGrade").getSelectedKey();
		// 		lnoGrade = this.getView().byId("idNoGrade").getSelectedKey();
		// 	} else {
		// 		lperfect = " ";
		// 		lgrade = this.getView().byId("idGrade").getSelectedKey();
		// 		lcenter = this.getView().byId("idCenter").getSelectedKey();
		// 		lcorner = this.getView().byId("idCorner").getSelectedKey();
		// 		ledge = this.getView().byId("idEdge").getSelectedKey();
		// 		lsurface = this.getView().byId("idSurface").getSelectedKey();
		// 		lauto = this.getView().byId("idAutoGrade").getSelectedKey();
		// 		lnoGrade = this.getView().byId("idNoGrade").getSelectedKey();
		// 	}

		// 	var lNoGrade1 = this.getView().byId("idNoGrade").getSelectedKey();
		// 	if (lNoGrade1 !== "") {
		// 		lgrade = "";
		// 		lcenter = "";
		// 		lcorner = "";
		// 		ledge = "";
		// 		lsurface = "";
		// 		lperfect = "";
		// 		lauto = "";
		// 	}

		// 	// var lsports = this.getView().byId("idTxtSports").getText();
		// 	// var lsetcode = this.getView().byId("idTxtSet").getText();
		// 	var lsubset = this.getView().byId("idTxtSubset").getText();
		// 	var lplayer = this.getView().byId("idPlayer").getSelectedKey();
		// 	var lbump = this.getView().byId("idBump").getSelectedKey();

		// 	var maraHeadArr = [];
		// 	var maraHead = {
		// 		ImFlag: "S",
		// 		Centering: lcenter,
		// 		ZThickHolderFlag: " ",
		// 		Perfect10: lperfect,
		// 		LvPosnr: headerData.LvPosnr,
		// 		Corner: lcorner,
		// 		LvVbeln: headerData.LvVbeln,
		// 		Edge: ledge,
		// 		ExPosnr: headerData.LvPosnr,
		// 		Surface: lsurface,
		// 		ExVbeln: headerData.LvVbeln,
		// 		AutoGrade: lauto,
		// 		Matnr: "",
		// 		Grade: lgrade,
		// 		ZCardYear: headerData.ZCardYear,
		// 		NoGrade: lnoGrade,
		// 		ZCsgSportsCode: headerData.ZCsgSportsCode,
		// 		ZCsgMakerCode: headerData.ZCsgMakerCode,
		// 		ZCsgSetCode: headerData.ZCsgSetCode,
		// 		ZCsgSubsetCode: lsubset,
		// 		ZCsgSportPlayerCode: " ",
		// 		ZCardNumber: headerData.ZCardNumber,
		// 		ZCsgCardAttribute1Code: headerData.ZCsgCardAttribute1Code,
		// 		ZCsgCardAttribute2Code: headerData.ZCsgCardAttribute2Code,
		// 		ZCsgCardAttrib1Descr: headerData.ZCsgCardAttrib1Descr,
		// 		ZCsgCardAttrib2Descr: headerData.ZCsgCardAttrib2Descr,
		// 		Notation: headerData.Notation,
		// 		Pedigree: headerData.Pedigree,
		// 		FactoryAutograph: headerData.FactoryAutograph,
		// 		Bump: lbump,
		// 		InternalNote: headerData.InternalNote,
		// 		CollectibleId: headerData.CollectibleId,
		// 		ZSubjectDescription: headerData.ZSubjectDescription,
		// 		CertificateNo: headerData.CertificateNo,
		// 		VcScCrossover: headerData.VcScCrossover,
		// 		VcScServices: headerData.VcScServices,
		// 		VcScAddOn: headerData.VcScAddOn,
		// 		VcScCrossoverCo: headerData.VcScCrossoverCo,
		// 		VcScCrossoverGr: headerData.VcScCrossoverGr,
		// 		VcTradeshow: headerData.VcTradeshow,
		// 		ScAiSubgradeCentre: headerData.ScAiSubgradeCentre,
		// 		ScAiSubgradeCorner: headerData.ScAiSubgradeCorner,
		// 		ScAiSubgradeEdge: headerData.ScAiSubgradeEdge,
		// 		ScAiSubgradeSurface: headerData.ScAiSubgradeSurface,
		// 		ScAiSubgradeAuto: headerData.ScAiSubgradeAuto
		// 	};
		// 	maraHeadArr.push(maraHead);

		// 	var oDataModelS = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZODATA_CHARACTERISTCS_GRADEAPP_SRV/");
		// 	var that = this;
		// 	oDataModelS.create("/Grade_MARADATASet", maraHead, {
		// 		method: "POST",
		// 		success: function (message) {
		// 			sap.ui.core.BusyIndicator.show();
		// 			that.onGetMaraDatacallp();
		// 			that.onMissedCall();
		// 			var text = message.MESSAGE;
		// 			MessageToast.show("Characteristics Data Saved Succesfully");

		// 			var message = new sap.m.dialog({
		// 				title: "Success",
		// 				state: "Success",
		// 				content: new sap.m.Text({
		// 					text: "History Saved Successfully"
		// 				}).addStyleClass("classMessageBox"),
		// 				beginButton: new sap.m.Button({
		// 					text: "OK",
		// 					press: function () {
		// 						message.close();
		// 					}
		// 				}),
		// 				afterClose: function () {
		// 					message.destroy();
		// 					// controller.onClearData();
		// 				}
		// 			});
		// 			message.open();
		// 			// sap.ui.core.BusyIndicator.hide();
		// 		},
		// 		error: function (oError) {
		// 			// alert("Create Operation failed : " + oError);
		// 		}
		// 	});

		// 	// var tableModel = new sap.ui.model.json.JSONModel();
		// 	// var oModel = this.getOwnerComponent().getModel();

		// 	// // After saving the values, reload the missed grading table data with latest status

		// 	// var lfilter = [
		// 	// 	new sap.ui.model.Filter("Vbeln", sap.ui.model.FilterOperator.EQ, this.SalesId),
		// 	// 	new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, "M")
		// 	// ];

		// 	// oModel.read("/getInitialLineItemsSet", {
		// 	// 	filters: lfilter,
		// 	// 	success: function (oData, oResponse) {
		// 	// 		tableModel.setData(oData);
		// 	// 		if (oData.results.length !== 0) {
		// 	// 			var nCnt = oData.results[0].ExCount;
		// 	// 			var tCnt = oData.results.length;
		// 	// 			var Labl = "Missed Gradings";
		// 	// 			var result = Labl.concat("(", nCnt, "/", tCnt, ")");
		// 	// 			this.getView().byId("idMsdGradTab").setText(result);
		// 	// 		}
		// 	// 		this.getView().byId("idMsdGradTab").setText(result);
		// 	// 		this.getView().getModel("InitModel").setData(oData.results);
		// 	// 		this.getView().getModel("InitModel").refresh();

		// 	// 	}.bind(this),
		// 	// 	error: function () {
		// 	// 		// MessageToast.show("Failed");
		// 	// 	}
		// 	// });

		// },

		// onCollectEnter: function () {

		// 	this.LineId = this.getView().byId("idGradLine").getText();
		// 	this.CollectId = this.getView().byId("idInputCollId")._lastValue;

		// 	var tableModelp = new sap.ui.model.json.JSONModel();
		// 	var oModelp = this.getOwnerComponent().getModel();
		// 	var pfilter = [
		// 		new sap.ui.model.Filter("LvVbeln", sap.ui.model.FilterOperator.EQ, this.SalesId),
		// 		new sap.ui.model.Filter("LvPosnr", sap.ui.model.FilterOperator.EQ, this.LineId),
		// 		new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, "C"),
		// 		new sap.ui.model.Filter("ImCollectid", sap.ui.model.FilterOperator.EQ, this.CollectId)
		// 	];

		// 	oModelp.read("/Grade_MARADATASet", {
		// 		filters: pfilter,
		// 		success: function (oData, oResponse) {
		// 			tableModelp.setData(oData);
		// 			this.getView().getModel("MaraDataModel").setData(oData.results[0]);
		// 			this.getView().getModel("MaraDataModel").refresh();
		// 		}.bind(this),

		// 		error: function () {
		// 			// MessageToast.show("Failed");
		// 		}
		// 	});

		// },

		onGetMaraDatacallp: function (oEvent) {

			this.LineId = this.getView().byId("idGradLine").getText();

			var InitData = this.getView().getModel("pInitModel").getData();
			var chk = " ";

			// Check if Previous Line item is available, if not pop-up information
			if (this.LineId == InitData[0].Posnr) {
				chk = "X";
				MessageBox.information("No Previous Lineitems to Grade");
			}

			// If Previous Lineitem is available, load the characteristic values of previous Lineitem
			if (chk !== "X") {
				this.getView().byId("idSportsCard").setValue(" ");
				this.getView().byId("idInputManuf").setValue(" ");
				this.getView().byId("idSetCode").setValue(" ");
				this.getView().byId("idPlayer").setValue(" ");
				this.getView().byId("idSubset").setValue(" ");
				this.getView().byId("idInputCardNo").setValue(" ");
				this.getView().byId("idInputNota").setValue(" ");
				this.getView().byId("idInputPedig").setValue(" ");
				this.getView().byId("idInputCollId").setValue(" ");
				// this.getView().byId("idInputAuto").setSelected(false);
				this.getView().byId("idBump").setSelectedKey("");
				this.getView().byId("idInputYear").setValue(" ");
				this.getView().byId("idInputAttr1").setValue(" ");
				this.getView().byId("idInputAttr2").setValue(" ");
				// this.getView().byId("idPerChk").setSelected(false);
				this.getView().byId("idCrossOver").setValue(" ");
				this.getView().byId("idGrade").setEnabled(true);
				this.getView().byId("idCenter").setEnabled(true);
				this.getView().byId("idCorner").setEnabled(true);
				this.getView().byId("idEdge").setEnabled(true);
				this.getView().byId("idSurface").setEnabled(true);
				this.getView().byId("idAutoGrade").setEnabled(true);
				this.getView().byId("idNoGrade").setEnabled(true);
				// this.getView().byId("idPerChk").setEnabled(true);

			}
			this.LineId = this.getView().byId("idGradLine").getText();

			var tableModeln = new sap.ui.model.json.JSONModel();
			var tableModel1 = new sap.ui.model.json.JSONModel();

			var oModeln = this.getOwnerComponent().getModel();
			var oModel1 = this.getOwnerComponent().getModel();

			// OData Call to get characteristic values of entire grading app 				
			var Nfilter = [
				new sap.ui.model.Filter("LvVbeln", sap.ui.model.FilterOperator.EQ, this.SalesId),
				new sap.ui.model.Filter("LvPosnr", sap.ui.model.FilterOperator.EQ, this.LineId),
				new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, "P")
			];

			oModeln.read("/Grade_MARADATASet", {
				filters: Nfilter,
				success: function (oData, oResponse) {
					tableModeln.setData(oData);
					if (oData.results.length !== 0) {
						this.Collid = oData.results[0].CollectibleId;
						this.VcScCrossover = " ";
						this.VcScCrossover = oData.results[0].VcScCrossover;
					}
					if (oData.results.length !== 0) {
						if (oData.results[0].ZThickHolderFlag === "X") {
							this.getView().byId("idTH").setSelected(true);
						} else {
							this.getView().byId("idTH").setSelected(false);
						}
						if (oData.results[0].FactoryAutograph === "X") {
							this.getView().byId("idInputAuto").setSelected(true);
						} else {
							this.getView().byId("idInputAuto").setSelected(false);
						}
						if (oData.results[0].NoGrade !== "") {
							this.getView().byId("idPerChk").setSelected(false);
							this.getView().byId("idGrade").setEnabled(false);
							this.getView().byId("idCenter").setEnabled(false);
							this.getView().byId("idCorner").setEnabled(false);
							this.getView().byId("idEdge").setEnabled(false);
							this.getView().byId("idSurface").setEnabled(false);
							this.getView().byId("idAutoGrade").setEnabled(false);
							this.getView().byId("idPerChk").setEnabled(false);
						}
						if (oData.results[0].NoGrade === "") {
							this.getView().byId("idGrade").setEnabled(true);
							this.getView().byId("idCenter").setEnabled(true);
							this.getView().byId("idCorner").setEnabled(true);
							this.getView().byId("idEdge").setEnabled(true);
							this.getView().byId("idSurface").setEnabled(true);
							this.getView().byId("idAutoGrade").setEnabled(true);
							this.getView().byId("idPerChk").setEnabled(true);
						}
					}
					this.getView().getModel("MaraDataModel").setData(oData.results[0]);
					this.getView().getModel("MaraDataModel").refresh();
				}.bind(this),

				error: function () {
					// MessageToast.show("Failed");
				}
			});
		},

		onGetMaraDatacall: function (oEvent) {

			this.LineId = this.getView().byId("idGradLine").getText();
			var InitData = this.getView().getModel("pInitModel").getData();

			var chk = " ";

			// Validation 4 : on click of Next, Popup Information Message when there is no further lineitems for this sales order

			for (var i = 0; i < InitData.length; i++) {

				if (i == (InitData.length - 1)) {
					var oGrade = InitData[i];

					if (this.LineId == oGrade.Posnr) {
						chk = "X";
						MessageBox.information("No further Lineitems to Grade");
					}
				}
			}

			// If Next Lineitem is available, load the characteristic values of next Lineitem

			if (chk !== "X") {

				// this.getView().getModel("SetCodeModel").refresh();
				// this.getView().getModel("SubsetModel").refresh();
				// this.getView().getModel("SportsCardModel").refresh();
				// this.getView().getModel("PlayerModel").refresh();
				// this.getView().getModel("BumpModel").refresh();
				this.getView().byId("idSportsCard").setValue(" ");
				this.getView().byId("idInputManuf").setValue(" ");
				this.getView().byId("idSetCode").setValue(" ");
				this.getView().byId("idPlayer").setValue(" ");
				this.getView().byId("idSubset").setValue(" ");
				this.getView().byId("idInputCardNo").setValue(" ");
				this.getView().byId("idInputNota").setValue(" ");
				this.getView().byId("idInputPedig").setValue(" ");
				this.getView().byId("idInputCollId").setValue(" ");
				// this.getView().byId("idInputAuto").setSelected(false);
				this.getView().byId("idBump").setSelectedKey("");
				this.getView().byId("idInputYear").setValue(" ");
				this.getView().byId("idInputAttr1").setValue(" ");
				this.getView().byId("idInputAttr2").setValue(" ");
				// this.getView().byId("idPerChk").setSelected(false);
				this.getView().byId("idCrossOver").setValue(" ");
				this.getView().byId("idGrade").setEnabled(true);
				this.getView().byId("idCenter").setEnabled(true);
				this.getView().byId("idCorner").setEnabled(true);
				this.getView().byId("idEdge").setEnabled(true);
				this.getView().byId("idSurface").setEnabled(true);
				this.getView().byId("idAutoGrade").setEnabled(true);
				this.getView().byId("idNoGrade").setEnabled(true);
				// this.getView().byId("idPerChk").setEnabled(true);

			}

			this.LineId = this.getView().byId("idGradLine").getText();

			var tableModeln = new sap.ui.model.json.JSONModel();
			var tableModel1 = new sap.ui.model.json.JSONModel();

			var oModeln = this.getOwnerComponent().getModel();
			var oModel1 = this.getOwnerComponent().getModel();

			// OData Call to get characteristic values of entire grading app 				
			var Nfilter = [
				new sap.ui.model.Filter("LvVbeln", sap.ui.model.FilterOperator.EQ, this.SalesId),
				new sap.ui.model.Filter("LvPosnr", sap.ui.model.FilterOperator.EQ, this.LineId),
				new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, "N")
			];

			oModeln.read("/Grade_MARADATASet", {
				filters: Nfilter,
				success: function (oData, oResponse) {
					tableModeln.setData(oData);
					if (oData.results.length !== 0) {
						this.Collid = oData.results[0].CollectibleId;
						this.VcScCrossover = " ";
						this.VcScCrossover = oData.results[0].VcScCrossover;
					}
					if (oData.results.length !== 0) {
						if (oData.results[0].ZThickHolderFlag === "X") {
							this.getView().byId("idTH").setSelected(true);
						} else {
							this.getView().byId("idTH").setSelected(false);
						}
						if (oData.results[0].FactoryAutograph === "X") {
							this.getView().byId("idInputAuto").setSelected(true);
						} else {
							this.getView().byId("idInputAuto").setSelected(false);
						}
						if (oData.results[0].NoGrade !== "") {
							this.getView().byId("idPerChk").setSelected(false);
							this.getView().byId("idGrade").setEnabled(false);
							this.getView().byId("idCenter").setEnabled(false);
							this.getView().byId("idCorner").setEnabled(false);
							this.getView().byId("idEdge").setEnabled(false);
							this.getView().byId("idSurface").setEnabled(false);
							this.getView().byId("idAutoGrade").setEnabled(false);
							// this.getView().byId("idPerChk").setEnabled(false);
						}
						if (oData.results[0].NoGrade === "") {
							this.getView().byId("idGrade").setEnabled(true);
							this.getView().byId("idCenter").setEnabled(true);
							this.getView().byId("idCorner").setEnabled(true);
							this.getView().byId("idEdge").setEnabled(true);
							this.getView().byId("idSurface").setEnabled(true);
							this.getView().byId("idAutoGrade").setEnabled(true);
							// this.getView().byId("idPerChk").setEnabled(true);
						}
					}
					this.getView().getModel("MaraDataModel").setData(oData.results[0]);
					this.getView().getModel("MaraDataModel").refresh();
				}.bind(this),

				error: function () {
					// MessageToast.show("Failed");
				}
			});
		},

		onGetGradeHistcallp: function (oEvent) {

			var tableModeln = new sap.ui.model.json.JSONModel();
			var tableModel1 = new sap.ui.model.json.JSONModel();

			var oModeln = this.getOwnerComponent().getModel();
			var oModel1 = this.getOwnerComponent().getModel();
			this.LineId = this.getView().byId("idGradLine").getText();
			// OData Call to get Grading history data
			var filter = [
				new sap.ui.model.Filter("LvVbeln", sap.ui.model.FilterOperator.EQ, this.SalesId),
				new sap.ui.model.Filter("LvPosnr", sap.ui.model.FilterOperator.EQ, this.LineId),
				new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, "P")
			];

			oModel1.read("/Grade_gradehistorySet", {
				filters: filter,
				success: function (oData, oResponse) {
					tableModel1.setData(oData);
					if (oData.results.length !== 0) {
						if (oData.results[0].Perfect10 === "X") {
							this.perfectchk = "S";
							this.getView().byId("idPerChk").setSelected(true);
							this.getView().byId("idPerChk").setEnabled(true);
						} else {
							this.getView().byId("idPerChk").setSelected(false);
							this.getView().byId("idPerChk").setEnabled(true);
						}

						if (oData.results[0].GradeComplete === "X") {
							this.getView().byId("idFinish").setSelected(true);
							// this.getView().byId("idFinish").setEnabled(false);
							this.getView().byId("idExit").setEnabled(false);
							this.getView().byId("idPrevious").setEnabled(false);
							this.getView().byId("idNext").setEnabled(false);
							this.getView().byId("idInputCollId").setEnabled(false);
							this.getView().byId("idGrade").setEnabled(false);
							this.getView().byId("idCenter").setEnabled(false);
							this.getView().byId("idCorner").setEnabled(false);
							this.getView().byId("idEdge").setEnabled(false);
							this.getView().byId("idSurface").setEnabled(false);
							this.getView().byId("idAutoGrade").setEnabled(false);
							this.getView().byId("idNoGrade").setEnabled(false);
							this.getView().byId("idBump").setEnabled(false);
							this.getView().byId("idPerChk").setEnabled(false);

							MessageBox.information("Grading is Completed for this Salesorder and No further changes can be done");

						} else {

							this.getView().byId("idFinish").setSelected(false);
							// this.getView().byId("idFinish").setEnabled(true);
							this.getView().byId("idExit").setEnabled(true);
							this.getView().byId("idPrevious").setEnabled(true);
							this.getView().byId("idNext").setEnabled(true);
							this.getView().byId("idInputCollId").setEnabled(true);
							this.getView().byId("idGrade").setEnabled(true);
							this.getView().byId("idCenter").setEnabled(true);
							this.getView().byId("idCorner").setEnabled(true);
							this.getView().byId("idEdge").setEnabled(true);
							this.getView().byId("idSurface").setEnabled(true);
							this.getView().byId("idAutoGrade").setEnabled(true);
							this.getView().byId("idNoGrade").setEnabled(true);
							this.getView().byId("idBump").setEnabled(true);
							this.getView().byId("idPerChk").setEnabled(true);
						}

						if (oData.results[0].Nograde !== "") {
							this.getView().byId("idPerChk").setSelected(false);
							this.getView().byId("idGrade").setEnabled(false);
							this.getView().byId("idCenter").setEnabled(false);
							this.getView().byId("idCorner").setEnabled(false);
							this.getView().byId("idEdge").setEnabled(false);
							this.getView().byId("idSurface").setEnabled(false);
							this.getView().byId("idAutoGrade").setEnabled(false);
							this.getView().byId("idPerChk").setEnabled(false);
						} else {
							this.getView().byId("idGrade").setEnabled(true);
							this.getView().byId("idCenter").setEnabled(true);
							this.getView().byId("idCorner").setEnabled(true);
							this.getView().byId("idEdge").setEnabled(true);
							this.getView().byId("idSurface").setEnabled(true);
							this.getView().byId("idAutoGrade").setEnabled(true);
							this.getView().byId("idPerChk").setEnabled(true);
						}
					}
					this.getView().getModel("GradHistModel").setData(oData.results);
					this.getView().getModel("GradHistModel").refresh();

				}.bind(this),

				error: function () {
					// MessageToast.show("Failed");
				}
			});

			this.getView().byId("idPerChk").setSelected(false);
		},

		onGetGradeHistcall: function (oEvent) {

			var tableModeln = new sap.ui.model.json.JSONModel();
			var tableModel1 = new sap.ui.model.json.JSONModel();

			var oModeln = this.getOwnerComponent().getModel();
			var oModel1 = this.getOwnerComponent().getModel();
			this.LineId = this.getView().byId("idGradLine").getText();
			// OData Call to get Grading history data
			var filter = [
				new sap.ui.model.Filter("LvVbeln", sap.ui.model.FilterOperator.EQ, this.SalesId),
				new sap.ui.model.Filter("LvPosnr", sap.ui.model.FilterOperator.EQ, this.LineId),
				new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, "N")
			];

			oModel1.read("/Grade_gradehistorySet", {
				filters: filter,
				success: function (oData, oResponse) {
					tableModel1.setData(oData);
					if (oData.results.length !== 0) {
						if (oData.results[0].Perfect10 === "X") {
							this.perfectchk = "S";
							this.getView().byId("idPerChk").setSelected(true);
							this.getView().byId("idPerChk").setEnabled(true);
						} else {
							this.getView().byId("idPerChk").setSelected(false);
							this.getView().byId("idPerChk").setEnabled(true);
						}

						if (oData.results[0].GradeComplete === "X") {
							this.getView().byId("idFinish").setSelected(true);
							// this.getView().byId("idFinish").setEnabled(false);
							this.getView().byId("idExit").setEnabled(false);
							this.getView().byId("idPrevious").setEnabled(false);
							this.getView().byId("idNext").setEnabled(false);
							this.getView().byId("idInputCollId").setEnabled(false);
							this.getView().byId("idGrade").setEnabled(false);
							this.getView().byId("idCenter").setEnabled(false);
							this.getView().byId("idCorner").setEnabled(false);
							this.getView().byId("idEdge").setEnabled(false);
							this.getView().byId("idSurface").setEnabled(false);
							this.getView().byId("idAutoGrade").setEnabled(false);
							this.getView().byId("idNoGrade").setEnabled(false);
							this.getView().byId("idBump").setEnabled(false);
							this.getView().byId("idPerChk").setEnabled(false);

							MessageBox.information("Grading is Completed for this Salesorder and No further changes can be done");

						} else {

							this.getView().byId("idFinish").setSelected(false);
							// this.getView().byId("idFinish").setEnabled(true);
							this.getView().byId("idExit").setEnabled(true);
							this.getView().byId("idPrevious").setEnabled(true);
							this.getView().byId("idNext").setEnabled(true);
							this.getView().byId("idInputCollId").setEnabled(true);
							this.getView().byId("idGrade").setEnabled(true);
							this.getView().byId("idCenter").setEnabled(true);
							this.getView().byId("idCorner").setEnabled(true);
							this.getView().byId("idEdge").setEnabled(true);
							this.getView().byId("idSurface").setEnabled(true);
							this.getView().byId("idAutoGrade").setEnabled(true);
							this.getView().byId("idNoGrade").setEnabled(true);
							this.getView().byId("idBump").setEnabled(true);
							this.getView().byId("idPerChk").setEnabled(true);
						}

						if (oData.results[0].Nograde !== "") {
							this.getView().byId("idPerChk").setSelected(false);
							this.getView().byId("idGrade").setEnabled(false);
							this.getView().byId("idCenter").setEnabled(false);
							this.getView().byId("idCorner").setEnabled(false);
							this.getView().byId("idEdge").setEnabled(false);
							this.getView().byId("idSurface").setEnabled(false);
							this.getView().byId("idAutoGrade").setEnabled(false);
							this.getView().byId("idPerChk").setEnabled(false);
						} else {
							this.getView().byId("idGrade").setEnabled(true);
							this.getView().byId("idCenter").setEnabled(true);
							this.getView().byId("idCorner").setEnabled(true);
							this.getView().byId("idEdge").setEnabled(true);
							this.getView().byId("idSurface").setEnabled(true);
							this.getView().byId("idAutoGrade").setEnabled(true);
							this.getView().byId("idPerChk").setEnabled(true);
						}
					}
					this.getView().getModel("GradHistModel").setData(oData.results);
					this.getView().getModel("GradHistModel").refresh();

				}.bind(this),

				error: function () {
					// MessageToast.show("Failed");
				}
			});

			this.getView().byId("idPerChk").setSelected(false);
		},
		onMissedCall: function (oEvent) {

			var tableModel = new sap.ui.model.json.JSONModel();
			var oModel = this.getOwnerComponent().getModel();
			var lfilter = [
				new sap.ui.model.Filter("Vbeln", sap.ui.model.FilterOperator.EQ, this.SalesId),
				new sap.ui.model.Filter("Posnr", sap.ui.model.FilterOperator.EQ, this.LineId),
				new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, "M")
			];

			// After saving the values, reload the missed grading table data with latest status
			oModel.read("/getInitialLineItemsSet", {
				filters: lfilter,
				success: function (oData, oResponse) {
					tableModel.setData(oData);
					if (oData.results.length !== 0) {
						var nCnt = oData.results[0].ExCount;
						var tCnt = oData.results.length;
						var Labl = "Missed Gradings";
						var result = Labl.concat("(", nCnt, "/", tCnt, ")");
						this.getView().byId("idMsdGradTab").setText(result);
					}
					// sap.ui.core.BusyIndicator.hide();
					this.getView().byId("idMsdGradTab").setText(result);
					this.getView().getModel("InitModel").setData(oData.results);
					this.getView().getModel("InitModel").refresh();
					sap.ui.core.BusyIndicator.hide();
				}.bind(this),
				error: function () {
					sap.ui.core.BusyIndicator.hide();
					// MessageToast.show("Failed");
				}
			});
		},

		// This triggers on click of Perfect-10 checkbox. If it is checked, set all the grading values with '10-Pristine' by default else put back old values
		onPerSelect: function (oEvent) {
			// write busy indicator
			// sap.ui.core.BusyIndicator.show(0);

			if (this.getView().byId("idPerChk").getSelected() == true) {

				var DataModel = new sap.ui.model.json.JSONModel();
				DataModel = {
					kgrade: this.getView().byId("idGrade").getSelectedKey(),
					kcenter: this.getView().byId("idCenter").getSelectedKey(),
					kcorner: this.getView().byId("idCorner").getSelectedKey(),
					kedge: this.getView().byId("idEdge").getSelectedKey(),
					ksurface: this.getView().byId("idSurface").getSelectedKey(),
					lgrade: this.getView().byId("idGrade").getValue(),
					lcenter: this.getView().byId("idCenter").getValue(),
					lcorner: this.getView().byId("idCorner").getValue(),
					ledge: this.getView().byId("idEdge").getValue(),
					lsurface: this.getView().byId("idSurface").getValue()
				};

				this.getView().setModel(DataModel, "DataModel");

				this.getView().byId("idCenter").setValue("Gem Mint 10");
				this.getView().byId("idCorner").setValue("Gem Mint 10");
				this.getView().byId("idEdge").setValue("Gem Mint 10");
				this.getView().byId("idSurface").setValue("Gem Mint 10");
				this.getView().byId("idGrade").setValue("Perfect 10");
				this.getView().byId("idCenter").setSelectedKey("10");
				// this.getView().byId("idCenter").setEditable(false);
				this.getView().byId("idCorner").setSelectedKey("10");
				// this.getView().byId("idCorner").setEditable(false);
				this.getView().byId("idEdge").setSelectedKey("10");
				// this.getView().byId("idEdge").setEditable(false);
				this.getView().byId("idSurface").setSelectedKey("10");
				// this.getView().byId("idSurface").setEditable(false);
				this.getView().byId("idGrade").setSelectedKey("P10");
				// this.getView().byId("idGrade").setEditable(false);
			}

			if (this.getView().byId("idPerChk").getSelected() === false) {

				if (this.perfectchk !== "S") {

					var lgrade = this.getView().getModel("DataModel").lgrade;
					var lcenter = this.getView().getModel("DataModel").lcenter;
					var lcorner = this.getView().getModel("DataModel").lcorner;
					var ledge = this.getView().getModel("DataModel").ledge;
					var lsurface = this.getView().getModel("DataModel").lsurface;
					var kgrade = this.getView().getModel("DataModel").kgrade;
					var kcenter = this.getView().getModel("DataModel").kcenter;
					var kcorner = this.getView().getModel("DataModel").kcorner;
					var kedge = this.getView().getModel("DataModel").kedge;
					var ksurface = this.getView().getModel("DataModel").ksurface;
				}

				this.perfectchk = " ";

				this.getView().byId("idCenter").setValue(lcenter);
				this.getView().byId("idCorner").setValue(lcorner);
				this.getView().byId("idEdge").setValue(ledge);
				this.getView().byId("idSurface").setValue(lsurface);
				this.getView().byId("idGrade").setValue(lgrade);

				this.getView().byId("idCenter").setSelectedKey(kcenter);
				this.getView().byId("idCorner").setSelectedKey(kcorner);
				this.getView().byId("idEdge").setSelectedKey(kedge);
				this.getView().byId("idSurface").setSelectedKey(ksurface);
				this.getView().byId("idGrade").setSelectedKey(kgrade);

				// // this.getView().byId("idCenter").setEditable(true);
				// // this.getView().byId("idCenter").setEditable(true);
				// // this.getView().byId("idCorner").setEditable(true);
				// // this.getView().byId("idEdge").setEditable(true);
				// // this.getView().byId("idSurface").setEditable(true);
				// // this.getView().byId("idSurface").setEditable(true);
			}
			// sap.ui.core.BusyIndicator.hide();
		},

		// Commenting this functionality for time being 

		// onSportsChange: function (oEvent) {
		// 	this.LineId = this.getView().byId("idGradLine").getText();
		// 	var lcardYr = this.getView().byId("idInputYear").getValue();
		// 	var lSports = this.getView().byId("idSportsCard").getSelectedKey();
		// 	var lmaker = this.getView().byId("idInputManuf").getSelectedKey();
		// 	var lsetCode = this.getView().byId("idSetCode").getSelectedKey();
		// 	var lplayer = this.getView().byId("idPlayer").getSelectedKey();

		// 	var tableModelp = new sap.ui.model.json.JSONModel();
		// 	var oModelp = this.getOwnerComponent().getModel();
		// 	var pfilter = [
		// 		new sap.ui.model.Filter("LvVbeln", sap.ui.model.FilterOperator.EQ, this.SalesId),
		// 		new sap.ui.model.Filter("LvPosnr", sap.ui.model.FilterOperator.EQ, this.LineId),
		// 		new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, "S"),
		// 		new sap.ui.model.Filter("ImSportsCode", sap.ui.model.FilterOperator.EQ, lSports),
		// 		new sap.ui.model.Filter("ImMakerCode", sap.ui.model.FilterOperator.EQ, lmaker),
		// 		new sap.ui.model.Filter("ImCardYear", sap.ui.model.FilterOperator.EQ, lcardYr),
		// 		new sap.ui.model.Filter("ImCsgSetCode", sap.ui.model.FilterOperator.EQ, lsetCode),
		// 		new sap.ui.model.Filter("ImCsgPlayerCode", sap.ui.model.FilterOperator.EQ, lplayer)
		// 	];

		// 	oModelp.read("/Grade_MARADATASet", {
		// 		filters: pfilter,
		// 		success: function (oData, oResponse) {
		// 			tableModelp.setData(oData);
		// 			this.getView().getModel("MaraDataModel").setData(oData.results[0]);
		// 			this.getView().getModel("MaraDataModel").refresh();
		// 		}.bind(this),

		// 		error: function () {
		// 			// MessageToast.show("Failed");
		// 		}
		// 	});
		// },

		// This triggers, On click of Collectible ID Search help
		onValueHelpRequested: function () {

			var tableModelf = new sap.ui.model.json.JSONModel();
			var oModelf = this.getOwnerComponent().getModel();

			oModelf.read("/ZmmSearchHelpSet", {
				// filters: gFilter,
				success: function (oData, oResponse) {
					tableModelf.setData(oData);
					this.getView().getModel("CollectibleModel").setData(oData.results);
					this.getView().getModel("CollectibleModel").refresh();
				}.bind(this),

				error: function () {
					// MessageToast.show("Failed");
				}
			});

			this.cDialog = Fragment.load({
				name: "CCGSDGRADINGAPP.ZSD_GRADINGAPP.view.fragment.collectible",
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

			var tb = sap.ui.getCore().byId("idGradeTablef");
			var rowid = tb.getSelectedIndices();

			if (rowid.length == 0) {
				MessageBox.error("No Collectible Row is selected");
			} else {
				var that = this;
				that.onCloseDialog();
			}

			this.onValueHelpAfterClose();
		},

		// Refresh values in collectible search help fragment
		handleRefreshPress: function (oEvent) {

			// this.getView().getModel("oMaraTempModel").refresh();
			sap.ui.getCore().byId("idSportsCardf").setSelectedKey("");
			sap.ui.getCore().byId("idInputManuff").setSelectedKey("");
			sap.ui.getCore().byId("idSetCodef").setSelectedKey("");
			// sap.ui.getCore().byId("idPlayerf").setSelectedKey("");

			sap.ui.getCore().byId("idInputYearf").setValue(" ");
			sap.ui.getCore().byId("idInputAttr1f").setValue(" ");
			sap.ui.getCore().byId("idInputAttr2f").setValue(" ");

			var tableModelf = new sap.ui.model.json.JSONModel();
			var oModelf = this.getOwnerComponent().getModel();

			oModelf.read("/ZmmSearchHelpSet", {
				// filters: gFilter,
				success: function (oData, oResponse) {
					tableModelf.setData(oData);
					this.getView().getModel("CollectibleModel").setData(oData.results);
					this.getView().getModel("CollectibleModel").refresh();
				}.bind(this),

				error: function () {
					// MessageToast.show("Failed");
				}
			});
		},

		// This is triggered to filter the table values based on dropdowns selected in collectible search help

		handleGoDlogPress: function (oEvent) {

			var tableModelf = new sap.ui.model.json.JSONModel();
			var oModelf = this.getOwnerComponent().getModel();

			var lfvMatnr = " ";
			var lfvSports = sap.ui.getCore().byId("idSportsCardf").getSelectedKey();
			var lfvManuf = sap.ui.getCore().byId("idInputManuff").getSelectedKey();
			var lfvSetCode = sap.ui.getCore().byId("idSetCodef").getSelectedKey();
			var lfvCardyr = sap.ui.getCore().byId("idInputYearf").getSelectedKey();
			// var lfvPlayer = sap.ui.getCore().byId("idPlayerf").getSelectedKey();

			if ((lfvMatnr == " ") && (lfvSports == " ") && (lfvManuf == " ") && (lfvSetCode == " ") && (lfvCardyr == " ")) {
				oModelf.read("/ZmmSearchHelpSet", {
					// filters: gFilter,
					success: function (oData, oResponse) {
						tableModelf.setData(oData);
						this.getView().getModel("CollectibleModel").setData(oData.results);
						this.getView().getModel("CollectibleModel").refresh();
					}.bind(this),

					error: function () {
						// MessageToast.show("Failed");
					}
				});
			} else {

				var gFilter = [
					new sap.ui.model.Filter("Matnr", sap.ui.model.FilterOperator.EQ, lfvMatnr),
					new sap.ui.model.Filter("ZSportscodeText", sap.ui.model.FilterOperator.EQ, lfvSports),
					new sap.ui.model.Filter("ZMakercodeText", sap.ui.model.FilterOperator.EQ, lfvManuf),
					new sap.ui.model.Filter("ZCardsetText", sap.ui.model.FilterOperator.EQ, lfvSetCode),
					new sap.ui.model.Filter("ZCardYear", sap.ui.model.FilterOperator.EQ, lfvCardyr)
				];

				oModelf.read("/ZmmSearchHelpSet", {
					filters: gFilter,
					success: function (oData, oResponse) {
						tableModelf.setData(oData);
						this.getView().getModel("CollectibleModel").setData(oData.results);
						this.getView().getModel("CollectibleModel").refresh();
					}.bind(this),

					error: function () {
						// MessageToast.show("Failed");
					}
				});
			}

			this.onValueHelpAfterClose();
		},

		// On Fragment Close
		onCloseDialog: function (oEvent) {

			sap.ui.getCore().byId("idSportsCardf").setSelectedKey(" ");
			sap.ui.getCore().byId("idInputManuff").setSelectedKey(" ");
			sap.ui.getCore().byId("idSetCodef").setSelectedKey(" ");
			sap.ui.getCore().byId("idInputYearf").getValue(" ");
			// sap.ui.getCore().byId("idPlayerf").setSelectedKey(" ");

			sap.ui.getCore().byId("colDialog").destroy();

		},

		// This sets the grading app characteristic values with the collectible ID picked in search help

		action: function (oEvent) {
			// var rowobject = oEvent.getSource().getSelectedItem().getBindingContext().getObject();
			sap.ui.core.BusyIndicator.show();

			var sPath = oEvent.getParameters().rowContext.getPath();
			var selectedData = oEvent.getParameters().rowContext.getModel("CollectibleModel").getProperty(sPath);
			var selectedCUId = selectedData.Matnr;
			var selectedSetCode = selectedData.ZCsgSetCode;

			// var tb = this.getView().byId("idGradeTablef");
			// var rowid = tb.getSelectedIndices();
			// var kosten = tb.getRows()[0].getCells()[0].getText();

			// var oList = oEvent.getSource();
			// var aSelIndices = oList.getSelectedItems();
			// if (aSelIndices.length > 0) {
			// 	var aItems = oList.getSelectedItems();
			// 	var oItem = aItems[0];
			// 	var sMatnr = oItem.getBindingContext().getObject().Matnr;
			// }
			this.LineId = this.getView().byId("idGradLine").getText();
			this.CollectId = selectedCUId;

			var tableModelp = new sap.ui.model.json.JSONModel();
			var oModelp = this.getOwnerComponent().getModel();

			var pfilter = [
				new sap.ui.model.Filter("LvVbeln", sap.ui.model.FilterOperator.EQ, this.SalesId),
				new sap.ui.model.Filter("LvPosnr", sap.ui.model.FilterOperator.EQ, this.LineId),
				new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, "C"),
				new sap.ui.model.Filter("ImCollectid", sap.ui.model.FilterOperator.EQ, this.CollectId)
			];

			var lbumpval = this.getView().byId("idBump").getSelectedKey();

			oModelp.read("/Grade_MARADATASet", {
				filters: pfilter,
				success: function (oData, oResponse) {
					tableModelp.setData(oData);
					if (oData.results.length !== 0) {
						this.Collid = oData.results[0].CollectibleId;
					}
					oData.results[0].Bump = lbumpval;
					if (oData.results.length !== 0) {
						if (oData.results[0].ZThickHolderFlag === "X") {
							this.getView().byId("idTH").setSelected(true);
						} else {
							this.getView().byId("idTH").setSelected(false);
						}
						if (oData.results[0].FactoryAutograph === "X") {
							this.getView().byId("idInputAuto").setSelected(true);
						} else {
							this.getView().byId("idInputAuto").setSelected(false);
						}
					}
					this.getView().getModel("MaraDataModel").setData(oData.results[0]);
					this.getView().getModel("MaraDataModel").refresh();
					sap.ui.core.BusyIndicator.hide();
				}.bind(this),

				error: function () {
					sap.ui.core.BusyIndicator.hide();
					// MessageToast.show("Failed");
				}
			});

			var SubsetModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(SubsetModel, "SubsetModel");
			SubsetModel.setSizeLimit(3000);

			var sfilter = [
				new sap.ui.model.Filter("CsgCardSetCode", sap.ui.model.FilterOperator.EQ, selectedSetCode)
			];
			oModelp.read("/ZmmSubsetsrchSet", {
				filters: sfilter,
				success: function (oData, oResponse) {
					tableModelp.setData(oData);
					oData.results.unshift(" ");
					this.getView().getModel("SubsetModel").setData(oData.results);
					this.getView().getModel("SubsetModel").refresh();
				}.bind(this),

				error: function () {
					// MessageToast.show("Failed");
				}
			});

		},

		// On CLick of PDF Print Preview

		onPrintBox: function (oEvent) {

			this.LineId = this.getView().byId("idGradLine").getText();
			// this.SalesId

			// window.open("file://192.168.142.171/FormPreview/Output/1401000538001.pdf", "_blank");

			// window.open(
			// 	"https://ccg-image-preview.s3.us-east-1.amazonaws.com/previews/1401000459001_preview.pdf");

			//
			// var opdfViewer = new PDFViewer();
			// this.getView().addDependent(opdfViewer);
			//
			var sServiceURL = this.getView().getModel().sServiceUrl;
			var sSource = sServiceURL + "/FILE_PDFDISPLAYSet(Vbeln='" + this.SalesId + "',Posnr='" + this.LineId + "',Box='YES')/$value";
			// var sSource = sServiceURL + "/FILE_PDFDISPLAYSet(Vbeln='1401000374',Posnr='001')/$value";
			window.open(sSource);
			// var sSource = "192.168.142.171/FormPreview/Output/1401000538001.pdf";
			//
			// opdfViewer.setSource(sSource);
			// opdfViewer.setTitle("PDF Box Label");
			// opdfViewer.open();
			//
		},

		// on selecting Sports code, makers code and Set code, bring the collectible ID of these combination and the rest of the characteristic values on screen

		onCollectEnter: function (oEvent) {
			this.CollectId = this.getView().byId("idInputCollId").getText();

			var tableModelp = new sap.ui.model.json.JSONModel();
			var oModelp = this.getOwnerComponent().getModel();
			var pfilter = [
				new sap.ui.model.Filter("LvVbeln", sap.ui.model.FilterOperator.EQ, this.SalesId),
				new sap.ui.model.Filter("LvPosnr", sap.ui.model.FilterOperator.EQ, this.LineId),
				new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, "C"),
				new sap.ui.model.Filter("ImCollectid", sap.ui.model.FilterOperator.EQ, this.CollectId)
			];

			var lbumpval = this.getView().byId("idBump").getSelectedKey();

			oModelp.read("/Grade_MARADATASet", {
				filters: pfilter,
				success: function (oData, oResponse) {
					tableModelp.setData(oData);
					if (oData.results.length !== 0) {
						this.Collid = oData.results[0].CollectibleId;
					}
					oData.results[0].Bump = lbumpval;
					if (oData.results.length !== 0) {
						if (oData.results[0].ZThickHolderFlag === "X") {
							this.getView().byId("idTH").setSelected(true);
						} else {
							this.getView().byId("idTH").setSelected(false);
						}
						if (oData.results[0].FactoryAutograph === "X") {
							this.getView().byId("idInputAuto").setSelected(true);
						} else {
							this.getView().byId("idInputAuto").setSelected(false);
						}
					}
					this.getView().getModel("MaraDataModel").setData(oData.results[0]);
					this.getView().getModel("MaraDataModel").refresh();
				}.bind(this),

				error: function () {
					// MessageToast.show("Failed");
				}
			});
		},
		handleActionPress: function (oEvent) {
			// var oRow = oEvent.getParameter("row");
			// var oItem = oEvent.getParameter("item");

		},

		// After Sports code is selected, fill Makercode dropdown with reducdant data matching with sports code

		// OnSportsFilter: function (oEvent) {
		// 	var lvSports = this.getView().byId("idSportsCard").getValue();
		// 	if (lvSports === "") {
		// 		MessageBox.error("Sports Code is Blank");
		// 		this.getView().byId("idSportsCard").setSelectedKey(lvSports);
		// 	}
		// 	if (lvSports !== "") {

		// 		var MakerModel = new sap.ui.model.json.JSONModel();
		// 		this.getView().setModel(MakerModel, "MakerModel");
		// 		var tableModelm = new sap.ui.model.json.JSONModel();
		// 		var oModelm = this.getOwnerComponent().getModel();
		// 		var filter = [
		// 			new sap.ui.model.Filter("LvVbeln", sap.ui.model.FilterOperator.EQ, this.oSalesID),
		// 			new sap.ui.model.Filter("LvPosnr", sap.ui.model.FilterOperator.EQ, this.oLineId),
		// 			new sap.ui.model.Filter("ImSportscode", sap.ui.model.FilterOperator.EQ, lvSports)
		// 		];

		// 		oModelm.read("/Grade_MakerSet", {
		// 			filters: filter,
		// 			success: function (oData, oResponse) {
		// 				tableModelm.setData(oData);
		// 				oData.results.unshift(" ");
		// 				this.getView().getModel("MakerModel").setData(oData.results);
		// 				this.getView().getModel("MakerModel").refresh();
		// 			}.bind(this),
		// 			error: function () {
		// 				// MessageToast.show("Failed");
		// 			}
		// 		});

		// 	}
		// },

		// // After Makers code is selected, fill Setcode dropdown with reducdant data matching with Makers code

		// OnMakeFilter: function (oEvent) {
		// 	var lvSports = this.getView().byId("idSportsCard").getSelectedKey();
		// 	var lvManuf = this.getView().byId("idInputManuf").getSelectedKey();
		// 	if (lvSports === "") {
		// 		MessageBox.error("Sports Code is Missing");
		// 		this.getView().byId("idInputManuf").setSelectedKey(lvManuf);
		// 	}
		// 	if (lvSports !== "") {

		// 		var SetCodeModel = new sap.ui.model.json.JSONModel();
		// 		this.getView().setModel(SetCodeModel, "SetCodeModel");
		// 		var tableModels = new sap.ui.model.json.JSONModel();
		// 		var oModels = this.getOwnerComponent().getModel();
		// 		var filter = [
		// 			new sap.ui.model.Filter("LvVbeln", sap.ui.model.FilterOperator.EQ, this.oSalesID),
		// 			new sap.ui.model.Filter("LvPosnr", sap.ui.model.FilterOperator.EQ, this.oLineId),
		// 			new sap.ui.model.Filter("ImSportscode", sap.ui.model.FilterOperator.EQ, lvSports),
		// 			new sap.ui.model.Filter("ImMakercode", sap.ui.model.FilterOperator.EQ, lvManuf)
		// 		];

		// 		oModels.read("/Grade_setcodeSet", {
		// 			filters: filter,
		// 			success: function (oData, oResponse) {
		// 				tableModels.setData(oData);
		// 				oData.results.unshift(" ");
		// 				this.getView().getModel("SetCodeModel").setData(oData.results);
		// 				this.getView().getModel("SetCodeModel").refresh();
		// 			}.bind(this),

		// 			error: function () {
		// 				// MessageToast.show("Failed");
		// 			}
		// 		});

		// 	}
		// },

		// // After Setcode is selected, 2 functionality happens
		// // 1-->  fill Subsetcode dropdown with reducdant data matching with Setcode
		// // 2-->  Reload app values with the collectible ID being derived based on sports code, maker code & set code selection

		// OnSetFilter: function (oEvent) {
		// 	var lvSports = this.getView().byId("idSportsCard").getSelectedKey();
		// 	var lvManuf = this.getView().byId("idInputManuf").getSelectedKey();
		// 	var lvSetCode = this.getView().byId("idSetCode").getSelectedKey();

		// 	if (lvSports === "") {
		// 		MessageBox.error("Sports Code is Missing");
		// 		this.getView().byId("idSetCode").setSelectedKey(lvSetCode);
		// 	}
		// 	if (lvManuf === "") {
		// 		MessageBox.error("Maker Code is Missing");
		// 		this.getView().byId("idSetCode").setSelectedKey(lvSetCode);
		// 	}
		// 	if (lvSetCode === "") {
		// 		MessageBox.error("Select Set Code to fetch Collectible ID");
		// 	}
		// 	if ((lvSports !== "") && (lvManuf !== "") && (lvSetCode !== "")) {

		// 		var tableModelp = new sap.ui.model.json.JSONModel();
		// 		var oModelp = this.getOwnerComponent().getModel();

		// 		var SubsetModel = new sap.ui.model.json.JSONModel();
		// 		this.getView().setModel(SubsetModel, "SubsetModel");
		// 		SubsetModel.setSizeLimit(3000);

		// 		var sfilter = [
		// 			new sap.ui.model.Filter("CsgCardSetSupersetCode", sap.ui.model.FilterOperator.EQ, lvSetCode)
		// 		];
		// 		oModelp.read("/ZmmSubsetsrchSet", {
		// 			filters: sfilter,
		// 			success: function (oData, oResponse) {
		// 				tableModelp.setData(oData);
		// 				oData.results.unshift(" ");
		// 				this.getView().getModel("SubsetModel").setData(oData.results);
		// 				this.getView().getModel("SubsetModel").refresh();
		// 			}.bind(this),

		// 			error: function () {
		// 				// MessageToast.show("Failed");
		// 			}
		// 		});

		// 		var pfilter = [
		// 			new sap.ui.model.Filter("LvVbeln", sap.ui.model.FilterOperator.EQ, this.SalesId),
		// 			new sap.ui.model.Filter("LvPosnr", sap.ui.model.FilterOperator.EQ, this.LineId),
		// 			new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, "S"),
		// 			new sap.ui.model.Filter("ImSportsCode", sap.ui.model.FilterOperator.EQ, lvSports),
		// 			new sap.ui.model.Filter("ImMakerCode", sap.ui.model.FilterOperator.EQ, lvManuf),
		// 			new sap.ui.model.Filter("ImCsgSetCode", sap.ui.model.FilterOperator.EQ, lvSetCode)
		// 		];

		// 		oModelp.read("/Grade_MARADATASet", {
		// 			filters: pfilter,
		// 			success: function (oData, oResponse) {
		// 				tableModelp.setData(oData);
		// 				this.getView().getModel("MaraDataModel").setData(oData.results[0]);
		// 				this.getView().getModel("MaraDataModel").refresh();
		// 			}.bind(this),

		// 			error: function () {
		// 				// MessageToast.show("Failed");
		// 			}
		// 		});
		// 	}
		// },

		// On Click of Refresh, revert the sportscode, maker code & set code dropdown selection and also the characteristic Values

		// OnRefreshSet: function (oEvent) {

		// 	this.getView().byId("idSportsCard").setValue();
		// 	this.getView().byId("idInputManuf").setValue();
		// 	this.getView().byId("idSetCode").setValue();

		// 	var SetCodeModel = new sap.ui.model.json.JSONModel();
		// 	this.getView().setModel(SetCodeModel, "SetCodeModel");
		// 	var MakerModel = new sap.ui.model.json.JSONModel();
		// 	this.getView().setModel(MakerModel, "MakerModel");
		// 	var MaraDataModel = new sap.ui.model.json.JSONModel();
		// 	this.getView().setModel(MaraDataModel, "MaraDataModel");
		// 	var tableModel = new sap.ui.model.json.JSONModel();
		// 	var oModel = this.getOwnerComponent().getModel();

		// 	var filter = [
		// 		new sap.ui.model.Filter("LvVbeln", sap.ui.model.FilterOperator.EQ, this.SalesId),
		// 		new sap.ui.model.Filter("LvPosnr", sap.ui.model.FilterOperator.EQ, this.LineId)
		// 	];

		// 	oModel.read("/Grade_MakerSet", {
		// 		filters: filter,
		// 		success: function (oData, oResponse) {
		// 			tableModel.setData(oData);
		// 			oData.results.unshift(" ");
		// 			this.getView().getModel("MakerModel").setData(oData.results);
		// 			this.getView().getModel("MakerModel").refresh();
		// 		}.bind(this),
		// 		error: function () {
		// 			// MessageToast.show("Failed");
		// 		}
		// 	});

		// 	oModel.read("/Grade_setcodeSet", {
		// 		filters: filter,
		// 		success: function (oData, oResponse) {
		// 			tableModel.setData(oData);
		// 			oData.results.unshift(" ");
		// 			this.getView().getModel("SetCodeModel").setData(oData.results);
		// 			this.getView().getModel("SetCodeModel").refresh();
		// 		}.bind(this),

		// 		error: function () {
		// 			// MessageToast.show("Failed");
		// 		}
		// 	});

		// 	oModel.read("/Grade_MARADATASet", {
		// 		filters: filter,
		// 		success: function (oData, oResponse) {
		// 			tableModel.setData(oData);
		// 			// this.crossOverMsg = oData.results[0].CrossOverMsg;
		// 			if (oData.results.length !== 0) {
		// 				if (oData.results[0].ZThickHolderFlag === "X") {
		// 					this.getView().byId("idTH").setSelected(true);
		// 				} else {
		// 					this.getView().byId("idTH").setSelected(false);
		// 				}
		// 				this.VcScCrossover = " ";
		// 				this.VcScCrossover = oData.results[0].VcScCrossover;
		// 				if (oData.results[0].VcScCrossover === " ") {
		// 					this.getView().byId("idCrossOver").setVisible(false);
		// 				} else {
		// 					this.getView().byId("idCrossOver").setVisible(true);
		// 					this.getView().byId("idCrossOver").setEditable(false);
		// 				}

		// 			}
		// 			// if (this.crossOverMsg !== "") {
		// 			// 	MessageBox.information(this.crossOverMsg);
		// 			// }
		// 			this.getView().getModel("MaraDataModel").setData(oData.results[0]);
		// 			this.getView().getModel("MaraDataModel").refresh();
		// 			// if (oData.results[0] === " ") {
		// 			// 	MessageBox.information("No Characteristic Values configured for the given Sales Order");
		// 			// }
		// 		}.bind(this),
		// 		error: function () {
		// 			// MessageToast.show("Failed");
		// 		}
		// 	});
		// },

		// Validation 3 : if char  VC_SC_CROSSOVER= HIGHER GRADE, then compare the Current Grade char VC_SC_GRADE value with VC_SC_CROSSOVER_GR
		// if the value VC_SC_GRADE is lesser than VC_SC_CROSSOVER_GR Then popup an information msg	

		OnGradeSel: function (oEvent) {
			var kgrade = this.getView().byId("idGrade").getSelectedKey();
			var knograde = this.getView().byId("idNoGrade").getSelectedKey();

			if (this.VcScCrossover != "") {
				if (knograde == "") {
					if (this.VcScCrossover >= kgrade) {
						var lv_msg = "Grade should be more than Crossover ";
						var result = lv_msg.concat(this.VcScCrossover);
						MessageBox.information(result);

					}

				}
			}
		},

		// Validation 4 : Grade Complete checkbox can be checked if grading is done against all the lineitems of the given salesorder, if not throw an error.

		onGradCompleteSelect: function (oEvent) {

			var that = this;

			if (this.getView().byId("idFinish").getSelected() === false) {

				MessageBox.warning("You are Revoking the Grade Completion status, Click OK to continue", {
					actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
					emphasizedAction: MessageBox.Action.OK,
					onClose: function (sAction) {

						if (sAction === "OK") {

							var tableModelp = new sap.ui.model.json.JSONModel();
							var oModelp = that.getOwnerComponent().getModel();
							var pfilter = [
								new sap.ui.model.Filter("Vbeln", sap.ui.model.FilterOperator.EQ, that.SalesId),
								new sap.ui.model.Filter("Posnr", sap.ui.model.FilterOperator.EQ, that.LineId),
								new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, "D")
							];
							oModelp.read("/getInitialLineItemsSet", {
								filters: pfilter,
								success: function (oData, oResponse) {
									tableModelp.setData(oData);
									// this.getView().byId("idFinish").setSelected(false);
									// this.getView().byId("idFinish").setEnabled(true);
									that.getView().byId("idExit").setEnabled(true);
									that.getView().byId("idPrevious").setEnabled(true);
									that.getView().byId("idNext").setEnabled(true);
									that.getView().byId("idInputCollId").setEnabled(true);
									that.getView().byId("idGrade").setEnabled(true);
									that.getView().byId("idCenter").setEnabled(true);
									that.getView().byId("idCorner").setEnabled(true);
									that.getView().byId("idEdge").setEnabled(true);
									that.getView().byId("idSurface").setEnabled(true);
									that.getView().byId("idAutoGrade").setEnabled(true);
									that.getView().byId("idNoGrade").setEnabled(true);
									that.getView().byId("idBump").setEnabled(true);
									that.getView().byId("idPerChk").setEnabled(true);
								}.bind(this),
								error: function () {
									// MessageToast.show("Failed");
								}
							});

						}
					}
				});

			}

			if (this.getView().byId("idFinish").getSelected() === true) {
				this.LineId = this.getView().byId("idGradLine").getText();
				var kgrade = this.getView().byId("idGrade").getSelectedKey();
				var lNograde = this.getView().byId("idNoGrade").getSelectedKey();

				var tableModelp = new sap.ui.model.json.JSONModel();
				var oModelp = this.getOwnerComponent().getModel();
				var pfilter = [
					new sap.ui.model.Filter("Vbeln", sap.ui.model.FilterOperator.EQ, this.SalesId),
					new sap.ui.model.Filter("Posnr", sap.ui.model.FilterOperator.EQ, this.LineId),
					new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, "G")
				];

				oModelp.read("/getInitialLineItemsSet", {
					filters: pfilter,
					success: function (oData, oResponse) {
						tableModelp.setData(oData);
						if (oData.results.length !== 0) {
							if (((oData.results[0].Posnr !== "") && (kgrade === "")) || ((oData.results[0].Posnr !== "") && (lNograde === ""))) {
								var lv_msg = "There are ungraded items on this order against the item no ";
								var lv_line = this.LineId;
								var result = lv_msg.concat(lv_line);
								this.getView().byId("idFinish").setSelected(false);
								MessageBox.error(result);
							}
						} else {
							var tempv;
							var pfilter = [
								new sap.ui.model.Filter("Vbeln", sap.ui.model.FilterOperator.EQ, this.SalesId),
								new sap.ui.model.Filter("Posnr", sap.ui.model.FilterOperator.EQ, this.LineId)
							];
							// this.getView().byId("idFinish").setEditable(false);
							MessageBox.confirm(
								"Do you want to complete the Grading for this order?, click OK to confirm", {
									actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
									emphasizedAction: MessageBox.Action.OK,
									onClose: function (sAction) {
										if (sAction === "OK") {
											oModelp.read("/getInitialLineItemsSet", {
												filters: pfilter,
												success: function (oData, oResponse) {
													tableModelp.setData(oData);
													tempv = "X";
													// that.getView().byId("idExit").setEnabled(false);
													// that.getView().byId("idPrevious").setEnabled(false);
													// that.getView().byId("idNext").setEnabled(false);
													// that.getView().byId("idInputCollId").setEnabled(false);
													// that.getView().byId("idGrade").setEnabled(false);
													// that.getView().byId("idCenter").setEnabled(false);
													// that.getView().byId("idCorner").setEnabled(false);
													// that.getView().byId("idEdge").setEnabled(false);
													// that.getView().byId("idSurface").setEnabled(false);
													// that.getView().byId("idAutoGrade").setEnabled(false);
													// that.getView().byId("idNoGrade").setEnabled(false);
													// that.getView().byId("idBump").setEnabled(false);
													// that.getView().byId("idPerChk").setEnabled(false);
												}.bind(this),
												error: function () {
													// MessageToast.show("Failed");
												}
											});
										}
										if (sAction === "CANCEL") {
											that.getView().byId("idFinish").setSelected(false);
										}
									}
								});
						}
					}.bind(this),
					error: function () {
						// MessageToast.show("Failed");
					}
				});
			}

		},

		onGraderInfoClik: function (oEvent) {

			// var that = this;

			var GraderInfoModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(GraderInfoModel, "GraderInfoModel");
			var tableModel = new sap.ui.model.json.JSONModel();
			var oModel = this.getOwnerComponent().getModel();

			var gfilter = [
				new sap.ui.model.Filter("Vbeln", sap.ui.model.FilterOperator.EQ, this.SalesId),
				new sap.ui.model.Filter("Posnr", sap.ui.model.FilterOperator.EQ, this.LineId)
			];
			oModel.read("/getGraderInfoSet", {
				filters: gfilter,
				success: function (oData, oResponse) {
					tableModel.setData(oData);
					if (oData.results.length !== 0) {
						this.giCount = oData.results[0].ExCount;
						sap.ui.getCore().byId("idGraderInfLbl").setValue(this.giCount);
					}
					this.getView().getModel("GraderInfoModel").setData(oData.results);
					this.getView().getModel("GraderInfoModel").refresh();

				}.bind(this),
				error: function () {
					// MessageToast.show("Failed");
				}
			});

			this.gDialog = Fragment.load({
				name: "CCGSDGRADINGAPP.ZSD_GRADINGAPP.view.fragment.GraderInfo",
				controller: this
			}).then(
				function (oFrag1) {
					this.getView().addDependent(oFrag1);
					oFrag1.open();
				}.bind(this)
			);
		},

		onDispStatus: function (oEvent) {

			// var that = this;

			var userStatusModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(userStatusModel, "userStatusModel");
			var tableModel = new sap.ui.model.json.JSONModel();
			var oModel = this.getOwnerComponent().getModel();

			var ufilter = [
				new sap.ui.model.Filter("LvVbeln", sap.ui.model.FilterOperator.EQ, this.SalesId)
			];
			oModel.read("/UserStatusSet", {
				filters: ufilter,
				success: function (oData, oResponse) {
					tableModel.setData(oData);
					this.getView().getModel("userStatusModel").setData(oData.results);
					this.getView().getModel("userStatusModel").refresh();

				}.bind(this),
				error: function () {
					// MessageToast.show("Failed");
				}
			});

			this.uDialog = Fragment.load({
				name: "CCGSDGRADINGAPP.ZSD_GRADINGAPP.view.fragment.Userstatus",
				controller: this
			}).then(
				function (oFrag1) {
					this.getView().addDependent(oFrag1);
					oFrag1.open();
				}.bind(this)
			);
		},

		onMoreImages: function (oEvent) {

			var tableModel = new sap.ui.model.json.JSONModel();
			var oModel = this.getOwnerComponent().getModel();

			var imgfilter = [
				new sap.ui.model.Filter("CertType", sap.ui.model.FilterOperator.EQ, "I"),
				new sap.ui.model.Filter("CertId", sap.ui.model.FilterOperator.EQ, this.Collid)
			];

			oModel.read("/Image_displaySet", {
				filters: imgfilter,
				success: function (oData, oResponse) {
					tableModel.setData(oData);
					if (oData.results.length !== 0) {
						this.s3Url = oData.results[0].FrontUrl;
						window.open(this.s3Url);
					}
					// this.getView().getModel("ImageModel").setData(oData.results);
					// this.getView().getModel("ImageModel").refresh();
				}.bind(this),
				error: function () {

				}

			});

			// window.open(
			// 	"https://images.ngccoin.com/coins/411800;coinId?resolution=HIGH%20RES&apiKey=ebfa9681-20ee-4c5a-8b08-fc069a28f830&source=undefined"
			// );
		},

		OnGraderClose: function (oEvent) {

			sap.ui.getCore().byId("GradDialog").destroy();

		},

		OnUserClose: function (oEvent) {

			sap.ui.getCore().byId("UserDialog").destroy();

		},

		onNoGradeChange: function (oEvent) {

			var lNoGrade = this.getView().byId("idNoGrade").getSelectedKey();

			if (lNoGrade !== "") {
				this.getView().byId("idCenter").setValue();
				this.getView().byId("idCorner").setValue();
				this.getView().byId("idEdge").setValue();
				this.getView().byId("idSurface").setValue();
				this.getView().byId("idGrade").setValue();
				this.getView().byId("idAutoGrade").setValue();
				this.getView().byId("idPerChk").setSelected(false);
				this.getView().byId("idGrade").setEnabled(false);
				this.getView().byId("idCenter").setEnabled(false);
				this.getView().byId("idCorner").setEnabled(false);
				this.getView().byId("idEdge").setEnabled(false);
				this.getView().byId("idSurface").setEnabled(false);
				this.getView().byId("idAutoGrade").setEnabled(false);
				this.getView().byId("idPerChk").setEnabled(false);
			}
			if (lNoGrade === "") {
				this.getView().byId("idGrade").setEnabled(true);
				this.getView().byId("idCenter").setEnabled(true);
				this.getView().byId("idCorner").setEnabled(true);
				this.getView().byId("idEdge").setEnabled(true);
				this.getView().byId("idSurface").setEnabled(true);
				this.getView().byId("idAutoGrade").setEnabled(true);
				this.getView().byId("idPerChk").setEnabled(true);
			}
		}

	});

});