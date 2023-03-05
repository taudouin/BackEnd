const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const mongooseRole = require('mongoose-role');

const UserSchema = new Schema ({ // TODO Ajouter des 'rôles'
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    isValid: {
        type: Boolean,
        default: false,
        required: true,
    },
    uniqueString: {
        type: String,
    },
}, {
    timestamps: true
    }
)

UserSchema.plugin(mongooseRole, {
    roles: ['public', 'user', 'admin'],
    accessLevels: {
        'public': ['public', 'user', 'admin'],
        'user': ['user', 'admin'],
        'admin': ['admin']
    }
});

UserSchema.methods.encrypPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

UserSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = model('User', UserSchema);