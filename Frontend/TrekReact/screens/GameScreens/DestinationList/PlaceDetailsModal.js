import React, { useState } from 'react';
import { View, Modal, Text, StyleSheet, Button, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';

const PlaceDetailsModal = ({ visible, place, onClose, onAddToList, selectedPlacesIds }) => {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const GOOGLE_API_KEY = "AIzaSyCCHxfnoWl-DNhLhKcjhCTiHYNY917ltL8";
  console.log('Place ID:', place.place_id);
  console.log('Longitude:', place.geometry.location.lat);
  console.log('Latitude:', place.geometry.location.lng);

  const handleAddToList = () => {
    if (!place) return;

    const placeData = {
      place_id: place.place_id,
      name: place.name,
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng
      //can get photos, address all that from here
    };

    onAddToList(placeData);
  };

  const handleNextReview = () => {
    setCurrentReviewIndex(currentReviewIndex === place.reviews.length - 1 ? 0 : currentReviewIndex + 1);
  };

  const handlePreviousReview = () => {
    setCurrentReviewIndex(currentReviewIndex === 0 ? place.reviews.length - 1 : currentReviewIndex - 1);
  };

  if (!place) {
    return null;
  }

  return (
    <Modal visible={visible} onRequestClose={onClose} transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.placeName}>{place.name}</Text>
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
            <Text style={styles.detailsText}>Rating: {place.rating ? place.rating : "Not available"}</Text>
            <Text style={styles.detailsText}>Opening Hours: {place.opening_hours ? (
              place.opening_hours.open_now ? 'Open Now' : 'Closed'
            ) : (
              'Not available'
            )}</Text>
            <Text style={styles.detailsText}>Price Level: {place.price_level ?'$'.repeat(place.price_level) : "Currently unavailable"}</Text>
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
    height: 600,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
});

export default PlaceDetailsModal;

