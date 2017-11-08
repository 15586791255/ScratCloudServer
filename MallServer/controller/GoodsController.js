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
            // const [count_info] = yield GoodsOrderDao.getTotalOrders(good.goods_id);
            // good.total_apply = count_info.total;
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

module.exports = {
    getGoods
};