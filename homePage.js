import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, TouchableOpacity, Image } from 'react-native';

const ButtonWithImage = ({ onPress, text, imageUrl }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: '#A3AED5',
        paddingVertical: 40,
        paddingHorizontal: 16,
        alignItems: 'flex-start',
        borderRadius: 25,
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
      }}
    >
      <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold' }}>{text}</Text>
      <Image source={{ uri: imageUrl }} style={{ width: 60, height: 60, resizeMode: 'contain' }} />
    </TouchableOpacity>
  );
};

const HorizontalButtonsWithText = () => {
  const buttonsData = [
    { text: 'Current Weather', imageUrl: 'https://imgur.com/amzV2ta.jpg' },
    { text: 'Ongoing Trips', imageUrl: 'https://imgur.com/LhqUR6O.jpg' },
    { text: 'Logbook', imageUrl: 'https://imgur.com/mGMqTHl.jpg' },
    { text: 'Plan the Trip', imageUrl: 'https://imgur.com/X2qhdKU.png' }, 
  ];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#010C33',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20,
        paddingBottom: 100,
      }}
    >
      <Image source={{ uri: 'https://imgur.com/uJQUEuh.jpg' }} style={{ width: 200, height: 200, resizeMode: 'contain', marginBottom: 0, marginTop: 0 }} />

      {buttonsData.map((button, index) => (
        <ButtonWithImage key={index} onPress={() => console.log(`Button ${index + 1} pressed`)} text={button.text} imageUrl={button.imageUrl} />
      ))}
    </View>
  );
};

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <HorizontalButtonsWithText />
      <StatusBar style="auto" />
    </View>
  );
};

export default App;
