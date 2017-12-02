function * addLike(uid, comment_id) {
    const [insert_id, affected_rows] = yield Conn.query(
        'insert ignore into comment_like set uid=?,comment_id=?,create_ts=?',
        {replacements: [uid, comment_id, new Date().getTime()], type: Sequelize.QueryTypes.INSERT});
    return insert_id;
}

function * deleteLike(uid, comment_id) {
    yield Conn.query('delete from comment_like where uid=? and comment_id=?',
        {replacements: [uid, comment_id], type: Sequelize.QueryTypes.UPDATE});
}

module.exports = {
    addLike, deleteLike
};