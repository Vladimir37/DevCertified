'use strict';

var passport = require('passport');
var _ = require('underscore');
var formidable = require('formidable');
var md5 = require('md5');
var fs = require('fs');

var Models = require('../models/main');
var Additional = new (require('./additional'))();
var Mail = new (require('./mail'))();

class API {
    // Auth and registration
    registration(req, res, next) {
        var user_data = {
            mail: req.body.mail,
            pass: md5(req.body.password),
            first: req.body.first,
            last: req.body.last
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
            Mail.registration(user);
            Mail.confirm(user);
            return res.send(Additional.serialize(0));
        }).catch(function (err) {
            console.log(err);
            // TODO Error - user exists
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
            _id: confirmation_code,
            status: 0
        }).then(function (user) {
            if (!user) {
                return res.send(Additional.serialize(2, 'Incorrect code'));
            }
            return Models.users.update({
                _id: confirmation_code,
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
        var additional_report_data = {
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
        if (req.body.code) {
            question_data.code = req.body.code;
        }
        var question_num = req.body.num;
        if (!Additional.checkArguments(question_data) || !question_data) {
            return res.send(Additional.serialize(2, 'Required fields are empty'));
        }
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
        var question_num = req.body.num;
        if (!question_data) {
            return res.send(Additional.serialize(2, 'Required fields are empty'));
        }
        Models.questions.destroy({
            _id: question_num
        }).then(function () {
            return res.send(Additional.serialize(0));
        }).catch(function (err) {
            console.log(err);
            return res.send(Additional.serialize(1, 'Server error'));
        });
    }

    getTests(req, res, next) {
        var request_type = Number(req.body.type);
        var user = req.user;
        var query = {};
        var target_tests;
        if (!request_type) {
            return res.send(Additional.serialize(2, 'Required fields are empty'));
        }
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
        var test_num = req.query.num;
        var test;
        var all_question;
        if (!test_num) {
            return res.send(Additional.serialize(2, 'Required fields are empty'));
        }
        if (!user.success_tests.indexOf(test_num) > -1) {
            return res.send(Additional.serialize(3, 'You have already passed this test'));
        }
        Additional.checkAvailable(user, test_num).then(function (result) {
            return Models.tests.findOne({
                _id: test_num,
                active: true
            });
        }).then(function (target_test) {
            test = target_test;
            var question_search = [];
            for (var i = 0; i < 2; i++) {
                question_search.push(Models.questions.find({
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
        }).then(function () {
            return res.send(Additional.serialize(0));
        }).catch(function (err) {
            return res.send(Additional.serialize(err));
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
                result[0].questions.indexOf(question_num) == -1 ||
                result[1].test != test_num
            ) {
                return res.send(Additional.serialize(3, 'Incorrect data'));
            }
            target_solution = result[0];
            var current_answers = result[0].answers;
            current_answers.push(answer_num);
            if (current_answers >= result[0].questions) {
                last_question = true;
            }
            else {
                return Models.solutions.update({
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
            if (result) {
                return res.send(Additional.serialize(0, result));
            }
        }).catch(function (err) {
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
            if (!solution || solution.questions.indexOf(question_num) == -1) {
                return res.send(Additional.serialize(3, 'Incorrect data'));
            }
            return Models.questions.findOne({
                _id: question_data,
                test: test_nums
            });
        }).then(function (question) {
            return res.send(Additional.serialize(0, question));
        }).catch(function (err) {
            return res.send(Additional.serialize(1, 'Server error'));
        });
    }
}

module.exports = API;
