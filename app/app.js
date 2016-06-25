var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');

var router = require('./app/router/main');
var middlewares = new (require('./app/controllers/middlewares'))();
var config = require('../configs/app.json');

var app = express();

// passport
app.use(session({
    secret: config.secret,
    resave: true,
    saveUninitialized: true
}));
passport.use(middlewares.strategy());
app.use(passport.initialize());
app.use(passport.session());
middlewares.serialization(passport);
middlewares.deserialization(passport);

// parsers
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(router);

module.exports = app;
