const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function() {
    const db = config.get('db');
    mongoose.connect(db)
    .then(() => {
        winston.info(`Connected to ${db}.`);
        // console.log(`Connected to ${db}.`);
    });
    //Removed catch, since we have error.js doing the catching.
}