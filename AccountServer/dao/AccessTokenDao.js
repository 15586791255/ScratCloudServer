function * addToken(uid, token, scope) {
    const createTs = new Date().getTime();
    const expiredTs = createTs + Config.expiredTokenInTs;
    const [insertId, affectedRows] = yield Conn.query('insert ignore into access_token set uid=?,token=?,scope=?,create_ts=?,expired_ts=?',
        {replacements: [uid, token, scope, createTs, expiredTs], type: Sequelize.QueryTypes.INSERT});
    return insertId;
}

function updateExpiredTs(uid, token, ts) {
    Conn.query("update access_token set expired_ts=? where uid=? and token=?",
        {replacements: [ts, uid, token], type: Sequelize.QueryTypes.UPDATE});
}

module.exports = {
    addToken, updateExpiredTs
};