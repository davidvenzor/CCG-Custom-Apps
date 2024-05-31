sap.ui.define([], function () {
	"use strict";
    return {
	
        timeConverted : function(value) {
        if(value){
            var date = new Date(value);
            var formattedTime = date.toLocaleTimeString('en-US',{hour12:false,timeZone: 'UTC'});
            return formattedTime;
        }
       
    },
    dateConverted : function(date){
            if(date){
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
              
                    return this.dia1+"-"+ this.mes1 +"-"+ this.year1;
            }

    }
    }
});