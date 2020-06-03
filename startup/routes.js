/*
This module represents all the route handling, 
and handling any errors that may come up.
*/
const express = require('express');
const tasks = require('../routes/tasks');
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');

module.exports = function (app){
    app.use(express.json());
    app.use('/api/tasks', tasks);
    app.use('/api/users', users);
    app.use('/api/auth', auth);

    //Keep last, for error catching.
    app.use(error);
}