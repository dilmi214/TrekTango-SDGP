import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, StyleSheet, Modal, RefreshControl } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import NavBar from '../screens/CustomComponents/NavBar';

const ImageFeed = () => {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [commentSectionVisible, setCommentSectionVisible] = useState(false);
  const [maximizedImageIndex, setMaximizedImageIndex] = useState(null);
  const [refreshing, setRefreshing] = useState(false); // State for refresh indicator

  // Function to handle refresh action
  const onRefresh = () => {
    setRefreshing(true);
    // Perform refresh action here
    setTimeout(() => {
      // Simulate data fetching
      setLikes(0);
      setLiked(false);
      setComments([]);
      setNewCommentText('');
      setCommentSectionVisible(false);
      setMaximizedImageIndex(null);
      setRefreshing(false);
    }, 1000);
  };

  const handleLike = () => {
    setLikes(liked ? likes - 1 : likes + 1);
    setLiked(!liked);
  };

  const handleCommentChange = (text) => {
    setNewCommentText(text);
  };

  const handlePostComment = () => {
    if (newCommentText.trim() !== '') {
      setComments([...comments, newCommentText]);
      setNewCommentText('');
    }
  };

  const toggleCommentSection = () => {
    setCommentSectionVisible(!commentSectionVisible);
  };

  const handleImageClick = () => {
    setMaximizedImageIndex(0);
  };

  const exitMaximizedImage = () => {
    setMaximizedImageIndex(null);
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
            colors={['#000']} // Color of the refresh indicator (optional)
          />
        }
      >
        <TouchableOpacity onPress={handleImageClick}>
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
              <TouchableOpacity onPress={handleLike} style={styles.iconButton}>
                <FontAwesome name={liked ? "heart" : "heart-o"} size={24} color={liked ? "#ff9999" : "#ccc"} />
              </TouchableOpacity>
              {/* Like count */}
              <Text style={styles.likeText}>{likes} Likes</Text>
              {/* Comment button */}
              <TouchableOpacity onPress={toggleCommentSection} style={styles.iconButton}>
                <FontAwesome name="comment" size={24} color="#ccc" />
              </TouchableOpacity>
            </View>
            {/* Comment section */}
            {commentSectionVisible && (
              <View style={styles.commentSection}>
                {/* Comments */}
                {comments.map((comment, commentIndex) => (
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
                value={newCommentText}
                onChangeText={handleCommentChange}
              />
              <TouchableOpacity onPress={handlePostComment} style={styles.postCommentButton}>
                <Text style={styles.postCommentButtonText}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
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
                uri: 'https://imgur.com/mfO5v21.jpg',
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
