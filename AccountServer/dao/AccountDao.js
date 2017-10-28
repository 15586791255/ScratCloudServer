function * findByUid(uid) {
    return yield Conn.query(
        'select * from account where uid=? limit 1', {replacements: [uid], type: Sequelize.QueryTypes.SELECT});
}

function * findByAccountId(accountId) {
    return yield Conn.query(
        'select * from account where account_id=? limit 1',
        {replacements: [accountId], type: Sequelize.QueryTypes.SELECT});
}

function * findByAppIdAndTel(appId, tel) {
    return yield Conn.query(
        'select * from account where app_id=? and tel=? limit 1',
        {replacements: [appId, tel], type: Sequelize.QueryTypes.SELECT});
}

function * addAccount(appId, tel, wxOpenId, username, pwd, gender) {
    const uid = Utils.rand(8);
    const nowTs = new Date().getTime();
    const [insertId, affectedRows] = yield Conn.query(
        'insert ignore into account set app_id=?,uid=?,tel=?,wx_openid=?,username=?,pwd=?,gender=?,create_ts=?',
        {replacements: [appId, uid, tel, wxOpenId, username, pwd, gender, nowTs], type: Sequelize.QueryTypes.INSERT});

    return insertId;
}

module.exports = {
    findByUid, findByAppIdAndTel, addAccount, findByAccountId
};