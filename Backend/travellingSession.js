//travellingSession
const mongoose = require('mongoose');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const port = 3000;
const bodyParser = require('body-parser');
const cors = require('cors')


const app = express();
app.use(bodyParser.json()); // Parse incoming request bodies in JSON format
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)



mongoose.connect("mongodb+srv://rithik20222011:Harpyeagle12345@cluster0.my4g36v.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

// Error handling for MongoDB connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB database');
});


/**
 * Create the schema for the locations with all its details
*/
const locationSchema = new mongoose.Schema({
    sessionId: { type: String, default: uuidv4(), required: true, unique: true },
    username: { type: String, required: true },
    startingPlaceId: { type: String, required: true },
    listOfPlaceIds: [{
        placeId: { type: String, required: true },
        complete: { type: Boolean, default: false },
        listOfImageReferenceIds: { type: String, default: null }
    }],
    sessionComplete: { type: Boolean, default: false }
});

// Create Location model
const Location = mongoose.model('Location', locationSchema);


app.post('/sessions', async (req, res) => { 
    try {
        const { username } = req; // Get username from request object

        // Extract other required data from request body
        const { startingPlaceId, listOfPlaceIds } = req.body;

        // Generate a unique sessionId
        const sessionId = uuidv4();

        // Create a new session using the Location model
        const newSession = new Location({
            sessionId,
            username,
            startingPlaceId,
            listOfPlaceIds
        });

        // Save the new session to the database
        await newSession.save();

        res.status(201).json({ message: 'Travelling session created successfully', sessionId });
    } catch (error) {
        console.error('Error creating travelling session:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


    /**
     * Allows to change the starting place ID 
    */
  app.put('/locations/:sessionId', async (req, res) => {
    try {
        // Extract sessionId from request parameters
        const { sessionId } = req.params;

        // Extract new starting place ID from request body
        const { newStartingPlaceId } = req.body;

        // Update the location with the given sessionId
        const updatedLocation = await Location.findOneAndUpdate(
            { sessionId },
            { startingPlaceId: newStartingPlaceId },
            { new: true }
        );

        // Check if location was found and updated
        if (!updatedLocation) {
            return res.status(404).json({ error: 'Location not found' });
        }

        // Send back the updated location as a response
        res.json({ updatedLocation });
    } catch (error) {
        console.error('Error updating starting place ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * Add a new place ID with the respective complete status and the image reference ID which will be set to False and null respectively by default
*/
app.put('/locations/:sessionId/add-place', async (req, res) => {
    try {
        // Extract sessionId from request parameters
        const { sessionId } = req.params;

        // Extract placeId from request body
        const { placeId } = req.body;

        // Find the location with the given sessionId
        const location = await Location.findOne({ sessionId });

        // Check if the location exists
        if (!location) {
            return res.status(404).json({ error: 'Location not found' });
        }

        // Check if the placeId already exists in the listOfPlaceIds array
        const existingPlace = location.listOfPlaceIds.find(place => place.placeId === placeId);
        if (existingPlace) {
            return res.status(400).json({ error: 'Place ID already exists' });
        }

        // Add the new placeId to the listOfPlaceIds array
        location.listOfPlaceIds.push({ placeId });

        await location.save();

        res.json({ location });
    } catch (error) {
        console.error('Error adding place ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



/**
 * Sends back an array of locations that are under the same username
*/
app.get('/locations/:username', async (req, res) => {
    try {
        // Get username from the request object
        const { username } = req;

        // Find all locations for the given username
        const locations = await Location.find({ username });

        res.json({ locations });
    } catch (error) {
        console.error('Error retrieving locations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * Sends back an array of place ID's that belong to the same session ID
*/
app.get('/places/:sessionId', async (req, res) => {
  try {
      // Extract sessionId from request parameters
      const { sessionId } = req.params;

      // Find all locations that match the given sessionId
      const locations = await Location.find({ sessionId });

      // Extract place IDs from each location
      const placeIds = locations.map(location => location.listOfPlaceIds).flat();

      res.json({ placeIds });
  } catch (error) {
      console.error('Error fetching place IDs:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});





/**
 * Extracts the previous place ID and replaces it with the needed new place ID
 * */ 
app.put('/locations/:sessionId', async (req, res) => {
    try {
        // Extract sessionId and new placeId from request parameters and body
        const { sessionId } = req.params;
        const { oldPlaceId, newPlaceId } = req.body;

        // Find the location with the given sessionId
        const location = await Location.findOne({ sessionId });

        // Check if the location exists
        if (!location) {
            return res.status(404).json({ error: 'Location not found' });
        }

        // Find the index of the old placeId in the listOfPlaceIds array
        const index = location.listOfPlaceIds.findIndex(place => place.placeId === oldPlaceId);

        // Check if the old placeId exists in the listOfPlaceIds array
        if (index === -1) {
            return res.status(404).json({ error: 'Old place ID not found in the list' });
        }

        // Replace the old placeId with the new one
        location.listOfPlaceIds[index].placeId = newPlaceId;

     
        const updatedLocation = await location.save();

        
        res.json({ updatedLocation });
    } catch (error) {
        console.error('Error updating place ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * Delete the session from the database
*/
app.delete('/delete-location/:sessionId', async (req, res) => {
  try {
      const { sessionId } = req.params;

      // Find the location document by session ID and delete it
      const deletedLocation = await Location.findOneAndDelete({ sessionId });

      if (!deletedLocation) {
          return res.status(404).json({ error: 'Location not found' });
      }

      return res.status(200).json({ message: 'Location deleted successfully' });
  } catch (error) {
      console.error('Error deleting location:', error);
      return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Delete the needed place ID along with the relevant complete status and the image reference ID
*/
app.delete('/locations/:sessionId/:placeId', async (req, res) => {
    try {
        // Extract sessionId and placeId from request parameters
        const { sessionId, placeId } = req.params;

        // Find the location with the given sessionId
        const location = await Location.findOne({ sessionId });

        // Check if the location exists
        if (!location) {
            return res.status(404).json({ error: 'Location not found' });
        }

        // Find the index of the placeId in the listOfPlaceIds array
        const index = location.listOfPlaceIds.findIndex(place => place.placeId === placeId);

        // Check if the placeId exists in the listOfPlaceIds array
        if (index === -1) {
            return res.status(404).json({ error: 'Place ID not found in the list' });
        }

        // Remove the placeId, complete, and listOfImageReferenceIds at the found index
        location.listOfPlaceIds.splice(index, 1);

        const updatedLocation = await location.save();

       
        res.json({ updatedLocation });
    } catch (error) {
        console.error('Error deleting place ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


/**
 * Extracts the place ID and deletes the relevant image in that place ID
*/
app.put('/update-place/:sessionId/:placeId', async (req, res) => {
  try {
      const { sessionId, placeId } = req.params;

      // Find the location document by session ID
      const location = await Location.findOne({ sessionId });

      if (!location) {
          return res.status(404).json({ error: 'Location not found' });
      }

      // Find the index of the placeId in the listOfPlaceIds array
      const index = location.listOfPlaceIds.indexOf(placeId);

      if (index === -1) {
          return res.status(404).json({ error: 'PlaceId not found' });
      }

      // Set the corresponding image reference to null
      location.listOfImageReferenceIds[index] = null;

     
      await location.save();

      return res.status(200).json({ message: 'PlaceId updated successfully' });
  } catch (error) {
      console.error('Error updating placeId:', error);
      return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Extract the relevant place ID and switch the complete status to true
*/
app.put('/complete-place/:sessionId/:placeId', async (req, res) => {
    try {
        const { sessionId, placeId } = req.params;

        // Find the location document by session ID
        const location = await Location.findOne({ sessionId });

        if (!location) {
            return res.status(404).json({ error: 'Location not found' });
        }

        // Find the index of the placeId in the listOfPlaceIds array
        const index = location.listOfPlaceIds.findIndex(place => place.placeId === placeId);

        if (index === -1) {
            return res.status(404).json({ error: 'PlaceId not found' });
        }

        if (location.listOfPlaceIds[index].complete) {
            return res.status(400).json({ message: 'Place already marked as complete'});
        }

        // Set the complete attribute of the respective place ID to true
        location.listOfPlaceIds[index].complete = true;

        // Check if all placeIds are complete
        const allComplete = location.listOfPlaceIds.every(place => place.complete);

        if (allComplete) {
            // Set sessionComplete to true if all placeIds are complete
            location.sessionComplete = true;
        }

      
        await location.save();

        return res.status(200).json({ message: 'Place marked as complete successfully' });
    } catch (error) {
        console.error('Error completing place:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});




  app.listen(port, ()=>{
    console.log("Running on port number" + port);
})


  
