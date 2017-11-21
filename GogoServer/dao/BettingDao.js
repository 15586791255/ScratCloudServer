function * getBetting(race_id) {
    return yield Conn.query('select * from betting where delete_ts=0 and race_id=?',
        {replacements: [race_id], type: Sequelize.QueryTypes.SELECT});
}

function * getBettings(race_id, tp) {
    return yield Conn.query('select * from betting where delete_ts=0 and race_id=? and tp=?',
        {replacements: [race_id, tp], type: Sequelize.QueryTypes.SELECT});
}

function * getBettingDetail(betting_id) {
    return yield Conn.query('select * from betting where delete_ts=0 and betting_id=? limit 1',
        {replacements: [betting_id], type: Sequelize.QueryTypes.SELECT});
}

function * getBettingTps(race_id) {
    const tps = yield Conn.query('select distinct(tp) as tp from betting where delete_ts=0 and race_id=?',
        {replacements: [race_id], type: Sequelize.QueryTypes.SELECT});
    const res_tps = [];
    if (tps) {
        for (let tp of tps) {
            res_tps.push(tp.tp);
        }
    }
    return res_tps;
}

module.exports = {
    getBetting, getBettingDetail, getBettingTps, getBettings
};