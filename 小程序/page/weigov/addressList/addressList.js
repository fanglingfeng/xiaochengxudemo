var app = getApp();
var surl = require('../../../util/surl.js');
var keys = require('../../../util/keys.js');
var util = require('../../../util/util.js');
Page({
    data: {
        $scope:{}
    },
    init : function (getparams) {
    },
    go: function (page) {
        var url = {
            step4:'../step4/step4',
            step5:'../step5/step5',
            baseInfo:'../baseInfo/baseInfo'
        };
        wx.redirectTo({
            url: url[page]
        });
    },
    onLoad : function (getparams) {

    },
    onShow : function (params) {
        wx.setNavigationBarTitle({
            title: "收货地址"
        });
        util.setPage(this);
        var that = this;
        var $scope = that;
        var userInfo = wx.getStorageSync("userInfo");
        var vm = $scope;
        vm.postId = wx.getStorageSync('postId') || '';

        vm.del = function (id) {
            id = typeof id == 'object' ? id.currentTarget.dataset.id : id;
            let that = this;
            let vm = this.data;
            util.weui.showLoading("删除中...");
            wx.request({
                url: surl.host + "weigov/serviceController/get.do",
                data:{server:'RestEMSService',method:'deleteUserPostInfo',param:{"POSTID":id}},
                success: function (data) {
                    util.weui.hideLoading();
                    data = data.data;
                    if(data.code==200){
                        util.weui.toast('删除成功');
                        that.getPostInfo();
                    }else{
                        util.weui.toast(data.error ||'网络请求失败','warn');
                    }
                }
            });
        };

        vm.getPostInfo = function(id){
            let vm = this.data;
            wx.request({
                url: surl.host + "weigov/serviceController/get.do",
                data:{server:'RestEMSService',method:'getUserPostInfo',param:{"USERID":userInfo.USER_ID}},
                success: function (data) {
                    util.weui.hideLoading();
                    data = data.data;
                    if(data.code==200){
                        vm.list = data.ReturnValue.Items;
                        that.setData(vm);
                    }else{
                        util.weui.toast(data.error ||'网络请求失败','warn');
                    }
                }
            });
        };

        $scope.addAddress = function(postId){
            postId = typeof postId == 'object' ? postId.currentTarget.dataset.id : postId;
            wx.setStorageSync('postId', postId || '');
            wx.navigateTo({
                url: '../addressAdd/addressAdd'
            });
        };

        that.setData(vm);

        vm.init = function(){
            vm.getPostInfo();
        };

        vm.init();
    },
    tempStore: function () {
        var page = this;
        page.cacheData();
        util.tempStore(page);
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
    fixed : function (e) {
        console.log('fixed',e);
        return false;
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
    showLoading: function (msg) {
        msg = msg || '加载中...';
        this.setData({loading:true,loadingText:msg})
    },
    hideLoading: function () {
        this.setData({loading:false})
    }
});
