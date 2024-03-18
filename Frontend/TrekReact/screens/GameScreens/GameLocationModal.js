import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Linking, Animated, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; // Import MaterialCommunityIcons for the camera icon
import * as Location from 'expo-location'; 

const GameLocationModal = ({ isVisible, locations, onClose, clickedLocation }) => {
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [selectedFromLocation, setSelectedFromLocation] = useState(null);
  const [selectedToLocation, setSelectedToLocation] = useState(clickedLocation); // Set initial "To" location to clickedLocation
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    getLocationAsync();
  }, []);

  const getLocationAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setCurrentLocation(location.coords);
    setSelectedFromLocation({ name: 'Current Location', place_id: 'current_location' });
  };

  const handleGetDirections = () => {
    if (selectedFromLocation && selectedToLocation) {
      const startPlaceId = selectedFromLocation.place_id || 'current_location';
      const destinationPlaceId = selectedToLocation.place_id;
      const startLocation = startPlaceId === 'current_location' ? `${currentLocation.latitude},${currentLocation.longitude}` : `place_id:${startPlaceId}`;
      const destinationLocationName = encodeURIComponent(selectedToLocation.name);
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${startLocation}&destination=${destinationLocationName}`;
      Linking.openURL(googleMapsUrl);
    }
  };

  const handleFromLocationSelect = (selected) => {
    setSelectedFromLocation(selected);
    setShowFromDropdown(false);
  };

  const handleToLocationSelect = (selected) => {
    setSelectedToLocation(selected);
    setShowToDropdown(false);
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
                <TouchableOpacity onPress={() => handleFromLocationSelect({ name: 'Current Location', place_id: 'current_location' })}>
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

          {/* To dropdown */}
          <View style={styles.dropdownContainer}>
            <Text style={styles.label}>To: </Text>
            <TouchableOpacity style={styles.dropdownButton} onPress={() => setShowToDropdown(!showToDropdown)}>
              <Text style={styles.dropdownText}>{selectedToLocation ? selectedToLocation.name : 'Select Location'}</Text>
            </TouchableOpacity>
          </View>

          {showToDropdown && (
            <View style={styles.dropdown}>
              <ScrollView>
                {filteredLocations.map(location => (
                  <TouchableOpacity key={location.place_id} onPress={() => handleToLocationSelect(location)}>
                    <Text style={styles.dropdownItem}>{location.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Directions button */}
          <TouchableOpacity style={styles.directionsButton} onPress={handleGetDirections}>
            <Text style={styles.directionsButtonText}>Get Directions</Text>
          </TouchableOpacity>

          {/* Snap button */}
          <TouchableOpacity style={styles.cameraButton}>
            <MaterialCommunityIcons name="camera" size={24} color="#fff" />
            <Text style={styles.snapText}>Snap</Text>
          </TouchableOpacity>
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
