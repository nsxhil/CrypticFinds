const nodemailer = require('nodemailer');
require('dotenv').config();
// Log the environment variables (remove in production)
console.log('Email User:', process.env.EMAIL_USER);
console.log('Email Pass:', process.env.EMAIL_PASS ? 'Set' : 'Not set');

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // This should be your app password
  }
});

const sendVerificationEmail = async (email, verificationToken) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email for Cryptic Finds',
    html: `
      <h1>Welcome to Cryptic Finds!</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${process.env.FRONTEND_URL}/verify-email/${verificationToken}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully to:', email);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};


module.exports = { sendVerificationEmail };
