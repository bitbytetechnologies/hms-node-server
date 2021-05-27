
const auth = require('../middleware/auth');
const express = require('express');
const _ = require('lodash');
const database = require('../startup/dbconfig');

const router = express.Router(); // instead this will work.

var SUCCESS = { code: 1, success: true, message: "Success", result: null };
var SOME_THONG_WENTWRONG = { code: 0, success: false, message: "Something went wrong" };



router.get("/api/setups/roles", async (req, res) => {
    try {

        let query = `SELECT * FROM roles;`;
        var result = await database.query(query);

        if (!result[0]) {
            SUCCESS.result = null;
            return res.status(200).send(SUCCESS);
        }

        SUCCESS.result = result;
        return res.status(200).send(SUCCESS);

    } catch (error) {
        return res.status(401).send(SOME_THONG_WENTWRONG);
    }
});

router.get("/api/setups/work_levels", async (req, res) => {
    try {

        let query = `SELECT * FROM work_levels;`;
        var result = await database.query(query);

        if (!result[0]) {
            SUCCESS.result = null;
            return res.status(200).send(SUCCESS);
        }

        SUCCESS.result = result;
        return res.status(200).send(SUCCESS);

    } catch (error) {
        return res.status(401).send(SOME_THONG_WENTWRONG);
    }
});

module.exports = router;