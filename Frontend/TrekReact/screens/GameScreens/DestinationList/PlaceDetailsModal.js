import React, { useState } from 'react';
import { View, Modal, Text, StyleSheet, Button, Image, ScrollView, Alert, TouchableOpacity } from 'react-native';

const PlaceDetailsModal = ({ visible, place, onClose, onAddToList, selectedPlacesIds }) => {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const GOOGLE_API_KEY = "AIzaSyCCHxfnoWl-DNhLhKcjhCTiHYNY917ltL8";

  const handleAddToList = () => {
    if (!place) return;

    const placeData = {
      place_id: place.place_id,
      name: place.name,
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng
    };

    const isPlaceAlreadyAdded = selectedPlacesIds.some(item => item.place_id === placeData.place_id);
    const isLimitReached = selectedPlacesIds.length >= 8;

    if (isPlaceAlreadyAdded) {
      Alert.alert("Alert", "Place is already in the list!");
    } else if (isLimitReached) {
      Alert.alert("Alert", "The limit of 8 items has been reached!");
    } else {
      onAddToList(placeData);
      Alert.alert("Success", "Place has been successfully added to the list!");
    }
  };

  const handleNextReview = () => {
    setCurrentReviewIndex(currentReviewIndex === place.reviews.length - 1 ? 0 : currentReviewIndex + 1);
  };

  const handlePreviousReview = () => {
    setCurrentReviewIndex(currentReviewIndex === 0 ? place.reviews.length - 1 : currentReviewIndex - 1);
  };

  if (!place) {
    return null; // If place is null, return null or display loading indicator
  }
return (
  <Modal visible={visible} onRequestClose={onClose} transparent={true}>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>X</Text>
    </TouchableOpacity>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.placeName}>{place && place.name}</Text>
        <Text style={styles.placeAddress}>{place.vicinity}</Text>
        {place.photos && place.photos.length > 0 && (
          <View style={styles.imageContainer}>
            <ScrollView horizontal={true}>
              <View style={styles.imageRow}>
                {place.photos.map((photo, index) => (
                  <Image
                    key={index}
                    source={{ uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_API_KEY}` }}
                    style={styles.placeImage}
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        )}
          <View style={styles.ratingContainer}>
            <Text style={styles.detailsText}>Rating: {place.rating ? place.rating : "Not available"}</Text>
          </View>
          <Text style={styles.detailsText}>Opening Hours: {place.opening_hours ? (
            place.opening_hours.open_now ? 'Open Now' : 'Closed'
          ) : (
            'Not available'
          )}</Text>
          <Text style={styles.detailsText}>Price Level: {place.price_level ? place.price_level : "Currently unavailable"}</Text>
          <Text style={styles.detailsText}>Types: {place.types ? place.types.join(", ") : "Currently unavailable"}</Text>
          <Text style={styles.detailsText}>Website: {place.website ? place.website : "Currently unavailable"}</Text>
          <Text style={styles.detailsText}>Phone Number: {place.formatted_phone_number ? place.formatted_phone_number : "Currently unavailable"}</Text>
          {place.reviews && place.reviews.length > 0 ? (
            <View style={styles.reviewsContainer}>
              <View style={styles.reviewNavigation}>
                <Button title="<" onPress={handlePreviousReview} />
                <Text style={styles.reviewsTitle}>Review {currentReviewIndex + 1} of {place.reviews.length}:</Text>
                <Button title=">" onPress={handleNextReview} />
              </View>
              {place.reviews[currentReviewIndex] && (
                <Text style={styles.reviewText}>{place.reviews[currentReviewIndex].text}</Text>
              )}
            </View>
          ) : (
            <Text style={styles.noReviewsText}>No reviews available</Text>
          )}
          </ScrollView>
          <View style={styles.buttonContainer}>
            <Button title="Add to List" onPress={handleAddToList} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
    modalContent: {
      backgroundColor: 'white',
      width: '90%',
      height: 600, // Set a fixed height here
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
  scrollView: {
    maxHeight: '100%',
  },
  placeName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  placeAddress: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  imageContainer: {
    marginBottom: 20,
  },
  imageRow: {
    flexDirection: 'row',
  },
  placeImage: {
    width: 200,
    height: 150,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  reviewNavigation: {
    flexDirection: 'row',
    alignItems: 'center', // Align items vertically
    justifyContent: 'center', // Center items horizontally
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10, // Add spacing between the components
  },
});

export default PlaceDetailsModal;