import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import App from './LocationSelection';
import NearbyDestinationsScreen from './DestinationList'; // Import your second code component
import SelectStartLocationScreen from './StartLocationSetting';
import StartGameScreen from './StartGameUI';
import GameMapScreen from './MainGameUI';

const Stack = createStackNavigator();

function GameNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Location Selection "
        component={App}
        options={{ 
          headerShown: false, 
          gestureEnabled: false 
        }} 
      />
      <Stack.Screen
        name="NearbyDestinations"
        component={NearbyDestinationsScreen}
        options={{
          headerShown: false, // Hide the header for the "NearbyDestinations" screen
          gestureEnabled: false //prevents going back to previous screen by swiping
        }}
      />
      <Stack.Screen
        name="SelectStartLocationScreen"
        component={SelectStartLocationScreen}
        options={{
          headerShown: false,
          gestureEnabled: false
        }}
      />
      <Stack.Screen
        name="StartGameScreen"
        component={StartGameScreen}
        options={{ 
          headerShown: false, 
          gestureEnabled: false 
        }}
      />
      <Stack.Screen
        name="GameMapScreen"
        component={GameMapScreen}
        options={{ 
          headerShown: false, 
          gestureEnabled: false 
        }}
      />
    </Stack.Navigator>
  );
}

export default GameNavigation;
