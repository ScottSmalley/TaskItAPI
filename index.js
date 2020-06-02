const mongoose = require('mongoose');
const express = require('express');
const app = express();
const tasks = require('./routes/tasks');
const users = require('./routes/users');

//Startup
require ('./startup/validation')();
require ('./startup/db')();

app.use(express.json());
app.use('/api/tasks', tasks);
app.use('/api/users', users);

const port = process.env.port || 3000;
const server = app.listen(port, () => {
    // console.log(`Listening on port ${port}`);
});

module.exports = server;