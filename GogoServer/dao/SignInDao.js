function * addSignIn(uid) {
    const now_date = new Date();
    const create_ts = now_date.getTime();
    const dt = now_date.format('yyyyMMdd');
    const [insert_id, affected_rows] = yield Conn.query(
        'insert ignore into sign_in set uid=?,dt=?,create_ts=?',
        {replacements: [uid, dt, create_ts], type: Sequelize.QueryTypes.INSERT});
    return insert_id > 0;
}

function * hasSign(uid) {
    const now_date = new Date();
    const dt = now_date.format('yyyyMMdd');
    const [data] = yield Conn.query(
        'select count(1) as total from sign_in where uid=? and dt=?',
        {replacements: [uid, dt], type: Sequelize.QueryTypes.SELECT});
    if (data && data.length > 0 && data[0].total > 0) {
        return true;
    }
    return false;
}

function * getSignDetail(uid, ts) {
    return yield Conn.query(
        'select dt from sign_in where uid=? and create_ts>? order by create_ts desc',
        {replacements: [uid, ts], type: Sequelize.QueryTypes.SELECT});
}

module.exports = {
    addSignIn, hasSign, getSignDetail
};