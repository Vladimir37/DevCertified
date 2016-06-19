var mongoose = require('mongoose');

var reportSchema = new mongoose.Schema({
    type: Number,
    text: String,
    question: String,
    status: Number
});

var reportModel = mongoose.model('Report', reportSchema);

module.exports = reportModel;