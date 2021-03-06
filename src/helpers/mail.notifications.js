const nodemailer = require("nodemailer");
const database = require('../startup/dbconfig');
let { FAIL, SUCCESS, INVALID_INPUT, SOME_THONG_WENTWRONG } = require('../helpers/app_messages');

const componseToList = async (toRoles) => {

    if (!toRoles) return "admin@gmail.com"

    var mailToString = "";
    if (toRoles) {
        toRoles.forEach(role => {
            mailToString = mailToString == "" ? role.email : (mailToString + ", " + role.email);
        });

    }
    return mailToString;
}

exports.SendUserMail = async (userObject) => {

    const { username, password, email } = userObject;

    var mailToList = email;

    let message = "<html><head></head><body>";
    message = message + "<strong> Dated : " + new Date().toString() + "</strong>";
    message = message + "<br/><br/><br/><br/>";
    message = message + "Dear Management,";
    message = message + "<br/><br/><br/>";
    message = message + "Your user details are as under:-";
    message = message + "<br/>";
    message = message + "<strong> User Full Name : " + username + "</strong>" + "<br/>";
    message = message + "<strong> user Id :" + email + "<strong>" + "<br/>";
    message = message + "<strong> password :" + password + "<strong>" + "<br/>";
    message = message + "</strong><i>Regards</i> </strong>";
    message = message + "<br/><br/>";
    message = message + "<br/>";
    message = message + "<b> HMS Management";
    message = message + "</body></html>";

    try {
        var transporter = nodemailer.createTransport({
            //service: 'googlemail.com',
            //host: "smtp.googlemail.com",
            //port: 465,
            service: 'gmail',
            //secure: true,
            auth: {
                user: "hms029722@gmail.com",
                pass: "#1234567"
            }
        });

        var mailOptions = {
            from: "hms029722@gmail.com",
            to: mailToList,    //'tariq.sulehri@gmail.com', // Can Add , Seprated List of Emails
            subject: "HMS User Created",
            html: message
        };

        await transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("Email Sending Error:", error);
            } else {
                console.log("Email Sent: " + info.response);
            }
        });

        SUCCESS.result = message;
        return SUCCESS;

    } catch (error) {
        console.log(error.message + "  ---- ");
        FAIL.message = error.message;
        return FAIL;
    }

}


exports.SendRequestMail = async (fromRole, toRoles, notificationType, request_id, client_request) => {

    const { username, nationality, mobile_no, email, address } = fromRole;

    console.log(client_request)

    var mailToList = await componseToList(toRoles);

    let message = "<html><head></head><body>";
    message = message + "<strong> Dated : " + new Date().toString() + "</strong>";
    message = message + "<br/><br/>";
    message = message + "Dear Management,";
    message = message + "<br/>";
    message = message + "Please do accept Test Notification:-" + "<br/>";
    message = message + "<i>City   : " + client_request.city + "</i><br/>";
    message = message + "<i>Country   : " + client_request.country + "</i><br/>";
    message = message + "<i>From Date : " + client_request.from_date + "</i><br/>";
    message = message + "<i>To Date   : " + client_request.to_date + "</i><br/>";
    message = message + "<br/><br/>";
    message = message + "</strong><i>Regards</i> </strong>";
    message = message + "<br/>";
    message = message + "<strong>" + username + "</strong>" + "<br/>";
    message = message + "<strong>" + nationality + "<strong>" + "<br/>";;
    message = message + "<strong>" + mobile_no + "<strong>" + "<br/>";;
    message = message + "<strong>" + email + "<strong>" + "<br/>";;
    message = message + "<strong>" + address + "<strong>" + "<br/>";
    message = message + "<br/>";
    message = message + "</body></html>";

    try {
        var transporter = nodemailer.createTransport({
            //service: 'googlemail.com',
            //host: "smtp.googlemail.com",
            //port: 465,
            service: 'gmail',
            //secure: true,
            auth: {
                user: "hms029722@gmail.com",
                pass: "#1234567"
            }
        });

        var mailOptions = {
            from: "hms029722@gmail.com",
            to: mailToList,    //'tariq.sulehri@gmail.com', // Can Add , Seprated List of Emails
            subject: "Client Request for Approval",
            html: message
        };

        var mailResult = await SaveRequestNotification(fromRole, toRoles, message, notificationType, request_id);
        await transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("Email Sending Error:", error);
            } else {
                console.log("Email Sent: " + info.response);
            }
        });

        SUCCESS.result = message;
        return SUCCESS;

    } catch (error) {
        console.log(error.message + "  ---- ");
        FAIL.message = error.message;
        return FAIL;
    }

}


