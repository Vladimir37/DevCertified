'use strict';

var passport = require('passport');
var _ = require('underscore');
var formidable = require('formidable');
var md5 = require('md5');
var fs = require('fs');
var random = require('random-token');

var Models = require('../models/main');
var Additional = new (require('./additional'))();
var Mail = new (require('./mail'))();
var Orders = new (require('./orders'))();

var generate_code = random.create('0123456789');

class API {
    // Auth and registration
    registration(req, res, next) {
        var user_data = {
            mail: req.body.mail,
            pass: md5(req.body.password),
            first: req.body.first,
            last: req.body.last,
            code: generate_code(12)
        };
        if (!Additional.checkArguments(user_data)) {
            return res.send(Additional.serialize(2, 'Required fields are empty'));
        }
        Models.users.findOne({
            mail: user_data.mail
        }).then(function (user) {
            if (user) {
                return res.send(Additional.serialize(3, 'User with this email are exists'));
            }
            var additional_user_data = {
                status: 0,
                success_tests: []
            };
            _.extend(user_data, additional_user_data);
            return Models.users.create(user_data);
        }).then(function (user) {
            if (!user.mail) {
                return false;
            }
            Mail.registration(user);
            Mail.confirm(user);
            return res.send(Additional.serialize(0));
        }).catch(function (err) {
            console.log(err);
            return res.send(Additional.serialize(1, 'Server error'));
        });
    }

    login(req, res, next) {
        passport.authenticate('local', function(err, user) {
            if (err) {
                console.log(err);
                return res.send(Additional.serialize(1, 'Server error'));
            }
            else if (!user) {
                return res.send(Additional.serialize(2, 'No user data'));
            }
            req.logIn(user, function(err) {
                if (err) {
                    console.log(err);
                    return res.send(Additional.serialize(1, 'Server error'));
                }
                else {
                    res.cookie('dclog', user._id);
                    return res.send(Additional.serialize(0, user));
                }
            });
        })(req, res, next);
    }

    logout(req, res, next) {
        req.logout();
        res.clearCookie('dclog');
        return res.send(Additional.serialize(0));
    }

    checkStatus(req, res, next) {
        var user_data = req.user;
        if (!user_data) {
            return res.send(Additional.serialize(1));
        }
        user_data._id = null;
        user_data.pass = null;
        return res.send(Additional.serialize(0, user_data));
    }

    confirmation(req, res, next) {
        var confirmation_code = req.query.code;
        if (!confirmation_code) {
            return res.send(Additional.serialize(2, 'No code'));
        }
        Models.users.findOne({
            code: confirmation_code,
            status: 0
        }).then(function (user) {
            if (!user) {
                return res.send(Additional.serialize(2, 'Incorrect code'));
            }
            return Models.users.update({
                code: confirmation_code,
                status: 0
            }, {
                status: 1
            });
        }).then(function () {
            return res.send(Additional.serialize(0));
        }).catch(function (err) {
            console.log(err);
            return res.send(Additional.serialize(1, 'Server error'));
        });
    }

    // Reports
    report(req, res, next) {
        var report_type = req.body.type;
        var report_data = {
            text: req.body.text,
            question: req.body.question
        };
        if (!report_data.text || !report_type) {
            return res.send(Additional.serialize(2, 'Incorrect data'));
        }
        var user = req.user ? req.user._id : null;
        var additional_report_data = {
            user: user,
            addr: req.body.addr,
            type: report_type,
            date: new Date(),
            solved: false
        };
        _.extend(report_data, additional_report_data);
        Models.reports.create(report_data).then(function () {
            return res.send(Additional.serialize(0));
        }).catch(function (err) {
            console.log(err);
            return res.send(Additional.serialize(1, 'Server error'));
        });
    }

    solveReport(req, res, next) {
        var report_num = req.body.report;
        if (!report_num) {
            return res.send(Additional.serialize(2, 'Incorrect data'));
        }
        Models.reports.update({
            _id: report_num,
            solved: false
        }, {
            solved: true
        }).then(function (info) {
            if (info.n) {
                return res.send(Additional.serialize(0));
            }
            else {
                return res.send(Additional.serialize(3, 'Incorrect report number'));
            }
        }).catch(function (err) {
            console.log(err);
            return res.send(Additional.serialize(1, 'Server error'));
        });
    }

