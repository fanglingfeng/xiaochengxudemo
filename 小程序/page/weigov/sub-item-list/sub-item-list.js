var surl = require('../../../util/surl.js');
var keys = require('../../../util/keys.js');
var util = require('../../../util/util.js');
Page({
    data: {
        dataTheme : [],
        list : [],
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
        var that = this;
        var url = "";
        var DEPTID = getparams.DEPTID;
        var itemType = getparams.itemType;
        var params = {};
        var SORTCODE = getparams.PICTURECODE;

        that.showLoading();
        if(itemType=="business"){
            //获取SORTCODE
            url="weigov/businessController.do?getPermlistBySortcode";
            params={"SORTCODE":SORTCODE,"SFYDSB":"1","PAGENO":"1","PAGESIZE":"1000"};
        }else{
            itemType = "department";
            //获取DEPTID
            url="weigov/departmentController.do?getPermlistByDeptid";
            params={"DEPTID":DEPTID,"SFYDSB":"1","PAGENO":"1","PAGESIZE":"1000"};
        }

        wx.request({
            url : surl.host+url,
            method:"GET",
            data: params,
            success : function (data) {
                that.hideLoading();
                try {
                    console.log(data);
                    var list = JSON.parse(data.data.obj).ReturnValue;
                    console.log(list);
                    that.setData({
                        list:list
                    });
                    wx.setStorage({
                        key:keys.itemList,
                        data:list
                    });
                } catch (e) {
                    that.showError();
                }
            },
            fail : function (e) {
                console.log(e);
                that.showError();
            }
        });
    },
    search : function () {
        var tag = this.data.tag;
        if(typeof tag=="undefined" || tag.trim()==""){
            wx.showModal({
                title: '提示',
                content: '请输入事项名称'
            });
            return;
        }
        var url="weigov/serviceController/get.do";
        var params ={
            "PERMNAME": tag
        };
        params = JSON.stringify(params);
        var data ={
            server:"RestPermissionitemService",
            method:"getPermByKey",
            param:params
        };

        var that = this;
        this.showLoading();
        wx.request({
            url : surl.host+url,
            method:"GET",
            data: data,
            success : function (data) {
                that.setData({isFocus:false});
                that.hideLoading();
                var hasAllData = false;
                data = data.data;
                if(data.code==200){
                    try{
                        if(!(typeof data.ReturnValue == "object")){
                            hasAllData = true;
                            return
                        }
                        data=data.ReturnValue;
                        if(data.length==0){
                            hasAllData = true;
                        }
                        data.sort(function (a, b) {
                            return parseInt(a.CODE3) - parseInt(b.CODE3)
                        });
                        that.setData({list:data});
                        wx.setStorage({
                            key:keys.itemList,
                            data:data
                        })
                    }catch(e){
                        console.log(e);
                        that.showError();
                        hasAllData = true;
                    }
                }else{
                    that.showError();
                    hasAllData = true;
                }
                that.setData({
                    hasAllData:hasAllData,
                    list : data
                });
            },
            fail : function (e) {
                console.log(e);
                that.showError();
            }
        });
    },
    voiceSearch : function () {

    },
    onLoad : function (getparams) {
        util.wxTools.clearStorage();
        var that = this;
        var $scope = this;
        $scope.showActions = {};
        //显示下方图标
        $scope.show = function(item){
            var id = typeof item == 'object' ? item.currentTarget.dataset.id : item;
            var $scope = that.data;
            $scope.showActions[id] = $scope.showActions[id] == 1 ? 0 : 1;
            that.setData($scope);
        };
        $scope.kefu = function(item){
            that.showLoading('功能开发中...');
            setTimeout(that.hideLoading, 2000);
        };
        $scope.goApply = function(e){
            var id = e.currentTarget.dataset.id;
            wx.setStorageSync('itemTo','apply');
            wx.navigateTo({
                url: '../item-detail/item-detail?ID='+id
            });
        };
        $scope.goOrder = function(e){
            var id = e.currentTarget.dataset.id;
            wx.setStorageSync('itemTo','order');
            wx.navigateTo({
                url: '../item-detail/item-detail?ID='+id
            });
        };

        that.setData($scope);

        var pageType = getparams.pageType;
        if(pageType == "search"){  // 页面进入方式
            this.setData({
                isFocus:true
            })
        }else{
            this.init(getparams);
        }
    },
    onShow : function (params) {
        wx.setStorageSync('pageType','subList'); // 防止办事指南详情页面设置不及时
        wx.setStorageSync('BSNUM',''); // 清除办事编号，防止暂存和申报时提交出错
        console.log("params========onShow==========");
        wx.setNavigationBarTitle({
            title: "选择办理事项"
        });
    },
    calling:function(e){
        wx.makePhoneCall({
            phoneNumber: '85908590', //宝安区政务服务局
            success:function(){
                console.log("拨打电话成功！")
            },
            fail:function(){
                console.log("拨打电话失败！")
            }
        })
    },
    toggleBusiness : function () {
        var _source = this.data.source == 1 ? 2 : 1;
        this.setData({source:_source});
//        wx.navigateTo({
//            url: 'item-list?source=2'
//        })
    },
    toggleTheme: function () {
        var themeClass = this.data.themeClass == "" ? "hover" : "";
        var partClass = this.data.partClass == "" ? "hover" : "";
        this.data.themeClass = themeClass;
        this.data.partClass = partClass;
        this.setData({});
    },
    showTheme: function () {
        this.setData({isTheme:true});
    },
    showError: function () {
        this.hideLoading();
        this.setData({isShowError:true})
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
    clear: function () {
        this.setData({
            tag:"",
            isInput:false
        })
    },
    showLoading: function (msg) {
        this.setData({loading:true,loadingText:msg || ' 加载中...'})
    },
    hideLoading: function () {
        this.setData({loading:false})
    }
});
