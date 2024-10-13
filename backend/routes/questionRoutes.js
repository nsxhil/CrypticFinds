const express = require('express');
const router = express.Router();
const Question = require('../models/Questions');

// Route to fetch all questions
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find().sort({ questionID: 1 });
    console.log('Fetched questions:', questions);
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Error fetching questions', error: error.message });
  }
});



module.exports = router;
