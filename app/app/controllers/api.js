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
            pass: md5(req.body.pass),
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
                    return res.send(Additional.serialize(0, user));
                }
            });
        })(req, res, next);
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
                easyCol: field.easy_col,
                middleCol: field.middle_col,
                hardCol: field.hard_col,
                easyTime: field.easy_time,
                middleTime: field.middle_time,
                hardTime: field.hard_time,
                img: Date.now() + '.png'
            };
            var image = files.image;
            if (!Additional.checkArguments(test_data)) {
                return res.send(Additional.serialize(2, 'Required fields are empty'));
            }
            test_data.active = false;
            fs.rename(image.path, 'client/source/uploaded/' + test_data.img, function(err) {
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
            easyCol: req.body.easy_col,
            middleCol: req.body.middle_col,
            hardCol: req.body.hard_col,
            easyTime: req.body.easy_time,
            middleTime: req.body.middle_time,
            hardTime: req.body.hard_time
        };
        var test_num = req.body.id;
        if (!Additional.checkArguments(test_data) || !test_num) {
            return res.send(Additional.serialize(2, 'Required fields are empty'));
        }
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
        form.parse(req, function (err, field, files) {
            var data = {
                num: fields.test,
                img: files.image
            };
            if (!Additional.checkArguments(data)) {
                return res.send(Additional.serialize(2, 'Required fields are empty'));
            }
            var filename = Date.now() + '.png';
            fs.rename(image.path, 'client/source/uploaded/' + filename, function(err) {
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
            answer1: req.body.an1,
            answer2: req.body.an2,
            answer3: req.body.an3,
            answer4: req.body.an4,
            true_answer: req.body.true_an,
            complexity: req.body.complexity,
            test: req.body.test
        };
        if (req.body.code) {
            var additional_question_data = {
                code: req.body.code,
                lang: req.body.lang
            }
            _.extend(question_data, additional_question_data);
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
            answer1: req.body.an1,
            answer2: req.body.an2,
            answer3: req.body.an3,
            answer4: req.body.an4,
            true_answer: req.body.true_an,
            complexity: req.body.complexity
        };
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
        Models.tests.find().then(function (all_tests) {
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
            };
            return res.send(Additional.serialize(0, target_tests));
        }).catch(function (err) {
            console.log(err);
            return res.send(Additional.serialize(1, 'Server error'));
        });
    }
}

module.exports = API;
