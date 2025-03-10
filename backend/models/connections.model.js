const mongoose = require('mongoose');
const connectionSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    connectionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    status_accepted:{
        type:Boolean,
        default:null
    }
})
const Connection = mongoose.model('Connection', connectionSchema);
module.exports = Connection;