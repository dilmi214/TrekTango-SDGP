import React, {useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import CustomLoadingIndicator from '../../CustomComponents/CustomLoadingIndicator';
import Layout from '../../CustomComponents/ScreenLayout';


const LocationSelectionScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleCurrentLocationPress = async () => {
    try {
      setLoading(true); 
      const { status } = await Location.requestForegroundPermissionsAsync();  // request permission
      
      if (status !== 'granted') {           // if permission permission denied
        console.log('Location permission not granted');
        setLoading(false); 
        return;
      }

      const location = await Location.getCurrentPositionAsync({});  // get the user's current location to location object
      
      // get latitude and longitude 
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;
      
      console.log('Current Location:', { latitude, longitude });
      navigation.navigate('RadiusSetScreen', { latitude, longitude });
    } catch (error) {
      console.error('Error getting current location:', error);
    } finally {
      setLoading(false); 
    }
  }

  const handleSearchLocationPress = () => {
    navigation.navigate('SearchLocation');
  };

  return (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.header}>Let's Get Started!</Text>
        <Text style={styles.description}>Select your initial location to start the game:</Text>
        <TouchableOpacity style={styles.button} onPress={handleCurrentLocationPress}>
          <Text style={styles.buttonText}>Select Current Location</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSearchLocationPress}>
          <Text style={styles.buttonText}>Select from Search</Text>
        </TouchableOpacity>
        {loading && <CustomLoadingIndicator />} 
      </View>
    </Layout>
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
