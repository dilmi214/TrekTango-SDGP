import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location'; // Import Location from Expo
import NavBar from '../CustomComponents/NavBar';

const SelectStartLocationScreen = () => {
  const route = useRoute();
  const { selectedPlacesIds } = route.params;
  const navigation = useNavigation();

  const [showDestinations, setShowDestinations] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [destinationConfirmed, setDestinationConfirmed] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [showConfirmationModalAfterSelection, setShowConfirmationModalAfterSelection] = useState(false);
  const [showConfirmationModalBeforeSelection, setShowConfirmationModalBeforeSelection] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false); 
  const [isLoadingCurrentLocation, setIsLoadingCurrentLocation] = useState(false); // State to handle loading state
  const [locationDetected, setLocationDetected] = useState(false);
  const [confirmedStarterLocation, setConfirmedStaterLocation] = useState(null);
  
  const handleSelectFromList = () => {
    setShowDestinations(true);
  };

  const handleDetectCurrentLocation = async () => {
    setDetectingLocation(true);
    setShowDestinations(false);
    setDestinationConfirmed(false);
    setSelectedItemIndex(null);
    
    setIsLoadingCurrentLocation(true);
    
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
          console.log('Detected Location:', { latitude, longitude});
          handleConfirmLocation({ latitude, longitude });
      } else {
        console.log('Location permission not granted');
      }
    } catch (error) {
      console.error('Error getting current location:', error);
    } finally {
      setIsLoadingCurrentLocation(false);
    }
  };
  // useEffect(() => {
  //   if (confirmedStarterLocation) {
  //     handleConfirmLocation(); // Call handleConfirmLocation when confirmedStarterLocation changes
  //   }
  // }, [confirmedStarterLocation]);
  

  // // Inside your render function
  // {locationDetected && (
  //   <>
  //     <Text style={styles.confirmText}>Location detected successfully!</Text>
  //     <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmLocation}>
  //       <Text style={styles.confirmButtonText}>Confirm Location</Text>
  //     </TouchableOpacity>
  //   </>
  // )}
  

  const handleConfirmDestination = () => {
    if (selectedItemIndex !== null) {
     
      const selectedDestination = selectedPlacesIds[selectedItemIndex];
      const position = {
        latitude: selectedDestination.latitude,
        longitude: selectedDestination.longitude,
      };

      setDestinationConfirmed(true);
      setConfirmedStaterLocation(position);
  
      console.log('Confirmed Destination:', position);
      navigation.navigate('StartGameScreen', {
        selectedPlacesIds: selectedPlacesIds,
        confirmedStarterLocation: position,
      });
    } else {
      Alert.alert('No Destination Selected', 'Please select a destination before confirming.');
    }
  };

  const handleConfirmLocation = ({ latitude, longitude }) => {
    if (latitude && longitude) {
      console.log('Confirmed Location:', { latitude, longitude});
      setLocationDetected(true);
      navigation.navigate('StartGameScreen', {
        selectedPlacesIds: selectedPlacesIds,
        confirmedStarterLocation: { latitude, longitude},
      });
    } else {
      console.warn('Invalid location information provided.');
    }
  };

  const handleDropdownSelect = (destinationId, index) => {
    setSelectedDestination(destinationId);
    setSelectedItemIndex(index);
    setShowDestinations(true);
  };

  const handleBack = () => {
      setShowConfirmationModalAfterSelection(true);   
  };

  const handleCancelBackAfterSelection = () => {
    setShowConfirmationModalAfterSelection(false);
  };

  const handleConfirmBackAfterSelection = () => {
    setShowDestinations(false);
    setShowConfirmationModalAfterSelection(false);
    setDetectingLocation(false);
  };

  const handleBackForDestinationList = () => {
    setShowConfirmationModalBeforeSelection(true);
  };

  const handleCancelBackBeforeSelection = () => {
    setShowConfirmationModalBeforeSelection(false);
  };

  const handleConfirmBackBeforeSelection = () => {
    setShowConfirmationModalBeforeSelection(false);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {!detectingLocation && !showDestinations && !destinationConfirmed && (
        <>

        <Modal
            visible={showConfirmationModalBeforeSelection}
            transparent
            animationType="slide"
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>Are you sure you want to go back to the destination choosing?</Text>
                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmBackBeforeSelection}>
                  <Text style={styles.confirmButtonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancelBackBeforeSelection}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <TouchableOpacity style={styles.backButton} onPress={handleBackForDestinationList}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Select Start Point</Text>
          <TouchableOpacity style={styles.button} onPress={handleSelectFromList}>
            <Text style={styles.buttonText}>Select from Destinations</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleDetectCurrentLocation}>
            <Text style={styles.buttonText}>Detect Current Location</Text>
          </TouchableOpacity>
          <View style={styles.navBarContainer}>
        <NavBar />
      </View>
        </>
      )}

      {detectingLocation && (
        <>
        <Modal
          visible={showConfirmationModalAfterSelection}
          transparent
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Are you sure you want to go back?</Text>
              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmBackAfterSelection}>
                <Text style={styles.confirmButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancelBackAfterSelection}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
      <Text style={styles.buttonText}>Back</Text>
    </TouchableOpacity>
    {/* Loading indicator when fetching current location */}
    {isLoadingCurrentLocation ? (
      <Text style={styles.loadingText}>Detecting Current Location...</Text>
    ) : (
      <>
        <Text style={styles.locationDetectedText}>Location detected successfully!</Text>
        {/* Confirm button */}
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmLocation}>
          <Text style={styles.confirmButtonText}>Confirm Location</Text>
        </TouchableOpacity>
      </>
    )}
  </>
)}
      {showDestinations && !destinationConfirmed && !detectingLocation && (
        <>
          <Modal
            visible={showConfirmationModalAfterSelection}
            transparent
            animationType="slide"
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>Are you sure you want to go back?</Text>
                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmBackAfterSelection}>
                  <Text style={styles.confirmButtonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancelBackAfterSelection}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.listTitle}>List of Confirmed Destinations</Text>
          <View style={styles.destinationList}>
            {selectedPlacesIds.map((destination, index) => (
              <TouchableOpacity
                key={destination.place_id}
                style={[
                  styles.destinationItem,
                  index === selectedItemIndex && styles.selectedDestinationItem
                ]}
                onPress={() => handleDropdownSelect(destination.place_id, index)}
              >
                <Text style={styles.destinationText}>{destination.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmDestination}>
            <Text style={styles.confirmButtonText}>Confirm Destination</Text>
          </TouchableOpacity>
        </>
      )}

      {destinationConfirmed && (
        <Text style={styles.confirmText}>Destination Confirmed!</Text>
      )}
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
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  destinationList: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  destinationItem: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  selectedDestinationItem: {
    backgroundColor: '#007bff',
  },
  destinationText: {
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  confirmText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  detectingLocationText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  locationDetectedText: {
    fontSize: 16,
    color: '#28a745', // Green color
    marginBottom: 20,
    fontWeight: 'bold',
  },
});

export default SelectStartLocationScreen;