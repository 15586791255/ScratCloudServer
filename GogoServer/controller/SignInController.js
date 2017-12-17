const SignInDao = require('../dao/SignInDao');
const UserCoinDao = require('../dao/UserCoinDao');
const AccessTokenDao = require('../dao/AccessTokenDao');

const addSign = (req, res) => {
    const {app_key, pt, uid, access_token} = req.headers;
    if (!uid || !access_token) {
        return BaseRes.tokenError(res, '请登陆');
    }
    Co(function *() {
        const [token] = yield AccessTokenDao.getToken(uid, access_token);
        if (!token) {
            return BaseRes.tokenError(res);
        }

        const now_ts = new Date().getTime();
        if (token.expired_ts < now_ts) {
            return BaseRes.tokenError(res);
        }

        const {day, has_sign} = yield getSignDays(uid);
        if (!has_sign) {
            yield SignInDao.addSignIn(uid);
            const curr_coin = SIGN_IN_COIN_GIFT[day-1];
            const [coin_info] = yield UserCoinDao.findByUid(uid);
            if (coin_info) {
                yield UserCoinDao.addCoin(uid, curr_coin);
            } else {
                yield UserCoinDao.createCoin(uid, curr_coin);
            }
        }
        const coin = yield getCurrCoin(uid);
        return BaseRes.success(res, {
            coin,
            sign_in: {
                has_sign: true,
                day,
                gift_coin: SIGN_IN_COIN_GIFT
            }
        });
    });
};

const SIGN_IN_COIN_GIFT = [1,2,4,8,16];

const coinInfo = (req, res) => {
    const {app_key, pt, uid, access_token} = req.headers;
    if (!uid || !access_token) {
        return BaseRes.tokenError(res, '请登陆');
    }
    Co(function *() {
        const [token] = yield AccessTokenDao.getToken(uid, access_token);
        if (!token) {
            return BaseRes.tokenError(res);
        }

        const now_ts = new Date().getTime();
        if (token.expired_ts < now_ts) {
            return BaseRes.tokenError(res);
        }

        const coin = yield getCurrCoin(uid);

        const {day, has_sign} = yield getSignDays(uid);

        return BaseRes.success(res, {
            coin,
            sign_in: {
                has_sign,
                day,
                gift_coin: SIGN_IN_COIN_GIFT
            }
        });
    });
};

function * getCurrCoin(uid) {
    const [coin_info] = yield UserCoinDao.findByUid(uid);
    if (coin_info) {
        return coin_info.coin_count;
    }
    return 0;
}

function * getSignDays(uid) {
    const now_date = new Date();
    const now_ts = now_date.getTime();
    let max_sign_days = Object.keys(SIGN_IN_COIN_GIFT).length;
    const old_day_ts = now_ts - 3600000 * 24 * (max_sign_days  + 1);
    const sign_in_details = yield SignInDao.getSignDetail(uid, old_day_ts);
    const dt_set = new Set();
    for (let sign_in_detail of sign_in_details) {
        dt_set.add(sign_in_detail.dt);
    }

    const today_dt = now_date.format('yyyyMMdd');
    let has_sign = dt_set.has(today_dt);

    let day = 1;
    for (; day < max_sign_days; day++) {
        const curr_ts = now_ts - 3600000 * 24 * day;
        const curr_date = new Date(curr_ts);
        const curr_dt = curr_date.format('yyyyMMdd');
        if (!dt_set.has(curr_dt)) {
            break;
        }
    }
    if (day > max_sign_days) {
        day = max_sign_days;
    }

    return {day, has_sign}
}

module.exports = {
    addSign, coinInfo
};