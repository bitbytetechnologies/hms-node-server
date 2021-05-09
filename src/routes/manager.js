const express = require('express');
const router = express.Router();
const database = require('../startup/dbconfig');
const { GetUser, GetRequest, GetRoster, GetManagers } = require('../helpers/data.helper')
const { SendRequestToStaffMail, SendRequestMail } = require('../helpers/mail.notifications');
let { FAIL, SUCCESS, INVALID_INPUT, SOME_THONG_WENTWRONG } = require('../helpers/app_messages');

router.post("/api/managers/create_request", async (req, res) => {
    let { datetime, client_user_id, loc_attu, loc_long, request_status, from_date, to_date, req_hours, from_time, to_time, city, country, staff_id, manager_id } = req.body;

    if (!datetime || !client_user_id || !loc_attu || !loc_long || !from_date || !to_date || !req_hours || !staff_id || !manager_id) {
        INVALID_INPUT.result = req.body;
        return res.send(INVALID_INPUT);
    }

    try {
        let data = { ...req.body };
        request_status = "SENT";

        datetime = new Date(datetime);
        from_date = new Date(from_date);
        to_date = new Date(to_date);

        var params = [
            datetime,
            client_user_id,
            city,
            country,
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

        var managers = await GetManagers();
        var client = await GetUser(client_user_id);
        var request_id = result.insertId;
        var client_request = await GetRequest(request_id);

        await SendRequestMail(client, managers, "Client Request", request_id, client_request);  // 1 is Notification Type

        let query1 = `UPDATE  notifications 
                         SET  mark_read =  1,
                              marked_user_id =  ${manager_id},
                              marked_date = now() 
                       WHERE  ref_id = ${request_id} ; `;

        var result = await database.query(query1);

        let query2 = `UPDATE  client_requests
                        SET  approved =  ${1}
                      WHERE  id = ${request_id} ; `;

        var result = await database.query(query2);


        /////////////////////////////////////////////////////////////////////////////
        fromDate = new Date(from_date);
        toDate = new Date(to_date);
        manager_role_id = 3;
        staff_role_id = 2;

        var params = [
            datetime,
            request_id,
            manager_id,
            manager_role_id,
            staff_id,
            staff_role_id,
            fromDate,
            toDate,
            from_time,
            to_time,
            req_hours
        ];

        let query3 = `INSERT INTO rosters(
            datetime,
            req_id,
            send_by_id,
            send_by_role_id,
            send_to_id,
            send_to_role_id,
            from_date,
            to_date,
            from_time,
            to_time,
            hours
           ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ); `;

        var result = await database.query(query3, params);
        var roster_id = result.insertId;

        var roster = await GetRoster(roster_id);
        var manager = await GetUser(manager_id);

        var staff = await GetUser(staff_id);

        SUCCESS.message = "Request Generated Sucessfully...";
        SUCCESS.result = data;
        await SendRequestToStaffMail(manager, staff, "Staff Roster Request", request_id, roster);  // 1 is Notification Type

        res.status(200).send(SUCCESS);
    }
    catch (error) {

        SOME_THONG_WENTWRONG.message = error.message;
        res.send(SOME_THONG_WENTWRONG);
    }
});

router.post("/api/notification/staff_roster", async (req, res) => {

    try {
        let data = req.body;
        let { req_id, manager_id, staff_requests } = data;

        var manager = await GetUser(manager_id);

        if (!req_id || !manager_id || !staff_requests || !staff_requests.length || !manager) {
            return res.status(400).send(INVALID_INPUT);
        }

        var datetime = new Date();

        if (staff_requests) {
            staff_requests.forEach(async (roster) => {

                var staff = await GetUser(roster.staff_id);

                fromDate = new Date(roster.from_date);
                toDate = new Date(roster.to_date);

                var params = [
                    datetime,
                    req_id,
                    manager.id,
                    manager.role_id,
                    staff.id,
                    staff.role_id,
                    fromDate,
                    toDate,
                    roster.from_time,
                    roster.to_time,
                    roster.hours
                ];

                let query = `INSERT INTO rosters(
                    datetime,
                    req_id,
                    send_by_id,
                    send_by_role_id,
                    send_to_id,
                    send_to_role_id,
                    from_date,
                    to_date,
                    from_time,
                    to_time,
                    hours
                   ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ); `;

                var result = await database.query(query, params);

                await SendRequestToStaffMail(manager, staff, "Staff Roster Request", req_id, roster);  // 1 is Notification Type

                SUCCESS.message = "Staf Roster Generated Sucessfully...";
                SUCCESS.result = data;
            });
        }

        res.status(200).send(SUCCESS);

    } catch (error) {
        console.log(error);
        return res.status(401).send(FAIL);
    }
});

router.get("/api/managers", async (req, res) => {
    try {
        //role_id = 1 --> Manager
        //role_id = 2 --> Staff
        //role_id = 3 --> Cleint

        let query = `SELECT users.*, roles.name as rolename FROM users INNER JOIN roles ON users.role_id = roles.id and users.role_id=1; `;
        var result = await database.query(query);

        if (!result[0]) {
            SUCCESS.result = null;
            return res.status(200).send(SUCCESS);
        }

        SUCCESS.result = result;
        return res.status(200).send(SUCCESS);

    } catch (error) {
        console.log(error);
        return res.status(401).send(FAIL);
    }
});

router.post("/api/managers/staff_progress", async (req, res) => {

    try {

        const { date } = req.body;

        if (!date) {
            return res.status(400).send(INVALID_INPUT);
        }

        let query = `SELECT staff_progress.*, 
                            users.username as staff_name , users.email as staff_email 
                       FROM staff_progress  
                 INNER JOIN users on staff_progress.staff_id = users.id WHERE roster_date = '${date}'  ; `;
        var result = await database.query(query);

        if (!result[0]) {
            SUCCESS.result = null;
            return res.status(200).send(SUCCESS);
        }

        SUCCESS.result = result;
        return res.status(200).send(SUCCESS);

    } catch (error) {
        console.log(error);
        return res.status(401).send(FAIL);
    }

});

module.exports = router;


