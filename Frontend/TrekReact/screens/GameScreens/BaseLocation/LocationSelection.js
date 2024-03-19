import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';

const LocationSelectionScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleCurrentLocationPress = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission not granted');
        setLoading(false);
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;
      console.log('Current Location:', { latitude, longitude });
      navigation.navigate('RadiusSetScreen', { latitude, longitude });
    } catch (error) {
      console.error('Error getting current location:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchLocationPress = () => {
    navigation.navigate('SearchLocation');
  };

  return (
    <ImageBackground source={{ uri: 'https://i.imgur.com/lCbsJVU.png' }} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.header}>Let's get started!</Text>
          <Text style={styles.description}>Select your starting location to start your journey:</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleCurrentLocationPress}>
          <Text style={styles.buttonText}>Use Current Location</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSearchLocationPress}>
          <Text style={styles.buttonText}>Search for a Location</Text>
        </TouchableOpacity>
        {loading && <ActivityIndicator color="#fff" />}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    backgroundColor: '#010C33',
    paddingRight: 14
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  content: {
    borderWidth: 5,
    borderColor: '#A3AED5',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
    backgroundColor:'rgba(1, 1, 40, 0.9)',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    color: '#fff',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#010C33',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default LocationSelectionScreen;
