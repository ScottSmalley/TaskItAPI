const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');

module.exports = function (app){
    //Help protect against some common web vulnerabilities
    app.use(helmet());
    //Compresses the responses for better performance.
    app.use(compression());
    //Allows CORS since this is just a prototype, 
    //and we're using JWT where it counts.
    app.use(cors());
    app.options('/api/auth', cors());
}