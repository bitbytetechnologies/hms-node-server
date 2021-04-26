const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const express = require('express');
const _ = require('lodash');
const database = require('../startup/dbconfig');

const router = express.Router(); // instead this will work.

router.post('/api/notifications/client', async (req, res) => {

    // const { username, email, password, role_id } = req.body;

    // if (!username || !email || !password || !role_id) {
    //     INVALID_INPUT.result = req.body;
    //     return res.send(INVALID_INPUT);
    // }

    try {
        //     const data = { ...req.body };

        //     data.dob = new Date(data.dob);

        //     var salt = await bcrypt.genSalt(8);
        //     var passwordHash = await bcrypt.hash(data.password, salt);
        //     var params = [
        //         data.username,
        //         passwordHash,
        //         data.password,
        //         data.email,
        //         data.role_id,
        //         data.is_active,
        //         data.dob,
        //         data.account_no,
        //         data.bsb,
        //         data.account_title,
        //         data.mobile_no,
        //         data.nationality,
        //         data.address,
        //         data.emergency_contact,
        //         data.ndis_no,
        //         data.wwc_no,
        //         data.car_reg_no,
        //         data.drv_lic_no,
        //         data.level_of_work,
        //         data.disability_type,
        //         data.parent_gaurdian_details,
        //         data.last_address,
        //         data.what_like,
        //         data.pg_doctor,
        //         data.pg_doctor_contact_no,
        //         data.pg_doctor_address
        //     ];

        //     var duplicate = await CheckDuplicate(email);

        //     if (duplicate) {
        //         FAIL.message = "Duplicate username or email..."
        //         return res.json(FAIL);
        //     }

        //     let query = `INSERT INTO users ( username, 
        //                                      password, 
        //                                      password1, 
        //                                      email, 
        //                                      role_id,
        //                                      is_active,
        //                                      dob,
        //                                      account_no,
        //                                      bsb,
        //                                      account_title,
        //                                      mobile_no,
        //                                      nationality,
        //                                      address,
        //                                      emergency_contact,
        //                                      ndis_no,
        //                                      wwc_no,
        //                                      car_reg_no,
        //                                      drv_lic_no,
        //                                      level_of_work,
        //                                      disability_type,
        //                                      parent_gaurdian_details,
        //                                      last_address,
        //                                      what_like,
        //                                      pg_doctor,
        //                                      pg_doctor_contact_no,
        //                                      pg_doctor_address
        //                                     ) 
        //                             VALUES ( ?, ?, ?, ?, ?, ?,
        //                                      ?, ?, ?, ?, ?, ?, 
        //                                      ?, ?, ?, ?, ?, ?,
        //                                      ?, ?, ?, ?, ?, ?,
        //                                      ?, ?
        //                                      ); `;

        //     var result = await database.query(query, params);

        //     SUCCESS.message = "User sucessfuly registered..."
        //     SUCCESS.result = { username: data.username, password: passwordHash, email: data.email, role_id: data.role_id }
        res.send(SUCCESS);

    }
    catch (error) {

        SOME_THONG_WENTWRONG.message = error.message;
        return res.status(401).send(SOME_THONG_WENTWRONG);
    }

});


module.exports = router;
