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

module.exports = {
    getNews, getNewsDetail
};