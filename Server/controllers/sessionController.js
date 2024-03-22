const Session = require('../models/sessionSchema')

const createSession = async (req, res) => {
    try {
      // Destructure required fields from request body
      const { userId, username, listOfPlaces } = req.body;
  
      // Create a new location document
      const session = new Session({
        userId,
        username,
        listOfPlaces
      });
  
      // Save the location document to MongoDB
      await session.save();
  
      // Respond with success message
      res.status(201).json({ message: 'Session saved successfully', sessionId: session.sessionId });
    } catch (error) {
      // Respond with error if any
      res.status(500).json({ error: 'Failed to save session', details: error.message });
    }
  };

  const latestIncompleteSession = async (req, res) => {
    try {
      // Find the latest location document with sessionComplete set to false
      const session = await Session.findOne({ sessionComplete: false }).sort({ createdAt: -1 }).limit(1);
  
      if (!session) {
        return res.status(404).json({ message: 'No incomplete sessions found' });
      }
  
      // Respond with the location document
      res.json(session);
    } catch (error) {
      // Respond with error if any
      res.status(500).json({ error: 'Failed to retrieve incomplete sessions', details: error.message });
    }
  };

  module.exports = {createSession, latestIncompleteSession};