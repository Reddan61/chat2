const mongoose = require('mongoose');

mongoose.Promise = Promise;

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/chat2',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:true
});


const db = mongoose.connection;

db.on('error',console.error.bind(console,'connection error:'));


module.exports =  {db,mongoose};



