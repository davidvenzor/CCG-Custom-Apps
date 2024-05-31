sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment, MessageBox, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("SS.signaturescan.controller.SignatureMain", {
            onInit: function () {
               
                this.oModel  = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSIGNATUREAPP_SRV/");
                this.getSignatureData("S","SignedModel");
                this.getSignatureData("T","ArtistName");
                this.onTableDefaultmodel([]);
                this.getViewInfo();
                
                   var oStartupParameters = this.getMyComponent().getComponentData().startupParameters;
                 if(oStartupParameters.SaleOrder){

                    this.SalesOrderNo = oStartupParameters.SaleOrder[0];
                    this.LineNo = oStartupParameters.LineItem[0];
                    this.getSalesOrderData(this.SalesOrderNo,this.LineNo);

                }   
            },
            getMyComponent: function() {
                "use strict";
                var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
                return sap.ui.component(sComponentId);
            },
            getSalesOrderData : function(salesOrder,LineItem)
            {
                
                var that  = this;
                var filter = [
                    new sap.ui.model.Filter("Vbeln", sap.ui.model.FilterOperator.EQ, salesOrder),
                    new sap.ui.model.Filter("Posnr", sap.ui.model.FilterOperator.EQ, LineItem)
                ];

                this.oModel.read("/SignatureSet", {
                    filters: filter,
                    success : function(oData, oResponse){

                        that.formatData(oData.results);
                        

                    },
                    error : function(oFail){

                    }
                });


            },
            formatData : function(odata){

                var that = this;

                odata.forEach(function(value){
                    var date1 = value.SignedOn;
                    var date2 = value.AddedDate;
                    var SignedDateFormat = that.getDateFormat("2",date1);
                    var Mandt =  that.getDateFormat("1", date1);
                    var addedDate = that.getDateFormat("1",date2);
                    value.SeqNo   = value.SeqNo,
                    value.SignatureType = value.SignatureType,
                    value.ArtistName    = value.ArtistName,
                    value.Abbrevation   = value.Labellines1,
                    value.SignedDate    = value.SignedOn,
                    value.SignedOn      = SignedDateFormat,
                    value.PrintSort     = value.Mandt,
                    value.Mandt         = Mandt,
                    value.AddedBy       = value.AddedBy,
                    value.AddedDate     = addedDate
                    
                    

                });

                that.onTableDefaultmodel(odata);
                this.SignatureLblLines(odata);

                    

            },
            getViewInfo :function(){
                var that = this;
                

                this.oModel.read("/SignatureSet",{
					success : function(oData,oResponse){
                        that.AddedBy = oData.results[0].AddedBy;
                        that.CreatedOn = oData.results[0].AddedDate;
                                            ;
                    }
                }); 

            },
            
            onTableDefaultmodel: function (oData) {

                var osignatureTbldata = new sap.ui.model.json.JSONModel(oData);
                this.getView().setModel(osignatureTbldata, "osignatureTbldata");
            },
            getDateFormat : function(format,date){

                this.year1 = date.getFullYear();
                this.mes1 = date.getMonth()+1;
                this.dia1 = date.getDate();
                if(this.mes1.toString().length == 1)
                {
                    this.mes1 = "0"+this.mes1;
                }
                if(this.dia1.toString().length == 1){

                    this.dia1 = "0"+this.dia1;
                }
                if(format == '1'){
                    return this.year1+"-"+ this.mes1 +"-"+ this.dia1;
                }else if(format == '2'){
                    return this.mes1+"/"+ this.dia1 +"/"+ this.year1;  //MM/dd/YYYY
                }
                

            },
            onAddEnter : function () {
                var that = this;
                this.SelctedItems = [];
                this.Date = this.getView().byId("DateId").getDateValue();
                this.SignedDateFormat = this.getView().byId("DateId").getValue();
                var SignedOnformat = this.getView().byId("DateId").getDateValue();
                this.addId = this.getView().byId("addId").getValue();
                var oAddedDate = that.CreatedOn;
                /* var year = oAddedDate.getFullYear();
                var mes = oAddedDate.getMonth()+1;
                var dia = oAddedDate.getDate(); */
                this.AddedOn = that.getDateFormat("1", oAddedDate);
                
                /* var year1 = SignedOnformat.getFullYear();
                var mes1 = SignedOnformat.getMonth()+1;
                var dia1 = SignedOnformat.getDate(); */
                this.SignedOnformat = that.getDateFormat("1", SignedOnformat);
                
                
                this.SelctedItems = [{
                    SeqNo   : 0,
                    SignatureType: that.SignTypeText,
                    ArtistName: that.ArtistNameText,
                    Abbrevation : this.ArtistNameTextKey,
                    SignedOn: that.SignedDateFormat,
                    Mandt : this.SignedOnformat,
                    SignedDate : that.Date,
                    AddedBy: that.AddedBy,
                    AddedDate: that.AddedOn,
                    PrintSort : that.SignedTypekey,

                }]
                var oSigTblModel = this.getView().getModel("osignatureTbldata").oData;
                if (oSigTblModel.length == 0) {
                    var osignatureTbldata = new sap.ui.model.json.JSONModel(this.SelctedItems);
                    this.getView().setModel(osignatureTbldata, "osignatureTbldata");
                } else {
                    var osignatureTbldata = this.getView().getModel("osignatureTbldata").oData;
                    this.getView().getModel("osignatureTbldata").oData = osignatureTbldata.concat(this.SelctedItems);
                    this.sortTableData(this.getView().getModel("osignatureTbldata").oData);
                    this.getView().getModel("osignatureTbldata").refresh();
                }
                var oData = this.getView().getModel("osignatureTbldata").oData;
                this.SignatureLblLines(oData);
                this.ClearScreenData();

            },
            SignatureLblLines : function(oData){
                var sigLabel = "";
                var AbbrLabel = "";
                var signType;
                var DateSigned;
                var ArtistName;
                var SplitWord;
                var SignedDate;
                if(oData.length > 0)
                {
                for(var i=0;i<oData.length;i++){

                    SignedDate = oData[i].SignedOn;

                    if(i==0){
                    
                         sigLabel = sigLabel + oData[i].SignatureType + " By "  + oData[i].ArtistName + " On " + oData[i].SignedOn;
                         AbbrLabel = AbbrLabel + oData[i].SignatureType + " By "  + oData[i].Abbrevation + " On " + oData[i].SignedOn;

                            signType   = oData[i].SignatureType;
                            DateSigned = oData[i].SignedDate;
                            ArtistName = oData[i].ArtistName;
                    }else{
                        if(signType == oData[i].SignatureType && DateSigned.getTime() == oData[i].SignedDate.getTime()){
                            SplitWord = "On " + SignedDate;
                            var lastIndex  = sigLabel.lastIndexOf(SplitWord);
                            var sigLabel = sigLabel.slice(0, lastIndex);
                            var lastIndex1  = AbbrLabel.lastIndexOf(SplitWord);
                            var AbbrLabel = AbbrLabel.slice(0, lastIndex1);


                            sigLabel = sigLabel +" , " + oData[i].ArtistName + " On " + oData[i].SignedOn;
                            AbbrLabel = AbbrLabel +" , " + oData[i].Abbrevation + " On " + oData[i].SignedOn;

                        }else if(signType == oData[i].SignatureType){

                            sigLabel = sigLabel +" , " + "By "+ oData[i].ArtistName + " On " + oData[i].SignedOn;
                            AbbrLabel = AbbrLabel +" , " +"By "+ oData[i].Abbrevation + " On " + oData[i].SignedOn;

                        }else{
                            sigLabel = sigLabel + " & " + oData[i].SignatureType + " By " + oData[i].ArtistName + " On " + oData[i].SignedOn;
                            AbbrLabel = AbbrLabel + " & " + oData[i].SignatureType + " By " + oData[i].Abbrevation + " On " + oData[i].SignedOn;

                                signType   = oData[i].SignatureType;
                                DateSigned = oData[i].SignedDate;
                                ArtistName = oData[i].ArtistName;
                                
                        }

                    }

                }
                this.FullLabelLines = sigLabel;
                var Labels = sigLabel.match(/.{1,100}/g);
                var fullWord = "";
                var LabelLine2 = "";
                if(Labels.length>0){
                    for(var i=0;i<Labels.length;i++){
                          
                          if(i>3){
                            LabelLine2 = LabelLine2 + Labels[i] + "\n";
                            this.LabelLines5 = Labels[4];
                            this.LabelLines6 = Labels[5];
                          }else{
                            fullWord = fullWord + Labels[i] + "\n";
                          }
                          
                            this.LabelLines1 = Labels[0];
                            this.LabelLines2 = Labels[1];
                            this.LabelLines3 = Labels[2];
                            this.LabelLines4 = Labels[3];
                            

                    }
                }

                //abbreviation
                var LabelsAbbr = AbbrLabel.match(/.{1,100}/g);
                var fullWordAbbr = "";
                var LabelLine2Abbr = "";
                if(LabelsAbbr.length>0){
                    for(var i=0;i<LabelsAbbr.length;i++){
                        if(i>3){
                            LabelLine2Abbr = LabelLine2Abbr + LabelsAbbr[i] + "\n";
                          }else{
                            fullWordAbbr = fullWordAbbr + LabelsAbbr[i] + "\n";
                          }

                    }
                }

                

                this.getView().byId("SigLblLinesID").setValue(fullWord);
                this.getView().byId("SigOverLblLines2ID").setValue(LabelLine2);
                this.OnBuildLabel = fullWord;
                this.OnAbbrviation = fullWordAbbr;
                this.labelLine2  = LabelLine2;
                this.labelLine2Abbr = LabelLine2Abbr;
            }else{
                this.getView().byId("SigLblLinesID").setValue("");
                this.getView().byId("SigOverLblLines2ID").setValue("");
            }
            },
            onBuildAbbr : function(){

                this.getView().byId("SigLblLinesID").setValue(this.OnAbbrviation);
                this.getView().byId("SigOverLblLines2ID").setValue(this.labelLine2Abbr);

            },
            onBuildSignLine : function(){

                this.getView().byId("SigLblLinesID").setValue(this.OnBuildLabel);
                this.getView().byId("SigOverLblLines2ID").setValue(this.labelLine2);

            },
            sortTableData : function(arrayTable){

                arrayTable.sort(function(a, b){
                   
                    if(a.PrintSort === b.PrintSort){
                        return a.SignedDate-b.SignedDate;
                    }else{
                        return a.PrintSort - b.PrintSort;
                    }
                    
                    
                });

            },
            ClearScreenData : function(){
                this.getView().byId("DateId").setValue("");
                this.getView().byId("addId").setValue("");
                this.getView().byId("sigTypeID").setSelectedKey("");
                this.getView().byId("sigTypeID").setValue("");
                this.getView().byId("artistNameID").setValue("");
                this.getView().byId("artistNameID").setSelectedKey("");
               

            },
            onSignClearPress : function(){

                this.ClearScreenData();

            },
            onSignRemovePress : function(){

                var sPath = this.getView().byId("SignatureTbl").getSelectedIndices();

                /* var arrayPaths = [];
                 sPath.forEach(function(path){
                    var paths = path.split("/results/");
                    sPath.push(paths[1]);

                 }); */

                 sPath.sort(function(a, b) {
                    return b - a;
                  });

                var length = sPath.length;
                for(var i=0;i<length;i++){
                    //var AtbRowPath = sPath[i].substr(-1);
                    this.getView().getModel("osignatureTbldata").oData.splice(sPath[i],1);
                    
                }
                sPath = [];
                this.getView().getModel("osignatureTbldata").refresh();
                var oData = this.getView().getModel("osignatureTbldata").oData;
                this.SignatureLblLines(oData);
                

            },
            onScanInvoicesPress: function () {

                var that = this,
                    oView = this.getView();
                if (!that.oScanInvoiceDialog) {
                    that.oScanInvoiceDialog = Fragment.load({
                        id: oView.getId(),
                        name: "SS.signaturescan.fragment.ScanInvoice",
                        controller: that
                    }).then(function (oDialog) {
                        oDialog.setModel();
                        oView.addDependent(oDialog);
                        return oDialog;
                    }.bind(that));
                }
                that.oScanInvoiceDialog.then(function (oDialog) {
                    oDialog.open();
                    if(that.SalesOrderNo){
                        var SO = that.SalesOrderNo.concat(that.LineNo);
                        that.getView().byId("ScanInvoice_SortID").setValue(SO);
                        that.getView().byId("ScanInvoice_SortID").setEnabled(false);
                    }
                });

                this.osignatureTbldata = this.getView().getModel("osignatureTbldata").oData;
                this.osignatureTbldata.forEach(function(value){
                    value.SignedOn  = value.Mandt+"T00:00:0";
                    value.AddedDate = value.AddedDate+"T00:00:0";

                    
                });
                

            },
            handleCloseScanPress: function () {
                var that = this;
                that.getView().byId("ScanInvoice_SortID").setValue("");
                this.oScanInvoiceDialog.then(function (oDialog) {
                    oDialog.close();
                });

                this.osignatureTbldata = this.getView().getModel("osignatureTbldata").oData;
                this.osignatureTbldata.forEach(function(value){
                    value.SignedOn  = that.Date;
                    value.AddedDate = that.AddedOn;

                    
                });

            },
            handleSubmitScanPress: function () {
                var that = this;
                var FilterVbeln;
                var FilterPosnr;
                var vbeln = this.getView().byId("ScanInvoice_SortID").getValue();
                if(vbeln.length>10){
                    var vbelnArray = vbeln.match(/.{1,10}/g);
                    FilterVbeln  = vbelnArray[0];
                    FilterPosnr  = vbelnArray[1];

                }else{

                    FilterVbeln              = this.getView().byId("ScanInvoice_SortID").getValue();
                    FilterPosnr              = "";
                }

                that.GetLabelLine(FilterVbeln,FilterPosnr)
                .then(function (oApp) {
                    that.SubmitSignDetails(oApp);

                }, true);

                
            },

            SubmitSignDetails : function(){
                var that = this;
                 this.busyDialogCUUpload = new sap.m.BusyDialog({

                    text: "Please wait...",

                });
                this.busyDialogCUUpload.open();
                var payload = {};

                var osignatureTbldata = this.getView().getModel("osignatureTbldata").oData;
                osignatureTbldata.forEach(function(value){

                    delete value.Abbrevation;
                    delete value.PrintSort;
                    delete value.SignedDate;
                    delete value.Mandt;
                    if(value.SeqNo>0){
                        payload.Flag = 'X'
                    }
                    
                });
                var LableLines  = this.getView().byId("SigLblLinesID").getValue();
                var vbeln = this.getView().byId("ScanInvoice_SortID").getValue();

                if(vbeln.length>10){
                    var vbelnArray = vbeln.match(/.{1,10}/g);
                    payload.Vbeln  = vbelnArray[0];
                    payload.Posnr  = vbelnArray[1];
                    if(payload.Flag == 'X'){

                        payload.Flag   = '';
                    }else{
                        payload.Flag   =  'Y';
                    }
                    

                }else{

                payload.Vbeln              = this.getView().byId("ScanInvoice_SortID").getValue();
                payload.Posnr              = "";
                payload.Flag   =  'Y';
                }
                
                //Parse full line into segments
                var fullLabel = LableLines.match(/.{1,100}/g);
                if(fullLabel.length>0){
                    payload.LabelLines1 = fullLabel[0];
                }
                if(fullLabel.length>1){
                    payload.LabelLines2 = fullLabel[1];
                }
                if(fullLabel.length>2){
                    payload.LabelLines3 = fullLabel[2];
                }
                if(fullLabel.length>3){
                    payload.LabelLines4 = fullLabel[3];
                }
                if(fullLabel.length>4){
                    payload.LabelLines5 = fullLabel[4];
                }
                if(fullLabel.length>5){
                    payload.LabelLines6 = fullLabel[5];
                }
                //payload.LabelLines1         = this.LabelLines1;
                //payload.LabelLines2         = this.LabelLines2;
                //payload.LabelLines3         = this.LabelLines3;
                //payload.LabelLines4         = this.LabelLines4;
                //payload.LabelLines5         = this.LabelLines5;
                //payload.LabelLines6         = this.LabelLines6;
                payload.SignatureSet            = this.osignatureTbldata;
                var oDataModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSIGNATUREAPP_SRV/");
                oDataModel.create("/Signature_hdrSet", payload, {
                    success: function (data, response) {
                        that.busyDialogCUUpload.close();
                        MessageBox.success("Successfully Scaned");
                        that.handleCloseScanPress();
                        that.getView().getModel("osignatureTbldata").oData = [];
                        that.getView().getModel("osignatureTbldata").refresh();
                        that.getView().byId("SigLblLinesID").setValue("");
                        that.getView().byId("SigOverLblLines2ID").setValue("");

                        
                    },
                    error: function (error) {
                        that.busyDialogCUUpload.close();
                        MessageBox.error("failed to update, Please Contact Technical Team ");
                        that.handleCloseScanPress();
                    }
                });
            },
            
            onSignatureMaintain : function(){

                var that = this,
                    oView = this.getView();
                if (!that.oSignatureMaintain) {
                    that.oSignatureMaintain = Fragment.load({
                        id: oView.getId(),
                        name: "SS.signaturescan.fragment.MaintainSign",
                        controller: that
                    }).then(function (oDialogSignM) {
                        oDialogSignM.setModel();
                        oView.addDependent(oDialogSignM);
                        return oDialogSignM;
                    }.bind(that));
                }
                that.oSignatureMaintain.then(function (oDialogSignM) {
                    oDialogSignM.open();
                });

                
            },
            handleCloseMntSignPress: function () {

                this.oSignatureMaintain.then(function (oDialogSignM) {
                    oDialogSignM.close();
                });

            },

            onSigTypeDdSelected: function (oEvent) {
                this.SignTypeText = oEvent.getSource().getSelectedItem().getAdditionalText();
                this.SignTypeValue = oEvent.mParameters.value;
                this.SignedTypekey  = this.getView().byId("sigTypeID").getSelectedKey();

            },
            onArtNameSelected: function (oEvent) {
                this.ArtistNameText = oEvent.getParameters().selectedItem.mProperties.text;
                this.ArtistNameTextKey = oEvent.getParameters().selectedItem.mProperties.key;

            },

            getSignatureData: function (FilterValue, model) {

                var filtern = [
                    new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, FilterValue)
                ];
                this.oModel.read("/Sign_DropDownSet", {
                    filters: filtern,
                    success: function (oData, oResponse) {
                        var SignatureModel = new sap.ui.model.json.JSONModel(oData.results);
                        if(model == "ArtistName"){
                            SignatureModel.setSizeLimit(100000);
                        }
                        this.getView().setModel(SignatureModel, model);

                    }.bind(this),

                    error: function () {
                        MessageToast.show("Sub-Grades failed to Load, Please Contact Technical Team");
                    }
                });
            },
            onBtnSignMntPress : function(){
                var that = this;
                var sigCode          = this.getView().byId("CG_SignTypeCode").getValue();
                var sigDescription   = this.getView().byId("SignDesc").getValue();
                var SignDisSort      = this.getView().byId("CG_SignDisplaySort").getValue();
                var SignPrintSort    = this.getView().byId("CG_SignPrintSort").getValue();
                var oSignType = {};
                oSignType.ImFlag     = "S"
                oSignType.LvPosnr    = SignDisSort
                oSignType.LvVbeln    = SignPrintSort
                oSignType.CharValue  = sigCode;
                oSignType.DescrCval  = sigDescription;
                oSignType.NameChar   = "";
                oSignType.Name       = "";

                this.oModel.create("/Sign_DropDownSet",oSignType,{
                    success : function(oData,oResponse){
                        MessageBox.success("Signature type Saved successfully");
                        that.handleCloseMntSignPress();
                        that.SignTypeInputClear();
                        that.getSignatureData("S","SignedModel");

                    },
                    error(oFail){
                        MessageBox.error(" failed to update Sign type, Please Contact Technical Team");
                        that.handleCloseMntSignPress();

                    }


                });

            },
            SignTypeInputClear : function(){

                this.getView().byId("CG_SignTypeCode").setValue("");
                this.getView().byId("SignDesc").setValue("");
                this.getView().byId("CG_SignDisplaySort").setValue("");
                this.getView().byId("CG_SignPrintSort").setValue("");


            },
            onBtnArtNameclearPress : function(){

                this.getView().byId("FirstNameID_MS").setValue("");
                this.getView().byId("LastNameID_MS").setValue("");
                this.getView().byId("FullNameID_MS").setValue("");

            },
            onNameChnage : function(){

                this.FullName = this.getView().byId("FirstNameID_MS").getValue() + " " + this.getView().byId("LastNameID_MS").getValue();
                this.Abbrevation = this.getView().byId("FirstNameID_MS").getValue().charAt(0) + " " + this.getView().byId("LastNameID_MS").getValue();
                this.getView().byId("FullNameID_MS").setValue(this.FullName);
                this.getView().byId("AbbreviationID_MS").setValue(this.Abbrevation);
            },
            
            onBtnArtNamePress : function(){
                var that = this;
                var firstName        = this.getView().byId("FirstNameID_MS").getValue();
                var Lastname         = this.getView().byId("LastNameID_MS").getValue();
                var FullName      = this.getView().byId("FullNameID_MS").getValue();
                var Abbrevation   = this.getView().byId("AbbreviationID_MS").getValue();
                var oSignType = {};
                oSignType.ImFlag     = "A"
                oSignType.LvPosnr    = "1"
                oSignType.LvVbeln    = "1"
                oSignType.CharValue  = firstName;
                oSignType.DescrCval  = Lastname;
                oSignType.NameChar   = FullName;
                oSignType.Name       = Abbrevation;

                this.oModel.create("/Sign_DropDownSet",oSignType,{
                    success : function(oData,oResponse){
                        MessageBox.success("Artist Name Saved successfully");
                        that.handleCloseMntSignPress();
                        that.onBtnArtNameclearPress();
                        that.getSignatureData("T","ArtistName");
                    },
                    error(oFail){
                        MessageBox.error(" failed to update Artist Name, Please Contact Technical Team");
                        that.handleCloseMntSignPress();
                    }


                });

            },
           
            GetLabelLine : function(FilterVbeln,FilterPosnr){

                return new Promise(function (resolve, reject) {

                /* var filter = [
                    new sap.ui.model.Filter("Vbeln", sap.ui.model.FilterOperator.EQ, FilterVbeln),
                    new sap.ui.model.Filter("Posnr", sap.ui.model.FilterOperator.EQ, FilterPosnr)
                ];
                this.oModel.read("/Signature_hdrSet", {
                    filters: filter,
                    success: function (oData, oResponse) {

                        if (oData.results.length > 0) {
                            if (oData.results[0].LabelLines1)
                                var LabelLines = oData.results[0].LabelLines1
                            if (oData.results[0].LabelLines2)
                                LabelLines = LabelLines + "" + oData.results[0].LabelLines2;
                            if (oData.results[0].LabelLines3)
                                LabelLines = LabelLines + "" + oData.results[0].LabelLines3;
                            if (oData.results[0].LabelLines4)
                                LabelLines = LabelLines + "" + oData.results[0].LabelLines4;
                            if (oData.results[0].LabelLines5)
                                LabelLines = LabelLines + "" + oData.results[0].LabelLines5;
                            if (oData.results[0].LabelLines6){
                                LabelLines = LabelLines + "" + oData.results[0].LabelLines6;
                            }
                            if(LabelLines){
                            this.FullLabelLines = this.FullLabelLines +" , " + LabelLines;
                            }

                            var Labels = this.FullLabelLines.match(/.{1,100}/g);
                           
                            if(Labels.length>0){
                                for(var i=0;i<Labels.length;i++){
                                    
                                    if(i>3){
                                       
                                        this.LabelLines5 = Labels[4];
                                        this.LabelLines6 = Labels[5];
                                    }
                                    
                                        this.LabelLines1 = Labels[0];
                                        this.LabelLines2 = Labels[1];
                                        this.LabelLines3 = Labels[2];
                                        this.LabelLines4 = Labels[3];
                                        

                                }
                            }
                            
                        }
                        resolve(this);
                        

                    }.bind(this),

                    error: function () {
                        resolve();
                    }
                }); */

                resolve(this);

            }.bind(this));

            },
            getNextLineItem: function (oApp) {

                return new Promise(function (resolve, reject) {

                    var that = this;

                    var Nfilter = [
                        new sap.ui.model.Filter("LvVbeln", sap.ui.model.FilterOperator.EQ, this.SalesOrderNumber),
                        new sap.ui.model.Filter("LvPosnr", sap.ui.model.FilterOperator.EQ, this.LineId),
                        new sap.ui.model.Filter("ImFlag", sap.ui.model.FilterOperator.EQ, oApp)
                    ];

                    this.oModel.read("/Grade_MARADATASet", {
                        filters: Nfilter,
                        success: function (oData, oResponse) {
                            resolve(oData.results[0].ExtRefItemId);
                        },
                        error(oFail) {

                        }
                    });
                }.bind(this));


            },
            
            onVHArtist : function (oEvent) {
                var sInputValue = oEvent.getSource().getValue(),
                    oView = this.getView();
    
                if (!this._pValueHelpDialog) {
                    this._pValueHelpDialog = Fragment.load({
                        id: oView.getId(),
                        name: "SS.signaturescan.fragment.ValueHelpDialog",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
                this._pValueHelpDialog.then(function (oDialog) {
                    // Create a filter for the binding
                    oDialog.getBinding("items").filter([new Filter("CharValue", FilterOperator.Contains, sInputValue)]);

                    // Open ValueHelpDialog filtered by the input's value
                    oDialog.open(sInputValue);
                });
            },

            onValueHelpDialogSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("CharValue", FilterOperator.Contains, sValue);
    
                oEvent.getSource().getBinding("items").filter([oFilter]);
            },
    
            onValueHelpDialogClose: function (oEvent) {
                var sDescription,
                    sTitle,
                    oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);
    
                if (!oSelectedItem) {
                    return;
                }
    
                sDescription = oSelectedItem.getDescription();
                sTitle       = oSelectedItem.getTitle();
    
                this.byId("artistNameID").setSelectedKey(sDescription);
                this.ArtistNameText = sTitle;
                this.ArtistNameTextKey = sDescription;
            },
    
            onSuggestionItemSelected: function (oEvent) {
                var oItem = oEvent.getParameter("selectedItem");
                var oText = oItem ? oItem.getKey() : "";
                this.byId("selectedKeyIndicator").setText(oText);
            }

        });
    });

