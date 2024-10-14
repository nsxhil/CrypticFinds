const express = require('express');
const router = express.Router();
const {Question, branch1} = require('../models/Questions');



// Route to fetch all questions
router.get('/ch0', async (req, res) => {
  try {
    const questions = await Question.find().sort({ questionID: 1 });
    console.log('Fetched questions:', questions);
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Error fetching questions o no', error: error.message });
  }
});

router.get('/branch1', async (req, res) => {
  try {
    const questions = await branch1.find().sort({ questionID: 1 });
    console.log('Fetched questions:', questions);
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions: o no', error);
    res.status(500).json({ message: 'Error fetching questions in branch1', error: error.message });
  }
});



module.exports = router;
