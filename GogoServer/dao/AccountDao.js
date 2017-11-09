function * findByUid(uid) {
    return yield Conn.query(
        'select * from account where uid=? limit 1', {replacements: [uid], type: Sequelize.QueryTypes.SELECT});
}

function updateAccount(uid, avatar, gender, username) {
    Conn.query('update account set avatar=?, gender=?, username=? where uid=?',
        {replacements: [avatar, gender, username, uid], type: Sequelize.QueryTypes.UPDATE})
}

module.exports = {
    findByUid, updateAccount
};