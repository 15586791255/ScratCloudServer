const rp = require('request-promise');
const md5 = require('md5');

const SmsDao = require('../dao/SmsDao');

const sendTencentSms = (req, res) => {
    const {tel} = req.body;
    if (!tel) {
        return BaseRes.paramError(res);
    }

    const code = Utils.rand();
    SmsDao.addSms(tel, code);

    const body = {
        tel: {
            nationcode: '86',
            phone: tel
        },
        type: '0', //0:普通短信;1:营销短信
        tpl_id: Config.tencentSmsTemplateId,
        params: [code, 'GoGo'],
        sig: md5(`${Config.tencentSmsAppSecret}${tel}`),
        extend: '',
        ext: ''
    };

    rp({
        method: 'POST',
        uri: `https://yun.tim.qq.com/v3/tlssmssvr/sendsms?sdkappid=${Config.tencentSmsAppId}&random=${Utils.rand()}`,
        body: body,
        json: true
    }).then(parsedBody => {
        console.log(parsedBody);
        if (parsedBody.result != 0) {
            console.log('发送短信失败!' + parsedBody.errmsg);
            return BaseRes.serverError(res, parsedBody);
        }
        BaseRes.success(res);
    }).catch(err => {
        console.log(err);
        return BaseRes.serverError(res, err);
    });
};

const sendMoveCarSms = (req, res) => {
    const {tel} = req.body;
    if (!tel) {
        return BaseRes.paramError(res);
    }

    const code = Utils.rand();
    SmsDao.addSms(tel, code);

    const body = {
        clientid: Config.moveCarSmsClientId,
        password: Config.moveCarSmsPassword,
        mobile: tel,
        content: `【满天飞】验证码 ${code}, 任何向您索要验证码的都是骗子, 千万别给!`,
        smstype: '4',//0: 通知短信; 4: 验证码短信; 5: 营销短信
        extend: "",
        uid: ""
    };
    rp({
        method: 'POST',
        uri: `http://api.10086gg.cn/sms-partner/access/${Config.moveCarSmsClientId}/sendsms`,
        body: body,
        json: true
    }).then(parsedBody => {
        console.log(parsedBody);
        if (!parsedBody || !parsedBody.data || parsedBody.data.length == 0 || parsedBody.data[0].code != 0) {
            console.log('发送短信失败!' + parsedBody.errmsg);
            return BaseRes.serverError(res, parsedBody);
        }
        BaseRes.success(res);
    }).catch(err => {
        console.log(err);
        return BaseRes.serverError(res, err);
    });
};

module.exports = {
    sendTencentSms, sendMoveCarSms
};