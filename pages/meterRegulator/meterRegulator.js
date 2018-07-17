Page({
  data: {
    weight:'',
    price:'',
    total:'',
    settingImg:"../../image/setting.png"
  },
  // 监听输入
  watchValues: function (event) {
    this.setData({
      price:event.detail.value,
    });
  },
  weighing: function () {
    //获取蓝牙上传的数据 weightValue
    var flag = this.checkDevice();
    if (10001==flag){
      console.log("请开启手机蓝牙功能")
    }else{
        var weightValue = 5.211;
        this.setData({
        weight: weightValue.toFixed(2),
        total: ''
        });
    }
  },
  priceInput: function (e) {
    this.setData({
      price: e.detail.value
    })
  },

  valuing:function(e){
    var weightValue = this.data.weight;
    var priceValue = this.data.price;
    var totalValue = 0;
    if (weightValue==0){
      wx.showModal({
         title: '提示',
         content:'请点击称重',
       })
    }else if (priceValue == 0) {
      wx.showModal({
        title: '提示',
        content: '请输入每公斤产品的价格',
      })
    }else if(weightValue >0 && priceValue>0){
      totalValue = weightValue * priceValue;
      this.setData({
        total: totalValue.toFixed(2),
      });
    }
  },
  //检测设备
  checkDevice: function(){
    //初始化蓝牙模块
    wx.openBluetoothAdapter({
      success: function (res) {
        console.log('蓝牙初始化适配器');
        console.log(res)
        wx.showToast({
          title: '获取成功',
          icon: 'success'
        })
        this.getBluetoothAdapterState();
      },
      fail:function(err){
        console.log(err);
        wx.showToast({
          title: '蓝牙初始化失败',
          icon: 'waiting'
        })
        setTimeout(function () {
            wx.hideToast()
        }, 2000)
      }
    })
  },

  //获取本机蓝牙适配器的状态
  getBluetoothAdapterState: function(){
    var that = this;
    wx.getBluetoothAdapterState({
      success: function (res) {
        console.log(res)
        var available = res.available;
        var discovering = res.discovering;
        if (!available){ //适配器是否可用
          wx.showToast({
            title: '设备无法开启蓝牙连接',
            icon: 'waiting',
          })
          setTimeout(function () {
            wx.hideToast()
          }, 2000)
        }else{
          if (!discovering) { //是否正在搜索设备
            that.startBluetoothDevicesDiscovery();
            that.getConnectedBluetoothDevices();
          }
        }
      }
    })
  },
  startBluetoothDevicesDiscovery: function () {
    var that = this;
    wx.showLoading({
      title: '蓝牙搜索'
    });
    wx.startBluetoothDevicesDiscovery({
      services: ['FEE7'],
      success: function (res) {
        if (!res.isDiscovering) {
          that.getBluetoothAdapterState();
        } else {
          that.onBluetoothDeviceFound();
        }
      },
      fail: function (err) {
        console.log(err);
      }
    })
  },
  getConnectedBluetoothDevices: function () {
    var that = this;
    wx.getConnectedBluetoothDevices({
      services: [that.servicesId],
      success: function(res){
        console.log("获取处于连接状态的设备", res);
      }
    });
  },
  //事件处理函数
  systemSetting: function () {
    wx.navigateTo({
      url: '../configure/configure'
    })
  }
})
