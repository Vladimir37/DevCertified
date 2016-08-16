var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    first: String,
    last: String,
    mail: String,
    pass: String,
    status: Number,
    code: Number,
    success_tests: Array
});

var userModel = mongoose.model('User', userSchema);

var changeSchema = new mongoose.Schema({
    user: String,
    pass: String,
    confirmed: Boolean
});

var changeModel = mongoose.model('Change', changeSchema);

module.exports = {
    users: userModel,
    changes: changeModel
};
