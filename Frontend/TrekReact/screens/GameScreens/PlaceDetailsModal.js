import React, { useState } from 'react';
import { View, Modal, Text, StyleSheet, Button, Image, ScrollView, TouchableWithoutFeedback, PanResponder, Animated, Alert } from 'react-native';

const PlaceDetailsModal = ({ visible, place, onClose, onAddToList, selectedPlacesIds }) => {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const panY = React.useRef(new Animated.Value(0)).current;
  const maxContentHeight = 500; //height of modal

  const handlePanResponderMove = (_, gestureState) => {
    Animated.event([null, { dy: panY }], { useNativeDriver: false })(_, gestureState);
  };

  const handlePanResponderRelease = (_, gestureState) => {
    if (gestureState.dy > 50) {
      onClose();
    } else {
      Animated.spring(panY, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
    }
  };

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: handlePanResponderMove,
        onPanResponderRelease: handlePanResponderRelease,
      }),
    [handlePanResponderMove, handlePanResponderRelease]
  );

  const handleAddToList = () => {
    const placeData = {
      place_id: place.place_id,
      name: place.name,
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng
    };

    
  
    // Check if the place object is already in the array
    const isPlaceAlreadyAdded = selectedPlacesIds.some(item => item.place_id === placeData.place_id);
  
    // Check if the array has more than 8 items
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
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[styles.modalContainer, { transform: [{ translateY: panY }] }]}
        {...panResponder.panHandlers}
      >
        <ScrollView style={[styles.modalContent, { maxHeight: maxContentHeight }]}>
          <Text style={styles.placeName}>{place && place.name}</Text>
          <Text style={styles.placeAddress}>{place.vicinity}</Text>
          {place.photos && place.photos.length > 0 && (
            <ScrollView horizontal style={styles.imageContainer}>
              {place.photos.map((photo, index) => (
                <Image
                  key={index}
                  source={{ uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=AIzaSyCCHxfnoWl-DNhLhKcjhCTiHYNY917ltL8` }}
                  style={styles.placeImage}
                />
              ))}
            </ScrollView>
          )}
         
          <View style={styles.ratingContainer}>
            <Text style={styles.detailsText}>Rating: {place.rating ? place.rating : "Not available"}</Text>
          </View>
          <Text style={styles.detailsText}>Opening Hours: {place.opening_hours ? (
            place.opening_hours.open_now ? 'Open Now' : 'Closed'
          ) : (
            'Not available'
          )}</Text>
          <Text style={styles.detailsText}>Price Level: {place.price_level ? place.price_level : "Not available"}</Text>          
          <Text style={styles.detailsText}>Types: {place.types ? place.types.join(", ") : "Not available"}</Text>
          {/*<Text style={styles.detailsText}>Geometry: {place.geometry ? JSON.stringify(place.geometry) : "Not available"}</Text>
          <Text style={styles.detailsText}>Place id: {place.place_id ? place.place_id : "Not available"}</Text>*/}
          <Text style={styles.detailsText}>Website: {place.website ? place.website : "Not available"}</Text>
          <Text style={styles.detailsText}>Phone Number: {place.formatted_phone_number ? place.formatted_phone_number : "Not available"}</Text>
          {place.reviews && place.reviews.length > 0 ? (
            <View style={styles.reviewsContainer}>
              <View style={styles.reviewNavigation}>
                <Button title="<" onPress={handlePreviousReview} />
                <Button title=">" onPress={handleNextReview} />
              </View>
              <Text style={styles.reviewsTitle}>Review {currentReviewIndex + 1} of {place.reviews.length}:</Text>
              {place.reviews[currentReviewIndex] && (
                <Text style={styles.reviewText}>{place.reviews[currentReviewIndex].text}</Text>
              )}
            </View>
          ) : (
            <Text style={styles.noReviewsText}>No reviews available</Text>
          )}
          <Button title="Add to List" onPress={handleAddToList} />
          <Button title="Close" onPress={onClose} />
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
    
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
  placeImage: {
    width: 200,
    height: 150,
    marginRight: 10,
    borderRadius: 10,
  },
  ratingContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsText: {
    fontSize: 16,
    marginBottom: 10,
  },
  reviewsContainer: {
    marginBottom: 20,
  },
  reviewsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reviewText: {
    fontSize: 16,
    marginBottom: 5,
  },
  reviewNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  noReviewsText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666',
  },
});

export default PlaceDetailsModal;
