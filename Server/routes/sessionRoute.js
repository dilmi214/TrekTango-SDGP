const express = require('express');
const router = express.router;
const {createSession, latestIncompleteSession} = require('../controllers/sessionController');

router.route('./createSession').post(createSession);
router.route('./onGoingSession').post(latestIncompleteSession);

module.exports = router;