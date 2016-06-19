var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session'); 
var passport = require('passport');

var router = require('./router/main');

var app = express();

app.use(router);

module.exports = app;