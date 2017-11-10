function * getUserBettingCoin(uid, betting_item_id) {
    return yield Conn.query('select sum(coin) as total from user_betting where uid=? and betting_item_id=?',
        {replacements: [uid, betting_item_id], type: Sequelize.QueryTypes.SELECT});
}

module.exports = {
    getUserBettingCoin
};