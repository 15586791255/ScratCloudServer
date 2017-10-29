'use strict';

const express = require('express');
const router = express.Router();

const FileController = require('../controller/FileController');
//curl 'http://localhost:8084/file/qiniu_token'
router.get('/qiniu_token', FileController.getToken);

module.exports = router;