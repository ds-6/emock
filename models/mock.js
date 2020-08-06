const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

const mockSchema = new Schema({
    category: {
        type:String,
        required:true
    },
    mockName: {
        type:String,
        required:true
    },
    setNo: {
        type:String,
        required:true
    },
    questionBody:{
        type:Array
    },
    mockTime:{
        type:Number,
        required: true
    },
    attemptedBy:[{
       type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
},{timestamps:true});

const Mock = mongoose.model('mock',mockSchema);
module.exports = Mock;