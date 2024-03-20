//socialMedia
const mongoose = require('mongoose');
const express = require('express');
const { v4: uuidv4 } = require('uuid'); // Creates a unique ID to identify the primary keys
const bodyParser = require('body-parser');
const cors = require('cors');
const router = express.Router();

const app = express();

mongoose.connect("mongodb+srv://rithik20222011:Harpyeagle12345@cluster0.my4g36v.mongodb.net/"
    // useNewUrlParser: true,
    // useUnifiedTopology: true
);

const db = mongoose.connection;

app.use(bodyParser.json()); // Parse incoming request bodies in JSON format
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to Social media database');
});


const socialMediaSchema = new mongoose.Schema({
  username: { type: String, required: true },
  userID: { type: String, required: true },
  lastRefreshedAt: { type: Date, default: Date.now },
  posts: [{
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
    createdAt: { type: Date, default: Date.now }
  }]
});


module.exports = mongoose

const SocialMedia = mongoose.model('SocialMedia', socialMediaSchema);

module.exports = SocialMedia; //Just in case, I might need to access this from another script

/**
 * takes the last refreshed at as the request body
 * returns all the posts that were created (created at) after the last refreshed at
*/
router.get('/socialMediaData', async (req, res) => {
  try {
    // Get the lastRefreshedAt value from the request body
    const lastRefreshedAt = req.body.lastRefreshedAt;

    // Check if lastRefreshedAt is provided
    if (!lastRefreshedAt) {
      console.error('Error: lastRefreshedAt not provided');
      return res.status(400).json({ error: 'lastRefreshedAt not provided' });
    }

    // Find the social media data based on lastRefreshedAt
    const socialMediaData = await SocialMedia.findOne({ lastRefreshedAt });

    // Check if social media data is found
    if (!socialMediaData) {
      console.error('Error: Social media data not found');
      return res.status(404).json({ error: 'Social media data not found' });
    }

    // Filter the posts based on the condition uploadToMedia being true
    const filteredPosts = socialMediaData.posts.filter(post => {
      return post.uploadToMedia === true && new Date(post.createdAt) > new Date(lastRefreshedAt);
    });

    // Modify the social media data to include only filtered posts
    const modifiedSocialMediaData = { ...socialMediaData.toJSON(), posts: filteredPosts };

    // Log the modified social media data
    console.log('Modified social media data:', modifiedSocialMediaData);

    // Send the modified social media data as response
    res.json(modifiedSocialMediaData);
  } catch (error) {
    console.error('Error retrieving social media data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/social-media/posts', async (req, res) => {
  try {
    const { username, userID, placeId, imageReferenceId, caption, comments, likes } = req.body;

    // Create a new post
    const newPost = {
      postId: uuidv4(),
      placeId,
      imageReferenceId,
      caption,
      comments: comments || [], // Ensure comments is an array or default to an empty array
      likes: likes || [],
      createdAt: new Date()
    };



    app.get('/socialMediaData', async (req, res) => {
      try {
        const data = await SocialMedia.find({});
        res.json(data);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    // Save the new post directly
    const createdPost = await SocialMedia.create({
      username,
      userID,
      posts: [newPost]
    });

    res.status(201).json({ message: 'Post created successfully', post: createdPost.posts[0] });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * takes in the user ID as a parameter
 * Returns all the posts that are public from the same user
*/
app.get('/mediaPosts/:userID', async (req, res) => {
  const userID = req.params.userID;

  try {
    // Find the user by userID
    const user = await User.findOne({ userID });

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract media posts with uploadToMedia as true
    const mediaPosts = user.posts.filter(post => post.uploadToMedia === true);

    // Log the number of media posts found
    console.log(`Found ${mediaPosts.length} media posts for user ${userID}`);

    // Return the media posts
    res.json(mediaPosts);
  } catch (error) {
    console.error('Error retrieving media posts:', error);
    // Handle errors
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



//Retrieve the post object using the post ID
async function getPostById(req, res) {
  try {
    const postId = req.params.postId;

    // Find the social media data containing the post with the specified postId
    const socialMediaData = await SocialMedia.findOne({ 'posts.postId': postId });

    // Check if social media data is found
    if (!socialMediaData) {
      console.error('Error: Social media data not found');
      return res.status(404).json({ error: 'Social media data not found' });
    }

    // Log social media data for debugging
    console.log('Social media data found:', socialMediaData);

    // Find the post with the specified postId
    const post = socialMediaData.posts.find(post => post.postId === postId);

    // Check if post is found
    if (!post) {
      console.error('Error: Post not found');
      return res.status(404).json({ error: 'Post not found' });
    }

    // Log the found post for debugging
    console.log('Post found:', post);

    // Return the JSON object containing username and the post
    res.json({
      username: socialMediaData.username,
      userID: socialMediaData.userID,
      post
    });
  } catch (error) {
    console.error('Error retrieving post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}



/**
 * Takes the last refreshed at as the request body
 * Returns all the posts along with the usernames of the objects that are public as well as created after the last refresh tab
*/
app.get('/socialMediaData', async (req, res) => {
  try {
    // Get the lastRefreshedAt value from the request body
    const lastRefreshedAt = req.body.lastRefreshedAt;

    // Check if lastRefreshedAt is provided
    if (!lastRefreshedAt) {
      console.error('Error: lastRefreshedAt has not been provided');
      return res.status(400).json({ error: 'lastRefreshedAt not provided' });
    }

    // Find the social media data based on lastRefreshedAt
    const socialMediaData = await SocialMedia.findOne({ lastRefreshedAt });

    // Check if social media data is found
    if (!socialMediaData) {
      console.error('Error: Social media data not found');
      return res.status(404).json({ error: 'Data not found' });
    }
    // Filter the posts based on the condition uploadToMedia being true
    const filteredPosts = socialMediaData.posts.filter(post => {
      return post.uploadToMedia === true && new Date(post.createdAt) > new Date(lastRefreshedAt);
    });

    // Modify the social media data to include only filtered posts. This way only posts with the certain condition is used
    const modifiedSocialMediaData = { ...socialMediaData.toJSON(), posts: filteredPosts };

    // Log the modified social media data
    console.log('Social media data with the filtered content:', modifiedSocialMediaData);

    // Send the modified social media data as response
    res.json(modifiedSocialMediaData);
  } catch (error) {
    console.error('Error encountered when retrieving the social media data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

  //Create a set of code here to update the last refresh date to now
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

//Get all the posts that are under the same username
async function getPostsByUserID(req, res) {
  const { userID } = req.params; // Assuming userID is passed as a parameter in the request

  try {
    const userPosts = await SocialMedia.findOne({ userID }); // Find the document with the given userID
    if (!userPosts) {
      return res.status(404).json({ message: "User not found or has no posts." });
    }
    res.json(userPosts.posts); // Return posts array of the user
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

//Get all the posts that are under the same user ID as well as public (To be posted to social media)
async function getMediaPostsByUserID(req, res) {
  const { userID } = req.body; // Assuming userID is passed in the request body

  try {
    const mediaPosts = await SocialMedia.findOne({ userID, 'posts.uploadToMedia': true }, { 'posts.$': 1 }); // Find the document with the given userID and where uploadToMedia is true
    if (!mediaPosts || !mediaPosts.posts.length) {
      return res.status(404).json({ message: "No media posts found for the user." });
    }
    res.json(mediaPosts.posts); // Return posts array of the user where uploadToMedia is true
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}





