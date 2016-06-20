'use strict';

var _ = require('underscore');
var md5 = require('md5');

var Mail = new (require('./mail'))();

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
    confirm(user) {
        Mail.confirm(user);
    }
}

module.exports = Additional;
