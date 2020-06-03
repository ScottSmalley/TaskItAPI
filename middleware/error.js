const winston = require('winston');

module.exports = function(err, req, res, next){
    //Error logging
    winston.error(err.message);

    //Internal Server Error catch.
    res.status(500).send('Something went wrong.')
}