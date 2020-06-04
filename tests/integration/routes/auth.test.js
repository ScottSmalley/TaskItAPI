const mongoose = require('mongoose');
const request = require('supertest');
const {User} = require('../../../models/user');

describe('/api/auth', () => {
    let server;
    let email;
    let password;
    let payload;

    beforeEach(async () => {
        server = require('../../../index');
        email = 'user1@user1.com';
        password = '12345';
        payload = { name: 'user1', email, password };

        await request(server)
            .post('/api/users')
            .send(payload);

        //Reusing the payload for auth requests 
        //after the user is created above.            
        payload = { email, password };
    });

    afterEach(async () => {
        await User.remove({});
        await server.close();
    });

    const run = () => {
        return request(server)
        .post('/api/auth')
        .send(payload);
    };
    
//*************POST*************
    describe('POST /', () => {
        it('returns 400 if the email is missing.', async () => {
            payload = {password};
            
            const res = await run();
    
            expect(res.status).toBe(400);
        });
        
        it('returns 400 if the email doesnt exist.', async () => {
            payload = {email: '12345@12345.com', password};

            const res = await run();
    
            expect(res.status).toBe(400);
        });
        
        it('returns 400 if the password doesnt match the one in the database.', async () => {
            payload = {email, password: 'onetwothreefourfive'};

            const res = await run();
    
            expect(res.status).toBe(400);
        });

        it('returns a JWT Token if given a valid login information.', async () => {
            const res = await run();
    
            expect(res.status).toBe(200);
        });
    });
});