import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity, Image, ScrollView, Button, Alert } from 'react-native';
import { ListItem } from 'react-native-elements';
import PlaceDetailsModal from './PlaceDetailsModal';
import ConfirmedDestinationListModal from './confirmedDestinationListModal'; 
import Dialog from 'react-native-dialog';
import { useNavigation, useRoute } from '@react-navigation/native';
import NavBar from '../../CustomComponents/NavBar';
import CustomDialog from '../../CustomComponents/CustomDialog';
import Snackbar from '../../CustomComponents/Snackbar';
import CustomLoadingIndicator from '../../CustomComponents/CustomLoadingIndicator';


const GOOGLE_PLACES_API_KEY = "AIzaSyCCHxfnoWl-DNhLhKcjhCTiHYNY917ltL8";

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
  
  const route = useRoute();
  const { longitude, latitude, radius } = route.params;
  const navigation = useNavigation();

  const [destinations, setDestinations] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [showBackDialog, setShowBackDialog] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isPlaceDetailsModalVisible, setPlaceDetailsModalVisible] = useState(false);
  const [selectedPlacesIds, setSelectedPlacesIds] = useState([]);
  const [showSnackbar, setShowSnackbar] = useState(false); 
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isConfirmedDestinationListModalVisible, setIsConfirmedDestinationListModalVisible] = useState(false); // New state for modal visibility
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const [nextPageToken, setNextPageToken] = useState(null);

  const allowedPlaceTypes = [
    "tourist_attraction",
    "restaurant_cafe",
    "shopping_mall|store",
    "park|amusement_park|bowling_alley|stadium|zoo|parking",
    "church|hindu_temple|mosque|synagogue", 
    "movie_theater|night_club|casino", 
    "museum",
    "hotel|lodging" 
  ];

  useEffect(() => {
    setDestinations([]); // reset destinations on category change
    setNextPageToken(null); // reset nextPageToken for pagination if possible
    fetchNearbyDestinations();
  }, [selectedType]);

  const fetchNearbyDestinations = async (pageToken = '') => { 
    
    try {
      setShowLoadingIndicator(true); 
      let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&key=${GOOGLE_PLACES_API_KEY}`;

      if (selectedType) {
        if (selectedType === "all_categories") { 
          url += `&type=${allowedPlaceTypes.join("|")}`; 
        } else {
          url += `&type=${selectedType}`;
        }
      }
      
      if (selectedType) {
        if (selectedType === "restaurant_cafe") {
          url += `&type=restaurant|cafe`;
        } else {
          url += `&type=${selectedType}`;
        }
      }

      if (pageToken) {
        url += `&pagetoken=${pageToken}`; // pageToken for pagination
      }

      const response = await fetch(url);
      const data = await response.json();

      setNextPageToken(data.next_page_token); // update nextPageToken
      setDestinations(prevDestinations => [...prevDestinations, ...data.results]); //append results

      setTimeout(() => {
        setShowLoadingIndicator(false); 
      }, 300); 
    } catch (error) {
      console.error('Error fetching nearby destinations: ', error);
      setShowLoadingIndicator(false);
    }
  };

    // load more data when user reaches the end of the list
    const loadMoreData = () => {
      if (nextPageToken) {
        fetchNearbyDestinations(nextPageToken); // fetch more results using nextPageToken
      }
    };
  
  const handleBackDialogResponse = (option) => {
    if (option === 'Yes') {
      navigation.goBack();
    }
    setShowBackDialog(false);
  };

  const openPlaceDetailsModal = (place) => {
    setSelectedPlace(place);
    setPlaceDetailsModalVisible(true);
  };

  const handleAddToList = (placeData) => {
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
  
  const checkSelectedPlacesCount = () => {
    if (selectedPlacesIds.length > 3) {
      navigation.navigate('SelectStartLocationScreen', { selectedPlacesIds });
    } else {
      setSnackbarMessage('You need to select at least three destinations.');
      setShowSnackbar(true);
      setTimeout(() => {
        setShowSnackbar(false);
      }, 1201); 
    }
  };

  const toggleConfirmedDestinationListModal = () => {
    setIsConfirmedDestinationListModalVisible(!isConfirmedDestinationListModalVisible);
  };

  const handleRemoveDestination = (placeId) => {
    setSelectedPlacesIds(prevSelectedPlacesIds => prevSelectedPlacesIds.filter(item => item.place_id !== placeId));
  };

  return (
    <View style={styles.container}>
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
              <Text>{category.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {destinations.length > 0 ? (
     <FlatList
     data={destinations}
     renderItem={({ item }) => {
       const firstPhoto = item.photos ? item.photos[0] : null;
       const photoUrl = firstPhoto ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${firstPhoto.photo_reference}&key=${GOOGLE_PLACES_API_KEY}` : null;
       return (
         <ListItem
           bottomDivider
           onPress={() => openPlaceDetailsModal(item)}
         >
           <ListItem.Content>
             <ListItem.Title>{item.name}</ListItem.Title>
             {photoUrl ? (
               <Image
                 source={{ uri: photoUrl }}
                 style={{ width: 50, height: 50 }} 
               />
             ) : (
              <Image
              source={require('../../CustomComponents/ImgUnavailable.png')}
              style={{ width: 50, height: 50 }} 
            />
             )}
           </ListItem.Content>
         </ListItem>
       );
     }}
     keyExtractor={(item) => item.place_id}
     onEndReachedThreshold={0.9} // call loadMoreData when close to the end
     onEndReached={loadMoreData} 
   />
      ) : (
        <Text>No places available in this category</Text>
      )}
      <CustomDialog
        visible={showBackDialog}
        title="Confirmation"
        message="Do you want to go back?"
        options={['Yes', 'No']}
        onSelect={handleBackDialogResponse}
      />
      {showLoadingIndicator && <CustomLoadingIndicator />}
      {showSnackbar && (
        <Snackbar
          visible={showSnackbar}
          message={snackbarMessage}
          duration={1200}
          action={{ label: 'Dismiss', onPress: () => setShowSnackbar(false) }}
        />
      )}
      {isPlaceDetailsModalVisible && (
          <PlaceDetailsModal
            visible={isPlaceDetailsModalVisible}
            place={selectedPlace}
            onClose={() => setPlaceDetailsModalVisible(false)}
            onAddToList={handleAddToList}
            selectedPlacesIds={selectedPlacesIds}
        />
      )}
       {isConfirmedDestinationListModalVisible && (
        <ConfirmedDestinationListModal
          visible={isConfirmedDestinationListModalVisible}
          onClose={toggleConfirmedDestinationListModal}
          selectedPlacesIds={selectedPlacesIds}
          onRemoveDestination={handleRemoveDestination}
        />
      )}
      <View style={styles.navBarContainer}>
        <NavBar />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 70,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
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
  categories: {
    marginBottom: 20,
  },
  categoryItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
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

export default NearbyDestinationsScreen;