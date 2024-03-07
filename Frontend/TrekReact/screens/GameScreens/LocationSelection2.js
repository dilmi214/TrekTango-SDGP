import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';

const LocationSelectionScreen = ({ navigation }) => {
  const handleCurrentLocationPress = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();  // request permission
      
      if (status !== 'granted') {           // if permission permission denied

        console.log('Location permission not granted');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});  // get the user's current location to location object
      
      // get latitude and longitude 
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;
      
      // Handle the current location data, you can navigate to another screen or perform any other actions
      console.log('Current Location:', { latitude, longitude });
      navigation.navigate('CurrentLocation', { latitude, longitude });
    } catch (error) {
      console.error('Error getting current location:', error);
    }
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
