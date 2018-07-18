var app = getApp();
var surl = require('surl.js');
var keys = require('keys.js');

var page = {};

var G = {
    isTelphone: function (num) {
        // return (new
        // RegExp('^1[3456789]\\d{9,9}$','g')).test(tel);
        /*
         * 判断是否是正确的手机号，以及手机的运营商 @param {String} num
         *
         * 返回值: 0 不是手机号码 1 移动 2 联通 3 电信 4 不确定
         */
        var flag = 0;
        var phoneRe = /^1\d{10}$/;
        var dx = [133, 153, 180, 181, 189];
        /* 电信 */
        var lt = [130, 131, 132, 145, 155, 156, 185, 186];
        /* 联通 */
        var yd = [134, 135, 136, 137, 138, 139, 147, 150, 151,
            152, 157, 158, 159, 182, 183, 184, 187, 188];
        /* 移动 */

        if (phoneRe.test(num)) {
            var temp = ("" + num).slice(0, 3);
            if (this.inArray(temp, yd))
                return 1;
            if (this.inArray(temp, lt))
                return 2;
            if (this.inArray(temp, dx))
                return 3;
            return 4;
        }
        return flag;
    },
    inArray: function (val, arr) {
        var i;
        for (i in arr) {
            if (val == arr[i])
                return true;
        }
        return false;
    },
    getAction: function () {
        return window.location.search.substr(1);
    },
    get: function (name) {
        var reg = new RegExp('(?:^|[&?])' + name + '=([^&]*)');
        var ret = window.location.search.match(reg)
        return ret == null ? "" : ret[1];
    },
    setPageStatus: function (page, oStatus) {
        for (var item in oStatus) {
            oStatus[item] = false;
        }
        oStatus[page] = true;
        return oStatus;
    },
    isDebitCard: function (no) {// 借记卡19位
        var reg = new RegExp('^\\d{19}$', 'g');
        return reg.test(no);
    },
    isCreditCard: function (no) {// 信用卡、贷记卡 16位
        var reg = new RegExp('^\\d{16}$', 'g');
        return reg.test(no);
    },
    isIdCard: function (num) {// 身份证
        return /(^\d{15}$)|(^\d{17}([0-9]|X)$)/i.test(num);
    },
    isSoldierCard: function (str) {// 军官证
        var reg = new RegExp('^[南北沈兰成济广海空参政后装]字第(\\d{8})号$', 'g');
        return reg.test(str);
    },
    isPassport: function (no) {// 护照
        var reg = new RegExp(
            '^1[45][0-9]{7}|G[0-9]{8}|P[0-9]{7}|S[0-9]{7,8}|D[0-9]+$',
            'g');
        return reg.test(no);
    },
    isEnterprise: function (no) {// 企业号码
        var reg = new RegExp('^\\d{15}$', 'g');
        return reg.test(no);
    },
    isOrganizingCode: function (no) {// 组织机构代码
        var reg = new RegExp('^[a-zA-Z0-9]{8}-[a-zA-Z0-9]$', 'g');
        return reg.test(no);
    },
    isQQ: function (no) {// qq
        var reg = new RegExp('^[1-9]*[1-9][0-9]*$', 'g');
        return reg.test(no);
    },
    isEmail: function (s) {
        return /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(s);
    },
    isPhone: function (s) {
        return /^\d{3,4}-\d{7,8}$/.test(s);
    },
    getTrim: function (name, str) {
        str = "".trim.call(str).replace(/\s*/g, '');
        switch (name) {
            case "tel":
                str = str.replace(/[^\d]*/g, '').replace(
                    /^(\d{11})\d+$/, '$1');
                break;
            case "number":
                str = str.replace(/[^\d]*/g, '');
                break;
            case "idcard":
                str = str.replace(/[^\dX]/g, '').replace(/X$/g, '-#-')
                    .replace(/X/g, '').replace(/-#-/g, 'X')
                    .replace(/^([\dX]{18})[^\s]*/g, '$1');
                break;
            default:
                break;
        }
        return str;
    },
    yuan2fen: function (money) {// 把元转分
        money = parseFloat(money).toFixed(2) + "";
        money = money.replace('.', '');
        return isNaN(money) ? 0 : money;
    },
    hideName: function (_name) {
        if (!_name) {
            return _name;
        }
        var _nameArr = _name.split(''), len = _nameArr.length, ret = '';
        if (len < 2) {
            return _name;
        } else if (len == 2) {
            ret = _nameArr[0] + "*";
        } else {
            ret = _nameArr[0] + (new Array(len - 1).join("*"))
                + _nameArr[len - 1];
        }
        return ret;
    },
    hideAddr: function (_addr) {
        _addr = _addr + "";
        var len = _addr.length, ret = '';
        if (len < 2) {
            ret = _addr;
        } else if (len < 4) {
            ret = _addr.charAt(0) + (new Array(len)).join('*');
        } else {
            ret = _addr.slice(0, -3) + "***";
        }
        return ret;
    },
    doTry: function (fn) {
        var me = this;
        try {
            fn();
        } catch (e) {
            me.throwError(e, fn);
        }
    },
    throwError: function (e, fn) {
        console.log(e);
        console.log(fn);
    }
};

function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  var hour = parseInt(time / 3600)
  time = time % 3600
  var minute = parseInt(time / 60)
  time = time % 60
  var second = time

  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}

