const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
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



module.exports = {
        formatTime: formatTime,
        ab2hex: ab2hex,
        hexCharCodeToStr: hexCharCodeToStr
}