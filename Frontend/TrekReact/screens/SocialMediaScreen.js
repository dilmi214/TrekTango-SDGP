// HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NavBar from '../NavBar'; // Import the NavBar component

const SocialMediaScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>Social</Text>
      </View>
      <View style={styles.navBarContainer}>
        <NavBar />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
  },
  navBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default SocialMediaScreen;
