const User = require('../models/user.model');
const assert = require('assert');

describe('crud  user', () => {
    it('user created', () => {
        const user =  new User({
            fullname: 'name User',
            email: 'user@user.fr',
            password: 'SomeText123#',
            isValid: false,
            uniqueString: '',
            role: 'user'
        });
        console.log(user);
        user.save().then(() => {
            done();
         })
    });
    it('user find & updated', () => {
        const user = User.findOne({email: 'user@user.fr'});
        console.log(user._conditions);
        user.updateOne({
            email: 'email@updated.fr'
        });
        console.log(user._update);
        user.then(() => {
            done();
        });
    });
    it('user removed', () => {
        const user = User.findOne({email: 'email@updated.fr'}).lean();
        console.log(user._conditions);
        user.deleteOne({email: 'email@updated.fr'}).then(() => {
            assert(user === undefined);
            done();
        });
    });
});