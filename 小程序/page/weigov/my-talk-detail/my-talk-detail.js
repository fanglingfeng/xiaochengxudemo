var app = getApp();
var surl = require('../../../util/surl.js');
var keys = require('../../../util/keys.js');
Page({
    data: {
        list:[],
        isShowError:false,
        BSNUM:"",
        flag:true,
        pageno:1,
        pagesize:15,
        noData:false,
        isInput:false,
        showMore:false
    },
    init : function (getparams) {
        var that = this;
        var url = "wx/wxUserController.do?getUserInfoByUnionid";
        var unionid = wx.getStorageSync("unionId");
        that.setData({
            pageno:0,
            MAINTITLE:getparams.MAINTITLE
        });
        that.setData({
            pageno:0
        });
        wx.request({
            url:surl.host + url,
            method:"POST",
            header:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            data:{unionid:unionid},
            success: function (data) {
                console.log("token",data);
                data = data.data.obj;
                that.setData({
                    TOKEN:data.token,
                    USER_ID:data.userid
                });
                var aData = that.getNextPageParam();
                that.getData(aData);
            }
        });
    },
    findMore: function () {
        var that = this;
        var data = that.getNextPageParam();
        this.setData({
            showMore:false
        });
        this.getData(data);
    },
    getNextPageParam: function () {
        var that = this;
        var TOKEN = that.data.TOKEN;
        var USER_ID = that.data.USER_ID;
        var params = {
            token:TOKEN,
            DB_CREATE_ID:USER_ID,
            MAINTITLE:that.data.MAINTITLE,//主题
            PAGENO:(parseInt(that.data.pageno)+1)+"",
            PAGESIZE:that.data.pagesize+""
        };

        that.setData({
            pageno:params.PAGENO
        });

        var data = {
            server:"RestAdvisoryService",
            method:"search",
            param:params
        };
        return data;
    },
    onLoad : function (getparams) {
        this.showLoading();
        this.init(getparams);
    },
    onShow : function (params) {
        wx.setNavigationBarTitle({
            title: "我的咨询"
        });
    },
    getData: function (data) {
        var that = this;
        var url = "weigov/serviceController/get.do";
        wx.request({
            url: surl.host + url,
            method: "GET",
            data: data,
            success: function (data) {
                console.log("getData");
                console.log(data);
                that.hideLoading();
                data = data.data;
                if(data.code != 200){
                    wx.showModal({
                        title: '提示',
                        content: data.error || "请稍候重试"
                    });
                    return;
                }
                try {
                    var list = data.ReturnValue;
                    var noData = (parseInt(that.data.pageno) < 1 && list.length < 1) ? true : false;
                    var showMore = (list.length < that.data.pagesize) ? false : true;

                    that.setData({
                        list: that.data.list.concat(list),
                        showMore: showMore,
                        noData: noData
                    });
                }catch(e){
                    that.setData({
                        showMore: false,
                        noData: true
                    });
                    console.log("catch",e);
                }
            }
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
