import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const StartGameScreen = ({ route }) => {
  const navigation = useNavigation();
  const { selectedPlaces, detected, confirmedStarterLocation } = route.params;

  const sendBackend = () => {
    //implement logic for backend
  };

  const handleStartAdventure = () => {
    console.log(confirmedStarterLocation.place_id, "confirmed starter location")
    Alert.alert(
      'Confirmation',
      'Are you sure you want to start the game?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            navigation.navigate('GameMapScreen', {              
              selectedPlaces,
              detected,
              confirmedStarterLocation,            
            });
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.selectedPlaces}>Selected Destinations:</Text>
      <View style={styles.destinationList}>
        {selectedPlaces.map((destination, index) => (
          <View key={destination.place_id} style={styles.destinationItem}>
            <Text style={styles.destinationName}>📍 {destination.name}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.confirmButton} onPress={handleStartAdventure}>
        <Text style={styles.confirmButtonText}>Start the Adventure!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#010C33'
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  destinationList: {
    marginTop: 10,
    width: '100%',
    paddingHorizontal: 20,
  },
  destinationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#203040',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 5,
  },
  destinationName: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
  },
  selectedPlaces: {
    color: '#FFF',
    fontSize: 25,
    paddingBottom: 25,
  },
});

export default StartGameScreen;
