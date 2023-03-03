const { Schema, model } = require('mongoose');

const CommentSchema = new Schema ({
    comment: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true,
    },
    articleId: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
    }
);

module.exports = model('Comment', CommentSchema);