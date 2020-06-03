/*
This module is to help with catching Promises.
It's a framework method so that you can give 
it a function to run, and each function will be ran with a try/catch
block so we can gracefully handle promise rejections and 
unexpectedExceptions.
*/
module.exports = function asyncMiddleware(handler) {
    //function to handle
    return async (req, res, next) => {
        try{
            await handler(req, res);
        }
        catch(ex){
            next(ex);
        }
    }
}