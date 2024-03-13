import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Linking } from 'react-native';

const GameLocationModal = ({ isVisible, locations, onClose, clickedLocation}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleGetDirections = () => {
    if (selectedLocation && clickedLocation) {
      const startPlaceId = clickedLocation.place_id;
      const destinationPlaceId = selectedLocation.place_id;
      const startLocationName = encodeURIComponent(clickedLocation.name); // encode the name for URL
      const destinationLocationName = encodeURIComponent(selectedLocation.name);
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin_place_id=${startPlaceId}&destination_place_id=${destinationPlaceId}&origin=${startLocationName}&destination=${destinationLocationName}`;
      Linking.openURL(googleMapsUrl);
    }
  };

  const handleLocationSelect = (selected) => {
    setSelectedLocation(selected);
    setShowDropdown(false);
  };

  const handleOpenCamera = (selected) => {
    setSelectedLocation(selected);
    setShowDropdown(false);
  };

  const filteredLocations = locations.filter(location => location.name !== clickedLocation.name);

  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <Text>Name: {clickedLocation?.name}</Text>
          <Text>Latitude: {clickedLocation?.latitude}</Text>
          <Text>Longitude: {clickedLocation?.longitude}</Text>
          <View style={styles.rowContainer}>
            <Text style={styles.label}>From: </Text>
            <TouchableOpacity style={styles.dropdownButton} onPress={() => setShowDropdown(!showDropdown)}>
              <Text>{selectedLocation ? selectedLocation.name : 'Select Location'}</Text>
            </TouchableOpacity>
          </View>

          {showDropdown && (
            <View style={styles.dropdown}>
              {filteredLocations.map(location => (
                <TouchableOpacity key={location.place_id} onPress={() => handleLocationSelect(location)}>
                  <Text>{location.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <TouchableOpacity style={styles.directionsButton} onPress={handleGetDirections}>
            <Text style={styles.directionsButtonText}>Get Directions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cameraButton} onPress={handleOpenCamera}>
            <Text style={styles.cameraButtonText}>Open Camera</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    minHeight: 200, 
    position: 'absolute',
    top: '20%',
    alignSelf: 'center',
    zIndex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonText: {
    color: 'blue',
    fontWeight: 'bold',
  },
  directionsButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  directionsButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  dropdownButton: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  dropdown: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default GameLocationModal;
