function * addToken(uid, token, scope) {
    const createTs = new Date().getTime();
    const expiredTs = createTs + Config.expiredTokenInTs;
    const [insertId, affectedRows] = yield Conn.query('insert ignore into refresh_token set uid=?,token=?,scope=?,create_ts=?,expired_ts=?',
        {replacements: [uid, token, scope, createTs, expiredTs], type: Sequelize.QueryTypes.INSERT});
    return insertId;
}

function * getToken(uid, token, scope) {
    return yield Conn.query('select * from refresh_token where uid=? and token=? and scope=? order by token_id desc limit 1',
        {replacements: [uid, token, scope], type: Sequelize.QueryTypes.SELECT});
}

function updateExpiredTs(uid, token, ts) {
    Conn.query("update refresh_token set expired_ts=? where uid=? and token=?",
        {replacements: [ts, uid, token], type: Sequelize.QueryTypes.UPDATE});
}

module.exports = {
    addToken, getToken, updateExpiredTs
};