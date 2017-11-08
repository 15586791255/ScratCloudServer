'use strict';

const express = require('express');
const router = express.Router();

const GoodsController = require('../controller/GoodsController');

router.get('/goods', GoodsController.getGoods);
router.get('/goods/:goods_id', GoodsController.getGoodsDetail);
router.post('/exchange/:goods_id', GoodsController.bugGoods);

module.exports = router;