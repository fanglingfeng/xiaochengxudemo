var app = getApp();
var surl = require('../../../util/surl.js');
Page({
    data: {
        isTheme: true,
        isShowError:false,
    },
    init : function (getparams) {
    },
    onLoad : function (getparams) {
        this.init(getparams);
    },
    onShow : function (params) {
        wx.setNavigationBarTitle({
            title: "宝安政务"
//            title: "我的"
        });
    },
    showError: function (msg) {
        msg = msg || "数据加载失败，请重试";
        this.hideLoading();
        wx.showModal({
            title: '提示',
            content: msg
        });
    },
    hideShowError: function () {
        this.setData({isShowError:false})
    },
    showLoading: function () {
        this.setData({loading:true})
    },
    hideLoading: function () {
        this.setData({loading:false})
    },
});
