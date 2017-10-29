function * findByUid(uid) {
    return yield Conn.query(
        'select * from account where uid=? limit 1', {replacements: [uid], type: Sequelize.QueryTypes.SELECT});
}

module.exports = {
    findByUid
};