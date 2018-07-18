var app = getApp();
var surl = require('../../../util/surl.js');
var keys = require('../../../util/keys.js');
Page({
    data: {
        countdown:120, //倒计时
        isGeneral:true,
        passwordFocus:false,
        isShowError:false,
        loading:false
    },
    init : function (e) {
    },
    onLoad : function (params) {
//        this.init();
    },
    onShow : function (params) {
        wx.setNavigationBarTitle({
            title: "完善信息"
        });
    },
    showEnterprise: function () {
        this.setData({isGeneral:false});
    },
    showGeneral: function () {
        this.setData({isGeneral:true});
    },
    register: function () {
        var that = this;
        if (!this.check()) {
            return;
        }
        this.checkCaptcha(function (res) {
            if (!res.success) {
                that.showError(res.msg);
                return;
            }
            if (that.data.isGeneral) {
                that.registerGeneralUser();
            } else {
                that.registerEnterpriseUser();
            }
        });
    },
    registerGeneralUser:function () {
        var that = this;
        var unionid = wx.getStorageSync("unionId");
        var data = {
            userMobile: that.data.mobile.trim(),
            password: that.data.password.trim(),
            userName: that.data.username.trim(),
            idCard: that.data.idcard.trim(),
            captcha: that.data.captcha.trim(),
            unionid:unionid
        };
        wx.request({
//            url:'http://localhost:8080/weigov/xcxController/registerGeneralUser.do',
            url:surl.host + 'weigov/xcxController/registerGeneralUser.do',
            method:"POST",
            header:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            data: data,
            success: function (data) {
                data = data.data;
                console.log('个人注册结果',data);
                if (!data.success) {
                    that.showError(JSON.stringify(data.msg));
                } else {
                    var backPage = wx.getStorageSync('loginFrom');
                    wx.redirectTo({
                        url: backPage
                    });
                }
            }
        });
    },
    registerEnterpriseUser:function () {
        var that = this;
        var unionid = wx.getStorageSync("unionId");
        var data = {
            userMobile: that.data.mobile.trim(),
            password: that.data.password.trim(),
            userName: that.data.username.trim(),
            idCard: that.data.idcard.trim(),
            enterpriseName: that.data.enterpriseName.trim(),
            enterpriseCode: that.data.enterpriseCode.trim(),
            captcha: that.data.captcha.trim(),
            unionid:unionid
        };
        wx.request({
//            url:'http://localhost:8080/weigov/xcxController/registerEnterpriseUser.do',
            url:surl.host + 'weigov/xcxController/registerEnterpriseUser.do',
            method:"POST",
            header:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            data: data,
            success: function (data) {
                data = data.data;
                console.log('企业注册结果',data);
                if (!data.success) {
                    that.showError(JSON.stringify(data.msg));
                } else {
                    var backPage = wx.getStorageSync('loginFrom');
                    wx.redirectTo({
                        url: backPage
                    });
                }
            }
        });
    },
    checkCaptcha:function (cb) {
        var that = this;
        var data = {
            phone: that.data.mobile.trim(),
            captcha: that.data.captcha.trim()
        };

        wx.request({
            url:surl.host + 'wx/checkCaptcha',
            method:"POST",
            header:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            data: data,
            success: function (data) {
                data = data.data;
                console.log(data);
                cb && cb(data);
            }
        });
    },
    startCountdownTip:function () {
        var that = this;
        var countdown = that.data.countdown;
        var timer = setInterval(function () {
            countdown--;
            var smsTip = '{' + countdown + '秒)';
            that.setData({
                showCountdown:true,
                countdown : countdown,
                smsTip : smsTip,
                isSent : true
            });
            if (countdown == 0) {
                clearInterval(timer);
                console.log('取消定时器');
                that.setData({
                    showCountdown:false,
                    isSent : false,
                    countdown : 120,
                    smsTip :''
                });
            }
        }, 1000);
    },
    check : function () {
        var that = this;
        var flag = true;
        var mobile = that.data.mobile;
        var password = that.data.password;
        var username = that.data.username;
        var idcard = that.data.idcard;
        var rePassword = that.data.rePassword;
        var enterpriseName = that.data.enterpriseName;
        var enterpriseCode = that.data.enterpriseCode;
        var captcha = that.data.captcha;

        /*验证码校验*/
        if (!captcha || captcha.trim() == "") {
            that.showError("请输入验证码!");
            return !flag;
        }
        /*手机号校验*/
        if (mobile == undefined || mobile.trim() == "") {
            that.showError("请输入手机号!");
            return !flag;
        } else if (!(/^1[34578]\d{9}$/.test(mobile.trim()))) {
            that.showError("请输入正确的手机号!");
            return !flag;
        }
        /*密码校验*/
        if (password == undefined || password.trim() == "") {
            that.showError("请输入密码!");
            return !flag;
        } else if (password.trim().length < 6) {
            that.showError("请输入长度至少为6位的密码!");
            return !flag;
        }
        /*确认密码校验*/
        if (rePassword == undefined || rePassword.trim() == "") {
            that.showError("请输入确认密码!");
            return !flag;
        } else if (rePassword.trim().length < 6) {
            that.showError("请输入长度至少为6位的确认密码!");
            return !flag;
        }
        /*比对密码与确认密码*/
        if (rePassword.trim() != password.trim()) {
            that.showError("确认密码与密码不一致,请重新输入!");
            return !flag;
        }
        /*用户名校验*/
        if (username == undefined || username.trim() == "") {
            that.showError("请输入真实姓名!");
            return !flag;
        }
        debugger;
        /*身份证号校验*/
        if (idcard == undefined || idcard.trim() == "") {
            that.showError("请输入身份证号!");
            return !flag;
        } else if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(idcard.trim()))) {
            that.showError("请输入正确的身份证号!");
            return !flag;
        }
        /*如果是企业用户注册，需要验证企业信息*/
        if (!that.data.isGeneral) {
            /*企业名称校验*/
            if (enterpriseName == undefined || enterpriseName.trim() == "") {
                that.showError("请输入企业名称!");
                return !flag;
            }
            /*企业代码校验*/
            if (enterpriseCode == undefined || enterpriseCode.trim() == "") {
                that.showError("请输入统一社会信用代码/营业执照/组织机构代码!");
                return !flag;
            }
        }
        return flag;
    },
    sendSms:function () {
        var that = this;
        var isSent = that.data.isSent;
        var mobile = that.data.mobile;
        var clickInterval = Date.now() - wx.getStorageSync('COUNTDOWN_START');
        var INTERVAL = 120 * 1000;
        console.log('发送间隔=%i 点击发送按钮间隔=%i 可否发送=%o', INTERVAL, clickInterval, Boolean(clickInterval > INTERVAL));
        if (typeof mobile == 'undefined' || !(/^1[34578]\d{9}$/.test(mobile.trim()))) {
            that.showError("请输入正确的手机号!");
            return;
        }
        if (!isSent && clickInterval > INTERVAL) {
            console.log("发送短信验证码！");
            that.setData({isSent: true});
            that.showLoading();
            wx.request({
                url: surl.host + 'wx/sendSms',
                data: {phone: mobile},
                success: function (res) {
                    that.hideLoading();
                    res = res.data;
                    console.log("发送验证码响应:", res);
                    if (!res.success) {
                        that.showError("发送验证码失败");
                    } else {
                        that.startCountdownTip();
                        wx.setStorageSync('COUNTDOWN_START', Date.now());
                        that.showError("发送验证码成功");
                    }
                }
            });
        }else{
            that.showError("请2分钟后再试");
        }
    },
    bindKeyInput: function(e) {
        var _id = e.currentTarget.dataset.id;
        var data = {};
        data[_id] = e.detail.value;
        this.setData(data);
    },
    showError: function (msg) {
        this.hideLoading();
        wx.showModal({
            title: '提示',
            content: msg || '服务器请求失败，请重试'
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
    }
});
