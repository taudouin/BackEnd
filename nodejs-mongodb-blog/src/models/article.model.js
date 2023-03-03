const { Schema, model } = require('mongoose');

const ArticleSchema = new Schema ({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    formFile: {
        type: String,
    },
}, {
    timestamps: true // TODO Mettre timestamps en 'fr' format LLLL dans le controller
    }
);

module.exports = model('Article', ArticleSchema);