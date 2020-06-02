const express = require('express');
const router = express.Router();
const _ = require('lodash');
const {User, validateUser} = require('../models/user');

//***************************ROUTES***************************
//*************GET*************
router.get('/', async (req, res) => {
    const users = await User.find().select('-password');
    res.send(users);
});

//*************POST*************
router.post('/', async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.message);
    
    let payload = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };
    if (Object.keys(req.body).includes('isAdmin')) payload['isAdmin'] = req.body.isAdmin;
    
    const user = new User(payload);

    await user.save();

    res.send(_.pick(user, ['_id', 'name', 'email']));
});

//*************PUT*************


//*************DELETE*************


//***************************EXPORTS***************************
module.exports = router;