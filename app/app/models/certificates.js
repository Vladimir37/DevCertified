var mongoose = require('mongoose');

var certificateSchema = new mongoose.Schema({
    title: String,
    name: String,
    date: String
});

var certificateModel = mongoose.model('Certificate', certificateSchema);

module.exports = certificateModel;
