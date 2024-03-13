import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomDialog from '../CustomComponents/CustomDialog';

const StartGameScreen = ({ route }) => {
  const navigation = useNavigation();
  const { finalDestinationList } = route.params;
  const [showDialog, setShowDialog] = useState(false);

  const handleConfirm = () => {
    setShowDialog(true);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleDialogSelect = (option) => {
    setShowDialog(false);
    if (option === 'Yes') {
      navigation.navigate('GameMapScreen', { finalDestinationList });
    }
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
      <CustomDialog
        visible={showDialog}
        title="Confirmation"
        message="Are you sure you want to start the game?"
        options={['Cancel', 'Yes']}
        onSelect={handleDialogSelect}
      />
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
