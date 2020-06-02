const mongoose = require('mongoose');

module.exports = function() {
    mongoose.connect('mongodb://localhost/taskit_tests')
    .then(() => {
        // console.log(`Connected to MongoDB taskit`);
    })
    .catch(() => {
        // console.log('There was a problem connecting to MongoDB taskit');
    });
}