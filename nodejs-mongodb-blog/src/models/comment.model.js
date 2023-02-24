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
    },
    articleId: {
        type: String
    },
}, {
    timestamps: true
    }
);

module.exports = model('Comment', CommentSchema);