//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    userInfo: {   
    },
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    logo:"../../image/indexLogo.png",
    mode: 'center',
    screenWidth: 0,
    screenHeight: 0,
    imgwidth: 0,
    imgheight: 0
  },
  onLoad: function () {
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
        });
      }
    });
    setTimeout(function () {
      wx.redirectTo({
        url: '../meterRegulator/meterRegulator'
      })
    }, 1000);
  },
  imageLoad: function (e) {
    var _this = this;
    var $width = e.detail.width,    //获取图片真实宽度  
      $height = e.detail.height,
      ratio = $width / $height;   //图片的真实宽高比例  
    var viewWidth = 500,           //设置图片显示宽度，  
      viewHeight = 500 / ratio + 100;    //计算的高度值     
    this.setData({
      imgwidth: viewWidth,
      imgheight: viewHeight
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../configure/configure'
    })
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //点击跳转
  // toWeigh: function () {
  //     wx.navigateTo({
  //       url:'../meterRegulator/meterRegulator',        
  //     })
  // }
  
})
