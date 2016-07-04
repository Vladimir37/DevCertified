var mongoose = require('mongoose');

var questionSchema = new mongoose.Schema({
    text: String,
    code: String,
    answer1: String,
    answer2: String,
    answer3: String,
    answer4: String,
    true_answer: Number,
    complexity: Number,
    test: String
});
var questionModel = mongoose.model('Question', questionSchema);

var testScheme = new mongoose.Schema({
    title: String,
    description: String,
    easyCol: Number,
    middleCol: Number,
    hardCol: Number,
    easyTime: Number,
    middleTime: Number,
    hardTime: Number,
    img: String,
    active: Boolean
});
var testModel = mongoose.model('Test', testScheme);

var solutionSchema = new mongoose.Schema({
    start: Date,
    user: String,
    test: String,
    questions: Array,
    answers: Array,
    result: Number,
    certify: Boolean
});
var solutionModel = mongoose.model('Solution', solutionSchema);

exports.question = questionModel;
exports.test = testModel;
exports.solution = solutionModel;
