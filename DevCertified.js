var http = require('http');

var app = require('./app/app.js');
var config = require('./configs/app.json');

http.createServer(app).listen(config.port);