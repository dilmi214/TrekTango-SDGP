import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, StyleSheet, Modal, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import NavBar from '../screens/CustomComponents/NavBar';


const ImageFeed = () => {
  const [likes, setLikes] = useState(Array(5).fill(0));
  const [liked, setLiked] = useState(Array(5).fill(false));
  const [comments, setComments] = useState(Array(5).fill([]));
  const [newCommentText, setNewCommentText] = useState(Array(5).fill(''));
  const [commentSectionVisible, setCommentSectionVisible] = useState(Array(5).fill(false));
  const handleLike = (index) => {
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

  


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trek Tango</Text>
      <ScrollView contentContainerStyle={styles.feed}>
        {[...Array(5)].map((_, index) => (
          <TouchableOpacity key={index} onPress={() => handleImageClick(index)}>
            <View style={styles.postContainer}>
              <Image
                source={{
                  uri: 'https://imgur.com/mfO5v21.jpg',
                }}
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
                  {comments[index] && comments[index].map((comment, commentIndex) => (
                    <View key={commentIndex} style={styles.comment}>
                      <Text style={styles.commentText}>{comment}</Text>
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
