const mongoose = require('mongoose');
const request = require('supertest');
const bcrypt = require('bcrypt');
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

         it('should return 400 if the email is already exists in the database.', async () => {
            const user = new User({name, email, password});

            await user.save();

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

    describe('PUT /', () => {
      let name;
      let email;
      let password;
      let payload;
      let token;

      beforeEach( async () => {
         userId = mongoose.Types.ObjectId();
         name = 'user1';
         email = 'user1@user1.com';
         password = '12345';
         payload = { 
            _id: userId, 
            name, 
            email, 
            password };
        
         const user = new User(payload);
         
         await user.save();
         
         //PUT now requires a JWT token in the header.
         token = user.generateAuthToken();

         //Reusing the payload var for the run method.
         payload = {
            name,
            email, 
            password
         };
     });

     afterEach( async () => {
         await User.remove({});
     });
      
      const run = () => {
         return request(server)
             .put('/api/users/' + userId)
             .set('taskit-auth-token', token)
             .send(payload);
     }

      it('should return 401 if token header is missing.', async () => {
         token = '';

         const res = await run();

         expect(res.status).toBe(401);
      });
      
      it('should return 400 if token is invalid.', async () => {
         token = '12345';

         const res = await run();

         expect(res.status).toBe(400);
      });

      it('should return 400 if userId is invalid.', async () => {
         userId = '12345';

         const res = await run();

         expect(res.status).toBe(400);
      });

      it('should return 404 if userId doesnt exist.', async () => {
         userId = mongoose.Types.ObjectId();

         const res = await run();

         expect(res.status).toBe(404);
      });

      it('should return 400 if name is missing.', async () => {
         payload = {email, password};

         const res = await run();

         expect(res.status).toBe(400);
      });

      it('should return the user if given valid data.', async () => {
         const res = await run();

         expect(res.status).toBe(200);
         expect(Object.keys(res.body)).toEqual(expect.arrayContaining([
            'name',
            'email'
         ]));
      });

      it('should update the name if given valid data.', async () => {
         payload = {name: 'user1test', email, password};

         const res = await run();

         expect(res.status).toBe(200);
         expect(res.body).toHaveProperty('name', 'user1test');
      });
      
      it('should update the email if given valid data.', async () => {
         payload = {name, email: 'user1test@user1test.com', password};

         const res = await run();

         expect(res.status).toBe(200);
         expect(res.body).toHaveProperty('email', 'user1test@user1test.com');
      });
    });

    describe('DELETE /', () => {
      let userId;
      let token;

      beforeEach( async () => {
         userId = mongoose.Types.ObjectId();
         const user = new User({ 
            _id: userId, 
            name: 'user1', 
            email: 'user1@user1.com', 
            password: '12345',
            isAdmin: true
         });
         
         await user.save();
         
         token = user.generateAuthToken();
     });

     afterEach( async () => {
         await User.remove({});
     });

     const run = () => {
         return request(server)
            .delete('/api/users/' + userId)
            .set('taskit-auth-token', token);
     };

     it('should return 403 if the payload value, isAdmin is false.', async () => {
            
         //Remove the user that was created in the beforeEach() to make our own.
         await User.remove({});

         //Create a user that has isAdmin flagged as false.
         const user = new User({
            _id: userId,
            name: 'user1',
            email: 'user1@user1.com',
            password: '12345'
         });

         await user.save();

         token = user.generateAuthToken();

         const res = await run();

         expect(res.status).toBe(403);
      });
      
      it('should return 401 if token header is missing.', async () => {
         token = '';

         const res = await run();

         expect(res.status).toBe(401);
      });
   
      it('should return 400 if token is invalid.', async () => {
         token = '12345';

         const res = await run();

         expect(res.status).toBe(400);
      });

      it('should return 400 error if given an invalid userId.', async () => {
         userId = '12345';

         const res = await run();

         expect(res.status).toBe(400);
      });
      
      it('should return 404 error if the user doesnt exist.', async () => {
         await User.remove({});

         const res = await run();

         expect(res.status).toBe(404);
      });
      
      it('should return the user if given valid input.', async () => {
         const res = await run();

         expect(res.status).toBe(200);
         expect(Object.keys(res.body)).toEqual(expect.arrayContaining([
            'name',
            'email'
         ]));
      });
    });
});