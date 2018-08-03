var deviceIdKey = "sqqkSbLgXcY+naQ5+izLjQ=="
var Dec = require('../../public/public.js')
Page({
        data: {
                weight: '',
                price: '',
                total: '',
                settingImg: "../../image/setting.png",

                deviceName:null,
                deviceId: null,
                advertisData:null,

                available:false,
        },
        onLoad: function () {
                console.log("页面初始化");  
                //获取缓存中的设备
                try {
                        var value = wx.getStorageSync(deviceIdKey)
                        if (value) {
                                var array = new Array();
                                var array = value.split("`");
                                this.setData({
                                        deviceName: array[0],
                                        deviceId: array[1]

                                });
                        }
                } catch (e) {
                        wx.showModal({
                                title: '请选择连接的设备',
                                icon: 'loading',
                                duration: 2000
                        })
                }
                wx.onBLEConnectionStateChange(function (res) {
                        // 该方法回调中可以用于处理连接意外断开等异常情况
                        console.log(`device ${res.deviceId} , connected: ${res.connected}`)
                })
                
        },

        // 监听输入
        watchValues: function (event) {
                this.setData({
                        price: event.detail.value,
                });
        },

       
        priceInput: function (e) {
                this.setData({
                        price: e.detail.value
                })
        },

        valuing: function (e) {
                var weightValue = this.data.weight;
                var priceValue = this.data.price;
                var totalValue = 0;
                if (weightValue == 0) {
                        wx.showModal({
                                title: '提示',
                                content: '请点击称重',
                        })
                } else if (priceValue == 0) {
                        wx.showModal({
                                title: '提示',
                                content: '请输入每公斤产品的价格',
                        })
                } else if (weightValue > 0 && priceValue > 0) {
                        totalValue = weightValue * priceValue;
                        this.setData({
                                total: totalValue.toFixed(2),
                        });
                }
        },

        weighing: function () {
                var that = this;
                //获取蓝牙上传的数据 weightValue
                if (!that.data.available) {
                        this.checkDevice();
                } else {
                        getBLEConnect(that);
                        var data = this.data.advertisData;
                        if (data != null && data!=""){
                                //TODO 获取密文进行解密
                                var weightValue = Dec.Decrypt("5BC0CEB55652BB11486A8FB897D41C03");;
                                this.setData({
                                        weight: weightValue.toFixed(2),
                                        total: ''
                                });
                        }

                }
        },

        //检测设备
        checkDevice: function () {
                //开启蓝牙模块并初始化
                wx.openBluetoothAdapter({
                        success: function (res) {
                                console.log('蓝牙初始化适配器，获取成功' + res);
                                wx.getBluetoothAdapterState({
                                        success: function (res) {
                                                this.setData({
                                                        available: res.available
                                                });  
                                        }
                                });
                        },
                        fail: function (res) {
                                wx.showModal({
                                        title: '提示',
                                        content: '请检查手机蓝牙是否打开',
                                })
                        }
                })
        },

        //页面跳转
        systemSetting: function () {
                wx.navigateTo({
                        url: '../configure/configure'
                })
        }
});

// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接 
function getBLEConnect(that){
        console.log("连接设备:  " + that.data.deviceId);
        if (that.data.deviceId!=null){
                wx.createBLEConnection({
                        deviceId: that.data.deviceId,
                        success: function (res) {
                                console.log("advertisData:  "+res.advertisData);
                                that.setData({
                                        advertisData: ab2hex(res.advertisData)
                                });
                        }
                })
        }
}

// ArrayBuffer转16进制字符串示例
function ab2hex(buffer) {
        var hexArr = Array.prototype.map.call(
                new Uint8Array(buffer),
                function (bit) {
                        return ('00' + bit.toString(16)).slice(-2)
                }
        )
        return hexArr.join('');
}
