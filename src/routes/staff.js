const express = require('express');
const router = express.Router();
const database = require('../startup/dbconfig');
const date = require('date-and-time');
const { GetUser, GetManagers, GetRequest, GetRoster } = require('../helpers/data.helper');
const { SendRequestApprovalToManagement } = require('../helpers/mail.notifications');
let { FAIL, SUCCESS, INVALID_INPUT, SOME_THONG_WENTWRONG } = require('../helpers/app_messages');

router.post("/api/staff/approve_roster", async (req, res) => {

    var data = req.body;

    try {

        //  let { accept, reject } = 0;

        if (!data || !data.length) {
            res.status(400).send(INVALID_INPUT);
        }

        // accept = data.accept ? data.accept : 0;
        //  reject = data.reject ? data.reject : 0;

        var managers = await GetManagers();


        data.forEach(async ros => {

            var staff = await GetUser(ros.staff_id);
            var clientRequest = await GetRequest(ros.req_id);
            var roster = await GetRoster(ros.roster_id);

            let query = `UPDATE  rosters 
                             SET  mark_read =  1,
                             accept =  ${ros.accept}
             WHERE  id = ${ros.roster_id} ; `;

            var result = await database.query(query);

            await SendRequestApprovalToManagement(staff, managers, 'Staff Approved Roster', roster, clientRequest);

        });

        // SUCCESS.result = data;  //result;
        return res.status(200).send(SUCCESS);

    } catch (error) {
        SOME_THONG_WENTWRONG.message = error.message;
        return res.status(401).send(SOME_THONG_WENTWRONG);
    }
});

router.post("/api/staff/progress", async (req, res) => {
    try {

        let { staff_id, roster_id, roster_date, from_time, to_time, details, bill_amount } = req.body;

        if (!staff_id || !roster_id || !roster_date || !from_time || !to_time || !bill_amount) {
            res.status(400).send(INVALID_INPUT);
        }

        var managers = await GetManagers();
        var roster = await GetRoster(roster_id);
        var staff = await GetUser(staff_id);
        var clientRequest = await GetRequest(roster.req_id);

        roster_date = roster_date.toString();

        //Date Parameter Format : yy-mm-dd 
        let query = `INSERT INTO staff_progress (date, roster_id, staff_id, roster_date, from_time, to_time, details, bill_amount) 
                     VALUES( NOW(),  ${roster_id}, ${staff_id}, '${roster_date}', '${from_time}', '${to_time}', '${details}', '${bill_amount}' ); `;

        var result = await database.query(query);

        await SendRequestApprovalToManagement(staff, managers, 'Staff Progress', roster, clientRequest);

        SUCCESS.result = result;
        return res.status(200).send(SUCCESS);

    } catch (error) {
        SOME_THONG_WENTWRONG.message = error.message;
        return res.status(401).send(SOME_THONG_WENTWRONG);
    }
});

