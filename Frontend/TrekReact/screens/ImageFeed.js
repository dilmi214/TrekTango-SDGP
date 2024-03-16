import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, StyleSheet, Modal, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import NavBar from '../screens/CustomComponents/NavBar';


const ImageFeed = () => {
  const [likes, setLikes] = useState(Array(5).fill(0));
  const [liked, setLiked] = useState(Array(5).fill(false));
  const [comments, setComments] = useState(Array(5).fill([]));
  const [newCommentText, setNewCommentText] = useState(Array(5).fill(''));
  const [commentSectionVisible, setCommentSectionVisible] = useState(Array(5).fill(false));
  const [maximizedImageIndex, setMaximizedImageIndex] = useState(null);

  const handleLike = async (index) => {
    try {
      // // Retrieve the username from AsyncStorage
      // const username = await AsyncStorage.getItem('username');
      // console.log('Username:', username);
  
      // Update the likes and liked state
      const newLikes = [...likes];
      const newLiked = [...liked];
      if (!newLiked[index]) {
        newLikes[index]++;
        newLiked[index] = true;
      } else {
        newLikes[index]--;
        newLiked[index] = false;
      }
      setLikes(newLikes);
      setLiked(newLiked);
    } catch (error) {
      console.error('Error retrieving username:', error);
    }
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
    }
  };

  const toggleCommentSection = (index) => {
    const newCommentSectionVisible = [...commentSectionVisible];
    newCommentSectionVisible[index] = !newCommentSectionVisible[index];
    setCommentSectionVisible(newCommentSectionVisible);
  };

  const handleImageClick = (index) => {
    setMaximizedImageIndex(index);
  };

  const exitMaximizedImage = () => {
    setMaximizedImageIndex(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trek Tango</Text>
      <ScrollView contentContainerStyle={styles.feed}>
        {[...Array(5)].map((_, index) => (
          <TouchableOpacity key={index} onPress={() => handleImageClick(index)}>
            <View style={styles.postContainer}>
              {/* Username */}
              <Text style={styles.usernameText}>Username</Text>
              {/* Location */}
              <Text style={styles.locationText}>Location</Text>
              {/* Image */}
              <Image
                source={{
                  uri: 'https://imgur.com/mfO5v21.jpg',
                }}
                style={styles.image}
              />
              {/* Interaction bar */}
              <View style={styles.interactionBar}>
                {/* Like button */}
                <TouchableOpacity onPress={() => handleLike(index)} style={styles.iconButton}>
                  <FontAwesome name={liked[index] ? "heart" : "heart-o"} size={24} color={liked[index] ? "#ff9999" : "#ccc"} />
                </TouchableOpacity>
                {/* Like count */}
                <Text style={styles.likeText}>{likes[index]} Likes</Text>
                {/* Comment button */}
                <TouchableOpacity onPress={() => toggleCommentSection(index)} style={styles.iconButton}>
                  <FontAwesome name="comment" size={24} color="#ccc" />
                </TouchableOpacity>
              </View>
              {/* Comment section */}
              {commentSectionVisible[index] && (
                <View style={styles.commentSection}>
                  {/* Comments */}
                  {comments[index] && comments[index].map((comment, commentIndex) => (
                    <View key={commentIndex} style={styles.comment}>
                      <Text style={styles.commentText}>{comment}</Text>
                    </View>
                  ))}
                </View>
              )}
              {/* Comment input */}
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
      {/* Modal for maximized image */}
      {maximizedImageIndex !== null && (
        <Modal visible={maximizedImageIndex !== null} transparent={true}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.largeCloseButton} onPress={exitMaximizedImage}>
              <FontAwesome name="close" size={36} color="#fff" />
            </TouchableOpacity>
            <Image
              source={{
                uri: '',
              }}
              style={styles.maximizedImage}
            />
          </View>
        </Modal>
      )}
      {/* Navigation bar */}
      <View style={styles.navBarContainer}>
        <NavBar />
      </View>
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
  maximizedImage: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
  },
  largeCloseButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1,
  },
  navBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  usernameText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  locationText: {
    fontSize: 12,
    color: '#fff',
    marginBottom: 10,
  },
});

export default ImageFeed;
