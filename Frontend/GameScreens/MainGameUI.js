import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';


const GameMapScreen = ({ route }) => {
  const navigation = useNavigation();
  const { selectedPlacesIds, confirmedStarterLocation } = route.params;

  console.log('Details of the first two array items:');
  console.log('Location 1 - Name', selectedPlacesIds[0].name, 'Longitude:', selectedPlacesIds[0].longitude, 'Latitude:', selectedPlacesIds[0].latitude, 'PlaceID', selectedPlacesIds[0].place_id,);
  console.log('Location 2 - Name', selectedPlacesIds[1].name, 'Longitude:',  selectedPlacesIds[1].longitude, 'Latitude:', selectedPlacesIds[1].latitude, 'PlaceId', selectedPlacesIds[1].place_id);

  //function to get current location
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
          latitude: confirmedStarterLocation.latitude,
          longitude: confirmedStarterLocation.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        mapType="standard"
      >
        {/* Marker for the start location */}
        <Marker
          coordinate={{
            latitude: confirmedStarterLocation.latitude,
            longitude: confirmedStarterLocation.longitude,
          }}
          title="Start Location"
          pinColor="blue" 
        />

        {/* Markers for selected places */}
        {selectedPlacesIds.map((destination, index) => (
          <Marker
            key={destination.place_id}
            coordinate={{
              latitude: destination.latitude,
              longitude: destination.longitude,
            }}
            title={destination.name}
            pinColor="red"
          />
        ))}
      </MapView>
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
});

export default GameMapScreen;
