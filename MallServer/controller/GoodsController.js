const GoodsDao = require('../dao/GoodsDao');
const GoodsOrderDao = require('../dao/GoodsOrderDao');

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

module.exports = {
    getGoods, getGoodsDetail
};