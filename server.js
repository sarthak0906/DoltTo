const express    = require('express');
const Mongoose   = require("mongoose");
// const BodyParser = require("body-parser");
const http       = require('http');

var app          = express();
const httpServer = http.createServer(app);
const io         = require('socket.io').listen(httpServer);

Mongoose.Promise = global.Promise;
const port       = process.env.PORT || 3000;

var Users  = require('./Routes/Users');
var Posts  = require('./Routes/Posts');

app.use(express.json());
app.use(express.urlencoded());
app.set('dirname', __dirname)

const connect  = require("./dbconnect");

app.get('/', (req, res) => {
  res.sendFile(app.get('dirname') + '/Views/index.html')
})

app.get('/Img/:name', (req, res) => {
  res.sendFile(app.get('dirname') + '/Uploads/' + req.params.name + '.png')
})

app.use('/Users', Users);

app.use('/Posts', Posts);

require('./Routes/Socket.js')(io);

httpServer.listen(port, () => {
  console.log('listening on ' + port);
})