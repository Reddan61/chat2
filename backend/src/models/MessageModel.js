const {model,Schema} = require('mongoose');
const mongoose = require('mongoose')


const MessageSchema = new Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    }],
    messages: [{
        userBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        text: String,
        date: {
            type: String
        },
        require:false
    }]
});


module.exports.MessageModel = model("Message",MessageSchema);