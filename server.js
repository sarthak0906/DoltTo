const express    = require('express');
const Mongoose   = require("mongoose");
const BodyParser = require("body-parser");

Mongoose.Promise = global.Promise;

const port       = process.env.PORT || 3000;


var app          = express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

Mongoose.connect('mongodb+srv://aman:bewda@cluster0-qcwvh.mongodb.net/test?retryWrites=true&w=majority')
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));

var Users = require('./Routes/Users')

app.use('/Users', Users);

app.listen(port, () => {
    console.log('listening on ' + port);
})
