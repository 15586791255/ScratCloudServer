function * getCoinPlanGift(uid) {
    return yield Conn.query('select coin_plan_id,total_gift from coin_plan_gift where uid=? group by coin_plan_id',
        {replacements: [uid], type: Sequelize.QueryTypes.SELECT});
}

function * getCoinPlanGiftDetail(uid, coin_plan_id) {
    return yield Conn.query('select * from coin_plan_gift where uid=? and coin_plan_id=? limit 1',
        {replacements: [uid, coin_plan_id], type: Sequelize.QueryTypes.SELECT});
}

function * updateTotalGift(uid, coin_plan_id, total_gift) {
    yield Conn.query('update coin_plan_gift set total_gift=? where uid=? and coin_plan_id=?',
        {replacements: [total_gift, uid, coin_plan_id], type: Sequelize.QueryTypes.UPDATE});
}

function * addTotalGift(uid, coin_plan_id, total_gift) {
    const now = new Date().getTime();
    yield Conn.query('insert ignore into coin_plan_gift set uid=?, coin_plan_id=?, total_gift=?, create_ts=?',
        {replacements: [uid, coin_plan_id, total_gift, now]})
}

module.exports = {
    getCoinPlanGift, getCoinPlanGiftDetail, updateTotalGift, addTotalGift
};