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
            const accountId = yield AccountDao.addAccount(app.app_id, tel, '', tel, '', 'unknown');
            if (accountId == 0) {
                return BaseRes.serverError(res, '创建账号失败');
            }
            account = yield AccountDao.findByAccountId(accountId);
        }

        console.log(account);
        const {uid} = account;
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

module.exports = {
    login, smsLogin
};