    // Admin
    createTest(req, res, next) {
        var form = new formidable.IncomingForm({
            uploadDir: "temp"
        });
        form.parse(req, function (err, field, files) {
            if (err) {
                console.log(err);
                return res.send(Additional.serialize(1, 'Server error'));
            }
            var test_data = {
                title: field.title,
                description: field.description,
                subjects: field.subjects,
                easyCol: field.easyCol,
                middleCol: field.middleCol,
                hardCol: field.hardCol,
                easyTime: field.easyTime,
                middleTime: field.middleTime,
                hardTime: field.hardTime,
                img: Date.now() + '.png'
            };
            var image = files.img;
            if (!Additional.checkArguments(test_data) || !image) {
                return res.send(Additional.serialize(2, 'Required fields are empty'));
            }
            test_data.active = false;
            fs.rename(image.path, 'client/source/images/uploaded/' + test_data.img, function(err) {
                if (err) {
                    console.log(err);
                    return res.send(Additional.serialize(1, 'Server error'));
                }
            });
            test_data.subjects = test_data.subjects.split('|');
            Models.tests.create(test_data).then(function () {
                return res.send(Additional.serialize(0));
            }).catch(function (err) {
                console.log(err);
                return res.send(Additional.serialize(1, 'Server error'));
            });
        });
    }

    editTest(req, res, next) {
        var test_data = {
            title: req.body.title,
            description: req.body.description,
            subjects: req.body.subjects,
            easyCol: req.body.easyCol,
            middleCol: req.body.middleCol,
            hardCol: req.body.hardCol,
            easyTime: req.body.easyTime,
            middleTime: req.body.middleTime,
            hardTime: req.body.hardTime
        };
        var test_num = req.body._id;
        if (!Additional.checkArguments(test_data) || !test_num) {
            return res.send(Additional.serialize(2, 'Required fields are empty'));
        }
        test_data.active = req.body.active;
        test_data.subjects = test_data.subjects.split('|');
        Models.tests.update({
            _id: test_num
        }, test_data).then(function (info) {
            if (info.n) {
                return res.send(Additional.serialize(0));
            }
            else {
                return res.send(Additional.serialize(3, 'Incorrect test number'));
            }
        }).catch(function (err) {
            console.log(err);
            return res.send(Additional.serialize(1, 'Server error'));
        });
    }

    imageTest(req, res, next) {
        var form = new formidable.IncomingForm({
            uploadDir: "temp"
        });
        form.parse(req, function (err, fields, files) {
            var data = {
                num: fields.test,
                img: files.img
            };
            if (!Additional.checkArguments(data)) {
                return res.send(Additional.serialize(2, 'Required fields are empty'));
            }
            var filename = Date.now() + '.png';
            fs.rename(data.img.path, 'client/source/images/uploaded/' + filename, function(err) {
                if (err) {
                    console.log(err);
                    return res.send(Additional.serialize(1, 'Server error'));
                }
            });
            Models.tests.update({
                _id: data.num
            }, {
                img: filename
            }).then(function (info) {
                if (info.n) {
                    return res.send(Additional.serialize(0));
                }
                else {
                    return res.send(Additional.serialize(3, 'Incorrect test number'));
                }
            }).catch(function (err) {
                console.log(err);
                return res.send(Additional.serialize(1, 'Server error'));
            });
        });
    }

    addQuestion(req, res, next) {
        var question_data = {
            text: req.body.text,
            answer1: req.body.answer1,
            answer2: req.body.answer2,
            answer3: req.body.answer3,
            answer4: req.body.answer4,
            true_answer: req.body.true_answer,
            complexity: req.body.complexity,
            test: req.body.test
        };
        if (req.body.code) {
            question_data.code = req.body.code;
        }
        if (!Additional.checkArguments(question_data)) {
            return res.send(Additional.serialize(2, 'Required fields are empty'));
        }
        Models.questions.create(question_data).then(function () {
            return res.send(Additional.serialize(0));
        }).catch(function (err) {
            console.log(err);
            return res.send(Additional.serialize(1, 'Server error'));
        });
    }

    editQuestion(req, res, next) {
        var question_data = {
            text: req.body.text,
            answer1: req.body.answer1,
            answer2: req.body.answer2,
            answer3: req.body.answer3,
            answer4: req.body.answer4,
            true_answer: req.body.true_answer,
            complexity: req.body.complexity
        };
        var question_num = req.body._id;
        if (!Additional.checkArguments(question_data) || !question_num) {
            return res.send(Additional.serialize(2, 'Required fields are empty'));
        }
        question_data.code = req.body.code;
        Models.questions.update({
            _id: question_num
        }, question_data).then(function () {
            return res.send(Additional.serialize(0));
        }).catch(function (err) {
            console.log(err);
            return res.send(Additional.serialize(1, 'Server error'));
        });
    }

