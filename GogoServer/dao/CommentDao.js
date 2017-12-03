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

function * getComments(comment_id, tp, target_id, size) {
    if (comment_id > 0) {
        return yield Conn.query('select * from comment where comment_id<? and tp=? and target_id=? order by comment_id desc limit ?',
            {replacements: [comment_id, tp, target_id, size], type: Sequelize.QueryTypes.SELECT});
    }

    return yield Conn.query('select * from comment where tp=? and target_id=? order by comment_id desc limit ?',
        {replacements: [tp, target_id, size], type: Sequelize.QueryTypes.SELECT});
}

function * getTotalComment(tp, target_id) {
    return yield Conn.query('select count(1) as total from comment where tp=? and target_id=?',
        {replacements: [tp, target_id], type: Sequelize.QueryTypes.SELECT});
}

function * getTotalComments(tp, target_ids) {
    const res = {};
    if (target_ids.length == 0) {
        return res;
    }
    const place_holder = Utils.getSqlPlaceHolder(target_ids.length);
    const replacements = target_ids;
    replacements.push(tp);
    const total_comments = yield Conn.query(
        `select target_id,count(1) as total from comment where target_id in (${place_holder}) and tp=? group by target_id`,
        {replacements: replacements, type: Sequelize.QueryTypes.SELECT});
    for (let item of total_comments) {
        total_comments[item.target_id] = item.total;
    }
    return res;
}

module.exports = {
    addComment, getComment, getComments, getTotalComment, getTotalComments
};