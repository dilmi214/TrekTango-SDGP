const express = require('express');
const router = express.Router();
const {getRefreshedData, publishPost, getPostById, getUserPost, getPublicPostOfUser, likePost, deleteComment, addComment, getPostByUserID} = require('../controllers/socialMediaController');

router.route('/getRefreshedData').post(getRefreshedData);
router.route('/publishPost').post(publishPost);
router.route('/getPostById').put(getPostById);
router.route('/getUserPost').put(getUserPost);
router.route('/getPublicPostofUser').post(getPublicPostOfUser);
router.route('/likePost').post(likePost);
router.route('/deleteComment').put(deleteComment);
router.route('/addComment').put(addComment);
router.route('/getPostByUserID').put(getPostByUserID);

module.exports = router;