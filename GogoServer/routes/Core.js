'use strict';

const express = require('express');
const router = express.Router();

router.get('/test', function (req, res) {
    res.send({
        code: 200,
        msg: 'ok'
    });
});

module.exports = router;