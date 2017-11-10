function * getBetting(race_id) {
    return yield Conn.query('select * from betting where delete_ts=0 and race_id=?',
        {replacements: [race_id], type: Sequelize.QueryTypes.SELECT});
}

function * getBettingDetail(betting_id) {
    return yield Conn.query('select * from betting where delete_ts=0 and betting_id=? limit 1',
        {replacements: [betting_id], type: Sequelize.QueryTypes.SELECT});
}

module.exports = {
    getBetting, getBettingDetail
};