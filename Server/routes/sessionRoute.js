const express = require('express');
const router = express.Router();
const {createSession, latestIncompleteSession, isCompleted} = require('../controllers/sessionController');

router.route('/createSession').post(createSession);
router.route('/onGoingSession').get(latestIncompleteSession);
router.route('/isCompleted').put(isCompleted);

module.exports = router;