var mongoose = require('mongoose');
var Comments = require('./Comments');

const PostSchema = mongoose.Schema({
    message: {
        type: String
    },
    sender: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    comments: [Comments],
    likes: Number,
    photo: Boolean, // True if there is a photo in the post, false if there is no photo in the post.
})

module.exports = mongoose.model('Posts', PostSchema);