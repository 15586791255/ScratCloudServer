function * getCoinPlanGiftMap(uid) {
    const data = yield Conn.query('select coin_plan_id,total_gift from coin_plan_gift where uid=? group by coin_plan_id',
        {replacements: [uid], type: Sequelize.QueryTypes.SELECT});
    const res = {};
    for (let item of data) {
        res[item.coin_plan_id] = item.total_gift;
    }
    return res;
}

function * getTotalCoinPlanGift(uid, coin_plan_id) {
    return yield Conn.query('select total_gift from coin_plan_gift where uid=? and coin_plan_id=? limit 1',
        {replacements: [uid, coin_plan_id], type: Sequelize.QueryTypes.SELECT});
}

function * updateCoinPlanGift(uid, coin_plan_id, total_gift) {
    yield Conn.query('update coin_plan_gift set total_gift=? where uid=? and coin_plan_id=?',
        {replacements: [total_gift, uid, coin_plan_id], type: Sequelize.QueryTypes.UPDATE})
}

module.exports = {
    getCoinPlanGiftMap, getTotalCoinPlanGift, updateCoinPlanGift
};