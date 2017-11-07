const rp = require('request-promise');
const AppDao = require('../dao/AppDao');
const AccountDao = require('../dao/AccountDao');
const SmsDao = require('../dao/SmsDao');
const RefreshTokenDao = require('../dao/RefreshTokenDao');
const AccessTokenDao = require('../dao/AccessTokenDao');

const login = (req, res) => {
    const headers = req.headers;
    Co(function *() {
        const app = yield AppDao.findByAppKey(headers.app_key);
        if (app.length == 0) {
            return BaseRes.forbiddenError(res);
        }
        BaseRes.success(res);
    });
};

const convertWxSex = (sex) => {
    if (sex == '1') {
        return 'male';
    }

    if (sex == '2') {
        return 'female';
    }
    return 'unknown';
};

const smsLogin = (req, res) => {
    const {app_key, pt} = req.headers;
    const {tel, code} = req.body;

    if (!app_key || !pt || !tel || !code) {
        return BaseRes.paramError(res);
    }

    Co(function *() {
        const [app] = yield AppDao.findByAppKey(app_key);
        if (!app) {
            return BaseRes.paramError(res);
        }

        const [sms] = yield SmsDao.findByTelAndCode(tel, code);
        if (!sms) {
            return BaseRes.notFoundError(res, '验证码不存在');
        }

        const nowTs = new Date().getTime();
        if (nowTs > sms.expired_ts) {
            return BaseRes.forbiddenError(res, '验证码已过期');
        }

        let [account] = yield AccountDao.findByAppIdAndTel(app.app_id, tel);
        if (!account) {
            const accountId = yield AccountDao.addAccount(app.app_id, tel, '', '', tel, '', 'unknown', '');
            if (accountId == 0) {
                return BaseRes.serverError(res, '创建账号失败');
            }
            account = yield AccountDao.findByAccountId(accountId);
        }

        console.log(account);
        const {uid} = account;
        if (!uid || uid == '') {
            return BaseRes.serverError(res);
        }
        const refresh_token = Utils.randChar(16);
        const refreshTokenId = yield RefreshTokenDao.addToken(uid, refresh_token, pt);
        if (refreshTokenId == 0) {
            return BaseRes.serverError(res);
        }
        const access_token = Utils.randChar(16);
        const accessTokenId = yield AccessTokenDao.addToken(uid, access_token, pt);
        if (accessTokenId == 0) {
            return BaseRes.serverError(res);
        }

        const data = {
            uid,
            refresh_token,
            access_token,
            expired_in: Config.expiredTokenInTs
        };

        return BaseRes.success(res, data);
    });
};

const refreshToken = (req, res) => {
    const {app_key, pt, uid} = req.headers;
    const {refresh_token} = req.body;

    if (!app_key || !pt || !uid || !refresh_token) {
        return BaseRes.paramError(res);
    }

    Co(function *() {
        const [app] = yield AppDao.findByAppKey(app_key);
        if (!app) {
            return BaseRes.paramError(res);
        }

        const [token_data] = yield RefreshTokenDao.getToken(uid, refresh_token, pt);
        if (!token_data) {
            return BaseRes.notFoundError(res, '登录信息异常');
        }

        const now_ts = new Date().getTime();
        if (now_ts > token_data.expired_ts) {
            return BaseRes.forbiddenError(res, '登录超时');
        }

        // TODO 单点登录需要设置token过期

        const access_token = Utils.randChar(16);
        const accessTokenId = yield AccessTokenDao.addToken(uid, access_token, pt);
        if (accessTokenId == 0) {
            return BaseRes.serverError(res);
        }

        const data = {
            uid,
            refresh_token,
            access_token,
            expired_in: Config.expiredTokenInTs
        };

        return BaseRes.success(res, data);
    });

};

