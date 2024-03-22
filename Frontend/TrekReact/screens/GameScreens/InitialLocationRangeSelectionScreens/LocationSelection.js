import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import CustomActivityIndicator from '../../CustomComponents/CustomActinityIndicator';

/**
 * Component for selecting initial location for the game.
 * @returns {JSX.Element} LocationSelectionScreen component.
 */
const LocationSelectionScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);

  /**
   * Handles the press event when selecting the current location.
   * Requests permission to access user's location and navigates to RadiusSetScreen upon success.
   * @throws {Error} Throws an error if there's an issue getting the current location.
   */
  const handleCurrentLocationPress = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync(); // request permission
      if (status !== 'granted') { // if permission denied
        console.log('Location permission not granted');
        setLoading(false);
        return;
      }
      const location = await Location.getCurrentPositionAsync({}); // get the user's current location
      // get latitude and longitude
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;
      console.log('Current Location:', { latitude, longitude });
      navigation.navigate('RadiusSetScreen', { latitude, longitude });
    } catch (error) {
      console.error('Error getting current location:', error);
      throw new Error('Failed to get current location');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles the press event when selecting location from search.
   * Navigates to SearchLocation screen.
   */
  const handleSearchLocationPress = () => {
    navigation.navigate('SearchLocation');
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
      {loading && <CustomActivityIndicator />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#010C33',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  button: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#010C33',
    fontSize: 18,
  },
});

export default LocationSelectionScreen;
