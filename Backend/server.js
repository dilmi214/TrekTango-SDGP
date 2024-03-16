
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

// Import loginScript
const loginScript = require('./login');
// Import socialMediaScript
const socialMediaScript = require('./socialMedia');

const travellingSessionScript = require('./travellingSession');

app.use(travellingSessionScript);

// Create an instance of Express
const app = express();

// Connect to MongoDB
mongoose.connect("mongodb+srv://rithik20222011:Harpyeagle12345@cluster0.my4g36v.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB database');
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Use loginScript routes
app.use(loginScript);
// Use socialMediaScript routes
app.use(socialMediaScript);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});


