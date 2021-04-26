const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const express = require('express');
const _ = require('lodash');
let { FAIL, SUCCESS, INVALID_INPUT, SOME_THONG_WENTWRONG } = require('../helpers/app_messages');
const database = require('../startup/dbconfig');

const router = express.Router(); // instead this will work.

router.post('/api/users', async (req, res) => {

    const { username, email, password, role_id } = req.body;

    if (!username || !email || !password || !role_id) {
        INVALID_INPUT.result = req.body;
        return res.send(INVALID_INPUT);
    }

    try {
        const data = { ...req.body };

        data.dob = new Date(data.dob);

        var salt = await bcrypt.genSalt(8);
        var passwordHash = await bcrypt.hash(data.password, salt);
        var params = [
            data.username,
            passwordHash,
            data.password,
            data.email,
            data.role_id,
            data.is_active,
            data.dob,
            data.account_no,
            data.bsb,
            data.account_title,
            data.mobile_no,
            data.nationality,
            data.address,
            data.emergency_contact,
            data.ndis_no,
            data.wwc_no,
            data.car_reg_no,
            data.drv_lic_no,
            data.level_of_work,
            data.disability_type,
            data.parent_gaurdian_details,
            data.last_address,
            data.what_like,
            data.pg_doctor,
            data.pg_doctor_contact_no,
            data.pg_doctor_address
        ];

        var duplicate = await CheckDuplicate(email);

        if (duplicate) {
            FAIL.message = "Duplicate username or email..."
            return res.json(FAIL);
        }

        let query = `INSERT INTO users ( username, 
                                         password, 
                                         password1, 
                                         email, 
                                         role_id,
                                         is_active,
                                         dob,
                                         account_no,
                                         bsb,
                                         account_title,
                                         mobile_no,
                                         nationality,
                                         address,
                                         emergency_contact,
                                         ndis_no,
                                         wwc_no,
                                         car_reg_no,
                                         drv_lic_no,
                                         level_of_work,
                                         disability_type,
                                         parent_gaurdian_details,
                                         last_address,
                                         what_like,
                                         pg_doctor,
                                         pg_doctor_contact_no,
                                         pg_doctor_address
                                        ) 
                                VALUES ( ?, ?, ?, ?, ?, ?,
                                         ?, ?, ?, ?, ?, ?, 
                                         ?, ?, ?, ?, ?, ?,
                                         ?, ?, ?, ?, ?, ?,
                                         ?, ?
                                         ); `;

        var result = await database.query(query, params);

        SUCCESS.message = "User sucessfuly registered..."
        SUCCESS.result = { username: data.username, password: passwordHash, email: data.email, role_id: data.role_id }
        res.send(SUCCESS);

    }
    catch (error) {

        SOME_THONG_WENTWRONG.message = error.message;
        return res.status(401).send(SOME_THONG_WENTWRONG);
    }

});

router.put('/api/users/change_pass', async (req, res) => {

    const { username, email, password, role_id } = req.body;

    if (!username || !email || !password || !role_id) {
        INVALID_INPUT.result = req.body;
        return res.send(INVALID_INPUT);
    }

    try {
        const data = { ...req.body };
        var passwordHash = bcrypt.hashSync(data.password, 8);
        let query = `UPDATE users SET password = '${passwordHash}' , role_id = ${data.role_id}  WHERE email = '${data.email}' ;`;
        var result = await database.query(query);
        res.send(SUCCESS);
    }
    catch (error) {

        SOME_THONG_WENTWRONG.message = error.message;
        return res.status(401).send(SOME_THONG_WENTWRONG);
    }

});

