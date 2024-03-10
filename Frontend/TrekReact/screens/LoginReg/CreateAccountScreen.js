import React, { useState } from 'react';
import { StyleSheet, TextInput, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CreateAccountScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleCreateAccount = () => {
    navigation.navigate('Home');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.createAccountText}>Create an account</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="white"
        placeholder="Enter email"
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