function * getPlans() {
    return yield Conn.query('select * from coin_plan where delete_ts=0 order by fee asc',
        {type: Sequelize.QueryTypes.SELECT});
}

module.exports = {
    getPlans
};