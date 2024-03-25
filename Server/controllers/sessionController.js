const Session = require('../models/sessionSchema');
const { v4: uuidv4 } = require('uuid');

const createSession = async (req, res) => {
    try {
      // Destructure required fields from request body
      const { userId, username, listOfPlaces, detected, confirmedStarterLocation } = req.body;
      const sessionId = uuidv4()
  
      // Create a new location document
      const session = new Session({
        sessionId,
        userId,
        username,
        listOfPlaces,
        detected,
        confirmedStarterLocation
      });
  
      // Save the location document to MongoDB
      await session.save();
  
      // Respond with success message
      res.status(201).json(sessionId);
    } catch (error) {
      // Respond with error if any
      console.error(error);
      res.status(500).json({ error:error });
    }
  };

  const latestIncompleteSession = async (req, res) => {
    try {
      // Assuming req.user.username contains the username for which you want to find incomplete sessions
      const { username } = req.params;
  
      // Find the latest session document with sessionComplete set to false for the given username
      const session = await Session.findOne({ username, sessionComplete: false }).sort({ createdAt: -1 }).limit(1);
  
      if (!session) {
        return res.status(404).json({ message: 'No incomplete sessions found for the user' });
      }
  
      // Respond with the session document
      res.status(200).json(session);
    } catch (error) {
      // Respond with error if any
      res.status(500).json({ error: 'Failed to retrieve incomplete sessions', details: error.message });
    }
  };

  const isCompleted = async (req, res) => {
    try {
        const { sessionId, placeId } = req.body;

        

        // Find the session by sessionId
        let session = await Session.findOne({ sessionId });
      

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        // Find the index of the place with the given placeId
        const placeIndex = session.listOfPlaces.findIndex(place => place.place_id === placeId);

        if (placeIndex === -1) {
            return res.status(404).json({ message: "Place not found in session" });
        }

        // Update the 'completed' field of the place to true
        session.listOfPlaces[placeIndex].completed = true;

        // Save the updated session to a variable
        session = await session.save();
        

        // Remove all the listOfPlaces in the database that belong to this session
        await Session.updateOne({ sessionId }, { $set: { listOfPlaces: [] } });

        // Insert back the list of place IDs inside this variable to the listOfPlaces field
        await Session.updateOne({ sessionId }, { $push: { listOfPlaces: { $each: session.listOfPlaces } } });

        res.status(200).json({ message: "Updated" });
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


const sessionComplete = async (req, res) => {
  try {
      const { sessionId } = req.body;
console.log(sessionId, "hi");
      // Find the session by sessionId
      const session = await Session.findOne({ sessionId });

      // Update sessionComplete to true
      session.sessionComplete = true;
      
      // Save the updated session
      await session.save();

      res.status(200).json({ message: "Session marked as complete" });
  } catch (error) {
      console.log("Error:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};
      

  module.exports = {createSession, latestIncompleteSession, isCompleted, sessionComplete};