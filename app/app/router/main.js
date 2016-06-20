var express = require('express');

var api = require('./api');
var client = require('./client');

var router = express.Router();

router.use('/api', api);
// router.use(clients);

module.exports = router;
