const mongoose = require('mongoose');
const request = require('supertest');
const {User} = require('../../../models/user');
const {Task} = require('../../../models/task');

describe('/api/tasks', () => {
    let server;
    beforeEach( () => {
        server = require('../../../index');
    });
    
    afterEach( async () => {
        await server.close();
        await User.remove({});
        await Task.remove({});
    });

    describe('GET /', () => {
        it('should return all tasks.', async () => {
            await Task.collection.insertMany([
                { 
                    desc: 'task1',
                    assignedTo: {
                        _id: mongoose.Types.ObjectId(),
                        name: 'name1'
                    }
                },
                { 
                    desc: 'task2',
                    assignedTo: {
                        _id: mongoose.Types.ObjectId(),
                        name: 'name2'
                    }
                }
            ]);      
            const res = await request(server).get('/api/tasks');
    
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(task1 => task1.desc === 'task1'));
            expect(res.body.some(task2 => task2.desc === 'task2'));
        });
    })
    
    describe('POST /', () => {
        let desc;
        let userId;
        let payload;
    
        beforeEach( async () => {
            desc = 'task1';
            userId = mongoose.Types.ObjectId();
            payload = { desc, userId };
            const user = new User({
                _id: userId,
                name: '12345',
                email: '12345@12345.com',
                password: '12345'
            });
            await user.save();
        });
    
        const run = () => {
            return request(server)
                .post('/api/tasks')
                .send(payload);
        }
    
        it('should return 400 status if desc is missing.', async () => {
            payload = { userId };
            
            const res = await run();
    
            expect(res.status).toBe(400);
        });
        
        it('should return 400 status if user is not found.', async () => {
            await User.remove({});
            
            const res = await run();
    
            expect(res.status).toBe(400);
        });
        
        it('should return 200 status if given valid input.', async () => {
            const res = await run();
    
            expect(res.status).toBe(200);
        });
        
        it('should return the task if given valid input.', async () => {
            const res = await run();
    
            expect(Object.keys(res.body)).toEqual(expect.arrayContaining([
                'desc',
                'assignedTo'
            ]));
        });
    });

    describe('PUT /:id', () => {
        let desc;
        let userId;
        let taskId;
        let payload;
    
        beforeEach( async () => {
            desc = 'task1';
            userId = mongoose.Types.ObjectId();
            taskId = mongoose.Types.ObjectId();
            payload = { desc, userId };

            const user = new User({
                _id: userId,
                name: '12345',
                email: '12345@12345.com',
                password: '12345'
            });

            await user.save();

            const task = new Task({
                _id: taskId,
                desc: desc,
                assignedTo: {
                    _id: userId,
                    name: user.name
                }
            });

            await task.save();
        });

        afterEach( async () => {
            await User.remove({});
            await Task.remove({});
        })

        const run = () => {
            return request(server)
                .put('/api/tasks/' + taskId)
                .send(payload);
        }

        it('should return 400 if the desc is missing.', async () => {
            payload = { userId };

            const res = await run();

            expect(res.status).toBe(400);
        });
        
        it('should return 400 if desc is less than 5 characters.', async () => {
            payload = {desc: '1234', userId};
            
            const res = await run();
            
            expect(res.status).toBe(400);
        });
        
        it('should return 400 if desc is more than 150 characters.', async () => {
            payload = {desc: new Array(152).join('a'), userId};

            const res = await run();

            expect(res.status).toBe(400);
        });

        it('should return 400 if userId is invalid.', async () => {
            payload = {desc, userId: '12345'};
            
            const res = await run();
            
            expect(res.status).toBe(400);
        });
        
        it('should return 404 if taskId is doesnt exist.', async () => {
            taskId = mongoose.Types.ObjectId();
            
            const res = await run();
            
            expect(res.status).toBe(404);
        });
        
        it('should return 404 if userId is doesnt exist.', async () => {
            payload = {desc, userId: mongoose.Types.ObjectId()};
            
            const res = await run();
            
            expect(res.status).toBe(404);
        });
        
        it('should return update the desc if given valid input.', async () => {
            payload = {desc: 'task1test', userId};
            
            const res = await run();
            
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('assignedTo');
            expect(res.body).toHaveProperty('desc', 'task1test');
        });
        
        it('should should update the assignedTo _id given valid input.', async () => {
            const newUserId = mongoose.Types.ObjectId();
            const newUser = new User({
                _id: newUserId,
                name: 'John Doe',
                email: '12345@12345.com',
                password: '12345'
            });
            await newUser.save();

            payload = {desc, userId: newUserId};
            
            const res = await run();
            
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('desc');
            expect(res.body).toHaveProperty('assignedTo._id', newUserId.toHexString());
            expect(res.body).toHaveProperty('assignedTo.name');
        });
        
        it('should should update the assignedTo name given valid input.', async () => {
            const newUserId = mongoose.Types.ObjectId();
            const newUser = new User({
                _id: newUserId,
                name: 'John Doe',
                email: '12345@12345.com',
                password: '12345'
            });
            await newUser.save();

            payload = {desc, userId: newUserId};
            
            const res = await run();
            
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('desc');
            expect(res.body).toHaveProperty('assignedTo._id');
            expect(res.body).toHaveProperty('assignedTo.name', 'John Doe');
        });
    });

    describe('DELETE /:id', () => {
        it('should return 404 status if no task is found.', async () => {
            let taskId = mongoose.Types.ObjectId();
            
            const res = await request(server).delete('/api/tasks/' + taskId);
            
            expect(res.status).toBe(404);
        });
        
        it('should return 400 status if no task is found.', async () => {
            const task = new Task({
                desc: 'task1',
                assignedTo: {
                    _id: mongoose.Types.ObjectId(),
                    name: 'name1'
                }
            });
            await task.save();

            const res = await request(server).delete('/api/tasks/' + task._id);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('desc', task.desc);
        });
    });
});
