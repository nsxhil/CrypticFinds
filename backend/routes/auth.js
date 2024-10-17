const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const auth = require('../middleware/auth');
const cron = require('node-cron');

const router = express.Router();

// Remove this line
// const corsOptions = { ... };

// Signup route
// Signup route
router.post('/signup', async (req, res) => {
    console.log('Received signup request:', req.body);
    const { username, email, phoneNumber, password } = req.body;

    try {
        let user = await User.findOne({ $or: [{ username }, { email }] });
        if (user) {
            console.log('User already exists:', user);
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        // Create user with default values for score, questionNo, currentState, startTime, and timeTaken
        user = new User({
            username,
            email,
            phoneNumber,
            password,
            score: "0", // Ensure these are strings as per your schema or change the schema to use Number
            questionNo: "0",
            currentState: "start",
            startTime: null, // Initially null, will be set when the quiz starts
            timeTaken: 0 // Initially 0, will be calculated when the quiz finishes
        });

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('User created successfully:', user);
        res.status(201).json({ token });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            token,
            username: user.username,
            phoneNumber: user.phoneNumber,
            email: user.email,
            score: user.score,
            questionNo: user.questionNo,
            currentState: user.currentState,
            startTime: user.startTime, // Include startTime for quiz tracking
            timeTaken: user.timeTaken // Include timeTaken for quiz tracking
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


router.post('/getuser', async (req, res) => {
    const {user} = req.body; 
    try{
        const userdata  = await User.findOne({ user });
        console.log(userdata)
        res.status(201).json(userdata)
    } catch(err){
        console.error("error in getting data", err)
        res.status(500).json({message:'error in getting userdata', error: error.message})
    }
})
router.get('/getalluser', async (req, res) => {
    try {
        const usersData = await User.aggregate([
            {
                $project: {
                    username: 1,
                    score: { $toInt: "$score" }, // Convert the score field to an integer
                    timeTaken: 1
                }
            },
            {
                $sort: {
                    score: -1, // Sort by score in descending order
                    timeTaken: 1 // Sort by timeTaken in ascending order
                }

            },

                {
                    $limit: 10  // Limit the result to the top 10 users
                }
            
        ]);

        // console.log(usersData);
        
        res.status(200).json(usersData);
    } catch (err) {
        console.error("Error in getting data", err);
        res.status(500).json({ message: 'Error in getting user data', error: err.message });
    }
});


router.post('/updateStartTime', async (req, res) => {
    const { username, startTime } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the startTime
        if (startTime !== undefined) user.startTime = startTime;

        await user.save();

        console.log('Updated startTime for user:', user);
        res.status(200).json({ message: 'Start time updated successfully', user });
    } catch (error) {
        console.error('Error updating startTime:', error);
        res.status(500).json({ message: 'Error updating startTime', error: error.message });
    }
});
router.post('/updateTimeTaken', async (req, res) => {
    const { username, timeTaken } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        

        // Update the timeTaken
        user.timeTaken = timeTaken;

        await user.save();

        console.log('Updated timeTaken for user:', user);
        res.status(200).json({ message: 'Time taken updated successfully', user });
    } catch (error) {
        console.error('Error updating timeTaken:', error);
        res.status(500).json({ message: 'Error updating timeTaken', error: error.message });
    }
});


router.post('/updateuser', async (req, res) => {
    const { username, score, questionNo, currentState ,startTime } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ username });


        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user's score, questionNo, and currentState if they are provided
        if (score !== undefined ) user.score = user.score +1;
        if (questionNo !== undefined) user.questionNo = questionNo;
        if (currentState !== undefined) user.currentState = currentState;
        if (startTime !== undefined) user.startTime = startTime;

        // Save the updated user document
        await user.save();

        console.log('Updated user data:', user);
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (err) {
        console.error('Error in updating user data:', err);
        res.status(500).json({ message: 'Error in updating user data', error: err.message });
    }
});


// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

       
        const lastRequestTime = resetPasswordRequests.get(email);
        if (lastRequestTime && Date.now() - lastRequestTime < 60000) {
            return res.status(429).json({ message: 'Please wait before requesting another password reset.' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour

        await user.save();

      
        const resetUrl = `http://pasteit.live/reset-password/${resetToken}`;

        // Send email
        await sendEmail({
            to: user.email,
            subject: 'Password Reset Request',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                   Please click on the following link, or paste this into your browser to complete the process:\n\n
                   ${resetUrl}\n\n
                   If you did not request this, please ignore this email and your password will remain unchanged.\n`
        });

        // Update the last request time
        resetPasswordRequests.set(email, Date.now());

        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Error in forgot password:', error);
        res.status(500).json({ message: 'Error processing request' });
    }
});

// Reset Password Route
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
        }

        // Set new password
        user.password = password; 
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error('Error in reset password:', error);
        res.status(500).json({ message: 'Error resetting password' });
    }
});

router.get('/verify', (req, res) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        res.json({ valid: true });
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
});

// Get user data
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
cron.schedule('* * * * * *', async () => {
    const updateAllowedTime = new Date("2024-10-18T23:59:59"); // Set the date from when updates should start
    const currentDateTime = new Date();
    const endTime = new Date(); // End time is the current time when the cron job runs

    if (currentDateTime.getTime() >= updateAllowedTime.getTime()) {
        try {
            // Find all users with timeTaken = 0
            const users = await User.find({ timeTaken: 0 });

            for (let user of users) {
                if (user.startTime) {
                    const startTime = new Date(user.startTime);
                    
                    // Calculate the time taken in milliseconds
                    const timeTakenMilliseconds = updateAllowedTime.getTime() - startTime.getTime();

                    // Convert to hours:minutes:se
                    
                    // Update user's timeTaken
                    user.timeTaken = timeTakenMilliseconds;

                    // Save the updated user
                    await user.save();
                    console.log(`Updated timeTaken for user: ${user.username}`);
                }
            }
        } catch (error) {
            console.error('Error updating timeTaken for users:', error);
        }
    }
});

module.exports = router;
