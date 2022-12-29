const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new Schema ({ // TODO Ajouter des 'rôles'
    id: {
        type: String,
    },
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    isValid: {
        type: Boolean,
    },
    uniqueString: {
        type: String,
    },
}, {
    timestamps: true
    }
)

// UserSchema.plugin(require('mongoose-role'), {
// 	roles: ['public', 'user', 'admin'],
//     accessLevels: {
//     'public': ['public', 'user', 'admin'],
//     'user': ['user', 'admin'],
//     'admin': ['admin']
//   }
// });

UserSchema.methods.encrypPassword = async password => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

UserSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = model('User', UserSchema);