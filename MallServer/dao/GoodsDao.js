function * getGoods(tp, index, size) {
    const now_ts = new Date().getTime();
    if (index == 0) {
        return yield Conn.query(
            'select * from goods where delete_ts=0 and expired_ts>? and tp=? order by goods_id desc limit ?',
            {replacements: [now_ts, tp, size], type: Sequelize.QueryTypes.SELECT});
    }

    return yield Conn.query(
        'select * from goods where delete_ts=0 and expired_ts>? and tp=? and goods_id<? order by goods_id desc limit ?',
        {replacements: [now_ts, tp, index, size], type: Sequelize.QueryTypes.SELECT});
}

function * getGoodsDetail(goods_id) {
    return yield Conn.query(
        'select * from goods where goods_id=?',
        {replacements: [goods_id], type: Sequelize.QueryTypes.SELECT});
}

module.exports = {
    getGoods, getGoodsDetail
};