function * getUserCoin(uid) {
    return yield Conn.query('select * from user_coin where uid=? limit 1',
        {replacements: [uid], type: Sequelize.QueryTypes.SELECT});
}

function updateUserCoin(uid, coin) {
    Conn.query('update user_coin set coin_count=? where uid=?',
        {replacements: [coin, uid], type: Sequelize.QueryTypes.UPDATE});
}

module.exports = {
    getUserCoin, updateUserCoin
};