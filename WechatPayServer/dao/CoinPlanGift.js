function * getCoinPlanGift(uid) {
    return yield Conn.query('select coin_plan_id,total_gift from coin_plan_gift where uid=? group by coin_plan_id',
        {replacements: [uid], type: Sequelize.QueryTypes.SELECT});
}

module.exports = {
    getCoinPlanGift
};