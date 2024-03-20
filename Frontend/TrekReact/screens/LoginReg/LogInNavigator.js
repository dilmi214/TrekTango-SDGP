import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text } from 'react-native'; // Import TouchableOpacity and Text
import LoginScreen from './LoginPage';
import ForgotPasswordScreen from './ForgotPassword';
import RegisterScreen from './RegistrationDummy';
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
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={({ navigation }) => ({
          title: '',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={{ marginLeft: 10 }}>Back</Text>
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: 'white', // Change this to your desired background color
          },
          headerTintColor: 'black', // Change this to your desired text color
        })}
      />
      <Stack.Screen
        name="Registration"
        component={RegisterScreen}
        options={{ 
          headerShown: false, 
          gestureEnabled: false 
        }} 
      />
      <Stack.Screen
        name="CreateAccountScreen"
        component={CreateAccountScreen}
        options={({ navigation }) => ({
          title: '',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={{ marginLeft: 10 }}>Back</Text>
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: 'white', // Change this to your desired background color
          },
          headerTintColor: 'black', // Change this to your desired text color
        })}
      />
    </Stack.Navigator>
  );
}

export default LogInNavigation;