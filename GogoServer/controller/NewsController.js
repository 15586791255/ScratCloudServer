const NewsDao = require('../dao/NewsDao');

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
        const news = yield NewsDao.getNews(index, parseInt(size));
        let minIndex = index;
        for (let item of news) {
            delete item.body;
            delete item.url;
            if (minIndex == 0 || minIndex > item.news_id) {
                minIndex = item.news_id
            }
        }
        if (news.length < size) {
            minIndex = -1;
        }
        BaseRes.success(res, {index: minIndex, items: news});
    });
};

module.exports = {
    getNews
};