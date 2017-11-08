const rand = (count) => {
    count = count || 6;
    let code = "";
    for (let i = 0; i < count; i++) {
        code += Math.floor(Math.random() * 10);
    }
    return code;
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

module.exports = {
    rand, randChar, getSqlPlaceHolder
};