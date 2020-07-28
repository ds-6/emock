const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type:String,
        required:true
    },
    googleID: {
        type:String
    },
    thumbnail: {
        type:String
    },
    email:{
        type:String
    },
    attemptedMock:[Object]
},{timestamps:true});

const User = mongoose.model('user',userSchema);
module.exports = User;