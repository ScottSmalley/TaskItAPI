const express = require('express');
const router = express.Router();
const {Task, validateTask} = require('../models/task');
const {User} = require('../models/user');

//***************************ROUTES***************************
router.get('/', async (req, res) => {
    const tasks = await Task.find();
    res.send(tasks);
});

router.post('/', async (req, res) => {
    const { error } = validateTask(req.body);
    if (error) return res.status(400).send(error.message);

    const existingUser = await User.lookup(req.body.userId);
    if (!existingUser) return res.status(400).send('Invalid User ID')

    const task = new Task({
        desc: req.body.desc,
        assignedTo: {
            _id: existingUser._id,
            name: existingUser.name
        }
    });

    res.send(task);
});

router.delete('/:id', async (req, res) => {
    const task = await Task.findByIdAndRemove(req.params.id);
    if (!task) return res.status(404).send('Couldn\'t find a task by that id.');

    res.send(task);
});

//***************************EXPORTS***************************
module.exports = router;