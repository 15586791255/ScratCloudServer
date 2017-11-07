'use strict';

const express = require('express');
const router = express.Router();

const AccountController = require('../controller/AccountController');
const SmsController = require('../controller/SmsController');

// curl -X POST -H "Content-type: application/json" -H "app_id: app_id_1" -d '{"phone":"13521389587","password":"test"}' 'http://localhost:8082/account/login'
router.post('/login', AccountController.login);
router.post('/logout', AccountController.logout);
// curl -X POST -H "Content-type: application/json" -d '{"tel":"15018329815"}' 'http://localhost:8082/account/sms'
router.post('/sms', SmsController.sendTencentSms);
// curl -X POST -H "Content-type: application/json" -H "app_id: app_id_1" -d '{"tel":"15018329815"}' 'http://localhost:8082/account/sms/move_car'
router.post('/sms/move_car', SmsController.sendMoveCarSms);
//curl -X POST -H "Content-type: application/json" -H "app_key: test_key" -H "pt: app" -d '{"tel":"15018329815", "code": "272968"}' 'http://localhost:8082/account/sms_login'
router.post('/sms_login', AccountController.smsLogin);
//curl -X POST -H "Content-type: application/json" -H "app_key: test_key" -H "pt: app" -d '{"refresh_token": "bGDep7WTLCIqjlTw"}' 'http://localhost:8082/account/96008684/token'
router.post('/token', AccountController.refreshToken);
router.post('/wx_login', AccountController.wxLogin);

module.exports = router;