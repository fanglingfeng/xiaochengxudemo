var app = getApp();
var surl = require('../../../util/surl.js');
var keys = require('../../../util/keys.js');
Page({
    data: {
        isLoad:false,
        isShowError:false,
        loading:false,
        polyline: [{
            points: [{
                longitude: 113.3245211,
                latitude: 23.10229
            }, {
                longitude: 113.324520,
                latitude: 23.21229
            }],
            color:"#FF0000DD",
            width: 2,
            dottedLine: true
        }],
        controls: [{
            id: 1,
            iconPath: '/resources/location.png',
            position: {
                left: 0,
                top: 300 - 50,
                width: 50,
                height: 50
            },
            clickable: true
        }]
    },
    regionchange:function(e) {
         console.log(e.type)
    },
    markertap:function(e) {
        console.log(e.markerId)
    },
    controltap:function(e) {
        console.log(e.controlId)
    },
    init : function (params) {
        var that = this;
        var data = wx.getStorageSync(keys.curNetwork);
        console.log(data);
        var lat = data.LATITUDE;
        var lng = data.LONGITUDE;
        var pos = this.mapBar2WGS84(lat,lng);

        this.setData({
            pos : pos
        })
    },
    mapBar2WGS84:function mapBar2WGS84(x,y){
        x = parseFloat(x)*100000%36000000;
        y = parseFloat(y)*100000%36000000;

        var x1 = parseInt(-(((Math.cos(y/100000))*(x/18000))+((Math.sin(x/100000))*(y/9000)))+x);
        var y1 = parseInt(-(((Math.sin(y/100000))*(x/18000))+((Math.cos(x/100000))*(y/9000)))+y);

        var x2 = parseInt(-(((Math.cos(y1/100000))*(x1/18000))+((Math.sin(x1/100000))*(y1/9000)))+x+((x>0)?1:-1));
        var y2 = parseInt(-(((Math.sin(y1/100000))*(x1/18000))+((Math.cos(x1/100000))*(y1/9000)))+y+((y>0)?1:-1));

        return [x2/100000.0,y2/100000.0];
    },
    render :  function() {
    },
    onLoad : function (params) {
        this.init(params);
    },
    onShow : function (params) {
        wx.setNavigationBarTitle({
            title: "服务网点"
        });
    },
    toggleBusiness : function () {
        var _source = this.data.source == 1 ? 2 : 1;
        this.setData({source:_source});
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
