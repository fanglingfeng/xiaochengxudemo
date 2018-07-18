var app = getApp();
var surl = require('../../../util/surl.js');
var keys = require('../../../util/keys.js');
Page({
    data: {
        data : [],
        isLoad:false,
        isShowError:false,
        loading:false
    },
    init : function (getparams) {
        var that = this;
        var type = getparams.networkType;
        var DEPTIDList = getparams.DEPTID || wx.getStorageSync(keys.DEPTIDList);
        var url,params;
        if (type == "main") {
            url = "weigov/departmentController.do?getDeptlistByAreaid";
            params = {
                PAGENO: "1",
                PAGESIZE: "1000",
                SFYDSB: "1",
                AREAID: "440306"
            };
        } else {
            type = "sub";
            url = "weigov/departmentController.do?getDeptlistByParentid";
            params = {
                PARENTID: DEPTIDList,
                PAGENO: "1",
                PAGESIZE: "1000",
                SFYDSB: "1",
                RESERVEONE: "5"
            };
        }

        that.showLoading();
        wx.request({
            url : surl.host+url,
            method:"GET",
            data: params,
            success : function (data) {
                that.hideLoading();
                data = data.data;
                try {
                    console.log(data);
                    if (type == "main") {
                        data = JSON.parse(data.obj).quzhi;
                    } else {
                        data = JSON.parse(data.obj);
                    }
                    console.log(data);
                    that.setData({
                        data:data
                    });
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
    render : function() {
        if(this.data.list.length < 1){
            wx.showModal({
                title: '提示',
                content: '无数据'
            });
            return;
        }
        var list1 = this.data.list.slice(0,1);
        var list2 = this.data.list.slice(1);
        this.setData({
            list1:list1,
            list2:list2
        });
    },
    onLoad : function (params) {
        this.init(params);
    },
    onShow : function (params) {
        wx.setNavigationBarTitle({
            title: "部门选择"
        });
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
