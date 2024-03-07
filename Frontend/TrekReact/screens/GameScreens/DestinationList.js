import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity, Image, ScrollView, Button } from 'react-native';
import { ListItem } from 'react-native-elements';
import PlaceDetailsModal from './PlaceDetailsModal';
import ConfirmedDestinationListModal from './confirmedDestinationListModal'; // Import the modal
import Dialog from 'react-native-dialog';
import { useNavigation, useRoute } from '@react-navigation/native';
import NavBar from '../../NavBar';
import CustomDialog from '../CustomDialog';

const GOOGLE_PLACES_API_KEY = "AIzaSyCCHxfnoWl-DNhLhKcjhCTiHYNY917ltL8";

const categories = [
  { label: "All Categories", value: "" },
  { label: "Tourist Attractions", value: "tourist_attraction" },
  { label: "Restaurant & Cafe", value: "restaurant_cafe" },
  { label: "Shopping Malls/Stores", value: "shopping_mall|store" },
  { label: "Outdoor Activities", value: "park|amusement_park|bowling_alley|stadium|zoo|parking" },
  { label: "Cultural/Religious Sites", value: "church|hindu_temple|mosque|synagogue" },
  { label: "Entertainment", value: "movie_theater|night_club|casino" },
  { label: "Nature and Wildlife", value: "park|zoo|aquarium" },
  { label: "Museums", value: "museum" }
];

