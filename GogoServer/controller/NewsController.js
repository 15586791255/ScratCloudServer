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
        const news_list = yield NewsDao.getNews(index, parseInt(size), game);
        let news_ids = [];
        for (let item of news_list) {
            news_ids.push(item.news_id);
        }
        const total_likes = yield NewsLikeDao.getTotalLike(news_ids);
        const total_comments = yield CommentDao.getTotalComments('news', news_ids);
        let min_index = index;
        for (let item of news_list) {
            delete item.body;
            delete item.url;
            // const [comment_count] = yield CommentDao.getTotalComment('news', item.news_id);
            let comment_count = 0;
            if (total_comments[item.news_id]) {
                comment_count = total_comments[item.news_id];
            }
            item.comment_count = parseInt(comment_count);
            let like_count = 0;
            if (total_likes[item.news_id]) {
                like_count = total_likes[item.news_id];
            }
            item.like_count = parseInt(like_count);
            if (min_index == 0 || min_index > item.news_ts) {
                min_index = item.news_ts;
            }
        }
        if (news_list.length < size) {
            min_index = -1;
        }
        BaseRes.success(res, {index: min_index, items: news_list});
    });
};

const getNewsDetail = (req, res) => {
    const {app_key, pt, uid, access_token} = req.headers;
    const {news_id} = req.params;
    Co(function *() {
        const [news] = yield NewsDao.getNewsDetail(news_id);
        if (!news) {
            return BaseRes.notFoundError(res);
        }
        const like_count = yield NewsLikeDao.getTotalLikeById(news_id);
        const is_like = yield NewsLikeDao.isLike(news_id, uid);
        const [comment_count] = yield CommentDao.getTotalComment('news', news_id);
        news.comment_count = parseInt(comment_count.total);
        news.like_count = parseInt(like_count);
        news.is_like = is_like;
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

const unLike = (req, res) => {
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

        yield NewsLikeDao.deleteLike(uid, news_id);
        BaseRes.success(res);
    });
};


const randomizeArray = (arr) => {
    var output = [];
    while (arr.length) {
        output.push(arr.splice(Math.floor(Math.random() * arr.length), 1)[0]);
    }
    return output;
};

const getRecommendNews = (recommend_news, max_count) => {
    if (recommend_news.length <= max_count) {
        return recommend_news;
    }

    const news = [];
    recommend_news = randomizeArray(recommend_news);
    let i = 0;
    for (let item of recommend_news) {
        i ++;
        if (i > max_count) {
            return news;
        }
        news.push(item);
    }
    return news;
};

const recommend = (req, res) => {
    const {news_id, game} = req.params;
    Co(function *() {
        const [news] = yield NewsDao.getNewsDetail(news_id);
        let recommend_news = [];
        if (news) {
            const db_recommend_news = yield NewsDao.getRecommend(news.news_id, news.tp, game);
            recommend_news = getRecommendNews(db_recommend_news, 3);
        } else {
            recommend_news = yield NewsDao.getNews(0, 3, game);
        }

        const news_ids = [];
        for (let item of recommend_news) {
            news_ids.push(item.news_id);
        }
        const total_likes = yield NewsLikeDao.getTotalLike(news_ids);
        const total_comments = yield CommentDao.getTotalComments('news', news_ids);
        for (let item of recommend_news) {
            delete item.body;
            delete item.url;
            // const [comment_count] = yield CommentDao.getTotalComment('news', item.news_id);
            let comment_count = 0;
            if (total_comments[item.news_id]) {
                comment_count = total_comments[item.news_id];
            }
            item.comment_count = parseInt(comment_count);
            let like_count = 0;
            if (total_likes[item.news_id]) {
                like_count = total_likes[item.news_id];
            }
            item.like_count = parseInt(like_count);
        }
        return BaseRes.success(res, {index: -1, items: recommend_news});
    });
    
};

module.exports = {
    getNews, getNewsDetail, addLike, unLike, recommend
};