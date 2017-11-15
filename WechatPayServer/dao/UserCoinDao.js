function * findByUid(uid) {
    return yield Conn.query(
        'select * from user_coin where uid=? limit 1', {replacements: [uid], type: Sequelize.QueryTypes.SELECT});
}

function * addCoin(uid, coin) {
    yield Conn.query('update user_coin set coin_count=coin_count+? where uid=?',
        {replacements: [coin, uid], type: Sequelize.QueryTypes.UPDATE});
}

function * addUserCoin(uid, coin_count) {
    yield Conn.query('insert ignore into user_coin set uid=?,coin_count=?,create_ts=?',
        {replacements: [uid, coin_count, new Date().getTime()], type: Sequelize.QueryTypes.INSERT});
}

module.exports = {
    findByUid, addCoin, addUserCoin
};