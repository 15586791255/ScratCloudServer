const rand = (count) => {
    count = count || 6;
    let code = "";
    for (let i = 0; i < count; i++) {
        code += Math.floor(Math.random() * 10);
    }
    return code;
};

const randNum = (min, max) => {
    return parseInt(Math.random()*(max-min)+min);
};

const randChar = (count) => {
    count = count || 6;
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < count; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const getSqlPlaceHolder = (size) => {
    if (!size || size <= 0) {
        return '';
    }

    let prepareStatement = '';
    for (let i = 0; i < size; i++){
        prepareStatement += '?,';
    }
    return prepareStatement.substr(0, prepareStatement.length - 1);
};

// new Date().format('yyyyMMdd')
Date.prototype.format = function (format) {
    const o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
};

module.exports = {
    rand, randChar, getSqlPlaceHolder, randNum
};