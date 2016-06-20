'use strict';

var passport = require('passport');
var _ = require('underscore');
var md5 = require('md5');

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
        var text = req.body.text;
        var question = req.body.question;
    }
}

module.exports = API;
