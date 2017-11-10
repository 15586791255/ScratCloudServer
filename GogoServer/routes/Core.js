'use strict';

const express = require('express');
const router = express.Router();
const NewsController = require('../controller/NewsController');
const BannerController = require('../controller/BannerController');
const CommentController = require('../controller/CommentController');
const TeamController = require('../controller/TeamController');
const RaceController = require('../controller/RaceController');
const CoinController = require('../controller/CoinController');
const UserController = require('../controller/UserController');

router.get('/test', function (req, res) {
    res.send({
        code: 200,
        msg: 'ok'
    });
});

router.get('/news/:news_id', NewsController.getNewsDetail);
router.get('/news', NewsController.getNews);
router.get('/banner', BannerController.getBanner);
router.post('/comment', CommentController.addComment);
router.get('/comments', CommentController.getComments);
router.get('/teams', TeamController.getTeams);
router.get('/team/:team_id', TeamController.getTeam);
router.get('/races', RaceController.getRaces);
router.get('/race/:race_id', RaceController.getRacesDetail);
router.get('/coin/plans', CoinController.getPlans);
router.get('/user', UserController.getUserInfo);
router.post('/user', UserController.updateUserInfo);
router.post('/address', UserController.updateAddress);
router.get('/address', UserController.getAddress);

module.exports = router;