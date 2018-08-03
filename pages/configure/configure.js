//设置页面
var deviceItems=[];

var app = getApp(); 
var temp = []
var string_temp = ""

var serviceId = "0000ffe0-0000-1000-8000-00805f9b34fb"
var deviceIdKey = "sqqkSbLgXcY+naQ5+izLjQ=="
var Dec = require('../../public/public.js') //引用封装好的加密解密js
Page({
        data:{
                actionSheetHidden: true,
                version: "1.02",
                deviceName: null,
                deviceId: null,

                //测试蓝牙
                searchingstatus: false,
                id_text: string_temp,
                list: [],
                deviceStatus:false,
                receive_data: 'none'
        },

        onLoad:function(){
                console.log("页面初始化")
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
        },

        //检查蓝牙的初始化状态
        open_BLE: function () {
                var that = this;
                //开启蓝牙模块并初始化
                wx.openBluetoothAdapter({
                        success: function (res) {
                                console.log('蓝牙初始化适配器，获取成功'+res);
                        },
                        fail: function (res) {
                                wx.showModal({
                                        title: '提示',
                                        content: '请检查手机蓝牙是否打开',
                                })
                        }
                })
                //检查蓝牙模块是否初始化成功
                wx.getBluetoothAdapterState({
                        success: function (res) {
                                var available = res.available
                                if (!available) {
                                        wx.showToast({
                                                title: '蓝牙初始化失败',
                                                icon: 'loading',
                                                duration: 2000
                                        });
                                }
                                else {
                                        wx.showToast({
                                                title: '蓝牙初始化成功',
                                                icon: 'success',
                                                duration: 1000
                                        });
                                        checkBluetooth(that);
                                        getBluetoothList(that);

                                }
                        }
                });
        },

        //数据缓存到本地
        saverBLE: function(e){
                var deviceValue = e.currentTarget.id;
                var array = new Array();
                var array = deviceValue.split("`");
                this.setData({
                        deviceName: array[0],
                        deviceId: array[1]

                });
                wx.setStorage({
                        key: deviceIdKey,
                        data: deviceValue,
                })
        },

        detailedInformation: function(){
                wx.navigateTo({
                        url: '../particular/particular'
                })
        }
});

//开始搜索附近蓝牙设备
function checkBluetooth(that) {
        wx.startBluetoothDevicesDiscovery({
                success: function (res) {
                        wx.showToast({
                                title: '开始搜索BLE',
                                icon: 'loading',
                                duration: 1000
                        })
                        // that.setData({
                        //         searchingstatus: !that.data.searchingstatus
                        // })
                }
        })
        setTimeout(function () {
                stopBluetooth(that);
        }, 6000)
};

//停止搜索附近蓝牙设备
function stopBluetooth(that) {
        wx.stopBluetoothDevicesDiscovery({
                success: function (res) {
                        wx.showToast({
                                title: '停止搜索BLE',
                                icon: 'success',
                                duration: 1000
                        })
                        that.setData({
                                searchingstatus: !that.data.searchingstatus
                        })
                }
        })
};

//获取发现的蓝牙设备
function getBluetoothList(that) {
        setTimeout(function () {
                wx.getBluetoothDevices({
                        success: function (res) {
                                for (var i = 0; i < 100; i++) {
                                        if (res.devices[i]) {
                                                string_temp = string_temp + '\n' + res.devices[i].deviceId
                                        }
                                        console.log("devices=" + string_temp)
                                }
                                that.setData({
                                        id_text: string_temp,
                                        list: res.devices
                                })
                        }
                })
        }, 1000)
}
