var express = require('express');

var API = new (require('../controllers/api'))();

var router = express.Router();

router.get('/check', API.checkStatus);

router.post('/registration', API.registration);
router.post('/login', API.login);

module.exports = router;
