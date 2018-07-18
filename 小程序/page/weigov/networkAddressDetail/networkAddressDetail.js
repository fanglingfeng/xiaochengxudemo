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
    init : function (params) {
        var that = this;
        var data = wx.getStorageSync(keys.getNetworkList);
        var id = params.id;
        var type = params.type;
        var storage = {};

        var i = 0,len = data.length;
        for(;i<len;i++){
            if (data[i].NETWORKID == id) {
                data = data[i];
                break;
            }
        }

        storage[keys.govID] = id;
        wx.setStorageSync(keys.govID,id);
        wx.setStorageSync(keys.curNetwork,data);
        wx.setStorageSync(keys.DEPTIDList,data.PARENTID);
        this.setData({
            data : data,
            networkType:type
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
            title: "服务网点"
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
