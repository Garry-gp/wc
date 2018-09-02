//设置页面
var deviceIdKey = "1YKAMmiksKbbsAr5yRzmsQ==";
var keepTheMinutesKey = "HJTLH1usZJGhPe4CyRV3JFyi/HyeCmUW";
var deviceItems=[];
var app = getApp(); 
var temp = [];
var string_temp = "";
Page({
        data:{
                actionSheetHidden: true,
                version: "1.02",
                deviceName: null,
                deviceId: null,

                searchingstatus: true,
                id_text: string_temp,
                list: [],
                deviceStatus:false,
                receive_data: 'none',
                cfgHidden: true,
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
                                title: '暂无设备',
                                icon: 'loading',
                                duration: 2000
                        })
                }  
        },
        onShow() {

        },

        //检查蓝牙的初始化状态
        open_BLE: function () {
                var that = this;
                that.setData({
                        cfgHidden:false
                });  
                //开启蓝牙模块并初始化
                wx.openBluetoothAdapter({
                        success: function (res) {
                                console.log('蓝牙初始化适配器，获取成功'+res);
                        },
                        fail: function (res) {
                                that.setData({
                                        cfgHidden: true
                                }); 
                                wx.showModal({
                                        title: '提示',
                                        content: '请检查手机蓝牙是否打开',
                                        showCancel:false,
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
                                        checkBluetooth(that);
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
                        url: '/pages/particular/particular'
                })
        },
        checkMinutesInformation: function () {
                wx.navigateTo({
                        url: '/pages/keepTheMinutes/keepTheMinutes'
                })
        }
});


//开始搜索附近蓝牙设备
function checkBluetooth(that) {
        wx.startBluetoothDevicesDiscovery({
                success: function (res) {
                        setTimeout(function(){
                                getBluetoothList(that);
                        },2000);
                }
        })
};

//获取发现的蓝牙设备
function getBluetoothList(that) {
        wx.getBluetoothDevices({
                success: function (res) {
                        var string_temp=null;
                        var index = res.devices.length;
                        for (var i = 0; i < index; i++) {
                                if (res.devices[i].advertisServiceUUIDs.length>0) {
                                        string_temp = string_temp + '\n' + res.devices[i].deviceId;
                                }
                        }
                        that.setData({
                                id_text: string_temp,
                                list: res.devices,
                        });
                        that.setData({
                                cfgHidden: true
                        });
                        stopBluetooth(that);
                }
        })
}

//停止搜索附近蓝牙设备
function stopBluetooth(that) {
        wx.stopBluetoothDevicesDiscovery({
                success: function (res) {
                        that.setData({
                                searchingstatus: true,
                        })
                        console.log("关闭搜索设备！")
                }
        });
        closeBluetoothAdapter();
};

function closeBluetoothAdapter(){
        wx.closeBluetoothAdapter({
                success: function (res) { 
                        console.log("关闭")
                },
        })
}
