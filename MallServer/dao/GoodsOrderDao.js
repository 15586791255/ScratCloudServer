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

module.exports = {
    getTotalOrders, getTotalBuy, addOrder
};