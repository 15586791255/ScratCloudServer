function * getBettingItem(betting_id) {
    return yield Conn.query('select * from betting_item where delete_ts=0 and betting_id=?',
        {replacements: [betting_id], type: Sequelize.QueryTypes.SELECT});

}

module.exports = {
    getBettingItem
};