    deleteQuestion(req, res, next) {
        var question_num = req.body._id;
        if (!question_num) {
            return res.send(Additional.serialize(2, 'Required fields are empty'));
        }
        Models.questions.findOneAndRemove({
            _id: question_num
        }).then(function () {
            return res.send(Additional.serialize(0));
        }).catch(function (err) {
            console.log(err);
            return res.send(Additional.serialize(1, 'Server error'));
        });
    }

    getTest(req, res, next) {
        var target_test = req.query.test;
        Models.tests.findOne({
            _id: target_test,
            active: true
        }).then(function (test) {
            if (!test) {
                return res.send(Additional.serialize(12, 'Not found'));
            }
            else {
                return res.send(Additional.serialize(0, test));
            }
        }).catch(function (err) {
            console.log(err);
            return res.send(Additional.serialize(1, 'Server error'));
        });
    }

    getTests(req, res, next) {
        var request_type = Number(req.query.type);
        var user = req.user;
        var query = {};
        var target_tests;
        Models.tests.find({
            active: true
        }).then(function (all_tests) {
            switch (request_type) {
                // only not solved
                case 1:
                    target_tests = all_tests.filter(function (test) {
                        return !(user.success_tests.indexOf(test._id) > -1);
                    });
                    break;
                // only solved
                case 2:
                    target_tests = all_tests.filter(function (test) {
                        return user.success_tests.indexOf(test._id) > -1;
                    });
                    break;
                default:
                    target_tests = all_tests;
            }
            return res.send(Additional.serialize(0, target_tests));
        }).catch(function (err) {
            console.log(err);
            return res.send(Additional.serialize(1, 'Server error'));
        });
    }

    allTests(req, res, next) {
        Models.tests.find().then(function (tests) {
            return res.send(Additional.serialize(0, tests));
        }).catch(function (err) {
            console.log(err);
            return res.send(Additional.serialize(1, 'Server error'));
        });
    }

    allQuestions(req, res, next) {
        Models.questions.find().then(function (tests) {
            return res.send(Additional.serialize(0, tests));
        }).catch(function (err) {
            console.log(err);
            return res.send(Additional.serialize(1, 'Server error'));
        });
    }

    availableTest(req, res, next) {
        var user = req.user;
        var test = req.query.num;
        Additional.checkAvailable(user, test).then(function (result) {
            return res.send(Additional.serialize(0, result));
        }).catch(function (err) {
            return res.send(Additional.serialize(err));
        });
    }

    startTesting(req, res, next) {
        var user = req.user;
        var test_num = req.body.num;
        var test;
        var all_question;
        if (!test_num) {
            return res.send(Additional.serialize(2, 'Required fields are empty'));
        }
        if (user.success_tests.indexOf(test_num) > -1) {
            return res.send(Additional.serialize(3, 'You have already passed this test'));
        }
        Additional.checkAvailable(user, test_num).then(function (result) {
            if (!result.available) {
                return res.send(Additional.serialize(4, 'The recent failed attempt'));
            }
            return Models.tests.findOne({
                _id: test_num,
                active: true
            });
        }).then(function (target_test) {
            test = target_test;
            var question_search = [];
            for (var i = 1; i <= 3; i++) {
                question_search.push(Models.questions.find({
                    test: test_num,
                    complexity: i
                }));
            }
            return Promise.all(question_search);
        }).then(function (questions) {
            var easy = _.sample(questions[0], test.easyCol);
            var middle = _.sample(questions[1], test.middleCol);
            var hard = _.sample(questions[2], test.hardCol);
            easy = _.pluck(easy, '_id');
            middle = _.pluck(middle, '_id');
            hard = _.pluck(hard, '_id');
            all_question = easy.concat(middle, hard);
            return Models.solutions.create({
                start: new Date(),
                user: user._id,
                test: test_num,
                questions: all_question,
                answers: [],
                result: null
            });
        }).then(function (solution) {
            return res.send(Additional.serialize(0, solution));
        }).catch(function (err) {
            console.log(err);
            return res.send(Additional.serialize(1, 'Server error'));
        });
    }

