const auth = require('../middleware/auth');
const express = require('express');
const database = require('../startup/dbconfig');
const { SUCCESS, SOME_THONG_WENTWRONG } = require('../helpers/app_messages');

const router = express.Router(); // instead this will work.

router.get('/api/notifications/my/:user_id', async (req, res) => {
    try {

        var id = !req.params.user_id ? 0 : req.params.user_id;

        //unMarked = 0 , 1 = Approved, 2= Rejected

        var query = `SELECT N.*,
                            USR_SND.username as 'send_by_user', ROLE_SND.name as 'send_by_role', 
                            USR_TO.username as 'send_to_user',  ROLE_TO.name as 'send_to_role',
                            CR.approved 
                     FROM notifications N 
               INNER JOIN users USR_SND  ON N.send_by_id      = USR_SND.Id
               INNER JOIN roles ROLE_SND ON N.send_by_role_id = ROLE_SND.Id
               INNER JOIN users USR_TO   ON N.send_to_id      = USR_TO.Id
               INNER JOIN roles ROLE_TO  ON N.send_to_role_id = ROLE_TO.Id
               LEFT OUTER JOIN client_requests CR on N.ref_id =  CR.id 
               WHERE N.send_to_id = ${id} and N.notification_type= 'Client Request' order by N.date desc ; `;

        result = await database.query(query);
        SUCCESS.result = result[0] ? result : null;
        res.status(200).send(SUCCESS);
    }
    catch (error) {

        SOME_THONG_WENTWRONG.message = error.message;
        return res.status(401).send(SOME_THONG_WENTWRONG);
    }

});

router.get('/api/notifications/sendby/:user_id', async (req, res) => {
    try {

        var id = !req.params.user_id ? 0 : req.params.user_id;

        var query = `SELECT N.*,
                            USR_SND.username as 'send_by_user', ROLE_SND.name as 'send_by_role', 
                            USR_TO.username as 'send_to_user',  ROLE_TO.name as 'send_to_role' 
                     FROM notifications N 
               INNER JOIN users USR_SND ON N.send_by_id = USR_SND.Id
               INNER JOIN roles ROLE_SND ON N.send_by_role_id = ROLE_SND.Id
               INNER JOIN users USR_TO ON N.send_to_id = USR_TO.Id
               INNER JOIN roles ROLE_TO ON N.send_to_role_id = ROLE_TO.Id
               WHERE N.send_by_id = ${id} ; `;

        result = await database.query(query);

        SUCCESS.result = result[0] ? result : null;
        res.status(200).send(SUCCESS);
    }
    catch (error) {

        SOME_THONG_WENTWRONG.message = error.message;
        return res.status(401).send(SOME_THONG_WENTWRONG);
    }

});

router.get('/api/notifications', async (req, res) => {
    try {

        var id = !req.params.user_id ? 0 : req.params.user_id;

        var query = `SELECT N.*,
                            USR_SND.username as 'send_by_user', ROLE_SND.name as 'send_by_role', 
                            USR_TO.username as 'send_to_user',  ROLE_TO.name as 'send_to_role' 
                     FROM notifications N 
               INNER JOIN users USR_SND ON N.send_by_id = USR_SND.Id
               INNER JOIN roles ROLE_SND ON N.send_by_role_id = ROLE_SND.Id
               INNER JOIN users USR_TO ON N.send_to_id = USR_TO.Id
               INNER JOIN roles ROLE_TO ON N.send_to_role_id = ROLE_TO.Id 
               LEFT OUTER JOIN client_requests CR on N.ref_id =  CR.id ; `;

        result = await database.query(query);

        SUCCESS.result = result[0] ? result : null;
        res.status(200).send(SUCCESS);
    }
    catch (error) {

        SOME_THONG_WENTWRONG.message = error.message;
        return res.status(401).send(SOME_THONG_WENTWRONG);
    }

});

router.get("/api/notifications/count/:role_id", async (req, res) => {
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

router.post("/api/notifications/mark_read", async (req, res) => {

    const { req_id, user_id, approved } = req.body;

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

        let query1 = `UPDATE  client_requests
                        SET  approved =  ${approved}
                      WHERE   id = ${req_id} ; `;

        var result = await database.query(query1);

        if (!result[0]) {
            SUCCESS.result = null;
            return res.status(200).send(SUCCESS);
        }

        SUCCESS.result = result;
        return res.status(200).send(SUCCESS);

    } catch (error) {
        console.log(error);
        return res.status(401).send(SOME_THONG_WENTWRONG);
    }
});

module.exports = router;
