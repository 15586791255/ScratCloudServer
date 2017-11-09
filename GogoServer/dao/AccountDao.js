function * findByUid(uid) {
    return yield Conn.query(
        'select * from account where uid=? limit 1', {replacements: [uid], type: Sequelize.QueryTypes.SELECT});
}

function updateAccount(uid, avatar, gender, username) {
    const now_ts = new Date().getTime();
    Conn.query('update account set avatar=?, gender=?, username=?, update_ts=? where uid=?',
        {replacements: [avatar, gender, username, now_ts, uid], type: Sequelize.QueryTypes.UPDATE})
}

module.exports = {
    findByUid, updateAccount
};