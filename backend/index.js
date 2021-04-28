const dotenv = require('dotenv');
dotenv.config();
require("./src/core/db");

const express = require('express');

const {registerValidations} = require('./src/validations/register');
const {fargotPasswordValidation,resetPasswordValidation} = require('./src/validations/reset');
const {UserCtrl} = require("./src/controllers/UserController");
const {passport} = require("./src/core/passport")
const cors = require('cors');
const multer = require('./src/core/multer')
const app = express();

let corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'PUT', 'POST','DELETE'],
    credentials: true
};

app.use(express.json());
app.use(cors(corsOptions))
app.use(passport.initialize());
app.use('/uploads',express.static('uploads'))

app.get('/users',UserCtrl.index);
app.post('/auth/register',registerValidations,UserCtrl.create);
app.get('/auth/verify',UserCtrl.verify);
app.get('/users/me',passport.authenticate('jwt',{session:false}),UserCtrl.getUserInfo);
app.get('/users/:id',UserCtrl.show);
app.post('/auth/login',passport.authenticate('local'),UserCtrl.afterLogin)
app.put('/usersAvatar',passport.authenticate('jwt',{session:false}),multer.single('file'),UserCtrl.updateAvatar)
app.post('/users/fargotPassword',fargotPasswordValidation,UserCtrl.fargotPassword)
app.post('/users/resetPassword',resetPasswordValidation,UserCtrl.resetPassword)


app.listen(process.env.PORT || 8888,(err) => {
    if(err) {
        return
    }

    console.log("SERVER STARTED")
});