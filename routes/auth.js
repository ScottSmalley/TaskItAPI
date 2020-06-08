/*
This module represents the auth route handler.
It is used to authenticate users based on the 
email and password given. If it passes scrutiny,
a JWT token is returned.
*/
const Joi = require('@hapi/joi');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const asyncMiddleware = require('../middleware/async');
const {User} = require('../models/user');

//***************************ROUTES***************************
router.post('/', asyncMiddleware(async (req, res) => {

    //Validate the email and password given.
    const { error } = validateAuth(req.body);
    if (!error) return res.status(400).send(error.message);

    //Query for a User based on the email given.
    let user = await User.findOne( { email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password.');
    
    //Use bcrypt to compare the password given to the password on the database.
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password.');

    //If made it this far, generate an Auth Token.
    const token = user.generateAuthToken();

    //Return the token.
    res.send(token);
}));

//***************************INPUT VALIDATION***************************
function validateAuth(req){
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).email().required(),
        password: Joi.string().min(5).max(255).required()
    });
    return schema.validate(req);
}

//***************************EXPORTS***************************
module.exports = router;
module.exports.validateAuth = validateAuth;