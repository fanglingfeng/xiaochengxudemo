var app = getApp();
var surl = require('../../../util/surl.js');
var keys = require('../../../util/keys.js');
Page({
    data: {
        passwordFocus:false,
        isShowError:false,
        loading:false
    },
    init : function (getparams) {
        var that = this;
        wx.getStorageSync("unionId") ||
        wx.login({
            success: function(res) {
                console.log(res);
                if (res.code) {
                    var code = res.code;
                    wx.getUserInfo({
                        success: function(res) {
                            var userInfo = res.userInfo;
                            var nickName = userInfo.nickName;
                            var avatarUrl = userInfo.avatarUrl;
                            var gender = userInfo.gender; //性别 0：未知、1：男、2：女;
                            var province = userInfo.province;
                            var city = userInfo.city;
                            var country = userInfo.country;
                            console.log(res);
                            //发起网络请求
                            wx.request({
                                url:surl.host + 'weigov/xcxController/getUnionid.do',
                                method:"POST",
                                header:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
                                data: {
                                    code: code,
                                    encryptedData:res.encryptedData,
                                    iv:res.iv
                                },
                                success: function (res) {
                                    res = res.data.obj;
                                    console.log('unionid:',res);
                                    if(typeof res.unionId !== "undefined"){
                                        wx.setStorageSync("unionId",res.unionId);
                                        wx.setStorageSync("avatarUrl",res.avatarUrl);
                                    }else{
                                        that.onLoad(getparams);
                                    }
                                }
                            });
                        }
                    });
                } else {
                    console.log('获取用户登录态失败！' + res.errMsg);
                    that.onLoad(getparams);
                }
            }
        });
    },
    onLoad : function (getparams) {
        this.init(getparams);
    },
    onShow : function (params) {
        wx.setNavigationBarTitle({
            title: "帐号绑定"
        });
    },
    login: function () {
        var that = this;
        var username = that.data.username;
        var password = that.data.password;
        var unionId = wx.getStorageSync("unionId");

        if (username==undefined||username.trim()==""){
            // 作校验，弹窗通知，独立出来一个方法处理
            wx.showModal({
                title: '提示',
                content: '请输入登录名',
                success:function(){
                    that.setData({
                        usernameFocus:true
                    });
                }
            });
            return;
        }
        if(password==undefined||password.trim()==""){
            wx.showModal({
                title: '提示',
                content: '请输入密码',
                success:function() {
                    that.setData({
                        passwordFocus: true
                    });
                }
            });
            return;
        }

        var url = 'weigov/xcxController/loginBind.do';
        wx.request({
            url:surl.host + url,
            method:"POST",
            header:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            data: {
                unionid: unionId,
                username:that.data.username,
                password:that.data.password
            },
            success: function (data) {
                data = data.data;
                console.log(data);
                if(!data.success){
                    wx.showModal({
                        title: '提示',
                        content: data.msg
                    });
                }else{
                    wx.showModal({
                        title: '提示',
                        content: '绑定成功',
                        complete: function () {
                            var backPage = wx.getStorageSync('loginFrom');
                            backPage = backPage || '../item-list/item-list';
                            wx.setStorageSync('loginFrom','');
                            wx.redirectTo({
                                url: backPage
                            });
                        }
                    });
                }
            }
        });
    },
    bindKeyInput: function(e) {
        console.log(e);
        var _id = e.currentTarget.dataset.id;
        var data = {};
        data[_id] = e.detail.value;
        this.setData(data);
    },
    register: function () {
        wx.redirectTo({
            url:"../reg/reg"
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
