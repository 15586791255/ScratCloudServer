'use strict';

const express = require('express');

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

global.Co = require('co');
global.Config = require('../Config');
const Sequelize = require('sequelize');
const dbPool = new Sequelize(Config.database, Config.mysqlUser, Config.mysqlPassword, {
    host: Config.mysqlHost,
    port: Config.mysqlPort,
    dialect: 'mysql',
    dialectOptions: {
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
        supportBigNumbers: true,
        bigNumberStrings: true
    },

    pool: {
        maxConnections: 20,
        minConnections: 5,
        idle: 10000
    },

    benchmark: true,
    operatorsAliases: false
});
dbPool.authenticate()
// .then(() => {
// console.log('MySQL连接成功', 'SUCCESS')
// })
    .catch(err => {
        console.log('MySQL连接失败, 原因', `${err} `)
    });
global.Sequelize = Sequelize;
global.Conn = dbPool;

app.listen(Config.port, Config.host, function () {
    console.log(`Visit at http://${Config.host}:${Config.port}`);
});