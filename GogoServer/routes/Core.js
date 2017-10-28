'use strict';

const express = require('express');
const router = express.Router();
const NewsController = require('../controller/NewsController');

router.get('/test', function (req, res) {
    res.send({
        code: 200,
        msg: 'ok'
    });
});

router.get('/news', NewsController.getNews);

module.exports = router;