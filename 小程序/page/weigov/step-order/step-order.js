var app = getApp();
var surl = require('../../../util/surl.js');
var keys = require('../../../util/keys.js');
var util = require('../../../util/util.js');
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

        var itemInfo = wx.getStorageSync("itemInfo");
        $scope.DEPTNAME = itemInfo.DEPTNAME;
        $scope.SXZXNAME = itemInfo.SXZXNAME;
        $scope.DEPTID = itemInfo.DEPTID;
        $scope.PERMID = itemInfo.ID;

        var userInfo = wx.getStorageSync("userInfo");
        $scope.TOKEN = userInfo.TOKEN;
        $scope.USER_ID = userInfo.USER_ID || userInfo.userid;
        $scope.USERNAME = userInfo.USERNAME;
        $scope.REALNAME = userInfo.REALNAME;
        $scope.IDCARD = userInfo.USER_PID;
        $scope.MOBILE = userInfo.MOBILE;

        $scope.method = "post";
        var url="weigov/serviceController/get.do";
        function locationTo(url){
            wx.redirectTo({
                url: url
            });
        }

        function service(method,url,data,callback){
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
        
        $scope.dates = [];
        $scope.timesObj = {};
        $scope.riqi = 1;        //默认日期时段选中解决初始化select控件多出空行
        $scope.shiduan = 1;
        //初始化日期
        $scope.start = function(){
            var $scope = that.data;
            $scope.isDates = true;
            var params = {
                token:$scope.TOKEN,
                PERMID:$scope.PERMID,
                APPLICANTID:$scope.USER_ID,
                DEPTID:$scope.DEPTID
            };
            params = JSON.stringify(params);
            console.log(params);
            var data = {
                server:"RestOnlineReserveService",
                method:"getReserveDay",
                param:params
            };
            that.showLoading();
            service($scope.method,url,data,function(re){
                if(re.code==200){
                    var arr = re.ReturnValue.Items;
                    $scope.dates= [];
                    var i=0;
                    $scope.dateObj = {};//映射日期成1、2、3...
                    arr.forEach(function(item){
                        i++;
                        item['seq'] = i;
                        $scope.dates.push(item);
                        $scope.dateObj[i] = item.RESERVEDATE;
                        that.setData($scope);
                    });
                    $scope.changeTime($scope.riqi);
                }else{
                    that.showError(re.error || '网络故障',{title: '温馨提示'});
                }
            });
        };

        $scope.changeTime = function(riqi){
            var $scope = that.data;
            riqi = $scope.dateObj[riqi];//根据1、2、3...映射成日期格式
            for(var i in $scope.timesObj){
                if(riqi == i){
                    $scope.times = $scope.timesObj[i];
                    return;
                }
            }
            that.showLoading('可选择时段加载中...');
            $scope.isDates = true;
            $scope.times = [];
            var params =
            {
                token: $scope.TOKEN,
                PERMID:$scope.PERMID,
                DEPTID:$scope.DEPTID,
                DAY:riqi
            }
            params = JSON.stringify(params);
            console.log(params)
            var data =
            {
                server:"RestOnlineReserveService",
                method:"GetReserveDayTime",
                param:params
            }
            service($scope.method,url,data,function(re){
                console.log(re)
                if(re.code==200){
                    $scope.isDates = false;
                    var arr = re.ReturnValue.Items;
                    $scope.times = [];
                    $scope.timesO = {};
                    $scope.timesObj[riqi] = $scope.times;
                    var i=0;
                    arr.forEach(function (item) {
                        i++;
                        item['seq'] = i;
                        $scope.times.push(item);
                        $scope.timesO[i] = item.RESERVETIME;
                    });
                    that.setData($scope);
                }else{
                }
            });
        }


        $scope.Order = function (params){
            var $scope = that.data;
            params = JSON.stringify(params);
            console.log(params)
            var data =
            {
                server:"RestOnlineReserveService",
                method:"submit",
                param:params
            }
            that.showLoading();
            service($scope.method,url,data,function(re){
                if(re.code==200){
                    that.toast('预约成功');
                    setTimeout(function () {
                        locationTo("../my-order/my-order");
                    },1000);
                }else{
                    that.showError(re.error || "网络故障",{title: '温馨提示'});
                }
            });
        };
        $scope.next = function () {
            var $scope = that.data;
            var params =
            {
                "DEPTID":$scope.DEPTID,
                "PERMID":$scope.PERMID,
                "RESERVEDATE":$scope.dateObj[$scope.riqi],
                "RESERVETIME": $scope.timesO[$scope.shiduan],
                "APPLICANTID":$scope.USER_ID,
                "token": $scope.TOKEN
            };

            console.log(JSON.stringify(params));
            that.showLoading('正在预约...');
            $scope.Order(params);
            return;
            if(
                $scope.USERNAME!=null&&$scope.USERNAME!=""&&
                $scope.MOBILE!=null&&$scope.MOBILE!=""&&
                $scope.IDCARD!=null&&$scope.IDCARD!=""&&
                $scope.DEPTNAME!=null&&$scope.DEPTNAME!=""&&
                $scope.SXZXNAME!=null&&$scope.SXZXNAME!=""&&
                $scope.riqi!=null&&$scope.riqi!=""&&
                $scope.shiduan!=null&&$scope.shiduan!=""
                ){
                var regID = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                if (!regID.test($scope.IDCARD)) {
                    that.showError('请输入正确的身份证号码',{title: '温馨提示'});
                    return;
                }
                if(!(/^1(3|4|5|6|7|8)\d{9}$/.test($scope.MOBILE))){
                    that.showError('请输入正确的手机号',{title: '温馨提示'});
                    return;
                }
            }else{
                that.showError('请输入完整',{title: '温馨提示'});
                return;
            }
        };
        that.hideLoading();
        that.setData($scope);
        $scope.start();
    },
    go: function (page) {
        var url = {
            step4:'../step4/step4'
        };
        wx.redirectTo({
            url: url[page]
        });
    },
    bindUser: function () {
        wx.setStorageSync('loginFrom','../baseInfo/baseInfo');
        wx.redirectTo({
            url: '../login/login'
        });
    },
    login: function (unionid,cb) {
        var that = this;
        var url = "wx/wxUserController.do?getUserInfoByUnionid";
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
                    var user = wx.getStorageSync('userInfo');
                    user.TOKEN = data.token;
                    wx.setStorageSync("userInfo",user);
                    cb && cb();
                }
            });
        });
    },
    onLoad : function (getparams) {
        this.showLoading();
        var that = this;
        var unionid = wx.getStorageSync("unionId");
        that.login(unionid,that.init);
    },
    onShow : function (params) {
        wx.setNavigationBarTitle({
            title: "我要预约"
        });
    },
    bindKeyInput: function(e) {
        var _id = e.currentTarget.dataset.id;
        var $scope = this.data;
        $scope[_id] = e.detail.value;
        this.setData($scope);
    },
    radioChange : function (e) {
        var _id = e.currentTarget.dataset.id;
        var $scope = this.data;
        $scope[_id] = e.detail.value;
        console.log('radio发生change事件，携带value值为：', e.detail.value);
        if(_id=='riqi'){
            this.changeTime(e.detail.value);
        }
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
    }
});
