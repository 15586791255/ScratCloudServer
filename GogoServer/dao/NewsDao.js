function * getNews(news_id, size) {
    if (news_id > 0) {
        return yield Conn.query('select * from news where news_id<? order by news_id desc limit ?',
            {replacements: [news_id, size], type: Sequelize.QueryTypes.SELECT});
    }

    return yield Conn.query('select * from news order by news_id desc limit ?',
        {replacements: [size], type: Sequelize.QueryTypes.SELECT});
}

function * getNewsDetail(news_id) {
    return yield Conn.query('select * from news where news_id=? limit 1',
        {replacements: [news_id], type: Sequelize.QueryTypes.SELECT});
}

module.exports = {
    getNews, getNewsDetail
};