const mysql = require("mysql");
const util = require('util');

//Local db
// let db_con = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '1234',
//     database: 'travel-db'
// });

let db_con = mysql.createConnection({
    host: '104.219.233.225',//'localhost',
    user: 'bitbyte1_admin',
    password: 'tariqsulehri',
    database: 'bitbyte1_hms-db'
});



// Live Test DB
// let db_con = mysql.createConnection({
//     host: 'sql5.freesqldatabase.com',
//     user: 'sql5406277',
//     password: 't9Iqc3kfY9',
//     database: 'sql5406277'
// });


// Connect to MySQL server
db_con.connect((err) => {
    if (err) {
        console.log("Database Connection Failed !!!", err);
    } else {
        console.log("connected to Database");
    }
});

db_con.query = util.promisify(db_con.query)
module.exports = db_con;