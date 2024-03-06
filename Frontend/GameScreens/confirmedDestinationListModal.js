import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ConfirmedDestinationListModal = ({ visible, onClose, selectedPlacesIds, onRemoveDestination }) => {
  const navigation = useNavigation();

  const handleNextPress = () => {
    if (selectedPlacesIds.length < 3) {
      Alert.alert(
        'Error',
        'You need to select at least three destinations.',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false }
      );
    } else {
      navigation.navigate('SelectStartLocationScreen', { selectedPlacesIds });
    }
  };

  const slideAnim = new Animated.Value(-1000); // Initial position outside the screen

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: -1000, // Move back outside the screen
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleRemoveDestination = (placeId) => {
    //the onRemoveDestination function provided by the parent component
    onRemoveDestination(placeId);
  };

  return (
    <Modal visible={visible} transparent={true} onRequestClose={onClose}>
      <Animated.View
        style={[
          styles.modalContainer,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <View style={styles.modalContent}>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextButton} onPress={() => { onClose(); handleNextPress(); }}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.modalTitle}>List of Confirmed Destinations</Text>
          {selectedPlacesIds.map(destination => (
            <View key={destination.place_id} style={styles.destinationContainer}>
              <Text style={styles.destinationText}>{destination.name}</Text>
              <TouchableOpacity onPress={() => handleRemoveDestination(destination.place_id)}>
                <Text style={styles.removeButtonText}>x</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </Animated.View>
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
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  nextButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  destinationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  destinationText: {
    flex: 1,
    marginBottom: 5,
  },
  removeButtonText: {
    color: 'red',
    marginLeft: 10,
  },
});

export default ConfirmedDestinationListModal;
