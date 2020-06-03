/*
Models a task, and validates input regarding tasks.
*/
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

//***************************SCHEMA / MODEL***************************
const taskSchema = new mongoose.Schema({
    desc: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 150
    },
    assignedTo: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            }
        })
    }
});

const Task = mongoose.model('Task', taskSchema);

//***************************INPUT VALIDATION***************************
function validateTask(task){
    const schema = Joi.object({
        desc: Joi.string().min(5).max(150).required(),
        userId: Joi.objectId().required()
    });
    return schema.validate(task);
};

//***************************EXPORTS***************************
exports.Task = Task;
exports.validateTask = validateTask;