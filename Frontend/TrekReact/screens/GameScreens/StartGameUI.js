import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const StartGameScreen = ({ route }) => {
  const navigation = useNavigation();
  const { finalDestinationList } = route.params;

  const handleConfirm = () => {

    Alert.alert(
      'Confirmation',
      'Are you sure you want to start the game?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            navigation.navigate('GameMapScreen', {finalDestinationList});
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <Text>Selected Places:</Text>
      <View style={styles.destinationList}>
        {finalDestinationList.map((destination, index) => (
          <View key={destination.place_id} style={styles.destinationItem}>
            <Text style={styles.destinationText}>{destination.name}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmButtonText}>Start Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  backButtonText: {
    color: 'blue',
    fontSize: 16,
  },
  destinationList: {
    marginTop: 10,
  },
  destinationItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  destinationText: {
    fontSize: 16,
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default StartGameScreen;