function * getBettingItem(betting_id) {
    return yield Conn.query('select * from betting_item where delete_ts=0 and betting_id=?',
        {replacements: [betting_id], type: Sequelize.QueryTypes.SELECT});

}

function * getBettingItemDetail(betting_item_id) {
    return yield Conn.query('select * from betting_item where betting_item_id=? limit 1',
        {replacements: [betting_item_id], type: Sequelize.QueryTypes.SELECT});
}

module.exports = {
    getBettingItem, getBettingItemDetail
};