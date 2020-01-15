const Users      = require('../models/Users');
const Chats      = require('../models/Chats');

const socketAuth = require('socketio-auth');

const fs         = require('fs');

async function verifyUser (token) {
    return new Promise((resolve, reject) => {
        // setTimeout for database call
        setTimeout(() => {
            Users.find({UserID: token}, (err, doc) => {
                if (err){
                    console.log(err);
                    return reject('USER_NOT_FOUND')
                }
                else {
                    return resolve(doc); 
                }
            });
        }, 200);
    });
}

module.exports = function(io) {
    socketAuth(io, {
        authenticate: async (socket, data, callback) => {
            const { token } = data;
        
            try {
                const user = await verifyUser(token);
            
                socket.user = user;
            
                return callback(null, true);
            } catch (e) {
                console.log(`Socket ${socket.id} unauthorized.`);
                return callback({ message: 'UNAUTHORIZED' });
            }
        },
        postAuthenticate: (socket, data) => {
            socket.room = '/';
            socket.join(socket.room);
            console.log(`Socket ${data.username} authenticated.`);
            // var a = JSON.stringify(data, null, 4);
            // fs.writeFile('data.json', a, 'utf8', (err) => {
            // if (err){
            //     console.log(err);
            //     }
            // });

            Chats.find({}, (err, chat) => {
                if (err){
                    console.log(err);
                }
                else{
                    chat.forEach(c => {
                        if (socket.room != '/'){
                            if (c.room == socket.room){
                                socket.emit('chat message', {val: c.message, sender: c.sender});
                                // console.log(c.message);
                            }
                        }
                        else {
                            socket.emit('chat message', {val: c.message, sender: c.sender});
                        }
                    })
                }
            });
        
            socket.on('chat message', (msg) => {
                console.log(msg);
                var chat = new Chats({
                    message: msg.val,
                    sender : data.username,
                    room   : socket.room,
                })
                Chats.create(chat, (err, chat) => {
                    if (err){
                        console.log(err);
                    }
                    else{
                        console.log("Message saved");
                    }
                })
                socket.emit('chat message', {val: msg.val, sender: data.username});
                console.log(socket.room);
                // socket.leave(socket.room);
                // socket.room = 'my-namespace';
                // socket.join(socket.room);
            })
            var room = "my-namespace";

            socket.on('join', (join) => {
                socket.leave(socket.room);
                socket.join(join);
                socket.room = join;
                // room = room;
                console.log("joined " , socket.room);
                socket.emit('join', "joined");
                Chats.find({}, (err, chat) => {
                    if (err){
                        console.log(err);
                    }
                    else{
                        chat.forEach(c => {
                            if (c.room == socket.room){
                                socket.emit('chat message', {val: c.message, sender: c.sender});
                                // console.log(c.message);
                            }
                        })
                    }
                });
            });
        },
        disconnect: (socket, data) => {
            console.log(`Socket ${socket.id} disconnected.`);
        },
    })
}