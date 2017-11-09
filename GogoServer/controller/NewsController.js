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
        let minIndex = index;
        for (let item of newsList) {
            delete item.body;
            delete item.url;
            const [comment_count] = yield CommentDao.getTotalComment('news', item.news_id);
            item.comment_count = parseInt(comment_count.total);
            if (minIndex == 0 || minIndex > item.news_id) {
                minIndex = item.news_id;
            }
        }
        if (newsList.length < size) {
            minIndex = -1;
        }
        BaseRes.success(res, {index: minIndex, items: newsList});
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