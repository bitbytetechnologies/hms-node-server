const auth = require('../middleware/auth');
const express = require('express');
const database = require('../startup/dbconfig');
const { SUCCESS, SOME_THONG_WENTWRONG } = require('../helpers/app_messages');

const router = express.Router(); // instead this will work.

router.get('/api/notifications/my/:user_id', async (req, res) => {
    try {

        var id = !req.params.user_id ? 0 : req.params.user_id;

        var query = `SELECT N.*,
                            USR_SND.username as 'send_by_user', ROLE_SND.name as 'send_by_role', 
                            USR_TO.username as 'send_to_user',  ROLE_TO.name as 'send_to_role' 
                     FROM notifications N 
               INNER JOIN users USR_SND  ON N.send_by_id      = USR_SND.Id
               INNER JOIN roles ROLE_SND ON N.send_by_role_id = ROLE_SND.Id
               INNER JOIN users USR_TO   ON N.send_to_id      = USR_TO.Id
               INNER JOIN roles ROLE_TO  ON N.send_to_role_id = ROLE_TO.Id
               WHERE N.send_to_id = ${id} ; `;

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


module.exports = router;
