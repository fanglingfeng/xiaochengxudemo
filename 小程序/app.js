var surl = require('util/surl.js');
var keys = require('util/keys.js');
App({
  onLaunch: function () {
      console.log('App Launch');
      wx.getStorageSync("unionId") ||
      wx.login({
          success: function(res) {
              console.log(res);
              if (res.code) {
                  var code = res.code;
                  wx.getUserInfo({
                      success: function(res) {
                          var userInfo = res.userInfo;
                          var nickName = userInfo.nickName;
                          var avatarUrl = userInfo.avatarUrl;
                          var gender = userInfo.gender; //性别 0：未知、1：男、2：女;
                          var province = userInfo.province;
                          var city = userInfo.city;
                          var country = userInfo.country;
                          console.log(res);

                          //发起网络请求
                          wx.request({
                              url:surl.host + 'weigov/xcxController/getUnionid.do',
//                              url: 'http://localhost:8080/weigov/xcxController/getUnionid.do',
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

  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  globalData: {
    hasLogin: false
  }
});
