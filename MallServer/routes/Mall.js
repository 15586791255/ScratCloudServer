'use strict';

const express = require('express');
const router = express.Router();

const GoodsController = require('../controller/GoodsController');

router.get('/goods', GoodsController.getGoods);

module.exports = router;