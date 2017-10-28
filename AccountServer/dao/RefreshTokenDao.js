function * addToken(uid, token, scope) {
    const createTs = new Date().getTime();
    const expiredTs = createTs + Config.expiredTokenInTs;
    const [insertId, affectedRows] = yield Conn.query('insert ignore into refresh_token set uid=?,token=?,scope=?,create_ts=?,expired_ts=?',
        {replacements: [uid, token, scope, createTs, expiredTs], type: Sequelize.QueryTypes.INSERT});
    return insertId;
}

module.exports = {
    addToken
};