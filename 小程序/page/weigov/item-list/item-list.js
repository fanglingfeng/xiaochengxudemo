var app = getApp();
var surl = require('../../../util/surl.js');
var util = require('../../../util/util.js');
Page({
    data: {
        dataTheme : [],
        source : 1,
        isTheme: true,
        partClass:'',
        themeClass:'hover',
        navWrap:true,
        dataDepartmented:false,
        dataThemed:false,
        isShowError:false,
        loading:false
    },
    init : function (e) {
        var that = this;
        wx.request({
            url : surl.host+'weigov/businessController.do?getPictureByID&ID=440306&PAGENO=1&PAGESIZE=1000&SFYDSB=1',
            success : function (message) {
                console.log(message);
                var data = message.data.obj;
                try {
                    data = JSON.parse(data).ReturnValue;
                    for (var i = 0; i < data.length; i++) {
                        var index = data[i].PICTUREPATH.lastIndexOf("\/");
                        data[i].PICTUREPATH = "http://203.91.37.98:8083" + data[i].PICTUREPATH.substring(0, index) + "/new/" + data[i].PICTUREPATH.substring(index + 1, data[i].PICTUREPATH.length);
                    }
                    wx.setStorageSync('dataTheme',data);
                    console.log(data);
                    that.setData({
                        dataTheme : data
                    })
                } catch (e) {
                    console.log(e);
                }
            }
        })
    },
    onLoad : function (params) {
        console.log("==========app==========");
        console.log(app);
        if(typeof params.source == 'undefined'){
            this.setData({source:1});
        }else{
            this.setData({source:params.source});
        }
        this.showTheme();
    },
    onShow : function (params) {
        console.log("params========onShow==========");
        var title = this.data.source == 1 ? "个人办事" : "企业办事";
        wx.setNavigationBarTitle({
            title: "宝安政务"
//            title: title
        });
        util.setPage(this);
    },
    toggleBusiness : function () {
        var _source = this.data.source == 1 ? 2 : 1;
        this.setData({source:_source});
    },
    toggleTheme: function () {
        var themeClass = this.data.themeClass == "" ? "hover" : "";
        var partClass = this.data.partClass == "" ? "hover" : "";
        this.data.themeClass = themeClass;
        this.data.partClass = partClass;
        this.setData({});
    },
    showTheme: function () {
        this.setData({isTheme:true});
        if (this.data.dataThemed) {
            return;
        }
        var that = this;
        this.showLoading();
        wx.request({
            url : surl.host+'weigov/businessController.do?getPictureByID&ID=440306&PAGENO=1&PAGESIZE=1000&SFYDSB=1',
            success : function (message) {
                console.log(message);
                var data = message.data.obj;
                try {
                    data = JSON.parse(data).ReturnValue;
                    for (var i = 0; i < data.length; i++) {
                        var index = data[i].PICTUREPATH.lastIndexOf("\/");
                        data[i].PICTUREPATH = "http://203.91.37.98:8083" + data[i].PICTUREPATH.substring(0, index) + "/new/" + data[i].PICTUREPATH.substring(index + 1, data[i].PICTUREPATH.length);
                    }
                    console.log(data);
                    that.setData({
                        dataTheme : data,
                        dataThemed:true
                    });
                    that.hideLoading();
                } catch (e) {
                    console.log('错误信息：',e);
                    that.showError();
                }
            },
            fail : function (e) {
                console.log(e);
                that.showError();
            }
        })
    },
    showDepartment:function(){
        this.setData({isTheme:false});
        if (this.data.dataDepartmented) {
            return;
        }
        var that = this;
        this.showLoading();
        wx.request({
            url : surl.host+'weigov/departmentController.do?getDeptlistByAreaid',
            method:"GET",
            data: {
                PAGENO: "1",
                PAGESIZE: "1000",
                SFYDSB: "1",
                AREAID: "440306"
            },
            success : function (data) {
                try {
                    console.log(data);
                    var dataDepartment = JSON.parse(data.data.obj);
                    that.setData({
                        dataDepartment:dataDepartment,
                        dataDepartmented:true
                    });
                    that.hideLoading();
                } catch (e) {
                    that.showError();
                }
            },
            fail : function (e) {
                console.log(e);
                that.showError();
            }
        });

    },
    search : function () {
        wx.navigateTo({
            url:"../sub-item-list/sub-item-list?pageType=search"
        });
    },
    jia: function () {
        var navWrap = !this.data.navWrap;
        var navClass = navWrap ? "" : "hover";
        this.setData({
            navWrap:navWrap,
            navClass:navClass
        });
    },
    showError: function () {
        this.hideLoading();
        this.setData({isShowError:true})
    },
    hideShowError: function () {
        this.setData({isShowError:false})
    },
    showLoading: function () {
        this.setData({loading:true})
    },
    hideLoading: function () {
        this.setData({loading:false})
    }
});
