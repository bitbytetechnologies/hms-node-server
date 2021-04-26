const express = require('express');
const router = express.Router();
const database = require('../startup/dbconfig');
const date = require('date-and-time');
const { GetUser, GetManagers, GetRequest, GetRoster } = require('../helpers/data.helper');
const { SendRequestApprovalToManagement } = require('../helpers/mail.notifications');
let { FAIL, SUCCESS, INVALID_INPUT } = require('../helpers/app_messages');


router.post("/api/staff/approve_roster", async (req, res) => {

    var data = req.body;

    try {

        let { accept, reject } = 0;

        if (!data || !data.length) {
            res.status(400).send(INVALID_INPUT);
        }

        accept = data.accept ? data.accept : 0;
        reject = data.reject ? data.reject : 0;

        var managers = await GetManagers();


        data.forEach(async ros => {

            var staff = await GetUser(ros.staff_id);
            var clientRequest = await GetRequest(ros.req_id);
            var roster = await GetRoster(ros.roster_id);

            let query = `UPDATE  rosters 
                             SET  mark_read =  1,
                             accept =  ${accept},
                             reject  = ${reject} 
             WHERE  id = ${ros.roster_id} ; `;

            var result = await database.query(query);

            await SendRequestApprovalToManagement(staff, managers, 'Staff Approved Roster', roster, clientRequest);

        });

        // SUCCESS.result = data;  //result;
        return res.status(200).send(SUCCESS);

    } catch (error) {
        console.log(error);
        return res.status(401).send(FAIL);
    }
});

router.post("/api/staff/progress", async (req, res) => {
    try {

        let { staff_id, roster_id, roster_date, from_time, to_time, details } = req.body;

        if (!staff_id || !roster_id || !roster_date || !from_time || !to_time) {
            res.status(400).send(INVALID_INPUT);
        }

        var managers = await GetManagers();
        var roster = await GetRoster(roster_id);
        var staff = await GetUser(staff_id);
        var clientRequest = await GetRequest(roster.req_id);
        //Date Parameter Format : yy-mm-dd 
        let query = `INSERT INTO staff_progress (date, roster_id, staff_id, roster_date, from_time, to_time, details) 
                     VALUES( NOW(),  ${staff_id}, ${roster_id}, STR_TO_DATE('${roster_date}', '%Y-%m-%d'), '${from_time}', '${to_time}', '${details}' ); `;

        var result = await database.query(query);

        await SendRequestApprovalToManagement(staff, managers, 'Staff Progress', roster, clientRequest);

        SUCCESS.result = result;
        return res.status(200).send(SUCCESS);

    } catch (error) {
        console.log(error);
        return res.status(401).send(FAIL);
    }
});


router.get("/api/staff/pending_rosters/:staff_id", async (req, res) => {

    try {
        if (!req.params['staff_id']) {
            res.status(400).send(INVALID_INPUT);
        }

        var staff_id = req.params['staff_id']

        let query = `SELECT * FROM rosters WHERE  send_to_id = '${staff_id}' and mark_read = '${0}' ; `;
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