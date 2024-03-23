import React, {useState} from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import CustomDialog from '../../CustomComponents/CustomDialog';
import { baseURL } from '../../getIPAddress';

const StartGameScreen = ({ route }) => {
  const navigation = useNavigation();
  const { selectedPlaces, detected, confirmedStarterLocation } = route.params;
  const [showDialog, setShowDialog] = useState(false); // State to control dialog visibility

  const handleStartAdventure = () => {
    setShowDialog(true); // Show the custom dialog
  };

  const handleDialogOptionSelect = async (option) => {
    setShowDialog(false); // Hide the dialog
    if (option === 'Yes') {
      const finalDestinationList = selectedPlaces.map(place => ({
        ...place,
        completed: false,
      }));
  
      navigation.navigate('GameMapScreen', {
        finalDestinationList,
        detected,
        confirmedStarterLocation,
      });
  
      let username = ''; // Initialize username variable
      await AsyncStorage.getItem('username').then((value) => {
        username = value;
      });
  
      let userid = ''; // Initialize userid variable
      await AsyncStorage.getItem('userID').then((value) => {
        userid = value;
      });
  
      console.log('Username:', username);
      console.log('UserID:', userid);
      console.log('Final Destination List:', finalDestinationList);
  
      const response = await fetch(`${baseURL}/api/session/createSession`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userid,
          username: username,
          listOfPlaces: finalDestinationList,
        }),
      });
  
      console.log('Response Status:', response.status);
      if (response.status == 201) {
        console.log('Session Created Successfully');
      } else {
        console.error('Failed to create session');
      }
    }
  };
  
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.selectedPlaces}>Selected Destinations:</Text>
      <View style={styles.destinationList}>
        {selectedPlaces.map((destination, index) => (
          <View key={destination.place_id} style={styles.destinationItem}>
            <Text style={styles.destinationName}>📍 {destination.name}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.confirmButton} onPress={handleStartAdventure}>
        <Text style={styles.confirmButtonText}>Start the Adventure!</Text>
      </TouchableOpacity>

      {/* Custom Dialog */}
      <CustomDialog
        visible={showDialog}
        title="Confirmation"
        message="Once you start the adventure, no changes can be made. Are you sure you want to continue?"
        options={['Cancel', 'Yes']}
        onSelect={handleDialogOptionSelect}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#010C33'
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  destinationList: {
    marginTop: 10,
    width: '100%',
    paddingHorizontal: 20,
  },
  destinationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#203040',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 5,
  },
  destinationName: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
  },
  selectedPlaces: {
    color: '#FFF',
    fontSize: 25,
    paddingBottom: 25,
  },
});

export default StartGameScreen;