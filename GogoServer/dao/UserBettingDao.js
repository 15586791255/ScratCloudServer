function * getUserBettingCoin(uid, betting_item_id) {
    return yield Conn.query('select sum(coin) as total from user_betting where uid=? and betting_item_ids=?',
        {replacements: [uid, betting_item_id], type: Sequelize.QueryTypes.SELECT});
}

function * addUserBetting(uid, betting_item_ids, coin, odds) {
    const [insert_id, affected_rows] = yield Conn.query(
        'insert ignore into user_betting set uid=?,betting_item_ids=?,coin=?,create_ts=?, odds=?',
        {replacements: [uid, betting_item_ids.join(','), coin, new Date().getTime(), odds], type: Sequelize.QueryTypes.INSERT});
    return insert_id;
}

function * getUserBetting(uid, user_betting_id, size) {
    if (!user_betting_id || user_betting_id == 0) {
        return yield Conn.query(
            'select * from user_betting where uid=? order by user_betting_id desc limit ?',
            {replacements: [uid, size], type: Sequelize.QueryTypes.SELECT})
    }

    return yield Conn.query(
        'select * from user_betting where uid=? and user_betting_id<? order by user_betting_id desc limit ?',
        {replacements: [uid, user_betting_id, size], type: Sequelize.QueryTypes.SELECT})
}

module.exports = {
    getUserBettingCoin, addUserBetting, getUserBetting
};