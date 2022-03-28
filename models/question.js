const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    question : String,
    askedBy : String,
    answered: Boolean,
    answerCount: Number
}, {timestamps: true});

const Question = mongoose.model('question', questionSchema);
module.exports = Question;