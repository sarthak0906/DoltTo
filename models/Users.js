var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    UserID: {
        type: String,
        unique: true,
    },
    Name: String,
    Phone: Number,
    College: {
        Name: String,
        Location: String,
    },
    Course: {
        Name: String,
        Year: Number,
   },
   imgUrl: String,
   connected: Boolean,
});

module.exports = mongoose.model('Users', UserSchema);