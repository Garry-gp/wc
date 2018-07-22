//设置页面
var items =[
            '1、点击称重获取当前商品的重量',
            '2、输入每公斤商品的价格',
            '3、点击计价，通过程序算出总价格',
            '4、通过设置，设置添加设备和删除设备',
            '5、通过操作说明，查阅相关的操作说明'
            ];
var deviceItems=[];

var app = getApp(); 
var temp = []
var string_temp = ""

var serviceId = "0000ffe0-0000-1000-8000-00805f9b34fb"
var deviceIdKey = "deviceIdKey"
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
                                this.setData({
                                        characteristicId: value.deviceId,
                                        temp: value

                                })  
                        }
                } catch (e) {
                        wx.showModal({
                                title: '请选择连接的设备',
                                icon: 'loading',
                                duration: 2000
                        })
                }  
        },

        //缓存到本地
        saverBLEMessage: function (e) {
                debugger
                console.log("当前 e.currentTarget.id=" + e.currentTarget.id);
                console.log("当前 e.currentTarget.name=" + $("deviceName").val());
                console.log("当前 deviceIdKey=" + deviceIdKey);
                wx.setStorage({
                        key: deviceIdKey,
                        data: "{deviceId:" + e.currentTarget.id + ",name:" + e.currentTarget.name,
                })
        },

        //检查蓝牙的初始化状态
        open_BLE: function () {
                var that = this;
                //开启蓝牙模块并初始化
                wx.openBluetoothAdapter({
                        success: function (res) {
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
                // getBluetoothList(that);
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
// 16进制数转ASCLL码
function hexCharCodeToStr(hexCharCodeStr) {
        var trimedStr = hexCharCodeStr.trim();
        var rawStr = trimedStr.substr(0, 2).toLowerCase() === "0x" ? trimedStr.substr(2) : trimedStr;
        var len = rawStr.length;
        var curCharCode;
        var resultStr = [];
        for (var i = 0; i < len; i = i + 2) {
                curCharCode = parseInt(rawStr.substr(i, 2), 16);
                resultStr.push(String.fromCharCode(curCharCode));
        }
        return resultStr.join("");
}