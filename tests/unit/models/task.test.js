const mongoose = require('mongoose');
require('../../../startup/validation')();
const {Task, validateTask} = require('../../../models/task');

describe('Task.validateTask()', () => {
    let desc;
    let userId;

    beforeEach(() => {
        desc = 'user1';
        userId = mongoose.Types.ObjectId();
        payload = {name, userId};
    });

    const run = () => {
        return new Task(payload);
    };
    
    it('should return with an error object if desc is missing.', () => {
        payload = {userId};

        const task = run();

        const res = validateTask(task);

        expect(res).toHaveProperty('error');
    });

    it('should return with an error object if userId is missing.', () => {
        payload = {desc};

        const task = run();

        const res = validateTask(task);

        expect(res).toHaveProperty('error');
    });

    it('should return with an error object if desc is less than 5 characters.', () => {
        desc = '1234';

        const task = run();

        const res = validateTask(task);

        expect(res).toHaveProperty('error');
    });

    it('should return with an error object if desc is more than 150 characters.', () => {
        desc = new Array(152).join('a');

        const task = run();

        const res = validateTask(task);

        expect(res).toHaveProperty('error');
    });
    
    it('should return true if given valid input.', () => {
        const task = run();
        
        const res = validateTask(task);

        expect(res).toBeTruthy();
    });
});