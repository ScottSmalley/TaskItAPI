/*
This module makes sure we have an environment variable containing
our secret phrase for JWT to authenticate users. Throws an error 
if it's not defined.
*/
const config = require('config');

module.exports = function() {
    if (!config.get('jwtPrivateKey')){
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
    }
}