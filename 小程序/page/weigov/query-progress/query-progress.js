var app = getApp();
var surl = require('../../../util/surl.js');
var keys = require('../../../util/keys.js');
Page({
    data: {
        isShowError:false,
        BSNUM:"",
        flag:true,
        isInput:false
    },
    init : function (getparams) {
    },
    onLoad : function (getparams) {
        this.init(getparams);
    },
    onShow : function (params) {
        wx.setNavigationBarTitle({
            title: "进度查询"
        });
    },
    clear : function () {
        this.setData({
            BSNUM:'',
            isInput:false
        });
    },
    scan: function () {
        var that = this;
        wx.scanCode({
            success: (res) => {
//                console.log("scanCode",res)
                var ret = res.result;
                that.setData({
                    BSNUM : ret,
                    isInput : true
                });
                that.search();
            }
        })
    },
    search: function () {
        if(this.data.BSNUM == ""){
            wx.showModal({
                title: '提示',
                content: "请输入正确的流水号"
            });
            return false;
        }
        var that = this;
        var url = "weigov/progressQueryController.do?search";
        var data = {
            BSNUM: that.data.BSNUM,
            APPNAME: "erweima"
        };
        wx.request({
            url : surl.host+url,
            method:"GET",
            data: data,
            success : function (data) {
                data = data.data;
                console.log(data);
                data = JSON.parse(data.obj);
                if(data.code==500){
                    wx.showModal({
                        title: '提示',
                        content: data.error || "请输入正确的流水号"
                    });
                }else{
                    data = data.ReturnValue;
                    wx.setStorageSync(keys.progressQuery,data);
                    wx.navigateTo({
                        url:"../query-progress-result/query-progress-result"
                    });
                }
            },
            fail : function (e) {

            }
        });
    },
    bindKeyInput: function(e) {
        this.setData({
            BSNUM: e.detail.value
        });
        if(this.data.BSNUM.length > 0){
            this.setData({
                isInput:true
            });
        }
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
