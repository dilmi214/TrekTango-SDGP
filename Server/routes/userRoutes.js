const express = require('express');
const router = express.Router();
const {registerUser, loginUser, sendVerificationCode, forgotPassword} = require('../controllers/userController');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/sendVerificationCode').put(sendVerificationCode);
router.route('/forgotPassword').put(forgotPassword);

module.exports = router;