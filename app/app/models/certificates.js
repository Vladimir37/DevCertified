var mongoose = require('mongoose');

var certificateSchema = new mongoose.Schema({
    title: String,
    user: String,
    name: String,
    date: Date
});

var certificateModel = mongoose.model('Certificate', certificateSchema);

module.exports = certificateModel;