    takeAnswer(req, res, next) {
        var answer_data = {
            user: req.user,
            answer_num: req.body.answer_num,
            question_num: req.body.question,
            test_num: req.body.test,
            solution_num: req.body.solution
        };
        if (!Additional.checkArguments(answer_data)) {
            return res.send(Additional.serialize(2, 'Required fields are empty'));
        }
        var last_question = false;
        var target_solution;
        var search = [];
        search.push(Models.solutions.findOne({
            _id: answer_data.solution_num,
            user: answer_data.user._id
        }));
        search.push(Models.questions.findOne({
            _id: answer_data.question_num
        }));
        Promise.all(search).then(function (result) {
            if (
                !result[0] || !result[1] ||
                result[0].questions.indexOf(answer_data.question_num) == -1 ||
                result[1].test != answer_data.test_num
            ) {
                return res.send(Additional.serialize(3, 'Incorrect data'));
            }
            target_solution = result[0];
            var current_answers = result[0].answers;
            current_answers.push(answer_data.answer_num);
            if (current_answers.length >= result[0].questions.length) {
                last_question = true;
            }
            else {
                return Models.solutions.update({
                    _id: answer_data.solution_num
                }, {
                    answers: current_answers
                });
            }
        }).then(function () {
            if (last_question) {
                return Additional.finishTest(target_solution);
            }
            else {
                return res.send(Additional.serialize(0));
            }
        }).then(function (result) {
            if (!result.socket) {
                return res.send(Additional.serialize(0, result));
            }
        }).catch(function (err) {
            console.log(err);
            return res.send(Additional.serialize(1, 'Server error'));
        });
    }

    getQuestion(req, res, next) {
        var question_data = {
            user: req.user,
            question_num: req.body.question,
            test_num: req.body.test,
            solution_num: req.body.solution
        };
        if (!Additional.checkArguments(question_data)) {
            return res.send(Additional.serialize(2, 'Required fields are empty'));
        }
        Models.solutions.findOne({
            _id: question_data.solution_num,
            user: question_data.user._id
        }).then(function (solution) {
            if (!solution || solution.questions.indexOf(question_data.question_num) == -1) {
                return res.send(Additional.serialize(3, 'Incorrect data'));
            }
            return Models.questions.findOne({
                _id: question_data.question_num,
                test: question_data.test_num
            });
        }).then(function (question) {
            if (!question) {
                return res.send(Additional.serialize(12, 'Not Found'));
            }
            question.true_answer = null;
            return res.send(Additional.serialize(0, question));
        }).catch(function (err) {
            console.log(err);
            return res.send(Additional.serialize(1, 'Server error'));
        });
    }

    getQuestionsCol(req, res, next) {
        Models.tests.find().then(function (tests) {
            var question_requests = tests.map(function (test) {
                var test_all_complexity = [];
                var activity = test.active ? '' : ' (inactive)';
                test_all_complexity.push(test.title + activity);
                for (var i = 1; i <= 3; i++) {
                    test_all_complexity.push(Models.questions.count({
                        test: test._id,
                        complexity: i
                    }));
                }
                return Promise.all(test_all_complexity);
            });
            return Promise.all(question_requests);
        }).then(function (questions) {
            questions = questions.map(function (test) {
                var total = test.reduce(function (sum, current) {
                    if (typeof current == 'number') {
                        return sum + current;
                    }
                    else {
                        return sum;
                    }
                }, 0);
                test.push(total);
                return test;
            });
            return res.send(Additional.serialize(0, questions));
        }).catch(function (err) {
            return res.send(Additional.serialize(1, 'Server error'));
        });
    }

    getTestStatus(req, res, next) {
        var test_num = req.query.test;
        var user = req.user;
        if (!test_num) {
            return res.send(Additional.serialize(2, 'Required fields are empty'));
        }
        if (!user) {
            return res.send(Additional.serialize(3, 'You must be a user'));
        }
        if (user.success_tests.indexOf(test_num) > -1) {
            return res.send(Additional.serialize(5, 'You already have this certificate'));
        }
        Models.tests.findOne({
            _id: test_num,
            active: true
        }).then(function (test) {
            if (!test) {
                return res.send(Additional.serialize(12, 'Test not found'));
            }
            return Additional.checkAvailable(user, test_num);
        }).then(function (status) {
            if (status.error) {
                throw status.error;
            }
            if (!status.available) {
                return res.send(Additional.serialize(6, status));
            }
            return res.send(Additional.serialize(0, status));
        }).catch(function (err) {
            return res.send(Additional.serialize(1, 'Server error'));
        });
    }

