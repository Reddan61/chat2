const dotenv = require('dotenv');
dotenv.config();
require("./src/core/db");

const express = require('express');

const {registerValidations} = require('./src/validations/register');
const {fargotPasswordValidation,resetPasswordValidation} = require('./src/validations/reset');
const {UserCtrl} = require("./src/controllers/UserController");
const {MessageCtrl} = require("./src/controllers/MessageController");
const {passport} = require("./src/core/passport")
const {MessageModel} = require("./src/models/MessageModel")
const {uploadFile} = require('./src/utils/uploadFile')
const cors = require('cors');
const multer = require('./src/core/multer')
const app = express();
const http = require('http').createServer(app);
const jwt = require('jsonwebtoken');

const io = require("socket.io")(http,{
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      allowedHeaders: ["token"],
      credentials: true
    }
});

let corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'PUT', 'POST','DELETE'],
    credentials: true
};

app.use(express.json());
app.use(cors(corsOptions))
app.use(passport.initialize());
app.use('/uploads',express.static('uploads'))

io.use(function(socket, next){
    const token = socket.handshake.query.token;
    if (socket.handshake.query && token){
     jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
        if (err) return next(new Error('Authentication error'));
        socket.decoded = decoded;
        next();
      });
      
    }
    else {
      next(new Error('Authentication error'));
    }    
})

app.get('/users',UserCtrl.index);
app.post('/auth/register',registerValidations,UserCtrl.create);
app.get('/auth/verify',UserCtrl.verify);
app.get('/users/me',passport.authenticate('jwt',{session:false}),UserCtrl.getUserInfo);
app.get('/users/:id',UserCtrl.show);
app.post('/auth/login',passport.authenticate('local'),UserCtrl.afterLogin)
app.put('/usersAvatar',passport.authenticate('jwt',{session:false}),multer.single('file'),UserCtrl.updateAvatar)
app.post('/users/fargotPassword',fargotPasswordValidation,UserCtrl.fargotPassword)
app.post('/users/resetPassword',resetPasswordValidation,UserCtrl.resetPassword)
app.post('/messages',passport.authenticate('jwt',{session:false}),  MessageCtrl.create)
app.post('/messages/roomId',passport.authenticate('jwt',{session:false}),  MessageCtrl.show)
app.get('/messages',passport.authenticate('jwt',{session:false}),  MessageCtrl.index)

io.on('connection', (socket) => {
    const id = socket.decoded.data._id;
    socket.join(id);
    //ОШИБКИ СДЕЛАТЬ
    socket.on("SEND:MESSAGE", async (data) => {
        const images = data.files
        let imgSrc = [];
        if(images && images.length <= 5) {
            imgSrc = await uploadFile(images);
        }
        const result = await MessageModel.findByIdAndUpdate(data.roomId,{
            $push: {
                "messages": {userBy: data.userId,text:data.text,date:new Date(),imagesSrc:imgSrc}
            }
        }, {
            new: true,
            useFindAndModify:false
        }).populate('messages.userBy',['username','avatar'])
       
        const message = result.messages[result.messages.length - 1];
        const uniqueUsers = result.users.reduce((unique,item) => {
            if(unique.includes(String(item))) {
                return unique
            } else {
                return [...unique, String(item)]
            }
        },[])
        uniqueUsers.forEach(el => {
            io.sockets.to(el.toString()).emit("NEW:MESSAGE",{roomId:result._id,message})
        })
    })
    socket.on("disconnect", () => {
        console.log('disconected')
    })
})


http.listen(process.env.PORT || 8888,(err) => {
    if(err) {
        return
    }

    console.log("SERVER STARTED")
});