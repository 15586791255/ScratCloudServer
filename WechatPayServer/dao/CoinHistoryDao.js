function * addCoinHistory(uid, coin, tp, tp_id) {
    yield Conn.query('insert ignore into coin_history set uid=?,coin_count=?,tp=?,tp_id=?,create_ts=?',
        {replacements: [uid, coin, tp, tp_id, new Date().getTime()], type: Sequelize.QueryTypes.INSERT});
}

module.exports = {
    addCoinHistory
};