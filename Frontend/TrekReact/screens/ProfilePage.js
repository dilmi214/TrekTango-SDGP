import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import postsData from './posts.json'; // Importing the JSON data

const ProfilePage = () => {
  // State declarations
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState([]);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState([]);
  const [tripsCompleted, setTripsCompleted] = useState(5);

  // Fetching posts data from the JSON file
  useEffect(() => {
    // Initialize state variables based on postsData
    const initialLikes = postsData.map(post => post.likes.length);
    const initialLiked = postsData.map(post => post.likes.includes('df04e15c0300495abb30b8f96aae35d2'));
    const initialComments = postsData.map(post => post.comments.map(comment => comment.comment));
    const initialShowComments = postsData.map(() => false);

    setLikes(initialLikes);
    setLiked(initialLiked);
    setComments(initialComments);
    setShowComments(initialShowComments);
  }, []);

  // Event handlers
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

  const handleComment = (index) => {
    setShowComments((prev) => {
      const updatedShowComments = [...prev];
      updatedShowComments[index] = !updatedShowComments[index];
      return updatedShowComments;
    });
  };

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
          {postsData.map((post, index) => (
            <View key={index} style={styles.postContainer}>
              <Image source={{ uri: post.imageReferenceId }} style={styles.postImage} />
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
            </View>
          ))}
        </View>
      </ScrollView>
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
  scroll: {
    backgroundColor: '#010C33',
  },
});

export default ProfilePage;
