var app = getApp();
var surl = require('../../../util/surl.js');
var keys = require('../../../util/keys.js');
var util = require('../../../util/util.js');
var materialId = '';
var materials = {};// 所有材料的上传信息
var aCurrentImg = [];//当前图片预览列表
var userInfo = wx.getStorageSync("userInfo");
var pageType = wx.getStorageSync("pageType");
var itemInfo = wx.getStorageSync("itemInfo");
var P_GROUP_ID = wx.getStorageSync('P_GROUP_ID');
var form = wx.getStorageSync("form");
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
    getMaterials:function () {
        var that = this;
        var $scope = that.data;

        function mater(data) {
            var maters = wx.getStorageSync("material_"+$scope.PERMID+P_GROUP_ID);
            for(var m in maters){
                that.attachFile(m);
            }
            var SFBYNUM = wx.getStorageSync("SFBYNUM");
            console.log("是否必须添加材料")
            console.log(SFBYNUM)
//            if(SFBYNUM==0){
//                that.initMaterial();
//            }
        }
        function perid(){
            var SFBYNUM = wx.getStorageSync("SFBYNUM");
            console.log("是否必须添加材料")
            console.log(SFBYNUM)
//            if(SFBYNUM==0){
//                that.initMaterial();
//            }
        }

        function getReport(){
            var BSNUM = wx.getStorageSync("BSNUM"),
                url = "weigov/serviceController/zanCunMaterials.do",
                params = {method:'getInsMaterialInfo',server:'RestOnlineDeclareService',param:{"token":$scope.TOKEN,"BSNUM":BSNUM}};
            wx.request({
                url: surl.host + url,
                data: params,
                success: function (data) {
                    that.hideLoading();
                    console.log("========材料========");
                    console.log(data);
                    data = data.data;
                    //判断是否返回异常
                    if (typeof data != "object") {
//                        getMaterialList(); // 暂存无数据就重新获取材料列表
                        return;
                    }
                    $scope.templist = data.materials[0];  // 暂存的材料列表
                    console.log($scope.templist);
                    $scope.allCailiao = [];

                    if ($scope.templist.length > 0) {
                        var _index = 0;
                        $scope.templist.forEach(function (item) {
                            _index++;
                            if (item.SFBY == "1") {
                                $scope.SFBYNUM++;
                            }
                            //初始化列表展示数据
//                            $scope.list.push(item);
                            $scope.allCailiao.push(item);
                            if (item.FILENAME != "" && item.FILEID != "") {
                                var fnameArr = item.FILENAME.split(".");
                                console.log(fnameArr);
                                var imgType = fnameArr[1].toLowerCase();
                                console.log(imgType);
                                if (imgType != "jpeg" && imgType != "tiff" && imgType != "raw" && imgType != "bmp" && imgType != "gif"
                                    && imgType != "png" && imgType != "psd" && imgType != "swf" && imgType != "svg" && imgType != "jpg") {
                                    return;
                                }
                                var _localid = "Xlocalid_" + _index;
                                var obj = {
                                    localid: _localid,         // 本地地址
                                    serverId: "",     // 微信服务器材料id
                                    id: item.FILEID                  // 网厅服务器材料id
                                };
                                $scope.files[item.ID] = {
                                    fileid: item.FILEID,
                                    filename: item.FILENAME,
                                    filepath: "MONGO",
                                    filedel: ""
                                };
                                materials[item.ID] = {};
                                materials[item.ID][_localid] = obj;
                                materials[item.ID][_localid]["localid"] = surl.fileHost+"servlet/downloadFileServlet?fileNo=" + item.FILEID;
                            }
                        });
                        wx.setStorageSync("SFBYNUM", $scope.SFBYNUM);
                    }
                    $scope.zancunfiles = data.files[0];

                    var arrAttachcode = [], i = 0, len = $scope.list.length;
                    for (; i < len; i++) {
                        arrAttachcode.push($scope.list[i].ID);
                    }
                    // getUploaded("315876",arrAttachcode.join(','));
                    var itemList = {yes: [], no: []};
                    $scope.material = $scope.allCailiao;
//                    var materialsInfo = {};
//                    if (len > 0) {
//                        $scope.material.forEach(function (item) {
//                            materialsInfo[item.ID] = item;
//                        });
//                    }
                    $scope.materials = materials;
                    that.setData($scope);
                    that.updateMaterialNumber($scope.material, materials, $scope.materialNumber);
//                    wx.setStorageSync("materialsInfo", materialsInfo);
//                    wx.setStorageSync("materialList_" + $scope.PERMID + P_GROUP_ID, $scope.material); // 保存材料列表
                    wx.setStorageSync("material_" + $scope.PERMID + P_GROUP_ID, materials);
                    mater([]);
                }
            });
        }

        function getMaterialList() {
            var url = "weigov/serviceController/get.do";
            var params = {method: 'getClxxByPermid', server: 'RestPermissionitemService', param: {"PERMID": $scope.PERMID, "P_GROUP_ID": P_GROUP_ID}};
            wx.request({
                url: surl.host + url,
                data: params,
                success: function (data) {
                    that.hideLoading();
                    data = data.data;
                    if (!(typeof data == "object" && data.code == 200)) {
//                        that.initMaterial();
                        return;
                    }
                    console.log(data);
                    $scope.list = data.ReturnValue;  // 材料列表
                    var arrAttachcode = [], i = 0, len = $scope.list.length;
                    $scope.material = $scope.list;
                    var materialsInfo = {};
                    if (len > 0) {
                        $scope.material.forEach(function (item) {
                            materialsInfo[item.ID] = item;
                            if (item.SFBY == "1") {
                                $scope.SFBYNUM++;
                            }
                        });
                        wx.setStorageSync("SFBYNUM", $scope.SFBYNUM);
                        that.setData($scope);
                    } else {
//                        that.initMaterial();
                    }
                    that.updateMaterialNumber($scope.material, materials, $scope.materialNumber);
                    wx.setStorageSync("materialsInfo", materialsInfo);
                    wx.setStorageSync("materialList_" + $scope.PERMID + P_GROUP_ID, $scope.list); // 保存材料列表
                    perid([]);
                    that.setData($scope);
                    if(pageType == "myReport"){
                        getReport();
                    }
                }
            });
        }

        getMaterialList();

    },
    // 从网厅获取已上传材料的事项
    getUploaded:function getUploaded(usercode,attachcode){
        var that = this;
        var $scope = that.data;
        that.setData($scope);
        $http({
            method:"post",
            url:"serviceController/get.do",
            params:{method:'attachSearch',server:'SpaceAttachInfoService',param:{"USERCODE":usercode,"ATTACHCODE":attachcode}}
        }).
        wx.request({
            url: surl.host + url,
            data: params,
            success:function(data) {
                that.hideLoading();
                if (!(typeof data == "object" && data.code == 200)) {
                    return;
                }
                console.log("getUploaded");
                console.log(data);
            }
        });
    },
    hasImg:function (imgs) {
        var has = false;
        for(var i in imgs){

            has = true;
        }
        return has;
    },
    selectMaterId:function (id) {
        var that = this;
        var $scope = that.data;
        that.setData($scope);
        materialId = id;
        if(pageType == "myReport"){
            var _materials = materials[materialId];//依据材料ID存放了每个材料的图片
            _materials = _materials == undefined ? {} : _materials;

            $scope.imgList = _materials;
            that.showImgList();
            // 如果列表中没有照片，直接拍照
            if(!that.hasImg($scope.imgList)){
                var files = $scope.zancunfiles[0][materialId];
                var len = files.length;
                if(len>0){
                    var fileid = files[0]['ID'];
                    var imgObj = {
                        id:fileid,
                        serverId : '',
                        localid:surl.fileHost+"servlet/downloadFileServlet?fileNo="+fileid
                    };
                    _materials[fileid] = imgObj;
                    materials[materialId] = {};
                    materials[materialId][fileid] = imgObj;
                    $scope.imgList = _materials;

                }else{
                    that.takePhoto();
                }
            }
        }else{
            $scope.imgList = materials[id];
            that.showImgList();
            // 如果列表中没有照片，直接拍照
            var temp = $scope.imgList;
            if(typeof temp == "undefined" || temp == null || temp.length<1){
                that.takePhoto();
            }
        }
    },
    hideImgList : function (){
        var that = this;
        var $scope = that.data;
        $scope.imgListStatues = false;
        that.setData($scope);
    },
    showImgList:function () {
        var that = this;
        var $scope = that.data;
        $scope.imgListStatues = true;
        that.setData($scope);
    },
    previewImage:function (url) {
        url = typeof url == 'object' ? url.currentTarget.dataset.id : url; // 小程序
        var that = this;
        var $scope = that.data;
        that.setData($scope);
        wx.previewImage({
            current: url, // 当前显示图片的http链接
            urls: aCurrentImg // 需要预览的图片http链接列表
        });
    },
    takePhoto:function(id){
        var that = this;
        var $scope = that.data;

        if(typeof  id == "undefined" || typeof id == 'object'){
            id = materialId;
        }else{
            materialId = id;
        }
        // uploadToNet(Math.random(),3);  // test
        wx.chooseImage({
            count: 9, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                that.hideLoading();
                var localIds = res.tempFilePaths; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                if(res.tempFilePaths.length > 0){
                    res.tempFilePaths.forEach(function (item) {
                        that.upload2wx(item,id);
                    });
                }
            }
        });
    },
    /**
     * 上传图片到微信
     * @param id
     */
    upload2wx:function upload2wx(localid,mid) {
        var that = this;
        var $scope = that.data;
        var materialId = mid || materialId;
        $scope.materialNumber[mid]['uploading'] ++;

        var _materials = materials[materialId];
        _materials = _materials == undefined ? {} : _materials;

        var obj = {
            localid : localid,         // 本地地址
            serverId : '',     // 微信服务器材料id
            id : ""                   // 网厅服务器材料id
        };
        _materials[localid] = obj;
        $scope.imgList = materials[materialId] = _materials;
        that.setData($scope);
        that.uploadToNet(localid,materialId); // 上传到网厅
    },
    uploadToNet: function (localid,mid) {
        var that = this;
        var $scope = that.data;
        var materialId = mid || materialId;

        wx.uploadFile({
            url: surl.host+'/weigov/xcxController/uploadMaterial.do',
            filePath: localid,
            name: 'file',
            formData:{
                USERID:$scope.USER_ID,
                SXID:$scope.PERMID,
                FILENAME:materialId+".png",
                FILEID:materialId
            },
            success: function(data){
                console.log(data);
                that.hideLoading();
                data = data.data;
                console.log("上传返回数据");
                console.log(data);
                data = JSON.parse(data);
                $scope.materialNumber[mid]['uploading'] --;
                if(data.code != 200){
                    that.showError("上传失败！",{title: '温馨提示'});
                    return ;
                }
                $scope.filename = materialId+".png";
                $scope.files[materialId] =  {
                    fileid:data.ReturnValue.FILEID,
                    filename:$scope.filename,
                    filepath:"/servlet/downloadFileServlet?fileNo="+data.ReturnValue.FILEID,
                    filedel:""
                };

                that.setData($scope);
                that.attachFile(materialId);
                materials[materialId][localid]["id"] = data.ReturnValue.FILEID;
                materials[materialId][localid]["localid"] = surl.fileHost+"servlet/downloadFileServlet?fileNo="+data.ReturnValue.FILEID;
                $scope.imgList = materials[materialId];
                that.setData($scope);
                that.onFinishUpload();
                that.hideLoading();
            },
            fail: function (res) {
                console.log(res);
            }
        });
    },
    /**
     * 当材料上传完成
     * id 材料id
     */
    onFinishUpload:function onFinishUpload(id) {
        var that = this;
        var $scope = that.data;
        $scope.materials = materials; // 更新显示
        that.setData($scope);
        that.updateMaterialNumber($scope.material,materials,$scope.materialNumber);
    },
    /**
     * 更新材料对应的数量
     */
    updateMaterialNumber:function updateMaterialNumber(list,imgs,num){
        var that = this;
        var $scope = that.data;
        num = $scope.materialNumber; // 给一个正真的引用
        if($scope.list instanceof Array !== true){
            console.warn("材料数量更新失败");
            return;
        }
        $scope.list.forEach(function (b, a, c) {
            if(that.isEmpty(num[b.ID])){
                num[b.ID] = {'uploading':0};
            }
            if(imgs.hasOwnProperty(b.ID)){
                var item = imgs[b.ID];
                num[b.ID]["uploaded"] = Object.getOwnPropertyNames(item).length;
            }else{
                num[b.ID]["uploaded"] = 0;
            }
        });
        that.setData($scope);
    },
    /*更新图片预览列表*/
    updatePreviewImage:function updatePreviewImage(mid) {
        var that = this;
        var $scope = that.data;
        var i,oMaterial = materials[mid];
        aCurrentImg = [];
        if(typeof oMaterial == "undefined"){
            return;
        }
        for(i in oMaterial){
            aCurrentImg.push(oMaterial[i].localid);
        }
    },
    showImgListByMaterial:function (id) {
        id = typeof id == 'object' ? id.currentTarget.dataset.id : id; // 小程序
        var that = this;
        var $scope = that.data;
        console.log(id);
        materialId = id;
        $scope.imgList = materials[id];
        if(typeof $scope.imgList == 'undefined'){  // 触发刷新
            $scope.imgList = {};
        }
        that.setData($scope);
        that.updatePreviewImage(id);
        that.showImgList();
    },
    uploadImgByMaterial:function (e) {
        var that = this;
        var $scope = that.data;
        var id = e.currentTarget.dataset.id;
        that.setData($scope);
        that.takePhoto(id);
    },
    showMaterialTitle:function (e) {
        var that = this;
        var s = e.currentTarget.dataset.id;
        that.showError(s, {title: ''});
    },
    imgDel:function(localid){
        localid = typeof localid == 'object' ? localid.currentTarget.dataset.id : localid; // 小程序
        var that = this;
        var $scope = that.data;
        that.delNetworkMaterial($scope.imgList[localid].id);//删除网厅对应材料，不关心是否删除成功，关注用户删除体验
        delete $scope.imgList[localid];
        delete materials[materialId][localid];
        $scope.materials = materials;
        that.setData($scope);
        that.updateMaterialNumber($scope.material,materials,$scope.materialNumber);
    },
    /**
     * 删除网厅材料
     * @param id
     */
    delNetworkMaterial:function delNetworkMaterial(id) {
        var that = this;
        var $scope = that.data;
        that.setData($scope);
        console.log(id);
        /* 删除网厅附件*/
        var url = "weigov/serviceController/get.do";// 网厅材料删除接口
        var params = {method:'attachDelete',server:'SpaceAttachInfoService',param:{"ID":id,"TYPE":2}};
        wx.request({
            url: surl.host + url,
            method: "GET",
            data: params,
            success: function (data) {
               console.log(data);
            }
        });
    },
    // 不用上传材料时提交
    initMaterial:function () {
        var that = this;
        var $scope = that.data;
        //材料信息
        var materialObj = {
            id: "0",
            materialid: "0",
            materialname: "0",
            materialcode: "0",
            submittype: "0",
            orinum: "0",
            copynum: "0",
            isneed: "0",
            status: "0",
            formid: "0",
            formver: "0",
            dataid: "0",
            certificateid: "0",
            certificatestartdate: "0",
            certificateenddate: "0",
            remark: "0",
            username: $scope.USERNAME || "",
            sh: "0",
            shyj: "0",
            files: []
        };
        if($scope.finalMaterial.length > 0){
            $scope.finalMaterial = [];
        }
        $scope.finalMaterial.push(materialObj);
        that.setData($scope);
        wx.setStorageSync("material", $scope.finalMaterial);
    },
    /*在材料信息中加入已经上传成功的材料文件*/
    attachFile:function attachFile(ID){
        var that = this;
        var $scope = that.data;
        var dataid =wx.getStorageSync("dataid");
        var material = wx.getStorageSync("materialsInfo");
//        var material = $scope.material;
        var item = material[ID] || {};
        if(!item.ID){
            item.ID=""
        }
        if(!item.CLMC){
            item.CLMC=""
        }
        if(!item.CLBH){
            item.CLBH=""
        }
        if(!item.DZHYQ){
            item.DZHYQ=""
        }
        if(!item.ORINUM){
            item.ORINUM=""
        }
        if(!item.CLMC){
            item.CLMC=""
        }
        if(!item.COPYNUM){
            item.COPYNUM=""
        }
        if(!item.SFBY){
            item.SFBY=""
        }
        if(!item.STATUS){
            item.STATUS=""
        }
        if(!form.formid){
            form.formid=""
        }
        if(!form.version){
            form.version=""
        }
        if(!$scope.USERNAME){
            $scope.USERNAME=""
        }

        if(dataid==null){
            dataid = "";
        }
        //材料信息
        var materialObj = {
            id: item.ID,
            materialid: item.ID,
            materialname: item.CLMC,
            materialcode: item.CLBH,
            submittype: item.DZHYQ,
            orinum: item.ORINUM,
            copynum: item.COPYNUM,
            isneed: item.SFBY,
            status: item.STATUS,
            formid: form.formid,
            formver: form.version,
            dataid: dataid,
            certificateid: "",
            certificatestartdate: "",
            certificateenddate: "",
            remark: "",
            username: $scope.USERNAME,
            sh: "",
            shyj: "",
            files: []
        }
        materialObj.files.push($scope.files[item["ID"]]);
        $scope.finalMaterial.push(materialObj);
        that.setData($scope);
        console.log($scope.finalMaterial);
        wx.setStorageSync("material", $scope.finalMaterial);
    },
    check:function check() {
        var that = this;
        var $scope = that.data;
        if($scope.material instanceof Array == false){
            return true;// 无材料就通过
        }
        var ret = true;
        $scope.material.forEach(function (b, a, c) {
            if (b.SFBY == 1 && $scope.materialNumber[b.ID].uploaded == 0) {
                ret = false;
            }
        });
        that.setData($scope);
        return ret;
    },
    next:function () {
        var that = this;
        if(!that.check()){
            that.showError("带*号的都为必须提交的材料", {title: '温馨提示'});
            return;
        }
        this.toStep5();
    },
    cacheData:function () {
        var that = this;
        var $scope = that.data;
        wx.setStorageSync("material_"+$scope.PERMID+P_GROUP_ID,materials); // 保存所有材料上传信息
//        wx.setStorageSync("materialList_"+$scope.PERMID+P_GROUP_ID,$scope.material); // 保存材料列表
        wx.setStorageSync("finalMaterial_"+$scope.PERMID+P_GROUP_ID,$scope.finalMaterial); // 保存最终材料
//        wx.setStorageSync("material",$scope.finalMaterial); // 保存最终材料
        app.globalData.stateStep4 = that.check() ? 1 : 4;
    },
    toBaseInfo:function(){
        this.cacheData();
        this.go('baseInfo');
    },
    toStep4 : function(){
        this.cacheData();
        this.go('step4');
    },
    toStep5: function(){
        this.cacheData();
        this.go('step5');
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
    init : function (getparams) {
        var that = this;
        var $scope = that.data;

        $scope.stateBaseInfo = app.globalData.stateBaseInfo;
        $scope.stateStep4 = app.globalData.stateStep4;
        $scope.stateStep5 = app.globalData.stateStep5;

        materialId = '';
        materials = {};// 所有材料的上传信息
        aCurrentImg = [];//当前图片预览列表

        $scope.userInfo = userInfo = wx.getStorageSync("userInfo");
        $scope.pageType = pageType = wx.getStorageSync("pageType");
        $scope.itemInfo = itemInfo = wx.getStorageSync("itemInfo");
        $scope.P_GROUP_ID = P_GROUP_ID = wx.getStorageSync('P_GROUP_ID');
        $scope.form = form = wx.getStorageSync("form");

        $scope.material = [];  // 所有材料列表
        $scope.materials = [];  // 所有材料列表图片
        $scope.materialNumber = {}; // 所有材料对应的图片数量
        itemInfo = itemInfo == null ? {} : itemInfo;
        $scope.PERMID = itemInfo.ID || '';

        $scope.list = [];  // 未上传查材料列表
        $scope.uploadedList = []; //已上传材料列表
        $scope.files = {};//图片临时存储
        $scope.finalMaterial = []; // 最终申报的材料数据
        $scope.TOKEN = userInfo.TOKEN || "";
        $scope.USER_ID = userInfo.USER_ID || "";
        $scope.USERNAME = userInfo.USERNAME || "";
        $scope.REALNAME = userInfo.REALNAME || "";
        $scope.MOBILE = userInfo.MOBILE || "";
        $scope.TYPE = userInfo.TYPE || "1";

        $scope.stateBaseInfo = app.globalData.stateBaseInfo || 0; // 0:未验证，1：验证通过，4：验证不通过
        $scope.stateStep4 = app.globalData.stateStep4 || 0;
        $scope.stateStep5 = app.globalData.stateStep5 || 0;
        $scope.SFBYNUM = 0;

        if(itemInfo == null) {
            that.showError("请返回重做!",{title: '温馨提示'});
        }
        if(form == "undefined"){
            console.log("form 为空");
        }
        /*init*/
        var SFBYNUM = wx.getStorageSync("SFBYNUM");
//        if(SFBYNUM==0){
//            that.initMaterial();
//        }

        var _material = wx.getStorageSync("material_"+$scope.PERMID+P_GROUP_ID);
        var materialList = wx.getStorageSync("materialList_"+$scope.PERMID+P_GROUP_ID);
        var finalMaterial =  wx.getStorageSync("finalMaterial_"+$scope.PERMID+P_GROUP_ID);

        if(!that.isEmpty(finalMaterial)){  // 还原之前最终要提交的材料
            $scope.finalMaterial = finalMaterial;
        }
        if(!that.isEmpty(_material)){ // 还原材料信息图片
            app.globalData.materials = $scope.materials = materials = _material;
            console.log($scope.materials)
        }
        if(!that.isEmpty(materialList)){ // 还原材料列表
            that.hideLoading();
            app.globalData.materialList = $scope.list = materialList;
            $scope.material = materialList;
            // 处理已上传材料数量，初始化
            that.setData($scope);
            that.updateMaterialNumber($scope.material,$scope.materials,$scope.materialNumber);
            return;
        }
        that.setData($scope);
        that.getMaterials();
    },
    bindUser: function () {
        wx.setStorageSync('loginFrom','../my-talk/my-talk');
        wx.redirectTo({
            url: '../login/login'
        });
    },
    onLoad : function (getparams) {
        this.showLoading();
        this.init(getparams);
    },
    onShow : function (params) {
        util.setPage(this);
        wx.setNavigationBarTitle({
            title: "上传资料"
        });
    },
    tempStore: function () {
        var page = this;
        page.cacheData();
        util.tempStore(page);
    },
    isEmpty:function isEmpty(v) {
        return typeof v == "undefined" || v == "undefined" || v == '' || v == null;
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
    }
});
