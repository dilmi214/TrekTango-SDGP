import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, ScrollView } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Circle } from 'react-native-maps';
import Constants from 'expo-constants';
import NavBar from '../../CustomComponents/NavBar';
import CustomDialog from '../../CustomComponents/CustomDialog';

const RadiusSetScreen = ({ route, navigation }) => {
  const { longitude, latitude } = route.params;
  const mapRef = useRef(null);
  const [showDialog, setShowDialog] = useState(false);
  const [radius, setRadius] = useState(1000); // Initial radius 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const radiusValues = [1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000];
  const [selectedRadiusValue, setSelectedRadiusValue] = useState(radiusValues[0]);

  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });
      }, 500); // Delaying the animation by 1 second to ensure the map is ready
    }
  }, [mapRef]);

  const handleBackPress = () => {
    setShowDialog(true);
  };

  const handleDialogSelect = (option) => {
    setShowDialog(false);
    if (option === 'Yes') {
      navigation.goBack();
    }
  };

  const handleNextPress = () => {
    navigation.navigate('NearbyDestinations', {longitude, latitude, radius});
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const onRadiusChange = (value) => {
    setSelectedRadiusValue(value);
    setRadius(value);
    toggleDropdown();
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
      >
        <Marker
          coordinate={{ latitude, longitude }}
          title="Current Location"
          description="You are here"
        />
        <Circle
          center={{ latitude, longitude }}
          radius={radius}
          fillColor="rgba(106, 120, 220, 0.3)"
          strokeColor="rgba(0, 0, 255, 0.8)"
          strokeWidth={2}
        />
      </MapView>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={handleBackPress} style={styles.button}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNextPress} style={styles.button}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>

      <CustomDialog
        visible={showDialog}
        title="Are you sure you want to go back?"
        message="Your unsaved changes will be lost."
        options={['Yes', 'No']}
        onSelect={handleDialogSelect}
      />

      <View style={styles.radiusContainer}>
        <TouchableOpacity onPress={toggleDropdown} style={styles.selectedRadiusContainer}>
          <Text style={styles.selectedRadiusText}>{selectedRadiusValue} m</Text>
          {isDropdownOpen && (
            <ScrollView style={styles.dropdownContainer}>
              {radiusValues.map(value => (
                <TouchableOpacity
                  key={value}
                  onPress={() => onRadiusChange(value)}
                  style={styles.dropdownItem}
                >
                  <Text>{value} m</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.navBarContainer}>
        <NavBar />
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
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  buttonsContainer: {
    position: 'absolute',
    top: Constants.statusBarHeight + 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    width: '100%',
    zIndex: 1,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    zIndex: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',

  },
  radiusContainer: {
    position: 'absolute',
    top: Constants.statusBarHeight + 20,
    zIndex: 1,
    width: '50%',
    alignItems: 'center',
  },
  selectedRadiusContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  selectedRadiusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdownContainer: {
    position: 'absolute',
    top: Constants.statusBarHeight - 11, // Adjust the top position as needed
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    maxHeight: 150,
    zIndex: 1,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  navBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default RadiusSetScreen;