    getCategoryTests(req, res, next) {
        var user = req.user;
        if (!user) {
            return res.send(Additional.serialize(2, 'Required fields are empty'));
        }
        var all_tests = {
            all: {},
            received: [],
            unreceived: [],
            available: [],
            unavailable: []
        };
        var available_requests = [];
        Models.tests.find({
            active: true
        }).then(function (tests) {
            tests.forEach(function (test) {
                all_tests.all[test._id] = test.title;
                if (user.success_tests.indexOf(test._id) > -1) {
                    all_tests.received.push(test);
                }
                else {
                    all_tests.unreceived.push(test);
                    available_requests.push(Additional.checkAvailable(user, test._id));
                }
            });
            return Promise.all(available_requests);
        }).then(function (availability) {
            availability.forEach(function (result, index) {
                if (result.available) {
                    all_tests.available.push(all_tests.unreceived[index]);
                }
                else {
                    all_tests.unavailable.push(all_tests.unreceived[index]);
                }
            });
            return res.send(Additional.serialize(0, all_tests));
        }).catch(function (err) {
            return res.send(Additional.serialize(1, 'Server error'));
        });
    }

    getCertificates(req, res, next) {
        var user = req.user;
        if (!user) {
            return res.send(Additional.serialize(2, 'Required fields are empty'));
        }
        Models.certificates.find({
            user: user._id
        }).then(function (result) {
            return res.send(Additional.serialize(0, result));
        }).catch(function (err) {
            return res.send(Additional.serialize(1, 'Server error'));
        });
    }

    getCertificate(req, res, next) {
        var certificate = req.query.cert;
        if (!certificate) {
            return res.send(Additional.serialize(2, 'Required fields are empty'));
        }
        Models.certificates.findOne({
            _id: certificate
        }).then(function (result) {
            if (!result) {
                return res.send(Additional.serialize(12, 'Not found'));
            }
            return res.send(Additional.serialize(0, result));
        }).catch(function (err) {
            return res.send(Additional.serialize(1, 'Server error'));
        });
    }

    getReports(req, res, next) {
        var type = req.query.type || 0;
        Models.reports.find({
            solved: false,
            type: type
        }).then(function (reports) {
            return res.send(Additional.serialize(0, reports));
        }).catch(function (err) {
            return res.send(Additional.serialize(1, 'Server error'));
        });
    }

    getSolutions(req, res, next) {
        var user = req.user;
        Models.solutions.find({
            user: user._id
        }).then(function (solutions) {
            return res.send(Additional.serialize(0, solutions));
        }).catch(function (err) {
            return res.send(Additional.serialize(1, 'Server error'));
        });
    }

    createOrder(req, res, next) {
        var user = req.user;
        var order_data = {
            certificate: req.body.certificate,
            test: req.body.test
        };
        var addr_data = {
            line1: req.body.line1,
            city: req.body.city,
            state: req.body.state,
            postal_code: req.body.postal,
            country_code: req.body.country
        }
        var telephone_data = {
            country: req.body.t_country,
            national: req.body.t_national
        }
        if (
            !Additional.checkArguments(order_data) ||
            !Additional.checkArguments(telephone_data) ||
            !Additional.checkArguments(addr_data) ||
            !user
        ) {
            return res.send(Additional.serialize(2, 'Required fields are empty'));
        }
        order_data.addr = addr_data;
        order_data.telephone = telephone_data;
        order_data.user = user._id;
        order_data.mail = user.mail;
        Orders.create(order_data, user).then(function () {
            return res.send(Additional.serialize(0));
        }).catch(function (err) {
            console.log(err);
            return res.send(Additional.serialize(1, 'Server error'));
        });
    }

    getOrders(req, res, next) {
        var user = req.user;
        if (!user) {
            return res.send(Additional.serialize(3, 'You must be a user'));
        }
        Models.orders.find({
            user: user._id
        }).then(function (orders) {
            return res.send(Additional.serialize(0, orders));
        }).catch(function (err) {
            return res.send(Additional.serialize(1, 'Server error'));
        });
    }

    payment_data(req, res, next) {
        var id = req.body.item_number;
        Models.orders.update({
            _id: id
        }, {
            payment: req.body
        }).then(function (orders) {
            if (req.body.payment_status == 'Completed') {
                return Models.orders.update({
                    _id: id
                }, {
                    status: 1,
                    paid: true
                }); 
            }
            return res.send(Additional.serialize(0, orders));
        }).then(function () {
            return res.send(Additional.serialize(0, orders));
        }).catch(function (err) {
            console.log(err);
            return res.send(Additional.serialize(1, 'Server error'));
        });
    }
}

module.exports = API;
