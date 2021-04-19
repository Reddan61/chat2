const {model,Schema} = require('mongoose');


const UserSchema = new Schema({
    email: {
        unique:true,
        required:true,
        type:String
    },
    username: {
        unique:true,
        required:true,
        type:String
    },
    password: {
        required:true,
        type:String,
    },
    confirmed: {
        type:Boolean,
        default:false
    },
    confirmHash: {
        required: true,
        type:String,
    }

});


UserSchema.set("toJSON", {
    transform: function(_,obj) {
        delete obj.password;
        delete obj.confirmHash;
        return obj;
    }
})

module.exports.UserModel = model("User",UserSchema);

