import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import App from './locationSelection';
import NearbyDestinationsScreen from './destinationList'; // Import your second code component
import SelectStartLocationScreen from './StartLocationSetting';
import StartGameScreen from './StartGameUI';
import GameMapScreen from './MainGameUI';


const Stack = createStackNavigator();

function Navigation() {
  return (
    <NavigationContainer>
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
    </NavigationContainer>
  );
}

export default Navigation;
