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

module.exports = {
    getRaces
};