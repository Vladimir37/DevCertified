var mongoose = require('mongoose');

var reports = require('./reports');
var tests = require('./tests');
var users = require('./users');
var certificates = require('./certificates');

var connection = mongoose.connection;

//connection check
connection.on('open', function() {
    console.log('Connection to DB created');
});
connection.on('error', function(err) {
    console.log('Error connect to DB!');
    console.log(err);
});

var models = {
    reports,
    users: users.users,
    changes: users.changes,
    certificates: certificates.certificate,
    orders: certificates.order,
    tests: tests.test,
    questions: tests.question,
    solutions: tests.solution
};

mongoose.connect('mongodb://localhost:27017/devcertified');

module.exports = models;
