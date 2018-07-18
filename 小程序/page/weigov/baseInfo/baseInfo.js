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
        this.business();
        this.baseInfo();
    },
    business: function () {
        var that = this;
        var $scope = that.data;
        //业务信息
        $scope.businessObj = {
            businessid:"",
            cbusinessid:"",
            citemid:"",
            citemversion:"",
            permid:"",
            largeitemid:"",
            smallitemid:"",
            smallitemname:"",
            itemversion:"",
            itemlimittime:"",
            itemlimitunit:"",
            regionid:"",
            deptcode:"",
            deptname:"",
            projectname:"",
            receiptid:"",
            submittype:"",
            applytime:"",
            endtime:"",
            lawaddr:"",
            realaddr:"",
            status:"0",
            applicantid:"",
            state:"5",
            groupid:"",
            groupname:"",
            lzfs:""

        };
        if($scope.itemInfo.ID){$scope.businessObj.permid=$scope.itemInfo.ID}
        if($scope.itemInfo.LARGEITEMID){$scope.businessObj.largeitemid=$scope.itemInfo.LARGEITEMID}
        if($scope.itemInfo.SMALLITEMID){$scope.businessObj.smallitemid=$scope.itemInfo.SMALLITEMID}
        if($scope.itemInfo.SXZXNAME){$scope.businessObj.smallitemname=$scope.itemInfo.SXZXNAME}
        if($scope.itemInfo.ITEMVERSION){$scope.businessObj.itemversion=$scope.itemInfo.ITEMVERSION}
        if($scope.itemInfo.ITEMLIMITTIME){$scope.businessObj.itemlimittime=$scope.itemInfo.ITEMLIMITTIME}
        if($scope.itemInfo.ITEMLIMITUNIT){$scope.businessObj. itemlimitunit=$scope.itemInfo.ITEMLIMITUNIT}
        if($scope.itemInfo.REGIONID){$scope.businessObj.regionid=$scope.itemInfo.REGIONID}
        if($scope.itemInfo.DEPTID){$scope.businessObj.deptcode=$scope.itemInfo.DEPTID}
        if($scope.itemInfo.DEPTNAME){$scope.businessObj.deptname=$scope.itemInfo.DEPTNAME}
        if($scope.itemInfo.SXZXNAME){$scope.businessObj.projectname=$scope.itemInfo.SXZXNAME}
        if($scope.itemInfo.LAWADDR){$scope.businessObj.lawaddr=$scope.itemInfo.LAWADDR}
        if($scope.itemInfo.REALADDR){$scope.businessObj.realaddr=$scope.itemInfo.REALADDR}
        if( $scope.USER_ID){$scope.businessObj.applicantid= $scope.USER_ID}
        wx.setStorageSync("business",$scope.businessObj);
        that.setData($scope);
    },
    baseInfo: function () {
        var that = this;
        var $scope = that.data;
        var PERMID = $scope.itemInfo.ID;
        function finish(data) {
            var params =
            {
                token: $scope.TOKEN,
                ID: $scope.USER_ID
            };

            params = JSON.stringify(params);
            // console.log(params)
            var data =
            {
                server: "RestUserService",
                method: "getInfoByUserid",
                param: params
            };

            that.service('weigov/serviceController/get.do', data, function (re) {
                console.log(re);
                if (re.code == 200) {
                    var baseInfo = re.ReturnValue;

                    if (that.isVal(baseInfo.CERTIFICATETYPE)) {
                        $scope.formObj.zjlx = baseInfo.CERTIFICATETYPE;
                    }else{
                        $scope.formObj.zjlx = "";
                    }
                    if ($scope.USERTYPE == "1") {
                        //申请人

                        if (that.isVal(baseInfo.USER_NAME)) {
                            $scope.formObj.sqr_mc = baseInfo.USER_NAME;
                            $scope.USER_NAME = baseInfo.USER_NAME;
                        } else {
                            $scope.formObj.sqr_mc = "";
                        }
                        if (that.isVal(baseInfo.USER_EMAIL)) {
                            $scope.formObj.sqr_dzxx = baseInfo.USER_EMAIL;
                            $scope.USER_EMAIL = baseInfo.USER_EMAIL;
                        } else {
                            $scope.formObj.sqr_dzxx = "";
                        }

                        if (that.isVal(baseInfo.USER_PID)) {
                            $scope.formObj.sqr_sfzjhm = baseInfo.USER_PID;
                            $scope.USER_PID = baseInfo.USER_PID;
                        }else{
                            $scope.formObj.sqr_sfzjhm = "";
                        }

                        if (that.isVal(baseInfo.USER_MOBILE)) {
                            $scope.formObj.sqr_yddh = baseInfo.USER_MOBILE;
                            $scope.USER_MOBILE = baseInfo.USER_MOBILE;

                        }else{
                            $scope.formObj.sqr_yddh = "";
                        }

                        if (that.isVal(baseInfo.USER_PHONE)) {
                            $scope.formObj.sqr_gddh = baseInfo.USER_PHONE;
                            $scope.USER_PHONE = baseInfo.USER_PHONE;
                        }else{
                            $scope.formObj.sqr_gddh = "";
                        }
                        console.log("====baseInfo====");
                        console.log(baseInfo);
                    } else if ($scope.USERTYPE == "2") { //企业信息
                        if (that.isVal(baseInfo.AGE_NAME)) {
                            $scope.formObj.sqr_mc = baseInfo.AGE_NAME;
                            $scope.USER_NAME = baseInfo.AGE_NAME;
                        } else {
                            $scope.formObj.sqr_mc = "";
                        }

                        if (that.isVal(baseInfo.AGE_PID)) {
                            $scope.formObj.sqr_sfzjhm = baseInfo.AGE_PID;
                        }else{
                            $scope.formObj.sqr_sfzjhm = "";
                        }
                        if (that.isVal(baseInfo.AGE_EMAIL)) {
                            $scope.formObj.dzxx = baseInfo.AGE_EMAIL;
                        }else{
                            $scope.formObj.dzxx = "";
                        }
                        if (that.isVal(baseInfo.AGE_PHONE)) {
                            $scope.formObj.sqr_gddh = baseInfo.AGE_PHONE;
                            $scope.USER_PHONE = baseInfo.AGE_PHONE;
                        }else{
                            $scope.formObj.sqr_gddh = "";
                        }
                        if (that.isVal(baseInfo.USER_MOBILE)) {
                            $scope.formObj.sqr_yddh = baseInfo.USER_MOBILE;
                            $scope.USER_MOBILE = baseInfo.USER_MOBILE;
                        } else {
                            $scope.formObj.sqr_yddh = "";
                        }

                    }
                }
                wx.setStorageSync('baseInfo',true);
                that.setData($scope);
            });
        }
        //表单信息
        wx.request({
            url:surl.host + 'weigov/serviceController/get.do',
            data:{
                method: 'getFormByPermidV2',
                server: 'RestPermissionitemService',
                param: {ENTERANCE: 1, P_GROUP_ID: $scope.P_GROUP_ID, PERMID: PERMID}
            },
            success: function (data) {
                that.hideLoading();
                data = data.data;
                console.log("根据事项编号获取表单信息（V2.0）");
                console.log(data);
                if ((typeof data == "object" && data.code == 200)) {
                    var formInfos = data.ReturnValue;
                    var formInfo = formInfos[0];
                    if(that.isVal(formInfo.ID)){
                        $scope.formObj.formid = formInfo.ID;
                    }else{
                        $scope.formObj.formid = "";
                    }
                    if(that.isVal(formInfo.FORMVER)){
                        $scope.formObj.version = formInfo.FORMVER;
                    }else{
                        $scope.formObj.version = "";
                    }
                    that.setData($scope);
                    finish(data);
                }
            }
        });
    },
    next: function () {
        var that = this;
        var $scope = that.data;
        if(
            $scope.REALNAME == "" || $scope.MOBILE == "" || $scope.USER_PID == "" ||
            $scope.REALNAME == null || $scope.MOBILE == null || $scope.USER_PID == null
          ){
            that.showError('带*号的都为必填内容');
            return;
        }
        if(!(/^1(3|4|5|6|7|8)\d{9}$/.test($scope.MOBILE))){
            that.showError('请输入正确的手机号',{title: '温馨提示'});
            return;


        }
        var regID = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (!regID.test($scope.USER_PID)) {

            that.showError('请输入正确的身份证号码',{title: '温馨提示'});
            return;
        }


        if(that.isVal($scope.comment)){
            $scope.formObj.bz = $scope.comment;
        }else{
            $scope.formObj.bz = "";
        }
        that.setData($scope);
        that.cacheData();
        wx.setStorageSync("form",$scope.formObj);
        that.go('step4');
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
    check: function () {
        var that = this;
        var $scope = that.data;
        if
            (
            $scope.REALNAME == "" || $scope.MOBILE == "" || $scope.USER_PID == "" ||
            $scope.REALNAME == null || $scope.MOBILE == null || $scope.USER_PID == null
            ) {
            return false;
        }
        if (!(/^1(3|4|5|6|7|8)\d{9}$/.test($scope.MOBILE))) {
            return false;
        }
        var regID = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (!regID.test($scope.USER_PID)) {
            return false;
        }
        return true;
    },
    cacheData: function () {
        var that = this;
        var $scope = that.data;
        var userInfo = wx.getStorageSync('userInfo');
        if(that.isVal($scope.comment)){
            $scope.formObj.bz = $scope.comment;
        }else{
            $scope.formObj.bz = "";
        }

        userInfo.comment = $scope.comment || "";
        userInfo.TOKEN = $scope.TOKEN || userInfo.TOKEN;
        userInfo.USERTYPE = $scope.USERTYPE || "";
        userInfo.USER_EMAIL = $scope.USER_EMAIL || "";
        userInfo.MOBILE = $scope.MOBILE || "";
        userInfo.REALNAME = $scope.REALNAME || "";
        userInfo.USER_NAME = $scope.USER_NAME || "";
        userInfo.USER_PHONE = $scope.USER_PHONE || "";
        wx.setStorageSync('userInfo', userInfo);
        //更新form的内容 用户信息表单
        $scope.formObj.sqr_mc = $scope.REALNAME || "";
        $scope.formObj.sqr_yddh = $scope.MOBILE || "";  //手机号
        $scope.formObj.sqr_sfzjhm = $scope.USER_PID || "";    //身份证号码
        $scope.formObj.sqr_dzxx = $scope.USER_EMAIL || "";  //邮箱
        $scope.formObj.sqr_gddh = $scope.USER_PHONE || "";  //固定电话
        wx.setStorageSync('form', $scope.formObj);
        app.globalData.stateBaseInfo = that.check() ? 1 : 4;
        that.setData($scope);
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
            TOKEN : user.TOKEN || user.token,
            USER_ID : user.USER_ID || user.userid,
            USER_EMAIL : user.USER_EMAIL || user.EMAIL,
            MOBILE : user.MOBILE || user.MOBILE,
            REALNAME : user.REALNAME || user.REALNAME,
            USERNAME : user.USERNAME || user.USERNAME,
            USER_PID : user.USER_PID || user.USER_PID,
            USER_PHONE : user.USER_PHONE || user.MOBILE,
            comment : user.comment || '',
            TYPE : user.TYPE || user.TYPE
        };
        wx.setStorageSync("userInfo",userInfo);
    },
    onLoad : function (getparams) {
        this.showLoading();
        var that = this;
        var unionid = wx.getStorageSync("unionId");

        that.login(unionid);

        var $scope = that.data;
        $scope.P_GROUP_ID =getparams.P_GROUP_ID;  // 材料分组ID
        wx.setStorageSync('P_GROUP_ID',$scope.P_GROUP_ID);

        $scope.stateBaseInfo = app.globalData.stateBaseInfo;
        $scope.stateStep4 = app.globalData.stateStep4;
        $scope.stateStep5 = app.globalData.stateStep5;

        var userInfo = wx.getStorageSync("userInfo");

        $scope.CERTIFICATETYPE = 1;
        $scope.TOKEN = userInfo.TOKEN=="null"?"":userInfo.TOKEN;
        $scope.USER_ID = userInfo.USER_ID=="null"?"":userInfo.USER_ID;
        $scope.USERTYPE = userInfo.TYPE=="null"?"":userInfo.TYPE;
        $scope.USER_EMAIL = userInfo.USER_EMAIL=="null"?"":userInfo.USER_EMAIL;
        $scope.MOBILE = userInfo.MOBILE=="null"?"":userInfo.MOBILE;
        $scope.REALNAME = userInfo.REALNAME=="null"?"":userInfo.REALNAME;
        $scope.USER_NAME = userInfo.USERNAME=="null"?"":userInfo.USERNAME;
        $scope.USER_PID = userInfo.USER_PID=="null"?"":userInfo.USER_PID;
        $scope.USER_PHONE = userInfo.USER_PHONE=="null"?"":userInfo.USER_PHONE;
        $scope.comment = userInfo.comment=="null"?"":userInfo.comment;
        $scope.type = userInfo.TYPE=="null"?"":userInfo.TYPE;
        $scope.stateBaseInfo = app.globalData.stateBaseInfo || 0; // 0:未验证，1：验证通过，4：验证不通过
        $scope.stateStep4 = app.globalData.stateStep4 || 0;
        $scope.stateStep5 = app.globalData.stateStep5 || 0;
        var pageType = wx.getStorageSync("pageType");

        //表单信息
        $scope.formObj = {
            dataid:"",
            pid:"",
            bsnum:"",
            formid:"A",
            version:"1.0",
            formtype:"10",
            sqr_mc:"",
            sqr_yddh:"",
            sqr_sfzjhm:"",
            sqr_dzxx:"",
            sqr_gddh:"",
            zjlx:"",
            bz:""
        };

        if($scope.MOBILE){
            $scope.formObj.sqr_yddh = $scope.MOBILE
        }
        if($scope.EMAIL){
            $scope.formObj.sqr_dzxx = $scope.EMAIL
        }
        that.setData($scope);

        function getDataByBsnum(BSNUM){
            if(!BSNUM){
                return;
            }
                //业务流水号存在则为暂存件需要dataid
            wx.request({
                url:surl.host + "weigov/serviceController/getInsFormData.do",
//                method:"POST",
//                header:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
                data:{
                    method: 'getInsFormData',
                    server: 'RestOnlineDeclareService',
                    param: {token:$scope.TOKEN,BSNUM:BSNUM}
                },
                success: function (data) {
                    that.hideLoading();
                    console.log("根据流水号获取dataid");
                    console.log(data);
                    data = data.data;
                    if (typeof data == "object") {
                        if(typeof data.dataid == "object"){

                            if(data.dataid.length>0){
                                var did = data.dataid[0];
                                if(that.isVal(did)){
                                    $scope.formObj.dataid = did;
                                }else{
                                    $scope.formObj.dataid = "";
                                }
                                wx.setStorageSync('dataid',data.dataid[0]);
                            }
                        }
                        if(that.isVal(data.bz)){
                            $scope.comment = data.bz;
                        }else{
                            $scope.comment = "";
                        }
                    }
                    that.setData($scope);
                    console.log($scope.formObj);
                }
            });

            $scope.formObj.bsnum = BSNUM;
        }

        if(pageType == "myReport"){
            var BSNUM = wx.getStorageSync("BSNUM");
            getDataByBsnum(BSNUM);

            //暂存件获取办事事项信息begin
            var param = JSON.stringify({token:$scope.TOKEN,BSNUM:BSNUM});
            wx.request({
                url:surl.host + "weigov/serviceController/get.do",
                data: {method:'getwebhallbusiness',server:'RestOnlineDeclareService',param:param},
                success: function (data) {
                    that.hideLoading();
                    data = data.data;
                    console.log("business");
                    console.log(data);
                    if(data.code=="200"){
                        var itemData = data.ReturnValue;
                        itemData.ID = itemData.PERMID;
                        itemData.SXZXNAME = itemData.SMALLITEMNAME;
                        itemData.DEPTID = itemData.DEPTCODE;
                        wx.setStorageSync("itemInfo",itemData);

                        $scope.itemInfo = wx.getStorageSync("itemInfo");
                        if(that.isVal($scope.itemInfo.ID)){
                            $scope.formObj.pid = $scope.itemInfo.ID
                        }else{
                            $scope.formObj.pid = "";
                        }
                        that.setData($scope);
                        that.init();
                    }else{
                        that.init();
                        console.log("事项信息获取失败");
                        console.log(data.error);
                    }
                }
            });
            //暂存件获取办事事项信息end
        }else{
            $scope.itemInfo = wx.getStorageSync("itemInfo");
            if(that.isVal($scope.itemInfo.ID)){
                $scope.formObj.pid = $scope.itemInfo.ID
            }else{
                $scope.formObj.pid = "";
            }
            that.setData($scope);
            that.init();
            that.hideLoading();
        }
    },
    onShow : function (params) {
        util.setPage(this);
        wx.setNavigationBarTitle({
            title: "填写基本资料"
        });
        var that = this;
        var $scope = this;
        $scope.toBaseInfo = function(){        };
        $scope.prev = function(){wx.navigateBack()};

        $scope.toStep4 = function(){
            var $scope = that.data;
            $scope.formObj.zjlx = 1;
            if($scope.comment){
                $scope.formObj.bz = $scope.comment;
            }else{
                $scope.formObj.bz = "";
            }
            if($scope.USER_NAME){
                $scope.formObj.lxr = $scope.USER_NAME;
            }else{
                $scope.formObj.lxr = "";
            }
            if($scope.USER_PID){
                $scope.formObj.sfzjhm = $scope.USER_PID;
            }else{
                $scope.formObj.sfzjhm = "";
            }
            if($scope.USER_EMAIL){
                $scope.formObj.dzxx = $scope.USER_EMAIL;
            }else{
                $scope.formObj.dzxx = "";
            }
            if($scope.USER_PHONE){
                $scope.formObj.lxdh = $scope.USER_PHONE;
            }else{
                $scope.formObj.lxdh = "";
            }
            wx.setStorageSync("form",$scope.formObj);
            that.setData($scope);
            that.cacheData();
            that.go('step4');
        };
        $scope.toStep5= function(){
            var $scope = that.data;
            $scope.formObj.zjlx = 1;
            if($scope.comment){
                $scope.formObj.bz = $scope.comment;
            }else{
                $scope.formObj.bz = "";
            }
            if($scope.USER_NAME){
                $scope.formObj.lxr = $scope.USER_NAME;
            }else{
                $scope.formObj.lxr = "";
            }
            if($scope.USER_PID){
                $scope.formObj.sfzjhm = $scope.USER_PID;
            }else{
                $scope.formObj.sfzjhm = "";
            }
            if($scope.USER_EMAIL){
                $scope.formObj.dzxx = $scope.USER_EMAIL;
            }else{
                $scope.formObj.dzxx = "";
            }
            if($scope.USER_PHONE){
                $scope.formObj.lxdh = $scope.USER_PHONE;
            }else{
                $scope.formObj.lxdh = "";
            }
            wx.setStorageSync("form",$scope.formObj);
            wx.setStorageSync("enterPage","step5");
            that.setData($scope);
            that.cacheData();
            that.go('step5');
        };
        that.setData($scope);
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
