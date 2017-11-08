function addHistory(uid, coin, tp, tp_id) {
    const now_ts = new Date().getTime();
    Conn.query('insert ignore into coin_history set uid=?,coin_count=?,tp=?,tp_id=?,create_ts=?',
        {replacements: [uid, coin, tp, tp_id, now_ts], type: Sequelize.QueryTypes.INSERT});
}

module.exports = {
    addHistory
};