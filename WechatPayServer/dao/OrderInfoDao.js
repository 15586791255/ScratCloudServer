function * addOrder(uid, out_trade_no, tp, tp_id, fee, platform) {
    const now_ts = new Date().getTime();
    const [insert_id, effect_row] = yield Conn.query(
        'insert ignore into order_info set uid=?,out_trade_no=?,tp=?,tp_id=?,fee=?,pay_pt=?,create_ts=?',
        {replacements: [uid, out_trade_no, tp, tp_id, fee, platform, now_ts], type: Sequelize.QueryTypes.INSERT});
    return insert_id;
}

module.exports = {
    addOrder
};