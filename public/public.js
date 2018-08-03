var CryptoJS = require('./aes.js');  //引用AES源码js
var Utf8 = require('./enc-utf8.js');  //引用AES源码js
var Hex = require('./enc-hex.js');  //引用AES源码js

var key = Utf8.parse("bluet:secret key");
function Decrypt(word) {
        var encryptedHexStr = Hex.parse(word);
        var decryptedData = CryptoJS.decrypt(encryptedHexStr, key);
        var decryptedStr = decryptedData.toString(Utf8);
        var decryptedArray= decryptedStr.split(",");
        console.log("密文:" + word);
        console.log("解密后:" + decryptedStr);
        console.log("数组长度:" + decryptedArray.length);
        console.log("重量：" + decryptedArray[14]+" kg");
        console.log("电量：" + decryptedArray[15]+" %");
        return decryptedArray[14];
}
module.exports.Decrypt = Decrypt;
