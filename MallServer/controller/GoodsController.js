const GoodsDao = require('../dao/GoodsDao');
const GoodsOrderDao = require('../dao/GoodsOrderDao');
const AccessTokenDao = require('../dao/AccessTokenDao');
const UserCoinDao = require('../dao/UserCoinDao');
const CoinHistoryDao = require('../dao/CoinHistoryDao');

const getGoods = (req, res) => {
    let {index, size, tp} = req.query;

    if (!index) {
        index = 0
    } else if (index < 0) {
        return BaseRes.success(res, {index: -1, items: []});
    }

    if (!size) {
        size = 20;
    } else if (size > 60) {
        size = 60;
    } else if (size <= 0) {
        return BaseRes.success(res, {index: -1, items: []});
    }

    Co(function *() {
        const goods = yield GoodsDao.getGoods(tp, index, parseInt(size));
        let min_index = index;
        for (let good of goods) {
            if (min_index == 0 || min_index > good.goods_id) {
                min_index = good.goods_id;
            }
            delete good.delete_ts;
            delete good.description;
        }
        if (goods.length < size) {
            min_index = -1;
        }
        BaseRes.success(res, {index: min_index, items: goods});
    });
};

const getGoodsDetail = (req, res) => {
    const {app_key, pt, uid, access_token} = req.headers;
    const {goods_id} = req.params;
    Co(function *() {
        const [goods] = yield GoodsDao.getGoodsDetail(goods_id);
        if (!goods) {
            return BaseRes.notFoundError(res);
        }

        delete goods.delete_ts;
        const [count_info] = yield GoodsOrderDao.getTotalOrders(goods_id);
        goods.total_apply = count_info.total;
        if (!uid || uid == '') {
            goods.total_buy = -1;
        } else {
            const [buy_info] = yield GoodsOrderDao.getTotalBuy(goods_id, uid);
            goods.total_buy = buy_info.total;
        }

        BaseRes.success(res, goods);
    });
};

const bugGoods = (req, res) => {
    const {app_key, pt, uid, access_token} = req.headers;
    const {goods_id} = req.params;
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

        const [goods] = yield GoodsDao.getGoodsDetail(goods_id);
        if (!goods) {
            return BaseRes.notFoundError(res);
        }

        if (goods.delete_ts > 0) {
            return BaseRes.notFoundError(res);
        }

        if (now_ts > goods.expired_ts) {
            return BaseRes.forbiddenError(res, "已过期");
        }

        const [buy_info] = yield GoodsOrderDao.getTotalBuy(goods_id, uid);
        if (buy_info.total >= goods.max_per_buy) {
            return BaseRes.forbiddenError(res, "购买数量超出限制");
        }

        const [user_coin] = yield UserCoinDao.getUserCoin(uid);
        if (!user_coin) {
            return BaseRes.forbiddenError(res, "积分不足");
        }

        if (user_coin.coin_count < goods.coin) {
            return BaseRes.forbiddenError(res, "积分不足");
        }

        const [total_order_info] = yield GoodsOrderDao.getTotalOrders(goods_id);
        if (total_order_info.total >= goods.total) {
            return BaseRes.forbiddenError(res, "兑换失败");
        }

        UserCoinDao.updateUserCoin(uid, user_coin.coin_count - goods.coin);
        const order_id = yield GoodsOrderDao.addOrder(goods_id, uid);
        CoinHistoryDao.addHistory(uid, goods.coin, 'exchange', order_id);
        BaseRes.success(res);
    })
};

module.exports = {
    getGoods, getGoodsDetail, bugGoods
};