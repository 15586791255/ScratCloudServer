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

module.exports = {
    rand, randChar
};