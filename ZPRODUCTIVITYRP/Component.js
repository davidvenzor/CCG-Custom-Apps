sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","sap/ops/productivityreport/ZOPSPRODUCTIVITYREPORT/model/models"],function(e,t,i){"use strict";return e.extend("sap.ops.productivityreport.ZOPSPRODUCTIVITYREPORT.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(i.createDeviceModel(),"device")}})});