var mongoose = require('mongoose');

var certificateSchema = new mongoose.Schema({
    type: Number,
    text: String,
    question: String,
    status: Number
});

var certificateModel = mongoose.model('Certificate', certificateSchema);

module.exports = certificateModel;