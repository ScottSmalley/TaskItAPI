const mongoose = require('mongoose');
const request = require('supertest');
const {User} = require('../../../models/user');

describe('/api/users', () => {
    let server;

    beforeEach( () => {
        server = require('../../../index');
    });

    afterEach( async () => {
        await User.remove({});
        await server.close();
    });
    
    describe('GET /', () => {
        it('should return all users', async () => {
            await User.collection.insertMany([
                {name: 'user1', email: 'user1@user1.com', password: '12345'},
                {name: 'user2', email: 'user2@user2.com', password: '12345'}
            ]);

            const res = await request(server).get('/api/users');

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(Object.keys(res.body[0])).toEqual(expect.arrayContaining([
                'name',
                'email'
            ]));
            expect(Object.keys(res.body[1])).toEqual(expect.arrayContaining([
                'name',
                'email'
            ]));
        });
    });

    describe('POST /', () => {
        let name;
        let email;
        let password;
        let payload;
        
        beforeEach( () => {
             userId = mongoose.Types.ObjectId();
             name = 'user1';
             email = 'user1@user1.com';
             password = '12345';
             payload = {name, email, password};
        });

         const run = () => {
             return request(server)
                 .post('/api/users')
                 .send(payload);
         }

         it('should return 400 if name is missing.', async () => {
            payload = {email, password};

            const res = await run();

            expect(res.status).toBe(400);
         });
         
         it('should return 400 if email is missing.', async () => {
            payload = {name, password};

            const res = await run();

            expect(res.status).toBe(400);
         });
         
         it('should return 400 if password is missing.', async () => {
            payload = {name, email};

            const res = await run();

            expect(res.status).toBe(400);
         });

         it('should return 400 if name is less than 5 characters.', async () => {
            payload = {name: '1234', email, password};

            const res = await run();

            expect(res.status).toBe(400);
         });
         
         it('should return 400 if name is less than 5 characters.', async () => {
            payload = {name: new Array(1026).join('a'), email, password};

            const res = await run();

            expect(res.status).toBe(400);
         });
         
         it('should return 400 if email is less than 5 characters.', async () => {
            payload = {name, email: '1234', password};

            const res = await run();

            expect(res.status).toBe(400);
         });
         
         it('should return 400 if email is less than 5 characters.', async () => {
            payload = {name, email: new Array(257).join('a'), password};

            const res = await run();

            expect(res.status).toBe(400);
         });
         
         it('should return 400 if email is an invalid email.', async () => {
            payload = {name, email: new Array(7).join('a'), password};

            const res = await run();

            expect(res.status).toBe(400);
         });

         it('should return 400 if password is less than 5 characters.', async () => {
            payload = {name, email, password: '1234'};

            const res = await run();

            expect(res.status).toBe(400);
         });
         
         it('should return 400 if password is less than 5 characters.', async () => {
            payload = {name, email, password: new Array(1026).join('a')};

            const res = await run();

            expect(res.status).toBe(400);
         });
         
         it('should return 400 if isAdmin is invalid', async () => {
            payload = {name, email, password, isAdmin: '12345'};

            const res = await run();

            expect(res.status).toBe(400);
         });
         
         it('should return the name if given valid data.', async () => {
            const res = await run();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', 'user1');
         });
         
         it('should return the email if given valid data.', async () => {
            const res = await run();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('email', 'user1@user1.com');
         });
         
         it('should return the user if given valid data.', async () => {
            const res = await run();

            expect(res.status).toBe(200);
            expect(Object.keys(res.body)).toEqual(expect.arrayContaining([
                '_id',
                'name',
                'email'
            ]));
         });
         
         it('should return the user if given valid data, including isAdmin value.', async () => {
            payload = {name, email, password, isAdmin: true};
            const res = await run();

            expect(res.status).toBe(200);
            expect(Object.keys(res.body)).toEqual(expect.arrayContaining([
                '_id',
                'name',
                'email'
            ]));
         });
    });

    // describe('PUT /', () => {

    // });

    // describe('DELETE /', () => {

    // });

});