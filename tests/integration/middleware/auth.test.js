const mongoose = require('mongoose');
const auth = require('../../../middleware/auth');
const {User} = require('../../../models/user');

describe('Auth Middleware', () => {
    let payload;
    let userId;
    let isAdmin;
    let token;
    let req;
    let res;

    beforeEach(() => {
        userId = mongoose.Types.ObjectId().toHexString();
        isAdmin = true;
        payload = {userId, isAdmin};

        //Create a JWT token.
        token = new User(payload).generateAuthToken();
        
        //Create a mock request object.
        req = {
            header: jest.fn().mockReturnValue(token)
        };

        //Create mock empty response object.
        res = { status: jest.fn() };
    });

    const run = () => {
        //Create a mock payload.
        payload = {
            _id: userId,
            isAdmin
        };

        //Create mock next function.
        const next = jest.fn();

        //Call the method, and now in req there
        //should be a req.user value.
        auth(req, res, next);

        //auth() puts a .user property on the req object
        //so we need to test that .user property.
        return req;
    };

    it('should contain a k/v pair for req.user with the payload of a valid JWT.', () => {
        run();

        expect(Object.keys(req.user)).toEqual(expect.arrayContaining([
            '_id', 
            'isAdmin'
        ]));
    });

});
