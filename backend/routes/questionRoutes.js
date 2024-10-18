const express = require('express');
const router = express.Router();
const {Question, branch1, chapterqs, landq} = require('../models/Questions');
const User = require('../models/User');
const auth = require('../middleware/auth')


// Route to fetch all questions
// router.get('/ch0', async (req, res) => {
//   try {
//     const questions = await Question.find().select('-answer -hint').sort({ questionID: 1 });
//     res.json(questions);
//   } catch (error) {
//     console.error('Error fetching questions:', error);
//     res.status(500).json({ message: 'Error fetching questions o no', error: error.message });
//   }
// });

// router.get('/branch1', async (req, res) => {
//   try {
//     const questions = await branch1.find().select('-answer -hint').sort({ questionID: 1 });
//     res.json(questions);
//   } catch (error) {
//     console.error('Error fetching questions: o no', error);
//     res.status(500).json({ message: 'Error fetching questions in branch1', error: error.message });
//   }
// });
// router.get('/landqs', async (req, res) => {
//   try {
//     const questions = await landq.find().select('-answer -hint').sort({ questionID: 1 });
//     res.json(questions);
//   } catch (error) {
//     console.error('Error fetching questions: o no', error);
//     res.status(500).json({ message: 'Error fetching questions in branch1', error: error.message });
//   }
// });
// router.get('/chapterqs', async (req, res) => {
//   try {
//     const questions = await chapterqs.find().select('-answer -hint').sort({ questionID: 1 });
//     console.log('Fetched questions chapter:', questions);
//     res.json(questions);
//   } catch (error) {
//     console.error('Error fetching questions: o no', error);
//     res.status(500).json({ message: 'Error fetching questions in branch1', error: error.message });
//   }
// });

router.post('/question',auth,  async (req, res) => {
  try {
    // Fetch the user based on the request (assuming a username or token is available in the request)
    const { username } = req.body; // Or extract from req.user if using authentication middleware
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    // const user = await User.findOne({ username });
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let question;
    console.log(user.currentState)
    // Determine which question set to fetch based on the user's current state
    switch (user.currentState) {
      case 'ch0':
        question = await Question.findOne({ questionID: user.questionNo }).select('-answer -hint');
        break;
      case 'space':
        question = await branch1.findOne({ questionID: user.questionNo }).select('-answer -hint');
        break;
      case 'land':
        question = await landq.findOne({ questionID: user.questionNo }).select('-answer -hint');
        break;
      case 'merge':
        question = await chapterqs.findOne({ questionID: user.questionNo }).select('-answer -hint');
        break;
      case 'merging': 
        question= await landq.findOne({ questionID: "1" }).select('-answer -hint');
        break;
      case 'choosebranch':
        question= await Question.findOne({ questionID: "1" }).select('-answer -hint');
        break;
        case 'end':
          question = await chapterqs.findOne({ questionID: user.questionNo });
          break;

      default:
        return res.status(400).json({ message: 'Invalid game state' });
    }

    // Check if the question was found
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

   console.log(question)
    res.status(200).json({question:question,score:user.score,currentState:user.currentState});
    
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Error fetching questions', error: error.message });
  }
});