router.put('/api/users', async (req, res) => {

    const { username, email, password, role_id } = req.body;

    if (!username || !email || !password || !role_id) {
        INVALID_INPUT.result = req.body;
        return res.send(INVALID_INPUT);
    }

    try {
        const data = { ...req.body };

        var salt = await bcrypt.genSalt(8);
        var passwordHash = await bcrypt.hash(data.password, salt);
        var is_active = data.is_active;
        var dob = data.dob;
        var account_no = data.account_no;
        var bsb = data.bsb;
        var account_title = data.account_title;
        var mobile_no = data.mobile_no;
        var nationality = data.nationality;
        var address = data.address;
        var emergency_contact = data.emergency_contact;
        var ndis_no = data.ndis_no;
        var wwc_no = data.wwc_no;
        var car_reg_no = data.car_reg_no;
        var drv_lic_no = data.drv_lic_no;
        var level_of_work = data.level_of_work;
        var disability_type = data.disability_type;
        var parent_gaurdian_details = data.parent_gaurdian_details;
        var last_address = data.last_address;
        var what_like = data.what_like;
        var pg_doctor = data.pg_doctor;
        var pg_doctor_contact_no = data.pg_doctor_contact_no;
        var pg_doctor_address = data.pg_doctor_address;

        let query = `UPDATE users SET    username = '${username}', 
                                         role_id = ${role_id},
                                         is_active = ${is_active},
                                         dob =  STR_TO_DATE('${dob}','%m-%d-%y'),
                                         account_no = '${account_no}',
                                         bsb = '${bsb}',
                                         account_title = '${account_title}',
                                         mobile_no = '${mobile_no}',
                                         nationality = '${nationality}',
                                         address = '${address}',
                                         emergency_contact = '${emergency_contact}',
                                         ndis_no = '${ndis_no}',
                                         wwc_no = '${wwc_no}',
                                         car_reg_no = '${car_reg_no}',
                                         drv_lic_no = '${drv_lic_no}',
                                         level_of_work = '${level_of_work}',
                                         disability_type = '${disability_type}',
                                         parent_gaurdian_details = '${parent_gaurdian_details}',
                                         last_address = '${last_address}',
                                         what_like = '${what_like}' ,
                                         pg_doctor = '${pg_doctor}',
                                         pg_doctor_contact_no = '${pg_doctor_contact_no}',
                                         pg_doctor_address = '${pg_doctor_address}'
                                WHERE email = '${email}' ; `;

        var result = await database.query(query);

        SUCCESS.message = "User Sucessfuly updated..."
        SUCCESS.result = data;
        res.send(SUCCESS);
    }
    catch (error) {
        SOME_THONG_WENTWRONG.message = error.message;
        res.send(SOME_THONG_WENTWRONG);
    }

});

router.get("/api/users/:id", async (req, res) => {
    try {
        const id = req.params.id;
        let query = `SELECT users.id, users.username, users.email, roles.name as rolename FROM users INNER JOIN roles ON users.role_id = roles.id WHERE users.id=${id}; `;
        var result = await database.query(query);

        if (!result[0]) {
            SUCCESS.result = null;
            return res.status(200).send(SUCCESS);
        }

        SUCCESS.result = result;
        return res.status(200).send(SUCCESS);

    } catch (error) {

        SOME_THONG_WENTWRONG.message = error.message;
        return res.status(401).send(SOME_THONG_WENTWRONG);
    }

});


router.get("/api/users", async (req, res) => {
    try {

        let query = `SELECT users.id, users.username, users.email, roles.name as rolename FROM users INNER JOIN roles ON users.role_id = roles.id; `;
        var result = await database.query(query);

        if (!result[0]) {
            SUCCESS.result = null;
            return res.status(200).send(SUCCESS);
        }

        SUCCESS.result = result;
        return res.status(200).send(SUCCESS);

    } catch (error) {
        SOME_THONG_WENTWRONG.message = error.message;
        return res.status(401).send(SOME_THONG_WENTWRONG);
    }
});


const CheckDuplicate = async (email) => {

    var duplicate = false;

    let query = `SELECT email FROM users WHERE email = ? ;`;
    var result = await database.query(query, [email]);

    if (result[0]) {
        duplicate = true;
    }

    return duplicate;
}

module.exports = router;