exports.SendRequestToStaffMail = async (fromRole, toRoles, notificationType, request_id, roster) => {

    const { username, nationality, mobile_no, email, address } = fromRole;

    var mailToList = toRoles.email;

    let message = "<html><head></head><body>";
    message = message + "<strong> Dated : " + new Date().toString() + "</strong>";
    message = message + "<br/";
    message = message + "Dear " + toRoles.username + ",";
    message = message + "<br/>";
    message = message + "Please do advise if your can provide service to out client as per following Schedule :-" + "<br/><br/>";
    message = message + "<i>From Date : " + roster.from_date.toString() + "</i><br/>";
    message = message + "<i>To Date   : " + roster.to_date.toString() + "</i><br/>";
    message = message + "<i>From Time : " + roster.from_time.toString() + "</i><br/>";
    message = message + "<i>To Time   : " + roster.to_time.toString() + "</i><br/>";
    message = message + "<br/>";
    message = message + "</strong><i>Regards</i> </strong>";
    message = message + "<br/>";
    message = message + "<strong>" + username + "</strong>" + "<br/>";
    message = message + "<strong>" + nationality + "<strong>" + "<br/>";;
    message = message + "<strong>" + mobile_no + "<strong>" + "<br/>";;
    message = message + "<strong>" + email + "<strong>" + "<br/>";;
    message = message + "<strong>" + address + "<strong>" + "<br/>";;
    message = message + "</body></html>";


    try {
        var transporter = nodemailer.createTransport({
            service: 'googlemail.com',
            host: "smtp.googlemail.com",
            port: 465,
            //service: 'gmail',
            //secure: true,
            auth: {
                user: "hms029722@gmail.com",
                pass: "#1234567"
            }
        });

        var mailOptions = {
            from: "hms029722@gmail.com",
            to: mailToList,    //'tariq.sulehri@gmail.com', // Can Add , Seprated List of Emails
            subject: "Client Request for Approval",
            html: message
        };

        var roles = []
        roles.push(toRoles);

        var mailResult = await SaveRequestNotification(fromRole, roles, message, notificationType, request_id);
        await transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("Email Sending Error:", error);
            } else {
                console.log("Email Sent: " + info.response);
            }
        });

        SUCCESS.result = message;
        return SUCCESS;

    } catch (error) {
        console.log(error.message + "  ---- ");
        SOME_THONG_WENTWRONG.message = error.message;
        return SOME_THONG_WENTWRONG;
    }

}

