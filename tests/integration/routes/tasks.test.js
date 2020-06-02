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
        let server;
        let desc;
        let userId;
        let payload;
    
        beforeEach( async () => {
            server = require('../../../index');
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
        
        afterEach( async () => {
            await server.close();
            await User.remove({});
            await Task.remove({});
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
        
        it('should return 400 status if userId is missing.', async () => {
            payload = { desc };
    
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

    // describe('PUT /:id', () => {
    //     /*
    //     Test cases:
    //     It should return 400 if the desc is missing.
    //     it should return 400 if assignedTo is missing.
    //     It should return 400 if the name is missing.
    //     It should return 400 if the task id is invalid.
    //     It should return 400 if the desc _id is invalid
    //     It should return 400 if the assignedTo _id is invalid
    //     It should return 404 if the task id doesn't exist.
    //     It should return 404 if the assignedTo _id doesn't exist.
    //     It should update the desc.
    //     It should update the assignedTo _id.
    //     It should update the assignedTo name.
    //     */
    // });

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
