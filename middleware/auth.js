const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next){
    //Grab the token value from the header.
    const token = req.header('taskit-auth-token');
    
    //If there isn't one. Send back a message.
    if (!token) return res.status(401).send('Access denied. No token provided.');

    //Try to verify it, if it throws an error, send back a message.
    try{
        //Decodes the token value by getting the environment variable value.
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

        //If successful, add it as a new body value to the request: user.
        req.user = decoded;

        //call next middleware.
        next();
    }
    catch(error){
        res.status(400).send('Invalid token.');
    }
}