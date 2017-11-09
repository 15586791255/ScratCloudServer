const AccessTokenDao = require('../dao/AccessTokenDao');
const AccountDao = require('../dao/AccountDao');
const UserCoinDao = require('../dao/UserCoinDao');
const AddressDao = require('../dao/AddressDao');

const getUserInfo = (req, res) => {
    const {app_key, pt, uid, access_token} = req.headers;

    if (!app_key || !pt) {
        return BaseRes.paramError(res);
    }

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

        const [account] = yield AccountDao.findByUid(uid);
        if (!account) {
            return BaseRes.notFoundError(res);
        }

        let coin = 0;
        const [coin_info] = yield UserCoinDao.findByUid(uid);
        if (coin_info) {
            coin = coin_info.coin_count;
        }

        BaseRes.success(res, {
            uid,
            coin,
            tel: account.tel,
            username: account.username,
            gender: account.gender,
            avatar: account.avatar
        });
    });
};

const updateUserInfo = (req, res) => {
    const {app_key, pt, uid, access_token} = req.headers;
    if (!uid || !access_token) {
        return BaseRes.tokenError(res, '请登陆');
    }

    const {avatar, username, gender} = req.body;

    Co(function *() {
        const [token] = yield AccessTokenDao.getToken(uid, access_token);
        if (!token) {
            return BaseRes.tokenError(res);
        }

        const now_ts = new Date().getTime();
        if (token.expired_ts < now_ts) {
            return BaseRes.tokenError(res);
        }

        const [account] = yield AccountDao.findByUid(uid);
        if (!account) {
            return BaseRes.notFoundError(res);
        }

        AccountDao.updateAccount(uid, avatar, gender, username);
        BaseRes.success(res);
    });
};

const updateAddress = (req, res) => {
    const {app_key, pt, uid, access_token} = req.headers;
    if (!uid || !access_token) {
        return BaseRes.tokenError(res, '请登陆');
    }

    const {address_id, address_detail, tel, location, receiver} = req.body;
    
    Co(function *() {
        const [token] = yield AccessTokenDao.getToken(uid, access_token);
        if (!token) {
            return BaseRes.tokenError(res);
        }

        const now_ts = new Date().getTime();
        if (token.expired_ts < now_ts) {
            return BaseRes.tokenError(res);
        }
        
        const [address] = yield AddressDao.getAddress(uid);
        if (!address) {
            AddressDao.addAddress(uid, address_detail, tel, location, receiver);
        } else {
            AddressDao.updateAddress(uid, address_detail, tel, location, receiver);
        }

        BaseRes.success(res);
    });
};

module.exports = {
    getUserInfo, updateUserInfo, updateAddress
};