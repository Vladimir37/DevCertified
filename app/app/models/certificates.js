var mongoose = require('mongoose');

var certificateSchema = new mongoose.Schema({
    title: String,
    user: String,
    name: String,
    date: Date
});
var certificateModel = mongoose.model('Certificate', certificateSchema);

var orderSchema = new mongoose.Schema({
    paid: Boolean,
    certificate: String,
    mail: String,
    first: String,
    last: String,
    user: String,
    address: {
        line1: String,
        city: String,
        state: String,
        postal_code: String,
        country_code: String
    },
    telephone: {
        contry: String,
        national: String
    }
});
var orderModel = mongoose.model('Order', orderSchema);

exports.certificate = certificateModel;
exports.order = orderModel;
