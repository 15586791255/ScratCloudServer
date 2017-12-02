function * addLike(uid, news_id) {
    const [insert_id, affected_rows] = yield Conn.query('insert ignore into news_like set uid=?,news_id=?,create_ts=?',
        {replacements: [uid, news_id, new Date().getTime()], type: Sequelize.QueryTypes.INSERT});
    return insert_id;
}

module.exports = {
    addLike
};