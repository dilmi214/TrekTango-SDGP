import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Constants from 'expo-constants';
import Layout from '../../CustomComponents/ScreenLayout';
import Snackbar from '../../CustomComponents/Snackbar';
import NavBar from '../../CustomComponents/NavBar';
import CustomDialog from '../../CustomComponents/CustomDialog';

const SearchLocationScreen = ({ navigation }) => {
  //  default coordinates
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

  const handlePlaceSelect = (data, details) => {
    const { geometry } = details;
    const { location } = geometry;

    setSelectedLocation({
      latitude: location.lat,
      longitude: location.lng,
    });

    // pan and zoom to the selected location
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        ...INITIAL_POSITION,
        latitude: location.lat,
        longitude: location.lng,
      });
    }
  };

  return (
    <Layout>
      <View style={styles.container}>
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
      <GooglePlacesAutocomplete
        placeholder='Search Location'
        onPress={(data, details = null) => handlePlaceSelect(data, details)}
        query={{
          key: GOOGLE_API_KEY,
          language: 'en', 
        }}
        styles={autoCompleteStyles}
        fetchDetails={true}
        enablePoweredByContainer={false}
      />
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          mapType={"standard"} 
          initialRegion={INITIAL_POSITION}
        >
          {selectedLocation && (
            <Marker
              coordinate={selectedLocation}
              title="Selected Location"
            />
          )}
        </MapView>
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
  </Layout>
  );
};

const autoCompleteStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Constants.statusBarHeight + 30, 
    left: 0,
    right: 0,
    zIndex: 1,
  },
  textInput: {
    height: 40,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    marginTop: 10,
    marginHorizontal: 10,
    paddingHorizontal: 10,
  },
  listView: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 10,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  buttonsContainer: {
    top: Constants.statusBarHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 10,
    zIndex: 1,
  },
  buttonText: {
    fontSize: 18,
    color: 'blue',
  },
  navBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default SearchLocationScreen;
