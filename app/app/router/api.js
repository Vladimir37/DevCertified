var express = require('express');

var API = new (require('../controllers/api'))();
var Middlewares = new (require('../controllers/middlewares'))();

var router = express.Router();

router.get('/check', API.checkStatus);
router.get('/confirm', API.confirmation);

router.post('/registration', API.registration);
router.post('/login', API.login);
router.post('/report', API.report);
router.post('/solve-report', API.solveReport);
router.post('/create-test', Middlewares.onlyAdmin, API.createTest);
router.post('/edit-test', Middlewares.onlyAdmin, API.editTest);
router.post('/image-test', Middlewares.onlyAdmin, API.imageTest);

module.exports = router;
