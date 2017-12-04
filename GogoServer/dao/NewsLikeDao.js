function * addLike(uid, news_id) {
    const [insert_id, affected_rows] = yield Conn.query('insert ignore into news_like set uid=?,news_id=?,create_ts=?',
        {replacements: [uid, news_id, new Date().getTime()], type: Sequelize.QueryTypes.INSERT});
    return insert_id;
}

function * deleteLike(uid, news_id) {
    yield Conn.query('delete from news_like where uid=? and news_id=?',
        {replacements: [uid, news_id], type: Sequelize.QueryTypes.UPDATE});
}

function * getTotalLike(news_ids) {
    const res = {};
    if (news_ids.length == 0) {
        return res;
    }
    const place_holder = Utils.getSqlPlaceHolder(news_ids.length);
    const total_like = yield Conn.query(
        `select news_id,count(1) as total from news_like where news_id in (${place_holder}) group by news_id`,
        {replacements: news_ids, type: Sequelize.QueryTypes.SELECT});
    for (let item of total_like) {
        res[item.news_id] = item.total;
    }
    return res;
}

function * getTotalLikeById(news_id) {
    const [count] = yield Conn.query(
        `select count(1) as total from news_like where news_id=?`,
        {replacements: [news_id], type: Sequelize.QueryTypes.SELECT});
    if (count) {
        return count.total;
    }
    return 0;
}

function * isLike(news_id, uid) {
    if (!uid) {
        return false;
    }
    const [count] = yield Conn.query(
        `select count(1) as total from news_like where news_id=? and uid=?`,
        {replacements: [news_id, uid], type: Sequelize.QueryTypes.SELECT});
    if (count) {
        return count.total > 0;
    }
    return false;
}

module.exports = {
    addLike, deleteLike, getTotalLike, getTotalLikeById, isLike
};