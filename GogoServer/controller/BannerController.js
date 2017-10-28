const NewsDao = require('../dao/NewsDao');

const getBanner = (req, res) => {
    Co(function *() {
        const news = yield NewsDao.getNews(0, 5);
        for (let item of news) {
            delete item.body;
            delete item.url;
        }
        BaseRes.success(res, news);
    });
};

module.exports = {
    getBanner
};