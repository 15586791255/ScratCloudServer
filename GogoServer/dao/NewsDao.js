function * getNews(news_ts, size, game) {
    if (news_ts > 0) {
        return yield Conn.query('select * from news where news_ts<? and game=? order by news_ts desc limit ?',
            {replacements: [news_ts, game, size], type: Sequelize.QueryTypes.SELECT});
    }

    return yield Conn.query('select * from news where game=? order by news_ts desc limit ?',
        {replacements: [game, size], type: Sequelize.QueryTypes.SELECT});
}

function * getNewsDetail(news_id) {
    return yield Conn.query('select * from news where news_id=? limit 1',
        {replacements: [news_id], type: Sequelize.QueryTypes.SELECT});
}

function * getRecommend(news_id, tp, game) {
    if (news_id <= 0) {
        return yield Conn.query(
            'select * from news where video="" and game=? order by news_ts desc limit 30',
            {replacements: [game], type: Sequelize.QueryTypes.SELECT});
    }
    return yield Conn.query(
        'select * from news where news_id!=? and tp=? and video="" and game=? order by news_ts desc limit 30',
        {replacements: [news_id, tp, game], type: Sequelize.QueryTypes.SELECT});
}

module.exports = {
    getNews, getNewsDetail, getRecommend
};