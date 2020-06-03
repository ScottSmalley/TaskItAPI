/*
Route Handling logic for /api/users.
Includes GET POST PUT DELETE.
*/
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const validateObjectId = require('../middleware/validateObjectId');
const asyncMiddleware = require('../middleware/async');
const {User, validateUser} = require('../models/user');

//***************************ROUTES***************************
//*************GET*************
router.get('/', asyncMiddleware(async (req, res) => {
    const users = await User.find().select('-password');
    res.send(users);
}));

//*************POST*************
router.post('/', asyncMiddleware(async (req, res) => {
    
    //Check for valid input
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.message);
    
    //Check if the email was already used in an account.
    let user = await User.findOne({ email: req.body.email });
    if (user) return req.status(400).send('Email already registered.');
    
    //Generate the salt to use in the password hash.
    const salt = await bcrypt.genSalt(10);

    //Build the payload of the User, including the hashed password.
    let payload = {
        name: req.body.name,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, salt)
    };

    //If there's an isAdmin value, add it to the payload.
    if (Object.keys(req.body).includes('isAdmin')) payload['isAdmin'] = req.body.isAdmin;

    //Generate the User.
    user = new User(payload);

    //Save it.
    await user.save();

    //Generate the JWT Auth Token.
    const token = user.generateAuthToken();

    //Send back the JWT Token in the header, 
    //and send back the user, but don't send back the password.
    res.header('taskit-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
}));

//*************PUT*************
router.put('/:id', validateObjectId, asyncMiddleware(async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.message);

    const user = await User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }, {new: true});

    if(!user) return res.status(404).send('Couldn\'t find a user by that ID.');

    res.send(user);
}));

//*************DELETE*************
router.delete('/:id', validateObjectId, asyncMiddleware(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if(!user) return res.status(404).send('Couldn\'t find a user by that ID.');

    res.send(user);
}));

//***************************EXPORTS***************************
module.exports = router;