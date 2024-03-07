import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import NavBar from '../NavBar';

const ProfilePage = () => {
  const [likes, setLikes] = useState(Array(3).fill(0));
  const [liked, setLiked] = useState(Array(3).fill(false));
  const [comments, setComments] = useState(Array(3).fill([]));
  const [newCommentText, setNewCommentText] = useState('');
  const [tokens, setTokens] = useState([
    { image: 'https://imgur.com/mfO5v21.jpg', description: 'token 1' },
    { image: 'https://imgur.com/mfO5v21.jpg', description: 'token 2' },
    { image: 'https://imgur.com/mfO5v21.jpg', description: 'token 3' },
  ]);
  const [showComments, setShowComments] = useState(Array(3).fill(false));
  const [tripsCompleted, setTripsCompleted] = useState(5); 

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

  const handleComment = (index) => {
    setShowComments((prev) => {
      const updatedShowComments = [...prev];
      updatedShowComments[index] = !updatedShowComments[index];
      return updatedShowComments;
    });
  };

  const handlePostComment = (index) => {
    if (newCommentText.trim() !== '') {
      const newComments = [...comments];
      newComments[index] = [...newComments[index], newCommentText];
      setComments(newComments);
      setNewCommentText('');
    }
  };

  const posts = Array(3).fill({
    image: 'https://imgur.com/mfO5v21.jpg',
    caption: 'Post eka!',
  });

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: 'https://imgur.com/mfO5v21.jpg' }}
          style={styles.profilePic}
        />
        <View>
          <Text style={styles.username}>Dion Nikila</Text>
          <Text style={styles.tripsCompleted}>{tripsCompleted} Trips Completed</Text>
        </View>
      </View>
      <ScrollView style={styles.scroll}>
        <View style={styles.posts}>
          <Text style={styles.sectionTitle}>Posts</Text>
          {posts.map((post, index) => (
            <View key={index} style={styles.postContainer}>
              <Image source={{ uri: post.image }} style={styles.postImage} />
              <Text style={styles.caption}>{post.caption}</Text>
              <View style={styles.interactionBar}>
                <TouchableOpacity onPress={() => handleLike(index)} style={styles.iconButton}>
                  <FontAwesome name={liked[index] ? "heart" : "heart-o"} size={24} color={liked[index] ? "#ff9999" : "#ccc"} />
                </TouchableOpacity>
                <Text style={styles.likeText}>{likes[index]} Likes</Text>
                <TouchableOpacity onPress={() => handleComment(index)} style={styles.iconButton}>
                  <FontAwesome name="comment" size={24} color="#ccc" />
                </TouchableOpacity>
              </View>
              {showComments[index] && comments[index] && comments[index].map((comment, commentIndex) => (
                <View key={commentIndex} style={styles.comment}>
                  <Text style={styles.commentText}>{comment}</Text>
                </View>
              ))}
              <View style={styles.commentInputContainer}>
                <TextInput
                  placeholder="Add a comment..."
                  placeholderTextColor="#ccc"
                  style={styles.commentInput}
                  onChangeText={(text) => setNewCommentText(text)}
                  value={newCommentText}
                />
                <TouchableOpacity onPress={() => handlePostComment(index)} style={styles.postCommentButton}>
                  <Text style={styles.postCommentButtonText}>Post</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.tokens}>
          <Text style={styles.sectionTitle}>Tokens</Text>
          {tokens.map((token, index) => (
            <View key={index} style={styles.tokenContainer}>
              <Image source={{ uri: token.image }} style={styles.tokenImage} />
              <Text style={styles.tokenDescription}>{token.description}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
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
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  tripsCompleted: {
    fontSize: 16,
    color: '#ccc',
  },
  posts: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  postContainer: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#1B1F32',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  postImage: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'cover',
  },
  caption: {
    fontSize: 16,
    marginBottom: 10,
    color: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
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
  comment: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  commentText: {
    fontSize: 14,
    color: '#fff',
  },
  iconButton: {
    padding: 5,
  },
  tokens: {
    padding: 20,
  },
  tokenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  tokenImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  tokenDescription: {
    fontSize: 16,
    color: '#fff',
  },
  scroll: {
    backgroundColor: '#010C33',
  },
  navBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
  },
});

export default ProfilePage;
