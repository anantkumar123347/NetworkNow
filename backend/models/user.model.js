const mongoose = require('mongoose');
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    active:{
        type:Boolean,
        default:true
    },
    password:{
        type:String,
        required:true
    },
    profilePicture:{
        type:String,
        default:'https://res.cloudinary.com/dz2yzsqpi/image/upload/v1741062738/account_ehv9uv.png'
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    token:{
        type:String,
        default:''
    }
})
const User = mongoose.model('User', userSchema);
module.exports = User;