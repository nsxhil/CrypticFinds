const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');  
const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questionRoutes');
require('dotenv').config();
const https = require('https');

const app = express();
const PORT = 443

app.use(cors({
  origin: true, 
  credentials: true, 
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use the routes as middleware
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

//app.listen(PORT, () => {
//    console.log(`Server running on port ${PORT}`);
//});

// Keep-alive route
// app.get('/keep-alive', (req, res) => {
//     res.status(200).send('Server is alive');
// });

// // Keep-alive function
// const keepAliveInterval = 14 * 60 * 1000; // 14 minutes

// function keepAlive() {
//     fetch(`${process.env.SERVER_URL}/keep-alive`)
//         .then(response => console.log('Keep-alive response:', response.status))
//         .catch(error => console.error('Keep-alive error:', error));
// }

// setInterval(keepAlive, keepAliveInterval);

const options = {
  cert: fs.readFileSync('/etc/letsencrypt/live/backend.crypticfinds.live/fullchain.pem'),
  key: fs.readFileSync('/etc/letsencrypt/live/backend.crypticfinds.live/privkey.pem')
};

https.createServer(options, app).listen(PORT);