router.post('/checkans',auth, async (req, res) => {
  try {
    const {username, userAnswer} = req.body;
    // const { questionId, userAnswer, gameState } = req.body;
    let question;

    // const user = await User.findOne({ username });
    const user = await User.findById(req.user.id);


    
    switch (user.currentState) {
      case 'ch0':
        question = await Question.findOne({ questionID: user.questionNo });
        break;
      case 'space':
        question = await branch1.findOne({ questionID: user.questionNo });
        break;
      case 'land':
        question = await landq.findOne({ questionID: user.questionNo });
        break;
      case 'merge':
        question = await chapterqs.findOne({ questionID: user.questionNo });
        break;
        
      default:
        return res.status(400).json({ message: 'Invalid game state' });
    }

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const isCorrect = userAnswer.toLowerCase() === question.answer.toLowerCase();

    if (isCorrect) {
      console.log(user?.currentState)
      //update score, ques no. , and state.
      user.score = ( parseInt(user.score) + 1).toString();
      if (user.currentState === 'ch0'){
        if(parseInt(user.questionNo) + 1 > 6){
          user.currentState = 'choosebranch';
          user.questionNo = '1';
        }
        else{
        
          user.questionNo = ( parseInt(user.questionNo) + 1).toString();
        }
      }
      
        else if(user?.currentState === "land" ||
                user?.currentState === "space"){
                  console.log(user.questionNo)
                  if(parseInt(user.questionNo) + 1 > 8){
                    user.currentState = 'merging';
                    user.questionNo = '1';
                    console.log("made it 9")
                  }
                  else{
                    console.log("hello 2")
                    user.questionNo = ( parseInt(user.questionNo) + 1).toString();
                  }
        }

        else if (user?.currentState === "merge"){
          if(parseInt(user.questionNo)+1 > 10){
            user.currentState = 'end';
            user.questionNo = '1';
            const endtime = new Date();
              const starttime = new Date(user?.startTime ? user.startTime : 0);
              const timeTakenInMilliseconds =
                endtime.getTime() - starttime.getTime();
              user.timetaken=timeTakenInMilliseconds
          }
          else{
            user.questionNo = ( parseInt(user.questionNo) + 1).toString();
          }

        }
        await user.save()



      
      res.json({ correct: true });
    } else {
      res.json({ correct: false, hint: question.hint });
    }
  } catch (error) {
    console.error('Error checking answer:', error);
    res.status(500).json({ message: 'Error checking answer', error: error.message });
  }
});

router.post('/startGame', auth ,  async (req, res) => {
  const currentDateTime = new Date();
    const {username} = req.body;
    // const { questionId, userAnswer, gameState } = req.body;
    let question;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found in start' });
      }
    // const user = await User.findOne({ username });  
    if(user.currentState==='start'){ 
    user.currentState="ch0";
    await user.save() }
    // user.startTime=currentDateTime;
       
    res.json(user.currentState)
});

router.post('/branch', auth, async (req, res) => {      
    try{
      const {branch} = req.body;
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found in branch' });
        }
      let question;
      // const user = await User.findOne({ username });   
      if(user.score === '6'){      
        user.currentState=branch;

      }
      else{
        user.currentState='ch0';
      }

      await user.save()    
      res.json(user.currentState)}
catch(err){
  res.status(500).json({message: 'error branching'});
  console.error(err.message);
}});

router.post('/getState', async (req, res) => {
  const {username} = req.body;
  // const { questionId, userAnswer, gameState } = req.body;
  const user = await User.findOne({ username });   
  res.json(user.currentState)
});
router.post('/merging',auth,  async (req, res) => {
  const {username} = req.body;
  // const { questionId, userAnswer, gameState } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
    }
  // const user = await User.findOne({ username }); 
  user.currentState="merge"
  await user.save()
  res.json({question:user.questionNo,score:user.score,currentState:user.currentState})
});

router.post('/updateendtime',auth, async (req, res) => {
    // console.log('in updatetime')
  // const {username} = req.body;
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
    }
  if(user.currentState != 'end'){
    res.status(404).json({message: 'you should not have been here' });
  }
  console.log(process.env.STARTTIME);
  const currTime = new Date();
  const starttime = process.env.STARTTIME || '2024-10-18T00:00:00Z' ;
  // console.log(startTime, currTime)
  const start = new Date(starttime);
  console.log(start);
  if (!start || isNaN(start)) {
    return res.status(500).json({ message: 'Invalid or missing start time from environment variables' });
  };
  ttmillis = (currTime.getTime() - start.getTime());
  user.timeTaken = ttmillis;
  await user.save()
  console.log(ttmillis, start, currTime, user?.timeTaken)
  res.status(200).json({message: 'endtime updated successfully'})
  // console.log("hogya")
})

module.exports = router;


