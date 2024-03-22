const SocialMediaPost = require('../models/socialMediaPostSchema');
const { v4: uuidv4 } = require('uuid');

const newPost = async (req, res) =>{
   
    const {username, userID, placeId, imageReferenceId, uploadToMedia, caption, comments, likes } = req.body;
    try{
    const newPost = new SocialMediaPost({
        username,
        userID,
        placeId,
        imageReferenceId,
        uploadToMedia,
        caption,
        comments: comments || [],
        likes: likes || [],
       
    });

    await newPost.save();
    console.log('New Post Created');
    res.status(201).json(newPost);
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
}
}

const getRefreshedData = async (req, res) => {
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
  }


const publishPost = async (req, res) => {
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
}  

const getPostById = async (req, res) => {
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

const getUserPost = async (req, res) => {
    const { username } = req.params;

    try {
        // Finds all posts that are under the same username given as the parameter
        const posts = await SocialMedia.find({ username });

        //Returning all these posts
        res.json({ posts });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getPublicPostOfUser = async (req, res) => {
    const { username } = req.params;
    
    try {
      //  Finding the posts where uploadToMedia is true and Under the same username. 
      const uploadedPosts = await SocialMedia.find({ uploadToMedia: true, username });
  
      res.status(200).json(uploadedPosts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}

const likePost = async (req, res) => {
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
}
 
const deleteComment = async (req, res) => {
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
  }

  const addComment = async (req, res) => {
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
  }

const getPostByUserID = async (req, res) => {
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
 

  module.exports = {newPost, getRefreshedData, publishPost, getPostById, getUserPost, getPublicPostOfUser, likePost, deleteComment, addComment, getPostByUserID };
