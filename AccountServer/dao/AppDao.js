function * findByAppKey(appKey) {
    return yield Conn.query(
        'select * from app where app_key=? limit 1', {replacements: [appKey], type: Sequelize.QueryTypes.SELECT});
}

module.exports = {
    findByAppKey
};