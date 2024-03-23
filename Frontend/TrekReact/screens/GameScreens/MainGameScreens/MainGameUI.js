import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import GameLocationModal from './GameLocationModal';
import CustomActivityIndicator from '../../CustomComponents/CustomActinityIndicator';

const GameMapScreen = ({ route }) => {
  const navigation = useNavigation();
  const { finalDestinationList, detected, confirmedStarterLocation } = route.params;
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [directions, setDirections] = useState([]);

  useEffect(() => {
    console.log(detected, confirmedStarterLocation)
    const fetchDirections = async () => {
      const apiKey = 'AIzaSyCCHxfnoWl-DNhLhKcjhCTiHYNY917ltL8';
      const waypoints = finalDestinationList.map(place => `place_id:${place.place_id}`).join('|');
      const origin = `${confirmedStarterLocation.latitude},${confirmedStarterLocation.longitude}`;
      const destination = `${finalDestinationList[finalDestinationList.length - 1].latitude},${finalDestinationList[finalDestinationList.length - 1].longitude}`;

      const response = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&waypoints=${waypoints}&key=${apiKey}`);
      const data = await response.json();

      if (data.status === 'OK') {
        const polylinePoints = data.routes[0].overview_polyline.points;
        setDirections(polylinePoints);
      } else {
        console.error('Error fetching directions:', data.status);
      }
    };

    fetchDirections();
  }, [finalDestinationList, confirmedStarterLocation]);

  const handleBackButtonPress = () => {
    navigation.goBack();
  };

  const renderDestinationItem = ({ item }) => (
    <View style={styles.destinationItem}>
      <Text style={styles.destinationText}>{item.name}</Text>
    </View>
  );

  const handleRedMarkerPress = (location) => {
    setSelectedLocation(location);
  };

  const handleBlueMarkerPress = (location) => {
    if (!detected) {
      setSelectedLocation(location);
    }
  };

  return (
    <View style={styles.container}>
      {confirmedStarterLocation && (
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
          {directions.length > 0 && (
            <Polyline
              coordinates={decodePolyline(directions)}
              strokeWidth={3}
              strokeColor="#FF5733"
            />
          )}

          <Marker
            coordinate={{
              latitude: confirmedStarterLocation.latitude,
              longitude: confirmedStarterLocation.longitude,
            }}
            title="Start Location"
            pinColor="blue"
            onPress={() => handleBlueMarkerPress(finalDestinationList[0])} // Handle marker press
          />

          {finalDestinationList.map((destination, index) => (
            // Check if detected is false and if it's the first item, skip rendering
            !detected && index === 0 ? null : (
              <Marker
                key={destination.place_id}
                coordinate={{
                  latitude: destination.latitude,
                  longitude: destination.longitude,
                }}
                title={destination.name}
                pinColor="red"
                onPress={() => handleRedMarkerPress(destination)} // Handle marker press
              />
            )
          ))}
        </MapView>
      )}
      <TouchableOpacity style={styles.searchProgressButton} onPress={handleBackButtonPress}>
        <Text style={styles.searchProgressButtonText}>Session Progress</Text>
      </TouchableOpacity>
      <View style={styles.destinationListContainer}>
        <Text style={styles.destinationListHeader}>Your Trek Points</Text>
        <FlatList
          data={finalDestinationList}
          renderItem={renderDestinationItem}
          keyExtractor={item => item.place_id.toString()}
          style={styles.destinationList}
        />
      </View>

      {/* Render the GameLocationModal when selectedLocation is not null */}
      {selectedLocation && (
        <GameLocationModal
          isVisible={true}  // Ensure the modal is visible
          locations={finalDestinationList}  // Pass the selectedPlaces array
          clickedLocation={selectedLocation}  // Pass the selected location
          onClose={() => setSelectedLocation(null)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchProgressButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    zIndex: 1,
  },
  searchProgressButtonText: {
    color: 'black',
    fontSize: 16,
  },
  destinationListContainer: {
    position: 'absolute',
    bottom: 40,
    maxWidth: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 10,
  },
  destinationListHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  destinationList: {
    maxHeight: 200,
  },
  destinationItem: {
    paddingVertical: 5,
  },
  destinationText: {
    fontSize: 14,
  },
});

// Function to decode Google Maps polyline
function decodePolyline(encoded) {
  // array that holds the points
  const points = []
  let index = 0, len = encoded.length;
  let lat = 0, lng = 0;

  while (index < len) {
    let b, shift = 0, result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63; // finds ascii and substract it by 63
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlat = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlng = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return points;
}

export default GameMapScreen;
