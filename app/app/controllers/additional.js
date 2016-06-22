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
}

module.exports = Additional;
