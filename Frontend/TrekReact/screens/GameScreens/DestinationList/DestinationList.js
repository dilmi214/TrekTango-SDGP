import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity, Image, ScrollView, Button, Alert, Platform } from 'react-native';
import { ListItem } from 'react-native-elements';
import PlaceDetailsModal from './PlaceDetailsModal';
import ConfirmedDestinationListModal from './confirmedDestinationListModal'; 
import Dialog from 'react-native-dialog';
import { useNavigation, useRoute } from '@react-navigation/native';
import NavBar from '../../CustomComponents/NavBar';
import CustomDialog from '../../CustomComponents/CustomDialog';
import Snackbar from '../../CustomComponents/Snackbar';
import CustomLoadingIndicator from '../../CustomComponents/CustomLoadingIndicator';
import Layout from '../../CustomComponents/ScreenLayout';


const GOOGLE_PLACES_API_KEY = "AIzaSyCCHxfnoWl-DNhLhKcjhCTiHYNY917ltL8";
// Define categories for filtering destinations
const categories = [
  { label: "All Categories", value: "all_categories" },
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

  const [destinations, setDestinations] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isPlaceDetailsModalVisible, setPlaceDetailsModalVisible] = useState(false);
  const [selectedPlacesIds, setSelectedPlacesIds] = useState([]);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isConfirmedDestinationListModalVisible, setIsConfirmedDestinationListModalVisible] = useState(false);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const [nextPageToken, setNextPageToken] = useState(null);

  useEffect(() => {
    setDestinations([]);
    setNextPageToken(null);
    fetchNearbyDestinations();
  }, [selectedType]);

  // Fetch nearby destinations based on selected category
  const fetchNearbyDestinations = async (pageToken = '') => {
    // Construct the URL for Google Places API
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${GOOGLE_PLACES_API_KEY}`;

    if (selectedType) {
      url += `&type=${selectedType}`;
    }

    if (pageToken) {
      url += `&pagetoken=${pageToken}`;
    }

    // Fetch data from the URL
    try {
      setShowLoadingIndicator(true);
      const response = await fetch(url);
      const data = await response.json();

      setNextPageToken(data.next_page_token);
      setDestinations(prevDestinations => [...prevDestinations, ...data.results]);

      // Hide loading indicator after data is fetched
      setTimeout(() => {
        setShowLoadingIndicator(false);
      }, 300);
    } catch (error) {
      console.error('Error fetching nearby destinations: ', error);
      setShowLoadingIndicator(false);
    }
  };

  // Load more data when user reaches the end of the list
  const loadMoreData = () => {
    if (nextPageToken) {
      fetchNearbyDestinations(nextPageToken);
    }
  };

  // Open modal to view details of a place
  const openPlaceDetailsModal = (place) => {
    setSelectedPlace(place);
    setPlaceDetailsModalVisible(true);
  };

  // Add a place to the list of selected destinations
  const handleAddToList = (placeData) => {
    // Check if place is already added
    const isPlaceAlreadyAdded = selectedPlacesIds.some(item => item.place_id === placeData.place_id);

    if (isPlaceAlreadyAdded) {
      setPlaceDetailsModalVisible(false);
      setSnackbarMessage('Place is already in the list!');
      setShowSnackbar(true);
      setTimeout(() => {
        setShowSnackbar(false);
      }, 1201);
    } else if (selectedPlacesIds.length >= 8) {
      setPlaceDetailsModalVisible(false);
      setSnackbarMessage('Max destination limit reached!');
      setShowSnackbar(true);
      setTimeout(() => {
        setShowSnackbar(false);
      }, 1201);
    } else {
      setSelectedPlacesIds(prevPlaces => [...prevPlaces, placeData]);
      setPlaceDetailsModalVisible(false);
      setSnackbarMessage('Destination added to list successfully!');
      setShowSnackbar(true);
      setTimeout(() => {
        setShowSnackbar(false);
      }, 1201);
    }
  };

  // Check if minimum selected places count is met before navigating to next screen
  const checkSelectedPlacesCount = () => {
    if (selectedPlacesIds.length > 3) {
      // Navigate to next screen
      navigation.navigate('SelectStartLocationScreen', { selectedPlacesIds });
    } else {
      // Show snackbar message if minimum count is not met
      setSnackbarMessage('You need to select at least three destinations.');
      setShowSnackbar(true);
      setTimeout(() => {
        setShowSnackbar(false);
      }, 1201);
    }
  };

  // Toggle visibility of confirmed destination list modal
  const toggleConfirmedDestinationListModal = () => {
    setIsConfirmedDestinationListModalVisible(!isConfirmedDestinationListModalVisible);
  };

  // Remove a destination from the selected list
  const handleRemoveDestination = (placeId) => {
    setSelectedPlacesIds(prevSelectedPlacesIds => prevSelectedPlacesIds.filter(item => item.place_id !== placeId));
  };

  return (
    <Layout>
      <View style={styles.container}>
        //Header with navigation and actions
        <View style={styles.header}>
          <TouchableOpacity style={styles.button} onPress={() => setShowBackDialog(true)}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setExpanded(!expanded)}>
            <Text style={styles.buttonText}>Categories</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleConfirmedDestinationListModal}>
            <Text style={styles.buttonText}>Edit List</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={checkSelectedPlacesCount}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>

        //Display categories for filtering
        {expanded && (
          <View style={styles.categories}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedType(category.value);
                  setExpanded(false);
                }}
                style={styles.categoryItem}
              >
                <Text style={styles.categoryText}>{category.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        // List of nearby destinations 
        {destinations.length > 0 ? (
          <FlatList
            data={destinations}
            renderItem={({ item }) => {
              const firstPhoto = item.photos ? item.photos[0] : null;
              const photoUrl = firstPhoto ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${firstPhoto.photo_reference}&key=${GOOGLE_PLACES_API_KEY}` : null;

              return (
                <TouchableOpacity onPress={() => openPlaceDetailsModal(item)}>
                  <View style={styles.listItemContainer}>
                    {photoUrl ? (
                      <Image
                        source={{ uri: photoUrl }}
                        style={styles.listItemImage}
                      />
                    ) : (
                      <Image
                        source={require('../../CustomComponents/ImgUnavailable.png')}
                        style={styles.listItemImage}
                      />
                    )}
                    <View style={styles.listItemContent}>
                      <Text style={styles.listItemTitle}>{item.name}</Text>
                      <Text style={styles.listItemDescription}>Type: {item.types.join(', ')}</Text>
                      <Text style={styles.listItemDescription}>Rating: {item.rating || 'N/A'}</Text>
                      <Text style={styles.listItemDescription}>Open Now: {item.opening_hours && item.opening_hours.open_now ? 'Yes' : 'No'}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item.place_id}
            onEndReachedThreshold={0.9} // call loadMoreData when close to the end
            onEndReached={loadMoreData}
          />
        ) : (
          <Text style={styles.noPlacesText}>No places available in this category</Text>
        )}

        //Show loading indicator while fetching data
        {showLoadingIndicator && <CustomLoadingIndicator />}

        //Show snackbar for notifications
        {showSnackbar && (
          <Snackbar
            visible={showSnackbar}
            message={snackbarMessage}
            duration={1200}
            action={{ label: 'Dismiss', onPress: () => setShowSnackbar(false) }}
          />
        )}

        //Modal for viewing place details
        {isPlaceDetailsModalVisible && (
          <PlaceDetailsModal
            visible={isPlaceDetailsModalVisible}
            place={selectedPlace}
            onClose={() => setPlaceDetailsModalVisible(false)}
            onAddToList={handleAddToList}
            selectedPlacesIds={selectedPlacesIds}
          />
        )}

        //Modal for confirmed destination list
        {isConfirmedDestinationListModalVisible && (
          <ConfirmedDestinationListModal
            visible={isConfirmedDestinationListModalVisible}
            onClose={toggleConfirmedDestinationListModal}
            selectedPlacesIds={selectedPlacesIds}
            onRemoveDestination={handleRemoveDestination}
          />
        )}
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010C33',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 20,
    marginTop: 80,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  categories: {
    marginBottom: 20,
  },
  categoryItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
    borderRadius: 5,
    marginHorizontal: 20,
    marginVertical: 8,
    elevation: 5,
  },
  categoryText: {
    color: '#FFF',
    textAlign:'center',
  },
  listItemImage: {
    width: 110,
    height: 150,
    borderRadius: 5, 
    marginRight: 15, 
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#0056b3', 
    borderRadius: 10, 
    marginBottom: 15, 
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  listItemDescription: {
    color: '#ccc',
  },
  noPlacesText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default NearbyDestinationsScreen;