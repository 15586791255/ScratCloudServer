function * getRaceGiftMap(race_id, team_id) {
    const data = yield Conn.query('select coin_plan_id,total_gift from race_gift where race_id=? and team_id=? group by coin_plan_id',
        {replacements: [race_id, team_id], type: Sequelize.QueryTypes.SELECT});
    const res = {};
    for (let item of data) {
        res[item.coin_plan_id] = item.total_gift;
    }
    return res;
}

function * addRaceGift(race_id, team_id, coin_plan_id, total_gift) {
    yield Conn.query('insert ignore into race_gift set race_id=?, team_id=?, coin_plan_id=?, total_gift=?, create_ts=?',
        {
            replacements: [race_id, team_id, coin_plan_id, total_gift, new Date().getTime()],
            type: Sequelize.QueryTypes.INSERT
        });
}

function * updateRaceGift(race_id, team_id, coin_plan_id, total_gift) {
    yield Conn.query('update race_gift set total_gift=? where race_id=? and team_id=? and coin_plan_id=?',
        {
            replacements: [total_gift, race_id, team_id, coin_plan_id],
            type: Sequelize.QueryTypes.UPDATE
        });
}

function * getRaceTotalGift(race_id, team_id, coin_plan_id) {
    return yield Conn.query('select total_gift from race_gift where race_id=? and team_id=? and coin_plan_id=? limit 1',
        {
            replacements: [race_id, team_id, coin_plan_id],
            type: Sequelize.QueryTypes.SELECT
        })
}

module.exports = {
    getRaceGiftMap, addRaceGift, updateRaceGift, getRaceTotalGift
};