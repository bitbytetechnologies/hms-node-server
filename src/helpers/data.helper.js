const express = require('express')
const database = require('../startup/dbconfig');

exports.GetManagers = async function () {
    try {
        //role_id = 1 --> Manager
        //role_id = 2 --> Staff
        //role_id = 3 --> Cleint
        let query = `SELECT users.id, users.username, users.email, roles.id as role_id ,roles.name as rolename FROM users INNER JOIN roles ON users.role_id = roles.id WHERE users.role_id=1; `;
        var result = await database.query(query);

        return result;

    } catch (error) {
        return null;
    }
}


exports.GetUser = async function (clientId) {
    try {
        //role_id = 1 --> Manager
        //role_id = 2 --> Staff
        //role_id = 3 --> Cleint
        let query = `SELECT  users.*, roles.name as rolename 
                       FROM  users 
                      INNER  JOIN roles ON users.role_id = roles.id 
                      WHERE  users.id = ${clientId} ; `;
        var result = await database.query(query);
        return result[0] ? result[0] : null;

    } catch (error) {
        return null;
    }
}

exports.GetRequest = async function (requestId) {
    try {
        let query = `SELECT req.*, u.username, u.email, u.address, u.mobile_no
                       FROM client_requests req
                 INNER JOIN users u on req.client_user_id = u.id
                 WHERE req.id = ${requestId} ; `;

        var result = await database.query(query);
        return result[0] ? result[0] : null;

    } catch (error) {
        return null;
    }
}


exports.GetRoster = async function (rosterId) {
    try {
        let query = `SELECT ros.*, 
                            u_client.username as client_username, u_client.email as client_email, 
                            u_client.address as client_address, u_client.mobile_no as client_mobile_no,
                            u_staff.username as staff_username, u_staff.email as staff_email, 
                            u_staff.address as staff_address, u_staff.mobile_no as staff_mobile_no
                 FROM  rosters ros 
                 INNER JOIN client_requests req on ros.req_id =  req.id
                 INNER JOIN users u_client on req.client_user_id = u_client.id
                 INNER JOIN users u_staff on ros.send_to_id = u_staff.id
                 WHERE ros.id = ${rosterId}; `;

        var result = await database.query(query);
        return result[0] ? result[0] : null;

    } catch (error) {
        return null;
    }
}



