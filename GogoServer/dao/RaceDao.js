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
    return yield Conn.query(`select * from race where dt in (${place_holder}) order by race_ts desc`,
        {replacements: dt_list, type: Sequelize.QueryTypes.SELECT})
}

function * getRaceDtList() {
    return yield Conn.query('select distinct dt from race order by dt desc', {type: Sequelize.QueryTypes.SELECT});
}

function * getRaceDetail(race_id) {
    return yield Conn.query('select * from race where race_id=? limit 1', 
        {replacements: [race_id], type: Sequelize.QueryTypes.SELECT});
}

module.exports = {
    getRaces, getRaceDtList, getRacesByDt, getRaceDetail
};