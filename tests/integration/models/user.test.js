const mongoose = require('mongoose');
const {User} = require('../../../models/user');

describe('User.lookup()', () => {
    let userId;
    let server;

    beforeEach( async () => {
        server = require('../../../index');
        userId = mongoose.Types.ObjectId();

        const user = new User({
            _id: userId,
            name: 'user1',
            email: 'user1@user1.com',
            password: '12345'
        });
        
        await user.save();
    });
    
    afterEach(async () => {
        await User.remove({});
        await server.close();
    });
    
    it('should return 404 if User.lookup() doesnt find a user.', async () => {
        const res = await User.lookup(mongoose.Types.ObjectId());

        expect(res).toBeNull();
        expect(res).toEqual(expect.arrayContaining( [ ] ));
    });
        
    it('should return the user if User.lookup() is given valid data.', async () => {
        const res = await User.lookup(userId);

        expect(res).toHaveProperty('name', 'user1');
    });
});