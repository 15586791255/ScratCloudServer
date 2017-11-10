function * getBetting(race_id) {
    return yield Conn.query('select * from betting where delete_ts=0 and race_id=?',
        {replacements: [race_id], type: Sequelize.QueryTypes.SELECT});
}

module.exports = {
    getBetting
};