'use strict';

var app = require('../app.js');
//var config = require('../config/app.config');

app.listen(Config.port, Config.host, function () {
    console.log(`Visit at http://${Config.host}:${Config.port}`);
});
