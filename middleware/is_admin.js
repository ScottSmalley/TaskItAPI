module.exports = function(req, res, next){
    //If isAdmin is false, return Access Denied status.
    if(!req.user.isAdmin) return res.status(403).send('Access denied.');

    next();
}