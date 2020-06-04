const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');
const {User, validateUser} = require('../../../models/user');

describe('User.validateUser()', () => {
    let name;
    let email;
    let password;
    let isAdmin;
    beforeEach(() => {
        name = 'user1';
        email = 'user1@user1.com';
        password = '12345';
        payload = {name, email, password};
    });

    const run = () => {
        return new User(payload);
    };
    
    it('should return with an error object if name is missing.', () => {
        payload = {email, password};

        const user = run();

        const res = validateUser(user);

        expect(res).toHaveProperty('error');
    });

    it('should return with an error object if email is missing.', () => {
        payload = {name, password};

        const user = run();

        const res = validateUser(user);

        expect(res).toHaveProperty('error');
    });

    it('should return with an error object if password is missing.', () => {
        payload = {name, email};

        const user = run();

        const res = validateUser(user);

        expect(res).toHaveProperty('error');
    });
    
    it('should return with an error object if name is less than 5 characters.', () => {
        name = '1234';

        const user = run();

        const res = validateUser(user);

        expect(res).toHaveProperty('error');
    });

    it('should return with an error object if name is more than 50 characters.', () => {
        name = new Array(52).join('a');

        const user = run();

        const res = validateUser(user);

        expect(res).toHaveProperty('error');
    });
    
    it('should return with an error object if email is less than 5 characters.', () => {
        email = '1234';

        const user = run();

        const res = validateUser(user);

        expect(res).toHaveProperty('error');
    });

    it('should return with an error object if email is more than 255 characters.', () => {
        email = new Array(257).join('a');

        const user = run();

        const res = validateUser(user);

        expect(res).toHaveProperty('error');
    });
    
    it('should return with an error object if email is an invalid email.', () => {
        email = '12345';

        const user = run();

        const res = validateUser(user);

        expect(res).toHaveProperty('error');
    });
    
    it('should return true if email is an valid email.', () => {
        email = '12345@12345.com';

        const user = run();

        const res = validateUser(user);

        expect(res).toBeTruthy();
    });

    it('should return with an error object if password is less than 5 characters.', () => {
        password = '1234';

        const user = run();

        const res = validateUser(user);

        expect(res).toHaveProperty('error');
    });

    it('should return with an error object if password is more than 50 characters.', () => {
        password = new Array(52).join('a');

        const user = run();

        const res = validateUser(user);

        expect(res).toHaveProperty('error');
    });

    it('should return with an error object if given an invalid isAdmin key/value pair.', () => {
        payload = {name, email, password, isAdmin: '12345'};

        const user = run();
        
        const res = validateUser(user);

        expect(res).toHaveProperty('error');
    });

    it('should return true if given a valid isAdmin key/value pair.', () => {
        payload = {name, email, password, isAdmin: true};

        const user = run();
        
        const res = validateUser(user);

        expect(res).toBeTruthy();
    });

    it('should return true if given valid input.', () => {
        const user = run();
        
        const res = validateUser(user);

        expect(res).toBeTruthy();
    });
});

describe('User.generateAuthToken()', () => {
    it('should return a valid jwtAuthToken.', () => {
        //Payload for JWT
        const payload = {
            _id: mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        };

        //Create a user with the payload.
        const user = new User(payload);

        //Generate the token.
        const token = user.generateAuthToken();

        //Verify and decode it.
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

        //Should match the payload given.
        expect(decoded).toMatchObject(payload);
    });
});