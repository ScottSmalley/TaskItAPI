const winston = require('winston');
const express = require('express');
const app = express();

//Startup
require('./startup/logging')();
require('./startup/config')();
require ('./startup/validation')();
require ('./startup/routes')(app);
require ('./startup/db')();

//Server start
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    winston.info(`Now listening on port ${port}...`);
    console.log(`Now listening on port ${port}...`);
});

module.exports = server;