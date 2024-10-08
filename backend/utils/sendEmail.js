const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // Use TLS
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false // pls future lakshay, remove in production
        }
    });

   
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        text: options.text
    };

    
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;