function getUnionId(times,cb) {
    app.globalData.stateBaseInfo = 0; // 0:未验证，1：验证通过，4：验证不通过
    app.globalData.stateStep4 = 0;
    app.globalData.stateStep5 = 0;
    if(wx.getStorageSync("unionId") != ''){
        cb && cb();
    }else{
        wx.login({
            success: function(res) {
                console.log(res);
                if (res.code) {
                    var code = res.code;
                    wx.getUserInfo({
                        success: function(res) {
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
                                        cb && cb();
                                    }else{
                                        if(times>0){
                                            times --;
                                            getUnionId(times,cb);
                                        }
                                    }
                                },
                                fail: function () {
                                    if(times>0){
                                        times --;
                                        getUnionId(times,cb);
                                    }
                                }
                            });
                        }
                    });
                } else {
                    console.log('获取用户登录态失败！' + res.errMsg)
                }
            }
        });
    }
}

function param(data) {
    var s = [];
    var add = function( key, value ) {
        s[ s.length ] = encodeURIComponent( key ) + "=" +
            encodeURIComponent( value == null ? "" : value );
    };
    for(var k in data){
        add(k,data[k]);
    }
    return s.join( "&" );
}

//暂存
function tempStore(page){
    var userInfo = wx.getStorageSync("userInfo");
    var postxml = !!userInfo.isEMS ?  wx.getStorageSync('postxml') : null;
    var itemInfo =  wx.getStorageSync("itemInfo");
    var P_GROUP_ID =  wx.getStorageSync('P_GROUP_ID');
    var PERMID = itemInfo.ID || '';
    var form = wx.getStorageSync("form");
    var business = wx.getStorageSync("business");
    var material = wx.getStorageSync("finalMaterial_"+PERMID+P_GROUP_ID); // 最终材料
    material = material || [];
    business.status = "9"; // 暂存件
    var bsnum = wx.getStorageSync('BSNUM') || '';
    if(bsnum != '') {
        business.bsnum = bsnum;
        business.businessid = bsnum;
        form.bsnum = bsnum;
    }
    var data = {
        server:"RestOnlineDeclareService",
        method:"submit",
        form:JSON.stringify(form),
        business:JSON.stringify(business),
        postxml:JSON.stringify(postxml),
        material:JSON.stringify(material),
        TOKEN:userInfo.TOKEN
    };
    page.showLoading('暂存提交中...');
    wx.request({
        url: surl.host + "weigov/serviceController/formSubmit.do",
        header:{'Content-Type':'application/x-www-form-urlencoded'},
        method: "POST",
        data: param(data),
        success: function (data) {
            page.hideLoading();
            data = data.data;
            if(data.code==200){
                var ret = data.ReturnValue;
                wx.setStorageSync('BSNUM',ret.bsnum);
                weui.toast('暂存提交成功');
            }else{
                weui.toast(data.error ||'暂存提交失败','warn');
            }
        }
    });
}

var weui = {
    toast: function (msg,sicon,stime) {
        msg = msg || "成功";
        let data = {
            title:msg
        };

        page.setData({dialogs:data});

        let tout = setTimeout(()=>{
            let animation = wx.createAnimation()
            animation.opacity(1).step()
            data.animationData = animation.export()
            data.reveal = true
            page.setData({
                dialogs: data
            })
        },30);

        setTimeout(() => {
            clearTimeout(tout);
            page.setData({dialogs:{'reveal':false}})
        }, stime||3000)
    },
    showError: function (msg) {
        msg = msg || "数据加载失败，请重试";
        this.hideLoading();
        wx.showModal({
            title: '提示',
            content: msg
        });
    },
    showLoading: function (msg) {
        msg = msg || '加载中...';
        page.setData({dialogs:{loading:true,loadingText:msg}});
    },
    loading : function(msg){
        this.showLoading(msg)
    },
    hideLoading: function () {
        page.setData({dialogs:{loading:false}})
    }
};

/*设置页面模块*/
function setPage(_page){
    page = _page;
}

var $ = {weui:weui};


var wxTools = {}; // 与微信操作相关
wxTools.clearStorage = ()=>{
    let unionId = wx.getStorageSync("unionId");
    wx.clearStorageSync();
    wx.setStorageSync("unionId",unionId);
};


module.exports = {
    setPage : setPage,
    weui:weui,
    param : param,
    formatTime: formatTime,
    tempStore: tempStore,
    getUnionId: getUnionId,
    g:G,
    wxTools:wxTools
};
