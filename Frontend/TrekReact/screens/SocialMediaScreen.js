// HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SocialMediaScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Social</Text>
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
});

export default SocialMediaScreen;
