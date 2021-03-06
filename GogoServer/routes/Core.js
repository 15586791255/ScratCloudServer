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
const SignInController = require('../controller/SignInController');

router.get('/test', function (req, res) {
    res.send({
        code: 200,
        msg: 'ok'
    });
});

router.get('/news/type', RaceController.getNewsTypes);
router.post('/news/like', NewsController.addLike);
router.post('/news/unlike', NewsController.unLike);
router.get('/news/recommend/:game/:news_id', NewsController.recommend);
router.get('/news/:news_id', NewsController.getNewsDetail);
router.get('/news', NewsController.getNews);
router.get('/banner', BannerController.getBanner);
router.post('/comment', CommentController.addComment);
router.post('/comment/like', CommentController.addLike);
router.post('/comment/unlike', CommentController.unLike);
router.get('/comments', CommentController.getComments);
router.get('/teams', TeamController.getTeams);
router.get('/team/:team_id', TeamController.getTeam);
router.get('/races', RaceController.getRaces);
router.get('/races2', RaceController.getRaces2);
router.get('/races/hot', RaceController.getHotRaces);
router.get('/race/:race_id', RaceController.getRacesDetail);
router.post('/betting', RaceController.createBetting);
router.get('/betting', RaceController.getBettingHistories);
router.get('/coin/plans', CoinController.getPlans);
router.get('/user', UserController.getUserInfo);
router.post('/user', UserController.updateUserInfo);
router.post('/address', UserController.updateAddress);
router.get('/address', UserController.getAddress);
router.get('/race2/:race_id/:tp', RaceController.getRaceTpDetail);
router.get('/race2/:race_id', RaceController.getRacesDetail2);
router.post('/race2/coin_gift', RaceController.addRaceGift);
router.get('/coin', SignInController.coinInfo);
router.get('/sign_in', SignInController.addSign);

module.exports = router;