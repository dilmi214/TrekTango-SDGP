import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import { CurrentRenderContext, useNavigation } from '@react-navigation/native';

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
    backgroundColor: '#010C33', 
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  destinationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    borderWidth: 1, 
    borderColor: '#FFF', 
    padding: 10, 
    borderRadius: 5, 
  },
  destinationText: {
    flex: 1,
    marginBottom: 5,
    color:'#FFF',
  },
  removeButtonText: {
    color: '#FFF',
    marginLeft: 10,
    fontSize: '24',
  },
  emptyListText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#999',
  },
  closeButton: {
    backgroundColor: '#2E8AF7', 
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10, 
  },
  buttonText: {
    color: '#FFF', 
    fontWeight: 'bold',
  },
   
});

export default ConfirmedDestinationListModal;
