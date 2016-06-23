'use strict';

var fs = require('fs');

class Client {
    constructor() {
        fs.readFile('client/page/page.html', (err, page) => {
            if (err) {
                throw err;
            }
            else {
                this.page = page;
            }
        })
    }

    renderPage(req, res, next) {
        res.end(this.page);
    }
}

module.exports = Client;
