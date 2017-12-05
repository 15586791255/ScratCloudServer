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

function * getLikeCounts(comment_ids) {
    const res = {};
    if (comment_ids.length == 0) {
        return res;
    }
    const place_holder = Utils.getSqlPlaceHolder(comment_ids.length);
    const total_like = yield Conn.query(
        `select comment_id,count(1) as total from comment_like where comment_id in (${place_holder}) group by comment_id`,
        {replacements: comment_ids, type: Sequelize.QueryTypes.SELECT});
    for (let item of total_like) {
        res[item.comment_id] = item.total;
    }
    return res;
}

function * isLikeSet(uid, comment_ids) {
    const res = new Set();
    if (comment_ids.length == 0) {
        return res;
    }
    if (!uid) {
        return res;
    }
    const place_holder = Utils.getSqlPlaceHolder(comment_ids.length);
    comment_ids.push(uid);
    const comment_id_datas = yield Conn.query(
        `select comment_id from comment_like where comment_id in (${place_holder}) and uid=?`,
        {replacements: comment_ids, type: Sequelize.QueryTypes.SELECT});
    for (let item of comment_id_datas) {
        res.add(item.comment_id);
    }
    return res;
}

function * isLike(uid, comment_id) {
    if (!uid) {
        return false;
    }
    const [count] = yield Conn.query(
        `select count(1) as total from comment_like where comment_id=? and uid=?`,
        {replacements: [comment_id, uid], type: Sequelize.QueryTypes.SELECT});
    if (count) {
        return count.total > 0;
    }
    return false;
}

module.exports = {
    addLike, deleteLike, getLikeCounts, isLike, isLikeSet
};