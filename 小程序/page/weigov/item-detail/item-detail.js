var app = getApp();
var surl = require('../../../util/surl.js');
var keys = require('../../../util/keys.js');
var util = require('../../../util/util.js');
Page({
    data: {
        dataTheme : [],
        data : [],
        source : 1,
        isTheme: true,
        partClass:'',
        themeClass:'hover',
        navWrap:true,
        dataDepartmented:false,
        isShowError:false,
        isFocus:false,
        isInput:false
    },
    init : function (getparams) {
        var PERMID = getparams.ID;  // 事项ID
        var that = this;
        var url = "weigov/businessController.do?getPermissionByPermid";
        var params = {"PERMID":PERMID};

        console.log(params);

        that.showLoading();
        that.isCollocet();
        wx.request({
            url : surl.host+url,
            method:"GET",
            data: params,
            success : function (data) {
                that.hideLoading();
                try {
                    console.log(data);
                    data = JSON.parse(data.data.obj).ReturnValue;

                    for(var key in data){
                        var temp=data[key];
                        if(typeof(temp) != "object"&&key!="FORMS"){
//                            data[key]=temp.replace(/\n/g,'<p></p>');
                            data[key]=temp;
                        }else{
                            data[key]=temp;
                        }
                    }

                    console.log(data.FORMS);

                    var regFiles = new RegExp('<file>.*?<\/file>','g');
                    var regId = new RegExp('<id>.*?<\/id>','g');
                    var regType = new RegExp('<type>.*?<\/type>','g');
                    var regName = new RegExp('<name>.*?<\/name>','g');

                    var files = data.FORMS.match(regFiles);
                    var i = 0,l = 0;
                    data.table=[];
                    if(files instanceof Array == true) {
                        l = files.length;
                        for (; i < l; i++) {
                            var d = {};
                            var f = files[i];
                            var id = f.match(regId)[0].replace("<id>","").replace("</id>","");
                            var type = f.match(regType)[0].replace("<type>","").replace("</type>","");
                            var name = f.match(regName)[0].replace("<name>","").replace("</name>","");
                            d.id = id;
                            d.type = type;
                            d.name = name;
                            if(name.indexOf('.') !=-1) {
                                data.table.push(d);
                            }
                        }
                    }

                    console.log("=======详情========");
                    console.log(data);
                    that.setData({
                        data:data
                    });
                } catch (e) {
                    console.log("详情异常原因：",e);
                    that.showError("数据异常");
                }
            },
            fail : function (e) {
                console.log(e);
                that.showError();
            }
        });
        function init(){
            var itemTo = wx.getStorageSync('itemTo');
            wx.setStorageSync('itemTo','');
            if(	itemTo == 'apply'){
                that.next(1);
            }else if(itemTo == 'order'){
                that.next(2);
            }
        }
        init();
    },
    next: function (e) {
        var that = this;
        var type = typeof e == 'number' ? e : parseInt(e.currentTarget.dataset.type);
        switch(type){
            case 1:
                wx.setStorageSync("pageType","itemDetail");
                that.selectMediaGroup();
                break;
            case 2:
                wx.navigateTo({
                    url:"../step-order/step-order"
                });
                break;
            case 3:
                wx.navigateTo({
                    url:"../step-talk/step-talk"
                });
                break;
            case 4:
                that.collect();
                break;
        }
    },
    collect:function collect(){
        var that = this;
        var $scope = that.data;
        var url="weigov/collectController/save.do";
        var data = {
            userid:$scope.USER_ID,
            itemid:$scope.itemInfo.ID,
            openid:"",
            content:$scope.itemcontent
        };
        that.addCollect = function() {
            that.service(url, data, function (re) {
                if (re.code == 200) {
                    if (re.returnValue == "已收藏") {
                        that.showToast('已收藏');
                        $scope.isCollect = true;
                    } else {
                        that.showToast('收藏成功');
                        $scope.isCollect = true;
                    }
                    that.setData($scope);
                } else {
                    that.showError('网络故障', {title: '温馨提示'});
                }
            });
        };
        // 取消收藏
        that.removeCollect = (data)=>{
            let url = "weigov/collectController/delCollect.do";
            data.uid = data.userid;
            that.service(url,data,(res)=>{
                if(res.code == 200){
                    $scope.isCollect = false;
                    that.showToast('取消收藏');
                    that.setData($scope);
                }
            });
        };
        $scope.isCollect ? that.removeCollect(data) : that.addCollect(data);
    },
    isCollocet:function iscollect() {
        var that = this;
        var $scope = that.data;
        var url="weigov/collectController/isCollectByUserId.do";
        var data = {
            itemid:$scope.itemInfo.ID,
            userid:$scope.USER_ID
        };
        that.service(url,data,function(re){
            if(re.code==200){
                if(re.returnValue == "已收藏"){
                    $scope.isCollect = true;
                }else{
                    $scope.isCollect = false;
                }
            }else{
                $scope.isCollect = false;
            }
            that.setData($scope);
        });
    },
    selectMediaGroup:function selectMediaGroup(){
        var that = this;
        var $scope = that.data;
        that.showLoading();
        wx.request({
            url: surl.host + 'weigov/serviceController/get.do',
            method: "GET",
            data: {method:'getClxxGroupByPermid',server:'RestPermissionitemService',param:{"PERMID":$scope.itemInfo.ID}},
            success: function (data) {
                that.hideLoading();
                data = data.data;
                if(!(typeof data == "object" && data.code == 200)){
                    return;
                }
                // console.log(data);
                var list = data.ReturnValue;
                var actions = [],i = 0,len = list.length,itemList = [];

                if(len <= 1){
                    wx.navigateTo({
                        url: '../baseInfo/baseInfo'
                    });
                    return;
                }

                for(;i < len ; i++){
                    var _item = list[i];
                    itemList.push(_item.P_GROUP_NAME);
                    actions.push({
                        label:_item.P_GROUP_NAME,
                        onClick:function(res){
                            return function(){
                                console.log(res);
                                wx.navigateTo({
                                    url: '../baseInfo/baseInfo?P_GROUP_ID='+res.P_GROUP_ID
                                });
                            }
                        }(_item)
                    })
                }
                wx.showActionSheet({
                    itemList:itemList,
                    success: function(res) {
                        console.log(res.tapIndex);
                        actions[res.tapIndex].onClick();
                    },
                    fail: function(res) {
                        console.log(res.errMsg)
                    }
                });
            }
        });
    },
    service:function service(url,data,callback){
        wx.request({
            url:surl.host + url,
            data:data,
            success: function (data) {
                data = data.data;
                callback(data);
            }
        });
    },
    login:function (getparams,cb) {
        var that = this;
        var url = "wx/wxUserController.do?getUserInfoByUnionid";
        that.showLoading();
        util.getUnionId(3,function(){
            var unionid = wx.getStorageSync("unionId");
            wx.request({
                url:surl.host + url,
                method:"POST",
                header:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
                data:{unionid:unionid},
                success: function (data) {
                    that.hideLoading();
                    console.log("token",data);
                    if(!data.data.success || data.data.msg == "登录失败"){
                        that.bindUser(getparams.ID);
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
                    console.log("userInfo",data);
                    wx.setStorageSync('userInfo',data);
                    cb && cb(getparams);
                }
            });
        });
    },
    bindUser: function (id) {
        wx.setStorageSync('loginFrom','../item-detail/item-detail?ID='+id);
        wx.redirectTo({
            url: '../login/login'
        });
    },
    onLoad : function (getparams) {
        var that = this;
        var $scope = that.data;
        var itemList = wx.getStorageSync(keys.itemList);
        var PERMID = getparams.ID;

        itemList.map(function (v,i,me) {
            if(v.ID == PERMID){
                $scope.itemInfo = v;
                $scope.itemcontent = JSON.stringify(v);
                wx.setStorageSync('itemInfo',$scope.itemInfo);
            }
        });
        that.setData($scope);
        that.login(getparams,that.init);
    },
    onShow : function (params) {
        console.log("========onShow==========");
        wx.setNavigationBarTitle({
            title: "事项详情"
        });
    },
    showToast: function (msg) {
        wx.showToast({
            title: msg || '成功',
            icon: 'success',
            duration: 2000
        })
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
    bindKeyInput: function(e) {
        this.setData({
            tag: e.detail.value
        });
        if(this.data.tag.length > 0){
            this.setData({
                isInput:true
            });
        }
    },
    downFile: function (e) {
        var that = this;
        var id = e.currentTarget.dataset.id;
        var filename = e.currentTarget.dataset.name;
        that.showLoading();
        wx.request({
            url: surl.host+'weigov/serviceController/downFileStatus.do',
            data:{id:id,filename:filename},
            success: function(data) {
                console.log(data);
                wx.downloadFile({
                    url: surl.host+'upload/files/guide/'+encodeURIComponent(filename),
                    success: function(res) {
                        console.log( surl.host+'upload/files/guide/'+filename);
                        console.log(res);
                        console.log("downFile success")
                        var filePath = res.tempFilePath;

                        if(/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(filename)){//判断文件是否为图片
                            wx.previewImage({
                                current: filePath, // 当前显示图片的http链接
                                urls: [filePath] // 需要预览的图片http链接列表
                            });
                            return;
                        }
                        wx.openDocument({
                            filePath: filePath,
                            success: function (res) {
                                console.log('打开文档成功')
                            },
                            fail: function (res) {
                                console.log('打开文档fail')
                                console.log(res);
                            }
                        })
                    },
                    complete: function () {
                        that.hideLoading();
                    }
                });
            }
        });

    },
    saveFile: function (src) {
        wx.saveFile({
            tempFilePath: src,
            success: function(res) {
                console.log("saveFile success")
            }
        })
    },
    showLoading: function () {
        this.setData({loading:true})
    },
    hideLoading: function () {
        this.setData({loading:false})
    },
    changeStatus: function (n) {
        console.log("===changeStatus====");
        var _name = "item"+n;
        var _val = !this.data[_name];
        this.setData({
            item:_val
        });
        console.log(this.data)
    },
    changeStatus1:function(){
        this.changeStatus(1);
        var _name = "item1";
        var _val = !this.data[_name];
        this.setData({
            item1:_val
        });
    },
    changeStatus2:function(){
        this.changeStatus(2);
        var _name = "item2";
        var _val = !this.data[_name];
        this.setData({
            item2:_val
        });
    },
    changeStatus3:function(){
        this.changeStatus(3);
        var _name = "item3";
        var _val = !this.data[_name];
        this.setData({
            item3:_val
        });
    },
    changeStatus4:function(){
        this.changeStatus(4);
        var _name = "item4";
        var _val = !this.data[_name];
        this.setData({
            item4:_val
        });
    },
    changeStatus5:function(){
        this.changeStatus(5);
        var _name = "item5";
        var _val = !this.data[_name];
        this.setData({
            item5:_val
        });
    },
    changeStatus6:function(){
        this.changeStatus(6);
        var _name = "item6";
        var _val = !this.data[_name];
        this.setData({
            item6:_val
        });
    },
    changeStatus7:function(){
        this.changeStatus(7);
        var _name = "item7";
        var _val = !this.data[_name];
        this.setData({
            item7:_val
        });
    },
    changeStatus8:function(){
        this.changeStatus(8);
        var _name = "item8";
        var _val = !this.data[_name];
        this.setData({
            item8:_val
        });
    },
});
