import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, StyleSheet, Dimensions, RefreshControl } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { baseURL } from './getIPAddress';



const ImageFeed = () => {
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState([]);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState([]);
  const [commentSectionVisible, setCommentSectionVisible] = useState([]);
  const [postsData, setPostsData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const likedUserId = "90b816ccc0014621ae1ad499d431229dh";

  useEffect(() => {
    fetchData(); // Fetch data from backend on component mount
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${baseURL}/api/socialMedia/getFeed`); // Replace with your backend endpoint
      const postsData = await response.json();
      setPostsData(postsData);
      
      // Initialize state based on fetched data
      const initialLikesState = postsData.map(post => post.likes.length);
      setLikes(initialLikesState);

      const initialLikedState = postsData.map(post => {
        const isLikedByUser = post.likes.includes(likedUserId); // Check if liked by the specific user
        return isLikedByUser;
      });
      setLiked(initialLikedState);

      const initialCommentsState = postsData.map(post => post.comments.map(comment => comment.comment));
      setComments(initialCommentsState);
      setNewCommentText(postsData.map(() => '')); // Empty comment text for each post
      setCommentSectionVisible(postsData.map(() => false));  // Comment sections initially hidden
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true); // Set refreshing state to true
    fetchData(); // Fetch data again
    setRefreshing(false); // Set refreshing state back to false after data is fetched
  };

  const handleLike = (index) => {
    const newLikes = [...likes];
    const newLiked = [...liked];
    if (!newLiked[index]) {
      newLikes[index]++;
      newLiked[index] = true;
      const postId = postsData[index].postId; // Access postId from postsData
      console.log('User liked post:', postId);
    } else {
      newLikes[index]--;
      newLiked[index] = false;
    }
    setLikes(newLikes);
    setLiked(newLiked);
  };

  const handleCommentChange = (index, text) => {
    const newCommentTexts = [...newCommentText];
    newCommentTexts[index] = text;
    setNewCommentText(newCommentTexts);
  };

  const handlePostComment = (index) => {
    if (newCommentText[index].trim() !== '') {
      const newComments = [...comments];
      const newComment = newCommentText[index];
      newComments[index] = [...newComments[index], newComment];
      setComments(newComments);
      const newCommentTexts = [...newCommentText];
      newCommentTexts[index] = '';
      setNewCommentText(newCommentTexts);
      const postId = postsData[index].postId; // Access postId from postsData
      console.log('User commented on post:', postId);
    }
  };

  const toggleCommentSection = (index) => {
    const newCommentSectionVisible = [...commentSectionVisible];
    newCommentSectionVisible[index] = !newCommentSectionVisible[index];
    setCommentSectionVisible(newCommentSectionVisible);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trek Tango</Text>
      <ScrollView
        contentContainerStyle={styles.feed}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {postsData.map((post, index) => (
          <TouchableOpacity key={index} onPress={() => handleImageClick(index)}>
            <View style={styles.postContainer}>
              <Image
                source={{ uri: post.imageReferenceId }}
                style={styles.image}
              />
              <View style={styles.interactionBar}>
                <TouchableOpacity onPress={() => handleLike(index)} style={styles.iconButton}>
                  <FontAwesome name={liked[index] ? "heart" : "heart-o"} size={24} color={liked[index] ? "#ff9999" : "#ccc"} />
                </TouchableOpacity>
                <Text style={styles.likeText}>{likes[index]} Likes</Text>
                <TouchableOpacity onPress={() => toggleCommentSection(index)} style={styles.iconButton}>
                  <FontAwesome name="comment" size={24} color="#ccc" />
                </TouchableOpacity>
              </View>
              {commentSectionVisible[index] && (
                <View style={styles.commentSection}>
                  {post.comments.map((comment, commentIndex) => (
                    <View key={commentIndex} style={styles.comment}>
                      <Text style={styles.commentText}>
                        <Text style={styles.commentUsername}>{comment.username}: </Text>
                        {comment.comment}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
              <View style={styles.commentInputContainer}>
                <TextInput
                  placeholder="Add a comment..."
                  placeholderTextColor="#ccc"
                  style={styles.commentInput}
                  value={newCommentText[index]}
                  onChangeText={(text) => handleCommentChange(index, text)}
                />
                <TouchableOpacity onPress={() => handlePostComment(index)} style={styles.postCommentButton}>
                  <Text style={styles.postCommentButtonText}>Post</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010C33',
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  feed: {
    paddingVertical: 20,
  },
  postContainer: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#1B1F32',
    elevation: 2,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'cover',
  },
  interactionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  likeText: {
    fontSize: 16,
    color: '#fff',
  },
  commentSection: {
    paddingHorizontal: 10,
  },
  comment: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  commentText: {
    fontSize: 14,
    color: '#fff',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: -5,
    marginBottom: 10, 
  },
  commentInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#fff',
    backgroundColor: '#010C33',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6C7A95',
    marginRight: 10,
  },
  postCommentButton: {
    backgroundColor: '#0047AB',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  postCommentButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  iconButton: {
    padding: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
});

export default ImageFeed;
