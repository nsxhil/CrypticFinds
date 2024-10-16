const express = require('express');
const router = express.Router();
const {Question, branch1, chapterqs, landq} = require('../models/Questions');



// Route to fetch all questions
router.get('/ch0', async (req, res) => {
  try {
    const questions = await Question.find().select('-answer -hint').sort({ questionID: 1 });
    console.log('Fetched questions:', questions);
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Error fetching questions o no', error: error.message });
  }
});

router.get('/branch1', async (req, res) => {
  try {
    const questions = await branch1.find().select('-answer -hint').sort({ questionID: 1 });
    console.log('Fetched questions:', questions);
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions: o no', error);
    res.status(500).json({ message: 'Error fetching questions in branch1', error: error.message });
  }
});
router.get('/landqs', async (req, res) => {
  try {
    const questions = await landq.find().select('-answer -hint').sort({ questionID: 1 });
    console.log('Fetched questions lands:', questions);
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions: o no', error);
    res.status(500).json({ message: 'Error fetching questions in branch1', error: error.message });
  }
});
router.get('/chapterqs', async (req, res) => {
  try {
    const questions = await chapterqs.find().select('-answer -hint').sort({ questionID: 1 });
    console.log('Fetched questions chapter:', questions);
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions: o no', error);
    res.status(500).json({ message: 'Error fetching questions in branch1', error: error.message });
  }
});


router.post('/checkans', async (req, res) => {
  try {
    const { questionId, userAnswer, gameState } = req.body;
    let question;

    
    switch (gameState) {
      case 'ch0':
        question = await Question.findOne({ questionID: questionId });
        break;
      case 'space':
        question = await branch1.findOne({ questionID: questionId });
        break;
      case 'land':
        question = await landq.findOne({ questionID: questionId });
        break;
      case 'merge':
        question = await chapterqs.findOne({ questionID: questionId });
        break;
      default:
        return res.status(400).json({ message: 'Invalid game state' });
    }

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const isCorrect = userAnswer.toLowerCase() === question.answer.toLowerCase();

    if (isCorrect) {
      res.json({ correct: true });
    } else {
      res.json({ correct: false, hint: question.hint });
    }
  } catch (error) {
    console.error('Error checking answer:', error);
    res.status(500).json({ message: 'Error checking answer', error: error.message });
  }
});

module.exports = router;
