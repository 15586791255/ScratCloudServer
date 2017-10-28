'use strict';

const express = require('express');
const router = express.Router();
const NewsController = require('../controller/NewsController');
const BannerController = require('../controller/BannerController');

router.get('/test', function (req, res) {
    res.send({
        code: 200,
        msg: 'ok'
    });
});

router.get('/news', NewsController.getNews);
router.get('/banner', BannerController.getBanner);

module.exports = router;