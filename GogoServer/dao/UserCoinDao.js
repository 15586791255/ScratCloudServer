function * findByUid(uid) {
    return yield Conn.query(
        'select * from user_coin where uid=? limit 1', {replacements: [uid], type: Sequelize.QueryTypes.SELECT});
}

function * decreaseCoin(uid, coin) {
    yield Conn.query('update user_coin set coin_count=coin_count-? where uid=?',
        {replacements: [coin, uid], type: Sequelize.QueryTypes.UPDATE});
}

function * addCoin(uid, coin) {
    yield Conn.query('update user_coin set coin_count=coin_count+? where uid=?',
        {replacements: [coin, uid], type: Sequelize.QueryTypes.UPDATE});
}

function * createCoin(uid, coin) {
    yield Conn.query('insert ignore into user_coin set uid=?,coin_count=?',
        {replacements: [uid, coin], type: Sequelize.QueryTypes.INSERT});
}

module.exports = {
    findByUid, decreaseCoin, addCoin, createCoin
};