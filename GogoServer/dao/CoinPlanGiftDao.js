function * getCoinPlanGiftMap(uid) {
    const data = yield Conn.query('select coin_plan_id,total_gift from coin_plan_gift where uid=? group by coin_plan_id',
        {replacements: [uid], type: Sequelize.QueryTypes.SELECT});
    const res = {};
    for (let item of data) {
        res[item.coin_plan_id] = item.total_gift;
    }
    return res;
}

module.exports = {
    getCoinPlanGiftMap
};