import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native';
import axios from 'axios'; // Import Axios library
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignInPress = async () => {
    try {
      const response = await axios.post('http://192.168.1.2:3000/login', { // Replace 'http://your-api-url/login' with your actual API endpoint
        username: username,
        password: password
      });
      console.log(response.data); // Log the response from the server
      navigation.navigate('Home'); // Navigate to Home screen upon successful login
    } catch (error) {
      console.error(error.response.data); // Log any errors from the server
      // Handle error message here, e.g., show error message to user
    }
  };

  const handleCreateAccountPress = () => {
    navigation.navigate('CreateAccountScreen');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: 'https://i.imgur.com/uJQUEuh.png' }}
        resizeMode="contain"
        style={styles.logo}
      />
      <Text style={styles.signInText}>Sign in to continue</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="white"
        placeholder="Email"
        autoCapitalize="none"
        value={username}
        onChangeText={text => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor="white"
        placeholder="Password"
        secureTextEntry={true}
        autoCapitalize="none"
        value={password}
        onChangeText={text => setPassword(text)}
      />
      <TouchableOpacity style={styles.signInButton} onPress={handleSignInPress}>
        <Text style={styles.signInButtonText}>Sign In</Text>
      </TouchableOpacity>
      <View style={styles.space}></View>
      <View style={styles.orContainer}>
        <View style={styles.smallLine}></View>
        <Text style={styles.orText}>or</Text>
        <View style={styles.smallLine}></View>
      </View>
      <TouchableOpacity style={styles.createAccountButton} onPress={handleCreateAccountPress}>
        <Text style={styles.createAccountText}>Create an account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 16,
    paddingTop: 40, 
  },
  logo: {
    width: 243,
    height: 244,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  signInText: {
    color: 'white',
    marginBottom: 16,
    fontSize: 18,
    alignSelf: 'flex-start',
    marginLeft: 5,
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
  signInButton: {
    backgroundColor: '#0F4792',
    height: 40,
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  signInButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  space: {
    height: 20,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    marginTop: 16,
  },
  smallLine: {
    flex: 0.4,
    height: 1,
    backgroundColor: 'white',
    marginLeft: 8,
    marginRight: 8,
  },
  orText: {
    color: 'white',
  },
  createAccountButton: {
    marginTop: 16,
  },
  createAccountText: {
    color: '#8CCDF1',
  },
});

export default LoginScreen;
