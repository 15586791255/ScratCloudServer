function * addCoinHistory(uid, coin_count, tp, tp_id) {
    const [insert_id, affected_rows] = yield Conn.query(
        'insert ignore into coin_history set uid=?,coin_count=?,tp=?,tp_id=?,create_ts=?',
        {replacements: [uid, coin_count, tp, tp_id, new Date().getTime()], type: Sequelize.QueryTypes.INSERT});
    return insert_id;
}

module.exports = {
    addCoinHistory
};