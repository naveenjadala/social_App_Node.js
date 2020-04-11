const Post = require("../model/postModel")
const { check, validationResult } = require('express-validator');

exports.getPosts = (req, res) => {
    const post = Post.find()
    .select("_id title body")
    .populate("postedBy", "_id name")
    .then(post => {
        res.json({ post })
    })
    .catch(err => console.log(err))
}

exports.createPost = async (req, res) => {
    const post = new Post(req.body)
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    post.postedBy = req.profile;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array()[0] });
    }
    await post.save()
    .then(result => {
        res.status(200).json({
            post: result
        })
    })
    .catch(err => console.log(err))
}

exports.getPostById = (req, res) => {
    Post.find({ postedBy: req.profile._id })
    .populate("postedBy", "_id name")
    .sort("_created")
    .exec((err, post) => {
        if(err) {
            return res.json({ errors: err });
        }
        res.json({ post })
    })
}

exports.postById = (req, res, next, id) => {
    Post.findById(id)
    .exec((err, post) => {
            if(err || !post) {
                console.log(post)
                return res.json({ error: err });
            }
            req.post = post;
            console.log(post)
            next();
        })
}

// exports.isPoster = (req, res, next) => {
//     let isPoster = 
//     req.post && req.auth && req.post.postedBy._id === req.auth._id;
//     if(!isPoster) {
//         return res.status(403).json({ error: "User is not authorized"});
//     }
//     next();
// }

exports.likes = (req, res, next) => {
    Post.findByIdAndUpdate(req.body.postId,
        {$push: { likes: req.body.userId }},
        { new: true })
        .then(result => {
            console.log(result);
            res.status(200).json({ result });
        }).catch(err => res.json({ error: err }));
        
}

exports.unlikes = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId,
        { $pull: { likes: req.body.userId } },
        { new: true })
        .then(result => {
            return res.status(200).json({ result });
        }).catch(err => res.json({ error: err}));
}

exports.getLikes = (req, res) => {
    Post.findById(req.body.postId)
    .populate("likes", "_id name email")
    .then(result => {
        return res.json({  likes: result.likes });
    }).catch(err => console.log(err));
}

exports.comment = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId,
        { $push: { comment: req.body.comment } },
        { new: true })
        .then(result => {
            return res.json({ result });
        }).catch(err => res.json({ error: err }))
}

exports.deletePost = (req, res) => {
    let post = req.post;
    console.log(req.post);
    post.remove((err) => {
        res.json({error: err});
    });
}