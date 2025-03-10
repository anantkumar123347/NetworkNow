const mongoose = require('mongoose');
const commentsSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    },
    body:{
        type:String,
        required:true
    }
})
const Comment = mongoose.model('Comment', commentsSchema);
module.exports = Comment;