const NearbyDestinationsScreen = () => {
  
  const route = useRoute();
  const { longitude, latitude, radius} = route.params;
  useEffect(() => {
    // Log the lastLongitude and lastLatitude when the component mounts
    console.log('Last Longitude:', longitude);
    console.log('Last Latitude:', latitude);
    console.log(radius);
    //console.log(isCurrentLocation);
  }, []);

  const [destinations, setDestinations] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedPlaceImages, setSelectedPlaceImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlacesIds, setSelectedPlacesIds] = useState([]); // Array to store selected place IDs
  const [confirmedModalVisible, setConfirmedModalVisible] = useState(false); 
  const [showBackDialog, setShowBackDialog] = useState(false); // State to track whether to show the back dialog
  const [showDialog, setShowDialog] = useState(false);

  const navigation = useNavigation();
  useEffect(() => {
    fetchNearbyDestinations();
  }, [selectedType]);

  const fetchNearbyDestinations = async () => {
    try {
      let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&key=${GOOGLE_PLACES_API_KEY}`;
     
      if (selectedType) {
        if (selectedType === "restaurant_cafe") {
          url += `&type=restaurant|cafe`;
        } else {
          url += `&type=${selectedType}`;
        }
      }
 
      const response = await fetch(url);
      const data = await response.json();
      setDestinations(data.results);
 
    } catch (error) {
      console.error('Error fetching nearby destinations: ', error);
    }
  };

  // callback function to update the array when an item is removed in the modal
  const handleRemoveDestination = (placeIdToRemove) => {
    // filter out the removed item from the array
    const updatedSelectedPlacesIds = selectedPlacesIds.filter(destination => destination.place_id !== placeIdToRemove);
    // update the state with the modified array
    setSelectedPlacesIds(updatedSelectedPlacesIds);
  };


  const fetchPlaceDetails = async (placeId) => {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,vicinity,photos,rating&key=${GOOGLE_PLACES_API_KEY}`);
      const data = await response.json();
      setSelectedPlace(data.result);
      if (data.result.photos) {
        const images = data.result.photos.map(photo => {
          return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_PLACES_API_KEY}`;
        });
        setSelectedPlaceImages(images);
      } else {
        setSelectedPlaceImages([]);
      }
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching place details: ', error);
    }
  };


  const openPlaceDetailsModal = async (placeId) => {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=place_id,name,photos,rating,opening_hours,reviews,price_level,types,geometry,website,formatted_phone_number&key=${GOOGLE_PLACES_API_KEY}`);
      const data = await response.json();
      setSelectedPlace(data.result);
     
      // Check if photos are available
      if (data.result.photos) {
        const images = data.result.photos.map(photo => {
          return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_PLACES_API_KEY}`;
        });
        setSelectedPlaceImages(images);
      } else {
        setSelectedPlaceImages([]);
      }
   
      // Handle other fields if available
      if (data.result.price_level) {
        // Price level is available
        const priceLevel = data.result.price_level;
        // Handle price level accordingly
      }
   
      if (data.result.types) {
        // Types of place are available
        const placeTypes = data.result.types;
        // Handle types of place accordingly
      }
   
      if (data.result.geometry) {
        // Geometry is available
        const location = data.result.geometry.location;
        // Handle geometry accordingly
      }
   
      if (data.result.website) {
        // Website URL is available
        const websiteUrl = data.result.website;
        // Handle website URL accordingly
      }
   
      if (data.result.formatted_phone_number) {
        // Phone number is available
        const phoneNumber = data.result.formatted_phone_number;
        // Handle phone number accordingly
      }
   
      if (data.result.opening_hours) {
        // Opening hours are available
        const openingHours = data.result.opening_hours;
        // Handle opening hours accordingly
      }
   
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching place details: ', error);
    }
  };

// Function to handle adding a place ID to the list
const addToPlacesList = (placeId) => {
  console.log("Adding place ID:", placeId);

  setSelectedPlacesIds(prevIds => {
    const newIds = [...prevIds, placeId];
    console.log("Selected Place IDs:", newIds); // Debugging statement
    return newIds;
  });
};

const toggleConfirmedModal = () => {
  setConfirmedModalVisible(!confirmedModalVisible);
};

const handleBackDialogResponse = (option) => {
  if (option === 'Back') {
    navigation.goBack(); // Navigate back to the previous screen

  }
  // Hide the dialog box
  setShowBackDialog(false);
};

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={() => setShowBackDialog(true)}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={toggleConfirmedModal}>
          <Text style={styles.buttonText}>List</Text>
        </TouchableOpacity>
      </View> 
     <View>
        <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.pickerContainer}>
          <Text style={styles.selectedCategory}>{selectedType ? categories.find(cat => cat.value === selectedType)?.label : "All Categories"}</Text>
          {expanded ? <Text style={styles.expandIcon}>▲</Text> : <Text style={styles.expandIcon}>▼</Text>}
        </TouchableOpacity>
        {expanded &&
          <View style={styles.dropdown}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedType(category.value);
                  setExpanded(false);
                }}
                style={styles.dropdownItem}
              >
                <Text>{category.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        }
      </View>
      <CustomDialog
        visible={showBackDialog}
        title="Confirmation"
        message="Do you want to go back?"
        options={['Cancel', 'Back']}
        onSelect={handleBackDialogResponse}
      />
      <PlaceDetailsModal
        visible={modalVisible}
        place={selectedPlace}
        onClose={() => setModalVisible(false)}
        onAddToList={addToPlacesList} // Pass the function as a prop to the modal
        selectedPlacesIds={selectedPlacesIds} // Pass selectedPlacesIds as a prop
      />

      <ConfirmedDestinationListModal
        visible={confirmedModalVisible}
        onClose={toggleConfirmedModal}
        selectedPlacesIds={selectedPlacesIds}
        onRemoveDestination={handleRemoveDestination} // Pass the callback function  
      />
      
      <View style={styles.destinationListContainer}>
      {/* Your destination list component goes here */}
      <FlatList
        style={styles.flatListContainer}
        data={destinations}
        renderItem={({ item }) => (
          <ListItem
            bottomDivider
            onPress={() => {
              console.log("Place ID:", item.place_id);
              openPlaceDetailsModal(item.place_id);
            }}
          >
            <ListItem.Content>
              <ListItem.Title>{item.name}</ListItem.Title>
              <ListItem.Subtitle>{item.vicinity}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        )}
        keyExtractor={(item) => item.place_id}
      />
    </View>
    <View style={styles.navBarContainer}>
        <NavBar />
    </View>
    </View> 
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    zIndex: 1,
  },
  selectedCategory: {
    fontSize: 16,
  },
  expandIcon: {
    fontSize: 16,
  },
  dropdown: {
    position: 'absolute',
    top: 0, // Adjust as needed to position the dropdown above the picker
    left: 20,
    backgroundColor: '#fff',
    elevation: 5,
    zIndex: 5,
    overflow: 'visible', // Allow overflow
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    zIndex: 5,
  },
  destinationListContainer: {
    flex: 1,
    zIndex: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 0,
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  flatListContainer: {
    zIndex: 0,
  },
  navBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
  },
});

export default NearbyDestinationsScreen;