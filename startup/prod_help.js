const helmet = require('helmet');
const compression = require('compression');

module.exports = function (app){
    //Help protect against some common web vulnerabilities
    app.use(helmet());
    //Compresses the responses for better performance.
    app.use(compression());
}