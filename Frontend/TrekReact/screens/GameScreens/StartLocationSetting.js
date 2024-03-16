import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import Snackbar from '../CustomComponents/Snackbar';
import CustomDialog from '../CustomComponents/CustomDialog';
import CustomLoadingIndicator from '../CustomComponents/CustomLoadingIndicator';

const SelectStartLocationScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { selectedPlaces } = route.params;
  const [showDestinations, setShowDestinations] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showBackDialog, setShowBackDialog] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDetected, setIsDetected] = useState(false);  //tracks if start location has been detected or selected

  const handleSelectFromList = () => {
    setShowDestinations(true);
  };

  const handleDetectCurrentLocation = async () => {
    setLoading(true); // Show loading indicator
    let { status } = await Location.getForegroundPermissionsAsync();

    if (status !== 'granted') {
      // req if permission has not been granted previously
      
      const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
      status = newStatus;
    }

    if (status !== 'granted') {
      // if permission is still not granted
      setLoading(false);
      Alert.alert('Permission Denied', 'Please grant location permission to detect your current location.');
      return;
    }

    try {

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setLoading(false); // Show loading indicator

      setSnackbarMessage('Location detected!');
      setShowSnackbar(true);
      setIsDetected(true);  //sets to true to show that location is detected
      const confirmedStarterLocation = {
        latitude,
        longitude, 
      };

      setTimeout(() => {
        setShowSnackbar(false);
        navigation.navigate('StartGameScreen', {selectedPlaces, detected: isDetected, confirmedStarterLocation});
      }, 601); 

    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert('Error', 'Failed to get current location. Please try again later.');
    }
  };


  const handleBack = (option) => {
    if (option === 'Yes') {
      navigation.goBack();
    }
    setShowBackDialog(false);
  };

  const handleNext = () => {
    if (selectedDestination) {
      let updatedSelectedPlaces = [...selectedPlaces]; // copy of selectedPlaces array
      
      // find index of selectedDestination in selectedPlaces
      const selectedIndex = updatedSelectedPlaces.findIndex(place => place.place_id === selectedDestination.place_id);
      
      // remove selectedDestination from its current index
      updatedSelectedPlaces.splice(selectedIndex, 1);
      
      // add selectedDestination to the beginning of the array
      updatedSelectedPlaces.unshift(selectedDestination);
      setIsDetected(false); 
      
      // Navigate to StartGameScreen with updatedSelectedPlaces
      navigation.navigate('StartGameScreen', {
        selectedPlaces: updatedSelectedPlaces,
        detected: isDetected,
        confirmedStarterLocation: {
          latitude: selectedDestination.latitude,
          longitude: selectedDestination.longitude,
        }
      });
      
      console.log("worked", selectedDestination.place_id, selectedDestination.name); //debug statement
    } else {
      // If no destination is selected, show a message
      setShowSnackbar(true);
      setSnackbarMessage('Please select a destination.');
      setTimeout(() => {
        setShowSnackbar(false);
      }, 2000);
    }
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
          {selectedPlaces.map(destination => (
            <TouchableOpacity
              key={destination.place_id}
              style={[
                styles.destinationButton,
                selectedDestination === destination && styles.selectedDestinationButton
              ]}
              onPress={() => handleSelectDestination(destination)}
            >
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
          duration={2000}
          action={{ label: 'Dismiss', onPress: () => setShowSnackbar(false) }}
        />
      )}
      {loading && <CustomLoadingIndicator />}
      <CustomDialog
        visible={showBackDialog}
        title="Confirmation"
        message="Do you want to go back?"
        options={['Yes', 'No']}
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
    backgroundColor: '#010C33',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color:'#FFF'
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
  selectedDestinationButton: {
    backgroundColor: '#ff6347', // Change background color when selected
  },
  destinationButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    // backgroundColor: '#007bff',
    // paddingVertical: 0,
    // paddingHorizontal: 0,
    // borderRadius: 10,
    // marginBottom: 20,
    alignItems: 'center',
    position: 'absolute',
    top: 70,
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
