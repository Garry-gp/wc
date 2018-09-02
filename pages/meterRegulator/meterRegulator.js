var deviceIdKey = "1YKAMmiksKbbsAr5yRzmsQ==";
var keepTheMinutesKey = "HJTLH1usZJGhPe4CyRV3JFyi/HyeCmUW";
var Dec = require('../../public/public.js');
var Util = require('../../utils/util.js');
var searchAdertisTimer;
var currentMinutesName="";
var num=0;
Page({
        data: {
                weight: '',
                price: '',
                total: '0.00',
                power:'-- %',
                tempWeight:'',
                netWeigth: 0,
                settingImg: "../../image/setting.png",

                deviceName:null,
                deviceId: null,
                currentAdvertisData:null,
                devices:[],
                animationData:"",

                available:false,
                isInitSuccess:true,
                isExistDevice:false,
                showModalStatus: false,
                isKeep:true,
                hidden:true,
        },
        onLoad: function () {
        },
        onShow:function(options) {
                let self = this;
                let aShow = JSON.parse(sessionStorage.getItem('aShow')) || '';
                console.log("当前页面  "+aShow)
                if (aShow) {
                        //初始化蓝牙
                        this.initBluetoothAdapter();   
                }
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
                                                getBluethootDevice(that);
                                        }
                                });
                        },
                        fail: function (res) {
                                that.setData({
                                        isInitSuccess:false
                                });
                                that.showInitFail();
                        }
                });
                
        },

        showInitFail:function(){
                wx.showModal({
                        title: '提示',
                        content: '请检查手机蓝牙是否打开',
                        showCancel:false,
                })
        },

        /**
         * 监听输入框的单价格
        */
        priceInput: function (e) {
                var that = this;
                that.setData({
                        price: e.detail.value
                });
                computingValue(that);
        },

        watchValues: function (event) {
                this.setData({
                        price: event.detail.value,
                });
        },

        
        /**
         * 去皮
         */
        netWeight: function(){
                var that = this;
                var flag = that.data.isInitSuccess;
                if(!flag){
                        that.showInitFail();
                        return;  
                }
                var currentValue = that.data.tempWeight;
                this.setData({
                        weight:0,
                        netWeigth: currentValue,
                }); 
                //两秒后开始计时器
                setTimeout(function () {
                        getBluethootDevice(that)
                }, 1000);     
        },

        /**
         * 保持当前的数值
         **/
        keepWeight: function () {
                var that = this;
                var flag = that.data.isInitSuccess;
                if (!flag) {
                        that.showInitFail();
                        return;
                }
                if (that.data.isKeep){
                        if (searchAdertisTimer != null) {
                                console.log("关闭定时器");
                                searchAdertisTimer = clearInterval(searchAdertisTimer);
                        }
                } else{
                        getBluethootDevice(that);
                }
                that.setData({
                        isKeep: !that.data.isKeep,
                });
        },

        /**
         弹出编辑框
         */
        powerDrawer: function (e) {
                var that = this;
                // var flag = that.data.isInitSuccess;
                // if (!flag) {
                //         that.showInitFail();
                //         return;
                // }
                var currentStatu = e.currentTarget.dataset.statu;
                that.util(currentStatu);
        },
        
        bindChange: function (e) {
                currentMinutesName=e.detail.value;
        },

        /**
         * 动态弹出输入框
         */
        util: function (currentStatu) {
                var animation = wx.createAnimation({
                        duration: 200,  
                        timingFunction: "linear", 
                        delay: 0 
                });
                this.animation = animation;
                animation.opacity(0).rotateX(-100).step();
                this.setData({
                        animationData: animation.export()
                })
                setTimeout(function () {
                        animation.opacity(1).rotateX(0).step();
                        this.setData({
                                animationData: animation
                        })
                        if (currentStatu == "close") {
                                this.setData({
                                        showModalStatus: false
                                });
                                this.saveCurrentMinutes();
                        }
                }.bind(this), 200)
                if (currentStatu == "open") {
                        this.setData({
                                showModalStatus: true
                        });
                }
        },

        saveCurrentMinutes : function(){
                var that = this;
                var n = currentMinutesName;
                var w = that.data.weight;
                var p = that.data.price;
                var t = that.data.total;
                var d = Util.formatTime(new Date());
                var tempVales = wx.getStorageSync(keepTheMinutesKey);
                if (tempVales){
                        tempVales = tempVales + '^{"name":"' + n + '","dateTime":"' + d + '","weight":"' + w + '","price":"' + p + '","totality":"' + t +'"}';
                } else{
                        tempVales = '{"name":"' + n + '","dateTime":"' + d + '","weight":"' + w + '","price":"' + p + '","totality":"' + t +'"}';
                }
                try {
                        wx.setStorageSync(keepTheMinutesKey, tempVales)
                } catch (e) {
                }     
                console.log("记录："+tempVales);
        },

        
        /**
         * 设置图标的页面跳转
         */
        systemSetting: function () {
                if (searchAdertisTimer!=null){ //关闭搜索设备定时器
                        searchAdertisTimer=clearInterval(searchAdertisTimer);
                }
                wx.navigateTo({
                        url: '/pages/configure/configure'
                })
        },
});

//----------------------------------------------------------------



/**
 * 定时获取设备
 * 
 */
function getBluethootDevice(that) {
        if (searchAdertisTimer==null){
                searchAdertisTimer = setInterval(function () {
                        console.log("定时器")
                        searchBluetoothDevices(that);
                        computingValue(that);
                }, 1000) //定时器时间间隔 1s 
        }
}
/**
 * 计算增值
 */
function computingValue(that){
        var weightValue = that.data.tempWeight;
        var priceValue = that.data.price;
        var netWeigth = that.data.netWeigth;
        var totalValue = 0;
        if (weightValue != '') {
                var weight = (weightValue - netWeigth) / 1000;
                totalValue = weight.toFixed(2) * priceValue;
                that.setData({
                        weight: weight.toFixed(2),
                        total: totalValue.toFixed(2),
                });
        }
}

/**
 * 开始搜索附近蓝牙设备
 */
function searchBluetoothDevices(that) {
        console.log("开始搜索设备")
        wx.startBluetoothDevicesDiscovery({
                allowDuplicatesKey:true,
                success: function (res) {
                        setTimeout(function(){
                                getAdertisWeightData(that);
                                stopBluetooth(that);
                        },700);
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
                        computingValue(that);
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
