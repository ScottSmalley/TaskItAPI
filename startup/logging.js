/*
This module creates winston log functionality to 2 files:
uncaughtExceptions.log - catches and logs uncaughtExceptions and unhandledRejections,
and logfile.log - logs server connections.
*/
const winston = require('winston');

module.exports = function (){
    winston.exceptions.handle(
        new winston.transports.Console(),
        new winston.transports.File({filename: 'uncaughtExceptions.log'})
    );

    process.on('unhandledRejection', (ex) => {
        //To cause an unhandledException--which is caught by winston, 
        //and to log it in uncaughtExceptions.log
        throw(ex);
    });

    winston.add(new winston.transports.File({ filename: 'logfile.log'}));
}