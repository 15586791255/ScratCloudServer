function * getTotalOrders(goods_id) {
    return yield Conn.query(
        'select count(1) as total from goods_order where delete_ts=0 and goods_id=?',
        {replacements: [goods_id], type: Sequelize.QueryTypes.SELECT}
    );
}

function * getTotalBuy(goods_id, uid) {
    return yield Conn.query(
        'select count(1) as total from goods_order where delete_ts=0 and goods_id=? and uid=?',
        {replacements: [goods_id, uid], type: Sequelize.QueryTypes.SELECT}
    );
}

module.exports = {
    getTotalOrders, getTotalBuy
};