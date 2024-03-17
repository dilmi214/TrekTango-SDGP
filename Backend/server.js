
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


// Import the login router
const socialMediaRouter = require('./socialMedia');
const loginRouter = require('./login');

// const travellingSessionRouter = require('./travellingSession');


const app = express();



// Middleware
app.use(bodyParser.json());
app.use(cors());

// Use the login router
app.use(loginRouter);
// app.use(travellingSessionRouter);
app.use(socialMediaRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});


