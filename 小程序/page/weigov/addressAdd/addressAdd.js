var app = getApp();
var surl = require('../../../util/surl.js');
var keys = require('../../../util/keys.js');
var util = require('../../../util/util.js');
Page({
    data: {
        $scope:{}
    },
    onLoad : function (getparams) {
        util.setPage(this);
        var that = this;
        var vm = this;
        var userInfo = wx.getStorageSync("userInfo");
        vm.uname = '';
        vm.tel = '';
        vm.address = '';
        vm.postId = wx.getStorageSync("postId") || '';

        vm.saveOrUpdate = function(){
            var that = this;
            var vm = this.data;
            var serviceMethod = vm.postId ? 'modifyUserPostInfo':'addUserPostInfo';
            var data = {
                RECEIVE:vm.uname,
                MOBILE:vm.tel,
                PHONE:vm.tel,
                ADDRESS:vm.address,
                POSTCODE:'',
                USERID:userInfo.USER_ID,
                POSTID:vm.postId
            };

            if(data.ADDRESS.trim() == '' || data.RECEIVE.trim() == ''){
                util.weui.toast('请填写完整！');
                return;
            }

            if(util.g.isTelphone(data.MOBILE) == 0 && !util.g.isPhone(data.MOBILE)){
                util.weui.toast('请正确填写联系电话！','waiting',2000);
                return;
            }

            wx.request({
                url: surl.host + "weigov/serviceController/get.do",
                data:{server:'RestEMSService',method:serviceMethod,param:data},
                success: function (data) {
                    util.weui.hideLoading();
                    data = data.data;
                    if(data.code==200){
                        util.weui.toast(!vm.postId?'添加成功':'修改成功');
                        setTimeout(function(){
                            wx.navigateBack();
                        },300);
                    }else{
                        util.weui.toast(data.error ||'网络请求失败','warn');
                    }
                }
            });
        };

        vm.del = function (id) {
            var that = this;
            var vm = this.data;
            id = typeof id == 'object' ? id.currentTarget.dataset.id : '';
            id = id || wx.getStorageSync("postId");

            wx.request({
                url: surl.host + "weigov/serviceController/get.do",
                data:{server:'RestEMSService',method:'deleteUserPostInfo',param:{"POSTID":id}},
                success: function (data) {
                    util.weui.hideLoading();
                    data = data.data;
                    if(data.code==200){
                        util.weui.toast('删除成功');
                        setTimeout(function(){
                            wx.navigateBack();
                        },300);
                    }else{
                        util.weui.toast(data.error ||'网络请求失败','warn');
                    }
                }
            });

        };

        vm.getPostInfo = function(id){
            var that = this;
            var vm = this.data;
            id = typeof id == 'object' ? id.currentTarget.dataset.id : '';
            id = id || wx.getStorageSync("postId");
            wx.request({
                url: surl.host + "weigov/serviceController/get.do",
                data:{server:'RestEMSService',method:'getUserPostInfo',param:{"USERID":userInfo.USER_ID}},
                success: function (data) {
                    util.weui.hideLoading();
                    data = data.data;
                    if(data.code==200){
                        var postInfoList = data.ReturnValue.Items;
                        that.setPostInfo(id,postInfoList);
                    }else{
                        util.weui.toast(data.error ||'网络请求失败','warn');
                    }
                }
            });

        };
        // 根据POSTID遍历地址列表，并更新表单
        vm.setPostInfo = function (id,postInfoList) {
            var that = this;
            var vm = this.data;
            id = typeof id == 'object' ? id.currentTarget.dataset.id : id;
            var list = postInfoList;
            var i = 0,
                l = list.length;
            var item = null,
                ret = null;
            for(;i<l;i++){
                item = list[i];
                if(item.POSTID == id){
                    ret = item;
                    break;
                }
            }
            if(ret == null){
                return;
            }
            vm.uname = ret.RECEIVE;
            vm.tel = ret.MOBILE;
            vm.address = ret.ADDRESS;
            that.setData(vm);
        };

        that.setData(vm);

        vm.init = function(){
            vm.postId && vm.getPostInfo();
        };

        vm.init();
        

    },
    onShow : function (params) {
        wx.setNavigationBarTitle({
            title: "添加收货地址"
        });
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
