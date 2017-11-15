function * addOrder(uid, out_trade_no, tp, tp_id, fee, platform) {
    const now_ts = new Date().getTime();
    const [insert_id, effect_row] = yield Conn.query(
        'insert ignore into order_info set uid=?,out_trade_no=?,tp=?,tp_id=?,fee=?,pay_pt=?,create_ts=?',
        {replacements: [uid, out_trade_no, tp, tp_id, fee, platform, now_ts], type: Sequelize.QueryTypes.INSERT});
    return insert_id;
}

function * getOrder(out_trade_no) {
    return yield Conn.query('select * from order_info where out_trade_no=? limit 1',
        {replacements: [out_trade_no], type: Sequelize.QueryTypes.SELECT});
}

function * updateOrderStatus(order_id, status) {
    yield Conn.query('update order_info set status=? where order_id=?',
        {replacements: [status, order_id], type: Sequelize.QueryTypes.UPDATE});
}

module.exports = {
    addOrder, getOrder, updateOrderStatus
};