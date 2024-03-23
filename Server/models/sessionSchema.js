const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const sessionSchema = new mongoose.Schema({
  sessionId: {type: String, default: uuidv4(), required: true, unique: true },
  username: { type: String, required: true },
  userId: { type: String, required: true },
  listOfPlaces: [{
    places: { type: Object, required: true },
    listOfImageReferenceIds: { type: String, default: null }
  }],
  sessionComplete: { type: Boolean, default: false },
 createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Location', sessionSchema);