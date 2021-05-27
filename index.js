const express = require('express');
const http = require('http');
const app = express();


const dotenv = require('dotenv');
dotenv.config();

require('./src/startup/routes')(app);
require('./src/startup/config')(app);
//require('./src/startup/db')();
const port = process.env.PORT || 3200;

http.createServer(app).listen(port, function () {
    console.log(`Server is listening on port ${port} - `);
});






