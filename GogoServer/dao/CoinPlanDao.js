function * getPlans() {
    return yield Conn.query('select * from coin_plan where delete_ts=0 order by fee asc',
        {type: Sequelize.QueryTypes.SELECT});
}

function * getGiftNameMap() {
    const data = yield Conn.query('select coin_plan_id, gift_name from coin_plan where delete_ts=0',
        {type: Sequelize.QueryTypes.SELECT});
    const res = {};
    console.log(data);
    for (let item of data) {
        console.log(item);
        const {coin_plan_id, gift_name} = item;
        res[coin_plan_id] = gift_name;
    }
    console.log(res);
    return res;
}

module.exports = {
    getPlans, getGiftNameMap
};