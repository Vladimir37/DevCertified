var express = require('express');

var client = new (require('../controllers/client'))();

var router = express.Router();



module.exports = router;
