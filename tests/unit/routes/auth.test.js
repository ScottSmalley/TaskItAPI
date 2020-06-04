const Joi = require('@hapi/joi');
const {validateAuth} = require('../../../routes/auth');

describe('Auth validateAuth', () => {
    let email = 'user1@user1.com';
    let password = '12345';
    let payload = { email, password };
    
    it('returns an error object if email is missing.', () => {
        payload = {password};

        const res = validateAuth(payload);

        expect(res).toHaveProperty('error');
    });
    
    it('returns an error object if password is missing.', () => {
        payload = {email};

        const res = validateAuth(payload);

        expect(res).toHaveProperty('error');
    });
    
    it('returns an error object if email is invalid.', () => {
        payload = {email: '12345', password};

        const res = validateAuth(payload);

        expect(res).toHaveProperty('error');
    });
    
    it('returns an error object if email is less than 5 characters.', () => {
        payload = {email: '1@5.', password};

        const res = validateAuth(payload);

        expect(res).toHaveProperty('error');
    });
    
    it('returns an error object if email is more than 255 characters.', () => {
        payload = {email: new Array(257).join('a'), password};

        const res = validateAuth(payload);

        expect(res).toHaveProperty('error');
    });
    
    it('returns an error object if password is less than 5 characters.', () => {
        payload = {email, password: '1234'};

        const res = validateAuth(payload);

        expect(res).toHaveProperty('error');
    });
    
    it('returns an error object if password is more than 255 characters.', () => {
        payload = {email, password: new Array(257).join('a')};

        const res = validateAuth(payload);

        expect(res).toHaveProperty('error');
    });

});