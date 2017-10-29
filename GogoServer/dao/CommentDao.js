function * addComment(uid, target_id, replay_comment_id, tp, content) {
    const create_ts = new Date().getTime();
    const [insert_id, affected_rows] = yield Conn.query(
        'insert ignore into comment set uid=?,target_id=?,replay_comment_id=?,tp=?,content=?,create_ts=?',
        {replacements: [uid, target_id, replay_comment_id, tp, content, create_ts], type: Sequelize.QueryTypes.INSERT});
    return insert_id;
}

function * getComment(comment_id) {
    return yield Conn.query('select * from comment where comment_id=? limit 1',
        {replacements: [comment_id], type: Sequelize.QueryTypes.SELECT});
}

module.exports = {
    addComment, getComment
};