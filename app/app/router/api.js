var express = require('express');

var API = new (require('../controllers/api'))();
var Middlewares = new (require('../controllers/middlewares'))();

var router = express.Router();

router.get('/check', API.checkStatus);
router.get('/confirm', API.confirmation);
router.get('/get-test', API.getTest);
router.get('/get-tests', API.getTests);
router.get('/get-test-status', API.getTestStatus);
router.get('/get-certificate', API.getCertificate);
router.get('/all-tests', Middlewares.onlyAdmin, API.allTests);
router.get('/all-questions', Middlewares.onlyAdmin, API.allQuestions);
router.get('/get-questions-col', Middlewares.onlyAdmin, API.getQuestionsCol);
router.get('/available-test', Middlewares.onlyUser, API.availableTest);
router.get('/get-category-tests', Middlewares.onlyUser, API.getCategoryTests);
router.get('/get-certificates', Middlewares.onlyUser, API.getCertificates);
router.get('/get-reports', Middlewares.onlyAdmin, API.getReports);
router.get('/get-solutions', Middlewares.onlyUser, API.getSolutions);
router.get('/get-orders', Middlewares.onlyUser, API.getOrders);

router.post('/registration', API.registration);
router.post('/login', API.login);
router.post('/logout', API.logout);
router.post('/report', API.report);
router.post('/solve-report', Middlewares.onlyAdmin, API.solveReport);
router.post('/create-test', Middlewares.onlyAdmin, API.createTest);
router.post('/edit-test', Middlewares.onlyAdmin, API.editTest);
router.post('/image-test', Middlewares.onlyAdmin, API.imageTest);
router.post('/add-quest', Middlewares.onlyAdmin, API.addQuestion);
router.post('/edit-quest', Middlewares.onlyAdmin, API.editQuestion);
router.post('/delete-quest', Middlewares.onlyAdmin, API.deleteQuestion);
router.post('/start-testing', Middlewares.onlyUser, API.startTesting);
router.post('/take-answer', Middlewares.onlyUser, API.takeAnswer);
router.post('/get-question', Middlewares.onlyUser, API.getQuestion);

module.exports = router;
