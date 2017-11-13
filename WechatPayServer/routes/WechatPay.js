'use strict';

const express = require('express');
const router = express.Router();

const WechatPayController = require('../controller/WechatPayController');

router.post('/order/coin_plan/:coin_plan_id', WechatPayController.createOrder);
router.post('/notify', WechatPayController.notifyOrder);
// router.get('/goods', GoodsController.getGoods);
// router.get('/goods/:goods_id', GoodsController.getGoodsDetail);
// router.post('/exchange/:goods_id', GoodsController.bugGoods);
// router.get('/exchange/history', GoodsController.exchangeHistory);

module.exports = router;