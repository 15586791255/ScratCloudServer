const xml2json = require('xml2json');
const rp = require('request-promise');
const crypto = require('crypto');
const AccessTokenDao = require('../dao/AccessTokenDao');
const CoinPlanDao = require('../dao/CoinPlanDao');
const OrderInfoDao = require('../dao/OrderInfoDao');

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

const rand = (count) => {
    count = count || 6;
    let code = "";
    for (let i = 0; i < count; i++) {
        code += Math.floor(Math.random() * 10);
    }
    return code;
};

const createOutTradeNo = (ts, coin_plan_id) => {
    const rand_num = rand(3);
    return `${ts}${rand_num}${coin_plan_id}`;
};

const createOrder = (req, res) => {
    const {app_key, pt, uid, access_token} = req.headers;
    if (!uid || !access_token) {
        return BaseRes.tokenError(res, '请登陆');
    }

    let client_ip = req.headers['x-real-ip'];
    if (!client_ip || client_ip == '::1' || client_ip.indexOf('::') != -1 ) {
        client_ip = '39.108.94.94';
    }

    const {coin_plan_id} = req.params;

    Co(function *() {
        const [token] = yield AccessTokenDao.getToken(uid, access_token);
        if (!token) {
            return BaseRes.tokenError(res);
        }

        const now_ts = new Date().getTime();
        if (token.expired_ts < now_ts) {
            return BaseRes.tokenError(res);
        }

        const [coin_plan] = yield CoinPlanDao.getCoinPlan(coin_plan_id);
        if (!coin_plan) {
            return BaseRes.notFoundError(res);
        }

        const fee = Config.payDebug ? 1 : coin_plan.fee;
        const out_trade_no = createOutTradeNo(now_ts, coin_plan_id);
        const order_info_id = yield OrderInfoDao.addOrder(uid, out_trade_no, 'coin_plan', coin_plan_id, fee, 'weixin');
        if (order_info_id <= 0) {
            return BaseRes.serverError(res, '创建订单失败');
        }

        const now_date = new Date();
        const params = {
            appid: Config.wechatPayAppId,
            attach: 'GoGo',
            body: `${coin_plan.coin_count}`,
            mch_id: Config.wechatPayMchId,
            nonce_str: rand(32),
            notify_url: Config.wechatPayNotifyUrl,
            out_trade_no: out_trade_no,
            spbill_create_ip: client_ip,
            total_fee: fee,
            trade_type: 'APP',
            time_start: now_date.format('yyyyMMddhhmmss'),
            time_expire: new Date(now_date.getTime() + 1000*60*60).format('yyyyMMddhhmmss')
        };
        console.log(params);

        const sign = getSign(params);
        console.log(sign);

        const body = `<xml>
           <appid>${params.appid}</appid>
           <attach>${params.attach}</attach>
           <body>${params.body}</body>
           <mch_id>${params.mch_id}</mch_id>
           <nonce_str>${params.nonce_str}</nonce_str>
           <notify_url>${params.notify_url}</notify_url>
           <out_trade_no>${params.out_trade_no}</out_trade_no>
           <spbill_create_ip>${params.spbill_create_ip}</spbill_create_ip>
           <total_fee>${params.total_fee}</total_fee>
           <trade_type>${params.trade_type}</trade_type>
           <time_start>${params.time_start}</time_start>
           <time_expire>${params.time_expire}</time_expire>
           <sign>${sign}</sign>
        </xml>`;
        console.log(body);
        rp({
            method: 'POST',
            uri: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
            body: body,
            json: false
        }).then(xml_data => {
            console.log(xml_data);
            const response_data = JSON.parse(xml2json.toJson(xml_data));
            if (!response_data.xml || !response_data.xml.result_code || response_data.xml.result_code != 'SUCCESS') {
                console.log(xml_data);
                console.log(response_data);
                return BaseRes.serverError(res, '生成预订单失败');
            }
            const res_data = response_data.xml;
            console.log(res_data);
            BaseRes.success(res, {
                app_id: res_data.appid,
                partner_id: Config.wechatPayMchId,
                prepay_id: res_data.prepay_id,
                package: 'Sign=WXPay',
                nonce_str: res_data.nonce_str,
                timestamp: parseInt(now_date.getTime()/1000),
                sign: sign
            });
        }).catch(err => {
            console.log(err);
            return BaseRes.serverError(res, '申请微信订单失败');
        });
        // const xml_data = `<xml><return_code><![CDATA[SUCCESS]]></return_code>
        //     <return_msg><![CDATA[OK]]></return_msg>
        //     <appid><![CDATA[wx3349545f4d0831xx]]></appid>
        //     <mch_id><![CDATA[1491484911]]></mch_id>
        //     <nonce_str><![CDATA[mdcM5mYcxlgnPcf1]]></nonce_str>
        //     <sign><![CDATA[DEA41F740F551EAEC9023284C21EE6B7]]></sign>
        //     <result_code><![CDATA[SUCCESS]]></result_code>
        //     <prepay_id><![CDATA[wx20171114222314541f7ff2210254086425]]></prepay_id>
        //     <trade_type><![CDATA[APP]]></trade_type>
        //     </xml>`;
    });
};

const notifyOrder = (req, res) => {
    console.log(req);
    res.set('Content-Type', 'text/xml');
    res.send(`<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>`);
};

const getSign = (params) => {
    delete params.sign;
    let param_str = Object.keys(params).sort().map(key=>`${key}=${params[key]}`).join('&');
    let sign_str = `${param_str}&key=${Config.wechatPayPartnerKey}`;
    console.log(sign_str);
    return crypto.createHash('md5').update(sign_str).digest('hex').toUpperCase();
};

module.exports = {
    createOrder, notifyOrder
};