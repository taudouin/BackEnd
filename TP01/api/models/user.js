const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
})

UserSchema.virtual('id').get(function () {
    return this._id.toHexString();
})

UserSchema.set('toJSON', {
    virtuals: true,
})

const User = mongoose.model('User', UserSchema)
exports.UserSchema = User
