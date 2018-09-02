/**  @ keepTheMinutes.js */
var keepTheMinutesKey = "HJTLH1usZJGhPe4CyRV3JFyi/HyeCmUW";

Page({
        data: {
                name:"<未知>",
                arrayList:[]
        },
        onLoad() {
                try {
                        //从本地缓存中同步获取指定 key 对应的内容。
                        var value = wx.getStorageSync(keepTheMinutesKey)
                        if (value) {
                                //设置值
                                this.getkeepTheMinutesList(value);
                        }
                } catch (e) {};
        },

        getkeepTheMinutesList:function(value){
                var tempArray = value.split("^");
                var array = [];
                for(var i=0;i<tempArray.length;i++){
                        var obj = JSON.parse(tempArray[i]);
                        array.push(obj);
                }
                this.setData({
                        arrayList: array,
                });
        },
        cleanMinuret: function(){
                var that = this;
                wx.removeStorage({
                        key: keepTheMinutesKey,
                        success: function (res) {
                                console.log("清除")
                                that.setData({
                                        arrayList:"",
                                });
                        }
                })
        }
})