function * getTotalOrders(goods_id) {
    return yield Conn.query(
        'select count(1) as total from goods_order where delete_ts=0 and goods_id=?',
        {replacements: [goods_id], type: Sequelize.QueryTypes.SELECT}
    );
}

module.exports = {
    getTotalOrders
};