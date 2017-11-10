function * getUserBettingCoin(uid, betting_item_id) {
    return yield Conn.query('select sum(coin) as total from user_betting where uid=? and betting_item_id=?',
        {replacements: [uid, betting_item_id], type: Sequelize.QueryTypes.SELECT});
}

function * addUserBetting(uid, betting_item_id, coin) {
    const [insert_id, affected_rows] = yield Conn.query(
        'insert ignore into user_betting set uid=?,betting_item_id=?,coin=?,create_ts=?',
        {replacements: [uid, betting_item_id, coin, new Date().getTime()], type: Sequelize.QueryTypes.INSERT});
    return insert_id;
}

module.exports = {
    getUserBettingCoin, addUserBetting
};