const NewsDao = require('../dao/NewsDao');
const CommentDao = require('../dao/CommentDao');

const getNews = (req, res) => {
    let {index, size} = req.query;
    if (!index) {
        index = 0
    } else if (index < 0) {
        return BaseRes.success(res, {index: -1, items: []});
    }

    if (!size) {
        size = 20;
    } else if (size > 60) {
        size = 60;
    } else if (size <= 0) {
        return BaseRes.success(res, {index: -1, items: []});
    }

    Co(function *() {
        const newsList = yield NewsDao.getNews(index, parseInt(size));
        let min_index = index;
        for (let item of newsList) {
            delete item.body;
            delete item.url;
            const [comment_count] = yield CommentDao.getTotalComment('news', item.news_id);
            item.comment_count = parseInt(comment_count.total);
            if (min_index == 0 || min_index > item.news_ts) {
                min_index = item.news_ts;
            }
        }
        if (newsList.length < size) {
            min_index = -1;
        }
        BaseRes.success(res, {index: min_index, items: newsList});
    });
};

const getNewsDetail = (req, res) => {
    const {news_id} = req.params;
    Co(function *() {
        const [news] = yield NewsDao.getNewsDetail(news_id);
        if (!news) {
            return BaseRes.notFoundError(res);
        }
        const [comment_count] = yield CommentDao.getTotalComment('news', news_id);
        news.comment_count = parseInt(comment_count.total);
        BaseRes.success(res, news);
    });
};

module.exports = {
    getNews, getNewsDetail
};