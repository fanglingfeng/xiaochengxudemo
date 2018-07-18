var app = getApp();
var surl = require('../../../util/surl.js');
var keys = require('../../../util/keys.js');
Page({
    data: {
        list : [],
        list1 : [],
        list2 : [],
        isLoad:false,
        isShowError:false,
        loading:false
    },
    init : function (e) {
        var that = this;
        wx.request({
            url : surl.host+'weigov/serviceController/get.do',
            data:{method:'getNetworkList',server:'RestNetworkService',param:{}},
            success : function (data) {
                console.log(data);
                try {
                    if(!(typeof data == "object" && data.statusCode == 200)){
                        wx.showModal({
                            title: '提示',
                            content: '数据加载失败'
                        });
                        return;
                    }
                    data = data.data.ReturnValue.Items;
                    console.log(data);
                    that.setData({
                        isLoad:true,
                        list : data
                    });
                    var storage = {};
                    storage[keys.getNetworkList] = data;
                    wx.setStorageSync(keys.getNetworkList,data);
                    that.render();
                } catch (e) {
                    console.log(e);
                }
            }
        })
    },
    render :  function() {
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

    },
    onShow : function (params) {
        wx.setNavigationBarTitle({
            title: "宝安政务"
        });
        this.init();
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
