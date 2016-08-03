'use strict';

var paypal = require('paypal-rest-sdk');

var Models = require('../models/main');
var config = require('../../../configs/paypal');

class Orders {
    constructor() {
        paypal.configure({
            mode: config.mode,
            client_id: config.client_id,
            client_secret: config.client_secret
        });
        this.paypal = paypal;
    }

    create(data, user) {
        return Models.orders.create({
            paid: false,
            status: 0,
            date: new Date(),
            certificate: data.certificate,
            mail: data.mail,
            first: user.first,
            last: user.last,
            address: {
                line1: data.addr.line1,
                city: data.addr.city,
                state: data.addr.state,
                postal_code: data.addr.postal,
                country_code: data.addr.country
            },
            telephone: {
                contry: data.telephone.country,
                national: data.telephone.national
            }
        });
    }

    invoice(id) {
        Models.orders.findOne({
            _id: id
        }).then(function (order) {
            var create_invoice_json = {
                "merchant_info": {
                    "email": "PPX.DevNet-facilitator@gmail.com",
                    "first_name": "Not applicable",
                    "last_name": "Not applicable",
                    "business_name": "DevCertified",
                    "phone": {
                        "country_code": "001",
                        "national_number": "5032141716"
                    },
                    "address": {
                        "line1": "1234 Main St.",
                        "city": "Portland",
                        "state": "OR",
                        "postal_code": "97217",
                        "country_code": "US"
                    }
                },
                "billing_info": [{
                    "email": "example@example.com"
                }],
                "items": [{
                    "name": "Certificate",
                    "quantity": 1,
                    "unit_price": {
                        "currency": "USD",
                        "value": 90
                    }
                }],
                "note": "Medical Invoice 16 Jul, 2013 PST",
                "payment_term": {
                    "term_type": "NET_45"
                },
                "shipping_info": {
                    "first_name": order.first,
                    "last_name": order.last,
                    "business_name": "Not applicable",
                    "phone": {
                        "country_code": order.telephone.country,
                        "national_number": order.telephone.national
                    },
                    "address": {
                        "line1": order.address.line1,
                        "city": order.address.city,
                        "state": order.address.state,
                        "postal_code": order.address.postal_code,
                        "country_code": order.address.country_code
                    }
                },
                "tax_inclusive": false,
                "total_amount": {
                    "currency": "USD",
                    "value": "90.00"
                }
            };
            this.paypal.invoice.create(create_invoice_json, function (error, invoice) {
                if (error) {
                    throw error;
                } else {
                    console.log("Create Invoice Response");
                    console.log(invoice);
                }
            });
        });
    }
}

module.exports = Orders;
