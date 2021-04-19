const dotenv = require('dotenv');
dotenv.config();
require("./src/core/db");

const express = require('express');

const {registerValidations} = require('./src/validations/register');
const {UserCtrl} = require("./src/controllers/UserController");
const {passport} = require("./src/core/passport")
const cors = require('cors');

const app = express();

let corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'PUT', 'POST','DELETE'],
    credentials: true
};

app.use(express.json());
app.use(cors(corsOptions))
app.use(passport.initialize());


app.get('/users',UserCtrl.index);
app.post('/auth/register',registerValidations,UserCtrl.create);
app.get('/auth/verify',UserCtrl.verify);
app.get('/users/me',passport.authenticate('jwt',{session:false}),UserCtrl.getUserInfo);
app.get('/users/:id',UserCtrl.show);
app.post('/auth/login',passport.authenticate('local'),UserCtrl.afterLogin)


app.listen(process.env.PORT || 8888,(err) => {
    if(err) {
        return
    }

    console.log("SERVER STARTED")
});