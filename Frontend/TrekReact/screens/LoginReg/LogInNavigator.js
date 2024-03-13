import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginPage';
import ForgotPasswordScreen from './ForgotPassword';
import CreateAccountScreen from './CreateAccountScreen';

const Stack = createStackNavigator();

function LogInNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LogIn"
        component={LoginScreen}
        options={{ 
          headerShown: false, 
          gestureEnabled: false 
        }} 
      />
      {/* <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ 
          headerShown: false, 
          gestureEnabled: false 
        }} 
      /> */}
      {/* <Stack.Screen
        name="Registration"
        component={RegisterScreen}
        options={{ 
          headerShown: false, 
          gestureEnabled: false 
        }} 
      /> */}
      <Stack.Screen
        name="CreateAccountScreen"
        component={CreateAccountScreen}
        options={{
          headerShown: false, 
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default LogInNavigation;
