const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    questionID: { type: String, required: true, unique: true },
    storyDesc: { type: String, required: true },
    questionDesc: { type: String, required: true },
    answer: { type: String, required: true },
    hint: { type: String, required: true },
});

const Questions = mongoose.model('Questions', QuestionSchema);
const Branch1 = mongoose.model('branch1', QuestionSchema);

module.exports = { Questions, Branch1 };