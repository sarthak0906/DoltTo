const express   = require('express');
var router      = express.Router();
var mongoose    = require('mongoose');
var Users       = require('../models/Users');

router.post('/First', (req, res, next) => {
    console.log(req.body);
    var newUser = new Users({
        UserID  : req.body.UID,
        Name    : req.body.Name,
        Phone   : req.body.Phone
    })
    console.log(newUser);

    Users.create(newUser, (err, user) => {
        if (err) {
            console.log(err);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ err: err }));
        }
        else {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ res: "user created", UID: req.body.UID }));
        }
    })
})

router.post('/Second', async (req, res, next) => {
    var User = {
        UserID  : req.body.UID,
        College: {
            Name: req.body.CollegeName,
            Location: req.body.CollegeLoc,
        },
        Course: {
            Name: req.body.CourseName,
            Year: req.body.CourseYear,
       },
    }

    Users.updateOne({UserID: req.body.UID}, User, (err, User) => {
        if (err){
            console.error(err);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({err: err}));
        }
        else {
            console.log(User.UserID + " updated to collection.");
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({res: "User Updated"}));
        }
    })
})

router.get('/', (req, res, next) => {
    console.log(req.query);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({res: "req"}));
})

module.exports = router;