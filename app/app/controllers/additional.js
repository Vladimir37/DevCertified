'use strict';

var _ = require('underscore');
var md5 = require('md5');

var Mail = new (require('./mail'))();
var Models = require('../models/main');

class Additional {
    serialize(status, body) {
        body = body || null;
        var result = {
            status,
            body
        };
        return JSON.stringify(result);
    }

    checkArguments(obj) {
        return _.values(obj).every(function (value) {
            return value;
        });
    }

    checkAvailable(user, test) {
        return new Promise(function (resolve, reject) {
            var available_data = {
                error: null,
                available: false,
                results: null,
                next: null
            };
            if (!user || !test) {
                available_data.error = 2;
                resolve(available_data);
            }
            Models.solutions.findOne({
                user: user._id,
                test
            }).then(function (solution) {
                if (!solution) {
                    available_data.available = true;
                    return resolve(available_data);
                }
                var max_date = new Date();
                max_date.setDate(max_date.getDate() - 30);
                var block = solution.start > max_date;
                if (block) {
                    var next_date = solution.start;
                    next_date.setDate(next_date.getDate() + 30);
                    available_data.available = false;
                    available_data.results = solution;
                    available_data.next = next_date;
                    resolve(available_data);
                }
                else {
                    available_data.available = true;
                    available_data.results = solution;
                    resolve(available_data);
                }
            }).catch(function (err) {
                console.log(err);
                available_data.error = 1;
                resolve(available_data);
            });
        })
    }

    finishTest(solution) {
        return new Promise(function(resolve, reject) {
            var certify = false;
            var true_answers_col = 0;
            var target_answers_col = 0;
            var all_col = 0;
            var questions_search = [];
            solution.questions.forEach(function (item) {
                questions_search.push(Models.questions.findOne({
                    _id: item
                }));
            });
            Promise.all(questions_search).then(function (questions) {
                all_col = questions.length;
                var true_answers = _.pluck(questions, 'true_answer');
                solution.answers.forEach(function (answer, index) {
                    answer == true_answers[index] ? ++true_answers_col : false;
                });
                var min_value = Math.ceil(questions.length * 0.75);
                target_answers_col = min_value;
                if (true_answers_col >= min_value) {
                    certify = true
                }
                return Models.solutions.update({
                    _id: solution._id
                }, {
                    result: true_answers_col,
                    certify
                });
            }).then(function () {
                if (certify) {
                    var query = [];
                    query.push(Models.users.findOne({
                        _id: solution.user
                    }));
                    query.push(Models.tests.findOne({
                        _id: solution.test
                    }));
                    return Promise.all(query);
                }
                else {
                    return resolve({
                        success: false,
                        answers: true_answers_col,
                        target: target_answers_col,
                        all: all_col
                    });
                }
            }).then(function (data) {
                if (!data) {
                    return reject(1);
                }
                else {
                    return Models.certificates.create({
                        title: data[1].title,
                        user: data[0]._id,
                        name: data[0].first + ' ' + data[0].last,
                        date: new Date()
                    });
                }
            }).then(function (certificate) {
                if (!certificate) {
                    return reject(1);
                }
                Mail.certify(certificate);
                return resolve({
                    success: true,
                    answers: true_answers_col,
                    target: target_answers_col,
                    all: all_col,
                    certificate: certificate._id
                });
            }).catch(function (err) {
                console.log(err);
                reject(1);
            });
        });
    }
}

module.exports = Additional;
