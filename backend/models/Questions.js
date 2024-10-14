const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    questionID: { type: String, required: true, unique: true },
    storyDesc: { type: String, required: true },
    questionDesc: { type: String, required: true },
    answer: { type: String, required: true },
    hint: { type: String, required: true },
});

const Question = mongoose.model('Questions', QuestionSchema);
const branch1 = mongoose.model('branch1', QuestionSchema);

module.exports = { Question, branch1 };