'use strict';

var fs = require('fs');
var assert = require('assert');
var nodemailer = require('nodemailer');
var ejs = require('ejs');

var config = require('../../../configs/mail.json');
var text = require('../../../configs/text.json');

class Mail {
    constructor() {
        this.letter_files = ['certify', 'pass_change', 'registration', 'reminder', 'confirm'];
        this.letter_files.forEach((subject) => {
            fs.readFile('client/templates/' + subject + '.ejs', 'utf-8', (err, tpl) => {
                assert.ifError(err);
                this[subject + '_tpl'] = tpl;
            });
            this[subject] = (data, addr) => {
                if (!addr) {
                    addr = data.mail;
                }
                var letter = ejs.render(this[subject + '_tpl'], data);
                this.send(letter, text['letter_title_' + subject], addr);
            }
        })
        this.transporter = nodemailer.createTransport({
            service: config.service,
            auth: {
                user: config.login,
                pass: config.pass
            }
        });
    }
    send(letter, title, addr) {
        var mailOptions = {
            from: config.from,
            to: addr,
            subject: title,
            html: letter
        };
        this.transporter.sendMail(mailOptions, function(error, info) {
            if(error) {
                console.log('Send error: ' + error);
            }
            else {
                console.log('Success send: ' + info.response);
            }
        });
    }
}

module.exports = Mail;
