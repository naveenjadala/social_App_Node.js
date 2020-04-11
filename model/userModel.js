const mongoose = require('mongoose')
const uuidv1 = require('uuid/v1')
const crypto = require('crypto');

const userModel = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        require: true
    },
    email: {
        type: String,
        trim: true,
        require: true
    },
    hashed_password: {
        type: String,
        require: true
    },
    salt: String,
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date,
    following: [{ type: mongoose.Schema.ObjectId, ref: "user"}],
    followers: [{ type: mongoose.Schema.ObjectId, ref: "user"}]
})

userModel.virtual('password')
.set(
    function(password) {
        this._password = password
        this.salt = uuidv1()
        this.hashed_password = this.encryptPassword(password)
    })
.get(function() {
    return this._password
})

userModel.methods = {
    
    authantication: function(plainPassword) {
        return this.encryptPassword(plainPassword) === this.hashed_password
    },


    encryptPassword: function(password) {
        if(!password) return ""
        try {
            return crypto.createHmac('sha1', this.salt)
            .update(password)
            .digest('hex');
        }
        catch(err) {
            return ""
        }
    }
}

module.exports = mongoose.model("user", userModel)