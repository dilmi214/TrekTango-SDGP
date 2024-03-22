const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const socialMediaPostSchema = new mongoose.Schema({
    username: { type: String, required: true },
    userID: { type: String, required: true },
    postId: { type: String, default: uuidv4(), required: true, unique: true },
    placeId: { type: String, required: true },
    imageReferenceId: { type: String },
    uploadToMedia: { type: Boolean, default: false },
    caption: { type: String },
    comments: {
        type: [{
          commentID: { type: String, default: uuidv4(), required: true, unique: true },
          username: { type: String, required: true },
          comment: { type: String, required: true }
        }],
        default: [] // Default value set to an empty array
      },
    likes: [{ type: String }],
    uploadedDate: { type: Date, default: Date.now }
    
  });

module.exports = mongoose.model('SocialMedia', socialMediaPostSchema);  