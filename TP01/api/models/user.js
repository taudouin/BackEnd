const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
})

exports.User = mongoose.model('User', UserSchema)
exports.UserSchema = UserSchema