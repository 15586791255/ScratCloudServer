function * findByUid(uid) {
    return yield Conn.query(
        'select * from user_coin where uid=? limit 1', {replacements: [uid], type: Sequelize.QueryTypes.SELECT});
}

function * decreaseCoin(uid, coin) {
    yield Conn.query('update user_coin set coin_count=coin_count-? where uid=?',
        {replacements: [coin, uid], type: Sequelize.QueryTypes.UPDATE});
}

module.exports = {
    findByUid, decreaseCoin
};