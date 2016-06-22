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
        })
    }

    checkAvailable(user, test) {
        return new Promise(function (resolve, reject) {
            var available_data = {};
            if (!user || !test) {
                reject(2);
            }
            Models.solutions.find({
                user: user._id,
                test
            }).limit(3).sort({
                start: -1
            }).then(function (solutions) {
                var max_date = new Date();
                max_date.setDays(max_date.getDays() - 50);
                var block = solutions.every(function (solution) {
                    return solution.start > max_date;
                });
                if (block) {
                    var next_date = solution[2].start;
                    next_date.setDate(next_date.getDate() + 50);
                    available_data.available = false;
                    available_data.results = solutions;
                    available_data.next = next_date;
                    resolve(available_data);
                }
                else {
                    available_data.available = true;
                    available_data.results = solutions;
                    resolve(available_data);
                }
            }).catch(function (err) {
                console.log(err);
                reject(1);
            });
        })
    }
}

module.exports = Additional;