router.get("/api/staff/pending_rosters/:staff_id", async (req, res) => {

    try {
        if (!req.params['staff_id']) {
            res.status(400).send(INVALID_INPUT);
        }

        var staff_id = req.params['staff_id']

        let query = `SELECT * FROM rosters WHERE  send_to_id = '${staff_id}' and mark_read = '${0}'  ; `;
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


router.get("/api/staff/roster/resport/:roster_id", async (req, res) => {

    try {
        if (!req.params['roster_id']) {
            res.status(400).send(INVALID_INPUT);
        }

        var staff_id = req.params['staff_id']

        let query = `SELECT * FROM rosters WHERE id = '${roster_id}'  ; `;
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


router.get("/api/staff/rosters/:staff_id", async (req, res) => {

    try {
        if (!req.params['staff_id']) {
            res.status(400).send(INVALID_INPUT);
        }

        var staff_id = req.params['staff_id']

        let query = `SELECT * FROM rosters WHERE send_to_id = '${staff_id}' and accept=${1} ; `;
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

router.get("/api/staff/medication/:staff_id", async (req, res) => {

    try {
        if (!req.params['staff_id']) {
            res.status(400).send(INVALID_INPUT);
        }

        var staff_id = req.params['staff_id']

        let query = `SELECT * FROM rosters WHERE send_to_id = '${staff_id}' and accept=${1} ; `;
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

router.post("/api/staff_progress/report", async (req, res) => {

    try {

        const { staff_id, date } = req.body;

        if (!staff_id || !date) {
            return res.status(400).send(INVALID_INPUT);
        }

        let query = `SELECT * FROM staff_progress WHERE staff_id = ${staff_id} and roster_date = '${date}' ; `;
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

router.get("/api/staff_progress/bill/:request_id", async (req, res) => {

    try {

        let query = `SELECT  rq.*, ros.id as roster_id, progress.id as progress_id ,client_user.username as client_name, client_user.email as client_email, 
                             staff_user.id as staff_user_id ,staff_user.username as staff_name, staff_user.email as staff_email,
                             nullif(progress.bill_amount , 0) as bill_amount
                    FROM   client_requests rq 
                    INNER  JOIN  rosters ros on ros.req_id =  rq.id
                    INNER  JOIN  users  client_user  on rq.client_user_id =  client_user.id
                    INNER  JOIN  users  staff_user   on ros.send_to_id    =  staff_user.id
                    INNER  JOIN  staff_progress  progress on ros.id =  progress.roster_id
                    WHERE  rq.id = '${req.params.request_id}' ; `;

        var result = await database.query(query);

        let query1 = `SELECT  sum(nullif(progress.bill_amount , 0)) as bill_amount
                                FROM   client_requests rq 
                                INNER  JOIN  rosters ros on ros.req_id =  rq.id
                                INNER  JOIN  users  client_user  on rq.client_user_id =  client_user.id
                                INNER  JOIN  users  staff_user   on ros.send_to_id    =  staff_user.id
                                INNER  JOIN  staff_progress  progress on ros.id =  progress.roster_id
                                WHERE  rq.id = '${req.params.request_id}' ; `;

        var result1 = await database.query(query1);
        console.log(result1);


        if (!result[0]) {
            SUCCESS.result = null;
            return res.status(200).send(SUCCESS);
        }

        SUCCESS.total_amount = result1[0] ? result1[0].bill_amount : 0;
        SUCCESS.result = result;
        return res.status(200).send(SUCCESS);

    } catch (error) {
        SOME_THONG_WENTWRONG.message = error.message;
        return res.status(401).send(SOME_THONG_WENTWRONG);
    }

});


router.post("/api/staff/medication", async (req, res) => {
    try {

        let data = req.body;

        if (!data || !data.length) {
            res.status(400).send(INVALID_INPUT);
        }

        var values = [];
        data.forEach(medication => {
            values.push(
                [
                    medication.date.toString(),
                    medication.roster_id,
                    medication.type,
                    medication.is_taken,
                    medication.created_by,
                    medication.details,
                    medication.vkey
                ]
            )
        })

        let query = `INSERT INTO medications (date, roster_id, type, is_taken,  created_by, details,  vkey) VALUES ? ; `;
        var result = await database.query(query, [values]);

        result.id = result.insertId;
        SUCCESS.result = result;
        return res.status(200).send(SUCCESS);

    } catch (error) {
        SOME_THONG_WENTWRONG.message = error.message;
        return res.status(401).send(SOME_THONG_WENTWRONG);
    }
});

router.put("/api/staff/medication", async (req, res) => {
    try {

        let data = req.body;

        if (!data || !data.length) {
            res.status(400).send(INVALID_INPUT);
        }

        var result = null;
        var resp = await data.forEach(async (medication) => {
            let { roster_id, type, is_taken, created_by, details, vkey, date } = medication;
            let query = `UPDATE medications 
                            SET is_taken = '${is_taken}',
                            details = '${details}',
                            created_by = '${created_by}',
                            vkey = '${vkey}                   
                         WHERE roster_id = ${roster_id} and type='${type}' and date='${date}' ; `;
            result = await database.query(query);
            SUCCESS.result = result;
        });

        return res.status(200).send(SUCCESS);

    } catch (error) {
        SOME_THONG_WENTWRONG.message = error.message;
        return res.status(401).send(SOME_THONG_WENTWRONG);
    }
});


router.get("/api/medication/summary", async (req, res) => {
    try {
        let query = `SELECT   type, COUNT(1) as total, 
                              COUNT(1) / (SELECT COUNT(1) FROM medications WHERE is_taken = 1) * 100 AS avg  
                     FROM     medications 
                     WHERE    is_taken = 1
                 GROUP BY     type; `;

        var result = await database.query(query);

        SUCCESS.result = result;
        return res.status(200).send(SUCCESS);

    } catch (error) {
        SOME_THONG_WENTWRONG.message = error.message;
        return res.status(401).send(SOME_THONG_WENTWRONG);
    }
});

router.post("/api/medication/medication_list", async (req, res) => {
    try {

        const { roster_id, date } = req.body;

        if (!roster_id || !date) {
            res.status(400).send(INVALID_INPUT);
        }

        let query = ` SELECT m.*, i.id as form_id FROM medications m 
                      LEFT OUTER JOIN medication_incidents i on m.vkey = i .vkey
                      WHERE   (m.roster_id = ${roster_id} and m.date = '${date}') ; `;

        var result = await database.query(query);

        SUCCESS.result = result;
        return res.status(200).send(SUCCESS);

    } catch (error) {
        SOME_THONG_WENTWRONG.message = error.message;
        return res.status(401).send(SOME_THONG_WENTWRONG);
    }
});

router.post("/api/medication/incident_from", async (req, res) => {

    var data = req.body;

    try {

        if (!data) {
            res.status(400).send(INVALID_INPUT);
        }

        let query = `INSERT INTO medication_incidents(
                                            date,
                                            support_worder,
                                            report_completed_by,
                                            medications,
                                            medication_due_time,
                                            dose_should_given,
                                            dose_given,
                                            describe_medication_incident,
                                            resson_for_incident,
                                            action_taken,
                                            coodinator_notified,
                                            doctor_notified,
                                            pharmacist_notified,
                                            kin_notified,
                                            treatment_by,
                                            coordinator_to_complete,
                                            evaluation,
                                            issue_resolved,
                                            no_improvement,
                                            improvement_describe,
                                            closed_outcome,
                                            roster_id,
                                            filled_by_user,
                                            created_at,
                                            updated_at,
                                            vkey)
                                    VALUES(
                                            '${data.date}',
                                            '${data.support_worder}',
                                            '${data.report_completed_by}',
                                            '${data.medications}',
                                            '${data.medication_due_time}',
                                            '${data.dose_should_given}',
                                            '${data.dose_given}',
                                            '${data.describe_medication_incident}',
                                            '${data.resson_for_incident}',
                                            '${data.action_taken}',
                                            '${data.coodinator_notified}',
                                            '${data.doctor_notified}',
                                            '${data.pharmacist_notified}',
                                            '${data.kin_notified}',
                                            '${data.treatment_by}',
                                            '${data.coordinator_to_complete}',
                                            '${data.evaluation}',
                                            '${data.issue_resolved}',
                                            '${data.no_improvement}',
                                            '${data.improvement_describe}',
                                            '${data.closed_outcome}',
                                            '${data.roster_id}',
                                            '${data.filled_by_user}',
                                            now(),
                                            now(),
                                            '${data.vkey}'
                                   ); `;

        var result = await database.query(query);

        SUCCESS.result = data;  //result;
        return res.status(200).send(SUCCESS);

    } catch (error) {
        SOME_THONG_WENTWRONG.message = error.message;
        return res.status(401).send(SOME_THONG_WENTWRONG);
    }
});

router.put("/api/medication/incident_from", async (req, res) => {

    var data = req.body;

    try {

        if (!data) {
            res.status(400).send(INVALID_INPUT);
        }

        let query = `UPDATE medication_incidents 
                                      SET   date='${data.date}',
                                            support_worder='${data.support_worder}',
                                            report_completed_by='${data.report_completed_by}',
                                            medications='${data.medications}',
                                            medication_due_time= '${data.medication_due_time}',
                                            dose_should_given= '${data.dose_should_given}',
                                            dose_given='${data.dose_given}',
                                            describe_medication_incident='${data.describe_medication_incident}',
                                            resson_for_incident= '${data.resson_for_incident}',
                                            action_taken='${data.action_taken}',
                                            coodinator_notified='${data.coodinator_notified}',
                                            doctor_notified='${data.doctor_notified}',
                                            pharmacist_notified= '${data.pharmacist_notified}',
                                            kin_notified= '${data.kin_notified}',
                                            treatment_by= '${data.treatment_by}',
                                            coordinator_to_complete= '${data.coordinator_to_complete}',
                                            evaluation= '${data.evaluation}',
                                            issue_resolved= '${data.issue_resolved}',
                                            no_improvement=  '${data.no_improvement}',
                                            improvement_describe= '${data.improvement_describe}',
                                            closed_outcome=  '${data.closed_outcome}',
                                            roster_id=   '${data.roster_id}',
                                            filled_by_user='${data.filled_by_user}',
                                            updated_at=  now(),
                                            vkey = '${data.vkey}'
                                            WHERE id = '${data.id}' ; `;

        var result = await database.query(query);

        SUCCESS.result = data;  //result;
        return res.status(200).send(SUCCESS);

    } catch (error) {
        SOME_THONG_WENTWRONG.message = error.message;
        return res.status(401).send(SOME_THONG_WENTWRONG);
    }
});

router.get("/api/medication/incident_from/:id", async (req, res) => {

    var data = req.body;

    try {

        if (!data) {
            res.status(400).send(INVALID_INPUT);
        }

        let query = `SELECT * from medication_incidents 
                     WHERE id= '${req.params.id}' ; `;

        var result = await database.query(query);

        SUCCESS.result = result[0] ? result[0] : null;
        return res.status(200).send(SUCCESS);

    } catch (error) {
        SOME_THONG_WENTWRONG.message = error.message;
        return res.status(401).send(SOME_THONG_WENTWRONG);
    }
});

module.exports = router;