var express = require('express');

var client = new (require('../controllers/client'))();

var router = express.Router();

router.use(client.renderPage.bind(client));

module.exports = router;
