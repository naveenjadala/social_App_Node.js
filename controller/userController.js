const  userModel = require('../model/userModel')
const jwt = require('jsonwebtoken')
const expressJwt  =require('express-jwt')
const _ = require('lodash');
require('dotenv').config()

const { check, validationResult } = require('express-validator');

exports.signupUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array()[0] });
    }
    const userExist = await userModel.findOne({ email: req.body.email})
    if(userExist) return res.status(403).json({
        error: `${req.body.email} Email already in use`
    })
    const newUser = await new userModel(req.body)
    await newUser.save()
    res.json({
        message: `user is created successfully`
    })
},

exports.signin = async(req, res) => {
    const { email, password} = req.body
    userModel.findOne({email}, (err,user) => {

        if(err || !user) {
            return res.status(401).json({
                error: "User does't exist with the email"
            })
        }
        if(!user.authantication(password)) {
            return res.status(401).json({
                error: "incorrect Email or password"
            })
        }

        const token = jwt.sign({_id: user._id}, process.env.jwt)

        res.cookie("t", token, {expire: new Date() + 9999});
        const { _id, email, name } = user 
        return res.json( {token, user: { _id, email, name} })

    })
},

exports.signOut = (req, res) => {
    res.clearCookie("t");
    return res.json({ message: "signout successfully"})
},

exports.getAllUsers = (req, res) => {
    userModel.find((err, users) => {
        if(err) {
            return res.json({ error: err });
        }
        res.json({ user: users });
    }); 
},

exports.userById = (req, res, next, id) => {
    userModel.findById(id).exec((err, user) => {
        if(err || !user) {
            return res.json({ error: err })
        }
        req.profile = user;
        next();
    });
},

exports.getUser = (req, res) => {
    req.profile.hashed_password = undefined;
    return res.json(req.profile);
},

exports.updateUser = async(req, res) => {
    let user = req.profile;
    user = _.extend(user, req.body);
    user.updated = Date.now();
    await user.save((err) => {
        if(err)  {
            return res.status(400).json({ error: err });
        }
        res.json({ message: "user updated Done"});
    });
},

exports.deleteUser = (req, res) => {
    let user = req.profile;
    user.remove((err, user) => {
        if(err) {
            return res.status(400).json({ error: err});
        }
        res.json({ message: "user deleted "})
    })
},


exports.addFollowing = (req, res, next) => {
    userModel.findByIdAndUpdate(req.body.userId, 
        {$push:{ following: req.body.followId}},
        (err, result) => {
        if(err) {
            return res.json({ error: err});
        }
        console.log("check flower"+ result + req.body.userId);
        next();
    })
}

exports.addFollower = (req, res, next) => {
    userModel.findByIdAndUpdate(req.body.followId, 
        {$push:{ followers: req.body.userId}},
        {new: true})
        .populate('following', '_id name')
        .populate('followers', '_id name')
        .exec((err, result) => {
            if(err) {
                return res.json({ error: err});
            }
            result.hashed_password = undefined;
            result.salt = undefined;
            res.json({ result });
        })
}


exports.removeFollowing = (req, res, next) => {
    userModel.findByIdAndUpdate(req.body.userId, 
        {$pull:{ following: req.body.unfollowId}},
        (err, result) => {
        if(err) {
            return res.json({ error: err});
        }
        // console.log("check flower"+ result);
        next();
    })
}

exports.removeFollower = (req, res, next) => {
    userModel.findByIdAndUpdate(req.body.unfollowId, 
        {$pull:{ followers: req.body.userId}},
        {new: true})
        .populate('following', '_id name')
        .populate('followers', '_id name')
        .exec((err, result) => {
            if(err) {
                return res.json({ error: err});
            }
            result.hashed_password = undefined;
            result.salt = undefined;
            res.json({ result });
        })
}


exports.requireSigin = expressJwt({
    secret: process.env.jwt
});

