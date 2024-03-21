const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const locationSchema = new mongoose.Schema({
    sessionId: { type: String, default: uuidv4(), required: true, unique: true },
    username: { type: String, required: true },
    userId: {type: String, required: true},
    listOfPlaces: [{
        placeId: { type: String, required: true },
        complete: { type: Boolean, default: false },
        listOfImageReferenceIds: { type: String, default: null }
    }],
    sessionComplete: { type: Boolean, default: false }
});

module.exports = mongoose.model('Location', locationSchema);