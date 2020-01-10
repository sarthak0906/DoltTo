const  mongoose  = require("mongoose");
mongoose.Promise  = global.Promise;
const  url  =  "mongodb+srv://aman:bewda@cluster0-qcwvh.mongodb.net/test?retryWrites=true&w=majority";
const connect = mongoose.connect(url)
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));
  
module.exports  =  connect;