// pages/gov/person/person.js
var surl = require('../../../utils/surl.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataTheme: [],
    isTheme: true
  },
  init: function (e) {
    var that = this;
    wx.request({
      url: surl.host + 'weigov/businessController.do?getPictureByID&ID=440306&PAGENO=1&PAGESIZE=1000&SFYDSB=1',
      success: function (message) {
        console.log(message);
        var data = message.data.obj;
        try {
          data = JSON.parse(data).ReturnValue;
          for (var i = 0; i < data.length; i++) {
            var index = data[i].PICTUREPATH.lastIndexOf("\/");
            data[i].PICTUREPATH = "http://203.91.37.98:8083" + data[i].PICTUREPATH.substring(0, index) + "/new/" + data[i].PICTUREPATH.substring(index + 1, data[i].PICTUREPATH.length);
          }
          wx.setStorageSync('dataTheme', data);
          console.log(data);
          that.setData({
            dataTheme: data
          })
        } catch (e) {
          console.log(e);
        }
      }
    })
  },
  showTheme: function() {
    this.setData({
      isTheme: true
    });

  },
  showDepartment: function() {
    this.setData({
      isTheme: false
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})