const express   = require('express');
var router      = express.Router();
var multer      = require('multer');
var fs          = require('fs');
var Posts       = require('../models/Posts.js');
var Comment     = require('../models/Comments');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'Uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

var upload = multer({ storage: storage })

router.post('/create', upload.single('avatar'), (req, res, next) => {
    var newPost = new Posts({
        message : req.body.message,
        sender  : req.body.sender,
        comments: [],
        likes   : 0
    })

    if (req.file){
        newPost.photo = true;
        // console.log(newPost.photo);
        // console.log("newPost.photo");
    }

    console.log(req.body.message);

    Posts.create(newPost, (err, post) => {
        if (err) {
            console.log(err);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ err: err }));
        }
        else {
            if (req.file){
                fs.renameSync(req.app.get('dirname') + '\\Uploads\\' + req.file.originalname, req.app.get('dirname') + '\\Uploads\\' + post.id + '.' + req.file.originalname.split('.')[1], (er, rs) => {
                    if(er){
                        console.log(er);
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ err: er }));
                    }
                    else{
                        console.log("Renamed");
                    }
                })
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ res: "post created", PostID: post.id }));
        }
    })
})

router.get('/', (req, res, next) => {
    Posts.find({})
        .sort({date: -1})
        .exec((err, post) => {
        if (err){
            console.log(err);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ err: err }));
        }
        else {
            // console.log(post);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(post));
        }
    })
})
    
router.post('/:post/comment', (req, res, next) => {
    var newComment = new Comment({
        commenter: req.body.commenter,
        comment: req.body.comment,
        date: Date.now(),
    })
    
    Posts.findByIdAndUpdate(req.params.post, {$push: 
        {comment
            : newComment
        }
    }, (er, pst) => {
        if(er){
            console.log(err);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ err: er }));
        }
        else{
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ res: "saved" }));
        }
    })
})

module.exports = router;