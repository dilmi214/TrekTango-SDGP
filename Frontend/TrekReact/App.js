// In App.js in a new project

import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen'; // Assuming you have a HomeScreen component
import GameNavigation from './screens/GameScreens/GameNavigator';
import ProfilePage from './screens/ProfilePage';
import SocialMediaScreen from './screens/SocialMediaScreen';
import SplashScreen from './Splash';
import NavBar from './NavBar';
import ImageFeed from './screens/ImageFeed';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false, gestureEnabled: false }} 
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false, gestureEnabled: false }} 
      />
      <Stack.Screen
          name="Main"
          component={NavBar}
          options={{ headerShown: false, gestureEnabled: false }} 
      />
      <Stack.Screen
        name="Game"
        component={GameNavigation}
        options={{ headerShown: false, gestureEnabled: false }} 
      />
      <Stack.Screen
        name="Profile"
        component={ProfilePage}
        options={{ headerShown: false, gestureEnabled: false }} 
      />
      <Stack.Screen
        name="Social"
        component={ImageFeed}
        options={{ headerShown: false, gestureEnabled: false }} 
      />
    </Stack.Navigator>
  </NavigationContainer>
  );
}

export default App;