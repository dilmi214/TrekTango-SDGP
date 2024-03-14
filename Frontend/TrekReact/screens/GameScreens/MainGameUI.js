import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import GameLocationModal from './GameLocationModal';

const GameMapScreen = ({ route }) => {
  const navigation = useNavigation();
  const { finalDestinationList } = route.params;
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleBack = () => {
    navigation.goBack();
  };

  const handlePinPress = (destination) => {
     setSelectedLocation(destination);
     console.log('Selected Location:', destination);
  };

  const closeModal = () => {
    setSelectedLocation(null);
  };

  const getUserCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      const userLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      console.log('User current location:', userLocation);
      // You can use the userLocation data as needed
    } catch (error) {
      console.error('Error getting user current location:', error);
      // Handle error
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: finalDestinationList[0].latitude,
          longitude: finalDestinationList[0].longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        mapType="standard"
      >
        {/* Marker for the Start Location */}
        <Marker
          coordinate={{
            latitude: finalDestinationList[0].latitude,
            longitude: finalDestinationList[0].longitude,
          }}
          title="Start Location"
          pinColor="blue" 
        />

        {/* Markers for all destinations except the first one */}
        {finalDestinationList.slice(1).map((destination, index) => (
          <Marker
            key={destination.place_id}
            coordinate={{
              latitude: destination.latitude,
              longitude: destination.longitude,
            }}
            title={destination.name}
            pinColor="red"
            onPress={() => handlePinPress(destination)} // Call handlePinPress function with the clicked destination
          />
        ))}
      </MapView>
      
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      {/* Location modal - render only when a pin is selected */}
      {selectedLocation && (
        <GameLocationModal isVisible={true} locations={finalDestinationList} clickedLocation={selectedLocation} onClose={closeModal} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    zIndex: 999,
  },
  backButtonText: {
    fontWeight: 'bold',
  },
});

export default GameMapScreen;