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
    "sap/m/library",
    "sap/ui/core/BusyIndicator",
    "sap/ui/core/routing/History",
    "ccgtradingcards/utils/formatter",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter, FilterOperator, MessageToast, MessageBox, Fragment, PDFViewer, Dialog, Button, library, BusyIndicator, History,formatter) {
        "use strict";

        return Controller.extend("ccgtradingcards.controller.CardView", {
            formatter: formatter,
            onInit: function () {

                this.oModel = this.getOwnerComponent().getModel("SC");
                this.oModel_SC = this.getOwnerComponent().getModel("SC");
                this.oModel_SC.attachRequestSent(this.onRequestSent, this);
                this.oModel_SC.attachRequestCompleted(this.onRequestCompleted, this);



                this.getView().byId("idMsdGradTab").setText("Missed Grading");

                // this.getView().byId("idSportsCard").setValue(" ");
                // this.getView().byId("idInputManuf").setValue(" ");
                // this.getView().byId("idSetCode").setValue(" ");
                // this.getView().byId("idPlayer").setValue(" ");
                // this.getView().byId("idSubset").setValue(" ");
                // this.getView().byId("idInputCardNo").setValue(" ");
                // this.getView().byId("idInputNota").setValue(" ");
                // this.getView().byId("idInputPedig").setValue(" ");
                // this.getView().byId("idInputCollId").setValue(" ");
                // // this.getView().byId("idInputAuto").setValue(" ");
                // this.getView().byId("idBump").setSelectedKey("");
                // this.getView().byId("idInputYear").setValue(" ");
                // this.getView().byId("idInputAttr1").setValue(" ");
                // this.getView().byId("idInputAttr2").setValue(" ");
                //this.getView().byId("idPerChk").setSelected(false);
                this.getView().byId("idFinish").setSelected(false);


                var GradeSetModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(GradeSetModel, "GradeSetModel");
                var NoGradeModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(NoGradeModel, "NoGradeModel");
                var AutoGradeModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(AutoGradeModel, "AutoGradeModel");
                var CenterModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(CenterModel, "CenterModel");
                var CornerModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(CornerModel, "CornerModel");
                var EdgeModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(EdgeModel, "EdgeModel");
                var SurfaceModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SurfaceModel, "SurfaceModel");
                var InitModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(InitModel, "InitModel");
                var ErrorModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(ErrorModel, "ErrorModel");
                var DefectModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(DefectModel, "DefectModel");
                var pInitModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(pInitModel, "pInitModel");

                var tableModel = new sap.ui.model.json.JSONModel();
                var oModel = this.getOwnerComponent().getModel("SC");


                this.oModel_SC.read("/Grade_gradeSet", {
                    success: function (oData, oResponse) {
                        this.setDropdownValues(oData.results,"A");

                    }.bind(this),

                    error: function () {
                        MessageToast.show("Sub-Grades failed to Load, Please Contact Technical Team");
                    }
                });


               

                /* // Dropdowns

                var filter = [
                    new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, 'G')
                ];
                oModel.read("/Grade_gradeSet", {
                    filters: filter,
                    success: function (oData, oResponse) {
                        tableModel.setData(oData);
                        oData.results.unshift(" ");
                        this.getView().getModel("GradeSetModel").setData(oData.results);
                        this.getView().getModel("GradeSetModel").refresh();

                    }.bind(this),

                    error: function () {
                        MessageToast.show("Sub-Grades failed to Load, Please Contact Technical Team");
                    }
                });

                var filtern = [
                    new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, 'N')
                ];
                oModel.read("/Grade_gradeSet", {
                    filters: filtern,
                    success: function (oData, oResponse) {
                        tableModel.setData(oData);
                        oData.results.unshift(" ");
                        this.getView().getModel("NoGradeModel").setData(oData.results);
                        this.getView().getModel("NoGradeModel").refresh();

                    }.bind(this),

                    error: function () {
                        MessageToast.show("Sub-Grades failed to Load, Please Contact Technical Team");
                    }
                });

                var filtera = [
                    new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, 'A')
                ];
                oModel.read("/Grade_gradeSet", {
                    filters: filtera,
                    success: function (oData, oResponse) {
                        tableModel.setData(oData);
                        oData.results.unshift(" ");
                        this.getView().getModel("AutoGradeModel").setData(oData.results);
                        this.getView().getModel("AutoGradeModel").refresh();

                    }.bind(this),

                    error: function () {
                        MessageToast.show("Sub-Grades failed to Load, Please Contact Technical Team");
                    }
                });

                this.ErrorDropdown();

                var filtera = [
                    new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, 'D')
                ];
                oModel.read("/Grade_gradeSet", {
                    filters: filtera,
                    success: function (oData, oResponse) {
                        tableModel.setData(oData);
                        oData.results.unshift(" ");
                        this.getView().getModel("DefectModel").setData(oData.results);
                        this.getView().getModel("DefectModel").refresh();

                    }.bind(this),

                    error: function () {
                        // MessageToast.show("Sub-Grades failed to Load, Please Contact Technical Team");
                    }
                });

                var filterc = [
                    new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, 'C')
                ];
                oModel.read("/Grade_gradeSet", {
                    filters: filterc,
                    success: function (oData, oResponse) {
                        tableModel.setData(oData);
                        oData.results.unshift(" ");
                        this.getView().getModel("CenterModel").setData(oData.results);
                        this.getView().getModel("CenterModel").refresh();
                        this.getView().getModel("CornerModel").setData(oData.results);
                        this.getView().getModel("CornerModel").refresh();
                        this.getView().getModel("EdgeModel").setData(oData.results);
                        this.getView().getModel("EdgeModel").refresh();
                        this.getView().getModel("SurfaceModel").setData(oData.results);
                        this.getView().getModel("SurfaceModel").refresh();

                    }.bind(this),

                    error: function () {
                        MessageToast.show("Failed to Load Sub-Grades, Please Contact Technical Team");
                    }
                });
 */
                // Reading Data through odata Services

                var filter = [
                    new sap.ui.model.Filter("Vbeln", sap.ui.model.FilterOperator.EQ, this.oSalesID),
                    new sap.ui.model.Filter("Posnr", sap.ui.model.FilterOperator.EQ, this.oLineId)
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

                // Sports card onInit logic....start 

                //Model to hold values in collectible Fragment which is the search help used for Collectible ID Search
                var SC_oMaraTempModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_oMaraTempModel, "SC_oMaraTempModel");

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

                this.getView().getModel("SC_oMaraTempModel").setData(maraObjectArr);
                this.getView().getModel("SC_oMaraTempModel").refresh();

            },
            onRequestSent : function(){
                sap.ui.core.BusyIndicator.show();
            },
            onRequestCompleted : function(){
                if(!this.oModel_SC.hasPendingChanges()){
                    sap.ui.core.BusyIndicator.hide();
                }

            },

            setDropdownValues : function(odata, flag){

                var GradeSetModel = [];
                var NoGradeModel = [];
                var AutoGradeModel = [];
                var DefectModel = [];
                var CCES = [];
                var ErrorModel = [];

                odata.forEach(function(value){

                    if(value.ImFlag == "G"){

                        GradeSetModel.push(value);

                    }else if(value.ImFlag == "N"){

                        NoGradeModel.push(value);

                    }else if(value.ImFlag == "A"){

                        AutoGradeModel.push(value);

                    }else if(value.ImFlag == "C"){

                        CCES.push(value);

                    }else if(value.ImFlag == "E"){
                        
                        ErrorModel.push(value);

                    }else if(value.ImFlag == "D"){

                        DefectModel.push(value);

                    }else if(value.ImFlag == "S"){

                    }



                });

                if(flag == "E"){

                this.getView().getModel("ErrorModel").setData(ErrorModel);
                this.getView().getModel("ErrorModel").refresh();

                }else{

                //GradeSetModel.sort(function(a, b){return b.CharValue-a.CharValue});
               // AutoGradeModel.sort(function(a, b){return b.CharValue-a.CharValue});

                this.getView().getModel("GradeSetModel").setData(GradeSetModel);
                this.getView().getModel("GradeSetModel").refresh();

                this.getView().getModel("NoGradeModel").setData(NoGradeModel);
                this.getView().getModel("NoGradeModel").refresh();

                this.getView().getModel("AutoGradeModel").setData(AutoGradeModel);
                this.getView().getModel("AutoGradeModel").refresh();

                this.getView().getModel("DefectModel").setData(DefectModel);
                this.getView().getModel("DefectModel").refresh();

                this.getView().getModel("ErrorModel").setData(ErrorModel);
                this.getView().getModel("ErrorModel").refresh();

                this.getView().getModel("CenterModel").setData(CCES);
                this.getView().getModel("CenterModel").refresh();

                this.getView().getModel("CornerModel").setData(CCES);
                this.getView().getModel("CornerModel").refresh();

                this.getView().getModel("EdgeModel").setData(CCES);
                this.getView().getModel("EdgeModel").refresh();

                this.getView().getModel("SurfaceModel").setData(CCES);
                this.getView().getModel("SurfaceModel").refresh();

                }

            },
             ErrorDropdown : function(tradingOdata){
                
                this.oModel.read("/Grade_gradeSet", {
                    
                    success: function (oData, oResponse) {

                        
                        //this.errorDropdownFlt(oData.results);
                        this.setDropdownValues(oData.results, "E");
                        if(tradingOdata){
                        this.getView().getModel("MainModel").setData(tradingOdata.results[0]);
                        this.getView().getModel("MainModel").refresh();
                        }

                    }.bind(this),

                    error: function () {
                        // MessageToast.show("Sub-Grades failed to Load, Please Contact Technical Team");
                    }
                });
            }, 
            errorDropdownFlt : function(oData){

                var ErrorModel = [];
                oData.forEach(function(value){

                    if(value.ImFlag == "G"){
                        ErrorModel.push(value)
                    }
                    });
                    this.getView().getModel("ErrorModel").setData(ErrorModel);
                    this.getView().getModel("ErrorModel").refresh();

            },

            //Refresh the intial screen and load sales order data again

            onRefreshSo: function (oEvent) {

                this.getView().byId("idSalesOrder").setSelectedKey("");
                this.getView().byId("idLineItem").setSelectedKey("");

                // Fetching data for the landing page initial dropdown (for Sales Order & Lineitem)
                var initMaraData = new sap.ui.model.json.JSONModel();
                this.getView().setModel(initMaraData, "initMaraData");
                var tableModel = new sap.ui.model.json.JSONModel();
                var oModel = this.getOwnerComponent().getModel("SC");

                var ifilter = [
                    new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, "I")
                ];
                oModel.read("/getInitialLineItemsSet", {
                    filters: ifilter,
                    success: function (oData, oResponse) {
                        tableModel.setData(oData);
                        // oData.results.unshift(" ");
                        oData.results.sort(function(a, b){return a.Posnr-b.Posnr});
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

                //this.showBusyIndicator(10000, 0);

                var lSalesOrder = this.getView().byId("idSalesOrder").getValue();
                // var lLineItem   = this.getView().byId("idLineItem").getValue();

                var tableModel = new sap.ui.model.json.JSONModel();
                var oModel = this.getOwnerComponent().getModel("SC");

                // OData Call to get line item numbers against the sales order Num 

                var InitModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(InitModel, "InitModel");
                var tableModelg = new sap.ui.model.json.JSONModel();

                var oModelg = this.getOwnerComponent().getModel("SC");
                //oModelg.setSizeLimit(600);
                var filterg = [
                    new sap.ui.model.Filter("Vbeln", sap.ui.model.FilterOperator.EQ, lSalesOrder),
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
                        this.getView().getModel("pInitModel").setData(oData.results);
                        this.getView().getModel("pInitModel").refresh();

                        var olineItem = new sap.ui.model.json.JSONModel(oData.results);
                        this.getView().setModel(olineItem, "olineItem");
                        //this.hideBusyIndicator();
                    }.bind(this),
                    error: function () {
                        // MessageToast.show("Failed");
                       // this.hideBusyIndicator();
                    }
                });
            },
            onFetchDetailsValidate: function (LineItemID) {



                var that = this;
                this.getView().byId("idLineItem").setValue(LineItemID);
                this.getView().byId("idLineItem").setSelectedKey(LineItemID); 
                this.SalesId = this.getView().byId("idSalesOrder").getValue();
                var oModel = this.getOwnerComponent().getModel("SC");

                var filterViewType = [
                    new sap.ui.model.Filter("Vbeln", sap.ui.model.FilterOperator.EQ, this.SalesId),
                    new sap.ui.model.Filter("Posnr", sap.ui.model.FilterOperator.EQ, LineItemID),
                    new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, "F")
                ];

                this.oModel_SC.read("/getInitialLineItemsSet", {
                    filters: filterViewType,
                    success: function (oData, oResponse) {

                        that.onFetchDetailsTSViewDetails(oData.results[0].Status, LineItemID);

                    }
                });



            },
            OnGradeSel: function (oEvent) {
                var that = this;
                var TCGrade = this.getView().byId("idGrade").getValue();
                if(!isNaN(parseFloat(TCGrade)) && isFinite(TCGrade)){

                this.kgrade = oEvent.getParameters().selectedItem.getText();
                var addText = oEvent.getParameter("selectedItem").getAdditionalText();
                this.getView().getModel("MainModel").getData().gradedec = addText;
                this.getView().getModel("MainModel").getData().Grade = this.kgrade
                

                this.getView().getModel("MainModel").refresh();

                if (this.kgrade == "10" && (addText == "PRISTINE" || addText == "Pristine")) {
                    this.GradeChek = "PRISTINE";
                } else if (this.kgrade == "10" && (addText == "PERFECT" || addText == "Perfect")) {
                    this.GradeChek = "PERFECT";
                }
                else if (this.kgrade == "10") {
                    this.GradeChek = "GEM MINT";
                }
                    

                }

            },
            OnGradeSel_TC : function(){
                var that = this;
                var TCGrade = this.getView().byId("idGrade").getValue();
                var oGrades = this.getView().getModel("GradeSetModel").getData();
                if(!isNaN(parseFloat(TCGrade)) && isFinite(TCGrade)){
                    oGrades.every(value => {
                        if(value.CharValue == TCGrade){
                            
                            that.GradeValidationTC = " "
                            return false;
                        }else{
                            that.GradeValidationTC = "X"
                            return true;
                        }

                    });
                    if(that.GradeValidationTC == "X"){
                        MessageBox.error("Please select the valid Grade");
                            that.getView().byId("idGrade").setSelectedKey("");
                            that.getView().byId("idGrade").setValue("");
                            that.getView().getModel("MainModel").getData().gradedec = "";
                            that.getView().getModel("MainModel").getData().Grade = "";
                            that.getView().getModel("MainModel").refresh();
                    }
                }else{
                        MessageBox.error("Characters are not allowed in Grade. please select from dropdown",{
                            onClose: function (oAction) {
                                that.getView().byId("idGrade").setSelectedKey("");
                                that.getView().byId("idGrade").setValue("");
                                that.getView().getModel("MainModel").getData().gradedec = "";
                                that.getView().getModel("MainModel").getData().Grade = "";
                                that.getView().getModel("MainModel").refresh();
    
                            }
                        });
                    }


            },
            setScreen(ViewType) {

                if (ViewType === "T") {

                    this.getView().byId("tradingCardIdPanel").setVisible(true);
                    this.getView().byId("SportsCardIdPanel").setVisible(false);
                    this.getView().byId("TC_HdrTbr").setVisible(true);
                    this.getView().byId("SC_HdrTbr").setVisible(false);
                    this.getView().byId("TC_HozLayout1").setVisible(true);
                    this.getView().byId("TC_HozLayout2").setVisible(true);
                    this.getView().byId("SC_HozLayout1").setVisible(false);
                    this.getView().byId("SC_HozLayout2").setVisible(false);
                    this.getView().byId("TC_Toolbar1").setVisible(true);
                    this.getView().byId("SC_Toolbar1").setVisible(false);

                } else if (ViewType === "S") {

                    this.getView().byId("SportsCardIdPanel").setVisible(true);
                    this.getView().byId("tradingCardIdPanel").setVisible(false);
                    this.getView().byId("TC_HdrTbr").setVisible(false);
                    this.getView().byId("SC_HdrTbr").setVisible(true);
                    this.getView().byId("TC_HozLayout1").setVisible(false);
                    this.getView().byId("TC_HozLayout2").setVisible(false);
                    this.getView().byId("SC_HozLayout1").setVisible(true);
                    this.getView().byId("SC_HozLayout2").setVisible(true);
                    this.getView().byId("TC_Toolbar1").setVisible(false);
                    this.getView().byId("SC_Toolbar1").setVisible(true);

                }

            },

            onFetchDetailsTSViewDetails: function (ViewType, LineItemID) {

                //this.getBumpData(LineItemID);

                this.ViewType = ViewType;
                if (ViewType === "T") {
                    this.setScreen(ViewType);
                    //this.SC_Models();
                    //this.TC_models();
                    if (this.DisplayScreenFlag === "X") {
                        this.TC_MainScreenData();
                        
                        this.SC_MainScreenData();

                    } else {
                        if (this.ButtonType == "N") {

                            this.onGetGradeHistcall();
                            this.onMissedCall();

                        } else if (this.ButtonType == "P") {

                            this.onGetGradeHistcallp();
                            this.onMissedCall();

                        }
                        this.SetTCHeaderData(LineItemID);
                    }
                }
                else if (ViewType === "S") {

                    this.setScreen(ViewType);
                    //this.SC_Models();
                    //this.TC_models();
                    if (this.DisplayScreenFlag === "X") {

                        this.SC_MainScreenData();
                        
                        this.TC_MainScreenData();

                    } else {
                        if (this.ButtonType == "P") {

                            this.onGetMaraDatacallp();
                            this.SC_onMissedCall();

                        } else if (this.ButtonType == "N") {

                            this.onGetMaraDatacall();
                            this.SC_onMissedCall();

                        }
                        
                    }

                } else {
                    MessageToast.show("Please select valid sales order number");
                }

                this.getLabelLine(this.SalesId, LineItemID, ViewType);


            },
            setAutoGraphValidation(autoGradeFlag){
                this.autoGradeFlag = autoGradeFlag;
                if(autoGradeFlag=='X')
                this.getView().byId("idAutoGrade").setEnabled(true);
                else
                this.getView().byId("idAutoGrade").setEnabled(false);

            },
            
            SetTCHeaderData: function (LineItemID) {
                var that = this;
                var filtert = [
                    new sap.ui.model.Filter("Vbeln", sap.ui.model.FilterOperator.EQ, this.SalesId),
                    new sap.ui.model.Filter("Posnr", sap.ui.model.FilterOperator.EQ, LineItemID)
                ];
                this.oModel.read("/TradingCardSet", {
                    filters: filtert,
                    success: function (oData, oResponse) {
                        if(oData.results.length !== 0){
                        that.ErrorDropdown(oData);
                        that.setAutoGraphValidation(oData.results[0].RemarksFlag);
                        that.getImage(oData.results[0].Certificateno);
                        
                        
                        
                        that.GradeChek = oData.results[0].gradedec;
                        that.setCarError(oData.results[0]);
                        
                        }
                    }
                });



            },
            setCarError: function (odata) {

                if (odata) {

                    if (odata.CardErrorFlag == 'X') {
                        this.getView().byId("CardErrorFlag").setSelectedIndex(0);
                    } else {
                        this.getView().byId("CardErrorFlag").setSelectedIndex(1);
                        this.getView().byId("idError1").setEnabled(false);
                        this.getView().byId("errorLblTxt").setEnabled(false);

                    }
                }

            },

            getImage : function(Certificateno){

                // OData Call to get Image URL
                
                var SaleItem;
                this.oLineID = this.getView().byId("idLineItem").getValue();

                // OData Call to get Image URL
                

                if(this.LineId.length == "1"){
                   SaleItem  = this.oSalesID + "00" + this.oLineID;
               }else if(this.LineId.length == "2"){
                   SaleItem  = this.oSalesID + "0" + this.oLineID;
               }else{
                   SaleItem  = this.oSalesID + this.oLineID;
               }
                var imgfilter = [
                    new sap.ui.model.Filter("CertType", sap.ui.model.FilterOperator.EQ, "CARDS"),
                    new sap.ui.model.Filter("CertId", sap.ui.model.FilterOperator.EQ, SaleItem),
                    
                ];

                var that = this;
                this.oModel_SC.read("/Image_displaySet", {
                    filters: imgfilter,
                    success: function (oData, oResponse) {
                    
                        if (oData.results.length !== 0) {
                        if ((oData.results[0].FrontUrl !== "proxy not triggered") && (oData.results[0].FrontUrl !== " ")) {
                            this.getView().byId("idFrontUrl").setSrc(oData.results[0].FrontUrl);
                            this.getView().byId("idBackUrl").setSrc(oData.results[0].BackUrl);
                        } else {
                            // imageflag = sap.ui.require.toUrl("CCGSDGRADINGAPP.ZSD_GRADINGAPP.controller.grading/Image/No_image.png");
                            that.getView().byId("idFrontUrl").setSrc("/sap/bc/ui5_ui5/sap/ZSD_GRADINGAPP/Image/No_image.png");
                            that.getView().byId("idBackUrl").setSrc("/sap/bc/ui5_ui5/sap/ZSD_GRADINGAPP/Image/No_image.png");
                        }
                    }else{
                        that.getView().byId("idFrontUrl").setSrc("");
                        that.getView().byId("idBackUrl").setSrc("");
                    }
                        
                    }.bind(this),

                    error: function () {

                       
                    }

                });

            },
            TC_models : function(){

                var MainModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(MainModel, "MainModel");

                var GradHistModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(GradHistModel, "GradHistModel");

                var MainModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(MainModel, "MainModel");

                var GradHistModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(GradHistModel, "GradHistModel");

            },
            TC_MainScreenData: function () {

                this.SalesId = this.getView().byId("idSalesOrder").getValue();
                var lSalesOrder = this.getView().byId("idSalesOrder").getValue();
                var lLineItem = this.getView().byId("idLineItem").getValue();
                this.SalesId = this.getView().byId("idSalesOrder").getValue();
                this.LineId = this.getView().byId("idLineItem").getValue();
                var oModel = this.getOwnerComponent().getModel("SC");
                var tableModel = new sap.ui.model.json.JSONModel();

                
                this.TC_models();
                

                

                var filtert = [
                    new sap.ui.model.Filter("Vbeln", sap.ui.model.FilterOperator.EQ, lSalesOrder),
                    new sap.ui.model.Filter("Posnr", sap.ui.model.FilterOperator.EQ, lLineItem)
                ];
                oModel.read("/TradingCardSet", {
                    filters: filtert,
                    success: function (oData, oResponse) {
                        tableModel.setData(oData);
                        if (oData.results.length !== 0) {
                            this.setAutoGraphValidation(oData.results[0].RemarksFlag);
                            this.GradeChek = oData.results[0].gradedec;
                            this.getImage(oData.results[0].Certificateno);
                            // if (oData.results[0].CardErrorFlag === "Y") {
                            //     this.getView().byId("_IDGenRadioButton1").setSelected(true);
                            //     this.getView().byId("_IDGenRadioButton2").setSelected(false);
                            // } else {
                            //     this.getView().byId("_IDGenRadioButton1").setSelected(false);
                            //     this.getView().byId("_IDGenRadioButton2").setSelected(true);
                            // }
                            if (oData.results[0].Perfect10 === "X") {
                                //this.getView().byId("idPerChk").setSelected(true);
                                this.getView().byId("idGrade").setSelectedKey("PERFECT");
                                //this.getView().byId("idPristineChk").setSelected(false);

                                this.perfectchk = "S";

                            } else if (oData.results[0].CardError === "X") {   // Pristine-10 value getting in carderror filed
                                //this.getView().byId("idPristineChk").setSelected(true);
                                this.getView().byId("idGrade").setSelectedKey("PRISTINE");
                                //this.getView().byId("idPerChk").setSelected(false);

                            }
                            else {
                                //this.getView().byId("idPerChk").setSelected(false);
                                //this.getView().byId("idPristineChk").setSelected(false);

                            }
                            if (oData.results[0].GradeComplete === "X") {
                                this.getView().byId("idFinish").setSelected(true);
                                // this.getView().byId("idFinish").setEnabled(false);
                                this.getView().byId("idExit").setEnabled(false);
                                this.getView().byId("idPrevious").setEnabled(false);
                                this.getView().byId("idNext").setEnabled(false);
                                // this.getView().byId("idInputCollId").setEnabled(false);
                                this.getView().byId("idGrade").setEnabled(false);
                                this.getView().byId("idCenter").setEnabled(false);
                                this.getView().byId("idCorner").setEnabled(false);
                                this.getView().byId("idEdge").setEnabled(false);
                                this.getView().byId("idSurface").setEnabled(false);
                                // this.getView().byId("idAutoGrade").setEnabled(false);
                                this.getView().byId("idNoGrade").setEnabled(false);
                                // this.getView().byId("idBump").setEnabled(false);


                                // this.getView().byId("idPerChk").setEnabled(false);

                                MessageToast.show("Grading is Completed for this Salesorder and No further changes can be done");
                            } else {
                                this.getView().byId("idFinish").setSelected(false);
                                // this.getView().byId("idFinish").setEnabled(true);
                                this.getView().byId("idExit").setEnabled(true);
                                this.getView().byId("idPrevious").setEnabled(true);
                                this.getView().byId("idNext").setEnabled(true);
                                // this.getView().byId("idInputCollId").setEnabled(true);
                                this.getView().byId("idGrade").setEnabled(true);
                                this.getView().byId("idCenter").setEnabled(true);
                                this.getView().byId("idCorner").setEnabled(true);
                                this.getView().byId("idEdge").setEnabled(true);
                                this.getView().byId("idSurface").setEnabled(true);
                                // this.getView().byId("idAutoGrade").setEnabled(true);
                                this.getView().byId("idNoGrade").setEnabled(true);
                                // this.getView().byId("idBump").setEnabled(true);
                                // this.getView().byId("idPerChk").setEnabled(true);
                            }
                            if (oData.results[0].Nograde !== "") {
                                //this.getView().byId("idPerChk").setSelected(false);
                                this.getView().byId("idGrade").setEnabled(false);
                                this.getView().byId("idCenter").setEnabled(false);
                                this.getView().byId("idCorner").setEnabled(false);
                                this.getView().byId("idEdge").setEnabled(false);
                                this.getView().byId("idSurface").setEnabled(false);
                                // this.getView().byId("idAutoGrade").setEnabled(false);
                                //this.getView().byId("idPerChk").setEnabled(false);
                            }
                            if (oData.results[0].Nograde === "") {
                                this.getView().byId("idGrade").setEnabled(true);
                                this.getView().byId("idCenter").setEnabled(true);
                                this.getView().byId("idCorner").setEnabled(true);
                                this.getView().byId("idEdge").setEnabled(true);
                                this.getView().byId("idSurface").setEnabled(true);
                                // this.getView().byId("idAutoGrade").setEnabled(true);
                                //this.getView().byId("idPerChk").setEnabled(true);
                            }

                            this.setCarError(oData.results[0]);

                        } else {
                            this.getView().byId("idFinish").setSelected(false);
                            // this.getView().byId("idFinish").setEnabled(true);
                            this.getView().byId("idExit").setEnabled(true);
                            this.getView().byId("idPrevious").setEnabled(true);
                            this.getView().byId("idNext").setEnabled(true);
                            // this.getView().byId("idInputCollId").setEnabled(true);
                            this.getView().byId("idGrade").setEnabled(true);
                            this.getView().byId("idCenter").setEnabled(true);
                            this.getView().byId("idCorner").setEnabled(true);
                            this.getView().byId("idEdge").setEnabled(true);
                            this.getView().byId("idSurface").setEnabled(true);
                            // this.getView().byId("idAutoGrade").setEnabled(true);
                            this.getView().byId("idNoGrade").setEnabled(true);
                            // this.getView().byId("idBump").setEnabled(true);
                            //this.getView().byId("idPerChk").setEnabled(true);
                        }
                        // oData.results.unshift(" ");
                        this.ErrorDropdown(oData);
                        //this.getView().getModel("MainModel").setData(oData.results[0]);
                        //this.getView().getModel("MainModel").refresh();
                        
                        // this.getView().setModel(MainModel, "MainModel");

                    }.bind(this),

                    error: function () {
                        MessageToast.show("Failed to Load Screen Information, Please Contact Technical Team");

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
                            oData.results.sort(function(a, b){return a.Posnr-b.Posnr});
                        }
                        this.getView().getModel("InitModel").setData(oData.results);
                        this.getView().getModel("InitModel").refresh();


                    }.bind(this),
                    error: function () {
                        // MessageToast.show("Failed");
                        this.getView().byId("idMsdGradTab").setText("Missed Grading");

                    }
                });

                // OData Call to get Grading history data

                var filterG = [
                    new sap.ui.model.Filter("LvVbeln", sap.ui.model.FilterOperator.EQ, lSalesOrder),
                    new sap.ui.model.Filter("LvPosnr", sap.ui.model.FilterOperator.EQ, lLineItem)
                ];

                oModel.read("/Grade_gradehistorySet", {
                    filters: filterG,
                    success: function (oData, oResponse) {
                        if (oData.results.length !== 0) {
                        tableModel.setData(oData);
                        this.getView().getModel("GradHistModel").setData(oData.results);
                        this.getView().getModel("GradHistModel").refresh();
                        this.setSaveNxtPreDisabled(oData.results[0]);
                        }
                    }.bind(this),
                    error: function () {
                        // MessageToast.show("Error in Loading Grading History Data, Please Contact Technical Team");
                    }
                });

            },
            setSaveNxtPreDisabled : function(item1){

                if(this.ViewType == 'T'){

                if(item1.GradeComplete == 'X'){
                    this.getView().byId("idPrevious").setEnabled(false);
                    this.getView().byId("idNext").setEnabled(false);
                    this.getView().byId("idGrade").setEnabled(false);
                    }
                    else{
                    this.getView().byId("idPrevious").setEnabled(true);
                    this.getView().byId("idNext").setEnabled(true);
                    
                    }
                }else if(this.ViewType == 'S'){

                    if(item1.GradeComplete == 'X'){
                        this.getView().byId("SC_idPrevious").setEnabled(false);
                        this.getView().byId("SC_idNext").setEnabled(false);
                        this.getView().byId("SC_idGrade").setEnabled(false);
                        }
                        else{
                        this.getView().byId("SC_idPrevious").setEnabled(true);
                        this.getView().byId("SC_idNext").setEnabled(true);
                        
                        }

                }

            },

            // This triggers on click of Perfect-10 checkbox. If it is checked-, set all the grading values with '10-Pristine' by default else put back old values
            TC_onPristineSelect: function () {
                if (this.getView().byId("idPristineChk").getSelected() == true) {

                    this.getView().byId("idGrade").setValue("Pristine 10");
                    this.getView().byId("idGrade").setSelectedKey("PRISTINE");

                    this.getView().byId("idPerChk").setSelected(false);


                } else {
                    this.getView().byId("idGrade").setValue("");
                    this.getView().byId("idGrade").setSelectedKey("");

                }

            },
            onPerSelect: function (oEvent) {
                // write busy indicator
                // sap.ui.core.BusyIndicator.show(0);

                if (this.getView().byId("idPerChk").getSelected() == true) {

                    var DataModel = new sap.ui.model.json.JSONModel();
                    DataModel = {
                        kgrade: this.getView().byId("idGrade").getSelectedText(),
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
                    this.getView().byId("idPristineChk").setSelected(false);
                    this.getView().byId("idCenter").setValue("Gem Mint 10");
                    this.getView().byId("idCorner").setValue("Gem Mint 10");
                    this.getView().byId("idEdge").setValue("Gem Mint 10");
                    this.getView().byId("idSurface").setValue("Gem Mint 10");
                    this.getView().byId("idGrade").setValue("PERFECT");
                    this.getView().byId("idCenter").setSelectedKey("10");
                    // this.getView().byId("idCenter").setEditable(false);
                    this.getView().byId("idCorner").setSelectedKey("10");
                    // this.getView().byId("idCorner").setEditable(false);
                    this.getView().byId("idEdge").setSelectedKey("10");
                    // this.getView().byId("idEdge").setEditable(false);
                    this.getView().byId("idSurface").setSelectedKey("10");
                    // this.getView().byId("idSurface").setEditable(false);
                    this.getView().byId("idGrade").setSelectedKey("PERFECT");
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

            onNoGradeChange: function (oEvent) {

                var lNoGrade = this.getView().byId("idNoGrade").getSelectedKey();

                if (lNoGrade !== "") {
                    this.getView().byId("idCenter").setValue();
                    this.getView().byId("idCorner").setValue();
                    this.getView().byId("idEdge").setValue();
                    this.getView().byId("idSurface").setValue();
                    this.getView().byId("idGrade").setValue();
                    this.getView().byId("idAutoGrade").setValue();
                    // this.getView().byId("idAutoGrade").setValue();
                    //this.getView().byId("idPerChk").setSelected(false);
                    this.getView().byId("idGrade").setEnabled(false);
                    this.getView().byId("idAutoGrade").setEnabled(false);
                    this.getView().byId("idCenter").setEnabled(false);
                    this.getView().byId("idCorner").setEnabled(false);
                    this.getView().byId("idEdge").setEnabled(false);
                    this.getView().byId("idSurface").setEnabled(false);
                    // this.getView().byId("idAutoGrade").setEnabled(false);
                    //this.getView().byId("idPerChk").setEnabled(false);
                    this.GradeChek = " ";
                }
                if (lNoGrade === "") {
                    this.getView().byId("idGrade").setEnabled(true);
                    this.getView().byId("idAutoGrade").setEnabled(true);
                    this.getView().byId("idCenter").setEnabled(true);
                    this.getView().byId("idCorner").setEnabled(true);
                    this.getView().byId("idEdge").setEnabled(true);
                    this.getView().byId("idSurface").setEnabled(true);
                    // this.getView().byId("idAutoGrade").setEnabled(true);
                    //this.getView().byId("idPerChk").setEnabled(true);
                }
            },

            onGraderInfoClik: function (oEvent) {

                // var that = this;

                var GraderInfoModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(GraderInfoModel, "GraderInfoModel");
                var tableModel = new sap.ui.model.json.JSONModel();
                var oModel = this.getOwnerComponent().getModel("SC");

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
                            //sap.ui.getCore().byId("idGraderInfLbl").setValue(this.giCount);
                        }
                        this.getView().getModel("GraderInfoModel").setData(oData.results);
                        this.getView().getModel("GraderInfoModel").refresh();

                    }.bind(this),
                    error: function () {
                        // MessageToast.show("Failed");
                    }
                });

                /* this.gDialog = Fragment.load({
                    name: "ccgtradingcards.view.fragment.GraderInfo",
                    controller: this
                }).then(
                    function (oFrag1) {
                        this.getView().addDependent(oFrag1);
                        oFrag1.open();
                    }.bind(this)
                ); */

                var that = this,
                oView = this.getView();
               

                        if (!that.gDialog_TC) {
                            that.gDialog_TC = Fragment.load({
                                id: oView.getId(),
                                name: "ccgtradingcards.view.fragment.GraderInfo",
                                controller: that
                            }).then(function (ogDialog) {
                                
                                oView.addDependent(ogDialog);
                                return ogDialog;
                            }.bind(that));
                        }
                        that.gDialog_TC.then(function(ogDialog) {
                            ogDialog.open();
                         }); 

            },

            OnGraderClose: function (oEvent) {

                this.byId("GradDialog").close();

            },

            onNext: function (oEvent) {

                var lgrade;
                var lcenter;
                var lcorner;
                var ledge;
                var lsurface;
                // var lauto;
                var lnoGrade;
                var lperfect;
                var lv_Pristine;

                this.DisplayScreenFlag = "";
                this.ButtonType = "N";
                var InitData = this.getView().getModel("pInitModel").getData();
                this.LineId = this.getView().byId("idLineItem").getValue();
                this.SalesOrderNumber = this.getView().byId("idSalesOrder").getValue();
                lgrade         = this.getView().byId("idGrade").getValue();
                var headerData = this.getView().getModel("MainModel").getData();

                var chk = " ";

                if((this.autoGradeFlag == "X") && (lgrade) && (headerData.ZVcAutograph == "") ){
                    
                    MessageBox.error("Autograph Grade is Mandatory ");

                   //this.getView().byId("idAutoGrade").setEnabled(false);
                }else{

                // Validation 4 : on click of Next, Popup Information Message when there is no further lineitems for this sales order

                if (this.getView().byId("idFinish").getSelected() === true) {
                    chk = "X";
                }
                if (this.getView().byId("idFinish").getSelected() !== true) {

                    for (var i = 0; i < InitData.length; i++) {

                        if (i == (InitData.length - 1)) {
                            var oGrade = InitData[i];

                            if (this.LineId == oGrade.Posnr) {
                                chk = "X";
                                //MessageBox.information("No further Lineitems to Grade");
                            }
                        }
                    }
                }

                //sap.ui.core.BusyIndicator.show();

                
                

                // Functionality: if Grading Complete is checked on screen, that should be the last grading option given against that sales order
                if (this.getView().byId("idFinish").getSelected() == true) {
                    var Lfinish = "X";
                } else {
                    Lfinish = "Y";
                }

                // Functionality: if Perfect-10 is checked on screen, all the grading values should be passed as '10' char value
                //                if Perfect-10 is not checked, whatever the grade values selected should be saved
                

                this.GradeChek = this.getView().byId("idGrade").getSelectedKey();
                    
                lnoGrade = this.getView().byId("idNoGrade").getSelectedKey();
                if(lnoGrade){
                    lgrade = "";
                    lcenter = "";
                    lcorner = "";
                    ledge = "";
                    lsurface = "";
                    lperfect = "";
                    lv_Pristine = "";
                    this.GradeChek = "";
                }else{
                if ((this.GradeChek == "PRISTINE") || (this.GradeChek == "PERFECT")) {
                    if (this.GradeChek == "PERFECT") {
                        lgrade = "10";
                        lcenter = "10";
                        lcorner = "10";
                        ledge = "10";
                        lsurface = "10";
                        lperfect = "X";
                        // lauto = this.getView().byId("idAutoGrade").getSelectedKey();
                        //lnoGrade = this.getView().byId("idNoGrade").getSelectedKey();
                    } else if (this.GradeChek == "PRISTINE") {

                        lgrade = "10";
                        lv_Pristine = "X";
                        lperfect = "";

                    }

                } }

                var lNoGrade1 = this.getView().byId("idNoGrade").getSelectedKey();
                if (lNoGrade1 !== "") {
                    lgrade = "";
                    lcenter = "";
                    lcorner = "";
                    ledge = "";
                    lsurface = "";
                    lperfect = "";
                    lv_Pristine = "";
                    // lauto = "";
                }

                var lSalesOrder = this.getView().byId("idSalesOrder").getValue();
                var lLineItem = this.getView().byId("idLineItem").getValue();

                // var carderror = this.getView().byId("_IDGenRadioButton1").getSelected();
                // if (carderror === true) {
                //     var lerrorflag = 'Y'
                // }
                // else {
                //     lerrorflag = 'N'
                // }

                // Functionality: if Grading Complete is checked on screen, that should be the last grading option given against that sales order
                if (this.getView().byId("idFinish").getSelected() === true) {
                    var Lfinish = "X";
                } else {
                    Lfinish = "Y";
                }

                //card error code
                var carderror = {};
                if (this.getView().byId("CardErrorFlag").getSelectedIndex() == 0) {
                    this.getCardErrorFlag = 'X';
                    if(this.CardCode){
                        carderror.cardErrorCode = this.CardCode;
                        carderror.cardErrorName = this.cardName;
                        carderror.errorLblText = this.getView().byId("errorLblTxt").getValue();
                    }else{
                        if (this.getView().byId("idError1").getLastValue() !== '')
                        {
                        carderror.cardErrorCode = this.getView().byId("idError1").getSelectedItem().mProperties.additionalText;
                        carderror.errorLblText = this.getView().byId("errorLblTxt").getValue();
                        carderror.cardErrorName = this.getView().byId("idError1").getSelectedItem().mProperties.text;
                        }
                    }

                }
                else {
                    this.getCardErrorFlag = '';
                    carderror.cardErrorCode = '';
                    carderror.errorLblText  = '';
                    carderror.cardErrorName = '';
                }
                carderror.flag = this.getCardErrorFlag;
                
                this.onCardDrpDwnCLear();

                // Save the characteristic values in history table
                var histHeadArr = [];
                var histHead = {
                    KeyComment1: headerData.KeyComment1,
                    CollectorNum: " ",
                    Vbeln: lSalesOrder,
                    KeyComment2: headerData.KeyComment2,
                    CardErrorFlag: carderror.flag,
                    Posnr: lLineItem,
                    KeyComment3: headerData.KeyComment3,
                    Matnr: headerData.Matnr,
                    CardInfoCmt: headerData.CardInfoCmt,
                    GameCode: " ",
                    LangCode: " ",
                    SetCode: " ",
                    CardName: carderror.cardErrorName,
                    CardLabeltext: carderror.errorLblText,
                    VariantCode1: " ",
                    VariantCode2: " ",
                    RarityCode: " ",
                    Pedigree: headerData.Pedigree,
                    GreekPrefix: " ",
                    GreekSuffix: " ",
                    StarSymbol: " ",
                    GenderSymbol: " ",
                    InternalNote: headerData.InternalNote,
                    CardError: carderror.cardErrorCode,
                    CardDefect: headerData.CardDefect,
                    FinalGrade: Lfinish,
                    Center: lcenter,
                    Surface: lsurface,
                    Corner: lcorner,
                    Edge: ledge,
                    Nograde: lnoGrade,
                    Aicenter: "",
                    Aicorner: "",
                    Aiedge: "",
                    Aisurface: "",
                    Grade: lgrade,
                    Perfect10: lperfect,
                    ExtRefItemId: lv_Pristine,
                    Bump : headerData.Bump,
                    ZVcAutograph : headerData.ZVcAutograph
                };
                if(histHead.CardLabeltext == ' '){
                    histHead.CardLabeltext = carderror.errorLblText;
                }
                histHeadArr.push(histHead);

                var that = this;
                var oDataModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZODATA_CHARACTERISTCS_GRADENEW_SRV/");
                oDataModel.create("/TradingCardSet", histHead, {
                    method: "POST",
                    success: function (message) {
                        // that.onMaraCreatecallp();
                        if(message.Imflag == "E"){
                            MessageBox.error("Collectable ID is In-active");

                        }else{
                        var text = message.MESSAGE;
                        MessageToast.show("Data Saved Succesfully");
                        //sap.ui.core.BusyIndicator.hide();

                        that.getNextLineItem("N")
                            .then(function (oApp) {
                                that.onFetchDetailsValidate(oApp);

                            }, true);
                        }

                    },

                    error: function (oError) {
                        //sap.ui.core.BusyIndicator.hide();
                        // alert("Create Operation failed : " + oError);
                    }
                });
                }
                
            },

            onGetGradeHistcall: function (oEvent) {

                var tableModel1 = new sap.ui.model.json.JSONModel();
                var oModel1 = this.getOwnerComponent().getModel("SC");

                
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
                                //this.getView().byId("idPerChk").setSelected(true);
                                //this.getView().byId("idPerChk").setEnabled(true);
                            } else {
                                //this.getView().byId("idPerChk").setSelected(false);
                                //this.getView().byId("idPerChk").setEnabled(true);
                            }

                            if (oData.results[0].GradeComplete === "X") {
                                this.getView().byId("idFinish").setSelected(true);
                                // this.getView().byId("idFinish").setEnabled(false);
                                this.getView().byId("idExit").setEnabled(false);
                                //this.getView().byId("idPrevious").setEnabled(false);
                                //this.getView().byId("idNext").setEnabled(false);
                                // this.getView().byId("idInputCollId").setEnabled(false);
                                this.getView().byId("idGrade").setEnabled(false);
                                this.getView().byId("idCenter").setEnabled(false);
                                this.getView().byId("idCorner").setEnabled(false);
                                this.getView().byId("idEdge").setEnabled(false);
                                this.getView().byId("idSurface").setEnabled(false);
                                // this.getView().byId("idAutoGrade").setEnabled(false);
                                this.getView().byId("idNoGrade").setEnabled(false);
                                // this.getView().byId("idBump").setEnabled(false);
                                //this.getView().byId("idPerChk").setEnabled(false);

                                MessageToast.show("Grading is Completed for this Salesorder and No further changes can be done");
                                this.SetLineItem(oData.results[0].Posnr);
                            } else {

                                
                                this.getView().byId("idFinish").setSelected(false);
                                // this.getView().byId("idFinish").setEnabled(true);
                                this.getView().byId("idExit").setEnabled(true);
                                //this.getView().byId("idPrevious").setEnabled(true);
                                //this.getView().byId("idNext").setEnabled(true);
                                // this.getView().byId("idInputCollId").setEnabled(true);
                                this.getView().byId("idGrade").setEnabled(true);
                                this.getView().byId("idCenter").setEnabled(true);
                                this.getView().byId("idCorner").setEnabled(true);
                                this.getView().byId("idEdge").setEnabled(true);
                                this.getView().byId("idSurface").setEnabled(true);
                                // this.getView().byId("idAutoGrade").setEnabled(true);
                                this.getView().byId("idNoGrade").setEnabled(true);
                                // this.getView().byId("idBump").setEnabled(true);
                                //this.getView().byId("idPerChk").setEnabled(true);
                            }

                            if (oData.results[0].Nograde !== "") {
                                //this.getView().byId("idPerChk").setSelected(false);
                                this.getView().byId("idGrade").setEnabled(false);
                                this.getView().byId("idCenter").setEnabled(false);
                                this.getView().byId("idCorner").setEnabled(false);
                                this.getView().byId("idEdge").setEnabled(false);
                                this.getView().byId("idSurface").setEnabled(false);
                                // this.getView().byId("idAutoGrade").setEnabled(false);
                                //this.getView().byId("idPerChk").setEnabled(false);
                            } else {
                                this.getView().byId("idGrade").setEnabled(true);
                                this.getView().byId("idCenter").setEnabled(true);
                                this.getView().byId("idCorner").setEnabled(true);
                                this.getView().byId("idEdge").setEnabled(true);
                                this.getView().byId("idSurface").setEnabled(true);
                                // this.getView().byId("idAutoGrade").setEnabled(true);
                                //this.getView().byId("idPerChk").setEnabled(true);
                            }
                            this.setSaveNxtPreDisabled(oData.results[0]);
                        }
                        this.getView().getModel("GradHistModel").setData(oData.results);
                        this.getView().getModel("GradHistModel").refresh();


                    }.bind(this),

                    error: function () {
                        // MessageToast.show("Failed");

                    }
                });

                //this.getImage();

                //this.getView().byId("idPerChk").setSelected(false);
            },

            onMissedCall: function (oEvent) {

                var tableModel = new sap.ui.model.json.JSONModel();
                var oModel = this.getOwnerComponent().getModel("SC");
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
                            oData.results.sort(function(a, b){return a.Posnr-b.Posnr});
                        }
                        this.getView().getModel("InitModel").setData(oData.results);
                        this.getView().getModel("InitModel").refresh();
                        //this.hideBusyIndicator();
                    }.bind(this),
                    error: function () {
                        // MessageToast.show("Failed");
                        this.getView().byId("idMsdGradTab").setText("Missed Grading");
                        //this.hideBusyIndicator();
                    }
                });
            },

            onCardDrpDwnCLear: function () {
                this.getView().byId("idError1").setSelectedKey("");
                this.getView().byId("errorLblTxt").setValue("");
            },

            onCardErrorFlag: function (oEvent) {

                this.getCardErrorFlag = oEvent.getSource().getSelectedButton().mProperties.text;
                if (this.getCardErrorFlag == 'No') {

                    this.getView().byId("idError1").setEnabled(false);
                    this.getView().byId("idError1").setSelectedKey("");
                    this.getView().byId("errorLblTxt").setEnabled(false);
                    this.getView().byId("errorLblTxt").setValue("");

                } else {

                    this.getView().byId("idError1").setEnabled(true);
                    this.getView().byId("errorLblTxt").setEnabled(true);
                }

            },
            onErrorSelected: function (oEvent) {

                this.cardName = oEvent.getSource().getSelectedItem().mProperties.text;
                this.CardCode = oEvent.getSource().getSelectedItem().mProperties.additionalText;
                this.errorLblTxt = oEvent.getSource().getSelectedItem().mProperties.key;
                this.getView().getModel("MainModel").getData().CardLabeltext = this.errorLblTxt;
                this.getView().getModel("MainModel").refresh();
            },
            onPrevious: function (oEvent) {

                var lgrade;
                var lcenter;
                var lcorner;
                var ledge;
                var lsurface;
                // var lauto;
                var lnoGrade;
                var lperfect;
                var lv_Pristine;

                var headerData = this.getView().getModel("MainModel").getData();
                this.DisplayScreenFlag = "";
                this.ButtonType = "P"  // this is previous button type
                this.LineId = this.getView().byId("idLineItem").getValue();
                this.SalesOrderNumber = this.getView().byId("idSalesOrder").getValue();
                lgrade         = this.getView().byId("idGrade").getValue();

                var InitData = this.getView().getModel("pInitModel").getData();
                var chk = " ";

                // Check if Previous Line item is available, if not pop-up information
                if (this.LineId == InitData[0].Posnr) {
                    chk = "X";
                    //MessageBox.information("No Previous Lineitems to Grade");
                }

                if((this.autoGradeFlag == "X") && (lgrade) && (headerData.ZVcAutograph == "") ){
                    
                    MessageBox.error("Autograph Grade is Mandatory ");
                }else{
                // If Previous Lineitem is available, load the characteristic values of previous Lineitem
                // if (chk !== "X") {

                //sap.ui.core.BusyIndicator.show();

                

                // Functionality: if Grading Complete is checked on screen, that should be the last grading option given against that sales order
                if (this.getView().byId("idFinish").getSelected() == true) {
                    var Lfinish = "X";
                } else {
                    Lfinish = "Y";
                }

                // Functionality: if Perfect-10 is checked on screen, all the grading values should be passed as '10' char value
                //                if Perfect-10 is not checked, whatever the grade values selected should be saved
                

                    this.GradeChek = this.getView().byId("idGrade").getSelectedKey();
                   
                
                    lnoGrade = this.getView().byId("idNoGrade").getSelectedKey();
                    if(lnoGrade){
                        lgrade = "";
                        lcenter = "";
                        lcorner = "";
                        ledge = "";
                        lsurface = "";
                        lperfect = "";
                        lv_Pristine = "";
                        this.GradeChek = "";
                    }else{
                    if ((this.GradeChek == "PRISTINE") || (this.GradeChek == "PERFECT")) {
                        if (this.GradeChek == "PERFECT") {
                            lgrade = "10";
                            lcenter = "10";
                            lcorner = "10";
                            ledge = "10";
                            lsurface = "10";
                            lperfect = "X";
                            // lauto = this.getView().byId("idAutoGrade").getSelectedKey();
                            //lnoGrade = this.getView().byId("idNoGrade").getSelectedKey();
                        } else if (this.GradeChek == "PRISTINE") {
    
                            lgrade = "10";
                            lv_Pristine = "X";
                            lperfect = "";
    
                        }
    
                    } }

                var lNoGrade1 = this.getView().byId("idNoGrade").getSelectedKey();
                if (lNoGrade1 !== "") {
                    lgrade = "";
                    lcenter = "";
                    lcorner = "";
                    ledge = "";
                    lsurface = "";
                    lperfect = "";
                    lv_Pristine = "";
                    // lauto = "";
                }


                var lSalesOrder = this.getView().byId("idSalesOrder").getValue();
                var lLineItem = this.getView().byId("idLineItem").getValue();

                // var carderror = this.getView().byId("_IDGenRadioButton1").getSelected();
                // if (carderror === true) {
                //     var lerrorflag = 'Y'
                // }
                // else {
                //     lerrorflag = 'N'
                // }

                // Functionality: if Grading Complete is checked on screen, that should be the last grading option given against that sales order
                if (this.getView().byId("idFinish").getSelected() === true) {
                    var Lfinish = "X";
                } else {
                    Lfinish = "Y";
                }

                //card error code
                var carderror = {};
                if (this.getView().byId("CardErrorFlag").getSelectedIndex() == 0) {
                    this.getCardErrorFlag = 'X';
                    if(this.CardCode){
                        carderror.cardErrorCode = this.CardCode;
                        carderror.cardErrorName = this.cardName;
                        carderror.errorLblText = this.getView().byId("errorLblTxt").getValue();
                    }else{
                        if (this.getView().byId("idError1").getLastValue() !== '')
                        {
                        carderror.cardErrorCode = this.getView().byId("idError1").getSelectedItem().mProperties.additionalText;
                        carderror.errorLblText = this.getView().byId("errorLblTxt").getValue();
                        carderror.cardErrorName = this.getView().byId("idError1").getSelectedItem().mProperties.text;
                        }
                    }

                }
                else {
                    this.getCardErrorFlag = '';
                    carderror.cardErrorCode = '';
                    carderror.errorLblText  = '';
                    carderror.cardErrorName = '';
                }

                
                //carderror.errorLblText = this.getView().byId("errorLblTxt").getValue();
                this.onCardDrpDwnCLear();

                // Save the characteristic values in history table
                var histHeadArr = [];
                var histHead = {
                    KeyComment1: " ",
                    CollectorNum: " ",
                    Vbeln: lSalesOrder,
                    KeyComment2: " ",
                    CardErrorFlag: this.getCardErrorFlag,
                    Posnr: lLineItem,
                    KeyComment3: " ",
                    Matnr: headerData.Matnr,
                    CardInfoCmt: headerData.CardInfoCmt,
                    GameCode: " ",
                    LangCode: " ",
                    SetCode: " ",
                    CardName: carderror.cardErrorName,
                    CardLabeltext: carderror.errorLblText,
                    CardLabeltext: " ",
                    VariantCode1: " ",
                    VariantCode2: " ",
                    RarityCode: " ",
                    Pedigree: headerData.Pedigree,
                    GreekPrefix: " ",
                    GreekSuffix: " ",
                    StarSymbol: " ",
                    GenderSymbol: " ",
                    InternalNote: headerData.InternalNote,
                    CardError: carderror.cardErrorCode,
                    CardDefect: headerData.CardDefect,
                    FinalGrade: Lfinish,
                    Center: lcenter,
                    Surface: lsurface,
                    Corner: lcorner,
                    Edge: ledge,
                    Nograde: lnoGrade,
                    Aicenter: "",
                    Aicorner: "",
                    Aiedge: "",
                    Aisurface: "",
                    Grade: lgrade,
                    Perfect10: lperfect,
                    ExtRefItemId: lv_Pristine,
                    Bump : headerData.Bump,
                    ZVcAutograph : headerData.ZVcAutograph
                };
                if(histHead.CardLabeltext == ' '){
                    histHead.CardLabeltext = carderror.errorLblText;
                }
                histHeadArr.push(histHead);

                var that = this;
                var oDataModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZODATA_CHARACTERISTCS_GRADENEW_SRV/");
                oDataModel.create("/TradingCardSet", histHead, {
                    method: "POST",
                    success: function (message) {

                        if(message.Imflag == "E"){
                            MessageBox.error("Collectable ID is In-active");

                        }else{

                        var text = message.MESSAGE;
                        MessageToast.show("Data Saved Succesfully");
                        //sap.ui.core.BusyIndicator.hide();



                        that.getNextLineItem("P")
                            .then(function (oApp) {
                                that.onFetchDetailsValidate(oApp);

                            }, true);


                        //that.getNextLineItem("P");

                        //that.onFetchDetailsValidate();

                        //that.onGetGradeHistcallp();
                        //that.onMissedCall();

                        }


                    },
                    error: function (oError) {
                        //sap.ui.core.BusyIndicator.hide();
                        // alert("Create Operation failed : " + oError);
                    }
                });
                // }

            }

            },

            getNextLineItem: function (oApp) {

                return new Promise(function (resolve, reject) {

                    var that = this;
                    this.oDataMaradata = [];
                    this.SalesOrderNumber = this.getView().byId("idSalesOrder").getValue();

                    var Nfilter = [
                        new sap.ui.model.Filter("LvVbeln", sap.ui.model.FilterOperator.EQ, this.SalesOrderNumber),
                        new sap.ui.model.Filter("LvPosnr", sap.ui.model.FilterOperator.EQ, this.LineId),
                        new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, oApp)
                    ];

                    this.oModel.read("/Grade_MARADATASet", {
                        filters: Nfilter,
                        success: function (oData, oResponse) {
                            if(oData.results[0].LvPosnr !== that.LineId){
                            resolve(oData.results[0].ExtRefItemId);
                            
                            }else{
                                if(that.GradeCompleted_SC == " " && that.GradeCompleted == " "){
                                    if(oApp == "N")
                                    MessageBox.information("No further Lineitems to Grade");
                                    else if(oApp == "P")
                                    MessageBox.information("No Previous Lineitems to Grade");
                                }
                                resolve(that.LineId);
                            }
                            that.oDataMaradata = oData.results;
                        },
                        error(oFail) {
                            resolve();
                        }
                    });
                }.bind(this));


            },

            onGetGradeHistcallp: function (oEvent) {

                var tableModel1 = new sap.ui.model.json.JSONModel();
                var oModel1 = this.getOwnerComponent().getModel("SC");

                
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

                            } else {

                            }

                            if (oData.results[0].GradeComplete === "X") {
                                this.getView().byId("idFinish").setSelected(true);
                                // this.getView().byId("idFinish").setEnabled(false);
                                this.getView().byId("idExit").setEnabled(false);
                                //this.getView().byId("idPrevious").setEnabled(false);
                                // this.getView().byId("idNext").setEnabled(false);
                                // this.getView().byId("idInputCollId").setEnabled(false);
                                this.getView().byId("idGrade").setEnabled(false);
                                this.getView().byId("idCenter").setEnabled(false);
                                this.getView().byId("idCorner").setEnabled(false);
                                this.getView().byId("idEdge").setEnabled(false);
                                this.getView().byId("idSurface").setEnabled(false);
                                // this.getView().byId("idAutoGrade").setEnabled(false);
                                this.getView().byId("idNoGrade").setEnabled(false);
                                // this.getView().byId("idBump").setEnabled(false);
                                //this.getView().byId("idPerChk").setEnabled(false);

                                MessageToast.show("Grading is Completed for this Salesorder and No further changes can be done");
                                this.SetLineItem(oData.results[0].Posnr);
                            } else {
                                
                                this.getView().byId("idFinish").setSelected(false);
                                // this.getView().byId("idFinish").setEnabled(true);
                                this.getView().byId("idExit").setEnabled(true);
                                //this.getView().byId("idPrevious").setEnabled(true);
                                // this.getView().byId("idNext").setEnabled(true);
                                // this.getView().byId("idInputCollId").setEnabled(true);
                                this.getView().byId("idGrade").setEnabled(true);
                                this.getView().byId("idCenter").setEnabled(true);
                                this.getView().byId("idCorner").setEnabled(true);
                                this.getView().byId("idEdge").setEnabled(true);
                                this.getView().byId("idSurface").setEnabled(true);
                                // this.getView().byId("idAutoGrade").setEnabled(true);
                                this.getView().byId("idNoGrade").setEnabled(true);
                                // this.getView().byId("idBump").setEnabled(true);
                                //this.getView().byId("idPerChk").setEnabled(true);
                            }

                            if (oData.results[0].Nograde !== "") {
                                //this.getView().byId("idPerChk").setSelected(false);
                                this.getView().byId("idGrade").setEnabled(false);
                                this.getView().byId("idCenter").setEnabled(false);
                                this.getView().byId("idCorner").setEnabled(false);
                                this.getView().byId("idEdge").setEnabled(false);
                                this.getView().byId("idSurface").setEnabled(false);
                                // this.getView().byId("idAutoGrade").setEnabled(false);
                                //this.getView().byId("idPerChk").setEnabled(false);
                            } else {
                                this.getView().byId("idGrade").setEnabled(true);
                                this.getView().byId("idCenter").setEnabled(true);
                                this.getView().byId("idCorner").setEnabled(true);
                                this.getView().byId("idEdge").setEnabled(true);
                                this.getView().byId("idSurface").setEnabled(true);
                                // this.getView().byId("idAutoGrade").setEnabled(true);
                                // this.getView().byId("idPerChk").setEnabled(true);
                            }
                            this.setSaveNxtPreDisabled(oData.results[0]);
                        }

                        this.getView().getModel("GradHistModel").setData(oData.results);
                        this.getView().getModel("GradHistModel").refresh();


                    }.bind(this),

                    error: function () {
                        // MessageToast.show("Failed");
                    }
                });
                //this.getImage();
                //this.getView().byId("idPerChk").setSelected(false);
            },

            onCancel: function (oEvent) {
                // // var that = this. 
                // this.getView().byId("idSportsCard").setValue(" ");
                // this.getView().byId("idInputManuf").setValue(" ");
                // this.getView().byId("idSetCode").setValue(" ");
                // this.getView().byId("idPlayer").setValue(" ");
                // this.getView().byId("idSubset").setValue(" ");
                // this.getView().byId("idInputCardNo").setValue(" ");
                // this.getView().byId("idInputNota").setValue(" ");
                // this.getView().byId("idInputPedig").setValue(" ");
                // this.getView().byId("idInputCollId").setValue(" ");
                // // this.getView().byId("idInputAuto").setValue(" ");
                // this.getView().byId("idBump").setSelectedKey("");
                // this.getView().byId("idInputYear").setValue(" ");
                // this.getView().byId("idInputAttr1").setValue(" ");
                // this.getView().byId("idInputAttr2").setValue(" ");
                // this.getView().byId("idPerChk").setSelected(false);
                // this.getView().byId("idFinish").setSelected(false);
                // // this.getView().byId("idTxtSports").setText(" ");
                // // this.getView().byId("idTxtMake").setText(" ");
                // // this.getView().byId("idTxtSet").setText(" ");
                // // this.getView().byId("idTxtSubset").setText(" ");
                // this.getView().byId("idCrossOver").setValue(" ");

                var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
                oCrossAppNavigator.toExternal({
                    target: { semanticObject: "#" }
                });
            },

            onExitCust: function (oEvent) {
                var that = this;
                //that.onNext();

                // this.getView().byId("idSportsCard").setValue(" ");
                // this.getView().byId("idInputManuf").setValue(" ");
                // this.getView().byId("idSetCode").setValue(" ");
                // this.getView().byId("idPlayer").setValue(" ");
                // this.getView().byId("idSubset").setValue(" ");
                // this.getView().byId("idInputCardNo").setValue(" ");
                // this.getView().byId("idInputNota").setValue(" ");
                // this.getView().byId("idInputPedig").setValue(" ");
                // this.getView().byId("idInputCollId").setValue(" ");
                // this.getView().byId("idInputAuto").setValue(" ");
                // this.getView().byId("idBump").setSelectedKey("");
                // this.getView().byId("idInputYear").setValue(" ");
                // this.getView().byId("idInputAttr1").setValue(" ");
                // this.getView().byId("idInputAttr2").setValue(" ");
                //this.getView().byId("idPerChk").setSelected(false);
                this.getView().byId("idFinish").setSelected(false);
                // this.getView().byId("idTxtSports").setText(" ");
                // this.getView().byId("idTxtMake").setText(" ");
                // this.getView().byId("idTxtSet").setText(" ");
                // this.getView().byId("idTxtSubset").setText(" ");
                this.getView().byId("idCrossOver").setValue(" ");

                var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
                oCrossAppNavigator.toExternal({
                    target: { semanticObject: "#" }
                });
            },

            OnUserClose: function (oEvent) {

                this.byId("UserDialog").close();

            },

            // Validation 4 : Grade Complete checkbox can be checked if grading is done against all the lineitems of the given salesorder, if not throw an error.

            onGradCompleteSelect: function (oEvent) {

                var that = this;

                if (this.getView().byId("idFinish").getSelected() === false) {

                    MessageBox.warning("You are Revoking the Grade Completion status, Click OK & Save to continue", {
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
                                        that.GradeCompleted = " ";
                                        that.getView().byId("idFinish").setEnabled(true);
                                        that.getView().byId("idExit").setEnabled(true);
                                        that.getView().byId("idPrevious").setEnabled(true);
                                        that.getView().byId("idNext").setEnabled(true);
                                        // that.getView().byId("idInputCollId").setEnabled(true);
                                        that.getView().byId("idGrade").setEnabled(true);
                                        that.getView().byId("idCenter").setEnabled(true);
                                        that.getView().byId("idCorner").setEnabled(true);
                                        that.getView().byId("idEdge").setEnabled(true);
                                        that.getView().byId("idSurface").setEnabled(true);
                                        // that.getView().byId("idAutoGrade").setEnabled(true);
                                        that.getView().byId("idNoGrade").setEnabled(true);
                                        // that.getView().byId("idBump").setEnabled(true);
                                        //that.getView().byId("idPerChk").setEnabled(true);
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
                    var oModelp = this.getOwnerComponent().getModel("SC");
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
                                    "Do you want to complete the Grading for this order?, click OK & Save to confirm", {
                                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                                    emphasizedAction: MessageBox.Action.OK,
                                    onClose: function (sAction) {
                                        if (sAction === "OK") {
                                            that.GradeCompleted = "X";

                                            that.getView().byId("idPrevious").setEnabled(false);
                                            that.getView().byId("idNext").setEnabled(false);
                                            that.getView().byId("idGrade").setEnabled(false);

                                            /* oModelp.read("/getInitialLineItemsSet", {
                                                filters: pfilter,
                                                success: function (oData, oResponse) {
                                                    tableModelp.setData(oData);
                                                    tempv = "X";
                                                    
                                                    that.getView().byId("idPrevious").setEnabled(false);
                                                    that.getView().byId("idNext").setEnabled(false);
                                                    
                                                    // that.getView().byId("idInputCollId").setEnabled(false);
                                                    that.getView().byId("idGrade").setEnabled(false);
                                                    that.getView().byId("idExit").setEnabled(false);
                                                    that.getView().byId("idCenter").setEnabled(false);
                                                    that.getView().byId("idCorner").setEnabled(false);
                                                    that.getView().byId("idEdge").setEnabled(false);
                                                    that.getView().byId("idSurface").setEnabled(false);
                                                    // that.getView().byId("idAutoGrade").setEnabled(false);
                                                    that.getView().byId("idNoGrade").setEnabled(false);
                                                    // that.getView().byId("idBump").setEnabled(false);
                                                    //that.getView().byId("idPerChk").setEnabled(false);
                                                }.bind(this),
                                                error: function () {
                                                    // MessageToast.show("Failed");
                                                }
                                            }); */

                                            that.onNext();
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
            onDispStatus: function (oEvent) {

                // var that = this;

                var userStatusModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(userStatusModel, "userStatusModel");
                var tableModel = new sap.ui.model.json.JSONModel();
                var oModel = this.getOwnerComponent().getModel("SC");

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

                /* this.uDialog = Fragment.load({
                    name: "ccgtradingcards.view.fragment.Userstatus",
                    controller: this
                }).then(
                    function (oFrag1) {
                        this.getView().addDependent(oFrag1);
                        oFrag1.open();
                    }.bind(this)
                ); */
                var that = this,
                oView = this.getView();
               

                        if (!that.uDialog) {
                            that.uDialog = Fragment.load({
                                id: oView.getId(),
                                name: "ccgtradingcards.view.fragment.Userstatus",
                                controller: that
                            }).then(function (oDialog) {
                                
                                oView.addDependent(oDialog);
                                return oDialog;
                            }.bind(that));
                        }
                        that.uDialog.then(function(oDialog) {
                            oDialog.open();
                         }); 

            },

            onSignaturePress: function () {
                var that = this,
                    oView = this.getView();
                if (!that.oSignatureDialog) {
                    that.oSignatureDialog = Fragment.load({
                        id: oView.getId(),
                        name: "ccgtradingcards.view.fragment.Signature",
                        controller: that
                    }).then(function (oDialog) {
                        oDialog.setModel();
                        oView.addDependent(oDialog);
                        return oDialog;
                    }.bind(that));
                }
                that.oSignatureDialog.then(function (oDialog) {
                    oDialog.open();
                });

            },
            onExitPress: function () {

                this.oSignatureDialog.then(function (oDialog) {
                    oDialog.close();
                });

            },

            // Sports card Controller code start.......................................................

            onFetchDetails: function (oEvent) {

                //this.showBusyIndicator(0, 0);

                var that = this;
                that.GradeCompleted_SC = " ";
                that.GradeCompleted    = " ";
                this.DisplayScreenFlag = "X"
                this.oSalesID = this.getView().byId("idSalesOrder").getValue();
                // this.oLineID = this.getView().byId("idLineItem").getSelectedKey();
                this.oLineID = this.getView().byId("idLineItem").getValue();

                //If no lineitem is entered, by default it should pick lineitem 1

                if (this.oLineID === "") {
                    // this.getView().byId("idLineItem").setSelectedKey("1");
                    // this.oLineID = "1";
                    MessageBox.error("Please select Lineitem");
                }

                if (this.oLineID !== "") {

                    var tableModel = new sap.ui.model.json.JSONModel();


                    var filter = [
                        new sap.ui.model.Filter("LvVbeln", sap.ui.model.FilterOperator.EQ, this.oSalesID),
                        new sap.ui.model.Filter("LvPosnr", sap.ui.model.FilterOperator.EQ, this.oLineID),
                        new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, "L")
                    ];

                    // Validation 2: OData Call to check if char VC_SC_GRADING_TIER has values "MECHANICAL ERROR" or "REHOLDER", restrict the grading 

                    var chkDel = " ";
                    this.oModel_SC.read("/Grade_MARADATASet", {
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

                                                    that.onFetchDetailsValidate(this.oLineID);
                                                    that.getBumpData(this.oLineID);

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
            getBumpData : function(LineItemID){

                var filter = [
                    new sap.ui.model.Filter("LvVbeln", sap.ui.model.FilterOperator.EQ, this.SalesId),
                    new sap.ui.model.Filter("LvPosnr", sap.ui.model.FilterOperator.EQ, LineItemID)
                ];

                this.oModel_SC.read("/Grade_bumpSet", {
                    filters: filter,
                    success: function (oData, oResponse) {
                        
                        oData.results.unshift(" ");
                        this.getView().getModel("SC_BumpModel").setData(oData.results);
                        this.getView().getModel("SC_BumpModel").refresh();
                    }.bind(this),

                    error: function () {
                        // MessageToast.show("Failed");
                    }
                });

            },
            SC_Models : function(){

                var gradeObject = {
                    selected: ""
                };

                var oGradselModel = new sap.ui.model.json.JSONModel(gradeObject);
                this.getView().setModel(oGradselModel, "oGradselModel");

                var SC_MaraDataModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_MaraDataModel, "SC_MaraDataModel");

                var SC_GradHistModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_GradHistModel, "SC_GradHistModel");

                var SC_CollectibleModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_CollectibleModel, "SC_CollectibleModel");

                var SC_InitModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_InitModel, "SC_InitModel");

                var SC_YearModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_YearModel, "SC_YearModel");

                var SC_ImageModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_ImageModel, "SC_ImageModel");

                var SC_pInitModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_pInitModel, "SC_pInitModel");

                var SC_SportsCardModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_SportsCardModel, "SC_SportsCardModel");

                var SC_CornerModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_CornerModel, "SC_CornerModel");
                var SC_CenterModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_CenterModel, "SC_CenterModel");
                var SC_AutoGradeModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_AutoGradeModel, "SC_AutoGradeModel");
                var SC_BumpModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_BumpModel, "SC_BumpModel");
                var SC_EdgeModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_EdgeModel, "SC_EdgeModel");
                var SC_GradeModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_GradeModel, "SC_GradeModel");
                var SC_NoGradeModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_NoGradeModel, "SC_NoGradeModel");
                var SC_SurfaceModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_SurfaceModel, "SC_SurfaceModel");
                // var PlayerModel = new sap.ui.model.json.JSONModel();
                // this.getView().setModel(PlayerModel, "PlayerModel");
                var SC_SetCodeModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_SetCodeModel, "SC_SetCodeModel");
                SC_SetCodeModel.setSizeLimit(600);
                var SC_SubsetModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_SubsetModel, "SC_SubsetModel");
                SC_SubsetModel.setSizeLimit(1000);
                var SC_MakerModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_MakerModel, "SC_MakerModel");
                SC_MakerModel.setSizeLimit(1000);

            },
            SC_MainScreenData: function (oEvent) {

                //Initializing all the dropdowns/ui elements

                this.getView().byId("SC_idMsdGradTab").setText("Missed Grading");

                this.getView().byId("SC_idSportsCard").setValue(" ");
                this.getView().byId("SC_idInputManuf").setValue(" ");
                this.getView().byId("SC_idSetCode").setValue(" ");
                this.getView().byId("SC_idPlayer").setValue(" ");
                this.getView().byId("SC_idSubset").setValue(" ");
                this.getView().byId("SC_idInputCardNo").setValue(" ");
                this.getView().byId("SC_idInputNota").setValue(" ");
                this.getView().byId("SC_idInputPedig").setValue(" ");
                this.getView().byId("SC_idInputCollId").setValue(" ");
                // this.getView().byId("idInputAuto").setValue(" ");
                this.getView().byId("SC_idBump").setSelectedKey("");
                this.getView().byId("SC_idInputYear").setValue(" ");
                this.getView().byId("SC_idInputAttr1").setValue(" ");
                this.getView().byId("SC_idInputAttr2").setValue(" ");
                //this.getView().byId("SC_idPerChk").setSelected(false);
                this.getView().byId("SC_idFinish").setSelected(false);
                // this.getView().byId("idTxtSports").setText(" ");
                // this.getView().byId("idTxtMake").setText(" ");
                // this.getView().byId("idTxtSet").setText(" ");
                // this.getView().byId("idTxtSubset").setText(" ");
                //this.getView().byId("idCrossOver").setValue(" ");

                
                var tableModel = new sap.ui.model.json.JSONModel();

                this.SalesId = this.oSalesID;
                this.LineId = this.oLineID;

                this.getView().byId("SC_idGradSales").setText(this.SalesId);

                this.SC_Models();
                //this.getView().byId("idGradLine").setText(this.LineId);

                /* var oGradselModel = new sap.ui.model.json.JSONModel(gradeObject);
                this.getView().setModel(oGradselModel, "oGradselModel");

                var SC_MaraDataModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_MaraDataModel, "SC_MaraDataModel");

                var SC_GradHistModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_GradHistModel, "SC_GradHistModel");

                var SC_CollectibleModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_CollectibleModel, "SC_CollectibleModel");

                var SC_InitModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_InitModel, "SC_InitModel");

                var SC_YearModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_YearModel, "SC_YearModel");

                var SC_ImageModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_ImageModel, "SC_ImageModel");

                var SC_pInitModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_pInitModel, "SC_pInitModel");

                var SC_SportsCardModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_SportsCardModel, "SC_SportsCardModel");

                var SC_CornerModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_CornerModel, "SC_CornerModel");
                var SC_CenterModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_CenterModel, "SC_CenterModel");
                var SC_AutoGradeModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_AutoGradeModel, "SC_AutoGradeModel");
                var SC_BumpModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_BumpModel, "SC_BumpModel");
                var SC_EdgeModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_EdgeModel, "SC_EdgeModel");
                var SC_GradeModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_GradeModel, "SC_GradeModel");
                var SC_NoGradeModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_NoGradeModel, "SC_NoGradeModel");
                var SC_SurfaceModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_SurfaceModel, "SC_SurfaceModel");
                // var PlayerModel = new sap.ui.model.json.JSONModel();
                // this.getView().setModel(PlayerModel, "PlayerModel");
                var SC_SetCodeModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_SetCodeModel, "SC_SetCodeModel");
                SC_SetCodeModel.setSizeLimit(600);
                var SC_SubsetModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_SubsetModel, "SC_SubsetModel");
                SC_SubsetModel.setSizeLimit(1000);
                var SC_MakerModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_MakerModel, "SC_MakerModel");
                SC_MakerModel.setSizeLimit(1000); */

                var filter = [
                    new sap.ui.model.Filter("LvVbeln", sap.ui.model.FilterOperator.EQ, this.SalesId),
                    new sap.ui.model.Filter("LvPosnr", sap.ui.model.FilterOperator.EQ, this.LineId)
                ];

                //sap.ui.core.BusyIndicator.show();

                // Dropdowns
                this.oModel_SC.read("/Grade_SportscardSet", {
                    success: function (oData, oResponse) {
                        tableModel.setData(oData);
                        oData.results.unshift(" ");
                        this.getView().getModel("SC_SportsCardModel").setData(oData.results);
                        this.getView().getModel("SC_SportsCardModel").refresh();

                    }.bind(this),

                    error: function () {
                        MessageToast.show("SportsCard Data not loaded, Please Contact Technical Team");
                    }
                });





                // Dropdowns
                /* this.oModel_SC.read("/Grade_CenteringSet", {
                    filters: filter,
                    success: function (oData, oResponse) {
                        tableModel.setData(oData);
                        oData.results.unshift(" ");
                        this.getView().getModel("SC_CenterModel").setData(oData.results);
                        this.getView().getModel("SC_CenterModel").refresh();
                    }.bind(this),

                    error: function () {
                        // MessageToast.show("Failed");
                    }
                }); */

                // // Dropdowns			
                // this.oModel_SC.read("/Grade_setcodeSet", {
                // 	// filters: filter,
                // 	success: function (oData, oResponse) {
                // 		tableModel.setData(oData);
                // 		oData.results.unshift(" ");
                // 		this.getView().getModel("SC_SetCodeModel").setData(oData.results);
                // 		this.getView().getModel("SC_SetCodeModel").refresh();
                // 	}.bind(this),

                // 	error: function () {
                // 		// MessageToast.show("Failed");
                // 	}
                // });

                // Dropdowns
                this.oModel_SC.read("/Grade_autogradeSet", {
                    success: function (oData, oResponse) {
                        this.setSCGradingValues(oData.results);
                    }.bind(this),

                    error: function () {
                        // MessageToast.show("Failed");
                    }
                });

                // Dropdowns
               

                // Dropdowns			
                /* this.oModel_SC.read("/Grade_edgeSet", {
                    filters: filter,
                    success: function (oData, oResponse) {
                        tableModel.setData(oData);
                        oData.results.unshift(" ");
                        this.getView().getModel("SC_EdgeModel").setData(oData.results);
                        this.getView().getModel("SC_EdgeModel").refresh();
                    }.bind(this),

                    error: function () {
                        // MessageToast.show("Failed");
                    }
                }); */

                // Dropdowns
               /*  var filterGrades = [
                    new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, 'G')
                ];
                this.oModel_SC.read("/Grade_gradeSet", {
                    filters: filterGrades,
                    success: function (oData, oResponse) {
                        tableModel.setData(oData);
                        oData.results.unshift(" ");
                        this.getView().getModel("SC_GradeModel").setData(oData.results);
                        this.getView().getModel("SC_GradeModel").refresh();
                    }.bind(this),

                    error: function () {
                        // MessageToast.show("Failed");
                    }
                }); */

                // Dropdowns
                /* this.oModel_SC.read("/Grade_nogradeSet", {
                    filters: filter,
                    success: function (oData, oResponse) {
                        tableModel.setData(oData);
                        oData.results.unshift(" ");
                        this.getView().getModel("SC_NoGradeModel").setData(oData.results);
                        this.getView().getModel("SC_NoGradeModel").refresh();
                    }.bind(this),

                    error: function () {
                        // MessageToast.show("Failed");
                    }
                }); */

                // Dropdowns
                /* this.oModel_SC.read("/Grade_surfaceSet", {
                    filters: filter,
                    success: function (oData, oResponse) {
                        tableModel.setData(oData);
                        oData.results.unshift(" ");
                        this.getView().getModel("SC_SurfaceModel").setData(oData.results);
                        this.getView().getModel("SC_SurfaceModel").refresh();
                    }.bind(this),

                    error: function () {
                        // MessageToast.show("Failed");
                    }
                });
 */
                // Dropdowns
                // this.oModel_SC.read("/ZmmPlayersrchSet", {
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
                this.oModel_SC.read("/Grade_MakerSet", {
                    filters: filter,
                    success: function (oData, oResponse) {
                        tableModel.setData(oData);
                        oData.results.unshift(" ");
                        this.getView().getModel("SC_MakerModel").setData(oData.results);
                        this.getView().getModel("SC_MakerModel").refresh();
                    }.bind(this),
                    error: function () {
                        // MessageToast.show("Failed");
                    }
                });
                // Dropdowns Commenting to improve the performance
                this.oModel_SC.read("/ZmmSubsetsrchSet", {
                    // filters: filter,
                    success: function (oData, oResponse) {
                        tableModel.setData(oData);
                        oData.results.unshift(" ");
                        this.getView().getModel("SC_SubsetModel").setData(oData.results);
                        this.getView().getModel("SC_SubsetModel").refresh();
                    }.bind(this),

                    error: function () {
                        // MessageToast.show("Failed");
                    }
                });

                // Dropdowns
              /*   this.oModel_SC.read("/Grade_cornerSet", {
                    filters: filter,
                    success: function (oData, oResponse) {
                        tableModel.setData(oData);
                        oData.results.unshift(" ");
                        this.getView().getModel("SC_CornerModel").setData(oData.results);
                        this.getView().getModel("SC_CornerModel").refresh();
                    }.bind(this),
                    error: function () {
                        // MessageToast.show("Failed");
                    }
                }); */

                // OData Call to get characteristic values of entire grading app 

                this.oModel_SC.read("/Grade_MARADATASet", {
                    filters: filter,
                    success: function (oData, oResponse) {
                        tableModel.setData(oData);
                        if (oData.results.length !== 0) {
                            this.Certid = oData.results[0].CertificateNo;
                            this.Collid = oData.results[0].CollectibleId;
                            if (oData.results[0].ZThickHolderFlag === "X") {
                                this.getView().byId("SC_idTH").setSelected(true);
                            } else {
                                this.getView().byId("SC_idTH").setSelected(false);
                            }
                            if (oData.results[0].FactoryAutograph === "X") {
                                this.getView().byId("SC_idInputAuto").setSelected(true);
                            } else {
                                this.getView().byId("SC_idInputAuto").setSelected(false);
                            }
                            this.VcScCrossover = " ";
                            this.VcScCrossover = oData.results[0].VcScCrossover;
                            if (oData.results[0].VcScCrossover === " ") {
                                //this.getView().byId("idCrossOver").setVisible(false);
                                //this.getView().byId("idCrossOverl").setVisible(false);
                            } else {
                                //this.getView().byId("idCrossOver").setVisible(true);
                                //this.getView().byId("idCrossOverl").setVisible(true);
                                //this.getView().byId("idCrossOver").setEditable(false);
                            }

                        }
                        this.getView().getModel("SC_MaraDataModel").setData(oData.results[0]);
                        this.getView().getModel("SC_MaraDataModel").refresh();

                        // OData Call to get Image URL

                        this.SC_getImage();

                        /* if(this.LineId.length == "1"){
                            var SaleItem  = this.oSalesID + "00" + this.oLineID;
                        }else if(this.LineId.length == "2"){
                            var SaleItem  = this.oSalesID + "0" + this.oLineID;
                        }else{
                            var SaleItem  = this.oSalesID + this.oLineID;
                        }
                        
                        var imgfilter = [
                            new sap.ui.model.Filter("CertType", sap.ui.model.FilterOperator.EQ, "CARDS"),
                            new sap.ui.model.Filter("CertId", sap.ui.model.FilterOperator.EQ, SaleItem),
                            
                        ];

                        var that = this;
                        this.oModel_SC.read("/Image_displaySet", {
                            filters: imgfilter,
                            success: function (oData, oResponse) {
                                tableModel.setData(oData);
                                if ((oData.results[0].FrontUrl !== "proxy not triggered") && (oData.results[0].FrontUrl !== " ")) {
                                    this.getView().byId("SC_idFrontUrl").setSrc(oData.results[0].FrontUrl);
                                    this.getView().byId("SC_idBackUrl").setSrc(oData.results[0].BackUrl);
                                } else {
                                    // imageflag = sap.ui.require.toUrl("CCGSDGRADINGAPP.ZSD_GRADINGAPP.controller.grading/Image/No_image.png");
                                    that.getView().byId("SC_idFrontUrl").setSrc("/sap/bc/ui5_ui5/sap/ZSD_GRADINGAPP/Image/No_image.png");
                                    that.getView().byId("SC_idBackUrl").setSrc("/sap/bc/ui5_ui5/sap/ZSD_GRADINGAPP/Image/No_image.png");
                                }
                                // this.getView().getModel("SC_ImageModel").setData(oData.results);
                                // this.getView().getModel("SC_ImageModel").refresh();
                            }.bind(this),

                            error: function () {

                                // imageflag = sap.ui.require.toUrl("CCGSDGRADINGAPP.ZSD_GRADINGAPP.controller.grading/Image/No_image.png");
                                that.getView().byId("SC_idFrontUrl").setSrc("/sap/bc/ui5_ui5/sap/ZSD_GRADINGAPP/Image/No_image.png");
                                that.getView().byId("SC_idBackUrl").setSrc("/sap/bc/ui5_ui5/sap/ZSD_GRADINGAPP/Image/No_image.png");
                            }

                        }); */

                    }.bind(this),

                    error: function () {
                        // MessageToast.show("Failed");
                        // MessageBox.information("No Characteristic Values configured for the given Sales Order");
                        MessageToast.show("Error in Loading Material Master Data, Please Contact Technical Team");
                    }
                });

                // OData Call to get Grading history data

                this.oModel_SC.read("/Grade_gradehistorySet", {
                    filters: filter,
                    success: function (oData, oResponse) {
                        tableModel.setData(oData);
                        if (oData.results.length !== 0) {
                            this.GradeChek_SC = oData.results[0].gradedec;
                            if (oData.results[0].Perfect10 === "X") {

                                this.getView().byId("SC_idGrade").setSelectedKey("PERFECT");

                                this.perfectchk = "S";

                            } else if (oData.results[0].Pristine10 === "X") {

                                this.getView().byId("SC_idGrade").setSelectedKey("PRISTINE");

                            } 
                            if (oData.results[0].GradeComplete === "X") {
                                this.getView().byId("SC_idFinish").setSelected(true);
                                // this.getView().byId("idFinish").setEnabled(false);
                                this.getView().byId("idExit").setEnabled(false);
                                this.getView().byId("SC_idPrevious").setEnabled(false);
                                this.getView().byId("SC_idNext").setEnabled(false);
                                this.getView().byId("SC_idInputCollId").setEnabled(false);
                                this.getView().byId("SC_idGrade").setEnabled(false);
                                /* this.getView().byId("SC_idCenter").setEnabled(false);
                                this.getView().byId("SC_idCorner").setEnabled(false);
                                this.getView().byId("SC_idEdge").setEnabled(false);
                                this.getView().byId("SC_idSurface").setEnabled(false); */
                                this.getView().byId("SC_idAutoGrade").setEnabled(false);
                                this.getView().byId("SC_idNoGrade").setEnabled(false);
                                this.getView().byId("SC_idBump").setEnabled(false);

                                MessageToast.show("Grading is Completed for this Salesorder and No further changes can be done");
                            } else {
                                this.getView().byId("SC_idFinish").setSelected(false);
                                // this.getView().byId("idFinish").setEnabled(true);
                                this.getView().byId("idExit").setEnabled(true);
                                this.getView().byId("SC_idPrevious").setEnabled(true);
                                this.getView().byId("SC_idNext").setEnabled(true);
                                this.getView().byId("SC_idInputCollId").setEnabled(true);
                                this.getView().byId("SC_idGrade").setEnabled(true);
                                /* this.getView().byId("SC_idCenter").setEnabled(true);
                                this.getView().byId("SC_idCorner").setEnabled(true);
                                this.getView().byId("SC_idEdge").setEnabled(true);
                                this.getView().byId("SC_idSurface").setEnabled(true); */
                                this.getView().byId("SC_idAutoGrade").setEnabled(true);
                                this.getView().byId("SC_idNoGrade").setEnabled(true);
                                this.getView().byId("SC_idBump").setEnabled(true);
                                //this.getView().byId("SC_idPerChk").setEnabled(true);
                            }
                            if (oData.results[0].Nograde !== "") {
                                //this.getView().byId("SC_idPerChk").setSelected(false);
                                this.getView().byId("SC_idGrade").setEnabled(false);
                                /* this.getView().byId("SC_idCenter").setEnabled(false);
                                this.getView().byId("SC_idCorner").setEnabled(false);
                                this.getView().byId("SC_idEdge").setEnabled(false);
                                this.getView().byId("SC_idSurface").setEnabled(false); */
                                this.getView().byId("SC_idAutoGrade").setEnabled(false);
                                //this.getView().byId("SC_idPerChk").setEnabled(false);
                            }
                            if (oData.results[0].Nograde === "") {
                                this.getView().byId("SC_idGrade").setEnabled(true);
                                /* this.getView().byId("SC_idCenter").setEnabled(true);
                                this.getView().byId("SC_idCorner").setEnabled(true);
                                this.getView().byId("SC_idEdge").setEnabled(true);
                                this.getView().byId("SC_idSurface").setEnabled(true); */
                                this.getView().byId("SC_idAutoGrade").setEnabled(true);
                                //this.getView().byId("SC_idPerChk").setEnabled(true);
                            }
                            this.setSaveNxtPreDisabled(oData.results[0]);
                        } else {
                            this.getView().byId("SC_idFinish").setSelected(false);
                            // this.getView().byId("idFinish").setEnabled(true);
                            this.getView().byId("idExit").setEnabled(true);
                            this.getView().byId("SC_idPrevious").setEnabled(true);
                            this.getView().byId("SC_idNext").setEnabled(true);
                            this.getView().byId("SC_idInputCollId").setEnabled(true);
                            this.getView().byId("SC_idGrade").setEnabled(true);
                            /* this.getView().byId("SC_idCenter").setEnabled(true);
                            this.getView().byId("SC_idCorner").setEnabled(true);
                            this.getView().byId("SC_idEdge").setEnabled(true);
                            this.getView().byId("SC_idSurface").setEnabled(true); */
                            this.getView().byId("SC_idAutoGrade").setEnabled(true);
                            this.getView().byId("SC_idNoGrade").setEnabled(true);
                            this.getView().byId("SC_idBump").setEnabled(true);
                            //this.getView().byId("SC_idPerChk").setEnabled(true);
                        }
                        this.getView().getModel("SC_GradHistModel").setData(oData.results);
                        this.getView().getModel("SC_GradHistModel").refresh();

                    }.bind(this),

                    error: function () {
                        MessageToast.show("Error in Loading Grading History Data, Please Contact Technical Team");

                    }
                });

                // OData Call to get year dropdown data

                this.oModel_SC.read("/getYearDropdownSet", {
                    // filters: filter,
                    success: function (oData, oResponse) {
                        tableModel.setData(oData);
                        this.getView().getModel("SC_YearModel").setData(oData.results);
                        this.getView().getModel("SC_YearModel").refresh();
                    }.bind(this),

                    error: function () {
                        // MessageToast.show("Failed");
                    }
                });

                // OData Call to get Collectible Search help fragment data

                // this.oModel_SC.read("/ZmmSearchHelpSet", {
                // 	// filters: filter,
                // 	success: function (oData, oResponse) {
                // 		tableModel.setData(oData);
                // 		this.getView().getModel("CollectibleModel").setData(oData.results);
                // 		this.getView().getModel("CollectibleModel").refresh();
                // 	}.bind(this),

                // 	error: function () {
                // 		// MessageToast.show("Failed");
                // 	}
                // });

                var lfilter = [
                    new sap.ui.model.Filter("Vbeln", sap.ui.model.FilterOperator.EQ, this.SalesId),
                    new sap.ui.model.Filter("Posnr", sap.ui.model.FilterOperator.EQ, this.LineId),
                    new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, "M")
                ];

                // OData Call to get Missed Grading Data

                this.oModel_SC.read("/getInitialLineItemsSet", {
                    filters: lfilter,
                    success: function (oData, oResponse) {
                        tableModel.setData(oData);
                        if (oData.results.length !== 0) {
                            var nCnt = oData.results[0].ExCount;
                            var tCnt = oData.results.length;
                            var Labl = "Missed Gradings";
                            var result = Labl.concat("(", nCnt, "/", tCnt, ")");
                            this.getView().byId("SC_idMsdGradTab").setText(result);
                            oData.results.sort(function(a, b){return a.Posnr-b.Posnr});
                        }
                        this.getView().getModel("SC_InitModel").setData(oData.results);
                        this.getView().getModel("SC_InitModel").refresh();


                    }.bind(this),
                    error: function () {
                        // MessageToast.show("Failed");

                    }
                });

                var filterg = [
                    new sap.ui.model.Filter("Vbeln", sap.ui.model.FilterOperator.EQ, this.SalesId),
                    new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, "P")
                ];

                this.oModel_SC.read("/getInitialLineItemsSet", {
                    filters: filterg,
                    success: function (oData, oResponse) {
                        tableModel.setData(oData);
                        this.getView().getModel("SC_pInitModel").setData(oData.results);
                        this.getView().getModel("SC_pInitModel").refresh();
                    }.bind(this),
                    error: function () {
                        // MessageToast.show("Failed");
                    }
                });
                //sap.ui.core.BusyIndicator.hide();

            },
            SC_getImage : function(){

                var SaleItem;
                this.oLineID = this.getView().byId("idLineItem").getValue();

                 // OData Call to get Image URL
                 

                 if(this.LineId.length == "1"){
                    SaleItem  = this.oSalesID + "00" + this.oLineID;
                }else if(this.LineId.length == "2"){
                    SaleItem  = this.oSalesID + "0" + this.oLineID;
                }else{
                    SaleItem  = this.oSalesID + this.oLineID;
                }
                
                var imgfilter = [
                    new sap.ui.model.Filter("CertType", sap.ui.model.FilterOperator.EQ, "CARDS"),
                    new sap.ui.model.Filter("CertId", sap.ui.model.FilterOperator.EQ, SaleItem),
                    
                ];

                var that = this;
                this.oModel_SC.read("/Image_displaySet", {
                    filters: imgfilter,
                    success: function (oData, oResponse) {
                        if (oData.results.length !== 0) {
                        if ((oData.results[0].FrontUrl !== "proxy not triggered") && (oData.results[0].FrontUrl !== " ")) {
                            this.getView().byId("SC_idFrontUrl").setSrc(oData.results[0].FrontUrl);
                            this.getView().byId("SC_idBackUrl").setSrc(oData.results[0].BackUrl);
                        } else {
                            // imageflag = sap.ui.require.toUrl("CCGSDGRADINGAPP.ZSD_GRADINGAPP.controller.grading/Image/No_image.png");
                            that.getView().byId("SC_idFrontUrl").setSrc("/sap/bc/ui5_ui5/sap/ZSD_GRADINGAPP/Image/No_image.png");
                            that.getView().byId("SC_idBackUrl").setSrc("/sap/bc/ui5_ui5/sap/ZSD_GRADINGAPP/Image/No_image.png");
                        }
                    }else{
                        that.getView().byId("SC_idFrontUrl").setSrc("");
                        that.getView().byId("SC_idBackUrl").setSrc("");
                    }
                        // this.getView().getModel("SC_ImageModel").setData(oData.results);
                        // this.getView().getModel("SC_ImageModel").refresh();
                    }.bind(this),

                    error: function () {

                        // imageflag = sap.ui.require.toUrl("CCGSDGRADINGAPP.ZSD_GRADINGAPP.controller.grading/Image/No_image.png");
                        that.getView().byId("SC_idFrontUrl").setSrc("/sap/bc/ui5_ui5/sap/ZSD_GRADINGAPP/Image/No_image.png");
                        that.getView().byId("SC_idBackUrl").setSrc("/sap/bc/ui5_ui5/sap/ZSD_GRADINGAPP/Image/No_image.png");
                    }

                });

            },
            setSCGradingValues : function(odata){



                
                var SC_AutoGradeModel = [];
                var SC_NoGradeModel = [];
                var SC_CCES = [];

                odata.forEach(function(value){

                    if(value.ImFlag == "C"){

                        SC_CCES.push(value);

                    }else if(value.ImFlag == "N"){

                        SC_NoGradeModel.push(value);

                    }else if(value.ImFlag == "A"){

                        SC_AutoGradeModel.push(value);

                    }
                });

                SC_AutoGradeModel.sort(function(a, b){return b.CharValue-a.CharValue});
                    
                    this.getView().getModel("SC_CenterModel").setData(SC_CCES);
                    this.getView().getModel("SC_CenterModel").refresh();


                    this.getView().getModel("SC_AutoGradeModel").setData(SC_AutoGradeModel);
                    this.getView().getModel("SC_AutoGradeModel").refresh();

                    this.getView().getModel("SC_NoGradeModel").setData(SC_NoGradeModel);
                    this.getView().getModel("SC_NoGradeModel").refresh();

                    this.getView().getModel("SC_SurfaceModel").setData(SC_CCES);
                    this.getView().getModel("SC_SurfaceModel").refresh();

                    this.getView().getModel("SC_CornerModel").setData(SC_CCES);
                    this.getView().getModel("SC_CornerModel").refresh();

                    this.getView().getModel("SC_EdgeModel").setData(SC_CCES);
                    this.getView().getModel("SC_EdgeModel").refresh();



            },
            SC_onExitCust: function (oEvent) {
                var that = this;
                //that.onSave();

                this.getView().byId("SC_idSportsCard").setValue(" ");
                this.getView().byId("SC_idInputManuf").setValue(" ");
                this.getView().byId("SC_idSetCode").setValue(" ");
                this.getView().byId("SC_idPlayer").setValue(" ");
                this.getView().byId("SC_idSubset").setValue(" ");
                this.getView().byId("SC_idInputCardNo").setValue(" ");
                this.getView().byId("SC_idInputNota").setValue(" ");
                this.getView().byId("SC_idInputPedig").setValue(" ");
                this.getView().byId("SC_idInputCollId").setValue(" ");
                // this.getView().byId("idInputAuto").setValue(" ");
                this.getView().byId("SC_idBump").setSelectedKey("");
                this.getView().byId("SC_idInputYear").setValue(" ");
                this.getView().byId("SC_idInputAttr1").setValue(" ");
                this.getView().byId("SC_idInputAttr2").setValue(" ");
                //this.getView().byId("SC_idPerChk").setSelected(false);
                this.getView().byId("SC_idFinish").setSelected(false);
                // this.getView().byId("idTxtSports").setText(" ");
                // this.getView().byId("idTxtMake").setText(" ");
                // this.getView().byId("idTxtSet").setText(" ");
                // this.getView().byId("idTxtSubset").setText(" ");
                this.getView().byId("SC_idCrossOver").setValue(" ");

                this.getView().getModel("SC_InitModel").refresh();

                 var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
                oCrossAppNavigator.toExternal({
                    target: { semanticObject: "#" }
                });
                // window.location.reload();

                /* var oHistory, sPreviousHash;
                oHistory = History.getInstance();
                sPreviousHash = oHistory.getPreviousHash();
                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    window.history.go(-1);
                } */
            },
            SC_onCancel: function (oEvent) {
                // var that = this. 
                this.getView().byId("SC_idSportsCard").setValue(" ");
                this.getView().byId("SC_idInputManuf").setValue(" ");
                this.getView().byId("SC_idSetCode").setValue(" ");
                this.getView().byId("SC_idPlayer").setValue(" ");
                this.getView().byId("SC_idSubset").setValue(" ");
                this.getView().byId("SC_idInputCardNo").setValue(" ");
                this.getView().byId("SC_idInputNota").setValue(" ");
                this.getView().byId("SC_idInputPedig").setValue(" ");
                this.getView().byId("SC_idInputCollId").setValue(" ");
                // this.getView().byId("idInputAuto").setValue(" ");
                this.getView().byId("SC_idBump").setSelectedKey("");
                this.getView().byId("SC_idInputYear").setValue(" ");
                this.getView().byId("SC_idInputAttr1").setValue(" ");
                this.getView().byId("SC_idInputAttr2").setValue(" ");
                //this.getView().byId("SC_idPerChk").setSelected(false);
                this.getView().byId("SC_idFinish").setSelected(false);
                // this.getView().byId("idTxtSports").setText(" ");
                // this.getView().byId("idTxtMake").setText(" ");
                // this.getView().byId("idTxtSet").setText(" ");
                // this.getView().byId("idTxtSubset").setText(" ");
                this.getView().byId("SC_idCrossOver").setValue(" ");

                this.getView().getModel("SC_MaraDataModel").refresh();
                this.getView().getModel("SC_GradHistModel").refresh();
                this.getView().getModel("SC_CollectibleModel").refresh();
                this.getView().getModel("SC_ImageModel").refresh();

                // window.location.reload();
            },
            SC_onPrintLabel: function (oEvent) {

                var l_coll = this.getView().byId("SC_idInputCollId").getValue();

                if (l_coll === "") {
                    MessageBox.error("Collectible ID is missing, cannot Print Preview");
                }

                if (l_coll !== "") {
                    var dialog = new sap.m.BusyDialog({
                        text: "Please wait.. PDF Preview is getting Generated"
                    });

                    dialog.open();

                    var sServiceURL = this.getView().getModel().sServiceUrl;
                    var sSource = sServiceURL + "/FILE_PDFDISPLAYSet(Vbeln='" + this.SalesId + "',Posnr='" + this.oLineID + "',Box='NO')/$value";
                    dialog.close();
                    window.open(sSource);

                }
            },
            onPrintLabel : function(){

                var l_coll = this.getView().byId("idMatnr").getValue();

                if (l_coll === "") {
                    MessageBox.error("Collectible ID is missing, cannot Print Preview");
                }

                if (l_coll !== "") {
                    var dialog = new sap.m.BusyDialog({
                        text: "Please wait.. PDF Preview is getting Generated"
                    });

                    dialog.open();

                    var sServiceURL = this.getView().getModel().sServiceUrl;
                    var sSource = sServiceURL + "/FILE_PDFDISPLAYSet(Vbeln='" + this.SalesId + "',Posnr='" + this.oLineID + "',Box='NO')/$value";
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
            SC_onNext: function (event) {

                this.DisplayScreenFlag = "";
                this.LineId = this.getView().byId("idLineItem").getValue();
                this.SalesOrderNumber = this.getView().byId("idSalesOrder").getValue();

                // Save the screen values before navigating to next lineitem

                var that = this;
                //Validation: If factory autograph is checked then auto grade is mandatory before saving
                var lvauto = this.getView().byId("SC_idAutoGrade").getSelectedKey();
                var lvnograd = this.getView().byId("SC_idNoGrade").getSelectedKey();

                if ((this.getView().byId("SC_idInputAuto").getSelected() === true) && (lvnograd === "")) {

                    if (lvauto === "") {
                        MessageBox.error("Autograph Grade is Mandatory");
                    } else {
                        that.onSave();
                    }
                } else {
                    that.onSave();
                }

            },
            SC_onPrevious: function (event) {
                // Save the screen values before navigating to previous lineitem
                var that = this;
                this.DisplayScreenFlag = "";
                //Validation: If factory autograph is checked then auto grade is mandatory before saving
                var lvauto = this.getView().byId("SC_idAutoGrade").getSelectedKey();
                var lvnograd = this.getView().byId("SC_idNoGrade").getSelectedKey();
                this.LineId = this.getView().byId("idLineItem").getValue();
                this.SalesOrderNumber = this.getView().byId("idSalesOrder").getValue();

                if ((this.getView().byId("SC_idInputAuto").getSelected() === true) && (lvnograd === " ")) {

                    if (lvauto === "") {
                        MessageBox.error("Autograph Grade is Mandatory");
                    } else {
                        that.onSavep();
                    }
                } else {
                    that.onSavep();
                }
            },
            onSave: function (oEvent) {

                var lgrade;
                var lcenter;
                var lcorner;
                var ledge;
                var lsurface;
                var lauto;
                var lnoGrade;
                var lperfect;
                var lv_Pristine;
                this.ButtonType = "N";
                var headerData = this.getView().getModel("SC_MaraDataModel").getData();

                /* // Functionality: if Grading Complete is checked on screen, that should be the last grading option given against that sales order
                if (this.getView().byId("SC_idFinish").getSelected() === true) {
                    var Lfinish = "X";
                } else {
                    Lfinish = "Y";
                }

                // Functionality: if Perfect-10 is checked on screen, all the grading values should be passed as '10' char value
                //                if Perfect-10 is not checked, whatever the grade values selected should be saved
                

                    this.GradeChek_SC = this.getView().byId("SC_idGrade").getSelectedKey();
                    lgrade         = this.getView().byId("SC_idGrade").getValue();
                
                if ((this.GradeChek_SC == "PRISTINE") || (this.GradeChek_SC == "PERFECT")) {


                    if (this.GradeChek_SC == "PERFECT") {
                        lcenter = "10";
                        lcorner = "10";
                        ledge = "10";
                        lsurface = "10";
                        lgrade = "10";
                        lperfect = "X";
                        lv_Pristine = "";
                    } else if (this.GradeChek_SC == "PRISTINE") {
                        lgrade = "10";
                        lv_Pristine = "X";
                        lperfect = "";
                    }

                    lauto = this.getView().byId("SC_idAutoGrade").getSelectedKey();
                    lnoGrade = this.getView().byId("SC_idNoGrade").getSelectedKey();
                } else {
                    lperfect = " ";
                    lv_Pristine = "";
                    
                    lcenter = "";
                    lcorner = "";
                    ledge = "";
                    lsurface = "";
                    lauto = this.getView().byId("SC_idAutoGrade").getSelectedKey();
                    lnoGrade = this.getView().byId("SC_idNoGrade").getSelectedKey();
                }

                var lNoGrade1 = this.getView().byId("SC_idNoGrade").getSelectedKey();
                if (lNoGrade1 !== "") {
                    lgrade = "";
                    lcenter = "";
                    lcorner = "";
                    ledge = "";
                    lsurface = "";
                    lperfect = "";
                    lv_Pristine = "";
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
                    Pristine10: lv_Pristine,
                    Pedigree: headerData.Pedigree,
                    InternalNote: headerData.InternalNote,
                    Notation: headerData.Notation
                };
                histHeadArr.push(histHead);


               
                var that = this;
                var SC_oDataModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZODATA_CHARACTERISTCS_GRADEAPP_SRV/");
                
                SC_oDataModel.create("/Grade_gradehistorySet", histHead, {
                    method: "POST",
                    success: function (message) {
                        // that.onMaraCreatecall();
                        //that.SC_onGetGradeHistcall();
                        // var text = message.MESSAGE;
                        MessageToast.show("Grading Data Saved Succesfully");
                    },

                    error: function (oError) {

                        // alert("Create Operation failed : " + oError);
                    }
                }); */

                // Functionality: if Perfect-10 is checked on screen, all the grading values should be passed as '10' char value
                //                if Perfect-10 is not checked, whatever the grade values selected should be saved
                

                    this.GradeChek_SC = this.getView().byId("SC_idGrade").getSelectedKey();
                    lgrade            = this.getView().byId("SC_idGrade").getValue();
                
                if ((this.GradeChek_SC == "PRISTINE") || (this.GradeChek_SC == "PERFECT")) {
                    if (this.GradeChek_SC == "PERFECT") {
                        lgrade = "10";
                        lcenter = "10";
                        lcorner = "10";
                        ledge = "10";
                        lsurface = "10";
                        lperfect = "X";
                    } else if (this.GradeChek_SC == "PRISTINE") {
                        lgrade = "10";
                        lcenter = "";
                        lcorner = "";
                        ledge = "";
                        lsurface = "";
                        lperfect = "";
                        lv_Pristine = "X";
                    }


                    lauto = this.getView().byId("SC_idAutoGrade").getSelectedKey();
                    lnoGrade = this.getView().byId("SC_idNoGrade").getSelectedKey();
                } else {
                    lperfect = " ";
                    
                    lcenter = " ";
                    lcorner = " ";
                    ledge = " ";
                    lsurface = " ";
                    lauto = this.getView().byId("SC_idAutoGrade").getSelectedKey();
                    lnoGrade = this.getView().byId("SC_idNoGrade").getSelectedKey();
                }

                //var lNoGrade1 = this.getView().byId("SC_idNoGrade").getSelectedKey();
                //if (lNoGrade1 !== "") {
                //    lgrade = "";
                //   lcenter = "";
                //    lcorner = "";
                //    ledge = "";
                //    lsurface = "";
                //    lperfect = "";
                //    lauto = "";
                //}

                // var lsports = this.getView().byId("idTxtSports").getText();
                // var lsetcode = this.getView().byId("idTxtSet").getText();
                // var lsubset = this.getView().byId("idTxtSubset").getText();
                // var lplayer = this.getView().byId("idPlayer").getText();
                var lbump = this.getView().byId("SC_idBump").getSelectedKey();

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
                    ZTeamDescription: headerData.ZTeamDescription,
                    ZDateFreetext: headerData.ZDateFreetext,
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

                var SC_oDataModelS = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZODATA_CHARACTERISTCS_GRADENEW_SRV/");
                var that = this;
                SC_oDataModelS.create("/Grade_MARADATASet", maraHead, {
                    method: "POST",
                    success: function (message) {
                        // sap.ui.core.BusyIndicator.show();
                        //that.onGetMaraDatacall();
                        //that.SC_onMissedCall();
                        if(message.ImFlag == "E"){
                            MessageBox.error("Collectable ID is In-active");

                        }else{

                        that.SaveGradeHistoryData().then(function(oEvent){

                        

                        var text = message.MESSAGE;
                        MessageToast.show("Data Saved Succesfully");
                        that.getNextLineItem("N")
                            .then(function (oApp) {
                                that.onFetchDetailsValidate(oApp);

                            }, true);
                        });
                    }
                    },
                    error: function (oError) {

                        MessageToast.show("Failed to save Data");
                        // alert("Create Operation failed : " + oError);
                    }
                });

            },
            SaveGradeHistoryData : function(){

                return new Promise(function (resolve, reject) {

                var lgrade;
                var lcenter;
                var lcorner;
                var ledge;
                var lsurface;
                var lauto;
                var lnoGrade;
                var lperfect;
                var lv_Pristine;
                
                var headerData = this.getView().getModel("SC_MaraDataModel").getData();

                // Functionality: if Grading Complete is checked on screen, that should be the last grading option given against that sales order
                if (this.getView().byId("SC_idFinish").getSelected() === true) {
                    var Lfinish = "X";
                } else {
                    Lfinish = "Y";
                }

                // Functionality: if Perfect-10 is checked on screen, all the grading values should be passed as '10' char value
                //                if Perfect-10 is not checked, whatever the grade values selected should be saved
                

                    this.GradeChek_SC = this.getView().byId("SC_idGrade").getSelectedKey();
                    lgrade         = this.getView().byId("SC_idGrade").getValue();
                
                if ((this.GradeChek_SC == "PRISTINE") || (this.GradeChek_SC == "PERFECT")) {


                    if (this.GradeChek_SC == "PERFECT") {
                        lcenter = "10";
                        lcorner = "10";
                        ledge = "10";
                        lsurface = "10";
                        lgrade = "10";
                        lperfect = "X";
                        lv_Pristine = "";
                    } else if (this.GradeChek_SC == "PRISTINE") {
                        lgrade = "10";
                        lv_Pristine = "X";
                        lperfect = "";
                    }

                    lauto = this.getView().byId("SC_idAutoGrade").getSelectedKey();
                    lnoGrade = this.getView().byId("SC_idNoGrade").getSelectedKey();
                } else {
                    lperfect = " ";
                    lv_Pristine = "";
                    
                    lcenter = "";
                    lcorner = "";
                    ledge = "";
                    lsurface = "";
                    lauto = this.getView().byId("SC_idAutoGrade").getSelectedKey();
                    lnoGrade = this.getView().byId("SC_idNoGrade").getSelectedKey();
                }

                var lNoGrade1 = this.getView().byId("SC_idNoGrade").getSelectedKey();
                if (lNoGrade1 !== "") {
                    lgrade = "";
                    lcenter = "";
                    lcorner = "";
                    ledge = "";
                    lsurface = "";
                    lperfect = "";
                    lv_Pristine = "";
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
                    Pristine10: lv_Pristine,
                    Pedigree: headerData.Pedigree,
                    InternalNote: headerData.InternalNote,
                    Notation: headerData.Notation
                };
                histHeadArr.push(histHead);


               
                var that = this;
                var SC_oDataModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZODATA_CHARACTERISTCS_GRADENEW_SRV/");
                
                SC_oDataModel.create("/Grade_gradehistorySet", histHead, {
                    method: "POST",
                    success: function (message) {
                        // that.onMaraCreatecall();
                        //that.SC_onGetGradeHistcall();
                        // var text = message.MESSAGE;
                        MessageToast.show("Grading Data Saved Succesfully");
                        resolve();
                    },

                    error: function (oError) {

                        resolve();

                        // alert("Create Operation failed : " + oError);
                    }
                });


               }.bind(this));

            },

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
                var lv_Pristine;
                this.ButtonType = "P";
                var headerData = this.getView().getModel("SC_MaraDataModel").getData();

                /* // Functionality: if Grading Complete is checked on screen, that should be the last grading option given against that sales order
                if (this.getView().byId("SC_idFinish").getSelected() == true) {
                    var Lfinish = "X";
                } else {
                    Lfinish = "Y";
                }

                // Functionality: if Perfect-10 is checked on screen, all the grading values should be passed as '10' char value
                //                if Perfect-10 is not checked, whatever the grade values selected should be saved
                

                    this.GradeChek_SC = this.getView().byId("SC_idGrade").getSelectedKey();
                    lgrade            = this.getView().byId("SC_idGrade").getValue();
                
                if ((this.GradeChek_SC == "PRISTINE") || (this.GradeChek_SC == "PERFECT")) {


                    if (this.GradeChek_SC == "PERFECT") {
                        lgrade = "10";
                        lcenter = "10";
                        lcorner = "10";
                        ledge = "10";
                        lsurface = "10";
                        lperfect = "X";
                        lv_Pristine = "";
                    } else if (this.GradeChek_SC == "PRISTINE") {
                        lgrade = "10";
                        lcenter = "";
                        lcorner = "";
                        ledge = "";
                        lsurface = "";
                        lv_Pristine = "X";
                        lperfect = "";
                    }
                    lauto = this.getView().byId("SC_idAutoGrade").getSelectedKey();
                    lnoGrade = this.getView().byId("SC_idNoGrade").getSelectedKey();
                } else {
                    lperfect = " ";
                    lv_Pristine = "";
                    
                    // lcenter = this.getView().byId("SC_idCenter").getSelectedKey();
                    // lcorner = this.getView().byId("SC_idCorner").getSelectedKey();
                    // ledge = this.getView().byId("SC_idEdge").getSelectedKey();
                    // lsurface = this.getView().byId("SC_idSurface").getSelectedKey();
                    lauto = this.getView().byId("SC_idAutoGrade").getSelectedKey();
                    lnoGrade = this.getView().byId("SC_idNoGrade").getSelectedKey();
                }


                var lNoGrade1 = this.getView().byId("SC_idNoGrade").getSelectedKey();
                if (lNoGrade1 !== "") {
                    lgrade = "";
                    lcenter = "";
                    lcorner = "";
                    ledge = "";
                    lsurface = "";
                    lperfect = "";
                    lv_Pristine = "";
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
                    Pristine10: lv_Pristine,
                    Pedigree: headerData.Pedigree,
                    InternalNote: headerData.InternalNote,
                    Notation: headerData.Notation
                };
                histHeadArr.push(histHead);

                sap.ui.core.BusyIndicator.show();

                var that = this;
                var SC_oDataModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZODATA_CHARACTERISTCS_GRADEAPP_SRV/");
                SC_oDataModel.create("/Grade_gradehistorySet", histHead, {
                    method: "POST",
                    success: function (message) {
                        // that.onMaraCreatecallp();
                        //that.SC_onGetGradeHistcallp();
                        var text = message.MESSAGE;
                        MessageToast.show("Grading Data Saved Succesfully");

                    },

                    error: function (oError) {
                        // alert("Create Operation failed : " + oError);
                    }
                }); */

                // Functionality: if Perfect-10 is checked on screen, all the grading values should be passed as '10' char value
                //                if Perfect-10 is not checked, whatever the grade values selected should be saved
                if (this.GradeChek_SC == "PERFECT") {
                    lgrade = "10";
                    lcenter = "10";
                    lcorner = "10";
                    ledge = "10";
                    lsurface = "10";
                    lperfect = "X";
                    lauto = this.getView().byId("SC_idAutoGrade").getSelectedKey();
                    lnoGrade = this.getView().byId("SC_idNoGrade").getSelectedKey();
                } else {
                    lperfect = " ";
                    lgrade = this.GradeChek_SC;
                    /* lcenter = this.getView().byId("SC_idCenter").getSelectedKey();
                    lcorner = this.getView().byId("SC_idCorner").getSelectedKey();
                    ledge = this.getView().byId("SC_idEdge").getSelectedKey();
                    lsurface = this.getView().byId("SC_idSurface").getSelectedKey(); */
                    lauto = this.getView().byId("SC_idAutoGrade").getSelectedKey();
                    lnoGrade = this.getView().byId("SC_idNoGrade").getSelectedKey();
                }

                var lNoGrade1 = this.getView().byId("SC_idNoGrade").getSelectedKey();
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
                var lbump = this.getView().byId("SC_idBump").getSelectedKey();

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

                var SC_oDataModelS = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZODATA_CHARACTERISTCS_GRADENEW_SRV/");
                var that = this;
                SC_oDataModelS.create("/Grade_MARADATASet", maraHead, {
                    method: "POST",
                    success: function (message) {
                        //sap.ui.core.BusyIndicator.show();
                        //that.onGetMaraDatacallp();
                        //that.SC_onMissedCall();
                        // sap.ui.core.BusyIndicator.hide();
                        if(message.ImFlag == "E"){
                            MessageBox.error("Collectable ID is In-active");

                        }else{
                        that.SaveGradeHistoryData().then(function(oEvent){
                        var text = message.MESSAGE;
                        MessageToast.show("Data Saved Succesfully");

                        that.getNextLineItem("P")
                            .then(function (oApp) {
                                that.onFetchDetailsValidate(oApp);

                            }, true);
                        });
                    }

                    },
                    error: function (oError) {
                        // alert("Create Operation failed : " + oError);
                    }
                });

            },
            onGetMaraDatacallp: function (oEvent) {

                
                var tableModeln = new sap.ui.model.json.JSONModel();
                var tableModel = new sap.ui.model.json.JSONModel();

                var oModeln = this.getOwnerComponent().getModel("SC");
                var oModel = this.getOwnerComponent().getModel("SC");

                var InitData = this.getView().getModel("SC_pInitModel").getData();
                var chk = " ";

                // Check if Previous Line item is available, if not pop-up information
                if (this.LineId == InitData[0].Posnr) {
                    chk = "X";
                    //MessageBox.information("No Previous Lineitems to Grade");
                }

                // If Previous Lineitem is available, load the characteristic values of previous Lineitem
                if (chk !== "X") {
                    this.getView().byId("SC_idSportsCard").setValue(" ");
                    this.getView().byId("SC_idInputManuf").setValue(" ");
                    this.getView().byId("SC_idSetCode").setValue(" ");
                    this.getView().byId("SC_idPlayer").setValue(" ");
                    this.getView().byId("SC_idSubset").setValue(" ");
                    this.getView().byId("SC_idInputCardNo").setValue(" ");
                    this.getView().byId("SC_idInputNota").setValue(" ");
                    this.getView().byId("SC_idInputPedig").setValue(" ");
                    this.getView().byId("SC_idInputCollId").setValue(" ");
                    // this.getView().byId("idInputAuto").setSelected(false);
                    this.getView().byId("SC_idBump").setSelectedKey("");
                    this.getView().byId("SC_idInputYear").setValue(" ");
                    this.getView().byId("SC_idInputAttr1").setValue(" ");
                    this.getView().byId("SC_idInputAttr2").setValue(" ");
                    // this.getView().byId("idPerChk").setSelected(false);
                    this.getView().byId("SC_idCrossOver").setValue(" ");
                    this.getView().byId("SC_idGrade").setEnabled(true);
                    /* this.getView().byId("SC_idCenter").setEnabled(true);
                    this.getView().byId("SC_idCorner").setEnabled(true);
                    this.getView().byId("SC_idEdge").setEnabled(true);
                    this.getView().byId("SC_idSurface").setEnabled(true); */
                    this.getView().byId("SC_idAutoGrade").setEnabled(true);
                    this.getView().byId("SC_idNoGrade").setEnabled(true);
                    // this.getView().byId("idPerChk").setEnabled(true);

                }
                
                // Start of SetMara Details..........
                this.SC_onGetGradeHistcallp();
                if(this.oDataMaradata){


                    
                        


                    
                    if (this.oDataMaradata.length !== 0) {

                        this.Collid = this.oDataMaradata[0].CollectibleId;
                        this.VcScCrossover = " ";
                        this.VcScCrossover = this.oDataMaradata[0].VcScCrossover;

                        if (this.oDataMaradata[0].ZThickHolderFlag === "X") {
                            this.getView().byId("SC_idTH").setSelected(true);
                        } else {
                            this.getView().byId("SC_idTH").setSelected(false);
                        }
                        if (this.oDataMaradata[0].FactoryAutograph === "X") {
                            this.getView().byId("SC_idInputAuto").setSelected(true);
                        } else {
                            this.getView().byId("SC_idInputAuto").setSelected(false);
                        }
                        if (this.oDataMaradata[0].NoGrade !== "") {
                            
                            this.getView().byId("SC_idGrade").setEnabled(false);
                            
                            this.getView().byId("SC_idAutoGrade").setEnabled(false);
                            
                        }
                        if (this.oDataMaradata[0].NoGrade === "") {
                            this.getView().byId("SC_idGrade").setEnabled(true);
                           
                            this.getView().byId("SC_idAutoGrade").setEnabled(true);
                           
                        }
                    }

                    this.getView().getModel("SC_MaraDataModel").setData(this.oDataMaradata[0]);
                    this.getView().getModel("SC_MaraDataModel").refresh();



                }

                // End of SetMaraDetails...............


                // OData Call to get characteristic values of entire grading app 				
               /*  var Nfilter = [
                    new sap.ui.model.Filter("LvVbeln", sap.ui.model.FilterOperator.EQ, this.SalesId),
                    new sap.ui.model.Filter("LvPosnr", sap.ui.model.FilterOperator.EQ, this.LineId),
                    new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, "P")
                ];

                oModeln.read("/Grade_MARADATASet", {
                    filters: Nfilter,
                    success: function (oData, oResponse) {
                        
                        this.SC_onGetGradeHistcallp();
                        if (oData.results.length !== 0) {
                            this.Collid = oData.results[0].CollectibleId;
                            this.VcScCrossover = " ";
                            this.VcScCrossover = oData.results[0].VcScCrossover;


                        }
                        if (oData.results.length !== 0) {
                            if (oData.results[0].ZThickHolderFlag === "X") {
                                this.getView().byId("SC_idTH").setSelected(true);
                            } else {
                                this.getView().byId("SC_idTH").setSelected(false);
                            }
                            if (oData.results[0].FactoryAutograph === "X") {
                                this.getView().byId("SC_idInputAuto").setSelected(true);
                            } else {
                                this.getView().byId("SC_idInputAuto").setSelected(false);
                            }
                            if (oData.results[0].NoGrade !== "") {
                                
                                this.getView().byId("SC_idGrade").setEnabled(false);
                                
                                this.getView().byId("SC_idAutoGrade").setEnabled(false);
                                
                            }
                            if (oData.results[0].NoGrade === "") {
                                this.getView().byId("SC_idGrade").setEnabled(true);
                               
                                this.getView().byId("SC_idAutoGrade").setEnabled(true);
                               
                            }
                        }
                        this.getView().getModel("SC_MaraDataModel").setData(oData.results[0]);
                        this.getView().getModel("SC_MaraDataModel").refresh();
                    }.bind(this),

                    error: function () {
                        // MessageToast.show("Failed");
                    }
                }); */





                // OData Call to get Image URL
                this.SC_getImage();
                /* var SaleItem  = this.oSalesID + this.oLineID;
                var imgfilter = [
                    new sap.ui.model.Filter("CertType", sap.ui.model.FilterOperator.EQ, "CARDS"),
                    new sap.ui.model.Filter("CertId", sap.ui.model.FilterOperator.EQ, SaleItem),
                    
                ];

                var that = this;
                oModel.read("/Image_displaySet", {
                    filters: imgfilter,
                    success: function (oData, oResponse) {
                        tableModel.setData(oData);
                        if (oData.results[0].FrontUrl !== "proxy not triggered") {
                            this.getView().byId("SC_idFrontUrl").setSrc(oData.results[0].FrontUrl);
                            this.getView().byId("SC_idBackUrl").setSrc(oData.results[0].BackUrl);
                        } else {
                            // imageflag = sap.ui.require.toUrl("CCGSDGRADINGAPP.ZSD_GRADINGAPP.controller.grading/Image/No_image.png");
                            that.getView().byId("SC_idFrontUrl").setSrc("/sap/bc/ui5_ui5/sap/ZSD_GRADINGAPP/Image/No_image.png");
                            that.getView().byId("SC_idBackUrl").setSrc("/sap/bc/ui5_ui5/sap/ZSD_GRADINGAPP/Image/No_image.png");
                        }
                        // this.getView().getModel("ImageModel").setData(oData.results);
                        // this.getView().getModel("ImageModel").refresh();
                    }.bind(this),

                    error: function () {

                        // imageflag = sap.ui.require.toUrl("CCGSDGRADINGAPP.ZSD_GRADINGAPP.controller.grading/Image/No_image.png");
                        that.getView().byId("SC_idFrontUrl").setSrc("/sap/bc/ui5_ui5/sap/ZSD_GRADINGAPP/Image/No_image.png");
                        that.getView().byId("SC_idBackUrl").setSrc("/sap/bc/ui5_ui5/sap/ZSD_GRADINGAPP/Image/No_image.png");
                    }

                }); */

                // 	}.bind(this),

                // 	error: function () {
                // 		// MessageToast.show("Failed");
                // 		// MessageBox.information("No Characteristic Values configured for the given Sales Order");
                // 		// MessageToast.show("Error in Loading Material Master Data, Please Contact Technical Team");
                // 	}
                // });

            },
            onGetMaraDatacall: function (oEvent) {

                
                var InitData = this.getView().getModel("SC_pInitModel").getData();

                var tableModeln = new sap.ui.model.json.JSONModel();
                var tableModel = new sap.ui.model.json.JSONModel();

                var oModeln = this.getOwnerComponent().getModel("SC");
                var oModel = this.getOwnerComponent().getModel("SC");

                var chk = " ";

                // Validation 4 : on click of Next, Popup Information Message when there is no further lineitems for this sales order

                if (this.getView().byId("SC_idFinish").getSelected() === true) {
                    chk = "X";
                }
                if (this.getView().byId("SC_idFinish").getSelected() !== true) {

                    for (var i = 0; i < InitData.length; i++) {

                        if (i == (InitData.length - 1)) {
                            var oGrade = InitData[i];

                            if (this.LineId == oGrade.Posnr) {
                                chk = "X";
                                //MessageBox.information("No further Lineitems to Grade");
                            }
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
                    this.getView().byId("SC_idSportsCard").setValue(" ");
                    this.getView().byId("SC_idInputManuf").setValue(" ");
                    this.getView().byId("SC_idSetCode").setValue(" ");
                    this.getView().byId("SC_idPlayer").setValue(" ");
                    this.getView().byId("SC_idSubset").setValue(" ");
                    this.getView().byId("SC_idInputCardNo").setValue(" ");
                    this.getView().byId("SC_idInputNota").setValue(" ");
                    this.getView().byId("SC_idInputPedig").setValue(" ");
                    this.getView().byId("SC_idInputCollId").setValue(" ");
                    // this.getView().byId("idInputAuto").setSelected(false);
                    this.getView().byId("SC_idBump").setSelectedKey("");
                    this.getView().byId("SC_idInputYear").setValue(" ");
                    this.getView().byId("SC_idInputAttr1").setValue(" ");
                    this.getView().byId("SC_idInputAttr2").setValue(" ");
                    // this.getView().byId("idPerChk").setSelected(false);
                    this.getView().byId("SC_idCrossOver").setValue(" ");
                    this.getView().byId("SC_idGrade").setEnabled(true);
                    /* this.getView().byId("SC_idCenter").setEnabled(true);
                    this.getView().byId("SC_idCorner").setEnabled(true);
                    this.getView().byId("SC_idEdge").setEnabled(true);
                    this.getView().byId("SC_idSurface").setEnabled(true); */
                    this.getView().byId("SC_idAutoGrade").setEnabled(true);
                    this.getView().byId("SC_idNoGrade").setEnabled(true);
                    // this.getView().byId("idPerChk").setEnabled(true);

                }


                // Start of SetMara Details..........
                this.SC_onGetGradeHistcall();
                if(this.oDataMaradata){

                    if (this.oDataMaradata.length !== 0) {

                        this.Collid = this.oDataMaradata[0].CollectibleId;
                        this.VcScCrossover = " ";
                        this.VcScCrossover = this.oDataMaradata[0].VcScCrossover;

                        if (this.oDataMaradata[0].ZThickHolderFlag === "X") {
                            this.getView().byId("SC_idTH").setSelected(true);
                        } else {
                            this.getView().byId("SC_idTH").setSelected(false);
                        }
                        if (this.oDataMaradata[0].FactoryAutograph === "X") {
                            this.getView().byId("SC_idInputAuto").setSelected(true);
                        } else {
                            this.getView().byId("SC_idInputAuto").setSelected(false);
                        }
                        if (this.oDataMaradata[0].NoGrade !== "") {
                            
                            this.getView().byId("SC_idGrade").setEnabled(false);
                            
                            this.getView().byId("SC_idAutoGrade").setEnabled(false);
                            
                        }
                        if (this.oDataMaradata[0].NoGrade === "") {
                            this.getView().byId("SC_idGrade").setEnabled(true);
                           
                            this.getView().byId("SC_idAutoGrade").setEnabled(true);
                           
                        }
                    }

                    this.getView().getModel("SC_MaraDataModel").setData(this.oDataMaradata[0]);
                    this.getView().getModel("SC_MaraDataModel").refresh();



                }

                // End of SetMaraDetails...............

               

               

                // OData Call to get Image URL
                this.SC_getImage();
                /* var SaleItem  = this.oSalesID + this.oLineID;
                var imgfilter = [
                    new sap.ui.model.Filter("CertType", sap.ui.model.FilterOperator.EQ, "CARDS"),
                    new sap.ui.model.Filter("CertId", sap.ui.model.FilterOperator.EQ, SaleItem)
                ];

                var that = this;
                oModel.read("/Image_displaySet", {
                    filters: imgfilter,
                    success: function (oData, oResponse) {
                        tableModel.setData(oData);
                        if (oData.results[0].FrontUrl !== "proxy not triggered") {
                            this.getView().byId("SC_idFrontUrl").setSrc(oData.results[0].FrontUrl);
                            this.getView().byId("SC_idBackUrl").setSrc(oData.results[0].BackUrl);
                        } else {
                            // imageflag = sap.ui.require.toUrl("CCGSDGRADINGAPP.ZSD_GRADINGAPP.controller.grading/Image/No_image.png");
                            that.getView().byId("SC_idFrontUrl").setSrc("/sap/bc/ui5_ui5/sap/ZSD_GRADINGAPP/Image/No_image.png");
                            that.getView().byId("SC_idBackUrl").setSrc("/sap/bc/ui5_ui5/sap/ZSD_GRADINGAPP/Image/No_image.png");
                        }
                        // this.getView().getModel("ImageModel").setData(oData.results);
                        // this.getView().getModel("ImageModel").refresh();
                    }.bind(this),

                    error: function () {

                        // imageflag = sap.ui.require.toUrl("CCGSDGRADINGAPP.ZSD_GRADINGAPP.controller.grading/Image/No_image.png");
                        that.getView().byId("SC_idFrontUrl").setSrc("/sap/bc/ui5_ui5/sap/ZSD_GRADINGAPP/Image/No_image.png");
                        that.getView().byId("SC_idBackUrl").setSrc("/sap/bc/ui5_ui5/sap/ZSD_GRADINGAPP/Image/No_image.png");
                    }

                }); */

            },
            SC_onGetGradeHistcallp: function (oEvent) {

                var tableModeln = new sap.ui.model.json.JSONModel();
                var tableModel1 = new sap.ui.model.json.JSONModel();

                var oModeln = this.getOwnerComponent().getModel("SC");
                var oModel1 = this.getOwnerComponent().getModel("SC");
                
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
                            this.GradeChek_SC = oData.results[0].gradedec;
                            if (oData.results[0].Perfect10 === "X") {

                                this.getView().byId("SC_idGrade").setSelectedKey("PERFECT");

                                this.perfectchk = "S";

                            } else if (oData.results[0].Pristine10 === "X") {

                                this.getView().byId("SC_idGrade").setSelectedKey("PRISTINE");

                            } else {

                            }

                            if (oData.results[0].GradeComplete === "X") {
                                this.getView().byId("SC_idFinish").setSelected(true);
                                // this.getView().byId("idFinish").setEnabled(false);
                                this.getView().byId("SC_idExit").setEnabled(false);
                                //this.getView().byId("SC_idPrevious").setEnabled(false);
                                //this.getView().byId("SC_idNext").setEnabled(false);
                                this.getView().byId("SC_idInputCollId").setEnabled(false);
                                this.getView().byId("SC_idGrade").setEnabled(false);
                                /* this.getView().byId("SC_idCenter").setEnabled(false);
                                this.getView().byId("SC_idCorner").setEnabled(false);
                                this.getView().byId("SC_idEdge").setEnabled(false);
                                this.getView().byId("SC_idSurface").setEnabled(false); */
                                this.getView().byId("SC_idAutoGrade").setEnabled(false);
                                this.getView().byId("SC_idNoGrade").setEnabled(false);
                                this.getView().byId("SC_idBump").setEnabled(false);
                                //this.getView().byId("SC_idPerChk").setEnabled(false);

                                MessageToast.show("Grading is Completed for this Salesorder and No further changes can be done");
                                this.SetLineItem(oData.results[0].Posnr);
                            } else {
                                
                                this.getView().byId("SC_idFinish").setSelected(false);
                                // this.getView().byId("idFinish").setEnabled(true);
                                this.getView().byId("SC_idExit").setEnabled(true);
                                //this.getView().byId("SC_idPrevious").setEnabled(true);
                                //this.getView().byId("SC_idNext").setEnabled(true);
                                this.getView().byId("SC_idInputCollId").setEnabled(true);
                                this.getView().byId("SC_idGrade").setEnabled(true);
                                /* this.getView().byId("SC_idCenter").setEnabled(true);
                                this.getView().byId("SC_idCorner").setEnabled(true);
                                this.getView().byId("SC_idEdge").setEnabled(true);
                                this.getView().byId("SC_idSurface").setEnabled(true); */
                                this.getView().byId("SC_idAutoGrade").setEnabled(true);
                                this.getView().byId("SC_idNoGrade").setEnabled(true);
                                this.getView().byId("SC_idBump").setEnabled(true);
                                //this.getView().byId("SC_idPerChk").setEnabled(true);
                            }

                            if (oData.results[0].Nograde !== "") {
                                //this.getView().byId("SC_idPerChk").setSelected(false);
                                this.getView().byId("SC_idGrade").setEnabled(false);
                                /* this.getView().byId("SC_idCenter").setEnabled(false);
                                this.getView().byId("SC_idCorner").setEnabled(false);
                                this.getView().byId("SC_idEdge").setEnabled(false);
                                this.getView().byId("SC_idSurface").setEnabled(false); */
                                this.getView().byId("SC_idAutoGrade").setEnabled(false);
                                //this.getView().byId("SC_idPerChk").setEnabled(false);
                            } else {
                                this.getView().byId("SC_idGrade").setEnabled(true);
                                /* this.getView().byId("SC_idCenter").setEnabled(true);
                                this.getView().byId("SC_idCorner").setEnabled(true);
                                this.getView().byId("SC_idEdge").setEnabled(true);
                                this.getView().byId("SC_idSurface").setEnabled(true); */
                                this.getView().byId("SC_idAutoGrade").setEnabled(true);
                                //this.getView().byId("SC_idPerChk").setEnabled(true);
                            }
                            this.setSaveNxtPreDisabled(oData.results[0]);
                        }
                        this.getView().getModel("SC_GradHistModel").setData(oData.results);
                        this.getView().getModel("SC_GradHistModel").refresh();
                        

                    }.bind(this),

                    error: function () {
                        // MessageToast.show("Failed");
                    }
                });

                //this.getView().byId("SC_idPerChk").setSelected(false);
            },
            SC_onGetGradeHistcall: function (oEvent) {

                var tableModeln = new sap.ui.model.json.JSONModel();
                var tableModel1 = new sap.ui.model.json.JSONModel();

                var oModeln = this.getOwnerComponent().getModel("SC");
                var oModel1 = this.getOwnerComponent().getModel("SC");
                
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
                            this.GradeChek_SC = oData.results[0].gradedec;
                            if (oData.results[0].Perfect10 === "X") {

                                this.getView().byId("SC_idGrade").setSelectedKey("PERFECT");

                                this.perfectchk = "S";

                            } else if (oData.results[0].Pristine10 === "X") {

                                this.getView().byId("SC_idGrade").setSelectedKey("PRISTINE");

                            } else {

                            }

                            if (oData.results[0].GradeComplete === "X") {
                                this.getView().byId("SC_idFinish").setSelected(true);
                                // this.getView().byId("idFinish").setEnabled(false);
                                this.getView().byId("SC_idExit").setEnabled(false);
                                //this.getView().byId("SC_idPrevious").setEnabled(false);
                                //this.getView().byId("SC_idNext").setEnabled(false);
                                this.getView().byId("SC_idInputCollId").setEnabled(false);
                                this.getView().byId("SC_idGrade").setEnabled(false);
                                /* this.getView().byId("SC_idCenter").setEnabled(false);
                                this.getView().byId("SC_idCorner").setEnabled(false);
                                this.getView().byId("SC_idEdge").setEnabled(false);
                                this.getView().byId("SC_idSurface").setEnabled(false); */
                                this.getView().byId("SC_idAutoGrade").setEnabled(false);
                                this.getView().byId("SC_idNoGrade").setEnabled(false);
                                this.getView().byId("SC_idBump").setEnabled(false);


                                MessageToast.show("Grading is Completed for this Salesorder and No further changes can be done");
                                this.SetLineItem(oData.results[0].Posnr);
                            } else {
                                
                                this.getView().byId("SC_idFinish").setSelected(false);
                                // this.getView().byId("idFinish").setEnabled(true);
                                this.getView().byId("SC_idExit").setEnabled(true);
                                //this.getView().byId("SC_idPrevious").setEnabled(true);
                                //this.getView().byId("SC_idNext").setEnabled(true);
                                this.getView().byId("SC_idInputCollId").setEnabled(true);
                                this.getView().byId("SC_idGrade").setEnabled(true);
                                /* this.getView().byId("SC_idCenter").setEnabled(true);
                                this.getView().byId("SC_idCorner").setEnabled(true);
                                this.getView().byId("SC_idEdge").setEnabled(true);
                                this.getView().byId("SC_idSurface").setEnabled(true); */
                                this.getView().byId("SC_idAutoGrade").setEnabled(true);
                                this.getView().byId("SC_idNoGrade").setEnabled(true);
                                this.getView().byId("SC_idBump").setEnabled(true);
                                //this.getView().byId("SC_idPerChk").setEnabled(true);
                            }

                            if (oData.results[0].Nograde !== "") {
                                // this.getView().byId("SC_idPerChk").setSelected(false);
                                this.getView().byId("SC_idGrade").setEnabled(false);
                                /* this.getView().byId("SC_idCenter").setEnabled(false);
                                this.getView().byId("SC_idCorner").setEnabled(false);
                                this.getView().byId("SC_idEdge").setEnabled(false);
                                this.getView().byId("SC_idSurface").setEnabled(false); */
                                this.getView().byId("SC_idAutoGrade").setEnabled(false);
                                //this.getView().byId("SC_idPerChk").setEnabled(false);
                            } else {
                                this.getView().byId("SC_idGrade").setEnabled(true);
                                /* this.getView().byId("SC_idCenter").setEnabled(true);
                                this.getView().byId("SC_idCorner").setEnabled(true);
                                this.getView().byId("SC_idEdge").setEnabled(true);
                                this.getView().byId("SC_idSurface").setEnabled(true); */
                                this.getView().byId("SC_idAutoGrade").setEnabled(true);
                                //this.getView().byId("SC_idPerChk").setEnabled(true);
                            }
                            this.getView().getModel("SC_GradHistModel").setData(oData.results);
                            this.getView().getModel("SC_GradHistModel").refresh();
                            
                            this.setSaveNxtPreDisabled(oData.results[0]);
                        }
                        
                        

                    }.bind(this),

                    error: function () {
                        // MessageToast.show("Failed");
                    }
                });

                //this.getView().byId("SC_idPerChk").setSelected(false);
            },
            SC_onMissedCall: function (oEvent) {

                var tableModel = new sap.ui.model.json.JSONModel();
                var oModel = this.getOwnerComponent().getModel("SC");
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
                            this.getView().byId("SC_idMsdGradTab").setText(result);
                            oData.results.sort(function(a, b){return a.Posnr-b.Posnr});
                        }
                        // sap.ui.core.BusyIndicator.hide();
                        this.getView().byId("SC_idMsdGradTab").setText(result);
                        this.getView().getModel("SC_InitModel").setData(oData.results);
                        this.getView().getModel("SC_InitModel").refresh();


                    }.bind(this),
                    error: function () {

                        // MessageToast.show("Failed");
                    }
                });
            },
            SC_onPerSelect: function (oEvent) {
                // write busy indicator
                // sap.ui.core.BusyIndicator.show(0);

                if (this.getView().byId("SC_idPerChk").getSelected() == true) {

                    var SC_DataModel = new sap.ui.model.json.JSONModel();
                    SC_DataModel = {
                        kgrade: this.getView().byId("SC_idGrade").getSelectedText(),
                        /* kcenter: this.getView().byId("SC_idCenter").getSelectedKey(),
                        kcorner: this.getView().byId("SC_idCorner").getSelectedKey(),
                        kedge: this.getView().byId("SC_idEdge").getSelectedKey(),
                        ksurface: this.getView().byId("SC_idSurface").getSelectedKey(), */
                        lgrade: this.getView().byId("SC_idGrade").getValue(),
                        /* lcenter: this.getView().byId("SC_idCenter").getValue(),
                        lcorner: this.getView().byId("SC_idCorner").getValue(),
                        ledge: this.getView().byId("SC_idEdge").getValue(),
                        lsurface: this.getView().byId("SC_idSurface").getValue() */
                    };

                    this.getView().setModel(SC_DataModel, "SC_DataModel");
                    //this.getView().byId("SC_idPristineChk").setSelected(false);

                    /* this.getView().byId("SC_idCenter").setValue("Gem Mint 10");
                    this.getView().byId("SC_idCorner").setValue("Gem Mint 10");
                    this.getView().byId("SC_idEdge").setValue("Gem Mint 10");
                    this.getView().byId("SC_idSurface").setValue("Gem Mint 10"); */
                    this.getView().byId("SC_idGrade").setValue("Perfect 10");
                    /*  this.getView().byId("SC_idCenter").setSelectedKey("10");
                     // this.getView().byId("idCenter").setEditable(false);
                     this.getView().byId("SC_idCorner").setSelectedKey("10");
                     // this.getView().byId("idCorner").setEditable(false);
                     this.getView().byId("SC_idEdge").setSelectedKey("10");
                     // this.getView().byId("idEdge").setEditable(false);
                     this.getView().byId("SC_idSurface").setSelectedKey("10"); */
                    // this.getView().byId("idSurface").setEditable(false);
                    this.getView().byId("SC_idGrade").setSelectedKey("PERFECT");
                    // this.getView().byId("idGrade").setEditable(false);
                }

                if (this.getView().byId("SC_idPerChk").getSelected() === false) {

                    if (this.perfectchk !== "S") {

                        var lgrade = this.getView().getModel("SC_DataModel").lgrade;
                        var lcenter = this.getView().getModel("SC_DataModel").lcenter;
                        var lcorner = this.getView().getModel("SC_DataModel").lcorner;
                        var ledge = this.getView().getModel("SC_DataModel").ledge;
                        var lsurface = this.getView().getModel("SC_DataModel").lsurface;
                        var kgrade = this.getView().getModel("SC_DataModel").kgrade;
                        var kcenter = this.getView().getModel("SC_DataModel").kcenter;
                        var kcorner = this.getView().getModel("SC_DataModel").kcorner;
                        var kedge = this.getView().getModel("SC_DataModel").kedge;
                        var ksurface = this.getView().getModel("SC_DataModel").ksurface;
                    }

                    this.perfectchk = " ";

                    /* this.getView().byId("SC_idCenter").setValue(lcenter);
                    this.getView().byId("SC_idCorner").setValue(lcorner);
                    this.getView().byId("SC_idEdge").setValue(ledge);
                    this.getView().byId("SC_idSurface").setValue(lsurface); */
                    //this.getView().byId("SC_idGrade").setValue(lgrade);

                    /* this.getView().byId("SC_idCenter").setSelectedKey(kcenter);
                    this.getView().byId("SC_idCorner").setSelectedKey(kcorner);
                    this.getView().byId("SC_idEdge").setSelectedKey(kedge);
                    this.getView().byId("SC_idSurface").setSelectedKey(ksurface); */
                    //this.getView().byId("SC_idGrade").setSelectedKey(kgrade);
                    this.getView().byId("SC_idGrade").setValue("");
                    this.getView().byId("SC_idGrade").setSelectedKey("");

                    // // this.getView().byId("idCenter").setEditable(true);
                    // // this.getView().byId("idCenter").setEditable(true);
                    // // this.getView().byId("idCorner").setEditable(true);
                    // // this.getView().byId("idEdge").setEditable(true);
                    // // this.getView().byId("idSurface").setEditable(true);
                    // // this.getView().byId("idSurface").setEditable(true);
                }
                // sap.ui.core.BusyIndicator.hide();
            },
            onValueTCCollectable: function () {

                //sap.ui.core.BusyIndicator.show();

                


                /* this.oModel.read("/Grade_setcodeSet", {
                    // filters: filter,
                    urlParameters: {
                        "$top": "100",
                        "$skip": "100",
                },
                    success: function (oData, oResponse) {

                        oData.results.unshift(" ");
                        this.getView().getModel("SC_SetCodeModel").setData(oData.results);
                        this.getView().getModel("SC_SetCodeModel").refresh();
                    }.bind(this),

                    error: function () {
                        // MessageToast.show("Failed");
                    }
                }); */

                this.oModel.read("/ZMMSearchHelp_TCSet", {
                    // filters: gFilter,
                    urlParameters: {
                        "$top": "20",
                        "$skip": "10",
                },
                    success: function (oData, oResponse) {

                        //sap.ui.core.BusyIndicator.hide();
                        this.setCollectabledata_TC(oData.results);
                    }.bind(this),

                    error: function () {
                        //sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("Failed to Load Data");
                    }
                });


                /* this.cDialog = Fragment.load({
                    name: "ccgtradingcards.view.fragment.collectible_TC",
                    controller: this
                }).then(
                    function (oFrag) {
                        this.getView().addDependent(oFrag);
                        oFrag.open();
                    }.bind(this)
                ); */
                var that = this,
                oView = this.getView();
                if (!that.cDialog_TC) {
                    that.cDialog_TC = Fragment.load({
                        name: "ccgtradingcards.view.fragment.collectible_TC",
                        controller: that
                    }).then(function (ocDialog) {
                        
                        oView.addDependent(ocDialog);
                        return ocDialog;
                    }.bind(that));
                }
                that.cDialog_TC.then(function(ocDialog) {
                    ocDialog.open();
                    });  

            },
            setCollectabledata_TC: function (odata) {

                var oDataCollectable_TC = new sap.ui.model.json.JSONModel(odata);
                this.getView().setModel(oDataCollectable_TC, "oDataCollectable_TC");

            },

            SC_onValueHelpRequested: function () {

                //sap.ui.core.BusyIndicator.show();

                var tableModelf = new sap.ui.model.json.JSONModel();
                var oModelf = this.getOwnerComponent().getModel("SC");

                oModelf.read("/Grade_setcodeSet", {
                    // filters: filter,
                    success: function (oData, oResponse) {
                        tableModelf.setData(oData);
                        oData.results.unshift(" ");
                        this.getView().getModel("SC_SetCodeModel").setData(oData.results);
                        this.getView().getModel("SC_SetCodeModel").refresh();
                    }.bind(this),

                    error: function () {
                        // MessageToast.show("Failed");
                    }
                });

                oModelf.read("/ZmmSearchHelpSet", {
                    // filters: gFilter,
                    success: function (oData, oResponse) {
                        tableModelf.setData(oData);
                        //sap.ui.core.BusyIndicator.hide();
                        this.getView().getModel("SC_CollectibleModel").setData(oData.results);
                        this.getView().getModel("SC_CollectibleModel").refresh();
                    }.bind(this),

                    error: function () {
                        //sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("Failed to Load Data");
                    }
                });

               /*  this.cDialog = Fragment.load({
                    name: "ccgtradingcards.view.fragment.collectible",
                    controller: this
                }).then(
                    function (oFrag) {
                        this.getView().addDependent(oFrag);
                        oFrag.open();
                    }.bind(this)
                ); */
                var that = this,
                oView = this.getView();
                if (!that.cDialog_SC) {
                    that.cDialog_SC = Fragment.load({
                        name: "ccgtradingcards.view.fragment.collectible",
                        controller: that
                    }).then(function (ocDialog_SC) {
                        
                        oView.addDependent(ocDialog_SC);
                        return ocDialog_SC;
                    }.bind(that));
                }
                that.cDialog_SC.then(function(ocDialog_SC) {
                    ocDialog_SC.open();
                    });  
            },
            onValueHelpCancelPress: function () {
                this._oValueHelpDialog.close();
            },

            onValueHelpAfterClose: function () {
                this._oValueHelpDialog.close();
            },
            handleOkDlogPress_TC: function (oEvent) {

                var tb = sap.ui.getCore().byId("TC_idGradeTablef");
                var rowid = tb.getSelectedIndices();

                if (rowid.length == 0) {
                    MessageBox.error("No Collectible Row is selected");
                } else {
                    this.getView().getModel("MainModel").getData().CardName = this.selectedRow.CARD_NAME;
                    this.getView().getModel("MainModel").getData().Gamedescription = this.selectedRow.GAME_CODE;
                    this.getView().getModel("MainModel").getData().Variant1desc = this.selectedRow.VARIANT_CODE1;
                    this.getView().getModel("MainModel").getData().Variant2desc = this.selectedRow.VARIANT_CODE2;
                    this.getView().getModel("MainModel").getData().Langdescription = this.selectedRow.LANG_CODE;
                    this.getView().getModel("MainModel").getData().SetCode = "";
                    this.getView().getModel("MainModel").getData().Raritydescription = this.selectedRow.RARITY_CODE;
                    this.getView().getModel("MainModel").getData().Matnr = this.selectedRow.MATNR;
                    this.getView().getModel("MainModel").getData().Aicenter = this.selectedRow.CARD_YEAR;
                    this.getView().getModel("MainModel").refresh();
                    //sap.ui.getCore().byId("TC_idMaterialf").setValue("");
                    sap.ui.getCore().byId("TC_idInputRarity").setValue("");
                    sap.ui.getCore().byId("TC_idInputVart1").setValue("");
                    sap.ui.getCore().byId("TC_idInputVart2").setValue("");

                    this.onCloseDialog_TC();
                    this.getView().getModel("oDataCollectable_TC").setData([]);
                    this.getView().getModel().refresh();


                }

            },
            handleOkDlogPress: function (oEvent) {

                var tb = sap.ui.getCore().byId("SC_idGradeTablef");
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

                //sap.ui.core.BusyIndicator.show();

                // this.getView().getModel("oMaraTempModel").refresh();
                sap.ui.getCore().byId("SC_idSportsCardf").setSelectedKey("");
                sap.ui.getCore().byId("SC_idInputManuff").setSelectedKey("");
                sap.ui.getCore().byId("SC_idSetCodef").setSelectedKey("");
                sap.ui.getCore().byId("SC_idPlayerf").setValue(" ");
                sap.ui.getCore().byId("SC_idMaterialf").setValue(" ");

                sap.ui.getCore().byId("SC_idInputYearf").setValue(" ");
                sap.ui.getCore().byId("SC_idInputAttr1f").setValue(" ");
                sap.ui.getCore().byId("SC_idInputAttr2f").setValue(" ");

                var tableModelf = new sap.ui.model.json.JSONModel();
                var oModelf = this.getOwnerComponent().getModel("SC");

                oModelf.read("/ZmmSearchHelpSet", {
                    // filters: gFilter,
                    success: function (oData, oResponse) {
                        tableModelf.setData(oData);
                        //sap.ui.core.BusyIndicator.hide();
                        this.getView().getModel("SC_CollectibleModel").setData(oData.results);
                        this.getView().getModel("SC_CollectibleModel").refresh();
                    }.bind(this),

                    error: function () {
                        //sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("Error in Loading Data, Please Contact Technical Team");
                    }
                });
            },
            // This is triggered to filter the table values based on dropdowns selected in collectible search help
            handleGoDlogPress_TC: function () {
                //sap.ui.core.BusyIndicator.show();
                var gFilter = [];

                var gamecode = sap.ui.getCore().byId("TC_idInputGameCode").getValue();
                if (gamecode) {
                    gFilter.push(new sap.ui.model.Filter("GAME_CODE", sap.ui.model.FilterOperator.EQ, gamecode));
                }

                var LangCode = sap.ui.getCore().byId("TC_idInputLanguage").getValue();
                if (LangCode) {
                    gFilter.push(new sap.ui.model.Filter("LANG_CODE", sap.ui.model.FilterOperator.EQ, LangCode));
                }

                var SetCode = sap.ui.getCore().byId("TC_idInputSetCode").getValue();
                if (SetCode) {
                    gFilter.push(new sap.ui.model.Filter("SET_CODE", sap.ui.model.FilterOperator.EQ, SetCode));
                }

                /* var lfvMatnr = sap.ui.getCore().byId("TC_idMaterialf").getValue();
                if (lfvMatnr) {
                    gFilter.push(new sap.ui.model.Filter("MATNR", sap.ui.model.FilterOperator.EQ, lfvMatnr));
                } */

                var Card_Name = sap.ui.getCore().byId("TC_Card_Name").getValue();
                if (Card_Name) {
                    gFilter.push(new sap.ui.model.Filter("CARD_NAME", sap.ui.model.FilterOperator.EQ, Card_Name));
                }

                var Display_Name = sap.ui.getCore().byId("TC_Display_Name").getValue();
                if (Display_Name) {
                    gFilter.push(new sap.ui.model.Filter("DISPLAY_NAME", sap.ui.model.FilterOperator.EQ, Display_Name));
                }

                var Label_Text = sap.ui.getCore().byId("TC_Label_Text").getValue();
                if (Label_Text) {
                    gFilter.push(new sap.ui.model.Filter("LABEL_TEXT", sap.ui.model.FilterOperator.EQ, Label_Text));
                }

                var Web_lookup = sap.ui.getCore().byId("TC_Web_lookup").getValue();
                if (Web_lookup) {
                    gFilter.push(new sap.ui.model.Filter("WEBLOOKUP", sap.ui.model.FilterOperator.EQ, Web_lookup));
                }

                var Year = sap.ui.getCore().byId("TC_Year").getValue();
                if (Year) {
                    gFilter.push(new sap.ui.model.Filter("CARD_YEAR", sap.ui.model.FilterOperator.EQ, Year));
                }

                var lfvAttr1 = sap.ui.getCore().byId("TC_idInputVart1").getValue();
                if (lfvAttr1) {
                    gFilter.push(new sap.ui.model.Filter("VARIANT_CODE1", sap.ui.model.FilterOperator.EQ, lfvAttr1));
                }

                var lfvAttr2 = sap.ui.getCore().byId("TC_idInputVart2").getValue();
                if (lfvAttr2) {
                    gFilter.push(new sap.ui.model.Filter("VARIANT_CODE2", sap.ui.model.FilterOperator.EQ, lfvAttr2));
                }

                var RarityCode = sap.ui.getCore().byId("TC_idInputRarity").getValue();
                if (RarityCode) {
                    gFilter.push(new sap.ui.model.Filter("RARITY_CODE", sap.ui.model.FilterOperator.EQ, RarityCode));
                }

                var Color_code = sap.ui.getCore().byId("TC_Color_code").getValue();
                if (Color_code) {
                    gFilter.push(new sap.ui.model.Filter("COLOR_CODE", sap.ui.model.FilterOperator.EQ, Color_code));
                }

                var Exclude_from_OSF = sap.ui.getCore().byId("TC_Exclude_from_OSF").getSelectedKey();
                if (Exclude_from_OSF) {
                    gFilter.push(new sap.ui.model.Filter("EXCLUDE_FROM_OSF", sap.ui.model.FilterOperator.EQ, Exclude_from_OSF));
                }

                var Exclude_from_POP = sap.ui.getCore().byId("TC_Exclude_from_POP").getSelectedKey();
                if (Exclude_from_POP) {
                    gFilter.push(new sap.ui.model.Filter("EXCLUDE_POP_REPORT", sap.ui.model.FilterOperator.EQ, Exclude_from_POP));
                }

                var X_Plant_Mat_Status = sap.ui.getCore().byId("TC_X_Plant_Mat_Status").getValue();
                if (X_Plant_Mat_Status) {
                    gFilter.push(new sap.ui.model.Filter("MSTAE", sap.ui.model.FilterOperator.EQ, X_Plant_Mat_Status));
                }
                
                 var Card_Number = sap.ui.getCore().byId("Card_Number").getValue();
                if (Card_Number) {
                    gFilter.push(new sap.ui.model.Filter("COLLECTOR_NUM", sap.ui.model.FilterOperator.EQ, Card_Number));
                } 


                this.oModel.read("/ZMMSearchHelp_TCSet", {
                    filters: gFilter,
                    success: function (oData, oResponse) {
                        this.setCollectabledata_TC(oData.results);
                        //sap.ui.core.BusyIndicator.hide();
                    }.bind(this),

                    error: function () {
                        MessageToast.show("No Data for this Search");
                        //sap.ui.core.BusyIndicator.hide();
                    }
                });
   },
            handleGoDlogPress: function (oEvent) {

                var tableModelf = new sap.ui.model.json.JSONModel();
                var oModelf = this.getOwnerComponent().getModel("SC");

                var lfvSports = sap.ui.getCore().byId("SC_idSportsCardf").getSelectedKey();
                var lfvManuf = sap.ui.getCore().byId("SC_idInputManuff").getSelectedKey();
                var lfvSetCode = sap.ui.getCore().byId("SC_idSetCodef").getSelectedKey();
                var lfvCardyr = sap.ui.getCore().byId("SC_idInputYearf").getSelectedKey();
                var lfvPlayer = sap.ui.getCore().byId("SC_idPlayerf")._lastValue;
                var lfvMatnr = sap.ui.getCore().byId("SC_idMaterialf")._lastValue;
                var lfvAttr1 = sap.ui.getCore().byId("SC_idInputAttr1f")._lastValue;
                var lfvAttr2 = sap.ui.getCore().byId("SC_idInputAttr2f")._lastValue;

                if ((lfvMatnr == " ") && (lfvSports == " ") && (lfvManuf == " ") && (lfvSetCode == " ") && (lfvCardyr == " ") && (lfvPlayer == " ") &&
                    (lfvAttr1 == " ") && (lfvAttr2 == " ")) {

                    //sap.ui.core.BusyIndicator.show();

                    oModelf.read("/ZmmSearchHelpSet", {
                        // filters: gFilter,
                        success: function (oData, oResponse) {
                            tableModelf.setData(oData);
                            //sap.ui.core.BusyIndicator.hide();
                            this.getView().getModel("SC_CollectibleModel").setData(oData.results);
                            this.getView().getModel("SC_CollectibleModel").refresh();
                        }.bind(this),

                        error: function () {
                            //sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("Failed to Load Data, Refresh Again");
                        }
                    });
                } else {

                    var gFilter = [
                        new sap.ui.model.Filter("Matnr", sap.ui.model.FilterOperator.EQ, lfvMatnr),
                        new sap.ui.model.Filter("ZSportscodeText", sap.ui.model.FilterOperator.EQ, lfvSports),
                        new sap.ui.model.Filter("ZMakercodeText", sap.ui.model.FilterOperator.EQ, lfvManuf),
                        new sap.ui.model.Filter("ZCardsetText", sap.ui.model.FilterOperator.EQ, lfvSetCode),
                        new sap.ui.model.Filter("ZCardYear", sap.ui.model.FilterOperator.EQ, lfvCardyr),
                        new sap.ui.model.Filter("ZSubjectDescription", sap.ui.model.FilterOperator.EQ, lfvPlayer),
                        new sap.ui.model.Filter("ZCsgCardAttrib1Descr", sap.ui.model.FilterOperator.EQ, lfvAttr1),
                        new sap.ui.model.Filter("ZCsgCardAttrib2Descr", sap.ui.model.FilterOperator.EQ, lfvAttr2)
                    ];

                    oModelf.read("/ZmmSearchHelpSet", {
                        filters: gFilter,
                        success: function (oData, oResponse) {
                            tableModelf.setData(oData);
                            this.getView().getModel("SC_CollectibleModel").setData(oData.results);
                            this.getView().getModel("SC_CollectibleModel").refresh();
                        }.bind(this),

                        error: function () {
                            MessageToast.show("No Data for this Search");
                        }
                    });
                }

                this.onValueHelpAfterClose();
            },
            // On Fragment Close
            onCloseDialog: function (oEvent) {

                sap.ui.getCore().byId("SC_idSportsCardf").setSelectedKey(" ");
                sap.ui.getCore().byId("SC_idInputManuff").setSelectedKey(" ");
                sap.ui.getCore().byId("SC_idSetCodef").setSelectedKey(" ");
                sap.ui.getCore().byId("SC_idInputYearf").setValue(" ");
                sap.ui.getCore().byId("SC_idPlayerf").setValue(" ");
                sap.ui.getCore().byId("SC_idMaterialf").setValue(" ");

                sap.ui.getCore().byId("SC_colDialog").close();

            },
            onCloseDialog_TC: function () {
                sap.ui.getCore().byId("TC_colDialog").close();
                this.getView().getModel("oDataCollectable_TC").setData([]);
                this.getView().getModel("oDataCollectable_TC").refresh();

            },
            
            action_TC: function (oEvent) {

                this.selectedRow = oEvent.getSource().getModel("oDataCollectable_TC").getData()[oEvent.getSource().getSelectedIndex()];
                var that = this;
                var lv_filter = [new sap.ui.model.Filter({
                    path: "NameChar",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: this.selectedRow.MATNR})
                ];

                this.oModel.read("/Grade_nogradeSet", {
                    filters : lv_filter,
                    success: function (oData, oResponse) {
                        that.setAutoGraphValidation(oData.results[0].NameChar);
                    }
                    });

            },

            action: function (oEvent) {
                // var rowobject = oEvent.getSource().getSelectedItem().getBindingContext().getObject();
                //sap.ui.core.BusyIndicator.show();

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
                this.LineId = this.getView().byId("SC_idGradLine").getText();
                this.CollectId = selectedCUId;

                var tableModelp = new sap.ui.model.json.JSONModel();
                var oModelp = this.getOwnerComponent().getModel("SC");

                var pfilter = [
                    new sap.ui.model.Filter("LvVbeln", sap.ui.model.FilterOperator.EQ, this.SalesId),
                    new sap.ui.model.Filter("LvPosnr", sap.ui.model.FilterOperator.EQ, this.LineId),
                    new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, "C"),
                    new sap.ui.model.Filter("ImCollectid", sap.ui.model.FilterOperator.EQ, this.CollectId)
                ];

                var lbumpval = this.getView().byId("SC_idBump").getSelectedKey();

                oModelp.read("/Grade_MARADATASet", {
                    filters: pfilter,
                    success: function (oData, oResponse) {
                        tableModelp.setData(oData);
                        if (oData.results.length !== 0) {
                            this.Collid = oData.results[0].CollectibleId;
                        }
                        
                        if (oData.results.length !== 0) {
                            if (oData.results[0].ZThickHolderFlag === "X") {
                                this.getView().byId("SC_idTH").setSelected(true);
                            } else {
                                this.getView().byId("SC_idTH").setSelected(false);
                            }
                            if (oData.results[0].FactoryAutograph === "X") {
                                this.getView().byId("SC_idInputAuto").setSelected(true);
                            } else {
                                this.getView().byId("SC_idInputAuto").setSelected(false);
                            }
                            oData.results[0].Bump = lbumpval;
                        }
                        this.getView().getModel("SC_MaraDataModel").setData(oData.results[0]);
                        this.getView().getModel("SC_MaraDataModel").refresh();
                        //sap.ui.core.BusyIndicator.hide();
                    }.bind(this),

                    error: function () {
                        //sap.ui.core.BusyIndicator.hide();
                        // MessageToast.show("Failed");
                    }
                });

                var SC_SubsetModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_SubsetModel, "SC_SubsetModel");
                SC_SubsetModel.setSizeLimit(3000);

                var sfilter = [
                    new sap.ui.model.Filter("CsgCardSetCode", sap.ui.model.FilterOperator.EQ, selectedSetCode)
                ];
                oModelp.read("/ZmmSubsetsrchSet", {
                    filters: sfilter,
                    success: function (oData, oResponse) {
                        tableModelp.setData(oData);
                        oData.results.unshift(" ");
                        this.getView().getModel("SC_SubsetModel").setData(oData.results);
                        this.getView().getModel("SC_SubsetModel").refresh();
                    }.bind(this),

                    error: function () {
                        // MessageToast.show("Failed");
                    }
                });

            },
            SC_onPrintBox: function (oEvent) {

                this.LineId = this.getView().byId("SC_idGradLine").getText();
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

            onCollectEnter: function (oEvent) {
                this.CollectId = this.getView().byId("SC_idInputCollId").getText();

                var tableModelp = new sap.ui.model.json.JSONModel();
                var oModelp = this.getOwnerComponent().getModel("SC");
                var pfilter = [
                    new sap.ui.model.Filter("LvVbeln", sap.ui.model.FilterOperator.EQ, this.SalesId),
                    new sap.ui.model.Filter("LvPosnr", sap.ui.model.FilterOperator.EQ, this.LineId),
                    new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, "C"),
                    new sap.ui.model.Filter("ImCollectid", sap.ui.model.FilterOperator.EQ, this.CollectId)
                ];

                var lbumpval = this.getView().byId("SC_idBump").getSelectedKey();

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
                                this.getView().byId("SC_idTH").setSelected(true);
                            } else {
                                this.getView().byId("SC_idTH").setSelected(false);
                            }
                            if (oData.results[0].FactoryAutograph === "X") {
                                this.getView().byId("SC_idInputAuto").setSelected(true);
                            } else {
                                this.getView().byId("SC_idInputAuto").setSelected(false);
                            }
                        }
                        this.getView().getModel("SC_MaraDataModel").setData(oData.results[0]);
                        this.getView().getModel("SC_MaraDataModel").refresh();
                    }.bind(this),

                    error: function () {
                        // MessageToast.show("Failed");
                    }
                });
            },
            SC_OnGradeSel: function (oEvent) {
                var that = this;
                var SCGrade = this.getView().byId("SC_idGrade").getValue();
                var oGrades = this.getView().getModel("GradeSetModel").getData();
                if(!isNaN(parseFloat(SCGrade)) && isFinite(SCGrade)){


                    oGrades.every(value => {
                        if(value.CharValue == SCGrade){
                            
                            that.GradeValidationSC = " "
                            return false;
                        }else{
                            that.GradeValidationSC = "X"
                            return true;
                        }

                    });
                    if(that.GradeValidationSC == "X"){
                        MessageBox.error("Please select the valid Grade");
                            that.getView().byId("idGrade").setSelectedKey("");
                            that.getView().byId("idGrade").setValue("");
                    }else{


                        var kgrade = oEvent.getParameters().newValue;
                        var knograde = this.getView().byId("SC_idNoGrade").getSelectedKey();

                        if (this.VcScCrossover != "") {
                            if (knograde == "") {
                                if (this.VcScCrossover >= kgrade) {
                                    var lv_msg = "Grade should be more than Crossover ";
                                    var result = lv_msg.concat(this.VcScCrossover);
                                    MessageBox.information(result);

                                }

                            }
                        }
                    }
            }else{

                MessageBox.error("Characters are not allowed in Grade. please select from dropdown",{
                    onClose: function (oAction) {
                        that.getView().byId("SC_idGrade").setSelectedKey("");
                        that.getView().byId("SC_idGrade").setValue("");

                    }
                });

            }
            },
            OnGradeSelCng: function (oEvent) {

                var that = this;

                var SCGrade = this.getView().byId("SC_idGrade").getValue();
                if(!isNaN(parseFloat(SCGrade)) && isFinite(SCGrade)){

                this.SC_kgrade = oEvent.getParameters().selectedItem.getText();
                var addText = oEvent.getParameter("selectedItem").getAdditionalText();

                this.getView().getModel("SC_MaraDataModel").getData().ErrorMessage = addText;
                this.getView().getModel("SC_MaraDataModel").getData().Grade = this.SC_kgrade

                this.getView().getModel("SC_MaraDataModel").refresh();

                //this.getView().byId("SC_idbtngrade").setText(kgrade + " - " + addText);



                if (this.SC_kgrade == "10" && (addText == "PRISTINE" || addText == "Pristine")) {

                    this.GradeChek_SC = "PRISTINE";

                } else if (this.SC_kgrade == "10" && (addText == "PERFECT" || addText == "Perfect")) {
                    this.GradeChek_SC = "PERFECT";
                }
                else if (this.SC_kgrade == "10") {
                    this.GradeChek_SC = "GEM MINT";

                }
            }

            },

            // Validation 4 : Grade Complete checkbox can be checked if grading is done against all the lineitems of the given salesorder, if not throw an error.

            SC_onGradCompleteSelect: function (oEvent) {

                var that = this;

                if (this.getView().byId("SC_idFinish").getSelected() === false) {

                    MessageBox.warning("You are Revoking the Grade Completion status, Click OK & Save to continue", {
                        actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                        emphasizedAction: MessageBox.Action.OK,
                        onClose: function (sAction) {

                            if (sAction === "OK") {

                                var tableModelp = new sap.ui.model.json.JSONModel();
                                var oModelp = that.getOwnerComponent().getModel("SC");
                                var pfilter = [
                                    new sap.ui.model.Filter("Vbeln", sap.ui.model.FilterOperator.EQ, that.SalesId),
                                    new sap.ui.model.Filter("Posnr", sap.ui.model.FilterOperator.EQ, that.LineId),
                                    new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, "D")
                                ];
                                oModelp.read("/getInitialLineItemsSet", {
                                    filters: pfilter,
                                    success: function (oData, oResponse) {
                                        tableModelp.setData(oData);

                                        that.GradeCompleted_SC = " ";
                                        // this.getView().byId("idFinish").setSelected(false);
                                        // this.getView().byId("idFinish").setEnabled(true);
                                        that.getView().byId("SC_idExit").setEnabled(true);
                                        that.getView().byId("SC_idPrevious").setEnabled(true);
                                        that.getView().byId("SC_idNext").setEnabled(true);
                                        that.getView().byId("SC_idInputCollId").setEnabled(true);
                                        that.getView().byId("SC_idGrade").setEnabled(true);
                                        /* that.getView().byId("SC_idCenter").setEnabled(true);
                                        that.getView().byId("SC_idCorner").setEnabled(true);
                                        that.getView().byId("SC_idEdge").setEnabled(true);
                                        that.getView().byId("SC_idSurface").setEnabled(true); */
                                        that.getView().byId("SC_idAutoGrade").setEnabled(true);
                                        that.getView().byId("SC_idNoGrade").setEnabled(true);
                                        that.getView().byId("SC_idBump").setEnabled(true);
                                        //that.getView().byId("SC_idPerChk").setEnabled(true);
                                    }.bind(this),
                                    error: function () {
                                        // MessageToast.show("Failed");
                                    }
                                });

                            }
                        }
                    });

                }

                if (this.getView().byId("SC_idFinish").getSelected() === true) {
                    this.LineId = this.getView().byId("SC_idGradLine").getText();
                    var kgrade = this.getView().byId("SC_idGrade").getSelectedText();
                    var lNograde = this.getView().byId("SC_idNoGrade").getSelectedKey();

                    var tableModelp = new sap.ui.model.json.JSONModel();
                    var oModelp = this.getOwnerComponent().getModel("SC");
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
                                    this.getView().byId("SC_idFinish").setSelected(false);
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
                                    "Do you want to complete the Grading for this order?, click OK & Save to confirm", {
                                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                                    emphasizedAction: MessageBox.Action.OK,
                                    onClose: function (sAction) {
                                        if (sAction === "OK") {
                                            that.GradeCompleted_SC = "X";
                                            that.getView().byId("SC_idPrevious").setEnabled(false);
                                            that.getView().byId("SC_idNext").setEnabled(false);
                                            that.getView().byId("SC_idGrade").setEnabled(false);

                                           /*  oModelp.read("/getInitialLineItemsSet", {
                                                filters: pfilter,
                                                success: function (oData, oResponse) {
                                                    tableModelp.setData(oData);
                                                    tempv = "X";
                                                   // that.getView().byId("idExit").setEnabled(false);
                                                    
                                                    that.getView().byId("SC_idPrevious").setEnabled(false);
                                                    that.getView().byId("SC_idNext").setEnabled(false);
                                                    // that.getView().byId("idInputCollId").setEnabled(false);
                                                     
                                                     that.getView().byId("SC_idGrade").setEnabled(false);
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
                                            }); */

                                            that.onSave();
                                        }
                                        if (sAction === "CANCEL") {
                                            that.getView().byId("SC_idFinish").setSelected(false);
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
            SC_onGraderInfoClik: function (oEvent) {

                // var that = this;

                var SC_GraderInfoModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_GraderInfoModel, "SC_GraderInfoModel");
                var tableModel = new sap.ui.model.json.JSONModel();
                var oModel = this.getOwnerComponent().getModel("SC");

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
                            sap.ui.getCore().byId("SC_idGraderInfLbl").setValue(this.giCount);
                        }
                        this.getView().getModel("SC_GraderInfoModel").setData(oData.results);
                        this.getView().getModel("SC_GraderInfoModel").refresh();

                    }.bind(this),
                    error: function () {
                        // MessageToast.show("Failed");
                    }
                });

                /* this.gDialog = Fragment.load({
                    name: "ccgtradingcards.view.fragment.SC_GraderInfo",
                    controller: this
                }).then(
                    function (oFrag1) {
                        this.getView().addDependent(oFrag1);
                        oFrag1.open();
                    }.bind(this)
                ); */
                
                var that = this,
                oView = this.getView();
                if (!that.gdrInfoDialog_SC) {
                    that.gdrInfoDialog_SC = Fragment.load({
                        name: "ccgtradingcards.view.fragment.SC_GraderInfo",
                        controller: that
                    }).then(function (ogDialog_SC) {
                        oView.addDependent(ogDialog_SC);
                        return ogDialog_SC;
                    }.bind(that));
                }
                that.gdrInfoDialog_SC.then(function(ogDialog_SC) {
                    ogDialog_SC.open();
                    });  
            },
            SC_onDispStatus: function (oEvent) {

                // var that = this;

                var SC_userStatusModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(SC_userStatusModel, "SC_userStatusModel");
                var tableModel = new sap.ui.model.json.JSONModel();
                var oModel = this.getOwnerComponent().getModel("SC");

                var ufilter = [
                    new sap.ui.model.Filter("LvVbeln", sap.ui.model.FilterOperator.EQ, this.SalesId)
                ];
                oModel.read("/UserStatusSet", {
                    filters: ufilter,
                    success: function (oData, oResponse) {
                        tableModel.setData(oData);
                        this.getView().getModel("SC_userStatusModel").setData(oData.results);
                        this.getView().getModel("SC_userStatusModel").refresh();

                    }.bind(this),
                    error: function () {
                        // MessageToast.show("Failed");
                    }
                });

                this.uDialog = Fragment.load({
                    name: "ccgtradingcards.view.fragment.SC_Userstatus",
                    controller: this
                }).then(
                    function (oFrag1) {
                        this.getView().addDependent(oFrag1);
                        oFrag1.open();
                    }.bind(this)
                );
            },
            SC_onMoreImages: function (oEvent) {

                var tableModel = new sap.ui.model.json.JSONModel();
                var oModel = this.getOwnerComponent().getModel("SC");

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
            SC_OnGraderClose: function (oEvent) {

                sap.ui.getCore().byId("SC_GradDialog").close();

            },

            SC_OnUserClose: function (oEvent) {

                sap.ui.getCore().byId("SC_UserDialog").close();

            },
            SC_onNoGradeChange: function (oEvent) {

                var lNoGrade = this.getView().byId("SC_idNoGrade").getSelectedKey();
/*
                if (lNoGrade !== "") {*/
                    /* this.getView().byId("SC_idCenter").setValue();
                    this.getView().byId("SC_idCorner").setValue();
                    this.getView().byId("SC_idEdge").setValue();
                    this.getView().byId("SC_idSurface").setValue(); */
/*                    this.getView().byId("SC_idGrade").setValue();*/
/*                    this.getView().byId("SC_idAutoGrade").setValue();*/
                    //this.getView().byId("SC_idPerChk").setSelected(false);
/*                    this.getView().byId("SC_idGrade").setEnabled(false);*/
                    /* this.getView().byId("SC_idCenter").setEnabled(false);
                    this.getView().byId("SC_idCorner").setEnabled(false);
                    this.getView().byId("SC_idEdge").setEnabled(false);
                    this.getView().byId("SC_idSurface").setEnabled(false); */
/*                    this.getView().byId("SC_idAutoGrade").setEnabled(false);*/
                    //this.getView().byId("SC_idPerChk").setEnabled(false);
/*                    this.GradeChek_SC = "";*/
/*                }*/
/*                if (lNoGrade === "") {*/
/*                   this.getView().byId("SC_idGrade").setEnabled(true);
                    /* this.getView().byId("SC_idCenter").setEnabled(true);
                    this.getView().byId("SC_idCorner").setEnabled(true);
                    this.getView().byId("SC_idEdge").setEnabled(true);
                    this.getView().byId("SC_idSurface").setEnabled(true); */
/*                    this.getView().byId("SC_idAutoGrade").setEnabled(true);*/
                    //this.getView().byId("SC_idPerChk").setEnabled(true);
/*                }*/
            },
            onPristineSelect: function (oEvent) {

                if (this.getView().byId("SC_idPristineChk").getSelected() == true) {

                    this.getView().byId("SC_idGrade").setValue("Pristine 10");
                    this.getView().byId("SC_idGrade").setSelectedKey("10");

                    this.getView().byId("SC_idPerChk").setSelected(false);


                } else {
                    this.getView().byId("SC_idGrade").setValue("");
                    this.getView().byId("SC_idGrade").setSelectedKey("");

                }


            },
            onSignaturePress: function () {

                var that = this;

                if (that.LineId.length === 1) {
                    var LineIDTemp = "00" + that.LineId;
                }
                else if (that.LineId.length === 2) {
                    LineIDTemp = "0" + that.LineId;
                }
                sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then(function (oService) {

                    var href = oService.hrefForExternal({
                        target: {
                            semanticObject: "ZSEMOBJGRAD",
                            action: "register"
                        },
                        params: {
                            "SaleOrder": that.SalesId,
                            "LineItem": LineIDTemp
                        }
                    });
                    var finalUrl = window.location.href.split("#")[0] + href;
                    sap.m.URLHelper.redirect(finalUrl, true);

                });

            },
            SetLineItem: function (ItemId) {

                this.getView().byId("idLineItem").setValue(ItemId);
                this.getView().byId("idLineItem").setSelectedKey(ItemId);


            },

            // Sports card code end....................................................................

            showBusyIndicator: function (iDuration, iDelay) {
                BusyIndicator.show(iDelay);

                if (iDuration && iDuration > 0) {
                    if (this._sTimeoutId) {
                        clearTimeout(this._sTimeoutId);
                        this._sTimeoutId = null;
                    }

                    this._sTimeoutId = setTimeout(function () {
                        this.hideBusyIndicator();
                    }.bind(this), iDuration);
                }
            },
            hideBusyIndicator: function () {
                BusyIndicator.hide();
            },

            getLabelLine: function (salesOrder, LineItem, View) {

                var that = this;
                var filter = [
                    new sap.ui.model.Filter("Vbeln", sap.ui.model.FilterOperator.EQ, salesOrder),
                    new sap.ui.model.Filter("Posnr", sap.ui.model.FilterOperator.EQ, LineItem)
                ];

                this.oModel.read("/SignLabelLineSet", {
                    filters: filter,
                    success: function (oData, oResponse) {
                        that.setDatatoLabelLines(oData, View);
                    },
                    error: function () {

                    }

                })

            },
            onRefreshLblLns: function () {
                this.getLabelLine(this.SalesId, this.LineId, this.ViewType);
            },
            setDatatoLabelLines: function (oData, View) {
                if (oData.results.length > 0) {
                    if (oData.results[0].Labellines1)
                        var LabelLines = oData.results[0].Labellines1
                    if (oData.results[0].Labellines2)
                        LabelLines = LabelLines + "/n" + oData.results[0].Labellines2;
                    if (oData.results[0].Labellines3)
                        LabelLines = LabelLines + "/n" + oData.results[0].Labellines3;
                    if (oData.results[0].Labellines4)
                        LabelLines = LabelLines + "/n" + oData.results[0].Labellines4;
                    if (View === "S") {
                        this.getView().byId("SigLblLinesID_SC").setValue(LabelLines);
                    }
                    else {
                        this.getView().byId("SigLblLinesID_TC").setValue(LabelLines);
                    }
                } else {
                    if (View === "S") {
                        this.getView().byId("SigLblLinesID_SC").setValue("");
                    }
                    else {
                        this.getView().byId("SigLblLinesID_TC").setValue("");
                    }

                }

            },
            
            onGameValueHelp : function(){

                var that = this,
                oView = this.getView();
                //that.getView().getModel("GameModel").setData();
                //that.getView().getModel("GameModel").refresh();
               

                        if (!that.gameCodeD) {
                            that.gameCodeD = Fragment.load({
                                id: oView.getId(),
                                name: "ccgtradingcards.view.fragment.GameCode",
                                controller: that
                            }).then(function (oDialogGC) {
                                
                                oView.addDependent(oDialogGC);
                                return oDialogGC;
                            }.bind(that));
                        }
                        that.gameCodeD.then(function(oDialogGC) {
                            oDialogGC.open();
                         }); 
                        

                        /*  var filter = [
                            new sap.ui.model.Filter("GameCode", sap.ui.model.FilterOperator.EQ, salesOrder),
                            new sap.ui.model.Filter("Active", sap.ui.model.FilterOperator.EQ, LineItem)
                        ]; */


            },
            onLangValueHelp : function(){

                var that = this,
                oView = this.getView();
               

                        if (!that.LangCode) {
                            that.LangCode = Fragment.load({
                                id: oView.getId(),
                                name: "ccgtradingcards.view.fragment.LangCode",
                                controller: that
                            }).then(function (oDialogLC) {
                                
                                oView.addDependent(oDialogLC);
                                return oDialogLC;
                            }.bind(that));
                        }
                        that.LangCode.then(function(oDialogLC) {
                            oDialogLC.open();
                         }); 

            },
            onSetValueHelp : function(){

                var that = this,
                oView = this.getView();
               

                        if (!that.SetCode) {
                            that.SetCode = Fragment.load({
                                id: oView.getId(),
                                name: "ccgtradingcards.view.fragment.SetCode",
                                controller: that
                            }).then(function (oDialogSC) {
                                
                                oView.addDependent(oDialogSC);
                                return oDialogSC;
                            }.bind(that));
                        }
                        that.SetCode.then(function(oDialogSC) {
                            oDialogSC.open();
                         }); 

            },
            onVariantValueHelp : function(oEvent){

                var that = this,
                oView = this.getView();
                this.variantID = oEvent.getSource().getId();

                        if (!that.VariantCode) {
                            that.VariantCode = Fragment.load({
                                id: oView.getId(),
                                name: "ccgtradingcards.view.fragment.VariantCode",
                                controller: that
                            }).then(function (oDialogVC) {
                                
                                oView.addDependent(oDialogVC);
                                return oDialogVC;
                            }.bind(that));
                        }
                        that.VariantCode.then(function(oDialogVC) {
                            oDialogVC.open();
                         }); 

            },
            onVariantValueHelp2 : function(oEvent){

                var that = this,
                oView = this.getView();
                this.variantID = oEvent.getSource().getId();

                        if (!that.VariantCode2) {
                            that.VariantCode2 = Fragment.load({
                                id: oView.getId(),
                                name: "ccgtradingcards.view.fragment.VariantCode",
                                controller: that
                            }).then(function (oDialogVC2) {
                                
                                oView.addDependent(oDialogVC2);
                                return oDialogVC2;
                            }.bind(that));
                        }
                        that.VariantCode2.then(function(oDialogVC2) {
                            oDialogVC2.open();
                         }); 

            },
            onRarityValueHelp : function(){

                var that = this,
                oView = this.getView();
                
               

                        if (!that.Rarity) {
                            that.Rarity = Fragment.load({
                                id: oView.getId(),
                                name: "ccgtradingcards.view.fragment.Rarity",
                                controller: that
                            }).then(function (oDialogRarity) {
                                
                                oView.addDependent(oDialogRarity);
                                return oDialogRarity;
                            }.bind(that));
                        }
                        that.Rarity.then(function(oDialogRarity) {
                            oDialogRarity.open();
                         }); 

            },
            onColorValueHelp : function(){

                var that = this,
                oView = this.getView();
               

                        if (!that.Color) {
                            that.Color = Fragment.load({
                                id: oView.getId(),
                                name: "ccgtradingcards.view.fragment.ColorCode",
                                controller: that
                            }).then(function (oDialogColor) {
                                
                                oView.addDependent(oDialogColor);
                                return oDialogColor;
                            }.bind(that));
                        }
                        that.Color.then(function(oDialogColor) {
                            oDialogColor.open();
                         }); 

            },
            onXPMSValueHelp : function(){

                var that = this,
                oView = this.getView();
               

                        if (!that.XPMS) {
                            that.XPMS = Fragment.load({
                                id: oView.getId(),
                                name: "ccgtradingcards.view.fragment.XPMS",
                                controller: that
                            }).then(function (oDialogXPMS) {
                                //oDialogXPMS.setModel();
                                oView.addDependent(oDialogXPMS);
                                return oDialogXPMS;
                            }.bind(that));
                        }
                        that.XPMS.then(function(oDialogXPMS) {
                            oDialogXPMS.open();
                         }); 

                         
                var gFilter = [];
                     gFilter.push(new sap.ui.model.Filter("Mmsta", sap.ui.model.FilterOperator.NE, ""));
                     gFilter.push(new sap.ui.model.Filter("Mtstb", sap.ui.model.FilterOperator.NE, ""));
                 

                 var XPMS = this.GetTradingCardValueHelp("/HT141Set",gFilter,"XPMS");

            },
            onButtonGameSearch : function(){

                var gFilter = [];
               var gamecode = this.getView().byId("gameCode_GC").getValue();
                /* if (gamecode) { */
                    gFilter.push(new sap.ui.model.Filter("GameCode", sap.ui.model.FilterOperator.Contains, gamecode));
                
                var Active_GC = this.getView().byId("Active_GC").getValue();
                if (Active_GC) {
                    gFilter.push(new sap.ui.model.Filter("Active", sap.ui.model.FilterOperator.Contains, Active_GC));
                }
                var NameSearch = this.getView().byId("NameSearch").getValue();
                if (NameSearch) {
                    gFilter.push(new sap.ui.model.Filter("GameNameSearch", sap.ui.model.FilterOperator.Contains, NameSearch));
                }
                var MakerFlag = this.getView().byId("MakerFlag").getValue();
                if (MakerFlag) {
                    gFilter.push(new sap.ui.model.Filter("MakerFlag", sap.ui.model.FilterOperator.Contains, MakerFlag));
                }
                var Name = this.getView().byId("Name").getValue();
                if (Name) {
                    gFilter.push(new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, Name));
                }

                var GameCode = this.GetTradingCardValueHelp("/ZmmCardgamecodeSet",gFilter,"GameModel");

            },
            onButtonLangSearch : function(){

                var gFilter = [];
               var LangCode_LC = this.getView().byId("LangCode_LC").getValue();
                if (LangCode_LC) {
                    gFilter.push(new sap.ui.model.Filter("LangCode", sap.ui.model.FilterOperator.Contains, LangCode_LC));
                }
                var GameCode_LC = this.getView().byId("GameCode_LC").getValue();
                if (GameCode_LC) {
                    gFilter.push(new sap.ui.model.Filter("GameCode", sap.ui.model.FilterOperator.Contains, GameCode_LC));
                }
                var LAF_LC = this.getView().byId("LAF_LC").getValue();
                if (LAF_LC) {
                    gFilter.push(new sap.ui.model.Filter("LanguageActive", sap.ui.model.FilterOperator.Contains, LAF_LC));
                }
                var Language_name_LC = this.getView().byId("Language_name_LC").getValue();
                if (Language_name_LC) {
                    gFilter.push(new sap.ui.model.Filter("LanguageName", sap.ui.model.FilterOperator.Contains, Language_name_LC));
                }
                var LanguageSearch = this.getView().byId("LanguageSearch").getValue();
                if (LanguageSearch) {
                    gFilter.push(new sap.ui.model.Filter("LanguageSearchTxt", sap.ui.model.FilterOperator.Contains, LanguageSearch));
                }

                var GameCode = this.GetTradingCardValueHelp("/ZmmCardlangcodeSet",gFilter,"LangModel");
            },
            onButtonSetSearch : function(){

                var gFilter = [];
               var LangCode_SC = this.getView().byId("LangCode_SC").getValue();
                if (LangCode_SC) {
                    gFilter.push(new sap.ui.model.Filter("LangCode", sap.ui.model.FilterOperator.Contains, LangCode_SC));
                }
                var GameCode_SC = this.getView().byId("GameCode_SC").getValue();
                if (GameCode_SC) {
                    gFilter.push(new sap.ui.model.Filter("GameCode", sap.ui.model.FilterOperator.Contains, GameCode_SC));
                }
                var MakerCode_SC = this.getView().byId("MakerCode_SC").getValue();
                if (MakerCode_SC) {
                    gFilter.push(new sap.ui.model.Filter("MakerCode", sap.ui.model.FilterOperator.Contains, MakerCode_SC));
                }
                var SetCode_SC = this.getView().byId("SetCode_SC").getValue();
                if (SetCode_SC) {
                    gFilter.push(new sap.ui.model.Filter("SetCode", sap.ui.model.FilterOperator.Contains, SetCode_SC));
                }
                var GameSetActive_SC = this.getView().byId("GameSetActive_SC").getValue();
                if (GameSetActive_SC) {
                    gFilter.push(new sap.ui.model.Filter("SetActive", sap.ui.model.FilterOperator.Contains, GameSetActive_SC));
                }
                var SuperSet_SC = this.getView().byId("SuperSet_SC").getValue();
                if (SuperSet_SC) {
                    gFilter.push(new sap.ui.model.Filter("SupersetFlag", sap.ui.model.FilterOperator.Contains, SuperSet_SC));
                }
                var SetName_SC = this.getView().byId("SetName_SC").getValue();
                if (SetName_SC) {
                    gFilter.push(new sap.ui.model.Filter("SetName", sap.ui.model.FilterOperator.Contains, SetName_SC));
                }
                var SetLblTxt_SC = this.getView().byId("SetLblTxt_SC").getValue();
                if (SetLblTxt_SC) {
                    gFilter.push(new sap.ui.model.Filter("SetLabelText", sap.ui.model.FilterOperator.Contains, SetLblTxt_SC));
                }
                var SetNameSearch_SC = this.getView().byId("SetNameSearch_SC").getValue();
                if (SetNameSearch_SC) {
                    gFilter.push(new sap.ui.model.Filter("SetNameSearchTxt", sap.ui.model.FilterOperator.Contains, SetNameSearch_SC));
                }

                var SetCode = this.GetTradingCardValueHelp("/ZmmCgsetcodeSet",gFilter,"SetModel");

            },
            onButtonVariantSearch : function(){

                var gFilter = [];

                var VariantCode_VC = this.getView().byId("VariantCode_VC").getValue();
                if (VariantCode_VC) {
                    gFilter.push(new sap.ui.model.Filter("VariantCode", sap.ui.model.FilterOperator.Contains, VariantCode_VC));
                }
               var LangCode_VC = this.getView().byId("LangCode_VC").getValue();
                if (LangCode_VC) {
                    gFilter.push(new sap.ui.model.Filter("LangCode", sap.ui.model.FilterOperator.Contains, LangCode_VC));
                }
                var GameCode_VC = this.getView().byId("GameCode_VC").getValue();
                if (GameCode_VC) {
                    gFilter.push(new sap.ui.model.Filter("GameCode", sap.ui.model.FilterOperator.Contains, GameCode_VC));
                }
               
                
                var VariantActive_VC = this.getView().byId("VariantActive_VC").getValue();
                if (VariantActive_VC) {
                    gFilter.push(new sap.ui.model.Filter("VariantActive", sap.ui.model.FilterOperator.Contains, VariantActive_VC));
                }

                var VariantName_VC = this.getView().byId("VariantName_VC").getValue();
                if (VariantName_VC) {
                    gFilter.push(new sap.ui.model.Filter("VariantName", sap.ui.model.FilterOperator.Contains, VariantName_VC));
                }
                
                var VariantLblTxt_VC = this.getView().byId("VariantLblTxt_VC").getValue();
                if (VariantLblTxt_VC) {
                    gFilter.push(new sap.ui.model.Filter("VariantLabelTxt", sap.ui.model.FilterOperator.Contains, VariantLblTxt_VC));
                }
               
                var VariantNameSearch_VC = this.getView().byId("VariantNameSearch_VC").getValue();
                if (VariantNameSearch_VC) {
                    gFilter.push(new sap.ui.model.Filter("VariantNameSrch", sap.ui.model.FilterOperator.Contains, VariantNameSearch_VC));
                }

                var VariantCode = this.GetTradingCardValueHelp("/ZmmCgvariantSet",gFilter,"VariantModel");


            },
            onButtonRaritySearch : function(oEvent){

                var gFilter = [];

                var RarityCode_VC = this.getView().byId("RarityCode_RC").getValue();
                if (RarityCode_VC) {
                    gFilter.push(new sap.ui.model.Filter("RarityCode", sap.ui.model.FilterOperator.Contains, RarityCode_VC));
                }
               var LangCode_VC = this.getView().byId("LangCode_RC").getValue();
                if (LangCode_VC) {
                    gFilter.push(new sap.ui.model.Filter("LangCode", sap.ui.model.FilterOperator.Contains, LangCode_VC));
                }
                var GameCode_VC = this.getView().byId("GameCode_RC").getValue();
                if (GameCode_VC) {
                    gFilter.push(new sap.ui.model.Filter("GameCode", sap.ui.model.FilterOperator.Contains, GameCode_VC));
                }
               
                
                var RarityActive_VC = this.getView().byId("RarityActive_RC").getValue();
                if (RarityActive_VC) {
                    gFilter.push(new sap.ui.model.Filter("RarityActive", sap.ui.model.FilterOperator.Contains, RarityActive_VC));
                }

                var RarityName_VC = this.getView().byId("RarityName_RC").getValue();
                if (RarityName_VC) {
                    gFilter.push(new sap.ui.model.Filter("RarityName", sap.ui.model.FilterOperator.Contains, RarityName_VC));
                }
                
                var RarityLblTxt_VC = this.getView().byId("RarityLblTxt_RC").getValue();
                if (RarityLblTxt_VC) {
                    gFilter.push(new sap.ui.model.Filter("RarityLabelText", sap.ui.model.FilterOperator.Contains, RarityLblTxt_VC));
                }
               
                var RarityNameSearch_VC = this.getView().byId("RarityNameSearch_RC").getValue();
                if (RarityNameSearch_VC) {
                    gFilter.push(new sap.ui.model.Filter("RaritySearchTxt", sap.ui.model.FilterOperator.Contains, RarityNameSearch_VC));
                }

                var GameCode = this.GetTradingCardValueHelp("/ZmmCgraritycodSet",gFilter,"RarityModel");



            },
            onButtonColorSearch : function(){

                var gFilter = [];

                var ColorCode_CC = this.getView().byId("ColorCode_CC").getValue();
                if (ColorCode_CC) {
                    gFilter.push(new sap.ui.model.Filter("ColorCode", sap.ui.model.FilterOperator.Contains, ColorCode_CC));
                }
               var LangCode_CC = this.getView().byId("LangCode_CC").getValue();
                if (LangCode_CC) {
                    gFilter.push(new sap.ui.model.Filter("LangCode", sap.ui.model.FilterOperator.Contains, LangCode_CC));
                }
                var GameCode_CC = this.getView().byId("GameCode_CC").getValue();
                if (GameCode_CC) {
                    gFilter.push(new sap.ui.model.Filter("GameCode", sap.ui.model.FilterOperator.Contains, GameCode_CC));
                }
               
                
                var ColorActive_CC = this.getView().byId("ColorActive_CC").getValue();
                if (ColorActive_CC) {
                    gFilter.push(new sap.ui.model.Filter("ColorActive", sap.ui.model.FilterOperator.Contains, ColorActive_CC));
                }

                var ColorName_CC = this.getView().byId("ColorName_CC").getValue();
                if (ColorName_CC) {
                    gFilter.push(new sap.ui.model.Filter("ColorName", sap.ui.model.FilterOperator.Contains, ColorName_CC));
                }
                
                var ColorLblTxt_CC = this.getView().byId("ColorLblTxt_CC").getValue();
                if (ColorLblTxt_CC) {
                    gFilter.push(new sap.ui.model.Filter("ColorLabelText", sap.ui.model.FilterOperator.Contains, ColorLblTxt_CC));
                }
               
                var ColorNameSearch_CC = this.getView().byId("ColorNameSearch_CC").getValue();
                if (ColorNameSearch_CC) {
                    gFilter.push(new sap.ui.model.Filter("ColorNameSrch", sap.ui.model.FilterOperator.Contains, ColorNameSearch_CC));
                }

                var GameCode = this.GetTradingCardValueHelp("/ZmmCgcolorcodeSet",gFilter,"ColorModel");

            },
            onListItemXPMSPress : function(oEvent){
                var that = this;
                var title = oEvent.getSource().mProperties.title;
                var description = oEvent.getSource().mProperties.number;
                this.byId("XPMS").close();
                sap.ui.getCore().byId("TC_X_Plant_Mat_Status").setValue(title);
                
                

            },
            RefreshValuehelpModel : function(model){

                this.getView().getModel(model).setData([]);
                this.getView().getModel(model).refresh();

            },
           /*  refreshGameCode : function(){
                sap.ui.getCore().byId("gameCode_GC").setValue("");
                sap.ui.getCore().byId("Active_GC").setValue("");
                sap.ui.getCore().byId("Name").setValue("");
                sap.ui.getCore().byId("MakerFlag").setValue("");
                sap.ui.getCore().byId("NameSearch").setValue("");

            },
            refreshLangCode : function(){

            }, */
            GameCode_rowSelected : function(oEvent){
                this.selectedGameRow = oEvent.getSource().getModel("GameModel").getData()[oEvent.getSource().getSelectedIndex()];
                sap.ui.getCore().byId("TC_idInputGameCode").setValue(this.selectedGameRow.GameCode);
                this.byId("gameCode").close();
                this.RefreshValuehelpModel("GameModel");
            },
            LangCode_rowSelected : function(oEvent){
                this.selectedLangRow = oEvent.getSource().getModel("LangModel").getData()[oEvent.getSource().getSelectedIndex()];
                sap.ui.getCore().byId("TC_idInputLanguage").setValue(this.selectedLangRow.LangCode);
                this.byId("LangCode").close();
                this.RefreshValuehelpModel("LangModel");
            },
            RarityCode_rowSelected : function(oEvent){
                this.selectedRarityRow = oEvent.getSource().getModel("RarityModel").getData()[oEvent.getSource().getSelectedIndex()];
                sap.ui.getCore().byId("TC_idInputRarity").setValue(this.selectedRarityRow.RarityCode);
                this.byId("Rarity").close();
                this.RefreshValuehelpModel("RarityModel");
            },
            ColorCode_rowSelected : function(oEvent){
                this.selectedColorRow = oEvent.getSource().getModel("ColorModel").getData()[oEvent.getSource().getSelectedIndex()];
                sap.ui.getCore().byId("TC_Color_code").setValue(this.selectedColorRow.ColorCode);
                this.byId("Color").close();
                this.RefreshValuehelpModel("ColorModel");
            },
            SetCode_rowSelected : function(oEvent){
                this.selectedSetRow = oEvent.getSource().getModel("SetModel").getData()[oEvent.getSource().getSelectedIndex()];
                sap.ui.getCore().byId("TC_idInputSetCode").setValue(this.selectedSetRow.SetCode);
                this.byId("SetCode").close();
                this.RefreshValuehelpModel("SetModel");
            },
            variantCode1_rowSelected : function(oEvent){
                this.selectedVariantRow = oEvent.getSource().getModel("VariantModel").getData()[oEvent.getSource().getSelectedIndex()];
               if(this.variantID == 'TC_idInputVart1'){
                sap.ui.getCore().byId("TC_idInputVart1").setValue(this.selectedVariantRow.VariantCode);
                this.byId("VariantCode").close();

               }else{
                sap.ui.getCore().byId("TC_idInputVart2").setValue(this.selectedVariantRow.VariantCode);
                this.byId("VariantCode").close();
               }
               this.RefreshValuehelpModel("VariantModel");
            },
            /* GameCode_rowSelected : function(){
                this.selectedGameRow = oEvent.getSource().getModel("GameModel").getData()[oEvent.getSource().getSelectedIndex()];
            }, */
            CancelGameCode : function(){
                this.byId("gameCode").close();
                this.RefreshValuehelpModel("GameModel");
            },
            CancelLangCode : function(){
                this.byId("LangCode").close();
                this.RefreshValuehelpModel("LangModel");
            },
            CancelRarityCode : function(){
                this.byId("Rarity").close();
                this.RefreshValuehelpModel("RarityModel");
            },
            CancelColorCode : function(){
                this.byId("Color").close();
                this.RefreshValuehelpModel("ColorModel");
            },
            CancelSetCode : function(){
                this.byId("SetCode").close();
                this.RefreshValuehelpModel("SetModel");
            },
            CancelVariantCode : function(){
                this.byId("VariantCode").close();
                this.RefreshValuehelpModel("VariantModel");
            },

            
             GetTradingCardValueHelp : function(EntitySet, filter,model){
                var that = this;

                this.oModel.read(EntitySet, {
                    filters: filter,
                    success: function (oData, oResponse) {
                        
                        var Model = new sap.ui.model.json.JSONModel(oData.results);
                        that.getView().setModel(Model,model);
                        return oData.results;
                    },
                    error: function (oFail) {
                            MessageBox.error("Failed to get the Data");
                    }

                });


            } 
        });
    });
