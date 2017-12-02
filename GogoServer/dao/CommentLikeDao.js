function * addLike(uid, comment_id) {
    const [insert_id, affected_rows] = yield Conn.query(
        'insert ignore into comment_like set uid=?,comment_id=?,create_ts=?',
        {replacements: [uid, comment_id, new Date().getTime()], type: Sequelize.QueryTypes.INSERT});
    return insert_id;
}

module.exports = {
    addLike
};