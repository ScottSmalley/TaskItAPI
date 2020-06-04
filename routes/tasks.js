/*
Route Handling logic for /api/tasks
*/
const express = require('express');
const router = express.Router();
const validateObjectId = require('../middleware/validateObjectId');
const is_admin = require('../middleware/is_admin');
const auth = require('../middleware/auth');
const asyncMiddleware = require('../middleware/async');
const {Task, validateTask} = require('../models/task');
const {User} = require('../models/user');

//***************************ROUTES***************************
//*************GET*************
router.get('/', asyncMiddleware(async (req, res) => {
    const tasks = await Task.find();
    res.send(tasks);
}));

//*************POST*************
router.post('/', asyncMiddleware(async (req, res) => {
    const { error } = validateTask(req.body);
    if (error) return res.status(400).send(error.message);

    const existingUser = await User.lookup(req.body.userId);
    if (!existingUser) return res.status(400).send('Invalid User ID');

    const task = new Task({
        desc: req.body.desc,
        assignedTo: {
            _id: existingUser._id,
            name: existingUser.name
        }
    });

    await task.save();

    res.send(task);
}));

//*************PUT*************
router.put('/:id', [auth, validateObjectId], asyncMiddleware(async (req, res) => {
    const { error } = validateTask(req.body);
    if (error) return res.status(400).send(error.message);

    
    const existingUser = await User.lookup(req.body.userId);
    if (!existingUser) return res.status(404).send('Couldn\'t find a user by that ID.');
    
    const existingTask = await Task.findByIdAndUpdate(req.params.id, { 
        desc: req.body.desc, 
        assignedTo: {
            _id: existingUser._id,
            name: existingUser.name
        }
    }, {new: true});

    if (!existingTask) return res.status(404).send('Couldn\'t find a task by that ID.');

    res.send(existingTask);
}));

//*************DELETE*************
router.delete('/:id', [auth, validateObjectId, is_admin], asyncMiddleware(async (req, res) => {
    const task = await Task.findByIdAndRemove(req.params.id);
    if (!task) return res.status(404).send('Couldn\'t find a task by that id.');

    res.send(task);
}));

//***************************EXPORTS***************************
module.exports = router;