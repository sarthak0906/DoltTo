var mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    commenter : {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    }
})

module.exports = CommentSchema;