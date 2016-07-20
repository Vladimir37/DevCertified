var mongoose = require('mongoose');

var reportSchema = new mongoose.Schema({
    type: Number,
    user: String,
    addr: String,
    date: Date,
    text: String,
    question: String,
    solved: Boolean
});

var reportModel = mongoose.model('Report', reportSchema);

module.exports = reportModel;
