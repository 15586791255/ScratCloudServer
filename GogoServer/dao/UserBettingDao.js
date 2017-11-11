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

module.exports = {
    getUserBettingCoin, addUserBetting
};