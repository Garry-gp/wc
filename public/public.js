var CryptoJS = require('/aes.js');  //引用AES源码js
var key = CryptoJS.enc.Utf8.parse("626c7565743a736563726574206b6579");//十六位十六进制数作为秘钥  bluet:secret key
var iv = "";//十六位十六进制数作为秘钥偏移量


//解密方法
function Decrypt(word) {
        encryptedData = encryptedData.ciphertext.toString();
        var encryptedHexStr = CryptoJS.enc.Hex.parse(word);
        var decryptedData = CryptoJS.AES.decrypt({ ciphertext: encryptedHexStr }, key, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
        });
        var decryptedStr = decryptedData.toString(CryptoJS.enc.Utf8);
        console.log(decryptedStr);

}
module.exports.Decrypt = Decrypt;
