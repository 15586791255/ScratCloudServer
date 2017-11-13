function * getCoinPlan(coin_plan_id) {
    return yield Conn.query('select * from coin_plan where coin_plan_id=? limit 1',
        {replacements: [coin_plan_id], type: Sequelize.QueryTypes.SELECT});
}

module.exports = {
    getCoinPlan
};