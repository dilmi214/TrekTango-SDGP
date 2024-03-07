import MapView, { PROVIDER_GOOGLE, Marker, Circle } from 'react-native-maps';
import { StyleSheet, View, Dimensions, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native'; // Added ScrollView import
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Constants from 'expo-constants';
import React, { useState, useRef } from 'react';
import * as Location from 'expo-location';
import Dialog from 'react-native-dialog';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import CustomLoadingIndicator from './CustomLoadingIndicator';
import { Picker } from '@react-native-picker/picker';

const GOOGLE_API_KEY = "AIzaSyCCHxfnoWl-DNhLhKcjhCTiHYNY917ltL8";
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

export default function App() {
  const [lastSelectedLocation, setLastSelectedLocation] = useState(null); // Keep track of the last selected location
  const [circlePosition, setCirclePosition] = useState(null);
  const [isLocationConfirmed, setIsLocationConfirmed] = useState(false);
  const [error, setError] = useState(null); // State to track errors
  const [dialogVisible, setDialogVisible] = useState(false); // State to track dialog visibility
  const [errorDialogVisible, setErrorDialogVisible] = useState(false); // State to track error dialog visibility
  const [showBackDialog, setShowBackDialog] = useState(false); // State to track whether to show the back dialog
  const mapRef = useRef(null); 
  const [isLoadingSearch, setIsLoadingSearch] = useState(false); // loading indicator state
  const [isLoadingCurrentLocation, setIsLoadingCurrentLocation] = useState(false);
  const [showRadiusConfirmationDialog, setShowRadiusConfirmationDialog] = useState(false); // State to track radius confirmation dialog visibility
  const [radius, setRadius] = useState(1000); // Initial radius set to 1000 meters
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigation = useNavigation();
  const radiusValues = [1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000,];

  const moveTo = async (position) => {
    const camera = await mapRef.current?.getCamera();
    if (camera) {
      camera.center = position;
      mapRef.current?.animateCamera(camera, { duration: 1000 });
    }
  };

  const onPlaceSelected = (details) => {
    setIsLoadingSearch(true); // Set loading state to true when searching

    const position = {
      latitude: details?.geometry.location.lat || 0,
      longitude: details ? details.geometry.location.lng || 0 : 0,
    };

    console.log('Selected Place:', position); // for debugging
    setLastSelectedLocation(position); // Update the last selected location
    moveTo(position);

    setTimeout(() => {
      setIsLoadingSearch(false); // Set loading state to false when search completes
    }, 2000); // Simulating 2 seconds delay
  };

  const onCurrentLocationSelected = async () => {
    setIsLoadingCurrentLocation(true); //loading state set to true when fetching current location
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const position = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
  
        console.log('Current Location:', position); // for debugging
        setLastSelectedLocation(position); // the last selected location
        moveTo(position);
      } else {
        console.log('Location permission not granted');
      }
    } catch (error) {
      console.error('Error getting current location:', error);
    } finally {
      setTimeout(() => {
        setIsLoadingCurrentLocation(false); // Set loading state to false when search completes
      }, 2000); // Simulating 2 seconds delay
    }
  };


  const showConfirmationDialog = () => {
    if (!lastSelectedLocation) {
      setError('No location has been selected, please select a location.');
      setErrorDialogVisible(true);
      return;
    }
    setDialogVisible(true);
  };

  const continueConfirmation = () => {
    setIsLocationConfirmed(true);
    drawCircle();
    hideConfirmationDialog();   
  };

  const drawCircle = () => {
    if (lastSelectedLocation) {
      setCirclePosition(lastSelectedLocation);
    }
  };

  const hideConfirmationDialog = () => {
    setDialogVisible(false);
  };

  const sendLocationDataToBackend = async () => {
    try {
      const data = {
        longitude: circlePosition.longitude,
        latitude: circlePosition.latitude,
        radius: 1000 // the radius is fixed to 1000 meters, can change
      };
      
      const response = await axios.post('http://localhost:5000/location', data);
      console.log('Backend response:', response.data);
      // Handle backend response as needed
    } catch (error) {
      console.error('Error sending data to backend:', error);
      // Handle error
    }
  };

  const onRadiusConfirmation = () => {
    setShowRadiusConfirmationDialog(true);
  };

  const handleRadiusConfirmation = () => {
    navigation.navigate('NearbyDestinations', {
      lastLongitude: lastSelectedLocation.longitude,
      lastLatitude: lastSelectedLocation.latitude,
      radius: radius, // Pass the selected radius value
    });
  };


  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  const onBackButtonPress = () => {
    // Show the back dialog
    setShowBackDialog(true);
  };

  const handleBackDialogResponse = (response) => {
    // If the user agrees to go back, proceed
    if (response === 'back') {
      setIsLocationConfirmed(false);
      setCirclePosition(null);
    }
    // Hide the dialog box
    setShowBackDialog(false);
  };

  const hideErrorDialog = () => {
    setErrorDialogVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Conditionally render the loading indicator */}
      {(isLoadingSearch || isLoadingCurrentLocation) && <CustomLoadingIndicator />}
      
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          mapType={"standard"} 
          initialRegion={INITIAL_POSITION}
        >        
        {lastSelectedLocation && (
          <Marker
            coordinate={lastSelectedLocation}
            title="Selected Location"
            pinColor="#080756" // color of the location marker
            onPress={() => console.log("Marker pressed!")}
          />
        )}
        {isLocationConfirmed && circlePosition && (
          <Circle
            center={circlePosition}
            radius={radius} // Use the radius state value
            fillColor="rgba(106, 120, 220, 0.3)" // Blue fill color
            strokeColor="rgba(0, 0, 255, 0.8)" // Blue stroke color
            strokeWidth={2}
          />       
        )}
      </MapView>
    </View>
      {!isLocationConfirmed && (
        <View style={styles.searchContainer}>
          <GooglePlacesAutocomplete
            styles={{    
              container: {
              position: 'relative', // the container is positioned relative to its parent
              zIndex: 10, 
            },
            listView: {
              position: 'absolute', 
              top: '100%', 
              left: 0, 
              right: 0, 
              backgroundColor: '#fff', 
              borderColor: '#ccc', 
              borderWidth: 1, 
              borderRadius: 8,
              marginTop: 4, 
              maxHeight: 200, 
              overflow: 'scroll', 
            },
          }}
          placeholder={"Search Location"}
            
            fetchDetails
            onPress={(data, details = null) => {
              onPlaceSelected(details);
            }}
            query={{
              key: GOOGLE_API_KEY,
              language: "pt-BR",
            }}
          />
          <TouchableOpacity onPress={onCurrentLocationSelected} style={styles.locationButton}>
            <Text>📍</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={showConfirmationDialog} style={styles.confirmButton}>
            <Text>Confirm</Text>
          </TouchableOpacity>
        </View>
      )}
      <Dialog.Container visible={dialogVisible}>
        <Dialog.Title>Confirm Location</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to select this location?
        </Dialog.Description>
        <Dialog.Button label="Cancel" onPress={hideConfirmationDialog} />
        <Dialog.Button label="Continue" onPress={continueConfirmation} />
      </Dialog.Container>
      <Dialog.Container visible={errorDialogVisible}>
        <Dialog.Title>Error</Dialog.Title>
        <Dialog.Description>{error}</Dialog.Description>
        <Dialog.Button label="OK" onPress={hideErrorDialog} />
      </Dialog.Container>
      <Dialog.Container visible={showBackDialog}>
        <Dialog.Title>Confirmation</Dialog.Title>
        <Dialog.Description>Do you want to go back?</Dialog.Description>
        <Dialog.Button label="Cancel" onPress={() => handleBackDialogResponse('cancel')} />
        <Dialog.Button label="Back" onPress={() => handleBackDialogResponse('back')} />
      </Dialog.Container>
      {isLocationConfirmed && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={onBackButtonPress} style={styles.backButton}>
            <Text>Back</Text>
          </TouchableOpacity>
          <View style={styles.radiusContainer}>
          <TouchableOpacity onPress={toggleDropdown} style={styles.pickerContainer}>
            <Text style={styles.selectedOption}>{radius} m</Text>
            {isDropdownOpen && (
              <ScrollView style={styles.dropdown}>
                {radiusValues.map(value => (
                  <TouchableOpacity
                    key={value}
                    onPress={() => {
                      setRadius(value);
                      toggleDropdown();
                    }}
                    style={styles.dropdownItem}
                  >
                    <Text>{value} m</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={onRadiusConfirmation} style={styles.confirmButton}>
            <Text>Confirm</Text>
          </TouchableOpacity>
        </View>
      )}
      <Dialog.Container visible={showRadiusConfirmationDialog}>
        <Dialog.Title>Confirmation</Dialog.Title>
        <Dialog.Description>Are you sure you want to confirm the radius?</Dialog.Description>
        <Dialog.Button label="Cancel" onPress={() => setShowRadiusConfirmationDialog(false)} />
        <Dialog.Button label="Confirm" onPress={() => { setShowRadiusConfirmationDialog(false); handleRadiusConfirmation(); }} />
      </Dialog.Container>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#010C33",
  },
  mapContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50, //height of map
    paddingBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
  },
  searchContainer: {
    position: "absolute",
    top: Constants.statusBarHeight + 20,
    width: "90%",
    alignSelf: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    
  },
  input: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    zIndex: 10,
    overflow: 'scroll',
    maxHeight: 40, 
    
  },
  locationButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginHorizontal: 10,
    
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  backButton: {
    backgroundColor: '#FF5733',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonContainer: {
    position: "absolute",
    top: Constants.statusBarHeight + 20,
    width: "90%",
    alignSelf: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  radiusContainer: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
  },
  pickerContainer: {
    width: 150,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'visible',
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    height: '100%',
  },
  pickerItem: {
    fontSize: 12,
    paddingTop: 4,
    paddingBottom: 4,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    zIndex: 10, 
    maxHeight: 150, 
    overflow: 'scroll', 
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    //justifyContent: 'center',
    alignItems: 'center', 
  },
  selectedOption: {
    textAlign: 'center', 
    
  },
});
