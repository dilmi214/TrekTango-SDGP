import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import Snackbar from '../CustomComponents/Snackbar';
import CustomDialog from '../CustomComponents/CustomDialog';

const SelectStartLocationScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { selectedPlacesIds } = route.params;

  const [showDestinations, setShowDestinations] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showBackDialog, setShowBackDialog] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);

  const handleSelectFromList = () => {
    setShowDestinations(true);
  };

  const handleDetectCurrentLocation = async () => {
    let { status } = await Location.getForegroundPermissionsAsync();

    if (status !== 'granted') {
      // req if permission has not been granted previously
      const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
      status = newStatus;
    }

    if (status !== 'granted') {
      // ff permission is still not granted
      Alert.alert('Permission Denied', 'Please grant location permission to detect your current location.');
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      console.log('Current Location:', { latitude, longitude });
      setSnackbarMessage('Location detected!');
      setShowSnackbar(true);
      const confirmedStarterLocation = {
        latitude,
        longitude
      };
      setTimeout(() => {
        setShowSnackbar(false);
        navigation.navigate('StartGameScreen', {selectedPlacesIds, confirmedStarterLocation});
      }, 1201); 

    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert('Error', 'Failed to get current location. Please try again later.');
    }
  };


  const handleBack = (option) => {
    if (option === 'Back') {
      navigation.goBack();
    }
    setShowBackDialog(false);
  };

  const handleNext = () => {
  console.log('Next button pressed');
};

const handleSelectDestination = (destination) => {
  setSelectedDestination(destination);
};

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => setShowBackDialog(true)}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>

      {!showDestinations && (
        <>
          <Text style={styles.title}>Select Start Point</Text>
          <TouchableOpacity style={styles.button} onPress={handleSelectFromList}>
            <Text style={styles.buttonText}>Select from Destinations</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleDetectCurrentLocation}>
            <Text style={styles.buttonText}>Detect Current Location</Text>
          </TouchableOpacity>
        </>
      )}

      {showDestinations && (
        <>
          {selectedPlacesIds.map(destination => (
            <TouchableOpacity key={destination.place_id} style={styles.destinationButton}>
              <Text style={styles.destinationButtonText}>{destination.name}</Text>
            </TouchableOpacity>
            
          ))}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
        </>
      )}

      {showSnackbar && (
        <Snackbar
          visible={showSnackbar}
          message={snackbarMessage}
          duration={1200}
          action={{ label: 'Dismiss', onPress: () => setShowSnackbar(false) }}
        />
      )}
      <CustomDialog
      visible={showBackDialog}
      title="Confirmation"
      message="Do you want to go back?"
      options={['Cancel', 'Back']}
      onSelect={handleBack}
    />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  destinationButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  destinationButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    left: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#007b00',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default SelectStartLocationScreen;