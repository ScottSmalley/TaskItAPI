const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

//***************************SCHEMA / MODEL***************************
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
});

userSchema.statics.lookup = function (userId){
    return this.findOne({
        '_id': userId
    });
};

const User = mongoose.model('User', userSchema);

//***************************INPUT VALIDATION***************************
function validateUser(user){
    const schema = Joi.object({
        name: Joi.string().min(5).max(150).required(),
        email: Joi.string().min(5).max(150).email().required(),
        password: Joi.string().min(5).max(1024).required()
    });
    return schema.validate(user);
};

//***************************EXPORTS***************************
exports.User = User;
exports.validateUser = validateUser;