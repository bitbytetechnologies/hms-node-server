const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const express = require('express');
const _ = require('lodash');
const database = require('../startup/dbconfig');

const router = express.Router(); // instead this will work.

var SUCCESS = { code: 1, success: true, message: "Success", result: null };
var FAIL = { code: 0, success: false, message: "Fail" };
var SOME_THONG_WENTWRONG = { code: 0, success: false, message: "Something went wrong" };

var LOGIN = { code: 1, success: true, message: "Success", result: null, token: null };
var LOGIN_FAIL = { code: 0, success: false, message: "Invalid Username or Password", result: null, token: null };

var INVALID_INPUT = { code: 0, success: false, message: "Invalid input's", result: null };

router.post('/api/auth', async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        LOGIN_FAIL.result = req.body;
        return res.send(LOGIN_FAIL);
    }

    try {

        const data = { ...req.body };
        var params = [data.password, data.email]

        var userQuery = `SELECT users.id, password, users.email FROM users  WHERE email = '${email}';`;
        var result = await database.query(userQuery);

        var isValidPassword = await bcrypt.compare(data.password, result[0].password);

        if (!isValidPassword) {
            return res.send(LOGIN_FAIL);
        }

        let query = `SELECT users.*,  roles.name as rolename FROM users INNER JOIN roles ON users.role_id = roles.id  WHERE email = '${email}' ; `;
        var result = await database.query(query, params);

        if (!result[0]) {
            return res.send(LOGIN_FAIL);
        }

        var token = jwt.sign({ id: result[0].id }, "nodeSecretKey");
        LOGIN.token = token;
        LOGIN.result = result[0];

        return res.send(LOGIN);

    }
    catch (error) {
        return res.send(SOME_THONG_WENTWRONG);
    }

});


module.exports = router;