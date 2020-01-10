const express    = require('express');
const Mongoose   = require("mongoose");
const BodyParser = require("body-parser");
const http       = require('http');

var app          = express();
const httpServer = http.createServer(app);
const io         = require('socket.io')(httpServer);

Mongoose.Promise = global.Promise;
const port       = process.env.PORT || 3000;

var Users  = require('./Routes/Users');

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.set('dirname', __dirname)

const connect  = require("./dbconnect");

app.get('/', (req, res) => {
  res.sendFile(app.get('dirname') + '/Views/index.html')
})

app.use('/Users', Users);

require('./Routes/Socket.js')(app, io);

httpServer.listen(port, () => {
  console.log('listening on ' + port);
})