const NewsDao = require('../dao/NewsDao');
const CommentDao = require('../dao/CommentDao');
const NewsLikeDao = require('../dao/NewsLikeDao');
const AccessTokenDao = require('../dao/AccessTokenDao');

const getNews = (req, res) => {
    let {index, size, game} = req.query;
    if (!game) {
        game = 'wangzhe';
    }

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
        const newsList = yield NewsDao.getNews(index, parseInt(size), game);
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

const addLike = (req, res) => {
    const {app_key, pt, uid, access_token} = req.headers;
    const {news_id} = req.body;
    Co(function *() {
        const [token] = yield AccessTokenDao.getToken(uid, access_token);
        if (!token) {
            return BaseRes.tokenError(res);
        }

        const now_ts = new Date().getTime();
        if (token.expired_ts < now_ts) {
            return BaseRes.tokenError(res);
        }

        yield NewsLikeDao.addLike(uid, news_id);
        BaseRes.success(res);
    });

};

module.exports = {
    getNews, getNewsDetail, addLike
};