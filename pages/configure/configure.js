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
                                console.log("kay=" + deviceIdKey + ",data=" + value + ",array=" + this.data.deviceName + "/" + this.data.deviceId);
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