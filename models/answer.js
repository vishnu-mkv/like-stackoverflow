const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const answerSchema = new Schema({
    questionID : String,
    answeredBy : String,
    answer: String,
    votes: Number,
    rating: Number,
    comment: String,
    rated: {type: Boolean, default: false},
    file: {type: Boolean, default: false}
}, {timestamps: true});

const Answer = mongoose.model('answer', answerSchema);

module.exports = Answer;