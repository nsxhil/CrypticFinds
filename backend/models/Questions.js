const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    questionID: { type: String, required: true, unique: true },
    questionDesc: { type: String, required: true},
    answer: { type: String, required: true },
    hint: { type: String, required: true },
});

module.exports = mongoose.model('Questions', QuestionSchema);
