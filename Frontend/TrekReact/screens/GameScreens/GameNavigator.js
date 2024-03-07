import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import App from './LocationSelection';
import NearbyDestinationsScreen from './DestinationList'; // Import your second code component
import SelectStartLocationScreen from './StartLocationSetting';
import StartGameScreen from './StartGameUI';
import GameMapScreen from './MainGameUI';
import LocationSelectionScreen from './LocationSelection2';
import  RadiusSetScreen from './RadiusSet';
import SearchLocationScreen from './SearchInitialLocation';

const Stack = createStackNavigator();

function GameNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LocationSelectionScreen"
        component={LocationSelectionScreen}
        options={{ 
          headerShown: false, 
          gestureEnabled: false 
        }} 
      />
      <Stack.Screen
        name="RadiusSetScreen"
        component={RadiusSetScreen}
        options={{ 
          headerShown: false, 
          gestureEnabled: false 
        }} 
      />
      <Stack.Screen
        name="SearchLocation"
        component={SearchLocationScreen}
        options={{ 
          headerShown: false, 
          gestureEnabled: false 
        }} 
      />
      <Stack.Screen
        name="Location Selection"
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
          headerShown: false, 
          gestureEnabled: false,
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
