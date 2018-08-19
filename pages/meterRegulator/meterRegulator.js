var deviceIdKey = "sqqkSbLgXcY+naQ5+izLjQ==";
var Dec = require('../../public/public.js');
var Util = require('../../utils/util.js');
var timer;
Page({
        data: {
                weight: '',
                price: '',
                total: '',
                power:'-- %',
                settingImg: "../../image/setting.png",

                deviceName:null,
                deviceId: null,
                currentAdvertisData:null,

                available:false,
                isInitSuccess:true,
                isExistDevice:false,
                hidden:true,
        },
        onLoad: function () {
                var that=this;
                console.log("页面初始化");
                //初始化
                this.initBluetoothAdapter();
                getBluethootDevicePower(that);    
        },

        getStorageSyncDevice: function(){
                var that = this;
                try {
                        //从本地缓存中同步获取指定 key 对应的内容。
                        var value = wx.getStorageSync(deviceIdKey)
                        console.log("获取本地缓存数据" + value);
                        if (value) {
                                var array = new Array();
                                var array = value.split("`");
                                that.setData({
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
                };
        },

        /**
         * 初始化蓝牙模块
         */
        initBluetoothAdapter: function () {
                var that = this;
                //获取手机蓝牙并初始化
                this.getStorageSyncDevice();
                wx.openBluetoothAdapter({
                        success: function (res) {
                                console.log('蓝牙初始化适配器，获取成功' + res);
                                //获取本机蓝牙适配器状态
                                wx.getBluetoothAdapterState({
                                        success: function (res) {
                                                console.log("设置available:" + res.available);
                                                that.setData({
                                                        available: res.available
                                                });
                                        }
                                });
                        },
                        fail: function (res) {
                                that.setData({
                                        isInitSuccess:false
                                });
                                wx.showModal({
                                        title: '提示',
                                        content: '请检查手机蓝牙是否打开',
                                })
                        }
                });
                searchBluetoothDevicesPower(that);
        },

        /**
         * 监听输入框的单价格
         */
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

        /**
         * 计价方法
         * 计算总价
         */
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

        /**
         * 点击称重按钮的，获取蓝牙的广播数据
         * 调用解密的方法，获取重量
         * 
         **/
        weighing: function () {
                var that = this;
                this.initBluetoothAdapter();
                console.log(that.data.hidden);
                console.log(that.data.isInitSuccess)
                if (that.data.isInitSuccess){
                        that.setData({
                                total: '',
                                hidden: false
                        });
                        //检查蓝牙模块是否初始化成功
                        wx.getBluetoothAdapterState({
                                success: function (res) {
                                        var available = res.available
                                        if (available) {
                                                searchBluetoothDevices(that);
                                        }
                                        
                                }
                        });
                }
        },
        /**
         * 设置图标的页面跳转
         */
        systemSetting: function () {
                //定时器非空，关闭定时器
                // if (timer != null) {
                //         clearInterval(timer);
                // }
                wx.navigateTo({
                        url: '../configure/configure'
                })
        }
});

/**
 * 开始搜索附近蓝牙设备
 */
function searchBluetoothDevices(that) {
        wx.startBluetoothDevicesDiscovery({
                success: function (res) {
                        getAdertisWeightData(that);
                }
        })
};

function searchBluetoothDevicesPower(that) {
        wx.openBluetoothAdapter({
                success: function (res) {
                        //获取本机蓝牙适配器状态
                        wx.getBluetoothAdapterState({
                                success: function (res) {
                                        that.setData({
                                                available: res.available
                                        });
                                }
                        });
                },
                // fail: function (res) {
                //         //定时器非空，关闭定时器
                //         if (timer != null) {
                //                 console.log("关闭定时器")
                //                 clearInterval(timer);
                //         }
                // }
        });
        wx.startBluetoothDevicesDiscovery({
                success: function (res) {
                        getAdertisPowerData(that);
                }
        })
};

/**
 * 获取当前的设备的广播数据
 */
function getAdertisWeightData(that) {
        var deviceId = that.data.deviceId;
        wx.getBluetoothDevices({
                success: function (res) {
                        var index = res.devices.length;
                        if(index>0){
                                for (var i = 0; i < index; i++) {
                                        console.log("deviceId:" + res.devices[i].deviceId)
                                        if (res.devices[i].deviceId == deviceId) {
                                                var currentEquipmentData = ab2hex(res.devices[i].advertisData);
                                                var weightValue = Dec.DecryptWeight(currentEquipmentData);
                                                that.setData({
                                                        weight: weightValue,
                                                        isExistDevice:true,
                                                });
                                                console.log(ab2hex(res.devices[i].advertisData));
                                                break;
                                        }
                                }    
                        }
                        if (!that.data.isExistDevice){
                                that.setData({
                                        weight: '',
                                });
                                wx.showModal({
                                        title: '提示',
                                        content: '未找到设备',
                                        duration:1000
                                })      
                        }
                        stopBluetooth(that);
                }
        });
}

function getAdertisPowerData(that) {
        var deviceId = that.data.deviceId;
        wx.getBluetoothDevices({
                success: function (res) {
                        var index = res.devices.length;
                        if (index > 0) {
                                for (var i = 0; i < index; i++) {
                                        console.log("deviceId:" + res.devices[i].deviceId)
                                        if (res.devices[i].deviceId == deviceId) {
                                                var currentEquipmentData = ab2hex(res.devices[i].advertisData);
                                                var powerValue = Dec.DecryptPower(currentEquipmentData);
                                                that.setData({
                                                        power: powerValue + " %",
                                                });
                                                console.log(ab2hex(res.devices[i].advertisData));
                                                break;
                                        }
                                }
                        } else {
                                that.setData({
                                        power: "-- %",
                                });
                        }
                        stopBluetooth(that);
                }
        });
}

/**
 * 停止搜索附近蓝牙设备
 */
function stopBluetooth(that) {
        wx.stopBluetoothDevicesDiscovery({
                success: function (res) {
                        that.setData({
                                hidden: true
                        });
                        console.log("关闭搜索设备！")
                }
        })
};


/**
 * 定时获取设备的电量
 * 
 */
function getBluethootDevicePower(that){
        timer = setInterval(function () {
                console.log("定时器")
                searchBluetoothDevicesPower(that);               
        }, 10000) //定时器时间间隔 10s 
}

/**
 * ArrayBuffer转16进度字符串
 */
function ab2hex(buffer) {
        var hexArr = Array.prototype.map.call(
                new Uint8Array(buffer),
                function (bit) {
                        return ('00' + bit.toString(16)).slice(-2)
                }
        )
        return hexArr.join('');
};


