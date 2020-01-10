const Users      = require('../models/Users');
const Chats      = require('../models/Chats');

const socketAuth = require('socketio-auth');

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

module.exports = function(app, io) {
    app.get('/abc', (req, res) => {
        res.sendFile(app.get('dirname') + '/Views/index.html')
    });

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
        postAuthenticate: (socket) => {
            console.log(`Socket ${socket.id} authenticated.`);

            Chats.find({}, (err, chat) => {
                if (err){
                    console.log(err);
                }
                else{
                    chat.forEach(c => {
                        io.emit('chat message', {msg: c.message, sender: c.sender});
                        console.log(c.message);
                    })
                }
            });
        
            socket.on('chat message', (msg) => {
                console.log(msg);
                var chat = new Chats({
                    message: msg,
                    sender : socket.id
                })
                Chats.create(chat, (err, chat) => {
                    if (err){
                        console.log(err);
                    }
                    else{
                        console.log("Message saved");
                    }
                })
                io.emit('chat message', {msg: msg, sender: socket.id});
            })
        },
        disconnect: (socket) => {
            console.log(`Socket ${socket.id} disconnected.`);
        },
    })
}