exports.SendRequestApprovalToManagement = async (fromRole, toRoles, notificationType, roster, clientRequest) => {

    const { username, nationality, mobile_no, email, address } = fromRole;
    const request_id = clientRequest.id;

    var mailToList = await componseToList(toRoles);

    let message = "<html><head></head><body>";
    message = message + "<strong> Dated : " + new Date().toString() + "</strong>";
    message = message + "<br/";
    message = message + "Dear Manger's,";
    message = message + "<br/";
    message = message + "Following Roster Request is approved:-" + "<br/><br/>";
    message = message + "<b>Request :   " + roster.req_id.toString() + "</b><br/>";
    message = message + "<b>Roster Id : " + roster.id.toString() + "</b><br/>";
    message = message + "<i>From Date : " + roster.from_date.toString() + "</i><br/>";
    message = message + "<i>To Date   : " + roster.to_date.toString() + "</i><br/>";
    message = message + "<i>From Time : " + roster.from_time.toString() + "</i><br/>";
    message = message + "<i>To Time   : " + roster.to_time.toString() + "</i><br/>";

    message = message + "<br/>";
    message = message + "</strong><i>Regards</i> </strong>";
    message = message + "<br/>";
    message = message + "<strong>" + username + "</strong>" + "<br/>";
    message = message + "<strong>" + nationality + "<strong>" + "<br/>";;
    message = message + "<strong>" + mobile_no + "<strong>" + "<br/>";;
    message = message + "<strong>" + email + "<strong>" + "<br/>";;
    message = message + "<strong>" + address + "<strong>" + "<br/>";;
    message = message + "<br/>";
    message = message + "</body></html>";

    try {
        var transporter = nodemailer.createTransport({
            //service: 'googlemail.com',
            //host: "smtp.googlemail.com",
            //port: 465,
            service: 'gmail',
            //secure: true,
            auth: {
                user: "hms029722@gmail.com",
                pass: "#1234567"
            }
        });

        var mailOptions = {
            from: "tariq.sulehri@gmail.com",
            to: mailToList,
            subject: "Client Request for Approval",
            html: message
        };

        var mailResult = await SaveRequestNotification(fromRole, toRoles, message, notificationType, roster.id);
        await transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("Email Sending Error:", error);
            } else {
                console.log("Email Sent: " + info.response);
            }
        });

        SUCCESS.result = message;
        return SUCCESS;

    } catch (error) {
        console.log(error.message + "  ---- ");
        SOME_THONG_WENTWRONG.message = error.message;
        return SOME_THONG_WENTWRONG;
    }

}

async function SaveRequestNotification(fromRole, toRoles, notificationText, notificationType, request_id) {

    var date = new Date();
    var send_by_id = fromRole.id;
    var send_by_email = fromRole.email.toString();
    var send_by_role_id = fromRole.role_id;

    notificationType = notificationType ? notificationType : "Undefined";

    try {

        var params = [];

        toRoles.forEach(async (role) => {
            params = [
                date,
                request_id,
                notificationType,
                send_by_id,
                send_by_email,
                send_by_role_id,
                notificationText,
                role.email.toString(),
                role.id,
                role.role_id
            ];

            let query = `INSERT INTO notifications (
                                     date,
                                     ref_id,
                                     notification_type,
                                     send_by_id,
                                     send_by_email,
                                     send_by_role_id,
                                     notification_text,
                                     send_to_email,
                                     send_to_id,
                                     send_to_role_id
                                ) 
                       VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ); `;

            var result = await database.query(query, params);

        });

        return true;

    } catch (error) {
        console.log(error.message);
        return false;
    }

}

async function SaveRosterNotification(fromRole, toRole, notificationText, notificationType, request_id) {

    var date = new Date();
    var send_by_id = fromRole.id;
    var send_by_email = fromRole.email.toString();
    var send_by_role_id = fromRole.role_id;

    notificationType = notificationType ? notificationType : "Undefined";

    try {

        var params = [];

        params = [
            date,
            request_id,
            notificationType,
            send_by_id,
            send_by_email,
            send_by_role_id,
            notificationText,
            toRole.email.toString(),
            toRole.id,
            toRole.role_id
        ];

        let query = `INSERT INTO notifications (
                                     date,
                                     ref_id,
                                     notification_type,
                                     send_by_id,
                                     send_by_email,
                                     send_by_role_id,
                                     notification_text,
                                     send_to_email,
                                     send_to_id,
                                     send_to_role_id
                                ) 
                       VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ); `;

        var result = await database.query(query, params);
        return true;

    } catch (error) {
        console.log(error.message);
        return false;
    }

}


//module.exports = SendMail;