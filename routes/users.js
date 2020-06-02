const express = require('express');
const router = express.Router();
const {User, validateUser} = require('../models/user');

//***************************ROUTES***************************
router.get('/', (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.message);
    res.send('Hello Users!');
})


//***************************EXPORTS***************************
module.exports = router;