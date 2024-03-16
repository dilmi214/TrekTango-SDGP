import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';

const GameMapScreen = ({ route }) => {
  const navigation = useNavigation();
  const { selectedPlacesIds, confirmedStarterLocation } = route.params;

  useEffect(() => {
    const getUserCurrentLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        console.log('User current location:', location.coords);
      } catch (error) {
        console.error('Error getting user current location:', error);
      }
    };

    getUserCurrentLocation();
  }, []);

  const handleBackButtonPress = () => {
    navigation.goBack();
  };

  const renderDestinationItem = ({ item }) => (
    <View style={styles.destinationItem}>
      <Text style={styles.destinationText}>{item.name}</Text>
    </View>
  );

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
        
        <Polyline
          coordinates={[
            { latitude: confirmedStarterLocation.latitude, longitude: confirmedStarterLocation.longitude },
            ...selectedPlacesIds.map(destination => ({ latitude: destination.latitude, longitude: destination.longitude }))
          ]}
          strokeWidth={3}
          strokeColor="#FF5733"
        />

        
        <Marker
          coordinate={{
            latitude: confirmedStarterLocation.latitude,
            longitude: confirmedStarterLocation.longitude,
          }}
          title="Start Location"
          pinColor="blue"
        />

        
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
      <TouchableOpacity style={styles.backButton} onPress={handleBackButtonPress}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <View style={styles.destinationListContainer}>
        <Text style={styles.destinationListHeader}>Your Trek Points</Text>
        <FlatList
          data={selectedPlacesIds}
          renderItem={renderDestinationItem}
          keyExtractor={item => item.place_id.toString()}
          style={styles.destinationList}
        />
      </View>
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
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    zIndex: 1,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
  destinationListContainer: {
    position: 'absolute',
    bottom: 40,
    maxWidth:'100%',
    // transform: [{ translateX: -100 }],
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 10,
    // zIndex: 1,
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

export default GameMapScreen;
