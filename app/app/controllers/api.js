'use strict';

var passport = require('passport');
var _ = require('underscore');
var md5 = require('md5');

var Models = require('../models/main');
var Additional = new (require('./additional'))();

class API {
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
        }).then(function () {
            // TODO send mail
            return res.send(Additional.serialize(0));
        }).catch(function (err) {
            console.log(err);
            return res.send(Additional.serialize(1, 'Server error'));
        })
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
                    return res.send(Additional.serialize(0));
                }
            });
        })(req, res, next);
    }
    checkStatus(req, res, next) {
        var user_data = req.user;
        if (!user_data) {
            return res.send(Additional.serialize(1));
        }
        return res.send(Additional.serialize(0, user_data));
    }
}

module.exports = API;
