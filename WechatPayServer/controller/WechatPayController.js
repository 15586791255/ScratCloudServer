// const xml2json = require('xml2json');
const AccessTokenDao = require('../dao/AccessTokenDao');
const CoinPlanDao = require('../dao/CoinPlanDao');
const OrderInfoDao = require('../dao/OrderInfoDao');
const _Payment = require('wechat-pay').Payment;
const Payment = new _Payment({
    partnerKey: Config.wechatPayPartnerKey,
    appId: Config.wechatPayAppId,
    mchId: Config.wechatPayMchId,
    notifyUrl: Config.wechatPayNotifyUrl,
    pfx: Config.wechatPayPfx
});

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

    const {coin_plan_id} = req.params;

    Co(function *() {
        // const [token] = yield AccessTokenDao.getToken(uid, access_token);
        // if (!token) {
        //     return BaseRes.tokenError(res);
        // }
        //
        const now_ts = new Date().getTime();
        // if (token.expired_ts < now_ts) {
        //     return BaseRes.tokenError(res);
        // }

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

        const orderInfo = {
            body: `${coin_plan.coin_count}竞猜币`,
            attach: `{"coin_plan_id":${coin_plan_id}, "fee":${fee}, "uid":${uid}, "order_info_id":${order_info_id}}`,
            out_trade_no: out_trade_no,
            total_fee: fee,
            spbill_create_ip: '127.0.0.1',
            trade_type: 'APP'
        };
        console.log(orderInfo);
        Payment.getBrandWCPayRequestParams(orderInfo, (err, pay_args) => {
            console.log(err);
            console.log(pay_args);
            if (err) {
                return BaseRes.serverError(res, '生成微信订单失败');
            }

            return BaseRes.success(res, {
                app_id: pay_args.appId,
                partner_id: Config.wechatPayMchId,
                prepay_id: pay_args.package.split('=')[1],
                package: 'Sign=WXPay',
                nonce_str: pay_args.nonceStr,
                timestamp: pay_args.timestamp,
                sign: pay_args.paySign
            });
        });
    });
};

const notifyOrder = (req, res) => {
    console.log(req);
    res.set('Content-Type', 'text/xml');
    res.send(`<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>`);
};

module.exports = {
    createOrder, notifyOrder
};