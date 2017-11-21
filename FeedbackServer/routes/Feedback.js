'use strict';

const express = require('express');
const router = express.Router();

const FeedbackController = require('../controller/FeedbackController');
router.post('/feedback', FeedbackController.addFeedback);

module.exports = router;