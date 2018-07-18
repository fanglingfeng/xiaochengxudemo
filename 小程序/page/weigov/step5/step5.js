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
        noData:false,
        isInput:false,
        showMore:false
    },
    go: function (page) {
        var url = {
            baseInfo:'../baseInfo/baseInfo',
            step4:'../step4/step4',
            step5:'../step5/step5'
        };
        wx.redirectTo({
            url: url[page]
        });
    },
    onLoad : function (getparams) {

    },
    onShow : function (getparams) {
        wx.setNavigationBarTitle({
            title: "领取方式"
        });
        util.setPage(this);
        this.addAddress = function(){
            wx.navigateTo({
                url: '../addressList/addressList'
            })
        };

        this.showLoading();
        var that = this;
        var $scope = this;
        var itemInfo = wx.getStorageSync("itemInfo");
        var P_GROUP_ID = wx.getStorageSync('P_GROUP_ID');
        var PERMID = itemInfo.ID || '';
        var pageType = wx.getStorageSync("pageType");
        var form = JSON.stringify(wx.getStorageSync("form"));
        var business = JSON.stringify(wx.getStorageSync("business"));
        var material = JSON.stringify(wx.getStorageSync("finalMaterial_"+PERMID+P_GROUP_ID)); // 最终材料

        var userInfo = wx.getStorageSync("userInfo");
        var url="weigov/serviceController/formSubmit.do?TOKEN="+userInfo.TOKEN;
        $scope.method = "POST";
        var expressInfo = wx.getStorageSync("expressInfo");// 快递信息
        userInfo = expressInfo != undefined && expressInfo != "undefined" && expressInfo != '' ? expressInfo : userInfo; // 如果存在快递信息就以快递信息为准

        $scope.blmsData = {
            '1':'此事项零次到现场全流程网上办理',
            '2':'此事项线上申请、线上提交（受理环节递交纸质申请材料）',
            '3':'此事项线上申请、线上提交（领证环节递交纸质申请材料）',
            '4':'此事项线上预约、线下提交'
        };
        $scope.DJZZCLData = {
            '1':'网点递交',
            '2':'邮寄递交'
        };
        $scope.DJZZCLchecked = 1; // 递交方式
        $scope.LQSPJGData = {"1":"网点领取","2":"邮寄领取","3":"自行打印"};
        $scope.LQSPJGchecked = wx.getStorageSync('LQSPJGchecked') || 1; //领取方式

        $scope.SXZXNAME = itemInfo.SXZXNAME;
        $scope.bumen = itemInfo.DEPTNAME;
        $scope.TOKEN = userInfo.TOKEN;
        $scope.USER_ID = userInfo.USER_ID;
        $scope.USERNAME = userInfo.USERNAME;
        $scope.REALNAME = userInfo.REALNAME;
        $scope.MOBILE = userInfo.MOBILE;
        $scope.TYPE = userInfo.TYPE;
        $scope.EXPRESS_CODE = userInfo.EXPRESS_CODE ||  ""; // 兼容代码
        $scope.ADDRESS = userInfo.ADDRESS || "";
        $scope.isEMS = !!userInfo.isEMS;
        $scope.postxmls = [];

        $scope.stateBaseInfo = app.globalData.stateBaseInfo || 0; // 0:未验证，1：验证通过，4：验证不通过
        $scope.stateStep4 = app.globalData.stateStep4 = typeof app.globalData.stateStep4 == "undefined" ? 4 : app.globalData.stateStep4;
        $scope.stateStep5 = app.globalData.stateStep5 || 0;

        if(userInfo.USER_ID){
            $scope.USER_ID = userInfo.USER_ID;
        }
        if(userInfo.REALNAME){
            $scope.REALNAME = userInfo.REALNAME;
        }
        if(userInfo.MOBILE){
            $scope.MOBILE = userInfo.MOBILE;
        }
        if($scope.EXPRESS_CODE == null || $scope.EXPRESS_CODE == "null"){
            $scope.EXPRESS_CODE = "";
        }

        $scope.lingqu = function (e) {
            var $scope = that.data;
            var type = e.currentTarget.dataset.id;
            if(type=="web"){
                $scope.isEMS = false;
            }else{
                $scope.isEMS = true;
            }
            that.setData($scope);
        };
        function service(method,url,data,callback){
            wx.request({
                url: surl.host + url,
                header:{'Content-Type':'application/x-www-form-urlencoded'},
                method: "POST",
                data: that.param(data),
                success: function (data) {
                    console.log(data);
                    data = data.data;
                    callback && callback(data);
                }
            });
        }
        $scope.submit = function() {
            var $scope = that.data;
            var data = {};
            var $ = util;
            if(app.globalData.stateBaseInfo != 1){
                $.weui.toast('请完善基本表单');
                return ;
            }
            if (app.globalData.stateStep4 != 1){
                $.weui.toast('请上传资料');
                return ;
            }

            if($scope.isEMS){
                if($scope.userPostInfo.RECEIVE==""||$scope.userPostInfo.MOBILE==""||$scope.userPostInfo.ADDRESS==""){
                    $.weui.toast('请填写邮寄信息');
                    return;
                }
                $scope.REALNAME = $scope.userPostInfo.RECEIVE ;
                $scope.ADDRESS = $scope.userPostInfo.ADDRESS ;
                $scope.MOBILE = $scope.userPostInfo.MOBILE ;
                //EMS信息领取
                var postxml1 = {
                    ddhm:"",
                    ddmc:'',
                    ddlx:$scope.LQSPJGchecked,
                    item:{
                        type:"S",
                        xm:$scope.REALNAME,
                        dw:"",
                        dz:$scope.ADDRESS,
                        dh:$scope.MOBILE,
                        sj:"",
                        yb:'',
                        csdm:""
                    }
                };
                //递交材料方式
                var postxml2 = {
                    ddhm:"",// 订单号码
                    ddmc:'',// 订单名称
                    ddlx:$scope.DJZZCLchecked,
                    item:{
                        type:"S",
                        xm:$scope.REALNAME,
                        dw:"",
                        dz:$scope.ADDRESS,
                        dh:$scope.MOBILE,
                        sj:"",
                        yb:'',
                        csdm:""
                    }
                };
                $scope.postxmls.push(postxml1);
                $scope.postxmls.push(postxml2);
                console.log(JSON.stringify($scope.postxmls))
                var postxml = JSON.stringify($scope.postxmls);
                data = {
                    server: "RestOnlineDeclareService",
                    method: "submit",
                    form: form,
                    business: business,
                    postxml: postxml,
                    material: material
                };
            }else{
                data = {
                    server:"RestOnlineDeclareService",
                    method:"submit",
                    form:form,
                    business:business,
                    postxml:"null",
                    material:material
                };
            }
            $.weui.loading('申报提交中...');
            // 设置领证方式 2017-03-16
            var _b = JSON.parse(data.business);
            _b.lzfs = $scope.LQSPJGchecked;
            var bsnum = wx.getStorageSync('BSNUM') || '';
            if(bsnum != '') {
                var _form = JSON.parse(form);
                _b.bsnum = bsnum;
                _b.businessid = bsnum;
                _form.bsnum = bsnum;
                form = JSON.stringify(_form);
            }
            data.form = form;
            data.business = JSON.stringify(_b);
            service($scope.method,url,data,function(re){
                console.log(re);
                $.weui.hideLoading();
                try {
                    if (re.code == 200) {
                        $.weui.toast('提交成功');
                        setTimeout(function () {
                            wx.redirectTo({
                                url: '../my-apply/my-apply'
                            });
                        }, 1000);
                    } else {
                        $.weui.toast(re.error || '提交失败');
                    }
                }catch(e){
                    $.weui.toast('请重试');
                }
            });
        };

        // 邮寄地址为无且领取方式为邮寄验证不通过
        function check() {
            var $scope = that.data;
            if($scope.isEMS && !$scope.userPostInfo) {
                return false;
            }
            return true;
        }

        // 获取办理模式
        $scope.getPermMethod = function (permid) {
            var $ = util;
            var that = this;
            var $scope = this.data;
            $.weui.loading();
            wx.request({
                url: surl.host + "weigov/serviceController/get.do",
                data: {server:'RestPermissionitemService',method:'getPermWsfwsd',param:{"PERMID":permid}},
                success: function (data) {
                    $.weui.hideLoading();
                    data = data.data;
                    console.log('获取办理模式',data);
                    if(data.code==200){
                        var ret = data.ReturnValue;
                        if(ret == null) return;
                        $scope.scopeData = ret;
                        $scope.scopeDataLQSPJG = ret.LQSPJG ? ret.LQSPJG.split(',') : [];
                        $scope.scopeDataDJZZCL = ret.DJZZCL ? ret.DJZZCL.split(',') : [];
                        if(!ret.LQSPJG && !ret.DJZZCL){
                            $scope.scopeData = null;
                        }
                        that.setData($scope);
                    }else{
                        $.weui.toast(data.error ||'网络请求失败');
                    }
                }
            });
        };
        // 获取网点信息
        $scope.getNetwork = function (id) {
            var $ = util;
            var that = this;
            var $scope = this.data;
            $.weui.loading();
            wx.request({
                url: surl.host + "weigov/serviceController/get.do",
                data: {server:'RestNetworkService',method:'getNetworkByPermid',param:{"PERMID":id}},
                success: function (data) {
                    $.weui.hideLoading();
                    data = data.data;
                    if(data.code==200){
                        $scope.networkDetail = data.ReturnValue.Items[0];
                        that.setData($scope);
                    }else{
                        $.weui.toast(data.error ||'网络请求失败');
                    }
                }
            });
        };
        //获取用户收货地址
        $scope.getUserPostInfo = function (id) {
            var $ = util;
            var that = this;
            var $scope = this.data;
            $.weui.loading();
            wx.request({
                url: surl.host + "weigov/serviceController/get.do",
                data: {server:'RestEMSService',method:'getUserPostInfo',param:{"USERID":id}},
                success: function (data) {
                    $.weui.hideLoading();
                    data = data.data;
                    if(data.code==200){
                        $scope.userPostInfo = data.ReturnValue.Items[0];
                        that.setData($scope);
                    }else{
                        $.weui.toast(data.error ||'网络请求失败');
                    }
                }
            });
        };

        $scope.init = function () {
            $scope.getPermMethod(PERMID);
            $scope.getNetwork(PERMID);
            $scope.getUserPostInfo(userInfo.USER_ID);
        };

        $scope.sendDJZZCL = function (item) {
            item = typeof item == 'object' ? item.currentTarget.dataset.id : item;
            $scope = this.data;
            $scope.DJZZCLchecked = item;
            that.setData($scope);
        };
        $scope.lingqu = function (item) {
            item = typeof item == 'object' ? item.currentTarget.dataset.id : item;
            $scope = this.data;
            $scope.LQSPJGchecked = item;
            wx.setStorageSync('LQSPJGchecked',item);
            if(item=="2"){
                $scope.isEMS = true;
            }else{
                $scope.isEMS = false;
            }
            that.setData($scope);
        };
        $scope.addAddress = function(postId){
            wx.setStorageSync('LQSPJGchecked',postId || '');
            wx.navigateTo({
                url: '../addressList/addressList'
            });
        };

        $scope.cacheData = function () {
            var $scope = that.data;
            var expressInfo = {};
            expressInfo.bumen = $scope.bumen;
            expressInfo.SXZXNAME = $scope.SXZXNAME;
            expressInfo.TOKEN = $scope.TOKEN;
            expressInfo.USER_ID = $scope.USER_ID;
            expressInfo.USERNAME = $scope.USERNAME;
            expressInfo.REALNAME = $scope.REALNAME;
            expressInfo.MOBILE = $scope.MOBILE;
            expressInfo.TYPE = $scope.TYPE;
            expressInfo.EXPRESS_CODE = $scope.EXPRESS_CODE;
            expressInfo.ADDRESS = $scope.ADDRESS;
            expressInfo.isEMS = $scope.isEMS;
            wx.setStorageSync('expressInfo',expressInfo);
            app.globalData.stateStep5 = check() ? 1 : 4;
        };
        $scope.toBaseInfo = function(){
            $scope.cacheData();
            that.go('baseInfo');
        };
        $scope.toStep4 = function(){
            $scope.cacheData();
            that.go('step4');
        };
        $scope.toStep5= function(){
            $scope.cacheData();
            that.go('step5');
        };

        $scope.stateBaseInfo = app.globalData.stateBaseInfo;
        $scope.stateStep4 = app.globalData.stateStep4;
        $scope.stateStep5 = app.globalData.stateStep5;

        that.hideLoading();
        that.setData($scope);

        $scope.init();
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
    param: function (data) {
        var s = [];
        var add = function( key, value ) {
            s[ s.length ] = encodeURIComponent( key ) + "=" +
                encodeURIComponent( value == null ? "" : value );
        };
        for(var k in data){
            add(k,data[k]);
        }
        return s.join( "&" );
    },
    toast: function (msg) {
        msg = msg || "成功";
        wx.showToast({
            title: msg,
            icon: 'success',
            duration: 2000
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
    showLoading: function (msg) {
        msg = msg || '加载中...';
        this.setData({loading:true,loadingText:msg})
    },
    hideLoading: function () {
        this.setData({loading:false})
    },
});
