var mongoose = require('mongoose');

const ChatSchema = mongoose.Schema({
    message: {
        type: String
    },
    sender: {
        type: String
    },
    reciever: {
        type: String
    },
    room: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('Chats', ChatSchema);