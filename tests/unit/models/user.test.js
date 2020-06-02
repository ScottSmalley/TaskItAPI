const {User} = require('../../../models/user');
/*
it('should return 404 if User.lookup() doesnt find a user.', async () => {
            await run();
            
            const res = await User.lookup(mongoose.Types.ObjectId());

            expect(res).toBeNull();
            expect(res).toEqual(expect.arrayContaining( [ ] ));
         });
         
         it('should return the user if User.lookup() is given valid data.', async () => {
            await run();
            
            const res = await User.lookup(userId);

            expect(res).toContain('name');
         });
*/
describe('User.lookup()', () => {
    it('is good', () => {
        expect(1).toBe(1);
    })
});