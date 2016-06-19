var LocalStrategy = require('passport-local').Strategy;
var md5 = require('md5');

var Models = require('../models/main');

class Middlewares {
    strategy() {
        return new LocalStrategy(function (username, password, done) {
            Models.user.findOne({
                mail: username
            }).then(function (user) {
                //
            }).catch(function (err) {
                //
            });
        });
    }
}
