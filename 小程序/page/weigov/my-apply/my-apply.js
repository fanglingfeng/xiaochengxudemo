var app = getApp();
var surl = require('../../../util/surl.js');
var keys = require('../../../util/keys.js');
var util = require('../../../util/util.js');
Page({
    data: {
        list:[],
        isShowError:false,
        BSNUM:"",
        flag:true,
        pageno:1,
        pagesize:15,
        isInput:false,
        showMore:false
    },
    init : function (getparams) {
        var that = this;
        var url = "wx/wxUserController.do?getUserInfoByUnionid";
        var unionid = wx.getStorageSync("unionId");
        that.setData({
            pageno:0
        });

        util.getUnionId(3,function(){
            wx.request({
                url:surl.host + url,
                method:"POST",
                header:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
                data:{unionid:unionid},
                success: function (data) {
                    console.log("token",data);
                    if(!data.data.success || data.data.msg == "登录失败"){
                        that.bindUser();
                        return;
                    }
                    if(data.data.obj === null || typeof data.data.obj['token'] == "undefined"){
                        that.showError(data.data.msg);
                        return;
                    }
                    data = data.data.obj;
                    that.setData({
                        TOKEN:data.token,
                        USER_ID:data.userid
                    });
                    data.USER_ID = data.userid;
                    wx.setStorageSync('userInfo',data);
                    var aData = that.getNextPageParam();
                    that.getData(aData);
                }
            });
        });
    },
    bindUser: function () {
        wx.setStorageSync('loginFrom','../my-apply/my-apply');
        wx.redirectTo({
            url: '../login/login'
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
            APPLICANTID:USER_ID,
            PAGENO:(parseInt(that.data.pageno)+1)+"",
            PAGESIZE:that.data.pagesize+""
        };

        that.setData({
            pageno:params.PAGENO
        });

        var data = {
            server:"RestOnlineDeclareService",
            method:"wodebanjian",
            param:params
        };
        return data;
    },
    onLoad : function (getparams) {
        this.init(getparams);
    },
    onShow : function (params) {
        wx.setNavigationBarTitle({
            title: "我的申报"
        });
    },
    getData: function (data) {
        var that = this;
        var url = "weigov/serviceController/get.do";
        this.showLoading();
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
                    var noData = (parseInt(that.data.pageno) <= 1 && list.length < 1) ? true : false;
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
    goPage: function (e) {
        console.log(e);
        var that = this;
        var dataset = e.currentTarget.dataset;
        var cstatus = dataset.cstatus;
        var bsnum = dataset.bsnum;
        var PERMID = dataset.permid;
        var url = "weigov/progressQueryController.do?search";
        var params = {
            BSNUM: bsnum,
            APPNAME: "erweima"
        };
        if(cstatus=="暂存"){
            that.showLoading();
            wx.setStorageSync("pageType","myReport");
            wx.setStorageSync("BSNUM",bsnum);
            wx.request({
                url : surl.host+"weigov/serviceController/get.do",
                method:"GET",
                data:{
                    server: 'RestPermissionitemService',
                    method: 'getPermissionByPermid',
                    param: {PERMID: PERMID}
                } ,
                success : function (data) {
                    that.hideLoading();
                    data = data.data;
                    console.log(data);
                    if(data.code!=200){
                        wx.showModal({
                            title: '提示',
                            content: data.error || "网络错误！"
                        });
                    }else{
                        data = data.ReturnValue;
                        wx.setStorageSync("itemInfo",data);
                        wx.navigateTo({
                            url:"../baseInfo/baseInfo"
                        });
                    }
                },
                fail : function (e) {
                    console.log(e);
                }
            });
            return;
        }

        this.showLoading();
        wx.request({
            url : surl.host+url,
            method:"GET",
            data: params,
            success : function (data) {
                that.hideLoading();
                data = data.data;
                console.log(data);
                data = JSON.parse(data.obj);
                if(data.code==500){
                    wx.showModal({
                        title: '提示',
                        content: data.error || "流水号不正确"
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
                console.log(e);
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
