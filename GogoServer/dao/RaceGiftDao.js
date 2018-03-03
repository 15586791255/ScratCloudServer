function * getRaceGift(race_id, team_id) {
    const data = yield Conn.query('select coin_plan_id,total_gift from race_gift where race_id=? and team_id=? group by coin_plan_id',
        {replacements: [race_id, team_id], type: Sequelize.QueryTypes.SELECT});
    const res = {};
    for (let item of data) {
        res[item.coin_plan_id] = item.total_gift;
    }
    return res;
}

module.exports = {
    getRaceGift
};