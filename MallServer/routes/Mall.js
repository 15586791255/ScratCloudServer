'use strict';

const express = require('express');
const router = express.Router();

const GoodsController = require('../controller/GoodsController');

router.get('/goods', GoodsController.getGoods);
router.get('/goods/:goods_id', GoodsController.getGoodsDetail);
router.post('/exchange/:goods_id', GoodsController.bugGoods);
router.get('/exchange/history', GoodsController.exchangeHistory);

router.get('/admin/goods', GoodsController.getAllGoods);
router.post('/admin/goods', GoodsController.updateGoods);
router.put('/admin/goods', GoodsController.addGoods);
router.delete('/admin/goods/:goods_id', GoodsController.deleteGoods);

module.exports = router;