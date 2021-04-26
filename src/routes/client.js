const express = require('express');
const router = express.Router();
const database = require('../startup/dbconfig');
const { GetManagers, GetUser } = require('../helpers/data.helper')
const { SendRequestMail } = require('../helpers/mail.notifications');
let { FAIL, SUCCESS, INVALID_INPUT, SOME_THONG_WENTWRONG } = require('../helpers/app_messages');
const { } = require('../routes/notification');

router.post("/api/client/create_request", async (req, res) => {
    let { datetime, client_user_id, loc_attu, loc_long, request_status, from_date, to_date, req_hours } = req.body;

    if (!datetime || !client_user_id || !loc_attu || !loc_long || from_date || to_date || req_hours) {
        INVALID_INPUT.result = req.body;
        return res.send(INVALID_INPUT);
    }

    try {
        let data = { ...req.body };

        request_status = "SENT";

        datetime = new Date(datetime);
        from_date = new Date(datetime);
        to_date = new Date(datetime);

        var params = [
            datetime,
            client_user_id,
            data.city,
            data.country,
            loc_attu,
            loc_long,
            request_status,
            from_date,
            to_date,
            req_hours
        ];

        let query = `INSERT INTO  client_requests ( datetime, 
                                                    client_user_id, 
                                                    city, 
                                                    country, 
                                                    loc_attu,
                                                    loc_long,
                                                    request_status,
                                                    from_date,
                                                    to_date,
                                                    req_hours
                                        ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ); `;

        var result = await database.query(query, params);

        SUCCESS.message = "Request Sucessfully Submitted...";
        SUCCESS.result = data;


        var managers = await GetManagers();
        var client = await GetUser(client_user_id);
        var request_id = result.insertId;

        await SendRequestMail(client, managers, "Client Request", request_id);  // 1 is Notification Type
        res.send(SUCCESS);

    }
    catch (error) {

        SOME_THONG_WENTWRONG.message = error.message;
        res.send(SOME_THONG_WENTWRONG);
    }
});

router.post("/api/client/feedback", async (req, res) => {
    try {

        let { client_id, details, staff_id } = req.body;

        if (!client_id || !details) {
            res.status(400).send(INVALID_INPUT);
        }

        let query = `INSERT INTO feedbacks (date, client_id, staff_id, details) 
                     VALUES( NOW(), ${client_id} ,${staff_id}, '${details}' ); `;

        var result = await database.query(query);

        SUCCESS.result = result;
        return res.status(200).send(SUCCESS);

    } catch (error) {
        console.log(error);
        return res.status(401).send(FAIL);
    }
});

module.exports = router;