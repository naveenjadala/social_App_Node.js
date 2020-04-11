const mongoose = require('mongoose')

const postmodel = new mongoose.Schema({
    title: {
        type: String,
        required: "title is rerquired"
    },
    body: {
        type: String,
        required: "title is rerquired"
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "user"
    },
    created: {
        type: Date,
        default: Date.now 
    },
    updated: Date,
    likes:[{
        type: mongoose.Schema.ObjectId,
        ref: "user"
    }],
    comment: [
        {
            commentText: String,
            createdDate: { type: Date, default: Date.now },
            postedBy: { type: mongoose.Schema.ObjectId, ref: "user" }
        }
    ]
});

module.exports = mongoose.model("post", postmodel)