const express = require('express');
const cors = require('cors');
const auth = require('../routes/auth');
const home = require('../routes/home');
const users = require('../routes/users');
const manager = require('../routes/manager');
const staff = require('../routes/staff');
const client = require('../routes/client');
const setups = require('../routes/setup');
const notifications = require('../routes/notification');

const whitelist = [
    'http://localhost:3200',
    'http://localhost:3000',
    'http://localhost:3200/users',
    'http://localhost:3200/users/auth',
];

const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(null, true)
            //callback('Not allowed')
            // callback(new Error('Not allowed by CORS'))
        }
    }, credentials: true
}

module.exports = function (app) {
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use('/', auth);
    app.use('/', home);
    app.use('/', users);
    app.use('/', manager);
    app.use('/', staff);
    app.use('/', client);
    app.use('/', setups);
    app.use('/', notifications);
}

