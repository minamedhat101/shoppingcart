var User = require('../models/user');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/shopping', {useMongoClient: true});
mongoose.Promise = global.Promise;
var user = new User({
    email: 'mina@mina.com',
    password: '123456',
    privilege: 1
});


user.save();
mongoose.disconnect();