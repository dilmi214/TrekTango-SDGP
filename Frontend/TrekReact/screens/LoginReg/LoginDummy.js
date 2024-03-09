import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();

  const handleLoginPress = () => {
    navigation.navigate('Home')
  };

  const handleForgotPasswordPress = () => {
    navigation.navigate('ForgotPassword')
  };

  const handleRegisterPress = () => {
    navigation.navigate('Registration')
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>Log In</Text>
        <TouchableOpacity onPress={handleForgotPasswordPress}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRegisterPress}>
          <Text style={styles.forgotPassword}>No account? Create Account</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
        <Text style={styles.loginButtonText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  forgotPassword: {
    fontSize: 16,
    color: 'blue',
  },
  loginButton: {
    backgroundColor: 'blue',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
