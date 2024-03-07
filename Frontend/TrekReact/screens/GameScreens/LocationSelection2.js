import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const LocationSelectionScreen = ({ navigation }) => {
  const handleCurrentLocationPress = () => {
    // Handle navigation or any other action for selecting current location
  };

  const handleSearchLocationPress = () => {
    // Handle navigation or any other action for searching location
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Let's Get Started!</Text>
      <Text style={styles.description}>Select your initial location to start the game:</Text>
      <TouchableOpacity style={styles.button} onPress={handleCurrentLocationPress}>
        <Text style={styles.buttonText}>Select Current Location</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleSearchLocationPress}>
        <Text style={styles.buttonText}>Select from Search</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default LocationSelectionScreen;
