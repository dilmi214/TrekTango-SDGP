import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';


const ConfirmedDestinationListModal = ({ visible, onClose, selectedPlacesIds, onRemoveDestination }) => {
  
  const handleRemoveDestination = (placeId) => {
    onRemoveDestination(placeId);
  };

  return (
    <Modal visible={visible} transparent={true} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>

          <Text style={styles.modalTitle}>List of Confirmed Destinations</Text>
          {selectedPlacesIds.length === 0 ? (
            <Text style={styles.emptyListText}>List is empty. Add places</Text>
          ) : (
            selectedPlacesIds.map(destination => (
              <View key={destination.place_id} style={styles.destinationContainer}>
                <Text style={styles.destinationText}>{destination.name}</Text>
                <TouchableOpacity onPress={() => handleRemoveDestination(destination.place_id)}>
                  <Text style={styles.removeButtonText}>x</Text>
                </TouchableOpacity>
              </View>
              
            ))
          )}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
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
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#ccc',
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
  emptyListText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#999',
  },
});

export default ConfirmedDestinationListModal;