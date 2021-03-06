function * getRaces(race_id, size, status) {
    const replacements = [];
    let sql = 'select * from race where 1=1';

    if (race_id > 0) {
        sql += ' and race_id<?';
        replacements.push(race_id);
    }

    if (status && status != '') {
        sql += ' and status=?';
        replacements.push(status);
    }

    sql += ' order by race_id desc limit ?';
    replacements.push(size);

    return yield Conn.query(sql, {replacements: replacements, type: Sequelize.QueryTypes.SELECT});
}

function * getRacesByDt(dt_list) {
    if (!dt_list || dt_list.length == 0) {
        return [];
    }
    const place_holder = Utils.getSqlPlaceHolder(dt_list.length);
    return yield Conn.query(`select * from race where dt in (${place_holder}) and race_info_id in (select distinct race_info_id from race_info where race_name like '王者%') order by race_ts desc`,
        {replacements: dt_list, type: Sequelize.QueryTypes.SELECT})
}

function * getTotalRace() {
    const [count] = yield Conn.query('select count(1) as total from race', {type: Sequelize.QueryTypes.SELECT});
    if (count) {
        return count.total;
    }
    return 0;
}

function * getRaceDtList() {
    return yield Conn.query(
        "select distinct dt from race where race_info_id in (select distinct race_info_id from race_info where race_name like '王者%') order by dt desc",
        {type: Sequelize.QueryTypes.SELECT});
}

function * getRaceDetail(race_id) {
    return yield Conn.query('select * from race where race_id=? limit 1', 
        {replacements: [race_id], type: Sequelize.QueryTypes.SELECT});
}

function * getHotRaces() {
    return yield Conn.query('select * from race where is_hot=1 and delete_ts=0', {type: Sequelize.QueryTypes.SELECT});
}

module.exports = {
    getRaces, getRaceDtList, getRacesByDt, getRaceDetail, getTotalRace, getHotRaces
};