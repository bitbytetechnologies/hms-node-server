const express = require('express');
const router = express.Router();
const database = require('../startup/dbconfig');
const { GetUser } = require('../helpers/data.helper')
const { SendRequestToStaffMail } = require('../helpers/mail.notifications');
let { FAIL, SUCCESS, INVALID_INPUT } = require('../helpers/app_messages');

router.get("/api/notification/:role_id", async (req, res) => {
    try {
        //role_id = 1 --> Manager
        //role_id = 2 --> Staff
        //role_id = 3 --> Cleint
        var role_id = 0;
        if (req.params.role_id) {
            role_id = req.params['role_id']
        }

        let query = `SELECT count(*) as unread_messages FROM notifications WHERE send_to_role_id = ${role_id} and mark_read = 0; `;
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

router.post("/api/notification/mark_read", async (req, res) => {

    const { req_id, user_id } = req.body;

    try {
        //role_id = 1 --> Manager
        //role_id = 2 --> Staff
        //role_id = 3 --> Cleint

        let query = `UPDATE  notifications 
                        SET  mark_read =  1,
                        marked_user_id =  ${user_id},
                        marked_date = now() 
                      WHERE  ref_id = ${req_id} ; `;

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

        res.status(200).send(data);

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

        let query = `SELECT users.id, users.username, users.email, roles.name as rolename FROM users INNER JOIN roles ON users.role_id = roles.id and users.role_id=1; `;
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


