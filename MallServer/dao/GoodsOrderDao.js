function * getTotalOrders(goods_id) {
    return yield Conn.query(
        'select count(1) as total from goods_order where delete_ts=0 and goods_id=?',
        {replacements: [goods_id], type: Sequelize.QueryTypes.SELECT});
}

function * getTotalBuy(goods_id, uid) {
    return yield Conn.query(
        'select count(1) as total from goods_order where delete_ts=0 and goods_id=? and uid=?',
        {replacements: [goods_id, uid], type: Sequelize.QueryTypes.SELECT});
}

function * addOrder(goods_id, uid) {
    const now_ts = new Date().getTime();
    const [insert_id, affected_rows] = yield Conn.query(
        'insert ignore into goods_order set goods_id=?,uid=?,create_ts=?',
        {replacements: [goods_id, uid, now_ts], type: Sequelize.QueryTypes.INSERT});
    return insert_id;
}

function * getOrder(uid, goods_order_id, size) {
    if (!goods_order_id || goods_order_id == 0) {
        return yield Conn.query('select * from goods_order where uid=? and delete_ts=0 order by goods_order_id desc limit ?',
            {replacements: [uid, size], type: Sequelize.QueryTypes.SELECT});
    }

    return yield Conn.query('select * from goods_order where uid=? and goods_order_id<? and delete_ts=0 order by goods_order_id desc limit ?',
        {replacements: [uid, goods_order_id, size], type: Sequelize.QueryTypes.SELECT});
}

module.exports = {
    getTotalOrders, getTotalBuy, addOrder, getOrder
};