const wxLogin = (req, res) => {
    const {app_key, pt} = req.headers;
    const {code} = req.body;

    if (!code || !app_key || !pt) {
        return BaseRes.paramError(res);
    }

    console.log(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${Config.wxAppId}&secret=${Config.wxAppSecret}&code=${code}&grant_type=authorization_code`);
    rp({
        method: 'GET',
        uri: `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${Config.wxAppId}&secret=${Config.wxAppSecret}&code=${code}&grant_type=authorization_code`,
        json: true
    }).then(parsedBody => {
        console.log(parsedBody);
        // {"access_token": "hXRyXLQ4lhh-2phAaCL8N1LBKeF9okUvK1n49aYYySDZU-tKYB_A76DbZ3hQbzAumlYynNpuu18eLblg95xuRA",
        //     "expires_in": 7200,
        //     "refresh_token": "b9pFt1iJ_uYBJJ7JGy8z-71JXxx1iS29N5ti6mp5Zur0hMsNjhLDXglUZ-0reEvPrediIlKmjaF_FRDmSAk0WA",
        //     "openid": "oEbvn0rFY2Q80_ro9wKTYidQqaHk",
        //     "scope": "snsapi_userinfo",
        //     "unionid": "oZUHUwbeLUKoUKXu1dmam5CHDMhs"
        // }
        const {openid, access_token, unionid} = parsedBody;
        if (!openid) {
            console.log(typeof parsedBody);
            return BaseRes.serverError(res, parsedBody.errmsg);
        }
        rp({
            method: 'GET',
            uri: `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}`,
            json: true
        }).then(userBody => {
            // { openid: 'oEbvn0rFY2Q80_ro9wKTYidQqaHk',
            //     nickname: '18924212953',
            //     sex: 1,
            //     language: 'zh_CN',
            //     city: 'Guangzhou',
            //     province: 'Guangdong',
            //     country: 'CN',
            //     headimgurl: 'http://wx.qlogo.cn/mmopen/vi_32/9icoOxiatBlS91mriaJWBvCGHEsw1N8XibwJPNLAQdyYHic7bdqUG4TqbIDX58KmP7InBWdHPU8tEQU0WdgH8tGmB5A/0',
            //     privilege: [],
            //     unionid: 'oZUHUwbeLUKoUKXu1dmam5CHDMhs' }
            const {sex, nickname, headimgurl} = userBody;
            Co(function *() {
                const [app] = yield AppDao.findByAppKey(app_key);
                if (!app) {
                    return BaseRes.paramError(res);
                }

                let [account] = yield AccountDao.findByWxUnionId(unionid);
                if (!account) {
                    const accountId = yield AccountDao.addAccount(app.app_id, '', openid, unionid, nickname, '', convertWxSex(sex), headimgurl);
                    if (accountId == 0) {
                        return BaseRes.serverError(res, '创建账号失败');
                    }

                    account = yield AccountDao.findByAccountId(accountId);
                }

                const {uid} = account;
                if (!uid || uid == '') {
                    return BaseRes.serverError(res);
                }
                const refresh_token = Utils.randChar(16);
                const refreshTokenId = yield RefreshTokenDao.addToken(uid, refresh_token, pt);
                if (refreshTokenId == 0) {
                    return BaseRes.serverError(res);
                }
                const access_token = Utils.randChar(16);
                const accessTokenId = yield AccessTokenDao.addToken(uid, access_token, pt);
                if (accessTokenId == 0) {
                    return BaseRes.serverError(res);
                }

                const data = {
                    uid,
                    refresh_token,
                    access_token,
                    expired_in: Config.expiredTokenInTs
                };

                return BaseRes.success(res, data);
            });
        }).catch(err => {
            console.log(err);
            return BaseRes.serverError(res, err);
        });
    }).catch(err => {
        console.log(err);
        return BaseRes.serverError(res, err);
    });
};

const logout = (req, res) => {
    const {app_key, pt, uid, access_token} = req.headers;
    const {refresh_token} = req.body;

    const now_ts = new Date().getTime();
    AccessTokenDao.updateExpiredTs(uid, access_token, now_ts);
    RefreshTokenDao.updateExpiredTs(uid, refresh_token, now_ts);
    return BaseRes.success(res);
};

module.exports = {
    login, smsLogin, refreshToken, wxLogin, logout
};