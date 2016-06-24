var path = require('path');
var express = require('express');

var api = require('./api');
var client = require('./client');

var router = express.Router();

router.use('/api', api);
router.use('/src', express.static(path.join(__dirname, '../../../client/source')));
router.use(client);

module.exports = router;
