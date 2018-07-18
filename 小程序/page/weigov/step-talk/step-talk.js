var app = getApp();
var surl = require('../../../util/surl.js');
var keys = require('../../../util/keys.js');
Page({
    data: {
        $scope:{},
        isShowError:false,
        BSNUM:"",
        flag:true,
        pageno:1,
        pagesize:15,
        noData:false,
        isInput:false,
        showMore:false
    },
    isEmpty:function isEmpty(v) {
        return typeof v == "undefined" || v == "undefined" || v == '' || v == null;
    },
    isVal: function (va) {
        if(va!=""&&va!=null&&va!="null"&&va!=undefined){
            return true;
        }else{
            return false;
        }
    },
    init : function (getparams) {
        var that = this;
        var $scope = this;

        $scope.method = "POST";
        var url="weigov/serviceController/get.do";

        var itemInfo = wx.getStorageSync("itemInfo");
        var userInfo = wx.getStorageSync("userInfo");
        console.log(userInfo);
        $scope.bumen = itemInfo.DEPTNAME;
        $scope.title = itemInfo.SXZXNAME;
        $scope.TOKEN = userInfo.TOKEN;
        $scope.USER_ID = userInfo.USER_ID;
        $scope.USERNAME = userInfo.USERNAME;
        $scope.REALNAME = userInfo.REALNAME;

        $scope.MOBILE = userInfo.MOBILE;
        function service(method,url,data,callback){
            that.showLoading();
            wx.request({
                url: surl.host + url,
                data: data,
                success: function (data) {
                    that.hideLoading();
                    console.log(data);
                    data = data.data;
                    callback && callback(data);
                }
            });
        }

        $scope.talk = function(){
            var $scope= that.data;
            $scope.DEPARTMENTID = itemInfo.DEPTID;
            $scope.SXID = itemInfo.ID;
            $scope.SXMC = itemInfo.SXZXNAME;
            var params =
            {
                "token":$scope.TOKEN,
                "DB_CREATE_ID":$scope.USER_ID,
                "NAME":$scope.REALNAME,
                "SEX":"0",
                "MOVEPHONE":$scope.MOBILE,
                "TELEPHONE":"87654321",
                "MAINTITLE":$scope.title,
                "CONTENT":$scope.content,
                "DEPARTMENTID":$scope.DEPARTMENTID,
                "SXID":$scope.SXID,
                "SXMC":$scope.SXMC
            };
            params = JSON.stringify(params);
            console.log(params);
            var data =
            {
                server:"RestAdvisoryService",
                method:"submit",
                param:params
            };
            that.setData($scope);
            service($scope.method,url,data,function(re){
                if(re.code==200){
                    that.toast('提交成功');
                    setTimeout(function(){
                        wx.redirectTo({
                            url: '../my-talk/my-talk'
                        });
                    },1000);
                }else{

                }
            });
        };

        that.setData($scope);
        that.hideLoading();
    },
    bindUser: function () {
        wx.setStorageSync('loginFrom','../baseInfo/baseInfo');
        wx.redirectTo({
            url: '../login/login'
        });
    },
    login: function (unionid) {
        var user = wx.getStorageSync('userInfo');
        var userInfo = {
            TOKEN : user.token,
            USER_ID : user.userid,
            USER_EMAIL : user.EMAIL,
            MOBILE : user.MOBILE,
            REALNAME : user.REALNAME,
            USERNAME : user.USERNAME,
            USER_PID : user.USER_PID,
            USER_PHONE : user.MOBILE,
            comment : '',
            TYPE : user.TYPE
        };
        wx.setStorageSync("userInfo",userInfo);
    },
    onLoad : function (getparams) {
        this.showLoading();
        var that = this;
        var unionid = wx.getStorageSync("unionId");
        that.login(unionid);
        var $scope = that.data;
        that.init(getparams);
    },
    onShow : function (params) {
        wx.setNavigationBarTitle({
            title: "我要咨询"
        });
    },
    toast: function (msg) {
        this.hideLoading();
        msg = msg || "成功";
        wx.showToast({
            title: msg,
            icon: 'success',
            duration: 2000
        });
    },
    bindKeyInput: function(e) {
        var _id = e.currentTarget.dataset.id;
        var $scope = this.data;
        $scope[_id] = e.detail.value;
        this.setData($scope);
    },
    service:function service(url,data,callback){
        var that = this;
        wx.request({
            url:surl.host + url,
            data:data,
            success: function (data) {
                that.hideLoading();
                data = data.data;
                callback(data);
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
