var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    first: String,
    last: String,
    mail: String,
    pass: String,
    status: Number,
    success_tests: Array
});

var userModel = mongoose.model('User', userSchema);

module.exports = userModel;