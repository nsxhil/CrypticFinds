const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const router = express.Router();

// Remove this line
// const corsOptions = { ... };

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

        user = new User({ username, email, phoneNumber, password });
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
        res.json({ token, username: user.username, phoneNumber: user.phoneNumber, email: user.email }); 
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

module.exports = router;