/*
Models a user, validates input regarding users, 
and looks up users in our database.
*/
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

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

//Looks up User objects in the database.
userSchema.statics.lookup = function (userId){
    return this.findOne({
        '_id': userId
    });
};

//Generates an auth token using JWT.
userSchema.methods.generateAuthToken = function (){
    return jwt.sign({ _id: this.id, isAdmin: this.isAdmin}, config.get("jwtPrivateKey"));
}

const User = mongoose.model('User', userSchema);

//***************************INPUT VALIDATION***************************
function validateUser(user){
    const schema = Joi.object({
        name: Joi.string().min(5).max(150).required(),
        email: Joi.string().min(5).max(150).email().required(),
        password: Joi.string().min(5).max(1024).required(),
        isAdmin: Joi.boolean()
    });
    return schema.validate(user);
};

//***************************EXPORTS***************************
exports.User = User;
exports.validateUser = validateUser;