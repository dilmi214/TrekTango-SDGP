import { baseURL } from './getIPAddress';
import React, { useState } from 'react';
import { StyleSheet, TextInput, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios'; // Import axios for making HTTP requests
import { useNavigation } from '@react-navigation/native';

const CreateAccountScreen = () => {
  // const navigation = useNavigation(); // Get navigation object
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState('');

  const navigation = useNavigation(); // Get navigation object
  

  const handleCreateAccount = async () => {
    try {
      // Check if password and confirm password match
      if (password !== confirmPassword) {
        console.error('Passwords do not match');
        return;
      }
  
      // Make a POST request to the backend endpoint
      const response = await axios.post(`${baseURL}/register`, {
        username,
        email,
        password,
        name: `${firstName} ${lastName}`, // Combine first name and last name
        dob
      });
      
      // Check if the request was successful
      if (response.status === 201) {
        console.log('User registered successfully');
        navigation.navigate('Home'); //Can also navigate to the login page (Will be prompted to rewrite username and password)
        
      } else {
        console.error('Failed to register user');
        // Handle error appropriately
      }
    } catch (error) {
      console.error('Error registering user:', error);
      // Handle error appropriately
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.createAccountText}>Create an account</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="white"
        placeholder="First Name"
        value={firstName}
        onChangeText={(text) => setFirstName(text)}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor="white"
        placeholder="Last Name"
        value={lastName}
        onChangeText={(text) => setLastName(text)}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor="white"
        placeholder="Enter email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor="white"
        placeholder="Enter username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor="white"
        placeholder="Enter password"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor="white"
        placeholder="Confirm Password"
        secureTextEntry={true}
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor="white"
        placeholder="Date of Birth (MM/DD/YYYY)"
        value={dob}
        onChangeText={(text) => setDob(text)}
      />
      <TouchableOpacity style={styles.createAccountButton} onPress={handleCreateAccount}>
        <Text style={styles.createAccountButtonText}>Create Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  createAccountText: {
    color: 'white',
    marginBottom: 16,
    fontSize: 18,
  },
  input: {
    height: 40,
    width: '100%',
    backgroundColor: '#181818',
    marginBottom: 20,
    paddingLeft: 8,
    color: 'white',
    borderRadius: 10,
  },
  createAccountButton: {
    backgroundColor: '#0F4792',
    height: 40,
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createAccountButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default CreateAccountScreen;
