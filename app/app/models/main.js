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
    users,
    certificates,
    tests: tests.test,
    question: tests.question
};

mongoose.connect('mongodb://localhost/devcertified');

module.exports = models;