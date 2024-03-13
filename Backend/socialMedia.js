const mongoose = require('mongoose');
const express = require('express');
const { v4: uuidv4 } = require('uuid'); // Creates a unique ID to identify the primary keys
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

mongoose.connect("mongodb+srv://rithik20222011:Harpyeagle12345@cluster0.my4g36v.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

app.use(bodyParser.json()); // Parse incoming request bodies in JSON format
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB database');
});


const socialMediaSchema = new mongoose.Schema({
  username: { type: String, required: true }, // Already exists in the earlier schema
  userID: { type: String, required: true },
  lastRefreshedAt: { type: Date, default: Date.now },
  posts: [{
    postId: { type: String, default: uuidv4(), required: true, unique: true },
    placeId: { type: String, required: true },
    imageReferenceId: { type: String },
    uploadToMedia: { type: Boolean, default: false }, // If true belongs to public feed, else belongs to personal feed. Will be useful during the profile page
    caption: { type: String },
    comments: { type: [{ 
      commentID: { type: String, default: uuidv4(), required: true, unique: true },
      username: { type: String, required: true },
      comment: { type: String, required: true }
    }], default: null },
    likes: [{ type: String }], // Will consist of an array of usernames. Likes.length will determine the number of likes
    createdAt: { type: Date, default: Date.now }
  }]
});

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');


module.exports = mongoose

const SocialMedia = mongoose.model('SocialMedia', socialMediaSchema);

module.exports = SocialMedia; //Just in case, I might need to access this from another script

app.post('/social-media', async (req, res) => {
  try {
    const { username, userID, placeId, imageReferenceId, uploadToMedia, caption, likes } = req.body;

    // Create a new post with default or auto-generated values
    const newPost = new SocialMedia({
      username,
      userID,
      placeId,
      imageReferenceId,
      uploadToMedia,
      caption,
      likes
    });

    const savedPost = await newPost.save();

    res.status(200).json(savedPost);
  } catch (error) {
    // Handle errors
    res.status(400).json({ message: error.message });
  }
});

  //
  app.get('/social-media/:username/posts', async (req, res) => {
    const { username } = req.params;

    try {
        // Finds all posts that are under the same username given as the parameter
        const posts = await SocialMedia.find({ username });

        //Returning all these posts
        res.json({ posts });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.get('/uploaded-posts', async (res) => {
    try {
      // Finding the posts where uploadToMedia is true
      const uploadedPosts = await SocialMedia.find({ uploadToMedia: true });
  
      res.status(200).json(uploadedPosts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get('/uploaded-posts/:username', async (req, res) => {
    const { username } = req.params;
    
    try {
      //  Finding the posts where uploadToMedia is true and Under the same username. 
      const uploadedPosts = await SocialMedia.find({ uploadToMedia: true, username });
  
      res.status(200).json(uploadedPosts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get('/post-likes/:postId', async (req, res) => {
    const { postId } = req.params;
    
    try {
      // Finding the post in the database using its post ID
      const post = await SocialMedia.findById(postId);
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Accessing the array likes and getting its length
      const numberOfLikes = post.likes.length;
  
      //Will return the post ID as well as the number of likes
      res.status(200).json({ postId, numberOfLikes });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

//--------------------------------------------------------------

  app.get('/post-likes-usernames/:postId', async (req, res) => {
    const { postId } = req.params;
    
    try {
      //  find the post by its ID
      const post = await SocialMedia.findById(postId);
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Get the array of likes from the post
      const likesArray = post.likes;
  
      // Respond with the array of likes, This helps displaying out the list of people who like the post
      res.status(200).json({ postId, likes: likesArray });
    } catch (error) {
      
      res.status(500).json({ message: error.message });
    }
  });

  app.delete('/social-media/:postId', async (req, res) => {
    try {
        const { postId } = req.params;

        
        const post = await SocialMedia.findOne({ postId });

        // Check if the imageReferenceId is not null
        if (post && post.imageReferenceId !== null) {
            // Delete the document
            await SocialMedia.deleteOne({ postId });
            res.status(200).json({ message: 'Post deleted successfully' });
        } else {
            res.status(404).json({ message: 'Post not found or image reference is null' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/social-media/:postId/convert-to-public', async (req, res) => {
  const { postId } = req.params;

  try {
      
      const post = await SocialMedia.findOne({ postId: postId });

      if (!post) {
          return res.status(404).json({ message: 'Post not found' });
      }

      // Check if uploadToMedia is already true
      if (post.uploadToMedia) {
          return res.status(400).json({ message: 'Post is already in the public feed' });
      }

      // Update uploadToMedia to true
      post.uploadToMedia = true;

     
      await post.save();

      
      res.status(200).json({ message: 'Post converted to public feed successfully', post });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

app.delete('/social-media/:postId/comments/:commentId', async (req, res) => {
  const { postId, commentId } = req.params;

  try {
      const post = await SocialMedia.findOne({ postId });

      if (!post) {
          return res.status(404).json({ message: 'Post not found' });
      }

      // Find the index of the comment in the comments array
      const commentIndex = post.comments.findIndex(comment => comment.commentID === commentId);

      // Check if the comment exists
      if (commentIndex === -1) {
          return res.status(404).json({ message: 'Comment not found' });
      }

      // Remove the comment from the comments array
      post.comments.splice(commentIndex, 1);

      
      await post.save();

      
      res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
      
      res.status(500).json({ message: error.message });
  }
});

app.put('/social-media/:postId/add-comment', async (req, res) => {
  const { postId } = req.params;
  const { username, comment } = req.body;

  try {
      // Find the post by postId
      const post = await SocialMedia.findOne({ postId });

      if (!post) {
          return res.status(404).json({ message: 'Post not found' });
      }

      // Add the comment to the comments array
      post.comments.push({
          commentID: uuidv4(), //Creating a unique identifier for each comment
          username,
          comment
      });

      await post.save();

      res.status(200).json({ message: 'Comment added successfully', post });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});



