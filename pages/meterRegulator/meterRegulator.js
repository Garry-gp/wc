var deviceIdKey = "sqqkSbLgXcY+naQ5+izLjQ==";
var Dec = require('../../public/public.js');
var Util = require('../../utils/util.js');
var timer;
Page({
        data: {
                weight: '',
                price: '',
                total: '0.00',
                power:'-- %',
                tempWeight:'',
                netWeigth:20,
                settingImg: "../../image/setting.png",

                deviceName:null,
                deviceId: null,
                currentAdvertisData:null,
                devices:[],

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
                // getBluethootDevicePower(that);    
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
                // getBluethootDevice(that);
                // getBluethootDevicePower(that);
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
         * 去皮
         */
        netWeight: function(){

        },

        /**
         * 保存记录
         */
        SaveValue: function () {
                var that = this;
                var weightValue = that.data.tempWeight;
                var priceValue = that.data.price;
                var netWeigth = that.data.netWeigth;
                var totalValue = 0;
                if (weightValue!=''){
                        var  weight= (weightValue-netWeigth)/1000;
                        totalValue = weight * priceValue;
                        this.setData({
                                weight: weight.toFixed(2),
                                total: totalValue.toFixed(2),
                        });
                }
        },

        /**
         * 保持当前的数值
         **/
        keepWeight: function () {
                var that = this;
                this.initBluetoothAdapter();
                console.log(that.data.hidden);
                console.log(that.data.isInitSuccess)
                if (that.data.isInitSuccess){
                        that.setData({
                                total: '',
                                // hidden: false
                        });
                        searchBluetoothDevices(that);
                }
        },
        /**
         * 设置图标的页面跳转
         */
        systemSetting: function () {
                wx.navigateTo({
                        url: '../configure/configure'
                })
        }
});

//----------------------------------------------------------------

/**
 * 开始搜索附近蓝牙设备
 */
function searchBluetoothDevices(that) {
        wx.startBluetoothDevicesDiscovery({
                success: function (res) {
                        setTimeout(function(){
                                getAdertisWeightData(that);
                        },600);
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
                                        if (res.devices[i].deviceId == deviceId) {
                                                var currentEquipmentData = ab2hex(res.devices[i].advertisData);
                                                var weightValue = Dec.DecryptWeight(currentEquipmentData);
                                                var powerValue = Dec.DecryptPower(currentEquipmentData);
                                                console.log(currentEquipmentData);
                                                that.setData({
                                                        tempWeight: weightValue,
                                                        power: powerValue + " %",
                                                });
                                                break;
                                        }
                                }    
                        }                       
                },
                complete: function () {
                        stopBluetooth(that);
                }
        });
}


// function searchBluetoothDevicesPower(that) {
//         wx.startBluetoothDevicesDiscovery({
//                 success: function (res) {
//                         setTimeout(function () {
//                                 getAdertisPowerData(that);
//                         },2000);
//                 }
//         })
// };

// function getAdertisPowerData(that) {
//         var deviceId = that.data.deviceId;
//         wx.getBluetoothDevices({
//                 success: function (res) {
//                         var index = res.devices.length;
//                         if (index > 0) {
//                                 for (var i = 0; i < index; i++) {
//                                         console.log("deviceId:" + res.devices[i].deviceId)
//                                         if (res.devices[i].deviceId == deviceId) {
//                                                 var currentEquipmentData = ab2hex(res.devices[i].advertisData);
//                                                 var powerValue = Dec.DecryptPower(currentEquipmentData);
//                                                 that.setData({
//                                                         power: powerValue + " %",
//                                                 });
//                                                 console.log(ab2hex(res.devices[i].advertisData));
//                                                 break;
//                                         }
//                                 }
//                         } else {
//                                 that.setData({
//                                         power: "-- %",
//                                 });
//                         }
//                 },
//                 complete: function () {
//                         // stopBluetooth(that)
//                 }
//         });
// }

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
// function getBluethootDevicePower(that){
//         timer = setInterval(function () {
//                 console.log("定时器")
//                 searchBluetoothDevicesPower(that);               
//         }, 5000) //定时器时间间隔 500ms 
// }

/**
 * 定时获取设备的重量
 * 
 */
function getBluethootDevice(that){
        timer = setInterval(function () {
                console.log("定时器")
                searchBluetoothDevices(that); 
                that.valuing();              
        }, 1000) //定时器时间间隔 1s 
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
