import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Linking, Animated, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; // Import MaterialCommunityIcons for the camera icon
import * as Location from 'expo-location';
import CustomLoadingIndicator from '../../CustomComponents/CustomLoadingIndicator'; 

const GameLocationModal = ({ isVisible, locations, onClose, clickedLocation }) => {
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [selectedFromLocation, setSelectedFromLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [directionsClicked, setDirectionsClicked] = useState(false);
  const [loading, setLoading] = useState(true); // State to track location loading

  useEffect(() => {
    getLocationAsync();
  }, []);

  const getLocationAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      setLoading(false); // Stop loading indicator if permission is denied
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setCurrentLocation(location.coords);
    setSelectedFromLocation({ name: 'Current Location', place_id: 'current_location', latitude: location.coords.latitude, longitude: location.coords.longitude });
    setLoading(false); // Stop loading indicator once location is obtained
  };

  const handleConfirm = () => {
    if (selectedFromLocation) {
      let startLocation;
      if (selectedFromLocation.name === 'Current Location') {
        startLocation = `${currentLocation.latitude},${currentLocation.longitude}`;
      } else {
        startLocation = `${selectedFromLocation.latitude},${selectedFromLocation.longitude}`;
      }
      const destinationLocationName = encodeURIComponent(clickedLocation.name);
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${startLocation}&destination=${destinationLocationName}`;
      setDirectionsClicked(false);
      Linking.openURL(googleMapsUrl);
    }
  };

  const handleFromLocationSelect = (selected) => {
    setSelectedFromLocation(selected);
    setShowFromDropdown(false);
  };

  const filteredLocations = locations.filter(location => location.name !== clickedLocation.name);

  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <Animated.View style={[styles.modalContent, { transform: [{ scale: new Animated.Value(1) }] }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>{clickedLocation?.name}</Text>

          {loading ? (
            <CustomLoadingIndicator /> // Render custom loading indicator while loading location
          ) : (
            <>
              {/* Directions button */}
              <TouchableOpacity style={styles.directionsButton} onPress={() => setDirectionsClicked(true)}>
                <Text style={styles.directionsButtonText}>Get Directions</Text>
              </TouchableOpacity>

              {directionsClicked && (
                <>
                  {/* From dropdown */}
                  <View style={styles.dropdownContainer}>
                    <Text style={styles.label}>From: </Text>
                    <TouchableOpacity style={styles.dropdownButton} onPress={() => setShowFromDropdown(!showFromDropdown)}>
                      <Text style={styles.dropdownText}>{selectedFromLocation ? selectedFromLocation.name : 'Select Location'}</Text>
                    </TouchableOpacity>
                  </View>

                  {showFromDropdown && (
                    <View style={styles.dropdown}>
                      <ScrollView>
                        <TouchableOpacity onPress={() => handleFromLocationSelect({ name: 'Current Location', place_id: 'current_location', latitude: currentLocation.latitude, longitude: currentLocation.longitude })}>
                          <Text style={styles.dropdownItem}>Current Location</Text>
                        </TouchableOpacity>
                        {filteredLocations.map(location => (
                          <TouchableOpacity key={location.place_id} onPress={() => handleFromLocationSelect(location)}>
                            <Text style={styles.dropdownItem}>{location.name}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}

                  {/* Confirm button */}
                  <TouchableOpacity style={styles.directionsButton} onPress={handleConfirm}>
                    <Text style={styles.directionsButtonText}>Confirm</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* Snap button */}
              <TouchableOpacity style={styles.cameraButton}>
                <MaterialCommunityIcons name="camera" size={24} color="#fff" />
                <Text style={styles.snapText}>Snap</Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#1E2A78',
    padding: 20,
    borderRadius: 20,
    width: '80%',
    minHeight: 300,
    position: 'absolute',
    top: '20%',
    alignSelf: 'center',
    zIndex: 1,
    borderWidth: 2,
    borderColor: '#fff',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    color: '#fff',
    width: 60, 
  },
  dropdownButton: {
    backgroundColor: '#4A69BB',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    flex: 1, 
    alignItems: 'center',
  },
  dropdown: {
    maxHeight: 150,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dropdownText: {
    color: '#fff',
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: '#010C33', 
  },
  directionsButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)', 
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  directionsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A69BB',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  snapText: {
    color: '#fff',
    marginLeft: 5,
  },
});

export default GameLocationModal;
