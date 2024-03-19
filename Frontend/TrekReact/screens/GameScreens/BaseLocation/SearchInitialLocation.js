import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, TextInput, FlatList } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Constants from 'expo-constants';
import Snackbar from '../../CustomComponents/Snackbar';
import CustomDialog from '../../CustomComponents/CustomDialog';
import axios from 'axios'; // Import axios for making HTTP requests

const SearchLocationScreen = ({ navigation }) => {
  const GOOGLE_API_KEY = 'AIzaSyCCHxfnoWl-DNhLhKcjhCTiHYNY917ltL8';
  const { width, height } = Dimensions.get("window");
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.02;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const INITIAL_POSITION = {
    latitude: 40.767110,
    longitude: -73.979704,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  };

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [showPredictions, setShowPredictions] = useState(false); // Control visibility of predictions
  const mapRef = useRef(null);

  const handleBackPress = () => {
    setShowDialog(true);
  };

  const handleDialogSelect = (option) => {
    setShowDialog(false);
    if (option === 'Yes') {
      navigation.navigate('LocationSelectionScreen');
    }
  };

  const handleNextPress = () => {
    if (selectedLocation) {
      const { latitude, longitude } = selectedLocation;
      navigation.navigate('RadiusSetScreen', { latitude, longitude });
    } else {
      setShowSnackbar(true);
      setTimeout(() => {
        setShowSnackbar(false);
      }, 1201);
    }
  };

  const handlePlaceSelect = (placeId) => {
    // Fetch details of the selected place using placeId
    axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`)
      .then(response => {
        const result = response.data.result;
        setSelectedLocation({
          latitude: result.geometry.location.lat,
          longitude: result.geometry.location.lng,
        });
  
        // pan and zoom to the selected location
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            ...INITIAL_POSITION,
            latitude: result.geometry.location.lat,
            longitude: result.geometry.location.lng,
          });
        }
  
        // Close the predictions dropdown
        setShowPredictions(false);
      })
      .catch(error => {
        console.error('Error fetching place details:', error);
      });
  };

  const handleSearchTextChange = (text) => {
    setSearchText(text);
    // Fetch location predictions based on user input
    axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&types=(cities)&key=${GOOGLE_API_KEY}`)
      .then(response => {
        setPredictions(response.data.predictions);
        setShowPredictions(true); // Show predictions when user starts typing
      })
      .catch(error => {
        console.error('Error fetching location predictions:', error);
      });
  };

  

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        mapType={"standard"}
        initialRegion={INITIAL_POSITION}
      >
        {selectedLocation && (
          <Marker coordinate={selectedLocation} title="Selected Location" />
        )}
      </MapView>
      <View style={styles.overlay}>
        <View style={[styles.ButtonsInputContainer, !showPredictions && { marginBottom: 0 }]}>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={handleBackPress}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <CustomDialog
            visible={showDialog}
            title="Are you sure you want to go back?"
            message="Your unsaved changes will be lost."
            options={['Yes', 'No']}
            onSelect={handleDialogSelect}
          />
          <TouchableOpacity onPress={handleNextPress}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
          <TextInput
            style={styles.textInput}
            placeholder="Search City"
            placeholderTextColor="white"
            value={searchText}
            onChangeText={handleSearchTextChange}
          />
          {showPredictions && (
            <FlatList
              style={styles.listView}
              data={predictions}
              keyExtractor={(item) => item.place_id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handlePlaceSelect(item.place_id)}>
                  <Text style={styles.predictionText}>{item.description}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
        {showSnackbar && (
          <Snackbar
            visible={showSnackbar}
            message="No place has been selected."
            duration={1200}
            action={{ label: 'Dismiss', onPress: () => setShowSnackbar(false) }}
          />
        )}
      </View>
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
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: Constants.statusBarHeight + 10,
    marginBottom: 10,
    zIndex: 1,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  ButtonsInputContainer: {
    width: '100%',
    marginBottom: 10,
    backgroundColor: 'rgba(1, 12, 51, 0.6)', // Transparent background for the overlay
    paddingBottom: 10,
    alignItems: 'center',
  },
  textInput: {
    height: 40,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 10,
    width: '90%',
    borderRadius: 5,
    color: 'white', // Set text color to white
  },
  listViewContainer: {
     // Transparent background for the FlatList container
    marginHorizontal: 10,
    marginTop: 5,
    width: '90%',
    maxHeight: 200, // Set max height for the FlatList
  },
  listView: {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    marginHorizontal: 10,
    marginTop: 5,
    width: '90%',
    maxHeight: 200, // Set max height for the FlatList
  },
  predictionText: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
    borderColor: 'white', // Add white border color
    borderWidth: 1, // Add border width
    borderRadius: 20, // Add border radius
    color: 'white',
    marginBottom: 5,
  },
});

export default SearchLocationScreen;